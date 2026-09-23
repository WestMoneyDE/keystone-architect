---
{"id": "KB-0424", "title": "Disaggregated Prefill und Decode", "domain": "17", "sequence": 12, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "MLOPS"], "requires": [{"id": "KB-0420", "concepts": ["VLLM, KV-Cache"], "needed_for": "understanding"}, {"id": "KB-0423", "concepts": ["NVIDIA Dynamo, verteiltes Serving"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Den Unterschied zwischen Prefill-Phase (Prompt-Verarbeitung) und Decode-Phase (Token-Generierung) anhand ihrer unterschiedlichen Rechencharakteristik erklären können und nachvollziehen, warum eine Trennung dieser Phasen auf unterschiedliche Recheneinheiten möglich ist.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Bewerten, ob eine disaggregierte Prefill/Decode-Architektur für einen konkreten Workload-Mix (Verhältnis von Prompt-Länge zu generierter Ausgabelänge) einen Auslastungsvorteil bringt, der den zusätzlichen Netzwerk- und Schedulingaufwand rechtfertigt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Tail-Latency-Erhöhung in einem disaggregierten Setup auf die KV-Cache-Übertragung zwischen Prefill- und Decode-Einheiten zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Die Einführung disaggregierter Prefill/Decode-Architektur im Unternehmen anhand gemessener Auslastungsgewinne gegenüber der zusätzlichen Betriebskomplexität entscheiden.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der KV-Cache-Übertragungsprotokolle zwischen Prefill- und Decode-Einheiten im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der Trade-offs zwischen Auslastungsgewinn und zusätzlicher Latenz/Komplexität, nicht die Protokoll-Interna."}}, "lab_validation": [{"lab_id": "KB-0424-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Konzeptuelle Einordnung anhand aktueller technischer Primärquellen, kein aktives Deployment verwendet", "evidence": "Anhand aktueller technischer Dokumentation und Forschungsveröffentlichungen wird nachvollzogen, warum die Prefill-Phase (parallelisierbar, rechenintensiv) und die Decode-Phase (sequenziell, speicherbandbreitenlimitiert) unterschiedliche Rechencharakteristika haben und wie eine Trennung auf separate Recheneinheiten die Gesamtauslastung verbessern kann.", "limitations": "Kein reales Deployment getestet, keine Latenz- oder Durchsatzmessungen erhoben. Es handelt sich um ein sich aktiv weiterentwickelndes Forschungs- und Ingenieursgebiet; konkrete Implementierungsdetails variieren zwischen Frameworks und sollten vor produktivem Einsatz gegen aktuelle Primärquellen geprüft werden."}]}
---
# Disaggregated Prefill und Decode

> **Ziel:** Die Inferenz eines Sprachmodells besteht aus zwei Phasen mit grundlegend unterschiedlicher Rechencharakteristik: der Prefill-Phase (Verarbeitung des gesamten Eingabe-Prompts, hochgradig parallelisierbar und rechenintensiv) und der Decode-Phase (sequenzielle Generierung eines Tokens nach dem anderen, primär durch Speicherbandbreite statt Rechenleistung limitiert, siehe [KB-0413](01-gpu-architektur-und-rechenpfade.md)). Disaggregated Prefill/Decode trennt diese beiden Phasen auf unterschiedliche, jeweils für ihre Charakteristik optimierte Recheneinheiten, wobei der KV-Cache (siehe [KB-0420](08-vllm.md)) nach Abschluss der Prefill-Phase über das Netzwerk zur Decode-Einheit übertragen werden muss. Der zentrale Punkt dieses Kapitels ist, dass dieser Auslastungsgewinn (jede Recheneinheit wird optimal für ihre jeweilige Phase genutzt, statt eine gemeinsame Einheit ineffizient für beide Phasen zu betreiben) gegen den zusätzlichen Netzwerkbedarf für die KV-Cache-Übertragung, die erhöhte Schedulingkomplexität und eine potenziell zusätzliche Tail Latency (durch die Übertragungszeit zwischen den Phasen) abgewogen werden muss.

## Zweck, Mental Model und Dependencies

Wenn Prefill und Decode auf derselben Recheneinheit gemeinsam ausgeführt werden, konkurrieren sie um dieselben Ressourcen: Die rechenintensive, parallelisierbare Prefill-Phase profitiert von hoher Rechenleistung, während die speicherbandbreitenlimitierte Decode-Phase von hoher Speicherbandbreite profitiert — eine gemeinsame Einheit muss für beide Anforderungen gleichzeitig dimensioniert sein, was zu suboptimaler Auslastung führen kann, wenn beide Phasen um dieselben Ressourcen konkurrieren. Disaggregation trennt diese Phasen auf separate Recheneinheiten, die jeweils für ihre spezifische Charakteristik optimiert werden können (z. B. mehr Recheneinheiten für Prefill, mehr Speicherbandbreite-optimierte Einheiten für Decode). Diese Trennung erfordert jedoch, dass der nach der Prefill-Phase berechnete KV-Cache-Zustand über das Netzwerk zur Decode-Einheit übertragen wird, bevor die Decode-Phase beginnen kann — diese Übertragung benötigt Zeit und Netzwerkbandbreite, was insbesondere bei langen Prompts (großer KV-Cache) zu einer zusätzlichen Latenz zwischen Prefill-Abschluss und Decode-Beginn führt. Der zentrale methodische Punkt ist, dass der Nettovorteil disaggregierter Architektur vom tatsächlichen Verhältnis von Prompt-Länge zu generierter Ausgabelänge abhängt — bei Workloads mit sehr langen Prompts und kurzen Ausgaben kann die KV-Cache-Übertragung einen erheblichen Anteil der Gesamtlatenz ausmachen, während bei kurzen Prompts und langen Ausgaben der Auslastungsgewinn den Übertragungsaufwand typischerweise überwiegt.

~~~text
Prefill phase: process ENTIRE input prompt, highly PARALLELIZABLE, compute-bound
Decode phase: generate ONE token at a time, SEQUENTIAL, memory-bandwidth-bound
Same unit running BOTH: must be dimensioned for BOTH needs simultaneously -> often suboptimal for either
Disaggregation: SEPARATE units, each optimized for its OWN phase's characteristic
  requires: KV-cache state transferred over NETWORK from prefill unit -> decode unit
  -> transfer takes TIME + BANDWIDTH, adds latency between prefill completion and decode start
KEY METHODOLOGICAL POINT: net benefit depends on prompt-length : output-length RATIO
  very long prompt + short output -> KV-cache transfer can dominate total latency
  short prompt + long output -> utilization gain typically outweighs transfer overhead
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Prefill-Phase | verarbeitet den gesamten Eingabe-Prompt parallel | rechenintensiv, profitiert von hoher Rechenleistung |
| Decode-Phase | generiert Tokens sequenziell, eines nach dem anderen | speicherbandbreitenlimitiert, profitiert von hoher Speicherbandbreite |
| KV-Cache-Übertragung | überträgt den Prefill-Zustand zur Decode-Einheit | Übertragungszeit hängt von Prompt-Länge (KV-Cache-Größe) und Netzwerkbandbreite ab |
| Auslastungsgewinn versus Tail Latency | zentraler Trade-off der Disaggregation | muss anhand des tatsächlichen Prompt-/Ausgabe-Längenverhältnisses der Workload geprüft werden |

Implementierung: Vor der Einführung disaggregierter Prefill/Decode-Architektur wird die tatsächliche Verteilung von Prompt-Längen zu generierten Ausgabelängen in der Ziel-Workload analysiert, um abzuschätzen, ob der Auslastungsgewinn den zusätzlichen Netzwerk- und Latenzaufwand der KV-Cache-Übertragung rechtfertigt. Die Netzwerkverbindung zwischen Prefill- und Decode-Einheiten wird mit ausreichender Bandbreite dimensioniert, um die Übertragungszeit für die typische KV-Cache-Größe der Workload gering zu halten. Der Scheduler, der Prefill- und Decode-Anfragen den jeweiligen Einheiten zuweist, wird so konfiguriert, dass er die tatsächliche Auslastung beider Einheitentypen berücksichtigt, statt eine statische, ungleichmäßige Zuweisung zu verwenden.

## Scalability, Reliability, Security und Observability

Disaggregierte Prefill/Decode-Architektur skaliert die Gesamtauslastung proportional zur Passgenauigkeit der Dimensionierung beider Einheitentypen zur tatsächlichen Workload-Charakteristik; die Reliability-Grenze liegt darin, dass eine unzureichend dimensionierte Netzwerkverbindung zwischen den Einheiten proportional zur KV-Cache-Größe zu einer dominierenden Zusatzlatenz führt, die den Auslastungsgewinn der Disaggregation zunichtemachen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| die Tail Latency ist in der disaggregierten Architektur höher als im nicht-disaggregierten Vergleichssetup | die KV-Cache-Übertragungszeit zwischen Prefill- und Decode-Einheit dominiert bei der konkreten Workload die Gesamtlatenz | die Netzwerkbandbreite zwischen den Einheiten sowie die typische KV-Cache-Größe der Workload messen und die Übertragungszeit isoliert betrachten |
| die Gesamtauslastung beider Einheitentypen ist trotz Disaggregation unausgeglichen | der Scheduler weist Prefill- und Decode-Anfragen nicht proportional zur tatsächlichen Kapazität beider Einheitentypen zu | die Scheduler-Konfiguration gegen die tatsächliche Kapazitätsverteilung prüfen und anpassen |
| der erwartete Auslastungsvorteil bleibt aus | das Prompt-/Ausgabe-Längenverhältnis der tatsächlichen Workload unterscheidet sich von der ursprünglichen Annahme | das tatsächliche Längenverhältnis messen und die Architekturentscheidung dagegen neu bewerten |

Security: Die Netzwerkverbindung, über die KV-Cache-Zustand (der potenziell sensible, aus dem Prompt abgeleitete Repräsentationen enthält) zwischen den Einheiten übertragen wird, sollte verschlüsselt und zugriffskontrolliert sein. Observability: Die KV-Cache-Übertragungszeit, die Auslastung der Prefill- und Decode-Einheiten getrennt, und die Gesamtlatenz aufgeschlüsselt nach Phase sind zentrale Metriken zur Bewertung des tatsächlichen Nutzens.

## Trade-offs und Entscheidungen

**Staff** analysiert das tatsächliche Prompt-/Ausgabe-Längenverhältnis der Workload, bevor eine disaggregierte Architektur eingeführt wird. **Principal** macht die Abwägung zwischen Auslastungsgewinn und zusätzlicher Tail Latency für das Team nachvollziehbar. **Chief** entscheidet die Einführung disaggregierter Prefill/Decode-Architektur im Unternehmen anhand gemessener Auslastungsgewinne gegenüber der zusätzlichen Betriebskomplexität und Netzwerkabhängigkeit.

Anti-Patterns: disaggregierte Architektur einführen, ohne das tatsächliche Prompt-/Ausgabe-Längenverhältnis der Workload zu prüfen; die Netzwerkverbindung zwischen Prefill- und Decode-Einheiten unterdimensionieren und die resultierende Zusatzlatenz ignorieren; den Scheduler ohne Berücksichtigung der tatsächlichen Kapazitätsverteilung beider Einheitentypen statisch konfigurieren.

## Production Checklist

- [ ] Das tatsächliche Prompt-/Ausgabe-Längenverhältnis der Workload rechtfertigt den erwarteten Auslastungsgewinn der Disaggregation.
- [ ] Die Netzwerkverbindung zwischen Prefill- und Decode-Einheiten ist für die typische KV-Cache-Größe ausreichend dimensioniert.
- [ ] Der Scheduler berücksichtigt die tatsächliche Kapazität beider Einheitentypen bei der Anfragezuweisung.
- [ ] KV-Cache-Übertragungszeit und Gesamtlatenz sind nach Phase aufgeschlüsselt überwacht.

## Interviewfragen

### 1. Was unterscheidet die Prefill-Phase von der Decode-Phase bei der LLM-Inferenz?

**Antwort:** Die Prefill-Phase verarbeitet den gesamten Eingabe-Prompt parallel und ist rechenintensiv, während die Decode-Phase Tokens sequenziell generiert und primär durch Speicherbandbreite limitiert ist.

### 2. Was ist der zentrale Vorteil, den Disaggregated Prefill/Decode verspricht?

**Antwort:** Jede Recheneinheit kann für ihre spezifische Phasencharakteristik optimiert werden, statt eine gemeinsame Einheit ineffizient für beide, konkurrierende Anforderungen zu dimensionieren.

### 3. Welcher zusätzliche Aufwand entsteht durch die Trennung von Prefill und Decode?

**Antwort:** Der nach der Prefill-Phase berechnete KV-Cache-Zustand muss über das Netzwerk zur Decode-Einheit übertragen werden, was zusätzliche Zeit und Netzwerkbandbreite erfordert.

### 4. Wovon hängt ab, ob sich Disaggregation für eine konkrete Workload lohnt?

**Antwort:** Vom tatsächlichen Verhältnis von Prompt-Länge zu generierter Ausgabelänge — bei sehr langen Prompts und kurzen Ausgaben kann die KV-Cache-Übertragung die Gesamtlatenz dominieren, während bei kurzen Prompts und langen Ausgaben der Auslastungsgewinn typischerweise überwiegt.

### 5. Wie gehst du vor, wenn die Tail Latency nach Einführung von Disaggregation unerwartet steigt?

**Antwort:** Ich prüfe, ob die KV-Cache-Übertragungszeit zwischen Prefill- und Decode-Einheit bei der konkreten Workload einen dominierenden Anteil der Gesamtlatenz ausmacht, und messe die Netzwerkbandbreite sowie die typische KV-Cache-Größe.

### 6. Widersprüchliche Anforderung: Team will maximale GPU-Auslastung UND garantiert niedrige Tail Latency für sehr lange Prompts — wie gehst du vor?

**Antwort:** Ich würde das tatsächliche Prompt-/Ausgabe-Längenverhältnis der Workload messen; bei sehr langen Prompts würde ich prüfen, ob die KV-Cache-Übertragungszeit die Tail-Latency-Anforderung gefährdet, und gegebenenfalls eine nicht-disaggregierte Architektur für diesen spezifischen Anwendungsfall empfehlen, statt Disaggregation pauschal einzuführen.

## Praktische Labs

~~~python
# Conceptual prefill/decode disaggregation net-benefit estimation (not executed against a real deployment):

def estimate_disaggregation_benefit(prompt_tokens, output_tokens, kv_cache_transfer_ms_per_1k_tokens, utilization_gain_pct):
    transfer_time_ms = (prompt_tokens / 1000) * kv_cache_transfer_ms_per_1k_tokens
    # very rough approximation of decode-phase time saved from better unit utilization
    estimated_time_saved_ms = output_tokens * (utilization_gain_pct / 100) * 2

    net_benefit_ms = estimated_time_saved_ms - transfer_time_ms
    recommendation = "disaggregation likely beneficial" if net_benefit_ms > 0 else "disaggregation overhead may dominate"
    return {
        "kv_cache_transfer_ms": round(transfer_time_ms, 1),
        "estimated_time_saved_ms": round(estimated_time_saved_ms, 1),
        "net_benefit_ms": round(net_benefit_ms, 1),
        "recommendation": recommendation,
    }

long_prompt_short_output = estimate_disaggregation_benefit(prompt_tokens=8000, output_tokens=50, kv_cache_transfer_ms_per_1k_tokens=5, utilization_gain_pct=15)
short_prompt_long_output = estimate_disaggregation_benefit(prompt_tokens=200, output_tokens=1000, kv_cache_transfer_ms_per_1k_tokens=5, utilization_gain_pct=15)

print(long_prompt_short_output)
print(short_prompt_long_output)
~~~

## Dependencies, Cross-References und Quellen

1. NVIDIA-Technical-Blog: [Achieving High Throughput and Low Latency with NVIDIA Dynamo and Disaggregated Serving](https://developer.nvidia.com/blog/), abgerufen 2026-09-17.
2. arXiv-Forschungsveröffentlichung: [Zhong et al., "DistServe: Disaggregating Prefill and Decoding for Goodput-optimized Large Language Model Serving"](https://arxiv.org/abs/2401.09670), abgerufen 2026-09-17.

VRAM und KV-Cache sind kanonisch in [KB-0420](08-vllm.md) behandelt; verteiltes Serving in [KB-0423](11-nvidia-dynamo.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Adaptive, workload-abhängige Umschaltung zwischen disaggregierter und gemeinsamer Prefill/Decode-Ausführung | Evaluating | Gegenüber statischer Architekturwahl erst nach Prüfung der tatsächlichen Workload-Varianz über die Zeit bevorzugen. |
| Optimierte, latenzreduzierte KV-Cache-Übertragungsprotokolle (z. B. über dedizierte Hochgeschwindigkeitsverbindungen) | Evaluating | Gegenüber Standard-Netzwerkübertragung erst nach Messung des tatsächlichen Latenzgewinns für die konkrete Hardware bevorzugen. |

Ein Team akzeptiert die Einführung von Disaggregated Prefill/Decode erst, wenn eine Analyse des tatsächlichen Prompt-/Ausgabe-Längenverhältnisses der Workload einen Netto-Auslastungsgewinn gegenüber dem zusätzlichen Netzwerk- und Latenzaufwand nachweislich bestätigt.
