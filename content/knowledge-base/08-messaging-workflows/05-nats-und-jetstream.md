---
{"id": "KB-0181", "title": "NATS und JetStream", "domain": "08", "sequence": 5, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE"], "requires": [{"id": "KB-0177", "concepts": ["Queue-Semantik", "Log-Semantik"], "needed_for": "both"}, {"id": "KB-0180", "concepts": ["Routing"], "needed_for": "understanding"}], "related": ["KB-0179", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einfache Subject-basierte Pub/Sub-Kommunikation und einen persistenten JetStream-Consumer lokal simulieren.", "rationale": "Kein echter NATS-Server nötig, um den Unterschied zwischen Core NATS und JetStream zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Bewusst zwischen leichtgewichtiger Core-NATS-Kommunikation (kein Zustand, keine Zustellgarantie) und JetStream (persistent, garantiert) wählen.", "rationale": "Beide Modi haben fundamental unterschiedliche Garantien innerhalb desselben Systems."}, "STAFF-TARGET": {"active": true, "scope": "Nachrichtenverlust auf die Nutzung von Core NATS statt JetStream für einen Anwendungsfall zurückführen, der Zustellgarantie benötigte.", "rationale": "Das ist ein häufiges Missverständnis, da beide Modi dieselbe Client-API nutzen können."}, "CHIEF-TARGET": {"active": true, "scope": "NATS für latenzsensitive, leichtgewichtige interne Kommunikation gegenüber schwergewichtigeren Brokern positionieren.", "rationale": "NATS' Stärke liegt in geringem Ressourcenbedarf und niedriger Latenz, nicht in Feature-Vollständigkeit."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "NATS-Clustering und Leaf-Node-Topologien im Detail sind Vertiefung.", "rationale": "Kern ist die Unterscheidung Core NATS versus JetStream und Request-Reply-Muster."}}, "lab_validation": [{"lab_id": "KB-0181-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Core-NATS (keine Persistenz) versus JetStream (persistent, Consumer-Zustand)", "evidence": "Eine Nachricht, die gesendet wird, während kein Core-NATS-Subscriber verbunden ist, geht verloren; dieselbe Nachricht bleibt bei JetStream für einen später verbindenden Consumer verfügbar.", "limitations": "Kein echter NATS-Server, keine Produktion."}]}
---
# NATS und JetStream

> **Ziel:** Core NATS ist ein extrem leichtgewichtiges, latenzarmes Publish-Subscribe-System ohne Zustellgarantie oder Persistenz — eine Nachricht ohne verbundenen Subscriber ist einfach weg. JetStream fügt darüber eine Persistenzschicht mit Zustellgarantien, Streams und Consumer-Zustand hinzu — ähnlich einem Log ([KB-0177](01-queues-und-logs-im-vergleich.md)). Der kritische Punkt: beide nutzen dieselbe Client-API, was die Verwechslung ihrer sehr unterschiedlichen Garantien begünstigt.

## Zweck, Mental Model und Dependensies

Core NATS funktioniert wie ein reines „Fire and Forget"-Broadcast-System: ein Publisher sendet an ein Subject, alle aktuell verbundenen Subscriber dieses Subjects erhalten die Nachricht sofort — gibt es keinen verbundenen Subscriber, ist die Nachricht ohne jede Speicherung verloren. JetStream fügt eine Persistenzschicht hinzu: Nachrichten werden in einem Stream gespeichert, Consumer verfolgen ihren eigenen Fortschritt (ähnlich Kafka-Offsets), und eine Nachricht bleibt für später verbindende oder wiederholende Consumer verfügbar. Request-Reply ist ein zusätzliches Muster über Core NATS, bei dem ein Publisher auf eine Antwort auf einem dynamisch generierten Reply-Subject wartet. Lies [KB-0177](01-queues-und-logs-im-vergleich.md) und [KB-0180](04-rabbitmq-und-routingtopologien.md).

~~~text
Core NATS:  publish("orders.created", msg) -> only CURRENTLY connected subscribers receive it, no storage
JetStream:  publish to stream("ORDERS") -> persisted -> consumer tracks its own ack'd offset, replay possible
Request-Reply: publish(subject, msg, reply_to=inbox) -> subscriber replies to `inbox` -> requester awaits response
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Core NATS | JetStream |
|---|---|---|
| Persistenz | keine | ja, konfigurierbare Retention |
| Zustellgarantie | keine (at-most-once, nur wenn verbunden) | konfigurierbar (at-least-once/exactly-once innerhalb JetStream) |
| Latenz | sehr niedrig, minimaler Overhead | höher durch Persistenz-Overhead |
| Anwendungsfall | Echtzeit-Broadcast, Service-Discovery-Signale | zuverlässige Ereignisverarbeitung, Replay-Bedarf |

Implementierung: die Entscheidung zwischen Core NATS und JetStream wird explizit pro Anwendungsfall getroffen, nicht implizit durch dieselbe API-Nutzung verschleiert — ein Team muss bewusst wissen, welchen Modus es einsetzt. Core NATS eignet sich für Anwendungsfälle, bei denen ein verpasstes Ereignis tolerierbar ist (z. B. Live-Status-Updates, wo der nächste Update-Zyklus den fehlenden ausgleicht). JetStream wird für Anwendungsfälle mit Zustellgarantie-Bedarf eingesetzt, mit explizit konfigurierter Retention und Consumer-Acknowledgment-Strategie.

## Scalability, Reliability, Security und Observability

Core NATS skaliert extrem niedrige Latenz und minimalen Ressourcenbedarf für Broadcast-Kommunikation, während JetStream mit Persistenz-Overhead vergleichbar zu anderen Log-Systemen skaliert. Reliability-Grenze: der gefährlichste Fehler ist, Core NATS für einen Anwendungsfall zu nutzen, der tatsächlich Zustellgarantie braucht — da die API-Nutzung ähnlich aussieht, wird dieser Fehler oft erst durch tatsächlichen, scheinbar unerklärlichen Nachrichtenverlust entdeckt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Nachrichten gehen scheinbar zufällig verloren | Core NATS statt JetStream für einen Anwendungsfall mit Zustellgarantie-Bedarf genutzt | prüfen, ob der genutzte Client-Code tatsächlich JetStream-APIs statt Core-NATS-APIs verwendet |
| Consumer verpasst Nachrichten während eines Neustarts | Core NATS: keine Persistenz während der Downtime des Subscribers | Downtime-Fenster gegen Persistenzverhalten (Core vs. JetStream) prüfen |
| unerwartete Latenz bei JetStream-Nutzung für latenzkritischen Anwendungsfall | Persistenz-Overhead nicht bedacht bei der Wahl von JetStream | Latenzanforderung gegen tatsächlichen JetStream-Persistenz-Overhead abgleichen |
| Request-Reply-Aufruf hängt ohne Antwort | kein Subscriber für das angefragte Subject verbunden, keine Fehlerrückmeldung ohne expliziten Timeout | Timeout-Konfiguration des Request-Reply-Aufrufs prüfen |

Security: NATS-Subject-basierte Zugriffskontrolle sollte granular konfiguriert werden, da Subjects oft hierarchisch strukturiert sind und ein zu weit gefasster Zugriff auf einen übergeordneten Subject-Pfad unbeabsichtigt Zugriff auf viele untergeordnete Themen gewähren kann. Observability: für JetStream sind Consumer-Lag und Stream-Speichernutzung zentrale Metriken; für Core NATS ist die Anzahl aktiver Subscriber pro Subject relevant, um sicherzustellen, dass tatsächlich jemand empfängt.

## Trade-offs und Entscheidungen

**Staff** dokumentiert explizit, welcher Modus (Core/JetStream) für welchen Anwendungsfall genutzt wird, um Verwechslung zu vermeiden. **Principal** definiert klare Kriterien, wann Zustellgarantie zwingend JetStream erfordert. **Chief** positioniert NATS als leichtgewichtige Option für latenzsensitive interne Kommunikation, mit bewusster Abgrenzung zu schwergewichtigeren, feature-reicheren Brokern.

Anti-Patterns: Core NATS für Anwendungsfälle mit Zustellgarantie-Bedarf nutzen, ohne die fehlende Persistenz zu bedenken; JetStream unreflektiert für jeden Anwendungsfall einsetzen, auch wo der Persistenz-Overhead unnötig ist; Request-Reply ohne expliziten Timeout implementieren.

## Production Checklist

- [ ] Explizite, dokumentierte Entscheidung zwischen Core NATS und JetStream pro Anwendungsfall.
- [ ] JetStream für alle Anwendungsfälle mit Zustellgarantie-Bedarf verwendet, nicht Core NATS.
- [ ] Request-Reply-Aufrufe haben expliziten Timeout.
- [ ] Subject-basierte Zugriffskontrolle granular konfiguriert.

## Interviewfragen

### 1. Was ist der fundamentale Unterschied zwischen Core NATS und JetStream?

**Antwort:** Core NATS bietet keine Persistenz oder Zustellgarantie — eine Nachricht ohne verbundenen Subscriber ist verloren; JetStream fügt Persistenz, konfigurierbare Zustellgarantien und Consumer-Zustand hinzu.

### 2. Warum ist die Verwechslung von Core NATS und JetStream ein häufiger Fehler?

**Antwort:** Beide nutzen eine ähnliche Client-API, wodurch ein Entwickler versehentlich Core NATS für einen Anwendungsfall nutzen kann, der tatsächlich die Zustellgarantie von JetStream benötigt hätte.

### 3. Wann ist Core NATS gegenüber JetStream die richtige Wahl?

**Antwort:** Wenn ein verpasstes Ereignis tolerierbar ist und extrem niedrige Latenz sowie minimaler Ressourcenbedarf wichtiger sind als Zustellgarantie, z. B. bei häufig wiederholten Status-Updates.

### 4. Was ist das Request-Reply-Muster in NATS?

**Antwort:** Ein Publisher sendet eine Anfrage mit einem dynamisch generierten Reply-Subject und wartet auf eine Antwort eines Subscribers auf diesem Subject — ein synchrones Anfrage-Antwort-Muster über ein Publish-Subscribe-System.

### 5. Warum braucht ein Request-Reply-Aufruf einen expliziten Timeout?

**Antwort:** Ohne verbundenen Subscriber für das angefragte Subject würde der Aufrufer sonst unbegrenzt auf eine Antwort warten, die nie eintrifft.

### 6. Widersprüchliche Anforderung: Team will extrem niedrige Latenz UND garantierte Zustellung selbst bei kurzzeitig getrennten Consumern — wie gehst du vor?

**Antwort:** Ich würde erklären, dass Persistenz (für Zustellgarantie) zwangsläufig etwas Overhead gegenüber reinem Core NATS bedeutet; JetStream ist der Kompromiss, der beide Ziele bestmöglich vereint, aber die Latenz wird nie ganz so niedrig wie bei Core NATS sein — ich würde diesen Trade-off explizit mit dem Team abstimmen.

## Praktische Labs

~~~python
class CoreNATS:
    def __init__(self):
        self.subscribers = []
    def publish(self, msg):
        for sub in self.subscribers:
            sub.append(msg)  # only currently connected subscribers receive it

class JetStream:
    def __init__(self):
        self.stream = []
    def publish(self, msg):
        self.stream.append(msg)  # persisted regardless of subscriber presence
    def consume_from(self, offset):
        return self.stream[offset:]

core = CoreNATS()
core.publish("event1")  # lost, no subscriber connected yet
sub = []
core.subscribers.append(sub)
core.publish("event2")
assert sub == ["event2"]  # event1 was lost

js = JetStream()
js.publish("event1")  # persisted even without a consumer present
late_consumer_reads = js.consume_from(0)
assert late_consumer_reads == ["event1"]
print("Core NATS lost the early message; JetStream persisted it for a later consumer.")
~~~

## Dependencies, Cross-References und Quellen

1. Synadia/NATS.io: [NATS Documentation - JetStream](https://docs.nats.io/nats-concepts/jetstream), abgerufen 2026-09-17.
2. NATS.io: [Core NATS Concepts](https://docs.nats.io/nats-concepts/core-nats), abgerufen 2026-09-17.

NATS-Versionsdetails vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| JetStream als integrierte Persistenzschicht statt separatem Broker-System | Established | Feature-Reife gegenüber dedizierten Log-Systemen (Kafka) für den konkreten Anwendungsfall vergleichen. |

Ein Team akzeptiert eine NATS-Implementierung erst, wenn die Wahl zwischen Core NATS und JetStream explizit dokumentiert und gegen den tatsächlichen Zustellgarantie-Bedarf geprüft ist.
