---
{"id": "KB-0166", "title": "API Gateways und Request-Policies", "domain": "07", "sequence": 14, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "STAFF", "PRINCIPAL"], "requires": [{"id": "KB-0072", "concepts": ["Proxy"], "needed_for": "both"}, {"id": "KB-0165", "concepts": ["Autorisierung"], "needed_for": "both"}], "related": ["KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Gateway-Routing- und Rate-Limit-Policy lokal simulieren und einen Fall zeigen, in dem eine Backend-Regel dupliziert statt zentral am Gateway durchgesetzt wird.", "rationale": "Kein reales Gateway nötig, um das Verantwortungsabgrenzungsprinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Klare Grenze zwischen Gateway-Verantwortung (Routing, grobe Policies) und Service-Verantwortung (fachliche Autorisierung) ziehen.", "rationale": "Ein Gateway, das versucht, fachliche Logik zu übernehmen, wird zum unübersichtlichen Flaschenhals."}, "STAFF-TARGET": {"active": true, "scope": "Eine doppelt implementierte Rate-Limit- oder Auth-Regel (Gateway und Service) als Inkonsistenzrisiko identifizieren.", "rationale": "Duplizierte Policy-Logik zwischen Gateway und Service driftet leicht auseinander."}, "CHIEF-TARGET": {"active": true, "scope": "Klare Verantwortungsgrenze zwischen zentralem Gateway und einzelnen Services als Architekturstandard festlegen.", "rationale": "Unklare Grenze erzeugt entweder einen überladenen Gateway-Flaschenhals oder inkonsistente, verstreute Policy-Durchsetzung."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Spätere Rolle von AI-Gateways (z. B. für LLM-Traffic-Steuerung) im Detail ist Vertiefung.", "rationale": "Kern sind Routing-/Policy-Grundlagen eines klassischen API Gateways."}}, "lab_validation": [{"lab_id": "KB-0166-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Gateway-Routing mit Rate-Limit-Policy", "evidence": "Das Gateway lehnt Anfragen oberhalb des konfigurierten Limits ab, bevor sie den dahinterliegenden Service überhaupt erreichen.", "limitations": "Kein reales Gateway, keine Produktion."}]}
---
# API Gateways und Request-Policies

> **Ziel:** Ein API Gateway zentralisiert Routing, grobe Zugangskontrolle (Rate Limiting, grundlegende Authentifizierung) und Transformation für eingehenden Traffic. Die kritische Architekturentscheidung ist die Verantwortungsgrenze: das Gateway übernimmt generische, plattformweite Policies, während fachliche Autorisierung und Geschäftslogik in den einzelnen Services verbleiben — eine unklare Grenze führt entweder zu einem überladenen Gateway-Flaschenhals oder zu inkonsistent duplizierter Policy-Logik.

## Zweck, Mental Model und Dependensies

Ein Gateway sitzt als Reverse Proxy ([KB-0072](../03-network-foundations/24-forward-und-reverse-proxies.md)) vor den eigentlichen Backend-Services und übernimmt Aufgaben, die für alle oder viele Services gleichermaßen gelten: Routing zu der richtigen Service-Instanz, TLS-Terminierung, grundlegende Rate Limits, grobe Authentifizierungsprüfung (ist überhaupt ein gültiges Token vorhanden). Fachliche Autorisierung ([KB-0165](13-autorisierung-an-api-grenzen.md)) — „darf dieser konkrete Nutzer dieses konkrete Objekt sehen" — bleibt Service-Verantwortung, da nur der Service den fachlichen Kontext vollständig kennt. Lies [KB-0072](../03-network-foundations/24-forward-und-reverse-proxies.md) und [KB-0165](13-autorisierung-an-api-grenzen.md).

~~~text
Client -> API Gateway: TLS termination, routing, coarse rate limit, "is token valid?"
       -> Service: fine-grained authorization ("can THIS user see THIS object"), business logic
Gateway does NOT decide fachliche Autorisierung; Service does NOT redo TLS termination/routing.
~~~

## Core Concepts, Architektur und Implementierung

| Verantwortung | Gateway | Service |
|---|---|---|
| TLS-Terminierung | ja, zentral | nein (oder mTLS intern separat) |
| Routing | ja, zu richtiger Service-Instanz | nein |
| Grobe Rate Limits | ja, plattformweit | ggf. zusätzliche fachliche Limits |
| Token-Gültigkeitsprüfung | ja, „ist Token valide" | ja, „gilt dieses Token für diese Aktion" |
| Fachliche Autorisierung | nein | ja, vollständig |

Implementierung: das Gateway wird bewusst auf generische, plattformweite Aufgaben begrenzt — Aufgaben, die für jeden Service identisch gelten und zentral konsistent durchgesetzt werden sollen. Fachliche Autorisierungsentscheidungen, die den vollständigen Geschäftskontext benötigen, bleiben im Service. Duplizierte Policy-Logik (z. B. dieselbe Rate-Limit-Regel sowohl am Gateway als auch im Service unabhängig implementiert) wird vermieden, indem klar dokumentiert ist, welche Schicht für welche Regel verantwortlich ist.

## Scalability, Reliability, Security und Observability

Ein zentrales Gateway skaliert plattformweite Policy-Durchsetzung konsistent, wird aber selbst zu einem kritischen Single Point, der sorgfältig für hohe Verfügbarkeit und Durchsatz dimensioniert werden muss. Reliability-Grenze: ein Gateway, das versucht, zu viel fachliche Logik zu übernehmen, wird zu einem schwer wartbaren Flaschenhals, bei dem jede fachliche Änderung eine zentrale, für alle Services gemeinsame Komponente berührt — das untergräbt die Unabhängigkeit einzelner Services.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Gateway-Deployment blockiert unabhängige Service-Deployments | zu viel fachliche Logik im Gateway zentralisiert | Umfang der im Gateway implementierten fachlichen Regeln prüfen |
| Rate-Limit-Verhalten unterscheidet sich zwischen Gateway-Log und Service-Log | duplizierte, inkonsistente Policy-Implementierung | Rate-Limit-Konfiguration beider Schichten vergleichen |
| Autorisierungsfehler trotz gültigem Token am Gateway | fachliche Autorisierung fälschlich als „am Gateway erledigt" angenommen | prüfen, ob der Service die feingranulare Prüfung tatsächlich noch selbst durchführt |
| Gateway wird zum Latenz-Flaschenhals unter Last | Gateway-Kapazität nicht für Gesamttraffic aller Services dimensioniert | Gateway-Latenz separat von Backend-Latenz messen |

Security: das Gateway ist ein zentraler, hochprivilegierter Angriffspunkt — seine eigene Sicherheit (Patch-Stand, Konfigurationsverwaltung) hat plattformweite Konsequenzen, anders als ein einzelner kompromittierter Service. Observability: zentrale Gateway-Metriken (Traffic-Verteilung, Rate-Limit-Ablehnungen, Latenz pro Route) geben einen plattformweiten Überblick, der auf Service-Ebene allein nicht sichtbar wäre.

## Trade-offs und Entscheidungen

**Staff** prüft bei neuen Policy-Anforderungen explizit, ob sie ins Gateway (generisch, plattformweit) oder in den Service (fachlich, kontextabhängig) gehören. **Principal** dokumentiert die Verantwortungsgrenze explizit, um Duplikation zu vermeiden. **Chief** verlangt diese klare Trennung als Architekturstandard und plant die Weiterentwicklung des Gateways (z. B. Richtung AI-Gateway für LLM-Traffic) als bewusste, begründete Erweiterung dieser Grenze.

Anti-Patterns: fachliche Autorisierungslogik ins Gateway verlagern, wodurch es zum Flaschenhals für alle Service-Änderungen wird; dieselbe Policy-Regel unabhängig sowohl im Gateway als auch im Service implementieren, ohne Konsistenzprüfung; Gateway-Kapazität nicht für den Gesamttraffic aller dahinterliegenden Services dimensionieren.

## Production Checklist

- [ ] Verantwortungsgrenze zwischen Gateway (generisch) und Service (fachlich) explizit dokumentiert.
- [ ] Keine duplizierte, potenziell inkonsistente Policy-Logik zwischen Gateway und Service.
- [ ] Gateway-Kapazität für Gesamttraffic aller dahinterliegenden Services dimensioniert.
- [ ] Gateway-eigene Sicherheit (Patch-Stand, Konfiguration) mit erhöhter Priorität überwacht.

## Interviewfragen

### 1. Was gehört typischerweise ins API Gateway, was in den Service?

**Antwort:** Generische, plattformweite Aufgaben wie TLS-Terminierung, Routing und grobe Rate Limits gehören ins Gateway; fachliche Autorisierung und Geschäftslogik, die vollständigen Kontext benötigen, bleiben im Service.

### 2. Warum ist ein Gateway mit zu viel fachlicher Logik problematisch?

**Antwort:** Es wird zu einem zentralen Flaschenhals, bei dem jede fachliche Änderung eine für alle Services gemeinsame Komponente berührt, was die eigentliche Unabhängigkeit einzelner Services untergräbt.

### 3. Warum ist duplizierte Policy-Logik zwischen Gateway und Service riskant?

**Antwort:** Beide Implementierungen können über Zeit auseinanderdriften, was zu inkonsistentem Verhalten führt — z. B. unterschiedliche Rate-Limit-Schwellen an beiden Stellen.

### 4. Warum reicht eine grobe Token-Gültigkeitsprüfung am Gateway nicht als vollständige Autorisierung?

**Antwort:** Das Gateway kann nur prüfen, ob ein Token grundsätzlich gültig ist, nicht ob es für eine konkrete fachliche Aktion auf einer konkreten Ressource berechtigt — das erfordert den vollständigen Kontext des Service.

### 5. Warum ist die Sicherheit des Gateways selbst besonders kritisch?

**Antwort:** Als zentraler Eintrittspunkt für den gesamten Plattform-Traffic hat eine Kompromittierung des Gateways plattformweite Konsequenzen, anders als ein einzelner kompromittierter Backend-Service.

### 6. Widersprüchliche Anforderung: Team will zentrale, konsistente Policy-Durchsetzung UND unabhängige Service-Deployments ohne Gateway-Koordination — wie gehst du vor?

**Antwort:** Ich würde die zentrale Durchsetzung auf wirklich generische, selten geänderte Policies (Rate Limits, grobe Auth) begrenzen, die kaum Service-spezifische Anpassung brauchen, während fachliche, häufig geänderte Logik im Service verbleibt — das erhält Unabhängigkeit für die häufigen Änderungen, während seltene generische Regeln zentral konsistent bleiben.

## Praktische Labs

~~~python
rate_limits = {"client1": {"count": 0, "limit": 5}}

def gateway_check(client_id):
    state = rate_limits[client_id]
    if state["count"] >= state["limit"]:
        return False  # rejected at the gateway, never reaches the backend service
    state["count"] += 1
    return True

results = [gateway_check("client1") for _ in range(7)]
assert results.count(True) == 5
assert results.count(False) == 2
print("Gateway correctly rejected requests beyond the rate limit before they reached the service.")
~~~

## Dependencies, Cross-References und Quellen

1. NGINX/F5: [What Is an API Gateway?](https://www.nginx.com/learn/api-gateway/), abgerufen 2026-09-17 (als praxisnahe Referenz für Gateway-Rollenverständnis).

Produktspezifische API-Gateway-Tooling-Details vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| AI-Gateways für LLM-spezifische Traffic-Steuerung (Kosten-/Token-Limits, Modell-Routing) | Emerging | Verantwortungsgrenze zu klassischem API Gateway explizit klären, um Doppelverantwortung zu vermeiden. |

Ein Team akzeptiert eine API-Gateway-Architektur erst, wenn die Verantwortungsgrenze zu Services dokumentiert und keine duplizierte Policy-Logik nachweisbar ist.
