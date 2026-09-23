---
{"id": "KB-0283", "title": "Tool Use und Ergebnisverträge", "domain": "12", "sequence": 9, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0247", "concepts": ["Function Calling"], "needed_for": "understanding"}, {"id": "KB-0275", "concepts": ["Agentenschleifen"], "needed_for": "understanding"}], "related": ["KB-0282"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Ergebnisvertrag mit explizitem Status (Erfolg, partieller Erfolg, Fehler) implementieren, der eine idempotente Wiederholung im Agentenloop ermöglicht.", "rationale": "Der Wert eines expliziten Ergebnisvertrags wird erst durch konkrete Implementierung idempotenter Wiederholungslogik greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein Vertragsschema für Tool-Ergebnisse gestalten, das partielle Erfolge von vollständigen Erfolgen und Fehlern unterscheidbar macht.", "rationale": "Ein binäres Erfolg/Fehler-Schema reicht nicht aus, um reale Tool-Ausführungen mit partiellem Erfolg korrekt im Agentenloop zu behandeln."}, "STAFF-TARGET": {"active": true, "scope": "Eine doppelte Ausführung einer nicht-idempotenten Aktion auf eine fehlende Idempotenzsicherung bei Wiederholung statt auf ein allgemeines Zuverlässigkeitsproblem zurückführen können.", "rationale": "Ohne explizite Idempotenzsicherung führt eine Wiederholung nach einem unklaren Ergebnisstatus zu doppelter Ausführung nicht-idempotenter Aktionen."}, "CHIEF-TARGET": {"active": true, "scope": "Ergebnisverträge als notwendige Vertrauensgrundlage für agentische Toolausführung positionieren, insbesondere wenn Rückgaben aus untrusted Quellen stammen.", "rationale": "Ohne verlässliche Ergebnisverträge kann ein Agentenloop nicht zuverlässig zwischen echtem Erfolg, partiellem Erfolg und Fehler unterscheiden, was zu fehlerhaften Folgeentscheidungen führt."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Framework-spezifische Retry-Bibliotheken sind Vertiefung.", "rationale": "Kern ist das Prinzip expliziter Ergebnisverträge und Idempotenzsicherung, nicht die konkrete Bibliotheksimplementierung."}}, "lab_validation": [{"lab_id": "KB-0283-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell eines Tool-Ergebnisvertrags mit explizitem Status und Idempotenzschlüssel für Wiederholungen", "evidence": "Eine Wiederholung ohne Idempotenzschlüssel führt bei einer simulierten nicht-idempotenten Aktion zu doppelter Ausführung; ein Idempotenzschlüssel verhindert dies zuverlässig.", "limitations": "Kein echtes Tool, kein echtes Modell, kein produktives System."}]}
---
# Tool Use und Ergebnisverträge

> **Ziel:** Ein Ergebnisvertrag definiert Werkzeugauswahl, Argumente und einen expliziten Ergebnisstatus (Erfolg, partieller Erfolg, Fehler) für jede Toolausführung im Agentenloop (siehe [KB-0275](01-agentenschleifen.md)). Ohne diesen Vertrag kann ein Agent Rückgaben aus untrusted Quellen nicht zuverlässig interpretieren, partielle Erfolge nicht von vollständigen Erfolgen unterscheiden und Wiederholungen nicht sicher (idempotent) durchführen.

## Zweck, Mental Model und Dependencies

Werkzeugauswahl und Argumente sind bereits aus der Funktionsaufruf-Grundlage (siehe [KB-0247](../11-genai-architecture/07-function-calling.md)) bekannt; ein Ergebnisvertrag erweitert dieses Konzept um die Rückgabeseite — er definiert explizit, in welchem Format und mit welchem Status ein Tool-Ergebnis an den Agentenloop zurückgegeben wird. Der zentrale, oft unterschätzte Punkt ist, dass Tool-Rückgaben aus Sicht des Agentenloops grundsätzlich als untrusted zu behandeln sind — ein externes System kann fehlerhafte, unvollständige oder sogar manipulierte Daten zurückliefern, und der Agentenloop muss in der Lage sein, dies vom erwarteten Erfolgsfall zu unterscheiden. Partielle Erfolge (z. B. eine Batch-Operation, bei der nur ein Teil der Elemente erfolgreich verarbeitet wurde) benötigen einen eigenen Status, der sich von einem vollständigen Erfolg und einem vollständigen Fehler unterscheidet — ein binäres Erfolg/Fehler-Schema verliert diese Information und kann zu falschen Folgeentscheidungen des Agenten führen. Idempotente Wiederholungen sind notwendig, weil ein Agentenloop bei unklarem Ergebnisstatus (z. B. Timeout ohne Antwort) eine Aktion erneut versuchen muss — ohne einen Idempotenzschlüssel oder eine äquivalente Sicherung kann diese Wiederholung eine nicht-idempotente Aktion (z. B. eine Zahlung oder eine E-Mail-Versendung) unbeabsichtigt doppelt ausführen.

~~~text
Tool selection + arguments: known from function calling (KB-0247)
Result contract adds: EXPLICIT status field on the RETURN side
Tool returns are UNTRUSTED by default: external system can return malformed/incomplete/manipulated data
Status must distinguish: SUCCESS vs PARTIAL_SUCCESS vs FAILURE (binary success/fail loses information)
Retry after unclear status (e.g. timeout) needs IDEMPOTENCY KEY
  -> without it: retry can DOUBLE-EXECUTE a non-idempotent action (payment, email)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Explizites Ergebnisstatus-Schema | unterscheidet der Ergebnisvertrag explizit zwischen Erfolg, partiellem Erfolg und Fehler? | ein binäres Schema verliert Information über partielle Erfolge und führt zu falschen Folgeentscheidungen |
| Untrusted-Rückgabe-Validierung | wird jede Tool-Rückgabe vor Weiterverarbeitung im Agentenloop strukturell validiert? | eine ungeprüfte Rückgabe kann fehlerhafte oder manipulierte Daten in die Folgeentscheidung des Agenten einschleusen |
| Idempotenzschlüssel bei Wiederholung | erhält jede Toolausführung, die wiederholt werden könnte, einen eindeutigen Idempotenzschlüssel? | ohne Idempotenzschlüssel kann eine Wiederholung eine nicht-idempotente Aktion doppelt ausführen |
| Partieller-Erfolg-Behandlung | ist definiert, wie der Agentenloop auf einen partiellen Erfolg reagiert (z. B. nur die fehlgeschlagenen Teilelemente wiederholen)? | fehlende Behandlung partieller Erfolge kann zu vollständiger, unnötiger Wiederholung oder zu übersehenen Teilfehlern führen |

Implementierung: Jeder Ergebnisvertrag definiert ein explizites Status-Feld mit mindestens den Werten Erfolg, partieller Erfolg und Fehler, sowie strukturierte Detailinformationen zum jeweiligen Status (z. B. welche Teilelemente bei einem partiellen Erfolg betroffen sind). Jede Tool-Rückgabe wird vor Weiterverarbeitung strukturell validiert (Schema-Prüfung), bevor sie in die Entscheidungslogik des Agentenloops einfließt. Jede Toolausführung, die eine nicht-idempotente Aktion auslöst, erhält einen eindeutigen Idempotenzschlüssel, der bei einer Wiederholung an das Zielsystem übergeben wird, damit dieses eine bereits ausgeführte Aktion erkennen und nicht doppelt ausführen kann. Bei einem partiellen Erfolg wird gezielt nur der fehlgeschlagene Teil wiederholt, statt die gesamte Operation erneut vollständig auszuführen.

## Scalability, Reliability, Security und Observability

Ein explizites Ergebnisvertragsschema skaliert Zuverlässigkeit proportional zur Sorgfalt der Statusdefinition; die Reliability-Grenze liegt in nicht-idempotenten Aktionen ohne Idempotenzschlüssel, bei denen jede Wiederholung nach unklarem Status ein reales Risiko doppelter Ausführung darstellt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine nicht-idempotente Aktion (z. B. eine Zahlung) wurde unerwartet doppelt ausgeführt | fehlender Idempotenzschlüssel bei einer Wiederholung nach unklarem Ergebnisstatus | prüfen, ob die betroffene Toolausführung einen eindeutigen Idempotenzschlüssel verwendet hat |
| der Agentenloop trifft nach einer Batch-Operation eine falsche Folgeentscheidung | partieller Erfolg wurde durch ein binäres Erfolg/Fehler-Schema als vollständiger Erfolg oder vollständiger Fehler fehlinterpretiert | prüfen, ob der Ergebnisvertrag einen expliziten Status für partiellen Erfolg vorsieht |
| eine fehlerhafte oder manipulierte Tool-Rückgabe beeinflusst eine kritische Agentenentscheidung | fehlende strukturelle Validierung der Tool-Rückgabe vor Weiterverarbeitung | prüfen, ob die betroffene Rückgabe vor Verarbeitung einer Schema-Validierung unterzogen wurde |

Security: Untrusted Tool-Rückgaben können, ähnlich wie Prompt-Injection-Risiken bei Werkzeugausgaben, versuchen, den Agentenloop über manipulierte Statusinformationen zu falschen Folgeentscheidungen zu bewegen — strukturelle Validierung ist daher auch eine Sicherheitsmaßnahme, nicht nur eine Datenqualitätsmaßnahme. Observability: Häufigkeit partieller Erfolge pro Toolart, Häufigkeit von Wiederholungen mit Idempotenzschlüssel-Treffern (erkannte bereits ausgeführte Aktionen) und Häufigkeit fehlgeschlagener struktureller Validierungen sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert für jede Toolausführung, die wiederholt werden könnte, einen Idempotenzschlüssel. **Principal** macht das Ergebnisvertragsschema mit seinen Statuswerten für das Team nachvollziehbar dokumentiert. **Chief** positioniert Ergebnisverträge als notwendige Vertrauensgrundlage für agentische Toolausführung, insbesondere bei Rückgaben aus untrusted Quellen.

Anti-Patterns: ein binäres Erfolg/Fehler-Schema für Toolausführungen mit möglichem partiellem Erfolg verwenden; Toolausführungen ohne Idempotenzschlüssel wiederholen; Tool-Rückgaben ungeprüft in die Entscheidungslogik des Agentenloops einfließen lassen.

## Production Checklist

- [ ] Der Ergebnisvertrag unterscheidet explizit zwischen Erfolg, partiellem Erfolg und Fehler.
- [ ] Jede Tool-Rückgabe wird vor Weiterverarbeitung strukturell validiert.
- [ ] Jede wiederholbare, nicht-idempotente Toolausführung verwendet einen eindeutigen Idempotenzschlüssel.
- [ ] Partielle Erfolge lösen eine gezielte Wiederholung nur des fehlgeschlagenen Teils aus.

## Interviewfragen

### 1. Warum reicht ein binäres Erfolg/Fehler-Schema für Tool-Ergebnisse oft nicht aus?

**Antwort:** Reale Tool-Ausführungen (z. B. Batch-Operationen) können partiell erfolgreich sein; ein binäres Schema verliert diese Information und kann zu falschen Folgeentscheidungen des Agenten führen.

### 2. Warum sind Tool-Rückgaben aus Sicht des Agentenloops grundsätzlich untrusted?

**Antwort:** Ein externes System kann fehlerhafte, unvollständige oder manipulierte Daten zurückliefern; der Agentenloop muss dies durch strukturelle Validierung von einem erwarteten Erfolgsfall unterscheiden können.

### 3. Warum ist ein Idempotenzschlüssel bei Wiederholungen notwendig?

**Antwort:** Bei unklarem Ergebnisstatus (z. B. Timeout) muss eine Aktion möglicherweise wiederholt werden; ohne Idempotenzschlüssel kann eine nicht-idempotente Aktion dadurch unbeabsichtigt doppelt ausgeführt werden.

### 4. Wie behandelst du einen partiellen Erfolg im Agentenloop korrekt?

**Antwort:** Der Ergebnisvertrag liefert strukturierte Detailinformationen darüber, welche Teilelemente fehlgeschlagen sind; der Agentenloop wiederholt gezielt nur diese fehlgeschlagenen Teile, statt die gesamte Operation erneut auszuführen.

### 5. Wie diagnostizierst du eine unerwartete doppelte Ausführung einer Aktion?

**Antwort:** Ich prüfe, ob die betroffene Toolausführung einen eindeutigen Idempotenzschlüssel verwendet hat — fehlt er, war eine Wiederholung nach unklarem Status die wahrscheinlichste Ursache für die doppelte Ausführung.

### 6. Widersprüchliche Anforderung: Team will maximale Ausführungsgeschwindigkeit ohne Wartezeit auf Idempotenz-Bestätigung UND garantiert keine doppelten Ausführungen bei Wiederholung — wie gehst du vor?

**Antwort:** Ich würde erklären, dass Idempotenzsicherung nicht zwingend eine synchrone Bestätigung vor Fortsetzung erfordert — ein Idempotenzschlüssel kann asynchron im Zielsystem geprüft werden, während der Agentenloop bereits fortfährt; ich würde vorschlagen, den Idempotenzschlüssel bei jeder Anfrage mitzusenden und dem Zielsystem die Deduplizierung zu überlassen, statt auf eine explizite Vorab-Bestätigung zu warten.

## Praktische Labs

~~~python
# Explicit result contract with status + idempotency key for safe retries
import uuid

executed_actions = {}  # simulates the target system's idempotency store

def execute_payment(amount, idempotency_key):
    if idempotency_key in executed_actions:
        return {"status": "success", "detail": "already_executed", "amount": executed_actions[idempotency_key]}
    executed_actions[idempotency_key] = amount
    return {"status": "success", "detail": "executed", "amount": amount}

def execute_batch(items):
    results = {"succeeded": [], "failed": []}
    for item in items:
        if item % 2 == 0:  # simulate arbitrary partial failure
            results["succeeded"].append(item)
        else:
            results["failed"].append(item)
    status = "success" if not results["failed"] else ("partial_success" if results["succeeded"] else "failure")
    return {"status": status, "detail": results}

idempotency_key = str(uuid.uuid4())
first_call = execute_payment(100, idempotency_key)
retry_after_timeout = execute_payment(100, idempotency_key)  # same key -> no double execution
print(f"First call: {first_call}")
print(f"Retry with same idempotency key: {retry_after_timeout}")
assert len(executed_actions) == 1

batch_result = execute_batch([1, 2, 3, 4, 5])
print(f"Batch result: {batch_result}")
assert batch_result["status"] == "partial_success"
print("Explicit status distinguishes partial success from full success/failure; idempotency key prevents double execution.")
~~~

## Dependencies, Cross-References und Quellen

1. Anthropic: [Building Effective AI Agents — Tool Use](https://www.anthropic.com/engineering/building-effective-agents), abgerufen 2026-09-17.
2. Stripe: [Idempotent Requests](https://docs.stripe.com/api/idempotent_requests), abgerufen 2026-09-17.
3. OWASP: [OWASP Top 10 for LLM Applications — Insecure Output Handling](https://genai.owasp.org/llmrisk/llm05-improper-output-handling/), abgerufen 2026-09-17.

Function Calling ist kanonisch in [KB-0247](../11-genai-architecture/07-function-calling.md) behandelt; Agentenschleifen in [KB-0275](01-agentenschleifen.md); OpenAI Agents SDK/Harness in [KB-0282](08-openai-agents-sdk-und-harness.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte Tool-Ergebnisschemata mit eingebauten Status- und Idempotenzfeldern über Frameworks hinweg | Emerging | Beobachten; würde Interoperabilität zwischen Agent-Frameworks verbessern, aber noch nicht breit standardisiert. |
| Automatisierte Idempotenzschlüssel-Generierung und -Verwaltung durch das Agent-Framework selbst | Adopting | Gegenüber manueller Schlüsselverwaltung für Konsistenz und geringeres Fehlerpotenzial bevorzugen. |

Ein Team akzeptiert eine Tool-Use-Architektur erst, wenn Ergebnisverträge mit explizitem Status, struktureller Validierung und Idempotenzsicherung dokumentiert und getestet sind.
