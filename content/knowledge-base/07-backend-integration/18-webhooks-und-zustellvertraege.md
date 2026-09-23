---
{"id": "KB-0170", "title": "Webhooks und Zustellverträge", "domain": "07", "sequence": 18, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "STAFF"], "requires": [{"id": "KB-0113", "concepts": ["Idempotenz"], "needed_for": "both"}, {"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}], "related": ["KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Webhook-Empfänger mit Signaturprüfung, Replay-Schutz und Idempotenz lokal implementieren.", "rationale": "Kein echter externer Sender nötig, um das Empfängervertragsverhalten zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Zustellversuche, Empfangsquittungen, Reihenfolgegarantien und Dead-Letter-Verhalten für Webhook-Empfänger entwerfen.", "rationale": "Webhooks sind unzuverlässiges Best-Effort-Messaging über HTTP, nicht ein garantiertes Zustellprotokoll."}, "STAFF-TARGET": {"active": true, "scope": "Eine doppelte Verarbeitung auf fehlende Idempotenz beim Webhook-Empfang zurückführen.", "rationale": "Webhook-Sender retryen bei ausbleibender Quittung, was ohne Idempotenz Duplikate erzeugt."}, "CHIEF-TARGET": {"active": true, "scope": "Signaturprüfung und Replay-Schutz als Pflichtstandard für alle Webhook-Endpunkte festlegen.", "rationale": "Ein ungeprüfter Webhook-Endpunkt ist ein direkter Angriffsvektor für gefälschte Ereignisse."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Webhook-Aggregations-/Relay-Dienste für Multi-Consumer-Szenarien im Detail sind Vertiefung.", "rationale": "Kern ist der sichere, idempotente Einzelempfänger-Vertrag."}}, "lab_validation": [{"lab_id": "KB-0170-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Webhook-Signaturprüfung und Idempotenz", "evidence": "Ein Webhook mit manipulierter Signatur wird abgelehnt; ein doppelt zugestelltes, identisches Ereignis wird dank Idempotenzschlüssel nur einmal verarbeitet.", "limitations": "Kein echter externer Sender, keine Produktion."}]}
---
# Webhooks und Zustellverträge

> **Ziel:** Ein Webhook ist ein HTTP-Callback, über den ein externer Sender Ereignisse an einen Empfänger-Endpunkt zustellt — Best-Effort, ohne die Zustellgarantien eines dedizierten Message-Brokers. Der Empfänger muss selbst für Signaturprüfung (Echtheit), Replay-Schutz (keine böswillige Wiederholung), Idempotenz (kein doppelter Effekt bei Sender-Retry) und Dead-Letter-Verhalten (was passiert bei dauerhaftem Verarbeitungsfehler) sorgen.

## Zweck, Mental Model und Dependencies

Ein Webhook-Sender ruft bei einem Ereignis den vom Empfänger konfigurierten HTTP-Endpunkt auf; bleibt eine erfolgreiche Antwort aus (Timeout, 5xx), retryt der Sender typischerweise mit Backoff — was ohne Idempotenz ([KB-0113](../05-distributed-systems/13-idempotenz-als-systemgarantie.md)) zu doppelter Verarbeitung führt. Da der Endpunkt öffentlich erreichbar sein muss, ist eine Signaturprüfung (der Sender signiert die Payload mit einem gemeinsamen Secret, der Empfänger verifiziert diese Signatur) essenziell, um gefälschte Ereignisse von echten zu unterscheiden. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0113](../05-distributed-systems/13-idempotenz-als-systemgarantie.md).

~~~text
Sender: POST /webhook {event: "order.paid", id: "evt_123"} + Header: X-Signature: HMAC(payload, shared_secret)
Receiver: verify signature -> check event id "evt_123" against processed-events store -> process once -> 200 OK
Sender retries with backoff if no 200 received within timeout -> receiver's idempotency check prevents duplicate effect
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Signaturprüfung | wird jede eingehende Payload gegen das Secret verifiziert? | gefälschte Ereignisse werden unbemerkt akzeptiert |
| Replay-Schutz | wird ein Zeitstempel/Nonce gegen Wiedereinspielung geprüft? | eine abgefangene, alte gültige Signatur wird erneut akzeptiert |
| Idempotenz | wird die Ereignis-ID gegen bereits verarbeitete Ereignisse geprüft? | Sender-Retry erzeugt doppelte Verarbeitung |
| Empfangsquittung | schnelle 200-Antwort vor oder nach vollständiger Verarbeitung? | langsame synchrone Verarbeitung löst unnötige Sender-Retries aus |
| Dead Letter | was passiert nach wiederholt fehlgeschlagener Verarbeitung? | Ereignis geht nach Erschöpfung der Sender-Retries stillschweigend verloren |

Implementierung: jede eingehende Anfrage wird zuerst gegen die Signatur verifiziert, bevor die Payload überhaupt interpretiert wird. Ein Zeitstempel im signierten Payload wird gegen ein Toleranzfenster geprüft, um Replay einer alten, abgefangenen Anfrage zu verhindern. Die Ereignis-ID wird gegen einen Store bereits verarbeiteter Ereignisse geprüft (Idempotenz); der Empfänger antwortet schnell mit 200, sobald das Ereignis sicher zur asynchronen Verarbeitung angenommen wurde, statt die vollständige, potenziell langsame Verarbeitung synchron abzuwarten. Nach Erschöpfung eigener Verarbeitungsversuche wird ein Ereignis in eine Dead-Letter-Ablage verschoben, nicht stillschweigend verworfen.

## Scalability, Reliability, Security und Observability

Schnelle Empfangsquittung (200 vor vollständiger Verarbeitung) skaliert den Empfänger, da Webhook-Sender oft ein enges Timeout-Fenster haben und bei Überschreitung erneut zustellen, was unnötige Last erzeugt. Reliability-Grenze: Webhooks bieten keine garantierte Reihenfolge — ein Empfänger, der Reihenfolge annimmt (z. B. „order.created" muss vor „order.paid" ankommen), kann durch Netzwerkverzögerungen oder Sender-Retries eine falsche Reihenfolge erleben und muss das explizit behandeln.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| doppelte Verarbeitung desselben Geschäftsereignisses | fehlende Idempotenzprüfung, Sender-Retry nach Timeout | Ereignis-ID-Store auf tatsächliche Duplikatserkennung prüfen |
| gefälschte Ereignisse werden akzeptiert | fehlende oder fehlerhafte Signaturprüfung | Signaturverifikationslogik gegen manipulierte Payload testen |
| Ereignisse kommen in unerwarteter Reihenfolge an | Annahme garantierter Reihenfolge bei einem Best-Effort-Protokoll | Verarbeitungslogik auf Reihenfolgeunabhängigkeit/explizite Sequenzprüfung untersuchen |
| Ereignisse verschwinden nach wiederholtem Verarbeitungsfehler | fehlende Dead-Letter-Ablage | prüfen, ob fehlgeschlagene Ereignisse irgendwo persistiert statt verworfen werden |

Security: Signaturprüfung und Replay-Schutz sind nicht optional, da ein öffentlich erreichbarer Webhook-Endpunkt sonst ein direkter Angriffsvektor für gefälschte Geschäftsereignisse ist (z. B. gefälschte „payment.succeeded"-Ereignisse). Observability: Metriken zu Signaturfehlern, Duplikaterkennung und Dead-Letter-Rate zeigen sowohl Angriffsversuche als auch Zuverlässigkeitsprobleme des Senders.

## Trade-offs und Entscheidungen

**Staff** implementiert Signaturprüfung, Idempotenz und schnelle Quittung als Standardbestandteil jedes Webhook-Empfängers. **Principal** definiert, wie Dead-Letter-Ereignisse überwacht und nachbearbeitet werden. **Chief** verlangt Signaturprüfung als nicht verhandelbaren Sicherheitsstandard für alle Webhook-Endpunkte.

Anti-Patterns: Webhook-Payloads ohne Signaturprüfung verarbeiten; synchrone, langsame Verarbeitung vor der Quittungsantwort, was unnötige Sender-Retries auslöst; garantierte Reihenfolge annehmen, ohne sie explizit durchzusetzen oder tolerant zu behandeln; fehlgeschlagene Ereignisse stillschweigend verwerfen statt in eine Dead-Letter-Ablage zu verschieben.

## Production Checklist

- [ ] Jede eingehende Webhook-Anfrage wird gegen eine Signatur verifiziert.
- [ ] Replay-Schutz über Zeitstempel-/Nonce-Prüfung implementiert.
- [ ] Idempotenz über Ereignis-ID-Deduplizierung sichergestellt.
- [ ] Schnelle Quittungsantwort, asynchrone Verarbeitung, Dead-Letter-Ablage für endgültig fehlgeschlagene Ereignisse.

## Interviewfragen

### 1. Warum ist Signaturprüfung bei Webhook-Empfängern unverzichtbar?

**Antwort:** Der Endpunkt ist öffentlich erreichbar; ohne Signaturprüfung könnte jeder beliebige Absender gefälschte, aber scheinbar legitime Geschäftsereignisse einspielen.

### 2. Warum retryt ein Webhook-Sender, und was bedeutet das für den Empfänger?

**Antwort:** Bleibt eine erfolgreiche Quittung aus, nimmt der Sender an, die Zustellung sei fehlgeschlagen, und versucht es erneut — der Empfänger muss daher idempotent sein, um doppelte Verarbeitung zu vermeiden.

### 3. Warum garantieren Webhooks keine Reihenfolge?

**Antwort:** Sie laufen über unabhängige HTTP-Anfragen, die durch Netzwerkverzögerungen oder Retries in unterschiedlicher Reihenfolge beim Empfänger ankommen können; garantierte Reihenfolge müsste explizit durch Sequenznummern und entsprechende Empfängerlogik sichergestellt werden.

### 4. Warum sollte die Quittungsantwort schnell erfolgen, bevor die vollständige Verarbeitung abgeschlossen ist?

**Antwort:** Viele Sender haben ein enges Timeout-Fenster; eine langsame synchrone Verarbeitung kann dieses Fenster überschreiten und unnötige, redundante Retries auslösen.

### 5. Was passiert bei einem Ereignis, das dauerhaft nicht verarbeitet werden kann?

**Antwort:** Es sollte in eine Dead-Letter-Ablage verschoben werden, die eine spätere manuelle oder automatisierte Nachbearbeitung ermöglicht, statt stillschweigend verloren zu gehen.

### 6. Widersprüchliche Anforderung: Externer Partner will minimale Latenz bei der Webhook-Quittung UND garantierte vollständige Verarbeitung vor Bestätigung — wie gehst du vor?

**Antwort:** Ich würde eine schnelle Quittung nach sicherer Annahme des Ereignisses (z. B. Persistierung in eine Verarbeitungsqueue) von der eigentlichen, potenziell langsameren asynchronen Verarbeitung trennen — das erfüllt niedrige Latenz und vollständige, garantierte Verarbeitung gleichzeitig, ohne beide Anforderungen gegeneinander auszuspielen.

## Praktische Labs

~~~python
import hmac, hashlib

secret = b"shared-secret"
processed_events = set()

def verify_signature(payload, signature):
    expected = hmac.new(secret, payload.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)

def receive_webhook(payload, signature, event_id):
    if not verify_signature(payload, signature):
        return 401, "invalid signature"
    if event_id in processed_events:
        return 200, "already processed (idempotent)"
    processed_events.add(event_id)
    return 200, "processed"

payload = '{"event":"order.paid","id":"evt_123"}'
valid_sig = hmac.new(secret, payload.encode(), hashlib.sha256).hexdigest()

status1, msg1 = receive_webhook(payload, valid_sig, "evt_123")
status2, msg2 = receive_webhook(payload, valid_sig, "evt_123")  # sender retry
status3, msg3 = receive_webhook(payload, "forged-signature", "evt_123")

assert status1 == 200 and "processed" in msg1
assert status2 == 200 and "already processed" in msg2
assert status3 == 401
print("Signature verification and idempotency both worked correctly:", msg1, "|", msg2, "|", msg3)
~~~

## Dependencies, Cross-References und Quellen

1. Stripe: [Webhooks](https://stripe.com/docs/webhooks), abgerufen 2026-09-17 (als praxisnahe Referenzimplementierung für Signaturprüfung).

Anbieterspezifische Signaturformate und Retry-Verhalten vor Integration an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Webhook-Relay-/Aggregationsdienste mit eingebauter Signaturweiterleitung und Retry-Historie | Established | Vertrauensgrenze gegenüber dem Relay-Dienst selbst explizit bewerten. |

Ein Team akzeptiert eine Webhook-Empfängerimplementierung erst, wenn Signaturprüfung, Idempotenz und Dead-Letter-Verhalten nachweisbar getestet sind.
