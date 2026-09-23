---
{"id": "KB-0055", "title": "ICMP und Pfadfehler", "domain": "03", "sequence": 7, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Zeitachse", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0049", "concepts": ["IP-Paket", "Schichten", "End-to-End-Analyse"], "needed_for": "both"}, {"id": "KB-0052", "concepts": ["IPv4-Präfix", "Route", "Next Hop"], "needed_for": "understanding"}, {"id": "KB-0053", "concepts": ["IPv6", "ICMPv6", "Path MTU"], "needed_for": "both"}], "related": ["KB-0054", "KB-0056", "KB-0057", "KB-0058", "KB-0562", "KB-0720"], "applies": ["KB-0056", "KB-0057", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein reines Python-Zustandsmodell ordnet simulierte Echo-, Unreachable-, Time-Exceeded- und Packet-Too-Big-Signale einer Hypothese zu.", "rationale": "Das Lab erzeugt keine Netzwerkpakete, führt kein Ping oder Traceroute aus und verändert keine Route, Firewall, MTU, Cloud- oder Produktionsressource."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein Connectivityvertrag definiert zulässige ICMP/ICMPv6-Typen, PMTU-Verhalten, family-spezifische Probes, Securitygrenzen, Telemetrie, Owner und Rollback.", "rationale": "ICMP wird als benötigter Control-/Error-Plane-Teil entworfen, ohne externen Diagnosedatenverkehr pauschal freizugeben."}, "STAFF-TARGET": {"active": true, "scope": "Incident-Triage trennt Echo-Erreichbarkeit, Route, Next Hop, Path MTU, Firewall, Transport, TLS und Anwendung und dokumentiert die Beweisgrenze jeder Messung.", "rationale": "Traceroute- und Ping-Ausgaben werden als zeit- und pfadbezogene Evidenz behandelt, nicht als vollständiges Topologiemodell oder Berechtigungsnachweis."}, "CHIEF-TARGET": {"active": true, "scope": "Die Organisation steuert standardisierte, sichere Netzdiagnose, ICMPv4/v6-Policy, PMTU-Resilienz, Provider-/SaaS-Übergaben, Datenminimierung und Incident-Eskalation als Betriebsfähigkeit.", "rationale": "Pauschales Filtern kann Kundenpfade beschädigen; pauschale Freigabe kann Angriffsfläche oder Informationsabfluss vergrößern. Die Policy braucht differenzierte Risiken und Outcomes."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Router-/ASIC-ICMP-Ratelimits, MPLS/overlay-traceroute, Paris traceroute, BFD, eBPF-Packet-Path, packet capture, PMTUD/PLPMTUD-Implementierung und DDoS-Edge-Policy sind Spezialistentiefe.", "rationale": "Die Zielrollen bewerten Zulässigkeit, Grenzen, Messplan und Eskalation; die paketgenaue Implementierung liegt bei Netz-/Securityfachleuten."}}, "lab_validation": [{"lab_id": "KB-0055-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox ohne Socket- oder Interfacezugriff", "evidence": "Signalzuordnung, PMTU-Entscheidung, Traceroute-Beweisgrenzen und negative Probes wurden als sichere Fallarbeit geprüft.", "limitations": "Nicht ausgeführt; kein Ping, Traceroute, Porttest, Packet Capture, ICMP/ICMPv6, MTU-, Route-, Firewall-, Cloud- oder Produktionszugriff wurde verwendet."}]}
---
# ICMP und Pfadfehler

> **Ziel:** ICMP ist Rückmeldung aus dem IP-Umfeld, keine Gesundheitsampel für einen Dienst. Nutze Echo, Unreachable, Time Exceeded und Packet Too Big, um eine engere Hypothese zu bilden. Trenne dabei Weg, Filter, MTU, Transport, TLS und Anwendung – und verändere keinen Netzpfad, bevor Evidenz und Owner klar sind.

## Purpose, Definition und Scope

Internet Control Message Protocol (ICMP) ergänzt IP mit Kontroll- und Fehlermeldungen. ICMPv4 ist in RFC 792 grundlegend beschrieben; ICMPv6 in RFC 4443. Beide können etwa Erreichbarkeits- oder Verarbeitungsfehler melden. Sie machen IP jedoch nicht zuverlässig: Ein Paket kann verloren gehen, ohne dass ein ICMP-Fehler zurückkehrt; eine ICMP-Antwort kann gefiltert oder rate-limitiert sein; ein Echo Reply sagt nichts über TLS, Authentisierung oder Business-Operation aus.

Dieses Kapitel behandelt:

- Echo/Echo Reply, Destination Unreachable, Time Exceeded, Parameter Problem und Packet Too Big;
- Ping und Traceroute als begrenzte Diagnoseinstrumente;
- IPv4- und IPv6-Path-MTU-Discovery (PMTUD);
- gefiltertes, begrenztes oder missbräuchlich verwendetes ICMP als Fehler- und Securitythema;
- Architektur-, Beobachtungs-, Kosten-, Governance- und Incidententscheidungen.

Nicht im Scope: Routingprotokolle, detaillierte TCP-/UDP-Implementierung, Paketmitschnitt oder produktive Firewallkonfiguration. Diese folgen in den jeweiligen Vertiefungen.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | IETF-RFCs beschreiben Protokolle, Fehlersignale und Filterempfehlungen. |
| HANDS-ON-TARGET | Das Lab simuliert Signale offline. Es ist kein Scan und kein Netzwerkdiagnoselauf. |
| ARCHITECT-TARGET | ICMP/ICMPv6-Policy und PMTU werden je Servicepfad, Address Family und Trust Boundary definiert. |
| STAFF/PRINCIPAL | Teams dokumentieren Signal, Scope, Zeit, erwartete Gegenbeobachtung und den nächsten erlaubten Test. |
| CHIEF | Provider-/Security-/SRE-Operating Model erhält sichere Diagnose-, Telemetrie- und Eskalationsgrenzen. |

## Mental Model: Fehlerrückmeldung mit eingeschränkter Sicht

```text
application operation
  -> transport
  -> IP packet
  -> routers / overlays / firewalls / destination
           |
           +-> may return ICMP feedback about a specific processing event

No ICMP response ≠ path healthy
ICMP Echo Reply ≠ application healthy
ICMP Unreachable ≠ universal root cause
```

Die richtige Frage lautet: **Welches ursprüngliche Paket, welcher Address Family-Pfad, welches Gerät und welches Zeitfenster werden durch dieses ICMP-Signal beschrieben?** Erst danach lässt sich ein Signal mit Route, Policy, MTU, Transport und Anwendung korrelieren.

## Prerequisites und Dependencies

| ID | Art | Bedeutung |
|---|---|---|
| [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Anwendung und Lab | Hypothesen, Zeitachse, Messbudget und Gegenprobe. |
| [KB-0049](01-osi-und-tcp-ip-als-analysemodelle.md) | Anwendung und Lab | IP-Kapselung und die Abgrenzung zur Anwendung. |
| [KB-0052](04-ipv4-adressierung.md) | Verständnis | IPv4-Präfix, Route und Next-Hop-Kontext für ICMPv4. |
| [KB-0053](05-ipv6-adressierung-und-uebergang.md) | Anwendung und Lab | ICMPv6, Extension-/PMTU- und Dual-Stack-Kontext. |

## Core Concepts

### ICMPv4 und ICMPv6 vergleichen

| Funktion | ICMPv4 | ICMPv6 | Aussagegrenze |
|---|---|---|---|
| Echo Request / Reply | Typ 8 / 0 | Typ 128 / 129 | Erreichbarkeit und Antwort für diesen Echo-Pfad, nicht Dienstgesundheit. |
| Destination Unreachable | Typ 3, Codes differenzieren Netz/Host/Protokoll/Port/Fragmentation | Typ 1, Codes differenzieren etwa no route/admin/port | Signal muss mit Originalziel, Policy und Zeit korreliert werden. |
| Packet Too Big | v4: Destination Unreachable, Code „fragmentation needed“ im PMTUD-Kontext | v6: Typ 2 | Pfad- bzw. Encapsulation-MTU-Hinweis, nicht automatisch Hostdefekt. |
| Time Exceeded | Typ 11 | Typ 3 | Hop Limit/TTL oder Reassembly-Kontext; Grundlage vieler Traceroute-Verfahren. |
| Parameter Problem | Typ 12 | Typ 4 | Paket-/Headerverarbeitungssignal, kann Middlebox-/Endpoint-Kompatibilität anzeigen. |
| ND/RA | getrennte Mechanismen | Teil der ICMPv6-Familie | IPv6 benötigt ICMPv6 über Fehlerdiagnose hinaus. |

ICMPv6 ist stärker mit IPv6-Control-Plane-Funktionen verbunden als ICMPv4: Neighbor Discovery und Router Advertisements bauen auf ICMPv6 auf. Daher ist „ICMPv6 blockieren“ besonders riskant. Eine sichere Policy unterscheidet Typ, Code, Richtung, Scope, Quelle, Rate und Servicekontext.

### Echo und Ping

Ping sendet typischerweise Echo Requests und bewertet Echo Replies plus Laufzeit und Verlust. Daraus folgt nur:

- ein verwendeter Pfad konnte zu diesem Zeitpunkt Echo verarbeiten;
- eine Gegenstelle oder Zwischenkomponente antwortete;
- die Messung hatte bestimmte Packet-Size-/DSCP-/Source-/Address-Family-Eigenschaften.

Daraus folgt **nicht**:

- dass TCP/UDP/QUIC zum Serviceport erreichbar ist;
- dass DNS den richtigen Dienst liefert;
- dass TLS-Zertifikat, Authorization, Rate Limit, Datenbank oder Business-Operation funktionieren;
- dass derselbe Pfad für andere Sources, Pods, Zonen, Provider oder ECMP-Hashes gilt;
- dass ein fehlender Reply ein absoluter Netzausfall ist.

### Time Exceeded und Traceroute

Traceroute erhöht schrittweise den IPv4 TTL bzw. IPv6 Hop Limit. Wenn ein Router den Wert auf Null dekrementiert, kann er Time Exceeded zurückgeben. Dadurch lassen sich mögliche Zwischenhops sichtbar machen.

```text
probe TTL/HopLimit=1 -> router A may return Time Exceeded
probe TTL/HopLimit=2 -> router B may return Time Exceeded
...
probe reaches destination -> destination-specific reply or application/probe outcome
```

Hops können unsichtbar bleiben, Antworten rate-limitiert sein, Rückwege abweichen, ECMP andere Pfade wählen oder Firewalls die Probeform anders behandeln. Traceroute zeigt eine Beobachtungsreihe, nicht die vollständige oder autoritative physische Topologie.

### Path MTU Discovery

Eine Verbindung kann bei kleinen Requests funktionieren und bei größeren Payloads hängen, wenn irgendwo im Pfad die effektive MTU kleiner ist als angenommen und die notwendige Fehlerrückmeldung oder Anpassung fehlt.

```text
effective path MTU
= smallest forwarding constraint across link, tunnel, overlay, encryption,
  load balancer, provider and endpoint path

payload budget
= path MTU - IP header - transport header - protocol/security overhead
```

Für IPv4 verweist PMTUD auf das „fragmentation needed“-Verhalten; für IPv6 melden Router Packet Too Big, da IPv6-Router nicht fragmentieren. RFC 1191 und RFC 8201 beschreiben die jeweiligen Verfahren. Eine pauschale feste Payloadgröße ist keine Architekturstrategie: Kapselung, IP-Version, TLS/QUIC, Service Mesh, VPN, Provider und Endpoint können den Budgetwert verändern.

## Architecture und Data Flow

### Fehlerfluss: großer Upload in einem Dual-Stack-Service

```text
Client resolves A and AAAA
  -> client selects IPv6
  -> v6 route crosses overlay + encrypted egress
  -> effective PMTU is smaller than assumed
  -> router/firewall drops oversized packet and should signal ICMPv6 Packet Too Big
  -> client stack updates path-MTU behavior
  -> transport/application retries within correct size budget

Failure variants:
  A. Packet Too Big filtered or not correlated -> apparent timeout/hang
  B. Client falls back to IPv4 -> user sees partial success, v6 debt remains
  C. v6 policy denies required ICMPv6 -> service-specific outage
```

Der Owner eines solchen Problems kann Application, Platform, Network, Cloud Provider oder Security sein. Die Triage beginnt nicht mit einer Firewalländerung, sondern mit der spezifischen Operation, Address Family, Payloadklasse, Route, Encapsulation, Policy und korrelierten Events.

### Diagnoseschichten

| Übergang | Frage | Geeignete Evidenz |
|---|---|---|
| Name/Address Family | Welche A-/AAAA-Antwort wurde verwendet? | resolver- und clientnahe Ereignisse. |
| Route/Next Hop | Wohin sollte das Originalpaket gehen? | autorisierte Route-/Flow-/Platformevidenz. |
| ICMP-Signal | Welcher Type/Code bezieht sich auf welches Originalpaket? | zeitkorrelierte Header-/Flowmetadaten, ohne unnötigen Payload. |
| Path MTU | Tritt der Fehler erst ab bestimmter Größen-/Tunnelklasse auf? | kontrollierte, freigegebene synthetische Probe oder End-to-End-Metrik. |
| Transport | Handshake, Retransmit, Timeout, Portzustand? | anwendungs-/transportnahe Telemetrie. |
| Security | Wurde das Paket/ICMP durch Policy verworfen? | Firewall-/security decision record. |
| Anwendung | Ist die beabsichtigte Operation erfolgreich? | API-/Job-/Business-SLO, nicht nur Echo. |

## Protocols, Standards, Tools und Technologien

| Bezug | Wofür er dient | Grenze |
|---|---|---|
| [RFC 792](https://www.rfc-editor.org/rfc/rfc792) | ICMPv4-Grundtypen, Echo, Unreachable, Time Exceeded. | historisch erweitert; konkrete OS-/Router-Verhalten prüfen. |
| [RFC 4443](https://www.rfc-editor.org/rfc/rfc4443) | ICMPv6 Fehlermeldungen und Echo. | ND/RA sind weitere ICMPv6-bezogene Funktionen. |
| [RFC 1191](https://www.rfc-editor.org/rfc/rfc1191) | IPv4 Path MTU Discovery. | Endsystem-/Middlebox-/Tunnelverhalten ist aktuell konkret zu testen. |
| [RFC 8201](https://www.rfc-editor.org/rfc/rfc8201) | IPv6 Path MTU Discovery. | ersetzt keine sichere ICMPv6-Policy. |
| [RFC 4884](https://www.rfc-editor.org/rfc/rfc4884) | Extended ICMP Multi-Part Messages. | Sichtbarkeit und Support produktabhängig. |
| [RFC 4890](https://www.rfc-editor.org/rfc/rfc4890) | Empfehlungen für ICMPv6-Filterung. | konkrete Threat-/Zone-/Productpolicy bleibt nötig. |
| Ping/Traceroute/Flow Logs/Synthetics | Hypothesenprüfung und zeitkorrelierte Beobachtung. | autorisieren, ratenbegrenzen und als Messung statt Wahrheit behandeln. |

## Konfiguration und Implementation

### ICMP-Policy als Matrix

```text
service path: public-api-v6
inbound control-plane:
  ICMPv6 types: only those required by documented function
  source scope: expected network zones
  rate policy: platform-validated
outbound error-plane:
  allow required error feedback for established and permitted flows
observability:
  type/code, family, zone, policy decision, original-flow correlation
privacy:
  minimize quoted packet content and retention
rollback:
  owner-approved, tested, time-bounded
```

Diese Formulierung vermeidet zwei gefährliche Extreme: vollständige Freigabe aller Diagnosepakete und vollständiges Verwerfen ohne Funktionsanalyse. Das konkrete Regelwerk hängt von Edge, Workload, Link, Tunnel, Provider und Bedrohungsmodell ab.

### PMTU-resilientes Design

1. Inventarisiere alle Kapselungen: VLAN, VXLAN, VPN, mTLS/QUIC, service mesh, proxy, load balancer, provider edge.
2. Definiere die erwarteten Address-Family- und Payloadklassen pro kritischem Flow.
3. Erlaube und beobachte die für PMTUD nötigen Fehlersignale entlang der zugelassenen Pfade.
4. Teste große und kleine kontrollierte Transaktionen in jeder Zone und Familie.
5. Korreliere Abbrüche mit ICMP/ICMPv6, Firewall, NIC/overlay, transport und service metrics.
6. Ändere MTU, filter oder encapsulation nur owner-approved und mit Rückbau.
7. Dokumentiere die effektive Grenze als zeit-/plattformgebundene Annahme, nicht als ewige Konstante.

## Scalability und Performance

ICMP ist häufig rate-limitiert, priorisiert oder durch Control-Plane-Schutz begrenzt. Hohe ICMP-Mengen können Attacken, Fehlkonfiguration, MTU-Blackholes, Routingloops, Scans oder Wiederanlaufchurn anzeigen; sie sind selbst kein Ziel für ungebremste Telemetrie.

| Metrik | Was sie signalisiert | Was sie nicht beweist |
|---|---|---|
| Echo loss/RTT per controlled probe | Erreichbarkeit/Latenz dieser Probe | AnwendungssLO oder vollständigen Pfad. |
| Destination Unreachable nach Type/Code | möglicher route-/policy-/portbezogener Fehler | Ursache ohne Originalflow-/Change-Kontext. |
| Time Exceeded Rate | TTL/HopLimit-/Loop-/Traceroute-/reassembly-Signal | alle Router im Pfad oder einen Routingloop ohne Prüfung. |
| Packet Too Big Events | MTU-/encapsulation-/path Hinweis | vollständige PMTU-Erholung des Clients. |
| ICMP drop/rate-limit decisions | Control-Plane-Policy-/Lastsignal | dass alle ICMP-Pakete bösartig sind. |
| Payload-size-dependent errors | mögliche PMTU-Grenze | dass nur MTU und nicht App/transport Ursache ist. |

Budgets, Sampling und Alerting werden pro Zone/Family/Baseline definiert. Ein einzelner verlorener Traceroute-Hop ist kein Pager. Eine erhöhte, korrelierte PMTU-/Timeoutrate für kritische End-to-End-Flows kann hingegen ein Incident sein.

## Reliability und Failure Modes

| Symptom | Wahrscheinliche Klasse | Sichere nächste Frage |
|---|---|---|
| Ping erfolgreich, API fehlgeschlagen | transport/TLS/auth/app/policy | Welche konkrete Serviceoperation scheitert nach IP? |
| Ping fehlgeschlagen, API erfolgreich | Echo bewusst gefiltert/rate-limitiert | Ist die beabsichtigte Anwendungstransaktion gesund? |
| Traceroute endet mit Sternen | Router/Firewall/ECMP/Rate Limit/Rückweg | Welche Probeform wurde verwendet, und welche anderen Signale existieren? |
| Große Requests hängen, kleine klappen | PMTU/encapsulation/ICMP filter/fragmentation | Tritt es family-, zone- oder payloadabhängig auf? |
| ICMP Unreachable administratively prohibited | security policy or route/ACL boundary | Welcher Owner/Intent definiert den erlaubten Flow? |
| Time Exceeded steigt | loop, probe, route issue or rate behavior | Gibt es korrelierte route changes und echte user impact? |
| Nur IPv6 betroffen | ICMPv6/RA/ND/PMTU/v6 policy | Welche v6-spezifische Path-/Policy-Differenz besteht? |
| Rückmeldungen fehlen komplett | filtering, rate limiting, asymmetry or loss | Nicht aus Stille „kein Fehler“ oder „alles down“ schließen. |

## Security, Governance und Compliance

ICMP kann Informationsgewinn, Amplification-/Flooding- oder Spoofing-Risiken erzeugen; gleichzeitig beschädigt übermäßige Filterung notwendige Netzwerkfunktionen. Sicherheitsentscheidungen müssen daher entlang von Trust Boundaries getroffen werden:

- welche Type/Codes werden für zugelassene Flows benötigt;
- welche Source-/Destination-Scope und Stateful-Korrelation gelten;
- welche Rate-/Burst-Grenzen schützen Control Plane und Endpoints;
- wie werden gefälschte oder unplausible Fehlermeldungen erkannt bzw. begrenzt;
- welche Telemetrie wird sicher gespeichert, ohne unnötig Paketinhalt oder personenbezogene Netzdaten zu erfassen;
- wie werden Provider, SOC, Network, Platform und Application im Incident eingebunden.

Ein Traceroute aus einem Produktionsworkload oder gegen externe Ziele ist kein Standard-Self-Service. Zulässigkeit, Zielscope, Rate, Datenklasse, Dauer und Owner werden vorher definiert. Dasselbe gilt für MTU-Tests und Captures.

## Observability und Troubleshooting

Ein minimal brauchbares Ereignis enthält:

```text
timestamp, family, probe/flow type, source/destination class,
route/zone/next-hop class, icmp type/code,
quoted-flow correlation where permitted, payload-size class,
policy decision, rate-limit indication, transport/TLS/app outcome,
change/deployment correlation id
```

### Triagebaum

```text
1. Definiere die tatsächliche Nutzer-/Serviceoperation.
2. Prüfe Name, gewählte Address Family und Ziel-IP.
3. Prüfe Route/Next Hop und Security Intent.
4. Ordne ICMP Type/Code einem zeitgleichen Originalflow zu.
5. Prüfe Payload- und Encapsulation-Abhängigkeit für PMTU.
6. Prüfe Transport, TLS, Authorization und Application getrennt.
7. Wähle die kleinste zulässige Gegenprobe oder eine owner-approved Änderung.
```

**Wichtig:** `ping`, `traceroute` und ähnliche Werkzeuge werden lokal je Plattform unterschiedlich implementiert und können verschiedene Protokollformen verwenden. Ihre Ausgabe ohne Command-Parameter, Source, Family, Zeit, Ziel und Netzwerkcontext ist für einen Incidentbericht unzureichend.

## Cost und FinOps

PMTU-/ICMP-Fehler erzeugen Kosten über langsame Uploads, Wiederholungen, Supporttickets, erhöhte Egress-/Retry-Mengen, Incidentzeit und versteckte IPv6-Ausfälle. Zu restriktive Policies verschieben Fehler in scheinbar zufällige Timeouts; zu offene Diagnosedaten erhöhen Security- und Observabilitykosten.

Bewerte daher:

- Kunden- und Transaktionswirkung pro Payload- und Family-Klasse;
- Kosten von wiederholtem Datentransfer und Retry-Stürmen;
- Aufwand für kontrollierte synthetische Probes gegenüber reaktiver Fehlersuche;
- Edge-/Firewall-/Provider-Funktions- und Telemetriebedarf;
- Retention-/Access-Kosten für Flow-/ICMP-Evidenz;
- Kosten langfristiger Sonder-MTU-/Filterausnahmen.

Preise, Limits und Datenkosten sind provider- und vertragsabhängig; sie werden am tatsächlichen Pfad validiert.

## Trade-offs und Anti-Patterns

| Entscheidung | Gewinn | Risiko | Leitplanke |
|---|---|---|---|
| ICMP restriktiv nach Type/Scope zulassen | erforderliche Funktionen bei reduzierter Fläche | komplexere Policy | tested matrix pro Service-/Trust-Pfad. |
| Alles ICMP blockieren | einfache Regel | PMTU, ICMPv6/ND und Diagnose brechen | niemals ohne funktionale Nachweise. |
| Alles ICMP erlauben | schnelle Beobachtbarkeit | Missbrauch/Information exposure | keine allgemeine Freigabe ohne Threat Model. |
| Ping als SLO | einfache Messung | keine Service-/TLS-/Auth-Aussage | End-to-end business probe ergänzen. |
| Traceroute als Topologieinventar | sichtbare Hops | ECMP, filtering, asymmetry, hidden hops | nur als zeitgebundene Hypothese. |
| Feste MTU kleinsetzen | kann akut helfen | Performance-/Fragmentierungs-/Debt-Folge | Ursache und Exit behandeln. |

**Anti-Pattern: Echo Reply = Produktionsfreigabe.** Ein Echo Reply ist ein L3-Diagnosesignal, nicht eine Freigabe für Anwendungsqualität.

**Anti-Pattern: fehlendes ICMP = Beweis für Firewallproblem.** Verlust, Rate Limit, asymmetrischer Rückweg, Endpointpolicy und Probeform sind Alternativen.

**Anti-Pattern: ICMPv6 wie optionales ICMPv4 behandeln.** ICMPv6 ist Teil der IPv6-Control Plane; pauschales Blocken kann Discovery und PMTU zerstören.

**Anti-Pattern: MTU ändern, bevor der Pfad verstanden ist.** Ein globaler Wert kann Symptome verdecken und andere Flows schädigen.

## Staff-, Principal- und Chief-Level Decisions

### Staff / Principal

1. Erstelle pro Connectivityklasse eine ICMP/ICMPv6- und PMTU-Policy-Matrix mit Type/Code, Richtung, Zone, State, Rate, Telemetrie und Owner.
2. Verankere family-spezifische synthetische End-to-End-Probes für kritische Payload- und Verbindungsarten.
3. Fordere bei jedem Netzincident Originalflow-/Zeit-/Family-/Route-Kontext statt unvollständiger Ping-/Traceroute-Screenshots.
4. Prüfe MTU bei jedem Overlay, VPN, Service Mesh, Load Balancer und Providerübergang als explizite Architekturannahme.
5. Automatisiere nur read-only Evidenz und freigegebene Tests; Cache-/MTU-/Firewall-/Routeänderungen bleiben kontrollierte Changes.

### Chief

1. Entscheide organisationsweit, welche Diagnosefähigkeit in Edge, Cloud, On-Prem und Providerübergaben mindestens verfügbar sein muss.
2. Balance Securityschutz, Datenminimierung und Wiederherstellungsfähigkeit durch verbindliche ICMP-/Telemetrie-Standards.
3. Mache IPv6-PMTU- und ICMPv6-Readiness zu einem Release-/Provider-Reviewkriterium.
4. Messe wirtschaftliche Wirkung von MTU-Blackholes, Retry-Stürmen, Family-Fallback und Incidentdauer.
5. Baue klare Eskalationswege zwischen App, SRE, Platform, Network, Security und externen Providern.

## Production Checklist

- [ ] ICMPv4-/ICMPv6-Type-/Code-/Scope-Policy ist für kritische Ingress-/Egress-Flows dokumentiert und getestet.
- [ ] IPv6-ND/RA/PMTU benötigte ICMPv6-Funktionen werden nicht durch pauschale Regeln gestört.
- [ ] PMTU-Annahmen enthalten alle Tunnel-, Overlay-, Encryption-, LB- und Providergrenzen.
- [ ] A-/AAAA-Pfade besitzen getrennte Probe-, SLO-, Alert- und Rollbackkriterien.
- [ ] Security- und Rate-Limit-Entscheidungen sind mit Flow-/Servicewirkung korrelierbar.
- [ ] Echo und Traceroute sind als begrenzte Diagnoseinstrumente im Runbook beschrieben.
- [ ] Traceroute-/Ping-Tests folgen Scope-, Rate-, Daten- und Owner-Grenzen.
- [ ] Payloadgrößenabhängige End-to-End-Tests existieren für kritische Workloads.
- [ ] ICMP-/PMTU-Telemetrie minimiert Paketinhalt und schützt Zugriff/Retention.
- [ ] Incident-Runbook trennt Route, Next Hop, ICMP, PMTU, Firewall, Transport, TLS und Anwendung.
- [ ] MTU-/Firewall-/Routeänderungen haben Akzeptanzkriterium, Change-Owner und Rückbau.
- [ ] Provider-/CNI-/Firewall-/LB-Support und Limits sind versionsbezogen dokumentiert.

## Praktisches Lab: Offline-Signalklassifikation

**Status:** `reviewed_only`. Das Lab modelliert nur Ereignisobjekte in Python. Es sendet keine Probe und kommuniziert mit keinem Host.

```python
signals = [
    {"family": "ipv4", "type": "echo_reply", "payload_class": "small"},
    {"family": "ipv4", "type": "destination_unreachable", "code": "port"},
    {"family": "ipv6", "type": "packet_too_big", "mtu": 1280},
    {"family": "ipv6", "type": "time_exceeded", "hop": 5},
]

def classify(event):
    kind = event["type"]
    if kind == "echo_reply":
        return "L3_ECHO_EVIDENCE_ONLY"
    if kind == "destination_unreachable":
        return f"CHECK_ROUTE_POLICY_OR_ENDPOINT_{event.get('code', 'UNKNOWN')}"
    if kind == "packet_too_big":
        return f"CHECK_PMTU_AND_ICMPV6_POLICY_MTU_{event['mtu']}"
    if kind == "time_exceeded":
        return "HOPLIMIT_OR_TRACEROUTE_CONTEXT_NOT_FULL_TOPOLOGY"
    return "NEEDS_CONTEXT"

for signal in signals:
    print(signal, "=>", classify(signal))
```

### Gegenproben

- Ein `echo_reply` plus simuliertes TLS-Failure muss als L3-Erfolg **und** höherer Schichtfehler erscheinen.
- Ein fehlendes Signal darf nicht in `PATH_HEALTHY` übersetzt werden.
- Ein `packet_too_big` bei IPv6 wird als PMTU-/Policy-Hypothese behandelt, nicht als Anlass, ICMPv6 zu blockieren.
- Mehrere `time_exceeded`-Events bilden Hops ab, beweisen aber ohne Route-/ECMP-/Rückwegkontext keine Topologie.

### Cleanup

Lösche ausschließlich die temporäre lokale Python-Datei. Das Lab hinterlässt keine Netzwerk-, Routing-, MTU-, Firewall-, Cloud- oder Produktionsänderung.

## Interviewfragen mit Antworten

### 1. Was beweist ein erfolgreicher Ping?

Dass eine Echo-Probe in ihrer konkreten Address Family, Source-/Destination-, Policy- und Zeitkonstellation eine Antwort erhalten hat. Er beweist weder Serviceport, TLS, Authorization, Datenintegrität noch Geschäftsoperation.

### 2. Warum kann eine Anwendung bei großen Payloads scheitern, bei kleinen aber funktionieren?

Eine effektive Path MTU kann durch Tunnel, Overlays, Encryption oder Providersegmente kleiner sein als angenommen. Wenn notwendige Fragmentierungs-/Packet-Too-Big-Signale nicht durchkommen oder nicht verarbeitet werden, entstehen Timeouts oder Hänger statt sauberer Anpassung.

### 3. Wie funktioniert Traceroute konzeptionell?

Es sendet Probes mit steigendem TTL/Hop Limit. Zwischenrouter können beim Ablauf Time Exceeded senden, sodass der Client Hops beobachtet. ECMP, Rate Limits, Filterung, asymmetrische Rückwege und Probeform begrenzen die Aussage.

### 4. Warum ist ICMPv6-Sperrung gefährlicher als eine pauschale ICMPv4-Sperrung?

ICMPv6 trägt zusätzlich wichtige IPv6-Control-Plane-Funktionen wie Neighbor Discovery und Router Advertisements sowie PMTU-Rückmeldungen. Eine pauschale Sperre kann IPv6 grundlegend stören.

### 5. Bedeutet Destination Unreachable, dass das Zielsystem ausgefallen ist?

Nein. Code und Originalflow können Route, Next Hop, Firewall, administrative Policy, Port/Protocol, Endpoint oder Zwischenkomponente betreffen. Der Zeitpunkt und die zugehörige Operation sind nötig.

### 6. Wie sollte ein Securityteam ICMP behandeln?

Mit einer getesteten Matrix nach Address Family, Typ/Code, Richtung, Trust Boundary, Source-/Destination-Scope, State, Rate Limit und Observability. Weder `allow all` noch `deny all` ist ein belastbares Standarddesign.

### 7. Was dokumentierst du in einem PMTU-Incident?

Betroffene Operation, Address Family, Source/Destinationklasse, Payload-/Encapsulationklasse, Zeitpunkt, Route/Zone, ICMP/ICMPv6-Evidenz, Securitydecision, Transport-/TLS-/Appwirkung, Changekorrelation, Owner, Gegenprobe und Rückbauplan.

## Dependencies und Cross-References

| Beziehung | Datei | Verwendung |
|---|---|---|
| Voraussetzung | [KB-0049](01-osi-und-tcp-ip-als-analysemodelle.md) | IP-Schicht und Diagnosemodell. |
| Voraussetzung | [KB-0053](05-ipv6-adressierung-und-uebergang.md) | IPv6-/ICMPv6-/PMTU- und Dual-Stack-Kontext. |
| Weiterführung | [KB-0056](08-tcp-verbindungen-und-ueberlastkontrolle.md) | Transportreaktionen, Retransmits und Verbindungsfehler. |
| Weiterführung | [KB-0057](09-udp-und-datagrammverhalten.md) | Datagramm-, Port-Unreachable- und Anwendungskontext. |
| Weiterführung | [KB-0058](10-dns-aufloesung-und-caches.md) | DNS von Pfad-/ICMP-Fehlern abgrenzen. |
| Anwendung | [KB-0562](../23-security-identity/26-security-incident-response.md) | Security-Triage, Beweissicherung und koordinierte Eindämmung. |
| Evidenz | [KB-0720](../30-architect-practice/44-portfolioevidenz-und-reifemodelle.md) | PMTU-/Connectivity-ADR, SLO und reale Betriebsevidenz. |

## Quellen und zeitliche Einordnung

| Quelle | Verwendung | Stand |
|---|---|---|
| Dateikatalog KB-0055 | verbindlicher Scope und Reihenfolge. | Planstand 2026-09-14 |
| [RFC 792](https://www.rfc-editor.org/rfc/rfc792) | ICMPv4 Echo, Unreachable, Time Exceeded und Parameter Problem. | abgerufen 2026-09-16 |
| [RFC 4443](https://www.rfc-editor.org/rfc/rfc4443) | ICMPv6 Fehler- und Echo-Nachrichten. | abgerufen 2026-09-16 |
| [RFC 1191](https://www.rfc-editor.org/rfc/rfc1191) | IPv4 Path MTU Discovery. | abgerufen 2026-09-16 |
| [RFC 8201](https://www.rfc-editor.org/rfc/rfc8201) | IPv6 Path MTU Discovery. | abgerufen 2026-09-16 |
| [RFC 4884](https://www.rfc-editor.org/rfc/rfc4884) | Extended ICMP Multi-Part Messages. | abgerufen 2026-09-16 |
| [RFC 4890](https://www.rfc-editor.org/rfc/rfc4890) | ICMPv6-Filterempfehlungen. | abgerufen 2026-09-16 |
| [KB-0049](01-osi-und-tcp-ip-als-analysemodelle.md) und [KB-0053](05-ipv6-adressierung-und-uebergang.md) | kanonische Schicht- und IPv6-Voraussetzungen. | 2026-09-16 |

Standards, OS-/Router-/Firewall-/Load-Balancer-Implementierungen, CNI-/Cloud-/Providerpfade, Ratelimits, Preise und Compliancevorgaben sind zeit- und umgebungsabhängig. Vor einer Diagnoseänderung oder Regelanpassung sind die aktuelle Produktdokumentation, Service-Intent, Datenklasse, Owner, Supportvertrag und Rückbau im konkreten Pfad zu prüfen.

## Bonus: New Tech and Innovations

**Stand 2026-09-16 — Path-Layer-MTU-Discovery-Ansätze und anwendungsnahe Telemetrie können PMTU-Blackholes auch dann erkennen helfen, wenn klassische ICMP-Rückmeldungen unvollständig sind.** **Reifegrad: adaptiert je Stack.** Sie ergänzen, ersetzen aber nicht die korrekte ICMP-/ICMPv6-Policy und den getesteten Pfad.

**Stand 2026-09-16 — eBPF-, Flow- und OpenTelemetry-nahe Netzbeobachtung kann ICMP-/Route-/Payload- und Anwendungsergebnisse zeitlich korrelieren.** **Reifegrad: adaptiert bis etabliert je Plattform.** Die Einführung braucht klare Capturepunkte, Datenschutz, Sampling, Offload-Sichtbarkeit und einen sicheren Zugriffspfad.

**Stand 2026-09-16 — Moderne Zero-Trust-Edges verbinden differenzierte ICMP/ICMPv6-Policy mit Workload Identity und family-spezifischen SLOs.** **Reifegrad: adaptiert.** A pilot accepts diagnostic policy automation only when required control-plane signals, security boundaries, evidence quality and rollback are explicit.

