---
{"id": "KB-0050", "title": "Ethernet und MAC-Weiterleitung", "domain": "03", "sequence": 2, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0039", "concepts": ["Linux Netzwerkstack", "Interface", "Paketpfad"], "needed_for": "understanding"}, {"id": "KB-0046", "concepts": ["Hypothesentest", "Performance-Debugging", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0049", "concepts": ["OSI/TCP-IP", "Kapselung", "Link-Hops"], "needed_for": "both"}], "related": ["KB-0051", "KB-0052", "KB-0053", "KB-0054", "KB-0117", "KB-0562", "KB-0720"], "applies": ["KB-0117", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein rein lokales, synthetisches FDB-Lab modelliert Learning, Known-Unicast, Unknown-Unicast, Broadcast und MAC-Move ohne ein Interface zu verändern.", "rationale": "Es erzeugt keinerlei Ethernetverkehr, ändert keine Bridge/VLAN/MTU/Route und verwendet keine fremden oder Produktionsnetze."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein L2/L3-Grenzdesign definiert Broadcast-Domäne, VLAN-/Segmentgrenzen, MTU, virtuelle Switches, Routing, Redundanz, Telemetrie und Sicherheitskontrollen.", "rationale": "MAC-Weiterleitung ist eine lokale Zustandsmaschine, keine globale Identitäts- oder Mandantenkontrolle."}, "STAFF-TARGET": {"active": true, "scope": "Teams erhalten Standardprüfungen für FDB-/Port-/VLAN-/MTU-/Duplex-/Loop- und MAC-Move-Fehler sowie sichere Eskalationsartefakte.", "rationale": "Dadurch werden breitflächige Layer-2-Änderungen durch gezielte, zeitlich korrelierte Evidenz ersetzt."}, "CHIEF-TARGET": {"active": true, "scope": "Die Netzstrategie legt L2-/L3-Grenzen, Campus/DC/Cloud-Virtualisierung, Overlay-Ownership, Hardware-Lifecycle, Automatisierung, Security und Kostenallokation fest.", "rationale": "Broadcast- und Failure-Domains sowie Betriebsfähigkeit sind Portfolioentscheidungen, nicht nur Switchkonfiguration."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "IEEE-802.3/802.1Q-Details, STP/RSTP/MST, LACP, EVPN/VXLAN, MACsec, NIC offload, DPU/SmartNIC, PFC and packet-level forensics sind Spezialistentiefe.", "rationale": "Die Kernzielrolle bewertet Auswirkungen und Eskalationsdaten; tiefes Switching- und Hardwaretuning benötigt autorisierte Spezialisten."}}, "lab_validation": [{"lab_id": "KB-0050-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplantes lokales Python-Sandbox-Lab mit synthetischer Forwarding Database", "evidence": "FDB-Algorithmus, MAC-Move-Gegenprobe, keine Netzwerkmutation und Cleanup fachlich geprüft.", "limitations": "Nicht ausgeführt; kein Switch, keine Bridge, kein Interface, keine VLAN-, MTU-, Duplex-, FDB- oder Routingkonfiguration und kein Produktionsnetz wurden berührt."}]}
---
# Ethernet und MAC-Weiterleitung

> **Ziel:** Ethernet funktioniert nicht durch eine globale Tabelle „MAC zu IP“. Ein Switch lernt Quell-MACs an Ports und entscheidet pro eingehendem Frame, ob er gezielt weiterleitet, innerhalb einer Broadcast-Domäne flutet oder verwirft. Genau dieses lokale Zustandsmodell erklärt viele reale Ausfälle besser als eine IP- oder Anwendungsfehlermeldung.

## Purpose, Definition und Scope

Ethernet ist eine Link-Layer-Technologie für die lokale Übertragung von Frames. Ein Frame trägt lokale Quell- und Ziel-MAC-Adressen, ein Typ-/Längenfeld und Nutzdaten. Switches führen eine Forwarding Database (FDB, oft MAC-Tabelle) und lernen aus der **Quell**-MAC eines eingehenden Frames, über welchen Port diese MAC aktuell erreichbar ist. Für eine bekannte Ziel-MAC leiten sie gezielt weiter; für Broadcast und unbekannte Unicast-Ziele fluten sie innerhalb des erlaubten L2-Segments.

Dieses Kapitel behandelt:

- MAC-Adressen, Ethernet-Frames, MTU, Kapselung und Link-Hop-Grenze;
- FDB Learning, Aging, MAC Move, Known-/Unknown-Unicast und Broadcast;
- Broadcast-Domänen, VLAN-/L3-Grenzen, Loops, Duplex- und MTU-Fehler als Analysefälle;
- Linux Bridge als Referenz für ein softwarebasiertes Switchingmodell;
- Security, Governance, Observability, Cost und Architekturentscheidungen.

Nicht behandelt werden detaillierte IEEE-Konfiguration, STP/LACP, ARP/NDP, IP-Routing, EVPN/VXLAN, Wi-Fi oder Packet-Capture-Betrieb. Diese kommen in späteren Dateien. Nach der Bearbeitung kannst du:

1. einen Ethernetframe und die Weiterleitungsentscheidung eines Switches für einen konkreten Portpfad erklären;
2. MAC-Adresse, IP-Adresse, Port, VLAN und Workloadidentität sauber auseinanderhalten;
3. FDB-/MAC-Move-/Flooding-/Loop-/Duplex-/MTU-Hypothesen mit geeigneten Beobachtungen prüfen;
4. L2-/L3-/Broadcast-Grenzen anhand von Failure Domain, Security, Skalierung und Betrieb begründen;
5. für eine Plattform sichere, reversible Diagnose- und Changeprozesse festlegen.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Ethernetframe, MAC-Learning, FDB und Broadcast-Domänen werden technisch und quellengebunden erklärt. |
| HANDS-ON-TARGET | Ein synthetisches Local-Only-FDB-Modell zeigt Entscheidungen und MAC Moves ohne Interfacezugriff. |
| ARCHITECT-TARGET | Segmentierung, MTU, Routinggrenze, virtuelle Switches, Security und Observability bilden einen L2/L3-Vertrag. |
| STAFF/PRINCIPAL | Teams erhalten sichere Checklisten für port-/FDB-/VLAN-/Loop- und MTU-Fehler. |
| CHIEF | Die Unternehmensstrategie steuert Failure Domains, Hardware-/Overlayportfolio und Operationsmodell. |

## Mental Model: eine zeitgebundene lokale Lerntabelle

Eine FDB ist kein Inventar aller Geräte im Unternehmen. Sie ist eine lokale, alternde Hypothese eines Switches:

```text
incoming frame on port P:
  source MAC S -> learn or refresh (S => P, timestamp)
  destination MAC D ->
    D known on another eligible port: forward to that port
    D known on same port: do not forward back
    D unknown: flood to eligible ports in same VLAN/segment
    D broadcast/multicast: flood or apply explicit multicast policy
```

Ein MAC Move bedeutet, dass dieselbe Quell-MAC innerhalb kurzer Zeit über einen anderen Port sichtbar wird. Das kann legitim sein, etwa bei VM-Migration, Failover oder Linkwechsel. Es kann aber auch auf Loop, falsches Bonding, spoofing, Hostfehler oder falsche virtuelle Switch-/Overlaykonfiguration hindeuten. Der Unterschied wird mit Zeitachse, Change Context, VLAN, Portzustand und End-to-End-Auswirkung bewertet.

## Prerequisites und Dependencies

| ID | Art | Nutzen |
|---|---|---|
| [KB-0039](../02-linux-systems/09-linux-netzwerkstack-und-paketpfade.md) | Verständnis | Linux-Interface-/Paketpfad und Hostpolicy bilden die lokale Perspektive. |
| [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Anwendung und Lab | Hypothesen, Gegenproben und sichere Messung sind für Netzprobleme nötig. |
| [KB-0049](01-osi-und-tcp-ip-als-analysemodelle.md) | Anwendung und Lab | Kapselung und Link-Hop-Grenze ordnen Ethernet in den End-to-End-Pfad ein. |

KB-0051 vertieft Switching, KB-0052/0053 IP und Routing, KB-0054 Namensauflösung. VLAN, Overlay und Enterprise Fabric folgen als spätere Kanonstellen.

## Core Concepts und Mechanismen

### MAC ist lokaler Link-Layer-Locator, keine Identität

Eine MAC-Adresse ist für Layer-2-Weiterleitung relevant. Sie ist weder ein Mandant, eine menschliche Identität, noch allein ein dauerhaftes Securityprincipal. MACs können virtuell erzeugt, durch einen Hypervisor/Containerpfad sichtbar gemacht, verändert oder gespooft werden. Ein Sicherheitsmodell kann MAC-basierte Kontrollen als zusätzliche Signalquelle nutzen, darf aber nicht seine Vertrauensentscheidung allein daran hängen.

| Kennung | Bedeutung | Nicht verwechseln mit |
|---|---|---|
| MAC | Link-Layer Quell-/Zielkontext im lokalen Segment | globaler Service-/User-/Tenantidentität. |
| IP | Netz-Locator und Routingkontext | MAC oder Authentisierung. |
| TCP/UDP Port | Transportendpoint | Firewallfreigabe oder Anwendungsberechtigung. |
| VLAN/Segment | L2- und Policy-/Broadcastbereich je Design | universeller Security-Mandant. |
| DNSname | Discovery-/Namenssemantik | garantierter aktueller L2-/IP-Pfad. |
| Workload Identity | authz-relevanter Principal | Source MAC/IP/Port. |

### Frame, Type, Payload und MTU

RFC 894 beschreibt die Kapselung von IP-Datagrammen in Ethernetframes und den EtherType-Kontext für IPv4. Moderne Ethernetumgebungen müssen zusätzlich konkrete IEEE-/VLAN-/Provider- und Hardware-/NIC-Spezifikationen prüfen. Für Architekturdiagnosen ist wichtig:

```text
frame = destination_mac + source_mac + type_or_length + payload + integrity/link fields
payload capacity is constrained by the active link/encapsulation MTU model
```

Eine verbreitete IP-MTU-Annahme von 1500 Bytes ist kein universelles Gesetz. VLAN-Tags, Tunnel, VPN, overlays, NIC/driver offloads, provider networks and different link types consume or change effective headroom. Eine größere MTU kann Durchsatz/CPU in passenden Pfaden verbessern, aber sie vergrößert die notwendige End-to-End-Kompatibilitäts- und Failureanalyse. „Jumbo Frames aktivieren“ ohne Pfadmatrix ist ein Anti-Pattern.

### FDB Learning und Forwarding

Ein Switch lernt die Quelladresse, nicht das Ziel. Das ist entscheidend bei der Fehlersuche:

1. Ein Frame von Host A kommt auf Port 1 mit Quelle `A-MAC` und Ziel `B-MAC`.
2. Der Switch aktualisiert FDB: `A-MAC -> Port 1`.
3. Falls `B-MAC -> Port 7` bekannt ist, sendet er gezielt zu Port 7.
4. Falls B unbekannt ist, flutet der Switch innerhalb des zulässigen Segments zu geeigneten Ports außer Port 1.
5. Antwortet B, lernt der Switch `B-MAC -> Port 7`; spätere Kommunikation kann gezielt laufen.

| FDB-Zustand | Verhalten | Diagnosefrage |
|---|---|---|
| Known unicast | gezielte Weiterleitung zu einem Port | passt Port/VLAN/age zur erwarteten Position? |
| Unknown unicast | Flooding im Segment | warum ist der Zielpfad noch unbekannt oder gealtert? |
| Broadcast | Segmentweite Verteilung nach Policy | ist die Broadcast-Domäne begrenzt und erwartbar? |
| Multicast | abhängig von Snooping/Policy/Link | ist Membership/Replication dokumentiert? |
| MAC move | Eintrag wechselt Port | legitime Migration oder Loop/Spoof/Bondingproblem? |
| Aged out | Eintrag läuft aus | ist Traffic selten, Link down oder Aging ungewöhnlich? |

### Broadcast-Domänen, VLAN und L3-Grenze

Broadcast wird nicht vom Internet geroutet wie normales Unicast. Ein Segment-/VLAN-Design bestimmt, wo bestimmte Broadcast-/Unknown-Unicast-Effekte wirken. L3-Routing trennt normalerweise Broadcast-Domänen und schafft einen klaren Ort für Subnet, Policy, ACL, NAT oder Firewallentscheidung. Das heißt nicht, dass „mehr VLANs immer sicherer“ sind: sehr kleine Segmente erhöhen Routing-/Policy-/Operationskomplexität; sehr große Segmente erhöhen Blast Radius, Learning-/Flooding-/Troubleshootingkosten.

Eine Architekturentscheidung dokumentiert mindestens:

- Domainpurpose und Daten-/Trustklasse;
- erwartete Endpointdichte und Broadcast-/multicast-/unknown traffic;
- L2-/L3-Grenze, routing/security owner and failure domain;
- VLAN/segment identification, allowed trunk/access semantics;
- MTU/encapsulation path;
- virtualization/overlay behavior;
- telemetry and port/FDB/MAC move escalation;
- change, rollback and exception lifecycle.

### Duplex, Autonegotiation und physische Fehler

Full Duplex bedeutet gleichzeitiges Senden und Empfangen. Half Duplex benötigt ein anderes Collision-/Access-Verhalten. Ein Duplexmismatch kann zu Fehlern, Retries, geringerem Durchsatz und hoher Latenz führen, ohne dass die Anwendung einen klaren „Link down“-Status sieht. Moderne Switch-/NIC-/Medienpfade sind häufig Full Duplex, aber Autonegotiation-/Media-/Legacy-/Converter-/Portkonflikte bleiben reale Fehlerhypothesen.

Prüfe Zeitkorrelation zwischen Port Speed/Duplex/Errors, FCS-/CRC-/alignment-/drop counters, retransmissions, application p99 and change event. Eine hohe TCP-Retransmission kann auch von congestion, remote overload or different path behavior stammen; sie beweist keinen Duplexfehler.

### Loops und Kontrollprotokolle

Ein Layer-2-Loop kann Broadcast/Unknown-Unicast und FDB-Learning verstärken und damit eine große Failure Domain erzeugen. Loop-prevention protocols and protections exist, but their configuration and lifecycle are separate specialist topics. In einem Incident wird kein Link „zur Probe“ umgesteckt oder eine Schutzfunktion abgeschaltet. Erst Port-, topology-, LAG-/bond-, change- and traffic-evidence sichern; dann mit Network Owner einen begrenzten, reversiblen Plan ausführen.

## Architecture und Data Flow: virtuelle Switches für eine Platform Node

Der Fall ist rein didaktisch.

```text
workload vNIC
  -> virtual switch / bridge FDB
  -> host NIC / access or tunnel encapsulation
  -> physical or virtual L2 next hop
  -> L3 gateway / routing boundary
  -> service segment

control and safety:
  workload identity + network policy
  node/port/VLAN/overlay inventory
  FDB, MAC-move, MTU, error and flow telemetry
```

Die vNIC kann eine MAC präsentieren; der virtuelle Switch lernt oder verwaltet Forwardingzustand. Ein Hypervisor, bridge, overlay or cloud fabric may implement parts in software/hardware. Diese Implementierung verändert nicht die Kernfrage: Welches L2-Segment, welche FDB-/policy-/MTU-/routinggrenzerelation und welcher owner control the actual path?

A container network namespace, an interface pair and a Linux bridge can introduce additional hops and MAC views. Neither a container nor a MAC can be used as a stable enterprise security identity. The runtime policy and workload IAM remain required.

## Protocols, Standards und Tools

| Element | Verwendung | Grenze |
|---|---|---|
| Ethernet / IEEE 802.3 | Frame and link behavior | normative IEEE details/product support are checked for target hardware. |
| IEEE 802.1Q/VLAN | segmentation/tagging context | later canonical VLAN treatment; not a one-line security solution. |
| RFC 894 | IP over Ethernet encapsulation and historical MTU/frame context | not a full modern Ethernet feature matrix. |
| Linux bridge | software bridge / FDB / VLAN filtering reference | implementation-specific and not a production config recommendation. |
| `bridge(8)` | bridge/FDB/VLAN inspection and control tool | read-only use in approved scope; commands can mutate state. |
| `ip-link(8)` | link attribute/interface context | current link state alone does not prove packet delivery. |
| NIC/switch counters | errors, drops, speed, duplex, FDB/MAC events | vendor semantics and offloads must be known. |
| packet capture / eBPF | bounded specialist evidence | privacy, permissions, overhead and retention constraints. |

No tool output is self-interpreting. A switch FDB may be aged, virtualized, incomplete by scope, VLAN-filtered or offloaded. A packet trace is local evidence with a capture point and time window.

## Konfiguration und Implementierung: L2/L3-Vertrag

```yaml
segment_contract:
  name: platform-workload-segment
  purpose: "approved east-west workload connectivity"
  l2_boundary:
    vlan_or_virtual_segment: declared
    expected_endpoint_classes: [workload, gateway]
    broadcast_scope: bounded
    unknown_unicast_policy: documented
  l3_boundary:
    gateway_owner: network-platform
    subnet_and_route_policy: versioned
    egress_controls: explicit
  mtu:
    service_mtu: declared
    encapsulation_overhead: measured_per_path
    validation: representative_payload_and_failure_test
  security:
    workload_identity: required
    mac_address: "locator-not-principal"
    port_or_vnic_policy: least-privilege
  observability:
    fields: [segment, port_class, fdb_event_class, mac_move_class, link_error_class, mtu_symptom]
    prohibit: [customer_payload, secrets, raw_unbounded_mac_inventory]
  change:
    owner: network-platform
    canary: required
    rollback: previous_segment_policy
```

A contract does not require every workload team to configure switching. It makes the networking platform responsible for documented interfaces and makes app/platform owners able to tell when their layer of the path is healthy.

## Scalability und Performance

### Capacity model

```text
l2_pressure =
  active_endpoint_count
+ MAC_learning_churn
+ broadcast_and_unknown_unicast_rate
+ per_port_frame_rate
+ encapsulation_and_replication_work
+ FDB/TCAM/hardware_or_virtual_switch_limits
```

The exact units, limits and bottlenecks are device-, virtual-switch-, cloud-fabric- and feature-specific. Effective capacity also depends on packet size distribution, buffers, CPU/offload, tunnel overhead, multicast behavior, port speed and downstream congestion. Architecture uses a growth model and a failure model, not a vendor maximum-frame-rate claim.

### MTU and overhead

A larger application payload might fail while a small health check passes. This can result from effective MTU, tunnel overhead, PMTUD/ICMP behavior, device configuration or proxy buffering. The diagnosis captures:

- source/destination segment and encapsulation path;
- inner vs outer packet/MTU budget;
- payload size class, transport/TLS/QUIC framing;
- time, link/NIC counters, drops/errors, retransmissions;
- application response and safe counterexample.

A platform does not apply global MTU changes during an incident without a full path, compatibility and rollback plan.

### FDB churn and noisy behavior

High MAC churn can consume control-plane attention, cause flooding or indicate an unstable topology. But a MAC move is not automatically malicious. Correlate it with planned migrations, active/standby transitions, LAG/bond changes, hypervisor events, port flaps and segment scope. Use rate-limited alerts to avoid making a transient valid migration into an operations storm.

## Reliability und Failure Modes

| Failure | Signal | Response |
|---|---|---|
| Unknown-unicast flooding | elevated flood/segment load, low FDB hit confidence | inspect learning/aging/move, segment scope and endpoint behavior. |
| MAC flapping/move | same MAC alternates port/vNIC | correlate migration/failover/bond/loop/spoofing; contain with owner plan. |
| L2 loop | broadcast/unknown traffic, CPU/port saturation, FDB instability | preserve evidence, follow loop-protection/incident process, avoid ad hoc link changes. |
| Duplex/speed mismatch | interface errors/drops/retransmits/p99 | verify both ends/media/autoneg, compare counter timeline. |
| MTU mismatch | small works, larger payload stalls/fails | map complete path and overhead; controlled payload validation. |
| VLAN mismatch | expected endpoint unreachable or wrong segment | verify access/trunk/virtual segment/route boundary through approved inventory. |
| FDB aging/stale entry | intermittent initial loss or wrong delivery assumptions | validate traffic pattern/aging/hardware/virtualization behavior. |
| NIC/offload anomaly | host view conflicts with wire/device view | check driver/firmware/offload and capture-point limitations with specialist. |
| Broadcast storm | large segment impact, packet loss and control degradation | protect/fail isolate under plan, root-cause topology/traffic. |
| Address spoofing | unexpected source MAC/policy anomaly | use port/vNIC controls, identity/authz, audit and investigation. |

## Security, Governance und Compliance

MAC and VLAN controls can reduce accidental exposure and limit segments, but they are not complete zero-trust controls. The security posture layers them with workload identity, network policy, TLS, application authorization, endpoint hardening, logging and incident response.

| Asset / Risk | Control | Evidence |
|---|---|---|
| east-west data | explicit segments/routing/egress + TLS + workload authz | policy review and allowed/denied flow tests. |
| unauthorized device/MAC | port/vNIC policy, inventory, anomaly detection | onboarding/move audit, expected change record. |
| broadcast blast radius | bounded L2 domains and loop protections | segment design and failure test. |
| virtual fabric control | least privilege on network APIs/controllers | RBAC, change log, segregation of duties. |
| diagnostic data | capture scope, redaction, short retention | approved capture plan/audit. |
| operational integrity | versioned configuration, canary, rollback | change evidence and post-check. |

Compliance obligations depend on what data crosses the network, jurisdiction, contract and organization. Link encryption, MAC filtering or segmentation alone do not assert lawful processing or tenant authorization.

## Observability und Troubleshooting

### Minimum telemetry

- port/vNIC administrative and operational state, speed/duplex where applicable;
- interface/bridge error, drop and counter semantics;
- FDB entry/move/aging event class and segment scope;
- broadcast, multicast and unknown-unicast rates where supported;
- MTU/config revision/encapsulation class;
- end-to-end flow/transport/application SLO correlated by time;
- topology/change/migration/failover event;
- policy allow/deny class without sensitive payload.

### Diagnosis order

1. Confirm service and flow scope, expected source/destination segment, IP family, transport and business impact.
2. Verify link/interface operational state and relevant counter trends at the authorized observation points.
3. Verify L2 segment/VLAN/virtual switch and expected FDB behavior; do not assume a MAC inventory is global.
4. Check MAC move, migration, bond/LAG, port flap and topology changes in the same time window.
5. Compare known-good and failing flow/payload size; evaluate MTU only with complete path/encapsulation evidence.
6. Separate L2 success from L3 route, transport/TLS, application authorization and remote capacity.
7. Preserve limited evidence; make any link/VLAN/FDB change through change control, owner, canary and rollback.
8. Document root cause, mitigation, security impact, capacity effect and recheck trigger.

## Cost und FinOps

Cost drivers include switch/NIC/optic lifecycle, port capacity, virtual fabric/controller licensing, cloud data path/egress, overlays, telemetry, packet retention, support contracts, failure impact and engineering time:

```text
l2_total_cost =
  ports_and_hardware
+ fabric_or_cloud_network_service
+ optics_cabling_and_power
+ virtual_switch_cpu_offload
+ monitoring_and_capture_retention
+ change_and_incident_operations
+ blast_radius_and_downtime_risk
```

A large flat L2 segment may appear cheaper until incidents, broadcast/unknown traffic, audit scope and migration complexity grow. Very granular segmentation can increase routing/control-plane, address, policy and operations cost. FinOps compares cost per secure, SLO-conformant flow plus resilience and exit cost, not price per port alone.

## Trade-offs, Alternativen und Anti-Patterns

| Choice | Useful when | Trade-off |
|---|---|---|
| smaller L2 domain, routed boundary | reduced broadcast/failure scope, clear security handoff | more routing/policy/address design. |
| larger L2 domain | legitimate mobility/legacy need with strong operations | larger blast radius and FDB/broadcast complexity. |
| hardware switching | predictable high-rate physical workload | lifecycle, vendor, capacity and configuration management. |
| software/virtual bridge | host/container/VM integration | CPU/offload/observability and host lifecycle. |
| standard MTU | heterogeneous ecosystem | possible overhead/CPU inefficiency in special paths. |
| larger MTU | verified end-to-end path and payload benefit | strict compatibility and failure testing. |
| MAC-based control | additional local signal | spoofing/virtualization; never sole identity. |
| overlay/EVPN fabric | scale/mobility/segmentation need | new encapsulation/control-plane/operational dependencies. |

Anti-Patterns:

- Treat an FDB as a global source of truth or a MAC as workload identity.
- Increase L2 scope to avoid routing/policy work without a failure-domain analysis.
- Use `bridge`/switch commands on production to “see what happens”.
- Change MTU only on application nodes, one switch or one tunnel endpoint.
- Explain any retransmission by duplex, any MAC move by attack, or any broadcast by a loop without counterevidence.
- Disable loop protections or port security during an incident.
- Use broad VLAN access as a substitute for service identity and TLS.
- Retain raw packet data indefinitely or expose MAC/path inventories unnecessarily.

## Staff-, Principal- und Chief-Level Decisions

### Staff: flow-level evidence and safe mitigation

Staff records expected segment, endpoint class, FDB behavior, transport/SLO, dependency and data class. The incident artifact contains port/vNIC/FDB/error/MAC-move time correlation, a counterexample, the least invasive mitigation and a rollback. Staff avoids changes that expand an L2 domain or relax a protection merely because they reduce immediate symptoms.

### Principal: L2/L3 product interface

Principal defines where teams consume connectivity rather than manage links: segment classes, IP/routing gateways, MTU profiles, virtual switch/overlay support, access/trunk rules, telemetry, FDB/MAC-move escalation, hardware/software support matrix and automated change validation. Principal consolidates repeated Layer-2 exceptions into a platform decision or a migration plan.

### Chief: fabric and operating model

Chief selects the portfolio of campus, data center, cloud and edge fabrics, with boundaries between L2, L3 and overlays. Decisions include vendor/standards strategy, automation, hardware refresh, security architecture, observability data policy, outage/DR topology, cost allocation, skills and exit. The metric is safe, recoverable and economical connectivity, not the number of VLANs or the nominal port speed.

## Production Checklist

- [ ] Segment purpose, trust/data class, endpoint classes, L2/L3 boundary and owners are declared.
- [ ] MTU and encapsulation budget are validated across the real supported path and representative payload.
- [ ] FDB/MAC learning, aging, MAC move and unknown/broadcast behavior have expected thresholds and escalation.
- [ ] Link/vNIC state, speed/duplex/error counters and topology/migration events are observable and time-correlated.
- [ ] VLAN/virtual segment/access/trunk/routing policies are versioned, reviewed and least privilege.
- [ ] Loop prevention/detection and port/vNIC security remain enabled; exceptions have approval, TTL and rollback.
- [ ] MAC is not used as the sole workload/tenant identity; TLS and workload/application authorization are present.
- [ ] Changes have blast radius, canary, backout, validation and incident contact ownership.
- [ ] Packet/FDB diagnostics follow authorization, data minimization, retention and audit requirements.
- [ ] Capacity plan contains endpoint growth, FDB/churn, broadcast/unknown rate, port/CPU/offload and failure model.

## Interviewfragen mit Antwortleitfäden

### 1. How does a switch learn where to send a frame?

It observes the source MAC of an incoming frame and associates it with the ingress port in a local, aging FDB. For a known destination it forwards to the mapped eligible port; otherwise it floods within the segment. The key insight: destination MAC is looked up; source MAC is learned.

### 2. Why is a MAC address not a security identity?

It is a local link-layer locator that can be virtualized, moved or spoofed and may not be visible end-to-end. Security needs workload identity, TLS, authorization, segmentation, endpoint controls and audit. MAC policy can be defense in depth, not the main principal.

### 3. What can an unknown-unicast flood mean?

The destination MAC is absent/stale/aged in the local FDB, or the path/segment/virtualization behavior differs from expectation. I examine learning, aging, MAC moves, endpoint traffic, VLAN and hardware/software context. I do not immediately infer a loop or attack.

### 4. How would you investigate a MAC move alert?

I correlate the MAC, ports/vNICs, VLAN/segment, timestamps, VM/container migration, bond/LAG state, link flaps, failover, topology and policy events. A legitimate move is handled differently from rapid flapping that indicates loop, split-brain or spoofing. Mitigation is owner-controlled and reversible.

### 5. Why can small requests work while large requests fail?

Payload size, MTU/encapsulation, fragmentation/PMTUD, tunnel or proxy buffers can change the path behavior. I compare controlled size classes along the same supported path and correlate transport/port errors. A successful ping does not disprove an MTU issue.

### 6. What is a duplex mismatch?

Endpoints disagree about link duplex/access behavior, potentially causing errors, drops, retransmissions and poor throughput. I need both-end configuration and port counter/time evidence. Similar symptoms can arise elsewhere, so I avoid diagnosis from one TCP metric.

### 7. Where should L2 end and L3 begin?

At a documented boundary based on broadcast/failure domain, mobility, security/routing policy, latency, scale, operations and legacy constraints. The decision gives each boundary an owner and recovery model. Neither a huge flat L2 nor maximal segmentation is universally correct.

### 8. How do virtual switches change the model?

They implement forwarding and FDB-like state in the host/hypervisor/fabric, possibly with overlays/offload. The same questions remain—what segment, MAC, forwarding state, MTU and policy apply—but observability and ownership cross runtime, host and network teams.

## Praktisches Lab: synthetische FDB ohne Netzwerkkonfiguration

> **Status:** `reviewed_only`. This lab uses only a temporary local Python file and in-memory table. It emits no Ethernet frames and does not inspect, create or modify a bridge, NIC, VLAN, route, MTU or FDB.

### Goal and hypotheses

**Hypothesis A:** Source MAC learning and destination lookup are separate operations.  
**Hypothesis B:** An unknown destination floods only to eligible ports in the same synthetic segment.  
**Negative probe:** A MAC move changes the local FDB mapping; it does not prove an attack without context.

### Ablauf

```bash
set -euo pipefail
work_dir="$(mktemp -d "${TMPDIR:-/tmp}/kb0050-XXXXXX")"
trap 'rm -rf -- "$work_dir"' EXIT

cat > "$work_dir/fdb_model.py" <<'PY'
fdb = {}
ports = {"p1", "p2", "p3"}

def forward(ingress, source, destination):
    fdb[source] = ingress
    if destination == "ff:ff:ff:ff:ff:ff":
        action = sorted(ports - {ingress})
    elif destination in fdb and fdb[destination] != ingress:
        action = [fdb[destination]]
    elif destination in fdb:
        action = []
    else:
        action = sorted(ports - {ingress})
    print({"in": ingress, "src": source, "dst": destination,
           "fdb": dict(sorted(fdb.items())), "egress": action})

forward("p1", "02:00:00:00:00:01", "02:00:00:00:00:02")
forward("p2", "02:00:00:00:00:02", "02:00:00:00:00:01")
forward("p3", "02:00:00:00:00:01", "ff:ff:ff:ff:ff:ff")
PY

python3 "$work_dir/fdb_model.py"
```

### Auswertung, Gegenproben und Cleanup

1. The first frame learns source A on `p1` and floods the unknown destination B to eligible synthetic ports.
2. The second frame learns B on `p2` and forwards to known A on `p1`.
3. The third frame moves A from `p1` to `p3` and broadcasts to `p1`/`p2`. This is a model of a possible MAC move, not evidence of an actual host, switch or attack.
4. **Negative probe:** There is no VLAN, aging timer, STP, LAG, packet loss, speed/duplex, MTU or real link in this model. Do not generalize its output into a production switch decision.
5. If `python3` is absent, install nothing and do not replace it with external tests. The `trap` removes only the newly created temporary directory.

## Dependencies und Cross-References

- [KB-0039: Linux-Netzwerkstack und Paketpfade](../02-linux-systems/09-linux-netzwerkstack-und-paketpfade.md) for host-side context.
- [KB-0046: Linux-Fehlersuche und Performance-Debugging](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) for diagnostic method.
- [KB-0049: OSI und TCP-IP als Analysemodelle](01-osi-und-tcp-ip-als-analysemodelle.md) for encapsulation and end-to-end layering.
- KB-0051 continues switching control/forwarding; KB-0052 and KB-0053 develop IP and routing.
- KB-0117 and KB-0562 later use L2/L3 contracts for cloud/platform architecture.
- [KB-0720: Portfolioevidenz und Reifemodelle](../30-architect-practice/44-portfolioevidenz-und-reifemodelle.md) collects design, test and operating evidence.

## Quellen und Aktualitätsnotizen

| Source | Use | Stand |
|---|---|---|
| Dateikatalog | Scope and sequence. | 2026-09-14 |
| [RFC 894](https://www.rfc-editor.org/rfc/rfc894) | IP over Ethernet encapsulation, EtherType and historical payload context. | IETF/RFC Editor, accessed 2026-09-16 |
| [RFC 8200](https://www.rfc-editor.org/rfc/rfc8200) | IPv6 packet/MTU context at the upper boundary. | IETF/RFC Editor, accessed 2026-09-16 |
| [Linux Ethernet Bridging](https://docs.kernel.org/networking/bridge.html) | software bridge, FDB and VLAN-filtering context. | Linux Kernel Documentation, accessed 2026-09-16 |
| [`bridge(8)`](https://man7.org/linux/man-pages/man8/bridge.8.html) | bridge/FDB/VLAN tool and inspection context. | Linux man-pages, accessed 2026-09-16 |
| [`ip-link(8)`](https://man7.org/linux/man-pages/man8/ip-link.8.html) | link attributes/interface context. | Linux man-pages, accessed 2026-09-16 |
| [KB-0049](01-osi-und-tcp-ip-als-analysemodelle.md) | layer and encapsulation prerequisite. | 2026-09-16 |

IEEE revisions, vendor switch behavior, FDB/TCAM capacities, NIC/firmware/offload, VLAN/overlay/MTU implementation, cloud virtual networking, telemetry fields and prices are time- and environment-dependent. Validate them on the exact fabric, operating system, runtime, provider and data classification before a change.

## Bonus: New Tech and Innovations

**Stand 2026-09-16 — Virtual switching, hardware offload and programmable fabrics move FDB-like forwarding across host, NIC, DPU and network control planes.** **Reifegrad: Established bis Adopting je Plattform.** This can improve density and throughput but makes capture point, offload state, ownership and failure analysis more complex. A pilot accepts it only with path inventory, parity tests, offload fallback, telemetry and rollback.

**Stand 2026-09-16 — EVPN/VXLAN-style overlays can decouple L2 segments from individual physical switches and support larger virtual fabrics.** **Reifegrad: Established bis Adopting je use case.** The benefit is controlled mobility/segmentation; the cost is an additional control plane, encapsulation/MTU budget, vendor/support dependency and operations skill. Introduction requires explicit L2/L3 boundary, BUM handling, failure-domain, security and observability test.

**Stand 2026-09-16 — Ethernet security is increasingly evaluated together with workload identity, encrypted transport and software-defined policy rather than MAC filtering alone.** **Reifegrad: Established.** MAC/FDB signals remain valuable local evidence, but a secure service path needs explicit identity, authorization, TLS, audit and recovery boundaries. A pilot validates both allowed and denied flows without treating a MAC address as a tenant principal.

