---
{"id": "KB-0501", "title": "Cloud Load Balancing und Cloud DNS", "domain": "21", "sequence": 3, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0500", "concepts": ["GCP VPC"], "needed_for": "understanding"}, {"id": "KB-0467", "concepts": ["Amazon Route 53"], "needed_for": "context"}, {"id": "KB-0469", "concepts": ["Elastic Load Balancing"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Globale und regionale Cloud-Load-Balancing-Typen sowie Cloud-DNS-Konfigurationen anhand offizieller Dokumentation für konkrete GCP-Lösungen auswählen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Architektur explizit entscheiden, ob ein globaler oder regionaler Load-Balancer-Typ geeignet ist, und wie interne Namensräume über Cloud DNS für private Dienste gestaltet werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartet hohe Latenz oder eine fehlgeschlagene Anfrageverteilung auf eine falsche Wahl zwischen globalem und regionalem Load-Balancer-Typ zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Entry-Point-Standards im Unternehmen anhand konsistenter, anwendungsfallgerechter Wahl zwischen globalen und regionalen Load-Balancer-Typen sowie strukturierter interner DNS-Namensräume festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der Google-Front-End-Infrastruktur im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der global/regional-Unterscheidung und der DNS-Integration als Entscheidungsgrundlage, nicht die Infrastruktur-Interna."}}, "lab_validation": [{"lab_id": "KB-0501-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Google-Cloud-Dokumentation zu Cloud Load Balancing und Cloud DNS, kein aktives GCP-Konto verwendet", "evidence": "Anhand offizieller Google-Cloud-Dokumentation wird nachvollzogen, wie globale Load-Balancer (z. B. External HTTP(S) Load Balancing) Anycast-basiert Anfragen zum nächstgelegenen gesunden Backend über Regionen hinweg leiten, wie regionale Load-Balancer für latenzsensitive, regional begrenzte Anwendungsfälle geeignet sind, wie Health Checks und TLS-Terminierung konfiguriert werden, und wie Cloud DNS öffentliche und private (interne) Namensräume verwaltet.", "limitations": "Kein aktives GCP-Konto verwendet, keine reale Load-Balancer-/DNS-Konfiguration erstellt."}]}
---
# Cloud Load Balancing und Cloud DNS

> **Ziel:** GCP Cloud Load Balancing unterscheidet grundlegend zwischen **globalen** Load-Balancer-Typen (z. B. External HTTP(S) Load Balancing, Anycast-basiert, leiten Anfragen automatisch zum nächstgelegenen gesunden Backend über Regionen hinweg) und **regionalen** Load-Balancer-Typen (auf eine einzelne Region begrenzt, geeignet für latenzsensitive oder regulatorisch auf eine Region beschränkte Anwendungsfälle). Cloud DNS verwaltet sowohl öffentliche als auch private (interne) DNS-Namensräume, wobei private Zonen innerhalb einer VPC aufgelöst werden und nicht öffentlich sichtbar sind. Der zentrale Punkt dieses Kapitels ist, dass eine unerwartet hohe Latenz oder eine fehlgeschlagene Anfrageverteilung häufig auf eine falsche Wahl zwischen globalem und regionalem Load-Balancer-Typ zurückzuführen ist — ein global verteiltes Anwendungsbackend hinter einem regionalen Load Balancer zwingt sämtlichen Traffic zu einer einzigen Region, während ein rein regional genutzter Dienst hinter einem globalen Load Balancer unnötige Komplexität ohne tatsächlichen Nutzen hinzufügt.

## Zweck, Mental Model und Dependencies

GCP Cloud Load Balancing baut auf der globalen VPC-Struktur auf (siehe [KB-0500](02-gcp-vpc.md)) und bietet mehrere Load-Balancer-Typen mit unterschiedlicher geografischer Reichweite: Globale Load-Balancer (etwa External HTTP(S) Load Balancing) nutzen eine einzige Anycast-IP-Adresse, über die Anfragen automatisch über das globale Google-Netzwerk zum nächstgelegenen gesunden Backend geleitet werden, unabhängig davon, in welcher Region sich der Client befindet — dies ist strukturell mächtiger als die AWS-Elastic-Load-Balancing-Logik (siehe [KB-0469](../19-aws/07-elastic-load-balancing.md)), die primär regional operiert und für globale Verteilung zusätzlich Route 53 mit Latenz- oder Geo-Routing benötigt (siehe [KB-0467](../19-aws/05-amazon-route-53.md)). Regionale Load-Balancer-Typen sind dagegen auf eine einzelne Region begrenzt und eignen sich für Anwendungsfälle, bei denen der gesamte Traffic ohnehin in einer Region verbleibt oder regulatorische Anforderungen eine strikte regionale Begrenzung vorschreiben. Health Checks überwachen kontinuierlich die Verfügbarkeit der Backend-Instanzen und entfernen nicht-gesunde Instanzen automatisch aus der Verteilung, während TLS-Terminierung typischerweise am Load Balancer selbst erfolgt, um die Backend-Instanzen von der Verschlüsselungslast zu entlasten. Cloud DNS verwaltet öffentliche Zonen für extern auflösbare Domänennamen sowie private Zonen, die ausschließlich innerhalb einer oder mehrerer verbundener VPCs auflösbar sind — private Zonen ermöglichen interne Namensräume für Dienste, die nicht öffentlich erreichbar sein sollen, ohne auf statische IP-Adressen oder Hosts-Datei-Einträge angewiesen zu sein.

~~~text
GCP Cloud Load Balancing: 2 categories by geographic reach
  GLOBAL (e.g. External HTTP(S) LB): single ANYCAST IP
    -> auto-routes to nearest healthy backend across ALL regions via Google's global network
    (more powerful than AWS ELB, KB-0469, which is regional -- AWS needs Route 53 latency/geo routing for global, KB-0467)
  REGIONAL: bound to single region
    -> fits latency-sensitive OR regulatory region-restricted use cases
Health Checks: continuously monitor backend availability -> auto-remove unhealthy instances
TLS termination: typically at load balancer -> offloads encryption burden from backends
Cloud DNS: PUBLIC zones (externally resolvable) + PRIVATE zones (resolvable only within connected VPC(s))
  -> private zones = internal namespaces, no static IPs/hosts-file entries needed
COMMON MISTAKE:
  globally-distributed backend behind REGIONAL LB -> forces all traffic to single region
  purely regional service behind GLOBAL LB -> unnecessary complexity, no actual benefit
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Globaler Load Balancer | Anycast-IP, automatisches Routing zum nächstgelegenen Backend | für global verteilte Anwendungen |
| Regionaler Load Balancer | auf eine Region begrenzt | für latenzsensitive/regulatorisch begrenzte Anwendungsfälle |
| Health Checks | kontinuierliche Backend-Überwachung | entfernt nicht-gesunde Instanzen automatisch |
| Cloud DNS öffentliche/private Zonen | externe versus interne Namensauflösung | private Zonen für nicht öffentlich erreichbare Dienste |

Implementierung: Für jede Anwendung wird explizit geprüft, ob ihr Backend global verteilt oder auf eine Region begrenzt ist, und der Load-Balancer-Typ entsprechend gewählt, statt standardmäßig einen Typ ohne Rücksicht auf die tatsächliche Backend-Topologie zu verwenden. Health Checks werden mit realistischen Schwellenwerten konfiguriert, die tatsächliches Anwendungsverhalten widerspiegeln, statt generische Standardwerte unreflektiert zu übernehmen. Für interne Dienste wird eine private Cloud-DNS-Zone eingerichtet, um stabile, nicht öffentlich sichtbare Namensauflösung zu ermöglichen.

## Scalability, Reliability, Security und Observability

Cloud Load Balancing skaliert die geografische Reichweite proportional zur korrekten Wahl zwischen globalem und regionalem Typ; die Reliability-Grenze liegt darin, dass eine falsche Zuordnung zwischen Backend-Topologie und Load-Balancer-Reichweite proportional zur Diskrepanz zu unnötiger Latenz oder fehlender globaler Ausfallsicherheit führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Nutzer in entfernten Regionen erleben hohe Latenz | ein global verteiltes Backend liegt hinter einem regionalen statt globalen Load Balancer | prüfen, ob ein globaler Load-Balancer-Typ für die tatsächliche Backend-Verteilung geeigneter ist |
| eine unnötig komplexe Load-Balancer-Konfiguration für einen rein regionalen Dienst | ein globaler Load-Balancer-Typ wird ohne tatsächlichen Bedarf an globaler Reichweite genutzt | prüfen, ob ein regionaler Load-Balancer-Typ für den tatsächlichen Anwendungsfall ausreicht |
| ein interner Dienst ist nicht zuverlässig über einen stabilen Namen erreichbar | keine private Cloud-DNS-Zone ist für den internen Namensraum eingerichtet | eine private Zone für den internen Dienst einrichten statt statischer IP-Referenzen |

Security: TLS-Terminierung am Load Balancer sollte mit aktuellen, verwalteten Zertifikaten erfolgen, und private DNS-Zonen sollten ausschließlich mit den tatsächlich benötigten VPCs verknüpft werden, um eine unbeabsichtigte Sichtbarkeit interner Namensräume zu vermeiden. Observability: Die tatsächliche regionale Verteilung des Traffics relativ zur erwarteten Backend-Topologie, die Health-Check-Fehlerrate, und die Auflösungslatenz von Cloud-DNS-Anfragen sind relevante Betriebssignale.

## Trade-offs und Entscheidungen

**Staff** konfiguriert einen Load Balancer und Health Checks für ein gegebenes Backend korrekt. **Principal** entscheidet, ob ein globaler oder regionaler Load-Balancer-Typ für eine konkrete Architektur geeignet ist. **Chief** legt Entry-Point-Standards für konsistente Load-Balancer- und DNS-Nutzung im gesamten Unternehmen fest.

Anti-Patterns: ein global verteiltes Backend hinter einem regionalen Load Balancer betreiben und dadurch Traffic unnötig auf eine Region beschränken; einen globalen Load-Balancer-Typ für einen rein regionalen Dienst ohne tatsächlichen Bedarf verwenden; interne Dienste über statische IP-Adressen statt private Cloud-DNS-Zonen referenzieren.

## Production Checklist

- [ ] Der Load-Balancer-Typ (global versus regional) entspricht der tatsächlichen Backend-Topologie.
- [ ] Health Checks sind mit realistischen, anwendungsspezifischen Schwellenwerten konfiguriert.
- [ ] TLS-Terminierung nutzt aktuelle, verwaltete Zertifikate.
- [ ] Interne Dienste sind über private Cloud-DNS-Zonen statt statischer IP-Referenzen erreichbar.

## Interviewfragen

### 1. Was ist der zentrale Unterschied zwischen globalen und regionalen GCP-Load-Balancer-Typen?

**Antwort:** Globale Load-Balancer nutzen eine Anycast-IP und leiten Anfragen automatisch zum nächstgelegenen gesunden Backend über alle Regionen hinweg; regionale Load-Balancer sind auf eine einzelne Region begrenzt.

### 2. Wie unterscheidet sich ein globaler GCP-Load-Balancer strukturell von AWS Elastic Load Balancing?

**Antwort:** Ein globaler GCP-Load-Balancer bietet native, Anycast-basierte globale Verteilung; AWS ELB operiert primär regional und benötigt für globale Verteilung zusätzlich Route 53 mit Latenz- oder Geo-Routing.

### 3. Was ist der Unterschied zwischen öffentlichen und privaten Cloud-DNS-Zonen?

**Antwort:** Öffentliche Zonen sind extern auflösbar; private Zonen sind ausschließlich innerhalb einer oder mehrerer verbundener VPCs auflösbar und nicht öffentlich sichtbar.

### 4. Was bewirken Health Checks bei Cloud Load Balancing?

**Antwort:** Sie überwachen kontinuierlich die Verfügbarkeit der Backend-Instanzen und entfernen nicht-gesunde Instanzen automatisch aus der Anfrageverteilung.

### 5. Wie gehst du vor, wenn Nutzer in entfernten Regionen unerwartet hohe Latenz erleben?

**Antwort:** Ich prüfe, ob das Backend global verteilt ist, aber hinter einem regionalen statt globalen Load Balancer liegt, und evaluiere einen Wechsel zu einem globalen Load-Balancer-Typ.

### 6. Widersprüchliche Anforderung: Anwendung soll global mit minimaler Latenz für alle Nutzer erreichbar sein UND Daten dürfen eine bestimmte Region aus regulatorischen Gründen nicht verlassen — wie gehst du vor?

**Antwort:** Ich würde einen globalen Load-Balancer für die Frontend-/Anfrageverteilung nutzen, während die tatsächliche Datenverarbeitung und -speicherung explizit auf die regulatorisch zulässige Region begrenzt bleibt — Anfrageverteilung und Datenresidenz sind getrennte Entscheidungen, die nicht zwingend denselben geografischen Geltungsbereich haben müssen.

## Praktische Labs

~~~python
# Conceptual load-balancer type selection based on backend topology (not executed against a real GCP account):

def recommend_lb_type(backend_regions, regulatory_region_lock):
    if regulatory_region_lock:
        return "regional (regulatory constraint requires region lock)"
    if len(backend_regions) > 1:
        return "global (backend distributed across multiple regions)"
    return "regional (backend confined to a single region, no global benefit)"

cases = [
    {"backend_regions": ["us-central1", "europe-west1", "asia-east1"], "regulatory_region_lock": False},
    {"backend_regions": ["europe-west1"], "regulatory_region_lock": True},
    {"backend_regions": ["us-central1"], "regulatory_region_lock": False},
]

for case in cases:
    print(recommend_lb_type(**case))
~~~

## Dependencies, Cross-References und Quellen

1. Google-Cloud-Dokumentation: [Cloud Load Balancing Overview](https://cloud.google.com/load-balancing/docs/load-balancing-overview), abgerufen 2026-09-18.
2. Google-Cloud-Dokumentation: [Cloud DNS Overview](https://cloud.google.com/dns/docs/overview), abgerufen 2026-09-18.

GCP VPC ist kanonisch in [KB-0500](02-gcp-vpc.md) behandelt; Amazon Route 53 in [KB-0467](../19-aws/05-amazon-route-53.md); Elastic Load Balancing in [KB-0469](../19-aws/07-elastic-load-balancing.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte Traffic-Management-Funktionen für KI-Inferenz-Backends (z. B. lastbewusstes Routing basierend auf Modell-Antwortzeiten) | Evaluating | Gegenüber generischem Health-Check-basiertem Routing erst nach Prüfung, ob inferenzspezifisches Routing einen belegbaren Mehrwert für den konkreten Anwendungsfall bietet, bevorzugen. |

Ein Team akzeptiert eine Cloud-Load-Balancing- und Cloud-DNS-Konfiguration erst, wenn der Load-Balancer-Typ nachweislich der tatsächlichen Backend-Topologie entspricht und interne Namensräume über private Zonen statt statischer Referenzen aufgelöst werden.
