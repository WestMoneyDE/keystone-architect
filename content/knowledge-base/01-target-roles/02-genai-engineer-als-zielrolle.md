---
{"id": "KB-0012", "title": "GenAI Engineer als Zielrolle", "domain": "01", "sequence": 2, "document_type": "role", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0002", "concepts": ["Rollen-Kompetenz-Matrix", "Nachweisarten", "Tiefenstufen"], "needed_for": "understanding"}, {"id": "KB-0004", "concepts": ["Evidenzgrenzen", "zulässige Aussagen", "Lernziele"], "needed_for": "understanding"}, {"id": "KB-0006", "concepts": ["Hands-on-Tiefe", "Diagnose", "Architekturgrenze"], "needed_for": "understanding"}, {"id": "KB-0009", "concepts": ["Labvertrag", "Gegenprobe", "Cleanup"], "needed_for": "lab"}, {"id": "KB-0011", "concepts": ["Use-Case-Filter", "Toolautorität", "Quality Gate"], "needed_for": "understanding"}], "related": ["KB-0013", "KB-0014", "KB-0015", "KB-0016", "KB-0105", "KB-0316", "KB-0350", "KB-0400", "KB-0434", "KB-0464", "KB-0500", "KB-0572", "KB-0618", "KB-0720"], "applies": ["KB-0400", "KB-0434", "KB-0464", "KB-0500", "KB-0572", "KB-0618", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Die Rolle implementiert und testet den vollständigen Pfad aus Context Assembly, Modellaufruf, Tooladapter, Eval, Telemetrie und Fallback.", "rationale": "GenAI Engineering wird an reproduzierbaren Ergebnissen und negativen Tests gemessen, nicht an einem einzelnen Promptoutput."}, "ARCHITECT-TARGET": {"active": true, "scope": "Der Engineer erkennt und dokumentiert Grenzen, die eine Architekturentscheidung oder Spezialistenreview benötigen, etwa Datenklassifikation, Toolautorität, Skalierung und Providerwechsel.", "rationale": "Praktische Ownership umfasst das rechtzeitige Eskalieren einer Grenze statt die Simulation umfassender Architekturverantwortung."}, "STAFF-TARGET": {"active": true, "scope": "Evaluationsharnesses, Tool-Contracts, Testsets, Observabilitykonventionen und sichere Templates werden als Entwicklerprodukt geteilt.", "rationale": "Staff-Wirkung entsteht, wenn mehrere Engineers dieselben Qualitäts- und Sicherheitsgrenzen zuverlässig einhalten können."}, "CHIEF-TARGET": {"active": true, "scope": "Engineeringevidenz liefert Entscheidungsdaten für Capability, Modellportfolio, Kosten, Risiko, Anbieterstrategie und Investitionspriorität.", "rationale": "Chief-Entscheidungen brauchen reale Qualitäts- und Betriebsdaten, ohne einzelne Engineers zu Portfolioowner zu machen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Spezialisten werden bei Training, tiefem GPU-Serving, formaler Security, komplexen Datenrechten, rechtlicher Bewertung oder organisationsweitem Plattformbetrieb eingebunden.", "rationale": "Der Engineer bleibt für seinen Pfad verantwortlich und macht Spezialabhängigkeiten sichtbar, statt sie als eigene Erfahrung auszugeben."}}, "lab_validation": [{"lab_id": "KB-0012-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Lokaler, synthetischer Retrieval- und Toolfall für B2B-Commerce", "evidence": "Die Anleitung umfasst versioniertes Testset, Quellenfilter, strukturierten Tooladapter, Gegenproben, Evaluationsresultate, Traces und Cleanup.", "limitations": "Kein echtes Modell, keine Kundendaten, kein ERP und keine Produktfreigabe wurden ausgeführt."}]}
---
# GenAI Engineer als Zielrolle

## Zweck, Definition und Scope

Ein GenAI Engineer implementiert den Produktpfad einer AI-Funktion: Nutzerinteraktion, Context Assembly, Modellaufruf, Retrieval, Tooladapter, strukturierte Ergebnisse, Evaluation, Telemetrie, Fehlerbehandlung und sichere Delivery. Die Rolle optimiert nicht nur Prompts. Sie macht Modellverhalten für einen konkreten Use Case messbar und verbindet probabilistische Ausgabe mit deterministisch durchgesetzten Daten-, Rechte- und Fachgrenzen.

Diese Zielrolle ist keine Behauptung eines aktuellen Titels. Bisherige Projekterfahrung des Lernenden liefert höchstens begrenzte Kontexte, aus denen Hands-on- und Architekturziele abgeleitet werden können. Eine GenAI-Engineer-Kompetenz wird erst durch konkrete, versionierte Artefakte, Gegenproben und nachvollziehbare Grenzen belegt.

Nach diesem Kapitel kann der Leser:

1. eine GenAI-Funktion vom Produkt-Outcome bis zu Modell, Quellen, Tool und Fachresultat implementieren;
2. Prompt, Kontext, Retrieval, Toolcontract und Output-Schema als versionierte Komponenten behandeln;
3. Tests und Evals für korrekte, unklare, unberechtigte, adversariale und fehlerhafte Fälle aufbauen;
4. Modelloutput, Toolintention und fachliche Zustandsänderung technisch trennen;
5. Latenz, Kosten, Fehlerraten und Qualitätsklassen mit Traces und Metriken beobachten;
6. Grenzen zu Architecture, Platform, Security, Data, Cloud und Spezialisten konkret eskalieren.

## Kompetenzmarker und Evidenzgrenzen

| Marker | Status | Bedeutung |
|---|---|---|
| CURRENT-EVIDENCE | offen | Eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| HANDS-ON-TARGET | aktiv | Reproduzierbarer End-to-End-Pfad mit Tests, Evals, Gegenproben und Cleanup. |
| ARCHITECT-TARGET | aktiv | Unklare Daten-, Tool-, Skalierungs- oder Providergrenze wird als Architekturfrage dokumentiert. |
| STAFF-TARGET | aktiv | Wiederverwendbare Testsets, Templates und Contracts helfen mehreren Produktteams. |
| CHIEF-TARGET | aktiv | Messdaten unterstützen Portfolioentscheidungen, erzeugen aber keine selbstständige Chief-Verantwortung. |
| SPECIALIST-OPTIONAL | aktiv | Spezialtiefe wird über klare Schnittstellen und Abnahme eingebunden. |

## Mental Model: Probabilistischer Kern, deterministische Schale

Eine sichere GenAI-Funktion besitzt einen probabilistischen Kern und eine deterministische Schale.

Nutzerintention → Authentifizierte Anfrage → Context Assembly → Modell → strukturiertes Ergebnis → Toolpolicy → Domain Command → System of Record → Audit/Trace.

Der probabilistische Kern hilft bei Sprache, Klassifikation, Zusammenfassung, Planung oder Vorschlag. Die deterministische Schale prüft Identity, Berechtigung, Datenzugriff, Schema, Idempotenz, Fachregel, Rate und Audit. Ein GenAI Engineer besitzt beide Seiten des konkreten Produktpfads, delegiert aber tiefere Plattform- und Governancefragen an die passenden Owner.

## Prerequisites und Dependencies

Diese Rolle setzt die Rollenmatrix, Evidenzgrenzen der Selbsteinschätzung, Lerntiefe und Laborstrategie aus Domain 00 sowie den Use-Case- und Freigaberahmen der GenAI-Solution-Architect-Rolle voraus.

| Beziehung | Ziel | Zweck |
|---|---|---|
| required | [KB-0011](01-genai-solution-architect-als-zielrolle.md) | Use-Case-Filter, Daten-/Trustgrenze, Quality Gate und Ownership. |
| related | [KB-0013](03-ai-platform-architect-als-zielrolle.md) | Plattformfähigkeiten und Betriebsgrenzen. |
| related | [KB-0014](04-platform-architect-als-zielrolle.md) | Gemeinsame Entwicklerpfade und Standards. |
| related | [KB-0015](05-enterprise-architect-als-zielrolle.md) | Domänen-, Daten- und Portfolioabhängigkeiten. |
| related | [KB-0016](06-cloud-architect-als-zielrolle.md) | Platzierung, Netzwerk, IAM und Kosten. |
| applies | [KB-0400](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0400) bis [KB-0464](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0464) | GenAI, Agentik und Retrieval. |
| applies | [KB-0572](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0572) | LLMOps und Evaluation. |

## Core Concepts und Implementierungsverantwortung

### Produktpfad statt Promptisolierung

| Schicht | Engineer-Aufgabe | Typische Gegenprobe |
|---|---|---|
| Input | Nutzerabsicht, Tenant, Locale, Request-ID und Eingabegrenzen erfassen. | Zu große, manipulierte oder unberechtigte Eingabe. |
| Context | Zulässige Quellen suchen, filtern, ranken und versioniert zusammenstellen. | Leere Quelle, falscher Tenant, veraltetes Dokument, Prompt Injection im Dokument. |
| Modell | Version, Parameter, Systemprompt und strukturierte Ausgabe kontrollieren. | Ungültiges Schema, Timeout, nicht determiniertes Format, Modellwechsel. |
| Tools | Adapter, Contract, Validierung, Fehlerübersetzung und Policyintegration bauen. | Falscher Scope, unbekanntes Toolargument, Replay, Rate Limit. |
| Domain | Nur zuständiger Service ändert Fachzustand. | Doppelte Request-ID, verletzte Invariante, Downstreamtimeout. |
| Eval | Testset, Fehlerklasse, Schwelle, Regression und Human Review implementieren. | Freundliches Testset verdeckt kritische Fehler. |
| Betrieb | Trace, Metrik, Logredaction, Alert, Kostenattribution und Featureflag betreiben. | Fehlende Korrelation, sensitive Logs, Kostenanstieg, fehlender Rollback. |

### Prompt als versionierte Konfiguration

Ein Prompt ist Teil einer ausführbaren Konfiguration. Er hat Aufgabe, Constraints, Kontextformat, erwartetes Output-Schema, Version und Tests. Der Engineer vermeidet implizite globale Prompts, unversionierte Beispieltexte und Logik, die ausschließlich in natürlicher Sprache versteckt ist. Fachinvarianten, Rechte und Zustandsübergänge werden nicht in den Prompt verlagert.

### Evaluation als Produktqualität

Evals messen spezifische Fehlerklassen. Ein Testset umfasst korrekte, unklare, nicht autorisierte, adversariale und degradierte Fälle. Eine Qualitätsschwelle allein genügt nicht: Fehler bei Toolautorisierung, Datenleak oder falscher Fachaktion sind harte Blocker, auch wenn ein Durchschnittsscore hoch ist.

| Fehlerklasse | Erwartete Behandlung |
|---|---|
| Fehlende oder widersprüchliche Quelle | Antwort begrenzen, Rückfrage oder Übergabe. |
| Nicht autorisierter Kontext | Vor Retrieval bzw. Context Assembly abweisen; keinen Hinweis auf geschützten Inhalt geben. |
| Strukturfehler | Output parsen und validieren; kontrolliert reparieren oder ohne Tool abbrechen. |
| Falscher Toolversuch | Policy-/Schemafehler vor Domain Command; auditierbarer Fehler. |
| Fachlicher Konflikt | Domainservice entscheidet; Modelltext kann Invariante nicht überstimmen. |
| Anbieter- oder Netzwerkfehler | Timeout, Retrybudget, Fallback oder degradierter Modus. |
| Qualitätsregression | Featureflag, Rollback, Ursachenanalyse gegen Baseline. |

## Architektur und Data Flow

### Referenzfall: Retrieval-gestützter Bestellassistent

Ein Nutzer fragt: „Kann ich Auftrag 4711 reservieren?“ Die Anwendung authentifiziert Nutzer und Tenant. Der Engineer lädt nur für diesen Tenant berechtigte Bestell- und Wissenskontexte. Das Modell erklärt Status und erzeugt gegebenenfalls eine strukturierte Reservierungsvorbereitung. Ein Tooladapter prüft Schema und delegierte Rechte. Der Commerce-Service prüft Bestand, Request-ID und fachliche Regeln. Der resultierende Event- und Auditpfad ist für Trace und spätere Reconciliation sichtbar.

| Datenpfad | Control |
|---|---|
| Nutzer → API | Authentifizierung, Eingabegrenze, Tenant- und Request-ID. |
| API → Retrieval | ACL-Filter vor Ranking, Quellenprovenance, Freshness. |
| Retrieval → Modell | Kontextbudget, redigierte Daten, versioniertes Format. |
| Modell → Tooladapter | Schema, erlaubte Aktion, Scope, Rate und Audit. |
| Tooladapter → Domainservice | Idempotenz, Fachinvariante, System of Record. |
| Komponenten → Telemetrie | Korrelation, minimale Attribute, Kosten und Fehlerklasse. |

### Implementierungsentscheidungen

Der Engineer entscheidet innerhalb des Architekturrahmens, ob beispielsweise JSON-Schema-Validierung, ein Parser mit Re-Prompt oder ein kontrollierter Fallback für strukturierte Ausgabe am zuverlässigsten ist. Er dokumentiert, wann die Entscheidung Architekturwirkung hat: Neues Tool mit sensiblen Daten, neues Modell mit anderer Datenroute, Änderung der Ereignissemantik, Überschreitung von Kostenbudget oder eine unklare Mehrtenantengrenze.

## Protokolle, Standards und Tools

| Fähigkeit | Typische Technik | Nachweis |
|---|---|---|
| API- und Toolcontract | JSON Schema, OpenAPI, Protobuf, Contract Tests. | Gültige und ungültige Inputs, Version und Fehlercode. |
| Identity | OAuth/OIDC-Claims, Workload Identity, mTLS oder testbarer Adapter. | Falsche Audience/Scope wird vor Toolaktion abgewiesen. |
| Retrieval | Metadatenfilter, ACL, Chunking, Ranking, Zitationsformat. | Autorisierte Quelle, leere Treffer und Prompt-Injection-Gegenprobe. |
| Agenten- / Toolinteroperabilität | MCP/A2A-nahe Contracts, Task- oder Tool-Schemas. | Versions- und Auth-Grenze, Trace und kontrollierter Fehler. |
| Evals | Versioniertes Testset, Metrik, Fehlerklassen, Regressionstest. | Harte Blocker, Baseline und dokumentierter Review. |
| Beobachtung | OpenTelemetry-ähnliche Trace-IDs, Logs, Metriken, Kostenlabels. | Korrelation ohne sensible Payload oder unbounded cardinality. |
| Delivery | Git, CI, Featureflag, Konfigurationsversion, Rollback. | Geprüfte Änderung und Rückweg. |

## Konfiguration und Implementierung

### Minimaler Engineering-Contract

| Feld | Beispiel |
|---|---|
| Use Case | Bestellstatus erklären und Reservierung vorbereiten. |
| Eingabe | Tenant, Nutzer, Auftrag, Request-ID, Sprache. |
| Quellen | ACL-gefiltertes Testkorpus und System-of-Record-Abfrage. |
| Modell | Explizite Modellkennung, Prompt- und Output-Schemaversion. |
| Tool | Reservierungsvorbereitung mit validiertem Payload, niemals DB-Zugriff des Modells. |
| Eval | 20 synthetische Fälle: korrekt, unklar, leer, unberechtigt, injiziert, Replay, Timeout. |
| Gates | Schema, Policy, Domaininvariante, schwere Fehlerklasse blockiert. |
| Beobachtung | Trace-ID, Versionen, Latenz, Fehlerklasse, Verbrauch; keine Secrets. |
| Fallback | Read-only Antwort oder Supportübergabe; Featureflag aus. |

### Engineering-Ablauf

1. Akzeptanzkriterien und Nicht-Ziele vom Domainowner übernehmen.
2. Kleine Contract- und Testdaten zuerst erstellen.
3. Context Assembly und Retrieval mit ACL- und Leerfall testen.
4. Modelloutput nur in strukturiertes, validiertes Ergebnis überführen.
5. Tooladapter gegen falsche Argumente, Scope und Replay testen.
6. Fachaction im Domainservice mit Idempotenz und Audit testen.
7. Eval- und Telemetriepfad in CI oder kontrollierter Testumgebung ausführen.
8. Regression, Kosten- und Fehlersignale gegen Baseline prüfen; bei Grenzverletzung stoppen oder zurückrollen.

## Skalierbarkeit und Performance

Ein GenAI Engineer optimiert nicht nur Antwortzeit. Er schützt den Gesamtpfad vor Kontextwachstum, Modellrate, Toolkettentiefe, Retrievallast, Tracelast und Kostenanstieg.

| Engpass | Schutz |
|---|---|
| Große Kontexte | Kontextbudget, Retrievaleval, Caching mit Daten- und Freshnessgrenze. |
| Modelllimits | Concurrency- und Ratebudget, Queue, Backpressure, kontrollierter Fallback. |
| Toolkaskade | Maximale Schritte, Timeoutbudget, Zustandsmaschine und Kill Switch. |
| Datenindex | Ingestiongrenze, ACL vor Ranking, Reindex- und Löschpfad. |
| Telemetrie | Sampling, Redaction, kardinalitätsarme Labels und getrennte Auditdaten. |
| Kosten | Per-Request-Attribution, Budgetalarm, Modell-/Promptvergleich und Featureflags. |

## Reliability und Failure Modes

| Failure Mode | Engineer-Reaktion |
|---|---|
| Ungültiger Modelloutput | Strukturiert validieren, begrenzt reparieren oder Toolpfad stoppen. |
| Prompt Injection | Untrusted Content markieren, Toolautorität außerhalb des Prompts erzwingen, Eval erweitern. |
| Falsche Quelle | Provenance, ACL, Freshness und Answer-Policy prüfen. |
| Retry-Sturm | Idempotenz, Backoff, Circuit Breaker und Budget anwenden. |
| Doppelte fachliche Aktion | Request-/Command-ID, Domaininvariante und Eventverarbeitung prüfen. |
| Modellregression | Baseline, Testset, Featureflag und Rollback verwenden. |
| Kostenexplosion | Verbrauch nach Nutzer, Modell, Tool, Retrieval und Trace aufteilen; Scope begrenzen. |

## Security, Governance und Compliance

Engineering setzt Sicherheitsgrenzen um, erfindet aber nicht allein deren Policy. Secrets bleiben aus Prompts, Logs und Testdaten. Berechtigung wird vor Daten- und Toolzugriff geprüft. Untrusted Retrievalcontent wird nicht als Instruktion behandelt. Der Engineer dokumentiert Datenklasse, Modell-/Providerroute, Retentionannahmen, Audit- und Redactionverhalten und fordert Review, wenn eine neue Grenze betroffen ist.

NIST AI RMF kann die Risikofragen strukturieren; er ersetzt keine konkrete Freigabe. Für regulierte oder personenbezogene Systeme prüft die passende Governancefunktion Rolle, Jurisdiktion, Anwendungsfall und Nachweis.

## Observability und Troubleshooting

| Signal | Nutzen |
|---|---|
| Trace über Input, Retrieval, Modell, Tool und Domainresultat | Erlaubt Ursache statt bloßen Modelltext zu sehen. |
| Versionen von Modell, Prompt, Tool und Testset | Macht Regressionen vergleichbar. |
| Fehlerklasse und Gateentscheidung | Zeigt, ob Security, Qualität oder Downstream der Engpass ist. |
| Latenz je Pfadsegment | Trennt Modell, Retrieval, Tool und Netzwerk. |
| Kosten-/Token-/GPU-Verbrauch | Verbindet Engineeringänderung mit wirtschaftlicher Wirkung. |
| Nutzerfeedback oder Human-Review | Schließt Lücke zwischen Offline-Eval und Fachwert. |

**Troubleshooting: Der Output sieht gut aus, aber Nutzer vertrauen ihm nicht.** Prüfe zuerst Quelle, Berechtigung, Erklärbarkeit, Fallback und Fehlerklasse; nicht nur Modelltemperatur. Ein sichtbarer, korrekter Verweis auf eine autorisierte Quelle und eine klare „ich weiß es nicht“-Grenze kann wertvoller sein als ein längerer Text.

## Cost und FinOps

Engineeringentscheidungen beeinflussen Kosten pro gültigem Ergebnis. Kontextreduktion, bessere Retrievalqualität, Caching mit korrekter Scopegrenze, passende Modellwahl, Toolschrittlänge und Sampling können Kosten und Qualität zugleich beeinflussen. Billiger ist nicht besser, wenn ein Modell oder Fallback kritische Fehlklassen vergrößert; teurer ist nicht besser, wenn der Nutzerwert nicht steigt.

Ein Engineer liefert Messdaten und Optionen. Platform-, Cloud- und Chief-Owner entscheiden über gemeinsame Budgets, Providerverträge und Portfolioinvestitionen.

## Trade-offs und Anti-Patterns

| Wahl | Vorteil | Trade-off |
|---|---|---|
| Freitextantwort | Schnell zu bauen. | Schwer zu validieren und sicher an Tools zu koppeln. |
| Strukturiertes Output-Schema | Validierbar und contractfähig. | Parser-/Recoveryaufwand, Schemaevolution. |
| Direktes Tool | Weniger Komponenten. | Größere Autoritäts- und Auditgefahr. |
| Gateway/Adapter | Durchsetzbare Controls und Reuse. | Latenz, Betrieb, Versionierung. |
| Großer Kontext | Mehr potenzielle Information. | Kosten, Privacy, Rauschen, Latenz. |
| Selektives Retrieval | Fokus und Kontrolle. | Gefahr fehlender Treffer; braucht Eval und Fallback. |

Anti-Patterns sind Prompt-only Security, ein unversioniertes Testset, RAG ohne ACL, Tool Calls ohne Contract, Durchschnittsmetrik ohne schwere Fehlerklasse, Logs mit sensiblen Inhalten, CI ohne Umgebungskontext und die Behauptung, ein lokales Demo belege produktive AI-Qualität.

## Staff-, Principal- und Chief-Entscheidungen

**Staff:** macht Eval- und Toolcontractqualität für andere Engineers wiederholbar, etwa durch gemeinsame Testdaten, sichere Adapter, Tracekonvention und Runbooks.

**Principal:** verbindet Produktteams, Plattform und Governance um gemeinsame Modell-, Daten-, Tool- und Evalgrenzen, ohne jede Fachlogik zu zentralisieren.

**Chief:** steuert, welche AI-Fähigkeit intern aufgebaut, als Plattform angeboten, über Partner bezogen oder wegen Risiko, Kosten oder Souveränität nicht skaliert wird.

## Production Checklist

- [x] Produktoutcome, Nicht-Ziel, Datenklasse, Tool- und Fachgrenze sind definiert.
- [x] Prompt, Modell, Kontext, Toolcontract, Testset und Telemetrie sind versionierbar.
- [x] Evals umfassen Quellenlücke, unberechtigten Zugriff, Injection, Strukturfehler, Replay und Timeout.
- [x] Modelloutput kann keine Fachinvariante oder Berechtigung umgehen.
- [x] Kosten, Latenz, Fehlerklassen und Rollback sind Teil der Implementierung.
- [x] Bisheriger Erfahrungskontext und neue Engineeringevidenz bleiben getrennt.
- [x] Innovationsabschnitt enthält Reifegrad, Pilotkriterium und Sicherheitsgrenze.
- [ ] Der Fall ist reviewed_only, nicht mit echtem Modell, ERP oder Kundendaten ausgeführt.
- [ ] Keine unabhängige Prüfung; Status bleibt technical_review.

## Interviewfragen mit Antwortleitfäden

1. **Woran erkennen Sie einen guten GenAI Engineer?**  
   An einer versionierten, testbaren End-to-End-Funktion mit klaren Daten-, Tool- und Fehlergrenzen. Promptbeispiele allein genügen nicht.

2. **Wie testen Sie RAG?**  
   Mit versioniertem Korpus und Testset für korrekte, leere, veraltete, nicht autorisierte und adversariale Fälle. Retrievalqualität, ACL, Zitation und Answer-Policy werden getrennt gemessen.

3. **Warum brauchen Tool Calls ein Schema?**  
   Das Schema macht Eingaben validierbar, versionierbar und testbar. Es ersetzt aber nicht Identity, Policy und fachliche Validierung.

4. **Wie behandeln Sie einen Modellwechsel?**  
   Modell-, Prompt-, Tool- und Datasetversion erfassen, gegen Baseline evaluieren, Featureflag nutzen und bei kritischer Regression zurückrollen. Neue Kosten und Datenroute werden mitbewertet.

5. **Wann stoppt der Engineer statt weiter zu optimieren?**  
   Wenn Daten-, Rechte-, Fach- oder Betriebsgrenze nicht kontrollierbar ist, kritische Evals fehlschlagen, Kostenbudget verletzt wird oder ein Domain-/Securityowner fehlt.

6. **Wie vermeiden Sie Sensitive Data in Traces?**  
   Minimize und redact Attribute, trenne Audit von Debug, kontrolliere Sampling und Zugriffsrechte und teste absichtlich auf Loglecks.

7. **Was unterscheidet Offline-Eval von Produktionsqualität?**  
   Offline-Eval prüft ein definiertes Testset. Produktionsqualität umfasst reale Nutzer, Datenverteilung, Latenz, Kosten, Betrieb, Feedback und Governance. Beide sind nötig.

8. **Wann eskalieren Sie an Platform oder Architect?**  
   Bei neuer Shared Capability, Mehrtenantengrenze, Provider-/Regionfrage, Identitymodell, hoher Skalierung, Sicherheitsrisiko, Datenklasse oder Contractauswirkung über den lokalen Use Case hinaus.

## Praktisches Lab: Versionierter Retrieval- und Toolpfad

**Ziel.** Plane einen fiktiven B2B-Assistenten, der Status aus autorisierten Quellen erklärt und eine Reservierung nur über einen validierten Command vorbereitet.

**Inputs.** Synthetischer Korpus mit erlaubtem, leerem und fremdem Tenantdokument; Testidentitäten; Modellstub; Tool-Schema; lokaler Commerce-Stub; 20 versionierte Testfragen; Budget null oder klar begrenzte Sandbox.

**Durchführung.**

1. Definiere Prompt-, Modell-, Korpus-, Tool- und Testsetversion.
2. Baue Context Assembly mit Tenantfilter vor Retrievalranking.
3. Erzeuge strukturierten Output und validiere ihn vor Toolaufruf.
4. Teste korrekte Antwort, leere Quelle, fremden Tenant, Injection im Dokument, falschen Scope, Replay und Timeout.
5. Miss Gateentscheidung, Fehlerklasse, Latenz und redigierte Trace-ID.
6. Vergleiche gegen Baseline und entscheide Featureflag, Fallback oder Stop.
7. Lösche Testdaten, Tokens, Container und temporäre Logs.

**Erwartete Beobachtung.** Unberechtigte oder leere Quellen erzeugen keine erfundene Fachaktion; ein Schema- oder Scopefehler stoppt vor Command; doppelte Anfrage erzeugt keine doppelte Änderung. Das ist ein Engineeringnachweis im definierten Testscope, keine Produktionsfreigabe.

**Labstatus:** reviewed_only. Die Fallarbeit ist geprüft, aber nicht als echte Modell-, ERP- oder Cloudintegration ausgeführt.

## Dependencies, Cross-References und Quellen

Die Solution-Architect-Rolle [KB-0011](01-genai-solution-architect-als-zielrolle.md) legt die End-to-End-Grenzen fest; dieses Kapitel implementiert sie. Die späteren technischen Domains sind kanonisch für GenAI, Agentik, Retrieval, MLOps, Plattform und Governance.

**Verwendete Quellen, Stand 2026-09-15.**

- Masterplan: Zielrollen und Prioritäten
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [A2A Protocol Specification](https://a2a-protocol.org/dev/specification/)

## Bonus: New Tech and Innovations

**Stand: 2026-09-15.** Versionierte Agenten- und Toolverträge, strukturierte Outputs und automatisch ausführbare Evalregressionen verschieben GenAI Engineering von Prompt-Demos zu testbaren Integrationspfaden. Die A2A-Spezifikation dokumentiert Task-, Idempotenz-, Capability-Validation-, Versioning- und Securityaspekte; das erhöht die Notwendigkeit, Interoperabilität in Testsets, Auth-Gegenproben und Migrationsplänen zu behandeln.

Der Reifegrad ist **Adopting** für begrenzte, versionierte Tool- und Agentenpiloten. Ein Pilot wird nur akzeptiert, wenn ein ungültiger Contract und falsche Autorisierung kontrolliert scheitern, alle beteiligten Versionen und der Auditpfad sichtbar sind, eine schwere Evalfehlerklasse den Release blockiert und ein Featureflag den Pfad ohne Fachzustandsverlust deaktivieren kann.
