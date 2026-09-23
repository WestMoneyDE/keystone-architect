---
{"id": "KB-0117", "title": "Backpressure und Überlast", "domain": "05", "sequence": 17, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0115", "concepts": ["Deadline", "Budget"], "needed_for": "understanding"}], "related": ["KB-0116", "KB-0120", "KB-0562", "KB-0720"], "applies": ["KB-0120", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine begrenzte Queue mit Lastabwurf lokal implementieren und den Effekt auf Latenz messen.", "rationale": "Kein echtes verteiltes System nötig, um das Prinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Queue-Größe, Admission-Control-Regel und Lastabwurf-Strategie für einen überlastbaren Dienst entwerfen.", "rationale": "Unbegrenzte Queues verschieben Überlast nur zeitlich, statt sie zu begrenzen."}, "STAFF-TARGET": {"active": true, "scope": "Explodierende Latenz auf eine unbegrenzt wachsende Queue statt auf einen echten Kapazitätsengpass zurückführen.", "rationale": "Das ist ein häufiges, fehlinterpretiertes Symptom unter Last."}, "CHIEF-TARGET": {"active": true, "scope": "Begrenzte Queues und explizite Lastabwurf-Policy als Standard für alle Eingangspfade mit variabler Last verlangen.", "rationale": "Unbegrenzter Aufstau verwandelt kurze Lastspitzen in lange Latenzkatastrophen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Adaptive Admission Control und Priorisierung nach Arbeitswert (Load Shedding by Priority) sind Vertiefung.", "rationale": "Kern ist die Entscheidung zwischen Aufstau und Abwurf unter Überlast."}}, "lab_validation": [{"lab_id": "KB-0117-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für begrenzte versus unbegrenzte Queue unter Überlast", "evidence": "Bei unbegrenzter Queue wächst die durchschnittliche Wartezeit unbegrenzt unter anhaltender Überlast; bei begrenzter Queue mit Lastabwurf bleibt die Latenz der angenommenen Anfragen stabil.", "limitations": "Kein reales System, keine echte Last, keine Produktion."}]}
---
# Backpressure und Überlast

> **Ziel:** Backpressure begrenzt, wie viel Arbeit ein System annimmt, bevor es überlastet ist — statt unbegrenzt aufzustauen (was Latenz explodieren lässt) oder unkontrolliert abzustürzen. Begrenzte Queues mit expliziter Lastabwurf-Policy sind die technische Umsetzung dieser Entscheidung.

## Zweck, Mental Model und Dependencies

Eine unbegrenzte Queue vor einem überlasteten Verarbeiter fühlt sich zunächst „robust“ an, weil keine Anfrage sofort abgelehnt wird — aber jede wartende Anfrage erhöht die Wartezeit aller nachfolgenden, und bei anhaltender Überlast wächst die Latenz unbegrenzt, bis praktisch jede Antwort nutzlos verspätet ist. Backpressure macht die Kapazitätsgrenze explizit: eine begrenzte Queue plus eine Admission-Control-Regel (annehmen oder ablehnen) sorgt dafür, dass angenommene Arbeit in angemessener Zeit bearbeitet wird, während überschüssige Last kontrolliert abgelehnt statt unkontrolliert aufgestaut wird. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0115](15-timeouts-und-deadline-budgets.md).

~~~text
unbounded queue: incoming > capacity -> queue grows -> latency grows unbounded -> all responses too late
bounded queue:   incoming > capacity -> queue full -> excess requests rejected fast -> accepted latency stays bounded
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Queue-Größe | wie groß, basierend auf welcher Kapazitätsannahme? | zu groß: Latenzexplosion; zu klein: unnötige Ablehnungen |
| Admission Control | annehmen/ablehnen basierend auf welchem Signal? | Ablehnung erst nachdem Queue bereits voll ist, ist reaktiv statt proaktiv |
| Lastabwurf-Strategie | welche Anfragen zuerst ablehnen? | undifferenziertes Ablehnen trifft auch wichtige Anfragen |
| Signalweitergabe | wird Überlast an Aufrufer/Upstream signalisiert? | fehlendes Signal verhindert, dass Upstream selbst reagiert (z. B. Retry drosselt) |

Implementierung: Queue-Größe an gemessener Verarbeitungskapazität und akzeptablem Latenzbudget ausrichten, nicht willkürlich wählen. Admission Control proaktiv (z. B. basierend auf aktueller Auslastung, nicht erst wenn die Queue randvoll ist) implementieren. Lastabwurf sollte differenzieren können (z. B. nach Priorität, Mandant, Anfragetyp) statt rein first-come-first-served abzulehnen. Überlastsignale (z. B. HTTP 429/503 mit Retry-After) an Aufrufer weitergeben, damit diese selbst drosseln können, statt naiv sofort erneut zu versuchen.

## Scalability, Reliability, Security und Observability

Backpressure ist eine Voraussetzung für vorhersagbares Verhalten unter Last: ohne sie degradiert ein System unter Überlast nicht kontrolliert, sondern kollabiert oft plötzlich (z. B. durch Speichererschöpfung der wachsenden Queue). Reliability-Grenze: Lastabwurf ohne Differenzierung kann kritische Anfragen genauso treffen wie unkritische, was das Geschäftsrisiko einer Überlastsituation unnötig erhöht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Latenz steigt stark unter Last, keine Fehler sichtbar | unbegrenzte Queue staut auf statt abzulehnen | Queue-Länge/Wartezeit-Metrik über Zeit unter Last prüfen |
| System stürzt bei Lastspitze plötzlich ab | Queue wächst bis Speichererschöpfung statt begrenzt zu sein | Speicherverbrauch korreliert mit Queue-Länge prüfen |
| wichtige Anfragen werden bei Überlast genauso abgelehnt wie unwichtige | fehlende Priorisierung im Lastabwurf | Ablehnungsverteilung nach Anfragetyp/Priorität prüfen |
| Client retryt sofort nach Ablehnung und verschärft Überlast | fehlendes Retry-After-Signal | prüfen, ob Ablehnungsantwort ein verwertbares Backoff-Signal enthält |

Security: fehlende Backpressure macht ein System anfällig für ressourcenerschöpfende Lastangriffe, da jede eingehende Anfrage unbegrenzt aufgestaut wird, statt kontrolliert abgelehnt zu werden. Observability korreliert Queue-Länge, Annahme-/Ablehnungsrate, Latenz der angenommenen Anfragen und Verteilung der Ablehnungen nach Priorität/Typ.

## Trade-offs und Entscheidungen

**Staff** prüft bei Latenzproblemen unter Last zuerst Queue-Länge und Aufstauverhalten, bevor Verarbeitungskapazität als alleinige Ursache angenommen wird. **Principal** definiert Standard-Queue-Größen und Admission-Control-Regeln basierend auf gemessener Kapazität pro Dienstklasse. **Chief** verlangt eine explizite Lastabwurf-Policy mit Priorisierung für alle Eingangspfade mit erwarteter variabler Last.

Anti-Patterns: unbegrenzte Queues „zur Sicherheit gegen Datenverlust“ einsetzen, ohne die Latenzfolgen zu bedenken; Lastabwurf ohne Priorisierung; keine Rückmeldung an Aufrufer bei Ablehnung, was zu unkoordinierten Retries führt.

## Production Checklist

- [ ] Queue-Größe basierend auf gemessener Verarbeitungskapazität und Latenzbudget dimensioniert.
- [ ] Admission Control proaktiv, nicht erst bei voller Queue.
- [ ] Lastabwurf differenziert nach Priorität/Mandant, nicht undifferenziert.
- [ ] Überlastsignal (z. B. Retry-After) wird an Aufrufer zurückgegeben.

## Interviewfragen

### 1. Warum ist eine unbegrenzte Queue riskanter als eine begrenzte mit Lastabwurf?

**Antwort:** Eine unbegrenzte Queue verzögert jede wartende Anfrage zunehmend, bis Latenz und Speicherverbrauch unkontrolliert wachsen; eine begrenzte Queue hält die Latenz der angenommenen Anfragen vorhersagbar und lehnt überschüssige Last kontrolliert ab.

### 2. Was ist Admission Control?

**Antwort:** Die proaktive Entscheidung, ob eine eingehende Anfrage überhaupt angenommen wird, basierend auf aktueller Auslastung, statt sie erst bei voller Queue reaktiv abzulehnen.

### 3. Warum ist undifferenzierter Lastabwurf problematisch?

**Antwort:** Er behandelt kritische und unkritische Anfragen gleich und kann so wichtige Geschäftsvorgänge genauso treffen wie unwichtige, statt das verfügbare Kapazitätsbudget gezielt zu priorisieren.

### 4. Was bewirkt ein Retry-After-Signal bei Ablehnung?

**Antwort:** Es gibt dem Aufrufer eine konkrete Wartezeitempfehlung, wodurch koordiniertes statt sofortiges, überlastverschärfendes erneutes Anfragen ermöglicht wird.

### 5. Wie dimensionierst du eine sinnvolle Queue-Größe?

**Antwort:** Basierend auf gemessener Verarbeitungskapazität pro Zeiteinheit und dem akzeptablen Latenzbudget, nicht willkürlich, damit angenommene Anfragen innerhalb eines tolerierbaren Zeitfensters bearbeitet werden.

### 6. Widersprüchliche Anforderung: Produkt will keine Anfrage verlieren UND stabile niedrige Latenz unter Lastspitzen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass beides bei anhaltender Überlast physikalisch nicht gleichzeitig erreichbar ist; Alternative ist eine asynchrone Annahme (z. B. Queue mit späterer Verarbeitung und expliziter Bestätigung) für nicht-latenzkritische Anfragen, kombiniert mit synchronem Backpressure für latenzkritische Pfade.

## Praktische Labs

~~~python
import statistics

def simulate(queue_limit, incoming, capacity_per_tick):
    queue = []
    latencies = []
    for tick_load in incoming:
        accepted = 0
        for _ in range(tick_load):
            if queue_limit is None or len(queue) < queue_limit:
                queue.append(0)
                accepted += 1
        for i in range(len(queue)):
            queue[i] += 1
        for _ in range(min(capacity_per_tick, len(queue))):
            latencies.append(queue.pop(0))
    return statistics.mean(latencies) if latencies else 0

overload = [20] * 10
unbounded_latency = simulate(None, overload, capacity_per_tick=5)
bounded_latency = simulate(10, overload, capacity_per_tick=5)
assert unbounded_latency > bounded_latency
print(f"Unbounded avg wait: {unbounded_latency:.1f} ticks, bounded avg wait: {bounded_latency:.1f} ticks.")
~~~

## Dependencies, Cross-References und Quellen

1. Google SRE Book: [Handling Overload](https://sre.google/sre-book/handling-overload/), abgerufen 2026-09-17.

Produktspezifische Queue-/Admission-Control-Implementierungsdetails vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Adaptive Admission Control basierend auf Echtzeit-Latenzsignalen (z. B. CoDel-artig) | Adopting | Stabilität unter realer, variabler Last vor Vertrauen testen. |
| Priorisierter Lastabwurf nach Geschäftswert statt reiner Reihenfolge | Adopting | Priorisierungslogik gegen tatsächliche Geschäftsanforderungen validieren. |

Ein Team akzeptiert eine Backpressure-Implementierung erst, wenn Queue-Begrenzung, Admission-Control-Verhalten und Lastabwurf-Priorisierung unter simulierter Überlast getestet sind.
