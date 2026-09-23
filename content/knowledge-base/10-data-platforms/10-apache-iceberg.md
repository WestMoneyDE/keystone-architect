---
{"id": "KB-0228", "title": "Apache Iceberg", "domain": "10", "sequence": 10, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "GENAI", "MLOPS"], "requires": [{"id": "KB-0227", "concepts": ["Parquet"], "needed_for": "understanding"}, {"id": "KB-0208", "concepts": ["Objektspeicher"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Snapshot-basiertes Modell für Tabellen-Versionierung und Time Travel lokal implementieren.", "rationale": "Der Vorteil von Tabellenformat-Metadaten gegenüber rohen Parquet-Dateien wird erst durch konkrete Snapshot-Implementierung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Schema- und Partitionsevolution für ein konkretes Iceberg-Tabellendesign begründet planen.", "rationale": "Iceberg ermöglicht Schema- und Partitionsänderungen ohne kostspielige Neuschreibung der gesamten Tabelle, was bewusst genutzt werden sollte."}, "STAFF-TARGET": {"active": true, "scope": "Konkurrierende Schreibkonflikte auf fehlendes optimistisches Concurrency-Control-Verständnis statt auf einen allgemeinen Speicherfehler zurückführen können.", "rationale": "Iceberg nutzt atomare Snapshot-Commits mit optimistischer Nebenläufigkeitskontrolle, die spezifisches Konfliktverhalten hat."}, "CHIEF-TARGET": {"active": true, "scope": "Iceberg als Tabellenformat-Schicht positionieren, die Datenbank-artige Garantien (ACID, Schema-Evolution, Time Travel) auf Object Storage bringt, nicht als Ersatz für Object Storage selbst.", "rationale": "Iceberg fügt eine Metadatenschicht über rohen Dateien hinzu, ersetzt aber nicht die zugrunde liegende Objektspeicherinfrastruktur."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Manifest-Datei-Interna und Catalog-Implementierungsdetails sind Vertiefung.", "rationale": "Kern ist das Verständnis von Snapshots, Schema-/Partitionsevolution und Concurrency Control, nicht die Metadatendatei-Interna."}}, "lab_validation": [{"lab_id": "KB-0228-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Snapshot-basierte Tabellen-Versionierung mit Time Travel", "evidence": "Jeder Commit erzeugt einen neuen, unveränderlichen Snapshot der Tabelle; eine Abfrage kann explizit einen vergangenen Snapshot referenzieren, um den historischen Tabellenzustand zu diesem Zeitpunkt zu lesen.", "limitations": "Kein echtes Iceberg-System, kein echter Objektspeicher, keine Produktion."}]}
---
# Apache Iceberg

> **Ziel:** Apache Iceberg fügt eine Tabellenformat-Metadatenschicht über rohen Parquet-Dateien (siehe [KB-0227](09-parquet-und-spaltenorientierte-dateien.md)) auf Object Storage (siehe [KB-0208](../09-databases-storage/14-object-storage.md)) hinzu — Snapshots ermöglichen atomare Commits, Time Travel und sichere Schema-/Partitionsevolution ohne kostspielige Neuschreibung der gesamten Tabelle. Iceberg ersetzt nicht die zugrunde liegende Speicherinfrastruktur, sondern bringt Datenbank-artige Garantien auf sie.

## Zweck, Mental Model und Dependencies

Rohe Parquet-Dateien auf Object Storage haben kein eingebautes Konzept von "der aktuellen Tabelle" — welche Dateien tatsächlich zur logischen Tabelle gehören, muss extern verfolgt werden (z. B. über eine Verzeichnisstruktur-Konvention), was bei konkurrierenden Schreibvorgängen oder Schemaänderungen fragil ist. Iceberg löst das durch eine Metadatenschicht: ein Snapshot ist eine unveränderliche, vollständige Momentaufnahme, welche Dateien zu einem bestimmten Zeitpunkt zur Tabelle gehören, referenziert über Manifestdateien (Listen von Datendateien mit Statistiken). Jeder Schreibvorgang (Insert, Update, Delete, Schemaänderung) erzeugt atomar einen neuen Snapshot, der über einen zentralen Katalog-Zeiger auf die aktuelle Tabellenmetadatendatei aktiviert wird — das ermöglicht Time Travel (Abfrage eines vergangenen Snapshots) und garantiert, dass Leser nie einen inkonsistenten Zwischenzustand sehen. Schema- und Partitionsevolution (neue Spalten hinzufügen, Partitionierungsschema ändern) werden als Metadatenänderungen behandelt, ohne bestehende Datendateien physisch neu schreiben zu müssen — ein fundamentaler Unterschied zu rohem Parquet, wo eine Partitionsänderung oft eine vollständige Neuschreibung der Tabelle erfordert. Lies [KB-0227](09-parquet-und-spaltenorientierte-dateien.md) und [KB-0208](../09-databases-storage/14-object-storage.md).

~~~text
Raw Parquet files:  "which files = the table" tracked externally, fragile under concurrent writes or schema change
Iceberg snapshot:    atomic, immutable metadata pointer to exact set of files at a point in time
Every write -> new snapshot -> atomic catalog pointer update -> readers NEVER see a partial/inconsistent state
Schema/partition evolution: METADATA change, NOT a full table rewrite
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Snapshot-Atomarität | wird jeder Schreibvorgang als atomarer, vollständiger Snapshot committet? | nicht-atomare Schreibvorgänge können Lesern inkonsistente Zwischenzustände zeigen |
| Concurrency Control | ist bekannt, wie Iceberg konkurrierende Schreibkonflikte über optimistische Nebenläufigkeitskontrolle behandelt? | unerwartete Commit-Fehlschläge bei konkurrierenden Writern werden als Bug statt als beabsichtigtes Konfliktverhalten fehlinterpretiert |
| Schema-/Partitionsevolution | werden Schema- und Partitionsänderungen als Metadatenänderungen statt physischer Neuschreibung geplant? | unnötige, kostspielige vollständige Tabellenneuschreibungen bei vermeidbaren Änderungen |
| Snapshot-Retention | ist eine explizite Retention-Policy für alte Snapshots definiert? | unbegrenzt akkumulierende Snapshots erzeugen wachsenden Metadaten- und Speicher-Overhead |

Implementierung: Schreibvorgänge werden über die Iceberg-API/den Iceberg-Katalog durchgeführt, die atomare Snapshot-Commits garantieren, statt Dateien direkt und unkoordiniert auf dem Objektspeicher zu manipulieren. Bei konkurrierenden Schreibvorgängen wird das optimistische Nebenläufigkeitskontrollmodell verstanden: ein Writer liest den aktuellen Snapshot, bereitet Änderungen vor, und der Commit schlägt fehl (mit Wiederholungsmöglichkeit), wenn sich der Snapshot zwischenzeitlich durch einen anderen Writer geändert hat. Schema- und Partitionsänderungen werden bewusst über die Iceberg-Metadatenmechanismen durchgeführt (Spalten hinzufügen/umbenennen, Partitionsschema ändern), die keine physische Neuschreibung bestehender Daten erfordern. Snapshot-Retention wird explizit konfiguriert (wie viele oder wie alte Snapshots aufbewahrt werden), mit periodischer Expiration alter Snapshots, um Metadaten- und Speicher-Overhead zu begrenzen.

## Scalability, Reliability, Security und Observability

Iceberg skaliert Metadatenverwaltung für sehr große Tabellen (viele Millionen Dateien) besser als naive dateisystembasierte Ansätze, weil Manifestdateien hierarchisch organisiert sind und nicht jede Abfrage das gesamte Dateisystem durchsuchen muss. Reliability-Grenze: ohne explizite Snapshot-Retention-Policy akkumulieren Metadaten und referenzierte, aber logisch "veraltete" Datendateien unbegrenzt, was Speicherkosten und Metadaten-Verwaltungsoverhead über Zeit erhöht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| konkurrierende Schreibvorgänge schlagen unerwartet häufig fehl | hohe Schreibkonkurrenz auf dieselbe Tabelle trifft auf optimistische Nebenläufigkeitskontrolle, viele Commit-Konflikte | Häufigkeit konkurrierender Schreibvorgänge auf dieselbe Tabelle/Partition gegen die beobachtete Commit-Fehlschlagsrate prüfen |
| Speicherverbrauch für eine Tabelle wächst deutlich schneller als die logische Datenmenge | fehlende oder unzureichende Snapshot-Retention-Policy, alte Snapshots und ihre referenzierten Dateien akkumulieren | Snapshot-Anzahl und -Alter gegen konfigurierte Retention-Policy prüfen |
| Schema- oder Partitionsänderung dauert unerwartet lange | Änderung wurde als vollständige Tabellenneuschreibung statt als reine Metadatenänderung durchgeführt | prüfen, ob die durchgeführte Änderung tatsächlich über die Iceberg-Metadatenevolution-Mechanismen erfolgte |
| Abfrage liefert inkonsistente oder unerwartete Ergebnisse während eines laufenden Schreibvorgangs | Zugriff erfolgte nicht über den Iceberg-Katalog-Mechanismus, sondern direkt auf zugrunde liegende Dateien | Zugriffspfad auf konsequente Nutzung der Iceberg-API/des Katalogs statt direktem Dateizugriff prüfen |

Security: Iceberg-Katalog-Zugriff sollte separat von direktem Objektspeicher-Zugriff kontrolliert werden, da ein Akteur mit direktem Objektspeicherzugriff die Atomaritätsgarantien umgehen und die Tabelle in einen inkonsistenten Zustand bringen könnte. Observability: Snapshot-Anzahl und -Alter, Commit-Konfliktrate und Manifestdatei-Größe/-Anzahl sind zentrale Metriken für Iceberg-Tabellen-Gesundheit.

## Trade-offs und Entscheidungen

**Staff** führt alle Schreibvorgänge konsequent über die Iceberg-API/den Katalog durch, nie direkt auf zugrunde liegenden Dateien. **Principal** macht Concurrency-Control-Verhalten und Snapshot-Retention für das Team im Betriebsmodell explizit nachvollziehbar. **Chief** positioniert Iceberg als Tabellenformat-Schicht, die Datenbank-artige Garantien auf Object Storage bringt, nicht als Ersatz für die zugrunde liegende Speicherinfrastruktur.

Anti-Patterns: direkten Dateizugriff auf zugrunde liegende Parquet-Dateien statt konsequenter Nutzung der Iceberg-API; Snapshot-Retention nie konfigurieren und unbegrenztes Metadaten-/Speicherwachstum in Kauf nehmen; Schema-/Partitionsänderungen als vollständige Tabellenneuschreibung durchführen, wo Metadatenevolution ausreichen würde.

## Production Checklist

- [ ] Alle Schreibvorgänge erfolgen konsequent über die Iceberg-API/den Katalog.
- [ ] Concurrency-Control-Verhalten bei konkurrierenden Schreibvorgängen ist verstanden und im Betriebsmodell berücksichtigt.
- [ ] Snapshot-Retention-Policy ist explizit konfiguriert und wird überwacht.
- [ ] Schema-/Partitionsänderungen nutzen Metadatenevolution statt vollständiger Neuschreibung.

## Interviewfragen

### 1. Was ist der Kernvorteil von Iceberg gegenüber rohen Parquet-Dateien auf Object Storage?

**Antwort:** Iceberg fügt eine Metadatenschicht mit atomaren Snapshot-Commits hinzu, die garantiert, dass Leser nie einen inkonsistenten Zwischenzustand sehen, und ermöglicht Time Travel sowie Schema-/Partitionsevolution als reine Metadatenänderungen ohne physische Neuschreibung.

### 2. Was passiert bei konkurrierenden Schreibvorgängen auf dieselbe Iceberg-Tabelle?

**Antwort:** Iceberg nutzt optimistische Nebenläufigkeitskontrolle — ein Writer bereitet Änderungen basierend auf dem gelesenen Snapshot vor, und der Commit schlägt fehl, wenn sich der Snapshot zwischenzeitlich durch einen anderen Writer geändert hat, was eine Wiederholung des Schreibvorgangs erfordert.

### 3. Warum ist Schema-/Partitionsevolution in Iceberg deutlich günstiger als bei rohem Parquet?

**Antwort:** Iceberg behandelt Schema- und Partitionsänderungen als reine Metadatenänderungen, während rohes Parquet oft eine vollständige physische Neuschreibung aller Datendateien erfordert, um eine Partitionsänderung umzusetzen.

### 4. Wie diagnostizierst du unerwartet häufige fehlgeschlagene Commits in einer Iceberg-Tabelle?

**Antwort:** Ich prüfe die Häufigkeit konkurrierender Schreibvorgänge auf dieselbe Tabelle oder Partition — eine hohe Schreibkonkurrenz trifft auf die optimistische Nebenläufigkeitskontrolle und erzeugt entsprechend häufigere Commit-Konflikte, was beabsichtigtes Verhalten, kein Bug ist.

### 5. Warum ist eine explizite Snapshot-Retention-Policy notwendig?

**Antwort:** Ohne Retention-Policy akkumulieren Snapshots und ihre referenzierten Datendateien unbegrenzt, auch wenn sie logisch veraltet sind, was Metadaten-Overhead und Speicherkosten über Zeit unnötig erhöht.

### 6. Widersprüchliche Anforderung: Team will vollständigen Time-Travel-Zugriff auf beliebig alte Tabellenzustände UND minimale Speicherkosten — wie gehst du vor?

**Antwort:** Ich würde erklären, dass unbegrenzter Time Travel unbegrenzte Snapshot-Retention erfordert, was den Speicherkosten direkt zuwiderläuft; ich würde eine Retention-Policy vorschlagen, die Time Travel für einen definierten, geschäftlich sinnvollen Zeitraum (z. B. 30 oder 90 Tage) ermöglicht, statt unbegrenzten Time Travel bei gleichzeitig minimalen Kosten zu versprechen.

## Praktische Labs

~~~python
# Snapshot-based table versioning with time travel
snapshots = []

def commit_snapshot(files, timestamp):
    snapshot_id = len(snapshots)
    snapshots.append({"id": snapshot_id, "files": files, "timestamp": timestamp})
    return snapshot_id

def read_at_snapshot(snapshot_id):
    return snapshots[snapshot_id]["files"]

def read_current():
    return snapshots[-1]["files"]

commit_snapshot(files=["data_2026_01.parquet"], timestamp="2026-01-01T00:00:00")
commit_snapshot(files=["data_2026_01.parquet", "data_2026_02.parquet"], timestamp="2026-02-01T00:00:00")
commit_snapshot(files=["data_2026_01.parquet", "data_2026_02.parquet", "data_2026_03.parquet"], timestamp="2026-03-01T00:00:00")

current_state = read_current()
historical_state = read_at_snapshot(0)  # time travel to the first snapshot

print(f"Current table state: {current_state}")
print(f"Table state at snapshot 0 (time travel): {historical_state}")
assert len(current_state) == 3
assert len(historical_state) == 1
print("Time travel query returns the exact historical state, unaffected by later writes - atomicity preserved.")
~~~

## Dependencies, Cross-References und Quellen

1. Apache Iceberg: [Table Spec — Snapshots and Manifests](https://iceberg.apache.org/spec/), abgerufen 2026-09-17.
2. Apache Iceberg: [Schema Evolution](https://iceberg.apache.org/docs/latest/evolution/), abgerufen 2026-09-17.
3. Netflix Technology Blog: [Iceberg at Netflix — Table Format for Huge Analytic Datasets](https://netflixtechblog.com/iceberg-a-fast-table-format-for-s3-14e1a5c6d99a), abgerufen 2026-09-17.

Parquet-Dateiformat-Grundlagen sind kanonisch in [KB-0227](09-parquet-und-spaltenorientierte-dateien.md) behandelt. Produktspezifische Catalog-Implementierungen (Glue, Hive Metastore, REST Catalog) vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| REST-basierte Iceberg-Catalog-Standardisierung für Interoperabilität zwischen Engines | Adopting | Gegenüber proprietären Catalog-Implementierungen für Multi-Engine-Umgebungen bevorzugen. |
| Automatisierte, hintergrundbasierte Compaction und Snapshot-Expiration | Established | Standardmäßig aktivieren, um manuelle Wartungslast für Tabellen mit hoher Schreibfrequenz zu reduzieren. |

Ein Team akzeptiert ein Iceberg-Tabellendesign erst, wenn Snapshot-Retention konfiguriert und Concurrency-Control-Verhalten für die erwartete Schreiblast nachweisbar getestet sind.
