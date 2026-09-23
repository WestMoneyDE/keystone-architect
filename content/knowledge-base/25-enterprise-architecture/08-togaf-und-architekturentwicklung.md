---
{"id": "KB-0596", "title": "TOGAF und Architekturentwicklung", "domain": "25", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0595", "concepts": ["Value Streams"], "needed_for": "understanding"}, {"id": "KB-0589", "concepts": ["Enterprise Architecture als Disziplin"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Die TOGAF Architecture Development Method (ADM) und ihre zentralen Artefakte anhand offizieller Dokumentation korrekt einordnen und pragmatisch auf einen konkreten Entscheidungszyklus anwenden können, ohne formale Zertifizierung zu behaupten.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit entscheiden, welche ADM-Phasen und Governance-Mechanismen tatsächlich pragmatisch anwendbar sind, statt das vollständige Framework unreflektiert und vollständig zu übernehmen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine TOGAF-Einführung an übermäßiger Prozessformalität statt an tatsächlich beschleunigten, besseren Architekturentscheidungen scheitert, und die Ursache auf eine unpragmatische, vollständige statt selektive Methodenanwendung zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für den pragmatischen Einsatz von TOGAF-Methodenbausteinen festlegen, die tatsächliche Entscheidungsgeschwindigkeit und -qualität priorisieren, statt formale Framework-Vollständigkeit.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die vollständige, formale TOGAF-Zertifizierung mit allen Detailartefakten ist Vertiefung und wird hier bewusst nicht als Ziel behauptet, entsprechend dem expliziten Manifest-Scope dieses Kapitels.", "rationale": "Kern ist die pragmatische Anwendung ausgewählter Methodenbausteine auf konkrete Entscheidungszyklen, nicht eine formale Zertifizierung oder vollständige Framework-Anwendung."}}, "lab_validation": [{"lab_id": "KB-0596-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Auswahl pragmatisch anwendbarer ADM-Phasen für einen konkreten Entscheidungszyklus, kein produktives TOGAF-Tool verwendet", "evidence": "Ein lokales Skript bewertet, welche ADM-Phasen (etwa Vision, Business Architecture, Opportunities & Solutions) für einen gegebenen, zeitlich begrenzten Entscheidungszyklus tatsächlich anwendbar sind, und schlägt eine reduzierte, pragmatische Auswahl statt der vollständigen Phasensequenz vor.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales TOGAF-Tool."}]}
---
# TOGAF und Architekturentwicklung

> **Ziel:** TOGAF (The Open Group Architecture Framework) bietet mit der **ADM** (Architecture Development Method) einen zyklischen, phasenbasierten Prozess sowie eine Reihe standardisierter **Artefakte** und **Governance**-Mechanismen für Enterprise Architecture. Dieses Kapitel behandelt TOGAF ausdrücklich ohne eine formale Zertifizierung oder eigene, formale Anwendungspraxis zu behaupten (siehe die bereits in [KB-0589](01-enterprise-architecture-als-disziplin.md) eingeführte Disziplin-Abgrenzung) — der zentrale Punkt ist die **pragmatische** Anwendung einzelner Methodenbausteine auf konkrete Entscheidungszyklen, statt das vollständige, umfangreiche Framework unreflektiert komplett zu übernehmen. TOGAF selbst betont, dass die ADM an den tatsächlichen Kontext einer Organisation angepasst werden soll, nicht als starre, vollständig zu befolgende Checkliste — eine Organisation, die versucht, jede ADM-Phase und jedes Artefakt vollständig und formal zu durchlaufen, ohne diese Anwendung an ihren tatsächlichen Entscheidungsbedarf anzupassen, riskiert, dass die Methode selbst zum Hindernis für schnelle, gute Architekturentscheidungen wird.

## Zweck, Mental Model und Dependencies

Die ADM ist als iterativer Zyklus konzipiert, dessen Phasen (von der Vision über Business-, Data-, Application- und Technology-Architecture bis zu Opportunities & Solutions und Migrationsplanung — die bereits in den vorherigen Kapiteln dieses Domains inhaltlich, aber unabhängig von der TOGAF-Notation behandelten Ebenen) nicht notwendigerweise vollständig und sequenziell für jede Architekturentscheidung durchlaufen werden müssen. Die pragmatische Anwendung bedeutet, für jeden konkreten Entscheidungszyklus explizit zu bewerten, welche ADM-Phasen und Artefakte tatsächlich zur Entscheidungsqualität beitragen — eine kleine, klar umrissene Architekturentscheidung (etwa die Wahl einer Zielplattform für eine einzelne Technologieklasse, siehe die bereits in [KB-0593](05-technology-architecture.md) behandelte Technology Architecture) benötigt typischerweise nicht den vollständigen ADM-Zyklus mit allen formalen Artefakten, während eine große, organisationsweite Transformation von der vollständigeren Anwendung der Methode profitieren kann. Governance-Mechanismen (etwa ein Architecture Review Board, das Entscheidungen gegen Standards prüft) sind ebenfalls pragmatisch zu dimensionieren: Ein zu schwergewichtiger Governance-Prozess für kleine, risikoarme Entscheidungen verlangsamt diese unnötig, während ein zu leichtgewichtiger Governance-Prozess für große, risikoreiche Entscheidungen tatsächlich wichtige Prüfungen versäumen kann. Die entscheidende methodische Haltung ist daher, TOGAF als einen Werkzeugkasten zu behandeln, aus dem für jeden konkreten Entscheidungszyklus die tatsächlich passenden Bausteine ausgewählt werden, statt das gesamte Framework als monolithische, vollständig zu befolgende Vorschrift zu behandeln — diese Haltung entspricht ausdrücklich der offiziellen TOGAF-Guidance selbst, die die Anpassung ("Tailoring") der ADM an den organisationalen Kontext explizit vorsieht.

~~~text
TOGAF ADM (Architecture Development Method): cyclic, phase-based process + standardized artifacts + governance
This chapter treats TOGAF WITHOUT claiming formal certification or own formal application practice
  (per KB-0589's discipline boundary)
KEY POINT: PRAGMATIC application of individual method building blocks to concrete decision cycles
  NOT unreflected, complete adoption of the full, extensive framework
TOGAF itself emphasizes: ADM should be ADAPTED to actual organizational context
  NOT a rigid, fully-to-follow checklist
  org trying to fully+formally run every ADM phase+artifact w/o adapting to actual decision need
    -> risks method itself becoming an obstacle to fast, good architecture decisions
ADM = iterative cycle, phases (vision through business/data/app/tech architecture
  to opportunities&solutions and migration planning -- content already covered in prior Domain 25 chapters,
  independent of TOGAF notation) NOT necessarily fully+sequentially run for EVERY architecture decision
PRAGMATIC application: explicitly evaluate per concrete decision cycle
  which ADM phases+artifacts ACTUALLY contribute to decision quality
  small, clearly-scoped decision (e.g. target platform choice for single tech class, KB-0593)
    typically doesn't need full ADM cycle w/ all formal artifacts
  large, org-wide transformation CAN benefit from more complete method application
GOVERNANCE mechanisms (e.g. Architecture Review Board) also need pragmatic sizing:
  too heavyweight governance for small, low-risk decisions -> unnecessarily slows them
  too lightweight governance for large, high-risk decisions -> can miss actually important checks
DECISIVE METHODOLOGICAL STANCE: treat TOGAF as a TOOLBOX
  select actually-fitting building blocks per concrete decision cycle
  NOT the entire framework as monolithic, fully-to-follow prescription
  this stance matches official TOGAF guidance itself, which explicitly provides for
    "Tailoring" the ADM to organizational context
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| ADM (Architecture Development Method) | iterativer Phasenzyklus für Architekturentwicklung | Grundlage für strukturierte, aber anpassbare Entscheidungsfindung |
| Tailoring | bewusste Anpassung der ADM an organisationalen Kontext | zentral für pragmatischen, statt formalistischen Einsatz |
| Artefakte | standardisierte Dokumentationsformen (Prinzipien, Roadmaps, Viewpoints) | werden selektiv, nicht vollständig für jede Entscheidung eingesetzt |
| Governance (Architecture Review Board) | prüft Entscheidungen gegen Standards | Dimensionierung sollte Risiko und Umfang der Entscheidung entsprechen |

Implementierung: Für jeden konkreten Architekturentscheidungszyklus wird explizit bewertet, welche ADM-Phasen und Artefakte tatsächlich zur Entscheidungsqualität beitragen, statt den vollständigen Zyklus unreflektiert zu durchlaufen. Governance-Prozesse werden proportional zu Risiko und Tragweite der jeweiligen Entscheidung dimensioniert. Die Anpassung (Tailoring) der Methode an den organisationalen Kontext wird explizit dokumentiert und begründet.

## Scalability, Reliability, Security und Observability

TOGAF-basierte Architekturentwicklung skaliert die tatsächliche Entscheidungsgeschwindigkeit und -qualität proportional zur konsequenten, pragmatischen Anpassung der Methode an den tatsächlichen Entscheidungsbedarf; die Reliability-Grenze liegt darin, dass eine unpragmatische, vollständige Methodenanwendung für jede Entscheidung die Methode selbst zum Hindernis für schnelle, gute Architekturentscheidungen werden lässt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine TOGAF-Einführung wird von Teams als bürokratisches Hindernis statt als hilfreiche Methode wahrgenommen | die ADM wird vollständig und formal statt pragmatisch angepasst angewendet | die Methodenanwendung explizit auf den tatsächlichen Entscheidungsbedarf zuschneiden (Tailoring) |
| kleine, risikoarme Architekturentscheidungen dauern unangemessen lange | ein zu schwergewichtiger Governance-Prozess wird unabhängig vom tatsächlichen Risiko angewendet | die Governance-Dimensionierung proportional zu Risiko und Umfang der Entscheidung gestalten |
| eine große, organisationsweite Transformation verläuft chaotisch und inkonsistent | eine zu leichtgewichtige, unstrukturierte Methodenanwendung wurde für eine tatsächlich komplexe Entscheidung gewählt | für organisationsweite Transformationen eine vollständigere ADM-Anwendung mit entsprechenden Artefakten einsetzen |

Security: Governance-Prozesse für sicherheitsrelevante Architekturentscheidungen sollten unabhängig von der allgemeinen Pragmatisierung ausreichend gründlich bleiben. Observability: Die tatsächliche Nutzung und wahrgenommene Hilfsfähigkeit der Methode durch die beteiligten Architekten und Entscheidungsträger ist ein zentrales Signal zur Bewertung, ob die Methodenanwendung tatsächlich pragmatisch statt formalistisch erfolgt.

## Trade-offs und Entscheidungen

**Staff** wendet ausgewählte ADM-Bausteine für eine gegebene, kleine Architekturentscheidung korrekt an. **Principal** entwirft die pragmatische Methodenanwendung (Tailoring) für einen Geschäftsbereich, proportional zu Risiko und Umfang der jeweiligen Entscheidung. **Chief** legt unternehmensweite Standards für den pragmatischen Einsatz von TOGAF-Methodenbausteinen fest.

Anti-Patterns: die vollständige ADM mit allen Phasen und Artefakten unreflektiert für jede Architekturentscheidung, unabhängig von deren Umfang, anwenden; Governance-Prozesse unabhängig vom tatsächlichen Risiko einheitlich schwergewichtig gestalten; TOGAF als starre, vollständig zu befolgende Vorschrift statt als anpassbaren Werkzeugkasten behandeln.

## Production Checklist

- [ ] Für jeden Architekturentscheidungszyklus ist explizit bewertet, welche ADM-Phasen tatsächlich beitragen.
- [ ] Governance-Prozesse sind proportional zu Risiko und Umfang der jeweiligen Entscheidung dimensioniert.
- [ ] Die Anpassung (Tailoring) der Methode an den organisationalen Kontext ist dokumentiert und begründet.
- [ ] Keine formale Zertifizierung oder vollständige Methodenpraxis wird ohne entsprechenden Beleg behauptet.

## Interviewfragen

### 1. Was bedeutet "Tailoring" im Kontext der TOGAF ADM?

**Antwort:** Die bewusste Anpassung der Architecture Development Method an den tatsächlichen organisationalen Kontext, statt sie als starre, vollständig zu befolgende Checkliste zu behandeln.

### 2. Warum sollte nicht jede Architekturentscheidung den vollständigen ADM-Zyklus durchlaufen?

**Antwort:** Weil kleine, klar umrissene Entscheidungen typischerweise nicht den vollständigen, formalen Zyklus mit allen Artefakten benötigen, während eine unpragmatische, vollständige Anwendung die Methode selbst zum Hindernis für schnelle, gute Entscheidungen werden lässt.

### 3. Wie sollte die Dimensionierung von Governance-Prozessen (etwa eines Architecture Review Board) erfolgen?

**Antwort:** Proportional zu Risiko und Umfang der jeweiligen Architekturentscheidung, nicht einheitlich für alle Entscheidungen gleich schwergewichtig.

### 4. Welche methodische Haltung wird für den Einsatz von TOGAF in diesem Kapitel empfohlen?

**Antwort:** TOGAF als Werkzeugkasten zu behandeln, aus dem für jeden konkreten Entscheidungszyklus die tatsächlich passenden Bausteine ausgewählt werden, statt das gesamte Framework als monolithische Vorschrift zu behandeln.

### 5. Wie gehst du vor, wenn eine TOGAF-Einführung von Teams als bürokratisches Hindernis wahrgenommen wird?

**Antwort:** Ich prüfe, ob die ADM vollständig und formal statt pragmatisch angepasst angewendet wird, und schneide die Methodenanwendung explizit auf den tatsächlichen Entscheidungsbedarf zu.

### 6. Widersprüchliche Anforderung: Architekten wollen methodische Konsistenz durch vollständige ADM-Anwendung für jede Entscheidung UND Geschäftsbereiche wollen schnelle, unbürokratische Architekturentscheidungen — wie gehst du vor?

**Antwort:** Ich würde ein gestaffeltes Governance-Modell einführen, das die vollständige ADM-Anwendung explizit für große, risikoreiche Entscheidungen reserviert, während kleine, risikoarme Entscheidungen über einen bewusst reduzierten, schnelleren Methodenpfad laufen, statt entweder methodische Konsistenz oder Entscheidungsgeschwindigkeit vollständig zu opfern.

## Praktische Labs

~~~python
# Local, deterministic simulation of selecting pragmatic ADM phases per decision scope (executed locally, no real TOGAF tool):

def select_adm_phases(decision_scope, decision_risk):
    full_phases = ["Vision", "Business Architecture", "Data Architecture", "Application Architecture",
                   "Technology Architecture", "Opportunities & Solutions", "Migration Planning"]
    if decision_scope == "small" and decision_risk == "low":
        return full_phases[:2]  # pragmatic minimal subset
    return full_phases  # full cycle for large/high-risk decisions

print("small, low-risk decision:", select_adm_phases("small", "low"))
print("large, high-risk decision:", select_adm_phases("large", "high"))
~~~

## Dependencies, Cross-References und Quellen

1. The Open Group: [TOGAF Standard, 10th Edition — Architecture Development Method (ADM)](https://pubs.opengroup.org/togaf-standard/adm/), abgerufen 2026-09-18.
2. The Open Group: [TOGAF Standard, 10th Edition — Applying the ADM (Tailoring)](https://pubs.opengroup.org/togaf-standard/adm-techniques/), abgerufen 2026-09-18.

Enterprise Architecture als Disziplin ist kanonisch in [KB-0589](01-enterprise-architecture-als-disziplin.md) behandelt; die inhaltlichen Ebenen (Business, Application, Data, Technology Architecture) unabhängig von TOGAF-Notation in den vorherigen Kapiteln dieses Domains.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte, automatische Auswahl pragmatisch passender ADM-Phasen und Artefakte anhand des Entscheidungsumfangs | Evaluating | Als ergänzende Entscheidungshilfe prüfen, jedoch die abschließende Governance-Dimensionierungsentscheidung weiterhin als menschliche, kontextabhängige Entscheidung behandeln. |

Ein Team akzeptiert eine TOGAF-basierte Methodenanwendung erst, wenn die Auswahl der ADM-Phasen und Governance-Mechanismen nachweislich pragmatisch auf den tatsächlichen Entscheidungsbedarf zugeschnitten ist, statt das vollständige Framework unreflektiert zu übernehmen.
