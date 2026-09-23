---
{"id": "KB-0010", "title": "Glossar und Notationsregeln", "domain": "00", "sequence": 10, "document_type": "navigation", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [], "related": ["KB-0001", "KB-0002", "KB-0003", "KB-0004", "KB-0005", "KB-0006", "KB-0007", "KB-0008", "KB-0009", "KB-0011", "KB-0031", "KB-0105", "KB-0198", "KB-0316", "KB-0400", "KB-0464", "KB-0500", "KB-0572", "KB-0618", "KB-0720"], "applies": ["KB-0011", "KB-0031", "KB-0105", "KB-0198", "KB-0316", "KB-0400", "KB-0464", "KB-0500", "KB-0572", "KB-0618", "KB-0720"], "dependency_status": "none_required", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Notation macht Labinputs, Umgebungen, Metriken, Fehlerklassen, Teststatus und Cleanup reproduzierbar lesbar.", "rationale": "Praktische Evidenz ist nur prüfbar, wenn Einheiten, Namen, IDs und Grenzen eindeutig sind."}, "ARCHITECT-TARGET": {"active": true, "scope": "Diagramm-, Datenfluss-, Vertrauens- und Entscheidungsnotation verbindet technische Mechanismen mit Ownership und NFRs.", "rationale": "Architekturartefakte müssen klare Grenzen und Entscheidungen zeigen, statt Symbole ohne Semantik zu sammeln."}, "STAFF-TARGET": {"active": true, "scope": "Gemeinsame Terminologie verhindert Fehlübergaben und ermöglicht Referenzpfade, Reviews und Runbooks über Teamgrenzen.", "rationale": "Staff-Wirkung braucht eine Sprache, die unterschiedliche Fachdomänen präzise verbindet."}, "CHIEF-TARGET": {"active": true, "scope": "Portfolio- und Governancebegriffe unterscheiden Capability, Standard, Ausnahme, Risiko, Investition und Exit.", "rationale": "Chief-Entscheidungen werden nur überprüfbar, wenn Begriffe für Wirkung und Verantwortung nicht austauschbar sind."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Spezialnotation für Netzwerk, GPU, Kryptographie, Datenbank oder formale Modelle wird in kanonischen Fachartikeln vertieft und hier nur eindeutig abgegrenzt.", "rationale": "Das Glossar bietet Übersetzung und Verweis, keine oberflächliche Kopie spezialisierter Mechanik."}}, "lab_validation": [{"lab_id": "KB-0010-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Redigierter, fiktiver Architektur- und Laborfall für einen B2B-Agenten", "evidence": "Die Übung verwendet die Notation für Datenfluss, Trust Boundaries, Fehlerklasse, Metrik, Evidenz und Entscheidung konsistent.", "limitations": "Es wurde kein reales System implementiert; die Übung bestätigt nur die Verständlichkeit der Notationskonvention."}]}
---
# Glossar und Notationsregeln

## Zweck, Definition und Scope

Die Knowledge Base verwendet deutschsprachige Erklärungen und die etablierten englischen Fachbegriffe. Das ist kein Stilmittel: Standards, APIs, Fehlermeldungen, Konfigurationen und Herstellerdokumentation verwenden häufig Englisch, während Architektur- und Governanceentscheidungen im deutschsprachigen Kontext präzise kommuniziert werden müssen. Dieses Glossar legt deshalb eine gemeinsame Bedeutung, Abkürzung und Notation fest.

Das Kapitel ist keine Ersatzencyclopädie für die 720 Fachartikel. Es definiert Begriffe so weit, dass Leser den Geltungsbereich, eine Aussagegrenze und den richtigen kanonischen Verweis erkennen. Tiefe Mechanismen bleiben in ihrer Fachdomain. Ein Glossareintrag zu Idempotenz erklärt die Kernidee und die Notation; die vollständige Event- und Persistenzsemantik gehört in Messaging-, Datenbank- und Distributed-Systems-Kapitel.

Nach diesem Kapitel kann der Leser:

1. deutsche und englische Kernbegriffe konsistent verwenden und gleich klingende Begriffe voneinander abgrenzen;
2. IDs, Pfade, Versionen, Quellen, Status und Evidenz ohne Mehrdeutigkeit lesen;
3. Datenfluss-, Trust-, Control-, Fehler- und Ownershipnotation in Architekturartefakten anwenden;
4. Metriken, Zeit, Kosten, Kapazität und Konfidenz mit Einheiten und Aussagegrenze ausdrücken;
5. Erfahrungsevidenz aus der Selbsteinschätzung, Labnachweis, Architekturentscheidung, Betriebsbeobachtung und Governanceentscheidung unterscheiden;
6. für eine unbekannte Abkürzung die kanonische Domain wählen, statt eine ungesicherte Definition zu erfinden.

## Kompetenzmarker und Evidenzgrenzen

| Marker | Status | Bedeutung |
|---|---|---|
| CURRENT-EVIDENCE | offen | Eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| HANDS-ON-TARGET | aktiv | Labs werden mit klaren IDs, Versionen, Teststatus, Metriken, Fehlerklassen und Cleanup gelesen. |
| ARCHITECT-TARGET | aktiv | Diagramme und Entscheidungsartefakte machen Daten-, Vertrauens-, Kontroll- und Ownershipgrenzen explizit. |
| STAFF-TARGET | aktiv | Gemeinsame Begriffe reduzieren Missverständnisse in Referenzpfaden, Reviews, Runbooks und Übergaben. |
| CHIEF-TARGET | aktiv | Portfolio-, Risiko-, Standard-, Ausnahme- und Exitbegriffe bleiben voneinander getrennt. |
| SPECIALIST-OPTIONAL | aktiv | Tiefe fachspezifische Notation wird über kanonische Artikel erschlossen, nicht hier vorgetäuscht. |

## Mental Model: Ein Begriff ist ein Vertrag

Ein Fachbegriff ist ein kleiner Vertrag zwischen Autor, Leser und System. Der Vertrag beantwortet vier Fragen:

Begriff → präzise Bedeutung → Geltungsbereich → Verwechslungsgefahr.

„Verfügbarkeit“ kann zum Beispiel Service Uptime, Anteil erfolgreicher Anfragen, erreichbare Daten oder geschäftliche Nutzbarkeit meinen. Ohne Kontext ist die Aussage wertlos. Dieses Glossar verlangt daher: Metrik, Zeitfenster, Scope und Ausschlüsse nennen. Ebenso ist „sicher“ kein Ergebnis; es muss einen konkret erzwungenen Control, eine Bedrohung und eine verbleibende Grenze geben.

Begriffe werden nach folgender Regel eingeführt: Beim ersten Gebrauch steht die deutsche Erklärung und gegebenenfalls der englische Fachbegriff in Klammern. Danach wird eine einheitliche Kurzform verwendet. Abkürzungen werden beim ersten Vorkommen ausgeschrieben. Produktnamen bleiben Produktnamen und werden nie als allgemeiner Mechanismus verwendet.

## Prerequisites und Dependencies

Dieses Glossar ist ohne technische Voraussetzung lesbar. Für Status, Evidenz und Datenmodell verweist es auf die Navigationsartikel. Für tiefe Fachdefinitionen verweist es auf die kanonischen Domains.

| Beziehung | Datei | Zweck |
|---|---|---|
| Index, Status, Kanten | [KB-0001](01-master-index-und-wegweiser.md), [KB-0003](03-vollstaendiger-abhaengigkeitsgraph.md), [KB-0008](08-revisionen-und-versionierungsstrategie.md) | IDs, Statusmodell, Verweise und Revisionen. |
| Evidenz und Tiefe | [KB-0004](04-cv-istbild-und-zielkompetenzen.md), [KB-0005](05-kompetenzmodell-fuer-staff-principal-und-chief.md), [KB-0006](06-praktische-und-architektonische-lerntiefe.md), [KB-0009](09-laborstrategie-und-beweisartefakte.md) | Claimgrenze, Kompetenz, Nachweis und Labstatus. |
| Technische Kernbegriffe | [KB-0031](01-master-index-und-wegweiser.md#kb-0031), [KB-0105](01-master-index-und-wegweiser.md#kb-0105), [KB-0198](01-master-index-und-wegweiser.md#kb-0198), [KB-0316](01-master-index-und-wegweiser.md#kb-0316), [KB-0400](01-master-index-und-wegweiser.md#kb-0400), [KB-0464](01-master-index-und-wegweiser.md#kb-0464) | Betriebssystem, Architektur, Netzwerk, Backend, GenAI und Agentik. |
| Betrieb und Governance | [KB-0500](01-master-index-und-wegweiser.md#kb-0500), [KB-0572](01-master-index-und-wegweiser.md#kb-0572), [KB-0618](01-master-index-und-wegweiser.md#kb-0618), [KB-0720](01-master-index-und-wegweiser.md#kb-0720) | Plattform, AI-Betrieb, Governance und Portfolio. |

## Kernbegriffe

### Architektur, Datenfluss und Verantwortung

| Begriff | Bedeutung | Nicht gleichsetzen mit |
|---|---|---|
| Architektur (architecture) | Begründete Struktur von Komponenten, Grenzen, Schnittstellen, Qualitätsattributen, Entscheidungen und Änderungsfolgen. | Ein Diagramm oder eine Produktliste. |
| Komponente (component) | Abgegrenzte Einheit mit Verantwortung und Interface. | Beliebiger Prozess, Container oder Team. |
| Schnittstelle / Vertrag (interface / contract) | Vereinbarte Form, Semantik, Fehler und Kompatibilität einer Interaktion. | Reiner HTTP-Endpunkt ohne Ownership oder Fehlerverhalten. |
| Datenfluss (data flow) | Weg und Transformation von Daten zwischen Quellen, Komponenten und Senken. | Kontrollfluss oder Organisationsdiagramm. |
| Kontrollfluss (control flow) | Reihenfolge, in der Entscheidungen, Aufrufe oder Zustandsübergänge erfolgen. | Dateninhalt oder Netzwerkroute. |
| Trust Boundary | Grenze, an der Identität, Autorität, Datenklasse oder Annahmen neu geprüft werden müssen. | Netzwerksegment allein. |
| Control | Technischer oder organisatorischer Mechanismus, der ein Risiko begrenzt oder entdeckt. | Eine unverbindliche Richtlinie. |
| Invariante (invariant) | Eigenschaft, die über erlaubte Zustandsübergänge erhalten bleiben muss. | Ein Wunsch oder eine typische Erfolgsbedingung. |
| System of Record | Autoritative Quelle für einen fachlichen Zustand. | Cache, Search Index oder Modellkontext. |
| Owner | Rolle oder Team, das eine Entscheidung, Schnittstelle, SLO oder Datenqualität verantwortet. | Die Person, die zuletzt Code geändert hat. |
| RACI | Aufteilung von Responsible, Accountable, Consulted und Informed. | Ersatz für technische Ownership oder Incident-Runbook. |

### Zuverlässigkeit, Betrieb und Leistung

| Begriff | Bedeutung | Notationsregel |
|---|---|---|
| SLI | Quantitativ gemessener Indikator, etwa Anteil erfolgreicher Requests. | Nennt Zähler, Nenner, Zeitfenster und Ausschlüsse. |
| SLO | Zielbereich für einen SLI in einem Zeitraum. | Beispiel: mindestens 99,9 Prozent erfolgreicher, autorisierter Requests in 30 Tagen. |
| SLA | Vertragliche Vereinbarung mit Folgen bei Verfehlung. | Nicht aus einer internen SLO ableiten. |
| Fehlerbudget (error budget) | Tolerierter Abstand zwischen SLO und perfektem Erfolg. | Nur mit SLO, Zeitfenster und Verbrauchslogik verwenden. |
| Latenz | Zeit für einen klar definierten Vorgang. | p50, p95, p99 und Messgrenze unterscheiden. |
| Durchsatz (throughput) | Menge abgeschlossener Arbeit pro Zeit. | Einheit nennen, etwa requests/s oder events/min. |
| Backpressure | Mechanismus, mit dem ein überlasteter Empfänger Zufluss begrenzt oder signalisiert. | Nicht gleich Retry oder Rate Limit. |
| Timeout | Obere Wartezeit, nach der ein Vorgang abgebrochen oder anders behandelt wird. | Ursache und idempotente Folge nennen. |
| Retry | Kontrollierter Wiederholungsversuch nach Fehler. | Budget, Backoff, Jitter und Duplikatgrenze klären. |
| Recovery | Wiederherstellung eines definierten sicheren Zustands oder Dienstes. | Ein bloßer Neustart ohne Ursache oder Datenprüfung. |
| RTO / RPO | Zielzeit bis Wiederherstellung / maximal tolerierter Datenverlust. | Einheit, Workload, Szenario und Teststatus angeben. |

### Verteilte Systeme, API und Daten

| Begriff | Bedeutung | Verwechslungsgefahr |
|---|---|---|
| Idempotenz (idempotency) | Mehrfach ausgeführte, logisch gleiche Operation erzeugt denselben erlaubten Fachzustand. | Identische Netzwerkantwort oder exakt-once-Transport. |
| Exactly once | Kontextabhängige Garantie über Verarbeitung oder Effekt; selten end-to-end absolut. | Idempotenz, deduplizierter Consumer oder atomare Datenbanktransaktion. |
| At least once | Zustellung kann Duplikate erzeugen, Verlust wird durch Wiederholung reduziert. | Garantie, dass jeder Consumer exakt einmal verarbeitet. |
| Event | Fakt über einen Zustandsübergang oder ein beobachtetes Ereignis. | Command, der eine Änderung anfordert. |
| Command | Absicht, eine fachliche Aktion auszuführen. | Event, das bereits geschehene Tatsache beschreibt. |
| Schemaevolution | Geplante Änderung eines Datenvertrags bei kompatiblen oder kontrolliert migrierten Verbrauchern. | Nur ein neues JSON-Feld. |
| Outbox | Muster, das fachliche Zustandsänderung und spätere Eventpublikation zuverlässig koppelt. | Globale Exactly-once-Garantie. |
| Reconciliation | Abgleich und Korrektur divergierender Zustände zwischen Systemen. | Sofortige transaktionale Konsistenz. |
| Cache | Nichtautoritative, meist beschleunigende Kopie. | System of Record. |
| Datenresidenz | Ort bzw. Jurisdiktionsbezug, in dem Daten gespeichert oder verarbeitet werden. | Datenschutzgarantie ohne gesamte Datenflussanalyse. |

### Security, Identität und Privacy

| Begriff | Bedeutung | Nicht gleichsetzen mit |
|---|---|---|
| Authentifizierung (authentication) | Prüfung, wer oder was eine Identität ist. | Autorisierung. |
| Autorisierung (authorization) | Prüfung, ob eine Identität eine Aktion auf Ressource ausführen darf. | Einmaligem Login. |
| Delegation | Übertragung begrenzter Handlungsbefugnis von einer Identität oder Rolle an eine andere. | Freiem Weitergeben eines langlebigen Secrets. |
| Audience | Beabsichtigter Empfänger eines Tokens oder Credentials. | Scope oder Rolle. |
| Scope | Begrenzter Berechtigungsbereich für Aktionen oder Ressourcen. | Vollständige fachliche Policy. |
| Least Privilege | Minimal nötige Rechte und Dauer für eine Aufgabe. | Keine Rechte oder eine nur theoretische Empfehlung. |
| Workload Identity | Nichtmenschliche Identität für Prozess, Pod, Dienst oder Job. | Benutzerkonto oder eingebettetes Passwort. |
| Secret | Vertraulicher Wert mit Schutzbedarf, etwa Schlüssel oder Token. | Konfigurationswert ohne Geheimhaltung. |
| Threat Model | Modell von Assets, Angreifern, Eintrittspfaden, Controls und Rest-Risiko. | Liste allgemeiner Securitybegriffe. |
| PII / personenbezogene Daten | Daten, die eine Person direkt oder indirekt identifizieren können, abhängig vom Kontext. | Jede technische ID pauschal oder keine technische ID. |
| Redaction | Entfernen oder Maskieren schutzbedürftiger Werte vor Speicherung oder Anzeige. | Verschlüsselung oder Zugriffskontrolle. |

### GenAI, Agentik und Retrieval

| Begriff | Bedeutung | Aussagegrenze |
|---|---|---|
| LLM | Sprachmodell, das auf Eingabe eine probabilistische Ausgabe erzeugt. | Keine Autorität für Wahrheit, Rechte oder Fachzustand. |
| Prompt | Strukturierte Eingabeanweisung samt Kontext und Constraints. | Sicherheitscontrol oder Geschäftsregel. |
| Context Assembly | Auswahl und Zusammenführung zulässiger Informationen für eine Modellanfrage. | Unbegrenztes Einfügen aller Daten. |
| RAG | Muster, das Retrieval und Generierung verbindet. | Wahrheitsgarantie oder Berechtigungssystem. |
| Retrieval | Auswahl von Kandidaten aus einem Korpus anhand einer Query und Metadaten. | Autorisierung, Zitierpflicht oder Richtigkeit des Inhalts. |
| Grounding | Bindung einer Antwort an geeignete Evidenz oder Kontext. | Beweis, dass jede Aussage wahr ist. |
| Halluzination | Nicht ausreichend gestützte, falsche oder erfundene Modellausgabe. | Ein ausschließliches LLM-Problem; auch Daten, Retrieval und Tools können Ursache sein. |
| Tool Calling | Strukturierte Aufforderung des Modells an eine externe Fähigkeit. | Direkte, autorisierte Ausführung. |
| Agent | System, das Ziele, Zustände, Modelle, Tools, Policies und Kontrollschleifen kombiniert. | Ein Chatprompt oder autonom verantwortliche Person. |
| Human Gate | Bewusste menschliche Prüfung oder Freigabe an einer Risikogrenze. | Unklare „Human in the loop“-Behauptung ohne Owner und Kriterium. |
| Eval | Verfahren zur Messung einer definierten Qualitäts- oder Fehlerklasse. | Vollständige Produktqualität oder Compliancefreigabe. |

### Plattform, Cloud, FinOps und Governance

| Begriff | Bedeutung | Verwechslungsgefahr |
|---|---|---|
| Plattformprodukt | Gemeinsame Fähigkeit für interne Nutzer mit Interface, Owner, Support und Erfolgsmessung. | Geteiltes Infrastrukturprojekt ohne Nutzererlebnis. |
| Golden Path | Unterstützter Standardweg mit sicheren Defaults und begrenztem Scope. | Zwangspfad ohne Ausnahme oder Support. |
| Landing Zone | Grundstruktur für Cloudkonten, Identität, Netzwerk, Logging, Policy und Governance. | Einzelnes Projekt oder bloßes Cloudkonto. |
| Multi-Tenancy | Gemeinsame Nutzung mit kontrollierter Isolation zwischen Mandanten. | Jeder Dienst mit einem Tenant-Feld. |
| Souveränität | Fähigkeit, Kontrolle über Daten, Entscheidungen, Betrieb oder Abhängigkeiten zu behalten. | Region allein oder pauschale On-Prem-Vorliebe. |
| FinOps | Zusammenarbeit von Engineering, Finance und Produkt zur Steuerung des Cloudwerts und -verbrauchs. | Reine Kostenreduktion. |
| TCO | Gesamtkosten über Lebenszyklus, inklusive Betrieb, Personal, Migration, Risiken und Exit. | Monatlicher Providerpreis. |
| Capability | Wiederholbare Fähigkeit, einen Outcome unter definierten Grenzen zu liefern. | Ein einmaliges Projekt oder ein Teamtitel. |
| Standard | Vereinbarter, versionierter und unterstützter Weg mit Owner und Ausnahme. | Empfehlung ohne Durchsetzung oder Migrationsplan. |
| Ausnahme | Befristete, begründete Abweichung mit Risiko, Control, Owner und Re-Evaluation. | Dauerhafte Nebenlösung ohne Sichtbarkeit. |
| Exit | Geplanter Weg, eine Abhängigkeit, Technologie oder Entscheidung sicher zu verlassen. | Kündigung eines Vertrags ohne Daten-, Schnittstellen- und Betriebsfolgen. |

## Architektur und Data Flow Notation

Die Knowledge Base nutzt einfache, text- und diagrammfähige Notation. Ein Diagramm ergänzt den Text nur dann, wenn Beziehungen klarer werden. Es darf keine Sicherheits-, Daten- oder Ownershipannahme nur durch Farbe oder implizite Symbolik verstecken.

### Knoten und Kanten

| Notation | Bedeutung |
|---|---|
| [Komponente] | Laufzeitkomponente, Service, Tool oder Datenspeicher. |
| (Akteur) | Mensch, externes System oder Testtreiber. |
| {Control} | Deterministische Prüfung, Policy, Validator oder Human Gate. |
| <Datenklasse> | Daten- oder Schutzklasse, zum Beispiel <synthetisch> oder <personenbezogen>. |
| A → B | Daten- oder Aufrufpfad; Beschriftung nennt Protokoll oder Nachricht. |
| A ⇢ B | Asynchroner Event- oder Queuepfad. |
| A ┄┄ B | Management-, Observability- oder Steuerpfad, nicht fachliche Nutzdaten. |
| X | Trust Boundary | Grenzübergang mit erneuter Identitäts-, Daten- oder Policyprüfung. |
| ! Fehlerklasse | Erwarteter oder getesteter Fehlpfad. |
| ? Annahme | Noch nicht belegte Entscheidungsvoraussetzung. |

### Beispielnotation

(Testnutzer) → [Agent Runtime] → {Tool Gateway} → [Command Handler] ⇢ [Audit Event]

Die Annotationen lauten etwa: OIDC-Testclaim, schema=v1.2, tenant=test, request_id=R-001. Der Pfad [Agent Runtime] → {Tool Gateway} überschreitet eine Trust Boundary. Das Modell erzeugt nur eine Anfrage; die Fachaktion wird nach Policy und Commandvalidierung ausgeführt oder abgewiesen. Ein gestrichelter Pfad von Komponenten zu [Trace Store] beschreibt Telemetrie, nicht die Fachverarbeitung.

## Metrik-, Zeit- und Quellenkonventionen

| Kategorie | Regel | Beispiel |
|---|---|---|
| Zeit | ISO-8601-Datum, Zeitzone bei Zeitpunkt, Dauer mit Einheit. | 2026-09-15; 125 ms; 30 min. |
| Rate | Zähler, Nenner, Fenster und Filter nennen. | 99,9 Prozent erfolgreiche autorisierte Requests über 30 Tage. |
| Latenz | Perzentil, Start-/Endpunkt, Last und Ausschlüsse nennen. | p95 E2E-Latenz bei 20 requests/s, Cache-Hit getrennt. |
| Kosten | Währung, Zeitraum, Verbrauchstreiber und Annahmen. | EUR/Monat bei 10 Mio. Requests und dokumentierter Modellmix. |
| Kapazität | Einheit und Ressourcenart. | 4 vCPU, 16 GiB RAM, 1 GPU, 5 TB/Monat Egress. |
| Unsicherheit | Annahme, Grund und Recheck angeben. | ? Regionale Featureverfügbarkeit; vor Deployment primär prüfen. |
| Quelle | Herausgeber, Dokument, URL, Version/Datum, Abrufdatum, gestützte Aussage. | RFC oder Herstellerdokumentation mit konkret referenzierter Behauptung. |
| Labstatus | executed, syntax_checked, reviewed_only oder not_executed. | reviewed_only ist keine ausgeführte Funktion. |

## Konfiguration und Implementierung

### Schreibregeln für technische Beispiele

1. Geheimnisse, echte Kundendaten, interne Hostnamen, IP-Adressen, Tokens und Zugangsdaten werden nie in Kapitel oder Lab kopiert.
2. Konfiguration zeigt Versions- und Umgebungsvoraussetzung; sie wird nicht als universell lauffähig ausgegeben.
3. Variable Werte erhalten sprechende Platzhalter, etwa TENANT_ID oder TEST_AUDIENCE, und werden als Platzhalter erklärt.
4. Jeder gefährliche oder kostenwirksame Schritt nennt Testgrenze, erforderliche Rechte, erwartete Beobachtung und Cleanup.
5. Tabellen trennen Fakten, Annahmen, Optionen und Entscheidungen. Eine Option wird nicht als Empfehlung gelesen, solange der Kontext fehlt.
6. Neue Abkürzungen werden beim ersten Vorkommen ausgeschrieben; Namen werden nicht mehrfach unterschiedlich abgekürzt.
7. Deutsche Begriffe sind erklärend, englische Fachbegriffe bleiben dort erhalten, wo sie Normen, APIs oder Fehlermeldungen bezeichnen.

### Quellen- und Evidenznotation

Ein Quellenrecord trägt eine Claim-ID. Der Artikeltext nennt den Link bei der zeitabhängigen Aussage; das Register verbindet Link, Datum, Aussage, Entscheidung und Recheck-Trigger. Erfahrungsevidenz aus der Selbsteinschätzung verwendet lokale Beleg-IDs (etwa EV-01) und nennt stets Quelle, Zeitraum, Evidenzart und Begrenzung. Ein Lab erhält eine Lab-ID, Status, Umgebung, Evidenz und Einschränkung. Ein Review erhält Revision, Hash, Methode, Unabhängigkeit, Befunde und Entscheidung.

Diese Notation verhindert, dass „Quelle vorhanden“, „Lab geplant“, „Code geschrieben“, „Review durchgeführt“ und „Fähigkeit belegt“ als dieselbe Tatsache erscheinen.

## Skalierbarkeit und Performance

Terminologie skaliert, wenn sie stabil genug für viele Domains und klein genug für tatsächliche Verwendung ist. Ein Glossar mit jeder Produktoption wäre schnell veraltet und würde kanonische Artikel konkurrieren. Ein zu kurzes Glossar erzeugt dagegen lokale Dialekte, etwa wenn ein Team „Event“ für Command, Logeintrag und Nutzeraktion gleichzeitig benutzt.

| Risiko | Frühes Signal | Gegenmaßnahme |
|---|---|---|
| Begriffskollision | Gleiche Abkürzung hat mehrere Bedeutungen. | Erste Verwendung ausschreiben, Kontext angeben, kanonische Definition verlinken. |
| Produktproxy | Produktname ersetzt Mechanismus. | Standard, Protokoll oder Funktionsgrenze benennen; Produkt als Implementierung markieren. |
| Diagrammblindheit | Diagramm zeigt Kästen ohne Daten, Trust oder Owner. | Kanten beschriften, Grenzen markieren, Text mit Entscheidung und Fehlpfad ergänzen. |
| Metriktheater | Zahl ohne Nenner, Zeitraum oder Scope. | Einheit, Fenster, Perzentil, Filter und Messgrenze erzwingen. |
| Glossarwachstum | Jede lokale Detailfrage erweitert Domain 00. | Tiefe Fachdefinition in kanonischen Artikel verschieben; Glossar nur mit klarer Abgrenzung ergänzen. |

## Reliability und Failure Modes

| Failure Mode | Ursache | Schutz |
|---|---|---|
| Ambige Begriffe | Kontext und Einheit fehlen. | Begriffvertrag mit Scope, Messfenster und Ausschluss. |
| Falsche Synonyme | Authentifizierung und Autorisierung oder Event und Command werden vermischt. | Tabelle mit Nicht-gleichsetzen-Spalte und Fachverweis. |
| Veraltete Kurzform | Tool, Standard oder Rolle ändert Bedeutung. | Version, Herausgeber, Recheck-Trigger und Revision. |
| Unklare Diagramme | Legende und Kantensemantik fehlen. | Feste Notation, Textfluss und Trust Boundary. |
| Evidenzverwechslung | Selbsteinschätzung, Lab, Review und Produktion werden zusammengezählt. | Separate IDs, Status und Aussagegrenzen. |
| Übernotation | Formalismus verdeckt einen einfachen Mechanismus. | Notation nur verwenden, wenn sie Entscheidung oder Fehlergrenze klärt. |

## Security, Governance und Compliance

Sprache kann Sicherheitsrisiko erzeugen. „Zugriff gesichert“ ist keine prüfbare Aussage. Ein Kapitel nennt Identität, Autorität, Schutzobjekt, Controlpunkt, Logginggrenze und Rest-Risiko. „Daten anonymisiert“ wird nicht behauptet, wenn lediglich einzelne Felder entfernt wurden. „Compliance“ wird nicht als Eigenschaft einer Technologie verwendet, sondern als kontextabhängige Bewertung mit Recht, Rolle, Jurisdiktion und Evidenz.

Governancebegriffe bleiben ebenso präzise: Standard, Empfehlung, Policy, Ausnahme, Risikoakzeptanz und Freigabe sind nicht austauschbar. Ein Chief kann Rest-Risiko im Mandat akzeptieren, aber das ersetzt nicht den technischen Control oder die fachliche Ownership. Eine RACI erklärt Beteiligung, nicht die Qualität eines Sicherheitsmechanismus.

## Observability und Troubleshooting

Notation ist nützlich, wenn sie Diagnose verkürzt. Jeder relevante Fehlerbericht beantwortet:

| Feld | Beispiel |
|---|---|
| Symptom | p95-Latenz steigt nach Contractrevision. |
| Scope | Nur Tenant test, Gateway v1.3, Zeitraum 15 Minuten. |
| Korrelations-ID | request_id oder trace_id, ohne sensible Payload. |
| Hypothesen | Consumerinkompatibilität, Retry-Sturm, Downstreamtimeout. |
| Unterscheidendes Signal | Fehlerklasse, Queue Tiefe, Versionlabel, Event-Duplikat. |
| Sofortmaßnahme | Rollback oder Featureflag deaktivieren. |
| Dauerhafte Entscheidung | Kompatibilitätsfenster, Contractfix, Testlücke oder Ownerwechsel. |

**Troubleshooting: Ein Begriff wirkt klar, aber Teams handeln unterschiedlich.** Suche nach fehlendem Scope oder unterschiedlicher Aussageebene. „Sicher“, „verfügbar“, „produktiv“, „akzeptiert“ und „getestet“ sind oft die Ursache. Ergänze messbare Bedingungen und ein Beispiel mit Gegenprobe, statt nur eine neue Definition zu schreiben.

## Cost und FinOps

Unpräzise Begriffe verursachen Kosten: falsche Kapazitätsannahmen, ungeplante Egresskosten, fehlende Ownership, überbreite Securityreviews, teure Migration oder doppelte Plattformarbeit. Das Glossar selbst braucht wenig Infrastruktur; sein Wert entsteht durch weniger Fehlkommunikation und bessere Entscheidungen.

| Begriffliche Unschärfe | Mögliche Kostenfolge | Bessere Form |
|---|---|---|
| „Skalierbar“ | Überdimensionierung oder Lastincident. | Lastmodell, SLO, Engpass und Kapazitätsgrenze. |
| „Kostenoptimiert“ | Verschobene Kosten, Egress oder Supportschuld. | TCO, Verbrauchstreiber, Zeitraum und Exitkosten. |
| „Produktionstauglich“ | Zu früher Rollout ohne Recovery. | Datenklasse, SLO, On-call, Rollback, Review und Pilotgrenze. |
| „Standardisiert“ | Schattenvarianten und Blockade. | Owner, Support, Ausnahme, Migration, Ablaufdatum und Adoption. |
| „AI-Qualität“ | Tokenkosten ohne Nutzerwert. | Fehlerklasse, Evalschwelle, Kosten pro gültigem Ergebnis und Human Gate. |

## Trade-offs und Anti-Patterns

Ein deutsches Glossar mit englischen Fachbegriffen verbessert Zugänglichkeit, kann aber bei falscher Übersetzung den Standardbezug verwischen. Eine strikte Notation erhöht Vergleichbarkeit, kann aber Lesbarkeit senken, wenn sie ohne Entscheidung genutzt wird. Deshalb ist Klarheit wichtiger als formale Vollständigkeit.

Anti-Patterns sind: Abkürzungen ohne Auflösung, Produktnamen als Architektur, „latency“ ohne Perzentil, „secure“ ohne Control, „event“ ohne Semantik, Diagramme ohne Legende, Toollisten in Profilen als Kompetenzbeleg und ein Labstatus, der reale Ausführung vortäuscht.

## Staff-, Principal- und Chief-Entscheidungen

**Staff.** Staff sorgt dafür, dass gemeinsame Wörter zu gemeinsamen Artefakten führen: Contract-Test-Sprache, Dashboardnamen, Fehlerklassen, Runbook-Vokabular und sichere Beispiele. Der Erfolg zeigt sich darin, dass ein anderes Team einen Incident oder eine Migration ohne Übersetzungsverlust bearbeiten kann.

**Principal.** Principal entscheidet, welche Begriffe und Notationen organisationsweit verbindlich werden und wo lokale Fachsprache erhalten bleiben muss. Ziel ist nicht sprachliche Zentralisierung, sondern Interoperabilität an Verträgen, Datenklassen, Identity und Plattformgrenzen.

**Chief.** Chief verwendet Begriffe für überprüfbare Portfolioentscheidungen: Capability statt Projekt, Standard statt Empfehlung, Ausnahme statt Schattenlösung, TCO statt Preis und Exit statt impliziter Bindung. Damit bleiben Strategie, Risiko und technische Folgen miteinander verbunden.

## Production Checklist

- [x] Deutsche Erklärung und etablierter englischer Fachbegriff sind klar verbunden.
- [x] Status, Evidenz, Quellen, Version und Labstatus bleiben getrennte Aussagen.
- [x] Datenfluss-, Trust-, Control-, Fehler- und Ownershipnotation ist definiert.
- [x] Metriken tragen Einheit, Zeitfenster, Scope und Messgrenze.
- [x] AI-, Plattform-, Security-, Betrieb-, Governance- und FinOpsbegriffe sind abgegrenzt.
- [x] Tiefe Spezialnotation wird an kanonische Artikel verwiesen.
- [x] Der Innovationsabschnitt enthält Reifegrad, Pilotkriterium und Sicherheitsgrenze.
- [ ] Die Notationsübung ist reviewed_only und wurde nicht in einem realen Projektteam validiert.
- [ ] Die Datei besitzt keine unabhängige technische Annahme.

## Interviewfragen mit Antwortleitfäden

1. **Warum ist „sicher“ keine ausreichende Architekturbehauptung?**  
   Weil Schutzobjekt, Bedrohung, Controlpunkt, Identität, Autorisierung, Monitoring und Rest-Risiko fehlen. Eine gute Antwort benennt mindestens den erzwungenen Mechanismus und seine Grenze.

2. **Wie unterscheiden Sie Event und Command?**  
   Ein Command bittet um eine Zustandsänderung; ein Event beschreibt etwas bereits Geschehenes. Die Unterscheidung beeinflusst Ownership, Idempotenz, Fehlerbehandlung und Reprocessing.

3. **Was muss eine Latenzmetrik enthalten?**  
   Start- und Endpunkt, Zeitfenster, Perzentil, Last, Scope, Einheit und relevante Ausschlüsse wie Cache-Hit oder asynchroner Pfad.

4. **Warum ist RAG keine Wahrheitsgarantie?**  
   Retrieval kann falsche, unvollständige oder unberechtigte Quellen liefern; das Modell kann sie falsch interpretieren. Autorisierung, Eval, Zitation, Fallback und Human Gate bleiben getrennte Controls.

5. **Was unterscheidet SLO und SLA?**  
   Ein SLO ist ein internes Ziel für einen Indikator; ein SLA ist eine vertragliche Vereinbarung mit möglichen Folgen. Beide brauchen definierte Messung und Scope.

6. **Was bedeutet eine Trust Boundary?**  
   Sie markiert einen Übergang, an dem Identität, Autorität, Datenklasse oder Annahmen neu geprüft werden müssen. Sie ist nicht einfach ein anderer Netzwerkkasten.

7. **Wie verhindert ein Glossar Architekturduplikate?**  
   Es gibt Kernbedeutung, Abgrenzung und kanonische Verweise. Tiefe Mechanik wird nicht in jeder Domain wiederholt, sondern in der verantwortlichen Fachdatei erklärt.

8. **Warum ist TCO wichtiger als ein Monatspreis?**  
   TCO enthält Betrieb, Personal, Support, Migration, Egress, Risiko, Compliance und Exit. Ein günstiger Dienst kann dadurch langfristig teurer sein.

## Praktisches Lab: Einen Architekturfall konsistent notieren

**Fall.** Ein fiktiver B2B-Agent beantwortet Bestellstatus und bereitet Reservierungen vor. Ein Modell darf strukturierte Toolanfragen vorschlagen, aber keine fachliche Zustandsänderung direkt ausführen.

**Aufgabe.**

1. Zeichne mit der festgelegten Notation Testnutzer, Agent Runtime, Trust Boundary, Tool Gateway, Command Handler, Testzustand, Audit Event und Trace Store.
2. Beschrifte jede Kante mit Protokoll- oder Nachrichtenart, Datenklasse und Kontrollpunkt.
3. Formuliere drei Invarianten: falsche Delegation führt zu keiner Aktion; doppelte Request-ID führt zu keiner doppelten Änderung; leere Quellenlage erzeugt keine erfundene Freigabe.
4. Definiere SLI, SLO-Entwurf, Latenzperzentil, Kostenlimit und Fehlerklassen.
5. Ergänze eine Gegenprobe für falsche Audience, Replay und Downstreamtimeout.
6. Markiere klar, welche Aussagen als Annahme, reviewed_only oder zukünftiger Production-Pilot gelten.
7. Leite eine Entscheidung ab: Gateway plus Command Handler oder direkter Toolzugriff; nenne Owner, Trade-off, Rollback und Recheck.

**Auswertung.** Ein gutes Ergebnis erlaubt einem unabhängigen Leser, Daten-, Trust- und Kontrollfluss ohne implizites Wissen zu erklären. Es beweist nicht, dass der fiktive Agent produktiv betrieben, rechtlich freigegeben oder wirtschaftlich sinnvoll ist.

**Labstatus:** reviewed_only. Die Übung prüft Notationsklarheit und Aussagegrenzen in einem synthetischen Fall, keine reale Implementierung.

## Dependencies, Cross-References und Quellen

Das Glossar ergänzt die Navigation in [KB-0001](01-master-index-und-wegweiser.md), Evidenzregeln in KB-0004 bis KB-0009 und die späteren kanonischen Fachkapitel. Bei Konflikt zwischen Glossar und einer normativen Primärquelle oder dem jeweiligen Fachartikel gilt die präzisere, datierte Hauptquelle; das Glossar wird dann revidiert.

**Verwendete Quellen, Stand 2026-09-15.**

- Masterplan: IDs, Status, Quellenstand und kanonische Zuständigkeit
- Artikelvertrag: Notation, Metadaten, Quellen und Evidenz
- Metadatenschema für Status, Kompetenzmarker, Evidenz und Labs
- Kanonische Themen und Dependencies

## Bonus: New Tech and Innovations

**Stand: 2026-09-15.** Semantische Kataloge, strukturierte Architekturentscheidungen und KI-gestützte Terminologieprüfung können große Wissensbasen bei konsistenter Sprache unterstützen. Der Reifegrad ist **Emerging bis Adopting**: Automatisierung kann unbekannte Abkürzungen, abweichende Statusbegriffe oder fehlende Einheiten finden. Sie kann aber nicht ohne Fachkontext entscheiden, ob zwei Begriffe im konkreten Vertrag dieselbe Semantik, Sicherheitsgrenze oder Governancefolge haben.

Ein Pilot darf nur auf redigierten Texten arbeiten, muss jeden Befund auf Definition und Fundstelle zurückführen und menschliche Fachprüfung verlangen. Er darf keine personenbezogenen Eignungsurteile erzeugen, keine Secrets extrahieren und keine Änderung automatisch als fachlich akzeptiert markieren.
