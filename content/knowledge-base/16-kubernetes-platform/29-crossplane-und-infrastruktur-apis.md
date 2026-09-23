---
{"id": "KB-0407", "title": "Crossplane und Infrastruktur-APIs", "domain": "16", "sequence": 29, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0399", "concepts": ["Custom Resource Definitions"], "needed_for": "understanding"}, {"id": "KB-0398", "concepts": ["Controller und Operatoren"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Managed Resource für eine externe Cloud-Ressource über Crossplane deklarieren und deren Provisionierung sowie Löschverhalten beim Entfernen der Ressource beobachten.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Composition gestalten, die mehrere zusammengehörige Cloud-Ressourcen als eine vereinfachte, teamfreundliche Plattform-API bereitstellt, ohne die zugrunde liegende Provider-Komplexität offenzulegen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein fehlgeschlagenes Löschen einer Managed Resource auf eine noch bestehende, nicht bereinigte externe Cloud-Ressource statt auf ein allgemeines Crossplane-Problem zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Strikt begrenzte Provider-Credentials und explizit geprüftes Löschverhalten als verpflichtenden Standard für Crossplane-basierte Infrastruktur-APIs im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene, providerspezifische Composition-Funktionen im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis von Managed Resources, Compositions und Credential-/Löschverhalten-Grenzen, nicht providerspezifische Implementierungsdetails."}}, "lab_validation": [{"lab_id": "KB-0407-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal beschriebener Crossplane-Workflow anhand offizieller Dokumentation, kein aktiver Cluster verwendet", "evidence": "Anhand der offiziellen Crossplane-Dokumentation wird der Ablauf von Managed-Resource-Deklaration, Provider-Provisionierung und dem finalizer-basierten Löschverhalten nachvollzogen, das sicherstellt, dass eine externe Cloud-Ressource tatsächlich entfernt wird, bevor das zugehörige Kubernetes-Objekt gelöscht wird.", "limitations": "Keine reale Ausführung gegen einen produktiven Cloud-Anbieter oder Kubernetes-Cluster."}]}
---
# Crossplane und Infrastruktur-APIs

> **Ziel:** Crossplane erweitert Kubernetes um Managed Resources (deklarative Kubernetes-Objekte, die tatsächliche externe Cloud-Ressourcen wie Datenbanken oder Netzwerke repräsentieren, aufbauend auf CRD-Grundlagen, siehe [KB-0399](21-custom-resource-definitions.md)) und Compositions (die mehrere Managed Resources zu einer vereinfachten, teamfreundlichen Plattform-API bündeln), umgesetzt über Provider-Controller (siehe die allgemeinen Controller-Grundlagen, [KB-0398](20-controller-und-operatoren.md)). Der zentrale Punkt dieses Kapitels ist die praktische Kontrolle zweier kritischer Aspekte: das Löschverhalten (wird eine externe Cloud-Ressource beim Löschen des Kubernetes-Objekts tatsächlich zuverlässig entfernt?) und die Credential-Grenzen (welche Provider-Zugangsdaten mit welchem Berechtigungsumfang Crossplane tatsächlich verwendet).

## Zweck, Mental Model und Dependencies

Eine Managed Resource ist ein Kubernetes-Objekt, das eine tatsächliche, außerhalb des Clusters liegende Cloud-Ressource (z. B. eine verwaltete Datenbankinstanz, ein virtuelles Netzwerk) repräsentiert — Crossplane-Provider-Controller reagieren auf dieses Objekt (analog zum allgemeinen Reconciliation-Muster) und provisionieren, aktualisieren oder löschen die tatsächliche externe Ressource entsprechend dem deklarierten Zustand. Eine Composition abstrahiert mehrere zusammengehörige Managed Resources (z. B. eine Datenbank plus die zugehörige Netzwerkkonfiguration plus die notwendigen IAM-Berechtigungen) zu einer einzigen, vereinfachten, teamfreundlichen Plattform-API, sodass ein Anwendungsteam eine komplexe Infrastrukturanforderung über eine einzige, einfache Ressourcenanforderung stellen kann, ohne die zugrunde liegende Provider-Komplexität selbst verwalten zu müssen. Der zentrale, praktisch kritische Punkt ist das Löschverhalten: da eine Managed Resource eine reale, kostenpflichtige oder datenhaltende externe Ressource repräsentiert, muss das Löschen des Kubernetes-Objekts zuverlässig auch die tatsächliche Löschung der externen Ressource auslösen (über einen Finalizer-Mechanismus, analog zu [KB-0398](20-controller-und-operatoren.md)) — schlägt diese externe Löschung fehl (z. B. weil die externe Ressource noch von einer anderen Komponente abhängig ist), muss dies sichtbar bleiben, statt das Kubernetes-Objekt fälschlich als "gelöscht" erscheinen zu lassen, während die reale, kostenpflichtige Ressource weiterhin existiert. Ebenso kritisch sind Credential-Grenzen: die Provider-Zugangsdaten, mit denen Crossplane tatsächlich auf die Cloud-Umgebung zugreift, sollten nach dem Least-Privilege-Prinzip auf die tatsächlich benötigten Operationen beschränkt sein, statt umfassende, administrative Zugangsdaten für den gesamten Cloud-Account zu verwenden.

~~~text
Managed Resource: a Kubernetes object representing an ACTUAL external cloud resource (managed DB, VPC, ...)
  Crossplane provider controllers reconcile it: provision/update/delete the real external resource per declared state
Composition: bundles MULTIPLE related managed resources into ONE simplified, team-friendly platform API
  -> app team requests ONE resource, doesn't manage underlying provider complexity itself
CRITICAL PRACTICAL CONCERN #1: deletion behavior
  a managed resource represents a REAL, potentially costly/data-holding external resource
  deleting the K8s object MUST reliably trigger ACTUAL external deletion (via a finalizer, cf. KB-0398)
  -> deletion FAILS (e.g. still in use elsewhere) -> must stay VISIBLE, not silently appear "deleted" while the real resource still exists and incurs cost
CRITICAL PRACTICAL CONCERN #2: credential scope
  Crossplane's provider credentials should be LEAST-PRIVILEGE for actually needed operations
  NOT broad, administrative credentials for the entire cloud account
~~~

## Core Concepts, Architektur und Implementierung

| Element | Zweck | Kritischer Kontrollpunkt |
|---|---|---|
| Managed Resource | repräsentiert eine tatsächliche externe Cloud-Ressource | Löschverhalten muss zuverlässig die reale externe Ressource entfernen |
| Composition | bündelt mehrere Managed Resources zu einer vereinfachten Plattform-API | verbirgt Provider-Komplexität, ohne Fehler bei einzelnen Bestandteilen zu verschleiern |
| Provider-Credentials | Zugangsdaten für den tatsächlichen Cloud-Zugriff | müssen nach Least-Privilege-Prinzip auf tatsächlich benötigte Operationen beschränkt sein |

Implementierung: Für jede von Crossplane verwaltete Cloud-Ressource wird explizit verifiziert, dass das Löschen des zugehörigen Kubernetes-Objekts tatsächlich zur Löschung der realen externen Ressource führt, und dass ein fehlgeschlagenes externes Löschen sichtbar bleibt (z. B. über einen hängenden Finalizer-Status), statt fälschlich als abgeschlossen zu erscheinen. Provider-Credentials werden mit minimal notwendigen Berechtigungen für die tatsächlich von den verwendeten Compositions benötigten Operationen konfiguriert, statt umfassender administrativer Zugangsdaten. Compositions werden so gestaltet, dass sie Anwendungsteams eine vereinfachte, konsistente Plattform-API bieten, während Fehler bei einzelnen zugrunde liegenden Managed Resources weiterhin sichtbar und diagnostizierbar bleiben, statt vollständig verborgen zu werden.

## Scalability, Reliability, Security und Observability

Crossplane skaliert konsistente, deklarative Infrastrukturverwaltung über Kubernetes-native Werkzeuge proportional zur Anzahl definierter Compositions und Managed Resources; die Reliability-Grenze liegt darin, dass ein unzureichend verifiziertes Löschverhalten proportional zur Anzahl gelöschter Ressourcen das Risiko unbemerkt weiterlaufender, kostenpflichtiger externer Ressourcen erhöht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine gelöschte Managed Resource verursacht weiterhin Kosten in der Cloud-Rechnung | die externe Ressource wurde beim Löschen des Kubernetes-Objekts nicht tatsächlich entfernt, ein Finalizer hängt oder wurde übersprungen | den Finalizer-Status der betroffenen Managed Resource und die Provider-Controller-Logs auf einen fehlgeschlagenen Löschvorgang prüfen |
| Crossplane kann bestimmte Ressourcenoperationen nicht durchführen | die konfigurierten Provider-Credentials besitzen nicht die für diese Operation notwendigen Berechtigungen | die tatsächlich benötigten Berechtigungen für die fehlgeschlagene Operation identifizieren und den Credentials gezielt hinzufügen |
| eine Composition verbirgt einen Fehler bei einer der zugrunde liegenden Managed Resources | die Composition-Statusaggregation zeigt keinen granularen Fehlerstatus einzelner Bestandteile | den Status jeder einzelnen zugrunde liegenden Managed Resource innerhalb der Composition getrennt prüfen |

Security: Provider-Credentials mit übermäßigem Berechtigungsumfang stellen ein erhebliches Risiko dar, da ein kompromittierter Crossplane-Controller oder eine fehlerhafte Reconciliation-Logik dann weitreichenden, unbeabsichtigten Zugriff auf die gesamte Cloud-Umgebung erhalten könnte. Observability: Der Löschverhalten-Erfolgsstatus jeder Managed Resource, die tatsächlich genutzten Berechtigungen der Provider-Credentials gegenüber den zugewiesenen, und der granulare Status einzelner Bestandteile innerhalb jeder Composition sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert minimal privilegierte Provider-Credentials und verifiziertes Löschverhalten für jede Managed Resource. **Principal** macht den granularen Status einzelner Composition-Bestandteile für das Team nachvollziehbar. **Chief** etabliert strikt begrenzte Provider-Credentials und explizit geprüftes Löschverhalten als verpflichtenden Standard für Crossplane-basierte Infrastruktur-APIs im Unternehmen.

Anti-Patterns: Crossplane mit umfassenden, administrativen Cloud-Provider-Zugangsdaten statt minimal privilegierten Credentials betreiben; das Löschverhalten einer Managed Resource nie explizit gegen die tatsächliche externe Ressource verifizieren; Compositions ohne granularen Fehlerstatus einzelner Bestandteile gestalten, wodurch Probleme verborgen bleiben.

## Production Checklist

- [ ] Provider-Credentials sind nach Least-Privilege-Prinzip auf tatsächlich benötigte Operationen beschränkt.
- [ ] Das Löschverhalten jeder Managed Resource ist gegen die tatsächliche externe Ressource verifiziert.
- [ ] Ein fehlgeschlagenes externes Löschen bleibt sichtbar, statt fälschlich als abgeschlossen zu erscheinen.
- [ ] Compositions zeigen den granularen Status einzelner zugrunde liegender Managed Resources.

## Interviewfragen

### 1. Was ist eine Managed Resource in Crossplane?

**Antwort:** Ein Kubernetes-Objekt, das eine tatsächliche, außerhalb des Clusters liegende Cloud-Ressource repräsentiert, deren Provisionierung, Aktualisierung und Löschung von einem Crossplane-Provider-Controller reconciled wird.

### 2. Warum ist das Löschverhalten bei Crossplane ein besonders kritischer Kontrollpunkt?

**Antwort:** Eine Managed Resource repräsentiert eine reale, potenziell kostenpflichtige oder datenhaltende externe Ressource; ein fehlgeschlagenes externes Löschen muss sichtbar bleiben, statt das Kubernetes-Objekt fälschlich als vollständig gelöscht erscheinen zu lassen, während die reale Ressource weiterhin Kosten verursacht.

### 3. Was ist eine Composition, und welchen Zweck erfüllt sie?

**Antwort:** Sie bündelt mehrere zusammengehörige Managed Resources zu einer vereinfachten, teamfreundlichen Plattform-API, sodass ein Anwendungsteam eine komplexe Infrastrukturanforderung über eine einzige, einfache Ressourcenanforderung stellen kann.

### 4. Warum sollten Crossplane-Provider-Credentials minimal privilegiert sein?

**Antwort:** Umfassende, administrative Zugangsdaten würden bei Kompromittierung des Controllers oder einer fehlerhaften Reconciliation-Logik weitreichenden, unbeabsichtigten Zugriff auf die gesamte Cloud-Umgebung ermöglichen.

### 5. Wie gehst du vor, wenn eine gelöschte Managed Resource weiterhin Kosten in der Cloud-Rechnung verursacht?

**Antwort:** Ich prüfe den Finalizer-Status der betroffenen Managed Resource und die Provider-Controller-Logs, um festzustellen, ob die tatsächliche externe Löschung fehlgeschlagen oder übersprungen wurde.

### 6. Widersprüchliche Anforderung: Anwendungsteams wollen einfache, unkomplizierte Infrastrukturanforderungen UND garantiert sichere, minimal privilegierte Provider-Zugriffe — wie gehst du vor?

**Antwort:** Ich würde Compositions bereitstellen, die die zugrunde liegende Provider-Komplexität für Anwendungsteams vollständig verbergen, während die zugrunde liegenden Provider-Credentials selbst plattformseitig streng minimal privilegiert konfiguriert werden — die Einfachheit für Anwendungsteams und die Sicherheit der Zugangsdaten sind unabhängig voneinander gestaltbar.

## Praktische Labs

~~~python
class SimulatedManagedResource:
    def __init__(self, name, external_resource_id):
        self.name = name
        self.external_resource_id = external_resource_id
        self.deletion_requested = False
        self.external_resource_deleted = False
        self.finalizer_present = True

class SimulatedProviderController:
    def __init__(self, external_delete_will_succeed=True):
        self.external_delete_will_succeed = external_delete_will_succeed

    def reconcile_deletion(self, resource):
        if not resource.deletion_requested:
            return
        if self.external_delete_will_succeed:
            resource.external_resource_deleted = True
            resource.finalizer_present = False
            print(f"'{resource.name}': external resource '{resource.external_resource_id}' ACTUALLY deleted, finalizer removed.")
        else:
            print(f"'{resource.name}': external deletion FAILED -- finalizer REMAINS, K8s object stays visible as 'terminating'.")

successful_case = SimulatedManagedResource("db-instance-1", "aws-rds-abc123")
successful_case.deletion_requested = True
controller_success = SimulatedProviderController(external_delete_will_succeed=True)
controller_success.reconcile_deletion(successful_case)

failed_case = SimulatedManagedResource("db-instance-2", "aws-rds-def456")
failed_case.deletion_requested = True
controller_fail = SimulatedProviderController(external_delete_will_succeed=False)
controller_fail.reconcile_deletion(failed_case)

print(f"\nCase 1 - object still visible in cluster (finalizer removed): {not failed_case.finalizer_present}")
print(f"Case 2 - object still visible in cluster (finalizer present, prevents silent disappearance): {failed_case.finalizer_present}")
~~~

## Dependencies, Cross-References und Quellen

1. Crossplane-Dokumentation: [Managed Resources](https://docs.crossplane.io/latest/concepts/managed-resources/), abgerufen 2026-09-17.
2. Crossplane-Dokumentation: [Compositions](https://docs.crossplane.io/latest/concepts/compositions/), abgerufen 2026-09-17.

Custom Resource Definitions sind kanonisch in [KB-0399](21-custom-resource-definitions.md) behandelt; Controller und Operatoren in [KB-0398](20-controller-und-operatoren.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Composition Functions als flexiblere, programmierbare Alternative zu statischen, Patch-basierten Compositions | Adopting | Gegenüber rein Patch-basierten Compositions für komplexere, dynamische Infrastrukturlogik bevorzugen. |
| Automatisierte Credential-Scope-Auditwerkzeuge, die tatsächlich genutzte gegenüber zugewiesenen Berechtigungen vergleichen | Evaluating | Gegenüber manueller Berechtigungsprüfung abwägen, sobald ein zuverlässiges Auditwerkzeug für die konkrete Provider-Landschaft verfügbar ist. |

Ein Team akzeptiert eine Crossplane-basierte Infrastruktur-API erst, wenn Löschverhalten verifiziert und Provider-Credentials nachweislich minimal privilegiert sind.
