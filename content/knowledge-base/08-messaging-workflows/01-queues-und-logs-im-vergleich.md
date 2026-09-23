---
{"id": "KB-0177", "title": "Queues und Logs im Vergleich", "domain": "08", "sequence": 1, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0111", "concepts": ["Event Sourcing"], "needed_for": "understanding"}], "related": ["KB-0178", "KB-0179", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Destruktives Lesen (Queue) versus wiederholbares Lesen mit Offset (Log) lokal implementieren und den Unterschied demonstrieren.", "rationale": "Kein echter Broker nötig, um das Grundprinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Zwischen Queue- und Log-Semantik anhand des tatsächlichen Bedarfs (Arbeitsverteilung vs. Ereignisgeschichte) begründet wählen.", "rationale": "Beide Modelle lösen unterschiedliche Probleme; die Wahl ist keine reine Technologiepräferenz."}, "STAFF-TARGET": {"active": true, "scope": "Einen Datenverlust auf destruktives Lesen einer Queue zurückführen, wo eigentlich Replay-Fähigkeit benötigt wurde.", "rationale": "Das ist eine grundlegende, folgenreiche Fehlentscheidung bei der Broker-Wahl."}, "CHIEF-TARGET": {"active": true, "scope": "Queue- versus Log-basierte Systeme als Standardentscheidung für unterschiedliche Nachrichtenverarbeitungsmuster im Portfolio festlegen.", "rationale": "Eine falsche Grundsatzentscheidung ist später nur mit erheblichem Migrationsaufwand korrigierbar."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Hybride Systeme, die beide Semantiken kombinieren, sind Vertiefung.", "rationale": "Kern ist das Verständnis der fundamentalen Unterscheidung, nicht jede Hybridarchitektur."}}, "lab_validation": [{"lab_id": "KB-0177-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Queue (destruktives Lesen) versus Log (Offset-basiertes wiederholbares Lesen)", "evidence": "Nach einmaligem Lesen ist eine Nachricht in der Queue-Simulation nicht mehr verfügbar, während dieselbe Nachricht in der Log-Simulation von einem zweiten Consumer mit anderem Offset erneut gelesen werden kann.", "limitations": "Kein echter Message-Broker, keine Produktion."}]}
---
# Queues und Logs im Vergleich

> **Ziel:** Eine klassische Queue liefert eine Nachricht destruktiv an genau einen Consumer aus — nach erfolgreicher Verarbeitung ist sie weg. Ein partitioniertes Ereignislog (wie bei Kafka) behält Nachrichten für eine konfigurierte Retention-Zeit und erlaubt mehreren unabhängigen Consumern, dieselbe Nachricht mit eigenem Offset zu lesen und bei Bedarf erneut zu verarbeiten (Replay). Diese Wahl ist grundlegend und bestimmt, ob Arbeitsverteilung oder Ereignisgeschichte das primäre Ziel ist.

## Zweck, Mental Model und Dependencies

Eine Queue modelliert „diese Arbeit muss genau einmal von irgendjemandem erledigt werden" — mehrere Consumer teilen sich die Last, jede Nachricht geht an genau einen von ihnen, und nach Bestätigung ist sie aus der Queue entfernt. Ein Log modelliert „dieses Ereignis ist Teil der Geschichte" — jeder Consumer liest unabhängig mit eigenem Offset, mehrere Consumer können dieselbe Nachricht unabhängig konsumieren, und die Nachricht bleibt für andere/spätere Consumer sowie für Replay erhalten. Diese Unterscheidung ist eng mit Event Sourcing ([KB-0111](../05-distributed-systems/11-event-sourcing-und-rekonstruktion.md)) verwandt: ein Log ist eine natürliche Grundlage für ein Ereignislog, eine Queue nicht. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0111](../05-distributed-systems/11-event-sourcing-und-rekonstruktion.md).

~~~text
Queue:  msg -> Consumer1 takes it -> ack -> message DELETED, gone for everyone
Log:    msg written at offset 5 -> ConsumerA reads at offset 5, ConsumerB reads independently at offset 3
        -> message stays available per retention policy, both consumers can re-read/replay
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Queue | Log |
|---|---|---|
| Lesevorgang | destruktiv, Nachricht verschwindet nach Ack | nicht-destruktiv, Nachricht bleibt bis Retention-Ablauf |
| Consumer-Modell | mehrere Consumer teilen sich die Last (Competing Consumers) | mehrere unabhängige Consumer lesen jeweils den vollständigen Stream |
| Replay | nicht möglich, Nachricht ist nach Verarbeitung weg | möglich, solange innerhalb der Retention-Zeit |
| primärer Anwendungsfall | Arbeitsverteilung (Task-Queue) | Ereignisgeschichte, mehrere unabhängige Konsumenten desselben Streams |

Implementierung: die Wahl zwischen Queue- und Log-Semantik wird anhand der eigentlichen fachlichen Frage getroffen — „muss diese Arbeit genau einmal von irgendeinem verfügbaren Worker erledigt werden" (Queue) oder „muss dieses Ereignis von mehreren unabhängigen Systemen konsumiert werden, eventuell auch rückwirkend" (Log). Retention-Zeit bei Logs wird explizit nach dem Replay-Bedarf dimensioniert — eine zu kurze Retention macht Replay-Fähigkeit praktisch nutzlos.

## Scalability, Reliability, Security und Observability

Queues skalieren Arbeitsverteilung über viele Worker mit einfacher Lastteilung; Logs skalieren die gleichzeitige unabhängige Konsumierung eines Streams durch viele verschiedene Systeme. Reliability-Grenze: der häufigste Fehler ist eine Queue für einen Anwendungsfall zu wählen, der eigentlich Replay-Fähigkeit braucht (z. B. ein neuer Consumer möchte die gesamte Historie neu verarbeiten) — mit einer Queue ist diese Historie bereits unwiederbringlich verloren.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein neuer Consumer kann historische Ereignisse nicht nachträglich verarbeiten | Queue-Semantik gewählt, wo Log-Semantik (Replay) benötigt wurde | prüfen, ob der zugrunde liegende Broker destruktives oder Offset-basiertes Lesen implementiert |
| mehrere Systeme sollen dieselben Ereignisse unabhängig konsumieren, aber nur eines erhält sie | Queue-Semantik statt Log-Semantik für Multi-Consumer-Bedarf | prüfen, ob Nachrichten nach einer Zustellung für andere Consumer verschwinden |
| Speicherbedarf des Logs wächst unerwartet stark | Retention-Zeit zu lang für tatsächlichen Replay-Bedarf konfiguriert | Retention-Konfiguration gegen tatsächlichen Replay-Anwendungsfall abgleichen |
| Arbeitsverteilung über mehrere Worker funktioniert nicht wie erwartet bei Log-basiertem System | Log-Semantik für einen eigentlichen Arbeitsverteilungs-Anwendungsfall genutzt | prüfen, ob mehrere Consumer-Gruppen versehentlich dieselbe Arbeit mehrfach ausführen |

Security: Log-Retention bedeutet, dass sensible Daten länger im System verbleiben als bei einer Queue — Datenschutzanforderungen (Löschfristen) müssen explizit gegen die Retention-Konfiguration abgeglichen werden. Observability: Log-basierte Systeme bieten von Natur aus eine nachvollziehbare Historie für Debugging und Audit, die eine Queue nach Verarbeitung nicht mehr bietet.

## Trade-offs und Entscheidungen

**Staff** klärt vor der Broker-Wahl explizit, ob Replay-Fähigkeit oder reine Arbeitsverteilung benötigt wird. **Principal** definiert Retention-Zeiten für Logs anhand des tatsächlichen Replay-/Audit-Bedarfs. **Chief** legt fest, für welche Systemklassen Queue- versus Log-Semantik als Standard gilt und vermeidet dadurch spätere, aufwendige Migrationen.

Anti-Patterns: eine Queue für einen Anwendungsfall wählen, der später Replay-Fähigkeit benötigt, ohne dies vorab zu klären; Log-Retention ohne Bezug zum tatsächlichen Replay-Bedarf oder zu Datenschutzanforderungen konfigurieren; Log-Semantik für reine Arbeitsverteilung nutzen, ohne Consumer-Gruppen-Semantik korrekt zu konfigurieren.

## Production Checklist

- [ ] Broker-Wahl (Queue/Log) explizit anhand Arbeitsverteilung versus Ereignisgeschichte begründet.
- [ ] Retention-Zeit bei Logs an tatsächlichen Replay-Bedarf angepasst.
- [ ] Datenschutz-/Löschanforderungen gegen Retention-Konfiguration abgeglichen.
- [ ] Consumer-Gruppen-Semantik korrekt konfiguriert, um Arbeitsverteilung versus unabhängige Konsumierung nicht zu verwechseln.

## Interviewfragen

### 1. Was ist der grundlegende Unterschied zwischen einer Queue und einem Log?

**Antwort:** Eine Queue liest destruktiv — eine Nachricht ist nach Verarbeitung weg; ein Log liest nicht-destruktiv über einen Offset, sodass mehrere unabhängige Consumer dieselbe Nachricht lesen und bei Bedarf erneut verarbeiten können.

### 2. Wann wählst du eine Queue statt eines Logs?

**Antwort:** Wenn das primäre Ziel Arbeitsverteilung ist — eine Aufgabe soll genau einmal von einem verfügbaren Worker erledigt werden, ohne dass mehrere Systeme unabhängig auf dieselbe Nachricht zugreifen müssen.

### 3. Was ist der Vorteil von Replay-Fähigkeit bei einem Log?

**Antwort:** Ein neuer Consumer oder eine geänderte Verarbeitungslogik kann historische Ereignisse erneut verarbeiten, was bei einer Queue unmöglich ist, da Nachrichten nach Verarbeitung unwiederbringlich gelöscht sind.

### 4. Warum ist die Wahl zwischen Queue und Log eine grundlegende, schwer revidierbare Entscheidung?

**Antwort:** Die zugrunde liegende Semantik (destruktives vs. Offset-basiertes Lesen) ist architektonisch verankert; eine spätere Änderung erfordert oft eine vollständige Migration zu einem anderen Brokertyp oder -modell.

### 5. Was passiert, wenn Retention-Zeit und tatsächlicher Replay-Bedarf nicht übereinstimmen?

**Antwort:** Eine zu kurze Retention macht Replay-Fähigkeit praktisch nutzlos, da ältere Ereignisse bereits gelöscht sind; eine zu lange Retention erhöht unnötig Speicherbedarf und potenziell Datenschutzrisiken.

### 6. Widersprüchliche Anforderung: Produkt will einfache Arbeitsverteilung UND spätere Möglichkeit, historische Ereignisse für neue Analysen zu nutzen — wie gehst du vor?

**Antwort:** Ich würde ein Log-basiertes System mit angemessener Retention wählen und Arbeitsverteilung über Consumer-Gruppen (die die Last innerhalb der Gruppe teilen) abbilden — das kombiniert Arbeitsverteilung mit Replay-Fähigkeit, statt beide Anforderungen als unvereinbar zu behandeln.

## Praktische Labs

~~~python
class Queue:
    def __init__(self):
        self.messages = ["msg1", "msg2"]
    def read(self):
        return self.messages.pop(0) if self.messages else None  # destructive

class Log:
    def __init__(self):
        self.messages = ["msg1", "msg2"]
    def read(self, offset):
        return self.messages[offset] if offset < len(self.messages) else None  # non-destructive

q = Queue()
first_read = q.read()
second_read_same_consumer = q.read()
assert first_read == "msg1" and second_read_same_consumer == "msg2"
assert q.read() is None  # gone after being read once

log = Log()
consumer_a_read = log.read(0)
consumer_b_read = log.read(0)  # independent consumer, same offset, message still available
assert consumer_a_read == consumer_b_read == "msg1"
print("Queue message was consumed destructively; log message remained available for independent re-reading.")
~~~

## Dependencies, Cross-References und Quellen

1. Kreps: [The Log: What every software engineer should know about real-time data's unifying abstraction](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying), LinkedIn Engineering 2013, abgerufen 2026-09-17.

Produktspezifische Broker-Implementierungsdetails werden in den folgenden Kapiteln (Kafka, RabbitMQ, etc.) vertieft.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Hybride Broker mit konfigurierbarer Queue- und Log-Semantik im selben System | Adopting | Tatsächliches Verhalten unter beiden Semantiken separat testen, nicht pauschal vertrauen. |

Ein Team akzeptiert eine Broker-Grundsatzentscheidung erst, wenn Arbeitsverteilungs- versus Replay-Bedarf explizit geklärt und die gewählte Semantik entsprechend konfiguriert ist.
