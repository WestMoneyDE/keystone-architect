---
{"id": "KB-0611", "title": "Value Narratives für Architekturvorhaben", "domain": "25", "sequence": 23, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0595", "concepts": ["Value Streams"], "needed_for": "understanding"}, {"id": "KB-0610", "concepts": ["Erfolgskriterien und PoC-Governance"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Value Narrative für ein konkretes Architekturvorhaben anhand etablierter Praxis korrekt formulieren, die Geschäftsnutzen, technische Änderung und messbare Ergebnisse mit expliziten Annahmen und Evidenz verbindet.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Value Narratives auf der bereits in KB-0595 behandelten Value-Stream-Analyse aufbauen, um Architekturentscheidungen nachvollziehbar statt als rein technische Vorteilssammlung zu begründen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Value Narrative unbelegte Annahmen als feststehende Fakten darstellt, statt sie explizit als Annahmen mit dem jeweiligen Evidenzstand zu kennzeichnen, und die Darstellung entsprechend korrigieren können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Value Narratives festlegen, die explizite Trennung von belegten Ergebnissen und unbelegten Annahmen bei Architekturentscheidungen verbindlich machen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Detaillierte, finanzmathematische ROI-Berechnungsmodelle im Detail sind Vertiefung.", "rationale": "Kern ist die transparente Verbindung von Geschäftsnutzen, technischer Änderung und messbaren Ergebnissen mit expliziter Annahmen-/Evidenzkennzeichnung, nicht die finanzmathematische Detailberechnung."}}, "lab_validation": [{"lab_id": "KB-0611-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Trennung belegter Ergebnisse von unbelegten Annahmen in einer Value Narrative, kein produktives EA-Tool verwendet", "evidence": "Ein lokales Skript prüft eine Liste formulierter Nutzenaussagen eines Architekturvorhabens darauf, ob sie mit einer dokumentierten Evidenzquelle (etwa einem gemessenen PoC-Ergebnis) belegt sind, und markiert unbelegte Aussagen explizit als Annahme statt als feststehendes Ergebnis.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales EA-Tool."}]}
---
# Value Narratives für Architekturvorhaben

> **Ziel:** Eine Value Narrative verbindet für ein konkretes Architekturvorhaben drei Elemente explizit miteinander: den **Geschäftsnutzen** (welchen tatsächlichen Wert das Vorhaben für die Organisation erzeugen soll, aufbauend auf der bereits in [KB-0595](07-value-streams.md) behandelten Value-Stream-Analyse), die **technische Änderung** (was konkret verändert wird) und **messbare Ergebnisse** (woran der tatsächliche Erfolg erkennbar sein wird). Der zentrale Punkt dieses Kapitels ist die transparente Trennung zwischen bereits belegter **Evidenz** (etwa ein gemessenes PoC-Ergebnis, siehe die bereits in [KB-0610](22-erfolgskriterien-und-poc-governance.md) behandelte PoC-Governance) und noch unbelegten **Annahmen** — eine Value Narrative, die unbelegte Annahmen als feststehende Fakten darstellt, unterscheidet sich strukturell nicht von einer rein technischen Vorteilssammlung, die Begeisterung für eine Technologie mit tatsächlich belegtem Geschäftsnutzen verwechselt.

## Zweck, Mental Model und Dependencies

Eine rein technische Vorteilssammlung (etwa "diese Technologie ist schneller, skalierbarer und moderner") beschreibt technische Eigenschaften, ohne notwendigerweise zu erklären, welchen tatsächlichen, für die Organisation relevanten Geschäftsnutzen diese Eigenschaften erzeugen — eine Value Narrative unterscheidet sich davon, indem sie explizit die Verbindung zwischen technischer Änderung und Geschäftsnutzen herstellt: Nicht "diese Technologie ist schneller", sondern "diese technische Änderung reduziert die bereits in [KB-0595](07-value-streams.md) identifizierte Übergabe-Wartezeit im Bestellprozess, wodurch der Kunde seine Bestellbestätigung schneller erhält" — diese explizite Verbindung macht den Geschäftsnutzen nachvollziehbar und überprüfbar, statt ihn implizit vorauszusetzen. Die Trennung von Evidenz und Annahme ist die zweite, ebenso zentrale Anforderung: Eine Value Narrative enthält typischerweise sowohl bereits belegte Aussagen (etwa "ein durchgeführter PoC hat gezeigt, dass die neue Technologie die Latenz um 40% reduziert") als auch notwendigerweise unbelegte, zukunftsgerichtete Annahmen (etwa "wir erwarten, dass diese Latenzreduktion zu einer messbaren Verbesserung der Kundenzufriedenheit führt") — beide Aussagearten sind legitim, aber sie müssen explizit unterschieden werden, da eine unbelegte Annahme, die als feststehendes Ergebnis präsentiert wird, eine Entscheidung auf einer tatsächlich schwächeren Grundlage suggeriert, als sie tatsächlich hat. Diese explizite Unterscheidung ermöglicht zudem eine spätere, tatsächliche Überprüfung: Nach Umsetzung des Architekturvorhabens kann geprüft werden, ob die ursprünglich als Annahme gekennzeichnete Erwartung (etwa die Verbesserung der Kundenzufriedenheit) tatsächlich eingetreten ist — eine Überprüfung, die bei einer Value Narrative, die Annahmen und belegte Ergebnisse nicht unterscheidet, gar nicht sinnvoll möglich wäre, da unklar bliebe, welche ursprüngliche Aussage überhaupt zu überprüfen war.

~~~text
Value Narrative: explicitly connects THREE elements for a concrete architecture initiative
  BUSINESS BENEFIT (actual value initiative should create, building on KB-0595 value stream analysis)
  TECHNICAL CHANGE (what concretely changes)
  MEASURABLE RESULTS (how actual success will be recognizable)
KEY POINT: transparent separation of already-proven EVIDENCE
  (e.g. measured PoC result, per KB-0610 PoC governance)
  from still-unproven ASSUMPTIONS
  narrative presenting unproven assumptions as settled facts
  -> structurally indistinguishable from pure technical advantage collection
     confusing enthusiasm for a technology with actually-proven business benefit
PURE TECHNICAL ADVANTAGE COLLECTION ("this tech is faster, more scalable, more modern")
  describes technical properties w/o necessarily explaining what ACTUAL, org-relevant business benefit
  these properties create
VALUE NARRATIVE differs: explicitly establishes connection between technical change and business benefit
  NOT "this tech is faster" but "this technical change reduces the KB-0595-identified handoff wait time
  in order process, so customer gets order confirmation faster"
  this explicit connection -> makes business benefit traceable+verifiable, instead of implicitly assumed
SEPARATION OF EVIDENCE AND ASSUMPTION = second, equally central requirement
  narrative typically contains BOTH already-proven statements
    ("a conducted PoC showed new tech reduces latency by 40%")
  AND necessarily unproven, forward-looking assumptions
    ("we expect this latency reduction to lead to measurable customer satisfaction improvement")
  BOTH statement types legitimate, but MUST be explicitly distinguished
  unproven assumption presented as settled result -> suggests decision rests on
    stronger basis than it actually has
this explicit distinction also enables LATER, ACTUAL verification:
  after implementation, can check whether originally-assumption-flagged expectation
    (customer satisfaction improvement) actually occurred
  verification not meaningfully possible for narrative not distinguishing assumption from proven result
    (unclear which original statement was even meant to be checked)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Geschäftsnutzen | expliziter, nachvollziehbarer Wert für die Organisation | verbindet technische Änderung mit tatsächlicher Relevanz |
| Technische Änderung | konkrete Beschreibung dessen, was verändert wird | Grundlage der Nutzen-Kausalkette |
| Messbares Ergebnis | woran tatsächlicher Erfolg erkennbar sein wird | ermöglicht spätere, tatsächliche Überprüfung |
| Evidenz vs. Annahme | unterscheidet belegte von unbelegten Aussagen | zentrale Anforderung an Transparenz der Narrative |

Implementierung: Jede Value Narrative verbindet explizit Geschäftsnutzen, technische Änderung und messbare Ergebnisse in einer nachvollziehbaren Kausalkette. Jede Aussage in der Narrative wird explizit als "belegt" (mit Quelle, etwa PoC-Ergebnis) oder als "Annahme" gekennzeichnet. Nach Umsetzung des Vorhabens werden ursprünglich als Annahme gekennzeichnete Erwartungen tatsächlich überprüft.

## Scalability, Reliability, Security und Observability

Value Narratives skalieren die Nachvollziehbarkeit und Vertrauenswürdigkeit von Architekturentscheidungen proportional zur Konsequenz der Trennung von Evidenz und Annahme; die Reliability-Grenze liegt darin, dass eine Narrative, die unbelegte Annahmen als feststehende Ergebnisse darstellt, Entscheidungen auf einer tatsächlich schwächeren Grundlage suggeriert, als sie tatsächlich hat.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Architekturentscheidung stellt sich nach Umsetzung als weniger vorteilhaft heraus als ursprünglich dargestellt | unbelegte Annahmen wurden ursprünglich als feststehende Ergebnisse präsentiert | künftige Narratives explizit zwischen belegten Ergebnissen und Annahmen unterscheiden |
| eine Value Narrative überzeugt technisch versierte Stakeholder, aber nicht geschäftsorientierte Entscheidungsträger | die Narrative beschreibt technische Vorteile, ohne die explizite Verbindung zum tatsächlichen Geschäftsnutzen herzustellen | die Kausalkette von technischer Änderung zu geschäftlichem Ergebnis explizit ausformulieren |
| eine ursprüngliche Erwartung eines Architekturvorhabens lässt sich nach Umsetzung nicht überprüfen | die ursprüngliche Narrative hat die Erwartung nicht als konkrete, messbare Annahme formuliert | künftige Erwartungen explizit als überprüfbare, messbare Annahmen formulieren |

Security: Sicherheitsrelevante Annahmen in einer Value Narrative (etwa "diese Änderung verbessert die Sicherheitslage") sollten besonders sorgfältig mit tatsächlicher Evidenz statt bloßer Erwartung belegt werden. Observability: Die tatsächliche Trefferquote ursprünglich als Annahme gekennzeichneter Erwartungen (wie oft sie sich nach Umsetzung tatsächlich bestätigen) ist ein zentrales Signal zur Bewertung der Qualität künftiger Value Narratives.

## Trade-offs und Entscheidungen

**Staff** formuliert eine Value Narrative für ein gegebenes, kleineres Architekturvorhaben korrekt mit expliziter Evidenz-/Annahmenkennzeichnung. **Principal** entwirft die vollständige Value-Narrative-Struktur für ein größeres Architekturvorhaben, aufbauend auf Value-Stream-Analyse und PoC-Evidenz. **Chief** legt unternehmensweite Standards für Value Narratives fest, die Transparenz zwischen Evidenz und Annahme verbindlich machen.

Anti-Patterns: eine Value Narrative als rein technische Vorteilssammlung ohne explizite Geschäftsnutzen-Verbindung formulieren; unbelegte Annahmen als feststehende Ergebnisse darstellen; ursprüngliche Erwartungen nicht als überprüfbare, messbare Annahmen formulieren und dadurch eine spätere Überprüfung unmöglich machen.

## Production Checklist

- [ ] Jede Value Narrative verbindet explizit Geschäftsnutzen, technische Änderung und messbare Ergebnisse.
- [ ] Jede Aussage ist explizit als "belegt" oder "Annahme" gekennzeichnet.
- [ ] Belegte Aussagen referenzieren eine konkrete Evidenzquelle (etwa ein PoC-Ergebnis).
- [ ] Ursprünglich als Annahme gekennzeichnete Erwartungen werden nach Umsetzung tatsächlich überprüft.

## Interviewfragen

### 1. Was unterscheidet eine Value Narrative von einer rein technischen Vorteilssammlung?

**Antwort:** Eine Value Narrative stellt explizit die Verbindung zwischen technischer Änderung und tatsächlichem Geschäftsnutzen her, während eine reine Vorteilssammlung technische Eigenschaften beschreibt, ohne diese Verbindung notwendigerweise herzustellen.

### 2. Warum ist die Trennung von Evidenz und Annahme in einer Value Narrative zentral?

**Antwort:** Weil eine unbelegte Annahme, die als feststehendes Ergebnis präsentiert wird, eine Entscheidung auf einer tatsächlich schwächeren Grundlage suggeriert, als sie tatsächlich hat.

### 3. Wofür ermöglicht die explizite Kennzeichnung von Annahmen eine spätere Überprüfung?

**Antwort:** Nach Umsetzung des Vorhabens kann geprüft werden, ob die ursprünglich als Annahme gekennzeichnete Erwartung tatsächlich eingetreten ist — eine Prüfung, die ohne diese Kennzeichnung nicht sinnvoll möglich wäre.

### 4. Welche drei Elemente verbindet eine Value Narrative explizit?

**Antwort:** Geschäftsnutzen, technische Änderung und messbare Ergebnisse.

### 5. Wie gehst du vor, wenn eine Architekturentscheidung sich nach Umsetzung als weniger vorteilhaft herausstellt als ursprünglich dargestellt?

**Antwort:** Ich prüfe, ob die ursprüngliche Narrative unbelegte Annahmen als feststehende Ergebnisse präsentiert hat, und stelle für künftige Narratives sicher, dass Annahmen explizit als solche gekennzeichnet werden.

### 6. Widersprüchliche Anforderung: Stakeholder wollen eine überzeugende, klare Erfolgsgeschichte für ein Architekturvorhaben UND vollständige Transparenz über unbelegte Annahmen — wie gehst du vor?

**Antwort:** Ich würde eine klare, nachvollziehbare Kausalkette von technischer Änderung zu Geschäftsnutzen formulieren, dabei aber jede unbelegte Erwartung explizit als Annahme mit ihrem jeweiligen Evidenzstand kennzeichnen, statt entweder Überzeugungskraft durch unbelegte Behauptungen zu erkaufen oder eine unklare, unüberzeugende Darstellung zu liefern.

## Praktische Labs

~~~python
# Local, deterministic simulation of separating proven results from unproven assumptions in a value narrative (executed locally, no real EA tool):

def classify_statements(statements):
    return [
        {"statement": s["text"], "type": "evidence" if s.get("evidence_source") else "assumption"}
        for s in statements
    ]

statements = [
    {"text": "PoC measured 40% latency reduction", "evidence_source": "PoC report Q3 2026"},
    {"text": "We expect customer satisfaction to improve", "evidence_source": None},
]

for s in classify_statements(statements):
    print(s)
~~~

## Dependencies, Cross-References und Quellen

1. The Open Group: [TOGAF Standard, 10th Edition — Business Value Assessment](https://pubs.opengroup.org/togaf-standard/introduction/), abgerufen 2026-09-18.
2. Gartner-Referenzmodell: [Business Case Development for IT Investments](https://www.gartner.com/en/information-technology/glossary/business-case), abgerufen 2026-09-18.

Value Streams sind kanonisch in [KB-0595](07-value-streams.md) behandelt; Erfolgskriterien und PoC-Governance in [KB-0610](22-erfolgskriterien-und-poc-governance.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte, automatische Erkennung unbelegter, aber als feststehend formulierter Aussagen in Architekturvorhaben-Dokumenten | Evaluating | Als ergänzendes Prüfwerkzeug vor Veröffentlichung einer Value Narrative einsetzen, jedoch die abschließende Klassifikation als Evidenz oder Annahme weiterhin menschlich verantworten. |

Ein Team akzeptiert eine Value Narrative erst, wenn Geschäftsnutzen, technische Änderung und messbare Ergebnisse nachvollziehbar verbunden sind und jede Aussage nachweislich explizit als Evidenz oder Annahme gekennzeichnet ist.
