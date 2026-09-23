---
{"id": "KB-0179", "title": "Kafka und partitionierte Ereignislogs", "domain": "08", "sequence": 3, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL"], "requires": [{"id": "KB-0177", "concepts": ["Log-Semantik"], "needed_for": "both"}, {"id": "KB-0103", "concepts": ["Replikation", "ISR"], "needed_for": "both"}, {"id": "KB-0106", "concepts": ["Partitionierung"], "needed_for": "both"}], "related": ["KB-0178", "KB-0180", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Partitions-/ISR-Modell mit simuliertem Broker-Ausfall lokal implementieren und den Verlust der Führerschaft (Leader) zeigen.", "rationale": "Kein echter Kafka-Cluster nötig, um das Kernmechanismus zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Partitionsanzahl, Replikationsfaktor und Retention für einen Kafka-Einsatz begründet dimensionieren.", "rationale": "Diese Grundparameter bestimmen direkt Durchsatz, Ausfalltoleranz und Speicherbedarf."}, "STAFF-TARGET": {"active": true, "scope": "Eine Consumer-Lag-Situation auf eine zu geringe Partitionsanzahl im Verhältnis zur Consumer-Gruppengröße zurückführen.", "rationale": "Das ist eine häufige, diagnostizierbare Kafka-Skalierungsursache."}, "CHIEF-TARGET": {"active": true, "scope": "Kafka als kanonischen Betriebsstandard für partitionierte Ereignislogs im Portfolio positionieren, mit Betriebskostenbewusstsein.", "rationale": "Kafka-Betrieb erfordert signifikante operative Expertise, die budgetiert werden muss."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Tiered Storage, KRaft-Controller-Architektur im Detail und Exactly-once-Transaktions-API sind Vertiefung.", "rationale": "Kern ist Partition/Replikation/ISR/Controller-Mechanismus und grundlegende Betriebsentscheidungen."}}, "lab_validation": [{"lab_id": "KB-0179-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Partitions-Leader und In-Sync-Replicas (ISR)", "evidence": "Bei simuliertem Ausfall des Leader-Brokers wird ein neuer Leader nur aus der ISR-Menge gewählt, ein Replica außerhalb der ISR (zu weit zurück) wird korrekt nicht gewählt.", "limitations": "Kein echter Kafka-Cluster, keine Produktion."}]}
---
# Kafka und partitionierte Ereignislogs

> **Ziel:** Kafka implementiert die Log-Semantik ([KB-0177](01-queues-und-logs-im-vergleich.md)) partitioniert und repliziert über mehrere Broker. Partition, In-Sync-Replica-Menge (ISR) und Controller sind die Kernmechanismen, die Durchsatz-Skalierung (über Partitionen) mit Ausfalltoleranz (über Replikation) verbinden — ihr Zusammenspiel korrekt zu verstehen ist Voraussetzung für begründete Dimensionierungsentscheidungen.

## Zweck, Mental Model und Dependencies

Ein Kafka-Topic wird in mehrere Partitionen aufgeteilt — jede Partition ist ein eigenständiges, geordnetes Log, das auf einem Broker liegt (Partitions-Leader) und auf weiteren Brokern repliziert wird (Follower). Die ISR (In-Sync Replica Set) ist die Menge der Replicas, die aktuell ausreichend mit dem Leader synchron sind, um bei dessen Ausfall sicher zur neuen Führung gewählt werden zu können — ein zu weit zurückliegendes Replica wird nicht gewählt, um Datenverlust zu vermeiden. Der Controller (traditionell über ZooKeeper, moderner über KRaft) koordiniert Leader-Wahlen und Cluster-Metadaten. Dies baut auf generischer Replikation ([KB-0103](../05-distributed-systems/03-replikationsmodelle-und-konflikte.md)) und Partitionierung ([KB-0106](../05-distributed-systems/06-partitionierung-und-datenverteilung.md)) auf. Lies [KB-0177](01-queues-und-logs-im-vergleich.md), [KB-0103](../05-distributed-systems/03-replikationsmodelle-und-konflikte.md) und [KB-0106](../05-distributed-systems/06-partitionierung-und-datenverteilung.md).

~~~text
Topic "orders" -> Partition0 (Leader: Broker1, Replicas: Broker2, Broker3, ISR: {1,2,3})
Broker1 fails -> new Leader elected ONLY from ISR (Broker2 or Broker3, both caught up)
-- a replica NOT in the ISR (too far behind) is never chosen, preventing silent data loss
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko bei Fehlkonfiguration |
|---|---|---|
| Partitionsanzahl | ausreichend für gewünschte Consumer-Parallelität? | zu wenige Partitionen begrenzen Consumer-Gruppen-Parallelität hart |
| Replikationsfaktor | ausreichend für gewünschte Ausfalltoleranz? | zu niedriger Faktor riskiert Datenverlust bei mehreren gleichzeitigen Ausfällen |
| ISR-Größe | min.insync.replicas korrekt für Konsistenzanforderung gesetzt? | zu niedrig gesetzt erlaubt Schreiben ohne ausreichende Replikation |
| Retention | Zeit-/Größenbasiert an Replay-Bedarf angepasst? | zu kurze Retention macht Replay-Fähigkeit nutzlos |

Implementierung: die Partitionsanzahl wird an die maximale gewünschte Consumer-Gruppen-Parallelität gebunden — mehr Consumer in einer Gruppe als Partitionen bleiben ungenutzt, da jede Partition nur einem Consumer der Gruppe gleichzeitig zugeordnet werden kann. Der Replikationsfaktor (typisch 3) und `min.insync.replicas` (typisch 2) werden gemeinsam so konfiguriert, dass bei einem Broker-Ausfall weiterhin sicher geschrieben werden kann, ohne die Konsistenzgarantie zu verlieren. Retention wird explizit nach Replay-Bedarf dimensioniert, nicht nach Standardwerten.

## Scalability, Reliability, Security und Observability

Kafka skaliert Durchsatz horizontal über Partitionen und Broker, mit einer harten Obergrenze der Consumer-Parallelität durch die Partitionsanzahl. Reliability-Grenze: ein Broker-Ausfall führt zu einer kurzen Nichtverfügbarkeit der betroffenen Partitionen während der Leader-Wahl — die Dauer dieser Übergangsphase und das Verhalten bei gleichzeitigem Ausfall mehrerer Broker müssen explizit getestet werden, nicht nur angenommen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Consumer-Gruppe verarbeitet Last nicht parallel trotz mehr Consumer-Instanzen | Partitionsanzahl kleiner als Consumer-Anzahl | Partitionsanzahl gegen Consumer-Gruppengröße vergleichen |
| Datenverlust nach Broker-Ausfall trotz Replikationsfaktor 3 | min.insync.replicas zu niedrig, Schreiben akzeptiert ohne ausreichende Replikation | ISR-Größe zum Ausfallzeitpunkt gegen konfiguriertes Minimum prüfen |
| Consumer-Lag wächst stetig | Verarbeitungsgeschwindigkeit unter Produktionsrate, oder zu wenige Partitionen für nötige Parallelität | Lag-Metrik pro Partition und Consumer-Durchsatz einzeln messen |
| ältere Ereignisse nicht mehr für Replay verfügbar | Retention-Zeit kürzer als tatsächlicher Replay-Bedarf | Retention-Konfiguration gegen dokumentierten Replay-Anwendungsfall prüfen |

Security: Kafka-Zugriffskontrolle (ACLs) sollte pro Topic granular konfiguriert werden, da ein zu weit gefasster Zugriff mehreren Teams unautorisierten Zugriff auf sensible Themen ermöglichen kann. Observability: Consumer-Lag pro Partition, ISR-Größe pro Partition und Under-Replicated-Partitions sind die zentralen operativen Metriken für Kafka-Gesundheit.

## Trade-offs und Entscheidungen

**Staff** testet Broker-Ausfallverhalten und ISR-Übergänge unter simulierter Last vor Produktivsetzung. **Principal** dimensioniert Partitionen, Replikationsfaktor und Retention anhand gemessener Anforderungen statt Standardwerten. **Chief** budgetiert Kafka-Betrieb mit ausreichender operativer Expertise, da fehlerhafte Konfiguration bei Skalierung oder Ausfällen erhebliche Konsequenzen hat.

Anti-Patterns: Partitionsanzahl ohne Bezug zur benötigten Consumer-Parallelität wählen; `min.insync.replicas` zu niedrig setzen und dadurch Replikationsgarantien untergraben; Retention nach Standardwerten statt tatsächlichem Replay-Bedarf konfigurieren.

## Production Checklist

- [ ] Partitionsanzahl an maximale gewünschte Consumer-Gruppen-Parallelität gebunden.
- [ ] Replikationsfaktor und min.insync.replicas gemeinsam für gewünschte Ausfalltoleranz konfiguriert.
- [ ] Retention explizit nach Replay-Bedarf dimensioniert.
- [ ] Broker-Ausfall und Leader-Wahl unter simulierter Last getestet.

## Interviewfragen

### 1. Was ist die In-Sync Replica Set (ISR)?

**Antwort:** Die Menge der Replicas, die aktuell ausreichend mit dem Partitions-Leader synchron sind, um bei dessen Ausfall sicher als neuer Leader gewählt zu werden, ohne Datenverlust zu riskieren.

### 2. Warum begrenzt die Partitionsanzahl die Consumer-Parallelität?

**Antwort:** Jede Partition kann innerhalb einer Consumer-Gruppe nur einem Consumer gleichzeitig zugeordnet werden; mehr Consumer als Partitionen bleiben ungenutzt.

### 3. Was passiert, wenn min.insync.replicas zu niedrig gesetzt ist?

**Antwort:** Ein Schreibvorgang kann als erfolgreich bestätigt werden, obwohl er auf zu wenigen Replicas repliziert wurde, was bei einem Ausfall des Leaders zu Datenverlust führen kann.

### 4. Warum ist Retention-Konfiguration eine bewusste Entscheidung, nicht nur ein technischer Parameter?

**Antwort:** Sie bestimmt, wie lange Replay-Fähigkeit tatsächlich besteht, und beeinflusst Speicherbedarf und Datenschutzrisiko — eine falsch dimensionierte Retention macht entweder Replay nutzlos oder erzeugt unnötige Kosten/Risiken.

### 5. Wie diagnostizierst du wachsenden Consumer-Lag?

**Antwort:** Durch Messung der Lag-Metrik pro Partition kombiniert mit dem tatsächlichen Consumer-Durchsatz, um zu unterscheiden, ob die Ursache zu wenige Partitionen oder zu langsame Verarbeitung ist.

### 6. Widersprüchliche Anforderung: Team will maximale Schreibgeschwindigkeit UND garantiert keinen Datenverlust bei jedem einzelnen Broker-Ausfall — wie gehst du vor?

**Antwort:** Ich würde erklären, dass maximale Schreibgeschwindigkeit (acks=1, keine Bestätigung von Replicas) und garantierte Ausfallsicherheit (acks=all mit ausreichendem min.insync.replicas) sich direkt widersprechen; ich würde die tatsächliche Kritikalität der Daten bewerten und für kritische Daten die sicherere, etwas langsamere Konfiguration wählen.

## Praktische Labs

~~~python
isr = {"broker1", "broker2", "broker3"}
replica_lag = {"broker1": 0, "broker2": 0, "broker3": 500}  # broker3 far behind

def update_isr(isr, lag, threshold=100):
    return {b for b in isr if lag[b] <= threshold}

isr = update_isr(isr, replica_lag)
assert "broker3" not in isr  # correctly excluded from ISR due to excessive lag

def elect_leader(isr, failed_leader):
    candidates = isr - {failed_leader}
    return next(iter(candidates)) if candidates else None

new_leader = elect_leader(isr, "broker1")
assert new_leader == "broker2"
print(f"New leader elected from ISR only: {new_leader}. broker3 (lagging) was correctly never a candidate.")
~~~

## Dependencies, Cross-References und Quellen

1. Apache Kafka: [Kafka Documentation - Replication](https://kafka.apache.org/documentation/#replication), abgerufen 2026-09-17.
2. Confluent: [KRaft Overview](https://docs.confluent.io/platform/current/kafka-metadata/kraft.html), abgerufen 2026-09-17.

Kafka-Versionsdetails (insbesondere KRaft- versus ZooKeeper-basierte Controller) vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KRaft-Controller-Architektur als Ersatz für ZooKeeper | Established (seit Kafka 3.x als Standard vorgesehen) | Migrationspfad und Betriebserfahrung mit KRaft vor produktivem Umstieg prüfen. |
| Tiered Storage für kosteneffiziente Langzeit-Retention | Adopting je Anbieter | Latenzkosten des Zugriffs auf ausgelagerte, ältere Segmente vor Einsatz messen. |

Ein Team akzeptiert eine Kafka-Konfiguration erst, wenn Partitions-/Replikationsdimensionierung begründet und Broker-Ausfallverhalten unter Last getestet sind.
