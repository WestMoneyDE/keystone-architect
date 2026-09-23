---
{"id": "KB-0289", "title": "Human Gates für Agentenaktionen", "domain": "12", "sequence": 15, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0288", "concepts": ["Autorität und minimale Berechtigungen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Human Gate implementieren, das eine konkrete Aktion mit Ziel und Folgen zur Freigabe darstellt und die Freigabe an genau diese Aktion bindet.", "rationale": "Der Wert eines Human Gates wird erst durch konkrete Implementierung einer Approval-Bindung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Entscheiden, an welchen Punkten eines Agentenablaufs ein Human Gate notwendig ist, basierend auf Folgenreichweite statt auf pauschaler Vorsicht.", "rationale": "Nicht jede Aktion benötigt ein Human Gate; die Entscheidung sollte auf der tatsächlichen Folgenreichweite der Aktion basieren."}, "STAFF-TARGET": {"active": true, "scope": "Eine unautorisierte Aktion auf eine nicht durchgesetzte Approval-Bindung oder eine unerkannte Änderung nach Freigabe statt auf ein allgemeines Freigabeproblem zurückführen können.", "rationale": "Eine Freigabe, die nicht eindeutig an die tatsächlich ausgeführte Aktion gebunden ist, oder eine unerkannte Änderung nach Freigabe untergräbt den Zweck des Human Gates."}, "CHIEF-TARGET": {"active": true, "scope": "Human Gates als notwendigen Kontrollpunkt für Aktionen mit erheblicher Folgenreichweite positionieren, nicht als generische Verlangsamung jedes Agentenablaufs.", "rationale": "Human Gates sind ein gezieltes Sicherheitsinstrument, dessen Wert von korrekter Platzierung und korrekter Durchsetzung abhängt, nicht von ihrer bloßen Existenz."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Approval-UI-Implementierungsdetails sind Vertiefung.", "rationale": "Kern ist das Prinzip von Approval-Bindung, Änderungserkennung und Ablauf, nicht die konkrete Oberfläche."}}, "lab_validation": [{"lab_id": "KB-0289-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell eines Human Gates mit Approval-Bindung, Änderungserkennung und Ablauf", "evidence": "Eine Freigabe, die an einen Hash der konkreten Aktion gebunden ist, wird bei nachträglicher Änderung der Aktion ungültig; eine abgelaufene Freigabe wird bei verspäteter Ausführung abgelehnt.", "limitations": "Kein echtes Approval-System, kein produktives System, keine reale langlebige Ausführung getestet."}]}
---
# Human Gates für Agentenaktionen

> **Ziel:** Ein Human Gate stellt eine konkrete Aktion mit ihrem Ziel und ihren Folgen explizit zur Freigabe dar, aufbauend auf Autoritätsgrenzen (siehe [KB-0288](14-autoritaet-und-minimale-berechtigungen.md)). Die Freigabe muss eindeutig an genau diese Aktion gebunden sein (Approval-Bindung), eine nachträgliche Änderung der Aktion nach Freigabe muss erkannt werden (Änderungserkennung), und eine Freigabe muss bei langlebigen Runs nach angemessener Zeit ablaufen — sonst verliert das Human Gate seinen eigentlichen Zweck als Kontrollpunkt.

## Zweck, Mental Model und Dependencies

Ein Human Gate unterbricht einen Agentenablauf an einem definierten Punkt und stellt die konkret geplante Aktion, ihr Ziel und ihre erwarteten Folgen einem Menschen zur expliziten Freigabe dar — im Gegensatz zu einer pauschalen Vorab-Autorisierung, bei der ein Mensch dem Agenten allgemein erlaubt, in einem bestimmten Rahmen zu handeln, ohne die konkrete Einzelaktion zu sehen. Approval-Bindung bedeutet, dass die erteilte Freigabe kryptografisch oder strukturell eindeutig an die exakt dargestellte Aktion gebunden ist (z. B. über einen Hash der Aktionsparameter) — ohne diese Bindung könnte ein Agent eine leicht abgewandelte oder komplett andere Aktion unter Berufung auf dieselbe Freigabe ausführen. Änderungserkennung stellt sicher, dass jede Abweichung zwischen der zur Freigabe dargestellten Aktion und der tatsächlich zur Ausführung anstehenden Aktion erkannt wird, bevor die Ausführung stattfindet — dies ist besonders relevant, wenn zwischen Freigabe und Ausführung Zeit vergeht, in der sich Kontext oder Parameter ändern könnten. Ablauf bei langlebigen Runs bedeutet, dass eine Freigabe nicht unbegrenzt gültig bleibt: Bei einem Agentenablauf, der über Stunden oder Tage läuft, muss eine zu einem frühen Zeitpunkt erteilte Freigabe nach einer angemessenen Frist ungültig werden, da sich die Umstände inzwischen relevant geändert haben könnten.

~~~text
Human Gate: pauses agent flow, presents CONCRETE action + goal + consequences for explicit approval
  (NOT blanket pre-authorization without seeing the specific action)
Approval binding: approval cryptographically/structurally bound to EXACT action (e.g. hash of parameters)
  -> without binding: agent could execute a SLIGHTLY DIFFERENT action under same approval
Change detection: detect ANY deviation between approved action and action about to execute, BEFORE execution
Expiry on long-running executions: approval must NOT stay valid indefinitely
  -> circumstances can change relevantly over hours/days of a long-running run
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Konkrete Aktionsdarstellung statt pauschaler Vorab-Autorisierung | wird bei jedem Human Gate die tatsächlich konkrete Aktion mit Ziel und Folgen dargestellt, statt nur ein allgemeines "Fortfahren" abzufragen? | eine pauschale Freigabe ohne konkrete Aktionsdarstellung gibt dem Menschen keine echte Kontrolle über die tatsächliche Handlung |
| Kryptografische oder strukturelle Approval-Bindung | ist die Freigabe eindeutig an die exakten Parameter der dargestellten Aktion gebunden? | ohne Bindung kann eine abgewandelte Aktion unter Berufung auf dieselbe Freigabe ausgeführt werden |
| Änderungserkennung vor Ausführung | wird unmittelbar vor Ausführung geprüft, ob die Aktion noch exakt der freigegebenen Aktion entspricht? | eine unerkannte Änderung zwischen Freigabe und Ausführung kann eine nicht tatsächlich freigegebene Aktion ausführen lassen |
| Zeitlich begrenzte Gültigkeit der Freigabe | läuft eine erteilte Freigabe nach einer angemessenen Frist automatisch ab? | eine unbegrenzt gültige Freigabe kann bei langlebigen Runs auf inzwischen veralteten Umständen basieren |

Implementierung: Jedes Human Gate stellt die konkret geplante Aktion mit ihren tatsächlichen Parametern, dem beabsichtigten Ziel und den erwarteten Folgen dar, statt eine generische Bestätigungsanfrage zu stellen. Die erteilte Freigabe wird strukturell (z. B. über einen Hash der Aktionsparameter) an genau diese Aktion gebunden. Unmittelbar vor Ausführung wird geprüft, ob die auszuführende Aktion exakt der freigegebenen Aktion entspricht — bei jeder Abweichung wird die Ausführung abgebrochen und eine erneute Freigabe eingeholt. Jede Freigabe erhält eine explizite Gültigkeitsfrist, nach deren Ablauf sie automatisch ungültig wird und bei Bedarf erneut eingeholt werden muss.

## Scalability, Reliability, Security und Observability

Human Gates skalieren Kontrolle über folgenreiche Aktionen proportional zur Sorgfalt der Approval-Bindung und Änderungserkennung; die Reliability-Grenze liegt in einer Freigabe, die nicht eindeutig an die konkrete Aktion gebunden ist oder unbegrenzt gültig bleibt — beide Fälle untergraben den eigentlichen Kontrollzweck des Gates.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine ausgeführte Aktion weicht von der ursprünglich zur Freigabe dargestellten Aktion ab | fehlende Änderungserkennung zwischen Freigabe und Ausführung | prüfen, ob unmittelbar vor Ausführung ein Abgleich zwischen freigegebener und tatsächlicher Aktion stattgefunden hat |
| eine Aktion wird auf Basis einer sehr alten Freigabe bei einem langlebigen Run ausgeführt | fehlender Ablaufmechanismus für die Gültigkeit der Freigabe | prüfen, ob die verwendete Freigabe zum Ausführungszeitpunkt noch innerhalb ihrer Gültigkeitsfrist lag |
| eine leicht abgewandelte Aktion wird unter Berufung auf eine bestehende Freigabe ausgeführt | fehlende oder unzureichende Approval-Bindung an die exakten Aktionsparameter | prüfen, ob die Freigabe strukturell an die exakten Parameter der ursprünglich dargestellten Aktion gebunden war |

Security: Ein Human Gate ohne robuste Approval-Bindung und Änderungserkennung bietet nur die Illusion menschlicher Kontrolle — ein Agent oder ein manipulierter Zwischenschritt könnte die tatsächlich ausgeführte Aktion von der freigegebenen Aktion abweichen lassen, ohne dass dies bemerkt wird. Observability: Häufigkeit erkannter Abweichungen zwischen freigegebener und tatsächlicher Aktion, Häufigkeit abgelaufener, aber noch angeforderter Freigaben und durchschnittliche Zeitspanne zwischen Freigabe und Ausführung sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert für jedes Human Gate eine strukturelle Approval-Bindung und eine Änderungserkennung vor Ausführung. **Principal** macht Platzierung und Ablaufregeln von Human Gates für das Team nachvollziehbar dokumentiert. **Chief** positioniert Human Gates als gezieltes Kontrollinstrument für Aktionen mit erheblicher Folgenreichweite, nicht als generische Verlangsamung jedes Agentenablaufs.

Anti-Patterns: ein Human Gate mit pauschaler Vorab-Autorisierung statt konkreter Aktionsdarstellung implementieren; eine Freigabe ohne strukturelle Bindung an die exakten Aktionsparameter erteilen; Freigaben ohne Ablaufmechanismus unbegrenzt gültig lassen.

## Production Checklist

- [ ] Jedes Human Gate stellt die konkrete Aktion mit Ziel und Folgen dar.
- [ ] Jede Freigabe ist strukturell an die exakten Aktionsparameter gebunden.
- [ ] Unmittelbar vor Ausführung wird eine Änderungserkennung gegen die freigegebene Aktion durchgeführt.
- [ ] Jede Freigabe hat eine explizite, technisch durchgesetzte Gültigkeitsfrist.

## Interviewfragen

### 1. Warum ist eine konkrete Aktionsdarstellung besser als eine pauschale Vorab-Autorisierung?

**Antwort:** Eine pauschale Autorisierung gibt dem Menschen keine echte Kontrolle über die tatsächliche Einzelaktion; eine konkrete Darstellung mit Ziel und Folgen ermöglicht eine informierte, gezielte Freigabeentscheidung.

### 2. Was ist Approval-Bindung, und warum ist sie notwendig?

**Antwort:** Sie bindet eine erteilte Freigabe strukturell an die exakten Parameter der dargestellten Aktion; ohne diese Bindung könnte eine abgewandelte Aktion unter Berufung auf dieselbe Freigabe ausgeführt werden.

### 3. Warum ist Änderungserkennung unmittelbar vor Ausführung notwendig?

**Antwort:** Zwischen Freigabe und tatsächlicher Ausführung kann Zeit vergehen, in der sich Kontext oder Parameter ändern; eine Prüfung unmittelbar vor Ausführung stellt sicher, dass die Aktion noch der freigegebenen Aktion entspricht.

### 4. Warum sollten Freigaben bei langlebigen Runs ablaufen?

**Antwort:** Eine früh erteilte Freigabe kann bei einem über Stunden oder Tage laufenden Prozess auf inzwischen veralteten Umständen basieren; ein Ablaufmechanismus erzwingt eine erneute, aktuelle Freigabeentscheidung.

### 5. Wie diagnostizierst du, dass ein Human Gate seinen Kontrollzweck nicht erfüllt hat?

**Antwort:** Ich prüfe, ob die tatsächlich ausgeführte Aktion exakt der zur Freigabe dargestellten Aktion entsprach und ob die verwendete Freigabe zum Ausführungszeitpunkt noch gültig war — eine Abweichung oder eine abgelaufene Freigabe deutet auf ein unzureichend implementiertes Gate hin.

### 6. Widersprüchliche Anforderung: Team will minimale Unterbrechung des Agentenablaufs durch Human Gates UND garantiert keine Ausführung ohne aktuell gültige, exakt gebundene Freigabe — wie gehst du vor?

**Antwort:** Ich würde erklären, dass beide Ziele vereinbar sind, wenn Human Gates gezielt nur an Punkten mit tatsächlich erheblicher Folgenreichweite platziert werden, statt bei jeder trivialen Aktion; ich würde vorschlagen, die Anzahl der Gates anhand der Folgenreichweite zu minimieren, dabei aber für jedes verbleibende Gate die volle Approval-Bindung, Änderungserkennung und Ablaufregelung konsequent durchzusetzen.

## Praktische Labs

~~~python
# Human Gate with approval binding, change detection, and expiry
import hashlib
import time

def compute_action_hash(action_params):
    return hashlib.sha256(str(sorted(action_params.items())).encode()).hexdigest()

def request_approval(action_params, ttl_seconds=300):
    action_hash = compute_action_hash(action_params)
    return {"action_hash": action_hash, "approved_at": time.time(), "ttl_seconds": ttl_seconds}

def execute_with_gate(action_params, approval, now):
    if now - approval["approved_at"] > approval["ttl_seconds"]:
        raise PermissionError("Approval expired — must re-request before executing")
    current_hash = compute_action_hash(action_params)
    if current_hash != approval["action_hash"]:
        raise PermissionError("Change detected: action no longer matches approved action")
    return f"Executing approved action: {action_params}"

action = {"type": "delete_customer_record", "customer_id": 4821}
approval = request_approval(action, ttl_seconds=60)

result = execute_with_gate(action, approval, now=approval["approved_at"] + 10)
print(result)

modified_action = {"type": "delete_customer_record", "customer_id": 9999}
try:
    execute_with_gate(modified_action, approval, now=approval["approved_at"] + 10)
except PermissionError as e:
    print(f"Caught: {e}")

try:
    execute_with_gate(action, approval, now=approval["approved_at"] + 120)
except PermissionError as e:
    print(f"Caught: {e}")
~~~

## Dependencies, Cross-References und Quellen

1. Anthropic: [Building Effective AI Agents — Human-in-the-Loop](https://www.anthropic.com/engineering/building-effective-agents), abgerufen 2026-09-17.
2. OWASP: [OWASP Top 10 for LLM Applications — Excessive Agency](https://genai.owasp.org/llmrisk/llm08-excessive-agency/), abgerufen 2026-09-17.
3. FIDO Alliance: [Transaction Confirmation and Signing](https://fidoalliance.org/specifications/), abgerufen 2026-09-17.

Autorität und minimale Berechtigungen sind kanonisch in [KB-0288](14-autoritaet-und-minimale-berechtigungen.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Kryptografisch signierte Approval-Tokens mit eingebettetem Aktionshash und Ablaufzeit als Standardmuster für Human Gates | Adopting | Gegenüber ungebundenen, textbasierten Freigaben für robuste Approval-Bindung bevorzugen. |
| Strukturierte Folgenreichweiten-Klassifizierung, die automatisch bestimmt, welche Aktionen ein Human Gate benötigen | Emerging | Beobachten; würde die Platzierungsentscheidung objektivieren, aber noch keine breit etablierte Methodik. |

Ein Team akzeptiert eine Human-Gate-Architektur erst, wenn Approval-Bindung, Änderungserkennung und Ablaufregelung dokumentiert und getestet sind.
