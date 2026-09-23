---
{"id": "KB-0672", "title": "WMS-Integration und Fulfillment", "domain": "29", "sequence": 10, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "ENTERPRISE"], "requires": [{"id": "KB-0665", "concepts": ["Order State Machines", "Fachliche Guards"], "needed_for": "Lageraufträge und Pick-/Pack-Status sind konkrete Zustände, die in die in KB-0665 beschriebene Order State Machine einfließen"}], "related": ["KB-0671"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Lageraufträge, Pick-/Pack-Status und Versandmeldungen korrekt integrieren und für ein gegebenes Szenario Teilmengen und Retouren kontrolliert gegenüber Commerce-Erwartungen abgleichen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein Commerce-Vorhaben explizit gestalten, wie verspätete WMS-Rückmeldungen kontrolliert in die Order State Machine einfließen, ohne inkonsistente Zwischenzustände zu erzeugen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Teilmengen-Rückmeldung vom WMS fälschlich als vollständige Erfüllung behandelt wird, obwohl tatsächlich nur ein Teil der Bestellung versendet wurde.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für WMS-Commerce-Integration festlegen, die kontrollierten Abgleich von Teilmengen, Retouren und verspäteten Rückmeldungen vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, produktspezifische WMS-Konnektorimplementierung im Detail ist Vertiefung und außerhalb des in diesem Kapitel behandelten konzeptionellen Rahmens.", "rationale": "Kern ist die strukturelle Integration von Lageraufträgen und Fulfillment-Status in die Order State Machine, nicht die produktspezifische WMS-Anbindung."}}, "lab_validation": [{"lab_id": "KB-0672-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Veranschaulichung des kontrollierten Abgleichs von Teilmengen-Rückmeldungen, kein reales WMS verwendet", "evidence": "Ein lokales Skript simuliert eine WMS-Rückmeldung, die nur einen Teil einer Bestellung als versendet meldet, und zeigt, dass die Order State Machine korrekt in einen Teilerfüllungszustand statt fälschlich in den Zustand vollständiger Erfüllung übergeht.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales WMS oder reale Lagerprozesse getestet."}]}
---
# WMS-Integration und Fulfillment

> **Ziel:** Die WMS-Integration verbindet die Order State Machine (siehe KB-0665) mit dem physischen Erfüllungsprozess im Warehouse Management System, über drei Mechanismen: **Lageraufträge** (die Übermittlung einer Bestellung als konkreten Kommissionierauftrag an das WMS), **Pick-/Pack-Status** (Rückmeldungen des WMS über den tatsächlichen Fortschritt der physischen Kommissionierung und Verpackung) und **Versandmeldungen** (die finale Rückmeldung, dass eine Sendung tatsächlich das Lager verlassen hat, meist mit Trackinginformation). Der zentrale Punkt dieses Kapitels ist, dass WMS-Rückmeldungen kontrolliert, nicht ungeprüft in die Order State Machine einfließen müssen — insbesondere Teilmengen-Rückmeldungen (wenn tatsächlich nur ein Teil einer Bestellung physisch verfügbar und versandt wurde) dürfen nicht fälschlich als vollständige Erfüllung interpretiert werden, da dies zu einer Bestellung führen würde, die als abgeschlossen gilt, obwohl der Kunde tatsächlich nur einen Teil seiner Bestellung erhalten hat.

## Zweck, Mental Model und Dependencies

Lageraufträge übersetzen eine im Commerce-System entstandene Bestellung in einen konkreten, für das WMS verständlichen Kommissionierauftrag — diese Übersetzung muss tatsächlich alle für die physische Kommissionierung relevanten Informationen enthalten (Artikel, Menge, Priorität, Lieferadresse), da ein unvollständiger Lagerauftrag tatsächlich zu einer fehlerhaften oder unvollständigen physischen Erfüllung führen kann. Pick-/Pack-Status-Rückmeldungen zeigen den tatsächlichen Fortschritt der physischen Erfüllung — diese Rückmeldungen müssen als eigene, granulare Zwischenzustände in der Order State Machine (siehe KB-0665) abgebildet werden, statt den gesamten physischen Prozess als einen einzigen, undifferenzierten "in Bearbeitung"-Zustand zu behandeln, da eine granulare Abbildung tatsächlich eine präzisere Kommunikation mit dem Kunden über den tatsächlichen Bestellstatus ermöglicht. Versandmeldungen sind die finale, kritische Rückmeldung, die den Übergang zum Zustand "versendet" in der Order State Machine tatsächlich auslöst — diese Rückmeldung muss, entsprechend dem in KB-0669 beschriebenen Prinzip kontrollierter externer Rückmeldungsverarbeitung, gegen den aktuellen Bestellzustand geprüft werden, bevor der Übergang tatsächlich ausgeführt wird. Teilmengen-Rückmeldungen sind der komplexeste Fall: Wenn das WMS meldet, dass nur ein Teil der bestellten Artikel tatsächlich verfügbar und versandt wurde (etwa weil ein Artikel tatsächlich nicht vorrätig war, obwohl das Commerce-System ihn als verfügbar auswies), muss die Order State Machine dies als expliziten Teilerfüllungszustand abbilden, statt die Teilrückmeldung fälschlich als vollständige Erfüllung zu interpretieren — diese Unterscheidung ist entscheidend, da eine fälschlich als vollständig markierte Teillieferung tatsächlich zu einem Kunden führt, der eine unvollständige Bestellung erhält, ohne dass das System dies korrekt kommuniziert. Retouren und verspätete Rückmeldungen (etwa eine Versandmeldung, die tatsächlich erst deutlich nach dem physischen Versand beim Commerce-System ankommt) erfordern denselben kontrollierten, idempotenten Verarbeitungsansatz wie in KB-0669 für Webhooks beschrieben — eine verspätete oder erneut zugestellte Rückmeldung darf keinen bereits abgeschlossenen Zustandsübergang erneut oder fälschlich auslösen.

~~~text
WMS Integration connects Order State Machine (see KB-0665) w/ physical fulfillment
  process in warehouse management system via 3 mechanisms
  WAREHOUSE ORDERS: transmission of an order as concrete picking order to WMS
  PICK/PACK STATUS: WMS feedback on ACTUAL progress of physical picking+packing
  SHIPPING NOTIFICATIONS: final feedback that a shipment ACTUALLY left warehouse,
  usually w/ tracking info
KEY POINT: WMS feedback must flow into order state machine in a controlled, NOT unchecked
  way -- esp. partial-quantity feedback (only part of order ACTUALLY physically
  available+shipped) must NOT be falsely interpreted as complete fulfillment, since this
  would lead to an order considered complete although customer ACTUALLY only received
  part of their order
WAREHOUSE ORDERS translate a commerce-system-originated order into concrete, WMS-
  understandable picking order -- this translation must ACTUALLY contain all info
  relevant for physical picking (item, quantity, priority, delivery address), since
  incomplete warehouse order CAN ACTUALLY lead to faulty or incomplete physical
  fulfillment
PICK/PACK STATUS feedback shows ACTUAL progress of physical fulfillment -- must be
  mapped as own, granular intermediate states in order state machine (see KB-0665)
  instead of treating entire physical process as single, undifferentiated "processing"
  state, since granular mapping ACTUALLY enables more precise customer communication
  about actual order status
SHIPPING NOTIFICATIONS = final, critical feedback ACTUALLY triggering "shipped" state
  transition in order state machine -- per KB-0669's controlled external callback
  processing principle, must be checked against current order state before transition
  ACTUALLY executes
PARTIAL-QUANTITY FEEDBACK = most complex case: when WMS reports only part of ordered
  items ACTUALLY available+shipped (item ACTUALLY out of stock although commerce system
  showed it available), order state machine must map this as explicit partial-
  fulfillment state instead of falsely interpreting partial feedback as complete
  fulfillment
  this distinction decisive since falsely-marked-complete partial delivery ACTUALLY
  leads to customer receiving incomplete order w/o system correctly communicating this
RETURNS + DELAYED FEEDBACK (shipping notification ACTUALLY arriving substantially after
  physical shipment) require same controlled, idempotent processing approach as
  KB-0669's webhooks -- delayed or redelivered feedback must not trigger an already-
  completed transition again or falsely
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Lageraufträge | übersetzen Bestellung in vollständigen Kommissionierauftrag | unvollständiger Auftrag führt zu fehlerhafter Erfüllung |
| Granulare Pick-/Pack-Zwischenzustände | präzise Abbildung des physischen Fortschritts | ermöglicht genaue Kundenkommunikation |
| Kontrollierte Versandmeldungsverarbeitung | prüft Rückmeldung gegen aktuellen Zustand | verhindert ungültige oder doppelte Übergänge |
| Expliziter Teilerfüllungszustand | unterscheidet Teil- von Vollerfüllung | verhindert fälschliche Kennzeichnung als vollständig |

Implementierung: Lageraufträge enthalten alle für die Kommissionierung relevanten Informationen vollständig. Pick-/Pack-Status wird als granulare Zwischenzustände in der Order State Machine abgebildet. Teilmengen-Rückmeldungen führen explizit zu einem Teilerfüllungszustand statt fälschlich zu vollständiger Erfüllung. Versandmeldungen werden idempotent und gegen den aktuellen Zustand geprüft verarbeitet.

## Scalability, Reliability, Security und Observability

Eine WMS-Integrationsarchitektur skaliert über die Anzahl gleichzeitig verarbeiteter Lageraufträge; die Reliability-Grenze liegt darin, dass eine fälschlich als vollständig interpretierte Teilmengen-Rückmeldung tatsächlich zu unvollständig erfüllten, aber als abgeschlossen markierten Bestellungen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Kunde erhält nur einen Teil seiner Bestellung, obwohl diese als vollständig erfüllt markiert wurde | eine Teilmengen-Rückmeldung wurde fälschlich als vollständige Erfüllung interpretiert | einen expliziten Teilerfüllungszustand einführen, der Teilmengen-Rückmeldungen korrekt abbildet |
| eine verspätete Versandmeldung löst einen bereits abgeschlossenen Übergang erneut aus | die Versandmeldungsverarbeitung ist nicht idempotent gegen den aktuellen Zustand | eine Idempotenzprüfung analog zu KB-0669 für Versandmeldungen einführen |
| eine physische Kommissionierung schlägt aufgrund fehlender Informationen fehl | der übermittelte Lagerauftrag war unvollständig | den Lagerauftrag um die fehlenden, für die Kommissionierung relevanten Informationen ergänzen |

Security: WMS-Rückmeldungen sollten authentifiziert und gegen die erwartete Quelle verifiziert werden, analog zur in KB-0669 beschriebenen Webhook-Signaturprüfung. Observability: Die tatsächliche Häufigkeit von Teilmengen-Rückmeldungen ist ein zentrales Signal zur Bewertung, ob die Verfügbarkeitsprüfung im Commerce-System (siehe KB-0666) tatsächlich mit dem physischen Bestand übereinstimmt.

## Trade-offs und Entscheidungen

**Staff** implementiert eine korrekte Verarbeitung einer WMS-Rückmeldung für ein gegebenes Szenario. **Principal** entwirft die vollständige WMS-Integrationsarchitektur mit granularen Zwischenzuständen und Teilerfüllungsbehandlung. **Chief** legt unternehmensweite Standards für WMS-Commerce-Integration fest, die expliziten Teilerfüllungszustand und kontrollierte Rückmeldungsverarbeitung vorschreiben.

Anti-Patterns: Teilmengen-Rückmeldungen fälschlich als vollständige Erfüllung behandeln; den gesamten physischen Fulfillment-Prozess als einen einzigen, undifferenzierten Zustand abbilden; WMS-Rückmeldungen ungeprüft und nicht-idempotent verarbeiten.

## Production Checklist

- [ ] Lageraufträge enthalten alle für die Kommissionierung relevanten Informationen vollständig.
- [ ] Pick-/Pack-Status ist als granulare Zwischenzustände in der Order State Machine abgebildet.
- [ ] Teilmengen-Rückmeldungen führen explizit zu einem eigenen Teilerfüllungszustand.
- [ ] Versandmeldungen werden idempotent und gegen den aktuellen Bestellzustand geprüft verarbeitet.

## Interviewfragen

### 1. Warum dürfen Teilmengen-Rückmeldungen vom WMS nicht als vollständige Erfüllung behandelt werden?

**Antwort:** Weil dies dazu führen würde, dass eine Bestellung als abgeschlossen gilt, obwohl der Kunde tatsächlich nur einen Teil seiner Bestellung erhalten hat.

### 2. Warum sollte Pick-/Pack-Status als granulare Zwischenzustände statt als ein einziger "in Bearbeitung"-Zustand abgebildet werden?

**Antwort:** Weil eine granulare Abbildung eine präzisere Kommunikation mit dem Kunden über den tatsächlichen Bestellstatus ermöglicht.

### 3. Was passiert, wenn ein Lagerauftrag unvollständige Informationen enthält?

**Antwort:** Dies kann tatsächlich zu einer fehlerhaften oder unvollständigen physischen Erfüllung führen, da dem WMS die für die Kommissionierung relevanten Informationen fehlen.

### 4. Warum müssen Versandmeldungen idempotent verarbeitet werden?

**Antwort:** Weil eine verspätete oder erneut zugestellte Versandmeldung sonst einen bereits abgeschlossenen Zustandsübergang erneut oder fälschlich auslösen könnte.

### 5. Wie gehst du vor, wenn ein Kunde nur einen Teil seiner Bestellung erhält, obwohl diese als vollständig erfüllt markiert wurde?

**Antwort:** Ich prüfe, ob eine Teilmengen-Rückmeldung fälschlich als vollständige Erfüllung interpretiert wurde, und führe einen expliziten Teilerfüllungszustand ein, der solche Rückmeldungen korrekt abbildet.

### 6. Widersprüchliche Anforderung: Das Logistikteam will minimale technische Komplexität mit einem einzigen, vereinfachten Erfüllungsstatus UND die Organisation will präzise Kundenkommunikation über jeden physischen Fulfillment-Schritt — wie gehst du vor?

**Antwort:** Ich würde die Order State Machine um eine begrenzte Anzahl fachlich bedeutungsvoller, granularer Zwischenzustände erweitern (etwa "kommissioniert", "verpackt", "teilweise versendet", "versendet"), statt entweder einen einzigen, undifferenzierten Status oder eine übermäßig feingranulare, technisch komplexe Zustandsliste zu verwenden.

## Praktische Labs

~~~python
# Local, deterministic illustration of correctly handling partial-quantity fulfillment feedback (executed locally, no real WMS):

def apply_fulfillment_feedback(ordered_qty, shipped_qty):
    if shipped_qty >= ordered_qty:
        return "fulfilled"
    if 0 < shipped_qty < ordered_qty:
        return "partially_fulfilled"
    return "unfulfilled"

print(apply_fulfillment_feedback(ordered_qty=5, shipped_qty=3))
print(apply_fulfillment_feedback(ordered_qty=5, shipped_qty=5))
~~~

## Dependencies, Cross-References und Quellen

1. GS1: [GS1 Standards — EDI for Warehouse and Fulfillment Processes](https://www.gs1.org/standards), abgerufen 2026-09-18.
2. Medusa: [Medusa Fulfillment Module Documentation](https://docs.medusajs.com/resources/commerce-modules/fulfillment), abgerufen 2026-09-18.

Dieses Kapitel konkretisiert die in KB-0665 (Order State Machines) beschriebene Zustandsmodellierung auf die physische Fulfillment-Ebene und baut auf der in KB-0671 (ERP-Integration) beschriebenen Datenführungsarchitektur auf.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte, herstellerübergreifende Fulfillment-Status-Schemata zur Vereinheitlichung granularer Pick-/Pack-Zwischenzustände über unterschiedliche WMS-Anbieter hinweg | Emerging | Bei künftigen Neuvorhaben mit mehreren WMS-Anbietern evaluieren, jedoch bei bestehenden, einzelnen WMS-Integrationen weiterhin auf die etablierten, projektspezifischen Zwischenzustände setzen. |

Ein Team akzeptiert eine WMS-Integrationsarchitektur erst, wenn granulare Zwischenzustände, expliziter Teilerfüllungszustand und idempotente Rückmeldungsverarbeitung nachweislich implementiert sind.
