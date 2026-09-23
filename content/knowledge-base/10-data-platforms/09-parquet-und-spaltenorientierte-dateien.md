---
{"id": "KB-0227", "title": "Parquet und spaltenorientierte Dateien", "domain": "10", "sequence": 9, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "GENAI", "MLOPS"], "requires": [{"id": "KB-0210", "concepts": ["File Storage"], "needed_for": "understanding"}, {"id": "KB-0222", "concepts": ["Spark", "Partitionierung"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Predicate-Pushdown-Modell zur Vermeidung unnötigen Dateilesens implementieren.", "rationale": "Der Performancevorteil spaltenorientierter Formate wird erst durch konkrete Simulation von Row-Group-Statistiken greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Dateigröße und Partitionlayout für einen konkreten analytischen Zugriffsanwendungsfall begründet dimensionieren.", "rationale": "Zu kleine oder zu große Dateien sowie falsche Partitionierung erzeugen jeweils spezifische Performanceprobleme."}, "STAFF-TARGET": {"active": true, "scope": "Unerwartet langsame analytische Abfragen auf das 'Small-Files-Problem' statt auf allgemein unzureichende Rechenressourcen zurückführen können.", "rationale": "Viele kleine Dateien erzeugen Metadaten-Overhead, der die Abfrageperformance dominieren kann, unabhängig von der verfügbaren Rechenleistung."}, "CHIEF-TARGET": {"active": true, "scope": "Spaltenorientierte Dateiformate als bewusste Optimierung für analytische Zugriffsmuster positionieren, nicht als universellen Ersatz für zeilenorientierte Formate.", "rationale": "Parquet optimiert für selektive Spaltenzugriffe und Aggregationen, nicht für transaktionale Einzelzeilen-Zugriffe."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Encoding-spezifische Details (Dictionary Encoding, Run-Length Encoding) sind Vertiefung.", "rationale": "Kern ist das Verständnis von Row Groups, Predicate Pushdown und Partitionlayout, nicht die Encoding-Implementierungsdetails."}}, "lab_validation": [{"lab_id": "KB-0227-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Predicate-Pushdown mit Row-Group-Statistiken", "evidence": "Row-Group-Statistiken (Min/Max-Werte pro Spalte) erlauben, ganze Row Groups ohne tatsächliches Lesen der Daten auszuschließen, wenn eine Abfragebedingung außerhalb des Statistikbereichs liegt.", "limitations": "Kein echtes Parquet-Format, keine reale Dateisystem-I/O, keine Produktion."}]}
---
# Parquet und spaltenorientierte Dateien

> **Ziel:** Parquet organisiert Daten spaltenorientiert statt zeilenorientiert, mit Row-Group-Statistiken, die Predicate Pushdown ermöglichen — das Überspringen ganzer Datenblöcke ohne tatsächliches Lesen, wenn eine Abfragebedingung sie strukturell ausschließt. Diese Optimierung passt zu analytischen Zugriffsmustern (selektive Spalten, Aggregationen über viele Zeilen), nicht zu transaktionalen Einzelzeilen-Zugriffen — und funktioniert nur, wenn Dateigröße und Partitionlayout bewusst gestaltet sind.

## Zweck, Mental Model und Dependencies

Zeilenorientierte Speicherung (wie klassische relationale Datenbank-Storage-Engines) legt alle Spalten einer Zeile zusammenhängend ab — effizient für Zugriffe, die eine vollständige Zeile benötigen, aber ineffizient für Abfragen, die nur wenige Spalten aus vielen Zeilen lesen müssen, da irrelevante Spaltendaten trotzdem mitgelesen werden. Spaltenorientierte Speicherung (Parquet) legt stattdessen alle Werte einer Spalte zusammenhängend ab — eine Abfrage, die nur drei von zwanzig Spalten benötigt, liest nur die Daten dieser drei Spalten, was I/O drastisch reduziert. Row Groups sind horizontale Partitionen der Daten innerhalb einer Parquet-Datei, jede mit eigenen Spaltenstatistiken (Min/Max-Werte, Nullanzahl); Predicate Pushdown nutzt diese Statistiken, um ganze Row Groups zu überspringen, wenn eine Abfragebedingung (z. B. "Datum > 2026-01-01") außerhalb des Statistikbereichs einer Row Group liegt — die Daten werden dann gar nicht erst gelesen. Partitionlayout (physische Aufteilung in separate Dateien/Verzeichnisse nach Schlüsselwerten, z. B. nach Datum) ermöglicht zusätzliches Überspringen ganzer Dateien basierend auf dem Partitionierungsschlüssel, bevor überhaupt eine einzelne Datei geöffnet wird. Lies [KB-0210](../09-databases-storage/16-file-storage.md) und [KB-0222](04-spark-und-verteilte-verarbeitung.md).

~~~text
Row-oriented:     all columns of a row together -> good for full-row access, wasteful for selective-column analytics
Column-oriented:  all values of a column together -> read only needed columns, drastically less I/O for analytics
Row group stats (min/max per column) -> predicate pushdown skips entire row groups without reading them
Partition layout (e.g. by date) -> skips entire FILES before opening them, based on partition key alone
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Spaltenselektivität | liest die Abfrage tatsächlich nur die benötigten Spalten? | Auswahl aller Spalten (`SELECT *`) verschenkt den Kernvorteil spaltenorientierter Speicherung |
| Predicate-Pushdown-Nutzung | sind Row-Group-Statistiken für die tatsächlichen Abfragebedingungen wirksam? | unsortierte Daten innerhalb einer Datei verwässern Min/Max-Statistiken, Predicate Pushdown wird wirkungslos |
| Dateigröße | ist die Dateigröße groß genug, um Metadaten-Overhead zu vermeiden, aber klein genug für parallele Verarbeitung? | zu kleine Dateien (Small-Files-Problem) erzeugen dominierenden Metadaten-Overhead |
| Partitionlayout | folgt die Partitionierung den tatsächlich dominanten Abfrage-Filterkriterien? | falsches Partitionierungsschlüssel-Design verhindert effektives Datei-Überspringen |

Implementierung: Abfragen werden so gestaltet, dass sie nur tatsächlich benötigte Spalten selektieren, statt reflexhaft alle Spalten zu lesen, um den Kernvorteil der spaltenorientierten Speicherung zu nutzen. Daten werden, wo möglich, nach den für Predicate Pushdown relevanten Spalten sortiert geschrieben (z. B. nach Zeitstempel), damit Row-Group-Statistiken enge, aussagekräftige Min/Max-Bereiche haben, statt durch unsortierte Daten verwässert zu werden. Dateigröße wird explizit dimensioniert (typischerweise im Bereich einiger hundert Megabyte bis wenige Gigabyte), um das Small-Files-Problem (zu viele kleine Dateien mit dominierendem Metadaten-Overhead) zu vermeiden, ohne einzelne Dateien so groß zu machen, dass parallele Verarbeitung eingeschränkt wird. Partitionlayout wird nach den tatsächlich dominanten Filterkriterien der Abfragen gestaltet (häufig Zeit-basiert), sodass ganze Partitionen ohne Dateizugriff übersprungen werden können.

## Scalability, Reliability, Security und Observability

Spaltenorientierte Formate skalieren analytische Abfragen über sehr große Datenmengen gut, solange Predicate Pushdown und Partitionierung effektiv greifen — ohne diese Mechanismen skaliert die Abfragezeit linear mit der Gesamtdatenmenge, unabhängig von der tatsächlich relevanten Teilmenge. Reliability-Grenze: das Small-Files-Problem ist ein schleichendes Risiko, das sich mit der Zeit verschärft, wenn viele kleine Dateien (z. B. durch häufige, kleine Streaming-Writes) akkumulieren, bis Metadaten-Overhead die Abfrageperformance dominiert.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| analytische Abfragen sind unerwartet langsam trotz ausreichender Clusterressourcen | viele kleine Dateien erzeugen dominierenden Metadaten-Overhead (Small-Files-Problem) | durchschnittliche Dateigröße und Gesamtanzahl der Dateien im betroffenen Datensatz prüfen |
| Predicate Pushdown reduziert die gelesene Datenmenge nicht wie erwartet | Daten sind innerhalb der Dateien unsortiert, Row-Group-Statistiken sind zu breit, um wirksam zu filtern | Row-Group-Statistiken (Min/Max) gegen die tatsächliche Datenverteilung und Sortierung prüfen |
| Abfragen mit Filterkriterien auf dem Partitionierungsschlüssel lesen trotzdem alle Dateien | Partitionierungsschlüssel im physischen Layout stimmt nicht mit dem tatsächlichen Filterkriterium der Abfrage überein | Partitionierungsschema gegen die tatsächlich dominanten Abfrage-Filterkriterien vergleichen |
| Speicherverbrauch für dieselbe Datenmenge ist höher als bei vergleichbaren Systemen | ineffiziente Encoding-Konfiguration oder fehlende Kompression für die spezifischen Datentypen | Encoding- und Kompressionskonfiguration gegen Datencharakteristik (Kardinalität, Wiederholungsmuster) prüfen |

Security: Parquet-Dateien sollten mit derselben Zugriffskontrolle wie die zugrunde liegende Speicherschicht (siehe [KB-0210](../09-databases-storage/16-file-storage.md)) geschützt werden, wobei spaltenbasierte Verschlüsselung für besonders sensible einzelne Spalten (statt der gesamten Datei) eine zusätzliche, granularere Schutzoption bietet. Observability: durchschnittliche Dateigröße, Anzahl der Dateien pro Partition und tatsächlich gelesene Datenmenge relativ zur Gesamtdatenmenge (Predicate-Pushdown-Effektivität) sind zentrale Metriken für Parquet-Datensatz-Gesundheit.

## Trade-offs und Entscheidungen

**Staff** gestaltet Abfragen mit selektiver Spaltenauswahl statt reflexhaftem `SELECT *`. **Principal** macht Small-Files-Risiken und Predicate-Pushdown-Effektivität für das Team im Datensatz-Design explizit sichtbar. **Chief** positioniert spaltenorientierte Formate als bewusste Optimierung für analytische Zugriffsmuster, nicht als universellen Ersatz für zeilenorientierte transaktionale Speicherung.

Anti-Patterns: reflexhaft `SELECT *` in analytischen Abfragen verwenden und den Spaltenselektivitätsvorteil verschenken; viele kleine Dateien ohne Kompaktierungsstrategie akkumulieren lassen; Partitionierungsschlüssel wählen, der nicht den tatsächlich dominanten Abfrage-Filterkriterien entspricht.

## Production Checklist

- [ ] Analytische Abfragen selektieren nur tatsächlich benötigte Spalten.
- [ ] Dateigröße ist explizit dimensioniert, um das Small-Files-Problem zu vermeiden.
- [ ] Partitionierungsschlüssel entspricht den tatsächlich dominanten Abfrage-Filterkriterien.
- [ ] Predicate-Pushdown-Effektivität wird überwacht (gelesene vs. gesamte Datenmenge).

## Interviewfragen

### 1. Was ist der Kernvorteil spaltenorientierter gegenüber zeilenorientierter Speicherung für analytische Abfragen?

**Antwort:** Eine Abfrage, die nur wenige Spalten benötigt, liest bei spaltenorientierter Speicherung nur die Daten dieser Spalten, während zeilenorientierte Speicherung immer vollständige Zeilen inklusive irrelevanter Spalten mitlesen muss — das reduziert I/O drastisch für typische analytische Zugriffsmuster.

### 2. Was ist Predicate Pushdown, und wovon hängt seine Effektivität ab?

**Antwort:** Predicate Pushdown nutzt Row-Group-Statistiken (Min/Max-Werte), um ganze Datenblöcke ohne tatsächliches Lesen auszuschließen, wenn eine Abfragebedingung außerhalb des Statistikbereichs liegt; seine Effektivität hängt davon ab, wie eng diese Statistikbereiche sind — unsortierte Daten erzeugen breite, wenig aussagekräftige Bereiche.

### 3. Was ist das Small-Files-Problem, und warum ist es besonders schädlich für analytische Abfragen?

**Antwort:** Viele kleine Dateien erzeugen einen Metadaten-Overhead (Dateiöffnung, Header-Lesen) pro Datei, der bei sehr vielen kleinen Dateien die eigentliche Datenverarbeitungszeit dominieren kann, unabhängig von den verfügbaren Rechenressourcen.

### 4. Wie diagnostizierst du unerwartet langsame analytische Abfragen trotz ausreichender Clusterressourcen?

**Antwort:** Ich prüfe zuerst die durchschnittliche Dateigröße und Gesamtanzahl der Dateien im betroffenen Datensatz — das Small-Files-Problem ist eine häufige, aber leicht übersehene Ursache für Performanceprobleme, die nicht durch mehr Rechenressourcen gelöst wird.

### 5. Warum sollte Partitionlayout nach den tatsächlich dominanten Abfrage-Filterkriterien gestaltet werden?

**Antwort:** Ein Partitionierungsschlüssel, der den tatsächlichen Filterkriterien entspricht (z. B. Zeit-basiert für zeitgefilterte Abfragen), erlaubt dem Abfrage-Engine, ganze Dateien ohne Zugriff zu überspringen — ein nicht passender Partitionierungsschlüssel verhindert diesen Vorteil vollständig.

### 6. Widersprüchliche Anforderung: Team will minimale Dateianzahl (wenige, sehr große Dateien für minimalen Metadaten-Overhead) UND maximale Parallelität bei der Verarbeitung — wie gehst du vor?

**Antwort:** Ich würde erklären, dass sehr große Einzeldateien die Parallelisierbarkeit einschränken können (je nach Verarbeitungsengine), während sehr viele kleine Dateien Metadaten-Overhead dominieren lassen; ich würde eine mittlere Dateigröße (typischerweise einige hundert Megabyte bis wenige Gigabyte) vorschlagen, die einen praktikablen Kompromiss zwischen beiden Zielen darstellt, statt ein Extrem zu wählen.

## Praktische Labs

~~~python
# Predicate pushdown model using row group statistics
row_groups = [
    {"id": 0, "min_date": "2026-01-01", "max_date": "2026-01-31", "rows": 100000},
    {"id": 1, "min_date": "2026-02-01", "max_date": "2026-02-28", "rows": 100000},
    {"id": 2, "min_date": "2026-03-01", "max_date": "2026-03-31", "rows": 100000},
]

def query_with_pushdown(row_groups, filter_date):
    rows_read = 0
    row_groups_read = 0
    for rg in row_groups:
        if filter_date < rg["min_date"] or filter_date > rg["max_date"]:
            continue  # SKIPPED entirely - no data read from this row group
        rows_read += rg["rows"]
        row_groups_read += 1
    return rows_read, row_groups_read

rows_read, rg_read = query_with_pushdown(row_groups, filter_date="2026-02-15")
total_rows = sum(rg["rows"] for rg in row_groups)

print(f"Query for 2026-02-15: read {rows_read:,} rows from {rg_read} row group(s), out of {total_rows:,} total rows")
assert rows_read < total_rows
assert rg_read == 1
print(f"Predicate pushdown skipped {len(row_groups) - rg_read} row groups entirely without reading them.")
~~~

## Dependencies, Cross-References und Quellen

1. Apache Parquet: [File Format Documentation](https://parquet.apache.org/docs/file-format/), abgerufen 2026-09-17.
2. Apache Parquet: [Predicate Pushdown and Statistics](https://parquet.apache.org/docs/file-format/metadata/), abgerufen 2026-09-17.
3. Databricks: [Small Files Problem in Data Lakes](https://www.databricks.com/blog/2019/02/14/query-time-performance-improvements-for-highly-selective-queries-in-databricks-runtime.html), abgerufen 2026-09-17.

Produktspezifische Encoding- und Kompressionsdetails vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Tabellenformate mit automatischer Kompaktierung und Metadaten-Management (z. B. Delta Lake, Iceberg, Hudi) | Established | Gegenüber rohem Parquet-Dateimanagement für Anwendungsfälle mit häufigen Schreibvorgängen standardmäßig bevorzugen. |
| Vektorisierte Leser mit SIMD-Optimierung für spaltenorientierte Verarbeitung | Established | Für performancekritische analytische Workloads gegenüber klassischen zeilenweisen Lesern nutzen, wo unterstützt. |

Ein Team akzeptiert ein Parquet-Datensatz-Design erst, wenn Dateigröße, Partitionierung und Predicate-Pushdown-Effektivität nachweisbar gegen tatsächliche Abfragemuster geprüft sind.
