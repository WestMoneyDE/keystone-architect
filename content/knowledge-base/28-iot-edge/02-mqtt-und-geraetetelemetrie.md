---
{"id": "KB-0650", "title": "MQTT und Gerätetelemetrie", "domain": "28", "sequence": 2, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0649", "concepts": ["Geräte-Gateway-Cloud-Verbindung", "Offlineverhalten"], "needed_for": "MQTT ist ein konkretes Protokoll für die in KB-0649 beschriebene Geräte-zu-Cloud-Kommunikation"}], "related": ["KB-0649"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "MQTT-Topics, -Sessions und -QoS-Stufen korrekt erklären und für ein gegebenes Telemetrie-Szenario die passende QoS-Stufe auswählen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein IoT-System explizit gestalten, wie Retained Messages und Last Will genutzt werden, um bei begrenzter oder unterbrochener Gerätekonnektivität dennoch einen verlässlichen, aktuellen Systemzustand bereitzustellen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine falsche QoS-Stufe für ein gegebenes Telemetrie-Szenario gewählt wurde und dadurch entweder unnötiger Overhead oder tatsächlicher Nachrichtenverlust entsteht.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für MQTT-Topic-Strukturen und QoS-Richtlinien festlegen, die konsistente, verlässliche Telemetrie über heterogene Geräteflotten hinweg sicherstellen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Implementierung eines MQTT-Brokers im Detail (Clustering, Persistenzmechanismen des Brokers) ist Vertiefung.", "rationale": "Kern ist die korrekte Nutzung von MQTT-Semantik durch Geräte und Clients, nicht die interne Broker-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0650-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation von MQTT-QoS-Verhalten, kein realer MQTT-Broker verwendet", "evidence": "Ein lokales Skript simuliert Nachrichtenzustellung unter QoS 0, 1 und 2 bei simuliertem Verbindungsabbruch und zeigt den Unterschied in Zustellungsgarantie und Duplikatrisiko.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein realer MQTT-Broker oder reale Netzwerkbedingungen getestet."}]}
---
# MQTT und Gerätetelemetrie

> **Ziel:** MQTT ist ein leichtgewichtiges Publish-Subscribe-Protokoll für Gerätetelemetrie, aufgebaut auf vier zentralen Mechanismen: **Topics** (hierarchische Themenpfade, über die Nachrichten adressiert werden), **Sessions** (der persistente Zustand eines Clients gegenüber dem Broker, auch über Verbindungsabbrüche hinweg), **QoS** (Quality-of-Service-Stufen, die die Zustellungsgarantie einer Nachricht festlegen) sowie **Retained Messages** und **Last Will** (Mechanismen, die auch bei begrenzter oder unterbrochener Gerätekonnektivität einen verlässlichen, aktuellen Systemzustand bereitstellen). Der zentrale Punkt dieses Kapitels ist, dass die korrekte Wahl von QoS-Stufe, Retained-Message-Nutzung und Last-Will-Konfiguration direkt bestimmt, ob ein IoT-System bei der in IoT-Umgebungen typischen, begrenzten Konnektivität tatsächlich verlässliche Telemetrie liefert oder Nachrichten tatsächlich verliert beziehungsweise dupliziert.

## Zweck, Mental Model und Dependencies

Topics strukturieren MQTT-Nachrichten hierarchisch (etwa `gebaeude/etage1/raum3/temperatur`), sodass Clients gezielt Teilbäume abonnieren können, ohne alle Nachrichten im System zu empfangen — diese hierarchische Adressierung ist die Grundlage dafür, dass ein Gateway oder Cloud-Dienst nur die tatsächlich relevanten Telemetriedaten empfängt, statt das gesamte Nachrichtenaufkommen filtern zu müssen. Sessions bewahren den Zustand eines Clients (welche Topics abonniert sind, welche Nachrichten mit höherer QoS noch nicht bestätigt zugestellt wurden) auch über eine tatsächliche Verbindungsunterbrechung hinweg, wenn der Client mit `clean_session=false` verbunden ist — dies ist für IoT-Geräte mit unzuverlässiger Konnektivität zentral, da ein Gerät nach Wiederverbindung nicht erneut alle Topics abonnieren und keine während der Unterbrechung zugestellten, aber unbestätigten Nachrichten verlieren muss. QoS legt die tatsächliche Zustellungsgarantie fest: QoS 0 (höchstens einmal, keine Bestätigung, geringster Overhead, tatsächlicher Nachrichtenverlust bei Verbindungsproblemen möglich), QoS 1 (mindestens einmal, mit Bestätigung, aber tatsächliches Duplikatrisiko bei erneuter Zustellung nach fehlender Bestätigung) und QoS 2 (genau einmal, mit vierstufigem Handshake, höchster Overhead, aber garantiert weder Verlust noch Duplikat) — die Wahl der QoS-Stufe muss tatsächlich zum Telemetrie-Szenario passen: Für hochfrequente, tolerante Messwerte (etwa Temperaturmessungen alle Sekunde) ist QoS 0 oft ausreichend, während für sicherheitsrelevante Ereignisse (etwa ein Alarmzustand) QoS 1 oder QoS 2 tatsächlich notwendig ist. Retained Messages speichern die letzte Nachricht eines Topics beim Broker, sodass ein neu verbundener oder neu abonnierender Client sofort den aktuellen Zustand erhält, statt auf die nächste tatsächliche Nachricht warten zu müssen — dies ist zentral für IoT-Systeme, da ein Dashboard oder eine Cloud-Anwendung nach eigenem (Neu-)Start sofort den zuletzt bekannten Gerätezustand sehen soll. Last Will (Testament) ist eine Nachricht, die der Broker automatisch im Namen eines Clients veröffentlicht, wenn dieser Client unerwartet die Verbindung verliert (statt sich sauber abzumelden) — dies ermöglicht es abhängigen Systemen, tatsächlich zu erkennen, dass ein Gerät unerwartet offline gegangen ist, statt fälschlich anzunehmen, das Gerät sei weiterhin online, weil einfach keine neuen Nachrichten eintreffen.

~~~text
MQTT = lightweight publish-subscribe protocol for device telemetry, built on 4 central
  mechanisms
  TOPICS: hierarchical subject paths messages are addressed by
  SESSIONS: persistent client state vs broker, even across connection drops
  QoS: quality-of-service levels fixing a message's delivery guarantee
  RETAINED MESSAGES + LAST WILL: mechanisms providing reliable, current system state even
  under limited/interrupted device connectivity
KEY POINT: correct choice of QoS level, retained-message usage, and last-will config
  directly determines whether an IoT system under typical, limited IoT connectivity
  actually delivers reliable telemetry, or actually loses/duplicates messages
TOPICS structure MQTT messages hierarchically (e.g. building/floor1/room3/temperature)
  -> clients can subscribe to subtrees precisely w/o receiving all system messages
  hierarchical addressing = basis for gateway/cloud service receiving only actually
  relevant telemetry instead of filtering entire message volume
SESSIONS preserve client state (subscribed topics, unacknowledged higher-QoS messages)
  even across an actual connection interruption, when client connects w/ clean_session=false
  central for IoT devices w/ unreliable connectivity: device doesn't need to re-subscribe
  all topics after reconnect, doesn't lose messages delivered-but-unacked during interruption
QoS fixes actual delivery guarantee:
  QoS 0 (at most once, no ack, lowest overhead, actual message loss possible on
  connection issues)
  QoS 1 (at least once, w/ ack, but actual duplicate risk on redelivery after missing ack)
  QoS 2 (exactly once, 4-step handshake, highest overhead, but guaranteed no loss+no dup)
  QoS choice must actually match telemetry scenario: high-freq tolerant readings
  (temp every second) -> QoS 0 often sufficient; safety-relevant events (alarm state)
  -> QoS 1/2 actually necessary
RETAINED MESSAGES store a topic's last message at broker -> newly-connected/newly-
  subscribing client gets current state immediately instead of waiting for next actual
  message
  central for IoT: dashboard/cloud app should see last-known device state immediately
  after its own (re)start
LAST WILL = message broker auto-publishes on client's behalf when that client
  unexpectedly loses connection (instead of cleanly disconnecting)
  lets dependent systems ACTUALLY detect device went unexpectedly offline, instead of
  falsely assuming device still online just because no new messages arrive
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Topics | hierarchische Adressierung von Nachrichten | ermöglicht gezielte Subscription statt Vollempfang |
| Sessions (clean_session=false) | bewahrt Client-Zustand über Verbindungsabbrüche | verhindert Verlust unbestätigter Nachrichten und erneutes Abonnieren |
| QoS 0/1/2 | legt Zustellungsgarantie fest | Wahl muss zum Toleranzgrad des Telemetrie-Szenarios passen |
| Retained Messages | liefert letzten bekannten Zustand sofort bei (Re-)Subscription | verhindert Wartezeit auf nächste tatsächliche Nachricht |
| Last Will | signalisiert unerwarteten Verbindungsverlust | verhindert fälschliche Annahme, Gerät sei online |

Implementierung: Für jedes Telemetrie-Szenario wird die QoS-Stufe explizit anhand der tatsächlichen Toleranz gegenüber Verlust und Duplikat begründet. Für Zustandstopics (etwa Gerätestatus) werden Retained Messages aktiviert. Für jeden Client wird ein Last-Will-Topic mit einer expliziten "offline"-Nachricht konfiguriert, die bei unerwartetem Verbindungsverlust automatisch veröffentlicht wird.

## Scalability, Reliability, Security und Observability

Eine MQTT-basierte Telemetriearchitektur skaliert über die Anzahl gleichzeitig verbundener Geräte und Topics; die Reliability-Grenze liegt darin, dass eine falsch gewählte QoS-Stufe bei tatsächlich begrenzter Konnektivität zu tatsächlichem Nachrichtenverlust oder unnötigem Overhead führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Telemetriedaten fehlen sporadisch bei instabiler Verbindung | QoS 0 wurde für ein Szenario gewählt, das tatsächlich Zustellungsgarantie benötigt | QoS auf 1 oder 2 anheben und tatsächliche Zustellung erneut prüfen |
| ein Dashboard zeigt nach Neustart zunächst keinen Gerätezustand | für das Zustandstopic sind keine Retained Messages aktiviert | Retained Messages für Zustandstopics aktivieren |
| ein unerwartet offline gegangenes Gerät wird fälschlich als online angezeigt | kein Last-Will-Topic wurde für den Client konfiguriert | Last Will mit expliziter "offline"-Nachricht für jeden Client konfigurieren |

Security: MQTT-Verbindungen sollten über TLS verschlüsselt und mit Client-Zertifikaten oder Zugangsdaten authentifiziert werden, da Telemetriedaten sonst tatsächlich im Klartext über das Netzwerk übertragen werden. Observability: Die tatsächliche Häufigkeit von Last-Will-Auslösungen ist ein zentrales Signal zur Bewertung der tatsächlichen Konnektivitätsstabilität einer Geräteflotte.

## Trade-offs und Entscheidungen

**Staff** wählt für ein gegebenes Telemetrie-Szenario die korrekte QoS-Stufe. **Principal** entwirft die vollständige Topic-Struktur und Retained/Last-Will-Konfiguration für eine Geräteflotte. **Chief** legt unternehmensweite Standards für Topic-Namenskonventionen und QoS-Richtlinien fest.

Anti-Patterns: für alle Telemetriedaten pauschal QoS 2 verwenden und dadurch unnötigen Overhead erzeugen; kein Last-Will-Topic konfigurieren, sodass unerwartet offline gegangene Geräte fälschlich als online erscheinen; keine Retained Messages für Zustandstopics nutzen.

## Production Checklist

- [ ] Die QoS-Stufe ist für jedes Telemetrie-Szenario explizit anhand der tatsächlichen Verlust-/Duplikat-Toleranz begründet.
- [ ] Zustandstopics nutzen Retained Messages.
- [ ] Jeder Client hat ein konfiguriertes Last-Will-Topic mit expliziter "offline"-Nachricht.
- [ ] MQTT-Verbindungen sind TLS-verschlüsselt und authentifiziert.

## Interviewfragen

### 1. Was ist der Unterschied zwischen QoS 0, 1 und 2 in MQTT?

**Antwort:** QoS 0 liefert höchstens einmal ohne Bestätigung, QoS 1 liefert mindestens einmal mit Bestätigung aber möglichem Duplikat, QoS 2 liefert garantiert genau einmal mit höherem Overhead durch einen vierstufigen Handshake.

### 2. Wofür wird eine Retained Message verwendet?

**Antwort:** Sie speichert die letzte Nachricht eines Topics beim Broker, sodass ein neu verbundener oder neu abonnierender Client sofort den aktuellen Zustand erhält.

### 3. Was löst eine Last-Will-Nachricht aus?

**Antwort:** Sie wird vom Broker automatisch im Namen eines Clients veröffentlicht, wenn dieser Client unerwartet die Verbindung verliert, statt sich sauber abzumelden.

### 4. Warum ist `clean_session=false` für IoT-Geräte mit unzuverlässiger Konnektivität wichtig?

**Antwort:** Weil dadurch der Client-Zustand (abonnierte Topics, unbestätigte höhere-QoS-Nachrichten) auch über Verbindungsabbrüche hinweg erhalten bleibt und nach Wiederverbindung nicht neu aufgebaut werden muss.

### 5. Wie gehst du vor, wenn Telemetriedaten bei instabiler Verbindung sporadisch fehlen?

**Antwort:** Ich prüfe die gewählte QoS-Stufe und hebe sie bei tatsächlichem Zustellungsbedarf auf QoS 1 oder 2 an, statt die Ursache anderswo zu suchen.

### 6. Widersprüchliche Anforderung: Das Produktteam will minimalen Netzwerk-Overhead für batteriebetriebene Geräte UND die Organisation will garantierte Zustellung für alle Telemetriedaten — wie gehst du vor?

**Antwort:** Ich würde QoS differenziert je nach tatsächlicher Kritikalität des Datentyps wählen (QoS 0 für tolerante, hochfrequente Messwerte, QoS 1 oder 2 nur für tatsächlich sicherheitsrelevante Ereignisse), statt pauschal eine einzige QoS-Stufe für alle Daten zu erzwingen.

## Praktische Labs

~~~python
# Local, deterministic simulation of MQTT QoS delivery behavior (executed locally, no real broker):

def deliver(qos, connection_drops_during_send):
    if qos == 0:
        return "lost" if connection_drops_during_send else "delivered_once"
    if qos == 1:
        return "delivered_possibly_duplicate" if connection_drops_during_send else "delivered_once"
    return "delivered_exactly_once"  # QoS 2

for qos in [0, 1, 2]:
    print(qos, deliver(qos, connection_drops_during_send=True))
~~~

## Dependencies, Cross-References und Quellen

1. OASIS: [MQTT Version 5.0 Specification](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html), abgerufen 2026-09-18.
2. HiveMQ: [MQTT Essentials — QoS, Retained Messages, Last Will](https://www.hivemq.com/mqtt-essentials/), abgerufen 2026-09-18.

Dieses Kapitel setzt die in KB-0649 (IoT-Referenzarchitektur) beschriebene Geräte-Gateway-Cloud-Verbindung als konkretes Protokoll um.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| MQTT 5.0 Shared Subscriptions für Lastverteilung über mehrere Cloud-Consumer-Instanzen hinweg | Emerging | Bei Skalierungsbedarf evaluieren, aber bis zur breiteren Broker-Unterstützung weiterhin dedizierte Topic-Partitionierung für Lastverteilung einplanen. |

Ein Team akzeptiert eine MQTT-basierte Telemetriearchitektur erst, wenn QoS-Wahl, Retained-Message-Nutzung und Last-Will-Konfiguration nachweislich anhand der tatsächlichen Zuverlässigkeits- und Konnektivitätsanforderungen begründet sind.
