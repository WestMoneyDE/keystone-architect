---
{"id": "KB-0178", "title": "Zustellsemantik und Verarbeitungsgarantien", "domain": "08", "sequence": 2, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL"], "requires": [{"id": "KB-0113", "concepts": ["Idempotenz"], "needed_for": "both"}, {"id": "KB-0177", "concepts": ["Queue", "Log"], "needed_for": "understanding"}], "related": ["KB-0179", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "At-least-once-Zustellung mit Idempotenz kombinieren, um effektiv Exactly-once-Verarbeitung zu erreichen, lokal implementieren.", "rationale": "Kein echter Broker nötig, um das Kernprinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Für einen Verarbeitungspfad mit externen Seiteneffekten die tatsächlich erreichbare Garantie (nicht die beworbene) analysieren.", "rationale": "'Exactly-once' ist oft nur für die Broker-interne Verarbeitung garantiert, nicht für externe Seiteneffekte."}, "STAFF-TARGET": {"active": true, "scope": "Eine doppelte externe Aktion (z. B. doppelte E-Mail) trotz 'Exactly-once'-Broker-Konfiguration auf einen nicht-idempotenten externen Seiteneffekt zurückführen.", "rationale": "Das ist ein häufiges Missverständnis über die Reichweite von Exactly-once-Garantien."}, "CHIEF-TARGET": {"active": true, "scope": "Realistische Zustellsemantik-Erwartungen (At-least-once plus Idempotenz statt naivem Exactly-once-Vertrauen) als Standard kommunizieren.", "rationale": "Überzogene Erwartungen an Exactly-once-Garantien führen zu unentdeckten Produktionsfehlern."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Transaktionale Outbox- und Zwei-Phasen-Commit-Integration mit Brokern im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis der drei Grundsemantiken und ihrer Grenzen bei externen Seiteneffekten."}}, "lab_validation": [{"lab_id": "KB-0178-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für At-least-once-Zustellung mit externem, nicht-idempotentem Seiteneffekt", "evidence": "Eine simulierte doppelte Zustellung derselben Nachricht löst ohne Idempotenzschutz zweimal einen externen Seiteneffekt (z. B. E-Mail-Versand) aus, trotz 'garantierter' Verarbeitung.", "limitations": "Kein echter Broker, keine Produktion."}]}
---
# Zustellsemantik und Verarbeitungsgarantien

> **Ziel:** At-most-once (Nachricht wird höchstens einmal zugestellt, kann verloren gehen), At-least-once (Nachricht wird mindestens einmal zugestellt, kann dupliziert werden) und Exactly-once (Nachricht wird genau einmal verarbeitet) beschreiben unterschiedliche Garantien. Der entscheidende praktische Punkt: eine „Exactly-once"-Garantie eines Brokers bezieht sich meist nur auf die interne Verarbeitung — externe Seiteneffekte (E-Mail-Versand, externe API-Aufrufe) außerhalb der Broker-Transaktion können trotzdem dupliziert werden, wenn sie nicht separat idempotent gemacht werden.

## Zweck, Mental Model und Dependencies

At-most-once ist die einfachste, aber riskanteste Garantie — eine Nachricht wird gesendet und bei Fehler nicht erneut versucht, was Datenverlust bei Fehlern in Kauf nimmt. At-least-once retryt bei ausbleibender Bestätigung, garantiert also, dass eine Nachricht nicht verloren geht, aber möglicherweise dupliziert wird — dies ist die häufigste praktische Garantie und erfordert Idempotenz ([KB-0113](../05-distributed-systems/13-idempotenz-als-systemgarantie.md)) beim Consumer. Exactly-once ist am schwierigsten zu erreichen und wird oft durch eine Kombination aus At-least-once-Zustellung plus deduplizierender Idempotenz auf Consumer-Seite simuliert, statt eine echte, separate Garantie zu sein. Lies [KB-0113](../05-distributed-systems/13-idempotenz-als-systemgarantie.md) und [KB-0177](01-queues-und-logs-im-vergleich.md).

~~~text
At-most-once:  send -> no retry on failure -> message may be LOST
At-least-once: send -> retry until ack -> message may be DUPLICATED
"Exactly-once" (practical): At-least-once delivery + idempotent consumer processing = effective exactly-once EFFECT
                             BUT external side effects (email, external API) outside the broker's transaction
                             can still be duplicated unless separately made idempotent.
~~~

## Core Concepts, Architektur und Implementierung

| Garantie | Verhalten | Consumer-Anforderung |
|---|---|---|
| At-most-once | keine Wiederholung, mögliche Verluste | akzeptabel nur bei unkritischen Daten |
| At-least-once | Wiederholung bis Bestätigung, mögliche Duplikate | Idempotenz zwingend erforderlich |
| „Exactly-once" | broker-interne Garantie, oft At-least-once + Idempotenz | externe Seiteneffekte brauchen separate Idempotenzprüfung |

Implementierung: der Consumer wird konsequent idempotent implementiert (Deduplizierung über Nachrichten-ID, ähnlich [KB-0113](../05-distributed-systems/13-idempotenz-als-systemgarantie.md)), unabhängig davon, welche Garantie der Broker verspricht — das macht das System robust gegen die praktische Realität von At-least-once. Für externe Seiteneffekte (die außerhalb der Broker-eigenen Transaktion liegen, z. B. ein externer API-Aufruf oder E-Mail-Versand) wird eine separate Idempotenzprüfung implementiert, da eine „Exactly-once"-Garantie des Brokers diese externen Effekte nicht automatisch mit abdeckt.

## Scalability, Reliability, Security und Observability

At-least-once mit konsequenter Idempotenz skaliert robust über verteilte, fehleranfällige Systeme, da es die Realität von Netzwerkfehlern und Retries pragmatisch akzeptiert statt eine unrealistische Garantie zu versprechen. Reliability-Grenze: ein Team, das „Exactly-once" wörtlich nimmt und keine Idempotenz für externe Seiteneffekte implementiert, erlebt reale Duplikate (doppelte E-Mails, doppelte Zahlungen), die scheinbar der beworbenen Garantie widersprechen, tatsächlich aber deren Reichweitengrenze zeigen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| doppelte E-Mail/externe Aktion trotz „Exactly-once"-Broker | externer Seiteneffekt liegt außerhalb der Broker-Transaktionsgrenze, nicht separat idempotent gemacht | prüfen, ob der externe Aufruf einen eigenen Idempotenzschlüssel nutzt |
| Nachrichtenverlust bei Systemausfall | At-most-once-Semantik gewählt, wo At-least-once nötig gewesen wäre | Broker-Konfiguration auf Acknowledgment-/Retry-Verhalten prüfen |
| doppelte Verarbeitung trotz At-least-once erwartet | fehlende Consumer-seitige Idempotenzprüfung | Deduplizierungslogik im Consumer-Code auf tatsächliche Implementierung prüfen |
| Performance sinkt durch übermäßig strenge Exactly-once-Konfiguration | Exactly-once-Overhead für einen Anwendungsfall gewählt, der At-least-once + Idempotenz genügt hätte | Performance-Kosten der strengen Konfiguration gegen tatsächlichen Bedarf abwägen |

Security: eine unkontrollierte Duplizierung sicherheitsrelevanter Aktionen (z. B. doppelte Berechtigungsvergabe) kann zu inkonsistenten Sicherheitszuständen führen — Idempotenz ist hier auch eine Sicherheitsanforderung. Observability: Metriken zu erkannten Duplikaten (über die Idempotenzprüfung) zeigen die tatsächliche Häufigkeit von Redelivery-Ereignissen und sind ein Gesundheitsindikator für das Gesamtsystem.

## Trade-offs und Entscheidungen

**Staff** implementiert Consumer-seitige Idempotenz konsequent, unabhängig von der beworbenen Broker-Garantie. **Principal** identifiziert externe Seiteneffekte, die außerhalb der Broker-Transaktionsgrenze liegen, und sichert sie separat ab. **Chief** kommuniziert realistische Erwartungen (At-least-once + Idempotenz statt naivem Exactly-once-Vertrauen) als Standard über das gesamte Portfolio.

Anti-Patterns: „Exactly-once" als absolute Garantie ohne Rücksicht auf externe Seiteneffekte verstehen; At-most-once für kritische, nicht verlustfähige Daten wählen; Consumer ohne Idempotenzprüfung implementieren, weil der Broker „Exactly-once" verspricht.

## Production Checklist

- [ ] Consumer implementiert Idempotenz unabhängig von der beworbenen Broker-Garantie.
- [ ] Externe Seiteneffekte außerhalb der Broker-Transaktionsgrenze sind separat idempotent gemacht.
- [ ] Gewählte Garantie (At-most/At-least/Exactly-once) ist bewusst für den jeweiligen Anwendungsfall begründet.
- [ ] Monitoring erkannter Duplikate zeigt tatsächliche Redelivery-Häufigkeit.

## Interviewfragen

### 1. Was ist der praktische Unterschied zwischen At-least-once und Exactly-once?

**Antwort:** At-least-once garantiert keinen Nachrichtenverlust, erlaubt aber Duplikate; „Exactly-once" ist meist eine Kombination aus At-least-once-Zustellung plus Consumer-seitiger Deduplizierung, keine grundlegend andere technische Garantie.

### 2. Warum kann eine externe E-Mail trotz „Exactly-once"-Broker-Konfiguration doppelt versendet werden?

**Antwort:** Der externe E-Mail-Versand liegt außerhalb der Transaktionsgrenze des Brokers; die Broker-Garantie deckt nur die interne Nachrichtenverarbeitung ab, nicht automatisch jeden externen Seiteneffekt.

### 3. Wann ist At-most-once akzeptabel?

**Antwort:** Nur für unkritische Daten, bei denen gelegentlicher Verlust tolerierbar ist und die zusätzliche Komplexität von Retry/Idempotenz den Aufwand nicht rechtfertigt.

### 4. Warum sollte ein Consumer immer idempotent implementiert werden, unabhängig von der Broker-Garantie?

**Antwort:** Weil At-least-once in der Praxis die häufigste tatsächliche Garantie ist und Duplikate real vorkommen; Idempotenz macht das System robust gegen diese Realität statt sich auf eine möglicherweise nicht vollständig zutreffende Garantie zu verlassen.

### 5. Wie sicherst du einen externen API-Aufruf innerhalb einer Nachrichtenverarbeitung ab?

**Antwort:** Über einen eigenen Idempotenzschlüssel für diesen externen Aufruf, unabhängig von der Nachrichten-ID des Brokers, damit ein Duplikat der Nachricht nicht automatisch zu einem doppelten externen Effekt führt.

### 6. Widersprüchliche Anforderung: Produkt will absolute Garantie gegen jede Duplizierung UND maximale Verarbeitungsgeschwindigkeit — wie gehst du vor?

**Antwort:** Ich würde erklären, dass eine echte, für jeden externen Seiteneffekt garantierte Exactly-once-Verarbeitung Koordinationsaufwand (Idempotenzprüfung, ggf. transaktionale Outbox) kostet; ich würde diesen Aufwand gezielt für kritische Effekte (Zahlungen) einsetzen und für unkritische Effekte eine pragmatischere, schnellere At-least-once-Verarbeitung ohne vollständige Duplikatsgarantie akzeptieren.

## Praktische Labs

~~~python
sent_emails = []
idempotency_store = set()

def send_email_naive(message_id, to):
    sent_emails.append((message_id, to))  # no dedup: every redelivery sends again

def send_email_idempotent(message_id, to):
    if message_id in idempotency_store:
        return  # already sent, skip
    idempotency_store.add(message_id)
    sent_emails.append((message_id, to))

# simulate at-least-once redelivery of the same message
send_email_naive("msg-1", "user@example.com")
send_email_naive("msg-1", "user@example.com")  # broker redelivered due to no ack
naive_count = len([e for e in sent_emails if e[0] == "msg-1"])

sent_emails.clear()
send_email_idempotent("msg-1", "user@example.com")
send_email_idempotent("msg-1", "user@example.com")
idempotent_count = len([e for e in sent_emails if e[0] == "msg-1"])

assert naive_count == 2 and idempotent_count == 1
print(f"Naive handler sent {naive_count} emails on redelivery; idempotent handler sent {idempotent_count}.")
~~~

## Dependencies, Cross-References und Quellen

1. Confluent: [Exactly-once Semantics are Possible: Here's How Apache Kafka Does it](https://www.confluent.io/blog/exactly-once-semantics-are-possible-heres-how-apache-kafka-does-it/), abgerufen 2026-09-17.

Produktspezifische Broker-Garantiedetails vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Transaktionale Outbox-Muster für konsistente Broker-Publikation mit lokaler Datenbanktransaktion | Established | Zusätzliche Betriebskomplexität gegen tatsächlichen Konsistenzbedarf abwägen. |

Ein Team akzeptiert eine Zustellsemantik-Implementierung erst, wenn Consumer-Idempotenz nachweislich getestet und externe Seiteneffekte separat idempotent abgesichert sind.
