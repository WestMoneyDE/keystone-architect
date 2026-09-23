---
{"id": "KB-0299", "title": "Tool Permissions und Capability-Grenzen", "domain": "12", "sequence": 25, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0288", "concepts": ["Autorität und minimale Berechtigungen"], "needed_for": "understanding"}, {"id": "KB-0283", "concepts": ["Tool Use und Ergebnisverträge"], "needed_for": "understanding"}], "related": ["KB-0286"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Laufzeit-Enforcement implementieren, das erlaubte Operationen, Ressourcen und Parameter eines Tool-Aufrufs unabhängig vom Modellentscheid prüft.", "rationale": "Der Unterschied zwischen einer vom Modell vorgeschlagenen und einer tatsächlich autorisierten Toolausführung wird erst durch konkrete Implementierung eines unabhängigen Enforcements greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Capability-Grenzen für Tools so gestalten, dass sie erlaubte Operationen, Ressourcen und Parameter jeweils granular statt pauschal auf Tool-Ebene begrenzen.", "rationale": "Eine pauschale Erlaubnis auf Tool-Ebene kann weit über den tatsächlich benötigten Operations-, Ressourcen- oder Parameterumfang hinausgehen."}, "STAFF-TARGET": {"active": true, "scope": "Eine unautorisierte Toolausführung auf eine fehlende, vom Modellentscheid unabhängige Laufzeitprüfung statt auf ein allgemeines Modellverhalten zurückführen können.", "rationale": "Ein Modell kann eine Tool-Ausführung mit unerwarteten Parametern vorschlagen; ohne unabhängiges Laufzeit-Enforcement wird dieser Vorschlag ungeprüft ausgeführt."}, "CHIEF-TARGET": {"active": true, "scope": "Tool Permissions und Capability-Grenzen als vom Modellentscheid unabhängige Sicherheitsschicht positionieren, die unabhängig von der Modellqualität durchgesetzt werden muss.", "rationale": "Selbst ein qualitativ hochwertiges Modell kann fehlerhafte oder unerwartete Tool-Parameter vorschlagen; die Sicherheitsgarantie darf nicht von der Modellqualität abhängen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Policy-Engine-Implementierungsdetails sind Vertiefung.", "rationale": "Kern ist das Prinzip granularer, laufzeitdurchgesetzter Capability-Grenzen, nicht die konkrete Durchsetzungstechnologie."}}, "lab_validation": [{"lab_id": "KB-0299-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell eines Laufzeit-Enforcements, das Tool-Parameter unabhängig vom Modellvorschlag gegen Capability-Grenzen prüft", "evidence": "Ein vom Modell vorgeschlagener Tool-Aufruf mit einem nicht erlaubten Parameterwert wird durch eine unabhängige Laufzeitprüfung erkannt und abgelehnt, unabhängig davon, wie plausibel der Vorschlag des Modells erscheint.", "limitations": "Kein echtes Modell, kein produktives System, keine reale Policy-Engine."}]}
---
# Tool Permissions und Capability-Grenzen

> **Ziel:** Erlaubte Operationen, Ressourcen und Parameter eines Tool-Aufrufs müssen granular begrenzt und durch ein Laufzeit-Enforcement durchgesetzt werden, das unabhängig vom Modellentscheid arbeitet — aufbauend auf Autoritätsprinzipien (siehe [KB-0288](14-autoritaet-und-minimale-berechtigungen.md)) und Ergebnisverträgen (siehe [KB-0283](09-tool-use-und-ergebnisvertraege.md)). Der zentrale Punkt ist, dass ein Modell eine Toolausführung mit beliebigen Parametern vorschlagen kann — die tatsächliche Autorisierung darf niemals allein auf dem Modellvorschlag beruhen, sondern muss von einer unabhängigen Instanz geprüft werden.

## Zweck, Mental Model und Dependencies

Erlaubte Operationen definieren, welche konkreten Aktionen ein Tool ausführen darf (z. B. lesen, aber nicht schreiben). Erlaubte Ressourcen definieren, auf welche konkreten Ziele (Dateien, Datensätze, Endpunkte) sich diese Operationen beziehen dürfen. Erlaubte Parameter definieren die zulässigen Werte oder Wertebereiche für die Argumente eines Tool-Aufrufs. Der zentrale, oft übersehene Punkt ist, dass all diese drei Dimensionen granular, nicht pauschal auf Ebene des gesamten Tools begrenzt werden sollten — ein Tool, das pauschal für "Dateizugriff" autorisiert ist, sollte nicht automatisch auf alle Dateien mit allen Operationen zugreifen dürfen, sondern nur auf die spezifisch erlaubten Ressourcen mit den spezifisch erlaubten Operationen und Parametern. Laufzeit-Enforcement bedeutet, dass diese Grenzen bei jedem tatsächlichen Tool-Aufruf aktiv geprüft werden, unabhängig davon, was das zugrunde liegende Sprachmodell als Aufrufparameter vorschlägt — ein Modell kann durch fehlerhafte Ausgabe, durch Prompt Injection oder durch unerwartetes Verhalten einen Tool-Aufruf mit nicht autorisierten Parametern vorschlagen, und dieses Enforcement muss diesen Vorschlag unabhängig von der wahrgenommenen Plausibilität ablehnen können, wenn er die definierten Grenzen überschreitet.

~~~text
Allowed operations: WHICH concrete actions a tool may perform (read but not write, etc.)
Allowed resources: WHICH concrete targets (files, datasets, endpoints) those operations may target
Allowed parameters: valid values/ranges for tool call arguments
GRANULAR, not blanket per-tool: "file access" tool != automatic access to ALL files with ALL operations
Runtime enforcement: checked at EVERY actual tool call, INDEPENDENT of what the model proposes
  -> model can propose unauthorized params via bad output, prompt injection, unexpected behavior
  -> enforcement REJECTS regardless of how plausible the model's proposal looks
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Granulare Operationsbegrenzung | ist für jedes Tool definiert, welche konkreten Operationen (nicht nur pauschal "Zugriff") erlaubt sind? | eine pauschale Operationserlaubnis kann Aktionen zulassen, die weit über den tatsächlichen Bedarf hinausgehen |
| Granulare Ressourcenbegrenzung | ist definiert, auf welche konkreten Ressourcen sich die erlaubten Operationen beziehen dürfen? | eine pauschale Ressourcenerlaubnis kann Zugriff auf nicht beabsichtigte, sensible Ziele zulassen |
| Granulare Parameterbegrenzung | sind zulässige Werte oder Wertebereiche für Tool-Aufrufparameter explizit definiert? | ohne Parameterbegrenzung kann ein Tool-Aufruf mit unerwarteten, potenziell schädlichen Werten ausgeführt werden |
| Laufzeit-Enforcement unabhängig vom Modell | wird jeder tatsächliche Tool-Aufruf gegen diese Grenzen geprüft, unabhängig davon, was das Modell vorgeschlagen hat? | ohne unabhängiges Enforcement wird jeder Modellvorschlag implizit als autorisiert behandelt |

Implementierung: Für jedes Tool werden erlaubte Operationen, Ressourcen und Parameter granular und explizit definiert, statt eine pauschale Erlaubnis auf Tool-Ebene zu vergeben. Ein unabhängiges Laufzeit-Enforcement (z. B. eine Policy-Engine) prüft jeden tatsächlichen Tool-Aufruf gegen diese granularen Grenzen, bevor die Ausführung stattfindet — dieses Enforcement ist strukturell getrennt vom Modell, das den Aufruf vorschlägt, sodass ein fehlerhafter oder manipulierter Modellvorschlag die Prüfung nicht umgehen kann. Bei Überschreitung einer der drei Dimensionen (Operation, Ressource, Parameter) wird der Tool-Aufruf abgelehnt, unabhängig davon, wie plausibel der Vorschlag im Kontext der Konversation erscheinen mag.

## Scalability, Reliability, Security und Observability

Granulare Tool-Permission-Grenzen skalieren Sicherheit proportional zur Feinheit der Begrenzung; die Reliability-Grenze liegt in pauschalen, tool-weiten Erlaubnissen, die mit wachsender Tool-Funktionalität proportional mehr ungeprüften Handlungsspielraum eröffnen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Tool-Aufruf führt eine Operation aus, die für den beabsichtigten Anwendungsfall nicht vorgesehen war | pauschale statt granularer Operationsbegrenzung für das betroffene Tool | prüfen, ob die betroffene Operation explizit in den granularen Capability-Grenzen erlaubt war |
| ein Tool-Aufruf greift auf eine nicht beabsichtigte, sensible Ressource zu | pauschale statt granularer Ressourcenbegrenzung | prüfen, ob die betroffene Ressource explizit in den granularen Capability-Grenzen erlaubt war |
| ein vom Modell vorgeschlagener Tool-Aufruf mit unerwarteten Parametern wurde tatsächlich ausgeführt | fehlendes oder unzureichendes Laufzeit-Enforcement unabhängig vom Modellentscheid | prüfen, ob eine unabhängige Laufzeitprüfung der Parameter vor Ausführung stattgefunden hat |

Security: Die zentrale Sicherheitsregel ist, niemals einen Modellvorschlag implizit als autorisiert zu behandeln — jeder Tool-Aufruf muss unabhängig vom Modell gegen granulare Capability-Grenzen für Operation, Ressource und Parameter geprüft werden, analog zum Allowlist-Prinzip bei Sandboxing (siehe [KB-0286](12-agenten-sandboxing.md)). Observability: Häufigkeit abgelehnter Tool-Aufrufe pro Dimension (Operation, Ressource, Parameter), Verteilung tatsächlich genutzter gegenüber granular erlaubter Capability-Umfänge und Häufigkeit von Modellvorschlägen außerhalb der Capability-Grenzen sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** definiert für jedes Tool granulare, statt pauschale Capability-Grenzen für Operation, Ressource und Parameter. **Principal** macht das Laufzeit-Enforcement für das Team nachvollziehbar dokumentiert und unabhängig vom Modell verifizierbar. **Chief** positioniert Tool Permissions als vom Modellentscheid unabhängige Sicherheitsschicht, die unabhängig von der Modellqualität durchgesetzt werden muss.

Anti-Patterns: pauschale Erlaubnis auf Tool-Ebene ohne granulare Begrenzung von Operation, Ressource und Parameter vergeben; Tool-Aufrufe ohne unabhängiges Laufzeit-Enforcement ausführen und dem Modellvorschlag implizit vertrauen; Capability-Grenzen nur dokumentieren, ohne sie technisch durchzusetzen.

## Production Checklist

- [ ] Jedes Tool hat granulare, explizit definierte Grenzen für Operation, Ressource und Parameter.
- [ ] Ein unabhängiges Laufzeit-Enforcement prüft jeden tatsächlichen Tool-Aufruf gegen diese Grenzen.
- [ ] Das Enforcement ist strukturell getrennt vom Modell, das den Aufruf vorschlägt.
- [ ] Überschreitungen einer der drei Dimensionen führen zu einer abgelehnten Ausführung, nicht zu stillschweigender Anpassung.

## Interviewfragen

### 1. Warum reicht eine pauschale Erlaubnis auf Tool-Ebene nicht aus?

**Antwort:** Sie kann weit über den tatsächlich benötigten Operations-, Ressourcen- oder Parameterumfang hinausgehen; granulare Grenzen begrenzen den Handlungsspielraum auf das tatsächlich Notwendige.

### 2. Warum muss das Laufzeit-Enforcement unabhängig vom Modellentscheid sein?

**Antwort:** Ein Modell kann durch fehlerhafte Ausgabe, Prompt Injection oder unerwartetes Verhalten einen Tool-Aufruf mit nicht autorisierten Parametern vorschlagen; ein unabhängiges Enforcement erkennt und lehnt dies ab, unabhängig von der Modellqualität.

### 3. Welche drei Dimensionen begrenzen granulare Tool-Permissions?

**Antwort:** Erlaubte Operationen (welche Aktionen), erlaubte Ressourcen (welche Ziele) und erlaubte Parameter (welche Werte/Wertebereiche) — jede Dimension wird separat und granular begrenzt.

### 4. Warum ist die strukturelle Trennung zwischen Modell und Enforcement wichtig?

**Antwort:** Wenn das Enforcement Teil derselben Instanz wäre, die den Aufruf vorschlägt, könnte ein fehlerhafter oder manipulierter Modellvorschlag die Prüfung mit sich selbst umgehen; eine getrennte Instanz stellt unabhängige Prüfung sicher.

### 5. Wie diagnostizierst du eine unautorisierte Toolausführung mit unerwarteten Parametern?

**Antwort:** Ich prüfe, ob eine unabhängige Laufzeitprüfung der Parameter vor Ausführung stattgefunden hat — fehlt sie, wurde der Modellvorschlag wahrscheinlich implizit als autorisiert behandelt.

### 6. Widersprüchliche Anforderung: Team will maximale Modellflexibilität bei der Wahl von Tool-Parametern für kreative Problemlösung UND garantiert keine Ausführung außerhalb granular definierter Capability-Grenzen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass Flexibilität innerhalb granularer Grenzen möglich ist, ohne diese Grenzen selbst aufzuheben; ich würde vorschlagen, die erlaubten Wertebereiche für Parameter bewusst großzügig, aber weiterhin explizit und geprüft zu definieren, statt auf jegliche Parameterbegrenzung zugunsten der Flexibilität zu verzichten.

## Praktische Labs

~~~python
# Runtime enforcement of tool permissions, independent of model-proposed call
TOOL_CAPABILITIES = {
    "file_reader": {
        "allowed_operations": {"read"},
        "allowed_resources": {"/workspace/reports/"},
        "allowed_parameters": {"max_size_mb": (0, 10)},
    }
}

def enforce_tool_call(tool_name, operation, resource, parameters):
    capability = TOOL_CAPABILITIES.get(tool_name)
    if capability is None:
        raise ValueError(f"Unknown tool: '{tool_name}'")
    if operation not in capability["allowed_operations"]:
        raise PermissionError(f"Operation '{operation}' not allowed for tool '{tool_name}'")
    if not any(resource.startswith(r) for r in capability["allowed_resources"]):
        raise PermissionError(f"Resource '{resource}' not in allowed resources for tool '{tool_name}'")
    for param_name, value in parameters.items():
        allowed_range = capability["allowed_parameters"].get(param_name)
        if allowed_range and not (allowed_range[0] <= value <= allowed_range[1]):
            raise PermissionError(f"Parameter '{param_name}'={value} outside allowed range {allowed_range}")
    return f"Tool call authorized: {tool_name}.{operation}('{resource}', {parameters})"

model_proposed_call = {
    "tool_name": "file_reader", "operation": "read",
    "resource": "/workspace/reports/q3.pdf", "parameters": {"max_size_mb": 5},
}
print(enforce_tool_call(**model_proposed_call))

malicious_or_erroneous_call = {
    "tool_name": "file_reader", "operation": "write",  # not allowed
    "resource": "/workspace/reports/q3.pdf", "parameters": {"max_size_mb": 5},
}
try:
    enforce_tool_call(**malicious_or_erroneous_call)
except PermissionError as e:
    print(f"Caught (independent of model plausibility): {e}")
~~~

## Dependencies, Cross-References und Quellen

1. OWASP: [OWASP Top 10 for LLM Applications — Excessive Agency](https://genai.owasp.org/llmrisk/llm08-excessive-agency/), abgerufen 2026-09-17.
2. NIST: [SP 800-207 — Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final), abgerufen 2026-09-17.
3. OASIS: [XACML — Policy-Based Access Control Standard](https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=xacml), abgerufen 2026-09-17.

Autorität und minimale Berechtigungen sind kanonisch in [KB-0288](14-autoritaet-und-minimale-berechtigungen.md) behandelt; Tool Use und Ergebnisverträge in [KB-0283](09-tool-use-und-ergebnisvertraege.md); Agenten-Sandboxing in [KB-0286](12-agenten-sandboxing.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Deklarative Capability-Manifeste, die Operation, Ressource und Parameter pro Tool als versionierte Konfiguration definieren | Adopting | Gegenüber im Code verstreuter Berechtigungslogik für Nachvollziehbarkeit und Auditierbarkeit bevorzugen. |
| Automatisierte Ableitung minimaler Capability-Grenzen aus beobachtetem, tatsächlichem Tool-Nutzungsverhalten | Emerging | Beobachten; vielversprechend für datengestützte Rechteminimierung, aber noch nicht breit etabliert. |

Ein Team akzeptiert eine Tool-Permission-Architektur erst, wenn granulare Capability-Grenzen und unabhängiges Laufzeit-Enforcement für jedes Tool dokumentiert und getestet sind.
