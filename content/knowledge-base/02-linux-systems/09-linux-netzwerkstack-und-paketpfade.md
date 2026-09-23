---
{"id": "KB-0039", "title": "Linux-Netzwerkstack und Paketpfade", "domain": "02", "sequence": 9, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["PLATFORM", "CLOUD", "GENAI", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0036", "concepts": ["Sockets", "Verbindungsgrenzen", "Backpressure"], "needed_for": "understanding"}, {"id": "KB-0037", "concepts": ["Network Namespace", "Containerisolation"], "needed_for": "understanding"}], "related": ["KB-0038", "KB-0040", "KB-0080", "KB-0090", "KB-0565", "KB-0580"], "applies": ["KB-0080", "KB-0090", "KB-0565", "KB-0580"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein read-only Loopback-/Sandboxlab verfolgt eigene Socket-, Interface- und Routeansicht.", "rationale": "Keine Routing-, Netfilter-, Bridge- oder Cloudänderung wird ausgeführt."}, "ARCHITECT-TARGET": {"active": true, "scope": "Servicepfade haben DNS, ingress, egress, routing, network policy, timeout, telemetry und failure ownership.", "rationale": "Paketpfadverständnis verhindert falsche App-/Netzdiagnosen."}, "STAFF-TARGET": {"active": true, "scope": "Teams verwenden standardisierte Netzwerkdiagnose, Policy-as-code und sichere egress-/ingress-Defaults.", "rationale": "Lokale Workarounds werden durch belegte Hypothesen ersetzt."}, "CHIEF-TARGET": {"active": true, "scope": "Netzwerkzonen, CNI/LB/Firewallstrategie, Observability und Ausnahmegovernance sind zentral gestaltet.", "rationale": "Chief-Ebene steuert Blast Radius und Betriebsökonomie."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Kernel packet path, nftables/conntrack, eBPF, XDP, CNI, BGP/EVPN und NICoffload sind Spezialistenfelder.", "rationale": "Zielrollen kennen Wirkung, Risiken und Eskalationspunkt."}}, "lab_validation": [{"lab_id": "KB-0039-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Geplantes read-only Sandboxlab", "evidence": "Beobachtungsablauf und negative Proben dokumentiert.", "limitations": "Keine Hostrouting-, Bridge-, Netfilter-, CNI-, cloud- oder Produktionsänderung."}]}
---
# Linux-Netzwerkstack und Paketpfade

> **Ziel:** Folge einem Paket vom Containerprozess bis zur Zielantwort und zurück, ohne die Ebenen zu vermischen: Socket, Netzwerknamespace, virtuelles Interface, Bridge, Routing, Netfilter, NAT, Host-/Cloudnetz und Zielservice besitzen jeweils eigene Ownership und Fehlerbilder.

## Purpose, Definition und Scope

Linux verbindet Anwendungen über Socket API mit einem Netzwerkstack aus Interfaces, Adressen, Nachbarauflösung, Routing, Paketfilterung, Bridges und optionalen virtuellen oder hardwareoffloaded Pfaden. Netzwerk Namespaces isolieren Interfaces, IPv4/IPv6-Stacks, Routingtabellen, Firewallregeln und Ports. Scope: Routingtabellen, Netfilter, Bridges, virtuelle Interfaces, Host-/Namespace-/Containerpfade und lokale Verlustdiagnose.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Paketpfad, Route, veth, Bridge, Policy und Dropursache werden getrennt. |
| HANDS-ON-TARGET | Read-only Sandboxbeobachtung, keine Netzänderung. |
| ARCHITECT-TARGET | Egress/Ingress/DNS/Identity/Timeout/Policy als Servicevertrag. |
| STAFF/CHIEF | Standardpfade, Telemetrie und Ausnahmegovernance statt Ad-hoc-Firewall. |

## Mental Model: Ein Paket durchquert mehrere Verträge

```text
process socket
 -> container net namespace -> veth peer
 -> host bridge / virtual switch -> routing lookup
 -> netfilter / NAT / network policy
 -> NIC / overlay / cloud fabric
 -> destination listener
```

Der Rückweg kann andere Zustände, NAT-/Conntrackeinträge, Load Balancer oder Policies berühren. Daher ist „Ping funktioniert“ kein Beweis für DNS, TCP/TLS, HTTP, Egresspolicy, MTU oder Anwendungsautorisierung.

## Prerequisites und Dependencies

| Abhängigkeit | Nutzen |
|---|---|
| [KB-0036 Sockets](06-sockets-und-netzwerk-i-o.md) | Socket-/Connection-/Timeoutebene. |
| [KB-0037 Namespaces](07-namespaces-und-isolation.md) | eigene Interfaces, Routes und Ports. |
| KB-0080 APIs und HTTP | Protokoll-/Anwendungssemantik. |
| KB-0090 Network Fundamentals | IP, DNS, TCP, TLS und Routinggrundlagen. |

## Core Concepts

### Routing und Interfaces

Eine Route entscheidet anhand Ziel, Policy, Tabelle, Next Hop und Interface über den nächsten Schritt. Rtnetlink ist die Kernel-/User-Space-Schnittstelle für Links, Adressen, Routen, Nachbarn, Queueing und Klassen. Keine App verändert Routen als „Fix“: Das ist ein privilegierter Plattformzustand mit Impactanalyse, Audit und Rückbau.

### Network Namespace, veth und Bridge

Ein physisches Device kann nur in einem Network Namespace leben. Ein veth-Paar verbindet Namespaces wie eine Pipe; ein Ende liegt beispielsweise im Container, das andere an Bridge oder virtueller Switchstruktur des Hosts. Eine Linux Bridge arbeitet auf Layer 2 und leitet Frames nach MAC weiter. veth, Bridge, Overlay, CNI und Cloudfabric sind verschiedene Bausteine; konkrete Reihenfolge und NAT hängen von Runtime/Plattform ab.

### Netfilter und nftables

Netfilter verarbeitet Pakete an definierten Haken für Filter-, NAT-, Mangle-/Policyfunktionen. nftables ist die moderne Administrationsschnittstelle für Packet Filtering und Classification; die Kernelbridge-Dokumentation rät bei Filtering zu nftables und warnt vor Legacybr_netfilter-/iptablesannahmen. Ein Packet Drop braucht Regel, Hook, Namespace, Richtung und Counter als Beweis.

### Conntrack, NAT und asymmetrische Pfade

Stateful NAT/Firewall kann Paketfluss von Conntrackzustand abhängig machen. Ein Forward kann funktionieren, während Rückweg, Source-NAT, Security Group, Network Policy oder Route antwortende Pakete verwirft. Timeouts, Portauslastung, MTU/Fragmentierung und loadbalancerinduzierte Asymmetrie sind weitere Hypothesen. Niemals „Firewall öffnen“ ohne minimale Quelle/Ziel/Port/Protokoll/Dauer und Owner.

## Architecture und Data Flow: Container zu Model Gateway

```text
pod/client process
 -> DNS resolve + egress policy
 -> namespace route/veth/host switch
 -> NAT/LB/overlay/cloud fabric
 -> gateway TLS/auth/rate limit
 -> model service
 -> response through reverse path
```

Messe an jeder Grenze: DNSdauer/-fehler, connect/TLS, request/response, egress allow/deny, dropped/retransmitted, gateway outcome, dependencybudget. Für Tool-/LLM-Egress werden FQDN-/IP-/Portpolicy, Workloadidentity, token/requestbudget und Audit zusammen entschieden.

## Protokolle, Standards und Tools

| Element | Rolle |
|---|---|
| IP/TCP/UDP | L3/L4 Transport- und Routinggrundlagen |
| `network_namespaces(7)` | isolierte Interfaces/Stacks/Routen/Ports |
| `rtnetlink(7)` | Links, Adressen, Routen, Nachbarn, QoS |
| Linux Bridge | L2 forwarding und optionale Offloads |
| nftables | Paketfilterung und Klassifikation |
| CNI/LB/Cloud network | implementationsabhängige Plattformebene |

## Konfiguration und Implementierung

```yaml
service_network_contract:
  ingress: listener + tls + auth + rate_limit
  egress: explicit_destinations + ports + identity
  dns: resolver + timeout + failure_policy
  route: platform_owned
  policy: default_deny_with_minimal_rules
  observability: dns_connect_tls_request_drop_outcome
  exceptions: owner_expiry_audit_rollback
```

MTU, bridge, NAT, sysctls, forwarding, nft rules oder CNIconfig sind Plattformänderungen. Das Kapitel beschreibt Entscheidungsgrenzen und Diagnosen, keine unautorisierte Befehlsfolge.

## Scalability und Performance

Paketdurchsatz kann an CPU, NIC queues, softirq, conntrack, NAT-Portbudget, bridge/overlay, MTU, load balancer, socket buffers oder Zielservice limitieren. Eine hochskalierte Anwendung kann den Gateway-/Providerengpass vervielfachen. Das Concurrencybudget aus KB-0033/0036 bleibt wirksam: Netzwerk hat Backpressure, keine unendliche Kapazität.

## Reliability und Failure Modes

| Symptom | Hypothese | Nachweis |
|---|---|---|
| DNS Fehler | resolver/policy/search domain | resolverdaten, Trace |
| connect timeout | Route, drop, SG/policy, Ziel nicht erreichbar | von namespace bis gateway korrelieren |
| reset/refused | Listener/port/backlog/LB | socket/gateway metrics |
| nur große Payloads scheitern | MTU/fragmentation/proxy limit | bytes, path, controlled test |
| Rückweg fehlt | NAT/conntrack/asymmetry | flow-/policy-/routeevidence |
| sporadischer Verlust | saturation, drops, NIC/host/node | counters/queue/time correlation |
| nur Container betroffen | namespace/veth/CNI policy | compare host/namespace path |

## Security, Governance und Compliance

Default-deny Egress, minimale Ziel-/Portregeln, TLS, Identity, DNS-/certificatepolicy und auditierte Ausnahmen begrenzen lateral movement und Datenexfiltration. Paket-/Flowlogs können personenbezogene Endpunkte enthalten; Sampling, Retention und Zugriff folgen Datenschutzpolitik. Netzpolicy ersetzt keine Anwendungsautorisierung und umgekehrt.

## Observability und Troubleshooting

Beginne mit korrelierter Frage: *welcher Workload, welcher Namespace, welches Ziel, welche Zeit und welche Fehlerschicht?* Prüfe anschließend DNS → Socketconnect/TLS → Namespaceinterface/Route → veth/Bridge → Netfilter/Policy/NAT → Host/Node → LB/Fabric → Ziel. Erhebe read-only Counters/Traces zuerst; Änderungen nur mit Owner/Canary/Rollback.

## Cost und FinOps

Egress, NAT/Gateway, Load Balancer, Flowlogs, cross-zone/region traffic und Retries sind Kostenhebel. Lokale Caches oder regionales Routing können Kosten/Latenz senken, dürfen aber Datenresidenz, Freshness und Failuremodelle nicht verletzen. GenAI Tool-/Model-Egress wird pro Tenant und Outcome budgetiert.

## Trade-offs und Anti-Patterns

- Host-/Container-/Cloudpfad gleichsetzen.
- Ping als End-to-End-Nachweis.
- Drop ohne Hook/Rule/Counter behaupten.
- „temporäre“ any/any Firewallregel.
- NAT als Securitykontrolle ansehen.
- MTU/Overlay ohne Test ändern.
- CNI/bridge tuning als Appfix.
- Netzwerkretry ohne Deadline und Dependencybudget.

## Staff-, Principal- und Chief-Level Decisions

Staff baut Diagnose- und Policytemplates. Principal trennt Zonen, Trafficklassen, Gateway-/CNI-/LB-Verantwortung und Failure Domains. Chief setzt Egress-/Zero-Trust-/Networkobservability-/Coststrategie sowie Ausnahme- und Changegovernance.

## Production Checklist

- [ ] DNS, ingress, egress, TLS, identity, route and policy owner klar.
- [ ] Ziel-/Port-/Protokollregeln minimal und auditiert.
- [ ] Namespace-, host-, LB- und Zielmetriken korrelierbar.
- [ ] Retry, timeout, connection-/requestbudget und graceful degradation definiert.
- [ ] MTU/NAT/bridge/CNI Änderungen haben Plattformowner und Rollback.
- [ ] Flow-/Auditlogs respektieren Retention und Datenschutz.

## Interviewfragen mit Modellantworten

### Was isoliert ein Network Namespace?
Interfaces, IP stacks, Routingtabellen, Firewallregeln und Socketports. Es begrenzt nicht automatisch Egress oder Ressourcen.

### Wie unterscheidest du Appfehler von Paketverlust?
Mit korreliertem DNS/connect/TLS/request Trace und Countern pro Namespace/Host/Gateway/Ziel. Ein einzelner Clientfehler reicht nicht.

### Warum ist veth relevant?
Es verbindet Namespace und Hostnetz als virtuelles Paar. Der Paketpfad verlässt damit die Containeransicht und kann Bridge/CNI/Policy berühren.

### Wann ist nftables relevant?
Wenn Packetfilter-/NAT-/Classificationpolicy diagnostiziert oder verwaltet wird. Regeln brauchen Hook, Richtung, Counter und Owner.

## Praktisches Lab: Read-only Paketpfadhypothese

> `reviewed_only`; keine Netzwerkänderung.

1. Nutze einen eigenen Loopback-/Sandboxservice und erfasse DNS, connect, TLS und request timing.
2. Notiere nur lesbare Namespace-/Interface-/Routeinformationen der Testumgebung.
3. Simuliere eine unerreichbare Zieladresse im Testcode und klassifiziere DNS, refusal und timeout getrennt.
4. Prüfe Connection-/Retrybudget, beende alle Testprozesse und entferne Artefakte.

## Dependencies und Cross-References

- [KB-0036 Sockets](06-sockets-und-netzwerk-i-o.md)
- [KB-0037 Namespaces](07-namespaces-und-isolation.md)
- KB-0080 APIs und HTTP
- KB-0090 Network Fundamentals
- KB-0565 Cloud Architecture
- KB-0580 AI Infrastructure

## Quellen und Aktualitätsnotizen

| Quelle | Nutzung | Stand |
|---|---|---|
| Dateikatalog | Scope. | 2026-09-14 |
| [network_namespaces(7)](https://man7.org/linux/man-pages/man7/network_namespaces.7.html) | isolierte Netzwerkressourcen/veth. | Linux man-pages 6.19 |
| [rtnetlink(7)](https://man7.org/linux/man-pages/man7/rtnetlink.7.html) | Routes, links, addresses, neighbors. | Linux man-pages 6.19 |
| [Linux Bridge](https://docs.kernel.org/networking/bridge.html) | Bridge, Offload, Netfiltergrenzen. | 2026-09-15 |
| [nft](https://netfilter.org/projects/nftables/manpage.html) | nftables filtering/classification. | Aktualisiert 2026-02-07 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — eBPF- und flowbasierte Netzwerkobservability verkürzt die Zuordnung von Paketpfad zu Workload, braucht aber Privacy- und Privilegiengovernance.** **Reifegrad: Adopting bis Established.** Ein Pilot startet mit begrenzten Metadaten und klarer Retention.

**Stand 2026-09-15 — nftables ist der moderne Linuxpfad für Packet Filtering und Classification; Legacyannahmen über bridge/iptables bleiben migrationsrelevant.** **Reifegrad: Established.** Ein Pilot validiert Rulesets und Counters in einer nicht kritischen Zone.

**Stand 2026-09-15 — AI-Agentensysteme benötigen feinere Egress- und Tool-Zonen als klassische Webservices.** **Reifegrad: Adopting.** Ein Pilot nutzt minimale Ziele, Workloadidentity, Budget und Auditausgänge.

