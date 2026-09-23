---
{"id": "KB-0433", "title": "GPU-Scheduling und Topologie", "domain": "17", "sequence": 21, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "MLOPS"], "requires": [{"id": "KB-0417", "concepts": ["NVIDIA Device Plugin"], "needed_for": "understanding"}, {"id": "KB-0432", "concepts": ["Kueue und Volcano, Gang Scheduling"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Erklären können, warum die physische Verbindungstopologie zwischen GPUs (z. B. über NVLink/NVSwitch) und die NUMA-Zugehörigkeit eines Nodes die effektive Kommunikationsleistung verteilter GPU-Workloads beeinflussen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Placement-Anforderungen für einen konkreten verteilten GPU-Workload (z. B. Tensor-Parallelität über mehrere GPUs) begründet formulieren, basierend auf dessen tatsächlichem Kommunikationsmuster zwischen den GPUs.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Leistungseinbuße eines verteilten GPU-Workloads auf eine ungünstige Platzierung (z. B. GPUs ohne direkte NVLink-Verbindung oder über NUMA-Grenzen hinweg) zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Topologie-bewusste Placement-Richtlinien für GPU-Cluster im Unternehmen anhand gemessener Kommunikationsleistung statt anhand pauschaler Standardplatzierung festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung topologie-bewusster Scheduler-Erweiterungen im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Lokalität, Fragmentierung und Placement-Trade-offs als Entscheidungsgrundlage, nicht die Scheduler-Erweiterungs-Interna."}}, "lab_validation": [{"lab_id": "KB-0433-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Konzeptuelle Einordnung anhand von NVIDIA-Architekturdokumentation und Kubernetes-Topologie-Scheduling-Dokumentation, kein aktives Cluster-Deployment verwendet", "evidence": "Anhand offizieller NVIDIA-Dokumentation zu NVLink/NVSwitch-Verbindungstopologien und Kubernetes-Dokumentation zu NUMA-bewusstem Scheduling (Topology Manager) wird nachvollzogen, warum die physische Platzierung von GPUs innerhalb eines Nodes und die Zuordnung zu NUMA-Domänen die Kommunikationsleistung verteilter Workloads beeinflusst, und wie topologie-bewusstes Scheduling dies berücksichtigen kann.", "limitations": "Kein reales Cluster-Deployment getestet, keine realen Kommunikationsleistungsmessungen erhoben. entsprechend werden keine Aussagen über eigene praktische Vertiefung dieser Technologien getroffen."}]}
---
# GPU-Scheduling und Topologie

> **Ziel:** GPUs innerhalb eines Nodes sind nicht gleichwertig verbunden — manche GPU-Paare haben eine direkte, hochbandbreitige Verbindung (z. B. über NVLink/NVSwitch), während andere Paare über einen langsameren, gemeinsam genutzten Pfad (z. B. PCIe, möglicherweise über eine NUMA-Grenze hinweg) kommunizieren müssen. Der zentrale Punkt dieses Kapitels ist, dass für verteilte GPU-Workloads mit intensiver Inter-GPU-Kommunikation (z. B. Tensor-Parallelität, siehe NVIDIA Device Plugin, [KB-0417](05-nvidia-device-plugin.md)) diese physische Verbindungstopologie einen erheblichen Einfluss auf die tatsächliche Leistung hat — eine Platzierung, die diese Topologie ignoriert, kann trotz identischer GPU-Anzahl zu deutlich schlechterer Leistung führen als eine topologie-bewusste Platzierung, was anhand konkreter Workload-Kommunikationsmuster begründet werden muss, nicht anhand pauschaler Annahmen.

## Zweck, Mental Model und Dependencies

Innerhalb eines Servers mit mehreren GPUs existiert typischerweise eine heterogene Verbindungstopologie: Manche GPU-Paare sind über eine dedizierte, hochbandbreitige Verbindung direkt verbunden, andere müssen über einen gemeinsam genutzten, langsameren Bus kommunizieren, und manche GPUs gehören zu unterschiedlichen NUMA-Domänen (Non-Uniform Memory Access, siehe Systemarchitektur-Grundlagen), was zusätzliche Latenz beim Zugriff auf CPU-seitigen Speicher oder bei der Kommunikation zwischen GPUs unterschiedlicher NUMA-Zugehörigkeit bedeuten kann. Für einen verteilten Workload, dessen Komponenten (z. B. Tensor-Parallelitäts-Shards eines großen Modells) intensiv und häufig miteinander kommunizieren müssen, ist es daher relevant, auf welchen konkreten GPUs die einzelnen Komponenten platziert werden — eine Platzierung auf GPUs mit direkter, hochbandbreitiger Verbindung kann die Kommunikationslatenz gegenüber einer Platzierung über eine langsamere Verbindung oder eine NUMA-Grenze hinweg erheblich reduzieren. Der zentrale methodische Punkt ist, dass dieser Topologie-Effekt proportional zur tatsächlichen Kommunikationsintensität des Workloads relevant ist — für Workloads mit wenig Inter-GPU-Kommunikation (z. B. unabhängige Datenparallelität ohne häufigen Gradientenaustausch) ist die Topologie-Platzierung weniger kritisch als für Workloads mit intensiver, häufiger Kommunikation zwischen den GPUs.

~~~text
GPU connection topology within a node is HETEROGENEOUS:
  some GPU pairs: direct, high-bandwidth link (e.g. NVLink/NVSwitch)
  other pairs: slower, shared bus (e.g. PCIe), possibly crossing a NUMA boundary (extra latency)
Distributed workload with intensive inter-GPU communication (e.g. tensor parallelism):
  placement on directly-linked GPUs -> significantly lower communication latency
  placement across slow link / NUMA boundary -> significantly worse performance, SAME GPU count
KEY METHODOLOGICAL POINT: relevance scales with ACTUAL communication intensity
  low inter-GPU communication (e.g. independent data parallelism) -> topology less critical
  high, frequent inter-GPU communication -> topology-aware placement matters significantly
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Verbindungstopologie (NVLink/PCIe) | bestimmt Bandbreite/Latenz zwischen GPU-Paaren | muss gegen das tatsächliche Kommunikationsmuster des Workloads geprüft werden |
| NUMA-Domänen | beeinflussen Speicher-/GPU-Zugriffslatenz | Platzierung über NUMA-Grenzen hinweg kann zusätzliche Latenz bedeuten |
| Fragmentierung | ungünstig verteilte, nicht zusammenhängende GPU-Zuteilung | kann topologie-optimale Platzierung für nachfolgende Workloads verhindern |
| Placement-Begründung | explizite Entscheidung basierend auf Workload-Kommunikationsmuster | pauschale, unbegründete Platzierung riskiert unnötige Leistungseinbußen |

Implementierung: Für einen verteilten GPU-Workload wird zunächst dessen tatsächliches Kommunikationsmuster analysiert (z. B. wie häufig und intensiv Tensor-Parallelitäts-Shards untereinander kommunizieren müssen), um zu bestimmen, ob eine topologie-bewusste Platzierung relevant ist. Bei Workloads mit intensiver Inter-GPU-Kommunikation wird die Platzierung so konfiguriert, dass beteiligte GPUs bevorzugt über direkte, hochbandbreitige Verbindungen und innerhalb derselben NUMA-Domäne zugewiesen werden. Bei der Kapazitätsplanung eines Clusters wird geprüft, ob wiederholte, unkoordinierte GPU-Zuteilung zu Fragmentierung führt, die eine topologie-optimale Platzierung für nachfolgende Workloads erschwert.

## Scalability, Reliability, Security und Observability

Topologie-bewusstes GPU-Scheduling skaliert die tatsächliche Kommunikationsleistung verteilter Workloads proportional zur Passgenauigkeit der Platzierung zum tatsächlichen Kommunikationsmuster; die Reliability-Grenze liegt darin, dass eine topologie-ignorierende Platzierung proportional zur Kommunikationsintensität des Workloads zu signifikanten, aber schwer diagnostizierbaren Leistungseinbußen führt, wenn die zugrunde liegende Ursache nicht auf die physische Verbindungstopologie zurückgeführt wird.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein verteilter GPU-Workload zeigt trotz identischer GPU-Anzahl deutlich schlechtere Leistung als erwartet | die zugewiesenen GPUs sind nicht direkt verbunden oder liegen über eine NUMA-Grenze hinweg | die tatsächliche Verbindungstopologie der zugewiesenen GPUs prüfen und mit einer topologie-optimierten Platzierung vergleichen |
| die Leistung schwankt zwischen mehreren Ausführungen desselben Workloads erheblich | der Scheduler platziert den Workload bei unterschiedlichen Ausführungen auf unterschiedlich verbundenen GPU-Sets | eine explizite, topologie-bewusste Placement-Anforderung konfigurieren, statt die Platzierung dem Standard-Scheduler ungeprüft zu überlassen |
| GPU-Kapazität bleibt trotz wartender Workloads fragmentiert ungenutzt | wiederholte, unkoordinierte Zuteilung hat zu einer Fragmentierung geführt, die keine zusammenhängende, topologie-optimale Zuteilung mehr erlaubt | die Zuteilungshistorie auf Fragmentierungsmuster prüfen und gegebenenfalls eine Konsolidierung einplanen |

Security: Die topologie-bewusste Platzierung sollte nicht dazu führen, dass GPU-Ressourcen mehrerer, nicht vertrauenswürdiger Mandanten ohne angemessene Isolation auf denselben, eng verbundenen GPU-Sets platziert werden. Observability: Die tatsächliche Inter-GPU-Kommunikationslatenz, die Verbindungstopologie der zugewiesenen GPUs, und der Fragmentierungsgrad der Cluster-GPU-Kapazität sind zentrale Metriken zur Bewertung der Placement-Qualität.

## Trade-offs und Entscheidungen

**Staff** analysiert das tatsächliche Kommunikationsmuster eines verteilten GPU-Workloads, bevor eine topologie-bewusste Platzierung konfiguriert wird. **Principal** macht die Placement-Begründung und deren Auswirkung auf die Leistung für das Team nachvollziehbar. **Chief** legt topologie-bewusste Placement-Richtlinien für GPU-Cluster im Unternehmen anhand gemessener Kommunikationsleistung fest.

Anti-Patterns: verteilte GPU-Workloads mit intensiver Inter-GPU-Kommunikation ohne Prüfung der tatsächlichen Verbindungstopologie platzieren; unspezifische Stack- oder Profilerwähnungen von Verbindungstechnologien (NVLink, InfiniBand) als praktische Vertiefung ausgeben, ohne eine konkrete, dokumentierte Evidenz; wiederholte, unkoordinierte GPU-Zuteilung ohne Beachtung entstehender Fragmentierung vornehmen.

## Production Checklist

- [ ] Das tatsächliche Kommunikationsmuster verteilter GPU-Workloads wurde vor der Placement-Entscheidung analysiert.
- [ ] Workloads mit intensiver Inter-GPU-Kommunikation werden topologie-bewusst platziert.
- [ ] Die Zuteilungshistorie wird auf Fragmentierung geprüft.
- [ ] Inter-GPU-Kommunikationslatenz und Verbindungstopologie der zugewiesenen GPUs werden überwacht.

## Interviewfragen

### 1. Warum sind nicht alle GPUs innerhalb eines Servers gleichwertig verbunden?

**Antwort:** Manche GPU-Paare haben eine direkte, hochbandbreitige Verbindung (z. B. NVLink), während andere über einen langsameren, gemeinsam genutzten Bus (z. B. PCIe) kommunizieren, möglicherweise zusätzlich über eine NUMA-Grenze hinweg.

### 2. Für welche Art von Workload ist die GPU-Verbindungstopologie besonders relevant?

**Antwort:** Für verteilte Workloads mit intensiver, häufiger Inter-GPU-Kommunikation, wie z. B. Tensor-Parallelität; für Workloads mit wenig Inter-GPU-Kommunikation ist die Topologie weniger kritisch.

### 3. Was ist Fragmentierung im Kontext von GPU-Scheduling, und welches Problem verursacht sie?

**Antwort:** Eine ungünstig verteilte, nicht zusammenhängende GPU-Zuteilung, die eine topologie-optimale, zusammenhängende Platzierung für nachfolgende Workloads erschwert.

### 4. Wie begründest du eine Placement-Entscheidung für einen konkreten verteilten GPU-Workload?

**Antwort:** Anhand des tatsächlichen Kommunikationsmusters des Workloads — bei intensiver Inter-GPU-Kommunikation wird eine Platzierung auf direkt verbundenen, gleichen-NUMA-Domänen-GPUs begründet, statt eine pauschale Standardplatzierung anzunehmen.

### 5. Wie gehst du vor, wenn ein verteilter GPU-Workload trotz identischer GPU-Anzahl deutlich schlechtere Leistung zeigt?

**Antwort:** Ich prüfe die tatsächliche Verbindungstopologie der zugewiesenen GPUs (direkte Verbindung versus langsamerer Pfad, NUMA-Zugehörigkeit) und vergleiche mit einer topologie-optimierten Platzierung.

### 6. Widersprüchliche Anforderung: Team will maximale GPU-Auslastung (auch fragmentierte Zuteilung akzeptieren) UND maximale Kommunikationsleistung für verteiltes Training — wie gehst du vor?

**Antwort:** Ich würde für kommunikationsintensive, verteilte Trainingsworkloads eine explizite, topologie-bewusste Platzierungsreservierung vorsehen, während unabhängige, weniger kommunikationsintensive Workloads flexibler und fragmentierungstoleranter platziert werden, um beide Ziele im jeweils angemessenen Kontext zu erreichen.

## Praktische Labs

~~~python
# Conceptual topology-aware placement scoring (not executed against a real cluster):

def score_placement(gpu_pair_connection, workload_communication_intensity):
    """gpu_pair_connection: 'nvlink' | 'pcie_same_numa' | 'pcie_cross_numa'
    workload_communication_intensity: 0.0 (low) to 1.0 (high)"""
    penalty = {"nvlink": 0.0, "pcie_same_numa": 0.3, "pcie_cross_numa": 0.7}[gpu_pair_connection]
    expected_slowdown_pct = penalty * workload_communication_intensity * 100
    return round(expected_slowdown_pct, 1)

high_comm_workload_on_nvlink = score_placement("nvlink", workload_communication_intensity=0.9)
high_comm_workload_cross_numa = score_placement("pcie_cross_numa", workload_communication_intensity=0.9)
low_comm_workload_cross_numa = score_placement("pcie_cross_numa", workload_communication_intensity=0.1)

print(f"High-communication workload, NVLink: expected slowdown = {high_comm_workload_on_nvlink}%")
print(f"High-communication workload, cross-NUMA PCIe: expected slowdown = {high_comm_workload_cross_numa}%")
print(f"Low-communication workload, cross-NUMA PCIe: expected slowdown = {low_comm_workload_cross_numa}%")
~~~

## Dependencies, Cross-References und Quellen

1. NVIDIA-Dokumentation: [NVLink and NVSwitch — Connection Topology](https://www.nvidia.com/en-us/data-center/nvlink/), abgerufen 2026-09-17.
2. Kubernetes-Dokumentation: [Control Topology Management Policies on a Node](https://kubernetes.io/docs/tasks/administer-cluster/topology-manager/), abgerufen 2026-09-17.

NVIDIA Device Plugin ist kanonisch in [KB-0417](05-nvidia-device-plugin.md) behandelt; Gang Scheduling in [KB-0432](20-kueue-und-volcano.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, topologie-bewusste Scheduler-Erweiterungen, die Placement basierend auf gemessener Verbindungstopologie automatisch optimieren | Evaluating | Gegenüber manueller Placement-Konfiguration erst nach Prüfung der tatsächlichen Optimierungsqualität für konkrete Workloads bevorzugen. |

Ein Team akzeptiert eine Placement-Konfiguration für kommunikationsintensive, verteilte GPU-Workloads erst, wenn die tatsächliche Kommunikationsleistung gegenüber einer topologie-ignorierenden Platzierung gemessen und nachweislich verbessert wurde.
