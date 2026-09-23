---
{"id": "KB-0394", "title": "Scheduling und Platzierungsregeln", "domain": "16", "sequence": 16, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0384", "concepts": ["Pods und Lebenszyklen"], "needed_for": "understanding"}], "related": ["KB-0387"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Pod mit Ressourcen-Requests, Affinity-Regeln und Topology-Spread-Constraints konfigurieren und einen nicht platzierbaren Pod-Fall diagnostizieren.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Platzierungsregeln (Affinity, Anti-Affinity, Topology Spread) so kombinieren, dass Ausfallrisiken tatsächlich über unabhängige Fehlerdomänen verteilt werden, statt sich zufällig zu konzentrieren.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen dauerhaft im Zustand 'Pending' verbleibenden Pod auf eine konkrete, widersprüchliche oder unerfüllbare Kombination von Scheduling-Constraints zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Explizite Topology-Spread-Constraints als Standard für ausfalltolerante Workload-Platzierung im Unternehmen etablieren, statt sich auf zufällig gute Verteilung durch Standard-Scheduling zu verlassen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene, benutzerdefinierte Scheduler-Erweiterungen im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis von Requests, Affinity und Topology Spread als kombinierbare Constraints, nicht die Implementierung eines eigenen Schedulers."}}, "lab_validation": [{"lab_id": "KB-0394-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Scheduling-Modell mit widersprüchlichen Ressourcen- und Affinity-Constraints", "evidence": "Ein simulierter Pod mit einer Ressourcenanforderung, die die verfügbare Kapazität aller Knoten übersteigt, bleibt korrekt im Zustand 'nicht platzierbar', während die Diagnose anhand der einzelnen Constraint-Prüfungen (Ressourcen, Affinity, Taints) die tatsächliche Ursache (unzureichende Ressourcenkapazität statt eines Affinity-Konflikts) eindeutig identifiziert.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, künstlich konstruiertes Scheduling-Szenario."}]}
---
# Scheduling und Platzierungsregeln

> **Ziel:** Der Kubernetes-Scheduler platziert Pods auf Knoten basierend auf einer Kombination mehrerer Constraint-Typen: Requests (die vom Pod deklarierten minimalen Ressourcenanforderungen), Affinity/Anti-Affinity (Präferenzen oder Anforderungen bezüglich der Nähe zu oder Distanz von anderen Pods), Taints/Tolerations (siehe [KB-0387](09-daemonsets-und-node-dienste.md)), und Topology Spread Constraints (explizite Verteilung über Fehlerdomänen wie Verfügbarkeitszonen). Der zentrale Punkt dieses Kapitels ist, diese Constraints bewusst zu kombinieren, um tatsächliche Ausfalltoleranz durch verteilte Platzierung zu erreichen, und einen nicht platzierbaren Pod systematisch auf die konkret verletzte Constraint-Kombination zurückzuführen.

## Zweck, Mental Model und Dependencies

Ein Pod deklariert Ressourcen-Requests (minimal benötigte CPU/Speicher), die der Scheduler gegen die verfügbare, noch nicht durch andere Pods belegte Kapazität jedes Knotens prüft — ein Knoten mit unzureichender freier Kapazität kommt für die Platzierung nicht in Frage. Affinity-Regeln drücken eine Präferenz oder Anforderung aus, dass ein Pod in der Nähe bestimmter anderer Pods platziert werden soll (z. B. auf demselben Knoten wie ein Cache für geringe Latenz); Anti-Affinity drückt das Gegenteil aus (z. B. mehrere Replicas derselben Anwendung sollen explizit nicht auf demselben Knoten laufen, um bei einem Knotenausfall nicht alle gleichzeitig zu verlieren). Topology Spread Constraints gehen über einfache Anti-Affinity hinaus: sie definieren explizit, dass Pods über eine bestimmte Topologie-Dimension (z. B. Verfügbarkeitszonen oder Knoten) möglichst gleichmäßig verteilt werden sollen, statt sich zufällig zu konzentrieren — ohne diese explizite Steuerung kann der Standard-Scheduler mehrere Replicas einer Anwendung zufällig in derselben Verfügbarkeitszone platzieren, was bei einem Ausfall dieser Zone zu einem vollständigen Ausfall der Anwendung führen würde, obwohl formal mehrere Replicas existieren. Ein Pod bleibt im Zustand "Pending" (nicht platzierbar), wenn keine Kombination aus Knoten und aktuellem Cluster-Zustand alle deklarierten Constraints gleichzeitig erfüllt — die korrekte Diagnose erfordert, jede Constraint-Kategorie (Ressourcen, Affinity, Taints, Topology Spread) einzeln zu prüfen, statt den gesamten Zustand pauschal als "Scheduling-Problem" zu behandeln.

~~~text
Resource requests: pod declares minimum needed CPU/memory -> scheduler checks against each node's AVAILABLE (unallocated) capacity
Affinity/anti-affinity: preference/requirement to be NEAR or AWAY FROM specific other pods
  (e.g. anti-affinity: multiple replicas of the same app should NOT run on the same node -- avoid losing all on one node failure)
Topology Spread Constraints: EXPLICITLY spread pods evenly across a topology dimension (zones, nodes)
  WITHOUT this: standard scheduler can randomly concentrate multiple replicas in the SAME availability zone
  -> a zone failure could take down ALL replicas despite formally having "multiple replicas"
Pod stuck "Pending": NO node+cluster-state combination satisfies ALL declared constraints simultaneously
  -> correct diagnosis: check EACH constraint category (resources, affinity, taints, topology spread) SEPARATELY
~~~

## Core Concepts, Architektur und Implementierung

| Constraint-Typ | Zweck | Symptom bei Verletzung |
|---|---|---|
| Ressourcen-Requests | stellt sicher, dass ein Knoten ausreichend Kapazität hat | Pod bleibt "Pending" mit "Insufficient cpu/memory"-Meldung |
| Affinity/Anti-Affinity | steuert Nähe/Distanz zu anderen Pods | Pod bleibt "Pending", wenn keine Knoten-Kombination die Regel erfüllt |
| Taints/Tolerations | schränkt zulässige Knoten weiter ein | Pod bleibt "Pending", wenn kein tolerierter Knoten verfügbar ist |
| Topology Spread Constraints | verteilt Replicas explizit über Fehlerdomänen | Pods konzentrieren sich unbeabsichtigt in einer einzelnen Zone/einem einzelnen Knoten |

Implementierung: Für Anwendungen mit mehreren Replicas werden explizite Topology Spread Constraints konfiguriert, die eine gleichmäßige Verteilung über Verfügbarkeitszonen oder Knoten erzwingen, statt sich auf zufällig gute Verteilung durch Standard-Scheduling zu verlassen. Anti-Affinity-Regeln stellen sicher, dass kritische Replicas nicht versehentlich auf demselben Knoten konzentriert werden. Bei einem dauerhaft nicht platzierbaren Pod wird systematisch jede Constraint-Kategorie einzeln geprüft (reicht die verfügbare Ressourcenkapazität aus? sind Affinity-Anforderungen erfüllbar? gibt es einen Knoten mit passenden Tolerations?), um die konkrete Ursache zu identifizieren, statt alle Constraints gleichzeitig zu lockern.

## Scalability, Reliability, Security und Observability

Explizite Topology-Spread-Konfiguration skaliert tatsächliche Ausfalltoleranz proportional zur Anzahl unabhängiger Fehlerdomänen, über die Replicas verteilt werden; die Reliability-Grenze liegt darin, dass fehlende Topology-Spread-Constraints proportional zur Wahrscheinlichkeit zufälliger Zonen-Konzentration das Risiko eines vollständigen Anwendungsausfalls bei einem einzelnen Zonenausfall erhöhen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Pod bleibt dauerhaft im Zustand "Pending" | eine oder mehrere Scheduling-Constraints (Ressourcen, Affinity, Taints) können von keinem verfügbaren Knoten erfüllt werden | jede Constraint-Kategorie einzeln gegen den aktuellen Cluster-Zustand prüfen, um die konkret verletzte Constraint zu identifizieren |
| ein Ausfall einer einzelnen Verfügbarkeitszone führt zum vollständigen Ausfall einer Anwendung mit mehreren Replicas | alle Replicas wurden ohne explizite Topology-Spread-Constraints zufällig in derselben Zone platziert | Topology Spread Constraints konfigurieren, die eine explizite, gleichmäßige Verteilung über Zonen erzwingen |
| ein Knoten wird trotz ausreichender freier Ressourcenkapazität für einen bestimmten Pod nicht verwendet | eine Affinity-Regel oder ein fehlender, passender Taint-Toleration-Match schließt diesen Knoten aus | die konfigurierten Affinity-Regeln und Taints des betroffenen Knotens gegen die Pod-Spezifikation prüfen |

Security: Fehlende Isolation durch Anti-Affinity oder Topology Spread kann dazu führen, dass sicherheitskritische Workloads unbeabsichtigt auf demselben Knoten wie weniger vertrauenswürdige Workloads platziert werden, was die Trennungswirkung zwischen unterschiedlichen Vertrauenszonen untergräbt. Observability: Die tatsächliche Verteilung von Pod-Replicas über Knoten und Verfügbarkeitszonen, sowie die Häufigkeit und Dauer von "Pending"-Zuständen aufgrund unerfüllbarer Constraints, sind zentrale Scheduling-Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert explizite Topology Spread Constraints für alle Anwendungen mit mehreren Replicas. **Principal** macht die tatsächliche Verteilung von Replicas über Fehlerdomänen für das Team nachvollziehbar. **Chief** etabliert explizite Topology-Spread-Constraints als Standard für ausfalltolerante Workload-Platzierung im Unternehmen, statt sich auf zufällig gute Verteilung zu verlassen.

Anti-Patterns: sich bei Anwendungen mit mehreren Replicas auf zufällig gute Verteilung durch Standard-Scheduling verlassen, ohne explizite Topology Spread Constraints zu konfigurieren; bei einem dauerhaft "Pending" bleibenden Pod alle Constraints pauschal lockern, statt die konkret verletzte Constraint zu identifizieren; Ressourcen-Requests unrealistisch niedrig ansetzen, um Scheduling-Probleme kurzfristig zu vermeiden, was zu Ressourcenkonflikten zur Laufzeit führt.

## Production Checklist

- [ ] Anwendungen mit mehreren Replicas verwenden explizite Topology Spread Constraints über relevante Fehlerdomänen.
- [ ] Ressourcen-Requests spiegeln den tatsächlichen minimalen Bedarf realistisch wider.
- [ ] Bei einem "Pending"-Pod wird jede Constraint-Kategorie einzeln diagnostiziert.
- [ ] Die tatsächliche Verteilung von Replicas über Knoten/Zonen wird regelmäßig überwacht.

## Interviewfragen

### 1. Was prüft der Scheduler bei Ressourcen-Requests eines Pods?

**Antwort:** Ob ein Knoten ausreichend freie, noch nicht durch andere Pods belegte Kapazität besitzt, um die deklarierten minimalen Ressourcenanforderungen des Pods zu erfüllen.

### 2. Was ist der Unterschied zwischen Anti-Affinity und Topology Spread Constraints?

**Antwort:** Anti-Affinity drückt aus, dass bestimmte Pods nicht auf demselben Knoten laufen sollen; Topology Spread Constraints gehen weiter und erzwingen eine explizite, gleichmäßige Verteilung über eine ganze Topologie-Dimension wie Verfügbarkeitszonen.

### 3. Warum kann eine Anwendung mit mehreren Replicas trotzdem vollständig ausfallen, wenn keine Topology Spread Constraints konfiguriert sind?

**Antwort:** Ohne explizite Steuerung kann der Standard-Scheduler alle Replicas zufällig in derselben Verfügbarkeitszone platzieren, sodass ein Ausfall dieser einen Zone alle Replicas gleichzeitig betrifft.

### 4. Wie diagnostizierst du einen dauerhaft im Zustand "Pending" verbleibenden Pod?

**Antwort:** Ich prüfe jede Constraint-Kategorie (Ressourcen-Requests, Affinity/Anti-Affinity, Taints/Tolerations) einzeln gegen den aktuellen Cluster-Zustand, um die konkret verletzte Constraint zu identifizieren, statt alle Constraints pauschal zu lockern.

### 5. Wie stellst du sicher, dass Replicas einer Anwendung tatsächlich ausfalltolerant über Zonen verteilt sind?

**Antwort:** Ich konfiguriere explizite Topology Spread Constraints, die eine gleichmäßige Verteilung über die relevante Topologie-Dimension (z. B. Verfügbarkeitszonen) erzwingen, statt mich auf zufällig gute Standard-Verteilung zu verlassen.

### 6. Widersprüchliche Anforderung: Team will maximale Ressourceneffizienz durch dichte Pod-Platzierung UND garantierte Ausfalltoleranz über mehrere Zonen — wie gehst du vor?

**Antwort:** Ich würde Topology Spread Constraints mit einem angemessenen "maxSkew"-Wert konfigurieren, der eine gewisse, aber begrenzte Ungleichverteilung zulässt, um Ressourceneffizienz zu erhalten, während gleichzeitig eine Mindestverteilung über mehrere Zonen garantiert bleibt, sodass keine einzelne Zone alle Replicas gleichzeitig verlieren kann.

## Praktische Labs

~~~python
class SimulatedNode:
    def __init__(self, name, zone, available_cpu, taints=None):
        self.name = name
        self.zone = zone
        self.available_cpu = available_cpu
        self.taints = taints or []

class SimulatedPod:
    def __init__(self, cpu_request, tolerations=None, required_zone=None):
        self.cpu_request = cpu_request
        self.tolerations = tolerations or []
        self.required_zone = required_zone

def diagnose_placement(pod, nodes):
    reasons = []
    for node in nodes:
        node_reasons = []
        if node.available_cpu < pod.cpu_request:
            node_reasons.append("insufficient CPU")
        for taint in node.taints:
            if taint not in pod.tolerations:
                node_reasons.append(f"untolerated taint '{taint}'")
        if pod.required_zone and node.zone != pod.required_zone:
            node_reasons.append("zone mismatch")
        if not node_reasons:
            return f"Pod CAN be scheduled on '{node.name}'."
        reasons.append(f"{node.name}: {', '.join(node_reasons)}")
    return "Pod is UNSCHEDULABLE (Pending). Reasons per node:\n  " + "\n  ".join(reasons)

nodes = [
    SimulatedNode("node-1", zone="zone-a", available_cpu=2),
    SimulatedNode("node-2", zone="zone-b", available_cpu=1, taints=["gpu-only"]),
]

pod = SimulatedPod(cpu_request=4)  # requests more than any node has available
print(diagnose_placement(pod, nodes))
~~~

## Dependencies, Cross-References und Quellen

1. Kubernetes-Dokumentation: [Assigning Pods to Nodes](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/), abgerufen 2026-09-17.
2. Kubernetes-Dokumentation: [Pod Topology Spread Constraints](https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/), abgerufen 2026-09-17.

Pods und Lebenszyklen sind kanonisch in [KB-0384](06-pods-und-lebenszyklen.md) behandelt; DaemonSets und Node-Dienste in [KB-0387](09-daemonsets-und-node-dienste.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Scheduling-Diagnosewerkzeuge, die "Pending"-Gründe für jeden geprüften Knoten strukturiert aufschlüsseln | Adopting | Gegenüber manueller Log-Analyse für schnellere, systematischere Diagnose bevorzugen. |
| Erweiterte, benutzerdefinierte Scheduler-Plugins für spezialisierte Platzierungslogik (z. B. GPU-Topologie-Bewusstsein) | Evaluating | Gegenüber Standard-Scheduler-Constraints abwägen, sobald der Anwendungsfall spezialisierte, nicht standardmäßig abbildbare Logik tatsächlich erfordert. |

Ein Team akzeptiert eine Multi-Replica-Deployment-Konfiguration erst, wenn explizite Topology Spread Constraints eine tatsächliche Verteilung über unabhängige Fehlerdomänen sicherstellen.
