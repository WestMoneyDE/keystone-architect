---
{"id": "KB-0467", "title": "Amazon Route 53", "domain": "19", "sequence": 5, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0455", "concepts": ["Hybrides DNS"], "needed_for": "understanding"}, {"id": "KB-0466", "concepts": ["AWS Transit Gateway"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Hosted Zone mit Health Checks und einer Routing-Policy (z. B. Failover oder gewichtetes Routing) anhand offizieller Dokumentation konfigurieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine hybride DNS-Architektur mit Route 53 Resolver für die Namensauflösung zwischen AWS und On-Premises gestalten, die explizite, dokumentierte DNS-Verantwortungsgrenzen definiert.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein unerwartetes Failover-Verhalten auf eine fehlerhaft konfigurierte Health-Check-Bedingung oder eine falsch gewählte Routing-Policy zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "DNS-Governance-Richtlinien im Unternehmen anhand klar dokumentierter Verantwortungsgrenzen zwischen Route 53 Hosted Zones und On-Premises-DNS-Infrastruktur statt anhand ad-hoc gewachsener Weiterleitungsregeln festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der Route-53-Resolver-Endpunkte im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Hosted Zones, Health Checks, Routing-Policies und hybrider Namensauflösung als Entscheidungsgrundlage, nicht die Resolver-Endpunkt-Interna."}}, "lab_validation": [{"lab_id": "KB-0467-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Amazon-Route-53-Dokumentation, kein aktives AWS-Konto verwendet", "evidence": "Anhand offizieller AWS-Dokumentation wird nachvollzogen, wie Hosted Zones DNS-Namensräume verwalten, wie Health Checks die Verfügbarkeit von Endpunkten prüfen und Routing-Policies (z. B. Failover, gewichtet, latenzbasiert) basierend auf diesen Prüfungen unterschiedliche Antworten liefern, und wie Route 53 Resolver hybride Namensauflösung zwischen AWS und On-Premises-Infrastruktur ermöglicht.", "limitations": "Kein aktives AWS-Konto verwendet, keine reale Route-53-Konfiguration erstellt."}]}
---
# Amazon Route 53

> **Ziel:** Amazon Route 53 ist ein DNS-Dienst, der Hosted Zones (verwaltete Namensräume, siehe hybrides DNS, [KB-0455](../18-cloud-foundations/15-hybrides-dns.md)), Health Checks (regelmäßige Prüfungen der Verfügbarkeit eines Endpunkts, z. B. über HTTP-Anfragen) und Routing-Policies (Regeln, die basierend auf unterschiedlichen Kriterien wie Health-Check-Status, geografischer Nähe, oder konfigurierten Gewichtungen unterschiedliche DNS-Antworten liefern) kombiniert. Der zentrale Punkt dieses Kapitels ist, dass eine Routing-Policy nur so verlässlich ist wie die zugrunde liegende Health-Check-Konfiguration — eine Failover-Routing-Policy, die auf einem unzureichend konfigurierten Health Check basiert (z. B. einer Prüfung, die nur die grundsätzliche Netzwerkerreichbarkeit, nicht aber die tatsächliche Anwendungsfunktionsfähigkeit prüft), kann zu einem unerwarteten Failover-Verhalten führen — entweder zu spät (der Health Check erkennt ein tatsächliches Problem nicht) oder zu früh (der Health Check schlägt fälschlich an, obwohl der Dienst tatsächlich funktionsfähig ist).

## Zweck, Mental Model und Dependencies

Eine Hosted Zone in Route 53 verwaltet die DNS-Einträge für einen bestimmten Namensraum, wobei sowohl öffentliche Hosted Zones (für im Internet auflösbare Namen) als auch private Hosted Zones (für ausschließlich innerhalb eines oder mehrerer VPCs auflösbare Namen, relevant für hybride DNS-Architekturen) unterstützt werden. Ein Health Check prüft regelmäßig die Verfügbarkeit eines Endpunkts anhand konfigurierbarer Kriterien (z. B. eine HTTP-Anfrage mit erwartetem Statuscode, ein TCP-Verbindungsversuch, oder die Auswertung eines CloudWatch-Alarms) — die Aussagekraft eines Health Checks hängt vollständig davon ab, was tatsächlich geprüft wird: Ein reiner TCP-Verbindungstest zeigt nur, dass ein Port erreichbar ist, nicht jedoch, dass die dahinterliegende Anwendung tatsächlich funktionsfähige Antworten liefert, während ein HTTP-Anfrage-basierter Health Check mit Prüfung eines spezifischen, aussagekräftigen Endpunkts (z. B. eines dedizierten Health-Endpoints, der tatsächliche Anwendungslogik oder Datenbankverbindungen prüft) eine deutlich verlässlichere Aussage über die tatsächliche Funktionsfähigkeit liefert. Routing-Policies nutzen diese Health-Check-Ergebnisse, um unterschiedliche DNS-Antworten zu liefern — eine Failover-Policy liefert die Adresse eines primären Endpunkts, solange dessen Health Check erfolgreich ist, und wechselt automatisch zur Adresse eines sekundären Endpunkts, sobald der primäre Health Check fehlschlägt; eine gewichtete Policy verteilt Anfragen proportional zu konfigurierten Gewichten über mehrere Endpunkte, unabhängig vom Health-Check-Status (sofern kein Health Check konfiguriert ist) oder unter Ausschluss fehlgeschlagener Endpunkte (sofern Health Checks konfiguriert sind). Route 53 Resolver ermöglicht zusätzlich hybride Namensauflösung, indem Resolver-Endpunkte innerhalb einer VPC eingerichtet werden, die Anfragen an On-Premises-DNS-Server weiterleiten können (und umgekehrt), was die Grundlage für konsistente Namensauflösung über hybride Umgebungen hinweg bildet (siehe [KB-0455](../18-cloud-foundations/15-hybrides-dns.md) für die allgemeine Problematik von Split-Horizon-DNS und zyklischer Auflösung in solchen Architekturen). Der zentrale methodische Punkt ist, dass die Wahl und Konfiguration des Health Checks direkten Einfluss auf die Verlässlichkeit jeder darauf basierenden Routing-Policy hat — ein zu oberflächlicher Health Check erkennt tatsächliche Probleme nicht rechtzeitig, während ein zu empfindlicher Health Check zu unnötigen, störenden Failover-Ereignissen führen kann, obwohl der Dienst tatsächlich funktionsfähig ist.

~~~text
Hosted Zone: manages DNS records for a namespace
  public: internet-resolvable names
  private: resolvable ONLY within VPC(s) -- relevant for hybrid DNS (see KB-0455)
Health Check: periodic availability check against configurable criteria
  RELIABILITY depends ENTIRELY on WHAT is actually checked
  bare TCP connectivity test: only shows a PORT is reachable, NOT that the app behind it works
  HTTP request to a DEDICATED health endpoint (checks actual app logic/DB connectivity): much more reliable
Routing policies use health check results:
  Failover: primary address served while healthy -> auto-switch to secondary on failure
  Weighted: distributes proportionally, optionally excluding failed endpoints if health-checked
Route 53 Resolver: hybrid name resolution -- endpoints in a VPC forward queries to/from on-prem DNS
KEY METHODOLOGICAL POINT: health check choice/config DIRECTLY determines routing policy reliability
  too shallow a check -> real problems detected too late
  too sensitive a check -> unnecessary, disruptive failovers despite the service actually working
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Hosted Zone (öffentlich/privat) | verwaltet DNS-Namensraum | private Zonen relevant für hybride, interne Namensauflösung |
| Health Check | prüft Endpunkt-Verfügbarkeit | Aussagekraft hängt von der Tiefe der geprüften Kriterien ab |
| Routing-Policy (Failover, gewichtet, latenzbasiert) | liefert kontextabhängige DNS-Antworten | Verlässlichkeit ist direkt an die Health-Check-Qualität gekoppelt |
| Route 53 Resolver | ermöglicht hybride Namensauflösung | Grundlage für konsistente DNS über AWS und On-Premises hinweg |

Implementierung: Für jede Routing-Policy, die auf Health-Check-Ergebnissen basiert, wird ein Health Check konfiguriert, der einen tatsächlich aussagekräftigen Endpunkt prüft (z. B. einen dedizierten Health-Endpoint mit Datenbankverbindungsprüfung), statt einen reinen Netzwerkerreichbarkeitstest zu verwenden. Die Sensitivität des Health Checks (Prüfintervall, Anzahl aufeinanderfolgender Fehlschläge bis zur Statusänderung) wird gegen das tatsächliche Risiko unnötiger, störender Failover-Ereignisse abgewogen. Für hybride Umgebungen wird Route 53 Resolver mit explizit dokumentierten, autoritativen Zuständigkeiten für jeden Namensraum konfiguriert, um die in [KB-0455](../18-cloud-foundations/15-hybrides-dns.md) beschriebenen Risiken (Split-Horizon-Inkonsistenz, zyklische Auflösung) zu vermeiden.

## Scalability, Reliability, Security und Observability

Amazon Route 53 skaliert die Verlässlichkeit automatisierter Failover- und Routing-Entscheidungen proportional zur Aussagekraft der zugrunde liegenden Health Checks; die Reliability-Grenze liegt darin, dass ein unzureichend konfigurierter Health Check proportional zur Diskrepanz zwischen geprüftem Kriterium und tatsächlicher Anwendungsfunktionsfähigkeit zu verzögerten oder fälschlich ausgelösten Failover-Ereignissen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Failover findet nicht statt, obwohl der Dienst tatsächlich nicht funktionsfähig ist | der Health Check prüft nur oberflächliche Kriterien (z. B. TCP-Erreichbarkeit), die trotz tatsächlichem Anwendungsfehler weiterhin erfolgreich sind | den Health Check auf einen tatsächlich aussagekräftigen, dedizierten Endpunkt umstellen |
| ein unnötiger Failover tritt auf, obwohl der Dienst tatsächlich funktionsfähig ist | der Health Check ist zu empfindlich konfiguriert (z. B. zu kurzes Intervall, zu wenige erlaubte, aufeinanderfolgende Fehlschläge) | die Sensitivitätsparameter des Health Checks gegen das tatsächliche Risikoprofil des Dienstes anpassen |
| eine hybride Namensauflösung liefert inkonsistente oder fehlerhafte Ergebnisse | die autoritative Zuständigkeit zwischen Route 53 Resolver und On-Premises-DNS ist nicht eindeutig dokumentiert | die Zuständigkeit für jeden Namensraum explizit klären und gegen die tatsächliche Resolver-Konfiguration prüfen |

Security: Öffentliche Hosted Zones sollten regelmäßig auf unerwartete oder unautorisierte DNS-Einträge geprüft werden, da eine Kompromittierung der DNS-Konfiguration erhebliche Auswirkungen (z. B. Umleitung von Traffic) haben kann. Observability: Die tatsächliche Health-Check-Erfolgsrate, die Häufigkeit von Failover-Ereignissen, und die Konsistenz der hybriden Namensauflösung sind zentrale Metriken zur Bewertung der Route-53-Konfiguration.

## Trade-offs und Entscheidungen

**Staff** konfiguriert Health Checks auf tatsächlich aussagekräftige, dedizierte Endpunkte statt oberflächlicher Erreichbarkeitstests. **Principal** macht die Kopplung zwischen Health-Check-Qualität und Routing-Policy-Verlässlichkeit für das Team nachvollziehbar. **Chief** legt DNS-Governance-Richtlinien im Unternehmen anhand klar dokumentierter Verantwortungsgrenzen zwischen Route 53 und On-Premises-DNS fest.

Anti-Patterns: eine Failover-Routing-Policy auf einem reinen Netzwerkerreichbarkeitstest statt einem tatsächlich aussagekräftigen Health Check basieren lassen; Health-Check-Sensitivität ohne Berücksichtigung des Risikos unnötiger Failover-Ereignisse konfigurieren; Route 53 Resolver ohne explizit dokumentierte, autoritative Zuständigkeit für jeden Namensraum in eine hybride Architektur integrieren.

## Production Checklist

- [ ] Health Checks für Failover- oder Routing-Entscheidungen prüfen tatsächlich aussagekräftige, dedizierte Endpunkte.
- [ ] Die Health-Check-Sensitivität ist gegen das Risiko unnötiger Failover-Ereignisse abgewogen.
- [ ] Route 53 Resolver für hybride Umgebungen hat eine explizit dokumentierte, autoritative Zuständigkeit pro Namensraum.
- [ ] Öffentliche Hosted Zones werden regelmäßig auf unerwartete Einträge geprüft.

## Interviewfragen

### 1. Warum kann ein reiner TCP-Verbindungstest als Health Check unzureichend sein?

**Antwort:** Weil er nur zeigt, dass ein Port erreichbar ist, nicht jedoch, dass die dahinterliegende Anwendung tatsächlich funktionsfähige Antworten liefert — eine Failover-Policy auf dieser Basis erkennt tatsächliche Anwendungsprobleme möglicherweise nicht.

### 2. Wie unterscheiden sich öffentliche und private Hosted Zones?

**Antwort:** Öffentliche Hosted Zones verwalten im Internet auflösbare Namen, während private Hosted Zones nur innerhalb einer oder mehrerer VPCs auflösbar sind, relevant für hybride oder interne Namensauflösung.

### 3. Was bestimmt die Verlässlichkeit einer Failover-Routing-Policy?

**Antwort:** Die Qualität und Aussagekraft des zugrunde liegenden Health Checks — ein zu oberflächlicher Check erkennt Probleme zu spät, ein zu empfindlicher Check löst unnötige Failover-Ereignisse aus.

### 4. Was ermöglicht Route 53 Resolver in einer hybriden Umgebung?

**Antwort:** Er ermöglicht Namensauflösung zwischen AWS-VPCs und On-Premises-DNS-Servern über dedizierte Resolver-Endpunkte, die Anfragen in beide Richtungen weiterleiten können.

### 5. Wie gehst du vor, wenn ein Failover nicht stattfindet, obwohl der Dienst tatsächlich nicht funktionsfähig ist?

**Antwort:** Ich prüfe, ob der Health Check nur oberflächliche Kriterien testet, die trotz des tatsächlichen Anwendungsfehlers weiterhin erfolgreich sind, und stelle den Health Check auf einen tatsächlich aussagekräftigen, dedizierten Endpunkt um.

### 6. Widersprüchliche Anforderung: Team will sofortigen, aggressiven Failover bei jedem Anzeichen eines Problems UND maximale Stabilität ohne unnötige Failover-Ereignisse — wie gehst du vor?

**Antwort:** Ich würde einen Health Check mit einem tatsächlich aussagekräftigen Prüfkriterium (nicht nur oberflächlicher Erreichbarkeit) konfigurieren und die Sensitivitätsparameter (Intervall, Fehlschlagsanzahl) sorgfältig kalibrieren, um echte Probleme zuverlässig, aber nicht überempfindlich zu erkennen, statt eines der beiden Ziele einseitig zu priorisieren.

## Praktische Labs

~~~python
# Conceptual health-check quality vs. failover reliability illustration (not executed against a real AWS account):

def simulate_failover_reliability(check_type, actual_app_healthy, port_reachable):
    if check_type == "tcp_only":
        detected_healthy = port_reachable  # blind to actual app state
    elif check_type == "http_dedicated_endpoint":
        detected_healthy = actual_app_healthy  # accurately reflects app state
    else:
        raise ValueError("unknown check type")

    correct_detection = detected_healthy == actual_app_healthy
    return {"detected_healthy": detected_healthy, "matches_reality": correct_detection}

# Scenario: app is actually broken, but port still responds (e.g. process hung)
tcp_result = simulate_failover_reliability("tcp_only", actual_app_healthy=False, port_reachable=True)
http_result = simulate_failover_reliability("http_dedicated_endpoint", actual_app_healthy=False, port_reachable=True)

print(f"TCP-only check: {tcp_result}")
print(f"HTTP dedicated endpoint check: {http_result}")
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [Amazon Route 53 — Health Checks and DNS Failover](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html), abgerufen 2026-09-18.
2. AWS-Dokumentation: [Route 53 Resolver — Hybrid DNS](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver.html), abgerufen 2026-09-18.

Hybrides DNS ist kanonisch in [KB-0455](../18-cloud-foundations/15-hybrides-dns.md) behandelt; AWS Transit Gateway in [KB-0466](04-aws-transit-gateway.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, anwendungsbewusste Health-Check-Integrationen, die direkt auf Application-Performance-Monitoring-Signale statt reiner HTTP-Statuscodes reagieren | Evaluating | Gegenüber Standard-HTTP-Health-Checks erst nach Prüfung der tatsächlichen Erkennungsgenauigkeit für die konkrete Anwendung bevorzugen. |

Ein Team akzeptiert eine Failover- oder Routing-Policy erst, wenn der zugrunde liegende Health Check nachweislich einen tatsächlich aussagekräftigen Endpunkt prüft und dessen Sensitivität gegen unnötige Failover-Ereignisse getestet wurde.
