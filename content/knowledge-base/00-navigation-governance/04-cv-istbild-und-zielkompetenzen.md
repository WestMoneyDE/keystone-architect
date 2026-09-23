---
{"id": "KB-0004", "title": "Selbsteinschätzung: Istbild und Zielkompetenzen", "domain": "00", "sequence": 4, "document_type": "navigation", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-14", "technical_reviewed_at": null, "research_cutoff": "2026-09-14", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0001", "concepts": ["Statusmodell", "stabile IDs", "Evidenzregister"], "needed_for": "understanding"}, {"id": "KB-0002", "concepts": ["Kompetenzcluster", "Nachweisarten", "Zielrollengrenzen"], "needed_for": "understanding"}], "related": ["KB-0005", "KB-0006", "KB-0009", "KB-0011", "KB-0012", "KB-0013", "KB-0014", "KB-0015", "KB-0016", "KB-0025", "KB-0720"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein persönliches Evidenzdossier verknüpft Arbeitsproben, Labs, ADRs, Reviews und Grenzen mit einzelnen Kompetenzclaims.", "rationale": "Ein Lernziel wird erst durch ein überprüfbares Artefakt zu einem glaubwürdigen Nachweis."}, "ARCHITECT-TARGET": {"active": true, "scope": "Vorhandene Erfahrung, Konzeptwissen und fehlende Architekturkompetenzen werden für einen konkreten Use Case voneinander getrennt.", "rationale": "Gute Architekturentscheidungen benennen sowohl tragfähige Stärken als auch offene Risiken und Eskalationswege."}, "STAFF-TARGET": {"active": true, "scope": "Evidenzstand und Kompetenzlücken eines Teams werden ohne Personenranking sichtbar gemacht und in Lern- oder Plattformarbeit übersetzt.", "rationale": "Staff-Wirkung braucht nachvollziehbare Entwicklung von Fähigkeiten, nicht nur Selbstbeschreibungen."}, "CHIEF-TARGET": {"active": true, "scope": "Ein strategisches Kompetenzportfolio trennt intern aufzubauende Fähigkeiten, Partnerabhängigkeiten und nicht akzeptable Nachweislücken.", "rationale": "Chief-Verantwortung entscheidet über nachhaltige Capability und Risiko, nicht über Titel oder Zertifikatszahlen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Externe, kryptographisch nachweisbare Arbeitsproben oder Verifiable Credentials können ergänzen, wenn Datenschutz, Aussteller und Verifikationszweck klar sind.", "rationale": "Solche Nachweise sind kein Ersatz für konkrete technische Artefakte und dürfen keine unnötigen personenbezogenen Daten veröffentlichen."}}, "lab_validation": [{"lab_id": "KB-0004-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-14", "environment": "Lokales Markdown-Evidenzdossier mit redigierten Beispielartefakten", "evidence": "Die Anleitung beschreibt Claim, Evidenzart, Artefaktlink, Gegenprobe, erlaubte Aussage und Ablaufdatum vollständig.", "limitations": "Nur lokal und in begrenztem Umfang geprüft; keine Produktionsaussage."}]}
---
# Selbsteinschätzung: Istbild und Zielkompetenzen

## Zweck, Definition und Scope

Dieses Kapitel zeigt, wie jeder Lernende eine ehrliche, überprüfbare Selbsteinschätzung aufbaut: ein **Istbild** (was ist heute belegbar?) und ein davon getrenntes **Zielbild** (welche Kompetenz soll aufgebaut werden?). Es beantwortet nicht, ob jemand „genug“ für eine Zielrolle mitbringt. Es verhindert vielmehr, dass eine Toolnennung, ein Konzept oder ein eigener Prototyp unbeabsichtigt als umfassende Produktions-, Führungs- oder Spezialistenpraxis ausgegeben wird.

Drei Ebenen bleiben strikt getrennt:

- Ein **Erfahrungsclaim** ist eine begrenzte Aussage über eine Tätigkeit in einem Zeitraum, gestützt durch eine Quelle oder ein Artefakt.
- Ein **Kompetenzclaim** verlangt darüber hinaus einen überprüfbaren Mechanismus, ein Artefakt, ein Fehlerbild und eine Entscheidung, die jemand verantworten kann.
- Ein **Lernziel** beschreibt eine gewünschte Fähigkeit, aber keinen bereits erreichten Nachweis.

Nach diesem Kapitel kann der Leser:

1. eigene Erfahrung nach Evidenzart einordnen – produktiv betrieben, umgesetzt, Prototyp, Konzept, Lab oder nur genannt;
2. jeden Claim mit Quelle/Artefakt, Zeitraum, Evidenzart und Grenze festhalten;
3. aus dem Abgleich mit Zielrollen priorisierte Lücken ableiten und als Lab, Designartefakt oder Reviewziel planen;
4. ein persönliches Evidenzdossier so strukturieren, dass es keine Kundendaten oder überzogenen Kompetenzclaims veröffentlicht;
5. Zielmarker und aktuellen Nachweis in der gesamten Bibliothek sauber auseinanderhalten.

Das Kapitel ersetzt weder Referenzen noch technische Interviews noch unabhängige Arbeitsproben. Es enthält bewusst keine Beispielperson: Alle Tabellen sind Vorlagen mit Platzhaltern.

## Kompetenzmarker und Evidenz

| Marker | Status | Bedeutung |
|---|---|---|
| CURRENT-EVIDENCE | offen | Eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| HANDS-ON-TARGET | aktiv | Neue Kompetenz wird durch eigene Artefakte, Gegenproben und Review nachgewiesen. |
| ARCHITECT-TARGET | aktiv | Stärken und Lücken werden für eine konkrete Risiko- und Use-Case-Entscheidung eingeordnet. |
| STAFF-TARGET | aktiv | Der Evidenzprozess bleibt teamfähig und bewertet Systemfähigkeit statt Personenwert. |
| CHIEF-TARGET | aktiv | Strategische Capabilities, Partnerabhängigkeiten und Risikoausnahmen werden als Portfolio sichtbar. |
| SPECIALIST-OPTIONAL | aktiv | Verifiable Credentials oder signierte Nachweise sind nur mit klarer Datenschutz- und Vertrauensentscheidung sinnvoll. |

`CURRENT-EVIDENCE` ist in jedem Kapitel dieser Bibliothek standardmäßig **offen**. Der Marker wird erst dann für sich selbst aktiviert, wenn ein Eintrag im eigenen Evidenzdossier die Aussage trägt. Alle `*-TARGET`-Marker sind Lernziele und sagen nichts über den heutigen Stand aus.

## Mental Model: Beleg, Aussage und Ziel

Ein **Beleg** ist ein Artefakt oder eine verlässliche Quelle. Eine **Aussage** ist eine vorsichtig formulierte Interpretation dieses Belegs. Ein **Ziel** ist die künftige Fähigkeit, die mit einem neuen Artefakt bewiesen werden soll. Diese Reihenfolge darf nicht umgedreht werden.

Beispiel: Ein Lernender hat eine Architektur für eine GPU-gestützte Inference-Runtime mit Routing, Tracing und Evaluation entworfen. Die zulässige Aussage lautet: „Konzeptkontext für AI-Runtime-, GPU- und LLMOps-Lernziele.“ Daraus wird nicht: „Betrieb einer hochverfügbaren Multi-Cluster-GPU-Plattform.“ Die Lücke besteht aus nicht belegten Daten über Hardwarekompatibilität, Kapazität, Incident-Verantwortung, SLOs, Security Controls und reale Produktionslast.

Die nützliche Frage ist daher nicht „Kann ich das?“, sondern: „Welche konkrete Aussage kann dieses Artefakt tragen, was beweist es nicht und welcher nächste Nachweis würde die Lücke schließen?“

## Prerequisites und Dependencies

Dieses Kapitel benötigt aus [KB-0001](01-master-index-und-wegweiser.md) das Status- und Evidenzregister und aus [KB-0002](02-rollen-kompetenz-matrix.md) die Kompetenzcluster und Nachweisarten. Es wird ergänzt durch:

| Beziehung | Ziel | Zweck |
|---|---|---|
| related | [KB-0005](01-master-index-und-wegweiser.md#kb-0005) | Kompetenzmodell für Reichweite und Wirkung. |
| related | [KB-0006](01-master-index-und-wegweiser.md#kb-0006) | Hands-on-, Architektur- und Governance-Nachweise. |
| related | [KB-0009](01-master-index-und-wegweiser.md#kb-0009) | Labstrategie und Beweisartefakte. |
| related | [KB-0011](01-master-index-und-wegweiser.md#kb-0011) bis [KB-0025](01-master-index-und-wegweiser.md#kb-0025) | Zielrollen und deren Artefaktgrenzen. |
| related | [KB-0720](01-master-index-und-wegweiser.md#kb-0720) | Portfolioevidenz und Reifemodelle. |

## Core Concepts und Istbild

### Evidenzarten

Jeder Claim bekommt genau eine Evidenzart. Im Zweifel gilt die schwächere.

| Evidenzart | Was sie stützen kann | Was sie allein nicht stützt |
|---|---|---|
| produktiv betrieben | begrenzte betriebliche Verantwortung für ein System unter realer Last | beliebige Nachbarsysteme, Skalierung jenseits des Belegten oder strategische Führungsrolle |
| umgesetzt | selbst entwickelte Komponente oder konkret gebaute Integration im genannten Kontext | Langzeitbetrieb, Größe, SLA oder Adoption ohne weiteren Beleg |
| Prototyp | erprobte Lösung in definierter, begrenzter Umgebung | robuste Produktion, Compliance oder Skalierung |
| Konzept | Architektur- oder Lösungsentwurf, ADR, Designreview | funktionale Umsetzungs- oder Betriebserfahrung |
| Lab | reproduzierbares Lernexperiment mit Gegenprobe | Berufserfahrung, reale Nutzer oder Teamverantwortung |
| nur genannt | Technologie als Kontext oder Lernwunsch | konkrete Nutzung, Dauer oder Tiefe |

Eine Toolliste in einem Profil ist in der Regel „nur genannt“. Sie ist wertvoll für Recherche- und Lernpriorisierung, aber kein Freifahrtschein für `CURRENT-EVIDENCE`. Eine Behauptung zu Kubernetes, Triton, MLflow, NVLink oder BGP wird immer gegen einen Projekt- oder Artefaktbeleg geprüft.

### Einen Claim erfassen

Jeder Eintrag im Istbild beantwortet fünf Fragen:

1. **Claim:** Was genau wird behauptet – als ein Satz, nicht als Schlagwort?
2. **Quelle/Artefakt:** Wo lässt sich das prüfen – Repository, ADR, Testreport, Diagramm, Referenz?
3. **Zeitraum:** Wann und wie lange? Ohne Zeitraum ist die Aussage nicht einzuordnen.
4. **Evidenzart:** Welche der sechs Arten oben trifft zu?
5. **Grenze:** Was beweist der Beleg ausdrücklich nicht?

### Vorlage: Istbild-Tabelle

Die folgende Tabelle ist eine **Vorlage**. Sie wird mit eigenen Einträgen gefüllt; die IDs sind lokal und nur im eigenen Dossier gültig.

| ID | Quelle/Artefakt | Zeitraum | Evidenzart | Grenze |
|---|---|---|---|---|
| EV-01 | [Projekt/Artefakt] | [Zeitraum] | [Evidenzart] | [Grenze] |
| EV-02 | [Projekt/Artefakt] | [Zeitraum] | [Evidenzart] | [Grenze] |
| EV-03 | [Lab/Repository] | [Zeitraum] | Lab | [z. B. nur lokal, keine reale Last] |
| EV-04 | [Architekturentwurf/ADR] | [Zeitraum] | Konzept | [z. B. nicht umgesetzt, kein Betrieb] |

Zu jeder ID gehört ein ausformulierter, zulässiger Satz, zum Beispiel: *„In [Projekt] habe ich [Komponente] [umgesetzt/konzipiert]; belegt durch [Artefakt]; nicht belegt sind [Grenze].“* Dieser Satz ist die einzige Form, in der der Claim später verwendet wird.

### Priorisierte Lücken ableiten

Lücken entstehen nicht aus fehlenden Produktnamen, sondern aus fehlenden Nachweisen an Systemgrenzen. Das Vorgehen:

1. Zielrolle wählen (siehe [KB-0011](01-master-index-und-wegweiser.md#kb-0011) bis [KB-0025](01-master-index-und-wegweiser.md#kb-0025)) und deren Kompetenzcluster aus [KB-0002](02-rollen-kompetenz-matrix.md) übernehmen.
2. Jedem Cluster die passenden Istbild-IDs zuordnen – nur dort, wo Evidenzart und Umfang wirklich passen.
3. Cluster ohne ausreichenden Beleg sind Lücken. Priorisieren nach Relevanz für die Zielrolle, Risiko einer Überdehnung und Aufwand des kleinsten ausreichenden Nachweises.
4. Jede Lücke erhält ein konkretes nächstes Artefakt und ein Kapitel aus dem Katalog.

| Lücke | Zielrolle | Priorität | Nächster Nachweis | Kapitel |
|---|---|---|---|---|
| [z. B. Identity und Delegation für Tools] | [Zielrolle] | [hoch/mittel/niedrig] | [Lab mit Gegenprobe] | [KB-ID] |
| [z. B. SLO, Incident und Recovery] | [Zielrolle] | [Priorität] | [Game Day/Runbook] | [KB-ID] |
| [z. B. FinOps- oder Tokenökonomie] | [Zielrolle] | [Priorität] | [Kostenmodell mit Annahmen] | [KB-ID] |

Typische Lücken an Systemgrenzen sind sichere Identity- und Delegationsmodelle, formale Evaluations- und Freigabeprozesse für AI-Verhalten, Plattformbetrieb mit SLO und Recovery, Cloud- und Netzwerkentscheidungen mit Datenresidenz und Kosten, Enterprise Architecture mit Capability, Portfolio und Standards sowie regulierte Governance mit Auditbeleg. Diese Lücken sind Lernziele, keine Defiziturteile.

### Zielmarker und aktuellen Nachweis trennen

Das Zielbild steht in einer **eigenen** Tabelle oder Datei. Ein Lernziel wird nie in die Istbild-Tabelle geschrieben, auch nicht „vorläufig“. Erst wenn ein neues Artefakt mit Gegenprobe und Review vorliegt, entsteht ein **neuer** Istbild-Eintrag mit eigener ID und eigenem Datum. Alte Einträge werden nicht rückwirkend aufgewertet.

## Architecture und Data Flow

Die Evidenzpipeline lautet:

Arbeitsartefakt → lokale ID und Evidenzart → zulässiger Satz mit Grenze → Kompetenzcluster → Lernziel → neues Artefakt und Gegenprobe → Review → neuer Istbild-Eintrag.

Beispiel: Ein Entwurf für GPU-Partitionierung ist ein Konzept-Claim. Das Lernziel kann ein reproduzierbarer Benchmark mit dokumentierter Hardware, Modell, Last, Metrik und Ausfallgrenze sein. Erst dieses neue Artefakt kann eine Aussage über die getestete Konfiguration stützen – als eigener Eintrag vom Typ „Lab“, nicht als Aufwertung des Konzepts.

Diese Datenflussgrenze ist besonders wichtig für GenAI. Ein überzeugender Demo-Output ist kein Nachweis für Grounding, Privacy, Autorisierung oder stabile Qualität. Jede Aussage braucht die passende Prüfart: Retrieval-Evaluation für Grounding, Token- und Audience-Gegenprobe für Zugriff, Lasttest für Latenz und Review für eine Architekturentscheidung.

## Protocols, Standards und Tools

Dieses Kapitel standardisiert kein HR-System. Es verwendet einfache, portable Datenelemente: lokale ID, Quelle, Zeitraum, Evidenzart, Claim Scope, zulässige Aussage, Grenze, Artefakt, Gegenprobe und Reviewstatus. Markdown und JSON reichen für ein privates, versioniertes Lernportfolio.

Werkzeuge wie Git, signierte Commits, CI-Logs, Benchmarks, ADRs, Architekturdiagramme, Testreports und Datensätze können Evidenz liefern. Sie sind aber nur so gut wie ihr Kontext: Ein Hash belegt Integrität eines Artefakts, nicht automatisch die Richtigkeit seiner Schlussfolgerung. Ein Zertifikat kann Lernumfang belegen, nicht zwingend Produktionskompetenz.

## Konfiguration und Implementierung

Ein Evidenzrecord für ein neues Lernartefakt enthält mindestens:

| Feld | Beispiel |
|---|---|
| Claim | „Eine Toolaktion prüft Token-Audience und blockiert abgelaufene Delegation.“ |
| Artefakt | Repository-Pfad, ADR, Testreport oder redigierter Trace. |
| Zeitraum | [Datum der Durchführung] |
| Evidenzart | Lab |
| Umgebung | Lokaler Test, Sandbox oder ausdrücklich freigegebene Cloudumgebung. |
| Gegenprobe | Falsche Audience, abgelaufener Token oder fehlende Berechtigung. |
| Ergebnis | Erwartete Blockierung, Auditrecord und keine Seiteneffekte. |
| Grenze | Kein Nachweis für alle Identity Provider oder Produktionslast. |
| Review | Prüfer, Datum, offene Befunde und Freigabestatus. |

Eine minimale JSON-Form für ein versioniertes Dossier:

```json
{"id": "EV-05", "claim": "[ein Satz]", "artifact": "[Pfad/Link]", "period": "[Zeitraum]", "evidence_type": "lab", "boundary": "[was nicht belegt ist]", "counter_check": "[Gegenprobe]", "review": "[offen/abgenommen]"}
```

Sensible Details wie Kundennamen, Secrets, interne URLs, Quellcode oder personenbezogene Daten Dritter werden redigiert oder nicht verlinkt.

## Scalability, Reliability und Failure Modes

Ein persönliches Dossier skaliert über klare Claims, nicht über eine immer längere Skillliste. Pro Claim wird genau eine bewusste Aussage mit Grenze gespeichert. Ein zentraler Katalog verhindert, dass dieselbe Arbeitsprobe zugleich „Kubernetes-Expertise“, „Cloud Architecture“, „SRE“ und „Chief Leadership“ ohne zusätzliche Belege beansprucht.

| Fehlerbild | Symptom | Gegenmaßnahme |
|---|---|---|
| Tool-Nennung als Erfahrung | `CURRENT-EVIDENCE` pauschal aktiviert, ohne Projektbezug. | Evidenzart und Claim Scope verlangen; „nur genannt“ aktiviert keinen Marker. |
| Konzept als Produktion | Prototyp oder Architekturentwurf wird als Betrieb dargestellt. | Betriebsmessung, SLO, Incident- und Recovery-Nachweis separat fordern. |
| Ziel im Istbild | Lernziel steht „vorläufig“ in der Istbild-Tabelle. | Getrennte Tabellen; neuer Eintrag erst nach Artefakt und Review. |
| Unverifizierbares Portfolio | Links verfallen oder erlauben keine Prüfung. | Redigierte Artefakte, stabile Hashes, Datums- und Umgebungsangabe. |
| Evidence Theater | Viele Screenshots, keine Gegenprobe oder Entscheidung. | Jede Probe mit Hypothese, Fehlerfall, Ergebnis und Grenze führen. |
| Datenschutzleck | Dossier enthält sensible Daten. | Datenminimierung, Zugriffskontrolle und Review vor Veröffentlichung. |
| Stale Evidence | Alte Modell-, API- oder Toolbeispiele werden als aktuell ausgegeben. | Standdatum, Prüfauslöser und spätere Re-Evaluation führen. |

## Security, Governance und Observability

Kompetenzdaten sind personenbezogen. Datenminimierung gilt: Nur aufnehmen, was für den Claim und seinen Nachweis notwendig ist. Freigabe, Weitergabe und Aufbewahrungsdauer werden pro Dossier entschieden. Ein öffentlicher Portfolioauszug muss niemals alle internen Details offenlegen; er kann eine redigierte Beschreibung, ein Diagramm, einen Testnachweis und eine klare Einschränkung enthalten.

Governance prüft nicht nur die Wahrheit des Claims, sondern auch seinen Verwendungszweck. Ein intern geführtes Entwicklungsdossier, ein externes Portfolio und ein Compliance-Nachweis haben unterschiedliche Empfänger, Datenklassen und Aufbewahrungsregeln. Wiederverwendung ohne Zweckprüfung ist ein Anti-Pattern.

Beobachtbare Qualitätsindikatoren sind Anteil aktivierter `CURRENT-EVIDENCE`-Marker mit Evidenzart und Grenze, Anteil von Lernzielen mit Gegenprobe, Alter zeitabhängiger Nachweise, offene Reviewbefunde und Anzahl unredigierter sensitiver Artefakte. Es wird nicht gemessen, wie viele Tools jemand aufzählt.

## Cost, FinOps und Trade-offs

Das Dossier kostet vor allem fokussierte Zeit: Laboraufbau, Redaktion, Review und Redigierung. Diese Kosten sind sinnvoll, wenn sie spätere Fehlbesetzungen, ungeprüfte Risikoannahmen oder falsche Lerninvestitionen vermeiden. Ein teures GPU-Lab ohne klaren Claim ist schlechter als ein kleiner lokaler Sicherheitsgegencheck mit nachvollziehbarer Grenze.

| Wahl | Vorteil | Nachteil |
|---|---|---|
| Detaillierte Einzelclaims | Präzise und auditierbar. | Mehr Pflege. |
| Breite Selbstbeschreibung | Schnell zu schreiben. | Schlechte Prüfbarkeit und hohes Überdehnungsrisiko. |
| Öffentliche Arbeitsprobe | Sichtbar und portabel. | Datenschutz-, IP- und Angriffsflächen. |
| Private Evidenzakte | Mehr Kontext und Schutz. | Externe Prüfbarkeit eingeschränkt. |
| Signierter Nachweis | Integrität und Herkunft können besser prüfbar sein. | Aussteller-, Wallet- und Privacy-Abhängigkeiten. |

## Staff-, Principal- und Chief-Entscheidungen

Staff-Level schafft Lern- und Reviewroutinen, die aus Incidents, Designentscheidungen und Labs echte Teamfähigkeit machen – ohne Personenranking. Principal-Level verbindet Fähigkeiten über Teams: Ein Agentenprodukt braucht nicht nur Promptwissen, sondern Plattform, Identity, Evaluation, Daten und Betrieb. Chief-Level entscheidet, welche Fähigkeiten Kernkompetenz werden, wo Partnerschaften vertretbar sind und welche Nachweislücken bei regulatorischen oder geschäftskritischen Systemen nicht akzeptabel sind.

Eine gute Chief-Entscheidung nimmt dem Einzelnen nicht die Verantwortung ab. Sie schafft transparente Standards und ermöglicht, dass Kompetenz nach Personalwechseln im System und nicht nur im Gedächtnis einzelner Personen bleibt.

## Production Checklist

- [x] Jeder Istbild-Eintrag hat Quelle/Artefakt, Zeitraum, Evidenzart und ausdrückliche Grenze.
- [x] Toolnennungen werden nicht pauschal als Erfahrung aktiviert.
- [x] Istbild, Lernziel und neues Arbeitsartefakt sind getrennte Datenarten.
- [x] Sensible Daten, IP und personenbezogene Details werden als Schutzgrenze behandelt.
- [x] Lücken sind gegen konkrete Zielrollen priorisiert und als nächste Nachweise beschrieben.
- [ ] Die Vorlagen wurden vom Lernenden mit eigenen Einträgen gefüllt.
- [ ] Eine unabhängige Prüfung des eigenen Dossiers steht aus.

## Interviewfragen mit Antwortleitfäden

1. **Wie würden Sie Erfahrung mit einer Technologie präzise darstellen?**  
   Mit Projekt, Zeitraum, Tätigkeit, Evidenzart, konkretem Umfang und Grenze. Eine gute Antwort nennt auch, was nicht behauptet wird.

2. **Warum ist ein Prototyp kein Produktionsnachweis?**  
   Es fehlen oft reale Last, SLO, Incident, Zugriffskontrolle, Datenklassifikation, Change- und Recovery-Evidenz.

3. **Wie schließen Sie eine Kompetenzlücke für eine GenAI-Architektur?**  
   Der Claim wird in einen Mechanismus, ein Risiko, ein Artefakt, eine Gegenprobe und einen Review übersetzt. Ein neuer Toolkurs allein genügt nicht.

4. **Wie vermeiden Sie Evidence Theater?**  
   Jede Arbeitsprobe braucht eine Hypothese, eine Fehlbedingung, ein Ergebnis, eine Grenze und eine nachvollziehbare Entscheidung.

5. **Was darf eine Chief-Rolle aus einem individuellen Portfolio ableiten?**  
   Nur begrenzte, überprüfbare Hinweise. Portfolioentscheidungen brauchen zusätzlich Team-, Risiko-, Kosten- und Organisationssicht.

6. **Wann sind digitale Verifiable Credentials sinnvoll?**  
   Wenn Aussteller, Empfänger, Datenschutz, Widerruf und Verifikationszweck klar sind. Sie ergänzen technische Artefakte, ersetzen sie aber nicht.

## Praktisches Lab: Evidenzdossier für einen Architekturclaim

**Ziel.** Erstelle ein minimales, redigiertes Evidenzdossier: drei Istbild-Einträge, eine priorisierte Lücke und einen neuen Nachweis für genau einen Claim. Beispielclaim: „Ich kann eine Toolaktion gegen falsche Token-Audience absichern.“

1. Fülle die Istbild-Vorlage mit drei eigenen Einträgen (EV-01 bis EV-03) inklusive Evidenzart und Grenze.
2. Wähle eine Zielrolle, ordne die Einträge ihren Clustern zu und leite eine priorisierte Lücke ab.
3. Definiere für die Lücke Claim Scope und die zulässige Aussage.
4. Erstelle ein kleines Testartefakt in lokaler oder freigegebener Umgebung; führe Happy Path und Gegenprobe mit falscher Audience aus.
5. Sichere nur redigierte Testergebnisse, Konfiguration ohne Secrets, Datum, Umgebung und Grenze – was der Test nicht beweist, etwa Vollständigkeit für alle Identity Provider oder Produktionslast.
6. Bitte um einen Review und lege erst danach einen neuen Istbild-Eintrag (EV-04, Evidenzart „Lab“) an.

**Erwartetes Ergebnis.** Ein überprüfbarer, begrenzter Nachweis statt einer allgemeinen Selbstbeschreibung, und ein Zielbild, das sichtbar vom Istbild getrennt bleibt. **Labstatus:** reviewed_only, weil dieses Kapitel die Methode vorgibt, aber keine konkrete Arbeitsprobe erzeugt oder unabhängig abnimmt.

## Dependencies, Cross-References und Quellen

Grundbegriffe stehen in [KB-0001](01-master-index-und-wegweiser.md), die Kompetenzdimensionen in [KB-0002](02-rollen-kompetenz-matrix.md). Das spätere Kompetenzmodell, die Lerntiefe und die Laborstrategie folgen in [KB-0005](01-master-index-und-wegweiser.md#kb-0005), [KB-0006](01-master-index-und-wegweiser.md#kb-0006) und [KB-0009](01-master-index-und-wegweiser.md#kb-0009). Die detaillierten Zielrollen beginnen bei [KB-0011](01-master-index-und-wegweiser.md#kb-0011).

**Verwendete Quellen, Stand 2026-09-14.**

- Artikelvertrag: Kompetenzmarker, Quellen, Labs und Review
- Masterplan: Zielrollen und Evidenzmodell
- [W3C Verifiable Credentials Data Model v2.0](https://www.w3.org/TR/vc-data-model/)

## Bonus: New Tech and Innovations

**Stand: 2026-09-14.** Verifiable Credentials Data Model v2.0 ist seit dem 15. Mai 2025 eine W3C Recommendation und beschreibt ein Modell für kryptografisch manipulationsgeschützte, datensparsame und maschinenprüfbare Claims. Für technische Portfolios ist das **Adopting**, nicht automatisch ein Standard: Die zentrale Frage bleibt, wer der vertrauenswürdige Aussteller ist, welche Claims wirklich offengelegt werden dürfen und wie Widerruf, Verlust, Korrelation und Datenschutz behandelt werden.

Ein sinnvoller Pilot beschränkt sich auf einen nicht sensiblen Lernnachweis mit klarer Ausstellerrolle und explizitem Verifikationszweck. Das Abnahmekriterium lautet: Der Nachweis lässt sich auf Integrität und Aussteller prüfen, offenbart nicht mehr Daten als notwendig und verlinkt weiterhin auf ein verständliches technisches Artefakt samt Gegenprobe. Ein signiertes Credential ohne technische Erklärung wäre weiterhin Evidence Theater.
