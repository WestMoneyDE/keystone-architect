---
{"id": "KB-0590", "title": "Business Architecture", "domain": "25", "sequence": 2, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0589", "concepts": ["Enterprise Architecture als Disziplin"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Geschäftsfähigkeiten (Capabilities) und Organisationsstrukturen für einen konkreten Geschäftsbereich anhand etablierter Business-Architecture-Praxis korrekt modellieren können, unabhängig von der aktuellen Anwendungslandschaft.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Geschäftsmodelle, Fähigkeiten und Organisationsstrukturen zusammengeführt werden, um fachliche Verantwortungen unabhängig von aktuellen Anwendungen zu modellieren.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Business-Architecture-Modellierung fälschlich an bestehende Anwendungsgrenzen statt an tatsächliche fachliche Fähigkeiten gebunden wird, und die Modellierung entsprechend korrigieren können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Business-Architecture-Modellierung festlegen, die gewünschte Veränderungen unabhängig von der aktuellen, möglicherweise veralteten Anwendungslandschaft sichtbar machen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die formale ArchiMate-Notation für Business-Architecture-Artefakte im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis, Geschäftsfähigkeiten unabhängig von der aktuellen Anwendungslandschaft zu modellieren, nicht eine bestimmte formale Notation."}}, "lab_validation": [{"lab_id": "KB-0590-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Unterscheidung von fähigkeitsbasierter und anwendungsgebundener Modellierung, kein produktives EA-Tool verwendet", "evidence": "Ein lokales Skript modelliert eine Geschäftsfähigkeit (etwa 'Kundenauftrag verwalten'), die von mehreren, unterschiedlichen Anwendungen über die Zeit unterstützt werden kann, und zeigt damit, dass die Fähigkeit selbst stabil bleibt, während die unterstützenden Anwendungen wechseln können.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales EA-Tool."}]}
---
# Business Architecture

> **Ziel:** Business Architecture (als erste der klassischen Enterprise-Architecture-Ebenen, aufbauend auf der bereits in [KB-0589](01-enterprise-architecture-als-disziplin.md) behandelten Abgrenzung der Disziplin) führt Geschäftsmodelle, **Fähigkeiten** (Capabilities — was eine Organisation fachlich tatsächlich tun kann, unabhängig davon, wie es aktuell technisch umgesetzt ist) und Organisationsstrukturen zusammen. Der zentrale Punkt dieses Kapitels ist, dass fachliche Verantwortungen und gewünschte Veränderungen **unabhängig von aktuellen Anwendungen** modelliert werden müssen — eine Geschäftsfähigkeit wie "Kundenauftrag verwalten" existiert fachlich unabhängig davon, welche konkrete Anwendung sie heute technisch unterstützt, und bleibt über mehrere Technologiewechsel hinweg stabil, während die unterstützenden Anwendungen sich ändern können. Eine Business-Architecture-Modellierung, die fälschlich an bestehende Anwendungsgrenzen statt an tatsächliche fachliche Fähigkeiten gebunden ist, kann Veränderungsbedarf nicht sichtbar machen, der über die aktuelle Anwendungslandschaft hinausgeht.

## Zweck, Mental Model und Dependencies

Der entscheidende methodische Unterschied zwischen fähigkeitsbasierter und anwendungsgebundener Modellierung liegt in der Stabilität der Modellierungseinheit: Eine Anwendung ist eine technische Umsetzung, die sich über die Zeit ändert (ersetzt, migriert, konsolidiert wird), während eine Geschäftsfähigkeit (etwa "Kundenauftrag verwalten", "Lagerbestand prüfen", "Rechnung erstellen") eine fachliche Notwendigkeit beschreibt, die unabhängig von der jeweils aktuellen technischen Umsetzung besteht — eine Organisation muss "Kundenaufträge verwalten" können, unabhängig davon, ob dies heute über System A, in fünf Jahren über System B oder künftig über eine völlig andere technische Lösung geschieht. Wird Business Architecture fälschlich an bestehende Anwendungsgrenzen statt an tatsächliche Fähigkeiten gebunden (etwa "die Auftragsverwaltungs-Anwendung" statt "die Fähigkeit, Kundenaufträge zu verwalten"), entsteht ein strukturelles Problem: Eine gewünschte Veränderung, die eine bestehende Anwendung ersetzen oder mehrere Anwendungen konsolidieren soll, lässt sich in einem anwendungsgebundenen Modell nur schwer als fachliche Notwendigkeit begründen, da das Modell selbst bereits an die zu verändernde Struktur gebunden ist. Ein fähigkeitsbasiertes Modell macht dagegen sichtbar, welche fachlichen Fähigkeiten aktuell unzureichend unterstützt werden (etwa durch veraltete, isolierte oder redundante Anwendungen), unabhängig davon, welche konkrete Anwendung diese Lücke aktuell zu schließen versucht — dies ermöglicht eine Veränderungsplanung, die sich an tatsächlichem, fachlichem Bedarf statt an der Trägheit bestehender technischer Strukturen orientiert.

~~~text
Business Architecture: first of classic EA layers, building on KB-0589's discipline boundary
  connects business models, CAPABILITIES (what org can fachlich actually do,
    independent of current technical implementation), and org structures
KEY POINT: business responsibilities + desired changes must be modeled
  INDEPENDENT of current applications
  a business capability like "manage customer order" exists FACHLICH independent of
    which concrete application supports it TODAY
  stays STABLE across multiple technology changes, while supporting applications can change
CRITICAL METHODOLOGICAL DIFFERENCE: capability-based vs application-bound modeling
  STABILITY of the modeling unit:
    application = technical implementation, changes over time (replaced, migrated, consolidated)
    capability (e.g. "manage customer order", "check inventory", "issue invoice")
      = business necessity, exists independent of whatever current technical implementation is
      org must be able to "manage customer orders" regardless of whether via System A today,
        System B in 5 years, or a completely different technical solution later
  business architecture WRONGLY bound to existing application boundaries instead of actual capabilities
    (e.g. "the order management application" instead of "the capability to manage customer orders")
    -> STRUCTURAL PROBLEM: desired change replacing/consolidating existing apps
    -> hard to justify as business necessity in application-bound model
       (model itself already bound to the structure being changed)
  capability-based model INSTEAD makes visible: which capabilities currently INADEQUATELY supported
    (outdated, isolated, redundant apps), independent of which specific app currently tries to fill the gap
    -> enables change planning oriented at ACTUAL business need, not inertia of existing tech structures
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Geschäftsfähigkeit (Capability) | beschreibt fachliche Notwendigkeit unabhängig von Umsetzung | stabile Modellierungseinheit über Technologiewechsel hinweg |
| Fähigkeitsbasierte vs. anwendungsgebundene Modellierung | trennt fachliche von technischer Struktur | macht Veränderungsbedarf jenseits bestehender Anwendungen sichtbar |
| Organisationsstruktur | verbindet Fähigkeiten mit Verantwortlichkeiten | zeigt, wer für welche Fähigkeit fachlich zuständig ist |
| Fähigkeitslücke | Diskrepanz zwischen benötigter und aktuell unterstützter Fähigkeit | Grundlage für priorisierte Veränderungsplanung |

Implementierung: Geschäftsfähigkeiten werden unabhängig von der aktuellen Anwendungslandschaft benannt und modelliert. Jede Fähigkeit wird mit den fachlich verantwortlichen Organisationseinheiten verknüpft. Aktuelle Anwendungen werden als Unterstützung bestehender Fähigkeiten kartiert, nicht als deren Definition. Fähigkeitslücken werden explizit identifiziert und für die Veränderungsplanung priorisiert.

## Scalability, Reliability, Security und Observability

Business Architecture skaliert die Aussagekraft der Veränderungsplanung proportional zur konsequenten Trennung von fachlicher Fähigkeit und technischer Umsetzung; die Reliability-Grenze liegt darin, dass eine anwendungsgebundene Modellierung Veränderungsbedarf verdeckt, der über bestehende technische Strukturen hinausgeht, und dadurch zu einer trägen, an veralteten Anwendungsgrenzen orientierten Planung führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine geplante Anwendungskonsolidierung lässt sich fachlich schwer begründen | die Business-Architecture-Modellierung ist an bestehende Anwendungsgrenzen statt an tatsächliche Fähigkeiten gebunden | die Modellierung auf fähigkeitsbasierte statt anwendungsgebundene Struktur umstellen |
| eine fachliche Fähigkeit wird von mehreren, redundanten Anwendungen unzureichend unterstützt, ohne dass dies sichtbar wird | kein fähigkeitsbasiertes Modell macht diese Fähigkeitslücke explizit sichtbar | ein fähigkeitsbasiertes Modell einführen, das aktuelle Anwendungen als Unterstützung, nicht als Definition der Fähigkeit kartiert |
| eine Organisationsveränderung (Umstrukturierung) macht die bestehende Architekturmodellierung unbrauchbar | Fähigkeiten wurden an Organisationsstrukturen statt an fachliche Notwendigkeiten gebunden | Fähigkeiten unabhängig von der aktuellen Organisationsstruktur modellieren |

Security: Fachliche Zuständigkeiten für sicherheitsrelevante Fähigkeiten (etwa Identitätsverwaltung) sollten in der Business-Architecture-Modellierung explizit einer verantwortlichen Organisationseinheit zugeordnet sein. Observability: Die tatsächliche Nutzung des Fähigkeitsmodells bei Veränderungsentscheidungen (wird tatsächlich auf Fähigkeitslücken statt auf Anwendungsgrenzen referenziert) ist ein zentrales Signal zur Bewertung der Modellierungsqualität.

## Trade-offs und Entscheidungen

**Staff** modelliert eine gegebene Geschäftsfähigkeit korrekt unabhängig von der aktuellen Anwendung. **Principal** entwirft das vollständige Fähigkeitsmodell für einen Geschäftsbereich und identifiziert Fähigkeitslücken. **Chief** legt unternehmensweite Standards für fähigkeitsbasierte Business-Architecture-Modellierung fest.

Anti-Patterns: Business Architecture an bestehende Anwendungsgrenzen statt an tatsächliche fachliche Fähigkeiten binden; Fähigkeitsmodelle bei jeder Organisationsumstrukturierung vollständig neu erstellen, statt sie unabhängig von der Organisationsstruktur zu halten; Fähigkeitslücken nicht explizit identifizieren und dadurch Veränderungsbedarf verdecken.

## Production Checklist

- [ ] Geschäftsfähigkeiten sind unabhängig von der aktuellen Anwendungslandschaft benannt und modelliert.
- [ ] Jede Fähigkeit ist mit einer fachlich verantwortlichen Organisationseinheit verknüpft.
- [ ] Aktuelle Anwendungen sind als Unterstützung, nicht als Definition der Fähigkeiten kartiert.
- [ ] Fähigkeitslücken sind explizit identifiziert und priorisiert.

## Interviewfragen

### 1. Was ist eine Geschäftsfähigkeit (Capability) und wie unterscheidet sie sich von einer Anwendung?

**Antwort:** Eine Geschäftsfähigkeit beschreibt eine fachliche Notwendigkeit, die unabhängig von der jeweils aktuellen technischen Umsetzung besteht, während eine Anwendung eine technische Implementierung ist, die sich über die Zeit ändern kann.

### 2. Warum ist eine fähigkeitsbasierte Modellierung stabiler als eine anwendungsgebundene?

**Antwort:** Weil die fachliche Fähigkeit über mehrere Technologiewechsel hinweg unverändert bestehen bleibt, während die unterstützenden Anwendungen ersetzt, migriert oder konsolidiert werden können.

### 3. Warum kann eine anwendungsgebundene Business-Architecture-Modellierung Veränderungsbedarf verdecken?

**Antwort:** Weil eine geplante Veränderung, die bestehende Anwendungen ersetzen oder konsolidieren soll, in einem bereits an diese Anwendungsstruktur gebundenen Modell schwer als fachliche Notwendigkeit begründet werden kann.

### 4. Wofür wird eine Fähigkeitslücke genutzt?

**Antwort:** Sie identifiziert eine Diskrepanz zwischen benötigter und aktuell unterstützter Fähigkeit und dient als Grundlage für priorisierte Veränderungsplanung.

### 5. Wie gehst du vor, wenn eine geplante Anwendungskonsolidierung sich fachlich schwer begründen lässt?

**Antwort:** Ich prüfe, ob die Business-Architecture-Modellierung an bestehende Anwendungsgrenzen statt an tatsächliche Fähigkeiten gebunden ist, und stelle die Modellierung entsprechend auf eine fähigkeitsbasierte Struktur um.

### 6. Widersprüchliche Anforderung: Fachbereiche wollen Business Architecture entlang bestehender, vertrauter Anwendungsgrenzen dokumentieren UND die Organisation will fähigkeitsbasierte, anwendungsunabhängige Veränderungsplanung — wie gehst du vor?

**Antwort:** Ich würde ein fähigkeitsbasiertes Kernmodell als maßgebliche Grundlage für Veränderungsplanung etablieren, dabei aber eine explizite Kartierung zwischen Fähigkeiten und aktuell unterstützenden Anwendungen pflegen, sodass Fachbereiche die vertraute Anwendungssicht weiterhin referenzieren können, ohne dass diese die eigentliche, fähigkeitsbasierte Planungsgrundlage ersetzt.

## Praktische Labs

~~~python
# Local, deterministic simulation of a stable capability supported by changing applications over time (executed locally, no real EA tool):

def capability_history(capability_name, supporting_apps_over_time):
    return {
        "capability": capability_name,
        "remains_stable": True,
        "supporting_applications_over_time": supporting_apps_over_time,
    }

result = capability_history(
    "manage customer order",
    supporting_apps_over_time=["LegacyOrderSystem (2015-2020)", "OrderPlatformV2 (2020-2024)", "OrderServiceV3 (2024-present)"],
)
print(result)
~~~

## Dependencies, Cross-References und Quellen

1. The Open Group: [TOGAF Standard, 10th Edition — Business Architecture](https://pubs.opengroup.org/togaf-standard/business-architecture/), abgerufen 2026-09-18.
2. ArchiMate-Spezifikation: [ArchiMate 3.2 Specification — Business Layer](https://pubs.opengroup.org/architecture/archimate3-doc/chap09.html), abgerufen 2026-09-18.

Die Abgrenzung von Enterprise Architecture als Disziplin ist kanonisch in [KB-0589](01-enterprise-architecture-als-disziplin.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte, automatische Ableitung von Fähigkeitsmodellen aus vorhandenen Geschäftsprozessdokumentationen | Evaluating | Als Ausgangspunkt für eine manuelle Validierung nutzen, jedoch nicht ungeprüft als maßgebliches Fähigkeitsmodell übernehmen, da automatisch abgeleitete Fähigkeiten häufig noch an bestehende Prozessstrukturen statt an tatsächliche fachliche Notwendigkeiten gebunden sind. |

Ein Team akzeptiert ein Business-Architecture-Modell erst, wenn Geschäftsfähigkeiten nachweislich unabhängig von der aktuellen Anwendungslandschaft modelliert sind und Fähigkeitslücken explizit für die Veränderungsplanung sichtbar gemacht wurden.
