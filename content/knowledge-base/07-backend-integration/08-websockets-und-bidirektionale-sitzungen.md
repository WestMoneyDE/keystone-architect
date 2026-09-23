---
{"id": "KB-0160", "title": "WebSockets und bidirektionale Sitzungen", "domain": "07", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "STAFF", "PRINCIPAL"], "requires": [{"id": "KB-0056", "concepts": ["TCP"], "needed_for": "both"}, {"id": "KB-0117", "concepts": ["Backpressure"], "needed_for": "both"}], "related": ["KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine WebSocket-Verbindung mit Heartbeat und Reconnect-Logik lokal simulieren.", "rationale": "Kein echter WebSocket-Server nötig, um das Prinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Verbindungszustand, Reconnect-Strategie und horizontale Verteilung für interaktive WebSocket-Clients entwerfen.", "rationale": "WebSockets sind zustandsbehaftete, langlebige Verbindungen, die anders skalieren als zustandslose HTTP-Anfragen."}, "STAFF-TARGET": {"active": true, "scope": "Eine tote, aber scheinbar offene Verbindung anhand fehlender Heartbeats diagnostizieren.", "rationale": "TCP-Verbindungen können ohne Anwendungs-Heartbeat lange unbemerkt tot bleiben."}, "CHIEF-TARGET": {"active": true, "scope": "Horizontale Skalierungsstrategie für zustandsbehaftete WebSocket-Verbindungen (Sticky Sessions vs. Pub/Sub-Verteilung) als Standard festlegen.", "rationale": "WebSocket-Skalierung erfordert andere Infrastrukturentscheidungen als zustandslose REST-APIs."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "WebSocket-Subprotokolle und Binärframe-Optimierung im Detail sind Vertiefung.", "rationale": "Kern ist Verbindungszustand, Heartbeat, Reconnect und Skalierung."}}, "lab_validation": [{"lab_id": "KB-0160-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Heartbeat-basierte Erkennung toter Verbindungen", "evidence": "Eine Verbindung ohne Heartbeat-Antwort innerhalb des Zeitfensters wird korrekt als tot erkannt und geschlossen, obwohl der zugrunde liegende TCP-Socket noch offen erscheint.", "limitations": "Kein echter WebSocket-Server, keine Produktion."}]}
---
# WebSockets und bidirektionale Sitzungen

> **Ziel:** WebSockets etablieren eine langlebige, bidirektionale Verbindung über einen initialen HTTP-Upgrade — im Gegensatz zu zustandslosen REST-Anfragen muss die Anwendung den Verbindungszustand selbst verwalten: Heartbeats zur Erkennung toter Verbindungen, Reconnect-Logik und eine Strategie für horizontale Skalierung über mehrere Server-Instanzen.

## Zweck, Mental Model und Dependencies

Der WebSocket-Handshake beginnt als normale HTTP-Anfrage mit einem `Upgrade`-Header; nach erfolgreichem Upgrade läuft die Verbindung als persistenter, bidirektionaler Kanal über dasselbe TCP-Socket weiter. Ein TCP-Socket kann „tot" sein (z. B. Client-Netzwerk unterbrochen), ohne dass der Server das sofort bemerkt — TCP allein erkennt das oft erst nach langen Timeouts. Ein Anwendungs-Heartbeat (periodisches Ping/Pong) macht die Verbindungsgesundheit explizit prüfbar, unabhängig von TCP-internen Timeouts. Lies [KB-0056](../03-network-foundations/08-tcp-verbindungen-und-ueberlastkontrolle.md) und [KB-0117](../05-distributed-systems/17-backpressure-und-ueberlast.md).

~~~text
HTTP Upgrade handshake -> persistent bidirectional connection over the same TCP socket
Server sends ping every 30s -> Client must pong within timeout -> no pong = connection presumed dead, close it
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Heartbeat | Ping/Pong-Intervall und Timeout definiert? | tote Verbindung bleibt unbemerkt offen, verschwendet Ressourcen |
| Reconnect | Client-seitige Backoff-Strategie bei Verbindungsabbruch? | sofortiger, unkoordinierter Reconnect-Sturm nach Serverausfall |
| Nachrichtenreihenfolge/-verlust | werden Nachrichten während eines Reconnects verifiziert? | Nachrichten gehen während Ausfallfenstern verloren, ohne dass Client/Server es merken |
| Horizontale Skalierung | wie werden Nachrichten über mehrere Server-Instanzen verteilt? | Sticky Sessions ohne Failover-Plan oder fehlende Pub/Sub-Verteilung |

Implementierung: ein Heartbeat-Mechanismus (Ping vom Server, Pong vom Client innerhalb eines Timeouts) erkennt tote Verbindungen unabhängig von TCP-Timeout-Verhalten. Reconnect-Logik auf Client-Seite nutzt Backoff mit Jitter ([KB-0114](../05-distributed-systems/14-retries-und-wiederholungsstuerme.md)), um nach einem Serverausfall keinen synchronisierten Reconnect-Sturm zu erzeugen. Für horizontale Skalierung wird entweder Sticky-Session-Routing (ein Client bleibt an derselben Server-Instanz) mit Failover-Strategie oder eine Pub/Sub-Infrastruktur (Nachrichten werden über alle Instanzen verteilt, unabhängig davon, welche Instanz den WebSocket-Client hält) implementiert.

## Scalability, Reliability, Security und Observability

WebSocket-Skalierung unterscheidet sich fundamental von zustandslosen HTTP-APIs: jede Verbindung bindet Server-Ressourcen über ihre gesamte Lebensdauer, und eine Nachricht an einen bestimmten Client muss die Server-Instanz erreichen, die dessen Verbindung tatsächlich hält. Reliability-Grenze: ohne Heartbeat können tote Verbindungen unbegrenzt Ressourcen (Speicher, Datei-Deskriptoren) binden, bis ein Betriebssystem-Timeout oder Ressourcenlimit eingreift — ein schleichendes, oft spät entdecktes Problem.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Server-Ressourcen (offene Verbindungen) wachsen unbegrenzt | fehlender Heartbeat, tote Verbindungen werden nicht erkannt/geschlossen | Anzahl offener Verbindungen gegen tatsächlich aktive Clients vergleichen |
| Reconnect-Sturm nach kurzem Serverausfall | Client-Reconnect ohne Backoff/Jitter | zeitliche Verteilung der Reconnect-Versuche nach Ausfall analysieren |
| Nachricht an einen Client kommt nie an | falsche Server-Instanz hält die Verbindung, keine Pub/Sub-Verteilung | prüfen, ob die sendende Instanz Zugriff auf die tatsächliche Verbindung des Ziel-Clients hat |
| Nachrichten gehen während eines kurzen Verbindungsabbruchs verloren | fehlende Nachrichten-Bestätigung/Wiederholung nach Reconnect | Nachrichtenreihenfolge/-vollständigkeit nach simuliertem Reconnect prüfen |

Security: eine WebSocket-Verbindung sollte bei Verbindungsaufbau authentifiziert werden und diese Authentifizierung über die gesamte Verbindungsdauer gültig bleiben — ein zwischenzeitlicher Berechtigungsentzug erfordert eine explizite Prüfung oder erzwungene Trennung, da die Verbindung sonst mit der ursprünglichen Berechtigung weiterläuft. Observability: Verbindungsanzahl, Heartbeat-Erfolgsrate und Reconnect-Häufigkeit pro Server-Instanz sind zentrale Metriken für WebSocket-Infrastruktur.

## Trade-offs und Entscheidungen

**Staff** implementiert Heartbeat und Backoff-basierten Reconnect als Standardbestandteil jeder WebSocket-Integration. **Principal** entscheidet zwischen Sticky-Session- und Pub/Sub-basierter Skalierungsstrategie anhand der erwarteten Nachrichten-Fanout-Muster. **Chief** legt einen einheitlichen Skalierungsstandard für zustandsbehaftete WebSocket-Dienste über das Portfolio fest.

Anti-Patterns: WebSocket-Verbindungen ohne Heartbeat betreiben, wodurch tote Verbindungen unbemerkt Ressourcen binden; Client-Reconnect ohne Backoff, was Reconnect-Stürme erzeugt; horizontale Skalierung ohne Plan, wie eine Nachricht die richtige Server-Instanz erreicht.

## Production Checklist

- [ ] Heartbeat (Ping/Pong) mit definiertem Intervall und Timeout implementiert.
- [ ] Client-Reconnect nutzt Backoff mit Jitter.
- [ ] Horizontale Skalierungsstrategie (Sticky Sessions oder Pub/Sub) explizit gewählt und implementiert.
- [ ] Authentifizierung bleibt über die Verbindungsdauer gültig, mit Prüfung bei Berechtigungsänderung.

## Interviewfragen

### 1. Warum reicht TCP allein nicht, um eine tote WebSocket-Verbindung zu erkennen?

**Antwort:** TCP kann eine unterbrochene Verbindung oft erst nach langen internen Timeouts erkennen; ein Anwendungs-Heartbeat (Ping/Pong) macht die Verbindungsgesundheit explizit und zeitnah prüfbar.

### 2. Was passiert bei fehlendem Backoff im Client-Reconnect?

**Antwort:** Nach einem kurzen Serverausfall versuchen alle Clients gleichzeitig, sofort erneut zu verbinden, was einen synchronisierten Reconnect-Sturm erzeugt, der den gerade erst wiederhergestellten Server erneut überlasten kann.

### 3. Was ist der Unterschied zwischen Sticky-Session- und Pub/Sub-basierter WebSocket-Skalierung?

**Antwort:** Bei Sticky Sessions bleibt ein Client an einer bestimmten Server-Instanz; bei Pub/Sub-Verteilung kann jede Instanz eine Nachricht über ein zentrales Messaging-System an die Instanz weiterleiten, die die tatsächliche Verbindung des Ziel-Clients hält.

### 4. Warum ist eine offene WebSocket-Verbindung ressourcenintensiver als eine einzelne HTTP-Anfrage?

**Antwort:** Sie bindet Server-Ressourcen (Speicher, Datei-Deskriptor) über ihre gesamte Lebensdauer, während eine HTTP-Anfrage nach Beantwortung sofort keine Ressourcen mehr belegt.

### 5. Wie behandelst du einen zwischenzeitlichen Berechtigungsentzug bei einer langlebigen WebSocket-Verbindung?

**Antwort:** Durch periodische erneute Autorisierungsprüfung oder ein explizites Signal, das eine erzwungene Trennung der Verbindung auslöst, sobald die Berechtigung entzogen wird — sonst läuft die Verbindung mit der ursprünglichen, veralteten Berechtigung weiter.

### 6. Widersprüchliche Anforderung: Produkt will beliebig viele gleichzeitige WebSocket-Clients UND garantierte Nachrichtenzustellung bei jedem einzelnen Server-Neustart — wie gehst du vor?

**Antwort:** Ich würde erklären, dass ein Server-Neustart bestehende Verbindungen zwangsläufig trennt; garantierte Zustellung erfordert clientseitiges Reconnect mit Nachrichtenbestätigung/Wiederholung nach Wiederverbindung, statt Zustellung während der Unterbrechung selbst zu garantieren — die beiden Ziele sind nur mit diesem Kompromiss vereinbar.

## Praktische Labs

~~~python
import time

class Connection:
    def __init__(self):
        self.last_pong = time.monotonic()

    def receive_pong(self):
        self.last_pong = time.monotonic()

    def is_alive(self, timeout=30):
        return (time.monotonic() - self.last_pong) < timeout

conn = Connection()
conn.last_pong -= 40  # simulate 40 seconds since last pong
assert conn.is_alive(timeout=30) is False
print("Connection with no recent pong correctly identified as dead, despite the underlying socket appearing open.")
~~~

## Dependencies, Cross-References und Quellen

1. IETF: [RFC 6455: The WebSocket Protocol](https://datatracker.ietf.org/doc/html/rfc6455), abgerufen 2026-09-17.

Framework-/Infrastruktur-spezifische WebSocket-Skalierungs-Tooling-Details vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| WebTransport als Alternative zu WebSockets über QUIC | Emerging | Browser-/Infrastruktur-Unterstützung vor Migration von WebSockets sorgfältig prüfen. |
| Verwaltete WebSocket-Gateway-Dienste mit eingebauter horizontaler Skalierung | Established | Tatsächliches Pub/Sub-Verteilungsverhalten unter Last vor Vertrauen testen. |

Ein Team akzeptiert eine WebSocket-Implementierung erst, wenn Heartbeat-Erkennung toter Verbindungen, Backoff-Reconnect und horizontale Skalierungsstrategie nachweisbar getestet sind.
