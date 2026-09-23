---
{"id": "KB-0282", "title": "OpenAI Agents SDK und Harness", "domain": "12", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0275", "concepts": ["Agentenschleifen"], "needed_for": "understanding"}], "related": ["KB-0262"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein minimales Runner-Handoff-Modell implementieren, das SDK-Komfortfunktionen von tatsächlichen Sandbox-Sicherheitsgarantien trennt.", "rationale": "Der Unterschied zwischen SDK-Komfort und Sicherheitsgarantie wird erst durch konkrete Implementierung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Entscheiden, welche Harness-/Sandbox-Grenzen für einen konkreten Agenten-Anwendungsfall tatsächlich benötigt werden, statt sich auf SDK-Komfortfunktionen zu verlassen.", "rationale": "Ein Runner/Handoff-Mechanismus im SDK ist keine Sicherheitsgarantie, sondern eine Ablaufsteuerung — Sandbox-Isolation muss separat bewertet werden."}, "STAFF-TARGET": {"active": true, "scope": "Eine Sicherheitsverletzung auf eine fälschlich als Sicherheitsgrenze angenommene SDK-Komfortfunktion statt auf ein allgemeines Implementierungsproblem zurückführen können.", "rationale": "SDK-Komfortfunktionen wie Handoffs oder Tool-Ausführung sind primär für Entwicklerergonomie gedacht, nicht als geprüfte Sicherheitsgrenze."}, "CHIEF-TARGET": {"active": true, "scope": "Harness-/Sandbox-Entscheidungen als eigenständige, gegen Primärquellen zu verifizierende Sicherheitsentscheidung positionieren, unabhängig vom SDK-Komfort.", "rationale": "SDK-Versionen und deren Sicherheitsgarantien ändern sich; eine einmalige Prüfung veraltet und muss gegen aktuelle Primärquellen erneut verifiziert werden."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "SDK-spezifische Runner-API-Details sind Vertiefung.", "rationale": "Kern ist die Trennung von Komfort und Sicherheitsgarantie, nicht die konkrete API-Signatur."}}, "lab_validation": [{"lab_id": "KB-0282-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell eines Runner/Handoff-Mechanismus ohne echte Sandbox-Isolation", "evidence": "Ein Handoff zwischen zwei simulierten Agenten funktioniert als reine Ablaufsteuerung ohne jegliche Isolationsgarantie; ein Tool-Aufruf ohne separate Sandbox kann uneingeschränkt auf die Umgebung zugreifen.", "limitations": "Kein echtes OpenAI Agents SDK, keine echte Sandbox, kein produktives System; Aussagen zu SDK-Version-spezifischen Garantien müssen vor Nutzung gegen aktuelle Primärquellen verifiziert werden."}]}
---
# OpenAI Agents SDK und Harness

> **Ziel:** Ein Runner steuert die Ausführung eines Agentenablaufs (siehe [KB-0275](01-agentenschleifen.md)), Handoffs übergeben die Kontrolle zwischen Agenten, und Toolausführung ruft externe Funktionen auf. Der zentrale, sicherheitsrelevante Punkt ist, dass diese Mechanismen primär Entwicklerkomfort bieten — die tatsächliche Isolationsgrenze (Sandbox/Harness) ist ein separates Konzept, dessen konkrete Garantien versionsabhängig sind und vor Produktionseinsatz gegen aktuelle Primärquellen verifiziert werden müssen, nicht als gegeben angenommen werden dürfen.

## Zweck, Mental Model und Dependencies

Ein Runner orchestriert die Ausführung eines Agenten über mehrere Schritte hinweg, ähnlich der Agentenschleife aus [KB-0275](01-agentenschleifen.md), aber als SDK-Komfortschicht, die dem Entwickler das manuelle Verdrahten der Schleife abnimmt. Ein Handoff überträgt die Kontrolle von einem Agenten an einen anderen (ähnlich der Supervisor-Delegation, jedoch als SDK-natives Konstrukt) — dies ist eine Ablaufsteuerungsfunktion, keine Sicherheitsgrenze zwischen den beteiligten Agenten. Toolausführung ruft externe Funktionen im Namen des Agenten auf; ohne separate Sandbox-Isolation läuft dieser Aufruf mit denselben Berechtigungen wie der aufrufende Prozess. Der zentrale, oft missverstandene Punkt ist die Trennung zwischen SDK-Komfort und Sicherheitsgarantie: Runner, Handoffs und die Tool-Aufruf-API sind dafür gebaut, die Entwicklung von Agentenanwendungen zu vereinfachen — sie sind nicht automatisch mit einer geprüften Isolationsgrenze (Harness/Sandbox) ausgestattet, die bösartige oder fehlerhafte Toolausführungen tatsächlich eindämmt. Diese Isolationsgrenze muss als eigenständige, separate Entscheidung behandelt und regelmäßig gegen die aktuelle Version der Primärdokumentation verifiziert werden, da sich Sicherheitsgarantien von SDK-Versionen ändern können.

~~~text
Runner: orchestrates agent execution across steps (SDK convenience layer, like KB-0275's loop)
Handoff: transfers control between agents -> FLOW CONTROL, not a security boundary between agents
Tool execution: calls external functions on agent's behalf
  -> WITHOUT separate sandbox isolation: runs with SAME PERMISSIONS as calling process
CRITICAL DISTINCTION: SDK convenience (Runner/Handoff/Tool API) != security guarantee (Harness/Sandbox)
Isolation boundary = SEPARATE decision, must be verified against CURRENT primary docs (version-dependent)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Runner als Ablaufsteuerung, nicht Sicherheitsgrenze | wird der Runner korrekt nur als Ausführungssteuerung verstanden, nicht als Isolationsmechanismus? | eine fälschliche Annahme von Sicherheitsgarantien durch den Runner kann zu ungeschützter Toolausführung führen |
| Handoff-Kontrollübergabe ohne implizite Isolation | ist explizit geprüft, dass ein Handoff keine Berechtigungsgrenze zwischen den beteiligten Agenten einzieht? | ein Agent nach einem Handoff kann dieselben Berechtigungen wie der vorherige Agent erben, wenn keine explizite Grenze gesetzt wird |
| Separate Sandbox-/Harness-Bewertung | ist die tatsächliche Isolationsgrenze für Toolausführung unabhängig vom SDK-Komfort bewertet und dokumentiert? | ohne separate Bewertung kann eine Toolausführung mit unerwartet weitreichenden Berechtigungen laufen |
| Versionsabhängige Verifikation gegen Primärquellen | wird die aktuelle SDK-Version regelmäßig gegen die aktuelle Primärdokumentation auf Sicherheitsgarantien geprüft? | veraltete Annahmen über SDK-Sicherheitsgarantien können nach einem Versionswechsel nicht mehr zutreffen |

Implementierung: Der Runner wird ausschließlich als Ablaufsteuerungsmechanismus behandelt; jede Annahme über Isolationsgarantien wird separat und explizit dokumentiert, nicht implizit aus der Existenz des Runners abgeleitet. Nach jedem Handoff wird explizit geprüft und dokumentiert, welche Berechtigungen der übernehmende Agent tatsächlich hat, statt anzunehmen, dass der Handoff automatisch eine Berechtigungsgrenze zieht. Für jede Toolausführung wird eine separate Sandbox-/Harness-Bewertung durchgeführt (analog zu Tool-Security-Prinzipien aus Domain 11, siehe [KB-0262](../11-genai-architecture/22-sicherheit-von-ai-werkzeugen.md)), die unabhängig von SDK-Komfortfunktionen die tatsächliche Isolationsgrenze festlegt. Vor Produktionseinsatz und bei jedem SDK-Versionswechsel wird die aktuelle Primärdokumentation explizit auf geänderte Sicherheitsgarantien geprüft, statt sich auf frühere Prüfungen zu verlassen.

## Scalability, Reliability, Security und Observability

Die Trennung von SDK-Komfort und Sicherheitsgarantie skaliert Vertrauen in ein Agentensystem nur dann korrekt, wenn beide Aspekte unabhängig voneinander bewertet und dokumentiert werden; eine implizite Vermischung untergräbt die Reliability der gesamten Sicherheitsarchitektur, unabhängig von der Qualität der SDK-Komfortfunktionen selbst.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Toolausführung greift auf Ressourcen zu, die nicht Teil der beabsichtigten Aufgabe waren | fehlende separate Sandbox-/Harness-Bewertung, SDK-Komfortfunktionen wurden fälschlich als Sicherheitsgrenze angenommen | prüfen, ob eine unabhängige Isolationsbewertung für die betroffene Toolausführung dokumentiert ist |
| ein Agent nach einem Handoff hat unerwartet weitreichende Berechtigungen | der Handoff wurde fälschlich als Berechtigungsgrenze angenommen, ohne explizite Prüfung | Berechtigungen des übernehmenden Agenten nach dem Handoff explizit gegen die erwarteten Berechtigungen prüfen |
| ein nach einem SDK-Update funktionierendes Sicherheitsverhalten ändert sich unerwartet | die Sicherheitsgarantien der neuen SDK-Version wurden nicht gegen aktuelle Primärquellen verifiziert | Release Notes und aktuelle Primärdokumentation der neuen SDK-Version explizit auf geänderte Garantien prüfen |

Security: Die zentrale Sicherheitsregel ist, niemals SDK-Komfortfunktionen (Runner, Handoff, Tool-Aufruf-API) implizit als Sicherheitsgrenze zu behandeln — jede Isolationsannahme muss explizit, separat und gegen aktuelle Primärquellen verifiziert dokumentiert sein. Observability: dokumentierte Isolationsbewertungen pro Toolausführungspfad, Häufigkeit von Berechtigungsprüfungen nach Handoffs und Aktualität der letzten Primärquellenverifikation pro SDK-Version sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** trennt SDK-Komfortfunktionen strikt von Sicherheitsgarantien und dokumentiert beide separat. **Principal** macht die aktuelle Isolationsbewertung für jede Toolausführung für das Team nachvollziehbar. **Chief** positioniert Harness-/Sandbox-Entscheidungen als eigenständige, versionsabhängige Sicherheitsentscheidung, die unabhängig vom SDK-Komfort regelmäßig gegen Primärquellen verifiziert werden muss.

Anti-Patterns: SDK-Komfortfunktionen wie Runner oder Handoff implizit als Sicherheitsgrenze annehmen; einmalige Sicherheitsbewertung nach einem SDK-Versionswechsel nicht erneuern; Toolausführung ohne separate, dokumentierte Sandbox-/Harness-Bewertung in Produktion betreiben.

## Production Checklist

- [ ] Runner und Handoffs sind explizit als Ablaufsteuerung, nicht als Sicherheitsgrenze dokumentiert.
- [ ] Berechtigungen nach jedem Handoff sind explizit geprüft und dokumentiert.
- [ ] Jede Toolausführung hat eine separate, dokumentierte Sandbox-/Harness-Bewertung.
- [ ] Sicherheitsgarantien sind bei jedem SDK-Versionswechsel gegen aktuelle Primärquellen erneut verifiziert.

## Interviewfragen

### 1. Warum ist ein Runner keine Sicherheitsgrenze?

**Antwort:** Ein Runner ist eine SDK-Komfortschicht zur Ablaufsteuerung, die die manuelle Verdrahtung einer Agentenschleife abnimmt — er bietet keine automatische Isolationsgarantie gegenüber böswilliger oder fehlerhafter Toolausführung.

### 2. Warum zieht ein Handoff nicht automatisch eine Berechtigungsgrenze zwischen Agenten?

**Antwort:** Ein Handoff ist eine Ablaufsteuerungsfunktion, die Kontrolle überträgt; ohne explizite, separate Prüfung kann der übernehmende Agent dieselben Berechtigungen wie der vorherige Agent erben.

### 3. Warum muss die Sandbox-/Harness-Bewertung unabhängig vom SDK-Komfort erfolgen?

**Antwort:** Weil SDK-Komfortfunktionen primär für Entwicklerergonomie gebaut sind, nicht als geprüfte Sicherheitsgrenze; die tatsächliche Isolation muss separat bewertet und dokumentiert werden.

### 4. Warum reicht eine einmalige Sicherheitsprüfung eines SDKs nicht aus?

**Antwort:** Sicherheitsgarantien einer SDK-Version können sich mit neuen Versionen ändern; eine einmalige Prüfung veraltet und muss bei jedem Versionswechsel gegen die aktuelle Primärdokumentation erneut verifiziert werden.

### 5. Wie diagnostizierst du einen unerwarteten Zugriff einer Toolausführung auf nicht beabsichtigte Ressourcen?

**Antwort:** Ich prüfe, ob eine separate, dokumentierte Sandbox-/Harness-Bewertung für die betroffene Toolausführung existiert — fehlt sie, wurden SDK-Komfortfunktionen wahrscheinlich fälschlich als Sicherheitsgrenze angenommen.

### 6. Widersprüchliche Anforderung: Team will schnelle Entwicklung mit vollem SDK-Komfort (Runner, Handoffs) UND garantierte Sicherheitsisolation ohne zusätzlichen Bewertungsaufwand — wie gehst du vor?

**Antwort:** Ich würde erklären, dass SDK-Komfort und Sicherheitsisolation unabhängige Dimensionen sind — schneller Komfort ersetzt keine Isolationsbewertung; ich würde vorschlagen, eine einmalige, wiederverwendbare Sandbox-Konfiguration als Standardvorlage für alle Toolausführungen zu etablieren, sodass der Bewertungsaufwand pro neuem Agenten minimal bleibt, ohne die Isolationsprüfung ganz auszulassen.

## Praktische Labs

~~~python
# Runner/handoff as flow control WITHOUT implicit security boundary
class Agent:
    def __init__(self, name, permissions):
        self.name = name
        self.permissions = permissions

def handoff(from_agent, to_agent):
    # Flow control only — NOT a permission boundary by default
    print(f"Handoff: {from_agent.name} -> {to_agent.name}")
    return to_agent

def run_tool(agent, tool_name, sandboxed_permissions=None):
    effective_permissions = sandboxed_permissions if sandboxed_permissions is not None else agent.permissions
    if effective_permissions == agent.permissions and sandboxed_permissions is None:
        print(f"WARNING: '{tool_name}' running with FULL agent permissions {agent.permissions} — no separate sandbox evaluation applied")
    else:
        print(f"'{tool_name}' running with explicitly sandboxed permissions {effective_permissions}")
    return effective_permissions

triage_agent = Agent("triage", permissions={"read_files", "write_files", "network_access"})
specialist_agent = Agent("specialist", permissions={"read_files", "write_files", "network_access"})

current_agent = handoff(triage_agent, specialist_agent)
print(f"{current_agent.name} inherited permissions: {current_agent.permissions}")

run_tool(current_agent, "file_writer")
run_tool(current_agent, "file_writer", sandboxed_permissions={"read_files"})
~~~

## Dependencies, Cross-References und Quellen

1. OpenAI: [OpenAI Agents SDK Documentation](https://openai.github.io/openai-agents-python/), abgerufen 2026-09-17.
2. OpenAI: [Agents SDK — Handoffs and Guardrails](https://openai.github.io/openai-agents-python/handoffs/), abgerufen 2026-09-17.
3. OWASP: [OWASP Top 10 for LLM Applications — Excessive Agency](https://genai.owasp.org/llmrisk/llm08-excessive-agency/), abgerufen 2026-09-17.

Agentenschleifen sind kanonisch in [KB-0275](01-agentenschleifen.md) behandelt; Tool-Sicherheit (SSRF/Exfiltration) in [KB-0262](../11-genai-architecture/22-sicherheit-von-ai-werkzeugen.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte Sandbox-Manifeste, die Isolationsgarantien pro Toolausführung deklarativ und versionsunabhängig dokumentieren | Emerging | Beobachten; würde die manuelle Primärquellenverifikation bei SDK-Updates reduzieren, aber noch nicht breit verfügbar. |
| Automatisierte Diff-Prüfung von SDK-Release-Notes auf sicherheitsrelevante Änderungen | Adopting | Gegenüber manueller Release-Notes-Durchsicht für zuverlässige Erkennung geänderter Garantien bevorzugen. |

Ein Team akzeptiert eine OpenAI-Agents-SDK-basierte Architektur erst, wenn Sandbox-/Harness-Isolation separat vom SDK-Komfort bewertet und gegen aktuelle Primärquellen verifiziert dokumentiert ist.
