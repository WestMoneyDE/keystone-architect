---
{"id": "KB-0580", "title": "SRE Incident Response", "domain": "24", "sequence": 16, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "CLOUD", "MLOPS"], "requires": [{"id": "KB-0579", "concepts": ["Alerting und Bereitschaftsdienst"], "needed_for": "understanding"}, {"id": "KB-0562", "concepts": ["Security Incident Response"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Triage-Einschätzung und eine erste Statuskommunikation für einen laufenden operativen Vorfall anhand etablierter Incident-Command-Praxis korrekt durchführen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Incident-Command-Rollen, Eskalationswege und Statuskommunikationskanäle zusammenwirken, um technische Stabilisierung unter laufender Nutzerbeeinträchtigung nachvollziehbar zu koordinieren.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Während eines laufenden Vorfalls zwischen technischer Stabilisierungshypothese und tatsächlich bestätigter Ursache unterscheiden können, statt eine vorläufige Hypothese vorschnell als bestätigte Ursache zu kommunizieren.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Incident-Response-Organisation (Rollen, Eskalation, Statuskommunikation) festlegen, die technische Stabilisierung und nachvollziehbare Kommunikation gegenüber Stakeholdern gleichzeitig sicherstellen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die formale Zertifizierung spezifischer Incident-Command-Frameworks im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Triage, Rollenkoordination und Statuskommunikation als praktische Fähigkeit, nicht die formale Zertifizierung eines bestimmten Frameworks."}}, "lab_validation": [{"lab_id": "KB-0580-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation einer Triage-Priorisierung während eines laufenden Vorfalls, kein produktives Incident-Management-System verwendet", "evidence": "Ein lokales Skript simuliert, wie mehrere gleichzeitig gemeldete Symptome anhand ihrer tatsächlichen Nutzerauswirkung (nicht anhand der Meldereihenfolge) priorisiert werden, und zeigt damit den strukturellen Unterschied zwischen chronologischer und wirkungsbasierter Triage.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Incident-Management-System."}]}
---
# SRE Incident Response

> **Ziel:** Dieses Kapitel behandelt SRE Incident Response als organisatorische Koordination technischer Stabilisierung unter laufender Nutzerbeeinträchtigung — Triage (Priorisierung nach tatsächlicher Nutzerauswirkung, nicht nach Meldereihenfolge), Incident Command (klare Rollenverteilung zur Vermeidung paralleler, unkoordinierter Stabilisierungsversuche) und Statuskommunikation (transparente, zeitlich nachvollziehbare Information für Stakeholder während eines laufenden Vorfalls). Dieses Kapitel ergänzt die bereits in [KB-0562](../23-security-identity/26-security-incident-response.md) behandelte Security Incident Response um die allgemeine, nicht sicherheitsspezifische operative Vorfallkoordination — die dortigen forensischen und eindämmungsbezogenen Aspekte werden hier bewusst nicht wiederholt. Der zentrale Punkt dieses Kapitels ist, dass technische Stabilisierungshypothesen während eines laufenden Vorfalls explizit als vorläufig markiert und kommuniziert werden müssen, bis sie tatsächlich bestätigt sind — eine vorschnell als sicher kommunizierte, aber tatsächlich falsche Ursachenhypothese kann zu falschen Stabilisierungsmaßnahmen und verlängerter Nutzerbeeinträchtigung führen.

## Zweck, Mental Model und Dependencies

Triage während eines laufenden Vorfalls unterscheidet sich von einer einfachen, chronologischen Bearbeitung eingehender Symptommeldungen: Mehrere, gleichzeitig gemeldete Symptome müssen nach ihrer tatsächlichen Nutzerauswirkung priorisiert werden (ein Symptom, das eine kleine Nutzergruppe betrifft, wird typischerweise niedriger priorisiert als eines, das den gesamten Dienst beeinträchtigt), nicht nach der Reihenfolge, in der die Meldungen eintreffen — die bereits in [KB-0579](15-alerting-und-bereitschaftsdienst.md) behandelten Symptomalarme liefern hierfür die strukturelle Grundlage, da sie bereits auf tatsächliche Nutzerauswirkung statt auf reine technische Abweichung ausgelegt sind. Incident Command etabliert eine klare Rollenverteilung (typischerweise eine koordinierende Rolle, die selbst nicht primär technisch stabilisiert, sondern die Gesamtkoordination, Kommunikation und Eskalation verantwortet, getrennt von den technisch stabilisierenden Rollen) — diese Trennung verhindert, dass mehrere Personen parallel, unkoordiniert und potenziell widersprüchlich an derselben Stabilisierung arbeiten, was das Risiko zusätzlicher, durch die Stabilisierungsversuche selbst verursachter Störungen erhöht. Statuskommunikation während eines laufenden Vorfalls muss den Unterschied zwischen einer vorläufigen Hypothese ("wir vermuten aktuell X als Ursache") und einer tatsächlich bestätigten Ursache ("wir haben X als Ursache bestätigt") explizit sichtbar machen — eine vorschnell als sicher kommunizierte, aber tatsächlich falsche Hypothese kann dazu führen, dass Stakeholder falsche Erwartungen bilden und dass Stabilisierungsmaßnahmen auf einer falschen Grundlage priorisiert werden, was die tatsächliche Nutzerbeeinträchtigung unnötig verlängert. Eine nachvollziehbare Zeitachse (wann welches Symptom beobachtet, welche Hypothese aufgestellt, welche Maßnahme ergriffen wurde) ist dabei sowohl für die laufende Koordination als auch für eine spätere, strukturierte Nachbereitung notwendig.

~~~text
SRE Incident Response: organizational coordination of technical stabilization under ongoing user impact
  Triage: prioritize by ACTUAL user impact, not report order
  Incident Command: clear role separation to avoid parallel, uncoordinated stabilization attempts
  Status communication: transparent, time-traceable info for stakeholders during ongoing incident
COMPLEMENTS KB-0562 (Security Incident Response): general, non-security-specific operational coordination here
  forensic/containment aspects there deliberately NOT repeated
KEY POINT: stabilization hypotheses during ongoing incident must be EXPLICITLY marked/communicated as PROVISIONAL
  until actually confirmed
  prematurely-confident-but-wrong cause hypothesis -> wrong stabilization actions -> prolonged user impact
TRIAGE differs from chronological handling:
  multiple simultaneous symptom reports prioritized by ACTUAL user impact
    (small-user-group symptom typically lower priority than whole-service-impacting one)
  NOT by arrival order of reports
  symptom alarms (KB-0579) provide structural basis: already designed around actual user impact
INCIDENT COMMAND: clear role split
  coordinating role: NOT primarily doing technical stabilization itself
    -> responsible for overall coordination, communication, escalation
  separate from technically-stabilizing roles
  -> prevents multiple people working parallel/uncoordinated/potentially contradictorily on same stabilization
    -> reduces risk of additional disruption CAUSED BY the stabilization attempts themselves
STATUS COMMUNICATION must explicitly distinguish:
  provisional hypothesis ("we currently suspect X as cause")
  vs actually confirmed cause ("we have confirmed X as cause")
  prematurely-confident communication of wrong hypothesis
    -> stakeholders form wrong expectations
    -> stabilization measures prioritized on wrong basis -> unnecessarily prolongs actual user impact
Traceable timeline (when symptom observed, hypothesis formed, action taken)
  needed for BOTH ongoing coordination AND later structured post-incident review
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Triage nach Nutzerauswirkung | priorisiert Symptome nach tatsächlicher Wirkung, nicht Meldereihenfolge | verhindert Fehlpriorisierung während eines Vorfalls |
| Incident-Command-Rollentrennung | trennt Koordination von technischer Stabilisierung | verhindert parallele, widersprüchliche Stabilisierungsversuche |
| Statuskommunikation mit Hypothesenkennzeichnung | unterscheidet vorläufige Hypothese von bestätigter Ursache | verhindert Fehlpriorisierung durch vorschnelle Sicherheit |
| Nachvollziehbare Zeitachse | dokumentiert Beobachtungen, Hypothesen und Maßnahmen zeitlich | Grundlage für Koordination und spätere Nachbereitung |

Implementierung: Eingehende Symptommeldungen werden nach tatsächlicher, geschätzter Nutzerauswirkung priorisiert. Eine koordinierende Incident-Command-Rolle wird für jeden Vorfall ab einem definierten Schweregrad explizit benannt, getrennt von den technisch stabilisierenden Rollen. Statuskommunikation kennzeichnet vorläufige Hypothesen explizit als solche und aktualisiert sie erst nach tatsächlicher Bestätigung. Eine Zeitachse wird während des gesamten Vorfalls fortlaufend dokumentiert.

## Scalability, Reliability, Security und Observability

SRE Incident Response skaliert die Geschwindigkeit tatsächlicher Nutzerbeeinträchtigungs-Reduktion proportional zur Qualität der Triage-Priorisierung und der Rollentrennung; die Reliability-Grenze liegt darin, dass eine vorschnell als bestätigt kommunizierte, tatsächlich falsche Ursachenhypothese zu falsch priorisierten Stabilisierungsmaßnahmen und damit zu unnötig verlängerter Nutzerbeeinträchtigung führen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| mehrere Symptommeldungen werden in Meldereihenfolge statt nach Dringlichkeit bearbeitet | keine Triage nach tatsächlicher Nutzerauswirkung findet statt | eine explizite Priorisierung nach geschätzter Nutzerauswirkung einführen |
| mehrere Personen stabilisieren parallel und widersprüchlich denselben Vorfall | keine klare Incident-Command-Rollentrennung ist etabliert | eine koordinierende Rolle explizit benennen, getrennt von technischer Stabilisierung |
| Stabilisierungsmaßnahmen adressieren die tatsächliche Ursache nicht, obwohl eine Ursache kommuniziert wurde | eine vorläufige Hypothese wurde vorschnell als bestätigte Ursache kommuniziert | die Statuskommunikation auf explizite Kennzeichnung vorläufiger Hypothesen prüfen |

Security: Statuskommunikation während eines Vorfalls sollte keine sensiblen internen Details unkontrolliert an externe Stakeholder weitergeben; die dortige Abwägung ist Teil der bereits in [KB-0562](../23-security-identity/26-security-incident-response.md) behandelten Security Incident Response bei sicherheitsrelevanten Vorfällen. Observability: Die tatsächliche Zeit zwischen erster Symptombeobachtung, Hypothesenbildung und tatsächlicher Bestätigung ist ein zentrales Signal zur Bewertung der Incident-Response-Qualität selbst.

## Trade-offs und Entscheidungen

**Staff** führt Triage und erste Statuskommunikation für einen gegebenen Vorfall korrekt durch. **Principal** entwirft die vollständige Incident-Command-Struktur und Statuskommunikationsstrategie für eine Organisation. **Chief** legt unternehmensweite Standards für Incident-Response-Organisation fest, die technische Stabilisierung und nachvollziehbare Kommunikation gleichzeitig sicherstellen.

Anti-Patterns: Symptommeldungen nach Meldereihenfolge statt nach tatsächlicher Nutzerauswirkung priorisieren; mehrere Personen parallel und unkoordiniert an derselben Stabilisierung arbeiten lassen; eine vorläufige Ursachenhypothese ohne explizite Kennzeichnung als bestätigte Ursache kommunizieren.

## Production Checklist

- [ ] Eine explizite Triage-Priorisierung nach tatsächlicher Nutzerauswirkung ist etabliert.
- [ ] Eine koordinierende Incident-Command-Rolle wird ab einem definierten Schweregrad explizit benannt.
- [ ] Statuskommunikation kennzeichnet vorläufige Hypothesen explizit als solche.
- [ ] Eine Zeitachse wird während des gesamten Vorfalls fortlaufend dokumentiert.

## Interviewfragen

### 1. Wodurch unterscheidet sich Triage während eines Vorfalls von chronologischer Bearbeitung?

**Antwort:** Triage priorisiert Symptome nach tatsächlicher, geschätzter Nutzerauswirkung, nicht nach der Reihenfolge, in der die Meldungen eintreffen.

### 2. Wofür dient die Rollentrennung im Incident Command?

**Antwort:** Sie trennt eine koordinierende Rolle (Kommunikation, Eskalation, Gesamtkoordination) von technisch stabilisierenden Rollen, um parallele, widersprüchliche Stabilisierungsversuche zu vermeiden.

### 3. Warum muss eine vorläufige Ursachenhypothese explizit als vorläufig kommuniziert werden?

**Antwort:** Weil eine vorschnell als bestätigt kommunizierte, tatsächlich falsche Hypothese zu falsch priorisierten Stabilisierungsmaßnahmen und dadurch zu unnötig verlängerter Nutzerbeeinträchtigung führen kann.

### 4. Wofür wird eine nachvollziehbare Zeitachse während eines Vorfalls benötigt?

**Antwort:** Für die laufende Koordination während des Vorfalls und für eine spätere, strukturierte Nachbereitung.

### 5. Wie gehst du vor, wenn mehrere Personen parallel und widersprüchlich an derselben Stabilisierung arbeiten?

**Antwort:** Ich etabliere eine klare Incident-Command-Rollentrennung mit einer explizit benannten, koordinierenden Rolle, getrennt von den technisch stabilisierenden Rollen.

### 6. Widersprüchliche Anforderung: Stakeholder wollen sofortige, definitive Ursachenkommunikation UND das Team will keine vorschnellen, potenziell falschen Aussagen treffen — wie gehst du vor?

**Antwort:** Ich würde frühzeitig und regelmäßig kommunizieren, aber jede Ursachenaussage explizit als vorläufige Hypothese oder als bestätigte Ursache kennzeichnen, statt entweder mit der Kommunikation zu warten, bis vollständige Sicherheit besteht, oder eine vorläufige Hypothese fälschlich als definitiv darzustellen.

## Praktische Labs

~~~python
# Local, deterministic simulation of impact-based triage vs chronological order (executed locally, no real incident management system):

def triage(reports):
    return sorted(reports, key=lambda r: -r["affected_users"])

reports = [
    {"id": "r1", "reported_at": 1, "affected_users": 50},
    {"id": "r2", "reported_at": 2, "affected_users": 5000},
    {"id": "r3", "reported_at": 3, "affected_users": 200},
]

print("chronological order:", [r["id"] for r in sorted(reports, key=lambda r: r["reported_at"])])
print("impact-based triage:", [r["id"] for r in triage(reports)])
~~~

## Dependencies, Cross-References und Quellen

1. Google SRE Book: [Managing Incidents](https://sre.google/sre-book/managing-incidents/), abgerufen 2026-09-18.
2. FEMA-Dokumentation (Referenzmodell für Incident Command): [Incident Command System (ICS) Overview](https://training.fema.gov/emiweb/is/icsresource/), abgerufen 2026-09-18.

Security Incident Response ist kanonisch in [KB-0562](../23-security-identity/26-security-incident-response.md) behandelt; Alerting und Bereitschaftsdienst in [KB-0579](15-alerting-und-bereitschaftsdienst.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte, automatische Zeitachsen-Rekonstruktion aus Alarmen, Chat-Verläufen und Deployment-Ereignissen während eines laufenden Vorfalls | Evaluating | Als Ergänzung zur manuellen Zeitachsen-Pflege einführen, jedoch nicht als alleinige Quelle für eine spätere Nachbereitung vertrauen, ohne die automatische Rekonstruktion stichprobenartig zu validieren. |

Ein Team akzeptiert eine Incident-Response-Organisation erst, wenn Triage nach tatsächlicher Nutzerauswirkung, klare Rollentrennung und explizit gekennzeichnete Statuskommunikation nachweislich etabliert sind.
