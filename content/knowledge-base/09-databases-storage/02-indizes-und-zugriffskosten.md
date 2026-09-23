---
{"id": "KB-0196", "title": "Indizes und Zugriffskosten", "domain": "09", "sequence": 2, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "CLOUD", "STAFF"], "requires": [{"id": "KB-0195", "concepts": ["MVCC", "Interne Datenpfade"], "needed_for": "both"}, {"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}], "related": ["KB-0197", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Selektivität eines Index für unterschiedliche Abfragemuster lokal berechnen und Schreibverstärkung durch zusätzliche Indizes demonstrieren.", "rationale": "Kein echter Datenbankserver nötig, um die Kernabwägung zu zeigen."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Index-Typ und -Spalten anhand tatsächlicher Abfragemuster und Selektivität begründet wählen, statt pauschal jede Spalte zu indizieren.", "rationale": "Jeder zusätzliche Index kostet Schreibleistung und Speicherplatz, auch wenn er nie für Lesevorgänge genutzt wird."}, "STAFF-TARGET": {"active": true, "scope": "Eine langsame Abfrage auf einen fehlenden oder falschen Index zurückführen, und eine langsame Schreiblast auf zu viele unnötige Indizes.", "rationale": "Beide Symptome erfordern entgegengesetzte Diagnoserichtungen."}, "CHIEF-TARGET": {"active": true, "scope": "Index-Review als Standard-Bestandteil von Datenbank-Performance-Reviews etablieren.", "rationale": "Unkontrolliertes Indexwachstum ist eine häufige, schleichende Performance- und Kostenursache."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Spezialisierte Indextypen (GiST, GIN, BRIN) im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis von Selektivität, Schreibverstärkung und Abdeckungsgrad."}}, "lab_validation": [{"lab_id": "KB-0196-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Selektivitätsberechnung und Schreibverstärkung durch mehrere Indizes", "evidence": "Ein Index auf eine Spalte mit niedriger Selektivität (wenige eindeutige Werte) reduziert die Ergebnismenge kaum; ein zusätzlicher Index verdoppelt die Anzahl der bei jedem Insert nötigen Schreiboperationen.", "limitations": "Kein echter Datenbankserver, keine Produktion."}]}
---
# Indizes und Zugriffskosten

> **Ziel:** Ein Index beschleunigt Lesevorgänge, indem er eine sortierte oder anderweitig strukturierte Zugriffsstruktur zusätzlich zu den Rohdaten pflegt — aber jeder Index muss bei jedem Insert/Update/Delete mitaktualisiert werden (Schreibverstärkung) und belegt zusätzlichen Speicherplatz. Ein Index auf eine Spalte mit niedriger Selektivität (wenige eindeutige Werte) bringt kaum Lesevorteil, kostet aber die volle Schreibverstärkung.

## Zweck, Mental Model und Dependencies

Ein B-Tree-Index (der Standardindextyp der meisten relationalen Datenbanken) hält Werte sortiert in einer Baumstruktur, was schnelle Bereichs- und Gleichheitssuchen ermöglicht (logarithmische statt linearer Suche). Selektivität misst, wie stark ein Index die Ergebnismenge tatsächlich einschränkt — ein Index auf eine Spalte mit nur zwei möglichen Werten (z. B. „aktiv/inaktiv") reduziert eine Suche selten auf mehr als die Hälfte der Zeilen, während ein Index auf eine eindeutige ID-Spalte die Ergebnismenge auf eine einzelne Zeile reduziert. Jeder Index kostet Schreibverstärkung: eine Tabelle mit fünf Indizes erfordert bei jedem Insert sechs Schreiboperationen (eine für die Tabelle selbst, fünf für die Indizes) statt einer. Lies [KB-0195](01-postgresql-und-interne-datenpfade.md) und [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md).

~~~text
Low selectivity:  index on status ("active"/"inactive") -> query still scans ~50% of rows, little benefit
High selectivity: index on user_id (unique) -> query reduces to exactly 1 row, high benefit
Write amplification: 1 table + 5 indexes -> INSERT requires 6 writes instead of 1
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Selektivität | wie stark reduziert der Index die tatsächliche Ergebnismenge? | Index auf niedrig-selektive Spalte bringt kaum Nutzen |
| Schreibverstärkung | wie viele zusätzliche Schreiboperationen pro Index bei jedem Insert/Update? | zu viele Indizes verlangsamen Schreiblast erheblich |
| Abdeckungsgrad (Covering Index) | enthält der Index alle für die Abfrage benötigten Spalten? | fehlender Abdeckungsgrad erzwingt zusätzlichen Tabellenzugriff (Lookup) |
| Index-Nutzung | wird der Index tatsächlich vom Query Planner genutzt? | ungenutzter Index kostet Schreibverstärkung ohne jeden Lesevorteil |

Implementierung: Indizes werden gezielt für tatsächlich häufige, performancekritische Abfragemuster erstellt, basierend auf gemessener Selektivität, nicht pauschal für jede Spalte, die potenziell in einer WHERE-Klausel auftauchen könnte. Ein Covering Index (der alle von einer häufigen Abfrage benötigten Spalten enthält) vermeidet einen zusätzlichen Tabellenzugriff nach dem Indexzugriff. Bestehende Indizes werden regelmäßig auf tatsächliche Nutzung geprüft (z. B. über `pg_stat_user_indexes`) — ein nie genutzter Index kostet nur Schreibverstärkung und Speicherplatz, ohne jeden Nutzen.

## Scalability, Reliability, Security und Observability

Gut gewählte Indizes skalieren Lesevorgänge auf großen Datenmengen dramatisch (logarithmisch statt linear), aber unkontrolliertes Indexwachstum skaliert Schreiblast negativ, da jeder zusätzliche Index jeden Schreibvorgang verlangsamt. Reliability-Grenze: ein fehlender Index auf einer häufig abgefragten, großen Tabelle kann zu Full-Table-Scans führen, die unter Last zu Latenzspitzen oder sogar Timeouts führen — ein häufiger Produktionsfehler, der oft erst bei wachsendem Datenvolumen sichtbar wird.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Abfrage wird bei wachsendem Datenvolumen zunehmend langsamer | fehlender Index für ein häufiges Abfragemuster, Full-Table-Scan | Query-Plan (EXPLAIN) auf Scan-Typ (Index vs. Sequential) prüfen |
| Schreiblast (Inserts/Updates) ist unerwartet langsam | zu viele Indizes erzeugen hohe Schreibverstärkung | Anzahl vorhandener Indizes auf der betroffenen Tabelle zählen |
| Index existiert, wird aber laut Query Planner nicht genutzt | niedrige Selektivität oder Query-Muster passt nicht zum Index | Selektivität der indizierten Spalte und tatsächliches Abfragemuster prüfen |
| Abfrage benötigt zusätzlichen Tabellenzugriff trotz vorhandenem Index | Index deckt nicht alle benötigten Spalten ab (kein Covering Index) | benötigte Spalten der Abfrage gegen Index-Definition vergleichen |

Security: Indizes auf sensible Spalten (z. B. E-Mail-Adressen) sollten mit demselben Schutzbewusstsein wie die zugrunde liegenden Daten behandelt werden, da sie potenziell für Timing-basierte Informationsermittlung genutzt werden könnten. Observability: Index-Nutzungsstatistiken und Query-Plan-Analyse sind die zentralen Werkzeuge, um Indexentscheidungen datenbasiert statt intuitiv zu treffen.

## Trade-offs und Entscheidungen

**Staff** prüft bei langsamen Abfragen zuerst den Query-Plan auf fehlende Indizes, bei langsamer Schreiblast auf zu viele Indizes. **Principal** definiert Indexierungsrichtlinien basierend auf gemessener Selektivität und tatsächlichen Abfragemustern, nicht pauschaler Regel. **Chief** etabliert regelmäßige Index-Reviews als Standard-Bestandteil von Datenbank-Performance-Reviews.

Anti-Patterns: jede Spalte, die potenziell in einer WHERE-Klausel vorkommen könnte, vorsorglich indizieren; Index auf eine Spalte mit sehr niedriger Selektivität erstellen und Lesevorteil erwarten; ungenutzte Indizes nie überprüfen oder entfernen.

## Production Checklist

- [ ] Indizes basieren auf gemessener Selektivität und tatsächlichen Abfragemustern.
- [ ] Query-Pläne für performancekritische Abfragen zeigen Index-Nutzung statt Full-Table-Scans.
- [ ] Ungenutzte Indizes werden regelmäßig identifiziert und entfernt.
- [ ] Covering Indizes für besonders häufige, performancekritische Abfragen geprüft.

## Interviewfragen

### 1. Was bedeutet Selektivität eines Index?

**Antwort:** Wie stark der Index die tatsächliche Ergebnismenge einer Abfrage einschränkt — hohe Selektivität (viele eindeutige Werte) reduziert die Ergebnismenge stark, niedrige Selektivität kaum.

### 2. Was ist Schreibverstärkung durch Indizes?

**Antwort:** Jeder Index muss bei jedem Insert/Update/Delete mitaktualisiert werden; eine Tabelle mit mehreren Indizes benötigt entsprechend mehr Schreiboperationen pro logischer Änderung als eine unindizierte Tabelle.

### 3. Warum bringt ein Index auf eine Spalte mit niedriger Selektivität wenig Nutzen?

**Antwort:** Wenn die Spalte nur wenige eindeutige Werte hat (z. B. ein Boolean-Status), reduziert der Index die zu durchsuchende Datenmenge kaum, während er weiterhin die volle Schreibverstärkung kostet.

### 4. Was ist ein Covering Index?

**Antwort:** Ein Index, der alle für eine bestimmte Abfrage benötigten Spalten enthält, sodass kein zusätzlicher Zugriff auf die eigentliche Tabelle nötig ist.

### 5. Wie erkennst du, ob ein vorhandener Index tatsächlich genutzt wird?

**Antwort:** Über Index-Nutzungsstatistiken der Datenbank (z. B. `pg_stat_user_indexes` in PostgreSQL) und durch Analyse von Query-Plänen für typische Abfragen.

### 6. Widersprüchliche Anforderung: Team will maximale Lesegeschwindigkeit für viele unterschiedliche Abfragemuster UND minimale Schreiblatenz — wie gehst du vor?

**Antwort:** Ich würde Indizes gezielt nur für die tatsächlich häufigsten und performancekritischsten Abfragemuster erstellen, basierend auf gemessener Nutzung, statt für jedes theoretisch mögliche Muster — das begrenzt die Schreibverstärkung auf den tatsächlich gerechtfertigten Umfang.

## Praktische Labs

~~~python
def selectivity(distinct_values, total_rows):
    return distinct_values / total_rows

low = selectivity(2, 100000)   # boolean-like column
high = selectivity(100000, 100000)  # unique ID column

assert low < 0.01
assert high == 1.0
print(f"Low selectivity index: {low:.4%} (barely narrows results). High selectivity index: {high:.0%} (narrows to a single row).")

def write_cost(num_indexes):
    return 1 + num_indexes  # 1 write for the table itself, 1 per index

assert write_cost(0) == 1
assert write_cost(5) == 6
print(f"Table with 5 indexes requires {write_cost(5)} writes per insert instead of {write_cost(0)}.")
~~~

## Dependencies, Cross-References und Quellen

1. PostgreSQL Global Development Group: [PostgreSQL Documentation - Indexes](https://www.postgresql.org/docs/current/indexes.html), abgerufen 2026-09-17.
2. Use The Index, Luke: [SQL Indexing and Tuning e-Book](https://use-the-index-luke.com/), abgerufen 2026-09-17.

Datenbankspezifische Indextyp-Details (B-Tree, Hash, GiST, GIN, BRIN) vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Index-Empfehlungssysteme basierend auf Query-Workload-Analyse | Adopting | Empfehlungen immer gegen tatsächliche Schreiblast-Kosten und Selektivität manuell validieren. |

Ein Team akzeptiert eine Index-Strategie erst, wenn Selektivität, Schreibverstärkung und tatsächliche Nutzung gegen reale Abfragemuster nachweisbar geprüft sind.
