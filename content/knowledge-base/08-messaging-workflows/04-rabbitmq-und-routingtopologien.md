---
{"id": "KB-0180", "title": "RabbitMQ und Routingtopologien", "domain": "08", "sequence": 4, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE"], "requires": [{"id": "KB-0177", "concepts": ["Queue-Semantik"], "needed_for": "both"}, {"id": "KB-0117", "concepts": ["Backpressure"], "needed_for": "understanding"}], "related": ["KB-0179", "KB-0181", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Exchange-Binding-Queue-Topologie mit unterschiedlichen Routing-Regeln lokal simulieren.", "rationale": "Kein echter RabbitMQ-Server nötig, um das Routing-Konzept zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Exchange-Typ, Bindings und Quorum-Queue-Konfiguration für einen konkreten Routing-Anwendungsfall entwerfen.", "rationale": "RabbitMQ bietet flexibles Routing, das bewusst statt implizit gestaltet werden muss."}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Nachrichtenverteilung auf eine falsch konfigurierte Exchange-Binding-Regel zurückführen.", "rationale": "Fehlkonfigurierte Routing-Topologien sind eine häufige RabbitMQ-Fehlerquelle."}, "CHIEF-TARGET": {"active": true, "scope": "RabbitMQ gegenüber Kafka für Anwendungsfälle mit komplexem Routing statt reiner hoher Durchsatzanforderung positionieren.", "rationale": "Beide Systeme lösen unterschiedliche primäre Probleme trotz oberflächlicher Ähnlichkeit."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Federation und Shovel für Multi-Cluster-Topologien im Detail sind Vertiefung.", "rationale": "Kern ist die Exchange-Binding-Queue-Grundmechanik und Quorum Queues für Ausfalltoleranz."}}, "lab_validation": [{"lab_id": "KB-0180-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Topic-Exchange-Routing mit Wildcard-Bindings", "evidence": "Eine Nachricht mit Routing-Key 'order.created.eu' wird korrekt an eine an 'order.created.*' gebundene Queue geroutet, aber nicht an eine an 'order.shipped.*' gebundene Queue.", "limitations": "Kein echter RabbitMQ-Server, keine Produktion."}]}
---
# RabbitMQ und Routingtopologien

> **Ziel:** RabbitMQ implementiert Queue-Semantik ([KB-0177](01-queues-und-logs-im-vergleich.md)) mit flexiblem, explizit konfigurierbarem Routing über Exchanges und Bindings — eine Nachricht wird an eine Exchange gesendet, die anhand von Bindings (Regeln) entscheidet, an welche Queue(s) sie weitergeleitet wird. Diese Flexibilität ist RabbitMQs Kernstärke gegenüber Kafkas einfacherem, aber durchsatzstärkerem Partitionsmodell.

## Zweck, Mental Model und Dependencies

Ein Producer sendet nie direkt an eine Queue, sondern an eine Exchange. Eine Direct Exchange routet nach exaktem Routing-Key-Match; eine Topic Exchange erlaubt Wildcard-Muster (z. B. `order.created.*` matched `order.created.eu` und `order.created.us`); eine Fanout Exchange sendet an alle gebundenen Queues unabhängig vom Routing-Key. Diese Trennung zwischen Exchange (Routing-Entscheidung) und Queue (Speicherung/Zustellung) erlaubt komplexe, mehrstufige Verteilungslogik, die bei einem einfacheren Partitionsmodell nicht direkt abbildbar wäre. Lies [KB-0177](01-queues-und-logs-im-vergleich.md) und [KB-0117](../05-distributed-systems/17-backpressure-und-ueberlast.md).

~~~text
Producer -> Exchange (routing decision) -> Binding rules -> Queue(s) -> Consumer(s)
Topic Exchange: routing_key="order.created.eu" matches binding "order.created.*" -> routed to that queue
                does NOT match binding "order.shipped.*" -> not routed there
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Exchange-Typ | Direct/Topic/Fanout passend zum Routing-Bedarf gewählt? | falscher Typ erzeugt unerwartete Nachrichtenverteilung |
| Binding-Regeln | präzise und dokumentiert, keine überlappenden Unklarheiten? | mehrdeutige Bindings erzeugen doppelte oder fehlende Zustellung |
| Quorum Queues | für Ausfalltoleranz repliziert statt klassischer Mirrored Queues? | klassische Queue-Typen bieten schwächere Konsistenzgarantien bei Ausfällen |
| Acknowledgment | manuelles Ack nach erfolgreicher Verarbeitung statt Auto-Ack? | Auto-Ack vor Verarbeitung riskiert Nachrichtenverlust bei Consumer-Absturz |

Implementierung: der Exchange-Typ wird bewusst nach dem tatsächlichen Routing-Bedarf gewählt — Topic Exchange für musterbasiertes Routing, Fanout für Broadcast an alle Interessenten, Direct für einfaches exaktes Matching. Für produktionskritische Queues werden Quorum Queues (Raft-basierte Replikation) statt klassischer Mirrored Queues verwendet, da sie stärkere, konsistentere Ausfalltoleranz bieten. Consumer bestätigen Nachrichten manuell erst nach erfolgreicher Verarbeitung (nicht Auto-Ack beim Empfang), um Nachrichtenverlust bei einem Consumer-Absturz während der Verarbeitung zu vermeiden.

## Scalability, Reliability, Security und Observability

RabbitMQ skaliert komplexe Routing-Topologien gut, hat aber im Vergleich zu Kafka typischerweise geringeren maximalen Durchsatz pro Knoten — die Wahl zwischen beiden ist eine bewusste Trade-off-Entscheidung zwischen Routing-Flexibilität und rohem Durchsatz. Reliability-Grenze: klassische Mirrored Queues (älteres Replikationsmodell) haben unter bestimmten Netzwerkpartitionsszenarien schwächere Konsistenzgarantien als die neueren, Raft-basierten Quorum Queues.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Nachricht landet nicht in erwarteter Queue | Binding-Regel falsch konfiguriert oder Exchange-Typ passt nicht zum Muster | Routing-Key der Nachricht gegen konfigurierte Binding-Muster prüfen |
| Nachrichtenverlust bei Consumer-Absturz während Verarbeitung | Auto-Ack statt manuellem Ack nach Verarbeitung konfiguriert | Acknowledgment-Modus der Consumer-Konfiguration prüfen |
| inkonsistenter Queue-Zustand nach Broker-Ausfall | klassische Mirrored Queue statt Quorum Queue verwendet | Queue-Typ gegen Konsistenzanforderung und tatsächliche Konfiguration prüfen |
| Producer wird durch volle Queue blockiert | fehlendes Backpressure-Handling (Publisher Confirms, Flow Control) | Publisher-seitiges Verhalten bei voller Queue/langsamem Consumer testen |

Security: Exchange- und Queue-Zugriffsberechtigungen sollten granular pro virtuellem Host/Nutzer konfiguriert werden, um unautorisierten Zugriff auf sensible Nachrichtenflüsse zu verhindern. Observability: Queue-Länge, Consumer-Acknowledgment-Rate und Ready/Unacked-Nachrichtenanzahl sind zentrale Metriken für RabbitMQ-Gesundheit.

## Trade-offs und Entscheidungen

**Staff** testet Binding-Regeln explizit gegen erwartete und unerwartete Routing-Keys vor Produktivsetzung. **Principal** definiert Quorum Queues als Standard für produktionskritische Warteschlangen statt klassischer Mirrored Queues. **Chief** entscheidet zwischen RabbitMQ (komplexes Routing) und Kafka (hoher Durchsatz, Log-Semantik) anhand des primären Anwendungsfalls.

Anti-Patterns: Auto-Ack für kritische Nachrichtenverarbeitung verwenden; klassische Mirrored Queues für produktionskritische, ausfalltolerante Anwendungsfälle statt Quorum Queues; überlappende, undokumentierte Binding-Regeln, die zu unklarer Nachrichtenverteilung führen.

## Production Checklist

- [ ] Exchange-Typ bewusst nach tatsächlichem Routing-Bedarf gewählt.
- [ ] Quorum Queues für produktionskritische, ausfalltolerante Warteschlangen konfiguriert.
- [ ] Manuelles Acknowledgment nach erfolgreicher Verarbeitung statt Auto-Ack implementiert.
- [ ] Binding-Regeln dokumentiert und gegen erwartete Routing-Keys getestet.

## Interviewfragen

### 1. Was ist der Unterschied zwischen einer Direct-, Topic- und Fanout-Exchange?

**Antwort:** Direct routet nach exaktem Routing-Key-Match, Topic erlaubt Wildcard-Musterabgleich, Fanout sendet an alle gebundenen Queues unabhängig vom Routing-Key.

### 2. Warum sind Quorum Queues gegenüber klassischen Mirrored Queues vorzuziehen?

**Antwort:** Sie basieren auf einem Raft-artigen Konsensmechanismus und bieten stärkere, konsistentere Ausfalltoleranzgarantien, besonders bei Netzwerkpartitionsszenarien.

### 3. Warum ist manuelles Acknowledgment sicherer als Auto-Ack?

**Antwort:** Bei Auto-Ack gilt eine Nachricht bereits beim Empfang als bestätigt, bevor sie tatsächlich verarbeitet wurde; stürzt der Consumer während der Verarbeitung ab, geht die Nachricht verloren, statt für erneute Zustellung verfügbar zu bleiben.

### 4. Wann ist RabbitMQ gegenüber Kafka die bessere Wahl?

**Antwort:** Wenn komplexes, flexibles Routing (Musterabgleich, Broadcast-Verteilung) das primäre Bedürfnis ist, nicht maximaler roher Durchsatz oder Log-Replay-Fähigkeit.

### 5. Was passiert bei einer mehrdeutigen oder überlappenden Binding-Konfiguration?

**Antwort:** Eine Nachricht kann an mehrere Queues geroutet werden, obwohl nur eine beabsichtigt war, oder an keine, wenn die Bindings nicht wie erwartet matchen — beides führt zu unerwartetem Systemverhalten.

### 6. Widersprüchliche Anforderung: Team will komplexes, flexibles Routing UND maximalen Nachrichtendurchsatz — wie gehst du vor?

**Antwort:** Ich würde erklären, dass RabbitMQs Routing-Flexibilität und Kafkas roher Partitions-Durchsatz unterschiedliche Stärken sind; bei wirklich hohem Durchsatzbedarf mit gleichzeitig komplexem Routing würde ich prüfen, ob das Routing auf Anwendungsebene (z. B. über Topic-Namenskonventionen in Kafka) statt auf Broker-Ebene abgebildet werden kann.

## Praktische Labs

~~~python
import re

bindings = {"order.created.*": "queue_created", "order.shipped.*": "queue_shipped"}

def route(routing_key, bindings):
    matched = []
    for pattern, queue in bindings.items():
        regex = "^" + pattern.replace(".", r"\.").replace("*", "[^.]+") + "$"
        if re.match(regex, routing_key):
            matched.append(queue)
    return matched

result = route("order.created.eu", bindings)
assert result == ["queue_created"]
print(f"Message with routing key 'order.created.eu' correctly routed to: {result}")
~~~

## Dependencies, Cross-References und Quellen

1. RabbitMQ (Broadcom/VMware): [RabbitMQ Documentation - Quorum Queues](https://www.rabbitmq.com/docs/quorum-queues), abgerufen 2026-09-17.
2. RabbitMQ: [AMQP 0-9-1 Model Explained](https://www.rabbitmq.com/tutorials/amqp-concepts), abgerufen 2026-09-17.

RabbitMQ-Versionsdetails vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Quorum Queues als Standard-Ersatz für klassische Mirrored Queues | Established | Migrationspfad von bestehenden Mirrored Queues explizit planen und testen. |
| RabbitMQ Streams für log-ähnliche Semantik innerhalb von RabbitMQ | Adopting | Bedarf gegen dedizierte Log-Systeme (Kafka) abwägen, statt reflexhaft zu migrieren. |

Ein Team akzeptiert eine RabbitMQ-Topologie erst, wenn Routing-Regeln getestet, Quorum Queues für kritische Warteschlangen konfiguriert und manuelles Acknowledgment nachgewiesen sind.
