---
{"id": "KB-0300", "title": "Rollback und kompensierbare Aktionen", "domain": "12", "sequence": 26, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0299", "concepts": ["Tool Permissions und Capability-Grenzen"], "needed_for": "understanding"}, {"id": "KB-0298", "concepts": ["Agentenorchestrierung und Prozessintegration"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Aktionstagebuch implementieren, das für einen teilweise ausgeführten Agentenplan eine überprüfbare Rücknahme der bereits ausgeführten, kompensierbaren Aktionen ermöglicht.", "rationale": "Der Wert eines Aktionstagebuchs wird erst durch konkrete Implementierung einer überprüfbaren Rücknahme greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Aktionen eines Agentenplans vorab explizit in kompensierbare und irreversible Kategorien einteilen und die Architektur entsprechend unterschiedlich behandeln.", "rationale": "Kompensierbare und irreversible Aktionen erfordern grundsätzlich unterschiedliche Sicherheitsvorkehrungen, da eine irreversible Aktion im Fehlerfall nicht rückgängig gemacht werden kann."}, "STAFF-TARGET": {"active": true, "scope": "Einen nicht behebbaren Schaden nach einem fehlgeschlagenen Agentenplan auf eine fälschlich als kompensierbar eingestufte, tatsächlich irreversible Aktion statt auf ein allgemeines Fehlerbehandlungsproblem zurückführen können.", "rationale": "Eine Aktion, die fälschlich als kompensierbar (Undo möglich) statt als irreversibel eingestuft wurde, kann bei Fehlschlag zu tatsächlich nicht behebbarem Schaden führen."}, "CHIEF-TARGET": {"active": true, "scope": "Rollback-Fähigkeit als Voraussetzung für autonome Ausführung teilweise fehlschlagender Agentenpläne positionieren, mit expliziter Eskalation für irreversible Aktionen statt automatischer Fortsetzung.", "rationale": "Nur kompensierbare Aktionen können sicher automatisch zurückgenommen werden; irreversible Aktionen erfordern zusätzliche Kontrollen wie Human Gates vor Ausführung."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Implementierungsdetails spezifischer Kompensationsmechanismen (z. B. Saga-Pattern-Bibliotheken) sind Vertiefung.", "rationale": "Kern ist die Unterscheidung zwischen kompensierbar und irreversibel sowie das Aktionstagebuch-Prinzip, nicht die konkrete Bibliothek."}}, "lab_validation": [{"lab_id": "KB-0300-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell eines Aktionstagebuchs mit Rücknahme kompensierbarer Aktionen und Eskalation bei irreversiblen Aktionen", "evidence": "Ein teilweise ausgeführter Plan mit drei Aktionen, von denen die dritte fehlschlägt, kann die ersten beiden kompensierbaren Aktionen über das Aktionstagebuch nachvollziehbar zurücknehmen; eine als irreversibel markierte Aktion wird vor Ausführung eskaliert statt automatisch ausgeführt.", "limitations": "Kein echtes Zielsystem, kein produktives System, keine reale irreversible Aktion getestet."}]}
---
# Rollback und kompensierbare Aktionen

> **Ziel:** Ein Aktionstagebuch protokolliert jede Aktion eines Agentenplans, um bei einem teilweisen Fehlschlag eine überprüfbare Rücknahme der bereits ausgeführten Aktionen zu ermöglichen — aufbauend auf Tool Permissions (siehe [KB-0299](25-tool-permissions-und-capability-grenzen.md)) und Prozessintegration (siehe [KB-0298](24-agentenorchestrierung-und-prozessintegration.md)). Der zentrale Punkt ist die klare Unterscheidung zwischen Undo (eine Aktion wird exakt rückgängig gemacht), Kompensation (eine Ausgleichsaktion stellt einen konsistenten Zustand her, ohne die ursprüngliche Aktion exakt umzukehren) und irreversiblem Schaden (eine Aktion, die durch keine der beiden Mechanismen rückgängig gemacht werden kann und daher besondere Vorsicht vor Ausführung erfordert).

## Zweck, Mental Model und Dependencies

Undo bezeichnet die exakte Umkehrung einer Aktion, sodass der Zustand vor und nach Undo identisch ist (z. B. das Löschen einer soeben erstellten Datei). Kompensation bezeichnet eine Ausgleichsaktion, die einen fachlich konsistenten Zustand herstellt, ohne die ursprüngliche Aktion exakt umzukehren (z. B. eine Stornobuchung als Ausgleich für eine bereits gebuchte Transaktion, statt die ursprüngliche Buchung softwareseitig zu löschen) — dies ist relevant, wenn eine externe Wirkung bereits eingetreten ist, die nicht direkt gelöscht, sondern nur ausgeglichen werden kann. Irreversibler Schaden bezeichnet eine Aktion, für die weder Undo noch Kompensation existiert (z. B. das unwiderrufliche Versenden einer E-Mail an einen externen Empfänger oder eine physische Handlung) — solche Aktionen erfordern vor Ausführung besondere Sorgfalt, typischerweise in Form eines Human Gates (siehe [KB-0289](15-human-gates-fuer-agentenaktionen.md)), da nach Ausführung keine automatische Korrektur mehr möglich ist. Ein Aktionstagebuch protokolliert für jede ausgeführte Aktion eines Agentenplans, welche Kategorie sie hat (Undo möglich, Kompensation möglich, irreversibel) und welche konkrete Rücknahme- oder Kompensationsaktion im Fehlerfall auszuführen ist — dies ermöglicht bei einem teilweisen Fehlschlag eines mehrstufigen Plans eine überprüfbare, nachvollziehbare Rücknahme der bereits ausgeführten Schritte, statt den Plan in einem inkonsistenten Zwischenzustand zu belassen.

~~~text
Undo: EXACT reversal of an action -> state before/after undo is identical
Compensation: offsetting action restores consistent state WITHOUT exactly reversing the original
  (external effect already occurred -> can't delete, only offset, e.g. reversal booking)
Irreversible damage: NEITHER undo NOR compensation exists -> requires Human Gate BEFORE execution
Action journal: logs EACH executed action's category (undoable/compensable/irreversible) + its rollback action
  -> enables VERIFIABLE, traceable rollback of a partially failed multi-step plan
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Explizite Vorab-Kategorisierung jeder Aktion | ist für jede geplante Aktion vor Ausführung festgelegt, ob sie Undo-fähig, kompensierbar oder irreversibel ist? | eine fehlende Kategorisierung kann eine tatsächlich irreversible Aktion fälschlich als rücknehmbar behandeln |
| Vollständiges Aktionstagebuch | wird für jede tatsächlich ausgeführte Aktion protokolliert, welche konkrete Rücknahme- oder Kompensationsaktion im Fehlerfall anzuwenden ist? | ohne vollständiges Tagebuch lässt sich eine teilweise ausgeführte Sequenz nicht zuverlässig zurücknehmen |
| Human Gate vor irreversiblen Aktionen | wird eine als irreversibel kategorisierte Aktion vor Ausführung einem expliziten Freigabeschritt unterzogen? | eine automatisch ausgeführte irreversible Aktion kann bei einem nachfolgenden Fehlschlag nicht mehr korrigiert werden |
| Überprüfbare, nicht nur behauptete Rücknahme | wird nach einer Rücknahme- oder Kompensationsaktion verifiziert, dass der Zustand tatsächlich konsistent wiederhergestellt wurde? | eine unverifizierte Rücknahme kann fälschlich als erfolgreich angenommen werden, obwohl der Zustand weiterhin inkonsistent ist |

Implementierung: Jede Aktion eines Agentenplans wird vor Ausführung explizit einer der drei Kategorien (Undo-fähig, kompensierbar, irreversibel) zugeordnet, mit der jeweils konkreten Rücknahme- oder Kompensationsaktion. Jede tatsächlich ausgeführte Aktion wird in einem Aktionstagebuch protokolliert, das bei einem Fehlschlag eines nachfolgenden Schritts die geordnete, nachvollziehbare Rücknahme der bereits erfolgreichen, kompensierbaren Schritte ermöglicht (in umgekehrter Ausführungsreihenfolge, analog zum Saga-Pattern). Als irreversibel kategorisierte Aktionen durchlaufen vor Ausführung ein explizites Human Gate, statt automatisch ausgeführt zu werden. Nach jeder Rücknahme- oder Kompensationsaktion wird explizit verifiziert, dass der resultierende Zustand tatsächlich konsistent ist, statt den Erfolg der Rücknahme unverifiziert anzunehmen.

## Scalability, Reliability, Security und Observability

Rollback-Fähigkeit skaliert die sichere Automatisierbarkeit mehrstufiger Agentenpläne proportional zur Vollständigkeit der Vorab-Kategorisierung; die Reliability-Grenze liegt in einer fälschlich als kompensierbar eingestuften, tatsächlich irreversiblen Aktion, die bei Fehlschlag zu nicht behebbarem Schaden führen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein teilweise fehlgeschlagener Agentenplan lässt sich nicht vollständig zurücknehmen | fehlende oder unvollständige Aktionstagebuch-Protokollierung für bereits ausgeführte Schritte | prüfen, ob für jeden ausgeführten Schritt ein Tagebucheintrag mit konkreter Rücknahmeaktion existiert |
| ein nicht behebbarer Schaden ist nach einem fehlgeschlagenen Plan aufgetreten | eine tatsächlich irreversible Aktion wurde fälschlich als kompensierbar kategorisiert und automatisch ausgeführt | prüfen, ob die betroffene Aktion vor Ausführung korrekt als irreversibel kategorisiert und einem Human Gate unterzogen wurde |
| eine durchgeführte Rücknahme hinterlässt einen weiterhin inkonsistenten Zustand | fehlende Verifikation nach der Rücknahme- oder Kompensationsaktion | prüfen, ob der Zustand nach der Rücknahme explizit auf Konsistenz verifiziert wurde |

Security: Die fälschliche Einstufung einer irreversiblen Aktion als kompensierbar ist ein besonders folgenreicher Fehler, da er dazu führen kann, dass eine folgenreiche, nicht korrigierbare Aktion ohne die eigentlich notwendige menschliche Freigabe automatisch ausgeführt wird. Observability: Häufigkeit erfolgreicher versus fehlgeschlagener Rücknahmeversuche, Anteil als irreversibel kategorisierter Aktionen, die tatsächlich ein Human Gate durchlaufen haben, und Häufigkeit nachträglich als fehlerhaft erkannter Kategorisierungen sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** kategorisiert jede Aktion eines Agentenplans vor Ausführung explizit als Undo-fähig, kompensierbar oder irreversibel. **Principal** macht das Aktionstagebuch und die zugehörigen Rücknahmeaktionen für das Team nachvollziehbar dokumentiert. **Chief** positioniert Rollback-Fähigkeit als Voraussetzung für autonome Ausführung, mit expliziter Eskalation für irreversible Aktionen statt automatischer Fortsetzung.

Anti-Patterns: eine tatsächlich irreversible Aktion ohne sorgfältige Prüfung als kompensierbar einstufen; Agentenpläne ohne vollständiges Aktionstagebuch ausführen; eine Rücknahme- oder Kompensationsaktion als erfolgreich annehmen, ohne den resultierenden Zustand zu verifizieren.

## Production Checklist

- [ ] Jede Aktion eines Agentenplans ist vor Ausführung explizit kategorisiert (Undo-fähig, kompensierbar, irreversibel).
- [ ] Ein vollständiges Aktionstagebuch protokolliert jede tatsächlich ausgeführte Aktion mit ihrer Rücknahmeaktion.
- [ ] Als irreversibel kategorisierte Aktionen durchlaufen vor Ausführung ein Human Gate.
- [ ] Nach jeder Rücknahme- oder Kompensationsaktion wird die Konsistenz des resultierenden Zustands verifiziert.

## Interviewfragen

### 1. Was ist der Unterschied zwischen Undo und Kompensation?

**Antwort:** Undo macht eine Aktion exakt rückgängig, sodass der ursprüngliche Zustand identisch wiederhergestellt wird; Kompensation stellt einen fachlich konsistenten Zustand durch eine Ausgleichsaktion her, ohne die ursprüngliche Aktion exakt umzukehren.

### 2. Warum benötigen irreversible Aktionen ein Human Gate vor Ausführung?

**Antwort:** Nach Ausführung existiert weder Undo noch Kompensation; eine fehlerhafte irreversible Aktion kann nicht mehr automatisch korrigiert werden, weshalb eine menschliche Freigabe vor Ausführung notwendig ist.

### 3. Was ist ein Aktionstagebuch, und wozu dient es?

**Antwort:** Es protokolliert für jede tatsächlich ausgeführte Aktion eines Agentenplans deren Kategorie und konkrete Rücknahmeaktion, um bei einem teilweisen Fehlschlag eine nachvollziehbare, überprüfbare Rücknahme der bereits erfolgreichen Schritte zu ermöglichen.

### 4. Warum ist die Reihenfolge der Rücknahme bei einem mehrstufigen Plan relevant?

**Antwort:** Die Rücknahme erfolgt typischerweise in umgekehrter Ausführungsreihenfolge (analog zum Saga-Pattern), da spätere Aktionen möglicherweise auf den Wirkungen früherer Aktionen aufbauen und diese Abhängigkeit bei der Rücknahme berücksichtigt werden muss.

### 5. Wie diagnostizierst du einen nicht behebbaren Schaden nach einem fehlgeschlagenen Agentenplan?

**Antwort:** Ich prüfe, ob die betroffene Aktion vor Ausführung korrekt als irreversibel kategorisiert und einem Human Gate unterzogen wurde — eine fälschliche Einstufung als kompensierbar ist die wahrscheinlichste Ursache für einen tatsächlich nicht behebbaren Schaden.

### 6. Widersprüchliche Anforderung: Team will maximale Autonomie mit vollautomatischer Ausführung mehrstufiger Agentenpläne ohne Unterbrechung UND garantiert keine irreversible Aktion ohne menschliche Freigabe — wie gehst du vor?

**Antwort:** Ich würde erklären, dass beide Ziele vereinbar sind, wenn nur die tatsächlich als irreversibel kategorisierten Schritte ein Human Gate durchlaufen, während alle Undo-fähigen und kompensierbaren Schritte vollautomatisch mit Aktionstagebuch-Absicherung ausgeführt werden; ich würde vorschlagen, den Anteil irreversibler Schritte im Plan bewusst zu minimieren, statt auf die Freigabe für die verbleibenden irreversiblen Schritte zu verzichten.

## Praktische Labs

~~~python
# Action journal with rollback for compensable actions and gating for irreversible ones
action_journal = []

def execute_action(action_id, category, rollback_fn=None):
    if category == "irreversible":
        raise PermissionError(f"Action '{action_id}' is irreversible — requires Human Gate approval before execution")
    action_journal.append({"action_id": action_id, "category": category, "rollback_fn": rollback_fn})
    return f"Executed '{action_id}' (category: {category})"

def rollback_plan():
    results = []
    for entry in reversed(action_journal):
        if entry["category"] == "undoable" and entry["rollback_fn"]:
            results.append(entry["rollback_fn"](entry["action_id"]))
        elif entry["category"] == "compensable" and entry["rollback_fn"]:
            results.append(entry["rollback_fn"](entry["action_id"]))
    action_journal.clear()
    return results

print(execute_action("create_temp_file", "undoable", rollback_fn=lambda a: f"Undo: deleted '{a}'"))
print(execute_action("book_transaction", "compensable", rollback_fn=lambda a: f"Compensation: reversal booking for '{a}'"))

try:
    execute_action("send_external_email", "irreversible")
except PermissionError as e:
    print(f"Caught: {e}")

print("Simulated failure on next step — rolling back journal in reverse order:")
for result in rollback_plan():
    print(f"  {result}")
~~~

## Dependencies, Cross-References und Quellen

1. Temporal: [Saga Pattern and Compensation in Durable Workflows](https://docs.temporal.io/encyclopedia/workflow-execution#saga), abgerufen 2026-09-17.
2. Anthropic: [Building Effective AI Agents — Human-in-the-Loop](https://www.anthropic.com/engineering/building-effective-agents), abgerufen 2026-09-17.
3. OWASP: [OWASP Top 10 for LLM Applications — Excessive Agency](https://genai.owasp.org/llmrisk/llm08-excessive-agency/), abgerufen 2026-09-17.

Tool Permissions und Capability-Grenzen sind kanonisch in [KB-0299](25-tool-permissions-und-capability-grenzen.md) behandelt; Agentenorchestrierung und Prozessintegration in [KB-0298](24-agentenorchestrierung-und-prozessintegration.md); Human Gates in [KB-0289](15-human-gates-fuer-agentenaktionen.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Deklarative Aktionsmanifeste, die Undo-/Kompensations-/Irreversibilitätskategorie pro Toolaktion als versionierte Metadaten definieren | Adopting | Gegenüber im Code verstreuter Kategorisierungslogik für Nachvollziehbarkeit und konsistente Durchsetzung bevorzugen. |
| Automatisierte Erkennung potenziell irreversibler Toolaktionen anhand ihrer Zielsystem-Charakteristik | Emerging | Beobachten; würde Kategorisierungsfehler reduzieren, aber noch keine breit etablierte, zuverlässige Methodik. |

Ein Team akzeptiert eine Rollback-/Kompensationsarchitektur erst, wenn Kategorisierung, Aktionstagebuch und Human-Gate-Absicherung für irreversible Aktionen dokumentiert und getestet sind.
