---
{"id": "KB-0588", "title": "Operational Readiness", "domain": "24", "sequence": 24, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "CLOUD", "MLOPS"], "requires": [{"id": "KB-0579", "concepts": ["Alerting und Bereitschaftsdienst"], "needed_for": "understanding"}, {"id": "KB-0586", "concepts": ["Disaster Recovery und Übungen"], "needed_for": "understanding"}, {"id": "KB-0565", "concepts": ["SLI, SLO und SLA"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Operational-Readiness-Prüfung für ein konkretes System anhand der in diesem Domain behandelten Bausteine (On-Call, Runbooks, SLOs, Recovery-Nachweise) korrekt durchführen und dokumentieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein konkretes System explizit gestalten, wie On-Call-Bereitschaft, Runbooks, SLO-Definition und Recovery-Nachweise zu einer vollständigen, vor Produktivübergabe geprüften Operational-Readiness-Bewertung zusammengeführt werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine formal als 'bereit' erklärte Operational-Readiness-Prüfung tatsächlich unbelegte Bausteine (etwa nie geprobte Recovery-Nachweise) enthält, und dies als verbliebenes Risiko statt als abgeschlossene Prüfung dokumentieren können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Operational-Readiness-Prüfungen vor Produktivübergabe festlegen, die eindeutige Ownership und explizit dokumentierte, verbliebene Risiken verbindlich machen, statt formale Vollständigkeit ohne tatsächliche Belegprüfung zu akzeptieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte technische Implementierung einzelner geprüfter Bausteine (Alerting, Runbooks, Backups) ist bereits in den jeweiligen vorherigen Kapiteln dieses Domains vertieft.", "rationale": "Kern ist die zusammenführende Prüfung und Dokumentation von Ownership und verbliebenen Risiken vor Produktivübergabe, nicht die technische Implementierung der einzelnen Bausteine."}}, "lab_validation": [{"lab_id": "KB-0588-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation einer Operational-Readiness-Prüfung mit unbelegten Bausteinen, kein produktives Readiness-System verwendet", "evidence": "Ein lokales Skript prüft eine Liste von Readiness-Kriterien (On-Call definiert, Runbook vorhanden, SLO definiert, Recovery-Nachweis erbracht) und markiert ein System als 'formal vollständig, aber mit verbliebenem Risiko', wenn ein Kriterium zwar formal als vorhanden markiert, aber nie tatsächlich validiert wurde (etwa ein Recovery-Nachweis ohne durchgeführte Übung).", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Operational-Readiness-System."}]}
---
# Operational Readiness

> **Ziel:** Dieses abschließende Kapitel von Domain 24 führt die zuvor behandelten Bausteine — Alerting und Bereitschaftsdienst ([KB-0579](15-alerting-und-bereitschaftsdienst.md)), SLI/SLO/SLA ([KB-0565](01-sli-slo-und-sla.md)), Incident Response, Postmortems, Kapazitätssteuerung, Chaos Engineering, RTO/RPO, Backup-Nachweise, Disaster Recovery und Multi-Region-Failover — zu einer einzigen, vor Produktivübergabe durchzuführenden **Operational-Readiness-Prüfung** zusammen. Der zentrale Punkt dieses Kapitels ist die Unterscheidung zwischen **formaler Vollständigkeit** (jeder Baustein ist als "vorhanden" markiert) und **tatsächlich belegter Bereitschaft** (jeder Baustein wurde tatsächlich validiert, nicht nur dokumentiert) — ein System, dessen Runbook zwar existiert, aber nie tatsächlich geübt wurde, oder dessen Backup-Wiederherstellbarkeit formal als Ziel definiert, aber nie tatsächlich gemessen wurde, ist formal vollständig, aber operativ nicht tatsächlich bereit. Jede Operational-Readiness-Prüfung muss deshalb explizit **eindeutige Ownership** (wer ist tatsächlich verantwortlich) und **verbliebene Risiken** (welche Bausteine formal, aber nicht tatsächlich belegt sind) festhalten, statt eine unvollständig geprüfte Bereitschaft als vollständig zu deklarieren.

## Zweck, Mental Model und Dependencies

Eine Operational-Readiness-Prüfung ist strukturell eine Aggregation der in diesem Domain einzeln behandelten Bausteine, nicht ein neuer, eigenständiger technischer Mechanismus — ihr Wert liegt darin, diese Bausteine an einem einzigen Übergabezeitpunkt systematisch zusammenzuführen und explizit zu prüfen, ob jeder Baustein tatsächlich belegt oder nur formal dokumentiert ist. On-Call-Bereitschaft (siehe [KB-0579](15-alerting-und-bereitschaftsdienst.md)) muss nicht nur als Rotation existieren, sondern tatsächlich mit handlungsfähigen Alarmen und einer funktionierenden Eskalationskette verbunden sein; ein Runbook muss nicht nur dokumentiert, sondern tatsächlich in einer Übung ausgeführt worden sein (siehe die bereits in [KB-0586](22-disaster-recovery-und-uebungen.md) behandelte Notwendigkeit geprobter DR-Übungen); ein SLO (siehe [KB-0565](01-sli-slo-und-sla.md)) muss nicht nur definiert, sondern tatsächlich messbar und mit funktionierender Alarmierung verbunden sein; und ein Recovery-Nachweis (Backup-Restore, RTO/RPO) muss tatsächlich gemessen, nicht nur formal vereinbart sein. Die entscheidende methodische Haltung ist, dass eine Operational-Readiness-Prüfung, die lediglich prüft, ob ein Dokument oder eine Konfiguration formal existiert, den eigentlichen Zweck verfehlt — sie muss stattdessen für jeden Baustein explizit fragen "wurde dies tatsächlich validiert, und wann zuletzt?", und jeden Baustein, der diese Frage nicht positiv beantworten kann, explizit als verbliebenes Risiko dokumentieren, statt ihn stillschweigend als erfüllt zu behandeln. Eindeutige Ownership ist die zweite zentrale Anforderung: Für jeden geprüften Baustein muss eine konkrete, namentlich benannte, verantwortliche Person oder ein Team feststehen, da eine Operational-Readiness-Prüfung ohne klare Ownership-Zuordnung im Ernstfall zu genau der unkoordinierten, verzögerten Reaktion führen kann, die die bereits in diesem Domain behandelten Praktiken (Incident Command, Triage) eigentlich verhindern sollen.

~~~text
This final Domain 24 chapter joins prior building blocks (alerting/on-call KB-0579, SLI/SLO/SLA KB-0565,
  incident response, postmortems, capacity, chaos engineering, RTO/RPO, backup proof, DR, multi-region failover)
  into a single OPERATIONAL READINESS check before production handoff
KEY POINT: distinguish FORMAL completeness (every building block marked "present")
  from ACTUALLY PROVEN readiness (every building block actually validated, not just documented)
  system with runbook that exists but was NEVER actually drilled, or backup restorability
    formally defined as target but NEVER actually measured
  -> formally complete, but operationally NOT actually ready
EVERY readiness check must explicitly record:
  CLEAR OWNERSHIP (who is actually responsible)
  REMAINING RISKS (which building blocks are formal-only, not actually proven)
  instead of declaring incompletely-checked readiness as complete
Readiness check = structural AGGREGATION of already-covered building blocks, not a new standalone mechanism
  value: systematically joins them at a single handoff point, explicitly checks actual-vs-formal proof
    on-call readiness (KB-0579): not just existing as a rotation
      -> must actually connect to actionable alerts + working escalation chain
    runbook: not just documented -> must have ACTUALLY been executed in a drill (KB-0586)
    SLO (KB-0565): not just defined -> must be actually measurable + connected to working alerting
    recovery proof (backup restore, RTO/RPO): must be ACTUALLY MEASURED, not just formally agreed
CENTRAL METHODOLOGICAL STANCE: check merely confirming a document/config formally exists misses the point
  must instead explicitly ask per building block: "was this ACTUALLY validated, and when last?"
  block that cannot answer positively -> explicitly documented as REMAINING RISK
    not silently treated as satisfied
CLEAR OWNERSHIP = second central requirement
  concrete, named responsible person/team per checked building block
  readiness check w/o clear ownership -> can recreate exact uncoordinated, delayed reaction
    that incident command/triage practices (already in this domain) are meant to prevent
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Formale Vollständigkeit vs. belegte Bereitschaft | unterscheidet dokumentierten von tatsächlich validiertem Zustand | zentrale Unterscheidung der gesamten Prüfung |
| On-Call-Validierung | prüft tatsächliche Handlungsfähigkeit, nicht nur Rotation | verhindert formal existierende, aber wirkungslose Bereitschaft |
| Runbook-/Recovery-Validierung | prüft tatsächlich durchgeführte Übungen | verhindert ungeprobte, unbelegte Annahmen |
| Eindeutige Ownership | benennt verantwortliche Person/Team je Baustein | verhindert unkoordinierte Reaktion im Ernstfall |
| Verbliebenes Risiko | dokumentiert nicht tatsächlich belegte Bausteine explizit | verhindert stillschweigende Annahme vollständiger Bereitschaft |

Implementierung: Eine Operational-Readiness-Prüfung wird vor jeder Produktivübergabe anhand einer festen Checkliste der in diesem Domain behandelten Bausteine durchgeführt. Für jeden Baustein wird explizit geprüft, ob eine tatsächliche Validierung (nicht nur eine Dokumentation) vorliegt, und das Ergebnis mit Datum der letzten tatsächlichen Prüfung festgehalten. Jeder Baustein erhält eine benannte, verantwortliche Ownership. Nicht tatsächlich belegte Bausteine werden explizit als verbliebenes Risiko dokumentiert, statt die Prüfung als vollständig abzuschließen.

## Scalability, Reliability, Security und Observability

Operational Readiness skaliert die tatsächliche Produktionsreife proportional zur Konsequenz, mit der formale Dokumentation von tatsächlicher Validierung unterschieden wird; die Reliability-Grenze liegt darin, dass eine Prüfung, die formale Vollständigkeit mit tatsächlicher Bereitschaft verwechselt, ungeprobte Annahmen unentdeckt in den Produktivbetrieb überführt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein als "readiness-geprüft" markiertes System versagt im echten Vorfall an einem formal dokumentierten Baustein | der Baustein wurde formal dokumentiert, aber nie tatsächlich validiert | die Operational-Readiness-Prüfung um eine explizite "zuletzt tatsächlich validiert am"-Angabe je Baustein ergänzen |
| im Ernstfall ist unklar, wer für einen bestimmten Baustein tatsächlich verantwortlich ist | die Operational-Readiness-Prüfung hat keine eindeutige Ownership je Baustein festgehalten | die Prüfung um eine explizite, namentliche Ownership-Zuordnung ergänzen |
| eine Prüfung wird als "vollständig" deklariert, obwohl mehrere Bausteine unbelegt sind | verbliebene Risiken wurden nicht explizit dokumentiert, sondern stillschweigend übergangen | jeden nicht tatsächlich belegten Baustein explizit als verbliebenes Risiko in der Prüfung festhalten |

Security: Eine Operational-Readiness-Prüfung sollte auch sicherheitsrelevante Bausteine (Zugriffskontrollen, Incident-Response-Prozesse für sicherheitsrelevante Vorfälle) einbeziehen, ohne die dortigen, bereits in Domain 23 behandelten Details zu wiederholen. Observability: Die tatsächliche Quote der als "tatsächlich validiert" (statt nur formal dokumentiert) markierten Bausteine über alle produktiven Systeme ist ein zentrales Signal zur Bewertung der organisationsweiten operativen Reife.

## Trade-offs und Entscheidungen

**Staff** führt eine Operational-Readiness-Prüfung für ein gegebenes System korrekt durch und dokumentiert verbliebene Risiken. **Principal** entwirft die vollständige Readiness-Checkliste und den Übergabeprozess für eine Organisation. **Chief** legt unternehmensweite Standards fest, die formale Vollständigkeit von tatsächlich belegter Bereitschaft strukturell unterscheiden und vor Produktivübergabe verbindlich machen.

Anti-Patterns: eine Operational-Readiness-Prüfung anhand rein formaler Dokumentationsexistenz statt tatsächlicher Validierung durchführen; ein System als "readiness-geprüft" deklarieren, ohne verbliebene, unbelegte Risiken explizit zu dokumentieren; Bausteine ohne eindeutige, namentliche Ownership-Zuordnung als "abgedeckt" markieren.

## Production Checklist

- [ ] On-Call-Bereitschaft ist tatsächlich mit handlungsfähigen Alarmen und funktionierender Eskalation verbunden.
- [ ] Runbooks wurden tatsächlich in einer Übung ausgeführt, nicht nur dokumentiert.
- [ ] SLOs sind tatsächlich messbar und mit funktionierender Alarmierung verbunden.
- [ ] Recovery-Nachweise (Backup-Restore, RTO/RPO) sind tatsächlich gemessen, nicht nur formal vereinbart.
- [ ] Jeder Baustein hat eine eindeutige, namentliche Ownership.
- [ ] Nicht tatsächlich belegte Bausteine sind explizit als verbliebenes Risiko dokumentiert.

## Interviewfragen

### 1. Was ist der zentrale Unterschied zwischen formaler Vollständigkeit und tatsächlich belegter Bereitschaft?

**Antwort:** Formale Vollständigkeit bedeutet, dass ein Baustein als "vorhanden" dokumentiert ist; tatsächlich belegte Bereitschaft bedeutet, dass dieser Baustein tatsächlich validiert wurde, etwa durch eine durchgeführte Übung oder eine gemessene Wiederherstellung.

### 2. Warum reicht eine dokumentierte On-Call-Rotation allein nicht für Operational Readiness aus?

**Antwort:** Weil sie zusätzlich tatsächlich mit handlungsfähigen Alarmen und einer funktionierenden Eskalationskette verbunden sein muss, sonst bleibt die formale Rotation im Ernstfall wirkungslos.

### 3. Warum ist eindeutige Ownership eine zentrale Anforderung an eine Operational-Readiness-Prüfung?

**Antwort:** Weil ohne eine konkrete, namentlich benannte, verantwortliche Person oder ein Team im Ernstfall eine unkoordinierte, verzögerte Reaktion entstehen kann.

### 4. Was sollte mit einem Baustein geschehen, der formal dokumentiert, aber nie tatsächlich validiert wurde?

**Antwort:** Er sollte explizit als verbliebenes Risiko dokumentiert werden, statt stillschweigend als erfüllt behandelt zu werden.

### 5. Wie gehst du vor, wenn ein als "readiness-geprüft" markiertes System im echten Vorfall an einem formal dokumentierten Baustein versagt?

**Antwort:** Ich prüfe, ob dieser Baustein tatsächlich validiert oder nur formal dokumentiert war, und ergänze die Operational-Readiness-Prüfung künftig um eine explizite "zuletzt tatsächlich validiert am"-Angabe je Baustein.

### 6. Widersprüchliche Anforderung: Geschäftsführung will schnelle Produktivübergabe UND vollständige, tatsächlich belegte Operational Readiness — wie gehst du vor?

**Antwort:** Ich würde eine priorisierte, risikobasierte Validierung der kritischsten Bausteine (etwa Recovery-Nachweis und On-Call-Funktionsfähigkeit) vor der Übergabe sicherstellen und die verbleibenden, noch unbelegten Bausteine explizit als dokumentiertes, zeitlich befristetes Restrisiko festhalten, statt entweder die Übergabe unnötig zu verzögern oder unbelegte Bereitschaft stillschweigend zu akzeptieren.

## Praktische Labs

~~~python
# Local, deterministic simulation of an operational readiness check distinguishing formal vs actual validation (executed locally, no real readiness system):

def readiness_check(criteria):
    results = []
    for name, formally_documented, actually_validated, owner in criteria:
        results.append({
            "criterion": name,
            "status": "ready" if actually_validated else "remaining_risk",
            "owner": owner,
        })
    return results

criteria = [
    ("on_call_rotation", True, True, "Team A"),
    ("runbook_drilled", True, False, "Team B"),  # documented but never actually drilled
    ("slo_alerting", True, True, "Team A"),
    ("backup_restore_measured", True, False, "Team C"),  # target agreed but never measured
]

for r in readiness_check(criteria):
    print(r)
~~~

## Dependencies, Cross-References und Quellen

1. Google SRE Book: [Reliability Reviews for Launching a New Service](https://sre.google/sre-book/evolving-sre-engagement-model/), abgerufen 2026-09-18.
2. Google SRE Workbook: [Operational Readiness Reviews](https://sre.google/workbook/reliability-toolkit/), abgerufen 2026-09-18.

Alerting und Bereitschaftsdienst sind kanonisch in [KB-0579](15-alerting-und-bereitschaftsdienst.md) behandelt; SLI/SLO/SLA in [KB-0565](01-sli-slo-und-sla.md); Disaster-Recovery-Übungsmethodik in [KB-0586](22-disaster-recovery-und-uebungen.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Operational-Readiness-Dashboards, die den "zuletzt tatsächlich validiert"-Status jedes Bausteins live nachverfolgen | Evaluating | Gegen die bestehende, punktuelle Prüfungspraxis vor Produktivübergabe evaluieren, um formale Vollständigkeit kontinuierlich statt nur zum Übergabezeitpunkt von tatsächlicher Bereitschaft zu unterscheiden. |

Ein Team akzeptiert eine Produktivübergabe erst, wenn jeder Operational-Readiness-Baustein nachweislich tatsächlich validiert (nicht nur formal dokumentiert) ist, eine eindeutige Ownership je Baustein feststeht und verbliebene Risiken explizit dokumentiert sind. Damit ist Domain 24 (Observability/SRE) vollständig ausgearbeitet.
