---
{"id": "KB-0075", "title": "Netzwerkdiagnose entlang des Anfragepfads", "domain": "03", "sequence": 27, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Messpunkt", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0054", "concepts": ["CIDR", "Subnetz", "Adressbereich"], "needed_for": "understanding"}, {"id": "KB-0058", "concepts": ["DNS", "Resolver", "TTL"], "needed_for": "both"}, {"id": "KB-0064", "concepts": ["Routing", "FIB", "Next Hop"], "needed_for": "both"}, {"id": "KB-0067", "concepts": ["TLS", "Authority", "Zertifikat"], "needed_for": "understanding"}, {"id": "KB-0072", "concepts": ["Proxy", "Terminierung", "Headertrust"], "needed_for": "both"}, {"id": "KB-0074", "concepts": ["Capture", "Zeitachse", "Evidenzgrenze"], "needed_for": "both"}], "related": ["KB-0073", "KB-0076", "KB-0154", "KB-0562", "KB-0720"], "applies": ["KB-0076", "KB-0154", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Das Lab wertet eine lokale synthetische Anfrage-Timeline mit DNS-, Route-, TCP-, TLS-, Proxy- und Anwendungsereignissen aus; es öffnet keine Verbindung und verändert keine Netzkonfiguration.", "rationale": "Es trainiert Schichten- und Gegenhypothesen ohne Traffic, DNS-Abfragen, Trace, Socket, Cloud, Container, VPN oder Produktionsressource."}, "ARCHITECT-TARGET": {"active": true, "scope": "Der Pfadvertrag beschreibt Name, Adresse/Familie, Source- und Destination-Policy, Route/NAT/Firewall, TLS-/Proxyterminierung, Endpointwahl, Identitäts- und Trace-Korrelation, Timeouts, Retry, Messpunkte und Datenklassen.", "rationale": "Eine erfolgreiche Anwendungstransaktion entsteht nur, wenn alle Hops, Policies und Semantiken zusammenpassen; ein einzelner Ping ist kein End-to-End-Nachweis."}, "STAFF-TARGET": {"active": true, "scope": "Teams betreiben einen wiederholbaren Diagnosebaum mit sicheren Messpunkten, Beweisgrenzen, Service-Ownern, Logs/Metriken/Traces/Flowlogs und klaren Eskalationsschnittstellen zwischen App, Platform, Network und Security.", "rationale": "Sie vermeiden Teamsilos und unterscheiden Namen-, Auswahl-, Route-, Policy-, Transport-, TLS-, Proxy-, Ziel- und Anwendungsfehler mit Gegenproben."}, "CHIEF-TARGET": {"active": true, "scope": "Die Organisation standardisiert End-to-End-Diagnose als Plattformfähigkeit mit gemeinsamen SLO-Sprache, Asset-/Ownership-Modell, Telemetrie-/Privacy-Standards, Incident-Prozess, Lieferantenanforderungen, Kostenallokation und Ausnahmegovernance.", "rationale": "Ohne nachvollziehbaren Pfadvertrag steigen MTTR, Eskalationskosten und Sicherheitsrisiko; pauschale Netzwerkzugriffe oder Volltelemetrie wären keine vertretbare Gegenmaßnahme."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "BGP/EVPN/MPLS, SD-WAN, Service-Mesh-Datapaths, Cloud Transit, eBPF, encrypted DNS, NAT64/DNS64, multi-region anycast, packet forensics und detaillierte vendor CLI sind Spezialtiefe.", "rationale": "Die Zielrollen müssen Diagnose- und Governanceverträge verantworten; spezialisierte Netzimplementierung und Carrier-/Security-Forensik erfolgt mit Fachexperten."}}, "lab_validation": [{"lab_id": "KB-0075-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox mit eingebetteter fiktiver Timeline ohne Netzwerkzugriff", "evidence": "Das Modell trennt DNS-Antwort, Routing-/Policy-Entscheidung, TCP, TLS, Proxy und Anwendung und markiert fehlende Messpunkte als Unsicherheit.", "limitations": "Nicht ausgeführt; es wurden keine DNS-Abfragen, Pakete, Sockets, Routen, Firewallregeln, VPNs, Proxies, Container, Cloud-, Netzwerk- oder Produktionssysteme verwendet oder verändert."}]}
---
# Netzwerkdiagnose entlang des Anfragepfads

> **Ziel:** Diagnose beginnt bei einer konkreten Geschäftstransaktion und folgt deren Name-, Auswahl-, Route-, Policy-, Transport-, TLS-, Proxy- und Anwendungsweg. Jede Aussage benennt Messpunkt, Zeitbasis und Gegenhypothese.

## Zweck, Definition und Scope

Ein Anfragepfad ist die Kette von Entscheidungen und Hops, die eine Client-Absicht in eine verwertbare Antwort überführt: Name und Resolver, Adresse und Familie, lokale Source-Selection, Route, NAT/Firewall, Transport, TLS, Proxy/Load Balancer, Zielprozess und Antwortweg. Die Kette ist oft nicht symmetrisch und ein sichtbarer Hop ist nicht automatisch die Ursache.

Dieses Kapitel zeigt eine systematische End-to-End-Diagnose. Es verbindet Namensauflösung, Adressierung, Routing, Policy, TCP/UDP/QUIC, TLS, Proxies, Zielauswahl und Anwendungstelemetrie. Es ersetzt keine produkt- oder carrier-spezifische Routingkonfiguration, keine Penetrationstests und keine unautorisierte Netzbeobachtung.

### Lernziele

1. Eine fehlgeschlagene Anfrage als überprüfbare Pfadfrage statt als pauschales Netzwerkproblem formulieren.
2. DNS, Adresse/Familie, Route, Policy, Transport, TLS, Proxy und Anwendung in falsifizierbarer Reihenfolge prüfen.
3. Messpunkte und Korrelations-IDs wählen, die NAT, Connection Pools und Asymmetrie berücksichtigen.
4. Timeout, Retry, Dual Stack und Terminierung von einer Ursache trennen.
5. Sichere, minimale Diagnoseartefakte mit Owner, Retention und Incident-Übergabe führen.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Ein Dienstpfad ist eine Komposition von Entscheidungen, nicht eine gerade Linie im Topologiediagramm. |
| HANDS-ON-TARGET | Lokale Timeline mit mindestens einer fehlenden Beobachtung und einer Gegenhypothese. |
| ARCHITECT-TARGET | Ein Pfadvertrag verbindet Naming, Connectivity, Security, Terminierung und Anwendungssignale. |
| STAFF/PRINCIPAL | Teams führen einen einheitlichen, messpunktbewussten Eskalationsprozess. |
| CHIEF | Ownership, Telemetrie, Datenschutz, SLOs, Kosten und Ausnahmen werden organisationsweit gesteuert. |

## Mental Model und Invarianten

~~~text
business attempt
 -> name / resolver / address candidates
 -> source address and route / egress / NAT / policy
 -> connection / encryption / proxy or gateway
 -> selected endpoint / application dependency
 -> response path / retries / client-visible outcome
~~~

Ein Ping beweist höchstens, dass ein bestimmter ICMP-Pfad zu einem Zeitpunkt teilweise funktionierte. Er beweist weder DNS, den richtigen Port, TCP/QUIC, TLS-Authority, Proxyheader, Zielreadiness, Anwendungsauthentisierung noch Rückweg für die konkrete Transaktion.

Invarianten:

1. **Identität vor Interpretation:** Welche Clientpopulation, Authority, Zieladresse, Port, Versuch und Zeit meint der Bericht?
2. **Policy vor Paketromantik:** Route und Paket können korrekt sein, obwohl Firewall, Egress, TLS oder Tenantpolicy den Geschäftsweg bewusst verhindert.
3. **Messpunkt ist Teil der Aussage:** Host, Proxy, NAT, Edge und Ziel sehen unterschiedliche Identitäten und Zeiten.
4. **Antwortpfad kann abweichen:** ECMP, NAT, Proxy und asymmetrische Routen verhindern naive Hin- und Rückwegannahmen.
5. **Retry verändert das Experiment:** Der zweite Versuch kann andere DNS-Adresse, IP-Familie, Verbindung oder Zielinstanz verwenden.

## Prerequisites und Dependencies

| ID | Art | Nutzen |
|---|---|---|
| [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Verständnis/Lab | Hypothese, Zeitreihe und Gegenprobe. |
| [KB-0054](06-cidr-und-subnetting.md) | Verständnis | Subnetze, Prefixe und Source/Destination-Policy. |
| [KB-0058](10-dns-und-namensaufloesung.md) | Verständnis/Lab | Resolver, TTL, A/AAAA und negative Antworten. |
| [KB-0064](16-routing-grundlagen.md) | Verständnis/Lab | FIB, Next Hop und Pfadentscheidung. |
| [KB-0067](19-tls-verbindungen-und-zertifikatspruefung.md) | Verständnis | TLS-Authority und Zertifikats-/Policygrenze. |
| [KB-0072](24-forward-und-reverse-proxies.md) | Verständnis/Lab | Terminierung, Hops, Headertrust und Upstream. |
| [KB-0074](26-paketmitschnitte-mit-wireshark-und-tcpdump.md) | Verständnis/Lab | Evidenzgrenzen, Zeitachsen und sichere Capture-Fallarbeit. |

## Core Concepts: Der Pfadvertrag

| Schicht der Frage | Benötigte Evidenz | Häufige Verwechslung |
|---|---|---|
| Geschäftsvorgang | Attempt-/Trace-ID, Deadline, erwartete Semantik | Jede 5xx sei Netzwerkfehler |
| Name | Name, Resolver, A/AAAA, TTL, Antwortcode, Cache | DNS-Antwort beweise Endpunktgesundheit |
| Adresse/Familie | Kandidaten, v4/v6, Source-Selection, NAT64/DNS64 falls anwendbar | Eine IP sei der ganze Dienst |
| Route | FIB/Next Hop, Egress, Zone, Route Policy | Traceroute sei ein vollständiger Datenpfad |
| Policy | Firewall/SG/ACL, Egress, Identity, Rate/Quota | Timeout sei immer Drop |
| Transport | 5-Tupel, Handshake, Reset, QUIC- oder UDP-Grenze | Ping beweise Portreachability |
| TLS/HTTP | SNI/Authority, ALPN, Zertifikats-/mTLS-Policy, Status | TLS-Erfolg beweise die Anwendung |
| Proxy/LB | Downstream-/upstream-Flow, Target, Retry, Drain | Client-IP sei am Backend sichtbar |
| Ziel | Ready/Limits/Queue/Dependency/DB, Serverlog | Zielprozess sei gleich End-to-End-Service |
| Rückweg | Antwortzeit, NAT/Proxy, Route, Clientdeadline | Hinweg und Rückweg seien identisch |

RFC 8305 erklärt, warum dual-stack Clients mehrere Adressen und Familien asynchron auswählen können. Ein Client kann daher für dieselbe Nutzeraktion konkurrierende Verbindungsversuche führen; die Diagnose muss gewinnenen und abgebrochenen Versuch trennen. Die dort beschriebenen Verzögerungswerte sind Teil eines konkreten Clientalgorithmus und kein allgemeines Produktionsdefault.

### Ein Diagnosevertrag

~~~text
Request identity: tenant, client class, trace/attempt ID, authority, method or operation
Name contract: resolver path, DNS privacy mode, expected A/AAAA, TTL/cache boundary
Connectivity: source zone, destination prefix, egress/NAT, route, policy owner
Security: TLS/mTLS authority, trust root, identity, certificate and header boundary
Service: proxy/LB target policy, readiness, timeout/retry/deadline, dependency path
Evidence: points, timestamps/clock quality, logs/metrics/traces/flowlogs/PCAP boundary
Governance: purpose, data class, access, retention, incident owner, rollback/expiry
~~~

## Architecture und Data Flow

Ein Client ruft api.example.test auf. Der Clientresolver liefert v6 und v4; ein Dual-Stack-Client kann Verbindungsversuche gestaffelt führen. Ein Edgeproxy terminiert TLS, prüft Authority und leitet über einen Upstream-Pool an ein API-Target weiter. Dieses Target ruft eine Datenabhängigkeit auf. Ein Clienttimeout kann deshalb an jeder Grenze entstehen.

~~~text
client -> local resolver -> DNS cache/recursive -> A/AAAA candidates
 client source -> route/FIB -> egress/NAT/firewall -> edge listener
 edge TLS/proxy -> route policy / target group -> API endpoint -> dependency
                <- upstream timings / status / trace boundary <-
client-visible result <- response route / NAT / deadline / retry policy <-
~~~

Messpunkte: Clientlog und DNS-Resolverlog geben Absicht und Namenssicht; Flowlog oder Firewallstatus gibt Policy-/Flusssicht; Edge-/Proxylog gibt Terminierung und Targetwahl; Ziel- und Dependency-Telemetrie geben Bearbeitungssicht. Kein Messpunkt sollte geheime Nutzlasten erfassen, wenn Metadaten und sichere IDs reichen.


## Protocols, Standards und Tools

| Werkzeug oder Standard | Geeignete Frage | Grenze |
|---|---|---|
| DNS-/Resolverlogs | Welcher Name wurde wann wie beantwortet? | Antwort enthält weder erreichbaren Port noch Servicebereitschaft. |
| Route/FIB-/Flow-/Firewall-Evidenz | Welche Source-/Destination-/Policyentscheidung wurde getroffen? | Sie zeigt nicht automatisch TLS oder Anwendung. |
| curl/HTTP-Clientdiagnose in eigener Testumgebung | Welche URL-, Authority-, TLS- und HTTP-Semantik sieht der Client? | Ein einzelner Client ist keine gesamte Nutzerpopulation. |
| Traces nach W3C Trace Context | Welcher bekannte Servicehop bearbeitete denselben Versuch? | Nur vertrauenswürdige propagierte IDs verwenden; keine Netzwerkvollständigkeit behaupten. |
| PCAP nach KB-0074 | Was war an einem konkreten Sensor sichtbar? | Capture-Loss, Encryption, Offload und Messpunkt begrenzen die Aussage. |

Die W3C Trace Context Empfehlung definiert eine standardisierte Kontextweitergabe, nicht eine Autorisierung für beliebige Header. Trust Boundaries entscheiden, ob ein eingehender Kontext akzeptiert, erneuert oder verworfen wird. HTTP-Semantik, TCP und TLS bleiben in den kanonischen Kapiteln maßgeblich.

### Sichere Implementierung als Diagnose-Runbook

1. Formuliere Fehlerklasse, Nutzerwirkung, Zeitfenster, Clientklasse, Authority und Attempt-/Trace-ID.
2. Prüfe zuerst vorhandene und minimal-invasive Evidenz: Client-, Resolver-, Edge-/Proxy-, Ziel- und Flow-/Policylogs.
3. Vergleiche Name, IP-Familie, Kandidat, Quellzone, Route, Policy, Port und TLS-Authority gegen den Pfadvertrag.
4. Korreliere nur Identitäten, die an jedem Hop belastbar zuordenbar sind; NAT und Pools können den 5-Tupel-Schlüssel umschreiben.
5. Wähle bei verbleibender Unsicherheit einen autorisierten zweiten Messpunkt oder eine sichere synthetische Probe. Kein Produktivtraffic, keine großflächigen Scans und keine Geheimnisse im Ticket.
6. Schreibe Beobachtung, Gegenhypothese, Sicherheit, Owner und Rücknahme der Diagnosemaßnahme ins Incidentprotokoll.

## Scalability, Performance und Reliability

### Latenzbudget und Queueing

Für eine synchrone Anfrage gilt näherungsweise:

~~~text
end-to-end latency =
name resolution + connection establishment + TLS + proxy queue
+ upstream service + dependency time + response path + client scheduling
~~~

Die Summanden überlappen bei Connection Reuse, parallelem DNS oder Happy Eyeballs teilweise. Deshalb ist es falsch, sie aus unterschiedlichen Versuchen einfach zu addieren. Ein Latenzbudget braucht Messpunkte und Korrelation pro Versuch.

| Signal | Engpasshypothese | Gegenprobe |
|---|---|---|
| nur bestimmte v6-Kandidaten langsam | AAAA/Routing/MTU/Policy/Familie | v4/v6, Resolver- und Egresssicht getrennt vergleichen |
| DNS schnell, TCP nicht aufgebaut | Route, Firewall, Egress, Zielport, NAT | FIB/Policy/Flowlog und Ziel-/Edge-Sicht |
| TCP schnell, TLS langsam/Alert | Authority, Zertifikat, mTLS, Proxy, Cipher/ALPN | TLS-Richtung und terminierender Hop |
| Edge schnell, Upstream langsam | Targetwahl, Pool, Queue, Dependency | downstream/upstream time, Target, Readiness, Trace |
| Erfolg nach Retry | andere Adresse, Familie, Connection, Ziel oder Last | Attempts unabhängig markieren |

### Failure Modes und Recovery

| Symptom | plausible Ursachen | sichere Recoveryentscheidung |
|---|---|---|
| NXDOMAIN/SERVFAIL/Timeout | Zone, Resolver, Cache, DNS-Transport/Policy | Antwortcode, Resolverpfad und Zeit prüfen; keine pauschale Cache-Löschung |
| falsche Ziel-IP | stale cache, Split Horizon, falsche Zone, v4/v6-Divergenz | erwartete Kandidaten und TTL/Owner vergleichen |
| Connection timeout | Route, Egress, ACL, NAT, Ziel nicht erreichbar, Sensorlücke | FIB/Policy und beide Endmesspunkte prüfen |
| Connection reset | Listener/Proxy/Policy/Overload/Anwendung | RST-Richtung und Logs; Retry nur bei sicherer Semantik |
| TLS failure | SNI/Authority, Zertifikat, mTLS, ALPN, Terminierung | Security-/Proxyowner einbeziehen, KB-0067 anwenden |
| HTTP error oder Deadline | Target, Queue, Dependency, Rate limit, Clientbudget | per-hop timing und Endpunktbereitschaft auswerten |
| intermittierend | LB/Zone, DNS-Kandidat, Handover, Quota, Retryrace | Kohorten und Attempts statt Durchschnitt vergleichen |

## Security, Governance, Observability und FinOps

### Sicherheits- und Governancevertrag

Der Diagnosezugriff ist selbst ein Sicherheitsobjekt. Namen, IPs, Trace-IDs, Header, PCAPs, Flowlogs und Routingdaten können schützenswert sein. Least Privilege, verschlüsselte Ablage, kurze Retention, Audit, Datenminimierung und ein Incident-Owner gelten für jedes Artefakt. Eine erlaubte Anwendungstransaktion erlaubt nicht automatisch eine Portprüfung, Spiegelung, Paketaufnahme oder Einsicht in Payload.

| Kontrolle | Nachweis |
|---|---|
| Scope und Datenklasse | Ticket, Asset-/Tenantgrenze, freigegebene Fragestellung |
| Zugriff | getrennte Network/Security/SRE-Rollen und Auditlog |
| korrelierbare Identität | serverseitig erzeugte Trace-/Attempt-ID, Headertrustpolicy |
| Retention und Schutz | verschlüsselter Speicher, Ablaufzeit, Lösch-/Incident-Übergabe |
| Ausnahme | Owner, Risiko, Ablauf, Rollback und Nachreview |

### Observability und Troubleshooting-Baum

~~~text
0. Welche konkrete Nutzeraktion und welcher Attempt sind betroffen?
1. Ist Name/Resolverantwort für denselben Client und Zeitpunkt erwartbar?
2. Wurde derselbe Kandidat und dieselbe IP-Familie gewählt?
3. Passt Source, Route, Egress/NAT und erlaubende Policy?
4. War Transportaufbau am richtigen Port sichtbar?
5. Passten TLS-Authority, Identity und Terminierung?
6. Wählte Proxy/LB ein bereites Ziel und wie waren downstream/upstream Zeiten?
7. Bearbeitete Anwendung/Dependency denselben Attempt vor der Deadline?
8. Welche Messgrenze oder Gegenhypothese bleibt?
~~~

Mindestmetriken sind DNS-RCODE und Latenz nach Resolver/Familie, Connection-/TLS-Fehler und Dauer, Egress-/Firewall-Entscheidungen, Proxy upstream/downstream timing, Target-Readiness/Queue, Clientdeadline und Retryzahl. Verknüpfe diese mit sicheren IDs; logge keine Tokens, Secret-Header oder volle Nutzlast als Ersatz für gute Korrelation.

### Kostenmodell

Kostentreiber sind Diagnosezeit, zentrale Log-/Trace-/Flow-/PCAP-Speicherung, Sensorbetrieb, Egress, Retention, Securityreview und Incident-Eskalation. Eine einfache Betrachtung lautet:

~~~text
diagnose cost = engineer time + telemetry ingest/storage + sensor/egress
               + security/governance handling + user-impact cost
~~~

Allokiere nach Dienst, Incidentklasse, Umgebung und Datenklasse. Eine sehr breite Telemetrie reduziert nicht automatisch MTTR; eine gezielte, standardisierte Pfadtelemetrie kann kostengünstiger und datenschutzfreundlicher sein.

## Trade-offs und Anti-Patterns

- **Ping als Freigabetest:** günstig, aber kein Nachweis für Port, TLS, Proxy oder Dienstsemantik. Verwende es höchstens als begrenztes Signal.
- **Traceroute als Topologiewahrheit:** TTL- und ICMP-Verhalten, ECMP und Rückweg begrenzen die Aussage. Ergänze Route-/Policy- und Serviceevidenz.
- **Globale DNS- oder Cache-Löschung:** kann Last und Instabilität erhöhen. Prüfe TTL, Scope und Datenqualität zuerst.
- **Produktivretry als Diagnosewerkzeug:** verändert Last und Zustand. Beachte Idempotenz, Deadline und Retrybudget.
- **Eine Trace-ID als Vertrauensgrenze:** eingehende IDs können manipuliert sein; Trust Boundary und Neustart-/Sanitisierungsregel sind nötig.
- **Teamsilo:** App, Network und Security betrachten je nur ihren Hop. Ein gemeinsamer Pfadvertrag und eine Zeitbasis verhindern Pingpong-Eskalation.

## Staff-, Principal- und Chief-Entscheidungen

| Ebene | Entscheidung | Evidenz / Neubewertung |
|---|---|---|
| Architect | Standardpfad für einen Service: DNS, Familie, Egress, TLS-/Proxyterminierung, Target/Deadline | Topologie, Threat Model, SLO; bei neuer Zone, Proxy, VPN, IP-Familie oder Datenklasse |
| Staff | Diagnoserunbook und gemeinsame Telemetriefelder | MTTR, Fehleskalationen, Messlücken; bei wiederkehrendem Incident oder Toolwechsel |
| Principal | Plattformvertrag für korrelierbare End-to-End-Transaktionen | Produktportfolio, Owner, Kosten/Privacy, Exception-Trend; bei Multi-Region-/Lieferantenwechsel |
| Chief | Investitions- und Governancegrenze für Sensoren, Logs, Traces und Network Operations | Risiko, Nutzerschaden, Compliance, Kosten, Lieferanten; jährliches Portfolio- und Incidentreview |

## Production Checklist

| Kriterium | Nachweis | Owner |
|---|---|---|
| Pfadvertrag und Service-Owner klar | versioniertes Diagramm/Runbook | Architect/Service Owner |
| DNS-/v4-/v6-Verhalten getestet | isolierter Testfall, Resolvermetrik | Platform/Network |
| Egress, Route, NAT und Policy dokumentiert | Policy-/Flow-Evidenz | Network/Security |
| TLS-/Proxyterminierung und Headertrust geklärt | Konfigurationsreview | Security/Platform |
| per-hop Zeiten und Attempt-ID korrelierbar | Dashboard/Trace-Test | SRE/Service |
| Retry, Deadline, Idempotenz und Targetreadiness geprüft | Last-/Failure-Fall | Service Owner |
| Diagnosezugriff, Privacy und Retention geregelt | IAM/Audit/Policy | Security |
| Rollback, Kontaktweg und Eskalation getestet | Incidentübung | Incident Commander |


## Interviewfragen mit Antwortleitfäden

### 1. Warum beweist ein Ping keine funktionierende API?

**Antwortleitfaden:** ICMP kann einen begrenzten Pfad zeigen. DNS, gewählter Kandidat, Port, TCP/QUIC, TLS, Proxy, Authentisierung, Targetreadiness, Dependency und Clientdeadline bleiben offen.

### 2. Wie unterscheidest du DNS- von Routingproblemen?

**Antwortleitfaden:** Zuerst Name, Resolver, Antwortcode, Kandidaten, Cache und Zeit prüfen. Dann den tatsächlich gewählten Kandidaten, Source, Route und Policy prüfen. Eine richtige Antwort nennt die Clientpopulation und IP-Familie.

### 3. Warum kann ein erfolgreicher Retry die Diagnose erschweren?

**Antwortleitfaden:** Er kann andere Adresse/Familie, neue Verbindung, anderes Target oder weniger Last verwenden. Versuche müssen getrennt korreliert werden; Retry ist keine Ursache ohne Idempotenz- und Budgetprüfung.

### 4. Was ist der Unterschied zwischen Route und Policy?

**Antwortleitfaden:** Route wählt den Weiterweg; Policy entscheidet, ob ein Fluss, eine Identität oder Datenklasse zulässig ist. Beides kann korrekt sein, obwohl TLS oder Anwendung scheitert.

### 5. Wie verändert ein Reverse Proxy die Beweisführung?

**Antwortleitfaden:** Er kann TLS terminieren, Connection Pools bilden, Ziel wählen und Downstream-/Upstreamidentitäten unterscheiden. Ein Clientflow entspricht nicht zwingend einer Backendconnection.

### 6. Wann ist Happy Eyeballs diagnostisch relevant?

**Antwortleitfaden:** Wenn Dual-Stack-Clients unterschiedliche A/AAAA-Antworten, Latenzen oder Konnektivität sehen. Die Antwort trennt parallel/gestaffelte Attempts und vermeidet einen pauschalen IPv6-Schuldschluss.

### 7. Welche Daten gehören in ein sicheres Pfadincident?

**Antwortleitfaden:** Minimale korrelierbare IDs, Zeitbasis, Name/Authority, Kandidat/Familie, Messpunkte, Policy-/Statusmetadaten und Befundgrenzen. Keine unnötigen Secrets, Payloads oder unkontrollierten PCAPs.

## Praktische Labs und Fallarbeit

### KB-0075-LAB-01: Synthetische Anfragepfad-Timeline

**Status:** reviewed_only. Nicht ausgeführt; das Beispiel verarbeitet nur eingebettete Testdaten.

~~~python
events = [
    ("a1", "dns", "AAAA returned; v6 candidate selected"),
    ("a1", "route", "egress policy allowed"),
    ("a1", "tcp", "SYN without observed SYN-ACK"),
    ("a1", "quality", "edge flow log missing"),
    ("a2", "dns", "A returned; v4 candidate selected"),
    ("a2", "tcp", "handshake complete"),
    ("a2", "tls", "proxy accepted authority"),
    ("a2", "proxy", "target ready"),
    ("a2", "application", "response before deadline"),
]
by_attempt = {}
for attempt, layer, value in events:
    by_attempt.setdefault(attempt, []).append((layer, value))
for attempt, rows in by_attempt.items():
    print(attempt, rows)
    if any(layer == "quality" for layer, _ in rows):
        print("LIMIT: missing edge evidence prevents a routing-cause claim.")
~~~

**Erwartung:** a1 ist nicht als IPv6- oder Routingursache bewiesen, weil eine zentrale Messsicht fehlt. a2 zeigt nur einen erfolgreichen anderen Versuch. **Gegenprobe:** Entferne die Quality-Zeile; auch dann bleibt ein fehlendes SYN-ACK nur eine Messbeobachtung. **Cleanup:** Keine Dateien, Prozesse, Interfaces, DNS-Anfragen, Sockets oder Netzressourcen entstehen.

## Dependencies, Cross-References und Quellen

| Beziehung | Kapitel | Grund |
|---|---|---|
| Voraussetzung | [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Hypothesen und Gegenproben. |
| Voraussetzung | [KB-0054](06-cidr-und-subnetting.md), [KB-0058](10-dns-und-namensaufloesung.md), [KB-0064](16-routing-grundlagen.md) | Adressierung, Naming und Routing. |
| Voraussetzung | [KB-0067](19-tls-verbindungen-und-zertifikatspruefung.md), [KB-0072](24-forward-und-reverse-proxies.md), [KB-0074](26-paketmitschnitte-mit-wireshark-und-tcpdump.md) | Sicherheits-, Proxy- und Capturegrenzen. |
| Ergänzung | [KB-0073](25-load-balancing-auf-layer-4-und-7.md) und KB-0076 MTU, Fragmentierung und QoS | Targetwahl sowie Transport-/Netzgrenzen. |
| Anwendung | KB-0154 FastAPI, KB-0562 Security Incident Response, KB-0720 Portfolioevidenz | Servicekontext, Beweissicherung und nachweisbare Reife. |

1. [RFC 8305: Happy Eyeballs Version 2](https://www.rfc-editor.org/info/rfc8305/), abgerufen 2026-09-16. Normativer Kontext für asynchrone DNS- und Dual-Stack-Verbindungsversuche.
2. [RFC 9293: Transmission Control Protocol](https://www.rfc-editor.org/info/rfc9293/), abgerufen 2026-09-16. Normativer Kontext für TCP-Transportmechanismen.
3. [W3C Trace Context](https://www.w3.org/TR/trace-context/), abgerufen 2026-09-16. Standardisierte Trace-Kontextweitergabe mit Grenzen an Trust Boundaries.
4. [Wireshark User’s Guide](https://www.wireshark.org/docs/wsug_html/), abgerufen 2026-09-16. Produktkontext für sichere paketbezogene Beobachtung und Reassembly.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad und Nutzen | Einführungsentscheidung |
|---|---|---|
| W3C Trace Context über Servicegrenzen | **Established.** Ermöglicht einheitliche Korrelation, wenn Vertrauen und Sampling bewusst geregelt werden. | Propagation, Sanitisierung, Privacy und ein unabhängiges Log-/Metric-Signal vor dem Standardisieren testen. |
| Dual-Stack-Racing nach Happy Eyeballs | **Established.** Kann sichtbare Verzögerung bei gestörter Familie reduzieren. | Per-Familie messen; zusätzliche Attempts, Kosten und Fehlersymptome müssen im Client- und SRE-Modell sichtbar sein. |
| eBPF-, Mesh- und Cloud-Pfadtelemetrie | **Adopting.** Kann selektive Hop- und Prozesssicht geben. | Privilegien, Sensorverlust, Datenklasse, Kernel-/Agentkompatibilität, Kosten und Exitplan mit Spezialisten prüfen. |
| QUIC-/HTTP/3-Verbreitung | **Adopting / Established je Plattform.** Verändert Transport- und Sichtbarkeitsannahmen gegenüber TCP. | Endpoint- und Proxytelemetrie ausbauen; TCP-basierte Diagnose nicht blind übertragen. |

Ein Pilot akzeptiert eine Anfragepfad-Innovation erst, wenn Nutzerwirkung und Pfadvertrag, Name-/Familien-/Route-/Policy-/TLS-/Proxy-/Targetsemantik, sichere Korrelation, Messpunkt- und Zeitqualität, Retry/Deadline/Idempotenz, Security/Privacy, Capacity/Cost, Incident-Ownership und Rollback nachgewiesen sind.
