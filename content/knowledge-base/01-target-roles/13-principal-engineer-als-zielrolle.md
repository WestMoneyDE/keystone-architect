---
{"id": "KB-0023", "title": "Principal Engineer als Zielrolle", "domain": "01", "sequence": 13, "document_type": "role", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0002", "concepts": ["Rollen-Kompetenz-Matrix", "Tiefenstufen", "Nachweisarten"], "needed_for": "understanding"}, {"id": "KB-0004", "concepts": ["Evidenzgrenzen", "zulässige Aussagen", "Zielkompetenzen"], "needed_for": "understanding"}, {"id": "KB-0005", "concepts": ["Kompetenzcanvas", "Entscheidungsreichweite", "Wirkungskette"], "needed_for": "understanding"}, {"id": "KB-0006", "concepts": ["Hands-on-Tiefe", "Architekturnachweis", "Spezialistenübergabe"], "needed_for": "understanding"}, {"id": "KB-0009", "concepts": ["Labstrategie", "Gegenprobe", "Evidenzgrenze"], "needed_for": "lab"}], "related": ["KB-0011", "KB-0012", "KB-0013", "KB-0014", "KB-0015", "KB-0016", "KB-0017", "KB-0019", "KB-0020", "KB-0021", "KB-0022", "KB-0024", "KB-0221", "KB-0550", "KB-0565", "KB-0612", "KB-0720"], "applies": ["KB-0221", "KB-0550", "KB-0565", "KB-0612", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein mehrteamiger Architekturfall wird mit Zielbild, Current-State-Karte, Entscheidungssystem, Referenzpfad, Verträgen, Migrationswellen, Telemetrie, Kostenmodell, Gegenprobe und überprüfbarer Ergebnisstory praktisch erarbeitet.", "rationale": "Principal-Wirkung wird glaubwürdig, wenn Richtung, Umsetzung und messbare Grenzen zusammenpassen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Qualitätsattribute, fachliche Grenzen, Verträge, Ownership, Datenflüsse, Betriebsfolgen und Übergänge mehrerer Systeme werden als entscheidbare Architektur beschrieben.", "rationale": "Die Rolle braucht Systemtiefe und muss aus vielen lokalen Wahrheiten einen umsetzbaren Übergang ableiten."}, "STAFF-TARGET": {"active": true, "scope": "Mehrteamige technische Engpässe werden durch Referenzimplementierungen, Standards, Coaching, klare Entscheidungsräume und Ergebnisfeedback aufgelöst.", "rationale": "Staff-Nähe hält die Richtung implementierbar und verhindert reine Governance."}, "CHIEF-TARGET": {"active": true, "scope": "Die wiederholten Programmfälle werden in Technologieportfolio, Investitionsoptionen, Risikotransparenz, Capability-Aufbau und organisationsweite Entscheidungsregeln überführt.", "rationale": "Chief-Level benötigt verlässliche Evidenz aus mehreren Principal- und Staff-Wirkungsketten."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Spezialisierungen wie tiefes Datenbank-Tuning, GPU-Kerneloptimierung, Netzwerkrouting, Arbeitsrecht, People Management, Beschaffung oder regulierte Auditprüfung werden mit Fachleuten gestaltet und gezielt vertieft.", "rationale": "Principal muss die Entscheidung integrieren, aber nicht jedes Teilgebiet als alleiniger Spezialist ausführen."}}, "lab_validation": [{"lab_id": "KB-0023-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Nicht produktive Fallarbeit für ein fiktives mehrteamiges AI-Capability-Programm", "evidence": "Das Lab definiert Problemframe, Capability Map, Architekturansichten, Verträge, Rollout, Metriken, Decision Gate, Gegenproben und Cleanup.", "limitations": "Keine realen Teams, Kundensysteme, Budgets, Providerkonten, Produktionsrollouts oder Unternehmenskennzahlen wurden ausgeführt, verändert oder behauptet."}]}
---
# Principal Engineer als Zielrolle

> **Ziel dieses Artikels:** Die Principal-Engineer-Rolle als technische Zielrolle präzise einordnen und einen überprüfbaren Weg von heutigen, begrenzten technischen Lernfällen zu mehrjähriger, organisationsübergreifender Wirkung ableiten. Der Artikel trennt bewusst zwischen nachweisbarer eigener Erfahrung, Konzeptwissen und Lernziel.

## Purpose, Definition und Scope

Ein Principal Engineer richtet langfristige technische Entwicklung über mehrere Teams, Systeme und Programme aus. Die Rolle macht nicht einfach „größere Architektur“. Sie schafft eine belastbare Verbindung zwischen einer strategischen Absicht und den vielen lokalen Entscheidungen, die diese Absicht entweder real machen oder schrittweise entwerten: Produktziele, Domänengrenzen, Datenverträge, Laufzeitplattform, Security, Zuverlässigkeit, Kosten, Lieferfähigkeit, Ownership und Ablösung alter Pfade.

Die Bezeichnung ist unternehmensspezifisch. Deshalb ist sie kein zuverlässiger Ersatz für Kompetenznachweis. In diesem Wissenssystem bedeutet Principal Engineer:

- eine Person, die schwierige, mehrjährige technische Zielkonflikte als explizite Entscheidungen strukturiert;
- eine Person, die ein Programm über mehrere Teams in eine sichere Reihenfolge bringt, ohne sich auf ein Gremium oder eine Folienarchitektur zu beschränken;
- eine Person, die genügend Hands-on-Tiefe behält, um Verträge, Referenzpfade, Risikoannahmen, Messgrößen und Eskalationen zu beurteilen;
- eine Person, die Erfolg als nachweisbare Verbesserung eines Systems misst, nicht als Menge an Dokumenten oder Architekturdiagrammen.

Der Scope umfasst GenAI-Lösungsarchitektur, AI-/Platform-/Enterprise- und Cloud-Architektur. MLOps und LLMOps erscheinen als verbindende Betriebs- und Qualitätsperspektive. Die Rolle ersetzt weder Product Leadership noch Security, SRE, Data Engineering, FinOps oder People Management. Sie integriert deren begründete Anforderungen in Entscheidungen, macht ungeklärte Konflikte sichtbar und sorgt für einen umsetzbaren Übergang.

**Nicht der Scope dieses Artikels:** Ein Titelversprechen, eine pauschale Führungslaufbahn oder ein Nachweis realer organisationsweiter Verantwortung. Die konkrete Laufbahn, Entscheidungsrechte, Teamgröße, Regulierung, Budgetfreigabe und Providerlandschaft müssen für jede Stelle separat erhoben werden.

### Lernziele

Nach dem Durcharbeiten kannst du:

1. eine Principal-Engineer-Wirkungskette von Geschäftsauslöser bis Betriebs- und Kostenevidenz formulieren;
2. ein mehrteamiges Vorhaben als Zielbild, Übergangsarchitektur, Entscheidungslog und Migrationsprogramm beschreiben;
3. reversible und irreversible Entscheidungen unterscheiden und mit Triggern statt mit Wunschdaten planen;
4. AI-, Plattform-, Cloud- und Enterprise-Entscheidungen über gemeinsame Qualitätsattribute und Verträge koppeln;
5. Rollen von Staff, Principal und Chief an Entscheidungsreichweite, Zeithorizont und Evidenz statt an Prestige unterscheiden;
6. einen anspruchsvollen Lernfall mit Gegenproben, Abbruchkriterien und ehrlicher Evidenzgrenze dokumentieren.

## Kompetenzstatus: Evidenz, Wissen, Lernziel

| Ebene | Aussage für diesen Artikel | Zulässiger Nachweis | Nicht daraus ableiten |
|---|---|---|---|
| **CURRENT-EVIDENCE** | Eigene, belegbare Lernfälle des Lernenden, z. B. [Projekt] mit RAG, Prozessruntime, Berechtigungen oder Human-in-the-Loop, ein dokumentierter Review-Workflow oder eine Integrations-/Runtime-Konzeption (jeweils mit Zeitraum, Evidenzart und Grenze). | Repository, Architekturentscheidungen, Tests, prototypische Telemetrie, nachvollziehbare Designartefakte. | Principal-Titel, Personalführung, unternehmensweite Wirkung, Produktiv-SLO, Budgethoheit oder unbekannte Nutzer-/Datenskala. |
| **Konzeptionelles Wissen** | Programmarchitektur verbindet Zielbild, Transition, Verträge, Risiko, Operating Model, SLO, Kosten und Entscheidungssystem. | Gut begründete Fallstudie, Quellen, Architekturreview, kontrafaktische Analyse. | Dass das Design im jeweiligen Unternehmen akzeptiert, finanziert oder betrieben wird. |
| **HANDS-ON-TARGET** | Einen begrenzten Referenzpfad bauen: Contract, Policy, Telemetrie, gestufter Rollout, Degradation und Runbook. | Reproduzierbares Lab mit negativer Probe und Cleanup. | Eine reale Migration mehrerer Teams. |
| **ARCHITECT-TARGET** | Ziel- und Übergangsarchitektur mit Qualitätsattributen, Daten-/Control-Flow, Ownership und nichtfunktionalen Akzeptanzkriterien erstellen. | Reviewfähige Entscheidungspakete und Traceability zu Risiken. | Vollständige Enterprise Architecture Governance. |
| **STAFF-TARGET** | Mehrere lokale Teams durch konkrete technische Enabler und gemeinsame Lernschleifen ausrichten. | Referenzimplementierung, Working Agreement, Feedback- und Adoptionsevidenz. | Automatische Zustimmung anderer Teams. |
| **CHIEF-TARGET** | Wiederkehrende Entscheidungen in Portfolio-, Capability- und Investitionslogik überführen. | Portfoliohypothese, Szenarien, Risikolimits und Erfolgsmessung. | Formale Executive-Verantwortung ohne Mandat. |
| **SPECIALIST-OPTIONAL** | Tiefenexpertise bei Security, Netzwerk, Daten, GPU, Legal oder Beschaffung gezielt einbinden. | Explizite Entscheidungsfragen, RACI/DRI und Reviewbeiträge. | Dass eine generalistische Rolle Fachreview ersetzt. |

Der eigene Nachweis ist Ausgangspunkt, nicht Schlussfolgerung. Bei einer Bewerbung ist eine belastbare Formulierung beispielsweise die folgende Vorlage: *„Ich habe [konkrete technische Lernfälle/Projekte] ausgearbeitet. Mein Ziel ist, diese Tiefe in wiederholbare mehrteamige Architektur- und Programmwirkung zu überführen.“* Unzulässig wäre, daraus formale Principal-Verantwortung oder produktive Betriebserfolge abzuleiten.

## Mental Model: Principal als Dirigent eines technischen Portfolios

Ein System kann lokal gut gebaut und dennoch global schlecht veränderbar sein. Der Principal Engineer arbeitet deshalb nicht nur am einzelnen Dienst. Er macht die **Richtung, Grenzen und Übergänge** eines technischen Portfolios entscheidbar.

Stell dir eine Stadt vor. Einzelne Teams bauen Häuser, Straßen, Strom- und Wasserleitungen. Ein Principal schreibt nicht jede Bauanleitung und entscheidet nicht allein über jede Parzelle. Er sorgt dafür, dass zentrale Korridore, Versorgungsstandards, Nutzungsgrenzen, Bauphasen und Fluchtwege zusammenpassen. Ohne dieses Zusammenspiel entstehen teure Sackgassen: ein hochperformanter Dienst ohne Datenvertrag, ein AI-Feature ohne Auditpfad, ein Cloud-Programm ohne Landing-Zone oder eine Plattform, die für Teams mehr Wartezeit als Selbstbedienung erzeugt.

Die Wirkungskette lautet:

```text
Geschäfts-/Risikotreiber
        ↓
Technische Hypothese und Zielbild
        ↓
Qualitätsattribute, Grenzen, Verträge und Entscheidungskriterien
        ↓
Übergangsarchitektur mit Sequenz, Owners und reversiblen Schritten
        ↓
Referenzpfad, Guardrails und Teamadoption
        ↓
Telemetrie: Nutzerwert, Qualität, Zuverlässigkeit, Security, Kosten
        ↓
Entscheidung: ausweiten, korrigieren, anhalten oder ablösen
```

Jeder Pfeil braucht Evidenz. Ein Zielbild ohne Daten über Betrieb und Kosten ist ein Wunsch. Telemetrie ohne Eigentümer und Entscheidungsschwellen ist Beobachtung ohne Wirkung. Ein Programm mit Gremien, aber ohne Referenzpfad und Übergangsschnittstellen ist eine Warteschlange.

### Die fünf Linsen

Ein Principal betrachtet jeden Entwurf gleichzeitig durch fünf Linsen:

1. **Outcome:** Welcher Nutzer-, Geschäfts- oder Risikoeffekt rechtfertigt Veränderung? Welche Annahme wird widerlegt, wenn das Ergebnis ausbleibt?
2. **System:** Welche Grenzen, Verträge, Datenflüsse, Laufzeiten und Abhängigkeiten verändern sich?
3. **Betrieb:** Wie degradiert das System, wer reagiert, welche SLOs und Alarmwege gelten?
4. **Ökonomie:** Welche festen und variablen Kosten, Opportunitätskosten, Exit-Kosten und Kapazitätsgrenzen entstehen?
5. **Organisation:** Wer besitzt Entscheidung, Schnittstelle, Daten, Betrieb und Ablösung? Welche Fähigkeit muss aufgebaut werden?

Ein Entwurf ist erst Principal-tauglich, wenn keine dieser Linsen nur implizit bleibt.

## Prerequisites und Abhängigkeiten

| Abhängigkeit | Warum sie benötigt wird | Wie sie angewendet wird |
|---|---|---|
| [KB-0002 Rollen- und Kompetenzmodell](../00-navigation-governance/02-rollen-kompetenzmodell-und-tiefenstufen.md) | Begriffe wie Hands-on, Architect, Staff und Chief werden konsistent. | Jede Aussage wird einer Kompetenzstufe und einem Nachweistyp zugeordnet. |
| [KB-0004 Selbsteinschätzung und Evidenzgrenzen](../00-navigation-governance/04-cv-istbild-und-zielkompetenzen.md) | Der Artikel darf Projektideen nicht als Berufserfahrung ausgeben. | Aussagen zu Scope, Produktionsreife und Wirkung werden begrenzt. |
| [KB-0005 Kompetenzcanvas](../00-navigation-governance/05-kompetenzcanvas-und-wirkungskette.md) | Entscheidungen brauchen eine sichtbare Wirkungskette. | Problem, Entscheidung, Indikator, Resultat und Grenze werden verknüpft. |
| [KB-0006 Hands-on bis Chief](../00-navigation-governance/06-hands-on-architect-staff-chief-arbeitsmodell.md) | Principal bleibt technisch glaubwürdig, ohne alles selbst auszuführen. | Referenzpfad, Reviewtiefe und Delegation werden getrennt. |
| [KB-0009 Labstrategie](../00-navigation-governance/09-labstrategie-evidenz-und-gegenproben.md) | Lernfälle brauchen reproduzierbare Grenzen. | Negative Proben und Cleanup verhindern Scheinerfolg. |

Spätere kanonische Vertiefungen sind AI-Architektur und RAG (KB-0221), Platform Engineering (KB-0550), Cloud Architecture (KB-0565), Governance/Compliance (KB-0612) und die integrierende Abschlussarchitektur (KB-0720). Diese Rolle bindet sie zusammen; sie dupliziert ihre Fachmechanismen nicht.

## Core Concepts

### 1. Technische Richtung ist eine prüfbare Hypothese

Eine Richtung ist keine Technologiesammlung. Sie ist eine Aussage über Ursache, Wirkung und Bedingung:

> Wenn wir für die Vertrauenswürdigkeit unserer GenAI-Fähigkeit eine gemeinsame Policy-/Retrieval-/Audit-Schnittstelle und einen gestuften Referenzpfad einführen, sinken die Wiederholungskosten und die Wahrscheinlichkeit unkontrollierter Daten- oder Toolzugriffe, **sofern** Teams die Schnittstellen nutzen können, sie nicht ihre kritischen Latenzbudgets brechen und die Ownership dauerhaft klar bleibt.

Diese Hypothese enthält Nutzen, Mechanismus, Annahmen und Widerlegbarkeit. Der Principal macht sie im Programm sichtbar. Die Antwort ist nicht zwingend „bauen“; sie kann „kleiner abgrenzen“, „Standard anpassen“, „extern beziehen“ oder „aufgrund fehlender Evidenz stoppen“ lauten.

### 2. Zielarchitektur und Übergangsarchitektur sind verschiedene Artefakte

Das Zielbild beantwortet: *Welche Fähigkeiten, Grenzen, Verträge und Betriebsmodelle sollen mittelfristig gelten?* Die Übergangsarchitektur beantwortet: *Wie gelangen wir vom aktuellen Zustand dorthin, ohne Geschäft, Datenintegrität, Sicherheit oder Lieferfähigkeit unverantwortlich zu gefährden?*

| Frage | Zielarchitektur | Übergangsarchitektur |
|---|---|---|
| Zeit | Stabiler Orientierungspunkt, häufig 18–36 Monate als Hypothese | Konkrete Wellen und Entscheidungstore, oft Quartale |
| Schwerpunkt | Fähigkeiten, Boundaries, Prinzipien, Standards, Zielqualitäten | Kompatibilität, Datenmigration, Dual Run, Entkopplung, Rollback |
| Gefahr | Utopie ohne Kosten und Ausgangszustand | Lokale Optimierung ohne langfristige Konvergenz |
| Principal-Arbeit | Annahmen und Zielkonflikte offenlegen | Reihenfolge, Stop-Kriterien und Owner für Risiken entscheiden |

Eine gute Transition kann Zielbildannahmen ändern. Deshalb ist Architektur kein Wasserfall. Die Daten aus einer Migrationswelle aktualisieren Zielbild, Standards und Investitionsentscheidung.

### 3. Programm, Projekt und Portfolio

Ein **Projekt** liefert ein begrenztes Ergebnis mit Zeit, Budget und Team. Ein **technisches Programm** koordiniert mehrere voneinander abhängige Initiativen, damit eine Fähigkeit zuverlässig entsteht. Ein **Portfolio** ist die Menge konkurrierender Investitionen und Risiken; es braucht bewusstes Stoppen, Priorisieren und Sequenzieren.

Principal-Arbeit beginnt häufig dort, wo ein Projekt allein nicht mehr entscheiden kann: Ein Team kann seinen RAG-Service verbessern, aber nicht allein Datenklassifikation, Identity-Propagation, gemeinsame Evaluation, Modellrouting, Kostenlimits und Incident Ownership über alle Konsumenten festlegen.

### 4. Entscheiden unter Unsicherheit

Nicht alle Entscheidungen verdienen denselben Aufwand. Hilfreich sind vier Kategorien:

| Kategorie | Beispiel | Umgang |
|---|---|---|
| Reversibel, klein | Telemetrieattribut oder UI-Experiment | Schnell mit Owner, Default und Cleanup entscheiden. |
| Reversibel, breit | Feature-Flag-Provider oder Prompt-Registry-Konvention | Timebox, Vergleich, Migrationspfad und Exit-Kosten planen. |
| Schwer reversibel, begrenzt | Datenmodell, Tenant-Isolation, Schlüsselhierarchie | Mehrere Optionen, Security-/Betriebsreview, konkrete Akzeptanzkriterien. |
| Schwer reversibel, breit | Cloud-Landing-Zone, Event-Backbone, AI-Datenzugriffsmodell | Programmentscheidung mit Zielbild, Transition, Investitions- und Risikoentscheidung. |

Die falsche Reaktion ist entweder Zentralisierung jeder Kleinigkeit oder Dezentralisierung von irreversiblen Entscheidungen. Principal Engineering gestaltet den Entscheidungsraum: Was muss konsistent sein? Was darf Teams variieren? Wer entscheidet bei Konflikt, welche Evidenz ist ausreichend und wie wird eine Entscheidung revidiert?

### 5. Architecture Description als gemeinsame Sprache

ISO/IEC/IEEE 42010 beschreibt Architektur als Beschreibung eines Systems im Kontext seiner Stakeholder und Concerns. Für ein Programm bedeutet das: Ein Bild reicht nicht. Es braucht gezielte Sichten für verschiedene Fragen.

- **Kontextsicht:** Domänen, Nutzer, externe Systeme, Trust Boundaries.
- **Bausteinsicht:** Dienste, Datenprodukte, Modelle, Queues, Policies und ihre Owner.
- **Laufzeitsicht:** Erfolgs-, Fehler-, Retries-, Degradations- und Auditpfad.
- **Deployment-/Betriebssicht:** Umgebungen, Regionen/Zonen, Identitäten, Secrets, Observability, Runbooks.
- **Entscheidungssicht:** Alternativen, Kriterien, Annahmen, Datum, Owner, Revisit-Trigger.
- **Transitionssicht:** Current State, Zwischenzustände, Kompatibilität und dekommissionierter Pfad.

Die Sichten sind keine Bürokratie. Jede soll eine konkrete, wiederkehrende Fehlentscheidung vermeiden.

### 6. Verträge sind skaliertes Vertrauen

Bei mehr Teams skaliert Abstimmung nur begrenzt. Verträge ersetzen nicht Kommunikation, aber sie schaffen überprüfbare Grenzen:

- API- und Event-Schemata mit Versionierung und Kompatibilitätsregel;
- Datenklassifikation, Retention, Zweckbindung und Zugriffsbedingungen;
- Identitätsclaims, Authentisierung, Autorisierung und Delegationsgrenzen;
- Qualitätsziele, Lastprofile, Zeitlimits, Quoten und Degradationsverhalten;
- Evaluation, Safety-Checks, Human Gate und Auditdaten für AI-Workloads;
- Ownership, On-call-Grenze, Eskalation und Lebenszyklus.

Ein Principal standardisiert den *Vertragsrahmen*, nicht jeden fachlichen Namen. Teams dürfen ihre Domäne besitzen, solange die gemeinsamen Sicherheits-, Betriebs- und Interoperabilitätsbedingungen nachweisbar sind.

### 7. Optionen und Reversibilität

Eine Plattformentscheidung kann später mehr kosten als ihr Start. Darum wird der Wert einer Option bewusst beschrieben:

- Welche spätere Wahl bleibt offen?
- Was kostet der Exit technisch, vertraglich und organisatorisch?
- Welche Daten, Identitäten oder proprietären Formate erzeugen Lock-in?
- Kann der neue Pfad parallel zum alten laufen?
- Wie wird Erfolg nach einer Welle gemessen?
- Was wird ausdrücklich *nicht* standardisiert?

Reversibilität ist kein Freibrief für unsichere Experimente mit Daten. Sicherheit, Compliance und Schadenspotenzial bleiben harte Grenzen.

## Architecture und Data Flow: Beispielprogramm „Vertrauenswürdige AI-Fähigkeiten“

Der folgende Fall ist eine **synthetische Lernarchitektur** zu typischen GenAI-Themen, nicht die Beschreibung eines produktiven Unternehmenssystems. Er verbindet einen Knowledge-/RAG-Use-Case, fachliche Prozessschritte, eine Commerce-nahe Integration und ein Modellrouting über mehrere LLMs. Der Fall zeigt, warum die Principal-Rolle ein Programm statt eines einzelnen Services braucht.

### Problemstellung und Zielbild

Mehrere Teams wollen GenAI-Funktionen anbieten. Ohne gemeinsame Leitplanken entstehen unterschiedliche Retrieval-Pfade, unklare Datenherkunft, abweichende Toolrechte, undurchsichtige Kosten und keine einheitliche Reaktion bei schädlichen Antworten. Das Ziel ist nicht ein „zentraler AI-Monolith“, sondern eine gemeinsame Vertrauens- und Betriebsfähigkeit:

```text
Nutzer / Fachprozess / Commerce-Kanal
                 |
                 v
       Experience oder Domain Service
                 |
        identity + tenant + purpose
                 v
     AI Access Contract / Policy Decision
       |              |                 |
       |              |                 +--> Audit event / immutable evidence
       |              v
       |        Retrieval boundary -----> curated knowledge sources
       v
Model routing and execution ----> approved model/provider endpoints
       |
       +--> Tool gateway ----> explicitly allowed domain tools
       |
       +--> Evaluation / safety checks / human approval when required
                 |
                 v
Response with citations, policy outcome and degradation state
                 |
                 v
OpenTelemetry traces, metrics, logs, cost allocation, SLO dashboards
```

**Wesentliche Invarianten:**

1. Ein Request trägt nur die minimal erforderlichen Identitäts-, Tenant-, Zweck- und Klassifikationsattribute.
2. Retrieval und Toolzugriff sind nicht implizit durch Prompt oder UI erlaubt, sondern durch prüfbare Policy und Domain-Autorisierung.
3. Jede freigegebene Antwort kann ihre relevante Modell-/Prompt-/Policy-/Retrievalversion und einen Auditkorrelationsschlüssel ausweisen, ohne sensitive Inhalte unkontrolliert in Telemetrie zu kopieren.
4. Ein Provider-, Modell-, Retrieval- oder Toolausfall besitzt einen definierten Degradationspfad.
5. Kosten werden mindestens bis zu Produkt, Tenant, Workflow oder Kostenstelle zuordenbar gemacht, soweit Datenschutz und Vertragslage es erlauben.
6. Die Plattform besitzt nicht automatisch Fachdaten oder Geschäftsentscheidungen; Domain-Teams behalten fachliche Ownership.

### Current State, Transition und Target State

| Zustand | Charakter | Hauptgefahr | Principal-Artefakt |
|---|---|---|---|
| **Current State** | Teams bauen einzelne AI-Integrationen, eigene Prompts, eigene RAG-Quellen und Providerzugänge. | Schattenzugriff, Qualitätsstreuung, fragmentierte Kosten, keine Incident-Grenze. | Istkarte, Datenklassifikation, Dependency-/Owner-Liste, Risiko-Register. |
| **Transition Welle 1** | Gemeinsame Telemetrie, minimale AI-Request-Konvention, Read-only Retrieval und killbarer Referenzpfad. | Standard wird zu schwer oder ignoriert. | Referenzimplementierung, Contract-Tests, SLO/Cost Baseline, Adoption-Interview. |
| **Transition Welle 2** | Policy Decision, Freigabe-Workflow, ein sicherer Tool Gateway, Evaluation- und Auditpfad. | Policy wird für fachliche Autorisierung missbraucht; Latenz bricht. | ADR, Threat Model, Lasttest, Fallback, Exception Process. |
| **Target State** | Mehrere Domain-Teams nutzen verlässliche Verträge; Plattform bietet Guardrails und Self-Service; Domainen besitzen Inhalte und Outcomes. | Zentraler Flaschenhals oder unkontrollierte Varianten. | Capability-Metriken, Plattform-Produktmodell, Lifecycle-/Exit-Plan. |

Eine Transition ist erfolgreich, wenn die neue Fähigkeit real nutzbar ist und der alte Pfad nachweisbar weniger attraktiv beziehungsweise kontrolliert abgeschaltet wird. Das gilt auch für Standards: Ein Dokument ohne Tooling, Beispiele, Contract-Test und Supportpfad verändert kaum Verhalten.

### Programmsteuerung als Datenfluss

```text
Business driver / risk
       |
       v
Portfolio hypothesis -----> decision record -----> funded / stopped / revised
       |                        |                         |
       v                        v                         v
Capability map --------> transition waves --------> team backlogs
       |                        |                         |
       v                        v                         v
Quality attributes ----> reference path ---------> runtime signals
       |                        |                         |
       +------------------------+-------------------------+
                                |
                                v
                    evidence review and next decision gate
```

Der Principal besitzt nicht allein alle Kästchen. Er oder sie sorgt dafür, dass sie verbunden bleiben. Jede Welle hat einen klaren **Decision Gate**: Eine Aussage, welche Messung oder welches Review zum Weitergehen, Korrigieren oder Stoppen führt.

## Protokolle, Standards und relevante Technologien

| Bereich | Relevante Bausteine | Principal-Frage |
|---|---|---|
| Architektur | ISO/IEC/IEEE 42010, ADRs, Context Maps, C4 als Kommunikationsnotation | Welche Concern wird mit welcher Sicht beantwortet, und wer akzeptiert sie? |
| APIs und Events | OpenAPI, AsyncAPI, Schema Registry, Kompatibilitätsregeln, idempotente Consumer | Welche Verträge sind stabil genug für unabhängige Delivery? |
| Identity und Security | OAuth/OIDC, Workload Identity, mTLS, kurzlebige Credentials, Policy-as-Code, KMS/HSM | Wie werden Nutzer-, Workload- und Delegationsrechte nachweisbar getrennt? |
| AI Runtime | Modellgateway, Provideradapter, Prompt-/Model-Version, Retrieval, Tool Gateway, Evaluation | Welche Policy gilt vor Modell, Tool und Antwort; welches Fallback ist fachlich akzeptabel? |
| Observability | OpenTelemetry, Logs/Metrics/Traces, SLI/SLO, Audit Event, Correlation ID | Welches Signal löst welche Entscheidung oder Eskalation aus? |
| Delivery | CI/CD, IaC, GitOps, Contract/Security/Policy Tests, Feature Flags | Welche Änderungen sind sicher klein ausrollbar und sauber zurückzunehmen? |
| Wirtschaftlichkeit | Unit Economics, Budgets/Anomalien, Showback/Chargeback, Kapazitätsmodell | Welche Kosten verursachen Request, Workflow, Tenant oder Produktwert? |
| Entwicklererlebnis | Software Catalog, Templates, Golden Paths, Scorecards | Welche Standards sind wirklich nutzbar und reduzieren kognitive Last? |

Zeitabhängige Informationen in diesem Artikel haben den Stichtag **2026-09-15**. Vor einer konkreten Umsetzung sind Spezifikationsversionen, Cloud-/Providerverhalten, Rechtslage, Preis, Sicherheitsstatus und interne Policies gegen Primärquellen und den Zielkontext zu prüfen.

### Referenzvertrag: AI Request Envelope

Ein kanonischer Vertrag kann minimal bleiben und dennoch entscheidende Grenzen sichtbar machen:

```yaml
request_id: "uuid"
correlation_id: "trace-compatible-id"
actor:
  subject_type: "user | workload"
  subject_id: "pseudonymous-or-internal-id"
tenant_id: "tenant-or-business-boundary"
purpose: "customer-support | internal-knowledge | workflow-assist"
data_classification: "public | internal | confidential | restricted"
operation:
  kind: "answer | summarize | classify | tool-plan"
  idempotency_key: "required-for-side-effects"
policy:
  decision_ref: "policy-decision-id"
  required_human_approval: false
model:
  route: "approved-route-name"
retrieval:
  knowledge_scope: ["approved-source-set"]
  citation_required: true
```

Der Envelope ist keine Autorisierung. `tenant_id`, `purpose` und `data_classification` müssen serverseitig aus vertrauenswürdigen Quellen geprüft oder abgeleitet werden. Ein Client darf sie nicht einfach selbst bestimmen. Für Seiteneffekte ist ein Tool Gateway mit explizitem Scope, idempotentem Command, Zustandsprüfung, Freigaberegel und Audit erforderlich.

### Entscheidungsrecord: von Meinung zu überprüfbarer Verpflichtung

```yaml
id: ADR-AI-017
title: "Gemeinsamen AI Access Contract vor Tool Gateway einführen"
date: "2026-09-15"
status: "proposed"
context:
  problem: "Unterschiedliche AI-Integrationen besitzen keine gemeinsame Entscheidungs- und Auditgrenze."
  constraints:
    - "Keine Rohprompts in Standardtelemetrie"
    - "Domain-Autorisierung bleibt in den Fachsystemen"
    - "Read-only-Referenzpfad muss ohne Providerwechsel testbar sein"
options:
  - name: "Jedes Team integriert direkt"
    benefits: ["geringe Startzeit"]
    risks: ["Policy-, Audit- und Kostenfragmentierung"]
  - name: "Zentraler AI-Monolith"
    benefits: ["einheitliche Kontrolle"]
    risks: ["Fachlicher Flaschenhals und unklare Domain-Ownership"]
  - name: "Gemeinsamer Contract mit föderierter Domain-Ownership"
    benefits: ["prüfbare Basiskontrollen und lokale Fachverantwortung"]
    risks: ["Initiale Enablement- und Vertragsarbeit"]
decision: "Option 3 als begrenzter Referenzpfad"
acceptance:
  - "Policy outcome, route version und audit correlation sind aus jedem Referenzrequest ableitbar"
  - "Ungültiger Tenant- oder Zweckclaim wird serverseitig abgewiesen"
  - "Providerausfall ergibt einen dokumentierten, getesteten Degradationszustand"
  - "Kosten werden einem Produkt oder Workflow zugeordnet"
revisit_when:
  - "P95-Latenz überschreitet das vereinbarte Budget"
  - "kritischer Policy- oder Auditbefund"
  - "zweites Domain-Team kann Contract nicht ohne Sonderentwicklung übernehmen"
owner: "named technical DRI"
```

Eine ADR ersetzt keine Entscheidungskommunikation. Sie verhindert vor allem das spätere Vergessen von Annahmen, Alternativen und Revisit-Triggern.

## Konfiguration und Implementierung: Der Referenzpfad

### 1. Problem Frame vor Toolauswahl

Beginne mit einem einseitigen Problem Frame:

| Feld | Beispiel |
|---|---|
| Nutzerentscheidung | Ein Support-Mitarbeiter braucht eine zitierfähige, sichere interne Wissensantwort. |
| Nichtziel | Kein autonomer Schreibzugriff in Commerce-, CRM- oder ERP-nahe Systeme. |
| Qualitätsattribute | Nachvollziehbarkeit, Tenant-Grenze, P95-Latenz, Verfügbarkeit, Kosten pro Anfrage, Harm-/Leakage-Rate. |
| Annahmen | Inhalte sind klassifiziert und haben Owner; Domain kann Quelle und Zweck zulassen. |
| Unsicherheiten | Reale Last, Datenqualität, Providerverhalten, rechtliche Freigabe. |
| Reversibilität | Read-only, Feature Flag, kleine Nutzergruppe, kein Datenwrite. |
| Stop-Kriterium | Keine zitierbare Quelle, Policy-Fehler, Überbudget oder zu hohe Fehlantworten. |

Ohne diesen Rahmen wird die Tooldiskussion fast immer zum Stellvertreterkonflikt.

### 2. Capability Map statt Produktliste

Eine Capability Map zerlegt nicht nach Produkten, sondern nach dauerhaften Fähigkeiten:

```text
Trustworthy AI Capability
├── Identity and purpose propagation
├── Data classification and source approval
├── Retrieval and citation
├── Model routing and fallback
├── Tool authorization and human approval
├── Evaluation and safety evidence
├── Runtime telemetry and incident response
├── Cost attribution and limits
└── Developer self-service and lifecycle ownership
```

Für jede Fähigkeit wird festgehalten: Owner, Current State, Zielzustand, Schnittstelle, Abhängigkeit, Risiko, Messwert und nächste Welle. So wird sichtbar, ob ein „AI-Projekt“ eigentlich ein Data-Governance-, Identity- oder Betriebsprogramm ist.

### 3. Golden Path mit bewusstem Rand

Ein Golden Path bietet ein kleines, produktionsnahes Referenzmuster:

1. Ein Domain-Service erzeugt einen Request anhand serverseitig validierter Identität.
2. Ein AI Access Contract prüft Schema, Purpose und Klassifikation.
3. Eine Policy Decision erlaubt, begrenzt oder verweigert Retrieval und Modellroute.
4. Retrieval liefert nur genehmigte Quellen und strukturiert Citation-Metadaten.
5. Ein Modelladapter wählt nur eine erlaubte Route und setzt Timeouts, Budget und Fallback.
6. Safety/Evaluation prüft Risikoindikatoren; bei unklarer Antwort wird abgebrochen oder an Human Review übergeben.
7. Response, Decision-Ref, Modell-/Policy-/Knowledge-Version und Auditkorrelation werden zurückgegeben.
8. Telemetrie enthält nur datensparsame Attribute; Rohinhalte haben separate, strengere Regeln.
9. Feature Flag aktiviert nur eine kleine Population; ein Kill Switch deaktiviert den Pfad.

**Wichtig:** Ein Golden Path ist kein Zwang, alle Team- und Fachdomänen gleich zu machen. Er standardisiert die gefährlichen und wiederkehrenden Grenzen. Abweichungen sind möglich, brauchen aber einen dokumentierten Grund, Owner, kompensierende Kontrolle und Reviewtermin.

### 4. Contract Tests und negative Tests

Der Principal fordert nicht nur „Tests“, sondern die passendsten Tests für eine grenzüberschreitende Behauptung:

| Behauptung | Positiver Test | Negative Probe | Aussagegrenze |
|---|---|---|---|
| Tenant-Isolation | Gültiger Tenant sieht nur erlaubte Quelle. | Fremder Tenant Claim wird serverseitig verworfen. | Kein Nachweis realer Mandantentrennung ohne Zielumgebung. |
| Purpose Limitation | Zulässiger Zweck erhält Read-only-Antwort. | Zweck `tool-write` wird abgewiesen. | Keine rechtliche Freigabe durch Test. |
| Degradation | Provider Timeout führt zu kontrollierter Fallback-Antwort. | Retry-Sturm wird durch Circuit Breaker begrenzt. | Kein Nachweis echter Providerresilienz. |
| Auditability | Korrelations-ID verbindet Policy, Retrieval und Antwortmetadaten. | Fehlende ID blockiert Seiteneffekt. | Kein Ersatz für manipulationssichere Langzeitaufbewahrung. |
| Kostenlimit | Budgetzähler stoppt die Route oberhalb der Grenze. | Fehlerhafte Cost-Tag-Zuordnung erzeugt Alarm und Fail-safe. | Kein realer Rechnungsnachweis. |
| Contract-Evolution | Additives Feld wird akzeptiert. | Breaking Schemaänderung wird in CI blockiert. | Keine Garantie für alle Consumer ohne Inventar. |

### 5. Ein Rollout ist ein Experiment mit Schadensgrenze

Ein sicherer Rollout hat Population, Flag, Messung, Abbruch und Kommunikation:

```text
0 %  : Contract, policy, static evaluation and failure injection
1 %  : internal users, read-only, elevated review
5 %  : selected workflow, cost/quality/reliability dashboard
25 % : second domain adoption only if first gate meets criteria
100 %: only after operations owner, support model and retirement plan exist
```

Das Prozentzeichen allein ist keine Sicherheit. Bei sensiblen Daten oder schädlichen Seiteneffekten kann ein einzelner Request zu viel sein. In diesem Fall gelten Freigabe, Simulation, synthetische Daten, isolierte Umgebung oder ein Human Gate vor Reichweite.

## Skalierbarkeit und Performance

Skalierung beginnt mit einem Lastmodell. „Kubernetes“, „Serverless“ oder „mehr GPUs“ sind keine Antworten, solange nicht klar ist, welche Last, welche Konsistenz, welche Latenz, welche Fehlerklasse und welche Kosten pro Wertschritt gemeint sind.

### Lastprofil

Für einen AI-gestützten Referenzpfad werden mindestens erfasst:

- Requests pro Sekunde und gleichzeitige Sessions, getrennt nach interaktiv, Batch und Toolworkflow;
- Prompt-/Kontext-/Output-Token oder ein äquivalentes Größenmaß;
- Retrieval-Fan-out, Top-k, Indexlatenz, Cache-Hit-Rate und Quellenalter;
- Modellroute, Queueing, First-Token- und vollständige Antwortlatenz;
- Policy-/Safety-/Tool-Latenz und deren Anteil am End-to-End-Budget;
- Fehlerklassen, Retry-Verhalten, Abbrüche und Zeitüberschreitungen;
- Kosten pro Workflow, Produkt, Tenant und nützlicher Antwort;
- Datenwachstum, Index-Rebuild-Zeit, Retention und Rehydration.

End-to-End-Latenz ist additiv:

```text
T_total =
  T_auth + T_policy + T_retrieval + T_queue + T_model +
  T_safety + T_tool + T_network + T_serialization
```

Der Ausdruck ist kein exaktes physikalisches Modell; er zwingt zur Diagnose. Wenn `T_model` dominiert, hilft ein schnellerer API-Gateway kaum. Wenn `T_retrieval` stark streut, sind Quellenqualität, Filter, Index, Netzwerk und Fan-out wichtiger als ein Modellwechsel. Wenn `T_queue` wächst, ist Überlastschutz, Admission Control oder Kapazität der Hebel.

### Skalierungsentscheidungen

| Entscheidung | Geeignet wenn | Preis / Risiko | Principal-Prüfung |
|---|---|---|---|
| Caching | Antworten oder Retrievalresultate sicher wiederverwendbar sind. | Stale/tenant-falsche Inhalte, schweres Invalidation. | Cache Key muss Identität, Zweck, Quelle/Version und Policygrenze berücksichtigen. |
| Asynchroner Workflow | Nutzer nicht auf Ergebnis warten muss. | Zustandsmanagement, Duplicate Delivery, UX-Komplexität. | Idempotenz, Statusmodell, Timeout, Aufbewahrung und Supportpfad festlegen. |
| Queue und Backpressure | Lastspitzen nicht sofort bedient werden müssen. | Warteschlange kann Fehler verstecken; Prioritätsinversion. | Max Queue Age, Drop-/Retry-Regel, Fairness und Cost Limit messen. |
| Mehr Modellrouten | Workloads unterschiedliche Qualität/Latenz/Kosten brauchen. | Evaluation und Governance vervielfachen sich. | Jede Route braucht Freigabe, Version, Datenregel, Fallback und Kostenbudget. |
| Sharding/Partitioning | Daten- oder Tenant-Grenzen echte Skalierungsgrenze sind. | Rebalancing, Cross-partition Queries, Betriebslast. | Fachliche und rechtliche Grenzlogik vor Infrastrukturpräferenz. |
| Precomputation | Inhalte langsam, aber häufig gefragt sind. | Veraltete Ergebnisse, Speicher- und Buildkosten. | Freshness-SLO und Invalidation Owner bestimmen. |

### Performance-Anti-Pattern

- Eine globale Singleton-Runtime als einziger Weg für alle Workloads bauen.
- In jedem Request mehrere externe Modelle ohne Budget, Deadline und Fallback aufrufen.
- Prompt, Retrieval, Tool und Response in denselben unstrukturierten Logeintrag schreiben.
- Autoscaling als Ersatz für Admission Control verwenden.
- P50 statt Tail-Latenz und Nutzerabbruch messen.
- Kosten erst nach breiter Adoption betrachten.
- Produktionslast mit synthetischer Tokenlast gleichsetzen.

## Reliability und Failure Modes

Ein Principal behandelt Fehler nicht als Betriebsdetail. Jede Architekturentscheidung erzeugt Fehlerformen und eine Verantwortung für deren Begrenzung. SLOs geben ein gemeinsames Ziel für Zuverlässigkeit und Liefergeschwindigkeit; ein Error Budget kann eine Governance-Eingabe sein. Es ersetzt weder Security-/Privacy-Grenzen noch fachliche Schadensbewertungen.

### Failure-Mode-Katalog

| Fehler | Frühes Signal | Begrenzung | Betreiberentscheidung |
|---|---|---|---|
| Identity-/Claim-Fehler | Anstieg policy deny, Signaturfehler, unbekannte Claims | Fail closed für sensible Pfade; klare Fehlermeldung ohne Leak | Contract ändern, IdP-Integration prüfen, keine clientseitige Umgehung. |
| Retrieval-Leakage | Fremde Quelle, falsche Klassifikation, fehlende Citation | Source allowlist, serverseitiger Filter, Audit, sofortiger Kill Switch | Incident und Datenklassifikationsreview; nicht nur Prompt ändern. |
| Modell-/Provider-Timeout | Tail latency, Queueing, Timeout rate | Deadline, Circuit Breaker, knapper Fallback, keine unendlichen Retries | Qualität vs. Verfügbarkeit bewusst wählen. |
| Halluzination / Low confidence | Citation mismatch, Evaluation Drop, Nutzerkorrekturen | Abstention, Zitierpflicht, Human Gate, strengere Source Scope | Route, Retrieval oder Problemdefinition ändern. |
| Tool-Seiteneffekt falsch | Idempotency conflict, denied scope, Auditlücke | Read-only default, explicit command, Approval, State check | Toolzugriff aussetzen, betroffene Aktionen nachvollziehen. |
| Cost runaway | Token-/Request-Anomalie, Fan-out, Cache miss spike | Tenant-/Workflowlimit, Budget alarm, rate limit | Produktnutzen gegen Unit Cost prüfen, nicht nur global drosseln. |
| Schema-/Contract-Bruch | Consumer errors, dead letters, contract test failure | Versionierung, additive Änderungen, Canary, Consumer inventory | Migration Welle stoppen oder Kompatibilitätsadapter bereitstellen. |
| Beobachtungsblindheit | fehlende correlation, cardinality explosion, Datenredaktion | Telemetry schema, sampling policy, separate audit store | Nicht aus fehlenden Daten auf Erfolg schließen. |
| Menschlicher Prozessfehler | verzögerte Reviews, unklare Eskalation | Rollen, Zeitbudget, Ersatzpfad, Training, Runbook | Human Gate nicht als unsichtbare Dauerwarteschlange betreiben. |

### Degradation ist Produktverhalten

Für jedes kritische Abhängigkeitsproblem wird festgelegt, welche Antwort für Nutzer sicher und ehrlich ist:

- **Fallback to search:** Nur Quellenliste oder klassische Suche, wenn Generierung unsicher ist.
- **Abstention:** „Ich kann dazu derzeit keine verlässliche Antwort erzeugen“ mit weiterem Pfad.
- **Queue:** Anfrage an asynchronen Workflow, wenn das Ergebnis später nutzbar ist.
- **Human escalation:** Bei hoher Wirkung oder nicht ausreichend automatisierbarer Prüfung.
- **Read-only mode:** Keine Tool- oder Schreiboperationen.
- **Hard stop:** Bei Policy, Klassifikation, Audit oder sicherheitskritischen Zweifeln.

„Best effort“ ohne sichtbare Unsicherheit ist für Enterprise- und GenAI-Systeme häufig ein Anti-Pattern.

## Security, Governance und Compliance

Die Principal-Rolle schafft keine Rechtsfreigabe, sie stellt die richtigen technischen Fragen so, dass Legal, Security, Privacy und Risk überhaupt entscheiden können. NIST AI RMF kann als Rahmen für risikobewusstes AI-Management dienen; seine Anwendung muss auf konkrete interne Kontrollen, Länder, Verträge und Use Cases übersetzt werden.

### Minimale Control Plane

```text
Policy sources           Decision point             Enforcement points
---------------          --------------             ------------------
data classification ---> policy engine -----------> API / retrieval filter
retention rule -------> approval workflow -------> tool gateway
identity assurance ---> risk / purpose rule -----> model route
model approval -------> audit obligation --------> response / telemetry
```

**Kontrollen, die getrennt bleiben müssen:**

- Authentisierung: Wer oder welches Workload ist beteiligt?
- Autorisierung: Welche Fachaktion darf es ausführen?
- Datenklassifikation und Zweck: Welche Informationen dürfen für welchen Zweck verarbeitet werden?
- Modell-/Providerfreigabe: Darf dieser Daten- und Workloadtyp diese Route nutzen?
- Safety: Ist die generierte Handlung oder Antwort zulässig?
- Audit: Welche Entscheidung und welche Version müssen nachvollziehbar bleiben?
- Logging: Welche Betriebsdaten dürfen wie lange und in welcher Redaktion gespeichert werden?

Ein Policy Engine kann Entscheidungen koordinieren. Sie darf nicht stillschweigend zur einzigen fachlichen Autorisierungsquelle werden, wenn die Geschäftsregel in einer Domäne liegt. Der Tool Gateway muss nach der Policy-Entscheidung trotzdem die Domain-Autorisierung und den aktuellen Zustand prüfen.

### Threat Modeling für den Programmfall

| Threat | Angriffs-/Fehlerpfad | Kontrolle | Evidenz |
|---|---|---|---|
| Prompt Injection | Dokument oder Nutzertext beeinflusst Toolentscheidung. | Untrusted Content markieren, Toolrechte nicht aus Prompt ableiten, structured tool policy, Human Gate. | Negative Testdokumente, denied tool attempt, audit entry. |
| Data Exfiltration | Retrieval oder Log enthält fremde/klassifizierte Daten. | Tenant-/ACL-Filter serverseitig, data minimization, redaction, egress boundaries. | Access test, query audit, retention review. |
| Confused Deputy | AI-Service nutzt sein starkes Workloadrecht für Nutzeraktion. | Delegated identity, scope narrowing, explicit command, domain re-authorization. | Token/claim review, denied escalation test. |
| Supply Chain | Prompt, Model, Plugin oder Dependency ändert sich unbemerkt. | Version pinning, SBOM, signed artifacts, review, rollback. | Build attestation, registry policy, change log. |
| Model abuse / cost abuse | Unkontrollierte Token, fan-out oder automatisierte Schleife. | Rate limit, token/time/budget caps, circuit breaker, anomaly alert. | Load test, budget stop test. |
| Audit gap | Entscheidung ist nachträglich nicht rekonstruierbar. | Correlation, immutable event target, access-controlled evidence, clock rule. | Trace/audit drill, missing-event alert. |

### Governance als Entscheidungsfluss

Governance ist wirksam, wenn sie Entscheidungen beschleunigt oder Risiken begrenzt. Ein pragmatischer Ablauf:

1. Domain formuliert Problem, Datenklasse, Zweck, erwarteten Nutzerwert und Schadensprofil.
2. Architektur/Security/Privacy identifizieren die harten Grenzen und offene Fragen.
3. Ein kleiner, reversibler Referenzpfad wird mit klarer Accept-/Reject-Evidenz genehmigt.
4. Telemetrie, Evaluation, Kosten und Incident-Signale werden regelmäßig an einem Decision Gate betrachtet.
5. Nur eine bewiesene Fähigkeit wird als Standard oder Self-Service-Angebot verbreitet.
6. Ausnahmen erhalten Ablaufdatum, Owner und Rückkehrplan zum Standard oder bewusste Ablösung.

Das Gegenteil ist ein Gremium, das nur Tools freigibt, aber Datenflüsse, Kontrollwirksamkeit, Betrieb und Exit offenlässt.

## Observability und Troubleshooting

Observability ist eine Fähigkeit, neue Fragen aus extern sichtbarem Verhalten beantworten zu können. Für Principal-Programme verbindet sie Produkt-, Qualitäts-, Betriebs-, Sicherheits- und Kostensignale. Eine reichhaltige Trace ist nicht automatisch gut: sensible Inhalte, übermäßige Kardinalität und Kosten können das Signal entwerten.

### Signalmodell

| Ebene | Beispielsignale | Entscheidung |
|---|---|---|
| Nutzerwert | Task completion, hilfreiche Citation, Abbruch, Eskalation | Use Case ausweiten, UX/Scope ändern oder stoppen. |
| Modell-/RAG-Qualität | groundedness, citation coverage, eval slice, retrieval miss | Route, Quelle, Chunking oder Abstention ändern. |
| Zuverlässigkeit | availability, P95/P99, timeout, queue age, error budget burn | Rollout bremsen, Kapazität/Degradation/Dependency korrigieren. |
| Sicherheit | policy deny, cross-tenant attempt, tool denial, classification conflict | Incident, Policy-/Contract-Review, ggf. Hard Stop. |
| Kosten | cost/request, cost/completed task, model share, cache hit, anomaly | Budget, Routing, Limit, Produktwert prüfen. |
| Adoption | active teams, template completion, exception aging, support lead time | Golden Path vereinfachen oder Standard nicht erzwingen. |
| Änderbarkeit | deploy lead time, rollback duration, contract break rate, unowned components | Investition in Tests, Ownership, Plattform oder Entkopplung. |

Ein guter Dashboard-Name benennt Entscheidung und Owner: `AI reference path – expand gate`, nicht nur `AI metrics`.

### Trace- und Event-Konvention

Nutze einen Correlation Key über API, Policy, Retrieval, Modellroute, Tool und Audit. Berücksichtige dabei:

- keine Rohprompts oder vollständigen personenbezogenen Inhalte in Standardspans;
- versionierte Attribute für `model.route`, `policy.decision`, `knowledge.scope`, `feature.flag` und `degradation.mode`;
- strikte Trennung zwischen Betriebslogs und hochsensitiven Audit-/Forensikdaten;
- Sampling-Regeln, die Fehler-, Deny- und hochriskante Pfade eher bewahren als triviale Erfolgsfälle;
- klare Aufbewahrung, Zugriff und Löschregeln;
- Runbooklinks direkt aus Alarmen.

OpenTelemetry-Semantik kann eine gemeinsame technische Sprache liefern. Sie ersetzt nicht das organisationsspezifische Datenmodell oder eine Datenschutzentscheidung.

### Troubleshooting Playbook: Antwort ist langsam, teuer und schlecht begründet

1. **Sicherheit vor Geschwindigkeit:** Prüfe zunächst, ob Policy, Klassifikation oder Tenant-Grenze verletzt sein könnten. Bei Zweifel keine schnellere Umgehung konfigurieren.
2. **Request-Slice bestimmen:** Interaktiv/Bulk, Modellroute, Datenklasse, Tenant/Produkt, Region/Umgebung, neue Version/Flag.
3. **End-to-End zerlegen:** `T_policy`, `T_retrieval`, `T_queue`, `T_model`, `T_tool` und Clientabbruch vergleichen.
4. **Qualität nicht aus Latenz ableiten:** Citation Coverage, Retrieval Miss, Evaluationsslice und Nutzerfeedback gegen denselben Slice prüfen.
5. **Kostenattribution validieren:** Fehlende Tags oder doppelte Retries können Unit Cost verfälschen.
6. **Recent Change suchen:** Prompt, Route, Index, Contract, Flag, Dependency, Quota und Secretrotation.
7. **Degradation aktivieren:** Wenn Qualitäts- oder SLO-Grenze verletzt ist, auf sichere Quellenliste, Abstention oder Read-only wechseln.
8. **Hypothese dokumentieren:** Maßnahme, erwartetes Signal, Zeitfenster, Owner und Stopbedingung festhalten.
9. **Root Cause und Systemfolgerung:** Nicht nur Parameter zurücksetzen: Contract, SLO, Kostenlimit, Ownership oder Architekturgrenze bei Bedarf ändern.

## Cost und FinOps

FinOps ist keine nachträgliche Einkaufsprüfung. In AI-, Plattform- und Cloud-Programmen müssen Engineering, Finance, Procurement und Product die Kostenmechanik gemeinsam sichtbar machen. Der FinOps Framework beschreibt diese Zusammenarbeit als kontinuierliche Fähigkeit; die konkrete Implementierung bleibt organisations- und vertragsabhängig.

### Unit Economics für AI-Fähigkeiten

Ein brauchbares Modell ordnet Kosten einem Wertschritt zu:

```text
Cost per completed task =
  (model input + model output + embedding + retrieval +
   storage + network + platform allocation + human review +
   incident/rework allocation)
  / completed tasks with defined quality threshold
```

Die Formel ist absichtlich nicht „Cost per request“. Ein billiger Request ohne nützliche Antwort kann teuer sein. Ein teurer Workflow mit klarer, geprüfter Zeitersparnis kann wirtschaftlich sein. Zu jedem Nenner gehört eine Qualitätsdefinition: etwa eine vollständig erledigte Aufgabe mit zitierbarer Antwort, ohne Policy-Verstoß, innerhalb eines Time Budgets.

### FinOps-Entscheidungen

| Frage | Evidenz | Entscheidungsmuster |
|---|---|---|
| Welcher Workload braucht welches Modell? | Qualitäts-, Latenz-, Harm- und Kostenvergleich pro Slice. | Route nach Anforderung, nicht nach Modellprestige. |
| Wer trägt Kosten? | Produkt-/Tenant-/Workflowattribution und Datenklassifikation. | Showback zuerst; Chargeback nur mit belastbarer Zuordnung und Governance. |
| Wann cachen oder vorrechnen? | Wiederholrate, Freshness, Isolation, Speicher- und Invalidationkosten. | Cache nur mit klarer Berechtigungs- und Freshness-Regel. |
| Wie begrenzen wir Ausreißer? | Budget burn, token/request, fan-out, retry rate, Quota. | Per Workload/Produkt begrenzen, nicht nur global. |
| Kaufen, bauen oder standardisieren? | Total cost of ownership: Skills, Security, Exit, Support, Vertrags- und Plattformkosten. | Reversible Pilotoption, bevor eine breit schwer reversible Wahl erfolgt. |

Kostenargumente dürfen Security, Privacy, Verfügbarkeit oder fachlichen Schaden nicht übersteuern. Ein günstiger Pfad mit unzulässiger Datenverarbeitung ist kein valider Trade-off.

## Trade-offs und Anti-Patterns

### Wesentliche Trade-offs

| Spannungsfeld | Falsche Vereinfachung | Reife Entscheidung |
|---|---|---|
| Zentraler Standard vs. Domain-Autonomie | Alles zentral oder alles frei. | Gemeinsame harte Grenzen und Verträge; Domänen besitzen Inhalte, Fachregeln und Outcome. |
| Geschwindigkeit vs. Kontrolle | Kontrolle ist stets Bremse. | Kleine reversible Pfade, automationsfähige Guardrails und klare Entscheidungszeiten. |
| Modellqualität vs. Kosten/Latenz | Immer das stärkste Modell. | Workload- und Risikoslice, Evaluation, Budget und Fallback. |
| Self-Service vs. Plattformverantwortung | Ein Portal macht Teams autonom. | Produktisierte Plattform mit Docs, Beispiel, Support, SLO, Lifecycle und Feedback. |
| Observability vs. Datenschutz | Alles loggen oder nichts loggen. | Datensparsame Semantik, getrennte Schutzklassen, Sampling, Retention und Auditbedarf. |
| Langfristiges Ziel vs. aktueller Wert | Erst alles standardisieren. | Eine wertvolle Fähigkeit klein beweisen und anschließend standardisieren. |
| Reversibilität vs. Klarheit | Jede Entscheidung provisorisch lassen. | Revisit-Trigger, Exit-Plan und Entscheidungslimits, damit Unsicherheit nicht Dauerzustand wird. |

### Anti-Patterns

1. **Der Architektur-Zoo:** Für jede Domäne entsteht ein eigener Stack, weil kein Contract und kein Referenzpfad existiert.
2. **Der Plattform-Monolith:** Eine zentrale Gruppe übernimmt Fachdaten und Delivery jeder Domäne; Teams umgehen sie später.
3. **Der Executive-Deck-Ersatz:** Zielbilder haben keine Current-State-Analyse, Übergangskosten, Owner oder Stop-Kriterien.
4. **Der Standard ohne Adoption:** Ein Template wird „verbindlich“, obwohl es keine Tests, Dokumentation, Support oder echte Zeitersparnis gibt.
5. **Der Governance-Bypass:** Ein Pilot wird zur Produktion, weil seine zeitliche Begrenzung und Decision Gates nie geprüft werden.
6. **Der Metrics-Theater-Loop:** Viele Dashboards, aber keine Schwelle, kein Owner und keine Änderung nach Signal.
7. **Der Budget-Blindflug:** Kosten werden erst nach Skalierung gemessen und lassen sich nicht Nutzerwert oder Produkt zuordnen.
8. **Das Prompt-als-Policy-Missverständnis:** Sicherheits- oder Berechtigungsregeln liegen nur im Prompt statt in erzwingbaren Systemgrenzen.
9. **Die dauerhafte Ausnahme:** Teamabweichungen haben kein Ablaufdatum und werden still zu zweiten Standards.
10. **Die Title Inflation:** Wirkung wird über den Rollentitel behauptet statt über Entscheidungen, Artefakte, Adoption und Resultate.

## Staff-, Principal- und Chief-Level Decisions

Die Ebenen sind keine Rangliste; sie unterscheiden überwiegend Reichweite, Zeithorizont und Art der Entscheidung.

| Perspektive | Leitfrage | Typische Entscheidung | Nachweis |
|---|---|---|---|
| **Hands-on / Senior** | Funktioniert diese Komponente korrekt und sicher? | API, Retry, Test, Dashboard, Bugfix. | Reproduzierbarer Code, Test, Betriebssignal. |
| **Staff** | Wie lösen mehrere Teams einen konkreten technischen Engpass? | Referenzpfad, Contract, Working Agreement, Coaching, mehrteamiger Rollout. | Adoption, weniger Rework, sichere Änderungen, technische Tiefe. |
| **Principal** | Welche mehrjährige technische Richtung, Übergangsreihenfolge und Investitionsoption bringt mehrere Programme zusammen? | Target/Transition Architecture, Entscheidungssystem, Standardgrenze, Portfolioabhängigkeit, Exit-/Risikologik. | Wiederholbare Wirkungs- und Entscheidungskette über Programme hinweg. |
| **Chief** | Welche Fähigkeiten, Risiken und Investitionen muss die Organisation als Ganzes wählen? | Technologieportfolio, Capability-Aufbau, Governance-/Operating Model, Investitionsrahmen. | Strategische Outcomes, Risikotransparenz, verantwortete Organisationsevidenz. |

### Principal-Entscheidungen im Detail

**A. Die richtige Einheit der Veränderung wählen.**  
Nicht „AI-Plattform bauen“, sondern zum Beispiel „zitierfähige, tenant-sichere Read-only-Knowledge-Assistance für zwei klar abgegrenzte Workflows ermöglichen“. Diese Einheit besitzt Outcome, Risiko, Owner und Testbarkeit.

**B. Standardgrenze festlegen.**  
Standardisiere das, was im Fehlerfall systemisch schadet oder Wiederholungskosten erzeugt: Identity Propagation, Klassifikation, Audit, Telemetrie, Contract-Tests, Safe Defaults, Lifecycle. Lasse Domänen entscheiden, was fachliche Semantik, Inhalte, UX und interne Implementierungsdetails betrifft.

**C. Übergang vor Zielperfektion entscheiden.**  
Für ältere Schnittstellen kann ein Adapter, Shadow Read, Dual Write mit Prüfsumme oder eventbasierte Reconciliation nötig sein. Der Principal entscheidet, welche Übergangsschuld vertretbar ist, wie sie beobachtet und bis wann sie abgebaut wird. Dual Write ohne Source-of-Truth und Abgleichplan ist kein Übergang, sondern ein Datenrisiko.

**D. Investments und Stopps sichtbar machen.**  
Ein Programm braucht explizite Entscheidungen: Was erhält ein Team als Enablement? Welche Legacy-Fähigkeit wird nicht weiter erweitert? Welche Metrik beweist Wert? Wann wird ein Pilot beendet? Das schützt Teams vor stiller Dauerarbeit und schützt Führung vor scheinbarer Planbarkeit.

**E. Gegensätzliche korrekte Perspektiven vermitteln.**  
Security kann strengere Grenzen verlangen, Product schnellere Delivery, SRE weniger Betriebsvarianz, Finance Kostendeckel, und Domains Autonomie. Principal löst das nicht per Machtwort. Er macht Kriterien, Risiko und Folgen vergleichbar, stellt Varianten dar und sichert die Entscheidung mit Owner, Datum und Revisit-Trigger.

### Chief-Entscheidungen, die nicht vorweggenommen werden dürfen

Ein Principal bereitet Chief-Entscheidungen vor, ersetzt sie aber nicht. Dazu gehören etwa unternehmensweite Risikotoleranz, Organisationsstruktur, mehrjährige Budgetrahmen, regulatorische Selbstverpflichtungen, Akquisitionen, große Providerverträge, Dezentralisierungsgrad und formale Mandate. Im Lernportfolio sollte sichtbar bleiben, wo eine Principal-Empfehlung endet und ein zuständiges Governance- oder Executive-Entscheidungsgremium beginnt.

## Production Checklist

Diese Checkliste ist ein Reviewinstrument. Ein Häkchen beweist keinen Produktionsbetrieb.

### Problem und Outcome

- [ ] Ein konkreter Nutzer- oder Risikotreiber ist beschrieben.
- [ ] Nichtziele begrenzen Scope und Seiteneffekte.
- [ ] Wert-, Qualitäts-, Sicherheits- und Kostenhypothese sind getrennt formuliert.
- [ ] Baseline, Zielwert, Messfenster und Stop-/Revisit-Kriterien existieren.
- [ ] DRI für Outcome, Contract, Betrieb, Daten und Ausnahme ist benannt.

### Architektur und Transition

- [ ] Context-, Runtime-, Deployment-, Daten-/Control- und Transition-Sicht beantworten konkrete Concerns.
- [ ] Current State, Zielzustand und alle temporären Zustände haben Owner und Exit-Plan.
- [ ] APIs/Events/Datenmodelle besitzen Versionierung und Kompatibilitätsregel.
- [ ] System of Record, Reconciliation und Idempotenz für Seiteneffekte sind definiert.
- [ ] Referenzpfad enthält einen kleinen realistischen End-to-End-Workflow.
- [ ] Abweichungen haben Begründung, kompensierende Kontrolle, Ablaufdatum und Reviewtermin.

### Reliability und Security

- [ ] Nutzerrelevante SLI/SLO, Fehlerbudget-Policy und Degradationsverhalten sind festgelegt.
- [ ] Timeouts, Retry-Limits, Backpressure, Quota und Circuit Breaker sind getestet.
- [ ] Trust Boundaries, Datenklassifikation, Zweckbindung und Identity Propagation sind dokumentiert.
- [ ] Toolaufrufe sind separat autorisiert, idempotent und auditierbar.
- [ ] Secrets, Schlüssel, Workload Identity und Lieferkette haben einen Reviewpfad.
- [ ] Incident-, Sicherheits- und Datenschutzeskalation erreichen klare Owner.

### Observability und Economics

- [ ] Trace/Metric/Log/Audit-Semantik hat Datensparsamkeit, Version und Aufbewahrung.
- [ ] Dashboard und Alarm nennen Entscheidung, Schwelle und Owner.
- [ ] Kosten sind mindestens auf Workflow/Produkt/Tenant-Slice analysierbar, soweit zulässig.
- [ ] Budget- und Anomaliegrenzen sind technisch durchsetzbar.
- [ ] Qualität, Citation, Harm, Latenz, Zuverlässigkeit und Kosten werden gemeinsam betrachtet.
- [ ] Kosten-/Sicherheits-/Qualitätsausreißer können den Rollout anhalten.

### Adoption und Governance

- [ ] Ein Team kann den Golden Path ohne dauerhafte Sonderbetreuung nachvollziehen.
- [ ] Dokumentation, Template, Contract Test, Runbook und Supportweg sind auffindbar.
- [ ] Entscheidungsergebnisse, Annahmen und Revisit-Trigger sind zugänglich.
- [ ] Ausnahmepfad schützt nicht dauerhaft vor Standard- und Sicherheitsreview.
- [ ] Dekommissionierung alter Pfade ist geplant, terminiert und messbar.
- [ ] Unabhängiges Architektur-, Security- und Betriebsreview ist vor breiter Produktion vorgesehen.

## Troubleshooting: Entscheidungsdiagnosen

### „Zwei Teams wollen unterschiedliche Lösungen; wer hat recht?“

Nicht zunächst über Architekturgeschmack entscheiden. Erhebe Domänenunterschied, Datenklasse, Lastprofil, Zeitbudget, Teamfähigkeit, Integration und Risiko. Wenn die Unterschiede real sind, kann ein gemeinsamer Contract mit zwei Implementierungen sinnvoll sein. Wenn sie nur aus fehlender Transparenz entstehen, baut ein Golden Path mit klarer Standardgrenze die günstigere Konvergenz. Dokumentiere die Entscheidung samt Kosten der Variante.

### „Ein Pilot liefert positive Demos, aber keine Adoption.“

Prüfe, ob der Pilot einen produktnahen, schmerzhaften Workflow löst oder nur eine Demo optimiert. Häufige Ursachen: fehlende Owner, unklare Datenfreigabe, unbrauchbare Dokumentation, fehlender Support, zu langsamer Pfad, keine Ausnahmeregel oder zentraler Plattformzwang. Miss Time-to-first-value und Integrationsaufwand, nicht nur Demoqualität. Ein Pilot ohne wiederholbare Übernahme ist keine Plattformfähigkeit.

### „Die Plattform wird zum Flaschenhals.“

Unterscheide notwendige zentrale Kontrolle von unnötiger zentraler Delivery. Zentral bleiben sollten etwa Policy, Identity-Basics, Auditsemantik, Basistelemetrie und Plattform-SLO. Föderiert gehören Fachdaten, fachliche Autorisierung, Use-Case-Outcome und Domänenentwicklung. Baue Self-Service, dokumentierte Verträge und eine begrenzte Ausnahmeentscheidung; reduziere Ticket-Queues als Primärschnittstelle.

### „Wir kennen die Kosten, aber nicht den Nutzen.“

Die Finanzsicht muss mit einem definierten Wertschritt verbunden werden: fertig gelöster Vorgang, verkürzte Durchlaufzeit, vermiedene Fehler, bessere Citation, weniger manueller Review oder reduziertes Risiko. Wenn Nutzen nicht messbar ist, bleibt der Pfad eine Lerninvestition mit explizitem Limit, nicht eine unbefristete Produktkostenstelle. Stoppe oder verenge ihn, wenn die Hypothese nicht rechtzeitig prüfbar wird.

### „Ein Sicherheitsreview blockiert den Termin.“

Blockade ist oft ein Symptom dafür, dass Datenfluss, Zweck, Identity, Providerroute oder Kontrollnachweis zu spät eingebracht wurden. Teile den Scope in einen read-only, synthetischen oder streng abgegrenzten Referenzpfad. Baue Security/Privacy als Entscheidungspartner früh ein. Keinesfalls Sicherheitskontrollen per Prompt, Ausnahme ohne Ablaufdatum oder unprotokolliertem Direktzugriff umgehen.

## Interviewfragen mit Modellantworten

### 1. Woran erkennen Sie Principal- statt Staff-Wirkung?

**Modellantwort:** An Entscheidungsreichweite und Zeithorizont, nicht am Titel. Staff löst typischerweise einen mehrteamigen Engpass mit greifbarer technischer Nähe. Principal verbindet mehrere Programme über Target State, Transition, gemeinsame Standards, Investitionsoptionen und Risikoentscheidungen. Beides braucht sichtbare Outcomes; Principal darf nicht in Strategie ohne Referenzpfad abgleiten.

### 2. Wie verhindern Sie, dass eine Zielarchitektur nur ein Diagramm bleibt?

**Modellantwort:** Ich ergänze das Zielbild durch Current State, Annahmen, Qualitätsattribute, Verträge, Owner, Transition Waves, ADRs, Messgrößen und Stop-Kriterien. Jede Welle muss eine produktnahe Fähigkeit beweisen und einen alten oder riskanten Pfad verändern. Aus Betrieb, Kosten und Adoption lernt die Zielarchitektur zurück.

### 3. Wann standardisieren Sie eine Technologie?

**Modellantwort:** Wenn der gemeinsame Problemraum wiederkehrt, eine Variation Sicherheits-, Interoperabilitäts- oder Betriebskosten erhöht und ein kleiner Referenzpfad nachweislich Zeit oder Risiko reduziert. Ich standardisiere Verträge, Safe Defaults und Lifecycle stärker als Tools. Jede Ausnahme hat Owner, Ablaufdatum und Kriterien für Rückkehr oder bewusste Abspaltung.

### 4. Wie gestalten Sie eine AI-Plattform ohne Zentralmonolith?

**Modellantwort:** Die Plattform stellt produktisierte horizontale Fähigkeiten bereit: Identity-Integration, Policy-/Audit-Hooks, Modellrouting, Telemetrie, Evaluation, Templates und Support. Die Domain besitzt fachliche Daten, Fachautorisierung, Workflow und Outcome. Ein gemeinsamer Contract und klare Trust Boundaries verhindern sowohl Schattenlösungen als auch Plattformübernahme der Domäne.

### 5. Wie machen Sie Cloud- oder AI-Kosten entscheidbar?

**Modellantwort:** Ich ordne Kosten einem nützlichen Wertschritt zu, nicht nur Requests. Dazu kombiniere ich Modell-, Retrieval-, Plattform-, Netzwerk- und Human-Review-Kosten mit Qualitäts-, Latenz- und Sicherheitsgrenzen. Entscheidung ist dann etwa: Route ändern, Budget limitieren, cachen, Scope verengen oder stoppen. Preislisten allein reichen nicht.

### 6. Was ist Ihr Umgang mit irreversiblen Entscheidungen?

**Modellantwort:** Ich mache Irreversibilität explizit: Datenmodelle, Identity, Landing Zone oder Event Backbone benötigen Varianten, Exit-/Migrationskosten, harte Sicherheits- und Betriebsakzeptanz sowie echte Entscheider. Wo möglich, entkopple ich Schnittstellen und beweise Annahmen mit einem reversiblen Teilpfad. Ich simuliere aber keine Reversibilität, wenn Daten oder regulatorische Risiken sie nicht erlauben.

### 7. Wie nutzen Sie SLOs bei einer neuen GenAI-Fähigkeit?

**Modellantwort:** SLOs basieren auf Nutzerwirkung und Workloadklasse, beispielsweise erfolgreiche und zitierbare Read-only-Aufgaben innerhalb eines Latenzbudgets. Ich kombiniere sie mit Safety, Policy Denies, Qualitäts- und Kostenmetriken. Error Budget ist ein Input für Deliverytempo; ein Datenschutz- oder Sicherheitsbefund kann unabhängig davon stoppen.

### 8. Wie gehen Sie mit Teamkonflikten um?

**Modellantwort:** Ich übersetze Positionen in Concerns, Kriterien und Varianten. Häufig sind beide Teams unter unterschiedlichen Beschränkungen korrekt. Dann entscheide ich, was als Contract konsistent sein muss und wo bewusst Variation möglich bleibt. Entscheidung, Owner, Folgen und Revisit-Trigger werden dokumentiert; die Umsetzung erhält einen kleinen, überprüfbaren ersten Schritt.

### 9. Was aus Ihrer bisherigen Praxis stützt diese Zielrolle, und was nicht?

**Modellantwort:** Ich zeige konkrete eigene Artefakte als hands-on Kontext, etwa [Projekt/Lernfall] mit Zeitraum, Evidenzart und Grenze. Das stützt Systemdenken und technische Artefakte. Es belegt nicht automatisch eine formale Principal-Rolle, reale Mehrteamführung, Unternehmensmandat, Budget oder produktive Betriebsmetriken. Diese Lücke adressiere ich durch überprüfbare Programmfallstudien und gezielte Rolle mit echtem Scope.

### 10. Welche Kennzahl würde Sie dazu bringen, ein erfolgreiches Programm anzuhalten?

**Modellantwort:** Eine einzelne Kennzahl reicht selten. Ich halte oder verenge den Rollout bei hartem Security-/Privacy-Befund, fehlender fachlicher Zulässigkeit, unakzeptabler Schadensrate oder fehlender Auditierbarkeit. Bei Nutzen- oder Wirtschaftlichkeitszweifeln nutze ich vorher vereinbarte Kriterien: kein messbarer Workflowwert, schlechte Citation/Evaluation, anhaltender SLO-Burn oder Kosten außerhalb des begründeten Limits. Der Stop ist eine Entscheidung, kein Scheitern des Lernens.

## Praktisches Lab: Mehrteamiges AI-Capability-Programm als überprüfbare Fallarbeit

### Ziel und Evidenzgrenze

Erarbeite ein vollständiges, aber kleines Principal-Entscheidungspaket für eine fiktive Organisation. Der Fall verwendet **keine echten Kundendaten, keine echten Cloudkonten, keine Produktionsfreigabe und keine Behauptung realer Teams**. Er dient als Lern- und Reviewartefakt.

**Szenario:** Zwei Domänen möchten eine interne, zitierfähige Read-only Knowledge Assistance verwenden. Domäne A braucht Prozesswissen; Domäne B braucht Commerce-nahe Richtlinien. Beide wollen dieselbe Identity-/Policy-/Audit-Grundfähigkeit, aber unterschiedliche Quellen und Qualitätsziele.

### Voraussetzungen

- Markdown-Repository und Git;
- ein lokaler Editor;
- optional ein lokaler Testserver oder Mocks;
- Beispiel-JSON/YAML ohne personenbezogene oder vertrauliche Daten;
- die Abhängigkeitsartikel KB-0002, KB-0004, KB-0005, KB-0006 und KB-0009.

### Schritt 1: Problem Frame und Capability Map

Erstelle `program/problem-frame.md` mit Nutzerentscheidung, Nichtzielen, Datenklassen, Qualität, Kostenlimit, Risiko, Owner-Rollen und Stop-Kriterien. Erstelle `program/capability-map.md` mit den neun Fähigkeiten aus diesem Artikel. Für jede Fähigkeit stehen Current State, Target, Owner-Rolle, erste Welle, Abhängigkeit und Signal.

**Prüfung:** Ein Reviewer muss aus beiden Dateien erklären können, warum ein einzelner Chatbot nicht der Scope ist.

### Schritt 2: Architecture Views und Decision Records

Erstelle:

```text
program/
  context.md
  runtime-flow.md
  transition-waves.md
  decisions/
    ADR-001-ai-access-contract.md
    ADR-002-model-routing-and-fallback.md
    ADR-003-telemetry-and-audit-boundary.md
```

Jede ADR enthält Kontext, Alternativen, Entscheidung, abgelehnte Optionen, Security-/Cost-/Operationsfolge, Owner, Akzeptanzkriterien und Revisit-Trigger. Die Runtime-Sicht zeigt mindestens Identity, Policy, Retrieval, Model Route, Tool Boundary, Audit und Telemetrie.

**Gegenprobe:** Streiche die Policy Decision aus der Runtime-Sicht. Prüfe, welche Kontrolle dann nur noch implizit durch Prompt oder UI stattfinden würde. Notiere die daraus entstehende Confused-Deputy- und Auditlücke.

### Schritt 3: Contract und Referenzdaten

Lege `contracts/ai-request.schema.json` und `contracts/ai-response.schema.json` an. Verwende synthetische Daten. Der Response muss `decision_ref`, `degradation_mode`, `model_route_version` und `citation_refs` tragen. Baue eine minimale Validator-/Mock-Implementierung, die mindestens fehlende `purpose`, unzulässige `data_classification` und falschen `tenant_id` abweist.

**Gegenprobe:** Sende einen Request mit `tenant_id` von A und einer Citation von B. Erwartung: serverseitige Ablehnung oder leerer, sicherer Response; kein Zugriff durch bloßes Prompt- oder Clientfeld.

### Schritt 4: Rollout- und Betriebsdesign

Erstelle `operations/rollout-plan.md` mit Flags, Population, SLO/SLI, Cost Limit, Alarmen, Degradation und Rollback. Ergänze `operations/runbook-slow-expensive-ungrounded.md` mit der Troubleshooting-Sequenz dieses Artikels.

**Gegenprobe:** Simuliere Modelltimeout, Retrieval-Miss, Budgetüberschreitung und fehlende Auditkorrelation. Für jede Simulation muss eine sichere Nutzerantwort, ein Alert-/Event-Signal, ein Owner und eine Stop-/Rollback-Aktion dokumentiert sein.

### Schritt 5: Entscheidungsgremium simulieren

Schreibe `program/decision-gate-1.md` aus drei Perspektiven: Domain/Product, Security/Privacy, SRE/FinOps. Jede Perspektive formuliert mindestens eine berechtigte Sorge und akzeptiert nur konkrete Evidenz. Triff danach eine Entscheidung: ausweiten, korrigieren, anhalten oder beenden. Nenne explizit, welche Fakten im Lab fehlen.

**Gegenprobe:** Versuche, den Ausbau allein mit einer schönen Architekturzeichnung zu rechtfertigen. Der Gate-Record muss dies als unzureichend ablehnen, wenn keine Contract-, Failure-, Kosten- und Adoptionsevidenz vorliegt.

### Cleanup

- Lokale Mocks und Testdaten löschen oder eindeutig als synthetisch markieren.
- Tokens, Secrets und Providerkonfiguration aus Repository und Shell-Historie entfernen.
- Feature Flags auf sicheren Default setzen.
- Alle temporären ADRs mit Status `superseded`, `rejected` oder `proposed` versehen, nicht als reale Freigabe ausgeben.
- Lab-Readme um Evidenzgrenze und fehlende unabhängige Prüfung ergänzen.

### Lab-Erfolgskriterien

- [ ] Ein Fremdtenant- und ein unzulässiger Zweckrequest werden abgewiesen.
- [ ] Ein Providerfehler führt zu einer dokumentierten Degradation statt zu unendlichen Retries.
- [ ] Response lässt sich über eine datensparsame Korrelation zu Policy-/Retrieval-/Route-Version zurückführen.
- [ ] Kostenlimit und Qualitätsgrenze können eine Expansion verhindern.
- [ ] Zwei Domänen teilen einen Contract, ohne ihre Fachdaten oder Ownership zusammenlegen zu müssen.
- [ ] Decision Gate nennt mindestens eine Entscheidung, die wegen fehlender Evidenz **nicht** getroffen wird.

## Lernpfad und Portfolioevidenz

Principal-Kompetenz entsteht aus wiederholter Wirkung, nicht aus einem einzelnen Masterdokument. Ein glaubwürdiger Lernpfad:

1. **Ein begrenzter technischer Referenzpfad:** Contract, Tests, Degradation und Telemetrie für einen sicheren Read-only Workflow.
2. **Ein mehrteamiger Fall:** Zwei unterschiedliche Domänensichten, gemeinsamer Contract und dokumentierte Konfliktentscheidung.
3. **Ein Übergangsprogramm:** Current State, Migrationswellen, Adapter/Exit und messbare Adoption.
4. **Ein wirtschaftlicher/operativer Nachweis:** Kostenmodell, SLO, Runbook, Rollback und Entscheidung bei Abweichung.
5. **Ein Portfoliomuster:** Mehrere Fälle, aus denen gemeinsame Capability, Standardgrenze und Investitionsannahme abgeleitet werden.

Das Portfolio sollte zeigen, *wie* entschieden wurde: Varianten, Gegenargumente, Tests, Grenzen, spätere Korrekturen und nicht nur das Enddiagramm. Besonders wertvoll sind Dokumente, in denen eine ursprüngliche Annahme aufgrund von Evidenz geändert oder ein Vorhaben bewusst gestoppt wurde.

## Dependencies und Cross-References

### Direkt vorausgesetzt

- [KB-0002 – Rollen- und Kompetenzmodell](../00-navigation-governance/02-rollen-kompetenzmodell-und-tiefenstufen.md)
- [KB-0004 – Selbsteinschätzung und Evidenzgrenzen](../00-navigation-governance/04-cv-istbild-und-zielkompetenzen.md)
- [KB-0005 – Kompetenzcanvas und Wirkungskette](../00-navigation-governance/05-kompetenzcanvas-und-wirkungskette.md)
- [KB-0006 – Hands-on-, Architect-, Staff- und Chief-Arbeitsmodell](../00-navigation-governance/06-hands-on-architect-staff-chief-arbeitsmodell.md)
- [KB-0009 – Labstrategie, Evidenz und Gegenproben](../00-navigation-governance/09-labstrategie-evidenz-und-gegenproben.md)

### Rollenvergleich und Vertiefung

- [KB-0022 – Staff Engineer als Zielrolle](12-staff-engineer-als-zielrolle.md)
- [KB-0024 – Distinguished Engineer als Rollenmodell](14-distinguished-engineer-als-rollenmodell.md)
- [KB-0011 – GenAI Solution Architect als Zielrolle](01-genai-solution-architect-als-zielrolle.md)
- [KB-0013 – AI Platform Architect als Zielrolle](03-ai-platform-architect-als-zielrolle.md)
- [KB-0014 – Platform Architect als Zielrolle](04-platform-architect-als-zielrolle.md)
- [KB-0015 – Enterprise Architect als Zielrolle](05-enterprise-architect-als-zielrolle.md)
- [KB-0016 – Cloud Architect als Zielrolle](06-cloud-architect-als-zielrolle.md)
- [KB-0020 – MLOps Architect als Zielrolle](10-mlops-architect-als-zielrolle.md)
- [KB-0021 – LLMOps Architect als Zielrolle](11-llmops-architect-als-zielrolle.md)

### Spätere kanonische Anwendung

- KB-0221 – GenAI-/LLM-Solution-Architecture
- KB-0550 – Platform Engineering und Developer Platform
- KB-0565 – Cloud Architecture und Landing Zones
- KB-0612 – Governance, Compliance, Privacy und AI Safety
- KB-0720 – Integrierende Staff-/Principal-/Chief-Architekturpraxis

## Quellen und Aktualitätsnotizen

| Quelle | Verwendung | Stand |
|---|---|---|
| Dateikatalog 720 | Verbindlicher Scope, Reihenfolge und Rollenfokus. | Planstand 2026-09-14 |
| [ISO/IEC/IEEE 42010:2022](https://www.iso.org/standard/74393.html) | Architekturdescription, Stakeholder, Concerns und Views. | Abgerufen 2026-09-15 |
| [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/) | Nutzerbezogene SLO-/SLI-Argumentation und Workloadunterschiede. | Abgerufen 2026-09-15 |
| [Google SRE: Embracing Risk](https://sre.google/sre-book/embracing-risk/) | Error Budget als Signal zwischen Zuverlässigkeit und Delivery. | Abgerufen 2026-09-15 |
| [FinOps Framework](https://www.finops.org/framework/) | Kollaborative Entscheidungsfähigkeit für Cloudkosten und Wert. | Abgerufen 2026-09-15 |
| [NIST AI Risk Management Framework 1.0](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf) | Risikobewusste AI-Governance als Rahmen, keine automatische Rechtsfreigabe. | Abgerufen 2026-09-15 |
| [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/) | Gemeinsame Semantik für Telemetrieattribute und Interoperabilität. | Abgerufen 2026-09-15 |
| [Backstage Software Catalog](https://backstage.io/docs/features/software-catalog/) | Ownership-/Metadatensicht für Services, Bibliotheken, Datenpipelines und Modelle. | Abgerufen 2026-09-15 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — AI Resource Catalogs können aus einer Plattformliste eine nachvollziehbare Capability-Landkarte machen.** Backstage beschreibt AI-bezogene Ressourcen im Software Catalog und weitere AI-Integrationspunkte. **Reifegrad: Adopting.** Für Principal-Arbeit ist der Nutzen nicht ein neues Portal, sondern sichtbare Ownership, Lifecycle, Abhängigkeiten und Policy-/Operationskontext für Modelle, Skills, Wissensquellen und MCP-Schnittstellen. Risiken sind unvollständige Katalogdaten, falsches Vertrauen in eine abgeleitete Sicht und zu weitreichende Actions. Ein begrenzter Pilot katalogisiert eine nicht sensible AI-Ressource mit Owner, Klassifikation, Lifecycle, Contract und Read-only-Ansicht; Actions folgen erst nach Authentisierung, Policy, Audit und negativer Rechteprobe. Quelle: [Backstage AI Overview](https://backstage.io/docs/ai/).

**Stand 2026-09-15 — Offene Telemetrie-Semantik für GenAI beschleunigt programmweite Diagnose, wenn Datensparsamkeit Teil des Vertrags ist.** OpenTelemetry entwickelt semantische Konventionen einschließlich GenAI-bezogener Attribute weiter. **Reifegrad: Adopting.** Gemeinsame, versionierte Attribute können Modellroute, Retrieval, Toolaufruf, Fehlerklasse und Degradation über Teams vergleichbar machen. Risiken sind instabile Konventionen, sensitive Inhalte in Traces, hohe Kardinalität und die Gleichsetzung von Telemetrie mit Audit. Ein Pilot versieht nur sichere Attribute mit Version, Redaction, Sampling, Retention und Owner; ein Privacy-/Security-Review prüft ausdrücklich die negative Probe „Rohprompt im Span“. Quellen: [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/), [GenAI semantic conventions registry](https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/).

**Stand 2026-09-15 — FinOps für AI wird von Rechnungsanalyse zu Architekturfeedback.** Der FinOps Framework betont die Zusammenarbeit von Engineering, Finance und Business; für token- und workflowbasierte AI-Lasten gewinnt die Zuordnung zu Qualität und abgeschlossenem Arbeitsschritt an Bedeutung. **Reifegrad: Adopting.** Ein Principal kann Modellrouting, Retrieval, Caching, Human Review und Kapazitätsgrenzen anhand von Kosten **und** Nutzen entscheiden. Risiken sind ein Scheingenaues Kostenmodell, unzulässige Tenant-Attribution und Sparmaßnahmen, die Qualität oder Sicherheit beschädigen. Ein Pilot misst Kosten pro klar definierter, qualitätsgeprüfter Aufgabe, validiert die Attribution und trennt Budgetalarm von Sicherheitsstopps. Quelle: [FinOps Framework](https://www.finops.org/framework/).

