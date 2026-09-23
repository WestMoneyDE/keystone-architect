---
{"id": "KB-0277", "title": "Supervisor und Aufgabenrouting", "domain": "12", "sequence": 3, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0276", "concepts": ["Planner-Executor-Architekturen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Supervisor-Modell implementieren, das Aufgaben an begrenzte Spezialagenten delegiert und Rückmeldungen zentral verarbeitet.", "rationale": "Der Wert eines zentralen Kontrollpunkts wird erst durch konkrete Delegation und Fehlerbehandlung über mehrere Spezialagenten greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Supervisor-Architektur für einen konkreten Multi-Agenten-Anwendungsfall begründet gestalten, mit expliziter Eskalationslogik bei fehlerhafter Delegation.", "rationale": "Ein zentraler Kontrollpunkt muss explizit definieren, wie mit fehlerhafter oder unzureichender Ausführung durch delegierte Spezialagenten umgegangen wird."}, "STAFF-TARGET": {"active": true, "scope": "Eine fehlgeschlagene Aufgabe auf fehlerhafte Delegation an einen ungeeigneten Spezialagenten statt auf ein allgemeines Systemproblem zurückführen können.", "rationale": "Falsches Routing (Delegation einer Aufgabe an einen dafür nicht geeigneten Spezialagenten) ist eine spezifische, identifizierbare Fehlerklasse in Supervisor-Architekturen."}, "CHIEF-TARGET": {"active": true, "scope": "Supervisor-Architekturen mit zentralem Kontrollpunkt und begrenzten, spezialisierten Agenten als bewusste Alternative zu monolithischen Einzelagenten positionieren, mit expliziter Eskalationsverantwortung.", "rationale": "Begrenzte Spezialagenten mit klar definiertem Aufgabenbereich sind oft zuverlässiger als ein einzelner, für alles zuständiger Agent, erfordern aber einen funktionierenden zentralen Kontrollpunkt."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Spezifische Multi-Agenten-Framework-Implementierungsdetails sind Vertiefung.", "rationale": "Kern ist das Prinzip zentraler Kontrolle mit begrenzten Spezialagenten, nicht die Framework-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0277-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Supervisor-Aufgabenrouting mit Eskalation bei fehlerhafter Delegation", "evidence": "Ein Supervisor, der eine Aufgabe an einen ungeeigneten Spezialagenten delegiert, kann bei fehlgeschlagener Rückmeldung die Aufgabe an einen anderen, besser geeigneten Agenten umleiten oder eskalieren, statt das Fehlschlagen unbemerkt zu lassen.", "limitations": "Kein echtes produktives Multi-Agenten-System, keine reale Aufgabenkomplexität, keine Produktion."}]}
---
# Supervisor und Aufgabenrouting

> **Ziel:** Eine Supervisor-Architektur verteilt Aufgaben an begrenzte, spezialisierte Agenten (aufbauend auf Planner-Executor-Grundlagen, siehe [KB-0276](02-planner-executor-architekturen.md)) über einen zentralen Kontrollpunkt, der Rückmeldungen verarbeitet und bei fehlerhafter Delegation eskaliert. Begrenzte Spezialagenten mit klar definiertem Aufgabenbereich sind oft zuverlässiger als ein monolithischer Einzelagent, erfordern aber einen funktionierenden, zentralen Routing- und Eskalationsmechanismus.

## Zweck, Mental Model und Dependencies

Aufgabenverteilung ist die Entscheidung des Supervisors, welche Teilaufgabe an welchen Spezialagenten delegiert wird — jeder Spezialagent hat einen begrenzten, klar definierten Zuständigkeitsbereich (z. B. ein Agent für Datenrecherche, ein anderer für Textgenerierung), statt dass ein einzelner Agent versucht, alle Aufgabentypen gleichermaßen kompetent zu bewältigen. Rückmeldungen sind die Ergebnisse, die ein Spezialagent nach Bearbeitung einer delegierten Aufgabe an den Supervisor zurückmeldet — diese müssen strukturiert genug sein, damit der Supervisor beurteilen kann, ob die Delegation erfolgreich war. Eskalation ist der Mechanismus, der greift, wenn eine Delegation fehlschlägt oder ein Spezialagent eine Aufgabe nicht angemessen bearbeiten kann — der Supervisor muss dann entscheiden, ob die Aufgabe an einen anderen Spezialagenten umgeleitet, mit anderen Parametern erneut delegiert, oder an eine höhere Instanz (z. B. menschliche Prüfung) eskaliert wird. Der zentrale Kontrollpunkt (der Supervisor selbst) trägt die Verantwortung für die Gesamtaufgabe, auch wenn die tatsächliche Ausführung an Spezialagenten delegiert wird — dies unterscheidet sich von einer rein dezentralen Multi-Agenten-Architektur, bei der Agenten direkt miteinander koordinieren, ohne zentrale Kontrollinstanz. Fehlerhafte Delegation entsteht, wenn eine Aufgabe an einen für sie ungeeigneten Spezialagenten geroutet wird — dies ist eine spezifische, identifizierbare Fehlerklasse, die durch besseres Routing-Design oder durch Erkennung und Korrektur nach fehlgeschlagener Rückmeldung adressiert werden kann.

~~~text
Supervisor:            central control point, holds accountability for the overall task
Specialist agents:      LIMITED, well-defined scope each (e.g. research agent, writing agent)
Task routing:            supervisor decides WHICH specialist gets WHICH subtask
Feedback:                specialist reports back -> supervisor judges success/failure
Escalation:              failed delegation -> reroute to different specialist, retry with different params, OR escalate to human
Misrouting: task sent to a specialist NOT suited for it -> specific, identifiable failure class
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Klar begrenzte Spezialagenten-Zuständigkeit | hat jeder Spezialagent einen klar definierten, begrenzten Aufgabenbereich? | zu breite oder unklare Zuständigkeit macht Spezialagenten weniger zuverlässig als beabsichtigt |
| Strukturierte Rückmeldung | liefern Spezialagenten strukturierte, für den Supervisor beurteilbare Rückmeldungen? | unstrukturierte Rückmeldungen erschweren dem Supervisor die zuverlässige Erfolgsbeurteilung |
| Explizite Eskalationslogik | ist definiert, was bei fehlgeschlagener Delegation geschieht (Umleitung, Retry, Eskalation)? | fehlende Eskalationslogik lässt fehlgeschlagene Delegationen unbemerkt oder unbehandelt |
| Routing-Genauigkeit | wird eine Aufgabe tatsächlich an den am besten geeigneten Spezialagenten delegiert? | fehlerhaftes Routing an einen ungeeigneten Spezialagenten erzeugt vermeidbare Fehlschläge |

Implementierung: jeder Spezialagent wird mit einem klar dokumentierten, begrenzten Zuständigkeitsbereich definiert, sodass der Supervisor eine klare Grundlage für Routing-Entscheidungen hat. Spezialagenten liefern strukturierte Rückmeldungen (z. B. Erfolg/Fehlschlag-Status plus Ergebnisdaten), die dem Supervisor eine zuverlässige, nicht rein interpretative Erfolgsbeurteilung ermöglichen. Eine explizite Eskalationslogik wird implementiert, die bei fehlgeschlagener Delegation definiert reagiert — Umleitung an einen alternativen, besser geeigneten Spezialagenten, erneute Delegation mit angepassten Parametern, oder Eskalation an eine höhere Instanz, wenn keine automatisierte Lösung möglich ist. Routing-Entscheidungen werden regelmäßig gegen tatsächliche Erfolgsraten geprüft, um systematische Fehlrouting-Muster zu identifizieren und die Routing-Logik entsprechend zu verbessern.

## Scalability, Reliability, Security und Observability

Supervisor-Architekturen mit begrenzten Spezialagenten skalieren Zuverlässigkeit für komplexe, vielfältige Aufgabenlandschaften, weil jeder Spezialagent für seinen begrenzten Bereich optimiert und getestet werden kann, statt ein einzelner Agent alle Aufgabentypen gleichermaßen gut bewältigen zu müssen. Reliability-Grenze: der Supervisor selbst wird zu einem zentralen Kontrollpunkt, dessen Fehlfunktion (z. B. fehlerhafte Routing-Logik oder fehlende Eskalation) die gesamte Aufgabenausführung beeinträchtigen kann, unabhängig von der Qualität der einzelnen Spezialagenten.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Aufgabe schlägt trotz kompetenter Spezialagenten wiederholt fehl | die Aufgabe wird systematisch an einen ungeeigneten Spezialagenten geroutet (Fehlrouting) | tatsächliche Erfolgsraten pro Spezialagent und Aufgabentyp analysieren, um Fehlroutingmuster zu identifizieren |
| eine fehlgeschlagene Delegation bleibt unbemerkt oder unbehandelt | fehlende oder unzureichende Eskalationslogik im Supervisor | prüfen, ob eine explizite Reaktion (Umleitung, Retry, Eskalation) für fehlgeschlagene Rückmeldungen implementiert ist |
| der Supervisor kann den Erfolg einer Delegation nicht zuverlässig beurteilen | Spezialagenten liefern unstrukturierte, schwer interpretierbare Rückmeldungen | Rückmeldungsformat der Spezialagenten auf strukturierte, eindeutig interpretierbare Erfolgs-/Fehlschlagsindikatoren prüfen |
| ein Spezialagent wird für Aufgaben außerhalb seines eigentlichen Zuständigkeitsbereichs genutzt | unklare oder zu breit definierte Zuständigkeitsgrenzen des Spezialagenten | Zuständigkeitsdokumentation des betroffenen Spezialagenten auf Klarheit und Abgrenzung prüfen |

Security: der Supervisor sollte auch für die Durchsetzung von Berechtigungsgrenzen zwischen Spezialagenten verantwortlich sein — ein Spezialagent sollte nur die für seinen begrenzten Zuständigkeitsbereich notwendigen Rechte erhalten, analog zum Least-Privilege-Prinzip bei AI-Werkzeugen. Observability: Delegationserfolgsrate pro Spezialagent und Aufgabentyp, Häufigkeit ausgelöster Eskalationen und tatsächliche Routing-Genauigkeit (korrekt versus fehlerhaft geroutete Aufgaben) sind zentrale Metriken für Supervisor-Gesundheit.

## Trade-offs und Entscheidungen

**Staff** definiert klare, begrenzte Zuständigkeitsbereiche für jeden Spezialagenten. **Principal** macht Eskalationslogik für das Team bei fehlgeschlagener Delegation nachvollziehbar dokumentiert. **Chief** positioniert Supervisor-Architekturen mit begrenzten Spezialagenten als bewusste Alternative zu monolithischen Einzelagenten, mit expliziter Verantwortung des zentralen Kontrollpunkts für Routing und Eskalation.

Anti-Patterns: Spezialagenten mit zu breiten oder unklaren Zuständigkeitsbereichen definieren; keine explizite Eskalationslogik für fehlgeschlagene Delegationen implementieren; Routing-Entscheidungen nie gegen tatsächliche Erfolgsraten überprüfen.

## Production Checklist

- [ ] Jeder Spezialagent hat einen klar dokumentierten, begrenzten Zuständigkeitsbereich.
- [ ] Spezialagenten liefern strukturierte, eindeutig interpretierbare Rückmeldungen.
- [ ] Explizite Eskalationslogik reagiert definiert auf fehlgeschlagene Delegationen.
- [ ] Routing-Entscheidungen werden regelmäßig gegen tatsächliche Erfolgsraten geprüft.

## Interviewfragen

### 1. Warum sind begrenzte Spezialagenten oft zuverlässiger als ein einzelner, für alles zuständiger Agent?

**Antwort:** Ein Spezialagent kann für seinen begrenzten, klar definierten Aufgabenbereich optimiert und gezielt getestet werden, während ein monolithischer Einzelagent versuchen muss, alle Aufgabentypen gleichermaßen kompetent zu bewältigen, was tendenziell zu geringerer Zuverlässigkeit pro Aufgabentyp führt.

### 2. Was ist Fehlrouting, und warum ist es eine spezifische Fehlerklasse?

**Antwort:** Fehlrouting entsteht, wenn eine Aufgabe an einen für sie ungeeigneten Spezialagenten delegiert wird; es ist eine identifizierbare Fehlerklasse, die durch systematische Analyse von Erfolgsraten pro Spezialagent und Aufgabentyp erkannt und durch verbessertes Routing-Design adressiert werden kann.

### 3. Warum ist strukturierte Rückmeldung von Spezialagenten wichtig?

**Antwort:** Der Supervisor muss zuverlässig beurteilen können, ob eine Delegation erfolgreich war; unstrukturierte, schwer interpretierbare Rückmeldungen erschweren diese Beurteilung und können zu fehlerhaften Folgeentscheidungen führen.

### 4. Wie diagnostizierst du, dass eine Aufgabe systematisch an einen ungeeigneten Spezialagenten geroutet wird?

**Antwort:** Ich analysiere die tatsächlichen Erfolgsraten pro Spezialagent und Aufgabentyp — ein Spezialagent mit auffällig niedriger Erfolgsrate für einen bestimmten Aufgabentyp deutet auf systematisches Fehlrouting für diesen Aufgabentyp hin.

### 5. Warum wird der Supervisor selbst zu einem kritischen Reliability-Faktor?

**Antwort:** Da der Supervisor die zentrale Routing- und Eskalationsentscheidung trifft, kann eine Fehlfunktion in dieser zentralen Logik (fehlerhaftes Routing, fehlende Eskalation) die gesamte Aufgabenausführung beeinträchtigen, unabhängig von der Qualität der einzelnen Spezialagenten.

### 6. Widersprüchliche Anforderung: Team will maximale Spezialisierung (viele eng begrenzte Spezialagenten für optimale Einzelperformance) UND minimale Routing-Komplexität für den Supervisor — wie gehst du vor?

**Antwort:** Ich würde erklären, dass mehr, eng begrenzte Spezialagenten zwar potenziell bessere Einzelperformance bieten, aber die Routing-Entscheidung für den Supervisor komplexer machen; ich würde vorschlagen, eine moderate Anzahl an Spezialagenten mit sinnvoll abgegrenzten, aber nicht übermäßig eng begrenzten Zuständigkeitsbereichen zu wählen, die einen praktikablen Kompromiss zwischen Spezialisierungsgrad und Routing-Komplexität darstellt.

## Praktische Labs

~~~python
# Supervisor with task routing and escalation on failed delegation
specialists = {
    "research_agent": {"capability": "data_lookup", "success_rate": 0.9},
    "writing_agent": {"capability": "text_generation", "success_rate": 0.85},
}

def route_task(task_type, specialists):
    for name, agent in specialists.items():
        if agent["capability"] == task_type:
            return name
    return None

def delegate_and_check(task_type, specialists, simulate_failure=False):
    agent_name = route_task(task_type, specialists)
    if agent_name is None:
        return "ESCALATED: no suitable specialist found for task type"

    if simulate_failure:
        # first attempt failed - escalation logic kicks in
        return f"DELEGATION FAILED at '{agent_name}' -> ESCALATING: retry with adjusted parameters or reroute"

    return f"SUCCESS: task delegated to '{agent_name}' and completed"

print(delegate_and_check("data_lookup", specialists))
print(delegate_and_check("data_lookup", specialists, simulate_failure=True))
print(delegate_and_check("image_generation", specialists))  # no matching specialist

result = delegate_and_check("image_generation", specialists)
assert "ESCALATED" in result
print("\nTasks with no suitable specialist are explicitly escalated, not silently dropped or misrouted.")
~~~

## Dependencies, Cross-References und Quellen

1. Anthropic: [Building Effective AI Agents — Orchestrator-Worker Pattern](https://www.anthropic.com/engineering/building-effective-agents), abgerufen 2026-09-17.
2. LangGraph: [Multi-Agent Supervisor Pattern](https://langchain-ai.github.io/langgraph/tutorials/multi_agent/agent_supervisor/), abgerufen 2026-09-17.
3. Microsoft: [AutoGen Multi-Agent Conversation Framework](https://microsoft.github.io/autogen/), abgerufen 2026-09-17.

Planner-Executor-Grundlagen sind kanonisch in [KB-0276](02-planner-executor-architekturen.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte Multi-Agenten-Orchestrierungs-Frameworks mit eingebautem Supervisor-Pattern | Adopting | Gegenüber selbstgebauter Supervisor-Logik für konsistente, getestete Routing- und Eskalationsmechanismen bevorzugen. |
| Dynamisches, lernbasiertes Routing, das Erfolgsraten kontinuierlich in Routing-Entscheidungen einbezieht | Adopting | Gegenüber statischen Routing-Regeln für sich entwickelnde Aufgabenlandschaften evaluieren. |

Ein Team akzeptiert eine Supervisor-Architektur erst, wenn klare Spezialagenten-Zuständigkeiten, strukturierte Rückmeldungen und explizite Eskalationslogik nachweisbar implementiert sind.
