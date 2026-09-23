---
{"id": "KB-0029", "title": "Interviewanforderungen der Zielrollen", "domain": "01", "sequence": 19, "document_type": "role", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0002", "concepts": ["Rollen-Kompetenz-Matrix", "Tiefenstufen", "Nachweisarten"], "needed_for": "understanding"}, {"id": "KB-0004", "concepts": ["Evidenzgrenzen", "zulässige Aussagen", "Zielkompetenzen"], "needed_for": "understanding"}, {"id": "KB-0005", "concepts": ["Kompetenzcanvas", "Entscheidungsreichweite", "Wirkungskette"], "needed_for": "understanding"}, {"id": "KB-0006", "concepts": ["Hands-on-Tiefe", "Architekturnachweis", "Spezialistenübergabe"], "needed_for": "understanding"}, {"id": "KB-0009", "concepts": ["Labstrategie", "Evidenz und Gegenproben", "Aussagegrenzen"], "needed_for": "lab"}], "related": ["KB-0011", "KB-0012", "KB-0013", "KB-0014", "KB-0015", "KB-0016", "KB-0017", "KB-0019", "KB-0020", "KB-0021", "KB-0022", "KB-0023", "KB-0025", "KB-0028", "KB-0030", "KB-0720"], "applies": ["KB-0221", "KB-0550", "KB-0565", "KB-0612", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Kandidaten erstellen und üben einen Systemdesign-Fall, eine Coding-/Debugging-Vertiefung, ein Governance-Szenario, Gegenfragen und eine evidenzbegrenzte Projektstory.", "rationale": "Interviewfähigkeit entsteht durch nachvollziehbare technische Urteile, nicht durch auswendig gelernte Titeldefinitionen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Systemgrenzen, Qualitätsattribute, Verträge, Data/Control Flow, Failure Modes, Security, Observability, Kosten und Transition werden in Interviewantworten strukturiert.", "rationale": "Architekturinterviews prüfen meist Denken unter Unsicherheit und konkrete Trade-offs."}, "STAFF-TARGET": {"active": true, "scope": "Mehrteamige Wirkung wird durch Referenzpfade, Decision Records, Konfliktklärung, Adoption und Messung erklärt, ohne Menschen- oder Führungsansprüche zu erfinden.", "rationale": "Staff-Interviews verlangen technische Multiplikatorwirkung mit glaubwürdiger Hands-on-Nähe."}, "CHIEF-TARGET": {"active": true, "scope": "Strategie, Portfolio, Risikotoleranz, Organisations-/Entscheidungsrechte, Investition und externe Abhängigkeit werden als Szenario und Zielkompetenz behandelt.", "rationale": "Diese Interviews bewerten die Fähigkeit, Executive-Entscheidungen vorzubereiten und Grenzen klar zu benennen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Algorithmus-/Coding-Tests, Cloud/GPU-Tiefen, Security, Data, Netzwerk, Recht, Finance und People Leadership werden je ausgeschriebener Rolle gezielt vertieft.", "rationale": "Keine rollenspezifische Interviewerwartung darf pauschal angenommen werden; die Stellenbeschreibung und Rückfragen steuern die Vorbereitung."}}, "lab_validation": [{"lab_id": "KB-0029-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Nicht produktive Interviewfallarbeit mit synthetischem Systemdesign-, Coding/Debugging- und Governance-Szenario", "evidence": "Nur lokal und in begrenztem Umfang geprüft; keine Produktionsaussage.", "limitations": "Keine reale Bewerbung, Interviewbewertung, Arbeitgeberanforderung, Produktionssystem oder externe Validierung wurde behauptet oder durchgeführt."}]}
---
# Interviewanforderungen der Zielrollen

> **Ziel:** Diese Vorbereitung macht aus technischem Wissen glaubwürdige, überprüfbare Interviewantworten. Sie ersetzt keine reale Stellenbeschreibung, keine konkrete Interviewschleife und keine ehrliche Aussage über den bisherigen Scope.

## Purpose, Definition und Scope

Interviews für GenAI Solution Architect/Engineer, Platform/Enterprise/Cloud Architect sowie Staff-, Principal- oder Chief-nahe Rollen prüfen unterschiedliche Dinge. Titel sind jedoch uneinheitlich. Ein „Architect“-Interview kann tiefes Coding, ein Whiteboard-Systemdesign, ein Customer-Workshop, ein Cloud-/Securityreview oder eine Executive-Portfolioentscheidung enthalten. Deshalb beginnt gute Vorbereitung bei der ausgeschriebenen Rolle, den Gesprächspartnern und gezielten Rückfragen.

Dieser Artikel vergleicht erwartete Tiefe in:

- Systemdesign und Architekturkommunikation;
- Coding, Debugging und technische Hands-on-Glaubwürdigkeit;
- GenAI/RAG/Agentic AI, Evaluation und sichere Toolgrenzen;
- Platform Engineering, Cloud, SRE, Observability und FinOps;
- Enterprise-, Security-, Data- und Governanceentscheidungen;
- mehrteamiger Wirkung, Konfliktklärung und Entscheidungsrechten;
- belastbaren, ehrlichen Projektbeispielen.

Er liefert kein Skript zum Vorspielen einer Rolle. Gute Antworten trennen Fakten, Entscheidungen, Annahmen, Ergebnisse und Grenzen. Wenn ein gewünschter Nachweis fehlt, ist die gute Antwort: *„Das habe ich noch nicht in dem Scope verantwortet; so würde ich die Frage begrenzen, validieren und mit den zuständigen Personen entscheiden.“*

## Kompetenzstatus und Evidenzgrenzen

| Marker | Interviewbedeutung |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| HANDS-ON-TARGET | Kandidat kann einen begrenzten Design-/Implementierungs-/Debuggingpfad demonstrieren oder als Lab dokumentieren. |
| ARCHITECT-TARGET | Kandidat strukturiert Anforderungen, NFR, Boundaries, Optionen, Betrieb, Security und Cost nachvollziehbar. |
| STAFF-TARGET | Kandidat erklärt mehrteamige technische Wirkung anhand von Artefakten, Adoption und Grenzen statt über Titel. |
| CHIEF-TARGET | Kandidat kann Portfolio-/Strategy-/Risk-Szenarien vorbereiten und formale Entscheidungen korrekt zuordnen. |
| SPECIALIST-OPTIONAL | Tiefe Themen werden offen als Vertiefung, Reviewbedarf oder Lernziel statt als Scheinkompetenz dargestellt. |

## Mental Model: Interview als Evidenzabfrage unter Zeitdruck

Ein Interview fragt selten nach perfekter Architektur. Es beobachtet, wie du unter unvollständigen Angaben vorgehst:

```text
ambiguous prompt
   -> clarify outcome, users, constraints and scope
   -> state assumptions and unknowns
   -> choose architecture / implementation / governance approach
   -> test failure, security, cost and operations
   -> compare trade-offs
   -> define evidence, decision owner and next step
```

Der Interviewer bewertet nicht nur die Antwort, sondern die Reihenfolge des Denkens. Wer sofort Technologie nennt, bevor Datenklasse, Nutzerwert, Last, Schadensfolge und Mandat geklärt sind, zeigt einen schwachen Entwurfsprozess.

## Prerequisites und Dependencies

| Grundlage | Interviewnutzen |
|---|---|
| KB-0002 Rollen- und Kompetenzmodell | Erwartete Reichweite und Tiefe nachweisen, ohne Titel zu überhöhen. |
| KB-0004 Selbsteinschätzung und Evidenzgrenzen | Projektstories rechtssicher, ehrlich und präzise formulieren. |
| KB-0005 Kompetenzcanvas | Antwort von Problem über Entscheidung bis Evidenz und Grenze strukturieren. |
| KB-0006 Hands-on bis Chief | Coding-/Implementierungstiefe und Architektur-/Portfolioebene verbinden. |
| KB-0009 Labstrategie | Praktische Labs als begrenzte, reproduzierbare Evidenz erklären. |
| KB-0027/KB-0028 | Artefakte und Stakeholdermodelle für Design- und Governanceinterviews verwenden. |

## Core Concepts

### 1. Das Antwortframework

Eine robuste Systemdesignantwort kann sechs Schritte verwenden:

1. **Outcome und Nutzer:** Welche Aufgabe, welcher Prozess, welcher Schaden bei Fehler?
2. **Scope und Constraints:** Was ist explizit nicht im Scope? Datenklasse, Latenz, Konsistenz, Region, Budget, Teams?
3. **Architecture:** Context, Komponenten, Daten-/Control-Flow, Contracts und Ownership.
4. **Quality/Betrieb:** SLO, Failure Modes, Degradation, Observability und On-call.
5. **Security/Governance/Cost:** Identity, Zweck, Authorization, Audit, Safety, Provider, Unit Economics und Mandat.
6. **Trade-off/Evidence:** Optionen, Entscheidung, Test, Rollout, Revisit und offene Annahmen.

Für Coding-/Debugginginterviews gilt ein ähnliches Muster:

```text
reproduce -> bound the failure -> inspect evidence -> form hypothesis
-> smallest safe change -> test positive and negative -> observe rollout -> document limit
```

### 2. Rollenspezifische Tiefe

| Bereich | GenAI Solution Architect/Engineer | Platform/Enterprise Architect | Cloud Architect | Staff/Principal/Chief |
|---|---|---|---|---|
| Coding | API, RAG, tool boundary, test/debug, integration glaubwürdig | Architecture literacy, reference path, mögliche Code-/IaC-Nähe | IaC, network/identity/runtime patterns, troubleshooting | tiefe Reviewfähigkeit; Umfang je Rolle |
| Systemdesign | data/retrieval/model/eval/tool/control flow | capabilities, contracts, platform/landscape, transition | landing zone, reliability, network, security, cost | multi-program, portfolio, operating model |
| Operations | quality, safety, latency, cost, observability | platform SLO, adoption, lifecycle, resilience | DR, capacity, incident, governance | risk/evidence, investment/retire |
| Governance | AI risk, data, human gate, audit | decision rights, standards, exceptions | policy, account/project boundary, compliance | risk tolerance, portfolio, stakeholder conflict |
| Communication | domain/use case and technical team | cross-team architecture artifacts | engineering/security/finance | executive options and clear limits |

Diese Tabelle ist eine Hypothese. Die konkrete Firma kann Codingtests für Chief-Rollen auslassen oder bei einem Platform Architect stark vertiefen. Darum sind Rückfragen notwendig.

### 3. Projektstory ohne Übertreibung

Eine belastbare Story hat folgende Felder:

```text
Context: Ausgangslage und mein tatsächlicher Scope.
Problem: technische/fachliche Grenze, keine allgemeine Heldengeschichte.
Decision: Optionen, Kriterien und die getroffene oder simulierte Wahl.
Action: Was habe ich selbst implementiert, analysiert oder dokumentiert?
Evidence: Test, Artefakt, Messung oder Lernresultat.
Outcome: nur belegte Wirkung; ansonsten erwarteter oder noch zu messender Effekt.
Limit: Was war nicht im Scope, unklar oder ein Lernziel?
```

Beispiel einer evidenzkonformen Formulierung (Vorlage mit Platzhaltern):

> „In [Projekt/Konzept, Zeitraum] habe ich [z. B. RAG, Prozessruntime, Berechtigungen und Human-in-the-Loop] zusammen modelliert. Mein konkreter Beitrag war [eigener Anteil, z. B. die technische Strukturierung des Falls]. Ich behaupte daraus keine produktive Enterprisefreigabe, Nutzerzahl oder SLO. Für einen echten Rollout würde ich Datenklassifikation, Domainautorisation, Evaluation, Betriebsmodell, Kostenlimits und unabhängige Security-/Privacyreviews als Gates definieren.“

### 4. Gute Rückfragen

Rückfragen sind kein Ausweichen, sondern Risikomanagement:

- Welche Nutzer und Prozesse sind besonders schaden- oder compliancekritisch?
- Welche Datenklassen, Regionen, Retention und Providerrestriktionen gelten?
- Welcher Teil des Systems ist bereits vorhanden, und was ist System of Record?
- Gibt es SLOs, Lastprofile, Budget-/Cost-Ziele oder Incidenthistory?
- Ist die Rolle hands-on, advisory, accountable oder people-managementnah?
- Welches Team besitzt Platform, Security, Data und Betrieb?
- Wie sehen Architekturentscheidungen, Ausnahmen und Eskalation heute aus?
- Wie wird in dieser Rolle Wirkung nach sechs oder zwölf Monaten bewertet?
- Welche Coding-, Design-, Governance- und Kommunikationsrunden umfasst der Prozess?
- Welcher Anteil ist neue Delivery, Legacy-Transition, Plattform oder Portfolio?

## Architecture und Data Flow: Interviewfall „Sichere AI Knowledge Assistance“

Der Kandidat erhält: „Entwerfen Sie einen Quellenassistenten für interne Supportmitarbeiter.“ Eine gute Antwort erweitert nicht ungefragt zu einem autonomen Unternehmensagenten.

### Context View

```text
support user -> domain support app -> AI access boundary
                                 |-> approved retrieval sources
                                 |-> model route
                                 |-> cited answer / abstention
                                 |-> telemetry / audit correlation
```

### Strukturierte Antwort

| Schritt | Aussage |
|---|---|
| Ziel | Read-only, zitierfähige Unterstützung; keine autonomen Aktionen. |
| Fragen | Datenklasse, Tenant, Nutzerzahl, Latenz, Quellenowner, Region, regulatorischer Scope. |
| Boundaries | Domain besitzt Autorisation und Inhalte; Plattform bietet Identity/Policy/route/telemetry. |
| Contracts | servervalidierte purpose/tenant, versionierte Quellen-/Antwortmetadaten, correlation. |
| Failure | provider timeout → abstention/fallback; retrieval miss → keine unbelegte Antwort; policy deny → sicher erklären/eskalieren. |
| Security | least privilege, no prompt-as-policy, audit, secret/supply-chain controls. |
| Operations | SLO, P95, error/quality/citation, queue, cost, alert/runbook. |
| Cost | cost per qualified task, route/limit/cache only within data/freshness rules. |
| Rollout | synthetisch/internal, flag, negative tests, kill switch, decision gate. |

### Variant Questions

- „Wie würden Sie Toolactions hinzufügen?“ → Domainauthorization, structured command, idempotency, Human Gate, audit, compensation, separate risk review.
- „Die Kosten sind zu hoch.“ → Workload-/Qualityslice, Retry/fan-out, route/cache, budget; niemals einfach Security/Quality entfernen.
- „Platform Team ist überlastet.“ → minimal contract, template, self-service; prüfen, ob Solution eigentlich lokal bleiben soll.
- „Security stoppt die Idee.“ → konkrete Control/Threat klären, Scope auf Read-only/Synthetic verengen, kein Bypass.

## Protokolle, Standards und Technologien

| Thema | Interviewfrage |
|---|---|
| ISO/IEC/IEEE 42010 | Welche Stakeholder Concern beantwortet deine View? |
| OpenAPI/AsyncAPI | Wie versionierst, sicherst und testest du Contracts? |
| OAuth/OIDC/Workload Identity | Wo liegen Authentisierung, Delegation und Fachautorisation? |
| NIST AI RMF | Wie strukturierst du Use-Case-, Capability- und Runtime-Risiko? |
| OpenTelemetry | Welche Signale zeigen Qualität, Betrieb, Cost und Policy ohne sensitive Leaks? |
| SLO/Error Budget | Welche Nutzer-/Workload-Ziele beeinflussen Rollout, ohne Security zu ersetzen? |
| FinOps | Wie rechnest du Cost per qualified outcome, Exit und Shared Costs? |
| Service Catalog/Golden Path | Wie sieht Ownership, Self-Service, Lifecycle und Ausnahme aus? |

Nenne Werkzeuge nur, wenn du auch Grenzen, Betrieb, Alternative und Update-/Sicherheitsstand erklären kannst.

## Konfiguration und Implementierung: Der Interview-Evidence-Pack

### Story Card

```yaml
story:
  title: "Agentic RAG/process learning case"
  evidence_status: "concept / bounded"
  role_target: "GenAI Solution Architect"
  context: "own technical learning context"
  decision: "separate policy, domain authorization and human gate"
  own_work: "architecture, contracts, tests or documented prototype"
  evidence: "repository artifact / lab / review"
  result: "learning result or measured result only if available"
  limitations:
    - "no production scale"
    - "no external enterprise approval"
    - "no formal role title"
  next_proof: "bounded implementation and independent review"
```

### System Design Board

```text
1. Requirements/unknowns
2. Context and ownership
3. Runtime/data/control flow
4. NFR and threat model
5. Capacity, SLO, cost
6. Failure/degradation/runbook
7. Rollout/measure/revisit
8. Trade-offs and final recommendation
```

### Coding/Debugging Readiness

Für rollennahe Codingrunden genügt kein Pseudocode. Übe:

- eine kleine API-/Event-/Schemaänderung mit Kompatibilität;
- idempotente Verarbeitung und negative Tests;
- Authz vor Seiteneffekt;
- Timeout, Retrylimit, Circuit Breaker und nachvollziehbaren Fehler;
- strukturierte Trace-/Metric-/Logdaten ohne Secrets/Rohdaten;
- einfache Cost-/Quota-/Rate-Limit-Logik;
- Code-/IaC-Review mit Sicherheits-, Betriebs- und Testfragen.

Bei fehlender Hands-on-Erfahrung mit einem Tool: Konzepte erklären, Labziel nennen, Lernstatus begrenzen, nicht Produkterfahrung behaupten.

## Scalability und Performance

Interviewdesignfragen prüfen oft, ob Skalierung nur als „mehr Container“ verstanden wird. Antworten sollten Last und Workload trennen:

```text
T_end_to_end = auth + policy + retrieval + queue + model + tool + response
```

Frage nach RPS, Konkurrenz, Token-/Payloadgröße, Fan-out, P95/P99, Datenwachstum, Konsistenz, Regionen, Cost Limit und Fehlerverhalten. Dann erkläre Optionen:

| Engpass | Denkbare Maßnahmen | Trade-off |
|---|---|---|
| Queue/Überlast | backpressure, admission control, quota, async | Fairness, UX, Zustandsmodell |
| Modellkosten/Latenz | route, timeout, cache, smaller model | Quality, Freshness, data policy |
| Retrieval | scope/filter/index/cache | Citation/Isolation/Freshness |
| Event-/API-Last | partition, idempotency, batch | ordering, duplicate, observability |
| Teamdurchsatz | templates, contracts, self-service | platform scope/support burden |

Ein starkes Interview nennt, welche Messung die Hypothese bestätigen oder widerlegen würde.

## Reliability und Failure Modes

| Frage des Interviewers | Reife Antwort |
|---|---|
| „Provider ist nicht verfügbar.“ | Deadline, Circuit Breaker, klare Degradation/Abstention, keine unendlichen Retries, Nutzerkommunikation und Betreiberalert. |
| „Event wird doppelt zugestellt.“ | idempotency key, Zustand/Outbox/Consumerdedupe, beobachtbare Fehlerklasse. |
| „Modell antwortet plausibel falsch.“ | Citation/grounding, evaluation slice, abstention/human escalation, Ursache in retrieval/prompt/model/scope suchen. |
| „Der Rückrufdienst ist langsam.“ | Time budget entlang Flow, Retries begrenzen, dependency latency/queue analysieren, fallback. |
| „Das Team umgeht Standard.“ | Friction/Capability/Owner prüfen; hard boundary sichern, Golden Path verbessern, keine automatische Schuldzuweisung. |
| „Ein Incident wiederholt sich.“ | runbook, SLO, ADR, Contract/ownership und Transition aktualisieren; nicht nur Ticket schließen. |

## Security, Governance und Compliance

Interviews testen häufig, ob du Sicherheit als Zusatz oder als Architekturgrenze verstehst. Eine vollständige Antwort umfasst:

- Klassifikation, Zweck, Minimierung, Retention und Datenresidenz;
- Identität, Workload Identity, Delegation, least privilege und Secret Handling;
- Model-/Provider-/Toolfreigabe, Supply Chain und Dependencykritik;
- Prompt Injection, Datenexfiltration, Confused Deputy, Abuse und Cost Attack;
- Serverseitige Domainautorisation für fachliche Aktionen;
- Auditcorrelation, redacted telemetry und Incidentpfad;
- Security/Privacy/Legal-Review im jeweiligen Mandat;
- Stop-/Escalation-Kriterium, das nicht durch ein gutes SLO überstimmt wird.

Eine Antwort, die nur OWASP- oder NIST-Begriffe nennt, aber keinen Control Flow, Test und Owner liefert, bleibt oberflächlich.

## Observability und Troubleshooting

### Interview-Diagnoseplan

```text
Symptom -> scope/slice -> trace and change history -> hypothesis
        -> smallest safe mitigation -> signal -> root/system change
```

Beispiel „AI-Antwort ist teuer, langsam und schlecht“:

1. Slice nach Workflow, Route, Datenklasse, Version und Zeitraum.
2. Prüfe Policy/Denies und Daten-/Sicherheitsgrenze zuerst.
3. Zerlege Latenz: retrieval, queue, model, tool, client.
4. Vergleiche Citation/Evaluation/Nutzerabbruch mit Cost und Retries.
5. Aktiviere sichere Degradation, wenn Quality/SLO/Costgrenze verletzt ist.
6. Korrigiere Contract, Route, Quellen, Limit, Capacity oder Scope; dokumentiere Revisit.

## Cost und FinOps

Eine gute Interviewantwort erklärt nicht nur Cloudpreis, sondern Kostenkontext:

```text
cost per qualified outcome =
(model + retrieval + storage + network + platform +
human review + incident/rework) / qualified completed tasks
```

Frage nach Kostenallokation, Commitments, Providerlimit, Modell-/Workloadslices, Daten-/Egresskosten, Support, Migration und Exit. Nenne Risiken der Scheinpräzision. Ein schwacher Kandidat optimiert Token ohne Qualität/Safety. Ein reifer Kandidat erkennt, dass eine teurere sichere, hilfreiche Aufgabe wirtschaftlicher sein kann als viele billige Fehlantworten.

## Trade-offs und Anti-Patterns

| Trade-off | Schlechte Antwort | Gute Antwort |
|---|---|---|
| Klarheit / Annahmen | Annahmen verschweigen | Annahmen benennen und fragen, welche wichtigste ist. |
| Technik / Outcome | Tool zuerst | Nutzerwert, Schaden, Constraints, dann Architektur. |
| Coding / Architecture | „Ich bin nur strategisch“ | passende technische Tiefe und Reviewfähigkeit zeigen. |
| Sicherheit / Tempo | Security am Ende | Control Flow, sichere Scopebegrenzung, frühe Reviews. |
| Kosten / Qualität | billigste Route | quality/cost/risk/slo-slice und Entscheidungskriterium. |
| Erfahrung / Lernziel | Erfahrung aufblähen | Fakten, Grenzen, Lab, nächste Evidenz sauber trennen. |
| Leadership / Titel | „Ich habe geführt“ ohne Scope | Einfluss-/Entscheidungsartefakte, Mandat und Wirkung exakt beschreiben. |

Anti-Patterns:

- auswendig gelernte „richtige“ Architektur ohne Rückfragen;
- Name-Dropping von Tools, Standards oder Clouds ohne Trade-off;
- fehlende Failure-/Security-/Betriebsperspektive;
- keine Erklärung der eigenen konkreten Tätigkeit;
- STAR-Story, die Ergebnis oder Scope erfindet;
- Governance als Meetingliste statt Entscheidungsrecht;
- bei Unsicherheit behaupten statt abgrenzen;
- keine Fragen an den Arbeitgeber stellen.

## Staff-, Principal- und Chief-Level Decisions

| Zielrolle | Typische Interviewevidenz |
|---|---|
| GenAI Solution Architect/Engineer | Use Case, RAG/Agent-/Toolgrenze, coding/integration, evaluation, safety, operations. |
| Platform Architect | Platform Product, self-service, contracts, SLO, adoption, exception/lifecycle. |
| Enterprise Architect | Capability/Information/Landscape, portfolio, transition, stakeholder/governance. |
| Cloud Architect | landing zone, identity/network, resiliency, migration, cost and operational model. |
| Staff Engineer | mehrteamiges Problem, technical depth, reference path, influence, measurable learning. |
| Principal Engineer | program, target/transition, hard trade-off, decision/system impact. |
| Chief Architect | strategy, portfolio, risk, investment, operating model, decision rights and boundaries. |

## Production Checklist

### Vor dem Interview

- [ ] Stellenbeschreibung ist nach Outcome, Scope, Mandat, Coding, Design, Governance und Domainfragen analysiert.
- [ ] Pro Zielrolle existieren zwei ehrliche, unterschiedliche Story Cards.
- [ ] Jede Story trennt belegten Fakt, eigene Arbeit, Evidenz, Outcome, Limit und nächstes Lernziel.
- [ ] Ein Systemdesignfall enthält Context, Runtime, NFR, Failure, Security, Observability, Cost und Rollout.
- [ ] Coding-/Debuggingübung enthält positive und negative Tests, nicht nur Pseudocode.
- [ ] Eigene Rückfragen decken Rolle, Team, Operating Model, SLO, Daten, Security, Budget und Interviewformat ab.

### Im Gespräch

- [ ] Outcome und Scope zuerst; Annahmen und Unknowns werden transparent.
- [ ] Die Architektur folgt über Verträge und Owner bis zu Betrieb und Cost.
- [ ] Fachliche Autorisation bleibt von Plattformpolicy und Prompt getrennt.
- [ ] Trade-offs, Alternativen, Stop-/Revisit-Kriterien werden genannt.
- [ ] Keine nicht belegte Nutzerzahl, SLA, Teamführung, Budget oder Produktionserfolg wird behauptet.
- [ ] Unsicherheit führt zu einer Validierungsstrategie, nicht zu Ratlosigkeit.

### Danach

- [ ] Unklare Anforderungen werden dokumentiert und die Vorbereitung entsprechend aktualisiert.
- [ ] Gelerntes wird in einen Lab- oder Knowledge-Base-Artikel übersetzt.
- [ ] Keine Gesprächsinterna, personenbezogenen Informationen oder vertraulichen Daten werden unzulässig gespeichert.
- [ ] Eine Absage wird als Evidenz über Rolle/Interviewprozess ausgewertet, nicht als Generalurteil über Kompetenz.

## Interviewfragen mit Modellantworten

### 1. Entwerfen Sie eine sichere RAG-Lösung.

**Modellantwort:** Ich kläre Nutzer, Datenklasse, Tenant, Quellenowner, Latenz, Qualität und ob seiteneffekte im Scope sind. Ich starte read-only: servervalidierte Identität/Zweck, erlaubter Retrievalscope, Modellroute, Citation, Evaluation, Telemetrie und sichere Abstention. Domainautorisation bleibt außerhalb des Prompts im System of Record. Anschließend definiere ich SLO, Cost per qualified task, negative Tenant-/Policytests, Degradation und ein begrenztes Rolloutgate.

### 2. Wie tief codieren Sie als Architect?

**Modellantwort:** Die gewünschte Tiefe hängt von der Rolle ab. Ich bleibe ausreichend nah an Contracts, APIs, Tests, Failure und Runtime, um Entscheidungen und Reviews glaubwürdig zu vertreten. Bei tiefem Spezialgebiet arbeite ich mit Experten und benenne meine Grenzen. Bei meiner eigenen Arbeit kann ich konkrete Artefakte und Tests zeigen, ohne daraus Produktionserfahrung zu behaupten.

### 3. Ein Team will eine neue Plattform umgehen. Was tun Sie?

**Modellantwort:** Ich prüfe zuerst, ob der Golden Path tatsächliche Anforderungen nicht erfüllt: Latenz, Datenklasse, Integration, Support oder Scope. Harte Sicherheits-/Interoperabilitätsgrenzen bleiben bestehen; ich mache die sichere Option einfacher oder strukturiere eine zeitgebundene Ausnahme mit Owner und Kompensation. Reine Kontrolle ohne Frictionanalyse fördert Schattenlösungen.

### 4. Wie erklären Sie eine schwierige technische Entscheidung einem Executive?

**Modellantwort:** Mit Entscheidung, Optionen, Wert, Risiko, Kosten, Transition, Exit und Accountable Owner. Ich vermeide technische Details, die die Entscheidung nicht verändern, aber blende Security-, Betriebs- und Costfolgen nicht aus. Ich benenne Annahmen und Revisit-Trigger und mache klar, welches Mandat der Executive tatsächlich besitzt.

### 5. Was sagt Ihre bisherige Praxis über Principal-/Chief-Readiness?

**Modellantwort:** Sie zeigt eigene technische Lern- und Implementierungskontexte, etwa [Projekt/Lernfall] mit Zeitraum und Evidenzart. Ohne weiteren Nachweis belegt sie keinen Principal-/Chief-Titel, keine Organisationseinheit, kein Budget, keine reale Mehrteamwirkung oder Produktivmetriken. Readiness zeige ich durch konkrete Architekturartefakte, Labs, tiefere technische Arbeit und die Bereitschaft, Scope ehrlich zu begrenzen.

### 6. Wie behandeln Sie einen schlechten Modelloutput?

**Modellantwort:** Ich unterscheide Retrieval-/Datenproblem, Prompt-/Policyproblem, Modellroute, Tool-/Workflowproblem und Evaluationslücke. Bei unzuverlässiger Antwort nutze ich Citation/Abstention/Human Escalation, nicht bloß bessere Formulierung. Ich messe Slices und korrigiere die Systemgrenze, inklusive Incident-/Reviewartefakt, statt nur ein einzelnes Beispiel zu flicken.

## Praktisches Lab: Vollständige Mock-Interviewschleife

### Ziel und Evidenzgrenze

**Status: reviewed_only.** Die Schleife simuliert ein Interview. Sie ist keine Bewertung durch einen Arbeitgeber und keine Bestätigung einer Zielrolle.

### Ablauf

```text
Round 1: 45 min system design
Round 2: 30 min code/contract/debugging
Round 3: 30 min governance/stakeholder/cost
Round 4: 20 min project stories and candidate questions
Round 5: self-review against evidence and limitations
```

1. Wähle einen Read-only AI-Assistenzfall und schreibe Fragen/Annahmen nach den ersten fünf Minuten.
2. Zeichne Context und Runtime, ergänze NFR, Contracts, Security, SLO, Cost, Failure und Rollout.
3. Ändere einen API-/Eventcontract; zeige Version, negative Consumer-/Authztests und Rückrollpfad.
4. Beantworte Debuggingfall: Timeout plus Cost Spike plus Citation Drop. Nutze Diagnosefolge und sichere Degradation.
5. Beantworte Governancefall: Product will Toolaction, Security stoppt, Finance deckelt. Formuliere Decision Contract statt Scheinlösung.
6. Erzähle fünf evidenzkonforme Stories in zwei Minuten und prüfe jede auf Fakten, eigene Arbeit, Limit und Lernziel.
7. Formuliere zehn Rückfragen an eine echte Zielrolle.
8. Bewerte dich nur an Artefaktqualität, Klarheit, Ehrlichkeit, technischer Tiefe und offenen Lücken, nicht an Titel oder Gesprächsgefühl.

### Negative Gegenproben

| Probe | Erwartung |
|---|---|
| Es fehlen Nutzer-/Daten-/NFR-Fragen. | Antwort wird als unvollständig markiert, bevor Technik gewählt wird. |
| Candidate nennt produktive Nutzerzahl/SLO ohne Evidenz. | Story Card blockiert die Aussage und verlangt eine Evidenzgrenze. |
| Toolaction wird nur per Prompt geschützt. | Securitytest verwirft den Entwurf. |
| SLO ist grün, Audit/Policy offen. | Rollout wird nicht erweitert. |
| Codinglösung hat nur Happy Path. | Negative Authz/timeout/idempotency test fehlt und wird ergänzt. |
| Executivefrage erhält Implementierungsdetails ohne Optionen/Risiko. | Antwort wird in Decision Template neu strukturiert. |
| Interviewerforderung passt nicht zur Stellenbeschreibung. | Kandidat stellt Rückfrage und passt erwartete Tiefe an. |
| Ein Tool wird genannt, aber Alternative/Exit/Betrieb unbekannt. | Aussage wird als Lernziel oder Recherchepunkt markiert. |

### Cleanup

Alle Notizen als synthetisch markieren. Keine echten Interviewfragen, Namen, Gesprächsinterna, Credentials oder vertrauliche Arbeitgeberinformationen speichern. Das Lab nach jeder neuen Stellenbeschreibung aktualisieren.

## Dependencies und Cross-References

- [KB-0002 – Rollen- und Kompetenzmodell](../00-navigation-governance/02-rollen-kompetenzmodell-und-tiefenstufen.md)
- [KB-0004 – Selbsteinschätzung und Evidenzgrenzen](../00-navigation-governance/04-cv-istbild-und-zielkompetenzen.md)
- [KB-0005 – Kompetenzcanvas und Wirkungskette](../00-navigation-governance/05-kompetenzcanvas-und-wirkungskette.md)
- [KB-0006 – Hands-on-, Architect-, Staff- und Chief-Arbeitsmodell](../00-navigation-governance/06-hands-on-architect-staff-chief-arbeitsmodell.md)
- [KB-0009 – Labstrategie, Evidenz und Gegenproben](../00-navigation-governance/09-labstrategie-evidenz-und-gegenproben.md)
- [KB-0027 – Architekturartefakte nach Rollenbedarf](17-architekturartefakte-nach-rollenbedarf.md)
- [KB-0028 – Stakeholdermodelle für Architekturrollen](18-stakeholdermodelle-fuer-architekturrollen.md)
- [KB-0030 – Roadmap für den Rollenübergang](20-roadmap-fuer-den-rollenuebergang.md)
- KB-0720 – Integrierende Staff-/Principal-/Chief-Architekturpraxis

## Quellen und Aktualitätsnotizen

| Quelle | Verwendung | Stand |
|---|---|---|
| Dateikatalog 720 | Scope: Systemdesign, Coding, Governance, Rückfragen und Projektbeispiele nach Zielrolle. | Planstand 2026-09-14 |
| [ISO/IEC/IEEE 42010:2022](https://www.iso.org/standard/74393.html) | Architekturviews und Stakeholder Concerns. | Abgerufen 2026-09-15 |
| [OpenAPI Specification](https://spec.openapis.org/oas/v3.2.1.html) | API Contracts und Schnittstellenfragen. | Abgerufen 2026-09-15 |
| [NIST AI RMF 1.0](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf) | AI-Risiko, Governance und Controls. | Abgerufen 2026-09-15 |
| [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/) | SLO/SLI, Nutzer- und Workloadperspektive. | Abgerufen 2026-09-15 |
| [FinOps Framework](https://www.finops.org/framework/) | Cost-/Wert- und Collaborationperspektive. | Abgerufen 2026-09-15 |
| [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/) | Observability- und Telemetriefragen. | Abgerufen 2026-09-15 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — Architekturinterviews umfassen zunehmend AI Safety, Evaluation und Tool-Grenzen.** Für GenAI-Rollen reicht ein RAG-Diagramm nicht; gute Kandidaten erklären Daten-/Zweckgrenzen, Evaluation, Citation/Abstention, Toolautorisation, Audit, Cost und Degradation. **Reifegrad: Adopting.** Risiko ist, aktuelle Begriffe als Erfahrungsnachweis auszugeben. Übe stattdessen kleine, technisch begrenzte Fälle mit klarer Lab-/Evidenzgrenze. Quelle: [NIST AI RMF](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf).

**Stand 2026-09-15 — Praktische Interviewevidenz wird stärker über Artefakte als über Zertifikate sichtbar.** Versionierte ADRs, Contracts, Tests, Runbooks, Architecture Views und nachvollziehbare Labgrenzen können technische Urteilsfähigkeit zeigen. **Reifegrad: Established für die Artefakte, Adopting für AI-spezifische Evidence Packs.** Risiken sind polierte, aber nicht ausführbare Portfolios. Ein Review prüft Source of Truth, negative Tests, Aktualität, Grenzen und die Fähigkeit, Trade-offs mündlich zu erklären.

**Stand 2026-09-15 — AI-gestützte Vorbereitung muss gegen Halluzination und Übertreibung abgesichert sein.** KI kann Mockfragen, Varianten und Lückenanalysen liefern, aber keine reale Erfahrung ersetzen. **Reifegrad: Adopting.** Eine Story Card mit belegtem Fakt, eigener Arbeit, Evidenz, Limit und Lernziel verhindert falsche Aussagen. Kein generierter Text wird ohne Faktenabgleich im Interview verwendet.
