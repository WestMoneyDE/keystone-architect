---
{"id": "KB-0006", "title": "Praktische und architektonische Lerntiefe", "domain": "00", "sequence": 6, "document_type": "navigation", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-14", "technical_reviewed_at": null, "research_cutoff": "2026-09-14", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0004", "concepts": ["Evidenzarten", "zulässige Evidenzaussagen", "Lernziele"], "needed_for": "understanding"}, {"id": "KB-0005", "concepts": ["Kompetenzcanvas", "Wirkungskette", "Entscheidungsreichweite"], "needed_for": "understanding"}], "related": ["KB-0001", "KB-0002", "KB-0007", "KB-0008", "KB-0009", "KB-0011", "KB-0012", "KB-0013", "KB-0014", "KB-0015", "KB-0016", "KB-0720"], "applies": ["KB-0011", "KB-0012", "KB-0013", "KB-0014", "KB-0015", "KB-0016"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Hands-on-Nachweise führen eine abgegrenzte Implementierung, Messung, Gegenprobe und einen sicheren Rückbau aus.", "rationale": "Nur kontrollierte Ausführung macht die Differenz zwischen einer Erklärung und einem realen Fehlpfad erfahrbar."}, "ARCHITECT-TARGET": {"active": true, "scope": "Architektur-Nachweise vergleichen mindestens zwei Optionen unter Daten-, Sicherheits-, Zuverlässigkeits-, Kosten- und Ownership-Randbedingungen.", "rationale": "Architektur ist die begründete Wahl zwischen tragfähigen Alternativen und nicht eine ausführlichere Konfiguration."}, "STAFF-TARGET": {"active": true, "scope": "Staff-Nachweise verwandeln eine gelernte Lösung in einen nutzbaren Referenzpfad mit Tests, Dokumentation, Supportgrenze und Feedbackschleife.", "rationale": "Wirkung über eine eigene Implementierung hinaus entsteht erst durch Wiederholbarkeit für andere."}, "CHIEF-TARGET": {"active": true, "scope": "Chief-Nachweise verbinden Fähigkeiten mit Portfolio, Risikoappetit, Investition, Betriebsmodell und messbarer organisationsweiter Wirkung.", "rationale": "Chief-Entscheidungen müssen konkrete technische Folgen und Exitkosten tragen, ohne operative Verantwortung zu verschleiern."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Spezialtiefe wird für kritische Engpässe wie GPU-Scheduling, BGP, Kryptographie oder Datenbank-Recovery mit einem expliziten Übergabevertrag geplant.", "rationale": "Die Architekturrolle bleibt entscheidungsfähig, ohne Spezialwissen nur zu imitieren oder unbelegt zu behaupten."}}, "lab_validation": [{"lab_id": "KB-0006-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-14", "environment": "Lokaler, synthetischer Fall für einen Commerce-Agenten und eine Eventverarbeitung", "evidence": "Das Lab verlangt getrennte Mechanismus-, Architektur-, Staff- und Chief-Artefakte sowie negative Tests, Kosten- und Rückbaugrenzen.", "limitations": "Die beschriebenen Tests wurden nicht gegen einen realen ERP-, Modell- oder Cloud-Dienst ausgeführt."}]}
---
# Praktische und architektonische Lerntiefe

## Zweck, Definition und Scope

Dieses Kapitel trennt eine praktische Fertigkeit von einer Architekturentscheidung und beide von organisationsweiter Wirkung. Es beantwortet die Frage: Was muss tatsächlich selbst ausgeführt werden, was muss als Architekt begründet und beurteilt werden, und was muss auf Staff-, Principal- oder Chief-Ebene durch Standards, Portfolioentscheidungen und Governance ermöglicht werden?

Hands-on bedeutet nicht, jeden Dienst in Produktion selbst betrieben zu haben. Es bedeutet, einen klar abgegrenzten Mechanismus sicher aufzubauen, zu messen, absichtlich scheitern zu lassen und seine Grenzen zu erklären. Architektur bedeutet nicht, dieselbe Konfiguration mit mehr Kästchen zu dokumentieren. Architektur verbindet Ziele, Qualitätsattribute, Daten- und Vertrauensgrenzen, Alternativen, Betriebsfolgen und Verantwortlichkeiten zu einer überprüfbaren Wahl. Staff- und Chief-Wirkung verlagern den Fokus von der Einzellösung auf wiederholbare Fähigkeiten und ihre organisatorischen Folgen.

Nach diesem Kapitel kann der Leser:

1. Mechanismuswissen, Umsetzungstiefe, Diagnosefähigkeit, Architektururteil und Governance-Wirkung unterscheiden;
2. für ein Thema die kleinste ausreichende Lerntiefe festlegen, statt Lernzeit nach Toolpopularität zu verteilen;
3. aus einem eigenen Erfahrungsclaim nur die belegbare Ausgangstiefe ableiten und fehlende Tiefe als Nachweisplan formulieren;
4. ein Lab so gestalten, dass Erfolg, Fehler, Messung, Kosten und Rückbau dokumentiert werden;
5. eine Architekturentscheidung mit mindestens einer ernsthaften Alternative und einer überprüfbaren Betriebsfolge begründen;
6. Spezialistenarbeit sinnvoll einbinden, ohne die eigene End-to-End-Verantwortung zu verlieren.

Das Kapitel bewertet keine Menschen und ersetzt keine fachliche Freigabe. Es liefert die Arbeitslogik für die folgenden technischen Kapitel, damit „gelernt“, „gebaut“, „entworfen“, „betrieben“ und „standardisiert“ nicht unklar vermischt werden.

## Kompetenzmarker und Evidenzgrenzen

| Marker | Status | Bedeutung |
|---|---|---|
| CURRENT-EVIDENCE | offen | Eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| HANDS-ON-TARGET | aktiv | Jedes Lab zeigt einen Mechanismus, eine Messung, mindestens eine Gegenprobe und einen sicheren Rückbau. |
| ARCHITECT-TARGET | aktiv | Entscheidungen zeigen Kontext, NFRs, Alternativen, Konsequenzen, Ownership und Re-Evaluation. |
| STAFF-TARGET | aktiv | Aus einer Einzellösung wird ein übertragbarer Pfad mit Nutzer, Supportmodell und messbarer Adoption. |
| CHIEF-TARGET | aktiv | Fähigkeiten werden gegen Risikoappetit, Portfolio, Investition, Souveränität und Exit bewertet. |
| SPECIALIST-OPTIONAL | aktiv | Tiefe Spezialkenntnis wird risikobasiert gewählt und über einen transparenten Übergabevertrag integriert. |

### Die sieben Tiefenstufen

Die Stufen sind keine lineare Karriereleiter. Sie sind unterschiedliche Arten von Evidenz. Ein Thema kann in Stufe 4 erforderlich sein und in Stufe 7 bewusst an einen Spezialisten übergeben werden.

| Stufe | Name | Prüffrage | Minimaler Nachweis | Nicht ausreichend |
|---:|---|---|---|---|
| 0 | Kontext kennen | Wofür wird die Technologie verwendet und welche Grenze hat sie? | Begriff, Kontext und Link zur kanonischen Datei. | Ein Produktname als Erfahrungsclaim. |
| 1 | Mechanismus erklären | Was passiert auf dem Erfolgs- und Fehlpfad? | Mentales Modell, Datenfluss, zentrale Invariante. | Auswendig gelernte Befehle. |
| 2 | Sicher ausführen | Kann die abgegrenzte Lösung in Testumgebung gebaut und zurückgebaut werden? | Konfiguration, Test, Gegenprobe, Messung, Cleanup. | Ein unprotokollierter Demo-Screenshot. |
| 3 | Diagnostizieren | Kann die Ursache unter beobachteten Symptomen eingegrenzt werden? | Hypothese, Telemetrie, Fehlerklassifikation, Recovery. | Nur Neustarten oder Logs durchsuchen ohne Modell. |
| 4 | Architektur entscheiden | Kann zwischen Alternativen unter NFRs und Ownership gewählt werden? | ADR, Risiko, Kosten, Datenfluss, Betriebsfolge und Review. | Ein Diagramm ohne Entscheidung oder Alternative. |
| 5 | Wiederholbar machen | Kann ein anderer Nutzer den sicheren Pfad übernehmen? | Referenzimplementierung, Vertrag, Dokumentation, Support- und Ausnahmeweg. | Kopieren eines privaten Repositories. |
| 6 | Portfolio und Governance steuern | Kann die Organisation Capability, Risiko und Kapital bewusst lenken? | Standard, Investitionsentscheidung, Messung, Ausnahme, Exit und Re-Evaluation. | Ein globaler Technologieerlass ohne Umsetzungspfad. |

## Mental Model: Tiefe als vertikaler Schnitt

Ein tiefes Verständnis entsteht entlang eines vertikalen Schnitts durch ein System, nicht durch die horizontale Sammlung möglichst vieler Tools. Für eine einzelne Agentenaktion kann dieser Schnitt so aussehen:

Nutzerabsicht → Authentifizierung und Delegation → Prompt- und Context Assembly → Toolvertrag → fachlicher Command → persistenter Zustand → Event und Audit → Observability → Fehlerbehandlung und Recovery → Kosten und Freigabe.

Wer nur den Prompt betrachtet, kennt nicht die Sicherheits- und Zustandsgrenze. Wer nur das OAuth-Token betrachtet, kennt nicht die fachliche Invariante. Wer nur ein Dashboard betrachtet, kann die Kosten einer unkontrollierten Retry-Schleife übersehen. Praktische und architektonische Tiefe heißt, einen ausreichenden Ausschnitt dieser Kette auf der eigenen Verantwortungsgrenze korrekt zu verbinden.

Die zweite Achse ist Reichweite:

| Reichweite | Leitfrage | Typischer Besitzer |
|---|---|---|
| Lokaler Change | Funktioniert der abgegrenzte Mechanismus? | Implementierendes Team. |
| Service oder Produkt | Trägt die Lösung Daten, Last, Fehler und Fachregeln? | Tech Lead oder Solution Architect mit Domänenowner. |
| Mehrere Teams | Ist der Pfad sicher wiederholbar und wirtschaftlich? | Staff Engineer oder Platform Architect. |
| Domäne oder Portfolio | Welche Varianten, Standards und Investitionen sind vertretbar? | Principal, Enterprise Architect oder Chief. |

Eine höhere Reichweite macht Details nicht unwichtig. Sie verschiebt die Verantwortung: Ein Chief muss nicht jeden Tokenparser schreiben, aber entscheiden können, ob die Organisation eine unkontrollierte Tooldelegation als Rest-Risiko akzeptiert. Ein Staff Engineer muss nicht jeden Kundenprozess besitzen, aber verstehen, welche Produktinvariante sein Referenzpfad niemals umgehen darf.

## Prerequisites und Dependencies

[KB-0004](04-cv-istbild-und-zielkompetenzen.md) liefert die Evidenzarten und verbietet überzogene Claims. [KB-0005](05-kompetenzmodell-fuer-staff-principal-und-chief.md) definiert Wirkungskette, Kompetenzcanvas und Reichweite. Dieses Kapitel operationalisiert beide für praktische und architektonische Lernarbeit.

| Beziehung | Datei | Zweck |
|---|---|---|
| Navigation | [KB-0001](01-master-index-und-wegweiser.md) | Stabile IDs, Status und Katalogpfade. |
| Rollencluster | [KB-0002](02-rollen-kompetenz-matrix.md) | Welche Tiefe für GenAI, Plattform, Enterprise, Cloud und LLMOps nötig ist. |
| Fortschrittssteuerung | [KB-0007](01-master-index-und-wegweiser.md#kb-0007) und [KB-0008](01-master-index-und-wegweiser.md#kb-0008) | Lernwellen und Versionsstrategie. |
| Labnachweis | [KB-0009](01-master-index-und-wegweiser.md#kb-0009) | Reproduzierbare Labore und Beweisartefakte. |
| Zielrollen | [KB-0011](01-master-index-und-wegweiser.md#kb-0011) bis [KB-0016](01-master-index-und-wegweiser.md#kb-0016) | Rollenspezifische Mindesttiefe und Artefakte. |
| Portfolio | [KB-0720](01-master-index-und-wegweiser.md#kb-0720) | Langfristiger Abgleich von Artefakten, Wirkung und Reife. |

## Core Concepts

### Praktisches Wissen: Kontrolle über einen abgegrenzten Mechanismus

Praktische Tiefe beginnt mit einer expliziten Umgebung. Sie nennt Betriebssystem oder Runtime, Versionen, Eingaben, Secrets-Strategie, Datenklasse, erwartete Ausgaben und Ressourcenlimits. Ein Hands-on-Nachweis ohne diese Elemente kann kaum wiederholt oder bewertet werden.

Ein gutes Lab beantwortet vier Fragen:

1. Was soll der Mechanismus leisten?
2. Welche Voraussetzung muss wahr sein?
3. Wie wird die zentrale Behauptung aktiv angegriffen?
4. Wie wird die Umgebung zurückgebaut oder gesichert?

Beispiel: Ein Toolgateway prüft eine delegierte Identität. Erfolg bedeutet nicht „der HTTP-Request liefert 200“. Erfolg bedeutet: Eine erlaubte Audience und ein erlaubter Scope führen zu einem fachlichen Command; eine falsche Audience wird vor dem Command abgewiesen; ein Audit Event enthält korrelierbare, nicht geheime Metadaten; temporäre Testtokens werden entfernt oder laufen ab.

### Architekturwissen: Entscheidung unter konkurrierenden Zielen

Architektur entsteht, wenn keine Option alle Qualitätsattribute gleichzeitig maximiert. Der direkte Zugriff des Agenten auf einen Commerce-Service kann Latenz und Implementierungszeit senken. Ein Gateway mit Policy Enforcement und Command Handler erhöht möglicherweise Latenz und Betriebsaufwand, kann aber Rechte, Audit, Schemaevolution und fachliche Invarianten kontrollierbarer machen.

Ein Architekturclaim besteht mindestens aus:

| Bestandteil | Warum er nötig ist |
|---|---|
| Kontext und Outcome | Verhindert, dass Technik ohne Nutzerwert optimiert wird. |
| Invarianten und Datenklassen | Bestimmen, welche Fehler und Offenlegung nicht akzeptabel sind. |
| NFRs und Messgrößen | Übersetzen „schnell“, „sicher“ und „zuverlässig“ in prüfbare Annahmen. |
| Mindestens zwei Optionen | Macht einen Trade-off sichtbar statt eine Präferenz zu verkleiden. |
| Entscheidung und Begründung | Hält fest, warum die Wahl unter den gegebenen Bedingungen trägt. |
| Betrieb und Ownership | Verbindet Design mit On-call, Support, Monitoring und Änderung. |
| Kosten und Exit | Verhindert einen kurzfristig günstigen, langfristig untragbaren Pfad. |
| Ablaufdatum oder Trigger | Macht Annahmen bei neuer Evidenz erneut verhandelbar. |

### Diagnosewissen: Vom Symptom zur Ursache

Diagnose liegt zwischen Ausführung und Architektur. Sie verlangt ein Fehlermodell. Ein Timeout kann Netzwerklatenz, erschöpfte Verbindungspools, Rate Limit, Downstream-Ausfall, Deadlock, übergroßen Prompt, Retry-Sturm oder falsches Alerting bedeuten. Wer nur eine Komponente neu startet, hat den Mechanismus nicht verstanden.

Ein Diagnoseartefakt enthält ein Symptom, Hypothesen, die minimal nötige Telemetrie, Tests zur Unterscheidung, eine sichere Sofortmaßnahme, einen dauerhaften Fix und eine Folgemessung. Das ermöglicht wiederholbares Incident-Handling und zeigt, ob ein Hands-on-Nachweis auch außerhalb des Happy Path trägt.

### Spezialistentiefe: bewusst und überprüfbar delegieren

Spezialwissen ist nicht ein Zeichen dafür, dass eine Architekturrolle versagt. Es wird nötig, wenn ein Detail den dominanten Fehler- oder Kostenpfad bestimmt. Beispiele sind GPU-Speicherfragmentierung bei Inference, BGP-Policy an Providergrenzen, HSM-Schlüsselzeremonien, Datenbank-Recovery nach korruptem WAL oder formale Sicherheitsanalyse eines kryptographischen Protokolls.

Der Übergabevertrag mit Spezialisten muss festhalten:

- welche Entscheidung der Architect weiterhin verantwortet;
- welche Annahme der Spezialist prüft;
- welche Metrik oder Gegenprobe die Behauptung abnimmt;
- welche Option verworfen wurde und warum;
- wie Wissen, Runbook und Eskalation bei Abwesenheit funktionieren;
- wann das Thema erneut bewertet wird.

„Ein Spezialist hat es gesagt“ ist kein belastbarer Architekturbeleg. Ebenso ist es kein guter Beleg, ein Spezialgebiet oberflächlich zu imitieren, obwohl der kritische Fehlerpfad unklar bleibt.

## Architektur und Data Flow: Der Nachweis-Workflow

Ein Lernartefakt wird wie ein kleiner Produktionschange behandelt, aber klar als Test oder Simulation markiert:

Bedarf → Risikoklasse → Zielstufe → Hypothese → isolierte Umgebung → Implementierung oder Design → Gegenprobe → Beobachtung → Entscheidung → Evidenzregister → nächster Lern- oder Betriebsnachweis.

### Beispielannahme: Reservierungsagent mit Eventverarbeitung

Ein B2B-Agent beantwortet Statusfragen und bereitet Lagerreservierungen vor. Ein Modell darf Vorschläge erzeugen, aber keine Bestandsänderung direkt durchführen. Der Commerce-Service ist System of Record. Jede Reservierung benötigt eine Request-ID, eine berechtigte delegierte Identität und einen fachlichen Command Handler. Nach einer akzeptierten Änderung wird ein Domain Event publiziert. Diese Architekturannahme ist fiktiv und dient nur als Lernfall.

| Schritt | Praktische Tiefe | Architekturfrage | Staff- oder Chief-Folge |
|---|---|---|---|
| Toolvertrag definieren | Schema validieren, Fehlerfälle erzeugen. | Welche Felder sind Pflicht und welcher Service erzwingt sie? | Referenzschema und Versionierungsregel für mehrere Teams. |
| Delegation prüfen | Falsche Audience und abgelaufenes Token testen. | Wo endet Modellautorität und wo beginnt fachliche Autorisierung? | Einheitlicher Identity- und Auditstandard mit Ausnahmeweg. |
| Command ausführen | Idempotenzschlüssel, Status und Fehlercode implementieren. | Welche Zustandsinvariante schützt gegen doppelte Reservierung? | Wiederverwendbares Testkit und Ownership des Domaincontracts. |
| Event publizieren | Duplikat, Reihenfolge und Retry beobachten. | Welche Zustellsemantik und Reconciliation ist für den Use Case ausreichend? | Portfolioentscheidung über Broker, Outbox-Standard und Betriebsfähigkeit. |
| Fehler behandeln | ERP-Timeout und Modellhalluzination simulieren. | Welcher Fallback schützt Nutzer und fachlichen Zustand? | Risikoappetit, SLO und Investition in resiliente Integration. |

Der Data Flow darf nie die fachliche Invariante im Modell verstecken. Das Modell ist probabilistisch; der Command Handler ist deterministisch. Ein Toolvertrag und eine Policy können Modelloutput begrenzen, aber nur die zuständige Fachkomponente kann entscheiden, ob eine Zustandsänderung gültig ist.

## Protokolle, Standards und Werkzeuge

Die Lerntiefe wird über Mechanismen gemessen, nicht über Produktlisten. Dennoch braucht jedes technische Kapitel sichere Bezugspunkte, die ein Nachweis konkret machen.

| Thema | Praktische Tiefe | Architektur- und Governance-Tiefe |
|---|---|---|
| API-Verträge | OpenAPI oder JSON Schema validieren; Fehler- und Versionsfälle testen. | Consumer Ownership, Kompatibilitätsstrategie, Deprecation, API-Governance und Portalbetrieb entscheiden. |
| Ereignisse | CloudEvents- oder AsyncAPI-artige Envelope, Idempotenz und Consumerfehler simulieren. | Zustellsemantik, Schemaevolution, Reprocessing, Datenklassifikation und Brokerportfolio abwägen. |
| Identity | OIDC-Claims, Tokenablauf, Audience und Scope in Testumgebung prüfen. | Trust Boundary, Workload Identity, Key Rotation, Audit, Delegation und Ausnahmeprozess gestalten. |
| Container und Plattform | OCI-Image, Ressourcenlimits, Probe und Rollback ausprobieren. | Multi-Tenancy, Plattformprodukt, Policy, Supply Chain, Supportmodell und Exit steuern. |
| Observability | Trace, Metrik und strukturierte Logs für eine Transaktion erzeugen. | Kardinalität, Sampling, Datenschutz, SLO, Alarmierungsmodell und Kostenbudget entscheiden. |
| AI Runtime | Prompt-, Tool- oder Evalfall reproduzieren; Fallback sichtbar machen. | Modellportfolio, Datenresidenz, Qualitätsgate, GPU- oder Tokenkosten und Providerexit bewerten. |

MCP und A2A sind Beispiele aktueller Agenteninteroperabilität. Hands-on-Tiefe bedeutet hier nicht nur eine Demo-Verbindung zu erzeugen. Sie verlangt Version, Tool- oder Agentenvertrag, Identity, negative Berechtigungsprobe, Telemetrie und Migrationsgrenze. Architektur- und Staff-Tiefe klären zusätzlich, ob mehrere Teams den Vertrag sicher nutzen, wer Änderungen steuert und wie eine inkompatible Version zurückgenommen wird.

## Konfiguration und Implementierung

### Laborvertrag

Vor jeder Ausführung wird ein kleiner Laborvertrag angelegt:

| Feld | Beispiel |
|---|---|
| Hypothese | Ein Command Handler verhindert doppelte Reservierungen bei wiederholter Request-ID. |
| Umgebung | Lokaler Container oder Prozess, synthetische Daten, isolierte Testidentität. |
| Eingabe | Reservierungsauftrag mit Tenant, Nutzer, Request-ID und Produkt. |
| Erwartung | Erstauftrag akzeptiert, Duplikat gibt denselben oder klar definierten Zustand zurück. |
| Gegenprobe | Gleiche Request-ID mit verändertem Payload, falsche Audience, ERP-Timeout. |
| Messung | Latenz, Commandresultat, Audit Event, Idempotenzstatus und Fehlerklassifikation. |
| Sicherheitsgrenze | Keine echten Kundendaten, keine Produktionssecrets, keine globale Berechtigung. |
| Kostenlimit | Lokal; bei Cloudversuch festes Budget und Abschaltzeitpunkt. |
| Cleanup | Testdaten, Tokens, Container und temporäre Logs entfernen. |
| Evidenz | Konfiguration, Testreport, ADR-Verweis, Screenshot nur als Ergänzung. |

### Architekturartefakt als Implementierungsgrenze

Ein ADR wird geschrieben, bevor ein komplexer Mechanismus als allgemeines Muster kopiert wird. Die präzise Frage lautet etwa: „Soll die Reservierung über direkten Agentenzugriff oder über Gateway und Command Handler laufen?“ Der ADR enthält:

1. Kontext mit Nutzerwert und verbotener Zustandsänderung.
2. Annahmen zu Last, Latenz, Datenklasse, Ausfall und Budget.
3. Zwei oder mehr Optionen einschließlich einer Nichtänderungsoption.
4. Entscheidung mit Nachteilen, die bewusst akzeptiert werden.
5. Test- und Observabilityplan.
6. Owner, Migrationsschritte, Rollback und Re-Evaluation-Trigger.

Diese Form zwingt eine Architekturrolle, die eigene Hands-on-Erfahrung richtig zu nutzen: Sie kann die Umsetzbarkeit bewerten, ohne aus einem lokalen Test auf organisationale Betriebsfähigkeit zu schließen.

### Referenzpfad statt Lehrtextkopie

Wenn ein Thema mehrere Teams betrifft, wird ein Referenzpfad erstellt. Er besteht nicht nur aus Text, sondern aus einer kleinen ausführbaren oder überprüfbaren Einheit:

- eine Vorlagenstruktur für Contract Tests;
- ein Policy-Beispiel mit sicherem Default und absichtlicher Ablehnung;
- ein Runbook mit Diagnoseabfolge und Eskalationskontakt;
- ein Dashboard- oder Telemetrievertrag mit erlaubten Attributen;
- ein Versions- und Ausnahmeprozess;
- eine klare Nicht-Ziel-Liste.

Damit lässt sich die Stufe 5 prüfen: Kann ein anderes Team die Fähigkeit anwenden, ohne private Hintergrundinformationen oder ständig denselben Experten zu benötigen?

## Skalierbarkeit und Performance

Lern- und Nachweisarbeit besitzt eigene Engpässe. Die knappsten Ressourcen sind oft nicht Rechenzeit, sondern Reviewkapazität, sichere Testdaten, Reproduzierbarkeit und die Aufmerksamkeit von Domänenowner. Eine gute Lernstrategie erhöht daher nicht einfach die Zahl der Labs, sondern reduziert die Zeit bis zu einer begründeten Entscheidung.

| Engpass | Schlechte Reaktion | Skalierbarer Ansatz |
|---|---|---|
| Viele neue Tools | Für jedes Tool ein isoliertes Tutorial schreiben. | Einen stabilen Mechanismus pro vertikalem Schnitt wählen und Toolunterschiede als Variante behandeln. |
| Wenige Reviewer | Jede Übung zentral genehmigen lassen. | Risikoklassen, Checklisten, Pair Review und gezielte unabhängige Prüfung nutzen. |
| Teure GPU- oder Cloudzeit | Unbegrenztes Experimentieren ohne Messziel. | Kleine synthetische Last, Budget, Abschaltgrenze, hypothesengetriebener Benchmark und Cleanup. |
| Unterschiedliche Teams | Ein komplexes Framework als Pflicht für alle erklären. | Schnittstellen, Golden Paths und spezialisierte Eskalation nach tatsächlichem Risiko anbieten. |
| Veraltete Artefakte | Dokumentation nur einmal schreiben. | Owner, Ablaufdatum, Linkprüfung, Reviewtrigger und Versionsstrategie festlegen. |

Performance einer Architekturkompetenz bedeutet auch Entscheidungszeit. Wenn ein Team bei einem häufigen Fehler weder Quelle noch Owner noch Gegenprobe findet, ist der Lernpfad zu langsam. Eine Plattform, die sichere Defaults bereitstellt, kann wertvoll sein, selbst wenn sie ein paar Millisekunden zusätzliche Latenz kostet; sie muss diesen Preis jedoch messen und begründen.

## Reliability und Failure Modes

| Failure Mode | Warum er entsteht | Frühwarnsignal | Gegenmaßnahme |
|---|---|---|---|
| Tutorial-Kompetenz | Happy Path wird ohne Randbedingungen wiederholt. | Keine negativen Tests, keine Messwerte, kein Cleanup. | Laborvertrag und Gegenprobe als Pflicht. |
| Architekturtheater | Diagramme werden ohne Entscheidung, Owner oder Betrieb erstellt. | Viele Bilder, keine ADRs, keine Re-Evaluation. | Entscheidungsvorlage, Alternativen und Ablaufdatum erzwingen. |
| Stack-Inflation | Toolnennung wird als Tiefe ausgelegt. | Profilabsätze oder Skilllisten ohne Projektumfang und Grenze. | Evidenzart, erlaubte Aussage und nächstes Artefakt dokumentieren. |
| Übertraining | Spezialthema wird vor kritischen Grundlagen vertieft. | Lange Lernzeit, keine Verbesserung eines priorisierten Risikos. | Risikogewichtete Lernwellen und kleinere vertikale Schnitte. |
| Gefährliches Üben | Lab verwendet reale Daten, weitreichende Tokens oder Produktion. | Geheimnisse in Dateien, unklare Cloudkosten, keine Löschroutine. | Isolierte Umgebung, synthetische Daten, Least Privilege und Cleanup. |
| Ein-Person-Standard | Ein guter Mechanismus kann nur von seinem Autor genutzt werden. | Wiederholte direkte Hilfe, keine Onboardingzeit, fehlender Supportweg. | Referenzpfad, Pairing, Contract Test und Teamfeedback. |
| Überdelegation | Architect verlässt sich auf Spezialisten ohne verständliche Abnahme. | „Der Experte sagt, es passt“ ohne Kriterien. | Übergabevertrag, Messung, Review und dokumentierte Annahmen. |

Reliability eines Lernartefakts wird nicht dadurch erreicht, dass jedes Lab produktionsnah groß wird. Sie entsteht durch eine realistische Fehlerklasse, eine klare Begrenzung und einen ehrlichen Status. Ein lokaler Test kann syntax_checked oder reviewed_only sein; daraus wird erst durch echte Ausführung und angemessenen Review ein stärkerer Nachweis.

## Security, Governance und Compliance

Der Unterschied zwischen Ausführen und Entscheiden ist bei Sicherheit besonders wichtig. Ein Hands-on-Lab kann beweisen, dass ein Token mit falscher Audience abgewiesen wird. Eine Architekturentscheidung muss zusätzlich klären, wer den Issuer vertraut, wo Workload Identity endet, wie Keys rotieren, wie Auditdaten geschützt werden und welche Ausnahme bei einer Legacy-Integration akzeptiert wird. Staff- und Chief-Ebenen müssen daraus einen wiederholbaren Standard und einen kontrollierten Risikopfad machen.

| Lernartefakt | Sicherheitsanforderung |
|---|---|
| Lokales Lab | Synthetische Daten, kurzlebige Secrets, keine Produktion, dokumentierter Cleanup. |
| Architekturfall | Datenfluss, Trust Boundaries, Angreifermodell, Controls, Residualrisiko und Owner. |
| Referenzpfad | Secure Defaults, Policy Enforcement, Versionierung, Review, Ausnahme und Support. |
| Portfolioentscheidung | Daten- und Souveränitätsgrenzen, Lieferantenrisiko, Investitionsrahmen, Audit und Exit. |

Compliance wird nicht durch die Tiefe einer Person garantiert. Sie verlangt anwendbare Regeln, ein passendes Kontrollsystem und Nachweise über deren Durchführung. Dieses Kapitel trennt daher Lernbeleg, technisches Control und formale Compliance-Aussage. Ein Architekturreview kann zeigen, dass eine Kontrolle geplant ist; es bestätigt keine gesetzliche Konformität ohne Kontextprüfung.

## Observability und Troubleshooting

Ein tiefes Lab erzeugt genug Beobachtung, um seine Hauptannahme zu prüfen. Es benötigt nicht automatisch ein vollständiges Observability-Programm. Entscheidend ist die Korrelation zwischen Nutzer- oder Testaktion, technischer Durchsetzung und fachlichem Ergebnis.

| Frage | Praktische Beobachtung | Architekturbeobachtung |
|---|---|---|
| Was ist passiert? | Request, Testfall, Exitcode, strukturierter Fehler. | End-to-End-Trace, Fachereignis, SLO und Auswirkung auf Nutzer. |
| Warum ist es passiert? | Hypothese gegen Log, Metrik oder Test isolieren. | Abhängigkeiten, Kapazität, Change, Policy und Datenfluss vergleichen. |
| Was war die Wirkung? | Erwartetes versus beobachtetes Ergebnis. | Kosten, Zuverlässigkeit, Security, Support und Portfoliofolge. |
| Was geschieht als Nächstes? | Fix, Retest, Cleanup oder markierte Unsicherheit. | ADR-Update, Migration, Standardänderung, Ausnahme oder Stop. |

### Troubleshooting-Übung: Doppelte Reservierung

**Symptom:** Zwei identische Reservierungen tauchen im Testlog auf.

1. Prüfe zuerst, ob es tatsächlich zwei fachliche Zustandsänderungen oder nur zwei Zustellversuche eines Events sind.
2. Korrelieren Request-ID, Command-ID, Event-ID, Tenant und Zeitstempel. Vermeide Kundendaten in der Diagnoseausgabe.
3. Unterscheide fehlende Idempotenz im Command Handler von einem Consumer-Offset- oder Retryproblem.
4. Simuliere einen Timeout nach persistiertem Command, aber vor Antwort an den Caller.
5. Entscheide, ob die fachliche Invariante Transaktion, Unique Constraint, Outbox, Deduplication Store oder eine Kombination benötigt.
6. Dokumentiere Restunsicherheit: Eine lokale Gegenprobe zeigt nicht automatisch die Semantik eines realen Brokers oder ERP.

Der praktische Nachweis endet mit der Erkenntnis über den Mechanismus. Das Architekturartefakt beginnt, wenn die gewählte Schutzstrategie gegenüber Alternativen, Last, Datenhaltung, Kosten und Betriebsmodell verteidigt wird.

## Cost und FinOps

Lerntiefe hat direkte und indirekte Kosten. Direkte Kosten sind Compute, Modellaufrufe, Speicher, Netzwerk, Sandboxen und externe Kurse. Indirekte Kosten sind Reviewzeit, Wartezeit, unklare Ownership, Wiederholung derselben Fehler und unkontrollierte Lieferantenabhängigkeit. Die kostengünstigste Übung ist nicht automatisch die wirtschaftlichste, wenn sie eine risikoreiche Entscheidung ungetestet lässt.

| Tiefe | Typischer Kostenpunkt | FinOps-Frage |
|---|---|---|
| Hands-on | Lokaler Rechner, kurze Sandbox, kleine synthetische Last. | Kann die Hypothese ohne persistente Infrastruktur geprüft werden? |
| Diagnose | Telemetrie, reproduzierbarer Fehler, Testzeit. | Welche Signale sind nötig, ohne teure oder sensible Daten dauerhaft zu sammeln? |
| Architektur | Zeit für Alternativen, Domänenreview und Kostenmodell. | Welche Annahme über Nachfrage, Verfügbarkeit oder Modellpreis treibt die Entscheidung? |
| Staff | Referenzpfad, Support, Dokumentation, Migration und Adoption. | Senkt Wiederverwendung die Gesamtkosten stärker als der Plattformbetrieb sie erhöht? |
| Chief | Portfolio, Vertrag, Souveränität, Talent, Exit und Risiko. | Welche langfristige Bindung entsteht und wer finanziert die Fähigkeit? |

Für LLM- und GPU-Arbeit werden Tokens oder GPU-Stunden niemals isoliert optimiert. Ein billiger Test ohne Evaluation kann teure Fehlaktionen erzeugen. Ein teures Benchmark ist nur sinnvoll, wenn es eine konkrete Kapazitäts- oder Modellentscheidung reduziert. Jede Cloud- oder GPU-Fallarbeit hat ein Budgetlimit, einen Abschaltzeitpunkt, Testdaten und einen Cleanupplan.

## Trade-offs und Anti-Patterns

| Wahl | Vorteil | Nachteil | Gute Grenze |
|---|---|---|---|
| Breites Überblickswissen | Gemeinsame Sprache über viele Domänen. | Gefahr der oberflächlichen Selbstüberschätzung. | Für Kontext und Schnittstellen, nicht als Ersatz für kritische Mechanismen. |
| Tiefer vertikaler Schnitt | Realistische Fehler- und Betriebsgrenzen. | Weniger Themen pro Zeiteinheit. | Für priorisierte Wertströme und hohe Risiken. |
| Produktorientiertes Lab | Schneller Start mit konkretem Tool. | Toolwissen kann das mentale Modell überdecken. | Wenn Version, Mechanismus und Alternative ausdrücklich dokumentiert sind. |
| Technologieagnostischer Architekturfall | Gute Trade-off- und Ownershiparbeit. | Gefahr einer unrealistischen Abstraktion. | Wenn mindestens ein umsetzbarer Referenzmechanismus enthalten ist. |
| Zentraler Golden Path | Sichere Defaults und weniger Varianten. | Abhängigkeit und möglicher Deliverystau. | Wenn wiederkehrende Risiken und ein Supportmodell vorhanden sind. |
| Spezialisteneskalation | Hohe Qualität an kritischer Grenze. | Queue, Kosten und Wissenstrennung. | Wenn der Übergabevertrag messbar und der Exit klar ist. |

Ein Anti-Pattern ist die Annahme, dass eine Person entweder „praktisch“ oder „strategisch“ sei. Gute Architektur braucht praktische Rückkopplung, und gute Implementierung braucht ein Verständnis der Invariante und der Nutzerwirkung. Der Unterschied besteht im Umfang der Entscheidung und im Nachweis, nicht in einer Hierarchie des Respekts.

## Staff-, Principal- und Chief-Entscheidungen

### Staff-Entscheidungen

Staff-Arbeit wählt häufig die Stufe 5: Aus einer lokal geprüften Lösung entsteht ein Pfad, den andere Teams sicher anwenden können. Staff entscheidet beispielsweise, ob ein gemeinsames Tool-Schema, ein Idempotenz-Testkit oder ein Telemetrie-SDK mehr Risiken reduziert als eine vollständige Plattforminitiative. Der Nachweis ist nicht die Zahl der Gespräche, sondern ein übernommener, beobachtbarer und wartbarer Pfad.

**Prüffragen:**

- Welche Fehlerklasse wiederholt sich über mindestens zwei Teams oder Services?
- Welche kleinste Referenzimplementierung verhindert sie ohne Produktlogik zu zentralisieren?
- Wer ist Nutzer, wer Owner, welcher Support ist zugesagt und wann läuft die Annahme ab?
- Wie wird gemessen, ob die Referenz genutzt wird und ob sie die Fehlerklasse tatsächlich reduziert?

### Principal-Entscheidungen

Principal-Arbeit entscheidet, welche lokal sinnvollen Varianten gemeinsam standardisiert oder bewusst getrennt werden. Sie verbindet Architekturartefakte, Plattformroadmap, Daten- und Securitygrenzen sowie Migrationsfähigkeit. Ein Principal kann beispielsweise die gemeinsame Identity- und Observability-Grenze definieren, während Produktteams ihre jeweiligen Agentenorchestrierungen behalten.

**Prüffragen:**

- Welche Fähigkeiten sind wiederkehrend genug, um ein Plattformprodukt zu rechtfertigen?
- Welche Varianten dürfen bleiben, weil ihre Domänenrisiken wirklich unterschiedlich sind?
- Welche Migration minimiert Wertstromunterbrechung und wie wird eine Schattenlösung zurückgeführt?
- Welche Entscheidung gilt nur temporär, weil Modell-, Provider- oder Regulierungslage sich ändern kann?

### Chief-Entscheidungen

Chief-Arbeit wählt die Stufe 6: Sie finanziert und begrenzt Capabilities. Sie bestimmt, ob ein AI-Gateway, eine Cloudlanding-Zone oder ein Datenprodukt strategisch intern aufgebaut, eingekauft oder nicht angeboten wird. Dazu gehören nicht nur Nutzenversprechen, sondern Risk Appetite, Governance, Souveränität, Talent, Lieferantenvertrag, Betriebsmodell und Exit.

**Prüffragen:**

- Welche Fähigkeit ist so differenzierend oder risikokritisch, dass sie intern verstanden und kontrolliert werden muss?
- Welche Beleglücke verhindert eine verantwortbare Investition oder Freigabe?
- Welche zentralen Standards erzeugen messbare Delivery- oder Sicherheitswirkung und wo wäre Zentralisierung schädlich?
- Was ist der Kill-Switch: Bei welcher Kosten-, Qualitäts-, Security- oder Adoptionsschwelle wird der Ansatz gestoppt oder neu verhandelt?

## Production Checklist

- [x] Die sieben Tiefenstufen unterscheiden Kontext, Mechanismus, Umsetzung, Diagnose, Architektur, Wiederholbarkeit und Portfolio.
- [x] Eigene Erfahrungsevidenz wird als begrenzter Ausgangspunkt und nicht als ungenannte Betriebs- oder Führungswirkung behandelt.
- [x] Der Nachweisworkflow enthält Hypothese, isolierte Umgebung, Gegenprobe, Beobachtung und Folgeschritt.
- [x] Das Commerce-Agentenbeispiel trennt probabilistischen Modelloutput von deterministischer Fachautorität.
- [x] Sicherheits-, Kosten-, Ownership- und Cleanupgrenzen sind für Labs und Architekturartefakte definiert.
- [x] Staff-, Principal- und Chief-Entscheidungen sind mit unterschiedlichen Nachweisen verbunden.
- [x] Der Innovationsabschnitt enthält Reifegrad, Einführungskriterium und Datenschutzgrenze.
- [ ] Die Lab-Fallarbeit wurde nicht gegen einen realen ERP-, Modell- oder Cloud-Dienst ausgeführt.
- [ ] Unabhängige technische Prüfung fehlt; die Datei bleibt im Status technical_review.

## Interviewfragen mit Antwortleitfäden

1. **Was unterscheidet Hands-on-Kompetenz von Architekturkompetenz?**  
   Hands-on zeigt einen abgegrenzten Mechanismus inklusive Fehlpfad. Architektur begründet die Wahl eines Mechanismus oder einer Grenze unter NFRs, Alternativen, Ownership, Betrieb und Kosten. Beides ist notwendig, aber keines impliziert automatisch das andere.

2. **Wie würden Sie aus einer Toolnennung in einem Profil eine Lernplanung ableiten?**  
   Zuerst wird geklärt, ob es sich um produktiven Betrieb, Umsetzung, Prototyp, Konzept, Lab oder bloße Erwähnung handelt. Dann wird eine zulässige Aussage formuliert und die nächste unbelegte Tiefe als Lab, ADR, Diagnoseübung oder Review geplant. Die Toolnennung selbst wird nie als vollständige Kompetenz ausgegeben.

3. **Wann ist ein Lab ausreichend für eine Produktionsentscheidung?**  
   Selten allein. Ein Lab kann Mechanismus, Kompatibilität oder Fehlerklasse reduzieren. Eine Produktionsentscheidung braucht zusätzlich echte Daten- und Sicherheitsgrenzen, Betriebsmodell, Kostenannahme, angemessenen Review und gegebenenfalls einen Pilot mit SLOs und Rollback.

4. **Wie zeigen Sie Diagnosefähigkeit statt nur Implementierungsfähigkeit?**  
   Mit einem Fehlerfall, mehreren Hypothesen, den nötigen Signalen zur Unterscheidung, einer sicheren Sofortmaßnahme und einem dauerhaften Fix. Der Nachweis erklärt, warum eine plausible Alternative ausgeschlossen wurde.

5. **Wann ist Spezialwissen optional, wann Pflicht?**  
   Es ist Pflicht, wenn es den dominanten Sicherheits-, Kosten-, Verfügbarkeits- oder Complianceengpass bestimmt. Sonst genügt Architekturverständnis mit klarer Eskalation. Optional heißt nicht irrelevant; es heißt, dass eine verantwortliche Übergabe definiert wird.

6. **Wie vermeiden Sie einen Golden Path, der Teams blockiert?**  
   Er erhält ein klares Produktziel, sichere Defaults, Dokumentation, Support-SLO, Messung, begründete Ausnahmen und Migrationshilfen. Adoption und Umgehungen werden beobachtet. Ein zentraler Pfad ohne Nutzerfeedback wird nicht als Erfolg gewertet.

7. **Was gehört in eine Chief-Entscheidung zu einer AI-Plattform?**  
   Wert- und Risikohypothese, Capabilitygrenze, Kosten über den Lebenszyklus, Souveränität, Lieferanten- und Talentabhängigkeit, Betriebsmodell, Mindestcontrols, Ausnahmeprozess, Messung und Exit. Sie delegiert Umsetzung, bleibt aber für die strategische Folge verantwortlich.

8. **Warum ist ein Modell nicht die richtige Autorität für fachliche Zustandsänderungen?**  
   Modelloutput ist probabilistisch und kann unvollständig, manipuliert oder falsch sein. Fachliche Autorisierung, Idempotenz und Invarianten müssen deterministisch in einer zuständigen Komponente erzwungen und auditiert werden.

## Praktisches Lab: Vier Nachweisarten für eine sichere Reservierung

**Ziel.** Erzeuge für denselben fiktiven Commerce-Agenten vier unterschiedliche Artefakte: ein Hands-on-Lab, eine Diagnoseübung, ein Architektur-ADR und einen Staff- oder Chief-Entscheidungsentwurf. So wird sichtbar, dass ein Thema auf mehreren Tiefen existiert, ohne dass sich die Artefakte wiederholen.

**Umgebung.** Lokaler Prozess oder Container, synthetische Kunden, Bestellungen und Lagerdaten. Keine echten Tokens, Kundendaten, ERP-Zugänge oder unkontrollierten Cloudressourcen verwenden.

### Teil A: Hands-on-Lab

1. Definiere einen Toolauftrag mit Tenant, Nutzer, Request-ID und Aktion.
2. Implementiere oder simuliere einen Command Handler, der nur erlaubte Aktionen annimmt.
3. Protokolliere den Erfolgspfad mit strukturiertem Audit Event.
4. Gegenprobe: Wiederhole dieselbe Request-ID und erzeuge ein abgelaufenes oder falsches Testclaim.
5. Erwarte genau eine Zustandsänderung, eine klar abgewiesene Berechtigung und keine sensiblen Daten im Log.
6. Entferne Testdaten, Tokens, Container und temporäre Logs.

### Teil B: Diagnoseübung

Simuliere einen Timeout nach persistiertem Command, aber vor der Antwort. Formuliere mindestens drei Ursachen: Downstream-Timeout, Retry-Logik oder fehlende Idempotenz. Bestimme Trace- und Eventdaten, die sie unterscheiden. Beschreibe eine sichere Sofortmaßnahme und den dauerhaften Fix. Markiere, was ohne realen Broker oder ERP noch ungetestet bleibt.

### Teil C: Architektur-ADR

Vergleiche direkten Agentenzugriff mit Gateway plus Command Handler. Bewerte Sicherheitsgrenze, Latenz, Komplexität, Auditierbarkeit, fachliche Invariante, Betrieb, Kosten und Exit. Lege eine Entscheidung samt Rollback und Re-Evaluation fest. Verwende Annahmen deutlich als Annahmen.

### Teil D: Staff- oder Chief-Entwurf

Wähle eine der beiden Fragen:

- Staff: Welche minimalen Contract Tests, Telemetrieattribute und Templates machen den sicheren Weg für ein zweites Team wiederholbar?
- Chief: Unter welchen Kriterien wird eine zentrale Tool-Gateway-Fähigkeit finanziert, begrenzt, gemessen oder beendet?

**Abnahme.** Alle vier Artefakte müssen unterschiedliche Aussagen tragen. Das Lab beweist keinen Plattformstandard; der Chief-Entwurf beweist keine funktionierende Implementierung. Jede zentrale Behauptung hat eine Gegenprobe oder ein offenes Risiko.

**Labstatus:** reviewed_only. Die Anleitung wurde auf Struktur, negative Tests, Datensparsamkeit und Rückbau geprüft, aber nicht als reale Integration ausgeführt.

## Dependencies, Cross-References und Quellen

Die Claimgrenzen stammen aus [KB-0004](04-cv-istbild-und-zielkompetenzen.md); Wirkung, Reichweite und Kompetenzcanvas aus [KB-0005](05-kompetenzmodell-fuer-staff-principal-und-chief.md). Lernwellen, Versionierung und Labstrategie folgen in KB-0007 bis KB-0009. Die Zielrollen in Domain 01 wenden diese Tiefenstufen auf konkrete Verantwortungsbereiche an.

**Verwendete Quellen, Stand 2026-09-14.**

- Masterplan: Zielrollen und Prioritäten
- Artikelvertrag: Nachweisarten, Labstatus und Reviewregeln
- [MCP-Spezifikation vom 2026-07-28](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
- [A2A Protocol Specification](https://a2a-protocol.org/dev/specification/)

## Bonus: New Tech and Innovations

**Stand: 2026-09-14.** Tool- und Agenteninteroperabilität entwickelt sich von einzelnen SDK-Integrationen zu versionierten Verträgen mit Identitäts-, Erweiterungs- und Migrationsfragen. Die MCP-Spezifikation vom 2026-07-28 und die A2A-Spezifikation zeigen, warum „eine Verbindung zum Agentenprotokoll herstellen“ keine ausreichende Lerntiefe ist. In einem produktionsnahen Lernnachweis gehören Version, Tool- oder Agentenvertrag, Rechtegrenze, negative Berechtigungsprobe, Trace und Rückfallverhalten zusammen.

Der Reifegrad für ein organisationsweites Kompetenzprogramm ist **Adopting**: Die Protokolle sind dokumentiert und technisch nutzbar, doch SDK-, Gateway-, Identity- und Mandantenkompatibilität muss im jeweiligen Zielsystem überprüft werden. Ein Pilot wird nur angenommen, wenn ein zweites Team einen klar versionierten Vertrag verwenden kann, eine falsche Berechtigung nachweisbar abgewiesen wird, eine inkompatible Änderung als kontrollierter Fehler sichtbar ist und der Migrations- oder Rückbauweg dokumentiert bleibt.
