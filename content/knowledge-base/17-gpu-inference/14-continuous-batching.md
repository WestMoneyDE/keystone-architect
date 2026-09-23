---
{"id": "KB-0426", "title": "Continuous Batching", "domain": "17", "sequence": 14, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "MLOPS"], "requires": [{"id": "KB-0420", "concepts": ["VLLM, kontinuierliches Batching"], "needed_for": "understanding"}, {"id": "KB-0425", "concepts": ["KV Caches und Eviction"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Nachvollziehen, wie eine Serving-Engine laufende Sequenzen dynamisch in eine aktive Batch-Verarbeitung einschleust und abgeschlossene Sequenzen ausschleust, und den Unterschied zu statischem Batching erklären können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Fairness-Mechanismen (z. B. maximale Wartezeit, Tokenlimits pro Anfrage) so konfigurieren, dass weder kurze noch lange Anfragen systematisch benachteiligt werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Verzögerung kurzer Anfragen hinter sehr langen Ausgaben auf eine unzureichend konfigurierte Fairness- oder Tokenlimit-Strategie zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Fairness- und Tokenlimit-Richtlinien für produktive Multi-Nutzer-Inferenzdienste im Unternehmen anhand gemessener Latenzverteilungen statt anhand pauschaler Annahmen festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Scheduler-Implementierung (z. B. exakte Iterationslogik pro Engine) im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von dynamischem Ein-/Ausschleusen und Fairness-Trade-offs als Entscheidungsgrundlage, nicht die Scheduler-Interna."}}, "lab_validation": [{"lab_id": "KB-0426-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Konzeptuelle Einordnung anhand offizieller Dokumentation und Forschungsveröffentlichungen zu Serving-Frameworks, kein aktives Deployment verwendet", "evidence": "Anhand offizieller Dokumentation und Forschungsveröffentlichungen (u. a. Orca-Paper zu iteration-level scheduling) wird nachvollzogen, wie kontinuierliches Batching neue Sequenzen dynamisch in eine laufende Batch-Verarbeitung einschleust, abgeschlossene Sequenzen ausschleust, und wie Tokenlimits und Fairness-Mechanismen unterschiedlich lange Ausgaben ausbalancieren.", "limitations": "Keine reale Ausführung gegen ein produktives Deployment durchgeführt, keine realen Latenz- oder Fairness-Messungen unter echter Mischlast erhoben."}]}
---
# Continuous Batching

> **Ziel:** Kontinuierliches Batching (continuous batching, auch iteration-level scheduling) schleust laufende Sequenzen dynamisch in eine bereits aktive Batch-Verarbeitung ein, sobald Kapazität frei wird (z. B. weil eine andere Sequenz abgeschlossen ist), statt wie beim statischen Batching auf den Abschluss einer festen Anfragegruppe zu warten (siehe [KB-0420](08-vllm.md)). Der zentrale Punkt dieses Kapitels ist, dass diese dynamische Ein-/Ausschleusung bei stark unterschiedlichen Ausgabelängen (manche Anfragen generieren wenige, andere sehr viele Tokens) ein Fairness-Problem erzeugt — ohne geeignete Tokenlimits oder Fairness-Mechanismen können kurze Anfragen hinter sehr langen Anfragen unverhältnismäßig lange auf Verarbeitungskapazität warten, was anhand realer Inferenzlasten (nicht anhand idealisierter, gleich langer Anfragen) untersucht werden muss.

## Zweck, Mental Model und Dependenzen

Bei statischem Batching wird eine feste Gruppe von Anfragen gemeinsam verarbeitet, bis alle abgeschlossen sind — währenddessen bleibt die durch die kürzeste Anfrage frei werdende Kapazität ungenutzt, bis die gesamte Gruppe fertig ist. Kontinuierliches Batching löst dieses Problem, indem der Scheduler bei jeder Iteration (jedem Generierungsschritt) prüft, welche Sequenzen abgeschlossen sind und welche neuen Anfragen in der Warteschlange auf freie Kapazität warten, und die frei gewordene Kapazität sofort für neue Sequenzen nutzt. Dies maximiert die GPU-Auslastung, erzeugt jedoch ein neues Problem: Wenn eine sehr lange Anfrage (viele zu generierende Tokens) kontinuierlich Kapazität belegt, während viele kurze Anfragen in der Warteschlange auf freie Kapazität warten, kann die Latenz kurzer Anfragen unverhältnismäßig steigen, wenn der Scheduler keine Fairness-Mechanismen berücksichtigt. Der zentrale methodische Punkt ist, dass Fairness in kontinuierlichem Batching nicht automatisch gegeben ist — sie muss explizit über Mechanismen wie maximale Wartezeit pro Anfrage, Tokenlimits pro Iteration, oder Priorisierungsstrategien konfiguriert werden, und deren Wirksamkeit muss anhand realer, gemischter Lastmuster (unterschiedliche Ausgabelängen gleichzeitig) untersucht werden, nicht anhand idealisierter Tests mit gleich langen Anfragen.

~~~text
Static batching: FIXED group processed together, capacity freed by shortest request WASTED until whole group done
Continuous batching: scheduler checks EVERY iteration (each generation step)
  which sequences finished -> dequeue; which new requests waiting -> enqueue into freed capacity
  -> maximizes GPU utilization
NEW PROBLEM: very long request continuously holds capacity while many SHORT requests queue
  -> without fairness mechanisms, short requests suffer disproportionate latency
KEY METHODOLOGICAL POINT: fairness is NOT automatic
  -> requires explicit config: max wait time per request, per-iteration token limits, priority strategy
  -> effectiveness must be studied under REAL mixed-length load, not idealized equal-length tests
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Dynamisches Ein-/Ausschleusen | nutzt freiwerdende Kapazität sofort für neue Sequenzen | maximiert Auslastung, erfordert Iteration-Level-Scheduling |
| Tokenlimits | begrenzen die pro Iteration/Anfrage verarbeitete Tokenmenge | verhindern, dass eine Anfrage übermäßig viel Kapazität dauerhaft belegt |
| Fairness-Mechanismen | verhindern unverhältnismäßige Wartezeiten kurzer Anfragen | müssen anhand realer, gemischter Ausgabelängen getestet werden |
| Reale Inferenzlasten | Mischung unterschiedlicher Ausgabelängen gleichzeitig | idealisierte, gleich lange Testanfragen zeigen Fairness-Probleme nicht auf |

Implementierung: Der Scheduler wird mit Tokenlimits pro Iteration konfiguriert, sodass eine einzelne, sehr lange Anfrage nicht dauerhaft die gesamte verfügbare Kapazität belegt, sondern regelmäßig Kapazität für wartende, kürzere Anfragen freigibt. Fairness wird anhand einer realen, gemischten Lastsimulation (kurze und lange Ausgaben gleichzeitig) gemessen, indem die Latenzverteilung kurzer Anfragen unter gemischter Last mit deren Latenz unter isolierter Last verglichen wird. Bei der Konfiguration von Prioritätsstrategien wird geprüft, ob eine bevorzugte Behandlung bestimmter Anfragetypen (z. B. interaktive versus Batch-Anfragen) sachlich begründet ist, statt eine pauschale Priorisierung ohne klaren Anwendungsfall einzuführen.

## Scalability, Reliability, Security und Observability

Kontinuierliches Batching skaliert die effektive GPU-Auslastung proportional zur Häufigkeit, mit der frei werdende Kapazität für neue Sequenzen genutzt wird; die Reliability-Grenze liegt darin, dass eine fehlende oder unzureichend konfigurierte Fairness-Strategie proportional zur Varianz der Ausgabelängen in der Workload zu einer stark ungleichmäßigen Latenzverteilung zwischen kurzen und langen Anfragen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| kurze Anfragen zeigen unerwartet hohe Latenz unter gemischter Last | eine oder mehrere sehr lange Anfragen belegen kontinuierlich Kapazität ohne wirksames Tokenlimit | ein Tokenlimit pro Iteration einführen oder verschärfen und die Latenzverteilung erneut messen |
| die GPU-Auslastung ist trotz kontinuierlichem Batching niedriger als erwartet | die Warteschlange enthält nicht genügend wartende Anfragen, um frei werdende Kapazität sofort zu füllen | die tatsächliche Ankunftsrate der Anfragen gegen die verfügbare Kapazität prüfen |
| bestimmte Nutzer oder Anfragetypen werden systematisch benachteiligt | die Fairness- oder Prioritätsstrategie ist nicht sachlich begründet auf diese Gruppe abgestimmt | die Prioritätskonfiguration gegen die tatsächliche, beabsichtigte Fairness-Politik prüfen |

Security: Fairness- und Prioritätsmechanismen sollten dokumentiert und nachvollziehbar sein, um zu verhindern, dass eine implizite, ungeprüfte Priorisierung bestimmte Nutzergruppen unangemessen bevorzugt oder benachteiligt. Observability: Die Latenzverteilung getrennt nach kurzen und langen Anfragen, die tatsächliche GPU-Auslastung über die Zeit, und die durchschnittliche Wartezeit in der Warteschlange sind zentrale Metriken zur Bewertung der Fairness und Effizienz.

## Trade-offs und Entscheidungen

**Staff** konfiguriert Tokenlimits und Fairness-Mechanismen basierend auf gemessenen Latenzverteilungen unter realer, gemischter Last. **Principal** macht die Fairness-Politik und deren Begründung für das Team nachvollziehbar. **Chief** legt Fairness- und Tokenlimit-Richtlinien für produktive Multi-Nutzer-Inferenzdienste im Unternehmen anhand gemessener, nicht angenommener Latenzverteilungen fest.

Anti-Patterns: kontinuierliches Batching ohne Tokenlimits einführen und dadurch zulassen, dass einzelne lange Anfragen die Kapazität dauerhaft dominieren; Fairness ausschließlich anhand idealisierter, gleich langer Testanfragen prüfen, statt reale, gemischte Lastmuster zu untersuchen; eine implizite, undokumentierte Priorisierung bestimmter Anfragetypen ohne sachliche Begründung einführen.

## Production Checklist

- [ ] Tokenlimits pro Iteration verhindern, dass einzelne Anfragen die Kapazität dauerhaft dominieren.
- [ ] Die Latenzverteilung kurzer und langer Anfragen wurde unter realer, gemischter Last gemessen.
- [ ] Prioritäts- oder Fairness-Strategien sind dokumentiert und sachlich begründet.
- [ ] GPU-Auslastung, Wartezeit und Latenzverteilung werden getrennt nach Anfragetyp überwacht.

## Interviewfragen

### 1. Was ist der zentrale Unterschied zwischen statischem und kontinuierlichem Batching?

**Antwort:** Bei statischem Batching wird eine feste Anfragegruppe gemeinsam bis zum vollständigen Abschluss verarbeitet, während kontinuierliches Batching bei jeder Iteration frei werdende Kapazität sofort für neue, wartende Anfragen nutzt.

### 2. Welches Fairness-Problem kann kontinuierliches Batching erzeugen?

**Antwort:** Eine sehr lange Anfrage kann kontinuierlich Kapazität belegen, wodurch kurze, wartende Anfragen unverhältnismäßig lange auf Verarbeitung warten müssen, wenn keine Fairness-Mechanismen konfiguriert sind.

### 3. Wie wird verhindert, dass eine einzelne lange Anfrage die Kapazität dauerhaft dominiert?

**Antwort:** Durch Tokenlimits pro Iteration, die die pro Anfrage in einem Schritt verarbeitete Tokenmenge begrenzen und so regelmäßig Kapazität für andere, wartende Anfragen freigeben.

### 4. Warum reichen idealisierte Tests mit gleich langen Anfragen nicht aus, um Fairness zu bewerten?

**Antwort:** Weil das Fairness-Problem gerade bei stark unterschiedlichen Ausgabelängen auftritt; bei gleich langen Testanfragen wird die ungleichmäßige Latenzverteilung nicht sichtbar.

### 5. Wie gehst du vor, wenn kurze Anfragen unter gemischter Last unerwartet hohe Latenz zeigen?

**Antwort:** Ich prüfe, ob eine oder mehrere lange Anfragen ohne wirksames Tokenlimit kontinuierlich Kapazität belegen, und führe oder verschärfe ein Tokenlimit pro Iteration, um die Latenzverteilung zu verbessern.

### 6. Widersprüchliche Anforderung: Team will maximale GPU-Auslastung UND garantiert niedrige Latenz für interaktive, kurze Anfragen — wie gehst du vor?

**Antwort:** Ich würde ein Tokenlimit pro Iteration sowie eine Priorisierung interaktiver, kurzer Anfragen einführen, sodass lange Batch-Anfragen zwar weiterhin Kapazität nutzen, aber regelmäßig Platz für kurze, latenzkritische Anfragen freigeben, und die resultierende Latenzverteilung unter realer, gemischter Last messen.

## Praktische Labs

~~~python
# Conceptual continuous-batching fairness simulation (not executed against a real serving engine):

def simulate_continuous_batching(requests, capacity, token_limit_per_iteration):
    """requests: list of (id, remaining_tokens). Returns completion order and wait times."""
    queue = list(requests)
    active = []
    completion_order = []
    iteration = 0

    while queue or active:
        while len(active) < capacity and queue:
            active.append(queue.pop(0))

        next_active = []
        for req_id, remaining in active:
            processed = min(token_limit_per_iteration, remaining)
            remaining -= processed
            if remaining <= 0:
                completion_order.append((req_id, iteration))
            else:
                next_active.append((req_id, remaining))
        active = next_active
        iteration += 1

    return completion_order

requests = [("short_1", 5), ("short_2", 5), ("long_1", 100), ("short_3", 5)]

without_token_limit = simulate_continuous_batching(requests, capacity=2, token_limit_per_iteration=100)
with_token_limit = simulate_continuous_batching(requests, capacity=2, token_limit_per_iteration=5)

print(f"Without token limit (long request monopolizes): {without_token_limit}")
print(f"With token limit (fairer interleaving): {with_token_limit}")
~~~

## Dependencies, Cross-References und Quellen

1. Yu et al. (OSDI 2022): ["Orca: A Distributed Serving System for Transformer-Based Generative Models" — iteration-level scheduling](https://www.usenix.org/conference/osdi22/presentation/yu), abgerufen 2026-09-17.
2. vLLM-Dokumentation: [Continuous Batching](https://docs.vllm.ai/en/latest/), abgerufen 2026-09-17.

vLLM und kontinuierliches Batching sind kanonisch in [KB-0420](08-vllm.md) behandelt; KV-Cache-Management in [KB-0425](13-kv-caches-und-speicherbewusstes-routing.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Adaptive, lastabhängige Tokenlimits, die sich automatisch an die beobachtete Anfrageverteilung anpassen | Evaluating | Gegenüber statischen Tokenlimits erst nach Prüfung der tatsächlichen Stabilität unter schwankender Last bevorzugen. |
| Priorisierungsstrategien, die interaktive und Batch-Anfragen automatisch anhand von Anfrage-Metadaten unterscheiden | Evaluating | Gegenüber manueller Klassifizierung erst nach Prüfung der Klassifizierungsgenauigkeit bevorzugen. |

Ein Team akzeptiert eine kontinuierliche-Batching-Konfiguration erst, wenn die Latenzverteilung kurzer Anfragen unter realer, gemischter Last nachweislich innerhalb akzeptabler Grenzen bleibt.
