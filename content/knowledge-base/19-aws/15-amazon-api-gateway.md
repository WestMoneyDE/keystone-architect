---
{"id": "KB-0477", "title": "Amazon API Gateway", "domain": "19", "sequence": 15, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0166", "concepts": ["API Gateways und Request-Policies"], "needed_for": "understanding"}, {"id": "KB-0472", "concepts": ["AWS Lambda"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine REST- oder HTTP-API mit einem Authorizer und einer Lambda-Backend-Integration anhand offizieller Dokumentation konfigurieren können und den Unterschied zwischen REST-API und HTTP-API-Typ erklären.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Unternehmensschnittstelle eine API-Gateway-Architektur gestalten, die Deployment-Stages, Authorizer-Typen und Limits explizit gegen tatsächliche Sicherheits- und Betriebsanforderungen abstimmt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete, produktive Auswirkung einer API-Änderung auf eine fehlende oder unzureichend genutzte Deployment-Stage-Trennung zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "API-Gateway-Governance-Richtlinien im Unternehmen anhand konsequenter Stage-Trennung und dokumentierter Authorizer-Strategien statt anhand einer einzigen, undifferenzierten Produktionskonfiguration festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der API-Gateway-Laufzeitumgebung im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von API-Typen, Authorizers, Backend-Integration und Stage-Trennung als Entscheidungsgrundlage, nicht die Laufzeitumgebungs-Interna."}}, "lab_validation": [{"lab_id": "KB-0477-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Amazon-API-Gateway-Dokumentation, kein aktives AWS-Konto verwendet", "evidence": "Anhand offizieller AWS-Dokumentation wird nachvollzogen, wie sich REST-API- und HTTP-API-Typen in Funktionsumfang und Kosten unterscheiden, wie Authorizer (Lambda-Authorizer, JWT-Authorizer) Zugriffskontrolle vor der Backend-Integration durchsetzen, und wie Deployment-Stages es ermöglichen, mehrere Versionen einer API (z. B. Entwicklung, Staging, Produktion) unabhängig voneinander zu betreiben.", "limitations": "Kein aktives AWS-Konto verwendet, keine reale API-Gateway-Konfiguration erstellt."}]}
---
# Amazon API Gateway

> **Ziel:** Amazon API Gateway ist AWS' verwalteter API-Gateway-Dienst (siehe API Gateways und Request-Policies, [KB-0166](../07-backend-integration/14-api-gateways-und-request-policies.md)), der Routing, Authorizer (Zugriffskontrolle vor der eigentlichen Backend-Verarbeitung), Backend-Integration (z. B. mit Lambda, siehe [KB-0472](10-aws-lambda.md)) und Deployment-Stages (unabhängig voneinander betreibbare Versionen derselben API-Definition, z. B. für Entwicklung, Staging, Produktion) kombiniert. Der zentrale Punkt dieses Kapitels ist, dass Deployment-Stages eine explizite Trennung zwischen der API-Definition (Routen, Integrationen, Authorizer-Konfiguration) und deren tatsächlicher, produktiver Bereitstellung ermöglichen — eine Änderung an der API-Definition wird erst durch eine explizite Deployment-Aktion auf eine bestimmte Stage angewendet, was theoretisch verhindert, dass unbeabsichtigte Änderungen sofort produktiv wirksam werden, jedoch nur dann tatsächlich schützt, wenn diese Stage-Trennung auch konsequent genutzt wird — eine Konfiguration, die Entwicklungs- und Produktionsänderungen über dieselbe Stage vornimmt, verliert diesen Schutz vollständig.

## Zweck, Mental Model und Dependencies

API Gateway bietet zwei primäre API-Typen: REST-APIs (der ursprüngliche, funktionsreichere Typ mit umfangreicheren Request-/Response-Transformationsmöglichkeiten, Caching-Optionen, und detaillierterer Zugriffskontrolle) und HTTP-APIs (ein neuerer, schlankerer Typ mit geringerem Funktionsumfang, aber niedrigeren Kosten und geringerer Latenz für die meisten Standardanwendungsfälle) — die Wahl zwischen beiden Typen hängt vom tatsächlichen Bedarf an den erweiterten REST-API-Funktionen ab, nicht von einer pauschalen Präferenz für den vermeintlich "vollständigeren" Typ. Ein Authorizer prüft eingehende Anfragen vor der eigentlichen Backend-Verarbeitung — ein Lambda-Authorizer führt benutzerdefinierte Logik aus (z. B. Validierung eines proprietären Tokens gegen einen externen Dienst), während ein JWT-Authorizer standardisierte JSON Web Tokens direkt validiert, ohne eine zusätzliche Lambda-Invocation zu benötigen, was bei hohem Anfragevolumen sowohl Latenz als auch Kosten reduzieren kann. Deployment-Stages stellen die zentrale Mechanik für kontrollierte API-Änderungen dar: Eine API-Definition (Routen, Integrationen, Authorizer) wird bearbeitet, aber diese Änderungen wirken sich erst aus, nachdem sie explizit auf eine bestimmte Stage deployed wurden — dies ermöglicht es, Änderungen zunächst auf einer Entwicklungs- oder Staging-Stage zu testen, bevor sie auf die Produktions-Stage übertragen werden, wobei jede Stage eine eigene, stabile URL besitzt. Der zentrale methodische Punkt ist, dass dieser Schutzmechanismus nur wirksam ist, wenn Entwicklungs- und Produktionsänderungen tatsächlich über getrennte Stages laufen — eine Organisation, die aus Bequemlichkeit alle Änderungen direkt auf die Produktions-Stage deployed (ohne Zwischenstufe), verliert die Möglichkeit, Änderungen vor der produktiven Auswirkung zu testen, selbst wenn die technische Stage-Funktionalität grundsätzlich verfügbar wäre.

~~~text
REST API: original, feature-rich type (extensive transformations, caching, detailed access control)
HTTP API: newer, leaner type -- lower cost, lower latency for most standard use cases
  -> choice based on ACTUAL need for advanced REST API features, not a blanket "fuller = better" preference
Authorizer: checks incoming requests BEFORE backend processing
  Lambda authorizer: custom logic (e.g. validate a proprietary token against an external service)
  JWT authorizer: validates standard JSON Web Tokens DIRECTLY, no extra Lambda invocation needed
    -> lower latency/cost at high request volume
Deployment Stages: API definition (routes, integrations, authorizers) EDITED
  -> changes take effect only after EXPLICIT deployment to a SPECIFIC stage
  -> each stage has its OWN stable URL -- test on dev/staging BEFORE deploying to production
KEY METHODOLOGICAL POINT: this protection mechanism only works if dev/prod changes
  ACTUALLY go through separate stages
  -> an org deploying everything directly to production stage (no intermediate step)
     loses the ability to test changes before production impact
     EVEN IF the stage mechanism itself is technically available
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| REST-API versus HTTP-API | unterschiedlicher Funktionsumfang und Kosten | Wahl anhand tatsächlichen Bedarfs an erweiterten Funktionen |
| Authorizer (Lambda/JWT) | Zugriffskontrolle vor Backend-Verarbeitung | JWT-Authorizer reduziert Latenz/Kosten gegenüber Lambda-Authorizer bei Standardfällen |
| Backend-Integration | verbindet API-Routen mit tatsächlicher Verarbeitungslogik | z. B. Lambda-Integration, HTTP-Proxy-Integration |
| Deployment-Stage | trennt API-Definition von produktiver Wirksamkeit | wirksamer Schutz nur bei konsequenter Nutzung getrennter Stages |

Implementierung: Die Wahl zwischen REST-API und HTTP-API wird anhand des tatsächlichen Bedarfs an erweiterten Funktionen (Caching, detaillierte Transformationen) getroffen, statt pauschal den funktionsreicheren, aber teureren REST-API-Typ zu verwenden. Authorizer werden basierend auf dem tatsächlichen Authentifizierungsmodell gewählt — JWT-Authorizer für standardisierte Token, Lambda-Authorizer nur bei tatsächlichem Bedarf an benutzerdefinierter Validierungslogik. API-Änderungen werden konsequent zunächst auf eine Entwicklungs- oder Staging-Stage deployed und dort getestet, bevor sie explizit auf die Produktions-Stage übertragen werden, statt Änderungen direkt und ohne Zwischenschritt produktiv zu deployen.

## Scalability, Reliability, Security und Observability

Amazon API Gateway skaliert die Kontrolle über produktive API-Änderungen proportional zur konsequenten Nutzung getrennter Deployment-Stages; die Reliability-Grenze liegt darin, dass eine fehlende Stage-Trennung proportional zur Häufigkeit direkter Produktions-Deployments zu unkontrollierten, unbeabsichtigten Auswirkungen auf produktive Nutzer führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine API-Änderung wirkt sich unerwartet sofort auf produktive Nutzer aus | die Änderung wurde direkt auf die Produktions-Stage deployed, ohne vorherige Prüfung auf einer separaten Stage | einen verbindlichen Prozess einführen, der Änderungen zunächst auf einer Entwicklungs-/Staging-Stage testet |
| eine Authorizer-Prüfung verursacht unerwartet hohe Latenz | ein Lambda-Authorizer wird für einen Standardfall eingesetzt, der auch mit einem direkten JWT-Authorizer abgedeckt werden könnte | prüfen, ob ein JWT-Authorizer die tatsächlichen Validierungsanforderungen ohne zusätzliche Lambda-Invocation erfüllen kann |
| die API-Kosten sind höher als für den tatsächlichen Funktionsumfang erwartet | eine REST-API wird genutzt, obwohl die tatsächlichen Anforderungen auch mit einer kostengünstigeren HTTP-API erfüllbar wären | den tatsächlichen Funktionsbedarf gegen die HTTP-API-Fähigkeiten prüfen |

Security: Authorizer-Konfigurationen sollten regelmäßig gegen tatsächliche Authentifizierungsanforderungen geprüft werden, insbesondere bei Lambda-Authorizern, deren benutzerdefinierte Logik potenzielle Sicherheitslücken enthalten kann, die bei standardisierten JWT-Authorizern durch etablierte Bibliotheken vermieden werden. Observability: Die tatsächliche Nutzung jeder Deployment-Stage, die Latenzverteilung nach Authorizer-Typ, und die Häufigkeit direkter (nicht über Zwischenstufen laufender) Produktions-Deployments sind zentrale Metriken zur Bewertung der API-Gateway-Governance.

## Trade-offs und Entscheidungen

**Staff** testet API-Änderungen konsequent auf einer separaten Stage, bevor sie auf die Produktions-Stage übertragen werden. **Principal** macht die Wahl zwischen REST- und HTTP-API sowie Authorizer-Typ für das Team nachvollziehbar. **Chief** legt API-Gateway-Governance-Richtlinien im Unternehmen anhand konsequenter Stage-Trennung fest.

Anti-Patterns: API-Änderungen ohne vorherige Prüfung auf einer separaten Stage direkt auf die Produktions-Stage deployen; einen Lambda-Authorizer für Standardfälle einsetzen, die auch mit einem direkten, kostengünstigeren JWT-Authorizer abgedeckt werden könnten; eine REST-API ohne tatsächlichen Bedarf an deren erweiterten Funktionen einsetzen, wo eine HTTP-API ausreichend wäre.

## Production Checklist

- [ ] API-Änderungen werden konsequent zunächst auf einer Entwicklungs-/Staging-Stage getestet.
- [ ] Der Authorizer-Typ (Lambda versus JWT) ist anhand des tatsächlichen Authentifizierungsmodells gewählt.
- [ ] Der API-Typ (REST versus HTTP) ist anhand des tatsächlichen Funktionsbedarfs begründet.
- [ ] Die Nutzung jeder Deployment-Stage wird überwacht, um direkte Produktions-Deployments zu identifizieren.

## Interviewfragen

### 1. Was unterscheidet REST-API und HTTP-API in Amazon API Gateway?

**Antwort:** REST-API bietet einen größeren Funktionsumfang (erweiterte Transformationen, Caching, detaillierte Zugriffskontrolle) zu höheren Kosten; HTTP-API ist schlanker, kostengünstiger und latenzärmer für die meisten Standardanwendungsfälle.

### 2. Was ist der Unterschied zwischen einem Lambda-Authorizer und einem JWT-Authorizer?

**Antwort:** Ein Lambda-Authorizer führt benutzerdefinierte Validierungslogik über eine zusätzliche Lambda-Invocation aus; ein JWT-Authorizer validiert standardisierte Tokens direkt, ohne zusätzliche Invocation, was Latenz und Kosten reduzieren kann.

### 3. Wie schützen Deployment-Stages vor unbeabsichtigten produktiven Auswirkungen?

**Antwort:** Änderungen an der API-Definition wirken sich erst nach explizitem Deployment auf eine bestimmte Stage aus, sodass Änderungen zunächst auf einer Entwicklungs-/Staging-Stage getestet werden können, bevor sie die Produktions-Stage erreichen.

### 4. Warum ist der Schutz durch Deployment-Stages nur bei konsequenter Nutzung wirksam?

**Antwort:** Weil eine Organisation, die Änderungen direkt auf die Produktions-Stage deployed, ohne eine separate Test-Stage zu nutzen, die Möglichkeit verliert, Änderungen vor der produktiven Auswirkung zu prüfen, selbst wenn die technische Stage-Funktionalität verfügbar ist.

### 5. Wie gehst du vor, wenn eine API-Änderung sich unerwartet sofort auf produktive Nutzer auswirkt?

**Antwort:** Ich prüfe, ob die Änderung direkt auf die Produktions-Stage deployed wurde, ohne vorherige Prüfung auf einer separaten Stage, und führe einen verbindlichen Prozess ein, der zukünftig zunächst eine Entwicklungs-/Staging-Stage-Prüfung vorschreibt.

### 6. Widersprüchliche Anforderung: Team will schnelle, unkomplizierte API-Deployments (direkt in Produktion) UND garantiert keine unbeabsichtigten Produktionsauswirkungen — wie gehst du vor?

**Antwort:** Ich würde einen leichtgewichtigen, aber verbindlichen Zwei-Stage-Prozess (Staging, dann Produktion) mit automatisierter Prüfung einführen, sodass Deployments weiterhin schnell erfolgen können, aber jede Änderung zumindest kurzzeitig auf einer Nicht-Produktions-Stage verifiziert wird, bevor sie produktiv wirksam wird.

## Praktische Labs

~~~python
# Conceptual deployment-stage governance check (not executed against a real AWS account):

def check_deployment_governance(deployment_history):
    """deployment_history: list of {"stage": str, "tested_on_staging_first": bool}"""
    direct_prod_deployments = [
        d for d in deployment_history
        if d["stage"] == "production" and not d["tested_on_staging_first"]
    ]
    return {
        "total_prod_deployments": sum(1 for d in deployment_history if d["stage"] == "production"),
        "direct_untested_prod_deployments": len(direct_prod_deployments),
        "governance_risk": len(direct_prod_deployments) > 0,
    }

deployment_history = [
    {"stage": "staging", "tested_on_staging_first": True},
    {"stage": "production", "tested_on_staging_first": True},
    {"stage": "production", "tested_on_staging_first": False},  # governance gap
]

print(check_deployment_governance(deployment_history))
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [Amazon API Gateway — Choosing Between REST APIs and HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html), abgerufen 2026-09-18.
2. AWS-Dokumentation: [Amazon API Gateway — Deploying a REST API](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-deploy-api.html), abgerufen 2026-09-18.

API Gateways und Request-Policies sind kanonisch in [KB-0166](../07-backend-integration/14-api-gateways-und-request-policies.md) behandelt; AWS Lambda in [KB-0472](10-aws-lambda.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, native Unterstützung für WebSocket- und HTTP-API-Feature-Parität, die die frühere Notwendigkeit für REST-APIs bei bestimmten Anwendungsfällen reduziert | Adopting | Gegenüber klassischen REST-APIs bevorzugen, sobald die tatsächlich benötigten Funktionen als HTTP-API verfügbar sind. |

Ein Team akzeptiert eine API-Gateway-Konfiguration erst, wenn Deployment-Stages nachweislich konsequent genutzt werden und der Authorizer-Typ dem tatsächlichen Authentifizierungsmodell entspricht.
