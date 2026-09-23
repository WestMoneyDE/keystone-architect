---
{"id": "KB-0603", "title": "Enterprise-Integrationsarchitektur", "domain": "25", "sequence": 15, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0591", "concepts": ["Application Architecture im Unternehmen"], "needed_for": "understanding"}, {"id": "KB-0602", "concepts": ["Architekturprinzipien"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "API-, Event- und Batch-Integrationsmuster anhand etablierter Praxis korrekt auswählen und mit expliziten Verträgen und Verantwortungsgrenzen für eine konkrete, heterogene Systemlandschaft anwenden können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie unternehmensweite Integrationsstandards (API, Event, Batch) mit klaren Vertrags- und Verantwortungsgrenzen auf eine heterogene, historisch gewachsene Geschäftslandschaft angewendet werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Integration zwischen zwei Systemen an einer unklaren Verantwortungsgrenze (wer garantiert welchen Vertrag) statt an einer technischen Fehlfunktion scheitert, und die Ursache entsprechend zuordnen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Integrationsmuster, Verträge und Verantwortungsgrenzen festlegen, die konsistente Integration über heterogene, historisch gewachsene Systemlandschaften hinweg ermöglichen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte technische Implementierung einzelner Integrationsmuster (API-Design, Event-Broker-Konfiguration, Batch-Job-Scheduling) ist bereits in den jeweiligen technischen Domains dieses Curriculums behandelt.", "rationale": "Kern ist die unternehmensweite Ordnung von Integrationsmustern, Verträgen und Verantwortungsgrenzen, nicht die technische Detailimplementierung einzelner Muster."}}, "lab_validation": [{"lab_id": "KB-0603-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Erkennung unklarer Verantwortungsgrenzen bei einer Integration, kein produktives EA-Tool verwendet", "evidence": "Ein lokales Skript prüft eine Liste von Integrationen zwischen Systemen darauf, ob ein expliziter Vertrag (Schema, Garantien) und eine benannte, verantwortliche Partei für dessen Einhaltung dokumentiert sind, und markiert Integrationen ohne beides als Risiko für unklare Fehlerzuordnung.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales EA-Tool."}]}
---
# Enterprise-Integrationsarchitektur

> **Ziel:** Enterprise-Integrationsarchitektur ordnet, wie Anwendungen (siehe die bereits in [KB-0591](03-application-architecture-im-unternehmen.md) behandelte Application Architecture) unternehmensweit über **API**-, **Event**- und **Batch**-Muster integriert werden, mit expliziten **Verträgen** (was eine Integration verlässlich garantiert) und klaren **Verantwortungsgrenzen** (wer für die Einhaltung dieses Vertrags tatsächlich verantwortlich ist). Der zentrale Punkt dieses Kapitels ist, dass diese unternehmensweite Standardisierung auf eine typischerweise **heterogene, historisch gewachsene Geschäftslandschaft** angewendet werden muss — eine Organisation kann selten voraussetzen, dass alle Systeme gleichzeitig auf denselben, modernen Integrationsstandard umgestellt werden, weshalb Integrationsarchitektur explizit regeln muss, wie unterschiedliche Integrationsmuster (etwa ein modernes, event-basiertes System neben einem älteren, ausschließlich batch-basierten System) koexistieren und dennoch konsistente Verträge und Verantwortungsgrenzen einhalten können.

## Zweck, Mental Model und Dependencies

Die drei Integrationsmuster unterscheiden sich grundlegend in ihrer zeitlichen Kopplung: API-basierte Integration (synchrone Anfrage-Antwort-Kommunikation) eignet sich für Fälle, die eine unmittelbare Antwort benötigen, Event-basierte Integration (asynchrone Benachrichtigung über eingetretene Ereignisse) eignet sich für Fälle, bei denen mehrere Systeme unabhängig auf denselben Sachverhalt reagieren müssen, ohne dass der Ereignisproduzent die Konsumenten kennen muss, und Batch-Integration (periodische, gesammelte Datenübertragung) eignet sich für Fälle, bei denen keine unmittelbare Aktualität benötigt wird oder ein Altsystem keine andere Integrationsform unterstützt. Die eigentliche architektonische Herausforderung liegt nicht in der technischen Wahl eines einzelnen Musters, sondern in der konsistenten Vertrags- und Verantwortungsgestaltung über die gesamte, heterogene Landschaft hinweg: Ein Vertrag legt explizit fest, was eine Integration verlässlich garantiert (etwa Datenschema, Aktualisierungsfrequenz, Fehlerverhalten bei Nichtverfügbarkeit) — ohne einen expliziten Vertrag bleibt unklar, worauf sich ein konsumierendes System tatsächlich verlassen kann, und Änderungen am produzierenden System können unerwartet und unbemerkt zu Fehlern bei Konsumenten führen. Verantwortungsgrenzen ergänzen den Vertrag um die organisatorische Dimension: Wenn eine Integration fehlschlägt oder ein Vertrag nicht eingehalten wird, muss eindeutig feststehen, welche Partei (welches Team, welche Organisationseinheit) tatsächlich für die Behebung verantwortlich ist — eine Integration ohne explizit benannte Verantwortungsgrenze führt bei einem Fehler typischerweise zu einer Verzögerung, während unklar bleibt, welches Team tatsächlich zuständig ist, statt dass die Fehlerbehebung unmittelbar beginnen kann. Die Anwendung auf eine heterogene, historisch gewachsene Landschaft bedeutet, dass Integrationsarchitektur nicht voraussetzen kann, dass jedes System das aktuellste, bevorzugte Muster unterstützt — stattdessen muss explizit definiert werden, wie ältere, technisch eingeschränkte Systeme (etwa nur batch-fähige Altsysteme) über geeignete Übergangsmechanismen (etwa einen Adapter, der Batch-Daten in Events übersetzt) dennoch konsistent in die unternehmensweite Integrationsstandardisierung eingebunden werden können.

~~~text
Enterprise Integration Architecture: orders how apps (KB-0591) are integrated enterprise-wide
  via API/EVENT/BATCH patterns, with explicit CONTRACTS (what an integration reliably guarantees)
  and clear RESPONSIBILITY BOUNDARIES (who is actually responsible for honoring that contract)
KEY POINT: this enterprise-wide standardization must apply to a typically
  HETEROGENEOUS, HISTORICALLY-GROWN business landscape
  org rarely can assume all systems simultaneously moved to same, modern integration standard
  -> integration architecture must explicitly regulate how different patterns
     (e.g. modern event-based system alongside older, batch-only system) coexist
     while still honoring consistent contracts + responsibility boundaries
THREE PATTERNS differ fundamentally in TIME COUPLING:
  API (sync request-response): suits cases needing immediate response
  EVENT (async notification of occurred events): suits cases where multiple systems independently
    react to same fact, w/o event producer needing to know consumers
  BATCH (periodic, collected data transfer): suits cases w/o need for immediate freshness,
    or where a legacy system supports no other integration form
ACTUAL architectural challenge: NOT technical choice of a single pattern
  but CONSISTENT contract + responsibility design across the whole heterogeneous landscape
CONTRACT explicitly defines what an integration reliably guarantees
  (data schema, update frequency, error behavior on unavailability)
  w/o explicit contract -> unclear what consuming system can actually rely on
    -> changes to producing system can unexpectedly+unnoticed break consumers
RESPONSIBILITY BOUNDARIES add organizational dimension to contract
  when integration fails / contract not honored -> must be UNAMBIGUOUS which party
    (which team, org unit) is actually responsible for fixing it
  integration w/o explicitly named responsibility boundary -> on failure, typically delay
    while unclear which team is actually responsible, instead of fix starting immediately
APPLICATION to heterogeneous, historically-grown landscape:
  integration architecture cannot assume every system supports latest, preferred pattern
  must explicitly define how older, technically constrained systems (batch-only legacy)
    still get consistently integrated into enterprise-wide standardization
    via suitable transition mechanisms (e.g. adapter translating batch data into events)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| API-Integration | synchrone Anfrage-Antwort-Kommunikation | für Fälle mit Bedarf an unmittelbarer Antwort |
| Event-Integration | asynchrone Benachrichtigung über eingetretene Ereignisse | entkoppelt Produzent und Konsumenten |
| Batch-Integration | periodische, gesammelte Datenübertragung | für Altsysteme ohne Echtzeitfähigkeit |
| Vertrag und Verantwortungsgrenze | garantiert Verlässlichkeit und benennt Zuständigkeit | zentral für koexistierende, heterogene Muster |

Implementierung: Jede Integration wird mit einem expliziten Vertrag (Schema, Aktualisierungsfrequenz, Fehlerverhalten) und einer benannten, verantwortlichen Partei dokumentiert. Für Altsysteme, die moderne Integrationsmuster nicht unterstützen, werden explizite Übergangsmechanismen (Adapter) definiert, die dennoch konsistente Verträge einhalten. Die Wahl des Integrationsmusters (API, Event, Batch) erfolgt anhand der tatsächlichen zeitlichen Kopplungsanforderung des jeweiligen Anwendungsfalls.

## Scalability, Reliability, Security und Observability

Enterprise-Integrationsarchitektur skaliert die Konsistenz und Verlässlichkeit unternehmensweiter Systemintegration proportional zur Klarheit von Verträgen und Verantwortungsgrenzen über heterogene Systeme hinweg; die Reliability-Grenze liegt darin, dass eine Integration ohne expliziten Vertrag oder benannte Verantwortungsgrenze bei einem Fehler zu Verzögerung und unklarer Zuständigkeit führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Änderung an einem produzierenden System bricht unerwartet ein konsumierendes System | kein expliziter Vertrag definierte, worauf sich das konsumierende System verlassen konnte | einen expliziten Vertrag mit Schema und Änderungsankündigungsprozess einführen |
| ein Integrationsfehler bleibt ungewöhnlich lange unbehoben | keine benannte, verantwortliche Partei für diese Integration ist dokumentiert | eine explizite Verantwortungsgrenze mit benannter, zuständiger Partei festlegen |
| ein Altsystem kann nicht konsistent in die unternehmensweite Integrationsstandardisierung eingebunden werden | kein geeigneter Übergangsmechanismus (Adapter) für das technisch eingeschränkte System existiert | einen Adapter einführen, der das Altsystem-Muster auf den unternehmensweiten Standard übersetzt |

Security: Verträge für Integrationen mit sensiblen Daten sollten explizit Zugriffskontrolle und Datenschutzanforderungen als Vertragsbestandteil enthalten. Observability: Die tatsächliche Vertragskonformität (wie oft eine Integration tatsächlich ihren dokumentierten Vertrag einhält) ist ein zentrales Signal zur Bewertung der Integrationsarchitektur-Qualität.

## Trade-offs und Entscheidungen

**Staff** wählt für eine gegebene Integration das passende Muster und dokumentiert Vertrag und Verantwortung korrekt. **Principal** entwirft die vollständige Integrationsarchitektur mit konsistenten Standards über eine heterogene Systemlandschaft für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für Integrationsmuster, Verträge und Verantwortungsgrenzen fest.

Anti-Patterns: Integrationen ohne expliziten Vertrag betreiben, sodass Änderungen unerwartet Konsumenten brechen; keine benannte Verantwortungsgrenze für eine Integration dokumentieren; Altsysteme ohne geeigneten Übergangsmechanismus von der unternehmensweiten Integrationsstandardisierung ausschließen, statt sie konsistent einzubinden.

## Production Checklist

- [ ] Jede Integration hat einen expliziten Vertrag (Schema, Aktualisierungsfrequenz, Fehlerverhalten).
- [ ] Jede Integration hat eine benannte, verantwortliche Partei für die Einhaltung des Vertrags.
- [ ] Altsysteme sind über geeignete Übergangsmechanismen konsistent in die Standardisierung eingebunden.
- [ ] Die Wahl des Integrationsmusters (API, Event, Batch) ist anhand der tatsächlichen zeitlichen Kopplungsanforderung begründet.

## Interviewfragen

### 1. Wodurch unterscheiden sich API-, Event- und Batch-Integrationsmuster grundlegend?

**Antwort:** Durch ihre zeitliche Kopplung — API ist synchrone Anfrage-Antwort-Kommunikation, Event ist asynchrone Benachrichtigung mit entkoppeltem Produzenten und Konsumenten, Batch ist periodische, gesammelte Übertragung ohne Echtzeitanspruch.

### 2. Warum ist ein expliziter Vertrag für eine Integration notwendig?

**Antwort:** Weil ohne ihn unklar bleibt, worauf sich ein konsumierendes System verlassen kann, und Änderungen am produzierenden System unerwartet und unbemerkt zu Fehlern bei Konsumenten führen können.

### 3. Was passiert bei einem Integrationsfehler ohne benannte Verantwortungsgrenze?

**Antwort:** Es entsteht typischerweise eine Verzögerung, während unklar bleibt, welches Team tatsächlich für die Behebung zuständig ist, statt dass die Fehlerbehebung unmittelbar beginnen kann.

### 4. Warum kann Enterprise-Integrationsarchitektur nicht voraussetzen, dass alle Systeme dasselbe Muster unterstützen?

**Antwort:** Weil reale Organisationen typischerweise eine heterogene, historisch gewachsene Systemlandschaft mit unterschiedlich modernen Systemen haben, weshalb Übergangsmechanismen für technisch eingeschränkte Altsysteme notwendig sind.

### 5. Wie gehst du vor, wenn eine Änderung an einem produzierenden System unerwartet ein konsumierendes System bricht?

**Antwort:** Ich prüfe, ob ein expliziter Vertrag existierte, der definierte, worauf sich das konsumierende System verlassen konnte, und führe einen solchen Vertrag mit Änderungsankündigungsprozess ein, falls er fehlte.

### 6. Widersprüchliche Anforderung: Die Organisation will einen einzigen, modernen Integrationsstandard UND mehrere Altsysteme können diesen technisch nicht unterstützen — wie gehst du vor?

**Antwort:** Ich würde für die technisch eingeschränkten Altsysteme explizite Übergangsmechanismen (Adapter) definieren, die deren Muster auf den unternehmensweiten Standard übersetzen, statt entweder den modernen Standard vollständig aufzugeben oder die Altsysteme inkonsistent von der Integrationsarchitektur auszuschließen.

## Praktische Labs

~~~python
# Local, deterministic simulation of detecting missing contracts/responsibility boundaries (executed locally, no real EA tool):

def check_integration(integration):
    has_contract = integration.get("contract") is not None
    has_owner = integration.get("responsible_party") is not None
    return {"integration": integration["name"], "risk": not (has_contract and has_owner)}

integrations = [
    {"name": "OrderService-to-Billing", "contract": {"schema": "OrderEventV2"}, "responsible_party": "Billing Team"},
    {"name": "LegacyReporting-to-CRM", "contract": None, "responsible_party": None},
]

for i in integrations:
    print(check_integration(i))
~~~

## Dependencies, Cross-References und Quellen

1. The Open Group: [TOGAF Standard, 10th Edition — Integration Architecture](https://pubs.opengroup.org/togaf-standard/introduction/), abgerufen 2026-09-18.
2. Gregor Hohpe, Bobby Woolf: [Enterprise Integration Patterns — Overview](https://www.enterpriseintegrationpatterns.com/patterns/messaging/), abgerufen 2026-09-18.

Application Architecture im Unternehmen ist kanonisch in [KB-0591](03-application-architecture-im-unternehmen.md) behandelt; Architekturprinzipien in [KB-0602](14-architekturprinzipien.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Vertragskonformitätsprüfung (Contract Testing) zwischen Produzenten und Konsumenten als Ergänzung zu manuell dokumentierten Verträgen | Evaluating | Für kritische Integrationen als kontinuierliche Absicherung einführen, jedoch die ursprüngliche Vertragsdefinition weiterhin als explizite, dokumentierte Entscheidung zwischen den beteiligten Parteien behandeln. |

Ein Team akzeptiert eine Enterprise-Integrationsarchitektur erst, wenn jede Integration nachweislich einen expliziten Vertrag und eine benannte Verantwortungsgrenze hat und Altsysteme konsistent über geeignete Übergangsmechanismen eingebunden sind.
