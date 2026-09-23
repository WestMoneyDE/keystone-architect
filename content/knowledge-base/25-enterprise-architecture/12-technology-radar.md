---
{"id": "KB-0600", "title": "Technology Radar", "domain": "25", "sequence": 12, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0599", "concepts": ["Technologiestandards und Kataloge"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Technology Radar mit Reife-, Organisationspassungs- und Evidenzbewertung anhand etablierter Praxis korrekt pflegen und regelmäßig überprüfen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Evidenz, Reviewrhythmus und Adoption-Kriterien einen Technology Radar transparent und nachvollziehbar von einer bloßen, unbelegten Trendsammlung unterscheiden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Technologie im Radar ohne tatsächliche Evidenz (nur aufgrund allgemeiner Marktaufmerksamkeit) hoch eingestuft wird, und dies als unbelegte Trendaufnahme statt als fundierte Bewertung einordnen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Technology-Radar-Pflege festlegen, die Evidenzpflicht und regelmäßigen Reviewrhythmus verbindlich machen, um den Radar von einer bloßen Trendsammlung abzugrenzen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte technische Evaluierung einzelner, im Radar erfasster Technologien ist bereits in den jeweiligen technischen Domains dieses Curriculums behandelt.", "rationale": "Kern ist die Struktur, Evidenzpflicht und Reviewpraxis eines Technology Radar, nicht die technische Detailbewertung einzelner Technologien."}}, "lab_validation": [{"lab_id": "KB-0600-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Unterscheidung evidenzbasierter und unbelegter Radar-Einträge, kein produktives Technology-Radar-Tool verwendet", "evidence": "Ein lokales Skript prüft eine Liste von Technology-Radar-Einträgen darauf, ob eine dokumentierte Evidenzquelle (etwa ein internes Pilotprojekt oder eine konkrete Organisationspassungsbewertung) vorliegt, und markiert Einträge ohne solche Evidenz als unbelegte Trendaufnahme statt als fundierte Bewertung.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Technology-Radar-Tool."}]}
---
# Technology Radar

> **Ziel:** Ein Technology Radar beobachtet aufkommende und sich entwickelnde Technologien nach ihrer **Reife** und ihrer **Organisationspassung** (wie gut eine Technologie tatsächlich zu den konkreten Bedürfnissen und Rahmenbedingungen der eigenen Organisation passt) — und ergänzt damit den bereits in [KB-0599](11-technologiestandards-und-kataloge.md) behandelten Technologiekatalog um eine vorausschauende, explorative Perspektive auf Technologien, die noch nicht offiziell klassifiziert sind. Der zentrale Punkt dieses Kapitels ist, dass ein Technology Radar nur dann einen tatsächlichen Mehrwert gegenüber einer bloßen, unbelegten Trendsammlung bietet, wenn jede Positionierung im Radar auf nachvollziehbarer **Evidenz** (etwa einem internen Pilotprojekt, einer konkreten Organisationspassungsbewertung, nicht nur allgemeiner Marktaufmerksamkeit) beruht und der Radar über einen definierten **Reviewrhythmus** regelmäßig aktualisiert wird — ein Radar, der Technologien allein aufgrund allgemeiner Marktpopularität positioniert, ohne organisationsspezifische Evidenz, liefert keine belastbare Entscheidungsgrundlage, sondern lediglich eine Zusammenfassung externer Trendberichte.

## Zweck, Mental Model und Dependencies

Die Unterscheidung zwischen Reife und Organisationspassung ist methodisch zentral: Reife beschreibt, wie ausgereift eine Technologie im Allgemeinen ist (Stabilität, Community-Unterstützung, Dokumentationsqualität), während Organisationspassung beschreibt, wie gut diese Technologie tatsächlich zu den spezifischen, konkreten Bedürfnissen, bestehenden Fähigkeiten und Rahmenbedingungen der eigenen Organisation passt — eine ausgereifte, weit verbreitete Technologie kann dennoch eine schlechte Organisationspassung haben (etwa weil sie nicht zu den bereits in [KB-0599](11-technologiestandards-und-kataloge.md) behandelten Zielplattformen passt oder spezialisierte Fähigkeiten erfordert, die in der Organisation nicht vorhanden sind), während eine noch aufkommende, weniger ausgereifte Technologie für einen spezifischen, gut passenden Anwendungsfall dennoch sinnvoll explorativ eingesetzt werden kann. Die Evidenzpflicht ist der entscheidende, qualitätssichernde Mechanismus eines Technology Radar: Eine Positionierung, die lediglich allgemeine Marktaufmerksamkeit oder Hype widerspiegelt (etwa "diese Technologie wird in vielen externen Berichten diskutiert"), unterscheidet sich fundamental von einer Positionierung, die auf tatsächlicher, organisationsinterner Erfahrung beruht (etwa "ein internes Pilotprojekt hat gezeigt, dass diese Technologie für unseren konkreten Anwendungsfall X gut geeignet ist, mit den beobachteten Einschränkungen Y") — ohne diese explizite Evidenzanforderung verkommt ein Technology Radar zu einer bloßen Zusammenfassung externer Trendberichte, die keine tatsächlich organisationsspezifische Entscheidungsgrundlage liefert. Der Reviewrhythmus stellt sicher, dass der Radar den tatsächlichen, sich ändernden Stand der Technologie und der organisationsinternen Erfahrung widerspiegelt: Eine Technologie, die vor zwei Jahren als "aufkommend, vielversprechend" positioniert wurde, kann inzwischen entweder ausgereift und produktionsreif geworden oder als ungeeignet verworfen worden sein — ein Radar, der nicht regelmäßig aktualisiert wird, zeigt zunehmend veraltete, nicht mehr zutreffende Einschätzungen.

~~~text
Technology Radar: observes emerging/evolving technologies by MATURITY and ORGANIZATION FIT
  (how well a tech actually fits concrete needs/constraints of one's own org)
  complements tech catalog (KB-0599) w/ forward-looking, exploratory view of not-yet-classified technologies
KEY POINT: radar only provides actual value over mere unsubstantiated trend collection
  when every radar POSITION rests on traceable EVIDENCE
    (internal pilot project, concrete org-fit assessment -- NOT just general market attention)
  AND radar is regularly updated via defined REVIEW RHYTHM
  radar positioning tech purely on general market popularity, w/o org-specific evidence
    -> not a reliable decision basis, merely a summary of external trend reports
MATURITY vs ORGANIZATION FIT distinction methodically central:
  maturity = how mature a tech is IN GENERAL (stability, community support, doc quality)
  org fit = how well tech actually fits SPECIFIC, concrete needs/existing capabilities/constraints of own org
  mature, widely-used tech CAN still have poor org fit
    (doesn't match target platforms from KB-0599, or requires specialized skills org lacks)
  still-emerging, less-mature tech CAN still be sensibly explored for a specific, well-fitting use case
EVIDENCE REQUIREMENT = decisive, quality-assuring mechanism of a technology radar
  position reflecting merely general market attention/hype ("discussed in many external reports")
  fundamentally differs from position resting on ACTUAL, org-internal experience
    ("internal pilot showed this tech suits our concrete use case X well, w/ observed limitations Y")
  w/o this explicit evidence requirement -> radar degenerates into mere summary of external trend reports,
    provides no actually org-specific decision basis
REVIEW RHYTHM ensures radar reflects actual, changing state of tech + org-internal experience
  tech positioned "emerging, promising" 2 years ago -> may have since matured to production-ready,
    OR been discarded as unsuitable
  radar not regularly updated -> shows increasingly stale, no-longer-accurate assessments
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Reife | bewertet allgemeine Ausgereiftheit einer Technologie | unabhängig von der spezifischen Organisationseignung |
| Organisationspassung | bewertet Eignung für konkrete, eigene Bedürfnisse | entscheidend für tatsächliche Adoptionsentscheidung |
| Evidenz | dokumentierte, organisationsinterne Erfahrungsgrundlage | unterscheidet fundierte Bewertung von bloßer Trendaufnahme |
| Reviewrhythmus | regelmäßige Aktualisierung des Radars | verhindert veraltete, nicht mehr zutreffende Einschätzungen |

Implementierung: Jede Technologie im Radar wird mit expliziter Reife- und Organisationspassungsbewertung sowie einer dokumentierten Evidenzquelle erfasst. Positionierungen ohne organisationsinterne Evidenz werden explizit als vorläufige, unbelegte Beobachtung statt als fundierte Bewertung gekennzeichnet. Der Radar wird über einen definierten Reviewrhythmus regelmäßig aktualisiert.

## Scalability, Reliability, Security und Observability

Der Technology Radar skaliert die Qualität technologiebezogener Adoptionsentscheidungen proportional zur konsequenten Evidenzanforderung und Regelmäßigkeit des Reviewrhythmus; die Reliability-Grenze liegt darin, dass ein Radar ohne Evidenzpflicht zu einer bloßen, unbelegten Trendsammlung verkommt, die keine tatsächlich organisationsspezifische Entscheidungsgrundlage liefert.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Technologie wird im Radar hoch positioniert, obwohl keine organisationsinterne Erfahrung damit vorliegt | die Positionierung beruht auf allgemeiner Marktaufmerksamkeit statt auf dokumentierter Evidenz | die fehlende Evidenz explizit kennzeichnen und eine belastbare Bewertung durch ein Pilotprojekt anstoßen |
| der Radar zeigt veraltete, nicht mehr zutreffende Einschätzungen | kein regelmäßiger Reviewrhythmus aktualisiert die Positionierungen | einen definierten, verbindlichen Reviewrhythmus einführen |
| eine Adoptionsentscheidung berücksichtigt nur die allgemeine Reife, nicht die tatsächliche Organisationspassung | die Radar-Bewertung trennt Reife und Organisationspassung nicht explizit | beide Dimensionen getrennt bewerten und beide in die Adoptionsentscheidung einbeziehen |

Security: Sicherheitsrelevante Bewertungskriterien (etwa bekannte Schwachstellenhistorie) sollten explizit Teil der Reife- oder Evidenzbewertung im Radar sein. Observability: Die tatsächliche Nutzung des Radars bei realen Adoptionsentscheidungen (statt rein dokumentarische Existenz) ist ein zentrales Signal zur Bewertung seiner praktischen Wirksamkeit.

## Trade-offs und Entscheidungen

**Staff** trägt eine Technologie mit korrekter Reife-, Organisationspassungs- und Evidenzbewertung in den Radar ein. **Principal** entwirft die vollständige Radar-Struktur mit Evidenzanforderungen und Reviewrhythmus für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für Technology-Radar-Pflege fest, die Evidenzpflicht verbindlich machen.

Anti-Patterns: Technologien allein aufgrund allgemeiner Marktpopularität ohne organisationsinterne Evidenz hoch positionieren; einen Radar erstellen, aber nie über einen definierten Reviewrhythmus aktualisieren; Reife und Organisationspassung nicht getrennt bewerten und dadurch eine reife, aber schlecht passende Technologie fälschlich als geeignet einstufen.

## Production Checklist

- [ ] Jede Radar-Position hat eine explizite Reife- und Organisationspassungsbewertung.
- [ ] Jede Radar-Position ist mit einer dokumentierten Evidenzquelle oder explizit als unbelegt gekennzeichnet.
- [ ] Ein definierter Reviewrhythmus aktualisiert den Radar regelmäßig.
- [ ] Adoptionsentscheidungen referenzieren explizit die Radar-Bewertung als Entscheidungsgrundlage.

## Interviewfragen

### 1. Was unterscheidet Reife von Organisationspassung bei der Bewertung einer Technologie im Radar?

**Antwort:** Reife beschreibt die allgemeine Ausgereiftheit einer Technologie, während Organisationspassung beschreibt, wie gut sie tatsächlich zu den spezifischen Bedürfnissen und Rahmenbedingungen der eigenen Organisation passt — beide können unabhängig voneinander variieren.

### 2. Warum ist die Evidenzpflicht der entscheidende Mechanismus eines Technology Radar?

**Antwort:** Weil sie eine Positionierung auf Basis tatsächlicher, organisationsinterner Erfahrung von einer Positionierung unterscheidet, die lediglich allgemeine Marktaufmerksamkeit widerspiegelt, und dadurch verhindert, dass der Radar zu einer bloßen Trendsammlung verkommt.

### 3. Wofür wird ein regelmäßiger Reviewrhythmus benötigt?

**Antwort:** Um sicherzustellen, dass der Radar den tatsächlichen, sich ändernden Stand der Technologie und der organisationsinternen Erfahrung widerspiegelt, statt zunehmend veraltete Einschätzungen zu zeigen.

### 4. Kann eine ausgereifte, weit verbreitete Technologie eine schlechte Organisationspassung haben?

**Antwort:** Ja, etwa wenn sie nicht zu den bestehenden Zielplattformen passt oder spezialisierte Fähigkeiten erfordert, die in der Organisation nicht vorhanden sind.

### 5. Wie gehst du vor, wenn eine Technologie im Radar hoch positioniert ist, obwohl keine organisationsinterne Erfahrung vorliegt?

**Antwort:** Ich kennzeichne die fehlende Evidenz explizit und stoße gegebenenfalls ein internes Pilotprojekt an, um eine belastbare, organisationsspezifische Bewertung zu erhalten, statt die unbelegte Positionierung unverändert zu lassen.

### 6. Widersprüchliche Anforderung: Teams wollen schnell auf neue Markttrends reagieren können UND die Organisation will nur evidenzbasierte, belastbare Technologiebewertungen im Radar führen — wie gehst du vor?

**Antwort:** Ich würde neue, noch unbelegte Trends explizit als vorläufige, evidenzlose Beobachtung mit niedrigerer Priorität aufnehmen, während gezielt kleine, zeitlich begrenzte Pilotprojekte initiiert werden, um für vielversprechende Trends zügig tatsächliche Evidenz zu erzeugen, statt entweder auf schnelle Trendreaktion oder auf Evidenzqualität zu verzichten.

## Praktische Labs

~~~python
# Local, deterministic simulation of distinguishing evidence-based radar entries from mere trend collection (executed locally, no real radar tool):

def classify_radar_entry(entry):
    has_evidence = entry.get("evidence_source") is not None
    return {
        "technology": entry["technology"],
        "classification": "evidence_based" if has_evidence else "unsubstantiated_trend",
    }

entries = [
    {"technology": "TechA", "evidence_source": "internal pilot project Q3 2026"},
    {"technology": "TechB", "evidence_source": None},
]

for e in entries:
    print(classify_radar_entry(e))
~~~

## Dependencies, Cross-References und Quellen

1. Thoughtworks: [Technology Radar — Methodology](https://www.thoughtworks.com/radar/faq), abgerufen 2026-09-18.
2. Gartner-Referenzmodell: [Gartner Hype Cycle Methodology](https://www.gartner.com/en/research/methodologies/gartner-hype-cycle), abgerufen 2026-09-18.

Technologiestandards und Kataloge sind kanonisch in [KB-0599](11-technologiestandards-und-kataloge.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte, automatische Aggregation externer Technologietrends als Ausgangspunkt für Radar-Kandidaten, vor organisationsinterner Evidenzprüfung | Evaluating | Nur als Vorauswahl-Werkzeug für potenzielle Kandidaten nutzen, niemals als Ersatz für die verbindliche, organisationsinterne Evidenzprüfung vor einer tatsächlichen Radar-Positionierung. |

Ein Team akzeptiert einen Technology Radar erst, wenn jede Positionierung nachweislich mit Reife-, Organisationspassungs- und Evidenzbewertung versehen ist und ein regelmäßiger Reviewrhythmus die Aktualität sicherstellt.
