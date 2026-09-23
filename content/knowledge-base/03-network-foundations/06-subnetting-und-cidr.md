---
{"id": "KB-0054", "title": "Subnetting und CIDR", "domain": "03", "sequence": 6, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Kapazität", "Hypothese", "Messung"], "needed_for": "both"}, {"id": "KB-0049", "concepts": ["IP-Schicht", "Route", "Next Hop"], "needed_for": "understanding"}, {"id": "KB-0052", "concepts": ["IPv4-Präfix", "Adressraum", "Überlappung"], "needed_for": "both"}, {"id": "KB-0053", "concepts": ["IPv6-Präfix", "Adressscope", "Dual Stack"], "needed_for": "understanding"}], "related": ["KB-0055", "KB-0056", "KB-0058", "KB-0059", "KB-0080", "KB-0720"], "applies": ["KB-0055", "KB-0080", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein offline Python-Lab berechnet Netzgrenzen, nutzbare Adressanzahlen, Überlappung und summarisiert nur ausgerichtete zusammenhängende Präfixe.", "rationale": "Das Lab verwendet ausschließlich Dokumentations- und private Beispielwerte; es liest oder verändert keine Route, IPAM-, DNS-, Interface-, Cloud- oder Produktionsressource."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein Adressplan wird nach Standort/Zone/Environment/Funktion hierarchisch reserviert, in IPAM geführt und mit Route, DNS, Security, Growth und Renumbering verknüpft.", "rationale": "CIDR wird als konsistente Grenze zwischen Allokation, Segmentierung, Aggregation und Ownership eingesetzt; die Präfixgröße wird nicht aus einer alten Netzwerkklasse abgeleitet."}, "STAFF-TARGET": {"active": true, "scope": "Ein Review prüft Bedarf, Peak, Churn, HA, Migration, Plattformreserven, Overlap, Aggregationswirkung, Security-Blast-Radius und Betriebsfähigkeit gemeinsam.", "rationale": "Eine rechnerisch passende Präfixlänge wird nicht ohne Nachweis von Route-/Policy-/IPAM-/Observability-Folgen freigegeben."}, "CHIEF-TARGET": {"active": true, "scope": "Adressraum, Standort-/Cloud-/M&A-Integration, IPv6-Zielbild, Provider-/Route-Portfolio und Automation werden als langfristiges Investitions- und Risikothema geführt.", "rationale": "Die Organisation bewertet Renumbering, Fragmentierung, Aggregationsschuld, Lieferantenlimits, Kosten und Incidentfähigkeit statt nur freie IP-Anzahl."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "BGP-Route-Policy und deaggregation, FIB/TCAM-Dimensionierung, provider-aggregatable addressing, IPv6 prefix delegation, SRv6, CNI-IPAM-Implementierung und komplexe Multi-VRF-Designs sind Spezialistentiefe.", "rationale": "Die Zielrollen prüfen Architekturintention, Grenzen, Nachweise und Eskalationen; die Router-/Fabric-Feinimplementierung kann bei Netzwerkfachleuten liegen."}}, "lab_validation": [{"lab_id": "KB-0054-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox mit Standardbibliothek ipaddress", "evidence": "CIDR-Berechnung, Alignment, Überlappungs- und Aggregationslogik sowie negative Probes wurden als reine Fallarbeit geprüft.", "limitations": "Nicht ausgeführt; keine Adresse wurde konfiguriert, keine Routingtabelle gelesen oder geändert, kein Paket versendet und kein IPAM-, DNS-, Cloud-, Provider- oder Produktionssystem kontaktiert."}]}
---
# Subnetting und CIDR

> **Ziel:** Ein Präfix ist gleichzeitig mathematische Menge, Routingvertrag, Kapazitätsgrenze und Organisationsgrenze. Gute Subnetting-Entscheidungen rechnen sauber, halten zusammenhängende Räume für Aggregation vor und machen Wachstum, Overlap, Security und Renumbering vorhersehbar.

## Purpose, Definition und Scope

Classless Inter-Domain Routing (CIDR) beschreibt Netze mit der Schreibweise `Adresse/Präfixlänge`. Die Präfixlänge legt fest, wie viele führende Bits zu einem Netz gehören; die verbleibenden Bits bilden den Adressraum innerhalb dieses Präfixes. CIDR ersetzt die frühere A-/B-/C-Klassendenke durch explizite, flexible Grenzen und ermöglicht Routingaggregation.

Dieses Kapitel behandelt:

- Präfixlängen, Netz-/Hostteil, Blockgröße und Netzgrenzen für IPv4 und konzeptionell IPv6;
- CIDR-Berechnung, Longest Prefix Match und Aggregation;
- Adressraumbedarf unter Wachstum, HA, Churn, Migration und Plattformreserven;
- Überlappungen, Fragmentierung und Standort-/Cloudplanung;
- Security, Observability, FinOps, Governance und sichere Offline-Labs.

Nicht im Scope: konkrete Routingprotokolle, BGP-Policy, Firewall-/Cloud-VPC-Konfiguration oder IPv6-Übergangsimplementierung. [KB-0055](07-icmp-und-pfadfehler.md) und spätere Routingartikel verwenden die hier definierten Präfixe als Grundlage.

Nach der Bearbeitung kannst du:

1. aus einem CIDR-Präfix Anzahl, Netzgrenze und Adressbereich ableiten;
2. IPv4-Adresskapazität korrekt einschließlich `/31`- und `/32`-Ausnahmen beurteilen;
3. echte Aggregation von einer unzulässigen, Lücken erzeugenden Zusammenfassung unterscheiden;
4. einen Standortplan nach Bedarf, Wachstum und Ownership entwerfen;
5. nachvollziehbar erklären, warum „größeres Subnetz“ nicht automatisch bessere Skalierung bedeutet.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | RFC 4632, RFC 3021, RFC 1918, RFC 4291 und RFC 6177 liefern die Berechnungs- und Architekturgrundlage. |
| HANDS-ON-TARGET | Das Lab rechnet lokal mit `ipaddress`; es berührt keine Netzressource. |
| ARCHITECT-TARGET | Prefixes sind in IPAM registrierte, versionierte Vertragsgrenzen mit Owner, Reserve und Migration. |
| STAFF/PRINCIPAL | Reviews verbinden Kapazität, Route, Security, Betrieb und künftige Integration. |
| CHIEF | Adress- und Routingfragmentierung, Cloud-/M&A-Risiken und IPv6-Fähigkeit werden als Portfolio geführt. |

## Mental Model: vier Wirkungen eines Präfixes

```text
10.60.16.0/20

1. Mathematik: 2^(32-20) = 4096 IPv4-Adressen.
2. Zugehörigkeit: 10.60.16.0 bis 10.60.31.255 liegen in der Menge.
3. Routing: Die Präfixlänge bestimmt, wie spezifisch eine Route gegenüber anderen Routen ist.
4. Organisation: Der Bereich kann einer Zone, Funktion und einem Owner reserviert werden.
```

Diese Wirkungen dürfen nicht getrennt entschieden werden. Ein großzügiges `/20` kann rechnerisch bequem sein, aber eine zu große L2-/Security-/Failure-Domain erzeugen. Viele kleine `/28` können Ressourcen schonen, aber Route-, IPAM- und Operationsfragmentierung erzeugen. Die richtige Größe folgt aus einer überprüfbaren Anforderung, nicht aus Gewohnheit.

## Prerequisites und Dependencies

| ID | Art | Bedeutung |
|---|---|---|
| [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Anwendung und Lab | Kapazitätsannahme, Hypothese und Gegenprobe machen Adressplanung überprüfbar. |
| [KB-0049](01-osi-und-tcp-ip-als-analysemodelle.md) | Verständnis | IP-Schicht und Routingkontext erklären die Wirkung eines Präfixes im Paketpfad. |
| [KB-0052](04-ipv4-adressierung.md) | Anwendung und Lab | IPv4-Sonderbereiche, Scope, IPAM und Overlap liefern die praktische Ausgangslage. |
| [KB-0053](05-ipv6-adressierung-und-uebergang.md) | Verständnis | IPv6-Präfixe, Scope und Delegation erweitern den Plan auf Dual Stack. |

## Core Concepts und Berechnung

### Präfixlänge, Maske und Blockgröße

Bei IPv4 existieren 32 Bits. Für ein Präfix `/p` gilt:

```text
address count = 2^(32 - p)
```

| Präfix | Adressen insgesamt | Traditionell nutzbar bei Multi-Access-IPv4 | Typischer Hinweis |
|---|---:|---:|---|
| `/24` | 256 | 254 | oft leicht lesbar, aber keine universelle Standardgröße. |
| `/25` | 128 | 126 | zwei gleich große Hälften eines `/24`. |
| `/26` | 64 | 62 | vier gleich große Blöcke pro `/24`. |
| `/27` | 32 | 30 | acht Blöcke pro `/24`. |
| `/28` | 16 | 14 | kleine Segment-/Servicebereiche, Plattformreserven beachten. |
| `/30` | 4 | 2 | traditioneller Punkt-zu-Punkt-Fall. |
| `/31` | 2 | 2 auf passendem Punkt-zu-Punkt-Link | RFC 3021-Ausnahme. |
| `/32` | 1 | 1 | Hostroute/Loopback-/Endpointkontext, keine Broadcastdomäne. |

Die Spalte „traditionell nutzbar“ zieht bei Multi-Access-IPv4 meist Netz- und directed-broadcast-Adresse ab. Sie ist **keine universelle Gleichung**: `/31`, `/32`, Cloud-Reservierungen, virtuelle Plattformen und konkrete Linktypen können abweichen. Plane mit **allokierbarer Kapazität nach Plattform** statt nur mit `2^h - 2`.

### Netzgrenzen verstehen

Ein Präfix beginnt an einer zu seiner Größe ausgerichteten Grenze. Für `192.0.2.64/26`:

```text
/26 -> 32 - 26 = 6 Hostbits -> 2^6 = 64 Adressen
Block starts in the last octet: 0, 64, 128, 192

192.0.2.64/26 includes:
  network:   192.0.2.64
  range:     192.0.2.64 - 192.0.2.127
  classic directed broadcast: 192.0.2.127
```

Für `10.60.16.0/20` liegt die relevante Schrittweite im dritten Oktett bei 16. Der Bereich umfasst `10.60.16.0` bis `10.60.31.255`. Ein vermeintliches `10.60.18.0/20` beschreibt **keine** unabhängige /20-Grenze; die canonical network address ist `10.60.16.0/20`.

### Longest Prefix Match

Routing bevorzugt die spezifischste passende Route. Beispiel:

```text
10.60.0.0/16      -> core route
10.60.16.0/20     -> site-a route
10.60.18.0/24     -> maintenance exception

destination 10.60.18.77 matches all three.
Selected route: 10.60.18.0/24
```

Das ermöglicht kontrollierte Ausnahmen, kann aber Aggregation, Security-Intent und Fehlerverständnis verschlechtern. Jeder spezifischere Prefix muss einen Owner, Grund, Ablaufdatum, Rückbau und Monitoring besitzen. Dauerhafte Deaggregation ist Architektur- und Betriebsverschuldung, nicht bloß eine Routenliste.

### Aggregation: zusammenhängend, ausgerichtet, topologisch sinnvoll

Aggregation fasst angrenzende, gleichartig behandelte Teilpräfixe zu einem größeren Prefix zusammen. Beispiel:

```text
10.60.16.0/24
10.60.17.0/24
10.60.18.0/24
10.60.19.0/24
      ↓ aligned and contiguous
10.60.16.0/22
```

Eine gültige Aggregation braucht:

1. **Zusammenhängende Adressmenge** ohne unerklärte Lücke.
2. **Bit-Ausrichtung** am möglichen Summenpräfix.
3. **Gleichen oder bewusst überdeckten Forwarding-/Security-/Ownership-Kontext.**
4. **Sicheren Umgang mit nicht belegten Teilen**, damit kein Black Hole oder ungewollter Traffic entsteht.
5. **Topologische Sinnhaftigkeit:** Eine Adresse kann rechnerisch aggregierbar sein, aber bei verschiedenen Standorten/Providern keine sichere Routenaggregation bilden.

CIDR wurde entwickelt, um Adressnutzung und Routingaggregation zusammenzubringen. RFC 4632 betont, dass Aggregation entlang der tatsächlichen Topologie funktioniert; eine rein numerische Zusammenfassung ist keine Architekturstrategie.

## Architecture und Data Flow

### Konkrete Standortplanung

Annahme: Ein Unternehmen reserviert `10.60.0.0/16` für einen internen, koordinierten IPv4-Integrationsraum. Drei Standorte/Regionen erhalten zusammenhängende Großblöcke, damit Routen auf Kern-Ebene aggregierbar bleiben.

```text
10.60.0.0/16  enterprise reservation
├─ 10.60.0.0/18    site-berlin
│  ├─ 10.60.0.0/20     production
│  ├─ 10.60.16.0/20    shared-platform
│  ├─ 10.60.32.0/20    non-production
│  └─ 10.60.48.0/20    documented growth / migration reserve
├─ 10.60.64.0/18   site-frankfurt
├─ 10.60.128.0/18  cloud-region-a
└─ 10.60.192.0/18  unallocated, governed reserve
```

Innerhalb eines /20 werden nur dann kleinere Segmente geschnitten, wenn Kapazität, L2/L3-Grenze, Securityzone, Plattformlimits, Rollen und Betrieb dies rechtfertigen. Die Routenlogik kann den Standort als `/18` propagieren, während lokale Router spezifischere Präfixe kennen. Eine Ausnahme darf die Sammelroute nicht unbeabsichtigt in ein anderes Site leiten.

### Bedarfsrechnung ist mehr als Endpunktzahl

```text
required addresses =
steady-state endpoints
+ peak autoscaling
+ blue/green or canary overlap
+ node/service/ingress/egress infrastructure
+ operational reserve
+ migration coexistence
+ provider/CNI reserved addresses
```

Für eine Plattform mit 500 erwarteten Workloads und 40 % Peak ist nicht „/23 = 512“ ausreichend. Schon ohne Plattformreserven wäre der Peak 700. Mit Blue/Green, Nodes, Gateways, Services und Reserve kann ein /21 oder eine andere Segmentierung begründet sein. Die konkrete Präfixwahl folgt aber auch der gewünschten Failure Domain und der Fähigkeit, Teilpräfixe zu aggregieren.

### IPv6 im selben Plan

IPv6-Präfixe werden nach denselben Grundideen organisiert: Hierarchie, Scope, Ownership, Zusammenhängigkeit und Aggregation. Die hostseitige Kapazität wird nicht durch „knappes Zählen“ wie bei IPv4 getrieben. RFC 6177 empfiehlt, Endsites nicht auf einen einzelnen Standardpräfixwert zu reduzieren; tatsächliche Delegation und Plan hängen von Topologie, Sites, Subnets und Erweiterbarkeit ab.

```text
2001:db8:1000::/48           documentation example: enterprise allocation
├─ 2001:db8:1000:0000::/52   site-berlin
│  ├─ ...:0000::/64          application segment
│  ├─ ...:0001::/64          platform segment
│  └─ ...:0002::/64          management segment
└─ 2001:db8:1000:1000::/52   site-frankfurt
```

Die Werte illustrieren Hierarchie, keine universelle Providerzuteilung. IPv6-/64-Segmentkonventionen, Delegation und Gerätesupport müssen mit RFCs, Provider- und Plattformdokumentation validiert werden.

## Protocols, Standards, Tools und Technologien

| Bezug | Aussage | Betriebsgrenze |
|---|---|---|
| [RFC 4632](https://www.rfc-editor.org/rfc/rfc4632) | CIDR, Prefixnotation, Zuweisung und Routingaggregation. | adressiert nicht alle heutigen Cloud-/CNI-/Security-Implementierungen. |
| [RFC 3021](https://www.rfc-editor.org/rfc/rfc3021) | IPv4 `/31` für passende Punkt-zu-Punkt-Links. | Linktyp und Plattformunterstützung müssen geprüft sein. |
| [RFC 1918](https://www.rfc-editor.org/rfc/rfc1918) | private IPv4-Bereiche und Overlap-/Renumberingfolgen. | kein globaler Ownership- oder Securitynachweis. |
| [RFC 4291](https://www.rfc-editor.org/rfc/rfc4291) | IPv6-Präfix-/Adressarchitektur. | keine automatische Delegations- oder IPAM-Policy. |
| [RFC 6177](https://www.rfc-editor.org/rfc/rfc6177) | IPv6-Adresszuweisung für Endsites. | Provider-/Clouddelegation und Produktlimits konkret prüfen. |
| [IANA IPv4 Address Space](https://www.iana.org/assignments/ipv4-address-space/ipv4-address-space.xhtml) | aktuelle globale IPv4-Adressraumverwaltung. | nicht mit interner IPAM-Quelle verwechseln. |
| IPAM/DDI/IaC | Prefix source of truth, Vergabe, DNS/DHCP/Route-/Policykopplung. | Datenmodell, RBAC, Drift und Rollback sind Designaufgaben. |
| Route analyzer / offline address libraries | Berechnung, Overlap-/Alignmentprüfung, Reviewautomation. | keine Begründung, reale Routen unautorisiert zu ändern. |

## Konfiguration und Implementation

### Maschinenlesbare Prefix-Reservierung

```yaml
prefix: 10.60.16.0/20
address_family: ipv4
purpose: shared-platform
scope: site-berlin
routing_domain: internal-core
owner: platform-network
allocation_status: reserved-for-managed-subnets
capacity_model:
  peak_endpoints: documented
  migration_headroom: documented
  platform_reservations: verified
aggregation_parent: 10.60.0.0/18
overlap_checked_against:
  - on-prem
  - cloud-region-a
  - partner-vpn
  - pod-and-service-ranges
security_zone: internal-platform
change_and_rollback: CHG-XXXX
review_date: yyyy-mm-dd
```

Jeder Subprefix erbt nicht automatisch alle Regeln seines Parents. Security, DNS, Route, Egress und Owner können abweichen; diese Abweichung muss explizit sein. Ein Tool darf nur dann automatisch eine Route erzeugen, wenn ein validierter Intent, eine Change-Autorisierung, ein Test und ein Rückbaupfad existieren.

### Algorithmus für Review und Allokation

```text
1. Definiere Umgebung, Standort/Zone, Funktion, Datenklasse und Owner.
2. Ermittle steady state, peak, HA, migration, platform reservation and growth horizon.
3. Wähle eine zusammenhängende Parent-Reservation für spätere Aggregation.
4. Berechne das kleinste angemessene Präfix, aber prüfe Failure Domain und Operationskosten.
5. Validiere Alignment, Overlap und erlaubte Adressklasse gegen IPAM.
6. Prüfe Route, VRF/VPC/VNet, CNI/Pod/Service, DNS, firewall, NAT and return path.
7. Dokumentiere Aggregate, spezifische Ausnahmen, Ablaufdaten und Monitoring.
8. Führe nur einen owner-approved, reversiblen Change mit Akzeptanzkriterien aus.
```

### Provider-/Plattformreservierungen

Cloud VPCs/VNets, Kubernetes-CNIs, Load Balancer, Gateways, Hypervisor-Netze und Netzwerkgeräte können aus einem Präfix Adressen reservieren oder andere Mindestgrößen erwarten. Diese Fakten sind versions- und produktabhängig. Der Kapazitätsplan enthält deshalb einen überprüften Wert aus aktueller Plattformdokumentation, nicht eine kopierte Faustformel.

## Scalability und Performance

### Präfixgröße formt Failure Domains

Ein größeres Präfix kann mehr Endpoints aufnehmen, vergrößert aber je nach Design:

- Neighbor-/ARP-/ND-Control-Plane und mögliche Broadcast-/Multicast-Reichweite;
- Security- und Incident-Blast-Radius;
- mögliche IPAM-/DHCP-/CNI-Churnwirkung;
- Aufwand für Asset-/Workloadzuordnung;
- Auswirkungen eines fehlerhaften RA, einer Route oder Securityregel.

Viele kleine Präfixe können umgekehrt FIB-/TCAM-/Route-/Firewall-/IPAM-Objekte und operative Übergaben vermehren. Die geeignete Größe entsteht aus Last, Segmenttyp, Substrat, Hardware/Providerlimit, Autonomie des Teams und eindeutiger Ownership.

| Metrik | Aussage | Fehlinterpretation vermeiden |
|---|---|---|
| Prefix utilization | Reserve und Fragmentierung | 30 % frei heißt nicht, dass Migration oder Peak abgedeckt sind. |
| Allocation/release churn | Automations- und Lifecyclebedarf | kein Beweis für schlechte Präfixwahl ohne Zeitfenster. |
| Routes per domain / FIB pressure | Aggregations- und Skalierungssignal | nicht jede spezifische Route ist falsch. |
| Overlap findings | Integrations-/M&A-Risiko | isolierte VRFs können bewusst überlappen. |
| Failed allocations | IPAM-/Quota-/Reservationproblem | Ursache kann Berechtigung oder Plattformpolicy sein. |
| Blast-radius simulation | Segment-/Security-/Incidentwirkung | braucht ein realistisches Fehler- und Recoverymodell. |

## Reliability und Failure Modes

| Fehlerbild | Ursacheklasse | Sichere Analyse |
|---|---|---|
| Workload bekommt keine Adresse | Kapazität, CNI/Cloud-Reserve, Quota, IPAM-/RBAC-Fehler | allokierbare statt theoretische Kapazität, Eventevidenz und Owner prüfen. |
| Traffic geht ins falsche Site | Overlap oder falsche spezifische Route | Longest-Prefix-Match, VRF, aggregate, exception route und Zeitachse prüfen. |
| Neuer Prefix erzeugt Outage | fehlende Route/Policy/DNS/return path | Intent, Change, route/security/observability als Kette prüfen. |
| Aggregate blackholed Teilnetz | Lücke oder fehlerhafter Summary | Parent-/Child-Inventory, discard/exception policy und actual topology prüfen. |
| M&A-/Partnerintegration scheitert | private Address Overlap | Renumbering, translation, VRF oder application boundary gegen Kosten und Dauer bewerten. |
| IPv6-Standort hat „unendlich“ viel Platz, aber keine Konnektivität | Delegation, route, RA/policy oder support gap | Prefix owner, route/RA/ND, security, platform support prüfen. |
| `/31` funktioniert nicht | ungeeigneter Link oder Gerät | RFC-3021-Support, Linktyp, Monitoring und vendor implementation validieren. |

Ein Ausfall wird nicht durch spontanes Splitten, Summarisieren oder manuelles Freischaufeln von IPs gelöst. Diese Eingriffe verändern Routing- und Securityzustand. Zuerst Scope, Plan, tatsächliche Route, Reservierungen und Änderungszeitachse feststellen.

## Security, Governance und Compliance

### Sicherheitsfolgen

Ein Prefix ist oft eine Eingabe für Firewall, Security Group, ACL, Logging, Egressregel, Assetabfrage und Anomalieerkennung. Zu breite Präfixe können zu permissiven Regeln führen; zu viele Ausnahmepräfixe machen Policy unverständlich. Jede freigegebene Regel braucht:

```text
source/destination prefix + address family + zone/owner
+ protocol/port or higher-layer identity
+ purpose + data classification
+ expiry/review + monitoring + rollback
```

IP-/Prefix-Allowlisting ersetzt keine Workload Identity, mTLS oder Anwendungsautorisierung. Es kann jedoch eine sinnvolle Netzgrenze sein, wenn Scope, Anti-Spoofing und Trust Boundary klar sind.

### Governance

- IPAM ist die autoritative Quelle, kein Spreadsheet-Export oder Router-Snapshot.
- Prefixes besitzen Owner, Purpose, Lebensdauer, Parent, Reserven und eine geprüfte Overlap-Aussage.
- Neue Cloud Accounts, Standorte, Partner, Akquisitionen und CNI-Ranges passieren ein automatisiertes Overlap-Gate.
- Deaggregierte Ausnahmepräfixe haben Grund, Risiko, Ablaufdatum und Rückbauowner.
- Adress-/Route-/Security-Logs folgen Datenminimierung, Zugriffskontrolle und Retention-Regeln.
- Produkt-, Standort- und Plattformteams haben klaren Selbstservice innerhalb reservierter Elternpräfixe; zentrale Governance verhindert nur kollidierende oder riskante Änderungen.

## Observability und Troubleshooting

Ein Prefix-Event ist nur mit Kontext nachvollziehbar:

```text
timestamp, address family, prefix, parent aggregate,
environment/site/zone, routing domain, owner,
allocation state, route decision, security decision,
platform reservation source, change id, correlation id
```

### Read-only Fragen

1. Welches IPAM-Objekt besitzt das Zielpräfix?
2. Welche Parent-/Child-Präfixe überlappen, und ist das absichtlich?
3. Welche Route gewinnt per Longest Prefix Match im betroffenen Kontext?
4. Ist die theoretische Kapazität kleiner als die allokierbare Plattformkapazität?
5. Welche Changes, Autoscaling- oder Migrationsereignisse korrelieren?
6. Leitet ein Aggregate sicher zu allen erlaubten Children, und wie werden Lücken behandelt?
7. Ist ein Problem IPv4-, IPv6- oder Dual-Stack-spezifisch?

Keine Diagnose rechtfertigt einen unautorisierten Route- oder Firewallchange. Ein offline berechnetes Prefix ist eine Hypothese; die Laufzeitroute ist die konkrete Evidenz.

## Cost und FinOps

Schlecht geplante Präfixe erzeugen Kosten durch:

- Renumbering nach M&A, Cloudmigration oder Providerwechsel;
- Translation, Sonderrouting und spezifische Securityregeln;
- Route-/Firewall-/IPAM-/CNI-Objektwachstum;
- längere Incidents durch unklare Ownership oder Overlap;
- öffentliche IPv4-, NAT-, Egress- und Managed-Network-Kosten;
- verspätete IPv6-Einführung und doppelte Dual-Stack-Arbeit.

Bewerte nicht nur Auslastung, sondern **Option Value**: Eine reservierte, gut dokumentierte und aggregierbare Kapazität kann eine spätere Migration deutlich günstiger machen. Eine übergroße, ungenutzte Reserve ohne Owner bindet dagegen Komplexität und verdeckt Bedarf. Preise, Quoten und Providerrestriktionen sind zeitabhängig und werden für die Zielumgebung validiert.

## Trade-offs und Anti-Patterns

| Entscheidung | Vorteil | Risiko | Leitplanke |
|---|---|---|---|
| Große zusammenhängende Parent-Reservation | Wachstum und Aggregation | zu großer Blast Radius bei schlechter Unterteilung | klare Child-Grenzen, Ownership und Security. |
| Kleine, bedarfsgerechte Child-Prefixes | weniger Adressverschwendung | Fragmentierung und mehr Objekte | mit Parent-/Aggregate-Plan und Automation. |
| Aggressive Aggregation | weniger Routingstate | Blackhole oder falsche Policy bei Lücken | nur aligned, contiguous, topologisch und monitored. |
| Deaggregation für Ausnahme | präzises Steering | dauerhafte Routing-/Policy-Schuld | Ablaufdatum und Rückbau. |
| Translation statt Renumbering | kurzfristige Integration | State-, Log- und Betriebsaufwand | zeitlich begrenzter, dokumentierter Bridge. |
| `/31` auf p2p | spart IPv4-Adressen | Tool-/Device-/Monitoring-Fehler | nur validierte Punkt-zu-Punkt-Kontexte. |

**Anti-Pattern: „Wir nehmen einfach ein /24.“** Der Präfixwert muss Bedarf, Plattformreserve, L2/L3-Grenze, Securityzone, Routeaggregation und Wachstum erklären.

**Anti-Pattern: numerische Aggregation ohne Topologie.** Ein /16 kann eine Reihe von /24s abdecken und dennoch Traffic zum falschen Standort führen, wenn Ownership und Pfad unterschiedlich sind.

**Anti-Pattern: freie Adresse = freie Kapazität.** Migration, HA, Reserved Addresses, CNI, Gateway, Blue/Green und Policy können den rechnerischen Raum stark reduzieren.

**Anti-Pattern: IPv6 nicht planen, weil genug Bits vorhanden sind.** Delegation, Segmenthierarchie, DNS, Route, RA, Security und Observability benötigen ebenso einen Vertrag.

## Staff-, Principal- und Chief-Level Decisions

### Staff / Principal

1. Definiere eine wiederverwendbare Präfixhierarchie für Environment, Standort/Zone, Funktion und Plattform.
2. Führe Capacity Reviews mit Peak, Churn, HA, Migration, Cloud-/CNI-Reservierungen und Failure Domain durch.
3. Automatisiere Alignment-, Overlap- und Parent-/Child-Policy-Prüfungen vor der Allocation.
4. Begrenze spezifische Routen durch ADR, Owner, Ablauf und Review.
5. Mache IPAM, DNS, Routing, Security und Telemetrie über stabile IDs und Change-Korrelation konsistent.

### Chief

1. Behandle Address Space und Route Aggregation als Grundlage für Multi-Cloud-, Standort- und M&A-Strategie.
2. Finanziere IPAM/DDI- und Policy-Automatisierung als Plattformfähigkeit, nicht als Inventarprojekt.
3. Lege Risikogrenzen für Overlap, Deaggregation, nicht zuordenbare Prefixes und IPv4-only-Legacy fest.
4. Vergleiche Renumbering mit Translation nicht nur nach Projektkosten, sondern nach langfristiger Support-, Security- und Produktgeschwindigkeit.
5. Verlange von Lieferanten klare Aussagen zu Prefixdelegation, Reserven, Limits, Telemetrie und Exitbarkeit.

## Production Checklist

- [ ] Alle Prefixes sind in IPAM mit Parent, Owner, Purpose, Scope, Lifecycle und Change-/Rollbackverweis erfasst.
- [ ] Präfixe sind bit-ausgerichtet; Netzgrenzen und Adressbereiche wurden automatisiert geprüft.
- [ ] Theoretische und tatsächlich allokierbare Kapazität unterscheiden Provider-/CNI-/Gateway-/Reserveadressen.
- [ ] Capacity-Modell enthält steady state, peak, HA, Blue/Green, Migration, Churn und Wachstumshorizont.
- [ ] Cloud, On-Prem, Partner, M&A, Pod-/Service- und Managementranges wurden auf Overlap geprüft.
- [ ] IPv4-/IPv6-Adressscope und Sonderbereiche sind je Familie korrekt behandelt.
- [ ] Parent-/Child-Struktur erlaubt sichere, topologisch sinnvolle Aggregation.
- [ ] Deaggregationen besitzen Owner, Begründung, Ablaufdatum, Monitoring und Rückbau.
- [ ] `/31` wird nur auf unterstützten Punkt-zu-Punkt-Links eingesetzt.
- [ ] Route, DNS, Security, NAT/Proxy, Return Path und Observability sind vor Freigabe gegen das Prefix-Intent geprüft.
- [ ] Prefixbasierte Regeln minimieren Zugriff und ergänzen starke Workload-/Application-Identity.
- [ ] IPAM-/Routen-/Securitydaten sind datensparsam, zugriffsgesteuert und auditierbar.
- [ ] Wiederanlauf-, Migration- und Incident-Tests validieren Kapazität und Aggregate unter kontrollierten Bedingungen.

## Praktisches Lab: Offline-CIDR, Overlap und Aggregation

**Status:** `reviewed_only`. Die folgende Fallarbeit ist als lokale Python-Ausführung vorgesehen. Sie bearbeitet nur in-memory Dokumentations- und private Beispielpräfixe.

```python
import ipaddress

site_parent = ipaddress.ip_network("10.60.0.0/18")
children = [
    ipaddress.ip_network("10.60.16.0/24"),
    ipaddress.ip_network("10.60.17.0/24"),
    ipaddress.ip_network("10.60.18.0/24"),
    ipaddress.ip_network("10.60.19.0/24"),
]
partner = ipaddress.ip_network("10.60.0.0/16")
p2p = ipaddress.ip_network("192.0.2.0/31")

print("parent:", site_parent.network_address, site_parent.broadcast_address)
print("parent addresses:", site_parent.num_addresses)
print("overlap:", site_parent.overlaps(partner))
print("p2p endpoints:", list(p2p.hosts()))

summary = list(ipaddress.collapse_addresses(children))
print("aligned aggregate:", summary)  # 10.60.16.0/22

gap = children[:2] + children[3:]
print("gapped result:", list(ipaddress.collapse_addresses(gap)))
```

### Erwartete Erkenntnisse

1. `10.60.0.0/18` ist ein zusammenhängender Parent mit 16.384 IPv4-Adressen; seine operative Allokierbarkeit hängt von Plattform- und Sicherheitsdesign ab.
2. Der Partnerbereich `/16` überlappt den Site-Parent. Eine direkte Integration benötigt eine dokumentierte Strategie.
3. Vier angrenzende `/24` ab `.16` lassen sich zu `10.60.16.0/22` zusammenfassen.
4. Entfernt man `10.60.18.0/24`, entsteht keine echte /22-Aggregation. Das Modell gibt mehrere Prefixes zurück statt eine falsche Summary zu erfinden.
5. Das `/31`-Beispiel zeigt zwei Hostwerte; ob eine reale Strecke dies unterstützt, ist außerhalb der Offlineberechnung zu validieren.

### Negative Probes

- Ersetze ein Child durch `10.60.20.0/24`: Die Zusammenfassung darf nicht mehr `10.60.16.0/22` sein.
- Ergänze einen zweiten Kontext mit gleichem Präfix in einer anderen VRF: Das Modell erkennt die Zahlengleichheit nicht als alleinigen Fehler; Ownership und Routingdomäne müssen ergänzt werden.
- Simuliere 700 Peak-Endpunkte in einem `/23`: Die reine Zahl 512 widerlegt die Kapazität bereits vor einer Netzänderung.
- Ergänze eine Plattformreserve: Der Bedarf wird nicht durch rechnerisch „nutzbare“ Hostadressen unterschätzt.

### Cleanup

Lösche nur die temporäre lokale Python-Datei. Das Lab erzeugt keine Interfaces, IPs, Routen, Pakete, IPAM-Einträge, DNS-Records, Cloudobjekte oder Produktionsänderungen.

## Interviewfragen mit Antworten

### 1. Wie viele IPv4-Adressen enthält ein `/20`?

`2^(32-20) = 4096`. Wie viele davon konkret an Workloads vergeben werden können, hängt von Linktyp, Netzmodell und Plattformreservierungen ab. Bei einem traditionellen Multi-Access-Subnetz sind Netz- und directed-broadcast-Werte ein Faktor; bei Cloud/CNI kommen zusätzliche Reserven hinzu.

### 2. Wann lassen sich vier `/24` zu einem `/22` aggregieren?

Wenn sie zusammenhängend und am /22 ausgerichtet sind: etwa `10.60.16.0/24` bis `10.60.19.0/24`. Zusätzlich müssen Forwarding, Ownership, Security und Topologie so passen, dass die Summary keine falschen Pfade oder Policies erzeugt.

### 3. Warum ist Longest Prefix Match wichtig?

Ein Ziel kann mehrere Routen matchen. Die spezifischste passende Route gewinnt. Das erlaubt präzise Ausnahmen, kann aber auch ein Parent-Aggregat übersteuern und unerwartete Pfade schaffen. Jede spezifische Route braucht daher Intent und Lifecycle.

### 4. Wann kann ein `/31` verwendet werden?

Auf passenden IPv4-Punkt-zu-Punkt-Links, wenn beide Endpunkte und das Betriebs-/Monitoringmodell RFC 3021 unterstützen. Es ist nicht die Standardwahl für ein Multi-Access-Subnetz.

### 5. Ist eine große IPv6-Delegation automatisch gute Planung?

Nein. IPv6 reduziert Hostadressknappheit, aber Prefixhierarchie, Standort/Zone, Segmentierung, Routeaggregation, RA/DNS/Security, IPAM, Observability und Providerlimit bleiben Architekturaufgaben.

### 6. Was ist gefährlicher: zu kleines oder zu großes Subnetz?

Beides kann schaden. Zu klein führt zu Allocation Failures, Ad-hoc-Erweiterungen und Fragmentierung. Zu groß kann Blast Radius, Control Plane, Security und Ownership verwässern. Entscheidend ist die mit Evidenz begründete Grenze.

### 7. Wie behandelst du Overlap bei einer Firmenübernahme?

Zuerst Integrationsscope, Datenflüsse, Timeline, IPAM-Qualität und Sicherheitsgrenzen bewerten. Danach Renumbering, Translation, getrennte Routingdomänen oder Applikationsvermittlung mit Kosten, Risiken, Exit und Betrieb vergleichen. Eine Adresse ohne Kontext ist keine Lösung.

## Dependencies und Cross-References

| Beziehung | Datei | Verwendung |
|---|---|---|
| Voraussetzung | [KB-0052](04-ipv4-adressierung.md) | IPv4-Scopes, Address Governance und Overlapfolgen. |
| Voraussetzung | [KB-0053](05-ipv6-adressierung-und-uebergang.md) | IPv6-Präfixe, Scope und Transition. |
| Weiterführung | [KB-0055](07-icmp-und-pfadfehler.md) | Pfad-, MTU- und Fehlerdiagnose innerhalb definierter Prefixes. |
| Weiterführung | [KB-0056](08-tcp-verbindungen-und-ueberlastkontrolle.md) | Transport über durch Routes/Prefixes gewählte Pfade. |
| Anwendung | [KB-0080](../04-enterprise-networking/04-mpls-und-label-switching.md) | Provider-/Routingkontext und Aggregation bei Unternehmensanbindungen. |
| Evidenz | [KB-0720](../30-architect-practice/44-portfolioevidenz-und-reifemodelle.md) | Capacity-Modell, ADR, Migration und reale Reife belegen. |

## Quellen und zeitliche Einordnung

| Quelle | Verwendung | Stand |
|---|---|---|
| Dateikatalog KB-0054 | verbindlicher Scope und Reihenfolge. | Planstand 2026-09-14 |
| [RFC 4632](https://www.rfc-editor.org/rfc/rfc4632) | CIDR, Prefixnotation, Address Assignment und Routing Aggregation. | abgerufen 2026-09-16 |
| [RFC 3021](https://www.rfc-editor.org/rfc/rfc3021) | `/31`-Präfixe auf Punkt-zu-Punkt-Links. | abgerufen 2026-09-16 |
| [RFC 1918](https://www.rfc-editor.org/rfc/rfc1918) | private IPv4-Räume, Overlap und Renumbering. | abgerufen 2026-09-16 |
| [RFC 4291](https://www.rfc-editor.org/rfc/rfc4291) | IPv6-Adress-/Präfixarchitektur. | abgerufen 2026-09-16 |
| [RFC 6177](https://www.rfc-editor.org/rfc/rfc6177) | IPv6-Adresszuweisung für Endsites. | abgerufen 2026-09-16 |
| [IANA IPv4 Address Space](https://www.iana.org/assignments/ipv4-address-space/ipv4-address-space.xhtml) | aktuelle globale Address-Space-Verwaltung. | abgerufen 2026-09-16 |
| [KB-0052](04-ipv4-adressierung.md) und [KB-0053](05-ipv6-adressierung-und-uebergang.md) | kanonische Addressing-Voraussetzungen. | 2026-09-16 |

IETF-Standards, IANA-Zuweisungen, Provider-/Cloud-/CNI-Reserven, Router-/FIB-/TCAM-Limits, Preise, Quoten und Compliancevorgaben ändern sich mit Produkt, Version, Vertrag und Umgebung. Vor einer Allokation oder Änderung gelten aktuelle IPAM-Daten, Plattformdokumentation, freigegebene Architektur, Securitypolicy, Owner und ein getesteter Rollback.

## Bonus: New Tech and Innovations

**Stand 2026-09-16 — Policy-as-Code und IPAM-as-Code können Prefix-Hierarchie, Overlap-Prüfung, Route-/Security-Intent und Change-Evidenz als überprüfbaren Workflow verbinden.** **Reifegrad: adaptiert bis etabliert je Plattform.** Der Nutzen setzt eine autoritative Quelle, strenges RBAC, Drift-Erkennung und eine sichere Ausnahmebehandlung voraus.

**Stand 2026-09-16 — Cloud-/CNI-Integrationen machen Adresskapazität dynamischer, weil Nodes, Pods, Services, Gateways und Load Balancer unterschiedliche Prefix- und Reservierungsmodelle benötigen.** **Reifegrad: etabliert.** Kapazitätsmodelle müssen diese Runtime-Reserven messen und nicht aus VM-Zählungen schätzen.

**Stand 2026-09-16 — Adressfamilienübergreifende Prefix-Analytics können Fragmentierung, Overlap, ungenutzte Reserven und Deaggregation als Architecture Debt sichtbar machen.** **Reifegrad: adaptiert.** A pilot accepts a prefix automation only when allocation, route, policy, ownership, capacity evidence and rollback remain consistent.

