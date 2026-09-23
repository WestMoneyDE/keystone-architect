---
{"id": "KB-0030", "title": "Roadmap für den Rollenübergang", "domain": "01", "sequence": 20, "document_type": "role", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0002", "concepts": ["Rollen-Kompetenz-Matrix", "Tiefenstufen", "Nachweisarten"], "needed_for": "understanding"}, {"id": "KB-0004", "concepts": ["Evidenzgrenzen", "zulässige Aussagen", "Zielkompetenzen"], "needed_for": "understanding"}, {"id": "KB-0005", "concepts": ["Kompetenzcanvas", "Entscheidungsreichweite", "Wirkungskette"], "needed_for": "understanding"}, {"id": "KB-0006", "concepts": ["Hands-on-Tiefe", "Architekturnachweis", "Spezialistenübergabe"], "needed_for": "understanding"}, {"id": "KB-0009", "concepts": ["Labstrategie", "Evidenz und Gegenproben", "Aussagegrenzen"], "needed_for": "lab"}], "related": ["KB-0011", "KB-0013", "KB-0014", "KB-0015", "KB-0016", "KB-0017", "KB-0020", "KB-0021", "KB-0022", "KB-0023", "KB-0025", "KB-0027", "KB-0028", "KB-0029", "KB-0031", "KB-0221", "KB-0550", "KB-0565", "KB-0612", "KB-0720"], "applies": ["KB-0221", "KB-0550", "KB-0565", "KB-0612", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Priorisierte Labs erzeugen ausführbare Contracts, Tests, Runbooks, Telemetrie, Cost-/Risk-Entscheidungen und klar begrenzte Evidenz.", "rationale": "Hands-on-Tiefe wird über überprüfbare Artefakte und Gegenproben aufgebaut."}, "ARCHITECT-TARGET": {"active": true, "scope": "Die Roadmap baut Ziel-/Übergangsarchitektur, Stakeholder-/Decision-Model, Standards, Contracts, SLO/Cost/Threat-Evidenz und Migrationsdenken schrittweise auf.", "rationale": "Architekturtiefe entsteht aus der Wiederholung von Entscheidungen mit klarer Wirkungskette."}, "STAFF-TARGET": {"active": true, "scope": "Lernartefakte werden von Einzelprototypen zu Referenzpfaden, Templates, Communities und mehrteamigen Fallarbeiten erweitert.", "rationale": "Staff-Wirkung verlangt nutzbare technische Multiplikatoren, nicht nur individuelles Lernen."}, "CHIEF-TARGET": {"active": true, "scope": "Spätere Wellen verbinden Capability Maps, Portfolio, Transition, Risk/FinOps, Decision Rights und Investitionsoptionen mit Executive-tauglicher Evidenz.", "rationale": "Chief-Kompetenz ist ein Lernziel mit Mandatserfordernis, keine Schlussfolgerung aus einem Portfolio."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Coding, Security, Privacy, Data, GPU, Network, SRE, FinOps, Legal, Procurement und People Leadership werden nach Zielrolle vertieft oder über Fachreview eingebunden.", "rationale": "Die Roadmap erklärt gezielte Tiefenbildung und Übergabe, nicht universelle Alleinexpertise."}}, "lab_validation": [{"lab_id": "KB-0030-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Nicht produktive Roadmap-Fallarbeit mit synthetischen Portfolio-, Lab-, Review- und Evidenzartefakten", "evidence": "Die Roadmap definiert Ausgangsevidenz, Kompetenzlücken, Lernwellen, Exit-/Stopregeln, Artefakte, Messsignale, Gegenproben und Reviewgrenzen.", "limitations": "Keine reale Beförderung, Bewerbungserfolg, Produktivsystem, Teamwirkung, Budget, externe Prüfung oder Zielrollenzusage wurde behauptet oder verändert."}]}
---
# Roadmap für den Rollenübergang

> **Ziel:** Diese Roadmap übersetzt die vorhandene eigene Evidenz eines Lernenden in priorisierte technische Lernschritte und Portfolioartefakte. Sie misst Fortschritt an beobachtbaren Ergebnissen, nicht an konsumierten Kursen, Zertifikaten oder dem Anspruch auf einen Zielrollentitel.

## Purpose, Definition und Scope

Der Übergang zu GenAI Solution Architect/Engineer, Platform/Enterprise Architect und Cloud Architect erfordert gleichzeitig Tiefe und Breite. MLOps/LLMOps ist dabei eine unterstützende Spezialisierung, die Modell-, Daten-, Evaluation-, Deployment-, Betriebs- und Governancefragen verbindet. Staff-, Principal- und Chief-Orientierung beschreibt die wachsende Entscheidungsreichweite, nicht eine Abkürzung über formale Erfahrung.

Die Roadmap beantwortet vier Fragen:

1. Welche eigene belegte Evidenz ist bereits als begrenzter technischer Kontext vorhanden?
2. Welche Kompetenz muss hands-on, architektonisch, staff-nah, chief-nah oder mit Spezialisten vertieft werden?
3. Welches Artefakt oder Lab kann einen Lernfortschritt glaubwürdig zeigen?
4. Welche reale Erfahrung, unabhängige Prüfung oder formale Verantwortung bleibt weiterhin offen?

Die Roadmap ist keine Zusage, dass ein bestimmter Zeitraum oder eine Liste von Dateien eine Rolle garantiert. Sie priorisiert nach Wert, Abhängigkeiten, Risiko, Wiederverwendbarkeit und Lücke zur Zielrolle. Ein Thema wird erst als belastbar behandelt, wenn es geeignete Evidenz hat: ausführbarer Test, technisches Artefakt, unabhängige Review, reale verantwortete Delivery oder dokumentierte Outcome-Messung – jeweils mit klarer Scopegrenze.

## Kompetenzstatus und Ausgangslage

### Begrenzte Ausgangsevidenz (Raster für Lernende)

Vor Beginn trägt der Lernende die eigene belegte Praxis in ein Raster ein. Die folgenden Zeilen sind typische Evidenzarten, keine konkreten Projekte:

| Evidenzart | Technischer Startpunkt (Beispiel) | Typischerweise nicht belegt |
|---|---|---|
| Eigenes Konzept / Architekturentwurf | z. B. [Projekt] mit RAG, Prozessruntime, Berechtigungen, Human-in-the-Loop. | Produktion, Team-/Unternehmensskala, externe Freigabe, SLO/Outcome. |
| Eigener Entwicklungs-/Review-Workflow | z. B. Plan-Build-Verify-Review, Tests, Human Gates. | Produktionsorganisation, formale Führung, unabhängige Architekturabnahme. |
| Umgesetzte Integration | z. B. [Projekt] mit Produktdaten, Webhooks, ERP-/Warenwirtschaftsanbindung. | nicht genannte Systeme, globale Konsistenz, Teamleitung, Produktions-SLO. |
| Runtime-/Plattformkonzept | z. B. Modellrouting, Container, GPU-Planung, Tracing, Evaluation. | produktive Cluster-/GPU-Operation, SLA, Kapazitäts-/Budgetverantwortung. |
| Prozessdigitalisierung / Lab | z. B. eigene Werkzeuge mit GenAI in [Zeitraum]. | formale Enterprise Architecture, Governance, Organisationsführung. |

### Zielprofil (Beispiel)

```text
Priority 1: GenAI Solution Architect / GenAI Engineer
Priority 2: Platform / Enterprise Architect
Priority 3: Cloud Architect
Supporting specialization: MLOps / LLMOps
Progression: hands-on depth -> architecture evidence -> cross-team practice
             -> portfolio/decision readiness -> real scoped responsibility
```

## Mental Model: Kompetenz als Evidenzleiter

Lernen ist keine gerade Linie von „Anfänger“ zu „Chief“. Für jede Fähigkeit steigt die Evidenzleiter:

```text
read / explain
      ->
bounded lab with positive and negative tests
      ->
repeatable reference path and documented trade-offs
      ->
review by qualified independent person / real team adoption
      ->
real scoped responsibility with measured outcome
      ->
portfolio/organization responsibility with formal mandate
```

Ein Lab kann die zweite oder dritte Stufe belegen. Es kann nicht die fünfte oder sechste simulieren. Diese Trennung schützt Glaubwürdigkeit und zeigt gleichzeitig, was der nächste sinnvolle Schritt ist.

## Prerequisites und Dependencies

| Grundlage | Nutzen für die Roadmap |
|---|---|
| KB-0002 Rollen- und Kompetenzmodell | Zielrollen auf Tiefe, Scope und Nachweis herunterbrechen. |
| KB-0004 Selbsteinschätzung und Evidenzgrenzen | Startpunkt sauber von Behauptung trennen. |
| KB-0005 Kompetenzcanvas | Jede Lerninitiative mit Problem, Entscheidung, Evidenz, Outcome und Grenze modellieren. |
| KB-0006 Hands-on bis Chief | Übergang von Implementierung zu Architektur und Wirkung strukturieren. |
| KB-0009 Labstrategie | Labs mit Gegenproben, Cleanup und Aussagegrenze erstellen. |
| KB-0011–KB-0029 | Zielrollen, Artefakte, Stakeholder und Interviewevidenz als Domain-01-Fundament verwenden. |

## Core Concepts

### 1. Priorisierung: Wert × Lücke × Wiederverwendbarkeit × Risiko

Bewerte eine Lerninitiative nicht nur nach Interesse. Eine einfache qualitative Formel:

```text
priority =
  target-role relevance
  × current evidence gap
  × reuse across roles
  × risk of getting it wrong
  ÷ estimated learning/operational cost
```

**Beispiel:** Ein tenant-sicherer, observierbarer Read-only-RAG-Referenzpfad hat hohe Relevanz für GenAI, Platform, Enterprise, Cloud, MLOps/LLMOps, Security und Interviewevidenz. Ein spezielles GPU-Kernel-Tuning kann wertvoll sein, ist aber für die priorisierte Zielrolle oft `SPECIALIST-OPTIONAL`, sofern kein konkreter Arbeitgeber es verlangt.

### 2. Ein Portfolioartefakt ist keine Dekoration

Ein Artefakt ist nur dann ein Lernnachweis, wenn es eine Behauptung prüft:

| Behauptung | Artefakt | Gegenprobe |
|---|---|---|
| „Ich kann sichere AI-Grenzen entwerfen.“ | Context/runtime/control flow, policy contract, threat model. | Cross-tenant, invalid purpose, prompt-injection/toolaction test. |
| „Ich kann Plattformfähigkeit strukturieren.“ | golden path, template, SLO, catalog owner, exception/lifecycle. | Onboarding ohne Spezialhilfe, stale owner, bypass/failure test. |
| „Ich kann Integrationen gestalten.“ | OpenAPI/AsyncAPI contract, idempotency, version/migration plan. | breaking consumer, duplicate event, timeout/retry test. |
| „Ich kann Cloud-Risiko/-Kosten entscheiden.“ | landing-zone/identity/network/cost option record. | provider outage, egress/cost anomaly, policy deny scenario. |
| „Ich kann Architekturwirkung kommunizieren.“ | ADR, roadmap, stakeholder/decision model, evidence register. | alternative rejected, missing owner, conflicting concern review. |

### 3. Lernwellen

| Welle | Zweck | Fokus |
|---|---|---|
| **Welle 0: Faktenbasis** | Eigene Ausgangsevidenz, Zielrolle, Sicherheits- und Aussagegrenzen stabilisieren. | Evidenzregister, Kompetenzcanvas, Artikelvertrag. |
| **Welle 1: sicherer Referenzpfad** | End-to-End technische Tiefe für Priorität 1. | RAG/AI access, Contract, eval, tool boundary, telemetry, SLO/cost, lab. |
| **Welle 2: Plattform- und Integrationstiefe** | Wiederverwendung und Enterprisegrenzen. | API/event, identity, catalog, golden path, CI/CD, data/contract lifecycle. |
| **Welle 3: Cloud- und Betriebstiefe** | Architektur unter Last, Ausfall, Kosten, Security. | landing zone, network, IAM, reliability, FinOps, capacity/DR. |
| **Welle 4: mehrteamige Wirkung** | Staff-/Principal-nahe Praxisfälle. | standards, transition, stakeholders, adoption, exception, decision gates. |
| **Welle 5: Portfolio und Mandat** | Chief-nahe Vorbereitung und reale Scopeerweiterung. | capability portfolio, investment, risk, operating model, real responsibility. |

Wellen können überlappen. Welle 5 darf nicht begonnen werden, indem reale Portfoliohoheit behauptet wird; sie beginnt mit verantwortungsvoller Vorbereitung und klaren Mandatsfragen.

### 4. Ziele als Outcomes, nicht als Technologielisten

Schwache Roadmap: „Kubernetes lernen, AWS lernen, RAG lernen, Terraform lernen.“

Reife Roadmap: „Ein dokumentierter Read-only-AI-Referenzpfad beantwortet eine klar abgegrenzte interne Wissensfrage mit zitierbaren Quellen, Tenant-/Purpose-Grenze, Policy, Evaluation, SLO, Cost Limit, Degradation, Contract-Tests und unabhängiger Reviewplanung.“

Technologien ergeben sich aus der Fähigkeit. Sie werden zeitnah validiert, weil Version, Preis, Sicherheitsstatus und Markt nicht stabil sind.

## Architecture und Data Flow: Der Roadmap-Referenzpfad

### Capability Map

```text
Trustworthy GenAI Solution Capability
├── user / tenant / purpose identity
├── source classification and retrieval
├── model routing and evaluation
├── safe tool / human gate boundary
├── API/event contracts and integration
├── deployment, observability, SLO and incident response
├── cost allocation, limits and capacity
├── platform self-service and lifecycle
└── architecture, stakeholder and portfolio decision evidence
```

### Aufbau in Wellen

```text
current evidence context
    |
    v
W1 AI reference path
    |--> contract, security, eval, observability, cost
    v
W2 platform/integration capability
    |--> reusable template, contract lifecycle, catalog, CI
    v
W3 cloud/operations capability
    |--> identity/network, resilience, FinOps, capacity
    v
W4 staff/principal scenario
    |--> adoption, transition, conflict, standard, outcome
    v
W5 chief/portfolio scenario + real scoped responsibility
```

### Daten- und Evidenzfluss

```text
lab/change -> artifact -> test/review signal -> evidence register
          -> learning decision -> roadmap update
          -> next wave or stop/split/revise
```

Die Roadmap ist ein System: Ein Testfehler kann Scope verringern, ein Incidentmuster kann eine Plattformfähigkeit priorisieren, ein Employer-Interview kann eine Codinglücke sichtbar machen. Fortschritt ist nicht das automatische Abarbeiten einer Reihenfolge.

## Protokolle, Standards und Technologien

| Lernbereich | Warum in der Roadmap | Nachweisform |
|---|---|---|
| OpenAPI/AsyncAPI | Integration und Change-Tiefe über Rollen hinweg. | versionierter Contract, compatibility/negative test. |
| OAuth/OIDC, Workload Identity | sichere Delegation und Domain-/Platform-Grenze. | trust/claim flow, denied access test. |
| OpenTelemetry | Debugging und Evidence über AI/Platform/Cloud. | trace/metric/log schema, data minimization review. |
| NIST AI RMF / AI controls | Use-case-, capability- und runtimeorientiertes Risiko. | threat/control/evaluation/owner record. |
| Kubernetes/IaC/GitOps | Plattform-/Cloud-/Deliverytiefe. | begrenztes Deployment/Policy/rollback lab, niemals unbewiesene Produktion. |
| SLO/Runbooks/Failure drills | Betriebsfähigkeit. | workload SLO, degradation, incident scenario. |
| FinOps/unit economics | Cost als Architekturvariable. | cost model, budget/anomaly/decision. |
| Service Catalog/Golden Path | Platform product, Ownership und Lifecycle. | template, owner, exception, adoption feedback. |

## Konfiguration und Implementierung: Persönliches Evidence Operating Model

### 1. Initiative Card

```yaml
initiative:
  id: "W1-AI-ACCESS-01"
  target_roles: ["GENAI", "PLATFORM", "MLOPS"]
  capability: "governed read-only AI assistance"
  current_evidence: ["[own concept]", "[own review workflow]"]
  gap: "no production / no independent review / no multi-team adoption"
  deliverables:
    - "context + runtime + threat view"
    - "request/response contract"
    - "positive/negative tests"
    - "SLO/cost/degradation/runbook"
  success_signal:
    - "testable tenant/purpose and policy boundaries"
    - "source/citation quality threshold defined"
  stop_or_split:
    - "missing authoritative source/owner"
    - "unsafe tool/data scope"
  evidence_limit: "reviewed_only unless independently assessed"
```

### 2. Weekly/Monthly Cadence

| Rhythmus | Aktivität | Output |
|---|---|---|
| Wöchentlich | eine kleine technische Hypothese implementieren/prüfen | commit, test, learning note, updated gap |
| Zweiwöchentlich | Architektur-/Security-/Cost-/Failure Review | ADR/update trigger/negative result |
| Monatlich | Roadmap-Review gegen Zielrollen und externe Anforderungen | repriorisierte Initiative Cards |
| Quartalsweise | Portfolio-/Evidence Review | capability maturity, retire/continue, independent-review plan |
| Bei Ereignis | Incident, Interview, neue Technologie, Policy-/Scopechange | entscheidungsbezogene Anpassung statt Kalenderwartezeit |

### 3. Evidence Maturity Map

| Reife | Beispiel | Zulässige Aussage |
|---|---|---|
| E0 – erwähnt | Tool steht im Profil/Plan. | „Berührt/identifiziert.“ |
| E1 – verstanden | Begriffe/Trade-offs korrekt erklären. | „Konzeptionell verstanden.“ |
| E2 – Lab | Positive und negative Probe dokumentiert. | „In begrenzter Fallarbeit geübt.“ |
| E3 – Referenzpfad | Wiederverwendbares Artefakt, Contract, Runbook, Review. | „Als Referenzpfad ausgearbeitet.“ |
| E4 – unabhängige Prüfung / reale Adoption | Qualified review oder echte teambezogene Nutzung. | Nur mit konkreter Evidenz behaupten. |
| E5 – verantwortete Produktion | formales Scope, Betrieb, Outcome, Incident-/Costevidenz. | Nur mit realem Mandat und Resultat behaupten. |

## Scalability und Performance

Eine Lernroadmap muss Kapazität schützen. Parallel hundert Labs zu starten erzeugt kaum Tiefe. Nutze WIP Limits:

- maximal eine große Capability-Initiative und zwei kleine Vertiefungen gleichzeitig;
- jede Initiative beendet erst Contract, Test, Failure/Cost/Security-Review und Learnings;
- eine neue Tool-/Providerstudie ersetzt oder verschiebt bewusst eine andere;
- Wiederverwendung geht vor neuem Showcase;
- kontinuierlich `retire`: veraltete Entwürfe, tote Flags, ungenutzte Prototypen und falsche Annahmen.

### Kapazitätsmodell

```text
effective learning capacity =
available focused time
- maintenance of active artifacts
- review and reflection
- production/work obligations
- context switching
```

Der Plan wird angepasst, wenn reale Arbeit, Gesundheit, Interviewchancen oder neue Prioritäten die Kapazität ändern. Geschwindigkeit ist kein Qualitätsindikator; vollständige Fehleranalyse, Cleanup und ehrliche Evidenz sind Teil der Leistung.

## Reliability und Failure Modes

| Failure Mode | Zeichen | Korrektur |
|---|---|---|
| Certificate treadmill | viele Kurse, keine technische Evidenz. | Outcome-/Artifact-/testgebundene Initiative. |
| Portfolio theatre | schöne Docs ohne Source/Test/Limit. | Evidence Register, negative probe, reviewer plan. |
| Tool collecting | neue Frameworks ohne Capability/Problem. | Initiative Card mit Wert, Constraint, stop/split. |
| Premature chief claim | Strategie ohne realen Scope/Mandat. | Chief als Lernziel/Portfoliofall markieren; reale Verantwortung offen lassen. |
| Lab sprawl | viele aktive Repos ohne Cleanup. | WIP limit, lifecycle, retire plan. |
| Missing operation | Design ohne SLO/Failure/Cost/Runbook. | Betriebs- und Economics Gate vor Abschluss. |
| Story drift | Story wird mit jedem Interview größer. | Fakten/Limit in Story Card, evidenzbasierter Review. |
| No external challenge | Selbstreview bestätigt alles. | unabhängige Reviews, Pairing, community/real scoped work planen. |
| Stale roadmap | Ziele/Markt/Stellen ändern sich. | event-driven reprioritization. |

### Degradation der Roadmap

Wenn ein Lab blockiert ist, nicht Sicherheits- oder Qualitätsgrenzen senken. Stattdessen:

- Scope reduzieren: Read-only statt Toolaction, synthetisch statt sensibel.
- Capability entkoppeln: Contract/Evaluation zuerst, Cloud-/Providerbetrieb später.
- Alternative prüfen: lokaler Mock statt externer Account.
- Stoppen: Wenn kein verantwortbarer Nachweis möglich ist, die Annahme dokumentieren und wechseln.
- Eskalieren: Reale Arbeits-/Mentoring-/Reviewchance suchen, statt Produktion zu simulieren.

## Security, Governance und Compliance

Die Roadmap darf keine Übungsumgebung zum Risiko machen. Regeln:

- keine Kunden-, Mitarbeiter- oder vertraulichen Daten in offene Labs oder Modelle;
- keine Secrets, Tokens, Providerzugänge oder Produktionsendpunkte in Repositories;
- keine nicht autorisierten Cloud-/GPU-/SaaS-Kosten oder Drittanbieterzugriffe;
- synthetische Daten, read-only Scope, Limits und Cleanup als Default;
- alle AI Toolactions zunächst simuliert oder schreibgeschützt;
- Policy, Datenschutz, Lizenz, Security und Nutzungsbedingungen für reale Umgebungen vorab prüfen;
- Profil/Portfolio trennen zwischen „konzipiert“, „Lab“, „reviewed-only“, „unabhängig geprüft“ und „produktiv verantwortet“.

Governance wird später Teil echter Rolle. In der Roadmap wird sie zunächst durch explizite Entscheider-, Evidence- und Eskalationsmodelle geübt, nicht durch nachgestellte Freigaben.

## Observability und Troubleshooting

### Roadmap Dashboard

| Signal | Frage | Aktion |
|---|---|---|
| aktive Initiativen | Ist WIP zu hoch? | stoppen, priorisieren, scope verringern. |
| negative Tests | Welche Annahme wurde widerlegt? | architecture/contract/roadmap ändern. |
| artifact age | Welche Quellen/Entwürfe sind veraltet? | review, refresh oder retire. |
| evidence maturity | Wo ist nur E0/E1 statt E2/E3? | gezieltes Lab/Review statt neuer Theorie. |
| target-role gap | Welche Anforderung fehlt in Jobbeschreibungen? | Welle/Vertiefung anpassen. |
| cost/time burn | Ist Lerninvestition noch vertretbar? | weniger Tooling, limit, stop/split. |
| independent review | Welche Claims sind nur selbstgeprüft? | externe Review-/Pairing-/reale Workchance priorisieren. |
| interview feedback | Welche Frage/Kommunikation war schwach? | Story/design/coding practice aktualisieren. |

### Troubleshooting: „Ich habe viel gelernt, aber keine glaubwürdige Story“

1. Wähle eine einzige Capability statt mehrere Tools.
2. Beschreibe Ausgangslage und eigenen konkreten Beitrag.
3. Zeige Contract/Diagramm/Test/Runbook/Decision und eine negative Probe.
4. Benenne Ergebnis nur als gemessen, wenn es wirklich gemessen ist.
5. Nenne Limit und nächstes Evidence Gate.
6. Wiederhole mit einer unabhängigen Review oder einem real begrenzten Arbeitskontext.
7. Streiche Storyteile, die keine Quelle oder eigene Handlung haben.

## Cost und FinOps

Lernkosten sind real: Zeit, Hardware, Cloud, API, Software, Opportunity Cost und Support. Sie benötigen kleine Budgets und Entscheidungskriterien.

```text
learning cost per verified capability =
time + tooling + compute/API + review + maintenance
-----------------------------------------------
usable artifacts + tested decisions + transferable skill
```

Kostenregeln:

- vor jedem Provider-/Cloudlab Budget, Quota, Deadline und Cleanup setzen;
- lokale/synthetische Option vor externer Nutzung prüfen;
- teure Modelle nur für Fragen nutzen, die Qualität oder Vergleich rechtfertigen;
- FinOps nicht nur als Cloudrechnung üben: Cost Attribution, Outcome, Limits, Anomalie und Exit dokumentieren;
- keine Zertifikats-/Toolausgabe ohne Bezug zu einer Initiative Card;
- reale Infrastrukturkosten niemals mit privaten und Unternehmensmitteln vermischen.

## Trade-offs und Anti-Patterns

| Trade-off | Unreifer Pfad | Reifer Pfad |
|---|---|---|
| Breite / Tiefe | jede Woche neues Tool | wenige Capabilities bis Contract/Test/Runbook/Review abschließen |
| Theorie / Praxis | lesen ohne Artefakt | Lab mit positiver/negativer Probe und Limit |
| Showcase / Wahrheit | beeindruckende Titelclaims | klare Evidence Maturity und offene Lücken |
| Geschwindigkeit / Betrieb | Demo vor Failure/Cost/Security | sichere Scopebegrenzung und Operations Gate |
| Individual / Teamwirkung | eigenes Repo als Staff-Nachweis | Referenzpfad, Review, Adoption oder reale Zusammenarbeit |
| Zielrolle / Mandat | Chief-Strategie behaupten | Portfoliofall üben und formale Verantwortung abwarten |
| Investition / Exit | jede Toolwahl dauerhaft | kostengrenzter Pilot, Exit und Retire |

## Staff-, Principal- und Chief-Level Decisions

| Stufe | Roadmapfokus | Nachweisgrenze |
|---|---|---|
| Hands-on | implementieren, debuggen, testen, instrumentieren. | Lab/repository, kein Produktionserfolg. |
| Architect | Entscheidung, View, Contract, NFR, Trade-off, Transition. | Fallarbeit/Review, kein formales Mandat. |
| Staff | mehrteamiger Referenzpfad, Adoption, Standard, Konflikt. | Simulation ohne echte Teams bleibt reviewed-only. |
| Principal | mehrere Programme, Ziel/Transition, Wirkungskette. | Fallportfolio bereitet vor, ersetzt keine reale Programmarbeit. |
| Chief | Capability portfolio, Risk/FinOps, investment, operating model. | Strategieübung ist keine Executive-/Budgetverantwortung. |

## Production Checklist

### Roadmapqualität

- [ ] Prioritäten entsprechen GenAI Solution Architecture/Engineering, Platform/Enterprise, Cloud und unterstützend MLOps/LLMOps.
- [ ] Jede Initiative hat belegten Ausgangspunkt, Lücke, Capability, Artefakt, Test, Owner, Stop/Exit und Evidenzgrenze.
- [ ] WIP ist begrenzt und beendet aktive Labs wirklich inklusive Cleanup.
- [ ] Technologien sind Mittel zum Capabilitynachweis, keine unverbundene Liste.
- [ ] Reale Produktions-/Team-/Mandatslücken bleiben sichtbar.
- [ ] Quellen, versionierte Standards und Zeitfakten werden bei Nutzung erneut geprüft.

### Technische Evidenz

- [ ] Jeder Referenzpfad enthält Context, Runtime, Contract, Security, Failure, Observability, Cost und Rollout/Limit.
- [ ] Positive und negative Tests prüfen wichtige Sicherheits-/Integrations-/Betriebsannahmen.
- [ ] API/Event/Identity/Policy/Toolgrenzen sind serverseitig/technisch beschrieben.
- [ ] SLO/Degradation/Runbook und Cost Limit gehören zu jedem produktnahen Lab.
- [ ] Evidence Register verbindet Claim, Quelle, Test, Ergebnis, Scope und Recheck.
- [ ] Unabhängige Review oder reale begrenzte Zusammenarbeit ist als nächste Reifestufe geplant.

### Karriereübergang

- [ ] Story Cards enthalten nur Fakten, eigene Arbeit, Evidenz, Ergebnis und Limit.
- [ ] Jobbeschreibungen und Interviews aktualisieren die Gewichtung der Roadmap.
- [ ] Zielrollen werden über Entscheidungsobjekte und Mandate, nicht über Titel, bewertet.
- [ ] Stakeholder, Security, Privacy, Finance und Operations werden in Fallarbeit nicht ausgelassen.
- [ ] Keine reale Verantwortung behaupten, die nicht formal und messbar gegeben ist.
- [ ] Der Plan kann ein Thema stoppen, wenn Nachweis, Wert oder Kapazität nicht stimmen.

## Interviewfragen mit Modellantworten

### 1. Wie planen Sie Ihren Übergang zu einer Architecture-Rolle?

**Modellantwort:** Ich starte mit belegter technischer Evidenz und markiere ihre Grenzen. Dann priorisiere ich wenige wiederverwendbare Capabilities für die Zielrollen: sichere AI-Lösungsarchitektur, Plattform-/Integrationstiefe, Cloud-/Betriebsfähigkeit und MLOps/LLMOps. Jede Initiative endet in Contract, Tests, Failure/Security/Cost-Evidenz, Review und einer ehrlichen Reifestufe. Mehrteam- und Portfolioverantwortung behaupte ich erst mit realem Scope.

### 2. Wie vermeiden Sie, zu viele Technologien oberflächlich zu lernen?

**Modellantwort:** Ich forme Toolinteresse in Capabilityfragen um und nutze WIP-Limits. Ein Modellgateway, Kubernetes, Terraform oder Eventbus ist nur sinnvoll, wenn er einen konkreten Contract, Betrieb, Risiko, Kosten und Outcome im Referenzpfad verbessert. Veraltete oder nicht verwendete Labs retire ich bewusst.

### 3. Was ist Ihr nächster Nachweis nach einem Lab?

**Modellantwort:** Zuerst ein wiederverwendbarer Referenzpfad mit klarer Aussagegrenze. Danach suche ich unabhängige technische Prüfung oder real begrenzte Zusammenarbeit. Erst reale Adoption, formaler Scope und gemessene Wirkung können Aussagen über Staff-/Principal-/Chief-Wirkung stützen.

### 4. Wie führen Sie AI-Labs sicher aus?

**Modellantwort:** Mit synthetischen Daten, read-only Default, Budget/Quota, keine Secrets, keine unautorisierten Provideraccounts, klarer Datenklasse, serverseitigen Grenzen und Cleanup. Toolactions bleiben simuliert oder benötigen explizite Freigabe. Security, Privacy, Lizenz und Nutzungsbedingungen werden vor echter Umgebung geklärt.

### 5. Wie messen Sie Fortschritt?

**Modellantwort:** Nicht an Dateizahl oder Kursen, sondern an Evidence Maturity: kann ich erklären, habe ich ein Lab mit negativen Tests, ist es ein Referenzpfad, wurde es unabhängig geprüft oder real genutzt? Dazu tracke ich offene Zielrollenlücken, Artifactaktualität, WIP, Cost/Time und Interview-/Reviewfeedback.

### 6. Wie behandeln Sie fehlende Produktionstiefe?

**Modellantwort:** Ich nenne sie direkt. Ich simuliere keine Produktion. Stattdessen baue ich produktnahe, begrenzte Failure-, Security-, Cost- und Operatingartefakte und definiere, welche reale Verantwortung, Review oder Messung noch notwendig wäre. Das ist glaubwürdiger als eine überzogene Story.

## Praktisches Lab: Personal Capability Portfolio Review

### Ziel und Evidenzgrenze

**Status: reviewed_only.** Dieses Lab ist eine persönliche, nicht produktive Planungsfallarbeit. Es erstellt keine reale Karrierefreigabe und keine Organisationsentscheidung.

### Artefakte

```text
role-transition-lab/
  evidence-map.md
  target-role-gap-map.md
  initiative-cards/
  capability-map.md
  wave-plan.md
  evidence-maturity-register.md
  cost-and-wip-limits.md
  review-gates.md
  interview-story-cards.md
  retire-log.md
```

### Schritte

1. Überführe jede eigene belegte Praxis (Projekt, Zeitraum, Evidenzart) genau mit zulässiger Aussage und Limit in eine Evidenzkarte.
2. Bewerte jede Zielrolle nach Hands-on-, Architect-, Staff-, Chief- und Specialist-Tiefe.
3. Formuliere maximal fünf Initiative Cards für die nächsten zwei Wellen; jede hat Stop/Exit und negative Probe.
4. Plane einen vollständigen Read-only-AI-Referenzpfad als zentrale Capability.
5. Plane eine Integrations-/Event-/Contract-Vertiefung und eine Cloud-/SRE-/FinOps-Vertiefung, nicht zehn parallele Tools.
6. Erstelle Maturity Register E0–E5 und ordne jedes Artefakt ehrlich ein.
7. Baue ein Review Gate: Was muss passieren, bevor eine Initiative als Referenzpfad oder unabhängig geprüft gilt?
8. Simuliere Kapazitätsausfall oder Budgetlimit. Streiche/verschiebe Initiativen und dokumentiere die Entscheidung.
9. Formuliere zwei Story Cards und einen Interviewfall mit klarer Limit-Aussage.
10. Führe Cleanup durch und archiviere/retire ungenutzte oder falsch begrenzte Entwürfe.

### Negative Gegenproben

| Probe | Erwartung |
|---|---|
| Eine Initiative enthält zehn Tools, aber keine Capability/Test. | Review zerlegt oder stoppt sie. |
| Ein Lab behauptet Produktions-SLO ohne Betrieb. | Maturity Register begrenzt es auf E2/E3. |
| Eine Story enthält nicht belegte Team-/Nutzer-/Budgetzahlen. | Evidence Gate entfernt die Aussage. |
| Toolaction nutzt reale externe Daten. | Security/Scope Gate blockiert die Ausführung. |
| WIP steigt über Limit. | Initiative wird verschoben/retired statt nebenbei offen gelassen. |
| Kosten-/Zeitlimit wird überschritten. | Cost Gate verringert Scope, nutzt lokale Simulation oder stoppt. |
| Ein Standard ist veraltet. | Recheck aktualisiert, ersetzt oder markiert ihn als historisch. |
| Keine unabhängige Prüfung möglich. | Ergebnis bleibt reviewed-only, keine E4/E5-Aussage. |

### Cleanup

Alle Planartefakte als persönlich/synthetisch markieren. Keine Arbeitgeber-, Kunden-, Interview-, Zugangsdaten oder vertraulichen Informationen aufnehmen. Ungenutzte Mocks, Tokens, Testdaten und temporäre Konfiguration entfernen. Reale Karriereentscheidungen bleiben beim Nutzer und bei realen Arbeitgebern.

## Dependencies und Cross-References

- [KB-0002 – Rollen- und Kompetenzmodell](../00-navigation-governance/02-rollen-kompetenzmodell-und-tiefenstufen.md)
- [KB-0004 – Selbsteinschätzung und Evidenzgrenzen](../00-navigation-governance/04-cv-istbild-und-zielkompetenzen.md)
- [KB-0005 – Kompetenzcanvas und Wirkungskette](../00-navigation-governance/05-kompetenzcanvas-und-wirkungskette.md)
- [KB-0006 – Hands-on-, Architect-, Staff- und Chief-Arbeitsmodell](../00-navigation-governance/06-hands-on-architect-staff-chief-arbeitsmodell.md)
- [KB-0009 – Labstrategie, Evidenz und Gegenproben](../00-navigation-governance/09-labstrategie-evidenz-und-gegenproben.md)
- [KB-0029 – Interviewanforderungen der Zielrollen](19-interviewanforderungen-der-zielrollen.md)
- KB-0221 – GenAI-/LLM-Solution-Architecture
- KB-0550 – Platform Engineering und Developer Platform
- KB-0565 – Cloud Architecture und Landing Zones
- KB-0612 – Governance, Compliance, Privacy und AI Safety
- KB-0720 – Integrierende Staff-/Principal-/Chief-Architekturpraxis

## Quellen und Aktualitätsnotizen

| Quelle | Verwendung | Stand |
|---|---|---|
| Dateikatalog 720 | Scope: Ausgangsevidenz, Lernschritte, Portfolioartefakte, fehlende Produktionstiefe und beobachtbare Ergebnisse. | Planstand 2026-09-14 |
| [OpenAPI Specification](https://spec.openapis.org/oas/v3.2.1.html) | Contract- und Integrationstiefe. | Abgerufen 2026-09-15 |
| [NIST AI RMF 1.0](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf) | Risikostruktur für sichere AI-Labs. | Abgerufen 2026-09-15 |
| [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/) | SLO-/Workload-/Release-Lernfragen. | Abgerufen 2026-09-15 |
| [FinOps Framework](https://www.finops.org/framework/) | Cost-/Wert- und Kollaborationsrahmen. | Abgerufen 2026-09-15 |
| [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/) | Observability-Evidenz und Telemetriegrenzen. | Abgerufen 2026-09-15 |
| [Backstage Software Catalog](https://backstage.io/docs/features/software-catalog/) | Platform Ownership, Lifecycle und Golden Paths. | Abgerufen 2026-09-15 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — Evidence-driven Learning Portfolios verbinden technische Artefakte mit Reifegrenzen.** Versionierte Contracts, Tests, ADRs, Runbooks, Cost-/SLO-Signale und Reviewrecords können Lernfortschritt besser zeigen als eine Toolliste. **Reifegrad: Adopting.** Risiko bleibt Portfolio-Theater: Artefakte ohne Ausführung, Gegenprobe oder Aktualität. Ein Pilot verlangt pro Fähigkeit eine Behauptung, einen Test, eine Grenze und einen nächsten unabhängigen Nachweis.

**Stand 2026-09-15 — AI-gestützte Lernplanung ist nur dann hilfreich, wenn sie WIP und Wahrheit schützt.** KI kann Lücken, Quellen und Übungsvarianten vorschlagen; sie darf nicht Projekte, Produktionsresultate oder Kompetenz erfinden. **Reifegrad: Adopting.** Ein wirksamer Prozess führt eine Evidenzkarte, ein Maturity Register, Quellenstand, Cost Limit, Human Review und Retire-Log. Kein KI-generierter Text erhöht automatisch Evidenzstufe.

**Stand 2026-09-15 — Unit Economics wird als Lernziel für AI- und Plattformarchitektur wichtiger.** Kosten pro qualifiziertem Outcome verbinden Modell-/Retrieval-/Plattform-/Human-Reviewkosten mit Qualität und Risiko. **Reifegrad: Adopting.** Risiken sind Scheinpräzision und Optimierung ohne Safety. Ein begrenztes Lab misst Kosten nur auf synthetischer Datenbasis und trennt Budgetalarm von Sicherheits-/Privacy-Stop. Quelle: [FinOps Framework](https://www.finops.org/framework/).

