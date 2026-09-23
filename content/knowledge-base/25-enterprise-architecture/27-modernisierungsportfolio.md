---
{"id": "KB-0615", "title": "Modernisierungsportfolio", "domain": "25", "sequence": 27, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0601", "concepts": ["Application Portfolio Management"], "needed_for": "understanding"}, {"id": "KB-0594", "concepts": ["Capability Mapping"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Technische Risiken und Geschäftsfähigkeiten zu einem konkreten Modernisierungsprogramm bündeln und Abhängigkeiten sowie Sequenzierung anhand konsistenter Portfolioevidenz priorisieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Erkenntnisse aus Application Portfolio Management (KB-0601) und Capability Mapping (KB-0594) zu priorisierten, sequenzierten Modernisierungsprogrammen mit expliziter Abhängigkeitsauflösung gebündelt werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine geplante Modernisierungsmaßnahme in falscher Reihenfolge zu einer anderen, tatsächlich abhängigen Maßnahme angesetzt wurde, und die notwendige Sequenzkorrektur ableiten können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Modernisierungsportfolio-Priorisierung festlegen, die technische Risikobewertung, Geschäftsfähigkeitsrelevanz und Abhängigkeitssequenzierung konsistent verbinden.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte technische Durchführung einzelner Modernisierungsmaßnahmen ist bereits in den jeweiligen technischen Domains dieses Curriculums behandelt.", "rationale": "Kern ist die Portfolio-Priorisierung und Sequenzierung von Modernisierungsmaßnahmen, nicht deren technische Durchführung."}}, "lab_validation": [{"lab_id": "KB-0615-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Sequenzierung von Modernisierungsmaßnahmen anhand von Abhängigkeiten, kein produktives Portfolio-Tool verwendet", "evidence": "Ein lokales Skript prüft eine Liste geplanter Modernisierungsmaßnahmen auf Abhängigkeiten untereinander und ermittelt eine gültige, abhängigkeitskonforme Sequenzierung statt einer willkürlichen oder rein prioritätsbasierten Reihenfolge.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Portfolio-Tool."}]}
---
# Modernisierungsportfolio

> **Ziel:** Ein Modernisierungsportfolio bündelt technische Risiken (aus der bereits in [KB-0601](13-application-portfolio-management.md) behandelten Application-Portfolio-Bewertung) und Geschäftsfähigkeitsrelevanz (aus der bereits in [KB-0594](06-capability-mapping.md) behandelten Fähigkeitskarte) zu priorisierten **Modernisierungsprogrammen** — statt einzelne Anwendungen isoliert zu modernisieren, werden zusammenhängende Modernisierungsmaßnahmen, die dieselbe Geschäftsfähigkeit betreffen oder voneinander technisch abhängen, gemeinsam geplant. Der zentrale Punkt dieses Kapitels ist, dass diese Priorisierung eine explizite **Sequenzierung** anhand tatsächlicher **Abhängigkeiten** erfordert — eine Modernisierungsmaßnahme, die von einer anderen, noch nicht abgeschlossenen Maßnahme technisch abhängt, kann nicht unabhängig davon priorisiert und terminiert werden, da eine falsche Reihenfolge zu blockierten, nicht durchführbaren Maßnahmen oder zu doppelter, verschwendeter Arbeit führt.

## Zweck, Mental Model und Dependencies

Die Bündelung technischer Risiken und Geschäftsfähigkeitsrelevanz zu einem gemeinsamen Modernisierungsprogramm ist wertvoller als eine isolierte Priorisierung einzelner Anwendungen, weil sie zusammenhängende Investitionsentscheidungen ermöglicht: Mehrere Anwendungen, die alle zur selben, kritischen Geschäftsfähigkeit (siehe [KB-0594](06-capability-mapping.md)) beitragen und gleichzeitig hohe technische Risiken (siehe die bereits in [KB-0601](13-application-portfolio-management.md) behandelte Nutzen-Risiko-Kosten-Bewertung) aufweisen, rechtfertigen ein gemeinsames, koordiniertes Modernisierungsprogramm statt mehrerer, isolierter Einzelinitiativen, die möglicherweise widersprüchliche oder redundante technische Entscheidungen treffen. Die Sequenzierung anhand tatsächlicher Abhängigkeiten ist der entscheidende, praktische Mechanismus, der ein Modernisierungsportfolio von einer bloßen, priorisierten Liste unterscheidet: Wenn eine geplante Modernisierungsmaßnahme (etwa die Migration eines Anwendungsdienstes auf eine neue Zielplattform, siehe die bereits in [KB-0593](05-technology-architecture.md) behandelte Technology Architecture) tatsächlich von einer anderen, noch nicht abgeschlossenen Maßnahme abhängt (etwa der vorherigen Migration einer zugrunde liegenden Datenbank), kann diese Maßnahme nicht unabhängig terminiert werden — eine Priorisierung, die nur nach Risiko und Nutzen sortiert, aber diese Abhängigkeiten ignoriert, kann zu einer Reihenfolge führen, bei der eine hochpriorisierte Maßnahme tatsächlich blockiert ist, weil eine niedriger priorisierte, aber technisch vorausgesetzte Maßnahme noch nicht abgeschlossen wurde. Die praktische Konsequenz ist, dass ein Modernisierungsportfolio zwei Dimensionen gleichzeitig berücksichtigen muss: die reine Priorität (basierend auf Risiko, Nutzen und Geschäftsfähigkeitsrelevanz) und die technische Abhängigkeitsreihenfolge (welche Maßnahme technisch vor welcher anderen abgeschlossen sein muss) — eine gültige Sequenzierung respektiert beide Dimensionen gleichzeitig, priorisiert innerhalb der durch Abhängigkeiten erzwungenen Reihenfolge nach tatsächlicher Wichtigkeit, statt eine Reihenfolge zu erzwingen, die technisch nicht durchführbar ist.

~~~text
Modernization Portfolio: bundles technical risks (KB-0601 app portfolio assessment)
  + business capability relevance (KB-0594 capability map) into prioritized MODERNIZATION PROGRAMS
  instead of modernizing individual apps in isolation
  -> jointly plans related modernization measures affecting same capability or technically depending on each other
KEY POINT: this prioritization requires explicit SEQUENCING based on ACTUAL DEPENDENCIES
  modernization measure technically depending on another, not-yet-completed measure
  -> cannot be independently prioritized+scheduled
  wrong order -> blocked, non-executable measures OR duplicate, wasted work
BUNDLING technical risk + capability relevance more valuable than isolated app prioritization
  -> enables COORDINATED investment decisions
  multiple apps all contributing to same critical capability (KB-0594) AND showing high technical risk
    (KB-0601 benefit-risk-cost assessment)
  justify JOINT, coordinated modernization program instead of several isolated initiatives
    possibly making contradictory or redundant technical decisions
SEQUENCING based on actual dependencies = decisive mechanism distinguishing modernization PORTFOLIO
  from a mere prioritized LIST
  planned measure (e.g. migrating an app service to new target platform, KB-0593)
  ACTUALLY depending on another, not-yet-completed measure (e.g. prior migration of underlying database)
  -> cannot be independently scheduled
  prioritization sorting ONLY by risk/benefit, IGNORING dependencies
  -> can produce order where high-priority measure is actually BLOCKED
     because lower-priority but technically prerequisite measure not yet completed
PRACTICAL CONSEQUENCE: modernization portfolio must consider TWO dimensions simultaneously
  pure priority (risk, benefit, capability relevance)
  AND technical dependency order (which measure must technically complete before which other)
  valid sequencing respects BOTH simultaneously
    prioritizes WITHIN dependency-enforced order by actual importance
    instead of forcing an order that's technically not executable
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Modernisierungsprogramm | bündelt zusammenhängende Maßnahmen statt isolierter Einzelinitiativen | ermöglicht koordinierte, konsistente Investitionsentscheidungen |
| Technisches Risiko | aus Application-Portfolio-Bewertung übernommen | Priorisierungsdimension |
| Geschäftsfähigkeitsrelevanz | aus Capability Mapping übernommen | Priorisierungsdimension |
| Abhängigkeitssequenzierung | erzwungene Reihenfolge durch technische Voraussetzungen | verhindert blockierte oder verschwendete Maßnahmen |

Implementierung: Modernisierungsmaßnahmen aus dem Application Portfolio werden nach ihrer Beziehung zu Geschäftsfähigkeiten aus dem Capability Mapping gruppiert. Technische Abhängigkeiten zwischen Maßnahmen werden explizit erfasst. Die Priorisierung erfolgt zweistufig: zunächst wird eine gültige, abhängigkeitskonforme Reihenfolge ermittelt, danach werden Maßnahmen innerhalb dieser erzwungenen Reihenfolge nach Risiko, Nutzen und Geschäftsfähigkeitsrelevanz priorisiert.

## Scalability, Reliability, Security und Observability

Ein Modernisierungsportfolio skaliert die tatsächliche Wirksamkeit von Modernisierungsinvestitionen proportional zur Konsequenz der Abhängigkeitssequenzierung; die Reliability-Grenze liegt darin, dass eine Priorisierung, die tatsächliche technische Abhängigkeiten ignoriert, zu blockierten, nicht durchführbaren oder doppelt durchgeführten Maßnahmen führen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine hochpriorisierte Modernisierungsmaßnahme kann nicht wie geplant begonnen werden | die Maßnahme hängt technisch von einer niedriger priorisierten, noch nicht abgeschlossenen Maßnahme ab | die Abhängigkeitsstruktur explizit erfassen und die Sequenzierung entsprechend anpassen |
| mehrere isolierte Modernisierungsinitiativen treffen widersprüchliche technische Entscheidungen für dieselbe Geschäftsfähigkeit | die Maßnahmen wurden nicht zu einem gemeinsamen, koordinierten Modernisierungsprogramm gebündelt | zusammenhängende Maßnahmen anhand von Geschäftsfähigkeit und technischer Abhängigkeit zu einem Programm bündeln |
| eine Modernisierungspriorisierung wird als willkürlich oder nicht nachvollziehbar wahrgenommen | die Priorisierung berücksichtigt nur eine Dimension (etwa reines Risiko) ohne Geschäftsfähigkeitsrelevanz oder Abhängigkeiten | die Priorisierung explizit auf Risiko, Geschäftsfähigkeitsrelevanz und Abhängigkeitssequenzierung gemeinsam stützen |

Security: Modernisierungsmaßnahmen, die sicherheitskritische Altsysteme betreffen, sollten in der Priorisierung besonders berücksichtigt werden, unabhängig von rein geschäftlicher Priorität. Observability: Die tatsächliche Einhaltung der geplanten Sequenzierung (wie oft Maßnahmen tatsächlich in der geplanten, abhängigkeitskonformen Reihenfolge durchgeführt werden) ist ein zentrales Signal zur Bewertung der Portfolio-Planungsqualität.

## Trade-offs und Entscheidungen

**Staff** ordnet eine gegebene Modernisierungsmaßnahme korrekt in ein bestehendes Programm ein und beachtet dessen Abhängigkeiten. **Principal** entwirft das vollständige Modernisierungsportfolio mit Programmbündelung und Abhängigkeitssequenzierung für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für Modernisierungsportfolio-Priorisierung fest.

Anti-Patterns: Modernisierungsmaßnahmen isoliert nach Anwendung statt gebündelt nach Geschäftsfähigkeit und technischer Abhängigkeit priorisieren; eine Priorisierung ausschließlich nach Risiko oder Nutzen ohne Berücksichtigung technischer Abhängigkeiten vornehmen; mehrere, tatsächlich zusammenhängende Modernisierungsinitiativen unkoordiniert parallel durchführen.

## Production Checklist

- [ ] Modernisierungsmaßnahmen sind nach Geschäftsfähigkeit und technischer Abhängigkeit zu Programmen gebündelt.
- [ ] Technische Abhängigkeiten zwischen Maßnahmen sind explizit erfasst.
- [ ] Die Sequenzierung respektiert erzwungene Abhängigkeitsreihenfolgen vor reiner Prioritätssortierung.
- [ ] Die tatsächliche Einhaltung der geplanten Sequenzierung wird überwacht.

## Interviewfragen

### 1. Warum ist die Bündelung von Modernisierungsmaßnahmen zu Programmen wertvoller als isolierte Einzelpriorisierung?

**Antwort:** Weil sie koordinierte, konsistente Investitionsentscheidungen für zusammenhängende Maßnahmen ermöglicht, statt mehrerer, isolierter Initiativen, die möglicherweise widersprüchliche technische Entscheidungen treffen.

### 2. Warum reicht eine Priorisierung nur nach Risiko und Nutzen für ein Modernisierungsportfolio nicht aus?

**Antwort:** Weil sie technische Abhängigkeiten ignorieren kann, wodurch eine hochpriorisierte Maßnahme tatsächlich blockiert sein kann, weil eine niedriger priorisierte, aber technisch vorausgesetzte Maßnahme noch nicht abgeschlossen wurde.

### 3. Welche zwei Dimensionen muss eine gültige Sequenzierung gleichzeitig berücksichtigen?

**Antwort:** Die reine Priorität (Risiko, Nutzen, Geschäftsfähigkeitsrelevanz) und die technische Abhängigkeitsreihenfolge, wobei die Priorisierung innerhalb der erzwungenen Abhängigkeitsreihenfolge erfolgt.

### 4. Was passiert, wenn zusammenhängende Modernisierungsmaßnahmen nicht gebündelt, sondern isoliert durchgeführt werden?

**Antwort:** Sie können widersprüchliche oder redundante technische Entscheidungen treffen, da keine koordinierte Planung über die zusammenhängenden Maßnahmen hinweg stattfindet.

### 5. Wie gehst du vor, wenn eine hochpriorisierte Modernisierungsmaßnahme nicht wie geplant begonnen werden kann?

**Antwort:** Ich prüfe, ob die Maßnahme technisch von einer niedriger priorisierten, noch nicht abgeschlossenen Maßnahme abhängt, und passe die Sequenzierung entsprechend an, statt die Maßnahme unabhängig von dieser Abhängigkeit zu terminieren.

### 6. Widersprüchliche Anforderung: Geschäftsbereiche wollen ihre jeweils dringendsten Modernisierungsmaßnahmen sofort priorisieren UND die Organisation will eine konsistente, abhängigkeitskonforme Gesamtsequenzierung — wie gehst du vor?

**Antwort:** Ich würde eine zweistufige Priorisierung etablieren, die zunächst eine gültige, abhängigkeitskonforme Grundreihenfolge ermittelt und innerhalb dieser Reihenfolge die jeweils dringendsten Maßnahmen der Geschäftsbereiche bevorzugt behandelt, statt entweder Abhängigkeiten zu ignorieren oder lokale Dringlichkeit vollständig zu übergehen.

## Praktische Labs

~~~python
# Local, deterministic simulation of dependency-aware sequencing of modernization measures (executed locally, no real portfolio tool):

def sequence_with_dependencies(measures):
    completed = set()
    sequence = []
    remaining = measures.copy()
    while remaining:
        ready = [m for m in remaining if all(dep in completed for dep in m["depends_on"])]
        if not ready:
            raise ValueError("circular or unresolvable dependency")
        ready.sort(key=lambda m: -m["priority"])
        next_measure = ready[0]
        sequence.append(next_measure["name"])
        completed.add(next_measure["name"])
        remaining.remove(next_measure)
    return sequence

measures = [
    {"name": "migrate_database", "depends_on": [], "priority": 5},
    {"name": "migrate_app_service", "depends_on": ["migrate_database"], "priority": 9},
    {"name": "decommission_legacy_reporting", "depends_on": ["migrate_app_service"], "priority": 3},
]

print(sequence_with_dependencies(measures))
~~~

## Dependencies, Cross-References und Quellen

1. The Open Group: [TOGAF Standard, 10th Edition — Migration Planning](https://pubs.opengroup.org/togaf-standard/introduction/), abgerufen 2026-09-18.
2. Gartner-Referenzmodell: [Application Modernization Strategy Framework](https://www.gartner.com/en/information-technology/glossary/application-modernization), abgerufen 2026-09-18.

Application Portfolio Management ist kanonisch in [KB-0601](13-application-portfolio-management.md) behandelt; Capability Mapping in [KB-0594](06-capability-mapping.md); Technology Architecture in [KB-0593](05-technology-architecture.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, graphbasierte Sequenzierungsoptimierung, die Abhängigkeiten und Priorität rechnerisch kombiniert, statt manuell erstellter Roadmaps | Evaluating | Als Unterstützungswerkzeug für die Erstellung einer ersten, gültigen Sequenzierung einsetzen, jedoch die abschließende, geschäftliche Priorisierungsentscheidung weiterhin menschlich treffen lassen. |

Ein Team akzeptiert ein Modernisierungsportfolio erst, wenn Maßnahmen nachweislich nach Geschäftsfähigkeit und technischer Abhängigkeit gebündelt sind und die Sequenzierung erzwungene Abhängigkeiten konsistent respektiert.
