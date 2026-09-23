---
{"id": "KB-0670", "title": "Event-Driven Commerce", "domain": "29", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "ENTERPRISE"], "requires": [{"id": "KB-0669", "concepts": ["Webhooks als externe Ereignisquelle"], "needed_for": "Event-Driven Commerce erweitert die in KB-0669 behandelten externen Webhook-Ereignisse um interne, fachliche Domain-Ereignisse"}], "related": ["KB-0665"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Bestellung, Bestand und Versand über Fachereignisse korrekt koordinieren und für ein gegebenes Szenario Ownership eines Ereignisses eindeutig zuordnen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein Commerce-Vorhaben explizit gestalten, wie Fachereignisse und Prozessstatus koordiniert werden, ohne in unübersichtliche, implizite technische Choreografie zu verfallen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein Ereignisfluss über mehrere Systeme keinen eindeutigen fachlichen Owner hat, sodass bei einem Fehler unklar bleibt, welches System tatsächlich verantwortlich ist.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Event-Driven-Commerce-Architekturen festlegen, die explizite Fachereignis-Ownership und nachvollziehbaren Prozessstatus vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, technische Outbox-/Inbox-Pattern-Implementierung im Detail ist Vertiefung.", "rationale": "Kern ist die fachliche Ereigniskoordination mit klarer Ownership, nicht die technische Detailimplementierung des Outbox-Patterns."}}, "lab_validation": [{"lab_id": "KB-0670-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Veranschaulichung expliziter Fachereignis-Ownership versus unübersichtlicher Choreografie, kein reales Commerce-System verwendet", "evidence": "Ein lokales Skript modelliert einen Bestellabschluss, der explizit definierte Fachereignisse (Bestellung bezahlt, Bestand reserviert, Versand veranlasst) mit jeweils eindeutigem Owner auslöst, und zeigt, wie eine fehlende Ownership-Zuordnung die Fehlerzuordnung erschwert.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Commerce-System oder reale Message-Broker-Infrastruktur getestet."}]}
---
# Event-Driven Commerce

> **Ziel:** Event-Driven Commerce koordiniert die Zusammenarbeit von Bestellung, Bestand und Versand über explizit definierte **Fachereignisse** (etwa "Bestellung bezahlt", "Bestand reserviert", "Versand veranlasst" — fachlich bedeutungsvolle, benannte Ereignisse, nicht technische Implementierungsdetails), **Prozessstatus** (die aggregierte, nachvollziehbare Sicht, in welchem Stadium ein Gesamtprozess wie eine Bestellabwicklung sich tatsächlich befindet) und **Ownership** (die eindeutige Zuordnung, welches System tatsächlich für die Auslösung und korrekte Verarbeitung eines bestimmten Fachereignisses verantwortlich ist). Der zentrale Punkt dieses Kapitels ist die Abgrenzung zu unübersichtlicher technischer Choreografie: Ein System, in dem mehrere Services implizit und ohne explizite Ownership-Zuordnung aufeinander reagieren, wird tatsächlich schnell unübersichtlich — bei einem Fehler ist dann tatsächlich nicht mehr nachvollziehbar, welches System für welchen Schritt verantwortlich war, während explizit benannte Fachereignisse mit eindeutigem Owner diese Nachvollziehbarkeit strukturell erhalten.

## Zweck, Mental Model und Dependencies

Fachereignisse müssen fachlich bedeutungsvoll benannt sein (etwa "Bestellung bezahlt" statt eines technischen Ereignisnamens wie "payment_table_updated"), damit jedes am Prozess beteiligte System tatsächlich versteht, was fachlich geschehen ist, ohne die interne Implementierung des auslösenden Systems kennen zu müssen — diese fachliche Benennung ist die Grundlage dafür, dass unterschiedliche Teams unabhängig voneinander auf dieselben Ereignisse reagieren können, ohne sich über technische Details abstimmen zu müssen. Prozessstatus aggregiert den Fortschritt eines Gesamtprozesses (etwa einer Bestellabwicklung von Zahlung über Bestandsreservierung bis Versand) aus den einzelnen Fachereignissen — diese aggregierte Sicht muss tatsächlich nachvollziehbar sein, sodass zu jedem Zeitpunkt erkennbar ist, welche Schritte bereits abgeschlossen sind und welche noch ausstehen, statt dass der Gesamtprozessstatus implizit aus verstreuten Einzelzuständen rekonstruiert werden muss. Ownership ist das zentrale Prinzip zur Vermeidung unübersichtlicher Choreografie: Für jedes Fachereignis muss explizit dokumentiert sein, welches System es tatsächlich auslöst und welche Systeme tatsächlich darauf reagieren — ohne diese explizite Zuordnung entsteht eine Choreografie, bei der Systeme implizit aufeinander reagieren, ohne dass eine zentrale, nachvollziehbare Übersicht existiert, welches System tatsächlich wofür verantwortlich ist; bei einem tatsächlichen Fehler in einem solchen System ist die Ursachenklärung erheblich erschwert, da nicht klar ist, welches der beteiligten Systeme tatsächlich die Verantwortung für den fehlgeschlagenen Schritt trägt. Diese Ownership-Klärung entspricht strukturell dem in KB-0665 eingeführten Prinzip fachlicher Guards und dem in KB-0669 beschriebenen Prinzip dokumentierter Webhook-Zuständigkeiten, hier jedoch auf die interne, event-getriebene Prozesskoordination zwischen Bestellung, Bestand und Versand angewendet, statt auf einzelne Zustandsübergänge oder externe Systemintegrationen.

~~~text
Event-Driven Commerce coordinates order/inventory/shipping collaboration via explicitly
  defined DOMAIN EVENTS (e.g. "order paid", "stock reserved", "shipment initiated" --
  business-meaningful, named events, not technical implementation details), PROCESS
  STATUS (aggregated, traceable view of what stage an overall process like order
  fulfillment ACTUALLY is in), and OWNERSHIP (unambiguous assignment of which system is
  ACTUALLY responsible for triggering+correctly processing a given domain event)
KEY POINT: distinguishes itself from confusing technical choreography -- system where
  multiple services implicitly react to each other w/o explicit ownership assignment
  ACTUALLY quickly becomes unmanageable; on a fault it's ACTUALLY no longer traceable
  which system was responsible for which step, while explicitly named domain events w/
  unambiguous owner structurally preserve this traceability
DOMAIN EVENTS must be named business-meaningfully ("order paid" instead of technical name
  like "payment_table_updated") so every system involved in process ACTUALLY understands
  what happened business-wise w/o needing to know triggering system's internal
  implementation
  this business naming = basis for different teams reacting independently to same
  events w/o coordinating on technical details
PROCESS STATUS aggregates an overall process's progress (order fulfillment from payment
  through stock reservation to shipping) from individual domain events
  this aggregated view must ACTUALLY be traceable, so at any point it's recognizable
  which steps already completed vs still pending, instead of overall process status
  needing implicit reconstruction from scattered individual states
OWNERSHIP = central principle to avoid confusing choreography: for every domain event
  must be explicitly documented which system ACTUALLY triggers it + which systems
  ACTUALLY react to it
  w/o this explicit assignment, choreography emerges where systems implicitly react to
  each other w/o central, traceable overview of who's ACTUALLY responsible for what
  on an ACTUAL fault in such system, root-cause clarification substantially harder,
  since unclear which involved system ACTUALLY bears responsibility for failed step
  this ownership clarification structurally corresponds to KB-0665's business guards
  principle + KB-0669's documented webhook responsibilities, here applied to internal,
  event-driven process coordination between order/inventory/shipping instead of
  individual state transitions or external system integrations
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Fachlich benannte Domain Events | ermöglicht unabhängiges Reagieren ohne technische Abstimmung | verhindert implizite Kopplung an interne Implementierung |
| Aggregierter, nachvollziehbarer Prozessstatus | zeigt Fortschritt eines Gesamtprozesses | verhindert implizite Rekonstruktion aus verstreuten Zuständen |
| Explizite Event-Ownership | klärt Auslöser und Reagierende pro Ereignis | verhindert unübersichtliche, unklare Choreografie |
| Abgrenzung zu impliziter Choreografie | verhindert unklare Fehlerverantwortung | erleichtert Ursachenklärung bei tatsächlichem Fehler |

Implementierung: Fachereignisse werden explizit, fachlich benannt und dokumentiert, mit klar zugeordnetem auslösendem System. Der Prozessstatus wird aus den Fachereignissen aggregiert und nachvollziehbar dargestellt. Für jedes Fachereignis ist dokumentiert, welche Systeme tatsächlich darauf reagieren.

## Scalability, Reliability, Security und Observability

Eine Event-Driven-Commerce-Architektur skaliert über die Anzahl unabhängig reagierender Systeme pro Fachereignis; die Reliability-Grenze liegt darin, dass fehlende, explizite Ownership bei einem Fehler die Ursachenklärung erheblich erschwert.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| bei einem fehlgeschlagenen Bestellabwicklungsschritt ist unklar, welches System verantwortlich ist | keine explizite Ownership-Zuordnung für die beteiligten Fachereignisse existiert | Ownership für jedes Fachereignis explizit dokumentieren |
| der Gesamtprozessstatus einer Bestellung lässt sich nicht nachvollziehbar ermitteln | der Prozessstatus wird nicht explizit aus den Fachereignissen aggregiert | eine aggregierte, nachvollziehbare Prozessstatus-Sicht aus den Fachereignissen aufbauen |
| unterschiedliche Teams müssen sich über technische Implementierungsdetails abstimmen, um auf ein Ereignis zu reagieren | die Ereignisse sind technisch statt fachlich benannt | die Ereignisse auf fachlich bedeutungsvolle Namen umstellen |

Security: Fachereignisse, die sensible Daten enthalten (etwa Zahlungsinformationen), sollten nur die tatsächlich benötigten Felder übertragen, statt vollständige interne Datenstrukturen offenzulegen. Observability: Die tatsächliche Nachvollziehbarkeit eines vollständigen Prozessstatus über alle beteiligten Systeme hinweg ist ein zentrales Signal zur Bewertung der Architekturqualität.

## Trade-offs und Entscheidungen

**Staff** implementiert einen korrekt benannten, fachlichen Domain Event für ein gegebenes Szenario. **Principal** entwirft die vollständige Event-Driven-Commerce-Architektur mit expliziter Ownership für ein Commerce-Vorhaben. **Chief** legt unternehmensweite Standards für Fachereignis-Benennung und Ownership-Dokumentation fest.

Anti-Patterns: Ereignisse technisch statt fachlich benennen; Systeme implizit ohne dokumentierte Ownership aufeinander reagieren lassen; den Gesamtprozessstatus nicht explizit aggregieren, sondern implizit aus verstreuten Einzelzuständen ableiten müssen.

## Production Checklist

- [ ] Alle Fachereignisse sind fachlich bedeutungsvoll benannt und dokumentiert.
- [ ] Für jedes Fachereignis ist das auslösende System explizit dokumentiert.
- [ ] Für jedes Fachereignis ist dokumentiert, welche Systeme tatsächlich darauf reagieren.
- [ ] Der Gesamtprozessstatus wird aggregiert und nachvollziehbar dargestellt.

## Interviewfragen

### 1. Was unterscheidet ein Fachereignis von einem technischen Ereignis?

**Antwort:** Ein Fachereignis ist fachlich bedeutungsvoll benannt (etwa "Bestellung bezahlt"), sodass beteiligte Systeme verstehen, was fachlich geschehen ist, ohne die interne Implementierung des auslösenden Systems zu kennen.

### 2. Warum wird unübersichtliche technische Choreografie als problematisch angesehen?

**Antwort:** Weil Systeme implizit ohne explizite Ownership-Zuordnung aufeinander reagieren, wodurch bei einem Fehler nicht mehr nachvollziehbar ist, welches System tatsächlich verantwortlich war.

### 3. Was bedeutet Ownership eines Fachereignisses?

**Antwort:** Die eindeutige, dokumentierte Zuordnung, welches System das Ereignis tatsächlich auslöst und welche Systeme tatsächlich darauf reagieren.

### 4. Warum muss der Prozessstatus explizit aggregiert statt implizit rekonstruiert werden?

**Antwort:** Damit zu jedem Zeitpunkt nachvollziehbar erkennbar ist, welche Schritte eines Gesamtprozesses bereits abgeschlossen sind, statt den Status aus verstreuten Einzelzuständen ableiten zu müssen.

### 5. Wie gehst du vor, wenn bei einem fehlgeschlagenen Bestellabwicklungsschritt unklar ist, welches System verantwortlich ist?

**Antwort:** Ich prüfe, ob eine explizite Ownership-Zuordnung für die beteiligten Fachereignisse existiert, und dokumentiere diese, falls sie fehlt.

### 6. Widersprüchliche Anforderung: Das Entwicklerteam will schnelle, direkte Punkt-zu-Punkt-Integration zwischen zwei Services für eine dringende Anforderung UND die Organisation will konsequente Event-Driven-Koordination mit expliziter Ownership — wie gehst du vor?

**Antwort:** Ich würde auch die dringende Integration als benanntes Fachereignis mit dokumentierter Ownership modellieren, selbst wenn die technische Umsetzung zunächst als direkter Aufruf erfolgt, sodass eine spätere Migration zu vollständiger Event-Driven-Koordination ohne Neuentwurf der fachlichen Struktur möglich bleibt.

## Praktische Labs

~~~python
# Local, deterministic illustration of domain events with explicit ownership vs. implicit choreography (executed locally, no real commerce system):

domain_events = {
    "order.paid": {"owner": "payment_service", "reactors": ["inventory_service", "notification_service"]},
    "stock.reserved": {"owner": "inventory_service", "reactors": ["shipping_service"]},
}

def trace_failure(failed_event):
    event = domain_events.get(failed_event)
    if not event:
        return "unknown event: no ownership documented, root cause unclear"
    return f"owner: {event['owner']}, check reactors: {event['reactors']}"

print(trace_failure("stock.reserved"))
print(trace_failure("undocumented.internal.signal"))
~~~

## Dependencies, Cross-References und Quellen

1. Martin Fowler: [Domain Event Pattern](https://martinfowler.com/eaaDev/DomainEvent.html), abgerufen 2026-09-18.
2. Chris Richardson: [Microservices.io — Transactional Outbox Pattern](https://microservices.io/patterns/data/transactional-outbox.html), abgerufen 2026-09-18.

Dieses Kapitel erweitert die in KB-0669 (Commerce-Webhooks) behandelten externen Ereignisse um die interne, fachliche Ereigniskoordination zwischen Bestellung, Bestand und Versand.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte Event-Kataloge (Schema-Registries für Domain Events) zur unternehmensweiten Konsistenz der Fachereignis-Benennung und -Struktur | Growing Adoption | Bei künftigen Neuvorhaben mit mehreren beteiligten Teams evaluieren, jedoch bei kleineren, überschaubaren Vorhaben weiterhin auf direkt dokumentierte, projektspezifische Event-Kataloge setzen. |

Ein Team akzeptiert eine Event-Driven-Commerce-Architektur erst, wenn Fachereignisse fachlich benannt, Ownership explizit dokumentiert und der Gesamtprozessstatus nachvollziehbar aggregiert sind.
