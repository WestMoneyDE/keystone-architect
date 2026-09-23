---
{"id": "KB-0665", "title": "Order State Machines", "domain": "29", "sequence": 3, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "ENTERPRISE"], "requires": [{"id": "KB-0664", "concepts": ["Workflows", "Medusa-Orchestrierung"], "needed_for": "Order State Machines konkretisieren die in KB-0664 beschriebene Workflow-Orchestrierung auf die Bestellzustandsmodellierung"}], "related": ["KB-0663"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Bestellzustände, Übergänge und fachliche Guards korrekt modellieren und für ein gegebenes Szenario eine konsistente Zustandsmaschine für Zahlung, Erfüllung und Storno entwerfen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein Commerce-Vorhaben explizit gestalten, wie externe Systemrückmeldungen (Zahlungsbestätigung, Versandstatus) kontrolliert in die Bestellzustandsmaschine einfließen, ohne inkonsistente Zwischenzustände zu erzeugen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Bestellzustandsmaschine einen ungültigen Zustandsübergang zulässt, weil kein fachlicher Guard die Gültigkeit des Übergangs tatsächlich prüft.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Bestellzustandsmodellierung festlegen, die explizite Guards und kontrollierte externe Rückmeldungsverarbeitung vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, formale Zustandsmaschinen-Verifikation (Model Checking) im Detail ist Vertiefung.", "rationale": "Kern ist die praktische Modellierung fachlicher Zustände und Guards, nicht die formale Verifikation."}}, "lab_validation": [{"lab_id": "KB-0665-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell einer Bestellzustandsmaschine mit Guards, kein reales Commerce-System verwendet", "evidence": "Ein lokales Skript modelliert eine Bestellzustandsmaschine mit expliziten Guards für Zustandsübergänge und zeigt, dass ein ungültiger Übergang (etwa Storno nach bereits erfolgtem Versand) korrekt abgelehnt wird.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Commerce-System oder reale externe Zahlungs-/Versanddienste getestet."}]}
---
# Order State Machines

> **Ziel:** Eine Order State Machine modelliert eine Bestellung als endliche Zustandsmaschine mit drei Kernelementen: **Bestellzustände** (etwa "erstellt", "bezahlt", "in Erfüllung", "versendet", "storniert"), **Übergänge** (die erlaubten Wechsel zwischen Zuständen, etwa von "bezahlt" zu "in Erfüllung") und **fachliche Guards** (Bedingungen, die einen Übergang tatsächlich nur dann zulassen, wenn eine fachliche Voraussetzung erfüllt ist, etwa dass ein Storno nach bereits erfolgtem Versand tatsächlich nicht mehr zulässig ist). Der zentrale Punkt dieses Kapitels ist, dass externe Systemrückmeldungen (etwa eine Zahlungsbestätigung von einem Zahlungsdienstleister oder eine Versandbestätigung von einem Logistikdienstleister) kontrolliert, nicht ungeprüft, in die Zustandsmaschine einfließen müssen — eine Rückmeldung, die einen Übergang auslöst, ohne dass ein Guard die fachliche Gültigkeit dieses Übergangs im aktuellen Zustand prüft, kann tatsächlich zu inkonsistenten, fachlich unmöglichen Zuständen führen.

## Zweck, Mental Model und Dependencies

Bestellzustände müssen vollständig und überschneidungsfrei definiert sein, sodass jede Bestellung zu jedem Zeitpunkt tatsächlich in genau einem eindeutigen Zustand ist — eine unvollständige Zustandsdefinition (etwa ein fehlender Zustand für "teilweise erfüllt" bei einer Bestellung mit mehreren Artikeln, von denen nur einige verfügbar sind) führt tatsächlich dazu, dass das System einen tatsächlich auftretenden Geschäftsfall nicht korrekt abbilden kann. Übergänge zwischen Zuständen müssen explizit als erlaubte Paare definiert sein (etwa "bezahlt" → "in Erfüllung" ist erlaubt, "storniert" → "in Erfüllung" ist nicht erlaubt), statt implizit anzunehmen, dass jeder Zustand von jedem anderen Zustand aus erreichbar ist — diese explizite Definition ist die Grundlage dafür, dass die Zustandsmaschine fachlich unmögliche Abläufe strukturell verhindert. Fachliche Guards prüfen vor jedem Übergang, ob die tatsächliche fachliche Voraussetzung erfüllt ist — ein Übergang von "in Erfüllung" zu "storniert" könnte etwa einen Guard haben, der prüft, ob die Bestellung tatsächlich noch nicht versendet wurde; ohne diesen Guard könnte eine bereits versendete Bestellung fälschlich als stornierbar behandelt werden, was tatsächlich zu einer inkonsistenten Situation zwischen dem Bestellsystem und der physischen Realität führt. Externe Systemrückmeldungen (Zahlungsbestätigung, Versandbestätigung, Rückerstattungsbestätigung) lösen typischerweise Zustandsübergänge aus, dürfen dies jedoch nicht ungeprüft tun — eine verspätete oder doppelt eintreffende Zahlungsbestätigung (etwa durch einen Netzwerk-Retry des Zahlungsdienstleisters) darf einen bereits erfolgten Übergang nicht ein zweites Mal auslösen oder einen fachlich nicht mehr gültigen Übergang erzwingen; die Zustandsmaschine muss daher jede eingehende Rückmeldung gegen den tatsächlichen, aktuellen Zustand und die definierten Guards prüfen, bevor sie einen Übergang tatsächlich ausführt.

~~~text
Order State Machine models an order as a finite state machine w/ 3 core elements
  ORDER STATES: e.g. "created", "paid", "fulfilling", "shipped", "cancelled"
  TRANSITIONS: allowed state changes (e.g. "paid" -> "fulfilling")
  BUSINESS GUARDS: conditions ACTUALLY allowing a transition only when a business
  precondition is met (e.g. cancellation after actual shipment ACTUALLY not allowed
  anymore)
KEY POINT: external system callbacks (payment confirmation from payment provider,
  shipping confirmation from logistics provider) must feed into state machine in a
  controlled, NOT unchecked way
  a callback triggering a transition w/o a guard checking the transition's business
  validity in the current state CAN ACTUALLY lead to inconsistent, business-impossible
  states
ORDER STATES must be defined completely + w/o overlap, so an order is ACTUALLY in exactly
  one unambiguous state at any time
  incomplete state definition (missing "partially fulfilled" state for multi-item order
  w/ only some items available) ACTUALLY means system can't correctly represent an
  ACTUALLY occurring business case
TRANSITIONS between states must be explicitly defined as allowed pairs ("paid" ->
  "fulfilling" allowed, "cancelled" -> "fulfilling" not allowed) instead of implicitly
  assuming every state reachable from every other state
  this explicit definition = basis for state machine structurally preventing
  business-impossible sequences
BUSINESS GUARDS check before every transition whether the ACTUAL business precondition
  is met -- "fulfilling" -> "cancelled" transition might have guard checking order
  ACTUALLY not yet shipped
  w/o this guard, an already-shipped order could be falsely treated as cancellable,
  ACTUALLY creating inconsistency between order system and physical reality
EXTERNAL SYSTEM CALLBACKS (payment confirmation, shipping confirmation, refund
  confirmation) typically trigger state transitions, but must NOT do so unchecked
  a delayed or duplicate-arriving payment confirmation (payment provider network retry)
  must not trigger an already-completed transition a second time or force a no-longer-
  valid transition
  state machine must therefore check every incoming callback against ACTUAL current
  state + defined guards before ACTUALLY executing a transition
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Vollständige, überschneidungsfreie Zustände | jede Bestellung ist zu jeder Zeit in genau einem Zustand | verhindert nicht abbildbare Geschäftsfälle |
| Explizit definierte Übergänge | nur erlaubte Zustandspaare | verhindert fachlich unmögliche Abläufe |
| Fachliche Guards | prüfen Voraussetzung vor jedem Übergang | verhindert Inkonsistenz zwischen System und physischer Realität |
| Kontrollierte externe Rückmeldungsverarbeitung | prüft Callback gegen aktuellen Zustand vor Übergang | verhindert doppelte oder ungültige Übergänge durch Retries |

Implementierung: Alle Bestellzustände und erlaubten Übergänge werden explizit als Zustandsmaschine dokumentiert. Für jeden kritischen Übergang wird ein fachlicher Guard implementiert. Externe Rückmeldungen werden vor Übergangsausführung gegen den aktuellen Zustand und die Guards geprüft, mit expliziter Behandlung doppelt eintreffender Rückmeldungen.

## Scalability, Reliability, Security und Observability

Eine Order-State-Machine-Architektur skaliert über die Anzahl der Bestellzustände und externen Integrationen; die Reliability-Grenze liegt darin, dass ungeprüfte externe Rückmeldungen bei Duplikaten oder verspäteter Zustellung tatsächlich inkonsistente Zustände erzeugen können.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine bereits versendete Bestellung wird fälschlich storniert | kein Guard prüft den Versandstatus vor dem Storno-Übergang | einen Guard einführen, der Storno nach erfolgtem Versand ablehnt |
| eine doppelt eintreffende Zahlungsbestätigung löst einen Übergang zweimal aus | die Rückmeldungsverarbeitung prüft nicht, ob der Übergang bereits erfolgt ist | die Rückmeldungsverarbeitung um eine Idempotenzprüfung gegen den aktuellen Zustand ergänzen |
| ein tatsächlich auftretender Geschäftsfall lässt sich nicht korrekt im System abbilden | die Zustandsdefinition ist unvollständig | den fehlenden Zustand (etwa "teilweise erfüllt") explizit in die Zustandsmaschine aufnehmen |

Security: Externe Rückmeldungen (Webhooks von Zahlungs-/Logistikdienstleistern) sollten kryptografisch signiert und verifiziert werden, bevor sie einen Zustandsübergang auslösen. Observability: Die tatsächliche Häufigkeit abgelehnter, ungültiger Übergangsversuche ist ein zentrales Signal zur Bewertung, ob externe Systeme konsistent mit dem tatsächlichen Bestellzustand kommunizieren.

## Trade-offs und Entscheidungen

**Staff** implementiert einen korrekten Guard für einen gegebenen Zustandsübergang. **Principal** entwirft die vollständige Order-State-Machine mit allen Zuständen, Übergängen und Guards für ein Commerce-Vorhaben. **Chief** legt unternehmensweite Standards für Bestellzustandsmodellierung und kontrollierte externe Rückmeldungsverarbeitung fest.

Anti-Patterns: Zustandsübergänge ohne fachliche Guards zulassen; externe Rückmeldungen ungeprüft direkt einen Zustandsübergang auslösen lassen; eine unvollständige Zustandsdefinition verwenden, die tatsächlich auftretende Geschäftsfälle nicht abbilden kann.

## Production Checklist

- [ ] Alle Bestellzustände sind vollständig und überschneidungsfrei definiert.
- [ ] Alle erlaubten Übergänge sind explizit dokumentiert.
- [ ] Kritische Übergänge haben implementierte, fachliche Guards.
- [ ] Externe Rückmeldungen werden vor Übergangsausführung gegen Zustand und Idempotenz geprüft.

## Interviewfragen

### 1. Was ist ein fachlicher Guard in einer Order State Machine?

**Antwort:** Eine Bedingung, die einen Zustandsübergang nur dann zulässt, wenn eine fachliche Voraussetzung tatsächlich erfüllt ist, etwa dass eine Bestellung noch nicht versendet wurde, bevor ein Storno zugelassen wird.

### 2. Warum dürfen externe Systemrückmeldungen nicht ungeprüft einen Zustandsübergang auslösen?

**Antwort:** Weil eine verspätete oder doppelt eintreffende Rückmeldung sonst einen bereits erfolgten Übergang erneut auslösen oder einen fachlich nicht mehr gültigen Übergang erzwingen könnte.

### 3. Was passiert, wenn die Zustandsdefinition einer Order State Machine unvollständig ist?

**Antwort:** Das System kann einen tatsächlich auftretenden Geschäftsfall (etwa eine teilweise erfüllte Bestellung) nicht korrekt abbilden.

### 4. Warum müssen Übergänge zwischen Zuständen explizit als erlaubte Paare definiert sein?

**Antwort:** Um fachlich unmögliche Abläufe (etwa direkt von "storniert" zu "in Erfüllung") strukturell zu verhindern, statt implizit jeden Übergang zuzulassen.

### 5. Wie gehst du vor, wenn eine bereits versendete Bestellung fälschlich storniert wird?

**Antwort:** Ich prüfe, ob ein Guard den Versandstatus vor dem Storno-Übergang tatsächlich verifiziert, und führe einen entsprechenden Guard ein, falls dieser fehlt.

### 6. Widersprüchliche Anforderung: Der Kundenservice will jederzeit manuelle Zustandsänderungen für Sonderfälle vornehmen können UND die Organisation will strikte Guard-Durchsetzung ohne Ausnahmen — wie gehst du vor?

**Antwort:** Ich würde einen explizit dokumentierten, protokollierten Ausnahmepfad für manuelle Zustandsänderungen mit eigener Autorisierung und Nachvollziehbarkeit schaffen, statt die Guards für den regulären, automatisierten Pfad aufzuweichen oder Sonderfälle komplett unmöglich zu machen.

## Praktische Labs

~~~python
# Local, deterministic order state machine with guards (executed locally, no real commerce system):

ALLOWED_TRANSITIONS = {
    ("created", "paid"),
    ("paid", "fulfilling"),
    ("fulfilling", "shipped"),
    ("paid", "cancelled"),
    ("fulfilling", "cancelled"),
}

def transition(current_state, target_state, already_shipped=False):
    if (current_state, target_state) not in ALLOWED_TRANSITIONS:
        return "rejected: invalid transition"
    if target_state == "cancelled" and already_shipped:
        return "rejected: guard failed, already shipped"
    return f"transitioned to {target_state}"

print(transition("fulfilling", "cancelled", already_shipped=True))
print(transition("fulfilling", "cancelled", already_shipped=False))
~~~

## Dependencies, Cross-References und Quellen

1. AWS: [Finite State Machines — AWS Step Functions Documentation](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-state-machines.html), abgerufen 2026-09-18.
2. Martin Fowler: [State Machine Pattern](https://martinfowler.com/), abgerufen 2026-09-18.

Dieses Kapitel konkretisiert die in KB-0664 (Medusa und modulare Commerce-Dienste) beschriebene Workflow-Orchestrierung auf die Bestellzustandsmodellierung.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Deklarative, visuelle Zustandsmaschinen-Editoren mit automatischer Guard-Vollständigkeitsprüfung zur Reduzierung unvollständig definierter Übergänge | Growing Adoption | Bei künftigen Neuvorhaben evaluieren, jedoch bestehende, code-basierte Zustandsmaschinen weiterhin manuell auf Vollständigkeit prüfen, bis ein konkreter Werkzeugbedarf entsteht. |

Ein Team akzeptiert eine Order-State-Machine-Implementierung erst, wenn alle Zustände, Übergänge und Guards vollständig dokumentiert sind und externe Rückmeldungen nachweislich kontrolliert verarbeitet werden.
