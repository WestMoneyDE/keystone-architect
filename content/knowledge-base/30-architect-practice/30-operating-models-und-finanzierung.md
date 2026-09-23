---
{"id": "KB-0706", "title": "Operating Models und Finanzierung", "domain": "30", "sequence": 30, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0614", "concepts": ["Enterprise Operating Models"], "needed_for": "Dieses Kapitel konkretisiert die in KB-0614 beschriebenen Operating Models auf die praktische Verteilung von Plattform-, Produkt- und zentraler Serviceverantwortung"}, {"id": "KB-0688", "concepts": ["Plattform-Finanzierung"], "needed_for": "Die Finanzierungsfrage nutzt dieselbe zentrale-vs-mitfinanzierte Logik wie die in KB-0688 beschriebene Plattformstrategie"}], "related": ["KB-0696"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für eine gegebene Betriebsorganisation Plattform-, Produkt- und zentrale Serviceverantwortung konkret verteilen und eine nachvollziehbare Finanzierungsvereinbarung entwerfen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine komplexe Betriebsorganisation mehrere Operating-Model-Varianten gegeneinander abwägen und begründen, welche Verteilung von Verantwortung, Finanzierung und Eskalation tatsächlich am besten passt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Betriebsorganisation ohne nachvollziehbare Finanzierungs- oder Eskalationsvereinbarung geändert wird, sodass tatsächlich unklar bleibt, wer bei einem Problem verantwortlich ist.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Ein unternehmensweites Operating Model mit klarer Verantwortungsverteilung, nachvollziehbarer Finanzierung und funktionierender Eskalation gestalten und verantworten.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, formale Chargeback-/Showback-Finanzierungsmodell-Implementierung im Detail ist Vertiefung.", "rationale": "Kern ist die konkrete Verteilung von Verantwortung und Finanzierung, nicht die detaillierte, technische Abrechnungsimplementierung."}}, "lab_validation": [{"lab_id": "KB-0706-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung unklarer Eskalation bei fehlender Finanzierungsvereinbarung, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie ein Vorfall in einem zentral bereitgestellten Service ohne klare Finanzierungs- und Eskalationsvereinbarung zwischen Produkt- und Plattformteam zu Verzögerungen führt, während eine explizite Vereinbarung die Verantwortung sofort klärt.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# Operating Models und Finanzierung

> **Ziel:** Dieses Kapitel konkretisiert die in KB-0614 beschriebenen Enterprise Operating Models auf die praktische Verteilung von **Plattformverantwortung** (siehe KB-0688, gemeinsam genutzte Fähigkeiten), **Produktverantwortung** (fachliche, kundennahe Funktionalität) und **zentraler Serviceverantwortung** (unternehmensweite, nicht produktspezifische Dienste wie Identitätsverwaltung) in einer konkreten Betriebsorganisation. Der zentrale Punkt dieses Kapitels ist, dass diese Verantwortungsverteilung nur dann tatsächlich funktioniert, wenn **Finanzierung** (wer tatsächlich für welchen Service bezahlt), **Support** (wer tatsächlich bei einem Problem zuständig ist) und **Eskalation** (wohin ein ungelöstes Problem tatsächlich weitergegeben wird) explizit und nachvollziehbar vereinbart sind — ein Operating Model, das Verantwortung verteilt, aber Finanzierung und Eskalation ungeklärt lässt, führt tatsächlich zu Verzögerungen und Konflikten, sobald ein tatsächliches Problem auftritt.

## Zweck, Mental Model und Dependencies

Plattform-, Produkt- und zentrale Serviceverantwortung konkret zu verteilen bedeutet, tatsächlich für jeden Bereich der Betriebsorganisation zu klären, welche der drei Kategorien zutrifft — ein Plattformservice (siehe KB-0688) wird typischerweise von einem dedizierten Plattformteam für mehrere, interne Nutzerteams bereitgestellt; ein Produktbereich wird von einem Stream-aligned Team (siehe KB-0697) direkt für externe oder interne Endnutzer verantwortet; ein zentraler Service (etwa unternehmensweite Identitätsverwaltung) wird von einer zentralen Funktion für die gesamte Organisation bereitgestellt, unabhängig von einzelnen Produktbereichen. Finanzierung nachvollziehbar zu vereinbaren bedeutet, tatsächlich zu klären, wie die Kosten eines gemeinsam genutzten Services (Plattform oder zentraler Service) getragen werden — entweder zentral finanziert (die Organisation trägt die Kosten als gemeinsame Investition) oder durch ein Chargeback-/Showback-Modell anteilig auf die nutzenden Teams verteilt (entsprechend der in KB-0688 beschriebenen Finanzierungslogik); diese Entscheidung beeinflusst tatsächlich, wie der Service priorisiert und wie seine Nutzung tatsächlich gesteuert wird. Support nachvollziehbar zu vereinbaren bedeutet, tatsächlich zu klären, welches Team bei einem konkreten, auftretenden Problem tatsächlich zuständig ist — für einen Plattformservice ist typischerweise das Plattformteam für den Service selbst zuständig, während die nutzenden Produktteams für die korrekte Nutzung des Services in ihrem eigenen Kontext verantwortlich bleiben; diese Grenze muss tatsächlich klar gezogen sein, damit ein Problem nicht zwischen zwei Teams hin- und hergeschoben wird. Eskalation nachvollziehbar zu vereinbaren bedeutet, tatsächlich einen definierten Weg zu haben, wenn ein Problem tatsächlich nicht innerhalb der regulären Support-Struktur gelöst werden kann — dieser Weg entspricht strukturell dem in KB-0699 beschriebenen Eskalationsprinzip für Governance-Konflikte, hier jedoch auf tatsächliche, operative Probleme statt auf Architekturentscheidungen angewendet.

~~~text
This chapter concretizes KB-0614's enterprise operating models onto practical
  distribution of PLATFORM RESPONSIBILITY (see KB-0688, shared capabilities), PRODUCT
  RESPONSIBILITY (business-facing, customer-near functionality), CENTRAL SERVICE
  RESPONSIBILITY (org-wide, non-product-specific services like identity management) in
  a concrete operating organization
KEY POINT: this responsibility distribution only ACTUALLY works when FUNDING (who
  ACTUALLY pays for which service), SUPPORT (who's ACTUALLY responsible on a problem),
  ESCALATION (where an unresolved problem ACTUALLY gets forwarded) are explicitly+
  traceably agreed -- operating model distributing responsibility but leaving funding+
  escalation unclarified ACTUALLY leads to delays+conflicts once an ACTUAL problem arises
CONCRETELY DISTRIBUTING PLATFORM/PRODUCT/CENTRAL-SERVICE RESPONSIBILITY means ACTUALLY
  clarifying, for every area of operating org, which of 3 categories applies -- platform
  service (see KB-0688) typically provided by dedicated platform team for multiple,
  internal user teams; product area owned by stream-aligned team (see KB-0697) directly
  for external/internal end users; central service (org-wide identity mgmt) provided by
  central function for entire org, independent of individual product areas
TRACEABLY AGREEING FUNDING means ACTUALLY clarifying how a shared service's (platform or
  central service) costs are borne -- either centrally funded (org bears cost as joint
  investment) or proportionally distributed to using teams via chargeback/showback model
  (per KB-0688's funding logic) -- this decision ACTUALLY influences how service
  prioritized + its usage ACTUALLY steered
TRACEABLY AGREEING SUPPORT means ACTUALLY clarifying which team ACTUALLY responsible on
  a concrete, arising problem -- platform service typically has platform team
  responsible for service itself, while using product teams remain responsible for
  correct usage in own context -- this boundary must ACTUALLY be clearly drawn so a
  problem isn't pushed back and forth between two teams
TRACEABLY AGREEING ESCALATION means ACTUALLY having a defined path when a problem
  ACTUALLY can't be resolved within regular support structure -- structurally
  corresponds to KB-0699's governance-conflict escalation principle, here applied to
  ACTUAL, operational problems instead of architecture decisions
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Klare Verteilung Plattform/Produkt/zentraler Service | ordnet jeden Bereich einer eindeutigen Kategorie zu | Grundlage jeder weiteren Vereinbarung |
| Finanzierungsvereinbarung (zentral vs. Chargeback) | klärt Kostentragung gemeinsamer Services | beeinflusst Priorisierung und Nutzungssteuerung |
| Klare Support-Zuständigkeit | trennt Service- von Nutzungsverantwortung | verhindert Problem-Hin-und-Her zwischen Teams |
| Definierter Eskalationsweg | strukturierte Weiterleitung ungelöster Probleme | verhindert unklaren Umgang mit tatsächlich schweren Vorfällen |

Implementierung: Jeder Bereich der Betriebsorganisation wird explizit einer der drei Verantwortungskategorien zugeordnet. Für jeden gemeinsam genutzten Service wird ein Finanzierungsmodell (zentral oder Chargeback/Showback) vereinbart. Support-Zuständigkeit und Eskalationswege werden für jeden Servicebereich explizit dokumentiert.

## Scalability, Reliability, Security und Observability

Eine Operating-Model-Praxis skaliert über die Anzahl der koordinierten Plattform-, Produkt- und zentralen Servicebereiche; die Reliability-Grenze liegt darin, dass ungeklärte Finanzierungs- oder Eskalationsvereinbarungen tatsächlich zu Verzögerungen bei der Problembehandlung führen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Problem in einem gemeinsam genutzten Service wird zwischen zwei Teams hin- und hergeschoben | die Support-Zuständigkeit für den Service ist nicht klar getrennt | eine explizite, dokumentierte Support-Grenze zwischen Plattform- und nutzendem Team festlegen |
| ein Plattformservice wird trotz hoher Kritikalität unzureichend priorisiert | keine klare Finanzierungsvereinbarung existiert, die den Service angemessen unterstützt | ein explizites Finanzierungsmodell (zentral oder Chargeback) für den Service vereinbaren |
| ein tatsächlich schwerer Vorfall bleibt unbearbeitet, weil kein Team sich zuständig fühlt | kein definierter Eskalationsweg für ungelöste Probleme existiert | einen expliziten, dokumentierten Eskalationsweg für den betroffenen Servicebereich einführen |

Security: Zentrale, sicherheitsrelevante Services sollten mit garantierter, nicht verhandelbarer Finanzierung ausgestattet sein, um ihre kontinuierliche Verfügbarkeit sicherzustellen. Observability: Die tatsächliche Häufigkeit von Eskalationen und deren durchschnittliche Lösungszeit sind zentrale Signale zur Bewertung der Operating-Model-Wirksamkeit.

## Trade-offs und Entscheidungen

**Staff** arbeitet innerhalb einer gegebenen Support-Zuständigkeit an einem konkreten Problem. **Principal** entwirft die vollständige Verantwortungs-, Finanzierungs- und Eskalationsstruktur für einen komplexen Servicebereich. **Chief** gestaltet das unternehmensweite Operating Model und verantwortet dessen Finanzierung und Eskalationswirksamkeit.

Anti-Patterns: eine Betriebsorganisation ändern, ohne Finanzierung und Eskalation nachvollziehbar zu vereinbaren; Support-Zuständigkeiten zwischen Plattform- und Produktteam unklar lassen; einen kritischen, gemeinsam genutzten Service ohne garantierte Finanzierung betreiben.

## Production Checklist

- [ ] Jeder Bereich der Betriebsorganisation ist explizit einer Verantwortungskategorie zugeordnet.
- [ ] Ein Finanzierungsmodell für jeden gemeinsam genutzten Service ist vereinbart.
- [ ] Support-Zuständigkeit ist klar zwischen Plattform- und nutzendem Team getrennt.
- [ ] Ein definierter Eskalationsweg für ungelöste Probleme existiert.

## Interviewfragen

### 1. Welche drei Verantwortungskategorien unterscheidet dieses Kapitel?

**Antwort:** Plattformverantwortung, Produktverantwortung und zentrale Serviceverantwortung.

### 2. Warum ist eine klare Finanzierungsvereinbarung für einen gemeinsam genutzten Service wichtig?

**Antwort:** Weil sie beeinflusst, wie der Service priorisiert und seine Nutzung gesteuert wird, und ein Service ohne klare Finanzierung tatsächlich unzureichend priorisiert werden kann.

### 3. Warum muss die Support-Zuständigkeit zwischen Plattform- und nutzendem Team klar getrennt sein?

**Antwort:** Damit ein auftretendes Problem nicht zwischen den beiden Teams hin- und hergeschoben wird, was die Lösungszeit tatsächlich verlängert.

### 4. Was passiert, wenn kein definierter Eskalationsweg für ungelöste Probleme existiert?

**Antwort:** Ein tatsächlich schwerer Vorfall kann unbearbeitet bleiben, weil sich kein Team zuständig fühlt.

### 5. Wie gehst du vor, wenn ein Problem in einem gemeinsam genutzten Service zwischen zwei Teams hin- und hergeschoben wird?

**Antwort:** Ich prüfe, ob die Support-Zuständigkeit für den Service klar getrennt ist, und lege eine explizite, dokumentierte Support-Grenze fest.

### 6. Widersprüchliche Anforderung: Das Plattformteam will zentrale Finanzierung für maximale Stabilität UND die nutzenden Produktteams wollen Kostenverantwortung über ein Chargeback-Modell für mehr Kontrolle über Priorisierung — wie gehst du vor?

**Antwort:** Ich würde eine hybride Finanzierung einführen, bei der eine Basisstabilität zentral finanziert wird, während zusätzliche, teamspezifische Anforderungen über ein Chargeback-Modell finanziert werden, sodass sowohl Stabilität als auch Priorisierungskontrolle für die nutzenden Teams erhalten bleiben.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein zentraler Identitätsdienst (angelehnt an Domain 23, Security/Identity) wird von mehreren Produktteams genutzt. Bei einem Vorfall ist unklar, ob das Plattformteam oder das jeweilige Produktteam zuständig ist.

~~~python
# Local, deterministic illustration of clear support boundary and escalation path (fictional lab example, no real organization):

def route_incident(incident_type, service_ownership):
    if incident_type == "service_unavailable":
        return service_ownership["platform_team"]
    if incident_type == "incorrect_usage_in_product":
        return service_ownership["product_team"]
    return service_ownership.get("escalation_path", "unresolved: no escalation path defined")

ownership = {"platform_team": "identity_platform_team", "product_team": "requesting_product_team", "escalation_path": "cto_office"}
print(route_incident("service_unavailable", ownership))
print(route_incident("unknown_issue_type", ownership))
~~~

Erwartete Beobachtung: Ein Ausfall des Dienstes selbst wird korrekt dem Plattformteam zugeordnet, während ein unbekannter Fall über den definierten Eskalationsweg an die nächsthöhere Instanz geleitet wird. Auswertung: Ohne diese klare Zuordnung hätte der Vorfall vermutlich zwischen Plattform- und Produktteam hin- und hergeschoben werden können, was die tatsächliche Lösungszeit verlängert hätte.

## Dependencies, Cross-References und Quellen

1. Matthew Skelton, Manuel Pais: [Team Topologies — Platform as a Product](https://teamtopologies.com/), abgerufen 2026-09-18.
2. Gartner: [IT Operating Model Design — Funding and Governance Patterns](https://www.gartner.com/en/information-technology), abgerufen 2026-09-18.

Dieses Kapitel konkretisiert die in KB-0614 (Enterprise Operating Models) beschriebene Struktur und nutzt die in KB-0688 (Plattformstrategie) beschriebene Finanzierungslogik.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Chargeback-Kostenzuordnung basierend auf tatsächlicher Servicenutzung (Cloud-Tagging-basierte Kostenattribution) | Growing Adoption | Bei künftigen, größeren Operating-Model-Umstellungen evaluieren, jedoch bei bestehenden, funktionierenden Finanzierungsvereinbarungen weiterhin auf etablierte, manuelle Abstimmung setzen. |

Ein Team akzeptiert ein Operating Model erst, wenn Verantwortung, Finanzierung, Support und Eskalation nachweislich explizit und nachvollziehbar vereinbart sind.
