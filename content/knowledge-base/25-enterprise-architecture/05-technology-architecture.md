---
{"id": "KB-0593", "title": "Technology Architecture", "domain": "25", "sequence": 5, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0592", "concepts": ["Enterprise Data Architecture"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Technologieklassen, Infrastrukturbausteine und Lifecycle-Stände für eine konkrete Organisation anhand etablierter Technology-Architecture-Praxis korrekt strukturieren und Technologieabhängigkeiten vor einem Lifecyclewechsel analysieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Zielplattformen und Technologieabhängigkeiten für konsistente Enterprise-Standards modelliert werden, aufbauend auf den bereits in Domain 25 behandelten Business-, Application- und Data-Architecture-Ebenen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein geplanter Lifecyclewechsel einer Technologie (etwa Abkündigung einer Plattform) eine nicht dokumentierte, kritische Abhängigkeit betrifft, und die Ursache auf eine unvollständige Technologieabhängigkeitsanalyse zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Technology-Architecture-Modellierung und Lifecycle-Management festlegen, die Technologieabhängigkeiten vor jedem größeren Lifecyclewechsel verbindlich analysieren lassen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte technische Implementierung einzelner Infrastrukturbausteine ist bereits in den jeweiligen technischen Domains dieses Curriculums behandelt.", "rationale": "Kern ist die unternehmensweite Strukturierung von Technologieklassen und Lifecycle-Ständen, nicht die technische Implementierung einzelner Infrastrukturbausteine."}}, "lab_validation": [{"lab_id": "KB-0593-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Analyse von Technologieabhängigkeiten vor einem geplanten Lifecyclewechsel, kein produktives EA-Tool verwendet", "evidence": "Ein lokales Skript prüft, welche Anwendungen von einer zur Abkündigung vorgesehenen Technologie abhängen, und markiert diese Abhängigkeiten als zu klärende Voraussetzung, bevor der Lifecyclewechsel tatsächlich durchgeführt wird.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales EA-Tool."}]}
---
# Technology Architecture

> **Ziel:** Technology Architecture strukturiert Technologieklassen (Kategorien von Infrastrukturbausteinen, etwa Datenbanken, Messaging-Systeme, Compute-Plattformen), Infrastrukturbausteine (konkrete, eingesetzte Technologien innerhalb dieser Klassen) und deren **Lifecycle-Stände** (etwa "aktueller Standard", "auslaufend", "abgekündigt") als vierte, abschließende Ebene der klassischen Enterprise-Architecture-Schichten (aufbauend auf den bereits in Domain 25 behandelten Business-, Application- und Data-Architecture-Ebenen). Der zentrale Punkt dieses Kapitels ist, dass **Zielplattformen** und **Technologieabhängigkeiten** unternehmensweit modelliert werden müssen, um konsistente Enterprise-Standards nachvollziehbar zu machen — und dass jeder geplante **Lifecyclewechsel** (etwa die Abkündigung einer Technologie zugunsten einer neuen Zielplattform) eine vorherige, vollständige Analyse der tatsächlich davon abhängigen Systeme erfordert, da eine unvollständige Abhängigkeitsanalyse zu unerwarteten, weitreichenden Störungen führen kann, wenn eine tatsächlich noch genutzte, aber nicht dokumentierte Abhängigkeit übersehen wird.

## Zweck, Mental Model und Dependencies

Technologieklassen strukturieren die Vielfalt eingesetzter Infrastruktur in überschaubare Kategorien (etwa "relationale Datenbanken", "Message Broker", "Container-Orchestrierung"), innerhalb derer eine Organisation typischerweise eine begrenzte Anzahl offiziell unterstützter Bausteine als Zielplattform definiert, statt jede technisch mögliche Variante gleichberechtigt zuzulassen — diese Konsolidierung reduziert die operative Komplexität und ermöglicht konsistente, unternehmensweite Praktiken (etwa einheitliche Betriebs-, Sicherheits- und Kostenstandards) für die jeweilige Technologieklasse. Der Lifecycle-Stand eines Infrastrukturbausteins (aktueller Standard, auslaufend, abgekündigt) macht explizit, in welche Richtung sich die Zielplattform-Landschaft bewegt, und ist damit die Grundlage für Migrationsplanung: Ein als "auslaufend" markierter Baustein signalisiert, dass neue Systeme ihn nicht mehr verwenden sollten, während bestehende Nutzungen mittelfristig auf die neue Zielplattform migriert werden müssen. Die entscheidende methodische Anforderung bei jedem geplanten Lifecyclewechsel ist die vorherige, vollständige Technologieabhängigkeitsanalyse: Bevor eine Technologie tatsächlich abgekündigt oder ihre Unterstützung eingestellt wird, muss explizit geprüft werden, welche Anwendungen (unter Rückgriff auf die bereits in [KB-0591](03-application-architecture-im-unternehmen.md) behandelte Application-Architecture-Kartierung) tatsächlich noch von ihr abhängen — eine unvollständige oder rein formale Abhängigkeitsprüfung (etwa nur die offiziell dokumentierten Nutzungen, nicht die tatsächlich in der Praxis vorhandenen, aber nicht formal erfassten Abhängigkeiten) kann dazu führen, dass eine tatsächlich noch genutzte Technologie abgekündigt wird, bevor die davon abhängigen Systeme migriert sind, was zu unerwarteten, weitreichenden Betriebsstörungen führt.

~~~text
Technology Architecture: fourth, final layer of classic EA stack (after Business/App/Data from earlier Domain 25 chapters)
  structures: TECHNOLOGY CLASSES (infra categories: DBs, message brokers, compute platforms)
    INFRASTRUCTURE BUILDING BLOCKS (concrete deployed tech within those classes)
    LIFECYCLE STATUS (e.g. "current standard", "sunsetting", "deprecated")
KEY POINT: target platforms + technology dependencies must be modeled ENTERPRISE-WIDE
  for consistent, traceable Enterprise standards
  EVERY planned LIFECYCLE TRANSITION (e.g. deprecating tech in favor of new target platform)
    requires PRIOR, COMPLETE dependency analysis of systems actually depending on it
  incomplete dependency analysis -> unexpected, far-reaching disruption
    when an actually-still-used-but-undocumented dependency is overlooked
Technology classes structure infra variety into manageable categories
  org typically defines LIMITED number of officially-supported building blocks as target platform per class
    instead of equally permitting every technically-possible variant
  -> reduces operational complexity, enables consistent org-wide practices
     (unified ops/security/cost standards) per technology class
LIFECYCLE STATUS makes explicit direction the target-platform landscape is moving
  = basis for migration planning
  "sunsetting" building block -> new systems shouldn't use it, existing usages must migrate to new target mid-term
CENTRAL METHODOLOGICAL REQUIREMENT at every planned lifecycle transition:
  COMPLETE technology dependency analysis BEFORE tech is actually deprecated/support ends
  must explicitly check which apps (drawing on KB-0591 application architecture mapping)
    ACTUALLY still depend on it
  incomplete/purely formal dependency check (only officially documented usages,
    not actually-present-but-not-formally-captured dependencies)
    -> can deprecate an actually-still-used technology before dependent systems migrated
    -> unexpected, far-reaching operational disruption
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Technologieklasse | kategorisiert Infrastruktur in überschaubare Gruppen | Grundlage für Konsolidierung auf Zielplattformen |
| Zielplattform | offiziell unterstützter Baustein je Technologieklasse | reduziert operative Komplexität, ermöglicht konsistente Standards |
| Lifecycle-Stand | zeigt Richtung der Plattform-Entwicklung (Standard, auslaufend, abgekündigt) | Grundlage für Migrationsplanung |
| Technologieabhängigkeitsanalyse | prüft tatsächlich abhängige Systeme vor Lifecyclewechsel | verhindert unerwartete Störungen bei Abkündigung |

Implementierung: Technologieklassen werden mit offiziell unterstützten Zielplattformen und deren Lifecycle-Stand dokumentiert. Vor jedem geplanten Lifecyclewechsel wird eine vollständige, sowohl formale als auch praktisch verifizierte Technologieabhängigkeitsanalyse durchgeführt, die auf der bestehenden Application-Architecture-Kartierung aufbaut. Migrationen von auslaufenden zu aktuellen Zielplattformen werden priorisiert nach tatsächlich identifizierten, kritischen Abhängigkeiten geplant.

## Scalability, Reliability, Security und Observability

Technology Architecture skaliert die Konsistenz und Beherrschbarkeit der unternehmensweiten Infrastruktur proportional zur Konsolidierung auf definierte Zielplattformen und zur Vollständigkeit der Technologieabhängigkeitsanalyse vor jedem Lifecyclewechsel; die Reliability-Grenze liegt darin, dass eine unvollständige Abhängigkeitsanalyse eine tatsächlich noch genutzte Technologie vorzeitig abkündigen und dadurch abhängige Systeme unerwartet stören kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| die Abkündigung einer Technologie führt zu unerwarteten Störungen bei mehreren Systemen | die Technologieabhängigkeitsanalyse vor dem Lifecyclewechsel war unvollständig | die Abhängigkeitsanalyse um tatsächlich in der Praxis vorhandene, nicht formal dokumentierte Nutzungen erweitern |
| dieselbe Technologieklasse wird in der Organisation mit vielen unterschiedlichen, nicht konsolidierten Bausteinen umgesetzt | keine offizielle Zielplattform für diese Technologieklasse ist definiert | eine offizielle Zielplattform je Technologieklasse festlegen und neue Nutzungen darauf lenken |
| eine als "auslaufend" markierte Technologie wird weiterhin für neue Systeme genutzt | der Lifecycle-Stand ist den betroffenen Teams nicht bekannt oder wird nicht durchgesetzt | den Lifecycle-Stand aktiv kommunizieren und in Architekturentscheidungsprozesse einbinden |

Security: Abgekündigte, aber noch genutzte Technologien stellen ein besonderes Sicherheitsrisiko dar, da sie häufig keine aktuellen Sicherheitsupdates mehr erhalten. Observability: Die tatsächliche Nutzung als "auslaufend" markierter Technologien über die Zeit ist ein zentrales Signal zur Bewertung, ob Migrationsplanung tatsächlich wirksam durchgesetzt wird.

## Trade-offs und Entscheidungen

**Staff** dokumentiert Technologieklassen und Lifecycle-Stände für einen gegebenen Bereich korrekt. **Principal** entwirft die vollständige Zielplattform-Strategie und Technologieabhängigkeitsanalyse für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für Zielplattformen und verbindliche Lifecycle-Analyseprozesse fest.

Anti-Patterns: eine Technologie ohne vollständige, praktisch verifizierte Abhängigkeitsanalyse abkündigen; keine offizielle Zielplattform je Technologieklasse definieren und dadurch unkontrollierte Technologievielfalt zulassen; einen Lifecycle-Stand definieren, ohne ihn aktiv zu kommunizieren oder durchzusetzen.

## Production Checklist

- [ ] Jede Technologieklasse hat eine offiziell definierte Zielplattform mit dokumentiertem Lifecycle-Stand.
- [ ] Vor jedem geplanten Lifecyclewechsel wird eine vollständige, praktisch verifizierte Technologieabhängigkeitsanalyse durchgeführt.
- [ ] Als "auslaufend" markierte Technologien werden aktiv kommuniziert und ihre Nutzung überwacht.
- [ ] Abgekündigte Technologien werden erst nach vollständiger Migration abhängiger Systeme tatsächlich stillgelegt.

## Interviewfragen

### 1. Was ist der Zweck einer offiziellen Zielplattform je Technologieklasse?

**Antwort:** Sie reduziert operative Komplexität und ermöglicht konsistente, unternehmensweite Standards (Betrieb, Sicherheit, Kosten), indem sie die Vielfalt eingesetzter Infrastruktur innerhalb einer Kategorie konsolidiert.

### 2. Warum ist eine vollständige Technologieabhängigkeitsanalyse vor einem Lifecyclewechsel entscheidend?

**Antwort:** Weil eine unvollständige Analyse dazu führen kann, dass eine tatsächlich noch genutzte, aber nicht formal dokumentierte Abhängigkeit übersehen und die Technologie vorzeitig abgekündigt wird, was zu unerwarteten Betriebsstörungen führt.

### 3. Was unterscheidet eine formale von einer praktisch verifizierten Abhängigkeitsprüfung?

**Antwort:** Eine formale Prüfung berücksichtigt nur offiziell dokumentierte Nutzungen, während eine praktisch verifizierte Prüfung auch tatsächlich in der Praxis vorhandene, nicht formal erfasste Abhängigkeiten einbezieht.

### 4. Warum stellen abgekündigte, aber noch genutzte Technologien ein besonderes Sicherheitsrisiko dar?

**Antwort:** Weil sie häufig keine aktuellen Sicherheitsupdates mehr erhalten, obwohl sie weiterhin produktiv genutzt werden.

### 5. Wie gehst du vor, wenn die Abkündigung einer Technologie zu unerwarteten Störungen bei mehreren Systemen führt?

**Antwort:** Ich prüfe, ob die vorherige Technologieabhängigkeitsanalyse unvollständig war, und erweitere künftige Analysen um tatsächlich in der Praxis vorhandene, nicht formal dokumentierte Nutzungen.

### 6. Widersprüchliche Anforderung: Teams wollen technologische Freiheit bei der Werkzeugwahl UND die Organisation will konsolidierte, konsistente Zielplattformen — wie gehst du vor?

**Antwort:** Ich würde für jede Technologieklasse eine offizielle Zielplattform mit klarem, begründetem Ausnahmeprozess definieren, der eine begründete, dokumentierte Abweichung in begründeten Einzelfällen zulässt, statt entweder technologische Freiheit vollständig zu unterbinden oder Konsolidierung vollständig aufzugeben.

## Praktische Labs

~~~python
# Local, deterministic simulation of dependency analysis before a technology lifecycle transition (executed locally, no real EA tool):

def check_deprecation_safety(technology, apps, formally_documented_users):
    actual_users = [app for app in apps if technology in app["actually_uses"]]
    undocumented = [app["name"] for app in actual_users if app["name"] not in formally_documented_users]
    return {"safe_to_deprecate": len(undocumented) == 0, "undocumented_dependents": undocumented}

apps = [
    {"name": "OrderService", "actually_uses": ["LegacyMQ"]},
    {"name": "ReportingJob", "actually_uses": ["LegacyMQ"]},
]

result = check_deprecation_safety("LegacyMQ", apps, formally_documented_users=["OrderService"])
print(result)
~~~

## Dependencies, Cross-References und Quellen

1. The Open Group: [TOGAF Standard, 10th Edition — Technology Architecture](https://pubs.opengroup.org/togaf-standard/introduction/), abgerufen 2026-09-18.
2. ArchiMate-Spezifikation: [ArchiMate 3.2 Specification — Technology Layer](https://pubs.opengroup.org/architecture/archimate3-doc/chap11.html), abgerufen 2026-09-18.

Application Architecture ist kanonisch in [KB-0591](03-application-architecture-im-unternehmen.md) behandelt; Enterprise Data Architecture in [KB-0592](04-enterprise-data-architecture.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, tatsächliche Nutzungserkennung von Technologien über Netzwerk- und Dependency-Scans zur Ergänzung formaler Abhängigkeitsdokumentation | Evaluating | Als ergänzende Validierungsquelle vor jedem Lifecyclewechsel einsetzen, jedoch nicht als alleinigen Ersatz für die formale Application-Architecture-Kartierung, da automatische Scans organisatorischen Kontext (etwa geplante, aber noch nicht aktive Nutzung) nicht vollständig erfassen. |

Ein Team akzeptiert einen Technology-Lifecyclewechsel erst, wenn die Zielplattform-Zuordnung dokumentiert und eine vollständige, praktisch verifizierte Technologieabhängigkeitsanalyse nachweislich durchgeführt wurde.
