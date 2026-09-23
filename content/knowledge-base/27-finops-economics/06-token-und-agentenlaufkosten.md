---
{"id": "KB-0640", "title": "Token- und Agentenlaufkosten", "domain": "27", "sequence": 6, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "PLATFORM", "GENAI", "CHIEF"], "requires": [{"id": "KB-0638", "concepts": ["Cloud Unit Economics"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Input-, Output-, Tool- und Wiederholungskosten für einen konkreten AI-Agenten-Workflow anhand der bereits in KB-0638 behandelten Unit-Economics-Methodik erfassen und Kosten pro tatsächlich erfolgreicher Aufgabe berechnen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Kosten pro erfolgreicher Aufgabe (einschließlich Fehlversuchen und menschlicher Nacharbeit) statt Kosten pro einzelnem Modellaufruf als tatsächlich aussagekräftige Wirtschaftlichkeitskennzahl für AI-Agenten-Systeme etabliert werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Agentenlaufkosten-Berechnung nur erfolgreiche Durchläufe zählt und dadurch die tatsächlichen Gesamtkosten (einschließlich gescheiterter Versuche und nachträglicher, menschlicher Korrektur) systematisch unterschätzt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Token- und Agentenlaufkosten-Berechnung festlegen, die Kosten pro tatsächlich erfolgreicher Aufgabe einschließlich Fehlversuchen und Nacharbeit verbindlich vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, technische Implementierung von Token-Zählung in einer bestimmten Model-API ist Vertiefung.", "rationale": "Kern ist die vollständige, wirtschaftliche Kostenberechnung pro erfolgreicher Aufgabe, nicht die technische Token-Zähl-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0640-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Berechnung der Kosten pro tatsächlich erfolgreicher Agentenaufgabe einschließlich Fehlversuchen, kein produktives Kostenrechnungs-Tool verwendet", "evidence": "Ein lokales Skript vergleicht die naive Kostenberechnung (Gesamtkosten geteilt durch Anzahl erfolgreicher Durchläufe) mit einer vollständigen Berechnung, die auch Kosten gescheiterter Versuche und menschlicher Nacharbeit einbezieht, und zeigt die daraus resultierende Kostenunterschätzung.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Kostenrechnungs-Tool."}]}
---
# Token- und Agentenlaufkosten

> **Ziel:** Token- und Agentenlaufkosten erfassen die vollständigen Kosten eines AI-Agenten-Workflows — **Input**- und **Output**-Token, **Tool**-Aufrufe (etwa API-Anfragen, Datenbankabfragen, die ein Agent während seiner Ausführung tätigt) und **Wiederholungen** (erneute Versuche nach einem gescheiterten oder unzureichenden Ergebnis) —, aufbauend auf der bereits in [KB-0638](04-cloud-unit-economics.md) behandelten Unit-Economics-Methodik. Der zentrale Punkt dieses Kapitels ist, dass die tatsächlich aussagekräftige Wirtschaftlichkeitskennzahl die **Kosten pro tatsächlich erfolgreicher Aufgabe** ist — einschließlich der Kosten gescheiterter Versuche und notwendiger, menschlicher Nacharbeit — statt der Kosten pro einzelnem Modellaufruf oder Token, da eine Kennzahl, die nur erfolgreiche Durchläufe zählt, die tatsächlichen Gesamtkosten eines AI-Agenten-Systems systematisch unterschätzt.

## Zweck, Mental Model und Dependencies

Ein einzelner Modellaufruf oder eine einzelne Token-Anzahl ist eine technisch leicht messbare, aber wirtschaftlich unvollständige Kennzahl für AI-Agenten-Systeme, weil ein Agent zur Erfüllung einer einzelnen, tatsächlichen Aufgabe typischerweise mehrere Modellaufrufe, Tool-Nutzungen und möglicherweise mehrere Wiederholungsversuche benötigt — eine Kostenkennzahl, die nur den einzelnen, erfolgreichen Modellaufruf misst, verschweigt die tatsächlichen, vorangegangenen Kosten gescheiterter Versuche, zusätzlicher Tool-Aufrufe zur Informationsbeschaffung, und möglicherweise notwendiger, iterativer Verfeinerung. Die methodisch korrekte Kennzahl ist deshalb "Kosten pro tatsächlich erfolgreicher Aufgabe" — diese Kennzahl summiert alle tatsächlich angefallenen Kosten (einschließlich gescheiterter Versuche) über den gesamten Zeitraum bis zum tatsächlichen, erfolgreichen Abschluss einer Aufgabe, statt nur die Kosten des letzten, erfolgreichen Versuchs zu zählen. Menschliche Nacharbeit ist ein weiterer, häufig übersehener Kostenfaktor: Wenn ein AI-Agent eine Aufgabe formal abschließt, das Ergebnis aber tatsächlich fehlerhaft oder unzureichend ist und ein Mensch das Ergebnis nachträglich korrigieren oder die Aufgabe manuell nachbearbeiten muss, sind diese menschlichen Nacharbeitskosten Teil der tatsächlichen Gesamtkosten dieser Aufgabe — eine Berechnung, die nur die reinen AI-System-Kosten zählt, ohne die nachgelagerten, menschlichen Korrekturkosten einzubeziehen, unterschätzt systematisch die tatsächliche Wirtschaftlichkeit des AI-Agenten-Systems. Diese vollständige Kostenbetrachtung ist besonders bedeutsam für den Vergleich unterschiedlicher AI-Agenten-Architekturen oder -Modelle: Ein Modell mit höheren Kosten pro einzelnem Aufruf, aber einer deutlich höheren Erfolgsquote bei der ersten Ausführung (weniger Wiederholungen, weniger menschliche Nacharbeit) kann wirtschaftlich tatsächlich günstiger sein als ein Modell mit niedrigeren Kosten pro Aufruf, aber häufigeren Fehlversuchen und höherem Nacharbeitsbedarf — ein reiner Vergleich der Kosten pro einzelnem Token oder Aufruf würde diesen tatsächlichen, wirtschaftlichen Unterschied nicht sichtbar machen.

~~~text
Token/agent-run economics: captures COMPLETE costs of an AI agent workflow
  INPUT+OUTPUT tokens, TOOL calls (API requests, DB queries agent makes during execution),
  RETRIES (renewed attempts after failed/insufficient result)
  builds on KB-0638 unit-economics methodology
KEY POINT: actually meaningful economic metric = COST PER ACTUALLY SUCCESSFUL TASK
  including costs of failed attempts AND necessary human rework
  instead of cost per single model call or token
  metric counting only successful runs -> systematically UNDERESTIMATES actual total cost
  of an AI agent system
SINGLE model call / single token count = technically easily measurable but economically
  INCOMPLETE metric for AI agent systems
  agent completing a single ACTUAL task typically needs multiple model calls, tool uses,
  possibly multiple retry attempts
  cost metric measuring only the single, successful model call -> conceals actual, preceding
  costs of failed attempts, additional tool calls for info gathering, possibly necessary
  iterative refinement
METHODICALLY CORRECT metric: "cost per actually successful task"
  sums ALL actually-incurred costs (including failed attempts) over WHOLE period until
  actual, successful task completion
  instead of counting only cost of the last, successful attempt
HUMAN REWORK = further, often-overlooked cost factor
  AI agent formally completes task, but result actually faulty/insufficient, and a human must
  subsequently correct result or manually rework the task
  -> these human rework costs ARE PART of actual total cost of this task
  calculation counting only pure AI-system costs, w/o including downstream human correction costs
  -> systematically underestimates actual economics of the AI agent system
this COMPLETE cost view especially significant for comparing different AI agent
  architectures/models
  model w/ higher per-call cost but substantially higher first-attempt success rate
  (fewer retries, less human rework) -> CAN be economically actually cheaper than model
  w/ lower per-call cost but more frequent failed attempts + higher rework need
  pure per-token/per-call cost comparison would NOT make this actual, economic difference visible
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Input-/Output-Token-Kosten | Grundkosten eines einzelnen Modellaufrufs | Teil der Gesamtkosten, aber unvollständig allein |
| Tool-Aufrufkosten | Kosten zusätzlicher API-/Datenzugriffe während der Ausführung | häufig übersehener Bestandteil der Gesamtkosten |
| Wiederholungskosten | Kosten erneuter Versuche nach gescheitertem Ergebnis | zeigt tatsächliche, nicht nur erfolgreiche Ausführungskosten |
| Kosten pro erfolgreicher Aufgabe | summiert alle Kosten bis zum tatsächlichen, erfolgreichen Abschluss | methodisch korrekte, vollständige Wirtschaftlichkeitskennzahl |

Implementierung: Jeder Modellaufruf, Tool-Aufruf und Wiederholungsversuch innerhalb eines Agenten-Workflows wird mit seinen tatsächlichen Kosten erfasst. Die Gesamtkosten werden über den gesamten Zeitraum bis zum tatsächlichen, erfolgreichen Abschluss einer Aufgabe summiert, einschließlich gescheiterter Versuche. Menschliche Nacharbeitskosten werden explizit erfasst und der ursprünglichen Aufgabe zugeordnet, statt als separate, unverbundene Kostenposition geführt zu werden.

## Scalability, Reliability, Security und Observability

Token- und Agentenlaufkosten-Bewertung skaliert die tatsächliche, wirtschaftliche Aussagekraft proportional zur Vollständigkeit der Kostenerfassung (Wiederholungen, Nacharbeit); die Reliability-Grenze liegt darin, dass eine Kennzahl, die nur erfolgreiche Einzelaufrufe zählt, die tatsächlichen Gesamtkosten systematisch unterschätzt und dadurch zu fehlgeleiteten Modell- oder Architekturentscheidungen führen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| die tatsächlichen Gesamtkosten eines AI-Agenten-Systems übersteigen deutlich die anhand der Token-Kosten geschätzten Kosten | Wiederholungsversuche und Tool-Aufrufe wurden bei der Kostenschätzung nicht vollständig erfasst | die Kostenberechnung um vollständige Wiederholungs- und Tool-Aufrufkosten erweitern |
| ein Modell mit niedrigeren Token-Kosten erweist sich in der Praxis als wirtschaftlich schlechter | häufigere Fehlversuche oder höherer menschlicher Nacharbeitsbedarf wurden nicht in den Kostenvergleich einbezogen | die Kosten pro tatsächlich erfolgreicher Aufgabe statt der reinen Token-Kosten vergleichen |
| eine Kostenberichterstattung zeigt niedrige AI-Systemkosten, während tatsächlich erhebliche, nachgelagerte Korrekturaufwände anfallen | menschliche Nacharbeitskosten wurden nicht der ursprünglichen AI-Aufgabe zugeordnet | menschliche Nacharbeitskosten explizit erfassen und der ursprünglichen Aufgabe zurechnen |

Security: Tool-Aufrufe eines Agenten, die zusätzliche externe Ressourcen konsumieren, sollten auf ihre tatsächliche Notwendigkeit geprüft werden, um sowohl Kosten als auch unnötige Angriffsfläche zu begrenzen. Observability: Die tatsächliche Erfolgsquote beim ersten Versuch (statt der Gesamterfolgsquote nach beliebig vielen Wiederholungen) ist ein zentrales Signal zur Bewertung der tatsächlichen, wirtschaftlichen Effizienz eines Agenten-Modells.

## Trade-offs und Entscheidungen

**Staff** erfasst die vollständigen Kosten eines gegebenen Agenten-Workflows korrekt einschließlich Wiederholungen. **Principal** entwirft die vollständige Kosten-pro-erfolgreicher-Aufgabe-Methodik mit Nacharbeitserfassung für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für Token- und Agentenlaufkosten fest, die vollständige Kostenerfassung einschließlich Nacharbeit verbindlich vorschreiben.

Anti-Patterns: Kostenkennzahlen ausschließlich anhand einzelner, erfolgreicher Modellaufrufe berechnen, ohne Wiederholungen zu berücksichtigen; menschliche Nacharbeitskosten als separate, unverbundene Kostenposition statt als Teil der ursprünglichen Aufgabenkosten führen; Modelle allein anhand ihrer Token-Kosten vergleichen, ohne tatsächliche Erfolgsquoten und Nacharbeitsbedarf einzubeziehen.

## Production Checklist

- [ ] Wiederholungsversuche werden vollständig in die Kostenberechnung einer Aufgabe einbezogen.
- [ ] Tool-Aufrufkosten sind explizit erfasst, nicht nur reine Modellaufrufkosten.
- [ ] Menschliche Nacharbeitskosten sind erfasst und der ursprünglichen Aufgabe zugeordnet.
- [ ] Modellvergleiche erfolgen anhand von Kosten pro tatsächlich erfolgreicher Aufgabe, nicht anhand reiner Token-Kosten.

## Interviewfragen

### 1. Warum ist "Kosten pro tatsächlich erfolgreicher Aufgabe" eine aussagekräftigere Kennzahl als "Kosten pro Modellaufruf"?

**Antwort:** Weil ein Agent zur Erfüllung einer Aufgabe typischerweise mehrere Aufrufe, Tool-Nutzungen und möglicherweise Wiederholungsversuche benötigt, und eine Kennzahl, die nur den erfolgreichen Einzelaufruf misst, die vorangegangenen Kosten gescheiterter Versuche verschweigt.

### 2. Warum sollten menschliche Nacharbeitskosten in die Gesamtkostenberechnung einer AI-Agenten-Aufgabe einbezogen werden?

**Antwort:** Weil ein formal abgeschlossenes, aber tatsächlich fehlerhaftes Ergebnis nachträgliche, menschliche Korrekturkosten verursacht, die Teil der tatsächlichen Gesamtkosten dieser Aufgabe sind.

### 3. Warum kann ein Modell mit höheren Kosten pro Aufruf wirtschaftlich günstiger sein als ein Modell mit niedrigeren Kosten pro Aufruf?

**Antwort:** Wenn es eine deutlich höhere Erfolgsquote bei der ersten Ausführung hat, wodurch weniger Wiederholungen und weniger menschliche Nacharbeit anfallen, was die tatsächlichen Gesamtkosten senkt.

### 4. Was wird bei der Berechnung "Kosten pro erfolgreicher Aufgabe" summiert?

**Antwort:** Alle tatsächlich angefallenen Kosten (einschließlich gescheiterter Versuche) über den gesamten Zeitraum bis zum tatsächlichen, erfolgreichen Abschluss einer Aufgabe, nicht nur die Kosten des letzten, erfolgreichen Versuchs.

### 5. Wie gehst du vor, wenn die tatsächlichen Gesamtkosten eines AI-Agenten-Systems deutlich die anhand der Token-Kosten geschätzten Kosten übersteigen?

**Antwort:** Ich prüfe, ob Wiederholungsversuche und Tool-Aufrufe vollständig in die Kostenschätzung einbezogen wurden, und erweitere die Berechnung entsprechend um diese oft übersehenen Kostenfaktoren.

### 6. Widersprüchliche Anforderung: Das Produktteam will ein Modell mit niedrigen, sichtbaren Token-Kosten auswählen UND die Organisation will die tatsächlich wirtschaftlichste Gesamtlösung — wie gehst du vor?

**Antwort:** Ich würde für beide zur Wahl stehenden Modelle die Kosten pro tatsächlich erfolgreicher Aufgabe einschließlich Wiederholungen und Nacharbeit berechnen und diese vollständige Kennzahl als Entscheidungsgrundlage präsentieren, statt die Entscheidung allein anhand der sichtbaren, aber unvollständigen Token-Kosten zu treffen.

## Praktische Labs

~~~python
# Local, deterministic simulation of computing cost per successful task including retries and rework (executed locally, no real cost tool):

def cost_per_successful_task(tasks):
    total_cost = 0
    successful_tasks = 0
    for t in tasks:
        total_cost += t["model_cost"] + t["tool_cost"] + t.get("rework_cost", 0)
        if t["succeeded"]:
            successful_tasks += 1
    return {"total_cost": total_cost, "successful_tasks": successful_tasks, "cost_per_success": round(total_cost / successful_tasks, 2) if successful_tasks else None}

tasks = [
    {"model_cost": 0.10, "tool_cost": 0.02, "succeeded": False},  # failed first attempt
    {"model_cost": 0.10, "tool_cost": 0.02, "rework_cost": 5.00, "succeeded": True},  # succeeded but needed human rework
]

print(cost_per_successful_task(tasks))
~~~

## Dependencies, Cross-References und Quellen

1. FinOps Foundation: [FinOps for AI — Token and Agent Cost Considerations](https://www.finops.org/framework/scopes/ai-and-machine-learning/), abgerufen 2026-09-18.
2. OpenAI-Dokumentation: [Understanding Token Usage and Pricing](https://platform.openai.com/docs/guides/production-best-practices), abgerufen 2026-09-18.

Cloud Unit Economics ist kanonisch in [KB-0638](04-cloud-unit-economics.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, durchgängige Kostenverfolgung über den gesamten Agenten-Workflow (Modellaufrufe, Tools, Wiederholungen) mit Verknüpfung zu nachgelagerten, menschlichen Korrekturvorgängen | Evaluating | Als kontinuierliches Instrumentierungswerkzeug einführen, um manuelle, unvollständige Kostenschätzungen durch vollständige, automatisch erfasste Kostenketten zu ersetzen. |

Ein Team akzeptiert eine Token- und Agentenlaufkosten-Berechnung erst, wenn Wiederholungen, Tool-Aufrufe und menschliche Nacharbeit nachweislich vollständig in die Kosten-pro-erfolgreicher-Aufgabe-Kennzahl einbezogen sind.
