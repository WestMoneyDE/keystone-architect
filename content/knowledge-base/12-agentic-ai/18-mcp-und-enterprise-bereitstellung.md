---
{"id": "KB-0292", "title": "MCP und Enterprise-Bereitstellung", "domain": "12", "sequence": 18, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0283", "concepts": ["Tool Use und Ergebnisverträge"], "needed_for": "understanding"}], "related": ["KB-0281"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen minimalen MCP-Client implementieren, der Tools und Resources von einem Server auflistet und einen Tool-Aufruf mit expliziter Autorisierungsprüfung durchführt.", "rationale": "Die konkreten Protokollrollen von MCP werden erst durch Implementierung eines Clients greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Entscheiden, welches Vertrauensmodell für einen MCP-Server bei Unternehmensintegration angemessen ist, abhängig davon, ob der Server intern betrieben oder von Dritten bereitgestellt wird.", "rationale": "Ein MCP-Server ist eine zusätzliche Vertrauensgrenze, deren Risikoprofil sich zwischen intern betriebenen und extern bereitgestellten Servern erheblich unterscheidet."}, "STAFF-TARGET": {"active": true, "scope": "Eine Sicherheitsverletzung auf einen nicht verifizierten MCP-Server oder eine fehlende Versionsprüfung statt auf ein allgemeines Integrationsproblem zurückführen können.", "rationale": "MCP-Server können sich in ihren angebotenen Tools und Resources zwischen Versionen ändern; ungeprüfte Annahmen über Serververhalten sind ein konkretes Sicherheitsrisiko."}, "CHIEF-TARGET": {"active": true, "scope": "MCP-Enterprise-Bereitstellung als Integrationsentscheidung mit eigenem Vertrauens-, Autorisierungs- und Versionierungsrisiko positionieren, das gegen offizielle Spezifikationen verifiziert werden muss.", "rationale": "MCP-Spezifikationen entwickeln sich weiter; eine einmalige Prüfung eines Servers oder der Spezifikation veraltet und muss bei Aktualisierungen erneut verifiziert werden."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Transport-Implementierungsdetails (z. B. STDIO vs. HTTP) sind Vertiefung.", "rationale": "Kern ist das Prinzip von Serververtrauen und Autorisierung, nicht die konkrete Transportwahl."}}, "lab_validation": [{"lab_id": "KB-0292-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell eines MCP-ähnlichen Client-Server-Musters mit Tool-Auflistung und expliziter Autorisierungsprüfung", "evidence": "Ein Client, der Tools eines simulierten Servers ohne Autorisierungsprüfung ausführt, kann einen nicht autorisierten Tool-Aufruf zulassen; eine explizite Autorisierungsprüfung vor Ausführung verhindert dies.", "limitations": "Keine echte MCP-Bibliothek, kein echter MCP-Server, kein produktives System; konkrete Spezifikationsdetails müssen vor Nutzung gegen die aktuelle offizielle MCP-Spezifikation verifiziert werden, da sich diese weiterentwickelt."}]}
---
# MCP und Enterprise-Bereitstellung

> **Ziel:** Das Model Context Protocol (MCP) definiert Protokollrollen (Client, Server, Host), über die ein Agent Tools und Resources eines Servers nutzen kann, aufbauend auf Ergebnisverträgen für Toolausführung (siehe [KB-0283](09-tool-use-und-ergebnisvertraege.md)). Bei Unternehmensintegration ist der zentrale, sicherheitsrelevante Punkt, dass jeder MCP-Server eine zusätzliche Vertrauensgrenze darstellt — Serververtrauen, Autorisierung und Versionierung müssen explizit anhand der aktuellen offiziellen Spezifikation geprüft werden, nicht anhand einmalig getroffener Annahmen.

## Zweck, Mental Model und Dependencies

MCP definiert drei zentrale Protokollrollen: ein Host (die Anwendung, die den Agenten ausführt), ein Client (die Komponente, die die Verbindung zu einem Server verwaltet) und ein Server (der Tools, Resources und ggf. Prompts bereitstellt, auf die der Agent zugreifen kann). Tools sind ausführbare Funktionen, die der Server anbietet (ähnlich dem Function-Calling-Konzept, siehe [KB-0247](../11-genai-architecture/07-function-calling.md)), Resources sind vom Server bereitgestellte Daten, auf die der Agent lesend zugreifen kann. Transport beschreibt, wie Client und Server tatsächlich kommunizieren (z. B. lokal über Standardein-/ausgabe oder über ein Netzwerkprotokoll), was direkte Auswirkungen auf das Vertrauensmodell hat — ein lokal betriebener Server unterscheidet sich sicherheitstechnisch erheblich von einem über das Netzwerk erreichbaren, von einem Dritten betriebenen Server. Der zentrale, oft übersehene Risikofaktor bei Enterprise-Bereitstellung ist, dass ein MCP-Server, dem ein Agent vertraut, effektiv dieselbe Vertrauensstufe wie eine direkte Tool-Integration erhält — ein bösartiger oder kompromittierter Server könnte manipulierte Tool-Beschreibungen oder -Ergebnisse liefern. Autorisierung muss daher explizit geprüft werden (welche Tools und Resources darf ein bestimmter Agent bei einem bestimmten Server tatsächlich nutzen), und Versionierung muss beachtet werden, da sich die angebotenen Tools und Resources eines Servers zwischen Versionen ändern können, ohne dass dies für den Client automatisch offensichtlich ist. Da sich die MCP-Spezifikation selbst weiterentwickelt, müssen konkrete Protokolldetails vor produktivem Einsatz gegen die jeweils aktuelle offizielle Spezifikation verifiziert werden, statt sich auf einmalig recherchierte Details zu verlassen.

~~~text
MCP roles: Host (runs the agent) -> Client (manages connection) -> Server (provides tools/resources/prompts)
Tools: executable functions server offers (like function calling, KB-0247)
Resources: server-provided data, READ access for the agent
Transport: local (stdio) vs network -> DIRECTLY affects trust model
CRITICAL: trusting an MCP server = SAME trust level as a direct tool integration
  -> malicious/compromised server could return manipulated tool descriptions/results
MUST verify explicitly: authorization (which tools/resources for which agent) + version (spec evolves)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Explizite Serververtrauensbewertung | ist bewertet, ob ein MCP-Server intern betrieben, von einem vertrauenswürdigen Partner oder von einem unbekannten Dritten bereitgestellt wird? | ein unbewertet vertrauter Server kann manipulierte Tool-Beschreibungen oder -Ergebnisse liefern |
| Aufgabenspezifische Autorisierung pro Server | ist explizit geprüft, welche konkreten Tools und Resources eines Servers ein bestimmter Agent tatsächlich nutzen darf? | pauschaler Vollzugriff auf alle Tools eines Servers überschreitet oft den tatsächlich benötigten Umfang |
| Versionsbewusste Serverintegration | wird geprüft, ob sich die angebotenen Tools oder Resources eines Servers seit der letzten Integration geändert haben? | eine unerkannte Änderung im Serverangebot kann zu unerwartetem oder fehlerhaftem Agentenverhalten führen |
| Verifikation gegen aktuelle offizielle Spezifikation | werden protokollspezifische Annahmen regelmäßig gegen die aktuelle offizielle MCP-Spezifikation geprüft? | eine veraltete Spezifikationsannahme kann nach einer Protokollaktualisierung nicht mehr zutreffen |

Implementierung: Vor Integration eines MCP-Servers wird explizit bewertet, welchem Vertrauensmodell er zuzuordnen ist (intern, vertrauenswürdiger Partner, unbekannter Dritter), analog zur Plugin-Versionsverifikation aus [KB-0281](07-semantic-kernel-und-enterprise-orchestrierung.md). Jedem Agenten wird nur Zugriff auf die für seine Aufgabe tatsächlich notwendigen Tools und Resources eines Servers gewährt, nicht pauschal auf das gesamte Serverangebot. Bei jeder Serververbindung wird geprüft, ob sich das angebotene Tool- und Resource-Set seit der letzten bekannten Version geändert hat, und eine Änderung löst eine erneute Bewertung aus, statt automatisch übernommen zu werden. Protokollspezifische Implementierungsdetails werden vor produktivem Einsatz und bei jeder Aktualisierung gegen die aktuelle offizielle MCP-Spezifikation verifiziert, statt sich auf einmalig recherchierte Annahmen zu verlassen.

## Scalability, Reliability, Security und Observability

MCP-Integration skaliert die Anzahl anbindbarer Tool- und Datenquellen für Agenten gut, solange jeder Server unabhängig hinsichtlich Vertrauen und Autorisierung bewertet wird; die Reliability-Grenze liegt in pauschalem Serververtrauen ohne separate Autorisierungs- und Versionsprüfung, das proportional zur Anzahl integrierter Server wächst.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Agent führt über einen MCP-Server eine Aktion aus, die nicht dem erwarteten Tool-Verhalten entspricht | fehlende Serververtrauensbewertung, ein manipulierter oder kompromittierter Server liefert unerwartete Tool-Ergebnisse | prüfen, ob eine explizite Vertrauensbewertung für den betroffenen Server durchgeführt wurde |
| ein Agent greift über einen Server auf Tools zu, die für seine Aufgabe nicht vorgesehen waren | pauschaler statt aufgabenspezifischer Autorisierung für den Serverzugriff | prüfen, ob die Autorisierung auf die tatsächlich benötigten Tools und Resources beschränkt war |
| ein Agentenverhalten ändert sich unerwartet nach einem Update des angebundenen MCP-Servers | fehlende Versionsprüfung, geändertes Serverangebot wurde nicht erkannt | prüfen, ob eine Versionsprüfung des Serverangebots vor der Nutzung stattgefunden hat |

Security: Die zentrale Sicherheitsregel ist, einen MCP-Server niemals implizit als vertrauenswürdig zu behandeln, nur weil er dem MCP-Protokoll folgt — das Protokoll definiert die Kommunikationsform, nicht die Vertrauenswürdigkeit des jeweiligen Servers. Observability: Häufigkeit erkannter Änderungen im Tool-/Resource-Angebot eines Servers, Verteilung der tatsächlich genutzten gegenüber der verfügbaren Tools pro Server und Häufigkeit abgelehnter Autorisierungsanfragen sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** bewertet jeden MCP-Server explizit hinsichtlich Vertrauen, bevor er integriert wird. **Principal** macht aufgabenspezifische Autorisierung pro Server für das Team nachvollziehbar dokumentiert. **Chief** positioniert MCP-Enterprise-Bereitstellung als Integrationsentscheidung mit eigenem, gegen aktuelle Spezifikationen zu verifizierendem Risiko.

Anti-Patterns: einen MCP-Server implizit als vertrauenswürdig behandeln, nur weil er dem Protokoll folgt; pauschalen Zugriff auf alle Tools und Resources eines Servers gewähren; Serverintegrationen ohne Versionsprüfung des angebotenen Tool-/Resource-Sets betreiben.

## Production Checklist

- [ ] Jeder MCP-Server ist explizit hinsichtlich Vertrauen (intern, Partner, unbekannter Dritter) bewertet.
- [ ] Agentenzugriff auf Tools und Resources ist aufgabenspezifisch autorisiert, nicht pauschal.
- [ ] Änderungen im Tool-/Resource-Angebot eines Servers werden erkannt und lösen eine erneute Bewertung aus.
- [ ] Protokollspezifische Annahmen sind gegen die aktuelle offizielle MCP-Spezifikation verifiziert.

## Interviewfragen

### 1. Welche drei Protokollrollen definiert MCP, und wie hängen sie zusammen?

**Antwort:** Host (führt den Agenten aus), Client (verwaltet die Verbindung) und Server (stellt Tools, Resources und ggf. Prompts bereit) — der Host nutzt den Client, um sich mit einem oder mehreren Servern zu verbinden.

### 2. Warum ist ein MCP-Server eine eigenständige Vertrauensgrenze?

**Antwort:** Ein Agent, der einem Server vertraut, gewährt ihm effektiv dieselbe Vertrauensstufe wie einer direkten Tool-Integration; ein bösartiger oder kompromittierter Server könnte manipulierte Tool-Beschreibungen oder -Ergebnisse liefern.

### 3. Warum reicht pauschaler Zugriff auf alle Tools eines Servers nicht aus?

**Antwort:** Er überschreitet oft den tatsächlich für die Aufgabe benötigten Umfang und erhöht die Angriffsfläche; Autorisierung sollte aufgabenspezifisch auf die tatsächlich benötigten Tools und Resources beschränkt werden.

### 4. Warum ist Versionsbewusstsein bei MCP-Serverintegration wichtig?

**Antwort:** Das angebotene Tool- und Resource-Set eines Servers kann sich zwischen Versionen ändern, ohne dass dies für den Client automatisch offensichtlich ist; eine unerkannte Änderung kann zu unerwartetem Agentenverhalten führen.

### 5. Wie diagnostizierst du eine unerwartete Aktion, die über einen MCP-Server ausgeführt wurde?

**Antwort:** Ich prüfe, ob eine explizite Vertrauensbewertung für den betroffenen Server vorlag und ob die Autorisierung auf die tatsächlich benötigten Tools beschränkt war — fehlt beides, ist ein kompromittierter oder falsch autorisierter Server die wahrscheinlichste Ursache.

### 6. Widersprüchliche Anforderung: Team will schnelle Integration möglichst vieler externer MCP-Server für maximale Werkzeugvielfalt UND garantiert keine Sicherheitsverletzung durch einen kompromittierten Server — wie gehst du vor?

**Antwort:** Ich würde erklären, dass schnelle Integration und garantierte Sicherheit sich nicht ausschließen, wenn jeder Server unabhängig von der Integrationsgeschwindigkeit einer standardisierten, kurzen Vertrauens- und Autorisierungsprüfung unterzogen wird; ich würde vorschlagen, eine wiederverwendbare Prüf-Checkliste für neue Server zu etablieren, die den Bewertungsaufwand pro Server minimiert, ohne die Prüfung selbst auszulassen.

## Praktische Labs

~~~python
# MCP-like client with explicit authorization check before tool execution
server_tools = {"search_documents": {"scope": "read"}, "delete_documents": {"scope": "write"}}
agent_authorized_scopes = {"search_documents": {"read"}}

def call_tool(tool_name, agent_scopes):
    if tool_name not in server_tools:
        raise ValueError(f"Tool '{tool_name}' not offered by server")
    required_scope = server_tools[tool_name]["scope"]
    if tool_name not in agent_scopes or required_scope not in agent_scopes[tool_name]:
        raise PermissionError(f"Agent not authorized for tool '{tool_name}' (requires scope '{required_scope}')")
    return f"Executed '{tool_name}' with authorized scope '{required_scope}'"

print(call_tool("search_documents", agent_authorized_scopes))

try:
    call_tool("delete_documents", agent_authorized_scopes)
except PermissionError as e:
    print(f"Caught: {e}")
~~~

## Dependencies, Cross-References und Quellen

1. Anthropic: [Model Context Protocol — Official Specification](https://modelcontextprotocol.io/), abgerufen 2026-09-17.
2. Anthropic: [Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol), abgerufen 2026-09-17.
3. OWASP: [OWASP Top 10 for LLM Applications — Supply Chain Vulnerabilities](https://genai.owasp.org/llmrisk/llm05-supply-chain/), abgerufen 2026-09-17.

Ergebnisverträge sind kanonisch in [KB-0283](09-tool-use-und-ergebnisvertraege.md) behandelt; Semantic Kernel/Enterprise-Orchestrierung in [KB-0281](07-semantic-kernel-und-enterprise-orchestrierung.md). Konkrete, versionsspezifische Protokolldetails sind vor produktivem Einsatz gegen die zum Nutzungszeitpunkt aktuelle offizielle MCP-Spezifikation zu verifizieren, da sich diese weiterentwickelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Zentrale MCP-Server-Registries mit standardisierten Vertrauens- und Autorisierungsmetadaten für Unternehmensumgebungen | Emerging | Beobachten; würde Serverbewertung standardisieren, aber noch keine breit etablierte Referenzimplementierung. |
| Automatisierte Diff-Erkennung für Tool-/Resource-Änderungen zwischen MCP-Serverversionen | Emerging | Beobachten; würde Versionsprüfung vereinfachen, aber noch nicht breit verfügbar. |

Ein Team akzeptiert eine MCP-Enterprise-Bereitstellung erst, wenn Serververtrauen, aufgabenspezifische Autorisierung und Versionsprüfung dokumentiert und gegen die aktuelle offizielle Spezifikation verifiziert sind.
