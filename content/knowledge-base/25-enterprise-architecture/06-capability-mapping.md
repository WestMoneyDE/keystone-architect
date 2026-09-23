---
{"id": "KB-0594", "title": "Capability Mapping", "domain": "25", "sequence": 6, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0590", "concepts": ["Business Architecture"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Geschäftsfähigkeiten hierarchisch anhand etablierter Capability-Mapping-Praxis korrekt erfassen und Reife, Kritikalität sowie Investitionen für eine gegebene Fähigkeitskarte abbilden können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie eine hierarchische Fähigkeitskarte Reife, Kritikalität und Investitionsentscheidungen priorisiert sichtbar macht, unabhängig von Organisationsstrukturen oder Anwendungsgrenzen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Geschäftsfähigkeit fälschlich mit einer Organisationseinheit oder einer Anwendung gleichgesetzt wird, und die Fähigkeit korrekt als eigenständige, fachliche Einheit modellieren können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Capability Mapping festlegen, die Investitionsentscheidungen anhand von Reife und Kritikalität priorisierbar machen, statt sich an Organisationsstrukturen oder Anwendungsgrenzen zu orientieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die formale ArchiMate-Notation für Capability-Mapping-Artefakte im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis, Geschäftsfähigkeiten hierarchisch mit Reife, Kritikalität und Investitionen unabhängig von Organisationsstrukturen abzubilden, nicht eine bestimmte formale Notation."}}, "lab_validation": [{"lab_id": "KB-0594-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Priorisierung von Investitionsentscheidungen anhand von Reife und Kritikalität, kein produktives EA-Tool verwendet", "evidence": "Ein lokales Skript bewertet eine Liste von Geschäftsfähigkeiten anhand ihrer Reife (niedrig bis hoch) und Kritikalität (niedrig bis hoch) und priorisiert Investitionen in Fähigkeiten mit hoher Kritikalität und niedriger Reife, während Fähigkeiten mit hoher Reife und niedriger Kritikalität niedrig priorisiert werden.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales EA-Tool."}]}
---
# Capability Mapping

> **Ziel:** Capability Mapping erfasst die bereits in [KB-0590](02-business-architecture.md) eingeführten Geschäftsfähigkeiten **hierarchisch** (von übergeordneten, groben Fähigkeiten wie "Kundenbeziehungsmanagement" bis zu detaillierten Teilfähigkeiten wie "Kundenreklamation bearbeiten") und ergänzt jede Fähigkeit um drei zentrale Bewertungsdimensionen: **Reife** (wie gut eine Fähigkeit aktuell unterstützt wird), **Kritikalität** (wie wichtig eine Fähigkeit für den Geschäftserfolg ist) und **Investitionen** (welche Ressourcen aktuell in eine Fähigkeit fließen). Der zentrale Punkt dieses Kapitels ist die konsequente Unterscheidung einer Fähigkeit von einer Organisationseinheit oder einer Anwendung — eine Fähigkeit ist eine fachliche, stabile Einheit ("was die Organisation tun kann"), während eine Organisationseinheit ("wer es tut") und eine Anwendung ("womit es technisch umgesetzt wird") sich unabhängig davon über die Zeit ändern können, ohne dass sich die zugrunde liegende Fähigkeit selbst ändert.

## Zweck, Mental Model und Dependencies

Die hierarchische Struktur einer Fähigkeitskarte ermöglicht unterschiedliche Betrachtungsebenen für unterschiedliche Entscheidungsträger: Eine grobe, übergeordnete Fähigkeit (etwa "Kundenbeziehungsmanagement") eignet sich für strategische, geschäftsweite Priorisierungsentscheidungen, während eine detaillierte Teilfähigkeit (etwa "Kundenreklamation bearbeiten") für operative, konkrete Investitionsentscheidungen relevant ist — dieselbe Hierarchieebene ist nicht für jede Entscheidungsart gleichermaßen geeignet, und ein Capability Mapping, das nur eine einzige, undifferenzierte Detailebene anbietet, kann weder strategische noch operative Fragen angemessen unterstützen. Die Bewertung nach Reife und Kritikalität ist die zentrale, praktische Anwendung eines Capability Mapping: Eine Fähigkeit mit hoher Kritikalität (sie ist für den Geschäftserfolg besonders wichtig) und niedriger Reife (sie wird aktuell unzureichend unterstützt) stellt eine priorisierte Investitionslücke dar, während eine Fähigkeit mit niedriger Kritikalität und hoher Reife typischerweise keine zusätzliche Investition rechtfertigt — diese Kombination aus zwei Dimensionen ermöglicht eine systematische, nachvollziehbare Priorisierung von Investitionsentscheidungen, statt sie anhand subjektiver Präferenzen oder der Lautstärke einzelner Stakeholder zu treffen. Die konsequente Trennung von Fähigkeit, Organisationseinheit und Anwendung ist methodisch notwendig, weil eine Vermischung dieser drei Ebenen die eigentliche Stärke des Capability Mapping untergräbt: Wird eine Fähigkeit fälschlich mit einer bestimmten Organisationseinheit gleichgesetzt (etwa "Kundenreklamationsbearbeitung" = "das Customer-Service-Team"), verschwindet die Fähigkeit, wenn diese Organisationseinheit umstrukturiert wird, obwohl die fachliche Notwendigkeit selbst unverändert fortbesteht — ebenso verschwindet eine mit einer Anwendung gleichgesetzte Fähigkeit fälschlich, wenn diese Anwendung abgelöst wird, obwohl die Fähigkeit selbst (wie bereits in [KB-0590](02-business-architecture.md) behandelt) unabhängig von der technischen Umsetzung fortbesteht.

~~~text
Capability Mapping: captures KB-0590 business capabilities HIERARCHICALLY
  (coarse: "customer relationship management" -> detailed: "handle customer complaint")
  + adds THREE evaluation dimensions per capability:
    MATURITY (how well currently supported), CRITICALITY (how important for business success),
    INVESTMENT (what resources currently flow into it)
KEY POINT: consistently distinguish CAPABILITY from ORG UNIT or APPLICATION
  capability = fachlich, stable unit ("what org CAN do")
  org unit ("who does it") + application ("what technically implements it")
    can independently change over time WITHOUT the underlying capability itself changing
HIERARCHICAL structure enables different viewing levels for different decision-makers:
  coarse capability (e.g. "customer relationship mgmt") -> suits STRATEGIC, business-wide prioritization
  detailed sub-capability (e.g. "handle customer complaint") -> suits OPERATIONAL, concrete investment decisions
  SAME hierarchy level not equally suited to every decision type
  mapping offering only single, undifferentiated detail level -> supports NEITHER properly
MATURITY x CRITICALITY = central practical application:
  HIGH criticality + LOW maturity -> priority investment gap
  LOW criticality + HIGH maturity -> typically doesn't justify additional investment
  this two-dimension combo -> systematic, traceable investment prioritization
    instead of subjective preference or loudest stakeholder
WHY strict separation of capability/org unit/application methodically necessary:
  mixing these three levels undermines actual strength of capability mapping
  capability wrongly equated w/ specific org unit (e.g. "complaint handling" = "the customer service team")
    -> capability APPEARS to vanish when that org unit is restructured
       even though the fachlich necessity itself continues unchanged
  same for capability wrongly equated w/ an application -- vanishes when app is replaced,
    though capability itself (per KB-0590) persists independent of technical implementation
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Hierarchische Fähigkeitsebene | trennt strategische von operativen Betrachtungsebenen | passende Ebene je Entscheidungsträger und Entscheidungsart |
| Reife | bewertet aktuellen Unterstützungsgrad einer Fähigkeit | Grundlage für Investitionslückenidentifikation |
| Kritikalität | bewertet geschäftliche Bedeutung einer Fähigkeit | Grundlage für Investitionspriorisierung |
| Fähigkeit vs. Organisationseinheit/Anwendung | trennt fachliche Einheit von Umsetzung | verhindert Verschwinden der Fähigkeit bei Reorganisation/Ablösung |

Implementierung: Geschäftsfähigkeiten werden hierarchisch von grob nach detailliert strukturiert, unabhängig von Organisationsstrukturen oder Anwendungsgrenzen. Jede Fähigkeit erhält eine explizite Bewertung von Reife und Kritikalität. Investitionsentscheidungen werden systematisch anhand der Kombination aus hoher Kritikalität und niedriger Reife priorisiert.

## Scalability, Reliability, Security und Observability

Capability Mapping skaliert die Nachvollziehbarkeit von Investitionsentscheidungen proportional zur konsequenten Trennung von Fähigkeit, Organisationseinheit und Anwendung; die Reliability-Grenze liegt darin, dass eine Vermischung dieser Ebenen dazu führt, dass Fähigkeiten bei Reorganisationen oder Anwendungsablösungen fälschlich als verschwunden behandelt werden, obwohl die fachliche Notwendigkeit unverändert fortbesteht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Fähigkeitskarte "verliert" eine Fähigkeit nach einer Organisationsumstrukturierung | die Fähigkeit wurde fälschlich mit der reorganisierten Organisationseinheit gleichgesetzt | die Fähigkeit unabhängig von der Organisationsstruktur neu verankern |
| Investitionsentscheidungen werden nicht nachvollziehbar oder anhand subjektiver Präferenzen getroffen | keine systematische Bewertung nach Reife und Kritikalität liegt vor | jede Fähigkeit explizit nach Reife und Kritikalität bewerten und danach priorisieren |
| eine Fähigkeitskarte unterstützt weder strategische noch operative Entscheidungen angemessen | nur eine einzige, undifferenzierte Detailebene wird angeboten | eine hierarchische Struktur mit mehreren, passenden Betrachtungsebenen einführen |

Security: Fähigkeiten mit sicherheitsrelevanter Kritikalität (etwa "Zugriffskontrolle verwalten") sollten in der Kritikalitätsbewertung entsprechend hoch eingestuft werden. Observability: Die tatsächliche Nutzung der Fähigkeitskarte bei Investitionsentscheidungen ist ein zentrales Signal zur Bewertung, ob das Capability Mapping tatsächlich wirksam statt rein dokumentarisch ist.

## Trade-offs und Entscheidungen

**Staff** erfasst eine gegebene Geschäftsfähigkeit mit korrekter Reife- und Kritikalitätsbewertung. **Principal** entwirft die vollständige, hierarchische Fähigkeitskarte für einen Geschäftsbereich und priorisiert Investitionslücken. **Chief** legt unternehmensweite Standards für Capability Mapping fest, die Investitionsentscheidungen systematisch und nachvollziehbar priorisierbar machen.

Anti-Patterns: Fähigkeiten mit Organisationseinheiten oder Anwendungen gleichsetzen, statt sie als eigenständige, fachliche Einheit zu modellieren; Investitionsentscheidungen ohne systematische Reife-/Kritikalitätsbewertung treffen; eine Fähigkeitskarte mit nur einer einzigen, undifferenzierten Detailebene für alle Entscheidungsarten verwenden.

## Production Checklist

- [ ] Geschäftsfähigkeiten sind hierarchisch von grob nach detailliert strukturiert.
- [ ] Jede Fähigkeit ist explizit nach Reife und Kritikalität bewertet.
- [ ] Fähigkeiten sind konsequent von Organisationseinheiten und Anwendungen getrennt modelliert.
- [ ] Investitionsentscheidungen werden systematisch anhand von Kritikalität und Reife priorisiert.

## Interviewfragen

### 1. Warum ist eine hierarchische Struktur für Capability Mapping wichtig?

**Antwort:** Weil unterschiedliche Entscheidungsträger unterschiedliche Detailebenen benötigen — grobe Fähigkeiten für strategische, detaillierte Teilfähigkeiten für operative Entscheidungen.

### 2. Wie wird eine priorisierte Investitionslücke anhand einer Fähigkeitskarte identifiziert?

**Antwort:** Durch die Kombination aus hoher Kritikalität und niedriger Reife einer Fähigkeit — diese Kombination signalisiert eine geschäftlich wichtige, aber aktuell unzureichend unterstützte Fähigkeit.

### 3. Warum sollte eine Fähigkeit nicht mit einer Organisationseinheit gleichgesetzt werden?

**Antwort:** Weil die Fähigkeit bei einer Umstrukturierung der Organisationseinheit sonst fälschlich als verschwunden behandelt wird, obwohl die fachliche Notwendigkeit selbst unverändert fortbesteht.

### 4. Was unterscheidet Reife von Kritikalität bei der Fähigkeitsbewertung?

**Antwort:** Reife bewertet, wie gut eine Fähigkeit aktuell unterstützt wird; Kritikalität bewertet, wie wichtig diese Fähigkeit für den Geschäftserfolg ist — beide Dimensionen sind unabhängig voneinander zu bewerten.

### 5. Wie gehst du vor, wenn eine Fähigkeitskarte nach einer Organisationsumstrukturierung eine Fähigkeit zu "verlieren" scheint?

**Antwort:** Ich prüfe, ob die Fähigkeit fälschlich mit der reorganisierten Organisationseinheit gleichgesetzt wurde, und verankere sie stattdessen unabhängig von der Organisationsstruktur neu.

### 6. Widersprüchliche Anforderung: Geschäftsführung will eine einzige, übersichtliche Fähigkeitskarte für strategische Entscheidungen UND Teams wollen detaillierte Teilfähigkeiten für operative Investitionsentscheidungen — wie gehst du vor?

**Antwort:** Ich würde eine hierarchische Fähigkeitskarte mit mehreren Detailebenen pflegen, bei der die grobe, übergeordnete Ebene für strategische Übersichten dient und bei Bedarf in detaillierte Teilfähigkeiten aufgeklappt werden kann, statt entweder auf strategische Übersicht oder operative Detailtiefe zu verzichten.

## Praktische Labs

~~~python
# Local, deterministic simulation of prioritizing investment gaps via maturity x criticality (executed locally, no real EA tool):

def prioritize_investments(capabilities):
    return sorted(
        capabilities,
        key=lambda c: (c["criticality"] - c["maturity"]),
        reverse=True,
    )

capabilities = [
    {"name": "handle customer complaint", "maturity": 2, "criticality": 9},
    {"name": "manage internal wiki", "maturity": 8, "criticality": 2},
    {"name": "process customer order", "maturity": 6, "criticality": 9},
]

for c in prioritize_investments(capabilities):
    print(c["name"], "gap score:", c["criticality"] - c["maturity"])
~~~

## Dependencies, Cross-References und Quellen

1. The Open Group: [TOGAF Standard, 10th Edition — Business Capabilities](https://pubs.opengroup.org/togaf-standard/introduction/), abgerufen 2026-09-18.
2. ArchiMate-Spezifikation: [ArchiMate 3.2 Specification — Capability](https://pubs.opengroup.org/architecture/archimate3-doc/chap09.html), abgerufen 2026-09-18.

Business Architecture und die Definition von Geschäftsfähigkeiten sind kanonisch in [KB-0590](02-business-architecture.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte, automatische Reifebewertung von Fähigkeiten anhand operativer Metriken (Incident-Häufigkeit, Nutzerzufriedenheit) statt manueller Einschätzung | Evaluating | Als ergänzende, datengestützte Kalibrierung der manuellen Reifebewertung nutzen, jedoch die Kritikalitätsbewertung weiterhin als geschäftliche, menschliche Entscheidung behandeln, da sie strategischen Kontext erfordert, der aus operativen Metriken allein nicht ableitbar ist. |

Ein Team akzeptiert eine Fähigkeitskarte erst, wenn Fähigkeiten hierarchisch strukturiert, konsequent von Organisationseinheiten und Anwendungen getrennt, und nachvollziehbar nach Reife und Kritikalität bewertet sind.
