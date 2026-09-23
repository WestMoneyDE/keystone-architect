---
{"id": "KB-0226", "title": "Debezium und CDC-Betrieb", "domain": "10", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "GENAI", "MLOPS"], "requires": [{"id": "KB-0190", "concepts": ["CDC als Ereignisbrücke"], "needed_for": "understanding"}, {"id": "KB-0179", "concepts": ["Kafka"], "needed_for": "understanding"}], "related": ["KB-0220"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Modell für Log-Offset-Nachverfolgung und Snapshot-zu-Streaming-Übergang lokal implementieren.", "rationale": "Snapshot-Lücken und Offsetverluste werden erst durch konkrete Offset-Tracking-Implementierung diagnostizierbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Snapshot- und Wiederanlaufstrategie für einen konkreten CDC-Connector-Betrieb begründet gestalten.", "rationale": "Falsche Snapshot- oder Offset-Verwaltung kann Datenverlust oder Duplikate in der Änderungsstromverarbeitung erzeugen."}, "STAFF-TARGET": {"active": true, "scope": "Fehlende Änderungsereignisse nach einem Connector-Neustart auf Offsetverlust statt auf ein Quellsystemproblem zurückführen können.", "rationale": "Ein Connector, der seinen letzten verarbeiteten Log-Offset verliert, kann Änderungen überspringen, ohne dass die Quelldatenbank selbst ein Problem hat."}, "CHIEF-TARGET": {"active": true, "scope": "CDC-Betrieb als kontinuierliche, überwachungsbedürftige Infrastruktur mit Quellsystemlast-Auswirkungen positionieren, nicht als einmalig konfigurierte Integration.", "rationale": "CDC-Connectoren lesen kontinuierlich Transaktionslogs, was reale Last und Betriebsrisiken für das Quellsystem erzeugt."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Debezium-spezifische Connector-Konfiguration für einzelne Datenbanktypen ist Vertiefung.", "rationale": "Kern ist das Verständnis von Snapshots, Log-Offsets und Schemaänderungsbehandlung, nicht die produktspezifische Konfiguration."}}, "lab_validation": [{"lab_id": "KB-0226-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Log-Offset-Nachverfolgung mit simuliertem Connector-Neustart", "evidence": "Ein Connector, der seinen letzten verarbeiteten Offset korrekt persistiert, kann nach einem Neustart exakt dort fortsetzen, wo er aufgehört hat; ein Connector ohne persistierten Offset muss entweder Änderungen überspringen oder von vorne beginnen.", "limitations": "Kein echter Debezium-Connector, keine reale Datenbank-Transaktionslog, keine Produktion."}]}
---
# Debezium und CDC-Betrieb

> **Ziel:** Debezium-artige CDC-Connectoren lesen kontinuierlich Datenbank-Transaktionslogs und wandeln Änderungen in einen Ereignisstrom um — das ist kontinuierliche, überwachungsbedürftige Infrastruktur mit realer Last auf dem Quellsystem, keine einmalig konfigurierte Integration. Snapshot-Lücken und Offsetverluste sind spezifische Betriebsrisiken, die systematisch diagnostiziert werden müssen, nicht generische "Connector kaputt"-Probleme.

## Zweck, Mental Model und Dependencies

Ein CDC-Connector (siehe [KB-0190](../08-messaging-workflows/14-cdc-als-ereignisbruecke.md) für die konzeptionelle Grundlage) durchläuft typischerweise zwei Phasen: einen initialen Snapshot (vollständiger Export des aktuellen Datenbankzustands zum Startzeitpunkt) und anschließend kontinuierliches Streaming von Änderungen aus dem Transaktionslog ab dem Snapshot-Zeitpunkt. Der Log-Offset markiert die Position im Transaktionslog, bis zu der der Connector Änderungen bereits verarbeitet hat — dieser Offset muss zuverlässig persistiert werden, damit ein Connector nach einem Neustart exakt dort fortsetzen kann, statt Änderungen zu überspringen (Offsetverlust) oder erneut zu verarbeiten (Duplikate). Snapshot-Lücken entstehen, wenn zwischen dem Beginn des Snapshots und dem Übergang zum kontinuierlichen Streaming Änderungen am Quellsystem stattfinden, die weder im Snapshot noch im initial verarbeiteten Log-Bereich erfasst werden — ein sorgfältig koordinierter Übergang (typischerweise durch Erfassung der Log-Position zu Snapshot-Beginn) verhindert diese Lücke. Schemaänderungen am Quellsystem (z. B. neue Spalten) müssen vom Connector erkannt und in nachgelagerte Konsumenten propagiert werden, ohne den Änderungsstrom zu unterbrechen. Lies [KB-0190](../08-messaging-workflows/14-cdc-als-ereignisbruecke.md) und [KB-0179](../08-messaging-workflows/03-kafka-und-partitionierte-ereignislogs.md).

~~~text
Snapshot phase:    export full current state, record log position at snapshot start
Streaming phase:   continue from that log position -> no gap, no duplication
Lost offset:        connector restarts without knowing where it left off -> skips changes (data loss) or replays (duplicates)
Snapshot gap:        changes between snapshot start and log position capture are missed if not coordinated correctly
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Offset-Persistenz | wird der Log-Offset zuverlässig und konsistent mit der Verarbeitung persistiert? | Offsetverlust bei Neustart führt zu übersprungenen Änderungen oder Duplikaten |
| Snapshot-Log-Übergang | ist der Übergang von Snapshot zu Streaming korrekt koordiniert, ohne Lücke? | Änderungen im Übergangsfenster werden weder im Snapshot noch im Stream erfasst |
| Quellsystemlast | ist die Last des Connectors auf das Quellsystem (Transaktionslog-Lesevorgänge, Snapshot-Export) bewertet? | unkontrollierte CDC-Last kann die Performance des produktiven Quellsystems beeinträchtigen |
| Schemaänderungsbehandlung | werden Schemaänderungen am Quellsystem erkannt und korrekt propagiert? | unerkannte Schemaänderungen können den Connector zum Stillstand bringen oder falsche Daten propagieren |

Implementierung: Log-Offsets werden über einen dedizierten, zuverlässigen Speichermechanismus persistiert (typischerweise selbst über einen Kafka-Topic oder eine externe Datenbank), synchron mit der tatsächlichen Ereignisverarbeitung, damit bei einem Neustart der exakte Fortsetzungspunkt bekannt ist. Der Übergang von Snapshot zu Streaming wird durch Erfassung der Transaktionslog-Position zu Beginn des Snapshots koordiniert, sodass nach Abschluss des Snapshots lückenlos ab dieser Position weiterverarbeitet werden kann. Quellsystemlast wird durch Konfiguration (z. B. Snapshot-Parallelität, Polling-Intervalle) explizit begrenzt und überwacht, insbesondere während des initialen, potenziell ressourcenintensiven Snapshots. Schemaänderungen werden über einen expliziten Schema-Evolution-Mechanismus (oft in Verbindung mit einer Schema Registry) behandelt, der Konsumenten über Änderungen informiert, statt den Änderungsstrom stillschweigend zu brechen.

## Scalability, Reliability, Security und Observability

CDC-Connectoren skalieren gut für kontinuierliche Änderungserfassung mit geringem Overhead auf dem Quellsystem, solange sie das Transaktionslog effizient lesen, statt das Quellsystem aktiv abzufragen (Polling). Reliability-Grenze: ein Offsetverlust ist ein besonders tückisches Risiko, weil der Connector nach einem Neustart scheinbar normal weiterläuft, aber stillschweigend einen Bereich von Änderungen übersprungen haben kann, was erst später als Dateninkonsistenz auffällt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| nach einem Connector-Neustart fehlen bestimmte Änderungsereignisse im nachgelagerten Ereignisstrom | Log-Offset wurde nicht korrekt persistiert, Connector hat einen Bereich übersprungen | letzten persistierten Offset gegen den tatsächlichen Log-Zustand zum Neustart-Zeitpunkt vergleichen |
| Änderungen, die während der initialen Synchronisation stattfanden, fehlen vollständig | Snapshot-Log-Übergang war nicht korrekt koordiniert, Lücke zwischen Snapshot und Streaming-Start | Log-Position zu Snapshot-Beginn gegen den tatsächlichen Streaming-Startpunkt prüfen |
| Quelldatenbank-Performance verschlechtert sich während CDC-Betrieb | Connector erzeugt unerwartet hohe Last durch aggressive Snapshot-Parallelität oder Polling | Connector-Last-Metriken gegen Quelldatenbank-Performance-Metriken zeitlich korrelieren |
| Connector stoppt oder produziert fehlerhafte Ereignisse nach einer Schemaänderung am Quellsystem | Schemaänderungsbehandlung hat die Änderung nicht korrekt erkannt oder propagiert | Connector-Logs um den Zeitpunkt der Schemaänderung auf Fehler oder Warnungen prüfen |

Security: CDC-Connectoren benötigen oft privilegierten Lesezugriff auf Transaktionslogs, was eine sensible Berechtigung darstellt, die auf das absolut notwendige Minimum beschränkt und separat von regulären Anwendungs-Datenbankzugriffen verwaltet werden sollte. Observability: Offset-Fortschritt relativ zum aktuellen Log-Ende (Replication Lag), Snapshot-Fortschritt und Connector-Fehlerrate sind zentrale Metriken für CDC-Betriebsgesundheit.

## Trade-offs und Entscheidungen

**Staff** persistiert Log-Offsets zuverlässig und synchron mit der Ereignisverarbeitung. **Principal** macht Quellsystemlast-Risiken für das Team im Betriebsplan explizit sichtbar. **Chief** positioniert CDC-Betrieb als kontinuierliche, überwachungsbedürftige Infrastruktur, nicht als einmalig konfigurierte, dann sich selbst überlassene Integration.

Anti-Patterns: Log-Offset-Persistenz nicht regelmäßig überwachen und Offsetverlust erst bei sichtbarer Dateninkonsistenz entdecken; Snapshot-Parallelität ohne Rücksicht auf Quellsystemlast maximal konfigurieren; Schemaänderungen am Quellsystem ohne koordinierte Connector-Reaktion durchführen.

## Production Checklist

- [ ] Log-Offset-Persistenz ist zuverlässig und wird kontinuierlich überwacht (Replication Lag).
- [ ] Snapshot-Log-Übergang ist nachweisbar lückenlos koordiniert.
- [ ] Quellsystemlast durch den Connector ist begrenzt und überwacht.
- [ ] Schemaänderungsbehandlung ist getestet, inklusive Propagation an Konsumenten.

## Interviewfragen

### 1. Warum ist Offsetverlust bei CDC-Connectoren besonders tückisch?

**Antwort:** Ein Connector mit verlorenem Offset läuft nach einem Neustart scheinbar normal weiter, kann aber stillschweigend einen Bereich von Änderungen übersprungen haben — das führt zu Dateninkonsistenz, die oft erst deutlich später auffällt, nicht zu einem sofort sichtbaren Fehler.

### 2. Was ist eine Snapshot-Lücke, und wie wird sie vermieden?

**Antwort:** Eine Snapshot-Lücke entsteht, wenn Änderungen zwischen Snapshot-Beginn und dem Start des kontinuierlichen Streamings weder im Snapshot noch im Log-Stream erfasst werden; sie wird vermieden, indem die Transaktionslog-Position zu Snapshot-Beginn erfasst und das Streaming exakt ab dieser Position fortgesetzt wird.

### 3. Warum erzeugt CDC-Betrieb reale Last auf dem Quellsystem, obwohl er "nur" Änderungen liest?

**Antwort:** Der initiale Snapshot exportiert den vollständigen aktuellen Datenbankzustand, was ressourcenintensiv sein kann, und das kontinuierliche Lesen des Transaktionslogs erzeugt zusätzliche I/O-Last, die je nach Konfiguration (z. B. Snapshot-Parallelität) spürbaren Einfluss auf die Performance des produktiven Quellsystems haben kann.

### 4. Wie diagnostizierst du fehlende Änderungsereignisse nach einem Connector-Neustart?

**Antwort:** Ich vergleiche den letzten persistierten Log-Offset gegen den tatsächlichen Log-Zustand zum Zeitpunkt des Neustarts — eine Diskrepanz deutet auf einen Offsetverlust hin, bei dem der Connector einen Bereich von Änderungen übersprungen hat.

### 5. Warum muss Schemaänderungsbehandlung explizit getestet werden, nicht nur konfiguriert?

**Antwort:** Unerkannte oder fehlerhaft behandelte Schemaänderungen am Quellsystem können den Connector zum Stillstand bringen oder falsche Daten propagieren; nur ein tatsächlicher Test mit einer realen Schemaänderung zeigt, ob die konfigurierte Behandlung tatsächlich funktioniert.

### 6. Widersprüchliche Anforderung: Team will minimale Quellsystemlast durch den CDC-Connector UND minimale Latenz zwischen Datenbankänderung und Verfügbarkeit im Ereignisstrom — wie gehst du vor?

**Antwort:** Ich würde erklären, dass minimale Latenz häufigeres, aggressiveres Log-Lesen erfordert, was tendenziell mehr Last erzeugt; ich würde vorschlagen, die Connector-Konfiguration (Polling-Intervalle, Batch-Größen) gegen gemessene Quellsystem-Kapazitätsreserven zu kalibrieren, um einen für den konkreten Anwendungsfall akzeptablen Kompromiss zu finden, statt beide Ziele ohne Kompromiss zu versprechen.

## Praktische Labs

~~~python
# Log offset persistence and recovery model
transaction_log = [f"change_{i}" for i in range(20)]
persisted_offset = {"value": None}

def process_changes(log, start_offset, persist_every=3):
    offset = start_offset
    for i in range(start_offset, len(log)):
        # process change
        offset = i + 1
        if (i - start_offset + 1) % persist_every == 0:
            persisted_offset["value"] = offset  # periodic persistence
    return offset

# Normal run: processes everything, but only persists every 3 changes
final_offset = process_changes(transaction_log, start_offset=0, persist_every=3)
print(f"Processed up to offset {final_offset}, but only persisted up to {persisted_offset['value']}")

# Simulate a crash and restart: connector resumes from LAST PERSISTED offset, not final processed offset
resume_offset = persisted_offset["value"]
skipped_or_reprocessed = final_offset - resume_offset
print(f"After restart, resuming from persisted offset {resume_offset} (not {final_offset})")
assert skipped_or_reprocessed > 0
print(f"{skipped_or_reprocessed} changes will be REPROCESSED (duplicates) because persistence lagged behind actual processing.")
~~~

## Dependencies, Cross-References und Quellen

1. Debezium: [How Debezium Works — Snapshots](https://debezium.io/documentation/reference/stable/connectors/postgresql.html#postgresql-snapshots), abgerufen 2026-09-17.
2. Debezium: [Offset Management and Recovery](https://debezium.io/documentation/reference/stable/operations/debezium-server.html), abgerufen 2026-09-17.
3. Kleppmann: [Turning the Database Inside Out with CDC](https://www.confluent.io/blog/turning-the-database-inside-out-with-apache-samza/), abgerufen 2026-09-17.

CDC-Grundlagen sind kanonisch in [KB-0190](../08-messaging-workflows/14-cdc-als-ereignisbruecke.md) behandelt. Datenbankspezifische Debezium-Connector-Konfiguration vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Inkrementelle Snapshots (Snapshot-Fortschritt ohne vollständige Blockierung des kontinuierlichen Streamings) | Established | Gegenüber klassischen blockierenden Snapshots für laufende Produktionssysteme bevorzugen. |
| Schema-Registry-Integration mit automatischer Kompatibilitätsprüfung für CDC-Ereignisse | Adopting | Für Konsumenten mit strikten Schema-Stabilitätsanforderungen standardmäßig aktivieren. |

Ein Team akzeptiert einen CDC-Connector-Betrieb erst, wenn Offset-Persistenz überwacht, Snapshot-Übergang lückenlos verifiziert und Quellsystemlast gemessen dokumentiert sind.
