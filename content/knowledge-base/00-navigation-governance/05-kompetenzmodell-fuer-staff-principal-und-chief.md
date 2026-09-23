---
{"id": "KB-0005", "title": "Kompetenzmodell für Staff, Principal und Chief", "domain": "00", "sequence": 5, "document_type": "navigation", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-14", "technical_reviewed_at": null, "research_cutoff": "2026-09-14", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0002", "concepts": ["Kompetenzcluster", "Tiefenstufen", "Nachweisarten"], "needed_for": "understanding"}, {"id": "KB-0004", "concepts": ["Evidenzarten", "zulässige Aussagen", "Kompetenzlücken"], "needed_for": "understanding"}], "related": ["KB-0001", "KB-0003", "KB-0006", "KB-0007", "KB-0009", "KB-0011", "KB-0012", "KB-0013", "KB-0014", "KB-0015", "KB-0016", "KB-0720"], "applies": ["KB-0011", "KB-0012", "KB-0013", "KB-0014", "KB-0015", "KB-0016"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eigene Labs müssen einen Mechanismus, eine Gegenprobe, Messwerte und den Rückbau oder die Folgen des Fehlers zeigen.", "rationale": "Hands-on-Kompetenz ist die Grundlage, um Architekturgrenzen realistisch zu beurteilen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Architekturkompetenz verbindet fachliche Ziele, Qualitätsattribute, Randbedingungen, Trade-offs und eine nachvollziehbare Entscheidung.", "rationale": "Ein Diagramm ohne begründete Entscheidung, Risiko und Betriebspfad reicht nicht als Architekturbeleg."}, "STAFF-TARGET": {"active": true, "scope": "Staff-Wirkung verbessert den Entscheidungs- und Lieferweg mehrerer Menschen oder Teams durch Standards, Referenzartefakte und Coaching.", "rationale": "Die Reichweite zeigt sich in wiederholbarer Wirkung außerhalb einer einzelnen Implementierung."}, "CHIEF-TARGET": {"active": true, "scope": "Chief-Wirkung steuert ein strategisches Capability- und Risikoprofil mit expliziten Investment-, Standard-, Ausnahme- und Exitentscheidungen.", "rationale": "Die höchste Ebene verantwortet organisationale Folgen und überprüfbare Leitplanken, nicht nur technische Präferenz."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Tiefes Spezialwissen wird nur für Engpässe, regulatorische Grenzen oder kritische Plattformkomponenten geplant und mit klarer Eskalation verbunden.", "rationale": "Eine breite Architekturrolle braucht ausreichende Tiefe und gute Schnittstellen zu Spezialisten, nicht jede Spezialtiefe selbst."}}, "lab_validation": [{"lab_id": "KB-0005-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-14", "environment": "Fiktiver, datenarmer Entscheidungsfall für einen B2B-Agenten und eine gemeinsame AI-Plattform", "evidence": "Die Fallarbeit enthält Wirkungshypothese, Kompetenzgrenzen, Artefakte, Gegenproben, Reviewpfad und Abbruchkriterien.", "limitations": "Keine reale Personalbewertung, Teamentscheidung oder Produktionsplattform wurde durchgeführt."}]}
---
# Kompetenzmodell für Staff, Principal und Chief

## Zweck, Definition und Scope

Dieses Kapitel übersetzt die Worte Staff, Principal und Chief in beobachtbare technische Wirkung. Es ist weder eine Gehalts- noch eine Titelmatrix und bewertet keinen Personenwert. Sein Zweck ist, für einen konkreten Wertstrom zu entscheiden, welche Fähigkeiten wirklich nötig sind, wie sie belegt werden und wo eine Rolle einen Spezialisten, einen Owner oder eine organisatorische Entscheidung einbinden muss.

Kompetenz besteht aus vier miteinander verbundenen Teilen: einem tragfähigen mentalen Modell, der Fähigkeit zu handeln, der Fähigkeit unter Randbedingungen zu entscheiden und einem überprüfbaren Ergebnis. Eine Person kann eine Technologie erklären, ohne sie sicher betreiben zu können. Sie kann einen Dienst implementieren, ohne seine organisationsweite Standardisierung verantworten zu können. Und sie kann eine Architekturentscheidung aufschreiben, ohne die Fähigkeit aufgebaut zu haben, die sie später betreibt. Das Modell hält diese Unterschiede sichtbar.

Nach diesem Kapitel kann der Leser:

1. Kompetenz von Titel, Seniorität, Zertifikat, Toolnennung und bloßem Output unterscheiden;
2. Hands-on-, Architektur-, Staff-, Principal- und Chief-Wirkung für einen konkreten Use Case abgrenzen;
3. einen Nachweisplan aus Labor, ADR, Review, Betriebsbeobachtung und Wirkungsmessung zusammensetzen;
4. die kleinste ausreichende Spezialtiefe bestimmen und einen verantwortlichen Eskalationspfad festlegen;
5. Capability-Lücken als investierbare Risiken statt als unscharfe Selbstbeschreibung kommunizieren;
6. ein Kompetenzportfolio aufbauen, das die eigene Selbsteinschätzung ergänzt, aber nicht über deren belegte Aussagen hinausgeht.

Dieses Modell ersetzt kein technisches Interview, keine unabhängige Referenz, keine Sicherheitsfreigabe und keine Organisationsentscheidung. Es macht jedoch transparent, welche dieser Prüfungen bei welcher Risikoklasse noch fehlen.

## Kompetenzmarker und Evidenzgrenzen

| Marker | Status | Konkrete Bedeutung in diesem Kapitel |
|---|---|---|
| CURRENT-EVIDENCE | offen | Eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| HANDS-ON-TARGET | aktiv | Mechanismen werden mit reproduzierbaren Artefakten, Fehlpfad und Aufräumweg geübt. |
| ARCHITECT-TARGET | aktiv | Entscheidungen binden Ziel, Qualitätsattribute, Grenze, Alternativen und Betriebsfolgen zusammen. |
| STAFF-TARGET | aktiv | Referenzpfade, Standards und Coaching erhöhen die Handlungsfähigkeit mehrerer Teams. |
| CHIEF-TARGET | aktiv | Capability-Investments, Risikoappetit, Ausnahmeverfahren und Exit werden auf Organisationsebene entschieden. |
| SPECIALIST-OPTIONAL | aktiv | Tiefe Spezialistenarbeit wird gezielt für kritische Engpässe geplant und nicht als Pflichtwissen für jedes Thema ausgegeben. |

### Drei getrennte Aussageebenen

| Ebene | Zulässige Formulierung | Unzulässige Verkürzung | Benötigter Beleg |
|---|---|---|---|
| Projekterfahrung | „Im beschriebenen Projekt wurde X entwickelt, konzipiert oder integriert.“ | „Damit ist jede Betriebs- und Führungsfrage zu X gelöst.“ | Begrenzter Erfahrungsclaim mit Quelle, Zeitraum, Evidenzart und Grenze. |
| Fachliche Kompetenz | „Der Mechanismus, Fehlpfad und Trade-off lassen sich in einer abgegrenzten Umgebung erklären und zeigen.“ | „Eine Demo beweist produktionsreife Kompetenz.“ | Lab, Test, Messung, Gegenprobe und Reflexion. |
| Rollenwirkung | „Die Person oder Gruppe hat den wiederholbaren Entscheidungs- oder Lieferweg für andere verbessert.“ | „Ein Senior-Titel beweist organisationsweite Wirkung.“ | Referenzartefakt, Adoption, Review, Outcome und Grenzen. |

Der gleiche Mechanismus kann auf mehreren Ebenen vorkommen. Ein Entwickler implementiert zum Beispiel einen Policy Check. Ein Architect bestimmt, an welcher Vertrauensgrenze er erzwungen wird. Ein Staff Engineer macht daraus eine referenzierte Bibliothek, Teststrategie und Migrationshilfe. Ein Principal reduziert Varianten über mehrere Domänen und klärt Ownership. Ein Chief entscheidet, ob die Organisation diese Kontrolle als verbindlichen Standard finanziert, wie Ausnahmen behandelt werden und welche Risiken bewusst nicht akzeptiert werden.

## Mental Model: Kompetenz als Wirkungskette

Das Arbeitsmodell lautet:

Fachliches Ziel → Risiko und Qualitätsattribut → Mechanismus → Handlung → Artefakt und Gegenprobe → Review → beobachtete Wirkung → erneute Entscheidung.

Jede Kette muss an der Stelle enden, an der ihre Aussage noch wahr ist. Ein Architekturdiagramm kann eine Annahme kommunizieren. Es beweist weder Latenz noch Recovery. Ein Lasttest kann eine Metrik in seiner Testumgebung belegen. Er beweist weder Kosten bei anderer Nachfrage noch eine sichere Datenklassifikation. Eine freigegebene Plattformvorgabe kann Verhalten vereinheitlichen. Sie beweist nicht, dass Teams sie korrekt integrieren. Deshalb braucht jede Kompetenzbehauptung einen Umfang, einen Fehlerfall und einen nächsten Prüfpunkt.

Für die vier priorisierten Zielrichtungen entsteht eine gemeinsame, aber unterschiedlich gewichtete Wirkungskette:

| Zielrichtung | Primäre Wirkung | Typische Kompetenzgrenze | Mindestnachweis |
|---|---|---|---|
| GenAI Solution Architect und GenAI Engineer | Nützliche, kontrollierbare Modell- und Toolfunktion für einen Fachprozess. | Modelloutput darf keine Autorisierung, Wahrheit oder Zustandsinvariante ersetzen. | Evalplan, Toolvertrag, Human Gate, Trace und Fehlantwort-Gegenprobe. |
| Platform Architect | Wiederholbare Selbstbedienung mit sicheren Defaults für interne Produktteams. | Plattform liefert Fähigkeiten; sie übernimmt nicht unbemerkt jedes Produkt-Ownership. | Golden Path, SLO, Betriebsmodell, Adoptionmessung und Ausnahmeweg. |
| Enterprise Architect | Fähigkeits-, Daten-, Prozess- und Portfolioentscheidungen über Lösungsgrenzen hinweg. | Ein Zielbild darf operative Zwänge und lokale Verantwortung nicht überrollen. | Capability Map, Zielbild, Entscheidungslog, Roadmap, Governance und Wertmessung. |
| Cloud Architect | Workload-Platzierung mit Security, Netzwerk, Resilienz und wirtschaftlicher Kontrolle. | Ein Cloudservice ist keine automatische Compliance- oder Verfügbarkeitsgarantie. | Kontextdiagramm, Landing-Zone-Annahmen, DR-Testplan, Kostenmodell und Exit. |
| MLOps und LLMOps als Spezialisierung | Reproduzierbare Qualität, Versionierung, Beobachtbarkeit und sichere Freigabe. | Evals sind kein Ersatz für Produkt-, Security- oder Betriebsverantwortung. | Dataset- und Promptversion, Suiten, Schwellenwerte, Rollback und Driftbeobachtung. |

## Prerequisites und Dependencies

Dieses Kapitel setzt die Rollen-Kompetenz-Matrix aus [KB-0002](02-rollen-kompetenz-matrix.md) und die Evidenzgrenzen aus [KB-0004](04-cv-istbild-und-zielkompetenzen.md) voraus. KB-0002 definiert die Cluster und Tiefenstufen; dieses Kapitel erklärt, wie daraus ein belastbarer Kompetenznachweis und eine organisationsweite Wirkung entstehen. KB-0004 verhindert, dass vorhandener Projektkontext überdehnt wird.

| Beziehung | Datei | Einsatz |
|---|---|---|
| Navigation | [KB-0001](01-master-index-und-wegweiser.md) | ID-System, Status und Auffinden von Nachbarartikeln. |
| Graph und Reihenfolge | [KB-0003](03-vollstaendiger-abhaengigkeitsgraph.md) | Abhängigkeiten und spätere Härtung von Lernpfaden. |
| Nachweistiefe | [KB-0006](01-master-index-und-wegweiser.md#kb-0006) | Unterschied zwischen Labor-, Architektur- und Governance-Artefakt. |
| Lernsteuerung | [KB-0007](01-master-index-und-wegweiser.md#kb-0007) und [KB-0009](01-master-index-und-wegweiser.md#kb-0009) | Lernsystem, Labstrategie und Beweisartefakte. |
| Zielrollen | [KB-0011](01-master-index-und-wegweiser.md#kb-0011) bis [KB-0016](01-master-index-und-wegweiser.md#kb-0016) | Konkretisierung für GenAI, Plattform, Enterprise und Cloud. |
| Langfristiges Portfolio | [KB-0720](01-master-index-und-wegweiser.md#kb-0720) | Reifemodell und Portfolioevidenz. |

## Core Concepts: Tiefe, Reichweite, Unsicherheit und Hebel

### Tiefe ist nicht Reichweite

Technische Tiefe beantwortet, ob ein Mechanismus korrekt modelliert, implementiert, gemessen und bei Fehlern behandelt werden kann. Reichweite beantwortet, wer von einer Entscheidung betroffen ist und ob sie für diese Menschen verständlich, betreibbar und reversibel bleibt. Beide Achsen sind unabhängig.

| Beispiel | Tiefe | Reichweite | Angemessene Aussage |
|---|---|---|---|
| Ein Team implementiert OIDC-Token-Prüfung für eine API. | Token, Issuer, Audience, Key Rotation, Fehlercodes. | Ein Service oder Produktbereich. | Hands-on- und Architekturkompetenz für den abgegrenzten Vertrag. |
| Mehrere Teams verwenden eine gemeinsame Auth-Middleware. | Zusätzlich Versionierung, Kompatibilität, Migration und Support. | Mehrere Produktteams. | Staff-Wirkung, wenn der sichere Default nachweisbar übernommen wird. |
| Die Organisation standardisiert Workload Identity. | Zusätzlich Geschäftsrisiko, Lieferantenbindung, Ausnahmeweg und Audit. | Plattformen, Produkte und Partner. | Principal- oder Chief-Entscheidung abhängig vom Mandat und Portfolio. |

Eine Rolle mit großer Reichweite benötigt weiterhin genug Tiefe, um Sicherheits- und Betriebsfolgen zu erkennen. Sie muss aber nicht Kernel, GPU-Firmware oder BGP-Routing selbst implementieren, wenn die Entscheidung klar begrenzt ist, ein Spezialist verantwortlich eingebunden wird und die Abnahmekriterien verständlich bleiben.

### Wiederholbarkeit ist der Multiplikator

Eine einmal gelöste Aufgabe kann wertvoll sein, wird aber erst zu Staff- oder Principal-Wirkung, wenn andere Menschen sie sicher wiederholen können. Der Multiplikator besteht aus einem brauchbaren Interface, einem klaren Owner, einer dokumentierten Entscheidungsgrenze, einem Test- oder Reviewpfad und einem Weg zurück.

Ein Golden Path ist daher kein hübsches Referenzrepository. Er ist ein produktähnlicher Vertrag: Wer darf ihn nutzen, welche sicheren Defaults gelten, was wird gemessen, welches Verhalten ist nicht abgedeckt, wie kann eine Ausnahme beantragt werden und wer trägt die Supportkosten? Fehlen diese Teile, entsteht ein informeller Standard mit versteckter Ein-Person-Abhängigkeit.

### Unsicherheit ist eine Kompetenzdimension

In unsicheren Situationen besteht gute Kompetenz nicht aus maximaler Gewissheit, sondern aus sauberer Eingrenzung. Bei einer RAG-Antwort kann die Unsicherheit aus der Quelle, der Retrievalabdeckung, dem Modellverhalten, der Berechtigung oder einer zeitlichen Änderung stammen. Ein kompetenter Entwurf benennt diese Kategorien, misst die relevante davon und verweigert eine Aktion, wenn eine kritische Annahme nicht erfüllt ist.

Die gleiche Regel gilt für Karriere- und Rollenclaims. „Nicht belegt“ heißt nicht „unfähig“. Es heißt nur: Für diese spezifische Behauptung gibt es noch kein belastbares Artefakt. Der nächste Nachweis wird als Lernziel geplant, statt die Lücke sprachlich zu verdecken.

### Hebel braucht Nutznießer und Messung

Eine Chief- oder Staff-Entscheidung ist nicht automatisch wirksam, weil sie in einem Architekturboard getroffen wurde. Sie braucht eine Wirkungshypothese: Wer kann dadurch schneller, sicherer oder wirtschaftlicher handeln? Welche Nebenwirkung wird akzeptiert? Welche Kennzahl oder qualitative Beobachtung zeigt, ob der Hebel tatsächlich wirkt? Wie wird die Entscheidung zurückgenommen?

Beispielannahme: Ein internes AI-Platform-Team führt eine zentrale Tool-Gateway-Schicht ein. Die Wirkungshypothese lautet: Produktteams erhalten vorgeprüfte Toolverträge, eine einheitliche Delegationskontrolle und nachvollziehbare Auditspuren, wodurch die Zeit bis zu einer kontrollierten Pilotfreigabe sinkt. Messen lassen sich Onboardingzeit, Anzahl wiederverwendeter Verträge, verweigerte Rechteverletzungen, Reviewdauer und Ausnahmequote. Die Gegenhypothese lautet: Ein Gateway kann Latenz, zentrale Störung und Plattformwarteschlangen erhöhen. Diese Folgen gehören in die Entscheidung.

## Kompetenzmodell nach Nachweisart

| Nachweisart | Kernfrage | Typisches Artefakt | Gegenprobe | Reifegrenze |
|---|---|---|---|---|
| Mechanismus-Lab | Kann der Mechanismus in klarer Umgebung reproduziert und erklärt werden? | Code, Konfiguration, Messprotokoll, Diagramm. | Falscher Parameter, abgelaufenes Token, doppeltes Event oder Ausfall. | Kein Produktionsclaim ohne reale Betriebsgrenzen. |
| Architekturfall | Wurde unter konkurrierenden NFRs eine begründete Wahl getroffen? | ADR, Kontext- und Datenflussdiagramm, Risikoanalyse. | Alternative mit anderem Kosten-, Sicherheits- oder Verfügbarkeitsprofil. | Kein Beleg für Adoption ohne Umsetzung und Review. |
| Referenzimplementierung | Können andere Teams den Pfad sicher einsetzen? | Template, API-Vertrag, Policy, Testkit, Migration. | Neueinführung durch ein anderes Team, Kompatibilitäts- oder Rechtefehler. | Kein Organisationsstandard ohne Owner und Ausnahmeweg. |
| Betriebsnachweis | Verhalten sich SLO, Alarmierung und Recovery wie beabsichtigt? | Dashboard, Runbook, Incident-Übung, Restore-Protokoll. | Teil- oder Komplettausfall, Lastanstieg, Datenfehler, Rollback. | Testumgebung und Produktion strikt unterscheiden. |
| Governance-Entscheidung | Sind Risiko, Mandat, Ausnahme und Rechenschaft klar? | Entscheidungsprotokoll, Standard, RACI, Kontrollnachweis. | Ausnahme beantragen, Ablauf prüfen, Auditfrage oder Mandatswechsel. | Kein Compliance-Versprechen ohne anwendbare Regelprüfung. |
| Wirkungsmessung | Verbessert die Fähigkeit eine reale Delivery- oder Risikokenngröße? | Baseline, Metrikdefinition, Auswertung, Feedback. | Vergleich mit Baseline, Rückgang der Adoption oder Nebenwirkung. | Korrelation nicht als alleinige Kausalität ausgeben. |

### Der Kompetenzcanvas

Für jeden priorisierten Themenbereich genügt eine kompakte Seite mit den folgenden Feldern:

| Feld | Frage | Beispiel für einen kontrollierten Commerce-Agenten |
|---|---|---|
| Geschäftlicher Outcome | Welches Ergebnis für wen? | Berechtigte B2B-Kunden erhalten Status und eine vorbereitete, prüfbare Reservierungsanfrage. |
| Nicht verhandelbare Invariante | Was darf niemals passieren? | Kein Modelloutput darf Bestand ohne fachliche Prüfung oder Idempotenzschlüssel ändern. |
| Technikmechanismus | Was erzwingt die Grenze? | Toolvertrag, Audience-Prüfung, fachlicher Command Handler, Audit Event und Human Gate. |
| Qualitätsattribute | Was wird gemessen? | Autorisierungsfehler, Fehlreservierung, Toollatenz, Traceabdeckung, Kosten pro erfolgreicher Anfrage. |
| Kompetenzlücke | Was ist noch unklar oder unbelegt? | Recovery bei ERP-Timeout und semantische Eval gegen irreführende Bestandsantworten. |
| Nächster Nachweis | Was reduziert diese Unsicherheit? | Contract Test plus Timeout-Gegenprobe, ADR und beobachtbares Sandbox-Runbook. |
| Owner und Eskalation | Wer entscheidet an der Grenze? | Commerce für Invariante, GenAI für Orchestrierung, Platform für Gateway, Security für Delegation. |

Der Canvas verhindert zwei Fehler: Ein Kompetenzplan wird nicht zur endlosen Technologiesammlung, und ein Rollenprofil wird nicht zu einer unsichtbaren Sammelverantwortung ohne Owner.

## Architektur und Data Flow: Von einer Lücke zu organisationaler Fähigkeit

Eine Capability entsteht in sechs Stufen:

1. Ein Wertstrom oder Risiko erzeugt einen konkreten Bedarf.
2. Die Rolle zerlegt den Bedarf in Outcome, Invariante, technische Mechanismen und Qualitätsattribute.
3. Der Iststand wird mit begrenzten Erfahrungsclaims aus der Selbsteinschätzung und vorhandenen Artefakten abgeglichen.
4. Fehlende Tiefe wird als Lab oder Architekturfall umgesetzt; fehlende Reichweite als Referenzpfad, Review oder Standard.
5. Ein Nutzerteam oder Stakeholder prüft den Pfad anhand einer Gegenprobe und einer Wirkungsmessung.
6. Die Entscheidung wird bestätigt, geändert, abgelöst oder beendet; Artefakte und Lernstand werden aktualisiert.

Als textuelles Datenflussbild:

Bedarf und Risiko → Capability Canvas → Kompetenz- und Evidenzlücke → Lern- oder Referenzartefakt → kontrollierte Anwendung → Telemetrie und Review → Portfolioentscheidung → Standard, Ausnahme oder Rückbau.

### Beispiel: Gemeinsame AI-Plattform für zwei Produktteams

Die folgende Situation ist eine Beispielannahme, keine Aussage über ein reales Projekt. Zwei Produktteams wollen Retrieval, Modellzugriff und Toolausführung nutzen. Team A verarbeitet interne Wissensdokumente; Team B erstellt vorbereitete Commerce-Aktionen. Die gemeinsame Plattform soll nicht jede Produktlogik zentralisieren.

| Schicht | Verantwortlicher Kompetenzbeitrag | Entscheidung und Beleg |
|---|---|---|
| Produkt und Fachlogik | GenAI Engineer und Domänenteam | Definiert Task, verbotene Aktionen, Evalfälle und fachliche Abnahme. |
| Agenten- und Toolgrenze | GenAI Solution Architect, Security und Platform | Modell wählt Vorschlag; deterministischer Gateway erzwingt Identität, Scopes, Schema und Rate Limits. |
| Plattformfähigkeit | Platform Architect und Staff Engineers | Standardisierte Runtime, Telemetrie, Secret-Referenzen, Mandantengrenzen, Quotas und Onboardingpfad. |
| Daten und Integration | Enterprise Architect und Domänenowner | Datenklassifikation, System of Record, Retention, Event- und API-Verträge, Ownership. |
| Cloud und Resilienz | Cloud Architect und SRE | Platzierung, Netzwerkpfad, Schlüsselverwaltung, Wiederanlauf, Kostenbudgets und DR-Annahmen. |
| Qualität und Freigabe | LLMOps-Spezialist plus Produktowner | Dataset- und Promptversion, Evalschwelle, Trace-Sampling, Rückfallmodus und Change Gate. |
| Portfolio und Risiko | Principal oder Chief mit Mandat | Investitionsgrenze, Providerstrategie, verbindliche Controls, Ausnahmeprozess und Exitoption. |

Der Wert einer Kompetenzmatrix besteht darin, dass kein einzelnes Rollenlabel alle Zellen verdeckt. Die Person, die einen Prompt evaluiert, kann kompetent handeln, ohne allein für ERP-Invarianten verantwortlich zu sein. Die Person, die eine Plattform standardisiert, muss den Produktteams kein Fachmodell aufzwingen. Chief-Entscheidungen bleiben überprüfbar, weil sie auf konkrete Ownership, Kenngrößen und Abbruchbedingungen zurückverweisen.

## Protokolle, Standards und Werkzeuge

Das Kompetenzmodell bindet sich nicht an ein bestimmtes Framework. Es braucht dennoch stabile technische Berührungspunkte, weil Kompetenz nur an realen Verträgen und Betriebsgrenzen sichtbar wird.

| Bereich | Geeignete technische Bezugspunkte | Was ein Nachweis zeigen sollte |
|---|---|---|
| API und Eventvertrag | OpenAPI, AsyncAPI, JSON Schema, Protobuf, CloudEvents. | Versionierung, Fehlerschema, Idempotenz, Kompatibilität und Consumer-Gegenprobe. |
| Identität und Delegation | OAuth 2.0, OpenID Connect, mTLS, SPIFFE/SPIRE, SCIM. | Issuer- und Audience-Prüfung, Scopes, Schlüsselrotation, Tokenablauf und Audit. |
| Plattform und Delivery | OCI, Kubernetes, Helm, GitOps, Gateway API, Policy Engines. | Reproduzierbare Bereitstellung, sichere Defaults, Rollback, Tenantgrenze und Supportweg. |
| Beobachtbarkeit | OpenTelemetry, Metriken, Logs, Traces, SLOs und Fehlerbudgets. | Korrelation über Service- und Toolgrenzen, Datenschutz, Alarmierung und Diagnosezeit. |
| AI- und Agenteninteroperabilität | Modell-APIs, Tool-Schemas, MCP- oder A2A-nahe Verträge, Evalformate. | Versionierte Verträge, Autorisierungsgrenze, deterministische Durchsetzung, Trace und Fallback. |
| Nachweisintegrität | Git, signierte Releases, CI-Reports, reproduzierbare Benchmarks und optional Verifiable Credentials. | Zuordenbares Artefakt, Kontext, Änderungshistorie und Begrenzung der Aussage. |

Ein Standardname ersetzt keine Kompetenz. Wer beispielsweise OpenTelemetry nennt, sollte erklären können, welche Attribute personenbezogen oder sensibel sind, wie Sampling Kosten und Diagnose beeinflusst und wie Trace-IDs eine Toolaktion mit dem fachlichen Audit Event verbinden. Wer Kubernetes nennt, sollte seine relevante Tiefe klar abgrenzen: Workload-Konfiguration, Plattform-Policy, Clusterbetrieb oder Spezialthema wie CNI- und Kernel-Debugging.

## Konfiguration und Implementierung: Ein evidenzfähiger Entscheidungspfad

Die folgende Vorlage ist absichtlich technologieoffen. Sie kann als Markdown, Issue-Vorlage oder Architektur-Repository gepflegt werden.

| Abschnitt | Mindestinhalt | Qualitätsfrage |
|---|---|---|
| Kontext | Nutzer, Outcome, Datenklasse, fachlicher Owner, Zeitpunkt der Entscheidung. | Ist klar, für wen und wofür die Fähigkeit existiert? |
| Grenze | Nicht erlaubte Aktion, Risikoappetit, NFR und Auslöser für Eskalation. | Welche falsche Annahme wäre besonders schädlich? |
| Mechanismus | Komponenten, Verträge, Identity, Datenfluss und deterministische Kontrollen. | Welche Komponente erzwingt die Regel tatsächlich? |
| Alternativen | Mindestens eine realistische Alternative mit Konsequenzen. | Warum ist diese Wahl unter den Randbedingungen angemessen? |
| Evidenz | Eigener Erfahrungsclaim nur wenn passend; Lab, ADR, Test, Dashboard, Review oder Incident-Übung. | Was beweist die Aussage, was beweist es nicht? |
| Gegenprobe | Ein Fehlpfad, der die zentrale Behauptung attackiert. | Kann der Happy Path scheitern, ohne dass die Messung es bemerkt? |
| Betrieb | SLO, Alarm, Runbook, Backup oder Fallback, Owner und Supportmodell. | Wer handelt um 03:00 Uhr und mit welchen Informationen? |
| Kosten und Exit | Verbrauchstreiber, Budgetgrenze, Wechselkosten und Rückbau. | Welche Kosten entstehen, wenn der Pfad weithin übernommen wird? |
| Review | Prüfer, Entscheidung, offene Punkte, Ablaufdatum. | Wann muss die Annahme erneut geprüft werden? |

### Minimaler Beispielablauf für einen Architekturclaim

1. Formuliere eine begrenzte Behauptung: „Ein Agent darf Reservierungen nur über einen fachlichen Command Handler vorbereiten; der Handler prüft delegierte Identität und Idempotenz.“
2. Zeichne Daten- und Vertrauensgrenzen: Nutzer, Agent Runtime, Gateway, Identity Provider, Commerce Service, Eventlog und Operator.
3. Implementiere oder simuliere einen Vertragstest mit einer erfolgreichen Anfrage und mindestens drei Gegenproben: falsche Audience, abgelaufenes Delegationstoken und wiederholte Request-ID.
4. Protokolliere erwartete und beobachtete Ergebnisse. Ein abgewiesener Request braucht einen sicheren Fehlercode, darf aber keine Secrets oder unnötigen Kundendaten in Logs schreiben.
5. Schreibe ein ADR: Warum Command Handler statt direkter Datenbankmutation? Welche Latenz- und Verfügbarkeitskosten entstehen? Wie verhält sich das System bei ERP-Timeout?
6. Lasse einen fachlichen und einen Plattform-Review die Grenzen prüfen. Ein Self-Review wird explizit als nicht unabhängig markiert.
7. Aktualisiere den Canvas: Welche Lücke ist geschlossen, welche bleibt offen, wann läuft die Entscheidung ab?

## Skalierbarkeit und Performance

Kompetenzarbeit skaliert schlecht, wenn jede Person ein eigenes, inkompatibles Artefaktformat verwendet. Sie skaliert auch schlecht, wenn jede Entscheidung einen zentralen Ausschuss erfordert. Das Ziel ist daher ein kleines Set verbindlicher Nachweisformen mit dezentraler Anwendung und risikobasierter Eskalation.

| Skalierungsproblem | Ursache | Gegenmaßnahme | Messsignal |
|---|---|---|---|
| Reviewstau | Jeder Change wird wie ein High-Risk-System behandelt. | Risikoklassen, automatisierte Contract Tests, klare Delegation und gezielte Architekturreviews. | Wartezeit bis Review, Anzahl eskalierter Ausnahmen. |
| Variantenexplosion | Teams bauen eigene Auth-, Agenten- oder Observability-Pfade. | Referenzverträge, Plattformfähigkeiten, Migrationspfade und begründete Ausnahmen. | Aktive Varianten, Wiederverwendung, Betriebslast. |
| Dokumentationsschuld | Artefakte veralten nach jeder Änderung. | Entscheidung mit Ablaufdatum, Owner, Linkprüfung und Reviewevent verbinden. | Anteil abgelaufener ADRs und nicht auflösbarer Links. |
| Tool-Fixierung | Kompetenz wird über Produktnamen statt Mechanismen bewertet. | Nachweise fragen nach Datenfluss, Fehlergrenze, Konfiguration und Exit. | Wiederkehrende Grundfehler trotz neuer Tools. |
| Überzentralisierung | Plattform oder EA wird Gatekeeper jeder Produktentscheidung. | Self-Service innerhalb verbindlicher Grenzen, SLO für Plattform und Ausnahmeweg. | Adoption, Umgehungen, Durchlaufzeit und Produktfeedback. |

Performance einer Plattformkompetenz wird nicht nur als CPU- oder Tokenlatenz gemessen. Sie umfasst auch die Zeit, die ein Team braucht, um einen sicheren Pfad zu verstehen, einen Fehler zu diagnostizieren, eine Ausnahme zu begründen und eine Migration abzuschließen. Eine zentrale Kontrolle, die jede Lieferung um Wochen verzögert, kann trotz guter Security-Primitiven eine schlechte Systementscheidung sein.

## Reliability und Failure Modes

Eine Kompetenzorganisation scheitert oft nicht am fehlenden Wissen, sondern am verlorenen Kontext. Deshalb werden die folgenden Failure Modes wie technische Risiken behandelt.

| Failure Mode | Ursache | Frühwarnsignal | Kontrolle und Recovery |
|---|---|---|---|
| Heldentum statt Systemfähigkeit | Kritische Entscheidung ist nur im Kopf einer Person. | Wiederkehrende Ad-hoc-Fragen, fehlender Owner, unklare Übergabe. | Referenzartefakt, Pair Review, Runbook, Rotation und dokumentierte Entscheidung. |
| Titelinflation | Rollenname wird ohne Wirkungskriterium verwendet. | Senioritätsdiskussion statt Artefakt- und Risikodiskussion. | Nachweisarten und Zielwirkung vor Titel festlegen. |
| Claim-Überdehnung | Konzept oder Toolnennung wird als Betriebserfahrung gelesen. | Aussagen ohne Zeitraum, Umfang oder Begrenzung. | Belegeintrag der Selbsteinschätzung, zulässiger Satz und Lernartefakt getrennt führen. |
| Prüfblindheit | Happy Path wird als Kompetenznachweis akzeptiert. | Keine Fehlvarianten, keine Messgrenze, keine Cleanup-Anleitung. | Gegenprobe als Pflichtteil; Teststatus ehrlich markieren. |
| Standard ohne Betrieb | Ein Architekturboard veröffentlicht Regeln ohne Support oder Migration. | Niedrige Adoption, Schattenlösungen, abgelaufene Ausnahmen. | Produktowner, Supportmodell, Migrationsbudget, Telemetrie und Rücknahmeplan. |
| Messung ohne Zweck | Kennzahl ist leicht zu erfassen, aber nicht entscheidungsrelevant. | Viele Dashboards, keine veränderte Entscheidung. | Outcome, Baseline, Schwelle und Reaktion vor Messung definieren. |
| Spezialistenflaschenhals | Jede Änderung benötigt denselben Experten. | Lange Queue, Wissensverlust, riskante Freigaben. | Standards, Schulung, zweiter Owner, Delegation und gezielte Deep-Dive-Investments. |

Ein Recovery-Pfad für eine fehlgeschlagene Kompetenzinitiative kann lauten: Standard einfrieren, Scope auf eine kleinere Risikoklasse begrenzen, Ursachen anhand von Adoption und Incidents prüfen, fachlichen Owner erneut einbinden, Referenzimplementierung korrigieren und erst danach die Ausweitung entscheiden. Es ist besser, einen Pilot kontrolliert zurückzunehmen, als ein unsicheres Muster durch weitere Teams zu verbreiten.

## Security, Governance und Compliance

Kompetenz- und Portfolioartefakte enthalten häufig sensible Informationen: Fähigkeiten einzelner Personen, Sicherheitsmängel, Kundenkontext, Architekturdetails oder Messdaten. Für sie gelten Zweckbindung, minimale Datenerhebung, rollenbasierter Zugriff und zeitlich begrenzte Aufbewahrung. Ein Kompetenzmodell wird nicht als verstecktes Performance-Ranking verwendet.

Für technische Entscheidungen ist eine zweite Sicherheitsfrage zentral: Kann das Team die Grenze nicht nur erklären, sondern auch erzwingen? In GenAI-Systemen ist ein Modellsystem kein Autorisierungsdienst. In Plattformen ist eine Markdown-Guideline kein Policy Enforcement. In Cloudumgebungen ist ein Architekturdiagramm keine Netzsegmentierung. Das Nachweismodell verlangt deshalb für kritische Controls eine konkrete Durchsetzungsstelle, eine negative Prüfung und eine Audit- oder Beobachtungsmöglichkeit.

| Governancefrage | Erwartete Antwort | Unzureichende Antwort |
|---|---|---|
| Wer darf den Standard ändern? | Benannter Owner, Reviewrolle, Versionierung und Konsultationsweg. | „Das Architekturteam entscheidet das.“ |
| Wer darf eine Ausnahme erhalten? | Risiko, kompensierende Controls, Ablaufdatum, Approver und Re-Evaluation. | „Bei Bedarf machen wir eine Ausnahme.“ |
| Wer trägt den Betrieb? | On-call- oder Supportmodell, SLO, Runbook und Übergabekriterium. | „Das Plattformteam hilft dann.“ |
| Wann ist Kompetenz ausreichend? | Risikoklasse, Nachweisart, Gegenprobe, unabhängige Prüfung und offene Grenzen. | „Die Person hat den Kurs absolviert.“ |
| Welche Daten gehen in das Portfolio? | Minimal notwendige Artefaktmetadaten, redigierter Kontext und Zugriffszweck. | „Wir speichern alles für später.“ |

Regulatorische Verpflichtungen werden in den entsprechenden Governance- und Compliance-Kapiteln nach Rechtsraum, Rolle und Stichtag behandelt. Dieses Kapitel liefert dafür die Evidenz- und Verantwortungsstruktur, aber keine Rechtsberatung und keine Compliance-Garantie.

## Observability und Troubleshooting

Die Observability eines Kompetenzsystems richtet sich auf Fähigkeits- und Entscheidungsqualität, nicht auf personenbezogene Überwachung. Ein nützliches Dashboard kann folgende Kennzahlen zeigen:

| Signal | Aussage | Einschränkung | Reaktion |
|---|---|---|---|
| Anteil kritischer Entscheidungen mit Owner, Gegenprobe und Ablaufdatum | Entscheidungsartefakte sind prüfbar. | Vollständigkeit sagt nichts über fachliche Korrektheit. | Stichprobenreview und fehlende Felder nachziehen. |
| Zeit von Bedarf bis sicherer erster Nutzung eines Golden Path | Plattformfähigkeit senkt Onboardingaufwand. | Unterschiedliche Use Cases sind nicht direkt vergleichbar. | Engpass in Docs, Identity, Provisionierung oder Review suchen. |
| Ausnahmequote je Standard | Standard deckt Realität oder erzeugt Reibung ab. | Hohe Quote kann auch Übergangseffekt sein. | Gründe clustern; Standard, Migration oder Scope ändern. |
| Wiederkehrende Incident-Ursachen | Lern- und Betriebsgrenzen sind sichtbar. | Ticketqualität kann verzerren. | Referenzpfad, Runbook oder Trainingsfall anpassen. |
| Evidenzalter für volatile Themen | Aussagen müssen erneut geprüft werden. | Alter allein misst keine Relevanz. | Quelle, Version und Pilotentscheidung revalidieren. |

**Symptom: Ein Team behauptet, ein Standard blockiere die Delivery.** Prüfe zunächst, ob der Standard einen konkreten Owner, ein Support-SLO und einen Ausnahmeweg hat. Vergleiche die reale Wartezeit mit der erwarteten Risikominderung. Wenn das Team den Standard umgeht, frage nicht nur nach Disziplin, sondern nach fehlender Produktqualität der Plattform.

**Symptom: Eine Person gilt als einziger Experte für eine kritische AI- oder Cloudkomponente.** Suche nach fehlenden Referenzartefakten, verborgenem Zugangswissen, unklaren Verträgen und nicht getesteten Recovery-Schritten. Baue eine zweite, abgegrenzte Ownership auf, ohne den Spezialisten zu einer unendlichen Schulungsressource zu machen.

**Symptom: Ein Portfolio enthält viele Zertifikate und Demos, aber keine belastbare Wirkung.** Suche für jede Behauptung nach einem Mechanismus, einer Gegenprobe, einem Betriebskriterium und einem Nutzer. Fehlt eines, wird der Eintrag als Lernziel oder Konzept markiert, nicht als vollwertige Fähigkeit.

**Symptom: Die Chief-Ebene fordert eine Technologievereinheitlichung.** Zerlege die Forderung in Outcome, unerwünschte Varianten, Kosten der Migration, akzeptierte Ausnahmen, Daten- und Souveränitätsgrenzen sowie Exit. Erst danach ist klar, ob Standardisierung, eine gemeinsame Plattformfähigkeit oder lediglich bessere Interoperabilität nötig ist.

## Cost und FinOps

Fähigkeitsaufbau kostet Zeit, Infrastruktur, Reviewkapazität und Opportunität. Die relevante Vergleichsgröße ist nicht die Anzahl besuchter Kurse oder erzeugter Dokumente, sondern die Kosten, einen wiederkehrenden Risiko- oder Deliveryengpass zu reduzieren.

| Investition | Sinnvoll, wenn | Kostenrisiko | Abnahmekriterium |
|---|---|---|---|
| Lokales Hands-on-Lab | Ein Grundmechanismus noch nicht sicher erklärt oder getestet werden kann. | Zeit wird in ein nicht priorisiertes Spezialthema gebunden. | Reproduzierbarer Fehlpfad, kurze Dokumentation und klare Erkenntnis. |
| Cloud- oder GPU-Pilot | Platzierung, Latenz, Kompatibilität oder Kosten echte Architekturfragen sind. | Unkontrollierte Verbrauchskosten oder unklare Datennutzung. | Budgetlimit, Testdaten, Telemetrie, Cleanup und Entscheidungsvorlage. |
| Referenzimplementierung | Mehrere Teams denselben sicheren Pfad benötigen. | Plattform produziert Features ohne Adoption. | Mindestens ein Nutzerteam übernimmt sie und liefert Feedback. |
| Spezialistenrolle oder Partner | Ein Engpass hohe Schadenshöhe hat und nicht sinnvoll generalisiert werden kann. | Dauerhafte Lieferanten- oder Personenabhängigkeit. | Klare Schnittstelle, Wissenstransfer, Exit und Second-Source-Plan. |
| Governance-Programm | Risiko oder Regulierung mehrere Wertströme betrifft. | Bürokratie ohne technische Durchsetzung. | Controls, Owner, Messung und risikobasierte Ausnahmen existieren. |

Für AI-Systeme gehören Token-, Modell-, GPU-, Speicher-, Netzwerk- und Observabilitykosten zusammen. Eine Kompetenzentscheidung ist nur vollständig, wenn sie den Verbrauchstreiber dem Nutzerwert und dem Qualitätsniveau zuordnet. Ein günstiger Modellaufruf kann teuer sein, wenn fehlerhafte Toolaktionen Nacharbeit erzeugen. Ein teureres Eval kann wirtschaftlich sein, wenn es einen schädlichen Produktionspfad früh blockiert.

## Trade-offs und Anti-Patterns

| Entscheidung | Gewinn | Preis | Wann vermeiden |
|---|---|---|---|
| Einheitliches Kompetenzmodell | Gemeinsame Sprache und vergleichbare Nachweise. | Gefahr schematischer Bewertung. | Wenn es als HR-Ranking statt als technische Lern- und Risikohilfe verwendet wird. |
| Zentraler Golden Path | Sichere Defaults und wiederholbarer Betrieb. | Plattformabhängigkeit und Warteschlangen. | Wenn Teams stark unterschiedliche Risiken haben und keine begründeten Ausnahmen möglich sind. |
| Tiefe Spezialisierung | Hohe Qualität an kritischer Grenze. | Silos, Übergaben und Personalkosten. | Wenn Standardwissen und ein klarer Vertrag genügen. |
| Breite Architekturrolle | Verbindet Fachziel, Technik und Betrieb. | Gefahr oberflächlicher Entscheidungen. | Wenn Spezialdetails die Entscheidung dominieren und kein Spezialist eingebunden ist. |
| Zertifikats- oder Badge-Nachweis | Niedrige Einstiegshürde und gemeinsames Vokabular. | Schwacher Beleg für Anwendung und Wirkung. | Wenn eine risikoreiche Produktionsfreigabe damit begründet wird. |
| KI-gestützte Portfolioauswertung | Kann Lücken, veraltete Verweise und fehlende Felder finden. | Datenschutz, Fehlklassifikation und falsche Autorität. | Wenn das Modell über Eignung entscheidet oder sensible Evidenz erhält. |

Typische Anti-Patterns sind der T-förmige Slogan ohne konkrete Tiefe, der Held ohne übertragbaren Pfad, die zentral erlassene Zielarchitektur ohne Migrationsbudget und die Erwartung, dass ein Prompt- oder Toolkurs eine sichere Agentenplattform erzeugt. Nicht jede Rolle braucht dieselbe Tiefe. Kritisch ist nur, wenn die unterschiedliche Tiefe unsichtbar bleibt und niemand für die Grenzentscheidung verantwortlich ist.

## Staff-, Principal- und Chief-Entscheidungen

### Staff: den lokalen Engpass in einen wiederholbaren Pfad verwandeln

Ein Staff Engineer beginnt bei einer konkret beobachteten Reibung: wiederholte Fehler bei Toolautorisierung, unklare Eventcontracts oder lange Diagnosen nach Modell-Timeouts. Die Entscheidung lautet nicht einfach „eine Plattform bauen“. Sie kann auch ein kleines Testkit, ein klarer Contract, ein gemeinsames Runbook oder ein eingeführtes Designreview sein. Staff-Wirkung ist glaubwürdig, wenn andere Teams den Pfad nutzen können und die begrenzte Wirkung messbar ist.

- Welcher wiederkehrende Fehler oder Wartepunkt betrifft mehr als einen lokalen Change?
- Welcher kleinste Mechanismus reduziert ihn ohne neue zentrale Abhängigkeit?
- Wer übernimmt den Pfad, wenn der ursprüngliche Autor nicht verfügbar ist?
- Welche Gegenprobe verhindert, dass der Referenzpfad nur im Demo-Szenario funktioniert?

### Principal: Grenzen und Prioritäten über Teams harmonisieren

Principal-Wirkung adressiert Konflikte zwischen mehreren gültigen lokalen Optima. Ein Produktteam will schnelle Modelliteration, ein anderes strenge Datenresidenz, die Plattform will vereinheitlichte Telemetrie und Security fordert überprüfbare Delegation. Der Principal macht Zielkonflikte explizit, definiert stabile Schnittstellen und legt fest, welche Varianten legitim bleiben. Die Arbeit zeigt sich in einem konsistenten Entscheidungsrahmen, gemeinsamen Investitionen und weniger kostspieligen Wiederholungen.

- Welche Fähigkeiten sollten als Plattformprodukt existieren, weil ihre Risiken und Kosten wiederkehren?
- Welche lokalen Varianten bleiben bewusst erlaubt und wie werden sie beobachtet?
- Welche Migration kann schrittweise erfolgen, ohne den Wertstrom zu stoppen?
- Welche Kennzahlen zeigen, ob Harmonisierung Lieferfähigkeit verbessert oder nur Zentralisierung erzeugt?

### Chief: Capability, Risiko und Kapital über den Technologiehorizont steuern

Chief-Wirkung hat ein strategisches Mandat. Sie verbindet Zielmärkte, Daten- und Souveränitätsgrenzen, Make-or-Buy, Talent, Plattformportfolio, regulatorischen Druck und wirtschaftliche Tragfähigkeit. Eine gute Chief-Entscheidung bleibt technisch konkret genug, um nicht zur Folie zu werden: Sie benennt Mindestcontrols, Investitionsobergrenzen, Abhängigkeiten, Ausnahmen, Verantwortliche und ein Datum zur Neubewertung.

- Welche AI-, Plattform-, Cloud- und Datenfähigkeiten sind strategische Kernkompetenzen und welche werden mit kontrollierbaren Verträgen eingekauft?
- Welchen Provider-, Modell- oder Spezialistenlock-in akzeptiert die Organisation, und was ist der getestete Exit?
- Welche Risiken sind so hoch, dass ein schneller Pilot bewusst nicht gestartet oder beendet wird?
- Welche gemeinsame Fähigkeit verkürzt sichere Delivery in mehreren Wertströmen wirklich?
- Welche Entscheidung wird bei Wachstum, Regulierung, Kostenveränderung oder Incident erneut bewertet?

### Entscheidungstabelle: Wer entscheidet was?

| Entscheidung | Hands-on / Team | Architect | Staff | Principal | Chief |
|---|---|---|---|---|---|
| Konkreten Toolvertrag implementieren | implementiert und testet | prüft Kontext und NFR | macht Referenz und Testkit wiederholbar | harmonisiert über Produktgruppen | setzt Risiko- und Investmentgrenze |
| Modellanbieter für einen Use Case auswählen | misst Qualität und Integration | bewertet Datenfluss, Risiko, Fallback und Kosten | erstellt Vergleichsartefakt | bündelt Verträge und Wechselstrategie | entscheidet strategische Abhängigkeit und Portfolio |
| Gemeinsame Plattformfähigkeit einführen | liefert Nutzerfeedback | entwirft Servicegrenzen | baut Golden Path und Adoption | priorisiert Domänen und Ownership | finanziert, standardisiert oder beendet Fähigkeit |
| Ausnahme von einem Sicherheitsstandard | liefert Fakten zum Use Case | dokumentiert technische Alternative | prüft Wiederholbarkeit der Ausnahme | bewertet Muster und Portfoliofolgen | akzeptiert oder verweigert Rest-Risiko im Mandat |

Diese Tabelle ist kein Ersatz für eine RACI. Sie verhindert nur die falsche Annahme, dass höhere Rollen jede Detailentscheidung selbst treffen oder niedrigere Rollen keine Architektur- und Risikoinformation liefern müssen.

## Production Checklist

- [x] Outcome, Invariante, technische Durchsetzung und Messung sind als getrennte Felder definiert.
- [x] Erfahrungsclaims sind als begrenzter Ausgangskontext und nicht als Rollen- oder Betriebsnachweis eingeordnet.
- [x] Hands-on-, Architektur-, Staff-, Principal- und Chief-Wirkung sind über Nachweisarten abgegrenzt.
- [x] Das Beispiel einer gemeinsamen AI-Plattform trennt Produkt-, Plattform-, Enterprise-, Cloud- und LLMOps-Ownership.
- [x] Negative Prüfungen, Owner, Ausnahme, Ablaufdatum und Recovery sind Teil des Entscheidungspfads.
- [x] Kosten betrachten Delivery, Risiko, Plattformbetrieb und AI-Verbrauch gemeinsam.
- [x] Der Innovationsabschnitt enthält Standdatum, Reifegrad, Nutzen, neue Risiken und ein Pilotkriterium.
- [ ] Das Fall-Lab wurde nur redaktionell geprüft, nicht als reale Personal- oder Plattformentscheidung ausgeführt.
- [ ] Eine unabhängige technische Prüfung dieser Datei steht aus; der Status bleibt deshalb technical_review.

## Interviewfragen mit Antwortleitfäden

1. **Woran erkennen Sie den Unterschied zwischen Staff- und Principal-Wirkung?**  
   Staff verbessert einen wiederholbaren technischen Weg über mehrere Menschen oder Teams. Principal harmonisiert konkurrierende lokale Entscheidungen über größere Domänen und priorisiert gemeinsame Fähigkeiten. Entscheidend sind Mandat, nachweisbare Wirkung und Entscheidungsreichweite, nicht der Titel allein.

2. **Wie verhindern Sie, dass eine Kompetenzmatrix zu einem Personenranking wird?**  
   Sie erfasst nur den minimalen technischen Nachweis und offene Lernziele für einen Zweck. Sie speichert keine pauschalen Werturteile, begrenzt Zugriff und trennt Selbstbeleg, Review und unabhängige Validierung. Die Diskussion richtet sich auf Systemrisiken und Fähigkeiten.

3. **Warum reicht ein funktionierender GenAI-Demo-Flow nicht als Kompetenzbeleg?**  
   Ein Demo-Flow zeigt höchstens einen Happy Path. Er sagt wenig über Quellenqualität, Toolrechte, Datenklassifikation, Fehlpfade, Latenz, Kosten, Rollback oder Betrieb aus. Ein belastbarer Nachweis enthält mindestens eine negative Prüfung und eine klare Durchsetzungsgrenze.

4. **Wann benötigen Sie für eine Architekturentscheidung einen Spezialisten?**  
   Wenn ein Spezialgebiet den dominanten Engpass, die Sicherheitsgrenze, die regulatorische Anforderung oder den wirtschaftlichen Erfolg bestimmt. Der Architect bleibt für Integration und Entscheidung verantwortlich, macht aber Annahmen, Abnahmekriterien und Eskalation gegenüber dem Spezialisten explizit.

5. **Wie würden Sie eine zentrale AI-Plattform gegen den Vorwurf der Überzentralisierung verteidigen oder ablehnen?**  
   Zuerst wird geprüft, ob Risiken und Wiederholung tatsächlich gemeinsam sind: Identity, Observability, Quotas, Modellverträge oder Evaluationspfade. Dann werden Adoption, Onboardingzeit, Ausnahmequote, Latenz und Betriebskosten gemessen. Wenn die Plattform keine sichere Selbstbedienung liefert oder Fachlogik zentralisiert, wird Scope reduziert oder der Ansatz abgelehnt.

6. **Wie gehen Sie mit einem Erfahrungsclaim zu GPU-Partitionierung oder Event Sourcing um?**  
   Der Claim wird nach Projekt, Zeitraum, Evidenzart und erlaubter Aussage eingeordnet. Eine Konzeption kann ein guter Ausgangspunkt für eine Architekturfallarbeit sein, beweist aber keine Produktionserfahrung, SLO-Verantwortung oder Spezialistenbetrieb. Die fehlende Evidenz wird als konkretes Lab oder Reviewziel geplant.

7. **Welche Metrik würde Sie überzeugen, dass ein Golden Path Kompetenz und Delivery verbessert?**  
   Keine Einzelmetrik genügt. Sinnvoll sind Zeit bis zur sicheren ersten Nutzung, Wiederverwendungsrate, Fehler- und Ausnahmequote, Diagnosezeit sowie qualitatives Feedback der Nutzerteams. Dazu braucht es eine Baseline und eine Erklärung, welche Nebenwirkung akzeptiert oder korrigiert wird.

8. **Wie entscheidet ein Chief zwischen internem Aufbau und Partnerlösung?**  
   Er bewertet strategische Differenzierung, Risiko, Souveränität, Lern- und Betriebskapazität, Kosten über den Lebenszyklus, Integrationsvertrag und Exit. Die Entscheidung enthält eine überprüfbare Wirkungshypothese, nicht nur einen Einkaufspreis.

## Praktisches Lab: Capability Canvas für einen kontrollierten AI-Pilot

**Ziel.** Erstelle einen nachweisfähigen Kompetenz- und Entscheidungsplan für einen fiktiven B2B-Agenten. Der Agent darf eingeloggten Kunden Bestellstatus erklären und eine Reservierung nur vorbereiten. Eine fachliche Änderung wird erst durch einen deterministischen Commerce-Service und, oberhalb einer selbst definierten Risikoschwelle, durch einen Human Gate ausgeführt.

**Umgebung und Grenzen.** Nutze ein lokales Repository, synthetische Bestellungen und Testidentitäten. Keine Kundendaten, Produktionssecrets oder kostenpflichtige Cloudressourcen sind nötig. Wenn ein Modellservice eingesetzt wird, verwende nur ausdrücklich erlaubte Testdaten, ein Budgetlimit und eine Cleanup-Notiz.

### Inputs

- Eine Liste von drei Testkunden, zwei Bestellungen und einem künstlichen Lagerbestand.
- Ein Toolvertrag mit Feldern für Auftrag, Aktion, Request-ID, delegierte Identität und erwarteten Fehlertyp.
- Vier Rollen: Commerce-Domainowner, GenAI-Implementierung, Platform-Owner und Security-Review.
- Eine Annahme: Das ERP kann für 30 Sekunden nicht antworten; der Modellanbieter kann unbrauchbaren Text liefern.

### Durchführung

1. Fülle einen Capability Canvas mit Outcome, Invariante, Datenklasse, Qualitätsattribut, Owner, Ausnahmeweg und Ablaufdatum.
2. Zeichne ein Kontext- und Datenflussdiagramm. Markiere den Punkt, an dem ein Sprachmodell nur eine Empfehlung erzeugt, und den Punkt, an dem der Commerce-Service eine Zustandsänderung zulassen oder verweigern kann.
3. Erstelle einen minimalen Toolvertrag. Lege fest, welche Claims oder Scopes notwendig wären, ohne echte Secrets zu verwenden.
4. Schreibe ein ADR mit mindestens zwei Optionen: direkter Agentenzugriff auf den Commerce-Service oder Gateway plus Command Handler. Vergleiche Sicherheitsgrenze, Latenz, Betriebsaufwand, Audit und Exit.
5. Erzeuge eine Testtabelle für Erfolgspfad und Gegenproben: falsche Audience, abgelaufene Delegation, doppelte Request-ID, ERP-Timeout und nicht belegte Modellantwort.
6. Weise jeder Aufgabe die kleinste ausreichende Tiefe zu: Hands-on, Architect, Staff, Principal, Chief oder Specialist. Begründe eine Spezialisteneskalation, falls sie nötig ist.
7. Definiere zwei Wirkungssignale für einen späteren Pilot, zum Beispiel erfolgreiche kontrollierte Onboardings und verweigerte unautorisierte Toolaufrufe. Definiere auch ein Abbruchkriterium.

### Erwartete Beobachtungen und Gegenprobe

Eine erfolgreiche Statusabfrage darf keine Reservierung auslösen. Eine abgelaufene oder falsche delegierte Identität muss vor der fachlichen Aktion abgewiesen werden. Eine doppelte Request-ID darf nicht zu zwei Reservierungen führen. Beim ERP-Timeout wird keine Erfolgsmeldung erfunden; das System erzeugt einen nachvollziehbaren Zwischenstatus oder fordert späteren Wiederholungsversuch. Eine nicht belegte Modellantwort darf nicht die fachliche Invariante überstimmen.

### Auswertung und Cleanup

Prüfe, ob jede zentrale Aussage einem Artefakt und einer Gegenprobe zugeordnet ist. Markiere jede ungetestete Annahme. Lösche lokale Testdaten, Tokens und temporäre Logs oder bestätige, dass sie ausschließlich synthetisch waren. Aktualisiere den Canvas mit dem Ergebnis: angenommen, engerer Pilot, fehlende Kompetenz oder Scope stoppen.

**Labstatus:** reviewed_only. Die Fallarbeit ist vollständig beschreibbar und gegen typische Fehler geprüft, wurde aber weder als reale Teamentscheidung noch in einer Produktionsumgebung ausgeführt.

## Dependencies, Cross-References und Quellen

Dieses Kompetenzmodell verwendet die Rollen- und Tiefenstruktur aus [KB-0002](02-rollen-kompetenz-matrix.md) sowie die strikten Claimgrenzen aus [KB-0004](04-cv-istbild-und-zielkompetenzen.md). Die praktischen Nachweisformen folgen in [KB-0006](01-master-index-und-wegweiser.md#kb-0006); Zielrollen werden in [KB-0011](01-master-index-und-wegweiser.md#kb-0011) bis [KB-0016](01-master-index-und-wegweiser.md#kb-0016) konkretisiert. Für den langfristigen Portfolioabgleich ist [KB-0720](01-master-index-und-wegweiser.md#kb-0720) die kanonische Anschlussstelle.

**Verwendete Quellen, Stand 2026-09-14.**

- Masterplan: Zielrollen, Lernwellen und Katalog
- Artikelvertrag: Kompetenzmarker, Nachweisformen, Review und Innovationsabschnitt
- [W3C Verifiable Credentials Data Model v2.0, Recommendation vom 2025-05-15](https://www.w3.org/TR/vc-data-model/)

## Bonus: New Tech and Innovations

**Stand: 2026-09-14.** KI-gestützte Systeme können Kompetenzportfolios heute beim Auffinden veralteter Verweise, fehlender Gegenproben oder unklarer Claimgrenzen unterstützen. Sie sind aber keine Instanz, die über Eignung, Beförderung oder technische Freigabe entscheidet. Ihr sinnvoller Reifegrad in diesem Kontext ist **Emerging bis Adopting**: Struktur- und Konsistenzprüfungen sind gut automatisierbar; die fachliche Wahrheit eines Artefakts, die Vertrauenswürdigkeit eines Nachweises und die organisatorische Wirkung bleiben menschliche Reviewaufgaben.

Verifiable Credentials nach dem [W3C Verifiable Credentials Data Model v2.0](https://www.w3.org/TR/vc-data-model/) können ergänzend Integrität und maschinenprüfbare Aussagen zu einem bewusst freigegebenen Lernartefakt ausdrücken. Der Standard ist als W3C Recommendation vom 15. Mai 2025 dokumentiert. Für diese Wissensbasis ist der Einsatz **optional** und erst dann sinnvoll, wenn Aussteller, Verifikationszweck, Widerruf, Datenminimierung und Zugriff geklärt sind. Er ersetzt weder Testresultate noch Architekturreview noch eine praktische Gegenprobe.

Ein Pilot-Abnahmekriterium lautet: Ein lokales Tool findet an einem redigierten Portfolio fehlende Pflichtfelder und alte Quellen, jeder Fund verweist auf den konkreten Abschnitt, und ein Mensch bestätigt oder verwirft die Änderung. Es dürfen keine privaten Profildaten, Kundendaten oder geheimen Architekturdetails an einen externen Dienst übertragen werden. Bei unklarer Datenverarbeitung oder bei automatisch erzeugten Eignungsurteilen wird der Pilot nicht eingeführt.

