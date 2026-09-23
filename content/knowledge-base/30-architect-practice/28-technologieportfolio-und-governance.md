---
{"id": "KB-0704", "title": "Technologieportfolio und Governance", "domain": "30", "sequence": 28, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0601", "concepts": ["Application Portfolio Management"], "needed_for": "Dieses Kapitel konkretisiert die in KB-0601 beschriebene Portfolioverwaltung auf die organisationsweite Koordination von Investitionen, Ausnahmen und Ablösungen"}, {"id": "KB-0703", "concepts": ["Wirtschaftlich begründete Priorisierung"], "needed_for": "Portfolio-Investitionsentscheidungen nutzen dieselbe wirtschaftliche Priorisierungslogik wie die in KB-0703 beschriebene Architekturschulden-Priorisierung"}], "related": ["KB-0701"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für ein gegebenes Technologieportfolio Investitionen, Ausnahmen und Ablösungen mit klarer Owner-Zuordnung koordinieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein komplexes Portfolio mehrere, konkurrierende Investitionsoptionen anhand von Portfolioevidenz und gemeinsamen Abhängigkeiten priorisieren.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Portfolioentscheidung eine gemeinsame Abhängigkeit zwischen mehreren Technologien übersieht, sodass eine isolierte Entscheidung tatsächlich unerwartete Folgen für andere Portfoliobestandteile hat.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Ein unternehmensweites Technologieportfolio mit koordinierten Investitionen, Ausnahmen und Ablösungen führen und die strategischen Portfolioentscheidungen verantworten.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, formale Portfolio-Scoring-Methodik im Detail ist Vertiefung.", "rationale": "Kern ist die organisationsweite Koordination mit klarer Ownership, nicht die formale Scoring-Detailmethodik."}}, "lab_validation": [{"lab_id": "KB-0704-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung übersehener, gemeinsamer Portfolioabhängigkeiten, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie die isolierte Ablösung einer Technologie in einem Portfoliobereich unerwartet ein anderes, tatsächlich abhängiges Portfoliovorhaben beeinträchtigt, während eine koordinierte Portfolio-Governance diese Abhängigkeit vorab sichtbar macht.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# Technologieportfolio und Governance

> **Ziel:** Dieses Kapitel konkretisiert die in KB-0601 beschriebene Application-Portfolio-Verwaltung auf die organisationsweite Koordination von **Investitionen** (welche Technologiebereiche tatsächlich neue Investitionen erhalten), **Ausnahmen** (siehe KB-0701, wo einzelne Vorhaben begründet vom Portfolio-Standard abweichen) und **Ablösungen** (welche Technologien tatsächlich aus dem Portfolio entfernt werden). Der zentrale Punkt dieses Kapitels ist, dass diese Entscheidungen tatsächlich anhand von **Portfolioevidenz** (tatsächlichen Daten über Nutzung, Kosten und Risiko aller Portfoliobestandteile, nicht isolierten Einzelentscheidungen) und unter expliziter Berücksichtigung **gemeinsamer Abhängigkeiten** (wenn mehrere Portfoliobestandteile tatsächlich voneinander abhängen) getroffen werden müssen — eine isolierte Entscheidung über einen einzelnen Portfoliobestandteil, die gemeinsame Abhängigkeiten zu anderen Bestandteilen tatsächlich übersieht, kann tatsächlich unerwartete, negative Folgen für scheinbar unbeteiligte Vorhaben haben.

## Zweck, Mental Model und Dependencies

Portfolioevidenz zu nutzen bedeutet, tatsächlich Daten über Nutzung, Kosten und Risiko aller Portfoliobestandteile systematisch zu erfassen, bevor eine Investitions-, Ausnahme- oder Ablöseentscheidung getroffen wird — eine Entscheidung, die auf veralteten oder unvollständigen Portfoliodaten basiert, riskiert tatsächlich, Ressourcen in Bereiche zu lenken, die tatsächlich weniger kritisch sind als andere, deren tatsächlicher Zustand nicht bekannt war. Gemeinsame Abhängigkeiten zu berücksichtigen bedeutet, tatsächlich zu erkennen, wenn mehrere Portfoliobestandteile tatsächlich voneinander abhängen (etwa eine gemeinsam genutzte Plattformkomponente, siehe KB-0688, die mehrere Vorhaben tatsächlich gleichzeitig betrifft) — eine Ablöseentscheidung, die diese Abhängigkeit übersieht, kann tatsächlich mehrere, scheinbar unabhängige Vorhaben gleichzeitig beeinträchtigen, deren Zusammenhang aus der isolierten Betrachtung eines einzelnen Portfoliobestandteils tatsächlich nicht sichtbar wird. Investitionen zu koordinieren bedeutet, tatsächlich zu priorisieren, welche Technologiebereiche tatsächlich neue Investitionen erhalten, anhand derselben wirtschaftlichen Priorisierungslogik, die in KB-0703 für Architekturschulden beschrieben wurde — nicht jeder Portfoliobestandteil kann tatsächlich gleichzeitig investiert werden, sodass eine explizite, wirtschaftlich begründete Priorisierung notwendig ist. Ausnahmen zu koordinieren bedeutet, tatsächlich den in KB-0701 beschriebenen Ausnahmeprozess organisationsweit konsistent anzuwenden, statt ihn isoliert innerhalb einzelner Vorhaben ad hoc zu handhaben — eine unkoordinierte Ausnahmebehandlung riskiert tatsächlich, dass ähnliche Ausnahmefälle in unterschiedlichen Portfoliobereichen inkonsistent entschieden werden. Klare Owner für strategische Portfolioentscheidungen festzulegen bedeutet, tatsächlich sicherzustellen, dass jede Investitions-, Ausnahme- oder Ablöseentscheidung eine konkrete, verantwortliche Person oder Rolle hat, entsprechend dem durchgängig in diesem Curriculum etablierten Prinzip expliziter Ownership — ein Portfolio ohne diese klaren Owner riskiert tatsächlich, dass strategisch wichtige Entscheidungen unbearbeitet bleiben, weil sich niemand tatsächlich verantwortlich fühlt.

~~~text
This chapter concretizes KB-0601's application-portfolio management onto org-wide
  coordination of INVESTMENTS (which tech areas ACTUALLY get new investment),
  EXCEPTIONS (see KB-0701, individual projects ACTUALLY justifiably deviating from
  portfolio standard), RETIREMENTS (which technologies ACTUALLY removed from portfolio)
KEY POINT: these decisions must ACTUALLY be made via PORTFOLIO EVIDENCE (ACTUAL data on
  usage, cost, risk of all portfolio components, not isolated individual decisions) +
  explicit consideration of SHARED DEPENDENCIES (multiple portfolio components ACTUALLY
  depend on each other) -- isolated decision on single portfolio component ACTUALLY
  overlooking shared dependencies to other components CAN ACTUALLY have unexpected,
  negative consequences for seemingly uninvolved projects
USING PORTFOLIO EVIDENCE means ACTUALLY systematically capturing usage/cost/risk data
  of all portfolio components before investment/exception/retirement decision made --
  decision based on outdated/incomplete portfolio data ACTUALLY risks directing
  resources to areas ACTUALLY less critical than others whose ACTUAL state was unknown
CONSIDERING SHARED DEPENDENCIES means ACTUALLY recognizing when multiple portfolio
  components ACTUALLY depend on each other (shared platform component, see KB-0688,
  ACTUALLY affecting multiple projects simultaneously) -- retirement decision
  overlooking this dependency CAN ACTUALLY simultaneously impact multiple, seemingly
  independent projects whose connection ACTUALLY not visible from isolated view of a
  single portfolio component
COORDINATING INVESTMENTS means ACTUALLY prioritizing which tech areas ACTUALLY get new
  investment, via same economic prioritization logic described in KB-0703 for
  architectural debt -- not every portfolio component can ACTUALLY be invested in
  simultaneously, explicit, economically justified prioritization necessary
COORDINATING EXCEPTIONS means ACTUALLY applying KB-0701's exception process org-wide
  consistently, instead of handling it isolated ad hoc within individual projects --
  uncoordinated exception handling ACTUALLY risks similar exception cases decided
  inconsistently across different portfolio areas
FIXING CLEAR OWNERS for strategic portfolio decisions means ACTUALLY ensuring every
  investment/exception/retirement decision has a concrete, responsible person/role, per
  the explicit-ownership principle established throughout this curriculum -- portfolio
  w/o these clear owners ACTUALLY risks strategically important decisions staying
  unaddressed because nobody ACTUALLY feels responsible
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Systematische Portfolioevidenz | liefert aktuelle Daten für Investitions-/Ablöseentscheidungen | verhindert Ressourcenlenkung auf Basis unvollständiger Daten |
| Explizite Abhängigkeitsberücksichtigung | erkennt gemeinsam genutzte Komponenten über Vorhaben hinweg | verhindert übersehene Folgeeffekte bei Ablösungen |
| Wirtschaftlich koordinierte Investitionspriorisierung | nutzt dieselbe Logik wie Architekturschulden-Priorisierung | verhindert gleichzeitige, unpriorisierte Investition in alle Bereiche |
| Organisationsweit konsistente Ausnahmebehandlung | wendet Ausnahmeprozess einheitlich an | verhindert inkonsistente Entscheidungen zwischen Portfoliobereichen |
| Klare Owner für strategische Entscheidungen | konkrete Verantwortlichkeit je Portfolioentscheidung | verhindert unbearbeitete, strategisch wichtige Entscheidungen |

Implementierung: Portfolioevidenz wird systematisch und aktuell für alle Bestandteile erfasst. Gemeinsame Abhängigkeiten zwischen Portfoliobestandteilen werden vor Ablöseentscheidungen explizit geprüft. Investitionen werden anhand wirtschaftlicher Priorisierung koordiniert. Für jede strategische Portfolioentscheidung ist ein konkreter Owner benannt.

## Scalability, Reliability, Security und Observability

Eine Technologieportfolio-Governance-Praxis skaliert über die Anzahl der koordinierten Portfoliobestandteile; die Reliability-Grenze liegt darin, dass eine übersehene, gemeinsame Abhängigkeit bei einer isolierten Ablöseentscheidung tatsächlich mehrere Vorhaben gleichzeitig beeinträchtigen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| die Ablösung einer Technologie beeinträchtigt unerwartet ein scheinbar unabhängiges Vorhaben | eine gemeinsame Abhängigkeit zwischen den Portfoliobestandteilen wurde nicht erfasst | vor künftigen Ablösungen eine systematische, gemeinsame Abhängigkeitsprüfung durchführen |
| Investitionsentscheidungen wirken willkürlich oder inkonsistent | keine systematische, aktuelle Portfolioevidenz lag der Entscheidung zugrunde | eine systematische, regelmäßig aktualisierte Portfolioevidenzbasis etablieren |
| ähnliche Ausnahmefälle werden in unterschiedlichen Portfoliobereichen unterschiedlich entschieden | die Ausnahmebehandlung erfolgte isoliert je Vorhaben statt organisationsweit koordiniert | den Ausnahmeprozess organisationsweit konsistent koordinieren |

Security: Sicherheitsrelevante Technologiebereiche im Portfolio sollten mit besonders aktueller Evidenz und eigenem, dediziertem Owner geführt werden. Observability: Die tatsächliche Vollständigkeit und Aktualität der Portfolioevidenz ist ein zentrales Signal zur Bewertung der Governance-Qualität.

## Trade-offs und Entscheidungen

**Staff** liefert Portfolioevidenz für einen begrenzten, konkreten Technologiebereich. **Principal** entwirft die vollständige Portfoliokoordinationsstruktur mit Abhängigkeitsprüfung für ein komplexes Portfolio. **Chief** führt das unternehmensweite Technologieportfolio und verantwortet die strategischen Investitions-, Ausnahme- und Ablöseentscheidungen.

Anti-Patterns: eine Ablöseentscheidung ohne Prüfung gemeinsamer Abhängigkeiten treffen; Investitionen ohne systematische, wirtschaftlich begründete Priorisierung über alle Portfoliobereiche verteilen; Ausnahmen isoliert je Vorhaben statt organisationsweit konsistent behandeln.

## Production Checklist

- [ ] Portfolioevidenz ist systematisch und aktuell für alle Bestandteile erfasst.
- [ ] Gemeinsame Abhängigkeiten sind vor Ablöseentscheidungen explizit geprüft.
- [ ] Investitionen sind wirtschaftlich begründet priorisiert.
- [ ] Jede strategische Portfolioentscheidung hat einen konkreten, benannten Owner.

## Interviewfragen

### 1. Warum kann eine isolierte Ablöseentscheidung unerwartete Folgen für scheinbar unbeteiligte Vorhaben haben?

**Antwort:** Weil mehrere Portfoliobestandteile tatsächlich voneinander abhängen können, etwa über eine gemeinsam genutzte Plattformkomponente, und diese Abhängigkeit aus einer isolierten Betrachtung eines einzelnen Bestandteils nicht sichtbar wird.

### 2. Warum ist systematische Portfolioevidenz für Investitionsentscheidungen wichtig?

**Antwort:** Weil eine Entscheidung auf Basis veralteter oder unvollständiger Daten riskiert, Ressourcen in weniger kritische Bereiche zu lenken, während der tatsächliche Zustand kritischerer Bereiche unbekannt bleibt.

### 3. Warum sollte der Ausnahmeprozess organisationsweit koordiniert statt isoliert je Vorhaben angewendet werden?

**Antwort:** Um zu verhindern, dass ähnliche Ausnahmefälle in unterschiedlichen Portfoliobereichen inkonsistent entschieden werden.

### 4. Wie hängt die Portfolio-Investitionspriorisierung mit der Architekturschulden-Priorisierung zusammen?

**Antwort:** Beide nutzen dieselbe wirtschaftliche Priorisierungslogik, um zu entscheiden, welche Bereiche mit begrenzten Ressourcen zuerst adressiert werden sollen.

### 5. Wie gehst du vor, wenn die Ablösung einer Technologie unerwartet ein scheinbar unabhängiges Vorhaben beeinträchtigt?

**Antwort:** Ich prüfe, ob eine gemeinsame Abhängigkeit zwischen den betroffenen Portfoliobestandteilen übersehen wurde, und etabliere für künftige Ablösungen eine systematische, gemeinsame Abhängigkeitsprüfung.

### 6. Widersprüchliche Anforderung: Einzelne Teams wollen autonome Entscheidungsfreiheit über ihre eigenen Technologien UND die Organisation will koordinierte, portfolioweite Investitions- und Ablöseentscheidungen — wie gehst du vor?

**Antwort:** Ich würde eine föderierte Struktur nutzen, bei der Teams innerhalb eines vorgegebenen Rahmens autonom entscheiden können, während tatsächlich portfolioweit relevante Entscheidungen (gemeinsame Abhängigkeiten, größere Investitionen) zentral koordiniert werden, entsprechend dem in KB-0699 beschriebenen Prinzip föderierter Verantwortung.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Unternehmen plant die Ablösung einer gemeinsam genutzten, internen Authentifizierungsplattform (angelehnt an Domain 23, Security/Identity), die tatsächlich von drei unterschiedlichen, scheinbar unabhängigen Produktteams genutzt wird.

~~~python
# Local, deterministic illustration of checking shared dependencies before a portfolio retirement decision (fictional lab example, no real portfolio):

portfolio_components = {
    "auth_platform": {"used_by": ["team_a", "team_b", "team_c"], "status": "planned_for_retirement"},
}

def check_retirement_impact(component_name, portfolio):
    component = portfolio[component_name]
    if component["status"] == "planned_for_retirement" and len(component["used_by"]) > 1:
        return {"warning": "shared dependency detected", "affected_teams": component["used_by"]}
    return {"warning": None}

print(check_retirement_impact("auth_platform", portfolio_components))
~~~

Erwartete Beobachtung: Die Prüfung deckt korrekt auf, dass die geplante Ablösung drei Teams gleichzeitig betrifft, statt nur das ursprünglich anfragende Team. Auswertung: Ohne diese explizite Abhängigkeitsprüfung hätte die Organisation die Ablösung möglicherweise isoliert für ein Team geplant und die beiden anderen, tatsächlich betroffenen Teams unerwartet beeinträchtigt.

## Dependencies, Cross-References und Quellen

1. Gartner: [IT Portfolio Management — Governance Best Practices](https://www.gartner.com/en/information-technology), abgerufen 2026-09-18.
2. The Open Group: [TOGAF Standard — Architecture Governance and Portfolio Management](https://www.opengroup.org/togaf), abgerufen 2026-09-18.

Dieses Kapitel konkretisiert die in KB-0601 (Application Portfolio Management) beschriebene Verwaltung und nutzt die in KB-0703 (Architekturschulden priorisieren) beschriebene, wirtschaftliche Priorisierungslogik sowie den in KB-0701 (Standards einführen und ablösen) beschriebenen Ausnahmeprozess.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Abhängigkeitsgraph-Erfassung zwischen Portfoliobestandteilen (Service-Mesh-Traffic-Analyse, API-Aufrufmuster) zur frühzeitigen Erkennung gemeinsamer Abhängigkeiten | Growing Adoption | Bei künftigen, umfangreichen Portfolios evaluieren, jedoch die finale Ablöseentscheidung weiterhin nach menschlicher Prüfung der erkannten Abhängigkeiten treffen. |

Ein Team akzeptiert eine Technologieportfolio-Governance-Entscheidung erst, wenn Portfolioevidenz aktuell vorliegt, gemeinsame Abhängigkeiten geprüft sind und ein konkreter Owner die Entscheidung verantwortet.
