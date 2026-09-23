---
{"id": "KB-0195", "title": "PostgreSQL und interne Datenpfade", "domain": "09", "sequence": 1, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "CLOUD", "STAFF"], "requires": [{"id": "KB-0035", "concepts": ["Dateisysteme"], "needed_for": "understanding"}, {"id": "KB-0108", "concepts": ["Transaktion"], "needed_for": "both"}], "related": ["KB-0196", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "WAL-basierte Crash Recovery und Vacuum-Notwendigkeit anhand eines simulierten MVCC-Modells lokal nachvollziehen.", "rationale": "Kein echter PostgreSQL-Server nötig, um die Kernmechanik zu zeigen."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Verbindungslimits, Vacuum-Strategie und Checkpoint-Konfiguration für eine konkrete Lastcharakteristik begründet dimensionieren.", "rationale": "Diese internen Mechanismen bestimmen direkt Durchsatz, Latenz und Wartungsaufwand."}, "STAFF-TARGET": {"active": true, "scope": "Eine wachsende Tabellengröße trotz konstanter Zeilenanzahl auf fehlendes/unzureichendes Vacuum zurückführen.", "rationale": "Table Bloat durch MVCC ist eine häufige, aber diagnostizierbare PostgreSQL-Betriebsursache."}, "CHIEF-TARGET": {"active": true, "scope": "Verbindungspooling und Vacuum-Monitoring als Pflichtstandard für produktive PostgreSQL-Instanzen festlegen.", "rationale": "Beide sind häufig unterschätzte, aber grundlegende Betriebsanforderungen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Detaillierte Autovacuum-Tuning-Parameter und WAL-Archivierungsstrategien sind Vertiefung.", "rationale": "Kern ist das Verständnis von Buffer Pool, WAL, MVCC und deren Betriebsfolgen."}}, "lab_validation": [{"lab_id": "KB-0195-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für MVCC-Zeilenversionierung ohne Vacuum", "evidence": "Wiederholte Updates derselben Zeile erzeugen bei MVCC mehrere Zeilenversionen; ohne Vacuum wächst die Anzahl gespeicherter Versionen unbegrenzt trotz konstanter logischer Zeilenanzahl.", "limitations": "Kein echter PostgreSQL-Server, keine Produktion."}]}
---
# PostgreSQL und interne Datenpfade

> **Ziel:** PostgreSQL nutzt MVCC (Multi-Version Concurrency Control) für nebenläufigen Zugriff ohne Lesesperren, ein Write-Ahead Log (WAL) für Crash Recovery, und einen Buffer Pool im Speicher, um Festplattenzugriffe zu minimieren. Der praktisch wichtigste Betriebsfolge-Effekt: MVCC erzeugt bei jedem Update eine neue Zeilenversion statt die alte zu überschreiben — ohne regelmäßiges Vacuum wachsen Tabellen unbegrenzt (Table Bloat), auch wenn die logische Zeilenanzahl konstant bleibt.

## Zweck, Mental Model und Dependencies

Bei MVCC erzeugt ein UPDATE keine In-Place-Änderung, sondern eine neue Zeilenversion mit eigenem Sichtbarkeitszeitstempel — alte Versionen bleiben zunächst physisch erhalten, damit gleichzeitig laufende Transaktionen (abhängig von ihrem Isolationslevel, [KB-0108](../05-distributed-systems/08-verteilte-transaktionen.md)) konsistente Snapshots sehen können, ohne durch Schreibsperren blockiert zu werden. Vacuum ist der Prozess, der alte, für keine laufende Transaktion mehr sichtbare Zeilenversionen tatsächlich entfernt und den Speicherplatz zurückgewinnt. Das WAL zeichnet jede Änderung sequenziell auf, bevor sie in die eigentlichen Datenstrukturen geschrieben wird — bei einem Absturz kann der Zustand durch Replay des WAL rekonstruiert werden. Lies [KB-0035](../02-linux-systems/05-dateisysteme-und-persistenzpfade.md) und [KB-0108](../05-distributed-systems/08-verteilte-transaktionen.md).

~~~text
UPDATE row -> old version marked dead (not visible to new transactions), NEW version written
             -> dead version stays on disk until VACUUM reclaims it
WAL:  change written to log FIRST -> then applied to data files -> crash recovery replays the log
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| MVCC-Zeilenversionen | wird Vacuum regelmäßig und ausreichend häufig ausgeführt? | Table Bloat: wachsende Tabellengröße trotz konstanter Zeilenanzahl |
| WAL | Checkpoint-Intervall passend zur Recovery-Zeit-Anforderung? | zu langes Intervall verlängert Crash-Recovery-Dauer |
| Buffer Pool | ausreichend dimensioniert für den Working Set? | zu klein erzeugt häufige Festplattenzugriffe für häufig genutzte Daten |
| Verbindungslimit | Anzahl gleichzeitiger Verbindungen realistisch begrenzt/gepoolt? | jede PostgreSQL-Verbindung ist ein eigener Prozess mit Speicher-Overhead |

Implementierung: Autovacuum wird aktiv überwacht und bei Bedarf für stark update-lastige Tabellen aggressiver konfiguriert, statt sich blind auf Standardwerte zu verlassen. Checkpoint-Intervall und WAL-Größe werden gegen die gewünschte Crash-Recovery-Zeit abgewogen — häufigere Checkpoints verkürzen Recovery, kosten aber mehr I/O im Normalbetrieb. Da jede PostgreSQL-Verbindung ein eigener Betriebssystemprozess mit signifikantem Speicher-Overhead ist, wird Verbindungspooling (z. B. PgBouncer) für Anwendungen mit vielen kurzlebigen Verbindungen eingesetzt, statt jede Anwendungsanfrage eine eigene direkte Datenbankverbindung öffnen zu lassen.

## Scalability, Reliability, Security und Observability

PostgreSQL skaliert vertikal gut mit ausreichend dimensioniertem Buffer Pool, hat aber durch das Ein-Prozess-pro-Verbindung-Modell eine praktische Obergrenze gleichzeitiger direkter Verbindungen, die Pooling notwendig macht. Reliability-Grenze: unzureichendes Vacuum ist eine der häufigsten, aber vermeidbaren Ursachen für schleichende Performance-Degradation in PostgreSQL-Betrieb — Table Bloat verlangsamt sowohl Lese- als auch Schreiboperationen, da mehr physische Daten durchsucht werden müssen als logisch nötig wäre.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Tabellengröße wächst trotz konstanter Zeilenanzahl | unzureichendes Vacuum, Table Bloat durch MVCC | Verhältnis von toten zu lebenden Zeilenversionen (`pg_stat_user_tables`) prüfen |
| viele gleichzeitige Verbindungsversuche schlagen fehl | Verbindungslimit erreicht, kein Pooling im Einsatz | Anzahl aktiver Verbindungen gegen konfiguriertes Limit und Pooling-Nutzung prüfen |
| Crash-Recovery dauert unerwartet lange | Checkpoint-Intervall zu lang für gewünschte Recovery-Zeit | WAL-Größe seit letztem Checkpoint gegen tatsächliche Recovery-Dauer messen |
| häufige Festplattenzugriffe trotz überschaubarer Datenmenge | Buffer Pool zu klein für den tatsächlichen Working Set | Cache-Hit-Rate (`pg_stat_database`) gegen Buffer-Pool-Größe prüfen |

Security: Verbindungsberechtigungen sollten granular pro Rolle konfiguriert werden (Row-Level Security für feingranulare Zugriffskontrolle), und WAL-Archive enthalten vollständige Änderungshistorie, die entsprechend geschützt werden muss. Observability: `pg_stat_activity`, `pg_stat_user_tables` (Bloat-Indikatoren) und Checkpoint-Metriken sind zentrale Werkzeuge für PostgreSQL-Betriebsdiagnose.

## Trade-offs und Entscheidungen

**Staff** überwacht Vacuum-Aktivität und Bloat-Indikatoren aktiv, statt sich auf Standardkonfiguration zu verlassen. **Principal** dimensioniert Buffer Pool, Checkpoint-Intervall und Verbindungspooling anhand gemessener Lastcharakteristik. **Chief** verlangt Verbindungspooling und Vacuum-Monitoring als Pflichtstandard für alle produktiven PostgreSQL-Instanzen.

Anti-Patterns: Autovacuum-Standardkonfiguration für stark update-lastige Tabellen unverändert übernehmen; jede Anwendungsanfrage öffnet eine eigene direkte Datenbankverbindung ohne Pooling; Checkpoint-Konfiguration ohne Bezug zur gewünschten Recovery-Zeit wählen.

## Production Checklist

- [ ] Autovacuum-Konfiguration an tatsächliche Update-Last angepasst, nicht Standardwerte unreflektiert übernommen.
- [ ] Verbindungspooling für Anwendungen mit vielen kurzlebigen Verbindungen im Einsatz.
- [ ] Checkpoint-Intervall gegen gewünschte Crash-Recovery-Zeit abgewogen.
- [ ] Buffer-Pool-Größe anhand gemessener Cache-Hit-Rate dimensioniert.

## Interviewfragen

### 1. Warum erzeugt ein UPDATE in PostgreSQL eine neue Zeilenversion statt die alte zu überschreiben?

**Antwort:** MVCC ermöglicht so nebenläufigen Zugriff ohne Lesesperren — gleichzeitig laufende Transaktionen können je nach Isolationslevel konsistente Snapshots sehen, ohne durch Schreiboperationen blockiert zu werden.

### 2. Was ist Table Bloat und wie entsteht es?

**Antwort:** Physisches Wachstum einer Tabelle über ihre logische Zeilenanzahl hinaus, verursacht durch alte, nicht mehr sichtbare MVCC-Zeilenversionen, die nicht durch Vacuum entfernt wurden.

### 3. Warum ist Verbindungspooling für PostgreSQL oft notwendig?

**Antwort:** Jede PostgreSQL-Verbindung ist ein eigener Betriebssystemprozess mit signifikantem Speicher-Overhead; viele gleichzeitige direkte Verbindungen ohne Pooling können Ressourcen erschöpfen und das Verbindungslimit erreichen.

### 4. Wozu dient das Write-Ahead Log?

**Antwort:** Es zeichnet jede Änderung sequenziell auf, bevor sie in die eigentlichen Datenstrukturen geschrieben wird, sodass bei einem Absturz der Zustand durch Replay des Logs rekonstruiert werden kann.

### 5. Wie diagnostizierst du unzureichendes Vacuum?

**Antwort:** Über das Verhältnis toter zu lebender Zeilenversionen und physische Tabellengröße im Vergleich zur logischen Zeilenanzahl, verfügbar über PostgreSQL-Systemstatistiktabellen.

### 6. Widersprüchliche Anforderung: Team will minimale Wartungsaktivität UND stabile Performance bei sehr update-lastigen Tabellen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass MVCC bei hoher Update-Last zwangsläufig Vacuum-Aktivität benötigt, um Bloat zu vermeiden; ich würde Autovacuum aggressiver für die spezifisch betroffenen Tabellen konfigurieren, statt es komplett zu deaktivieren, um den Wartungsaufwand gezielt statt pauschal zu minimieren.

## Praktische Labs

~~~python
rows = {"row1": {"version": 1, "value": "A", "visible": True}}
dead_versions = []

def update_row(row_id, new_value):
    old = rows[row_id]
    old["visible"] = False
    dead_versions.append(dict(old))  # old version stays around until vacuum
    rows[row_id] = {"version": old["version"] + 1, "value": new_value, "visible": True}

for i in range(5):
    update_row("row1", f"value_{i}")

assert len(dead_versions) == 5  # bloat: 5 dead versions accumulated despite only 1 logical row
print(f"1 logical row, but {len(dead_versions)} dead row versions accumulated without vacuum - table bloat demonstrated.")
~~~

## Dependencies, Cross-References und Quellen

1. PostgreSQL Global Development Group: [PostgreSQL Documentation - Write-Ahead Logging (WAL)](https://www.postgresql.org/docs/current/wal-intro.html), abgerufen 2026-09-17.
2. PostgreSQL: [Routine Vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html), abgerufen 2026-09-17.

PostgreSQL-Versionsdetails (z. B. Autovacuum-Verbesserungen neuerer Versionen) vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Verbesserte Autovacuum-Algorithmen in neueren PostgreSQL-Versionen | Established | Verhalten unter tatsächlicher Last vor Vertrauen in reduzierten manuellen Tuning-Aufwand testen. |

Ein Team akzeptiert eine PostgreSQL-Konfiguration erst, wenn Vacuum-Strategie, Verbindungspooling und Buffer-Pool-Dimensionierung gegen gemessene Lastcharakteristik nachweisbar getestet sind.
