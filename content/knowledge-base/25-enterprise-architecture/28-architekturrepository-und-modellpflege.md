---
{"id": "KB-0616", "title": "Architekturrepository und Modellpflege", "domain": "25", "sequence": 28, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0597", "concepts": ["ArchiMate und Modellbeziehungen"], "needed_for": "understanding"}, {"id": "KB-0613", "concepts": ["Architekturgovernance und Entscheidungsrechte"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Artefakte, Beziehungen und Beschlüsse in einem Architekturrepository mit korrekter Versionierung und benannter Ownership anhand etablierter Praxis pflegen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Aktualität, Zugriff und Ownership ein Architekturrepository dauerhaft verwendbar statt zu einer veralteten, unzuverlässigen Ablage werden lassen, aufbauend auf den bereits in KB-0597 und KB-0613 behandelten Bausteinen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein Architekturrepository formal existiert, aber durch fehlende Aktualitätspflege tatsächlich veraltete, nicht mehr vertrauenswürdige Informationen enthält, und dies von einer tatsächlich gepflegten Wissensbasis unterscheiden können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Architekturrepository-Pflege festlegen, die Aktualität, Zugriff und Ownership verbindlich regeln, um eine dauerhaft verlässliche Enterprise-Wissensbasis sicherzustellen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die produktspezifische Implementierung eines bestimmten Repository-Werkzeugs im Detail ist Vertiefung.", "rationale": "Kern ist die organisatorische Pflegepraxis (Aktualität, Zugriff, Ownership), nicht die produktspezifische Werkzeugimplementierung."}}, "lab_validation": [{"lab_id": "KB-0616-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Erkennung veralteter, nicht gepflegter Repository-Einträge, kein produktives Repository-Tool verwendet", "evidence": "Ein lokales Skript prüft eine Liste von Architekturartefakten auf ihr letztes tatsächliches Aktualisierungsdatum und markiert Einträge, die über einen definierten Zeitraum nicht aktualisiert wurden, als potenziell veraltet und vertrauenswürdigkeitsmindernd.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Repository-Tool."}]}
---
# Architekturrepository und Modellpflege

> **Ziel:** Dieses abschließende Kapitel von Domain 25 führt die zuvor behandelten Bausteine — ArchiMate-Modellbeziehungen ([KB-0597](09-archimate-und-modellbeziehungen.md)), Architekturgovernance ([KB-0613](25-architekturgovernance-und-entscheidungsrechte.md)) und implizit alle vorherigen, im Repository dokumentierten Artefakte dieses Domains (Fähigkeiten, Referenzarchitekturen, Prinzipien, Technologiestandards) — zu der Frage zusammen, wie ein Architekturrepository als **dauerhaft verwendbare Enterprise-Wissensbasis** gepflegt wird. Der zentrale Punkt dieses Kapitels ist, dass ein Repository, das Artefakte, Beziehungen und Beschlüsse zwar formal speichert, aber ohne konsequente **Versionierung**, **Aktualitätspflege**, geregelten **Zugriff** und benannte **Ownership** betreibt, mit der Zeit zu einer zunehmend unzuverlässigen, nicht mehr vertrauenswürdigen Ablage wird — dieselbe strukturelle Problematik, die bereits bei der CMDB-Datenqualität (siehe [KB-0609](21-discovery-und-cmdb-datenqualitaet.md)) behandelt wurde, gilt hier auf der Ebene der Architekturartefakte selbst: formale Existenz eines Repositorys ist keine Garantie für dessen tatsächliche Verlässlichkeit.

## Zweck, Mental Model und Dependencies

Versionierung ist die technische Grundlage, die ein Architekturrepository von einer einfachen, unstrukturierten Dokumentensammlung unterscheidet: Jede Änderung an einem Artefakt (etwa eine überarbeitete Referenzarchitektur oder ein aktualisiertes Architekturprinzip, siehe [KB-0602](14-architekturprinzipien.md)) sollte nachvollziehbar sein — wer hat wann welche Änderung vorgenommen, und warum — da ohne diese Nachvollziehbarkeit unklar bleibt, ob eine aktuell im Repository sichtbare Version tatsächlich die maßgebliche, aktuell gültige Version ist. Aktualitätspflege adressiert ein verwandtes, aber eigenständiges Problem: Selbst ein versioniertes Repository kann veraltete Artefakte enthalten, wenn niemand tatsächlich dafür sorgt, dass Artefakte nach relevanten organisatorischen oder technischen Änderungen aktualisiert werden — ein Architekturprinzip, das seit Jahren nicht überprüft wurde, kann inzwischen veraltete Annahmen enthalten, ohne dass dies dem Repository selbst anzumerken ist, es sei denn, eine explizite Aktualitätskennzeichnung (etwa "zuletzt überprüft am") macht dies sichtbar. Geregelter Zugriff und benannte Ownership sind die organisatorische Ergänzung: Ohne eine explizit benannte, verantwortliche Person oder Rolle je Artefakt (oder je Artefaktkategorie) bleibt unklar, wer tatsächlich für die Aktualisierung eines bestimmten Artefakts verantwortlich ist, wodurch veraltete Artefakte unentdeckt und unkorrigiert bleiben — dieselbe strukturelle Notwendigkeit klarer Ownership, die bereits bei der CMDB-Reconciliation (siehe [KB-0604](16-servicenow-cmdb.md)) und bei der Application-Portfolio-Bewertung (siehe [KB-0601](13-application-portfolio-management.md)) behandelt wurde. Die zusammenfassende, methodische Konsequenz für dieses gesamte Domain ist, dass jedes der in den vorherigen 27 Kapiteln behandelten Artefakttypen (Geschäftsfähigkeiten, Referenzarchitekturen, Prinzipien, Technologiestandards, Value Narratives, Modernisierungsportfolio-Entscheidungen) letztlich in genau diesem Repository landet — und die tatsächliche, langfristige Nützlichkeit der gesamten Enterprise-Architecture-Praxis hängt davon ab, ob dieses Repository tatsächlich, nachweislich aktuell und vertrauenswürdig gehalten wird, statt formal zu existieren, aber inhaltlich zunehmend von der Realität abzudriften.

~~~text
Final Domain 25 chapter: joins prior building blocks (ArchiMate relationships KB-0597,
  architecture governance KB-0613, implicitly ALL prior domain artifacts: capabilities, ref architectures,
  principles, tech standards) into question of how a REPOSITORY is maintained as a
  LASTINGLY USABLE enterprise knowledge base
KEY POINT: repository formally storing artifacts/relationships/decisions but WITHOUT consistent
  VERSIONING, CURRENCY MAINTENANCE, regulated ACCESS, named OWNERSHIP
  -> becomes increasingly unreliable, no-longer-trustworthy storage over time
  SAME structural issue as CMDB data quality (KB-0609), here at level of architecture artifacts themselves
  formal repository existence is NOT a guarantee of its actual reliability
VERSIONING = technical basis distinguishing repository from simple, unstructured document collection
  every artifact change should be traceable (who changed what when, why)
  w/o this -> unclear whether currently-visible version is actually the authoritative, current version
CURRENCY MAINTENANCE addresses related-but-separate problem
  even a versioned repository can contain stale artifacts if nobody actually ensures
    updates after relevant org/technical changes
  architecture principle not reviewed for years -> can contain outdated assumptions
    invisible in the repository itself UNLESS explicit currency marker ("last reviewed on") makes it visible
REGULATED ACCESS + named OWNERSHIP = organizational complement
  w/o explicitly named responsible person/role per artifact (or category)
  unclear WHO is actually responsible for updating a given artifact
  -> stale artifacts stay undiscovered+uncorrected
  SAME structural need for clear ownership as CMDB reconciliation (KB-0604) and
    application portfolio assessment (KB-0601)
SUMMARIZING, METHODOLOGICAL CONSEQUENCE for whole domain: every artifact type from prior 27 chapters
  (capabilities, ref architectures, principles, tech standards, value narratives,
   modernization portfolio decisions) ultimately lands in EXACTLY this repository
  actual, long-term usefulness of WHOLE EA practice depends on whether this repository is
    actually, verifiably kept current+trustworthy
    instead of formally existing while content increasingly drifts from reality
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Versionierung | macht Artefaktänderungen nachvollziehbar | zeigt, ob aktuell sichtbare Version maßgeblich ist |
| Aktualitätskennzeichnung | markiert, wann ein Artefakt zuletzt tatsächlich geprüft wurde | deckt veraltete, nicht mehr geprüfte Artefakte auf |
| Geregelter Zugriff | steuert, wer Artefakte einsehen und ändern kann | schützt vor unautorisierten, nicht nachvollziehbaren Änderungen |
| Benannte Ownership | benennt verantwortliche Person/Rolle je Artefakt | stellt tatsächliche Aktualisierungsverantwortung sicher |

Implementierung: Jede Artefaktänderung im Repository wird versioniert mit nachvollziehbarer Änderungshistorie erfasst. Jedes Artefakt erhält ein explizites "zuletzt überprüft am"-Datum, das regelmäßig aktualisiert wird. Zugriffsrechte werden geregelt, mit benannter Ownership je Artefakt oder Artefaktkategorie, die für dessen Aktualität verantwortlich ist.

## Scalability, Reliability, Security und Observability

Ein Architekturrepository skaliert die tatsächliche, langfristige Nützlichkeit der gesamten Enterprise-Architecture-Praxis proportional zur Konsequenz von Versionierung, Aktualitätspflege und benannter Ownership; die Reliability-Grenze liegt darin, dass ein formal existierendes, aber nicht aktiv gepflegtes Repository zunehmend unzuverlässige, von der Realität abdriftende Informationen enthält.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Architekturentscheidung basiert auf einem Repository-Artefakt, das sich als veraltet herausstellt | keine Aktualitätskennzeichnung oder benannte Ownership stellte die regelmäßige Überprüfung sicher | eine explizite "zuletzt überprüft am"-Kennzeichnung mit benannter Ownership für dieses Artefakt einführen |
| unklar ist, welche Version eines Artefakts tatsächlich maßgeblich ist | keine konsequente Versionierung macht Änderungen nachvollziehbar | eine Versionierung mit nachvollziehbarer Änderungshistorie für alle Repository-Artefakte einführen |
| veraltete Artefakte bleiben unentdeckt und unkorrigiert | keine benannte, verantwortliche Person oder Rolle ist für die Aktualisierung zuständig | eine explizite Ownership-Zuordnung je Artefakt oder Artefaktkategorie einführen |

Security: Zugriff auf sensible Architekturartefakte (etwa Sicherheitsarchitekturprinzipien) sollte über geregelte, nachvollziehbare Zugriffskontrollen erfolgen. Observability: Die tatsächliche Aktualitätsrate der Repository-Artefakte (wie viele tatsächlich innerhalb eines definierten Zeitraums überprüft wurden) ist ein zentrales Signal zur Bewertung der Repository-Vertrauenswürdigkeit.

## Trade-offs und Entscheidungen

**Staff** pflegt ein gegebenes Artefakt korrekt mit Versionierung und Aktualitätskennzeichnung. **Principal** entwirft die vollständige Repository-Pflegestruktur mit Ownership-Zuordnung für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für Architekturrepository-Pflege fest, die Aktualität und Ownership verbindlich regeln.

Anti-Patterns: Artefakte ohne Versionierung oder nachvollziehbare Änderungshistorie pflegen; ein Repository ohne Aktualitätskennzeichnung betreiben, sodass veraltete Artefakte unentdeckt bleiben; Artefakte ohne benannte, verantwortliche Ownership führen, sodass Aktualisierung niemandem tatsächlich obliegt.

## Production Checklist

- [ ] Jede Artefaktänderung ist versioniert mit nachvollziehbarer Änderungshistorie erfasst.
- [ ] Jedes Artefakt hat eine explizite "zuletzt überprüft am"-Kennzeichnung.
- [ ] Zugriffsrechte sind geregelt und nachvollziehbar.
- [ ] Jedes Artefakt oder jede Artefaktkategorie hat eine benannte, verantwortliche Ownership.

## Interviewfragen

### 1. Warum ist Versionierung die technische Grundlage eines Architekturrepositorys?

**Antwort:** Sie macht Artefaktänderungen nachvollziehbar (wer hat wann was geändert), sodass eindeutig feststellbar ist, ob eine aktuell sichtbare Version tatsächlich die maßgebliche, gültige Version ist.

### 2. Warum kann ein versioniertes Repository dennoch veraltete Artefakte enthalten?

**Antwort:** Weil Versionierung nur Änderungen nachvollziehbar macht, aber nicht sicherstellt, dass Artefakte tatsächlich nach relevanten Änderungen aktualisiert werden — dafür ist eine explizite Aktualitätspflege notwendig.

### 3. Wofür wird eine benannte Ownership je Artefakt benötigt?

**Antwort:** Damit klar ist, wer tatsächlich für die Aktualisierung eines bestimmten Artefakts verantwortlich ist, da veraltete Artefakte ohne diese Zuordnung unentdeckt und unkorrigiert bleiben.

### 4. Welche strukturelle Parallele besteht zwischen Architekturrepository-Pflege und CMDB-Datenqualität?

**Antwort:** Beide zeigen, dass die formale Existenz eines Datenbestands keine Garantie für dessen tatsächliche Verlässlichkeit ist — nur aktive, konsequente Pflege (Aktualitätsprüfung, benannte Verantwortung) stellt tatsächliche Vertrauenswürdigkeit sicher.

### 5. Wie gehst du vor, wenn eine Architekturentscheidung auf einem Repository-Artefakt basiert, das sich als veraltet herausstellt?

**Antwort:** Ich prüfe, ob eine Aktualitätskennzeichnung oder benannte Ownership für dieses Artefakt fehlte, und führe künftig ein explizites "zuletzt überprüft am"-Datum mit klarer Verantwortlichkeit ein.

### 6. Widersprüchliche Anforderung: Die Organisation will ein umfassendes, vollständig dokumentiertes Architekturrepository UND minimalen Pflegeaufwand für die beteiligten Architekten — wie gehst du vor?

**Antwort:** Ich würde den Pflegeaufwand priorisiert auf tatsächlich kritische, häufig referenzierte Artefakte konzentrieren, mit klarer Ownership und regelmäßiger Aktualitätsprüfung, während weniger kritische Artefakte mit längeren, aber weiterhin definierten Überprüfungsintervallen gepflegt werden, statt entweder umfassende Dokumentation ohne Pflege oder minimalen, aber unvollständigen Bestand zu akzeptieren.

## Praktische Labs

~~~python
# Local, deterministic simulation of detecting stale repository artifacts (executed locally, no real repository tool):

def check_repository_freshness(artifacts, max_age_days, current_day):
    results = []
    for a in artifacts:
        age = current_day - a["last_reviewed_day"]
        results.append({"artifact": a["name"], "stale": age > max_age_days, "owner": a.get("owner")})
    return results

artifacts = [
    {"name": "Security Architecture Principle", "last_reviewed_day": 100, "owner": "Security Architect"},
    {"name": "Legacy Reference Architecture", "last_reviewed_day": 10, "owner": None},
]

for r in check_repository_freshness(artifacts, max_age_days=180, current_day=400):
    print(r)
~~~

## Dependencies, Cross-References und Quellen

1. The Open Group: [TOGAF Standard, 10th Edition — Architecture Repository](https://pubs.opengroup.org/togaf-standard/introduction/), abgerufen 2026-09-18.
2. Gartner-Referenzmodell: [Enterprise Architecture Repository Management](https://www.gartner.com/en/information-technology/glossary/enterprise-architecture-ea), abgerufen 2026-09-18.

ArchiMate-Modellbeziehungen sind kanonisch in [KB-0597](09-archimate-und-modellbeziehungen.md) behandelt; Architekturgovernance und Entscheidungsrechte in [KB-0613](25-architekturgovernance-und-entscheidungsrechte.md); CMDB-Datenqualität als strukturelle Parallele in [KB-0609](21-discovery-und-cmdb-datenqualitaet.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Aktualitätsprüfung von Repository-Artefakten mit automatischer Benachrichtigung der benannten Ownership bei Ablauf des Überprüfungsintervalls | Evaluating | Als unterstützendes Erinnerungswerkzeug einführen, jedoch die tatsächliche, inhaltliche Überprüfung und Aktualisierung weiterhin als menschliche, fachlich fundierte Aufgabe der benannten Ownership behandeln. |

Ein Team akzeptiert ein Architekturrepository erst, wenn Versionierung, Aktualitätspflege, geregelter Zugriff und benannte Ownership nachweislich etabliert sind, statt formale Existenz als ausreichend zu betrachten. Damit ist Domain 25 (Enterprise Architecture) vollständig ausgearbeitet.
