---
{"id": "KB-0066", "title": "ACL und Paketfilterlogik", "domain": "03", "sequence": 18, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Fehlersuche", "Korrelation"], "needed_for": "both"}, {"id": "KB-0056", "concepts": ["TCP-Handshake", "Ports", "Rückverkehr"], "needed_for": "both"}, {"id": "KB-0057", "concepts": ["UDP", "Stateless-Datagramm", "Paketverlust"], "needed_for": "both"}, {"id": "KB-0064", "concepts": ["Routing", "Rückweg", "VRF"], "needed_for": "both"}, {"id": "KB-0065", "concepts": ["Conntrack", "Stateful-Filter", "NAT"], "needed_for": "understanding"}], "related": ["KB-0067", "KB-0068", "KB-0069", "KB-0418", "KB-0562", "KB-0720"], "applies": ["KB-0067", "KB-0068", "KB-0418", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Das Lab wertet eine dokumentierte Kommunikationsmatrix gegen eine reine Paketregelreihenfolge in einer lokalen Python-Datenstruktur aus.", "rationale": "Es sendet kein Paket und verändert keine ACL, Firewall, iptables-, nftables-, Route-, Schnittstellen-, Cloud- oder Produktionsressource."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein Filtervertrag definiert Objektidentität, Richtung/Hook, Protokoll, Quell-/Zielpräfix, Ports, Rule order, explizite Rückverkehrssemantik, Default action, Source Validation, Logging, Eigentümer, Change und Rückbau.", "rationale": "Eine ACL ist eine deterministische Paketentscheidung an einem konkreten Durchsetzungspunkt; sie ist kein Ersatz für Routing, Identity, TLS oder Anwendungsauthorisierung."}, "STAFF-TARGET": {"active": true, "scope": "Teams testen die Kommunikationsmatrix aus korrekten Quell-/Ziel-/Port-/Richtungs-/VRF-Kontexten, messen Rule hits/denies, Dropgründe und Latenz und prüfen asymmetrische Rückwege, etablierte TCP-Flows, UDP-/ICMP-Antworten und Source-Validation.", "rationale": "Sie unterscheiden Rule-order-Match, falschen Durchsetzungshook, fehlende stateless Return-Regel, Routing-/NAT-State, Source-Validation und Anwendungsfehler anhand wiederholbarer Evidenz."}, "CHIEF-TARGET": {"active": true, "scope": "Die Organisation steuert Netzwerkfilterung als Policy-as-Code mit Datenklassifikation, Zero-Trust-/Identity-Ergänzung, zentralen Ausnahmen, Audit/Compliance, verteilten Durchsetzungspunkten, Provider-/Cloudgrenzen und Recovery.", "rationale": "Ein globales Allow, falsche Default Action oder untestbare Ausnahme kann große Sicherheits- und Verfügbarkeitsauswirkungen haben; eine überkomplexe Regelbasis kann zugleich Delivery und Incidentführung gefährden."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "nftables hook/chain priority, iptables legacy interactions, TC/eBPF/XDP, hardware ACL/TCAM, PBR, uRPF variants, cloud SG/NACL implementation, DDoS mitigation, fragments, ICMP nuance and packet-level tracing are specialist depth.", "rationale": "Die Zielrollen müssen Kommunikationsmodell, Risikogrenze und Nachweise definieren; Detailimplementierung und hardware-/kernel-spezifische Optimierung gehört zu Netzwerk-/Security-Spezialisten."}}, "lab_validation": [{"lab_id": "KB-0066-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox ohne Netzwerkzugriff", "evidence": "First-match-Regelreihenfolge, ingress/egress-Richtung, implizites Deny, expliziter TCP-Rückverkehr und Source-Validation als deterministische Fallarbeit geprüft.", "limitations": "Nicht ausgeführt; kein Paket, keine ACL, Firewall, iptables-, nftables-, Route-, Schnittstellen-, Cloud- oder Produktionsressource wurde verwendet oder verändert."}]}
---
# ACL und Paketfilterlogik

> **Ziel:** Eine Access Control List entscheidet an einem definierten Durchsetzungspunkt, ob ein Paket weiterlaufen darf. Die Entscheidung hängt von Richtung, Reihenfolge, Matchfeldern und Default Action ab. Plane und teste daher eine Kommunikationsmatrix, nicht nur einzelne „Allow“-Zeilen.

## Purpose, Definition und Scope

Eine ACL oder Paketfilterregel bewertet Paketmerkmale wie Interface/Hook, IP-Protokoll, Quell-/Zielpräfix und Ports. Ein stateless Filter bewertet jedes Paket unabhängig. Ein stateful Filter kann zusätzlich einen bekannten Verbindungszustand berücksichtigen, etwa eine etablierte TCP-Session oder einen Conntrack-Eintrag.

Dieses Kapitel erklärt Regelreihenfolge, Richtung, zustandslose Filter, implizite Ablehnung und Rückverkehr anhand einer dokumentierten Kommunikationsmatrix. Es trennt ACLs von NAT, Routing und Firewallprodukten; alle können zusammenwirken, sind aber unterschiedliche Mechanismen.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Packetfilter matchen deterministisch gegen Richtung und Reihenfolge; ohne State braucht Rückverkehr eigene Regeln. |
| HANDS-ON-TARGET | Das Lab bewertet ein lokales Regelmodell ohne reale Pakete. |
| ARCHITECT-TARGET | Kommunikationsmatrix, Enforcement-Hook, Default Action, Source Validation, Logging und Rollback sind explizit. |
| STAFF/PRINCIPAL | Teams testen erlaubte und verweigerte Flows in beide Richtungen. |
| CHIEF | Filterpolicy wird als auditiertes, automatisiertes Teil der Sicherheitsarchitektur gesteuert. |

## Mental Model: Eine Regel ist eine Frage über ein Paket an einem Ort

```text
packet reaches enforcement point
  -> Which direction/hook? ingress, forward, egress, local input/output?
  -> Which rule is evaluated first?
  -> Does source, destination, protocol, port and optional state match?
  -> terminal verdict: accept, drop, reject, log, jump, rate-limit ...
  -> if no rule matches: chain/default policy decides
```

Die gleiche „HTTP erlauben“-Aussage ist ohne Kontext unvollständig. Sie benötigt mindestens:

```text
source identity/prefix + destination identity/prefix + protocol/port
+ direction and enforcement point + state model + expected return traffic
+ default behavior + owner + expiry/rollback
```

Ein Paket kann mehrere Filter durchlaufen: Host, workload, subnet, router, cloud network ACL, security group, NAT gateway, load balancer und Zielhost. Ein einzelner erfolgreicher Match beweist nicht, dass alle anderen Punkte erlauben.

## Prerequisites und Dependencies

| ID | Art | Bedeutung |
|---|---|---|
| [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Verständnis und Lab | Hypothesen und Evidenzordnung. |
| [KB-0056](08-tcp-verbindungen-und-ueberlastkontrolle.md) | Verständnis und Lab | Handshake, Ports und Rückverkehr. |
| [KB-0057](09-udp-und-datagrammverhalten.md) | Verständnis und Lab | Datagramme und zustandslose Antworten. |
| [KB-0064](16-routingtabellen-und-weiterleitung.md) | Verständnis und Lab | Pfad und Rückroute. |
| [KB-0065](17-nat-und-verbindungszustand.md) | Verständnis | Conntrack und NAT als stateful Zwischenfunktion. |

## Core Concepts

### Regelreihenfolge und First Match

Viele ACL-Engines verarbeiten Regeln in einer definierten Reihenfolge. Je nach Plattform kann der erste terminale Match gelten, eine explizite Priorität entscheiden oder ein Chain-/Hook-Modell weitere Regeln aufrufen. Die Produktsemantik muss vor Änderung verifiziert werden; „allgemein wird die spezifischste Regel gewinnen“ ist kein gültiger ACL-Grundsatz.

```text
1. deny   10.20.0.0/16 -> 10.30.8.0/24 tcp/443
2. allow  10.20.4.0/24 -> 10.30.8.15/32 tcp/443
3. deny   any -> any
```

Bei First-Match wäre Regel 2 für `10.20.4.10 -> 10.30.8.15:443` nie erreichbar, weil Regel 1 bereits matcht. Die korrekte Policy kann eine andere Reihenfolge oder eine engere Ausnahme benötigen, aber nur nach Sicherheits- und Architekturreview.

| Regelmerkmal | Warum es präzise sein muss |
|---|---|
| Reihenfolge/Priorität | bestimmt, welche Regel wirksam ist. |
| Richtung/Hook | dieselbe Adresse kann an ingress, forward oder egress unterschiedliche Bedeutung haben. |
| Source/Destination | verhindert versehentlich breite Erlaubnis. |
| Protokoll/Port | begrenzt Anwendungsfläche, aber authentisiert nicht. |
| State | bestimmt, ob Rückverkehr implizit oder explizit behandelt wird. |
| Verdict | `drop`/`reject`/`log`/rate limit wirken verschieden auf Client, Telemetrie und Last. |
| Default Action | entscheidet über alles, was nicht explizit modelliert ist. |

### Ingress, Egress, Forward und Local

Die Richtung ist relativ zum Filterpunkt, nicht zu einer menschlichen Beschreibung wie „nach innen“. Ein Paket vom Client zu einem Dienst kann am Client egress, am Router ingress und forward, am Zielhost input sein.

```text
client -- egress --> router ingress -> router forward -> service ingress/input
service -> service egress -> router ingress -> router forward -> client ingress
```

Eine Kommunikationsmatrix soll deshalb den Durchsetzungspunkt benennen. Andernfalls können Teams eine Regel am falschen Ort schreiben oder Rückverkehr an einem anderen Hook übersehen.

### Stateless und stateful Rückverkehr

Ein **stateless** Filter merkt sich keine Session. Ein allow für `client -> service tcp/443` lässt nicht automatisch ein Paket von `service:443 -> client:ephemeral-port` zurück. Diese Rückrichtung braucht eine passende Regel, die den ephemeral Portbereich und die Richtung abdeckt, oder die Architektur nutzt an diesem Punkt einen stateful Mechanismus.

| Modell | Gewinn | Risiko |
|---|---|---|
| stateless ACL | vorhersehbar, einfache Datenebene | Return-Regeln, UDP-/ICMP- und Fragmentsemantik müssen explizit sein. |
| stateful Filter | etablierter Rückverkehr einfach modellierbar | Statekapazität, Timeout, Asymmetrie und Failover werden neue Abhängigkeiten. |
| Proxy/Gateway | L7-Policy und Identität möglich | Latenz, Verfügbarkeit, Datenpfad und Kosten. |
| Identity-aware policy | präzisere Subjektbindung | Control-/Identity-Plane-Ausfall und Telemetrieintegration. |

TCP-Flags sind kein Ersatz für Verbindungszustand. Ein stateful Filter kann Rückverkehr über State akzeptieren; ein stateless Rule Set muss die Richtung und möglichen Antwortports korrekt explizit modellieren. UDP und ICMP erfordern besonders klare Antwort-/Timeoutregeln.

### Implizite Ablehnung und Reject versus Drop

Viele Policy-Modelle enden mit implizitem Deny: Was nicht matcht, wird nicht erlaubt. Das ist sicherheitlich sinnvoll, wenn die Kommunikationsmatrix vollständig und Changeprozesse zuverlässig sind. Ein **drop** verwirft still, ein **reject** antwortet kontrolliert; beides hat Auswirkungen auf Clients, Scans, Timeouts und Diagnose.

| Default | Vorteil | Risiko |
|---|---|---|
| default deny | geringere unmodellierte Erreichbarkeit | fehlender Vertrag unterbricht legitime Flows. |
| default allow | einfache Anfangsnutzung | neue Assets/Ports werden unbewusst exponiert. |
| drop | weniger Antwortinformation | schwerere Fehlersuche, lange Clienttimeouts. |
| reject | schnelleres Clientfeedback | kann Policy-/Serviceinformation sichtbar machen. |
| log every deny | hohe forensische Sicht | Log-/Kosten-/DoS-Risiko. |
| sampled/rate-limited log | steuerbarer Betrieb | seltene Ereignisse können verloren gehen. |

## Architecture und Data Flow

### Kommunikationsmatrix als Quellartefakt

```text
workload class A -- protocol/port --> service B
  source prefix/identity             destination prefix/identity
  enforcement points                 direction at each point
  allow/deny                         state and return policy
  observability                      owner/expiry/rollback
```

Eine minimale Matrix:

| Quelle | Ziel | Protokoll/Port | Richtung/Enforcement | State/Rückverkehr | Aktion | Owner |
|---|---|---|---|---|---|---|
| app subnet | payments API | TCP/443 | router forward + service ingress | stateful established return | allow | API owner |
| app subnet | admin subnet | any | router forward | nicht relevant | deny | security |
| device segment | DNS resolver | UDP/TCP 53 | egress/forward | UDP replies explizit/policy | allow | platform |
| internet | internal admin | any | perimeter ingress | nicht relevant | deny | security |

Die Matrix wird in produkt-/plattformnahe Objekte übersetzt, beispielsweise Network ACL, host firewall, cloud policy oder appliance. Jede Übersetzung braucht unabhängige Validierung, weil Plattformsemantik, Reihenfolge und Stateverhalten abweichen können.

### Source Validation und Ingress Filtering

RFC 2827/BCP 38 empfiehlt Ingress-Filter gegen Source-Spoofing; RFC 3704 vertieft Varianten für multihomed Netze. Ein Filter prüft, ob eine Quelladresse am erwarteten Eingang plausibel ist. Strikte Reverse-Path-Annäherungen können bei asymmetrischem Routing legitime Flows verwerfen. Die richtige Moduswahl muss Topologie, VRF, Transit, Mobilität, Tunnel und Rückwege kennen.

```text
ingress interface from workload subnet:
  allow source addresses assigned to that subnet/identity context
  deny unexpected source prefixes
  log/rate-limit according to incident policy
```

Source Validation ist eine Ergänzung zur Kommunikationsmatrix. Sie ersetzt keine Dienstauthentisierung und löst keine zugelassenen, aber kompromittierten Quellen.

## Scalability und Performance

ACL-Kapazität wird von Regelanzahl, Präfix-/Port-Komplexität, Stateful-Table, Hardware-/TCAM-Grenzen, Logvolume und Changefrequenz beeinflusst. Ein riesiges Regelwerk ist nicht automatisch genauer; überlappende Regeln, ungenutzte Ausnahmen und unklare Owner erhöhen Fehlschaltungen.

| Kennzahl | Aussage |
|---|---|
| Rule count / shadowed / unreachable rules | Qualität und Wartbarkeit. |
| rule hit/deny rate by policy object | tatsächliche Nutzung und Anomalien. |
| p95 decision latency / CPU/TCAM use | Durchsetzungskapazität. |
| state entries/timeout drops | stateful Abhängigkeit. |
| source-validation drops | Spoofing, Topologiedrift oder falscher Modus. |
| logging volume/drop rate | Forensik- versus Kosten-/DoS-Grenze. |
| exception age/owner | Drift und temporäre Öffnungen. |
| change success/rollback time | Betriebsreife. |

## Reliability und Failure Modes

| Fehlerbild | Ursacheklasse | Evidenz | Sofortmaßnahme | Nachhaltige Maßnahme |
|---|---|---|---|---|
| neuer Flow wird abgelehnt | fehlende/geschattete Regel | exact packet context, rule trace/hit count | Matrix/Rule order prüfen | Tests für allowed/denied pairs. |
| Request geht, Antwort fehlt | stateless Rückverkehr oder Rückroute | both directions plus hook/state | return semantics korrigieren | bidirektionale Matrix. |
| nur UDP/ICMP bricht | Antwort-/Timeout-/fragment policy | protocol-specific drop trace | Policy eingrenzen | eigene UDP/ICMP-Tests. |
| legitimer multihomed Flow verworfen | strikte source validation bei Asymmetrie | ingress, reverse path and topology | Modus nur nach Review anpassen | topology-aware validation. |
| Policychange öffnet zu viel | Reihenfolge/Prefix zu breit | diff, rule trace, synthetic deny | rollback/containment | policy-as-code review and simulation. |
| Geräte-/Cloudpflicht widersprüchlich | mehrere Enforcement Points | per-hop policy result | Eigentümer koordinieren | canonical matrix and automated conformance. |

## Security, Governance und Compliance

ACLs verkörpern Sicherheitsentscheidungen, brauchen aber Scope und Nachweis. Eine Regel „any any allow“ kann eine akute Wiederherstellung beschleunigen, muss jedoch als hochriskante zeitbegrenzte Ausnahme mit Owner, Monitoring und Entfernung geführt werden.

| Risiko | Kontrolle |
|---|---|
| unmodellierte Exposition | default deny, vollständige Matrix, wiederkehrende Access Reviews. |
| Spoofing | ingress/source validation, aber Topologie-/Asymmetrieprüfung. |
| Regel-Shadowing | Linting, Simulation, rule trace and peer review. |
| unklare Ausnahme | Ticket/owner/expiry, minimal scope, audit and automatic removal. |
| Logdatenleak | minimale Felder, sampling, access control and retention policy. |
| Lockout durch Change | staged deployment, out-of-band access, tested rollback. |
| Policy drift zwischen Plattformen | canonical model and continuous conformance. |

ACL ist keine Verschlüsselung. Erlaubter TCP/443-Verkehr kann weiterhin falsche Identität, beschädigtes TLS oder unzulässige Daten enthalten. Network filter, identity, application authorization and data controls are complementary.

## Observability und Troubleshooting

### Ereignisschema

```text
timestamp, enforcement point/hook/direction,
source and destination prefix/identity, protocol/ports, VRF,
matched rule id/order/verdict, default-policy result,
state/conntrack marker, source-validation result,
packet/byte counters, sampled trace, routing/next-hop and return-path,
change id/owner, protected workload correlation id
```

### Triage-Reihenfolge

1. Flow exakt festlegen: Quelle/Ziel, Protokoll, Ports, Direction, VRF, Zeit und Erwartung.
2. Alle Durchsetzungspunkte auf dem Hin- und Rückweg bestimmen.
3. Für jeden Punkt Richtung/Hook und erwartete Regel-/Defaultentscheidung prüfen.
4. Rule order, Matchfelder, Shadowing und tatsächlichen Counter/Trace vergleichen.
5. Bei stateful Punkten State/Timeout, NAT und asymmetrischen Rückweg prüfen.
6. Source Validation, MTU/ICMP und v4/v6 getrennt untersuchen.
7. Nur nach belegter Lücke die minimalste Regel ändern; positive und negative Tests sowie Rückbau ausführen.

## Cost und FinOps

Filterkosten entstehen durch Appliances, Cloud rules, TCAM-/CPU-/Statekapazität, Logpipeline, Policyautomation, Tests und Incidentzeit. Ausufernde Deny-Logs können eine Securityplattform finanziell und operativ belasten; zu wenig Log verhindert forensische Klärung. Segmentierung kann Transit-/Gatewaykosten verändern, senkt aber unter Umständen Incident- und Compliancekosten.

Bewerte pro Policyklasse: Rule-/Statebedarf, Logkosten, Changehäufigkeit, Abdeckung kritischer Datenflüsse, Recoveryzeit und Kosten einer falschen Erlaubnis versus falschen Ablehnung.

## Trade-offs und Anti-Patterns

| Entscheidung | Gewinn | Preis | Leitplanke |
|---|---|---|---|
| stateless ACL | deterministische Paketsicht | explizite Returnsemantik | Matrix in beide Richtungen. |
| stateful filter | einfache established responses | State-/timeout-/asymmetry risk | capacity and failover tests. |
| default deny | geringe Exposition | Vollständigkeit nötig | discovery and staged rollout. |
| broad allow | schnelle Wiederherstellung | hoher Blast Radius | emergency-only, expiry and audit. |
| strict source validation | anti-spoofing | false drops in asymmetric paths | topology-aware mode. |
| pervasive deny logging | visibility | cost/DoS | sampling/rate limits and retention. |

Anti-Patterns:

- „Port 443 erlauben“ ohne Quelle, Ziel, Richtung und State.
- Reihenfolge nicht prüfen, weil die richtige Regel „existiert“.
- Rückverkehr bei stateless Filters vergessen.
- Source validation blind einschalten, ohne asymmetrische und Tunnelpfade zu prüfen.
- Eine ACL als einzige Security- oder Compliancekontrolle darstellen.
- Breite temporäre Regeln ohne Ablaufdatum belassen.
- Nur erfolgreiche Flows testen und geplante Denies nicht prüfen.

## Staff-, Principal- und Chief-Level Decisions

### Staff / Principal

- Etabliere eine kanonische Kommunikationsmatrix, die sich in Netzwerk-, Host- und Cloudpolicy übersetzen lässt.
- Baue automatisierte Tests für allowed, denied, return, state timeout, source validation, IPv4/IPv6 und Change rollback.
- Verfolge Rule hits, shadowing, Ausnahmealter und Policy-Differenzen als Produktmetriken.
- Gestalte Egress-, Ingress- und intersegment Regeln mit klaren Workload- und Serviceownern.
- Behandle Debugtracing als kontrollierten Incidentzugriff, damit Sichtbarkeit nicht durch Performance- oder Privacyzwang verschwindet.

### Chief

- Führe Network Policy als Governanceprodukt mit Ownership, Datenklassifikation, Audit, Risikomessung und standardisierten Ausnahmen.
- Verlange, dass Zero-Trust-/Identity-Projekte ACLs ergänzen und nicht fälschlich „abschaffen“.
- Investiere in Simulation, policy-as-code, Conformance und Rollback über On-Prem, Cloud und Edge.
- Entscheide zentrale versus verteilte Durchsetzung nach Fehlerdomäne, Datenpfad, Kosten und Betriebsteamfähigkeit.
- Messe Sicherheits- und Deliverywirkung: unberechtigte Reichweite, Change-Failure, Time-to-Contain und Ausnahmeverschuldung.

## Production Checklist

- [ ] Kommunikationsmatrix definiert Quelle, Ziel, Protokoll/Port, Richtung, State/Rückverkehr, Owner und erwartetes Deny.
- [ ] Enforcement-Points und jeweilige Hook-/Richtung sind im vollständigen Hin-/Rückweg bekannt.
- [ ] Regelreihenfolge, Präfixe, Ports, VRFs und Default Action sind prüfbar und nicht geschattet.
- [ ] Stateless Return, UDP/ICMP and fragment behavior are explicitly designed where relevant.
- [ ] Stateful capacity, timeout, NAT and asymmetric return behavior are tested where state exists.
- [ ] Ingress/source validation respects expected multihoming, tunnels and routing asymmetry.
- [ ] Rule hits, denies, state, drops and policy drift are observable with controlled logging.
- [ ] Ausnahmen sind minimal, ownergebunden, befristet und rückbaubar.
- [ ] Positive and negative flow tests cover v4/v6, relevant clients, services and regions.
- [ ] Out-of-band access and rollback are validated before a high-blast-radius policy change.

## Praktisches Lab: Offline-Regelreihenfolge, Richtung und Rückverkehr

**Ziel:** Das Modell demonstriert First Match und eine stateless Rückverkehrslücke. Es verarbeitet ausschließlich lokale Dictionaries.

```python
rules = [
    {"id": "deny-admin", "dir": "forward", "src": "10.20.", "dst": "10.30.8.", "proto": "tcp", "port": 443, "action": "deny"},
    {"id": "allow-api",  "dir": "forward", "src": "10.20.4.", "dst": "10.30.8.15", "proto": "tcp", "port": 443, "action": "allow"},
    {"id": "default",    "dir": "forward", "src": "", "dst": "", "proto": "*", "port": None, "action": "deny"},
]

def evaluate(packet):
    for rule in rules:
        if (rule["dir"] == packet["dir"] and packet["src"].startswith(rule["src"])
            and packet["dst"].startswith(rule["dst"])
            and (rule["proto"] in ("*", packet["proto"]))
            and (rule["port"] is None or rule["port"] == packet["port"])):
            return rule["id"], rule["action"]

print(evaluate({"dir":"forward","src":"10.20.4.10","dst":"10.30.8.15","proto":"tcp","port":443}))
```

**Erwartete Auswertung:**

| Probe | Erwartung | Aussage |
|---|---|---|
| API-Paket | `deny-admin` | First Match kann die später existierende Allow-Regel schatten. |
| unbekannter Flow | `default`, deny | Implizite/Default-Ablehnung ist Teil des Vertrages. |
| Rückpaket ohne Regel | deny | Stateless Policy benötigt explizite Rückverkehrssemantik. |
| korrekt umsortierte Ausnahme | allow nur für präzises Tuple | Regelreihenfolge folgt Sicherheitsabsicht. |

**Negative Probes:**

1. Verschiebe `allow-api` vor `deny-admin`. Prüfe, ob nur das exakte API-Tuple erlaubt ist.
2. Ergänze ein Rückpaket mit Sourceport 443 und Client-Ephemeralport. Zeige die fehlende stateless Return-Regel.
3. Füge eine source-validation Funktion hinzu, die nur `10.20.0.0/16` am erwarteten Eingang akzeptiert. Diskutiere die Ausnahme für asymmetrische oder getunnelte Pfade.
4. Setze die Defaultregel auf allow und zeige, wie ein nicht modellierter Port versehentlich erreichbar wird.

**Cleanup:** Interpreter beenden und temporäre lokale Labdateien löschen. Es wurden keine Pakete, ACLs, Firewall-, iptables-, nftables-, Route-, Schnittstellen-, Cloud- oder Produktionsressourcen verwendet oder verändert.

## Interviewfragen mit Antwortkernen

1. **Warum ist eine ACL-Regel ohne Richtung unvollständig?**  
   Die gleiche Verbindung begegnet an verschiedenen Durchsetzungspunkten als ingress, forward oder egress. Rückverkehr hat dabei umgekehrte Quelle/Ziel-/Portrollen.

2. **Was bedeutet First Match?**  
   Die erste passende terminale Regel entscheidet. Eine spätere spezifischere Regel kann dadurch unerreichbar sein, wenn eine frühere breite Regel sie schattet.

3. **Warum benötigt ein stateless Filter Rückregeln?**  
   Er merkt sich keine Session. Das Antwortpaket hat andere Quell-/Zielports und Richtung und muss deshalb eigenständig erlaubt sein.

4. **Was ist implizites Deny?**  
   Pakete ohne passenden Allow werden durch den Default verworfen. Das erhöht die Sicherheit, verlangt aber eine vollständige und getestete Kommunikationsmatrix.

5. **Wann kann strikte Source Validation problematisch sein?**  
   Bei legitimen asymmetrischen Rückwegen, Multihoming, Tunnel- oder Mobilitätsmodellen kann ein reiner Reverse-Path-Test falsche Drops erzeugen.

6. **Ist ACL gleich Firewall?**  
   Eine ACL ist eine Form von Paketfilterlogik. Firewalls können zusätzlich State, Anwendungskontext, Identity, TLS-Inspection, NAT und Managementfunktionen enthalten.

7. **Welche Tests gehören zu einem ACL-Change?**  
   Der genaue erlaubte Flow, bewusste Denies, Rückverkehr, v4/v6, Source Validation, State-/Timeoutverhalten, alle Enforcementpoints und der Rückbau.

8. **Warum hilft ein Deny-Log nicht immer?**  
   Es kann fehlen, überlastet oder unvollständig sein und sagt ohne Flow-/Hook-/Rule-/Zeitkontext wenig. Logging braucht Sampling, Retention, Zugriff und Korrelation.

## Dependencies, Cross-References und Quellen

| Beziehung | Dokument | Nutzung |
|---|---|---|
| Voraussetzung | [KB-0056](08-tcp-verbindungen-und-ueberlastkontrolle.md) | TCP-Rückverkehr. |
| Voraussetzung | [KB-0057](09-udp-und-datagrammverhalten.md) | UDP-/ICMP-ähnliche Paketsemantik. |
| Voraussetzung | [KB-0064](16-routingtabellen-und-weiterleitung.md) | Pfad und Rückweg. |
| Voraussetzung | [KB-0065](17-nat-und-verbindungszustand.md) | Stateful Conntrack/NAT. |
| Weiterführung | KB-0067 Stateful Firewalls | State-/Policyvertiefung. |
| Weiterführung | KB-0418 Network Security Architecture | organisationsweite Sicherheit. |
| Nachweis | KB-0720 Portfolioevidenz und Reifemodelle | Matrix- und Testnachweis. |

Primär- und Implementierungsquellen, abgerufen und inhaltlich geprüft am **2026-09-16**:

- [RFC 2827 / BCP 38 – Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827)
- [RFC 3704 – Ingress Filtering for Multihomed Networks](https://www.rfc-editor.org/rfc/rfc3704)
- [nftables – Matching packet headers](https://wiki.nftables.org/wiki-nftables/index.php/Matching_packet_headers)
- [nftables – Ruleset tracing](https://wiki.nftables.org/wiki-nftables/index.php/Ruleset_debug/tracing)
- [iptables(8) – Packet filtering administration](https://man7.org/linux/man-pages/man8/iptables.8.html)
- [Linux Kernel – IP Sysctl](https://docs.kernel.org/networking/ip-sysctl.html)

## Bonus: New Tech and Innovations

Policy-as-Code kann Kommunikationsmatrizen in mehrere Durchsetzungspunkte übersetzen und gegen Sollzustand prüfen. Das verbessert Konsistenz nur, wenn die Semantik der Zielplattformen, Simulation, Testdaten, Änderungsrechte und Rückbauversionen erhalten bleiben. Eine zentrale YAML-Datei ersetzt keine Evidenz über den tatsächlichen Paketpfad.

eBPF-/XDP- und hardwarebeschleunigte Filter können Durchsetzung näher an den Paketempfang und mit sehr hoher Leistung betreiben. Sie verschieben Debug- und Governanceanforderungen zu Programmlifecycle, Verifier-/Offloadgrenzen, Telemetrie und sicherer Berechtigung. Ein schneller Drop ohne erklärbaren Policybezug ist kein reifer Sicherheitskontrollpunkt.

Ein Pilot akzeptiert eine Filterinnovation erst, wenn Kommunikationsmatrix, Reihenfolge, Richtung, Rückverkehr, Source Validation, Security, Performance, Observability, Changekontrolle und Rollback über alle betroffenen Durchsetzungspunkte nachgewiesen sind.

