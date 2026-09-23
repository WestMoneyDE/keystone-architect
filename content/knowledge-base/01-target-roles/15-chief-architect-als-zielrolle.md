---
{"id": "KB-0025", "title": "Chief Architect als Zielrolle", "domain": "01", "sequence": 15, "document_type": "role", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0002", "concepts": ["Rollen-Kompetenz-Matrix", "Tiefenstufen", "Nachweisarten"], "needed_for": "understanding"}, {"id": "KB-0004", "concepts": ["Evidenzgrenzen", "zulässige Aussagen", "Zielkompetenzen"], "needed_for": "understanding"}, {"id": "KB-0005", "concepts": ["Kompetenzcanvas", "Entscheidungsreichweite", "Wirkungskette"], "needed_for": "understanding"}, {"id": "KB-0006", "concepts": ["Hands-on-Tiefe", "Architekturnachweis", "Spezialistenübergabe"], "needed_for": "understanding"}, {"id": "KB-0009", "concepts": ["Labstrategie", "Gegenprobe", "Evidenzgrenze"], "needed_for": "lab"}], "related": ["KB-0011", "KB-0013", "KB-0014", "KB-0015", "KB-0016", "KB-0022", "KB-0023", "KB-0024", "KB-0026", "KB-0550", "KB-0565", "KB-0612", "KB-0720"], "applies": ["KB-0550", "KB-0565", "KB-0612", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein fiktives Technologieportfolio wird mit Strategiehypothesen, Capability Map, Entscheidungsrechten, Standards, Investmentoptionen, Evidenzkatalog und Decision Gates ausgearbeitet.", "rationale": "Die strategische Rolle wird zuerst durch überprüfbare, begrenzte Entscheidungsartefakte gelernt."}, "ARCHITECT-TARGET": {"active": true, "scope": "Zielarchitektur, Übergänge, Qualitätsattribute, Operating Model, Schnittstellen und technische Risiken werden über fachliche und organisatorische Grenzen sichtbar gemacht.", "rationale": "Strategie bleibt nur dann glaubwürdig, wenn sie in Architektur und Betrieb übersetzbar ist."}, "STAFF-TARGET": {"active": true, "scope": "Standards und Roadmaps werden durch Golden Paths, Referenzimplementierungen, Communities, Verträge, Ownership und Feedback in die Delivery übersetzt.", "rationale": "Chief-Entscheidungen ohne Teamnutzbarkeit erzeugen Dokumente statt Fähigkeiten."}, "CHIEF-TARGET": {"active": true, "scope": "Technologieportfolio, Risikotoleranz, Capability-Investitionen, Standards, Sourcing und Entscheidungsrechte werden als verantwortliche, überprüfbare Führungsarbeit modelliert.", "rationale": "Der Zielzustand umfasst langfristige, organisationsweite Wirkung; der formale Auftrag muss im konkreten Unternehmen geklärt werden."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Board-Kommunikation, Recht, Regulierung, Procurement, Finance, People Leadership, Security, Data, Netzwerk, GPU und Forschung werden mit den jeweiligen Verantwortlichen und Spezialisten bearbeitet.", "rationale": "Chief Architect integriert fundierte Perspektiven, ersetzt weder fachliche Mandate noch spezialisierte Prüfungen."}}, "lab_validation": [{"lab_id": "KB-0025-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Nicht produktive Fallarbeit für ein fiktives AI-, Plattform- und Cloud-Technologieportfolio", "evidence": "Das Lab definiert Strategiehypothesen, Capability Map, Portfolioentscheidung, RACI, Standard-/Ausnahmepaket, Risiko-/Kosten-/SLO-Signale, Gegenproben und Cleanup.", "limitations": "Keine realen Unternehmensdaten, Führungsgremien, Budgets, Providerkonten, Verträge, Mitarbeiterentscheidungen, Cloudsysteme oder Produktionsrollouts wurden beansprucht oder verändert."}]}
---
# Chief Architect als Zielrolle

> **Kernidee:** Ein Chief Architect verantwortet in manchen Organisationen die technische Gesamtarchitektur oder einen großen Teil davon. Entscheidend sind jedoch nicht Titel oder Rang, sondern Mandat, Entscheidungsrechte, technische Evidenz, wirksame Übergänge und klar abgegrenzte Verantwortung gegenüber CTO, Enterprise Architecture, Security, Product und Delivery.

## Purpose, Definition und Scope

Chief Architect ist eine organisationsabhängige Zielrolle für die Verbindung von Technologiestrategie, Architekturportfolio, technischen Standards, Übergangsprogrammen und Entscheidungsqualität. Die Rolle wirkt dort, wo Entscheidungen über einzelne Produkte oder Programme hinausgehen: AI- und Datenplattformen, Cloud Foundation, Identity, Integrationslandschaft, Engineering-Produktion, Resilienz, Kostensteuerung, Sourcing, Legacy-Ablösung und langfristige technische Fähigkeiten.

Ein Chief Architect besitzt nicht automatisch eine größere formale Macht als ein CTO, CISO, Chief Product Officer oder Enterprise Architect. In vielen Organisationen berichtet die Rolle an den CTO und empfiehlt technische Richtung; in anderen leitet sie Enterprise Architecture oder eine Architekturcommunity. Manchmal ist sie als individuelle technische Laufbahn neben Management angelegt. Jede Interpretation ohne konkrete Rollenbeschreibung ist riskant.

Dieses Kapitel verwendet den Begriff als **Rollenmodell**:

- Die Rolle erzeugt eine technische Strategie, die Geschäftsziel, Risikotoleranz und Delivery verbindet.
- Sie entscheidet oder strukturiert Entscheidungen über gemeinsame technische Fähigkeiten und Investitionsoptionen.
- Sie setzt Standards, aber nur dort, wo Invarianten, Interoperabilität, Sicherheitsgrenzen, Wirtschaftlichkeit oder Betriebsfähigkeit es rechtfertigen.
- Sie sorgt für ein föderiertes Operating Model: zentrale Orientierung und Guardrails, dezentrale Produkt- und Domänenverantwortung.
- Sie macht Portfolio-, Risiko-, Cost- und Operating-Evidenz in Entscheidungszyklen wirksam.
- Sie baut Nachfolgefähigkeit auf, damit die Organisation nicht von einem einzelnen Architekten abhängig bleibt.

**Nicht Scope:**

- eigene Lernprojekte als Beleg einer Chief-Architect-Rolle auszugeben;
- CTO-, Board-, Finance-, Legal-, Security- oder People-Managemententscheidungen an sich zu ziehen;
- eine Technologieauswahl ohne Product-, Betriebs-, Sicherheits- und Kostenkontext zu treffen;
- Architekturstrategie als einmaliges Folienpaket zu behandeln.

### Lernziele

Nach diesem Artikel kannst du:

1. Chief Architect, CTO, Enterprise Architect, Principal/Distinguished Engineer und Delivery-Führung anhand ihrer Entscheidungsobjekte unterscheiden;
2. eine Technologiestrategie als überprüfbare Hypothesenkette statt als Toolliste formulieren;
3. ein Portfolio über Capabilities, Risikogrenzen, Investitionsoptionen, Roadmaps und Entscheidungsrechte steuern;
4. Standards als prinzipiengestützte, testbare und nutzbare Guardrails organisieren;
5. AI-, Plattform-, Cloud-, Daten-, Sicherheits- und Finanzperspektiven in einer gemeinsamen Architekturentscheidung verbinden;
6. eine Strategy-to-Delivery-Lernschleife mit SLO, Sicherheits-, Adoption- und Kostensignalen entwerfen;
7. die Grenzen zwischen realer eigener Evidenz, konzeptioneller Fallarbeit und Chief-Zielkompetenz transparent darstellen.

## Kompetenzmarker und Evidenzgrenzen

| Marker | Status und Bedeutung |
|---|---|
| **CURRENT-EVIDENCE** | Offen, mit strenger Grenze: eigene technische Lern-/Implementierungskontexte belegen ohne weiteren Nachweis keine Chief-Rolle, kein Executive-Mandat, keine Portfoliohoheit, Budget- oder Produktionsverantwortung. |
| **HANDS-ON-TARGET** | Ein synthetisches Portfolio wird mit Architekturartefakten, Entscheidungen, Standards, Policies, Messung und Gegenproben aufgebaut. |
| **ARCHITECT-TARGET** | Ziel- und Übergangsarchitektur übersetzt Strategie in konkrete Qualitätsattribute, Verträge, Daten-/Control-Flow, Betrieb und Migration. |
| **STAFF-TARGET** | Golden Paths, Templates, Communities und Referenzimplementierungen machen Richtung für Teams nutzbar. |
| **CHIEF-TARGET** | Entscheidungsrechte, Capability-Investitionen, Risiko, Sourcing, Portfolio- und Strategiewirkung werden als verantwortliche Arbeit modelliert. |
| **SPECIALIST-OPTIONAL** | Recht, Regulierung, Beschaffung, Finance, Security, People Leadership und Tiefenspezialisierung gehören in fachlich verantwortete Kooperation. |

## Mental Model: Technologieportfolio als System aus Fähigkeiten und Optionen

Ein Chief Architect führt kein Sortiment aus Werkzeugen, sondern ein Portfolio aus Fähigkeiten, Risiken, technischen Schulden, Investitionen und Übergängen. Produkte kommen und gehen; Capabilities wie sichere Identität, Datenlineage, API-Interoperabilität, Cloud Foundation, AI-Evaluation, Observability, Incident Response oder Developer Self-Service wirken dauerhaft über viele Produkte.

```text
Business direction + risk tolerance + market constraints
                           |
                           v
                 Technology strategy hypotheses
                           |
             +-------------+--------------+
             |                            |
             v                            v
      Capability portfolio         Architecture principles
             |                            |
             +---- standards / patterns / guardrails ----+
                           |
                           v
      Programs, product roadmaps, platform and domain delivery
                           |
                           v
 quality + security + reliability + cost + adoption + outcome evidence
                           |
                           v
          invest / scale / revise / retire / source / stop
```

Die Rolle optimiert nicht isoliert Kosten, Geschwindigkeit, Sicherheit oder Innovation. Sie macht die Zielkonflikte explizit und sorgt dafür, dass eine accountable Person sie auf Basis ausreichender Evidenz entscheidet.

### Die neun Chief-Linsen

1. **Wert:** Welche Geschäftsfähigkeit oder welches Risiko verändert sich?
2. **Capability:** Was muss die Organisation wiederholt können, auch nach dem Projekt?
3. **Architektur:** Welche Grenzen, Verträge, Datenflüsse und Qualitätsattribute sind nötig?
4. **Betrieb:** Was passiert unter Last, Störung, Cyberangriff, Providerproblem oder Datenfehler?
5. **Security/Privacy/Safety:** Welche nicht verhandelbaren Grenzen und Kontrollnachweise gelten?
6. **Ökonomie:** Welche Unit Costs, Kapazitäten, Fixkosten, Exit- und Opportunitätskosten entstehen?
7. **Organisation:** Wer besitzt Produkt, Daten, Standard, Betrieb, Entscheidung und Ausnahme?
8. **Zeit:** Was kann klein und reversibel gelernt werden, was ist schwer reversibel und benötigt Entscheidung jetzt?
9. **Ökosystem:** Welche Standards, Anbieter, Open-Source-, Regulierungs- und Talentbewegungen verändern die Optionen?

Wenn ein Architekturvorschlag eine dieser Linsen auslässt, ist er nicht vollständig entscheidbar.

## Prerequisites und Abhängigkeiten

| Abhängigkeit | Zweck |
|---|---|
| KB-0002 Rollen- und Kompetenzmodell | Wirkungsstufe und formale Titel voneinander trennen. |
| KB-0004 Selbsteinschätzung und Evidenzgrenzen | Keine strategische Verantwortung aus technischen Lernfällen ableiten. |
| KB-0005 Kompetenzcanvas | Jede Strategiehypothese mit Outcome, Annahme, Evidenz und Grenze verbinden. |
| KB-0006 Hands-on bis Chief | Technische Tiefe, Review und Delegation an Spezialisten ausbalancieren. |
| KB-0009 Labstrategie | Synthetische Portfolioarbeit korrekt begrenzen, gegenprüfen und bereinigen. |
| KB-0022 bis KB-0024 | Staff-Mechanismen, Principal-Programme und organisationsweite Kohärenz als Vorstufen verstehen. |

## Core Concepts

### 1. Technologiestrategie ist eine Entscheidung unter Annahmen

Eine brauchbare Strategieraussage hat Form:

> Wenn wir die Fähigkeiten `trusted AI access`, `federated platform self-service` und `observable cloud economics` aufbauen, können wir mehrere priorisierte Workflows sicherer und schneller liefern sowie ihre Kosten/Risiken steuern, **sofern** die Domänen ihre Daten- und Fachownership behalten, die Plattform ein nützliches Produkt wird und Security/Privacy/Operations die Kontrollziele akzeptieren.

Das ist konkret genug, um Annahmen und Messungen zu definieren. „Wir werden AI-first“, „Cloud-native“ oder „API-first“ ohne Problem, Grenzen, Zeitpunkt, Kosten und Beweis sind Slogans, keine Strategie.

### 2. Capability statt Tool

| Tool-Frage | Capability-Frage |
|---|---|
| „Kaufen wir Produkt X?“ | „Welche sichere, wirtschaftliche Fähigkeit brauchen wir, wie messen wir sie und wer betreibt sie?“ |
| „Welches LLM ist Standard?“ | „Welche Workloads brauchen welche Qualitäts-, Daten-, Latenz- und Kostenklasse?“ |
| „Führen wir Kubernetes ein?“ | „Wie liefern und betreiben Teams Workloads sicher, isoliert, beobachtbar und wirtschaftlich?“ |
| „Brauchen wir eine Data Platform?“ | „Wie finden, klassifizieren, teilen, verändern und verantworten wir Daten?“ |
| „Welches API Gateway?“ | „Wie sichern, versionieren, beobachten und monetarisieren wir externe und interne Verträge?“ |

Tools können ein Capability-Teil sein. Der Chief Architect modelliert jedoch Ownership, Prozesse, Skills, Standards, Betriebsmodell, Kosten, Übergang und Exit – sonst wird eine Lizenz mit einer Fähigkeit verwechselt.

### 3. Portfolioarchitektur

Ein Portfolio enthält nicht nur aktive Projekte. Es enthält:

- **Run:** Betrieb und Lebenszyklus bestehender Fähigkeiten;
- **Grow:** skalierbare, nachweislich wertvolle Erweiterungen;
- **Transform:** größere Ziel- und Übergangsprogramme;
- **Explore:** kleine, stark begrenzte Lernoptionen;
- **Retire:** bewusst abzulösende Technologien, Verträge, Daten oder Plattformpfade;
- **Risk reserve:** Kapazität für Security-, Resilienz-, Compliance- und Schuldenrisiken.

Jede Initiative hat einen Owner, Zeitraum, Entscheidung, Evidence Gate, Kosten-/Kapazitätsrahmen, Risiko und expliziten Stop- oder Exitpfad. Ohne `Retire` entsteht eine dauerhaft wachsende Landschaft.

### 4. Entscheidungsrechte vor Entscheidungsmeetings

Meetings lösen kein unklar definiertes Mandat. Vorher muss für jedes Entscheidungsobjekt geklärt sein:

- Wer ist **Accountable** für den Trade-off?
- Wer kann **entscheiden**, wer **empfiehlt**, wer **implementiert**, wer **prüft**?
- Welche Evidenz ist nötig?
- Wann muss ein Thema von Produkt/Team zu Plattform, Architektur oder Executive Governance eskalieren?
- Welche Entscheidungen dürfen Teams unabhängig treffen?
- Wie wird eine Entscheidung nach neuen Fakten revidiert?

Ein Architekturboard ohne klare Rechte erzeugt entweder Schattenentscheidungen oder Warteschlangen.

### 5. Architecture Principles als Testbare Leitplanken

Ein Prinzip ist eine anhaltende Entscheidungshilfe. Beispiele:

| Prinzip | Technischer Test |
|---|---|
| Fachautorisierung bleibt im System of Record. | Kein AI-Toolcommand führt ohne erneute Domainentscheidung aus. |
| Jede kritische Fähigkeit besitzt eine sichere Degradation. | Provider-/Abhängigkeitsausfall führt zu dokumentiertem Fallback, Abstention oder Read-only. |
| Verträge sind versioniert und kompatibel evolvierbar. | Breaking Changes werden vor breiter Integration erkannt und migriert. |
| Telemetrie ist datensparsam und entscheidungsorientiert. | Standardspans enthalten keine unzulässigen Rohinhalte; jede Kennzahl hat Owner/Entscheidung. |
| Standards haben Lifecycle. | Jeder Baseline-Standard hat Owner, Adoption, Ausnahme, Review und Deprecation. |
| Kosten sind eine Designvariable. | Workload-/Produkt-/Capabilitykosten können gegen Nutzen und Limits beurteilt werden. |

### 6. Target State und Transition

Chief-Arbeit muss neben dem Zielbild auch die schmerzhafte Realität der Transition planen. Klassische Risiken:

- mehrere Systeme als Source of Truth;
- fragmentierte Identität und Berechtigungslogik;
- Daten ohne Klassifikation/Owner/Retention;
- direkte Provider-/Toolintegration ohne gemeinsames Kontrollmodell;
- Legacy-Contracts mit unbekannten Konsumenten;
- zentrale Plattform ohne Produkt- und Supportmodell;
- Shared Costs ohne Zuordnung;
- fehlender Skill-/Operating-Model-Aufbau.

Die Transition braucht Wellen, Kompatibilitätsadapter, Reconciliation, Migrationsbereitschaft der Teams, Exitkriterien und überprüfbare Endpunkte. Ein Zielbild ohne Weg dorthin macht technische Schuld unsichtbar.

## Architecture und Data Flow: Strategy-to-Delivery Operating Model

### Rollen und Entscheidungsobjekte

| Rolle | Typische Verantwortung | Entscheidet nicht allein |
|---|---|---|
| **CTO** | Technologie-/Produktstrategie, Engineeringorganisation, Investitions-/Talentrahmen, Executive Accountabilty. | Jede Detailarchitektur oder Spezialkontrolle. |
| **Chief Architect** | technische Strategie, Architekturportfolio, Standards-/Transition-/Capability-Entscheidungen, technische Empfehlung und Konsistenz. | formale Unternehmensrisikotoleranz, People-/Budget-/Rechtsentscheidungen ohne Mandat. |
| **Enterprise Architect** | Business-/Capability-/Informations-/Applikationslandschaft, langfristige Geschäftsarchitektur und Governance. | konkrete Delivery-Implementierung jedes Teams. |
| **CISO / Security** | Sicherheitsrisiko, Security Controls, Incident-/Complianceverantwortung. | Produktpriorisierung oder komplette Technologieportfolioauswahl. |
| **Product / Domain Leader** | Nutzerwert, Prozess, Fachregel, Roadmap, wirtschaftlicher Outcome. | globale technische Baseline ohne Architektur-/Security-Kontext. |
| **Platform Leader** | Plattformprodukt, Self-Service, Reliability, Developer Experience, Adoption. | Fachliche Datenownership und Businesspriorität aller Domänen. |
| **Principal / Staff Engineer** | Programm-/Mehrteamwirkung, Referenzpfade, technische Tiefe, Implementierung und Adoption. | organisationsweite Risikotoleranz und Chief-Mandat. |
| **Finance / Procurement / Legal** | Budget, Verträge, kaufmännische Risiken, rechtliche Prüfung. | technische Implementation ohne fachliche Evidenz. |

Rollen können in kleinen Organisationen personell zusammenfallen. Dann muss die Trennung im Entscheidungsrecord umso klarer dokumentiert werden.

### Data Flow einer Portfolioentscheidung

```text
Inputs
  ├── product goals and domain demand
  ├── architecture inventory and technical debt
  ├── reliability / incident / capacity evidence
  ├── security, privacy and AI-risk assessment
  ├── cloud costs, contracts and FinOps allocation
  └── market, standards and technology research
                         |
                         v
       portfolio hypothesis + capability map + option set
                         |
       +-----------------+---------------------+
       |                                       |
       v                                       v
architecture / domain / operations challenge    accountable governance decision
       |                                       |
       +-----------------> decision record <---+
                              |
              +---------------+----------------+
              |                                |
              v                                v
      roadmap, standards, patterns       investment / sourcing / retirement
              |                                |
              +--------- delivery / transition -+
                              |
                              v
       telemetry, audit, SLO, cost, adoption and outcome evidence
                              |
                              v
       periodic portfolio review: scale / revise / stop / retire
```

### Beispiel: „Trustworthy AI as a shared capability“

Der Fall ist ein synthetisches Lernbeispiel zu typischen GenAI-Themen, ohne reale Portfoliowirkung zu behaupten.

**Strategiehypothese:** Interne Wissens- und Workflowunterstützung kann verantwortbar skaliert werden, wenn Fachdomänen Daten und Autorisierung besitzen, während ein gemeinsamer Capability-Kern Identity-/Purpose-Propagation, Modell-/Retrieval-Policy, Evaluation, Telemetrie, Audit und Cost Allocation anbietet.

**Portfoliooptionen:**

1. Jede Domäne integriert Modelle und Tools direkt.
2. Ein zentraler AI-Monolith übernimmt alle Domänen.
3. Föderierter Contract und Plattformbasis; Domänen behalten fachliche Ownership.
4. Keine AI-Ausweitung bis Daten-/Identity-Basics verbessert sind.

Der Chief Architect bereitet Evidenz und Trade-offs auf. Die formale Wahl kann abhängig von Risiko, Budget und Mandat bei CTO/Governance liegen.

## Protokolle, Standards und Technologien

| Feld | Technologie-/Standardbeispiele | Architekturfrage |
|---|---|---|
| Architekturdescription | ISO/IEC/IEEE 42010, ADR, Context-/Runtime-/Deployment-/Transition Views | Welche Concern, Annahme und Entscheidung sind nachvollziehbar? |
| APIs/Eventing | OpenAPI, AsyncAPI, Schema Evolution, idempotente Verarbeitung, contract tests | Wie bleibt unabhängige Delivery interoperabel? |
| Identity/Security | OAuth/OIDC, workload identity, mTLS, policy-as-code, secrets management, KMS | Wer/was darf welche Aktion mit welchem Kontext ausführen? |
| AI/LLMOps | model gateway, prompt/version lifecycle, retrieval, evaluation, safety checks, tool gateway | Welche Route ist für Daten, Qualitäts- und Kostenklasse zugelassen? |
| Platform | IaC, GitOps, service catalog, templates, artifact provenance, feature flags | Wie wird sicherer Delivery zur leichteren Option? |
| Reliability | OpenTelemetry, SLI/SLO, error budget, chaos/failure drills, runbooks | Welche Signale ändern Rollout oder Architecture Roadmap? |
| Data | catalog, lineage, classification, retention, quality, domain ownership | Welche Daten-/Zweck-/Vertrauensgrenze wird kontrolliert? |
| Economics | FinOps allocation, unit economics, budgets, capacity planning, vendor exit | Was kostet die fähige, sichere Wertlieferung wirklich? |

Zeitabhängige Informationen sind auf **2026-09-15** datiert. Vor Umsetzung müssen Standards, APIs, Preise, rechtliche Anforderungen, Modelle, Providerverhalten und interne Policies gegen aktuelle Primärquellen und Zielumgebung geprüft werden.

## Konfiguration und Implementierung: Strategy Artefacts, nicht Strategie-Folien

### 1. Technology Strategy Canvas

```yaml
strategy:
  horizon: "12-36 months; hypothesis, not a promise"
  business_drivers:
    - "trusted internal knowledge workflows"
    - "faster secure delivery across product teams"
  capabilities:
    - "governed AI access"
    - "federated platform self-service"
    - "cloud cost and capacity transparency"
  non_goals:
    - "central ownership of domain data"
    - "autonomous high-impact AI actions"
  constraints:
    - "data classification and delegated authorization"
    - "defined reliability and cost boundaries"
  measures:
    - "qualified task completion"
    - "time-to-first-safe-integration"
    - "policy/security failures"
    - "cost per qualified outcome"
  decision_gates:
    - "expand only after two domains adopt without permanent platform intervention"
    - "stop when control evidence or sustainable ownership is absent"
```

Ein Canvas muss immer mit konkreten System-, Daten-, Betriebs- und Organisationsevidenzen verbunden werden. Es ist der Eingang in eine Diskussion, keine Freigabe.

### 2. Portfolio Register

| Feld | Beispiel |
|---|---|
| Initiative | Föderierter AI Access Contract |
| Capability | Governed AI access |
| Klassifikation | Transform |
| Owner | benannter Technology/Platform/Domain DRI |
| Outcome | zitierfähige, kontrollierte Read-only-Aufgabe |
| Grenzen | Tenant, Zweck, Datenklasse, Tool scope, Budget |
| Abhängigkeiten | Identity, data catalog, telemetry, model route |
| Investment | Engineering, Security Review, Enablement, Betrieb |
| Evidence Gate | Policy negative test, SLO/Quality/Cost/Adoption |
| Stop/Exit | kein Owner, fehlende Domainadoption, unzulässiger Riskbefund |
| Revisit | nach einer Welle oder wenn Grenzwert verletzt wird |

Das Register muss auf Status `explore`, `invest`, `scale`, `hold` oder `retire` enden – nicht auf „in Arbeit“ ohne Entscheidungslogik.

### 3. RACI für Chief-Entscheidungen

```text
Decision: Enterprise AI model-routing baseline

Accountable: CTO or formally delegated technology executive
Responsible: Platform / AI architecture owner
Consulted: Chief Architect, CISO, privacy, finance, domain representatives, SRE
Informed: Product leads, affected engineering teams, support
Decision evidence: risk assessment, data policy, quality evaluation, SLO, cost, contract/exit
Revisit: provider/material-model/policy change or threshold breach
```

Die Matrix ist nur der Anfang. Jeder Beteiligte muss wissen, ob er eine Empfehlung, eine Zustimmung, ein Veto innerhalb seines Mandats oder eine Implementation verantwortet. „Consulted“ darf nicht zu einem unendlichen Konsensprozess werden.

### 4. Standard Lifecycle

```text
idea -> explore -> reference path -> adopt -> standard -> deprecate -> retire
                 |                 |
                 +---- exception --+
```

Für jeden Zustand gelten Mindestbedingungen:

- **Explore:** klare Hypothese, kleine Scope-/Kostengrenze, keine breite Pflicht.
- **Reference path:** End-to-End-Beispiel, Tests, Safe Defaults, Runbook, Einschränkungen.
- **Adopt:** mindestens begrenzte, freiwillige Übernahme und Frictionfeedback.
- **Standard:** belegter Bedarf, owner, Tooling, exception, lifecycle, Supportmodell.
- **Deprecate:** Migrationspfad, Termine, Kommunikation, Kompatibilität.
- **Retire:** aktive Abschaltung, Daten-/Contract-/Kostenbereinigung, Lessons Learned.

## Scalability und Performance

### Technische Skalierung und Organisationsskalierung

Eine Chief-Strategie muss beide betrachten. Ein Modellgateway, Eventbus oder Kubernetes-Cluster kann Last skalieren und dennoch die Organisation verlangsamen, wenn jedes Team auf ein zentrales Ticket wartet. Umgekehrt kann ein sehr dezentrales Modell ohne Contracts, Security Baselines oder Kostenmodell operative Explosion erzeugen.

| Dimension | Fragestellung | Beispiele für Signale |
|---|---|---|
| Compute/AI | Wie wachsen Requests, Token, Modelle, Queue, GPU/CPU und Netz? | P95/P99, queue age, saturation, error, cost/task. |
| Data | Wie wachsen Quellen, Schema, Retention, Lineage und Zugriff? | freshness, quality, classification coverage, unauthorized attempt. |
| Integration | Wie viele Consumer und Versionen gibt es? | contract break, migration lead time, duplicate event. |
| Platform | Wie viele Teams können selbstständig onboarden? | time-to-first-value, support wait, template completion. |
| Governance | Wie lange dauert eine risikogerechte Entscheidung? | decision lead time, exception age, escalations. |
| Economics | Was passiert bei Last, Providerpreis oder Kapazitätswechsel? | unit cost, anomaly, commitment coverage, exit cost. |
| People/skills | Kann die Organisation den Pfad betreiben und verändern? | on-call load, incident quality, training/adoption feedback. |

### Performance-Entscheidungen im AI-Portfolio

- **Routing:** Nicht jedes Anliegen benötigt das größte Modell; Route nach Qualitäts-, Datenschutz-, Latenz- und Kostenklasse.
- **Caching:** Nur mit Berechtigungs-, Freshness-, Klassifikations- und Invalidationmodell; ein Cache Leak ist ein Sicherheitsproblem.
- **Asynchronität:** Für lange Prozesse kann Queueing sinnvoll sein, erfordert aber Zustandsmodell, idempotente Commands, TTL, Fairness und Support.
- **Capacity:** Autoscaling ersetzt nicht Backpressure, Quota und Admission Control.
- **Evaluation:** Qualität muss über repräsentative Slices und Drift beobachtet werden, nicht über eine einmalige Demo.
- **Data locality:** Netzwerk, Datenresidenz, Egress, Providerroute und Datenschutz können die Architektur mehr bestimmen als Compute.

## Reliability und Failure Modes

### Portfolio-Failure-Modes

| Fehler | Mechanismus | Frühzeichen | Chief-Reaktion |
|---|---|---|---|
| Strategy theatre | Strategie hat keine Transition, Owner oder Signale. | wiederholte Folien, keine Delivery-/Betriebsänderung. | Hypothesen in Fähigkeiten, Wellen und Decision Gates zerlegen. |
| Architecture bottleneck | Alle Entscheidungen müssen zentral bestätigt werden. | lange Lead Time, Schattenlösungen, Frust. | Risikorouting, Self-Service, Delegation, Templates. |
| Platform capture | Plattform übernimmt Domainarbeit und Datenownership. | Ticketqueue, spezielle Integrationen, keine lokale Verantwortung. | Contract/Ownership neu schneiden, Produktmodell verbessern. |
| Legacy paralysis | Zielbild ist klar, aber kein Budget/Owner für Übergang. | wachsende Ausnahmen, Dual Run ohne Ende. | Retire-Initiative, sequencing, executive escalation, Stop neuer Abhängigkeiten. |
| Unmeasurable portfolio | Initiativen haben keine Outcome-/Risk-/Cost-Evidenz. | „green“ Status ohne Signale. | Portfolio-Register und Gates verpflichtend machen. |
| Vendor capture | proprietäre Daten/Identity/Contracts verhindern Exit. | hohe Migrationskosten, kein Testpfad. | Exit Architecture, offene Contracts, Multi-/alternative route prüfen. |
| AI control failure | Model/tool/data paths sind nicht kontrolliert. | policy denials, audit gaps, unsafe output, cost spikes. | Hard stop, incident, control redesign, independent review. |
| Underfunded run | Neue Capabilities ohne Betrieb, Support, Lifecycle. | On-call load, stale docs, abandoned standards. | Run-/Retire-Kosten sichtbar machen, Investment umpriorisieren. |

### Degradation auf Strategieniveau

Strategie muss auch bei Störung funktional bleiben. Das bedeutet:

- Wenn ein Provider ausfällt, existiert eine fachlich akzeptierte Fallback- oder Abstention-Politik.
- Wenn eine Plattform Capability nicht reif ist, bleibt ein sicherer lokaler Pfad definiert statt ein inoffizieller Bypass.
- Wenn eine Governanceentscheidung aussteht, wird Scope begrenzt und nicht schleichend produktiv.
- Wenn Cost oder Capacity aus dem Rahmen fällt, können Workloads priorisiert, gedrosselt, verschoben oder beendet werden.
- Wenn Sicherheits-/Privacy-Evidenz fehlt, stoppt die Verbreitung unabhängig von Deliverytempo oder Error Budget.

## Security, Governance und Compliance

### Risikobasierte Entscheidungsstruktur

```text
Risk tolerance / legal obligation
              |
              v
architecture objective and policy requirement
              |
              v
technical control / contract / guardrail
              |
              v
test, audit evidence, runtime telemetry and incident response
              |
              v
portfolio review and corrective investment
```

Ein Chief Architect übersetzt nicht allein Gesetze. Die Rolle stellt jedoch sicher, dass strategische Entscheidungen die kontrollierbaren Fragen explizit enthalten:

- Datenklassifikation, Zweckbindung, Retention und Residenz;
- Identität, Workloadrechte, Delegation, Schlüssel und Secrets;
- Provider-/Modell-/Toolfreigabe sowie Supply-Chain-Transparenz;
- AI-Safety, Evaluation, Red Teaming, Human Gates und Incidentpfade;
- Change-/Release-/Exception- und Auditnachweise;
- Vertrag, Beschaffung, Exit und Third-Party-Risiko;
- Nachweis, welche Kontrolle im Produktivpfad wirklich wirksam ist.

### Keine Gleichsetzung von Governance und Kontrolle

Governance entscheidet Ziele, Mandat und Grenzen. Controls begrenzen oder entdecken technische Zustände. Ein Gremium kann eine Datenrichtlinie freigeben; erst Identity, Policy Enforcement, Datenfilter, Audit und Tests machen sie technisch wirksam. Umgekehrt kann ein Policy Engine eine Geschäfts- oder Rechtsentscheidung nicht automatisch erfinden.

### AI Governance: Drei getrennte Ebenen

1. **Use-Case-Governance:** Zweck, Nutzer, Schadensprofil, Einschränkungen, Accountable Owner.
2. **Capability-Governance:** Modellroute, Daten-/Tool-/Policy-/Evaluation-/Audit-Fähigkeiten.
3. **Runtime Governance:** konkrete Konfiguration, Version, Change, Telemetrie, Incident und Degradation.

Die Trennung verhindert, dass eine globale AI-Plattform eine lokale fachliche Freigabe simuliert oder ein einzelner Prompt eine Sicherheitskontrolle ersetzt.

## Observability und Troubleshooting

### Chief Dashboard: Entscheidungssignale statt Metrikfriedhof

| Signalgruppe | Beispiele | Welche Entscheidung informiert sie? |
|---|---|---|
| Wert | completed qualified task, Durchlaufzeit, Nutzerabbruch, Fehlervermeidung | Use Case investieren, umgrenzen oder beenden. |
| Delivery | lead time, deployment frequency, rollback time, contract failures | Plattform-/Prozessengpass und Standardverbesserung. |
| Reliability | SLO, latency, queue, error budget burn, incident severity | Kapazität, Degradation, Architekturtransition. |
| Security/Privacy/Safety | policy deny, access violation, secret/SBOM finding, unsafe eval, audit gap | Hard stop, Control- und Governancekorrektur. |
| Cost | cost/outcome, anomaly, allocation coverage, provider concentration | Routing, Budget, Sourcing, Exit, Scope. |
| Adoption | active teams, time-to-first-value, exception age, support load | Golden Path verbessern, Standard ändern/retire. |
| Portfolio | run/grow/transform/explore/retire mix, capability maturity, debt trend | Investition verschieben, Programm stoppen, Risiko adressieren. |

Ein Dashboard darf keine individuelle Leistungsüberwachung simulieren. Signale dienen der Systementscheidung. Bei personenbezogenen Daten sind Zweck, Zugriff, Retention und rechtliche Anforderungen separat festzulegen.

### Troubleshooting: „Die Strategie wird von Delivery als weit weg erlebt“

1. Suche ein konkretes Delivery-/Betriebsproblem, das die Strategie lösen soll.
2. Prüfe, ob die Strategie als Capability mit Contract, Template, Owner, Runbook und E2E-Referenzpfad existiert.
3. Messe Integrationsfriction und Decision Lead Time.
4. Lade kritische Staff-/Principal-/SRE-/Security-/Domain-Review ein; kein reines Executive Feedback.
5. Entferne abstrakte Prinzipien ohne Test oder unterstützende Plattformfähigkeit.
6. Priorisiere eine kleine Welle mit wertvollem Workflow und vereinbare die Evidenz für Fortsetzung.
7. Korrigiere oder stoppe die Strategiekomponente öffentlich, wenn die Hypothese nicht trägt.

### Troubleshooting: „Zwei Executive- oder Architekturrollen widersprechen sich“

1. Benenne den Entscheidungsgegenstand und das formale Mandat, nicht die Person.
2. Trenne Businesspriorität, technische Architektur, Sicherheitsveto, Budget und Rechtsfreigabe.
3. Erstelle Optionen mit Auswirkungen auf Nutzerwert, Risiko, Kosten, Time-to-Value, Exit und Betrieb.
4. Kläre, wer `Accountable` ist und wer innerhalb seines Mandats ein Veto ausüben kann.
5. Dokumentiere Entscheidung, Dissens, Risiken, Owner und Revisit. Kein künstlicher Konsens.
6. Falls Mandate wirklich kollidieren, eskaliere das Governance-Design an zuständige Führung, statt technisch zu improvisieren.

## Cost und FinOps

Eine Chief-Architekturstrategie besitzt eine Wirtschaftsthese. Sie ist nicht nur „mehr sparen“, sondern die Fähigkeit, Ressourcen dem Nutzen, Risiko und Lebenszyklus zuzuordnen.

### Kostenschichten

```text
Direct use: model tokens, compute, storage, network, licenses
+ Shared platform: clusters, observability, security, support, CI/CD
+ Transition: migration, adapters, dual run, training, contracts
+ Risk: incidents, remediation, audit, non-compliance, outage
+ Exit: data portability, retraining, replacement, contractual commitments
= Total cost of a sustained capability
```

### FinOps-Fragen auf Chief-Level

| Frage | Relevante Evidenz | Entscheidung |
|---|---|---|
| Welche Fähigkeit verdient gemeinsame Investition? | wiederholter Bedarf, Sicherheits-/Betriebs-/Deliveryfriction, TCO. | Build, buy, reuse, federate oder bewusst lokal lassen. |
| Wo erzeugt ein Standard versteckte Kosten? | migrations, support, exception, cognitive load, vendor commitment. | Scope verkleinern, enablement finanzieren oder Standard zurücknehmen. |
| Wie begrenzen wir AI-Kosten? | token/workflow, quality, retries, cache, model route, human review. | limits, routing, product scope, quota und budget alarm. |
| Was kostet Lock-in wirklich? | Datenformat, identity, contract, skills, exit time, agreement. | Option behalten, exit artifact bauen oder bewusst akzeptieren. |
| Wann retire? | geringer Outcome, hohe Run-/Risk-/Supportkosten, fehlender Owner. | deprecate/retire mit Migration und Kommunikation. |

Der FinOps Framework bietet einen aktuellen Rahmen für cross-funktionale Cloud-Wertarbeit. Es ersetzt keine technische oder geschäftliche Entscheidung; es macht sie verlässlicher messbar.

## Trade-offs und Anti-Patterns

| Spannungsfeld | Unreife Lösung | Reife Lösung |
|---|---|---|
| Zentraler Standard / Domänenfreiheit | alles zentral oder jedes Team frei | harte Invarianten zentral; Fachsemantik und Implementierung föderiert. |
| Strategie / Delivery | Strategie als Präsentation oder reine Tickets | Hypothesen → Capabilities → Referenzpfade → Evidenz → Revision. |
| Innovation / Risiko | neue Technologie global aktivieren | begrenzte Option, Quellenkritik, unabhängige Reviews, Exit. |
| Kosten / Wert | globale Sparquote | Unit economics mit Qualitäts-, Sicherheits- und Outcome-Grenzen. |
| Geschwindigkeit / Governance | Veto ohne Pfad oder Bypass | klare Decision Rights, sichere Golden Paths, zeitgebundene Ausnahmen. |
| Portfolio / Projekt | nur neue Initiativen finanzieren | Run, Transform, Explore, Retire und Risk Reserve ausbalancieren. |
| Executive authority / technical authority | Titel als Entscheidung | Mandat, Evidenz, Consultation, accountable decision und Revisit. |

**Anti-Patterns:**

- Die Tool-Roadmap wird als Technologiestrategie ausgegeben.
- Ein Chief Architect beschließt Business-, Legal-, Budget- oder Securityfragen ohne Mandat.
- Eine Plattform wird zur zentralen Featurefactory.
- Ein Standard besitzt keine Tests, Lifecycle, Owner oder Ausnahme.
- Legacy wird weder finanziert abgelöst noch als bewusstes Risiko geführt.
- AI-Modelle werden auf Demos statt auf Daten-, Sicherheits-, Betriebs- und Kostenprofilen geroutet.
- Telemetrie sammelt Daten ohne Entscheidung, Datenschutzmodell oder Eigentümer.
- Ein Portfolio wird nur nach Projektstatus („grün/gelb/rot“) statt nach Wert, Risiko, Capabilities und Exit bewertet.
- Externe Trends ersetzen Quellenkritik und lokale Evidenz.
- Der Titel soll fehlende technische Tiefe, Dialog oder Revisionsfähigkeit überdecken.

## Staff-, Principal- und Chief-Level Decisions

| Ebene | Kernfrage | Beispiel |
|---|---|---|
| Staff | Welchen mehrteamigen technischen Engpass lösen wir konkret? | Ein wiederverwendbarer, sicherer RAG-Referenzpfad mit Contract und Rollout. |
| Principal | Wie werden mehrere Programme in Ziel- und Übergangsarchitektur sequenziert? | Daten-/Policy-/Runtime-Transition und gemeinsame SLO-/Cost-Gates. |
| Distinguished-Modell | Welche langfristige technische Kohärenz und Capability braucht die Organisation? | Architecture Charter, Invarianten und dezentral nutzbare Standards. |
| Chief Architect | Welche technische Strategie, Portfolioallokation, Standards und Operating Decisions brauchen formalen Fokus? | AI-/Cloud-/Platform-Capability Portfolio mit Invest/Retire, Governance und Executive Recommendation. |
| CTO / Executive | Welche geschäftliche Risikotoleranz, Budget-, Talent- und Unternehmensentscheidung gilt? | Investitionsrahmen, Sourcing, Organisation und strategische Prioritäten. |

### Chief-Entscheidungen

1. **Capability Investment:** Welches wiederkehrende Problem rechtfertigt eine gemeinsame Fähigkeit und welches Produkt/Team wird zuerst unterstützt?
2. **Portfolio Mix:** Wie viel Kapazität bleibt für Run, Risk, Explore, Transform und Retire? Welches Vorhaben wird bewusst nicht gestartet?
3. **Architecture Baseline:** Welche Identitäts-, Daten-, Contract-, Betriebs- und Kosteninvarianten sind so grundlegend, dass sie standardisiert und überprüft werden?
4. **Transition Sequence:** Welche Legacy-Abhängigkeit muss vor einer neuen AI-/Cloud-Funktion reduziert werden? Wo ist Adapter, Dual Run oder Hard Cut vertretbar?
5. **Sourcing/Exit:** Was wird gebaut, eingekauft, als Open Source übernommen oder bewusst nicht zentralisiert? Welche Exit-Kosten und Daten-/Identity-Grenzen akzeptieren wir?
6. **Operating Model:** Wer besitzt Standards, Plattformprodukte, Ausnahmen, Betrieb, Entscheidung und Architekturwissen? Wie wirkt diese Struktur nach einem Personalwechsel weiter?
7. **Risk Escalation:** Welche Befunde stoppen Rollout unabhängig von Budget oder Deliverytempo? Wer wird wann eingebunden?

## Production Checklist

### Strategie und Portfolio

- [ ] Strategie benennt Geschäftstreiber, Capabilities, Nichtziele, Grenzen, Annahmen und Evidence Gates.
- [ ] Portfolio enthält Run, Grow, Transform, Explore, Retire und Risk/Compliance-Arbeit.
- [ ] Jede Initiative hat Owner, Outcome, Investition, Risiko, Timing, Stop/Exit und Revisit.
- [ ] Capability ist von Tool, Projekt und Anbieter getrennt beschrieben.
- [ ] Legacy- und Transitionkosten sind sichtbar und finanziell/organisatorisch zugeordnet.
- [ ] Externe Technologie-/Marktanalyse hat Quellenstand und lokale Prüfkriterien.

### Entscheidungsrechte und Architektur

- [ ] CTO-, Chief-Architect-, Enterprise-Architecture-, Product-, Security-, Finance- und Delivery-Mandate sind ausformuliert.
- [ ] Accountable Decisions und Sicherheits-/Rechtsvetos sind klar, ohne künstlichen Konsenszwang.
- [ ] Architecture views beantworten Context, Runtime, Data, Deployment, Operating und Transition Concern.
- [ ] Prinzipien besitzen Test, Owner, Ausnahme, Revisit und Durchsetzungsmechanismus.
- [ ] Standards sind als Pattern, Guardrail, Baseline oder Recommendation korrekt klassifiziert.
- [ ] Standard Lifecycle und Retirement sind operationalisiert.

### Betrieb, Security und Economics

- [ ] SLO/SLI, Degradation, Incident Owner und Runbook gelten vor breiter Adoption.
- [ ] Identity, data classification, purpose, authorization, provider, model, tool und audit sind getrennt kontrolliert.
- [ ] AI-Evaluation und Safety-Entscheidungen besitzen Scope, Risk, Human Gate und Stopregeln.
- [ ] Telemetrie hat Datensparsamkeit, Semantik, Owner, Retention und Decision Link.
- [ ] Cost allocation und Unit Economics sind gegen Qualitäts-/Outcome-Slices interpretierbar.
- [ ] Budget-, Security-, Privacy-, Safety- und Reliability-Grenzen können Investition oder Rollout stoppen.

### Wirkung und Nachfolge

- [ ] Teams können den Golden Path mit geringem Support nutzen.
- [ ] Adoption, Friction, Exception Age, Supportlast und Contract Brüche werden verfolgt.
- [ ] Architekturwissen liegt in Charter, ADRs, Contracts, Templates, Catalog und Communities.
- [ ] Strategierevision basiert auf sichtbarer Evidenz und nicht auf Statusritualen.
- [ ] Unabhängige technische, Security-, Privacy-, Operations- und ggf. Legalreviews sind für reale Produktion geplant.
- [ ] Alle Aussagen unterscheiden aktuelle eigene Evidenz, konzeptionelle Annahme, Lab und Zielkompetenz.

## Interviewfragen mit Modellantworten

### 1. Was ist die Aufgabe eines Chief Architect?

**Modellantwort:** Abhängig vom Unternehmen verantwortet die Rolle technische Strategie, Architekturportfolio, gemeinsame Capabilities, Standards, Transition und die Qualität kritischer Entscheidungen. Der Titel allein reicht nicht. Ich kläre Mandat und Entscheidungsrechte gegenüber CTO, Enterprise Architecture, Security, Product und Delivery und sorge dafür, dass Strategie in sichere, wirtschaftliche Delivery übersetzt wird.

### 2. Wie verhindern Sie einen Architektur-Elfenbeinturm?

**Modellantwort:** Jede Strategierichtung braucht ein konkretes Capability-Problem, einen Referenzpfad, Teamfeedback, Betriebssignale, Kosten und einen Iterationsmechanismus. Ich messe Friction und Adoption und halte Staff/Principal, Domain, Security, SRE und Platform an der Entstehung beteiligt. Standards ohne Nutzbarkeit oder Lifecycle werden geändert oder beendet.

### 3. Wie entscheiden Sie zwischen Build, Buy und Open Source?

**Modellantwort:** Ich beginne mit Capability, Risiko, Differenzierung und Betriebsmodell. Dann bewerte ich TCO einschließlich Integration, Security, Skills, Support, Daten/Identity, Lock-in, Exit, Vertrag und Zeit. Eine reversible Pilotoption ist oft besser als eine voreilige breite Bindung. Procurement, Legal, Security und Finance entscheiden innerhalb ihrer Mandate mit.

### 4. Wie behandeln Sie AI als Teil der Technologiestrategie?

**Modellantwort:** Nicht als generischen Chatbot, sondern als Capability aus Use Case, Datenklasse, Identity, Model-/Retrieval-/Tool-Policy, Evaluation, Safety, Telemetrie, Cost und Operating Model. Ich definiere sichere Read-only-Startpfade und klare Grenzen für Seiteneffekte. Quality, Privacy, Security und Kosten werden gemeinsam mit Nutzerwert bewertet.

### 5. Welche Kennzahlen nutzen Sie für ein Technologieportfolio?

**Modellantwort:** Ich kombiniere Outcome, Delivery, Reliability, Security/Privacy/Safety, Cost, Adoption und technische Schuld/Retirement. Für jede Kennzahl sind Slice, Owner, Schwelle und Entscheidung festgelegt. Eine Metrik wird nicht für individuelles Ranking zweckentfremdet.

### 6. Was tun Sie bei Konflikt zwischen CTO und Enterprise Architecture?

**Modellantwort:** Ich benenne zuerst Entscheidungsobjekt und Mandate. Ich trenne Business-/Budgetpriorität, Architekturdesign, Security-/Legalgrenze und Deliveryumsetzung. Dann liefere ich Optionen mit Wert, Risiko, Kosten, Time-to-Value, Exit und Betriebsfolgen und dokumentiere Accountable Decision, Dissens und Revisit. Wenn Mandate unklar sind, ist das ein Governanceproblem, kein Architekturproblem.

### 7. Wann standardisieren Sie eine Technologie?

**Modellantwort:** Wenn ein wiederkehrender Bedarf, ein relevanter Risk-/Interoperabilitäts-/Betriebsvorteil und ein nachweislich nutzbarer Referenzpfad vorliegen. Ich standardisiere Invarianten stärker als konkrete Tools. Jeder Standard braucht Owner, Template, Tests, Support, Exception, Lifecycle und Deprecation.

### 8. Wie behandeln Sie Legacy-Systeme?

**Modellantwort:** Als Portfolio- und Übergangsthema. Ich mache Source of Truth, Konsumenten, Daten-/Contract-/Securityrisiko, Betriebsaufwand, Migration und Retirement sichtbar. Ein Zielbild ohne Budget, Owners, Wellen und Exit wird nicht als Plan ausgegeben. Manchmal ist kontrollierter Betrieb mit klarer Risikoführung besser als eine unfinanzierte Migration.

### 9. Was aus Ihrer bisherigen Praxis unterstützt diese Rolle, und was nicht?

**Modellantwort:** Eigene belegte technische Fälle, etwa [Projekt/Lernfall] mit Zeitraum, Evidenzart und Grenze, stützen die Architektur- und Implementierungsarbeit. Sie belegen keine Chief-Architect-Funktion, Portfoliomandat, Budget- oder Executive-Verantwortung, Team-/Unternehmensskala oder Produktionsergebnisse. Ich zeige diese Grenzen offen und baue daraus überprüfbare Lernfälle.

### 10. Woran erkennen Sie, dass eine Strategie korrigiert werden muss?

**Modellantwort:** Wenn zentrale Hypothesen nicht durch Adoption, Quality, SLO, Security, Cost oder Outcome gestützt werden; wenn Ausnahmen wachsen; wenn Teams die Fähigkeit nicht unabhängig nutzen können; oder wenn eine neue Risiko-/Markt-/Regeländerung die Annahmen verändert. Korrektur oder Stop ist ein erwarteter Teil verantwortlicher Strategiearbeit.

## Praktisches Lab: Technologieportfolio und Chief-Architecture-Operating-Model

### Ziel und Evidenzgrenze

**Status: reviewed_only.** Die Fallarbeit modelliert keine echte Unternehmensstrategie oder Entscheidungshoheit. Sie verwendet ausschließlich fiktive Stakeholder, synthetische Daten und lokale Artefakte.

Szenario: Eine fiktive Organisation möchte interne Knowledge Assistance und ausgewählte Prozessunterstützung einführen. Gleichzeitig existieren fragmentierte Cloudprojekte, unterschiedliche Telemetrie, unklare Datenowner und wachsende AI-Kosten. Du erstellst ein 18-Monats-Portfolio, nicht einen Produktionsplan.

### Artefakte

```text
chief-architecture-lab/
  technology-strategy-canvas.md
  capability-portfolio.md
  architecture-charter.md
  decision-rights-raci.md
  portfolio-register.yaml
  architecture/
    current-state.md
    target-state.md
    transition-waves.md
  standards/
    trusted-ai-access.md
    telemetry-baseline.md
    exception-template.yaml
  operating/
    decision-gates.md
    metrics-and-thresholds.md
    run-retire-plan.md
  reviews/
    cto-enterprise-delivery-conflict.md
    security-finops-challenge.md
    external-technology-assessment.md
```

### Schritte

1. Formuliere drei Strategyhypothesen mit Wert, Risiko, Capability, Annahme, Evidenz und Stopkriterium.
2. Ordne maximal zehn Initiativen nach `run`, `grow`, `transform`, `explore`, `retire` und `risk reserve`.
3. Baue eine Capability Map für trusted AI, Platform Self-Service, Cloud Economics, Identity/Data und Reliability.
4. Beschreibe Current State, Target State und drei Transition Wellen. Benenne explizit unbekannte Informationen.
5. Schreibe eine RACI für Modellrouting, Cloud Landing Zone, AI Tool Action, Data Contract und Legacy Retirement.
6. Definiere zwei Prinzipien, zwei Standards, einen Guardrail und eine zeitgebundene Ausnahme. Gib jedem Artefakt Test, Owner, Lifecycle und Revisit.
7. Erstelle einen Read-only AI Reference Path mit request contract, policy/degradation, telemetry, cost tag und Auditcorrelation.
8. Definiere ein Chief Dashboard mit maximal zwölf Signalen und einer klaren Entscheidungsfrage je Signal.
9. Simuliere einen Konflikt: CTO will schnelle AI-Ausweitung; Security verlangt Stop; Domain will Autonomie; Finance fordert Kostendeckel; Enterprise Architecture warnt vor Datenduplikation. Dokumentiere Optionen, Mandate, Entscheidung und offene Risiken.
10. Bewerte eine neue externe Technologie als `observe`, `explore`, `adopt` oder `decline`; Quellenkritik, Pilotgrenze, Exit und Disclosure sind Pflicht.
11. Schreibe eine Portfolio-Review-Entscheidung: ein Vorhaben erweitern, eines verengen, eines stoppen und ein Legacy-System in `retire` überführen.

### Negative Gegenproben

| Probe | Erwartete Erkenntnis |
|---|---|
| Eine Initiative hat keinen Owner und kein Stopkriterium. | Portfolio Gate lässt sie nicht als Investment laufen. |
| Ein AI-Pilot erfüllt SLO, besitzt aber keine Daten-/Tool-/Auditkontrolle. | Expansion stoppt trotz positiver Reliability. |
| Ein Standard ist technisch gut, erfordert aber monatelange zentrale Tickets. | Adoption-/Operating-Review fordert Self-Service oder Scopeänderung. |
| Ein Provider lockt mit Preisnachlass, aber Datenexport/Identity sind proprietär. | Exit-/TCO-Analyse verhindert eine reine Preisentscheidung. |
| Domain braucht abweichende Latenz- oder Datenregeln. | Contract/Standardgrenze wird differenziert statt Autonomie pauschal zu blockieren. |
| Legacy Dual Run besitzt keine Source-of-Truth- oder Reconciliation-Regel. | Transition Gate verwirft die Welle als Datenrisiko. |
| Ausnahmen laufen ab, ohne Migration. | Owner muss evidenzbasiert verlängern, migrieren oder retire. |
| Dashboard hat viele Werte, aber keine Entscheidung/Owner. | Metrics Review entfernt oder ergänzt Signale. |
| Rollenmatrix gibt Chief Architect ein Budget-/Legalveto ohne Mandat. | Governance Review korrigiert die Matrix. |
| Externe Quelle ist nur Vendor Marketing. | Technologieassessment bleibt `observe` oder verlangt Primär-/unabhängige Evidenz. |

### Cleanup

Alle Dokumente sind als synthetisch zu kennzeichnen. Lokale Testdaten, Mocks, Flags, Token, Secrets und temporäre Logdateien werden entfernt. Entscheidungen erhalten `proposed`, `rejected` oder `simulated`, niemals den Anschein echter Freigabe. Die abschließende Readme benennt fehlende reale Leadership-, Budget-, Security-, Legal-, Provider-, Betriebs- und Outcome-Evidenz.

## Dependencies und Cross-References

### Direkt vorausgesetzt

- [KB-0002 – Rollen- und Kompetenzmodell](../00-navigation-governance/02-rollen-kompetenzmodell-und-tiefenstufen.md)
- [KB-0004 – Selbsteinschätzung und Evidenzgrenzen](../00-navigation-governance/04-cv-istbild-und-zielkompetenzen.md)
- [KB-0005 – Kompetenzcanvas und Wirkungskette](../00-navigation-governance/05-kompetenzcanvas-und-wirkungskette.md)
- [KB-0006 – Hands-on-, Architect-, Staff- und Chief-Arbeitsmodell](../00-navigation-governance/06-hands-on-architect-staff-chief-arbeitsmodell.md)
- [KB-0009 – Labstrategie, Evidenz und Gegenproben](../00-navigation-governance/09-labstrategie-evidenz-und-gegenproben.md)

### Rollen- und Fachvertiefung

- [KB-0023 – Principal Engineer als Zielrolle](13-principal-engineer-als-zielrolle.md)
- [KB-0024 – Distinguished Engineer als Rollenmodell](14-distinguished-engineer-als-rollenmodell.md)
- [KB-0026 – Grenzen zwischen Enterprise, Solution und Platform](16-grenzen-zwischen-enterprise-solution-und-platform.md)
- KB-0550 – Platform Engineering und Developer Platform
- KB-0565 – Cloud Architecture und Landing Zones
- KB-0612 – Governance, Compliance, Privacy und AI Safety
- KB-0720 – Integrierende Staff-/Principal-/Chief-Architekturpraxis

## Quellen und Aktualitätsnotizen

| Quelle | Verwendung | Stand |
|---|---|---|
| Dateikatalog 720 | Verbindlicher Scope: Technologiestrategie, Standards, Portfolio und Abgrenzung von Entscheidungsrechten. | Planstand 2026-09-14 |
| [ISO/IEC/IEEE 42010:2022](https://www.iso.org/standard/74393.html) | Architecture Description mit Stakeholder, Concern, Viewpoint und View. | Abgerufen 2026-09-15 |
| [NIST AI Risk Management Framework 1.0](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf) | Risikomanagementrahmen für AI-Systeme; keine automatische Rechts-/Compliancefreigabe. | Abgerufen 2026-09-15 |
| [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/) | Nutzerbezogene SLO-/SLI-Entscheidungen und Workloadunterschiede. | Abgerufen 2026-09-15 |
| [Google SRE: Embracing Risk](https://sre.google/sre-book/embracing-risk/) | Error Budget als ein Signal zwischen Reliability und Change. | Abgerufen 2026-09-15 |
| [FinOps Framework](https://www.finops.org/framework/) | Cross-funktionale Cloud-Wert- und Kostenarbeit. | Abgerufen 2026-09-15 |
| [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/) | Gemeinsame Semantik für technische Telemetrie. | Abgerufen 2026-09-15 |
| [Backstage Software Catalog](https://backstage.io/docs/features/software-catalog/) | Katalog-/Ownership-/Lifecycle-Kontext für Platform Capabilities. | Abgerufen 2026-09-15 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — AI Control Planes entwickeln sich von Modellproxys zu integrierten Entscheidungsfähigkeiten.** Moderne AI-Systeme verbinden Model Routing, Daten-/Zweckgrenzen, Retrieval, Tool Policies, Evaluation, Audit, Cost Limits und Degradation. **Reifegrad: Adopting.** Der strategische Nutzen entsteht nur, wenn die Control Plane Domänen nicht enteignet und alle Entscheidungen nachvollziehbar bleiben. Risiken sind Zentralmonolith, nicht überprüfbare Policies, Prompt-basierte Autorisierung und neue Providerabhängigkeit. Ein Pilot beginnt mit Read-only-Workflows, serverseitigen Claims, negativer Toolprobe und klarer Exit-Architektur. Quelle: [NIST AI RMF](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf).

**Stand 2026-09-15 — FinOps wird für AI- und Plattformportfolios zu einem Architecture-Feedback-System.** Token-, Retrieval-, Inference-, Netzwerk-, Speicher-, Human-Review- und Transitionkosten müssen gegen Qualität, Sicherheit und abgeschlossenen Nutzerwert gelesen werden. **Reifegrad: Adopting.** Das ermöglicht Workloadrouting und Capability-Investitionen mit besserer Evidenz. Risiken sind unvollständige Attribution, Scheinpräzision und Kostenoptimierung ohne Quality-/Safety-Grenze. Ein Pilot misst Cost per qualified outcome und macht unzureichende Tags, Ausreißer und fehlende Owner sichtbar. Quelle: [FinOps Framework](https://www.finops.org/framework/).

**Stand 2026-09-15 — Machine-readable Architecture Decision Data kann Strategie in eine lernende Steuerung überführen.** Wenn ADRs, Contracts, Ausnahmen, Catalog-Owner, SLO-/Incident-/Cost-Signale und Lifecycle strukturiert verknüpft sind, lassen sich Portfoliohypothesen gezielter revidieren. **Reifegrad: Emerging bis Adopting.** Risiken sind Metrics Theater, unzulässige personenbezogene Überwachung, falsche Kausalität und veraltete Metadaten. Ein Pilot verbindet wenige Entscheidungen mit datensparsamen Signals, klarer Aufbewahrung, Owner und Revisit-Frage; er automatisiert keine formale Governancefreigabe. Quellen: [ISO/IEC/IEEE 42010](https://www.iso.org/standard/74393.html), [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/).

