---
{"id": "KB-0011", "title": "GenAI Solution Architect als Zielrolle", "domain": "01", "sequence": 1, "document_type": "role", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0002", "concepts": ["Rollen-Kompetenz-Matrix", "Tiefenstufen", "Nachweisarten"], "needed_for": "understanding"}, {"id": "KB-0004", "concepts": ["Evidenzgrenzen", "zulässige Aussagen", "Zielkompetenzen"], "needed_for": "understanding"}, {"id": "KB-0005", "concepts": ["Kompetenzcanvas", "Entscheidungsreichweite", "Wirkungskette"], "needed_for": "understanding"}, {"id": "KB-0006", "concepts": ["Hands-on-Tiefe", "Architekturnachweis", "Spezialistenübergabe"], "needed_for": "understanding"}, {"id": "KB-0009", "concepts": ["Labstrategie", "Gegenprobe", "Evidenzgrenze"], "needed_for": "lab"}], "related": ["KB-0012", "KB-0013", "KB-0014", "KB-0015", "KB-0016", "KB-0105", "KB-0316", "KB-0350", "KB-0400", "KB-0434", "KB-0464", "KB-0500", "KB-0572", "KB-0618", "KB-0720"], "applies": ["KB-0400", "KB-0434", "KB-0464", "KB-0500", "KB-0572", "KB-0618", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Die Rolle baut einen begrenzten End-to-End-Use-Case mit Kontext, Modellaufruf, Toolvertrag, Evaluation, Gegenprobe und beobachtbarem Rückfallmodus.", "rationale": "Architekturentscheidungen bleiben ohne praktische Rückkopplung zu Daten-, Prompt-, Tool- und Fehlergrenzen unsicher."}, "ARCHITECT-TARGET": {"active": true, "scope": "Die Rolle wählt Use Case, Daten- und Trust Boundaries, Modell-/Toolstrategie, Qualitätsgate, Integration, Betrieb und Exit unter expliziten NFRs.", "rationale": "GenAI Solution Architecture verbindet Fachwert und technische Durchsetzbarkeit, ohne Modelloutput zur Autorität zu machen."}, "STAFF-TARGET": {"active": true, "scope": "Referenzmuster für Evals, Tooldelegation, Tracing, Human Gates und sichere Delivery werden mehreren Produktteams zugänglich gemacht.", "rationale": "Staff-Wirkung entsteht durch wiederholbare sichere Fähigkeiten und nicht durch einzelne Prompt- oder Demoerfolge."}, "CHIEF-TARGET": {"active": true, "scope": "AI-Capability, Daten- und Souveränitätsgrenzen, Risikoklassen, Make-or-Buy, Investitionsrahmen und Exit werden als Portfolio entschieden.", "rationale": "Chief-Verantwortung steuert die langfristige organisatorische Folge von AI-Einführung und nicht nur die Wahl eines Modells."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Spezialisten werden bei Modelltraining, GPU-Kernel, tiefem Netzwerk, Kryptographie, reguliertem Recht oder komplexer Safety-Evaluation eingebunden.", "rationale": "Der Solution Architect trägt die Integrationsentscheidung, ohne nicht belegte Spezialtiefe vorzutäuschen."}}, "lab_validation": [{"lab_id": "KB-0011-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Synthetischer B2B-Agentenfall mit lokaler oder rein dokumentierter Tool- und Retrievalgrenze", "evidence": "Der Fall enthält Use-Case-Filter, Daten- und Trust Boundaries, Evalplan, negative Toolprobe, Human Gate, Telemetrie, Kostenlimit und Rollbackentscheidung.", "limitations": "Keine reale Kundenintegration, kein Modellanbieter, keine Produktfreigabe und keine unabhängige Architekturprüfung wurden durchgeführt."}]}
---
# GenAI Solution Architect als Zielrolle

## Zweck, Definition und Scope

Ein GenAI Solution Architect übersetzt einen fachlichen Bedarf in eine sichere, messbare und betreibbare AI-Anwendung. Die Rolle entscheidet nicht nur über Modell oder Prompt. Sie verbindet Nutzerwert, Daten- und Vertrauensgrenzen, Retrieval, Toolintegration, fachliche Invarianten, Evaluation, Betrieb, Kosten und Freigabe. Das Modell liefert probabilistische Vorschläge; die Architektur legt fest, wo diese Vorschläge erlaubt sind, wo deterministische Systeme kontrollieren und wann ein Mensch entscheidet.

Diese Datei definiert ein Zielrollenmodell, keinen behaupteten aktuellen Jobtitel. Sie grenzt GenAI Solution Architecture gegenüber GenAI Engineering, AI Platform Architecture, Enterprise Architecture, Cloud Architecture und Forschung ab. Die Priorität ist hoch, weil diese Rolle der erste Zielpfad der Knowledge Base ist. MLOps/LLMOps ist eine unterstützende Spezialisierung, nicht ein isolierter Toolbereich.

Nach diesem Kapitel kann der Leser:

1. einen GenAI-Use-Case nach Wert, Datenklasse, Risiko, Fehlerkosten und Automatisierungsgrenze auswählen;
2. eine End-to-End-Architektur von Nutzerabsicht bis zu Tool-, Fach- und Auditpfad begründen;
3. Modell-, Retrieval- und Toolkomponenten von deterministischer Autorisierung und System-of-Record unterscheiden;
4. Evaluations-, Freigabe-, Observability-, Kosten- und Rollbackkriterien für einen Pilot definieren;
5. Anforderungen an Product, Security, Data, Platform, Cloud, Domainowner und Spezialisten in klare Artefakte übersetzen;
6. den eigenen vorhandenen Nachweis korrekt begrenzen und fehlende Architektur- oder Produktionsnachweise gezielt als Lernziel planen.

## Kompetenzmarker und Evidenzgrenzen

| Marker | Status | Bedeutung für diese Zielrolle |
|---|---|---|
| CURRENT-EVIDENCE | offen | Eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| HANDS-ON-TARGET | aktiv | Ein kleiner AI-Use-Case wird mit Toolvertrag, Eval, Gegenprobe, Trace und Cleanup aufgebaut. |
| ARCHITECT-TARGET | aktiv | Die Rolle begründet Grenzen, Optionen, NFRs, Ownership, Betrieb und Exit. |
| STAFF-TARGET | aktiv | Sichere Referenzmuster und Qualitätsgates werden über einzelne Implementierungen hinaus nutzbar. |
| CHIEF-TARGET | aktiv | AI-Capability, Risiko, Anbieter-, Daten- und Betriebsstrategie werden als Portfolio entschieden. |
| SPECIALIST-OPTIONAL | aktiv | Spezialtiefe wird gezielt für dominante Engpässe und Kontrollgrenzen eingebunden. |

## Mental Model: Der Übersetzer mit Sicherheitsgrenze

Die Rolle übersetzt entlang dieser Kette:

Fachlicher Outcome → Risiko und Datenklasse → Aufgabenform → Modell- und Kontextstrategie → Tool- und Fachgrenze → Qualitätsgate → Betrieb und Kosten → Freigabe oder Stop.

Ein schlechter GenAI-Entwurf beginnt mit der Frage „Welches Modell ist am besten?“. Ein guter Entwurf beginnt mit „Welcher Nutzer soll welches überprüfbare Ergebnis erhalten, welche falsche Antwort oder Aktion ist inakzeptabel, und welche Komponente kann diese Grenze wirklich erzwingen?“

Beispiel: Ein B2B-Kunde fragt nach Bestellstatus und möchte eine Reservierung vorbereiten. Das Modell kann Frage verstehen, relevante Quellen zusammenfassen und eine strukturierte Anfrage vorschlagen. Es ist aber weder das System of Record für Bestand noch die Instanz für Berechtigung oder Idempotenz. Ein Toolgateway und ein Commerce-Command Handler prüfen Identität, Scope, Vertrag und Fachinvariante. Der Architect entscheidet, ob die Automatisierung für diesen Risiko- und Datenkontext überhaupt zulässig ist.

## Prerequisites und Dependencies

Die Rollenmatrix [KB-0002](../00-navigation-governance/02-rollen-kompetenz-matrix.md), die Evidenzgrenzen [KB-0004](../00-navigation-governance/04-cv-istbild-und-zielkompetenzen.md), das Kompetenzmodell [KB-0005](../00-navigation-governance/05-kompetenzmodell-fuer-staff-principal-und-chief.md), die Lerntiefe [KB-0006](../00-navigation-governance/06-praktische-und-architektonische-lerntiefe.md) und die Labstrategie [KB-0009](../00-navigation-governance/09-laborstrategie-und-beweisartefakte.md) sind harte Voraussetzungen dieser Rolle.

| Beziehung | Ziel | Rolle im Zielprofil |
|---|---|---|
| related | [KB-0012](02-genai-engineer-als-zielrolle.md) | Implementierungs- und Produktentwicklungstiefe. |
| related | [KB-0013](03-ai-platform-architect-als-zielrolle.md) | Gemeinsame Runtime, Mandantengrenzen und Betriebsprodukt. |
| related | [KB-0015](05-enterprise-architect-als-zielrolle.md) | Capability, Portfolio, Daten- und Prozessgrenzen. |
| related | [KB-0016](06-cloud-architect-als-zielrolle.md) | Platzierung, Netzwerk, Resilienz, Provider und Kosten. |
| applies | [KB-0400](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0400) bis [KB-0464](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0464) | GenAI-, Agenten- und Retrievalmechanik. |
| applies | [KB-0500](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0500), [KB-0572](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0572), [KB-0618](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0618) | Plattform, AI-Betrieb und Governance. |

## Core Concepts und Verantwortungsmodell

### Use-Case-Filter

Nicht jede Frage benötigt GenAI, nicht jeder GenAI-Use-Case darf Tools ausführen. Vor Architekturarbeit beantwortet die Rolle:

| Frage | Beispielantwort für Commerce-Assistent |
|---|---|
| Nutzerwert | Berechtigte Kunden verstehen Bestellstatus ohne manuellen Supportkontakt. |
| Aufgabe | Erklärung und Quellenzusammenfassung; Reservierung nur vorbereiten. |
| Datenklasse | Bestell-, Produkt- und Berechtigungsdaten, je nach Kontext personenbezogen oder vertraulich. |
| Fehlerkosten | Falscher Status ist schlecht; unberechtigte oder doppelte Reservierung ist inakzeptabel. |
| Automatisierungsgrenze | Modell erzeugt Vorschlag; fachlicher Service führt Änderung deterministisch aus. |
| Nicht-Ziel | Keine autonome Preisänderung, Zahlung, Vertragszusage oder Umgehung von Supportprozessen. |
| Erfolg | Korrekte, berechtigte, nachvollziehbare Antworten mit kontrollierter Latenz und Kosten. |
| Stopkriterium | Fehlende Quellen-, Berechtigungs- oder Qualitätsgrenze; keine verantwortbare Recovery. |

### Verantwortungsgrenzen

| Funktion | Verantwortet | Nicht verantwortlich für |
|---|---|---|
| Product / Domainowner | Nutzerwert, fachliche Invariante, Abnahme und erlaubte Aktion. | Promptdetails oder Plattformbetrieb allein. |
| GenAI Solution Architect | End-to-End-Entwurf, Daten-/Trustgrenze, Modell- und Toolstrategie, Quality Gate, Trade-offs. | Alle Spezialdetails selbst implementieren oder Fachregel ersetzen. |
| GenAI Engineer | Prompt, Context Assembly, Orchestrierung, Tool-Adapter, Eval-Implementierung. | Alle Portfolio-, Netzwerk- oder Governanceentscheidungen allein. |
| AI Platform Architect | Gemeinsame Runtime, Policies, Quotas, Mandantenfähigkeit, Telemetrie und Onboarding. | Produktfachlogik einzelner Teams. |
| Enterprise Architect | Capability, Daten-, Prozess-, Portfolio- und Governancekontext. | Jede konkrete Prompt- oder SDK-Entscheidung. |
| Cloud Architect | Platzierung, Netzwerk, IAM, Resilienz, DR und Wirtschaftlichkeit. | Modellqualität oder Fachabnahme. |
| Security / Privacy | Threat Model, Controlanforderung, Datenschutz- und Ausnahmerisiko. | Produktvalue oder Modellrouting. |
| LLMOps / MLOps | Versionierung, Evals, Observability, Deployment- und Rollbackgates. | Alle produkt- und domainfachlichen Entscheidungen. |

### Qualitätsattribute

Für GenAI sind klassische NFRs nötig, aber nicht ausreichend. Zusätzlich zählen Grounding, Berechtigung, Toolautorität, Evalabdeckung, Erklärbarkeit der Grenze und Kosten pro gültigem Ergebnis.

| Attribut | Mess- oder Designfrage |
|---|---|
| Qualität | Welche Fehlerklassen sind definiert, welches Testset und welche Mindestschwelle gelten? |
| Grounding | Welche Quellen dürfen benutzt werden, wie werden fehlende oder widersprüchliche Quellen behandelt? |
| Sicherheit | Welche Identität, Delegation, Policy und Datenklasse werden vor Tool oder Retrieval geprüft? |
| Zuverlässigkeit | Was passiert bei Modell-, Retrieval-, Tool- oder Downstreamausfall? |
| Latenz | Welcher End-to-End-Perzentilwert ist für den Nutzerwert nötig, und welche Pfade sind asynchron? |
| Kosten | Welche Treiber sind Tokens, Model Calls, GPU, Retrieval, Egress, Observability und Human Review? |
| Auditierbarkeit | Kann eine Antwort oder Aktion zu Version, Quelle, Tool, Identität und Entscheidung korreliert werden? |
| Änderbarkeit | Wie werden Modell, Prompt, Toolvertrag, Quelle und Policy versioniert, evaluiert und zurückgerollt? |

## Architektur und Data Flow

### Referenzarchitektur: kontrollierter AI-Assistent

(Nutzer) → [Identity Provider] → [Application API] → [Context Assembly] → [Model Runtime] → {Tool Gateway} → [Commerce Command Handler] → [System of Record]

Parallel: [Context Assembly] ← [Retrieval Index] ← [Authoritative Knowledge Sources]. Alle Komponenten senden redigierte Signale an [Trace / Audit / Metrics].

Der Nutzerzugang prüft Identität und Tenant. Context Assembly filtert Quellen nach Berechtigung und Relevanz. Das Modell erzeugt nur Text oder strukturierte Toolintention. Das Toolgateway validiert Vertrag, Scope, Rate und Policy. Der Command Handler validiert fachliche Invarianten, Idempotenz und den aktuellen Zustand im System of Record. Audit und Trace verbinden Entscheidung, Version, Quellen und Ergebnis, ohne Secrets oder unnötige Payload zu speichern.

### Fehler- und Recoverypfade

| Fehler | Sichere Reaktion |
|---|---|
| Keine zulässige Quelle | Begrenzte Antwort, Rückfrage oder Übergabe; keine erfundene Begründung. |
| Modelltimeout oder Anbieterfehler | Degradierter Modus, Retry nur mit Budget und Idempotenz, keine versteckte Toolaktion. |
| Falsche Toolargumente | Schema- und Policyablehnung vor Fachaktion; erklärbarer Fehlercode. |
| Abgelaufene oder falsche Delegation | Abweisung vor Retrieval oder Toolzugriff, je nach Daten- und Trustgrenze. |
| Commerce-/ERP-Timeout | Kein Erfolg behaupten; Zwischenstatus, Reconciliation oder sichere Wiederholung. |
| Evalregression nach Änderung | Featureflag oder Rollback, Ursachenanalyse gegen versionierte Baseline. |
| Kosten- oder Rate-Limit | Schutzbudget, Queue oder kontrollierte Ablehnung mit Nutzerkommunikation. |

## Protokolle, Standards und Werkzeuge

Die Rolle bewertet Standards und Implementierungen anhand der gewünschten Fähigkeit, nicht anhand von Hype.

| Bereich | Relevante Mechanismen | Architekturfrage |
|---|---|---|
| API und Tools | JSON Schema, OpenAPI, Protobuf, idempotente Commands, Contract Tests. | Wie werden Argumente, Version, Fehler und Fachautorität geprüft? |
| Identity | OAuth 2.0, OIDC, mTLS, Workload Identity, Secrets. | Wer delegiert was, für welche Audience und wie lange? |
| Agenteninteroperabilität | MCP, A2A oder vergleichbare Tool-/Agentenverträge. | Welche Version, Discovery, Auth, Tasksemantik und Migration sind im Scope? |
| Retrieval | ACL-Filter, Chunking, Index, Reranking, Zitation, Freshness. | Welche Quellen und Berechtigungen sind zulässig; wie wird Lücke signalisiert? |
| Evaluation | Versionierte Testsets, Fehlerklassen, Offline/Online-Evals, Human Review. | Welche Schwelle blockiert Freigabe, welcher Fehler ist nicht tolerierbar? |
| Observability | Traces, Audit Events, Logs, Metriken, Kostenattribution. | Welche Signale korrelieren Nutzerwirkung, Control und Verbrauch datensparsam? |
| Delivery | Versionskontrolle, CI, Featureflags, GitOps, Rollback. | Wie kann Modell-, Prompt-, Tool- oder Policyänderung sicher zurück? |

Die aktuelle A2A-Spezifikation beschreibt unter anderem Task-Operationen, Idempotenz, Versionsverhalten, Authentifizierungs- und Autorisierungsaspekte sowie mehrere Bindings. Das ist ein Architekturimpuls, kein Grund, ohne Taskmodell, Identity, Observability und Migration einen neuen Agentenstandard einzuführen. Die NIST AI RMF stellt ein risikobasiertes Denkmodell bereit; es ersetzt weder eine konkrete Bedrohungsanalyse noch die jeweils anwendbare Governanceprüfung.

## Konfiguration und Implementierung

### Pilotkonfiguration als Entscheidungsvorlage

| Feld | Beispiel |
|---|---|
| Scope | Nur Statusauskunft und Reservierungsvorbereitung für Testtenant. |
| Modell | Benannte Modellkennung; keine Annahme, dass „latest“ stabil ist. |
| Quellen | Versionierter, ACL-gefilterter Testkorpus; keine Produktivdokumente ohne Freigabe. |
| Tools | Read-only Status und vorbereiteter Command; keine direkte Datenbankmutation. |
| Identity | Kurzlebige Testdelegation mit Audience und minimalen Scopes. |
| Eval | Testset mit korrekten, unklaren, nicht autorisierten und adversarialen Anfragen. |
| Quality Gate | Fehlerklassen mit Schwelle; schwere Tool- oder Rechteverletzung blockiert Pilot. |
| Telemetrie | Trace-ID, Modell-/Prompt-/Toolversion, Latenz, Fehlerklasse, Kostenattribution; redigiert. |
| Safety | Rate Limit, Timeout, Retrybudget, Human Gate für risikoreiche Aktion. |
| Exit | Featureflag aus, Toolzugriff weg, Testdaten löschen, Audit erhalten nach Richtlinie. |

### Implementierungsreihenfolge

1. Verstehe Fachprozess, System of Record, Nutzergruppe und verbotene Zustände.
2. Entscheide, ob Retrieval, Modellgenerierung oder Toolaktion überhaupt Wert bringt.
3. Zeichne Daten- und Trust Boundaries, bevor ein Prompt optimiert wird.
4. Implementiere kleinsten End-to-End-Pfad mit deterministischem Toolgateway und Fachhandler.
5. Baue Eval- und negative Testfälle vor breiterem Rollout ein.
6. Instrumentiere Version, Kosten, Qualität, Fehler und Übergaben.
7. Definiere Pilotfreigabe, Sicherheits- und Kostenstop sowie Rollback.
8. Prüfe mit Domainowner, Security, Platform und Cloud die jeweiligen Grenzen.

## Skalierbarkeit und Performance

GenAI-Skalierung ist multidimensional. Höhere Requestrate, längerer Kontext, mehr Quellen, Toolketten, größere Modelle und zusätzliche Sicherheitskontrollen beeinflussen sich gegenseitig. Ein Architect plant nicht nur Tokens pro Request, sondern Warteschlangen, Rate Limits, Concurrency, Cache, Providerlimit, Datenisolation, Backpressure, Human Review und Kosten pro tatsächlich nutzbarem Ergebnis.

| Engpass | Beobachtung | Mögliche Entscheidung |
|---|---|---|
| Kontextgröße | Höhere Latenz/Kosten, geringere Signalqualität. | Retrievalqualität und Kontextbudget statt pauschal mehr Dokumente. |
| Modellrate | 429, Queueing, Tail-Latenz. | Quotas, Backpressure, asynchrone Arbeit, Fallback oder Providerstrategie. |
| Toolkette | Fehlerkaskaden, lange E2E-Zeit. | Begrenzte Aktionen, Timeoutbudget, kompensierbarer Workflow, Human Gate. |
| Retrieval | Schlechte Treffer oder ACL-Leak. | Berechtigungsfilter vor Ranking, Evalset, Freshness- und Reindexplan. |
| Observability | Kosten/Kardinalität oder Privacyrisiko. | Redigierte Attribute, Sampling nach Risiko, getrennte Audit- und Debugpfade. |
| Human Review | Langsame Freigabe und uneinheitliche Qualität. | Klare Risikoschwelle, Queue, Entscheidungsvorlage und Feedback in Evalset. |

## Reliability und Failure Modes

| Failure Mode | Typischer Irrtum | Schutz |
|---|---|---|
| Modellautorität | Modelltext wird als fachliche Wahrheit oder Berechtigung interpretiert. | System of Record, Policy, Command Handler und Human Gate. |
| Retrievalvertrauen | Gefundene Quelle gilt als gültig, aktuell und zugelassen. | ACL, Freshness, Provenance, Eval und begrenzte Antwort bei Lücke. |
| Tool-Sprawl | Jeder Prompt erhält neue mächtige Tools. | Capability Inventory, Least Privilege, Vertrag, Rate, Audit und Owner. |
| Evalillusion | Durchschnittswert verdeckt kritische Fehlerklasse. | Risiko-gewichtete Suiten, harte Blocker, Human Review und Regressionstest. |
| Agentenschleife | Retry und Planung erzeugen Kosten oder wiederholte Aktion. | Limits, Idempotenz, Zustandsmaschine, Circuit Breaker und Kill Switch. |
| Plattformblinde Lösung | Use Case baut eigene Identity, Observability und Deploymentwege. | Früh Platform-/Cloud-Review und klarer Referenzpfad. |
| Unklare Transition | Pilot wird Produkt ohne neue Freigabe. | Scope, Gate, SLO, Kosten, Owner, Ausnahme und Exit explizit machen. |

## Security, Governance und Compliance

GenAI Solution Architecture beginnt mit Datenklassifikation und Autorität. Ein Prompt kann keine Policy durchsetzen. Ein Modell kann keine juristische oder fachliche Freigabe erteilen. Tool- und Datenzugriff benötigen deterministische Identität, Scope, Trust Boundary, Audit und einen Owner.

Die NIST AI RMF betont eine risikobasierte Perspektive für AI-Systeme. In dieser Wissensbasis wird sie als Orientierungsrahmen benutzt: Kontext verstehen, Risiken identifizieren, messen und mit klaren Verantwortlichkeiten steuern. Eine konkrete Complianceaussage benötigt trotzdem Rechtsraum, Rolle, Sektor, Stichtag und vollständige technische sowie organisatorische Evidenz.

| Governancefrage | Erwartetes Artefakt |
|---|---|
| Darf dieser Use Case existieren? | Value-/Risikohypothese, Datenklasse, verbotene Handlungen, Product- und Riskowner. |
| Welche Daten darf das Modell sehen? | Datenfluss, ACL, Retention, Provider-/Regionannahme und Privacy-Review. |
| Welche Aktion darf es vorschlagen oder auslösen? | Toolvertrag, Delegationsmodell, fachlicher Handler, Human Gate und Audit. |
| Wann ist Qualität ausreichend? | Evalplan, schwere Fehlerklassen, Schwelle, Reviewer und Rückfallmodus. |
| Wann endet der Pilot? | Kosten-, Quality-, Security- oder Adoptionskriterium, Kill Switch und Exit. |

## Observability und Troubleshooting

Ein Architect benötigt ein kleines, aber korreliertes Signalmodell:

Nutzerintention → Kontext-/Quelle → Modell-/Promptversion → Toolentscheidung → Fachresultat → Feedback/Eval → Kosten und Latenz.

| Symptom | Erste Diagnose |
|---|---|
| Falsche, aber plausible Antwort | Quelle, Retrieval, Kontext, Prompt, Modellversion und Evalfehlerklasse prüfen. |
| Unberechtigte Antwort oder Aktion | Tenant, Identity, Scope, ACL-Filter, Toolgateway und Audit vor Modelltext prüfen. |
| Hohe Latenz | Kontextumfang, Queue, Modellrate, Toolkette, Downstream und Retrybudget trennen. |
| Unerwartete Kosten | Tokens, Modellmix, Cache, Toolschleifen, Retrieval, Tracevolumen und Human Review attribuieren. |
| Doppelte Aktion | Request-ID, Command-/Event-ID, Retry, Timeout und Idempotenzgrenze prüfen. |
| Pilot wird nicht genutzt | Nutzerwert, UX, Quellenqualität, Vertrauen, Latenz, Supportprozess und Fachscope prüfen. |

## Cost und FinOps

Die Kosten eines GenAI-Use-Cases bestehen aus mehr als Modelltokens. Retrieval, Vektorspeicher, Datenpipeline, GPU oder Provider, Netzwerk, Observability, Evals, Review, Plattformbetrieb, Support, Migration und Exit gehören in die Entscheidung. Die geeignete Kennzahl ist häufig Kosten pro gültigem, berechtigtem Ergebnis oder pro vermiedener manueller Arbeit, nicht Kosten pro Modellaufruf.

| Entscheidung | Nutzen | Kosten- und Risikofrage |
|---|---|---|
| Größeres Modell | Möglicherweise bessere Qualitätsklasse. | Verbessert es den kritischen Fehler messbar genug für Latenz, Kosten und Datenrisiko? |
| Mehr Kontext | Potenziell bessere Begründung. | Verschlechtert es Trefferqualität, Privacy, Kosten oder Tail-Latenz? |
| Toolautomatisierung | Weniger manueller Schritt. | Überwiegt der Nutzen die Fehlerkosten, Kontroll- und Reviewlast? |
| Zentraler Gateway | Gemeinsame Controls und Audit. | Entsteht ein Plattformengpass oder untragbarer Latenz-/Betriebsaufwand? |
| Mehr Human Gates | Reduziert Risiko. | Ist die Prüfung zielgerichtet, skalierbar und rückgekoppelt in Eval und Produkt? |

## Trade-offs und Anti-Patterns

| Wahl | Vorteil | Trade-off |
|---|---|---|
| Read-only Assistent | Niedrige Fehlerkosten und einfacher Pilot. | Begrenzte Automatisierung. |
| Kontrollierte Toolvorbereitung | Mehr Geschäftswert mit fachlicher Grenze. | Mehr Contracts, Identity, Audit und Betrieb. |
| Vollautonome Aktion | Potenziell schnelle Abläufe. | Hohe Sicherheits-, Recovery- und Governanceanforderung. |
| Einzelmodell | Einfacher Start. | Provider-, Qualitäts- und Souveränitätsabhängigkeit. |
| Modellportfolio | Fallback und spezialisierte Qualität. | Routing, Evals, Kosten- und Operationskomplexität. |
| Zentraler Plattformpfad | Wiederverwendbare Defaults. | Adoption, Ausnahme und Warteschlange. |

Anti-Patterns sind: „Chatbot zuerst“ ohne Outcome, Prompt als Security, RAG als Wahrheitsgarantie, Modell als System of Record, Tools ohne Policy, Eval nur auf freundlichen Fragen, Pilot ohne Kill Switch, AI-Architekt als Ersatz für Domainowner und Anbieterentscheidung ohne Daten-, Kosten- oder Exitmodell.

## Staff-, Principal- und Chief-Entscheidungen

**Staff.** Staff baut einen verlässlichen Referenzpfad: Tool-Schema, Identity-Check, Eval-Harness, Tracekonvention, Fehler- und Rollbackrunbook. Die Wirkung zeigt sich darin, dass ein zweites Team den sicheren Weg adaptieren kann und kritische Fehler vor Produktion sichtbar werden.

**Principal.** Principal harmonisiert AI-Fähigkeiten über Use Cases: gemeinsame Daten-/Toolgrenzen, Qualitätsgates, Modellportfolio, Plattformroadmap und Ausnahmewege. Er verhindert, dass jedes Team eigene unsichtbare Policy- oder Observability-Varianten aufbaut.

**Chief.** Chief entscheidet, welche AI-Fähigkeiten strategisch intern kontrolliert werden, welche Anbieter-, Daten- und Souveränitätsgrenzen gelten, welcher Risikoappetit akzeptiert wird und wann Investitionen skaliert oder gestoppt werden. Er verlangt Portfolioevidenz, nicht nur Demos.

## Production Checklist

- [x] Nutzerwert, Datenklasse, Fehlerkosten, Automatisierungsgrenze und Nicht-Ziele sind definiert.
- [x] Modelloutput ist von deterministischer Policy, Toolvalidierung und fachlicher Autorität getrennt.
- [x] Eval, Gegenprobe, Human Gate, Trace, Audit, Kostenlimit und Rollback gehören zum Pilot.
- [x] Ownership über Product, GenAI, Platform, Enterprise, Cloud, Security und LLMOps ist abgegrenzt.
- [x] Skalierung betrachtet Kontext, Rate, Toolketten, Retrieval, Observability und Human Review.
- [x] Eigene Erfahrungsaussagen sind begrenzter Kontext, kein Zielrollennachweis.
- [x] Innovationsabschnitt hat Primärquellen, Reifegrad und Pilotkriterium.
- [ ] Der Fall ist reviewed_only und nicht gegen reale Kunden-, Modell- oder Cloudsysteme ausgeführt.
- [ ] Keine unabhängige Architekturannahme; Status bleibt technical_review.

## Interviewfragen mit Antwortleitfäden

1. **Wie wählen Sie einen ersten GenAI-Use-Case aus?**  
   Nach Nutzerwert, Datenklasse, Fehlerkosten, Automatisierungsgrenze, Messbarkeit und Fähigkeit zum sicheren Fallback. Eine Demoidee ohne erlaubte Daten- und Actiongrenze ist kein guter Pilot.

2. **Warum darf ein Modell keine fachliche Zustandsänderung direkt autorisieren?**  
   Es ist probabilistisch und kann falsche oder manipulierte Ausgabe liefern. Berechtigung, Idempotenz und Fachinvarianten gehören in deterministische, verantwortete Komponenten.

3. **Was gehört in ein GenAI Quality Gate?**  
   Versioniertes Testset, Fehlerklassen, Schwellen, Quellen- und Berechtigungsprüfungen, Toolgegenproben, Human Review für kritische Fälle, Regression, Owner und Rückfallmodus.

4. **Wie unterscheiden Sie GenAI Solution Architect und GenAI Engineer?**  
   Der Engineer implementiert und verbessert konkrete Modell-, Kontext-, Tool- und Evalpfade. Der Architect entscheidet End-to-End-Grenzen, Optionen, NFRs, Ownership, Betrieb und Freigabe. Die Rollen arbeiten eng zusammen und sind nicht hierarchisch austauschbar.

5. **Wann benötigen Sie RAG?**  
   Wenn eine Antwort auf zulässigen, veränderlichen oder domänenspezifischen Quellen beruhen soll. Retrieval muss ACL, Freshness, Eval und begrenzte Antwort bei Lücke enthalten; es ist keine pauschale Wahrheitslösung.

6. **Wie würden Sie Agenteninteroperabilität einführen?**  
   Erst Taskmodell, Identity, Discovery, Version, Tool-/Agentenvertrag, Fehler- und Auditmodell definieren. Dann einen begrenzten, versionierten Pilot mit negativer Autorisierungsprobe und Migration ausprobieren.

7. **Welche Kennzahl zeigt GenAI-Wert besser als Tokenkosten?**  
   Kosten pro gültigem, berechtigtem Ergebnis oder pro vermiedener manueller Arbeit, kombiniert mit Qualitäts-, Sicherheits- und Nutzerwertsignalen. Tokenkosten sind ein Verbrauchstreiber, keine Outcome-Metrik.

8. **Wann stoppen Sie einen Pilot?**  
   Bei nicht kontrollierbarer Daten- oder Toolgrenze, kritischer Evalfehlerklasse, fehlendem Owner, unvertretbaren Kosten, keiner Nutzerwirkung oder nicht möglichem Rollback. Stoppen ist eine Architekturentscheidung, kein Scheitern der Lernarbeit.

## Praktisches Lab: Architekturfall für einen kontrollierten Commerce-Assistenten

**Ziel.** Entwirf einen fiktiven B2B-Assistenten, der Statusfragen beantwortet und eine Reservierung nur vorbereitet. Er darf weder Bestände direkt verändern noch personenbezogene oder vertrauliche Daten außerhalb klarer Grenzen weitergeben.

**Inputs.**

- Synthetische Bestellungen, Lagerdaten und drei Testidentitäten.
- Eine Liste erlaubter Quellen und ein leerer bzw. nicht autorisierter Retrievalfall.
- Ein Toolvertrag mit Tenant, Request-ID, Aktion und Scope.
- Annahmen zu Modellprovider, Kostenbudget, Latenzziel und Downstreamtimeout.
- Rollen für Domainowner, GenAI Engineering, Platform, Security und Cloud.

**Durchführung.**

1. Schreibe Outcome, Nicht-Ziele, Datenklasse, Fehlerkosten und Automatisierungsgrenze.
2. Zeichne Kontext-, Daten- und Trust Flow vom Nutzer über Kontext und Modell bis Command Handler und Audit.
3. Vergleiche drei Optionen: nur Read-only Antworten; Modell mit vorbereiteter Toolaktion; direkte Toolausführung. Begründe die Wahl.
4. Definiere Evalfälle: korrekte Antwort, leere Quelle, falscher Tenant, Prompt-Injection-Versuch, falscher Scope, Replay und ERP-Timeout.
5. Lege Quality Gate, Human Gate, Observability, Kostenlimit, Kill Switch und Rollback fest.
6. Ordne Owner und Spezialisteneskalation zu.
7. Schreibe ein ADR mit offenen Annahmen und Recheck-Triggern.

**Erwartete Beobachtung.** Kein Modelloutput umgeht die fachliche oder Berechtigungsgrenze. Eine unzureichende Quelle führt zu einer begrenzten Antwort. Ein abgelehnter Toolversuch ist auditierbar. Der Architekturfall zeigt einen kontrollierten Pilot, keine Produktionsfreigabe.

**Labstatus:** reviewed_only. Es existiert keine reale Kunden- oder Anbieterintegration und keine unabhängig validierte Architekturentscheidung.

## Dependencies, Cross-References und Quellen

Die Zielrolle verwendet die Rollen- und Evidenzbasis der Domain 00. Detaillierte GenAI-, Agenten-, Retrieval-, Plattform-, Cloud- und Governancekapitel werden ab KB-0400 kanonisch ausgearbeitet. Diese Rolle beschreibt deren Verantwortungsschnitt, nicht ihre vollständige Mechanik.

**Verwendete Quellen, Stand 2026-09-15.**

- Rollen- und Prioritätsmodell des Masterplans
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [A2A Protocol Specification](https://a2a-protocol.org/dev/specification/)

## Bonus: New Tech and Innovations

**Stand: 2026-09-15.** Die A2A-Spezifikation enthält aktuell Task- und Streamingsemantik, Idempotenz, Capability Validation, Versioning, Security Schemes und verschiedene Bindings. Das macht agentenübergreifende Arbeit für GenAI Solution Architects konkreter, erhöht aber auch den Bedarf an Version-, Identity-, Task-, Audit- und Migrationsdesign. Der Reifegrad für einen organisationsweiten Standard ist **Adopting**: Die Spezifikation ist umfangreich dokumentiert, während Implementierung, SDK, Gateway, Mandantenmodell und Operations im jeweiligen Kontext getestet werden müssen.

Ein Pilot-Abnahmekriterium lautet: Zwei abgegrenzte Agenten oder Dienste verwenden einen versionierten Vertrag für eine harmlose Aufgabe; falsche Autorisierung wird vor der Aktion abgewiesen; Taskstatus, Fehler und Audit sind korrelierbar; eine inkompatible Version führt zu kontrolliertem Fehler oder geplantem Fallback. Ohne diese Evidenz bleibt A2A ein Recherche- und Lerngegenstand, kein strategischer Plattformstandard.
