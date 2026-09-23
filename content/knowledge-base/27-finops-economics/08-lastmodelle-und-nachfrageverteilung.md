---
{"id": "KB-0642", "title": "Lastmodelle und Nachfrageverteilung", "domain": "27", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "PLATFORM", "GENAI", "CHIEF"], "requires": [{"id": "KB-0641", "concepts": ["Kapazitätsplanung und Reserven"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Gleichzeitigkeit, Spitzen und Arbeitseinheiten für ein konkretes System definieren und offene sowie geschlossene Lastmodelle für realistische Kapazitäts- und Kostenprognosen anhand etablierter Praxis vergleichen können, aufbauend auf der bereits in KB-0641 behandelten quantitativen Kapazitätsplanung.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, ob ein offenes oder geschlossenes Lastmodell die tatsächliche Nachfragecharakteristik eines Systems korrekt abbildet, um realistische statt strukturell verzerrte Kapazitäts- und Kostenprognosen zu erzeugen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein Lasttest mit einem geschlossenen Modell fälschlich für ein System mit tatsächlich offener Nachfragecharakteristik durchgeführt wurde, und die daraus resultierende, systematische Unterschätzung tatsächlichen Sättigungsverhaltens einordnen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Lastmodellierung festlegen, die die korrekte Wahl zwischen offenem und geschlossenem Modell anhand der tatsächlichen Nachfragecharakteristik verbindlich vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die vollständige, mathematische Herleitung offener und geschlossener Warteschlangenmodelle im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis, welches Modell die tatsächliche Nachfragecharakteristik eines Systems korrekt abbildet, nicht die vollständige, mathematische Modellherleitung."}}, "lab_validation": [{"lab_id": "KB-0642-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Demonstration des Unterschieds zwischen offenem und geschlossenem Lastmodell unter Systemsättigung, kein produktives Lasttest-Tool verwendet", "evidence": "Ein lokales Skript simuliert dasselbe System unter Sättigung sowohl mit einem geschlossenen Lastmodell (feste Anzahl gleichzeitiger Nutzer, die auf Antworten warten) als auch mit einem offenen Lastmodell (unabhängig ankommende Anfragen unabhängig von Systemzustand) und zeigt, wie das geschlossene Modell die tatsächliche Sättigung systematisch verdeckt.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Lasttest-Tool."}]}
---
# Lastmodelle und Nachfrageverteilung

> **Ziel:** Dieses Kapitel vertieft die bereits in [KB-0641](07-kapazitaetsplanung-und-reserven.md) behandelte, quantitative Kapazitätsplanung um die grundlegende Unterscheidung zwischen **offenen** und **geschlossenen Lastmodellen**. Der zentrale Punkt dieses Kapitels ist, dass diese Modellwahl die tatsächliche Nachfragecharakteristik eines Systems entweder korrekt abbildet oder strukturell verzerrt: Ein **geschlossenes Lastmodell** nimmt eine feste Anzahl gleichzeitiger Nutzer an, die jeweils auf eine Antwort warten, bevor sie die nächste Anfrage stellen (die tatsächliche Anfragerate sinkt automatisch, wenn das System langsamer wird, da wartende Nutzer keine neuen Anfragen stellen); ein **offenes Lastmodell** nimmt an, dass Anfragen unabhängig vom aktuellen Systemzustand ankommen (die tatsächliche Anfragerate bleibt auch bei einem langsamen oder gesättigten System konstant hoch). Ein Lasttest oder eine Kapazitätsprognose, die fälschlich ein geschlossenes Modell für ein System mit tatsächlich offener Nachfragecharakteristik verwendet, verdeckt systematisch das tatsächliche Sättigungsverhalten des Systems, da das geschlossene Modell die Anfragerate bei Verlangsamung automatisch reduziert, während die tatsächliche, offene Last unvermindert weiter ansteigt.

## Zweck, Mental Model und Dependencies

Die Wahl zwischen offenem und geschlossenem Lastmodell hängt davon ab, wie neue Anfragen in der tatsächlichen Realität eines Systems entstehen: Bei einem geschlossenen System (etwa eine interaktive Anwendung mit einer festen Anzahl angemeldeter Nutzer, die jeweils auf eine Antwort warten, bevor sie interagieren) sinkt die tatsächliche Anfragerate automatisch, wenn das System langsamer antwortet, da wartende Nutzer keine zusätzlichen, neuen Anfragen erzeugen können, solange ihre vorherige Anfrage noch unbeantwortet ist — dieses selbstregulierende Verhalten ist eine strukturelle Eigenschaft geschlossener Systeme, nicht ein Zeichen tatsächlicher Systemstabilität. Bei einem offenen System (etwa eine öffentliche API, die von zahlreichen, voneinander unabhängigen externen Clients aufgerufen wird, die jeweils unabhängig von der Antwortzeit anderer Clients neue Anfragen senden) bleibt die tatsächliche Anfragerate dagegen unabhängig vom aktuellen Systemzustand bestehen — eine Verlangsamung des Systems reduziert nicht automatisch die eingehende Anfragerate, sondern führt tatsächlich zu einer wachsenden Warteschlange, die bei anhaltender Überlast tatsächlich kollabieren kann. Der entscheidende, praktische Fehler entsteht, wenn ein Lasttest oder eine Kapazitätsprognose das falsche Modell für die tatsächliche Nachfragecharakteristik eines Systems verwendet: Ein geschlossenes Lastmodell, das für ein tatsächlich offenes System (etwa eine öffentliche API) angewendet wird, zeigt in Testergebnissen eine scheinbare, automatische Selbstregulierung bei Überlast, die in der tatsächlichen, offenen Produktionsrealität nicht existiert — das System wirkt im Test stabiler, als es tatsächlich ist, weil das geschlossene Modell die Anfragerate künstlich reduziert, sobald das System langsamer wird, statt die tatsächliche, unvermindert hohe Anfragerate eines offenen Systems widerzuspiegeln. Diese Verzerrung führt zu einer systematisch zu niedrig bemessenen Kapazitätsreserve (siehe die bereits in [KB-0641](07-kapazitaetsplanung-und-reserven.md) behandelte Reservenbemessung), da die tatsächliche Sättigungsgefahr im Testergebnis unterschätzt wird.

~~~text
This chapter deepens KB-0641's quantitative capacity planning w/ fundamental distinction
  between OPEN and CLOSED load models
KEY POINT: this model choice either correctly represents or structurally distorts a system's
  actual demand characteristic
  CLOSED load model: assumes fixed number of concurrent users, each waiting for a response
  before issuing next request (actual request rate automatically drops when system slows,
  since waiting users issue no new requests)
  OPEN load model: assumes requests arrive independent of current system state (actual request
  rate stays constantly high even under slow/saturated system)
  load test/capacity forecast wrongly using closed model for system w/ actually open demand
  characteristic -> systematically CONCEALS actual saturation behavior
  (closed model automatically reduces request rate on slowdown, while actual open load keeps
  rising unabated)
MODEL CHOICE depends on how new requests ACTUALLY arise in a system's actual reality
  CLOSED system (interactive app w/ fixed number of logged-in users, each waiting for response
    before interacting): actual request rate automatically drops when system responds slower
    since waiting users cannot generate additional new requests while previous request
    unanswered
    this self-regulating behavior = STRUCTURAL PROPERTY of closed systems, NOT a sign of
    actual system stability
  OPEN system (public API called by numerous, mutually independent external clients, each
    sending new requests independent of other clients' response times): actual request rate
    persists INDEPENDENT of current system state
    system slowdown does NOT automatically reduce incoming request rate -- instead ACTUALLY
    leads to growing queue, which can actually collapse under sustained overload
DECISIVE, PRACTICAL ERROR: load test/capacity forecast using WRONG model for a system's actual
  demand characteristic
  closed load model applied to actually-open system (public API)
  -> shows apparent, automatic self-regulation under overload in test results, that does NOT
     exist in actual, open production reality
  system appears MORE stable in test than it actually is, because closed model artificially
  reduces request rate once system slows, instead of reflecting actual, undiminished high
  request rate of an open system
this distortion -> systematically undersized capacity reserve (KB-0641 reserve sizing),
  since actual saturation danger is UNDERESTIMATED in test result
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Geschlossenes Lastmodell | feste Nutzeranzahl, wartet auf Antwort vor nächster Anfrage | selbstregulierend, senkt Rate automatisch bei Verlangsamung |
| Offenes Lastmodell | unabhängig ankommende Anfragen | Rate bleibt bei Verlangsamung unvermindert hoch |
| Modell-Realitäts-Passung | prüft, welches Modell die tatsächliche Nachfrage korrekt abbildet | falsche Wahl verdeckt tatsächliches Sättigungsverhalten |
| Kapazitätsreserven-Konsequenz | falsches Modell führt zu systematisch zu niedriger Reserve | verbindet sich direkt mit KB-0641 Reservenbemessung |

Implementierung: Für jedes System wird explizit geprüft, ob seine tatsächliche Nachfragecharakteristik offen (unabhängige, externe Clients) oder geschlossen (feste Nutzeranzahl, wartend auf Antwort) ist. Lasttests werden mit dem Modell durchgeführt, das der tatsächlichen Nachfragecharakteristik entspricht, statt aus Bequemlichkeit ein einfacheres, aber tatsächlich unpassendes Modell zu wählen. Kapazitätsreserven werden auf Basis des korrekten Lastmodells bemessen.

## Scalability, Reliability, Security und Observability

Lastmodelle und Nachfrageverteilung skalieren die tatsächliche Aussagekraft von Lasttests und Kapazitätsprognosen proportional zur korrekten Wahl zwischen offenem und geschlossenem Modell; die Reliability-Grenze liegt darin, dass ein falsch gewähltes Modell das tatsächliche Sättigungsverhalten eines Systems systematisch verdeckt und zu einer gefährlich unterdimensionierten Kapazitätsreserve führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein System, das in Lasttests stabil erschien, sättigt in Produktion unerwartet | der Lasttest verwendete fälschlich ein geschlossenes Modell für ein tatsächlich offenes System | den Lasttest mit einem offenen Lastmodell wiederholen, das unabhängig ankommende Anfragen simuliert |
| eine Kapazitätsreserve erweist sich als deutlich zu knapp bemessen | die zugrunde liegende Kapazitätsprognose basierte auf einem für das System unpassenden Lastmodell | die Nachfragecharakteristik des Systems (offen oder geschlossen) explizit bestimmen und die Prognose entsprechend korrigieren |
| ein interaktives System mit fester Nutzeranzahl zeigt in Tests ein unrealistisch aggressives Sättigungsverhalten | ein offenes Modell wurde fälschlich für ein tatsächlich geschlossenes System verwendet | das Lastmodell auf die tatsächliche, geschlossene Nachfragecharakteristik umstellen |

Security: Ein System mit tatsächlich offener Nachfragecharakteristik, das fälschlich als geschlossen getestet wurde, kann bei einem tatsächlichen Lastangriff (etwa einem verteilten Denial-of-Service) unerwartet schnell kollabieren, da die tatsächliche Sättigungsgrenze im Test nicht korrekt ermittelt wurde. Observability: Die tatsächliche Übereinstimmung zwischen dem in Lasttests verwendeten Modell und der tatsächlich beobachteten Produktionsnachfragecharakteristik ist ein zentrales Signal zur Bewertung der Testverlässlichkeit.

## Trade-offs und Entscheidungen

**Staff** wählt für ein gegebenes System korrekt zwischen offenem und geschlossenem Lastmodell und führt einen entsprechenden Lasttest durch. **Principal** entwirft die vollständige Lastmodellierungsstrategie mit korrekter Modellwahl für die Systeme eines Geschäftsbereichs. **Chief** legt unternehmensweite Standards für Lastmodellierung fest, die korrekte Modellwahl anhand tatsächlicher Nachfragecharakteristik verbindlich vorschreiben.

Anti-Patterns: ein geschlossenes Lastmodell aus Bequemlichkeit für ein tatsächlich offenes System (öffentliche API) verwenden; Lasttestergebnisse als Nachweis tatsächlicher Systemstabilität interpretieren, ohne die verwendete Modellart zu prüfen; Kapazitätsreserven auf Basis eines für das System unpassenden Lastmodells bemessen.

## Production Checklist

- [ ] Die tatsächliche Nachfragecharakteristik (offen oder geschlossen) jedes Systems ist explizit bestimmt.
- [ ] Lasttests werden mit dem der tatsächlichen Nachfragecharakteristik entsprechenden Modell durchgeführt.
- [ ] Kapazitätsreserven basieren auf dem korrekten Lastmodell.
- [ ] Lasttestergebnisse werden explizit auf Übereinstimmung mit dem tatsächlichen Produktionsverhalten überprüft.

## Interviewfragen

### 1. Was unterscheidet ein geschlossenes von einem offenen Lastmodell?

**Antwort:** Ein geschlossenes Modell nimmt eine feste Nutzeranzahl an, die auf Antworten wartet, wodurch die Anfragerate bei Verlangsamung automatisch sinkt; ein offenes Modell nimmt unabhängig ankommende Anfragen an, deren Rate auch bei Verlangsamung unvermindert hoch bleibt.

### 2. Warum kann ein geschlossenes Lastmodell für ein tatsächlich offenes System irreführend sein?

**Antwort:** Weil es eine scheinbare, automatische Selbstregulierung bei Überlast zeigt, die in der tatsächlichen, offenen Produktionsrealität nicht existiert, wodurch das System im Test stabiler erscheint, als es tatsächlich ist.

### 3. Welche Konsequenz hat die falsche Lastmodellwahl für die Kapazitätsreservenbemessung?

**Antwort:** Sie führt zu einer systematisch zu niedrig bemessenen Kapazitätsreserve, da die tatsächliche Sättigungsgefahr im Testergebnis unterschätzt wird.

### 4. Wann ist ein geschlossenes Lastmodell die korrekte Wahl?

**Antwort:** Bei Systemen mit einer tatsächlich festen Nutzeranzahl, die jeweils auf eine Antwort warten, bevor sie interagieren, etwa interaktive Anwendungen mit angemeldeten Nutzern.

### 5. Wie gehst du vor, wenn ein System, das in Lasttests stabil erschien, in Produktion unerwartet sättigt?

**Antwort:** Ich prüfe, ob der Lasttest fälschlich ein geschlossenes Modell für ein tatsächlich offenes System verwendete, und wiederhole den Test mit einem offenen Lastmodell, das unabhängig ankommende Anfragen simuliert.

### 6. Widersprüchliche Anforderung: Das Testteam will einfache, standardisierte Lasttest-Tools verwenden UND die Organisation will realistische, modellkonforme Kapazitätsprognosen — wie gehst du vor?

**Antwort:** Ich würde für jedes System explizit dokumentieren, welches Lastmodell tatsächlich zutrifft, und sicherstellen, dass die standardisierten Testwerkzeuge entsprechend konfiguriert werden, statt entweder auf modellkorrekte Tests zu verzichten oder für jedes System ein völlig eigenständiges Testwerkzeug zu entwickeln.

## Praktische Labs

~~~python
# Local, deterministic simulation of open vs closed load model behavior under system slowdown (executed locally, no real load testing tool):

def simulate_load(model, concurrent_users, service_time_factor):
    if model == "closed":
        effective_request_rate = concurrent_users / service_time_factor  # rate drops as service slows
    else:  # open
        effective_request_rate = concurrent_users  # rate stays constant regardless of slowdown
    return {"model": model, "effective_request_rate": round(effective_request_rate, 1)}

print(simulate_load("closed", concurrent_users=100, service_time_factor=1))
print(simulate_load("closed", concurrent_users=100, service_time_factor=4))  # system slowed 4x
print(simulate_load("open", concurrent_users=100, service_time_factor=4))    # rate unaffected
~~~

## Dependencies, Cross-References und Quellen

1. Bent Schwarz, William Walsh (referenced methodology): [Open Versus Closed: A Cautionary Tale (USENIX NSDI)](https://www.usenix.org/legacy/events/nsdi06/tech/schroeder.html), abgerufen 2026-09-18.
2. Google SRE Workbook: [Load Testing and Capacity Planning](https://sre.google/workbook/implementing-slos/), abgerufen 2026-09-18.

Kapazitätsplanung und Reserven sind kanonisch in [KB-0641](07-kapazitaetsplanung-und-reserven.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, hybride Lasttest-Werkzeuge, die sowohl offene als auch geschlossene Lastmodelle parallel simulieren, um die Modellwahl-Sensitivität sichtbar zu machen | Evaluating | Als Diagnosewerkzeug einführen, um zu erkennen, wie empfindlich das Testergebnis von der Modellwahl abhängt, jedoch die endgültige Modellwahl weiterhin anhand der tatsächlichen, analysierten Nachfragecharakteristik des Systems treffen. |

Ein Team akzeptiert eine Lastmodellierung erst, wenn die tatsächliche Nachfragecharakteristik (offen oder geschlossen) des Systems explizit bestimmt und Lasttests sowie Kapazitätsreserven nachweislich mit dem korrekten Modell durchgeführt wurden.
