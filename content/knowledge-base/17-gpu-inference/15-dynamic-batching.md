---
{"id": "KB-0427", "title": "Dynamic Batching", "domain": "17", "sequence": 15, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "MLOPS"], "requires": [{"id": "KB-0419", "concepts": ["NVIDIA Triton, modellspezifisches Batching"], "needed_for": "understanding"}, {"id": "KB-0426", "concepts": ["Continuous Batching"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Dynamic-Batching-Wartefenster für ein Modell mit fester Eingabeform konfigurieren und den Effekt auf Durchsatz und Einzelanfragelatenz nachvollziehen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Das Wartefenster für Dynamic Batching anhand der Latenzanforderungen und der tatsächlichen Anfrageankunftsrate eines konkreten Modells begründet dimensionieren.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Latenzerhöhung einzelner Anfragen auf ein zu lang konfiguriertes Wartefenster zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Dynamic-Batching-Richtlinien für produktive Modelle mit fester Eingabeform im Unternehmen anhand gemessener Durchsatz-/Latenz-Trade-offs statt pauschaler Standardwerte festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung modellframework-spezifischer Batching-Scheduler im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Wartefenster-Konfiguration und Durchsatz-/Latenz-Trade-off als Entscheidungsgrundlage, nicht die Scheduler-Interna."}}, "lab_validation": [{"lab_id": "KB-0427-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Konzeptuelle Einordnung anhand offizieller Triton-Dokumentation, kein aktives Deployment verwendet", "evidence": "Anhand der offiziellen Triton-Dokumentation zu Dynamic Batching wird nachvollzogen, wie eingehende Anfragen innerhalb eines konfigurierbaren Wartefensters zu einem gemeinsamen Batch gebündelt werden, bevor eine Inferenz für ein Modell mit fester Eingabeform gestartet wird, und wie sich das Wartefenster auf Durchsatz und Einzelanfragelatenz auswirkt.", "limitations": "Keine reale Ausführung gegen ein produktives Deployment durchgeführt, keine realen Durchsatz- oder Latenzmessungen erhoben."}]}
---
# Dynamic Batching

> **Ziel:** Dynamic Batching bündelt eingehende Anfragen innerhalb eines begrenzten, konfigurierbaren Wartefensters (z. B. wenige Millisekunden) zu einem gemeinsamen Batch, bevor eine Inferenz gestartet wird — dies unterscheidet sich von kontinuierlichem Batching (siehe [KB-0426](14-continuous-batching.md)), das für autoregressive Generierung mit variabler Ausgabelänge konzipiert ist, während Dynamic Batching primär für Modelle mit fester Eingabeform und einem einzelnen Vorwärtsdurchlauf pro Anfrage (klassische ML-/Vision-Modelle, wie sie z. B. über NVIDIA Triton bereitgestellt werden, siehe [KB-0419](07-nvidia-triton.md)) relevant ist. Der zentrale Punkt dieses Kapitels ist, dass die Länge des Wartefensters einen direkten Trade-off zwischen maximalem Durchsatz (längeres Fenster, größere Batches, bessere GPU-Auslastung) und Einzelanfragelatenz (kürzeres Fenster, geringere Wartezeit, aber potenziell kleinere, weniger effiziente Batches) darstellt, der anhand der tatsächlichen Latenzanforderungen des konkreten Modells dimensioniert werden muss.

## Zweck, Mental Model und Dependencies

Bei Modellen mit fester Eingabeform (z. B. ein Bildklassifikationsmodell mit fester Bildauflösung) besteht eine Inferenzanfrage aus einem einzelnen Vorwärtsdurchlauf, im Gegensatz zur mehrstufigen, sequenziellen Generierung bei Sprachmodellen. Dynamic Batching sammelt eingehende Einzelanfragen innerhalb eines Wartefensters, bevor der Vorwärtsdurchlauf für den gesamten gesammelten Batch gemeinsam ausgeführt wird — dies erhöht die GPU-Auslastung, da ein größerer Batch die parallele Rechenkapazität der GPU besser ausnutzt als viele einzelne, sequenziell verarbeitete Anfragen. Das Wartefenster erzeugt jedoch selbst eine zusätzliche Latenz: Eine früh eintreffende Anfrage muss warten, bis entweder das Wartefenster abgelaufen ist oder eine maximale Batch-Größe erreicht ist, bevor ihre Inferenz beginnt. Der zentrale methodische Punkt ist, dass die optimale Wartefensterlänge von der tatsächlichen Anfrageankunftsrate und den Latenzanforderungen des konkreten Anwendungsfalls abhängt — bei einer hohen Ankunftsrate füllt sich ein Batch auch innerhalb eines kurzen Fensters, während bei niedriger Ankunftsrate ein zu langes Fenster unnötige Latenz erzeugt, ohne den Durchsatz proportional zu verbessern.

~~~text
Fixed-input-shape model (e.g. image classification): ONE forward pass per request
  (unlike autoregressive LLM generation with variable output length, see KB-0426)
Dynamic batching: collect incoming requests within a WAIT WINDOW (e.g. a few ms)
  -> run forward pass for the WHOLE collected batch together
  -> larger batch = better GPU utilization (parallel compute capacity used more fully)
TRADE-OFF: wait window itself ADDS latency
  early-arriving request waits until window expires OR max batch size reached
KEY METHODOLOGICAL POINT: optimal window length depends on ACTUAL arrival rate + latency requirements
  high arrival rate -> batch fills even within a short window
  low arrival rate -> long window adds unnecessary latency without proportional throughput gain
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Wartefenster (max_queue_delay) | Zeitspanne, in der Anfragen gesammelt werden | Länge bestimmt Trade-off zwischen Latenz und Durchsatz |
| Maximale Batch-Größe | obere Grenze für die Batch-Größe unabhängig vom Wartefenster | verhindert übermäßig große Batches bei hoher Ankunftsrate |
| Feste Eingabeform | Voraussetzung für gemeinsame Batch-Verarbeitung | Modelle mit variabler Eingabeform benötigen zusätzliches Padding oder andere Batching-Strategien |
| Ankunftsrate | tatsächliche Häufigkeit eingehender Anfragen | bestimmt, wie schnell sich ein Batch innerhalb des Wartefensters füllt |

Implementierung: Das Wartefenster wird basierend auf der tatsächlichen Latenzanforderung des Anwendungsfalls (z. B. Echtzeit-Interaktion versus Batch-Verarbeitung) und der gemessenen Anfrageankunftsrate dimensioniert — bei latenzkritischen Anwendungsfällen wird ein kurzes Fenster gewählt, auch wenn dies zu kleineren, weniger effizienten Batches führt. Die maximale Batch-Größe wird zusätzlich zum Wartefenster konfiguriert, um bei sehr hoher Ankunftsrate zu verhindern, dass ein einzelner Batch übermäßig groß wird und dadurch die Latenz aller in diesem Batch enthaltenen Anfragen unnötig erhöht. Vor einer produktiven Konfigurationsänderung wird der tatsächliche Effekt auf Durchsatz und Latenzverteilung unter realistischer Ankunftsrate gemessen, statt Standardwerte ungeprüft zu übernehmen.

## Scalability, Reliability, Security und Observability

Dynamic Batching skaliert den Durchsatz proportional zur Batch-Größe, die innerhalb des Wartefensters erreicht wird; die Reliability-Grenze liegt darin, dass ein zu lang dimensioniertes Wartefenster proportional zur Diskrepanz zwischen konfiguriertem Fenster und tatsächlicher Ankunftsrate zu unnötiger, vermeidbarer Latenz führt, ohne den Durchsatz entsprechend zu verbessern.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| die Latenz einzelner Anfragen ist unerwartet hoch | das Wartefenster ist länger konfiguriert, als für die tatsächliche Ankunftsrate und Latenzanforderung nötig ist | das Wartefenster reduzieren und den Effekt auf Latenz und Durchsatz erneut messen |
| der Durchsatz ist trotz Dynamic Batching niedriger als erwartet | die tatsächliche Ankunftsrate ist zu niedrig, um das Wartefenster mit ausreichend großen Batches zu füllen | die Ankunftsrate messen und das Wartefenster oder die maximale Batch-Größe entsprechend anpassen |
| einzelne, sehr große Batches verursachen Latenzspitzen | die maximale Batch-Größe ist nicht begrenzt, wodurch bei hoher Ankunftsrate übermäßig große Batches entstehen | eine maximale Batch-Größe zusätzlich zum Wartefenster konfigurieren |

Security: Bei gemischten Nutzergruppen innerhalb desselben Batches sollte sichergestellt sein, dass keine nutzerspezifischen Daten zwischen den innerhalb eines Batches gebündelten Anfragen vermischt oder fehlgeleitet werden. Observability: Die tatsächliche Batch-Größenverteilung, die Latenz zwischen Anfrageankunft und Batch-Start, und der Gesamtdurchsatz sind zentrale Metriken zur Bewertung der Wartefenster-Konfiguration.

## Trade-offs und Entscheidungen

**Staff** dimensioniert das Wartefenster basierend auf gemessener Ankunftsrate und tatsächlicher Latenzanforderung des Anwendungsfalls. **Principal** macht den Durchsatz-/Latenz-Trade-off und dessen Begründung für das Team nachvollziehbar. **Chief** legt Dynamic-Batching-Richtlinien für produktive Modelle im Unternehmen anhand gemessener, nicht pauschal übernommener Konfigurationswerte fest.

Anti-Patterns: ein Wartefenster ohne Berücksichtigung der tatsächlichen Ankunftsrate und Latenzanforderung pauschal auf einen Standardwert setzen; keine maximale Batch-Größe konfigurieren und dadurch bei hoher Ankunftsrate unkontrolliert große, latenzerhöhende Batches zulassen; die Wartefensterkonfiguration ohne Messung des tatsächlichen Effekts auf Durchsatz und Latenz ändern.

## Production Checklist

- [ ] Das Wartefenster ist basierend auf gemessener Ankunftsrate und Latenzanforderung dimensioniert.
- [ ] Eine maximale Batch-Größe begrenzt die Batch-Größe zusätzlich zum Wartefenster.
- [ ] Der Effekt der Konfiguration auf Durchsatz und Latenzverteilung wurde unter realistischer Last gemessen.
- [ ] Batch-Größenverteilung und Latenz zwischen Anfrageankunft und Batch-Start werden überwacht.

## Interviewfragen

### 1. Was ist Dynamic Batching, und für welche Art von Modellen ist es primär relevant?

**Antwort:** Das Bündeln eingehender Anfragen innerhalb eines Wartefensters zu einem gemeinsamen Batch, bevor eine Inferenz gestartet wird; primär relevant für Modelle mit fester Eingabeform und einem einzelnen Vorwärtsdurchlauf pro Anfrage.

### 2. Worin unterscheidet sich Dynamic Batching von kontinuierlichem Batching?

**Antwort:** Dynamic Batching sammelt Anfragen innerhalb eines festen Wartefensters vor einem einzelnen gemeinsamen Vorwärtsdurchlauf, während kontinuierliches Batching laufende, mehrstufige Generierungssequenzen dynamisch iterationsweise ein- und ausschleust.

### 3. Welchen Trade-off stellt die Länge des Wartefensters dar?

**Antwort:** Ein längeres Fenster erhöht die Batch-Größe und damit den Durchsatz, erhöht aber gleichzeitig die Latenz früh eintreffender Anfragen, die auf das Fenster warten müssen.

### 4. Wovon hängt die optimale Wartefensterlänge ab?

**Antwort:** Von der tatsächlichen Anfrageankunftsrate und den Latenzanforderungen des konkreten Anwendungsfalls — bei hoher Ankunftsrate füllt sich ein Batch auch in einem kurzen Fenster, bei niedriger Ankunftsrate erzeugt ein zu langes Fenster unnötige Latenz.

### 5. Wie gehst du vor, wenn die Latenz einzelner Anfragen unerwartet hoch ist?

**Antwort:** Ich prüfe, ob das Wartefenster länger konfiguriert ist, als für die tatsächliche Ankunftsrate und Latenzanforderung nötig, und reduziere es gegebenenfalls, um die Latenz zu senken.

### 6. Widersprüchliche Anforderung: Team will maximalen Durchsatz UND garantiert niedrige Latenz für ein latenzkritisches Modell mit fester Eingabeform — wie gehst du vor?

**Antwort:** Ich würde ein kurzes Wartefenster wählen, das die Latenzanforderung erfüllt, auch wenn dies kleinere, weniger effiziente Batches bedeutet, und den resultierenden Durchsatz unter realer Last messen, statt den Durchsatz auf Kosten der garantierten Latenz zu maximieren.

## Praktische Labs

~~~python
# Conceptual wait-window throughput/latency trade-off simulation (not executed against a real Triton server):

def simulate_dynamic_batching(arrival_rate_per_ms, wait_window_ms, max_batch_size):
    expected_batch_size = min(arrival_rate_per_ms * wait_window_ms, max_batch_size)
    avg_wait_latency_ms = wait_window_ms / 2  # rough approximation: average wait until batch triggers
    throughput_per_ms = expected_batch_size / wait_window_ms if wait_window_ms else 0
    return {
        "expected_batch_size": round(expected_batch_size, 1),
        "avg_wait_latency_ms": round(avg_wait_latency_ms, 1),
        "throughput_per_ms": round(throughput_per_ms, 2),
    }

low_arrival_short_window = simulate_dynamic_batching(arrival_rate_per_ms=0.5, wait_window_ms=5, max_batch_size=32)
low_arrival_long_window = simulate_dynamic_batching(arrival_rate_per_ms=0.5, wait_window_ms=50, max_batch_size=32)
high_arrival_short_window = simulate_dynamic_batching(arrival_rate_per_ms=5, wait_window_ms=5, max_batch_size=32)

print(f"Low arrival, short window: {low_arrival_short_window}")
print(f"Low arrival, long window: {low_arrival_long_window}")
print(f"High arrival, short window: {high_arrival_short_window}")
~~~

## Dependencies, Cross-References und Quellen

1. NVIDIA-Dokumentation: [Triton — Dynamic Batcher](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/user_guide/model_configuration.html#dynamic-batcher), abgerufen 2026-09-17.

NVIDIA Triton und modellspezifisches Batching sind kanonisch in [KB-0419](07-nvidia-triton.md) behandelt; Continuous Batching in [KB-0426](14-continuous-batching.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Adaptive Wartefenster, die sich automatisch an die beobachtete Ankunftsrate anpassen, statt statisch konfiguriert zu sein | Evaluating | Gegenüber statischer Konfiguration erst nach Prüfung der tatsächlichen Stabilität unter schwankender Last bevorzugen. |

Ein Team akzeptiert eine Dynamic-Batching-Konfiguration erst, wenn der gemessene Durchsatz-/Latenz-Trade-off unter realer Ankunftsrate die tatsächliche Latenzanforderung des Anwendungsfalls nachweislich erfüllt.
