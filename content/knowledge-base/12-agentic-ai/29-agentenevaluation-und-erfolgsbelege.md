---
{"id": "KB-0303", "title": "Agentenevaluation und Erfolgsbelege", "domain": "12", "sequence": 29, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0302", "concepts": ["Agentenbeobachtung und Trace Replay"], "needed_for": "understanding"}, {"id": "KB-0283", "concepts": ["Tool Use und Ergebnisverträge"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Evaluationslogik implementieren, die Task Success unabhängig von der Selbstauskunft des Agenten anhand des tatsächlichen Endzustands prüft.", "rationale": "Der Unterschied zwischen einer plausiblen Selbstauskunft und einer tatsächlich unabhängig verifizierten Erfolgsprüfung wird erst durch konkrete Implementierung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein Evaluationsschema gestalten, das Task Success, Sicherheitsverletzungen und Ressourcenverbrauch als getrennte, jeweils unabhängig messbare Dimensionen behandelt.", "rationale": "Ein Agent kann eine Aufgabe erfolgreich abschließen, dabei aber Sicherheitsverletzungen begehen oder unverhältnismäßig viele Ressourcen verbrauchen — diese Dimensionen dürfen nicht in einer einzigen Erfolgsmetrik vermischt werden."}, "STAFF-TARGET": {"active": true, "scope": "Eine überschätzte Agentenqualität auf eine ungeprüfte Selbstauskunft statt auf eine unabhängige Ergebnisprüfung zurückführen können.", "rationale": "Ein Agent kann einen Erfolg plausibel behaupten, ohne dass der tatsächliche Endzustand dies unabhängig bestätigt; nur eine unabhängige Prüfung deckt diese Diskrepanz auf."}, "CHIEF-TARGET": {"active": true, "scope": "Agentenevaluation als unabhängige, von Selbstauskünften getrennte Erfolgsmessung positionieren, die Simulationsfälle und reale Erfolgsbelege klar unterscheidet.", "rationale": "Ohne unabhängige Ergebnisprüfung und klare Trennung von Simulation und realem Nachweis lassen sich Aussagen über Agentenqualität nicht verlässlich treffen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Evaluationsframework-Implementierungsdetails sind Vertiefung.", "rationale": "Kern ist die Trennung von unabhängiger Prüfung und Selbstauskunft sowie die getrennte Messung der drei Dimensionen, nicht die konkrete Framework-Wahl."}}, "lab_validation": [{"lab_id": "KB-0303-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell einer Evaluationslogik mit unabhängiger Endzustandsprüfung gegenüber einer plausiblen, aber unzutreffenden Selbstauskunft des Agenten", "evidence": "Ein Agent, der einen Erfolg behauptet, ohne dass der tatsächliche Endzustand die erwartete Bedingung erfüllt, wird durch eine unabhängige Prüfung des Endzustands korrekt als nicht erfolgreich erkannt, während die reine Selbstauskunft dies verschleiert hätte.", "limitations": "Kein echtes Zielsystem, kein produktives System, keine reale Evaluationsinfrastruktur."}]}
---
# Agentenevaluation und Erfolgsbelege

> **Ziel:** Task Success, Sicherheitsverletzungen und Ressourcenverbrauch müssen als getrennte Dimensionen gemessen werden, aufbauend auf Trace-basierter Beobachtung (siehe [KB-0302](28-agentenbeobachtung-und-trace-replay.md)) und Ergebnisverträgen (siehe [KB-0283](09-tool-use-und-ergebnisvertraege.md)). Der zentrale Punkt ist, dass eine unabhängige Ergebnisprüfung anhand des tatsächlichen Endzustands zwingend notwendig ist — eine plausible Selbstauskunft des Agenten über den eigenen Erfolg ist keine verlässliche Erfolgsmessung, da ein Agent einen Erfolg glaubhaft behaupten kann, ohne dass er tatsächlich eingetreten ist.

## Zweck, Mental Model und Dependencies

Task Success misst, ob eine Agentenaufgabe tatsächlich das beabsichtigte Ergebnis erzielt hat — die korrekte Messmethode ist die Prüfung des tatsächlichen Endzustands (z. B. wurde der Datensatz tatsächlich korrekt aktualisiert) gegen eine unabhängig definierte Erfolgsbedingung, nicht die Selbstauskunft des Agenten über seinen eigenen wahrgenommenen Erfolg. Sicherheitsverletzungen messen, ob der Agent während der Aufgabenbearbeitung Grenzen überschritten hat (z. B. Zugriff auf nicht autorisierte Ressourcen, siehe Tool Permissions), unabhängig davon, ob die Aufgabe selbst erfolgreich abgeschlossen wurde — ein Agent kann eine Aufgabe technisch erfolgreich lösen und dabei dennoch eine Sicherheitsverletzung begehen, weshalb diese Dimension separat gemessen werden muss. Ressourcenverbrauch (Zeit, Kosten, Tool-Aufrufe) misst die Effizienz der Aufgabenlösung, unabhängig vom Erfolg oder der Sicherheit — ein technisch erfolgreicher, sicherer Lösungsweg kann dennoch unverhältnismäßig ineffizient sein. Der zentrale, oft übersehene Fehler ist, sich bei der Erfolgsmessung auf die Selbstauskunft des Agenten zu verlassen ("Ich habe die Aufgabe erfolgreich abgeschlossen") statt auf eine unabhängige Prüfung des tatsächlichen Endzustands — ein Agent kann aufgrund von Modellhalluzination, unvollständiger Information oder fehlerhafter Interpretation einen Erfolg plausibel, aber fälschlich behaupten. Simulationsfälle (kontrollierte Testszenarien) müssen klar von realen Erfolgsbelegen (tatsächlich in Produktion oder gegen echte Systeme erzielte Ergebnisse) unterschieden werden, da eine gute Simulationsleistung nicht automatisch reale Leistungsfähigkeit garantiert.

~~~text
Task success: measure ACTUAL end state against independently defined success condition
  NOT the agent's self-report of its own perceived success (can be plausible but WRONG)
Safety violations: measured SEPARATELY -> agent can succeed at task AND still violate boundaries
Resource consumption: measured SEPARATELY -> efficient success != safe success != actual success
CRITICAL: these three dimensions must NOT be merged into one blended success score
Simulation results != real-world success evidence -> keep clearly distinguished
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Unabhängige Endzustandsprüfung statt Selbstauskunft | wird der tatsächliche Endzustand unabhängig von der Selbstauskunft des Agenten gegen die Erfolgsbedingung geprüft? | eine reine Selbstauskunft kann einen tatsächlich nicht eingetretenen Erfolg plausibel, aber fälschlich behaupten |
| Getrennte Messung von Task Success, Sicherheit und Ressourcenverbrauch | werden diese drei Dimensionen unabhängig voneinander gemessen und berichtet, statt zu einer Gesamtmetrik vermischt zu werden? | eine vermischte Metrik kann Sicherheitsverletzungen oder Ineffizienz hinter einem hohen Erfolgswert verbergen |
| Klare Trennung von Simulation und realem Nachweis | ist eindeutig gekennzeichnet, ob ein Erfolgsbeleg aus einer kontrollierten Simulation oder aus einer realen Ausführung stammt? | eine Vermischung kann eine gute Simulationsleistung fälschlich als Beleg realer Leistungsfähigkeit darstellen |
| Konsistenz der Erfolgsbedingung über Evaluationsläufe hinweg | ist die Erfolgsbedingung für eine bestimmte Aufgabe über verschiedene Evaluationsläufe hinweg konsistent definiert? | eine inkonsistente Erfolgsbedingung macht Vergleiche zwischen Evaluationsläufen unzuverlässig |

Implementierung: Task Success wird durch eine unabhängige Prüfung des tatsächlichen Endzustands gegen eine vorab definierte, objektive Erfolgsbedingung gemessen, nicht durch Abfrage der Selbstauskunft des Agenten. Sicherheitsverletzungen werden als separate Metrik erfasst, basierend auf tatsächlich protokollierten Grenzüberschreitungen (siehe Tool Permissions, [KB-0299](25-tool-permissions-und-capability-grenzen.md)), unabhängig vom Task-Success-Ergebnis. Ressourcenverbrauch wird als dritte, eigenständige Metrik erfasst (Zeit, Kosten, Anzahl Tool-Aufrufe). Jeder Evaluationslauf wird explizit als Simulation oder als realer Nachweis gekennzeichnet, und Ergebnisse aus beiden Kategorien werden getrennt ausgewiesen, statt sie in einer gemeinsamen Statistik zu vermischen.

## Scalability, Reliability, Security und Observability

Agentenevaluation skaliert die Verlässlichkeit von Qualitätsaussagen proportional zur Konsequenz der unabhängigen Endzustandsprüfung; die Reliability-Grenze liegt in einer auf Selbstauskunft basierenden Erfolgsmessung, die mit wachsender Modellkomplexität ein proportional wachsendes Risiko plausibler, aber fälschlicher Erfolgsbehauptungen erzeugt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| die berichtete Erfolgsrate eines Agenten erscheint deutlich höher als in der Praxis beobachtete Ergebnisse | die Erfolgsmessung basiert auf Selbstauskunft des Agenten statt auf unabhängiger Endzustandsprüfung | prüfen, ob der Endzustand für die betroffenen Erfolgsfälle unabhängig verifiziert wurde |
| ein Agent mit hoher Erfolgsrate zeigt in der Praxis unerwartet häufig Sicherheitsverletzungen | Task Success und Sicherheitsverletzungen wurden in einer gemeinsamen Metrik vermischt statt getrennt gemessen | prüfen, ob Sicherheitsverletzungen als eigenständige, vom Task-Success-Wert unabhängige Metrik erfasst wurden |
| ein in Simulationen gut performender Agent zeigt in der Praxis deutlich schlechtere Ergebnisse | Simulationsergebnisse wurden fälschlich als Beleg realer Leistungsfähigkeit dargestellt, ohne klare Kennzeichnung | prüfen, ob die berichteten Erfolgsbelege als Simulation oder als realer Nachweis gekennzeichnet waren |

Security: Sicherheitsverletzungen müssen als eigenständige, nicht mit dem Erfolgswert vermischte Metrik erfasst werden, da ein hoher Task-Success-Wert sonst fälschlich als Gesamtbeleg für sicheres Agentenverhalten missverstanden werden könnte. Observability: Verhältnis unabhängig verifizierter zu selbstberichteten Erfolgsfällen, Häufigkeit erkannter Sicherheitsverletzungen pro erfolgreicher Aufgabe und Verhältnis von Simulations- zu realen Erfolgsbelegen sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Task-Success-Messung immer als unabhängige Endzustandsprüfung, nie als reine Selbstauskunft. **Principal** macht die getrennte Erfassung von Task Success, Sicherheit und Ressourcenverbrauch für das Team nachvollziehbar dokumentiert. **Chief** positioniert Agentenevaluation als unabhängige, von Selbstauskünften getrennte Erfolgsmessung mit klarer Trennung von Simulation und realem Nachweis.

Anti-Patterns: Task Success allein anhand der Selbstauskunft des Agenten messen; Task Success, Sicherheitsverletzungen und Ressourcenverbrauch zu einer einzigen Erfolgsmetrik vermischen; Simulationsergebnisse ohne klare Kennzeichnung als Beleg realer Leistungsfähigkeit darstellen.

## Production Checklist

- [ ] Task Success wird durch unabhängige Prüfung des tatsächlichen Endzustands gemessen.
- [ ] Sicherheitsverletzungen werden als eigenständige, vom Task Success getrennte Metrik erfasst.
- [ ] Ressourcenverbrauch wird als eigenständige, getrennte Metrik erfasst.
- [ ] Jeder Evaluationslauf ist explizit als Simulation oder realer Nachweis gekennzeichnet.

## Interviewfragen

### 1. Warum reicht die Selbstauskunft eines Agenten nicht als Erfolgsmessung aus?

**Antwort:** Ein Agent kann aufgrund von Modellhalluzination, unvollständiger Information oder fehlerhafter Interpretation einen Erfolg plausibel, aber fälschlich behaupten; eine unabhängige Prüfung des tatsächlichen Endzustands ist notwendig, um dies zu erkennen.

### 2. Warum müssen Task Success, Sicherheitsverletzungen und Ressourcenverbrauch getrennt gemessen werden?

**Antwort:** Ein Agent kann eine Aufgabe erfolgreich abschließen und dabei dennoch Sicherheitsverletzungen begehen oder unverhältnismäßig viele Ressourcen verbrauchen; eine vermischte Metrik würde diese Probleme hinter einem hohen Erfolgswert verbergen.

### 3. Warum ist die Trennung von Simulations- und realen Erfolgsbelegen wichtig?

**Antwort:** Eine gute Leistung in einer kontrollierten Simulation garantiert nicht automatisch reale Leistungsfähigkeit; ohne klare Kennzeichnung könnte eine gute Simulationsleistung fälschlich als Beleg realer Qualität dargestellt werden.

### 4. Wie wird Task Success korrekt gemessen?

**Antwort:** Durch eine unabhängige Prüfung des tatsächlichen Endzustands gegen eine vorab definierte, objektive Erfolgsbedingung, nicht durch Abfrage der Selbstauskunft des Agenten über den eigenen wahrgenommenen Erfolg.

### 5. Wie diagnostizierst du eine überschätzte Agentenqualität?

**Antwort:** Ich prüfe, ob die berichtete Erfolgsrate auf einer unabhängigen Endzustandsprüfung oder auf der Selbstauskunft des Agenten basiert — eine ausschließlich selbstberichtete Erfolgsrate ist die wahrscheinlichste Ursache für eine Überschätzung.

### 6. Widersprüchliche Anforderung: Team will schnelle, kostengünstige Evaluation ohne aufwendige unabhängige Endzustandsprüfung UND garantiert verlässliche Aussagen über die tatsächliche Agentenqualität — wie gehst du vor?

**Antwort:** Ich würde erklären, dass verlässliche Qualitätsaussagen ohne unabhängige Prüfung nicht möglich sind, da Selbstauskünfte plausible, aber fälschliche Erfolge nicht erkennen; ich würde vorschlagen, die unabhängige Prüfung auf automatisierbare, objektive Erfolgsbedingungen zu beschränken, um den Aufwand zu minimieren, ohne auf die unabhängige Prüfung selbst zu verzichten.

## Praktische Labs

~~~python
# Independent end-state verification vs. agent self-report
def agent_self_report(task_id):
    # Simulates an agent plausibly claiming success without it having actually occurred
    return {"task_id": task_id, "claimed_status": "success"}

def verify_actual_end_state(task_id, actual_database_state, expected_condition):
    return expected_condition(actual_database_state)

self_report = agent_self_report("update-inventory-42")
print(f"Agent self-report: {self_report}")

actual_state = {"inventory_item_42": "unchanged"}  # the agent's claimed update did NOT actually happen
success_condition = lambda state: state["inventory_item_42"] == "updated"

verified_success = verify_actual_end_state("update-inventory-42", actual_state, success_condition)
print(f"Independently verified success: {verified_success}")

assert self_report["claimed_status"] == "success"
assert verified_success is False
print("Self-report claimed success, but independent end-state verification reveals the task actually FAILED.")
~~~

## Dependencies, Cross-References und Quellen

1. Anthropic: [Building Effective AI Agents — Evaluation](https://www.anthropic.com/engineering/building-effective-agents), abgerufen 2026-09-17.
2. OpenAI: [Evals — Framework for Evaluating LLM Applications](https://github.com/openai/evals), abgerufen 2026-09-17.
3. OWASP: [OWASP Top 10 for LLM Applications — Excessive Agency](https://genai.owasp.org/llmrisk/llm08-excessive-agency/), abgerufen 2026-09-17.

Agentenbeobachtung und Trace Replay sind kanonisch in [KB-0302](28-agentenbeobachtung-und-trace-replay.md) behandelt; Ergebnisverträge in [KB-0283](09-tool-use-und-ergebnisvertraege.md); Tool Permissions in [KB-0299](25-tool-permissions-und-capability-grenzen.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte End-State-Verifikationsframeworks, die Erfolgsbedingungen deklarativ definieren und unabhängig vom Agenten prüfen | Adopting | Gegenüber manueller Selbstauskunftsprüfung für verlässliche, skalierbare Evaluation bevorzugen. |
| Standardisierte Benchmark-Suiten, die Simulations- und reale Erfolgsbelege konsistent getrennt ausweisen | Emerging | Beobachten; würde Vergleichbarkeit zwischen Agenten-Frameworks verbessern, aber noch nicht breit etabliert. |

Ein Team akzeptiert eine Agentenevaluationsarchitektur erst, wenn unabhängige Endzustandsprüfung, getrennte Dimensionsmessung und klare Simulations-/Realnachweis-Kennzeichnung dokumentiert und getestet sind.
