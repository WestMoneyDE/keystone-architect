---
{"id": "KB-0122", "title": "Fehlerdomänen und Bulkheads", "domain": "05", "sequence": 22, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0116", "concepts": ["Circuit Breaker"], "needed_for": "understanding"}, {"id": "KB-0107", "concepts": ["Sharding", "Isolation"], "needed_for": "understanding"}], "related": ["KB-0123", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Geteilten versus isolierten Ressourcenpool lokal simulieren und den Blast-Radius-Unterschied messen.", "rationale": "Kein reales System nötig, um das Isolationsprinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Fehlerdomänengrenzen und Bulkhead-Isolation für ein System mit mehreren kritischen Abhängigkeiten entwerfen.", "rationale": "Gemeinsam genutzte Ressourcenpools lassen einen lokalen Fehler global eskalieren."}, "STAFF-TARGET": {"active": true, "scope": "Einen kaskadierenden Ausfall auf einen gemeinsam genutzten Thread-/Connection-Pool zurückführen.", "rationale": "Das ist ein bekanntes Muster für scheinbar unzusammenhängende gleichzeitige Ausfälle."}, "CHIEF-TARGET": {"active": true, "scope": "Blast-Radius-Grenzen (Zellarchitektur, Regionstrennung) als Standard für kritische Systeme festlegen.", "rationale": "Fehlende Isolation erhöht das Risiko, dass ein lokaler Fehler zum Totalausfall wird."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Zellbasierte Architektur mit vollständiger Stack-Replikation pro Zelle ist Vertiefung.", "rationale": "Kern ist das Prinzip: gemeinsam genutzte Ressourcen erzeugen gemeinsame Fehlerdomänen."}}, "lab_validation": [{"lab_id": "KB-0122-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für geteilten versus isolierten Connection-Pool", "evidence": "Ein überlasteter Downstream-Dienst erschöpft bei geteiltem Pool die Kapazität für alle Aufrufer; bei isolierten Pools bleiben andere Aufrufer unbeeinträchtigt.", "limitations": "Kein reales System, keine Produktion."}]}
---
# Fehlerdomänen und Bulkheads

> **Ziel:** Eine Fehlerdomäne ist die Menge an Komponenten, die durch einen einzelnen Fehler gemeinsam betroffen sein können. Bulkhead-Isolation (benannt nach wasserdichten Schiffsabteilungen) begrenzt diese Domäne bewusst, indem Ressourcen (Thread-Pools, Connection-Pools, Kapazität) pro Abhängigkeit getrennt statt geteilt werden — damit der Ausfall einer Abhängigkeit nicht automatisch alle anderen mitreißt.

## Zweck, Mental Model und Dependencies

Wenn mehrere Downstream-Aufrufe denselben Thread-Pool oder Connection-Pool teilen, kann eine einzelne langsame oder ausgefallene Abhängigkeit den gesamten Pool mit wartenden Anfragen füllen — und damit auch Aufrufe an völlig gesunde Abhängigkeiten blockieren, weil keine freien Ressourcen mehr verfügbar sind. Bulkhead-Isolation weist jeder Abhängigkeit einen eigenen, begrenzten Ressourcenpool zu, sodass ihr Ausfall auf ihren eigenen Pool begrenzt bleibt. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0116](16-circuit-breaker-und-fehlereindaemmung.md) und [KB-0107](07-sharding-und-mandantenplatzierung.md).

~~~text
shared pool:    [callA, callB, callC] all draw from pool(20) -> A hangs -> pool exhausted -> B,C also blocked
bulkhead pools: callA -> pool_A(5), callB -> pool_B(5), callC -> pool_C(5) -> A hangs -> only pool_A exhausted
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Ressourcenpool-Grenze | pro Abhängigkeit getrennt oder geteilt? | geteilt: ein Fehler erschöpft Kapazität für alle |
| Blast Radius | wie viele Nutzer/Funktionen betrifft ein einzelner Fehler maximal? | unklar definiert, erst im Incident sichtbar |
| Zellarchitektur | vollständig replizierter Stack pro Kundengruppe/Region? | hoher Betriebsaufwand, aber maximale Isolation |
| Dimensionierung | wie groß jeder isolierte Pool im Verhältnis zur Gesamtkapazität? | zu klein: unnötige Drosselung bei Normalbetrieb |

Implementierung: kritische Abhängigkeiten erhalten dedizierte, begrenzte Ressourcenpools (Thread-Pool, Connection-Pool, Semaphore) statt eines gemeinsamen Pools für alle Aufrufe. Die Größe jedes Pools wird anhand der erwarteten Last dieser spezifischen Abhängigkeit dimensioniert, nicht willkürlich gleich verteilt. Für sehr kritische Systeme kann eine vollständige Zellarchitektur (unabhängige, vollständig replizierte Stacks pro Kundengruppe oder Region) den Blast Radius auf eine einzelne Zelle begrenzen.

## Scalability, Reliability, Security und Observability

Bulkhead-Isolation kostet Ressourceneffizienz (isolierte Pools können nicht dynamisch Kapazität voneinander leihen), gewinnt aber Vorhersagbarkeit unter Teilausfällen. Reliability-Grenze: ohne Isolation ist die effektive Verfügbarkeit eines Systems nicht die Verfügbarkeit der am wenigsten zuverlässigen Abhängigkeit, sondern kann durch Ressourcenerschöpfung sogar darunter fallen, weil der Fehler auf gesunde Pfade übergreift.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| mehrere unabhängige Funktionen fallen gleichzeitig aus | gemeinsam genutzter Ressourcenpool durch eine Abhängigkeit erschöpft | Pool-Auslastung pro Abhängigkeit zum Ausfallzeitpunkt prüfen |
| ein isolierter Pool läuft ständig voll, andere sind leer | Dimensionierung passt nicht zur realen Lastverteilung | Nutzungsmuster pro Pool über Zeit messen und neu dimensionieren |
| Incident betrifft mehr Nutzer als für die eine fehlerhafte Komponente erwartet | Blast Radius nicht bewusst begrenzt | betroffene Nutzer-/Funktionsmenge gegen erwartete Fehlerdomäne vergleichen |
| Zellarchitektur-Betrieb wird zu teuer/komplex | Isolationsgrad übersteigt tatsächlichen Kritikalitätsbedarf | Isolationsgrad gegen tatsächliches Risiko/Kosten-Verhältnis neu bewerten |

Security: isolierte Ressourcenpools begrenzen auch, wie stark ein gezielter Angriff auf eine Abhängigkeit den Rest des Systems beeinträchtigen kann — Bulkheads sind damit auch ein Denial-of-Service-Härtungsmuster. Observability korreliert Pool-Auslastung pro Abhängigkeit, Wartezeit pro Pool und tatsächlichen Blast Radius bei aufgetretenen Incidents.

## Trade-offs und Entscheidungen

**Staff** untersucht bei gleichzeitigen, scheinbar unabhängigen Ausfällen zuerst gemeinsam genutzte Ressourcenpools als Ursache. **Principal** definiert, welche Abhängigkeiten dedizierte Pools benötigen (typisch: alle externen und alle kritischen internen Aufrufe). **Chief** legt fest, für welche Systemklassen eine vollständige Zellarchitektur mit maximaler Isolation den zusätzlichen Betriebsaufwand rechtfertigt.

Anti-Patterns: ein einziger großer Thread-/Connection-Pool für alle Downstream-Aufrufe; Bulkhead-Größen ohne Bezug zur tatsächlichen Lastverteilung raten; Isolation nur auf Papier planen, aber im Code tatsächlich einen gemeinsamen Pool verwenden.

## Production Checklist

- [ ] Kritische Abhängigkeiten haben dedizierte, begrenzte Ressourcenpools.
- [ ] Pool-Größen anhand gemessener realer Lastverteilung dimensioniert.
- [ ] Blast Radius pro Fehlerdomäne explizit dokumentiert und getestet.
- [ ] Isolationsgrad (Pool-Trennung vs. volle Zellarchitektur) begründet gegen Kritikalität abgewogen.

## Interviewfragen

### 1. Was ist eine Bulkhead-Isolation?

**Antwort:** Die Zuweisung dedizierter, begrenzter Ressourcenpools pro Abhängigkeit, damit der Ausfall oder die Überlastung einer Abhängigkeit nicht die Kapazität für Aufrufe an andere, gesunde Abhängigkeiten mit verbraucht.

### 2. Warum kann ein geteilter Thread-Pool gefährlicher sein als mehrere kleinere isolierte Pools?

**Antwort:** Eine einzelne hängende Abhängigkeit kann den gesamten geteilten Pool mit wartenden Anfragen füllen und dadurch auch Aufrufe an völlig unabhängige, gesunde Dienste blockieren.

### 3. Was ist der Blast Radius eines Fehlers?

**Antwort:** Die Menge an Nutzern, Funktionen oder Komponenten, die durch einen einzelnen Fehler tatsächlich betroffen sein können — er sollte bewusst begrenzt, nicht dem Zufall überlassen werden.

### 4. Was ist eine Zellarchitektur?

**Antwort:** Eine Architektur, bei der vollständig unabhängige, replizierte Stacks (Zellen) jeweils eine begrenzte Kundengruppe oder Region bedienen, sodass ein Fehler in einer Zelle die anderen nicht beeinträchtigt.

### 5. Was kostet Bulkhead-Isolation?

**Antwort:** Ressourceneffizienz — isolierte Pools können ungenutzte Kapazität nicht dynamisch an überlastete Pools abgeben, was insgesamt mehr Gesamtkapazität für dieselbe Zuverlässigkeit erfordern kann.

### 6. Widersprüchliche Anforderung: Produkt will maximale Ressourceneffizienz (ein gemeinsamer Pool) UND garantiert, dass ein Ausfall nie andere Funktionen beeinträchtigt — wie gehst du vor?

**Antwort:** Ich würde erklären, dass vollständige gegenseitige Isolation und vollständig geteilte, effiziente Ressourcennutzung sich widersprechen; ein Kompromiss ist, nur die kritischsten Abhängigkeiten zu isolieren und weniger kritische einen kleineren, überwachten geteilten Pool nutzen zu lassen.

## Praktische Labs

~~~python
def simulate(shared_pool_size, isolated_pool_sizes, hung_dependency):
    if isolated_pool_sizes is None:
        pool = {"shared": shared_pool_size}
        pool["shared"] -= 100  # hung dependency consumes all shared capacity
        return pool["shared"] <= 0  # True: everyone blocked
    pools = dict(isolated_pool_sizes)
    pools[hung_dependency] -= 100
    other_pools_ok = all(v > 0 for k, v in pools.items() if k != hung_dependency)
    return not other_pools_ok  # False means others remain unaffected

shared_result = simulate(20, None, "depA")
isolated_result = simulate(None, {"depA": 5, "depB": 5, "depC": 5}, "depA")
assert shared_result is True
assert isolated_result is False
print("Shared pool: all callers blocked. Isolated pools: only depA's callers affected.")
~~~

## Dependencies, Cross-References und Quellen

1. Nygard: [Release It! - Bulkhead Pattern](https://pragprog.com/titles/mnee2/release-it-second-edition/), Pragmatic Bookshelf 2018, abgerufen 2026-09-17.

Produktspezifische Pool-/Isolationsimplementierungsdetails vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Zellbasierte Architektur als Standardmuster bei großen Cloud-Anbietern | Established | Betriebsaufwand und tatsächlichen Isolationsgewinn gegen Kritikalität abwägen. |
| Automatisierte, adaptive Pool-Dimensionierung basierend auf Echtzeitlast | Adopting | Stabilität unter Lastspitzen vor Vertrauen in Automatik testen. |

Ein Team akzeptiert eine Bulkhead-Isolationsstrategie erst, wenn Blast Radius pro Fehlerdomäne gemessen und Pool-Dimensionierung gegen reale Lastverteilung getestet sind.
