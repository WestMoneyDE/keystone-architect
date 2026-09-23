---
{"id": "KB-0595", "title": "Value Streams", "domain": "25", "sequence": 7, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0594", "concepts": ["Capability Mapping"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Value Stream für einen konkreten Geschäftsprozess anhand etablierter Praxis korrekt mit Wertschritten, beteiligten Fähigkeiten und Übergaben darstellen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Value Streams Wartezeiten und Kundenergebnis sichtbar machen, um Architekturprioritäten nachvollziehbar aus tatsächlichem Kundenwert statt aus internen Systemgrenzen abzuleiten.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine dominierende Wartezeit innerhalb eines Value Streams nicht durch eine einzelne, langsame Fähigkeit, sondern durch eine ineffiziente Übergabe zwischen zwei Fähigkeiten verursacht wird, und die Ursache entsprechend zuordnen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Value-Stream-Analyse festlegen, die Architekturinvestitionen anhand tatsächlicher Wartezeiten und Kundenergebnis statt anhand interner Systemgrenzen priorisieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die formale ArchiMate-Notation für Value-Stream-Artefakte im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis, wie Value Streams Wartezeiten und Kundenergebnis sichtbar machen, um Architekturprioritäten aus tatsächlichem Kundenwert abzuleiten, nicht eine bestimmte formale Notation."}}, "lab_validation": [{"lab_id": "KB-0595-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Identifikation dominierender Wartezeiten innerhalb eines Value Streams, kein produktives EA-Tool verwendet", "evidence": "Ein lokales Skript modelliert einen Value Stream mit mehreren Wertschritten und Übergaben, misst die jeweilige Bearbeitungs- und Wartezeit, und identifiziert, dass die größte Verzögerung durch eine Übergabe zwischen zwei Fähigkeiten statt durch die Bearbeitungszeit einer einzelnen Fähigkeit verursacht wird.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales EA-Tool."}]}
---
# Value Streams

> **Ziel:** Ein Value Stream stellt die Abfolge von **Wertschritten** dar, die ein Geschäftsprozess durchläuft, um ein konkretes **Kundenergebnis** zu erzeugen (etwa "Kundenauftrag von der Bestellung bis zur Lieferung"), zusammen mit den daran beteiligten Geschäftsfähigkeiten (siehe die bereits in [KB-0594](06-capability-mapping.md) behandelte Fähigkeitskarte) und den **Übergaben** zwischen ihnen. Der zentrale Punkt dieses Kapitels ist, dass Value Streams **Wartezeiten** sichtbar machen, die andere Architekturbetrachtungen (etwa eine reine Fähigkeitskarte oder Anwendungslandschaft) typischerweise nicht zeigen — insbesondere die Wartezeiten, die zwischen zwei Übergaben entstehen (nicht während der eigentlichen Bearbeitung durch eine Fähigkeit), sind in der Praxis häufig die größte, aber am wenigsten sichtbare Quelle von Verzögerung für den tatsächlichen Kundenergebnis, und sollten daher als eine zentrale Grundlage für Architekturprioritäten dienen.

## Zweck, Mental Model und Dependencies

Ein Value Stream unterscheidet sich von der bereits in [KB-0594](06-capability-mapping.md) behandelten Fähigkeitskarte durch seine Perspektive: Eine Fähigkeitskarte zeigt, welche Fähigkeiten eine Organisation besitzt und wie reif sie sind, während ein Value Stream zeigt, wie mehrere Fähigkeiten in einer konkreten, zeitlichen Abfolge zusammenwirken, um tatsächlich Kundenwert zu erzeugen — dieselbe Fähigkeit kann in mehreren, unterschiedlichen Value Streams eine Rolle spielen, und ein Value Stream macht sichtbar, wie gut das Zusammenspiel mehrerer Fähigkeiten tatsächlich funktioniert, nicht nur wie gut jede Fähigkeit isoliert für sich funktioniert. Die entscheidende, häufig übersehene Erkenntnis bei der Analyse eines Value Streams ist, dass die Gesamtdauer von der Bestellung bis zur Lieferung selten primär durch die reine Bearbeitungszeit innerhalb einer einzelnen Fähigkeit dominiert wird, sondern häufig durch die Wartezeit zwischen zwei Übergaben — etwa die Zeit, die ein Auftrag "liegt", nachdem eine Fähigkeit ihre Bearbeitung abgeschlossen hat, bevor die nächste Fähigkeit die Bearbeitung tatsächlich aufnimmt. Diese Übergabe-Wartezeiten sind in klassischen, fähigkeitszentrierten oder anwendungszentrierten Architekturbetrachtungen strukturell unsichtbar, da jede dieser Betrachtungen typischerweise eine einzelne Fähigkeit oder Anwendung isoliert analysiert, statt die zeitliche Lücke zwischen zwei aufeinanderfolgenden Fähigkeiten explizit zu messen. Die methodische Konsequenz für Architekturpriorisierung ist erheblich: Eine Investition, die die Bearbeitungszeit einer bereits schnellen Fähigkeit weiter optimiert, hat wenig Einfluss auf das tatsächliche Kundenergebnis, wenn die dominierende Verzögerung tatsächlich in einer Übergabe-Wartezeit zwischen zwei anderen Fähigkeiten liegt — Value-Stream-Analyse macht diese tatsächliche Verzögerungsquelle sichtbar und lenkt Architekturinvestitionen dorthin, wo sie tatsächlich den größten Einfluss auf das Kundenergebnis haben.

~~~text
Value Stream: sequence of VALUE STEPS a business process goes through to produce concrete CUSTOMER OUTCOME
  (e.g. "customer order from order to delivery")
  together with involved business capabilities (KB-0594) and HANDOFFS between them
KEY POINT: value streams make visible WAIT TIMES other architecture views typically don't show
  especially the wait time occurring BETWEEN two handoffs (not during actual processing by a capability)
  in practice often the LARGEST but LEAST visible source of delay for actual customer outcome
  -> should serve as central basis for architecture priorities
DIFFERS from capability map (KB-0594) in PERSPECTIVE:
  capability map: shows WHICH capabilities org has + how mature
  value stream: shows HOW multiple capabilities work together, in concrete TIME SEQUENCE,
    to actually produce customer value
  same capability can play role in MULTIPLE different value streams
  value stream reveals how well the INTERPLAY of multiple capabilities actually works
    not just how well each capability functions in isolation
DECISIVE, OFTEN-OVERLOOKED INSIGHT: total order-to-delivery duration
  rarely dominated primarily by pure PROCESSING time within a single capability
  often dominated by WAIT TIME BETWEEN two handoffs
    (time an order "sits" after one capability finished processing, before next capability actually picks it up)
these handoff wait times structurally INVISIBLE in classic capability-centric or app-centric views
  each such view typically analyzes single capability/app in isolation
  doesn't explicitly measure the time GAP between two consecutive capabilities
METHODOLOGICAL CONSEQUENCE for architecture prioritization is significant:
  investment optimizing processing time of an already-fast capability
    -> little impact on actual customer outcome IF dominant delay actually sits in
       a handoff wait time between two OTHER capabilities
  value stream analysis makes this actual delay source visible
    -> directs architecture investment where it actually has biggest impact on customer outcome
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Wertschritt | einzelner Schritt zur Erzeugung des Kundenergebnisses | Grundlage der zeitlichen Value-Stream-Darstellung |
| Übergabe | Übergang zwischen zwei beteiligten Fähigkeiten | häufig größte, unsichtbare Verzögerungsquelle |
| Wartezeit | Zeit zwischen Bearbeitungsabschluss und -beginn zweier Fähigkeiten | zentrales Priorisierungssignal für Architekturinvestitionen |
| Kundenergebnis | konkreter, für den Kunden wahrnehmbarer Endwert | Maßstab für die tatsächliche Wirksamkeit einer Optimierung |

Implementierung: Ein Value Stream wird als zeitliche Abfolge von Wertschritten mit den beteiligten Fähigkeiten und expliziten Übergaben dargestellt. Für jeden Wertschritt und jede Übergabe wird sowohl die tatsächliche Bearbeitungszeit als auch die Wartezeit gemessen. Architekturinvestitionen werden anhand der tatsächlich dominierenden Verzögerungsquelle (Bearbeitung oder Übergabe-Wartezeit) priorisiert, statt anhand isolierter Fähigkeitsoptimierung.

## Scalability, Reliability, Security und Observability

Value Streams skalieren die tatsächliche Wirksamkeit von Architekturinvestitionen proportional zur Sichtbarkeit von Übergabe-Wartezeiten gegenüber reiner Bearbeitungszeit; die Reliability-Grenze liegt darin, dass eine ausschließlich fähigkeitszentrierte Betrachtung dominierende Übergabe-Verzögerungen strukturell unsichtbar lässt und dadurch zu Investitionen mit geringer tatsächlicher Kundenwirkung führen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Investition in die Beschleunigung einer Fähigkeit verbessert das Kundenergebnis kaum | die dominierende Verzögerung liegt tatsächlich in einer Übergabe-Wartezeit, nicht in der Bearbeitungszeit dieser Fähigkeit | eine Value-Stream-Analyse mit expliziter Messung der Übergabe-Wartezeiten durchführen |
| die Gesamtdauer eines Geschäftsprozesses ist trotz schneller Einzelfähigkeiten unerwartet lang | Wartezeiten zwischen Übergaben summieren sich zu einer erheblichen Gesamtverzögerung | die Übergaben zwischen den beteiligten Fähigkeiten explizit auf Wartezeit prüfen |
| Architekturprioritäten werden anhand interner Systemgrenzen statt tatsächlichem Kundenwert gesetzt | keine Value-Stream-Analyse verbindet Architekturentscheidungen mit dem tatsächlichen Kundenergebnis | Architekturprioritäten explizit anhand identifizierter Value-Stream-Verzögerungen begründen |

Security: Übergaben zwischen Fähigkeiten, die sensible Daten transportieren, sollten in der Value-Stream-Analyse auch auf Zugriffskontrolle und Datenschutz geprüft werden. Observability: Die tatsächlich gemessene End-to-End-Dauer eines Value Streams, aufgeschlüsselt nach Bearbeitungs- und Wartezeit je Übergabe, ist das zentrale Signal zur Bewertung, wo Architekturinvestitionen den größten Einfluss auf das Kundenergebnis haben.

## Trade-offs und Entscheidungen

**Staff** stellt einen gegebenen Value Stream mit korrekten Wertschritten und Übergaben dar. **Principal** entwirft die vollständige Value-Stream-Analyse für einen Geschäftsprozess und identifiziert dominierende Verzögerungsquellen. **Chief** legt unternehmensweite Standards fest, die Architekturprioritäten anhand von Value-Stream-Analysen statt interner Systemgrenzen ausrichten.

Anti-Patterns: Architekturinvestitionen ausschließlich anhand isolierter Fähigkeitsoptimierung priorisieren, ohne Übergabe-Wartezeiten zu messen; eine Value-Stream-Analyse ohne explizite Wartezeitmessung durchführen und dadurch die dominierende Verzögerungsquelle übersehen; Architekturprioritäten an internen Systemgrenzen statt am tatsächlichen Kundenergebnis ausrichten.

## Production Checklist

- [ ] Jeder relevante Value Stream ist mit Wertschritten, beteiligten Fähigkeiten und Übergaben dokumentiert.
- [ ] Sowohl Bearbeitungszeit als auch Wartezeit sind je Wertschritt und Übergabe gemessen.
- [ ] Architekturinvestitionen sind anhand der tatsächlich dominierenden Verzögerungsquelle priorisiert.
- [ ] Die End-to-End-Dauer wird regelmäßig gegen das tatsächliche Kundenergebnis gemessen.

## Interviewfragen

### 1. Was unterscheidet einen Value Stream von einer Fähigkeitskarte?

**Antwort:** Eine Fähigkeitskarte zeigt, welche Fähigkeiten eine Organisation besitzt und wie reif sie sind; ein Value Stream zeigt, wie mehrere Fähigkeiten in zeitlicher Abfolge zusammenwirken, um tatsächlich Kundenwert zu erzeugen.

### 2. Warum sind Übergabe-Wartezeiten oft die größte, aber am wenigsten sichtbare Verzögerungsquelle?

**Antwort:** Weil klassische, fähigkeitszentrierte oder anwendungszentrierte Betrachtungen jede Fähigkeit isoliert analysieren, statt die zeitliche Lücke zwischen zwei aufeinanderfolgenden Fähigkeiten explizit zu messen.

### 3. Warum kann eine Investition in eine bereits schnelle Fähigkeit das Kundenergebnis kaum verbessern?

**Antwort:** Wenn die dominierende Verzögerung tatsächlich in einer Übergabe-Wartezeit zwischen zwei anderen Fähigkeiten liegt, hat die Optimierung der bereits schnellen Fähigkeit nur geringen Einfluss auf das tatsächliche Kundenergebnis.

### 4. Wie sollten Architekturprioritäten laut diesem Kapitel abgeleitet werden?

**Antwort:** Aus tatsächlich gemessenen Value-Stream-Verzögerungen (Bearbeitungs- und Wartezeit) mit Bezug zum tatsächlichen Kundenergebnis, nicht aus internen Systemgrenzen.

### 5. Wie gehst du vor, wenn eine Investition in die Beschleunigung einer Fähigkeit das Kundenergebnis kaum verbessert?

**Antwort:** Ich führe eine Value-Stream-Analyse mit expliziter Messung der Übergabe-Wartezeiten durch, um zu prüfen, ob die dominierende Verzögerung tatsächlich an anderer Stelle im Prozess liegt.

### 6. Widersprüchliche Anforderung: Teams wollen ihre einzelnen Fähigkeiten isoliert und lokal optimieren UND die Organisation will das Kundenergebnis end-to-end verbessern — wie gehst du vor?

**Antwort:** Ich würde eine Value-Stream-Analyse als gemeinsame, übergreifende Priorisierungsgrundlage etablieren, die lokale Fähigkeitsoptimierungen dort zulässt, wo sie tatsächlich zur dominierenden Verzögerungsquelle beitragen, während team-übergreifende Übergabe-Optimierungen für tatsächlich end-to-end wirksame Verbesserungen priorisiert werden.

## Praktische Labs

~~~python
# Local, deterministic simulation of identifying dominant delay source in a value stream (executed locally, no real EA tool):

def analyze_value_stream(steps):
    results = []
    for step in steps:
        results.append({
            "step": step["name"],
            "processing_time": step["processing_time"],
            "handoff_wait_time": step["handoff_wait_time"],
        })
    dominant = max(results, key=lambda r: r["handoff_wait_time"])
    return {"steps": results, "dominant_delay_source": dominant["step"] + " handoff wait"}

steps = [
    {"name": "order_intake", "processing_time": 1, "handoff_wait_time": 0},
    {"name": "credit_check", "processing_time": 1, "handoff_wait_time": 4},  # dominant delay: handoff wait
    {"name": "fulfillment", "processing_time": 2, "handoff_wait_time": 1},
]

print(analyze_value_stream(steps))
~~~

## Dependencies, Cross-References und Quellen

1. The Open Group: [TOGAF Standard, 10th Edition — Value Streams](https://pubs.opengroup.org/togaf-standard/introduction/), abgerufen 2026-09-18.
2. ArchiMate-Spezifikation: [ArchiMate 3.2 Specification — Value Stream](https://pubs.opengroup.org/architecture/archimate3-doc/chap09.html), abgerufen 2026-09-18.

Capability Mapping ist kanonisch in [KB-0594](06-capability-mapping.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, prozessmining-basierte Value-Stream-Rekonstruktion aus tatsächlichen Systemlogs statt manueller Workshop-Erhebung | Evaluating | Als ergänzende, datengestützte Validierung der manuell erhobenen Value-Stream-Darstellung einsetzen, da automatisch rekonstruierte Übergabe-Wartezeiten häufig präziser sind als geschätzte, workshop-basierte Werte. |

Ein Team akzeptiert eine Value-Stream-Analyse erst, wenn Wertschritte, Übergaben und die jeweiligen Wartezeiten nachweislich gemessen sind und Architekturprioritäten nachvollziehbar aus der tatsächlich dominierenden Verzögerungsquelle abgeleitet wurden.
