---
{"id": "KB-0115", "title": "Timeouts und Deadline-Budgets", "domain": "05", "sequence": 15, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0056", "concepts": ["Verbindung", "Timeout"], "needed_for": "both"}, {"id": "KB-0114", "concepts": ["Retry", "Backoff"], "needed_for": "understanding"}], "related": ["KB-0101", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Deadline-Weitergabe über eine simulierte dreistufige Dienstkette implementieren und einen Budgetüberschreitungsfall erzeugen.", "rationale": "Kein echtes verteiltes System nötig, um das Prinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Verbindungs-, Lese- und Gesamtzeitgrenzen sowie Deadline-Propagation für eine Dienstkette entwerfen.", "rationale": "Ein einzelner globaler Timeout pro Aufruf ignoriert die kumulative Natur von Dienstketten."}, "STAFF-TARGET": {"active": true, "scope": "Eine Kette diagnostizieren, in der ein innerer Dienst trotz überschrittener Gesamtdeadline weiterarbeitet.", "rationale": "Fortlaufende Hintergrundarbeit nach Client-Abbruch verschwendet Ressourcen und kann Race Conditions erzeugen."}, "CHIEF-TARGET": {"active": true, "scope": "Deadline-Propagation als Standard für alle internen Dienstaufrufe mit mehrstufigen Ketten festlegen.", "rationale": "Fehlende Propagation erzeugt unsichtbare Ressourcenverschwendung und inkonsistente Nutzererfahrung bei Latenzproblemen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "gRPC-Deadline-Propagation im Detail und adaptive Timeout-Berechnung (z. B. auf Basis historischer P99) sind Vertiefung.", "rationale": "Kern ist das Prinzip der Budgetaufteilung und -weitergabe über eine Kette."}}, "lab_validation": [{"lab_id": "KB-0115-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für eine dreistufige Aufrufkette mit Deadline-Propagation", "evidence": "Der dritte Dienst in der Kette erhält ein bereits verbrauchtes Restbudget und bricht korrekt vor Ausführung ab, statt unnötig zu arbeiten.", "limitations": "Kein reales Netzwerk, keine echte Dienstkette, keine Produktion."}]}
---
# Timeouts und Deadline-Budgets

> **Ziel:** Ein einzelner Timeout pro Aufruf reicht in einer mehrstufigen Dienstkette nicht aus — ohne Deadline-Propagation kann ein innerer Dienst weiterarbeiten, obwohl der äußere Aufrufer längst abgebrochen hat, und jeder Hop kann sein eigenes volles Zeitbudget verbrauchen, statt das verbleibende Gesamtbudget zu respektieren.

## Zweck, Mental Model und Dependencies

Verbindungs-Timeout (Zeit bis Verbindungsaufbau), Lese-Timeout (Zeit zwischen Datenpaketen) und Gesamt-Timeout (Zeit für die vollständige Operation) sind unterschiedliche Grenzen mit unterschiedlichem Zweck. In einer Dienstkette A→B→C muss die Deadline von A an B und von B an C weitergegeben werden, jeweils reduziert um die bereits verstrichene Zeit — sonst kann C noch minutenlang arbeiten, obwohl A längst aufgegeben hat. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0056](../03-network-foundations/08-tcp-verbindungen-und-ueberlastkontrolle.md) und [KB-0114](14-retries-und-wiederholungsstuerme.md).

~~~text
Client sets deadline=T+2000ms -> A (uses 300ms) -> propagates deadline=T+2000ms to B
B (uses 400ms) -> propagates remaining budget=1300ms to C
C sees only 1300ms left, not a fresh full timeout -> aborts if it can't finish in time
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Verbindungs-Timeout | wie lange auf TCP/TLS-Handshake warten? | zu lang blockiert Ressourcen bei totem Ziel |
| Lese-Timeout | wie lange zwischen Datenpaketen warten? | schützt vor hängenden, aber „offenen“ Verbindungen |
| Gesamt-Timeout/Deadline | absolute Zeitgrenze für die gesamte Operation? | ohne Propagation verbraucht jeder Hop sein eigenes volles Budget |
| Abbruch-Weitergabe | wird ein Client-Abbruch an nachgelagerte Dienste signalisiert? | Hintergrundarbeit läuft nutzlos weiter, verbraucht Ressourcen |

Implementierung: eine absolute Deadline (nicht eine relative Dauer) als Kontextwert bei jedem Aufruf mitgeben (z. B. „Deadline = Systemzeit + verbleibendes Budget“), damit jeder Hop weiß, wie viel Zeit tatsächlich noch übrig ist. Jeder Dienst reduziert das Budget um die eigene Verarbeitungszeit, bevor er es an den nächsten Hop weitergibt, und bricht selbst ab, wenn das verbleibende Budget für eine sinnvolle Operation nicht mehr ausreicht. Ein Client-Abbruch (z. B. Verbindungsschluss) sollte über einen Cancellation-Mechanismus an laufende nachgelagerte Arbeit propagiert werden.

## Scalability, Reliability, Security und Observability

Ohne Deadline-Propagation wächst die Ressourcenbindung in tiefen Dienstketten unkontrolliert: jeder Hop kann bis zu seinem eigenen vollen Timeout arbeiten, selbst wenn das Gesamtbudget längst aufgebraucht ist. Reliability-Grenze: ein System, das Deadlines nicht propagiert, kann unter Last in eine Situation geraten, in der abgebrochene Client-Anfragen weiterhin interne Kapazität binden — ein unsichtbarer Kapazitätsverlust, der sich erst bei genauer Analyse zeigt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| interne Dienste arbeiten weiter, obwohl Client längst abgebrochen hat | fehlende Cancellation-Propagation | Verarbeitungsdauer innerer Dienste gegen Client-Abbruchzeitpunkt vergleichen |
| P99-Latenz einer Kette deutlich höher als Summe der Einzel-Timeouts erwarten lässt | jeder Hop nutzt eigenen vollen Timeout statt Restbudget | Restbudget pro Hop gegen tatsächlich genutzte Zeit prüfen |
| Ressourcenverbrauch steigt unter Lastspitzen überproportional | abgebrochene Anfragen binden weiter Kapazität in tieferen Hops | Anzahl „verwaister“, weiterlaufender Anfragen nach Client-Abbruch zählen |
| ein Hop bricht scheinbar grundlos früh ab | korrektes Verhalten: Restbudget war bereits verbraucht | Deadline-Wert, der an diesen Hop übergeben wurde, prüfen |

Security: übermäßig lange Timeouts können als Ressourcenerschöpfungsvektor missbraucht werden (viele langsame, offene Anfragen binden Serverressourcen); Timeouts sind daher auch eine Schutzmaßnahme, nicht nur ein UX-Thema. Observability korreliert Deadline-Budget pro Hop, tatsächlich verbrauchte Zeit pro Hop und Abbruchgrund (eigener Timeout vs. propagierte Deadline überschritten).

## Trade-offs und Entscheidungen

**Staff** prüft bei überraschend hoher Kettenlatenz zuerst, ob Deadline-Propagation tatsächlich implementiert ist oder jeder Hop unabhängig timeoutet. **Principal** definiert einen Standardmechanismus (z. B. Kontext-/Metadaten-Propagation) für Deadlines über alle internen Dienstaufrufe. **Chief** verlangt Deadline-Propagation als Architekturstandard für jede mehrstufige interne Dienstkette, um Ressourcenverschwendung und inkonsistente Nutzererfahrung zu vermeiden.

Anti-Patterns: jeder Dienst nutzt seinen eigenen vollen Standard-Timeout unabhängig von der Restzeit des Gesamtaufrufs; kein Cancellation-Signal bei Client-Abbruch; Timeout-Werte „nach Gefühl“ statt anhand gemessener P99-Latenzen der jeweiligen Abhängigkeit festgelegt.

## Production Checklist

- [ ] Verbindungs-, Lese- und Gesamt-Timeout getrennt konfiguriert und begründet.
- [ ] Deadline wird als absoluter Wert über die gesamte Dienstkette propagiert, nicht pro Hop neu gesetzt.
- [ ] Client-Abbruch wird als Cancellation an nachgelagerte Arbeit weitergegeben.
- [ ] Timeout-Werte anhand gemessener P99-Latenzen der jeweiligen Abhängigkeit festgelegt, nicht geschätzt.

## Interviewfragen

### 1. Warum reicht ein einzelner Timeout pro Aufruf in einer Dienstkette nicht aus?

**Antwort:** Weil jeder Hop unabhängig sein eigenes volles Zeitbudget nutzen könnte, wodurch die Gesamtlatenz der Kette weit über das vom Client erwartete Budget hinauswachsen kann.

### 2. Was ist der Unterschied zwischen einer relativen Timeout-Dauer und einer absoluten Deadline?

**Antwort:** Eine relative Dauer wird bei jedem Hop neu gestartet; eine absolute Deadline (fester Zeitpunkt) zeigt jedem Hop, wie viel Restzeit tatsächlich noch verfügbar ist, unabhängig davon, wie viel Zeit bereits verstrichen ist.

### 3. Warum ist fortlaufende Hintergrundarbeit nach Client-Abbruch ein Problem?

**Antwort:** Sie verschwendet Ressourcen für eine Anfrage, deren Ergebnis niemand mehr abholt, und kann unter Last die effektiv verfügbare Kapazität für tatsächlich noch relevante Anfragen reduzieren.

### 4. Wie unterscheidest du Verbindungs-, Lese- und Gesamt-Timeout?

**Antwort:** Verbindungs-Timeout begrenzt die Zeit bis zum Verbindungsaufbau, Lese-Timeout die Zeit zwischen erhaltenen Datenpaketen, und der Gesamt-Timeout begrenzt die vollständige Operation unabhängig von einzelnen Zwischenschritten.

### 5. Wie legst du sinnvolle Timeout-Werte fest?

**Antwort:** Anhand gemessener P99-Latenzen der jeweiligen Abhängigkeit mit angemessenem Puffer, nicht anhand geschätzter oder pauschal übernommener Werte.

### 6. Widersprüchliche Anforderung: Produkt will kurze Antwortzeiten für Nutzer UND vollständige Verarbeitung auch bei langsamen Downstream-Diensten — wie gehst du vor?

**Antwort:** Ich würde die nutzerseitige Anfrage mit kurzer Deadline synchron beantworten (ggf. mit „wird verarbeitet“-Status) und die eigentliche, potenziell langsamere Verarbeitung asynchron mit eigenem, größerem Budget im Hintergrund fortsetzen, statt die kurze Nutzer-Deadline auf die gesamte Kette zu erzwingen.

## Praktische Labs

~~~python
import time

def call_with_deadline(deadline, work_ms, name):
    remaining = deadline - time.monotonic()
    if remaining <= 0:
        print(f"{name}: aborted, no budget left")
        return False
    time.sleep(min(work_ms / 1000, remaining))
    return True

start = time.monotonic()
deadline = start + 0.05  # 50ms total budget for the whole chain
call_with_deadline(deadline, 30, "serviceA")
result_b = call_with_deadline(deadline, 40, "serviceB")  # only ~20ms left, work needs 40ms
assert result_b is True  # it runs but is capped by remaining budget, not its own full timeout
print("serviceB respected the propagated remaining budget instead of using a fresh full timeout.")
~~~

## Dependencies, Cross-References und Quellen

1. gRPC Documentation: [Deadlines](https://grpc.io/docs/guides/deadlines/), abgerufen 2026-09-17.

Produktspezifische Timeout-/Deadline-API-Details vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Eingebaute Deadline-Propagation in RPC-Frameworks (z. B. gRPC) | Established | Prüfen, ob alle beteiligten Dienste die Propagation tatsächlich respektieren. |
| Adaptive, latenzbasierte Timeout-Berechnung statt statischer Werte | Adopting | Stabilität unter Lastspitzen vor Vertrauen in Automatik testen. |

Ein Team akzeptiert eine Deadline-Propagation-Implementierung erst, wenn eine mehrstufige Kette unter simuliertem Client-Abbruch und Budgetüberschreitung nachweislich korrekt reagiert.
