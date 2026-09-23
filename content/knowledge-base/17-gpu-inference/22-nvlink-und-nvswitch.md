---
{"id": "KB-0434", "title": "NVLink und NVSwitch", "domain": "17", "sequence": 22, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "MLOPS"], "requires": [{"id": "KB-0413", "concepts": ["GPU-Architektur und Rechenpfade"], "needed_for": "understanding"}, {"id": "KB-0433", "concepts": ["GPU-Scheduling und Topologie"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Den Unterschied zwischen direkter Punkt-zu-Punkt-NVLink-Verbindung und NVSwitch-vermittelter Kommunikation anhand offizieller NVIDIA-Dokumentation erklären können, sowie warum kollektive Kommunikationsoperationen (z. B. All-Reduce) von einer Switch-Topologie profitieren.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Die Entscheidung zwischen einer über NVLink/NVSwitch verbundenen Multi-GPU-Konfiguration und unabhängig über PCIe verbundenen GPUs anhand des tatsächlichen Kommunikationsbedarfs des Workloads begründen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Leistungseinbuße bei kollektiver Kommunikation (All-Reduce, All-Gather) auf eine fehlende oder unvollständige NVLink/NVSwitch-Konnektivität zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Hardwarebeschaffungsentscheidungen für GPU-Cluster im Unternehmen anhand des tatsächlichen, gemessenen Kommunikationsbedarfs der Ziel-Workloads statt anhand pauschaler Hardware-Präferenz treffen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der NVLink-Protokollschicht im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Topologie, Bandbreite und Fehlerdomänen als Entscheidungsgrundlage, nicht die Protokoll-Interna."}}, "lab_validation": [{"lab_id": "KB-0434-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Konzeptuelle Einordnung anhand offizieller NVIDIA-Architekturdokumentation, kein aktives Multi-GPU-System verwendet", "evidence": "Anhand offizieller NVIDIA-Dokumentation zu NVLink- und NVSwitch-Architektur wird nachvollzogen, wie direkte Punkt-zu-Punkt-Verbindungen und switch-vermittelte Topologien die Bandbreite und Fehlerdomänen zwischen GPUs beeinflussen, und warum kollektive Kommunikationsoperationen von einer vollvermaschten, switch-basierten Topologie profitieren können.", "limitations": "Kein reales Multi-GPU-System getestet, keine realen Bandbreiten- oder Latenzmessungen erhoben."}]}
---
# NVLink und NVSwitch

> **Ziel:** NVLink ist eine Hochgeschwindigkeits-Verbindungstechnologie zwischen GPUs, die eine deutlich höhere Bandbreite als der klassische PCIe-Bus (siehe GPU-Architektur, [KB-0413](01-gpu-architektur-und-rechenpfade.md)) bereitstellt; NVSwitch erweitert dies durch eine switch-vermittelte Topologie, die es mehreren GPUs erlaubt, untereinander mit gleichbleibend hoher Bandbreite zu kommunizieren, statt auf paarweise, direkte Punkt-zu-Punkt-Verbindungen beschränkt zu sein. Der zentrale Punkt dieses Kapitels ist, dass diese höhere Bandbreite und die vollvermaschte Topologie insbesondere für kollektive Kommunikationsoperationen (z. B. All-Reduce beim verteilten Training, siehe GPU-Scheduling und Topologie, [KB-0433](21-gpu-scheduling-und-topologie.md)) relevant sind, bei denen viele GPUs gleichzeitig Daten austauschen müssen — für Workloads mit geringem Inter-GPU-Kommunikationsbedarf ist der Vorteil gegenüber unabhängig über PCIe verbundenen GPUs entsprechend geringer, was gegen die höheren Hardwarekosten NVLink/NVSwitch-fähiger Systeme abgewogen werden muss.

## Zweck, Mental Model und Dependencies

Eine direkte NVLink-Verbindung zwischen zwei GPUs stellt eine deutlich höhere Bandbreite bereit als eine Kommunikation über den gemeinsam genutzten PCIe-Bus, der zusätzlich von anderen Systemkomponenten (z. B. Netzwerkkarten, Speichercontrollern) mitgenutzt wird. Bei einer reinen Punkt-zu-Punkt-NVLink-Verbindung zwischen einzelnen GPU-Paaren ist die Kommunikation zwischen nicht direkt verbundenen GPUs jedoch weiterhin auf einen langsameren Pfad angewiesen — NVSwitch löst dieses Problem, indem es als zentraler Vermittler fungiert, über den alle angeschlossenen GPUs mit gleichbleibend hoher Bandbreite miteinander kommunizieren können, unabhängig davon, welches konkrete GPU-Paar kommuniziert. Dies ist besonders relevant für kollektive Kommunikationsoperationen wie All-Reduce (bei dem alle beteiligten GPUs ihre lokal berechneten Gradienten aggregieren und das Ergebnis an alle verteilen müssen) — eine vollvermaschte, switch-basierte Topologie vermeidet Engpässe, die bei einer partiellen, nur paarweisen Verbindungstopologie entstehen könnten, bei der manche Kommunikationspfade über mehrere Zwischenschritte geleitet werden müssten. Der zentrale methodische Punkt ist, dass NVLink/NVSwitch-Hardware einen Kostenaufschlag gegenüber Systemen mit unabhängig über PCIe verbundenen GPUs bedeutet, der nur dann gerechtfertigt ist, wenn der tatsächliche Workload einen entsprechend hohen, häufigen Inter-GPU-Kommunikationsbedarf aufweist — für Workloads mit überwiegend unabhängiger, wenig kommunikationsintensiver Verarbeitung (z. B. viele unabhängige Inferenzanfragen ohne Modellparallelität) ist dieser Zusatznutzen entsprechend geringer.

~~~text
Direct NVLink (GPU-to-GPU): SIGNIFICANTLY higher bandwidth than shared PCIe bus
  (PCIe also shared with NICs, storage controllers etc.)
Point-to-point NVLink pairs only: non-directly-connected GPUs STILL rely on a slower path
NVSwitch: central mediator -> ALL connected GPUs communicate at consistently HIGH bandwidth
  regardless of WHICH specific GPU pair is communicating
Especially relevant for COLLECTIVE ops (e.g. All-Reduce for distributed training gradient aggregation)
  fully-meshed switch topology avoids bottlenecks from partial, multi-hop pairwise paths
KEY METHODOLOGICAL POINT: NVLink/NVSwitch hardware = cost premium vs. independent PCIe-connected GPUs
  only justified when workload has ACTUALLY high, frequent inter-GPU communication need
  low-communication workloads (e.g. many independent inference requests, no model parallelism)
  -> premium less justified
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| NVLink (Punkt-zu-Punkt) | hochbandbreitige direkte GPU-zu-GPU-Verbindung | nicht direkt verbundene GPUs kommunizieren weiterhin über langsameren Pfad |
| NVSwitch (vermittelte Topologie) | vollvermaschte, gleichbleibend hochbandbreitige Kommunikation zwischen allen angeschlossenen GPUs | besonders relevant für kollektive Operationen mit vielen beteiligten GPUs |
| Kollektive Kommunikation | z. B. All-Reduce, All-Gather beim verteilten Training | profitiert überproportional von vollvermaschter, switch-basierter Topologie |
| Fehlerdomänen | Ausfall einer Verbindung/eines Switches betrifft verbundene GPUs | muss bei Reliability-Betrachtungen gegenüber unabhängigen PCIe-Verbindungen abgewogen werden |

Implementierung: Vor einer Hardwarebeschaffungsentscheidung wird das tatsächliche Kommunikationsmuster der Ziel-Workloads analysiert (z. B. Häufigkeit und Intensität von All-Reduce-Operationen bei verteiltem Training), um zu bestimmen, ob der Kostenaufschlag für NVLink/NVSwitch-fähige Systeme gegenüber unabhängig über PCIe verbundenen GPUs gerechtfertigt ist. Für Workloads mit intensiver kollektiver Kommunikation wird geprüft, ob eine vollvermaschte NVSwitch-Topologie gegenüber einer partiellen, nur paarweisen NVLink-Verbindungstopologie einen relevanten Leistungsvorteil bietet. Bei der Reliability-Planung wird berücksichtigt, dass ein Ausfall eines zentralen NVSwitch-Vermittlers potenziell mehr angeschlossene GPUs betrifft als der Ausfall einer einzelnen, unabhängigen PCIe-Verbindung.

## Scalability, Reliability, Security und Observability

NVLink/NVSwitch skaliert die effektive Kommunikationsleistung kollektiver Operationen proportional zur Anzahl der über die vollvermaschte Topologie verbundenen GPUs; die Reliability-Grenze liegt darin, dass ein zentraler NVSwitch-Vermittler proportional zu seiner Zentralität eine größere Fehlerdomäne darstellt als eine unabhängige, paarweise PCIe-Verbindung, deren Ausfall typischerweise nur ein einzelnes GPU-Paar betrifft.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| kollektive Kommunikationsoperationen (All-Reduce) zeigen unerwartet niedrige Bandbreite | die beteiligten GPUs sind nicht vollständig über NVLink/NVSwitch verbunden, sondern teilweise über einen langsameren Pfad | die tatsächliche Verbindungstopologie der beteiligten GPUs prüfen |
| ein Hardwareausfall betrifft mehr GPUs als erwartet | ein zentraler NVSwitch-Vermittler ist ausgefallen und betrifft alle über ihn verbundenen GPUs | die Fehlerdomänen-Architektur des Systems gegen die tatsächliche Ausfallausbreitung prüfen |
| die zusätzlichen Hardwarekosten für NVLink/NVSwitch-fähige Systeme rechtfertigen sich nicht in der gemessenen Leistung | der tatsächliche Workload weist einen geringeren Inter-GPU-Kommunikationsbedarf auf als bei der Beschaffungsentscheidung angenommen | den tatsächlichen Kommunikationsbedarf der Workload neu messen und die Hardwareentscheidung entsprechend neu bewerten |

Security: Bei gemeinsam genutzter NVSwitch-Infrastruktur über mehrere Mandanten hinweg sollte geprüft werden, dass eine angemessene Isolation zwischen nicht vertrauenswürdigen Workloads besteht. Observability: Die tatsächlich gemessene Inter-GPU-Bandbreite unter kollektiver Kommunikationslast, sowie die Ausfallhistorie von NVLink-Verbindungen und NVSwitch-Komponenten, sind zentrale Metriken zur Bewertung des Hardwarenutzens und der Reliability.

## Trade-offs und Entscheidungen

**Staff** analysiert den tatsächlichen Inter-GPU-Kommunikationsbedarf der Ziel-Workload, bevor eine Hardwareentscheidung für NVLink/NVSwitch-fähige Systeme getroffen wird. **Principal** macht die Abwägung zwischen Kommunikationsleistung, Kosten und Fehlerdomänen für das Team nachvollziehbar. **Chief** trifft Hardwarebeschaffungsentscheidungen für GPU-Cluster im Unternehmen anhand des tatsächlichen, gemessenen Kommunikationsbedarfs der Ziel-Workloads.

Anti-Patterns: NVLink/NVSwitch-fähige Hardware pauschal beschaffen, ohne den tatsächlichen Inter-GPU-Kommunikationsbedarf der Ziel-Workloads zu prüfen; die größere Fehlerdomäne eines zentralen NVSwitch-Vermittlers bei der Reliability-Planung ignorieren; unspezifische Stack- oder Profilerwähnungen von NVLink/NVSwitch als praktische Vertiefung ausgeben, ohne eine konkrete, dokumentierte Evidenz.

## Production Checklist

- [ ] Der tatsächliche Inter-GPU-Kommunikationsbedarf der Ziel-Workloads wurde vor der Hardwarebeschaffung analysiert.
- [ ] Die Verbindungstopologie (vollvermascht versus partiell) ist für Workloads mit intensiver kollektiver Kommunikation geprüft.
- [ ] Die Fehlerdomänen-Architektur (zentraler Vermittler versus unabhängige Verbindungen) ist in der Reliability-Planung berücksichtigt.
- [ ] Inter-GPU-Bandbreite und Ausfallhistorie werden überwacht.

## Interviewfragen

### 1. Was ist der Unterschied zwischen NVLink und NVSwitch?

**Antwort:** NVLink ist eine hochbandbreitige, direkte Punkt-zu-Punkt-Verbindung zwischen zwei GPUs; NVSwitch erweitert dies durch eine vermittelte, vollvermaschte Topologie, die gleichbleibend hohe Bandbreite zwischen allen angeschlossenen GPUs ermöglicht, unabhängig vom konkreten GPU-Paar.

### 2. Warum profitieren kollektive Kommunikationsoperationen besonders von NVSwitch?

**Antwort:** Weil bei Operationen wie All-Reduce viele GPUs gleichzeitig Daten austauschen müssen; eine vollvermaschte Topologie vermeidet Engpässe, die bei einer partiellen, nur paarweisen Verbindungstopologie mit Mehrfach-Hops entstehen könnten.

### 3. Wann ist der Kostenaufschlag für NVLink/NVSwitch-fähige Systeme gegenüber unabhängig über PCIe verbundenen GPUs gerechtfertigt?

**Antwort:** Wenn der tatsächliche Workload einen hohen, häufigen Inter-GPU-Kommunikationsbedarf aufweist (z. B. verteiltes Training mit häufiger Gradientenaggregation); bei überwiegend unabhängiger Verarbeitung ist der Zusatznutzen geringer.

### 4. Welchen Reliability-Trade-off bringt ein zentraler NVSwitch-Vermittler gegenüber unabhängigen PCIe-Verbindungen mit sich?

**Antwort:** Ein Ausfall des zentralen NVSwitch betrifft potenziell alle über ihn verbundenen GPUs, während der Ausfall einer unabhängigen PCIe-Verbindung typischerweise nur ein einzelnes GPU-Paar betrifft.

### 5. Wie gehst du vor, wenn kollektive Kommunikationsoperationen unerwartet niedrige Bandbreite zeigen?

**Antwort:** Ich prüfe, ob die beteiligten GPUs tatsächlich vollständig über NVLink/NVSwitch verbunden sind oder ob ein Teil der Kommunikation über einen langsameren Pfad geleitet wird.

### 6. Widersprüchliche Anforderung: Team will maximale Kommunikationsleistung für verteiltes Training UND minimale Hardwarekosten — wie gehst du vor?

**Antwort:** Ich würde den tatsächlichen Inter-GPU-Kommunikationsbedarf der konkreten Trainings-Workload messen und prüfen, ob eine kleinere, gezielt dimensionierte NVLink/NVSwitch-Konfiguration (statt einer maximalen, pauschal überdimensionierten) den Bedarf bereits ausreichend abdeckt.

## Praktische Labs

~~~python
# Conceptual all-reduce bandwidth comparison across topologies (not executed against real hardware):

def estimate_all_reduce_time(num_gpus, data_size_gb, bandwidth_gbps, topology):
    if topology == "nvswitch_full_mesh":
        effective_bandwidth = bandwidth_gbps
    elif topology == "nvlink_pairwise":
        effective_bandwidth = bandwidth_gbps * 0.6  # some hops needed for non-adjacent GPUs
    elif topology == "pcie_independent":
        effective_bandwidth = bandwidth_gbps * 0.2  # shared bus, much lower effective bandwidth
    else:
        raise ValueError("unknown topology")

    total_data_moved_gb = data_size_gb * (num_gpus - 1) / num_gpus * 2  # rough ring-all-reduce approximation
    time_seconds = total_data_moved_gb * 8 / effective_bandwidth
    return round(time_seconds * 1000, 1)  # ms

for topology in ["nvswitch_full_mesh", "nvlink_pairwise", "pcie_independent"]:
    time_ms = estimate_all_reduce_time(num_gpus=8, data_size_gb=2, bandwidth_gbps=900, topology=topology)
    print(f"{topology}: estimated all-reduce time = {time_ms} ms")
~~~

## Dependencies, Cross-References und Quellen

1. NVIDIA-Dokumentation: [NVLink and NVSwitch](https://www.nvidia.com/en-us/data-center/nvlink/), abgerufen 2026-09-17.

GPU-Architektur und Rechenpfade sind kanonisch in [KB-0413](01-gpu-architektur-und-rechenpfade.md) behandelt; GPU-Scheduling und Topologie in [KB-0433](21-gpu-scheduling-und-topologie.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Weiterentwickelte NVSwitch-Generationen mit erhöhter Bandbreite und größerer maximaler GPU-Anzahl pro vollvermaschter Domäne | Adopting | Gegenüber älteren Generationen bevorzugen, sobald der tatsächliche Bedarf an größerer vollvermaschter Domänengröße für die konkrete Workload geprüft ist. |

Ein Team akzeptiert eine Hardwarebeschaffungsentscheidung für NVLink/NVSwitch-fähige Systeme erst, wenn der tatsächliche, gemessene Inter-GPU-Kommunikationsbedarf der Ziel-Workloads den Kostenaufschlag gegenüber unabhängig über PCIe verbundenen Systemen nachweislich rechtfertigt.
