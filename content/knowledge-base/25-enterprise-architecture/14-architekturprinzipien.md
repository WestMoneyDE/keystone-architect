---
{"id": "KB-0602", "title": "Architekturprinzipien", "domain": "25", "sequence": 14, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0589", "concepts": ["Enterprise Architecture als Disziplin"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Architekturprinzip mit Begründung und konkreten Konsequenzen anhand etablierter Praxis korrekt formulieren und auf einen realen Zielkonflikt anwenden können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Architekturprinzipien mit Begründung, Konsequenzen und dokumentierten Ausnahmefällen tatsächliche Entscheidungshilfe statt allgemeiner Schlagworte bieten.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein formuliertes Architekturprinzip zu allgemein ist, um eine reale Entscheidung tatsächlich zu leiten, und das Prinzip entsprechend auf konkrete Konsequenzen zuschneiden können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Architekturprinzipien festlegen, die Zielkonflikte zwischen Prinzipien explizit adressieren und einen dokumentierten Ausnahmeprozess vorsehen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die formale ArchiMate-Notation für Prinzipien-Artefakte im Detail ist Vertiefung.", "rationale": "Kern ist die Formulierung wirksamer, entscheidungsleitender Prinzipien mit Begründung und Konsequenzen, nicht eine bestimmte formale Notation."}}, "lab_validation": [{"lab_id": "KB-0602-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Prüfung, ob ein Architekturprinzip eine reale Entscheidung tatsächlich leitet, kein produktives EA-Tool verwendet", "evidence": "Ein lokales Skript prüft eine Liste formulierter Architekturprinzipien darauf, ob sie explizite, konkrete Konsequenzen für eine gegebene Beispielentscheidung enthalten, und markiert Prinzipien ohne konkrete Konsequenz als zu allgemein, um tatsächlich entscheidungsleitend zu sein.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales EA-Tool."}]}
---
# Architekturprinzipien

> **Ziel:** Ein Architekturprinzip ist eine verbindliche Leitlinie für Architekturentscheidungen (aufbauend auf der bereits in [KB-0589](01-enterprise-architecture-als-disziplin.md) behandelten Disziplin-Abgrenzung), die aus drei zwingenden Bestandteilen besteht: der eigentlichen **Aussage** (was gelten soll), der **Begründung** (warum dies gelten soll) und den konkreten **Konsequenzen** (was diese Aussage für tatsächliche Entscheidungen praktisch bedeutet). Der zentrale Punkt dieses Kapitels ist, dass ein Prinzip ohne explizite, konkrete Konsequenzen ein bloßes, unwirksames Schlagwort bleibt (etwa "Sicherheit hat Priorität" ohne jede Angabe, was dies für eine konkrete Entscheidung tatsächlich bedeutet) — ein wirksames Architekturprinzip muss anhand realer, konkreter Entscheidungssituationen geprüft werden können, und da Prinzipien häufig in **Zielkonflikt** miteinander stehen (etwa "Standardisierung" gegen "lokale Flexibilität"), muss jedes Prinzipienset auch explizit regeln, wie mit solchen Konflikten und mit begründeten **Ausnahmen** umgegangen wird.

## Zweck, Mental Model und Dependencies

Die drei Bestandteile eines Architekturprinzips (Aussage, Begründung, Konsequenzen) sind nicht optional, sondern strukturell notwendig für die praktische Wirksamkeit: Eine reine Aussage ohne Begründung lässt sich bei veränderten Umständen nicht sinnvoll überprüfen oder anpassen, da unklar bleibt, welches zugrunde liegende Ziel das Prinzip eigentlich verfolgt; eine Aussage mit Begründung, aber ohne konkrete Konsequenzen, bleibt ein bloßes Schlagwort, das in einer realen Entscheidungssituation keine tatsächliche Orientierung bietet, da niemand daraus ableiten kann, welche konkrete Handlung das Prinzip in diesem Fall tatsächlich verlangt. Die Prüfung "anhand realer Entscheidungen statt allgemeiner Schlagworte" ist der entscheidende Qualitätstest für ein Architekturprinzip: Ein wirksames Prinzip sollte, angewendet auf eine konkrete, reale Entscheidungssituation, eine eindeutige, ableitbare Konsequenz liefern — kann ein Prinzip auf mehrere reale Fälle angewendet werden, ohne dass sich daraus eine unterscheidbare, konkrete Handlungsanweisung ergibt, ist es zu allgemein formuliert und muss präzisiert werden. Zielkonflikte zwischen Prinzipien sind ein struktureller, unvermeidbarer Bestandteil jedes realistischen Prinzipiensets, da unterschiedliche, legitime Ziele (etwa Konsistenz durch Standardisierung gegenüber Anpassungsfähigkeit durch lokale Flexibilität) selten vollständig gleichzeitig maximiert werden können — ein Prinzipienset, das diese Konflikte nicht explizit anerkennt und keine Regel für ihre Auflösung (etwa eine Priorisierungsreihenfolge oder einen expliziten Abwägungsprozess) vorsieht, überlässt die tatsächliche Konfliktlösung dem Zufall oder der informellen Verhandlungsmacht einzelner Beteiligter. Ein dokumentierter Ausnahmeprozess ergänzt dies um die notwendige Flexibilität für begründete Einzelfälle, ohne die grundsätzliche Verbindlichkeit des Prinzips für den Regelfall zu untergraben.

~~~text
Architecture Principle: binding guideline for architecture decisions (per KB-0589 discipline boundary)
  consists of THREE mandatory components:
    STATEMENT (what should hold), RATIONALE (why it should hold),
    CONSEQUENCES (what it concretely means for actual decisions)
KEY POINT: principle w/o explicit, concrete consequences = mere ineffective SLOGAN
  ("security has priority" w/o any statement of what this actually means for a concrete decision)
  effective principle must be TESTABLE against real, concrete decision situations
  principles often CONFLICT with each other (e.g. "standardization" vs "local flexibility")
    -> principle set must explicitly regulate how such conflicts + justified EXCEPTIONS are handled
WHY three components structurally necessary:
  statement alone, w/o rationale -> not meaningfully reviewable/adaptable under changed circumstances
    (unclear what underlying goal the principle actually pursues)
  statement + rationale, w/o concrete consequences -> remains mere slogan
    -> offers no actual guidance in real decision situation
    -> nobody can derive what concrete action the principle actually requires in this case
"TEST AGAINST REAL DECISIONS instead of general slogans" = decisive quality test for a principle
  effective principle, applied to a concrete real decision situation, should yield a clear, derivable consequence
  principle applicable to multiple real cases w/o yielding a distinguishable, concrete action guidance
    -> too generally formulated, needs precision
CONFLICTS between principles = structural, unavoidable part of any realistic principle set
  different, legitimate goals (consistency via standardization vs adaptability via local flexibility)
    rarely fully maximizable simultaneously
  principle set not explicitly acknowledging these conflicts + providing resolution rule
    (priority order, explicit tradeoff process)
    -> leaves actual conflict resolution to chance or informal negotiating power of individual participants
Documented EXCEPTION process adds necessary flexibility for justified individual cases
  w/o undermining the principle's fundamental bindingness for the default case
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Aussage | formuliert, was gelten soll | Kern des Prinzips, muss präzise sein |
| Begründung | erklärt, warum die Aussage gilt | ermöglicht Überprüfung bei veränderten Umständen |
| Konsequenz | leitet konkrete Handlungsanweisung ab | unterscheidet wirksames Prinzip von Schlagwort |
| Zielkonflikt-Regelung | legt Umgang mit widersprüchlichen Prinzipien fest | verhindert zufällige, informelle Konfliktlösung |

Implementierung: Jedes Architekturprinzip wird mit Aussage, Begründung und expliziten, konkreten Konsequenzen dokumentiert. Vor Veröffentlichung wird jedes Prinzip gegen mindestens eine reale Entscheidungssituation getestet, um zu prüfen, ob es tatsächlich eine eindeutige Handlungsanweisung liefert. Zielkonflikte zwischen Prinzipien werden explizit benannt, mit einer Priorisierungsregel oder einem Abwägungsprozess versehen. Ein dokumentierter Ausnahmeprozess regelt begründete Einzelfallabweichungen.

## Scalability, Reliability, Security und Observability

Architekturprinzipien skalieren die Konsistenz und Nachvollziehbarkeit von Architekturentscheidungen proportional zur Konkretheit ihrer Konsequenzen und zur expliziten Regelung von Zielkonflikten; die Reliability-Grenze liegt darin, dass zu allgemein formulierte Prinzipien in realen Entscheidungssituationen keine tatsächliche Orientierung bieten und dadurch ihre eigentliche Steuerungswirkung verlieren.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Architekturprinzip wird in Entscheidungen zitiert, ohne die tatsächliche Entscheidung zu beeinflussen | das Prinzip hat keine expliziten, konkreten Konsequenzen und bleibt ein bloßes Schlagwort | das Prinzip anhand einer konkreten Entscheidungssituation testen und um explizite Konsequenzen ergänzen |
| zwei Architekturprinzipien führen bei derselben Entscheidung zu widersprüchlichen Handlungsanweisungen | kein expliziter Zielkonflikt-Mechanismus regelt die Priorisierung | eine Priorisierungsregel oder einen Abwägungsprozess für diesen Zielkonflikt explizit dokumentieren |
| Ausnahmen von Prinzipien werden informell und nicht nachvollziehbar gewährt | kein dokumentierter Ausnahmeprozess existiert | einen expliziten, dokumentierten Ausnahmeprozess mit benannter Entscheidungsinstanz einführen |

Security: Sicherheitsrelevante Architekturprinzipien sollten besonders konkrete Konsequenzen formulieren, da vage Sicherheitsprinzipien in der Praxis häufig folgenlos bleiben. Observability: Die tatsächliche Zitierhäufigkeit eines Prinzips bei realen Architekturentscheidungen, verglichen mit seiner tatsächlichen Konsequenzwirkung, ist ein zentrales Signal zur Bewertung seiner praktischen Wirksamkeit.

## Trade-offs und Entscheidungen

**Staff** wendet ein gegebenes Architekturprinzip mit korrekter Ableitung der Konsequenz auf eine konkrete Entscheidung an. **Principal** entwirft ein vollständiges Prinzipienset mit Begründung, Konsequenzen und Zielkonflikt-Regelung für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für Architekturprinzipien fest, die Ausnahmeprozesse und Zielkonflikt-Priorisierung verbindlich regeln.

Anti-Patterns: Architekturprinzipien ohne explizite, konkrete Konsequenzen als bloße Schlagworte formulieren; Zielkonflikte zwischen Prinzipien unbenannt lassen und der informellen Verhandlung einzelner Beteiligter überlassen; Ausnahmen informell und ohne dokumentierten Prozess gewähren.

## Production Checklist

- [ ] Jedes Architekturprinzip enthält Aussage, Begründung und explizite, konkrete Konsequenzen.
- [ ] Jedes Prinzip ist gegen mindestens eine reale Entscheidungssituation getestet.
- [ ] Zielkonflikte zwischen Prinzipien sind explizit benannt und mit einer Priorisierungsregel versehen.
- [ ] Ein dokumentierter Ausnahmeprozess regelt begründete Einzelfallabweichungen.

## Interviewfragen

### 1. Welche drei Bestandteile muss ein wirksames Architekturprinzip enthalten?

**Antwort:** Eine Aussage (was gelten soll), eine Begründung (warum) und konkrete Konsequenzen (was dies für tatsächliche Entscheidungen bedeutet).

### 2. Warum wird ein Prinzip ohne konkrete Konsequenzen als "Schlagwort" bezeichnet?

**Antwort:** Weil es in einer realen Entscheidungssituation keine tatsächliche Orientierung bietet, da niemand daraus ableiten kann, welche konkrete Handlung das Prinzip tatsächlich verlangt.

### 3. Was ist der entscheidende Qualitätstest für ein Architekturprinzip?

**Antwort:** Ob es, angewendet auf eine konkrete, reale Entscheidungssituation, eine eindeutige, ableitbare Konsequenz liefert.

### 4. Warum sind Zielkonflikte zwischen Prinzipien unvermeidbar?

**Antwort:** Weil unterschiedliche, legitime Ziele (etwa Standardisierung gegenüber lokaler Flexibilität) selten vollständig gleichzeitig maximiert werden können.

### 5. Wie gehst du vor, wenn zwei Architekturprinzipien bei derselben Entscheidung zu widersprüchlichen Handlungsanweisungen führen?

**Antwort:** Ich prüfe, ob eine explizite Priorisierungsregel oder ein Abwägungsprozess für diesen Zielkonflikt dokumentiert ist, und ergänze diese Regelung, falls sie fehlt.

### 6. Widersprüchliche Anforderung: Die Organisation will klare, universell geltende Architekturprinzipien UND Teams brauchen Flexibilität für projektspezifische Besonderheiten — wie gehst du vor?

**Antwort:** Ich würde die Prinzipien mit konkreten, verbindlichen Konsequenzen für den Regelfall formulieren, ergänzt um einen explizit dokumentierten Ausnahmeprozess mit benannter Entscheidungsinstanz für begründete, projektspezifische Abweichungen, statt entweder starre Universalgültigkeit zu erzwingen oder Prinzipien durch unbegrenzte Flexibilität wirkungslos zu machen.

## Praktische Labs

~~~python
# Local, deterministic simulation of testing whether a principle yields a concrete consequence (executed locally, no real EA tool):

def test_principle(principle, decision_scenario):
    has_explicit_consequence = principle.get("consequence_for") and decision_scenario in principle["consequence_for"]
    return {"principle": principle["statement"], "effective": has_explicit_consequence}

principles = [
    {"statement": "Security has priority", "consequence_for": {}},  # vague, no concrete consequence
    {"statement": "All new services must use mTLS for internal communication",
     "consequence_for": {"new_service_design": "must implement mTLS before production approval"}},
]

for p in principles:
    print(test_principle(p, "new_service_design"))
~~~

## Dependencies, Cross-References und Quellen

1. The Open Group: [TOGAF Standard, 10th Edition — Architecture Principles](https://pubs.opengroup.org/togaf-standard/introduction/), abgerufen 2026-09-18.
2. Gartner-Referenzmodell: [Enterprise Architecture Principles Framework](https://www.gartner.com/en/information-technology/glossary/enterprise-architecture-ea), abgerufen 2026-09-18.

Enterprise Architecture als Disziplin ist kanonisch in [KB-0589](01-enterprise-architecture-als-disziplin.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte, automatische Prüfung von Architekturentscheidungsdokumenten gegen formulierte Prinzipienkonsequenzen zur Konsistenzsicherung | Evaluating | Als ergänzendes Prüfwerkzeug für formal dokumentierte Konsequenzen einsetzen, jedoch die abschließende Bewertung von Zielkonflikten und Ausnahmefällen weiterhin als menschliche Entscheidung behandeln. |

Ein Team akzeptiert ein Architekturprinzipienset erst, wenn jedes Prinzip nachweislich konkrete Konsequenzen liefert, Zielkonflikte explizit geregelt sind und ein dokumentierter Ausnahmeprozess existiert.
