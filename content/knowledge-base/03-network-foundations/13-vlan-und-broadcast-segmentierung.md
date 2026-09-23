---
{"id": "KB-0061", "title": "VLAN und Broadcast-Segmentierung", "domain": "03", "sequence": 13, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0050", "concepts": ["Ethernet", "MAC-Weiterleitung", "Broadcast"], "needed_for": "both"}, {"id": "KB-0051", "concepts": ["ARP", "Neighbor Discovery", "L2-Domain"], "needed_for": "both"}, {"id": "KB-0054", "concepts": ["CIDR", "Subnetzgrenze", "Adressplan"], "needed_for": "understanding"}, {"id": "KB-0059", "concepts": ["DHCP-Broadcast", "Relay", "Pool-Segment-Zuordnung"], "needed_for": "both"}], "related": ["KB-0053", "KB-0062", "KB-0063", "KB-0064", "KB-0562", "KB-0720"], "applies": ["KB-0062", "KB-0063", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Das Lab modelliert VLAN-Mitgliedschaft, tagged/untagged Klassifikation, Broadcast-Flooding und Fehlzuordnungen mit lokalen Python-Datenstrukturen.", "rationale": "Es erzeugt keine Ethernetframes und verändert weder VLAN, Interface, Bridge, Switch, Router, Firewall, Cloud- noch Produktionsressource."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein Segmentvertrag definiert Zweck, Zugehörigkeit, VLAN-ID, L3-Gateway, DHCP-/DNS-Pfad, erlaubte Trunks, Broadcast-/Multicast-Policy, Identity-/Security-Kontrollen, Observability und Rückbau.", "rationale": "VLAN-Zugehörigkeit begrenzt Layer-2-Weiterleitung; sie ist keine vollständige Autorisierung, Verschlüsselung oder Datenklassifikation."}, "STAFF-TARGET": {"active": true, "scope": "Teams testen Portrollen, native/PVID-Zuordnung, erlaubte VLAN-Listen, MAC-/ARP-/DHCP-Verhalten, Broadcast-/Unknown-Unicast-Flooding, L3-Policy und Fehlerrückbau über alle Switch- und Gatewaypfade.", "rationale": "Sie unterscheiden falsche Portklassifikation, fehlendes VLAN auf einem Pfad, MAC-/ARP-Lernen, L3-Routing, DHCP und Zugangskontrolle statt einen lokalen Linkstatus als End-to-End-Beweis zu deuten."}, "CHIEF-TARGET": {"active": true, "scope": "Die Organisation steuert Segmentierung nach Asset-, Risiko- und Betriebsgrenzen, inklusive Identity, NAC, Firewall, WLAN, Cloud-Overlays, Standortresilienz, Namensraum, Ownership und Provider-/Lifecycle-Risiken.", "rationale": "Eine flache oder unklare L2-Struktur vergrößert Blast Radius, Fehlersuche und Sicherheitsrisiko; zu feine Segmentierung ohne Betriebsmodell kann denselben Effekt erzeugen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "802.1Q-Tag-Stacking, MSTP/RSTP, LACP/MLAG, VXLAN/EVPN, switch ASIC behavior, IGMP/MLD snooping, storm control, port-security, DHCP snooping, dynamic ARP inspection, private VLANs und packet-level troubleshooting sind Spezialistentiefe.", "rationale": "Die Zielrollen müssen Segment-, Risiko- und Betriebsgrenzen vorgeben und reviewen; detaillierte Switch-/Fabric-Implementierung kann bei Netzwerk-Spezialisten liegen."}}, "lab_validation": [{"lab_id": "KB-0061-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox ohne Netzwerkzugriff", "evidence": "Port-VLAN-Klassifikation, Broadcast-Reichweite und eine fehlerhafte Trunk-Mitgliedschaft als deterministische Fallarbeit geprüft.", "limitations": "Nicht ausgeführt; kein Ethernetframe, kein VLAN-Tag, keine Bridge, kein Interface, kein Switch, kein Router, keine Firewall, Cloud- oder Produktionsressource wurde verwendet oder verändert."}]}
---
# VLAN und Broadcast-Segmentierung

> **Ziel:** Ein VLAN definiert eine Layer-2-Zugehörigkeit für Ethernet-Frames. Es trennt Broadcast-Domänen und strukturiert Weiterleitung, ersetzt jedoch weder Identität, Zugriffskontrolle, Verschlüsselung noch eine Firewall. Entwirf VLANs als überprüfbare Segmente mit klarer Port-, Gateway-, DHCP- und Security-Verantwortung.

## Purpose, Definition und Scope

Ein Virtual LAN (VLAN) ermöglicht mehrere logisch getrennte Ethernet-Broadcast-Domänen über eine gemeinsame physische Switching-Infrastruktur. IEEE 802.1Q beschreibt die VLAN-Kennzeichnung und Bridging-Mechanismen. Auf Verbindungen zwischen Switches können Frames mit einer VLAN-ID markiert werden; an Endgeräten kommen Frames je nach Portrolle typischerweise ohne diesen Tag an.

Dieses Kapitel erklärt tagged und untagged Frames, VLAN-Zugehörigkeit, Broadcast-Grenzen und lokale Isolation. Der Schwerpunkt liegt auf der korrekten Sicherheitsgrenze: VLANs steuern Layer-2-Weiterleitung, sie garantieren aber nicht allein, dass ein System keine unerwünschte Kommunikation führen kann.

Nicht im Scope: detailliertes Trunk-Design, Spanning Tree, LACP, private VLANs, VXLAN/EVPN oder eine produktspezifische Switch-Konfiguration. Diese Themen werden in Folgeartikeln vertieft.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Ein VLAN trennt L2-Broadcast-Domänen und erhält auf passenden Links eine explizite Zugehörigkeitsmarkierung. |
| HANDS-ON-TARGET | Das Lab modelliert Ports und Frames offline. |
| ARCHITECT-TARGET | Segmentzweck, VLAN, Gateway, DHCP, erlaubte Pfade, Security und Monitoring sind gemeinsam definiert. |
| STAFF/PRINCIPAL | Teams prüfen End-to-End-Mitgliedschaft und trennen L2-, L3-, DHCP- und Securityursachen. |
| CHIEF | Segmentierung folgt Risikogrenzen, Betriebsfähigkeit, Identität und organisationsweiter Ownership. |

## Mental Model: Ein VLAN bestimmt die lokale L2-Reichweite

```text
endpoint A -- access port / untagged --> switch
                                      | classified into VLAN 120
                           tagged link | VLAN 120 carried where allowed
                                      v
                                  switch / gateway
endpoint B in VLAN 120 <--- same L2 broadcast domain

endpoint C in VLAN 130 is not reached by VLAN 120 broadcast.
Communication VLAN 120 -> VLAN 130 needs an L3 gateway and policy.
```

Ein Broadcast oder unbekannter Unicast in VLAN 120 bleibt innerhalb der aktiven Weiterleitungsdomäne für VLAN 120. Das bedeutet nicht:

```text
VLAN does not itself provide:
  authentication, authorization, encryption, endpoint health,
  application isolation, data classification, DDoS protection,
  safe trunk configuration, or permitted inter-VLAN routing.
```

Der richtige Architekturbegriff ist daher **Segment**: VLAN-ID, Ports, MAC-Lernen, L3-Interface, DHCP-Pool, DNS-/NTP-/Security-Policy, Nutzer- oder Workloadklasse und Betriebsverantwortung bilden zusammen eine Grenze.

## Prerequisites und Dependencies

| ID | Art | Bedeutung |
|---|---|---|
| [KB-0050](02-ethernet-und-mac-weiterleitung.md) | Verständnis und Lab | Ethernet, MAC-FDB, Flooding und Broadcast. |
| [KB-0051](03-arp-und-neighbor-discovery.md) | Verständnis und Lab | ARP/Neighbor Discovery innerhalb der L2-Domäne. |
| [KB-0054](06-subnetting-und-cidr.md) | Verständnis | Adressplan und L3-Grenzen. |
| [KB-0059](11-dhcp-und-adressvergabe.md) | Verständnis und Lab | DHCP-Broadcast, Relay und Pool-to-Segment-Vertrag. |

## Core Concepts

### Frame-Klassifikation: tagged, untagged und PVID

Ein Switchport weist eingehenden Frames eine VLAN-Zugehörigkeit zu. Bei einem untagged Frame erfolgt die Klassifikation anhand der Portkonfiguration, häufig als PVID oder native VLAN bezeichnet. Ein tagged Frame trägt eine VLAN-ID im 802.1Q-Kontext und wird nur akzeptiert, wenn die Portpolicy diese Zuordnung erlaubt.

| Frame-/Portfall | Klassifikation | Designfrage |
|---|---|---|
| untagged Endgerät an Access-Port | Port weist genau eine VLAN-Zugehörigkeit zu | Welcher Endpunkttyp darf hier erscheinen? |
| tagged Frame auf zugelassenem Trunk | Tag bestimmt erlaubte VLAN-Zugehörigkeit | Ist VLAN explizit erlaubt und auf jedem Pfad konsistent? |
| tagged Frame auf Access-Port | muss nach Portpolicy behandelt werden | Kein Endgerätvertrauen aus dem Tag ableiten. |
| untagged Frame auf Trunk | native/PVID-Policy bestimmt Verhalten | Native VLAN nicht implizit oder widersprüchlich lassen. |
| VLAN nicht auf Link erlaubt | Frame darf nicht in diese Weiterleitungsdomäne gelangen | Konfigurationsdrift und Zielpfad prüfen. |

„Tagged“ bedeutet nicht „sicher“. Der Tag dient der L2-Zuordnung; Integrität, Zugriff und Vertraulichkeit folgen aus separaten Kontrollen.

### Broadcast, Unknown Unicast und Multicast

Switches lernen Quell-MAC-Adressen pro Port und VLAN in einer Forwarding Database. Ein bekanntes Ziel kann zum entsprechenden Port weitergeleitet werden. Broadcast und unbekannte Ziele werden in der jeweiligen VLAN-Domäne geflutet, sofern keine weitergehende Policy das begrenzt. Multicast kann mit Mitgliedschaftsinformationen optimiert werden, muss jedoch auf Segment- und Sicherheitsfolgen geprüft werden.

| Verkehr | VLAN-Verhalten | Betriebsfolge |
|---|---|---|
| Broadcast | wird innerhalb des VLAN weitergegeben | ARP, DHCP und Discovery wirken nur in ihrer L2-Domäne. |
| Unknown unicast | kann im VLAN geflutet werden | FDB-Lernen, Fehlkonfiguration und Flooding beobachten. |
| bekannter unicast | nur zum bekannten Zielport | MAC-Move oder falsche FDB kann Symptome erzeugen. |
| Multicast | abhängig von Snooping/Policy | Mitgliedschaft und Fallback-Flooding getrennt messen. |

Broadcast-Grenzen begrenzen Fehler- und Lastausbreitung, verhindern aber keinen bösartigen oder kompromittierten Endpunkt innerhalb derselben Domain. Daher sind sie eine Komponente von Defense in Depth, nicht die ganze Verteidigung.

### VLAN, Subnetz und Gateway

VLAN und IP-Subnetz sind unterschiedliche Schichten, werden in vielen Designs aber bewusst eins zu eins zugeordnet. Diese Kopplung erleichtert Betrieb, DHCP-Poolzuordnung, Gateway-Routing und Incidentanalyse. Sie ist eine Architekturkonvention, kein physikalisches Naturgesetz.

```text
VLAN 120 -> 10.20.120.0/24 -> gateway 10.20.120.1 -> DHCP pool 10.20.120.0/24
VLAN 130 -> 10.20.130.0/24 -> gateway 10.20.130.1 -> DHCP pool 10.20.130.0/24
```

Für Kommunikation über Segmentgrenzen braucht ein Router oder Layer-3-Switch ein Interface im jeweiligen Netz sowie eine explizite Policy. Ein Client in VLAN 120, der eine Adresse aus VLAN 130 erhält, kann lokale Link- und DHCP-Symptome zeigen, aber keine korrekte Gesamtkonfiguration besitzen.

## Architecture und Data Flow

### Segmentvertrag

```text
[Asset / workload class]
      -> [Access policy or port role]
      -> [VLAN membership]
      -> [L2 forwarding + ARP/ND/DHCP scope]
      -> [L3 gateway / firewall policy]
      -> [DNS, NTP, service paths]
```

Der Segmentvertrag beantwortet für jede VLAN-ID:

- Geschäfts- oder Sicherheitszweck und erwartete Endpunkte;
- Owner, Standorte, Switch-/WLAN-/Hypervisorpfade;
- zulässige tagged und untagged Portrollen;
- L3-Präfix, Gateway, DHCP-Pool und Resolver-/NTP-Optionen;
- erlaubte Inter-VLAN-Flows, Identity-/NAC-/Firewallkontrollen;
- Broadcast-/Multicast-/Unknown-Unicast-Policy;
- Telemetrie, Alarmgrenzen, Notfallzugang und Rückbau.

### Change-Welle: neues Segment

1. Zweck, Datenklasse und Owner festlegen; nicht mit einer freien VLAN-ID beginnen.
2. L3-Präfix, Gateway, DHCP-/DNS-/NTP-Policy und Securityregeln als zusammenhängenden Vertrag erstellen.
3. Alle erlaubten Links, Ports, Hypervisor-/WLAN-/Gatewaypfade nachvollziehbar konfigurieren; nicht benötigte VLANs ausschließen.
4. Mit Testendpunkt End-to-End prüfen: Klassifikation, Adresse, Prefix, Gateway, ARP/ND, DNS, erlaubt/verboten Flow.
5. Broadcast-/MAC-/DHCP-/L3-Telemetrie beobachten und dokumentierte Notfallrücknahme bereithalten.
6. Erst nach validierter Nutzung alte Übergangspfade und zu breite Trunks zurückbauen.

## Scalability und Performance

Sehr große Broadcast-Domänen vergrößern ARP/ND, DHCP- und Discovery-Reichweite sowie den Blast Radius fehlerhafter oder missbräuchlicher Frames. Viele kleine VLANs reduzieren lokale Ausbreitung, erhöhen aber Anzahl von Gateways, Policies, Trunks, Routingtabellen, Monitoringregeln und Betriebsfehlern. Der richtige Zuschnitt folgt Last, Sicherheitsgrenze, Standort, Workloadmobilität und Betriebsfähigkeit.

| Kennzahl | Aussage | Entscheidung |
|---|---|---|
| aktive MACs pro VLAN | FDB-/Segmentgröße | Kapazität und unerwartete Endpunkte erkennen. |
| Broadcast/unknown-unicast Rate | lokale Ausbreitungs- und Fehlerlast | Storms, FDB-Probleme und Discovery-Bursts abgrenzen. |
| ARP/ND Rate und Fehler | Nachbarauflösung | Konflikte, große Domains und Proxy-/Suppression-Policy bewerten. |
| DHCP Discover-to-ACK | Clientbootstrap | VLAN-/Relay-/Pool-Mapping prüfen. |
| MAC moves/flaps | Schleifen, Mobility oder Fehlverkabelung | Ursache gegen Topologie und Virtualisierung korrelieren. |
| Inter-VLAN policy denies | erwartete oder fehlerhafte Isolation | Regelbesitz und Change-Effekte prüfen. |
| Trunk allowed-set drift | fehlende/zu breite Pfade | deklarativen Soll-/Ist-Abgleich durchführen. |

## Reliability und Failure Modes

| Fehlerbild | Ursacheklasse | Beweis | Sofortmaßnahme | Dauerhafte Maßnahme |
|---|---|---|---|---|
| Client bekommt keine Adresse | falsches VLAN, DHCP/Relay/Poolscope | Port-VLAN, DORA, Relay, ACK-Optionen | Pfad eingrenzen | Segment-/DHCP-Vertrag automatisiert prüfen. |
| Nur einige Hosts erreichen Dienst | VLAN fehlt auf Link oder L3-Policy weicht ab | vollständiger Switch-/Gatewaypfad | fehlerhaften Link begrenzen | allowed-set und Policies als Code prüfen. |
| Broadcast-Sturm | Loop, Endpunktfehler oder falsche Flooding-Policy | pro-VLAN Rate, MAC-/STP-Ereignisse | Segment schützen/isolieren nach Runbook | Storm-Control, Loop-Schutz, Kapazitätsdesign. |
| Falsche IP im Segment | DHCP-Pool-/Relay-/statische Konflikte | VLAN, Prefix, Lease, ARP | Konfliktcontainment | eindeutige Pool-/Subnetz-/VLAN-Zuordnung. |
| „VLAN sicher, aber Zugriff möglich“ | Inter-VLAN-Routing oder Shared Service erlaubt | L3-/Firewall-/Identity-Logs | Policy analysieren | VLAN nicht als alleinige Securitykontrolle verwenden. |
| Unbekannter Unicast erreicht zu viele Ports | FDB-Lernen fehlt oder Flapping | FDB, MAC moves, Flood counters | Ursache isolieren | physische/virtuelle Topologie und MAC-policy verbessern. |

## Security, Governance und Compliance

VLANs reduzieren unkontrollierte L2-Reichweite und unterstützen Segmentierung. Sie schützen nicht automatisch gegen einen kompromittierten Host im selben Segment, falsch konfigurierte Trunks, erlaubt geroutete Flows, ARP-Spoofing, Rogue-DHCP, unverschlüsselten Verkehr oder unklare Administratorrechte.

| Risiko | Kontrolle |
|---|---|
| Rogue Endpoint im Accesssegment | 802.1X/NAC, Portpolicy, Asset- und Identity-Kontrollen. |
| Rogue DHCP oder ARP-Spoofing | DHCP Snooping/DAI nach validiertem Switchdesign, Monitoring und Incidentrunbook. |
| VLAN-Hopping / falscher Tag | Access/Trunk klar trennen, zulässige VLANs klein halten, native/PVID explizit steuern. |
| zu breite Inter-VLAN-Kommunikation | L3-Firewall, Identity-Policy, Serviceallowlists und Flow-Observability. |
| unberechtigter Konfigurationschange | Least Privilege, Review, Audit, Backups und getesteter Rollback. |
| sensible Assetdaten in Telemetrie | minimal notwendige MAC-/Port-/Identitydaten, Retention und Zugriffsschutz. |

Ein VLAN-Name oder eine VLAN-ID ist keine Datenklassifikation. Compliance-Anforderungen müssen aus Geschäftsprozess, Datenfluss, Zugriff, Verschlüsselung, Logging und Nachweis abgeleitet werden.

## Observability und Troubleshooting

### Ereignisschema

```text
timestamp, site, switch/bridge, port, expected and observed VLAN,
tagged-or-untagged classification, MAC/FDB state, ARP/ND state,
broadcast/unknown-unicast/multicast counters, DHCP relay and pool,
gateway state, L3 policy result, identity/NAC state, change correlation id
```

### Triage-Reihenfolge

1. **Endpunkt- und erwarteten Segmentvertrag fixieren:** Port/SSID/Hypervisor, VLAN, Prefix, Gateway, Clientklasse, erlaubte Dienste.
2. **L2-Klassifikation nachweisen:** beobachtetes Tag/untagged, PVID, Portrolle und vollständige Linkkette ermitteln.
3. **MAC- und Nachbarpfad prüfen:** FDB, MAC-Moves, ARP/ND und Broadcastrate im konkreten VLAN betrachten.
4. **Bootstrap prüfen:** DHCP-Offer/ACK, Relaykontext, Pool, Adresse, Gateway und DNS getrennt vergleichen.
5. **L3 und Security prüfen:** Gatewayroute, Firewall-/Identity-Entscheidung und Dienstprobe überprüfen.
6. **Change/Drift prüfen:** allowed VLANs, native/PVID, Template/Automation und jüngste Änderungen gegen Sollzustand vergleichen.
7. **Containment:** Storm oder kompromittierten Port gemäß Runbook begrenzen, ohne unbeteiligte Segmente zu verändern.

## Cost und FinOps

VLANs sind meist kein einzeln bepreistes Feature, verursachen aber Kosten durch Switchports, Gateways, Firewallregeln, IPAM, DHCP-/DNS-/NTP-Scopes, WLAN-/Hypervisorintegration, Monitoring und Betriebszeit. Eine kostensparende flache L2-Domain kann Incident- und Securitykosten erhöhen. Übersegmentierung steigert Regel- und Changekosten.

Entscheide nach messbarer Wirkung:

- Größe und Wachstum der Broadcast-Domäne;
- Anzahl und Komplexität nötiger Gateway- und Policyobjekte;
- Kosten von Test, Driftkontrolle, Telemetrie und On-Call;
- Wert einer kleineren Fehlerdomäne für kritische Workloads;
- Wiederverwendbarkeit von Segmentvorlagen über Standort und Cloud-/On-Prem-Grenzen.

## Trade-offs und Anti-Patterns

| Entscheidung | Gewinn | Preis | Leitplanke |
|---|---|---|---|
| große VLAN-Domain | einfache L2-Mobilität | größerer Broadcast-/Fehler-/Sicherheitsradius | nur bei gemessener Kapazität und klarer Trust Zone. |
| kleine VLAN-Domains | begrenzte Ausbreitung | mehr L3-/Policy-/Operationsobjekte | standardisierte Segmentvorlagen. |
| breite Trunks | einfache Erweiterung | unnötige VLAN-Reichweite und Fehlerrisiko | nur tatsächlich benötigte VLANs erlauben. |
| untagged Access | einfache Endgeräteanbindung | falscher Port kann falsche Zugehörigkeit erhalten | Identity/Portpolicy und Inventar. |
| L2-Isolation ohne L3-Policy | lokale Trennung | geroutete Flows bleiben möglich | Firewall/Identity als separate Grenze. |
| Overlay-VLAN/VXLAN-Ansatz | Skalierung über Fabrics | Komplexere Control-/Data-Plane | nur mit observierbarem Ownershipmodell. |

Anti-Patterns:

- VLAN als Synonym für Security oder Compliance behandeln.
- Eine VLAN-ID ohne Segmentzweck, Owner, Prefix und Gateway-/DHCP-Policy anlegen.
- Ein Native-/PVID-Verhalten „implizit“ lassen.
- Alle VLANs auf jeden Trunk erlauben, weil es kurzfristig bequem ist.
- DHCP-/DNS-/Gateway-Fehler mit einem Link-Up als behoben erklären.
- Broadcast-Storm oder MAC-Flapping nicht pro VLAN messen.
- Einen L2-Fehler durch breite L3-Ausnahmen kaschieren.
- VLANs in On-Prem und Cloud als technisch identisch annehmen, ohne die jeweiligen Netzwerkmodelle zu prüfen.

## Staff-, Principal- und Chief-Level Decisions

### Staff / Principal

- Formuliere Segmentvorlagen als Verträge, die L2, L3, DHCP, DNS, Security, Telemetrie und Ownership zusammenführen.
- Verwende explizite Access-/Trunk-/allowed-set-/native-VLAN-Policies und prüfe Soll gegen Ist kontinuierlich.
- Teste neue Segmente aus allen relevanten Endpunktformen: kabelgebunden, WLAN, virtuelle Maschine, Containerhost und Managementzugang.
- Verlange die Trennung von L2-Zugehörigkeit, L3-Routing, Identity und Anwendungsauthorisierung in Architektur- und Incidentdokumenten.
- Begrenze Blast Radius mit gemessener Kapazität und nachgewiesener Betriebsfähigkeit, nicht mit zufälligen historischen VLAN-Grenzen.

### Chief

- Setze eine segmentierungsweite Taxonomie nach Daten-, Asset-, Risiko- und Betriebsgrenze statt nach einzelnen Netzwerkgeräten.
- Entscheide, wo campus-, datacenter-, cloud- und edge-spezifische Mechanismen vereinheitlicht werden können und wo ihre Sicherheitsmodelle differieren.
- Verankere Ownership zwischen Network, Security, Workplace, Platform, Cloud und Application Teams.
- Finanzieren und messe Driftkontrolle, Observability, Recovery und Übungen als Teil des Segments, nicht als optionale Netzwerkextras.
- Bewerte alle Segmentierungsprojekte nach erreichbarer Risikoreduktion, operativer Komplexität und Migrationsfähigkeit.

## Production Checklist

- [ ] Segmentzweck, Owner, Daten-/Assetklasse und erwartete Endpunkte sind dokumentiert.
- [ ] VLAN-ID, L3-Präfix, Gateway, DHCP-Pool, DNS-/NTP-Optionen und Sicherheitsregeln sind konsistent.
- [ ] Access-, Trunk-, native/PVID- und allowed-VLAN-Policies sind explizit und überprüfbar.
- [ ] Unnötige VLANs sind auf Links, Ports und Templates entfernt.
- [ ] DHCP, ARP/ND, FDB, Broadcast/unknown-unicast, Gateway und L3-Policy werden pro Segment beobachtet.
- [ ] Rogue-Server-/Spoofing-/Loop-/Storm-/MAC-Move-Kontrollen sind angemessen gestaltet und getestet.
- [ ] Inter-VLAN-Flows besitzen Serviceowner, Identity-/Firewallpolicy und Auditpfad.
- [ ] Test zeigt erlaubt und verbotenes Verhalten über jede relevante Endpunktklasse.
- [ ] Segmentchange besitzt Rückbau, Notfallzugang und eine zeitlich/inhaltlich begrenzte Übergangspolicy.
- [ ] Topologie, Konfiguration, Telemetrie und IPAM bleiben konsistent nachweisbar.

## Praktisches Lab: Offline-Modell für Portklassifikation und Broadcast-Grenze

**Ziel:** Das Lab modelliert, welche Ports einen Frame für ein VLAN erhalten. Es erzeugt keine Frame- oder Netzwerkkonfiguration.

```python
ports = {
    "laptop-a": {"pvid": 120, "allowed": {120}, "tagged": False},
    "uplink-1": {"pvid": 999, "allowed": {120, 130}, "tagged": True},
    "server-b": {"pvid": 120, "allowed": {120}, "tagged": False},
    "server-c": {"pvid": 130, "allowed": {130}, "tagged": False},
}

def classify(port, vlan_tag=None):
    rule = ports[port]
    vlan = rule["pvid"] if vlan_tag is None else vlan_tag
    return vlan if vlan in rule["allowed"] else None

def broadcast_receivers(source, vlan):
    return [p for p, rule in ports.items()
            if p != source and vlan in rule["allowed"]]

vlan = classify("laptop-a")
print(vlan, broadcast_receivers("laptop-a", vlan))
print(classify("uplink-1", vlan_tag=130))
print(classify("server-c", vlan_tag=120))
```

**Erwartete Auswertung:**

| Probe | Erwartung | Aussage |
|---|---|---|
| untagged `laptop-a` | VLAN 120 | Access-Port klassifiziert anhand PVID. |
| Broadcast in VLAN 120 | `server-b` und geeigneter Uplink, nicht `server-c` | Broadcast bleibt an VLAN-Zugehörigkeit gebunden. |
| tagged VLAN 130 auf `uplink-1` | akzeptiert | Trunk trägt nur seine erlaubte Liste. |
| VLAN 120 auf `server-c` | `None` | Ein Port ohne Membership darf nicht Mitglied werden. |

**Negative Probes:**

1. Entferne VLAN 120 aus `uplink-1`. Erkläre, warum lokale Hosts noch arbeiten können, ein entfernter Pfad aber ausfällt.
2. Füge VLAN 130 zu `laptop-a` hinzu. Begründe, warum eine breite Access-Zugehörigkeit eine Security- und Betriebsentscheidung ist.
3. Simuliere einen Broadcastzähler pro VLAN. Zeige, dass ein hoher Zähler für VLAN 120 keine Aussage über VLAN 130 macht.
4. Ergänze Gateway- und DHCP-Daten getrennt vom `ports`-Modell. Begründe, warum korrekte L2-Klassifikation keine funktionsfähige L3-Konfiguration garantiert.

**Cleanup:** Interpreter beenden und nur temporäre lokale Labdateien löschen. Keine VLAN-, Interface-, Bridge-, Switch-, Router-, Firewall-, Cloud- oder Produktionsressource wurde verändert.

## Interviewfragen mit Antwortkernen

1. **Was unterscheidet tagged von untagged Frames?**  
   Tagged Frames tragen eine VLAN-Zugehörigkeit im 802.1Q-Kontext. Untagged Frames werden über die Portpolicy klassifiziert. Beide benötigen eine eindeutige, überprüfbare Portkonfiguration.

2. **Was begrenzt ein VLAN?**  
   Es begrenzt primär die Layer-2-Broadcast-/Forwarding-Domäne. Kommunikation zu anderen Segmenten benötigt L3-Routing und kann durch weitere Policies erlaubt oder verhindert werden.

3. **Warum ist ein VLAN keine vollständige Sicherheitsgrenze?**  
   Es liefert keine Authentisierung, Verschlüsselung oder Anwendungsauthorisierung und kontrolliert nicht automatisch geroutete Inter-VLAN-Flows oder kompromittierte Endpunkte im selben Segment.

4. **Wie hängen VLAN und DHCP zusammen?**  
   Das VLAN bildet die lokale Broadcast-/Relay-Sicht, über die der Server den passenden Pool und Optionssatz auswählen muss. Falsche Zuordnung kann eine Adresse aus dem falschen Netz erzeugen.

5. **Woran erkennst du einen fehlenden VLAN-Pfad auf einem Trunk?**  
   Lokaler Access kann funktionieren, während entfernte Endpunkte oder Gateways nicht erreichbar sind. Die Diagnose vergleicht allowed VLANs auf jedem Link, FDB/ARP und L3-Policy.

6. **Was ist Unknown-Unicast-Flooding?**  
   Ist die Ziel-MAC nicht bekannt, kann der Switch den Frame im VLAN fluten. Häufigkeit und Ursache müssen von Broadcast und erwarteter Mobility getrennt gemessen werden.

7. **Wie wählst du die Größe einer Broadcast-Domain?**  
   Aus Sicherheits-/Assetgrenze, Broadcast-/Discoverylast, MAC-Kapazität, Standort, Mobilität, L3-Policy und Operationskosten – nicht aus einer pauschalen Hostzahl.

8. **Was muss vor einem neuen VLAN produktiv nachgewiesen werden?**  
   Zugehörigkeit, VLAN-Pfad, Prefix/Gateway, DHCP/DNS, erlaubte und verbotene Flows, Securitycontrols, Telemetrie, Owner und Rückbau.

## Dependencies, Cross-References und Quellen

| Beziehung | Dokument | Nutzung |
|---|---|---|
| Voraussetzung | [KB-0050](02-ethernet-und-mac-weiterleitung.md) | MAC-Lernen und Flooding. |
| Voraussetzung | [KB-0051](03-arp-und-neighbor-discovery.md) | ARP/ND in der L2-Domäne. |
| Voraussetzung | [KB-0059](11-dhcp-und-adressvergabe.md) | Relay und Pool-Segment-Zuordnung. |
| Weiterführung | KB-0062 Trunks und VLAN-Transport | Link- und allowed-set-Design. |
| Weiterführung | KB-0063 STP, RSTP und Schleifenvermeidung | L2-Topologie und Loop-Schutz. |
| Weiterführung | KB-0562 Enterprise DNS und Namensräume | Segmentübergreifende Plattform-Ownership. |
| Nachweis | KB-0720 Portfolioevidenz und Reifemodelle | Segmentvertrag und überprüfbare Labs. |

Primär- und Implementierungsquellen, abgerufen und inhaltlich geprüft am **2026-09-16**:

- [IEEE 802.1Q – Bridges and Bridged Networks](https://standards.ieee.org/ieee/802.1Q/7073/)
- [RFC 826 – Ethernet Address Resolution Protocol](https://www.rfc-editor.org/rfc/rfc826)
- [RFC 7348 – Virtual eXtensible Local Area Network](https://www.rfc-editor.org/rfc/rfc7348)
- [Linux bridge(8) – Bridge, FDB, VLAN and VNI operations](https://man7.org/linux/man-pages/man8/bridge.8.html)
- [Linux Kernel – Ethernet Bridging documentation](https://docs.kernel.org/networking/bridge.html)

## Bonus: New Tech and Innovations

Overlay-Fabrics wie VXLAN können Layer-2- oder Segmentinformationen über eine Layer-3-Underlay-Infrastruktur tragen und so größere oder standortübergreifende Topologien ermöglichen. RFC 7348 beschreibt VXLAN als Datenebenenmechanismus; produktiver Nutzen hängt von Control Plane, Gateway, Security, MTU, Observability und Lebenszyklus der Endpunkte ab. Ein Overlay ersetzt keinen verständlichen Segmentvertrag.

Dynamische Segmentierung kann Identity, Device Posture und Workloadkontext zur Laufzeit in Netzpolicy übersetzen. Sie reduziert manuelle Portpflege, erhöht jedoch Abhängigkeit von Identity-, Policy- und Control-Plane-Diensten. Fail-open/closed-Verhalten, Caching, Notfallzugang und Audit müssen vor der Einführung feststehen.

Ein Pilot akzeptiert eine Segmentierungsinnovation erst, wenn Klassifikation, L2-/L3-Grenzen, Identity, Security, Broadcastverhalten, Observability, Migration und Rückbau über alle betroffenen Pfade nachgewiesen sind.

