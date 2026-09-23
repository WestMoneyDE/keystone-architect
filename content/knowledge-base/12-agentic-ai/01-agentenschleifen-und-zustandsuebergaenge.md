---
{"id": "KB-0275", "title": "Agentenschleifen und Zustandsübergänge", "domain": "12", "sequence": 1, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0247", "concepts": ["Function Calling"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Agentenschleife implementieren, die deterministischen Runtime-Zustand explizit von der probabilistischen Modellentscheidung trennt.", "rationale": "Der Unterschied zwischen zuverlässigem Zustandsmanagement und unsicherer Modellentscheidung wird erst durch konkrete strukturelle Trennung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Agentenschleife für einen konkreten Anwendungsfall begründet gestalten, mit expliziter Unterscheidung zwischen deterministischem Fortschritt und probabilistischer Entscheidung.", "rationale": "Eine Agentenschleife, die Zustandsverwaltung und Modellentscheidung vermischt, kann tatsächlichen Fortschritt nicht zuverlässig von einer nur plausibel wirkenden Modellausgabe unterscheiden."}, "STAFF-TARGET": {"active": true, "scope": "Eine Endlosschleife oder scheinbaren Stillstand eines Agenten auf fehlende Unterscheidung zwischen Zustand und Modellentscheidung statt auf einen allgemeinen Softwarefehler zurückführen können.", "rationale": "Ein Agent, der seinen Fortschritt ausschließlich anhand probabilistischer Modellaussagen statt deterministischen Zustands misst, kann fälschlich Fortschritt oder Stillstand annehmen."}, "CHIEF-TARGET": {"active": true, "scope": "Agentenschleifen als Kombination aus deterministischer Runtime-Zustandsverwaltung und probabilistischer Modellentscheidung positionieren, mit klarer struktureller Trennung beider Aspekte.", "rationale": "Nur eine klare Trennung erlaubt zuverlässige Aussagen über tatsächlichen Fortschritt, unabhängig von der inhärenten Unsicherheit einzelner Modellentscheidungen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Produktspezifische Agent-Framework-Implementierungsdetails sind Vertiefung.", "rationale": "Kern ist das Prinzip der Trennung von deterministischem Zustand und probabilistischer Entscheidung, nicht die Framework-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0275-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Agentenschleife mit expliziter Trennung von deterministischem Zustand und probabilistischer Modellentscheidung", "evidence": "Ein Agent, der seinen tatsächlichen Fortschritt anhand eines deterministisch verwalteten Zustands (z. B. erledigte Teilschritte) statt allein anhand der Modellaussage misst, kann zuverlässig erkennen, wenn keine tatsächliche Fortentwicklung stattfindet, selbst wenn das Modell plausibel klingende, aber wiederholende Ausgaben liefert.", "limitations": "Kein echtes produktives Agent-Framework, keine reale mehrstufige Aufgabe, keine Produktion."}]}
---
# Agentenschleifen und Zustandsübergänge

> **Ziel:** Eine Agentenschleife kombiniert Beobachtung, Entscheidung und Aktion als wiederholten Zyklus (aufbauend auf Function-Calling-Grundlagen, siehe [KB-0247](../11-genai-architecture/07-function-calling-und-werkzeugvertraege.md)) — der deterministische Runtime-Zustand (was tatsächlich erledigt wurde) muss strukturell von der probabilistischen Modellauswahl (was das Modell als nächsten Schritt vorschlägt) getrennt werden, sonst kann tatsächlicher Fortschritt nicht zuverlässig von einer nur plausibel wirkenden, aber wiederholenden Modellausgabe unterschieden werden.

## Zweck, Mental Model und Dependencies

Eine Agentenschleife durchläuft wiederholt drei Phasen: Beobachtung (welcher Zustand liegt aktuell vor, welche Informationen sind verfügbar), Entscheidung (das Modell schlägt basierend auf der Beobachtung eine nächste Aktion vor) und Aktion (die vorgeschlagene Aktion wird ausgeführt, siehe Function-Calling-Autorisierungsprinzipien). Der zentrale architektonische Punkt ist die Unterscheidung zwischen zwei fundamental unterschiedlichen Aspekten: deterministischer Runtime-Zustand ist die tatsächliche, zuverlässig nachvollziehbare Historie dessen, was in der Schleife bereits geschehen ist (welche Aktionen wurden ausgeführt, welche Ergebnisse wurden erzielt) — dieser Zustand ist deterministisch verwaltet, unabhängig von der inhärenten Unsicherheit einzelner Modellentscheidungen. Probabilistische Modellauswahl ist die bei jedem Schleifendurchlauf vom Modell getroffene Entscheidung, welche nächste Aktion sinnvoll erscheint — diese Entscheidung ist inhärent unsicher und kann fehlerhaft, wiederholend oder inkonsistent sein. Tatsächlicher Fortschritt kann nur zuverlässig anhand des deterministischen Zustands gemessen werden (haben sich die verfolgten Zustandsvariablen tatsächlich verändert), nicht anhand der Modellaussage selbst (das Modell könnte plausibel klingende, aber tatsächlich wiederholende oder nicht fortschreitende Vorschläge generieren). Ohne diese strukturelle Trennung kann ein Agent in einer Endlosschleife verharren, ohne dass dies erkannt wird, weil jede einzelne Modellaussage für sich genommen plausibel erscheint, obwohl der deterministische Zustand keine tatsächliche Veränderung zeigt.

~~~text
Agent loop:  OBSERVE (current state) -> DECIDE (model proposes next action) -> ACT (execute, see KB-0247) -> repeat
Deterministic runtime state:  reliably tracked history of what ACTUALLY happened -> independent of model uncertainty
Probabilistic model decision:  what the model THINKS should happen next -> inherently uncertain, can repeat/err
Actual progress measurable ONLY via deterministic state changes, NOT via plausibility of model output alone
Without this separation: agent can loop indefinitely, each individual model output "sounds reasonable" while state never actually changes
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Strukturelle Zustands-/Entscheidungstrennung | ist der deterministische Runtime-Zustand strukturell getrennt von der probabilistischen Modellentscheidung implementiert? | vermischte Implementierung erschwert zuverlässige Fortschrittsmessung |
| Deterministische Fortschrittsmessung | wird tatsächlicher Fortschritt anhand des verfolgten Zustands, nicht anhand der Modellaussage selbst, gemessen? | Fortschrittsmessung basierend auf Modellaussagen kann durch plausible, aber nicht fortschreitende Ausgaben getäuscht werden |
| Schleifenabbruchkriterien | sind explizite, deterministische Kriterien definiert, wann eine Schleife als abgeschlossen oder fehlgeschlagen gilt? | fehlende Abbruchkriterien lassen eine Schleife unbegrenzt weiterlaufen, wenn tatsächlicher Fortschritt ausbleibt |
| Zustandshistorien-Nachvollziehbarkeit | ist die vollständige Historie der Zustandsübergänge nachvollziehbar protokolliert? | fehlende Historie erschwert die nachträgliche Diagnose, warum eine Schleife nicht fortgeschritten ist |

Implementierung: die Agentenschleife wird architektonisch so gestaltet, dass ein deterministischer Zustandsspeicher (z. B. eine explizite Liste erledigter Teilschritte, ein Fortschrittszähler) unabhängig von der Modellentscheidungslogik verwaltet wird. Fortschritt wird explizit anhand von Veränderungen dieses deterministischen Zustands gemessen, nicht anhand der subjektiven Plausibilität der Modellausgabe. Explizite, deterministische Abbruchkriterien werden definiert (z. B. maximale Anzahl an Schleifendurchläufen ohne Zustandsänderung, definierte Erfolgskriterien), die unabhängig von der Modellentscheidung selbst greifen, um Endlosschleifen zu verhindern. Die vollständige Historie der Zustandsübergänge wird nachvollziehbar protokolliert (verwandt mit Event-Sourcing-Prinzipien), um nachträgliche Diagnose zu ermöglichen, wenn eine Schleife nicht wie erwartet fortschreitet.

## Scalability, Reliability, Security und Observability

Agentenschleifen mit klarer Zustands-/Entscheidungstrennung skalieren Zuverlässigkeit über wachsende Aufgabenkomplexität, weil tatsächlicher Fortschritt unabhängig von der Unsicherheit einzelner Modellentscheidungen zuverlässig gemessen werden kann. Reliability-Grenze: eine Agentenschleife ohne diese Trennung ist ein kritisches Risiko — sie kann in einer Endlosschleife verharren (wiederholte, plausibel klingende, aber nicht fortschreitende Modellvorschläge), ohne dass dies technisch erkannt wird, was unkontrollierte Ressourcen- und Kostenverschwendung erzeugt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Agent scheint zu arbeiten, macht aber keinen tatsächlichen Fortschritt | Fortschrittsmessung basiert auf Modellaussagen statt deterministischem Zustand, wiederholende Vorschläge werden nicht erkannt | deterministischen Zustand über mehrere Schleifendurchläufe auf tatsächliche Veränderung prüfen |
| ein Agent läuft unerwartet lange oder verursacht unerwartet hohe Kosten | fehlende deterministische Abbruchkriterien, Schleife läuft ohne Fortschrittserkennung weiter | prüfen, ob explizite, deterministische Abbruchkriterien (Maximalanzahl Durchläufe ohne Zustandsänderung) implementiert sind |
| die Ursache für einen Agenten-Stillstand lässt sich nachträglich nicht rekonstruieren | fehlende oder unvollständige Protokollierung der Zustandsübergangshistorie | Zustandshistorie-Protokollierung auf Vollständigkeit für den betroffenen Zeitraum prüfen |
| dieselbe Aktion wird wiederholt vom Modell vorgeschlagen, ohne dass der Agent dies erkennt | keine strukturelle Trennung zwischen wiederholter Modellausgabe und tatsächlichem Zustandswechsel | Modellvorschläge über mehrere Durchläufe auf tatsächliche Wiederholung gegen den deterministischen Zustand vergleichen |

Security: unbegrenzt laufende Agentenschleifen ohne deterministische Abbruchkriterien stellen auch ein Sicherheitsrisiko dar, da sie potenziell unbegrenzt Ressourcen verbrauchen oder wiederholt Aktionen mit realen Seiteneffekten auslösen können — explizite Grenzen sind eine notwendige Schutzmaßnahme, nicht nur eine Effizienzoptimierung. Observability: durchschnittliche Anzahl Schleifendurchläufe bis zum Abschluss, Häufigkeit erkannter Endlosschleifen (fehlende Zustandsänderung über mehrere Durchläufe) und Vollständigkeit der Zustandsübergangsprotokollierung sind zentrale Metriken für Agentenschleifen-Gesundheit.

## Trade-offs und Entscheidungen

**Staff** implementiert deterministischen Zustand strukturell getrennt von der Modellentscheidungslogik. **Principal** macht Abbruchkriterien und Zustandshistorien-Protokollierung für das Team nachvollziehbar dokumentiert. **Chief** positioniert Agentenschleifen als Kombination aus deterministischer Zustandsverwaltung und probabilistischer Modellentscheidung mit klarer struktureller Trennung, nicht als undifferenzierte Schleifenlogik.

Anti-Patterns: Fortschritt ausschließlich anhand der Plausibilität von Modellaussagen messen, ohne deterministischen Zustand zu verfolgen; Agentenschleifen ohne explizite, deterministische Abbruchkriterien betreiben; Zustandsübergangshistorie nicht nachvollziehbar protokollieren.

## Production Checklist

- [ ] Deterministischer Runtime-Zustand ist strukturell getrennt von der probabilistischen Modellentscheidung implementiert.
- [ ] Fortschritt wird anhand von Veränderungen des deterministischen Zustands gemessen.
- [ ] Explizite, deterministische Abbruchkriterien verhindern Endlosschleifen.
- [ ] Die vollständige Zustandsübergangshistorie ist nachvollziehbar protokolliert.

## Interviewfragen

### 1. Warum muss deterministischer Runtime-Zustand strukturell von probabilistischer Modellauswahl getrennt werden?

**Antwort:** Nur der deterministische Zustand erlaubt eine zuverlässige Messung tatsächlichen Fortschritts; die probabilistische Modellentscheidung ist inhärent unsicher und kann plausibel klingende, aber tatsächlich wiederholende oder nicht fortschreitende Vorschläge liefern, die ohne diese Trennung fälschlich als Fortschritt interpretiert würden.

### 2. Wie kann ein Agent in einer Endlosschleife verharren, ohne dass dies offensichtlich wird?

**Antwort:** Wenn Fortschritt nur anhand der Plausibilität einzelner Modellausgaben gemessen wird, kann jede einzelne Ausgabe für sich genommen sinnvoll erscheinen, während der zugrunde liegende Zustand sich tatsächlich nicht verändert — ohne deterministische Zustandsprüfung bleibt dieser Stillstand unentdeckt.

### 3. Warum sind explizite, deterministische Abbruchkriterien notwendig?

**Antwort:** Ohne sie kann eine Agentenschleife theoretisch unbegrenzt weiterlaufen, wenn tatsächlicher Fortschritt ausbleibt, was unkontrollierte Ressourcen- und Kostenverschwendung sowie potenzielle Sicherheitsrisiken durch wiederholte Aktionsausführung verursachen kann.

### 4. Wie diagnostizierst du, dass ein Agent scheinbar arbeitet, aber keinen tatsächlichen Fortschritt macht?

**Antwort:** Ich prüfe den deterministischen Zustand über mehrere Schleifendurchläufe hinweg auf tatsächliche Veränderung — bleibt der verfolgte Zustand über mehrere Durchläufe unverändert, obwohl das Modell plausible Vorschläge liefert, bestätigt das eine fehlende tatsächliche Fortentwicklung.

### 5. Warum ist Event-Sourcing-artige Protokollierung für Agentenschleifen wertvoll?

**Antwort:** Eine vollständige, nachvollziehbare Historie der Zustandsübergänge ermöglicht nachträgliche Diagnose, warum eine Schleife nicht wie erwartet fortgeschritten ist, was ohne diese Protokollierung erheblich erschwert wäre.

### 6. Widersprüchliche Anforderung: Team will maximale Autonomie für den Agenten (minimale externe Eingriffe in die Schleifenlogik) UND garantiert kein unbegrenztes Weiterlaufen bei ausbleibendem Fortschritt — wie gehst du vor?

**Antwort:** Ich würde erklären, dass beide Ziele durch deterministische Abbruchkriterien vereinbar sind, die selbst kein externer manueller Eingriff sind, sondern eine strukturelle Eigenschaft der Schleife — ich würde vorschlagen, klare, automatisierte Fortschrittskriterien und Maximalgrenzen in die Architektur einzubauen, die dem Agenten weiterhin maximale Entscheidungsfreiheit innerhalb dieser Grenzen lassen, statt entweder unbegrenzte Autonomie oder ständige externe Kontrolle zu erzwingen.

## Praktische Labs

~~~python
# Agent loop with deterministic state separated from probabilistic model decisions
deterministic_state = {"completed_steps": set(), "attempts_without_progress": 0}

def model_proposes_next_step(state):
    # simulated model - sometimes proposes something already done (looks plausible each time)
    proposals = ["step_1", "step_2", "step_1", "step_3"]  # note: step_1 proposed again
    step_index = min(len(state["completed_steps"]), len(proposals) - 1)
    return proposals[step_index]

def execute_step(step_name, state):
    if step_name in state["completed_steps"]:
        return False  # no actual state change
    state["completed_steps"].add(step_name)
    return True  # real progress made

MAX_ATTEMPTS_WITHOUT_PROGRESS = 3

def run_agent_loop(state, max_iterations=10):
    for i in range(max_iterations):
        proposed = model_proposes_next_step(state)
        made_progress = execute_step(proposed, state)

        if made_progress:
            state["attempts_without_progress"] = 0
            print(f"Iteration {i}: '{proposed}' -> REAL PROGRESS (state: {state['completed_steps']})")
        else:
            state["attempts_without_progress"] += 1
            print(f"Iteration {i}: '{proposed}' -> NO PROGRESS (already done) - stall count: {state['attempts_without_progress']}")

        if state["attempts_without_progress"] >= MAX_ATTEMPTS_WITHOUT_PROGRESS:
            print(f"ABORTED: {MAX_ATTEMPTS_WITHOUT_PROGRESS} consecutive proposals with no deterministic state change")
            return False
    return True

run_agent_loop(deterministic_state)
~~~

## Dependencies, Cross-References und Quellen

1. Anthropic: [Building Effective AI Agents](https://www.anthropic.com/engineering/building-effective-agents), abgerufen 2026-09-17.
2. LangChain: [Agent Executor and State Management](https://python.langchain.com/docs/concepts/agents/), abgerufen 2026-09-17.
3. Yao et al.: [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629), abgerufen 2026-09-17.

Function-Calling-Grundlagen sind kanonisch in [KB-0247](../11-genai-architecture/07-function-calling-und-werkzeugvertraege.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte Agent-Orchestrierungs-Frameworks mit eingebauter deterministischer Zustandsverwaltung | Adopting | Gegenüber selbstgebauter Zustandslogik für konsistente, getestete Fortschrittsmessung bevorzugen. |
| Automatisierte Stillstandserkennung durch semantische Ähnlichkeitsprüfung wiederholter Modellvorschläge | Adopting | Ergänzend zu deterministischer Zustandsprüfung für zusätzliche Frühwarnsignale einsetzen. |

Ein Team akzeptiert eine Agentenschleifen-Architektur erst, wenn deterministische Zustandsverwaltung, Fortschrittsmessung und Abbruchkriterien nachweisbar strukturell getrennt implementiert sind.
