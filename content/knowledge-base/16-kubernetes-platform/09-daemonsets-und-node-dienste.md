---
{"id": "KB-0387", "title": "DaemonSets und Node-Dienste", "domain": "16", "sequence": 9, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0384", "concepts": ["Pods und Lebenszyklen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein DaemonSet mit minimal notwendigen Privilegien für einen Telemetrie-Agenten erstellen und dessen automatische Ausrollung auf neu hinzukommende Knoten beobachten.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein DaemonSet-Update-Verfahren gestalten, das die Verfügbarkeit knotenkritischer Dienste (Netzwerk, Telemetrie) während des Rollouts nicht gefährdet.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein DaemonSet-Pod auf bestimmten Knoten aufgrund von Taints fehlt, obwohl er dort eigentlich benötigt wird, und dies auf eine fehlende Toleration statt auf einen allgemeinen Ausrollfehler zurückführen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Minimal privilegierte DaemonSet-Konfigurationen als Standard für knotenweite Agenten im Unternehmen etablieren, um die Angriffsfläche node-privilegierter Dienste zu begrenzen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene DaemonSet-Update-Strategien (OnDelete vs. RollingUpdate) im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis von Taints/Tolerations und minimaler Privilegierung, nicht jede Update-Strategie-Feinheit."}}, "lab_validation": [{"lab_id": "KB-0387-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes DaemonSet-Modell mit einem getainteten Knoten ohne passende Toleration", "evidence": "Ein simuliertes DaemonSet wird korrekt auf allen Knoten außer einem mit einem spezifischen Taint ausgerollt, da der DaemonSet-Pod keine passende Toleration für diesen Taint besitzt; nach Hinzufügen der Toleration wird der Pod auch auf dem zuvor ausgeschlossenen Knoten korrekt ausgerollt.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, künstlich konstruiertes Taint-Szenario."}]}
---
# DaemonSets und Node-Dienste

> **Ziel:** Ein DaemonSet stellt sicher, dass genau eine Instanz eines Pods auf jedem (oder einer definierten Teilmenge) der Knoten im Cluster läuft, aufbauend auf den Pod-Grundlagen (siehe [KB-0384](06-pods-und-lebenszyklen.md)). Der zentrale Anwendungsfall sind knotenbezogene Dienste wie Telemetrie-Agenten oder Netzwerk-Agenten, die auf jedem Knoten präsent sein müssen. Der zentrale Punkt dieses Kapitels ist die Steuerung, welche Knoten tatsächlich einen DaemonSet-Pod erhalten (über Taints und Tolerations), sowie das zuverlässige Ausrollen mit begrenztem, minimal notwendigem Privilegierungsumfang.

## Zweck, Mental Model und Dependencies

Im Gegensatz zu einem Deployment, das eine bestimmte Anzahl austauschbarer Replicas über den Cluster verteilt, erstellt ein DaemonSet automatisch genau einen Pod pro passendem Knoten — kommt ein neuer Knoten zum Cluster hinzu, erhält er automatisch eine Instanz; wird ein Knoten entfernt, wird die zugehörige Instanz mit entfernt. Dieses Modell eignet sich für Dienste, die logisch an den Knoten selbst gebunden sind, nicht an die Anwendungslast (z. B. ein Netzwerk-Agent, der den Netzwerkverkehr auf genau diesem Knoten überwacht, oder ein Log-Sammler, der die Logs genau dieses Knotens erfasst). Ein Taint ist eine Markierung auf einem Knoten, die verhindert, dass Pods dort standardmäßig geplant werden, es sei denn, ein Pod besitzt eine passende Toleration (eine explizite Erlaubnis, trotz des Taints auf diesem Knoten zu laufen). Für DaemonSets, die tatsächlich auf jedem Knoten laufen sollen — einschließlich speziell markierter Knoten (z. B. solche mit dedizierten GPUs oder eingeschränkter Nutzung) — müssen entsprechende Tolerations explizit konfiguriert werden; fehlt eine passende Toleration, fehlt der DaemonSet-Pod auf diesem Knoten, was leicht fälschlich als allgemeiner Ausrollfehler statt als spezifisches Taint-/Toleration-Problem interpretiert werden kann. Da DaemonSets oft privilegierten Zugriff auf Knotenressourcen benötigen (z. B. Netzwerk-Namespace-Zugriff für einen Netzwerk-Agenten), ist die Beschränkung auf den tatsächlich minimal notwendigen Privilegierungsumfang ein zentraler Sicherheitsaspekt — ein DaemonSet-Pod mit übermäßigen Rechten stellt eine besonders große Angriffsfläche dar, da er auf jedem Knoten des Clusters gleichzeitig läuft.

~~~text
Deployment: N interchangeable replicas distributed across the cluster
DaemonSet: EXACTLY ONE pod per matching node -- new node joins -> automatically gets an instance
  fits node-BOUND services (network agent, log collector for THIS specific node), not application load
Taint: node marking that PREVENTS scheduling by default -- unless a pod has a matching TOLERATION
  DaemonSet meant to run EVERYWHERE (including specially-tainted nodes, e.g. GPU nodes) needs EXPLICIT tolerations
  -> missing toleration -> pod missing on that node -- easily mistaken for a generic rollout failure
SECURITY NOTE: DaemonSets often need privileged node access (e.g. network namespace for a network agent)
  -> minimal necessary privilege is CRITICAL -- an over-privileged DaemonSet pod is a huge attack surface,
     since it runs on EVERY node simultaneously
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Risiko bei Fehlkonfiguration |
|---|---|---|
| DaemonSet-Scheduling | genau ein Pod pro passendem Knoten | ohne passende Tolerations fehlt der Pod auf getainteten Knoten |
| Taint/Toleration | steuert, welche Knoten einen Pod erhalten | fehlende Toleration wird leicht als allgemeiner Rollout-Fehler fehlinterpretiert |
| Privilegierungsumfang | bestimmt, welche Knotenressourcen der Pod zugreifen kann | übermäßige Privilegien vergrößern die Angriffsfläche über den gesamten Cluster |

Implementierung: Für knotenbezogene Dienste (Telemetrie, Netzwerk-Agenten) wird ein DaemonSet statt eines Deployments verwendet. Für Knoten mit speziellen Taints (z. B. dedizierte GPU-Knoten), auf denen der DaemonSet-Pod dennoch laufen soll, werden explizite, minimal notwendige Tolerations konfiguriert. Der Privilegierungsumfang des DaemonSet-Pods wird auf die tatsächlich benötigten Berechtigungen beschränkt (z. B. nur die konkret benötigten Linux-Capabilities statt vollständiger Root-Rechte), statt pauschal privilegierten Zugriff zu gewähren. Bei einem Update-Rollout eines DaemonSets wird die Update-Strategie (typischerweise RollingUpdate mit begrenzter Parallelität) so konfiguriert, dass knotenkritische Dienste nicht gleichzeitig auf zu vielen Knoten gleichzeitig unterbrochen werden.

## Scalability, Reliability, Security und Observability

DaemonSets skalieren automatisch mit der Anzahl der Knoten im Cluster, ohne manuelle Anpassung einer Replica-Anzahl; die Reliability-Grenze liegt darin, dass fehlende Tolerations proportional zur Anzahl spezialisierter (getainteter) Knoten im Cluster zu unvollständiger, aber leicht übersehener Abdeckung führen können.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Telemetrie-Agent fehlt auf bestimmten Knoten, obwohl das DaemonSet allgemein funktioniert | diese Knoten besitzen einen Taint, für den der DaemonSet-Pod keine passende Toleration hat | die Taints der betroffenen Knoten mit den konfigurierten Tolerations des DaemonSets vergleichen |
| ein knotenkritischer Dienst (z. B. ein Netzwerk-Agent) fällt während eines DaemonSet-Updates gleichzeitig auf zu vielen Knoten aus | die Update-Strategie erlaubt zu hohe Parallelität während des Rollouts | die Update-Strategie auf eine begrenztere, sequenziellere Parallelität umstellen |
| ein kompromittierter DaemonSet-Pod ermöglicht einem Angreifer weitreichenden Zugriff auf mehrere Knoten gleichzeitig | der DaemonSet-Pod läuft mit übermäßigen, nicht tatsächlich benötigten Privilegien | den Privilegierungsumfang auf die minimal notwendigen Berechtigungen reduzieren |

Security: Da ein DaemonSet-Pod auf jedem Knoten gleichzeitig läuft, vervielfacht eine übermäßige Privilegierung das Risiko einer clusterweiten Kompromittierung im Vergleich zu einem einzelnen, kompromittierten Deployment-Pod; minimal notwendige Privilegierung ist daher besonders kritisch. Observability: Die Abdeckungsrate des DaemonSets (Anteil der Knoten mit tatsächlich laufendem Pod gegenüber der Gesamtanzahl relevanter Knoten), sowie Diskrepanzen zwischen erwarteter und tatsächlicher Abdeckung aufgrund von Taints, sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert minimal notwendige Privilegierung und explizite, begründete Tolerations für jedes DaemonSet. **Principal** macht die Abdeckungslücken durch Taints für das Team nachvollziehbar. **Chief** etabliert minimal privilegierte DaemonSet-Konfigurationen als Standard für knotenweite Agenten im Unternehmen, um die Angriffsfläche zu begrenzen.

Anti-Patterns: einem DaemonSet-Pod pauschal volle Root-Privilegien statt der tatsächlich benötigten minimalen Berechtigungen gewähren; eine fehlende Abdeckung auf getainteten Knoten als allgemeinen Ausrollfehler statt als Taint-/Toleration-Problem diagnostizieren; ein DaemonSet-Update mit unbegrenzter Parallelität ausrollen, wodurch knotenkritische Dienste gleichzeitig auf zu vielen Knoten unterbrochen werden.

## Production Checklist

- [ ] DaemonSet-Pods laufen mit minimal notwendigem Privilegierungsumfang.
- [ ] Explizite, begründete Tolerations sind für Knoten mit relevanten Taints konfiguriert.
- [ ] Die Update-Strategie begrenzt die gleichzeitige Unterbrechung knotenkritischer Dienste.
- [ ] Die tatsächliche Abdeckung des DaemonSets über alle relevanten Knoten wird überwacht.

## Interviewfragen

### 1. Was unterscheidet ein DaemonSet von einem Deployment?

**Antwort:** Ein DaemonSet stellt genau einen Pod pro passendem Knoten sicher (automatisch bei neuen Knoten), während ein Deployment eine bestimmte Anzahl austauschbarer Replicas über den Cluster verteilt.

### 2. Was ist die Beziehung zwischen Taints und Tolerations bei DaemonSets?

**Antwort:** Ein Taint verhindert standardmäßig die Planung von Pods auf einem Knoten; ein DaemonSet-Pod benötigt eine passende Toleration, um trotz eines Taints auf diesem Knoten zu laufen.

### 3. Warum ist minimal notwendige Privilegierung bei DaemonSets besonders wichtig?

**Antwort:** Da ein DaemonSet-Pod auf jedem Knoten gleichzeitig läuft, vervielfacht eine übermäßige Privilegierung das Risiko einer clusterweiten Kompromittierung im Vergleich zu einem einzelnen Deployment-Pod.

### 4. Wie diagnostizierst du, dass ein DaemonSet-Pod auf bestimmten Knoten fehlt?

**Antwort:** Ich prüfe, ob diese Knoten einen Taint besitzen, für den der DaemonSet-Pod keine passende Toleration konfiguriert hat, statt einen allgemeinen Ausrollfehler anzunehmen.

### 5. Wie stellst du sicher, dass ein DaemonSet-Update knotenkritische Dienste nicht gleichzeitig auf zu vielen Knoten unterbricht?

**Antwort:** Ich konfiguriere die Update-Strategie mit begrenzter Parallelität (z. B. RollingUpdate mit einer kleinen maxUnavailable-Zahl), sodass immer nur ein begrenzter Anteil der Knoten gleichzeitig ohne den Dienst ist.

### 6. Widersprüchliche Anforderung: Team will einen Telemetrie-Agenten garantiert auf jedem Knoten (auch speziellen) UND minimale Privilegierung dieses Agenten — wie gehst du vor?

**Antwort:** Ich würde explizite, minimal notwendige Tolerations für die speziellen Knoten-Taints konfigurieren, um die vollständige Abdeckung sicherzustellen, während der Privilegierungsumfang des Agenten selbst unabhängig davon auf die tatsächlich benötigten Berechtigungen (z. B. spezifische Linux-Capabilities statt vollständiger Root-Rechte) beschränkt bleibt — beide Anforderungen sind unabhängig voneinander konfigurierbar.

## Praktische Labs

~~~python
class SimulatedNode:
    def __init__(self, name, taints=None):
        self.name = name
        self.taints = taints or []

class SimulatedDaemonSet:
    def __init__(self, tolerations=None):
        self.tolerations = tolerations or []

    def can_schedule_on(self, node):
        for taint in node.taints:
            if taint not in self.tolerations:
                return False
        return True

nodes = [
    SimulatedNode("node-1"),
    SimulatedNode("node-2", taints=["gpu-only"]),
    SimulatedNode("node-3"),
]

daemonset_without_toleration = SimulatedDaemonSet(tolerations=[])
daemonset_with_toleration = SimulatedDaemonSet(tolerations=["gpu-only"])

print("Coverage WITHOUT matching toleration:")
for node in nodes:
    print(f"  {node.name}: scheduled={daemonset_without_toleration.can_schedule_on(node)}")

print("\nCoverage WITH matching toleration for 'gpu-only' taint:")
for node in nodes:
    print(f"  {node.name}: scheduled={daemonset_with_toleration.can_schedule_on(node)}")
~~~

## Dependencies, Cross-References und Quellen

1. Kubernetes-Dokumentation: [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/), abgerufen 2026-09-17.
2. Kubernetes-Dokumentation: [Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/), abgerufen 2026-09-17.

Pods und Lebenszyklen sind kanonisch in [KB-0384](06-pods-und-lebenszyklen.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| eBPF-basierte, weniger privilegierte Alternativen zu klassischen, vollständig privilegierten Netzwerk-/Observability-Agenten | Adopting | Gegenüber traditionell vollständig privilegierten Agenten für reduzierte Angriffsfläche bevorzugen. |
| Automatisierte DaemonSet-Abdeckungsprüfungswerkzeuge, die fehlende Toleration-Konfigurationen proaktiv erkennen | Evaluating | Gegenüber manueller Taint-/Toleration-Prüfung abwägen, sobald ein zuverlässiges Werkzeug für die konkrete Cluster-Umgebung verfügbar ist. |

Ein Team akzeptiert eine DaemonSet-Konfiguration erst, wenn minimale Privilegierung und vollständige, begründete Knotenabdeckung nachgewiesen sind.
