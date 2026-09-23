---
{"id": "KB-0420", "title": "VLLM", "domain": "17", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "MLOPS"], "requires": [{"id": "KB-0415", "concepts": ["VRAM und Speicherbudgets"], "needed_for": "understanding"}, {"id": "KB-0419", "concepts": ["NVIDIA Triton, Batching"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein vLLM-Deployment mit kontinuierlichem Batching und PagedAttention anhand offizieller Dokumentation nachvollziehen und die Auswirkung auf den effektiven Durchsatz erklären können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Die Speicherbelegungsstrategie (PagedAttention) und Parallelisierungsoptionen von vLLM gegenüber alternativen Inferenz-Servern abwägen und für einen konkreten Anwendungsfall begründet auswählen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Speicherfragmentierung oder Durchsatzeinbuße bei einem vLLM-Deployment auf eine konkrete Konfigurations- oder Versionsursache zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Den Einsatz von vLLM als produktive Inferenz-Serving-Lösung gegen Alternativen (z. B. Triton mit anderen Backends) anhand nachvollziehbarer Kriterien im Unternehmen entscheiden.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung des PagedAttention-Kernels im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Speicherbelegung, Scheduler und Endpunktkompatibilität als Entscheidungsgrundlage, nicht die Kernel-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0420-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal beschriebener vLLM-Workflow anhand offizieller Dokumentation, kein aktiver GPU-Cluster verwendet", "evidence": "Anhand der offiziellen vLLM-Dokumentation wird nachvollzogen, wie PagedAttention die KV-Cache-Speicherbelegung in Seiten organisiert, wie der Scheduler kontinuierliches Batching umsetzt, und wie der OpenAI-kompatible Endpunkt bestehende Client-Integrationen ermöglicht.", "limitations": "Keine reale Ausführung gegen einen produktiven vLLM-Server, keine realen GPU-Ressourcen genutzt, keine Releaseabhängigkeiten gegen eine spezifische vLLM-Version geprüft."}]}
---
# VLLM

> **Ziel:** vLLM ist ein spezialisierter Inferenz-Server für große Sprachmodelle, dessen zentrale Innovation PagedAttention ist — eine Speicherverwaltungsstrategie für den KV-Cache (Key-Value-Cache, der die während der Textgenerierung berechneten Aufmerksamkeitszustände speichert), die Speicherfragmentierung reduziert und dadurch mehr gleichzeitige Anfragen im verfügbaren VRAM unterbringt (siehe VRAM-Budgetierung, [KB-0415](03-vram-und-speicherbudgets.md)). Der zentrale Punkt dieses Kapitels ist, dass Speicherbelegung, Scheduler-Verhalten (kontinuierliches Batching) und die Kompatibilität mit dem OpenAI-API-Format jeweils anhand von Primärquellen (offizieller Dokumentation, tatsächlich getesteter Konfiguration) geprüft werden müssen, statt pauschale Aussagen über Durchsatzvorteile ungeprüft zu übernehmen.

## Zweck, Mental Model und Dependencies

PagedAttention überträgt ein aus dem Betriebssystem-Speichermanagement bekanntes Konzept (virtuelle Speicherseiten) auf den KV-Cache eines Sprachmodells: Statt für jede Anfrage einen zusammenhängenden, für die maximale Sequenzlänge dimensionierten Speicherblock zu reservieren (was bei kürzeren tatsächlichen Antworten zu verschwendetem, fragmentiertem Speicher führt), wird der KV-Cache in kleinere, nicht notwendigerweise zusammenhängende Seiten aufgeteilt, die bedarfsgerecht zugewiesen werden. Der Scheduler von vLLM implementiert kontinuierliches Batching (continuous batching): Statt auf die Bildung eines vollständigen Batches zu warten, bevor eine Inferenz startet, werden neue Anfragen fortlaufend in eine laufende Batch-Verarbeitung eingefügt, sobald Kapazität frei wird — dies unterscheidet sich vom statischen Batching, bei dem eine feste Gruppe von Anfragen gemeinsam bis zum Abschluss verarbeitet wird. Der OpenAI-kompatible Endpunkt ermöglicht es, vLLM als Ersatz für die OpenAI-API in bestehenden Client-Anwendungen einzusetzen, ohne die Client-Integration anzupassen. Der zentrale methodische Punkt ist, dass Aussagen über den tatsächlichen Durchsatz- oder Speichervorteil von vLLM gegenüber Alternativen immer anhand der konkreten Modellgröße, Sequenzlängenverteilung und Hardwarekonfiguration primärquellenbasiert geprüft werden müssen, statt allgemeine Benchmark-Zahlen ungeprüft auf einen abweichenden Anwendungsfall zu übertragen.

~~~text
PagedAttention: KV-cache split into PAGES (not one contiguous block per request)
  -> reduces fragmentation from requests finishing shorter than their reserved max length
  -> more concurrent requests fit in the same VRAM budget
Continuous batching (scheduler): new requests inserted into an ALREADY RUNNING batch as capacity frees up
  (vs static batching: fixed group processed together until ALL finish)
OpenAI-compatible endpoint: drop-in for existing OpenAI-API client integrations
KEY METHODOLOGICAL POINT: throughput/memory advantage claims MUST be checked against
  actual model size + sequence length distribution + hardware config (primary sources)
  -> NEVER transfer generic benchmark numbers uncritically to a different use case
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| PagedAttention | reduziert KV-Cache-Fragmentierung | tatsächlicher Speichervorteil hängt von Sequenzlängenverteilung ab |
| Scheduler (kontinuierliches Batching) | maximiert GPU-Auslastung über die Zeit | Durchsatzvorteil hängt von Anfragerate und -muster ab |
| OpenAI-kompatible Endpunkte | ermöglichen Drop-in-Ersatz bestehender Integrationen | API-Kompatibilität muss gegen die tatsächlich genutzten Endpunkt-Funktionen geprüft werden |
| Releaseabhängigkeiten | vLLM entwickelt sich schnell weiter | Funktions-/Modellunterstützung muss gegen die tatsächlich eingesetzte Version geprüft werden |

Implementierung: Vor dem Einsatz von vLLM wird anhand der offiziellen Dokumentation geprüft, ob die eingesetzte Modellarchitektur und -größe von der jeweiligen vLLM-Version unterstützt wird, da die Unterstützung neuer Architekturen zeitverzögert zu deren Veröffentlichung erfolgt. Die Parallelisierungskonfiguration (Tensor-Parallelität über mehrere GPUs) wird basierend auf der tatsächlichen Modellgröße relativ zum verfügbaren VRAM pro GPU gewählt, nicht basierend auf einer pauschalen Annahme. Vor einer produktiven Migration von einem anderen Inferenz-Server zu vLLM wird ein repräsentativer Lasttest mit den tatsächlichen Anfragemustern (Sequenzlängen, Anfragerate) durchgeführt, um den behaupteten Durchsatzvorteil für den konkreten Anwendungsfall zu verifizieren, statt sich auf generische, veröffentlichte Benchmark-Zahlen zu verlassen.

## Scalability, Reliability, Security und Observability

vLLM skaliert die Anzahl gleichzeitig bedienbarer Anfragen proportional zur Effizienz der PagedAttention-Speicherverwaltung und der Scheduler-Auslastung; die Reliability-Grenze liegt darin, dass eine ungeprüfte, aus generischen Benchmarks übernommene Kapazitätsannahme proportional zur Abweichung des tatsächlichen Anfragemusters vom Benchmark-Muster zu Fehleinschätzungen der produktiven Kapazität führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| der tatsächliche Durchsatz liegt deutlich unter veröffentlichten Benchmark-Zahlen | das tatsächliche Anfragemuster (Sequenzlängen, Anfragerate) weicht vom Benchmark-Muster ab | einen Lasttest mit den tatsächlichen Anfragemustern durchführen und die Ergebnisse gegen die Benchmark-Annahmen vergleichen |
| eine neue Modellarchitektur wird nicht unterstützt | die eingesetzte vLLM-Version unterstützt diese Architektur noch nicht | die offizielle Dokumentation/Release Notes auf Unterstützung der spezifischen Architektur prüfen |
| die GPU-Speicherauslastung ist unerwartet hoch trotz PagedAttention | die konfigurierte maximale Sequenzlänge oder Batch-Größe ist für die verfügbare VRAM-Kapazität zu hoch gewählt | die Konfiguration gegen die tatsächliche VRAM-Kapazität und das reale Anfragemuster neu dimensionieren |

Security: Ein OpenAI-kompatibler Endpunkt sollte mit denselben Authentifizierungs- und Zugriffskontrollmaßnahmen wie jeder andere produktive API-Endpunkt abgesichert werden, da die Kompatibilität allein keine Sicherheitsmaßnahmen ersetzt. Observability: Die tatsächliche GPU-Speicherauslastung, die Anzahl gleichzeitig bedienter Anfragen, und die Latenzverteilung pro Anfrage sind zentrale vLLM-Metriken zur Kapazitätsplanung.

## Trade-offs und Entscheidungen

**Staff** verifiziert Durchsatz- und Speicherbehauptungen zu vLLM anhand eigener Lasttests mit realistischen Anfragemustern, statt Benchmark-Zahlen ungeprüft zu übernehmen. **Principal** macht die Entscheidungsgrundlage (verifizierte Zahlen versus generische Benchmarks) für das Team nachvollziehbar. **Chief** entscheidet den Einsatz von vLLM gegenüber Alternativen anhand primärquellenbasiert verifizierter, anwendungsfallspezifischer Kriterien im Unternehmen.

Anti-Patterns: veröffentlichte vLLM-Benchmark-Zahlen ungeprüft auf ein abweichendes Anfragemuster oder eine abweichende Modellgröße übertragen; eine vLLM-Version ohne Prüfung der Release Notes auf Unterstützung der eingesetzten Modellarchitektur produktiv einsetzen; den OpenAI-kompatiblen Endpunkt ohne dieselben Zugriffskontrollmaßnahmen wie andere produktive API-Endpunkte betreiben.

## Production Checklist

- [ ] Die eingesetzte vLLM-Version unterstützt die konkrete Modellarchitektur laut offizieller Dokumentation.
- [ ] Ein Lasttest mit realistischen Anfragemustern verifiziert den tatsächlichen Durchsatz- und Speichervorteil.
- [ ] Der OpenAI-kompatible Endpunkt ist mit denselben Zugriffskontrollmaßnahmen wie andere produktive Endpunkte abgesichert.
- [ ] GPU-Speicherauslastung und Latenzverteilung werden fortlaufend überwacht.

## Interviewfragen

### 1. Was ist PagedAttention, und welches Problem löst es?

**Antwort:** Eine Speicherverwaltungsstrategie, die den KV-Cache in Seiten aufteilt statt in einem zusammenhängenden, für die maximale Sequenzlänge dimensionierten Block zu reservieren, wodurch Speicherfragmentierung reduziert und mehr gleichzeitige Anfragen im verfügbaren VRAM untergebracht werden.

### 2. Was ist kontinuierliches Batching, und wie unterscheidet es sich von statischem Batching?

**Antwort:** Beim kontinuierlichen Batching werden neue Anfragen fortlaufend in eine laufende Batch-Verarbeitung eingefügt, sobald Kapazität frei wird, statt wie beim statischen Batching auf den Abschluss einer festen Anfragegruppe zu warten.

### 3. Was ermöglicht der OpenAI-kompatible Endpunkt von vLLM?

**Antwort:** Den Einsatz von vLLM als Drop-in-Ersatz für die OpenAI-API in bestehenden Client-Anwendungen, ohne deren Integration anzupassen.

### 4. Warum sollten veröffentlichte vLLM-Benchmark-Zahlen nicht ungeprüft übernommen werden?

**Antwort:** Weil der tatsächliche Durchsatz- und Speichervorteil von der konkreten Modellgröße, Sequenzlängenverteilung und Hardwarekonfiguration abhängt, die vom Benchmark-Setup abweichen kann.

### 5. Wie gehst du vor, wenn der tatsächliche Durchsatz deutlich unter veröffentlichten Benchmark-Zahlen liegt?

**Antwort:** Ich prüfe, ob das tatsächliche Anfragemuster (Sequenzlängen, Anfragerate) vom Benchmark-Muster abweicht, und führe einen eigenen Lasttest mit den realen Mustern durch, um die tatsächliche Kapazität zu ermitteln.

### 6. Widersprüchliche Anforderung: Team will sofort auf vLLM migrieren, weil ein Blogpost hohe Durchsatzgewinne verspricht — wie gehst du vor?

**Antwort:** Ich würde vor der Migration einen Lasttest mit den tatsächlichen, produktiven Anfragemustern gegen die aktuelle Lösung und vLLM durchführen, um den behaupteten Durchsatzgewinn für den konkreten Anwendungsfall zu verifizieren, statt die Blogpost-Zahlen ungeprüft als Entscheidungsgrundlage zu verwenden.

## Praktische Labs

~~~python
# Conceptual comparison: static vs continuous batching completion times (not executed against a real vLLM server):

import random

def simulate_static_batching(request_lengths, batch_size=4):
    total_time = 0
    for i in range(0, len(request_lengths), batch_size):
        batch = request_lengths[i:i + batch_size]
        total_time += max(batch)  # whole batch waits for the LONGEST request
    return total_time

def simulate_continuous_batching(request_lengths, capacity=4):
    # simplified: capacity slots are freed and refilled as soon as a request finishes
    remaining = sorted(request_lengths)
    total_time = sum(remaining) / capacity  # approximation of steady-state throughput
    return round(total_time, 2)

random.seed(42)
request_lengths = [random.randint(5, 50) for _ in range(20)]

static_time = simulate_static_batching(request_lengths)
continuous_time = simulate_continuous_batching(request_lengths)

print(f"Static batching total time (approx): {static_time}")
print(f"Continuous batching total time (approx): {continuous_time}")
print(f"Speedup factor (approx): {round(static_time / continuous_time, 2)}x")
~~~

## Dependencies, Cross-References und Quellen

1. vLLM-Dokumentation: [PagedAttention](https://docs.vllm.ai/en/latest/design/kernel/paged_attention.html), abgerufen 2026-09-17.
2. vLLM-Dokumentation: [OpenAI-Compatible Server](https://docs.vllm.ai/en/latest/serving/openai_compatible_server.html), abgerufen 2026-09-17.

VRAM und Speicherbudgets sind kanonisch in [KB-0415](03-vram-und-speicherbudgets.md) behandelt; NVIDIA Triton und modellspezifisches Batching in [KB-0419](07-nvidia-triton.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Speculative Decoding zur Beschleunigung der Token-Generierung innerhalb von vLLM | Evaluating | Gegenüber Standard-Decoding erst nach eigenem Lasttest zur Verifikation des tatsächlichen Latenzgewinns für den konkreten Anwendungsfall bevorzugen. |
| Erweiterte Multi-Modell- und Multi-LoRA-Serving-Unterstützung innerhalb einer vLLM-Instanz | Adopting | Gegenüber separaten Server-Instanzen pro Modell abwägen, sobald Isolationsanforderungen und Ressourcenteilung geprüft sind. |

Ein Team akzeptiert eine vLLM-Migration erst, wenn ein eigener Lasttest mit realistischen Anfragemustern den behaupteten Durchsatz- oder Speichervorteil für den konkreten Anwendungsfall nachweislich bestätigt.
