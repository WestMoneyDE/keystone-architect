---
{"id": "KB-0443", "title": "Cloud-Netzwerkmodelle", "domain": "18", "sequence": 3, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE"], "requires": [{"id": "KB-0079", "concepts": ["VRF und Routing-Isolation"], "needed_for": "understanding"}, {"id": "KB-0442", "concepts": ["Shared Responsibility"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein virtuelles Netz mit mehreren Subnetzen anhand offizieller Cloud-Anbieter-Dokumentation strukturieren können und erklären, worin sich ein virtuelles Cloud-Netz von einer physischen Netzwerkkonfiguration unterscheidet.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Adressplanungs- und Isolationsstrategie (Subnetzaufteilung, Transitpfade zwischen virtuellen Netzen) für eine konkrete Anwendungslandschaft begründet gestalten.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen unerwarteten Konnektivitäts- oder Egress-Kostenvorfall auf eine fehlerhafte Transitpfad- oder Adressplanungskonfiguration zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Netzwerkarchitekturrichtlinien für Cloud-Umgebungen im Unternehmen anhand nachvollziehbarer Isolations- und Adressplanungsprinzipien statt anhand ad-hoc gewachsener Konfiguration festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der Software-Defined-Networking-Schicht eines spezifischen Cloud-Anbieters im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Isolation, Adressplanung und Transitpfaden als Entscheidungsgrundlage, nicht die anbieterspezifische SDN-Interna."}}, "lab_validation": [{"lab_id": "KB-0443-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand öffentlich verfügbarer Cloud-Netzwerk-Dokumentation, kein aktives Cloud-Konto verwendet", "evidence": "Anhand öffentlich verfügbarer Dokumentation wird nachvollzogen, wie virtuelle Cloud-Netze und Subnetze eine softwaredefinierte Abstraktion über physischer Netzwerkinfrastruktur bereitstellen, wie Transitpfade zwischen virtuellen Netzen (Peering, Transit Gateways) Isolation bewusst durchbrechen, und welche Adressplanungsüberlegungen bei überlappenden Adressräumen relevant werden.", "limitations": "Kein aktives Cloud-Deployment getestet, keine realen Netzwerkkonfigurationen erstellt oder gemessen."}]}
---
# Cloud-Netzwerkmodelle

> **Ziel:** Ein virtuelles Cloud-Netz (z. B. VPC/VNet, je nach Anbieter unterschiedlich benannt) ist eine softwaredefinierte Netzwerkabstraktion, die logisch von der zugrunde liegenden, physisch geteilten Infrastruktur des Cloud-Anbieters isoliert ist — anders als eine physische Netzwerkkonfiguration (siehe VRF und Routing-Isolation, [KB-0079](../02-netzwerke/12-vrf-und-routing-isolation.md)), bei der Isolation durch dedizierte oder logisch getrennte physische Komponenten erreicht wird, wird die Isolation eines Cloud-Netzes vollständig durch die Software-Defined-Networking-Schicht des Anbieters durchgesetzt. Der zentrale Punkt dieses Kapitels ist, dass Subnetze innerhalb eines virtuellen Netzes, Transitpfade zwischen unterschiedlichen virtuellen Netzen (z. B. Peering oder Transit Gateways), und die zugrunde liegende Adressplanung bewusst gestaltet werden müssen — eine unkoordinierte Adressplanung, die zu überlappenden Adressräumen zwischen Netzen führt, die später verbunden werden sollen, sowie unbedacht konfigurierte Transitpfade, die Isolation unbeabsichtigt durchbrechen, sind praktische Fehlerquellen, die sich in physischen Netzwerken oft anders manifestieren.

## Zweck, Mental Model und Dependencies

Ein virtuelles Cloud-Netz definiert einen logischen Adressraum, der vollständig von anderen virtuellen Netzen isoliert ist, sofern keine explizite Verbindung (Transitpfad) konfiguriert wird — diese Standard-Isolation ist eine softwaredefinierte Eigenschaft, die vom Cloud-Anbieter durchgesetzt wird, unabhängig davon, welche physische Infrastruktur die beteiligten Ressourcen tatsächlich nutzen. Innerhalb eines virtuellen Netzes wird dieser Adressraum in Subnetze unterteilt, die häufig zusätzlichen Zwecken dienen (z. B. Trennung nach Availability Zone für Redundanz, siehe [KB-0441](01-cloud-regionen-und-availability-zones.md), oder Trennung nach Sicherheitszone). Wenn zwei virtuelle Netze miteinander kommunizieren müssen, wird ein expliziter Transitpfad konfiguriert (z. B. Peering für eine direkte Verbindung zwischen zwei Netzen, oder ein Transit Gateway für eine zentrale Verbindung mehrerer Netze) — dieser Transitpfad durchbricht die standardmäßige Isolation bewusst und muss daher sorgfältig auf den tatsächlich beabsichtigten Kommunikationsbedarf begrenzt werden, statt eine umfassendere Konnektivität als nötig herzustellen. Der zentrale methodische Punkt ist, dass die Adressplanung (die Wahl der IP-Adressräume für jedes virtuelle Netz) von Beginn an so gestaltet werden muss, dass sie eine spätere Verbindung zwischen Netzen nicht durch überlappende Adressräume verhindert — eine nachträgliche Behebung überlappender Adressräume ist in der Regel deutlich aufwendiger als eine vorausschauende, koordinierte Adressplanung.

~~~text
Virtual cloud network (VPC/VNet): logical address space, ISOLATED from other virtual networks BY DEFAULT
  isolation enforced by provider's SOFTWARE-DEFINED networking layer
  (unlike physical VRF isolation, see KB-0079, which uses dedicated/logically separated physical components)
Subnets within a virtual network: further division (e.g. per-AZ for redundancy, per security zone)
Transit paths (peering, transit gateway): EXPLICIT config needed for cross-network communication
  -> DELIBERATELY breaks default isolation -> must be scoped to ACTUAL intended communication need
KEY METHODOLOGICAL POINT: address planning must be coordinated from the START
  overlapping address ranges between networks that will later need to connect
  -> retrofit is significantly harder than proactive, coordinated planning
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Virtuelles Netz | logisch isolierter Adressraum, softwaredefiniert | Isolation ist Standard, muss explizit durchbrochen werden |
| Subnetz | Unterteilung innerhalb eines virtuellen Netzes | dient häufig der AZ- oder Sicherheitszonentrennung |
| Transitpfad (Peering/Transit Gateway) | ermöglicht Kommunikation zwischen virtuellen Netzen | durchbricht Isolation bewusst, muss auf tatsächlichen Bedarf begrenzt sein |
| Adressplanung | Zuweisung von IP-Adressräumen zu Netzen | überlappende Adressräume erschweren spätere Vernetzung erheblich |

Implementierung: Vor der Einrichtung neuer virtueller Netze wird eine zentrale, koordinierte Adressplanung durchgeführt, die verhindert, dass Netze, die möglicherweise später verbunden werden müssen, überlappende Adressräume erhalten. Subnetze werden entsprechend eines klaren Kriteriums (Availability-Zone-Trennung für Redundanz, Sicherheitszonentrennung für Isolationsanforderungen) strukturiert, statt ohne erkennbares Muster angelegt zu werden. Transitpfade zwischen virtuellen Netzen werden nur für den tatsächlich benötigten Kommunikationsbedarf konfiguriert, mit möglichst granularer Einschränkung (z. B. nur bestimmte Subnetze statt des gesamten virtuellen Netzes), statt eine pauschal umfassende Konnektivität herzustellen.

## Scalability, Reliability, Security und Observability

Cloud-Netzwerkmodelle skalieren die Anzahl unabhängig betreibbarer, isolierter Umgebungen proportional zur Sorgfalt der zugrunde liegenden Adressplanung; die Reliability-Grenze liegt darin, dass eine unkoordinierte Adressplanung proportional zur Anzahl später benötigter Netzwerkverbindungen zu aufwendigen, riskanten Nacharbeiten (Re-Adressierung) führt, wenn überlappende Adressräume eine direkte Verbindung verhindern.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| zwei virtuelle Netze können nicht wie geplant verbunden werden | die Adressräume der beiden Netze überlappen sich | die Adressplanung beider Netze prüfen und gegebenenfalls eine Re-Adressierung oder Netzwerk-Adressübersetzung einplanen |
| ein Ressourcenbereich ist unerwartet über einen Transitpfad erreichbar, der nicht beabsichtigt war | der Transitpfad wurde zu umfassend konfiguriert, statt auf den tatsächlichen Kommunikationsbedarf begrenzt zu sein | die Transitpfad-Konfiguration auf die tatsächlich benötigten Subnetze und Ports einschränken |
| Egress-Kosten (ausgehender Datenverkehr) sind höher als erwartet | Datenverkehr wird über einen ineffizienten Transitpfad oder unnötig zwischen Regionen geleitet | den tatsächlichen Datenverkehrspfad prüfen und die Netzwerktopologie auf unnötige Umwege untersuchen |

Security: Transitpfade zwischen virtuellen Netzen sollten mit derselben Sorgfalt wie physische Netzwerkverbindungen abgesichert werden (Zugriffskontrolllisten, NetworkPolicy-ähnliche Mechanismen), da eine zu umfassende Konnektivität die Angriffsfläche zwischen andernfalls isolierten Umgebungen erhöht. Observability: Die tatsächliche Datenverkehrsverteilung zwischen virtuellen Netzen, Egress-Kosten und -Muster, und die Konfiguration aktiver Transitpfade sind zentrale Metriken zur Bewertung der Netzwerkarchitektur.

## Trade-offs und Entscheidungen

**Staff** plant Adressräume koordiniert und konfiguriert Transitpfade auf den tatsächlichen Kommunikationsbedarf begrenzt. **Principal** macht die Netzwerktopologie und Isolationsentscheidungen für das Team nachvollziehbar. **Chief** legt Netzwerkarchitekturrichtlinien für Cloud-Umgebungen im Unternehmen anhand nachvollziehbarer Isolations- und Adressplanungsprinzipien fest.

Anti-Patterns: virtuelle Netze ohne koordinierte, zentrale Adressplanung einrichten und dadurch spätere Vernetzung durch überlappende Adressräume erschweren; Transitpfade pauschal umfassend statt auf den tatsächlichen Kommunikationsbedarf begrenzt konfigurieren; Subnetze ohne erkennbares, dokumentiertes Strukturierungskriterium anlegen.

## Production Checklist

- [ ] Eine zentrale, koordinierte Adressplanung verhindert überlappende Adressräume zwischen potenziell zu verbindenden Netzen.
- [ ] Subnetze sind nach einem klaren, dokumentierten Kriterium strukturiert.
- [ ] Transitpfade sind auf den tatsächlich benötigten Kommunikationsbedarf begrenzt konfiguriert.
- [ ] Datenverkehrsverteilung und Egress-Kosten werden überwacht.

## Interviewfragen

### 1. Worin unterscheidet sich die Isolation eines virtuellen Cloud-Netzes von physischer VRF-Isolation?

**Antwort:** Die Isolation eines virtuellen Cloud-Netzes wird vollständig durch die softwaredefinierte Netzwerkschicht des Cloud-Anbieters durchgesetzt, während VRF-Isolation auf dedizierten oder logisch getrennten physischen Netzwerkkomponenten basiert.

### 2. Was ist ein Transitpfad, und welches Risiko ist damit verbunden?

**Antwort:** Ein Transitpfad (z. B. Peering oder Transit Gateway) ermöglicht explizite Kommunikation zwischen ansonsten isolierten virtuellen Netzen; das Risiko besteht darin, dass eine zu umfassend konfigurierte Verbindung die standardmäßige Isolation unnötig weit durchbricht.

### 3. Warum ist koordinierte Adressplanung von Beginn an wichtig?

**Antwort:** Weil überlappende Adressräume zwischen Netzen, die später verbunden werden sollen, eine direkte Vernetzung verhindern und eine nachträgliche Behebung (Re-Adressierung) deutlich aufwendiger ist als vorausschauende Planung.

### 4. Wofür werden Subnetze innerhalb eines virtuellen Netzes typischerweise genutzt?

**Antwort:** Häufig zur Trennung nach Availability Zone für Redundanz oder zur Trennung nach Sicherheitszonen, entsprechend einem klaren, dokumentierten Strukturierungskriterium.

### 5. Wie gehst du vor, wenn zwei virtuelle Netze nicht wie geplant verbunden werden können?

**Antwort:** Ich prüfe, ob sich die Adressräume der beiden Netze überlappen, da dies eine häufige Ursache für gescheiterte Vernetzungsversuche ist, und plane gegebenenfalls eine Re-Adressierung oder Netzwerk-Adressübersetzung.

### 6. Widersprüchliche Anforderung: Team will schnelle, unkomplizierte Konnektivität zwischen allen Umgebungen UND strikte Netzwerkisolation zwischen Produktions- und Testumgebungen — wie gehst du vor?

**Antwort:** Ich würde Transitpfade gezielt nur zwischen den tatsächlich kommunikationsbedürftigen Umgebungen konfigurieren und Produktions- sowie Testumgebungen explizit ohne direkten Transitpfad isoliert lassen, statt eine pauschale, umfassende Konnektivität für alle Umgebungen herzustellen.

## Praktische Labs

~~~python
# Conceptual address-range overlap detection (not executed against a real cloud account):

import ipaddress

def check_overlap(network_a_cidr, network_b_cidr):
    net_a = ipaddress.ip_network(network_a_cidr)
    net_b = ipaddress.ip_network(network_b_cidr)
    return net_a.overlaps(net_b)

networks = {
    "prod_vpc": "10.0.0.0/16",
    "staging_vpc": "10.0.0.0/16",  # overlaps with prod_vpc -> cannot be directly peered
    "dev_vpc": "10.1.0.0/16",
}

for name_a, cidr_a in networks.items():
    for name_b, cidr_b in networks.items():
        if name_a < name_b and check_overlap(cidr_a, cidr_b):
            print(f"OVERLAP DETECTED: {name_a} ({cidr_a}) and {name_b} ({cidr_b}) cannot be directly peered")
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [Amazon VPC — What is Amazon VPC?](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html), abgerufen 2026-09-18.
2. Google Cloud-Dokumentation: [Virtual Private Cloud (VPC) network overview](https://cloud.google.com/vpc/docs/vpc), abgerufen 2026-09-18.

VRF und Routing-Isolation sind kanonisch in [KB-0079](../02-netzwerke/12-vrf-und-routing-isolation.md) behandelt; Shared Responsibility in [KB-0442](02-shared-responsibility.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, zentrale Adressraum-Verwaltungswerkzeuge (IPAM) für Cloud-Umgebungen mit Konflikterkennung vor der Netzwerkerstellung | Adopting | Gegenüber manueller Adressplanung bevorzugen, sobald die Integration mit der eigenen Cloud-Infrastruktur geprüft ist. |

Ein Team akzeptiert eine neue virtuelle Netzwerktopologie erst, wenn die Adressplanung nachweislich konfliktfrei mit potenziell später zu verbindenden Netzen ist und alle Transitpfade auf den tatsächlichen Kommunikationsbedarf begrenzt konfiguriert sind.
