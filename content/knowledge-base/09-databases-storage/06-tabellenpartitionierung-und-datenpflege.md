---
{"id": "KB-0200", "title": "Tabellenpartitionierung und Datenpflege", "domain": "09", "sequence": 6, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "CLOUD", "STAFF"], "requires": [{"id": "KB-0197", "concepts": ["Query Planner"], "needed_for": "both"}, {"id": "KB-0106", "concepts": ["Partitionierung", "Sharding"], "needed_for": "understanding"}], "related": ["KB-0195", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Partition Pruning lokal simulieren und zeigen, dass eine Abfrage mit Partitionsschlüssel nur relevante Partitionen durchsucht.", "rationale": "Kein echter Datenbankserver nötig, um das Kernprinzip zu zeigen."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Tabellenpartitionierung (innerhalb einer Datenbankinstanz) von systemübergreifendem Sharding klar abgrenzen und für den jeweiligen Anwendungsfall begründet wählen.", "rationale": "Beide Konzepte klingen ähnlich, lösen aber unterschiedliche Skalierungsprobleme auf unterschiedlichen Ebenen."}, "STAFF-TARGET": {"active": true, "scope": "Eine Abfrage, die alle Partitionen statt nur relevante durchsucht, auf fehlendes Partition Pruning zurückführen.", "rationale": "Ohne Partitionsschlüssel im WHERE-Clause profitiert eine Abfrage nicht von der Partitionierung."}, "CHIEF-TARGET": {"active": true, "scope": "Partitionierungsstrategie für große, wachsende Tabellen als Standard-Wartungswerkzeug festlegen.", "rationale": "Partitionierung erleichtert Datenpflege (Löschung alter Daten) und Abfrageperformance erheblich."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Detaillierte Partition-Wechsel-Strategien (Attach/Detach) und automatisierte Partitionserstellung sind Vertiefung.", "rationale": "Kern ist das Verständnis von Pruning und die Abgrenzung zu Sharding."}}, "lab_validation": [{"lab_id": "KB-0200-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Partition Pruning bei Range-partitionierter Tabelle", "evidence": "Eine Abfrage mit Partitionsschlüssel im Filterkriterium durchsucht nur die relevante Partition; eine Abfrage ohne Partitionsschlüssel muss alle Partitionen durchsuchen.", "limitations": "Kein echter Datenbankserver, keine Produktion."}]}
---
# Tabellenpartitionierung und Datenpflege

> **Ziel:** Tabellenpartitionierung teilt eine große Tabelle innerhalb einer einzigen Datenbankinstanz in kleinere physische Partitionen auf (z. B. nach Datum) — der Query Planner ([KB-0197](03-query-planner-und-sql-analyse.md)) kann dann bei passendem Filterkriterium irrelevante Partitionen komplett überspringen (Partition Pruning). Das ist grundlegend verschieden von Sharding ([KB-0106](../05-distributed-systems/06-partitionierung-und-datenverteilung.md)), das Daten über mehrere unabhängige Datenbankinstanzen verteilt — beide Konzepte klingen ähnlich, lösen aber unterschiedliche Skalierungsprobleme.

## Zweck, Mental Model und Dependencies

Bei Range-Partitionierung (z. B. nach Monat) wird jede logische Partition physisch als separate Tabelle gespeichert, aber über eine gemeinsame übergeordnete Tabellendefinition angesprochen. Enthält eine Abfrage den Partitionsschlüssel im Filterkriterium (z. B. „WHERE created_at >= '2026-09-01'"), kann der Query Planner erkennen, dass nur bestimmte Partitionen relevante Daten enthalten können, und alle anderen komplett überspringen (Pruning) — das reduziert die durchsuchte Datenmenge drastisch. Datenpflege wird durch Partitionierung erheblich einfacher: alte Daten löschen bedeutet, eine ganze Partition zu entfernen (sehr schnell), statt Millionen einzelner Zeilen mit DELETE zu löschen (langsam, erzeugt viel WAL-Aktivität und Table Bloat, [KB-0195](01-postgresql-und-interne-datenpfade.md)). Lies [KB-0197](03-query-planner-und-sql-analyse.md) und [KB-0106](../05-distributed-systems/06-partitionierung-und-datenverteilung.md).

~~~text
Table "events" partitioned by month: events_2026_08, events_2026_09, events_2026_10
Query WHERE created_at >= '2026-09-01' -> planner PRUNES events_2026_08 entirely, only scans events_2026_09/10
Delete old data: DROP old partition events_2026_08 (fast) vs. DELETE FROM events WHERE ... (slow, bloat-inducing)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Partitionsschlüssel | wird er konsequent in Abfragefilterkriterien genutzt? | fehlender Partitionsschlüssel in Abfragen verhindert Pruning |
| Partitionsstrategie | Range (Datum) oder Hash (Verteilung), passend zum Zugriffsmuster? | falsche Strategie liefert weder Pruning-Vorteil noch gleichmäßige Verteilung |
| Partitionswechsel | werden neue Partitionen rechtzeitig automatisiert erstellt? | fehlende zukünftige Partition lässt neue Daten ohne Ziel |
| Abgrenzung zu Sharding | ist klar, dass Partitionierung innerhalb einer Instanz bleibt? | Verwechslung mit Sharding führt zu falschen Skalierungserwartungen |

Implementierung: die Partitionierungsstrategie wird nach dem dominanten Abfragemuster gewählt — Range-Partitionierung nach Datum eignet sich für zeitbasierte Abfragen und Datenpflege (z. B. „lösche Daten älter als 90 Tage"), Hash-Partitionierung für gleichmäßige Lastverteilung ohne natürliche Zeitachse. Zukünftige Partitionen werden automatisiert im Voraus erstellt, damit neue Daten immer ein Ziel haben. Anwendungscode und Abfragen werden so gestaltet, dass sie konsequent den Partitionsschlüssel im Filterkriterium mitführen, um vom Pruning tatsächlich zu profitieren — eine Abfrage ohne Partitionsschlüssel muss weiterhin alle Partitionen durchsuchen.

## Scalability, Reliability, Security und Observability

Partitionierung skaliert Abfrageperformance und Wartungsvorgänge innerhalb einer Datenbankinstanz, löst aber nicht das grundlegende Skalierungslimit einer einzelnen Instanz (CPU, I/O, Speicher) — dafür ist Sharding über mehrere Instanzen nötig. Reliability-Grenze: fehlt eine zukünftige Partition (weil die automatisierte Erstellung fehlgeschlagen ist), können neue Daten je nach Datenbanksystem entweder abgelehnt werden oder in eine Standardpartition fallen, was die Pruning-Vorteile für diese Daten zunichtemacht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Abfrage durchsucht alle Partitionen trotz Partitionierung | Partitionsschlüssel fehlt im Abfragefilterkriterium | Query-Plan auf tatsächlich gescannte Partitionen prüfen |
| Schreibvorgänge für neue Daten schlagen fehl | zukünftige Partition wurde nicht rechtzeitig automatisiert erstellt | Partitionserstellungs-Automatisierung und deren Vorlaufzeit prüfen |
| Datenlöschung dauert unerwartet lange und erzeugt hohe Last | DELETE statt Partition-Drop für alte Daten genutzt | prüfen, ob Datenpflege über Partitionswechsel statt Massen-DELETE erfolgt |
| Team verwechselt Partitionierung mit horizontaler Skalierung über mehrere Server | fehlende begriffliche Abgrenzung zu Sharding | prüfen, ob die tatsächliche Kapazitätsgrenze (eine Instanz) verstanden wurde |

Security: Partitionsweise Zugriffskontrolle kann für Mandantentrennung genutzt werden, sollte aber nicht mit echter physischer Isolation verwechselt werden, da alle Partitionen weiterhin in derselben Datenbankinstanz liegen. Observability: Partition-Pruning-Erfolg (sichtbar in Query-Plänen) und Partitionsgrößenverteilung sind zentrale Metriken zur Diagnose von Partitionierungsproblemen.

## Trade-offs und Entscheidungen

**Staff** prüft bei langsamen Abfragen auf partitionierten Tabellen zuerst, ob der Partitionsschlüssel im Filterkriterium fehlt. **Principal** wählt Partitionierungsstrategie nach dominantem Zugriffs-/Wartungsmuster und automatisiert Partitionserstellung. **Chief** etabliert Partitionierung als Standard-Wartungswerkzeug für große, zeitbasiert wachsende Tabellen, mit klarer begrifflicher Abgrenzung zu Sharding.

Anti-Patterns: Partitionierung mit Sharding verwechseln und falsche Skalierungserwartungen daraus ableiten; Abfragen ohne Partitionsschlüssel im Filterkriterium bei partitionierten Tabellen betreiben; Datenpflege weiterhin über Massen-DELETE statt Partition-Drop durchführen.

## Production Checklist

- [ ] Partitionierungsstrategie passt zum dominanten Abfrage-/Wartungsmuster.
- [ ] Abfragen führen konsequent den Partitionsschlüssel im Filterkriterium mit.
- [ ] Zukünftige Partitionen werden automatisiert im Voraus erstellt.
- [ ] Datenpflege (Löschung alter Daten) erfolgt über Partitionswechsel, nicht Massen-DELETE.

## Interviewfragen

### 1. Was ist Partition Pruning?

**Antwort:** Der Query Planner erkennt anhand des Partitionsschlüssels im Filterkriterium, welche Partitionen relevante Daten enthalten können, und überspringt alle anderen Partitionen vollständig bei der Abfrageausführung.

### 2. Was ist der grundlegende Unterschied zwischen Tabellenpartitionierung und Sharding?

**Antwort:** Partitionierung teilt eine Tabelle innerhalb einer einzigen Datenbankinstanz auf; Sharding verteilt Daten über mehrere unabhängige Datenbankinstanzen — Partitionierung löst kein Kapazitätslimit einer einzelnen Instanz.

### 3. Warum ist Partition-Drop schneller als Massen-DELETE für Datenpflege?

**Antwort:** Eine ganze Partition zu entfernen ist eine Metadatenoperation ohne zeilenweise Verarbeitung, während DELETE jede betroffene Zeile einzeln als MVCC-Löschmarkierung verarbeiten muss, was viel WAL-Aktivität und Table Bloat erzeugt.

### 4. Was passiert, wenn eine Abfrage keinen Partitionsschlüssel im Filterkriterium enthält?

**Antwort:** Der Planner kann kein Pruning anwenden und muss alle Partitionen durchsuchen, wodurch der Performancevorteil der Partitionierung für diese spezifische Abfrage verloren geht.

### 5. Wie wählst du zwischen Range- und Hash-Partitionierung?

**Antwort:** Range-Partitionierung eignet sich für zeitbasierte Zugriffs- und Wartungsmuster (z. B. Löschen alter Daten); Hash-Partitionierung eignet sich, wenn gleichmäßige Lastverteilung ohne natürliche Zeitachse benötigt wird.

### 6. Widersprüchliche Anforderung: Team will maximale Abfrageperformance durch Partitionierung UND flexible Ad-hoc-Abfragen ohne festen Partitionsschlüssel — wie gehst du vor?

**Antwort:** Ich würde erklären, dass Abfragen ohne Partitionsschlüssel vom Pruning nicht profitieren können; für häufige Ad-hoc-Muster ohne festen Schlüssel würde ich zusätzliche Indizes innerhalb der Partitionen oder eine sekundäre Zugriffsstruktur erwägen, statt die Partitionierungsstrategie allein für seltene Ad-hoc-Fälle aufzugeben.

## Praktische Labs

~~~python
partitions = {
    "events_2026_08": [{"id": 1, "date": "2026-08-15"}],
    "events_2026_09": [{"id": 2, "date": "2026-09-10"}],
}

def query_with_pruning(partitions, filter_month):
    relevant = [p for p in partitions if filter_month in p]
    scanned_rows = sum(len(partitions[p]) for p in relevant)
    return relevant, scanned_rows

pruned_partitions, rows_scanned = query_with_pruning(partitions, "2026_09")
assert pruned_partitions == ["events_2026_09"]
assert rows_scanned == 1  # only the relevant partition was scanned, not all data
print(f"Pruned to {pruned_partitions}, scanning only {rows_scanned} row(s) instead of all partitions.")
~~~

## Dependencies, Cross-References und Quellen

1. PostgreSQL Global Development Group: [Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html), abgerufen 2026-09-17.

Datenbankspezifische Partitionierungs-Automatisierungs-Tooling-Details vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Partitionsverwaltungs-Extensions (automatische Erstellung/Rotation) | Established | Fehlerverhalten bei Automatisierungsausfall (fehlende zukünftige Partition) vor Vertrauen prüfen. |

Ein Team akzeptiert eine Partitionierungsstrategie erst, wenn Pruning-Erfolg für typische Abfragen nachgewiesen und automatisierte Partitionserstellung getestet sind.
