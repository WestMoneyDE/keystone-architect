---
{"id": "KB-0604", "title": "ServiceNow CMDB", "domain": "25", "sequence": 16, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0591", "concepts": ["Application Architecture im Unternehmen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Das ServiceNow-CMDB-Datenmodell (CI-Klassen, Beziehungen) anhand offizieller Dokumentation korrekt einordnen und den Reconciliation-Prozess für eine verlässliche Konfigurationsbasis planen können, ohne praktische ServiceNow-Betriebstiefe zu behaupten.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Datenqualität und Ownership für CMDB-Konfigurationselemente sichergestellt werden, um eine tatsächlich verlässliche statt formal existierende Konfigurationsbasis zu erreichen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine CMDB formal vollständig befüllt, aber durch fehlenden Reconciliation-Prozess tatsächlich veraltet und unzuverlässig ist, und dies von einer tatsächlich verlässlichen Konfigurationsbasis unterscheiden können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für CMDB-Datenqualität und Ownership festlegen, die eine formal vollständige, aber tatsächlich veraltete Konfigurationsbasis strukturell verhindern.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, produktspezifische ServiceNow-Konfiguration und -Administration im Detail ist Vertiefung und wird hier ausdrücklich nicht als praktische Erfahrung behauptet.", "rationale": "Kern ist das Verständnis von Datenmodell, Reconciliation und Datenqualität als Konzept, nicht die produktspezifische ServiceNow-Administration."}}, "lab_validation": [{"lab_id": "KB-0604-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation einer veralteten CMDB ohne Reconciliation, kein produktives ServiceNow-System verwendet", "evidence": "Ein lokales Skript simuliert, wie ein CMDB-Datenbestand ohne regelmäßigen Reconciliation-Abgleich gegen die tatsächliche Infrastruktur zunehmend von der Realität abweicht, während eine formal vollständige Anzahl an Konfigurationselementen weiterhin gemeldet wird.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales ServiceNow-System."}]}
---
# ServiceNow CMDB

> **Ziel:** Eine CMDB (Configuration Management Database) wie die von ServiceNow speichert **Konfigurationselemente** (CIs — etwa Server, Anwendungen, Netzwerkkomponenten, entsprechend den bereits in [KB-0591](03-application-architecture-im-unternehmen.md) behandelten Anwendungskartierungen) und deren Beziehungen in **Klassen** eines strukturierten Datenmodells. Dieses Kapitel behandelt das Datenmodell, Klassenstruktur und den **Reconciliation**-Prozess (den Abgleich der CMDB-Daten gegen die tatsächliche, reale Infrastruktur) konzeptionell, ausdrücklich ohne praktische ServiceNow-Betriebstiefe zu behaupten. Der zentrale Punkt dieses Kapitels ist, dass eine CMDB nur dann eine tatsächlich verlässliche Konfigurationsbasis darstellt, wenn **Datenqualität** und **Ownership** aktiv sichergestellt werden — eine CMDB, die formal eine vollständige Anzahl an Konfigurationselementen enthält, aber ohne regelmäßigen Reconciliation-Prozess gegen die tatsächliche Infrastruktur abgeglichen wird, driftet zunehmend von der Realität ab und wird trotz formaler Vollständigkeit zunehmend unzuverlässig.

## Zweck, Mental Model und Dependencies

Das CMDB-Datenmodell strukturiert Konfigurationselemente in Klassen (etwa "Server", "Anwendung", "Netzwerkgerät") mit jeweils spezifischen Attributen und expliziten Beziehungen zwischen Klassen (etwa "Anwendung X läuft auf Server Y", "Server Y ist Teil von Netzwerksegment Z") — diese Beziehungsstruktur ähnelt konzeptionell den bereits in [KB-0591](03-application-architecture-im-unternehmen.md) behandelten Anwendungsabhängigkeiten, jedoch auf einer typischerweise granulareren, technischeren Ebene (einzelne Server- und Netzwerkkomponenten statt reiner Anwendungsfunktionen). Der entscheidende, häufig unterschätzte Mechanismus für die tatsächliche Verlässlichkeit einer CMDB ist Reconciliation: der regelmäßige, idealerweise automatisierte Abgleich der in der CMDB gespeicherten Daten gegen die tatsächlich vorhandene, reale Infrastruktur (etwa über automatisierte Discovery-Werkzeuge, die tatsächlich laufende Server und Dienste erkennen) — ohne diesen Abgleich enthält eine CMDB zunehmend veraltete Einträge (Server, die längst stillgelegt wurden, aber weiterhin als aktiv gelistet sind) und fehlende Einträge (neue Server, die nie in die CMDB aufgenommen wurden), während die formale Anzahl der Einträge weiterhin vollständig erscheinen kann. Datenqualität und Ownership sind die organisatorische Ergänzung zum technischen Reconciliation-Prozess: Selbst ein technisch korrekt funktionierender Reconciliation-Abgleich kann Diskrepanzen nur aufzeigen, nicht automatisch beheben — es muss eine explizit benannte, verantwortliche Partei geben, die aufgezeigte Diskrepanzen tatsächlich untersucht und die CMDB-Daten korrigiert, da eine CMDB ohne diese aktive Pflege trotz technisch funktionierendem Reconciliation-Mechanismus dennoch zunehmend unzuverlässig wird, wenn aufgezeigte Diskrepanzen nicht tatsächlich bearbeitet werden.

~~~text
CMDB (Configuration Management Database, e.g. ServiceNow): stores CONFIGURATION ITEMS (CIs -- servers, apps,
  network components, related to KB-0591 app mapping) and their relationships in structured data model CLASSES
This chapter treats data model, class structure, RECONCILIATION conceptually
  EXPLICITLY WITHOUT claiming practical ServiceNow operational depth
KEY POINT: CMDB only actually reliable configuration basis when
  DATA QUALITY and OWNERSHIP are actively ensured
  CMDB formally containing complete number of CIs, but never reconciled against actual infra
    -> increasingly drifts from reality, becomes unreliable DESPITE formal completeness
CMDB data model: structures CIs into classes (server, application, network device) w/ specific attributes
  + explicit relationships between classes (app X runs on server Y, server Y part of network segment Z)
  this relationship structure conceptually similar to KB-0591 app dependencies,
    but typically at more granular, technical level (individual server/network components vs pure app functions)
RECONCILIATION = decisive, often underestimated mechanism for actual CMDB reliability
  regular, ideally automated matching of CMDB-stored data against ACTUALLY present, real infra
    (e.g. via automated discovery tools detecting actually-running servers/services)
  w/o this matching -> CMDB increasingly contains STALE entries (long-decommissioned servers still listed active)
    and MISSING entries (new servers never added to CMDB)
    while formal entry COUNT can still appear complete
DATA QUALITY + OWNERSHIP = organizational complement to technical reconciliation process
  even technically-correctly-functioning reconciliation match can only SURFACE discrepancies, not auto-fix them
  needs explicitly named, responsible party actually investigating surfaced discrepancies + correcting CMDB data
  CMDB w/o this active maintenance -> still increasingly unreliable despite technically functioning
    reconciliation mechanism, IF surfaced discrepancies aren't actually acted upon
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| CI-Klasse | kategorisiert Konfigurationselemente strukturiert | Grundlage des CMDB-Datenmodells |
| Beziehung | verknüpft CIs (Anwendung läuft auf Server) | ermöglicht Abhängigkeitsanalyse und Impactbewertung |
| Reconciliation | Abgleich der CMDB-Daten gegen reale Infrastruktur | zentraler Mechanismus gegen Datenveralterung |
| Ownership | benennt verantwortliche Partei für Datenkorrektur | verhindert unbehobene Diskrepanzen trotz Reconciliation |

Implementierung: Konfigurationselemente werden mit klaren Klassen und expliziten Beziehungen in der CMDB erfasst. Ein regelmäßiger, idealerweise automatisierter Reconciliation-Prozess gleicht die CMDB-Daten gegen die tatsächliche Infrastruktur ab. Aufgezeigte Diskrepanzen werden einer explizit benannten, verantwortlichen Partei zur Korrektur zugewiesen, statt unbearbeitet zu bleiben.

## Scalability, Reliability, Security und Observability

Eine CMDB skaliert ihre tatsächliche Verlässlichkeit proportional zur Regelmäßigkeit des Reconciliation-Prozesses und zur aktiven Bearbeitung aufgezeigter Diskrepanzen durch benannte Ownership; die Reliability-Grenze liegt darin, dass eine formal vollständig befüllte CMDB ohne diese aktive Pflege trotz scheinbarer Vollständigkeit zunehmend unzuverlässig wird.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Impactanalyse auf Basis der CMDB übersieht tatsächlich betroffene Systeme | die CMDB enthält veraltete oder fehlende Einträge durch unzureichende Reconciliation | einen regelmäßigen, automatisierten Reconciliation-Prozess gegen die tatsächliche Infrastruktur einführen |
| aufgezeigte Diskrepanzen zwischen CMDB und realer Infrastruktur bleiben dauerhaft unbehoben | keine explizit benannte, verantwortliche Partei für die Datenkorrektur existiert | eine explizite Ownership-Zuordnung für die Bearbeitung aufgezeigter Diskrepanzen einführen |
| die CMDB zeigt eine formal vollständige Anzahl an Konfigurationselementen, wird aber als unzuverlässig wahrgenommen | die formale Vollständigkeit spiegelt keine tatsächliche Datenaktualität wider | die tatsächliche Reconciliation-Abdeckung und Diskrepanz-Bearbeitungsquote statt der reinen Einträgeanzahl prüfen |

Security: Eine verlässliche CMDB ist eine wichtige Grundlage für sicherheitsrelevante Impactanalysen (etwa bei der Bewertung, welche Systeme von einer bekannten Schwachstelle betroffen sind). Observability: Die tatsächliche Reconciliation-Abdeckung und die Bearbeitungsquote aufgezeigter Diskrepanzen sind zentrale Signale zur Bewertung der tatsächlichen CMDB-Datenqualität.

## Trade-offs und Entscheidungen

**Staff** pflegt Konfigurationselemente und Beziehungen für einen gegebenen Bereich korrekt in der CMDB. **Principal** entwirft den vollständigen Reconciliation-Prozess und die Ownership-Struktur für eine verlässliche CMDB. **Chief** legt unternehmensweite Standards für CMDB-Datenqualität fest, die formale Vollständigkeit von tatsächlicher Verlässlichkeit strukturell unterscheiden.

Anti-Patterns: eine CMDB als verlässlich behandeln, weil sie formal vollständig befüllt ist, ohne den tatsächlichen Reconciliation-Status zu prüfen; aufgezeigte Diskrepanzen ohne benannte, verantwortliche Partei unbearbeitet lassen; Reconciliation als einmaligen statt regelmäßigen Prozess behandeln.

## Production Checklist

- [ ] Ein regelmäßiger, idealerweise automatisierter Reconciliation-Prozess gleicht die CMDB gegen die reale Infrastruktur ab.
- [ ] Aufgezeigte Diskrepanzen sind einer explizit benannten, verantwortlichen Partei zugewiesen.
- [ ] Die tatsächliche Reconciliation-Abdeckung wird als eigenständiges Qualitätssignal überwacht, nicht nur die formale Einträgeanzahl.
- [ ] CI-Beziehungen sind konsistent gepflegt, um belastbare Impactanalysen zu ermöglichen.

## Interviewfragen

### 1. Was ist der Zweck von Reconciliation in einer CMDB?

**Antwort:** Der regelmäßige Abgleich der in der CMDB gespeicherten Daten gegen die tatsächlich vorhandene, reale Infrastruktur, um veraltete oder fehlende Einträge zu erkennen.

### 2. Warum kann eine formal vollständig befüllte CMDB dennoch unzuverlässig sein?

**Antwort:** Weil ohne regelmäßigen Reconciliation-Abgleich veraltete Einträge (längst stillgelegte Server) und fehlende Einträge (nie erfasste, neue Server) entstehen, während die formale Anzahl der Einträge weiterhin vollständig erscheinen kann.

### 3. Warum reicht ein technisch funktionierender Reconciliation-Prozess allein nicht aus?

**Antwort:** Weil er Diskrepanzen nur aufzeigen, nicht automatisch beheben kann — es braucht eine explizit benannte, verantwortliche Partei, die aufgezeigte Diskrepanzen tatsächlich untersucht und korrigiert.

### 4. Was ist der Unterschied zwischen einer CI-Klasse und einer Beziehung im CMDB-Datenmodell?

**Antwort:** Eine CI-Klasse kategorisiert ein Konfigurationselement (etwa "Server"), während eine Beziehung die Verknüpfung zwischen zwei CIs darstellt (etwa "Anwendung läuft auf Server").

### 5. Wie gehst du vor, wenn eine Impactanalyse auf CMDB-Basis tatsächlich betroffene Systeme übersieht?

**Antwort:** Ich prüfe, ob die CMDB veraltete oder fehlende Einträge durch unzureichende Reconciliation enthält, und führe einen regelmäßigen, automatisierten Reconciliation-Prozess ein, falls dieser fehlt oder unzureichend ist.

### 6. Widersprüchliche Anforderung: Die Organisation will minimalen manuellen Pflegeaufwand für die CMDB UND vollständige, verlässliche Datenqualität — wie gehst du vor?

**Antwort:** Ich würde einen automatisierten Discovery-basierten Reconciliation-Prozess einführen, der den manuellen Pflegeaufwand auf die tatsächliche Bearbeitung aufgezeigter Diskrepanzen begrenzt, statt entweder auf automatisierte Erkennung zu verzichten oder vollständige manuelle Pflege ohne Automatisierung zu betreiben.

## Praktische Labs

~~~python
# Local, deterministic simulation of CMDB drift without reconciliation (executed locally, no real ServiceNow system):

def check_cmdb_drift(cmdb_entries, actual_infra):
    stale = [e for e in cmdb_entries if e not in actual_infra]
    missing = [a for a in actual_infra if a not in cmdb_entries]
    return {"formal_count": len(cmdb_entries), "stale_entries": stale, "missing_entries": missing}

cmdb_entries = ["server-01", "server-02", "server-03"]
actual_infra = ["server-02", "server-03", "server-04"]  # server-01 decommissioned, server-04 never added

print(check_cmdb_drift(cmdb_entries, actual_infra))
~~~

## Dependencies, Cross-References und Quellen

1. ServiceNow-Dokumentation: [Configuration Management Database (CMDB) Overview](https://www.servicenow.com/docs/bundle/xanadu-it-service-management/page/product/configuration-management/concept/c_ITILConfigurationManagement.html), abgerufen 2026-09-18.
2. ServiceNow-Dokumentation: [CMDB Reconciliation](https://www.servicenow.com/docs/bundle/xanadu-it-service-management/page/product/configuration-management/concept/c_CMDBReconciliation.html), abgerufen 2026-09-18.

Application Architecture im Unternehmen ist kanonisch in [KB-0591](03-application-architecture-im-unternehmen.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte, automatische Erkennung und Vorschlagsgenerierung für CMDB-Diskrepanzkorrekturen aus Discovery-Daten | Evaluating | Als Vorschlagswerkzeug für die verantwortliche Ownership-Partei einsetzen, jedoch die abschließende Korrekturentscheidung weiterhin als menschlich geprüfte Handlung behandeln, um fehlerhafte automatische Korrekturen zu vermeiden. |

Ein Team akzeptiert eine CMDB als verlässliche Konfigurationsbasis erst, wenn ein regelmäßiger Reconciliation-Prozess und eine aktive, benannte Ownership für Diskrepanzkorrekturen nachweislich etabliert sind, statt formale Vollständigkeit als ausreichend zu betrachten.
