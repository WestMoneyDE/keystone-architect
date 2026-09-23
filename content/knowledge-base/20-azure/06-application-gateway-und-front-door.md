---
{"id": "KB-0486", "title": "Application Gateway und Front Door", "domain": "20", "sequence": 6, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI", "ENTERPRISE"], "requires": [{"id": "KB-0073", "concepts": ["Load Balancing auf Layer 4 und 7"], "needed_for": "understanding"}, {"id": "KB-0469", "concepts": ["Elastic Load Balancing"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Application Gateway mit aktivierter Web Application Firewall (WAF) anhand offizieller Dokumentation konfigurieren können und den Unterschied zu Azure Front Door als globalem Entry Point erklären.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine öffentliche Unternehmensanwendung eine Entry-Point-Architektur gestalten, die Application Gateway (regional) und Front Door (global) sinnvoll kombiniert und Backend-Origins vor direktem, ungeschütztem Zugriff absichert.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen unerwarteten, die WAF umgehenden Angriff auf einen direkt erreichbaren Backend-Origin zurückführen können, der nicht auf den Entry Point als einzigen Zugriffspfad beschränkt wurde.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Entry-Point-Sicherheitsrichtlinien im Unternehmen anhand konsequenter Origin-Zugriffsbeschränkung statt anhand einer alleinigen WAF-Konfiguration am Entry Point festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der Front-Door-Edge-Infrastruktur im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von regionalen versus globalen Entry Points, WAF und Origin-Schutz als Entscheidungsgrundlage, nicht die Edge-Infrastruktur-Interna."}}, "lab_validation": [{"lab_id": "KB-0486-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Application-Gateway- und Front-Door-Dokumentation, kein aktives Azure-Konto verwendet", "evidence": "Anhand offizieller Microsoft-Dokumentation wird nachvollzogen, wie Application Gateway als regionaler Layer-7-Entry-Point mit WAF-Integration arbeitet, wie Azure Front Door als globaler Entry Point mit Edge-Präsenz und TLS-Terminierung nahe am Nutzer fungiert, und warum ein Backend-Origin explizit auf Zugriffe ausschließlich vom Entry Point beschränkt werden muss, um eine Umgehung der WAF-Schutzmaßnahmen durch direkten Origin-Zugriff zu verhindern.", "limitations": "Kein aktives Azure-Konto verwendet, keine reale Application-Gateway- oder Front-Door-Konfiguration erstellt."}]}
---
# Application Gateway und Front Door

> **Ziel:** Azure Application Gateway ist ein regionaler Layer-7-Entry-Point (siehe Load Balancing auf Layer 4 und 7, [KB-0073](../02-netzwerke/16-load-balancing-auf-layer-4-und-7.md)) mit integrierter Web Application Firewall (WAF, die eingehenden HTTP-Verkehr gegen bekannte Angriffsmuster prüft), während Azure Front Door einen globalen Entry Point mit Edge-Präsenz nahe am Nutzer bereitstellt, der TLS-Terminierung und Routing bereits an einem geografisch näheren Edge-Standort durchführt, bevor der Verkehr an regionale Backends weitergeleitet wird. Der zentrale Punkt dieses Kapitels ist, dass eine WAF am Entry Point nur dann tatsächlichen Schutz bietet, wenn der dahinterliegende Backend-Origin explizit so konfiguriert ist, dass er ausschließlich über den Entry Point erreichbar ist — ein Backend-Origin, der weiterhin direkt (unter Umgehung des Entry Points) erreichbar bleibt, ermöglicht einem Angreifer, die WAF-Prüfung vollständig zu umgehen, indem er den Backend-Origin direkt anspricht, statt über den geschützten Entry Point zu gehen.

## Zweck, Mental Model und Dependencies

Application Gateway arbeitet innerhalb einer bestimmten Azure-Region und bietet Layer-7-bewusstes Routing (basierend auf HTTP-Pfad, Host-Header) sowie eine integrierte WAF, die eingehenden Verkehr gegen bekannte Angriffsmuster (z. B. SQL-Injection, Cross-Site-Scripting) prüft, bevor er an die dahinterliegenden Backend-Ziele weitergeleitet wird — dies ist vergleichbar mit einem Application Load Balancer (siehe [KB-0469](../19-aws/07-elastic-load-balancing.md)), jedoch mit dem Zusatz einer nativ integrierten WAF-Funktion. Azure Front Door geht einen Schritt weiter, indem es eine global verteilte Edge-Infrastruktur nutzt — Nutzeranfragen werden am geografisch nächstgelegenen Edge-Standort empfangen, wo TLS-Terminierung und initiales Routing stattfinden, bevor der Verkehr über das private Microsoft-Backbone-Netzwerk (statt über das öffentliche Internet) an die tatsächlich zuständige, regionale Backend-Instanz weitergeleitet wird, was sowohl die wahrgenommene Latenz für global verteilte Nutzer reduziert als auch zusätzlichen Schutz gegen bestimmte netzwerkbasierte Angriffe bietet, die auf öffentlichen Internetpfaden ansetzen. Der zentrale methodische Punkt ist, dass die WAF-Schutzwirkung — unabhängig davon, ob sie über Application Gateway oder Front Door bereitgestellt wird — vollständig davon abhängt, dass der dahinterliegende Backend-Origin (die eigentliche Anwendung) keinen alternativen, direkten Zugriffspfad bietet: Wenn ein Backend-Origin weiterhin eine öffentlich erreichbare IP-Adresse oder einen öffentlich auflösbaren Namen besitzt, der nicht explizit auf Zugriffe ausschließlich vom Entry Point beschränkt ist, kann ein Angreifer diesen direkten Pfad nutzen, um die gesamte WAF-Prüfung am Entry Point vollständig zu umgehen — die WAF prüft nur Verkehr, der tatsächlich durch sie hindurchläuft, nicht Verkehr, der auf einem parallelen, ungeschützten Pfad direkt zum Origin gelangt.

~~~text
Application Gateway: REGIONAL Layer-7 entry point, integrated WAF
  (checks incoming HTTP traffic against known attack patterns before forwarding)
Azure Front Door: GLOBAL entry point with EDGE presence near the user
  TLS termination + initial routing AT THE EDGE
  -> traffic then flows over Microsoft's PRIVATE backbone (not public internet) to the regional backend
  -> reduces latency for globally distributed users + protects against certain network-level attacks
KEY METHODOLOGICAL POINT: WAF protection (via either Gateway or Front Door)
  DEPENDS ENTIRELY on the backend origin having NO alternative, direct access path
  -> origin with a still-publicly-reachable IP/name, NOT restricted to entry-point-only access
     -> attacker uses that DIRECT path -> COMPLETELY bypasses the WAF check
  WAF only inspects traffic that ACTUALLY flows THROUGH it
     -- not traffic reaching the origin via a parallel, unprotected path
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Application Gateway | regionaler Layer-7-Entry-Point mit integrierter WAF | schützt nur Verkehr, der tatsächlich durch ihn hindurchläuft |
| Azure Front Door | globaler Entry Point mit Edge-Präsenz | reduziert Latenz, nutzt privates Backbone für Backend-Kommunikation |
| WAF | prüft HTTP-Verkehr gegen bekannte Angriffsmuster | wirkungslos, wenn ein alternativer, direkter Origin-Zugriffspfad besteht |
| Origin-Zugriffsbeschränkung | erzwingt Zugriff ausschließlich über den Entry Point | zentrale Voraussetzung für tatsächliche WAF-Schutzwirkung |

Implementierung: Für jeden Backend-Origin hinter einem Application Gateway oder Front Door wird explizit geprüft und konfiguriert, dass der Origin ausschließlich vom Entry Point aus erreichbar ist (z. B. über IP-Beschränkungen, private Endpunkte, oder einen gemeinsamen, nur dem Entry Point bekannten Authentifizierungsheader), statt sich auf die alleinige Existenz der WAF-Prüfung am Entry Point zu verlassen. Bei global verteilten Anwendungen mit Nutzern in unterschiedlichen geografischen Regionen wird Front Door für die globale Eingangsebene eingesetzt, während Application Gateway innerhalb jeder Region für regionales Layer-7-Routing und WAF-Prüfung genutzt wird. Regelmäßige, gezielte Tests versuchen den direkten Zugriff auf den Backend-Origin unter Umgehung des Entry Points, um zu verifizieren, dass diese Umgehung tatsächlich technisch verhindert wird.

## Scalability, Reliability, Security und Observability

Application Gateway und Front Door skalieren den tatsächlichen Sicherheitsschutz einer öffentlichen Anwendung proportional zur Vollständigkeit der Origin-Zugriffsbeschränkung; die Reliability-Grenze liegt darin, dass ein weiterhin direkt erreichbarer Backend-Origin proportional zur Auffindbarkeit dieser direkten Adresse die gesamte WAF-Schutzwirkung des Entry Points wirkungslos macht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Angriff erreicht die Anwendung trotz aktivierter WAF am Entry Point | der Angreifer greift direkt auf den Backend-Origin zu, unter Umgehung des geschützten Entry Points | prüfen, ob der Backend-Origin eine öffentlich erreichbare, nicht auf den Entry Point beschränkte Adresse besitzt |
| die Latenz für Nutzer in geografisch entfernten Regionen ist höher als erwartet | es wird nur ein regionales Application Gateway ohne globalen Front-Door-Edge-Einsatz genutzt | prüfen, ob Front Door für die globale Eingangsebene eingesetzt werden sollte |
| ein Sicherheitsaudit stellt fest, dass ein Backend-Origin eine öffentlich bekannte IP-Adresse besitzt | die Origin-Zugriffsbeschränkung wurde nicht konsequent umgesetzt | eine explizite Zugriffsbeschränkung (IP-Filter, privater Endpunkt, gemeinsamer Header) für den Origin einrichten |

Security: Die Origin-Zugriffsbeschränkung sollte technisch durchgesetzt werden (z. B. über Netzwerkfilterung oder private Konnektivität), nicht nur durch die Annahme, dass ein Angreifer die direkte Origin-Adresse nicht kennt ("Security through Obscurity" bietet keinen verlässlichen Schutz). Observability: Die tatsächliche Verkehrsverteilung zwischen Entry-Point- und direktem Origin-Zugriff (sofern messbar), WAF-Blockierungsereignisse, und die Ergebnisse regelmäßiger Umgehungstests sind zentrale Kontrollpunkte.

## Trade-offs und Entscheidungen

**Staff** konfiguriert Backend-Origins explizit auf ausschließlichen Zugriff vom Entry Point, statt sich allein auf die WAF-Prüfung zu verlassen. **Principal** macht die Abhängigkeit der WAF-Schutzwirkung von der Origin-Zugriffsbeschränkung für das Team nachvollziehbar. **Chief** legt Entry-Point-Sicherheitsrichtlinien im Unternehmen anhand konsequenter Origin-Zugriffsbeschränkung fest.

Anti-Patterns: eine WAF am Entry Point aktivieren, ohne den Backend-Origin explizit auf ausschließlichen Zugriff vom Entry Point zu beschränken; sich auf die Unbekanntheit der direkten Origin-Adresse als Sicherheitsmaßnahme verlassen, statt eine technisch durchgesetzte Zugriffsbeschränkung einzurichten; Front Door und Application Gateway ohne klare Unterscheidung ihrer jeweiligen Einsatzzwecke (global versus regional) vermischen.

## Production Checklist

- [ ] Jeder Backend-Origin ist technisch auf ausschließlichen Zugriff vom Entry Point beschränkt.
- [ ] Regelmäßige Tests verifizieren, dass ein direkter Origin-Zugriff unter Umgehung des Entry Points tatsächlich verhindert wird.
- [ ] Die Wahl zwischen Application Gateway (regional) und Front Door (global) ist anhand der tatsächlichen Nutzerverteilung begründet.
- [ ] WAF-Blockierungsereignisse werden überwacht.

## Interviewfragen

### 1. Was ist der Unterschied zwischen Application Gateway und Azure Front Door?

**Antwort:** Application Gateway ist ein regionaler Layer-7-Entry-Point mit integrierter WAF; Front Door ist ein globaler Entry Point mit Edge-Präsenz, der TLS-Terminierung nahe am Nutzer durchführt und Verkehr über das private Microsoft-Backbone an regionale Backends weiterleitet.

### 2. Wovon hängt die tatsächliche Schutzwirkung einer WAF vollständig ab?

**Antwort:** Davon, dass der dahinterliegende Backend-Origin keinen alternativen, direkten Zugriffspfad bietet — die WAF prüft nur Verkehr, der tatsächlich durch sie hindurchläuft.

### 3. Was passiert, wenn ein Backend-Origin weiterhin öffentlich, direkt erreichbar ist?

**Antwort:** Ein Angreifer kann diesen direkten Pfad nutzen, um die gesamte WAF-Prüfung am Entry Point vollständig zu umgehen, selbst wenn die WAF selbst korrekt konfiguriert ist.

### 4. Warum reduziert Azure Front Door die Latenz für global verteilte Nutzer?

**Antwort:** Weil TLS-Terminierung und initiales Routing bereits am geografisch nächstgelegenen Edge-Standort stattfinden, bevor der Verkehr über das private Backbone an das eigentliche Backend weitergeleitet wird, statt den gesamten Weg über das öffentliche Internet zurückzulegen.

### 5. Wie gehst du vor, wenn ein Angriff die Anwendung trotz aktivierter WAF am Entry Point erreicht?

**Antwort:** Ich prüfe, ob der Backend-Origin eine öffentlich erreichbare, nicht auf den Entry Point beschränkte Adresse besitzt, über die der Angreifer die WAF-Prüfung umgangen haben könnte.

### 6. Widersprüchliche Anforderung: Team will einfachen, direkten Zugriff auf Backend-Origins für Debugging-Zwecke UND vollständigen WAF-Schutz gegen externe Angriffe — wie gehst du vor?

**Antwort:** Ich würde einen separaten, eng kontrollierten Zugriffspfad für Debugging (z. B. über eine VPN-Verbindung oder eine eingeschränkte, interne Netzwerkverbindung) einrichten, statt den Backend-Origin öffentlich direkt erreichbar zu lassen, sodass beide Anforderungen erfüllt werden, ohne die WAF-Schutzwirkung zu untergraben.

## Praktische Labs

~~~python
# Conceptual origin-access-restriction verification (not executed against a real Azure account):

def check_origin_protection(origin_publicly_reachable, entry_point_only_restriction_enforced):
    if origin_publicly_reachable and not entry_point_only_restriction_enforced:
        return {"risk": "CRITICAL", "reason": "WAF can be bypassed via direct origin access"}
    return {"risk": "acceptable"}

result = check_origin_protection(
    origin_publicly_reachable=True,
    entry_point_only_restriction_enforced=False,  # gap
)
print(result)
~~~

## Dependencies, Cross-References und Quellen

1. Microsoft-Dokumentation: [Azure Application Gateway — Web Application Firewall Overview](https://learn.microsoft.com/en-us/azure/web-application-firewall/ag/ag-overview), abgerufen 2026-09-18.
2. Microsoft-Dokumentation: [Azure Front Door — Overview](https://learn.microsoft.com/en-us/azure/frontdoor/front-door-overview), abgerufen 2026-09-18.

Load Balancing auf Layer 4 und 7 ist kanonisch in [KB-0073](../02-netzwerke/16-load-balancing-auf-layer-4-und-7.md) behandelt; Elastic Load Balancing in [KB-0469](../19-aws/07-elastic-load-balancing.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Origin-Access-Verifikationswerkzeuge, die regelmäßig prüfen, ob Backend-Origins tatsächlich nur vom Entry Point erreichbar sind | Adopting | Gegenüber manuellen, seltenen Prüfungen bevorzugen, sobald die tatsächliche Testabdeckung für die eigene Umgebung verifiziert ist. |

Ein Team akzeptiert eine Entry-Point-Architektur mit WAF erst, wenn nachweislich verifiziert ist, dass der Backend-Origin ausschließlich über den Entry Point erreichbar ist und ein direkter Umgehungspfad technisch verhindert wird.
