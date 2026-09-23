---
{"id": "KB-0589", "title": "Enterprise Architecture als Disziplin", "domain": "25", "sequence": 1, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Geschäftsziele, Istlandschaft und Zielbild für einen konkreten Geltungsbereich anhand etablierter EA-Praxis korrekt verbinden und ein Architekturrepository für diesen Geltungsbereich pflegen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Enterprise Architecture als Disziplin gegenüber einzelnen Lösungsdesigns abgegrenzt wird, mit klarem Geltungsbereich und Entscheidungsmandat.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein Lösungsdesign fälschlich als Enterprise-Architecture-Entscheidung behandelt wird oder umgekehrt eine Enterprise-Architecture-Frage auf Lösungsdesign-Ebene isoliert entschieden wird, und die Ebene korrekt zuordnen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für den Geltungsbereich und das Entscheidungsmandat der Enterprise-Architecture-Funktion festlegen, die eine nachvollziehbare Abgrenzung zu einzelnen Lösungsdesigns sicherstellen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die formale TOGAF-Zertifizierung oder spezifische ArchiMate-Notation im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis von Enterprise Architecture als eigenständige Disziplin mit klarem Geltungsbereich, nicht eine bestimmte formale Zertifizierung oder Notation."}}, "lab_validation": [{"lab_id": "KB-0589-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Unterscheidung von Enterprise-Architecture-Entscheidung und einzelnem Lösungsdesign, kein produktives EA-Tool verwendet", "evidence": "Ein lokales Skript prüft eine Liste von Entscheidungsanfragen anhand ihres Geltungsbereichs (einzelnes System vs. mehrere Geschäftsbereiche) und ordnet sie entsprechend der Lösungsdesign- oder der Enterprise-Architecture-Ebene zu.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales EA-Tool."}]}
---
# Enterprise Architecture als Disziplin

> **Ziel:** Enterprise Architecture verbindet Geschäftsziele, die tatsächliche Istlandschaft (welche Systeme, Prozesse und Datenflüsse tatsächlich existieren) und Zielbilder (wohin sich diese Landschaft bewegen soll) auf einer Ebene, die über ein einzelnes Lösungsdesign hinausgeht. Der zentrale Punkt dieses Kapitels ist die nachvollziehbare Abgrenzung von Enterprise Architecture gegenüber einzelnen Lösungsdesigns: Ein Lösungsdesign trifft technische Entscheidungen für ein einzelnes System oder Projekt; Enterprise Architecture trifft Entscheidungen, die mehrere Systeme, Geschäftsbereiche oder einen längeren Zeithorizont betreffen und dabei einen expliziten **Geltungsbereich**, ein klares **Entscheidungsmandat** (wer tatsächlich befugt ist, eine Enterprise-Architecture-Entscheidung zu treffen oder durchzusetzen) und ein gepflegtes **Architekturrepository** (die dokumentierte, nachvollziehbare Grundlage bisheriger und geplanter Architekturentscheidungen) benötigen.

## Zweck, Mental Model und Dependencies

Die Abgrenzung zwischen Enterprise Architecture und einzelnem Lösungsdesign ist keine reine Frage der Unternehmensgröße, sondern des Geltungsbereichs einer Entscheidung: Eine Entscheidung, die nur ein einzelnes System oder Team betrifft (etwa welche Datenbank ein bestimmter Dienst verwendet), ist typischerweise Lösungsdesign, während eine Entscheidung, die mehrere Systeme, Geschäftsbereiche oder eine langfristige, organisationsweite Konsistenz betrifft (etwa welches Identitätsmanagement-System unternehmensweit als Standard gilt), typischerweise Enterprise Architecture ist — dieselbe technische Frage kann je nach tatsächlichem Geltungsbereich auf der einen oder der anderen Ebene entschieden werden müssen. Ein klares Entscheidungsmandat ist notwendig, weil Enterprise-Architecture-Entscheidungen naturgemäß mehrere Teams oder Geschäftsbereiche betreffen, deren individuelle Interessen nicht notwendigerweise mit der organisationsweiten Konsistenz übereinstimmen — ohne ein explizit benanntes Mandat (wer eine solche Entscheidung tatsächlich treffen und durchsetzen kann) bleiben Enterprise-Architecture-Entscheidungen unverbindliche Empfehlungen, die von einzelnen Teams nach Belieben ignoriert werden können. Das Architekturrepository schließlich macht bisherige und geplante Architekturentscheidungen nachvollziehbar und wiederverwendbar: Ohne eine dokumentierte, gepflegte Grundlage müsste jede neue Entscheidung den bestehenden Kontext (welche Systeme existieren tatsächlich, welche Entscheidungen wurden bereits getroffen und warum) erneut mühsam rekonstruieren, statt auf einer nachvollziehbaren, kumulativen Wissensbasis aufzubauen.

~~~text
Enterprise Architecture: connects business goals, ACTUAL current landscape (systems/processes/data flows
  that actually exist), and target pictures (where this landscape should move)
  at a level BEYOND a single solution design
KEY DISTINCTION: EA vs single solution design
  solution design: technical decisions for a SINGLE system/project
  EA: decisions affecting MULTIPLE systems, business units, or longer time horizon
  needs explicit: SCOPE, clear DECISION MANDATE (who is actually authorized to make/enforce EA decision),
    maintained ARCHITECTURE REPOSITORY (documented, traceable basis of past+planned decisions)
DISTINCTION not purely about company size, but decision SCOPE:
  decision affecting only single system/team (e.g. which DB a specific service uses) -> typically solution design
  decision affecting multiple systems/business units/long-term org-wide consistency
    (e.g. which identity management system is org-wide standard) -> typically EA
  SAME technical question can need deciding at EITHER level depending on actual scope
WHY clear decision mandate needed: EA decisions naturally affect multiple teams/business units
  whose individual interests don't necessarily align with org-wide consistency
  without explicitly named mandate (who can actually make+enforce such decision)
    -> EA decisions remain non-binding recommendations, ignored by individual teams at will
WHY architecture repository needed: makes past+planned decisions traceable+reusable
  without documented, maintained basis -> every new decision must laboriously reconstruct
    existing context (what systems actually exist, what decisions already made and why)
    instead of building on traceable, cumulative knowledge base
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Geltungsbereich | trennt Enterprise-Architecture- von Lösungsdesign-Entscheidungen | bestimmt, auf welcher Ebene eine Frage entschieden werden muss |
| Entscheidungsmandat | benennt Befugnis zur tatsächlichen Durchsetzung | verhindert unverbindliche, ignorierbare Empfehlungen |
| Architekturrepository | dokumentiert bisherige und geplante Entscheidungen | macht Kontext nachvollziehbar und wiederverwendbar |
| Zielbild | beschreibt angestrebte künftige Landschaft | Grundlage für priorisierte Architekturentscheidungen |

Implementierung: Für jede Architekturentscheidung wird explizit geprüft, ob ihr Geltungsbereich ein einzelnes System oder mehrere Systeme/Geschäftsbereiche betrifft, und entsprechend auf Lösungsdesign- oder Enterprise-Architecture-Ebene entschieden. Ein Architekturrepository dokumentiert getroffene Entscheidungen mit Begründung und Geltungsbereich. Ein explizit benanntes Entscheidungsmandat stellt sicher, dass Enterprise-Architecture-Entscheidungen tatsächlich durchgesetzt werden können.

## Scalability, Reliability, Security und Observability

Enterprise Architecture als Disziplin skaliert die organisationsweite Konsistenz proportional zur Klarheit von Geltungsbereich und Entscheidungsmandat; die Reliability-Grenze liegt darin, dass eine Enterprise-Architecture-Funktion ohne durchsetzbares Mandat zu inkonsistenten, von einzelnen Teams isoliert getroffenen Entscheidungen führt, die die eigentlich angestrebte organisationsweite Konsistenz untergraben.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| mehrere Teams treffen widersprüchliche, isolierte Architekturentscheidungen für dieselbe organisationsweite Frage | kein klares Entscheidungsmandat für Enterprise-Architecture-Fragen ist etabliert | ein explizit benanntes Entscheidungsmandat für organisationsweite Fragen einführen |
| eine Architekturentscheidung wird auf einer unpassenden Ebene getroffen (zu isoliert oder zu zentral) | der tatsächliche Geltungsbereich der Entscheidung wurde nicht korrekt eingeschätzt | den tatsächlichen Geltungsbereich (Anzahl betroffener Systeme/Geschäftsbereiche) explizit bewerten |
| neue Architekturentscheidungen wiederholen bereits getroffene, ähnliche Entscheidungen ohne Bezug | kein gepflegtes Architekturrepository macht bisherige Entscheidungen nachvollziehbar | ein Architekturrepository mit dokumentierten, begründeten Entscheidungen einführen |

Security: Sicherheitsrelevante, organisationsweite Standards (etwa Identitätsmanagement) sind ein typisches Beispiel für Enterprise-Architecture-Entscheidungen mit hohem Durchsetzungsbedarf. Observability: Die tatsächliche Einhaltungsquote getroffener Enterprise-Architecture-Entscheidungen durch einzelne Teams ist ein zentrales Signal zur Bewertung, ob das Entscheidungsmandat tatsächlich wirksam ist.

## Trade-offs und Entscheidungen

**Staff** setzt eine gegebene Enterprise-Architecture-Entscheidung in einem Lösungsdesign korrekt um. **Principal** trifft Enterprise-Architecture-Entscheidungen für einen definierten Geltungsbereich und pflegt das zugehörige Architekturrepository. **Chief** legt das unternehmensweite Entscheidungsmandat und den Geltungsbereich der Enterprise-Architecture-Funktion fest.

Anti-Patterns: Enterprise-Architecture-Entscheidungen ohne durchsetzbares Mandat als bloße, unverbindliche Empfehlungen behandeln; einzelne Lösungsdesign-Entscheidungen fälschlich auf Enterprise-Architecture-Ebene zentralisieren, wo lokale Flexibilität angemessener wäre; kein Architekturrepository pflegen und dadurch bisherige Entscheidungen bei jeder neuen Frage erneut rekonstruieren müssen.

## Production Checklist

- [ ] Der Geltungsbereich jeder Architekturentscheidung ist explizit bewertet (Lösungsdesign vs. Enterprise Architecture).
- [ ] Ein explizit benanntes Entscheidungsmandat für Enterprise-Architecture-Fragen existiert.
- [ ] Ein Architekturrepository dokumentiert getroffene Entscheidungen mit Begründung.
- [ ] Die Einhaltung getroffener Enterprise-Architecture-Entscheidungen wird beobachtet.

## Interviewfragen

### 1. Was unterscheidet Enterprise Architecture von einzelnem Lösungsdesign?

**Antwort:** Der Geltungsbereich der Entscheidung — Lösungsdesign betrifft ein einzelnes System oder Projekt, Enterprise Architecture betrifft mehrere Systeme, Geschäftsbereiche oder eine langfristige, organisationsweite Konsistenz.

### 2. Warum benötigt Enterprise Architecture ein explizites Entscheidungsmandat?

**Antwort:** Weil Enterprise-Architecture-Entscheidungen naturgemäß mehrere Teams betreffen, deren individuelle Interessen nicht notwendigerweise mit organisationsweiter Konsistenz übereinstimmen — ohne Mandat bleiben solche Entscheidungen unverbindliche, ignorierbare Empfehlungen.

### 3. Wofür dient ein Architekturrepository?

**Antwort:** Es macht bisherige und geplante Architekturentscheidungen dokumentiert und nachvollziehbar, sodass neue Entscheidungen auf einer kumulativen Wissensbasis statt auf mühsamer Rekonstruktion aufbauen können.

### 4. Ist die Abgrenzung zwischen Enterprise Architecture und Lösungsdesign primär eine Frage der Unternehmensgröße?

**Antwort:** Nein, primär eine Frage des tatsächlichen Geltungsbereichs einer konkreten Entscheidung, nicht der Unternehmensgröße insgesamt.

### 5. Wie gehst du vor, wenn mehrere Teams widersprüchliche, isolierte Architekturentscheidungen für dieselbe organisationsweite Frage treffen?

**Antwort:** Ich prüfe, ob ein klares Entscheidungsmandat für diese organisationsweite Frage etabliert ist, und führe es andernfalls explizit ein.

### 6. Widersprüchliche Anforderung: Teams wollen maximale lokale Entscheidungsautonomie UND die Organisation will maximale, unternehmensweite architektonische Konsistenz — wie gehst du vor?

**Antwort:** Ich würde den Geltungsbereich jeder Entscheidungsart explizit klassifizieren und nur tatsächlich organisationsweit relevante Fragen zentral über das Enterprise-Architecture-Mandat entscheiden, während rein lokale Lösungsdesign-Fragen bewusst in der Autonomie der einzelnen Teams verbleiben, statt Konsistenz und Autonomie pauschal gegeneinander auszuspielen.

## Praktische Labs

~~~python
# Local, deterministic simulation of classifying decisions as solution design vs enterprise architecture (executed locally, no real EA tool):

def classify_decision(affected_systems_count, affected_business_units_count):
    if affected_systems_count <= 1 and affected_business_units_count <= 1:
        return "solution_design"
    return "enterprise_architecture"

decisions = [
    {"name": "database choice for service X", "systems": 1, "units": 1},
    {"name": "org-wide identity management standard", "systems": 12, "units": 4},
]

for d in decisions:
    print(d["name"], "->", classify_decision(d["systems"], d["units"]))
~~~

## Dependencies, Cross-References und Quellen

1. The Open Group: [TOGAF Standard, 10th Edition — Introduction](https://pubs.opengroup.org/togaf-standard/introduction/), abgerufen 2026-09-18.
2. Gartner-Referenzmodell: [Enterprise Architecture Framework Overview](https://www.gartner.com/en/information-technology/glossary/enterprise-architecture-ea), abgerufen 2026-09-18.

Dies ist das erste Kapitel von Domain 25 (Enterprise Architecture); es hat keine kapitelinternen Vorgängerabhängigkeiten innerhalb dieses Domains.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte, automatische Ist-Landschafts-Erfassung aus Code-Repositories und Infrastrukturkonfiguration als Ergänzung zum manuell gepflegten Architekturrepository | Evaluating | Als ergänzende Erfassungsquelle prüfen, jedoch das gepflegte Architekturrepository weiterhin als maßgebliche, kuratierte Entscheidungsgrundlage behandeln, nicht als vollständig automatisierten Ersatz. |

Ein Team akzeptiert eine Enterprise-Architecture-Funktion erst, wenn Geltungsbereich, Entscheidungsmandat und Architekturrepository nachweislich etabliert sind und Entscheidungen nachvollziehbar zwischen Lösungsdesign- und Enterprise-Architecture-Ebene unterschieden werden.
