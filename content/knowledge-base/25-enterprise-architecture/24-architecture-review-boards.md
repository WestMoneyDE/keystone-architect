---
{"id": "KB-0612", "title": "Architecture Review Boards", "domain": "25", "sequence": 24, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0602", "concepts": ["Architekturprinzipien"], "needed_for": "understanding"}, {"id": "KB-0598", "concepts": ["Enterprise-Referenzarchitekturen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Architekturentscheidung für ein Architecture Review Board mit korrekter Vorbereitung, Bezug auf Prüfkriterien und Ausnahmeantrag anhand etablierter Praxis aufbereiten können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Mandat, Prüfkriterien und Entscheidungsrechte eines Architecture Review Board mit den bereits in KB-0602 und KB-0598 behandelten Prinzipien und Referenzarchitekturen verbunden werden, um wirksame statt bloß formale Entscheidungen zu ermöglichen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein Architecture Review Board durch unklares Mandat oder überlange Durchlaufzeiten zu einem bürokratischen Hindernis statt zu einem wirksamen Entscheidungsgremium wird, und die strukturelle Ursache benennen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Architecture Review Boards festlegen, die Mandat, Prüfkriterien, Entscheidungsrechte und Durchlaufzeiten verbindlich und nachvollziehbar regeln.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die formale ArchiMate-Notation für Review-Board-Artefakte im Detail ist Vertiefung.", "rationale": "Kern ist die organisatorische Wirksamkeit eines Review Board (Mandat, Kriterien, Durchlaufzeit), nicht eine bestimmte formale Notation."}}, "lab_validation": [{"lab_id": "KB-0612-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Prüfung der Durchlaufzeit von Architekturentscheidungen gegen definierte Prüfkriterien, kein produktives Review-Board-Tool verwendet", "evidence": "Ein lokales Skript prüft eine Liste eingereichter Architekturentscheidungen darauf, ob sie explizit gegen dokumentierte Prinzipien und Referenzarchitekturen bewertet wurden, und misst die tatsächliche Durchlaufzeit bis zur Entscheidung gegen eine definierte Zielzeit.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Review-Board-Tool."}]}
---
# Architecture Review Boards

> **Ziel:** Ein Architecture Review Board (ARB) ist das organisatorische Gremium, das Architekturentscheidungen gegen die bereits in [KB-0602](14-architekturprinzipien.md) behandelten Architekturprinzipien und die bereits in [KB-0598](10-enterprise-referenzarchitekturen.md) behandelten Referenzarchitekturen prüft. Der zentrale Punkt dieses Kapitels ist, dass ein ARB nur dann tatsächlich wirksam ist, wenn drei organisatorische Elemente explizit geklärt sind: ein klares **Mandat** (welche Entscheidungen das Board tatsächlich treffen oder durchsetzen kann), explizite **Prüfkriterien** (anhand welcher konkreten Prinzipien und Referenzarchitekturen eine Entscheidung bewertet wird, statt einer unstrukturierten, subjektiven Diskussion) und angemessene **Durchlaufzeiten** — ein ARB ohne diese drei Elemente wird entweder zu einem bürokratischen Hindernis (bei unklarem Mandat und überlangen Durchlaufzeiten) oder zu einem wirkungslosen Gremium, dessen Entscheidungen ignoriert werden können (bei fehlender Durchsetzungsbefugnis).

## Zweck, Mental Model und Dependencies

Ein klares Mandat ist die Grundvoraussetzung für die tatsächliche Wirksamkeit eines ARB: Ohne explizit definiertes, tatsächlich durchsetzbares Mandat (wer ist verpflichtet, das ARB für welche Art von Entscheidung tatsächlich einzubeziehen, und was passiert, wenn diese Verpflichtung nicht eingehalten wird) bleibt ein ARB ein beratendes Gremium, dessen Empfehlungen von einzelnen Teams nach Belieben ignoriert werden können — dieselbe strukturelle Problematik wie bereits bei der Enterprise-Architecture-Funktion insgesamt (siehe [KB-0589](01-enterprise-architecture-als-disziplin.md)) angesprochen. Explizite Prüfkriterien sind die zweite zentrale Voraussetzung: Statt eine Architekturentscheidung in einer unstrukturierten, potenziell subjektiven Diskussion zu bewerten, sollte ein ARB explizit gegen die dokumentierten Architekturprinzipien (mit ihren konkreten Konsequenzen, siehe [KB-0602](14-architekturprinzipien.md)) und gegen relevante Referenzarchitekturen (mit ihren definierten Variationspunkten, siehe [KB-0598](10-enterprise-referenzarchitekturen.md)) prüfen — diese Kriterienbindung macht Entscheidungen nachvollziehbar und konsistent über verschiedene Sitzungen und Board-Zusammensetzungen hinweg, statt von der jeweiligen, zufälligen Zusammensetzung der anwesenden Personen abzuhängen. Angemessene Durchlaufzeiten sind die dritte, oft unterschätzte Voraussetzung: Ein ARB, das formal über ein klares Mandat und klare Kriterien verfügt, aber Entscheidungen erst nach wochenlanger Wartezeit trifft, wird in der Praxis umgangen — Teams entwickeln informelle Wege, um dringende Entscheidungen ohne ARB-Beteiligung zu treffen, wodurch das Board trotz formaler Existenz seine tatsächliche Steuerungswirkung verliert. Die praktische Konsequenz ist, dass ein wirksames ARB unterschiedliche Durchlaufzeiten für unterschiedliche Entscheidungsdringlichkeiten vorsehen sollte (etwa einen beschleunigten Prozess für kleinere, risikoarme Entscheidungen, analog zur bereits in [KB-0596](08-togaf-und-architekturentwicklung.md) behandelten pragmatischen ADM-Anwendung), statt für jede Entscheidung dieselbe, oft zu lange Durchlaufzeit zu erzwingen.

~~~text
Architecture Review Board (ARB): organizational body reviewing architecture decisions against
  KB-0602 architecture principles and KB-0598 reference architectures
KEY POINT: ARB only actually effective when THREE organizational elements explicitly clarified
  clear MANDATE (which decisions board can actually make/enforce)
  explicit REVIEW CRITERIA (which concrete principles/ref architectures a decision is evaluated against,
    instead of unstructured, subjective discussion)
  appropriate TURNAROUND TIMES
  ARB w/o these three elements -> EITHER bureaucratic obstacle (unclear mandate + overlong turnaround)
    OR ineffective body whose decisions can be ignored (lacking enforcement authority)
CLEAR MANDATE = basic prerequisite for actual effectiveness
  w/o explicitly defined, actually enforceable mandate
    (who is OBLIGED to actually involve ARB for which decision type, what happens if not honored)
  ARB stays advisory body, recommendations ignored by individual teams at will
  same structural issue as EA function overall (KB-0589)
EXPLICIT REVIEW CRITERIA = second central prerequisite
  instead of evaluating decision in unstructured, potentially subjective discussion
  ARB should explicitly review against documented principles (w/ concrete consequences, KB-0602)
    and relevant reference architectures (w/ defined variation points, KB-0598)
  this criteria-binding -> makes decisions traceable+consistent across sessions/board compositions
    instead of depending on the particular, random composition of people present
APPROPRIATE TURNAROUND TIMES = third, often-underestimated prerequisite
  ARB formally having clear mandate+criteria but deciding only after week-long wait
    -> practically bypassed
  teams develop informal paths to make urgent decisions w/o ARB involvement
    -> board loses actual steering effect despite formal existence
PRACTICAL CONSEQUENCE: effective ARB should provide DIFFERENT turnaround times
  for different decision urgencies
  (accelerated process for smaller, low-risk decisions, analogous to KB-0596's pragmatic ADM application)
  instead of forcing same, often-too-long turnaround for every decision
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Mandat | benennt tatsächlich durchsetzbare Entscheidungsbefugnis | verhindert unverbindliche, ignorierbare Empfehlungen |
| Prüfkriterien | binden Entscheidung an dokumentierte Prinzipien/Referenzarchitekturen | ermöglicht nachvollziehbare, konsistente Bewertung |
| Durchlaufzeit | Geschwindigkeit der Entscheidungsfindung | angemessene Zeit verhindert informelle Umgehung |
| Gestaffelter Prozess | unterschiedliche Durchlaufzeiten nach Entscheidungsdringlichkeit | balanciert Gründlichkeit und Geschwindigkeit |

Implementierung: Das ARB-Mandat wird explizit dokumentiert, mit klarer Benennung, welche Entscheidungstypen verpflichtend eingebracht werden müssen. Jede Entscheidung wird explizit gegen dokumentierte Architekturprinzipien und relevante Referenzarchitekturen geprüft, statt in unstrukturierter Diskussion bewertet zu werden. Ein gestaffelter Prozess mit unterschiedlichen Durchlaufzeiten für unterschiedliche Entscheidungsdringlichkeiten wird eingerichtet.

## Scalability, Reliability, Security und Observability

Architecture Review Boards skalieren die tatsächliche Steuerungswirkung von Architekturentscheidungen proportional zur Klarheit von Mandat, Prüfkriterien und angemessenen Durchlaufzeiten; die Reliability-Grenze liegt darin, dass ein ARB ohne diese drei Elemente entweder bürokratisch überlastet oder faktisch umgangen wird.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Teams treffen Architekturentscheidungen zunehmend ohne ARB-Beteiligung | die Durchlaufzeit des ARB ist unangemessen lang oder das Mandat unklar | die Durchlaufzeiten gestaffelt nach Dringlichkeit verkürzen und das Mandat explizit durchsetzen |
| ARB-Entscheidungen wirken inkonsistent zwischen verschiedenen Sitzungen | keine expliziten Prüfkriterien binden die Bewertung an dokumentierte Prinzipien | Entscheidungen explizit gegen dokumentierte Architekturprinzipien und Referenzarchitekturen prüfen |
| ARB-Empfehlungen werden von Teams regelmäßig ignoriert | kein durchsetzbares Mandat existiert für die betroffenen Entscheidungstypen | ein explizit definiertes, tatsächlich durchsetzbares Mandat etablieren |

Security: Sicherheitsrelevante Architekturentscheidungen sollten explizit Teil des verpflichtenden ARB-Mandats sein, unabhängig von der allgemeinen Pragmatisierung anderer Entscheidungstypen. Observability: Die tatsächliche Durchlaufzeit und die Einhaltungsquote von ARB-Entscheidungen durch betroffene Teams sind zentrale Signale zur Bewertung der tatsächlichen Wirksamkeit des Boards.

## Trade-offs und Entscheidungen

**Staff** bereitet eine gegebene Architekturentscheidung korrekt mit Bezug auf Prüfkriterien für das ARB auf. **Principal** entwirft die vollständige ARB-Struktur mit Mandat, Prüfkriterien und gestaffelten Durchlaufzeiten für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für Architecture Review Boards fest, die Mandat und Durchsetzbarkeit verbindlich regeln.

Anti-Patterns: ein ARB ohne durchsetzbares Mandat als bloß beratendes Gremium etablieren; Entscheidungen in unstrukturierter Diskussion statt anhand expliziter, dokumentierter Kriterien bewerten; dieselbe, lange Durchlaufzeit für alle Entscheidungen unabhängig von deren Dringlichkeit und Risiko erzwingen.

## Production Checklist

- [ ] Das ARB-Mandat ist explizit dokumentiert und tatsächlich durchsetzbar.
- [ ] Entscheidungen werden explizit gegen dokumentierte Architekturprinzipien und Referenzarchitekturen geprüft.
- [ ] Ein gestaffelter Prozess bietet unterschiedliche Durchlaufzeiten nach Entscheidungsdringlichkeit.
- [ ] Die Einhaltungsquote von ARB-Entscheidungen wird beobachtet.

## Interviewfragen

### 1. Welche drei organisatorischen Elemente sind für die Wirksamkeit eines Architecture Review Board zentral?

**Antwort:** Ein klares, durchsetzbares Mandat, explizite Prüfkriterien (Bezug auf dokumentierte Prinzipien und Referenzarchitekturen) und angemessene Durchlaufzeiten.

### 2. Was passiert, wenn ein ARB kein durchsetzbares Mandat hat?

**Antwort:** Es bleibt ein beratendes Gremium, dessen Empfehlungen von einzelnen Teams nach Belieben ignoriert werden können.

### 3. Warum sollten Entscheidungen explizit gegen dokumentierte Prinzipien geprüft werden, statt in unstrukturierter Diskussion bewertet zu werden?

**Antwort:** Weil dies Entscheidungen nachvollziehbar und konsistent über verschiedene Sitzungen und Board-Zusammensetzungen hinweg macht, statt von der zufälligen Zusammensetzung der anwesenden Personen abzuhängen.

### 4. Was passiert, wenn ein ARB angemessene Durchlaufzeiten nicht sicherstellt?

**Antwort:** Teams entwickeln informelle Wege, um dringende Entscheidungen ohne ARB-Beteiligung zu treffen, wodurch das Board trotz formaler Existenz seine tatsächliche Steuerungswirkung verliert.

### 5. Wie gehst du vor, wenn Teams zunehmend Architekturentscheidungen ohne ARB-Beteiligung treffen?

**Antwort:** Ich prüfe, ob die Durchlaufzeit des ARB unangemessen lang oder das Mandat unklar ist, und passe entsprechend die Durchlaufzeiten gestaffelt nach Dringlichkeit an oder setze das Mandat explizit durch.

### 6. Widersprüchliche Anforderung: Die Organisation will gründliche, konsistente Prüfung jeder Architekturentscheidung UND Teams brauchen schnelle Entscheidungen für dringende Fälle — wie gehst du vor?

**Antwort:** Ich würde einen gestaffelten Prozess mit unterschiedlichen Durchlaufzeiten je nach Entscheidungsdringlichkeit und -risiko einführen, analog zur pragmatischen ADM-Anwendung, statt entweder gründliche Prüfung für alle Entscheidungen zu erzwingen oder Prüfqualität für Geschwindigkeit zu opfern.

## Praktische Labs

~~~python
# Local, deterministic simulation of checking ARB turnaround time against decision urgency (executed locally, no real ARB tool):

def check_arb_turnaround(decision):
    target_days = 2 if decision["urgency"] == "low_risk" else 10
    return {"decision": decision["name"], "on_time": decision["actual_days"] <= target_days}

decisions = [
    {"name": "add caching layer to internal tool", "urgency": "low_risk", "actual_days": 1},
    {"name": "replace core identity provider", "urgency": "high_risk", "actual_days": 25},
]

for d in decisions:
    print(check_arb_turnaround(d))
~~~

## Dependencies, Cross-References und Quellen

1. The Open Group: [TOGAF Standard, 10th Edition — Architecture Governance](https://pubs.opengroup.org/togaf-standard/introduction/), abgerufen 2026-09-18.
2. Gartner-Referenzmodell: [Architecture Review Board Best Practices](https://www.gartner.com/en/information-technology/glossary/enterprise-architecture-ea), abgerufen 2026-09-18.

Architekturprinzipien sind kanonisch in [KB-0602](14-architekturprinzipien.md) behandelt; Enterprise-Referenzarchitekturen in [KB-0598](10-enterprise-referenzarchitekturen.md); pragmatische ADM-Anwendung in [KB-0596](08-togaf-und-architekturentwicklung.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, vorab durchgeführte Prinzip- und Referenzarchitektur-Konformitätsprüfung vor Einreichung bei einem ARB zur Reduktion manueller Prüfzeit | Evaluating | Als Vorprüfungswerkzeug einsetzen, das offensichtliche Konformitätsprobleme frühzeitig aufzeigt, jedoch die abschließende, kontextabhängige Bewertung weiterhin dem menschlichen ARB überlassen. |

Ein Team akzeptiert ein Architecture Review Board erst, wenn Mandat, Prüfkriterien und gestaffelte Durchlaufzeiten nachweislich etabliert sind und die tatsächliche Einhaltungsquote seiner Entscheidungen überwacht wird.
