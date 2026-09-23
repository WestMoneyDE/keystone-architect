---
{"id": "KB-0017", "title": "Solution Architect als Zielrolle", "domain": "01", "sequence": 7, "document_type": "role", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0002", "concepts": ["Rollen-Kompetenz-Matrix", "Tiefenstufen", "Nachweisarten"], "needed_for": "understanding"}, {"id": "KB-0004", "concepts": ["Evidenzgrenzen", "zulässige Aussagen", "Zielkompetenzen"], "needed_for": "understanding"}, {"id": "KB-0005", "concepts": ["Kompetenzcanvas", "Entscheidungsreichweite", "Wirkungskette"], "needed_for": "understanding"}, {"id": "KB-0006", "concepts": ["Hands-on-Tiefe", "Architekturnachweis", "Spezialistenübergabe"], "needed_for": "understanding"}, {"id": "KB-0009", "concepts": ["Labstrategie", "Gegenprobe", "Evidenzgrenze"], "needed_for": "lab"}], "related": ["KB-0011", "KB-0012", "KB-0013", "KB-0014", "KB-0015", "KB-0016", "KB-0018", "KB-0019", "KB-0400", "KB-0572", "KB-0618", "KB-0720"], "applies": ["KB-0400", "KB-0572", "KB-0618", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein synthetischer B2B-Use-Case wird zu einem Solution Blueprint mit Stakeholdern, NFRs, Context/Data Flow, API/Eventvertrag, Lieferantengrenzen, Testfällen, Abnahmekriterien, Runbook und negativen Proben ausgearbeitet.", "rationale": "Eine integrierte Lösung wird erst durch ihre Verträge, Fehlergrenzen und Abnahmebelege greifbar."}, "ARCHITECT-TARGET": {"active": true, "scope": "Die Rolle kann Fachanforderungen, Daten, Integrationen, Security, Cloud/Platform, Operation, Kosten, Delivery und Exit in einer entscheidbaren Zielarchitektur verbinden.", "rationale": "Solution Architecture trägt die End-to-End-Kohärenz eines Lösungskontexts, ohne Fach- oder Plattformownership an sich zu ziehen."}, "STAFF-TARGET": {"active": true, "scope": "Sie etabliert wiederverwendbare Entscheidungs-, Vertrags-, NFR-, Abnahme- und Incidentmuster über mehrere Lösungsprojekte und Lieferantengrenzen hinweg.", "rationale": "Staff-Wirkung entsteht durch deutlich weniger Integrationsüberraschungen und bessere Entscheidungsqualität."}, "CHIEF-TARGET": {"active": true, "scope": "Sie steuert Investitions- und Lieferantenrisiko, Architekturqualitätsrahmen, Make/Buy/Partner-Entscheidungen, Abnahmepolitik und die Eskalation systemischer Risiken.", "rationale": "Chief-Verantwortung wählt die Portfolio- und Governancegrenzen, nicht einzelne API-Feldnamen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Tiefe Fachlogik, Rechts-/Datenschutzfragen, Netzwerk, SRE, Datenmigration, Modellevaluation, Beschaffung und Vertragsverhandlung werden mit zuständigen Spezialisten verantwortet.", "rationale": "Der Solution Architect integriert deren Constraints und Entscheidungen zu einer nachvollziehbaren Gesamtarchitektur."}}, "lab_validation": [{"lab_id": "KB-0017-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Synthetischer Commerce-Status- und AI-Erklärfall mit lokalen Architektur- und Vertragsartefakten", "evidence": "Der Fall enthält Stakeholder, Scope, NFRs, Context/Data Flow, OpenAPI-/AsyncAPI-Ausschnitte, Fehlervertrag, Trust Boundaries, Lieferantengrenzen, Test-/Abnahmematrix, Kostenannahme, Incident und negative Proben.", "limitations": "Kein realer ERP-/WMS-, Modellprovider-, Cloud-, Lieferanten- oder Kundenzugriff und keine produktive Abnahme wurden durchgeführt."}]}
---
# Solution Architect als Zielrolle

## Zweck, Definition und Scope

Ein Solution Architect übersetzt eine geschäftliche Aufgabe in eine integrierte, abnehmbare und betreibbare Lösung. Die Rolle verbindet Stakeholder, fachliche Regeln, Daten, Anwendungen, Schnittstellen, Plattform, Cloud, Security, Delivery, Betrieb, Kosten und Lieferantengrenzen. Das Ergebnis ist nicht nur ein Diagramm: Es ist ein Satz entscheidbarer Annahmen, Verträge, Nichtfunktionaler Anforderungen, Abnahmebelege, Risiken und Übergänge, durch den Produkt- und Lieferteams konsistent bauen und betreiben können.

Die Rolle liegt zwischen mehreren Ebenen. Enterprise Architecture bestimmt Capability-, Portfolio- und Governancekontext. Software Architecture strukturiert Code und Komponenten einer Anwendung. System Architecture untersucht Hardware-, Betriebssystem-, Netzwerk- und Softwarewirkung als Gesamtsystem. Solution Architecture hält die End-to-End-Kohärenz für einen konkreten Lösungsraum: etwa Commerce-Status, ERP-Integration und AI-gestützte Erklärungen. Sie übernimmt weder die fachliche Autorität des Domain Owners noch die Betriebsverantwortung einer zentralen Plattform.

Eigene Implementierungsarbeit an einer Systemintegration, einer agentischen Anwendung oder einem Prototyp liefert Bezug zur Rolle, ist aber kein Nachweis eines formalen Solution-Architect-Titels, einer externen Lieferantenführung, vollständiger Produktionsabnahme oder SLA-Verantwortung.

Nach diesem Kapitel kann der Leser:

1. eine Geschäftsanforderung in Scope, Stakeholder, fachliche Invarianten, Daten, Schnittstellen, NFRs, Risiko, Kosten und Abnahmekriterien zerlegen;
2. eine End-to-End-Architektur von Nutzerabsicht über API/Event, Fachsystem und Plattform bis Operations mit Trust Boundaries zeichnen;
3. einen synchronen und asynchronen Vertragsweg samt Idempotenz, Fehlersemantik, Version, Ownership und Recovery begründen;
4. Lieferantenschnittstellen über Capability, Vertrag, SLO, Daten, Security, Change, Support und Exit statt über Produktnamen führen;
5. Acceptance Criteria formulieren, die Geschäftsergebnis, Security, Zuverlässigkeit, Performance, Observability und Betrieb abdecken;
6. Architekturentscheidungen mit Optionen, Annahmen, Folgen, Ownern und Revisionsauslösern dokumentieren.

## Kompetenzmarker und Evidenzgrenzen

| Marker | Status | Bedeutung |
|---|---|---|
| CURRENT-EVIDENCE | offen | Eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| HANDS-ON-TARGET | aktiv | Ein synthetischer Lösungsfall enthält Blueprint, API/Eventvertrag, NFRs, Trust Boundaries, Test-/Abnahmematrix und negative Proben. |
| ARCHITECT-TARGET | aktiv | Anforderungen, Fachgrenzen, Integration, Cloud/Platform, Security, Betrieb und Exit werden in einem abnehmbaren Gesamtentwurf verbunden. |
| STAFF-TARGET | aktiv | Wiederverwendbare Vertrags-, NFR-, Abnahme-, Incident- und Lieferantenmuster werden für mehrere Lösungsprojekte bereitgestellt. |
| CHIEF-TARGET | aktiv | Make/Buy/Partner, Architekturqualitätsrahmen, Risiko, Abnahmepolitik und Eskalation systemischer Lieferabhängigkeiten werden gesteuert. |
| SPECIALIST-OPTIONAL | aktiv | Spezialisten für Fachdomäne, Recht, Daten, Security, Netzwerk, SRE, Migration, Modelle und Beschaffung bleiben sichtbare Entscheider. |

## Mental Model: Der Bauleiter mit prüfbarem Übergabeprotokoll

Ein Solution Architect ist kein Eigentümer jeder Komponente. Die Rolle gleicht einem Bauleiter, der sicherstellt, dass Grundstück, Statik, Leitungen, Zugänge, Baugewerke, Brandschutz, Wartungsplan und Übergabe zusammenpassen. Das Team für Elektrik bestimmt nicht die Gebäudegeometrie allein, und der Bauleiter darf nicht behaupten, jede Spezialarbeit selbst auszuführen. Er macht Schnittstellen, Verantwortlichkeiten, Reihenfolge und Abnahme sichtbar.

Die zentrale Frage lautet: „Kann ein realer Nutzer unter den vereinbarten Bedingungen ein fachlich korrektes Ergebnis erhalten, und wissen wir, was bei falschen Daten, Netzfehlern, Lieferantenausfall, Berechtigungsfehler, Last oder Änderung passiert?“ Ein Architekturdiagramm ohne Verträge, Fehlermodus und Abnahme beantwortet diese Frage nicht.

Invarianten:

1. **Fachsysteme bleiben autoritativ.** Ein Gateway, LLM, UI oder Adapter erzwingt keine fachliche Berechtigung oder Zustandsinvariante.
2. **Ein Interface ist mehr als ein Payload.** Ownership, Auth, Datenklasse, Version, Semantik, Fehler, Idempotenz, Limit, SLO, Support und Exit gehören dazu.
3. **NFRs sind akzeptierte Grenzen.** „Schnell“ oder „sicher“ ohne messbare Workload, Failure Mode und Owner ist keine Anforderung.
4. **Abnahme testet Annahmen, nicht nur Happy Paths.** Negative Fälle und Recoverygrenzen gehören vor Go-live in die Lösung.
5. **Lieferant ist Teil der Architektur.** Vertrag, Betrieb, Daten, Audit, Changefenster, Kosten und Wechselbarkeit formen die End-to-End-Fähigkeit.

## Prerequisites und Dependencies

Die [Rollenmatrix](../00-navigation-governance/02-rollen-kompetenz-matrix.md), [Selbsteinschätzung und Evidenzgrenzen](../00-navigation-governance/04-cv-istbild-und-zielkompetenzen.md), das [Kompetenzmodell](../00-navigation-governance/05-kompetenzmodell-fuer-staff-principal-und-chief.md), die [Lerntiefe](../00-navigation-governance/06-praktische-und-architektonische-lerntiefe.md) und die [Labstrategie](../00-navigation-governance/09-laborstrategie-und-beweisartefakte.md) sind harte Voraussetzungen.

| Beziehung | Kapitel | Anschluss |
|---|---|---|
| related | [KB-0011: GenAI Solution Architect](01-genai-solution-architect-als-zielrolle.md) | GenAI-Lösungstiefe für Modell-, Retrieval-, Tool- und Evaluationgrenzen. |
| related | [KB-0012: GenAI Engineer](02-genai-engineer-als-zielrolle.md) | Implementiert Orchestrierung, Verträge und Evals gegen die Lösungsvorgaben. |
| related | [KB-0013: AI Platform Architect](03-ai-platform-architect-als-zielrolle.md) | Gemeinsame AI-Runtime, Gateway, Tenancy und Operations. |
| related | [KB-0014: Platform Architect](04-platform-architect-als-zielrolle.md) | Gemeinsame Developer-/Runtimefähigkeiten und Standards. |
| related | [KB-0015: Enterprise Architect](05-enterprise-architect-als-zielrolle.md) | Capability-, Portfolio-, Informations- und Governancekontext. |
| related | [KB-0016: Cloud Architect](06-cloud-architect-als-zielrolle.md) | Workloadplatzierung, Landing Zone, Networking, Resilienz und FinOps. |
| related | [KB-0018: System Architect](07-system-architect-als-zielrolle.md) | Tiefe Komponenten-/Systemnachweise über OS, Netzwerk, Hardware und Software. |
| applies | [KB-0400: Admission Control](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0400) | Durchsetzung von Delivery- und Runtimeguardrails. |
| applies | [KB-0572: Grafana](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0572) | Betriebsdashboards und SLO-Evidenz. |
| applies | [KB-0618: Datenschutzarchitektur](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0618) | Datenschutz, Datenklassifikation und Retention. |
| applies | [KB-0720: Portfolioevidenz](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0720) | Lernartefakte, Selbsteinschätzung und Berufserfahrung auseinanderhalten. |

## Core Concepts und Mechanismen

### Von Anforderung zu Lösungshypothese

Eine Featureforderung wie „Kunden sollen ihren Auftragsstatus per AI fragen können“ ist keine Lösungsspezifikation. Der Solution Architect wandelt sie in eine belastbare Hypothese:

| Dimension | Beispiel für Commerce Status |
|---|---|
| Business Outcome | Berechtigte Kunden erhalten verständlichen, aktuellen Status; Supportaufwand sinkt ohne unzulässige Offenlegung. |
| Nutzer und Scope | Authentifizierte B2B-Kunden; Status erklären, keine Zahlung, Preisänderung, Vertragszusage oder Bestandsbuchung. |
| Fachinvariante | Nur das fachliche Statussystem ist System of Record; Kunde sieht ausschließlich seine zulässigen Aufträge. |
| Daten | Auftrag, Lieferstatus, Produktkontext, Berechtigung; vertraulich oder personenbezogen abhängig vom Fall. |
| Lösung | Produkt-UI → Status API → fachliche Autorisierung → Statusdaten; AI erhält nur erlaubten, quellengebundenen Kontext. |
| NFR | definierte Frische, p95-Latenz, Fehlerbudget, Audit, Datenminimierung, Kostenbudget und Wiederherstellungsgrenze. |
| Nicht-Ziel | Kein autonomer Toolzugriff, keine globale Suche, keine direkte ERP-Datenbankfreigabe. |
| Abnahme | Berechtigter Status, fehlende Quelle, fremder Auftrag, Vendor Timeout, doppeltes Event, Budgetlimit und Trace werden geprüft. |

Die Hypothese bleibt revidierbar. Wenn Statusdaten nicht ausreichend frisch oder fachlich konsistent abrufbar sind, ist „bessere AI“ kein Ersatz für eine fehlende Daten-/Integrationsentscheidung.

### Functional, Quality, Constraint und Acceptance Criteria

| Typ | Frage | Beispiel |
|---|---|---|
| Functional Requirement | Was soll geschehen? | Status für einen berechtigten Auftrag liefern. |
| Quality Attribute/NFR | Unter welcher messbaren Eigenschaft? | p95 unter 2 Sekunden für dokumentierte Testlast; Antwort nennt Quelle/Frische. |
| Constraint | Welche Grenze ist nicht verhandelbar? | ERP bleibt System of Record; keine Kundeninformationen in unfreigegebene Route. |
| Assumption | Was wird vorläufig angenommen? | Lieferant liefert Status API mit dokumentierter Rate und Fehlersemantik. |
| Acceptance Criterion | Wie wird Abnahme nachgewiesen? | Testfall mit fremder order_id führt zu deny und auditierter Korrelations-ID. |
| Operational Criterion | Wie bleibt es betreibbar? | Alert bei Frische-/Fehlerbudgetverletzung und Runbook mit Owner. |

NFRs benötigen Einheiten, Workload und Grenzen. „99,9 Prozent verfügbar“ ohne Zeithorizont, Dependencykette, geplante Wartung, Messpunkt und Fachwirkung ist unvollständig. „AI-Antwort muss korrekt sein“ muss in überprüfbare Kriterien wie Quellenabdeckung, Toolpolicy, Evalfall, Human Gate und erlaubte Degradation zerlegt werden.

### Schnittstellenverträge

Ein Vertrag beantwortet mindestens:

1. **Semantik:** Was bedeutet Auftrag, Status, Reservierung, Erfolg, Fehler und Zeitpunkt?
2. **Ownership:** Wer besitzt Fachregel, Schema, Version, Datenklasse und Support?
3. **Transport:** synchron HTTP/gRPC oder asynchron Event/Queue; TLS, Auth, Timeout, Retry und Backpressure.
4. **Schema:** Request/Response oder Eventpayload, Pflicht-/optionale Felder, Null-/Unknown-Semantik, Validierung, Kompatibilität.
5. **Fehler:** Status/Problemtyp, retriable/non-retriable, fachlicher versus technischer Fehler, Korrelation und sichere Details.
6. **Zustand:** Idempotency Key, Reihenfolge, Duplikat, Version, Outbox/Inbox, Konsistenz- und Kompensationsgrenze.
7. **Operations:** Rate Limit, SLO, Observability, Change, Incidentkontakt, Retention, Kosten und Exit.
8. **Security:** Nutzer-/Workloadidentity, Scope, Autorisierung, sensitive Felder, Audit, Secrets und data residency.

OpenAPI definiert eine sprachunabhängige Beschreibung für HTTP-APIs und kann Clients, Serverstubs, Dokumentation und Tests unterstützen. Eine korrekte Spezifikation ersetzt trotzdem keine Produkt- oder Sicherheitsentscheidung. [OpenAPI Specification v3.1.1](https://spec.openapis.org/oas/v3.1.1.html) beschreibt u.a. Paths, Components, Schemas und Security Schemes. AsyncAPI liefert analoge, maschinenlesbare Beschreibungen für asynchrone APIs; die aktuelle Referenz führt Version 3.1.0. Siehe [AsyncAPI Specification](https://www.asyncapi.com/docs/reference/specification/latest).

### Lieferantenschnittstelle und Shared Responsibility

Der Name eines SaaS-, ERP-, Modell- oder Plattformanbieters beantwortet keine Lösungsfrage. Ein Lieferantenvertrag wird als Architekturkomponente behandelt:

| Vertragspunkt | Prüffrage |
|---|---|
| Capability | Welche fachliche/technische Fähigkeit ist zugesichert, welche nicht? |
| API/Event | Version, Semantik, Limit, Auth, Idempotenz, Fehler, Change- und Deprecationpolicy? |
| Data | Besitzer, Region, Subprozessor, Verschlüsselung, Training/Nutzung, Export, Löschung, Backup? |
| Reliability | SLO, Wartung, Dependency, Support, RTO/RPO, Incidentinformation und Testmöglichkeit? |
| Security | Identity, Rollen, Audit, Pen-Test-/Attestationgrenze, Schwachstellenprozess, Break-glass? |
| Economics | Preisdimension, Mindestlaufzeit, Egress, Rate, Overages, Commitment, Supporttier? |
| Exit | Exportformat, Datenvollständigkeit, Adapter, Parallelbetrieb, Kündigung, Transition Owner? |

Ein Solution Architect kann diese Fakten nicht allein akzeptieren. Procurement, Legal, Privacy, Security, Finance, Fachowner und Operations liefern jeweils Evidence; die Rolle verbindet sie zur Entscheidung und benennt offene Risiken.

## Architecture / Data Flow: Commerce Status mit AI-Erklärpfad

```text
Kunde → Commerce UI → Edge/Auth → Status Solution API
                                      │
                                      ├─ Authorization + order ownership
                                      ├─ Status Adapter → ERP/WMS/Events
                                      └─ AI Context Builder → approved model route
                                                               │
                                                   response with source/freshness
                                      │
                                      ▼
                         Trace / audit / SLO / cost / incident workflow
```

1. Die UI authentisiert den Nutzer und übergibt keinen frei wählbaren Kunden-/Auftragskontext als Vertrauensbeweis.
2. Die Status API prüft fachliche Identität, Scope und Auftragsbeziehung. Sie ruft den Autoritätspfad auf, der die fachliche Bedeutung von Status und Frische liefert.
3. Der Adapter übersetzt konkrete ERP-/WMS-Verträge, aber versteckt nicht unklare Semantik. Events und APIs erhalten Version, Owner, Idempotenz- und Fehlerregeln.
4. Der AI Context Builder erhält die minimale, berechtigte Statusdarstellung und Quellenmetadaten. Er darf keine Zahlungsmethoden, Verträge oder Adminwerkzeuge ausführen.
5. Der Modelloutput wird als Erklärung behandelt. Die Anwendung zeigt Quelle/Frische, begrenzt Ausgabe und leitet Unsicherheit sicher an Support weiter.
6. Telemetrie korreliert Userrequest, API, Adapter, Datenquelle, Modellroute und Error Class. Audits und Logs werden getrennt nach Zugriff und Datenminimierung geführt.

Trust Boundaries sind entscheidend: Kundengerät, Edge, Anwendung, fachliches System, AI-/Providerroute, Observability und Supportzugriff haben jeweils eigene Identitäts- und Datenregeln. „Im selben VPC“ oder „hinter demselben Gateway“ ist keine ausreichende Securitybeschreibung.

## Protocols, Standards und Tools

| Bereich | Standard/Tool | Einsatz und Grenze |
|---|---|---|
| HTTP API | HTTP/TLS, OpenAPI, OAuth/OIDC, mTLS bei Bedarf | Dokumentiert Oberfläche und Securityschemes; Fachdienst erzwingt Berechtigung. |
| Fehler | RFC 9457 Problem Details | Einheitliches maschinenlesbares Fehlerformat; keine Interna oder Secrets in Details. |
| Event API | AsyncAPI, Brokerprotokoll, Schema Registry, CloudEvents nach Bedarf | Contract und Ownership sichtbar; garantiert nicht genau-einmal oder globale Reihenfolge. |
| Datenvalidierung | JSON Schema/Protobuf/Avro je Vertrag | Schemaform ohne Fachsemantik genügt nicht. |
| Delivery | Git, CI, contract testing, consumer-driven tests, IaC/policy | Testen von Kompatibilität und Guardrails, kein Ersatz für Produktionsbeobachtung. |
| AI | Modellgateway, Eval Suite, Retrievalpolicy, Toolgateway | Modelloutput bleibt untrusted; Verträge und Autorisierung liegen außerhalb des Modells. |
| Observability | OpenTelemetry, correlation ID, traces/logs/metrics, SLO dashboard | Gemeinsame Korrelation, aber Privacy-/Retentiongrenzen müssen explizit sein. |

[RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html) definiert Problem Details für HTTP APIs und löst RFC 7807 ab. Es erlaubt standardisierte Fehlerdetails über `application/problem+json`, entbindet aber nicht von sicherer Fehlerklassifikation: interne Stacktraces, Tokens, fremde Ressourcen und sensible fachliche Details gehören nicht in die Antwort.

## Konfiguration / Implementierung: Minimaler, prüfbarer API-Vertrag

Der folgende Ausschnitt ist ein Lernartefakt, kein produktiv vollständiger Vertrag. Er zeigt, dass Erfolg, fachliche Autorisierung und Fehler einen definierten Platz im Vertrag erhalten.

```yaml
openapi: 3.1.1
info:
  title: Commerce Status API
  version: 0.1.0
paths:
  /v1/orders/{orderId}/status:
    get:
      operationId: getOrderStatus
      security:
        - customerOAuth: [orders.read]
      responses:
        "200":
          description: Authorized status
        "403":
          description: Caller may not read this order
          content:
            application/problem+json:
              schema:
                $ref: "#/components/schemas/Problem"
        "404":
          description: No visible order with this identifier
components:
  schemas:
    Problem:
      type: object
      required: [type, title, status]
      properties:
        type: {type: string, format: uri-reference}
        title: {type: string}
        status: {type: integer}
        detail: {type: string}
        instance: {type: string, format: uri-reference}
```

Das Beispiel darf keine Rückschlüsse über reale Authflows, Berechtigungsnamen, Datenfelder oder HTTP-Statussemantik eines konkreten Produkts auslösen. Insbesondere kann eine Organisation aus Privacygründen entscheiden, für nicht sichtbare Ressourcen 404 statt 403 zu geben. Diese Wahl gehört in den fachlich-security-relevanten Vertrag und muss konsistent getestet werden.

Für asynchrone Statusupdates ergänzt der Vertrag Eventname, Owner, Schema, Partition/Key, Reihenfolge-/Duplikatannahme, Retention, Consumergruppen, Schemaevolution, DLQ/Retry und Reprocessinggrenze. Ein Event mit dem Namen `order.status.changed` ist ohne diese Semantik keine sichere Integrationsschnittstelle.

## Scalability und Performance

Eine Lösungsarchitektur skaliert entlang der realen End-to-End-Last, nicht entlang einzelner Servicebenchmarks.

| Dimension | Messung | Ableitung |
|---|---|---|
| Nutzerlast | Requests/s, aktive Sessions, Bursts, Region | Edge, Rate Limit, Cache, Connection Pool und Sizing. |
| Integration | API rate, Eventdurchsatz, Consumerlag, Batch | Adapter, Queue, Backpressure, Providerlimit, Fehlerbudget. |
| Daten | Statusfrische, Querylatency, IOPS, Replikation | Cache/Read Model, System-of-Record-Contract, RPO/RTO. |
| AI | Kontext-/Outputtokens, TTFT, Tool-/Retrieverlatenz, Eval | Modellroute, Budget, Outputlimit, Degradation/Human Gate. |
| Availability | p95/p99, error rate, Dependency SLO, Recoverytime | Timeouts, Circuit Breaker, Retry, Fallback und Incidentgrenze. |
| Kosten | Kosten pro Status/akzeptierter Erklärung, Egress, Support | Caching, Modellpolicy, Provider/SKU, Scope und FinOps. |
| Delivery | Contract-test pass, change failure, migration progress | Versioning, compatibility window, canary and rollback. |

Eine vereinfachte Latenzgleichung erinnert an den vollständigen Pfad:

\[
T_{end-to-end}=T_{edge}+T_{auth}+T_{api}+T_{adapter}+T_{data}+T_{ai}+T_{response}
\]

Verbessert man nur den Modellaufruf, bleibt eine langsame Auth-, Daten- oder Lieferantenschnittstelle sichtbar. Backpressure schützt nicht nur Infrastruktur: Wenn die Statusquelle unter Last keine frische, autorisierte Information liefert, muss die Nutzererfahrung einen ehrlichen Pending-/Supportpfad wählen, statt eine plausible Antwort zu erfinden.

## Reliability / Failure Modes

| Fehlerbild | Signal | Schutz | Recoverygrenze |
|---|---|---|---|
| ERP/WMS-Timeout | Adaptertimeout, queue/lag, stale status | Timeout, Circuit Breaker, Cache mit Frischekennzeichen, Backoff | Status als veraltet/pending zeigen; keine erfundene Aktualität. |
| Doppelte/ungeordnete Events | Idempotency conflict, version gap, duplicate metric | Inbox/outbox, idempotency key, sequence/version, DLQ | Reprocess nur mit fachlicher Grenze und Audit. |
| Vertragsbruch des Lieferanten | Contract-test failure, schema error, 4xx/5xx shift | Versioning, compatibility window, canary, adapter | Route zurückstellen oder Adapterversion fixieren; Support/Eskalation. |
| Berechtigungslücke | access anomaly, cross-customer test failure | Resource-level authorization, scoped tokens, audit | Zugriff stoppen, Scope/Logs analysieren, Incidentprozess. |
| AI halluziniert oder führt falschen Kontext | eval regression, missing source, unsafe tool intent | source-bound context, toolallowlist, eval, Human Gate | sichere Antwort/Support statt Ausführung; Route/Prompt/Policy ändern. |
| Retry verstärkt Fehler | rising requests, duplicate actions, cost spike | retry budget, idempotency, backoff, classify errors | Retry stoppen, final state abfragen, manueller Pfad. |
| Trace fehlt oder leakt Daten | broken correlation, DLP alert, high cost | mandatory low-risk attributes, redaction, access, retention | diagnose with safe signals; export stoppen und Incident behandeln. |
| Migration lässt alte Integration leben | duplicate writes, support ambiguity, licence cost | sunset plan, consumer inventory, kill switch, metrics | Migration pausieren oder abschließen; Altsystem nicht still ignorieren. |

## Security, Governance und Compliance

| Schutzobjekt | Lösungskontrolle | Owner-/Nachweisfrage |
|---|---|---|
| Nutzer-/Workloadidentity | OIDC, scopes, token audience, least privilege, service authorization | Wer prüft fachliche Auftragsbeziehung und wie wird sie getestet? |
| Daten | Klassifikation, minimierter Context, encryption, retention, data owner | Welche Felder erreichen UI, AI, Logs, Lieferant und Support? |
| API/Event | TLS, schema validation, rate limit, idempotency, version, audit | Was führt ein fremder/alter/duplizierter Payload aus? |
| Lieferant | Due diligence, contract, support, incident, DPA/region, exit | Welcher Vertrag und welche Evidenz begrenzen das Risiko? |
| Delivery | provenance, code review, contract tests, policy, secrets | Kann eine ungeprüfte Änderung Schnittstelle oder Berechtigung verändern? |
| AI | model/data/tool policy, eval, human gate, observability | Welche nicht messbare Trustworthinesslücke bleibt akzeptiert? |
| Betrieb | on-call, runbook, break-glass, forensic logs | Wer trifft bei Daten-/Sicherheitsincident die Entscheidung? |

NIST AI RMF ist ein freiwilliger Rahmen, der Trustworthiness in Design, Entwicklung, Nutzung und Evaluation von AI-Produkten, -Services und -Systemen einbeziehen soll. Für eine Solution Architecture bedeutet das: Kontext, Stakeholder, Messung und Risikobehandlung werden explizit, ohne dass ein Frameworketikett rechtliche oder fachliche Compliance beweist. Siehe [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework).

## Observability und Troubleshooting

| Ebene | Signale | Diagnosefrage |
|---|---|---|
| Business | berechtigte Statusabfragen, Supporthandoff, Abbruch, Feedback | Erreicht die Lösung den definierten Outcome? |
| API | availability, latency, auth deny, RFC-9457-type, rate limit | Ist es Netz, Auth, Schema oder Fachregel? |
| Event | publish/consume, lag, duplicate, DLQ, schema compatibility | Ist der Zustand verspätet, verloren, doppelt oder unverständlich? |
| Data | freshness, querylatency, permission, replication, cache age | Ist die Statusinformation autoritativ und ausreichend aktuell? |
| AI | source coverage, eval, tokens, model error, unsafe intent | Ist die Erklärung begründet und innerhalb der Tool-/Datenpolicy? |
| Vendor | quota, SLA signal, API change, support case, contract window | Liegt Ursache außerhalb eigener Kontrolle und gibt es einen Exit/Fallback? |
| Delivery | contract-test, rollout, rollback, config drift | Wurde eine Architekturannahme mit einem Change verletzt? |
| Cost | cost/status, retry, model route, egress, support | Welcher Pfad erzeugt Kosten ohne akzeptierten Nutzerwert? |

Troubleshooting bei „Kunde erhält falschen Status“:

1. Frage zuerst nach Identität, Order Scope und Response-/Event-Korrelation. Ein falscher Status kann Berechtigung, Mapping, Frische, Duplikat oder UI-Caching sein.
2. Prüfe den autoritativen Fachdienst und seine Version/Frische vor dem AI-Pfad. Das Modell ist nicht die erste Ursache.
3. Vergleiche Request-/Eventvertrag gegen Schema, Owner, Version und Deployment. Erkenne unbekannte Felder, verlorene Varianten oder semantische Änderungen.
4. Prüfe Idempotenz/Order und Consumerlag bei asynchronem Pfad. „Event empfangen“ bedeutet nicht, dass der richtige Zustand materialisiert wurde.
5. Wenn AI beteiligt ist, evaluiere Quellen-, Kontext- und Toolpolicy anhand sicherer Testdaten. Modellantwort ohne Quellenbeleg wird nicht als Autorität benutzt.
6. Entscheide über eine sichere Degradation: autoritativen Rohstatus zeigen, als pending markieren oder Support einschalten. Korrigiere keine Daten durch Modelltext.

## Cost / FinOps

\[
C_{solution}=C_{product}+C_{integration}+C_{data}+C_{platform}+C_{vendor}+C_{operations}+C_{risk}+C_{exit}
\]

\[
C_{accepted\ interaction}=\frac{C_{solution}}{\max(1,N_{authorized\ useful\ interactions})}
\]

| Kostentreiber | Mess-/Ownerfrage | Steuerhebel | Anti-Pattern |
|---|---|---|---|
| API/Events | Calls, bytes, retry, lag, consumer, egress | Cache, batching, backpressure, data placement | Kosten je APIcall ohne Support-/Fehlerkosten. |
| Daten | Storage, I/O, index, replication, retention | Lifecycle, ownership, read model, deduplication | Jede Integration kopiert Daten ohne Exit. |
| AI | tokens, route, retrieval, eval, human review | limits, model policy, cache, use-case scope | Modellkosten ohne Qualitäts-/Tool-/Supportkosten. |
| Lieferant | licence, minimum, support, overage, change/exit | negotiation, adapter, scope, contract review | Make/Buy nur auf Monatsrate vergleichen. |
| Betrieb | SRE, on-call, runbook, training, incident | automation, observability, clear responsibility | Managed Service als „kein Betriebsaufwand“. |
| Migration | dual run, mapping, consumer, decommission | transition state, sunset, test, data cleanup | Neue Lösung als Wert zählen, Altsystem behalten. |

Kostenentscheidungen gehören zur fachlichen Priorisierung. Eine schnellere Statusantwort kann Supportkosten senken; ein teurer AI-Pfad ohne messbar besseren Outcome sollte begrenzt oder beendet werden.

## Trade-offs und Anti-Patterns

| Entscheidung | Optionen | Trade-off |
|---|---|---|
| Sync API | Event/async workflow, hybrid | Sync ist direkt, koppelt Verfügbarkeit; async entkoppelt Last, braucht Status/Idempotenz/Beobachtung. |
| Direct vendor call | Adapter/gateway | Direkt ist schnell, Adapter schützt Verträge/Exit, kostet Pflege und Latenz. |
| Cache | Always-read system of record | Cache reduziert Latenz/Kosten, braucht Frische-/Invalidierungssemantik. |
| Buy | build | Buy beschleunigt Capability, bindet API/Daten/Vertrag; build benötigt Kompetenz, Betrieb und Zeit. |
| AI explanation | deterministic template | AI kann Varianten verstehen, benötigt Eval/Data/Toolgrenzen; Template kann für stabile Fälle sicherer/billiger sein. |
| Uniform integration standard | domain-specific contract | Standard erleichtert Interop, kann Fachsemantik verlieren; Modelle nach Risiko und Konsumentenreife wählen. |
| Single vendor | multi-vendor/exit adapter | Fokus verringert Komplexität, Konzentration erhöht Lieferantenrisiko. Mehrere Anbieter ohne Betriebsmodell erhöhen Fehlerfläche. |

Anti-Patterns: Diagramm ohne Anforderungen, API ohne Ownership/Fehler/Version, „eventual consistency“ ohne Fachgrenze, Modell als Autorisierung, Adapter als Black Box, Lieferantenvertrag nur als Einkaufsthema, NFRs als Adjektive, Abnahme nur mit Happy Path, Observability nur für Infrastruktur, Migration ohne Abschaltung und Supporthandoff ohne klare Verantwortlichkeit.

## Staff-, Principal- und Chief-Entscheidungen

| Ebene | Entscheidung | Evidenz und Trigger |
|---|---|---|
| Staff | Standard für Solution Blueprint, NFR und Abnahme definieren | Teams liefern Context, Contract, Failure Modes, SLO, Runbook und negative Testfälle. Wiederkehrende Lücken verbessern Templates. |
| Staff | API/Event-Contract-Governance produktisieren | Versioning, ownership, compatibility, error taxonomy, test and deprecation path. Contract failures oder Consumerbypass lösen Review aus. |
| Principal | Integrierte Lösungsgrenze wählen | Fachinvarianten, Datenowner, Vendor, Platform/Cloud, Betrieb und Exit werden als ganze Kette begründet. Data-/securityincident triggert Neubewertung. |
| Principal | Make/Buy/Partner als Architekturentscheidung führen | Differenzierung, Time-to-value, data, SLO, economics, contract, exit und team competence. Lieferantenänderung triggert Review. |
| Chief | Qualitäts- und Abnahmerahmen für Lösungsklassen setzen | Risikoklasse entscheidet über Evidence, unabhängiges Review, Human Gate, Contract/Recoverytest und Betrieb. |
| Chief | Systemische Lieferantenabhängigkeit steuern | Konzentration, Vertrags-/Daten-/Exitrisiko, Commitment und kritische Capability werden im Portfolio überwacht. |
| Chief | AI-Automationsgrenze entscheiden | Fehlerkosten, Trust Boundary, Nutzwert, Eval, Human Control, Compliance und Incidentfähigkeit definieren akzeptierte Automatisierung. |

## Production Checklist

| Bereich | Prüfnachweis | Owner | Stop-/Rollbackbedingung |
|---|---|---|---|
| Outcome/Scope | Nutzer, Outcome, Nicht-Ziel, Fachowner, Erfolg/Stop | Product/Domain Owner | kein fachliches Mandat oder kein messbares Ergebnis. |
| Context | Komponenten, Daten, Trust Boundaries, Dependencies, Lieferanten | Solution Architect + Owners | zentrale Schnittstelle/Owner unbekannt. |
| Contracts | API/Event schema, auth, version, errors, idempotency, SLO, support | Contract Owner | unklare Fachsemantik oder kein Consumer-/Changeweg. |
| Security/Data | access, class, retention, logs, vendor, AI tool/data policy | Security/Data/Privacy | unzulässiger Datentransfer oder fehlende Autorisierung. |
| Quality/NFR | load, latency, availability, freshness, RTO/RPO, quality/eval | Product/SRE/AI Owner | NFR ohne Messpunkt/Last/Failuregrenze. |
| Delivery | CI, contract tests, versioning, rollout, rollback | Engineering/Platform | unkontrollierter Vertrags- oder Berechtigungschange. |
| Operations | telemetry, dashboard, alerts, runbook, incident/support | SRE/Operations | kritischer Pfad ohne Detektion/Eskalation. |
| Vendor | SLA/support/change/data/exit, owner, fallback | Procurement/Legal/Architecture | kritische Lieferabhängigkeit ohne Contract-/Exitentscheidung. |
| Cost | scope, budget, owner, forecast, retry/egress/model cost | Finance/Product | keine Kostenallokation oder Degradationsregel. |
| Acceptance | positive plus negative cases, evidence, residual risks | Decision Owner | Happy path als alleinige Abnahme. |

## Interviewfragen mit Antwortleitfäden

1. **Was unterscheidet Solution Architecture von Enterprise Architecture?** EA verbindet Portfolio und Capabilities; Solution Architecture macht einen konkreten Lösungsraum end-to-end abnehmbar. Beide benötigen gemeinsame Annahmen, haben aber andere Entscheidungsreichweite.
2. **Was gehört in einen API-Vertrag neben JSON-Feldern?** Semantik, Owner, Auth, Datenklasse, Version, Fehler, Idempotenz, Limits, SLO, Observability, Change, Support, Retention und Exit.
3. **Wann verwenden Sie Sync versus Event?** Für unmittelbare, klare Interaktion kann Sync passen; Events entkoppeln Zeit und Last, fordern aber fachliche Regeln zu Duplikaten, Reihenfolge, Status und Reprocessing.
4. **Wie beurteilen Sie einen Lieferanten?** Capability, API, Daten, Security, Reliability, Support, Ökonomie, Change und Exit gemeinsam mit Fach-, Legal-, Security- und Financeowner bewerten.
5. **Was ist ein gutes NFR?** Messbar mit Workload, Einheit, Messpunkt, Failure Mode, Owner und akzeptierter Grenze. „sicher“, „schnell“ und „hochverfügbar“ genügen nicht.
6. **Wie integrieren Sie AI ohne Fachautorität zu verlieren?** Modell als untrusted Erklärung/Entwurf, Berechtigung und Command in deterministischem Fachdienst, source-bound context, eval, Human Gate und sichere Degradation.
7. **Wie behandeln Sie einen Event-Schemawechsel?** Version/compatibility, Consumerinventory, contract tests, Deprecationfenster, Monitoring, Migration und Sunset. Nicht blind Consumer brechen.
8. **Warum ist eine 200-Antwort keine Abnahme?** Sie kann falsche, veraltete, unberechtigte oder unsichere Inhalte liefern. Abnahme testet Outcome, Policy, Fehler, Recovery und Betrieb.
9. **Wie entscheiden Sie bei Vendor Timeout?** Timeout/Circuit/Retrybudget, cache freshness, fallback, user communication, support and incident. Keine plausible Modellantwort als Ersatz für Fachwahrheit.

## Praktisches Lab / Fallarbeit: Abnehmbarer Commerce-Status mit AI-Erklärung

**Status:** **reviewed_only**, Stand 2026-09-15. Das Lab verwendet nur fiktive Namen und Daten. Es wurden keine ERP-/WMS-, Provider-, Cloud-, Kunden- oder Lieferantensysteme angeschlossen, getestet oder verändert.

### Ausgangslage

Ein fiktives B2B-Commerce-Unternehmen will berechtigten Kunden den Auftragsstatus erklären. Das heutige Portal fragt mehrere Fachsysteme direkt ab. Die Zielidee ist eine Status API mit fachlicher Autorisierung und optionaler AI-Erklärung, die nur bewiesenen Kontext nutzt. Keine Preis-/Vertrags-/Zahlungsaktion ist im Scope. Budgetannahme für einen späteren Pilot: 400 Euro monatlich. Akzeptierte Fehlerkosten: eine verspätete Erklärung ist tolerierbar; eine falsche Offenlegung oder Doppelaktion ist nicht tolerierbar.

### Aufbau

1. Erstelle eine Stakeholder- und Scope-Tabelle mit Business, Customer Support, Commerce, Operations, Data/Privacy, Security, Platform/Cloud, Finance und potenziellem Modell-/ERP-Lieferanten.
2. Formuliere Functional Requirements, NFRs, Constraints, Assumptions, Out-of-Scope und Abnahmekriterien. Gib jeder Messgröße Einheit, Messpunkt, Owner und Failure Mode.
3. Zeichne Context-, Container- und Data Flow mit Nutzer, Auth, Status API, ERP/WMS-Adapter, Eventpfad, AI Context Builder, Modellroute, Telemetrie und Support.
4. Schreibe einen OpenAPI-Ausschnitt für Status und Problem Details sowie einen AsyncAPI-Ausschnitt für Statusupdates. Ergänze Ownership, Version, Idempotenz, Fehler, SLO, Data Class und Changeprozess.
5. Erstelle eine Lieferantenprüfung für ERP/WMS und Modellroute: API, Daten, Support, Security, Rate, Kosten, Change, Incident und Exit.
6. Definiere Contract-, Integration-, Security-, Load-, Eval- und Recoverytests plus Runbook für Vendor Timeout, stale data, denied order, doppeltes Event und AI ohne Quelle.
7. Rechne fiktive Kosten für API/Event, Storage, Modelltokens, Telemetrie, Support und Parallelbetrieb. Lege Budgetalarm/Degradationsregel fest.

### Negative Gegenproben

| Probe | Erwartetes Ergebnis | Widerlegt |
|---|---|---|
| Nutzer fordert fremde orderId | Fachdienst verweigert oder verdeckt nach Policy, Audit enthält Korrelations-ID ohne fremde Daten | Dass UI-Filter allein Autorisierung erzwingt. |
| ERP antwortet mit Timeout | Circuit/Retrybudget greift; UI zeigt pending/frischebegrenzten Status oder Supportweg | Dass Modelltext eine autoritative Fachantwort ist. |
| Event wird doppelt zugestellt | Consumer erkennt Idempotenz/Version, erzeugt keine doppelte fachliche Wirkung | Dass Brokername genau-einmal garantiert. |
| Lieferant entfernt/ändert Schemafeld | Contract test oder Canarystatus scheitert vor breiter Auswirkung | Dass ein OpenAPI-/AsyncAPI-Dokument allein Kompatibilität erzwingt. |
| AI erhält Kontext ohne Quelle | Eval/Gateway lehnt ab oder UI zeigt sichere Nichtantwort | Dass Modellwahrscheinlichkeit ein Groundingnachweis ist. |
| Trace enthält Kundennamen/Prompt | Redaction-/Schema-Check schlägt fehl, Export wird begrenzt | Dass Observabilitydaten nicht schützenswert sind. |

### Auswertung und Cleanup

Die Fallarbeit ist bestanden, wenn ein unabhängiger Leser die fachliche Autorität, Daten-/Trustgrenzen, Contractsemantik, Failure-/Recoverywege, Lieferantenabhängigkeit, Kosten und Abnahmekriterien ohne zusätzliche mündliche Erklärung nachvollziehen kann. Lokale Beispieldaten werden danach gelöscht. Reale Ausführung braucht fachliches Mandat, Testdatenfreigabe, Security/Privacy-, Legal/Procurement- und Operationsreview sowie eine isolierte Testumgebung.

## Dependencies, Cross-References und Quellen

Rollen- und Evidenzgrundlagen liegen in [KB-0002](../00-navigation-governance/02-rollen-kompetenz-matrix.md), [KB-0004](../00-navigation-governance/04-cv-istbild-und-zielkompetenzen.md), [KB-0005](../00-navigation-governance/05-kompetenzmodell-fuer-staff-principal-und-chief.md), [KB-0006](../00-navigation-governance/06-praktische-und-architektonische-lerntiefe.md) und [KB-0009](../00-navigation-governance/09-laborstrategie-und-beweisartefakte.md). Rollenanschlüsse stehen in [KB-0011](01-genai-solution-architect-als-zielrolle.md) bis [KB-0016](06-cloud-architect-als-zielrolle.md); die Systemperspektive folgt in [KB-0018](07-system-architect-als-zielrolle.md).

| Quelle | Verwendete Aussage | Stand |
|---|---|---|
| Dateikatalog der Knowledge Base, KB-0017 | Verbindlicher Scope, Zielrollenfokus und Pfad. | Planstand 2026-09-14 |
| [OpenAPI Specification v3.1.1](https://spec.openapis.org/oas/v3.1.1.html) | Sprachunabhängige, maschinenlesbare HTTP-API-Beschreibung für Discovery, Dokumentation, Code und Tests. | Abgerufen 2026-09-15 |
| [AsyncAPI Specification](https://www.asyncapi.com/docs/reference/specification/latest) | Aktuelle Spezifikation für maschinenlesbare asynchrone API-Verträge. | Abgerufen 2026-09-15 |
| [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html) | Standards-Track-Format Problem Details für HTTP APIs; ersetzt RFC 7807. | Abgerufen 2026-09-15 |
| [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework) | Freiwilliger Rahmen zur Einbeziehung von Trustworthiness in AI-Lebenszyklusentscheidungen. | Abgerufen 2026-09-15 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — API-Beschreibungen werden als ausführbare Vertragsartefakte genutzt.** OpenAPI beschreibt eine HTTP-API unabhängig von Programmiersprache und kann Dokumentation, Client/Servercode und Tests speisen. Die aktuelle Spezifikationsseite führt mehrere veröffentlichte Versionen; ein Team muss daher die unterstützte Version explizit wählen und in Toolchain/Consumer testen. **Reifegrad: Established.** Der Nutzen sind gemeinsame Discovery und Contracttests. Risiken sind generierter Code ohne Fachsemantik, unkontrollierte `$ref`-Abhängigkeiten und falsche Sicherheitsschemata. Ein Pilot besteht, wenn Producer und ein realer Consumer gegen denselben versionierten Vertrag positive und negative Fälle ausführen und ein Schema-/Securitybruch vor Produktion sichtbar wird. Quelle: [OpenAPI Specification](https://spec.openapis.org/oas/v3.1.1.html).

**Stand 2026-09-15 — AsyncAPI 3.1.0 erweitert den versionsbewussten Ereignisvertrag.** Die offizielle AsyncAPI-Referenz führt 3.1.0 als aktuelle Version. **Reifegrad: Adopting.** Der Nutzen ist, asynchrone Schnittstellen mit Channels, Messages, Operations, Schemas und Ownership besser sichtbar zu machen. Die Gefahr liegt in der falschen Annahme, eine Spezifikation löse Delivery Semantics, globale Reihenfolge oder Consumer Migration. Ein Pilot dokumentiert zusätzlich Key/Partition, Duplikate, Reihenfolge, Retention, DLQ, Reprocessing, Schemaevolution und Consumerabnahme. Quelle: [AsyncAPI Specification](https://www.asyncapi.com/docs/reference/specification/latest).

**Stand 2026-09-15 — Trustworthy-AI-Risiko wird Teil der Solution Acceptance.** NIST beschreibt AI RMF als freiwilligen Rahmen, um Trustworthiness in Design, Entwicklung, Nutzung und Evaluation einzubeziehen; im April 2026 veröffentlichte NIST zudem eine Concept Note für ein Critical-Infrastructure-Profil. **Reifegrad: Adopting für konkrete agentische/produktive Abnahmemuster.** Der Nutzen ist, AI nicht getrennt von System-, Lieferanten- und Betriebsrisiko zu behandeln. Das Risiko ist Papiergovernance ohne technische Evidenz. Ein Pilot akzeptiert AI nur mit Use-Case-Scope, Data/Tool Boundary, Eval, Human Gate, Observability, Incidentpfad und klar dokumentierter Restunsicherheit. Quelle: [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework).

