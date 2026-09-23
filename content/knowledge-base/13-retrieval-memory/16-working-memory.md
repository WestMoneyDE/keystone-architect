---
{"id": "KB-0320", "title": "Working Memory", "domain": "13", "sequence": 16, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0297", "concepts": ["Agent Memory als Laufzeitintegration"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Working-Memory-Modell implementieren, das veraltete Fakten erkennt und bei Bedarf explizit zur autoritativen Quelle zurückkehrt, statt sich auf den möglicherweise veralteten Zwischenstand zu verlassen.", "rationale": "Der Wert der Rückkehr zu autoritativen Quellen wird erst durch konkrete Implementierung einer Veraltungserkennung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Working-Memory-Architektur gestalten, die den Aufgabenkontext bewusst begrenzt und explizite Regeln für Überschreiben und Veraltungserkennung definiert, statt Working Memory unbegrenzt wachsen zu lassen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine fehlerhafte Agentenentscheidung auf einen veralteten, nicht aktualisierten Working-Memory-Eintrag statt auf ein allgemeines Kontextproblem zurückführen können.", "rationale": "Ein Agent, der sich auf einen früh im Lauf erfassten Fakt verlässt, der sich seitdem geändert hat, kann eine fehlerhafte Entscheidung treffen, wenn keine Mechanismen zur Veraltungserkennung existieren."}, "CHIEF-TARGET": {"active": true, "scope": "Working Memory als begrenzten, aufgabenspezifischen Kurzzeitkontext positionieren, der explizite Mechanismen zur Rückkehr zu autoritativen Quellen benötigt, nicht als unbegrenzt wachsenden Zwischenspeicher.", "rationale": "Ohne begrenzten Umfang und explizite Veraltungsbehandlung kann Working Memory zu einer Quelle veralteter, fälschlich als aktuell angenommener Information werden."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Working-Memory-Datenstrukturimplementierungen sind Vertiefung.", "rationale": "Kern ist das Prinzip von Begrenzung, Veraltungserkennung und Rückkehr zu autoritativen Quellen, nicht die konkrete Implementierung."}}, "lab_validation": [{"lab_id": "KB-0320-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell eines Working-Memory-Eintrags mit Veraltungserkennung und Rückkehr zur autoritativen Quelle", "evidence": "Ein im Working Memory gespeicherter Fakt, der eine definierte Gültigkeitsdauer überschreitet, wird als veraltet erkannt und durch eine erneute Abfrage der autoritativen Quelle ersetzt, statt weiterhin als aktuell angenommen zu werden.", "limitations": "Keine echte autoritative Quelle, kein produktives System, kein realer Agentenlauf."}]}
---
# Working Memory

> **Ziel:** Working Memory hält den kurzfristigen Aufgabenkontext und aktuelle Fakten während eines Agentenlaufs, aufbauend auf Agent Memory als Laufzeitintegration (siehe [KB-0297](../12-agentic-ai/23-agent-memory-als-laufzeitintegration.md)). Der zentrale Punkt ist, Veraltung (ein im Working Memory erfasster Fakt kann sich seitdem geändert haben) und Überschreiben bewusst zu gestalten, mit einem expliziten Mechanismus zur Rückkehr zu autoritativen Quellen, wenn ein Working-Memory-Eintrag potenziell veraltet ist — statt sich unbegrenzt auf einen möglicherweise veralteten Zwischenstand zu verlassen.

## Zweck, Mental Model und Dependencies

Working Memory unterscheidet sich von episodischem und langfristigem Speicher (siehe [KB-0297](../12-agentic-ai/23-agent-memory-als-laufzeitintegration.md)) dadurch, dass es ausschließlich den kurzfristigen Kontext eines einzelnen, aktuell laufenden Agentenlaufs hält — Fakten, Zwischenergebnisse und Aufgabenzustand, die für die Dauer der aktuellen Aufgabe relevant sind, aber nicht notwendigerweise darüber hinaus. Der zentrale, oft übersehene Risikofaktor ist Veraltung: ein Fakt, der früh im Agentenlauf aus einer autoritativen Quelle abgerufen und im Working Memory gespeichert wurde, kann sich seitdem geändert haben (z. B. ein Lagerbestand, ein Freigabestatus, eine Konfiguration) — wenn der Agent später im selben Lauf weiterhin den ursprünglich gespeicherten, inzwischen veralteten Wert verwendet, kann dies zu einer fehlerhaften Entscheidung führen. Authority Preservation bezeichnet den Mechanismus, der bei potenziell veralteten oder besonders kritischen Fakten explizit zur ursprünglichen, autoritativen Quelle zurückkehrt, um den aktuellen Wert erneut zu verifizieren, statt sich unbegrenzt auf den im Working Memory zwischengespeicherten Wert zu verlassen. Überschreiben von Working-Memory-Einträgen muss ebenfalls bewusst gestaltet werden: wenn ein neuer Wert einen alten überschreibt, sollte nachvollziehbar bleiben, dass eine Aktualisierung stattgefunden hat, statt den alten Wert spurlos zu verlieren, insbesondere wenn eine spätere Entscheidung von der Überschreibungshistorie abhängen könnte.

~~~text
Working memory: SHORT-TERM task context for the CURRENT agent run only (not episodic/long-term, KB-0297)
CRITICAL RISK: staleness -> a fact fetched early in the run may have CHANGED since (stock level, approval status)
  -> using the ORIGINAL cached value later in the SAME run can produce a wrong decision
Authority preservation: for potentially stale/critical facts, EXPLICITLY re-query the authoritative source
  -> don't rely indefinitely on the cached working-memory value
Overwrite: when new value replaces old, keep it TRACEABLE that an update happened, don't silently lose the old value
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Explizite Begrenzung des Working-Memory-Umfangs | ist der Umfang des Working Memory bewusst auf den kurzfristigen Aufgabenkontext begrenzt, statt unbegrenzt zu wachsen? | unbegrenztes Working Memory kann veraltete oder irrelevante Information ansammeln, die den aktuellen Aufgabenkontext verwässert |
| Veraltungserkennung mit definierter Gültigkeitsdauer | ist für kritische Fakten eine Gültigkeitsdauer definiert, nach deren Ablauf eine erneute Verifikation erfolgt? | ohne definierte Gültigkeitsdauer kann ein veralteter Fakt unbegrenzt lange als aktuell angenommen werden |
| Authority Preservation bei kritischen Entscheidungen | wird vor einer folgenreichen Entscheidung explizit zur autoritativen Quelle zurückgekehrt, um den aktuellen Stand zu verifizieren? | ohne diese Rückkehr kann eine kritische Entscheidung auf einem inzwischen veralteten Zwischenstand basieren |
| Nachvollziehbares Überschreiben | bleibt nachvollziehbar, dass ein Working-Memory-Wert überschrieben wurde und was der vorherige Wert war? | ein spurloses Überschreiben kann eine spätere Entscheidung erschweren, die von der Änderungshistorie abhängt |

Implementierung: Working Memory wird explizit auf den kurzfristigen Kontext des aktuellen Agentenlaufs begrenzt, mit einer definierten Lebensdauer, die mit dem Abschluss des Laufs endet, statt in den langfristigen Speicher überzugehen (diese Übergabe erfolgt, falls gewünscht, über eine separate, geprüfte Konsolidierung, siehe [KB-0297](../12-agentic-ai/23-agent-memory-als-laufzeitintegration.md)). Für kritische Fakten wird eine explizite Gültigkeitsdauer definiert, nach deren Ablauf eine erneute Verifikation gegen die autoritative Quelle ausgelöst wird. Vor besonders folgenreichen Entscheidungen wird ein expliziter Authority-Preservation-Schritt eingefügt, der den aktuellen Stand direkt bei der autoritativen Quelle erneut abfragt, statt sich auf den möglicherweise veralteten Working-Memory-Wert zu verlassen. Überschreiben von Working-Memory-Einträgen wird protokolliert, sodass nachvollziehbar bleibt, welcher Wert wann durch welchen neuen Wert ersetzt wurde.

## Scalability, Reliability, Security und Observability

Working Memory skaliert die Effizienz eines Agentenlaufs proportional zur bewussten Begrenzung seines Umfangs; die Reliability-Grenze liegt in fehlender Veraltungserkennung, die mit wachsender Laufdauer eines Agentenprozesses proportional mehr fehlerhafte Entscheidungen auf Basis veralteter Zwischenstände erzeugen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Agent trifft eine Entscheidung basierend auf einem Fakt, der sich seitdem im realen System geändert hat | fehlende Veraltungserkennung oder fehlender Authority-Preservation-Schritt vor der Entscheidung | prüfen, ob vor der betroffenen Entscheidung eine erneute Verifikation gegen die autoritative Quelle stattgefunden hat |
| Working Memory wächst über die Dauer eines langen Agentenlaufs unkontrolliert an | fehlende explizite Begrenzung des Working-Memory-Umfangs auf den tatsächlich relevanten Aufgabenkontext | prüfen, ob eine explizite Begrenzungs- oder Bereinigungslogik für Working-Memory-Einträge existiert |
| eine spätere Entscheidung lässt sich nicht nachvollziehen, weil unklar ist, welcher Wert zu welchem Zeitpunkt im Working Memory galt | fehlende Protokollierung von Überschreibungen im Working Memory | prüfen, ob Überschreibungen von Working-Memory-Einträgen mit Zeitstempel und vorherigem Wert protokolliert wurden |

Security: Working Memory, das im Rahmen einer Aufgabe sensible Zwischenergebnisse hält, sollte nach Abschluss des Agentenlaufs zuverlässig bereinigt werden, um zu verhindern, dass sensible Daten unbeabsichtigt über die Dauer der eigentlichen Aufgabe hinaus im Speicher verbleiben. Observability: Häufigkeit ausgelöster Authority-Preservation-Rückfragen, durchschnittliche Größe des Working Memory über die Laufzeit eines Agentenprozesses und Häufigkeit erkannter veralteter Fakten sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert für kritische Fakten eine explizite Gültigkeitsdauer mit Authority-Preservation-Rückfrage. **Principal** macht die Begrenzung des Working-Memory-Umfangs für das Team nachvollziehbar dokumentiert. **Chief** positioniert Working Memory als begrenzten, aufgabenspezifischen Kurzzeitkontext mit expliziter Veraltungsbehandlung.

Anti-Patterns: Working Memory unbegrenzt über die Dauer eines Agentenlaufs wachsen lassen; kritische Fakten ohne definierte Gültigkeitsdauer unbegrenzt als aktuell annehmen; Überschreibungen von Working-Memory-Werten spurlos ohne Protokollierung vornehmen.

## Production Checklist

- [ ] Der Umfang des Working Memory ist explizit auf den kurzfristigen Aufgabenkontext begrenzt.
- [ ] Kritische Fakten haben eine definierte Gültigkeitsdauer mit Verifikationsauslöser.
- [ ] Vor folgenreichen Entscheidungen erfolgt ein expliziter Authority-Preservation-Schritt.
- [ ] Überschreibungen von Working-Memory-Einträgen sind nachvollziehbar protokolliert.

## Interviewfragen

### 1. Was unterscheidet Working Memory von episodischem und langfristigem Speicher?

**Antwort:** Working Memory hält ausschließlich den kurzfristigen Kontext des aktuell laufenden Agentenlaufs, während episodischer und langfristiger Speicher über einzelne Läufe hinaus akkumuliertes Wissen betreffen.

### 2. Was ist Authority Preservation, und wann sollte sie ausgelöst werden?

**Antwort:** Ein Mechanismus, der bei potenziell veralteten oder besonders kritischen Fakten explizit zur ursprünglichen, autoritativen Quelle zurückkehrt, um den aktuellen Wert erneut zu verifizieren — sie sollte vor folgenreichen Entscheidungen ausgelöst werden, die von diesem Fakt abhängen.

### 3. Warum ist Veraltung ein spezifisches Risiko für Working Memory?

**Antwort:** Ein früh im Agentenlauf gespeicherter Fakt kann sich seitdem im realen System geändert haben; ohne Veraltungserkennung kann der Agent später weiterhin den ursprünglichen, inzwischen falschen Wert verwenden.

### 4. Warum sollte das Überschreiben von Working-Memory-Einträgen protokolliert werden?

**Antwort:** Ohne Protokollierung geht die Information verloren, dass eine Aktualisierung stattgefunden hat, was eine spätere Entscheidung erschweren kann, die von der Änderungshistorie abhängt.

### 5. Wie diagnostizierst du eine fehlerhafte Agentenentscheidung aufgrund veralteter Working-Memory-Information?

**Antwort:** Ich prüfe, ob vor der betroffenen Entscheidung eine erneute Verifikation gegen die autoritative Quelle (Authority Preservation) stattgefunden hat — fehlt sie, ist ein veralteter Zwischenstand die wahrscheinlichste Ursache.

### 6. Widersprüchliche Anforderung: Team will minimale zusätzliche Latenz durch möglichst wenige Rückfragen an autoritative Quellen UND garantiert keine Entscheidung auf Basis veralteter Fakten — wie gehst du vor?

**Antwort:** Ich würde erklären, dass diese Ziele sich direkt widersprechen, wenn Rückfragen komplett vermieden werden; ich würde vorschlagen, Authority-Preservation-Rückfragen gezielt nur vor tatsächlich folgenreichen Entscheidungen und für Fakten mit kurzer, definierter Gültigkeitsdauer auszulösen, statt bei jeder Nutzung eines Working-Memory-Werts pauschal erneut zu verifizieren.

## Praktische Labs

~~~python
# Working memory with staleness detection and authority preservation
import time

working_memory = {}

def store_fact(key, value, ttl_seconds, now):
    working_memory[key] = {"value": value, "stored_at": now, "ttl_seconds": ttl_seconds}

def get_fact_with_authority_preservation(key, now, authoritative_source_fn):
    entry = working_memory.get(key)
    if entry is None or now - entry["stored_at"] > entry["ttl_seconds"]:
        fresh_value = authoritative_source_fn(key)
        store_fact(key, fresh_value, entry["ttl_seconds"] if entry else 60, now)
        return fresh_value, "re-verified against authoritative source (stale or missing)"
    return entry["value"], "used cached working-memory value (still fresh)"

def mock_authoritative_source(key):
    return "APPROVED"  # simulates a fresh lookup

start = time.time()
store_fact("approval_status", "PENDING", ttl_seconds=30, now=start)

value_early, msg_early = get_fact_with_authority_preservation("approval_status", now=start + 5, authoritative_source_fn=mock_authoritative_source)
print(f"Early in run: {value_early} ({msg_early})")

value_late, msg_late = get_fact_with_authority_preservation("approval_status", now=start + 45, authoritative_source_fn=mock_authoritative_source)
print(f"Later in run (past TTL): {value_late} ({msg_late})")
~~~

## Dependencies, Cross-References und Quellen

1. LangChain: [LangGraph — Memory Concepts](https://langchain-ai.github.io/langgraph/concepts/memory/), abgerufen 2026-09-17.
2. Anthropic: [Building Effective AI Agents](https://www.anthropic.com/engineering/building-effective-agents), abgerufen 2026-09-17.
3. NIST: [SP 800-92 — Guide to Computer Security Log Management](https://csrc.nist.gov/pubs/sp/800/92/final), abgerufen 2026-09-17.

Agent Memory als Laufzeitintegration ist kanonisch in [KB-0297](../12-agentic-ai/23-agent-memory-als-laufzeitintegration.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Staleness-Annotation, die jedem Working-Memory-Eintrag eine geschätzte Verlässlichkeitsdauer basierend auf der Datenquelle zuweist | Emerging | Beobachten; würde manuelle TTL-Konfiguration ergänzen, aber noch nicht breit etabliert. |
| Ereignisgesteuerte Invalidierung, bei der autoritative Quellen aktiv Änderungsbenachrichtigungen an laufende Agentenprozesse senden, statt auf Ablauf einer TTL zu warten | Emerging | Beobachten; würde proaktive statt reaktive Veraltungserkennung ermöglichen, aber Infrastrukturreife noch nicht ausreichend belegt. |

Ein Team akzeptiert eine Working-Memory-Architektur erst, wenn Umfangsbegrenzung, Veraltungserkennung und Authority-Preservation-Mechanismen dokumentiert und getestet sind.
