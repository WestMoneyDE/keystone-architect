---
{"id": "KB-0293", "title": "A2A und Interoperabilität", "domain": "12", "sequence": 19, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0278", "concepts": ["Multi-Agent-Zusammenarbeit"], "needed_for": "understanding"}, {"id": "KB-0292", "concepts": ["MCP und Enterprise-Bereitstellung"], "needed_for": "comparison"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen minimalen Task-Lifecycle mit expliziter Protokollkonformitätsprüfung für die Kommunikation mit einem fremden Agenten implementieren.", "rationale": "Der Unterschied zwischen protokollkonformer Interoperabilität und blindem Vertrauen wird erst durch konkrete Implementierung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Entscheiden, welches Vertrauensmodell für die Kommunikation mit einem fremden, extern betriebenen Agenten über A2A angemessen ist.", "rationale": "Ein fremder Agent, mit dem über A2A kommuniziert wird, ist eine eigenständige Vertrauensgrenze, unabhängig von Protokollkonformität."}, "STAFF-TARGET": {"active": true, "scope": "Eine fehlerhafte Interaktion mit einem fremden Agenten auf eine fehlende Versionsaushandlung oder blindes Vertrauen statt auf ein allgemeines Interoperabilitätsproblem zurückführen können.", "rationale": "Protokollkonformität allein garantiert nicht, dass ein fremder Agent vertrauenswürdig oder mit der eigenen Version kompatibel handelt."}, "CHIEF-TARGET": {"active": true, "scope": "A2A-Interoperabilität als Integrationsentscheidung mit eigenem Vertrauens- und Versionsrisiko positionieren, das von reiner Protokollkonformität unabhängig ist.", "rationale": "Ein protokollkonformer fremder Agent ist nicht automatisch vertrauenswürdig; Vertrauen muss separat vom Protokoll bewertet werden."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Nachrichten- und Artefaktformat-Details sind Vertiefung.", "rationale": "Kern ist das Prinzip von Protokollkonformität getrennt von Vertrauen, nicht das konkrete Nachrichtenformat."}}, "lab_validation": [{"lab_id": "KB-0293-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell eines Task-Lifecycles mit Versionsaushandlung und expliziter Vertrauensprüfung für einen fremden Agenten", "evidence": "Eine Nachricht eines fremden Agenten mit inkompatibler Protokollversion wird durch explizite Versionsaushandlung erkannt und abgelehnt, statt stillschweigend verarbeitet zu werden.", "limitations": "Keine echte A2A-Bibliothek, kein echter fremder Agent, kein produktives System; konkrete Protokolldetails müssen vor Nutzung gegen die aktuelle offizielle A2A-Spezifikation verifiziert werden, da sich diese weiterentwickelt."}]}
---
# A2A und Interoperabilität

> **Ziel:** Agent-to-Agent-Protokolle (A2A) definieren einen Task-Lifecycle, Nachrichtenformate und Artefaktaustausch für die Kommunikation zwischen Agenten unterschiedlicher Anbieter oder Systeme, aufbauend auf Multi-Agent-Zusammenarbeit (siehe [KB-0278](04-multi-agent-zusammenarbeit.md)) und im Gegensatz zu MCP (siehe [KB-0292](18-mcp-und-enterprise-bereitstellung.md)), das primär Agent-zu-Tool-Kommunikation adressiert. Der zentrale Punkt ist, Protokollkonformität (der fremde Agent spricht korrekt A2A) strikt von Vertrauen (der fremde Agent handelt tatsächlich im erwarteten Sinne) zu trennen — ein protokollkonformer fremder Agent ist nicht automatisch vertrauenswürdig.

## Zweck, Mental Model und Dependencies

Der Task-Lifecycle beschreibt die Phasen einer Aufgabe, die zwischen zwei über A2A kommunizierenden Agenten ausgetauscht wird (z. B. Erstellung, Fortschrittsmeldungen, Abschluss oder Fehlerstatus). Nachrichten sind die strukturierten Kommunikationseinheiten zwischen den Agenten, Artefakte sind die tatsächlichen Ergebnisobjekte, die im Rahmen einer Aufgabe ausgetauscht werden. Der zentrale, oft übersehene Unterschied zu MCP (siehe [KB-0292](18-mcp-und-enterprise-bereitstellung.md)) ist die Kommunikationsrichtung: MCP verbindet einen Agenten mit Tools und Datenquellen, während A2A zwei gleichberechtigte, potenziell von unterschiedlichen Anbietern stammende Agenten miteinander verbindet — dies erhöht das Vertrauensrisiko, da ein A2A-Partner nicht nur Daten liefert, sondern selbst autonom handeln kann. Protokollkonformität bedeutet, dass ein fremder Agent die A2A-Nachrichtenformate und den Task-Lifecycle korrekt implementiert — dies ist eine notwendige, aber keine hinreichende Bedingung für sichere Interoperabilität. Streaming ermöglicht fortlaufende Zwischenergebnisse während einer langlaufenden Aufgabe, was zusätzliche Anforderungen an die Behandlung unvollständiger oder partieller Nachrichten stellt (ähnlich dem partiellen Erfolg aus Ergebnisverträgen, siehe [KB-0283](09-tool-use-und-ergebnisvertraege.md)). Versionsaushandlung stellt sicher, dass zwei Agenten vor der eigentlichen Kommunikation eine kompatible Protokollversion feststellen, statt stillschweigend anzunehmen, dass beide dieselbe Version sprechen.

~~~text
Task lifecycle: phases of a task exchanged between two A2A-communicating agents (create, progress, complete, error)
Messages: structured communication units; Artifacts: actual result objects exchanged
KEY DIFFERENCE from MCP (KB-0292): MCP = agent-to-tool/data; A2A = agent-to-AGENT (peer, possibly different vendor)
  -> HIGHER trust risk: a peer agent doesn't just return data, it can act autonomously
Protocol conformance (speaks A2A correctly) != TRUST (acts as expected)
  -> conformance is NECESSARY but NOT SUFFICIENT for safe interoperability
Version negotiation: agents MUST establish compatible protocol version BEFORE communicating
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Getrennte Bewertung von Protokollkonformität und Vertrauen | wird Vertrauenswürdigkeit eines fremden Agenten unabhängig von seiner reinen Protokollkonformität bewertet? | ein protokollkonform kommunizierender, aber böswilliger Agent kann sonst unbemerkt akzeptiert werden |
| Explizite Versionsaushandlung vor Kommunikationsbeginn | wird vor der eigentlichen Aufgabenkommunikation eine kompatible Protokollversion explizit festgestellt? | eine stillschweigend angenommene Versionskompatibilität kann zu fehlerhafter oder unvollständiger Interpretation von Nachrichten führen |
| Behandlung unvollständiger Streaming-Nachrichten | ist definiert, wie mit unvollständigen oder partiellen Zwischenergebnissen eines Streaming-Tasks umgegangen wird? | eine unvollständige Streaming-Nachricht kann als vollständiges Ergebnis fehlinterpretiert werden |
| Task-Lifecycle-Statusprüfung | wird der Status eines Tasks (z. B. Abschluss vs. Fehler) explizit geprüft, bevor Folgeaktionen ausgelöst werden? | ein nicht geprüfter Task-Status kann zu Folgeaktionen auf Basis eines tatsächlich fehlgeschlagenen Tasks führen |

Implementierung: Für jeden A2A-Partneragenten wird eine separate Vertrauensbewertung durchgeführt, unabhängig davon, ob er das Protokoll korrekt implementiert — analog zur Serververtrauensbewertung bei MCP (siehe [KB-0292](18-mcp-und-enterprise-bereitstellung.md)). Vor Beginn der eigentlichen Aufgabenkommunikation wird eine explizite Versionsaushandlung durchgeführt, die eine inkompatible Version erkennt und die Kommunikation kontrolliert ablehnt, statt sie mit potenziell falscher Interpretation fortzusetzen. Streaming-Nachrichten werden mit einem expliziten Vollständigkeitsstatus versehen, sodass unvollständige Zwischenergebnisse nicht fälschlich als finales Ergebnis behandelt werden. Der Task-Status wird vor jeder Folgeaktion explizit geprüft, um sicherzustellen, dass eine Aktion nicht auf einem tatsächlich fehlgeschlagenen oder unvollständigen Task basiert.

## Scalability, Reliability, Security und Observability

A2A-Interoperabilität skaliert die Anzahl anbindbarer fremder Agenten unabhängig vom Anbieter, solange jeder Partneragent unabhängig hinsichtlich Vertrauen bewertet wird; die Reliability-Grenze liegt in blindem Vertrauen aufgrund reiner Protokollkonformität, das mit der Anzahl integrierter fremder Agenten proportional wächst.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein fremder Agent liefert protokollkonforme, aber inhaltlich unerwartete oder schädliche Ergebnisse | Vertrauen wurde fälschlich aus reiner Protokollkonformität abgeleitet, ohne separate Bewertung | prüfen, ob eine unabhängige Vertrauensbewertung für den betroffenen Partneragenten durchgeführt wurde |
| eine Nachricht eines fremden Agenten wird fehlerhaft interpretiert | fehlende Versionsaushandlung, inkompatible Protokollversionen wurden nicht erkannt | prüfen, ob vor der Kommunikation eine explizite Versionsaushandlung stattgefunden hat |
| eine Folgeaktion basiert auf einem tatsächlich fehlgeschlagenen Task eines fremden Agenten | fehlende explizite Task-Status-Prüfung vor Auslösen der Folgeaktion | prüfen, ob der Task-Status vor der Folgeaktion explizit geprüft wurde |

Security: Die zentrale Sicherheitsregel ist, Protokollkonformität niemals mit Vertrauenswürdigkeit gleichzusetzen — ein fremder Agent, der A2A korrekt implementiert, kann dennoch böswillig oder fehlerhaft handeln, und muss unabhängig davon bewertet werden. Observability: Häufigkeit erkannter Versionsinkompatibilitäten, Häufigkeit als unvollständig erkannter Streaming-Nachrichten und Häufigkeit von Folgeaktionen, die aufgrund einer expliziten Task-Status-Prüfung blockiert wurden, sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** bewertet jeden A2A-Partneragenten unabhängig von seiner Protokollkonformität hinsichtlich Vertrauen. **Principal** macht Versionsaushandlungsregeln und Task-Status-Prüfungen für das Team nachvollziehbar dokumentiert. **Chief** positioniert A2A-Interoperabilität als Integrationsentscheidung mit eigenem, von Protokollkonformität unabhängigem Vertrauensrisiko.

Anti-Patterns: einem fremden Agenten allein aufgrund korrekter Protokollimplementierung vertrauen; Kommunikation ohne explizite Versionsaushandlung beginnen; unvollständige Streaming-Nachrichten als finales Ergebnis behandeln.

## Production Checklist

- [ ] Jeder A2A-Partneragent ist unabhängig von Protokollkonformität hinsichtlich Vertrauen bewertet.
- [ ] Eine explizite Versionsaushandlung findet vor jeder Aufgabenkommunikation statt.
- [ ] Streaming-Nachrichten tragen einen expliziten Vollständigkeitsstatus.
- [ ] Der Task-Status wird vor jeder Folgeaktion explizit geprüft.

## Interviewfragen

### 1. Was ist der zentrale Unterschied zwischen MCP und A2A?

**Antwort:** MCP verbindet einen Agenten mit Tools und Datenquellen (Agent-zu-Tool); A2A verbindet zwei gleichberechtigte, potenziell autonome Agenten unterschiedlicher Anbieter miteinander (Agent-zu-Agent), was ein höheres Vertrauensrisiko birgt.

### 2. Warum ist Protokollkonformität keine hinreichende Bedingung für Vertrauen?

**Antwort:** Ein fremder Agent kann das A2A-Protokoll korrekt implementieren und dennoch böswillig oder fehlerhaft handeln; Vertrauenswürdigkeit muss unabhängig von der reinen Protokollkonformität bewertet werden.

### 3. Warum ist Versionsaushandlung vor Kommunikationsbeginn notwendig?

**Antwort:** Ohne explizite Aushandlung könnte stillschweigend eine inkompatible Protokollversion angenommen werden, was zu fehlerhafter oder unvollständiger Interpretation von Nachrichten führen kann.

### 4. Warum benötigen Streaming-Nachrichten einen expliziten Vollständigkeitsstatus?

**Antwort:** Ohne diesen Status könnte eine unvollständige Zwischennachricht eines langlaufenden Tasks fälschlich als finales, vollständiges Ergebnis interpretiert werden.

### 5. Wie diagnostizierst du eine Folgeaktion, die auf einem fehlgeschlagenen Task eines fremden Agenten basiert?

**Antwort:** Ich prüfe, ob der Task-Status vor Auslösen der Folgeaktion explizit abgefragt wurde — fehlt diese Prüfung, wurde die Aktion wahrscheinlich auf Basis eines ungeprüften, tatsächlich fehlgeschlagenen Tasks ausgelöst.

### 6. Widersprüchliche Anforderung: Team will nahtlose, schnelle Interoperabilität mit möglichst vielen fremden A2A-Agenten UND garantiert keine Sicherheitsverletzung durch einen böswilligen Partneragenten — wie gehst du vor?

**Antwort:** Ich würde erklären, dass nahtlose Interoperabilität und Sicherheitsgarantie sich nicht ausschließen, wenn Vertrauensbewertung standardisiert und unabhängig von der Integrationsgeschwindigkeit für jeden neuen Partneragenten durchgeführt wird; ich würde vorschlagen, eine abgestufte Vertrauensstufen-Klassifizierung einzuführen, die den Funktionsumfang eines neuen Partneragenten zunächst einschränkt, bis ausreichend Vertrauen aufgebaut wurde.

## Praktische Labs

~~~python
# A2A-like task lifecycle with version negotiation and explicit status checking
SUPPORTED_VERSIONS = {"1.0", "1.1"}

def negotiate_version(peer_version):
    if peer_version not in SUPPORTED_VERSIONS:
        raise ValueError(f"Incompatible protocol version: '{peer_version}' not in {SUPPORTED_VERSIONS}")
    return peer_version

def process_task_result(task):
    if task["status"] == "failed":
        raise RuntimeError(f"Task failed, cannot proceed: {task.get('error', 'unknown error')}")
    if task["status"] == "streaming" and not task.get("is_final", False):
        return "Partial result received — waiting for final chunk before acting"
    return f"Task completed successfully with artifact: {task['artifact']}"

negotiated = negotiate_version("1.1")
print(f"Negotiated protocol version: {negotiated}")

try:
    negotiate_version("2.0")
except ValueError as e:
    print(f"Caught: {e}")

partial_task = {"status": "streaming", "is_final": False}
print(process_task_result(partial_task))

failed_task = {"status": "failed", "error": "peer agent internal error"}
try:
    process_task_result(failed_task)
except RuntimeError as e:
    print(f"Caught: {e}")
~~~

## Dependencies, Cross-References und Quellen

1. Linux Foundation / Agentic AI Foundation: [Agent2Agent (A2A) Protocol — Official Specification](https://a2a-protocol.org/latest/specification/), abgerufen 2026-09-17.
2. Google: [Announcing the Agent2Agent Protocol (A2A)](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/), abgerufen 2026-09-17.
3. OWASP: [OWASP Top 10 for LLM Applications — Supply Chain Vulnerabilities](https://genai.owasp.org/llmrisk/llm05-supply-chain/), abgerufen 2026-09-17.

Multi-Agent-Zusammenarbeit ist kanonisch in [KB-0278](04-multi-agent-zusammenarbeit.md) behandelt; MCP/Enterprise-Bereitstellung in [KB-0292](18-mcp-und-enterprise-bereitstellung.md); Ergebnisverträge in [KB-0283](09-tool-use-und-ergebnisvertraege.md). Konkrete, versionsspezifische Protokolldetails sind vor produktivem Einsatz gegen die zum Nutzungszeitpunkt aktuelle offizielle A2A-Spezifikation zu verifizieren, da sich diese weiterentwickelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte Agent-Vertrauensregistries, die A2A-Partneragenten mit verifizierbaren Reputations- oder Zertifizierungsdaten versehen | Emerging | Beobachten; würde Vertrauensbewertung objektivieren, aber noch keine breit etablierte Referenzimplementierung. |
| Konvergenz zwischen A2A und MCP für kombinierte Agent-zu-Agent- und Agent-zu-Tool-Interoperabilität in einheitlichen Frameworks | Emerging | Beobachten; vielversprechend für konsistente Architektur, aber Standardisierung noch nicht abgeschlossen. |

Ein Team akzeptiert eine A2A-Interoperabilitätsarchitektur erst, wenn getrennte Vertrauens- und Protokollkonformitätsbewertung, Versionsaushandlung und Task-Status-Prüfung dokumentiert und getestet sind.
