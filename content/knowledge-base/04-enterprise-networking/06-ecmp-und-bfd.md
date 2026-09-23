---
{"id": "KB-0082", "title": "ECMP und BFD", "domain": "04", "sequence": 6, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["ENTERPRISE", "CLOUD", "PLATFORM", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0064", "concepts": ["FIB", "Next Hop", "Routingtabelle"], "needed_for": "both"}, {"id": "KB-0077", "concepts": ["Konvergenz", "Failure Domain"], "needed_for": "both"}, {"id": "KB-0078", "concepts": ["BGP-Policy", "ECMP-Next Hops"], "needed_for": "both"}, {"id": "KB-0080", "concepts": ["MTU", "Datenpfad", "Service-SLO"], "needed_for": "understanding"}, {"id": "KB-0081", "concepts": ["Underlay", "VTEP", "ECMP"], "needed_for": "both"}], "related": ["KB-0083", "KB-0084", "KB-0562", "KB-0720"], "applies": ["KB-0083", "KB-0084", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein lokales, fiktives Hash- und BFD-Statusmodell analysieren, ohne Routingprotokolle, BFD-Sessions, Interfaces, Sockets oder Pakete zu betreiben.", "rationale": "Das Modell trainiert Zuordnung und Fehlerhypothesen sicher."}, "ARCHITECT-TARGET": {"active": true, "scope": "ECMP-Entropie, Failure Domains, BFD-Scope/Timer, Control-Plane-Reaktion, Rehash, MTU, Kapazität, SLO und Rollback als Vertrag festlegen.", "rationale": "Schnelle Erkennung und Mehrwegtransport sind nur mit End-to-End-Wirkung wertvoll."}, "STAFF-TARGET": {"active": true, "scope": "Hashverteilung, asymmetrische Wege, Mikrobursts, BFD-Flaps, Konvergenz, servicebezogene Loss- und Latenzwirkung sowie Changeblast-Radius messen.", "rationale": "Diese Effekte liegen über Routing-, Hardware- und Anwendungsgrenzen hinweg."}, "CHIEF-TARGET": {"active": true, "scope": "Resilienzbudget, Plattformstandard, Kapazitätsreserve, Sicherheits-/DDoS-Grenzen, Betriebsmodell, Provider-/Cloudabhängigkeit und Investitionspriorität steuern.", "rationale": "Aggressive Timer und Redundanz sind wirtschaftliche und organisatorische Entscheidungen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "S-BFD, micro-BFD, BFD Echo/Demand mode, resilient hashing, flowlet switching, adaptive routing, ASIC-/NIC-Offload und herstellerspezifische Timerprofile sind Vertiefungen.", "rationale": "Kern ist die überprüfbare Verbindung zwischen Mehrweg, Liveness und Serviceverhalten."}}, "lab_validation": [{"lab_id": "KB-0082-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Lokales, fiktives Python-Modell ohne Netzwerkzugriff", "evidence": "Ein stabiler Flow-Hash wählt aus mehreren Next Hops; ein als down markierter Hop wird aus der Auswahl entfernt.", "limitations": "Nicht ausgeführt; keine ECMP-FIB, BFD-Session, Interface, Socket, Paket, Routingprotokoll, Router, Cloud-, Netzwerk- oder Produktionsressourcen."}]}
---
# ECMP und BFD

> **Ziel:** Equal-Cost Multipath (ECMP) verteilt Forwarding über gleichwertige Next Hops; Bidirectional Forwarding Detection (BFD) erkennt bestimmte bidirektionale Pfadausfälle schnell. Zusammen verbessern sie Verfügbarkeit nur, wenn Hashverteilung, Failure Domains, Timer, Control-Plane-Reaktion, Rehash, Kapazität, Asymmetrie und Service-SLO als ein Vertrag behandelt werden.

## Zweck, Definition und Mental Model

ECMP ist ein Forwardingverfahren, bei dem mehrere Next Hops mit gleichem Routingwert verfügbar sind. RFC 2992 analysiert ein Verfahren zur Wahl zwischen solchen Next Hops; konkrete Hashfelder, Bucketalgorithmen, resilient hashing, Per-Packet-Optionen und Hardwaregrenzen sind jedoch implementierungsabhängig. Im üblichen Design soll ein Flow stabil auf einem Pfad bleiben, weil willkürlicher Paketwechsel Reordering, TCP- und Anwendungsprobleme verursachen kann.

BFD ist ein OAM-Protokoll zur schnellen Erkennung von Fehlern auf einem bidirektionalen Pfad zwischen Forwarding Engines. RFC 5880 beschreibt den Basiskontext unabhängig von Medium und Routingprotokoll; RFC 5881 spezifiziert Single-Hop-Anwendung über IPv4/IPv6. BFD prüft Liveness des konfigurierten Pfads, nicht die Nutzbarkeit der Anwendung, nicht die verfügbare Bandbreite und nicht das Geschäfts-SLO.

~~~text
flow 5-tuple / policy
       |
       v
ECMP hash -> bucket -> next hop A | B | C | D
                            |           |
                            v           v
                          BFD state   BFD state
                            |           |
  route/FIB eligible <------+-----------+--> remove failed next hop
       |
       v
rehash affected flows -> surviving capacity -> service outcome
~~~

| Konzept | Liefert | Liefert nicht |
|---|---|---|
| ECMP | mehrere gleichwertige Forwardingoptionen | gleiche Last, gleiche Latenz oder identische Failure Domain |
| Flow Hash | deterministische Auswahl nach Feldern/Policy | Schutz gegen Elephant Flows oder Hashkollisionen |
| Resilient Hashing | begrenztere Umverteilung bei Next-Hop-Änderung | keinen verlustfreien Change oder perfekte Verteilung |
| BFD | schnelle Path-Liveness-Signalisierung | App-/DNS-/TLS-/Auth-/Datenbank-Gesundheit |
| Routing-Konvergenz | neue Forwardingentscheidung nach Zustandsänderung | sofortige Ende-zu-Ende-SLO-Erfüllung |
| Redundanz | alternative Pfade/Komponenten | unabhängige Strom-, Rack-, Provider- oder Softwarefehler |

Das richtige Mental Model ist eine Kette: **Flowklassifikation -> Hash/Bucket -> Next Hop -> physischer/logischer Pfad -> BFD-/Link-/Routingzustand -> FIB-Update -> Rehash -> Anwendungswirkung.** Ein grüner BFD-Status oder vier ECMP-Next-Hops isoliert keinen Ausfall, wenn alle Wege dieselbe Leitung, Stromversorgung, Routerprozess, DCI oder Providergrenze teilen.

## Voraussetzungen und kanonische Grenzen

Vorausgesetzt werden [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0064](../03-network-foundations/16-routingtabellen-und-weiterleitung.md), [KB-0077](01-ospf-und-interne-konvergenz.md), [KB-0078](02-bgp-policy-und-route-reflection.md), [KB-0080](04-mpls-und-label-switching.md) und [KB-0081](05-evpn-und-vxlan-fabrics.md).

- Routingtabelle, FIB und Next Hop sind in KB-0064 kanonisch. Dieses Kapitel erklärt die Mehrweg- und Fehlererkennungsfolgen.
- IGP-/BGP-Konvergenz bestimmt, wann eine BFD- oder Link-Änderung zu einer neuen FIB führt. BFD ist kein Ersatz für korrekte Routingpolicy.
- MPLS und VXLAN nutzen ECMP im Unterbau häufig anders als eine einfache Hostroute. Encapsulation, entropy, MTU und egressseitige Hashsicht gehören zum Pfadvertrag.
- BFD ist nicht für Internetweite App-zu-App-Liveness gedacht. RFC 5881 betont Rateprovisionierung und grenzt solche Nutzung ab.
- QoS, Datacenterdesign und Security Incident Response werden in den verlinkten Folgekapiteln vertieft.

## Core Concepts und technische Semantik

### ECMP: Hash, Buckets und Stabilität

Der Router oder Switch erzeugt aus ausgewählten Paket-/Tunnel-/Policyattributen einen Hash und ordnet ihn einem Next-Hop-Bucket zu. Häufig fließen Quell-/Zieladresse, Protokoll und Ports ein; bei gekapseltem Verkehr kann die Plattform äußere, innere oder ausgewählte Felder verwenden. Welche Felder tatsächlich gelten, ist nur durch aktuelle Plattformdokumentation und Messung beweisbar.

| Designfrage | Prüfen | Fehlannahme |
|---|---|---|
| Hashinput | L2/L3/L4, inner/outer headers, VNI/MPLS entropy, policy | „5-Tuple“ gilt auf jeder Pipeline gleich |
| Bucketmapping | statisch, modulo, resilient, weighted | vier Wege bedeuten exakt 25 Prozent pro Anwendung |
| Flow-Stickiness | Flow-/Sessiondauer, NAT, tunnel termination | per-packet ECMP sei immer unproblematisch |
| Unbalanced load | elephant flows, few heavy clients, asymmetric traffic | viele kleine Testflows beweisen Produktionslast |
| Change | ECMP member add/remove, rehash, drain | ein zusätzlicher Weg verändert keine Sessions |
| Return path | remote hash/policy/NAT/stateful services | Hinweg und Rückweg seien automatisch identisch |

### BFD: Session, Timer und Consumer

Eine BFD-Session handelt Kontrollpaketintervalle und einen Detection Multiplier aus. Aus den ausgehandelten Mindestintervallen und dem Multiplier ergibt sich ein Erkennungsbudget. Die nominelle Zahl ist nicht die reale Anwendungskonvergenz: Scheduling, Hardwareoffload, CPU/ASIC, Paketverlust, Jitter, Control-Plane-Consumer, IGP/BGP-Timer, FIB-Programmierung, Rehash und Anwendungswiederholung addieren Latenz und Risiko.

Bei Single-Hop BFD beschreibt RFC 5881 BFD-Control über UDP Destination Port 3784 und BFD Echo über UDP Destination Port 3785. Diese Protokollangabe bedeutet nicht, dass eine Firewallregel ohne Scope, Rategrenze, Authentisierung, TTL-/Interfaceprüfung und Monitoring sicher wäre. Echo- und Demand-Mode sowie Authentisierungsdetails benötigen eine plattformspezifische, aktuelle Prüfung.

### ECMP und BFD gemeinsam

BFD macht einen Next Hop oder eine Routingadjazenz schneller unbrauchbar; der Routing-/Forwardingstack entfernt oder entwertet ihn; ECMP verteilt nachfolgende oder neu gehashte Flows auf verbleibende Wege. Bereits laufende State-/Long-Lived-Flows können kurz brechen oder sich anders verhalten. Das Service-SLO benötigt deshalb einen Plan für connection draining, retries, idempotency, load shedding und Kapazitätsreserve außerhalb des Netzwerks.

## Architektur und Datenfluss

### Normalpfad

1. Routing-/Control-Plane installiert mehrere wirklich gleichwertige Next Hops gemäß Policy.
2. Forwarding bildet pro Flow oder durch platformdefinierte Regel einen Hash und wählt einen Bucket.
3. Der Paketpfad durchläuft Link, LAG, ECMP, Tunnel, Firewall/Service Insertion und Ziel; Rückverkehr wählt unabhängig nach dessen Kontext.
4. BFD, Linkstate und Routingtelemetrie überwachen jeweils begrenzte Aspekte.
5. Serviceobservability misst synthetische und reale SLO-Wirkung.

### Ausfallpfad

~~~text
link / remote forwarding / path defect
  -> BFD misses or hardware/link signal
  -> BFD state changes
  -> IGP/BGP/track consumer reacts
  -> route/FIB/LFIB/ECMP member changes
  -> affected flows rehash, retry or fail
  -> capacity / queue / loss changes on survivors
  -> application SLI and incident workflow decide outcome
~~~

Die Ausfallzeit ist nicht nur BFD Detection Time. Für jeden Dienst werden die beteiligten Uhren notiert: Hardware-/Linksignal, BFD, IGP/BGP withdrawal, route/FIB programming, ECMP rebalance, TCP/QUIC retry, application timeout, load balancer health check, observability delay und menschliche Eskalation. Der verlangte Service-SLO bestimmt den Gesamtbudgetanteil jeder Schicht.

### Konfiguration und Implementierung als Vertrag

BFD-Timer oder ECMP-Optionen werden nicht global maximiert. Das Konfigurationsdesign muss pro Topologieklasse einen Scope, eine Kapazitätsanalyse, einen Changeplan und einen Consumer benennen.

| Ebene | Vertragselemente | Akzeptanztest |
|---|---|---|
| Topologie | unabhängige Pfade, LAG/ECMP, Rack/Spine/Provider/DCI-Grenzen | physische und logische Failure-Domain-Map |
| Routing | ECMP-Kriterien, Prefix-/Next-Hop-/BGP-/IGP-Policy, maximum paths | erwartete RIB/FIB vor und nach Failure |
| Hash | Felder, inner/outer awareness, seed/buckets, stickiness | representative flow matrix und imbalance report |
| BFD | peer/scope, interval/min-RX/detect multiplier, echo/auth, consumer | paket-/CPU-/timerbudget plus flap drill |
| Protection | BFD/Link/IGP/BGP interaction, dampening, hold-down, drain | single and correlated failure timelines |
| Capacity | N-1/N-2 policy, headroom, QoS, microburst, recovery traffic | survivor links carry allowable load |
| Operations | alert, event correlation, owner, maintenance, rollback | change canary, baseline, reversion proof |

Eine abstrakte Absicht, keine Produktkonfiguration:

~~~yaml
service_class: latency-sensitive-platform
ecmp:
  policy: flow-sticky
  eligible_next_hops: independently-failure-domain-reviewed
  imbalance_alert: defined-per-platform
bfd:
  scope: direct-routing-adjacencies-only
  detection_budget: allocated-from-end-to-end-slo
  consumer: routing-control-plane
  flap_guard: defined-and-tested
capacity:
  survivability: n-1-with-service-budget
operations:
  owner: network-platform
  rollback: restore-prior-policy-and-timers
~~~

Vor Umsetzung sind NOS-/Firmware-/Controller-/ASIC-Version, BFD-Offload, Timergranularität, BFD Session Scale, ECMP-/LAG-Bucketlimit, Hashfelder, Tunnelentropie, Defaultwerte, Authentisierungsunterstützung, CoPP/ACL und Lizenzierung mit aktueller Herstellerdokumentation zu verifizieren. Unterschiedliche Hardware in einer Fabric kann sonst verschiedene Reaktion zeigen.

## Scalability, Performance und Capacity

Aggressive BFD-Timer können CPU, Interrupts, Control Plane, Linecard und Packetbudget belasten. Viele ECMP-Pfade verbessern nicht automatisch die Auslastung, wenn nur wenige große Flows oder ein Hashungleichgewicht bestehen. Die Leistungsdimensionen müssen getrennt geplant werden.

| Dimension | Messung | Warnsignal |
|---|---|---|
| BFD | Sessions, control/echo pps, state changes, jitter, CPU/offload | mass flap, false down, CPU saturation |
| Routing | RIB/FIB update latency, route churn, peer resets | BFD down ohne rechtzeitige FIB-Wirkung |
| ECMP | buckets/member, bytes/pps, flow count, imbalance | hot link bei verfügbaren Pfaden |
| Queue | utilization, microbursts, ECN/drop, per-class latency | survivor capacity reicht nominell, nicht bei Burst |
| Failure | detection-to-SLI impact, recovery/retry rate, MTTR | Timer klein, aber Servicefehler groß |
| Security | malformed/unauthorized BFD traffic, CoPP drops | unter Last keine verlässliche Liveness |

Kapazität wird für den Verlust eines Pfads und dessen Last gerechnet, nicht nur für Normalbetrieb. Wenn vier Pfade im Normalfall je 25 Prozent führen, muss der Rest nach einem Ausfall nicht zwangsläufig 33 Prozent sauber tragen: Elephant Flows, Headroom, Queues, Providerpolicies, geänderte Hashbuckets und Rückweg können die Verteilung verzerren. Messe echte repräsentative Flowgrößen und Datenklassen.

## Reliability und Failure Modes

| Symptom | Mögliche Ursachen | Gegenprobe |
|---|---|---|
| BFD flappt, Link bleibt up | Congestion, CPU/offload, CoPP/ACL, Timer zu aggressiv, asymmetrischer Pfad | BFD pps/jitter/drops, resource metrics, separate physical/forwarding evidence |
| BFD down, ECMP nutzt Pfad weiter | Consumer/track/routing/FIB mismatch, stale hardware state | timeline BFD -> RIB -> FIB -> data flow messen |
| ECMP arbeitet, ein Link ist hot | heavy flows, hash fields, tunnel entropy, bucket behavior | per-flow/per-member byte/pps statt nur link average |
| Hinweg gut, Rückweg schlecht | unterschiedliche ECMP/Policy/NAT/stateful firewall | beide Richtungen und State-/service boundaries nachzeichnen |
| Ausfall erzeugt breiten Loss | rehash, capacity deficit, microbursts, application sessions | Loss/time series, queue, retry, survivor capacity |
| schneller Timer erzeugt Incident | correlated packet loss, control-plane overload, flapping cascade | timer ladder, blast radius, dampening/rollback |
| keine BFD-Fehler trotz Serviceausfall | BFD prüft nur spezifischen Liveness-Pfad | app SLI, DNS/TLS/auth/data dependencies getrennt prüfen |

Ein widerstandsfähiges Design verwendet eine Fehlerleiter: lokale physische Signale, BFD für benannte Forwardingpfade, IGP/BGP für Reachability, Overlay-/Tunneltelemetrie, synthetische Serviceprobes und Anwendungssignale. Jede Stufe hat Scope, Delay, False-Positive-Risiko und Owner. Sie darf nicht aus einer einzelnen BFD-Zahl eine Anwendungsgarantie machen.

## Security, Governance und Compliance

BFD-Controltraffic und routing-relevante Livenesssignale sind Angriffspunkte und Betriebsabhängigkeiten. Der genaue Schutz muss Protokollscope und Plattform berücksichtigen. RFC 5881 nennt für Single-Hop unter anderem Interfacebindung, UDP-Ports und TTL-Check-Kontext; damit folgt keine pauschale Freischaltungsregel.

| Kontrolle | Zweck | Nachweis |
|---|---|---|
| Interface-/Peer-Scope | BFD nur mit autorisierten Nachbarn verbinden | Inventory, binding, ACL und peer review |
| Authentisierung und TTL-/Hop-Schutz | Spoofingrisiko reduzieren, wenn unterstützt/angemessen | Plattformfähigkeit, policy, negative test |
| CoPP/Rate Limits | Control Plane gegen Flooding schützen | legitimate pps budget und overload behavior |
| Timer Governance | flapping/false-down Blast Radius begrenzen | approval class, baseline, canary, rollback |
| Change Audit | Hash-/BFD-/routing-Änderung zuordnen | immutable change ID, config diff, event timeline |
| Telemetry Privacy | Flow-/Topologie-/Standortdaten schützen | data classification, access, retention, redaction |

BFD sollte nicht als globales Liveness-Scanning für Anwendungen, untrusted Endpunkte oder das Internet eingesetzt werden. Der Scope, die erlaubte Last, die Authentisierungs-/ACL-Entscheidung und der Umgang mit verlorener Observability sind Teil der Securityarchitektur. In Incidents ermöglicht die klare Korrelation von Statechange, Routeupdate und Servicewirkung eine schnelle Entscheidung, ohne unkontrolliert sämtliche Timer zu erhöhen.

## Observability und Troubleshooting

Eine brauchbare Messkette ist:

~~~text
Flow/tenant/service + direction + packet size
  -> ECMP hash input/bucket/member
  -> physical/LAG/underlay/tunnel path
  -> BFD session state, interval, loss/jitter
  -> route and FIB/LFIB transition
  -> rehash/survivor queue/capacity
  -> target and reverse path
  -> application SLI, retry and error rate
~~~

Erfasse BFD Sessionzustand, negotiated timers, transitions, packet-/drop-/CPU-/offload-Metriken, Routing-/FIB-Zeitstempel, ECMP member/bucket/flowverteilung, Link/queue/ECN/drop, tunnelentropie, Config Drift und Änderungskontext. Aus Datenschutz- und Sicherheitsgründen werden Flowdaten minimal erhoben und sensible Topologie-/Kundenzuordnung rollenbasiert geschützt.

Troubleshooting beginnt mit genau einem betroffenen Flow und einem Zeitfenster. Vergleiche ihn mit einem funktionierenden Flow derselben Datenklasse. Prüfe Hashinput, gewählten Member, Hin- und Rückweg, BFD-/Link-/routing state, FIB-Programmierung, Queue/MTU/ACL, Zielservice und Change. Ein ICMP-Ping oder einzelne BFD Up-Meldung widerlegt keinen selektiven L4-/Tunnel-/NAT-/application failure.

## Kosten, Trade-offs und Anti-Patterns

| Entscheidung | Nutzen | Kosten oder Risiko |
|---|---|---|
| kürzere BFD-Intervalle | schnellere Erkennung bestimmter Pfadausfälle | pps/CPU/false positives/flapping |
| längere BFD-Intervalle | geringere Control-Plane-Last | größerer Detektionsbeitrag zum SLO |
| mehr ECMP-Pfade | Kapazität und Redundanz | Hash-/failure-/operational complexity |
| per-flow stickiness | weniger Reordering | einzelne heavy flows können ungleich verteilen |
| per-packet Weiterleitung | mögliche Paketverteilung | Reordering und stateful-/TCP-Risiko |
| resilient hashing | begrenztere Rehashwirkung | implementation-/capacity-/observability requirements |
| große Reserve | bessere N-1-Servicehaltung | Port-, transit- und Energiekosten |

Kosten sind nicht nur Hardwareports. Sie umfassen Headroom, Lizenzen/Features, Telemetrie, Routing-/Fabric-Operations, Test- und Failure-Drills, Supportbereitschaft, Incidentkosten und den Wert geringerer Unterbrechung für Plattform- und GenAI-Workloads.

Anti-Patterns: BFD als Anwendungsgesundheit ausgeben; minimale Timer als Qualitätsmetrik feiern; LAG und ECMP gleich behandeln; Hashannahmen nicht messen; nur durchschnittliche Linkauslastung statt per-flow/queue prüfen; Rückweg und stateful Middleboxes ignorieren; BFD-Flaps nachträglich durch Alarmunterdrückung verdecken; einen einzigen Ausfall drillen und korrelierte Failure Domains nicht modellieren.

## Staff-, Principal- und Chief-Level-Entscheidungen

**Staff:** Erstellt eine aus Messpunkten bestehende Konvergenztimeline und eine Flowmatrix: Normalpfad, asymmetrischer Rückweg, heavy flow, MTU-Grenze, Mitgliedsausfall, BFD-Flap, Control-Plane-Lag, N-1-Überlast und Rollback. Sie verbindet eine millisekundengenaue Netzbeobachtung mit den tatsächlich relevanten SLI/Fehlern der Anwendung.

**Principal:** Standardisiert BFD-Scope-/Timerprofile, ECMP-/hash-/telemetry-Vorgaben, Capacitymodelle, Hardwarequalifikation, Canary-/Drill- und Changeprozesse. Die Plattform darf keine globalen Defaulttimer auf heterogene Router, Switches, Firewalls, Cloudanbindungen und Anwendungen übertragen.

**Chief:** Entscheidet, welche Resilienzniveaus finanziert sind und welches Ausfallbudget geschäftlich akzeptiert wird. Er oder sie steuert Provider-/Cloud-/Datacenter-Failure-Diversität, Network-Platform-Ownership, Security-baseline, Skills, Supportvertrag und Exit. Die Frage ist nicht „wie klein ist der Timer?“, sondern „welche Geschäftsfähigkeit bleibt bei einem belegten Ausfall?“.

## Production Checklist

- [ ] Service-SLO und zulässiges Detection-/Convergence-/Retrybudget sind schriftlich auf die Schichten verteilt.
- [ ] ECMP-Mitglieder sind auf physische, logische, Strom-, Rack-, Provider- und Software-Failure-Diversität bewertet.
- [ ] tatsächliche Hashfelder, Bucket-/resilient-Hash-Verhalten, Stickiness und Hin-/Rückweg sind auf Zielplattform verifiziert.
- [ ] BFD-Scope, Peer/Interface, Timer, Detect Multiplier, Auth-/ACL-/CoPP- und Consumerverhalten sind freigegeben.
- [ ] BFD-/Link-/IGP-/BGP-/FIB-Zeitlinie und Data-Plane-Auswirkung wurden für representative Flows gemessen.
- [ ] N-1-/recovery-Kapazität berücksichtigt elephant flows, queues, microbursts, QoS und Datenklassen.
- [ ] BFD-Flap, correlated loss, stale state, device overload, FIB lag und asymmetrischer Rückweg wurden getestet.
- [ ] Alerting korreliert Flow/Service, ECMP member, BFD/routing transition, queue/drop, Change und Owner.
- [ ] Canary, baseline, maintenance, rollback, incident communication und aktuelle Vendor-/Providergrenzen sind nachgewiesen.

## Interviewfragen

### 1. Was bedeutet ECMP und warum verteilt es nicht zwingend perfekt?

**Antwort:** ECMP wählt zwischen gleichwertigen Next Hops. Die Verteilung hängt von Hashinput, Bucketalgorithmus, Flowgrößen, Kapselung und Hardware ab. Wenige große Flows können einen Link dominieren.

### 2. Welches Problem löst BFD?

**Antwort:** BFD kann bestimmte bidirektionale Pfadausfälle zwischen Forwarding Engines schnell erkennen und Routing-/Tracking-Consumer informieren. Es misst weder Anwendungsgesundheit noch verfügbare Kapazität.

### 3. Warum kann ein sehr kleiner BFD-Timer die Verfügbarkeit verschlechtern?

**Antwort:** Unter Last, Jitter, Paketverlust oder CPU-/offload-Problemen kann er false downs und Flapping auslösen. Diese verursachen Rehash, Routingchurn, Loss und großflächige Instabilität.

### 4. Was misst du bei einem ECMP-Hotspot?

**Antwort:** Ich vergleiche pro Member bytes/pps, flow count, Hashinput, heavy flows, queues/drops, ECN, direction, tunnelentropie und Rückweg. Interfaceaverage genügt nicht.

### 5. Ist ein BFD-Up-Status ein Beweis, dass eine API funktioniert?

**Antwort:** Nein. Er belegt nur die konfigurierte Pfadliveness im BFD-Scope. DNS, TLS, Auth, Route/VRF, Firewall, Anwendung, Datenquelle und SLO müssen zusätzlich geprüft werden.

### 6. Wie wird ein BFD-Ausfall zum Serviceausfall?

**Antwort:** BFD state change kann Routing/FIB und ECMP-Mitglied ändern. Rehash und Survivorlast wirken auf Flows; deren Retry, State und Kapazität bestimmen, ob die Anwendung Fehler sieht.

### 7. Wie testest du Asymmetrie?

**Antwort:** Ich messe Hin- und Rückweg getrennt, einschließlich Hash/Policy/NAT/firewall state, BFD-Scope, MTU, Queue und target-side return path. Eine einseitige Trace oder Session genügt nicht.

## Praktische Labs

### KB-0082-LAB-01: Fiktives ECMP- und BFD-Modell

Das Modell bildet nur eine deterministische Flowzuordnung und die Entfernung eines unbrauchbaren Next Hops ab. Es sendet keine Daten und startet keine BFD-Session.

~~~python
import hashlib

next_hops = ["spine-a", "spine-b", "spine-c", "spine-d"]
bfd_state = {"spine-a": "up", "spine-b": "up", "spine-c": "down", "spine-d": "up"}

def choose(flow, hops):
    healthy = [h for h in hops if bfd_state[h] == "up"]
    digest = int(hashlib.sha256(flow.encode()).hexdigest(), 16)
    return healthy[digest % len(healthy)]

flow = "10.0.0.10:55000->10.0.1.20:443/tcp"
assert choose(flow, next_hops) != "spine-c"
print({"flow": flow, "selected_next_hop": choose(flow, next_hops)})
~~~

**Erwartung:** Der fiktiv als down markierte Hop wird nicht ausgewählt. **Gegenprobe:** Markiere alle Hops down und ergänze eine kontrollierte Fehlerbehandlung statt modulo durch eine leere Menge auszuführen. **Grenze:** Das Modell repräsentiert weder realen Hashinput noch BFD-Timer, FIB, Packet Loss, Routingkonvergenz, Queue, Kapazität oder Anwendungssignale. **Cleanup:** Es entstehen keine Ressourcen.

## Dependencies, Cross-References und Quellen

1. [RFC 2992: Analysis of an Equal-Cost Multi-Path Algorithm](https://datatracker.ietf.org/doc/html/rfc2992), abgerufen 2026-09-16. ECMP und Next-Hop-Auswahl als Analysekontext.
2. [RFC 5880: Bidirectional Forwarding Detection](https://datatracker.ietf.org/doc/rfc5880/), abgerufen 2026-09-16. BFD-Ziel, Liveness-, Session- und Forwarding-Engine-Kontext.
3. [RFC 5881: BFD for IPv4 and IPv6 Single Hop](https://datatracker.ietf.org/doc/html/rfc5881), abgerufen 2026-09-16. Single-Hop-Scope, UDP, Rateprovisionierung und Sicherheitskontext.
4. [draft-ietf-bfd-rfc5881bis-01](https://datatracker.ietf.org/doc/draft-ietf-bfd-rfc5881bis/), abgerufen 2026-09-16. Aktiver Internet-Draft zur möglichen Ablösung von RFC 5881; kein finaler Standard.
5. Curriculum: KB-0082 im Dateikatalog, Stand 2026-09-14. Scope und Einordnung.

Zeitabhängige Aussagen über NOS-/Firmware-/ASIC-/NIC-Offload, Hashfelder, BFD-Timergranularität, Sessionlimits, Controller-/Cloudrouting, Draftstatus, Provider- oder Hardwareverhalten müssen vor einem konkreten Entwurf gegen aktuelle Hersteller-, IETF-, Vertrags- und Securitydokumentation verifiziert werden. Vertiefe anschließend mit [KB-0083](07-netzwerkdesign-mit-qos.md), [KB-0084](08-datacenter-netzarchitektur.md), [KB-0562](../23-security-identity/26-security-incident-response.md) und [KB-0720](../30-architect-practice/44-portfolioevidenz-und-reifemodelle.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad am 2026-09-16 | Architekturentscheidung |
|---|---|---|
| RFC5881bis | **Aktiver Internet-Draft, kein finaler Standard.** Er kann RFC 5881 ablösen. | Status und Platformsupport vor einer Normreferenz oder Migration prüfen. |
| Seamless BFD | **Established in unterstützten Implementierungen.** Es kann Session-Setup anders gestalten. | Skalierung, Reflector-Redundanz, Observability und Failureblast-Radius testen. |
| Resilient Hashing und Flowlet Switching | **Adopting bis established je ASIC/NOS.** Sie können Rehash- oder Imbalanceeffekte reduzieren. | Reordering, stateful middleboxes, heavy-flow-Verteilung und Upgradepfad messen. |
| In-band / streaming telemetry | **Adopting.** Kürzere Zeitkorrelation zwischen Flow, Queue und Konvergenz kann möglich sein. | Sampling, Kosten, Privacy, Zeitbasis, Retention und Alarmqualität nachweisen. |

Ein Pilot akzeptiert eine ECMP/BFD-Innovation erst, wenn Hash-/Bucket-/Next-Hop-/Flow-/Rückwegsemantik, Underlay-/BFD-/Control-Plane-/FIB-/Rehash-/MTU-/Queue-/Capacity-Verhalten, Failure-Diversität, Service-SLO, Security/Privacy, Observability, Cost, Owner, Change und Rollback nachgewiesen sind.
