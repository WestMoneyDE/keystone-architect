---
{"id": "KB-0007", "title": "Lernwellen und Fortschrittssteuerung", "domain": "00", "sequence": 7, "document_type": "navigation", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0001", "concepts": ["Master Index", "Statusmodell", "stabile IDs"], "needed_for": "understanding"}, {"id": "KB-0003", "concepts": ["Requires-Kanten", "zyklusfreie Abhängigkeiten", "partieller Graph"], "needed_for": "understanding"}, {"id": "KB-0006", "concepts": ["Lerntiefen", "Nachweisarten", "Labgrenzen"], "needed_for": "understanding"}], "related": ["KB-0002", "KB-0004", "KB-0005", "KB-0008", "KB-0009", "KB-0011", "KB-0031", "KB-0077", "KB-0105", "KB-0198", "KB-0246", "KB-0316", "KB-0350", "KB-0372", "KB-0400", "KB-0500", "KB-0572", "KB-0618", "KB-0677"], "applies": ["KB-0011", "KB-0031", "KB-0077", "KB-0105", "KB-0198", "KB-0246", "KB-0316", "KB-0350", "KB-0372", "KB-0400", "KB-0500", "KB-0572", "KB-0618", "KB-0677"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Jede Welle enthält kleine, sichere Mechanismus-Labs mit erwarteten Beobachtungen, Gegenprobe, Kosten- und Cleanupgrenze.", "rationale": "Lernfortschritt ohne ausgeführte oder ehrlich als nicht ausgeführt markierte Nachweise ist nicht steuerbar."}, "ARCHITECT-TARGET": {"active": true, "scope": "Wellenübergänge benötigen Architekturfälle, die Voraussetzungen aus verschiedenen Domains in einer begründeten Entscheidung verbinden.", "rationale": "Die Reihenfolge darf nicht zu isolierten Fachinseln führen; Architekturkompetenz zeigt sich an den Grenzen."}, "STAFF-TARGET": {"active": true, "scope": "Fortschrittssteuerung macht Lernartefakte als Referenzpfade, Reviews und Wissensübergaben für mehrere Beteiligte wiederverwendbar.", "rationale": "Staff-Wirkung entsteht durch eine bessere Lern- und Lieferfähigkeit des Systems, nicht durch individuelle Geschwindigkeit."}, "CHIEF-TARGET": {"active": true, "scope": "Wellen werden als Capability-Investments mit Risiko, Wert, Kapazität, Kosten und Stop- oder Repriorisierungsentscheidung gesteuert.", "rationale": "Chief-Verantwortung priorisiert unsichere Investments transparent und verhindert, dass Zertifikate oder Hype die Risikoreihenfolge bestimmen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Spezialisten-Lernpfade werden erst dann vertieft, wenn eine Welle zeigt, dass sie einen dominanten Engpass oder eine nicht delegierbare Kontrollgrenze adressieren.", "rationale": "Gezielte Vertiefung schützt gegen sowohl oberflächliche Breite als auch unpriorisierte Spezialtheorie."}}, "lab_validation": [{"lab_id": "KB-0007-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Lokales Lernledger mit fiktiven, datensparsamen Nachweisartefakten", "evidence": "Der Ablauf prüft einen Wellenübergang anhand von Voraussetzungen, Gegenprobe, Review, Kostenlimit und Repriorisierung.", "limitations": "Kein persönlicher Lernfortschritt und keine reale Team- oder Budgetentscheidung wurden gemessen."}]}
---
# Lernwellen und Fortschrittssteuerung

## Zweck, Definition und Scope

Die 720 Dateien werden numerisch geschrieben, weil nur diese Reihenfolge eine stabile, überprüfbare Umsetzung erlaubt. Gelernt werden sie jedoch in neun Wellen. Eine Welle bündelt Fähigkeiten, die gemeinsam einen sinnvollen nächsten Entscheidungshorizont eröffnen. Sie ist weder ein Zertifikat noch ein Kalenderplan und auch keine Behauptung, dass alle Kapitel einer Welle schon beherrscht werden.

Dieses Kapitel bewahrt die Originalwellen 0 bis 8 unverändert. Es ergänzt eine Steuerungslogik, die Lernfortschritt an Nachweisen misst: Begriffe verstehen, Mechanismen sicher ausführen, Fehler diagnostizieren, Architekturentscheidungen begründen, einen Pfad für andere wiederholbar machen und Fähigkeiten als Portfolio mit Risiko und Kosten steuern. Eine fertig geschriebene Lehrdatei, ein durchgeführtes Lab und eine beherrschte Kompetenz bleiben drei unterschiedliche Status.

Nach diesem Kapitel kann der Leser:

1. numerische Schreibreihenfolge, Lernwellen, technische Abhängigkeiten und persönlichen Fortschritt auseinanderhalten;
2. für jede Welle einen konkreten Outcome, Mindestvoraussetzungen, Nachweisarten und Stopkriterien formulieren;
3. Quervorgriffe in spätere Domains begründen, ohne den Lernpfad in einen unkontrollierten Graphen zu verwandeln;
4. Wiederholung und Transfer zwischen Linux, Netz, Backend, Plattform, GenAI, Governance und Wirtschaftlichkeit planen;
5. Fortschritt ohne Zertifikatssammeln oder überzogene Erfahrungsclaims erfassen;
6. eine Welle anhand von Risiko, Wert, Aufwand, Kosten und Evidenz neu priorisieren.

## Kompetenzmarker und Evidenzgrenzen

| Marker | Status | Bedeutung für die Wellensteuerung |
|---|---|---|
| CURRENT-EVIDENCE | offen | Eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| HANDS-ON-TARGET | aktiv | Wellen produzieren abgegrenzte Labs mit Gegenprobe, Beobachtung und Rückbau. |
| ARCHITECT-TARGET | aktiv | Übergänge zwischen Wellen werden durch Architekturfälle und Abhängigkeitsentscheidungen geprüft. |
| STAFF-TARGET | aktiv | Wiederholbare Nachweisformate, Reviews und Wissensübergaben verbessern die Fähigkeit mehrerer Teams. |
| CHIEF-TARGET | aktiv | Reihenfolge und Investition werden nach Wert, Risiko, Kapazität und Stopkriterien gesteuert. |
| SPECIALIST-OPTIONAL | aktiv | Spezialtiefe folgt einem nachweisbaren Engpass statt einer Liste prominenter Technologien. |

## Mental Model: Vier Ansichten auf denselben Lehrplan

Die Wissensbasis wird gleichzeitig aus vier Ansichten betrachtet:

| Ansicht | Frage | Beispiel |
|---|---|---|
| Schreibansicht | Welche Datei wird als Nächstes vollständig erstellt? | Nach KB-0007 folgt KB-0008, unabhängig von der späteren Lernwelle. |
| Wellenansicht | Welche Domänen ergeben zusammen einen sinnvollen Lernschritt? | Welle 3 verbindet GenAI-Architektur, Agentik und Retrieval. |
| Abhängigkeitsansicht | Welche konkreten Begriffe oder Mechanismen werden für eine Aufgabe benötigt? | Ein Agentenlab kann vorab eine minimale Identity- und Event-Grundlage benötigen. |
| Evidenzansicht | Was wurde wirklich erklärt, getestet, entschieden oder standardisiert? | Ein reviewed_only Lab ist kein ausgeführter Produktionsnachweis. |

Ein Fehler entsteht, wenn diese Ansichten verschmolzen werden. Ein Kapitel kann früh geschrieben, aber erst später praktisch geübt werden. Eine spätere Domain kann für eine aktuelle Sicherheitsgrenze als Vorgriff nötig sein. Ein abgeschlossenes Lab kann noch keine Architektur- oder Governancekompetenz beweisen. Fortschritt ist deshalb ein Portfolio aus nachweisbaren Kanten zwischen den Ansichten, kein einziger Prozentwert.

## Die neun Originalwellen

| Welle | Zweck | Domainfolge | Lernfrage |
|---:|---|---|---|
| 0 | Navigation | 00 | Wie werden Ziele, Evidenz, Abhängigkeiten, Versionen und Labs sauber gesteuert? |
| 1 | Rollen und Architekturgrundlagen | 01 → 02 → 05 → 06 | Welche Rolle wird angestrebt, wie funktionieren Systeme und wie werden Grenzen entworfen? |
| 2 | Netzwerk, Backend und verteilte Basis | 03 → 04 → 07 → 08 → 09 | Wie bewegen sich Daten, Aufrufe und Zustände zuverlässig durch verteilte Systeme? |
| 3 | AI-Kern der Zielrollen | 11 → 12 → 13 | Wie werden GenAI, Agenten und Wissenszugriff kontrolliert als Anwendung gestaltet? |
| 4 | Plattform und Cloud | 16 → 18 → 19 → 20 → 21 | Wie werden gemeinsame Laufzeit-, Cloud- und Providerfähigkeiten sicher und wirtschaftlich bereitgestellt? |
| 5 | Enterprise-Produktionswissen | 22 → 23 → 24 → 25 → 26 → 27 | Wie gelangen Systeme sicher, beobachtbar, governbar und finanzierbar in den Betrieb? |
| 6 | AI-Produktionsspezialisierung | 14 → 15 → 17 | Wie werden Modelle, Evals, AI-Lebenszyklen, GPU und Serving vertieft? |
| 7 | Daten- und Branchendifferenzierung | 10 → 28 → 29 | Wie verbinden Datenprodukte, physische Systeme und Commerce-Integration die Plattform mit konkreten Branchen? |
| 8 | Staff-/Principal-/Chief-Synthese | 30 | Wie werden technische Entscheidungen, Portfolio, Kommunikation und Wirkung unter realen Zielkonflikten geführt? |

Die Reihenfolge ist ein Schwerpunktpfad, keine formale topologische Sortierung. Jede Welle enthält offene Voraussetzungen, die in der jeweiligen Datei konkret benannt werden. Das ist absichtlich: Ein GenAI-System ohne Identity, Netzwerk, Events oder Datenklassifikation wäre kein sicherer Lernfall. Der Vorgriff bleibt aber minimal und verweist auf die kanonische Datei, statt das gesamte spätere Thema zu kopieren.

## Prerequisites und Dependencies

[KB-0001](01-master-index-und-wegweiser.md) liefert IDs, Statusmodell und Index. [KB-0003](03-vollstaendiger-abhaengigkeitsgraph.md) trennt harte Requires-Kanten von losen Querverweisen. [KB-0006](06-praktische-und-architektonische-lerntiefe.md) definiert die Nachweistiefen. Dieses Kapitel kombiniert sie zu einer steuerbaren Lernansicht.

| Beziehung | Datei | Zweck |
|---|---|---|
| Rollen und Evidenz | [KB-0002](02-rollen-kompetenz-matrix.md), [KB-0004](04-cv-istbild-und-zielkompetenzen.md), [KB-0005](05-kompetenzmodell-fuer-staff-principal-und-chief.md) | Priorität, Istgrenzen und Wirkungskette. |
| Version und Lab | [KB-0008](01-master-index-und-wegweiser.md#kb-0008), [KB-0009](01-master-index-und-wegweiser.md#kb-0009) | Re-Evaluation, Reproduzierbarkeit und Beweisartefakte. |
| Welle 1 | [KB-0011](01-master-index-und-wegweiser.md#kb-0011), [KB-0031](01-master-index-und-wegweiser.md#kb-0031), [KB-0077](01-master-index-und-wegweiser.md#kb-0077), [KB-0105](01-master-index-und-wegweiser.md#kb-0105) | Zielrollen, Linux, verteilte Systeme und Softwarearchitektur. |
| Welle 2 | [KB-0198](01-master-index-und-wegweiser.md#kb-0198), [KB-0246](01-master-index-und-wegweiser.md#kb-0246), [KB-0316](01-master-index-und-wegweiser.md#kb-0316), [KB-0350](01-master-index-und-wegweiser.md#kb-0350), [KB-0372](01-master-index-und-wegweiser.md#kb-0372) | Netzwerk, Enterprise-Netz, APIs, Messaging und Datenhaltung. |
| Welle 3 bis 8 | [KB-0400](01-master-index-und-wegweiser.md#kb-0400), [KB-0500](01-master-index-und-wegweiser.md#kb-0500), [KB-0572](01-master-index-und-wegweiser.md#kb-0572), [KB-0618](01-master-index-und-wegweiser.md#kb-0618), [KB-0677](01-master-index-und-wegweiser.md#kb-0677) | AI-Kern, Plattform, Produktionswissen, Spezialisierung und Synthese. |

## Core Concepts

### Eine Welle braucht einen Outcome statt einer Leseliste

Eine Welle wird erst steuerbar, wenn sie ein überprüfbares Ergebnis formuliert. „Domain 11 gelesen“ ist kein Ergebnis. „Eine GenAI-Funktion kann Quellen begrenzen, Toolaktionen autorisieren, Qualität evaluieren, Fehler behandeln und Kosten beobachten“ ist ein Ergebnis, dessen Einzelteile auf mehrere Kapitel verweisen.

| Welle | Beispiel-Outcome | Minimaler Nachweis |
|---:|---|---|
| 0 | Der Lern- und Evidenzstand ist navigierbar, versioniert und ehrlich. | Index, Status, graphgeprüfte Kanten, Labstatus und Quellenregister. |
| 1 | Ein abgegrenzter Service kann auf System- und Architekturgrenzen erklärt werden. | Kontextdiagramm, Prozess-/Thread- oder Speicherbeobachtung, ADR. |
| 2 | Eine verteilte Transaktion bleibt bei Netz-, API-, Event- oder Speicherausfall diagnostizierbar. | Contract Test, Trace, Fehlerklassifikation, Recovery-Entscheidung. |
| 3 | Ein AI-Use-Case bleibt trotz probabilistischem Modellverhalten an Daten-, Tool- und Qualitätsgrenzen kontrollierbar. | Eval, Toolpolicy, negative Berechtigungsprobe und Audittrail. |
| 4 | Ein Team kann eine Plattform- oder Cloudfähigkeit mit sicheren Defaults nutzen. | Golden Path, SLO, Kostenlimit, Rollback und Onboardingfeedback. |
| 5 | Ein Produktweg wird sicher geliefert, beobachtet, geprüft und wirtschaftlich gesteuert. | Pipeline-Policy, Incident-Übung, Governance-Review und Kostenmodell. |
| 6 | Modell- und Servingentscheidungen sind messbar reproduzierbar und können bei Qualitäts- oder Kapazitätsproblemen zurückgenommen werden. | Benchmark, Evalschwelle, Deployment-/Rollbackplan, Kapazitätsmodell. |
| 7 | Ein Fachsystem verbindet Daten-, Edge- oder Commercegrenzen mit korrekten Invarianten und Betrieb. | Datenvertrag, Integrationstest, Reconciliation und Domänen-ADR. |
| 8 | Eine Entscheidung über mehrere Teams oder Domänen bleibt fachlich, technisch und wirtschaftlich verteidigbar. | Portfolioentscheidung, Stakeholdermodell, Risiko- und Wirkungsnachweis. |

### Voraussetzungen als kleine Verträge

Eine Voraussetzung wird nicht als „alles über Kubernetes“ oder „Networking beherrschen“ formuliert. Sie enthält die minimale Begriffs- und Handlungsebene, die für das nächste Artefakt nötig ist.

| Schlechte Voraussetzung | Kleine, überprüfbare Voraussetzung |
|---|---|
| „Security kennen“ | „Audience, Scope und Ablauf eines delegierten Tokens unterscheiden; falsche Audience als negative Probe erklären.“ |
| „Distributed Systems verstehen“ | „Idempotenz, Retry und mindestens-once-Zustellung von einer atomaren Zustandsänderung abgrenzen.“ |
| „Cloud können“ | „Datenklasse, Region, Netzgrenze, IAM-Owner, Budget und Recoveryziel für den gewählten Pilot angeben.“ |
| „MLOps kennen“ | „Evaldataset, erwartete Fehlklasse, Schwellenwert, Modell-/Promptversion und Rückfallmodus definieren.“ |

So bleiben Wellen flexibel: Die benötigte Identity-Grundlage kann früh als kompakte Voraussetzung gelernt und später in Domain 23 tief behandelt werden. Die Abhängigkeitskante zeigt den Zusammenhang, ohne den numerischen Autorenpfad umzuschreiben.

### Fortschritt ist Evidenz, nicht Beschäftigung

Ein Fortschrittsledger enthält keine geschätzten Prozentwerte als Kompetenzbehauptung. Es hält pro Artefakt fest:

- Zielwelle und verknüpfte Kapitel-IDs;
- Lernfrage und risikobegründete Priorität;
- aktuelle Tiefe nach KB-0006;
- Ausführungsstatus: planned, reviewed_only, syntax_checked oder executed;
- Datenklasse, Kostenlimit und Cleanup;
- Gegenprobe und beobachtetes Ergebnis;
- Reviewart und offene Grenze;
- Re-Evaluation-Trigger.

Ein Eintrag kann deshalb ehrlich „zu 60 Prozent vorbereitet“ sein, ohne „zu 60 Prozent beherrscht“ zu behaupten. Relevanter sind geschlossene und offene Nachweiskanten: Welche zentrale Annahme wurde getestet, welche bleibt nur entworfen, welche muss ein Spezialist oder unabhängiger Reviewer prüfen?

## Architektur und Data Flow der Fortschrittssteuerung

Der Steuerungsfluss ist ein kleiner Feedback-Regelkreis:

Risikobehafteter Outcome → Welle und Wertstrom → minimale Voraussetzungen → Lernartefakt → Gegenprobe und Telemetrie → Review → Evidenzstand → Repriorisierung, Wiederholung oder Wellenübergang.

### Übergangskriterien

Ein Wellenübergang verlangt nicht, dass jedes Kapitel vollständig in jeder möglichen Tiefe gelernt wurde. Er verlangt, dass die relevante Outcome-Kette für den gewählten Use Case nicht an einer unbekannten kritischen Grenze endet.

| Prüfkriterium | Frage | Stop- oder Wiederholungsgrund |
|---|---|---|
| Fachlicher Outcome | Ist der konkrete Nutzer- oder Geschäftswert klar? | Ein Lab optimiert Technik ohne verantwortbaren Nutzen. |
| Kritische Invariante | Ist bekannt, was nie passieren darf? | Modell, Retry oder Migration kann unkontrolliert Zustand verändern. |
| Voraussetzung | Sind die minimalen Begriffe und Mechanismen nachgewiesen? | Ein Fehlerfall wird nur geraten oder durch Neustart verdeckt. |
| Gegenprobe | Wurde die zentrale Behauptung aktiv angegriffen? | Nur Happy Path oder theoretische Erklärung vorhanden. |
| Ownership | Ist klar, wer Fachregel, Plattform, Security und Betrieb verantwortet? | Verantwortung verschwindet zwischen Teams. |
| Kosten und Cleanup | Ist der Verbrauch begrenzt und der Rückbau vorgesehen? | Cloud-, GPU- oder Datenrisiko ohne Stopgrenze. |
| Review | Ist Methode, Unabhängigkeit und offene Grenze dokumentiert? | Selbstprüfung wird als externe Freigabe ausgegeben. |

### Beispiel: Vorgriff von Welle 3 auf Welle 5

Ein Team bearbeitet einen GenAI-Use-Case in Welle 3. Für eine sichere Toolaktion benötigt es eine minimale Identitätsgrenze, die im detaillierten Security-Track erst in Welle 5 kanonisch vertieft wird. Der richtige Ablauf ist:

1. Die Welle-3-Datei nennt als Voraussetzung die konkrete Forderung: delegierte Identität, Audience, Scope, Ablauf, Audit.
2. Ein kleines lokales Lab zeigt erlaubte und abgewiesene Testclaims.
3. Die Architekturentscheidung markiert die offene Tiefe: Key Rotation, federierte Workload Identity, Legacy-Ausnahmen und Incident-Response folgen als Vorgriff oder in Welle 5.
4. Der Wellenfortschritt bleibt „ausreichend für den begrenzten Pilot“, nicht „Security vollständig beherrscht“.
5. Vor Produktionsausweitung wird die Welle-5-Prüfung zur harten Freigabekante.

So wird der Lernplan handlungsfähig, ohne Sicherheitswissen zu verschieben oder durch eine isolierte Demo zu ersetzen.

## Protokolle, Standards und Werkzeuge

Die Fortschrittssteuerung verwendet keine spezifische Lernplattform als Autorität. Sie stützt sich auf versionierbare, prüfbare Artefakte:

| Artefakt | Geeignete Werkzeuge oder Standards | Was es nicht ersetzt |
|---|---|---|
| Kapitel- und Abhängigkeitsstatus | Markdown, JSON, stabile IDs, gerichteter Graph. | Fachliche Korrektheit oder praktische Beherrschung. |
| Quellennachweis | Primärquelle, Version, Abrufdatum, Recheck-Trigger. | Eine unabhängige Sicherheits- oder Compliancefreigabe. |
| Hands-on-Evidenz | Repository, Tests, Konfiguration, Logs, Benchmarks, CI-Report. | Produktionslast oder echte Nutzerwirkung. |
| Architekturentscheidung | ADR, C4- oder Datenflussdiagramm, Risikoanalyse, Kostenmodell. | Implementierung, Adoption oder Betrieb. |
| Betriebsnachweis | Trace, Metrik, SLO, Runbook, Incident-Übung, Restore-Report. | Strategische Portfolioentscheidung. |
| Kompetenzportfolio | Redigierte Artefakte, Reviewprotokoll, optional signierte Nachweise. | Ein verlässliches Urteil über Menschen allein. |

Für aktuelle Technologien wie MCP, A2A, Kubernetes-APIs, Cloudservices oder Modellanbieter wird Fortschritt immer an Version und Umgebung gebunden. „Gelernt“ bedeutet hier: Das konkrete Protokoll, die Konfiguration und die Gegenprobe sind nachweisbar. Ein späteres Upgrade oder eine Sicherheitsänderung kann eine erneute Prüfung auslösen.

## Konfiguration und Implementierung eines Wellenledgers

Ein Wellenledger kann als Markdown-Tabelle, Issue-System oder versionierte JSON-Datei geführt werden. Entscheidend ist die Semantik, nicht das Tool.

| Feld | Beispiel |
|---|---|
| Welle und Kapitel | Welle 3; KB-0400, KB-0434, KB-0464. |
| Outcome | Kontrollierte Wissensabfrage mit Toolvorschlag, aber ohne direkte Zustandsänderung. |
| Risiko | Falsche Quelle, unberechtigter Toolzugriff, Prompt Injection, Kosten- oder Latenzspitze. |
| Voraussetzung | Token-Audience, Retrievaltreffer, idempotenter Command, Trace-Korrelation. |
| Nachweisstufe | Hands-on ausgeführt oder reviewed_only; Architekturfall in Review. |
| Gegenprobe | Falscher Scope, leere Quellenlage, doppelter Auftrag, nicht erreichbarer Downstream. |
| Messung | Abweisungsrate, Evalfehlerklasse, Toollatenz, Kosten pro gültigem Ergebnis. |
| Owner | Fachowner, GenAI-Implementierung, Platform, Security, Review. |
| Kosten / Cleanup | Testbudget, Abschaltzeit, synthetische Daten, Token- und Loglöschung. |
| Entscheidung | Weiter, wiederholen, Scope verkleinern, Spezialist einbinden oder stoppen. |
| Recheck | Neue Modellversion, neue Datenklasse, neuer Provider, Incident, Ablaufdatum. |

### Implementierungsregeln

1. Jede Welle hat höchstens wenige aktive Outcomes. Parallelität ist sinnvoll, wenn Voraussetzungen unabhängig sind; sie ist schädlich, wenn dieselbe knappe Review- oder Spezialistenkapazität blockiert wird.
2. Jede aktive Arbeit besitzt eine Gegenprobe, ein Kostenlimit und ein offenes Risiko. Fehlen sie, bleibt der Status planned oder researching.
3. Nur ein ausgeführtes Artefakt darf executed heißen. Eine Strukturprüfung, Lektüre oder Selbstreview wird getrennt erfasst.
4. Ein Wellenübergang wertet bestehende Einträge der Selbsteinschätzung nicht rückwirkend auf. Er erzeugt eine neue Lern- oder Portfolioevidenz mit eigener Grenze.
5. Eine technische Innovation erhöht den Recheckbedarf, nicht die vermutete Kompetenz.
6. Wiederholung ist kein Rückschritt: Sie wird ausgelöst, wenn eine kritische Gegenprobe scheitert, eine Annahme abläuft oder eine reale Betriebsbeobachtung die Lernhypothese widerlegt.

## Skalierbarkeit und Performance

Wellen dienen dazu, kognitive und organisatorische Last zu begrenzen. Sie sind keine Ausrede, Grundlagen aufzuschieben. Skalierung entsteht durch kleine, wiederverwendbare Nachweisformate und durch eine klare Grenze zwischen persönlicher Übung, Teamstandard und Portfolioentscheidung.

| Problem | Ursache | Skalierbare Steuerung |
|---|---|---|
| Zu viele aktive Themen | Tool- oder Hype-getriebene Priorisierung. | Begrenze aktive Outcomes; wähle nach Risiko, Wert und Abhängigkeit. |
| Zu lange Wellen | Jede Datei soll vor Übergang maximal vertieft werden. | Definiere minimale Outcome-Kette und spätere Vertiefungsbacklogs. |
| Reviewstau | Keine Risikoklassen oder identische Reviewer für alles. | Pair Review, Checklisten, Spezialistenzeit nur an kritischen Grenzen. |
| Veraltete Lernartefakte | Versionen, Quellen und Annahmen haben keinen Trigger. | Ablaufdatum, Changelog-Beobachtung und gezielte Revalidation. |
| Keine Transferwirkung | Labs sind isolierte Einmalaufgaben. | Ein Ergebnis pro Welle als Referenzpfad, ADR oder Diagnosefall verdichten. |

Die relevante Performancekennzahl lautet nicht Seiten pro Woche. Sie lautet Zeit bis zu einem sicheren, begründeten und wiederholbaren Ergebnis. Ein kurzer Wellenfortschritt mit sauberer Gegenprobe ist wertvoller als viele unerprobte Notizen.

## Reliability und Failure Modes

| Failure Mode | Signal | Ursache | Recovery |
|---|---|---|---|
| Checkbox-Fortschritt | Viele Kapitel als gelesen, keine Artefakte oder Fehlpfade. | Aufwand wird mit Kompetenz verwechselt. | Outcome und Nachweis neu formulieren; eine zentrale Gegenprobe ausführen. |
| Wellen-Silo | Themen werden nur innerhalb ihrer Nummer bearbeitet. | Fehlende Querverweise und kein Transferfall. | Architekturfall über zwei Wellen erstellen; benötigte Kante im Graphen dokumentieren. |
| Vorgriffsexplosion | Jede Aufgabe verlangt umfangreiche spätere Domains. | Voraussetzungen zu groß oder Scope unklar. | Voraussetzung auf kleinsten Mechanismus reduzieren; Rest als spätere Freigabekante markieren. |
| Falsche Reife | reviewed_only wird wie executed oder accepted behandelt. | Statusmodell wird nicht strikt gepflegt. | Reviewregister und Labstatus korrigieren; Aussagegrenze zurücksetzen. |
| Hype-Pivot | Neue Technik ersetzt den priorisierten Wertstrom. | Innovation wird mit Geschäftswert verwechselt. | Pilotkriterium, Budget und Stopregel vor Beginn festlegen. |
| Kostenblindheit | GPU-, Cloud-, Modell- oder Reviewverbrauch wird nicht geplant. | Lab gilt fälschlich als kostenlos. | Budget, Alarm, Abschaltzeit und Cleanup in jeden Ledger-Eintrag aufnehmen. |
| Ein-Person-Abhängigkeit | Nur der Autor kann Ergebnis oder Fehler erklären. | Kein Referenzpfad, kein Pairing, keine Übergabe. | Artefakt bereinigen, Runbook ergänzen, zweite Person durch Gegenprobe führen. |

## Security, Governance und Compliance

Ein Lernledger kann sensible Informationen über Personen, Architektur, Schwachstellen oder Kundenfälle enthalten. Er speichert daher nur die minimal nötige Evidenz. Persönliche Bewertungen, unredigierte Kundendaten, Secrets, vollständige Produktionslogs und vertrauliche Sicherheitsbefunde gehören nicht in öffentliche oder breit zugängliche Lernartefakte.

Governance entscheidet, wer einen Wellenübergang für einen bestimmten Risikokontext beurteilt. Ein Lernender kann ein Lab selbst ausführen. Eine produktionskritische Freigabe benötigt passende fachliche, Sicherheits- und Betriebsowner. Die Welle dokumentiert diese Differenz, statt sie durch eine einheitliche Statusfarbe zu verstecken.

| Risikoklasse | Mindestgovernance für den Übergang |
|---|---|
| Lokales, synthetisches Lab | Selbstreview, dokumentierte Grenze und Cleanup. |
| Shared Sandbox oder interne Testdaten | Owner der Umgebung, Zugriffs- und Kostenkontrolle, Peer Review. |
| Produktionsnaher Pilot | Fachowner, Security-/Privacy-Prüfung nach Kontext, SLO- und Rollbackplan. |
| Organisationsstandard oder regulierter Use Case | Benanntes Mandat, Ausnahmeprozess, unabhängige Review, Audit- und Re-Evaluationpfad. |

Dieses Kapitel trifft keine Rechtsaussage. Es stellt sicher, dass ein Lernpfad rechtliche, Privacy- und Compliancefragen als konkrete Freigabekanten behandelt statt sie als Nebenwirkung späterer Umsetzung zu verschieben.

## Observability und Troubleshooting

Die Steuerung selbst braucht Beobachtung. Ein sinnvolles Wellen-Dashboard misst die Qualität der Lern- und Entscheidungsarbeit, nicht die Produktivität einzelner Personen.

| Signal | Interpretation | Diagnosefrage |
|---|---|---|
| Anteil aktiver Outcomes mit Gegenprobe | Zeigt, ob Lernergebnisse angreifbar gemacht werden. | Fehlen Tests, weil Scope zu groß oder weil Mechanismus unklar ist? |
| Offene kritische Voraussetzungen | Zeigt Risiko vor einem Wellenübergang. | Ist die Voraussetzung wirklich kritisch oder nur eine unpräzise Sammelphrase? |
| Alter versionierter Quellen oder Artefakte | Zeigt Recheckbedarf. | Hat sich Standard, SDK, Modell, Provider oder Bedrohungslage relevant geändert? |
| Wiederholte Failure Modes | Zeigt eine Lücke im Referenzpfad. | Fehlt ein mentales Modell, eine Policy, Telemetrie oder ein Owner? |
| Zeit bis zu Review oder Repriorisierung | Zeigt organisatorischen Engpass. | Ist die Reviewstufe dem Risiko angemessen und wer kann sie entlasten? |
| Kosten pro abgeschlossener Hypothese | Zeigt Effizienz ohne Seitenzählung. | Wurde teure Infrastruktur genutzt, obwohl ein kleiner Test genügt hätte? |

**Troubleshooting: Eine Welle kommt nicht voran.** Beginne nicht mit mehr Lernmaterial. Suche zuerst die blockierende Kante: unklare Invariante, fehlende Testumgebung, zu breite Voraussetzung, fehlender Owner, unklare Kosten oder eine Entscheidung ohne Alternative. Reduziere dann Scope oder hol gezielt die passende Nachbarfähigkeit vor. Ein kleiner, ehrlich begrenzter Nachweis ist der richtige Recovery-Schritt.

## Cost und FinOps

Fortschrittssteuerung ist eine Investitionsentscheidung. Jeder Lernschritt verbraucht Zeit, Infrastruktur, Aufmerksamkeit und gegebenenfalls Cloud-, Modell- oder GPU-Budget. Der Nutzen liegt in reduzierter Unsicherheit und höherer Lieferfähigkeit. Deshalb wird nicht „die interessanteste Welle“ priorisiert, sondern diejenige, deren Kompetenzlücke den wichtigsten geplanten Wertstrom oder das größte Risiko begrenzt.

| Entscheidung | Nutzen | Kostenrisiko | FinOps-Kontrolle |
|---|---|---|---|
| Lokales Mechanismuslab | Schnelle Reduktion einer Grundlagenunsicherheit. | Zeit ohne Transfer oder falscher Scope. | Kleine Daten, feste Laufzeit, kein persistenter Dienst. |
| Cloud- oder GPU-Pilot | Reale Latenz-, Kompatibilitäts- oder Kapazitätsfrage beantworten. | Unerwartete Verbrauchskosten, Datenrisiko, Vendor Lock-in. | Budget, Quota, Tagging, Alarm, Abschaltzeit und Cleanup. |
| Referenzpfad | Wiederholung und Supportaufwand über Teams reduzieren. | Plattformkosten ohne Adoption. | Nutzerfeedback, Wiederverwendungsrate, Support- und Ausnahmequote. |
| Spezialisteninvestition | Kritischen Engpass oder Kontrollgrenze absichern. | Dauerhafte Abhängigkeit und Wartezeit. | Übergabevertrag, Second Source, Wissenstransfer und Exit. |
| Portfolioinitiative | Mehrere Wertströme mit gemeinsamen Fähigkeiten beschleunigen oder absichern. | Bürokratie, zentrale Warteschlange und Fehlinvestition. | Outcome-Baseline, zeitlich befristeter Pilot, Stop- und Repriorisierungskriterium. |

## Trade-offs und Anti-Patterns

| Ansatz | Vorteil | Trade-off | Anti-Pattern |
|---|---|---|---|
| Strikte Wellenreihenfolge | Verständlicher, planbarer Pfad. | Kritische Vorgriffe können verzögert werden. | Sicherheit oder Datenklassifikation ignorieren, weil sie „später“ liegt. |
| Freier Themenzugriff | Schnelle Reaktion auf einen aktuellen Use Case. | Zusammenhang und Grundlagen können fehlen. | Jede neue Technologie startet eine neue, unverbundene Lernspur. |
| Kapitelvollständigkeit vor Übergang | Tiefe innerhalb einer Domain. | Langsame Transferfähigkeit und keine End-to-End-Erfahrung. | Hunderte Seiten lesen, bevor ein kleiner Systemfall möglich ist. |
| Outcome-basierter Übergang | Frühe, überprüfbare Wirkung. | Manche Spezialtiefe bleibt bewusst offen. | Einen begrenzten Pilot als vollständige Fachbeherrschung ausgeben. |
| Zentraler Fortschrittsreport | Gemeinsame Transparenz und Governance. | Gefahr personenbezogener Überwachung. | Lernledger als Leistungsranking oder Kontrollinstrument missbrauchen. |
| KI-gestützte Strukturprüfung | Findet fehlende Links und Statuskonflikte schnell. | Kann fachliche Wahrheit oder Lernwirkung nicht beurteilen. | Automatische Bewertung von Eignung, Beförderung oder Compliance. |

## Staff-, Principal- und Chief-Entscheidungen

### Staff

Staff-Wirkung nutzt Wellen, um wiederholte technische Lern- und Lieferhürden sichtbar zu machen. Ein Staff Engineer kann einen vertikalen Fall von Eventvertrag über Toolgateway bis Observability definieren und daraus Testkit, Referenzimplementierung und Diagnosepfad machen. Der Erfolg ist, dass mehrere Teams eine kritische Fehlerklasse früher erkennen oder einen sicheren Pfad ohne dauernde Einzelhilfe nutzen.

**Entscheidungsfragen:**

- Welche offene Voraussetzung verursacht wiederholt dieselbe Störung oder Delivery-Wartezeit?
- Welches kleinste gemeinsame Artefakt führt zu einem verlässlichen Transfer?
- Welche Gegenprobe kann ein anderes Team ausführen, um die Qualität des Pfads selbst zu prüfen?
- Wie werden erwartete Nutzer, Supportlast und Nicht-Ziele sichtbar?

### Principal

Principal-Wirkung ordnet Wellen über Wertströme hinweg. Sie verhindert, dass Plattform, Cloud, AI und Enterprise Architecture als getrennte Schulungsprogramme ohne gemeinsame Schnittstellen wachsen. Ein Principal entscheidet, welche Voraussetzungen als organisationsweite Baseline gelten, welche Domänen vertieft werden und welche Varianten bis zu einer klaren Re-Evaluation weiter bestehen.

**Entscheidungsfragen:**

- Welche Kompetenzlücke blockiert mehrere strategische Outcomes?
- Welche Vorgriffe sind minimal und welche werden zu gefährlicher Kopie späterer Domains?
- Wo sollte eine gemeinsame Plattformfähigkeit entstehen und wo ist eine lokale Lösung wirtschaftlicher?
- Welche Evidenz zwingt zur Repriorisierung, etwa wiederkehrende Incidents, neue Datenklassen oder Modellwechsel?

### Chief

Chief-Wirkung behandelt Wellen als Capability-Portfolio. Sie legt Investitionsrahmen, Risikoappetit und Haltelinien fest. Sie entscheidet beispielsweise, ob die Organisation zuerst sichere Delivery- und Identity-Fähigkeiten aufbauen muss, bevor ein breiter GenAI-Pilot skaliert, oder ob ein Spezialistenpartner für GPU-Serving sinnvoll ist. Die Entscheidung verbindet technische Abhängigkeiten, Talent, Kosten, Souveränität, Kundennutzen und Exit.

**Entscheidungsfragen:**

- Welche Welle reduziert den wichtigsten strategischen oder regulatorischen Engpass im nächsten Zeitraum?
- Wie viel Kapital und Kapazität ist für Pilot, Standardisierung und Betrieb akzeptabel?
- Welche Fähigkeiten sind Kernkompetenz, welche werden über prüfbare Verträge bezogen?
- Welches Signal beendet oder verschiebt eine Initiative, bevor sie hohe Opportunitätskosten verursacht?

## Production Checklist

- [x] Die neun Originalwellen und ihre Domainfolgen sind unverändert aufgenommen.
- [x] Numerische Schreibreihenfolge, Lernwellen, Abhängigkeiten und Evidenzstatus sind getrennt.
- [x] Jede Welle besitzt beispielhafte Outcomes statt nur Kapitel- oder Toollisten.
- [x] Wellenübergänge prüfen Invariante, Gegenprobe, Owner, Kosten, Cleanup und Review.
- [x] Vorgriffe auf spätere Domains bleiben klein, begründet und als offene Vertiefung markiert.
- [x] Staff-, Principal- und Chief-Entscheidungen unterscheiden Referenzpfad, Harmonisierung und Capability-Portfolio.
- [x] Der Innovationsabschnitt enthält Reifegrad, Abnahmekriterium und Datenschutzgrenze.
- [ ] Der beschriebene Wellenübergang wurde nicht als reales persönliches Lern- oder Budgetprogramm ausgeführt.
- [ ] Die Datei hat nur Selbstreview und bleibt deshalb technical_review.

## Interviewfragen mit Antwortleitfäden

1. **Warum sind Schreibreihenfolge und Lernreihenfolge getrennt?**  
   Das Schreiben braucht eine stabile numerische Umsetzung und konsistente Register. Lernen braucht einen Outcome-orientierten Pfad, der Abhängigkeiten und persönliche Ziele berücksichtigt. Eine Datei kann daher früh fertig sein, aber erst später praktisch eingeübt werden.

2. **Wann darf eine spätere Domain vorgezogen werden?**  
   Wenn ein konkreter, begrenzter Mechanismus für eine kritische Invariante oder einen Pilot erforderlich ist. Der Vorgriff beschreibt nur die benötigten Begriffe und Gegenproben, verlinkt auf die kanonische Tiefe und bleibt keine Ersatzkopie der späteren Domain.

3. **Woran erkennen Sie, dass eine Welle abgeschlossen ist?**  
   Nicht an gelesenen Seiten. Der gewählte Outcome hat seine kritische Voraussetzung, Gegenprobe, Owner, Kosten- und Rückbaugrenze sowie Review in der benötigten Tiefe. Offene Spezialthemen werden sichtbar an spätere Wellen oder Experten übergeben.

4. **Wie gehen Sie mit einem fehlgeschlagenen Lab um?**  
   Ein Fehlschlag ist Evidenz. Zuerst wird die Ursache klassifiziert: falsches mentales Modell, fehlende Voraussetzung, Konfigurationsfehler, Sicherheitsgrenze oder ungeeigneter Scope. Dann wird der Nachweis wiederholt, Scope reduziert oder der Übergang gestoppt.

5. **Wie verhindern Sie Hype-getriebene Repriorisierung?**  
   Jede neue Technologie erhält einen klaren Use Case, Risiko, Reifegrad, Budget, Abnahmekriterium, Owner und Stopregel. Sie verdrängt eine laufende Welle nur, wenn ihr erwarteter Nutzen oder Risikobeitrag stärker begründet ist.

6. **Welche Kennzahlen sind für Lernfortschritt sinnvoll?**  
   Geschlossene kritische Nachweiskanten, Anteil mit Gegenprobe, Alter volatiler Quellen, Zeit bis zu einem sicheren Outcome, Wiederholung von Failure Modes und Kosten pro getesteter Hypothese. Sie bewerten keine Person, sondern die Qualität des Lernsystems.

7. **Wie unterscheiden sich Staff- und Chief-Steuerung von Lernwellen?**  
   Staff baut übertragbare technische Lern- und Referenzpfade. Chief priorisiert das Capability-Portfolio nach strategischem Wert, Risiko, Kapital und Exit. Beide benötigen konkrete Artefakte und Messung, aber auf unterschiedlicher Reichweite.

8. **Warum muss ein Lernledger Datenschutz berücksichtigen?**  
   Er kann persönliche Leistungsdaten, Kundendetails, Sicherheitslücken und Architekturinformationen enthalten. Nur minimal nötige, redigierte Evidenz darf gespeichert und zugänglich gemacht werden; der Ledger ist kein Ranking- oder Überwachungssystem.

## Praktisches Lab: Einen Wellenübergang begründen

**Fall.** Ein fiktives Produktteam möchte einen Retrieval-gestützten B2B-Agenten pilotieren. Der Agent erklärt Bestellstatus und schlägt eine Reservierung vor. Die früheste geplante AI-Welle ist Welle 3, doch der Use Case benötigt minimale Security-, Messaging-, Observability- und Kostenkenntnis aus späteren Wellen.

**Ziel.** Erzeuge ein Lernledger, das den Pilot nicht als vollständige AI- oder Securitykompetenz ausgibt, sondern seine benötigten Voraussetzungen, Nachweise und offenen Grenzen steuert.

### Inputs

- Ein Outcome: berechtigte Nutzer erhalten eine nachvollziehbare Antwort; keine direkte Bestandsänderung durch das Modell.
- Drei Invarianten: falsche Identity wird abgewiesen, nicht belegte Antwort wird gekennzeichnet, doppelte Anfrage erzeugt keine doppelte Reservierung.
- Synthetische Testdaten und eine lokale oder rein dokumentierte Testumgebung.
- Vier Rollen: Fachowner, GenAI-Implementierung, Platform-/Observability-Owner und Security-Review.
- Ein kleines Testbudget und eine feste Abschaltzeit, falls ein Cloud- oder Modellservice genutzt würde.

### Durchführung

1. Ordne den Fall der Welle 3 zu und lege ein einziges messbares Pilot-Outcome fest.
2. Formuliere die minimalen Vorgriffe: Audience und Scope, Idempotenz, Trace-Korrelation, Kostenlimit und grundlegende Datenklasse.
3. Verlinke jede Voraussetzung auf die kanonische spätere Domain, ohne deren Volltiefe zu kopieren.
4. Erzeuge je einen Nachweis: Toolvertrag, negative Identity-Probe, doppelter Request-Test, Trace- oder Ereignisplan und Kosten-/Cleanup-Notiz.
5. Markiere für jedes Artefakt executed, syntax_checked oder reviewed_only nur nach tatsächlichem Status.
6. Formuliere eine Architekturentscheidung: Was ist für den Pilot ausreichend und welche Punkte blockieren eine Produktionsausweitung?
7. Ergänze einen Recheck-Trigger: neue Modellversion, neue Datenklasse, externer Toolzugriff, Incident oder Budgetüberschreitung.
8. Entscheide: weiter, wiederholen, Scope verkleinern, Spezialist einbinden oder stoppen.

### Gegenprobe und Auswertung

Die Gegenprobe muss eine falsche Audience oder einen fehlenden Scope, eine leere oder unzureichende Quellenlage und eine doppelte Request-ID enthalten. Ein gutes Ergebnis beweist lediglich den begrenzten Pilotpfad. Es beweist nicht, dass die Sicherheits-, Messaging-, LLMOps- oder Cloudwelle vollständig abgeschlossen ist.

Prüfe nach der Fallarbeit, ob jede Entscheidung einen Owner, eine Messung, eine Gegenprobe, eine Daten- und Kostenbegrenzung sowie eine offene Grenze hat. Entferne Testdaten, Tokens und temporäre Logs. Bleibt eine kritische Kante offen, wird der Übergang gestoppt oder als bewusster Vorgriff mit passendem Review markiert.

**Labstatus:** reviewed_only. Der Fall wurde als datensparsame Lernanleitung geprüft, nicht als echter Produktpilot oder persönliche Kompetenzbewertung ausgeführt.

## Dependencies, Cross-References und Quellen

Die technischen Register- und Graphmechanismen liegen in [KB-0001](01-master-index-und-wegweiser.md) und [KB-0003](03-vollstaendiger-abhaengigkeitsgraph.md). Die Tiefe der Nachweise wird in [KB-0006](06-praktische-und-architektonische-lerntiefe.md) festgelegt. [KB-0008](01-master-index-und-wegweiser.md#kb-0008) und [KB-0009](01-master-index-und-wegweiser.md#kb-0009) vertiefen Versionierung und Laborstrategie. Die Fachdomänen ab Domain 01 liefern die kanonischen Mechanismen für jede Welle.

**Verwendete Quellen, Stand 2026-09-15.**

- Masterplan: Schreibreihenfolge und neun Lernwellen
- Dateikatalog: Inhaltsauftrag und kanonische Domains
- Artikelvertrag: Nachweisarten, Labgrenzen und Reviews

## Bonus: New Tech and Innovations

**Stand: 2026-09-15.** KI-gestützte Werkzeuge können ein Lernledger bei formalen Aufgaben unterstützen: fehlende Pflichtfelder, alte Quellen, unauflösbare Querverweise, Statuskonflikte oder nicht geschlossene Gegenproben lassen sich automatisiert finden. Der Reifegrad ist **Emerging bis Adopting**. Diese Automatisierung verbessert Nachvollziehbarkeit, kann aber nicht feststellen, ob ein mentales Modell stimmt, ein Test realistisch ist oder eine technische Entscheidung für eine Organisation trägt.

Ein Einführungspilot ist nur akzeptiert, wenn das Werkzeug auf redigierte Artefakte begrenzt bleibt, jeden Fund auf die konkrete Evidenzstelle zurückführt, keine Eignungs- oder Beförderungsurteile erzeugt und eine menschliche Reviewentscheidung verlangt. Neue Tool-, Modell- oder Protokollversionen lösen eine gezielte Revalidation aus; sie werden nicht als automatischer Kompetenzfortschritt gezählt.
