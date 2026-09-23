---
{"id": "KB-0184", "title": "Azure Event Hubs", "domain": "08", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE"], "requires": [{"id": "KB-0179", "concepts": ["Partition", "Kafka-Konzept"], "needed_for": "both"}, {"id": "KB-0183", "concepts": ["Azure Service Bus"], "needed_for": "understanding"}], "related": ["KB-0185", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Partitions- und Checkpoint-Verhalten mit mehreren Consumer Groups lokal simulieren.", "rationale": "Kein echtes Azure-Konto nötig, um die Kernmechanik zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Event Hubs für hochvolumige Ingestion gegenüber Service Bus für transaktionale Geschäftsnachrichten begründet abgrenzen.", "rationale": "Beide Dienste haben oberflächlich ähnliche Konzepte, aber fundamental unterschiedliche primäre Anwendungsfälle."}, "STAFF-TARGET": {"active": true, "scope": "Datenverlust nach Consumer-Neustart auf fehlendes Checkpointing zurückführen.", "rationale": "Ohne Checkpoint beginnt ein neu gestarteter Consumer möglicherweise am falschen Punkt."}, "CHIEF-TARGET": {"active": true, "scope": "Event Hubs als Ingestion-Schicht für Data-Platform-Verarbeitung positionieren, getrennt von transaktionalen Geschäftsqueues.", "rationale": "Die Vermischung beider Anwendungsfälle in einem Dienst führt zu suboptimalen Architekturentscheidungen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Kafka-Protokoll-Kompatibilität von Event Hubs im Detail ist Vertiefung.", "rationale": "Kern ist Partition/Consumer-Group/Checkpoint-Mechanik und Abgrenzung zu Service Bus."}}, "lab_validation": [{"lab_id": "KB-0184-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Partitions-Checkpoint mit Consumer-Neustart", "evidence": "Ein Consumer ohne Checkpoint beginnt nach Neustart am Anfang der Partition und verarbeitet bereits bekannte Ereignisse erneut; ein Consumer mit Checkpoint setzt korrekt am zuletzt gespeicherten Offset fort.", "limitations": "Kein echtes Azure-Konto, keine Produktion."}]}
---
# Azure Event Hubs

> **Ziel:** Event Hubs ist eine hochvolumige Ingestion-Plattform, konzeptionell näher an Kafka ([KB-0179](03-kafka-und-partitionierte-ereignislogs.md)) als an Azure Service Bus ([KB-0183](07-azure-service-bus.md)): Partitionen, Consumer Groups und explizites Checkpointing statt Message Locks und Sessions. Die klare Abgrenzung zu Service Bus ist entscheidend — beide klingen ähnlich, lösen aber unterschiedliche primäre Probleme.

## Zweck, Mental Model und Dependencies

Event Hubs partitioniert einen Event-Stream wie Kafka; mehrere Consumer Groups können denselben Stream unabhängig konsumieren, jede mit eigenem Fortschritt. Ein Consumer speichert explizit einen Checkpoint (den zuletzt erfolgreich verarbeiteten Offset), typischerweise in einem externen Speicher (z. B. Azure Blob Storage) — ohne Checkpoint weiß ein neu gestarteter Consumer nicht, wo er fortsetzen soll, und beginnt entweder am Anfang (Datenredundanz) oder am aktuellen Ende (Datenverlust der Lücke). Event Hubs eignet sich für hochvolumige Telemetrie-/Ereignis-Ingestion für Data-Platform-Verarbeitung, während Service Bus für transaktionale Geschäftsnachrichten mit Zuverlässigkeitsgarantien (Sessions, Dead Lettering) gedacht ist. Lies [KB-0179](03-kafka-und-partitionierte-ereignislogs.md) und [KB-0183](07-azure-service-bus.md).

~~~text
Event Hub "telemetry" -> Partition0, Partition1, ... (Kafka-like)
Consumer Group A reads independently from Consumer Group B, each tracks its own checkpoint
Consumer restarts WITHOUT checkpoint -> starts from beginning or latest, losing exact continuation point
Consumer restarts WITH checkpoint -> resumes exactly where it left off
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Partitionsanzahl | ausreichend für gewünschte Consumer-Parallelität? | zu wenige Partitionen begrenzen Verarbeitungsdurchsatz hart |
| Consumer Group | jeder unabhängige Konsument hat eigene Gruppe? | geteilte Consumer Group zwischen unabhängigen Systemen erzeugt Konkurrenz statt unabhängiger Konsumierung |
| Checkpointing | regelmäßig und nach erfolgreicher Verarbeitung gespeichert? | fehlendes/verzögertes Checkpointing riskiert Datenverlust oder -duplizierung bei Neustart |
| Anwendungsfall-Abgrenzung | Ingestion (Event Hubs) vs. transaktionale Geschäftsnachricht (Service Bus)? | falscher Dienst für den jeweiligen Anwendungsfall gewählt |

Implementierung: jeder unabhängige Konsument (z. B. ein Analytics-System versus ein Alerting-System, die beide dieselben Rohereignisse brauchen) nutzt eine eigene Consumer Group, um unabhängig vom Fortschritt anderer zu konsumieren. Checkpoints werden regelmäßig und erst nach erfolgreicher Verarbeitung eines Batches gespeichert, nicht vorab. Die Entscheidung zwischen Event Hubs und Service Bus wird explizit anhand des Anwendungsfalls getroffen — hochvolumige, oft unstrukturierte Telemetrie/Ereignisse sprechen für Event Hubs, transaktionale Geschäftsnachrichten mit Zuverlässigkeitsbedarf für Service Bus.

## Scalability, Reliability, Security und Observability

Event Hubs skaliert sehr hohen Ingestion-Durchsatz über Partitionen, ähnlich Kafka. Reliability-Grenze: fehlendes oder zu seltenes Checkpointing führt entweder zu erneuter Verarbeitung bereits bekannter Ereignisse (bei Neustart vom letzten gespeicherten, aber veralteten Checkpoint) oder zu Datenverlust (bei Start vom aktuellen Ende ohne Checkpoint) — die richtige Checkpoint-Frequenz balanciert Wiederholungsaufwand gegen Checkpoint-Overhead.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Consumer verarbeitet nach Neustart bereits bekannte Ereignisse erneut | Checkpoint zu selten gespeichert oder fehlend | Checkpoint-Frequenz gegen tatsächliches Wiederholungsfenster nach Neustart prüfen |
| ein Ereignis geht nach Consumer-Neustart verloren | Consumer startet ohne Checkpoint am aktuellen Ende statt am letzten bekannten Punkt | Startverhalten des Consumers bei fehlendem Checkpoint prüfen |
| zwei unabhängige Systeme konkurrieren um dieselben Ereignisse | geteilte Consumer Group zwischen eigentlich unabhängigen Konsumenten | Consumer-Group-Zuordnung der beteiligten Systeme prüfen |
| Event Hubs wird für einen Anwendungsfall mit Transaktions-/Session-Bedarf genutzt | falsche Dienstwahl, Service Bus wäre passender gewesen | Anwendungsfall-Anforderungen gegen die jeweilige Dienst-Stärke abgleichen |

Security: Event-Hubs-Zugriff über Shared Access Policies sollte granular pro Namespace/Hub konfiguriert werden. Observability: Consumer-Lag pro Partition und Checkpoint-Aktualität sind zentrale Metriken, analog zu Kafka-Consumer-Lag.

## Trade-offs und Entscheidungen

**Staff** implementiert regelmäßiges Checkpointing nach erfolgreicher Batch-Verarbeitung, nicht vorab. **Principal** definiert klare Zuordnung, welche unabhängigen Systeme eigene Consumer Groups erhalten. **Chief** trennt Event Hubs (hochvolumige Ingestion) klar von Service Bus (transaktionale Geschäftsnachrichten) als Architekturstandard.

Anti-Patterns: Event Hubs für transaktionale Geschäftsnachrichten mit Reihenfolge-/Zuverlässigkeitsbedarf nutzen, wo Service Bus passender wäre; Checkpointing vor statt nach erfolgreicher Verarbeitung; unabhängige Konsumenten dieselbe Consumer Group teilen lassen.

## Production Checklist

- [ ] Checkpointing erfolgt regelmäßig nach erfolgreicher Batch-Verarbeitung.
- [ ] Jeder unabhängige Konsument nutzt eine eigene Consumer Group.
- [ ] Anwendungsfall-Abgrenzung zu Service Bus explizit dokumentiert und begründet.
- [ ] Partitionsanzahl an gewünschte Verarbeitungsparallelität gebunden.

## Interviewfragen

### 1. Was ist der Hauptunterschied zwischen Event Hubs und Service Bus?

**Antwort:** Event Hubs ist für hochvolumige Ingestion mit Kafka-ähnlicher Partitions-/Checkpoint-Semantik gedacht; Service Bus für transaktionale Geschäftsnachrichten mit Sessions, Locks und Dead Lettering.

### 2. Was passiert, wenn ein Consumer ohne Checkpoint neu startet?

**Antwort:** Er weiß nicht, wo er zuletzt aufgehört hat, und muss entweder am Anfang (Wiederholung bereits verarbeiteter Ereignisse) oder am aktuellen Ende (Verlust der Lücke) starten.

### 3. Wozu dienen Consumer Groups in Event Hubs?

**Antwort:** Sie erlauben mehreren unabhängigen Systemen, denselben Event-Stream unabhängig voneinander mit eigenem Fortschritt zu konsumieren, ohne sich gegenseitig zu beeinflussen.

### 4. Wann sollte Checkpointing erfolgen?

**Antwort:** Erst nach erfolgreicher Verarbeitung eines Ereignisses oder Batches, nie vorab — sonst riskiert ein Fehler nach dem Checkpoint, dass das Ereignis bei einem Neustart fälschlich als bereits verarbeitet übersprungen wird.

### 5. Warum sollten unabhängige Konsumenten nicht dieselbe Consumer Group teilen?

**Antwort:** Innerhalb einer Consumer Group konkurrieren Consumer um Partitionen (Lastverteilung); zwei eigentlich unabhängige Systeme, die dieselbe Gruppe teilen, würden sich versehentlich die Ereignisse teilen statt beide vollständig zu erhalten.

### 6. Widersprüchliche Anforderung: Team will hochvolumige Telemetrie-Ingestion UND garantierte transaktionale Zustellung mit Sessions für einzelne Geschäftsvorgänge — wie gehst du vor?

**Antwort:** Ich würde beide Anforderungen mit dem jeweils passenden Dienst bedienen: Event Hubs für die hochvolumige Telemetrie-Ingestion und Service Bus für die transaktionalen Geschäftsnachrichten mit Session-Bedarf, statt zu versuchen, beides mit einem einzigen Dienst abzudecken.

## Praktische Labs

~~~python
partition = ["event1", "event2", "event3", "event4"]
checkpoint_store = {}

def consume_with_checkpoint(consumer_group, partition):
    start = checkpoint_store.get(consumer_group, 0)
    for i in range(start, len(partition)):
        process(partition[i])
        checkpoint_store[consumer_group] = i + 1  # checkpoint after successful processing

processed = []
def process(event):
    processed.append(event)

consume_with_checkpoint("group-A", partition)
assert checkpoint_store["group-A"] == 4
processed.clear()

# simulate restart, resuming from checkpoint instead of reprocessing everything
consume_with_checkpoint("group-A", partition)
assert processed == []  # nothing reprocessed, checkpoint correctly resumed at the end
print("Consumer correctly resumed from checkpoint, avoiding reprocessing already-consumed events.")
~~~

## Dependencies, Cross-References und Quellen

1. Microsoft: [Azure Event Hubs - Features and Terminology](https://learn.microsoft.com/en-us/azure/event-hubs/event-hubs-features), abgerufen 2026-09-17.
2. Microsoft: [Event Hubs vs Service Bus vs Event Grid](https://learn.microsoft.com/en-us/azure/event-grid/compare-messaging-services), abgerufen 2026-09-17.

Azure-Event-Hubs-Preisstufen und Kafka-Protokoll-Kompatibilitätsdetails vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Kafka-Protokoll-Kompatibilität von Event Hubs für nahtlose Kafka-Client-Migration | Established | Feature-Parität mit nativem Kafka für den konkreten Anwendungsfall verifizieren. |

Ein Team akzeptiert eine Event-Hubs-Implementierung erst, wenn Checkpointing und Consumer-Group-Zuordnung nachweisbar korrekt konfiguriert sind.
