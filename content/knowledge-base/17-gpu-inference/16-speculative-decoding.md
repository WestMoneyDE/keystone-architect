---
{"id": "KB-0428", "title": "Speculative Decoding", "domain": "17", "sequence": 16, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "MLOPS"], "requires": [{"id": "KB-0413", "concepts": ["GPU-Architektur, compute vs. memory-bandwidth bound"], "needed_for": "understanding"}, {"id": "KB-0426", "concepts": ["Continuous Batching"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Das Zusammenspiel von Draft-Modell und Zielmodell bei Speculative Decoding anhand offizieller Dokumentation/Forschungsveröffentlichungen nachvollziehen und erklären können, warum eine korrekte Implementierung die Ausgabequalität des Zielmodells nicht verändert.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Bewerten, ob Speculative Decoding für ein konkretes Modellpaar (Draft-/Zielmodell) und eine konkrete Workload eine gemessene Beschleunigung erzielt, die den zusätzlichen Speicherbedarf rechtfertigt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartet niedrige Akzeptanzrate auf eine unpassende Wahl des Draft-Modells relativ zum Zielmodell oder zur Workload zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Den Einsatz von Speculative Decoding im Unternehmen anhand gemessener Beschleunigung und transparent kommunizierter Qualitätsgarantien statt anhand von Marketingversprechen entscheiden.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung verschiedener Speculative-Decoding-Varianten (z. B. Medusa, EAGLE) im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Akzeptanzrate, Qualitätsgarantie und Speicher-/Beschleunigungs-Trade-off als Entscheidungsgrundlage, nicht die Varianten-Interna."}}, "lab_validation": [{"lab_id": "KB-0428-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Konzeptuelle Einordnung anhand von Forschungsveröffentlichungen und offizieller Framework-Dokumentation, kein aktives Deployment verwendet", "evidence": "Anhand der ursprünglichen Speculative-Decoding-Forschungsveröffentlichungen (Leviathan et al., Chen et al.) sowie offizieller Framework-Dokumentation wird nachvollzogen, wie ein kleines, schnelles Draft-Modell mehrere Token-Vorschläge generiert, die vom größeren Zielmodell in einem einzigen Durchlauf verifiziert werden, und wie die Akzeptanzrate die tatsächlich erzielte Beschleunigung bestimmt.", "limitations": "Keine reale Ausführung gegen ein produktives Deployment durchgeführt, keine realen Akzeptanzraten oder Latenzmessungen für ein konkretes Modellpaar erhoben."}]}
---
# Speculative Decoding

> **Ziel:** Speculative Decoding beschleunigt die Token-Generierung eines großen, langsamen Zielmodells, indem ein kleineres, schnelleres Draft-Modell mehrere Token-Vorschläge im Voraus generiert, die anschließend vom Zielmodell in einem einzigen, parallelen Durchlauf verifiziert werden — akzeptierte Vorschläge werden übernommen, abgelehnte verworfen und stattdessen vom Zielmodell selbst neu generiert. Der zentrale Punkt dieses Kapitels ist, dass eine korrekt implementierte Speculative-Decoding-Methode die Ausgabequalität des Zielmodells mathematisch nicht verändert (die endgültige Ausgabe ist identisch zu einer reinen Zielmodell-Generierung), die tatsächlich erzielte Beschleunigung jedoch stark von der Akzeptanzrate (wie oft die Vorschläge des Draft-Modells tatsächlich vom Zielmodell akzeptiert werden) abhängt, und dieser zusätzliche Mechanismus zusätzlichen Speicherbedarf für das Draft-Modell erfordert, was transparent gegen die gemessene Beschleunigung abgewogen werden muss.

## Zweck, Mental Model und Dependencies

Die Decode-Phase eines Sprachmodells ist primär durch Speicherbandbreite limitiert, nicht durch Rechenleistung (siehe GPU-Architektur, [KB-0413](01-gpu-architektur-und-rechenpfade.md)) — ein einzelner Vorwärtsdurchlauf zur Generierung eines Tokens nutzt die parallele Rechenkapazität der GPU nur unzureichend aus. Speculative Decoding adressiert dieses Problem, indem ein kleines Draft-Modell mehrere Tokens sequenziell, aber sehr schnell vorschlägt, und das große Zielmodell diese mehreren vorgeschlagenen Tokens dann in einem einzigen, parallelen Durchlauf verifiziert (statt für jedes Token einen eigenen, sequenziellen Durchlauf durchzuführen) — dieser eine Verifikationsdurchlauf nutzt die GPU-Rechenkapazität deutlich besser aus, da mehrere Tokens gleichzeitig bewertet werden. Die mathematische Garantie besteht darin, dass die Verifikation nach einem Ablehnungsschema arbeitet, das sicherstellt, dass die resultierende Token-Verteilung exakt der Verteilung entspricht, die das Zielmodell allein erzeugt hätte — es handelt sich also nicht um eine Approximation, sondern um eine mathematisch äquivalente, aber schnellere Berechnung. Der zentrale methodische Punkt ist, dass die tatsächliche Beschleunigung von der Akzeptanzrate abhängt: Wenn das Draft-Modell häufig Tokens vorschlägt, die vom Zielmodell tatsächlich akzeptiert werden (weil beide Modelle ähnliche Wahrscheinlichkeitsverteilungen für die nächsten Tokens haben), wird ein hoher Anteil der Generierung durch das schnelle Draft-Modell erledigt; bei einer niedrigen Akzeptanzrate liefert das Verfahren kaum einen Vorteil und der zusätzliche Speicherbedarf für das Draft-Modell ist nicht gerechtfertigt.

~~~text
Decode phase: memory-bandwidth-bound, NOT compute-bound (see KB-0413)
  single forward pass per token = GPU parallel compute capacity underutilized
Speculative decoding:
  small DRAFT model proposes MULTIPLE tokens sequentially, but VERY fast
  large TARGET model verifies all proposed tokens in ONE parallel pass
    (better compute utilization than one sequential pass per token)
  rejection sampling scheme GUARANTEES output distribution == target model alone
    -> mathematically EQUIVALENT, not an approximation, just FASTER
KEY METHODOLOGICAL POINT: actual speedup depends on ACCEPTANCE RATE
  high acceptance (draft/target distributions similar) -> most generation done by fast draft model
  low acceptance -> little benefit, extra draft-model memory cost NOT justified
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Draft-Modell | generiert schnelle, mehrfache Token-Vorschläge | muss ähnliche Verteilung wie Zielmodell haben, um hohe Akzeptanzrate zu erreichen |
| Zielmodell (Verifikation) | verifiziert Vorschläge in einem parallelen Durchlauf | garantiert mathematisch identische Ausgabequalität zur reinen Zielmodell-Generierung |
| Akzeptanzrate | Anteil akzeptierter Draft-Vorschläge | bestimmt direkt die tatsächlich erzielte Beschleunigung |
| Zusätzlicher Speicherbedarf | Draft-Modell muss zusätzlich zum Zielmodell im VRAM gehalten werden | muss gegen die gemessene Beschleunigung abgewogen werden |

Implementierung: Das Draft-Modell wird so gewählt, dass es eine möglichst ähnliche Wahrscheinlichkeitsverteilung wie das Zielmodell für die konkrete Ziel-Workload aufweist (z. B. eine kleinere Variante derselben Modellfamilie), um eine hohe Akzeptanzrate zu erreichen. Vor einem produktiven Einsatz wird die tatsächliche Akzeptanzrate und die daraus resultierende Beschleunigung für die konkrete Ziel-Workload gemessen, statt sich auf pauschale, aus anderen Kontexten übernommene Beschleunigungswerte zu verlassen. Da Speculative Decoding zusätzlichen VRAM für das Draft-Modell benötigt (siehe VRAM-Budgetierung, [KB-0415](03-vram-und-speicherbudgets.md)), wird dieser zusätzliche Bedarf explizit gegen die gemessene Beschleunigung und den dadurch möglicherweise reduzierten Bedarf an paralleler Anfragekapazität abgewogen.

## Scalability, Reliability, Security und Observability

Speculative Decoding skaliert die Generierungsgeschwindigkeit proportional zur Akzeptanzrate des Draft-Modells; die Reliability-Grenze liegt darin, dass eine niedrige, ungemessene Akzeptanzrate proportional zum zusätzlichen Speicherbedarf des Draft-Modells zu einem negativen Nettoeffekt führen kann, wenn die Kapazität stattdessen für zusätzliche parallele Anfragen genutzt worden wäre.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| die gemessene Beschleunigung ist geringer als erwartet | die Akzeptanzrate des Draft-Modells ist für die konkrete Workload niedrig | die Akzeptanzrate messen und ein besser passendes Draft-Modell evaluieren |
| die VRAM-Auslastung steigt spürbar ohne proportionalen Geschwindigkeitsgewinn | der zusätzliche Speicherbedarf des Draft-Modells rechtfertigt die gemessene Beschleunigung nicht | den Nettoeffekt (Beschleunigung versus reduzierte parallele Anfragekapazität) neu bewerten |
| die Ausgabequalität scheint sich nach Einführung von Speculative Decoding verändert zu haben | die Implementierung weicht vom mathematisch korrekten Ablehnungsschema ab (Implementierungsfehler) | die Implementierung gegen die Referenz-Ablehnungsschema-Spezifikation prüfen, da bei korrekter Implementierung keine Qualitätsänderung auftreten darf |

Security: Das Draft-Modell sollte derselben Herkunfts- und Vertrauenswürdigkeitsprüfung unterzogen werden wie das Zielmodell, da es Teil des produktiven Generierungspfads ist. Observability: Die tatsächliche Akzeptanzrate, die gemessene End-to-End-Beschleunigung, und die zusätzliche VRAM-Auslastung durch das Draft-Modell sind zentrale Metriken zur Bewertung des tatsächlichen Nutzens.

## Trade-offs und Entscheidungen

**Staff** misst die tatsächliche Akzeptanzrate und Beschleunigung für die konkrete Workload, bevor Speculative Decoding produktiv eingesetzt wird. **Principal** macht den Speicher-/Beschleunigungs-Trade-off und die mathematische Qualitätsgarantie für das Team nachvollziehbar. **Chief** entscheidet den Einsatz von Speculative Decoding im Unternehmen anhand gemessener, transparent kommunizierter Beschleunigungswerte statt anhand von Marketingversprechen.

Anti-Patterns: ein Draft-Modell ohne Prüfung der tatsächlichen Akzeptanzrate für die konkrete Workload einsetzen; pauschale, aus anderen Kontexten übernommene Beschleunigungswerte ungeprüft kommunizieren; den zusätzlichen VRAM-Bedarf des Draft-Modells nicht gegen die gemessene Beschleunigung und die alternative Nutzung dieser Kapazität abwägen.

## Production Checklist

- [ ] Die tatsächliche Akzeptanzrate des Draft-Modells wurde für die konkrete Ziel-Workload gemessen.
- [ ] Die gemessene End-to-End-Beschleunigung rechtfertigt den zusätzlichen VRAM-Bedarf des Draft-Modells.
- [ ] Die Implementierung garantiert nachweislich mathematisch identische Ausgabequalität zur reinen Zielmodell-Generierung.
- [ ] Akzeptanzrate, Beschleunigung und VRAM-Auslastung werden fortlaufend überwacht.

## Interviewfragen

### 1. Wie funktioniert Speculative Decoding auf hoher Ebene?

**Antwort:** Ein kleines, schnelles Draft-Modell generiert mehrere Token-Vorschläge im Voraus, die das große Zielmodell in einem einzigen parallelen Durchlauf verifiziert; akzeptierte Vorschläge werden übernommen, abgelehnte durch das Zielmodell neu generiert.

### 2. Verändert Speculative Decoding die Ausgabequalität des Modells?

**Antwort:** Bei korrekter Implementierung nicht — das Ablehnungsschema garantiert mathematisch, dass die resultierende Token-Verteilung exakt der Verteilung entspricht, die das Zielmodell allein erzeugt hätte.

### 3. Wovon hängt die tatsächlich erzielte Beschleunigung durch Speculative Decoding ab?

**Antwort:** Von der Akzeptanzrate — dem Anteil der Draft-Modell-Vorschläge, die vom Zielmodell tatsächlich akzeptiert werden; eine hohe Akzeptanzrate erzeugt eine hohe Beschleunigung, eine niedrige Akzeptanzrate kaum einen Vorteil.

### 4. Welchen zusätzlichen Ressourcenbedarf erzeugt Speculative Decoding?

**Antwort:** Das Draft-Modell muss zusätzlich zum Zielmodell im VRAM gehalten werden, was den verfügbaren Speicher für andere Zwecke (z. B. mehr parallele Anfragen) reduziert.

### 5. Wie gehst du vor, wenn die gemessene Beschleunigung geringer als erwartet ausfällt?

**Antwort:** Ich messe die tatsächliche Akzeptanzrate für die konkrete Workload und prüfe, ob ein besser zum Zielmodell und zur Workload passendes Draft-Modell die Akzeptanzrate und damit die Beschleunigung verbessern würde.

### 6. Widersprüchliche Anforderung: Team will maximale Generierungsgeschwindigkeit UND maximale parallele Anfragekapazität — wie gehst du vor?

**Antwort:** Ich würde den Nettoeffekt messen: Der zusätzliche VRAM-Bedarf des Draft-Modells reduziert die verfügbare Kapazität für parallele Anfragen, während die höhere Einzelanfragegeschwindigkeit diesen Effekt teilweise ausgleichen kann; die konkrete Entscheidung würde ich anhand der gemessenen Akzeptanzrate und des tatsächlichen Verhältnisses von Einzelanfragegeschwindigkeit zu Parallelitätsbedarf der Workload treffen.

## Praktische Labs

~~~python
# Conceptual acceptance-rate-driven speedup estimation (not executed against a real model pair):

def estimate_speculative_speedup(acceptance_rate, draft_tokens_per_step, draft_model_relative_speed=8):
    # simplified model: expected tokens accepted per verification round
    expected_accepted = sum(acceptance_rate ** i for i in range(1, draft_tokens_per_step + 1))
    # rough approximation of speedup vs. pure target-model decoding
    speedup = 1 + expected_accepted * (1 - 1 / draft_model_relative_speed)
    return round(speedup, 2)

high_acceptance = estimate_speculative_speedup(acceptance_rate=0.85, draft_tokens_per_step=4)
low_acceptance = estimate_speculative_speedup(acceptance_rate=0.3, draft_tokens_per_step=4)

print(f"High acceptance rate (0.85) speedup: {high_acceptance}x")
print(f"Low acceptance rate (0.3) speedup: {low_acceptance}x")
~~~

## Dependencies, Cross-References und Quellen

1. Leviathan et al. (2023): ["Fast Inference from Transformers via Speculative Decoding"](https://arxiv.org/abs/2211.17192), abgerufen 2026-09-17.
2. Chen et al. (2023, DeepMind): ["Accelerating Large Language Model Decoding with Speculative Sampling"](https://arxiv.org/abs/2302.01318), abgerufen 2026-09-17.

GPU-Architektur und Rechenpfade sind kanonisch in [KB-0413](01-gpu-architektur-und-rechenpfade.md) behandelt; Continuous Batching in [KB-0426](14-continuous-batching.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Selbstspekulative Verfahren (z. B. Medusa, EAGLE), die zusätzliche Vorhersageköpfe im Zielmodell selbst statt eines separaten Draft-Modells nutzen | Evaluating | Gegenüber separatem Draft-Modell erst nach Prüfung des tatsächlichen Speicher-/Beschleunigungs-Trade-offs für die konkrete Modellarchitektur bevorzugen. |
| Kombination von Speculative Decoding mit kontinuierlichem Batching in produktiven Serving-Engines | Adopting | Gegenüber isoliertem Einsatz bevorzugen, sobald der kombinierte Effekt für die konkrete Workload gemessen ist. |

Ein Team akzeptiert den produktiven Einsatz von Speculative Decoding erst, wenn eine gemessene Akzeptanzrate und daraus resultierende Beschleunigung für die konkrete Ziel-Workload den zusätzlichen Speicherbedarf nachweislich rechtfertigt.
