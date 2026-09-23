---
{"id": "KB-0081", "title": "EVPN und VXLAN-Fabrics", "domain": "04", "sequence": 5, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["ENTERPRISE", "CLOUD", "PLATFORM", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0061", "concepts": ["VLAN", "Segmentierung"], "needed_for": "understanding"}, {"id": "KB-0064", "concepts": ["FIB", "Next Hop"], "needed_for": "both"}, {"id": "KB-0077", "concepts": ["Underlay", "Konvergenz"], "needed_for": "both"}, {"id": "KB-0078", "concepts": ["BGP-Policy", "Route Reflection"], "needed_for": "both"}, {"id": "KB-0079", "concepts": ["VRF", "Mandantentrennung"], "needed_for": "both"}, {"id": "KB-0080", "concepts": ["Overlay-/Transportgrenzen", "MTU"], "needed_for": "understanding"}], "related": ["KB-0082", "KB-0083", "KB-0084", "KB-0562", "KB-0720"], "applies": ["KB-0082", "KB-0084", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein lokales, fiktives VNI-, VTEP-, MAC/IP- und BUM-Entscheidungsmodell ohne Netzwerkzugriff ausführen und begrenzen.", "rationale": "Es trainiert Control-/Dataplane-Zuordnung ohne Switches, Tunnel oder Pakete."}, "ARCHITECT-TARGET": {"active": true, "scope": "Underlay, VTEPs, VNI, MAC-VRF/IP-VRF, EVPN-Control-Plane, IRB, Multihoming, MTU, Security, Telemetrie und Rollback als kohärenten Fabricvertrag entwerfen.", "rationale": "Ein Overlay funktioniert nur mit explizitem Underlay- und Servicevertrag."}, "STAFF-TARGET": {"active": true, "scope": "Teams testen BGP-EVPN, VTEP-Erreichbarkeit, VNI/VRF-Policy, MAC/IP-Route, BUM, Anycast Gateway, MTU und Ausfallpfade durchgängig.", "rationale": "Viele Fehler entstehen zwischen Control Plane, VTEP-Datenpfad und Tenantservice."}, "CHIEF-TARGET": {"active": true, "scope": "Datacenter-Standard, Lieferanten-/Betriebsmodell, Tenant- und Securitygovernance, Cloudanbindung, Automationsreife, Kosten und Exit steuern.", "rationale": "Fabricstandard und organisatorische Ownership sind langfristige Plattformentscheidungen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "EVPN Route Types und Extended Communities, ESI, ARP/ND suppression, multicast underlay, EVPN multihoming, DCI, GENEVE und ASIC-/TCAM-Pipelines sind Vertiefungen.", "rationale": "Kern ist ein nachweisbarer Overlay-/Underlay-/Tenant-Vertrag."}}, "lab_validation": [{"lab_id": "KB-0081-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Lokales, fiktives Python-Modell ohne Netzwerkzugriff", "evidence": "VNI, VTEP und MAC/IP-Eintrag werden getrennt geführt; unbekannter Broadcast-/Multicast-/Unknown-Unicast-Verkehr wird als explizite Replikationsentscheidung ausgewiesen.", "limitations": "Nicht ausgeführt; keine VTEPs, Switches, BGP-EVPN-Sessions, VXLAN-Kapselung, Pakete, Interfaces, VRFs, Cloud-, Netzwerk- oder Produktionsressourcen."}]}
---
# EVPN und VXLAN-Fabrics

> **Ziel:** EVPN/VXLAN verbindet eine BGP-basierte Ethernet-VPN-Control-Plane mit einer UDP-basierten Overlay-Datenebene. Eine Fabric ist erst belastbar, wenn Underlay, VTEPs, VNI/VRF, MAC/IP-Steuerung, BUM-Replikation, IRB, Multihoming, MTU, Sicherheit, Telemetrie und Rückbau gemeinsam nachgewiesen sind.

## Zweck, Definition und Mental Model

VXLAN kapselt Layer-2-Verkehr über ein Layer-3-IP-Netz. Ein VXLAN Tunnel Endpoint (VTEP) kapselt und entkapselt Frames mit einem VXLAN Network Identifier (VNI). RFC 7348 beschreibt VXLAN als Overlay-Rahmen für virtualisierte Layer-2-Netze über Layer 3; die Nutzlast wird über UDP getragen. EVPN liefert eine BGP-Control-Plane, mit der MAC-/IP-Erreichbarkeit, Multi-Homing und Tenant-/Servicekontext zwischen Network Virtualization Edges (NVEs) verteilt werden können. RFC 8365 verbindet EVPN mit IP-basierten NVO3-Overlays wie VXLAN.

~~~text
Tenant workload
  -> leaf/VTEP ingress
     classify: VLAN/port -> VNI -> MAC-VRF or IP-VRF
     EVPN lookup: MAC/IP -> remote VTEP
     encapsulate: outer IP/UDP/VXLAN(VNI) + inner frame
  -> IP underlay (ECMP)
  -> leaf/VTEP egress
     decapsulate -> tenant forwarding / IRB
~~~

Die Grundregel lautet: **Underlay liefert IP-Erreichbarkeit zwischen VTEPs; Overlay liefert tenantbezogene L2/L3-Semantik.** Ein gesundes Underlay beweist deshalb nicht, dass die richtige VNI, VRF, MAC/IP-Route oder Gatewaypolicy gewählt wird. Eine EVPN-Route beweist umgekehrt nicht, dass der VXLAN-Paketpfad MTU-, ECMP-, ACL- und Rückweganforderungen erfüllt.

| Begriff | Bedeutung | Nicht behauptet |
|---|---|---|
| Underlay | geroutetes IP-Transportnetz zwischen VTEPs | keine Mandanten-Semantik oder Datenklassengrenze |
| Overlay | logische Tenantnetz- und Serviceebene über dem Underlay | keine automatische Verschlüsselung |
| VTEP/NVE | Kapselungs-/Entkapselungsgrenze | keine vollständige Security Boundary |
| VNI | 24-Bit-Overlay-Segmentkennung in VXLAN | keine Identität, Berechtigung oder Audit-ID allein |
| MAC-VRF | L2-Forwarding-Kontext | kein Ersatz für IP-VRF oder Firewall |
| IP-VRF | L3-/Tenant-Routing-Kontext | keine Garantie gegen falsche Import-/Exportpolicy |
| EVPN | BGP-basierte Control Plane für Ethernet-/Overlay-Serviceinformationen | keine Datenebene und keine Kapselung |
| IRB | Integrated Routing and Bridging zwischen L2 und L3 | kein Ersatz für klaren Default-/Rückwegvertrag |
| BUM | Broadcast, Unknown Unicast, Multicast | keine tolerierbare Standardlast ohne Budget |

## Voraussetzungen und kanonische Grenzen

Dieses Kapitel setzt [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0061](../03-network-foundations/13-vlan-und-segmentierung.md), [KB-0064](../03-network-foundations/16-routingtabellen-und-weiterleitung.md), [KB-0077](01-ospf-und-interne-konvergenz.md), [KB-0078](02-bgp-policy-und-route-reflection.md), [KB-0079](03-vrf-und-routing-isolation.md) und [KB-0080](04-mpls-und-label-switching.md) voraus.

- VLAN- und Routinggrundlagen sind kanonisch in Domain 03. Eine VNI ist nicht einfach eine größere VLAN-ID; Zuordnung, Control Plane und L3-Servicekontext unterscheiden sich.
- Ein Clos-/ECMP-Underlay und dessen Konvergenz folgen den Routingartikeln. EVPN ersetzt keine IP-Adressierung, BFD-/ECMP- oder Failure-Domain-Planung.
- BGP-Policy, Route Reflectors und Next-Hop-Disziplin werden in KB-0078 vertieft. Hier werden sie auf EVPN-Serviceinformationen angewandt.
- VRF-Isolation und kontrollierte Shared Services bleiben in KB-0079 kanonisch. EVPN-VXLAN darf keine unbewiesene Tenant-Transitbrücke einführen.
- MPLS und VXLAN sind unterschiedliche Dataplane-Encapsulationsfamilien; EVPN kann in mehreren Unterlagen genutzt werden. Das Kapitel vergleicht keine Herstellerfeatures als universellen Standard.

## Architektur und Datenfluss

### Control Plane: EVPN über BGP

RFC 7432 beschreibt EVPN als BGP-MPLS-basierte Ethernet VPN. Seine Grundideen – MAC-VRF, Route Distinguisher, Route Target, MAC-/IP-Ankündigungen und Multihoming – werden durch RFC 8365 für NVO3-/IP-Tunnelkontexte wie VXLAN ergänzt. Konkrete EVPN Route Types, Extended Communities und Erweiterungen sind service- und implementationsabhängig; sie müssen gegen die aktuelle Spezifikation und Plattform überprüft werden.

Eine robust dokumentierte Control Plane enthält mindestens:

1. eindeutige VTEP-/BGP-Identitäten und Underlay-Erreichbarkeit;
2. BGP-Peering oder Route-Reflection mit AFI/SAFI- und Policy-Scope;
3. Tenantzuordnung: VLAN/Port oder Workload-Tag zu VNI, MAC-VRF und optional IP-VRF;
4. RD/RT- und Import-/Export-Policy mit Owner und Audit;
5. MAC-/IP-Advertisement, Mobility- und Duplicate-Detection-Policy;
6. Multihoming-/Ethernet-Segment- und Split-Horizon-Semantik, falls benötigt;
7. BUM-Verteilmethode sowie Mess-, Rate- und Failurebudget.

### Data Plane: VXLAN über UDP/IP

Ein VTEP setzt äußere Ethernet-/IP-/UDP-/VXLAN-Header vor den inneren Frame. Der VNI bestimmt das Overlaysegment. Das Underlay routet den äußeren IP-Paketkopf und kann ECMP nutzen; ein VTEP am Ziel entfernt die Kapselung. RFC 7348 weist darauf hin, dass VTEPs VXLAN-Pakete nicht fragmentieren sollen und dass das Underlay-MTU den Kapselungsmehrbedarf tragen muss. Darum sind MTU, PMTU, Fragmentverhalten und Host-/NIC-/Firewallgrenzen Produktionsanforderungen, keine spätere Optimierung.

### Service Plane: L2VNI, L3VNI und IRB

Ein L2VNI verbindet Bridging-Domänen; ein L3-VRF-/L3VNI-Konzept trägt geroutete Tenantkommunikation. Bei Distributed Anycast Gateway existiert dieselbe Gateway-IP/MAC auf mehreren VTEPs; ein Host nutzt lokal ein Gateway, während der Fabricpfad geroutete Kommunikation verteilt. Symmetric IRB und Asymmetric IRB sind Designmuster mit unterschiedlichen Skalierungs- und Policyfolgen. Welche Form eine Plattform tatsächlich implementiert, ist zeit- und herstellerspezifisch und vor Einsatz nachzuweisen.

## Konfiguration und Implementierung als Vertrag

Eine Fabrickonfiguration wird aus einem versionierten Intent und nicht aus kopierten CLI-Blöcken erzeugt. Namen, Route Targets, VNI-Bereiche, Prefixlisten, BGP-Timer, Anycast-Gateway, Replication Method, MTU, Routing-/Security-Policies und Rollback müssen als prüfbare Eingaben versioniert sein. Der Ablauf ist produktneutral:

| Phase | Entwurfsentscheidung | Nachweis vor Freigabe |
|---|---|---|
| Scope | Mandant, Anwendung, L2-/L3-Bedarf, Datenklasse, SLO, Owner | Servicekarte mit zugelassenen Endpunkten und Rückwegen |
| Underlay | Clos/ECMP, IP-Plan, Loopbacks, BGP/IGP, MTU, Failure Domains | VTEP-zu-VTEP-Erreichbarkeit plus Capacity bei Ausfall |
| Overlay | VNI, MAC-VRF/IP-VRF, RD/RT, Gateway, BUM, MAC/IP-Policy | beabsichtigter Import/Export und keine ungewollte Tenant-Sicht |
| Control Plane | EVPN peers/RR, AFI/SAFI, Filter, Auth, Limits, Telemetrie | erwartete Route-/MAC-/IP-/ES-Zustände und Driftalarm |
| Data Plane | VTEP Source, UDP policy, ECMP, MTU, ACL/QoS, replication | Packetbudget, Hash- und PMTU-Verhalten auf Testpfad |
| Operations | Source of truth, Change/Rollback, backup, incident route | Canary, Zustandsaufnahme, Owner und Rückbauzeit getestet |

Ein abstrahiertes Intentobjekt benennt Absicht, nicht produktfertige Syntax:

~~~yaml
tenant: research-eu
l2_segments:
  - vlan: 210
    vni: 10210
    mac_vrf: research-eu-l2
l3_context:
  vrf: research-eu
  l3_vni: 50021
  allowed_prefixes: ["10.210.0.0/16"]
gateway:
  model: anycast-distributed
control_plane:
  evpn_policy: import-export-explicit
bum:
  method: approved-per-fabric
underlay:
  vtep_reachability: required
  mtu_contract: documented-end-to-end
operations:
  owner: network-platform
  rollback: restore-last-known-good-intent
~~~

Das YAML konfiguriert nichts. Vor Umsetzung sind die konkrete NOS-/Controller-Version, Hardware-/TCAM-/Route-/MAC-Skalenwerte, Lizenz, Featureinteroperabilität, Platform Defaults und Herstellerdokumentation am tatsächlichen Stand zu prüfen. Ein Controller darf den Nachweis nicht ersetzen; er muss Desired/Actual State, Partial Failure, Credential Scope und Rollback sichtbar machen.

## BUM, Multihoming und Gateway-Entscheidungen

BUM belastet Overlay und Underlay anders als bekannter Unicast. Ingress Replication repliziert vom VTEP zu den bekannten Remote-VTEPs. Multicast im Underlay kann andere Skalierungs- und Betriebsannahmen haben. Keine Variante ist pauschal besser: Größe, Empfängerzahl, Workload, Failure Domain, Multicastkompetenz, Telemetrie, DCI-Grenze und SLO entscheiden.

| Design | Nutzen | Zu prüfender Preis |
|---|---|---|
| Ingress Replication | kein Multicast-Underlay zwingend | Replikation wächst mit Remote-VTEPs, Egress-/Headend-Last |
| Underlay Multicast | effizientere Gruppenverteilung möglich | Multicast-Control-/Datenplane und Betriebskomplexität |
| EVPN All-Active Multihoming | aktive Pfade und Redundanz am CE | ESI, DF-/Split-Horizon- und Hash-Semantik |
| Single-Active Multihoming | klarere aktive Rolle | Kapazität/Fast Convergence und Standby-Tests |
| Distributed Anycast Gateway | lokaler First Hop, weniger Hairpinning | gleiche Gatewayidentität, ARP/ND, Routing-/Security-Policy |
| Zentraler Gateway | einfache zentrale Durchsetzung | Latenz, Hairpinning, Skalierung, Failure Domain |

ARP/ND Suppression und MAC-/IP-Bindings können Broadcastlast reduzieren. Sie erzeugen zugleich Korrektheits- und Securityanforderungen: stale Daten, host mobility, spoofed Bindings, duplicate addresses und Observability müssen behandelt werden. Der Designgrundsatz bleibt: weniger Flooding ersetzt nicht die Beweisführung über aktuelle, autorisierte Erreichbarkeit.

## Skalierbarkeit, Performance und Kapazität

EVPN/VXLAN skaliert nur so weit wie die kleinste Grenze: Route Reflector, BGP RIB, MAC/IP-/ARP-/ND-Tabellen, VTEP-CPU, ASIC-/TCAM, VXLAN UDP Offload, ECMP-Entropie, Underlay-MTU, Headend Replication, Telemetriepipeline, Controller-API und Operationsmodell. Plane nicht nach Zahl der Racks allein.

| Kapazitätstreiber | Messbare Grenze | Gegenprobe |
|---|---|---|
| VTEPs und EVPN-Routen | BGP CPU/RAM, route churn, RR queue/lag | Massenmove-/Flap-Szenario im nichtproduktiven Test |
| MAC/IP/ARP/ND | MAC-/neighbor-/TCAM-Auslastung, suppression hit/miss | Datenmodell gegen Hardware- und Hostpopulation abgleichen |
| BUM | Replication fan-out, bytes/pps, queue/drop, multicast state | Worst-case unknown/broadcast und Ausfallpfad rechnen |
| Unicast | ECMP-Hash, link imbalance, flowlet/elephant flow | Per-flow/per-link Verteilung statt Mittelwert prüfen |
| MTU | PMTU errors, fragmentation/drop, host/vNIC limits | größtes erwartetes Paket über jeden Pfad validieren |
| Betrieb | Change rate, drift, alert volume, MTTR | fehlerhafte Intent-/Policyänderung per Canary rückrollen |

Die VXLAN-Kapselung beansprucht Zusatzbytes. Die genaue Größe hängt unter anderem von äußerem IPv4/IPv6, Ethernetoptionen und Plattform ab. Eine pauschale „Jumbo Frames sind schon da“-Aussage ist kein MTU-Nachweis. Dokumentiere Packetbudget von Workload NIC über ToR/Leaf, Spine, Firewall/Service Insertion, DCI und Remote VTEP einschließlich offloads und PMTU-Verhalten.

## Reliability und Failure Modes

| Symptom | Plausible Ursachen | Prüfreihenfolge |
|---|---|---|
| Remote Workload nicht erreichbar | Underlay-Route/ECMP, VTEP, EVPN MAC/IP-Route, VNI/VRF, ACL, MTU | Service-ID -> VNI/VRF -> EVPN route -> outer path -> egress FIB/host return |
| nur große Pakete fallen aus | MTU, PMTU/ICMP, NIC offload, firewall/service insertion | Packetbudget und Drop-/PMTU-Signale in beide Richtungen |
| unbekannter/broadcast Traffic stürmt | falsche BUM-Policy, suppression miss, host loop/storm | replication scope, rate, MAC/IP state, loop/port health |
| MAC flapped oder Ziel wechselt | mobility, duplicate MAC/IP, stale control-plane state, wiring | EVPN event/sequence, attachment, policy, time correlation |
| CE/Server dualhomed bricht bei Linkfehler | ESI/DF/split horizon/hash or port-channel mismatch | multihoming role, MAC move, loss/convergence, reverse flow |
| BGP grün, Service rot | VNI/RT import, VTEP dataplane, MTU/ACL, host/gateway/Rückweg | nicht bei Session stoppen: data plane und policy messen |
| eine Fabricänderung trifft viele Tenants | global RT/VNI/template/controller error | scope, canary, diff, blast radius, rollback verifizieren |

Ein Fabric-Fehler kann sich als Anwendungslatenz, DNS-Timeout, Pod-Restart, Storage-Fehler oder Sicherheitsalarm zeigen. Ein gutes Runbook beginnt deshalb mit Tenant, Quell-/Zielworkload, Zeitfenster, Richtung, Paketgröße, Datenklasse und Change-ID. Es setzt keine packet capture an einem beliebigen VTEP mit vollständiger Sicht gleich.

## Security, Governance und Compliance

VNI und VRF liefern logische Segmentierung, aber keine kryptografische Vertraulichkeit. Sie ersetzen weder Workload-Identity, Firewall/ACL, Routingpolicy, Managementplane-Schutz, Kubernetes-NetworkPolicy noch eine Verschlüsselungsentscheidung. Für geschützte Daten kann ein Verschlüsselungs-Overlay oder eine geeignete End-to-End-Schicht nötig sein; dessen MTU-, Schlüssel-, Performance- und Incidentfolgen sind separat zu entwerfen.

| Kontrolle | Ziel | Evidenz |
|---|---|---|
| VNI-/VRF-/RT-Policy | Tenanttransport und Import/Export begrenzen | deklarative Policy, peer-spezifischer Test, Auditdiff |
| BGP-EVPN-Härtung | unautorisierte oder übergroße Control Plane begrenzen | Peer Auth, filter, max-prefix/limits, CoPP, event log |
| VTEP-/Underlay-ACL | nur erwartete UDP-/IP-/Managementpfade zulassen | Ingress/Egress-Regel, flow/drops, Owner |
| Anycast-/Gatewaypolicy | East-West und North-South kontrollieren | VRF/FIB, firewall/service insertion, reverse path |
| Managementplane | Fabricintent, APIs und Credentials schützen | MFA/RBAC, least privilege, secret rotation, immutable audit |
| Workloadschutz | Tenant- und Anwendungspolitik vervollständigen | identity, microsegmentation, NetworkPolicy/host firewall |
| Privacy | Bewegungs-/Flow-/MAC-/IP-Daten minimieren | Datenklassifikation, Retention, Zugriff, Export/Löschung |

Governance bindet VNI-/VRF-/RD-/RT-Namensräume an IPAM, CMDB/Servicekatalog, Datenklassen, Owner, Genehmigung, Ablaufdatum und Rezertifizierung. Ein VNI darf nicht stillschweigend von einer temporären Umgebung zu einem produktiven Mandanten migrieren. Änderungen an Route Targets, globalen Templates, Shared Gateways, Controllerrollen oder Remote-VTEP-Policies werden als potenziell mehrmandantenwirksame Änderungen klassifiziert.

## Observability und Troubleshooting

Die korrelierbare Diagnosekette lautet:

~~~text
Tenant / workload / Service-ID
  -> attachment port or vNIC / VLAN
  -> VNI + MAC-VRF or IP-VRF
  -> EVPN BGP route and policy
  -> local VTEP decision
  -> outer IP/UDP/VXLAN packet over underlay ECMP
  -> remote VTEP decapsulation
  -> egress bridge/IRB/FIB + target workload and return path
~~~

Beobachte mindestens BGP-/EVPN-Peer- und Routezustand, RT-Import-/Export, VNI/VRF/bridge-domain State, MAC-/IP-/neighbor-Mobility, VTEP-/Tunnelzähler, BUM replication/queue/drop, per-link ECMP, MTU/PMTU, gateway/FIB, Interface-/ASIC-Ressourcen, Controller-Intent-/Actual-Drift, Changes und Fabric-/Tenant-SLOs. Sensible Flow- und Standortdaten unterliegen Zweckbindung und minimaler Retention.

Troubleshooting fragt stets nach der Ebene des Fehlers: Ist die Tenantzuordnung korrekt? Ist die Control-Plane-Ankündigung autorisiert und aktuell? Wird die richtige Remote-VTEP-Adresse genutzt? Passt VXLAN-VNI und MTU? Kann das Ziel im richtigen VRF und mit richtigem Rückweg antworten? Ein gefundener MAC-Eintrag ohne Zeit, VNI, Route Target, VTEP, Datenklasse und Reverse-Path-Kontext ist kein Abschlusstest.

## Kosten, Trade-offs und Anti-Patterns

| Entscheidung | Nutzen | Kosten oder Risiko |
|---|---|---|
| EVPN/VXLAN Fabric | skalierbare, kontrollierte Overlay-Semantik auf IP-Underlay | Automation, BGP-/VTEP-/MTU- und Betriebskompetenz |
| klassisches VLAN/STP | vertrauter kleiner Scope | blockierte Links, begrenzte L2-Ausdehnung, manuelle Fehleranfälligkeit |
| zentralisierte Controller-Workflows | Konsistenz und gewünschter Zustand | API-/Vendor-/Controller-Ausfallgrenze, Credential-Risiko |
| voll verteilte Konfiguration | weniger Zentralabhängigkeit | Drift, Reviewlast, reproduzierbare Änderung schwieriger |
| Ingress Replication | weniger Underlay-Multicastabhängigkeit | Kopfende-last und BUM-Kosten |
| Multicast Underlay | mögliche Replikationseffizienz | zusätzliche Protokoll- und Failure-Komplexität |
| DCI-Overlayausdehnung | gemeinsame Services über Standorte | Latenz, Failure-Blast-Radius, MAC mobility, Compliance |

Kosten entstehen in Switchports und Transceivern, Buffer-/TCAM-/Featuretiers, Controller/Lizenzen, Automations- und Testumgebungen, Telemetrie, Supportverträgen, Incidentbereitschaft, DCI-/Cloud-Egress und Skills. Eine Fabricentscheidung ist kein einmaliger CapEx-Vergleich.

Anti-Patterns sind: Underlay als „einfaches Netz“ ohne MTU-/ECMP-/Konvergenznachweis behandeln; VNI als Securityclaim nutzen; Layer-2-Ausdehnung ohne MAC/BUM/Failurebudget ausweiten; Route Targets global wiederverwenden; BGP-EVPN grün mit funktionierendem Workloadpfad verwechseln; Anycast Gateway ohne ARP/ND, FIB, Firewall und Rückweg testen; Controller-Desired-State als tatsächlichen Devicezustand ausgeben; eine unterbrochene Telemetrie für einen gesunden Fabriczustand halten.

## Staff-, Principal- und Chief-Level-Entscheidungen

**Staff:** Baut wiederholbare Testfälle für jeden Tenantvertrag: VNI/VRF-Zuordnung, lokale und entfernte Workloads, ARP/ND, known unicast, BUM-Grenze, Gateway, MTU, Unterlaylink-, VTEP-, BGP-/RR- und Dualhoming-Ausfall, Policyverstoß und Rollback. Die Messpunkte machen eindeutig, ob Control, Data, Service oder Organisation versagt hat.

**Principal:** Definiert Fabric Blueprints, Namespaces, SoT-/Intentmodell, BGP-EVPN-/RT-Policy, Golden Telemetry, Capacitymodell, Canary- und Upgradeprozesse. Er oder sie verhindert, dass Datacenter-, Cloud- und Kubernetes-Teams widersprüchliche Tenantgrenzen implementieren.

**Chief:** Entscheidet über den langfristigen Datacenter- und Cloud-Networking-Standard, Lieferanten- und Controllerabhängigkeit, Betriebsorganisation, Automations- und Sicherheitsbaseline, DCI-Strategie, finanzierte Redundanz und Exit. Entscheidend ist die nachweisbar beherrschbare Plattform für Unternehmens- und GenAI-Workloads, nicht ein möglichst modernes Overlaylabel.

## Production Checklist

- [ ] Service-, Tenant-, Datenklassen-, Owner-, SLO- und Rückwegvertrag ist freigegeben.
- [ ] VTEP-Loopbacks, Underlay-Erreichbarkeit, ECMP, MTU und Capacity bei Link-/Spine-Ausfall sind nachgewiesen.
- [ ] VNI, MAC-VRF, IP-VRF, RD/RT und Import-/Exportpolicy sind eindeutig und rezertifizierbar.
- [ ] BGP-EVPN-Peering, Route Reflection, Filter, Limits, CoPP, Authentication und Change-Observability sind geprüft.
- [ ] Erwartete MAC/IP-/Prefix-/Multihomingzustände wurden im relevanten Scope verifiziert.
- [ ] VXLAN-Encapsulation, UDP/IP-Pfad, Packetbudget, PMTU und Egress-VTEP-FIB funktionieren für repräsentative Flows.
- [ ] BUM-Replikation, Suppression, Storm-/Rategrenzen und Multicast-/Ingress-Replication-Fehlerpfade sind gemessen.
- [ ] Anycast-/IRB-/Firewall-/Service-Insertion- und Rückwegpolicy sind für East-West und North-South nachgewiesen.
- [ ] SoT, Actual-State, Drift, Backup, Canary, Rollback, Audit, Incident- und Provider-/Vendor-Supportpfad sind getestet.

## Interviewfragen

### 1. Welche Aufgabe hat EVPN gegenüber VXLAN?

**Antwort:** VXLAN ist die Overlay-Datenkapselung über UDP/IP. EVPN ist eine BGP-basierte Control Plane, die Dienst-/MAC-/IP-/Multihominginformation verbreiten kann. Beide Ebenen müssen unabhängig und zusammen geprüft werden.

### 2. Was bedeutet die Trennung von Underlay und Overlay praktisch?

**Antwort:** Das Underlay routet VTEP-zu-VTEP-IP. Das Overlay ordnet Tenantverkehr VNI/VRF und Remote-VTEP zu. Ein Fehler kann in jeder Ebene oder an ihrer Übersetzung liegen; deshalb braucht die Diagnose eine Kette über alle Ebenen.

### 3. Warum reicht ein VNI nicht als Sicherheitsgrenze?

**Antwort:** VNI ist eine Segmentkennung. Zugriff hängt zusätzlich von Attachment, VTEP, RT-/VRF-Policy, Routing, Firewall, Workloadidentity, Managementzugriff und korrekt konfiguriertem Datenpfad ab.

### 4. Wann ist Ingress Replication riskant?

**Antwort:** Wenn viele VTEPs und viel BUM-Verkehr zu hoher Kopfende-Replikation, Queue-/CPU-Last und ungünstigen Failureeffekten führen. Das muss gegen Multicast- und Betriebsalternativen gerechnet und gemessen werden.

### 5. Welche Besonderheit erzeugt Distributed Anycast Gateway?

**Antwort:** Das Default Gateway existiert an mehreren VTEPs, sodass der First Hop lokal sein kann. Gatewayidentität, ARP/ND, IRB-Policy, FIB, Security Service Insertion und Rückweg müssen dennoch einheitlich sein.

### 6. Warum ist MTU bei VXLAN ein Architekturthema?

**Antwort:** Kapselung vergrößert das Paket. Ein fehlerhaftes Packetbudget kann selektive Drops oder Fragmentierung erzeugen, obwohl BGP und VNI grün sind. Alle Geräte und Services des Pfades benötigen einen verifizierten Vertrag.

### 7. Wie begrenzt du eine fehlerhafte globale Route-Target- oder Templateänderung?

**Antwort:** Durch Namespaces, Policy as Code, Review, kleinskalige Canaries, Pre-/Post-State, Scope-Limits, Alerts, Quarantäne und einen getesteten Rollback. Die Änderung wird wie ein mehrmandantenwirksamer Sicherheitschange behandelt.

## Praktische Labs

### KB-0081-LAB-01: Lokales Overlay-Entscheidungsmodell

Das Modell trennt Tenantsegment, VTEP und Control-Plane-Lernzustand. Es erzeugt keine Verbindung und kapselt keine Pakete.

~~~python
tenant = {"vni": 10210, "mac_vrf": "research-eu-l2", "ip_vrf": "research-eu"}
evpn_mac_ip = {
    "00:11:22:33:44:55": {"ip": "10.210.0.42", "remote_vtep": "192.0.2.18", "vni": 10210}
}
frame = {"dst_mac": "00:11:22:33:44:55", "vni": tenant["vni"]}

entry = evpn_mac_ip[frame["dst_mac"]]
assert entry["vni"] == frame["vni"]
decision = {"mode": "known-unicast", "remote_vtep": entry["remote_vtep"]}
print(decision)
~~~

**Erwartung:** Der bekannte Eintrag führt nur zum fiktiven Remote-VTEP des passenden VNI. **Gegenprobe:** Entferne den Eintrag und formuliere die erforderliche BUM-/Ingress-Replication- oder Multicastentscheidung, statt stillschweigend zu flooden. **Grenze:** Das Modell bildet kein BGP, UDP, VXLAN, VTEP, MTU, Multihoming oder Endgerät ab. **Cleanup:** Es entstehen keine Ressourcen.

## Dependencies, Cross-References und Quellen

1. [RFC 7348: VXLAN Framework](https://datatracker.ietf.org/doc/html/rfc7348), abgerufen 2026-09-16. VXLAN, VTEP, VNI, UDP-Kapselung, ECMP- und MTU-Kontext.
2. [RFC 7432: BGP MPLS-Based Ethernet VPN](https://datatracker.ietf.org/doc/html/rfc7432.html), abgerufen 2026-09-16. EVPN, MAC-VRF, RD/RT, Multihoming, Split Horizon und Control-Plane-Grundlagen.
3. [RFC 8365: EVPN as NVO3 Overlay](https://datatracker.ietf.org/doc/html/rfc8365), abgerufen 2026-09-16. EVPN über IP-Tunnel und VXLAN/NVGRE-Kontext.
4. [draft-ietf-nvo3-rfc7348bis-05](https://datatracker.ietf.org/doc/draft-ietf-nvo3-rfc7348bis/), abgerufen 2026-09-16. Aktiver Internet-Draft als zeitabhängiger Hinweis; kein finaler RFC.
5. Curriculum: KB-0081 im Dateikatalog, Stand 2026-09-14. Scope und Einordnung.

Zeitabhängige Aussagen über Router-/Switch-OS, Controller, ASIC-/TCAM-Grenzen, VXLAN-Features, IETF-Draftstatus, Cloud-/Kubernetes-Integration, Lizenzierung, Provider-DCI oder Hardwareoffload müssen vor einem konkreten Design gegen aktuelle Hersteller-, IETF-, Vertrags- und Sicherheitsdokumentation verifiziert werden. Vertiefe anschließend mit [KB-0082](06-ecmp-und-bfd.md), [KB-0083](07-netzwerkdesign-mit-qos.md), [KB-0084](08-datacenter-netzarchitektur.md), [KB-0562](../23-security-identity/26-security-incident-response.md) und [KB-0720](../30-architect-practice/44-portfolioevidenz-und-reifemodelle.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad am 2026-09-16 | Architekturentscheidung |
|---|---|---|
| VXLAN RFC7348bis | **Aktiver IETF-Internet-Draft, kein finaler RFC.** Der Draft kann RFC 7348 künftig ablösen. | Draftstatus, Implementierungsunterstützung und Migrationsfolgen einzeln prüfen; nicht als normativ abgeschlossen behandeln. |
| EVPN-gestützte Multi-Cloud-/DCI-Patterns | **Adopting, stark an Anbieter und Latenz gebunden.** | Failure Domain, Residenz, Route-/MAC-Mobility, Kosten, Verschlüsselung und Exit nachweisen. |
| Streaming Telemetry und Intent-Validation | **Adopting bis established je Plattform.** Drift- und Zustandsdiagnose kann früher erfolgen. | Actual-vs-Intent, Schema, RBAC, Retention, Fehlalarme und Controllerausfall testen. |
| eBPF-/Host-basierte Netzwerkobservability | **Adopting.** Ergänzt Fabricdaten mit Workloadkontext. | Datenschutz, Overhead, Sampling, Zeitkorrelation und Vertrauensgrenze definieren. |

Ein Pilot akzeptiert eine EVPN/VXLAN-Innovation erst, wenn Underlay-/VTEP-/VNI-/MAC-VRF-/IP-VRF-/EVPN-/BGP-/RT-/Data-Plane-Semantik, BUM-/Multihoming-/IRB-/MTU-/ECMP-/Rückwegverhalten, Tenantisolation, Security/Privacy, Observability, Capacity/Cost, Owner, Change und Rollback nachgewiesen sind.
