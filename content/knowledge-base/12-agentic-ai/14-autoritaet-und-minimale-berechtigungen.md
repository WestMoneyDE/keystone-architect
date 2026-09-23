---
{"id": "KB-0288", "title": "Autorität und minimale Berechtigungen", "domain": "12", "sequence": 14, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0287", "concepts": ["Agent Identity und Service Identity"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Prüfung implementieren, die eine versuchte Rechteausweitung oder unautorisierte Weiterdelegation erkennt und ablehnt.", "rationale": "Das Risiko von Rechteausweitung und Weiterdelegation wird erst durch konkrete Implementierung einer Erkennungsprüfung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein Autoritätsmodell gestalten, das Handlungsumfang, Delegation und zeitliche Begrenzung als überprüfbare, durchsetzbare Grenzen statt als reine Dokumentation ausdrückt.", "rationale": "Eine überprüfbare Grenze muss zur Laufzeit durchsetzbar sein, nicht nur beschrieben werden."}, "STAFF-TARGET": {"active": true, "scope": "Eine unautorisierte Aktion auf eine nicht durchgesetzte Rechteausweitungs- oder Weiterdelegationsgrenze statt auf ein allgemeines Autorisierungsproblem zurückführen können.", "rationale": "Rechteausweitung und unautorisierte Weiterdelegation sind spezifische, erkennbare Muster, keine diffusen Autorisierungsfehler."}, "CHIEF-TARGET": {"active": true, "scope": "Minimale Berechtigungen und überprüfbare Autoritätsgrenzen als Grundprinzip für jede agentische Handlungsbefugnis positionieren.", "rationale": "Ohne durchsetzbare Grenzen für Handlungsumfang, Delegation und Zeitraum kann agentische Autorität sich unkontrolliert ausweiten."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Policy-Engine-Implementierungsdetails sind Vertiefung.", "rationale": "Kern ist das Prinzip überprüfbarer Autoritätsgrenzen, nicht die konkrete Durchsetzungstechnologie."}}, "lab_validation": [{"lab_id": "KB-0288-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell einer Autoritätsprüfung, die Rechteausweitung und Weiterdelegation ohne explizite Zustimmung ablehnt", "evidence": "Ein Agent, der versucht, eine ihm nicht delegierte Berechtigung auszuüben oder seine Berechtigung an einen weiteren Agenten weiterzudelegieren, wird durch eine explizite Prüfung des Handlungsumfangs erkannt und abgelehnt.", "limitations": "Keine echte Policy-Engine, kein produktives System, keine reale Zustimmungsinfrastruktur."}]}
---
# Autorität und minimale Berechtigungen

> **Ziel:** Ein Autoritätsmodell drückt Handlungsumfang, Delegation und zeitliche Begrenzung als überprüfbare, zur Laufzeit durchsetzbare Grenzen aus — aufbauend auf der Trennung von Agent-, Nutzer- und Workload-Identität (siehe [KB-0287](13-agent-identity-und-service-identity.md)). Fehlende Zustimmung, Rechteausweitung (ein Agent überschreitet seinen zugewiesenen Handlungsumfang) und unautorisierte Weiterdelegation (ein Agent delegiert seine Berechtigung an einen weiteren Agenten, ohne dass dies vorgesehen war) sind konkrete, erkennbare Grenzverletzungen, die explizit geprüft werden müssen.

## Zweck, Mental Model und Dependencies

Handlungsumfang definiert, welche konkreten Aktionen ein Agent mit einer delegierten Berechtigung tatsächlich ausführen darf — nicht nur, welche Ressource er theoretisch erreichen könnte. Delegation (siehe [KB-0287](13-agent-identity-und-service-identity.md)) legt fest, von wem eine Berechtigung stammt und für welche Aufgabe sie gilt. Zeitliche Begrenzung stellt sicher, dass eine Berechtigung nach Ablauf einer Aufgabe oder eines definierten Zeitraums automatisch ungültig wird. Der zentrale, praxisrelevante Punkt ist, diese drei Dimensionen nicht nur zu dokumentieren, sondern als tatsächlich überprüfbare Grenzen zu implementieren: Fehlende Zustimmung bedeutet, dass eine Aktion ausgeführt wird, ohne dass die notwendige explizite Zustimmung (z. B. eines Nutzers oder eines übergeordneten Prozesses) tatsächlich vorlag — dies muss zur Laufzeit prüfbar sein, nicht nur als Prozessvorgabe angenommen werden. Rechteausweitung tritt auf, wenn ein Agent versucht, eine Aktion auszuführen, die über den ihm explizit zugewiesenen Handlungsumfang hinausgeht — dies muss durch eine aktive Prüfung erkannt und abgelehnt werden, nicht durch nachträgliche Analyse. Weiterdelegation tritt auf, wenn ein Agent versucht, seine eigene Berechtigung an einen anderen Agenten weiterzugeben — dies ist nur zulässig, wenn die ursprüngliche Delegation dies explizit erlaubt, und muss ansonsten aktiv verhindert werden.

~~~text
Scope of action: WHICH concrete actions are permitted with a delegated permission (not just theoretical reach)
Delegation (KB-0287): WHO granted it, FOR WHAT task
Time boundary: permission auto-expires after task/period ends
MUST be RUNTIME-ENFORCEABLE, not just documented:
  Missing consent: action executed WITHOUT actually-verified required consent
  Privilege escalation: agent attempts action BEYOND its assigned scope -> must be ACTIVELY detected + rejected
  Re-delegation: agent attempts to pass its permission to ANOTHER agent -> only allowed if ORIGINAL delegation permits it
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Laufzeitprüfung des Handlungsumfangs | wird bei jeder Aktion aktiv geprüft, ob sie innerhalb des zugewiesenen Handlungsumfangs liegt? | ohne aktive Prüfung kann ein Agent Aktionen außerhalb seines beabsichtigten Umfangs unbemerkt ausführen |
| Explizite Zustimmungsverifikation | wird vor einer zustimmungspflichtigen Aktion tatsächlich geprüft, ob die erforderliche Zustimmung vorliegt, statt sie anzunehmen? | eine angenommene statt verifizierte Zustimmung kann eine tatsächlich nicht autorisierte Aktion ermöglichen |
| Weiterdelegationskontrolle | ist explizit geprüft, ob die ursprüngliche Delegation eine Weiterdelegation an einen anderen Agenten überhaupt erlaubt? | eine unkontrollierte Weiterdelegation kann die Autoritätskette undurchsichtig und unkontrollierbar machen |
| Automatischer Ablauf zeitlich begrenzter Berechtigungen | läuft eine zeitlich begrenzte Berechtigung tatsächlich automatisch ab, statt manuell widerrufen werden zu müssen? | eine nicht automatisch ablaufende Berechtigung kann nach Aufgabenabschluss unbeabsichtigt weiterbestehen |

Implementierung: Jede agentische Aktion wird vor Ausführung gegen den explizit zugewiesenen Handlungsumfang geprüft, nicht nur gegen eine generelle Berechtigung. Zustimmungspflichtige Aktionen erfordern eine tatsächliche, verifizierbare Zustimmungsbestätigung (z. B. ein kryptografisch nachvollziehbarer Zustimmungsnachweis oder ein protokollierter Human-Gate-Schritt), nicht eine angenommene Zustimmung. Weiterdelegation wird standardmäßig verweigert und nur dann erlaubt, wenn die ursprüngliche Delegation dies explizit als zulässig markiert. Zeitlich begrenzte Berechtigungen werden mit einem technischen Ablaufmechanismus versehen, der die Berechtigung automatisch ungültig macht, ohne dass eine manuelle Widerrufsaktion notwendig ist.

## Scalability, Reliability, Security und Observability

Überprüfbare Autoritätsgrenzen skalieren Sicherheit proportional zur Konsequenz ihrer Laufzeitdurchsetzung; die Reliability-Grenze liegt in Grenzen, die nur dokumentiert, aber nicht technisch durchgesetzt werden — solche Grenzen bieten keinen tatsächlichen Schutz gegen Rechteausweitung oder unautorisierte Weiterdelegation.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Agent führt eine Aktion außerhalb seines dokumentierten Handlungsumfangs erfolgreich aus | die Handlungsumfangsprüfung wird nicht tatsächlich zur Laufzeit durchgesetzt, sondern nur dokumentiert | prüfen, ob eine aktive, technische Prüfung des Handlungsumfangs vor der Aktion stattgefunden hat |
| eine zustimmungspflichtige Aktion wurde ohne tatsächlich vorliegende Zustimmung ausgeführt | Zustimmung wurde angenommen statt verifiziert | prüfen, ob ein verifizierbarer Zustimmungsnachweis für die betroffene Aktion existiert |
| ein Agent hat seine Berechtigung erfolgreich an einen anderen Agenten weitergegeben, obwohl dies nicht vorgesehen war | fehlende Weiterdelegationskontrolle bei der ursprünglichen Delegation | prüfen, ob die ursprüngliche Delegation Weiterdelegation explizit erlaubt oder verboten hat |

Security: Die zentrale Sicherheitsregel ist, dass Autoritätsgrenzen niemals nur als Dokumentation oder Prozessvorgabe existieren dürfen — sie müssen als technisch durchgesetzte, zur Laufzeit geprüfte Kontrollen implementiert sein, da ein Agent (im Gegensatz zu einem menschlichen Prozessbeteiligten) Prozessvorgaben ohne technische Durchsetzung nicht zuverlässig einhält. Observability: Häufigkeit abgelehnter Rechteausweitungsversuche, Häufigkeit abgelehnter unautorisierter Weiterdelegationsversuche und Häufigkeit automatisch abgelaufener, zeitlich begrenzter Berechtigungen sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Handlungsumfang, Zustimmung und zeitliche Begrenzung immer als technisch durchgesetzte, nicht nur dokumentierte Grenzen. **Principal** macht Weiterdelegationsregeln für jede Delegation für das Team nachvollziehbar dokumentiert. **Chief** positioniert überprüfbare Autoritätsgrenzen als Grundprinzip für jede agentische Handlungsbefugnis.

Anti-Patterns: Handlungsumfang, Zustimmung oder zeitliche Begrenzung nur dokumentieren, ohne technische Durchsetzung; Zustimmung annehmen statt verifizieren; Weiterdelegation standardmäßig erlauben statt standardmäßig zu verweigern.

## Production Checklist

- [ ] Der Handlungsumfang jeder agentischen Aktion wird zur Laufzeit technisch geprüft.
- [ ] Zustimmungspflichtige Aktionen erfordern einen verifizierbaren Zustimmungsnachweis.
- [ ] Weiterdelegation ist standardmäßig verweigert und nur bei expliziter Erlaubnis der ursprünglichen Delegation zulässig.
- [ ] Zeitlich begrenzte Berechtigungen laufen automatisch technisch ab.

## Interviewfragen

### 1. Warum reicht eine dokumentierte Autoritätsgrenze allein nicht aus?

**Antwort:** Ein Agent hält Prozessvorgaben ohne technische Durchsetzung nicht zuverlässig ein; die Grenze muss zur Laufzeit tatsächlich geprüft und durchgesetzt werden, um Rechteausweitung oder unautorisierte Aktionen zu verhindern.

### 2. Was ist der Unterschied zwischen angenommener und verifizierter Zustimmung?

**Antwort:** Angenommene Zustimmung geht davon aus, dass eine notwendige Freigabe vorlag, ohne dies zu prüfen; verifizierte Zustimmung erfordert einen tatsächlich nachprüfbaren Zustimmungsnachweis vor Ausführung der Aktion.

### 3. Warum sollte Weiterdelegation standardmäßig verweigert werden?

**Antwort:** Eine unkontrollierte Weiterdelegation kann die Autoritätskette undurchsichtig machen; sie sollte nur zulässig sein, wenn die ursprüngliche Delegation dies explizit erlaubt.

### 4. Warum ist automatischer Ablauf zeitlich begrenzter Berechtigungen wichtig?

**Antwort:** Ohne automatischen, technisch durchgesetzten Ablauf kann eine Berechtigung nach Abschluss der ursprünglichen Aufgabe unbeabsichtigt weiterbestehen und später missbraucht werden.

### 5. Wie diagnostizierst du eine erfolgreiche Rechteausweitung durch einen Agenten?

**Antwort:** Ich prüfe, ob vor der betroffenen Aktion eine aktive, technische Prüfung des Handlungsumfangs stattgefunden hat — fehlt sie, war die Grenze nur dokumentiert, nicht durchgesetzt.

### 6. Widersprüchliche Anforderung: Team will maximale Agentenautonomie ohne wiederholte Zustimmungsabfragen UND garantiert keine Aktion ohne tatsächlich verifizierte Zustimmung — wie gehst du vor?

**Antwort:** Ich würde erklären, dass Autonomie und Zustimmungsverifikation sich nicht gegenseitig ausschließen, wenn Zustimmung im Voraus für einen klar definierten, begrenzten Handlungsumfang erteilt wird; ich würde vorschlagen, eine einmalige, aufgabenspezifische Zustimmung mit klar begrenztem Umfang und Zeitraum einzuholen, statt bei jeder Einzelaktion erneut zu fragen, ohne auf Verifikation ganz zu verzichten.

## Praktische Labs

~~~python
# Runtime-enforced authority: scope check, consent verification, re-delegation control
def check_scope(agent_scope, requested_action):
    if requested_action not in agent_scope:
        raise PermissionError(f"Privilege escalation blocked: '{requested_action}' not in scope {agent_scope}")
    return True

def verify_consent(consent_token, expected_task):
    if consent_token != f"verified-consent:{expected_task}":
        raise PermissionError(f"Missing or invalid consent for task '{expected_task}'")
    return True

def attempt_redelegation(original_delegation_allows_redelegation):
    if not original_delegation_allows_redelegation:
        raise PermissionError("Re-delegation blocked: original delegation does not permit it")
    return "Re-delegation authorized"

agent_scope = {"read_ticket", "update_ticket_status"}
check_scope(agent_scope, "update_ticket_status")
print("Scoped action authorized.")

try:
    check_scope(agent_scope, "delete_ticket")
except PermissionError as e:
    print(f"Caught: {e}")

try:
    verify_consent("assumed-consent", "close-account-42")
except PermissionError as e:
    print(f"Caught: {e}")

try:
    attempt_redelegation(original_delegation_allows_redelegation=False)
except PermissionError as e:
    print(f"Caught: {e}")
~~~

## Dependencies, Cross-References und Quellen

1. NIST: [SP 800-207 — Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final), abgerufen 2026-09-17.
2. OWASP: [OWASP Top 10 for LLM Applications — Excessive Agency](https://genai.owasp.org/llmrisk/llm08-excessive-agency/), abgerufen 2026-09-17.
3. OASIS: [XACML — Policy-Based Access Control Standard](https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=xacml), abgerufen 2026-09-17.

Agent Identity und Service Identity sind kanonisch in [KB-0287](13-agent-identity-und-service-identity.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Kryptografisch verifizierbare Zustimmungsnachweise (Verifiable Credentials) für agentische Aktionen | Emerging | Beobachten; würde Zustimmungsverifikation robuster machen, aber noch nicht breit in Agent-Frameworks integriert. |
| Policy-as-Code-Engines, die Handlungsumfang und Weiterdelegationsregeln deklarativ und versioniert durchsetzen | Adopting | Gegenüber im Code verstreuter Autorisierungslogik für Nachvollziehbarkeit und konsistente Durchsetzung bevorzugen. |

Ein Team akzeptiert ein Autoritätsmodell erst, wenn Handlungsumfang, Zustimmung und Weiterdelegation als technisch durchgesetzte, nicht nur dokumentierte Grenzen getestet sind.
