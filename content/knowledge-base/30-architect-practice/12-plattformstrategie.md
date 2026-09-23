---
{"id": "KB-0688", "title": "Plattformstrategie", "domain": "30", "sequence": 12, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0687", "concepts": ["Evidenzpunkte"], "needed_for": "Eine Plattformstrategie nutzt dieselben Evidenzpunkt-Prinzipien wie die in KB-0687 beschriebene Roadmap-Steuerung, angewendet auf Adoption statt reiner Zeitplanung"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für eine gegebene interne Plattform Zielgruppen, gemeinsame Fähigkeiten und Produktgrenzen definieren und begründen können, warum die Plattform tatsächlich als Produkt statt als reine Infrastruktur geführt werden sollte.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine komplexe interne Plattform eine vollständige Strategie mit Adoptionsplan, Finanzierungsmodell und Ownership-Struktur entwerfen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Plattform als rein infrastrukturelle Bereitstellung ohne Zielgruppenverständnis geführt wird, sodass ihre tatsächliche Adoption ausbleibt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Eine unternehmensweite Plattformstrategie mit Finanzierungsmodell und Ownership-Struktur festlegen, die interne Plattformen als Produkte statt als reine Infrastruktur behandelt.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, technische Implementierung eines Internal Developer Portals (etwa Backstage) im Detail ist Vertiefung.", "rationale": "Kern ist die strategische Produktdefinition der Plattform, nicht die technische Portal-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0688-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung von Plattform-Adoption bei fehlendem Zielgruppenverständnis, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie eine technisch solide, aber ohne Zielgruppenverständnis entwickelte interne Plattform tatsächlich niedrige Adoption erfährt, während eine mit explizitem Zielgruppenfokus entwickelte Plattform tatsächlich genutzt wird.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# Plattformstrategie

> **Ziel:** Eine Plattformstrategie behandelt eine interne technische Plattform (etwa eine Entwicklerplattform oder ein internes Self-Service-System) tatsächlich als Produkt mit definierten **internen Zielgruppen** (welche Teams die Plattform tatsächlich nutzen sollen, mit welchen tatsächlichen Bedürfnissen), **gemeinsamen Fähigkeiten** (was die Plattform tatsächlich bereitstellt, das mehrere Teams unabhängig voneinander sonst redundant selbst bauen müssten) und **Produktgrenzen** (was die Plattform explizit nicht abdeckt, um Scope-Ausweitung zu begrenzen). Der zentrale Punkt dieses Kapitels ist die Begründung von Adoption, Finanzierung und Ownership gegenüber einer rein infrastrukturellen Plattformvision — eine Plattform, die lediglich als technische Infrastruktur ohne Produktdenken bereitgestellt wird, erfährt tatsächlich häufig niedrige Adoption, da sie tatsächlich nicht auf die konkreten Bedürfnisse ihrer internen Nutzer ausgerichtet ist.

## Zweck, Mental Model und Dependencies

Interne Zielgruppen zu definieren bedeutet, tatsächlich zu verstehen, welche Teams die Plattform nutzen sollen und was diese Teams tatsächlich benötigen, statt eine Plattform primär aus technischer Eleganz oder aus Sicht des Plattformteams selbst zu entwerfen — eine Plattform, die die tatsächlichen Bedürfnisse ihrer internen Zielgruppen nicht kennt, baut tatsächlich Funktionen, die technisch beeindruckend, aber für die tatsächliche tägliche Arbeit der Nutzer nicht relevant sind, was zu tatsächlich niedriger Adoption führt. Gemeinsame Fähigkeiten zu identifizieren bedeutet, tatsächlich zu erkennen, welche Funktionalität mehrere Teams unabhängig voneinander redundant selbst bauen würden, wenn die Plattform sie nicht bereitstellt — diese Redundanzvermeidung ist der eigentliche wirtschaftliche Kern einer internen Plattform: Statt dass jedes Team tatsächlich eine eigene Lösung für dasselbe, gemeinsame Problem (etwa Deployment-Automatisierung oder Observability-Instrumentierung) entwickelt, bündelt die Plattform diese Fähigkeit zentral. Produktgrenzen explizit zu ziehen bedeutet, bewusst zu entscheiden, was die Plattform tatsächlich nicht abdeckt — ohne diese Grenze wächst eine Plattform tatsächlich unkontrolliert, versucht jede mögliche Anforderung jedes Teams zu erfüllen, und verliert dabei tatsächlich ihre Fokussierung auf die eigentlich gemeinsamen, wiederkehrenden Bedürfnisse. Adoption zu begründen bedeutet, tatsächlich zu erklären, warum Teams die Plattform freiwillig nutzen sollten (oder unter welchen Umständen eine Nutzung verpflichtend gemacht wird) — eine Plattform mit echtem Produktwert wird tatsächlich freiwillig adoptiert, weil sie den nutzenden Teams tatsächlich Arbeit erspart, während eine rein verpflichtend auferlegte, aber nicht tatsächlich wertstiftende Plattform tatsächlich zu Umgehungsverhalten führt. Finanzierung zu begründen bedeutet, tatsächlich zu klären, wie die Plattformentwicklung finanziert wird — als zentrale, unternehmensweite Investition oder anteilig durch die nutzenden Teams — diese Entscheidung beeinflusst tatsächlich, wie die Plattform priorisiert wird: Eine zentral finanzierte Plattform muss ihren Wert gegenüber der Gesamtorganisation tatsächlich rechtfertigen, während eine durch Nutzerteams mitfinanzierte Plattform tatsächlich direkter auf deren konkrete Bedürfnisse reagieren muss. Ownership zu begründen bedeutet, tatsächlich klarzustellen, welches Team für die Plattform als Produkt tatsächlich verantwortlich ist, einschließlich Roadmap-Entscheidungen und Support — ohne diese klare Ownership wird eine Plattform tatsächlich zu einem verwaisten, gemeinsam "irgendwie" verantworteten System, dessen Weiterentwicklung tatsächlich stagniert.

~~~text
Platform Strategy treats an internal technical platform (developer platform, internal
  self-service system) ACTUALLY as a product w/ defined INTERNAL TARGET GROUPS (which
  teams ACTUALLY should use platform, w/ what ACTUAL needs), SHARED CAPABILITIES (what
  platform ACTUALLY provides that multiple teams would otherwise redundantly build
  themselves independently), PRODUCT BOUNDARIES (what platform explicitly doesn't cover,
  to limit scope creep)
KEY POINT: justifying adoption, funding, ownership against a purely infrastructural
  platform vision -- platform provided merely as technical infrastructure w/o product
  thinking ACTUALLY frequently experiences low adoption, since ACTUALLY not aligned w/
  concrete needs of internal users
DEFINING INTERNAL TARGET GROUPS means ACTUALLY understanding which teams should use
  platform + what these teams ACTUALLY need, instead of designing platform primarily
  from technical elegance or platform team's own view -- platform not knowing ACTUAL
  needs of internal target groups ACTUALLY builds technically impressive but for ACTUAL
  daily user work irrelevant features, leading to ACTUALLY low adoption
IDENTIFYING SHARED CAPABILITIES means ACTUALLY recognizing which functionality multiple
  teams would independently, redundantly build themselves if platform didn't provide it
  -- this redundancy avoidance is actual economic core of an internal platform: instead
  of every team ACTUALLY developing own solution for same, shared problem (deployment
  automation, observability instrumentation), platform bundles this capability centrally
EXPLICITLY DRAWING PRODUCT BOUNDARIES means deliberately deciding what platform
  ACTUALLY doesn't cover -- w/o this boundary, platform ACTUALLY grows uncontrolled,
  tries fulfilling every possible requirement of every team, ACTUALLY loses focus on
  actually shared, recurring needs
JUSTIFYING ADOPTION means ACTUALLY explaining why teams should use platform voluntarily
  (or under what circumstances usage made mandatory) -- platform w/ real product value
  ACTUALLY gets voluntarily adopted since it ACTUALLY saves using teams work, while
  purely mandatorily imposed but ACTUALLY not value-adding platform ACTUALLY leads to
  circumvention behavior
JUSTIFYING FUNDING means ACTUALLY clarifying how platform development is funded --
  centralized, org-wide investment or proportionally by using teams -- this decision
  ACTUALLY influences how platform prioritized: centrally funded platform must ACTUALLY
  justify its value to overall org, while team-cofunded platform must ACTUALLY react
  more directly to their concrete needs
JUSTIFYING OWNERSHIP means ACTUALLY clarifying which team is ACTUALLY responsible for
  platform as product, incl. roadmap decisions + support -- w/o this clear ownership,
  platform ACTUALLY becomes an orphaned, jointly "somehow" owned system whose further
  development ACTUALLY stagnates
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Zielgruppenverständnis | richtet Plattform an tatsächlichen Nutzerbedürfnissen aus | verhindert technisch beeindruckende, aber irrelevante Funktionen |
| Gemeinsame Fähigkeiten als wirtschaftlicher Kern | vermeidet redundante Eigenentwicklung je Team | zentraler Wertbeitrag der Plattform |
| Explizite Produktgrenzen | begrenzt unkontrolliertes Scope-Wachstum | erhält Fokus auf gemeinsame, wiederkehrende Bedürfnisse |
| Adoption durch echten Produktwert | freiwillige Nutzung statt Umgehung | unterscheidet werthaltige von rein verpflichtender Plattform |
| Geklärte Finanzierung und Ownership | zentrale vs. team-mitfinanzierte Priorisierung | verhindert Verwaisung und stagnierende Weiterentwicklung |

Implementierung: Die Plattform wird mit expliziter Zielgruppendefinition und Produktgrenzen entworfen. Gemeinsame Fähigkeiten werden anhand tatsächlich redundanter Eigenentwicklungen mehrerer Teams identifiziert. Finanzierungsmodell und Ownership sind explizit dokumentiert und einem konkreten, verantwortlichen Team zugeordnet.

## Scalability, Reliability, Security und Observability

Eine Plattformstrategie skaliert über die Anzahl der intern bedienten Zielgruppen und gemeinsam genutzten Fähigkeiten; die Reliability-Grenze liegt darin, dass eine ohne Ownership geführte Plattform tatsächlich stagniert und ihre Weiterentwicklung ausbleibt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine technisch solide Plattform wird von internen Teams kaum genutzt | die Plattform wurde ohne Zielgruppenverständnis entwickelt | eine gezielte Nutzerforschung mit den tatsächlichen Zielgruppen nachholen und die Plattform darauf ausrichten |
| die Plattform wächst unkontrolliert um immer neue Anforderungen | keine expliziten Produktgrenzen wurden gezogen | explizite Produktgrenzen definieren und Anfragen außerhalb dieser Grenzen ablehnen |
| die Plattformweiterentwicklung stagniert | keine klare Ownership für die Plattform als Produkt existiert | ein konkretes, verantwortliches Team mit Roadmap-Entscheidungsbefugnis benennen |

Security: Gemeinsam genutzte Plattformfähigkeiten sollten mandantenfähig und mit klaren Zugriffsgrenzen zwischen den nutzenden Teams gestaltet sein. Observability: Die tatsächliche Adoptionsrate und Nutzungshäufigkeit der Plattform durch interne Zielgruppen ist ein zentrales Signal zur Bewertung des tatsächlichen Produktwerts.

## Trade-offs und Entscheidungen

**Staff** implementiert eine gegebene, gemeinsame Fähigkeit innerhalb bestehender Plattformgrenzen. **Principal** entwirft die vollständige Plattformstrategie mit Zielgruppen, Fähigkeiten und Produktgrenzen für ein Vorhaben. **Chief** legt die unternehmensweite Plattformstrategie mit Finanzierungsmodell und Ownership-Struktur fest.

Anti-Patterns: eine Plattform primär aus technischer Eleganz statt aus Zielgruppenbedürfnissen entwerfen; keine expliziten Produktgrenzen ziehen, sodass die Plattform unkontrolliert wächst; eine Plattform ohne klare Ownership betreiben, sodass ihre Weiterentwicklung stagniert.

## Production Checklist

- [ ] Interne Zielgruppen und deren tatsächliche Bedürfnisse sind dokumentiert.
- [ ] Gemeinsame Fähigkeiten sind anhand tatsächlich redundanter Eigenentwicklungen identifiziert.
- [ ] Explizite Produktgrenzen sind definiert.
- [ ] Finanzierungsmodell und Ownership sind geklärt und einem konkreten Team zugeordnet.

## Interviewfragen

### 1. Warum sollte eine interne Plattform als Produkt statt als reine Infrastruktur behandelt werden?

**Antwort:** Weil eine rein infrastrukturelle Bereitstellung ohne Produktdenken häufig niedrige Adoption erfährt, da sie nicht auf die tatsächlichen Bedürfnisse ihrer internen Nutzer ausgerichtet ist.

### 2. Was ist der wirtschaftliche Kern einer internen Plattform?

**Antwort:** Die Vermeidung redundanter Eigenentwicklung, indem gemeinsame Fähigkeiten, die sonst mehrere Teams unabhängig voneinander selbst bauen müssten, zentral bereitgestellt werden.

### 3. Warum sind explizite Produktgrenzen für eine interne Plattform wichtig?

**Antwort:** Weil eine Plattform ohne diese Grenzen unkontrolliert wächst und versucht, jede mögliche Anforderung jedes Teams zu erfüllen, wodurch sie ihren Fokus auf gemeinsame, wiederkehrende Bedürfnisse verliert.

### 4. Warum führt eine rein verpflichtend auferlegte, aber nicht wertstiftende Plattform zu Umgehungsverhalten?

**Antwort:** Weil Nutzerteams eine Plattform, die ihnen keinen tatsächlichen Wert oder keine Arbeitsersparnis bietet, tendenziell umgehen, statt sie freiwillig zu nutzen.

### 5. Wie gehst du vor, wenn eine technisch solide Plattform von internen Teams kaum genutzt wird?

**Antwort:** Ich hole eine gezielte Nutzerforschung mit den tatsächlichen Zielgruppen nach, um deren konkrete Bedürfnisse zu verstehen, und richte die Plattform entsprechend neu aus.

### 6. Widersprüchliche Anforderung: Das Plattformteam will maximale technische Freiheit für innovative Lösungen UND die nutzenden Teams wollen eine stabile, vorhersehbare Plattform ohne häufige, disruptive Änderungen — wie gehst du vor?

**Antwort:** Ich würde innovative Weiterentwicklung über versionierte, abwärtskompatible Schnittstellen ermöglichen, sodass das Plattformteam technisch experimentieren kann, während nutzende Teams über stabile, vorhersehbare Schnittstellen weiterarbeiten, statt entweder Innovation zu blockieren oder Stabilität zu gefährden.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Plattformteam entwickelt ein internes Self-Service-Deployment-System für mehrere Produktteams (angelehnt an das in Domain 16 behandelte Kubernetes/Platform-Umfeld), ohne vorher die tatsächlichen Bedürfnisse der Produktteams zu erheben.

~~~python
# Local, deterministic illustration of platform adoption depending on target-group alignment (fictional lab example, no real organization):

def estimate_adoption(platform_features, actual_team_needs):
    covered = set(platform_features) & set(actual_team_needs)
    coverage_pct = len(covered) / len(actual_team_needs) * 100
    return {"coverage_pct": coverage_pct, "adoption_likely": coverage_pct > 60}

platform_features = ["custom_ci_dashboard", "advanced_metrics_viz", "one_click_rollback"]
actual_team_needs = ["one_click_rollback", "simple_deploy_status", "audit_log_access"]

print(estimate_adoption(platform_features, actual_team_needs))
~~~

Erwartete Beobachtung: Die Plattform deckt nur einen Teil der tatsächlichen Teambedürfnisse ab, da sie ohne vorherige Zielgruppenerhebung entwickelt wurde. Auswertung: Ein Plattformteam, das die tatsächlichen Bedürfnisse vorab erhoben hätte, hätte die begrenzten Entwicklungsressourcen auf die tatsächlich relevanten Fähigkeiten konzentrieren können, statt technisch aufwändige, aber wenig genutzte Funktionen zu bauen.

## Dependencies, Cross-References und Quellen

1. Evan Bottcher: [What I Talk About When I Talk About Platforms](https://martinfowler.com/articles/talk-about-platforms.html), abgerufen 2026-09-18.
2. Team Topologies (Matthew Skelton, Manuel Pais): [Team Topologies — Platform Teams](https://teamtopologies.com/), abgerufen 2026-09-18.

Dieses Kapitel baut auf der in KB-0687 (Technologieroadmaps steuern) beschriebenen Evidenzpunkt-Steuerung auf, angewendet auf die Plattform-Adoptionsbewertung.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Internal Developer Portals (etwa Backstage) als standardisierte Fassade für gemeinsame Plattformfähigkeiten mit integrierter Nutzungsmessung | Growing Adoption | Bei künftigen Plattformvorhaben evaluieren, jedoch die zugrunde liegende Produktdefinition (Zielgruppen, Fähigkeiten, Grenzen) unabhängig vom gewählten Portal-Werkzeug zuerst klären. |

Ein Team akzeptiert eine Plattformstrategie erst, wenn Zielgruppen, gemeinsame Fähigkeiten und Produktgrenzen definiert sowie Finanzierung und Ownership geklärt sind.
