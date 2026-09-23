---
{"id": "KB-0132", "title": "Domain Events und Fachereignisse", "domain": "06", "sequence": 4, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0131", "concepts": ["Aggregat", "Invariante"], "needed_for": "both"}], "related": ["KB-0138", "KB-0562", "KB-0720"], "applies": ["KB-0138", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Domain Event aus einer Aggregatsänderung ableiten und von einem technischen Integrationsereignis unterscheiden.", "rationale": "Kein reales Messaging-System nötig, um das Modellierungsprinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Domain Events mit fachlich bedeutsamem, stabilem Payload statt technischer Feldkopie entwerfen.", "rationale": "Ein zu technischer Payload koppelt Consumer eng an die interne Datenstruktur des Producers."}, "STAFF-TARGET": {"active": true, "scope": "Eine Consumer-Kopplungsprobleme auf einen zu technischen Event-Payload zurückführen.", "rationale": "Das ist eine häufige, unterschätzte Ursache für brüchige Event-getriebene Integrationen."}, "CHIEF-TARGET": {"active": true, "scope": "Domain-Event-Design-Standards (fachlicher statt technischer Payload) als Governance für Event-getriebene Architekturen festlegen.", "rationale": "Uneinheitliches Event-Design erzeugt organisationsweite Kopplungsschulden."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Event-Versionierung und Schema-Evolution-Strategien für Domain Events sind Vertiefung.", "rationale": "Kern ist die Unterscheidung fachlich/technisch und die Abgrenzung zu Integrationsereignissen."}}, "lab_validation": [{"lab_id": "KB-0132-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Modell für Domain Event versus technisches Integrationsereignis", "evidence": "Ein Event mit Payload 'OrderConfirmed{orderId, totalAmount}' bleibt stabil bei internen Refactorings, während ein Event mit vollständigem internen Datenbank-Row-Dump bei jeder Schema-Änderung bricht.", "limitations": "Kein reales Messaging-System, keine Produktion."}]}
---
# Domain Events und Fachereignisse

> **Ziel:** Ein Domain Event repräsentiert eine fachlich bedeutsame, bereits geschehene Änderung („Bestellung wurde bestätigt") mit stabilem, fachlichem Payload — im Gegensatz zu einem technischen Integrationsereignis, das oft ungefiltert interne Datenstrukturen exponiert. Die Unterscheidung entscheidet, wie eng Consumer an den Producer gekoppelt sind.

## Zweck, Mental Model und Dependencies

Ein Domain Event entsteht aus einer Aggregatsänderung ([KB-0131](03-aggregate-und-konsistenzgrenzen.md)) und beschreibt, was fachlich passiert ist, nicht wie es intern gespeichert wurde. „OrderConfirmed" mit den fachlich relevanten Feldern (Bestell-ID, Gesamtbetrag, Zeitpunkt) ist stabil, auch wenn sich die interne Datenbankstruktur der Bestellung ändert. Ein technisches Integrationsereignis, das einfach die komplette interne Datenzeile spiegelt, bricht bei jeder internen Schema-Änderung und koppelt Consumer eng an Implementierungsdetails des Producers. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0131](03-aggregate-und-konsistenzgrenzen.md).

~~~text
Domain Event:        OrderConfirmed { orderId, totalAmount, confirmedAt }  -- stable, business-meaningful
Technical dump event: OrderRowChanged { id, col1, col2, col3, internal_flag_x }  -- breaks on schema change
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Payload-Design | fachlich bedeutsame Felder oder technischer Row-Dump? | technischer Payload koppelt Consumer an interne Struktur |
| Vergangenheitsform | beschreibt das Event ein bereits geschehenes Faktum? | Befehl statt Ereignis modelliert (z. B. „ConfirmOrder" statt „OrderConfirmed") |
| Stabilität | bleibt das Payload-Schema bei internen Refactorings stabil? | fehlende Trennung zwischen internem Modell und Event-Schema |
| Granularität | ein Event pro fachlich bedeutsamer Änderung? | zu feingranulare technische Events überfluten Consumer mit Rauschen |

Implementierung: Domain Events werden explizit aus dem Aggregate Root heraus erzeugt, mit einem eigenen, bewusst gestalteten Payload-Schema, das unabhängig vom internen Datenmodell versioniert wird. Der Payload enthält nur fachlich relevante Felder in Vergangenheitsform benannt, keine internen technischen Flags oder Implementierungsdetails. Eine explizite Trennung zwischen internem Aggregatszustand und öffentlichem Event-Schema erlaubt internes Refactoring, ohne Consumer zu brechen.

## Scalability, Reliability, Security und Observability

Gut gestaltete Domain Events reduzieren Kopplung und erlauben unabhängige Skalierung von Producer und Consumern. Reliability-Grenze: ein Event-Schema, das versehentlich interne Implementierungsdetails exponiert, erzeugt eine versteckte, schwer sichtbare Kopplung — Änderungen am Producer brechen Consumer, ohne dass eine offensichtliche API-Vertragsverletzung sichtbar wird.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Consumer bricht nach internem Refactoring des Producers | technisches statt fachliches Event-Schema | Event-Payload-Felder gegen interne Datenstruktur vergleichen |
| Event-Flut mit vielen irrelevanten technischen Details | Events zu feingranular/technisch statt fachlich bedeutsam modelliert | Anzahl Events pro fachlicher Aktion messen |
| Event-Name beschreibt eine Absicht statt ein Faktum | Befehl statt Domain Event modelliert | Event-Namen auf Vergangenheitsform und Faktizität prüfen |
| Consumer muss Producer-internes Wissen haben, um Event zu interpretieren | fehlende explizite Trennung von internem Modell und Event-Schema | Dokumentation des Event-Schemas unabhängig vom internen Code prüfen |

Security: Domain Events können unbeabsichtigt sensible interne Daten exponieren, wenn der Payload nicht bewusst kuratiert wird; jedes Feld im Event-Payload sollte explizit als „für Consumer bestimmt" geprüft werden. Observability: Domain Events sind ein natürlicher Audit-Trail fachlicher Änderungen, wenn sie konsistent und vollständig für relevante Zustandsänderungen erzeugt werden.

## Trade-offs und Entscheidungen

**Staff** prüft bei Consumer-Kopplungsproblemen zuerst, ob das Event-Payload fachlich oder technisch gestaltet ist. **Principal** definiert Design-Standards für Domain-Event-Payloads (fachliche Felder, Vergangenheitsform, unabhängige Versionierung). **Chief** verlangt konsistente Domain-Event-Designstandards über alle Teams mit Event-getriebener Architektur.

Anti-Patterns: interne Datenbank-Zeilen ungefiltert als Event exponieren; Events als Befehle statt als bereits geschehene Fakten benennen; zu feingranulare technische Events, die Consumer mit irrelevantem Rauschen überfluten.

## Production Checklist

- [ ] Event-Payload enthält nur fachlich relevante Felder, keine internen Implementierungsdetails.
- [ ] Event-Namen in Vergangenheitsform, beschreiben ein bereits geschehenes Faktum.
- [ ] Event-Schema unabhängig vom internen Datenmodell versioniert.
- [ ] Sensible Felder im Payload explizit geprüft, bevor sie exponiert werden.

## Interviewfragen

### 1. Was unterscheidet ein Domain Event von einem technischen Integrationsereignis?

**Antwort:** Ein Domain Event hat einen bewusst gestalteten, fachlich bedeutsamen und stabilen Payload; ein technisches Integrationsereignis spiegelt oft ungefiltert interne Datenstrukturen, was Consumer eng an Implementierungsdetails koppelt.

### 2. Warum werden Domain Events in Vergangenheitsform benannt?

**Antwort:** Weil sie ein bereits geschehenes fachliches Faktum beschreiben, nicht eine Absicht oder einen Befehl — „OrderConfirmed" statt „ConfirmOrder".

### 3. Was passiert, wenn ein Event-Payload interne Datenbankfelder direkt exponiert?

**Antwort:** Jede interne Schema-Änderung des Producers kann dann Consumer brechen, da diese implizit an die interne Struktur statt an einen stabilen, bewusst gestalteten fachlichen Vertrag gekoppelt sind.

### 4. Wie viele Events sollten pro fachlicher Aktion erzeugt werden?

**Antwort:** So viele wie fachlich bedeutsame Zustandsänderungen tatsächlich stattfinden, nicht mehr — zu feingranulare technische Events erzeugen unnötiges Rauschen für Consumer.

### 5. Warum sind Domain Events ein natürlicher Audit-Trail?

**Antwort:** Weil sie fachliche Zustandsänderungen chronologisch und mit Bedeutung dokumentieren, wenn sie konsistent für alle relevanten Änderungen erzeugt werden.

### 6. Widersprüchliche Anforderung: Consumer will vollständige Detailinformation UND der Producer will maximale interne Refactoring-Freiheit — wie gehst du vor?

**Antwort:** Ich würde ein bewusst kuratiertes, stabiles fachliches Event-Schema definieren, das die tatsächlich benötigten Informationen für Consumer enthält, aber explizit von der internen Datenstruktur entkoppelt ist — der Producer kann intern frei refactoren, solange das öffentliche Event-Schema stabil bleibt.

## Praktische Labs

~~~python
internal_row = {"id": 1, "amount_cents": 2500, "status_flag": 2, "internal_retry_count": 3}

def to_domain_event(order):
    return {"event": "OrderConfirmed", "orderId": order["id"], "totalAmount": order["amount_cents"] / 100}

event = to_domain_event(internal_row)
assert "internal_retry_count" not in event
assert "status_flag" not in event
print("Domain event exposes only business-relevant fields, hiding internal implementation details.")
~~~

## Dependencies, Cross-References und Quellen

1. Evans: [Domain-Driven Design: Tackling Complexity in the Heart of Software](https://www.domainlanguage.com/ddd/), Addison-Wesley 2003, abgerufen 2026-09-17.
2. Fowler: [Domain Event](https://martinfowler.com/eaaDev/DomainEvent.html), martinfowler.com, abgerufen 2026-09-17.

Produktspezifische Event-Schema-Registry- und Messaging-Tooling-Details vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Schema-Registries mit erzwungener Kompatibilitätsprüfung für Domain Events | Established | Kompatibilitätsregeln gegen tatsächliche Consumer-Anforderungen prüfen. |
| Automatisierte Erkennung technischer Kopplung in Event-Payloads (Linting) | Emerging | Falsch-Positiv-Rate vor breitem Einsatz in CI validieren. |

Ein Team akzeptiert ein Domain-Event-Design erst, wenn der Payload als fachlich (nicht technisch) geprüft und die Stabilität gegenüber internem Refactoring nachgewiesen ist.
