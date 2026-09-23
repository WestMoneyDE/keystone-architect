---
{"id": "KB-0027", "title": "Architekturartefakte nach Rollenbedarf", "domain": "01", "sequence": 17, "document_type": "role", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0002", "concepts": ["Rollen-Kompetenz-Matrix", "Tiefenstufen", "Nachweisarten"], "needed_for": "understanding"}, {"id": "KB-0004", "concepts": ["Evidenzgrenzen", "zulässige Aussagen", "Zielkompetenzen"], "needed_for": "understanding"}, {"id": "KB-0005", "concepts": ["Kompetenzcanvas", "Entscheidungsreichweite", "Wirkungskette"], "needed_for": "understanding"}, {"id": "KB-0006", "concepts": ["Hands-on-Tiefe", "Architekturnachweis", "Spezialistenübergabe"], "needed_for": "understanding"}, {"id": "KB-0009", "concepts": ["Labstrategie", "Gegenprobe", "Evidenzgrenze"], "needed_for": "lab"}], "related": ["KB-0011", "KB-0013", "KB-0014", "KB-0015", "KB-0016", "KB-0017", "KB-0019", "KB-0022", "KB-0023", "KB-0025", "KB-0026", "KB-0028", "KB-0550", "KB-0565", "KB-0612", "KB-0720"], "applies": ["KB-0550", "KB-0565", "KB-0612", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Artefaktpaket für einen begrenzten AI-/Plattformfall wird als Context View, Decision Record, Contract, Runbook, Roadmap, Evidence Register und Review Gate erstellt.", "rationale": "Die Qualität eines Artefakts wird durch seine konkrete Entscheidungs- und Deliverywirkung sichtbar."}, "ARCHITECT-TARGET": {"active": true, "scope": "Zielgruppen, Concerns, Ansichten, Detailtiefe, Risiken, Qualitätsattribute, Owner und Aktualisierungssignale werden pro Artefakt explizit gewählt.", "rationale": "Architekturkommunikation ist modellierte Entscheidungsunterstützung, keine Dokumentproduktion."}, "STAFF-TARGET": {"active": true, "scope": "Teams erhalten kleine, umsetzbare Verträge, Referenzpfade, Templates, Tests und Runbooks statt unverbundener Diagrammsammlungen.", "rationale": "Artefakte skalieren Wirkung nur, wenn sie technische Delivery und Betrieb vereinfachen."}, "CHIEF-TARGET": {"active": true, "scope": "Strategie, Portfolio, Risiko, Transition und Investitionsentscheidung werden auf entscheidungsrelevante, nicht irreführend vereinfachte Evidenz verdichtet.", "rationale": "Chief-Level benötigt nachvollziehbare Optionen, Auswirkungen, Annahmen und Revisit-Trigger statt Detailimplementierung."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Security, Privacy, Legal, Finance, Data, Network, GPU, Operations, Accessibility und Domänenspezialisten erstellen oder prüfen ihre fachlichen Artefakte gemeinsam mit Architektur.", "rationale": "Ein Architekturartefakt darf fachliche Freigabe oder unabhängige Prüfung nicht simulieren."}}, "lab_validation": [{"lab_id": "KB-0027-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Nicht produktive Dokumenten- und Mock-Fallarbeit für eine sichere AI-Knowledge-Assistance", "evidence": "Das Lab definiert Empfänger, Concerns, Context-/Runtime-/Deployment-Ansichten, ADR, Contract, Roadmap, Review-Gate, Aktualisierungssignale, Gegenproben und Cleanup.", "limitations": "Keine realen Teams, Kundendaten, Gremien, Budgets, Providerkonten, Produktionssysteme oder externen Freigaben wurden beansprucht oder verändert."}]}
---
# Architekturartefakte nach Rollenbedarf

> **Leitprinzip:** Architekturartefakte existieren, damit eine bestimmte Person oder Gruppe eine bestimmte Entscheidung sicherer treffen oder umsetzen kann. Ein Dokument ohne Empfänger, Concern, Owner, Aktualisierungssignal und Nutzung ist Dokumentationstheater.

## Purpose, Definition und Scope

Architekturkommunikation scheitert häufig an zwei Gegensätzen: Manche Teams erhalten eine unüberschaubare Diagramm- und Dokumentmenge; andere erhalten ein attraktives Zielbild, das wichtige Risiken, Übergänge und Betriebsfolgen verbirgt. Beides erschwert Entscheidungen.

Dieser Artikel ordnet Zielbilder, Entscheidungsvorlagen, Roadmaps, Verträge, Runbooks, Evidenzregister und Architekturansichten den jeweiligen Empfängern zu. Er definiert die Detailtiefe anhand der Entscheidung und nicht anhand eines starren Dokumentstandards. Ein CTO, ein Product Owner, ein Security Reviewer, ein Platform Team und ein Service-Operator brauchen nicht dieselbe Darstellung – aber ihre Darstellungen dürfen sich nicht widersprechen.

Der Scope umfasst besonders GenAI-, Plattform-, Enterprise- und Cloud-Entscheidungen. Dort muss ein Artefakt häufig zugleich Datenfluss, Identity, Policy, Modellroute, Kosten, Qualität, Latenz, Delivery und Audit berücksichtigen. Die richtige Antwort ist nicht ein riesiges Masterdiagramm, sondern ein verknüpftes, versioniertes Artefaktset mit klarer Quelle und Aktualisierung.

### Lernziele

Nach diesem Kapitel kannst du:

1. für jede Architekturfrage Empfänger, Concern, Entscheidung, Evidenz und passende Sicht bestimmen;
2. zwischen Zielbild, Decision Record, Contract, Referenzimplementierung, Roadmap, Runbook und Evidenzregister unterscheiden;
3. Details so wählen, dass Entscheidungsrisiko sichtbar wird, ohne Nutzer mit Implementierungsdetails zu überlasten;
4. Aktualisierungspflichten aus Changes, Incidents, SLO-/Cost-/Securitysignalen statt aus Kalenderpflichten ableiten;
5. AI-, Platform-, Enterprise- und Cloud-Artefakte über Traceability und klare Owner verbinden;
6. eine Fallarbeit erstellen, die technische Grenzen und offene Annahmen transparent macht.

## Kompetenzstatus und Evidenzgrenzen

| Aussageebene | Gültige Einordnung |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | ISO-orientierte Concern-/View-Struktur, ADRs, Contracts, Roadmaps, Runbooks und Evidenzketten können modelliert und kritisch geprüft werden. |
| HANDS-ON-TARGET | Ein vollständiges, synthetisches Artefaktpaket mit Contract- und Failure-Gegenproben wird praktisch aufgebaut. |
| ARCHITECT-TARGET | Empfänger, Entscheidung, Scope, Qualitätsattribute, Daten-/Control-Flow, Risiken, Owner und Change Trigger sind pro Artefakt erkennbar. |
| STAFF-TARGET | Artefakte werden zu Templates, Tests, Golden Paths und Reviews, die Teams selbständig verwenden können. |
| CHIEF-TARGET | Strategie-/Portfolio-/Risikoentscheidungen erhalten verdichtete, ehrliche Optionen und Transitionsevidenz. |
| SPECIALIST-OPTIONAL | Fachliche Gutachten und Freigaben bleiben durch die zuständigen Spezialisten prüfbar und werden nicht durch Architekturdokumente ersetzt. |

## Mental Model: Artefakt als gerichtete Linse

Eine Kameraaufnahme kann ein ganzes Gebäude zeigen; ein Elektriker braucht trotzdem einen Stromlaufplan. Ein Architekturartefakt ist eine **gerichtete Linse** auf ein System. Es blendet bewusst Details aus, die für eine Entscheidung nicht relevant sind, und zeigt Details, die sonst zu Schaden, Verzögerung oder falscher Investition führen.

```text
System reality
     |
     +--> stakeholder concern
               |
               +--> view / artifact
                         |
                         +--> decision, implementation or operation
                                   |
                                   +--> evidence / change signal
                                               |
                                               +--> artifact revision
```

Eine „Single Source of Truth“ ist nicht zwingend eine einzelne Datei. Sie ist eine klar zugeordnete Quelle pro Aussage: Contract im Repository, aktuelle Ownership im Katalog, Betriebsstatus im Monitoring, Architekturentscheidung im ADR, Zielrichtung im Strategy Record. Ein Diagramm darf auf diese Quellen verweisen, aber nicht heimlich widersprechende Kopien erzeugen.

## Prerequisites und Dependencies

| Grundlage | Anwendung |
|---|---|
| KB-0002 Rollen- und Kompetenzmodell | Empfänger, Wirkungstiefe und Nachweisart präzisieren. |
| KB-0004 Selbsteinschätzung und Evidenzgrenzen | Beispiele nicht als reale formale Abnahme oder Betriebsresultat ausgeben. |
| KB-0005 Kompetenzcanvas | Artefakte mit Outcome, Annahme, Evidenz, Entscheidung und Grenze verbinden. |
| KB-0006 Hands-on bis Chief | Von Contract/Test bis Portfoliooption passende Detailtiefe bestimmen. |
| KB-0009 Labstrategie | Artefakte mit Gegenprobe, Cleanup und Aussagegrenze bauen. |
| KB-0026 Grenzen zwischen Enterprise, Solution und Platform | Architekturansichten den richtigen Rollen und Übergaben zuordnen. |

## Core Concepts

### 1. Der Artefaktvertrag

Vor dem Erstellen beantwortet der Autor:

```yaml
artifact:
  title: "AI access contract decision record"
  audience: ["domain owner", "platform owner", "security reviewer"]
  decision: "adopt bounded read-only contract or stop"
  concern: ["tenant isolation", "purpose", "audit", "latency", "cost"]
  scope: "one workflow and one reusable contract"
  owner: "named DRI"
  source_of_truth: "repository path / system record"
  evidence: ["contract test", "negative tenant test", "SLO/cost threshold"]
  update_when: ["schema change", "policy change", "incident", "revisit date"]
  does_not_prove: ["legal approval", "production safety", "portfolio approval"]
```

Ohne diesen Vertrag werden Dokumente oft gesammelt, ohne dass jemand sie nutzt oder pflegt.

### 2. Artefakte und ihre Arbeit

| Artefakt | Empfänger | Hauptfrage | Detailtiefe | Veraltet bei |
|---|---|---|---|---|
| Zielbild / Target Architecture | Chief, Enterprise, Portfolio, Plattform-/Produktführung | Welchen Zustand und welche Capabilities wollen wir erreichen? | Fähigkeiten, Grenzen, Prinzipien, Zielqualitäten, keine Klassendetails | Strategiewechsel, Capability-/Risk-/Sourcingänderung |
| Context View | Domain, Solution, Security, Team | Wer interagiert mit wem über welche Trust Boundary? | Systeme, Actors, Datenklasse, externe Abhängigkeiten | neue Integrationen, Owner, Datenklasse |
| Runtime/Data Flow | Entwickler, SRE, Security, Solution | Wie verhält sich ein Request in Erfolg und Fehler? | Sequenz, Authz, Daten, Retry, Timeout, Degradation | Ablauf-, Provider-, Policy-, Failureänderung |
| ADR / Decision Record | Entscheider, Reviewer, spätere Maintainer | Welche Option wurde warum gewählt und wann wird sie revisited? | Optionen, Kriterien, Annahmen, Folgen, Owner, Trigger | neue Evidenz oder Trigger, nicht jede Codezeile |
| API/Event Contract | Producer, Consumer, Plattform, Testautomation | Was ist interoperabel und kompatibel? | Schema, Semantik, Version, Fehler, Security, Ownership | Contract-/Consumeränderung |
| Reference Path / Template | Delivery Team | Wie implementiere ich den sicheren Standardfall? | ausführbarer Start, Tests, Defaults, Grenzen | Tool-/Policy-/SLO-/Lifecycleänderung |
| Runbook | Operator, On-call, Support | Was tun wir bei bestimmtem Fehler? | Trigger, Diagnose, sichere Aktion, Eskalation, Kommunikation | Incident, Operation-/Topology-/Owneränderung |
| Roadmap / Transition Plan | Enterprise, Product, Program, Finance | Welche Welle, Abhängigkeit, Kosten und Entscheidung folgen? | Sequenz, Outcome, Risiko, Owner, Gate | Portfolio-/Budget-/Dependency-/Outcomeänderung |
| Evidence Register | Governance, Audit, Architecture, Owner | Welche Behauptung stützt welche Quelle und Grenze? | Claim, Quelle, Datum, Scope, Recheck | Quellen-/System-/Policywechsel |

### 3. Detailtiefe folgt dem Schaden einer falschen Entscheidung

Ein Executive benötigt keine Kubernetes-Manifest-Details, aber er oder sie braucht Varianten, Risiko, Investition, TCO, Transition, Exit und die Verantwortlichkeit. Ein Team benötigt keine 40-seitige Portfoliohistorie, aber ein präzises Contract-, Fehler- und Runbookmodell.

Ein guter Test lautet: *Wenn dieses Detail fehlt, welche falsche Entscheidung oder unsichere Umsetzung wird wahrscheinlicher?* Nur dann gehört es in die jeweilige Sicht.

### 4. Traceability ohne Bürokratiefalle

Traceability heißt nicht, jeden Satz mit zehn Links zu überladen. Für eine kritische Behauptung muss jedoch der Weg sichtbar sein:

```text
Business / risk objective
      -> architecture principle
      -> decision record
      -> contract / guardrail / implementation
      -> test / runtime signal / audit evidence
      -> review and revision
```

Beispiel: „Toolactions bleiben domainautorisiert“ → Prinzip → ADR → API Contract/SDK → negativer Confused-Deputy-Test → Audit Event → Incident-/Review Trigger.

### 5. Aktualisierung nach Ereignis

Kalenderreviews bleiben nützlich, aber allein veralten sie schnell. Aktualisierungstrigger können sein:

- neue Datenklasse, Region, Nutzergruppe oder gesetzliche Vorgabe;
- API-/Event-Breaking Change, neuer Consumer oder neuer System of Record;
- neue Modellroute, Toolaction, Provider oder Prompt-/Evaluation-Policy;
- Sicherheits-, Privacy-, Audit- oder Supply-Chain-Befund;
- SLO-Burn, Incident, Degradation, Capacity-/Cost-Anomalie;
- Ablauf einer Ausnahme oder eines Standards;
- Portfolio-/Prioritäten-/Ownerwechsel;
- Lab- oder Productionevidenz, die Annahmen widerlegt.

## Architecture und Data Flow: Artefaktset für sichere Knowledge Assistance

Der Fall ist synthetisch: Ein internes Supportteam möchte zitierfähige Wissensantworten. Es gibt keinen realen Produktionsanspruch.

### Empfängerkarte

```text
Chief / Enterprise: capability, investment, risk, transition
           |
           v
Solution / Domain: workflow, outcome, data, NFR, authorization
           |
           v
Platform / SRE: contract, route, SLO, cost, operation
           |
           v
Security / Privacy: control objective, evidence, escalation
           |
           v
Delivery: template, API, test, runbook, telemetry
```

### Verknüpfte Artefakte

| Reihenfolge | Artefakt | Liefert an |
|---|---|---|
| 1 | Capability-/Context View | Enterprise/Solution verstehen Nutzen, Domain und Trust Boundaries. |
| 2 | Problem Frame und NFR | Solution beschreibt Nutzer, Nichtziel, Datenklasse, SLO/Cost/Safety. |
| 3 | ADR | Optionen: direkt integrieren, Plattformcontract, verschieben; Owner und Gate. |
| 4 | Platform Contract | Identity/Purpose, policy ref, model/retrieval route, trace/cost correlation. |
| 5 | Runtime Flow | Erfolg, denied, timeout, retrieval miss, human escalation. |
| 6 | Template/Contract Tests | Delivery baut sichere Defaults und negative Proben ein. |
| 7 | Runbook / Dashboard | Platform/SRE/Domain reagieren auf Nutzer-/Betriebs-/Policy-Signal. |
| 8 | Transition Roadmap | Enterprise/Chief entscheidet Adoption, Investition, Retirement. |
| 9 | Evidence Register | Jede Aussage zeigt Quelle, Datum, Scope und Recheck. |

### Runtime Sicht

```text
user -> domain support app -> server-side identity/purpose validation
       -> platform access contract -> policy decision
       -> approved retrieval/model route -> cited response
       -> domain UI or human escalation

all controlled steps -> trace/cost correlation -> data-minimized telemetry
policy denial / timeout / missing citation -> safe abstention or fallback
```

Ein einziger Diagrammtyp kann diesen Ablauf nicht für alle Empfänger ausreichend darstellen. Die Context View zeigt Trust Boundaries, der Runtime Flow zeigt Fehlerpfade, der Contract zeigt Felder und Fehlercodes, das Runbook zeigt Reaktion, und die Roadmap zeigt Transition.

## Protokolle, Standards und Technologien

| Gegenstand | Zweck im Artefaktset |
|---|---|
| ISO/IEC/IEEE 42010 | Stakeholder, Concern, Viewpoint und View strukturieren die Auswahl der Darstellung. |
| OpenAPI | Solution-/Platform-API-Verträge werden maschinenlesbar, versionierbar und testbar. |
| AsyncAPI | Event-/Nachrichtenverträge erhalten Semantik, Ownership und Kompatibilität. |
| OpenTelemetry | Runtime-, Cost- und Fehlerartefakte teilen datensparsame Semantik. |
| Service Catalog | Komponenten-, Owner- und Lifecycle-Artefakte werden auffindbar. |
| NIST AI RMF | AI-Risiko-Claims bleiben an Use Case, Fähigkeit und Kontrolle gebunden. |
| SLO / Error Budget | Betriebsartefakte erhalten Nutzer-/Workload-Signale und klare Entscheidungsgrenzen. |
| FinOps Framework | Roadmaps und Architekturentscheidungen betrachten Kosten als Wert-/Risikoevidenz. |

## Konfiguration und Implementierung: Minimaler Artefaktkatalog

### 1. Repositorystruktur

```text
architecture/
  context.md
  runtime-flow.md
  target-and-transition.md
  decisions/ADR-001-ai-access-contract.md
  contracts/ai-request.openapi.yaml
  events/audit.asyncapi.yaml
  platform/golden-path.md
  operations/runbook-provider-timeout.md
  operations/telemetry-profile.md
  roadmap.md
  evidence-register.md
```

Eine Struktur ist nur dann sinnvoll, wenn das Team sie im Deliveryfluss aktualisieren kann. Contract und Template gehören nahe an Code/Tests; Strategie- und Portfoliokontext kann in einem kontrollierten Architektur-/Planungsbereich liegen. Vermeide Kopien desselben Schemas in Wiki, Slide und Repository.

### 2. Zielbild für Entscheider

```markdown
## Decision
Invest a bounded shared AI access capability for two read-only workflows.

## Why now
Repeated tenant/purpose/audit controls and fragmented cost/observability.

## Options
Direct integrations | central monolith | federated contract | defer.

## Recommendation
Federated contract with domain authorization and a platform-operated safe default.

## Evidence needed
Negative policy tests; acceptable SLO/quality/cost; two low-friction adoptions.

## Risks and non-goals
No autonomous actions; no central domain-data ownership; no legal approval claimed.

## Revisit
At adoption gate or security/cost/SLO threshold.
```

### 3. Contract für Teams

```yaml
components:
  schemas:
    AIRequest:
      required: [request_id, tenant_id, purpose, data_classification, operation]
      properties:
        request_id: {type: string}
        tenant_id: {type: string, description: "server-side validated"}
        purpose: {type: string, description: "server-side validated or derived"}
        data_classification: {type: string}
        operation: {type: string, enum: [answer, summarize]}
```

Der Contract darf keine fachliche Autorisierung verstecken. Es muss dokumentiert sein, welche Felder von einem vertrauenswürdigen System abgeleitet, welche nur akzeptiert und welche abgewiesen werden.

### 4. Aktualisierung als Deliveryregel

```yaml
update_rules:
  contract: "PR + compatibility test + consumer notification"
  runtime_view: "change to control flow, dependency or degradation"
  runbook: "incident drill or operational topology/owner change"
  roadmap: "decision gate, material dependency/cost/risk change"
  ADR: "new evidence meets a recorded revisit trigger"
  catalog: "ownership or lifecycle change"
```

## Scalability und Performance

Dokumentation hat auch Skalierungsgrenzen. Wenn jedes Team jeden Artefakttyp manuell erstellt, entsteht Papierarbeit. Wenn nichts standardisiert wird, entstehen unentdeckte Inkompatibilitäten.

| Skalierungshebel | Nutzen | Gefahr |
|---|---|---|
| Templates | sichere Wiederholung, schnellere Onboardingzeit | unpassende Kopie ohne Verständnis |
| Contract generation/tests | konsistente Producer-/Consumergrenze | nur Schema, keine Fachsemantik |
| Catalog metadata | Ownership/Lifecycle auffindbar | veraltete Daten als Wahrheit |
| ADR taxonomy | Entscheidungen vergleichbar | Entscheidungen werden zu ritualisierten Kurztexten |
| Diagram-as-code | Versionierung und Review | Komplexität für kleine Fälle |
| Automated evidence links | Traceability | falscher Schluss, dass Link Gleichheit zu Freigabe bedeutet |
| Portfolio dashboard | Übersicht über Übergänge/Risiken | Details und Unsicherheit werden verdeckt |

### Performance eines Artefakts

Ein gutes Artefakt ist schnell auffindbar, schnell verständlich und schnell korrekt zu ändern. Kennzahlen:

- Zeit, bis ein Team den relevanten Contract/Owner/Runbook findet;
- Anzahl Fehler, die Contract/Test vor Integration fängt;
- Decision Lead Time bei vollständiger Evidenz;
- Alter ungültiger Owner-/Lifecycle-/Exceptiondaten;
- Verhältnis von wiederverwendeten Templates zu Sonderdokumenten;
- Friction bei Änderung eines Contract oder einer Policy;
- Anteil kritischer Incidents mit aktualisiertem Runbook/ADR.

## Reliability und Failure Modes

| Fehlermodus | Ursache | Erkennung | Behandlung |
|---|---|---|---|
| Diagram drift | Diagramm kopiert Runtime, wird nicht aktualisiert. | Incident widerspricht Ansicht. | Source of truth verlinken, Change trigger, veraltete Ansicht kennzeichnen. |
| ADR amnesia | Entscheidung ohne Annahmen/Revisit. | Teams fragen dieselbe Frage erneut. | Optionen, Kriterien, Owner, Datum und Trigger ergänzen. |
| Over-documentation | Artefaktmenge übersteigt Nutzerwert. | Teams umgehen/ignorieren sie. | Empfänger/Concern prüfen, Artefakte zusammenführen/retire. |
| Under-specification | Zielbild ohne Contract/Failure/Owner. | späte Integration-/Security-/Betriebsprobleme. | detaillierten Übergabe-/Runtimeartefakt hinzufügen. |
| Contradictory truth | Wiki, code, catalog und slide widersprechen. | Review/Incident zeigt Divergenz. | authoritative source pro Claim, Copies reduzieren. |
| Stale roadmap | Roadmap ignoriert aktuelle Cost/Risk/Dependencies. | verspätete Escalations. | gates und aktualisierungssignale operationalisieren. |
| Audit theatre | Evidence Register enthält Quellen, aber keine Kontrollwirksamkeit. | Test/Audit lückenhaft. | Claim, Control, Test, Scope und Grenze verknüpfen. |
| Sensitive leakage | Diagramm/log enthält vertrauliche Daten. | Privacy/Security finding. | Klassifikation, redaction, Zugriff, sichere abstrahierte Darstellung. |

### Degradation eines Artefaktsystems

Auch ohne perfekte Dokumentation muss sicher gehandelt werden können. Ein Runbook verweist auf aktuelle Dashboards, nicht auf Screenshotwerte. Wenn Owner unklar ist, definiert das Incident-/Governance-Modell einen Eskalationspfad. Wenn Contract oder Policy unklar sind, ist der sichere Default bei riskanten Seiteneffekten `deny` oder `read-only`, bis die Entscheidung geklärt ist.

## Security, Governance und Compliance

Artefakte selbst können Sicherheitsobjekte sein:

- Architecture Views zeigen Trust Boundaries, aber keine Secrets, Zugangstoken oder unnötige personenbezogene Daten.
- Contractdokumentation erklärt Datenklasse, Zweck, Authentisierung, Autorisierung, Rate Limits, Fehler und Audit, nicht nur Happy Path.
- Decision Records dokumentieren, welche Security/Privacy/Legal-Frage offen oder entschieden ist; sie behaupten keine Freigabe.
- Evidenzregister speichern Quellenstand, Zugriffsschutz, Aufbewahrung und Recheck. Sie dürfen keine besonders schutzwürdigen Rohdaten als „Nachweis“ kopieren.
- Runbooks unterscheiden technische Sofortmaßnahme, Security Incident, Datenschutzereignis und Facheskalation.

### Reviewmatrix

| Artefakt | Fachreview mindestens |
|---|---|
| AI Use-Case-/Riskrecord | Domain, Security, Privacy, ggf. Legal/Risk |
| API/Event Contract | Producer, Consumer, Platform, Security bei sensitiven Daten |
| SLO/Runbook | Solution Owner, SRE/Platform, Support |
| Cost/roadmap | Product/Domain, Finance/FinOps, Platform/Enterprise |
| Architecture target/transition | betroffene Domain, Enterprise/Solution/Platform, Security/Operations |
| External publication | Verantwortliche Freigabe für Disclosure/IP/Security |

## Observability und Troubleshooting

### Artefakttelemetrie

Nicht jede Dokumentansicht braucht Telemetrie. Für kritische technische Claims können jedoch Systemsignale die Aktualität bestimmen:

```text
contract change -> CI compatibility result
incident -> runbook/ADR review task
policy denial -> data/control-flow view check
SLO breach -> runtime/degradation and roadmap gate
cost anomaly -> unit economics/route and portfolio review
exception expiry -> standard/transition decision
owner change -> catalog and escalation review
```

### Troubleshooting: „Welches Artefakt fehlt?“

1. Benenne die blockierte Entscheidung oder den wiederkehrenden Fehler.
2. Bestimme Empfänger, Concern, Scope und Schaden einer falschen Entscheidung.
3. Prüfe, ob es eine autoritative Quelle gibt und ob sie aktuell ist.
4. Wenn Team nicht implementieren kann: Contract/Template/Runtime/Runbook fehlt.
5. Wenn Entscheider Optionen nicht bewerten kann: Target, transition, cost/risk/owner oder evidence fehlt.
6. Wenn Security/Privacy keine Prüfung durchführen kann: Daten-/Trust-/Control-/Auditansicht fehlt.
7. Wenn Roadmap nicht weiterkommt: dependency, owner, funding/decision gate oder Retirementartefakt fehlt.
8. Erstelle das kleinste Artefakt, das die Entscheidung sicherer macht; keine Artefaktsammlung als Reflex.

### Troubleshooting: „Das Diagramm zeigt Erfolg, die Produktion zeigt Fehler“

Behandle das als Architekturdefekt, nicht als Kommunikationsproblem. Vergleiche Diagramm und aktuelle Trace, Contract, Deployment, Catalog Owner, Incident und Runbook. Entscheide, welche Quelle autoritativ ist. Aktualisiere die Sicht oder markiere sie explizit als historisch. Ergänze den Change Trigger, der den Drift hätte verhindern sollen.

## Cost und FinOps

Architekturartefakte beeinflussen Kosten, weil sie Shared Capabilities, Workloadverhalten, Lock-in, Transition, Support und Retirement sichtbar machen. Die Artefakterstellung selbst braucht ein Kostenlimit: Ein zehnköpfiges Team sollte keine Wochen in Diagramme investieren, die keine Entscheidung verändern.

| Artefakt | Cost-/FinOps-Nutzen |
|---|---|
| Capability map | verhindert doppelte Plattforminvestitionen und zeigt Shared Cost/Owner. |
| Solution NFR/Runtime | verbindet Token/Compute/Netz/Retrievalkosten mit Nutzerlatzenz und Qualität. |
| ADR | dokumentiert Exit-, Migrations-, Lizenz- und Opportunitykosten der Optionen. |
| Roadmap | macht Dual Run, Migration, Training und Retirement finanzierbar. |
| Contract/Template | senkt Integrations-/Fehler-/Supportkosten, wenn es wirklich genutzt wird. |
| Dashboard/Evidence | erkennt Cost anomaly, Budget Burn und fehlende Attribution vor breiter Expansion. |

Der FinOps Framework liefert den kollaborativen Rahmen; ein Artefakt ersetzt keine Finanz- oder Beschaffungsentscheidung.

## Trade-offs und Anti-Patterns

| Trade-off | Schlechte Vereinfachung | Besserer Umgang |
|---|---|---|
| Übersicht / Präzision | ein riesiges Diagramm | mehrere verknüpfte Concern-Views mit klarer Zielgruppe |
| Standard / Flexibilität | Dokumenttemplate für alles | minimaler Artefaktvertrag, risikobasierte Tiefe |
| Aktualität / Aufwand | alles täglich aktualisieren | klare Change-/Incident-/Decision Trigger |
| Traceability / Lesbarkeit | Link-/Metadata-Überladung | kritische Claims mit gezielter Evidenzkette |
| Transparenz / Schutz | alle Daten in Diagramme | Klassifikation, Abstraktion, Zugriff und Redaction |
| Executive summary / Wahrheit | Risiken ausblenden | klare Optionen, Unsicherheit und Revisit, weiterführende Quellen |
| Automatisierung / Urteil | generierte Dokumente ungeprüft veröffentlichen | Reviews, Source of Truth, Change policy und technische Tests |

**Anti-Patterns:**

- Das Zielbild wird als konkrete Produktionsarchitektur gelesen.
- Eine ADR wird nach Entscheidung nie wieder geprüft, obwohl Trigger eintreten.
- Ein Contract dokumentiert nur Felder, aber keine Semantik, Fehler, Ownership oder Version.
- Ein Runbook besteht aus „check logs“ ohne sichere Aktion und Eskalation.
- Roadmaps enthalten Termine ohne Abhängigkeit, Owner, Gate oder Stop.
- Ein Service Catalog wird als Echtzeit- oder Autorisierungsquelle behandelt.
- AI-generierte Diagramme/Dokumente werden ohne Source-/Security-/Domainreview übernommen.
- Architekturartefakte behaupten Security/Legal/Finance-Freigabe ohne zuständiges Evidence.

## Staff-, Principal- und Chief-Level Decisions

| Ebene | Artefaktbedarf |
|---|---|
| Hands-on/Senior | Code-nahe Contract, Test, trace, runbook und lokale ADR. |
| Staff | Referenzpfad, Context/Runtime View, Working Agreement, Adoption-/Failureevidenz für mehrere Teams. |
| Principal | Target/transition, Program Decision Record, dependency map, waves und cross-team risk/owner. |
| Chief | Capability portfolio, Strategieoptionen, Standards-/Operating Model, Investment/retirement und verdichtete Evidenz. |
| Enterprise Architect | Capability-/Information-/Landscape-/Transition-Views und Prinzipien. |
| Solution Architect | Workflow, NFR, system composition, domain data/control flow, integration/degradation. |
| Platform Architect | Product contract, template, SLO, self-service, lifecycle, support/cost. |

Das gleiche Artefakt kann mehrere Ebenen bedienen, aber seine Abschnitte und Links müssen die unterschiedlichen Concerns erkennbar halten.

## Production Checklist

### Artefaktvertrag und Ownership

- [ ] Empfänger, Entscheidung, Concern, Scope, Owner und Source of Truth sind genannt.
- [ ] Nichtziele und Aussagegrenze verhindern Fehlinterpretation.
- [ ] Aktualisierungstrigger sind Change, Incident, Contract, Policy, Owner, Cost/Risk oder Decision Gate zugeordnet.
- [ ] Jede kritische Behauptung hat Evidenz, Datum, Scope und Recheck.
- [ ] Dokumente sind auffindbar und zugriffsgerecht geschützt.
- [ ] Widersprüchliche Kopien sind entfernt oder klar als historisch gekennzeichnet.

### Architektur und Delivery

- [ ] Context, Runtime, Deployment/Operation und Transition zeigen passende Concern-Views.
- [ ] API/Event Contracts haben Semantik, Version, Kompatibilität, Ownership und Tests.
- [ ] AI-/Daten-/Toolgrenzen sind als Control Flow, nicht nur als Text, sichtbar.
- [ ] Golden Path und Template sind für ein Team ohne Dauerberatung nutzbar.
- [ ] Runbook enthält Trigger, Diagnose, sichere Aktion, Eskalation, Kommunikation und Follow-up.
- [ ] Roadmap enthält Capability, Welle, Dependency, Owner, Kosten/Risiko, Gate und Exit.

### Risiko, Kosten und Review

- [ ] Security/Privacy/Legal/Finance-Fragen sind fachlich zugeordnet, nicht implizit freigegeben.
- [ ] Telemetrie ist datensparsam, aktuell, mit Entscheidung und Owner verknüpft.
- [ ] SLO, Safety, Policy, Audit, Cost und Adoption können eine Entscheidung revidieren.
- [ ] Artefaktumfang passt zu Risiko, Reversibilität und Empfänger.
- [ ] Unabhängige technische, Security-, Privacy-, Operations- und ggf. Legalreviews sind vor echter Produktion vorgesehen.
- [ ] Eigene belegte Evidenz, konzeptionelle Annahme, Lab und Zielkompetenz bleiben getrennt.

## Interviewfragen mit Modellantworten

### 1. Woran erkennen Sie ein gutes Architekturartefakt?

**Modellantwort:** Es unterstützt eine klar benannte Entscheidung oder Umsetzung für einen klaren Empfänger. Es zeigt relevante Risiken, Grenzen, Owner, Evidenz und Aktualisierungstrigger. Es ist nicht gut, weil es groß oder grafisch attraktiv ist, sondern weil ein Team oder Entscheider nach seiner Nutzung sicherer handeln kann.

### 2. Warum reichen C4- oder Kontextdiagramme nicht?

**Modellantwort:** Sie können sehr hilfreich für Struktur und Abhängigkeiten sein, beantworten aber nicht zwingend Runtimefehler, Daten-/Trustgrenzen, Contractsemantik, SLO, Cost, Betrieb, Transition oder Entscheidungsalternativen. Ich verwende mehrere Ansichten für konkrete Concerns und verknüpfe sie mit den autoritativen Quellen.

### 3. Wie halten Sie Architekturartefakte aktuell?

**Modellantwort:** Nicht nur über fixe Kalendertermine. Ich verknüpfe sie mit Changes an Contract, Policy, Owner, Datenklasse, Provider oder Deployment sowie mit Incident, SLO-/Cost-/Securitybefund und Decision Gates. Wenn eine Ansicht nicht mehr aktuell sein kann, markiere ich sie als historisch und verweise auf die Quelle.

### 4. Wie verhindern Sie Architektur-Overhead?

**Modellantwort:** Ich beginne bei blockierter Entscheidung oder wiederkehrendem Fehler. Dann erstelle ich das kleinste Artefakt mit Empfänger, Concern, Owner und aktualisierbarer Quelle. Templates und Automation helfen bei wiederkehrenden high-risk Grenzen, dürfen aber den Teamkontext nicht verdrängen.

### 5. Was gehört in eine Executive-Entscheidungsvorlage?

**Modellantwort:** Entscheidung, Optionen, Wert, Risiko, Investment, TCO/Exit, Transition, Verantwortlichkeit, offene Annahmen und Revisit-Trigger. Sie braucht keine Implementierungsdetails, aber sie darf relevante Security-, Operations- oder Costfolgen nicht verstecken.

### 6. Wie dokumentieren Sie eine AI-Toolaktion?

**Modellantwort:** Mit Use Case, System-/Trust-Boundary, User/Domain-Autorisierung, structured command, Policy, Human Gate, idempotency, Audit, Degradation, Tests und Incidentweg. Der Prompt wird niemals als Autorisierungsquelle behandelt.

### 7. Was belegt Ihre bisherige Praxis zu Architekturartefakten?

**Modellantwort:** Eigene technische Fälle, etwa [Projekt/Lernfall] mit Zeitraum und Evidenzart, erlauben es, System-/Process-/Runtime-/Integrationsartefakte als Lern- und Implementierungsarbeit auszuarbeiten. Sie belegen ohne weiteren Nachweis keine externe Abnahme, Enterprise-Governance, reale Portfolioentscheidung, Produktions-SLO oder Chief-Verantwortung. Diese Grenzen dokumentiere ich explizit.

## Praktisches Lab: Rollenorientiertes Architecture Evidence Pack

### Ziel und Evidenzgrenze

**Status: reviewed_only.** Erstelle für einen synthetischen Read-only AI-Knowledge-Assistance-Use-Case ein kleines, widerspruchsfreies Artefaktpaket. Keine realen Daten, Secrets, Accounts oder Freigaben verwenden.

### Paket

```text
evidence-pack/
  01-capability-context.md
  02-solution-problem-and-nfr.md
  03-runtime-and-data-flow.md
  04-adr-options-and-decision.md
  05-ai-access-contract.yaml
  06-platform-golden-path.md
  07-runbook-timeout-and-policy-deny.md
  08-transition-roadmap.md
  09-evidence-register.md
  10-review-and-update-triggers.md
```

### Schritte

1. Ordne jedem Artefakt einen Empfänger, eine Entscheidung, einen Concern, Owner, Source of Truth und Update Trigger zu.
2. Zeichne Context und Runtime getrennt, einschließlich Trust Boundaries, Tenant/Purpose, Retrieval/Model Route, Citation, Audit und Degradation.
3. Erstelle eine ADR mit mindestens drei Optionen und klarer Aussage, was nicht entschieden wird.
4. Definiere einen OpenAPI-ähnlichen Contract mit serverseitig validierten Claims und einer fehlersicheren Response.
5. Schreibe negative Contracttests für fremden Tenant, fehlenden Zweck und Toolactionversuch.
6. Definiere für SLO Burn, Provider Timeout, Policy Deny, Cost Anomaly und fehlende Citation jeweils Signal, sichere Nutzerreaktion, Owner, Runbook und Artefaktupdate.
7. Erstelle eine Roadmap mit Explore, Reference Path, Adopt oder Stop; jede Welle hat Evidence Gate und Exit.
8. Führe einen Mockreview aus Sicht von Executive, Domain, Security, SRE und Platform. Notiere, welche Sicht je Rolle fehlt oder zu detailliert ist.
9. Ändere einen Contract. Prüfe, welche Views/Tests/Roadmap/Catalogeinträge aktualisiert werden müssten.
10. Lösche Mocks, synthetische Logs und temporäre Dateien und dokumentiere die Labgrenze.

### Negative Gegenproben

| Probe | Erwartung |
|---|---|
| Executive Summary enthält kein Risiko/Exit/Owner. | Review verlangt Decision Record statt optimistischer Folie. |
| Runtime View enthält Rohprompts oder Secrets. | Security/Privacy Review fordert Abstraktion/Redaction und Zugriffsschutz. |
| Contract ändert breaking, ADR und Consumerwissen bleiben alt. | Compatibility Check und Update Trigger blockieren/markieren Drift. |
| Runbook nennt keine sichere Aktion. | Operationsreview lehnt es ab. |
| Roadmap hat Datum, aber kein Gate/Dependency. | Portfolio-/Programreview erklärt sie nicht ausführbar. |
| Catalogowner ist veraltet. | Ownership wird als unsicher sichtbar, keine automatische Freigabe. |
| SLO ist grün, aber Citation/Policy/Audit fehlt. | Expansion wird nicht akzeptiert. |
| AI-generiertes Diagramm widerspricht Contract. | Source-of-truth Review korrigiert/es verwirft die Darstellung. |

### Cleanup

Alle Dateien als `synthetic`/`reviewed_only` markieren. Lokale Mocks, Testdaten, Logs, Keys und temporäre Artefakte entfernen. Keine echte Freigabe, Compliance, Produktion, Nutzerwirkung oder Rollenverantwortung behaupten.

## Dependencies und Cross-References

### Direkt vorausgesetzt

- [KB-0002 – Rollen- und Kompetenzmodell](../00-navigation-governance/02-rollen-kompetenzmodell-und-tiefenstufen.md)
- [KB-0004 – Selbsteinschätzung und Evidenzgrenzen](../00-navigation-governance/04-cv-istbild-und-zielkompetenzen.md)
- [KB-0005 – Kompetenzcanvas und Wirkungskette](../00-navigation-governance/05-kompetenzcanvas-und-wirkungskette.md)
- [KB-0006 – Hands-on-, Architect-, Staff- und Chief-Arbeitsmodell](../00-navigation-governance/06-hands-on-architect-staff-chief-arbeitsmodell.md)
- [KB-0009 – Labstrategie, Evidenz und Gegenproben](../00-navigation-governance/09-labstrategie-evidenz-und-gegenproben.md)

### Rollen und Anwendung

- [KB-0011 – GenAI Solution Architect](01-genai-solution-architect-als-zielrolle.md)
- [KB-0014 – Platform Architect](04-platform-architect-als-zielrolle.md)
- [KB-0015 – Enterprise Architect](05-enterprise-architect-als-zielrolle.md)
- [KB-0017 – Solution Architect](07-solution-architect-als-zielrolle.md)
- [KB-0026 – Grenzen zwischen Enterprise, Solution und Platform](16-grenzen-zwischen-enterprise-solution-und-platform.md)
- [KB-0028 – Stakeholdermodelle für Architekturrollen](18-stakeholdermodelle-fuer-architekturrollen.md)
- KB-0550 – Platform Engineering und Developer Platform
- KB-0565 – Cloud Architecture und Landing Zones
- KB-0612 – Governance, Compliance, Privacy und AI Safety
- KB-0720 – Integrierende Staff-/Principal-/Chief-Architekturpraxis

## Quellen und Aktualitätsnotizen

| Quelle | Verwendung | Stand |
|---|---|---|
| Dateikatalog 720 | Scope: Zielbilder, Entscheidungsvorlagen, Roadmaps, Detailtiefe und Aktualisierungspflichten. | Planstand 2026-09-14 |
| [ISO/IEC/IEEE 42010:2022](https://www.iso.org/standard/74393.html) | Concern-/View-orientierte Architecture Description. | Abgerufen 2026-09-15 |
| [OpenAPI Specification](https://spec.openapis.org/oas/v3.2.1.html) | Maschinenlesbare API-Contracts. | Abgerufen 2026-09-15 |
| [AsyncAPI Specification](https://www.asyncapi.com/docs/reference/specification/latest) | Asynchrone API-/Eventcontracts. | Abgerufen 2026-09-15 |
| [NIST AI RMF 1.0](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf) | AI-Risiko in Use Case, Capability und Controls. | Abgerufen 2026-09-15 |
| [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/) | Nutzer-/Workload-Signale und Releaseentscheidungen. | Abgerufen 2026-09-15 |
| [FinOps Framework](https://www.finops.org/framework/) | Cross-funktionale Kosten-/Wertarbeit. | Abgerufen 2026-09-15 |
| [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/) | Gemeinsame Telemetriesemantik. | Abgerufen 2026-09-15 |
| [Backstage Software Catalog](https://backstage.io/docs/features/software-catalog/) | Catalog, Ownership und Lifecycle als Artefaktquelle. | Abgerufen 2026-09-15 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — Architecture-as-Code macht Contracts, Diagramme und Decision Links näher an den Deliveryfluss.** Versionierte Diagrammquellen, maschinenlesbare Schemas, ADR-Metadaten und CI-Checks können Drift früher sichtbar machen. **Reifegrad: Established für Contracts/IaC, Adopting für durchgängig verknüpfte Architecture Evidence.** Risiken sind automatisierte Scheingenauigkeit und unlesbare Artefakte. Ein Pilot bindet nur einen Contract, einen Runtime View und einen ADR an konkrete Change Trigger und überprüft, ob die Links tatsächlich eine Entscheidung verbessern.

**Stand 2026-09-15 — AI-gestützte Dokumentation erhöht die Pflicht zu Quellen-, Scope- und Reviewdisziplin.** Modelle können Views, ADR-Entwürfe und Testfälle beschleunigen, aber veraltete Varianten, erfundene Systemdetails oder sensitive Daten vervielfachen. **Reifegrad: Adopting.** Ein robuster Prozess verlangt autoritative Quellen, Human Review, Klassifikation, Change Tests und klare Kennzeichnung der Annahmen. Keine KI-generierte Darstellung ist ohne fachliche Prüfung eine Produktions- oder Complianceevidenz.

**Stand 2026-09-15 — Decision Intelligence verbindet technische Signale mit Revisit-Triggern.** Structured ADRs, Contract Changes, Exception Age, SLO, Incident, Cost und Adoption können Architekturentscheidungen in eine lernende Schleife bringen. **Reifegrad: Emerging bis Adopting.** Risiken sind Metriktheater, Überwachung und falsche Kausalität. Ein Pilot begrenzt sich auf wenige, datensparsame Claims mit Owner, Entscheidung und Ablauf; er ersetzt keine Fach- oder Executivefreigabe.
