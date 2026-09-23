---
{"id": "KB-0403", "title": "Karpenter und Node-Provisionierung", "domain": "16", "sequence": 25, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0394", "concepts": ["Scheduling und Platzierungsregeln"], "needed_for": "understanding"}, {"id": "KB-0396", "concepts": ["Autoscaling für Workloads"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen NodePool konfigurieren, der basierend auf tatsächlich unschedulierbaren Pods automatisch neue Knoten bereitstellt, und eine Konsolidierungsaktion mit Pod-Disruption-Budget-Berücksichtigung beobachten.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Node-Provisionierungsstrategie gestalten, die Konsolidierung (Zusammenlegung unterausgelasteter Knoten) gegen tatsächliche Pod-Verfügbarkeitsanforderungen und Cloud-Provider-Kapazitätsgrenzen abwägt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Pod-Unterbrechung während einer Konsolidierungsaktion auf ein fehlendes oder unzureichendes Pod-Disruption-Budget statt auf ein allgemeines Node-Autoscaling-Problem zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Bedarfsbasierte Node-Provisionierung mit expliziter Pod-Disruption-Budget-Berücksichtigung als Standard für kosteneffiziente, aber verfügbarkeitsbewusste Cluster-Kapazitätsplanung im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene, providerspezifische Instanztyp-Auswahlstrategien im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis von bedarfsbasierter Provisionierung, Konsolidierung und Disruption-Budget-Abwägung, nicht die konkrete Instanztyp-Optimierung."}}, "lab_validation": [{"lab_id": "KB-0403-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Konsolidierungsszenario mit einem Pod-Disruption-Budget, das eine geplante Konsolidierung blockiert", "evidence": "Eine simulierte Konsolidierungsaktion, die einen unterausgelasteten Knoten entfernen würde, wird korrekt blockiert, solange die Entfernung das minimal verfügbare Replicas-Kontingent eines Pod-Disruption-Budgets verletzen würde; erst nachdem ausreichend andere Replicas verfügbar sind, wird die Konsolidierung tatsächlich durchgeführt.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, künstlich konstruiertes Konsolidierungsszenario."}]}
---
# Karpenter und Node-Provisionierung

> **Ziel:** Karpenter (und vergleichbare Node-Autoscaling-Lösungen) stellt Kubernetes-Knoten bedarfsbasiert bereit, direkt reagierend auf tatsächlich unschedulierbare Pods (siehe [KB-0394](16-scheduling-und-platzierungsregeln.md)), statt vorab festgelegte, statische Knotenpools zu verwalten. Der zentrale Punkt dieses Kapitels ist die Abwägung zwischen Konsolidierung (dem Zusammenlegen unterausgelasteter Knoten zur Kostenreduktion) und tatsächlicher Pod-Verfügbarkeit — eine Konsolidierungsaktion darf niemals ein konfiguriertes Pod-Disruption-Budget verletzen, das die minimale Verfügbarkeit einer Anwendung während geplanter Unterbrechungen absichert.

## Zweck, Mental Model und Dependencies

Traditionelles Node-Autoscaling arbeitet oft mit vorab konfigurierten Knotenpools fester Größe, die basierend auf aggregierten Metriken (z. B. durchschnittliche Cluster-Auslastung) skaliert werden. Karpenter verfolgt einen direkteren Ansatz: es beobachtet tatsächlich unschedulierbare Pods (Pods, die aufgrund unzureichender verfügbarer Kapazität im Zustand "Pending" verbleiben, siehe [KB-0394](16-scheduling-und-platzierungsregeln.md)) und provisioniert direkt passende Knoten basierend auf den tatsächlichen Ressourcenanforderungen und Constraints dieser konkreten Pods, statt indirekt über eine aggregierte Cluster-Metrik zu reagieren. Konsolidierung ist die Kehrseite dieser bedarfsbasierten Provisionierung: Karpenter identifiziert kontinuierlich unterausgelastete Knoten (deren laufende Pods auch auf weniger, dichter ausgelasteten Knoten Platz finden würden) und plant deren Entfernung, um Kosten zu reduzieren. Diese Konsolidierung steht jedoch potenziell in Konflikt mit der tatsächlichen Verfügbarkeit einer Anwendung: das Entfernen eines Knotens erfordert das Beenden aller darauf laufenden Pods, was bei einer Anwendung mit mehreren Replicas kurzzeitig deren verfügbare Kapazität reduziert. Ein Pod-Disruption-Budget (PDB) definiert explizit, wie viele Replicas einer Anwendung minimal verfügbar bleiben müssen (oder wie viele maximal gleichzeitig unterbrochen werden dürfen) während einer geplanten, freiwilligen Unterbrechung wie einer Konsolidierung — Karpenter muss dieses Budget respektieren und eine Konsolidierungsaktion verzögern oder anders staffeln, wenn sie das Budget verletzen würde. Zusätzlich muss die Provisionierung neuer Knoten die tatsächlichen Kapazitätsgrenzen des zugrunde liegenden Cloud-Providers berücksichtigen (bestimmte Instanztypen können in bestimmten Regionen oder Verfügbarkeitszonen zeitweise ausgeschöpft sein), was eine reine Bedarfsanforderung allein nicht garantiert erfüllbar macht.

~~~text
Traditional node autoscaling: pre-configured fixed-size node pools, scaled based on AGGREGATE cluster metrics
Karpenter: DIRECT approach -- observes ACTUALLY UNSCHEDULABLE pods (cf. KB-0394), provisions matching nodes for THEIR specific needs
Consolidation: identifies UNDERUTILIZED nodes (pods would fit on fewer, denser nodes) -> plans their removal for cost reduction
  CONFLICT: removing a node terminates all pods on it -> temporarily reduces an app's available capacity
Pod Disruption Budget (PDB): explicitly defines MINIMUM available replicas (or MAX simultaneously disrupted)
  during a VOLUNTARY disruption like consolidation
  -> Karpenter MUST respect this -- delay/stagger consolidation if it would violate the budget
ALSO: new node provisioning must respect actual CLOUD PROVIDER capacity limits (instance type exhaustion in a zone/region)
  -> a demand request alone doesn't guarantee fulfillable capacity
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Konfliktpunkt |
|---|---|---|
| Bedarfsbasierte Provisionierung | reagiert direkt auf tatsächlich unschedulierbare Pods | Provider-Kapazitätsgrenzen können eine passende Bereitstellung zeitweise verhindern |
| Konsolidierung | reduziert Kosten durch Entfernung unterausgelasteter Knoten | erzwingt Pod-Terminierung, was Pod-Verfügbarkeit kurzzeitig reduziert |
| Pod-Disruption-Budget | sichert minimale Anwendungsverfügbarkeit während geplanter Unterbrechungen | begrenzt, wie schnell/aggressiv eine Konsolidierung durchgeführt werden darf |

Implementierung: Für jede Anwendung mit mehreren Replicas wird ein Pod-Disruption-Budget definiert, das die minimal notwendige Verfügbarkeit während geplanter Unterbrechungen (einschließlich Konsolidierung) explizit festlegt. NodePools werden mit expliziten Constraints (zulässige Instanztypen, Verfügbarkeitszonen) konfiguriert, die sowohl den tatsächlichen Anwendungsbedarf als auch die bekannten Kapazitätsgrenzen des Cloud-Providers berücksichtigen. Konsolidierungsaktionen werden so gestaltet, dass sie das konfigurierte Pod-Disruption-Budget jeder betroffenen Anwendung respektieren, und bei Bedarf zeitlich gestaffelt oder verzögert durchgeführt, statt eine Kostenoptimierung ohne Rücksicht auf Verfügbarkeitsanforderungen zu erzwingen.

## Scalability, Reliability, Security und Observability

Bedarfsbasierte Node-Provisionierung skaliert Cluster-Kapazität proportional zur tatsächlichen, gemessenen Nachfrage unschedulierbarer Pods, statt proportional zu einer möglicherweise ungenauen, aggregierten Metrik; die Reliability-Grenze liegt darin, dass eine Konsolidierung ohne Berücksichtigung von Pod-Disruption-Budgets proportional zur Aggressivität der Konsolidierungsstrategie das Risiko unbeabsichtigter Verfügbarkeitseinbußen erhöht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Anwendung mit mehreren Replicas zeigt eine kurzzeitige Verfügbarkeitseinbuße während einer Konsolidierungsaktion | kein oder ein unzureichendes Pod-Disruption-Budget wurde für diese Anwendung konfiguriert | ein Pod-Disruption-Budget mit angemessener minimaler Verfügbarkeit für die betroffene Anwendung definieren |
| ein unschedulierbarer Pod bleibt trotz aktivem Node-Autoscaling im Zustand "Pending" | der konfigurierte NodePool erlaubt keine Instanztypen, die die tatsächlichen Ressourcenanforderungen des Pods erfüllen können, oder der Cloud-Provider hat keine passende Kapazität verfügbar | die NodePool-Constraints und die tatsächliche Provider-Kapazitätsverfügbarkeit für die benötigten Instanztypen prüfen |
| die Cluster-Kosten steigen unerwartet trotz aktiver Konsolidierung | die Konsolidierungsstrategie wird durch zu restriktive Pod-Disruption-Budgets oder andere Constraints häufig blockiert | die tatsächliche Konsolidierungsrate überwachen und die Balance zwischen Verfügbarkeitsanforderungen und Kosteneffizienz neu bewerten |

Security: Eine unkontrollierte, aggressive Konsolidierung ohne Disruption-Budget-Berücksichtigung kann bei sicherheitsrelevanten Anwendungen (die eine Mindestverfügbarkeit für Monitoring oder Reaktionsfähigkeit benötigen) unbeabsichtigt deren Schutzwirkung während einer Unterbrechung reduzieren. Observability: Die Häufigkeit und der Umfang von Konsolidierungsaktionen, die Häufigkeit durch Disruption-Budgets blockierter Konsolidierungsversuche, und die tatsächliche Provider-Kapazitätsverfügbarkeit für angeforderte Instanztypen sind zentrale Node-Provisionierungs-Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Pod-Disruption-Budgets für jede Anwendung mit mehreren Replicas vor Aktivierung aggressiver Konsolidierung. **Principal** macht Konsolidierungsentscheidungen und deren Verfügbarkeitsauswirkung für das Team nachvollziehbar. **Chief** etabliert bedarfsbasierte Node-Provisionierung mit expliziter Pod-Disruption-Budget-Berücksichtigung als Standard für kosteneffiziente, aber verfügbarkeitsbewusste Cluster-Kapazitätsplanung im Unternehmen.

Anti-Patterns: Konsolidierung ohne konfigurierte Pod-Disruption-Budgets für Anwendungen mit Verfügbarkeitsanforderungen aktivieren; NodePool-Constraints ohne Berücksichtigung bekannter Cloud-Provider-Kapazitätsgrenzen konfigurieren; Kosteneinsparungen durch Konsolidierung priorisieren, ohne die tatsächliche Verfügbarkeitsauswirkung zu messen.

## Production Checklist

- [ ] Jede Anwendung mit mehreren Replicas besitzt ein konfiguriertes Pod-Disruption-Budget.
- [ ] NodePool-Constraints berücksichtigen bekannte Cloud-Provider-Kapazitätsgrenzen.
- [ ] Konsolidierungsaktionen respektieren nachweislich konfigurierte Disruption-Budgets.
- [ ] Die tatsächliche Verfügbarkeitsauswirkung von Konsolidierung wird gemessen und überwacht.

## Interviewfragen

### 1. Was unterscheidet Karpenters bedarfsbasierten Ansatz von traditionellem, poolbasiertem Node-Autoscaling?

**Antwort:** Karpenter reagiert direkt auf tatsächlich unschedulierbare Pods und deren konkrete Anforderungen, statt indirekt über eine aggregierte Cluster-Metrik und vorab festgelegte, feste Knotenpools zu skalieren.

### 2. Was ist ein Pod-Disruption-Budget, und warum ist es bei Konsolidierung wichtig?

**Antwort:** Es definiert die minimal notwendige Verfügbarkeit oder maximal zulässige gleichzeitige Unterbrechung einer Anwendung während geplanter, freiwilliger Unterbrechungen wie Konsolidierung, und muss von Karpenter respektiert werden, um unbeabsichtigte Verfügbarkeitseinbußen zu vermeiden.

### 3. Warum kann eine bedarfsbasierte Node-Anforderung nicht immer garantiert erfüllt werden?

**Antwort:** Die tatsächliche Kapazität des zugrunde liegenden Cloud-Providers für bestimmte Instanztypen kann in bestimmten Regionen oder Zonen zeitweise ausgeschöpft sein, unabhängig von der reinen Nachfrage.

### 4. Was ist Konsolidierung, und welchen Konflikt löst sie potenziell aus?

**Antwort:** Das Zusammenlegen unterausgelasteter Knoten zur Kostenreduktion, was jedoch die Terminierung aller darauf laufenden Pods erfordert und damit kurzzeitig die verfügbare Kapazität einer Anwendung reduzieren kann.

### 5. Wie gehst du vor, wenn eine Anwendung während einer Konsolidierungsaktion eine unerwartete Verfügbarkeitseinbuße zeigt?

**Antwort:** Ich prüfe, ob für diese Anwendung ein Pod-Disruption-Budget konfiguriert ist, und definiere bei Bedarf ein angemessenes Budget, das die minimale Verfügbarkeit während geplanter Unterbrechungen absichert.

### 6. Widersprüchliche Anforderung: Team will maximale Kosteneinsparung durch aggressive Konsolidierung UND garantiert keine Verfügbarkeitseinbußen kritischer Anwendungen — wie gehst du vor?

**Antwort:** Ich würde für jede kritische Anwendung ein Pod-Disruption-Budget mit angemessener minimaler Verfügbarkeit definieren, sodass Karpenter Konsolidierungsaktionen automatisch verzögert oder staffelt, wenn sie dieses Budget verletzen würden — dies ermöglicht weiterhin aggressive Konsolidierung für nicht-kritische Workloads, während kritische Anwendungen geschützt bleiben.

## Praktische Labs

~~~python
class SimulatedNode:
    def __init__(self, name, running_pods):
        self.name = name
        self.running_pods = running_pods  # list of (app_name, replica_id)

class SimulatedPDB:
    def __init__(self, app_name, min_available):
        self.app_name = app_name
        self.min_available = min_available

def check_consolidation_allowed(node_to_remove, all_nodes, pdbs, total_replicas_per_app):
    for app_name, replica_id in node_to_remove.running_pods:
        pdb = pdbs.get(app_name)
        if pdb is None:
            continue
        remaining_replicas_elsewhere = sum(
            1 for n in all_nodes if n is not node_to_remove
            for a, r in n.running_pods if a == app_name
        )
        if remaining_replicas_elsewhere < pdb.min_available:
            return False, f"BLOCKED: removing '{node_to_remove.name}' would leave only {remaining_replicas_elsewhere} replicas of '{app_name}', below PDB minimum of {pdb.min_available}"
    return True, f"ALLOWED: consolidation of '{node_to_remove.name}' respects all PDBs"

node_a = SimulatedNode("node-a", [("web-app", 1)])
node_b = SimulatedNode("node-b", [("web-app", 2)])
node_c = SimulatedNode("node-c", [("web-app", 3)])
all_nodes = [node_a, node_b, node_c]

pdbs = {"web-app": SimulatedPDB("web-app", min_available=2)}

allowed, message = check_consolidation_allowed(node_c, all_nodes, pdbs, {"web-app": 3})
print(message)
~~~

## Dependencies, Cross-References und Quellen

1. Karpenter-Dokumentation: [Concepts](https://karpenter.sh/docs/concepts/), abgerufen 2026-09-17.
2. Kubernetes-Dokumentation: [Specifying a Disruption Budget for your Application](https://kubernetes.io/docs/tasks/run-application/configure-pdb/), abgerufen 2026-09-17.

Scheduling und Platzierungsregeln sind kanonisch in [KB-0394](16-scheduling-und-platzierungsregeln.md) behandelt; Autoscaling für Workloads in [KB-0396](18-autoscaling-fuer-workloads.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Karpenter als Cloud-Provider-übergreifende, konsolidierte Node-Provisionierungslösung gegenüber providerspezifischen Cluster-Autoscalern | Adopting | Gegenüber providerspezifischen Lösungen für konsistentere, direktere bedarfsbasierte Provisionierung bevorzugen. |
| Automatisierte Spot-Instanz-Integration mit graceful Handling bei Kapazitätsverlust | Adopting | Gegenüber ausschließlicher On-Demand-Kapazität für signifikante Kosteneinsparung bei fehlertoleranten Workloads bevorzugen. |

Ein Team akzeptiert eine Node-Provisionierungsstrategie erst, wenn Pod-Disruption-Budgets für alle Anwendungen mit Verfügbarkeitsanforderungen konfiguriert sind.
