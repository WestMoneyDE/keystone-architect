---
{"id": "KB-0669", "title": "Commerce-Webhooks", "domain": "29", "sequence": 7, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "ENTERPRISE"], "requires": [{"id": "KB-0665", "concepts": ["Kontrollierte externe Rückmeldungsverarbeitung"], "needed_for": "Webhooks sind der konkrete technische Mechanismus für die in KB-0665 beschriebenen externen Systemrückmeldungen"}], "related": ["KB-0664", "KB-0668"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Shop-, ERP- und Zahlungsereignisse sicher über Webhooks empfangen und für ein gegebenes Szenario Signatur- und Retrymechanik korrekt referenzieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein Commerce-Vorhaben explizit gestalten, wie Abnahme- und Fehlerzuständigkeiten für unterschiedliche Webhook-Quellen (Shop, ERP, Zahlungsdienstleister) konkret festgelegt werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein Webhook-Handler eine Signaturprüfung nicht tatsächlich durchführt, wodurch gefälschte Ereignisse fälschlich als legitim verarbeitet werden könnten.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Commerce-Webhook-Verarbeitung festlegen, die Signaturprüfung, Idempotenz und klare Fehlerzuständigkeiten vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, generische Signatur- und Retrymechanik selbst (HMAC-Implementierung, Backoff-Algorithmen) im Detail ist Vertiefung und wird gemäß Manifest-Scope referenziert, nicht neu hergeleitet.", "rationale": "Kern ist die konkrete Zuständigkeitsfestlegung für Commerce-spezifische Webhook-Quellen, nicht die generische Signatur-/Retry-Mechanik selbst."}}, "lab_validation": [{"lab_id": "KB-0669-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Veranschaulichung von Signaturprüfung und Idempotenz bei Webhook-Empfang, kein reales Commerce-System verwendet", "evidence": "Ein lokales Skript prüft eine simulierte Webhook-Nutzlast gegen eine erwartete Signatur und zeigt, dass ein Ereignis mit ungültiger Signatur korrekt abgelehnt wird, während ein doppelt eintreffendes, bereits verarbeitetes Ereignis idempotent erkannt wird.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Commerce-System oder reale externe Webhook-Quellen getestet."}]}
---
# Commerce-Webhooks

> **Ziel:** Commerce-Webhooks sind der konkrete technische Mechanismus, über den externe Systeme (Shop-Frontend, ERP-System, Zahlungsdienstleister) Ereignisse tatsächlich in Echtzeit an die Commerce Engine melden — dies ist die konkrete Umsetzung der in KB-0665 beschriebenen externen Systemrückmeldungen. Dieses Kapitel referenziert die generische Signatur- und Retrymechanik (Signaturprüfung zur Authentizitätsverifikation, automatische Wiederholung bei fehlgeschlagener Zustellung) als bereits etabliertes Grundprinzip und konzentriert sich stattdessen auf die konkrete Zuständigkeitsfestlegung: Welche Quelle (Shop, ERP, Zahlungsdienstleister) ist tatsächlich für welches Ereignis verantwortlich, und wer trägt tatsächlich die Verantwortung, wenn ein Webhook-Ereignis nicht korrekt verarbeitet werden kann.

## Zweck, Mental Model und Dependencies

Shop-Ereignisse (etwa eine neue Bestellung im Storefront) müssen sicher an die Commerce Engine oder nachgelagerte Systeme übermittelt werden — die generische Signaturprüfung (siehe Manifest-Referenz auf etablierte HMAC-basierte Mechanik) stellt dabei sicher, dass ein empfangenes Ereignis tatsächlich von der erwarteten Quelle stammt und nicht von einem Angreifer gefälscht wurde, der lediglich die öffentlich bekannte Webhook-URL kennt. ERP-Ereignisse (etwa eine Bestandsänderung aus dem Warenwirtschaftssystem) erfordern eine klare Abnahmezuständigkeit: Da ein ERP-System typischerweise die autoritative Quelle für physischen Bestand ist (siehe KB-0666, Inventory Consistency), muss explizit festgelegt sein, welches System (Commerce Engine oder ein dediziertes Integrationssystem) für den tatsächlichen Empfang, die Verarbeitung und im Fehlerfall die Eskalation eines ERP-Webhooks verantwortlich ist. Zahlungsereignisse (etwa eine Zahlungsbestätigung oder eine Rückerstattungsbestätigung von einem Zahlungsdienstleister) sind aufgrund ihrer direkten finanziellen Konsequenz besonders kritisch — ein nicht korrekt verarbeitetes Zahlungswebhook könnte tatsächlich dazu führen, dass eine Bestellung fälschlich als unbezahlt behandelt wird, obwohl die Zahlung tatsächlich erfolgt ist, oder umgekehrt. Die generische Retrymechanik (automatische Wiederholung bei fehlgeschlagener Zustellung, meist mit exponentiellem Backoff) stellt zuverlässige Zustellung sicher, erzeugt jedoch tatsächlich das Risiko doppelt eintreffender Ereignisse — jeder Webhook-Handler muss daher tatsächlich idempotent implementiert sein, sodass ein doppelt verarbeitetes Ereignis keine doppelte fachliche Konsequenz (etwa eine doppelte Zustandsänderung) auslöst, entsprechend dem in KB-0665 beschriebenen Prinzip kontrollierter Rückmeldungsverarbeitung. Konkrete Abnahme- und Fehlerzuständigkeiten müssen für jede Webhook-Quelle explizit dokumentiert sein: Wer wird tatsächlich benachrichtigt, wenn ein Zahlungswebhook wiederholt fehlschlägt? Welches Team ist tatsächlich verantwortlich, wenn ein ERP-Webhook eine unerwartete, nicht verarbeitbare Nutzlast liefert? Diese Zuständigkeitsklärung ist die konkrete, projektspezifische Ergänzung zur generischen Signatur- und Retrymechanik.

~~~text
Commerce Webhooks = concrete technical mechanism external systems (shop frontend, ERP
  system, payment provider) ACTUALLY use to report events in real time to commerce
  engine -- concrete implementation of KB-0665's external system callbacks
KEY POINT: this chapter references generic signature+retry mechanics (signature check
  for authenticity, automatic retry on failed delivery) as already established base
  principle, focuses instead on concrete responsibility assignment: which source (shop,
  ERP, payment provider) is ACTUALLY responsible for which event, and who ACTUALLY bears
  responsibility when a webhook event can't be correctly processed
SHOP EVENTS (new order in storefront) must be securely delivered to commerce engine or
  downstream systems -- generic signature check (HMAC-based mechanic, established
  reference) ensures received event ACTUALLY came from expected source, not forged by
  attacker merely knowing public webhook URL
ERP EVENTS (inventory change from warehouse system) require clear intake responsibility:
  since ERP system typically authoritative source for physical stock (see KB-0666,
  Inventory Consistency), must be explicitly fixed which system (commerce engine or
  dedicated integration system) is responsible for ACTUAL receipt, processing, and
  on-failure escalation of an ERP webhook
PAYMENT EVENTS (payment confirmation, refund confirmation from payment provider)
  especially critical due to direct financial consequence -- incorrectly processed
  payment webhook COULD ACTUALLY cause order to falsely be treated as unpaid although
  payment ACTUALLY succeeded, or vice versa
GENERIC RETRY MECHANIC (automatic retry on failed delivery, usually exponential backoff)
  ensures reliable delivery but ACTUALLY creates risk of duplicate-arriving events ->
  every webhook handler must ACTUALLY be idempotent, so a duplicate-processed event
  doesn't trigger duplicate business consequence (duplicate state change), per KB-0665's
  controlled-callback-processing principle
CONCRETE INTAKE + ERROR RESPONSIBILITIES must be explicitly documented per webhook
  source: who is ACTUALLY notified when a payment webhook repeatedly fails? which team
  is ACTUALLY responsible when an ERP webhook delivers an unexpected, unprocessable
  payload? this responsibility clarification = concrete, project-specific addition to
  generic signature+retry mechanics
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Signaturprüfung (referenziert) | verifiziert Authentizität des Absenders | verhindert Verarbeitung gefälschter Ereignisse |
| Retrymechanik (referenziert) | stellt zuverlässige Zustellung sicher | erfordert idempotente Handler zur Vermeidung doppelter Konsequenzen |
| ERP-Webhook-Abnahmezuständigkeit | klärt, welches System ERP-Ereignisse tatsächlich empfängt | verhindert unklare Verantwortung bei Bestandsereignissen |
| Zahlungswebhook-Kritikalität | direkte finanzielle Konsequenz bei Fehlverarbeitung | erfordert besonders zuverlässige, überwachte Verarbeitung |
| Dokumentierte Fehlerzuständigkeiten | konkrete Eskalationswege pro Webhook-Quelle | verhindert unklare Verantwortung bei wiederholtem Fehlschlag |

Implementierung: Jeder Webhook-Handler prüft die Signatur der eingehenden Nutzlast vor Verarbeitung und ist idempotent implementiert. Für Shop-, ERP- und Zahlungswebhooks sind konkrete Abnahme- und Fehlereskalationszuständigkeiten explizit dokumentiert.

## Scalability, Reliability, Security und Observability

Eine Commerce-Webhook-Architektur skaliert über die Anzahl integrierter externer Quellen; die Reliability-Grenze liegt darin, dass ein nicht idempotenter Handler bei einer durch Retry-Mechanik doppelt eintreffenden Nutzlast tatsächlich eine doppelte, fachlich falsche Konsequenz auslösen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Bestellung wird doppelt als bezahlt markiert oder doppelt versendet | der Webhook-Handler ist nicht idempotent implementiert | eine Idempotenzprüfung gegen bereits verarbeitete Ereignis-IDs einführen |
| ein gefälschtes Webhook-Ereignis wird verarbeitet | die Signaturprüfung fehlt oder wird nicht tatsächlich durchgesetzt | die Signaturprüfung für den betroffenen Handler implementieren und erzwingen |
| ein wiederholt fehlschlagender ERP-Webhook bleibt über längere Zeit unbemerkt | keine dokumentierte Fehlerzuständigkeit für ERP-Webhooks existiert | eine explizite Eskalationszuständigkeit mit Alarmierung für ERP-Webhook-Fehlschläge festlegen |

Security: Zahlungswebhooks sollten zusätzlich zur Signaturprüfung gegen bekannte Absender-IP-Bereiche des Zahlungsdienstleisters validiert werden, wo dies möglich ist. Observability: Die tatsächliche Fehlschlagsrate pro Webhook-Quelle ist ein zentrales Signal zur Priorisierung von Integrationsproblemen.

## Trade-offs und Entscheidungen

**Staff** implementiert einen korrekten, idempotenten Webhook-Handler mit Signaturprüfung für eine gegebene Quelle. **Principal** entwirft die vollständige Webhook-Architektur mit Abnahme- und Fehlerzuständigkeiten für ein Commerce-Vorhaben. **Chief** legt unternehmensweite Standards für Signaturprüfung, Idempotenz und Fehlerzuständigkeiten bei Webhook-Verarbeitung fest.

Anti-Patterns: Webhook-Handler ohne Signaturprüfung implementieren; Handler nicht idempotent gestalten, sodass Retries doppelte fachliche Konsequenzen auslösen; keine dokumentierte Fehlerzuständigkeit für wiederholt fehlschlagende Webhooks festlegen.

## Production Checklist

- [ ] Jeder Webhook-Handler prüft die Signatur der eingehenden Nutzlast vor Verarbeitung.
- [ ] Jeder Webhook-Handler ist idempotent gegen doppelt eintreffende Ereignisse implementiert.
- [ ] Für Shop-, ERP- und Zahlungswebhooks sind konkrete Abnahmezuständigkeiten dokumentiert.
- [ ] Eine explizite Eskalationszuständigkeit für wiederholt fehlschlagende Webhooks existiert.

## Interviewfragen

### 1. Warum ist die Signaturprüfung bei Webhook-Empfang notwendig?

**Antwort:** Um zu verifizieren, dass ein empfangenes Ereignis tatsächlich von der erwarteten Quelle stammt und nicht von einem Angreifer gefälscht wurde, der lediglich die öffentliche Webhook-URL kennt.

### 2. Warum müssen Webhook-Handler idempotent implementiert sein?

**Antwort:** Weil die zur Zuverlässigkeit eingesetzte Retrymechanik doppelt eintreffende Ereignisse erzeugen kann; ohne Idempotenz würde dies eine doppelte, fachlich falsche Konsequenz auslösen.

### 3. Warum ist die Abnahmezuständigkeit für ERP-Webhooks besonders wichtig zu klären?

**Antwort:** Weil das ERP-System typischerweise die autoritative Quelle für physischen Bestand ist, sodass unklar geregelte Zuständigkeit zu inkonsistenten oder verpassten Bestandsaktualisierungen führen kann.

### 4. Warum sind Zahlungswebhooks besonders kritisch?

**Antwort:** Weil eine Fehlverarbeitung direkte finanzielle Konsequenzen hat, etwa eine tatsächlich bezahlte Bestellung fälschlich als unbezahlt zu behandeln oder umgekehrt.

### 5. Wie gehst du vor, wenn eine Bestellung doppelt als bezahlt markiert wird?

**Antwort:** Ich prüfe, ob der Zahlungswebhook-Handler idempotent implementiert ist, und führe eine Idempotenzprüfung gegen bereits verarbeitete Ereignis-IDs ein, falls diese fehlt.

### 6. Widersprüchliche Anforderung: Das Integrationsteam will minimale Latenz bei der Webhook-Verarbeitung UND die Organisation will vollständige Signatur- und Idempotenzprüfung vor jeder Verarbeitung — wie gehst du vor?

**Antwort:** Ich würde Signatur- und Idempotenzprüfung als schnelle, leichte Vorabschritte implementieren, die typischerweise nur minimale zusätzliche Latenz verursachen, statt auf diese Prüfungen zugunsten der Latenz zu verzichten, da die Konsequenzen einer fehlenden Prüfung (gefälschte oder doppelte Ereignisse) schwerer wiegen als der geringe Latenzgewinn.

## Praktische Labs

~~~python
# Local, deterministic illustration of signature check and idempotency for webhook handling (executed locally, no real commerce system):

import hmac
import hashlib

def verify_signature(payload, received_signature, secret):
    expected = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, received_signature)

def handle_webhook(event_id, processed_ids, payload, received_signature, secret):
    if not verify_signature(payload, received_signature, secret):
        return "rejected: invalid signature"
    if event_id in processed_ids:
        return "skipped: already processed (idempotent)"
    processed_ids.add(event_id)
    return "processed"

secret = "webhook-secret"
payload = "order.paid:order-123"
sig = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
processed = set()
print(handle_webhook("evt-1", processed, payload, sig, secret))
print(handle_webhook("evt-1", processed, payload, sig, secret))  # duplicate delivery
~~~

## Dependencies, Cross-References und Quellen

1. Medusa: [Medusa Webhooks and Event Subscribers Documentation](https://docs.medusajs.com/learn/customization/events-and-subscribers), abgerufen 2026-09-18.
2. Stripe: [Stripe Webhooks — Signature Verification Best Practices](https://docs.stripe.com/webhooks/signatures), abgerufen 2026-09-18.

Dieses Kapitel konkretisiert die in KB-0665 (Order State Machines) beschriebene kontrollierte externe Rückmeldungsverarbeitung auf Shop-, ERP- und Zahlungswebhooks.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte Webhook-Event-Schemata (etwa CloudEvents) zur herstellerübergreifenden Vereinheitlichung von Webhook-Nutzlastformaten | Growing Adoption | Bei künftigen Neuintegrationen evaluieren, jedoch bei bestehenden, funktionierenden, quellenspezifischen Webhook-Handlern weiterhin auf die etablierten, projektspezifischen Formate setzen. |

Ein Team akzeptiert eine Commerce-Webhook-Implementierung erst, wenn Signaturprüfung, Idempotenz und dokumentierte Abnahme-/Fehlerzuständigkeiten für alle integrierten Quellen nachweislich implementiert sind.
