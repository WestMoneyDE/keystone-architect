---
{"id": "KB-0286", "title": "Agenten-Sandboxing", "domain": "12", "sequence": 12, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0262", "concepts": ["Sicherheit von AI-Werkzeugen"], "needed_for": "understanding"}], "related": ["KB-0282"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine minimale Sandbox-Konfiguration implementieren, die Dateisystem-, Netzwerk- und Prozesszugriff eines Codewerkzeugs explizit begrenzt.", "rationale": "Die konkreten Grenzen einer Sandbox werden erst durch Implementierung expliziter Zugriffsbeschränkungen greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Sandbox-Architektur für Code- und Browserwerkzeuge gestalten, die Credential-Zugriff und Ausbruchsrisiken explizit adressiert.", "rationale": "Code- und Browserwerkzeuge haben unterschiedliche Ausbruchsflächen, die spezifische Isolationsmaßnahmen erfordern."}, "STAFF-TARGET": {"active": true, "scope": "Einen Sicherheitsvorfall auf eine unzureichend begrenzte Sandbox-Dimension (Dateisystem, Netzwerk oder Prozess) statt auf ein allgemeines Sicherheitsproblem zurückführen können.", "rationale": "Sandboxing-Ausbrüche entstehen typischerweise durch eine spezifische, unzureichend begrenzte Dimension, nicht durch ein diffuses Gesamtproblem."}, "CHIEF-TARGET": {"active": true, "scope": "Agenten-Sandboxing als notwendige Isolationsgrenze für jede agentische Codeausführung positionieren, unabhängig vom wahrgenommenen Vertrauen in das zugrunde liegende Modell.", "rationale": "Modellverhalten ist nicht garantiert vorhersehbar; die Sandbox ist die Verteidigungslinie, die unabhängig vom Modellverhalten Schaden begrenzt."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Container-Runtime- oder Namespace-Implementierungsdetails sind Vertiefung.", "rationale": "Kern ist das Prinzip der expliziten Begrenzung von Dateisystem, Netzwerk und Prozessen, nicht die konkrete Kernel-Technologie."}}, "lab_validation": [{"lab_id": "KB-0286-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell einer Sandbox-Zugriffsprüfung für Dateisystem, Netzwerk und Prozessausführung", "evidence": "Ein simulierter Zugriffsversuch außerhalb des erlaubten Dateisystempfads oder auf eine nicht erlaubte Netzwerkadresse wird durch explizite Grenzprüfung abgelehnt, während erlaubte Zugriffe durchgehen.", "limitations": "Keine echte Container-/Namespace-Isolation, kein echtes Betriebssystem, kein produktives System."}]}
---
# Agenten-Sandboxing

> **Ziel:** Eine Sandbox begrenzt Dateisystem-, Netzwerk- und Prozesszugriff eines Agentenwerkzeugs (aufbauend auf Tool-Sicherheitsprinzipien, siehe [KB-0262](../11-genai-architecture/22-sicherheit-von-ai-werkzeugen.md)) explizit und unabhängig vom Modellverhalten. Der zentrale Grundsatz ist, dass die Sandbox die Verteidigungslinie ist, die Schaden begrenzt, wenn ein Modell unerwartet handelt — sie ersetzt nicht das Vertrauen in das Modell, sondern macht dieses Vertrauen für die Sicherheitsarchitektur irrelevant.

## Zweck, Mental Model und Dependencies

Dateisystem-Begrenzung beschränkt ein Agentenwerkzeug auf einen definierten Satz von Pfaden, außerhalb derer kein Lese- oder Schreibzugriff möglich ist — dies verhindert, dass ein Werkzeug versehentlich oder böswillig auf sensible Systemdateien oder Daten außerhalb seines Aufgabenbereichs zugreift. Netzwerk-Begrenzung beschränkt ausgehende und eingehende Verbindungen auf explizit erlaubte Ziele, was insbesondere Exfiltrationsrisiken (siehe SSRF-Konzepte aus [KB-0262](../11-genai-architecture/22-sicherheit-von-ai-werkzeugen.md)) begrenzt. Prozess-Begrenzung beschränkt, welche weiteren Prozesse ein Werkzeug starten oder mit welchen Rechten es laufen darf, um zu verhindern, dass ein kompromittiertes Werkzeug beliebigen Code mit vollen Systemrechten ausführt. Credential-Zugriff ist eine besonders kritische Dimension — ein Code- oder Browserwerkzeug, das Zugriff auf Zugangsdaten hat (z. B. über Umgebungsvariablen oder ein Dateisystem, in dem Secrets liegen), kann diese potenziell exfiltrieren; Sandboxing muss daher auch den Zugriff auf Credential-Speicherorte explizit begrenzen, nicht nur allgemeinen Dateisystemzugriff. Ausbruchsrisiken unterscheiden sich zwischen Code- und Browserwerkzeugen: ein Codewerkzeug kann versuchen, Sandbox-Grenzen über Systemaufrufe oder Umgebungsmanipulation zu umgehen, während ein Browserwerkzeug über clientseitige Skripte, Weiterleitungen oder manipulierte Seiteninhalte versuchen kann, Aktionen außerhalb des beabsichtigten Aufgabenbereichs auszulösen (verwandt mit Prompt-Injection-Risiken aus Domain 11).

~~~text
Filesystem limit: tool restricted to defined paths ONLY -> no access to sensitive files outside scope
Network limit: outbound/inbound restricted to explicitly allowed targets -> limits exfiltration (SSRF, KB-0262)
Process limit: restricts what sub-processes tool can spawn + with what privileges
Credential access: MUST be explicitly bounded separately -> exposed secrets = exfiltration risk
Escape risk differs by tool type:
  Code tool: syscalls / environment manipulation to escape sandbox boundary
  Browser tool: client-side scripts / redirects / manipulated page content -> unintended actions (prompt injection adjacent)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Explizite Dateisystem-Allowlist | ist der Dateisystemzugriff auf eine explizite Allowlist statt eine implizite Blocklist beschränkt? | eine Blocklist kann unvollständig sein und unbekannte sensible Pfade übersehen |
| Explizite Netzwerk-Allowlist | ist der Netzwerkzugriff auf explizit erlaubte Ziele statt auf "alles außer bekannten schlechten Zielen" beschränkt? | eine Blocklist-basierte Netzwerkbegrenzung kann durch neue oder unbekannte Exfiltrationsziele umgangen werden |
| Getrennter Credential-Zugriffsraum | sind Zugangsdaten in einem separaten, für das Werkzeug standardmäßig nicht zugänglichen Bereich gespeichert? | Zugangsdaten im allgemeinen Dateisystem- oder Umgebungszugriff des Werkzeugs erhöhen das Exfiltrationsrisiko erheblich |
| Werkzeugtyp-spezifische Ausbruchsmodellierung | ist für jeden Werkzeugtyp (Code, Browser) das jeweils spezifische Ausbruchsrisiko explizit modelliert und adressiert? | ein generisches Sandboxing-Modell, das nicht zwischen Werkzeugtypen unterscheidet, kann typspezifische Ausbruchsvektoren übersehen |

Implementierung: Dateisystem- und Netzwerkzugriff werden konsequent als Allowlist statt als Blocklist implementiert — nur explizit erlaubte Pfade und Ziele sind zugänglich, alles andere ist standardmäßig verweigert. Zugangsdaten werden in einem getrennten Speicherbereich gehalten, auf den das Agentenwerkzeug nur bei expliziter, aufgabenspezifischer Notwendigkeit und mit minimalem Geltungsbereich zugreifen kann, nicht als Teil des allgemeinen Dateisystem- oder Umgebungszugriffs. Für Codewerkzeuge werden Systemaufrufe und Prozessrechte auf das für die Aufgabe notwendige Minimum beschränkt (Least Privilege). Für Browserwerkzeuge werden zusätzlich Mechanismen gegen clientseitige Skript- und Weiterleitungsrisiken implementiert, analog zu Prompt-Injection-Abwehrmaßnahmen bei der Verarbeitung von Webinhalten.

## Scalability, Reliability, Security und Observability

Agenten-Sandboxing skaliert Sicherheit unabhängig vom Vertrauen in das jeweilige Modell — die Reliability-Grenze liegt in unvollständigen Allowlists oder vermischten Credential-/Dateisystemzugriffsräumen, die auch bei einem gutartigen Modell durch einen einzelnen Implementierungsfehler zu einer Sicherheitsverletzung führen können.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Agentenwerkzeug greift auf eine Ressource außerhalb des beabsichtigten Aufgabenbereichs zu | die Sandbox verwendet eine unvollständige Blocklist statt einer expliziten Allowlist für Dateisystem oder Netzwerk | prüfen, ob der Zugriff über eine explizite Allowlist oder eine potenziell unvollständige Blocklist geregelt ist |
| Zugangsdaten erscheinen in Werkzeugausgaben oder Protokollen | Credential-Zugriffsraum ist nicht vom allgemeinen Dateisystem-/Umgebungszugriff des Werkzeugs getrennt | prüfen, ob Zugangsdaten in einem separaten, standardmäßig nicht zugänglichen Bereich gespeichert sind |
| ein Browserwerkzeug führt eine nicht beabsichtigte Aktion nach dem Laden einer manipulierten Seite aus | fehlende werkzeugtypspezifische Abwehr gegen clientseitige Skript- oder Weiterleitungsrisiken | prüfen, ob für Browserwerkzeuge spezifische Abwehrmaßnahmen gegen manipulierte Seiteninhalte implementiert sind |

Security: Die zentrale Regel ist, Sandboxing niemals als optionale Zusatzmaßnahme zu behandeln, die durch "vertrauenswürdiges" Modellverhalten ersetzt werden kann — die Sandbox muss unabhängig vom tatsächlichen Modellverhalten Schaden begrenzen. Observability: Häufigkeit abgelehnter Zugriffsversuche außerhalb der Allowlist (pro Dimension: Dateisystem, Netzwerk, Prozess), Häufigkeit von Zugriffsversuchen auf den Credential-Speicherbereich und werkzeugtypspezifische Ausbruchsversuchsindikatoren sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Dateisystem- und Netzwerkzugriff konsequent als Allowlist, nie als Blocklist. **Principal** macht Credential-Zugriffsräume und werkzeugtypspezifische Ausbruchsmodellierung für das Team nachvollziehbar dokumentiert. **Chief** positioniert Sandboxing als notwendige, vom Modellvertrauen unabhängige Isolationsgrenze für jede agentische Codeausführung.

Anti-Patterns: Dateisystem- oder Netzwerkzugriff über eine Blocklist statt eine Allowlist begrenzen; Zugangsdaten im allgemeinen Dateisystem- oder Umgebungszugriff des Werkzeugs belassen; Sandboxing als optional betrachten, weil das zugrunde liegende Modell als "vertrauenswürdig" gilt.

## Production Checklist

- [ ] Dateisystem- und Netzwerkzugriff sind als explizite Allowlist implementiert.
- [ ] Zugangsdaten liegen in einem separaten, standardmäßig nicht zugänglichen Speicherbereich.
- [ ] Prozessrechte sind auf das für die Aufgabe notwendige Minimum beschränkt.
- [ ] Werkzeugtypspezifische Ausbruchsrisiken (Code vs. Browser) sind explizit adressiert.

## Interviewfragen

### 1. Warum ist eine Allowlist für Dateisystem- und Netzwerkzugriff einer Blocklist vorzuziehen?

**Antwort:** Eine Blocklist kann unvollständig sein und unbekannte sensible Pfade oder Exfiltrationsziele übersehen; eine Allowlist verweigert standardmäßig alles außer explizit erlaubten Zielen und ist damit robuster gegenüber unbekannten Risiken.

### 2. Warum muss Credential-Zugriff separat vom allgemeinen Dateisystemzugriff begrenzt werden?

**Antwort:** Zugangsdaten, die Teil des allgemeinen Dateisystem- oder Umgebungszugriffs eines Werkzeugs sind, erhöhen das Exfiltrationsrisiko erheblich; ein getrennter, standardmäßig nicht zugänglicher Speicherbereich reduziert dieses Risiko gezielt.

### 3. Warum unterscheiden sich Ausbruchsrisiken zwischen Code- und Browserwerkzeugen?

**Antwort:** Ein Codewerkzeug kann über Systemaufrufe oder Umgebungsmanipulation versuchen auszubrechen, während ein Browserwerkzeug über clientseitige Skripte, Weiterleitungen oder manipulierte Seiteninhalte zu nicht beabsichtigten Aktionen verleitet werden kann — beide erfordern spezifische, unterschiedliche Abwehrmaßnahmen.

### 4. Warum ist Sandboxing unabhängig vom Vertrauen in das Modell notwendig?

**Antwort:** Modellverhalten ist nicht garantiert vorhersehbar; die Sandbox begrenzt Schaden unabhängig davon, ob das Modell erwartet oder unerwartet handelt, und macht Modellvertrauen für die Sicherheitsarchitektur irrelevant.

### 5. Wie diagnostizierst du einen Zugriff eines Agentenwerkzeugs außerhalb des beabsichtigten Aufgabenbereichs?

**Antwort:** Ich prüfe, ob der betroffene Zugriff über eine explizite Allowlist geregelt war oder ob eine möglicherweise unvollständige Blocklist die Begrenzung übernommen hat — Letzteres ist die wahrscheinlichste Ursache für einen unerwarteten Zugriff.

### 6. Widersprüchliche Anforderung: Team will maximale Werkzeugflexibilität (Zugriff auf beliebige Pfade und Ziele je nach Aufgabe) UND garantiert keine Sandbox-Ausbrüche — wie gehst du vor?

**Antwort:** Ich würde erklären, dass maximale Flexibilität und garantierte Isolation sich direkt widersprechen, wenn Flexibilität über eine breite, statische Allowlist erreicht werden soll; ich würde stattdessen vorschlagen, die Allowlist dynamisch und aufgabenspezifisch zur Laufzeit zu erweitern (nur für die Dauer und den Umfang der jeweiligen Aufgabe), statt dauerhaft einen breiten Zugriff zu gewähren.

## Praktische Labs

~~~python
# Sandbox with explicit filesystem/network allowlist and separate credential space
ALLOWED_PATHS = {"/workspace/project"}
ALLOWED_NETWORK_TARGETS = {"api.internal-service.local"}
CREDENTIAL_STORE = {"api_key": "secret-value"}  # NOT accessible via general filesystem access

def check_filesystem_access(requested_path):
    if not any(requested_path.startswith(allowed) for allowed in ALLOWED_PATHS):
        raise PermissionError(f"Filesystem access denied: '{requested_path}' not in allowlist")
    return f"Access granted: {requested_path}"

def check_network_access(target):
    if target not in ALLOWED_NETWORK_TARGETS:
        raise PermissionError(f"Network access denied: '{target}' not in allowlist")
    return f"Connection allowed: {target}"

def access_credential(tool_has_explicit_credential_grant):
    if not tool_has_explicit_credential_grant:
        raise PermissionError("Credential access denied: not part of general filesystem/environment access")
    return CREDENTIAL_STORE["api_key"]

print(check_filesystem_access("/workspace/project/output.txt"))
try:
    check_filesystem_access("/etc/passwd")
except PermissionError as e:
    print(f"Caught: {e}")

print(check_network_access("api.internal-service.local"))
try:
    check_network_access("attacker-exfil.example.com")
except PermissionError as e:
    print(f"Caught: {e}")

try:
    access_credential(tool_has_explicit_credential_grant=False)
except PermissionError as e:
    print(f"Caught: {e}")
~~~

## Dependencies, Cross-References und Quellen

1. OWASP: [OWASP Top 10 for LLM Applications — Excessive Agency](https://genai.owasp.org/llmrisk/llm08-excessive-agency/), abgerufen 2026-09-17.
2. Anthropic: [Claude Code Security — Sandboxing](https://docs.claude.com/en/docs/claude-code/security), abgerufen 2026-09-17.
3. NIST: [SP 800-190 — Application Container Security Guide](https://csrc.nist.gov/pubs/sp/800/190/final), abgerufen 2026-09-17.

Tool-Sicherheit (SSRF/Exfiltration) ist kanonisch in [KB-0262](../11-genai-architecture/22-sicherheit-von-ai-werkzeugen.md) behandelt; OpenAI Agents SDK/Harness in [KB-0282](08-openai-agents-sdk-und-harness.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| microVM-basierte Sandboxes (z. B. Firecracker-ähnliche Ansätze) für agentische Codeausführung mit stärkerer Kernel-Isolation als Container | Adopting | Gegenüber reiner Container-Isolation für höhere Sicherheitsgarantien bei vertretbarem Overhead bevorzugen. |
| Deklarative Sandbox-Manifeste, die Dateisystem-, Netzwerk- und Credential-Grenzen als versionierte Konfiguration statt als Code definieren | Adopting | Gegenüber im Code verstreuter Zugriffslogik für Nachvollziehbarkeit und Auditierbarkeit bevorzugen. |

Ein Team akzeptiert eine Sandboxing-Architektur erst, wenn Dateisystem-, Netzwerk- und Credential-Grenzen als explizite Allowlist dokumentiert und getestet sind.
