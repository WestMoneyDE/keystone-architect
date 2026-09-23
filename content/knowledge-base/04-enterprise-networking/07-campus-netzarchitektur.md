---
{"id": "KB-0083", "title": "Campus-Netzarchitektur", "domain": "04", "sequence": 7, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["ENTERPRISE", "CLOUD", "PLATFORM", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0061", "concepts": ["VLAN", "Segmentierung"], "needed_for": "both"}, {"id": "KB-0064", "concepts": ["FIB", "Routing", "Next Hop"], "needed_for": "both"}, {"id": "KB-0066", "concepts": ["ACL", "Filter"], "needed_for": "both"}, {"id": "KB-0075", "concepts": ["Anfragepfad", "Messpunkte"], "needed_for": "both"}, {"id": "KB-0082", "concepts": ["Redundanz", "Failure Domains", "Konvergenz"], "needed_for": "understanding"}], "related": ["KB-0084", "KB-0085", "KB-0562", "KB-0720"], "applies": ["KB-0084", "KB-0085", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine lokale, fiktive Standort- und Failure-Domain-Matrix mit Access-, Distribution- und Core-Übergaben ausarbeiten.", "rationale": "Sie übt Architekturentscheidungen ohne Switches, WLAN, Clients oder Gebäudenetz zu bedienen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Schichten, Segmente, WLAN, Identity, Gebäude-/Core-Redundanz, Routing, Security, Observability, Kapazität und Betriebsübergaben als Servicevertrag entwerfen.", "rationale": "Campusbetrieb verbindet physische und logische Grenzen."}, "STAFF-TARGET": {"active": true, "scope": "Teams prüfen Endpunkt-Onboarding, VLAN/VRF/ACL, WLAN-Roaming, Access-Uplink, Distribution/Core, Provideredge und Incidentdaten end-to-end.", "rationale": "Fehler treten zwischen Endpoint, Network, Identity und Building Operations auf."}, "CHIEF-TARGET": {"active": true, "scope": "Standortstrategie, Resilienzbudget, Build-vs-Managed, Security-/Identitystandard, Lieferanten, Lifecycle, Compliance und Betriebsorganisation steuern.", "rationale": "Ein Campus ist ein langfristiger Unternehmensservice mit physischem Risiko."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "802.1X/EAP/RADIUS, Wi-Fi 6E/7, radio design, SD-Access, SASE, NAC, PoE, fiber plant, industrial/OT segmentation und herstellerspezifische Campus Fabric sind Vertiefungen.", "rationale": "Kern ist die klare Isolation, Ausfallgrenze und Betriebsfähigkeit."}}, "lab_validation": [{"lab_id": "KB-0083-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Lokales fiktives Tabellenmodell ohne Netzwerkzugriff", "evidence": "Eine Endpointklasse wird nur dem freigegebenen Segment und den erlaubten Services zugeordnet; ein Gebäudefehler bleibt einer dokumentierten Failure Domain zugeordnet.", "limitations": "Nicht ausgeführt; keine Switches, WLAN-APs, Clients, Interfaces, RADIUS-/NAC-, Routing-, Gebäude-, Cloud-, Netzwerk- oder Produktionsressourcen."}]}
---
# Campus-Netzarchitektur

> **Ziel:** Eine Campusarchitektur verbindet Endgeräte, WLAN, Gebäude, Services und externe Übergaben über nachvollziehbare Access-, Distribution- und Core-Grenzen. Sie ist belastbar, wenn Segmentierung, Identity, Verkabelung, Strom, Routing, Redundanz, WLAN-Roaming, Failure Domains, Security, Observability und Betrieb als ein nachweisbarer Standortservice geplant werden.

## Zweck, Definition und Mental Model

Ein Campus ist ein Unternehmensstandort oder Verbund von Gebäuden mit vielen Endpunkttypen: Mitarbeitende, Gäste, Drucker, Konferenztechnik, IoT, Gebäudetechnik, Labore, OT-nahe Systeme, WLAN-APs und Uplinks zu Datacenter, Internet, WAN und Cloud. Die bekannte hierarchische Struktur legt Access, Distribution und Core als verschiedene Verantwortungs- und Failure-Grenzen an. Cisco beschreibt für große Campusmodelle diese drei Schichten; kleinere Standorte können Distribution und Core zusammenfassen. Das ist ein Designmuster, kein universell vorgeschriebenes Protokoll.

~~~text
Endpoint / AP / device
        |
      Access
  onboarding, PoE, edge security, VLAN
        |
  Distribution
 policy, L3 boundary, aggregation, service insertion
        |
       Core
 fast resilient transit between distribution blocks and edges
        |
 WAN / Internet / Datacenter / Cloud / shared services
~~~

| Schicht | Hauptaufgabe | Nicht ihre Aufgabe |
|---|---|---|
| Access | Endpunktanschluss, PoE, Edgeport, AP, erste Admission/Segmentzuordnung | campusweite Transit- oder globale Geschäftspolicy allein |
| Distribution | Aggregation, L3-/Policygrenze, Routing, Redundanz für Accessblöcke | unbegrenztes Hochskalieren ohne Core-/Failureplan |
| Core | einfacher, schneller, hochverfügbarer Transit zwischen Blöcken | komplexe endpointindividuelle Filterung auf jedem Paket |
| Campus Edge | Übergabe zu WAN/Internet/Datacenter/Cloud/Security | Vertrauen in externe Netze ohne Policy und Observability |
| Managementplane | Inventory, Identity, Konfiguration, Logging, Automation | Ersatz für tatsächlichen Data-Plane-Nachweis |

Das Mental Model ist eine Serie von Verträgen: **wer oder was verbindet sich, an welcher physischen Stelle, mit welcher Identity, welchem Segment, welchen erlaubten Diensten, welchem Weg, welcher Bandbreite, welcher Strom-/Gebäudefailure-Domain und welchem Supportowner?** Eine VLAN-Nummer oder SSID beantwortet diese Fragen nicht vollständig.

## Voraussetzungen und kanonische Grenzen

Vorher lesen: [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0061](../03-network-foundations/13-vlan-und-segmentierung.md), [KB-0064](../03-network-foundations/16-routingtabellen-und-weiterleitung.md), [KB-0066](../03-network-foundations/18-acls-und-filtering.md), [KB-0075](../03-network-foundations/27-netzwerkdiagnose-entlang-des-anfragepfads.md) und [KB-0082](06-ecmp-und-bfd.md).

- VLAN/802.1Q-Bridge-Grundlagen und Layer-2-Segmentierung sind in KB-0061 kanonisch. Campusdesign erklärt deren räumliche und organisatorische Anwendung.
- L3-Routing, VRF und ACL werden nicht durch das Schichtenmodell ersetzt. Der L3-Gateway-/Firewall-/Identity-Punkt ist eine bewusste Policyentscheidung.
- ECMP, BFD und Routingkonvergenz sind für redundante Distribution-/Core- oder Gebäudepfade relevant, aber nicht automatisch für jeden Accessport.
- WLAN, NAC, 802.1X/EAP/RADIUS, SASE und SD-Access sind optionale Implementierungsfamilien; der Artikel behauptet keine konkrete Provider- oder Herstellereignung.

## Core Concepts: physische, logische und organisatorische Grenzen

### Standort- und Failure-Domain-Modell

Die Architekturkarte enthält Gebäude, Etage/Schrank, Accessswitch/AP, Uplink, Distributionblock, Core, Stromkreis/USV, Glasfasertrasse, Provider-Meet-Me-Room, WLAN-Controller/Cloudservice, DHCP/DNS/Identity, Firewall, Management/OOB und Serviceowner. Zwei Uplinks sind nicht redundant, wenn sie dieselbe Fasertrasse, denselben Schrank, dieselbe Stromversorgung, denselben Stack, dieselben Konfigurationsdaten oder denselben Betreiberprozess teilen.

### Endpointklasse und Segmentvertrag

| Endpointklasse | Zulässige Zuordnung | Sicherheits- und Betriebsfrage |
|---|---|---|
| managed user device | identity-/posturebasiertes Mitarbeitersegment | wie wird Identität, Patchstatus, Lost Device und Offboarding behandelt? |
| guest/BYOD | isoliertes Guest-Segment, begrenzter Internetzugang | welche Captive-/Identity-/Privacy- und Abusepolicy gilt? |
| IoT/AV/Printer | explizites Geräteprofil und minimale Serviceallowlist | wie werden unbekannte, alte oder kompromittierte Geräte begrenzt? |
| building/OT | separater, risikobewerteter Kontext mit strengem Übergang | wie bleiben Safety, Wartung und Incident Response möglich? |
| network infrastructure | separates Management-/OOB-Kontext | wer hat privilegierten Zugriff, wie werden Secrets und Logs geschützt? |

NIST SP 800-207 unterstreicht, dass Netzstandort oder Besitz nicht automatisch Vertrauen begründen. Segmentierung bleibt nützlich, aber Accesspolicy muss Identity, Device, Datenklasse, Zweck und Sitzung ergänzen. Ein Campusnetz ist deshalb kein vertrauenswürdiger Innenraum.

## Architektur, Datenfluss und Implementierung

### Endpunktdatenfluss

~~~text
device connects
  -> physical port or SSID/BSSID
  -> link/PoE and endpoint admission
  -> identity/device posture/profile
  -> VLAN/role/VRF + DHCP/DNS/NTP
  -> gateway/ACL/firewall/service policy
  -> distribution/core/edge route
  -> target service and independently verified return path
~~~

Der Zugang kann einen managed Device, Gast, Drucker oder Sensor gleich aussehen lassen, muss sie jedoch eindeutig behandeln. DHCP-Lease, DNS-Namen, MAC, Switchport, AP, Funkband, Identity-/NAC-Ereignis, VLAN/VRF, IP, Policy, Zeit und Ticket-/Change-ID werden für eine datensparsame Diagnose korreliert. MAC allein ist keine belastbare Identität.

### Wired und Wireless als gemeinsamer Service

WLAN ist kein separater Internetanschluss im Gebäude. AP-Uplink, PoE-Budget, Accessswitch, RF-Design, SSID, Auth, VLAN/VRF, DHCP/DNS, Controller-/Cloud-Management, Gateway, Roaming und Zielservice bilden einen Pfad. Roaming, hohe Clientdichte, Konferenzlast, BYOD, Voice/Video, Captive Portal und IoT stellen unterschiedliche Kapazitäts- und Sicherheitsanforderungen. Die konkrete Wi-Fi-Version, Bandplanung, Regulatory Domain, Controllerfunktion und Clientkompatibilität müssen pro Standort aktuell geprüft werden.

### Implementierung als deklarativer Vertrag

| Phase | Zu entscheiden | Abnahmekriterium |
|---|---|---|
| Standortaufnahme | Gebäude, Räume, Schränke, Faser/Trassen, Strom, Klimatisierung, Zutritt, Provider | geprüfte Karten und eindeutige Failure-Domains |
| Serviceaufnahme | Endpointklassen, Datenklassen, SLO, Owner, lokale/remote Dienste | Segment- und Allowlistvertrag einschließlich Rückweg |
| Access | Port/AP-Profil, PoE, VLAN/Role, admission, err-disable/storm control | unbekannter/unerlaubter Endpoint erhält keine implizite Freigabe |
| Distribution/Core | L3-Gateway, VRF, ECMP, routing, ACL/firewall/service insertion | jeder erlaubte und verweigerte Pfad ist messbar |
| Wireless | RF-/AP-/uplink-/SSID-/identity-/roaming-Plan | Kapazität, Coverage und Auth-/roaming-Fehler testen |
| Operations | IPAM/Inventory/SoT, config backups, telemetry, alert, change/rollback | Soll-/Istzustand, Ownership und Rückbau nachgewiesen |

Ein Beispielintention, keine Switchkonfiguration:

~~~yaml
site: berlin-campus-a
endpoint_class: managed-user
access:
  admission: identity-and-device-policy
  segment: user-eu
  poe: not-required
services:
  allow: [dns, ntp, identity, approved-apps]
  deny: east-west-by-default
resilience:
  access_uplinks: independently-reviewed
  building_failure_domain: bldg-a-access-block-03
operations:
  owner: campus-network
  incident_route: endpoint-to-core-correlation
  rollback: restore-approved-profile
~~~

Vor Änderung müssen Plattformversion, Zugangsprotokoll, Interoperabilität von NAC/Identity/DHCP/DNS, Port-/PoE-/AP-/Clientgrenzen, Switch-Stack-Semantik, Routing/Failover, aktuelle Securityadvisories und Wartungsfenster gegen aktuelle Hersteller- und Vertragsunterlagen geprüft werden. Ein generisches Beispiel ersetzt keine geprüfte Konfiguration.

## Skalierbarkeit, Performance und Kapazität

Campuskapazität hat Access-, Uplink-, Distribution-, Core-, WLAN-, Dienste- und Betriebsdimensionen. Portzahl allein täuscht: Ein Tagungsraum, KI-/Engineeringlab, Videoevent, Firmwareverteilung oder kompromittierte IoT-Last kann Puffer, PoE, RF oder Uplink anders belasten als die durchschnittliche Auslastung.

| Dimension | Metrik | Fehlannahme |
|---|---|---|
| Wired access | active ports, errors, PoE draw, port speed, broadcast/storm | freie Ports bedeuten ausreichende Leistung |
| WLAN | clients/AP/radio, airtime, retry, RSSI/SNR, channel use, roam time | AP-Anzahl garantiert Capacity/Coverage |
| Uplinks/core | bytes/pps, queue/drop/ECN, ECMP distribution, N-1 headroom | Durchschnittslast reicht als Capacitymodell |
| Identity/services | RADIUS/NAC/DHCP/DNS auth latency/error, lease exhaustion | Switching ist unabhängig von Services |
| Resilience | detection/convergence/recovery/SLO per block | zwei Links sind ohne Failuremap redundant |
| Operations | config drift, ticket/MTTR, alert quality, inventory completeness | Controllerstatus ist tatsächlicher Data Plane Status |

Plane Capacity für Campusereignisse: morgendliche Anmeldung, AP-/Controller-Neustart, Stromwiederkehr, große Konferenz, Patch-/Imagingfenster, Gebäudeverlust, WAN-/Internetstörung, DHCP/DNS/Identity-Ausfall und Incident-Containment. Der N-1-Fall muss pro Datenklasse und kritischem Service bewertet werden; eine nichtkritische Guest-Last darf möglicherweise früher gedrosselt werden als Identity, Safety oder Businesskommunikation.

## Reliability und Failure Modes

| Symptom | Hypothesen | Gegenprobe |
|---|---|---|
| ganzer Bereich offline | Strom, Accessstack, distribution uplink, fiber/trasse, VLAN/VRF change | physische Failuremap, link/power, route/FIB, recent change, client sample |
| Wired aktiv, WLAN fällt aus | PoE, AP uplink, controller/cloud, RF, DHCP/DNS/auth | AP/PoE/port, RF, SSID/auth, DHCP/DNS, service path |
| nur eine Endpointklasse betroffen | role/VLAN/VRF/ACL/NAC/profile/lease | identity event, profile, segment, allow/deny and return path |
| Client verbindet, Dienste fehlen | DNS/DHCP/gateway/ACL/firewall/route/return | request path per KB-0075 messen |
| Roaming erzeugt Unterbruch | RF coverage, auth cache, controller, VLAN/role consistency | roam timeline plus access/identity/service correlation |
| Backup-Uplink hilft nicht | gemeinsame Faser/Strom/stack/config/provider failure | true shared dependency map and failure drill |
| Broadcast/IoT-Sturm | loop, faulty device, unknown endpoint, policy gap | pps/MAC/port, storm control, quarantine, incident process |

Reliability verlangt geeignete Degradation. Ein Guest WLAN kann bei Identityüberlast warten oder begrenzt werden; ein Gebäudesteuerungs- oder Sicherheitsservice braucht einen eigenen, risikogesteuerten Business-Continuity-Plan. Ein Gateway- oder Corewechsel darf nicht unkontrolliert Broadcast, Reauth oder Rehash über alle Gebäude auslösen.

## Security, Governance und Compliance

Campuszugang muss minimal privilegiert sein. VLAN/VRF trennt Verkehrsdomänen, ersetzt aber nicht Identity, Deviceposture, ACL/Firewall, Managementplane-Schutz, Logging oder Datenklassifikation. NIST SP 800-207 beschreibt Zero Trust als Paradigma ohne implizites Vertrauen allein aus Netzstandort oder Besitz. Daraus folgt kein bestimmtes NAC-Produkt, wohl aber die Pflicht, Zugriffsentscheidungen und Ausnahmen nachweisbar zu begrenzen.

| Kontrolle | Zweck | Nachweis |
|---|---|---|
| Identity-/Device-Admission | zugelassenen Endpoint und Kontext bestimmen | auth event, profile, failure/guest fallback |
| Segment-/Servicepolicy | East-West und North-South begrenzen | allow/deny test plus Rückweg |
| Management/OOB | Netzgeräte und Credentials schützen | RBAC, MFA, audit, backup, break-glass |
| Physical security | Schrank, Port, AP, Faser und Strom schützen | asset/location/access record |
| Guest-/BYOD-Policy | privilegierten Zugriff vermeiden | isolate, rate, retention, abuse response |
| Privacy | MAC/IP/Identity/Standortdaten begrenzen | purpose, retention, access, deletion |

Governance verbindet Standort, Gebäude, Schrank, Gerät, Port, AP, Netzsegment, Owner, Datenklasse, Lifecycle/EOL, Wartungsfenster, Vertrag und Incidentpflicht. Ein nicht dokumentierter Port oder eine ungeprüfte Ausnahmeregel ist ein Security- und Betriebsrisiko.

## Observability und Troubleshooting

Korrelieren statt nur einen Switchport prüfen:

~~~text
user/device -> room/port/AP -> power/link/RF
 -> admission/identity -> VLAN/VRF/IP/DNS/DHCP
 -> gateway/ACL/firewall -> distribution/core/edge
 -> target + return path -> service SLI/change/owner
~~~

Messe Accessport/PoE/Errors, AP-/RF-/roaming-/clientmetriken, DHCP/DNS/RADIUS/NAC, VLAN/VRF/FIB/ACL, uplink/core/queue/drop, core/edge availability, config drift, power/environment, Change-ID und Service-SLI. Übernehme keine vollständigen Client-/Standortprotokolle ohne Zweck, Zugriffskonzept und Retention.

## Kosten, Trade-offs und Anti-Patterns

| Entscheidung | Nutzen | Risiko/Kosten |
|---|---|---|
| collapsed core | weniger Geräte und Betrieb | größere gemeinsame Failure Domain |
| dreistufig | klare Skalierungs- und Isolationsgrenzen | mehr Hardware/Faser/Operations |
| identitybasiertes Onboarding | präzisere Zugriffsentscheidung | IAM/NAC-Abhängigkeit, Supportaufwand |
| L2-Ausdehnung | einfache lokale Adressierung | Loops, große Broadcast-/Failure-Domain |
| L3-Grenze näher am Access | kleinere Failure Domains | mehr Routing-/Designaufwand |
| managed WLAN/Cloudcontroller | zentrale Betriebsfunktionen | Vendor-/Internet-/Datengrenze |

Anti-Patterns: zwei Links ohne Trassen-/Strom-/Stack-Diversität als Redundanz ausgeben; Guest und Managed Endpoints gleich behandeln; WLAN nur über Coverage statt Airtime/Identity/Backhaul bewerten; VLAN als vollständige Security behaupten; DHCP/DNS/NAC als Nebendienste betrachten; Core mit endpointindividueller Policy überladen; fehlende Inventory-/Portownership durch Ad-hoc-Änderungen kompensieren.

## Staff-, Principal- und Chief-Level-Entscheidungen

**Staff:** Testet Endpoint-onboarding, allow/deny, DHCP/DNS, WLAN-roam, PoE/AP, Access-Uplink, Distribution/Core-/Edge-/Identity-Ausfall und Wiederherstellung als End-to-End-Kette.

**Principal:** Standardisiert Endpointklassen, Segment-/Namen/IPAM, Site-Blueprint, Failure-Domain-Map, Telemetrie, Change-/Canary-/Rollback und die Übergabe zwischen Facility, Security, Workplace und Network.

**Chief:** Entscheidet Standort- und Resilienzstandard, Managed-/Buildmodell, Lifecycle, Lieferanten, Security-/Identity-Strategie, regionales Risiko, Investition in Faser/Strom/Redundanz sowie krisenfähige Betriebsorganisation.

## Production Checklist

- [ ] Standort-, Gebäude-, Faser-, Strom-, Schrank-, Provider- und Failure-Domain-Karte ist geprüft.
- [ ] Endpointklasse, Identity, Segment, Serviceallowlist, Datenklasse, Owner und Rückweg sind freigegeben.
- [ ] Accessport/AP, PoE, WLAN/RF, DHCP/DNS/NAC sowie L3-/ACL-/Firewallpfad sind gemessen.
- [ ] Uplink-/Core-Redundanz, N-1-Capacity und korrelierte Fehler sind getestet.
- [ ] Management/OOB, RBAC, Audit, Backup, Inventory, Lifecycle und Break-glass sind geprüft.
- [ ] Telemetrie korreliert Endpoint, Attachment, Policy, Pfad, Change, Service-SLI und Owner.
- [ ] Degradation, Incidentkommunikation, Wartung und Rollback sind nachgewiesen.

## Interviewfragen

### 1. Wann wird ein Collapsed Core problematisch?

**Antwort:** Wenn Wachstum, Policy, Kapazität oder Failure-Diversität mehr benötigen als eine gemeinsame Distribution/Core-Grenze liefern kann. Die Entscheidung folgt den nachgewiesenen Standort- und SLO-Anforderungen.

### 2. Warum sind zwei Uplinks nicht automatisch redundant?

**Antwort:** Sie können Faser, Strom, Schrank, Stack, Konfiguration, Provider oder Betriebsprozess teilen. Redundanz verlangt unabhängige Failure Domains.

### 3. Was schützt ein VLAN?

**Antwort:** Es trennt Layer-2-Verkehrskontexte. Identity, Routing/VRF, ACL/Firewall, Managementplane und Workloadpolicy bleiben zusätzliche Kontrollen.

### 4. Wie diagnostizierst du „WLAN verbunden, Anwendung nicht erreichbar“?

**Antwort:** Ich prüfe RF/AP/PoE/Uplink, Identity/Role, VLAN/VRF, DHCP/DNS, Gateway/ACL/Route, Zielservice und Rückweg mit Zeit- und Changekontext.

### 5. Warum gehört DHCP/DNS zum Campus-SLO?

**Antwort:** Ohne Adresse, Resolver oder korrekten Namen funktionieren Endpoints trotz gesundem Link nicht. Diese Dienste sind zentrale Abhängigkeiten des Onboardings und Datenpfads.

### 6. Wie behandelt Zero Trust den Campusstandort?

**Antwort:** Standort allein verleiht kein Vertrauen. Zugriff wird zusätzlich anhand Identity, Device, Policy, Ressource und Sitzung bewertet.

## Praktische Labs

### KB-0083-LAB-01: Fiktive Endpoint-/Failure-Domain-Matrix

~~~python
endpoint = {"class": "guest", "segment": "guest-isolated", "services": {"dns", "internet"}}
policy = {"guest-isolated": {"dns", "internet"}}
assert endpoint["services"] <= policy[endpoint["segment"]]
failure = {"access-block": "building-a-closet-03", "uplinks": ["fiber-path-a", "fiber-path-b"]}
assert len(set(failure["uplinks"])) == 2
print("Model documents policy and candidate diversity; physical proof is still required.")
~~~

**Gegenprobe:** Setze den gleichen Faserpfad zweimal ein und markiere die angenommene Redundanz als unbewiesen. **Grenze/Cleanup:** Nur lokales Tabellenmodell; keine Geräte, Clients, WLAN-, Gebäude- oder Netzwerkressourcen.

## Dependencies, Cross-References und Quellen

1. [Cisco Campus LAN and WLAN Design Guide](https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/cisco-campus-lan-wlan-design-guide.html), abgerufen 2026-09-16. Hierarchisches Campusmodell als vendorgebundenes Designbeispiel.
2. [IEEE 802.1Q-2022](https://standards.ieee.org/ieee/802.1Q/10323/), abgerufen 2026-09-16. Bridges, VLANs und Managementkontext.
3. [NIST SP 800-207](https://csrc.nist.gov/pubs/sp/800/207/final), abgerufen 2026-09-16. Zero-Trust-Prinzip ohne implizites Standortvertrauen.
4. Weiterführung: [KB-0084](08-datacenter-netzarchitektur.md), [KB-0085](09-sdn-und-campus-fabric.md), [KB-0562](../23-security-identity/26-security-incident-response.md), [KB-0720](../30-architect-practice/44-portfolioevidenz-und-reifemodelle.md).

Zeitabhängige Aussagen zu WLAN, Switch-/Controller-OS, PoE, NAC, Campus Fabric, Hardwarelimits, Lizenzierung und Provideranbindung müssen vor einem Design gegen aktuelle Hersteller-, Standards-, Sicherheits- und Vertragsdokumentation verifiziert werden.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Wi-Fi 6E/7 | abhängig von Regulierung, Clients und Plattform | RF, Backhaul, PoE, Clientmix, Security und Lifecycle messen. |
| Campus Fabric/Intent Automation | adopting bis established je Anbieter | SoT, Drift, API-RBAC, Controllerausfall und Exit nachweisen. |
| Identity-/Device-based Access | established architecture pattern | Identityresilienz, Privacy, Ausnahme- und Recoverypfad testen. |

Ein Pilot akzeptiert eine Campus-Innovation erst, wenn Standort-/Strom-/Faser-/Access-/WLAN-/Identity-/Segment-/Routing-/Policy-/Core-/Edge-/Rückwegsemantik, Failure-Diversität, Service-SLO, Security/Privacy, Observability, Capacity/Cost, Owner, Change und Rollback nachgewiesen sind.
