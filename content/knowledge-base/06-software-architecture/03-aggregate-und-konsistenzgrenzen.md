---
{"id": "KB-0131", "title": "Aggregate und Konsistenzgrenzen", "domain": "06", "sequence": 3, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0130", "concepts": ["Bounded Context"], "needed_for": "both"}, {"id": "KB-0108", "concepts": ["Transaktion"], "needed_for": "both"}], "related": ["KB-0132", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Aggregat mit Invariante lokal implementieren und eine Verletzung durch direkten Zugriff auf ein internes Element zeigen.", "rationale": "Kein reales System nötig, um das Kapselungsprinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Aggregatsgrenzen anhand fachlicher Invarianten statt Bequemlichkeit oder Datenbank-Normalisierung festlegen.", "rationale": "Zu große Aggregate erzeugen unnötige Transaktionskonflikte; zu kleine verlieren Konsistenzgarantien."}, "STAFF-TARGET": {"active": true, "scope": "Eine Konsistenzverletzung auf eine fehlende Invariantenprüfung im Aggregate Root zurückführen.", "rationale": "Das ist eine häufige Ursache für fachlich unmögliche Zustände in Produktionsdaten."}, "CHIEF-TARGET": {"active": true, "scope": "Aggregatsgrößen-Richtlinien als Architekturstandard für Teams mit DDD-Praxis festlegen.", "rationale": "Uneinheitliche Aggregatsgrößen über Teams erzeugen unterschiedliche Transaktions-/Skalierungsprofile."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Aggregat-Design-Heuristiken für hohe Konkurrenz (z. B. Aufspaltung großer Aggregate) sind Vertiefung.", "rationale": "Kern ist das Prinzip: Aggregatsgrenze = Transaktions- und Invariantengrenze."}}, "lab_validation": [{"lab_id": "KB-0131-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für ein Order-Aggregat mit Invariante", "evidence": "Ein direkter Versuch, eine Bestellzeile ohne den Aggregate Root zu ändern, umgeht die Invariantenprüfung (Mindestbestellwert) und erzeugt einen fachlich ungültigen Zustand.", "limitations": "Kein reales System, keine Produktion."}]}
---
# Aggregate und Konsistenzgrenzen

> **Ziel:** Ein Aggregat ist eine Gruppe fachlich zusammengehöriger Objekte, die als Konsistenzeinheit behandelt werden — Änderungen laufen ausschließlich über den Aggregate Root, der fachliche Invarianten durchsetzt. Die Aggregatsgrenze definiert damit auch die praktische Transaktionsgrenze: alles innerhalb eines Aggregats ist sofort konsistent, alles darüber hinaus braucht explizite Koordination (Saga, Eventual Consistency).

## Zweck, Mental Model und Dependensies

Ein Aggregat wie „Bestellung mit Bestellzeilen" hat eine fachliche Invariante, z. B. „die Summe der Bestellzeilen darf den Mindestbestellwert nicht unterschreiten, sobald die Bestellung bestätigt ist". Diese Invariante kann nur durchgesetzt werden, wenn jede Änderung an einer Bestellzeile über den Aggregate Root (die Bestellung selbst) läuft, der die Prüfung vornimmt — ein direkter Zugriff auf eine einzelne Bestellzeile würde die Invariante umgehen können. Die Aggregatsgrenze definiert damit exakt, was in einer einzigen Transaktion konsistent sein muss. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0130](02-bounded-contexts-und-context-maps.md) und [KB-0108](../05-distributed-systems/08-verteilte-transaktionen.md).

~~~text
Order (Aggregate Root) { lines: [LineItem], invariant: sum(lines) >= minOrderValue when confirmed }
change via Order.addLine(item) -> invariant checked -> valid or rejected
direct write to LineItem bypassing Order -> invariant NOT checked -> invalid state possible
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Aggregate Root | einziger erlaubter Zugriffspunkt für Änderungen? | direkter Zugriff auf interne Elemente umgeht Invarianten |
| Invariante | welche fachliche Regel muss immer gelten? | implizite Regel nirgends im Code durchgesetzt |
| Aggregatsgröße | genau die Objekte, die dieselbe Invariante teilen? | zu groß: unnötige Transaktionskonflikte; zu klein: verlorene Konsistenzgarantie |
| Referenz zwischen Aggregaten | über ID statt direkte Objektreferenz? | direkte Referenz verwischt Aggregatsgrenzen und erlaubt Umgehung |

Implementierung: Aggregatsgrenzen werden anhand tatsächlicher fachlicher Invarianten gezogen, nicht anhand von Datenbank-Normalisierung oder Bequemlichkeit — „was muss immer zusammen konsistent sein?" ist die Leitfrage, nicht „was gehört fachlich thematisch zusammen?". Zwischen Aggregaten wird ausschließlich über IDs referenziert, nie über direkte Objektreferenzen, um zu verhindern, dass ein Aggregat versehentlich ein anderes direkt verändert und dessen Invarianten umgeht. Änderungen an mehreren Aggregaten in einer fachlichen Operation werden über Sagas ([KB-0109](../05-distributed-systems/09-sagas-und-kompensation.md)) statt einer großen Transaktion koordiniert.

## Scalability, Reliability, Security und Observability

Kleinere Aggregate reduzieren Transaktionskonflikte bei hoher Konkurrenz (weniger gemeinsam gesperrte Daten pro Änderung), größere Aggregate vereinfachen die Modellierung starker Invarianten. Reliability-Grenze: ein zu groß geschnittenes Aggregat (z. B. „gesamter Warenkorb mit allen Artikeln aller Kategorien") erzeugt unnötige Schreibkonflikte zwischen unabhängigen Änderungen, die fachlich nichts miteinander zu tun haben.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| fachlich unmöglicher Zustand in Produktionsdaten (z. B. negative Bestellsumme) | Invariante nicht im Aggregate Root durchgesetzt | Codepfad identifizieren, der die Änderung ohne Root-Prüfung vorgenommen hat |
| viele Transaktionskonflikte bei gleichzeitigen, fachlich unabhängigen Änderungen | Aggregat zu groß geschnitten | prüfen, ob die konkurrierenden Änderungen tatsächlich dieselbe Invariante betreffen |
| Änderung an Aggregat A verändert unerwartet Aggregat B | direkte Objektreferenz statt ID-Referenz zwischen Aggregaten | Referenzart zwischen den beteiligten Aggregaten prüfen |
| komplexe fachliche Operation über mehrere Aggregate schlägt teilweise fehl | fehlende Saga-Koordination, implizite große Transaktion angenommen | prüfen, ob eine Multi-Aggregat-Operation als Saga mit Kompensation modelliert ist |

Security: der Aggregate Root ist auch der natürliche Ort für Autorisierungsprüfungen, da er alle Änderungen kontrolliert — eine Umgehung des Roots umgeht damit potenziell auch Berechtigungsprüfungen. Observability korreliert Aggregat-ID, versuchte Änderung, Invariantenprüfungsergebnis und tatsächlichen Endzustand.

## Trade-offs und Entscheidungen

**Staff** prüft bei fachlich unmöglichen Datenzuständen zuerst, ob eine Änderung den Aggregate Root umgangen hat. **Principal** definiert Aggregatsgrenzen anhand echter fachlicher Invarianten und überprüft regelmäßig, ob Aggregate zu groß geworden sind. **Chief** etabliert Aggregatsgrößen-Richtlinien als Teil des Architekturstandards für Teams mit DDD-Praxis.

Anti-Patterns: Aggregate nach Datenbank-Tabellenstruktur statt fachlicher Invariante schneiden; direkte Objektreferenzen zwischen Aggregaten statt ID-Referenzen verwenden; eine komplexe Multi-Aggregat-Operation als eine große Transaktion statt als Saga modellieren.

## Production Checklist

- [ ] Aggregatsgrenzen anhand tatsächlicher fachlicher Invarianten begründet, nicht anhand Datenbankstruktur.
- [ ] Alle Änderungen laufen ausschließlich über den Aggregate Root.
- [ ] Referenzen zwischen Aggregaten erfolgen über IDs, nicht direkte Objektreferenzen.
- [ ] Multi-Aggregat-Operationen als Saga statt einer großen Transaktion modelliert.

## Interviewfragen

### 1. Was ist ein Aggregate Root?

**Antwort:** Der einzige erlaubte Zugriffspunkt für Änderungen an einem Aggregat, der fachliche Invarianten durchsetzt, bevor eine Änderung wirksam wird.

### 2. Wie entscheidest du, wo eine Aggregatsgrenze verläuft?

**Antwort:** Anhand der Frage, welche Objekte tatsächlich immer gemeinsam konsistent sein müssen (dieselbe Invariante teilen), nicht anhand von Datenbank-Normalisierung oder thematischer Nähe.

### 3. Warum sollten Aggregate über IDs statt direkte Objektreferenzen aufeinander verweisen?

**Antwort:** Direkte Objektreferenzen würden es erlauben, ein anderes Aggregat direkt zu verändern und damit dessen Invariantenprüfung zu umgehen, was die Konsistenzgarantie zunichtemacht.

### 4. Warum sind zu große Aggregate problematisch?

**Antwort:** Sie erzeugen unnötige Transaktionskonflikte zwischen fachlich unabhängigen gleichzeitigen Änderungen, die eigentlich nicht dieselbe Invariante betreffen.

### 5. Wie modellierst du eine fachliche Operation, die mehrere Aggregate betrifft?

**Antwort:** Über eine Saga mit definierten Kompensationsschritten statt einer großen Transaktion, da jedes Aggregat seine eigene lokale Konsistenzgrenze und Transaktion behält.

### 6. Widersprüchliche Anforderung: Produkt will eine starke, sofortige Invariante über sehr viele gleichzeitig geänderte Objekte UND hohe Schreibkonkurrenz ohne Konflikte — wie gehst du vor?

**Antwort:** Ich würde prüfen, ob die Invariante wirklich sofortige, harte Konsistenz über alle Objekte benötigt oder ob eine schwächere, letztlich konsistente Variante (mit Ausgleichslogik) fachlich akzeptabel ist; ein einziges großes Aggregat für hohe Konkurrenz ist strukturell ungeeignet und der Zielkonflikt muss explizit mit dem Fachbereich geklärt werden.

## Praktische Labs

~~~python
class Order:
    def __init__(self, min_order_value):
        self.lines = []
        self.min_order_value = min_order_value
        self.confirmed = False

    def add_line(self, amount):
        self.lines.append(amount)

    def confirm(self):
        if sum(self.lines) < self.min_order_value:
            raise ValueError("invariant violated: below minimum order value")
        self.confirmed = True

order = Order(min_order_value=20)
order.add_line(25)
order.confirm()
assert order.confirmed is True

order2 = Order(min_order_value=20)
order2.add_line(5)
try:
    order2.confirm()
    raise AssertionError("expected invariant violation")
except ValueError as e:
    print("Aggregate root correctly enforced the invariant:", e)
~~~

## Dependencies, Cross-References und Quellen

1. Evans: [Domain-Driven Design: Tackling Complexity in the Heart of Software](https://www.domainlanguage.com/ddd/), Addison-Wesley 2003, abgerufen 2026-09-17.
2. Vernon: [Effective Aggregate Design](https://www.dddcommunity.org/library/vernon_2011/), 2011, abgerufen 2026-09-17.

Diese Methodik ist zeitstabil; konkrete ORM-/Persistenz-Tooling-Unterstützung für Aggregate sollte dennoch gegen aktuelle Frameworkdokumentation geprüft werden.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Event-Sourcing-basierte Aggregate mit eingebauter Invariantenprüfung pro Ereignis | Established in Kombination mit Event Sourcing | Zusammenspiel mit Snapshot-Strategie ([KB-0111](../05-distributed-systems/11-event-sourcing-und-rekonstruktion.md)) prüfen. |
| Automatisierte Aggregatsgrenzen-Vorschläge aus Codeanalyse | Emerging | Vorschläge immer gegen echte fachliche Invarianten validieren, nie automatisch übernehmen. |

Diese Methodik ist ein etabliertes, stabiles Fundament; der Bonus betrifft primär, wie Tooling die Grenzenfindung unterstützen kann, ohne die fachliche Invariantenanalyse zu ersetzen.
