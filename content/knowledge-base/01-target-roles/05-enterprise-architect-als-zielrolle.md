---
{"id": "KB-0015", "title": "Enterprise Architect als Zielrolle", "domain": "01", "sequence": 5, "document_type": "role", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0002", "concepts": ["Rollen-Kompetenz-Matrix", "Tiefenstufen", "Nachweisarten"], "needed_for": "understanding"}, {"id": "KB-0004", "concepts": ["Evidenzgrenzen", "zulässige Aussagen", "Zielkompetenzen"], "needed_for": "understanding"}, {"id": "KB-0005", "concepts": ["Kompetenzcanvas", "Entscheidungsreichweite", "Wirkungskette"], "needed_for": "understanding"}, {"id": "KB-0006", "concepts": ["Hands-on-Tiefe", "Architekturnachweis", "Spezialistenübergabe"], "needed_for": "understanding"}, {"id": "KB-0009", "concepts": ["Labstrategie", "Gegenprobe", "Evidenzgrenze"], "needed_for": "lab"}], "related": ["KB-0011", "KB-0013", "KB-0014", "KB-0016", "KB-0021", "KB-0031", "KB-0572", "KB-0618", "KB-0683", "KB-0720"], "applies": ["KB-0021", "KB-0031", "KB-0572", "KB-0618", "KB-0683", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein synthetischer B2B-Capability-Fall wird mit Stakeholdern, Capability Map, Informations-/Applikationslandschaft, Zielzustand, Transition Roadmap, ADRs, Risiko- und Messmodell ausgearbeitet.", "rationale": "Architecture Management wird erst mit nachvollziehbaren Entscheidungen und überprüfbaren Übergängen sichtbar."}, "ARCHITECT-TARGET": {"active": true, "scope": "Die Rolle kann Business Capability, Value Stream, Information, Application, Technology, Security, Data, Costs und Migration für eine Entscheidung verbinden.", "rationale": "Enterprise Architecture begründet bewusst, welche Änderungen im Portfolio zusammengehören und welche nicht."}, "STAFF-TARGET": {"active": true, "scope": "Sie schafft gemeinsame Sprache, Architekturprinzipien, Review- und Ausnahmewege, die mehrere Produkt- und Plattformteams ohne Zentralisierung ihrer Fachentscheidungen nutzen.", "rationale": "Staff-Wirkung entsteht aus besserer Entscheidungsqualität und Abhängigkeitsklarheit über Teams hinweg."}, "CHIEF-TARGET": {"active": true, "scope": "Sie unterstützt Investitionspriorisierung, Risikoakzeptanz, Sourcing, Zielbetriebsmodell, Governance und die Verfolgung strategischer Outcomes über ein Technologieportfolio.", "rationale": "Chief-Level verantwortet den Zusammenhang von Geschäftsstrategie, Fähigkeiten, Organisation, Technologie und ökonomischen Folgen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Tiefe Domänen-, Datenschutz-, Finanz-, M&A-, Recht-, Prozessmodellierungs- und branchenspezifische Regulierungsexpertise wird bei entsprechender Entscheidung mit den fachlich verantwortlichen Spezialisten ergänzt.", "rationale": "Der Enterprise Architect integriert Perspektiven, ersetzt aber nicht die fachliche oder rechtliche Autorität."}}, "lab_validation": [{"lab_id": "KB-0015-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Synthetischer B2B-Commerce- und AI-Assistenzfall mit lokalem Architekturrepository", "evidence": "Die Fallarbeit enthält Stakeholder, Capability Map, Value Stream, Informations- und Applikationssicht, Zielbild, Roadmap, Entscheidungslog, Risiken, KPIs, negative Scope-Prüfung und Cleanup.", "limitations": "Keine realen Geschäftszahlen, Verträge, Kundendaten, Systemzugriffe, Kostenfreigaben oder organisatorischen Mandate wurden verwendet."}]}
---
# Enterprise Architect als Zielrolle

## Zweck, Definition und Scope

Ein Enterprise Architect verbindet Geschäftsziele, Fähigkeiten, Prozesse, Informationen, Anwendungen, Technologie, Organisation, Risiken und Investitionen zu entscheidbaren Zusammenhängen. Die Rolle zeichnet nicht „die ganze IT“ als endloses Diagramm. Sie hilft Verantwortlichen, wirksame Veränderungen im Portfolio zu wählen, Abhängigkeiten sichtbar zu machen und Übergänge so zu steuern, dass lokale Optimierung nicht die Organisation als Ganzes beschädigt.

Der Enterprise Architect entscheidet nicht automatisch über jede Lösung. Ein Solution Architect kann eine einzelne fachliche Lösung entwerfen; ein Platform Architect ein gemeinsames technisches Produkt; ein Cloud Architect Platzierung und Providergrenzen. Enterprise Architecture stellt den Rahmen, in dem diese Entscheidungen zu Geschäftsfähigkeiten, Datenhoheit, Zielbetriebsmodell, Investitionspriorität, Risikoakzeptanz und Migrationssequenz passen. Sie ist damit eine Entscheidungsdisziplin, keine Diagrammproduktionsmaschine und keine zentrale Genehmigungsstelle für jede Technologie.

Eigene Projektarbeit in Bereichen wie AI-Anwendungen, Systemintegration oder Prozessdigitalisierung liefert nur begrenzten Kontext. Solche Kontexte stützen keine Behauptung eines Enterprise-Architect-Titels, eines Architecture Boards, eines Transformationsprogramms oder organisationsweiter Portfolioverantwortung.

Nach diesem Kapitel kann der Leser:

1. eine Geschäftsfrage in Capabilities, Value Streams, Informationsobjekte, Anwendungen, Technologie, Risiken, Kosten und Verantwortungen übersetzen;
2. zwischen Ist-Landschaft, Zielarchitektur und sequenziertem Transition State unterscheiden;
3. Architekturartefakte an konkrete Stakeholderentscheidungen binden statt ein universelles Detailmodell zu erzeugen;
4. Architekturprinzipien, Standards, Ausnahmeprozess und technische Guardrails mit Produktautonomie vereinbaren;
5. Investitions-, Sourcing-, Plattform-, Cloud- und AI-Entscheidungen anhand von Outcome, Abhängigkeit, Risiko, Kosten und Exit bewerten;
6. eine nachvollziehbare Roadmap mit Messgrößen, Entscheidungspunkten und Bedingungen für Neubewertung formulieren.

## Kompetenzmarker und Evidenzgrenzen

| Marker | Status | Bedeutung |
|---|---|---|
| CURRENT-EVIDENCE | offen | Eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| HANDS-ON-TARGET | aktiv | Ein B2B-Fall wird zu Capability Map, Informations-/Applikationssicht, Zielbild, Roadmap und Entscheidungslog ausgearbeitet. |
| ARCHITECT-TARGET | aktiv | Alternativen und ihre Wirkung auf Capability, Daten, Prozesse, Anwendungen, Technology, Kosten und Risiko werden begründet. |
| STAFF-TARGET | aktiv | Gemeinsame Begriffe, Prinzipien und Reviewwege verbessern teamübergreifende Entscheidungen, ohne Fachownership zu zentralisieren. |
| CHIEF-TARGET | aktiv | Portfolio-, Sourcing-, Risiko- und Operating-Model-Entscheidungen werden als strategische, messbare Wetten geführt. |
| SPECIALIST-OPTIONAL | aktiv | Domänenrecht, Finanzmodelle, komplexe Prozess- und Datenmodelle sowie Branchennormen werden durch zuständige Fachleute vertieft. |

## Mental Model: Die Landkarte für eine Reise mit Umleitungen

Ein Unternehmen ist keine Maschine, die sich durch eine Zielzeichnung austauschen lässt. Es ist ein Netz aus Kundenerwartungen, Fähigkeiten, Menschen, Verträgen, Daten, Anwendungen, Technologie und gewachsenen Entscheidungen. Enterprise Architecture ist eine Landkarte mit Reiseplan: Sie zeigt, wo eine Änderung starten darf, welche Brücken Abhängigkeiten darstellen, welche Wege riskant sind und in welcher Reihenfolge Übergänge Wert schaffen.

Eine Karte ist nicht das Gebiet. Ein Capability-Modell zeigt, **was** die Organisation leisten muss, nicht wie ein einzelnes Team implementiert. Eine Applikationskarte zeigt Verantwortungsgrenzen, nicht jede Klasse oder Tabelle. Eine Roadmap zeigt beabsichtigte Übergänge, keine Garantie. Die Rolle muss deshalb jede Darstellung mit drei Fragen verbinden:

1. Welche Entscheidung kann der Stakeholder mit dieser Sicht treffen?
2. Welche Annahme, Quelle, Unsicherheit und Owner begrenzt die Aussage?
3. Wie wird nach der Entscheidung überprüft, ob die erwartete Wirkung eintritt?

## Prerequisites und Dependencies

Die [Rollenmatrix](../00-navigation-governance/02-rollen-kompetenz-matrix.md), die [Selbsteinschätzung und Evidenzgrenzen](../00-navigation-governance/04-cv-istbild-und-zielkompetenzen.md), das [Kompetenzmodell](../00-navigation-governance/05-kompetenzmodell-fuer-staff-principal-und-chief.md), die [Lerntiefe](../00-navigation-governance/06-praktische-und-architektonische-lerntiefe.md) und die [Labstrategie](../00-navigation-governance/09-laborstrategie-und-beweisartefakte.md) sind harte Voraussetzungen.

| Beziehung | Kapitel | Anschluss |
|---|---|---|
| related | [KB-0011: GenAI Solution Architect](01-genai-solution-architect-als-zielrolle.md) | Ein AI-Use-Case benötigt Capability-, Daten-, Prozess- und Risikokontext. |
| related | [KB-0013: AI Platform Architect](03-ai-platform-architect-als-zielrolle.md) | Gemeinsame AI-Fähigkeiten werden als Portfolioinvestition und Operating Model eingeordnet. |
| related | [KB-0014: Platform Architect](04-platform-architect-als-zielrolle.md) | Plattformangebote sind Enablement-Capabilities mit Kosten, Ownership und Produktmetriken. |
| related | [KB-0016: Cloud Architect](06-cloud-architect-als-zielrolle.md) | Cloud-Platzierung, Provider und Landing Zone folgen Capability-, Risiko- und Sourcingentscheidungen. |
| applies | [KB-0021](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0021) | Zielrollen und Architekturkontexte werden später weiter differenziert. |
| applies | [KB-0031](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0031) | Methoden- und Entscheidungsinstrumente ergänzen dieses Rollenmodell. |
| applies | [KB-0572: Grafana](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0572) | Betriebsdaten werden zu Architektur-Outcome-Evidenz. |
| applies | [KB-0618: Datenschutzarchitektur](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0618) | Datenklassen, Retention, Zugriff und Grenzen müssen in Entscheidungen sichtbar sein. |
| applies | [KB-0683](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0683) | Governance- und Portfoliovertiefung. |
| applies | [KB-0720: Portfolioevidenz](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0720) | Lernergebnisse und berufliche Evidenz werden getrennt gehalten. |

## Core Concepts und Mechanismen

### Capability, Value Stream, Prozess und Organisationseinheit

Diese Begriffe werden oft vermischt, führen aber zu unterschiedlichen Entscheidungen:

| Begriff | Frage | Beispiel im B2B-Commerce | Nicht gleichbedeutend mit |
|---|---|---|---|
| Capability | Was muss die Organisation dauerhaft können? | Aufträge erfüllen, Kunden informieren, Bestand steuern | Team, Tool oder einzelner Prozessschritt. |
| Value Stream | Wie entsteht ein Ergebnis für einen Stakeholder? | Anfrage → Angebot → Auftrag → Lieferung → Support | Organigramm oder Systemarchitektur. |
| Prozess | Welche wiederholbaren Aktivitäten setzen die Fähigkeit um? | Bestellung prüfen, Bestand reservieren, Lieferung auslösen | Gesamte Capability. |
| Organisationseinheit | Wer hat Verantwortung oder führt Arbeit aus? | Commerce, Operations, Finance, Partner | Capability selbst. |
| Produkt | Welche dauerhaft verantwortete Wertschöpfung wird geliefert? | Commerce Portal, Order API, AI-Assistenz | jedes Projekt oder jede Anwendung. |
| Anwendung | Welches Software-System trägt Verhalten und Daten? | ERP, Commerce Engine, Status API, Warehouse Adapter | Capability oder Datenhoheit. |
| Information Object | Welche fachliche Information hat Bedeutung und Owner? | Bestellung, Kunde, Bestand, Rechnung | Tabelle, Eventtopic oder API-Payload allein. |

Eine Capability Map bleibt möglichst stabil, wenn Anwendungen wechseln. Das verhindert, dass ein Replatforming zugleich den Blick auf Geschäftsverantwortung zerstört. Sie wird nicht bis auf jede Subfunktion verfeinert, sondern nur so weit, dass eine reale Investition, Risiko- oder Ownershipfrage beantwortbar ist.

### Architekturentscheidungen als Hypothesen mit Wirkungskette

Eine Enterprise-Entscheidung formuliert eine Hypothese: „Wenn wir die Capability Kundenstatus über ein klar besessenes Statussystem und eine standardisierte Integrationsgrenze bereitstellen, sinken Supportkontakte und Änderungsrisiko, ohne den ERP-Kern direkt für jedes Produkt zu öffnen.“ Die Hypothese braucht:

- **Outcome:** Welche fachliche, Risiko- oder Betriebswirkung wird erwartet?
- **Scope:** Welche Capability, Produkte, Daten, Regionen, Teams und Verträge sind einbezogen oder ausdrücklich ausgeschlossen?
- **Optionen:** Was sind mindestens zwei plausible Wege einschließlich Nichtstun?
- **Constraints:** Recht, Daten, Budget, Zeit, Fachinvarianten, bestehende Verträge, Kompetenz und Migrationsfenster.
- **Evidence:** Ist-Daten, Nutzerforschung, Kostenmodell, Security-/Privacyanalyse, technische Proofs und Betriebsdaten.
- **Decision:** Owner, Mandat, Datum, Prinzip, Ausnahme und Ablauf.
- **Feedback:** KPI, Leading Indicator, Reviewdatum und Revisionsauslöser.

Ohne Feedback wird Architektur zu Meinung. Ohne Entscheidung wird Analyse zu Dokumentation ohne Wirkung.

### Ist, Ziel und Transition State

Ein Zielbild ohne Transition State versteckt Migrationsrisiko. Eine Organisation lebt während einer Übergangsphase in mehreren Zuständen:

```text
Ist: direkte Commerce-zu-ERP-Integrationen, manuelle Ausnahmen, unklare Datenowner
  │
  ├─ Transition A: Status API mit klarer Ownership und beobachtbaren Verträgen
  │
  ├─ Transition B: Ereignisgrenze, Datenklassifikation, schrittweise Konsumentenmigration
  │
  └─ Transition C: alte Integrationen abschalten, Retention/Archiv prüfen, Kosten beenden
  │
Ziel: fachlich klare Capability- und Informationsgrenzen, kontrollierte APIs/Events, messbarer Betrieb
```

Jeder Transition State hat eigene Risiken, Budget, Supportbedarf, Datenreplikationen und Rollbackgrenzen. „Strangler“ oder „Parallelbetrieb“ sind keine kostenlos sicheren Methoden. Sie erhöhen oft temporär Komplexität, Kosten und Konsistenzbedarf. EA plant diese Zeit bewusst und überprüft, ob der alte Zustand wirklich endet.

### Prinzipien, Standards und Guardrails

Ein Architekturprinzip ist ein nachprüfbarer Entscheidungsleitfaden wie: „Jede kritische Fachinformation hat benannten Owner, zugelassenen Zugriffspfad, Retentionregel und beobachtbare Änderungsgrenze.“ Ein Standard konkretisiert, etwa bevorzugte Identity- oder Telemetrieschnittstellen. Ein Guardrail setzt eine Grenze technisch durch, beispielsweise ein Policygate für fehlende Serviceowner. Diese drei dürfen nicht verwechselt werden.

| Artefakt | Zweck | Gefahr bei Missbrauch |
|---|---|---|
| Prinzip | wiederkehrende Trade-offs lenken | Slogan ohne Test oder Ausnahmeweg. |
| Standard | Varianten reduzieren und Interoperabilität schaffen | dogmatische Produktwahl ohne Kontext. |
| Referenzarchitektur | bewährte Struktur und Schnittstellen zeigen | Kopie ohne Abhängigkeits- und Betriebsprüfung. |
| ADR | konkrete Entscheidung mit Kontext bewahren | Ablage ohne Revisions- und Folgenprüfung. |
| Guardrail | gemeinsamen Schutz durchsetzen | unverständliche, globale Blockade ohne Escape Hatch. |
| Roadmap | Übergänge und Abhängigkeiten koordinieren | Terminplan als Garantie oder verdeckte Budgetfreigabe. |

## Architecture / Data Flow: Von Strategie zu überprüfbarer Veränderung

Ein Enterprise-Architecture-Loop verbindet Strategy, Portfolio und Delivery, ohne die fachliche Entscheidung des Produktteams zu übernehmen.

```text
Stakeholder-Outcome und Risiko
          │
          ▼
Capability / Value Stream / Information Owner
          │
          ▼
Ist-Landschaft: Prozesse, Anwendungen, Daten, Technologie, Verträge, Kosten
          │
          ▼
Optionen, Zielbild und Transition States ──→ Architekturentscheidung / Investition
          │                                           │
          ▼                                           ▼
Roadmap, Standards, Plattformangebote            Produkt- und Plattformdelivery
          │                                           │
          └────────── KPI, SLO, Kosten, Risiko, Nutzerfeedback ──────────┘
                                      │
                                      ▼
                                 Reassessment
```

Beispiel: Ein Executive möchte „AI für Kundenservice“. Die EA-Frage ist nicht zuerst, welches Modell gewählt wird. Zuerst werden Capability Kundenservice, betroffene Datenklassen, fachliche Autorität, bestehende Supportprozesse, Kosten des Fehlers, Recht, Provider- und Exitgrenzen, Ownership und messbare Outcomes geklärt. Daraus kann ein Pilot entstehen, der nur Statusfragen mit Quellen beantwortet. Eine autonome Vertragszusage wäre ein anderer Risikofall mit anderer Architecture Decision.

Trust Boundaries sind sichtbar: Kundendaten, interne Wissensquellen, Modellprovider, Toolgateway, CRM/ERP und Observability haben verschiedene Owner, Zugriffspfade und Aufbewahrungsregeln. Ein Architekturdiagramm ohne diese Grenzen verschleiert gerade die wesentlichen Entscheidungen.

## Protocols, Standards und Tools

Enterprise Architecture verwendet Notationen und Standards als Kommunikation, nicht als Ersatz für Denken.

| Referenz | Sinnvolle Verwendung | Grenze |
|---|---|---|
| ISO/IEC/IEEE 42010:2022 | Architekturdescription mit Entity of Interest, Stakeholder, Concerns, Viewpoints und Views strukturieren | Definiert keine konkrete Methode, Technologie oder fertige Architektur. |
| TOGAF Standard, 10th Edition | anpassbaren Rahmen für EA-Praxis, Governance, Deliverables und Konfiguration nutzen | Zertifizierung oder ADM-Schritte allein beweisen keine wirksame Entscheidung. |
| ArchiMate 3.2 | Business-, Application-, Technology- und Motivationsbeziehungen eindeutig modellieren | Modellierungstiefe muss zu einer Entscheidung passen. |
| Open Agile Architecture | outcome-, kunden- und produktzentrierte Agile-Architecture-Perspektive einbeziehen | Agilität ersetzt keine Risiko-, Daten- oder Betriebsverantwortung. |
| Repository / Wiki / Portfolio Tool | ADRs, Maps, Roadmaps, Standards, Risiken und Status versionieren | Ein Tool ist keine Source of Truth ohne Ownership und Review. |
| Katalog / CMDB / Telemetrie | reale Systeme, Owner und Betriebsdaten mit Architekturannahmen abgleichen | Automatische Discovery ersetzt keine fachliche Bedeutung oder Datenhoheit. |

ISO/IEC/IEEE 42010:2022 unterscheidet Architektur von ihrer Description und spezifiziert Anforderungen für Struktur und Ausdruck einer Architecture Description; es ist für Systeme, Software und Unternehmen anwendbar. [ISO 42010](https://www.iso.org/standard/74393.html) legt jedoch weder einen Erstellungsprozess noch eine konkrete Notation fest. Der [TOGAF Standard, 10th Edition](https://www.opengroup.org/togaf) trennt grundlegende Inhalte und anpassbare Guides. Die [ArchiMate 3.2 Specification](https://www.opengroup.org/togaf) wird dort als offene, werkzeugunabhängige Modellierungssprache beschrieben. [Open Agile Architecture](https://www.opengroup.org/AgileArchitecture) ergänzt einen outcome-, kunden- und produktzentrierten Ansatz.

## Konfiguration / Implementierung: Ein entscheidungsfähiges Architekturrepository

Ein kleines Architekturrepository kann als versionierter Ordner beginnen. Es braucht keine sofortige Modellierungsplattform. Die Struktur muss Entscheidungen, Traceability und Lifecycle sichtbar machen:

```text
architecture/
  principles/
  capability-map/
  information-ownership/
  landscapes/
  decisions/
  roadmaps/
  standards/
  exceptions/
  evidence/
  retired/
```

Ein ADR ist nur dann nützlich, wenn er Kontext und überprüfbare Folgen enthält:

```yaml
id: ADR-042
title: Kundenstatus wird über eine besessene Status-API bereitgestellt
status: accepted-for-transition
decision_owner: commerce-capability-owner
scope:
  capabilities: [customer-service, order-fulfillment]
  information_objects: [order-status]
options:
  - direct-erp-access
  - status-api-with-event-updates
  - no-change
decision: status-api-with-event-updates
constraints:
  - no customer-data replication without retention and access decision
  - ERP remains system of record
success_measures:
  - source-labeled status answers
  - fewer support escalations
reassessment_triggers:
  - data-access incident
  - p95 status freshness exceeds agreed threshold
sunset_or_next_decision: ADR-042-review-2027-03
```

Dies ist eine Lernvorlage, keine automatisch gültige Unternehmenspolicy. Sie muss mit tatsächlichem Mandat, Datenklassifikation, Privacy-/Securityreview, Deliveryartefakten und Eigentümern verbunden werden. Besonders wichtig: Der `status` einer ADR dokumentiert keine erfolgreiche Migration. Die Roadmap, Betriebsmetriken und das Abschalten der Altschnittstelle liefern dafür getrennte Evidenz.

## Scalability und Performance

EA skaliert nicht durch mehr Modelle, sondern durch begrenzte, wiederverwendbare Entscheidungsmechanik. Je größer das Portfolio, desto höher das Risiko von veralteten Diagrammen und zeremonieller Governance. Die Rolle priorisiert daher Artefakte mit hohem Entscheidungswert.

| Signal | Einheit | Bedeutung |
|---|---:|---|
| Decision lead time | Tage von Problemdefinition bis dokumentierter Entscheidung | Zu langsam kann Delivery blockieren; zu schnell kann Risiken übersehen. |
| Roadmap confidence | Anteil mit Owner, Abhängigkeit, Funding und Erfolgsmessung | Kein Terminfortschritt, sondern Entscheidungsreife. |
| Standardadoption | Services/Teams mit nachvollziehbarem Standardgebrauch | Adoption ohne Outcomes kann Zwang oder Scheincompliance sein. |
| Ausnahmequote und -alter | Anzahl, Kategorie, verbleibende Laufzeit | Wiederholung zeigt eine falsche Standardgrenze oder unerkannten Bedarf. |
| Portfolio-Risiko | offene kritische Risiken nach Capability/Information | Muss Owner, Behandlung und Datum enthalten; kein rein numerischer Score. |
| Transition-Fortschritt | abgeschaltete Altsysteme, migrierte Konsumenten, Datenlöschung | Neue Plattform plus alte Landschaft ist häufig teurer als sichtbar. |
| Outcome | z.B. Supportkontakt, Durchlaufzeit, Fehlerkosten, Verfügbarkeit | Kausalität kritisch prüfen; Architektur allein verursacht selten den gesamten Effekt. |

Ein Architecture Board für jede kleine API-Änderung skaliert nicht. Besser sind klare Entscheidungsrechte: Team entscheidet innerhalb von Guardrails; Platform/Solution Architects entscheiden gemeinsame technische Verträge; EA eskaliert nur Portfolio-, Daten-, Sourcing-, Capability- oder cross-domain Trade-offs. Die Grenzen werden über wiederkehrende Entscheidungsmuster und Incident-/Exception-Daten nachgeschärft.

## Reliability / Failure Modes

| Fehlmodus | Frühes Signal | Schutz | Recovery |
|---|---|---|---|
| Architekturrepository veraltet | Owner fehlen, Diagramme widersprechen Betrieb, Roadmap ohne Status | metadata-as-code, Lifecycle, Reviewtrigger, Links zu Telemetrie/Katalog | irrelevante Sichten archivieren; kritische Entscheidungen mit aktuellen Ownern erneut prüfen. |
| Architecture Board wird Flaschenhals | lange Wartezeit, informelle Umgehung, Standard ohne Adoption | Delegation, klare Decision Rights, SLO für Reviews, risk-based Triage | Scope des Boards reduzieren, Guardrails/Referenzen verbessern, Bypässe analysieren. |
| Zielbild blockiert Delivery | große Vorabmodelle, keine Transition, keine Lernschleife | thin slice, optionenbasiert, Transition States, frühe Evidenz | Zielbild anpassen oder stoppen; keine Sunk-Cost-Verteidigung. |
| Lokale Produktoptimierung verletzt Enterprisegrenze | Datenkopien, direkte Punkt-zu-Punkt-Integrationen, doppelte Capabilities | Information Ownership, Standards, Architekturreviews für definierte Risiken | Daten-/Integrationsinventar, Migrationsentscheidung, befristete Ausnahme. |
| Standard wird Dogma | unnötige Kosten, Schattenplattform, wiederkehrende Ausnahme | Kriterien, Vergleich mit Alternativen, Ablauf und Exit | Standard lockern, Varianten offiziell unterstützen oder klar begrenzen. |
| Roadmap ignoriert Decommissioning | steigende Lizenzen, parallele Daten, Supportlast | Abschalt- und Datenlöschmilestone mit Owner und Budget | alte Schnittstelle begrenzen, Verbraucher migrieren, Retention und Verträge schließen. |
| AI-Investition ohne fachliche Grenze | Halluzination, unzulässiger Toolzugriff, Kostenburn | Use-case filter, Data/Trust Boundary, Eval/Human Gate, SLO | Rollout stoppen, Route/Scope zurücknehmen, Incident und Risiko bewerten. |

## Security, Governance und Compliance

Enterprise Architecture macht Verantwortlichkeiten und Folgen sichtbar, sie übernimmt aber nicht die Rolle von Security, Privacy, Legal oder Compliance. Für eine Entscheidung über Daten, Cloud oder AI müssen mindestens folgende Fragen beantwortet sein:

| Aspekt | Architekturaussage | notwendiger Spezialowner |
|---|---|---|
| Daten | Informationsowner, Klassifikation, Zugriff, Retention, Transfer und Löschung | Data Owner, Privacy, Legal. |
| Identität | Nutzer-, Service- und Adminzugriffe sowie Delegation und Audit | IAM/Security. |
| Supply Chain | Artefaktherkunft, Change- und Dependency-Risiko | Platform Security/Engineering. |
| Resilienz | kritische Capabilities, RTO/RPO, Provider- und Prozessabhängigkeit | Business Owner, SRE, BCM. |
| AI | Zweck, Daten-/Toolgrenze, Qualitäts-/Safety-Eval, Human Gate | Product/Domain, Security, Privacy, AI Owner. |
| Sourcing | Vertrag, Region, Exit, Lock-in, Subprozessoren, Kostenmodell | Procurement, Legal, Finance, Cloud. |
| Ausnahme | Risiko, Kompensation, Owner, Ablauf, Rückkehrplan | benannter Entscheider. |

Eine Prinzipienliste wie „Security by Design“ ist zu schwach. Eine wirksame Aussage benennt die Entscheidung und Kontrolle: „Kritische Kundendaten verlassen die klassifizierte Region nur nach dokumentiertem Transfermechanismus, Datenownerfreigabe und beobachtbarer Zugriffsspur.“ Ob eine Regel rechtliche Anforderungen erfüllt, wird nicht allein durch Architecture Review behauptet.

## Observability und Troubleshooting

Architecture Outcomes brauchen Betriebsdaten, Portfolio- und Nutzerfeedback. Ein Überblicksdashboard sollte nicht jeden Dienstmetrikwert kopieren. Es verknüpft Architekturhypothesen mit wenigen entscheidungsfähigen Signalen.

| Frage | Evidenz |
|---|---|
| Erfüllt die Capability ihren Outcome? | Fach-KPI, Nutzerfeedback, Durchlaufzeit, Fehler-/Eskalationsrate. |
| Werden kritische Daten-/Trust-Grenzen eingehalten? | Zugriffsaudit, Data-Flow-Review, Policy-/Evalfälle, Incidenttrend. |
| Ist die Transition real? | Anteil migrierter Verbraucher, Altschnittstellen, Datenkopien, abgeschaltete Kosten. |
| Funktioniert die Plattformentscheidung? | Adoption, Bypass, SLO, Supportlast, Ausnahmealter. |
| Bleibt das Risiko akzeptabel? | offene Risikoitems, Kontrolldrift, Recoverytests, Provider-/Vertragsänderung. |
| Ist der Architectural Runway wirtschaftlich? | Kosten pro Capability/Outcome, Parallelbetrieb, FTE, Lock-in- und Exitstatus. |

Diagnosepfad bei einer gescheiterten Roadmap:

1. Prüfe, ob Ziel, Owner und Outcome je Transition State klar waren. Ein Termin ohne Entscheidungskontext ist kein Diagnosepunkt.
2. Vergleiche Istdaten mit Annahmen: Nutzerwert, Datenzugang, Vertragsrisiko, Teamkapazität, Plattformreife, Migration und Altsystemkosten.
3. Unterscheide falsche Lösung von falschem Problem. Ein technisch sauberer Service kann die falsche Capabilitypriorität adressieren.
4. Suche nach ungelösten Abhängigkeiten: Datenowner, Fachinvariante, Vendorvertrag, Identity, Testdaten, Migrationskonsumenten oder fehlender Decommissioning-Owner.
5. Entscheide sichtbar: fortsetzen mit anderer Annahme, Scope reduzieren, Sequenz ändern, pausieren oder beenden. „Weiterarbeiten“ ist keine neutrale Option.
6. Aktualisiere ADR, Roadmap, Risiko, Budgetannahme und Kommunikation. Ein gescheiterter Pilot ist wertvolle Evidenz, wenn Folgeentscheidungen daraus folgen.

## Cost / FinOps

EA betrachtet Kosten über den Lebenszyklus und die Capability, nicht nur über einzelne Projektbudgets:

\[
C_{capability}=C_{build}+C_{run}+C_{change}+C_{risk}+C_{exit}
\]

\[
C_{transition}=C_{new}+C_{parallel}+C_{migration}+C_{decommissioning}
\]

Der günstigste Neubau kann teuer sein, wenn Parallelbetrieb, Datenmigration, Schulung, Support, Vertrag oder Abschaltung fehlen. Ein kostengünstiges Altsystem kann ebenso teuer sein, wenn Risiko, Änderungsblockade und manuelle Prozesskosten sichtbar werden.

| Kostentreiber | Entscheidung | Anti-Pattern |
|---|---|---|
| Anwendungen und Lizenzen | konsolidieren, ablösen, behalten oder modernisieren | Stückpreis ohne Exit-/Migrationskosten vergleichen. |
| Datenkopien und Integrationen | fachliche Ownership und zulässige Replikation entscheiden | jede Teamdatenbank als neue Source of Truth behandeln. |
| Plattformen/Cloud | gemeinsame Fähigkeit, Verbrauch und Reserve mit Outcomes verbinden | Zentralbudget versteckt Nutzung und Bypass. |
| Transformation | Parallelbetrieb, Migration, Training, Governance und Support budgetieren | Roadmap nur als Liefertermin sehen. |
| Risiko | erwartete Verlusthöhe, Kontrollen, Versicherbarkeit und Recovery | Risiko mit „niedrig/mittel/hoch“ ohne Owner oder Maßnahme versehen. |
| Sourcing | Vertragslaufzeit, Transfer, Egress, Subprozessoren, Exit und Kompetenz | Providerkosten ohne Lock-in und Betriebsfähigkeit vergleichen. |

FinOps liefert keine automatische „richtige“ Portfolioentscheidung. Es zwingt jedoch dazu, Annahmen, Allokation, Sensitivität und Ausstieg sichtbar zu machen, bevor Architekturentscheidungen langfristige Verpflichtungen erzeugen.

## Trade-offs, Alternativen und Anti-Patterns

| Entscheidung | Optionen | Trade-off |
|---|---|---|
| Zentrales EA-Team | zentral, föderiert, hybride Community of Practice | Zentral erleichtert Konsistenz; föderiert erhöht Domänennähe. Entscheidend sind Mandat, Artefaktqualität und Deliveryanschluss. |
| Modellierungstiefe | Kontextmodell, Capability Map, detaillierte ArchiMate-Views | Mehr Details können Präzision oder Veralterung erzeugen. Nur modellieren, was eine reale Entscheidung verbessert. |
| Standardisierung | verbindlicher Standard, Leitlinie, Referenzarchitektur, Ausnahme | Mehr Einheit senkt Varianz, kann Innovation und Domänenfit bremsen. Ausnahmealter ist ein wichtiges Feedbacksignal. |
| Roadmap | big-bang, sequenzierte Transition, paralleler Pilot | Big-bang kann Dauer des Parallelbetriebs senken, erhöht aber Blast Radius; Transition erhöht temporäre Komplexität. |
| Sourcing | build, buy, partner, managed service | Time-to-value gegen Daten, Kosten, Differenzierung, Kompetenz und Exit. |
| AI-Capability | zentraler Service, Domänenlösung, keine AI | Wiederverwendung gegen Kontextverlust und Risiko. „Kein AI-Einsatz“ bleibt eine gültige Option. |

Anti-Patterns: Karten ohne Entscheidung, TOGAF als Prozesszwang, ArchiMate als Vollständigkeitswettbewerb, Prinzipien ohne Durchsetzung, zentralisierte Freigabe aller Changes, Zielbild ohne Transition, Roadmap ohne Abschaltung, Capability Map nach Organigramm, Tech-Radar ohne Kosten/Risiko, AI-Strategie ohne Use-Case- und Daten-/Trustgrenze.

## Staff-, Principal- und Chief-Entscheidungen

| Ebene | Entscheidung | Evidenz, Wirkung und Trigger |
|---|---|---|
| Staff | Gemeinsame Begriffe für Capability, Produkt, Information Owner und Plattform etablieren | Mindestens zwei Teams nutzen dieselbe Sprache in einer realen Entscheidung. Begriffsverwirrung oder doppelte Ownership lösen Nacharbeit aus. |
| Staff | Leichtgewichtiges ADR- und Ausnahmeformat einführen | Context, Optionen, Owner, Follow-up und Ablauf müssen maschinen-/menschenlesbar sein. Viele gleiche Ausnahmen zeigen eine Lücke im Standard. |
| Principal | Eine cross-domain Informationsgrenze festlegen | Datenowner, Konsumenten, Replikationsregel, Access, Retention, Event/API und Migration werden gemeinsam entschieden. Incident oder neue Regulierung triggert Review. |
| Principal | Zielbild in Transition States sequenzieren | Jede Phase hat Nutzen, Budget, Risiko, Abhängigkeit, Abschaltziel und Erfolgssignal. Parallelbetrieb ohne Sunset wird eskaliert. |
| Chief | Portfolio nach Capabilityoutcome und Risiko priorisieren | Investitionen konkurrieren sichtbar; Technikmodernisierung erhält einen erwarteten Wert und Exit. Sunk costs sind kein Fortsetzungsgrund. |
| Chief | Operating Model und Sourcinggrenzen wählen | Mandat, Expertise, Datenhoheit, Vertragsrisiko, Kosten und Resilienz entscheiden. Wiederkehrende Bypässe oder untragbare Supportlast lösen Review aus. |
| Chief | Architekturgovernance legitimieren und begrenzen | Entscheidet, welche Risiken Review brauchen und was Teams autonom wählen. Governance ohne kurze Rückkopplung wird selbst zum Risiko. |

## Production Checklist

| Bereich | Prüfbare Bedingung | Owner | Stop-/Revisionsbedingung |
|---|---|---|---|
| Entscheidungsfrage | Outcome, Scope, Optionen, Nichtstun und Mandat definiert | Business + Architecture Owner | Keine Entscheidungsberechtigung oder kein Outcome. |
| Stakeholder | Business, Product, Data, Security, Operations, Finance identifiziert | Decision Owner | Kritischer Owner nicht beteiligt. |
| Ist-Evidenz | Capability, Information, Anwendungen, Verträge, Kosten und Risiken ausreichend aktuell | EA + Domain Owner | Landkarte widerspricht Betrieb oder wichtige Quelle fehlt. |
| Ziel/Transition | Target und Übergänge mit Abhängigkeiten, Budget, Sunset | Portfolio/Program Owner | Zielbild ohne Migrations-/Decommissioningplan. |
| Daten/Security | Ownership, Klasse, Access, Retention, Trust Boundary, Spezialreview | Data/Security/Privacy | Keine Freigabe für kritische Daten- oder Providergrenze. |
| Delivery | produkt-/plattformnahe ADR, API, Policy, SLO und Testbelege | Product/Platform Owner | Annahmen nicht in technische oder Betriebsartefakte übersetzt. |
| Betrieb | Monitoring, Incident, RTO/RPO, Support und Fehlerbudget | SRE/Business Owner | Kritische Capability ohne Recovery-/Owner. |
| FinOps | Run, Change, Parallel, Exit, Risiko und Budgetowner | Finance + Portfolio Owner | Nur Buildbudget oder keine Ausstiegskosten. |
| Governance | Standard/Exception, Ablauf, Reviewtrigger und Audit | EA + Decision Owner | Permanente Ausnahme ohne akzeptiertes Risiko. |
| Feedback | KPIs, Reviewdatum und Stopkriterium | Decision Owner | Erfolg nicht messbar oder keine Revisionsmöglichkeit. |

## Interviewfragen mit Antwortleitfäden

1. **Was ist Enterprise Architecture und was nicht?** Sie verbindet Strategie, Capabilities, Informationen, Anwendungen, Technologie, Organisation, Risiko und Investition zu Entscheidungen. Sie ist weder ein IT-Inventar noch ein Genehmigungsboard für jede Bibliothek.
2. **Wie unterscheiden Sie Capability und Anwendung?** Capability beschreibt stabiles „Was“, Anwendung ein veränderbares „Womit“. Das Beispiel Kundenstatus kann durch mehrere Anwendungen unterstützt werden, bleibt aber eine fachliche Fähigkeit.
3. **Warum reicht ein Zielbild nicht?** Weil Migration, Parallelbetrieb, Datenreplikation, Verträge, Teamkapazität und Abschaltung eigene Risiken und Kosten haben. Transition States werden explizit geplant.
4. **Wie verhindern Sie, dass EA Delivery bremst?** Risk-based Decision Rights, kurze Artefakte, klare Standards, definierte Ausnahmewege und Feedback aus Delivery/Incidents. Miss Durchlaufzeit und Bypass.
5. **Wann standardisieren Sie Technologie?** Wenn gemeinsame Interoperabilität, Risiko, Kosten oder Kompetenz die Variante überwiegen. Benenne Kriterien, Ausnahme, Exit und Revisionsauslöser.
6. **Wie entscheiden Sie build versus buy für eine AI-Fähigkeit?** Vergleiche Differenzierung, Time-to-value, Daten/Trust, Kosten, Provider- und Exitrisiko, Betrieb und Teamkompetenz. Kein AI-Einsatz bleibt Option.
7. **Wie beweist eine Architekturentscheidung ihren Wert?** Über vorher definierte Outcome-, Leading-, Risiko-, Kosten- und Transitionmetriken. Korrelation wird vorsichtig bewertet und Annahmen werden revidiert.
8. **Was tun Sie bei einer veralteten Architecture Map?** Kritische Entscheidung zuerst identifizieren, Quellen/Katalog/Betriebsdaten abgleichen, Owner einbinden, überholte Ansicht archivieren und Lifecycle/Review verbessern.
9. **Wie gehen Sie mit einer Ausnahme um?** Risiko, Nutzen, Owner, Kompensation, Ablauf und Rückkehrpfad dokumentieren. Wiederholung kann neuen Standard oder reduzierte Policy begründen.

## Praktisches Lab / Fallarbeit: Capability-Roadmap für Commerce und AI-Assistenz

**Status:** **reviewed_only**, Stand 2026-09-15. Das Lab verwendet ausschließlich synthetische Annahmen. Es wurden keine realen Geschäftskennzahlen, Kundendaten, Verträge, ERP-/WMS-Systeme, Cloudressourcen oder organisatorischen Mandate geprüft oder verändert.

### Ausgangslage

Ein fiktives B2B-Unternehmen hat die Capability „Kundenauftrag erfüllen“. Commerce Portal, ERP, Lageradapter und Support arbeiten mit direkten Integrationen. Kunden fragen oft nach Status; Support kopiert Informationen manuell. Ein AI-Assistent soll zunächst ausschließlich quellengebundene Statusfragen beantworten. Die Geschäftsführung fragt, ob ein zentraler AI-Service, eine Status-API und eine Integrationsmodernisierung finanziert werden sollen.

### Aufbau

1. Benenne mindestens sechs Stakeholder: Customer Service, Commerce Product, Operations, Finance, Data/Privacy, Security, Platform und Executive Sponsor. Notiere Entscheidung, Concern und Owner.
2. Erstelle eine Capability Map mit Auftragserfassung, Bestandssteuerung, Erfüllung, Kundenstatus, Support, Abrechnung und Plattform Enablement. Halte Teams und Anwendungen getrennt.
3. Zeichne einen Value Stream von Kundenanfrage bis Antwort. Markiere Informationsobjekte Bestellung, Bestand, Versandstatus, Kunde und Wissensartikel mit Owner, Klassifikation und System of Record.
4. Erstelle eine Ist-Applikations- und Integrationssicht. Direkte Point-to-Point-Verbindungen werden sichtbar, aber nicht automatisch als „falsch“ bewertet.
5. Formuliere drei Optionen: A) nichts ändern und Supportprozess verbessern, B) besessene Status-API plus AI-Pilot, C) vollständige zentrale AI- und Integrationsplattform. Vergleiche Wert, Risiko, Kosten, Zeit, Daten und Exit.
6. Wähle unter den synthetischen Annahmen eine Option und erstelle drei Transition States mit Budgetannahme, Abhängigkeiten, SLO/KPI, Risiko, Owner, Reviewdatum und Sunset für die Altschnittstelle.
7. Schreibe ADR und Risiko-/Ausnahmelog. Erstelle zwei Messgrößen für Outcome, zwei für Migration, zwei für Risiko/Qualität und eine Kostenkennzahl.

### Negative Gegenproben

| Probe | Erwartete Reaktion | Was sie widerlegt |
|---|---|---|
| Board fordert „autonome Vertragszusage durch AI“ ohne Daten-/Toolgrenze | Scope wird als neue, höher riskante Entscheidung getrennt; kein stiller Ausbau des Statuspiloten | Dass ein erfolgreicher Q&A-Pilot autonome Fachaktionen legitimiert. |
| Zwei Systeme beanspruchen Ownership für Bestandsstatus | Entscheidung wird pausiert oder Data Owner wird geklärt; keine neue Source of Truth still einführen | Dass eine API Datenhoheit automatisch auflöst. |
| Roadmap enthält keinen Sunset für direkte Integration | Transition gilt als unvollständig; Parallelkosten und Risiko werden quantifiziert | Dass neue Plattform plus Altsystem einen Zielzustand darstellt. |
| Standard zwingt allen Teams dasselbe AI-Modell auf | Ausnahme-/Variantenentscheidung anhand Daten, Qualität, Kosten und Use Case; nicht nur Compliance abhaken | Dass Portfoliostandard ein Modellmonopol sein muss. |
| KPI sinkt trotz fristgerechter API-Lieferung nicht | Hypothese zu Capability/Prozess prüfen; nicht nur mehr Features liefern | Dass technische Lieferung automatisch Business Outcome erzeugt. |

### Auswertung und Cleanup

Das Lab ist erst bestanden, wenn ein Leser aus den Artefakten nachvollziehen kann, wer was entscheiden durfte, welche Daten-/Trustgrenzen gelten, warum eine Option gewählt wurde, wie der Übergang endet und woran die Hypothese geprüft wird. Lösche alle lokalen synthetischen Beispieldaten nach Auswertung. Eine spätere echte Ausführung braucht Fachmandat, aktuelle Inventare, Daten-/Privacyreview, Kostenbelege, Teamkapazität, Security- und Betriebsabnahme.

## Dependencies, Cross-References und Quellen

Grundlagen liegen in [KB-0002](../00-navigation-governance/02-rollen-kompetenz-matrix.md), [KB-0004](../00-navigation-governance/04-cv-istbild-und-zielkompetenzen.md), [KB-0005](../00-navigation-governance/05-kompetenzmodell-fuer-staff-principal-und-chief.md), [KB-0006](../00-navigation-governance/06-praktische-und-architektonische-lerntiefe.md) und [KB-0009](../00-navigation-governance/09-laborstrategie-und-beweisartefakte.md). AI-, Platform- und Cloud-Entscheidungen werden in [KB-0011](01-genai-solution-architect-als-zielrolle.md), [KB-0013](03-ai-platform-architect-als-zielrolle.md), [KB-0014](04-platform-architect-als-zielrolle.md) und [KB-0016](06-cloud-architect-als-zielrolle.md) vertieft.

| Quelle | Verwendete Aussage | Stand |
|---|---|---|
| Dateikatalog der Knowledge Base, KB-0015 | Verbindlicher Scope, Zielrollenfokus und Pfad. | Planstand 2026-09-14 |
| [ISO/IEC/IEEE 42010:2022](https://www.iso.org/standard/74393.html) | Anforderungen für Struktur und Ausdruck einer Architecture Description, einschließlich Stakeholder-/Viewpoint-Kontext. | Abgerufen 2026-09-15 |
| [TOGAF Standard, 10th Edition](https://www.opengroup.org/togaf) | Fundamentale Inhalte plus konfigurierbare, praxisorientierte Guides für EA. | Abgerufen 2026-09-15 |
| [Open Agile Architecture](https://www.opengroup.org/AgileArchitecture) | Outcome-, kunden- und produktzentrierte Agile-Architecture-Perspektive. | Abgerufen 2026-09-15 |
| [TOGAF/ArchiMate Übersicht](https://www.opengroup.org/togaf) | ArchiMate 3.2 als offene, unabhängige Modellierungssprache für Beziehungen zwischen Business-Domains. | Abgerufen 2026-09-15 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — Architekturdescriptions werden stärker mit operativer Evidenz verbunden.** ISO/IEC/IEEE 42010:2022 unterscheidet bewusst Architektur von ihrer Beschreibung und verlangt eine strukturierte Beziehung zu Stakeholder Concerns und Views. **Reifegrad: Established.** Die aktuelle praktische Innovation ist nicht eine neue Diagrammnotation, sondern die Verbindung von Architekturrepository, Servicekatalog, Telemetrie, Kosten- und Risikodaten. Sie verringert den Abstand zwischen Zielbild und Betrieb, erzeugt aber Datenqualitäts-, Zugriff- und Modellierungsaufwand. Ein Pilot koppelt deshalb nur eine kritische Capability an konkrete Ownership-, SLO-, Kosten- und Transitiondaten; er wird erweitert, wenn Entscheidungen dadurch nachweisbar schneller oder sicherer werden. Quelle: [ISO 42010](https://www.iso.org/standard/74393.html).

**Stand 2026-09-15 — Modular anpassbare EA-Standards statt Einheitsmethodik.** Der TOGAF Standard 10th Edition verbindet grundlegende Konzepte mit konfigurierbaren Guides. **Reifegrad: Established.** Das unterstützt eine an Kontext und Stakeholder angepasste Praxis, erhöht aber die Gefahr, dass Teams nur Begriffe übernehmen oder sich hinter Methodik verstecken. Einführung beginnt mit einem kleinen, wiederholbaren Entscheidungsfall: Capability, Optionen, Owner, Transition, Messung und Ausnahme. Sie wird erst skaliert, wenn Artifact-Review und Deliverydaten zeigen, dass die Methode hilft statt Wartezeit zu erzeugen. Quelle: [TOGAF](https://www.opengroup.org/togaf).

**Stand 2026-09-15 — Outcome- und produktorientierte EA integriert Architecture in Delivery.** Open Agile Architecture betont eine kunden-, outcome- und produktzentrierte Transformation. **Reifegrad: Adopting als Organisationspraxis, Established als Prinzip.** Das kann EA von der reinen Projektgovernance zur kontinuierlichen Capability-Steuerung bewegen. Die Risiken liegen in unklaren Entscheidungsrechten und der falschen Annahme, Agilität ersetze Daten-, Security- oder Betriebsgrenzen. Ein Pilot definiert deshalb Product/Capability Owner, Decision Rights, technische Guardrails, Ausnahmeweg und Outcome/Kosten-/Risikosignale, bevor agile Architekturmechanik breit ausgerollt wird. Quelle: [Open Agile Architecture](https://www.opengroup.org/AgileArchitecture).

