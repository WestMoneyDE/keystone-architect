---
{"id": "KB-0049", "title": "OSI und TCP-IP als Analysemodelle", "domain": "03", "sequence": 1, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0031", "concepts": ["System Calls", "Kernelgrenze", "User Space"], "needed_for": "understanding"}, {"id": "KB-0036", "concepts": ["Sockets", "TCP", "UDP", "Netzwerk-I/O"], "needed_for": "both"}, {"id": "KB-0039", "concepts": ["Linux Netzwerkstack", "Paketpfad", "Routingkontext"], "needed_for": "both"}, {"id": "KB-0046", "concepts": ["Hypothesen", "Zeitachsen", "Performance-Debugging"], "needed_for": "both"}], "related": ["KB-0050", "KB-0051", "KB-0052", "KB-0053", "KB-0054", "KB-0105", "KB-0562", "KB-0720"], "applies": ["KB-0105", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein lokales Loopback-Lab trennt Namensauflösung, Socketbindung, TCP-Verbindung und Anwendungsantwort mit einem selbst gestarteten, kurzlebigen Server.", "rationale": "Es verwendet keinen Portscan, keine fremde Adresse, keine Firewall-/Routingänderung und keine Cloud- oder Produktionsressource."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein Kommunikationsvertrag ordnet Adressierung, DNS, Transport, TLS, Proxy, Load Balancing, Network Policy, Observability, Retry und Ownership zu.", "rationale": "Die Schichtzuordnung liefert Prüfpunkte, ersetzt aber keine End-to-End-Verantwortung."}, "STAFF-TARGET": {"active": true, "scope": "Teams verwenden ein gemeinsames Fehlerklassifikationsschema und vermeiden Zuständigkeitslücken zwischen Anwendung, Plattform, Netzwerk und Security.", "rationale": "Jede Eskalation enthält beobachtete Übergänge, Scope, Zeitachse, Gegenprobe und Rückfallplan."}, "CHIEF-TARGET": {"active": true, "scope": "Netzwerkstandards, IPv4/IPv6-/DNS-/Transportstrategie, Service Connectivity, Telemetrie, Sicherheitsgrenzen und Lieferantenrisiken werden als Portfolio geführt.", "rationale": "OSI ist kein Organisationsmodell; Chief-Level-Entscheidungen verbinden Protokolle mit Datenklasse, Resilienz, Kosten und Operating Model."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Ethernet/Wi-Fi, BGP/EVPN, MPLS, TCP congestion control, QUIC, packet capture, eBPF datapath, service mesh, DPU/SmartNIC und protocol fuzzing sind Spezialistentiefe.", "rationale": "Die Zielrollen müssen Schnittstellen und Evidenz bewerten, ohne jeden Paketpfad oder jedes Vendorfeature selbst implementieren zu müssen."}}, "lab_validation": [{"lab_id": "KB-0049-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Linux- oder Python-Sandbox mit Loopback", "evidence": "Lokaler Ablauf, Schichtbeobachtungen, Gegenproben, Port- und Cleanupgrenzen fachlich geprüft.", "limitations": "Nicht ausgeführt; kein externer Host, Portscan, Paketmitschnitt, Routing-/DNS-/Firewalländerung, Cloudzugriff oder Produktionsnetz wurde verwendet."}]}
---
# OSI und TCP-IP als Analysemodelle

> **Ziel:** OSI und TCP/IP sind Landkarten, keine Fehlermeldungen. Nutze sie, um einen End-to-End-Auftrag in beobachtbare Übergänge zu zerlegen: Name, Adresse, Socket, Transport, Paketpfad, Link-Hop, Sicherheit und Anwendungsergebnis. Eine Schicht ist erst dann eine gute Hypothese, wenn ein Messpunkt sie stützen oder widerlegen kann.

## Purpose, Definition und Scope

Das OSI-Referenzmodell teilt Kommunikation konzeptionell in sieben Schichten; die Internetprotokollsuite wird in der Praxis oft als Application, Transport, Internet/IP und Link betrachtet. Beide Modelle helfen, Verantwortungen und Kapselung zu ordnen. Keines beschreibt jede moderne Implementierung eins zu eins: TLS liegt über TCP oder innerhalb des QUIC-Ökosystems; HTTP/3 verwendet QUIC über UDP; Proxies terminieren Verbindungen und erzeugen neue; NAT verändert Adress-/Portkontext; Container und Service Meshes führen zusätzliche Sicht- und Policyebenen ein.

Scope dieser Datei:

- OSI und TCP/IP als Analyse- und Kommunikationsmodelle;
- Kapselung, Entkapselung, Addressing, Ports, Sockets und End-to-End-Übergänge;
- die Grenzen des Modells bei TLS, QUIC, HTTP, Proxy, NAT und Cloud/Containerpfaden;
- Fehlerklassifikation, Observability, Security, Cost und Staff-/Chief-Entscheidungen.

Nicht im Scope: vollständige Ethernet-, ARP/NDP-, IP-, TCP-, DNS-, TLS-, QUIC-, BGP- oder CNI-Konfiguration. Diese folgen als separate Dateien. Nach der Bearbeitung kannst du:

1. eine Anwendungsoperation vom Namen bis zur Antwort durch die relevanten Übergänge abbilden;
2. OSI- und TCP/IP-Schichten sinnvoll zuordnen, ohne moderne Protokolle künstlich zu vereinfachen;
3. Kapselung und die Änderung von Link-Frames pro Hop erklären;
4. Fehlerhypothesen zwischen DNS, Socket/Transport, IP/Route, Link, TLS/Proxy und Anwendung trennen;
5. ein Cross-Team-Runbook schreiben, das technische Schichten, Ownership, Sicherheit und Produkt-SLO verbindet.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Schichten, Kapselung, Protokollrollen und Diagnosefragen werden mit IETF-/Linux-Primärquellen erklärt. |
| HANDS-ON-TARGET | Ein reiner Loopback-Fall bildet Anwendung, Bind, Connect, Transport und Antwort ab; externe Netzwerke werden nicht berührt. |
| ARCHITECT-TARGET | Ein Connectivityvertrag verbindet Namen, Addressing, Transport, TLS, Proxy, Policy, Retry, SLO und Ownership. |
| STAFF/PRINCIPAL | Eine gemeinsame Fehlerklassifikation reduziert Ping-Pong zwischen App-, Plattform-, Netzwerk- und Securityteams. |
| CHIEF | Netzwerkstandards und Service Connectivity werden als Risiko-, Kosten- und Betriebsportfolio geführt. |

## Mental Model: ein Auftrag trägt Hüllen, nicht nur Daten

Ein Request erhält unterwegs mehrere Hüllen. Der Empfänger entfernt sie in umgekehrter Reihenfolge. Auf einem Layer-3-Router wird typischerweise nicht die komplette Anwendung neu verpackt; ein Link-Frame endet am lokalen Hop und wird für den nächsten Hop neu gebildet. Ein Proxy kann dagegen bewusst eine Verbindung terminieren und eine neue nach vorne aufbauen.

```text
application intent:
  "retrieve result"

application message
  -> transport unit: TCP segment / UDP datagram / QUIC over UDP
  -> IP packet
  -> link frame for next hop
  -> physical transmission

next hop:
  receive frame -> remove link header
  -> route IP packet
  -> create another link frame
  -> send toward next hop
```

Die Hüllenmetapher wird ungenau, wenn sie TLS, QUIC oder Service Mesh „in eine Schicht zwingt“. Besser lautet die Frage: **Welcher Kontext wird an welchem Übergang erzeugt, geprüft, verschlüsselt, verändert oder erneut aufgebaut?**

## Prerequisites und Dependencies

| ID | Art | Bedeutung |
|---|---|---|
| [KB-0031](../02-linux-systems/01-linux-kernel-und-systemaufrufe.md) | Verständnis | System Calls und Kernel-/Userspacegrenze erklären Socket-APIs. |
| [KB-0036](../02-linux-systems/06-sockets-und-netzwerk-i-o.md) | Anwendung und Lab | Socket, Bind, Listen, Connect, Send/Receive sind die lokale Übergabestelle. |
| [KB-0039](../02-linux-systems/09-linux-netzwerkstack-und-paketpfade.md) | Anwendung und Lab | Hostpaketpfad, Routing- und Policykontext ergänzen die Protokollsicht. |
| [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Anwendung und Lab | Hypothese, Messbudget, Zeitachse und Gegenprobe verhindern Schichtenraten. |

Die folgenden Netzwerkdateien behandeln Link, Ethernet, IP, Routing, DNS und Transport tiefer. Verweise vermeiden hier absichtlich Protokollkopien.

## Core Concepts und Mechanismen

### OSI und TCP/IP: zwei nützliche, unterschiedliche Projektionen

| OSI-Referenzschicht | TCP/IP-Praxiszuordnung | Diagnosefrage | Typische Grenze |
|---|---|---|---|
| 7 Application | Application | versteht der Endpoint das Protokoll und die fachliche Anfrage? | HTTP/gRPC/DB-Protokoll, Auth, Schema, Rate Limit. |
| 6 Presentation | meist Teil der Application | stimmen Kodierung, Kompression, Kryptografie/Format? | TLS, JSON, Protobuf, Zertifikat, Content Encoding. |
| 5 Session | meist Teil der Application/Transport | wie wird Anwendungszustand wiederaufgenommen? | Tokens, sessions, streams, retries, connection pooling. |
| 4 Transport | Transport | kann der Endpoint die richtige Transportbeziehung aufbauen und Daten liefern? | TCP, UDP, QUIC; ports, flow/congestion control. |
| 3 Network | Internet/IP | ist Zieladressierung/Routing über das IP-Netz möglich? | IPv4/IPv6, route, ICMP, MTU, NAT context. |
| 2 Data Link | Link | erreicht der nächste Hop das lokale Layer-2-Segment? | Ethernet, Wi-Fi, VLAN, ARP/NDP, MAC. |
| 1 Physical | Physical | ist das Übertragungsmedium und Signal/Link verfügbar? | optics, cable, RF, interface, provider circuit. |

RFC 1122 gliedert die Internetprotokollsuite in Link-, IP- und Transportschicht; RFC 1123 ergänzt Application-/Supportprotokolle. Das Modell ist für Internetkommunikation hilfreicher als ein starres „OSI genau so implementiert“-Narrativ. OSI ist besonders nützlich, um Fehlerklassen und Zuständigkeiten zu strukturieren. TCP/IP ist näher an verbreiteten Protokollinterfaces.

### Endpoints, Namen, Adressen, Ports und Sockets

Ein End-to-End-Ziel wird nicht durch eine einzige Kennung beschrieben:

- **Name:** ein nutzbarer Bezeichner wie Service-/DNSname; Auflösung kann mehrere Antworten, Caching und Policies enthalten.
- **IP-Adresse:** ein Netzwerk-Locator innerhalb einer IP-Version und eines Routingkontexts; sie kann durch NAT, Anycast, Load Balancing oder Mobilitybeziehungen anders sichtbar sein.
- **Port:** dem Transport zugeordnete Endpoint-Nummer, nicht die Anwendungsidentität.
- **Socket:** die lokale Kernelabstraktion für Kommunikation; `socket(7)` beschreibt Sockettypen, Optionen und Adressfamilien.
- **Flow/Conversation:** bei TCP oft über lokale/remote Adresse und Port plus Protokoll beschreibbar; bei QUIC spielen Connection IDs und Path Migration eine zusätzliche Rolle.
- **Workload Identity:** wer die Anwendung extern autorisiert; sie ist nicht dasselbe wie IP, Port oder Linux UID.

Eine Fehlermeldung wie `connection refused` grenzt eine bestimmte lokale/remote Socket-/Transporterwartung ein. Sie beweist weder, dass DNS, TLS, HTTP-Autorisierung, Anwendungslogik oder die gesamte Netzwerkroute fehlerfrei sind.

### Kapselung und Entkapselung

Für einen klassischen TCP/IPv6/Linkpfad lässt sich der Datenfluss so skizzieren:

```text
HTTP request bytes
  -> TCP sequence / acknowledgement / ports
  -> IPv6 source and destination addresses
  -> Ethernet source/destination MAC and type
  -> link transmission

receiver:
  link validation -> IP destination/protocol -> TCP port/stream state -> HTTP parser
```

Bei einem Router wird die Layer-2-Hülle für den jeweiligen Hop ersetzt. Die IP-Zieladresse bleibt in einem normalen Routingfall zielbezogen; Hop-spezifische Felder und Linkadressen ändern sich. Bei NAT, Proxy, Tunnel oder Service Mesh kann die Sicht weiter abweichen. Daher ist ein Packet Capture an Punkt A kein vollständiger Nachweis für die Semantik an Punkt B.

### Transport: TCP, UDP und QUIC ohne Mythen

RFC 9293 spezifiziert TCP als zuverlässigen, verbindungsorientierten Bytestrom mit Zuständen, Acknowledgements, Fluss-/Staukontrolle und Fehlerbehandlung. TCP liefert keine fachliche „exactly once“-Semantik; bei Timeout bleibt oft unklar, ob die Remoteanwendung eine Operation ausgeführt hat.

UDP ist ein Datagramsubstrat ohne die TCP-Connection-/Byte-Stream-Eigenschaften. Anwendungen oder darüberliegende Protokolle entscheiden über Zuverlässigkeit, Reihenfolge, Wiederholung, Stau- und Flusskontrolle.

QUIC ist nach RFC 9000 ein auf UDP getragenes, sicheres, multiplexendes Transportprotokoll mit Streams, Transport- und TLS-integrierter Aushandlung sowie Path Migration. Daraus folgt nicht „UDP ist unzuverlässig, QUIC magisch schnell“. Es bedeutet: Die Transport- und Sicherheitsfunktion liegt in einer anderen Implementierungs- und Observabilityschicht als bei TCP/TLS. Firewalls, Load Balancer, Proxies, Sampling und Troubleshooting müssen diesen Unterschied kennen.

| Wahl | Vorteil | Risiko / Entscheidungsfrage |
|---|---|---|
| TCP | breites Ökosystem, Bytestrom, etablierte End-to-End-Semantik | Head-of-line auf Verbindungsniveau, Handshake-/TLS-/Middleboxkontext prüfen. |
| UDP | niedrige Grundabstraktion, zeit-/datagrammorientierte Fälle | App trägt Fehler-/Rate-/Security-/NAT-Verantwortung. |
| QUIC | Streams, TLS-Integration, Path-Migration-Möglichkeiten | UDP-Policy, Observability, LB/proxy, 0-RTT-/Retry-Semantik und Supportmatrix. |

### Der End-to-End-Fehlerbaum

Eine nutzerseitig gemeldete „Netzwerkstörung“ kann vor der ersten IP-Übertragung auftreten oder erst nach einer korrekten Antwort entstehen:

```text
user intent
  -> configuration / service name
  -> name resolution
  -> local socket and source selection
  -> policy / egress admission
  -> transport establishment
  -> IP route / MTU / NAT / load balancing
  -> remote listener / proxy / TLS
  -> application authorization / request handling
  -> response / retry / client interpretation
```

Diese Reihenfolge ist eine Analysehilfe, keine Garantie, dass jede Technologie exakt linear arbeitet. Wiederholte DNS-Lookups, Connection Pools, Happy Eyeballs, proxy tunneling, HTTP retries and QUIC path migration can change the active path. Ein guter Incidentbericht benennt daher **beobachtete Übergänge**, nicht nur „Layer 3 scheint okay“.

## Architecture und Data Flow: ein Enterprise-Agent ruft einen Retrieval-Service auf

Der Fall ist eine Lernannahme.

```text
Agent workload
  -> service name + policy
  -> resolver returns approved endpoint set
  -> local socket connects through egress policy
  -> transport (TCP/TLS or QUIC depending on contract)
  -> load balancer / proxy may terminate and create new upstream connection
  -> retrieval service authenticates workload identity
  -> application response streams back through each boundary
```

**Kontrollpfade:**

- DNS-/Service Discovery definiert Name zu Endpointmenge, TTL, Zone/Region und Failureverhalten.
- Netzwerk-/Egresspolicy begrenzt erlaubte Ziele und Ports; sie ist keine Identitätsaussage.
- Transport-/TLS-Policy definiert Authentisierung, Cipher/Version, Deadline, Connection Reuse and error classification.
- Proxy/LB kann Client-IP, Transport, Zertifikat, Retry, observability and trust boundary verändern.
- Application-/IAM-Autorisierung entscheidet Zugriff auf Retrievaldaten unabhängig von Portreachability.
- Observability korreliert anonymisierte request/trace IDs, service class, endpoint class, transport result, latency and error class; sie speichert keine Prompts, Tokens oder sensitive Headers.

**Fehlerpfad:** Wenn DNS eine Endpointmenge liefert, aber Connects über die Deadline laufen, prüft das Team Resolverresultat, lokale Policy, Transport-/Syn-/UDP-/TLS-/Proxyphase, IP/route/MTU sowie Remote capacity. Es folgert nicht aus einem erfolgreichen ICMP-Ping, dass die Anwendung korrekt erreichbar ist.

## Protocols, Standards und Tools

| Ebene | Normative Quelle / Tool | Zweck | Prüflimit |
|---|---|---|---|
| Internetmodell | RFC 1122/1123 | Link/IP/Transport plus Application-/Supportkontext | historische Basis, aktuelle Einzelprotokolle separat prüfen. |
| IP | RFC 8200 für IPv6, spätere IPv4-Dateien | Adressierung und Paketkontext | Route/Firewall/MTU/NAT werden konkret im Zielnetz geprüft. |
| TCP | RFC 9293 | Transportzustände und Semantik | App idempotency and TLS remain outside TCP. |
| QUIC | RFC 9000 | UDP-basiertes Transport-/TLS-/Streammodell | LB, proxy, firewall, version and library support. |
| HTTP | RFC 9110/HTTP-Spezifikation | Applikationssemantik | HTTP success does not prove business completion. |
| Linux Socket API | `socket(7)` | lokale API-/Adressfamilien-/Sockettypen | keine Aussage über Remote policy or application auth. |
| `getent`, `ss`, `ip`, `ping`, `traceroute`, packet tools | Diagnose nur in erlaubtem Scope | beobachtbare Übergänge | Tooloutput ist kein universeller Kausalbeweis; Zugriff und Datenminimierung beachten. |

Normative Standards definieren Protokollverhalten. Sie definieren nicht automatisch die Zuständigkeit eines Cloudproviders, die Sicherheitsfreigabe eines Unternehmens oder das SLO eines Produkts.

## Konfiguration und Implementierung: ein Connectivityvertrag

```yaml
connectivity_contract:
  client: enterprise-agent
  target_service: retrieval-api
  naming:
    service_name: required
    resolution_scope: approved
    ipv4_ipv6_policy: explicit
    cache_and_ttl_behavior: documented
  transport:
    protocol: tcp_tls_or_quic
    connect_deadline_ms: bounded
    request_deadline_ms: bounded
    connection_reuse: documented
    retry:
      only_idempotent_or_reconciled: true
      budget: bounded
  security:
    egress_allowlist: service-class-and-port
    tls_identity: verified
    workload_identity: required
    sensitive_network_metadata: redacted
  intermediaries:
    proxy_or_lb: declared
    termination_boundary: declared
    source_identity_semantics: declared
  observability:
    fields: [service_class, endpoint_class, dns_result_class, transport_phase, result, latency_bucket]
    prohibit: [authorization_header, prompt, token, full_url, customer_data]
  resilience:
    fallback_endpoints: policy-controlled
    dns_failure: fail_fast_or_cached_policy
    rollback: previous_connectivity_config
```

Die technische Konfiguration darf nicht suggerieren, dass ein Port-Allow oder eine DNS-Antwort die gesamte Operation autorisiert. Jede Schicht besitzt einen definierten Owner, Telemetrie und Failuresemantik.

## Scalability und Performance

### Latenz ist eine Kette

```text
end_to_end_latency =
  name_resolution
+ local_queue_and_socket
+ connect_or_handshake
+ transport_loss_recovery
+ proxy_lb_queue
+ remote_application_work
+ response_transfer
+ client_parse_and_retry
```

Der Ausdruck ist kein direkt messbarer einzelner Timer, sondern ein Modell für Phasen. Ein Pool kann Connectzeit amortisieren, aber Staleness, NAT-/LB-/cert-/route-Änderungen, connection exhaustion and retry storms create other risks. Mehr Parallelität kann Requests über einen Abhängigkeitspfad drücken, bis Flow-/Congestion-/CPU-/queue-/remote limits dominate.

### MTU, Fragmentierung und Payloadgröße

Eine Anwendung kann kleine Nachfragen schnell messen und trotzdem bei großen Antworten, Tunneln oder unterschiedlichen IP-Versionen scheitern. Path MTU, fragmentierungsbezogene Regeln, packetization, TLS/QUIC framing and proxy buffers matter. „Ping funktioniert“ ist keine Teststrategie für reale Payloadgröße, Transport oder TLS. Tests verwenden einen erlaubten, repräsentativen Datenklassen-/Payloadgrößenbereich und schützen sensible Inhalte.

### Multiplexing und Fairness

HTTP/2, HTTP/3/QUIC, proxies, connection pools and queues can multiplex work. Multiplexing raises throughput and reduces handshake cost, but it can create head-of-line, CPU, memory, fairness and cancellation complexity at a different layer. Per-tenant deadlines, bounded in-flight work, backpressure, cancellation and idempotency remain application/platform contracts.

## Reliability und Failure Modes

| Fehlerbild | Beobachtbarer Übergang | Sichere Reaktion |
|---|---|---|
| Name not resolved | resolver error/timeout/no usable answer | scope, TTL/cache, service discovery and fallback policy inspect. |
| Address route unreachable | local/IP route/policy/ICMP class where allowed | verify source/destination/namespace/route, do not broad-open egress. |
| Connection refused | remote endpoint reachable but listener/port rejects | verify correct endpoint/release/listener policy; not a DNS success. |
| Connection timeout | handshake/path/policy/remote overload ambiguous | phase telemetry, bounded retry, failover policy, avoid retry storm. |
| TLS failure | certificate/name/time/chain/proxy boundary | validate identity/time/policy, never disable verification as workaround. |
| HTTP/application denial | application or IAM rejects after network success | classify authz/rate/schema separately from network. |
| Partial response / reset | transport/peer/proxy/application termination | idempotency/reconciliation, stream/error semantic, retry budget. |
| PMTU/payload failure | small payload works, large payload stalls/fails | controlled size test, tunnel/MTU/LB analysis, no random MTU tweak. |
| Dual-stack asymmetry | IPv4 and IPv6 outcomes differ | policy, DNS answer, source selection, route, firewall and service parity. |
| NAT/proxy identity mismatch | expected source/tenant not recognized | document termination/source semantics, use workl. identity not IP trust. |

Network retries are not universally safe. The caller needs an idempotency key or a query/reconciliation method whenever an operation could have reached the remote service before a timeout.

## Security, Governance und Compliance

### Network reachability is not authorization

A route and port only describe possible traffic delivery. Security must distinguish:

| Control | Protects | Does not prove |
|---|---|---|
| Network segmentation/egress | which destinations can be contacted | which user/workload may read business data. |
| Firewall / security group | coarse flows/ports/protocols | TLS identity, application authorization, data purpose. |
| TLS/mTLS | peer identity and transport protection in its scope | end-user consent or correct tenant authorization. |
| DNS security/policy | name resolution and discovery control | application payload safety. |
| Workload IAM | external service access scope | local host privilege or safe application logic. |
| Application authz | business operation and tenant scope | route, certificate, performance or resilience. |
| Observability | detection and investigation | permission to retain sensitive packet/payload data. |

The architecture documents trust termination: where TLS ends, whether a proxy opens a new connection, how client identity propagates, which header is trusted, and which component verifies it. `X-Forwarded-*` or source IP is never trusted blindly across an unmodeled boundary.

### Governance

Chief-/enterprise-level network governance includes address and DNS ownership, IPv4/IPv6 adoption, standard transport/TLS profiles, segmentation, proxy/LB patterns, incident escalation, packet-data policy, provider connectivity, retention, cost attribution and exception lifecycle. A four-layer diagram alone cannot decide data-residency or third-party risk.

## Observability und Troubleshooting

### Minimal observability matrix

| Transition | Metric/event | Question |
|---|---|---|
| name → endpoint set | lookup latency, error class, answer family/count | do we have a usable, intended endpoint? |
| endpoint → local socket | bind/connect error, pool wait | is the client locally able to start transport? |
| transport handshake | handshake duration/result/reset/timeout | did the expected transport relation form? |
| IP/path | allowed route/policy/error class, MTU symptoms | is a viable path available under actual policy? |
| proxy/LB | queue/upstream result/termination mode | did an intermediary change the connection or fail? |
| TLS | handshake/result/name/issuer policy class | did the expected peer identity validate? |
| application | status/error class, authz/rate, phase latency | is the service semantically handling the operation? |
| response | bytes, completion, cancellation, retry/reconciliation | did the client obtain/interpret a complete safe result? |

All telemetry is scoped. Packet payloads, Authorization headers, prompts, document text and unbounded addresses are not general-purpose metric labels.

### Troubleshooting algorithm

1. Define operation, user impact, exact start/end time, client/runtime/release and intended endpoint identity.
2. Verify configuration and name resolution result; distinguish absent, stale, wrong-family and policy-filtered endpoints.
3. Observe local socket/pool state and cgroup/resource condition; a CPU/FD/port exhaustion may occur before the network.
4. Classify transport result: immediate refusal, timeout, reset, handshake/certificate error, partial stream or success.
5. Verify IP/path/policy only with authorized, minimally invasive evidence. A layer-3 probe is not an application SLO test.
6. Locate proxy/LB/TLS termination and compare its upstream event with client event.
7. Verify application authorization/rate/schema/dependency separately.
8. Use a controlled counterexample: same app with known-good endpoint, same endpoint from another authorized scope, small vs representative payload, v4 vs v6 only if policy permits.
9. Mitigate with bounded retry/backoff, cached allowed resolution, approved failover, rate control or rollback. Do not widen firewall rules or disable TLS blindly.
10. Preserve evidence, owner, uncertainty, change and recheck trigger in the incident/ADR.

## Cost und FinOps

Network cost is not only bandwidth. A service connectivity model includes:

```text
network_cost =
  egress_and_cross_zone_transfer
+ NAT_or_gateway_processing
+ load_balancer_or_proxy_capacity
+ DNS_queries_and_service_discovery
+ TLS_and_connection_cpu
+ observability_ingest_and_retention
+ retry_amplification
+ incident_and_failure_cost
```

Concrete prices, free tiers, regions, providers and metering units are time-dependent and must be verified at purchase/architecture review time. A lower per-GB path can be a poor decision when it increases cross-zone latency, retry volume, failure domain or security exception cost. Cost per successful SLO-conformant request makes the retry, handshake, endpoint and architecture effects visible.

## Trade-offs, Alternativen und Anti-Patterns

| Choice | Useful when | Cost / Boundary |
|---|---|---|
| direct client-to-service | simple ownership and allowed topology | client needs discovery, TLS, retry and failover behavior. |
| proxy/LB | shared termination, policy, routing, observability | new queue, trust boundary, failure mode and cost. |
| TCP/TLS | broad service compatibility | handshake/connection semantics and HOL characteristics. |
| QUIC/HTTP3 | supported clients/networks, stream/path requirements justified | UDP policy, LB/proxy/observability and replay semantics. |
| IPv4 only | temporary legacy constraint | address scarcity, future migration and dual-stack debt. |
| dual stack | planned parity and testing exist | two paths, DNS/source/policy/observability consistency needed. |
| packet-level diagnostics | deep authorized incident need | privilege, data minimization, load and retention risk. |
| synthetic flow test | known safe endpoint and payload | cannot replace user-/tenant-/real workload observation. |

Anti-Patterns:

- OSI layers memorize but no observable transition, owner or counterexample define.
- A successful ping, DNS lookup or port-open check as full application reachability declare.
- Treat IP address or source port as workload identity.
- Disable TLS verification or broadly open egress to resolve a connectivity incident.
- Retry connection/timeouts without idempotency or a budget.
- Diagnose TCP, QUIC, proxy and application failures with the same generic “network error” dashboard.
- Assume an HTTP 200 means durable business completion.
- Ignore IPv6/IPv4 asymmetry, MTU/payload size, DNS cache and intermediary termination.
- Export packet/payload/Authorization data as standard metrics.

## Staff-, Principal- und Chief-Level Decisions

### Staff: connectivity contract for one service

Staff writes the concrete contract: service name, expected address families, transport/TLS mode, timeout/retry/idempotency semantics, proxy/LB termination, identity propagation, egress scope, metrics, failure modes and rollback. The deliverable is a testable path, including expected failures. Staff ensures a timeout leads to reconciliation instead of a duplicate write and that security does not depend on source IP alone.

### Principal: common network interfaces

Principal creates shared patterns for discovery, TLS/mTLS, egress, service connectivity, proxies/LBs, DNS, dual-stack policy, telemetry, debugging access and application migration. Teams consume an interface rather than implementing inconsistent connection pools, retry rules, headers and firewalls. Principal resolves trade-offs when a local optimization breaks global routing, fairness, security or operability.

### Chief: network and service connectivity portfolio

Chief sets the enterprise posture for address space, IPv6 adoption, DNS zones, connectivity providers, regional/failure topology, zero-trust transport, observability data policy, vendor dependency and cost allocation. Standards include exception scope and exit; success is measured by safe reachability, recovery, cost per outcome, auditability and delivery speed, not number of configured subnets.

## Production Checklist

- [ ] Client, service, workload identity, name, endpoint/family, transport, TLS and intermediary boundaries are documented.
- [ ] DNS/discovery has TTL/cache/failure behavior, ownership, testing and safe fallback.
- [ ] Connect/request deadlines, retry budget, idempotency/reconciliation and cancellation are explicit.
- [ ] IPv4/IPv6, route, egress, NAT/proxy/LB and MTU/payload conditions are tested for supported paths.
- [ ] TLS peer identity, trust chain, termination/re-encryption and client identity propagation are verified.
- [ ] Application authz/rate/schema failures remain distinguishable from network failures.
- [ ] Metrics cover DNS, socket/pool, handshake, IP/policy, proxy, TLS, application and response phases without sensitive labels.
- [ ] Network changes have blast-radius assessment, canary, rollback and cross-team owner.
- [ ] Failover and recovery tests use real permitted payload classes and compare p50/p95/p99, errors and costs.
- [ ] Packet/profiling diagnostics have explicit authorization, data policy, duration and cleanup.

## Interviewfragen mit Antwortleitfäden

### 1. Warum reichen OSI-Schichten allein nicht für Incidentdiagnose?

OSI ordnet mögliche Fehlerklassen, aber keine konkrete Telemetrie, Ownership oder Kausalität. Ich übersetze jede Schicht in Übergänge wie DNS-Antwort, Socket-Connect, TLS-Handshake, Proxy-Upstream und Applikationsantwort. Dann definiere ich Gegenproben und eine End-to-End-SLO.

### 2. Was ändert sich pro Router-Hop?

Die lokale Link-Hülle wird für den nächsten Hop neu aufgebaut; IP wird geroutet und Hop-/Pfadkontext kann sich ändern. Anwendung, Transportbeziehung und Zieladressierungsabsicht bleiben nicht automatisch „unverändert beobachtbar“, insbesondere bei NAT, Tunnel oder Proxy. Ein Capture an einem Punkt ist nicht die ganze Reise.

### 3. Was sagt `connection refused` aus?

Der Versuch erreichte typischerweise einen Endpoint, der für die erwartete Transport-/Portbeziehung keine Annahme bietet. Ich prüfe Zieladresse, Port, Listener, Release, LB/proxy and policy. Die Meldung beweist nicht, dass Name, TLS, Auth, application state or other endpoints are correct.

### 4. Wie unterscheiden sich TCP, UDP und QUIC?

TCP ist ein verbindungsorientierter Bytestrom mit den spezifizierten Transportmechanismen. UDP liefert Datagramsubstrat. QUIC baut ein sicheres, multiplexendes Transportmodell über UDP mit Streams und eigener Handshake-/Pathsemantik. Ich wähle sie nach Protokoll-, Netzwerk-, Security-, Observability- und Failureanforderung, nicht nach einem Pauschalurteil über Geschwindigkeit.

### 5. Warum ist ein HTTP-200 nicht immer Erfolg?

HTTP kann den Transport-/Applikationsempfang bestätigen, aber nicht zwingend eine durable, asynchrone oder fachlich endgültige Nebenwirkung. Der APIvertrag muss `accepted`, `durable`, `unknown` and reconciliation/idempotency define. Netzwerkretry follows that contract.

### 6. Wie behandelst du einen DNS-Ausfall?

Ich prüfe Name, Resolver, cache/TTL, endpoint set, address family, client scope and discovery policy. Der Dienst braucht eine definierte Fail-fast-, cached-answer- oder fallback strategy. Ich ersetze DNS nicht spontan durch dauerhafte Hardcoded IPs, weil Ownership, TLS name, routing and migration break.

### 7. Welche Securityannahme ist an einem Proxy kritisch?

Wo TLS terminiert, wie sich Upstream neu verbindet, welche Clientidentität verifiziert und wie Header/Sourcen gegen Spoofing geschützt sind. Der Proxy ist eine Trust Boundary. I never treat a client-provided forwarding header as truth without the receiving proxy’s documented verification.

### 8. Wie baust du eine Netzwerk-Kostenentscheidung?

Ich berücksichtige egress/cross-zone, NAT/gateway, LB/proxy, DNS, TLS CPU, telemetry, retries, failure and operations per successful SLO-conformant request. Then I compare with resilience, security and exit—not just lowest data-transfer unit price.

## Praktisches Lab: lokaler End-to-End-Übergang über Loopback

> **Status:** `reviewed_only`. Dieses Lab ist für eine eigene lokale Sandbox gedacht. Es startet nur einen kurzlebigen Loopback-Server auf `127.0.0.1` und kommuniziert ausschließlich mit diesem Prozess. Es scannt keine Ports, kontaktiert keine externen Hosts, verändert keine DNS-/Route-/Firewallregeln und verwendet keine Produktionsdaten.

### Ziel und Hypothesen

**Hypothese A:** Ein lokaler Name/Host, ein Socket-Connect, TCP und eine Anwendungsantwort sind getrennte Beobachtungspunkte.  
**Hypothese B:** Ein erreichbarer TCP-Port beweist nicht die Semantik einer gewünschten Anwendungsantwort.  
**Negative Probe:** Eine Verbindung zu einem lokalen, bewusst nicht belegten Testport führt zu einem kontrollierten Fehler und wird nicht mit einem Transport-/TLS-/Anwendungserfolg verwechselt.

### Ablauf

```bash
set -euo pipefail

work_dir="$(mktemp -d "${TMPDIR:-/tmp}/kb0049-XXXXXX")"
trap 'rm -rf -- "$work_dir"' EXIT

cat > "$work_dir/server.py" <<'PY'
from http.server import BaseHTTPRequestHandler, HTTPServer
class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/ready":
            self.send_response(200); self.end_headers(); self.wfile.write(b"ready\n")
        else:
            self.send_response(404); self.end_headers(); self.wfile.write(b"not-found\n")
    def log_message(self, fmt, *args): pass
HTTPServer(("127.0.0.1", 18080), Handler).handle_request()
PY

python3 "$work_dir/server.py" &
server_pid="$!"
sleep 0.2

getent hosts localhost || true
python3 - <<'PY'
import socket
with socket.create_connection(("127.0.0.1", 18080), timeout=2) as s:
    s.sendall(b"GET /ready HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n")
    print(s.recv(256).decode("ascii", "replace"))
PY
wait "$server_pid"

# Negative probe: no listener is created at this unrelated local test port.
python3 - <<'PY'
import socket
try:
    socket.create_connection(("127.0.0.1", 18081), timeout=1)
    raise SystemExit("unexpected local listener")
except OSError as err:
    print("expected local connection failure:", type(err).__name__)
PY
```

### Auswertung, Gegenproben und Cleanup

1. `getent hosts localhost` zeigt nur eine lokale Namensauflösungssicht; es beweist keine externe DNS- oder Service-Discoveryfunktion.
2. Ein HTTP-`200` für `/ready` zeigt, dass der kleine lokale Server genau diesen Pfad beantwortete. Es beweist keine TLS-, IAM-, Load-Balancer-, Route-, MTU- oder Productionreadinesssemantik.
3. Der Fehler auf 18081 ist ein kontrollierter Endpoint-/Listenergegenbeweis. Er wird nicht wiederholt oder auf weitere Ports ausgeweitet.
4. Falls `python3` oder `getent` fehlt, wird nichts installiert. Dokumentiere die Toolgrenze und führe keine externe Ersatzprobe aus.
5. `wait` und `trap` beenden den Server und löschen den eigenen temporären Pfad. Prüfe bei einem Abbruch erst die PID und den genauen Ordner, bevor du manuell aufräumst.

## Dependencies und Cross-References

- [KB-0031: Linux Kernel und Systemaufrufe](../02-linux-systems/01-linux-kernel-und-systemaufrufe.md) für Socket-/Kernelübergänge.
- [KB-0036: Sockets und Netzwerk-I/O](../02-linux-systems/06-sockets-und-netzwerk-i-o.md) für lokale Socketsemantik.
- [KB-0039: Linux-Netzwerkstack und Paketpfade](../02-linux-systems/09-linux-netzwerkstack-und-paketpfade.md) für Hostrouting und Policy.
- [KB-0046: Linux-Fehlersuche und Performance-Debugging](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) für Hypothese und sichere Messung.
- KB-0050 bis KB-0054 vertiefen Link, Ethernet, IP, Routing und DNS.
- KB-0105 und KB-0562 nutzen Connectivityverträge später in Architektur- und Plattformkontexten.
- [KB-0720: Portfolioevidenz und Reifemodelle](../30-architect-practice/44-portfolioevidenz-und-reifemodelle.md) sammelt Test- und Entscheidungsnachweise.

## Quellen und Aktualitätsnotizen

| Quelle | Aussage / Verwendung | Stand |
|---|---|---|
| Dateikatalog | Verbindlicher Scope und Reihenfolge. | 2026-09-14 |
| [RFC 1122](https://www.rfc-editor.org/rfc/rfc1122) und [RFC 1123](https://www.rfc-editor.org/rfc/rfc1123) | Internetmodell: Link, IP, Transport sowie Application-/Supportkontext. | IETF/RFC Editor, abgerufen 2026-09-16 |
| [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293) | TCP-Spezifikation und Transportzustände. | IETF/RFC Editor, abgerufen 2026-09-16 |
| [RFC 8200](https://www.rfc-editor.org/rfc/rfc8200) | IPv6-Paket- und Adressierungskontext. | IETF/RFC Editor, abgerufen 2026-09-16 |
| [RFC 9000](https://www.rfc-editor.org/rfc/rfc9000) | QUIC über UDP, Streams, Transport-/TLS-Kontext und Path Migration. | IETF/RFC Editor, abgerufen 2026-09-16 |
| [`socket(7)`](https://man7.org/linux/man-pages/man7/socket.7.html) | lokale Linux Socket-Schnittstelle. | Linux man-pages, abgerufen 2026-09-16 |
| [KB-0036](../02-linux-systems/06-sockets-und-netzwerk-i-o.md) | kanonische lokale Socket-/I/O-Grundlage. | 2026-09-15 |

Aktuelle Versionen von HTTP, QUIC-Implementierungen, TLS-/Proxy-/Load-Balancer-/Firewallfunktionen, IPv6-/DNS-/NAT-Verhalten, Cloudnetworking, Regionen, Limits und Preise sind zeit- und umgebungsabhängig. Vor einer Produktionsentscheidung werden sie am konkreten Client, Netzwerk, Provider, Runtime, Securityprofil und Datenklassifikation geprüft.

## Bonus: New Tech and Innovations

**Stand 2026-09-16 — QUIC integriert sichere Transportfunktionen, Streams und Path Migration über UDP und verschiebt dadurch mehrere Diagnose- und Middleboxannahmen gegenüber klassischem TCP/TLS.** **Reifegrad: Established bis Adopting je Netzwerkpfad.** Ein Pilot prüft Client-/Server-/Load-Balancer-/Proxy-/Firewallunterstützung, 0-RTT- und Retrysemantik, Path-Migration, Telemetrie, Fallback auf unterstützten Transport, Kosten und Security. Grundlage ist [RFC 9000](https://www.rfc-editor.org/rfc/rfc9000).

**Stand 2026-09-16 — Dual-Stack-Connectivity bleibt eine Organisations- und Testaufgabe, nicht nur eine zusätzliche IP-Adresse.** **Reifegrad: Adopting.** Ein Pilot vergleicht DNS, source selection, policy, load balancing, observability, MTU, retries and failure behavior for IPv4 and IPv6; Erfolg bedeutet gleichwertige SLO-/Security-/Recoveryevidenz, nicht beide Antworten im DNS.

**Stand 2026-09-16 — Service Connectivity wird zunehmend als programmierbarer Vertrag aus Discovery, Identity, Transport, Policy, Telemetrie und Retry geführt.** **Reifegrad: Adopting.** Der Nutzen ist klarere Ownership und sicherere Plattformintegration; Risiken sind zusätzliche Intermediaries, Kosten, Telemetriedaten und verdeckte Failure Modes. Einführung nur mit End-to-End-SLO, Trust-Boundary-Modell, automatisierten Denials, Canary, Rollback und Portabilitätsnachweis.

