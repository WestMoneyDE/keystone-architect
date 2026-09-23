---
{"id": "KB-0294", "title": "Agent Discovery, Cards und Registries", "domain": "12", "sequence": 20, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0293", "concepts": ["A2A und Interoperabilität"], "needed_for": "understanding"}, {"id": "KB-0287", "concepts": ["Agent Identity und Service Identity"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine minimale Agent-Registry implementieren, die Herkunft und Aktualität einer Agent Card vor Delegation prüft.", "rationale": "Der Wert einer überprüfbaren Registry wird erst durch konkrete Implementierung einer Herkunfts- und Aktualitätsprüfung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Entscheiden, welche Zulassungskriterien eine Enterprise-Registry für Agent Cards durchsetzen muss, bevor ein Agent für Delegation infrage kommt.", "rationale": "Ohne explizite Zulassungskriterien kann ein nicht verifizierter Agent fälschlich als delegationsfähig erscheinen."}, "STAFF-TARGET": {"active": true, "scope": "Eine fehlerhafte Delegation an einen ungeeigneten Agenten auf eine veraltete oder nicht verifizierte Agent Card statt auf ein allgemeines Auswahlproblem zurückführen können.", "rationale": "Eine Agent Card, die Capabilities und Endpunkte beschreibt, kann veralten oder von einem nicht autorisierten Herausgeber stammen, wenn Herkunft und Aktualität nicht geprüft werden."}, "CHIEF-TARGET": {"active": true, "scope": "Enterprise-Agent-Registries als notwendige Kontrollinstanz für sichere Agentendelegation positionieren, nicht als reines Katalogisierungswerkzeug.", "rationale": "Eine Registry, die nur katalogisiert, aber Herkunft und Aktualität nicht durchsetzt, bietet keinen tatsächlichen Sicherheitsgewinn gegenüber unkontrollierter Direktnutzung."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Agent-Card-Schema-Details sind Vertiefung.", "rationale": "Kern ist das Prinzip von Herkunfts- und Aktualitätsprüfung vor Delegation, nicht das konkrete Kartenformat."}}, "lab_validation": [{"lab_id": "KB-0294-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell einer Agent-Registry mit Herkunfts- und Aktualitätsprüfung vor Delegation", "evidence": "Eine Delegation an einen Agenten mit einer veralteten oder nicht verifizierten Agent Card wird durch eine explizite Registry-Prüfung erkannt und abgelehnt, während eine aktuelle, verifizierte Card die Delegation zulässt.", "limitations": "Keine echte Registry-Infrastruktur, kein produktives System, keine reale Zulassungsstelle."}]}
---
# Agent Discovery, Cards und Registries

> **Ziel:** Eine Agent Card katalogisiert die Capabilities (welche Aufgaben ein Agent beherrscht) und Endpunkte (wie er erreichbar ist) eines Agenten, aufbauend auf A2A-Interoperabilität (siehe [KB-0293](19-a2a-und-interoperabilitaet.md)) und Agent Identity (siehe [KB-0287](13-agent-identity-und-service-identity.md)). Eine Enterprise-Registry macht Herkunft (wer hat die Card ausgestellt), Aktualität (ist die Card noch gültig) und Zulassung (erfüllt der Agent die Enterprise-Anforderungen) vor jeder Delegation überprüfbar — ohne diese Prüfungen ist eine Agent Card nur eine unbeglaubigte Selbstauskunft.

## Zweck, Mental Model und Dependencies

Agent Discovery ist der Prozess, mit dem ein System einen geeigneten Agenten für eine bestimmte Aufgabe findet — analog zur Dienstsuche in einer Service-Discovery-Architektur, aber mit der zusätzlichen Herausforderung, dass ein Agent nicht nur erreichbar, sondern auch tatsächlich für die Aufgabe geeignet und vertrauenswürdig sein muss. Eine Agent Card ist eine strukturierte Beschreibung eines Agenten: welche Capabilities er anbietet, über welche Endpunkte er erreichbar ist, und typischerweise Metadaten wie Version und Aussteller. Der zentrale, oft übersehene Risikofaktor ist, dass eine Agent Card zunächst nur eine Selbstauskunft ist — ohne unabhängige Prüfung könnte ein Agent Capabilities behaupten, die er nicht tatsächlich zuverlässig erfüllt, oder eine Card könnte von einem nicht autorisierten Dritten im Namen eines anderen Agenten ausgestellt worden sein. Eine Enterprise-Registry adressiert dies durch drei zentrale Prüfungen vor jeder Delegation: Herkunft (wurde die Card von einer vertrauenswürdigen, autorisierten Quelle ausgestellt), Aktualität (ist die Card noch gültig, oder wurde der zugrunde liegende Agent inzwischen geändert oder außer Betrieb genommen) und Zulassung (erfüllt der Agent die spezifischen Enterprise-Anforderungen, z. B. Sicherheits- oder Compliance-Kriterien, die über die reine Selbstauskunft der Card hinausgehen).

~~~text
Agent Card: structured description -> capabilities + endpoints + metadata (version, issuer)
Discovery: find a SUITABLE agent for a task (not just reachable, also actually fit + trustworthy)
RISK: a Card is initially just SELF-REPORTED -> unverified capabilities claim, or forged issuer
Enterprise Registry enforces THREE checks before delegation:
  Provenance: was the Card issued by a trusted, authorized source?
  Freshness: is the Card still valid, or has the underlying agent changed/retired?
  Admission: does the agent meet enterprise-specific requirements beyond the Card's self-report?
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Herkunftsverifikation der Agent Card | wird geprüft, ob die Card von einer autorisierten, vertrauenswürdigen Quelle ausgestellt wurde? | eine nicht verifizierte Herkunft kann eine gefälschte oder manipulierte Card unbemerkt akzeptieren |
| Aktualitätsprüfung vor Delegation | wird geprüft, ob die Card seit ihrer Ausstellung noch gültig ist? | eine veraltete Card kann Capabilities oder Endpunkte beschreiben, die nicht mehr dem tatsächlichen Agentenstand entsprechen |
| Enterprise-Zulassungskriterien | wird geprüft, ob der Agent zusätzliche Enterprise-Anforderungen erfüllt, die über die Selbstauskunft der Card hinausgehen? | ohne zusätzliche Zulassungskriterien kann ein Agent, der nur die eigene Card ausfüllt, unzureichend geprüft delegationsfähig erscheinen |
| Verknüpfung mit Agent Identity | ist die Agent Card eindeutig mit der überprüfbaren Agentenidentität verknüpft (siehe KB-0287)? | eine nicht verknüpfte Card kann fälschlich einem anderen Agenten zugeordnet werden |

Implementierung: Jede Agent Card wird vor Nutzung gegen eine Liste autorisierter Aussteller geprüft, statt sie unabhängig von ihrer Herkunft zu akzeptieren. Die Registry führt eine Gültigkeitsprüfung durch, die abgelaufene oder widerrufene Cards erkennt und deren Nutzung für Delegation verweigert. Zusätzlich zu den in der Card selbst behaupteten Capabilities durchläuft ein Agent enterprise-spezifische Zulassungskriterien (z. B. Sicherheitsaudits oder Compliance-Prüfungen), bevor er als delegationsfähig markiert wird. Die Agent Card wird eindeutig mit der überprüfbaren Agentenidentität (siehe [KB-0287](13-agent-identity-und-service-identity.md)) verknüpft, sodass eine Delegation nicht auf eine lose, nicht verifizierte Zuordnung zwischen Card und tatsächlichem Agenten angewiesen ist.

## Scalability, Reliability, Security und Observability

Eine Enterprise-Registry skaliert sichere Agentendelegation proportional zur Konsequenz ihrer Herkunfts-, Aktualitäts- und Zulassungsprüfung; die Reliability-Grenze liegt in einer Registry, die Agent Cards nur katalogisiert, ohne diese drei Prüfungen tatsächlich durchzusetzen — eine solche Registry bietet keinen echten Sicherheitsgewinn gegenüber unkontrollierter Direktnutzung von Agent Cards.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Delegation an einen Agenten schlägt fehl, weil die beschriebenen Capabilities nicht mehr zutreffen | die verwendete Agent Card war veraltet und eine Aktualitätsprüfung fehlte | prüfen, ob die Registry die Gültigkeit der Card zum Delegationszeitpunkt geprüft hat |
| eine Delegation erfolgt an einen nicht autorisierten oder gefälschten Agenten | fehlende Herkunftsverifikation der verwendeten Agent Card | prüfen, ob die Card gegen eine Liste autorisierter Aussteller verifiziert wurde |
| ein Agent, der grundlegende Enterprise-Anforderungen nicht erfüllt, wird dennoch für Delegation ausgewählt | fehlende oder unzureichende Enterprise-Zulassungskriterien über die Selbstauskunft der Card hinaus | prüfen, ob der Agent zusätzliche Zulassungskriterien durchlaufen hat, bevor er als delegationsfähig markiert wurde |

Security: Eine Agent Card ohne Herkunfts- und Aktualitätsprüfung ist funktional äquivalent zu einer unbeglaubigten Selbstauskunft — eine Enterprise-Registry muss diese Prüfungen aktiv durchsetzen, nicht nur die Cards passiv sammeln und anzeigen. Observability: Häufigkeit abgelehnter Delegationen aufgrund fehlgeschlagener Herkunfts-, Aktualitäts- oder Zulassungsprüfung, Durchschnittsalter genutzter Agent Cards und Anteil delegationsfähiger gegenüber katalogisierten Agenten sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** verifiziert Herkunft und Aktualität jeder Agent Card vor jeder Delegation. **Principal** macht Enterprise-Zulassungskriterien für das Team nachvollziehbar dokumentiert. **Chief** positioniert Enterprise-Registries als notwendige Kontrollinstanz für sichere Delegation, nicht als reines Katalogisierungswerkzeug.

Anti-Patterns: Agent Cards ohne Herkunftsverifikation als vertrauenswürdig akzeptieren; Delegation auf Basis veralteter Cards ohne Aktualitätsprüfung durchführen; eine Registry betreiben, die nur katalogisiert, aber keine Zulassungskriterien tatsächlich durchsetzt.

## Production Checklist

- [ ] Jede Agent Card wird gegen eine Liste autorisierter Aussteller verifiziert.
- [ ] Eine Aktualitätsprüfung verhindert Delegation auf Basis abgelaufener oder widerrufener Cards.
- [ ] Enterprise-Zulassungskriterien gehen über die Selbstauskunft der Card hinaus.
- [ ] Jede Agent Card ist eindeutig mit einer überprüfbaren Agentenidentität verknüpft.

## Interviewfragen

### 1. Was ist eine Agent Card, und warum ist sie zunächst nur eine Selbstauskunft?

**Antwort:** Sie ist eine strukturierte Beschreibung der Capabilities und Endpunkte eines Agenten; ohne unabhängige Prüfung könnte sie unzutreffende Fähigkeiten behaupten oder von einem nicht autorisierten Dritten ausgestellt worden sein.

### 2. Welche drei zentralen Prüfungen muss eine Enterprise-Registry vor Delegation durchsetzen?

**Antwort:** Herkunft (autorisierter Aussteller), Aktualität (Gültigkeit der Card) und Zulassung (Erfüllung zusätzlicher Enterprise-Anforderungen über die Selbstauskunft hinaus).

### 3. Warum reicht reine Katalogisierung von Agent Cards nicht aus?

**Antwort:** Eine Registry, die Cards nur sammelt und anzeigt, ohne Herkunft, Aktualität und Zulassung aktiv zu prüfen, bietet keinen tatsächlichen Sicherheitsgewinn gegenüber unkontrollierter Direktnutzung der Cards.

### 4. Warum muss eine Agent Card eindeutig mit der Agentenidentität verknüpft sein?

**Antwort:** Ohne diese Verknüpfung könnte eine Card fälschlich einem anderen Agenten zugeordnet werden, was die gesamte Herkunfts- und Aktualitätsprüfung untergräbt.

### 5. Wie diagnostizierst du eine fehlerhafte Delegation aufgrund einer veralteten Agent Card?

**Antwort:** Ich prüfe, ob die Registry zum Delegationszeitpunkt eine explizite Aktualitätsprüfung der verwendeten Card durchgeführt hat — fehlt sie, ist eine veraltete Card die wahrscheinlichste Ursache für die Fehldelegation.

### 6. Widersprüchliche Anforderung: Team will schnelle, unkomplizierte Discovery und Delegation neuer Agenten UND garantiert keine Delegation an nicht verifizierte oder ungeeignete Agenten — wie gehst du vor?

**Antwort:** Ich würde erklären, dass beide Ziele vereinbar sind, wenn Herkunfts-, Aktualitäts- und Zulassungsprüfung als automatisierte, schnelle Registry-Funktionen implementiert werden statt als manuelle Prüfschritte; ich würde vorschlagen, eine automatisierte Zulassungspipeline zu etablieren, die neue Agent Cards zügig, aber ohne Auslassung der drei Kernprüfungen verarbeitet.

## Praktische Labs

~~~python
# Agent registry with provenance, freshness, and admission checks before delegation
import time

TRUSTED_ISSUERS = {"enterprise-agent-authority"}

def register_card(card, registry):
    registry[card["agent_id"]] = card

def verify_before_delegation(agent_id, registry, admitted_agents, max_age_seconds=3600):
    card = registry.get(agent_id)
    if card is None:
        raise ValueError(f"No Agent Card found for '{agent_id}'")
    if card["issuer"] not in TRUSTED_ISSUERS:
        raise PermissionError(f"Untrusted issuer for '{agent_id}': '{card['issuer']}'")
    if time.time() - card["issued_at"] > max_age_seconds:
        raise PermissionError(f"Agent Card for '{agent_id}' has expired — freshness check failed")
    if agent_id not in admitted_agents:
        raise PermissionError(f"'{agent_id}' has not passed enterprise admission criteria")
    return f"Delegation approved for '{agent_id}' with capabilities {card['capabilities']}"

registry = {}
admitted_agents = {"invoice-agent-01"}

register_card({
    "agent_id": "invoice-agent-01",
    "issuer": "enterprise-agent-authority",
    "capabilities": ["process_invoice"],
    "issued_at": time.time() - 60,
}, registry)

register_card({
    "agent_id": "shadow-agent-99",
    "issuer": "unknown-source",
    "capabilities": ["process_invoice"],
    "issued_at": time.time() - 60,
}, registry)

print(verify_before_delegation("invoice-agent-01", registry, admitted_agents))

try:
    verify_before_delegation("shadow-agent-99", registry, admitted_agents)
except PermissionError as e:
    print(f"Caught: {e}")
~~~

## Dependencies, Cross-References und Quellen

1. Linux Foundation / Agentic AI Foundation: [Agent2Agent (A2A) Protocol — Agent Cards](https://a2a-protocol.org/latest/specification/), abgerufen 2026-09-17.
2. NIST: [SP 800-207 — Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final), abgerufen 2026-09-17.
3. OWASP: [OWASP Top 10 for LLM Applications — Supply Chain Vulnerabilities](https://genai.owasp.org/llmrisk/llm05-supply-chain/), abgerufen 2026-09-17.

A2A und Interoperabilität sind kanonisch in [KB-0293](19-a2a-und-interoperabilitaet.md) behandelt; Agent Identity und Service Identity in [KB-0287](13-agent-identity-und-service-identity.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Kryptografisch signierte Agent Cards mit eingebettetem Aussteller- und Ablaufnachweis | Emerging | Beobachten; würde Herkunfts- und Aktualitätsprüfung robuster machen, aber noch nicht breit in Registry-Implementierungen integriert. |
| Föderierte Enterprise-Registries, die Zulassungsentscheidungen über Organisationsgrenzen hinweg konsistent durchsetzen | Emerging | Beobachten; vielversprechend für Multi-Organisations-Agentenökosysteme, aber Standardisierung noch nicht ausgereift. |

Ein Team akzeptiert eine Agent-Discovery-/Registry-Architektur erst, wenn Herkunfts-, Aktualitäts- und Zulassungsprüfung vor jeder Delegation dokumentiert und getestet sind.
