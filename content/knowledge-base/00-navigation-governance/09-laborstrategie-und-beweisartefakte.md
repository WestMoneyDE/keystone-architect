---
{"id": "KB-0009", "title": "Laborstrategie und Beweisartefakte", "domain": "00", "sequence": 9, "document_type": "navigation", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0004", "concepts": ["Evidenzgrenzen", "zulässige Aussagen", "Lernportfolio"], "needed_for": "understanding"}, {"id": "KB-0006", "concepts": ["Lerntiefen", "Gegenprobe", "Architekturnachweis"], "needed_for": "both"}, {"id": "KB-0008", "concepts": ["Revisionsrecord", "Umgebungskontext", "Recheck-Trigger"], "needed_for": "lab"}], "related": ["KB-0001", "KB-0002", "KB-0005", "KB-0007", "KB-0011", "KB-0031", "KB-0105", "KB-0316", "KB-0350", "KB-0400", "KB-0434", "KB-0464", "KB-0500", "KB-0572", "KB-0618", "KB-0720"], "applies": ["KB-0011", "KB-0031", "KB-0105", "KB-0316", "KB-0350", "KB-0400", "KB-0434", "KB-0464", "KB-0500", "KB-0572", "KB-0618", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Labs sind reproduzierbare, abgegrenzte Experimente mit Hypothese, Umgebung, Messung, Fehlpfad, Ergebnis und Cleanup.", "rationale": "Praktische Tiefe wird an kontrollierter Ausführung und Diagnose gezeigt, nicht an Screenshots oder Toolnennungen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Aus jedem Lab wird eine begrenzte Architekturfrage abgeleitet: Gültigkeitsbereich, Alternativen, NFRs, Daten- und Trust Boundaries, Betrieb und Exit.", "rationale": "Ein Lab reduziert Unsicherheit; es ersetzt keine begründete Architekturentscheidung unter realen Randbedingungen."}, "STAFF-TARGET": {"active": true, "scope": "Wertvolle Labs werden zu Referenzpfaden, Testkits, Runbooks oder Entscheidungsnotizen, die andere sicher nachvollziehen können.", "rationale": "Staff-Wirkung entsteht durch übertragbare Lern- und Betriebsfähigkeit statt private Einzeloptimierung."}, "CHIEF-TARGET": {"active": true, "scope": "Das Laborportfolio priorisiert Capability-Lücken nach Risiko, Wert, Budget, Souveränität und Stopkriterien.", "rationale": "Chief-Entscheidungen finanzieren risikoreduzierende Evidenz und vermeiden teure Piloten ohne verantwortbaren Exit."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Spezialistenlabs werden für kritische Tiefen wie GPU, Netzwerk, Kryptographie oder Recovery mit minimalen Rechten und expliziter Abnahme geplant.", "rationale": "Spezialtiefe wird durch echte Engpässe begründet, nicht als ungesicherte Selbstzuschreibung übernommen."}}, "lab_validation": [{"lab_id": "KB-0009-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Lokaler, synthetischer B2B-Agentenfall ohne externe Produktionsdienste", "evidence": "Die Strategie enthält Ziel, Hypothese, Datenklassifikation, Sicherheitsgrenze, Kostenlimit, Gegenprobe, Auswertung und Cleanup.", "limitations": "Es wurden keine echten Cloud-, GPU-, Kunden- oder Produktionsressourcen provisioniert oder getestet."}]}
---
# Laborstrategie und Beweisartefakte

## Zweck, Definition und Scope

Ein technisches Lab ist kein dekoriertes Tutorial und kein Ersatz für Produktionserfahrung. Es ist ein kontrolliertes Experiment, das eine präzise Hypothese über einen Mechanismus, eine Kompatibilität, eine Fehlerklasse oder eine Architekturannahme testet. Es macht Grenzen sichtbar: Was wurde tatsächlich ausgeführt, was wurde nur entworfen, welche Daten und Kosten waren beteiligt, welche Gegenprobe wurde versucht und welche Schlussfolgerung ist deshalb erlaubt?

Dieses Kapitel definiert die Laborstrategie für die gesamte Knowledge Base. Sie verbindet die Zielrollen GenAI Solution Architect/Engineer, Platform/Enterprise Architect, Cloud Architect sowie MLOps/LLMOps mit sicheren, reproduzierbaren Beweisartefakten. Sie verhindert zwei entgegengesetzte Fehler: Ein kleines lokales Experiment wird nicht als großflächige Produktionspraxis ausgegeben; ein Lab wird aber auch nicht abgewertet, wenn es sauber eine relevante Unsicherheit reduziert.

Nach diesem Kapitel kann der Leser:

1. eine Lernfrage als überprüfbare Hypothese mit klarer Aussagegrenze formulieren;
2. ein Lab mit Umgebung, Datenklasse, minimalen Rechten, Kostenlimit, Messung, Gegenprobe und Cleanup planen;
3. Mechanismus-, Diagnose-, Architektur-, Referenzpfad- und Governanceartefakte voneinander abgrenzen;
4. ein Labresultat in ein ADR, ein Runbook, einen Testkit oder einen Portfolioeintrag überführen;
5. Cloud-, GPU-, Modell- oder Sicherheitslabs ohne unkontrollierte Kosten, Secrets oder Produktionszugriffe vorbereiten;
6. vorhandene Projekterfahrung aus der Selbsteinschätzung, neue Lernartefakte und unabhängige Evidenz sauber getrennt halten.

## Kompetenzmarker und Evidenzgrenzen

| Marker | Status | Konkrete Anwendung |
|---|---|---|
| CURRENT-EVIDENCE | offen | Eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| HANDS-ON-TARGET | aktiv | Jedes Lab beschreibt Hypothese, Aufbau, Messung, Gegenprobe, Ergebnis und Rückbau. |
| ARCHITECT-TARGET | aktiv | Ergebnisse werden nur in der geprüften Reichweite auf Architekturentscheidungen übertragen. |
| STAFF-TARGET | aktiv | Gute Labs werden als nutzbare Referenzartefakte und nicht als private Experimente weitergegeben. |
| CHIEF-TARGET | aktiv | Investitionen in Labumgebungen, Spezialistenzeit und Piloten werden nach Risiko, Wert und Exit gesteuert. |
| SPECIALIST-OPTIONAL | aktiv | Tiefe Spezialistenevidenz bleibt abgegrenzt, mit Abnahme und dokumentierter Übergabe. |

## Mental Model: Hypothese, Kontrolle, Gegenprobe, Grenze

Ein Lab folgt dieser Kette:

Frage → Hypothese → isolierte Umgebung → Kontrollmechanismus → Messung → Gegenprobe → Ergebnis → erlaubte Aussage → offene Grenze → nächster Nachweis.

Beispiel: „Ein Command Handler verhindert bei derselben Request-ID eine doppelte Commerce-Reservierung.“ Die Hypothese wird mit synthetischen Aufträgen und einer lokalen Zustandsablage getestet. Die Gegenprobe sendet denselben Auftrag erneut oder simuliert einen Timeout zwischen Persistenz und Antwort. Das Resultat kann zeigen, ob der gewählte Codepfad in dieser Umgebung idempotent ist. Es kann nicht beweisen, dass ein unbekanntes ERP, ein echter Broker, globale Mehrregionenkonsistenz oder Produktions-SLOs sicher funktionieren.

Die wichtigste Labdisziplin ist deshalb die erlaubte Aussage. Ein Test, der seine Grenze nicht benennt, erzeugt falsches Vertrauen. Ein Lab, das nur seine Grenze nennt und keine Entscheidung beeinflusst, reduziert keine relevante Unsicherheit.

## Prerequisites und Dependencies

[KB-0004](04-cv-istbild-und-zielkompetenzen.md) definiert, wie vorhandener Kontext begrenzt bleibt. [KB-0006](06-praktische-und-architektonische-lerntiefe.md) trennt Mechanismus-, Architektur- und Governance-Nachweise. [KB-0008](08-revisionen-und-versionierungsstrategie.md) sorgt dafür, dass ein Lab nur mit seiner Umgebung, Version und Recheck-Grenze interpretierbar bleibt.

| Beziehung | Datei | Zweck |
|---|---|---|
| Navigation und Status | [KB-0001](01-master-index-und-wegweiser.md), [KB-0007](07-lernwellen-und-fortschrittssteuerung.md) | IDs, Lernwellen, Status und Repriorisierung. |
| Kompetenzmodell | [KB-0002](02-rollen-kompetenz-matrix.md), [KB-0005](05-kompetenzmodell-fuer-staff-principal-und-chief.md) | Zielrollentiefe, Wirkung und Ownership. |
| Technische Anwendungsfelder | [KB-0031](01-master-index-und-wegweiser.md#kb-0031), [KB-0105](01-master-index-und-wegweiser.md#kb-0105), [KB-0316](01-master-index-und-wegweiser.md#kb-0316), [KB-0350](01-master-index-und-wegweiser.md#kb-0350), [KB-0400](01-master-index-und-wegweiser.md#kb-0400), [KB-0464](01-master-index-und-wegweiser.md#kb-0464) | Linux, Architektur, Backend, Messaging, GenAI und Agentik. |
| Produktions- und Portfolioevidenz | [KB-0500](01-master-index-und-wegweiser.md#kb-0500), [KB-0572](01-master-index-und-wegweiser.md#kb-0572), [KB-0618](01-master-index-und-wegweiser.md#kb-0618), [KB-0720](01-master-index-und-wegweiser.md#kb-0720) | Plattform, AI-Betrieb, Governance und langfristige Evidenz. |

## Core Concepts

### Fünf Artefaktklassen

| Klasse | Kernfrage | Erlaubte Schlussfolgerung | Keine Schlussfolgerung |
|---|---|---|---|
| Mechanismuslab | Funktioniert ein abgegrenzter Kontroll- oder Datenpfad? | Dieser Pfad verhält sich in dokumentierter Umgebung wie gemessen. | Produktionsreife oder organisationsweite Wirkung. |
| Diagnosefall | Kann ein Fehler durch beobachtbare Signale eingegrenzt werden? | Ursache und Recovery sind für die Testklasse nachvollziehbar. | Jede echte Störung hat dieselbe Ursache. |
| Architekturfall | Welche Option trägt unter gegebenen NFRs und Grenzen? | Die Entscheidung ist unter den benannten Annahmen begründet. | Die Alternative ist für alle Kontexte schlecht. |
| Referenzpfad | Kann ein anderer Nutzer die sichere Lösung anwenden? | Template, Contract, Testkit und Supportmodell tragen den dokumentierten Use Case. | Jede Produktlogik kann zentralisiert werden. |
| Governance-/Portfolioartefakt | Welche Fähigkeit wird investiert, standardisiert, ausgelagert oder gestoppt? | Mandat, Risiko, Kosten, Owner und Exit sind explizit. | Fachliche oder rechtliche Konformität ohne Kontextprüfung. |

Diese Klassen lassen sich kombinieren, aber nicht gleichsetzen. Ein Agentenlab kann einen Toolvertrag testen. Ein Architekturfall entscheidet, ob der Vertrag über ein Gateway erzwungen wird. Ein Referenzpfad macht Schema und Contract Tests für weitere Teams nutzbar. Ein Governanceartefakt legt fest, wer Ausnahme, Betrieb und Providerwechsel verantwortet.

### Die minimale sichere Laborumgebung

| Element | Mindestregel |
|---|---|
| Daten | Synthetisch, anonymisiert oder ausdrücklich freigegeben; niemals versehentlich echte Kunden-, Personal- oder Geheimdaten. |
| Identität | Eigene Testidentität, minimale Scopes, kurzlebige Tokens, keine globalen Administratorrechte. |
| Netzwerk | Lokal oder isolierte Sandbox; externe Ziele nur bewusst allowlisten. |
| Secrets | Secret Manager oder flüchtige Umgebungswerte; nicht in Code, Screenshots, Logs oder Artikeln. |
| Kosten | Vorab gesetztes Budget, Quota, Abschaltzeitpunkt und nachvollziehbare Verbrauchsmessung. |
| Persistenz | Ephemere Volumes oder klarer Löschpfad; Testzustand nicht mit Produktion vermischen. |
| Beobachtung | Minimal nötige Logs, Metriken oder Traces; Datenminimierung und Redaction. |
| Rückbau | Befehle oder Schritte für Tokens, Container, Daten, Ressourcen, Alerts und Kostenkontrolle. |

Ein Lab muss nicht immer automatisch ausgeführt werden. Ein komplexer GPU-, Cloud- oder regulierter Fall kann reviewed_only bleiben. Der Text muss dann den Status, die fehlende Ausführung und die Gründe klar markieren. Ein vorgetäuschter Test ist schwerwiegender als ein bewusst nicht ausgeführter, aber präzise geplanter Test.

### Hypothesenqualität

Eine schwache Hypothese lautet: „Kubernetes ist skalierbar.“ Eine brauchbare Hypothese lautet: „Bei einer dokumentierten Last schützt ein Ressourcenlimit mit passender Readiness- und HPA-Annahme den Nachbardienst vor CPU-Verdrängung; die Gegenprobe erzeugt Last oberhalb der Annahme und misst Fehler, Latenz und Queueing.“ Die zweite Form benennt Mechanismus, Last, Messung und Fehlgrenze.

| Schlechte Form | Verbesserte Form |
|---|---|
| „RAG funktioniert.“ | „Bei festem, versioniertem Testkorpus erreicht der Retriever eine definierte Trefferabdeckung; leere oder nicht autorisierte Treffer führen zu einer begrenzten Antwort statt erfundener Quelle.“ |
| „MCP ist sicher.“ | „Ein Toolserver lehnt eine falsche delegierte Identität vor der Aktion ab; Trace und Audit Event zeigen die Ablehnung ohne Secretleck.“ |
| „GPU-Slicing spart Kosten.“ | „Unter festem Modell, Batch- und Lastprofil wird GPU-Auslastung, Tail-Latenz, Speicherfragmentierung und Kosten pro erfolgreichem Ergebnis verglichen.“ |
| „Event Sourcing ist robust.“ | „Ein doppeltes Event und ein Unterbruch beim Consumer führen bei dokumentierter Idempotenz und Replaygrenze nicht zu einer doppelten fachlichen Zustandsänderung.“ |

## Architektur und Data Flow eines Labs

Ein Lab hat nicht nur einen Codepfad, sondern auch Trust-, Daten- und Kontrollgrenzen:

Nutzer oder Testtreiber → Testidentität → Eingang / Vertrag → Policy oder Validierung → fachlicher Mechanismus → Testzustand → Ereignis / Audit → Telemetrie → Auswertung → Cleanup.

### Durchgängiger Fall: kontrollierte Reservierungsvorbereitung

Ein fiktiver B2B-Agent beantwortet Bestellstatus und schlägt eine Reservierung vor. Das Modell erzeugt nur eine strukturierte Toolanfrage. Ein Gateway prüft Testidentität und Schema. Ein Command Handler prüft Idempotenz und fachliche Regel. Eine lokale Ereignis- oder Auditablage macht Ergebnis sichtbar. Die Architekturannahme lautet: Keine direkte Zustandsänderung durch Modelloutput.

| Pfad | Beobachtung | Gegenprobe |
|---|---|---|
| Gültige Anfrage | Command wird genau einmal bearbeitet; Audit enthält korrelierbare ID. | Prüfe, dass nur explizit erlaubte Aktion durchgeht. |
| Falsche Audience oder Scope | Ablehnung vor dem Command; keine Zustandsänderung. | Testtoken mit falscher Audience oder abgelaufenem Ablauf. |
| Doppelte Request-ID | Keine doppelte Reservierung; Status ist deterministisch. | Replay derselben Anfrage oder Timeout nach Persistenz. |
| Leere Quellenlage | Agent antwortet begrenzt und löst keine Aktion aus. | Retrieval liefert keine autorisierte Evidenz. |
| Downstream-Fehler | Zwischenstatus oder kontrollierter Retry; kein erfundener Erfolg. | Lokaler Timeout oder bewusst abgewiesener Stub. |

Das Labor liefert gleichzeitig Hands-on-Evidenz und eine Architekturfrage: Reichen diese Kontrollen für den begrenzten Pilot, oder muss ein späterer Production Path zusätzliche Identity-, Daten-, Broker-, DR- und Compliance-Kontrollen enthalten?

## Protokolle, Standards und Werkzeuge

Labs verwenden reale Mechanismen, aber keine willkürlichen Produktlisten.

| Bereich | Sinnvolle Artefakte | Prüffrage |
|---|---|---|
| API und Event | OpenAPI, AsyncAPI, JSON Schema, Protobuf, CloudEvents oder vergleichbarer Contract. | Sind Version, Validierung, Fehlerschema, Idempotenz und Consumergrenze testbar? |
| Identity | OAuth 2.0/OIDC-artige Claims, mTLS oder Workload Identity in Testumgebung. | Ist delegierte Autorität vor der Fachaktion deterministisch erzwungen? |
| Platform | OCI-Images, lokale Container, Kubernetes-Sandbox, Policy- oder GitOps-Manifest. | Sind Ressourcen, Rechte, Version, Rollback und Cleanup beschrieben? |
| Beobachtung | Strukturierte Logs, Metriken, Traces, Testreport. | Korrelieren Signale Aktion, Control und Ergebnis ohne sensible Daten? |
| AI und Evals | Versioniertes Prompt-, Tool-, Modell- und Testset, Evalreport. | Welche Fehlerklasse, Schwelle und Fallbackregel wird tatsächlich geprüft? |
| Nachweis | Git-Revision, ADR, Runbook, CI-Report, redigierter Benchmark. | Was kann ein Reviewer reproduzieren und was bleibt Umgebungsspezifik? |

Normativer Standard und konkrete Implementierung bleiben getrennt. Ein Standard kann eine Funktion beschreiben, ohne dass das gewählte SDK oder Gateway sie vollständig oder in jeder Version unterstützt. Ein Lab notiert deshalb Standardrevision, Implementierungsversion, Umgebung und getestete Fähigkeit.

## Konfiguration und Implementierung

### Laborvertrag-Vorlage

| Feld | Beispiel |
|---|---|
| Fragestellung | Verhindert die Kombination aus Gateway und Command Handler doppelte Reservierung bei Replay? |
| Hypothese | Gleiche Request-ID führt zu genau einem fachlichen Ergebnis; unberechtigte Anfrage wird vor dem Command abgewiesen. |
| Geltungsbereich | Lokaler, synthetischer Test; keine reale ERP- oder Kundenintegration. |
| Versionen | Repositoryrevision, Runtime, SDK, Contractversion, Modellkennung oder Stubversion. |
| Rechte und Daten | Kurzlebige Testidentität, synthetische Daten, keine Adminrechte oder Production Secrets. |
| Last und Budget | Begrenzte Anzahl Requests, lokale Ressourcen oder Sandboxquota, Abschaltzeit. |
| Instrumentierung | Request-/Command-/Event-ID, Fehlerklasse, Latenz, keine vollständigen Payloads. |
| Erfolg | Genau eine Zustandsänderung; erwartete Ablehnungen; keine sensitiven Logs. |
| Gegenprobe | Replay, falscher Scope, abgelaufenes Token, Downstreamtimeout, leere Quelle. |
| Cleanup | Container, Testdaten, Tokens, temporäre Dateien, Sandboxressourcen und Budgetprüfung. |
| Aussage | Was die Resultate stützen und was sie nicht stützen. |
| Recheck | Versionwechsel, neue Datenklasse, größerer Scope, Incident oder neue Abhängigkeit. |

### Ausführungsvorbereitung

1. Prüfe, ob der Use Case synthetische Daten erlaubt und ob alle Zugänge tatsächlich Testzugänge sind.
2. Lege ein Ressourcen- und Kostenlimit fest. Bei Cloud oder GPU: Tags, Quotas, automatische Abschaltung und eine sichtbare Budgetgrenze.
3. Versioniere Konfiguration, Testinput und erwartete Ergebnisse. Ein Screenshot allein ist kein Beweis.
4. Beginne mit der kleinsten Testfläche. Erst wenn die Kernhypothese trägt, erweitere Last, Fehlerklasse oder Architekturvariante.
5. Führe den Erfolgstest und die Gegenprobe aus. Wenn keine Ausführung autorisiert oder möglich ist, bleibe reviewed_only.
6. Speichere nur redigierte, minimale Evidenz und sichere Diagnoseinformationen.
7. Führe Cleanup durch und kontrolliere verbleibende Ressourcen, Kosten und Tokens.
8. Leite eine Entscheidung ab: Hypothese bestätigt, unklar, widerlegt oder für anderen Kontext irrelevant.

## Skalierbarkeit und Performance

Ein Labportfolio wird unwartbar, wenn jede Übung eigene Infrastruktur, unklare Daten oder einen Sonderprozess verlangt. Skalierbarkeit bedeutet, dass viele Labs dieselben sicheren Bausteine wiederverwenden können: Testidentität, synthetische Datensets, Contract-Test-Harness, Telemetrieschema, Budgetkontrolle, Cleanup und Evidenzformat.

| Engpass | Schädliches Muster | Skalierbarer Gegenmechanismus |
|---|---|---|
| Cloud/GPU-Kosten | Dauerhafte Sandboxen, ungetaggte Ressourcen, große Last ohne Hypothese. | Zeitlimit, Budget, kleine Testmatrix, automatische Abschaltung und Kostenreport. |
| Testdaten | Kopien realer Daten für „Realismus“. | Synthetische oder freigegebene minimale Daten, Maskierung, klare Klassifikation. |
| Reviewzeit | Jede Übung wird wie eine Produktionsfreigabe behandelt. | Risiko- und Artefaktklasse bestimmen Umfang des Reviews. |
| Varianten | Jede Person baut einen eigenen unvereinbaren Teststack. | Referenzharness, Templates und dokumentierte Nicht-Ziele. |
| Telemetrie | Vollständige Payloads und hohe Kardinalität als Standard. | Ereignisorientierte, redigierte Attribute und abgestufte Detailtiefe. |

Performance bedeutet hier nicht nur Durchsatz. Sie umfasst die Zeit, eine Hypothese sicher zu prüfen, die Ursache eines Fehlers zu erkennen, eine relevante Entscheidung zu treffen und die Umgebung ohne Restkosten zurückzubauen.

## Reliability und Failure Modes

| Failure Mode | Symptom | Schutz und Recovery |
|---|---|---|
| Happy-Path-Demo | Erfolg ohne Fehlpfad oder Messung. | Mindestens eine Gegenprobe, klare Erfolgsschwelle und Ergebnisprotokoll. |
| Test-/Produktionsvermischung | Echte Daten oder Zugänge in Labdateien. | Isolierte Accounts, Datensparsamkeit, Secret-Management und Cleanup. |
| Unreproduzierbarer Erfolg | Keine Version, Umgebung oder Eingabe vorhanden. | Laborvertrag und Revisionsrecord; bei Lücke Aussage zurückstufen. |
| Kostenleck | Ressource läuft nach Übung weiter. | Budgetalarm, Timer, Tagging, Quota und kontrollierter Rückbau. |
| Scheindiagnose | Neustart gilt als Fix; Ursache unbekannt. | Hypothesenliste, Telemetrie, unterscheidende Tests und Folgebeobachtung. |
| Übertragungsfehler | Lokales Resultat wird zur Plattform- oder Compliancebehauptung. | Aussagegrenze, Architekturfall, unabhängiger Review und Pilotkriterien. |
| Artefaktverlust | Nur Autor kennt Setup und Ergebnis. | Redigierte Konfiguration, Testdaten, Runbook, Hash und nachvollziehbarer Speicherort. |

## Security, Governance und Compliance

Ein Lab darf nie die Sicherheitsregeln unterlaufen, die es später lehren soll. Keine Produktionssecrets in Prompt, Log oder Repository; keine unkontrollierte Toolaktion; keine Kunden-, Gesundheits-, Finanz- oder Personaldaten für Komfort; keine offenen Netzwerkzugriffe ohne Zweck und keine dauerhaften privilegierten Testidentitäten.

Governance richtet sich nach Risiko und nicht nach der Größe des Labs:

| Situation | Erforderliche Kontrolle |
|---|---|
| Lokaler Mechanismustest | Selbstreview, Testdaten, Cleanup, klare Statusgrenze. |
| Gemeinsame Sandbox | Umweltowner, Zweck, Zugriffsmodell, Kostenlimit und Peer Review. |
| Cloud-, GPU- oder Modellpilot | Budget, Daten- und Vendorprüfung, Logginggrenze, Rollback und Freigabe durch passende Owner. |
| Produktionsnaher oder regulierter Test | Fachowner, Security/Privacy nach Kontext, Changeprozess, SLO, Incident- und Abbruchplan. |

Rechts- oder Complianceaussagen werden nicht durch ein erfolgreiches Lab bewiesen. Ein Test kann zeigen, dass ein Control in seiner Umgebung funktioniert. Die anwendbare Pflicht, der Geltungsbereich und der Auditnachweis müssen in den Governance- und Compliancekapiteln gesondert geprüft werden.

## Observability und Troubleshooting

Ein Lab muss die kleinste sinnvolle Signalkette erzeugen:

Test-ID → Eingabe- oder Policyentscheidung → fachlicher Command oder Ablehnung → Event/Audit → Metrik/Trace → Ergebnis.

| Frage | Beobachtbares Signal |
|---|---|
| Wurde die Hypothese ausgeführt? | Test-ID, Konfiguration, Start-/Endzeit, Artefaktrevision. |
| Wurde der Controlpunkt erreicht? | Validierungsentscheidung, Policyresultat, erlaubter oder abgewiesener Pfad. |
| Trat die Fachwirkung ein? | Commandstatus, Event, Zustandsänderung oder deterministische Ablehnung. |
| Was kostete oder belastete es? | Laufzeit, Requests, Ressourcen, Token/GPU/Cloud-Verbrauch in begrenzter Form. |
| War Cleanup vollständig? | Keine laufenden Ressourcen, abgelaufene Tokens, gelöschte Testdaten, Kostenkontrolle. |

**Troubleshooting: Gegenprobe liefert unerwartet Erfolg.** Prüfe zuerst, ob die Gegenprobe wirklich den relevanten Eingang erreicht hat. Vergleiche Testidentität, Contractversion, Featureflags, Caches und Testdaten. Dann bestimme, ob die Hypothese widerlegt ist oder ob das Instrument falsch war. Ein unerwarteter Erfolg darf nicht durch einen stillen Testfix verschwinden; er ist ein Security- oder Architekturhinweis, bis die Ursache geklärt ist.

## Cost und FinOps

Labs sind Investitionen in Unsicherheitsreduktion. Ihr Wert liegt nicht in maximaler Infrastruktur, sondern in einer Entscheidung, die dadurch sicherer, günstiger oder schneller wird.

| Labtyp | Direkte Kosten | Entscheidungswert | Kontrolle |
|---|---|---|---|
| Lokal und synthetisch | Zeit, lokaler Compute. | Mechanismus, Contract und Fehlerklasse schnell prüfen. | Kleine Daten, begrenzte Laufzeit, Cleanup. |
| Cloud-Sandbox | Compute, Speicher, Netzwerk, Serviceverbrauch. | Region, Netzpfad, IAM, Managed Service oder Skalierungsannahme prüfen. | Budget, Tags, Quotas, Auto-Shutdown, Kostenreport. |
| GPU-/Inference-Lab | GPU-Stunden, Modellartefakte, Energie, Observability. | Latenz, Speicher, Throughput, Qualitäts-/Kostenkompromiss prüfen. | Feste Testmatrix, Limit, Warteschlangen- und Abbruchregel. |
| Shared Platform Lab | Support, Pflege, Security Review, Migration. | Referenzpfad und Teamadoption prüfen. | Nutzerfeedback, SLO, Ausnahme- und Exitmodell. |
| Production Pilot | On-call, Risiko, ggf. Vertrag und Compliance. | Reale Nutzer- und Betriebswirkung prüfen. | Risikofreigabe, Kill Switch, SLO, Rollback und klare Scopegrenze. |

Ein teures Lab ohne klare Hypothese ist Verschwendung. Ein zu kleines Lab kann ebenfalls teuer sein, wenn es eine kritische Migration mit falschem Vertrauen vorbereitet. Chief- und Principal-Entscheidungen steuern deshalb Portfolio, nicht nur Einzelbudget: Welche Unsicherheit ist strategisch, welche wird mit einem Partner oder Spezialisten geprüft und welche Idee wird bewusst nicht weiter finanziert?

## Trade-offs und Anti-Patterns

| Wahl | Vorteil | Risiko |
|---|---|---|
| Kleine lokale Simulation | Schnell, günstig, sicher. | Verfehlt reale Provider-, Netzwerk- oder Hardwareeffekte. |
| Produktionsnahe Sandbox | Bessere Kontextevidenz. | Höhere Kosten, Daten- und Zugriffsrisiken. |
| Vollautomatisierte Tests | Wiederholbar und gut skalierbar. | Kann falsche Annahme systematisch automatisieren. |
| Manuelle Explorationsübung | Entdeckt unbekannte Fehler. | Schwerer reproduzierbar und vergleichbar. |
| Shared Harness | Transferwirkung und sichere Defaults. | Initiale Pflege- und Plattformkosten. |
| Spezialistenlab | Tiefe an kritischer Grenze. | Abhängigkeit und begrenzte Generalisierbarkeit. |

Anti-Patterns sind: „Es lief einmal“ als Nachweis, Labs ohne Cleanup, echte Kundendaten in einem Test, Adminrechte für Bequemlichkeit, Metriken ohne Frage, Feature-Demos ohne Fehlpfad, Testresultate ohne Version und ein Kontextwechsel von Sandbox zu Produktion ohne neue Freigabe. Auch ein riesiges Homelab ersetzt keinen Architekturvergleich, kein Datenklassifikationsmodell und keinen verantworteten Betrieb.

## Staff-, Principal- und Chief-Entscheidungen

**Staff.** Staff macht aus individuellen Experimenten gemeinsame Fähigkeiten. Ein Staff Engineer entscheidet, welche Testharnesses, Beispielverträge, Dashboards, Runbooks und Reviewroutinen die häufigsten Fehlklassen für mehrere Teams reduzieren. Er misst, ob andere Teams den Pfad tatsächlich nutzen und ob die Supportlast tragbar ist.

**Principal.** Principal verbindet Labportfolios mit technischen Roadmaps. Die Rolle entscheidet, welche Experimente für Plattform, Cloud, Daten, AI oder Security gemeinsam priorisiert werden, welche doppelt sind und wo lokale Varianten zulässig bleiben. Sie verhindert, dass viele kleine Demos eine zentrale Integrations- oder Identityfrage verdecken.

**Chief.** Chief priorisiert Evidenzinvestitionen nach Wert, Risiko, Kapital und Souveränität. Ein Chief kann eine GPU-Strategie erst nach Benchmark, Kapazitäts- und Kostenmodell freigeben, oder eine riskante Agentenfunktion ohne getestete Rechte- und Recoverygrenzen stoppen. Die Rolle verantwortet die Entscheidung über Skalierung, Partner, Standard und Exit, nicht jede Testausführung.

## Production Checklist

- [x] Jeder Labtyp besitzt Hypothese, Geltungsbereich, Datenklasse, Rechte, Messung, Gegenprobe und Cleanup.
- [x] Ausführungsstatus trennt executed, syntax_checked und reviewed_only ehrlich.
- [x] Ergebnis und erlaubte Aussage sind getrennt von Produktions-, Architektur- und Governancebehauptungen.
- [x] Testdaten, Secrets, Netzwerk und Kosten haben sichere Standardgrenzen.
- [x] Der Agentenfall trennt Modellvorschlag, Policy und deterministische Fachautorität.
- [x] Referenzpfad, Spezialistenübergabe, Portfolio und Exit sind auf Staff-, Principal- und Chief-Ebene berücksichtigt.
- [x] Innovationsabschnitt hat Reifegrad, Pilotkriterium und Schutzgrenze.
- [ ] Die Fallarbeit wurde nicht mit echtem ERP, Cloudservice, GPU oder Kundendaten ausgeführt.
- [ ] Kein unabhängiger technischer Review; Status bleibt technical_review.

## Interviewfragen mit Antwortleitfäden

1. **Was macht ein Lab zu belastbarer Evidenz?**  
   Eine präzise Hypothese, dokumentierte Umgebung, minimale Rechte und Daten, Messung, Gegenprobe, Ergebnis, Aussagegrenze und Cleanup. Ein Screenshot oder ein Happy Path reicht nicht.

2. **Wann ist ein reviewed_only Lab sinnvoll?**  
   Wenn Ausführung nicht verantwortbar, nicht autorisiert oder unverhältnismäßig ist, etwa bei teurer GPU-, Cloud- oder Produktionsinfrastruktur. Die Anleitung muss trotzdem technisch kohärent sein und die fehlende Ausführung klar benennen.

3. **Wie verhindern Sie versehentliche Produktionszugriffe?**  
   Durch getrennte Konten, lokale oder isolierte Umgebungen, synthetische Daten, Least Privilege, kurzlebige Secrets, Allowlisting, Budgetlimits und einen überprüften Cleanup.

4. **Wie wird aus einem Lab eine Architekturentscheidung?**  
   Das Resultat reduziert eine konkrete Unsicherheit. Dann werden Alternativen, Daten- und Trust Boundaries, NFRs, Betrieb, Kosten, Ownership, Migration und offene Grenzen in einem ADR oder Architekturfall bewertet.

5. **Warum ist eine Gegenprobe wichtiger als eine Demo?**  
   Sie attackiert die zentrale Behauptung. Erst eine falsche Berechtigung, ein Replay, ein Ausfall oder eine leere Quellenlage zeigt, ob das Control wirklich am richtigen Punkt wirkt.

6. **Wie planen Sie ein GPU-Lab wirtschaftlich?**  
   Mit Hypothese, Testmatrix, fester Modell- und Lastversion, Budget, Quota, Abschaltzeit, Telemetrie für Auslastung und Latenz sowie Cleanup. GPU-Stunden werden gegen die konkret reduzierte Entscheidungunsicherheit bewertet.

7. **Welche Staff-Wirkung kann aus Labs entstehen?**  
   Ein wiederverwendbares Testkit, ein Contract, ein Runbook oder ein Golden Path, der mehreren Teams sichere Defaults und schnellere Diagnose bietet. Die Wirkung wird durch Adoption und Fehlerreduktion geprüft.

8. **Was darf ein früheres Projekt aus der eigenen Selbsteinschätzung im Labportfolio belegen?**  
   Nur den dokumentierten Projektrahmen und die dazugehörige Evidenzart. Ein neues Lab ergänzt separat nachweisbare Fähigkeiten; es schreibt keine alte Projektbeschreibung um und behauptet keine ungenannte Produktionserfahrung.

## Praktisches Lab: Sicherer Nachweis für einen Agenten-Toolvertrag

**Ziel.** Plane einen lokal oder rein dokumentarisch ausführbaren Nachweis, dass ein fiktiver B2B-Agent eine Reservierung nur vorbereitet und eine Zustandsänderung ausschließlich über einen deterministischen Command Handler erfolgt.

**Inputs.**

- Synthetische Kunden, Bestellungen und Lagerbestand.
- Testidentitäten mit erlaubtem, falschem und abgelaufenem Scope.
- Ein versionierter Toolvertrag mit Tenant, Request-ID, Aktion und Payload.
- Lokaler Stub für Commerce-Service und Audit Event.
- Festes Kostenlimit: keine dauerhafte Cloud-, Modell- oder GPU-Ressource.

**Aufbau und Durchführung.**

1. Schreibe Hypothese, Invariante und erlaubte Aussage vor der Implementierung.
2. Zeichne Nutzer, Testidentität, Agent, Gateway, Command Handler, Testzustand und Audit als Daten- und Trust Flow.
3. Führe den positiven Fall mit erlaubter Aktion aus oder beschreibe ihn präzise als reviewed_only.
4. Führe mindestens vier Gegenproben durch: falsche Audience, abgelaufenes Token, doppelte Request-ID und Downstreamtimeout.
5. Messe Status, Fehlerklasse, Korrelations-ID und Zeit; logge keine vollständigen Testpayloads oder Secrets.
6. Bewerte, welche Hypothese bestätigt, widerlegt oder offen ist.
7. Erstelle eine kleine Architekturentscheidung: direkter Agentenzugriff oder Gateway plus Command Handler; nenne Kosten, Latenz, Sicherheitsgrenze und Rollback.
8. Entferne Testdaten, Tokens, Container und temporäre Logs; kontrolliere, dass keine Ressourcen weiter Kosten erzeugen.

**Erwartete Beobachtung.** Eine falsche oder abgelaufene Identität löst keine Fachaktion aus. Doppelte Request-ID führt zu höchstens einer Zustandsänderung. Ein Downstreamtimeout erzeugt keinen erfundenen Erfolg. Das Ergebnis gilt nur für dokumentierte Testumgebung und nicht für eine unbekannte ERP- oder Produktionslandschaft.

**Labstatus:** reviewed_only. Diese Arbeit ist eine vollständige, fachlich geprüfte Anleitung mit synthetischen Annahmen, keine tatsächlich ausgeführte Integrations- oder Produktionsprüfung.

## Dependencies, Cross-References und Quellen

Die Evidenzgrenzen liegen in [KB-0004](04-cv-istbild-und-zielkompetenzen.md), die Nachweistiefen in [KB-0006](06-praktische-und-architektonische-lerntiefe.md) und die Revisionsregeln in [KB-0008](08-revisionen-und-versionierungsstrategie.md). Fachkapitel ab Domain 01 präzisieren die jeweiligen Mechanismen, Datenflüsse und Produktionskriterien.

**Verwendete Quellen, Stand 2026-09-15.**

- Masterplan: Zielrollen, Status und Quellenstand
- Artikelvertrag: Lababnahme, Quellen- und Reviewregeln
- Metadatenschema: Lab- und Evidenzfelder

## Bonus: New Tech and Innovations

**Stand: 2026-09-15.** Lokale, deklarative Sandboxen, policy-gestützte Testumgebungen, ephemeral Infrastructure und KI-gestützte Testfallgenerierung können Labs schneller reproduzierbar machen. Der Reifegrad ist **Adopting** für isolierte Testharnesses und **Emerging** für KI-generierte Testpläne: Sie können Abdeckung und Variation erweitern, aber keine fachliche Invariante, Datenklassifikation oder Produktionssicherheit selbst beweisen.

Ein Pilot ist nur geeignet, wenn die Sandbox ohne Produktionsdaten und dauerhafte Privilegien startet, Kosten- und Abschaltgrenzen durchsetzt, generierte Testfälle menschlich auf fachliche Relevanz geprüft werden und jeder Befund auf Hypothese, Version, Gegenprobe und Artefakt zurückverweist. Ein neues Testtool ist kein Grund, den bestehenden Sicherheits- oder Reviewpfad zu umgehen.
