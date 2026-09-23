---
{"id": "KB-0084", "title": "Datacenter-Netzarchitektur", "domain": "04", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["ENTERPRISE", "CLOUD", "PLATFORM", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0064", "concepts": ["FIB", "Routing"], "needed_for": "both"}, {"id": "KB-0077", "concepts": ["Konvergenz", "Underlay"], "needed_for": "both"}, {"id": "KB-0078", "concepts": ["BGP", "Policy"], "needed_for": "both"}, {"id": "KB-0081", "concepts": ["EVPN", "VXLAN", "VTEP"], "needed_for": "both"}, {"id": "KB-0082", "concepts": ["ECMP", "BFD", "Kapazität"], "needed_for": "both"}], "related": ["KB-0085", "KB-0086", "KB-0562", "KB-0720"], "applies": ["KB-0085", "KB-0086", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein lokales, fiktives Rack-/Leaf-/Spine-/Capacitymodell ohne Netzwerkzugriff prüfen.", "rationale": "Es übt Ausfall- und Oversubscription-Logik ohne Geräte oder Traffic."}, "ARCHITECT-TARGET": {"active": true, "scope": "Leaf-Spine, Underlay/Overlay, East-West, North-South, Oversubscription, Rack/Pod/Fabric-Failure-Domains, MTU und Servicegrenzen entwerfen.", "rationale": "Datacenter-Netze sind eine Kapazitäts- und Verfügbarkeitsgrundlage."}, "STAFF-TARGET": {"active": true, "scope": "End-to-end Workload-, Storage-, Service-Insertion- und Failuretests über ToR/Leaf/Spine/Overlay mit SLO-Korrelation organisieren.", "rationale": "Fabricfehler sind oft als Plattform- oder Datenproblem sichtbar."}, "CHIEF-TARGET": {"active": true, "scope": "Datacenter-/Cloud-Strategie, Resilienzbudget, Lieferanten/Lifecycle, Energie/Fläche, Kapazität, Betriebsorganisation und Exit entscheiden.", "rationale": "Fabrictopologie prägt Kosten und Geschäftsfortführung langfristig."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "RIFT, BGP-LS, SRv6, RDMA/RoCE, lossless Ethernet, DPU, GPU fabric, optical design und herstellerspezifische ASIC-/Buffer-Architekturen sind Vertiefungen.", "rationale": "Kern ist ein geprüftes Netz für Workload- und Storagepfade."}}, "lab_validation": [{"lab_id": "KB-0084-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Lokales fiktives Pythonmodell ohne Netzwerkzugriff", "evidence": "Rack-Uplinks, Spineausfall und verbleibende Kapazität werden als Annahmen ausgewiesen.", "limitations": "Nicht ausgeführt; keine Switches, Links, ECMP-FIBs, Workloads, Storage-, Cloud-, Netzwerk- oder Produktionsressourcen."}]}
---
# Datacenter-Netzarchitektur

> **Ziel:** Eine Datacenter-Fabric transportiert vor allem Ost-West-Verkehr zwischen Workloads, Storage, Plattformdiensten und Sicherheits-/Egressgrenzen. Sie muss Rack-, Pod- und Fabric-Ausfälle, Oversubscription, ECMP, Underlay/Overlay, MTU, Capacity, Energie und Betriebsgrenzen als überprüfbaren Servicevertrag verbinden.

## Zweck, Mental Model und Abhängigkeiten

Leaf-Spine ist eine flache Clos-ähnliche Topologie: Jeder Leaf verbindet sich mit jedem Spine; Workloads hängen typischerweise am Leaf/ToR. RFC 7938 behandelt BGP in großen Datacentern und nennt Leaf-and-Spine mit ECMP als gängigen Kontext. Das Muster ist kein Beweis, dass jede Workload, jedes Storageprotokoll oder jede Appliance gleich gut funktioniert.

~~~text
workload -- ToR/Leaf == ECMP == Spine == ECMP == Leaf/ToR -- workload
                     \__ underlay IP __/
       optional overlay: VTEP -> VXLAN/EVPN -> tenant VRF/VNI
       north-south: leaf/edge -> firewall/LB/WAN/Internet
~~~

Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0064](../03-network-foundations/16-routingtabellen-und-weiterleitung.md), [KB-0077](01-ospf-und-interne-konvergenz.md), [KB-0078](02-bgp-policy-und-route-reflection.md), [KB-0081](05-evpn-und-vxlan-fabrics.md) und [KB-0082](06-ecmp-und-bfd.md).

| Konzept | Designfrage |
|---|---|
| Underlay | Erreichen alle VTEPs/Leafs mit ECMP und definiertem MTU ihre Peers? |
| Overlay | Welche VNI/VRF/Policy trennt Tenant- und Serviceverkehr? |
| East-West | Welche Workload-/Storage-/AI-Flows dominieren, wie groß sind sie, wie reagieren sie auf Rehash? |
| North-South | Wo liegen Egress, Load Balancer, Firewall, WAN/Internet und ihr Rückweg? |
| Oversubscription | Wie steht Server-/Storagebandbreite zu Uplinks und Restkapazität nach Ausfall? |
| Failure Domain | Was teilt Rack, Leaf, Spine, Pod, Strom, Software, Controller, DCI oder Provider? |

## Architektur, Datenfluss und Implementierung

Ein normaler Workloadpfad klassifiziert zuerst Tenant/VRF/VNI, wählt lokal oder remote den Zielhost, kapselt bei Bedarf am VTEP und nutzt das Underlay-ECMP. Ein Datenpfad muss nicht den sichtbarsten physisch kürzesten Weg nehmen: Hash, Overlay, Service Insertion, Firewall/NAT, Load Balancer und Rückweg ändern ihn.

| Ebene | Vertrag | Nachweis |
|---|---|---|
| Rack/ToR | Server-/NIC-/storage ports, LAG, MTU, power/cooling | Port-, NIC-, error-, MTU- und failure map |
| Leaf | routing/VTEP, ACL/QoS, gateway/VRF, uplinks | FIB/VTEP/policy/data path per workload |
| Spine | einfacher ECMP transit, capacity, failure isolation | member/queue/drop and N-1 test |
| Edge/services | LB/firewall/WAN/DCI/Internet and return policy | stateful symmetric path and SLO |
| Control/management | BGP/EVPN, SoT, drift, OOB, telemetry | actual-vs-intent, audit, rollback |

Implementation ist Intent, nicht kopierte CLI: Rack-/Leaf-/Spine-ID, IP-/ASN-Plan, MTU, ECMP-/BFD-Policy, VTEP/EVPN/VRF/VNI, RT-/prefix policy, service chain, capacity envelope, change scope, owner und rollback werden versioniert. Prüfe NOS/ASIC-/buffer-/TCAM-/route-/MAC-/BFD-Grenzen, Hardwaremix, Lizenz, Firmware und Herstellerinteroperabilität aktuell vor Einsatz.

## Scalability, Performance, Reliability und Security

Oversubscription ist kein Fehler, sondern ein dokumentiertes Verhältnis zwischen potenzieller Downlinklast und Uplink-/Fabric-Kapazität. Es ist nur zulässig, wenn Flowprofile, SLO, N-1-Reserve und Congestionverhalten passen. AI-/Storage-/Backup-/Replication- oder East-West-Serviceverkehr kann andere Muster als typische Webworkloads zeigen; keine Transferannahme ohne Messung.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Rack langsam | ToR/NIC/LAG/leaf uplink/MTU/queue | flow, queue/drop, errors, packet size, reverse path |
| nur remote Workloads betroffen | VTEP/EVPN/VRF/ECMP/spine/RT policy | local vs remote path, control + data state |
| Spineausfall erzeugt Loss | fehlende N-1 capacity, rehash, microbursts | member timeline, survivor queues, application retry |
| Storage/AI Job bricht | congestion, PFC/RDMA policy, MTU, elephant flow | workload/service metrics plus fabric telemetry |
| Firewall/LB behind edge fails | asymmetric state, service insertion, scale | both directions, state, pool/capacity, rollback |

Security verlangt getrennte Management-/OOB-Zugriffe, VRF/ACL/Identity-/Workloadpolicy, Control-Plane-Härtung, Secrets/Audit, datensparsame Flowtelemetrie und klare DCI-/Providergrenzen. VXLAN/EVPN segmentiert logisch, verschlüsselt aber nicht automatisch. Ein Fabricdesign definiert daher Datenklasse, Kryptografie, Schlüssel- und Incidentverantwortung.

## Observability, Trade-offs und Entscheidungen

Beobachte Workload/tenant -> host/NIC -> rack/leaf -> VTEP/VRF -> BGP/EVPN -> ECMP/spine -> edge/service -> target/reverse path mit Zeit, Paketgröße, Queue/Drop, Change und Owner. Label oder Interface allein ist keine geschäftliche Identität.

**Staff** testet representative flows, MTU, failure timelines, tenant policy, N-1 capacity und incident runbooks. **Principal** standardisiert fabric intent, namespaces, capacitymodelle, hardware qualification und rollout/rollback. **Chief** entscheidet DC-/Cloud-/DCI-/supplierstrategie, Resilienz- und Energiebudget sowie Lifecycle/Exit.

Anti-Patterns: Spine/Leaf als magische Redundanz behandeln; Capacity mit Portzahl statt Flowprofil planen; Overlay grün als Datenpfadbeweis ausgeben; Storage/AI als „normale TCP-Last“ annehmen; globale RT/template changes ohne Canary; Managementnetze über Produktivpfad absichern; gemeinsame Strom-/Software-/Controller-Abhängigkeiten ausblenden.

## Production Checklist

- [ ] Rack/Pod/Leaf/Spine/edge/energy/fiber/management Failure-Domains und Owner sind geprüft.
- [ ] Underlay MTU, ECMP/BFD, routing/BGP und N-1 Capacity funktionieren für tatsächliche Flowklassen.
- [ ] Overlay VTEP/VNI/VRF/RT, gateways, ACL/service insertion und Rückweg sind nachgewiesen.
- [ ] Workload-, Storage-, AI-, Backup- und North-South-Profile sind im Capacity-/QoS-Modell enthalten.
- [ ] Queue/drop/ECN, link/NIC, route/FIB, BGP/EVPN, device resources und Service SLI sind korreliert.
- [ ] Management/OOB, RBAC, secrets, audit, backups, canary, rollback und Incident-Eskalation sind geprüft.

## Interviewfragen

### 1. Warum ist Leaf-Spine für Ost-West-Verkehr attraktiv?

**Antwort:** Es bietet viele gleichwertige Pfade über Spines und kann ECMP nutzen. Tatsächliche Leistung hängt jedoch von Hash, Capacity, MTU, Failure Domains und Workloadprofil ab.

### 2. Was bedeutet Oversubscription?

**Antwort:** Potenziell angebotene Downlinkbandbreite übersteigt Uplink/Fabric-Kapazität. Sie muss bewusst gegen Peaks, N-1, QoS und Service-SLO gerechnet werden.

### 3. Warum sind zwei Spines nicht automatisch hochverfügbar?

**Antwort:** Sie können Strom, Software, Control Plane, Controller, Gebäude oder Edgeabhängigkeit teilen. Failure-Diversität muss nachgewiesen werden.

### 4. Wie unterscheidest du Fabric- und Workloadfehler?

**Antwort:** Ich korreliere End-to-End-Flow, NIC/host, leaf/spine/VTEP, route/FIB/queue, target und Rückweg mit Service-SLI und Changezeit.

### 5. Wann braucht man Overlay?

**Antwort:** Wenn Tenant-/L2-/L3-Servicegrenzen über das geroutete Underlay benötigt werden. Es ist kein Selbstzweck und ersetzt keine Securitypolicy.

### 6. Welche Daten fehlen oft in Capacityplänen?

**Antwort:** Elephant flows, Storage-/Backup-/AI-Phasen, microbursts, service insertion, N-1-/rehash-Wirkung, MTU und Rückweg.

## Praktische Labs

~~~python
racks = {"rack-a": 200, "rack-b": 200}
spines = {"spine-a": 400, "spine-b": 400}
survivor = sum(v for k, v in spines.items() if k != "spine-a")
assert survivor >= max(racks.values())
print("Synthetic N-1 capacity assumption only; utilization and flow distribution remain unproven.")
~~~

**Labgrenze:** Nur lokales Modell; keine Netzwerk-, Cloud-, Storage- oder Produktionsressourcen. **Gegenprobe:** Senke Survivor-Kapazität und erläutere, warum die Zahl keine Queue-/Hash-/Trafficverteilung beweist.

## Dependencies, Cross-References und Quellen

1. [RFC 7938: BGP in Large-Scale Data Centers](https://datatracker.ietf.org/doc/html/rfc7938), abgerufen 2026-09-16. BGP-, ECMP- und Leaf-Spine-Kontext.
2. [RFC 7348: VXLAN](https://datatracker.ietf.org/doc/html/rfc7348), abgerufen 2026-09-16. Overlay-/ECMP-/MTU-Kontext.
3. [RFC 8365: EVPN for NVO3](https://datatracker.ietf.org/doc/html/rfc8365), abgerufen 2026-09-16. EVPN-/IP-Overlay-Kontext.
4. [RFC 8670: BGP Prefix Segment in Large-Scale Data Centers](https://www.rfc-editor.org/info/rfc8670/), abgerufen 2026-09-16. Leaf/Spine/ToR- und ECMP-Kontext.

Zeitabhängige Aussagen über Switch-/NIC-/DPU-/ASIC-/Buffer-/RDMA-/GPU-Fabric, NOS, Controller, Lizenz, Energie, Cooling, Cloud/DCI und Provider müssen vor konkreter Umsetzung gegen aktuelle Hersteller-, Facility-, Sicherheits- und Vertragsdaten geprüft werden. Weiter mit [KB-0085](09-sdn-und-campus-fabric.md), [KB-0086](10-netzwerkautomation-mit-ansible.md), [KB-0562](../23-security-identity/26-security-incident-response.md) und [KB-0720](../30-architect-practice/44-portfolioevidenz-und-reifemodelle.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| RIFT/BGP-LS und Intent-Fabric | adopting je Fabric | Interoperabilität, control-plane scale, observability und rollback prüfen. |
| DPU/SmartNIC und host-aware Telemetrie | adopting | Trust boundary, offload, lifecycle, cost und incident evidence bewerten. |
| AI-/GPU- und RDMA-Fabrics | spezialisiert und workloadabhängig | Congestion, lossless assumptions, topology, capacity und Betriebsfähigkeit messen. |

Ein Pilot akzeptiert eine Datacenter-Fabric-Innovation erst, wenn Rack-/Leaf-/Spine-/Underlay-/Overlay-/VTEP-/VRF-/ECMP-/MTU-/Queue-/Edge-/Rückwegsemantik, Oversubscription, Failure-Diversität, Workload-/Storage-/Service-SLO, Security/Privacy, Observability, Capacity/Cost, Owner, Change und Rollback nachgewiesen sind.
