---
{"id": "KB-0413", "title": "GPU-Architektur und Rechenpfade", "domain": "17", "sequence": 1, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "MLOPS"], "requires": [{"id": "KB-0043", "concepts": ["NUMA und Speicherlokalität"], "needed_for": "understanding"}, {"id": "KB-0341", "concepts": ["ML-Inferenz und Ausführung"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Anhand eines einfachen Matrixmultiplikations-Benchmarks nachvollziehen, wie Datenbewegung zwischen Speicherhierarchie-Ebenen die tatsächliche Inferenzlatenz beeinflusst, ohne GPU-Kernel selbst zu implementieren.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Die grundlegende GPU-Architektur (SMs, Tensor Cores, Speicherhierarchie) so verstehen, dass Inferenz-Deployment-Entscheidungen (Batch-Größe, Modellplatzierung) auf tatsächlichen Hardware-Eigenschaften statt auf Vermutungen basieren.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartet niedrige GPU-Auslastung bei einem Inferenz-Workload auf eine konkrete Engpassursache (Speicherbandbreite statt Rechenleistung) zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Fundiertes GPU-Architekturverständnis als Grundlage für Infrastrukturentscheidungen im Unternehmen etablieren, ohne dabei Hardwareentwickler-Tiefe zu beanspruchen, die für Plattformentscheidungen nicht notwendig ist.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Implementierung eigener, optimierter GPU-Kernel (z. B. in CUDA) im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der Architektur für Inferenz-Entscheidungen, nicht die Kernel-Entwicklung selbst."}}, "lab_validation": [{"lab_id": "KB-0413-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal beschriebenes Modell der GPU-Speicherhierarchie mit simulierten Latenzunterschieden zwischen Speicherebenen", "evidence": "Ein simuliertes Modell demonstriert, dass eine Berechnung mit Datenzugriff überwiegend aus schnellem, gemeinsam genutztem On-Chip-Speicher deutlich schneller abgeschlossen wird als eine strukturell identische Berechnung mit überwiegendem Zugriff auf den langsameren globalen Speicher, was den praktischen Effekt der Speicherhierarchie auf Inferenzlatenz demonstriert.", "limitations": "Kein reales GPU-Hardware-Benchmark, kein produktives Inferenzsystem, konzeptionelles Modell ohne Hardwareentwickler-Tiefe."}]}
---
# GPU-Architektur und Rechenpfade

> **Ziel:** Eine GPU besteht aus vielen parallelen Streaming Multiprocessors (SMs, den grundlegenden Recheneinheiten), spezialisierten Tensor Cores (für Matrixmultiplikationen optimierte Recheneinheiten, zentral für neuronale Netzwerkberechnungen), und einer mehrstufigen Speicherhierarchie (von sehr schnellem, aber kleinem On-Chip-Speicher bis zu langsamerem, aber größerem globalem Speicher). Dieser Artikel vermittelt dieses Architekturwissen gezielt für Inferenzanforderungen (welche Entscheidungen bei der Bereitstellung von Modell-Inferenz auf GPUs tatsächlich hardwarebedingt sind), ohne einen Hardwareentwickler-Anspruch zu verfolgen — das Ziel ist fundiertes Verständnis für Plattform- und Infrastrukturentscheidungen, nicht die Fähigkeit, eigene GPU-Kernel zu schreiben.

## Zweck, Mental Model und Dependencies

Eine GPU erreicht ihre hohe Rechenleistung durch massive Parallelität: statt weniger, sehr leistungsfähiger Kerne (wie bei einer CPU) enthält eine GPU viele tausend einfachere Recheneinheiten, organisiert in SMs, die gleichzeitig arbeiten. Tensor Cores sind spezialisierte Recheneinheiten innerhalb der SMs, die speziell für die in neuronalen Netzwerken dominierende Operation (Matrixmultiplikation) optimiert sind und diese deutlich effizienter durchführen als allgemeine Recheneinheiten. Die Speicherhierarchie ist für die praktische Inferenz-Performance oft entscheidender als die reine Rechenleistung: Daten müssen von einem langsameren, aber großen globalen Speicher (wo Modellgewichte typischerweise liegen) in schnelleren, aber kleineren On-Chip-Speicher bewegt werden, bevor sie tatsächlich berechnet werden können — diese Datenbewegung selbst benötigt Zeit und kann, besonders bei großen Modellen mit vielen Parametern, zum tatsächlichen Engpass werden, noch bevor die reine Rechenkapazität der Tensor Cores ausgeschöpft ist. Für Inferenzanforderungen ist dieser Unterschied zwischen rechen- und speicherbandbreitenlimitierten Situationen praktisch entscheidend: ein Inferenz-Workload, der primär durch Speicherbandbreite begrenzt ist (häufig bei großen Sprachmodellen mit vielen Parametern, aber relativ kleiner Batch-Größe), profitiert von größeren Batch-Größen (mehr Berechnung pro bewegtem Datenbyte), während ein rechenlimitierter Workload von größeren Batches kaum zusätzlich profitiert, da die Rechenkapazität bereits der begrenzende Faktor ist.

~~~text
GPU: MASSIVE PARALLELISM -- many thousand simpler compute units (SMs), not few very powerful cores (unlike CPU)
Tensor Cores: specialized units WITHIN SMs, optimized for matrix multiplication (the dominant neural net operation)
Memory hierarchy OFTEN MATTERS MORE than raw compute for practical inference performance:
  data must move from SLOWER, LARGE global memory (where model weights typically live)
    to FASTER, SMALL on-chip memory before actual computation
  -> this movement itself takes time -> can become the ACTUAL bottleneck before compute capacity is exhausted
PRACTICAL INFERENCE DISTINCTION: compute-bound vs. memory-bandwidth-bound
  memory-bandwidth-bound (common for large LLMs, small batch size): LARGER batches help (more compute per byte moved)
  compute-bound: larger batches barely help further -- compute capacity is already the limiting factor
~~~

## Core Concepts, Architektur und Implementierung

| Komponente | Rolle | Praktische Inferenz-Relevanz |
|---|---|---|
| SMs | massiv parallele Grundrecheneinheiten | bestimmen die theoretische maximale Rechenkapazität |
| Tensor Cores | für Matrixmultiplikation optimierte Recheneinheiten | zentral für die Effizienz neuronaler Netzwerkberechnungen |
| Speicherhierarchie | mehrstufig, unterschiedliche Geschwindigkeit/Größe | bestimmt, ob ein Workload rechen- oder speicherbandbreitenlimitiert ist |

Implementierung: Bei der Bewertung der Inferenz-Performance eines Deployments wird zunächst identifiziert, ob der konkrete Workload rechen- oder speicherbandbreitenlimitiert ist (typischerweise durch Messung der tatsächlichen Auslastung der Tensor Cores gegenüber der Speicherbandbreitenauslastung). Für speicherbandbreitenlimitierte Workloads (häufig bei großen Sprachmodellen) wird die Batch-Größe gezielt erhöht, um mehr Berechnung pro bewegtem Datenbyte durchzuführen, statt reflexartig auf leistungsstärkere Hardware zu setzen, ohne die tatsächliche Engpassursache zu kennen. Für rechenlimitierte Workloads wird stattdessen geprüft, ob die Tensor-Core-Nutzung tatsächlich ausgeschöpft wird (z. B. durch geeignete Datentypen und Operationsformen), bevor eine Hardware-Aufrüstung in Betracht gezogen wird.

## Scalability, Reliability, Security und Observability

Inferenz-Performance skaliert proportional zur tatsächlichen Ausnutzung der jeweils limitierenden Ressource (Rechenkapazität oder Speicherbandbreite); die Reliability-Grenze liegt darin, dass eine falsche Diagnose der Engpassursache (z. B. reflexartige Hardware-Aufrüstung bei tatsächlich speicherbandbreitenlimitierten Workloads) zu unwirksamen, kostspieligen Infrastrukturentscheidungen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine GPU zeigt niedrige Tensor-Core-Auslastung, obwohl der Inferenz-Workload langsam läuft | der Workload ist speicherbandbreitenlimitiert, nicht rechenlimitiert | die Speicherbandbreitenauslastung gegenüber der Tensor-Core-Auslastung messen |
| eine Erhöhung der Batch-Größe bringt keine spürbare Performance-Verbesserung | der Workload ist bereits rechenlimitiert, nicht speicherbandbreitenlimitiert | die tatsächliche Tensor-Core-Auslastung bei der aktuellen Batch-Größe prüfen |
| eine teure Hardware-Aufrüstung bringt keine erwartete Performance-Verbesserung | die tatsächliche Engpassursache (Speicherbandbreite statt Rechenkapazität) wurde vor der Investition nicht identifiziert | die neue Hardware-Generation auf tatsächlich verbesserte Speicherbandbreite statt nur erhöhter Rechenkapazität prüfen |

Security: Kein spezifisches, über allgemeine Infrastruktursicherheit hinausgehendes Risiko in diesem Grundlagenkapitel; relevant bleibt, dass Fehleinschätzungen der Hardware-Anforderungen zu unter- oder überprovisionierten, potenziell unwirtschaftlichen Deployments führen können. Observability: Tensor-Core-Auslastung, Speicherbandbreitenauslastung, und die tatsächliche Latenz pro Inferenzanfrage in Abhängigkeit von der Batch-Größe sind zentrale Metriken zur Diagnose der limitierenden Ressource.

## Trade-offs und Entscheidungen

**Staff** implementiert eine explizite Diagnose der limitierenden Ressource (Rechenkapazität oder Speicherbandbreite) vor jeder Infrastrukturentscheidung. **Principal** macht die Engpassursache für das Team nachvollziehbar. **Chief** etabliert fundiertes GPU-Architekturverständnis als Grundlage für Infrastrukturentscheidungen im Unternehmen, ohne unnötige Hardwareentwickler-Tiefe zu beanspruchen.

Anti-Patterns: eine Hardware-Aufrüstung ohne vorherige Diagnose der tatsächlichen Engpassursache vornehmen; die Batch-Größe erhöhen, ohne zu prüfen, ob der Workload tatsächlich speicherbandbreitenlimitiert ist; GPU-Architekturentscheidungen auf Vermutungen statt auf gemessener Ressourcenauslastung basieren.

## Production Checklist

- [ ] Die limitierende Ressource (Rechenkapazität oder Speicherbandbreite) ist für jeden Inferenz-Workload identifiziert.
- [ ] Batch-Größen sind basierend auf der tatsächlichen Engpassursache optimiert.
- [ ] Hardware-Aufrüstungsentscheidungen basieren auf gemessener, nicht vermuteter Ressourcenauslastung.
- [ ] Tensor-Core- und Speicherbandbreitenauslastung werden als getrennte Metriken überwacht.

## Interviewfragen

### 1. Warum erreicht eine GPU ihre hohe Rechenleistung durch massive Parallelität statt weniger, leistungsstarker Kerne?

**Antwort:** GPUs sind für die gleichzeitige Ausführung vieler einfacher, paralleler Berechnungen optimiert (wie sie bei neuronalen Netzwerken auftreten), im Gegensatz zu CPUs, die für sequenzielle, komplexere Einzeloperationen optimiert sind.

### 2. Was sind Tensor Cores, und warum sind sie für Inferenz relevant?

**Antwort:** Spezialisierte Recheneinheiten innerhalb der SMs, die speziell für Matrixmultiplikation optimiert sind — die dominierende Operation bei neuronalen Netzwerkberechnungen, wodurch sie zentral für effiziente Inferenz sind.

### 3. Was ist der Unterschied zwischen einem rechenlimitierten und einem speicherbandbreitenlimitierten Inferenz-Workload?

**Antwort:** Bei einem rechenlimitierten Workload ist die verfügbare Rechenkapazität der begrenzende Faktor; bei einem speicherbandbreitenlimitierten Workload ist die Geschwindigkeit der Datenbewegung zwischen Speicherebenen der begrenzende Faktor.

### 4. Warum hilft eine größere Batch-Größe bei speicherbandbreitenlimitierten Workloads, aber kaum bei rechenlimitierten?

**Antwort:** Eine größere Batch-Größe erhöht die Menge an Berechnung pro bewegtem Datenbyte, was bei speicherbandbreitenlimitierten Workloads den Engpass entschärft; bei rechenlimitierten Workloads ist die Rechenkapazität bereits ausgeschöpft, sodass eine größere Batch-Größe kaum zusätzlichen Nutzen bringt.

### 5. Wie gehst du vor, wenn eine teure Hardware-Aufrüstung keine erwartete Performance-Verbesserung bringt?

**Antwort:** Ich prüfe, ob die tatsächliche Engpassursache (Speicherbandbreite statt Rechenkapazität) vor der Investition korrekt identifiziert wurde, und ob die neue Hardware-Generation tatsächlich die limitierende Ressource verbessert.

### 6. Widersprüchliche Anforderung: Team will maximale Inferenz-Performance UND minimale Hardware-Investitionskosten — wie gehst du vor?

**Antwort:** Ich würde zunächst die tatsächliche limitierende Ressource (Rechenkapazität oder Speicherbandbreite) für den konkreten Workload identifizieren und gezielt in die tatsächlich limitierende Dimension investieren (z. B. höhere Speicherbandbreite statt reiner Rechenkapazität bei einem speicherbandbreitenlimitierten Workload), statt pauschal in die teuerste verfügbare Hardware zu investieren.

## Praktische Labs

~~~python
import time

def simulate_computation(data_size, access_pattern):
    # Simplified conceptual model: "fast" memory access vs. "slow" memory access latency
    per_byte_latency = 0.0000001 if access_pattern == "fast_on_chip" else 0.000001
    simulated_time = data_size * per_byte_latency
    return simulated_time

data_size_bytes = 1_000_000

fast_path_time = simulate_computation(data_size_bytes, access_pattern="fast_on_chip")
slow_path_time = simulate_computation(data_size_bytes, access_pattern="slow_global_memory")

print(f"Simulated time with predominantly fast on-chip memory access: {fast_path_time:.6f}s")
print(f"Simulated time with predominantly slow global memory access: {slow_path_time:.6f}s")
print(f"Slowdown factor from memory hierarchy effects: {slow_path_time / fast_path_time:.1f}x")
print("\nCONCEPTUAL TAKEAWAY: identical 'amount of computation', but memory access pattern dominates actual latency.")
~~~

## Dependencies, Cross-References und Quellen

1. NVIDIA-Dokumentation: [CUDA C++ Programming Guide — Hardware Implementation](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#hardware-implementation), abgerufen 2026-09-17.
2. Harris: [How to Optimize Data Transfers in CUDA C/C++](https://developer.nvidia.com/blog/how-optimize-data-transfers-cuda-cc/), abgerufen 2026-09-17.

NUMA und Speicherlokalität sind kanonisch in [KB-0043](../02-linux-systems/13-numa-und-speicherlokalitaet.md) behandelt; ML-Inferenz und Ausführung in [KB-0341](../14-ml-engineering/11-ml-inferenz-und-ausfuehrung.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Zunehmend spezialisierte, für bestimmte Datentypen (z. B. niedrigere Präzision) optimierte Tensor-Core-Generationen | Adopting | Gegenüber generischeren Recheneinheiten für Inferenz-Workloads, die von reduzierter Präzision profitieren, bevorzugen. |
| Erweiterte On-Chip-Speicherkapazitäten neuerer GPU-Generationen zur Reduktion von Speicherbandbreiten-Engpässen | Evaluating | Gegenüber älteren GPU-Generationen abwägen, sobald speicherbandbreitenlimitierte Workloads einen konkreten, gemessenen Bedarf zeigen. |

Ein Team akzeptiert eine GPU-Infrastrukturentscheidung erst, wenn die tatsächliche limitierende Ressource (Rechenkapazität oder Speicherbandbreite) für den konkreten Workload gemessen und identifiziert wurde.
