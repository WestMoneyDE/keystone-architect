---
{"id": "KB-0390", "title": "Ingress und Gateway API", "domain": "16", "sequence": 12, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0389", "concepts": ["Services und Cluster-DNS"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Ingress-Ressource und eine äquivalente Gateway-API-Route (GatewayClass, Gateway, HTTPRoute) für dieselbe Routing-Anforderung erstellen und die strukturellen Unterschiede vergleichen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Die Delegationsstruktur der Gateway API (getrennte Verantwortung für Infrastruktur-Betreiber und Anwendungsteams) gegenüber der monolithischeren Ingress-Ressource bewerten.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Vor einer Architekturentscheidung zwischen Ingress und Gateway API die tatsächliche, aktuelle API-Reife anhand der offiziellen Kubernetes-Dokumentation prüfen, statt sich auf möglicherweise veraltetes Wissen zu verlassen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Verpflichtende Primärquellenprüfung für schnelllebige API-Reifegrade (wie die Gateway API) als Standard im Unternehmen etablieren, statt Architekturentscheidungen auf unbestätigten Versionsannahmen zu gründen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Implementierungsdetails spezifischer Gateway-API-Controller (z. B. Envoy Gateway, Istio) sind Vertiefung.", "rationale": "Kern ist das strukturelle Verständnis von Ingress gegenüber Gateway API, nicht eine spezifische Controller-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0390-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal verglichene Manifest-Strukturen einer Ingress-Ressource und einer äquivalenten Gateway-API-Konfiguration", "evidence": "Für dieselbe Routing-Anforderung (Pfad-basiertes Routing zu zwei Backend-Services) wird eine einzelne Ingress-Ressource mit einer aus GatewayClass, Gateway und HTTPRoute bestehenden Gateway-API-Konfiguration verglichen, wobei die Gateway-API-Struktur die Verantwortung für Infrastruktur (Gateway) und Anwendungsrouting (HTTPRoute) explizit trennt.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, konzeptioneller Strukturvergleich ohne Prüfung des aktuellen API-Reifegrads gegen eine Live-Quelle zum Erstellungszeitpunkt dieses Artikels."}]}
---
# Ingress und Gateway API

> **Ziel:** Ingress ist die traditionelle, ältere Kubernetes-Ressource für HTTP(S)-Routing von außerhalb des Clusters zu internen Services (siehe [KB-0389](11-services-und-cluster-dns.md)); die Gateway API ist ein neueres, strukturiert in GatewayClass, Gateway und Route-Objekte aufgeteiltes Modell mit klarerer Verantwortungstrennung. Der zentrale methodische Punkt dieses Kapitels ist nicht nur der strukturelle Vergleich beider Modelle, sondern auch die explizite Disziplin, den tatsächlichen aktuellen Reifegrad und Versionsstand der Gateway API vor einer Architekturentscheidung anhand der offiziellen, aktuellen Kubernetes-Dokumentation zu verifizieren, statt sich auf möglicherweise veraltetes oder unbestätigtes Wissen über einen bestimmten Versionsstand zu verlassen.

## Zweck, Mental Model und Dependencies

Eine Ingress-Ressource bündelt in einem einzelnen Objekt sowohl die Infrastrukturkonfiguration (welcher Ingress-Controller, welche TLS-Zertifikate) als auch die Anwendungsrouting-Regeln (welcher Pfad geht zu welchem Service) — dies funktioniert gut für einfache Fälle, wird aber unübersichtlich, wenn unterschiedliche Teams (ein Infrastrukturteam, das den Controller betreibt, und mehrere Anwendungsteams, die jeweils eigene Routing-Regeln benötigen) dasselbe Objekt gemeinsam verwalten müssen. Die Gateway API trennt diese Verantwortung strukturell in drei Objekttypen: eine GatewayClass (definiert vom Infrastrukturbetreiber, beschreibt eine Klasse von Load-Balancer-Implementierungen), ein Gateway (eine konkrete Instanz dieser Klasse, ebenfalls typischerweise vom Infrastrukturteam verwaltet, definiert Listener-Ports und Protokolle), und eine oder mehrere Route-Ressourcen wie HTTPRoute (von Anwendungsteams verwaltet, definieren die konkreten Pfad-zu-Service-Routing-Regeln für einen bestimmten Gateway). Diese Delegation ermöglicht es, dass ein Infrastrukturteam die Basis-Infrastruktur zentral kontrolliert, während einzelne Anwendungsteams ihre eigenen Routing-Regeln unabhängig verwalten können, ohne Zugriff auf die gesamte Ingress-Konfiguration zu benötigen. Der zentrale methodische Punkt für diesen Artikel ist ausdrücklich, keine spezifische Versionsnummer oder einen bestimmten "GA-Status" der Gateway API als gesicherten Fakt zu behaupten, ohne dies gegen die zum Entscheidungszeitpunkt aktuelle, offizielle Kubernetes-Dokumentation zu verifizieren — API-Reifegrade und Versionsstände bei schnelllebigen Kubernetes-Subprojekten ändern sich häufig, und eine veraltete Annahme über den Reifegrad kann zu einer riskanten Architekturentscheidung führen (z. B. der Einsatz einer noch nicht stabilen API in einer produktionskritischen Umgebung, oder umgekehrt der unnötige Verzicht auf eine bereits stabile Funktion aus veralteter Vorsicht).

~~~text
Ingress: single resource bundles infra config (controller, TLS) + application routing rules (path -> service)
  works for simple cases, gets messy when infra team + multiple app teams must share ONE object
Gateway API: splits responsibility into THREE object types
  GatewayClass (infra operator): describes a class of load-balancer implementation
  Gateway (infra operator, usually): concrete instance -- listener ports/protocols
  Route (e.g. HTTPRoute; app team): concrete path-to-service routing rules FOR a given Gateway
  -> DELEGATION: infra team controls the base, app teams manage their own routing independently
CRITICAL METHODOLOGICAL POINT: never assert a specific version number or "GA status" as settled fact
  without verifying against the CURRENT official Kubernetes documentation at decision time
  -> fast-moving Kubernetes subprojects change maturity/version status frequently
  -> outdated assumption -> risky decision (deploying an immature API in production, OR needlessly avoiding a now-stable one)
~~~

## Core Concepts, Architektur und Implementierung

| Aspekt | Ingress | Gateway API |
|---|---|---|
| Objektstruktur | ein einzelnes Objekt für Infrastruktur und Routing | getrennte Objekte: GatewayClass, Gateway, Route |
| Verantwortungstrennung | begrenzt, oft von einem Team gemeinsam verwaltet | explizit für Infrastruktur- und Anwendungsteams getrennt |
| Erweiterbarkeit | über controller-spezifische Annotationen (nicht standardisiert) | über standardisierte, typisierte Route-Ressourcen je Protokoll |
| Vor Einsatz zu prüfen | Reifegrad des jeweiligen Ingress-Controllers | aktueller Reifegrad/Versionsstand der Gateway API selbst gegen die offizielle Dokumentation |

Implementierung: Bei einer Architekturentscheidung zwischen Ingress und Gateway API wird zunächst die tatsächliche organisatorische Anforderung geklärt — benötigen mehrere unabhängige Anwendungsteams eigene, delegierte Routing-Kontrolle, oder reicht eine einfache, zentral verwaltete Ingress-Konfiguration aus? Vor jeder Entscheidung für die Gateway API wird deren aktueller Reifegrad und Versionsstand explizit gegen die zu diesem Zeitpunkt aktuelle, offizielle Kubernetes-Dokumentation geprüft, statt sich auf eine möglicherweise veraltete, zu einem früheren Zeitpunkt gültige Information zu verlassen — dies ist besonders wichtig, da sich der Reifegrad einer noch in Entwicklung befindlichen API zwischen Kubernetes-Releases signifikant ändern kann.

## Scalability, Reliability, Security und Observability

Die Gateway API skaliert organisatorische Delegation proportional zur Anzahl unabhängiger Anwendungsteams, die eigene Routing-Regeln benötigen; die Reliability-Grenze liegt darin, dass eine unverifizierte Annahme über den API-Reifegrad proportional zur tatsächlichen Diskrepanz zum aktuellen Stand das Risiko einer riskanten oder unnötig konservativen Architekturentscheidung erhöht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Team trifft eine Architekturentscheidung basierend auf einem als "noch nicht stabil" bekannten Gateway-API-Status, der inzwischen überholt ist | die Information über den API-Reifegrad wurde nicht gegen die aktuelle offizielle Dokumentation zum Entscheidungszeitpunkt geprüft | die aktuelle Kubernetes-Dokumentation zum Reifegrad der Gateway API zum jetzigen Zeitpunkt konsultieren |
| mehrere Anwendungsteams behindern sich gegenseitig bei der gemeinsamen Verwaltung einer einzelnen Ingress-Ressource | die organisatorische Struktur erfordert delegierte Routing-Kontrolle, die eine einzelne Ingress-Ressource nicht bietet | die Migration zur Gateway API mit getrennten Route-Ressourcen pro Team evaluieren |
| eine produktive Anwendung wird auf einer als "experimentell" geltenden API-Version betrieben, ohne dass dies bewusst entschieden wurde | der tatsächliche Reifegrad der verwendeten API-Version wurde nicht vor dem produktiven Einsatz geprüft | den aktuellen Reifegrad der verwendeten API-Version explizit gegen die offizielle Dokumentation verifizieren |

Security: Sowohl Ingress-Controller als auch Gateway-API-Implementierungen sind der zentrale Eingangspunkt von externem Verkehr in den Cluster und erfordern entsprechend sorgfältige TLS- und Zugriffskonfiguration, unabhängig davon, welches der beiden Modelle verwendet wird. Observability: Der Anteil der Routing-Konfigurationen, deren zugrunde liegender API-Reifegrad zuletzt verifiziert wurde, sowie die organisatorische Verteilung der Routing-Verwaltung (zentral vs. delegiert) sind relevante strategische Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert eine explizite Prüfung des aktuellen API-Reifegrads vor jeder Architekturentscheidung zwischen Ingress und Gateway API. **Principal** macht die organisatorische Delegationsstruktur für das Team nachvollziehbar. **Chief** etabliert verpflichtende Primärquellenprüfung für schnelllebige API-Reifegrade als Standard im Unternehmen, statt Architekturentscheidungen auf unbestätigten Versionsannahmen zu gründen.

Anti-Patterns: eine Architekturentscheidung auf Basis eines nicht verifizierten, möglicherweise veralteten API-Reifegrads treffen; eine einzelne Ingress-Ressource für eine organisatorische Struktur mit mehreren unabhängigen Anwendungsteams beibehalten, obwohl delegierte Routing-Kontrolle tatsächlich benötigt wird; produktionskritische Systeme auf einer API-Version betreiben, ohne deren aktuellen Reifegrad bewusst geprüft zu haben.

## Production Checklist

- [ ] Der aktuelle Reifegrad der verwendeten Routing-API (Ingress oder Gateway API) ist gegen die offizielle Dokumentation verifiziert.
- [ ] Die organisatorische Delegationsanforderung (zentral vs. team-unabhängig) ist vor der Architekturentscheidung geklärt.
- [ ] TLS- und Zugriffskonfiguration sind für den gewählten Eingangspunkt sorgfältig konfiguriert.
- [ ] Der API-Reifegrad wird bei Kubernetes-Versions-Upgrades erneut geprüft, da er sich ändern kann.

## Interviewfragen

### 1. Was ist der strukturelle Hauptunterschied zwischen Ingress und Gateway API?

**Antwort:** Ingress bündelt Infrastruktur- und Anwendungsrouting-Konfiguration in einem Objekt; die Gateway API trennt dies strukturell in GatewayClass, Gateway und Route-Objekte mit expliziter Verantwortungstrennung.

### 2. Welchen organisatorischen Vorteil bietet die Delegationsstruktur der Gateway API?

**Antwort:** Ein Infrastrukturteam kontrolliert die Basis-Infrastruktur (GatewayClass, Gateway), während einzelne Anwendungsteams ihre eigenen Routing-Regeln (Route-Ressourcen) unabhängig verwalten können.

### 3. Warum ist es methodisch wichtig, den aktuellen Reifegrad der Gateway API vor einer Architekturentscheidung zu verifizieren, statt sich auf vorheriges Wissen zu verlassen?

**Antwort:** API-Reifegrade bei schnelllebigen Kubernetes-Subprojekten ändern sich häufig zwischen Releases; eine veraltete Annahme kann zu einer riskanten Entscheidung (Einsatz einer unreifen API) oder einer unnötig konservativen Entscheidung (Vermeidung einer inzwischen stabilen API) führen.

### 4. Was passiert, wenn mehrere Anwendungsteams eine einzelne Ingress-Ressource gemeinsam verwalten müssen?

**Antwort:** Dies wird organisatorisch unübersichtlich, da alle Teams Zugriff auf dasselbe Objekt benötigen, was Konflikte und mangelnde Isolation zwischen den Teams verursachen kann — ein Anwendungsfall, für den die Gateway API eine strukturelle Lösung bietet.

### 5. Wie gehst du vor, wenn ein Team eine Architekturentscheidung basierend auf einem möglicherweise veralteten API-Reifegrad treffen will?

**Antwort:** Ich fordere eine explizite Prüfung der aktuellen, offiziellen Kubernetes-Dokumentation zum jetzigen Zeitpunkt, statt die Entscheidung auf einer möglicherweise überholten Information zu gründen.

### 6. Widersprüchliche Anforderung: Team will die neueste, potenziell leistungsfähigere Gateway-API-Funktionalität UND garantierte Produktionsstabilität — wie gehst du vor?

**Antwort:** Ich würde den tatsächlichen, aktuellen Reifegrad jeder einzelnen relevanten Gateway-API-Funktion gegen die offizielle Dokumentation prüfen und nur die Funktionen produktiv einsetzen, die zum Entscheidungszeitpunkt tatsächlich als stabil dokumentiert sind, statt eine pauschale Annahme über den Gesamtreifegrad der API zu treffen.

## Praktische Labs

~~~python
# Conceptual structural comparison (not tied to a specific, unverified version claim):

ingress_manifest_concept = {
    "kind": "Ingress",
    "spec": {
        "rules": [
            {"http": {"paths": [
                {"path": "/api", "backend": {"service": {"name": "api-service"}}},
                {"path": "/web", "backend": {"service": {"name": "web-service"}}},
            ]}}
        ]
    },
}

gateway_api_manifests_concept = {
    "GatewayClass": {"kind": "GatewayClass", "spec": {"controllerName": "example.com/gateway-controller"}},
    "Gateway": {"kind": "Gateway", "spec": {"gatewayClassName": "example-class", "listeners": [{"port": 80, "protocol": "HTTP"}]}},
    "HTTPRoute (owned by app team A)": {"kind": "HTTPRoute", "spec": {"parentRefs": [{"name": "example-gateway"}], "rules": [{"matches": [{"path": {"value": "/api"}}], "backendRefs": [{"name": "api-service"}]}]}},
    "HTTPRoute (owned by app team B)": {"kind": "HTTPRoute", "spec": {"parentRefs": [{"name": "example-gateway"}], "rules": [{"matches": [{"path": {"value": "/web"}}], "backendRefs": [{"name": "web-service"}]}]}},
}

print("Ingress: single object, one team must own it entirely:")
print(ingress_manifest_concept)

print("\nGateway API: infra objects owned by platform team, HTTPRoutes independently owned by each app team:")
for name, manifest in gateway_api_manifests_concept.items():
    print(f"  {name}: {manifest}")

print("\nREMINDER: before choosing Gateway API for production, verify its CURRENT maturity status")
print("against the official Kubernetes documentation at decision time -- do not rely on memorized version claims.")
~~~

## Dependencies, Cross-References und Quellen

1. Kubernetes-Dokumentation: [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/), abgerufen 2026-09-17.
2. Kubernetes Gateway API-Dokumentation: [Gateway API](https://gateway-api.sigs.k8s.io/), abgerufen 2026-09-17 (aktueller Reifegrad/Versionsstand vor jeder Architekturentscheidung erneut gegen diese Quelle zu prüfen).

Services und Cluster-DNS sind kanonisch in [KB-0389](11-services-und-cluster-dns.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Gateway API als zunehmend etabliertes Modell für komplexes, delegiertes Routing gegenüber klassischem Ingress | zum Entscheidungszeitpunkt gegen die offizielle Dokumentation zu prüfen, nicht hier als fixierter Fakt behauptet | Bei Bedarf an delegierter, teamübergreifender Routing-Kontrolle prüfen, ob der aktuelle Reifegrad der Gateway API einen Umstieg rechtfertigt. |
| Protokoll-Erweiterungen der Gateway API über HTTP hinaus (z. B. TCP-/TLS-Routing) | zum Entscheidungszeitpunkt gegen die offizielle Dokumentation zu prüfen | Gegenüber Ingress-spezifischen Erweiterungen (Annotationen) abwägen, sobald der jeweilige Protokollreifegrad dies rechtfertigt. |

Ein Team akzeptiert eine Architekturentscheidung zwischen Ingress und Gateway API erst, wenn der aktuelle API-Reifegrad explizit gegen die offizielle Dokumentation zum Entscheidungszeitpunkt verifiziert wurde.
