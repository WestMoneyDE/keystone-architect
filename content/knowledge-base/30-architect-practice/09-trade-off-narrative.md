---
{"id": "KB-0685", "title": "Trade-off-Narrative", "domain": "30", "sequence": 9, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0684", "concepts": ["Evidenzpflicht statt Geschmacksurteile"], "needed_for": "Ein Trade-off-Narrativ nutzt dieselbe Evidenzpflicht wie das in KB-0684 beschriebene Architekturreview"}], "related": ["KB-0680"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für eine gegebene Architekturentscheidung ein Trade-off-Narrativ erstellen, das Alternativen, Unsicherheit und Konsequenzen tatsächlich argumentierbar darstellt.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine komplexe Entscheidung mehrere quantitative Modelle referenzieren und Gegenargumente unterschiedlicher Stakeholder fair in das Narrativ integrieren, statt sie zu übergehen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein Trade-off-Narrativ Unsicherheit verschweigt oder Gegenargumente unfair darstellt, statt sie tatsächlich ausgewogen zu behandeln.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Trade-off-Narrative festlegen, die faire Behandlung von Gegenargumenten und explizite Unsicherheitsdarstellung vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, quantitative Entscheidungsmodellierung (etwa gewichtete Scoring-Modelle) im Detail ist Vertiefung und wird als etabliert referenziert.", "rationale": "Kern ist die narrative, argumentierbare Darstellung der Entscheidung, nicht die quantitative Modelldetailtiefe."}}, "lab_validation": [{"lab_id": "KB-0685-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung eines fairen Trade-off-Narrativs, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie ein Trade-off-Narrativ mit explizit dargestellten Gegenargumenten und Unsicherheit im Vergleich zu einer einseitigen Darstellung eine tatsächlich nachvollziehbare, überzeugende Entscheidung ermöglicht.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# Trade-off-Narrative

> **Ziel:** Ein Trade-off-Narrativ macht eine Architekturentscheidung tatsächlich argumentierbar, indem es drei Elemente verbindet: **Alternativen** (die tatsächlich erwogenen Optionen, nicht nur die gewählte), **Unsicherheit** (was tatsächlich zum Entscheidungszeitpunkt nicht sicher bekannt war, statt eine Scheingewissheit vorzutäuschen) und **Konsequenzen** (was die Entscheidung tatsächlich in der Praxis bedeutet, einschließlich der Nachteile der gewählten Option). Dieses Kapitel referenziert quantitative Entscheidungsmodelle (etwa gewichtete Scoring-Modelle) als bereits etablierte Werkzeuge und konzentriert sich auf die narrative Fähigkeit: eine Entscheidung so darzustellen, dass sie für unterschiedliche Stakeholder tatsächlich nachvollziehbar und überzeugend ist. Der zentrale Punkt dieses Kapitels ist die faire Behandlung von Gegenargumenten — ein Narrativ, das nur die Argumente für die gewählte Option darstellt und Gegenargumente verschweigt oder verzerrt, wirkt tatsächlich überzeugend, ist aber tatsächlich manipulativ und untergräbt langfristig das Vertrauen in die Entscheidungsqualität des Architekten.

## Zweck, Mental Model und Dependencies

Alternativen darzustellen bedeutet, tatsächlich die ernsthaft erwogenen Optionen zu benennen, nicht nur eine Strohmann-Alternative, die offensichtlich unterlegen ist, um die gewählte Option künstlich besser aussehen zu lassen — ein Narrativ, das eine schwache, nie ernsthaft erwogene Alternative präsentiert, täuscht tatsächlich eine Abwägung vor, die nie stattgefunden hat, was der in KB-0684 beschriebenen Evidenzpflicht widerspricht. Unsicherheit darzustellen bedeutet, tatsächlich offen zu benennen, was zum Entscheidungszeitpunkt nicht sicher bekannt war — etwa eine Leistungsannahme, die auf Schätzung statt tatsächlicher Messung beruht, oder eine zukünftige Anforderung, die sich tatsächlich noch ändern könnte; ein Narrativ, das diese Unsicherheit verschweigt und stattdessen eine unbegründete Gewissheit vortäuscht, riskiert tatsächlich, bei späterer Widerlegung der zugrunde liegenden Annahme die Glaubwürdigkeit des gesamten Narrativs zu untergraben. Konsequenzen darzustellen bedeutet, tatsächlich auch die Nachteile der gewählten Option offen zu benennen, statt nur deren Vorteile zu betonen — jede tatsächliche Architekturentscheidung hat Nachteile (siehe die in vielen Domains dieses Curriculums etablierten Trade-off-Abschnitte), und ein Narrativ, das diese Nachteile verschweigt, bereitet die Organisation tatsächlich nicht auf deren spätere, unvermeidliche Sichtbarwerdung vor. Quantitative Modelle (etwa ein gewichtetes Scoring-Modell, das mehrere Kriterien mit Gewichtungen kombiniert) werden in diesem Kapitel als bereits etablierte Werkzeuge referenziert — sie liefern die zugrunde liegende Struktur, die das narrative Kapitel dann in eine für Menschen tatsächlich nachvollziehbare Erzählung übersetzt, statt die reine Zahl unkommentiert zu präsentieren. Faire Behandlung von Gegenargumenten bedeutet, dass für jeden relevanten Stakeholder, dessen bevorzugte Alternative tatsächlich nicht gewählt wurde, dessen Argument tatsächlich vollständig und korrekt im Narrativ dargestellt wird, bevor erklärt wird, warum es im konkreten Fall tatsächlich nicht ausschlaggebend war — dies unterscheidet sich fundamental davon, das Gegenargument absichtlich schwach oder verzerrt darzustellen, um es leichter zu widerlegen (ein sogenannter Strohmann), was tatsächlich unfair und langfristig vertrauensschädigend ist.

~~~text
Trade-off Narrative makes an architecture decision ACTUALLY arguable by combining 3
  elements
  ALTERNATIVES: ACTUALLY considered options, not just chosen one
  UNCERTAINTY: what was ACTUALLY not certainly known at decision time, instead of
  faking certainty
  CONSEQUENCES: what decision ACTUALLY means in practice, INCLUDING disadvantages of
  chosen option
  this chapter references quantitative decision models (weighted scoring models) as
  already established tools, focuses on narrative skill: presenting a decision so it's
  ACTUALLY traceable + convincing for different stakeholders
KEY POINT: fair treatment of counterarguments -- narrative presenting only arguments FOR
  chosen option, concealing/distorting counterarguments, ACTUALLY appears convincing but
  is ACTUALLY manipulative + long-term undermines trust in architect's decision quality
PRESENTING ALTERNATIVES means ACTUALLY naming seriously considered options, not just a
  strawman alternative obviously inferior to artificially make chosen option look better
  -- narrative presenting a weak, never-seriously-considered alternative ACTUALLY fakes
  a deliberation that never happened, contradicting KB-0684's evidence obligation
PRESENTING UNCERTAINTY means ACTUALLY openly naming what wasn't certainly known at
  decision time -- performance assumption based on estimate not ACTUAL measurement, or
  future requirement that could ACTUALLY still change -- narrative concealing this
  uncertainty and instead faking unfounded certainty ACTUALLY risks, on later refutation
  of underlying assumption, undermining credibility of entire narrative
PRESENTING CONSEQUENCES means ACTUALLY openly naming disadvantages of chosen option too,
  not just emphasizing its advantages -- every ACTUAL architecture decision has
  disadvantages (per trade-off sections established across many domains of this
  curriculum), narrative concealing them ACTUALLY doesn't prepare organization for their
  later, inevitable becoming visible
QUANTITATIVE MODELS (weighted scoring model combining multiple criteria w/ weights)
  referenced in this chapter as already established tools -- deliver underlying
  structure that narrative chapter then translates into ACTUALLY human-traceable story,
  instead of presenting raw number uncommented
FAIR TREATMENT OF COUNTERARGUMENTS means for every relevant stakeholder whose preferred
  alternative was ACTUALLY not chosen, their argument ACTUALLY fully+correctly presented
  in narrative before explaining why it was ACTUALLY not decisive in this concrete case
  -- fundamentally differs from deliberately presenting counterargument weak/distorted to
  more easily refute it (strawman), which is ACTUALLY unfair + long-term trust-damaging
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Tatsächlich erwogene Alternativen | verhindert Strohmann-Vergleiche | macht Abwägung glaubwürdig |
| Offen dargestellte Unsicherheit | vermeidet vorgetäuschte Gewissheit | erhält Glaubwürdigkeit bei späterer Widerlegung |
| Offen dargestellte Nachteile der Wahl | bereitet Organisation auf spätere Sichtbarkeit vor | verhindert Überraschung bei tatsächlichem Auftreten |
| Quantitative Modelle als referenzierte Grundlage | strukturiert Bewertung, wird narrativ übersetzt | vermeidet unkommentierte Zahlenpräsentation |
| Fair dargestellte Gegenargumente | vollständige, korrekte Darstellung vor Widerlegung | verhindert Strohmann-Manipulation |

Implementierung: Das Trade-off-Narrativ benennt explizit alle tatsächlich erwogenen Alternativen mit ihren jeweiligen Stärken. Unsicherheiten der Entscheidungsgrundlage werden offen dargestellt. Nachteile der gewählten Option werden ebenso wie Vorteile genannt. Gegenargumente relevanter Stakeholder werden vollständig und korrekt dargestellt, bevor ihre Nichtberücksichtigung begründet wird.

## Scalability, Reliability, Security und Observability

Eine Trade-off-Narrativ-Praxis skaliert über die Anzahl der Stakeholder mit unterschiedlichen, potenziell konkurrierenden Präferenzen; die Reliability-Grenze liegt darin, dass ein manipulatives, unfair dargestelltes Narrativ die Glaubwürdigkeit künftiger Entscheidungen tatsächlich untergräbt, sobald es als solches erkannt wird.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Stakeholder empfinden eine Entscheidung im Nachhinein als manipulativ dargestellt | Gegenargumente wurden im Narrativ schwach oder verzerrt statt fair dargestellt | das Narrativ um eine vollständige, korrekte Darstellung der Gegenargumente ergänzen |
| eine Entscheidung verliert später an Glaubwürdigkeit, als eine zugrunde liegende Annahme widerlegt wird | die Unsicherheit dieser Annahme wurde im Narrativ nicht offen dargestellt | künftige Narrative um eine explizite Darstellung der zugrunde liegenden Unsicherheiten ergänzen |
| ein später auftretender Nachteil der gewählten Option überrascht die Organisation | der Nachteil wurde im ursprünglichen Narrativ nicht genannt | künftige Narrative um eine vollständige, auch nachteilige Konsequenzdarstellung ergänzen |

Security: Trade-off-Narrative zu sicherheitsrelevanten Entscheidungen sollten Unsicherheiten in Bedrohungsmodellen besonders transparent darstellen. Observability: Die tatsächliche, spätere Übereinstimmung zwischen dargestellten Unsicherheiten und tatsächlich eingetretenen Entwicklungen ist ein zentrales Signal zur Bewertung der Narrativ-Ehrlichkeit.

## Trade-offs und Entscheidungen

**Staff** stellt für eine begrenzte Entscheidung Alternativen und Konsequenzen fair dar. **Principal** entwirft das vollständige Trade-off-Narrativ mit quantitativer Modellreferenz und fairer Gegenargumentbehandlung für eine komplexe Entscheidung. **Chief** legt unternehmensweite Standards für Trade-off-Narrative fest, die faire Gegenargumentbehandlung und offene Unsicherheitsdarstellung vorschreiben.

Anti-Patterns: eine Strohmann-Alternative präsentieren, die nie ernsthaft erwogen wurde; Unsicherheit der Entscheidungsgrundlage verschweigen und stattdessen unbegründete Gewissheit vortäuschen; Nachteile der gewählten Option im Narrativ verschweigen.

## Production Checklist

- [ ] Alle tatsächlich erwogenen Alternativen sind im Narrativ benannt, keine Strohmänner.
- [ ] Unsicherheiten der Entscheidungsgrundlage sind offen dargestellt.
- [ ] Nachteile der gewählten Option sind ebenso wie Vorteile genannt.
- [ ] Gegenargumente relevanter Stakeholder sind vollständig und korrekt dargestellt.

## Interviewfragen

### 1. Warum ist eine Strohmann-Alternative in einem Trade-off-Narrativ problematisch?

**Antwort:** Weil sie eine Abwägung vortäuscht, die nie tatsächlich stattgefunden hat, und damit der Evidenzpflicht widerspricht.

### 2. Warum sollte Unsicherheit der Entscheidungsgrundlage offen dargestellt werden?

**Antwort:** Weil eine verschwiegene Unsicherheit bei späterer Widerlegung der zugrunde liegenden Annahme die Glaubwürdigkeit des gesamten Narrativs untergräbt.

### 3. Warum sollten Nachteile der gewählten Option im Narrativ genannt werden?

**Antwort:** Weil jede tatsächliche Architekturentscheidung Nachteile hat, und eine Organisation, die diese nicht kennt, auf deren spätere, unvermeidliche Sichtbarwerdung nicht vorbereitet ist.

### 4. Was unterscheidet eine faire Gegenargumentbehandlung von einem Strohmann-Argument?

**Antwort:** Eine faire Behandlung stellt das Gegenargument vollständig und korrekt dar, bevor erklärt wird, warum es nicht ausschlaggebend war, während ein Strohmann das Gegenargument absichtlich schwach oder verzerrt darstellt, um es leichter zu widerlegen.

### 5. Wie gehst du vor, wenn Stakeholder eine frühere Entscheidung im Nachhinein als manipulativ dargestellt empfinden?

**Antwort:** Ich prüfe, ob Gegenargumente im damaligen Narrativ schwach oder verzerrt statt fair dargestellt wurden, und stelle für künftige Narrative sicher, dass Gegenargumente vollständig und korrekt behandelt werden.

### 6. Widersprüchliche Anforderung: Das Management will ein überzeugendes, klares Narrativ ohne verwirrende Unsicherheitsdarstellung UND die Organisation will vollständige, ehrliche Transparenz über tatsächliche Unsicherheiten — wie gehst du vor?

**Antwort:** Ich würde die zentrale Empfehlung klar und überzeugend formulieren, aber die tatsächlich entscheidungsrelevanten Unsicherheiten explizit als solche kennzeichnen, statt sie zu verschweigen — Klarheit in der Empfehlung und Ehrlichkeit über Unsicherheit schließen sich tatsächlich nicht gegenseitig aus.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Team hat sich für eine Microservices-Architektur statt eines Monolithen für eine neue GenAI-Plattform (angelehnt an Domain 11) entschieden. Ein Stakeholder bevorzugte tatsächlich den Monolithen wegen geringerer initialer Komplexität.

~~~python
# Local, deterministic illustration of a fair trade-off narrative vs. a strawman narrative (fictional lab example, no real project):

def build_narrative(chosen, alternative, alternative_strength, chosen_disadvantage, uncertainty):
    return {
        "chosen": chosen,
        "alternative_fairly_presented": alternative_strength,
        "chosen_disadvantage_disclosed": chosen_disadvantage,
        "uncertainty_disclosed": uncertainty,
    }

narrative = build_narrative(
    chosen="Microservices",
    alternative="Monolith",
    alternative_strength="Lower initial complexity, faster time-to-first-release, well-understood by current team",
    chosen_disadvantage="Higher operational complexity, requires distributed tracing investment",
    uncertainty="Scaling assumptions based on projected, not yet measured, load"
)
print(narrative)
~~~

Erwartete Beobachtung: Das Narrativ stellt die Stärke der Monolith-Alternative vollständig dar, statt sie als Strohmann zu schwächen, und benennt sowohl die Nachteile der gewählten Microservices-Option als auch die zugrunde liegende Unsicherheit der Lastannahmen. Auswertung: Der Stakeholder, der den Monolithen bevorzugte, kann nachvollziehen, dass sein Argument tatsächlich verstanden und fair abgewogen wurde, auch wenn die Entscheidung anders ausfiel.

## Dependencies, Cross-References und Quellen

1. Barbara Minto: [The Pyramid Principle — Logic in Writing and Thinking](https://www.pearson.com/en-us/subject-catalog/p/the-pyramid-principle/), abgerufen 2026-09-18.
2. Software Engineering Institute (SEI), Carnegie Mellon University: [Architecture Tradeoff Analysis Method (ATAM)](https://insights.sei.cmu.edu/library/atam-method-for-architecture-evaluation/), abgerufen 2026-09-18.

Dieses Kapitel baut auf der in KB-0684 (Architekturreviews durchführen) beschriebenen Evidenzpflicht auf und der in KB-0680 (Executive Communication) beschriebenen, symmetrischen Risikodarstellung.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte Erkennung einseitiger oder Strohmann-artiger Argumentation in Entscheidungsdokumenten | Emerging | Bei künftigen, wichtigen Entscheidungsnarrativen als Ergänzung zur menschlichen Prüfung evaluieren, jedoch die finale Fairnessbewertung weiterhin durch unabhängige, menschliche Reviewer sicherstellen. |

Ein Team akzeptiert ein Trade-off-Narrativ erst, wenn Alternativen fair dargestellt, Unsicherheiten offen benannt und Gegenargumente vollständig und korrekt behandelt sind.
