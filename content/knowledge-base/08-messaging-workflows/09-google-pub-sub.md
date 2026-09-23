---
{"id": "KB-0185", "title": "Google Pub/Sub", "domain": "08", "sequence": 9, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE"], "requires": [{"id": "KB-0178", "concepts": ["Zustellsemantik"], "needed_for": "both"}, {"id": "KB-0182", "concepts": ["Visibility/Ack-Konzept"], "needed_for": "understanding"}], "related": ["KB-0184", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ack-Deadline-Verhalten mit Pull-Subscription lokal simulieren und eine Redelivery nach abgelaufener Deadline zeigen.", "rationale": "Kein echtes GCP-Konto nötig, um die Kernmechanik zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Pull- versus Push-Subscription-Modell und Ack-Deadline-Dimensionierung für einen konkreten Verarbeitungsfall entwerfen.", "rationale": "Beide Zustellmodelle haben unterschiedliche Kontroll- und Skalierungscharakteristika."}, "STAFF-TARGET": {"active": true, "scope": "Doppelte Verarbeitung auf eine zu kurze Ack-Deadline bei einer Pull-Subscription zurückführen.", "rationale": "Dasselbe Grundmuster wie SQS Visibility Timeout, mit Pub/Sub-spezifischer Terminologie."}, "CHIEF-TARGET": {"active": true, "scope": "Google Pub/Sub als GCP-natives Standardmuster für Ereignisverteilung mit Bewusstsein für At-least-once-Semantik positionieren.", "rationale": "Pub/Sub garantiert standardmäßig At-least-once, nicht Exactly-once, was Architekturentscheidungen prägt."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Pub/Sub Exactly-once-Delivery-Feature und Ordering Keys im Detail sind Vertiefung.", "rationale": "Kern ist Pull/Push-Unterscheidung und Ack-Deadline-Mechanik."}}, "lab_validation": [{"lab_id": "KB-0185-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Ack-Deadline mit Pull-Subscription", "evidence": "Eine Nachricht, deren Ack-Deadline während der Verarbeitung abläuft, wird korrekt erneut zur Zustellung verfügbar, was ohne Idempotenz zu doppelter Verarbeitung führt.", "limitations": "Kein echtes GCP-Konto, keine Produktion."}]}
---
# Google Pub/Sub

> **Ziel:** Google Pub/Sub bietet zwei Zustellmodelle — Pull (der Subscriber fragt aktiv Nachrichten ab, volle Kontrolle über Verarbeitungstempo) und Push (Pub/Sub sendet Nachrichten aktiv an einen HTTP-Endpunkt). Beide teilen dasselbe Ack-Deadline-Prinzip wie SQS' Visibility Timeout ([KB-0182](06-amazon-sqs-und-sns.md)): läuft die Deadline ab, bevor eine Nachricht bestätigt wird, wird sie erneut zugestellt.

## Zweck, Mental Model und Dependencies

Bei Pull-Subscriptions kontrolliert der Subscriber aktiv, wann und wie viele Nachrichten er abholt — das erlaubt feingranulare Kontrolle über Verarbeitungstempo und Batch-Größe. Bei Push-Subscriptions sendet Pub/Sub Nachrichten proaktiv an einen konfigurierten HTTP-Endpunkt, was die Client-Implementierung vereinfacht, aber Kontrolle über den Zustellzeitpunkt an Pub/Sub abgibt. Beide Modelle teilen dasselbe Ack-Deadline-Konzept: eine zugestellte, aber nicht bestätigte Nachricht wird nach Ablauf der Deadline erneut zugestellt — Pub/Sub garantiert standardmäßig At-least-once, nicht Exactly-once. Lies [KB-0178](02-zustellsemantik-und-verarbeitungsgarantien.md) und [KB-0182](06-amazon-sqs-und-sns.md).

~~~text
Pull:  Subscriber actively calls pull() -> gets messages -> processes -> explicitly ack()
Push:  Pub/Sub POSTs message to configured HTTP endpoint -> endpoint returns 2xx to ack, non-2xx triggers redelivery
Both:  ack_deadline expires before ack -> message redelivered -> requires idempotent processing
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Pull | Push |
|---|---|---|
| Kontrolle | Subscriber steuert Tempo/Batch-Größe | Pub/Sub steuert Zustellzeitpunkt |
| Skalierung | Subscriber skaliert durch mehr Pull-Worker | Endpunkt muss eingehende Last selbst bewältigen |
| Ack-Mechanismus | explizites ack() nach Verarbeitung | HTTP-2xx-Antwort als Ack |
| Fehlerbehandlung | expliziter nack() oder Ack-Deadline-Ablauf | Non-2xx-Antwort löst Redelivery aus |

Implementierung: die Ack-Deadline wird deutlich über der gemessenen P99-Verarbeitungsdauer dimensioniert, mit der Möglichkeit, sie bei länger laufender Verarbeitung über `modifyAckDeadline` zu verlängern. Consumer werden konsequent idempotent implementiert, da At-least-once die Standardgarantie ist. Für Push-Subscriptions wird der HTTP-Endpunkt so dimensioniert, dass er die tatsächliche eingehende Nachrichtenrate bewältigen kann, da Pub/Sub bei Überlastung mit Backoff retryt. Für Anwendungsfälle mit Ordnungsbedarf werden Ordering Keys genutzt, die Nachrichten mit demselben Key in Reihenfolge zustellen.

## Scalability, Reliability, Security und Observability

Pull-Subscriptions skalieren durch Hinzufügen weiterer Pull-Worker, die unabhängig ihr eigenes Verarbeitungstempo steuern. Reliability-Grenze: dasselbe Muster wie bei SQS — eine zu kurz dimensionierte Ack-Deadline führt zu Redelivery während laufender Verarbeitung und damit zu doppelter Verarbeitung ohne ausreichende Idempotenz.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Nachricht wird doppelt verarbeitet | Ack-Deadline kürzer als tatsächliche Verarbeitungsdauer | P99-Verarbeitungsdauer gegen konfigurierte Ack-Deadline vergleichen |
| Push-Endpunkt überlastet bei Lastspitzen | Endpunkt-Kapazität nicht für tatsächliche Nachrichtenrate dimensioniert | Endpunkt-Latenz/Fehlerrate unter simulierter Lastspitze messen |
| Nachrichten kommen in falscher Reihenfolge an | fehlende Nutzung von Ordering Keys für einen Anwendungsfall mit Reihenfolgebedarf | prüfen, ob zusammengehörige Nachrichten denselben Ordering Key tragen |
| Redelivery trotz erfolgreicher Verarbeitung | Ack ging verloren oder wurde zu spät gesendet | Zeitpunkt des Ack-Aufrufs gegen Ack-Deadline-Ablauf prüfen |

Security: Pub/Sub-Zugriff über IAM sollte granular pro Topic/Subscription konfiguriert werden; Push-Endpunkte sollten eingehende Anfragen gegen ein erwartetes Authentifizierungstoken (Pub/Sub-signiertes JWT) validieren, um Fälschung zu verhindern. Observability: `num_undelivered_messages` und `oldest_unacked_message_age` sind zentrale Cloud-Monitoring-Metriken zur Erkennung von Verarbeitungsverzögerungen.

## Trade-offs und Entscheidungen

**Staff** dimensioniert Ack-Deadlines anhand gemessener Verarbeitungsdauer, mit dynamischer Verlängerung bei Bedarf. **Principal** wählt zwischen Pull (feingranulare Kontrolle) und Push (einfachere Client-Implementierung) je nach Verarbeitungsanforderung. **Chief** kommuniziert die At-least-once-Standardgarantie als Grundannahme, die konsequente Idempotenz erfordert.

Anti-Patterns: Ack-Deadline ohne Bezug zur tatsächlichen Verarbeitungsdauer konfigurieren; Push-Endpunkt ohne Authentifizierungsprüfung der eingehenden Anfragen betreiben; Consumer ohne Idempotenz implementieren, obwohl At-least-once die Standardgarantie ist.

## Production Checklist

- [ ] Ack-Deadline deutlich über gemessener P99-Verarbeitungsdauer dimensioniert, mit dynamischer Verlängerung bei Bedarf.
- [ ] Consumer implementiert Idempotenz, unabhängig von der Zustellgarantie.
- [ ] Push-Endpunkte validieren Authentifizierung eingehender Anfragen.
- [ ] Ordering Keys genutzt für Anwendungsfälle mit Reihenfolgebedarf.

## Interviewfragen

### 1. Was ist der Unterschied zwischen Pull- und Push-Subscriptions?

**Antwort:** Bei Pull fragt der Subscriber aktiv Nachrichten ab und steuert das Tempo; bei Push sendet Pub/Sub Nachrichten proaktiv an einen konfigurierten HTTP-Endpunkt, der die Last selbst bewältigen muss.

### 2. Was passiert bei einer zu kurz dimensionierten Ack-Deadline?

**Antwort:** Eine Nachricht wird während laufender Verarbeitung erneut zugestellt, was ohne Idempotenz zu doppelter Verarbeitung führt — analog zum SQS-Visibility-Timeout-Problem.

### 3. Welche Zustellgarantie bietet Google Pub/Sub standardmäßig?

**Antwort:** At-least-once — eine Nachricht kann dupliziert, aber nicht verloren werden, was konsequente Consumer-seitige Idempotenz erfordert.

### 4. Wie authentifiziert sich Pub/Sub gegenüber einem Push-Endpunkt?

**Antwort:** Über ein signiertes JWT, das der Push-Endpunkt validieren sollte, um sicherzustellen, dass eingehende Anfragen tatsächlich von Pub/Sub stammen und nicht gefälscht sind.

### 5. Was sind Ordering Keys und wofür werden sie genutzt?

**Antwort:** Ein Schlüssel, der zusammengehörige Nachrichten markiert, die dann garantiert in der gesendeten Reihenfolge zugestellt werden, ähnlich einer Partition oder Session bei anderen Brokern.

### 6. Widersprüchliche Anforderung: Team will einfache Client-Implementierung (Push) UND volle Kontrolle über Verarbeitungstempo bei Lastspitzen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass Push die Kontrolle über den Zustellzeitpunkt an Pub/Sub abgibt; für volle Tempo-Kontrolle bei Lastspitzen wäre Pull mit eigener Worker-Skalierungslogik die bessere Wahl, auch wenn das etwas mehr Implementierungsaufwand bedeutet.

## Praktische Labs

~~~python
import time

class PubSubMessage:
    def __init__(self, ack_deadline):
        self.ack_deadline = ack_deadline
        self.delivered_at = time.monotonic()
        self.acked = False

    def ack(self):
        self.acked = True

    def needs_redelivery(self):
        if self.acked:
            return False
        return (time.monotonic() - self.delivered_at) > self.ack_deadline

msg = PubSubMessage(ack_deadline=0.1)
time.sleep(0.2)  # processing takes longer than the ack deadline
assert msg.needs_redelivery() is True
print("Message exceeded its ack deadline before acknowledgment - redelivery and potential duplicate processing risk.")
~~~

## Dependencies, Cross-References und Quellen

1. Google Cloud: [Pub/Sub Subscriber Overview](https://cloud.google.com/pubsub/docs/subscriber), abgerufen 2026-09-17.
2. Google Cloud: [Push Subscriptions](https://cloud.google.com/pubsub/docs/push), abgerufen 2026-09-17.

GCP-Pub/Sub-Preisdetails und Feature-Limits vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Pub/Sub Exactly-once Delivery Feature | Established, mit dokumentierten Einschränkungen | Tatsächliche Einschränkungen (z. B. Interaktion mit Ordering Keys) vor Vertrauen genau prüfen. |

Ein Team akzeptiert eine Pub/Sub-Implementierung erst, wenn Ack-Deadline-Dimensionierung und Consumer-Idempotenz nachweisbar getestet sind.
