---
{"id": "KB-0014", "title": "Platform Architect als Zielrolle", "domain": "01", "sequence": 4, "document_type": "role", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0002", "concepts": ["Rollen-Kompetenz-Matrix", "Tiefenstufen", "Nachweisarten"], "needed_for": "understanding"}, {"id": "KB-0004", "concepts": ["Evidenzgrenzen", "zulässige Aussagen", "Zielkompetenzen"], "needed_for": "understanding"}, {"id": "KB-0005", "concepts": ["Kompetenzcanvas", "Entscheidungsreichweite", "Wirkungskette"], "needed_for": "understanding"}, {"id": "KB-0006", "concepts": ["Hands-on-Tiefe", "Architekturnachweis", "Spezialistenübergabe"], "needed_for": "understanding"}, {"id": "KB-0009", "concepts": ["Labstrategie", "Gegenprobe", "Evidenzgrenze"], "needed_for": "lab"}], "related": ["KB-0011", "KB-0012", "KB-0013", "KB-0015", "KB-0016", "KB-0400", "KB-0500", "KB-0572", "KB-0618", "KB-0720"], "applies": ["KB-0400", "KB-0500", "KB-0572", "KB-0618", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein selbstbedienbarer Golden Path für einen synthetischen Service wird mit Katalogmetadaten, Template, CI-Gate, Ownership, Telemetrie, Rollback und negativer Policyprobe spezifiziert und in einer sicheren Testumgebung erprobt.", "rationale": "Plattformarchitektur wird anhand des tatsächlichen Entwicklerwegs und seiner Fehlergrenzen nachgewiesen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Die Rolle begründet Plattformgrenzen, Nutzersegmente, Schnittstellen, Standardisierungsgrad, Betriebsmodell, Messsystem, Kostenmodell und Exit.", "rationale": "Sie gestaltet die soziotechnische Architektur, nicht nur die Auswahl einzelner Tools."}, "STAFF-TARGET": {"active": true, "scope": "Sie reduziert kognitive Last über mehrere Teams durch Plattformprodukte, klare Ownership, paved roads, dokumentierte Ausnahmen und messbare Adoption.", "rationale": "Staff-Wirkung entsteht aus nachhaltiger Teamautonomie mit sicheren gemeinsamen Fähigkeiten."}, "CHIEF-TARGET": {"active": true, "scope": "Sie steuert Plattformportfolio, zentral-föderierte Verantwortungsgrenzen, Investitions- und Ausstiegsentscheidungen, Risikoakzeptanz und die Verbindung von Technologie- zu Geschäftsstrategie.", "rationale": "Chief-Entscheidungen wählen die dauerhafte Organisations- und Kostenform, nicht nur einen Portalhersteller."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Tiefe Themen wie Kubernetes-CNI, CI-Runner-Härtung, SRE, Identity, Datenplattform, FinOps, UX Research und Change Management werden mit Fachverantwortlichen vertieft.", "rationale": "Ein Platform Architect integriert Spezialperspektiven und trägt deren Entscheidungsfolgen sichtbar zusammen."}}, "lab_validation": [{"lab_id": "KB-0014-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Synthetischer Servicekatalog- und Golden-Path-Fall mit rein lokalen Artefakten oder ausdrücklich freigegebenem Testsystem", "evidence": "Die Fallarbeit enthält Metadaten, Ownership, Templatevertrag, CI- und Policygates, OpenTelemetry-Signale, Flag-Rollout, Fehlprobe, Kostenannahme und Cleanup.", "limitations": "Kein Entwicklerportal, CI-System, Identity Provider oder produktiver Service wurde konfiguriert oder betrieben."}]}
---
# Platform Architect als Zielrolle

## Zweck, Definition und Scope

Ein Platform Architect entwirft die gemeinsamen technischen Produkte, Schnittstellen und Betriebsmodelle, mit denen Produktteams zuverlässig liefern können. Dazu gehören nicht nur Runtime und Infrastruktur, sondern auch Softwarekatalog, Identity, Entwicklungsumgebung, CI/CD, Standards, Observability, Support, Kosteninformation und ein klarer Weg für Ausnahmen. Der Zweck ist nicht maximale Zentralisierung. Der Zweck ist, die wiederkehrende kognitive und operative Arbeit so zu reduzieren, dass Teams sichere Entscheidungen und Änderungen selbst vornehmen können.

Diese Zielrolle liegt zwischen Produktentwicklung, SRE, Security, Cloud, Enterprise Architecture und Engineering Management. Sie trifft keine fachlichen Entscheidungen für jedes Produktteam. Sie verantwortet aber die Grenzen und Verträge gemeinsamer Fähigkeiten. Ein gutes Plattformprodukt bietet einen nachvollziehbaren Default, macht Risiken sichtbar und lässt Teams bei begründeten Sonderfällen kontrolliert abweichen.

Eigene Entwicklungsarbeit an einer Plattformkomponente, eine umgesetzte Integration oder eine Runtime-Konzeption liefern nur begrenzten Bezug. Daraus folgt kein Nachweis eines aktuell betriebenen Developer Portals, einer organisationsweiten Plattformadoption, von SLO-Verantwortung oder eines formalen Platform-Architect-Titels.

Nach diesem Kapitel kann der Leser:

1. Plattformen als interne Produkte mit Nutzersegmenten, Verträgen, Ownership, SLOs und Exit beschreiben;
2. Entwicklerautonomie, gemeinsame Standards, Security und Betriebsfähigkeit als Spannungsfeld statt als Toolauswahl behandeln;
3. einen Golden Path von Servicekatalog über Template und CI bis Produktion, Telemetrie, Incident und Decommissioning zeichnen;
4. entscheiden, welche Fähigkeit zentral, föderiert oder produktteamspezifisch bleibt;
5. Adoption, Durchlaufzeit, Zuverlässigkeit, Ausnahmequote und Kosten so messen, dass Plattformnutzen überprüfbar wird;
6. Staff-, Principal- und Chief-Entscheidungen mit Evidenz, Konsequenzen und Revisionsauslösern formulieren.

## Kompetenzmarker und Evidenzgrenzen

| Marker | Status | Aussage |
|---|---|---|
| CURRENT-EVIDENCE | offen | Eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| HANDS-ON-TARGET | aktiv | Ein Service durchläuft einen dokumentierten, selbstbedienbaren Golden Path mit Katalog, Template, Policy, Delivery, Telemetrie, Rollback und Gegenprobe. |
| ARCHITECT-TARGET | aktiv | Plattformgrenze, Produktsegmente, API, Betriebsmodell, Standardisierungsgrad, Messung und Exit werden begründet. |
| STAFF-TARGET | aktiv | Teams erhalten sichere Autonomie durch paved roads, Ownership, Support und befristete Ausnahmen. |
| CHIEF-TARGET | aktiv | Plattformportfolio, zentral/föderiert, Investition, Souveränität, Risikoakzeptanz und organisatorische Folgen werden gesteuert. |
| SPECIALIST-OPTIONAL | aktiv | Spezialtiefe wird bei dominanten Themen gemeinsam mit Security, SRE, Data, FinOps, UX und Change-Verantwortlichen aufgebaut. |

## Mental Model: Ein Flughafen mit sicheren Startbahnen

Die Plattform ist ein Flughafen, nicht die Fluggesellschaft. Sie stellt Startbahnen, Navigation, Sicherheitskontrolle, Gate-Zuteilung, Wetterinformationen und Notfallabläufe bereit. Das Produktteam bestimmt Ziel, Fracht, Zeitplan und seine Fachlogik. Ohne gemeinsame Startbahnen baut jedes Team eigene Sicherheitskontrollen und Rollwege. Mit zu wenigen freigegebenen Routen stehen alle Teams in derselben Warteschlange oder starten heimlich außerhalb des Flughafens.

Die Plattformarchitektur muss daher drei Dinge gleichzeitig erreichen:

- **Flow:** Ein Team kann von Idee zu sicherer Änderung ohne unnötige Wartezeit gelangen.
- **Governance:** Identität, Supply Chain, Daten, Kosten und Betriebsrisiko werden tatsächlich durchgesetzt oder sichtbar akzeptiert.
- **Feedback:** Nutzererlebnis, Durchlaufzeit, Qualität, Fehler und Kosten fließen zurück und verbessern das Produkt.

Die Analogie endet dort, wo sie Organisation als Mechanik erscheinen lässt. Tooling allein erzeugt keine Autonomie. Ownership, Teamtopologie, Produktverantwortung, Dokumentation und Supportfenster sind Teil der Plattformarchitektur.

## Prerequisites und Dependencies

Die [Rollenmatrix](../00-navigation-governance/02-rollen-kompetenz-matrix.md), [Selbsteinschätzung und Evidenzgrenzen](../00-navigation-governance/04-cv-istbild-und-zielkompetenzen.md), das [Kompetenzmodell](../00-navigation-governance/05-kompetenzmodell-fuer-staff-principal-und-chief.md), die [praktisch-architektonische Lerntiefe](../00-navigation-governance/06-praktische-und-architektonische-lerntiefe.md) und die [Labstrategie](../00-navigation-governance/09-laborstrategie-und-beweisartefakte.md) sind harte Grundlagen.

| Beziehung | Kapitel | Rolle für dieses Kapitel |
|---|---|---|
| related | [KB-0011: GenAI Solution Architect](01-genai-solution-architect-als-zielrolle.md) | Konkrete AI-Lösungen konsumieren Plattformangebote und bringen neue Bedarfssignale zurück. |
| related | [KB-0012: GenAI Engineer](02-genai-engineer-als-zielrolle.md) | Produktcode, Evals und Integrationen gegen Plattformverträge. |
| related | [KB-0013: AI Platform Architect](03-ai-platform-architect-als-zielrolle.md) | AI-spezifische Runtime-, GPU-, Gateway- und Tenancyvertiefung. |
| related | [KB-0015: Enterprise Architect](05-enterprise-architect-als-zielrolle.md) | Capability-, Portfolio- und Governancewirkung der Plattform. |
| related | [KB-0016: Cloud Architect](06-cloud-architect-als-zielrolle.md) | Landing Zone, Netzwerk, Provider- und Resilienzentscheidung. |
| applies | [KB-0400: Admission Control](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0400) | Policy als technische Durchsetzungsgrenze. |
| applies | [KB-0500: GCP VPC](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0500) | Beispiel für Cloud-Netzgrundlagen, die ein Plattformangebot kapseln kann. |
| applies | [KB-0572: Grafana und Betriebsdashboards](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0572) | Messbarkeit von Produkt- und Betriebssignalen. |
| applies | [KB-0618: GDPR und Datenschutzarchitektur](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0618) | Datenklassifikation, Zugriff und Retention als Plattformvertragsbestandteile. |
| applies | [KB-0720: Portfolioevidenz](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0720) | Lernergebnisse, Projektnachweise und Rollenansprüche trennen. |

## Core Concepts und Mechanismen

### Plattformprodukt statt Infrastrukturkatalog

Eine Plattformfähigkeit bekommt einen Produktnamen, ein Nutzersegment, einen Owner und eine überprüfbare Zusage. „Kubernetes ist vorhanden“ oder „Wir haben ein Portal“ sind keine Angebote. „Produktteams können einen HTTP-Service mit Teamidentity, CI-Prüfung, Standardtelemetrie, Runbook, Kostenstelle und Rollback innerhalb eines definierten Zeitfensters bereitstellen“ ist ein Angebot.

| Vertragselement | Leitfrage | Beispielnachweis |
|---|---|---|
| Nutzer | Für welches Team und welchen Reifegrad? | Persona, Onboarding, Berechtigungsmodell. |
| Job-to-be-done | Welche wiederkehrende Arbeit entfällt oder wird sicherer? | Baseline der manuellen Schritte und erwartete Durchlaufzeit. |
| Schnittstelle | Wie konsumiert ein Team? | Versioniertes Template, API, CLI, Portal oder Git-Vertrag. |
| Guardrail | Welche Vorgabe ist zwingend? | Policy-as-code, Identity, Signatur, Datenklasse, Audit. |
| Operability | Was ist messbar und wer reagiert? | SLO, Alert, Runbook, Supportmodell. |
| Kosten | Welche Einheit und welcher Owner? | Kostenstelle, Meter, Budget, Showback. |
| Ende | Wie wird abgebaut oder migriert? | Decommissioning, Datenlöschung, Export, Rückbau. |

Die Plattform wird über interne Nutzererfahrung gesteuert. Eine technische Komponente kann gut gebaut und dennoch ein schlechtes Plattformprodukt sein, wenn sie unauffindbar, schwer zu konsumieren, unklar besessen oder im Incident nicht unterstützt wird.

### Kognitive Last und Abstraktionsgrenze

Teams müssen die fachliche Komplexität ihrer Domäne tragen. Plattformen sollen zufällige Komplexität reduzieren: Zugangstokens, Buildhärtung, Deploywege, Telemetrie, Secrets, Standardalarme und Kosteninformation. Sie dürfen jedoch nicht jede technische Tatsache verstecken. Eine zu tiefe Abstraktion verhindert Debugging, Kostenverantwortung und sinnvolle Architekturentscheidungen.

Eine gute Grenze beantwortet:

- Kann ein Team die häufigste Aufgabe mit wenigen nachvollziehbaren Schritten erledigen?
- Bleiben wichtige Kosten-, Sicherheits- und Zuverlässigkeitsfolgen sichtbar?
- Kann ein Team den Standard mit dokumentierter Ausnahme verlassen?
- Gibt es genug Beobachtbarkeit, um Plattform- von Produktfehlern zu unterscheiden?
- Wird die Abstraktion durch reale Nutzung statt durch ein Architekturdiagramm validiert?

### Plattformschichten

| Schicht | Typische Fähigkeit | Ownerfrage |
|---|---|---|
| Experience | Katalog, Dokumentation, Template, CLI, Portal | Wer sorgt für auffindbaren, barrierearmen Konsum? |
| Delivery | Quellcode, Build, Tests, Signatur, Artefakt, Deployment | Welche Supply-Chain-Gates und Rückrollregeln gelten? |
| Runtime | Compute, Netzwerk, Secretzugriff, Service Discovery, Skalierung | Wo endet die Plattform- und wo beginnt die Produktverantwortung? |
| Data/Integration | Events, APIs, Datenzugriff, Migrationsweg | Welche Verträge und Fachowner schützen Konsistenz? |
| Operations | Telemetrie, SLO, Incident, Backups, Decommissioning | Wer sieht welches Signal und wer löst welchen Alarm? |
| Governance | IAM, Policy, Datenschutz, Risiko, Kosten, Ausnahmen | Was wird technisch erzwungen, was bewusst akzeptiert? |

Ein Layer ist kein Teamorganigramm. In kleinen Organisationen kann derselbe Mensch mehrere Schichten verantworten. Trotzdem müssen die Verantwortungsgrenzen explizit sein, damit ein Incident nicht zwischen Teams hängen bleibt.

### Paved Road, Guardrail und Ausnahme

Eine **paved road** ist der dokumentierte, unterstützte Standard für häufige Fälle. Ein **guardrail** ist eine technische oder organisatorische Regel, die wegen gemeinsamer Sicherheits-, Kosten- oder Zuverlässigkeitsgrenzen nicht umgangen werden darf. Ein **Escape Hatch** ist eine befristete, nachvollziehbare Ausnahme mit Owner, Risiko, Zusatzkontrolle und Rückkehrtermin.

Ohne Escape Hatch entstehen inoffizielle CI-Pipelines, geheime Providerzugänge und nicht katalogisierte Services. Ohne harte Guardrails werden Secrets, Kosten und Betriebsrisiken unsichtbar. Das Ziel ist nicht einheitliche Technologie; das Ziel ist eine begründete Zahl gut unterstützter Varianten.

## Architektur und Data Flow: Vom Servicewunsch zum betreibbaren Produkt

Der folgende fiktive Flow zeigt eine Plattform für Commerce-, AI- und klassische Backendteams.

```text
Team → Servicekatalog/Template → Git-Repository und Metadata
                  │                       │
                  ▼                       ▼
          Ownership, Datenklasse      CI: Test → Scan → Policy → Artefakt
                  │                       │
                  └─────────── Platform API / GitOps ───────────────┐
                                                                       ▼
Endnutzer → Edge → Produktservice → Runtime, Daten, AI-Gateway, Events
                                      │
                                      ▼
                           OTel Collector → Telemetrie, SLO, Kosten
                                      │
                                      ▼
                         Incident, Feedback, Katalogstatus, Verbesserung
```

1. Das Team registriert Component, Owner, System, Datenklasse, Abhängigkeiten, kritische SLO und Kostenstelle nahe am Code.
2. Ein Template erzeugt nur die geprüfte Basis: Build, Tests, SBOM-/Signaturweg, Telemetrie, Runbook, Deploymentmanifest und Ownershipdatei.
3. CI prüft vor dem Deployment die definierte Supply Chain, Konfiguration, Policy und produktspezifische Tests. Ein Plattformgate bestätigt nicht automatisch fachliche Qualität.
4. GitOps oder eine Plattform-API überführt gewünschten in beobachteten Zustand. Die Runtime meldet Health, Revision, Policy-Status, SLO und Kosten zurück.
5. Telemetrie wird über Collector/Backend verarbeitet. Produktteams sehen ihren Scope; Plattformteams sehen zusätzlich aggregierte Zuverlässigkeits- und Adoptionssignale.
6. Bei Incident trennt das Runbook Produktfunktion, Plattformabhängigkeit, Daten- und Providerpfad. Ein Backout kann Template-/Policy-, Deployment- oder Konfigurationsrevisionen betreffen.

Eine Portaloberfläche ist nur ein möglicher Zugang. Backstage etwa führt einen zentralen Softwarekatalog, dessen Metadaten nahe am Code in YAML liegen können; es kann Komponenten, APIs, Ressourcen, Ownership und Templates sichtbar machen. Der [Backstage Software Catalog](https://backstage.io/docs/features/software-catalog/) ist damit ein Beispiel für Experience- und Katalogschicht, keine verpflichtende Plattformreferenz.

## Protocols, Standards und Tools

| Bereich | Technik oder Standard | Entscheidungskriterium |
|---|---|---|
| Katalog/Portal | Backstage Catalog, eigene API, CMDB-Integration | Quelle der Ownership, Lifecycle und Abhängigkeit muss belastbar sein; UI ist nachrangig. |
| Identity | OIDC/OAuth, Workload Identity, RBAC, kurzlebige Tokens | Menschen, CI und Workloads brauchen getrennte, auditierbare Identitäten. |
| Delivery | Git, CI/CD, OCI, SBOM, Signaturen, GitOps, Policy-as-code | Artefaktprovenance, Wiederholbarkeit, Rollback und Durchsetzung. |
| Runtime | Kubernetes, VM, Serverless, PaaS, Service Mesh nach Bedarf | Betriebsmodell, Isolation, Portabilität, Teamreife und Kosten statt Mode. |
| Configuration | deklarative APIs, Versionierung, Secrets-Management, Drift-Erkennung | Gewünschter/realer Zustand und reversibler Change. |
| Observability | OpenTelemetry, OTLP, Collector, Metrik/Log/Trace-Backend | Korrelierbare Signale, Datenminimierung, Skalierung und Exit. |
| Feature Delivery | OpenFeature oder Anbieter-SDK, Release- und Experimentpolicy | Flag-Semantik, Audit, Kontextdaten, Notfallabschaltung und Anbieterwechsel. |
| Governance | ADR, Threat Model, SLO, Error Budget, Ausnahme- und Decommissioningprozess | Entscheidungen und Verantwortung bleiben nach Personalwechsel prüfbar. |

OpenFeature ist eine offene, herstellerneutrale API-Spezifikation für Feature Flags. Das kann den Anwendungs-Code von einem Flag-Anbieter entkoppeln, ersetzt aber nicht dessen Auswertungsdienst, Audit, Kontextschutz und Betriebsmodell. Siehe [OpenFeature Introduction](https://openfeature.dev/docs/reference/intro/). Der OpenTelemetry Collector kann Telemetrie vendorneutral annehmen, verarbeiten und exportieren; er reduziert Agentenvielfalt und kann Batching, Retry, Verschlüsselung oder sensitive Filterung zentralisieren. Seine Komponenten haben unterschiedliche Reifegrade und müssen wie andere Produktionssoftware gehärtet und beobachtet werden. Siehe [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/).

## Konfiguration und Implementierung

Ein Code-naher Servicekatalog braucht Mindestmetadaten. Das folgende Beispiel folgt der Datenform eines Backstage-Component-Descriptors. Feldnamen, Policies und Integrationen müssen gegen die konkrete Backstage-Version geprüft werden; es ersetzt weder eine Berechtigungs- noch eine Produktionskonfiguration.

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: commerce-status-api
  description: Status-API für berechtigte Commerce-Anfragen
  annotations:
    platform.example/data-class: confidential
    platform.example/cost-center: commerce-42
spec:
  type: service
  lifecycle: production
  owner: group:commerce-team
  system: commerce
  providesApis:
    - commerce-status-api
```

Ergänze im Template mindestens:

- ein korrektes `owner`-Feld, dessen Gruppe im Identity-System auflösbar ist;
- eine Service-ID und Kostenstelle, die in Telemetrie und FinOps wiederverwendet werden;
- Datenklasse und nötige Freigabe für Daten-/AI-Funktionen;
- Links zu Runbook, SLO, On-call, Repository, API-Vertrag und Decommissioning-Anleitung;
- eine CI-Prüfung, die fehlende oder ungültige Felder blockiert, aber klar erklärt, wie die Abweichung behoben wird.

Das Template darf nicht unbemerkt Cluster-Adminrechte, dauerhafte Tokens oder globale Netzwerkfreigaben vergeben. Es erzeugt eine kleinste nützliche, sichere Basis und übergibt besondere Rechte an einen nachvollziehbaren Prozess. Ein Demo-Portal mit manuell gepflegten Einträgen ist kein belastbarer Katalog: Ownership driftet, Abhängigkeiten fehlen und Incidentrouting zerfällt.

## Scalability und Performance

Plattformleistung misst sich nicht nur in API-Latenz. Sie umfasst Entwicklungsfluss, Versorgung und Betriebsstabilität.

| Signal | Einheit | Interpretation |
|---|---:|---|
| Time to first production-ready service | Stunden/Tage ab genehmigtem Start | Misst die Nutzbarkeit des Golden Path; kein Ersatz für Produktqualität. |
| Lead time for change | Zeit zwischen akzeptierter Änderung und sicherem Betrieb | Zeigt Flow, aber nicht ohne Change-Failure-Rate bewerten. |
| Erfolgreiche Self-Service-Quote | Anteil ohne manuelles Plattformticket | Hoher Wert ist nur gut, wenn Qualität und Sicherheit erhalten bleiben. |
| Plattform-SLO | Verfügbarkeit/Latenz je Fähigkeit | Portal, CI-Runner, Registry, Identity und Runtime getrennt messen. |
| Adoption und Bypass | Teams/Services auf Standard bzw. außerhalb | Bypass kann berechtigten Bedarf oder schlechtes Produkt signalisieren. |
| Policy-/Template-Failure | Rate, Kategorie, Behebungszeit | Wiederholte Fehler sind Discovery für bessere UX oder neue Guardrails. |
| Supportlast | Tickets, MTTA/MTTR, wiederkehrende Ursachen | Zeigt fehlende Automatisierung, Dokumentation oder Ownership. |
| Kosten | Kosten pro Angebot, Team, Deployment oder akzeptierter Task | Muss Fixkosten, Shared Services und Personal sichtbar machen. |

Skalierung beginnt mit einem Produktsegment. Eine Plattform, die alle Workloadarten, Clouds und Reifegrade am ersten Tag abdecken will, wird oft unzuverlässig und unverständlich. Starte mit einem häufigen, risikoarmen und messbaren „thin slice“, etwa ein interner HTTP-Service mit Standardtelemetrie. Erweitere erst, wenn das Team eine durchgängige Erfahrung erhält und die Supportdaten die nächste Investition begründen.

Caching, Queueing und horizontale Skalierung sind für Portale, CI-Runners, Artefaktregistries und Telemetriepipelines getrennt zu dimensionieren. Ein langsames Portal darf im Idealfall nicht produktive Services stoppen; eine nicht verfügbare Registry kann dagegen Delivery blockieren. Die Abhängigkeitsklasse bestimmt SLO, Redundanz und Fallback, nicht die Tatsache, dass beide „Plattformtools“ heißen.

## Reliability und Failure Modes

| Ausfall oder Fehlmodell | Signal | Prävention | Recoverygrenze |
|---|---|---|---|
| Developer Portal nicht erreichbar | UI/API-Fehler, Katalogstaleness | HA nach Bedarf, Read-only-Fallback, code-nahe Metadata | Bestehende Services bleiben lauffähig; Onboarding kann verzögert sein. |
| Katalog-Ownership falsch | Incidents ohne zuständiges Team, veraltete Metadaten | CI-Validierung, Gruppen-Synchronisation, Ownership-Review | Dienst als „unowned“ markieren, Eskalationsowner nutzen; keine willkürliche Teamzuordnung. |
| CI/Registry gestört | Build-/Pull-Fehler, wachsende Queue | getrennte SLOs, Caching, Backups, Kapazitätsmodell | Neue Delivery pausieren; bereits laufende Versionen nicht unnötig ändern. |
| Policy blockiert legitimen Release | Spike in denies, gleiche Fehlermeldung | Auditmodus, Staging, Tests, versionierte Policy | auf geprüfte Policy zurückrollen; Break-glass ist kurzlebig und auditiert. |
| Plattformupdate bricht Templates | Scaffoldfehler, Verbreitung alter Artefakte | Kompatibilitätsversionen, Contract-Tests, Deprecationfenster | altes Template befristet unterstützen oder Migration zurückstellen. |
| Telemetriepipeline überläuft | dropped spans, Queue, Backendkosten | Sampling, Batching, Limits, sensitive Filterung | Kernservice läuft weiter; Diagnoselücke wird als Incident sichtbar. |
| Zentrale Plattform wird Ticket-Hub | lange Wartezeit, Bypass, Supportlast | API/Template, klare Docs, Product Discovery | standardisieren oder Angebot begrenzen; nicht einfach mehr Tickets einstellen. |
| Flag-Fehlkonfiguration | unerwartete Nutzergruppe, SLO-Bruch | Change-Audit, Staging, Kill Switch, minimale Kontextdaten | Flag zurücksetzen, Auswirkung messen, Daten-/Auditgrenze prüfen. |

Retry ist kein universeller Recoverymechanismus. Bei Deployment oder Configuration Drift kann automatisches Wiederholen weitere Zustände verschlechtern. Jede Plattformfähigkeit braucht explizite Timeout-, Retry-, Idempotenz-, Rollback- und manuellen Eskalationsregeln.

## Security, Governance und Compliance

Plattformen sind privilegierte Multiplikatoren. Ein fehlendes Guardrail oder kompromittiertes Template kann viele Teams betreffen. Schutzobjekte sind daher Identity, CI-Credentials, Code und Artefakte, Secrets, Infrastruktur-APIs, Telemetrie, Katalogmetadaten, Datenklassifikation, Kostenstellen und Break-glass-Zugriffe.

| Risiko | Plattformkontrolle | Produktteamanteil |
|---|---|---|
| Supply-Chain-Kompromittierung | minimale CI-Rechte, Provenance/Signatur, Dependency- und Secret-Scanning, Audit | sichere Abhängigkeiten, Review und fachliche Freigabe. |
| Privilegiertes Template | least privilege, policy, Review, getrennte Rollen | nur notwendige Capabilities anfordern. |
| Unklare Ownership | Identity-Sync, Pflichtmetadaten, Eskalationspolicy | Team- und On-call-Daten aktuell halten. |
| Konfigurationsdrift | deklarativer Zustand, Versionierung, Driftalarme | produktbezogene Ausnahmen dokumentieren. |
| Datenschutzleck in Telemetrie | Redaction, retention, Zugriffstrennung, DLP | keine unnötigen persönlichen oder fachlichen Inhalte instrumentieren. |
| Flag als Sicherheitskontrolle | Flag nur für Produktverhalten, nicht als alleinige Autorisierung | Fachservice prüft Berechtigung deterministisch. |
| Plattformadminzugriff | JIT, MFA, Approval, Audit, zeitlicher Ablauf | keine dauerhaften Shared-Adminaccounts. |

Governance muss technische Durchsetzung, bewusste Ausnahme und Verantwortung unterscheiden. Eine ADR erklärt die Entscheidung, ersetzt aber keine Policy. Eine Policy blockiert oder prüft Konfiguration, ersetzt aber keine Produktentscheidung. Ein Auditbeleg erklärt rückblickend, wer was tat, verhindert aber nicht automatisch Fehlkonfiguration.

## Observability und Troubleshooting

Die Observability eines Plattformprodukts beantwortet zwei getrennte Fragen: „Ist die Plattform gesund?“ und „hilft sie Teams, sicher zu liefern?“ Beide benötigen technische und Produktmetriken.

| Ebene | Metriken/Logs/Traces | Diagnosefrage |
|---|---|---|
| Experience | Katalog-Ladezeit, Suche, Templateerfolg, Docs-Feedback | Finden und verstehen Teams den Standard? |
| Delivery | Builddauer, Queue, Scan/Policyfehler, Artefakt-Pull | Blockiert die Plattform sichere Changes? |
| Runtime | Deploymentstatus, SLO, Revision, Ressourcendruck | Ist die bereitgestellte Fähigkeit stabil? |
| Governance | Policydenies, Ausnahmealter, Credentials, Auditereignisse | Werden Leitplanken wirksam und sind Ausnahmen befristet? |
| Telemetrie | Collector-Drops, Batching, Backendlatenz, Retentionkosten | Ist die Beobachtung selbst vertrauenswürdig und bezahlbar? |
| Produkt | Adoption, Bypass, Ticketrate, Time to first deploy | Erzeugt das Angebot Autonomie oder neue Bürokratie? |

Ein Diagnoseablauf bei „Teams können heute nicht deployen“:

1. Prüfe zuerst Scope: alle Teams oder ein Projekt, alle Regionen oder ein Runner, nur neues Template oder auch bestehende Pipelines?
2. Trenne Portal/Katalog von CI, Registry, Identity, Policy und Runtime. Ein Portalfehler kann Auffindbarkeit stören, während CI weiter funktioniert.
3. Korrelierte Änderungen prüfen: Templateversion, Policybundle, Identity-Gruppen, Registryzertifikat, Runner-Image, Netzwerk oder Providerstatus.
4. Fehlerklasse und Korrelation-ID auswerten. Secrets, Quellcode und personenbezogene Telemetrie nicht als Debugabkürzung breit öffnen.
5. Gegenprobe in einer genehmigten Testpipeline: einen bekannten, minimalen Service gegen zuletzt gute Plattformversion ausführen. Sie prüft die Plattformgrenze, nicht das Produkt.
6. Nach Recovery Ursache, Blast Radius, fehlende Contract-Tests und notwendige Katalog-/Runbook-Änderung erfassen.

## Cost und FinOps

\[
C_{platform}=C_{people}+C_{portal}+C_{delivery}+C_{runtime}+C_{observability}+C_{security}+C_{support}
\]

\[
C_{enabled\ service}=\frac{C_{platform}}{\max(1,N_{services\ with\ verified\ adoption})}
\]

Die zweite Formel ist nur ein Lernmodell. Nicht alle Services erzeugen gleichen Nutzen und nicht jede Plattformfähigkeit wird gleich genutzt. Sie verhindert aber die Erzählung, eine Plattform sei kostenlos, weil ihr Budget zentral liegt.

| Kostentreiber | Allokation | Steuerhebel | Fehlannahme |
|---|---|---|---|
| Personal/Support | Produktfähigkeit, Team, Zeitfenster | Automatisierung, Dokumentation, klare Grenzen | Plattformkosten seien nur Cloudkosten. |
| CI/Runner/Registry | Buildminute, Storage, Egress, Nutzergruppe | Caching, Retention, Quota, Runnerklasse | Optimierung durch unsichere gemeinsame Credentials. |
| Portal/Katalog | Betrieb, Plugins, Datenbank, Integrationen | schlanker Kern, Produktdiscovery, Lifecycle | Jede Integration erhöhe automatisch Nutzen. |
| Observability | Ingestion, Kardinalität, Retention | Sampling, SLO-fokussierte Signale | vollständige Daten seien immer besser. |
| Runtime | Compute, Netzwerk, Lizenz, Reserve | Workloadplatzierung, Skalierung, Scheduling | Gemeinsame Plattform sei automatisch günstiger. |
| Shadow Platform | doppelte Tools, Risiken, Support | gute paved roads, kontrollierte Ausnahmen | Bypass sei nur Ungehorsam. |

FinOps ist ein Entscheidungsrückfluss. Das Plattformteam macht Kosten und Verteilung sichtbar; Fach- und Portfolioowner entscheiden bewusst über Priorität, Nutzen und Risikobudget.

## Trade-offs und Anti-Patterns

| Entscheidung | Alternative | Trade-off und Revisionssignal |
|---|---|---|
| Ein Entwicklerportal | APIs, CLI und docs-as-code ohne Portal | Portal reduziert Kontextwechsel, braucht aber Product Ownership und Security. Niedrige Adoption oder unzuverlässige Daten lösen Review aus. |
| Zentraler Standard | Föderierte Varianten | Zentral senkt Wiederholung, föderiert erhöht Domänennähe. Wiederkehrende Ausnahmen oder Schattenplattformen zeigen falsche Grenze. |
| Template mit Guardrails | Freie Projektstarts | Template beschleunigt häufige Fälle, kann Legacy/Experimente hemmen. Ausnahmen müssen zeitlich begrenzt sein. |
| Self-Service | Plattformtickets | Self-Service braucht gute UX, robuste Defaults und Support; Tickets können für seltene Hochrisikofälle richtig sein. |
| Ein Observability-Pfad | teamspezifische Backends | Vereinheitlichung erlaubt Korrelation, kann Datenhoheit und Kosten verschlechtern. Datenklasse und Exit entscheiden. |
| Feature Flags | Deployment für jede Änderung | Flags erlauben gestufte Freigabe und Kill Switch, schaffen aber Konfigurationsschuld und dürfen Autorisierung nicht ersetzen. |

Anti-Patterns sind das Portal als Link-Sammlung, ein Toolkatalog ohne Vertrag, Plattformarchitektur als Organigramm, Standardisierung ohne Nutzerforschung, zentrale Teams als Ticketweiterleitung, „golden path für alles“, unbegrenzte Flag-Lebensdauer, Telemetrie ohne Datenbudget und ein ADR-Friedhof ohne technische Durchsetzung.

## Staff-, Principal- und Chief-Entscheidungen

| Ebene | Entscheidung | Evidenz und Folge |
|---|---|---|
| Staff | Thin Slice für den ersten Golden Path wählen | Wiederholte Teamarbeit, Risiko und Durchlaufzeit zeigen den besten Start. Zwei Teams müssen das Angebot selbst erfolgreich nutzen. |
| Staff | Katalogmetadaten als code-nahe Pflicht definieren | Owner, Lifecycle, Datenklasse, Runbook und SLO werden validiert. Fehlende Angaben erzeugen klare, lösbare CI-Fehler. |
| Staff | Ausnahmeprozess produktisieren | Jede Ausnahme hat Owner, Ablauf, Risiko, Zusatzkontrolle und Rückkehrkriterium. Wiederholung signalisiert Produktlücke. |
| Principal | Zentral/föderiert pro Fähigkeit bestimmen | Teamtopologie, gemeinsame Risiken, Integrationskosten, Datenhoheit, Support und Migration werden je Fähigkeit bewertet. |
| Principal | Plattformverträge als APIs behandeln | Version, Kompatibilität, Deprecationfenster, Contract-Test und Migration verhindern Template-/Portalbruch als Unternehmensrisiko. |
| Chief | Plattformportfolio priorisieren | Nutzerwert, Rendite, Risiko, Souveränität, FTE, Ausstiegsfähigkeit und Operating Model bestimmen Investition statt Toolpopularität. |
| Chief | Verantwortungsmodell festlegen | Klärt, welche Fähigkeiten zentral finanziert, welche Produktteams tragen und welche Ausnahmen akzeptabel sind. |

Ein Chief wählt auch die Grenzen des Nicht-Zentralen. Ein kleiner Spezialservice muss nicht in ein Portal gezwungen werden, wenn Risiko, Betrieb und Exit transparent bleiben. Zentralisierung ist ein Mittel für Wiederholung und gemeinsame Risiken, kein Selbstzweck.

## Production Checklist

| Bereich | Prüfnachweis | Owner | Stop-/Rollbackbedingung |
|---|---|---|---|
| Nutzervertrag | Zielteam, Job-to-be-done, Interface, SLO, Support, Exit | Platform Product Owner | Kein Nutzerowner oder nur Toolliste. |
| Katalog/Ownership | validierte Metadaten, Identity-Sync, Eskalationsweg | Platform + Engineering | unowned kritischer Service ohne Übergangsowner. |
| Delivery | Build/Test/Policy/Provenance, Staging, Rollback | Platform + Produktteam | nicht reproduzierbarer oder ungetesteter Supply Chain Pfad. |
| Runtime | Kapazität, Zugriffsmodell, Health, Backup/Recovery | Platform/SRE + Produktteam | SLO ohne belastbaren Dependency- oder Recoveryplan. |
| Security | least privilege, Secrets, Audit, Template Review | Security + Platform | dauerhafte privilegierte Credentials. |
| Observability | SLO, Dashboards, Alert, Runbook, Datenbudget | SRE/Platform | keine Detektion kritischer Plattformabhängigkeit. |
| Kosten | Meter, Budgetowner, Showback, Retention | FinOps + Owner | nicht zuordenbare oder unlimitierte Nutzung. |
| Ausnahme | ADR/Request, Ablauf, Zusatzkontrolle, Rückweg | Entscheider + Platform | permanente Ausnahme ohne Revisionsdatum. |
| Decommissioning | Datenlöschung, Zugriffsentzug, Katalogarchiv, Kostenende | Service Owner + Platform | kein Owner oder Nachweis des Rückbaus. |

## Interviewfragen mit Antwortleitfäden

1. **Was unterscheidet eine Plattform von einem zentralen Infrastrukturteam?** Eine Plattform hat interne Nutzer, Produktvertrag, messbare Outcomes, Support und Exit. Zentralität allein erzeugt keinen Produktcharakter.
2. **Wie reduzieren Sie kognitive Last, ohne Teams zu entmündigen?** Biete einen klaren Default, behalte relevante Kosten/Risiken sichtbar, dokumentiere Debugpfade und ermögliche befristete Ausnahmen.
3. **Welche Metadaten gehören in einen Servicekatalog?** Mindestens Owner, Lifecycle, System, API, Datenklasse, SLO/Runbook, Abhängigkeiten und Kostenkontext. Frage nach der Quelle der Wahrheit und der Aktualisierung.
4. **Wann ist ein Portal die falsche erste Investition?** Wenn Ownership, Standards, CI oder Support nicht existieren. Dann würde ein schönes UI nur falsche oder unvollständige Informationen zentralisieren.
5. **Wie beurteilen Sie Self-Service?** An erfolgreicher Nutzung ohne Ticket, Durchlaufzeit, Policyqualität, Supportlast, Bypass und Nutzerfeedback. Ein Klick allein ist kein Outcome.
6. **Wie behandeln Sie eine Plattformpolicy, die ein dringendes Release blockiert?** Scope prüfen, Break-glass befristet und auditiert einsetzen, Policy zurückrollen oder korrigieren und einen Contract-Test ergänzen. Nie einfach global abschalten.
7. **Warum ist Feature Flag kein Autorisierungsmechanismus?** Flags ändern Produktverhalten und können falsch konfiguriert sein. Der Fachdienst muss Berechtigung unabhängig deterministisch prüfen.
8. **Wie verhindern Sie, dass der Plattformkatalog veraltet?** Metadata-as-code, CI-Validierung, Identity-Synchronisation, klare Lifecycle-Übergänge, unowned-Alarm und regelmäßige Ownership-Reviews kombinieren.

## Praktisches Lab / Fallarbeit: Ein versionierter Golden Path für einen Commerce-Service

**Status:** **reviewed_only**, Stand 2026-09-15. Diese Fallarbeit wurde nicht gegen ein reales Portal, CI, Identity-System, Cluster oder Produktionsservice ausgeführt. Sie erzeugt keine Autorisierung zur Beschaffung, Cloud-Provisionierung oder Nutzung realer Kundendaten.

### Ziel und Input

Ein fiktives Commerce-Team möchte eine Status-API bereitstellen. Der Service verarbeitet vertrauliche Bestelldaten und ruft optional einen AI-gestützten Erklärpfad auf. Er braucht klaren Owner, fachliche Autorisierung, Standardtelemetrie, getestete Delivery und eine sofortige Abschaltmöglichkeit für den AI-Pfad.

Erstelle lokal die Verzeichnisse `catalog/`, `template/`, `policy/`, `ci/`, `runbook/`, `evals/` und `evidence/`. Nutze ausschließlich synthetische Daten. Annahme: zwei Teams sollen den gleichen Grundpfad nutzen können; Budgetannahme für zentrale Entwicklungs- und Testwerkzeuge beträgt 150 Euro im Monat.

### Aufbau

1. Erstelle ein Component-Metadatenartefakt mit Owner, Lifecycle, System, Datenklasse, Kostenstelle, API und Runbook.
2. Beschreibe ein Template, das Test, SBOM-/Signaturanforderung, Deploymentmanifest, OpenTelemetry-Basis, SLO und Decommissioning-Datei erzeugt. Markiere bewusst, welche Felder das Team selbst ausfüllen muss.
3. Definiere eine CI-Policy: fehlender Owner, fehlende Datenklasse oder nicht vorhandenes Runbook blockieren den Merge. Jede Fehlermeldung enthält den Behebungsweg.
4. Beschreibe eine Flagstrategie für den AI-Erklärpfad: Owner, Zielgruppe, Ablaufdatum, Kill Switch, Audit und Regel, dass Fachautorisierung niemals durch Flag ersetzt wird.
5. Lege ein Telemetrieschema mit Service, Revision, SLO, Fehlerklasse, Latenz und Kostenstelle an. Rohbestelldaten, Nutzername und Prompt werden ausgeschlossen.
6. Zeichne den gesamten Flow vom Template bis zum Incident und formuliere SLO, Dependency-Map, Rollback und Decommissioning.
7. Rechne monatliche Plattformkosten exemplarisch aus Personalzeit, CI-Minuten, Artefaktstorage, Telemetrie und Support. Kennzeichne alle Zahlen als fiktiv.

### Gegenproben

| Probe | Erwartetes Resultat | Lerngrenze |
|---|---|---|
| Component ohne Owner | CI verweigert mit konkreter Korrekturanweisung | Keine Aussage über echten Identity-Provider. |
| Template fordert Cluster-Adminzugriff | Policy oder Review lehnt ab | Keine vollständige Production-Härtung. |
| Flag aktiviert AI-Pfad für falsche Gruppe | Flag-Audit/Kill Switch sichtbar; Fachservice verweigert trotzdem unberechtigte Daten | Flag ist keine Access-Control-Prüfung. |
| OTel-Event enthält Rohbestellnummer | Schema-/Redactiontest schlägt fehl | Keine Ersetzung einer Datenschutzprüfung. |
| Portal/Katalog nicht erreichbar | Bestehender Service und CI-Vertrag bleiben dokumentiert nutzbar | Kein HA-Test eines echten Portals. |

### Auswertung und Cleanup

Bewerte die Arbeit erst als erfolgreich, wenn zwei fiktive Teams den gleichen Vertrag verstehen, die fünf Gegenproben erklären und für jedes Plattformversprechen einen Owner sowie Durchsetzungspunkt finden. Entferne lokale Testdaten und halte fest, dass keine Infrastruktur, Secrets oder realen Daten verwendet wurden. Für eine spätere Ausführung sind Versionen, Screenshots/Logs, CNI-/Identity-Details und die fachliche Freigabe separat nachzureichen.

## Dependencies, Cross-References und Quellen

Die Rollensteuerung, Evidenzgrenzen und Labanforderungen kommen aus [KB-0002](../00-navigation-governance/02-rollen-kompetenz-matrix.md), [KB-0004](../00-navigation-governance/04-cv-istbild-und-zielkompetenzen.md), [KB-0005](../00-navigation-governance/05-kompetenzmodell-fuer-staff-principal-und-chief.md), [KB-0006](../00-navigation-governance/06-praktische-und-architektonische-lerntiefe.md) und [KB-0009](../00-navigation-governance/09-laborstrategie-und-beweisartefakte.md). Die AI-spezifische Ergänzung steht in [KB-0013](03-ai-platform-architect-als-zielrolle.md); Enterprise- und Cloud-Perspektive folgen in [KB-0015](05-enterprise-architect-als-zielrolle.md) und [KB-0016](06-cloud-architect-als-zielrolle.md).

| Quelle | Verwendete Aussage | Stand |
|---|---|---|
| Dateikatalog der Knowledge Base, KB-0014 | Verbindlicher Scope, Pfad und Rollenfokus. | Planstand 2026-09-14 |
| [Backstage Software Catalog](https://backstage.io/docs/features/software-catalog/) | Code-nahe Metadaten, Ownership, Services, APIs, Ressourcen und Katalognutzung. | Abgerufen 2026-09-15 |
| [Backstage Technical Overview](https://backstage.io/docs/overview/technical-overview/) | Katalog, Templates, Plugins, Dokumentation und Entwicklerportal als erweiterbarer Rahmen. | Abgerufen 2026-09-15 |
| [OpenFeature Introduction](https://openfeature.dev/docs/reference/intro/) | Anbieterneutrale Feature-Flag-API und Anforderungen an vollständige Flag-Systeme. | Abgerufen 2026-09-15 |
| [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) | Vendorneutrales Empfangen, Verarbeiten und Exportieren von Telemetrie sowie Betriebs-/Reifegrenzen. | Abgerufen 2026-09-15 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — Entwicklerkataloge werden zu AI-fähigen Steuerungspunkten.** Backstage dokumentiert inzwischen AI-bezogene Ressourcen im Katalog sowie eine MCP-Actions-Integration mit Streamable HTTP und OAuth. **Reifegrad: Adopting.** Das kann Katalog, Templates und dokumentierte Plattformaktionen für AI-Assistenten zugänglich machen. Es vergrößert zugleich die Angriffsfläche: ein Toolzugriff darf nicht aus Katalogsicht automatisch Schreibrechte oder Produktionsaktionen bedeuten. Ein Pilot startet mit read-only Katalogabfragen, präziser OAuth-Scope, Audit, erlaubten Templates und einem Test, der eine unberechtigte Aktion sicher ablehnt. Quelle: [Backstage AI Overview](https://backstage.io/docs/ai/).

**Stand 2026-09-15 — Feature-Flag-SDKs können Anbieterwechsel und progressive Delivery entkoppeln.** OpenFeature standardisiert die Clientseite von Flag-Auswertung, nicht den gesamten Flagdienst. **Reifegrad: Adopting.** Das senkt bei sauberer Abstraktion Migrationskosten und unterstützt Canary, Kill Switch und kontrollierte Degradation. Neue Risiken sind Kontextdaten, Flag-Lebensdauer, Providersemantik und vermeintliche Sicherheitskontrollen. Ein Pilot definiert deshalb Kontextminimierung, Audit, Ablaufdatum, Notabschaltung, Provideradaptertests und eine Regel gegen Flags als alleinige Autorisierung. Quelle: [OpenFeature Introduction](https://openfeature.dev/docs/reference/intro/).

**Stand 2026-09-15 — Telemetriepipelines werden selbst zu Plattformprodukten.** Der OpenTelemetry Collector kann eine zentrale, vendorneutrale Verarbeitungsschicht mit Batching, Retry, Verschlüsselung und sensibler Filterung darstellen. **Reifegrad: Established für Kernmechanik, Adopting für organisationsweit standardisierte Governance.** Eine zentrale Pipeline spart Instrumentierungswiederholung, kann aber ein Daten- und Kostenmultiplikator sein. Einführung erst mit Datenklassifikation, Lasttest, Drop-/Queue-SLO, Redaction-Gegenprobe, Export-Exit und getrennten Zugriffen auf Team- und Plattformdaten. Quelle: [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/).

