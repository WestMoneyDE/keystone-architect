---
{"id": "KB-0599", "title": "Technologiestandards und Kataloge", "domain": "25", "sequence": 11, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0593", "concepts": ["Technology Architecture"], "needed_for": "understanding"}, {"id": "KB-0598", "concepts": ["Enterprise-Referenzarchitekturen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Technologiekatalog mit klassifizierten Technologien (erlaubt, eingeschränkt, abzulösend) und begründeten Ausnahmefristen anhand etablierter Praxis korrekt pflegen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Klassifizierungskriterien, Versionsvorgaben und Entscheidungsrechte für Ausnahmen einen Technologiekatalog nachvollziehbar und durchsetzbar machen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Ausnahmegenehmigung ohne nachvollziehbares Entscheidungsrecht erteilt wurde, und diese von einer legitim erteilten, befristeten Ausnahme unterscheiden können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Technologiekataloge festlegen, die Klassifizierungskriterien, Entscheidungsrechte und Ausnahmefristen verbindlich und nachvollziehbar regeln.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte technische Bewertung einzelner Technologien im Katalog ist bereits in den jeweiligen technischen Domains dieses Curriculums behandelt.", "rationale": "Kern ist die Klassifizierung, Governance und nachvollziehbare Entscheidungsstruktur eines Technologiekatalogs, nicht die technische Bewertung einzelner Technologien."}}, "lab_validation": [{"lab_id": "KB-0599-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Prüfung von Ausnahmegenehmigungen gegen nachvollziehbare Entscheidungsrechte, kein produktives EA-Tool verwendet", "evidence": "Ein lokales Skript prüft eine Liste erteilter Ausnahmegenehmigungen für eingeschränkte Technologien gegen die jeweils dokumentierte, befugte Entscheidungsinstanz und die vereinbarte Ausnahmefrist, und markiert Genehmigungen ohne nachvollziehbare Entscheidungsinstanz oder abgelaufener Frist als zu klärend.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales EA-Tool."}]}
---
# Technologiestandards und Kataloge

> **Ziel:** Ein Technologiekatalog klassifiziert Technologien in mindestens drei Kategorien — **erlaubt** (offiziell unterstützte, für neue Nutzung freigegebene Technologien, entsprechend der bereits in [KB-0593](05-technology-architecture.md) behandelten Zielplattform), **eingeschränkt** (Technologien, die nur unter bestimmten Bedingungen oder mit expliziter Genehmigung genutzt werden dürfen) und **abzulösend** (Technologien, deren Nutzung aktiv reduziert und mittelfristig beendet werden soll). Der zentrale Punkt dieses Kapitels ist, dass diese Klassifizierung nur wirksam ist, wenn sie mit nachvollziehbaren **Kriterien**, klaren **Versionsvorgaben** und explizit dokumentierten **Entscheidungsrechten** für Ausnahmen verbunden ist — ein Technologiekatalog, der Technologien klassifiziert, ohne zu dokumentieren, wer tatsächlich befugt ist, eine Ausnahme von dieser Klassifizierung zu genehmigen und unter welchen Bedingungen, verliert seine praktische Steuerungswirkung, da Ausnahmen dann informell und nicht nachvollziehbar entschieden werden.

## Zweck, Mental Model und Dependencies

Die Klassifizierung einer Technologie als "erlaubt", "eingeschränkt" oder "abzulösend" muss auf nachvollziehbaren, dokumentierten Kriterien beruhen (etwa Sicherheitsbewertung, langfristige Unterstützungsfähigkeit, Übereinstimmung mit der bereits in [KB-0598](10-enterprise-referenzarchitekturen.md) behandelten Referenzarchitektur), statt auf informellen, nicht dokumentierten Präferenzen einzelner Entscheidungsträger — nur nachvollziehbare Kriterien ermöglichen es, eine Klassifizierungsentscheidung später zu überprüfen, zu begründen oder bei veränderten Umständen systematisch zu revidieren. Versionsvorgaben ergänzen die reine Technologieklassifizierung um eine zeitliche Dimension: Eine Technologie kann in einer bestimmten Version als "erlaubt" gelten, während eine ältere, nicht mehr unterstützte Version derselben Technologie als "abzulösend" eingestuft wird — diese versionsspezifische Differenzierung ist notwendig, da viele praktische Risiken (etwa fehlende Sicherheitsupdates) sich nicht auf die Technologie insgesamt, sondern auf spezifische, veraltete Versionen beziehen. Entscheidungsrechte für Ausnahmen sind der entscheidende, praktische Mechanismus, der einen Technologiekatalog von einer bloßen Wunschliste unterscheidet: Da reale Projekte gelegentlich legitime Gründe haben, von der Standardklassifizierung abzuweichen (etwa eine kurzfristig notwendige, eingeschränkte Technologie für ein spezifisches, zeitlich begrenztes Projekt), muss explizit dokumentiert sein, wer eine solche Ausnahme tatsächlich genehmigen darf, unter welchen Bedingungen, und mit welcher zeitlichen Befristung — ohne diese explizite Entscheidungsstruktur entstehen entweder unautorisierte, informelle Ausnahmen (die den Katalog faktisch aushöhlen) oder ein zu starrer Katalog, der legitime, projektspezifische Bedürfnisse nicht berücksichtigen kann.

~~~text
Technology catalog classifies technologies into at least THREE categories:
  ALLOWED (officially supported, cleared for new use -- target platform per KB-0593)
  RESTRICTED (usable only under specific conditions or explicit approval)
  DEPRECATING (usage actively being reduced, mid-term discontinuation planned)
KEY POINT: this classification only effective when connected to
  TRACEABLE CRITERIA, clear VERSION requirements, explicitly documented EXCEPTION DECISION RIGHTS
  catalog classifying tech WITHOUT documenting who is actually AUTHORIZED to grant an exception
    and under what conditions -> loses practical steering effect
    (exceptions then decided informally, non-traceably)
CLASSIFICATION must rest on traceable, documented criteria
  (security assessment, long-term support viability, alignment with reference architecture KB-0598)
  NOT informal, undocumented preferences of individual decision-makers
  only traceable criteria enable: later reviewing/justifying/systematically revising a classification decision
VERSION requirements add TIME dimension to pure tech classification
  tech can be "allowed" in specific version while older, unsupported version of SAME tech = "deprecating"
  version-specific differentiation necessary: many practical risks (missing security updates)
    relate not to the technology overall, but to specific, outdated versions
EXCEPTION DECISION RIGHTS = decisive, practical mechanism distinguishing catalog from mere wishlist
  real projects occasionally have legitimate reasons to deviate from standard classification
    (e.g. short-term-necessary restricted tech for specific, time-bounded project)
  must explicitly document: WHO can actually approve such exception, under what conditions,
    with what time limit
  w/o this explicit decision structure ->
    EITHER unauthorized, informal exceptions (factually hollowing out the catalog)
    OR too-rigid catalog unable to accommodate legitimate, project-specific needs
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Klassifizierung (erlaubt/eingeschränkt/abzulösend) | strukturiert Technologien nach Nutzungsfreigabe | Grundlage für Investitions- und Migrationsentscheidungen |
| Klassifizierungskriterien | dokumentierte Begründung je Klassifizierung | ermöglicht Überprüfbarkeit und Revidierbarkeit |
| Versionsvorgabe | ergänzt Klassifizierung um zeitliche/versionsspezifische Dimension | trennt Technologie-insgesamt von spezifischer, veralteter Version |
| Entscheidungsrecht für Ausnahmen | benennt befugte Instanz für begründete Abweichungen | verhindert informelle, nicht nachvollziehbare Ausnahmen |

Implementierung: Jede Technologie wird mit einer Klassifizierung, dokumentierten Kriterien und ggf. versionsspezifischer Differenzierung im Katalog erfasst. Ausnahmen von der Standardklassifizierung erfordern eine explizit dokumentierte Genehmigung durch die benannte, befugte Entscheidungsinstanz, mit definierter Befristung. Der Katalog wird regelmäßig überprüft und bei veränderten Umständen (neue Sicherheitsrisiken, ausbleibende Unterstützung) systematisch aktualisiert.

## Scalability, Reliability, Security und Observability

Technologiestandards und Kataloge skalieren die Nachvollziehbarkeit und Durchsetzbarkeit von Technologieentscheidungen proportional zur Klarheit von Klassifizierungskriterien und Entscheidungsrechten; die Reliability-Grenze liegt darin, dass ein Katalog ohne dokumentierte Entscheidungsrechte für Ausnahmen entweder durch informelle Abweichungen ausgehöhlt wird oder legitime, projektspezifische Bedürfnisse nicht angemessen berücksichtigen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| mehrere Projekte nutzen eingeschränkte Technologien ohne dokumentierte Genehmigung | keine nachvollziehbaren Entscheidungsrechte für Ausnahmen sind etabliert oder werden nicht durchgesetzt | Entscheidungsrechte für Ausnahmen explizit dokumentieren und deren Einhaltung überwachen |
| eine Klassifizierungsentscheidung lässt sich nicht nachvollziehbar begründen | keine dokumentierten Kriterien liegen der ursprünglichen Klassifizierung zugrunde | die Klassifizierung um explizit dokumentierte, überprüfbare Kriterien ergänzen |
| eine als "erlaubt" klassifizierte Technologie wird in einer veralteten, nicht mehr unterstützten Version weiter genutzt | keine versionsspezifische Differenzierung der Klassifizierung existiert | Versionsvorgaben ergänzen, die veraltete Versionen explizit als "abzulösend" klassifizieren |

Security: Klassifizierungskriterien sollten Sicherheitsbewertungen explizit einbeziehen, und abgelaufene Ausnahmefristen für eingeschränkte, sicherheitsrelevante Technologien sollten aktiv nachverfolgt werden. Observability: Die tatsächliche Nutzung eingeschränkter und abzulösender Technologien über die Zeit, gemessen gegen erteilte, befristete Ausnahmen, ist ein zentrales Signal zur Bewertung der Katalog-Governance-Wirksamkeit.

## Trade-offs und Entscheidungen

**Staff** wendet die Klassifizierung eines gegebenen Technologiekatalogs korrekt an und beantragt Ausnahmen über den vorgesehenen Entscheidungsweg. **Principal** entwirft den vollständigen Technologiekatalog mit Klassifizierungskriterien, Versionsvorgaben und Entscheidungsrechten für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für Technologiekatalog-Governance fest.

Anti-Patterns: Technologien ohne dokumentierte, nachvollziehbare Kriterien klassifizieren; Ausnahmen ohne benannte, befugte Entscheidungsinstanz oder ohne zeitliche Befristung informell zulassen; eine Technologie als Ganzes klassifizieren, ohne veraltete, spezifisch riskante Versionen gesondert zu behandeln.

## Production Checklist

- [ ] Jede Technologie im Katalog ist mit dokumentierten, nachvollziehbaren Klassifizierungskriterien versehen.
- [ ] Versionsspezifische Klassifizierungen unterscheiden aktuelle von veralteten, riskanten Versionen.
- [ ] Entscheidungsrechte für Ausnahmen sind explizit dokumentiert, mit definierter Befristung.
- [ ] Erteilte Ausnahmen werden aktiv gegen ihre Befristung nachverfolgt.

## Interviewfragen

### 1. Welche drei grundlegenden Klassifizierungskategorien werden in einem Technologiekatalog typischerweise unterschieden?

**Antwort:** Erlaubt (offiziell freigegeben), eingeschränkt (nur unter Bedingungen oder mit Genehmigung nutzbar) und abzulösend (aktiv zu reduzieren, mittelfristig zu beenden).

### 2. Warum sind dokumentierte Klassifizierungskriterien notwendig?

**Antwort:** Damit eine Klassifizierungsentscheidung später überprüft, begründet oder bei veränderten Umständen systematisch revidiert werden kann, statt auf informellen, nicht nachvollziehbaren Präferenzen zu beruhen.

### 3. Warum ist eine versionsspezifische Differenzierung der Klassifizierung notwendig?

**Antwort:** Weil viele praktische Risiken (etwa fehlende Sicherheitsupdates) sich nicht auf eine Technologie insgesamt, sondern auf spezifische, veraltete Versionen beziehen.

### 4. Was passiert, wenn ein Technologiekatalog keine dokumentierten Entscheidungsrechte für Ausnahmen hat?

**Antwort:** Entweder entstehen unautorisierte, informelle Ausnahmen, die den Katalog faktisch aushöhlen, oder der Katalog wird zu starr und kann legitime, projektspezifische Bedürfnisse nicht berücksichtigen.

### 5. Wie gehst du vor, wenn mehrere Projekte eingeschränkte Technologien ohne dokumentierte Genehmigung nutzen?

**Antwort:** Ich prüfe, ob nachvollziehbare Entscheidungsrechte für Ausnahmen etabliert und durchgesetzt werden, und stelle sicher, dass künftige Ausnahmen explizit dokumentiert und befristet genehmigt werden.

### 6. Widersprüchliche Anforderung: Projekte wollen schnelle, unbürokratische Nutzung neuer Technologien UND die Organisation will strikte Kontrolle über den Technologiekatalog — wie gehst du vor?

**Antwort:** Ich würde einen definierten, schnellen Ausnahmeprozess mit klar benannter Entscheidungsinstanz und befristeter Genehmigung für begründete, projektspezifische Bedürfnisse etablieren, statt entweder jede Abweichung langwierig zu prüfen oder unkontrollierte, informelle Nutzung neuer Technologien zuzulassen.

## Praktische Labs

~~~python
# Local, deterministic simulation of checking exception approvals against documented decision rights (executed locally, no real EA tool):

def check_exceptions(exceptions, authorized_approvers, current_date):
    results = []
    for e in exceptions:
        valid_approver = e["approved_by"] in authorized_approvers
        not_expired = e["expires"] > current_date
        results.append({"technology": e["technology"], "valid": valid_approver and not_expired})
    return results

exceptions = [
    {"technology": "LegacyFramework", "approved_by": "ArchitectureBoard", "expires": 20261231},
    {"technology": "UnvettedLib", "approved_by": "IndividualDeveloper", "expires": 20261231},
]

for r in check_exceptions(exceptions, authorized_approvers=["ArchitectureBoard"], current_date=20260918):
    print(r)
~~~

## Dependencies, Cross-References und Quellen

1. The Open Group: [TOGAF Standard, 10th Edition — Standards Information Base](https://pubs.opengroup.org/togaf-standard/introduction/), abgerufen 2026-09-18.
2. Gartner-Referenzmodell: [IT Governance and Technology Standards Management](https://www.gartner.com/en/information-technology/glossary/it-governance), abgerufen 2026-09-18.

Technology Architecture ist kanonisch in [KB-0593](05-technology-architecture.md) behandelt; Enterprise-Referenzarchitekturen in [KB-0598](10-enterprise-referenzarchitekturen.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Erkennung tatsächlich genutzter, aber nicht katalogisierter oder abgelaufener Technologien über Dependency-Scans | Evaluating | Als ergänzendes, kontinuierliches Überwachungswerkzeug einsetzen, jedoch die abschließende Klassifizierungs- und Ausnahmeentscheidung weiterhin als dokumentierte, menschliche Entscheidung durch die befugte Instanz behandeln. |

Ein Team akzeptiert einen Technologiekatalog erst, wenn Klassifizierungskriterien, Versionsvorgaben und Entscheidungsrechte für Ausnahmen nachweislich dokumentiert und durchgesetzt werden.
