---
{"id": "KB-0002", "title": "Rollen-Kompetenz-Matrix", "domain": "00", "sequence": 2, "document_type": "navigation", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-14", "technical_reviewed_at": null, "research_cutoff": "2026-09-14", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0001", "concepts": ["stabile IDs", "Statusmodell", "kanonische Zuständigkeit"], "needed_for": "understanding"}], "related": ["KB-0003", "KB-0004", "KB-0005", "KB-0006", "KB-0011", "KB-0012", "KB-0013", "KB-0014", "KB-0015", "KB-0016"], "applies": ["KB-0267", "KB-0275", "KB-0305", "KB-0368", "KB-0409", "KB-0462", "KB-0537"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine eigene Kompetenzmatrix wird an zwei Architektur-Fallstudien mit Artefakten, Gegenproben und Lückenanalyse angewendet.", "rationale": "Rollenorientierung wird belastbar, wenn ein Profil konkrete Nachweise und nächste Lernschritte auslöst."}, "ARCHITECT-TARGET": {"active": true, "scope": "Für einen Use Case passende Fähigkeiten, Verantwortungsgrenzen und Mindestnachweise auswählen und begründen.", "rationale": "Architekturrollen verbinden technische Entscheidungen mit Produkt-, Risiko- und Betriebsfolgen."}, "STAFF-TARGET": {"active": true, "scope": "Kompetenzlücken eines Teams sichtbar machen, Lern- und Plattforminvestitionen priorisieren und Erfolg über Arbeitsprodukte messen.", "rationale": "Staff-Wirkung entsteht über andere Teams und dauerhafte technische Entscheidungsqualität."}, "CHIEF-TARGET": {"active": true, "scope": "Ein organisationsweites Kompetenzportfolio, Standards, Ausnahmegrenzen und Nachfolgefähigkeit steuern.", "rationale": "Chief-Verantwortung entscheidet über strategische Fähigkeiten und akzeptierte Risiken, nicht über individuelle Tool-Listen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Tiefe Forschung zu Modelltraining, Carrier-Netzen oder GPU-Kerneloptimierung kann gezielt ergänzt werden.", "rationale": "Diese Spezialgebiete bleiben für die Zielrollen wertvoll, sind aber nicht die Mindesttiefe jeder Architekturentscheidung."}}, "lab_validation": [{"lab_id": "KB-0002-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-14", "environment": "Papier- oder Markdown-Fallstudie mit fiktivem Enterprise-Agentenprodukt und hybrider Plattform", "evidence": "Die vollständige Labanleitung definiert Inputs, Matrix, Gegenproben, Bewertungsraster und Ergebnisartefakte.", "limitations": "Die Fallarbeit wurde nicht als reale Team-Assessment- oder Einstellungsentscheidung durchgeführt."}]}
---
# Rollen-Kompetenz-Matrix

## Zweck, Definition und Scope

Eine Rollen-Kompetenz-Matrix übersetzt vage Rollenbezeichnungen in beobachtbare Fähigkeiten. Sie beantwortet nicht „Bin ich bereits Principal?“ und sie ordnet niemanden durch eine Punktzahl ein. Sie hilft, für ein konkretes Problem die benötigte Tiefe, Entscheidungsreichweite, Nachweise und Lernprioritäten sichtbar zu machen.

Für diese Wissensbasis verbindet die Matrix vier priorisierte Zielrollen: GenAI Solution Architect beziehungsweise GenAI Engineer, Platform und Enterprise Architect sowie Cloud Architect. MLOps und LLMOps sind eine tragende Spezialisierung, aber kein Ersatz für Produkt-, Plattform- oder Sicherheitsverantwortung. Staff, Principal und Chief beschreiben vor allem die Reichweite und Folgen einer Entscheidung, nicht eine standardisierte Titelhierarchie. Unternehmen verwenden diese Titel unterschiedlich; die Matrix benutzt deshalb Arbeitsprodukte und Entscheidungen als Vergleichsgrundlage.

Nach diesem Kapitel kann der Leser:

1. eine Zielrolle in konkrete Kompetenzcluster und nachweisbare Ergebnisse zerlegen;
2. vorhandene eigene Praxisbelege von Konzeptwissen, Labnachweis und Lernziel unterscheiden;
3. für einen Use Case die erforderliche Tiefe als Anwenden, Entwerfen, Standardisieren oder Spezialwissen festlegen;
4. typische Überschneidungen zwischen GenAI-, Plattform-, Enterprise- und Cloud-Rollen sinnvoll verteilen;
5. eine Lücke als konkreten nächsten Nachweis formulieren, statt nur eine Toolliste zu erweitern.

Dieses Kapitel legt weder Stellenprofile eines bestimmten Arbeitgebers fest noch behauptet es, dass ein einzelnes Curriculum automatisch eine Zielrolle verleiht. Die detaillierten Rollenprofile folgen in Domain 01; diese Datei liefert die gemeinsame Messsprache.

## Kompetenzmarker und Evidenz

| Marker | Status | Konkrete Bedeutung |
|---|---|---|
| CURRENT-EVIDENCE | offen | Eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| HANDS-ON-TARGET | aktiv | Eine Matrix wird an Fallstudien mit echten Design- und Gegenprobe-Artefakten angewendet. |
| ARCHITECT-TARGET | aktiv | Rolle, Kontext, NFRs, Sicherheitsgrenzen und Betrieb werden zu einem begründeten Kompetenzprofil verbunden. |
| STAFF-TARGET | aktiv | Teamfähigkeiten, Standards und die Wirkung von Plattforminvestitionen werden gesteuert. |
| CHIEF-TARGET | aktiv | Portfolio, Ausnahmen, Risikoannahme und organisatorische Nachhaltigkeit werden verantwortet. |
| SPECIALIST-OPTIONAL | aktiv | Tiefe ML-, Netzwerk- oder GPU-Spezialisierung wird nur dort verlangt, wo sie die Entscheidung tatsächlich bestimmt. |

Ist-Aussagen führt jeder Lernende in seiner eigenen Selbsteinschätzung (siehe [KB-0004](04-cv-istbild-und-zielkompetenzen.md)). Besonders wichtig ist die Grenze zwischen Konzept und Betrieb: Wer eine AI-Runtime nur als Architekturkonzept entworfen hat, besitzt daraus keinen belastbaren Nachweis einer global betriebenen GPU-Plattform. Der Unterschied schützt die Lernplanung vor Selbstüberschätzung und verhindert, dass sinnvolle Ziele als bereits erledigt markiert werden.

## Mental Model: Vier Achsen statt einer Skill-Liste

Eine Toolliste ist flach: Sie zeigt, dass ein Name bekannt ist, aber nicht ob die Person ein System entwerfen, eine Störung eingrenzen oder eine risikoreiche Ausnahme vertreten kann. Die Matrix verwendet deshalb vier Achsen:

1. **Fähigkeitscluster:** Welcher Mechanismus oder Entscheidungsraum wird behandelt?
2. **Tiefe:** Kann die Person ihn erklären, anwenden, entwerfen, standardisieren oder als Spezialist verändern?
3. **Reichweite:** Betrifft die Handlung ein Feature, ein Team, mehrere Teams oder ein Unternehmensportfolio?
4. **Nachweis:** Gibt es einen begrenzten Erfahrungsclaim, ein reproduzierbares Lab, ein Designartefakt, Betriebsdaten oder eine Reviewentscheidung?

Ein Kompetenzpunkt ist erst aussagekräftig, wenn alle vier Fragen beantwortet sind. „Kubernetes: Design, Teamreichweite, Lab plus ADR“ ist ein überprüfbares Signal. „Kubernetes: fortgeschritten“ nicht.

Die Matrix ist auch kein starres Karrieregitter. Ein Cloud Architect kann bei Identity tief entwerfen und bei Modelltraining nur die Entscheidungsgrenzen verstehen. Ein GenAI Engineer kann in Retrieval und Evaluation tiefer sein als ein Enterprise Architect. Entscheidend ist die Passung zum zu verantwortenden Risiko.

## Prerequisites und Dependencies

Dieses Kapitel benötigt aus [KB-0001](01-master-index-und-wegweiser.md) das Statusmodell, die stabile ID-Konvention und die Regel kanonischer Zuständigkeiten. Es verweist auf spätere Navigationsartikel für die fachlich genaue Ausarbeitung:

| Beziehung | Ziel | Minimal benötigtes Verständnis |
|---|---|---|
| related | [KB-0003](01-master-index-und-wegweiser.md#kb-0003) | harte Voraussetzungen sind nicht dasselbe wie Verwandtschaft. |
| related | [KB-0004](01-master-index-und-wegweiser.md#kb-0004) | Selbsteinschätzung und Evidenzgrenzen: Erfahrungsclaims nach Evidenzart und Grenze behandeln. |
| related | [KB-0005](01-master-index-und-wegweiser.md#kb-0005) | Reichweite und Wirkung von Staff, Principal und Chief. |
| related | [KB-0006](01-master-index-und-wegweiser.md#kb-0006) | Unterschied zwischen Hands-on-Nachweis und Architekturkompetenz. |
| applies | [KB-0267](01-master-index-und-wegweiser.md#kb-0267) | GenAI-Referenzarchitektur als prioritärer Anwendungsraum. |
| applies | [KB-0275](01-master-index-und-wegweiser.md#kb-0275) | Agentenschleifen und Zustandsübergänge als Anwendungsraum. |
| applies | [KB-0305](01-master-index-und-wegweiser.md#kb-0305) | RAG-Pipelines und Grounding. |
| applies | [KB-0368](01-master-index-und-wegweiser.md#kb-0368) | Offline- und Online-Evaluation. |
| applies | [KB-0409](01-master-index-und-wegweiser.md#kb-0409) | Golden Paths und Paved Roads für Plattformadoption. |
| applies | [KB-0462](01-master-index-und-wegweiser.md#kb-0462) | Cloud-Betriebsmodelle und Well-Architected. |
| applies | [KB-0537](01-master-index-und-wegweiser.md#kb-0537) | Threat Modeling und Vertrauensgrenzen. |

Die Ziele sind zum Schreibzeitpunkt teilweise geplant. Die Links führen deshalb auf die stabile Index-ID, nicht auf vorgetäuschte Fachdateien.

## Core Concepts und Mechanismen

### Tiefegrade

| Tiefe | Prüffrage | Geeigneter Nachweis | Typische Fehlannahme |
|---|---|---|---|
| Verstehen | Kann ich den Mechanismus, seine Grenze und ein Fehlersymptom erklären? | Erklärung mit Diagnosehypothese. | Begriffe wiederholen heißt nicht verstehen. |
| Anwenden | Kann ich eine sichere, begrenzte Implementierung bauen und gegenprüfen? | Reproduzierbares Lab mit Fehlerfall. | Ein Happy Path ist kein Betriebsnachweis. |
| Entwerfen | Kann ich Optionen anhand von NFRs, Risiken und Kosten entscheiden? | ADR, C4-Diagramm, Lastmodell, Threat Model. | Ein Diagramm ohne Alternativen ist kein Entwurf. |
| Standardisieren | Kann ich eine wiederholbare Plattformregel mit Ausnahmeweg und Ownership definieren? | Referenzarchitektur, Golden Path, SLO und Adoption-Metrik. | Ein Toolzwang ist noch kein Standard. |
| Spezialwissen | Kann ich einen Engpass oder ein Protokolldetail verändern, das die Architekturgrenze bestimmt? | Benchmark, Patch, Conformance- oder Failure-Analyse. | Spezialtiefe ist nicht automatisch für jede Rolle erforderlich. |

### Kompetenzcluster und Rollenbedarf

Die Buchstaben bedeuten: E = Entwerfen und verantworten, A = sicher anwenden, V = verstehen und gezielt reviewen, S = Spezialtiefe bei passendem Kontext. Sie sind keine Selbsteinstufung, sondern eine Erwartung an die jeweilige Fallarbeit.

| Kompetenzcluster | GenAI Solution Architect / Engineer | Platform / Enterprise Architect | Cloud Architect | LLMOps als Spezialisierung |
|---|---|---|---|---|
| Produkt- und Use-Case-Schnitt | E | E | A | A |
| Modelle, Kontext, Prompt und Retrieval | E | V | V | E |
| Agenten, Tools und Human Gates | E | A | V | E |
| APIs, Events und Domänengrenzen | E | E | A | A |
| Daten, Qualität und Provenance | E | E | A | E |
| Kubernetes, Runtime und IDP | A | E | E | A |
| Cloud-Landing-Zone, Netzwerk und Resilienz | A | E | E | A |
| Identity, Security und Compliance | E | E | E | A |
| Evaluation, Observability und SLOs | E | E | E | E |
| Kosten, Capacity und Build-versus-Buy | E | E | E | E |
| EA, Standards und Portfolio | A | E | A | V |
| Modelltraining, Kernel und Carrier-Netz | V oder S | V | V | S bei Bedarf |

Die Tabelle ist absichtlich nicht als Rangfolge zu lesen. Ein Enterprise Architect muss Agenten nicht wie ein GenAI Engineer implementieren, aber die Grenzen für Datennutzung, Identity, Betriebsmodell und Portfolio erklären können. Ein Cloud Architect muss nicht jede Prompt-Technik beherrschen, aber Netz-, Datenresidenz-, Resilienz- und Kostenfolgen einer AI-Anwendung bewerten.

### Rollenhandshake

Eine gute Architekturübergabe hat fünf Teile:

1. Der GenAI-Verantwortliche beschreibt User Outcome, Modell- und Retrievalgrenzen, Toolrechte und Qualitätsmetrik.
2. Der Platform-Verantwortliche stellt wiederholbare Runtime-, Identity-, Observability- und Deployment-Fähigkeiten bereit.
3. Der Enterprise-Verantwortliche prüft Domänengrenzen, Systemlandschaft, Datenhoheit, Governance und Veränderungsfolgen.
4. Der Cloud-Verantwortliche entscheidet über Landing Zone, Netz, Region, Resilienz, Dienstgrenzen und Kostenmodell.
5. MLOps/LLMOps sorgt für Versionierung, Evals, Freigaben, Monitoring und Rollback.

Kein Teil darf die Sicherheits- oder Betriebsverantwortung allein aus einem Modelloutput ableiten. Die Rollen grenzen Verantwortung ab, sie verschieben sie nicht.

## Architecture und Data Flow

Die Matrix wird wie eine Entscheidungs-Pipeline benutzt:

1. Ein Use Case liefert Nutzergruppe, Geschäftswert, Datenklassen, NFRs und Risikogrenzen.
2. Der Scope wird auf die kanonischen Kapitel und Kompetenzcluster gemappt.
3. Für jedes Cluster wird die niedrigste ausreichende Tiefe ausgewählt.
4. Ein Nachweisplan verbindet belegten Erfahrungsclaim, Lab, Design, Betriebsbeobachtung oder Review.
5. Offene Lücken werden als konkrete Lern- oder Plattformarbeit priorisiert.
6. Nach der Fallarbeit wird die Einstufung anhand der Artefakte aktualisiert, nicht anhand von Selbsteindruck.

Beispielannahme: Ein B2B-Kunde möchte einen Agenten, der Bestellstatus erklärt und Bestand reservieren kann. GenAI braucht Context Assembly, Tool-Schemas und Human Gates. Enterprise Architecture braucht State Machine, ERP/WMS-Integration und Audit. Platform braucht Mandantenisolation, Observability und Deployment. Cloud Architecture braucht regionale Datenhaltung, Private Connectivity, DR und Kostenlimits. LLMOps braucht Evals gegen Fehlreservierung, Prompt- und Toolversionen sowie einen Rollback. Die Matrix verwandelt diese Aufzählung in klare Owner, Nachweise und Reihenfolge.

## Protocols, Standards und Tools

Die Matrix ist technologieagnostisch, weil ein Rollenprofil länger lebt als ein SDK. Sie bindet jedoch Technologieentscheidungen an prüfbare Fähigkeiten:

- OpenAPI, AsyncAPI und Protobuf als API- und Eventverträge;
- OAuth 2.0, OpenID Connect, SCIM und SPIFFE als Identity- und Delegationsgrenzen;
- Kubernetes, OCI, Gateway API und OpenTelemetry als Plattform- und Betriebsbausteine;
- MLflow, Langfuse, Promptfoo oder Phoenix als mögliche Evidenz für Evaluation und Beobachtung;
- MCP und A2A als aktuelle Protokollräume für Tool- und Agenteninteroperabilität.

Ein Toolname erhält nur dann einen Platz in einem Kompetenznachweis, wenn Version, Konfiguration, Gegenprobe und Grenze dokumentiert sind. Ein etwaiger Standard muss außerdem Owner, Ausnahmeweg, Supportmodell, Security Review und Exit enthalten.

## Konfiguration und Implementierung

Für eine konkrete Rolle wird eine Matrixzeile als kleiner Vertrag ausgefüllt:

| Feld | Beispiel für eine sichere Agentenaktion |
|---|---|
| Outcome | Berechtigten Kunden den Bestellstatus erklären, niemals Reservierungen ohne Freigabe ändern. |
| Fachlicher Owner | Commerce- oder Enterprise-Team für State Machine und Invarianten. |
| Technischer Owner | GenAI-Team für Toolauswahl und Evaluation; Platform-Team für Runtime-Controls. |
| Mindesttiefe | GenAI: Entwerfen; Enterprise: Entwerfen; Cloud: Anwenden/Entwerfen für Netz und DR. |
| Nachweis | Tool-Schema, Autorisierungs-Gegenprobe, ADR, Trace, Fehlervarianten und Review. |
| Abbruchbedingung | Fehlende Audience-Prüfung, unklare Idempotenz oder fehlender Audit-Trail. |

Die Matrix wird pro Quartal oder nach einem wichtigen Architekturereignis überprüft. Ein neues Tool löst nicht automatisch eine vollständige Kompetenzumstellung aus. Es wird zuerst gegen vorhandene Fähigkeiten, Migration, Security und Kosten geprüft.

## Scalability, Performance und Reliability

Die Matrix selbst hat keine Laufzeitlast. Ihre Wirkung skaliert aber nur, wenn die Cluster konsistent und klein genug bleiben. Zu viele Detailzeilen erzeugen ein Kompetenzinventar, das niemand pflegt; zu wenige Zeilen verstecken kritische Unterschiede wie „Prompt schreiben“ gegenüber „Toolrechte sicher durchsetzen“.

Reliability bedeutet hier Entscheidungszuverlässigkeit. Häufige Fehlermuster sind:

| Failure Mode | Frühwarnsignal | Schutz |
|---|---|---|
| Titelinflation | Rollenname ersetzt Artefakte. | Nachweis pro Cluster erzwingen. |
| Tool-Proxy | Neues Framework gilt als neue Fähigkeit. | Mechanismus, Gegenprobe und Betriebsfolge dokumentieren. |
| Ein-Person-Abhängigkeit | Nur eine Person kann Plattform- oder Sicherheitsentscheidung erklären. | Pair Review, Referenzartefakt und Wissensübergabe planen. |
| Falsche Tiefe | Spezialtheorie wird gelernt, während Identity oder Evals fehlen. | Risiko- und Use-Case-gewichtete Priorisierung. |
| Claim-Überdehnung | Konzept wird als Betriebserfahrung präsentiert. | Evidenzart und Begrenzung verpflichtend machen. |

## Security, Governance und Observability

Kompetenzdaten können beruflich sensibel sein. Der Matrix stehen daher keine personenbezogenen Punktwerte, unredigierten Performance-Notizen oder Kundeninformationen zu. Sie erfasst nur die minimale Evidenz: Artefakt, Datum, Umfang und Einschränkung. Zugriff auf detaillierte Nachweise gehört zu den Personen, die einen begründeten Bedarf haben.

Governance fragt zusätzlich: Wer entscheidet, dass eine Rolle für eine risikoreiche AI-Funktion ausreichend qualifiziert ist? Die Antwort ist keine Zertifikatsliste. Sie kombiniert Systemrisiko, Gegenprobe, unabhängige Review, Betriebsbereitschaft und klaren Eskalationsweg. Für High-Impact- oder regulierte Systeme müssen die einschlägigen Governance-Artikel die konkrete Rechtsrolle und Jurisdiktion klären.

Die Observability der Matrix misst nicht Menschen, sondern Systemfähigkeit: offene kritische Lücken pro Zielarchitektur, Anteil von Standards mit Owner und Exit, Reviewdurchlaufzeit, Wiederholungsrate von Incidents sowie Evidenzalter bei volatilen Technologien. Eine Ampel ohne verlinkte Artefakte ist nicht beobachtbar.

## Cost, FinOps und Trade-offs

Die wichtigste Kostenfrage lautet: Welche fehlende Fähigkeit erhöht Risiko oder Lieferzeit im nächsten Wertstrom am stärksten? Eine dreitägige Evals-Fallarbeit kann wertvoller sein als ein wochenlanges Spezialtraining, wenn der geplante Agent ohne Qualitätsfreigabe nicht sicher in Produktion gehen darf.

| Alternative | Vorteil | Kosten oder Risiko |
|---|---|---|
| Breites Foundation-Programm | Gemeinsame Sprache und weniger Übergabefehler. | Langsamer Weg zu tiefen Differenzierern. |
| Rollenfokussierte Spezialisierung | Schneller Nutzen in einem Zielbereich. | Silos und blinde Architekturgrenzen. |
| Zertifikatsorientierung | Einfache Nachweisform. | Kann Anwendungs- und Betriebsfähigkeit überzeichnen. |
| Artefaktorientierung | Prüft reale Entscheidungen und Gegenproben. | Höherer Reviewaufwand. |
| Zentraler Plattformstandard | Wiederholbarkeit und Security Gates. | Adoption, Ausnahme- und Exitkosten. |

Eine Chief-Entscheidung finanziert nicht „mehr Schulung“ pauschal, sondern eine begründete Fähigkeit: etwa sichere Tooldelegation, Recovery von Agentenjobs oder FinOps-Transparenz pro Kundenauftrag. Die Wirkung wird über weniger Eskalationen, kürzere sichere Delivery und bessere Auditierbarkeit überprüft.

## Staff-, Principal- und Chief-Entscheidungen

Ein Staff Engineer baut oder verbessert den konkreten Nachweisweg und macht Lücken eines Teams handhabbar. Ein Principal vereinheitlicht Capability Boundaries über Teams hinweg und verhindert, dass jede Produktgruppe ihren eigenen unsicheren Agentenstack oder eigenen Plattformvertrag baut. Ein Chief entscheidet, welche Fähigkeiten strategisch intern aufgebaut, über Partner bezogen oder bewusst nicht angeboten werden.

Bei einer konfliktären Entscheidung gilt: Ein Chief darf eine Ausnahme akzeptieren, aber nicht unsichtbar machen. Die Ausnahme braucht Zweck, Risiko, kompensierende Controls, Owner, Ablaufdatum und Re-Evaluation. Die Matrix zeigt, ob die Organisation diese Ausnahme auch nach einem Personalwechsel noch sicher vertreten kann.

## Production Checklist

- [x] Alle vier priorisierten Zielrichtungen und LLMOps als Spezialisierung sind getrennt beschrieben.
- [x] Die Matrix verlangt für jeden Erfahrungsclaim Evidenzart und Grenze.
- [x] Tiefe, Reichweite und Nachweise sind von Toollisten getrennt.
- [x] Das durchgängige Commerce-Agentenbeispiel verbindet Architektur, Betrieb und Sicherheit.
- [x] Der Innovationsabschnitt nennt Standdatum, Reifegrad und Pilotkriterium.
- [ ] Die Fallarbeit aus dem Lab wurde nicht als echte Teamentscheidung ausgeführt.
- [ ] Unabhängige technische Prüfung und Annahme stehen noch aus.

## Interviewfragen mit Antwortleitfäden

1. **Woran erkennen Sie, dass jemand für eine GenAI-Architekturentscheidung bereit ist?**  
   Erwartet werden Use-Case- und Datenklassifikation, Eval- und Rollbackplan, Toolrechte, Threat Model und Betriebskriterien. Prompt-Beispiele allein reichen nicht.

2. **Wie unterscheiden Sie Platform Architect und Enterprise Architect?**  
   Platform Architecture liefert wiederholbare technische Fähigkeiten für interne Nutzer. Enterprise Architecture verantwortet zusätzlich Capability-, Portfolio-, Prozess- und Governance-Grenzen. Beide müssen die Übergabe explizit machen.

3. **Warum ist LLMOps keine isolierte Toolrolle?**  
   Evals, Versionierung und Monitoring tragen nur dann, wenn Produktziel, Daten, Security, Runtime und Kostenmodell mitentschieden werden.

4. **Wie bewerten Sie einen Erfahrungsclaim zu einem Framework?**  
   Nach Projekt, Zeitraum, Evidenzart, konkretem Umfang und Begrenzung. Eine bloße Nennung bleibt Kontext, keine umfassende Erfahrung.

5. **Wann verlangen Sie Spezialtiefe bei GPUs oder Netzwerken?**  
   Wenn sie den Engpass, die Sicherheitsgrenze oder die ökonomische Entscheidung bestimmen. Sonst ist fundiertes Architekturverständnis mit klarer Eskalation ausreichend.

6. **Wie verhindern Sie Skill-Matrizen als Performance-Ranking?**  
   Sie bewerten nachweisbare Systemfähigkeit und Lernpriorität, nicht Personenwert. Zugriff, Zweckbindung und Artefaktlinks werden begrenzt.

## Praktisches Lab: Kompetenzplan für zwei Architekturentscheidungen

**Fall A.** Entwirf eine sichere B2B-Agentenfunktion, die Bestellstatus erklärt und Reservierungen vorbereitet. **Fall B.** Entwirf eine hybride AI-Plattform, die zwei Produktteams Modelle, Retrieval und Observability als Service anbietet.

1. Notiere für beide Fälle Outcome, Nutzergruppe, Datenklassen, NFRs, Budgetannahme und schlimmsten Fehlpfad.
2. Wähle aus der Matrix pro Cluster die kleinste ausreichende Tiefe für GenAI, Platform, Enterprise, Cloud und LLMOps.
3. Erzeuge fünf Artefakte: Kontextdiagramm, ADR, Threat Model, Evalplan und Betriebscheckliste.
4. Formuliere je Fall zwei Gegenproben. Beispiel: falsche Token-Audience darf keine Reservierung auslösen; ein nicht erreichbarer Modellanbieter darf kein unkontrolliertes Tool-Fallback erzeugen.
5. Ordne eigene belegte Erfahrungsclaims aus der Selbsteinschätzung nur dort zu, wo Evidenztyp und Umfang passen. Jede Lücke wird als Lab, Designreview oder Fachkapitel-ID dokumentiert.
6. Beende die Fallarbeit mit einer Entscheidung: intern aufbauen, Plattformservice nutzen oder Scope reduzieren. Begründe Kosten, Exit und Risiko.

**Erwartetes Ergebnis.** Es entsteht kein Karriere-Ranking, sondern ein überprüfbarer Kompetenz- und Artefaktplan. **Labstatus:** reviewed_only. Die Anleitung wurde fachlich geprüft, aber nicht als reale Einstellungs- oder Teamentscheidung ausgeführt.

## Dependencies, Cross-References und Quellen

Die Basisnavigation liegt in [KB-0001](01-master-index-und-wegweiser.md). Die folgenden Kapitel vertiefen Evidenz, Kompetenzmodell, Lernnachweise und Zielrollen: [KB-0003](01-master-index-und-wegweiser.md#kb-0003), [KB-0004](01-master-index-und-wegweiser.md#kb-0004), [KB-0005](01-master-index-und-wegweiser.md#kb-0005), [KB-0006](01-master-index-und-wegweiser.md#kb-0006) sowie Domain 01 ab [KB-0011](01-master-index-und-wegweiser.md#kb-0011).

**Verwendete Quellen, Stand 2026-09-14.**

- Masterplan: Rollenprioritäten und Domainmodell
- Artikelvertrag: Kompetenzmarker, Labs und Review
- [MCP-Spezifikation 2026-07-28](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
- [A2A-Protokollspezifikation 1.0](https://a2a-protocol.org/dev/specification/)

## Bonus: New Tech and Innovations

**Stand: 2026-09-14.** Rollenprofile für AI-Architektur müssen heute die Interoperabilität und Governance von Tool- und Agentensystemen stärker berücksichtigen. Die MCP-Spezifikation vom 2026-07-28 beschreibt einen zustandslosen Kern, Erweiterungen und eine härtere Autorisierungsrichtung; die A2A-Spezifikation führt eine normative Protobuf-Grundlage, Versionierung und mehrere Bindings für die Zusammenarbeit unabhängiger Agenten. Beide Entwicklungen machen aus einer reinen Prompt- oder Modellkompetenz keine ausreichende Produktionskompetenz. Sie erhöhen den Bedarf an klarer Identity, Vertragstests, Version-Migration, Observability und humaner Freigabe.

Der Reifegrad ist **Adopting**: Die Protokolle sind konkrete, dokumentierte Standards, aber ihre Kompatibilität und Betriebsfolgen müssen je SDK, Gateway, Identity Provider und Mandantenmodell geprüft werden. Ein Pilot-Abnahmekriterium lautet: Ein Agent kann eine bekannte Tool- oder Agentenaktion über eine festgelegte Protokollversion ausführen, eine falsche Berechtigung wird nachweisbar abgewiesen, und Trace sowie Auditrecord lassen sich einer verantwortlichen Rolle zuordnen. Rollen sollen daher nicht „MCP- oder A2A-Erfahrung“ als Abzeichen führen, sondern den Nachweis sicherer Einführung und kontrollierter Migration.
