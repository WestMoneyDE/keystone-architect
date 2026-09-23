---
{"id": "KB-0415", "title": "VRAM und Speicherbudgets", "domain": "17", "sequence": 3, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "MLOPS"], "requires": [{"id": "KB-0413", "concepts": ["GPU-Architektur und Rechenpfade"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Den VRAM-Bedarf eines Inferenz-Deployments explizit in Gewichte, Aktivierungen und KV-Cache aufschlüsseln und einen simulierten Out-of-Memory-Fehler auf die konkrete, überschrittene Komponente zurückführen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein Speicherbudget für ein Inferenz-Deployment gestalten, das Gewichte, Aktivierungen und KV-Cache getrennt kalkuliert, statt eine pauschale Gesamt-VRAM-Anforderung anzunehmen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen Out-of-Memory-Fehler von einem reinen Auslastungsproblem unterscheiden und auf eine konkrete, überschrittene Speicherbudgetkomponente (z. B. wachsender KV-Cache bei langem Kontext) zurückführen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Explizite Speicherbudgetierung nach Gewichten, Aktivierungen und KV-Cache als Standard für Inferenz-Kapazitätsplanung im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene Speicherfragmentierungs-Reduktionstechniken auf Allocator-Ebene im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis der drei Budgetkomponenten und der Unterscheidung von OOM gegenüber Auslastung, nicht die Allocator-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0415-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Speicherbudget-Modell mit wachsendem KV-Cache bei zunehmender Kontextlänge", "evidence": "Ein simuliertes Inferenz-Deployment mit konstanten Gewichten und Aktivierungen, aber einem mit der Kontextlänge linear wachsenden KV-Cache, überschreitet ab einer bestimmten Kontextlänge das verfügbare Speicherbudget, was korrekt auf die KV-Cache-Komponente statt auf ein allgemeines Auslastungsproblem zurückgeführt wird.", "limitations": "Kein reales GPU-Hardware-Benchmark, kein produktives Inferenzsystem, konzeptionelles Budgetmodell."}]}
---
# VRAM und Speicherbudgets

> **Ziel:** Der VRAM-Bedarf (Video RAM, der GPU-eigene Speicher) eines Inferenz-Deployments setzt sich aus drei unterschiedlichen Komponenten zusammen: Gewichten (den Modellparametern selbst, ein fester Speicherbedarf pro geladenem Modell), Aktivierungen (Zwischenergebnissen während der Berechnung, abhängig von Batch-Größe), und KV-Cache (bei autoregressiven Sprachmodellen gespeicherte Key/Value-Zustände vorheriger Tokens, die mit der Kontextlänge wachsen), aufbauend auf der GPU-Architektur (siehe [KB-0413](01-gpu-architektur-und-rechenpfade.md)). Der zentrale Punkt dieses Kapitels ist die präzise Unterscheidung zwischen Out-of-Memory-Fehlern (dem tatsächlichen Überschreiten des verfügbaren Speicherbudgets in einer dieser drei Komponenten) und bloßer GPU-Auslastung (der Rechenkapazitätsnutzung) — beide Phänomene werden häufig verwechselt, erfordern aber grundlegend unterschiedliche Diagnose und Behebung.

## Zweck, Mental Model und Dependencies

Gewichte belegen einen festen, vorhersehbaren VRAM-Anteil, der direkt von der Modellgröße (Anzahl Parameter, verwendete Präzision) abhängt und sich während der Inferenz nicht ändert. Aktivierungen sind die Zwischenergebnisse jeder Berechnungsschicht während eines Vorwärtsdurchlaufs; ihr Speicherbedarf skaliert direkt mit der Batch-Größe (mehr gleichzeitig verarbeitete Anfragen benötigen proportional mehr Aktivierungsspeicher). KV-Cache ist bei autoregressiven Sprachmodellen die speicherintensivste, am wenigsten intuitive Komponente: um bei der Generierung jedes neuen Tokens nicht die gesamte bisherige Sequenz erneut zu verarbeiten, werden die Key/Value-Zustände aller vorherigen Tokens im Speicher gehalten — dieser Cache wächst linear mit der Kontextlänge (Anzahl der bisher verarbeiteten Tokens) und kann bei langen Kontexten und mehreren gleichzeitigen Anfragen den größten Anteil des gesamten VRAM-Bedarfs ausmachen, oft überraschend für Teams, die primär an die Modellgewichte als dominanten Speicherfaktor denken. Der zentrale diagnostische Punkt ist: ein Out-of-Memory-Fehler bedeutet, dass die Summe aus Gewichten, Aktivierungen und KV-Cache das physisch verfügbare VRAM-Budget tatsächlich überschritten hat — dies ist grundlegend verschieden von einer hohen, aber innerhalb des Budgets bleibenden GPU-Rechenauslastung. Eine hohe Rechenauslastung bei ausreichend freiem Speicher ist unproblematisch (die GPU wird effizient genutzt); ein Speicherbudget-Überschreiten führt dagegen zu einem harten Fehler, unabhängig davon, wie ausgelastet die Rechenkapazität tatsächlich ist — die beiden Metriken (Speicherauslastung und Rechenauslastung) müssen daher getrennt betrachtet und diagnostiziert werden.

~~~text
VRAM demand = WEIGHTS (fixed, model size dependent) + ACTIVATIONS (scales with batch size) + KV CACHE (scales with context length)
Weights: fixed footprint, doesn't change during inference
Activations: intermediate results per forward pass -- more concurrent requests -> proportionally more activation memory
KV Cache: MOST memory-intensive, LEAST intuitive component for autoregressive LLMs
  stores key/value states of ALL previous tokens -> avoids reprocessing the entire sequence per new token
  grows LINEARLY with context length -> can dominate total VRAM for long contexts + many concurrent requests
  -> often surprising for teams primarily thinking of model weights as the dominant memory factor
CRITICAL DIAGNOSTIC DISTINCTION:
  Out-of-Memory error: sum of weights+activations+KV cache ACTUALLY EXCEEDS physical VRAM budget -- HARD FAILURE
  vs. high compute utilization WITHIN budget: unproblematic, GPU efficiently used
  -> memory usage and compute utilization are SEPARATE metrics, must be diagnosed SEPARATELY
~~~

## Core Concepts, Architektur und Implementierung

| Komponente | Wächst mit | Vorhersehbarkeit |
|---|---|---|
| Gewichte | Modellgröße (Parameteranzahl, Präzision) | fest, vollständig vorhersehbar pro Modell |
| Aktivierungen | Batch-Größe | vorhersehbar, proportional zur Batch-Größe |
| KV-Cache | Kontextlänge × Anzahl gleichzeitiger Anfragen | am schwierigsten vorherzusagen, kann bei langen Kontexten dominieren |

Implementierung: Vor der Bereitstellung eines Inferenz-Deployments wird der VRAM-Bedarf explizit in die drei Komponenten aufgeschlüsselt kalkuliert: der feste Gewichts-Speicherbedarf des gewählten Modells, der Aktivierungsspeicherbedarf für die geplante maximale Batch-Größe, und der KV-Cache-Speicherbedarf für die geplante maximale Kontextlänge und Anzahl gleichzeitiger Anfragen. Ein explizites Speicherbudget mit Sicherheitsmarge wird festgelegt, und bei einem tatsächlich auftretenden Out-of-Memory-Fehler wird zuerst geprüft, welche der drei Komponenten das Budget überschritten hat (typischerweise durch Beobachtung, ob der Fehler bei zunehmender Batch-Größe, zunehmender Kontextlänge, oder unabhängig von beidem auftritt), statt den Fehler pauschal als "GPU zu klein" zu interpretieren.

## Scalability, Reliability, Security und Observability

VRAM-Budgetierung skaliert die maximal unterstützbare Kombination aus Batch-Größe und Kontextlänge proportional zum verfügbaren, nach Gewichten bereits reduzierten Speicherbudget; die Reliability-Grenze liegt darin, dass eine unzureichende KV-Cache-Budgetierung proportional zur tatsächlichen Kontextlängen-Variabilität der Nutzeranfragen zu unvorhersehbaren Out-of-Memory-Fehlern bei bestimmten, längeren Anfragen führen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Out-of-Memory-Fehler tritt nur bei Anfragen mit besonders langem Kontext auf | der KV-Cache überschreitet bei langen Kontexten das verfügbare Speicherbudget | den KV-Cache-Speicherbedarf für die tatsächlich auftretenden Kontextlängen explizit berechnen und das Speicherbudget entsprechend anpassen |
| ein Out-of-Memory-Fehler tritt bei hoher gleichzeitiger Anfragenlast auf, unabhängig von der Kontextlänge | der Aktivierungsspeicherbedarf bei hoher Batch-Größe überschreitet das verfügbare Budget | die maximale unterstützte Batch-Größe basierend auf dem tatsächlichen Aktivierungsspeicherbedarf begrenzen |
| die GPU zeigt hohe Rechenauslastung, aber keine Speicherprobleme | die Rechenkapazität wird effizient genutzt, ohne das Speicherbudget zu überschreiten — dies ist unproblematisch | keine Gegenprobe notwendig; hohe Rechenauslastung innerhalb des Speicherbudgets ist ein erwünschter Zustand |

Security: Ein unzureichend budgetierter KV-Cache kann bei absichtlich sehr langen Anfragen (potenziell als Denial-of-Service-Vektor) zu Out-of-Memory-Fehlern führen, die den Dienst für andere Nutzer beeinträchtigen; explizite Kontextlängenbegrenzungen sind daher auch eine Schutzmaßnahme. Observability: Die getrennte Überwachung von Gewichts-, Aktivierungs- und KV-Cache-Speicherverbrauch, sowie die Häufigkeit und Kontextlängenkorrelation von Out-of-Memory-Ereignissen, sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert explizite, komponentenweise Speicherbudgetierung vor jedem Inferenz-Deployment. **Principal** macht die Aufschlüsselung des VRAM-Bedarfs nach Gewichten, Aktivierungen und KV-Cache für das Team nachvollziehbar. **Chief** etabliert explizite Speicherbudgetierung als Standard für Inferenz-Kapazitätsplanung im Unternehmen.

Anti-Patterns: den VRAM-Bedarf eines Deployments nur pauschal statt komponentenweise kalkulieren; einen Out-of-Memory-Fehler pauschal als "GPU zu klein" statt als konkrete Budgetüberschreitung einer spezifischen Komponente diagnostizieren; keine explizite Kontextlängenbegrenzung setzen, wodurch der KV-Cache unbegrenzt wachsen kann.

## Production Checklist

- [ ] Der VRAM-Bedarf ist explizit in Gewichte, Aktivierungen und KV-Cache aufgeschlüsselt kalkuliert.
- [ ] Ein explizites Speicherbudget mit Sicherheitsmarge ist für maximale Batch-Größe und Kontextlänge festgelegt.
- [ ] Kontextlängenbegrenzungen sind gesetzt, um unbegrenztes KV-Cache-Wachstum zu verhindern.
- [ ] Out-of-Memory-Fehler werden komponentenweise diagnostiziert, nicht pauschal als "GPU zu klein" behandelt.

## Interviewfragen

### 1. Aus welchen drei Komponenten setzt sich der VRAM-Bedarf eines Inferenz-Deployments zusammen?

**Antwort:** Gewichte (fester Modellspeicherbedarf), Aktivierungen (skalieren mit Batch-Größe), und KV-Cache (skaliert mit Kontextlänge und Anzahl gleichzeitiger Anfragen).

### 2. Warum kann der KV-Cache überraschend den größten Anteil des VRAM-Bedarfs ausmachen?

**Antwort:** Er wächst linear mit der Kontextlänge und der Anzahl gleichzeitiger Anfragen, was bei langen Kontexten und hoher gleichzeitiger Last den Speicherbedarf der eigentlich intuitiveren Modellgewichte deutlich übersteigen kann.

### 3. Was ist der zentrale Unterschied zwischen einem Out-of-Memory-Fehler und hoher GPU-Auslastung?

**Antwort:** Ein Out-of-Memory-Fehler bedeutet, dass das verfügbare Speicherbudget tatsächlich überschritten wurde (harter Fehler); hohe Rechenauslastung innerhalb des Speicherbudgets ist dagegen unproblematisch und zeigt effiziente GPU-Nutzung.

### 4. Wie diagnostizierst du, welche Komponente einen Out-of-Memory-Fehler verursacht hat?

**Antwort:** Ich beobachte, ob der Fehler mit zunehmender Kontextlänge (KV-Cache), zunehmender Batch-Größe (Aktivierungen), oder unabhängig von beiden auftritt (möglicherweise Gewichte bei zu kleiner GPU für das Modell).

### 5. Wie gehst du vor, wenn ein Out-of-Memory-Fehler nur bei besonders langen Anfragen auftritt?

**Antwort:** Ich berechne den KV-Cache-Speicherbedarf für die tatsächlich auftretenden Kontextlängen und passe entweder das Speicherbudget oder die maximal zulässige Kontextlänge entsprechend an.

### 6. Widersprüchliche Anforderung: Team will maximale unterstützte Kontextlänge UND garantiert keine Out-of-Memory-Fehler bei hoher gleichzeitiger Last — wie gehst du vor?

**Antwort:** Ich würde eine explizite Kalkulation des maximal unterstützbaren Produkts aus Kontextlänge und gleichzeitiger Anfragenanzahl durchführen (basierend auf dem verfügbaren Speicherbudget nach Abzug von Gewichten), und entweder die maximale Kontextlänge oder die maximale gleichzeitige Last dynamisch begrenzen, um innerhalb dieses sicheren Kombinationsraums zu bleiben.

## Praktische Labs

~~~python
def calculate_kv_cache_memory(context_length, num_concurrent_requests, bytes_per_token_kv=131072):
    return context_length * num_concurrent_requests * bytes_per_token_kv

def diagnose_oom(total_vram_bytes, weights_bytes, activations_bytes, context_length, num_concurrent_requests):
    kv_cache_bytes = calculate_kv_cache_memory(context_length, num_concurrent_requests)
    total_needed = weights_bytes + activations_bytes + kv_cache_bytes
    if total_needed > total_vram_bytes:
        overage = total_needed - total_vram_bytes
        # Identify which component is the dominant contributor
        if kv_cache_bytes > weights_bytes and kv_cache_bytes > activations_bytes:
            return f"OOM: KV cache is the dominant factor ({kv_cache_bytes / 1e9:.2f} GB) -- likely due to long context or high concurrency. Overage: {overage / 1e9:.2f} GB."
        return f"OOM: total budget exceeded. Overage: {overage / 1e9:.2f} GB."
    return f"Within budget. Total needed: {total_needed / 1e9:.2f} GB of {total_vram_bytes / 1e9:.2f} GB available."

total_vram = 24 * 1e9  # 24 GB GPU
weights = 14 * 1e9     # e.g. a 14B parameter model in fp16-ish footprint
activations = 1 * 1e9

print(diagnose_oom(total_vram, weights, activations, context_length=2048, num_concurrent_requests=4))
print(diagnose_oom(total_vram, weights, activations, context_length=32768, num_concurrent_requests=8))
~~~

## Dependencies, Cross-References und Quellen

1. NVIDIA-Dokumentation: [Mastering LLM Techniques — Inference Optimization](https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/), abgerufen 2026-09-17.
2. Kwon et al.: [Efficient Memory Management for Large Language Model Serving with PagedAttention](https://arxiv.org/abs/2309.06180), abgerufen 2026-09-17.

GPU-Architektur und Rechenpfade sind kanonisch in [KB-0413](01-gpu-architektur-und-rechenpfade.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| PagedAttention-basierte KV-Cache-Verwaltung, die Fragmentierung reduziert und effizientere Speichernutzung ermöglicht | Adopting | Gegenüber naiver, zusammenhängender KV-Cache-Allokation für reduzierte Fragmentierung und höhere effektive Kapazität bevorzugen. |
| KV-Cache-Quantisierung zur Reduktion des Speicherbedarfs pro gespeichertem Token | Evaluating | Gegenüber voller Präzision im KV-Cache abwägen, sobald der Genauigkeitsverlust für den konkreten Anwendungsfall vertretbar ist. |

Ein Team akzeptiert eine Inferenz-Kapazitätsplanung erst, wenn der VRAM-Bedarf nachweislich komponentenweise (Gewichte, Aktivierungen, KV-Cache) kalkuliert wurde.
