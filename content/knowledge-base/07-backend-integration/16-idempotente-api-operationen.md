---
{"id": "KB-0168", "title": "Idempotente API-Operationen", "domain": "07", "sequence": 16, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0113", "concepts": ["Idempotenzschlüssel"], "needed_for": "both"}, {"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}], "related": ["KB-0167", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine API-Operation mit Idempotency-Key und konkurrierendem gleichzeitigem Request lokal implementieren.", "rationale": "Kein echtes Backend nötig, um Konflikt- und Wiederholungsverhalten zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Idempotency-Key-Handling inklusive Konfliktantworten für konkurrierende, unterschiedliche Requests mit demselben Key entwerfen.", "rationale": "Über die Grundmechanik aus KB-0113 hinaus braucht eine öffentliche API eine explizite Konfliktbehandlung."}, "STAFF-TARGET": {"active": true, "scope": "Eine 409-Conflict-Antwort auf einen wiederverwendeten Idempotency-Key mit abweichendem Payload zurückführen.", "rationale": "Das unterscheidet einen echten Retry von einem fehlerhaft wiederverwendeten Schlüssel."}, "CHIEF-TARGET": {"active": true, "scope": "Idempotency-Key-Unterstützung als Pflichtstandard für alle zustandsändernden öffentlichen API-Operationen mit Geldwert festlegen.", "rationale": "Fehlende Idempotenz bei öffentlichen APIs ist ein direktes Kundenrisiko bei Netzwerkfehlern."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Verteilte Idempotency-Key-Stores mit Replikation im Detail sind Vertiefung.", "rationale": "Kern ist API-Vertragsverhalten (Wiederholung, Konflikt), nicht die Speicherinfrastruktur."}}, "lab_validation": [{"lab_id": "KB-0168-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Idempotency-Key mit Payload-Konfliktprüfung", "evidence": "Ein wiederverwendeter Idempotency-Key mit identischem Payload liefert das gespeicherte Ergebnis; derselbe Key mit abweichendem Payload wird korrekt mit 409 Conflict abgelehnt.", "limitations": "Kein echtes Backend, keine Produktion."}]}
---
# Idempotente API-Operationen

> **Ziel:** Diese Datei wendet das Idempotenzschlüssel-Prinzip aus [KB-0113](../05-distributed-systems/13-idempotenz-als-systemgarantie.md) konkret auf die öffentliche API-Vertragsebene an: wie ein Client einen Idempotency-Key sendet, wie die API bei Wiederholung reagiert, und — der entscheidende Zusatzpunkt gegenüber der generischen Mechanik — wie ein Konflikt behandelt wird, wenn derselbe Key mit einem abweichenden Payload wiederverwendet wird.

## Zweck, Mental Model und Dependencies

Während [KB-0113](../05-distributed-systems/13-idempotenz-als-systemgarantie.md) das Grundprinzip behandelt (gleicher Schlüssel, kein zusätzlicher Effekt), muss eine öffentliche API-Vertragsebene zusätzlich definieren: was passiert, wenn ein Client denselben Idempotency-Key für eine tatsächlich andere Anfrage wiederverwendet (versehentlich oder fehlerhaft)? Die korrekte Antwort ist ein expliziter Konfliktstatus (409 Conflict), nicht ein stilles Akzeptieren des neuen Payloads oder ein stilles Zurückgeben des alten Ergebnisses ohne Warnung. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0113](../05-distributed-systems/13-idempotenz-als-systemgarantie.md).

~~~text
POST /charges {key: "abc", amount: 50} -> 201 Created, stored: {key: "abc", amount: 50, result: ...}
POST /charges {key: "abc", amount: 50} -> 200 OK, returns SAME stored result (true retry)
POST /charges {key: "abc", amount: 99} -> 409 Conflict: key "abc" already used with a different payload
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Retry-Erkennung | identischer Payload mit bekanntem Key liefert gespeichertes Ergebnis? | erneute Ausführung statt Wiedergabe des Ergebnisses |
| Konflikterkennung | abweichender Payload mit bekanntem Key wird abgelehnt? | stille Akzeptanz eines fehlerhaft wiederverwendeten Keys |
| Concurrent-Request-Handling | zwei gleichzeitige Requests mit demselben neuen Key? | Race Condition erzeugt doch doppelten Effekt |
| Antwortformat | ist für den Client erkennbar, ob es sich um Original oder Wiedergabe handelt? | Client kann eigenes Fehlerverhalten nicht korrekt anpassen |

Implementierung: bei Eingang eines Idempotency-Keys wird zunächst geprüft, ob er bereits bekannt ist; ist er bekannt und der Payload-Hash identisch, wird das gespeicherte Ergebnis zurückgegeben (Retry). Ist er bekannt und der Payload-Hash unterschiedlich, wird explizit mit 409 Conflict abgelehnt. Zwei gleichzeitige Anfragen mit demselben, noch unbekannten Key werden über atomares Locking im Idempotency-Store serialisiert (identisch zur Grundmechanik aus [KB-0113](../05-distributed-systems/13-idempotenz-als-systemgarantie.md)), damit nicht beide parallel die Operation ausführen.

## Scalability, Reliability, Security und Observability

Idempotency-Key-Unterstützung skaliert Client-Vertrauen in sichere Retries über Netzwerkfehler, insbesondere bei zahlungs- oder bestandsrelevanten Operationen. Reliability-Grenze: fehlende Konflikterkennung kann einen Programmierfehler beim Client (versehentliche Key-Wiederverwendung für unterschiedliche Operationen) unbemerkt zu einem stillen Datenfehler machen, statt ihn als expliziten, diagnostizierbaren 409-Fehler sichtbar zu machen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Client erhält 409 Conflict unerwartet | Idempotency-Key wurde clientseitig fehlerhaft für unterschiedliche Operationen wiederverwendet | Payload-Hashes beider Anfragen mit demselben Key vergleichen |
| doppelte Buchung trotz Idempotency-Key-Nutzung | fehlendes atomares Locking bei gleichzeitigen Anfragen mit demselben neuen Key | Race-Condition-Test mit parallelen identischen Anfragen wiederholen |
| Client kann nicht unterscheiden, ob Antwort Original oder Wiedergabe ist | fehlendes explizites Signal (z. B. Header) im Antwortformat | Antwortformat auf ein Retry-Kennzeichen prüfen |
| Idempotency-Key-Store wächst unbegrenzt | fehlendes TTL für abgelaufene Keys | Speicherbedarf des Stores gegen TTL-Konfiguration prüfen |

Security: der Idempotency-Key sollte an die authentifizierte Identität des ursprünglichen Anfragenden gebunden sein, damit ein anderer Client nicht durch Erraten eines Keys auf dessen gespeichertes Ergebnis zugreifen kann. Observability: Häufigkeit von 409-Conflict-Antworten ist ein Signal für fehlerhafte Client-Implementierungen, die untersucht werden sollten.

## Trade-offs und Entscheidungen

**Staff** prüft bei unerwarteten 409-Antworten zuerst die Client-seitige Key-Generierungslogik auf fehlerhafte Wiederverwendung. **Principal** definiert einheitliches Idempotency-Key-Verhalten (Retry-Erkennung, Konfliktbehandlung) als API-Standard. **Chief** verlangt Idempotency-Key-Unterstützung als Pflicht für alle zustandsändernden Operationen mit Geldwert.

Anti-Patterns: einen wiederverwendeten Key mit abweichendem Payload stillschweigend akzeptieren statt abzulehnen; keine atomare Prüfung bei gleichzeitigen Anfragen mit neuem Key; Idempotency-Key-Store ohne TTL unbegrenzt wachsen lassen.

## Production Checklist

- [ ] Retry mit identischem Payload liefert gespeichertes Ergebnis, keine erneute Ausführung.
- [ ] Wiederverwendeter Key mit abweichendem Payload wird explizit mit 409 Conflict abgelehnt.
- [ ] Gleichzeitige Anfragen mit demselben neuen Key werden atomar serialisiert.
- [ ] Idempotency-Key ist an die authentifizierte Identität gebunden, mit definiertem TTL.

## Interviewfragen

### 1. Was passiert, wenn ein Client denselben Idempotency-Key mit unterschiedlichem Payload sendet?

**Antwort:** Die API sollte dies explizit mit 409 Conflict ablehnen, statt den neuen Payload stillschweigend zu akzeptieren oder das alte Ergebnis ohne Warnung zurückzugeben.

### 2. Wie unterscheidest du einen legitimen Retry von einem fehlerhaft wiederverwendeten Key?

**Antwort:** Über einen Vergleich des Payload-Hashes: identischer Payload mit bekanntem Key ist ein legitimer Retry, abweichender Payload mit bekanntem Key ist ein Konflikt.

### 3. Warum braucht es atomares Locking bei gleichzeitigen Anfragen mit neuem Key?

**Antwort:** Ohne atomare Prüfung könnten zwei parallele Anfragen mit demselben, noch unbekannten Key beide die Operation ausführen, bevor der Key als „gesehen" markiert ist.

### 4. Warum sollte der Idempotency-Key an die authentifizierte Identität gebunden sein?

**Antwort:** Sonst könnte ein anderer Client durch Erraten oder Abfangen eines Keys auf dessen gespeichertes Ergebnis zugreifen, was ein Datenleck ermöglichen würde.

### 5. Was zeigt eine hohe Häufigkeit von 409-Conflict-Antworten?

**Antwort:** Meist einen Fehler in der Client-Implementierung, die Idempotency-Keys fälschlich für unterschiedliche logische Operationen wiederverwendet, statt für jede neue Operation einen neuen Key zu generieren.

### 6. Widersprüchliche Anforderung: Client-Team will Idempotency-Keys frei wiederverwenden können UND die API soll niemals falsch-positive Konflikte melden — wie gehst du vor?

**Antwort:** Ich würde erklären, dass „frei wiederverwenden" und „keine Konflikte" sich widersprechen, sobald sich der Payload zwischen zwei Verwendungen desselben Keys unterscheidet; ich würde stattdessen klare Client-Richtlinien zur Key-Generierung (ein Key pro logischer Operation) etablieren, um echte Konflikte von legitimen Retries zuverlässig zu trennen.

## Praktische Labs

~~~python
import hashlib

store = {}

def idempotent_charge(key, payload):
    payload_hash = hashlib.sha256(str(sorted(payload.items())).encode()).hexdigest()
    if key in store:
        if store[key]["hash"] == payload_hash:
            return 200, store[key]["result"]
        return 409, "Conflict: idempotency key reused with a different payload"
    result = {"charged": payload["amount"]}
    store[key] = {"hash": payload_hash, "result": result}
    return 201, result

status1, r1 = idempotent_charge("key-1", {"amount": 50})
status2, r2 = idempotent_charge("key-1", {"amount": 50})  # true retry
status3, r3 = idempotent_charge("key-1", {"amount": 99})  # conflicting reuse

assert status1 == 201 and status2 == 200 and r1 == r2
assert status3 == 409
print("Retry correctly replayed the result; conflicting reuse was correctly rejected with 409.")
~~~

## Dependencies, Cross-References und Quellen

1. Stripe: [Idempotent Requests](https://stripe.com/docs/api/idempotent_requests), abgerufen 2026-09-17 (praxisnahe Referenzimplementierung, reused from KB-0113).

Produktspezifische Idempotency-Key-API-Details vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierter Idempotency-Key-HTTP-Header (IETF-Draft) | Adopting | Konvergenz mit bestehenden proprietären Header-Konventionen vor Migration prüfen. |

Ein Team akzeptiert eine idempotente API-Operation erst, wenn Retry-Erkennung, Konfliktbehandlung und Concurrent-Request-Sicherheit nachweisbar getestet sind.
