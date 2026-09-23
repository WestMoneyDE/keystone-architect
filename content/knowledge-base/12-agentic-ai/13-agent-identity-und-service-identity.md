---
{"id": "KB-0287", "title": "Agent Identity und Service Identity", "domain": "12", "sequence": 13, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0286", "concepts": ["Agenten-Sandboxing"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Principal-Kette implementieren, die nachvollziehbar dokumentiert, welcher Benutzer welchem Agenten welche Berechtigung delegiert hat.", "rationale": "Der Wert nachvollziehbarer Principal-Ketten wird erst durch konkrete Implementierung einer Delegationskette greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Entscheiden, wann Workload-Identität gegenüber pauschaler Übernahme sämtlicher Nutzerrechte für eine konkrete Agentenaufgabe angemessen ist.", "rationale": "Pauschale Übernahme sämtlicher Nutzerrechte durch einen Agenten überschreitet oft den tatsächlich für die Aufgabe notwendigen Berechtigungsumfang."}, "STAFF-TARGET": {"active": true, "scope": "Einen unautorisierten Zugriff auf eine fehlende Trennung zwischen Agentenidentität und pauschal übernommener Benutzeridentität statt auf ein allgemeines Berechtigungsproblem zurückführen können.", "rationale": "Eine pauschale Übernahme sämtlicher Nutzerrechte durch einen Agenten verwischt die Verantwortungsgrenze zwischen Nutzer- und Agentenhandeln und erschwert die Eingrenzung von Vorfällen."}, "CHIEF-TARGET": {"active": true, "scope": "Nachvollziehbare Principal-Ketten als Grundvoraussetzung für auditierbares agentisches Handeln in Unternehmensumgebungen positionieren.", "rationale": "Ohne nachvollziehbare Delegationsketten lässt sich nach einem Vorfall nicht rekonstruieren, welcher Nutzer welchem Agenten welche Handlung tatsächlich autorisiert hat."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Identity-Provider-Implementierungsdetails sind Vertiefung.", "rationale": "Kern ist das Prinzip nachvollziehbarer Principal-Ketten, nicht die konkrete Identity-Provider-Technologie."}}, "lab_validation": [{"lab_id": "KB-0287-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell einer Principal-Kette mit expliziter Delegation statt pauschaler Rechteübernahme", "evidence": "Ein Agent, der pauschal alle Nutzerrechte übernimmt, kann Aktionen außerhalb der beabsichtigten Delegation ausführen; eine explizite, aufgabenspezifische Delegationskette begrenzt dies nachweisbar.", "limitations": "Kein echter Identity Provider, kein produktives System, keine reale Audit-Infrastruktur."}]}
---
# Agent Identity und Service Identity

> **Ziel:** Agentenidentität (die Identität des Agenten selbst), Benutzerdelegation (im Namen welches Nutzers handelt der Agent) und Workload-Identität (die Identität, mit der ein Agent auf Dienste zugreift) müssen getrennt modelliert werden, aufbauend auf Sandboxing-Grundlagen (siehe [KB-0286](12-agenten-sandboxing.md)). Eine nachvollziehbare Principal-Kette dokumentiert, welcher Nutzer welchem Agenten welche Berechtigung delegiert hat — statt dass ein Agent pauschal sämtliche Rechte des auslösenden Nutzers übernimmt.

## Zweck, Mental Model und Dependencies

Agentenidentität ist die eigenständige Identität eines Agenten (z. B. ein Service-Account oder eine Workload-Identität), die unabhängig vom auslösenden Nutzer existiert. Benutzerdelegation bedeutet, dass ein Agent im Namen eines bestimmten Nutzers handelt und dabei einen definierten Teil der Berechtigungen dieses Nutzers ausübt — nicht alle. Workload-Identität ist die technische Identität, mit der ein Agent gegenüber nachgelagerten Diensten authentifiziert wird, unabhängig von der Frage, in wessen Namen er gerade handelt. Der zentrale, oft übersehene Fehler ist, diese drei Konzepte zu vermischen und einem Agenten pauschal sämtliche Rechte des auslösenden Nutzers zu geben, statt eine explizite, aufgabenspezifische Delegation zu modellieren — dies verwischt die Verantwortungsgrenze zwischen Nutzer- und Agentenhandeln und macht es nach einem Vorfall schwer nachvollziehbar, ob eine Aktion tatsächlich vom Nutzer beabsichtigt oder vom Agenten eigenständig (möglicherweise fehlerhaft) ausgeführt wurde. Eine Principal-Kette macht diese Delegation explizit nachvollziehbar: sie dokumentiert lückenlos, welcher Nutzer welchem Agenten zu welchem Zeitpunkt welche konkrete Berechtigung delegiert hat, und diese Kette muss in Auditspuren erhalten bleiben, damit jede agentische Aktion bis zum ursprünglich autorisierenden Nutzer zurückverfolgt werden kann.

~~~text
Agent identity: agent's OWN identity (service account / workload identity), independent of triggering user
User delegation: agent acts ON BEHALF of a specific user, with a DEFINED SUBSET of that user's rights (not all)
Workload identity: technical identity for authenticating to downstream services
ANTI-PATTERN: agent inherits ALL of triggering user's rights -> blurs user-action vs agent-action boundary
Principal chain: explicit record of WHO delegated WHAT permission to WHICH agent WHEN
  -> MUST survive in audit trail for full traceability back to authorizing user
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Getrennte Modellierung von Agent-, Nutzer- und Workload-Identität | sind diese drei Identitätskonzepte im Berechtigungsmodell explizit voneinander unterschieden? | eine Vermischung erschwert die Nachvollziehbarkeit, wer tatsächlich für eine Aktion verantwortlich ist |
| Aufgabenspezifische Delegation statt Rechteübernahme | delegiert ein Nutzer einem Agenten nur die für die konkrete Aufgabe notwendigen Rechte, statt pauschal alle eigenen Rechte? | pauschale Rechteübernahme erhöht den potenziellen Schaden bei fehlerhaftem Agentenverhalten erheblich |
| Vollständige Principal-Kette in Auditspuren | ist für jede agentische Aktion die vollständige Delegationskette bis zum autorisierenden Nutzer in der Auditspur erhalten? | eine unvollständige Kette verhindert nach einem Vorfall die Rekonstruktion der tatsächlichen Autorisierung |
| Zeitliche Begrenzung von Delegationen | sind delegierte Berechtigungen zeitlich oder aufgabenbezogen begrenzt, statt dauerhaft zu bestehen? | dauerhaft bestehende Delegationen erhöhen das Risiko, dass veraltete Berechtigungen missbraucht werden |

Implementierung: Jeder Agent erhält eine eigenständige Agentenidentität, die unabhängig vom auslösenden Nutzer existiert und für Auditzwecke eindeutig zuordenbar ist. Delegationen werden explizit und aufgabenspezifisch modelliert — ein Nutzer delegiert einem Agenten nur den für die konkrete Aufgabe notwendigen Berechtigungsumfang, nicht die Gesamtheit seiner eigenen Rechte. Jede Delegation wird als expliziter Eintrag in der Principal-Kette protokolliert (wer, an wen, welche Berechtigung, wann, für welche Aufgabe) und bleibt Teil der Auditspur jeder daraus resultierenden agentischen Aktion. Delegationen erhalten, wo möglich, eine zeitliche oder aufgabenbezogene Begrenzung, nach deren Ablauf sie automatisch ungültig werden, statt dauerhaft zu bestehen.

## Scalability, Reliability, Security und Observability

Getrennte Identitätsmodellierung skaliert Nachvollziehbarkeit proportional zur Konsequenz der Trennung; die Reliability-Grenze liegt in vermischten Identitätskonzepten, bei denen eine pauschale Rechteübernahme nach einem Agentenfehler zu Schäden im vollen Umfang der Nutzerrechte statt im begrenzten Umfang der eigentlich benötigten Aufgabe führen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Agent führt eine Aktion aus, die weit über die ursprünglich beabsichtigte Aufgabe hinausgeht | der Agent hat pauschal sämtliche Rechte des auslösenden Nutzers übernommen, statt eine aufgabenspezifische Delegation zu erhalten | prüfen, ob die Berechtigung des Agenten auf den tatsächlichen Aufgabenumfang beschränkt oder auf die vollständigen Nutzerrechte gesetzt war |
| nach einem Vorfall lässt sich nicht rekonstruieren, welcher Nutzer eine agentische Aktion tatsächlich autorisiert hat | die Principal-Kette ist unvollständig oder wird nicht in der Auditspur erhalten | prüfen, ob die vollständige Delegationskette für die betroffene Aktion in der Auditspur dokumentiert ist |
| eine agentische Aktion nutzt eine Berechtigung, die eigentlich längst abgelaufen sein sollte | Delegationen sind nicht zeitlich oder aufgabenbezogen begrenzt | prüfen, ob die verwendete Delegation eine explizite Gültigkeitsgrenze hatte |

Security: Die zentrale Sicherheitsregel ist, einem Agenten niemals pauschal die vollständigen Rechte des auslösenden Nutzers zu übertragen — jede Delegation muss explizit, aufgabenspezifisch und zeitlich begrenzt erfolgen, um den potenziellen Schaden bei fehlerhaftem Agentenverhalten zu minimieren. Observability: Häufigkeit von Delegationen mit vollem statt eingeschränktem Rechteumfang (als Warnsignal), Vollständigkeit der Principal-Ketten in Auditspuren und Häufigkeit abgelaufener, aber dennoch verwendeter Delegationen sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** modelliert Agenten-, Nutzer- und Workload-Identität immer getrennt und dokumentiert jede Delegation explizit. **Principal** macht Principal-Ketten für das Team als festen Bestandteil jeder Auditspur nachvollziehbar. **Chief** positioniert nachvollziehbare Delegation als Grundvoraussetzung für auditierbares agentisches Handeln in Unternehmensumgebungen.

Anti-Patterns: einem Agenten pauschal sämtliche Rechte des auslösenden Nutzers übertragen, statt eine aufgabenspezifische Delegation zu modellieren; Principal-Ketten nicht vollständig in Auditspuren erhalten; Delegationen ohne zeitliche oder aufgabenbezogene Begrenzung dauerhaft bestehen lassen.

## Production Checklist

- [ ] Agenten-, Nutzer- und Workload-Identität sind im Berechtigungsmodell explizit getrennt.
- [ ] Delegationen sind aufgabenspezifisch begrenzt, nicht pauschale Rechteübernahme.
- [ ] Jede agentische Aktion hat eine vollständige Principal-Kette in der Auditspur.
- [ ] Delegationen haben eine explizite zeitliche oder aufgabenbezogene Gültigkeitsgrenze.

## Interviewfragen

### 1. Was unterscheidet Agentenidentität, Benutzerdelegation und Workload-Identität?

**Antwort:** Agentenidentität ist die eigenständige Identität des Agenten selbst; Benutzerdelegation beschreibt, im Namen welches Nutzers und mit welchem Teil seiner Rechte der Agent handelt; Workload-Identität ist die technische Identität für die Authentifizierung gegenüber nachgelagerten Diensten.

### 2. Warum ist pauschale Übernahme sämtlicher Nutzerrechte durch einen Agenten problematisch?

**Antwort:** Sie verwischt die Verantwortungsgrenze zwischen Nutzer- und Agentenhandeln, erhöht den potenziellen Schaden bei fehlerhaftem Agentenverhalten und erschwert die Nachvollziehbarkeit nach einem Vorfall.

### 3. Was ist eine Principal-Kette, und warum muss sie in Auditspuren erhalten bleiben?

**Antwort:** Sie dokumentiert lückenlos, welcher Nutzer welchem Agenten welche Berechtigung delegiert hat; ohne sie lässt sich nach einem Vorfall nicht rekonstruieren, ob eine Aktion tatsächlich vom Nutzer beabsichtigt war.

### 4. Warum sollten Delegationen zeitlich oder aufgabenbezogen begrenzt sein?

**Antwort:** Dauerhaft bestehende Delegationen erhöhen das Risiko, dass veraltete Berechtigungen missbraucht werden, auch wenn die ursprüngliche Aufgabe längst abgeschlossen ist.

### 5. Wie diagnostizierst du, dass ein Agent über seinen beabsichtigten Aufgabenbereich hinaus gehandelt hat?

**Antwort:** Ich prüfe, ob die Berechtigung des Agenten für die betroffene Aktion auf den tatsächlichen Aufgabenumfang beschränkt war oder ob eine pauschale Übernahme sämtlicher Nutzerrechte vorlag.

### 6. Widersprüchliche Anforderung: Team will minimalen Delegationsverwaltungsaufwand (Agenten sollen "einfach die Rechte des Nutzers haben") UND garantierte Nachvollziehbarkeit jeder agentischen Aktion bis zum autorisierenden Nutzer — wie gehst du vor?

**Antwort:** Ich würde erklären, dass pauschale Rechteübernahme die Nachvollziehbarkeit gerade untergräbt, da sie nicht zwischen tatsächlich benötigten und lediglich verfügbaren Rechten unterscheidet; ich würde vorschlagen, eine kleine Anzahl vordefinierter, aufgabenbezogener Delegationsprofile zu etablieren, die den Verwaltungsaufwand gering halten, ohne auf explizite, nachvollziehbare Delegation zu verzichten.

## Praktische Labs

~~~python
# Principal chain with task-scoped delegation instead of full user rights inheritance
principal_chain = []

def delegate(user, agent, permissions, task):
    entry = {"user": user, "agent": agent, "permissions": permissions, "task": task}
    principal_chain.append(entry)
    return entry

def agent_action(agent, requested_permission, task):
    matching_delegations = [
        e for e in principal_chain
        if e["agent"] == agent and e["task"] == task and requested_permission in e["permissions"]
    ]
    if not matching_delegations:
        raise PermissionError(f"'{agent}' has no delegated permission '{requested_permission}' for task '{task}'")
    delegation = matching_delegations[0]
    return f"Action authorized via principal chain: {delegation['user']} -> {agent} -> '{requested_permission}' (task: {task})"

delegate(user="alice", agent="ticket-agent", permissions={"create_ticket"}, task="support-request-42")

print(agent_action("ticket-agent", "create_ticket", "support-request-42"))

try:
    agent_action("ticket-agent", "delete_all_tickets", "support-request-42")
except PermissionError as e:
    print(f"Caught excessive-scope attempt: {e}")
~~~

## Dependencies, Cross-References und Quellen

1. NIST: [SP 800-207 — Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final), abgerufen 2026-09-17.
2. OWASP: [OWASP Top 10 for LLM Applications — Excessive Agency](https://genai.owasp.org/llmrisk/llm08-excessive-agency/), abgerufen 2026-09-17.
3. Google Cloud: [Workload Identity Federation](https://cloud.google.com/iam/docs/workload-identity-federation), abgerufen 2026-09-17.

Agenten-Sandboxing ist kanonisch in [KB-0286](12-agenten-sandboxing.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte Agent-Identity-Protokolle für interoperable Principal-Ketten über Frameworks und Anbieter hinweg | Emerging | Beobachten; würde konsistente Delegationsnachvollziehbarkeit über heterogene Agentensysteme erleichtern, aber noch nicht breit standardisiert. |
| Kurzlebige, automatisch ablaufende Delegationstoken für aufgabenspezifische Agentenberechtigungen | Adopting | Gegenüber dauerhaften Berechtigungen für geringeres Missbrauchsrisiko bevorzugen. |

Ein Team akzeptiert eine Agent-Identity-Architektur erst, wenn getrennte Identitätsmodellierung, aufgabenspezifische Delegation und vollständige Principal-Ketten in Auditspuren dokumentiert und getestet sind.
