---
{"id": "KB-0276", "title": "Planner-Executor-Architekturen", "domain": "12", "sequence": 2, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0275", "concepts": ["Agentenschleifen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Planner-Executor-Architektur implementieren, die einen Plan gegen aktuelle Annahmen validiert, bevor Ausführungsschritte gestartet werden.", "rationale": "Der Wert der Planvalidierung wird erst durch konkrete Demonstration eines veralteten Plans gegenüber aktuellem Zustand greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Planner-Executor-Architektur für eine konkrete mehrschrittige Aufgabe begründet gestalten, mit expliziter Planvalidierung und Abbruchbedingungen.", "rationale": "Getrennte Planungs- und Ausführungsphasen erfordern explizite Mechanismen, um zu erkennen, wenn ein Plan durch veränderte Umstände veraltet ist."}, "STAFF-TARGET": {"active": true, "scope": "Eine fehlerhafte Ausführung basierend auf einer veralteten Planannahme auf fehlende Planvalidierung statt auf einen allgemeinen Ausführungsfehler zurückführen können.", "rationale": "Ein zu Beginn erstellter Plan kann durch Zustandsänderungen während der Ausführung veralten, was ohne explizite Validierung unbemerkt bleibt."}, "CHIEF-TARGET": {"active": true, "scope": "Planner-Executor-Architekturen als getrennte Phasen mit notwendiger Plan-Revalidierung positionieren, nicht als einmalige Planung gefolgt von blinder Ausführung.", "rationale": "Ohne kontinuierliche Validierung gegen aktuellen Zustand kann ein ursprünglich sinnvoller Plan während der Ausführung ungültig werden."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Spezifische Planungsalgorithmen (z. B. hierarchische Aufgabenzerlegung) sind Vertiefung.", "rationale": "Kern ist das Prinzip der Trennung von Planung und Ausführung mit Validierung, nicht der spezifische Planungsalgorithmus."}}, "lab_validation": [{"lab_id": "KB-0276-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Planvalidierung gegen veränderten Zustand vor Ausführungsschritten", "evidence": "Ein zu Beginn erstellter Plan, der auf Annahmen über den damaligen Zustand basiert, kann bei tatsächlicher Ausführung auf einen veränderten Zustand treffen; explizite Planvalidierung vor jedem Ausführungsschritt erkennt diese Diskrepanz, bevor eine fehlerhafte Aktion ausgeführt wird.", "limitations": "Kein echtes produktives Planungssystem, keine reale mehrschrittige Aufgabe, keine Produktion."}]}
---
# Planner-Executor-Architekturen

> **Ziel:** Planner-Executor-Architekturen trennen Planung (Aufgabenzerlegung in Teilschritte) von Ausführung (aufbauend auf Agentenschleifen-Grundlagen, siehe [KB-0275](01-agentenschleifen-und-zustandsuebergaenge.md)) — ein zu Beginn erstellter Plan muss explizit gegen aktuelle Annahmen validiert werden, bevor Ausführungsschritte gestartet werden, da sich der zugrunde liegende Zustand während der Ausführung verändern kann und der Plan dadurch veraltet.

## Zweck, Mental Model und Dependencies

Der Planer zerlegt eine komplexe, mehrschrittige Aufgabe in eine Sequenz von Teilschritten, basierend auf dem zum Planungszeitpunkt bekannten Zustand und den verfügbaren Informationen. Der Executor führt diese Teilschritte tatsächlich aus, typischerweise über mehrere Durchläufe einer Agentenschleife (siehe [KB-0275](01-agentenschleifen-und-zustandsuebergaenge.md)). Der zentrale, oft übersehene Risikofaktor ist, dass zwischen Planungszeitpunkt und tatsächlicher Ausführung eines späteren Teilschritts Zeit vergeht, während der sich relevante Umstände ändern können — ein externes System könnte sich ändern, Daten könnten aktualisiert werden, oder frühere Ausführungsschritte könnten unerwartete Ergebnisse liefern, die die ursprünglichen Planannahmen ungültig machen. Planvalidierung ist der Mechanismus, der vor jedem (oder zumindest vor kritischen) Ausführungsschritten explizit prüft, ob die zugrunde liegenden Annahmen des Plans noch zutreffen, statt blind der ursprünglichen Planungsentscheidung zu folgen. Veraltete Annahmen sind Planungsentscheidungen, die zum Planungszeitpunkt korrekt waren, aber durch zwischenzeitliche Veränderungen nicht mehr zutreffen — ohne explizite Validierung führt ein Executor eine solche veraltete Annahme möglicherweise trotzdem aus, was zu fehlerhaften oder unsinnigen Aktionen führen kann. Abbruchbedingungen definieren, wann die Ausführung eines Plans gestoppt werden sollte — entweder weil das Ziel erreicht wurde, oder weil festgestellt wird, dass der Plan aufgrund veränderter Umstände nicht mehr sinnvoll fortgesetzt werden kann.

~~~text
Planner:   decomposes complex task into steps, based on state KNOWN AT PLANNING TIME
Executor:  actually carries out steps, over TIME (via agent loop, see KB-0275)
Time passes between planning and later execution steps -> underlying state CAN CHANGE
Plan validation: explicitly check assumptions BEFORE executing, don't blindly follow a possibly-stale plan
Stale assumption: was correct at planning time, no longer true -> executing it anyway = wrong/nonsensical action
Abort conditions: goal reached, OR plan no longer viable given current reality
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Explizite Planvalidierung | wird der Plan vor kritischen Ausführungsschritten gegen den aktuellen Zustand geprüft? | fehlende Validierung führt zur blinden Ausführung veralteter, nicht mehr zutreffender Planannahmen |
| Zwischenzeitliche Zustandsänderungserkennung | ist ein Mechanismus vorhanden, der Veränderungen zwischen Planung und Ausführung erkennt? | unerkannte Zustandsänderungen führen zu fehlerhaften Aktionen basierend auf veralteten Informationen |
| Explizite Abbruchbedingungen | ist definiert, wann die Ausführung gestoppt werden soll (Ziel erreicht oder Plan nicht mehr viabel)? | fehlende Abbruchbedingungen lassen die Ausführung eines nicht mehr sinnvollen Plans unnötig fortsetzen |
| Plan-Neuplanung bei Ungültigkeit | ist definiert, was geschieht, wenn eine Validierung eine veraltete Annahme aufdeckt (Neuplanung vs. Abbruch)? | fehlende Reaktion auf erkannte Ungültigkeit lässt das System ohne klaren nächsten Schritt |

Implementierung: vor kritischen Ausführungsschritten (insbesondere solchen mit realen Seiteneffekten) wird explizit geprüft, ob die zugrunde liegenden Planannahmen noch dem aktuellen Zustand entsprechen, statt den Plan blind auszuführen. Ein Mechanismus zur Erkennung zwischenzeitlicher Zustandsänderungen wird implementiert (z. B. durch erneutes Abfragen relevanter externer Zustände vor Ausführung), um Diskrepanzen zwischen Planungszeitpunkt und tatsächlicher Ausführung zu identifizieren. Explizite Abbruchbedingungen werden definiert — sowohl positive (Ziel erfolgreich erreicht) als auch negative (Plan aufgrund veränderter Umstände nicht mehr sinnvoll fortsetzbar). Bei erkannter Ungültigkeit eines Plans wird eine definierte Reaktion ausgelöst (Neuplanung basierend auf aktuellem Zustand, oder expliziter Abbruch mit Eskalation), statt die Ausführung unreflektiert fortzusetzen oder unklar zu blockieren.

## Scalability, Reliability, Security und Observability

Planner-Executor-Architekturen mit Validierung skalieren Zuverlässigkeit für lang laufende, mehrschrittige Aufgaben, bei denen die Wahrscheinlichkeit zwischenzeitlicher Zustandsänderungen mit der Ausführungsdauer zunimmt. Reliability-Grenze: eine Architektur ohne Planvalidierung ist ein besonders gefährliches Risiko bei lang laufenden Aufgaben — je länger die Ausführung dauert, desto wahrscheinlicher werden zwischenzeitliche Veränderungen, die einen ursprünglich korrekten Plan ungültig machen, ohne dass dies ohne aktive Prüfung erkannt wird.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Ausführung basiert auf einer Annahme, die zum Zeitpunkt der Ausführung nicht mehr zutrifft | fehlende Planvalidierung vor dem betroffenen Ausführungsschritt | prüfen, ob eine Validierung gegen aktuellen Zustand vor diesem Ausführungsschritt stattfand |
| eine lang laufende Aufgabe führt zu einem fehlerhaften Ergebnis, das bei sofortiger Ausführung nicht aufgetreten wäre | zwischenzeitliche Zustandsänderung wurde nicht erkannt, Plan wurde trotzdem unverändert ausgeführt | Zeitspanne zwischen Planung und tatsächlicher Ausführung des betroffenen Schritts gegen mögliche Zustandsänderungen prüfen |
| die Ausführung eines nicht mehr sinnvollen Plans wird unnötig fortgesetzt | fehlende explizite Abbruchbedingungen für Plan-Ungültigkeit | Abbruchbedingungs-Konfiguration auf Abdeckung sowohl positiver als auch negativer Fälle prüfen |
| ein System reagiert unklar oder gar nicht, wenn eine Planvalidierung eine Diskrepanz aufdeckt | fehlende definierte Reaktion (Neuplanung/Abbruch) auf erkannte Plan-Ungültigkeit | prüfen, ob eine explizite Reaktionslogik für den Fall erkannter Ungültigkeit implementiert ist |

Security: Planvalidierung sollte auch sicherheitsrelevante Zustandsänderungen einschließen (z. B. wurden Berechtigungen zwischenzeitlich entzogen), da eine rein fachliche Validierung solche Änderungen übersehen könnte, was zur Ausführung einer inzwischen nicht mehr autorisierten Aktion führen könnte. Observability: Häufigkeit erkannter veralteter Annahmen bei Validierung, durchschnittliche Zeitspanne zwischen Planung und Ausführung, und Häufigkeit ausgelöster Neuplanungen sind zentrale Metriken für Planner-Executor-Gesundheit.

## Trade-offs und Entscheidungen

**Staff** implementiert explizite Planvalidierung vor kritischen Ausführungsschritten. **Principal** macht Abbruchbedingungen und Neuplanungslogik für das Team nachvollziehbar dokumentiert. **Chief** positioniert Planner-Executor-Architekturen als getrennte Phasen mit notwendiger kontinuierlicher Validierung, nicht als einmalige Planung gefolgt von blinder Ausführung.

Anti-Patterns: einen Plan einmalig erstellen und danach blind ohne Validierung ausführen; keine expliziten Abbruchbedingungen für erkannte Plan-Ungültigkeit definieren; auf erkannte veraltete Annahmen ohne definierte Reaktion (Neuplanung oder Abbruch) reagieren.

## Production Checklist

- [ ] Der Plan wird vor kritischen Ausführungsschritten explizit gegen den aktuellen Zustand validiert.
- [ ] Ein Mechanismus zur Erkennung zwischenzeitlicher Zustandsänderungen ist implementiert.
- [ ] Explizite Abbruchbedingungen (Ziel erreicht/Plan nicht mehr viabel) sind definiert.
- [ ] Eine definierte Reaktion (Neuplanung/Abbruch) existiert für erkannte Plan-Ungültigkeit.

## Interviewfragen

### 1. Warum ist die Trennung von Planer und Executor nicht automatisch sicher, ohne explizite Planvalidierung?

**Antwort:** Zwischen Planungszeitpunkt und tatsächlicher Ausführung späterer Schritte vergeht Zeit, während der sich relevante Umstände ändern können; ohne explizite Validierung würde der Executor eine möglicherweise veraltete Planannahme blind ausführen.

### 2. Was ist eine veraltete Annahme im Kontext von Planner-Executor-Architekturen?

**Antwort:** Eine Planungsentscheidung, die zum Planungszeitpunkt korrekt war, aber durch zwischenzeitliche Veränderungen (externe Systemänderungen, aktualisierte Daten, unerwartete Zwischenergebnisse) nicht mehr zutrifft.

### 3. Warum sind explizite Abbruchbedingungen für beide Fälle (Ziel erreicht UND Plan nicht mehr viabel) notwendig?

**Antwort:** Positive Abbruchbedingungen erkennen erfolgreichen Abschluss; negative Abbruchbedingungen verhindern, dass die Ausführung eines aufgrund veränderter Umstände nicht mehr sinnvollen Plans unnötig fortgesetzt wird — beide Fälle benötigen explizite, unterschiedliche Erkennungslogik.

### 4. Wie diagnostizierst du, dass eine Ausführung auf einer inzwischen veralteten Planannahme basiert?

**Antwort:** Ich prüfe, ob vor dem betroffenen Ausführungsschritt eine Validierung gegen den aktuellen Zustand stattfand — fehlt diese Validierung oder wurde die Diskrepanz zwischen Planungszeitpunkt und tatsächlichem Zustand nicht erkannt, erklärt das die fehlerhafte Ausführung.

### 5. Warum steigt das Risiko veralteter Annahmen mit der Ausführungsdauer?

**Antwort:** Je länger die Ausführung dauert, desto wahrscheinlicher wird eine zwischenzeitliche Veränderung des zugrunde liegenden Zustands, was das Risiko erhöht, dass ein ursprünglich korrekter Plan während der Ausführung ungültig wird.

### 6. Widersprüchliche Anforderung: Team will maximale Ausführungsgeschwindigkeit (minimale Validierungs-Overhead) UND garantiert korrekte Ausführung auch bei sich änderndem Zustand während lang laufender Aufgaben — wie gehst du vor?

**Antwort:** Ich würde erklären, dass vollständige Validierung vor jedem einzelnen Schritt Geschwindigkeit kostet, während fehlende Validierung das Korrektheitsrisiko bei sich änderndem Zustand erhöht; ich würde vorschlagen, Validierung risikobasiert zu staffeln — häufige, leichtgewichtige Prüfungen für kritische, folgenreiche Schritte, seltenere oder keine Validierung für triviale, risikoarme Schritte, um einen bewussten Kompromiss zwischen Geschwindigkeit und Korrektheit zu erreichen.

## Praktische Labs

~~~python
# Planner-executor with plan validation against changing state
plan = ["check_inventory", "reserve_item", "process_payment", "ship_order"]

external_state = {"inventory_count": 5}

def validate_step(step, current_state):
    if step == "reserve_item" and current_state["inventory_count"] <= 0:
        return False, "STALE ASSUMPTION: inventory was available at planning time, now depleted"
    return True, "assumption still valid"

def execute_plan_with_validation(plan, state):
    for i, step in enumerate(plan):
        valid, message = validate_step(step, state)
        if not valid:
            print(f"Step {i} ('{step}'): {message} -> ABORTING, triggering re-plan")
            return "aborted_for_replan"
        print(f"Step {i} ('{step}'): {message} -> executing")
        if step == "reserve_item":
            state["inventory_count"] -= 1
    return "completed"

# Simulate: inventory depletes between planning and this execution step (e.g., another process consumed it)
external_state["inventory_count"] = 0  # changed since planning
result = execute_plan_with_validation(plan, external_state)
assert result == "aborted_for_replan"
print(f"\nResult: {result}")
print("The stale assumption ('inventory available') was caught by validation BEFORE the invalid action executed.")
~~~

## Dependencies, Cross-References und Quellen

1. Anthropic: [Building Effective AI Agents — Planning Patterns](https://www.anthropic.com/engineering/building-effective-agents), abgerufen 2026-09-17.
2. Wang et al.: [Plan-and-Solve Prompting](https://arxiv.org/abs/2305.04091), ACL 2023, abgerufen 2026-09-17.
3. LangChain: [Plan-and-Execute Agents](https://python.langchain.com/docs/concepts/agents/), abgerufen 2026-09-17.

Agentenschleifen-Grundlagen sind kanonisch in [KB-0275](01-agentenschleifen-und-zustandsuebergaenge.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Kontinuierliche, inkrementelle Neuplanung statt starrer Einmalplanung (Replanning bei jeder Zustandsänderung) | Adopting | Für hochdynamische Umgebungen gegenüber starrer Vorabplanung mit gelegentlicher Validierung evaluieren. |
| Hierarchische Planungsarchitekturen mit Validierung auf mehreren Abstraktionsebenen | Adopting | Für sehr komplexe, mehrstufige Aufgaben gegenüber flacher Einzelplanung evaluieren. |

Ein Team akzeptiert eine Planner-Executor-Architektur erst, wenn Planvalidierung vor kritischen Schritten und explizite Abbruchbedingungen nachweisbar implementiert sind.
