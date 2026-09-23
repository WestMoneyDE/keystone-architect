---
{"id": "KB-0398", "title": "Controller und Operatoren", "domain": "16", "sequence": 20, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0383", "concepts": ["Kubernetes Control Plane"], "needed_for": "understanding"}, {"id": "KB-0113", "concepts": ["Idempotenz als Systemgarantie"], "needed_for": "understanding"}], "related": ["KB-0386"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine einfache Kontrollschleife implementieren, die eine benutzerdefinierte Ressource überwacht und deren Statusbedingungen bei erfolgreicher oder fehlgeschlagener Reconciliation aktualisiert.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Einen Operator so gestalten, dass seine Reconciliation-Logik idempotent ist und Ownership-Referenzen sowie Finalizer korrekt für eine geordnete Ressourcenlöschung verwendet werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine hängende Ressourcenlöschung auf einen nicht abgeschlossenen Finalizer statt auf ein allgemeines Cluster-Problem zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Idempotente Reconciliation-Logik mit korrekter Finalizer-Behandlung als verpflichtenden Standard für jeden im Unternehmen entwickelten Operator etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene Operator-Frameworks (z. B. Kubebuilder, Operator SDK) im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis von Reconciliation, Ownership und Finalizern als Konzepte, nicht ein spezifisches Entwicklungsframework."}}, "lab_validation": [{"lab_id": "KB-0398-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simulierte Kontrollschleife mit einer hängenden Ressourcenlöschung aufgrund eines nicht abgeschlossenen Finalizers", "evidence": "Eine simulierte Ressourcenlöschung bleibt korrekt hängen, solange ein registrierter Finalizer seine Aufräumarbeit (z. B. Löschen einer externen Ressource) nicht abgeschlossen und sich selbst nicht entfernt hat; erst nach Abschluss der Finalizer-Logik und deren Entfernung wird die Ressource tatsächlich gelöscht.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, künstlich vereinfachtes Finalizer-Modell."}]}
---
# Controller und Operatoren

> **Ziel:** Ein Controller (siehe die Kontrollschleifen-Grundlagen in [KB-0383](05-kubernetes-control-plane.md)) implementiert Reconciliation (den kontinuierlichen Abgleich zwischen deklariertem Soll-Zustand und beobachtetem Ist-Zustand). Ein Operator erweitert dieses Muster um anwendungsspezifisches Domänenwissen, oft für zustandsbehaftete Anwendungen (siehe StatefulSet-Grundlagen, [KB-0386](08-statefulsets-und-stabile-identitaet.md)). Der zentrale Punkt dieses Kapitels ist, dass Reconciliation-Logik zwingend idempotent gestaltet sein muss (aufbauend auf [KB-0113](../05-distributed-systems/13-idempotenz-als-systemgarantie.md)), und dass Ownership-Referenzen und Finalizer korrekte, geordnete Ressourcenlöschung ermöglichen — ein nicht abgeschlossener Finalizer ist eine häufige, aber diagnostizierbare Ursache für eine hängende Löschung.

## Zweck, Mental Model und Dependencies

Reconciliation bedeutet, dass ein Controller wiederholt (bei jeder relevanten Zustandsänderung, aber auch periodisch) denselben Vergleichs- und Korrekturprozess durchläuft: beobachte den aktuellen Zustand, vergleiche ihn mit dem deklarierten Soll-Zustand, führe bei Abweichung eine Korrekturaktion durch. Da derselbe Reconciliation-Durchlauf potenziell mehrfach für denselben Zustand ausgeführt wird (z. B. durch mehrere, sich überschneidende Watch-Ereignisse), muss diese Logik zwingend idempotent sein: ein wiederholter Durchlauf mit unverändertem Zustand darf keine kumulierten, unerwünschten Effekte erzeugen (z. B. darf ein Reconciliation-Durchlauf, der eine Ressource "erstellt, falls sie nicht existiert", nicht bei jedem Durchlauf eine neue Ressource erzeugen, wenn die vorherige bereits existiert). Ownership-Referenzen verknüpfen eine abgeleitete Ressource (z. B. ein von einem Deployment erzeugtes ReplicaSet) mit ihrer erzeugenden Ressource, sodass Kubernetes bei Löschung der übergeordneten Ressource automatisch auch die abgeleiteten Ressourcen entfernen kann (Cascading Deletion). Ein Finalizer ist ein expliziter Marker an einer Ressource, der verhindert, dass diese Ressource tatsächlich aus etcd entfernt wird, bevor eine registrierte Aufräumlogik (z. B. das Löschen einer externen, außerhalb des Clusters liegenden Ressource, die von diesem Kubernetes-Objekt verwaltet wird) tatsächlich abgeschlossen wurde. Der zentrale, oft übersehene Diagnosepunkt ist: eine Ressource, die auf einen Löschbefehl nicht reagiert und dauerhaft im Zustand "wird gelöscht" (mit einem gesetzten deletionTimestamp) verbleibt, hängt meist an einem nicht abgeschlossenen Finalizer — der zugehörige Controller muss seine Aufräumlogik erfolgreich abschließen und den Finalizer explizit von der Ressource entfernen, bevor die tatsächliche Löschung stattfinden kann.

~~~text
Reconciliation: repeated compare-and-correct loop -- observe state, compare to desired, correct on mismatch
  runs potentially MULTIPLE TIMES for the same state (overlapping watch events) -> MUST be idempotent
  (e.g. "create resource if it doesn't exist" must NOT create duplicates on repeated runs)
Ownership references: link a derived resource (e.g. ReplicaSet created BY a Deployment) to its creator
  -> enables CASCADING DELETION: deleting the parent auto-removes derived resources
Finalizer: explicit marker preventing ACTUAL removal from etcd until registered cleanup logic completes
  (e.g. deleting an EXTERNAL resource outside the cluster that this object manages)
KEY DIAGNOSTIC POINT: a resource stuck indefinitely in "being deleted" (deletionTimestamp set) 
  -> USUALLY a finalizer whose cleanup never completed and was never removed
  -> the responsible controller must finish its cleanup AND explicitly remove the finalizer before actual deletion proceeds
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Häufiger Diagnosefehler |
|---|---|---|
| Reconciliation | kontinuierlicher Soll-/Ist-Abgleich | nicht-idempotente Logik erzeugt kumulierte Effekte bei wiederholten Durchläufen |
| Ownership-Referenzen | verknüpft abgeleitete mit erzeugender Ressource | fehlende Referenzen verhindern automatische Cascading Deletion |
| Finalizer | verzögert tatsächliche Löschung bis Aufräumlogik abgeschlossen | nicht abgeschlossene oder nicht entfernte Finalizer verursachen dauerhaft hängende Löschungen |
| Statusbedingungen | machen den Reconciliation-Fortschritt sichtbar | fehlende oder ungenaue Statusbedingungen erschweren die Diagnose von Reconciliation-Fehlern |

Implementierung: Jede Reconciliation-Funktion wird explizit so implementiert, dass sie bei jedem Zustand (nicht nur beim ersten Durchlauf) sicher wiederholt ausgeführt werden kann, typischerweise durch Prüfung des tatsächlichen Ist-Zustands vor jeder Korrekturaktion, statt blind eine Aktion auszuführen. Für Ressourcen, die externe, außerhalb des Clusters liegende Abhängigkeiten verwalten (z. B. eine Cloud-Datenbankinstanz), wird ein Finalizer registriert, der sicherstellt, dass diese externe Ressource tatsächlich bereinigt wird, bevor das Kubernetes-Objekt selbst gelöscht wird. Statusbedingungen werden nach jedem Reconciliation-Durchlauf aktualisiert, um den aktuellen Fortschritt (z. B. "Ready", "Progressing", "Failed") transparent zu machen. Bei einer hängenden Ressourcenlöschung wird zuerst geprüft, ob noch Finalizer an der Ressource registriert sind, und ob der zugehörige Controller seine Aufräumlogik tatsächlich erfolgreich abgeschlossen hat.

## Scalability, Reliability, Security und Observability

Idempotente Reconciliation-Logik skaliert Zuverlässigkeit unabhängig von der Häufigkeit überlappender oder wiederholter Watch-Ereignisse; die Reliability-Grenze liegt darin, dass eine fehlerhafte, nicht abschließende Finalizer-Logik proportional zur Anzahl betroffener Ressourcen zu einer wachsenden Zahl dauerhaft hängender Löschvorgänge führen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Ressource verbleibt dauerhaft im Zustand "wird gelöscht" | ein registrierter Finalizer hat seine Aufräumlogik nicht abgeschlossen oder sich nicht selbst entfernt | die registrierten Finalizer der betroffenen Ressource und die Logs des zuständigen Controllers prüfen |
| ein Reconciliation-Durchlauf erzeugt bei wiederholter Ausführung mehrfach dieselbe Ressource | die Reconciliation-Logik ist nicht idempotent und prüft nicht, ob die Ressource bereits existiert | die Reconciliation-Logik um eine explizite Existenzprüfung vor jeder Erstellungsaktion ergänzen |
| das Löschen einer übergeordneten Ressource entfernt nicht automatisch ihre abgeleiteten Ressourcen | fehlende Ownership-Referenzen zwischen der übergeordneten und den abgeleiteten Ressourcen | die Ownership-Referenzen bei der Erstellung abgeleiteter Ressourcen explizit setzen |

Security: Ein Operator mit übermäßig privilegiertem Service Account (siehe [KB-0392](14-rbac-und-service-accounts.md)) kann bei fehlerhafter Reconciliation-Logik weitreichenden, unbeabsichtigten Schaden anrichten; Least-Privilege-Prinzipien gelten auch für Operatoren. Observability: Statusbedingungen jeder verwalteten Ressource, die Anzahl hängender Löschungen aufgrund nicht abgeschlossener Finalizer, und die Reconciliation-Fehlerrate über die Zeit sind zentrale Operator-Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert explizit idempotente Reconciliation-Logik mit korrekter Ownership-Referenz- und Finalizer-Behandlung. **Principal** macht Statusbedingungen und Reconciliation-Fortschritt für das Team nachvollziehbar. **Chief** etabliert idempotente Reconciliation-Logik mit korrekter Finalizer-Behandlung als verpflichtenden Standard für jeden im Unternehmen entwickelten Operator.

Anti-Patterns: eine Reconciliation-Funktion implementieren, die bei wiederholter Ausführung kumulierte, nicht-idempotente Effekte erzeugt; einen Finalizer registrieren, dessen Aufräumlogik nicht garantiert abgeschlossen und entfernt wird; Ownership-Referenzen bei abgeleiteten Ressourcen weglassen, wodurch Cascading Deletion nicht funktioniert.

## Production Checklist

- [ ] Jede Reconciliation-Funktion ist nachweislich idempotent gegenüber wiederholter Ausführung.
- [ ] Abgeleitete Ressourcen besitzen korrekte Ownership-Referenzen für Cascading Deletion.
- [ ] Finalizer-Logik ist so gestaltet, dass sie garantiert abschließt und sich selbst entfernt.
- [ ] Statusbedingungen werden nach jedem Reconciliation-Durchlauf aktuell gehalten.

## Interviewfragen

### 1. Was bedeutet Reconciliation, und warum muss sie idempotent sein?

**Antwort:** Der kontinuierliche Abgleich zwischen deklariertem Soll- und beobachtetem Ist-Zustand; da derselbe Durchlauf potenziell mehrfach für denselben Zustand ausgeführt wird, muss er idempotent sein, um kumulierte, unerwünschte Effekte zu vermeiden.

### 2. Was ist ein Finalizer, und welches Problem löst er?

**Antwort:** Ein expliziter Marker, der verhindert, dass eine Ressource tatsächlich entfernt wird, bevor eine registrierte Aufräumlogik (z. B. das Löschen einer externen Ressource) abgeschlossen wurde.

### 3. Warum bleibt eine Ressource oft dauerhaft im Zustand "wird gelöscht" hängen?

**Antwort:** Meist weil ein registrierter Finalizer seine Aufräumlogik nicht abgeschlossen oder sich nicht selbst von der Ressource entfernt hat.

### 4. Was ermöglichen Ownership-Referenzen zwischen Ressourcen?

**Antwort:** Cascading Deletion — beim Löschen einer übergeordneten Ressource werden automatisch auch ihre abgeleiteten Ressourcen entfernt.

### 5. Wie gehst du vor, wenn eine Ressource dauerhaft im Löschzustand hängt?

**Antwort:** Ich prüfe die an der Ressource registrierten Finalizer und die Logs des zuständigen Controllers, um festzustellen, ob dessen Aufräumlogik erfolgreich abgeschlossen und der Finalizer entfernt wurde.

### 6. Widersprüchliche Anforderung: Team will schnelle, unkomplizierte Ressourcenlöschung UND garantiert vollständige Bereinigung externer Abhängigkeiten — wie gehst du vor?

**Antwort:** Ich würde einen Finalizer mit einer zuverlässigen, zeitlich begrenzten Aufräumlogik implementieren, die externe Abhängigkeiten automatisch und schnell bereinigt, sodass die Löschung für den Nutzer unkompliziert erscheint, während im Hintergrund garantiert ist, dass keine verwaisten externen Ressourcen zurückbleiben.

## Praktische Labs

~~~python
class SimulatedResource:
    def __init__(self, name):
        self.name = name
        self.finalizers = []
        self.deletion_requested = False
        self.actually_deleted = False

class SimulatedController:
    def __init__(self):
        self.external_resources_cleaned = set()

    def register_finalizer(self, resource, finalizer_name):
        resource.finalizers.append(finalizer_name)

    def request_deletion(self, resource):
        resource.deletion_requested = True

    def reconcile_deletion(self, resource):
        if not resource.deletion_requested:
            return
        if "cleanup-external-db" in resource.finalizers:
            # Idempotent cleanup: safe to call multiple times
            self.external_resources_cleaned.add(resource.name)
            resource.finalizers.remove("cleanup-external-db")
        if not resource.finalizers:
            resource.actually_deleted = True

controller = SimulatedController()
resource = SimulatedResource("my-managed-db")
controller.register_finalizer(resource, "cleanup-external-db")
controller.request_deletion(resource)

print(f"After deletion requested, before reconciliation: actually_deleted={resource.actually_deleted} (stuck, as expected)")
controller.reconcile_deletion(resource)
print(f"After controller completes finalizer cleanup: actually_deleted={resource.actually_deleted}")
print(f"External resource cleaned up: {'my-managed-db' in controller.external_resources_cleaned}")
~~~

## Dependencies, Cross-References und Quellen

1. Kubernetes-Dokumentation: [Custom Resources — Using Finalizers](https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/), abgerufen 2026-09-17.
2. Kubernetes-Dokumentation: [Owners and Dependents](https://kubernetes.io/docs/concepts/architecture/garbage-collection/), abgerufen 2026-09-17.

Kubernetes Control Plane ist kanonisch in [KB-0383](05-kubernetes-control-plane.md) behandelt; Idempotenz als Systemgarantie in [KB-0113](../05-distributed-systems/13-idempotenz-als-systemgarantie.md); StatefulSets und stabile Identität in [KB-0386](08-statefulsets-und-stabile-identitaet.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte Operator-Entwicklungsframeworks (Kubebuilder, Operator SDK), die Reconciliation-Boilerplate reduzieren | Adopting | Gegenüber vollständig manuell implementierten Controllern für konsistentere, weniger fehleranfällige Reconciliation-Logik bevorzugen. |
| Automatisierte Finalizer-Timeout-Erkennung, die hängende Aufräumlogik proaktiv meldet | Evaluating | Gegenüber reiner manueller Überwachung abwägen, sobald ein zuverlässiges Erkennungswerkzeug für die konkrete Operator-Landschaft verfügbar ist. |

Ein Team akzeptiert einen Operator erst, wenn seine Reconciliation-Logik nachweislich idempotent ist und Finalizer garantiert abschließen.
