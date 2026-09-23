---
{"id": "KB-0565", "title": "SLI, SLO und SLA", "domain": "24", "sequence": 1, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "CLOUD", "MLOPS"], "requires": [], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "SLIs, SLOs und SLAs anhand etablierter SRE-Praktiken korrekt unterscheiden und für ein konkretes System definieren können, inklusive Messfenster und gültiger Ereignisse.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Anwendung explizit gestalten, wie nutzernahe Indikatoren (SLIs), interne Ziele (SLOs) und vertragliche Zusagen (SLAs) zusammenwirken, mit einer bewussten Sicherheitsmarge zwischen internem Ziel und externer Zusage.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine vertraglich verletzte SLA auf ein SLO zurückführen können, das ohne Sicherheitsmarge identisch mit der SLA definiert wurde, wodurch jede kleinste interne Zielverletzung automatisch zur vertraglichen Verletzung wird.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für die Definition von SLIs, SLOs und SLAs mit bewusster Sicherheitsmarge zwischen internem Ziel und externer Zusage festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Detailimplementierung spezifischer SLO-Monitoring-Werkzeuge im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der begrifflichen Unterscheidung und der Sicherheitsmarge zwischen SLO und SLA, nicht die werkzeugspezifische Implementierung."}}, "lab_validation": [{"lab_id": "KB-0565-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation der Konsequenz identischer SLO-/SLA-Werte ohne Sicherheitsmarge, kein produktives Monitoring-System verwendet", "evidence": "Ein lokales Skript simuliert, wie ein System mit identisch definiertem SLO und SLA (etwa beide auf 99.9% Verfügbarkeit) bei jeder Unterschreitung des internen SLO-Ziels automatisch auch die vertragliche SLA verletzt, während ein System mit einer expliziten Sicherheitsmarge (SLO strenger als SLA, etwa 99.95% intern gegenüber 99.9% vertraglich) einen Puffer besitzt, der eine interne Zielverletzung erkennbar macht, bevor sie zur vertraglichen Konsequenz wird.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Monitoring-System mit tatsächlicher Produktionsverfügbarkeitsdynamik."}]}
---
# SLI, SLO und SLA

> **Ziel:** Ein Service Level Indicator (SLI) ist ein konkret **messbarer, nutzernaher Indikator** (etwa die tatsächliche Erfolgsrate von HTTP-Anfragen oder die tatsächlich gemessene Antwortzeit), ein Service Level Objective (SLO) ist ein **internes Ziel**, das ein Team sich für diesen Indikator setzt (etwa "99.95% der Anfragen erfolgreich innerhalb von 30 Tagen"), und eine Service Level Agreement (SLA) ist eine **vertragliche Zusage** gegenüber Kunden, oft mit finanziellen oder anderen Konsequenzen bei Nichteinhaltung. Der zentrale Punkt dieses Kapitels ist, dass zwischen SLO und SLA eine bewusste **Sicherheitsmarge** bestehen sollte — das interne SLO sollte strenger sein als die extern zugesagte SLA, da eine identische Definition beider Werte dazu führt, dass jede kleinste interne Zielverletzung automatisch und ohne Vorwarnung zur vertraglichen, potenziell finanziell folgenreichen SLA-Verletzung wird, ohne dass dem Team ein interner Puffer zur Reaktion verbleibt, bevor die vertragliche Konsequenz tatsächlich eintritt.

## Zweck, Mental Model und Dependencies

Ein SLI ist die grundlegende, messbare Tatsache — ein Zahlenwert, der aus tatsächlichen, beobachteten Systemereignissen berechnet wird, etwa der Anteil erfolgreicher Anfragen an der Gesamtzahl aller Anfragen innerhalb eines definierten Messfensters. Die Definition eines SLI erfordert dabei explizite Festlegung, was als "gültiges Ereignis" zählt — zählen fehlgeschlagene Anfragen, die auf einen Client-Fehler (etwa eine ungültige Eingabe) statt auf ein tatsächliches Systemversagen zurückzuführen sind, zum Nenner der Berechnung? Eine unpräzise SLI-Definition kann die tatsächliche Nutzererfahrung entweder zu optimistisch oder zu pessimistisch darstellen, abhängig davon, wie diese Randfälle behandelt werden. Ein SLO baut auf einem SLI auf und setzt ein konkretes, internes Ziel für diesen Indikator über ein definiertes Messfenster (etwa ein gleitendes 30-Tage-Fenster) — dieses Ziel dient dem Team als operative Steuerungsgröße, um zu entscheiden, ob aktuell Kapazität für neue Feature-Entwicklung vorhanden ist oder ob stattdessen Zuverlässigkeitsarbeit priorisiert werden muss (das sogenannte Error-Budget-Konzept, bei dem die Differenz zwischen 100% und dem SLO-Ziel als "Budget" für akzeptable Fehler verstanden wird). Eine SLA ist strukturell etwas anderes als eine bloße, ambitioniertere Version des SLO — sie ist eine vertragliche, extern kommunizierte Zusage mit potenziell finanziellen Konsequenzen bei Nichteinhaltung (etwa Erstattungen an Kunden). Die entscheidende architektonische Entscheidung ist, dass das interne SLO bewusst strenger als die externe SLA gewählt werden sollte — wird beispielsweise eine SLA von 99.9% Verfügbarkeit vertraglich zugesagt, sollte das interne SLO-Ziel höher liegen (etwa 99.95%), sodass das Team bereits durch eine interne SLO-Verletzung gewarnt wird und Zeit hat, gegenzusteuern, bevor die tatsächliche, vertraglich bindende SLA-Schwelle unterschritten wird — ohne diese Sicherheitsmarge fällt jede geringfügige interne Zielverletzung unmittelbar mit der vertraglichen Konsequenz zusammen, was dem Team keinen Handlungsspielraum lässt, bevor der Schaden bereits eingetreten ist.

~~~text
SLI (Service Level Indicator): concretely MEASURABLE, user-facing metric
  (e.g. actual success rate of requests, actual measured response time)
  -> requires EXPLICIT definition of "valid event" (does a client error count in the denominator?)
     imprecise SLI definition -> misrepresents actual user experience (too optimistic OR pessimistic)
SLO (Service Level Objective): INTERNAL target for an SLI over a defined measurement window
  (e.g. "99.95% success within rolling 30-day window")
  -> operational steering: Error Budget concept -- gap between 100% and SLO target = acceptable-failure budget
SLA (Service Level Agreement): CONTRACTUAL, externally communicated commitment
  -> potential FINANCIAL consequences on breach (e.g. customer refunds)
CRITICAL ARCHITECTURAL DECISION: internal SLO should be DELIBERATELY STRICTER than external SLA
  e.g. SLA=99.9% contractual -> SLO=99.95% internal (higher/stricter)
  -> team gets EARLY WARNING via internal SLO breach, time to react BEFORE binding SLA threshold is crossed
  WITHOUT this margin: every minor internal target miss COINCIDES IMMEDIATELY with contractual consequence
    -> no room to react before damage already occurred
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| SLI | messbarer, nutzernaher Indikator | Definition gültiger Ereignisse entscheidet über Aussagekraft |
| SLO | internes Zuverlässigkeitsziel | steuert operative Priorisierung (Error Budget) |
| SLA | vertragliche, extern kommunizierte Zusage | hat finanzielle/vertragliche Konsequenzen |
| Sicherheitsmarge SLO-SLA | internes Ziel strenger als externe Zusage | verhindert unmittelbare Deckungsgleichheit von Fehlschlag und Konsequenz |

Implementierung: Für jeden SLI wird explizit definiert, welche Ereignisse als gültig für die Berechnung gelten, mit besonderer Sorgfalt bei Client-Fehlern und Randfällen. SLOs werden mit einem definierten Messfenster festgelegt, das der tatsächlichen Bewertungsperiode entspricht. Zwischen internem SLO und externer SLA wird bewusst eine Sicherheitsmarge eingeplant, sodass das SLO strenger als die SLA ist.

## Scalability, Reliability, Security und Observability

SLI/SLO/SLA-Praxis skaliert die tatsächliche Frühwarnfähigkeit proportional zur bewusst gewählten Sicherheitsmarge zwischen internem SLO und externer SLA; die Reliability-Grenze liegt darin, dass eine fehlende oder zu geringe Marge proportional zur Häufigkeit von Zielverletzungen zu unmittelbaren, unvorbereiteten vertraglichen Konsequenzen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine vertragliche SLA-Verletzung tritt ohne interne Vorwarnung ein | das SLO ist identisch mit oder weniger streng als die SLA definiert | das interne SLO explizit strenger als die vertragliche SLA neu definieren |
| ein SLI stellt die tatsächliche Nutzererfahrung verzerrt dar | die Definition gültiger Ereignisse berücksichtigt Client-Fehler oder Randfälle nicht korrekt | die SLI-Definition explizit gegen die tatsächliche, beabsichtigte Nutzererfahrung prüfen |
| ein Team kann nicht entscheiden, ob Kapazität für neue Features oder Zuverlässigkeit priorisiert werden soll | kein Error-Budget-Konzept basierend auf dem SLO wird genutzt | ein explizites Error-Budget aus der Differenz zwischen 100% und dem SLO-Ziel ableiten und zur Priorisierung nutzen |

Security: SLI-Definitionen sollten nicht so gestaltet werden, dass sicherheitsrelevante Fehlerfälle (etwa blockierte, potenziell bösartige Anfragen) fälschlich als "Systemfehler" statt als beabsichtigtes Verhalten gezählt werden. Observability: Die tatsächliche Differenz zwischen internem SLO-Erfüllungsgrad und externer SLA-Schwelle, sowie die Häufigkeit von Error-Budget-Verbrauch relativ zum Messfenster, sind zentrale Betriebssignale.

## Trade-offs und Entscheidungen

**Staff** implementiert eine korrekte SLI-Messung für einen gegebenen Dienst. **Principal** entwirft SLO-Ziele mit angemessener Sicherheitsmarge zur externen SLA und definiertem Error-Budget-Konzept. **Chief** legt unternehmensweite Standards für die Beziehung zwischen internem SLO und vertraglicher SLA fest.

Anti-Patterns: SLO und SLA identisch oder mit unzureichender Marge definieren; SLI-Definitionen ohne explizite Klärung gültiger Ereignisse (insbesondere Client-Fehler) festlegen; kein Error-Budget-Konzept zur operativen Priorisierung zwischen Feature-Entwicklung und Zuverlässigkeitsarbeit nutzen.

## Production Checklist

- [ ] Jeder SLI hat eine explizite Definition gültiger Ereignisse, inklusive Behandlung von Client-Fehlern.
- [ ] SLOs sind mit einem klar definierten Messfenster festgelegt.
- [ ] Zwischen internem SLO und externer SLA besteht eine bewusste, dokumentierte Sicherheitsmarge.
- [ ] Ein Error-Budget-Konzept wird aktiv zur Priorisierung zwischen Feature-Entwicklung und Zuverlässigkeitsarbeit genutzt.

## Interviewfragen

### 1. Was ist der Unterschied zwischen einem SLI, einem SLO und einer SLA?

**Antwort:** Ein SLI ist ein messbarer, nutzernaher Indikator; ein SLO ist ein internes Ziel für diesen Indikator; eine SLA ist eine vertragliche, extern kommunizierte Zusage mit potenziellen finanziellen Konsequenzen.

### 2. Warum sollte das interne SLO strenger als die externe SLA sein?

**Antwort:** Damit das Team bereits durch eine interne SLO-Verletzung gewarnt wird und Zeit hat gegenzusteuern, bevor die tatsächliche, vertraglich bindende SLA-Schwelle unterschritten wird.

### 3. Was passiert, wenn SLO und SLA identisch definiert sind?

**Antwort:** Jede kleinste interne Zielverletzung fällt unmittelbar mit der vertraglichen Konsequenz zusammen, ohne dass dem Team ein interner Puffer zur Reaktion verbleibt.

### 4. Was ist ein Error Budget?

**Antwort:** Die Differenz zwischen 100% und dem SLO-Ziel, verstanden als akzeptables "Budget" für Fehler, das zur operativen Entscheidung zwischen neuer Feature-Entwicklung und Zuverlässigkeitsarbeit genutzt wird.

### 5. Wie gehst du vor, wenn eine vertragliche SLA-Verletzung ohne interne Vorwarnung eintritt?

**Antwort:** Ich prüfe, ob das SLO identisch mit oder weniger streng als die SLA definiert ist, und definiere das interne SLO explizit strenger, um zukünftig eine Sicherheitsmarge und Frühwarnung zu gewährleisten.

### 6. Widersprüchliche Anforderung: Vertrieb will eine möglichst großzügige, leicht einzuhaltende SLA für Kunden zusagen UND das Technikteam will ein realistisches, nicht künstlich abgesenktes internes SLO als tatsächliche Zuverlässigkeitsgrundlage — wie gehst du vor?

**Antwort:** Ich würde erklären, dass die SLA als vertragliche Untergrenze unabhängig vom internen SLO-Anspruch festgelegt werden kann, solange sie mit ausreichender Marge unter dem tatsächlich angestrebten, realistischen internen SLO liegt — eine großzügige SLA und ein anspruchsvolles internes SLO widersprechen sich nicht, solange die Marge zwischen beiden bewusst und nicht zufällig entsteht.

## Praktische Labs

~~~python
# Local, deterministic simulation of SLO/SLA margin effect on early-warning capability (executed locally, no real monitoring system):

def check_breach(actual_availability, slo_target, sla_target):
    slo_breached = actual_availability < slo_target
    sla_breached = actual_availability < sla_target
    return {"slo_breached": slo_breached, "sla_breached": sla_breached, "early_warning": slo_breached and not sla_breached}

print("no margin (SLO=SLA=99.9%):", check_breach(99.85, slo_target=99.9, sla_target=99.9))
print("with margin (SLO=99.95%, SLA=99.9%):", check_breach(99.92, slo_target=99.95, sla_target=99.9))
~~~

## Dependencies, Cross-References und Quellen

1. Google-Dokumentation: [Site Reliability Engineering — Service Level Objectives](https://sre.google/sre-book/service-level-objectives/), abgerufen 2026-09-18.
2. Google-Dokumentation: [The Site Reliability Workbook — Implementing SLOs](https://sre.google/workbook/implementing-slos/), abgerufen 2026-09-18.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Anomalieerkennung, die dynamische, kontextabhängige SLO-Schwellenwerte statt fester, statischer Ziele vorschlägt | Evaluating | Gegenüber festen, klar kommunizierbaren SLO-Zielen erst nach Prüfung der tatsächlichen Nachvollziehbarkeit und Akzeptanz dynamischer Schwellenwerte im Team bevorzugen. |

Ein Team akzeptiert eine SLI-/SLO-/SLA-Struktur erst, wenn SLI-Definitionen präzise, SLOs mit klarem Messfenster, und eine bewusste Sicherheitsmarge zwischen SLO und SLA nachweislich etabliert sind.
