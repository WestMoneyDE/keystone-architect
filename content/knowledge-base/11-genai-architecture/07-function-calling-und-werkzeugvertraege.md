---
{"id": "KB-0247", "title": "Function Calling und Werkzeugverträge", "domain": "11", "sequence": 7, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0246", "concepts": ["Strukturierte Modellausgaben"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Modell zur strikten Trennung von Modellvorschlag und autorisierter Ausführung eines Funktionsaufrufs lokal implementieren.", "rationale": "Der Unterschied zwischen 'Modell schlägt Aufruf vor' und 'System führt Aufruf tatsächlich aus' wird erst durch explizite Trennung der beiden Schritte greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Tool-Schemas und Argumentvalidierung für einen konkreten Function-Calling-Anwendungsfall begründet gestalten, mit expliziter Autorisierungsschicht vor Ausführung.", "rationale": "Ein Tool-Vertrag muss sowohl die Struktur des Aufrufs als auch die Bedingungen für tatsächliche Ausführung mit Seiteneffekten definieren."}, "STAFF-TARGET": {"active": true, "scope": "Einen unerwarteten Seiteneffekt (z. B. eine ungewollte Datenänderung) auf eine fehlende Autorisierungsschicht statt auf einen Modellfehler zurückführen können.", "rationale": "Ein Modell, das einen Funktionsaufruf vorschlägt, hat diesen nicht automatisch ausgeführt — fehlende Trennung zwischen Vorschlag und Ausführung ist eine Architektur-, keine Modelllücke."}, "CHIEF-TARGET": {"active": true, "scope": "Function Calling als Vertragsbeziehung zwischen Modellvorschlag und autorisierter Systemausführung positionieren, nicht als direkte Modell-zu-Aktion-Kopplung.", "rationale": "Die strikte Trennung zwischen Vorschlag und Ausführung ist eine fundamentale Sicherheits- und Kontrollarchitektur-Entscheidung."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Anbieterspezifische Function-Calling-API-Syntax ist Vertiefung.", "rationale": "Kern ist das Prinzip der Trennung von Vorschlag und autorisierter Ausführung, nicht die API-Syntax."}}, "lab_validation": [{"lab_id": "KB-0247-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für strikte Trennung von Modellvorschlag und autorisierter Funktionsausführung", "evidence": "Ein vom Modell vorgeschlagener Funktionsaufruf wird zunächst gegen Argumentvalidierung und Autorisierungsregeln geprüft, bevor die tatsächliche Ausführung mit realen Seiteneffekten erfolgt — der Vorschlag allein löst keine Aktion aus.", "limitations": "Kein echtes produktives Function-Calling-System, keine reale externe API, keine Produktion."}]}
---
# Function Calling und Werkzeugverträge

> **Ziel:** Ein Modell, das einen Funktionsaufruf "vorschlägt", hat diesen nicht automatisch ausgeführt — die strikte Trennung zwischen Modellvorschlag und autorisierter Systemausführung mit realen Seiteneffekten ist eine fundamentale Architektur- und Sicherheitsentscheidung, keine Modelleigenschaft. Tool-Schemas definieren die Struktur eines Aufrufs; Argumentvalidierung und Autorisierung entscheiden, ob er tatsächlich ausgeführt wird.

## Zweck, Mental Model und Dependensies

Tool-Schemas (ähnlich strukturierten Modellausgaben, siehe [KB-0246](06-strukturierte-modellausgaben.md)) definieren, welche Funktionen ein Modell "aufrufen" kann und mit welchen Parametern — das Modell generiert basierend auf diesem Schema einen strukturierten Vorschlag (Funktionsname plus Argumente), der schema-konform sein sollte, aber genau wie bei strukturierten Ausgaben nicht automatisch fachlich korrekt oder sicher ausführbar ist. Der zentrale Architekturprinzip ist die strikte Trennung zwischen Modellvorschlag und tatsächlicher Ausführung: das Modell selbst führt keine Aktion aus, es generiert lediglich einen strukturierten Vorschlag, den das umgebende System (nicht das Modell) tatsächlich interpretiert, validiert, autorisiert und gegebenenfalls ausführt. Argumentvalidierung prüft, ob die vom Modell vorgeschlagenen Parameter dem erwarteten Schema und fachlichen Constraints entsprechen (ähnlich der zweistufigen Schema-/Semantik-Validierung bei strukturierten Ausgaben). Autorisierung ist ein zusätzlicher, unabhängiger Schritt, der prüft, ob die vorgeschlagene Aktion im aktuellen Kontext tatsächlich erlaubt werden soll (z. B. hat der aktuelle Nutzer die Berechtigung, hat das System genug Vertrauen in den Vorschlag, ist eine Bestätigung durch einen Menschen nötig) — erst nach erfolgreicher Validierung UND Autorisierung wird die Funktion mit realen Seiteneffekten tatsächlich ausgeführt, und das Ergebnis wird dem Modell für die weitere Konversation zurückgegeben.

~~~text
Model proposes:   generates structured function call suggestion (name + arguments) based on tool schema
System validates:  argument validation (schema + semantic correctness)
System authorizes: separate check - is THIS proposed action allowed in THIS context, by THIS user, right now?
System executes:   ONLY after validation AND authorization -> real side effect happens
Model NEVER directly executes anything - it only proposes. The system decides and acts.
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Trennung Vorschlag/Ausführung | ist strukturell sichergestellt, dass ein Modellvorschlag nicht automatisch zu Ausführung führt? | fehlende Trennung erlaubt dem Modell effektiv, unautorisierte Aktionen direkt auszulösen |
| Argumentvalidierung | werden vorgeschlagene Parameter gegen Schema und fachliche Constraints geprüft, bevor Ausführung erwogen wird? | ungeprüfte Argumente können zu fehlerhafter oder gefährlicher Funktionsausführung führen |
| Autorisierungsschicht | ist ein unabhängiger Autorisierungsschritt vorhanden, der über reine Argumentgültigkeit hinausgeht? | ein gültiger, aber nicht autorisierter Aufruf (z. B. außerhalb der Nutzerberechtigung) wird trotzdem ausgeführt |
| Ergebnisrückgabe-Integrität | wird das tatsächliche Ausführungsergebnis (nicht eine Annahme) an das Modell zurückgegeben? | Modell trifft nachfolgende Entscheidungen basierend auf einem angenommenen statt tatsächlichen Ergebnis |

Implementierung: die Systemarchitektur trennt strukturell zwischen dem Punkt, an dem ein Modellvorschlag generiert wird, und dem Punkt, an dem eine tatsächliche Funktion mit realen Seiteneffekten ausgeführt wird — dazwischen liegt immer mindestens ein Validierungs- und ein Autorisierungsschritt, die vom System, nicht vom Modell, kontrolliert werden. Argumentvalidierung prüft sowohl strukturelle Korrektheit (Schema) als auch fachliche Plausibilität der vorgeschlagenen Parameter. Autorisierung wird als unabhängige Prüfung implementiert, die kontextabhängige Faktoren berücksichtigt (Nutzerberechtigung, Risikograd der Aktion, eventuell erforderliche menschliche Bestätigung bei hochriskanten Aktionen), unabhängig davon, ob die Argumente selbst valide sind. Nach tatsächlicher Ausführung wird das reale Ergebnis (nicht eine vom System angenommene Erfolgsmeldung) strukturiert an das Modell zurückgegeben, damit nachfolgende Modellentscheidungen auf tatsächlichem, nicht angenommenem Zustand basieren.

## Scalability, Reliability, Security und Observability

Function-Calling-Architektur mit strikter Vorschlag-/Ausführungstrennung skaliert Kontrolle über wachsende Anzahl möglicher Aktionen und Werkzeuge, weil jede neue Funktion durch dieselbe zentrale Validierungs-/Autorisierungsschicht laufen muss, statt individuell vertraut zu werden. Reliability-Grenze: eine Architektur ohne diese Trennung ist ein kritisches, oft unterschätztes Risiko — ein Modellvorschlag, der direkt zu Ausführung führt, kann bei fehlerhafter oder manipulierter Modellausgabe unmittelbar reale, potenziell irreversible Seiteneffekte auslösen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine unerwartete Datenänderung oder Aktion ist aufgetreten, ohne dass ein Mensch sie explizit bestätigt hat | fehlende oder unzureichende Autorisierungsschicht zwischen Modellvorschlag und Ausführung | prüfen, ob die betroffene Aktion tatsächlich eine unabhängige Autorisierungsprüfung durchlaufen hat |
| eine Funktion wurde mit fachlich unplausiblen Argumenten ausgeführt | Argumentvalidierung prüfte nur Schema-Konformität, nicht fachliche Plausibilität | Validierungslogik auf zweistufige Prüfung (Schema plus Semantik) für die betroffenen Argumente prüfen |
| das Modell trifft nachfolgende Entscheidungen basierend auf einem falschen Ausführungsergebnis | dem Modell wurde ein angenommenes statt das tatsächliche Ausführungsergebnis zurückgegeben | Rückgabepfad auf Übermittlung des tatsächlichen, nicht angenommenen Ergebnisses prüfen |
| dieselbe riskante Aktion wird wiederholt ohne erneute Autorisierungsprüfung ausgeführt | Autorisierung wird nur einmalig, nicht pro Ausführungsanfrage geprüft | Autorisierungslogik auf Prüfung bei jeder einzelnen Ausführungsanfrage statt einmaliger Freigabe prüfen |

Security: die Trennung zwischen Modellvorschlag und autorisierter Ausführung ist die zentrale Sicherheitsgrenze gegen Prompt-Injection-basierte unautorisierte Aktionen — selbst wenn ein manipulierter Kontext das Modell dazu bringt, einen schädlichen Funktionsaufruf vorzuschlagen, verhindert eine korrekt implementierte Autorisierungsschicht die tatsächliche Ausführung. Observability: Verhältnis vorgeschlagener zu tatsächlich autorisierten und ausgeführten Funktionsaufrufe, Autorisierungsablehnungsrate und Häufigkeit menschlicher Bestätigungsanfragen bei hochriskanten Aktionen sind zentrale Metriken für Function-Calling-Sicherheit.

## Trade-offs und Entscheidungen

**Staff** implementiert die Trennung zwischen Modellvorschlag und Ausführung strukturell, nicht nur als Konvention. **Principal** macht Autorisierungsentscheidungen für das Team nachvollziehbar dokumentiert, getrennt von reiner Argumentvalidierung. **Chief** positioniert Function Calling als Vertragsbeziehung mit unabhängiger Autorisierungsschicht, nicht als direkte Modell-zu-Aktion-Kopplung.

Anti-Patterns: Modellvorschläge direkt ohne Autorisierungsschicht ausführen; Argumentvalidierung auf reine Schema-Prüfung beschränken, ohne fachliche Plausibilität zu prüfen; dem Modell ein angenommenes statt das tatsächliche Ausführungsergebnis zurückgeben.

## Production Checklist

- [ ] Modellvorschlag und tatsächliche Ausführung sind strukturell getrennt, mit Validierungs- und Autorisierungsschritt dazwischen.
- [ ] Argumentvalidierung prüft sowohl Schema als auch fachliche Plausibilität.
- [ ] Autorisierung ist ein unabhängiger, kontextabhängiger Prüfschritt, nicht durch Argumentgültigkeit ersetzt.
- [ ] Dem Modell wird das tatsächliche, nicht ein angenommenes Ausführungsergebnis zurückgegeben.

## Interviewfragen

### 1. Warum ist die strikte Trennung zwischen Modellvorschlag und tatsächlicher Ausführung fundamental für Function Calling?

**Antwort:** Ein Modell generiert nur einen strukturierten Vorschlag, führt aber selbst keine Aktion aus; ohne strukturelle Trennung mit Validierung und Autorisierung dazwischen könnte ein fehlerhafter oder manipulierter Modellvorschlag direkt zu unautorisierten, potenziell irreversiblen Seiteneffekten führen.

### 2. Was ist der Unterschied zwischen Argumentvalidierung und Autorisierung?

**Antwort:** Argumentvalidierung prüft, ob die vorgeschlagenen Parameter strukturell und fachlich korrekt sind; Autorisierung ist ein unabhängiger Schritt, der prüft, ob die vorgeschlagene Aktion im aktuellen Kontext (Nutzerberechtigung, Risikograd) tatsächlich erlaubt werden soll — valide Argumente bedeuten nicht automatisch Autorisierung.

### 3. Wie diagnostizierst du eine unerwartete Datenänderung, die ohne menschliche Bestätigung aufgetreten ist?

**Antwort:** Ich prüfe, ob die betroffene Aktion tatsächlich eine unabhängige Autorisierungsprüfung durchlaufen hat — eine fehlende oder unzureichende Autorisierungsschicht zwischen Modellvorschlag und Ausführung ist die wahrscheinlichste Ursache für unautorisierte Seiteneffekte.

### 4. Warum ist die Trennung von Vorschlag und Ausführung eine zentrale Sicherheitsgrenze gegen Prompt-Injection?

**Antwort:** Selbst wenn ein manipulierter Kontext das Modell dazu bringt, einen schädlichen Funktionsaufruf vorzuschlagen, verhindert eine korrekt implementierte, unabhängige Autorisierungsschicht die tatsächliche Ausführung — der Vorschlag allein hat keine Wirkung ohne diese zusätzliche Kontrolle.

### 5. Warum muss dem Modell das tatsächliche, nicht ein angenommenes Ausführungsergebnis zurückgegeben werden?

**Antwort:** Nachfolgende Modellentscheidungen basieren auf dem zurückgegebenen Ergebnis; wenn ein angenommenes statt tatsächliches Ergebnis übermittelt wird, kann das Modell auf einem falschen Systemzustand aufbauende, fehlerhafte Folgeentscheidungen treffen.

### 6. Widersprüchliche Anforderung: Team will maximale Automatisierung (keine menschliche Bestätigung nötig) UND garantierten Schutz vor unautorisierten, potenziell schädlichen Aktionen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass vollständige Automatisierung ohne jegliche menschliche Kontrolle bei hochriskanten Aktionen das Schutzziel gefährdet; ich würde eine risikobasierte Autorisierungsstrategie vorschlagen, bei der niedrigrisikante Aktionen automatisch autorisiert werden, während hochriskante oder irreversible Aktionen weiterhin eine explizite menschliche Bestätigung erfordern, um einen bewussten Kompromiss zwischen Automatisierungsgrad und Schutzniveau zu erreichen.

## Praktische Labs

~~~python
# Strict separation between model proposal and authorized execution
def model_proposes_call(user_request):
    # simplified: model "suggests" a function call - THIS IS NOT EXECUTION
    return {"function": "delete_account", "arguments": {"account_id": "acc-123"}}

def validate_arguments(proposal, schema):
    required = schema.get("required_args", [])
    return all(arg in proposal["arguments"] for arg in required)

def authorize_action(proposal, user_role, risk_registry):
    risk_level = risk_registry.get(proposal["function"], "low")
    if risk_level == "high" and user_role != "admin":
        return False, "high-risk action requires admin authorization"
    return True, "authorized"

def execute_if_authorized(proposal, user_role):
    schema = {"required_args": ["account_id"]}
    risk_registry = {"delete_account": "high"}

    if not validate_arguments(proposal, schema):
        return "REJECTED: invalid arguments"

    authorized, reason = authorize_action(proposal, user_role, risk_registry)
    if not authorized:
        return f"REJECTED: {reason}"

    return f"EXECUTED: {proposal['function']} with {proposal['arguments']}"

proposal = model_proposes_call("please delete this account")
result_as_regular_user = execute_if_authorized(proposal, user_role="regular_user")
result_as_admin = execute_if_authorized(proposal, user_role="admin")

print(f"Model's proposal was NOT executed automatically.")
print(f"As regular_user: {result_as_regular_user}")
print(f"As admin: {result_as_admin}")
assert "REJECTED" in result_as_regular_user
assert "EXECUTED" in result_as_admin
~~~

## Dependencies, Cross-References und Quellen

1. Anthropic: [Tool Use — Best Practices](https://docs.anthropic.com/en/docs/build-with-claude/tool-use), abgerufen 2026-09-17.
2. OpenAI: [Function Calling Guide](https://platform.openai.com/docs/guides/function-calling), abgerufen 2026-09-17.
3. OWASP: [LLM Excessive Agency Risks](https://owasp.org/www-project-top-10-for-large-language-model-applications/), abgerufen 2026-09-17.

Strukturierte-Ausgaben-Grundlagen sind kanonisch in [KB-0246](06-strukturierte-modellausgaben.md) behandelt. Anbieterspezifische Function-Calling-API-Syntax vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Risikobasierte, abgestufte Autorisierungs-Frameworks mit automatischer Eskalation bei hochriskanten Aktionen | Adopting | Für Anwendungsfälle mit gemischtem Risikoprofil gegenüber einheitlicher Autorisierungsregel für alle Aktionen bevorzugen. |
| Sandboxed Function-Execution-Umgebungen zur Begrenzung des Blast Radius fehlerhafter Ausführungen | Established | Für Funktionen mit potenziell weitreichenden Seiteneffekten standardmäßig einsetzen. |

Ein Team akzeptiert eine Function-Calling-Integration erst, wenn die Trennung zwischen Modellvorschlag und autorisierter Ausführung nachweisbar strukturell implementiert und getestet ist.
