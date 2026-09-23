---
{"id": "KB-0484", "title": "Azure VNets und Private Link", "domain": "20", "sequence": 4, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI", "ENTERPRISE"], "requires": [{"id": "KB-0443", "concepts": ["Cloud-Netzwerkmodelle"], "needed_for": "understanding"}, {"id": "KB-0465", "concepts": ["Amazon VPC und Endpunkte"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein VNet mit Subnetzen und einem Private Endpoint für einen Azure-Dienst anhand offizieller Dokumentation strukturieren können und erklären, wie sich Private Link von einem VNet-Peering unterscheidet.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Netzwerkarchitektur für integrierte Azure-Workloads gestalten, die private Endpunkte für sensible Dienste einsetzt und explizit klärt, wann VNet-Peering gegenüber Private Link angemessen ist.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete, weiterhin über das öffentliche Internet laufende Verbindung zu einem Azure-Dienst auf eine fehlende Private-Endpoint-Konfiguration und ausbleibende DNS-Umleitung zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Netzwerkisolationsrichtlinien für Azure-Workloads im Unternehmen anhand konsequenter Private-Link-Nutzung für sensible Dienste statt anhand standardmäßig öffentlicher Endpunktkonfiguration festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der Azure-Private-Link-Infrastruktur im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Subnetzen, Peering, privaten Endpunkten und DNS-Integration als Entscheidungsgrundlage, nicht die Private-Link-Infrastruktur-Interna."}}, "lab_validation": [{"lab_id": "KB-0484-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Azure-VNet- und Private-Link-Dokumentation, kein aktives Azure-Konto verwendet", "evidence": "Anhand offizieller Microsoft-Dokumentation wird nachvollzogen, wie Azure VNets Subnetze und Peering-Verbindungen strukturieren, wie Private Link einen privaten Endpunkt innerhalb eines VNet für einen Azure-Dienst (z. B. Storage, Datenbank) bereitstellt, der den öffentlichen Internetpfad vollständig umgeht, und warum eine korrekte DNS-Konfiguration notwendig ist, damit Anwendungen den Dienstnamen tatsächlich auf die private, nicht die öffentliche Adresse auflösen.", "limitations": "Kein aktives Azure-Konto verwendet, keine reale VNet- oder Private-Link-Konfiguration erstellt."}]}
---
# Azure VNets und Private Link

> **Ziel:** Azure VNets (Virtual Networks, siehe Cloud-Netzwerkmodelle, [KB-0443](../18-cloud-foundations/03-cloud-netzwerkmodelle.md)) strukturieren Subnetze innerhalb eines isolierten, logischen Netzwerks, das über VNet-Peering mit anderen VNets verbunden werden kann — konzeptionell vergleichbar mit Amazon VPC (siehe [KB-0465](../19-aws/03-amazon-vpc-und-endpunkte.md)). Private Link stellt einen privaten Endpunkt innerhalb eines VNet für einen Azure-Dienst (z. B. Storage, eine verwaltete Datenbank) bereit, der den Zugriff auf diesen Dienst vollständig über das private Netzwerk ermöglicht, ohne dass der Datenverkehr über das öffentliche Internet läuft. Der zentrale Punkt dieses Kapitels ist, dass ein eingerichteter privater Endpunkt allein nicht ausreicht, um den öffentlichen Zugriffspfad tatsächlich zu vermeiden — ohne eine korrekte, begleitende DNS-Konfiguration (die den Dienstnamen auf die private statt die öffentliche Adresse auflöst) setzen Anwendungen ihre Kommunikation weiterhin über den öffentlichen Pfad fort, selbst wenn ein privater Endpunkt technisch existiert, was eine häufige, leicht übersehene Fehlkonfiguration darstellt.

## Zweck, Mental Model und Dependencies

Ein VNet definiert einen isolierten, logischen Adressraum, der in Subnetze unterteilt wird, wobei VNet-Peering eine direkte, private Verbindung zwischen zwei VNets herstellt, sodass Ressourcen in beiden VNets miteinander kommunizieren können, ähnlich der allgemeinen Cloud-Netzwerktopologie-Logik. Private Link geht einen Schritt weiter als reines VNet-Peering, indem es speziell für den Zugriff auf Azure-Plattformdienste (nicht für die Verbindung zwischen eigenen VNets) konzipiert ist — ein Private Endpoint wird innerhalb eines VNet erstellt und erhält eine private IP-Adresse aus dem VNet-Adressraum, die auf den jeweiligen Azure-Dienst verweist, wodurch der Dienst effektiv "in" das private Netzwerk projiziert wird, ohne dass der zugrunde liegende Dienst selbst im VNet läuft. Der entscheidende, oft übersehene Aspekt ist, dass Azure-Dienste standardmäßig über öffentlich auflösbare DNS-Namen erreichbar sind (z. B. ein Storage-Account-Name unter einer öffentlichen Domain) — die Einrichtung eines Private Endpoint allein ändert diese DNS-Auflösung nicht automatisch. Ohne eine zusätzliche, korrekt konfigurierte private DNS-Zone (die denselben Dienstnamen auf die private IP-Adresse des Private Endpoint statt auf die öffentliche Adresse auflöst) lösen Anwendungen den Dienstnamen weiterhin öffentlich auf und kommunizieren daher weiterhin über den öffentlichen Internetpfad, selbst wenn ein technisch funktionierender privater Endpunkt existiert — der private Endpunkt bleibt in diesem Fall ungenutzt, ohne dass dies durch eine offensichtliche Fehlermeldung sichtbar würde, da die Verbindung über den öffentlichen Pfad weiterhin erfolgreich funktioniert, nur eben nicht über den beabsichtigten, privaten Pfad. Der zentrale methodische Punkt ist daher, dass die tatsächliche Nutzung eines privaten Endpunkts explizit verifiziert werden muss (z. B. durch Prüfung der tatsächlich aufgelösten IP-Adresse), statt allein aus der Existenz des Private Endpoint auf dessen tatsächliche Nutzung zu schließen.

~~~text
VNet: isolated logical network, subnets, VNet Peering for direct private connectivity between VNets
Private Link: goes FURTHER than peering -- specifically for accessing AZURE PLATFORM SERVICES
  Private Endpoint: created WITHIN a VNet, gets a PRIVATE IP from the VNet's address space
    -> effectively "projects" the service INTO the private network
Azure services are PUBLICLY resolvable by DNS name BY DEFAULT
  -> creating a Private Endpoint does NOT automatically change this DNS resolution
  -> WITHOUT an accompanying, correctly-configured PRIVATE DNS ZONE
     (resolving the SAME service name to the private endpoint's IP instead of the public address)
     apps STILL resolve the service name PUBLICLY -> traffic STILL flows over the public internet path
  -> private endpoint sits UNUSED, no obvious error (public path still works successfully)
KEY METHODOLOGICAL POINT: actual private-endpoint USE must be EXPLICITLY verified
  (e.g. check the ACTUALLY resolved IP address)
  -> never infer actual usage merely from the private endpoint's EXISTENCE
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| VNet und Subnetz | isoliertes, logisches Netzwerk | Grundlage für Azure-Netzwerktopologie |
| VNet-Peering | direkte private Verbindung zwischen VNets | für Verbindung zwischen eigenen VNets, nicht für Plattformdienst-Zugriff |
| Private Endpoint | private IP-Projektion eines Azure-Dienstes ins VNet | Existenz allein garantiert keine tatsächliche Nutzung |
| Private DNS-Zone | löst Dienstname auf private statt öffentliche Adresse auf | zwingend notwendig, damit der private Endpunkt tatsächlich genutzt wird |

Implementierung: Für jeden Azure-Dienst, der über einen Private Endpoint privat erreichbar gemacht werden soll, wird zusätzlich zur Endpoint-Erstellung explizit eine passende private DNS-Zone eingerichtet, die den Dienstnamen auf die private IP-Adresse auflöst, statt sich auf die alleinige Existenz des Private Endpoint zu verlassen. Nach der Einrichtung wird die tatsächliche DNS-Auflösung des Dienstnamens von einer repräsentativen Anwendungsinstanz aus explizit geprüft, um zu verifizieren, dass tatsächlich die private, nicht die öffentliche Adresse aufgelöst wird. VNet-Peering wird gezielt für die Verbindung zwischen eigenen VNets eingesetzt, während Private Link spezifisch für den Zugriff auf Azure-Plattformdienste genutzt wird, statt beide Mechanismen zu vermischen.

## Scalability, Reliability, Security und Observability

Azure Private Link skaliert die tatsächliche Netzwerkisolation für Plattformdienst-Zugriffe proportional zur Vollständigkeit der begleitenden privaten DNS-Konfiguration; die Reliability-Grenze liegt darin, dass ein Private Endpoint ohne korrekte DNS-Auflösung proportional zur Anzahl betroffener Dienste ungenutzt bleibt, ohne dass dies durch eine offensichtliche Fehlermeldung sichtbar wird, da die Kommunikation über den öffentlichen Pfad weiterhin funktioniert.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Dienst mit eingerichtetem Private Endpoint kommuniziert weiterhin scheinbar über das öffentliche Internet | die begleitende private DNS-Zone fehlt oder ist fehlerhaft konfiguriert, wodurch der Dienstname weiterhin öffentlich aufgelöst wird | die tatsächlich aufgelöste IP-Adresse des Dienstnamens von einer Anwendungsinstanz aus prüfen |
| zwei VNets können trotz eingerichtetem Peering nicht miteinander kommunizieren | die Peering-Konfiguration ist unvollständig (z. B. nur auf einer Seite konfiguriert) oder es bestehen überlappende Adressräume | die Peering-Konfiguration auf beiden Seiten und die Adressraumkompatibilität prüfen |
| ein Sicherheitsaudit stellt fest, dass ein sensibler Dienst trotz "privater" Konfiguration öffentlich erreichbar ist | der öffentliche Zugriffspfad wurde nicht explizit deaktiviert, sondern nur ein zusätzlicher privater Pfad eingerichtet | prüfen, ob der öffentliche Netzwerkzugriff für diesen Dienst explizit deaktiviert werden kann und sollte |

Security: Für sensible Azure-Dienste sollte nicht nur ein Private Endpoint eingerichtet, sondern zusätzlich der öffentliche Netzwerkzugriff explizit deaktiviert werden, da ein Private Endpoint allein den öffentlichen Zugriffspfad nicht automatisch abschaltet. Observability: Die tatsächliche DNS-Auflösung kritischer Dienstnamen, die Nutzung von Private-Endpoint-Verbindungen gegenüber öffentlichem Zugriff, und der Status des öffentlichen Netzwerkzugriffs jedes sensiblen Dienstes sind zentrale Kontrollpunkte.

## Trade-offs und Entscheidungen

**Staff** richtet für jeden Private Endpoint explizit eine passende private DNS-Zone ein und verifiziert die tatsächliche DNS-Auflösung. **Principal** macht den Unterschied zwischen VNet-Peering und Private Link für das Team nachvollziehbar. **Chief** legt Netzwerkisolationsrichtlinien für Azure-Workloads im Unternehmen anhand konsequenter Private-Link-Nutzung fest.

Anti-Patterns: einen Private Endpoint ohne begleitende, korrekt konfigurierte private DNS-Zone einrichten und dadurch dessen tatsächliche Nutzung verfehlen; annehmen, dass ein Private Endpoint automatisch den öffentlichen Zugriffspfad eines Dienstes deaktiviert; VNet-Peering und Private Link ohne klare Unterscheidung ihrer jeweiligen Einsatzzwecke vermischen.

## Production Checklist

- [ ] Jeder Private Endpoint ist von einer passenden, korrekt konfigurierten privaten DNS-Zone begleitet.
- [ ] Die tatsächliche DNS-Auflösung kritischer Dienstnamen wurde explizit verifiziert.
- [ ] Der öffentliche Netzwerkzugriff sensibler Dienste ist explizit deaktiviert, nicht nur um einen privaten Pfad ergänzt.
- [ ] VNet-Peering-Konfigurationen sind auf beiden Seiten vollständig und ohne überlappende Adressräume eingerichtet.

## Interviewfragen

### 1. Was ist der Unterschied zwischen VNet-Peering und Private Link?

**Antwort:** VNet-Peering verbindet zwei eigene VNets direkt und privat miteinander; Private Link projiziert einen Azure-Plattformdienst über einen privaten Endpunkt in ein VNet, um dessen Zugriff privat zu ermöglichen.

### 2. Warum reicht die Einrichtung eines Private Endpoint allein nicht aus, um privaten Zugriff sicherzustellen?

**Antwort:** Weil Azure-Dienste standardmäßig öffentlich auflösbar sind; ohne eine begleitende, korrekt konfigurierte private DNS-Zone lösen Anwendungen den Dienstnamen weiterhin öffentlich auf und nutzen den privaten Endpunkt nicht.

### 3. Warum ist eine fehlende private DNS-Konfiguration eine schwer zu erkennende Fehlkonfiguration?

**Antwort:** Weil die Kommunikation über den öffentlichen Pfad weiterhin erfolgreich funktioniert, wodurch keine offensichtliche Fehlermeldung entsteht, obwohl der private Endpunkt ungenutzt bleibt.

### 4. Wie verifizierst du, ob ein Private Endpoint tatsächlich genutzt wird?

**Antwort:** Ich prüfe explizit die tatsächlich aufgelöste IP-Adresse des Dienstnamens von einer Anwendungsinstanz aus, statt allein aus der Existenz des Private Endpoint auf dessen Nutzung zu schließen.

### 5. Wie gehst du vor, wenn ein Dienst mit eingerichtetem Private Endpoint weiterhin scheinbar über das öffentliche Internet kommuniziert?

**Antwort:** Ich prüfe, ob die begleitende private DNS-Zone fehlt oder fehlerhaft konfiguriert ist, wodurch der Dienstname weiterhin öffentlich statt privat aufgelöst wird.

### 6. Widersprüchliche Anforderung: Team will maximale Netzwerkisolation für einen sensiblen Dienst UND weiterhin öffentlichen Zugriff für externe Partner beibehalten — wie gehst du vor?

**Antwort:** Ich würde prüfen, ob eine gezielte, eingeschränkte Kombination (Private Endpoint für interne Anwendungen, ein separater, eng kontrollierter öffentlicher Zugriffspfad nur für explizit autorisierte externe Partner) beide Anforderungen erfüllen kann, statt den öffentlichen Zugriff pauschal für alle offen zu lassen.

## Praktische Labs

~~~python
# Conceptual private endpoint DNS resolution verification (not executed against a real Azure tenant):

def verify_private_endpoint_usage(resolved_ip, private_endpoint_ip, public_service_ip):
    if resolved_ip == private_endpoint_ip:
        return {"status": "correctly using private endpoint"}
    if resolved_ip == public_service_ip:
        return {"status": "MISCONFIGURATION: still resolving to public address, private endpoint UNUSED"}
    return {"status": "unknown resolution, investigate further"}

result = verify_private_endpoint_usage(
    resolved_ip="20.150.10.5",  # public IP
    private_endpoint_ip="10.0.1.4",
    public_service_ip="20.150.10.5",
)
print(result)
~~~

## Dependencies, Cross-References und Quellen

1. Microsoft-Dokumentation: [Azure Private Link — Overview](https://learn.microsoft.com/en-us/azure/private-link/private-link-overview), abgerufen 2026-09-18.
2. Microsoft-Dokumentation: [Azure Private Endpoint DNS Configuration](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns), abgerufen 2026-09-18.

Cloud-Netzwerkmodelle sind kanonisch in [KB-0443](../18-cloud-foundations/03-cloud-netzwerkmodelle.md) behandelt; Amazon VPC und Endpunkte in [KB-0465](../19-aws/03-amazon-vpc-und-endpunkte.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Private-Endpoint-DNS-Integrationswerkzeuge, die private DNS-Zonen automatisch bei Endpoint-Erstellung korrekt verknüpfen | Adopting | Gegenüber manueller DNS-Zonen-Konfiguration bevorzugen, sobald die tatsächliche Zuverlässigkeit der Automatisierung verifiziert ist. |

Ein Team akzeptiert eine Private-Link-Konfiguration erst, wenn die tatsächliche DNS-Auflösung des betroffenen Dienstnamens nachweislich auf die private, nicht die öffentliche Adresse verweist.
