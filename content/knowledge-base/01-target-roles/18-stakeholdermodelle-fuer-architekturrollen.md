---
{"id": "KB-0028", "title": "Stakeholdermodelle für Architekturrollen", "domain": "01", "sequence": 18, "document_type": "role", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0002", "concepts": ["Rollen-Kompetenz-Matrix", "Tiefenstufen", "Nachweisarten"], "needed_for": "understanding"}, {"id": "KB-0004", "concepts": ["Evidenzgrenzen", "zulässige Aussagen", "Zielkompetenzen"], "needed_for": "understanding"}, {"id": "KB-0005", "concepts": ["Kompetenzcanvas", "Entscheidungsreichweite", "Wirkungskette"], "needed_for": "understanding"}, {"id": "KB-0006", "concepts": ["Hands-on-Tiefe", "Architekturnachweis", "Spezialistenübergabe"], "needed_for": "understanding"}, {"id": "KB-0009", "concepts": ["Labstrategie", "Gegenprobe", "Evidenzgrenze"], "needed_for": "lab"}], "related": ["KB-0011", "KB-0013", "KB-0014", "KB-0015", "KB-0016", "KB-0017", "KB-0022", "KB-0023", "KB-0025", "KB-0026", "KB-0027", "KB-0029", "KB-0550", "KB-0565", "KB-0612", "KB-0720"], "applies": ["KB-0550", "KB-0565", "KB-0612", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für einen synthetischen Architekturfall werden Stakeholderkarte, Concern Matrix, RACI, Conflict Register, Decision Gate, Kommunikation und negative Gegenproben erstellt.", "rationale": "Ein Modell wird erst wertvoll, wenn es Rollen, Entscheidungen, offene Konflikte und technische Evidenz an konkrete Artefakte bindet."}, "ARCHITECT-TARGET": {"active": true, "scope": "Stakeholderinteressen werden mit Systemgrenzen, Qualitätsattributen, Daten-/Control-Flow, Betrieb, Kosten und Risiko verbunden.", "rationale": "Architektur ist Vermittlung zwischen korrekten, aber unterschiedlich begrenzten Perspektiven."}, "STAFF-TARGET": {"active": true, "scope": "Teams erhalten klare Entscheidungsräume, Referenzpfade, Reviewinterfaces, Eskalationswege und Feedbackschleifen.", "rationale": "Gute Stakeholderarbeit senkt Reibung, ohne Verantwortung zu zentralisieren."}, "CHIEF-TARGET": {"active": true, "scope": "Sponsorship, Risikotoleranz, Portfolio-/Investment- und Governanceentscheidungen werden mit ihrer formalen Accountabilty transparent gemacht.", "rationale": "Chief-Wirkung erfordert klare Grenzen zwischen Einfluss, Expertise, Veto und verantwortlicher Entscheidung."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Security, Privacy, Legal, Finance, Procurement, SRE, Data, Network, GPU, Accessibility und Fachdomänen werden als verantwortliche Spezialisten beteiligt.", "rationale": "Stakeholdermapping ersetzt weder formale Kontrollmandate noch technische Spezialprüfung."}}, "lab_validation": [{"lab_id": "KB-0028-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Nicht produktive Fallarbeit für eine föderierte interne AI-Knowledge-Assistance", "evidence": "Das Lab definiert Stakeholderkarte, Interests, Decision Rights, RACI, Konfliktregister, technische Entscheidung, Messung, Gegenproben und Cleanup.", "limitations": "Keine echten Stakeholder, Teams, Kundendaten, Budgets, Verträge, Legal-/Securityfreigaben, Providerkonten oder Produktionssysteme wurden eingebunden oder behauptet."}]}
---
# Stakeholdermodelle für Architekturrollen

> **Zweck:** Architekturentscheidungen werden selten durch technische Logik allein blockiert. Meist treffen mehrere berechtigte Interessen aufeinander: Nutzerwert, Betriebsfähigkeit, Sicherheit, Datenschutz, Kosten, Verträge, Lieferzeit, Datenqualität und strategische Ausrichtung. Ein Stakeholdermodell macht diese Interessen, Rechte und Konflikte sichtbar, ohne Menschen in Schubladen oder ein starres Kommunikationsritual zu pressen.

## Purpose, Definition und Scope

Ein Stakeholdermodell erfasst Personen, Teams oder Funktionen, die von einer Architekturentscheidung betroffen sind, Einfluss darauf besitzen, Expertise liefern, formale Rechte haben oder die Folgen betreiben müssen. Es unterscheidet vier Dinge, die häufig fälschlich zusammenfallen:

1. **Betroffenheit:** Wer trägt Nutzen, Arbeit, Risiko oder Schaden?
2. **Einfluss:** Wer kann Richtung, Budget, Technologie, Priorität oder Akzeptanz real verändern?
3. **Expertise:** Wer kennt fachliche, technische, rechtliche oder operative Grenzen?
4. **Accountability:** Wer trifft innerhalb seines Mandats die verantwortliche Entscheidung?

Ein Sponsor kann hohe Priorität setzen, aber keine sichere Modellroute beurteilen. Ein SRE kann eine Betriebsgrenze begründen, aber nicht allein den Produktnutzen bewerten. Security kann innerhalb ihres Mandats ein relevantes Risiko stoppen, ersetzt jedoch keine fachliche Use-Case-Entscheidung. Product verantwortet Nutzerwert, aber nicht allein Datenresidenz oder Plattform-SLO. Architektur verbindet diese Perspektiven in entscheidbare Optionen.

Der Scope umfasst alle priorisierten Zielrollen. Besonders bei GenAI entstehen neue Stakeholderkonflikte: Ein Product Team möchte schnelle Hilfe, Security und Privacy verlangen Daten-/Toolgrenzen, Operations braucht Degradation und On-call, Finance will Kostenklarheit, Datenowner brauchen Zweckbindung, Plattformteams vermeiden Speziallösungen, und Executive Sponsoren verlangen nachvollziehbaren Wert. Das Modell verhindert, dass der lauteste oder ranghöchste Input eine unvollständige Entscheidung ersetzt.

## Kompetenzstatus und Evidenzgrenzen

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Interessen, Entscheidungstyp, Mandat, Evidence und Konflikt lassen sich strukturiert abbilden. |
| HANDS-ON-TARGET | Eine Stakeholderkarte wird an Contract, ADR, SLO, Cost und Risiko eines konkreten Labs getestet. |
| ARCHITECT-TARGET | Jede Architekturansicht macht Empfänger, Concerns, offene Konflikte und Entscheidung klar. |
| STAFF-TARGET | Teams bekommen Selbstbedienungsgrenzen und frühzeitige Reviewwege statt später Eskalation. |
| CHIEF-TARGET | Sponsorship, Risikotoleranz, Budget und Portfolioaccountability bleiben sichtbar. |
| SPECIALIST-OPTIONAL | Fachreviews sind explizit; Architektur übernimmt ihre formale Freigabe nicht. |

## Mental Model: Das Entscheidungsdreieck und die unsichtbaren Folgen

Für jede wichtige Entscheidung existiert ein Dreieck:

```text
               Accountable decision
                    /       \
                   /         \
        Evidence / expertise -- impact / operation
```

Eine Entscheidung ist schwach, wenn eine Ecke fehlt. Ein Executive kann entscheiden, braucht aber technische und operative Evidenz. Spezialisten liefern Expertise, aber nicht automatisch die Geschäftspriorität. Betreiber tragen Folgen, benötigen aber eine klare fachliche Grenze. Architektur sorgt dafür, dass alle drei Ecken sichtbar sind.

Neben dem Dreieck stehen häufig unsichtbare Betroffene: Support, Compliance, Kundenkommunikation, FinOps, Procurement, Accessibility, Data Stewards, Incident Commander, Dokumentation und zukünftige Teams. Ein Stakeholdermodell darf nicht ausufern. Es priorisiert Menschen und Funktionen nach konkreter Entscheidung, Risiko und Betrieb.

## Prerequisites und Dependencies

| Abhängigkeit | Anwendung |
|---|---|
| KB-0002 Rollen- und Kompetenzmodell | Titel, Einfluss und Verantwortlichkeit trennen. |
| KB-0004 Selbsteinschätzung und Evidenzgrenzen | Keine reale Stakeholderarbeit aus Projektkontexten ableiten. |
| KB-0005 Kompetenzcanvas | Interessen in Wert-, Risiko-, Evidenz- und Entscheidungslogik übersetzen. |
| KB-0006 Hands-on bis Chief | Technische Referenzarbeit und Executive-Evidenz verbinden. |
| KB-0009 Labstrategie | Konflikte mit sicheren, synthetischen Gegenproben testen. |
| KB-0027 Architekturartefakte | Empfänger und Concerns in die passenden Ansichten und Decision Records überführen. |

## Core Concepts

### 1. Stakeholder ist keine Hierarchiestufe

Ein Stakeholdermodell wird nicht aus dem Organigramm abgeleitet. Ein Team mit wenig formaler Macht kann enorme Auswirkung tragen, etwa On-call bei einem neuen Plattformdienst. Ein Data Owner kann rechtlich/fachlich notwendige Grenzen haben. Ein Kunde kann nicht im Meeting sitzen, muss aber durch Forschungs- oder Supportevidenz vertreten werden.

| Kategorie | Beispiel | Architekturfrage |
|---|---|---|
| Sponsor | Product/Business Executive | Welchen Outcome, Budgetrahmen und Priorität verfolgt die Initiative? |
| Accountable Owner | Domain/Technology/Executive DRI | Wer akzeptiert Trade-off, Risiko und Revisit innerhalb des Mandats? |
| Nutzer/Betroffene | Support, Kunde, interne Mitarbeitende | Welche Aufgabe, Fehlerfolge, Erklärung und Degradation ist akzeptabel? |
| Betreiber | SRE, Platform, Support, Incident Response | Wie wird beobachtet, begrenzt, unterstützt und wiederhergestellt? |
| Control Owner | Security, Privacy, Legal, Risk, Data Governance | Welche Kontrolle, Prüfung, Veto- oder Eskalationsgrenze gilt? |
| Implementer | Delivery, Data, ML, Integration Teams | Was muss technisch klar, testbar und lieferbar sein? |
| Economic Owner | Finance, FinOps, Procurement | Welche Kosten-, Vertrags-, Kapazitäts- und Exitannahme gilt? |
| Ecosystem | Partner, Provider, OSS, Regulator | Welche externe Schnittstelle, Verpflichtung oder Abhängigkeit verändert die Wahl? |

### 2. Interesse ist nicht Position

„Wir brauchen Modell X“ ist eine Position. Dahinter können unterschiedliche Interessen liegen: Qualität, Time-to-market, geringere Kosten, bereits vorhandene Skills, Datenresidenz, Vertragsbedingungen oder Benchmark-Reputation. Architektur fragt nach der zugrunde liegenden Concern und kann dadurch bessere Optionen bauen.

```text
Position: "Direkt beim Provider integrieren"
    -> Interesse: "schnell an Qualität testen"
        -> Option: "bounded provider adapter with read-only data, cost cap and exit contract"
```

Das löst Konflikte nicht immer, verhindert aber, dass Teams über Tools streiten, obwohl sie unterschiedliche Ziele schützen wollen.

### 3. RACI reicht nicht ohne Decision Contract

RACI beantwortet grob: Responsible, Accountable, Consulted, Informed. Es beantwortet nicht automatisch:

- Welches Objekt wird entschieden?
- Welche Evidenz reicht?
- Welche Control Owner haben eine zwingende Grenze?
- Welche Option ist im Scope?
- Wie wird Dissens dokumentiert?
- Wann wird revidiert?
- Welche Auswirkungen entstehen für Betrieb und Nutzer?

Ergänze daher einen Decision Contract:

```yaml
decision:
  object: "read-only AI assistance for support"
  accountable: "named domain/product executive within mandate"
  responsible: ["solution owner", "platform owner"]
  consulted: ["security", "privacy", "SRE", "data owner", "finance"]
  informed: ["support", "affected teams"]
  evidence: ["threat model", "contract tests", "SLO", "cost/quality slice"]
  hard_stops: ["unapproved data class", "missing domain authorization", "unresolved audit gap"]
  revisit: "at gate or material change"
```

### 4. Power, Legitimacy und Urgency

Ein praktisches Modell ergänzt formale Rollen um drei Fragen:

- **Power:** Kann diese Funktion Ressourcen, Entscheidungen oder Betrieb tatsächlich beeinflussen?
- **Legitimacy:** Hat sie formale oder fachlich notwendige Berechtigung?
- **Urgency:** Ist die Frage zeitkritisch oder schadensrelevant?

Ein Sponsor kann `power` besitzen, Security/Privacy hohe `legitimacy`, und SRE bei einem akuten Incident hohe `urgency`. Architektur sollte keine allgemeine „High/Medium/Low“-Liste führen, sondern diese Werte pro Entscheidungsobjekt aktualisieren.

### 5. Konfliktregister statt Konsenssimulation

Ein Konflikt ist nicht zwangsläufig ein Problem. Er wird gefährlich, wenn er versteckt oder durch unklare Macht entschieden wird.

| Feld | Beispiel |
|---|---|
| Konflikt | Product will Tool Action, Security verlangt no-write. |
| Interessen | Durchlaufzeit vs. Schadens-/Autorisierungsrisiko. |
| Fakten | Seiteneffekt, Datenklasse, Domain authorization, incident path, Nutzerfehler. |
| Optionen | read-only, human-approved command, begrenzte reversible action, stop. |
| Mandat | Product/Domain: Outcome; Security: Control boundary; Executive: Risiko-/Investmentscope. |
| Entscheidung | Read-only pilot; Human Gate-Option nur mit unabhängiger Reviewevidenz. |
| Revisit | Nach Qualität/Safety/Operationsgate. |
| Offene Frage | rechtliche Klassifikation für konkreten Use Case. |

## Architecture und Data Flow: Stakeholderentscheidungen im AI-Workflow

### Stakeholder Map

```text
Sponsor / Product ---- outcome, priority, budget hypothesis
     |                         |
Domain owner ---- process, data, authorization
     |                         |
Solution architect --- workflow, NFR, integration
     |                         |
Platform/SRE ------- contract, SLO, support, cost telemetry
     |                         |
Security/Privacy --- controls, data/identity, audit, risk
     |                         |
Finance/Procurement - allocation, contract, exit
     |                         |
Users/Support ------ usability, failure communication, escalation
```

### Control- und Decision Flow

```text
Business need
  -> sponsor/product hypothesis
  -> domain use-case + data classification
  -> solution design + NFR
  -> security/privacy control assessment
  -> platform fit/SLO/cost/support assessment
  -> decision contract and accountable choice
  -> delivery + monitored bounded rollout
  -> user, operator, security and finance evidence
  -> revise / scale / stop
```

Der Flow heißt nicht, dass alle immer in jeder Entscheidung zustimmen müssen. Seine Funktion ist, den richtigen Input vor der irreversiblen oder schadensreichen Entscheidung zu erheben und ein klares Mandat festzuhalten.

### Beispielmatrix

| Stakeholder | Concern | Recht / Input | Artefakt | Signal |
|---|---|---|---|---|
| Sponsor | Wert, Priorität, Budgethypothese | priorisiert innerhalb Mandat | Opportunity/Portfolio Record | outcome, investment burn |
| Domain Owner | Fachregel, Daten, action | system-of-record authorization | process/context/ADR | business error, denied action |
| Product | Nutzerwert, UX, Scope | Product decision | problem frame, eval slice | task completion, abandonment |
| Platform | Wiederverwendung, SLO, lifecycle | platform contract decision | contract, golden path, runbook | adoption, support, SLO |
| SRE | operation, recovery, load | operational readiness input | SLO, runbook, capacity model | burn, queue, incident |
| Security/Privacy | data/identity/control/audit | mandated review/veto as applicable | threat/control record | denial, finding, audit gap |
| Finance/FinOps | cost, allocation, commitment | budget/process input | unit economics, cost record | anomaly, allocation coverage |
| Support | error communication/escalation | usability/operations input | fallback UX, runbook | ticket, resolution time |

## Protokolle, Standards und Technologien

| Thema | Stakeholderwert |
|---|---|
| ISO/IEC/IEEE 42010 | Views werden an Stakeholder-Concerns orientiert. |
| OpenAPI/AsyncAPI | Domain, Solution, Platform und Consumer verhandeln überprüfbare Schnittstellen. |
| OAuth/OIDC/Workload Identity | Security, Platform und Domain trennen Authentisierung, Delegation und Fachautorisation. |
| OpenTelemetry | Product, SRE, Security und Finance teilen datensparsame Betriebs-/Costsignale. |
| Service Catalog | Owner, Lifecycle und Support sind auffindbar, aber nicht automatisch autorisiert. |
| Feature Flags | Product/Solution können begrenzte Rollouts steuern; Security-/Policygrenzen werden nicht umgangen. |
| FinOps Framework | Finance, Engineering und Business verbinden Cost und Wert. |
| NIST AI RMF | Use-Case-, Capability- und Runtime-Risiken werden nicht auf einen Prompt reduziert. |

## Konfiguration und Implementierung: Stakeholderkarte als lebendes Entscheidungsartefakt

### 1. Map-Template

```yaml
stakeholder:
  role: "SRE / platform operations"
  concern:
    - "recoverability"
    - "capacity and tail latency"
    - "on-call load"
  decision_right:
    type: "consulted / operational readiness gate"
    scope: "platform service SLO and runbook"
  evidence_needed:
    - "failure drill"
    - "alert and owner"
    - "degradation behavior"
  communication:
    channel: "architecture review + service readiness gate"
    cadence: "event-driven, not meeting-only"
  risk_if_ignored: "unowned incidents and unsafe retry behavior"
```

Die Karte wird für ein konkretes Entscheidungsobjekt erstellt. Ein globales Verzeichnis von „Stakeholdertypen“ ersetzt sie nicht.

### 2. Kommunikationsplan

| Phase | Zielgruppe | Was wird benötigt? | Format |
|---|---|---|---|
| Discovery | Domain, Product, Users, Support | Problem, Nutzen, Nichtziele, Wirkung des Fehlers | Interview, Journey, Problem Frame |
| Design | Solution, Platform, Security, Privacy, Data | context/runtime, contract, threat/NFR/options | Reviewable markdown/diagram/schema |
| Decision | Accountable owner, Sponsor, Finance, Architecture | Optionen, Risiko, Cost, transition, recommendation | Decision Record |
| Delivery | Teams, Platform, SRE | Contract, template, test, rollout, runbook | repository/CI/catalog |
| Operations | Support, SRE, Security, Product | dashboard, alert, escalation, fallback communication | runbook/dashboard |
| Review | alle relevanten Owner | outcome, quality, risk, cost, incident, adoption | decision gate / postmortem |

### 3. Konfliktentscheidung mit Grenzen

```yaml
conflict:
  topic: "enable AI tool actions"
  non_negotiable:
    - "domain authorization is server-side"
    - "auditable command and safe rollback"
  bounded_experiment:
    scope: "read-only first; no customer-impacting writes"
    population: "synthetic/internal"
    stop: "policy/audit gap, unsafe outcome or unresolved ownership"
  decision_owner: "named accountable business/technology authority"
  specialists:
    - "security/privacy: control review"
    - "SRE: readiness"
    - "finance: cost limit"
  revisit: "after documented evidence gate"
```

## Scalability und Performance

Stakeholderarbeit skaliert nicht durch mehr Meetings. Sie skaliert durch klare Entscheidungen, wiederverwendbare Artefakte, automatisierbare Checks und gestufte Beteiligung.

| Problem | Skalierbarer Mechanismus | Risiko |
|---|---|---|
| Jede API braucht großen Review | Contract templates/tests und risikobasierte Ausnahmen | echter hoher Risk wird falsch klassifiziert |
| Security wird zu spät eingebunden | threat/data fields im intake, control as code | Checkbox ohne Kontext |
| SRE ist Überlastet | readiness checklist, SLO template, owner registry | Template ersetzt keine Failure Drill |
| Product überstimmt Betrieb | Hard stops und accountable decision record | Machtkonflikt wird nur dokumentiert, nicht gelöst |
| Platform wird Ticketqueue | self-service golden paths und clear non-goals | zu breite Plattformversprechen |
| Finance kommt erst nach Rollout | cost allocation/budget in design gate | Scheinpräzise Kostenwerte |

### Latenz der Entscheidung

Messe nicht nur technische Latenz, sondern auch:

- Zeit bis Problem-/Ownerklarheit;
- Zeit von vollständigem Evidence Pack bis accountable Decision;
- Anteil lokaler Entscheidungen ohne zentralen Review;
- Anzahl und Alter offener Konflikte;
- Anteil spät entdeckter Security-/Operationsanforderungen;
- Onboardingzeit eines Teams in einen sicheren Pfad;
- Zeit bis Incident-/Cost-/Outcomeevidenz eine Entscheidung aktualisiert.

## Reliability und Failure Modes

| Failure Mode | Ursache | Folgen | Behandlung |
|---|---|---|---|
| Sponsor override | Macht ersetzt Evidenz/Control. | unsicherer oder unbetriebsfähiger Rollout. | Mandat/Hard Stop/Decision Record klar, ggf. eskalieren. |
| Consultation theatre | viele Beteiligte, niemand entscheidet. | Verzögerung, Schattenentscheidungen. | Accountable Owner, Decision Deadline, offene Dissensnotiz. |
| Invisible operator | Betrieb wird erst nach Go-live beteiligt. | keine SLO/Runbook/On-call-Ownership. | readiness gate und Betreiber früh integrieren. |
| Security late gate | Controls kommen am Ende. | Rework oder Bypass. | Daten-/Identity-/risk intake und technische Checks früh. |
| Product tunnel | Nutzen ohne Schaden/Degradation. | schlechte Nutzerkommunikation und Harm. | user journey inkl. failure/human escalation. |
| Platform capture | Plattform entscheidet Fachregel. | fehlende Domainownership. | System-of-record authorization und Contractgrenze. |
| Budget blind spot | Cost/commitment/exit fehlt. | unerwartete Kosten/Lock-in. | FinOps/Procurement evidence früh. |
| Stale stakeholder map | Owner/Mandat hat sich geändert. | falsche Freigaben/Eskalation. | owner change trigger und regelmäßige Gateprüfung. |

## Security, Governance und Compliance

Stakeholdermodelle sind besonders wichtig, wenn ein „ja“ technische oder rechtliche Folgen auslöst. Sie müssen zeigen:

- wer Datenklassifikation und Zweck fachlich einordnet;
- wer Identity-, Access-, Key- und Secret-Control prüft;
- wer Modell-/Provider-/Toolgrenzen entscheidet oder empfiehlt;
- welche Person/Instanz ein Security-/Privacy-/Legalrisiko innerhalb ihres Mandats stoppen kann;
- wer den User-/Customer-Impact bei fehlerhaftem Verhalten repräsentiert;
- wer Incident, Audit und Kommunikation betreibt;
- wer die Kosten-/Vertrags-/Exitannahme bestätigt;
- wer die endgültige Risiko-/Investitionsentscheidung akzeptiert.

Ein Escalation Path ist kein Freifahrtschein, Sicherheitsentscheidungen auf Executive-Level zu übergehen. Er macht den Konflikt und das zuständige Mandat sichtbar.

## Observability und Troubleshooting

### Stakeholder-Signale

| Signal | Betroffene | Entscheidung |
|---|---|---|
| Policy denial / access error | Domain, Security, Platform, User | claim/control/domain rule prüfen; nicht durch Prompt umgehen. |
| SLO burn / incident | SRE, Platform, Product, Support | degradation, capacity, rollout, architecture review. |
| Safety/quality drop | Product, Domain, AI risk, User | scope, model/retrieval/evaluation/human gate ändern oder stoppen. |
| Cost anomaly | Finance, Product, Platform, Sponsor | budget, route, scope, capacity, procurement review. |
| Exception age | Platform, Enterprise, Security, Team | migration, renew with evidence, baseline revise or retire. |
| Adoption friction | Team, Platform, Staff/Principal | golden path verbessern, scope split, no forced adoption. |
| Data/owner drift | Data owner, Domain, Privacy | catalog/contract/purpose review and restrict if uncertain. |

### Troubleshooting: „Alle sind beteiligt, aber nichts entscheidet“

1. Schreibe den Entscheidungsgegenstand in einem Satz.
2. Trenne Input, Veto/Hard Stop, Recommendation und Accountable Decision.
3. Benenne fehlende Evidenz und eine Deadline für ihre Beschaffung.
4. Streiche Stakeholder, die nur informiert werden müssen, nicht konsultiert.
5. Vergleiche Optionen gegen gemeinsame Kriterien: Nutzerwert, Risiko, SLO, Cost, Transition, Exit.
6. Dokumentiere Dissens und Grenzen; verlange keinen künstlichen Konsens.
7. Eskaliere unklare Mandate an zuständige Governance/Führung, nicht an die lauteste Person.

## Cost und FinOps

Stakeholdermodelle verhindern Cost-Shifting. Ohne klare Rollen werden Plattformkosten bei einzelnen Teams abgeladen, Product investiert ohne Betreiberbudget, oder Finance senkt Kosten ohne Qualitäts-/Security- und Nutzerfolgen zu sehen.

| Entscheidung | Stakeholderwissen |
|---|---|
| Modellrouting | Product/Domain: quality; Security/Privacy: data; Platform/SRE: latency; Finance: cost; accountable owner: trade-off. |
| Shared Platform | Platform: TCO/SLO; Teams: adoption/friction; Enterprise: capability; Finance: allocation; Executive: investment. |
| Legacy retirement | Enterprise: transition; Domain: process risk; SRE: operation; Finance: run/exit; Security: exposure. |
| Provider contract | Procurement/Legal: terms; Security: risk; Platform: integration; Finance: commitments; Product: value/roadmap. |

FinOps ist am stärksten, wenn Engineering, Finance und Business dieselbe Cost-/Outcome-/Riskfrage betrachten, nicht wenn eine Seite eine reine Reportingpflicht erfüllt.

## Trade-offs und Anti-Patterns

| Trade-off | Schlechte Antwort | Reife Antwort |
|---|---|---|
| Breite Beteiligung / Geschwindigkeit | alle entscheiden alles | risikobasiert informieren, konsultieren, entscheiden und eskalieren |
| Power / Expertise | Executive oder Spezialist entscheidet immer | Mandat, Kontrolle, Evidenz und Accountable Decision trennen |
| Konsens / Klarheit | Entscheidung vertagen bis alle zustimmen | Dissens dokumentieren, Grenzen respektieren, verantwortlichen Entscheider nutzen |
| Transparenz / Sicherheit | alle Daten allen Stakeholdern | minimierte, rollenadäquate Artefakte und Zugriff |
| Standard / Teamfit | zentral erzwingen | sichere Invarianten, Golden Path, klarer Ausnahmeweg |
| Kosten / Qualität | niedrigster Preis | Unit Cost mit Outcome, Safety, SLO, Exit und Betrieb verbinden |

**Anti-Patterns:**

- Stakeholderliste ohne konkrete Entscheidung oder Interesse.
- RACI, die keine Accountable Person oder keine Entscheidung enthält.
- Ein Sponsor wird als Sicherheits-/Datenspezialist behandelt, weil er Budget hat.
- Security, Privacy oder SRE werden nur bei Abschluss eingebunden.
- Ein Architecture Board versucht, Fachprodukte und Betriebsdetails selbst zu besitzen.
- Produktwunsch wird als ausreichend für eine Toolaction betrachtet.
- Ein Konflikt wird durch eine allgemeine „alignment“-Formulierung verschleiert.
- Kosten-/Vertragsfolgen werden als nichttechnisch aus Architektur entfernt.
- Meinungsumfragen ersetzen User-/Betriebs-/Securityevidenz.

## Staff-, Principal- und Chief-Level Decisions

| Ebene | Stakeholderwirkung |
|---|---|
| Staff | macht technische Abhängigkeit, Teamfriction, Owner und Referenzpfad für mehrere Teams sichtbar. |
| Principal | verbindet Programme, Transition, Konfliktentscheidung und Risiko über mehrere Stakeholdergruppen. |
| Chief | klärt Sponsorship, Portfolio, Risikotoleranz, Investition und Operating Model mit formaler Accountability. |
| Solution Architect | verbindet Domain, Product, Nutzer, Integrationen, NFR und fachliche Autorisierung. |
| Platform Architect | verbindet Teams, Plattformproduct, SRE, Security, Cost und Lifecycle. |
| Enterprise Architect | verbindet Business Capabilities, Informationsdomänen, Landscape, Transition und Governance. |

## Production Checklist

### Stakeholder- und Decision Model

- [ ] Entscheidungsobjekt, Scope und mögliche Schadenfolge sind klar.
- [ ] Betroffene, Einfluss, Expertise und Accountable Owner sind getrennt.
- [ ] Sponsor, Domain, Product, Platform/SRE, Security/Privacy, Finance/Procurement und Nutzer-/Supportinteresse wurden auf Relevanz geprüft.
- [ ] RACI enthält Decision Contract, Evidence, Hard Stops, Revisit und Eskalation.
- [ ] Unklare Mandate sind als Governanceproblem und nicht als Technikdiskussion dokumentiert.
- [ ] Konflikte haben Optionen, Kriterien, Dissens, Owner und Entscheidung.

### Architektur, Betrieb und Risiko

- [ ] Stakeholder-Concerns sind mit Context, Runtime, Contract, NFR, Runbook und Roadmap verbunden.
- [ ] Domain Authorization, Datenklasse, Zweck, Toolscope und Audit haben klaren Owner.
- [ ] SLO, Degradation, On-call, Support und Incidentkommunikation sind vor Rollout eingebracht.
- [ ] Plattform-/Solution-/Enterprise-Boundary verhindert doppelte Ownership.
- [ ] Cost Allocation, Budget und Exit sind bei relevanten Entscheidungen beteiligt.
- [ ] Feedback aus User, Betrieb, Security, Quality und Cost kann Entscheidung revidieren.

### Evidenz und Ethik

- [ ] Artefakte enthalten keine unnötigen persönlichen oder sensitiven Daten.
- [ ] Stakeholderdaten werden nicht zur individuellen Leistungsbewertung missbraucht.
- [ ] Fachliche Review-/Freigabe wird nicht durch Architekturtext behauptet.
- [ ] Eigene belegte Evidenz, Konzept, Lab und Zielrolle sind getrennt.
- [ ] Unabhängige Security-, Privacy-, Operations-, Architecture- und ggf. Legalreviews sind für reale Produktion vorgesehen.
- [ ] Ausnahme-/Eskalationswege sind nachvollziehbar und zeitgebunden.

## Interviewfragen mit Modellantworten

### 1. Wer ist bei einer Architekturentscheidung Stakeholder?

**Modellantwort:** Jede Person/Funktion mit relevanter Betroffenheit, Einfluss, Expertise oder formaler Verantwortung. Ich beginne beim Entscheidungsobjekt: Nutzer/Domain, Product/Sponsor, Delivery, Platform/SRE, Security/Privacy/Data, Finance/Procurement und ggf. externe Partner. Ich unterscheide diese Rollen, statt nur Manager aufzuzählen.

### 2. Wie gehen Sie mit einem Konflikt zwischen Product und Security um?

**Modellantwort:** Ich trenne Positionen von Interessen und kläre Mandate. Product beschreibt Nutzerwert und Scope; Security beschreibt Control-/Risikogrenze. Dann formuliere ich Optionen, etwa Read-only, Human Gate, begrenzte Aktion oder Stop, und bewerte Wert, Risiko, SLO, Cost und Transition. Ein zuständiger Owner entscheidet innerhalb des Mandats; ein Sicherheitsveto wird nicht durch Zeitdruck umgangen.

### 3. Warum reicht RACI nicht?

**Modellantwort:** RACI beschreibt Rollen grob, nicht Entscheidungsobjekt, Evidenz, harte Grenzen, Optionen, Dissens oder Revisit. Ich ergänze einen Decision Contract, damit klar ist, was wirklich entschieden wird und wann neue Fakten die Entscheidung ändern müssen.

### 4. Wie vermeiden Sie Stakeholder-Overhead?

**Modellantwort:** Risikobasiert. Kleine reversible Änderungen brauchen wenige Personen und klare Templates. Bei Daten, Sicherheit, hoher Betriebs- oder Investitionsfolge erweitere ich die Beteiligung. Nicht jeder muss konsultiert werden; aber relevante Control Owner und Betreiber dürfen nicht erst nach der Entscheidung auftauchen.

### 5. Welche Rolle spielt FinOps?

**Modellantwort:** FinOps verbindet Engineering, Finance und Business. Für eine AI- oder Plattformentscheidung liefert es Unit Cost, Budget, Allocation, Commitment und Exit, aber immer gemeinsam mit Quality, Safety, SLO und Outcome. Es verhindert, dass Kosten nur verschoben oder ohne Nutzenkontext gekürzt werden.

### 6. Wie sprechen Sie über diese Kompetenz auf Basis Ihrer bisherigen Praxis?

**Modellantwort:** Eigene belegte Fälle, etwa [Projekt/Lernfall] mit Zeitraum und Evidenzart, liefern Anschauung für technische Concerns und Decision Artefacts. Sie belegen keine realen Stakeholdermandate, Sponsor-/Governancearbeit oder Produktivwirkung. Deshalb formuliere ich sie als begrenzte Evidenz und nutze überprüfbare Fallarbeit als Lernziel.

## Praktisches Lab: Stakeholder- und Conflict-Decision-Pack

### Ziel und Evidenzgrenze

**Status: reviewed_only.** Erstelle eine dokumentierte Fallarbeit für eine fiktive interne Knowledge Assistance. Keine realen Personen, Kundendaten, Verträge, Budgets oder Freigaben verwenden.

### Artefakte

```text
stakeholder-lab/
  decision-object.md
  stakeholder-map.yaml
  concern-and-power-matrix.md
  decision-contract.yaml
  conflict-register.md
  runtime-and-control-flow.md
  rollout-gate.md
  communications-plan.md
  evidence-and-revisit.md
```

### Schritte

1. Formuliere einen konkreten Workflow, Wert, Nichtziel, Datenklasse, Seiteneffekt und Risiko.
2. Identifiziere Sponsor, Product, Domain, User/Support, Solution, Platform/SRE, Security/Privacy, Data, Finance und Procurement. Markiere unbekannte Rollen.
3. Lege pro Stakeholder Concern, Einfluss, Fachmandat, Entscheidung, Evidenz, Kommunikationsbedarf und Risiko bei Nichtbeteiligung fest.
4. Erstelle RACI plus Decision Contract für Modellroute, Toolaction, Datenquelle, SLO, Budgetlimit und Incident.
5. Schreibe ein Conflict Register für Product-Geschwindigkeit versus Security, Platform reuse versus Domain fit und Finance limit versus Quality.
6. Zeichne Runtime/Control Flow; zeige explizit, dass Domain Authorization nicht durch Plattformpolicy oder Prompt ersetzt wird.
7. Definiere Decision Gate mit SLO, Citation/Quality, Policy/Audit, Cost, Adoption und Supportsignalen.
8. Simuliere einen Incident und eine Kostenanomalie. Aktualisiere die Stakeholderkarte oder den Decision Contract, wenn Owner/Eskalation unklar wird.
9. Führe eine Reviewrunde als fünf fiktive Rollen aus und dokumentiere Dissens, Missing Evidence und Entscheidung.
10. Entferne alle Mocks und markiere das Paket als synthetisch.

### Negative Gegenproben

| Probe | Erwartung |
|---|---|
| Sponsor will Toolaction ohne Domain-/Securityevidenz. | Decision Contract setzt Hard Stop oder begrenzten read-only Pfad. |
| Security hat nur „block“ ohne technisches Risiko/Control. | Conflict Register verlangt konkrete Concern/Evidence und Accountable Escalation. |
| SRE wird nach Pilotstart kontaktiert. | Readiness Gate blockiert Expansion ohne SLO/Runbook/Owner. |
| Productmetrik ist gut, Policy/Audit aber offen. | Rollout bleibt begrenzt/stoppt. |
| Finance sieht nur Gesamtkosten. | FinOps Artefakt verlangt Workflow-/Capability-/Platform-Slice. |
| Plattform übernimmt Rabatt-/Stornoentscheidung. | Runtime Review trennt Domain Authorization und Platform Policy. |
| Stakeholderkarte hat keine Revisit-Triggers. | Incident/Ownerchange zeigt sie als veraltet und unzuverlässig. |
| Konsens fehlt, aber Entscheidung muss erfolgen. | Dissens, Risiko, Mandat und accountable owner werden dokumentiert. |

### Cleanup

Lösche synthetische Daten, Logs, Tokens, Mocks und temporäre Dateien. Behalte nur klar als `reviewed_only` markierte Artefakte. Das Lab behauptet keine reale Einbindung, Freigabe, Führung oder Wirkung.

## Dependencies und Cross-References

- [KB-0002 – Rollen- und Kompetenzmodell](../00-navigation-governance/02-rollen-kompetenzmodell-und-tiefenstufen.md)
- [KB-0004 – Selbsteinschätzung und Evidenzgrenzen](../00-navigation-governance/04-cv-istbild-und-zielkompetenzen.md)
- [KB-0005 – Kompetenzcanvas und Wirkungskette](../00-navigation-governance/05-kompetenzcanvas-und-wirkungskette.md)
- [KB-0006 – Hands-on-, Architect-, Staff- und Chief-Arbeitsmodell](../00-navigation-governance/06-hands-on-architect-staff-chief-arbeitsmodell.md)
- [KB-0009 – Labstrategie, Evidenz und Gegenproben](../00-navigation-governance/09-labstrategie-evidenz-und-gegenproben.md)
- [KB-0027 – Architekturartefakte nach Rollenbedarf](17-architekturartefakte-nach-rollenbedarf.md)
- KB-0550 – Platform Engineering und Developer Platform
- KB-0565 – Cloud Architecture und Landing Zones
- KB-0612 – Governance, Compliance, Privacy und AI Safety
- KB-0720 – Integrierende Staff-/Principal-/Chief-Architekturpraxis

## Quellen und Aktualitätsnotizen

| Quelle | Verwendung | Stand |
|---|---|---|
| Dateikatalog 720 | Scope: Sponsor, Betrieb, Security und Produktverantwortliche; Einfluss, Verantwortung und Betroffenheit. | Planstand 2026-09-14 |
| [ISO/IEC/IEEE 42010:2022](https://www.iso.org/standard/74393.html) | Stakeholder und Concerns als Basis für Views. | Abgerufen 2026-09-15 |
| [NIST AI RMF 1.0](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf) | Risikomanagement für AI-Systeme. | Abgerufen 2026-09-15 |
| [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/) | Betriebs-/Nutzerperspektive und Releaseentscheidungen. | Abgerufen 2026-09-15 |
| [FinOps Framework](https://www.finops.org/framework/) | Zusammenarbeit von Engineering, Finance und Business. | Abgerufen 2026-09-15 |
| [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/) | Datensparsame gemeinsame Telemetrie. | Abgerufen 2026-09-15 |
| [Backstage Software Catalog](https://backstage.io/docs/features/software-catalog/) | Auffindbarkeit von Ownership und Lifecycle. | Abgerufen 2026-09-15 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — AI-gestützte Stakeholderanalyse kann Discovery beschleunigen, darf Mandate nicht erfinden.** Tools können Concerns, offene Fragen und Abhängigkeitsentwürfe aus vorhandenen Artefakten extrahieren. **Reifegrad: Emerging bis Adopting.** Der Nutzen liegt in besserer Vorbereitung und nachvollziehbaren Lücken. Risiken sind falsche Owner, übernommene Vorurteile, sensitive Daten und der Anschein einer Zustimmung. Ein Pilot nutzt ausschließlich freigegebene Metadaten, verlangt menschliche Owner-Bestätigung und führt keine automatische Freigabe aus.

**Stand 2026-09-15 — Developer Portals können Stakeholderübergaben als Produktfluss sichtbar machen.** Kataloge, Templates, Scores, Reviews und Runbooks helfen Teams, Owner und sichere Pfade vor dem Incident zu finden. **Reifegrad: Adopting.** Risiken sind veraltete Metadaten und Portale als Kontrollmonolith. Ein Pilot zeigt Owner, Lifecycle, Support, Contract und eskalierbare Ausnahme für eine kleine Capability und misst Time-to-find-owner sowie Onboardingfriction. Quelle: [Backstage Software Catalog](https://backstage.io/docs/features/software-catalog/).

**Stand 2026-09-15 — FinOps und SRE-Signale ermöglichen stärker evidenzbasierte Konfliktentscheidungen.** Cost per qualified outcome, SLO Burn, Supportlast und Policy Denies können Product-, Platform- und Finance-Interessen mit einer gemeinsamen Faktenbasis verbinden. **Reifegrad: Adopting.** Sie ersetzen keine Risiko-/Rechtsentscheidung und dürfen nicht für Individualranking genutzt werden. Ein Pilot definiert Entscheidungsschwelle, Owner, Datenminimierung und Revisit pro Signal. Quellen: [FinOps Framework](https://www.finops.org/framework/), [Google SRE SLOs](https://sre.google/sre-book/service-level-objectives/).

