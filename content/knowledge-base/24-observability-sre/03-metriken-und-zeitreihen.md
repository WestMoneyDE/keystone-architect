---
{"id": "KB-0567", "title": "Metriken und Zeitreihen", "domain": "24", "sequence": 3, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "CLOUD", "MLOPS"], "requires": [{"id": "KB-0566", "concepts": ["Error Budgets"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Counter, Gauges und Histogramme anhand etablierter Metrik-Datenmodelle korrekt einsetzen und Kardinalitätsrisiken bei der Label-Gestaltung vermeiden können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Anwendung explizit gestalten, wie Metrik-Labels so definiert werden, dass sie betrieblich verwertbare Aggregation ermöglichen, ohne unkontrolliertes Kardinalitätswachstum zu verursachen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine Überlastung oder einen Ausfall des Metriksystems auf unkontrolliertes Kardinalitätswachstum durch ein Label mit hochvariablen, im Wesentlichen eindeutigen Werten zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Metrik-Label-Design festlegen, die Kardinalitätsrisiken systematisch vor Einführung neuer Metriken bewerten.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Speicherimplementierung spezifischer Zeitreihendatenbanken im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Metriktypen und Kardinalitätsrisiken als Entscheidungsgrundlage, nicht die zeitreihendatenbankspezifische Speicherimplementierung."}}, "lab_validation": [{"lab_id": "KB-0567-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation von Kardinalitätsexplosion durch ein hochvariables Metrik-Label, kein produktives Metriksystem verwendet", "evidence": "Ein lokales Skript simuliert, wie ein zusätzliches Metrik-Label mit einem im Wesentlichen eindeutigen Wert pro Anfrage (etwa eine Nutzer-ID oder eine vollständige Anfrage-URL mit Parametern) die Anzahl tatsächlich gespeicherter, eindeutiger Zeitreihen multiplikativ mit der Anzahl möglicher Label-Kombinationen wachsen lässt, während ein Label mit einer begrenzten, kleinen Menge möglicher Werte (etwa ein HTTP-Statuscode-Bereich) die Kardinalität überschaubar hält.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Zeitreihendatenbanksystem mit tatsächlicher Speicher-/Abfragedynamik."}]}
---
# Metriken und Zeitreihen

> **Ziel:** Metriken werden über drei grundlegende Typen erfasst: **Counter** (ein monoton steigender Zähler, etwa die kumulierte Anzahl bearbeiteter Anfragen seit Prozessstart, dessen Ableitung — die Änderungsrate über Zeit — üblicherweise interessanter ist als der Rohwert selbst), **Gauges** (ein Momentanwert, der sowohl steigen als auch fallen kann, etwa die aktuelle Anzahl aktiver Verbindungen), und **Histogramme** (die Verteilung von Werten über konfigurierte Wertebereiche, etwa die Verteilung von Antwortzeiten, was Perzentilberechnungen wie "95% der Anfragen wurden innerhalb von X ms beantwortet" ermöglicht, statt nur einen einzelnen Durchschnittswert zu betrachten, der Ausreißer verschleiern würde). Der zentrale Punkt dieses Kapitels ist, dass eine Überlastung oder ein Ausfall des Metriksystems selbst typischerweise nicht auf zu viele erfasste Metriken zurückzuführen ist, sondern auf **Kardinalitätsexplosion** — ein einzelnes Metrik-Label (eine zusätzliche Dimension zur Aufschlüsselung einer Metrik, etwa nach Nutzer, Endpunkt, oder Statuscode) mit einer im Wesentlichen unbegrenzten Anzahl möglicher, tatsächlich auftretender Werte (etwa eine Nutzer-ID oder eine vollständige URL mit Parametern statt eines normalisierten Endpunktnamens) lässt die Anzahl tatsächlich gespeicherter, eindeutiger Zeitreihen multiplikativ mit jeder weiteren Kombination dieses Labels wachsen, bis das Metriksystem unter der resultierenden Speicher- und Abfragelast zusammenbricht.

## Zweck, Mental Model und Dependencies

Die Wahl des richtigen Metriktyps hat direkte Konsequenzen für die tatsächliche Aussagekraft: Ein Counter allein sagt wenig aus, solange nicht seine Änderungsrate über die Zeit betrachtet wird (etwa "Anfragen pro Sekunde" statt der absoluten, seit Prozessstart akkumulierten Gesamtzahl) — die meisten Metrik-Abfragesprachen bieten daher explizite Funktionen zur Ratenberechnung aus Countern. Gauges eignen sich für Momentanzustände, die tatsächlich in beide Richtungen schwanken können, während ein Counter für diesen Zweck ungeeignet wäre, da er per Definition nur steigt (oder bei einem Prozessneustart auf null zurückgesetzt wird, was bei der Ratenberechnung explizit berücksichtigt werden muss). Histogramme lösen ein grundlegendes statistisches Problem: Ein einzelner Durchschnittswert einer Antwortzeitmessung kann eine irreführend positive Aussage treffen, wenn eine kleine Anzahl extrem langsamer Anfragen durch eine viel größere Anzahl schneller Anfragen im Durchschnitt "verschluckt" wird — ein Histogramm erfasst stattdessen die tatsächliche Verteilung, was die Berechnung aussagekräftiger Perzentile (etwa das 99. Perzentil, das gezielt die "schlechtesten" Nutzererfahrungen abbildet, die ein reiner Durchschnitt verbergen würde) ermöglicht. Die kritischste, häufig übersehene Betriebsgrenze von Metriksystemen ist jedoch die Kardinalität — jede eindeutige Kombination aus Metriknamen und allen zugehörigen Label-Werten erzeugt eine separate, im Zeitreihendatenbank-System tatsächlich gespeicherte Zeitreihe. Ein Label, dessen Wertebereich klein und begrenzt ist (etwa ein HTTP-Statuscode-Bereich mit wenigen möglichen Werten, oder eine begrenzte Liste bekannter Endpunkt-Namen), erzeugt eine überschaubare, konstante Anzahl an Zeitreihen. Ein Label, dessen Wertebereich hingegen im Wesentlichen unbegrenzt oder pro Anfrage eindeutig ist (eine Nutzer-ID, eine vollständige, ungefilterte URL mit dynamischen Parametern, eine Sitzungs-ID), erzeugt hingegen für jeden tatsächlich auftretenden, eindeutigen Wert eine eigene, permanent im System verbleibende Zeitreihe — bei ausreichend hohem Anfragevolumen und ausreichend variablen Label-Werten wächst die Gesamtzahl der Zeitreihen dadurch unkontrolliert, was sowohl den Speicherbedarf als auch die Abfragelatenz des Metriksystems drastisch erhöht, bis das System unter dieser selbst erzeugten Last zusammenbricht — nicht wegen zu vieler unterschiedlicher Metriken, sondern wegen der multiplikativen Kombination eines einzelnen, unvorsichtig gewählten Labels.

~~~text
Metric types:
  Counter: MONOTONICALLY INCREASING, usually the RATE (change over time) is more interesting than raw value
    (also resets to zero on process restart -- must be handled in rate calculation)
  Gauge: point-in-time value, can go UP or DOWN (e.g. current active connections)
  Histogram: distribution of values across configured buckets (e.g. response time distribution)
    -> enables PERCENTILE calculation (p99) instead of misleading single average
       (a few very slow requests can be "swallowed" by many fast ones in a plain average)
CRITICAL, OFTEN-OVERLOOKED OPERATIONAL LIMIT: CARDINALITY
  every UNIQUE combination of metric name + ALL label values = SEPARATE stored time series
  BOUNDED label (small value range, e.g. HTTP status code range, known endpoint list)
    -> manageable, constant number of time series
  UNBOUNDED/effectively-per-request-unique label (user ID, raw URL with dynamic params, session ID)
    -> EACH unique observed value -> its OWN, PERMANENTLY RETAINED time series
    -> at sufficient request volume/label variability -> UNCONTROLLED series count growth
    -> drastically increases storage + query latency -> metric system COLLAPSES under SELF-INDUCED load
METRIC SYSTEM overload/outage usually != too many DIFFERENT metrics
  -> usually = CARDINALITY EXPLOSION from ONE carelessly-chosen, high-variability label
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Counter | monoton steigender Zähler, Rate meist aussagekräftiger als Rohwert | Reset bei Prozessneustart muss berücksichtigt werden |
| Gauge | Momentanwert, kann steigen und fallen | für tatsächlich bidirektional schwankende Zustände |
| Histogramm | Wertverteilung, ermöglicht Perzentilberechnung | verhindert irreführende Durchschnittswerte |
| Kardinalität | Anzahl eindeutiger Metrik-/Label-Kombinationen | einzelnes hochvariables Label kann System überlasten |

Implementierung: Für jedes Metrik-Label wird explizit geprüft, ob dessen Wertebereich tatsächlich begrenzt und überschaubar ist, bevor es eingeführt wird — hochvariable Werte (Nutzer-ID, vollständige URL, Sitzungs-ID) werden nicht als Label genutzt, sondern gegebenenfalls über separate, strukturierte Logging- oder Tracing-Systeme erfasst statt über Metriken. Histogramme werden für Latenz- und Größenverteilungen genutzt, statt sich auf Durchschnittswerte zu verlassen. Counter-Raten werden explizit über die entsprechende Rate-Berechnung statt des Rohwerts ausgewertet.

## Scalability, Reliability, Security und Observability

Metriksysteme skalieren die tatsächliche Betriebsfähigkeit proportional zur bewussten Begrenzung der Label-Kardinalität; die Reliability-Grenze liegt darin, dass ein einzelnes, hochvariables Label proportional zum Anfragevolumen zu unkontrolliertem Zeitreihenwachstum und letztlich zum Systemausfall führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| das Metriksystem wird unter hoher Last überlastet oder fällt aus | ein Metrik-Label mit hochvariablen, im Wesentlichen eindeutigen Werten verursacht Kardinalitätsexplosion | die Label-Definitionen aller Metriken auf hochvariable Werte prüfen und diese entfernen oder in separate Systeme auslagern |
| ein Durchschnittswert für Antwortzeit verschleiert tatsächliche Nutzerprobleme | nur ein Durchschnittswert statt eines Histogramms mit Perzentilberechnung wird erfasst | die betroffene Metrik auf ein Histogramm mit Perzentilauswertung umstellen |
| ein Counter-Wert zeigt nach einem Prozessneustart unerwartete, sprunghafte Änderungen | die Rate-Berechnung berücksichtigt den Counter-Reset bei Neustart nicht korrekt | die Rate-Berechnungsfunktion auf korrekte Behandlung von Counter-Resets prüfen |

Security: Metrik-Labels sollten keine sensiblen, personenbezogenen Daten (etwa vollständige Nutzernamen oder E-Mail-Adressen) enthalten, sowohl aus Datenschutzgründen als auch weil solche Werte typischerweise ohnehin hochvariabel und damit kardinalitätsrisikobehaftet sind. Observability: Die tatsächliche Gesamtanzahl aktiver Zeitreihen relativ zu erwarteten Werten, sowie die Häufigkeit neu auftretender, unerwarteter Label-Wert-Kombinationen, sind zentrale Betriebssignale zur Bewertung der Metriksystem-Gesundheit selbst.

## Trade-offs und Entscheidungen

**Staff** definiert Metriken mit korrektem Typ und begrenzten Labels für eine gegebene Anwendung. **Principal** entwirft die Metrik-Architektur mit bewusster Kardinalitätsbegrenzung für ein vollständiges System. **Chief** legt unternehmensweite Standards für Metrik-Label-Design mit systematischer Kardinalitätsbewertung fest.

Anti-Patterns: hochvariable Werte (Nutzer-ID, vollständige URL, Sitzungs-ID) als Metrik-Label nutzen und dadurch Kardinalitätsexplosion riskieren; sich auf Durchschnittswerte statt Histogrammen für Latenzmessungen verlassen; Counter-Raten ohne korrekte Behandlung von Prozessneustart-Resets berechnen.

## Production Checklist

- [ ] Jedes Metrik-Label ist explizit auf begrenzten, überschaubaren Wertebereich geprüft.
- [ ] Latenz- und Größenverteilungen werden über Histogramme mit Perzentilberechnung erfasst.
- [ ] Counter-Raten berücksichtigen korrekt Prozessneustart-Resets.
- [ ] Die Gesamtanzahl aktiver Zeitreihen wird aktiv gegen erwartete Werte überwacht.

## Interviewfragen

### 1. Was ist der Unterschied zwischen einem Counter und einer Gauge?

**Antwort:** Ein Counter steigt monoton (bis auf Resets bei Neustart), üblicherweise ist seine Änderungsrate aussagekräftiger als der Rohwert; eine Gauge ist ein Momentanwert, der sowohl steigen als auch fallen kann.

### 2. Warum sind Histogramme aussagekräftiger als reine Durchschnittswerte für Latenzmessungen?

**Antwort:** Weil ein Durchschnittswert eine kleine Anzahl extrem langsamer Anfragen durch eine viel größere Anzahl schneller Anfragen verschleiern kann, während ein Histogramm die tatsächliche Verteilung erfasst und aussagekräftige Perzentilberechnungen ermöglicht.

### 3. Was ist Kardinalität im Kontext von Metriken?

**Antwort:** Die Anzahl eindeutiger Kombinationen aus Metriknamen und allen zugehörigen Label-Werten, wobei jede eindeutige Kombination eine separate, tatsächlich gespeicherte Zeitreihe erzeugt.

### 4. Warum ist ein einzelnes Label mit hochvariablen Werten besonders riskant?

**Antwort:** Weil jeder tatsächlich auftretende, eindeutige Wert eine eigene, permanent gespeicherte Zeitreihe erzeugt, wodurch die Gesamtzahl der Zeitreihen bei ausreichendem Anfragevolumen und Wertevariabilität unkontrolliert wächst und das Metriksystem überlasten kann.

### 5. Wie gehst du vor, wenn das Metriksystem unter hoher Last überlastet wird oder ausfällt?

**Antwort:** Ich prüfe, ob ein Metrik-Label mit hochvariablen, im Wesentlichen eindeutigen Werten Kardinalitätsexplosion verursacht, da dies die häufigste Ursache für Metriksystem-Überlastung ist, nicht die Anzahl unterschiedlicher Metriken selbst.

### 6. Widersprüchliche Anforderung: Team will detaillierte, pro-Nutzer-aufgeschlüsselte Metriken zur individuellen Fehlerdiagnose UND garantiert stabile, nicht kardinalitätsbedingt überlastete Metriksysteme — wie gehst du vor?

**Antwort:** Ich würde vorschlagen, pro-Nutzer-spezifische Diagnoseinformationen über strukturiertes Logging oder Tracing statt über hochkardinale Metrik-Labels zu erfassen, während Metriken selbst auf begrenzte, aggregierbare Dimensionen (Nutzergruppe statt individuelle Nutzer-ID) beschränkt bleiben — detaillierte Diagnose und stabile Metriksysteme lassen sich durch die Nutzung des jeweils passenden Observability-Signaltyps statt durch Überladung von Metriken mit für sie ungeeigneten, hochkardinalen Daten vereinbaren.

## Praktische Labs

~~~python
# Local, deterministic simulation of cardinality growth from a high-variability label (executed locally, no real metric system):

def count_time_series(requests, label_key):
    unique_values = set(r[label_key] for r in requests)
    return len(unique_values)

requests_bounded_label = [{"status_code": code} for code in [200, 200, 404, 200, 500, 200] * 1000]
requests_unbounded_label = [{"user_id": f"user-{i}"} for i in range(6000)]

print(f"bounded label (status_code) time series count: {count_time_series(requests_bounded_label, 'status_code')}")
print(f"unbounded label (user_id) time series count: {count_time_series(requests_unbounded_label, 'user_id')}")
~~~

## Dependencies, Cross-References und Quellen

1. Prometheus-Dokumentation: [Metric Types](https://prometheus.io/docs/concepts/metric_types/), abgerufen 2026-09-18.
2. Prometheus-Dokumentation: [Cardinality — Best Practices](https://prometheus.io/docs/practices/naming/#labels), abgerufen 2026-09-18.

Error Budgets sind kanonisch in [KB-0566](02-error-budgets.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Kardinalitäts-Vorabprüfung, die neue Metrik-Label-Definitionen bereits vor Deployment gegen erwartete Wertevariabilität validiert | Evaluating | Gegenüber rein manueller Code-Review-Prüfung erst nach Prüfung der tatsächlichen Erkennungsgenauigkeit für dynamisch generierte Label-Werte bevorzugen. |

Ein Team akzeptiert eine Metrik-Definition erst, wenn nachweislich alle Labels auf begrenzten, überschaubaren Wertebereichen basieren und keine Kardinalitätsexplosion riskieren.
