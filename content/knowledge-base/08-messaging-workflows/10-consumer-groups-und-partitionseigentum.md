---
{"id": "KB-0186", "title": "Consumer Groups und Partitionseigentum", "domain": "08", "sequence": 10, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF"], "requires": [{"id": "KB-0179", "concepts": ["Kafka", "Partition"], "needed_for": "both"}, {"id": "KB-0105", "concepts": ["Leader Election"], "needed_for": "understanding"}], "related": ["KB-0184", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Rebalancing-Ereignis mit Partitions-Neuzuweisung lokal simulieren und einen Doppelverarbeitungsfall während des Übergangs zeigen.", "rationale": "Kein echter Broker nötig, um das Kernmuster zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Offset-Commit-Strategie und Rebalancing-Verhalten so gestalten, dass ein Partitionsbesitzwechsel keine doppelte Verarbeitung verursacht.", "rationale": "Rebalancing ist ein normaler, wiederkehrender Vorgang, kein Sonderfall."}, "STAFF-TARGET": {"active": true, "scope": "Doppelte Verarbeitung während eines Rebalancings auf einen zu spät committeten Offset zurückführen.", "rationale": "Das ist eine häufige, subtile Fehlerquelle bei Consumer-Group-basierter Verarbeitung."}, "CHIEF-TARGET": {"active": true, "scope": "Konsistente Offset-Commit- und Rebalancing-Strategien als Standard für alle Consumer-Group-basierten Systeme festlegen.", "rationale": "Uneinheitliche Strategien erzeugen unterschiedliche Duplikations-/Verlustrisiken über Systeme hinweg."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Cooperative/Incremental Rebalancing-Protokolle im Detail sind Vertiefung.", "rationale": "Kern ist das Grundprinzip von Partitionseigentum, Rebalancing und Offset-Commit-Timing."}}, "lab_validation": [{"lab_id": "KB-0186-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Partitions-Rebalancing mit Offset-Commit-Timing", "evidence": "Wird der Offset erst nach vollständiger Batch-Verarbeitung statt vorab committet, verarbeitet ein neuer Partitionsbesitzer nach Rebalancing korrekt ab dem letzten committeten Punkt weiter, ohne bereits verarbeitete Nachrichten zu wiederholen, wenn der Commit rechtzeitig erfolgte.", "limitations": "Kein echter Broker, keine Produktion."}]}
---
# Consumer Groups und Partitionseigentum

> **Ziel:** Eine Consumer Group teilt die Partitionen eines Topics unter ihren Mitgliedern auf — jede Partition wird zu jedem Zeitpunkt von genau einem Consumer der Gruppe „besessen". Ändert sich die Gruppengröße (neuer Consumer, Ausfall), löst das ein Rebalancing aus, bei dem Partitionen neu zugewiesen werden. Dieser Übergang ist eine normale, wiederkehrende Operation, deren korrekte Offset-Commit-Behandlung entscheidet, ob dabei Nachrichten doppelt verarbeitet oder verloren werden.

## Zweck, Mental Model und Dependencies

Innerhalb einer Consumer Group verarbeitet jeweils nur ein Consumer eine bestimmte Partition — das ermöglicht parallele Verarbeitung über mehrere Consumer bei gleichzeitig garantierter Reihenfolge innerhalb jeder Partition. Ein Rebalancing (ausgelöst durch Beitritt/Austritt eines Consumers) verteilt Partitionen neu — während dieses Übergangs muss der zuletzt verarbeitete Offset korrekt committet sein, damit der neue Besitzer der Partition korrekt fortsetzt, statt bereits verarbeitete Nachrichten zu wiederholen oder unverarbeitete zu überspringen. Dies baut auf demselben Grundprinzip wie Leader Election ([KB-0105](../05-distributed-systems/05-leader-election-und-fencing.md)) auf: ein eindeutiger, zeitlich begrenzter Besitz einer Ressource, der bei einem Übergang sauber gehandhabt werden muss. Lies [KB-0179](03-kafka-und-partitionierte-ereignislogs.md) und [KB-0105](../05-distributed-systems/05-leader-election-und-fencing.md).

~~~text
Group "orders-processor": Partition0 -> ConsumerA, Partition1 -> ConsumerB
ConsumerB crashes -> rebalance triggered -> Partition1 reassigned to ConsumerA
                     ConsumerA resumes Partition1 from the LAST COMMITTED offset, not from the beginning
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Offset-Commit-Zeitpunkt | erst nach vollständiger Verarbeitung committet? | vorzeitiger Commit riskiert Nachrichtenverlust bei Absturz vor Verarbeitung |
| Rebalancing-Trigger | Beitritt/Austritt eines Consumers korrekt erkannt? | verzögerte Erkennung eines ausgefallenen Consumers verzögert Wiederaufnahme |
| Partitionsanzahl vs. Consumer-Anzahl | mehr Consumer als Partitionen? | überzählige Consumer bleiben ungenutzt, keine zusätzliche Parallelität |
| Rebalancing-Fenster | Verarbeitung pausiert während des gesamten Rebalancings? | „Stop-the-world"-Rebalancing (klassisches Protokoll) unterbricht alle Consumer, nicht nur betroffene |

Implementierung: der Offset wird erst nach vollständig erfolgreicher Verarbeitung einer Nachricht oder eines Batches committet, nie vorab — ein vorzeitiger Commit würde bei einem Absturz zwischen Commit und tatsächlicher Verarbeitung zu Datenverlust führen. Rebalancing-Timeouts werden realistisch dimensioniert, um ausgefallene Consumer zügig, aber nicht überempfindlich zu erkennen. Für Systeme mit häufigen Gruppengrößenänderungen wird ein kooperatives/inkrementelles Rebalancing-Protokoll bevorzugt, das nur die tatsächlich betroffenen Partitionen unterbricht, statt alle Consumer der Gruppe für die Dauer des gesamten Rebalancings zu pausieren.

## Scalability, Reliability, Security und Observability

Consumer Groups skalieren Verarbeitungsparallelität bis zur Grenze der Partitionsanzahl — mehr Consumer als Partitionen bringen keinen zusätzlichen Durchsatzgewinn. Reliability-Grenze: ein zu spät oder gar nicht committeter Offset vor einem Rebalancing führt dazu, dass der neue Partitionsbesitzer bereits verarbeitete Nachrichten erneut verarbeitet — das ist kein Fehler des Rebalancing-Mechanismus selbst, sondern eine Folge falscher Commit-Timing-Implementierung.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| doppelte Verarbeitung nach einem Consumer-Neustart/-Ausfall | Offset wurde vor der letzten Rebalancing-Runde nicht rechtzeitig committet | Commit-Zeitpunkt im Code gegen tatsächliche Verarbeitungsabschluss-Zeit prüfen |
| Nachrichtenverlust nach einem Rebalancing | Offset wurde vor vollständiger Verarbeitung committet | Commit-Logik auf „nach" statt „vor" Verarbeitung prüfen |
| lange Verarbeitungspause bei jedem Consumer-Beitritt/-Austritt | „Stop-the-world"-Rebalancing-Protokoll statt kooperativem Rebalancing | Rebalancing-Protokollkonfiguration prüfen |
| überzählige Consumer bleiben untätig | mehr Consumer-Instanzen als verfügbare Partitionen | Partitionsanzahl gegen Consumer-Gruppengröße vergleichen |

Security: Consumer-Group-Mitgliedschaft und Partitionszuweisung sollten nicht von externen, nicht vertrauenswürdigen Parteien manipulierbar sein, da eine unautorisierte Partitionsübernahme Zugriff auf sensible Nachrichtenströme ermöglichen könnte. Observability: Consumer-Lag pro Partition und Rebalancing-Häufigkeit/-Dauer sind zentrale Metriken zur Diagnose von Verarbeitungsproblemen und Instabilität.

## Trade-offs und Entscheidungen

**Staff** implementiert Offset-Commits konsequent nach, nie vor, vollständiger Verarbeitung. **Principal** wählt kooperatives Rebalancing für Systeme mit häufigen Gruppengrößenänderungen, um Unterbrechungsfenster zu minimieren. **Chief** verlangt konsistente Commit-Strategien über alle Consumer-Group-basierten Systeme als Standard, um unterschiedliche Duplikations-/Verlustrisiken zu vermeiden.

Anti-Patterns: Offset vor vollständiger Verarbeitung committen; mehr Consumer-Instanzen als Partitionen betreiben in der Annahme zusätzlicher Parallelität; „Stop-the-world"-Rebalancing für Systeme mit häufigen Mitgliedschaftsänderungen ohne Bewusstsein für die dadurch verursachten Unterbrechungen.

## Production Checklist

- [ ] Offset-Commit erfolgt ausschließlich nach vollständig erfolgreicher Verarbeitung.
- [ ] Partitionsanzahl an maximale gewünschte Consumer-Parallelität angepasst.
- [ ] Kooperatives/inkrementelles Rebalancing für Systeme mit häufigen Gruppengrößenänderungen konfiguriert.
- [ ] Rebalancing-Häufigkeit und -Dauer werden überwacht.

## Interviewfragen

### 1. Was passiert bei einem Rebalancing?

**Antwort:** Partitionen werden unter den aktuellen Mitgliedern einer Consumer Group neu verteilt, ausgelöst durch Beitritt oder Austritt (Ausfall) eines Consumers — jede Partition bleibt dabei im Besitz genau eines Consumers zur gleichen Zeit.

### 2. Warum sollte der Offset erst nach vollständiger Verarbeitung committet werden?

**Antwort:** Ein vorzeitiger Commit würde bei einem Absturz zwischen Commit und tatsächlicher Verarbeitung dazu führen, dass die Nachricht als verarbeitet gilt, obwohl sie es nicht ist — ein stiller Datenverlust.

### 3. Warum begrenzt die Partitionsanzahl die Consumer-Parallelität?

**Antwort:** Jede Partition kann innerhalb einer Consumer Group nur einem Consumer gleichzeitig zugeordnet werden; überzählige Consumer-Instanzen bleiben ungenutzt.

### 4. Was ist der Vorteil von kooperativem gegenüber „Stop-the-world"-Rebalancing?

**Antwort:** Kooperatives Rebalancing unterbricht nur die tatsächlich neu zuzuweisenden Partitionen, während „Stop-the-world"-Rebalancing alle Consumer der Gruppe für die Dauer des gesamten Vorgangs pausiert.

### 5. Wie diagnostizierst du doppelte Verarbeitung nach einem Rebalancing?

**Antwort:** Durch Prüfung, ob der Offset-Commit-Zeitpunkt tatsächlich nach vollständiger Verarbeitung erfolgte, bevor das Rebalancing eintrat — ein verspäteter Commit führt dazu, dass der neue Besitzer bereits verarbeitete Nachrichten erneut erhält.

### 6. Widersprüchliche Anforderung: Team will maximale Verarbeitungsgeschwindigkeit UND garantiert keine doppelte Verarbeitung bei jedem Rebalancing — wie gehst du vor?

**Antwort:** Ich würde häufige, kleine Offset-Commits nach jeweils kleinen, schnell abgeschlossenen Verarbeitungsschritten implementieren, statt große Batches zu bilden — das minimiert das Zeitfenster zwischen letztem Commit und einem Rebalancing-Ereignis, ohne die Gesamtverarbeitungsgeschwindigkeit wesentlich zu beeinträchtigen.

## Praktische Labs

~~~python
committed_offsets = {"partition0": 0}

def process_and_commit(partition, messages, last_committed):
    for i, msg in enumerate(messages[last_committed:], start=last_committed):
        process(msg)
        committed_offsets[partition] = i + 1  # commit AFTER processing, not before

processed = []
def process(msg):
    processed.append(msg)

messages = ["m1", "m2", "m3"]
process_and_commit("partition0", messages, committed_offsets["partition0"])
assert committed_offsets["partition0"] == 3

# simulate rebalance: new owner resumes from committed offset, not from scratch
processed.clear()
process_and_commit("partition0", messages, committed_offsets["partition0"])
assert processed == []  # nothing reprocessed
print("New partition owner correctly resumed from the last committed offset after rebalance, no duplicate processing.")
~~~

## Dependencies, Cross-References und Quellen

1. Apache Kafka: [Consumer Groups and Partition Assignment](https://kafka.apache.org/documentation/#intro_consumers), abgerufen 2026-09-17.
2. Confluent: [Incremental Cooperative Rebalancing](https://www.confluent.io/blog/incremental-cooperative-rebalancing-in-kafka/), abgerufen 2026-09-17.

Broker-spezifische Rebalancing-Protokolldetails vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Inkrementelles kooperatives Rebalancing als Standardprotokoll statt klassischem Eager Rebalancing | Established | Migrationsaufwand von bestehenden Eager-Rebalancing-Konfigurationen prüfen. |

Ein Team akzeptiert eine Consumer-Group-Implementierung erst, wenn Offset-Commit-Timing und Rebalancing-Verhalten unter simuliertem Consumer-Ausfall nachweisbar getestet sind.
