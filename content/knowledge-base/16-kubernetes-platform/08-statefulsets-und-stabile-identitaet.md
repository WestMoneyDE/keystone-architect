---
{"id": "KB-0386", "title": "StatefulSets und stabile Identität", "domain": "16", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0385", "concepts": ["Deployments und ReplicaSets"], "needed_for": "understanding"}, {"id": "KB-0382", "concepts": ["CSI und Volume-Lifecycle im Cluster"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein StatefulSet mit persistenten Volumes erstellen und beobachten, wie jede Replica ihre stabile, nummerierte Identität und ihr zugehöriges Volume über Neustarts hinweg behält.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Entscheiden, wann ein StatefulSet (stabile Identität, geordnete Updates) gegenüber einem Deployment tatsächlich notwendig ist, statt es standardmäßig für jede zustandsbehaftete Anwendung einzusetzen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, dass ein StatefulSet allein keine Garantien über Datenbank-Clusterrollen (z. B. Primary/Replica) bietet, sondern nur stabile Identität und geordnete Updates.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Klare Abgrenzung zwischen den tatsächlichen StatefulSet-Garantien und anwendungsspezifischer Cluster-Rollenlogik als Architekturstandard im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Der Betrieb spezifischer Datenbank-Operatoren, die StatefulSets um Rollenlogik erweitern, ist Vertiefung.", "rationale": "Kern ist das Verständnis der reinen StatefulSet-Garantien, nicht der Betrieb eines spezifischen Operators."}}, "lab_validation": [{"lab_id": "KB-0386-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes StatefulSet-Modell mit nummerierten Ordinals und zugeordneten Volumes", "evidence": "Ein simuliertes StatefulSet mit drei Replicas weist jeder Replica eine stabile, nummerierte Identität (Ordinal 0, 1, 2) mit einem eigenen, konsistent zugeordneten Volume zu; nach einem simulierten Neustart einer Replica erhält sie exakt dieselbe Identität und dasselbe Volume zurück, jedoch ohne dass das StatefulSet selbst eine Aussage darüber trifft, welche Replica die Rolle eines Datenbank-Primary einnimmt.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, künstlich vereinfachtes Modell."}]}
---
# StatefulSets und stabile Identität

> **Ziel:** Ein StatefulSet erweitert die Deployment-Grundlagen (siehe [KB-0385](07-deployments-und-replicasets.md)) um stabile Identität (jede Replica erhält eine feste, nummerierte Bezeichnung, ein sogenanntes Ordinal, das über Neustarts hinweg erhalten bleibt), persistente Volumes (jedes Ordinal ist konsistent mit demselben Volume verknüpft, siehe [KB-0382](04-csi-volume-lifecycle.md)) und geordnete Updates (Replicas werden in einer festen Reihenfolge, nicht parallel, aktualisiert). Der zentrale Punkt dieses Kapitels ist die klare Abgrenzung: ein StatefulSet garantiert ausschließlich diese drei Eigenschaften — es trifft keine Aussage über anwendungsspezifische Datenbank-Clusterrollen (z. B. welche Replica der Primary ist), was ein häufiges Missverständnis ist.

## Zweck, Mental Model und Dependencies

Bei einem gewöhnlichen Deployment sind alle Replicas austauschbar und identisch — keine hat eine feste Identität, und beim Neustart einer Replica ist es irrelevant, welche konkrete neue Instanz sie ersetzt. Ein StatefulSet löst ein anderes Problem: manche Anwendungen (z. B. verteilte Datenbanken) benötigen Replicas mit stabiler, wiedererkennbarer Identität — Ordinal 0, Ordinal 1, Ordinal 2 — die bei einem Neustart exakt dieselbe Identität und dasselbe zugeordnete persistente Volume zurückerhalten, statt durch eine beliebige neue Instanz ersetzt zu werden. Geordnete Updates bedeuten, dass bei einem Rolling Update eines StatefulSets die Replicas in einer festen Reihenfolge (typischerweise vom höchsten zum niedrigsten Ordinal) aktualisiert werden, statt parallel wie bei einem Deployment — dies ist wichtig für Anwendungen, bei denen die Aktualisierungsreihenfolge selbst eine Rolle spielt (z. B. zuerst Replicas, dann den Primary aktualisieren). Der zentrale, oft missverstandene Punkt ist: ein StatefulSet selbst weiß nichts über die anwendungsspezifische Semantik dieser Identitäten — es garantiert lediglich, dass Ordinal 0 immer Ordinal 0 bleibt und sein Volume behält, trifft aber keine Aussage darüber, ob Ordinal 0 tatsächlich der Datenbank-Primary ist. Diese Rollenzuweisung (Primary/Replica, Leader/Follower) ist ausschließlich anwendungsinterne Logik (z. B. durch einen eigenen Konsensmechanismus der Datenbank selbst bestimmt) und liegt vollständig außerhalb der StatefulSet-Garantien — ein StatefulSet mit stabiler Identität zu verwenden bedeutet nicht automatisch, dass die zugrunde liegende Anwendung eine funktionierende Cluster-Rollenlogik hat.

~~~text
Deployment: all replicas INTERCHANGEABLE, no fixed identity, restart = replaced by ANY new instance
StatefulSet solves a DIFFERENT problem: replicas need STABLE, RECOGNIZABLE identity (ordinal 0, 1, 2, ...)
  restart -> gets back the EXACT SAME identity + SAME persistent volume, not a new arbitrary instance
Ordered updates: rolling update proceeds in FIXED ORDER (typically highest-to-lowest ordinal), not parallel
CRITICAL MISCONCEPTION TO AVOID: a StatefulSet knows NOTHING about application-specific semantics of these identities
  guarantees ONLY: ordinal 0 stays ordinal 0, keeps its volume
  does NOT guarantee: ordinal 0 IS the database primary -- that's PURELY application-internal logic
    (e.g. the database's own consensus mechanism decides leadership), entirely OUTSIDE StatefulSet guarantees
~~~

## Core Concepts, Architektur und Implementierung

| Eigenschaft | Was das StatefulSet garantiert | Was das StatefulSet NICHT garantiert |
|---|---|---|
| Stabile Identität | jedes Ordinal behält seinen Namen über Neustarts hinweg | keine Aussage über die anwendungsinterne Rolle dieses Ordinals |
| Persistentes Volume | jedes Ordinal ist konsistent mit demselben Volume verknüpft | keine Aussage über den Dateninhalt oder Konsistenzstatus des Volumes |
| Geordnete Updates | Replicas werden in fester Reihenfolge aktualisiert | keine Aussage über die anwendungsinterne Verarbeitung während des Updates (z. B. Failover-Logik) |

Implementierung: Zustandsbehaftete Anwendungen, die tatsächlich stabile Identität benötigen (z. B. eine Datenbank, bei der jeder Knoten seine eigene, dauerhafte Datenmenge verwaltet), werden als StatefulSet statt als Deployment betrieben. Die anwendungsinterne Cluster-Rollenlogik (welcher Knoten Primary ist, wie ein Failover abläuft) wird explizit als separate, anwendungsspezifische Komponente behandelt — häufig durch einen spezialisierten Operator, der das StatefulSet um diese Logik ergänzt, statt anzunehmen, dass das StatefulSet selbst diese Rollenlogik bereitstellt. Vor der Wahl eines StatefulSets wird geprüft, ob die Anwendung tatsächlich stabile Identität benötigt, oder ob ein einfacheres Deployment mit austauschbaren Replicas ausreichend wäre.

## Scalability, Reliability, Security und Observability

StatefulSets skalieren stabile, identifizierbare Zustandsverwaltung proportional zur Anzahl der Ordinals; die Reliability-Grenze liegt darin, dass die Annahme, ein StatefulSet allein garantiere korrekte Cluster-Rollenlogik, proportional zur Komplexität der zugrunde liegenden Anwendung zu unentdeckten Fehlfunktionen (z. B. mehreren gleichzeitigen Primaries) führen kann, wenn die tatsächliche Rollenlogik fehlt oder fehlerhaft ist.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Datenbankanwendung in einem StatefulSet zeigt inkonsistentes Verhalten bezüglich Primary-/Replica-Rollen | die anwendungsinterne Rollenlogik (nicht das StatefulSet selbst) ist fehlerhaft oder fehlt | die anwendungsspezifische Konsens-/Rollenlogik (z. B. eines Datenbank-Operators) statt der StatefulSet-Konfiguration prüfen |
| eine Replica erhält nach einem Neustart nicht ihr ursprüngliches Volume | die persistente Volume-Zuordnung des StatefulSets ist fehlkonfiguriert | die volumeClaimTemplates-Konfiguration des StatefulSets prüfen |
| ein zustandsloses, austauschbares Anwendungsproblem wird unnötig als StatefulSet betrieben | die Anwendung benötigt tatsächlich keine stabile Identität, ein Deployment wäre einfacher und ausreichend | prüfen, ob die Anwendung tatsächlich auf stabiler Identität angewiesen ist, und bei Bedarf zu einem Deployment migrieren |

Security: Die stabile Identität eines StatefulSets kann fälschlich als Sicherheitsgarantie missverstanden werden (z. B. "Ordinal 0 ist immer vertrauenswürdig, weil er immer derselbe ist") — tatsächliche Sicherheitsgarantien (Authentifizierung, Autorisierung) müssen unabhängig von der reinen Identitätsstabilität implementiert werden. Observability: Die Konsistenz zwischen Ordinal-Zuordnung und tatsächlicher anwendungsinterner Rolle (z. B. über ein separates Monitoring der Datenbank-Cluster-Rollen) ist eine zentrale Metrik, die getrennt von der reinen StatefulSet-Gesundheit überwacht werden muss.

## Trade-offs und Entscheidungen

**Staff** implementiert StatefulSets nur für Anwendungen mit tatsächlichem Bedarf an stabiler Identität. **Principal** macht die Abgrenzung zwischen StatefulSet-Garantien und anwendungsinterner Rollenlogik für das Team nachvollziehbar. **Chief** etabliert klare Abgrenzung zwischen den tatsächlichen StatefulSet-Garantien und anwendungsspezifischer Cluster-Rollenlogik als Architekturstandard im Unternehmen.

Anti-Patterns: annehmen, ein StatefulSet garantiere automatisch korrekte Datenbank-Clusterrollenlogik; ein StatefulSet für Anwendungen ohne tatsächlichen Bedarf an stabiler Identität einsetzen, wo ein einfacheres Deployment ausreichen würde; die anwendungsinterne Rollenlogik nicht getrennt vom StatefulSet-Zustand überwachen.

## Production Checklist

- [ ] Ein StatefulSet wird nur für Anwendungen mit tatsächlichem Bedarf an stabiler Identität eingesetzt.
- [ ] Die anwendungsinterne Cluster-Rollenlogik ist als separate Komponente implementiert und dokumentiert, nicht als angenommene StatefulSet-Eigenschaft.
- [ ] Persistente Volume-Zuordnung pro Ordinal ist korrekt konfiguriert und überwacht.
- [ ] Die anwendungsinterne Rollenkonsistenz wird getrennt von der reinen StatefulSet-Gesundheit überwacht.

## Interviewfragen

### 1. Welches Problem löst ein StatefulSet, das ein Deployment nicht löst?

**Antwort:** Es garantiert stabile, wiedererkennbare Identität (Ordinals) mit konsistent zugeordneten persistenten Volumes über Neustarts hinweg, während Deployment-Replicas vollständig austauschbar sind.

### 2. Was garantiert ein StatefulSet NICHT?

**Antwort:** Es trifft keine Aussage über anwendungsspezifische Semantik wie Datenbank-Clusterrollen (z. B. welche Replica der Primary ist) — dies ist ausschließlich anwendungsinterne Logik.

### 3. Was bedeutet "geordnete Updates" bei einem StatefulSet?

**Antwort:** Replicas werden bei einem Rolling Update in einer festen Reihenfolge (typischerweise vom höchsten zum niedrigsten Ordinal) aktualisiert, statt parallel wie bei einem Deployment.

### 4. Warum ist die Annahme "ein StatefulSet garantiert korrekte Cluster-Rollenlogik" ein Missverständnis?

**Antwort:** Ein StatefulSet garantiert lediglich stabile Identität und Volume-Zuordnung; welche Replica welche anwendungsinterne Rolle (z. B. Primary) einnimmt, wird ausschließlich durch die Anwendung selbst (z. B. einen eigenen Konsensmechanismus) bestimmt.

### 5. Wie gehst du vor, wenn eine Datenbankanwendung in einem StatefulSet inkonsistentes Verhalten bezüglich Primary-/Replica-Rollen zeigt?

**Antwort:** Ich prüfe die anwendungsinterne Konsens-/Rollenlogik (z. B. eines Datenbank-Operators) statt der StatefulSet-Konfiguration selbst, da das StatefulSet keine Rollenlogik bereitstellt.

### 6. Widersprüchliche Anforderung: Team will einfache, austauschbare Deployment-Semantik UND stabile, persistente Identität für eine zustandsbehaftete Anwendung — wie gehst du vor?

**Antwort:** Ich würde erklären, dass diese beiden Anforderungen sich gegenseitig ausschließen, sobald echte Zustandsbehaftung mit stabiler Identität benötigt wird, und ein StatefulSet für den zustandsbehafteten Kern der Anwendung empfehlen, während zustandslose Komponenten desselben Systems weiterhin als einfacheres, austauschbares Deployment betrieben werden.

## Praktische Labs

~~~python
class SimulatedStatefulSet:
    def __init__(self, replica_count):
        self.replicas = {
            ordinal: {"volume_id": f"vol-{ordinal}", "app_role": None}
            for ordinal in range(replica_count)
        }

    def restart_replica(self, ordinal):
        # StatefulSet guarantee: same ordinal, same volume, even after restart
        old_volume = self.replicas[ordinal]["volume_id"]
        # simulate restart -- identity and volume are PRESERVED
        assert self.replicas[ordinal]["volume_id"] == old_volume
        print(f"Ordinal {ordinal} restarted, retained identity and volume '{old_volume}'.")

    def assign_application_role(self, ordinal, role):
        # This is APPLICATION-INTERNAL logic -- NOT provided by the StatefulSet itself
        self.replicas[ordinal]["app_role"] = role

sts = SimulatedStatefulSet(replica_count=3)
sts.restart_replica(1)  # StatefulSet guarantee holds regardless of application state

# The StatefulSet has NO OPINION on this -- it's purely application-level logic
sts.assign_application_role(0, "primary")
sts.assign_application_role(1, "replica")
sts.assign_application_role(2, "replica")

print(f"\nStatefulSet guarantees (identity/volume): {[(o, r['volume_id']) for o, r in sts.replicas.items()]}")
print(f"Application-internal roles (NOT a StatefulSet guarantee): {[(o, r['app_role']) for o, r in sts.replicas.items()]}")
~~~

## Dependencies, Cross-References und Quellen

1. Kubernetes-Dokumentation: [StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/), abgerufen 2026-09-17.
2. Kubernetes-Dokumentation: [Run a Replicated Stateful Application](https://kubernetes.io/docs/tasks/run-application/run-replicated-stateful-application/), abgerufen 2026-09-17.

Deployments und ReplicaSets sind kanonisch in [KB-0385](07-deployments-und-replicasets.md) behandelt; CSI und Volume-Lifecycle im Cluster in [KB-0382](04-csi-volume-lifecycle.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Spezialisierte Kubernetes-Operatoren, die StatefulSets um anwendungsspezifische Cluster-Rollenlogik (Failover, Leader-Wahl) erweitern | Adopting | Gegenüber selbst implementierter Rollenlogik für ausgereiftere, getestete Automatisierung bevorzugen. |
| Alternative Ansätze für zustandsbehaftete Workloads (z. B. spezialisierte Datenbank-Plattformen außerhalb von Kubernetes) | Evaluating | Gegenüber StatefulSets abwägen, sobald der Betriebsaufwand für Kubernetes-native Zustandsverwaltung den Nutzen übersteigt. |

Ein Team akzeptiert eine StatefulSet-basierte Architektur erst, wenn die anwendungsinterne Rollenlogik separat implementiert und getestet ist, nicht als angenommene StatefulSet-Eigenschaft.
