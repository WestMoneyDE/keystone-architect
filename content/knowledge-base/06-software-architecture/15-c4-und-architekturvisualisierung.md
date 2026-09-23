---
{"id": "KB-0143", "title": "C4 und Architekturvisualisierung", "domain": "06", "sequence": 15, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0126", "concepts": ["Systemdesign-Methodik"], "needed_for": "understanding"}], "related": ["KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Context- und ein Container-Diagramm für ein Beispielsystem selbst erstellen und die richtige Abstraktionsebene für jede Zielgruppe begründen.", "rationale": "Kein reales System nötig, um die Notation zu üben."}, "ARCHITECT-TARGET": {"active": true, "scope": "Für ein System die passende C4-Sicht (Context/Container/Component/Deployment) je nach Zielgruppe wählen.", "rationale": "Ein Diagramm für die falsche Zielgruppe verwirrt statt zu klären."}, "STAFF-TARGET": {"active": true, "scope": "Ein veraltetes Architekturdiagramm als Ursache für ein Missverständnis im Team identifizieren.", "rationale": "Diagramme, die nicht gepflegt werden, werden schnell irreführend statt hilfreich."}, "CHIEF-TARGET": {"active": true, "scope": "C4 als gemeinsamen Notationsstandard für Architekturkommunikation über Teams hinweg etablieren.", "rationale": "Uneinheitliche Diagrammnotation erschwert Verständigung zwischen Teams und mit externen Stakeholdern."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Automatisierte Diagramm-Generierung aus Code (Structurizr-Stil) ist Vertiefung.", "rationale": "Kern ist die Wahl der richtigen Abstraktionsebene, nicht ein bestimmtes Tool."}}, "lab_validation": [{"lab_id": "KB-0143-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Modell für Zielgruppen-Abstraktionsebene-Zuordnung", "evidence": "Ein Context-Diagramm für eine Geschäftsleitungs-Präsentation und ein Component-Diagramm für ein Entwickler-Onboarding werden korrekt unterschiedlichen Zielgruppen zugeordnet.", "limitations": "Kein reales System, rein methodische Übung."}]}
---
# C4 und Architekturvisualisierung

> **Ziel:** Das C4-Modell (Context, Container, Component, Code) bietet vier hierarchische Abstraktionsebenen für Architekturdiagramme, jede für eine andere Zielgruppe. Der häufigste Fehler ist, ein Diagramm mit falscher Abstraktion für seine Zielgruppe zu zeigen — zu viel Detail verwirrt Führungskräfte, zu wenig Detail hilft Entwicklern nicht.

## Zweck, Mental Model und Dependencies

Ein Context-Diagramm zeigt das System als eine Box im Verhältnis zu Nutzern und externen Systemen — für Stakeholder, die den groben Systemzweck verstehen wollen, ohne technische Details. Ein Container-Diagramm zerlegt das System in seine deploybaren Einheiten (Web-App, API, Datenbank) — für technische Stakeholder, die die grobe technische Struktur verstehen wollen. Ein Component-Diagramm zeigt die internen Bausteine eines einzelnen Containers — für Entwickler, die an diesem Container arbeiten. Ein Code-Diagramm (meist nicht manuell gepflegt, sondern aus dem Code generiert) zeigt Klassenebene. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0126](26-methodik-fuer-systemdesign.md).

~~~text
Context:    [User] -> [Our System] -> [External Payment API]        -- for business stakeholders
Container:  [Web App] -> [API] -> [Database]                          -- for technical stakeholders
Component:  [API] contains [OrderController] -> [OrderService] -> [OrderRepository]  -- for developers on this container
~~~

## Core Concepts, Architektur und Implementierung

| Ebene | Zielgruppe | Häufiger Fehler |
|---|---|---|
| Context | Geschäftsleitung, externe Stakeholder | zu viele technische Details, verwirrt statt zu klären |
| Container | technische Architekten, neue Teammitglieder | fehlende Angabe der Kommunikationsprotokolle zwischen Containern |
| Component | Entwickler des jeweiligen Containers | zu grob, hilft nicht beim tatsächlichen Verständnis der internen Struktur |
| Aktualität | wird das Diagramm bei Architekturänderungen aktiv gepflegt? | veraltetes Diagramm wird als aktuell missverstanden und führt in die Irre |

Implementierung: für jede Kommunikationssituation wird bewusst die passende C4-Ebene gewählt — eine Geschäftsleitungspräsentation braucht ein Context-Diagramm, kein Component-Diagramm. Diagramme werden mit einem klaren Aktualitätsdatum oder, wo möglich, automatisiert aus dem Code generiert, um Veralten zu vermeiden. Container-Diagramme sollten die Kommunikationsart zwischen Containern (synchron/asynchron, Protokoll) explizit zeigen, nicht nur Pfeile ohne Bedeutung.

## Scalability, Reliability, Security und Observability

C4-Diagramme skalieren als Kommunikationswerkzeug über verschiedene Stakeholder-Gruppen, wenn die richtige Ebene konsequent gewählt wird. Reliability-Grenze der Methodik: ein manuell gepflegtes Diagramm veraltet fast zwangsläufig, wenn es nicht aktiv bei jeder relevanten Architekturänderung aktualisiert wird — ein veraltetes Diagramm ist gefährlicher als gar kein Diagramm, weil es fälschliches Vertrauen erzeugt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Geschäftsleitung versteht Architekturpräsentation nicht | zu detailliertes Diagramm (Component statt Context) für diese Zielgruppe gezeigt | Diagrammebene gegen tatsächliche Zielgruppe prüfen |
| neues Teammitglied trifft trotz Diagrammstudium falsche Annahmen | Diagramm veraltet, spiegelt nicht mehr die aktuelle Architektur | Diagramm-Erstellungsdatum gegen letzte relevante Architekturänderung prüfen |
| Entwickler findet Container-Diagramm nicht hilfreich für seine Arbeit | falsche Abstraktionsebene, Component-Diagramm wäre nötig gewesen | tatsächlichen Informationsbedarf der Zielgruppe klären |
| Diskussion über Architektur bleibt unpräzise | fehlende gemeinsame visuelle Referenz auf passender Abstraktionsebene | prüfen, ob überhaupt ein aktuelles Diagramm für den Diskussionsgegenstand existiert |

Security: Architekturdiagramme können sensible interne Struktur exponieren, wenn sie unkontrolliert extern geteilt werden — die Zielgruppen-Klassifikation (öffentlich versus intern) sollte explizit für jedes Diagramm gelten. Observability: automatisiert aus Code generierte Diagramme (statt manuell gepflegter) bleiben tendenziell aktueller und sind ein Frühwarnsignal, wenn die tatsächliche Struktur von der dokumentierten Intention abweicht.

## Trade-offs und Entscheidungen

**Staff** wählt für jede Kommunikationssituation bewusst die passende C4-Ebene statt ein Standarddiagramm für alle Zwecke zu verwenden. **Principal** etabliert C4 als gemeinsamen Notationsstandard über Teams hinweg. **Chief** verlangt, dass kritische Architekturdiagramme entweder automatisiert generiert oder mit klarem Pflegeprozess versehen sind, um Veraltung zu vermeiden.

Anti-Patterns: ein einziges, überladenes Diagramm für alle Zielgruppen verwenden; Diagramme einmalig erstellen und nie wieder aktualisieren; Component-Diagramme für Geschäftsleitungspräsentationen oder Context-Diagramme für technische Detailarbeit einsetzen.

## Production Checklist

- [ ] Für jede Kommunikationssituation wird die passende C4-Ebene gewählt.
- [ ] Kritische Diagramme haben einen klaren Aktualitätsnachweis oder werden automatisiert generiert.
- [ ] Container-Diagramme zeigen Kommunikationsart/Protokoll zwischen Containern explizit.
- [ ] Diagramm-Zielgruppenklassifikation (öffentlich/intern) vor externem Teilen geprüft.

## Interviewfragen

### 1. Was ist der Unterschied zwischen einem Context- und einem Container-Diagramm?

**Antwort:** Ein Context-Diagramm zeigt das Gesamtsystem als eine Box im Verhältnis zu Nutzern und externen Systemen für nicht-technische Stakeholder; ein Container-Diagramm zerlegt das System in seine deploybaren technischen Einheiten für technische Stakeholder.

### 2. Warum ist ein zu detailliertes Diagramm für eine Geschäftsleitungspräsentation problematisch?

**Antwort:** Es verwirrt statt zu klären, da die Zielgruppe an groben Systemzweck und -grenzen interessiert ist, nicht an interner technischer Struktur.

### 3. Was ist gefährlicher: kein Architekturdiagramm oder ein veraltetes?

**Antwort:** Ein veraltetes Diagramm ist oft gefährlicher, da es fälschliches Vertrauen in eine nicht mehr zutreffende Architektur erzeugt, während das Fehlen eines Diagramms zumindest keine falsche Sicherheit vorgibt.

### 4. Was sollte ein Container-Diagramm zusätzlich zu den Containern selbst zeigen?

**Antwort:** Die Art der Kommunikation zwischen den Containern (synchron/asynchron, verwendetes Protokoll), nicht nur unbeschriftete Pfeile.

### 5. Wie verhinderst du, dass ein Architekturdiagramm veraltet?

**Antwort:** Durch automatisierte Generierung aus dem Code, wo möglich, oder durch einen expliziten Pflegeprozess mit klarem Aktualitätsnachweis bei jeder relevanten Architekturänderung.

### 6. Widersprüchliche Anforderung: Stakeholder will ein einziges Diagramm, das sowohl Geschäftsleitung als auch Entwickler vollständig zufriedenstellt — wie gehst du vor?

**Antwort:** Ich würde erklären, dass unterschiedliche Zielgruppen unterschiedliche Abstraktionsebenen brauchen und ein einziges Diagramm zwangsläufig für eine der Gruppen entweder zu detailliert oder zu grob ist; ich würde ein Context- und ein Container-Diagramm als komplementäres Paar anbieten, jeweils für ihre Zielgruppe optimiert.

## Praktische Labs

~~~python
diagrams = {"context": "business stakeholders", "container": "technical architects", "component": "developers"}
audience = "business stakeholders"

def pick_diagram_level(audience, diagrams):
    for level, target in diagrams.items():
        if target == audience:
            return level
    return None

chosen = pick_diagram_level(audience, diagrams)
assert chosen == "context"
print(f"For audience '{audience}', the appropriate C4 level is: {chosen}")
~~~

## Dependencies, Cross-References und Quellen

1. Brown: [The C4 Model for Visualising Software Architecture](https://c4model.com/), abgerufen 2026-09-17.

Diese Methodik ist zeitstabil; konkrete Diagramm-Tooling-Details sollten dennoch gegen aktuelle Dokumentation geprüft werden.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Code-as-Diagram-Tools mit automatischer C4-Generierung aus Architekturbeschreibungen | Established | Aktualitätsgewinn gegen initialen Modellierungsaufwand abwägen. |
| KI-gestützte Diagrammerzeugung aus Codeanalyse | Emerging | Generierte Diagramme gegen tatsächliche Architekturintention manuell validieren. |

Diese Methodik ist ein etabliertes, stabiles Notationsprinzip; der Bonus betrifft primär, wie Tooling die Diagrammpflege erleichtern kann, ohne die bewusste Zielgruppen-Ebenen-Wahl zu ersetzen.
