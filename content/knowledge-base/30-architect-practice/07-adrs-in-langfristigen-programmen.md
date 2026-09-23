---
{"id": "KB-0683", "title": "ADRs in langfristigen Programmen", "domain": "30", "sequence": 7, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0682", "concepts": ["Dokumentierte Optionen und Kontext"], "needed_for": "ADRs in langfristigen Programmen bauen auf der in KB-0682 beschriebenen Kontext-/Optionsdokumentation auf, jedoch als fortlaufende Serie statt Einzeldokument"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für ein gegebenes, langfristiges Programm eine ADR-Serie führen, die frühere Entscheidungen nachvollziehbar mit späteren, verändernden Entscheidungen verknüpft.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein langfristiges Programm erkennen, wann eine veränderte Rahmenbedingung eine frühere ADR-Annahme tatsächlich ungültig macht, und eine explizite Ablösungs-ADR entwerfen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine frühere ADR-Annahme stillschweigend ignoriert statt explizit abgelöst wird, sodass der Grund für eine spätere, abweichende Entscheidung nicht nachvollziehbar ist.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für ADR-Serien in langfristigen Programmen festlegen, die explizite Ablösung statt stillschweigende Ignorierung veralteter Annahmen vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, kanonische ADR-Notation (etwa Nygard-Format) im Detail ist Vertiefung und wird als etabliert referenziert.", "rationale": "Kern ist der Umgang mit ADR-Serien über die Zeit, nicht die kanonische Einzeldokument-Notation."}}, "lab_validation": [{"lab_id": "KB-0683-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung expliziter ADR-Ablösung, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie eine frühere ADR-Annahme durch eine veränderte Rahmenbedingung ungültig wird, und wie eine explizite Ablösungs-ADR im Gegensatz zu stillschweigendem Ignorieren die Entscheidungshistorie nachvollziehbar hält.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# ADRs in langfristigen Programmen

> **Ziel:** Eine einzelne Architecture Decision Record (ADR) dokumentiert eine einzelne Entscheidung zu einem Zeitpunkt — dieses Kapitel referenziert die kanonische ADR-Form (Kontext, Entscheidung, Konsequenzen, etwa nach dem Nygard-Format) als bereits etabliert und konzentriert sich auf die tatsächliche Herausforderung langfristiger Programme: eine **Entscheidungsserie** (mehrere, über die Zeit aufeinanderfolgende ADRs zu demselben oder verwandten Themen), die zugrunde liegenden **Annahmen** jeder Entscheidung (die Randbedingungen, unter denen die Entscheidung zum damaligen Zeitpunkt tatsächlich sinnvoll war) und **Ablösungen** (der explizite, dokumentierte Übergang von einer veralteten zu einer neuen Entscheidung, wenn sich die zugrunde liegenden Annahmen tatsächlich geändert haben). Der zentrale Punkt dieses Kapitels ist, dass eine veränderte Rahmenbedingung eine frühere ADR tatsächlich ungültig machen kann, ohne dass dies automatisch erkannt wird — eine ADR-Serie, die frühere Entscheidungen stillschweigend ignoriert statt sie explizit abzulösen, macht die tatsächliche Entscheidungshistorie für spätere Beteiligte tatsächlich unnachvollziehbar.

## Zweck, Mental Model und Dependencies

Eine Entscheidungsserie entsteht, wenn ein langfristiges Programm über die Zeit mehrere, aufeinander aufbauende oder miteinander verwandte Entscheidungen trifft — etwa eine erste ADR zur Wahl einer Basistechnologie, gefolgt von späteren ADRs zu Erweiterungen oder Anpassungen dieser Wahl; diese Serie muss tatsächlich als zusammenhängender Verlauf lesbar sein, statt als lose Sammlung isolierter Einzeldokumente, da eine spätere Entscheidung ihre volle Bedeutung tatsächlich erst im Kontext der vorherigen Entscheidungen entfaltet. Die zugrunde liegenden Annahmen jeder Entscheidung sind die Randbedingungen (etwa Teamgröße, verfügbares Budget, aktueller Stand der Technologie), unter denen die Entscheidung zum damaligen Zeitpunkt tatsächlich sinnvoll war — diese Annahmen müssen tatsächlich explizit in der ADR benannt sein, da eine Entscheidung ohne dokumentierte Annahmen für spätere Leser tatsächlich wie eine zeitlose, unveränderliche Wahrheit erscheint, obwohl sie tatsächlich nur unter den damaligen, spezifischen Umständen sinnvoll war. Ablösungen sind der explizite Mechanismus, mit dem eine ADR-Serie auf veränderte Rahmenbedingungen reagiert: Wenn sich eine zugrunde liegende Annahme tatsächlich ändert (etwa wächst das Team erheblich, oder eine zuvor genutzte Technologie erreicht tatsächlich End-of-Life), muss dies zu einer expliziten, neuen ADR führen, die tatsächlich auf die abgelöste ADR verweist und begründet, warum die frühere Annahme tatsächlich nicht mehr gilt — dieser explizite Verweis unterscheidet eine bewusste Ablösung von einem stillschweigenden Ignorieren, bei dem eine spätere Entscheidung der früheren tatsächlich widerspricht, ohne dass dieser Widerspruch für einen Leser nachvollziehbar erklärt wird. Der Umgang mit veränderten Rahmenbedingungen erfordert tatsächlich eine periodische, aktive Überprüfung bestehender ADRs, statt sie einmalig zu erstellen und dann als tatsächlich dauerhaft gültig zu betrachten — ein Programm, das bestehende ADRs nie erneut überprüft, riskiert tatsächlich, über lange Zeit auf Basis von Annahmen zu arbeiten, die längst nicht mehr zutreffen, ohne dass dies dem Team tatsächlich bewusst ist.

~~~text
Single ADR documents a single decision at a point in time -- this chapter references
  canonical ADR form (context, decision, consequences, Nygard format) as already
  established, focuses on ACTUAL challenge of long-term programs
  DECISION SERIES: multiple, over-time-successive ADRs on same/related topics
  UNDERLYING ASSUMPTIONS of each decision: constraints under which decision was ACTUALLY
  sensible at the time
  SUPERSESSIONS: explicit, documented transition from outdated to new decision when
  underlying assumptions ACTUALLY changed
KEY POINT: a changed constraint CAN ACTUALLY invalidate an earlier ADR w/o this being
  automatically recognized -- ADR series silently ignoring earlier decisions instead of
  explicitly superseding them ACTUALLY makes actual decision history untraceable for
  later participants
DECISION SERIES arises when long-term program makes multiple, over-time building-on-
  each-other or related decisions -- first ADR on base technology choice, followed by
  later ADRs on extensions/adaptations of that choice
  series must ACTUALLY be readable as coherent narrative instead of loose collection of
  isolated individual documents, since later decision ACTUALLY unfolds full meaning only
  in context of previous decisions
UNDERLYING ASSUMPTIONS of every decision = constraints (team size, available budget,
  current tech state) under which decision was ACTUALLY sensible at the time
  must ACTUALLY be explicitly named in ADR, since decision w/o documented assumptions
  ACTUALLY appears to later readers as timeless, immutable truth, although it was
  ACTUALLY only sensible under the specific, then-current circumstances
SUPERSESSIONS = explicit mechanism by which ADR series responds to changed constraints:
  when an underlying assumption ACTUALLY changes (team grows substantially, previously-
  used tech ACTUALLY reaches end-of-life), must lead to explicit, new ADR ACTUALLY
  referencing the superseded ADR + justifying why earlier assumption ACTUALLY no longer
  applies
  this explicit reference distinguishes deliberate supersession from silent ignoring,
  where a later decision ACTUALLY contradicts an earlier one w/o that contradiction
  being traceably explained to a reader
HANDLING CHANGED CONSTRAINTS ACTUALLY requires periodic, active review of existing ADRs
  instead of creating them once and then treating them as ACTUALLY permanently valid --
  program never re-reviewing existing ADRs ACTUALLY risks working, over long time, on
  basis of assumptions long no longer applying, w/o team ACTUALLY being aware of this
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Entscheidungsserie als zusammenhängender Verlauf | verknüpft aufeinanderfolgende ADRs nachvollziehbar | verhindert isolierte, kontextlose Einzeldokumente |
| Explizit dokumentierte Annahmen je Entscheidung | benennt Randbedingungen der damaligen Sinnhaftigkeit | verhindert Fehlinterpretation als zeitlose Wahrheit |
| Explizite Ablösung statt stillschweigendes Ignorieren | verweist auf abgelöste ADR mit Begründung | erhält nachvollziehbare Entscheidungshistorie |
| Periodische, aktive ADR-Überprüfung | prüft, ob Annahmen noch tatsächlich gelten | verhindert unbemerktes Arbeiten auf veralteter Grundlage |

Implementierung: ADRs eines langfristigen Programms werden als fortlaufende, miteinander verknüpfte Serie geführt. Jede ADR benennt explizit die zugrunde liegenden Annahmen. Bei veränderten Rahmenbedingungen wird eine explizite Ablösungs-ADR mit Verweis auf die abgelöste ADR erstellt. Bestehende ADRs werden periodisch aktiv überprüft.

## Scalability, Reliability, Security und Observability

Eine ADR-Serien-Praxis skaliert über die Anzahl der über die Programmlaufzeit angesammelten Entscheidungen; die Reliability-Grenze liegt darin, dass eine stillschweigend ignorierte, veraltete ADR-Annahme tatsächlich zu widersprüchlichen, unnachvollziehbaren Entscheidungen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine spätere Entscheidung widerspricht einer früheren ADR, ohne dass dies erklärt wird | die frühere ADR wurde stillschweigend ignoriert statt explizit abgelöst | eine explizite Ablösungs-ADR mit Verweis und Begründung nachträglich erstellen |
| ein neues Teammitglied kann eine ADR-Entscheidung nicht nachvollziehen | die zugrunde liegenden Annahmen wurden nicht dokumentiert | die ADR um die damaligen, zugrunde liegenden Randbedingungen ergänzen |
| ein Programm arbeitet unbemerkt auf Basis veralteter Annahmen | keine periodische, aktive Überprüfung bestehender ADRs findet statt | eine regelmäßige ADR-Überprüfung als fester Bestandteil des Programmzyklus einführen |

Security: ADRs zu sicherheitsrelevanten Entscheidungen sollten bei Ablösung besonders sorgfältig geprüft werden, da eine veraltete Sicherheitsannahme tatsächlich ein Risiko darstellen kann. Observability: Die tatsächliche Zeitspanne seit der letzten Überprüfung einer bestehenden ADR ist ein zentrales Signal zur Bewertung, ob deren Annahmen noch aktuell sind.

## Trade-offs und Entscheidungen

**Staff** erstellt eine einzelne ADR mit korrekt dokumentierten Annahmen. **Principal** führt eine vollständige ADR-Serie für ein langfristiges Programm mit expliziten Ablösungen. **Chief** legt unternehmensweite Standards für ADR-Serien fest, die periodische Überprüfung und explizite Ablösung vorschreiben.

Anti-Patterns: eine ADR-Entscheidung ohne dokumentierte, zugrunde liegende Annahmen erstellen; eine veraltete ADR stillschweigend ignorieren statt explizit abzulösen; bestehende ADRs nie erneut überprüfen.

## Production Checklist

- [ ] Jede ADR benennt explizit die zugrunde liegenden Annahmen.
- [ ] Zusammenhängende ADRs sind als nachvollziehbare Serie verknüpft.
- [ ] Bei veränderten Rahmenbedingungen existiert eine explizite Ablösungs-ADR mit Verweis auf die abgelöste ADR.
- [ ] Bestehende ADRs werden periodisch aktiv überprüft.

## Interviewfragen

### 1. Warum reicht eine einzelne ADR-Entscheidung ohne dokumentierte Annahmen nicht aus?

**Antwort:** Weil sie für spätere Leser wie eine zeitlose, unveränderliche Wahrheit erscheint, obwohl sie tatsächlich nur unter den damaligen, spezifischen Randbedingungen sinnvoll war.

### 2. Was unterscheidet eine explizite Ablösung von stillschweigendem Ignorieren einer früheren ADR?

**Antwort:** Eine explizite Ablösung verweist auf die abgelöste ADR und begründet, warum die frühere Annahme nicht mehr gilt, während stillschweigendes Ignorieren einen unerklärten Widerspruch zwischen zwei Entscheidungen hinterlässt.

### 3. Warum ist eine periodische, aktive Überprüfung bestehender ADRs notwendig?

**Antwort:** Weil ein Programm sonst unbemerkt auf Basis von Annahmen arbeiten kann, die längst nicht mehr zutreffen, ohne dass dies dem Team bewusst ist.

### 4. Warum muss eine ADR-Serie als zusammenhängender Verlauf statt als isolierte Einzeldokumente lesbar sein?

**Antwort:** Weil eine spätere Entscheidung ihre volle Bedeutung erst im Kontext der vorherigen Entscheidungen entfaltet.

### 5. Wie gehst du vor, wenn eine spätere Entscheidung einer früheren ADR widerspricht, ohne dass dies erklärt wird?

**Antwort:** Ich erstelle nachträglich eine explizite Ablösungs-ADR, die auf die frühere ADR verweist und begründet, warum die damalige Annahme nicht mehr gilt.

### 6. Widersprüchliche Anforderung: Das Team will schnelle, unbürokratische Entscheidungsfindung ohne ausgedehnte ADR-Pflege UND die Organisation will vollständige Nachvollziehbarkeit der Entscheidungshistorie über Jahre hinweg — wie gehst du vor?

**Antwort:** Ich würde ADRs nur für tatsächlich langfristig wirksame, folgenreiche Entscheidungen verpflichtend führen, statt für jede kleine Entscheidung, und die periodische Überprüfung auf diese begrenzte Menge fokussieren, sodass die Nachvollziehbarkeit für die wirklich relevanten Entscheidungen erhalten bleibt, ohne die Entscheidungsfindung insgesamt zu verlangsamen.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Programm hat vor zwei Jahren eine ADR zur Wahl eines Monolith-First-Ansatzes getroffen, mit der dokumentierten Annahme "Team hat aktuell 4 Entwickler". Das Team ist inzwischen auf 25 Entwickler gewachsen, und eine neue Entscheidung zur Aufteilung in Services wird ohne Verweis auf die ursprüngliche ADR getroffen.

~~~python
# Local, deterministic illustration of explicit ADR supersession vs. silent contradiction (fictional lab example, no real program):

adr_series = [
    {"id": "ADR-001", "decision": "Monolith-first", "assumptions": {"team_size": 4}},
]

def create_supersession(previous_adr, new_decision, new_assumptions, current_team_size):
    if current_team_size != previous_adr["assumptions"]["team_size"]:
        return {
            "id": "ADR-002",
            "supersedes": previous_adr["id"],
            "decision": new_decision,
            "reason": f"team_size changed from {previous_adr['assumptions']['team_size']} to {current_team_size}",
            "assumptions": new_assumptions,
        }
    return {"error": "no assumption change, supersession not justified"}

result = create_supersession(adr_series[0], "Service decomposition", {"team_size": 25}, current_team_size=25)
print(result)
~~~

Erwartete Beobachtung: Die neue Entscheidung wird als explizite Ablösung mit nachvollziehbarem Grund (veränderte Teamgröße) erstellt, statt die ursprüngliche ADR unkommentiert zu widersprechen. Auswertung: Ein späterer Leser kann anhand der Ablösungs-ADR nachvollziehen, warum sich die Architekturentscheidung geändert hat, statt einen unerklärten Widerspruch in der Dokumentation vorzufinden.

## Dependencies, Cross-References und Quellen

1. Michael Nygard: [Documenting Architecture Decisions — ADR Format](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions), abgerufen 2026-09-18.
2. ThoughtWorks: [Technology Radar — Lightweight Architecture Decision Records](https://www.thoughtworks.com/radar/techniques/lightweight-architecture-decision-records), abgerufen 2026-09-18.

Dieses Kapitel baut auf der in KB-0682 (Design Docs als Arbeitsinstrument) beschriebenen Kontext- und Optionsdokumentation auf und erweitert sie auf fortlaufende Entscheidungsserien.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte Erkennung widersprüchlicher ADRs zur automatisierten Identifikation stillschweigend ignorierter, veralteter Annahmen | Emerging | Bei künftigen, umfangreichen ADR-Serien evaluieren, jedoch die finale Entscheidung über tatsächliche Ablösungsnotwendigkeit weiterhin durch den verantwortlichen Architekten treffen lassen. |

Ein Team akzeptiert eine ADR-Serie erst als vollständig, wenn zugrunde liegende Annahmen dokumentiert, veraltete Entscheidungen explizit statt stillschweigend abgelöst und bestehende ADRs periodisch überprüft werden.
