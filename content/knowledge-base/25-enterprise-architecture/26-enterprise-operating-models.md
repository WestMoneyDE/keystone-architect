---
{"id": "KB-0614", "title": "Enterprise Operating Models", "domain": "25", "sequence": 26, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0613", "concepts": ["Architekturgovernance und Entscheidungsrechte"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Zentrale und dezentrale Zuständigkeiten, Services und Entscheidungsforen für ein konkretes Operating Model anhand etablierter Praxis korrekt festlegen und mit tatsächlichen Architekturverantwortungen verbinden können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie ein Enterprise Operating Model die bereits in KB-0613 behandelte Balance aus föderierter Verantwortung und zentraler Auditierbarkeit auf Übergaben, Services und Finanzierung überträgt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine formal definierte Zuständigkeitsverteilung nicht mit der tatsächlichen Finanzierungsstruktur übereinstimmt, und die daraus resultierende, praktische Verantwortungslücke einordnen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Enterprise Operating Models festlegen, die zentrale und dezentrale Zuständigkeiten mit tatsächlicher Finanzierung und Architekturverantwortung konsistent verbinden.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die formale ArchiMate-Notation für Operating-Model-Artefakte im Detail ist Vertiefung.", "rationale": "Kern ist die konsistente Verbindung von Zuständigkeit, Finanzierung und tatsächlicher Architekturverantwortung, nicht eine bestimmte formale Notation."}}, "lab_validation": [{"lab_id": "KB-0614-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Erkennung einer Diskrepanz zwischen formaler Zuständigkeit und tatsächlicher Finanzierung, kein produktives Operating-Model-Tool verwendet", "evidence": "Ein lokales Skript prüft eine Liste von Services darauf, ob die formal benannte, verantwortliche Organisationseinheit auch tatsächlich über ein zugeordnetes Budget für diesen Service verfügt, und markiert Diskrepanzen als praktische Verantwortungslücke.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Operating-Model-Tool."}]}
---
# Enterprise Operating Models

> **Ziel:** Ein Enterprise Operating Model legt fest, welche Zuständigkeiten **zentral** (von einer gemeinsamen, unternehmensweiten Einheit) und welche **dezentral** (von einzelnen Geschäftsbereichen oder Teams eigenständig) wahrgenommen werden, welche **Services** zentral bereitgestellt werden, und über welche **Entscheidungsforen** übergreifende Fragen entschieden werden — dies überträgt die bereits in [KB-0613](25-architekturgovernance-und-entscheidungsrechte.md) behandelte Balance aus föderierter Verantwortung und zentraler Auditierbarkeit von der reinen Architekturgovernance auf die gesamte organisatorische Struktur. Der zentrale Punkt dieses Kapitels ist, dass diese formale Zuständigkeitsverteilung nur dann tatsächlich wirksam ist, wenn sie explizit mit **Übergaben** (wie eine Verantwortung tatsächlich von einer Einheit zur nächsten wechselt) und **Finanzierung** (wer tatsächlich das Budget für eine Zuständigkeit trägt) verbunden wird — eine formal einer Einheit zugeordnete Zuständigkeit ohne entsprechende Finanzierung führt in der Praxis zu einer Verantwortungslücke, da die formal zuständige Einheit die notwendigen Ressourcen zur tatsächlichen Wahrnehmung dieser Verantwortung nicht hat.

## Zweck, Mental Model und Dependencies

Die Verteilung von Zuständigkeiten zwischen zentralen und dezentralen Einheiten folgt demselben strukturellen Prinzip wie die bereits in [KB-0613](25-architekturgovernance-und-entscheidungsrechte.md) behandelte Balance zwischen föderierter Verantwortung und zentraler Auditierbarkeit: Zentrale Zuständigkeiten eignen sich für Fragen, die organisationsweite Konsistenz erfordern (etwa gemeinsame Sicherheitsstandards oder zentral bereitgestellte, geteilte Infrastrukturservices), während dezentrale Zuständigkeiten sich für Fragen eignen, die lokalen Kontext und schnelle, angepasste Entscheidungen erfordern — eine Organisation, die zu viele Zuständigkeiten zentralisiert, riskiert dieselbe zentrale Kontrollüberlastung, die bereits im Kontext der Architekturgovernance behandelt wurde, während eine Organisation, die zu viele Zuständigkeiten dezentralisiert, organisationsweite Konsistenz und Skaleneffekte verliert. Der entscheidende, praktische Mechanismus, der diese formale Zuständigkeitsverteilung tatsächlich wirksam macht, ist die Verbindung mit Finanzierung: Eine Zuständigkeit, die formal einer Organisationseinheit zugeordnet ist, aber deren Finanzierung tatsächlich bei einer anderen Einheit liegt oder gar nicht explizit zugeordnet ist, führt zu einer praktischen Verantwortungslücke — die formal zuständige Einheit kann die notwendigen Ressourcen (Personal, Werkzeuge, Infrastruktur) zur tatsächlichen Wahrnehmung dieser Zuständigkeit nicht bereitstellen, wodurch die formal existierende Zuständigkeitszuordnung praktisch wirkungslos bleibt. Übergaben zwischen zentralen und dezentralen Einheiten (etwa wenn eine zentral entwickelte, geteilte Plattform an dezentrale Teams zur eigenständigen Nutzung übergeben wird) benötigen ebenfalls eine explizite, dokumentierte Klärung: Welche Verantwortung verbleibt bei der zentralen Einheit (etwa die grundlegende Plattformwartung), und welche Verantwortung geht tatsächlich an die dezentrale Einheit über (etwa die konkrete Konfiguration und Nutzung) — eine unklare Übergabe führt typischerweise dazu, dass beide Seiten annehmen, die jeweils andere Seite sei für ein bestimmtes Problem zuständig, wodurch tatsächliche Probleme unbearbeitet bleiben.

~~~text
Enterprise Operating Model: defines which responsibilities CENTRAL (shared, org-wide unit)
  vs DECENTRAL (individual business units/teams independently)
  which SERVICES provided centrally, which DECISION FORUMS decide cross-cutting questions
  -> transfers KB-0613's federated-responsibility/central-auditability balance
     from pure architecture governance to WHOLE org structure
KEY POINT: this formal responsibility distribution only actually effective when explicitly connected to
  HANDOFFS (how responsibility actually transitions from one unit to next)
  and FUNDING (who actually carries the budget for a responsibility)
  responsibility formally assigned to a unit WITHOUT corresponding funding
  -> practical RESPONSIBILITY GAP: formally-responsible unit lacks necessary resources
     to actually exercise that responsibility
CENTRAL vs DECENTRAL follows same structural principle as KB-0613's balance:
  central responsibilities suit questions needing org-wide consistency
    (shared security standards, centrally-provided shared infra services)
  decentral responsibilities suit questions needing local context + fast, adapted decisions
  org centralizing too much -> risks same central control overload from architecture governance context
  org decentralizing too much -> loses org-wide consistency + scale effects
DECISIVE, PRACTICAL mechanism making formal responsibility distribution actually effective: FUNDING LINK
  responsibility formally assigned to org unit, but funding actually sits w/ different unit or unassigned
  -> practical responsibility gap
  formally-responsible unit CANNOT provide necessary resources (staff, tools, infra)
    to actually exercise that responsibility -> formal assignment stays practically ineffective
HANDOFFS between central+decentral units also need explicit, documented clarification
  (e.g. centrally-developed shared platform handed off to decentral teams for independent use)
  which responsibility STAYS w/ central unit (basic platform maintenance)
  which responsibility ACTUALLY transfers to decentral unit (concrete config+usage)
  unclear handoff -> typically both sides assume OTHER side responsible for a given problem
    -> actual problems stay unaddressed
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Zentrale Zuständigkeit | organisationsweite Konsistenz, gemeinsame Services | passend für Fragen mit übergreifender Relevanz |
| Dezentrale Zuständigkeit | lokaler Kontext, schnelle, angepasste Entscheidungen | passend für Fragen ohne organisationsweite Standardisierungsnotwendigkeit |
| Finanzierungsverknüpfung | verbindet formale Zuständigkeit mit tatsächlichem Budget | verhindert praktische Verantwortungslücken |
| Explizite Übergabe | klärt, welche Verantwortung wechselt und welche verbleibt | verhindert unbearbeitete Probleme durch gegenseitige Zuständigkeitsannahme |

Implementierung: Jede Zuständigkeit wird explizit als zentral oder dezentral klassifiziert, mit expliziter Begründung anhand des Bedarfs an organisationsweiter Konsistenz. Jede formale Zuständigkeitszuordnung wird mit einer entsprechenden Finanzierungszuordnung verknüpft und regelmäßig auf Konsistenz geprüft. Übergaben zwischen zentralen und dezentralen Einheiten werden explizit dokumentiert, mit klarer Benennung der verbleibenden und der übergehenden Verantwortung.

## Scalability, Reliability, Security und Observability

Enterprise Operating Models skalieren die tatsächliche organisatorische Wirksamkeit proportional zur Konsistenz zwischen formaler Zuständigkeit, tatsächlicher Finanzierung und expliziter Übergabeklärung; die Reliability-Grenze liegt darin, dass eine Diskrepanz zwischen formaler Zuständigkeit und tatsächlicher Finanzierung zu praktischen Verantwortungslücken führt, unabhängig von der formalen Vollständigkeit der Zuständigkeitsdokumentation.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine formal zuständige Einheit kann eine Verantwortung praktisch nicht wahrnehmen | die Finanzierung für diese Zuständigkeit ist nicht tatsächlich bei dieser Einheit verankert | die Finanzierungszuordnung explizit mit der formalen Zuständigkeit abgleichen und korrigieren |
| ein Problem an der Schnittstelle zwischen zentraler und dezentraler Einheit bleibt unbearbeitet | die Übergabe zwischen den Einheiten wurde nicht explizit dokumentiert | eine explizite Übergabedokumentation mit klarer Benennung verbleibender und übergehender Verantwortung einführen |
| eine zentrale Einheit wird zum Engpass für organisationsweite Entscheidungen | zu viele Zuständigkeiten wurden zentralisiert, ohne den tatsächlichen Bedarf an Konsistenz zu prüfen | die Zuständigkeitsverteilung anhand des tatsächlichen Konsistenzbedarfs überprüfen und dezentralisieren, wo angemessen |

Security: Sicherheitsrelevante Zuständigkeiten sollten explizit mit entsprechender Finanzierung verknüpft sein, da eine formal zugeordnete, aber unfinanzierte Sicherheitsverantwortung ein erhebliches, unentdecktes Risiko darstellt. Observability: Die tatsächliche Konsistenz zwischen formaler Zuständigkeitszuordnung und tatsächlicher Finanzierung ist ein zentrales Signal zur Bewertung der praktischen Wirksamkeit eines Operating Models.

## Trade-offs und Entscheidungen

**Staff** setzt eine gegebene, dezentrale Zuständigkeit innerhalb des definierten Operating Models korrekt um. **Principal** entwirft die vollständige Zuständigkeitsverteilung mit Finanzierungsverknüpfung und Übergabeklärung für einen Geschäftsbereich. **Chief** legt das unternehmensweite Operating Model fest, das zentrale und dezentrale Zuständigkeiten mit tatsächlicher Finanzierung konsistent verbindet.

Anti-Patterns: eine Zuständigkeit formal zuordnen, ohne die entsprechende Finanzierung zu verankern; Übergaben zwischen zentralen und dezentralen Einheiten ohne explizite Dokumentation vollziehen; zu viele Zuständigkeiten zentralisieren, ohne den tatsächlichen Bedarf an organisationsweiter Konsistenz zu prüfen.

## Production Checklist

- [ ] Jede Zuständigkeit ist explizit als zentral oder dezentral klassifiziert, mit Begründung.
- [ ] Jede formale Zuständigkeitszuordnung ist mit einer entsprechenden Finanzierungszuordnung verknüpft.
- [ ] Übergaben zwischen zentralen und dezentralen Einheiten sind explizit dokumentiert.
- [ ] Die Konsistenz zwischen Zuständigkeit und Finanzierung wird regelmäßig überprüft.

## Interviewfragen

### 1. Warum reicht eine formal zugeordnete Zuständigkeit ohne entsprechende Finanzierung nicht aus?

**Antwort:** Weil die formal zuständige Einheit ohne die notwendigen Ressourcen (Budget, Personal, Werkzeuge) diese Verantwortung praktisch nicht wahrnehmen kann, wodurch eine praktische Verantwortungslücke entsteht.

### 2. Welches Prinzip bestimmt, ob eine Zuständigkeit zentral oder dezentral organisiert werden sollte?

**Antwort:** Fragen mit Bedarf an organisationsweiter Konsistenz eignen sich für zentrale Zuständigkeit, während Fragen mit Bedarf an lokalem Kontext und schnellen, angepassten Entscheidungen sich für dezentrale Zuständigkeit eignen.

### 3. Was passiert, wenn eine Übergabe zwischen zentraler und dezentraler Einheit nicht explizit dokumentiert wird?

**Antwort:** Typischerweise nehmen beide Seiten an, die jeweils andere Seite sei für ein bestimmtes Problem zuständig, wodurch tatsächliche Probleme unbearbeitet bleiben.

### 4. Was passiert, wenn eine Organisation zu viele Zuständigkeiten zentralisiert?

**Antwort:** Sie riskiert dieselbe zentrale Kontrollüberlastung, die bereits im Kontext der Architekturgovernance behandelt wurde, bei der die zentrale Einheit zum Engpass für organisationsweite Entscheidungen wird.

### 5. Wie gehst du vor, wenn eine formal zuständige Einheit eine Verantwortung praktisch nicht wahrnehmen kann?

**Antwort:** Ich prüfe, ob die Finanzierung für diese Zuständigkeit tatsächlich bei dieser Einheit verankert ist, und korrigiere die Finanzierungszuordnung entsprechend.

### 6. Widersprüchliche Anforderung: Die Geschäftsführung will maximale organisationsweite Konsistenz durch Zentralisierung UND Geschäftsbereiche wollen maximale lokale Entscheidungsfreiheit — wie gehst du vor?

**Antwort:** Ich würde nur die Zuständigkeiten zentralisieren, die tatsächlich organisationsweite Konsistenz erfordern (etwa Sicherheitsstandards), mit expliziter Finanzierungsverknüpfung, während alle anderen Zuständigkeiten dezentral mit klar dokumentierten Grenzen verbleiben, statt entweder vollständige Zentralisierung oder vollständige Dezentralisierung zu erzwingen.

## Praktische Labs

~~~python
# Local, deterministic simulation of detecting a responsibility-funding mismatch (executed locally, no real operating model tool):

def check_responsibility_funding(assignments):
    results = []
    for a in assignments:
        gap = a["responsible_unit"] != a["funded_unit"]
        results.append({"service": a["service"], "responsibility_gap": gap})
    return results

assignments = [
    {"service": "Shared Identity Platform", "responsible_unit": "Platform Team", "funded_unit": "Platform Team"},
    {"service": "Regional Compliance Reporting", "responsible_unit": "Regional Team", "funded_unit": "Central Finance"},
]

for r in check_responsibility_funding(assignments):
    print(r)
~~~

## Dependencies, Cross-References und Quellen

1. The Open Group: [TOGAF Standard, 10th Edition — Organizational Structures](https://pubs.opengroup.org/togaf-standard/introduction/), abgerufen 2026-09-18.
2. MIT Center for Information Systems Research: [Enterprise Operating Model Framework](https://cisr.mit.edu/publication/enterprise-architecture-operating-model), abgerufen 2026-09-18.

Architekturgovernance und Entscheidungsrechte sind kanonisch in [KB-0613](25-architekturgovernance-und-entscheidungsrechte.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Abgleichung von Zuständigkeits- und Finanzierungsdaten aus Personal- und Budgetsystemen zur frühzeitigen Erkennung von Verantwortungslücken | Evaluating | Als ergänzendes Frühwarnsystem einsetzen, jedoch die abschließende Entscheidung über Zuständigkeits- und Finanzierungsanpassungen weiterhin als bewusste, menschliche Organisationsentscheidung behandeln. |

Ein Team akzeptiert ein Enterprise Operating Model erst, wenn Zuständigkeiten nachweislich mit tatsächlicher Finanzierung verknüpft sind und Übergaben zwischen zentralen und dezentralen Einheiten explizit dokumentiert sind.
