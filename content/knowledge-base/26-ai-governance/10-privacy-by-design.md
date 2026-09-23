---
{"id": "KB-0626", "title": "Privacy by Design", "domain": "26", "sequence": 10, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "GENAI", "CHIEF"], "requires": [{"id": "KB-0618", "concepts": ["GDPR und Datenschutzarchitektur"], "needed_for": "understanding"}, {"id": "KB-0625", "concepts": ["DPIA und Privacy-Risikobewertung"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Datenminimierung, Zweckbindung und sichere Voreinstellungen für ein konkretes System anhand etablierter Praxis korrekt in technische Systemgrenzen übersetzen und Pseudonymisierung sowie Trennung von Nutzdaten und Telemetrie praktisch planen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Privacy-by-Design-Prinzipien von Beginn der Systemarchitektur an umgesetzt werden, statt als nachträgliche Ergänzung, aufbauend auf den bereits in KB-0618 und KB-0625 behandelten Grundlagen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn Telemetriedaten unbeabsichtigt mit Nutzdaten vermischt werden und dadurch die eigentlich beabsichtigte Datenminimierung untergraben wird, und die notwendige technische Trennung ableiten können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Privacy by Design festlegen, die Minimierung, Zweckbindung und sichere Voreinstellungen als verbindliche, architektonische Anforderung statt nachträgliche Ergänzung etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, kryptografische Implementierung spezifischer Pseudonymisierungsverfahren ist bereits in Domain 23 behandelt.", "rationale": "Kern ist die architektonische Integration von Privacy-by-Design-Prinzipien von Systembeginn an, nicht die kryptografische Detailimplementierung."}}, "lab_validation": [{"lab_id": "KB-0626-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Erkennung vermischter Nutzdaten und Telemetrie, kein produktives Datenschutz-Tool verwendet", "evidence": "Ein lokales Skript prüft ein simuliertes Telemetrieereignis darauf, ob es unbeabsichtigt Nutzdatenfelder statt nur betrieblich notwendiger Metadaten enthält, und markiert solche Vermischungen als Verstoß gegen die beabsichtigte Datentrennung.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Datenschutz-Tool."}]}
---
# Privacy by Design

> **Ziel:** Privacy by Design bedeutet, dass Datenminimierung, Zweckbindung (siehe die bereits in [KB-0618](02-gdpr-und-datenschutzarchitektur.md) behandelten Grundsätze) und sichere Voreinstellungen von Beginn der Systemarchitektur an eingeplant werden, nicht als nachträgliche Ergänzung nach abgeschlossener Systementwicklung. Der zentrale Punkt dieses Kapitels ist die praktische Übersetzung dieser Prinzipien in konkrete, technische Systemgrenzen — insbesondere die **Trennung von Nutzdaten und Telemetrie**: Betriebliche Telemetriedaten (etwa Fehlerprotokolle, Performance-Metriken), die primär für den technischen Betrieb eines Systems benötigt werden, sollten strukturell von den eigentlichen Nutzdaten getrennt sein, da eine unbeabsichtigte Vermischung dazu führen kann, dass personenbezogene Nutzdaten in Systemen landen (etwa Log-Aggregations- oder Monitoring-Systemen), die ursprünglich nicht für die datenschutzkonforme Verarbeitung personenbezogener Daten konzipiert wurden.

## Zweck, Mental Model und Dependencies

Datenminimierung als architektonisches Prinzip bedeutet, dass ein System von Beginn an so gestaltet wird, dass es nur die tatsächlich für den jeweiligen Zweck notwendigen Datenfelder erfasst und verarbeitet, statt möglichst viele Daten "auf Vorrat" zu sammeln, falls sie später einmal nützlich sein könnten — diese architektonische Entscheidung ist deutlich schwieriger nachträglich zu korrigieren als von Beginn an einzuplanen, da ein System, das bereits umfangreiche Datenerfassung in seine Kernarchitektur eingebaut hat, diese Erfassung später nur mit erheblichem Aufwand reduzieren kann. Sichere Voreinstellungen bedeuten, dass ein System standardmäßig die datenschutzfreundlichste, restriktivste Konfiguration verwendet, statt eine offene, datenschutzunfreundliche Voreinstellung zu wählen, die Nutzer aktiv einschränken müssten — diese Umkehrung der Standardeinstellung (restriktiv als Standard, offen nur nach expliziter Entscheidung, statt offen als Standard, restriktiv nur nach expliziter Konfiguration) ist ein zentraler, praktischer Unterschied, der die tatsächliche Datenschutzlage eines Systems maßgeblich prägt, da die meisten Nutzer voreingestellte Konfigurationen unverändert lassen. Die praktische Trennung von Nutzdaten und Telemetrie ist eine der konkretesten, technischen Umsetzungen von Privacy by Design: Telemetriesysteme (Log-Aggregation, Monitoring, Observability-Werkzeuge, siehe die bereits in Domain 24 behandelten Observability-Praktiken) sind primär für technische Betriebszwecke konzipiert und häufig nicht mit denselben Datenschutzkontrollen wie Systeme für personenbezogene Nutzdaten ausgestattet — eine unbeabsichtigte Vermischung (etwa wenn ein Entwickler versehentlich vollständige Nutzeranfragen inklusive personenbezogener Inhalte in einem Fehlerprotokoll erfasst, das an ein zentrales Log-Aggregationssystem übermittelt wird) kann dazu führen, dass personenbezogene Daten in einem System landen, das weder für die entsprechende Zweckbindung noch für die entsprechenden Zugriffskontrollen konzipiert wurde. Pseudonymisierung ergänzt diese architektonischen Prinzipien um eine technische Schutzmaßnahme: Wo eine direkte Identifizierbarkeit nicht für den tatsächlichen Zweck notwendig ist, sollten Daten durch pseudonymisierte Kennungen ersetzt werden, sodass eine Re-Identifizierung nur unter zusätzlichen, kontrollierten Bedingungen möglich ist, statt Daten standardmäßig mit direkt identifizierenden Merkmalen zu verarbeiten.

~~~text
Privacy by Design: data minimization + purpose limitation (KB-0618) + secure defaults
  planned from BEGINNING of system architecture, not as after-the-fact addition post-development
KEY POINT: practical translation into concrete, technical system boundaries
  ESPECIALLY: separation of USER DATA and TELEMETRY
  operational telemetry (error logs, performance metrics) primarily needed for technical operation
  should be STRUCTURALLY separated from actual user data
  unintentional mixing -> personal user data can land in systems (log aggregation/monitoring)
    NOT originally designed for privacy-compliant processing of personal data
DATA MINIMIZATION as architectural principle: system designed from start to only capture+process
  data fields actually necessary for given purpose
  instead of collecting as much data as possible "just in case" it's useful later
  this architectural decision substantially HARDER to correct after the fact than to plan from start
  system already having extensive data capture built into CORE architecture
    -> can only reduce that capture later w/ substantial effort
SECURE DEFAULTS: system uses most privacy-friendly, restrictive configuration by DEFAULT
  instead of open, privacy-unfriendly default users would have to actively restrict
  this DEFAULT REVERSAL (restrictive as default, open only after explicit decision
    -- instead of open as default, restrictive only after explicit config)
  = central, practical difference substantially shaping actual privacy posture of a system
  since MOST users leave default configurations unchanged
PRACTICAL SEPARATION of user data + telemetry = one of most concrete technical implementations
  telemetry systems (log aggregation, monitoring, observability tools, Domain 24)
  primarily designed for technical operational purposes, often NOT equipped w/ same privacy
    controls as systems for personal user data
  unintentional mixing (developer accidentally logs full user request incl. personal content
    into error log forwarded to central log aggregation system)
  -> personal data lands in system designed for NEITHER matching purpose limitation
     NOR matching access controls
PSEUDONYMIZATION adds technical protection measure to these architectural principles
  where direct identifiability not needed for actual purpose, data should be replaced by
    pseudonymized identifiers
  re-identification only possible under additional, controlled conditions
  instead of processing data with directly identifying features by default
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Datenminimierung als Architekturprinzip | begrenzt Erfassung auf tatsächlich notwendige Felder | schwer nachträglich korrigierbar, muss von Beginn an geplant werden |
| Sichere Voreinstellung | restriktive Konfiguration als Standard | prägt tatsächliche Datenschutzlage, da Standards meist unverändert bleiben |
| Trennung Nutzdaten/Telemetrie | verhindert Vermischung in betriebliche Systeme | schützt vor Fehlplatzierung in nicht datenschutzkonforme Systeme |
| Pseudonymisierung | ersetzt direkte Identifizierbarkeit wo nicht notwendig | erschwert unautorisierte Re-Identifizierung |

Implementierung: Systemarchitektur wird von Beginn an auf minimale, tatsächlich notwendige Datenerfassung ausgelegt. Neue Systeme und Funktionen erhalten standardmäßig die restriktivste, datenschutzfreundlichste Konfiguration. Telemetrie- und Logging-Pfade werden technisch strukturell von Nutzdatenpfaden getrennt, mit expliziter Prüfung, dass keine personenbezogenen Inhalte in Telemetriedaten gelangen. Wo direkte Identifizierbarkeit nicht notwendig ist, werden pseudonymisierte Kennungen verwendet.

## Scalability, Reliability, Security und Observability

Privacy by Design skaliert die tatsächliche Datenschutzverlässlichkeit proportional zur Konsequenz, mit der Minimierung, sichere Voreinstellungen und Datentrennung von Systembeginn an statt nachträglich umgesetzt werden; die Reliability-Grenze liegt darin, dass eine nachträgliche Korrektur einer bereits umfangreich datensammelnden Systemarchitektur erheblich aufwendiger ist als eine von Beginn an minimierte Gestaltung.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| personenbezogene Nutzerinhalte erscheinen unerwartet in einem zentralen Log-Aggregationssystem | Telemetrie- und Nutzdatenpfade wurden nicht strukturell getrennt | eine explizite, technische Trennung mit Prüfung auf personenbezogene Inhalte in Telemetriedaten einführen |
| Nutzer sind unbeabsichtigt einer datenschutzunfreundlichen Konfiguration ausgesetzt | die Standardkonfiguration ist offen statt restriktiv | die Standardkonfiguration auf die restriktivste, datenschutzfreundlichste Einstellung umstellen |
| eine spätere Datenminimierung erweist sich als aufwendig und riskant | die Systemarchitektur wurde ursprünglich für umfangreiche Datenerfassung statt Minimierung ausgelegt | Datenminimierung als architektonische Anforderung für künftige Systeme von Beginn an verbindlich machen |

Security: Pseudonymisierte Kennungen sollten mit angemessenen Zugriffskontrollen für den Re-Identifizierungsschlüssel kombiniert werden, um unautorisierte Re-Identifizierung zu verhindern. Observability: Die tatsächliche Häufigkeit entdeckter Vermischungen von Nutzdaten und Telemetrie ist ein zentrales Signal zur Bewertung, ob die technische Trennung tatsächlich wirksam umgesetzt ist.

## Trade-offs und Entscheidungen

**Staff** implementiert eine gegebene Systemfunktion mit korrekter Datenminimierung und sicherer Voreinstellung. **Principal** entwirft die vollständige Privacy-by-Design-Architektur mit Datentrennung und Pseudonymisierung für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für Privacy by Design fest, die architektonische Integration statt nachträglicher Ergänzung verbindlich machen.

Anti-Patterns: Systeme mit umfangreicher, "vorsorglicher" Datenerfassung entwerfen, statt Datenminimierung von Beginn an einzuplanen; offene, datenschutzunfreundliche Standardkonfigurationen verwenden, die Nutzer aktiv einschränken müssten; Telemetrie- und Nutzdatenpfade ohne technische Trennung vermischen.

## Production Checklist

- [ ] Systemarchitektur ist von Beginn an auf minimale, tatsächlich notwendige Datenerfassung ausgelegt.
- [ ] Neue Systeme und Funktionen erhalten standardmäßig die restriktivste, datenschutzfreundlichste Konfiguration.
- [ ] Telemetrie- und Nutzdatenpfade sind technisch strukturell getrennt.
- [ ] Pseudonymisierte Kennungen werden verwendet, wo direkte Identifizierbarkeit nicht notwendig ist.

## Interviewfragen

### 1. Warum sollte Datenminimierung von Beginn der Systemarchitektur an eingeplant werden?

**Antwort:** Weil eine bereits umfangreiche Datenerfassung in der Kernarchitektur später nur mit erheblichem Aufwand reduziert werden kann, während eine von Beginn an minimierte Gestaltung diesen nachträglichen Aufwand vermeidet.

### 2. Was bedeutet "sichere Voreinstellung" im Kontext von Privacy by Design?

**Antwort:** Ein System verwendet standardmäßig die datenschutzfreundlichste, restriktivste Konfiguration, statt eine offene Voreinstellung zu wählen, die Nutzer aktiv einschränken müssten.

### 3. Warum ist die Trennung von Nutzdaten und Telemetrie eine der konkretesten Umsetzungen von Privacy by Design?

**Antwort:** Weil Telemetriesysteme primär für technische Betriebszwecke konzipiert sind und häufig nicht mit denselben Datenschutzkontrollen wie Systeme für personenbezogene Nutzdaten ausgestattet sind, sodass eine Vermischung personenbezogene Daten in ungeeignete Systeme bringen kann.

### 4. Wofür wird Pseudonymisierung eingesetzt?

**Antwort:** Um direkte Identifizierbarkeit zu ersetzen, wo sie für den tatsächlichen Zweck nicht notwendig ist, sodass eine Re-Identifizierung nur unter zusätzlichen, kontrollierten Bedingungen möglich ist.

### 5. Wie gehst du vor, wenn personenbezogene Nutzerinhalte unerwartet in einem zentralen Log-Aggregationssystem erscheinen?

**Antwort:** Ich prüfe, ob Telemetrie- und Nutzdatenpfade strukturell getrennt sind, und führe eine explizite technische Trennung mit Prüfung auf personenbezogene Inhalte in Telemetriedaten ein.

### 6. Widersprüchliche Anforderung: Das Entwicklungsteam will umfangreiche Telemetrie für effektives Debugging UND die Organisation will strikte Trennung von Nutzdaten und Telemetrie — wie gehst du vor?

**Antwort:** Ich würde Telemetrie explizit auf technisch notwendige Metadaten (Zeitstempel, Fehlercodes, Performance-Kennzahlen) statt vollständiger Nutzeranfrageinhalte beschränken und bei Bedarf pseudonymisierte Referenzkennungen für gezieltes Debugging bereitstellen, statt entweder umfangreiches Debugging zu opfern oder Nutzdaten unkontrolliert in Telemetriesysteme gelangen zu lassen.

## Praktische Labs

~~~python
# Local, deterministic simulation of detecting user data leaking into telemetry (executed locally, no real privacy tool):

def check_telemetry_separation(telemetry_event, forbidden_fields):
    leaked_fields = [f for f in forbidden_fields if f in telemetry_event]
    return {"event": telemetry_event.get("event_type"), "leaked_user_data_fields": leaked_fields}

telemetry_event = {"event_type": "request_error", "status_code": 500, "user_email": "user@example.com"}
forbidden_fields = ["user_email", "full_name", "address"]

print(check_telemetry_separation(telemetry_event, forbidden_fields))
~~~

## Dependencies, Cross-References und Quellen

1. Europäischer Datenschutzausschuss: [Guidelines 4/2019 on Article 25 Data Protection by Design and by Default](https://edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-42019-article-25-data-protection-design-and_en), abgerufen 2026-09-18.
2. Ann Cavoukian: [Privacy by Design — The 7 Foundational Principles](https://www.ipc.on.ca/privacy-by-design/), abgerufen 2026-09-18.

GDPR und Datenschutzarchitektur sind kanonisch in [KB-0618](02-gdpr-und-datenschutzarchitektur.md) behandelt; DPIA und Privacy-Risikobewertung in [KB-0625](09-dpia-und-privacy-risikobewertung.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Erkennung personenbezogener Datenmuster in Telemetriepipelines vor deren Speicherung | Evaluating | Als ergänzende, technische Absicherung einführen, jedoch die architektonische Trennung von Nutzdaten und Telemetrie als primäre, strukturelle Maßnahme beibehalten, statt sich allein auf nachträgliche Erkennung zu verlassen. |

Ein Team akzeptiert eine Privacy-by-Design-Umsetzung erst, wenn Datenminimierung, sichere Voreinstellungen und die technische Trennung von Nutzdaten und Telemetrie nachweislich von Systembeginn an, nicht nachträglich, etabliert sind.
