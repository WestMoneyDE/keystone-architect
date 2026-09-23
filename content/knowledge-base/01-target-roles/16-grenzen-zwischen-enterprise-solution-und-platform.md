---
{"id": "KB-0026", "title": "Grenzen zwischen Enterprise, Solution und Platform", "domain": "01", "sequence": 16, "document_type": "role", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0002", "concepts": ["Rollen-Kompetenz-Matrix", "Tiefenstufen", "Nachweisarten"], "needed_for": "understanding"}, {"id": "KB-0004", "concepts": ["Evidenzgrenzen", "zulässige Aussagen", "Zielkompetenzen"], "needed_for": "understanding"}, {"id": "KB-0005", "concepts": ["Kompetenzcanvas", "Entscheidungsreichweite", "Wirkungskette"], "needed_for": "understanding"}, {"id": "KB-0006", "concepts": ["Hands-on-Tiefe", "Architekturnachweis", "Spezialistenübergabe"], "needed_for": "understanding"}, {"id": "KB-0009", "concepts": ["Labstrategie", "Gegenprobe", "Evidenzgrenze"], "needed_for": "lab"}], "related": ["KB-0011", "KB-0013", "KB-0014", "KB-0015", "KB-0016", "KB-0017", "KB-0022", "KB-0023", "KB-0024", "KB-0025", "KB-0027", "KB-0550", "KB-0565", "KB-0612", "KB-0720"], "applies": ["KB-0550", "KB-0565", "KB-0612", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein gemeinsamer Fall wird mit Capability Map, Solution Blueprint, Platform Contract, Entscheidungslog, RACI, Übergabepunkten und negativen Proben modelliert.", "rationale": "Rollengrenzen werden erst glaubwürdig, wenn sie konkrete technische Objekte, Owner und Tests besitzen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Entscheidungsobjekte, Systemgrenzen, Daten-/Control-Flow, Verträge, Qualitätsattribute und Transition werden pro Architekturperspektive getrennt beschrieben.", "rationale": "Architekturrollen kooperieren über explizite Übergaben, nicht durch allgemeine Zuständigkeit."}, "STAFF-TARGET": {"active": true, "scope": "Referenzpfade, Templates, Contract Tests, Communities und klare Eskalationsregeln machen den Entwurf für Teams umsetzbar.", "rationale": "Die Rollentrennung muss Delivery vereinfachen statt neue Gremienwartezeiten zu erzeugen."}, "CHIEF-TARGET": {"active": true, "scope": "Das Verantwortungsmodell zeigt, welche Entscheidungen Strategie, Portfolio, Standards, Produkt, Plattform und Delivery verbinden und wo Chief-/Executive-Mandat beginnt.", "rationale": "Organisationsweite Architekturwirkung benötigt formale Entscheidungsklarheit und überprüfbare technische Evidenz."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Security, Privacy, Data, FinOps, SRE, Network, GPU, Legal, Procurement, People Leadership und Domänenexpertise werden als spezialisierte Mitentscheidung integriert.", "rationale": "Keine der drei Architekturperspektiven ersetzt spezifische fachliche Kontroll- oder Geschäftsmandate."}}, "lab_validation": [{"lab_id": "KB-0026-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Nicht produktive Fallarbeit für eine föderierte AI-gestützte Knowledge- und Commerce-Unterstützung", "evidence": "Das Lab umfasst Capability Map, Solution Blueprint, Platform Contract, Entscheidungsrechte, SLO-/Cost-/Risk-Signale, gegenläufige Rollensichten, negative Tests und Cleanup.", "limitations": "Keine realen Teams, Kunden, Systeme, Providerkonten, Daten, Budgets, Governancegremien oder Produktionsrollouts wurden behauptet oder verändert."}]}
---
# Grenzen zwischen Enterprise, Solution und Platform

> **Ziel:** Enterprise-, Solution- und Platform-Architektur nach ihren Entscheidungsobjekten und Übergabepunkten trennen. Die gleiche Person kann in einer kleinen Organisation mehrere Perspektiven einnehmen; die Entscheidungen dürfen dennoch nicht ineinander verschwimmen.

## Purpose, Definition und Scope

Architekturrollen überlappen, weil sie am selben Unternehmen und oft am selben System arbeiten. Der Unterschied liegt nicht im Werkzeug oder im schönsten Diagramm. Er liegt in den Fragen, die jede Perspektive verbindlich beantwortet:

- **Enterprise Architecture** fragt: Welche Geschäfts- und Technologiefähigkeiten, Informationsflüsse, Systeme, Risiken und Übergänge braucht das Unternehmen über längere Zeit?
- **Solution Architecture** fragt: Wie erfüllt eine konkrete Lösung für einen abgegrenzten Nutzer-, Prozess- oder Produktkontext funktionale und nichtfunktionale Ziele unter gegebenen Constraints?
- **Platform Architecture** fragt: Welche wiederverwendbaren technischen Fähigkeiten, Self-Service-Pfade, Standards und Betriebsgrenzen ermöglichen mehreren Teams sichere und schnelle Delivery?

Die drei Perspektiven können gemeinsam einen GenAI-Use-Case verantwortbar machen. Enterprise Architecture ordnet Daten-, Capability-, Geschäfts- und Portfolioauswirkungen ein. Solution Architecture gestaltet den konkreten Assistenzworkflow, Systemintegration und Nutzerwert. Platform Architecture liefert den wiederverwendbaren Identity-, Policy-, Modellrouting-, Observability- und Delivery-Unterbau. Security, Privacy, Data, SRE, Finance und Product behalten dabei eigene Mandate.

Der Artikel verhindert zwei Fehler:

1. **Rollenverschmelzung:** Eine Plattform entscheidet Fachprozesse oder ein Solution Architect legt ohne Mandat unternehmensweite Standards fest.
2. **Rollenisolierung:** Enterprise Architecture bleibt abstrakt, Solution Teams umgehen gemeinsame Schutz- und Betriebsgrenzen, Plattformen bauen ohne Kundennutzen.

## Kompetenzmarker und Evidenzgrenzen

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptionelles Wissen | Ein Entscheidungsmodell kann Capabilities, Solution Blueprint, Platform Contract und Governanceübergaben sauber verbinden. |
| HANDS-ON-TARGET | Der Lernfall liefert konkrete Contracts, Tests, Diagramme und eine begrenzte Referenzimplementierung. |
| ARCHITECT-TARGET | Alle Perspektiven beschreiben ihre Concerns, Qualitätsattribute, Entscheidungen, Owner, Schnittstellen und Transition. |
| STAFF-TARGET | Die Übergaben erzeugen Golden Paths, Contract Tests und gemeinsame Lernschleifen für Delivery-Teams. |
| CHIEF-TARGET | Portfolio-, Strategie- und Risikorechte sind vom operativen Lösungs- und Plattformmandat unterschieden. |
| SPECIALIST-OPTIONAL | Spezifische Security-, Legal-, Privacy-, Finance- und Tiefentechnikentscheidungen bleiben bei fachlich zuständigen Spezialisten. |

## Mental Model: Landkarte, Reiseplan und Verkehrssystem

Enterprise Architecture ist die **Landkarte**: Sie zeigt Fähigkeiten, Grenzen, Abhängigkeiten, Landschaft und längerfristige Wege. Solution Architecture ist der **Reiseplan** für einen konkreten Auftrag: Ziel, Route, Umstiege, Zeitbudget und Sonderbedingungen. Platform Architecture ist das **Verkehrssystem**: sichere Straßen, Schienen, Tickets, Signale, Wartung und Selbstbedienung, die viele Reisen möglich machen.

```text
Enterprise: capability + portfolio + information + transition
                            |
                            v
Solution: outcome + process + system composition + acceptance
                            |
                            v
Platform: reusable path + contract + guardrail + operation
                            |
                            v
Teams: implementation, domain behavior, production feedback
                            |
                            +---- evidence back to all three views ----+
```

Die Metapher hat Grenzen: Plattformen sind keine neutrale Infrastruktur; sie sind Produkte mit Nutzern, Kosten und Roadmap. Lösungen verändern häufig die Enterprise-Landkarte. Enterprise Architecture darf nicht nur zeichnen, sondern muss Transition und Portfolioentscheidungen ermöglichen.

## Prerequisites und Dependencies

| Abhängigkeit | Anwendung |
|---|---|
| KB-0002 Rollen- und Kompetenzmodell | Rolle, Titel, Tiefe und Nachweis auseinanderhalten. |
| KB-0004 Selbsteinschätzung und Evidenzgrenzen | Eigene Lernfälle werden nicht als formales Organisationsmandat ausgegeben. |
| KB-0005 Kompetenzcanvas | Jede Übergabe verbindet Outcome, Annahme, Evidenz und Entscheidung. |
| KB-0006 Hands-on bis Chief | Referenzimplementierung und Strategiearbeit bleiben verbunden. |
| KB-0009 Labstrategie | Negative Proben und Cleanup sichern die Fallarbeit ab. |
| KB-0013–KB-0017 | AI Platform, Platform, Enterprise, Cloud, Solution und System Architecture liefern Rollenvertiefungen. |

## Core Concepts

### 1. Entscheidungsobjekt statt Stellenbezeichnung

| Perspektive | Primäres Objekt | Zeit-/Reichweite | Typische Artefakte | Nicht ihr Alleinmandat |
|---|---|---|---|---|
| Enterprise | Capability, Value Stream, Informationsdomäne, Applikations-/Technologieportfolio, Ziel-/Übergangslandschaft | mehrere Bereiche, Quartale bis Jahre | Capability Map, Context Landscape, Principles, Roadmap, Portfolio-/Risikoentscheid | konkrete Delivery jedes Teams oder Rechts-/Budgetentscheidung ohne Mandat |
| Solution | abgegrenzter Nutzer-/Prozess-/Produkt-Use-Case und seine Systemkomposition | ein Produkt/Programm, Wochen bis Quartale | Solution Context, NFRs, Data/Control Flow, ADR, Integration/Deployment, Acceptance | globale Plattform- oder Enterprise-Baseline ohne Zustimmung |
| Platform | wiederverwendbare technische Fähigkeit und ihr Produkt-/Betriebsmodell | viele Teams, laufende Evolution | platform contract, golden path, template, service catalog, SLO, support/lifecycle | fachliche Daten-/Prozessownership aller Konsumenten |
| Delivery Team | fachliche Implementierung und Operation eines Produkts/Services | konkrete Iteration, dauerhaftes Ownership | code, tests, runbook, dashboard, backlog | organisationsweite Ziele/Standards ohne Architekturkontext |

### 2. Capabilities, Products und Platforms

Eine Capability beschreibt, was eine Organisation zuverlässig leisten kann: „tenant-sicheres Retrieval mit Citation“, „versionierte Event-Verträge“, „workload identity“, „sicheres Software Delivery“. Ein Produkt bietet Nutzerwert durch konkrete Workflows. Eine Plattform bietet wiederverwendbare technische Produkte und Guardrails.

Eine Plattform sollte nicht entstehen, weil mehrere Teams dieselbe Sprache verwenden. Sie entsteht, wenn wiederkehrende Reibung, Risiko oder Kosten eine gemeinsame Fähigkeit rechtfertigen und ein Team sie als Produkt betreiben kann. Das Plattformteam besitzt die Plattformfähigkeit, nicht automatisch die Produktpriorität oder Domänendaten.

### 3. Domain Ownership ist eine harte Grenze

Für eine AI-unterstützte Commerce-Anfrage kann die Plattform ein Modellgateway bereitstellen; sie darf daraus nicht ableiten, ob ein Kunde Rabatt, Lagerbestand oder Storno erhalten darf. Diese Autorisierung bleibt im Fachsystem. Enterprise Architecture stellt sicher, dass Ownership, System of Record und Informationsgrenzen in der Landschaft sichtbar sind. Solution Architecture übersetzt die Fachregel in sichere Integration. Platform Architecture liefert sichere Delegation und Auditmechanik.

```text
AI request -> platform policy -> domain authorization -> idempotent command
                 |                     |
                 v                     v
          shared guardrail        system-of-record decision
```

### 4. Federated Governance

Föderation bedeutet nicht „jede Gruppe macht alles selbst“. Sie definiert zentrale Invarianten und dezentrale Kontrolle:

- **Zentral/Shared:** Identitätsbasis, Klassifikationstaxonomie, Auditsemantik, Netz-/Cloud-Baselines, Contract-/Policy-Tooling, Plattform-SLO.
- **Domäne/Solution:** Geschäftsregel, Dateninhalt, Nutzerjourney, fachliche Autorisierung, Use-Case-Evaluation, Produkt-Outcome.
- **Enterprise:** Capability-/Portfolio-/Information-Landkarte, Prinzipien, längerfristige Transition und Entscheidungen bei Interessenkonflikt.
- **Platform:** wiederverwendbare Runtime-/Delivery-/Observability-/Self-Service-Fähigkeit, Enablement und Lifecycle.

### 5. Übergabepunkt als Vertrag

Eine Rollenübergabe darf nicht „schick das Dokument“ bedeuten. Sie ist ein Vertrag mit:

- Auslöser und Problemstatement;
- Entscheidungsobjekt und Scope;
- Owner und Accountable Decision;
- benötigter Evidenz;
- technischem Contract und Qualitätsattribut;
- Risiko-, Sicherheits- und Cost-Constraint;
- Rückgabe bei fehlender Information;
- Revisit- und Eskalationsregel.

Dadurch wird sichtbar, wann Enterprise Architecture eine Lösungsfrage aufnimmt, wann Solution Architecture Plattformanforderungen formuliert und wann Platform Architecture einen Golden Path bewusst nicht anbietet.

## Architecture und Data Flow: Ein gemeinsamer AI-Knowledge- und Commerce-Fall

Der Fall ist synthetisch. Er zeigt drei Entwürfe derselben Fähigkeit.

### Enterprise View

```text
Capabilities:
  customer service ── knowledge management ── commerce operations
          |                    |                       |
          +-------- trusted AI and data control -------+
                               |
                     identity / data / audit / cloud
```

Enterprise-Fragen:

- Welche Fähigkeit erzeugt Wert und für welche Geschäftsprozesse?
- Welche Informationsdomänen sind System of Record?
- Welche Datenklasse, Residenz, Retention und Ownership gelten?
- Welche Plattformfähigkeit ist strategisch statt nur projektspezifisch?
- Welche Legacy-/Integrationsabhängigkeiten verhindern den Zielzustand?
- Welche Portfolioentscheidung finanziert Transition, Betrieb und Retirement?

### Solution View

```text
Support user
    |
    v
Commerce-support service ----> knowledge query
    |                              |
    |                              v
    |                       AI access contract
    |                              |
    v                              v
domain authorization <------ retrieval/model response
    |
    v
read-only cited answer or approved human escalation
```

Solution-Fragen:

- Welcher Nutzer braucht welche Entscheidung oder Antwort?
- Welche fachlichen Regeln, Latenz, Verfügbarkeit, Sicherheits- und Auditziele gelten?
- Wann reicht Read-only Assistance, wann wird eine fachliche Aktion beantragt?
- Welche Integrationen, Events, APIs und Fehlerpfade werden benötigt?
- Wie werden Quellen, Evaluation, Human Review, Fallback und Support gestaltet?

### Platform View

```text
Developer template / SDK / contract test
          |
          v
identity + policy + model routing + retrieval boundary
          |
          +--> telemetry / cost allocation / audit correlation
          |
          +--> safe default: read-only / no tool action
          |
          v
self-service onboarding, SLO, support and lifecycle
```

Platform-Fragen:

- Welche minimale gemeinsame Schnittstelle reduziert Risiko und Integrationskosten?
- Wie wird ein Team ohne dauerhaftes Ticket onboarded?
- Welche SLO, Quota, Rate Limit, Degradation, Support und Deprecation gelten?
- Welche Variationen sind möglich, ohne Tenant-/Data-/Audit-Grenzen zu brechen?
- Welche Cost Attribution und Observability helfen Konsumenten und Betreiber?

### Gemeinsamer Ablauf

```text
Enterprise capability gap / portfolio hypothesis
                   |
                   v
Solution request with outcome, NFR, domain owner and data classification
                   |
                   v
Platform fit assessment:
  existing golden path | extension | exception | not a platform concern
                   |
                   v
solution build / platform contract / architecture decision
                   |
                   v
delivery, operations, user feedback, security and cost evidence
                   |
                   +--> Solution changes workflow
                   +--> Platform changes path/SLO
                   +--> Enterprise changes roadmap/portfolio
```

## Protokolle, Standards und Technologien

| Bereich | Relevanz für die Grenzen |
|---|---|
| ISO/IEC/IEEE 42010 | Die gleichen Systeme erhalten unterschiedliche, concern-orientierte Views statt konkurrierender Diagramme. |
| OpenAPI/AsyncAPI, Schema Evolution | Solution-/Platform-Übergaben bleiben als überprüfbare Verträge statt Wikiwissen bestehen. |
| OAuth/OIDC, Workload Identity, mTLS | Plattform kann sichere Delegation ermöglichen; Domäne behält Autorisierungsentscheidung. |
| OpenTelemetry | Teams, Plattform und Enterprise erkennen durch gemeinsame, datensparsame Semantik dieselben Betriebsfragen. |
| Feature Flags, GitOps, IaC | Solution Rollout nutzt Plattformguardrails; Plattform bewahrt sichere Defaults. |
| Service Catalog und Templates | Ownership, Lifecycle und Onboarding der Plattform-/Solution-Komponenten werden auffindbar. |
| FinOps allocation / budgets | Gemeinsame Plattformkosten und spezifische Solutionkosten werden nicht verwechselt. |
| NIST AI RMF / interne Controls | AI-Risiko wird von Use Case über Capability bis Runtime getrennt beurteilt. |

Standards und Tools sind Zeitpunkte, nicht Kompetenzen an sich. Ihre Version, Lizenz, Sicherheit, Kompatibilität und Organisationsfit müssen vor echter Auswahl geprüft werden.

## Konfiguration und Implementierung: Ein Übergabemodell, das Teams hilft

### 1. Solution Intake

```yaml
solution_intake:
  outcome: "support user receives cited internal answer"
  domain_owner: "commerce support"
  data_classes: ["internal", "confidential"]
  non_goals: ["autonomous writes", "customer decision automation"]
  quality_attributes:
    availability: "defined by product/SRE"
    latency: "interactive budget"
    safety: "citation or abstention"
  platform_needs:
    - "tenant/purpose propagation"
    - "approved retrieval boundary"
    - "model route and telemetry"
  evidence_needed:
    - "domain authorization path"
    - "negative tenant/purpose test"
    - "degradation and cost limit"
```

Solution Architecture verantwortet nicht, welche globale Plattform genutzt wird. Sie macht ihren Bedarf so präzise, dass Platform Architecture eine Passung oder eine begründete Ausnahme entscheiden kann.

### 2. Platform Contract

```yaml
platform_contract:
  provides:
    - "validated identity, tenant and purpose context"
    - "policy decision reference"
    - "approved model/retrieval route"
    - "trace and cost correlation"
  requires_from_consumer:
    - "domain owner"
    - "server-side authorization"
    - "data classification"
    - "SLO/use-case context"
  safe_defaults:
    - "read-only"
    - "explicit tool deny"
    - "time, token and cost limits"
  lifecycle:
    version: "semver or stated compatibility rule"
    support: "named platform owner"
    deprecation: "published migration policy"
```

### 3. Enterprise Decision Record

```yaml
enterprise_decision:
  object: "shared trusted AI access capability"
  driver: "repeated controls and inconsistent audit/cost across products"
  options:
    - "direct integrations"
    - "central monolith"
    - "federated contract and platform"
    - "defer until data/identity baseline improves"
  evaluation:
    - "business capability"
    - "data and security risk"
    - "operating model"
    - "cost and exit"
    - "domain autonomy"
  accountable: "named mandate, often CTO or delegated governance"
  revisit: "after two bounded solution adoptions or a control threshold breach"
```

### 4. Escalation Rules

| Situation | Primärer Owner | Eskalation |
|---|---|---|
| Use Case braucht neue fachliche Regel | Solution/Domain | Product/Domain governance. |
| Mehrere Teams benötigen denselben sicheren Contract | Platform | Enterprise/Chief decision, wenn Capability-/Portfoliofolge groß ist. |
| Neue Datenklasse oder gesetzliche Einschränkung | Solution + Security/Privacy | Enterprise risk/governance. |
| Plattform-SLO/Cost bricht für mehrere Konsumenten | Platform/SRE | Portfolio-/Investmententscheidung. |
| Legacy-System verhindert Zielcontract | Solution + Enterprise | Transitionprogram, ggf. Executive-Funding. |
| Gemeinsame Standardfrage ohne Mandat | Architecture leadership | Decision rights klarstellen, nicht per Meeting lösen. |

## Scalability und Performance

### Breite der Entscheidung versus Breite der Plattform

Ein häufiger Fehler lautet: Wenn etwas für drei Teams nützlich ist, muss es eine zentrale Plattform sein. Die Entscheidung braucht Kriterien:

| Signal | Plattformkandidat | Besser lokal/solution-spezifisch |
|---|---|---|
| Wiederholung | gleiche Control-/Integration mehrfach | einmaliger fachlicher Ablauf |
| Variation | stabiler gemeinsamer Contract möglich | unterschiedliche Domänenlogik dominiert |
| Betrieb | shared SLO/On-call/Cost sinnvoll | isolierte Last-/Failureklasse |
| Risiko | gemeinsame harte Sicherheits-/Dateninvariante | Risiko bleibt lokal und begrenzt |
| Adoption | mehrere Teams können Self-Service nutzen | hohe spezialisierte Betreuung je Team |
| Economics | Wiederholung amortisiert Plattform | Plattformfixkosten übersteigen Nutzen |

### End-to-End-Performance

Latenz und Durchsatz gehören häufig in die Solution Architecture, während gemeinsame Plattformkomponenten sie beeinflussen. Enterprise Architecture entscheidet, ob eine wiederkehrende Performancegrenze eine Capability-/Investitionsfrage wird.

```text
T_solution = T_client + T_domain_auth + T_platform_policy +
             T_retrieval + T_model + T_domain_response
```

Die Formel zwingt zur Zusammenarbeit. Ein Plattformteam kann nicht ein „schnelles Gateway“ behaupten, wenn Retrieval und Modellroute den Nutzerpfad dominieren. Ein Solution Team kann nicht jeden Timeout mit lokalen Retries kaschieren, wenn dies Plattformkosten und Queueing für alle erhöht.

## Reliability und Failure Modes

| Fehlerbild | Rollenursache | Folgen | Korrektur |
|---|---|---|---|
| Orphan decision | kein Mandat/Owner für gemeinsame Frage | Teams implementieren Varianten oder warten. | Decision object und accountable owner definieren. |
| Double ownership | Enterprise, Solution und Platform entscheiden dieselbe Fachregel. | Konflikt, Inkonsistenz, Verzögerung. | Domain System of Record und Contractgrenze sichtbar machen. |
| Platform bypass | Golden Path ist zu schwer oder langsam. | Schattenzugriff, Sicherheits-/Betriebsrisiko. | Friction messen, Pfad verbessern, harte Grenzen automatisieren. |
| Enterprise disconnect | Roadmap ignoriert Delivery-/Incident-/Costdaten. | Strategie ohne Glaubwürdigkeit. | Evidence Gate und Transition mit Teams verbinden. |
| Solution tunnel vision | konkretes Produkt ignoriert Shared Controls/Lifecycle. | spätere Migration, Cost/Incident. | Platform fit/intake früh, Ausnahme explizit. |
| Standard monoculture | Plattform erzwängt eine Implementation. | Domänenschäden, Innovationstau. | Invarianten von Varianten trennen. |
| Contract drift | API/Event/Telemetry ändern sich ohne Consumerblick. | Integrationsausfälle, Auditlücken. | Versioning, contract tests, catalog/owner. |
| Governance queue | zu viele Reviews ohne Risikorouting. | Deliveryumgehung und späte Sicherheitsbefunde. | delegieren, self-service, klare Eskalation. |

### Degradation mit klarer Zuständigkeit

Bei Provider-/Retrieval-/Policy-Ausfall muss Solution Architecture die Nutzerantwort und fachliche Degradation festlegen. Platform Architecture stellt technische Begrenzung, Circuit Breaker, Fallbackmechanik, Telemetrie und Support zur Verfügung. Enterprise Architecture entscheidet, ob wiederkehrende Ausfälle eine neue Portfolio-/Provider-/Capabilityentscheidung verlangen.

## Security, Governance und Compliance

Die Grenzen sind besonders wichtig bei AI und Daten:

- **Enterprise:** Informationsdomänen, Risikoappetit, Zielkontrollen, gemeinsamer Daten-/Identity- und Providerrahmen.
- **Solution:** konkreter Zweck, Nutzer, Datenfluss, fachliche Autorisierung, Threat Model, Akzeptanz von Human Gate/Abstention.
- **Platform:** erzwingbare Claims, Policy Hooks, sichere Defaults, Secrets, Telemetrie, Auditkorrelation, Runtime-/Deliveryguardrails.
- **Security/Privacy/Legal:** unabhängige Kontrollziele, Review, Veto innerhalb ihres formalen Mandats und regulatorische Auslegung.

Ein Model Gateway darf eine erlaubte Route liefern. Es darf nicht entscheiden, ob eine fachliche Aktion erlaubt ist. Ein Enterprise-Prinzip darf Datenschutz nicht „automatisieren“, wenn Datenklassifikation oder technische Kontrollen fehlen.

### Kontrollmatrix

| Kontrolle | Enterprise | Solution | Platform | Specialist |
|---|---|---|---|---|
| Data classification taxonomy | capability/standard | konkrete Zuordnung | propagiert/enforced metadata | privacy/data |
| Domain authorization | architecture boundary | integriert/fachlich testet | delegated identity + policy hook | domain/security |
| Model route | policy/portfolio context | workload quality/need | technical routing/limit | AI risk/security |
| Tool action | risk principle | user/process/human gate | schema, safe execution, audit | domain/security |
| SLO/degradation | capability target | user behavior | platform service SLO | SRE |
| Cost allocation | portfolio intent | product outcome | shared platform measurement | FinOps/finance |

## Observability und Troubleshooting

### Gemeinsames Signalmodell

| Signal | Solution-Lesart | Platform-Lesart | Enterprise-Lesart |
|---|---|---|---|
| Nutzerabbruch | Workflow oder UX passt nicht. | Latenz/Fehlerpfad im Contract? | Capabilityhypothese oder Priorität ändern? |
| Policy deny | Daten-/Zweck/Fachregel konflikt. | Claim/Policy/SDK-Integration prüfen. | Baseline oder Risikoentscheidung prüfen. |
| Cost/request | Use Case rechnet sich nicht. | Route/cache/quota/shared cost prüfen. | Portfolio-/Sourcing-/Investmentsicht. |
| SLO burn | Nutzerziel gefährdet. | Plattformdegradation/Kapazität. | Wiederkehrende Reliability-/Providerentscheidung. |
| Exception age | spezielle Lösung bleibt nötig. | Golden Path unzureichend. | Standard-/Transition-/Investmentfrage. |
| Contract break | Integrationsproblem. | Version/Template/Testpfad. | API-/Datenlandschaft und Ownership. |

### Troubleshooting: „Wer entscheidet die neue AI-Schnittstelle?“

1. Bestimme, ob es um Fachworkflow, gemeinsamen Contract, strategische Capability oder Sicherheits-/Rechtsgrenze geht.
2. Dokumentiere System of Record, Datenklasse, Nutzerzweck, Seiteneffekt, SLO und Cost-/Exitfolge.
3. Wenn nur eine Solution betroffen ist und keine gemeinsame Invariante verändert wird, entscheidet die Domain/Solution innerhalb ihrer Architekturgrenzen.
4. Wenn mehrere Teams denselben sicheren Mechanismus benötigen, evaluiert Platform Architecture Contract, Product Fit, Betrieb und Lifecycle.
5. Wenn Portfolio, Informationsdomäne, Cloud Foundation, Risikotoleranz oder große Transition betroffen sind, eskaliert Enterprise/Chief/Executive nach Mandat.
6. Security, Privacy, Legal und Finance entscheiden ihre fachlichen Grenzen; sie werden nicht als letzte Checkbox hinzugefügt.
7. Recorde Entscheidung, Owner, Ausnahmen, Test und Revisit.

## Cost und FinOps

Die drei Perspektiven benötigen verschiedene Kostenansichten:

| Ebene | Kostenfrage |
|---|---|
| Enterprise | Welches Capability-Investment, Provider-Risiko, Legacy-Exit und Shared-Cost-Modell ist wirtschaftlich und strategisch vertretbar? |
| Solution | Liefert der konkrete Workflow bei Qualität, Sicherheit und Latenz einen ausreichenden Nutzen pro Vorgang? |
| Platform | Was kostet Self-Service, SLO, Support, Shared Runtime, Observability und Enablement pro Konsument und Capability? |

**Anti-Pattern:** Plattformkosten pauschal Teams zuordnen, die den Nutzen nicht kontrollieren, oder Solutionkosten als Argument gegen eine gemeinsame Sicherheitsfähigkeit verwenden. Ein reifes Modell verbindet Showback/Chargeback, Unit Economics, Cost Limits, Anomalien, Daten-/Privacygrenzen und Capabilityentscheidung.

## Trade-offs und Anti-Patterns

| Trade-off | Fehlentscheidung | Reifer Umgang |
|---|---|---|
| Reuse / Fit | Plattform auf jede Lösung zwingen | Wiederholung, Risiko, TCO und Domainvariation prüfen. |
| Global / local | Enterprise entscheidet jede API | Enterprise setzt Prinzip/Portfolio; Solution/Platform handeln im Mandat. |
| Standard / innovation | Varianten verbieten | Hard invariants sichern, begrenzte Experimente und Exceptions zulassen. |
| Fast delivery / safe design | Security spät „freigeben“ | Controls, Contracts und Speicher-/Dataflow früh integrieren. |
| Shared cost / product value | Kosten nur zentral oder nur lokal sehen | Capability-, Plattform- und Workflowkosten getrennt und verbunden betrachten. |
| Governance / autonomy | Council als Ticketmaschine | risk-based routing, templates, policy/contract automation. |

Weitere Anti-Patterns:

- Eine Enterprise-Landkarte als Ersatz für Integration, Transition und Delivery.
- Solution Architecture, die Plattformanforderungen erst nach Implementierung meldet.
- Platform Architecture, die Produktstrategie oder Fachdaten an sich zieht.
- Unklare Verantwortung als „gemeinsam verantwortlich“ beschreiben.
- Telemetrie als Laufzeitwahrheit der Ownership behandeln, obwohl Katalog/Teams widersprechen.
- Jeder technischen Wiederholung eine neue Plattform geben.
- Ausnahme ohne Ablauf, kompensierende Kontrolle und Revisit.
- Einen AI-Prompt mit einer fachlichen Autorisierung verwechseln.

## Staff-, Principal- und Chief-Level Decisions

| Ebene | Anwendungsfrage |
|---|---|
| Staff | Wie bekommt ein Team einen nutzbaren, sicheren Contract und eine Referenzimplementierung? |
| Principal | Wie werden mehrere Solutions, Plattformänderungen und Migrationswellen als Programm sequenziert? |
| Chief | Welche Capabilities, Standards, Informations-/Cloud-/AI-Grenzen und Portfolioentscheidungen benötigen organisationsweite Klarheit? |
| Enterprise Architect | Welche Geschäftsfähigkeit, Informationsdomäne, Landschaft und Transition macht die Entscheidung langfristig tragfähig? |
| Solution Architect | Wie erfüllt ein konkreter Nutzer-/Prozessfall Ziele, NFRs und Integrationsgrenzen? |
| Platform Architect | Wie wird eine wiederverwendbare technische Fähigkeit mit Self-Service, SLO, Lifecycle und sicheren Defaults produktisiert? |

Ein und dieselbe Person kann mehrere Zeilen wahrnehmen. Sie muss dann ihre Rolle im jeweiligen Decision Record sichtbar wechseln, damit eine eigene Präferenz nicht als unabhängige Prüfung ausgegeben wird.

## Production Checklist

### Rolle und Decision Rights

- [ ] Entscheidungsobjekte sind nach Enterprise, Solution, Platform, Domain, Security, Finance und Delivery zugeordnet.
- [ ] Accountable Decision, Empfehlung, Implementation und Veto sind konkret.
- [ ] Gemeinsame Verantwortung hat einen Owner und keine unklare Gruppenformel.
- [ ] Eskalationsroute richtet sich nach Risiko und Reversibilität, nicht nach Hierarchiegefühl.
- [ ] Transition-/Portfoliofragen sind von einzelnen Featureentscheidungen getrennt.
- [ ] Rollen-/Mandatkonflikte sind als Governanceproblem sichtbar.

### Architektur und Delivery

- [ ] Enterprise-, Solution- und Platform-View beantworten unterschiedliche Concerns.
- [ ] Solution hat Outcome, Nichtziele, Datenfluss, NFR, fachliche Autorisierung und Degradation.
- [ ] Platform Contract besitzt safe defaults, Version, Support, Cost/Telemetry und Lifecycle.
- [ ] Capability Map, System of Record, Owner und Informationsgrenzen sind nachvollziehbar.
- [ ] API/Event/Telemetry Contracts werden getestet und kompatibel verändert.
- [ ] Templates und Golden Paths reduzieren echte Deliveryfriction.

### Betrieb, Risk und Kosten

- [ ] SLO/SLI, Alert, Runbook und Degradation haben Solution-/Platform-Owner.
- [ ] Security/Privacy/AI-Risk sind durch Controls und Tests, nicht nur Dokumente, repräsentiert.
- [ ] Toolactions bleiben serverseitig domainautorisiert und auditierbar.
- [ ] Shared-/Solution-/Portfolio-Cost kann mit Outcome und Grenzen verbunden werden.
- [ ] Ausnahmealter, Contract Breaks, Adoption und Supportlast werden als Systemsignale geprüft.
- [ ] Unabhängige Security-, Privacy-, Operations- und Architekturreviews sind vor realer Produktion vorgesehen.

## Interviewfragen mit Modellantworten

### 1. Wie unterscheiden Sie Enterprise und Solution Architecture?

**Modellantwort:** Enterprise Architecture fokussiert längerfristige Capabilities, Informationsdomänen, Landschaft, Portfolio und Transition. Solution Architecture verantwortet den konkreten Nutzer-/Prozessfall, seine Systemkomposition, NFRs, Datenflüsse und Integrationen. Die Solution muss zur Enterprise-Richtung passen, aber die Enterprise-Perspektive ersetzt keine produktnahe Architektur.

### 2. Wann wird eine Lösung zur Plattformfähigkeit?

**Modellantwort:** Wenn mehrere Teams denselben Mechanismus brauchen, die Variation begrenzt oder gefährlich ist, der Mechanismus mit einem stabilen Contract produktisiert werden kann und ein Team Betrieb, Support und Lifecycle übernimmt. Wiederholung allein genügt nicht; ein zentraler Dienst ohne Self-Service und Product Fit wird schnell zum Flaschenhals.

### 3. Wem gehört AI-Toolautorisation?

**Modellantwort:** Der Domain bzw. dem System of Record. Die Plattform kann Identity, Policy Hook, Schema, Rate Limit, Audit und sichere Execution anbieten. Solution Architecture gestaltet Zweck, Nutzerflow und Human Gate. Ein Prompt oder Plattformroute darf keine Fachautorisation ersetzen.

### 4. Wie vermeiden Sie Architekturboard-Engpässe?

**Modellantwort:** Mit klaren Decision Rights und risikobasiertem Routing. Teams entscheiden reversible lokale Fragen; Platform unterstützt wiederkehrende Contracts; Enterprise/Chief behandelt Portfolio, Informations-, Foundation- und schwer reversible Transitionen. Templates, Tests und Guardrails automatisieren Standardfälle, sodass Reviews sich auf echte Risiken konzentrieren.

### 5. Wie messen Sie Plattformwirkung?

**Modellantwort:** Nicht an der Anzahl Features. Ich betrachte Time-to-first-value, aktive erfolgreiche Nutzerteams, Support-/Ticketfriction, Exception Age, Contract-/Security-/Reliability-Signale, Cost per qualified capability use und die Fähigkeit, sicher zu deprecaten. Gleichzeitig achte ich darauf, dass Plattformmetriken keine Teamleistungskontrolle ersetzen.

### 6. Wie behandeln Sie Domänenvariation?

**Modellantwort:** Ich trenne harte Invarianten von fachlicher Variation. Tenant/Identity/Audit/Contract-/Safetygrenzen sind oft gemeinsame Controls. Fachregel, Dateninhalt, Nutzererlebnis und lokale Qualitätsprofile gehören in die Domäne. Wenn Variation häufig wird, prüfe ich, ob die Plattformgrenze falsch geschnitten ist.

### 7. Was geschieht, wenn Enterprise Architecture und Platform Team unterschiedliche Roadmaps haben?

**Modellantwort:** Die Capability- und Portfoliohypothese wird explizit: Welche geschäftliche Wirkung, welche Risiken, welche Kosten und welche Transition hängen daran? Enterprise koordiniert die längerfristige Landschaft; Platform bringt Product-/Betriebs-/Adoptionsevidenz. Ein accountable Mandat trifft die Reihenfolgeentscheidung und dokumentiert Revisit und Finanzierung.

### 8. Welche Evidenzgrenze gilt für diese Rollen?

**Modellantwort:** Eigene Arbeit an konkreten Fällen, etwa [Projekt/Lernfall] mit Zeitraum und Evidenzart, stützt technische Fallarbeit. Sie belegt ohne weiteren Nachweis keine formale Enterprise-/Solution-/Platform-Architect-Rolle, keine Organisationseinheit, Governancehoheit, produktive SLOs oder gemessene Unternehmenswirkung. Diese Grenzen gehören in die eigene Dokumentation.

## Praktisches Lab: Architekturgrenzen in einem föderierten AI-Workflow

### Ziel und Evidenzgrenze

**Status: reviewed_only.** Baue ein fiktives, dokumenten- und mockbasiertes Entscheidungspaket. Keine echten Kundendaten, Cloudkonten, Teams, Budgets oder Produktionsfreigaben verwenden.

**Fall:** Ein Commerce-Supportteam will interne, zitierfähige Knowledge Assistance. Zwei weitere Teams könnten später ähnliche Funktionen nutzen. Die Organisation hat keine gemeinsame AI-Plattform und unklare Datenowner.

### Artefakte

```text
architecture-boundaries-lab/
  enterprise/
    capability-map.md
    information-ownership.md
    portfolio-decision.md
  solution/
    problem-frame.md
    context-runtime-flow.md
    nfr-and-degradation.md
    adr-domain-authorization.md
  platform/
    contract.yaml
    golden-path.md
    slo-cost-support.md
    exception-template.yaml
  governance/
    decision-rights.md
    escalation-rules.md
    decision-gate.md
  tests/
    tenant-purpose-negative-tests.md
    platform-bypass-analysis.md
    contract-evolution-test.md
```

### Schritte

1. Erstelle Enterprise Capability Map und markiere `customer support`, `knowledge`, `commerce`, `trusted AI access`, `identity/data` und `platform operation`.
2. Schreibe einen Solution Problem Frame: Nutzer, Outcome, Nichtziele, Datenklasse, NFR, fachliche Autorisierung, Human Gate und Degradation.
3. Definiere Platform Contract mit Claimvalidierung, Policy Reference, read-only safe default, Trace/Cost Correlation, Quota, Lifecycle und Support.
4. Stelle drei Views des gleichen Flows nebeneinander: Enterprise Context, Solution Runtime und Platform Contract/Operation.
5. Lege eine RACI für Source of Truth, Model Route, Tool Action, SLO, Cost Allocation, Exception und Legacy Migration an.
6. Simuliere eine Entscheidung: erste Lösung lokal bauen, Platform Contract erweitern oder Portfolioinvestition starten. Jede Option enthält Wert, Risiko, Cost, Transition und Revisit.
7. Erstelle mindestens drei negative Tests: fremder Tenant, unzulässiger Zweck, Modelltimeout. Lege sichere Antwort und Owner fest.
8. Simuliere den Platform Bypass: Das Team umgeht den Contract wegen Latenz. Messe angenommene Friction, kläre hard boundary und verbessere/stoppe den Golden Path.
9. Lege ein Decision Gate mit Adoption, Security, SLO, Cost, Exception Age und Deliveryfriction an.
10. Erstelle Cleanup Readme, die alle Artefakte als synthetisch ausweist.

### Negative Gegenproben

| Probe | Erwartung |
|---|---|
| Enterprise View enthält nur Tools, keine Capabilities/Owner/Transition. | Portfolio Review verwirft ihn als Produktliste. |
| Solution nutzt Platform Policy als Fachautorisation. | Domain-Authorization-Test blockiert Toolaction. |
| Platform Contract verlangt fachliche Datenownership. | Plattformreview reduziert Scope auf technische Capability. |
| Team umgeht Contract für niedrigere Latenz. | Friction-/NFR-Analyse entscheidet Improve, Exception oder lokal; keine stille Abweichung. |
| SLO ist grün, aber Citation/Policy/Audit fehlt. | Decision Gate stoppt Expansion. |
| Shared Cost wird ohne Plattform-/Solution-Slice verteilt. | FinOps Review verlangt Attribution und Entscheidungskontext. |
| Exception hat kein Ablaufdatum. | Standardreview lehnt sie ab. |
| API-Change bricht Consumer. | Contract-Evolution-Test blockiert Release oder fordert Migration. |

### Cleanup

Entferne lokale Mocks, Testdaten, Logs, Flags und Zugangsdaten. Kennzeichne alle Architekturentscheidungen mit `simulated` oder `proposed`. Dokumentiere fehlende unabhängige Review-, Security-, Legal-, Provider-, Kosten-, Produktions- und Adoptionsevidenz.

## Dependencies und Cross-References

### Direkt vorausgesetzt

- [KB-0002 – Rollen- und Kompetenzmodell](../00-navigation-governance/02-rollen-kompetenzmodell-und-tiefenstufen.md)
- [KB-0004 – Selbsteinschätzung und Evidenzgrenzen](../00-navigation-governance/04-cv-istbild-und-zielkompetenzen.md)
- [KB-0005 – Kompetenzcanvas und Wirkungskette](../00-navigation-governance/05-kompetenzcanvas-und-wirkungskette.md)
- [KB-0006 – Hands-on-, Architect-, Staff- und Chief-Arbeitsmodell](../00-navigation-governance/06-hands-on-architect-staff-chief-arbeitsmodell.md)
- [KB-0009 – Labstrategie, Evidenz und Gegenproben](../00-navigation-governance/09-labstrategie-evidenz-und-gegenproben.md)

### Rollen und spätere Anwendung

- [KB-0013 – AI Platform Architect als Zielrolle](03-ai-platform-architect-als-zielrolle.md)
- [KB-0014 – Platform Architect als Zielrolle](04-platform-architect-als-zielrolle.md)
- [KB-0015 – Enterprise Architect als Zielrolle](05-enterprise-architect-als-zielrolle.md)
- [KB-0017 – Solution Architect als Zielrolle](07-solution-architect-als-zielrolle.md)
- [KB-0025 – Chief Architect als Zielrolle](15-chief-architect-als-zielrolle.md)
- [KB-0027 – Architekturlaufbahn und individuelle technische Karriere](17-architekturlaufbahn-und-individuelle-technische-karriere.md)
- KB-0550 – Platform Engineering und Developer Platform
- KB-0565 – Cloud Architecture und Landing Zones
- KB-0612 – Governance, Compliance, Privacy und AI Safety
- KB-0720 – Integrierende Staff-/Principal-/Chief-Architekturpraxis

## Quellen und Aktualitätsnotizen

| Quelle | Verwendung | Stand |
|---|---|---|
| Dateikatalog 720 | Verbindlicher Scope: Entscheidungsobjekte, Zeithorizonte, Eskalationen und Übergabepunkte. | Planstand 2026-09-14 |
| [ISO/IEC/IEEE 42010:2022](https://www.iso.org/standard/74393.html) | Concern-orientierte Architekturdescription. | Abgerufen 2026-09-15 |
| [OpenAPI Specification](https://spec.openapis.org/oas/v3.2.1.html) | API Contract als überprüfbare Schnittstelle. | Abgerufen 2026-09-15 |
| [AsyncAPI Specification](https://www.asyncapi.com/docs/reference/specification/latest) | Event-/Nachrichtencontract und Interoperabilität. | Abgerufen 2026-09-15 |
| [NIST AI RMF 1.0](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf) | Risikostruktur für AI-Systeme. | Abgerufen 2026-09-15 |
| [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/) | Reliability als Nutzer-/Workload-Signal. | Abgerufen 2026-09-15 |
| [FinOps Framework](https://www.finops.org/framework/) | gemeinsame Kosten-/Wertarbeit. | Abgerufen 2026-09-15 |
| [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/) | Interoperable Telemetrie. | Abgerufen 2026-09-15 |
| [Backstage Software Catalog](https://backstage.io/docs/features/software-catalog/) | Katalog, Ownership und Lifecycle. | Abgerufen 2026-09-15 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — AI- und Plattformcontracts werden zunehmend als gemeinsame Produktgrenze statt als API-Detail behandelt.** Für AI-Workflows müssen Identity, Zweck, Datenklasse, Modell-/Retrievalroute, Toolscope, Evaluation, Audit und Cost Context über Systemgrenzen konsistent sein. **Reifegrad: Adopting.** Nutzen ist sichere Wiederverwendung; Risiken sind überbreite zentrale Contracts und die Vermischung von Plattformpolicy und Fachautorisation. Ein Pilot definiert nur die minimalen hard invariants und testet Tenant-, Purpose-, Tool- und Degradationsfehler. Quellen: [OpenAPI](https://spec.openapis.org/oas/v3.2.1.html), [AsyncAPI](https://www.asyncapi.com/docs/reference/specification/latest).

**Stand 2026-09-15 — Internal Developer Platforms entwickeln sich zu föderierten Produktgrenzen.** Katalog, Templates, Contract Tests, Policies und Telemetrie können Teams unabhängiger machen, wenn Plattformen ihren Scope, SLO, Support und Lifecycle wie ein Produkt führen. **Reifegrad: Established für Kernmechanismen, Adopting für AI-Ressourcen.** Risiken sind Ticketmonolith, veraltete Ownershipdaten und Standardzwang. Ein Pilot misst Onboardingzeit, Contract Breaks, Ausnahmealter und Supportfriction vor breiter Standardisierung. Quelle: [Backstage Software Catalog](https://backstage.io/docs/features/software-catalog/).

**Stand 2026-09-15 — Architecture Decision Telemetry kann Übergabepunkte messbar machen.** Strukturierte Records, Contracts, Exceptions, SLO-/Cost-/Risk-Signale verbinden Enterprise-Roadmap, Solution-Outcome und Platform-Betrieb. **Reifegrad: Emerging bis Adopting.** Risiken sind unzulässiges Monitoring, Metriktheater und falsche Kausalität. Ein Pilot verknüpft nur wenige Entscheidungen mit Owner, Revisit-Frage und datensparsamer Telemetrie; kein Signal ersetzt eine fachliche oder rechtliche Freigabe. Quellen: [ISO/IEC/IEEE 42010](https://www.iso.org/standard/74393.html), [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/).

