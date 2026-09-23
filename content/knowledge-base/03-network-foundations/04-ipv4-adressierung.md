---
{"id": "KB-0052", "title": "IPv4-Adressierung", "domain": "03", "sequence": 4, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0039", "concepts": ["Host-Paketpfad", "Routingkontext", "Interfaces"], "needed_for": "understanding"}, {"id": "KB-0046", "concepts": ["Fehlerhypothesen", "Zeitachse", "Kapazitätsanalyse"], "needed_for": "both"}, {"id": "KB-0049", "concepts": ["IP-Schicht", "Adresse", "Next Hop"], "needed_for": "both"}, {"id": "KB-0051", "concepts": ["ARP", "On-Link-Ziel", "Default Gateway"], "needed_for": "both"}], "related": ["KB-0050", "KB-0053", "KB-0054", "KB-0055", "KB-0080", "KB-0562", "KB-0720"], "applies": ["KB-0080", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein offline ausgeführtes Python-Modell klassifiziert Dokumentations-, Privat-, Link-Local- und besondere Adressbereiche, prüft Überlappungen und leitet die Broadcast-Grenze ab.", "rationale": "Das Lab nutzt nur in-memory Werte und initiiert keine Namensauflösung, keinen Socket, kein Interface, keine Route, keinen Cloud- oder Produktionszugriff."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein IPv4-Adressplan verbindet Präfixe, Zuordnung, Segment/Zone, Route, IPAM, DNS, Security, Growth Reserve, Exit/Translation und Owner.", "rationale": "Adressklassen werden nicht als Designregel verwendet; alle Entscheidungen referenzieren explizite Präfixe und dokumentierte Routen."}, "STAFF-TARGET": {"active": true, "scope": "Ein Overlap- und Connectivity-Review trennt lokale Direktheit, geroutete Erreichbarkeit, Name, Policy, NAT/Proxy und Anwendungspfad.", "rationale": "Es verhindert, dass privater Adressraum oder ein erfolgreicher Ping als pauschale Erklärung für Erreichbarkeit oder Sicherheit dient."}, "CHIEF-TARGET": {"active": true, "scope": "IPv4-Knappheit, Private-/Shared-/Public-Space, Multi-Cloud-/M&A-Überlappungen, IPv6-Übergang, IPAM-Qualität, Security und Renumbering werden als mehrjähriges Risiko- und Investitionsportfolio gesteuert.", "rationale": "Die Entscheidung bewertet Migration, Providerabhängigkeit, Betriebsfähigkeiten, Kosten und Daten-/Sicherheitsgrenzen statt nur freie Adressanzahlen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "BGP-Adressaggregation, IPAM-Automatisierung, NAT-Scale, Anycast, DDoS-Edge, CGN, DHCP-Implementierung, Fabric-Routen und Kernel-FIB/Policy-Routing sind Spezialistentiefe.", "rationale": "Die Zielrollen müssen die Annahmen, Limits und Belege prüfen, ohne jeden Router- oder Providerdatenpfad selbst zu administrieren."}}, "lab_validation": [{"lab_id": "KB-0052-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox mit Standardbibliothek ipaddress", "evidence": "Adressklassifikation, Präfixüberlappung, gerichtete Broadcastableitung und Gegenproben sind fachlich geprüft.", "limitations": "Nicht ausgeführt; keine IP wurde gebunden, kein Paket erzeugt, keine Route abgefragt oder verändert, kein DNS genutzt und keine Cloud-, Provider- oder Produktionsressource berührt."}]}
---
# IPv4-Adressierung

> **Ziel:** Eine IPv4-Adresse ist ein 32-Bit-Locator in einem konkreten Präfix-, Routing- und Verwaltungszusammenhang. „Privat“, „öffentlich“, „lokal“ und „erreichbar“ sind keine Synonyme. Ein belastbarer Entwurf erklärt für jede Adresse: Präfix, Zweck, Owner, Segment, Route, Sicherheitsgrenze, Lebensdauer und Migration.

## Purpose, Definition und Scope

IPv4 adressiert Endpunkte und Netze mit 32 Bit, dargestellt als vier Dezimaloktette. Seine praktische Bedeutung entsteht erst zusammen mit einem Präfix, einer Routingentscheidung und einer autoritativen Zuweisung. `10.20.30.40` ohne `/Präfix`, VRF/Namespace, Standort/Zone und Owner ist keine ausreichende Architekturinformation.

Dieses Kapitel behandelt:

- klassenunabhängige Präfixsicht statt historischer A-/B-/C-Klassen;
- private, special-purpose, Link-Local-, Dokumentations- und global verwendbare Adressbereiche;
- lokale gegenüber gerouteten Zielen, Default Gateway und Broadcast-Grenzen;
- Überlappungen in Unternehmen, Cloud, Partner- und M&A-Szenarien;
- IPAM, Security, Observability, Kosten und Staff-/Chief-Entscheidungen.

Nicht im Scope: vollständige CIDR-Binärrechnung und Aggregation (kanonisch [KB-0054](06-subnetting-und-cidr.md)), IPv6-Adressierung ([KB-0053](05-ipv6-adressierung-und-uebergang.md)), Routingprotokolle, DNS, NAT-Implementierung oder Cloud-spezifische VPC-/VNet-Konfiguration. Sie werden nur dort berührt, wo sie die Aussagekraft einer Adresse begrenzen.

Nach der Bearbeitung kannst du:

1. eine IPv4-Adresse immer mit Präfix, Scope und Eigentümer interpretieren;
2. RFC-1918-Bereiche, Shared Space, Link-Local- und Dokumentationsadressen fachlich trennen;
3. erklären, warum „private Adresse“ weder „on-link“ noch „sicher“ noch „nicht routbar im Unternehmen“ bedeutet;
4. Überlappungen als Architektur- und Betriebsrisiko erkennen und Lösungswege abwägen;
5. gerichteten Broadcast, `/31`-Punkt-zu-Punkt-Präfixe und ihre Ausnahmebedingungen einordnen.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | IETF- und IANA-Primärquellen beschreiben Bereiche, Broadcast-Regeln und Ingress-Filtering. |
| HANDS-ON-TARGET | Das Lab prüft nur lokale Datenstrukturen und führt keine Netzoperation aus. |
| ARCHITECT-TARGET | Der Plan behandelt Präfixe als versionierte, eigentumsgebundene Ressourcen mit Migrationspfad. |
| STAFF/PRINCIPAL | Reviews prüfen Intent, Route, Overlap, Policy und Security statt nur „freie IPs“. |
| CHIEF | Adressknappheit, Cloud-/M&A-Integration, IPv6 und Renumbering werden als Portfolio geführt. |

## Mental Model: Adresse plus Präfix plus Kontext

Eine gute mentale Gleichung ist:

```text
usable connectivity
= address family
+ prefix / route selection
+ local attachment or next hop
+ IPAM ownership
+ permitted policy
+ transport and application semantics
```

Die ersten Bits einer Adresse bestimmen unter dem **konfigurierten Präfix** die Netzzugehörigkeit; die übrigen Bits identifizieren einen Host, einen Punkt-zu-Punkt-Endpunkt oder eine andere definierte Verwendung. Historische Klassen sind für Diagnose alter Systeme manchmal nützlich, aber keine Grundlage für modernes Design.

```text
IPv4 address: 10.20.30.40
Prefix:       /24
Network:      10.20.30.0/24
Host part:    .40
Usable meaning only after:
  route table + interface/VRF + IPAM record + security policy
```

Ein Ziel kann:

- im selben Präfix **und** on-link sein;
- im selben nummerischen Bereich erscheinen, aber wegen VRF/Namespace/Cloud-Tenant getrennt sein;
- außerhalb des lokalen Präfixes über ein Gateway geroutet werden;
- privat sein und innerhalb eines Unternehmens routbar sein;
- global verwendbar aussehen, aber durch Policy, fehlende Route oder Besitzkonflikt unerreichbar sein.

## Prerequisites und Dependencies

| ID | Art | Bedeutung |
|---|---|---|
| [KB-0039](../02-linux-systems/09-linux-netzwerkstack-und-paketpfade.md) | Verständnis | Host-Routing, Namespaces und Paketpfad verorten eine Adresse im laufenden System. |
| [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Anwendung und Lab | Zeitachse, Gegenprobe und Kapazität helfen bei Overlap- und Reachability-Diagnose. |
| [KB-0049](01-osi-und-tcp-ip-als-analysemodelle.md) | Anwendung und Lab | IP-Schicht und Next-Hop-Prinzip verhindern die Verwechslung von Adresse und Link-Zustellung. |
| [KB-0051](03-arp-und-neighbor-discovery.md) | Anwendung und Lab | ARP löst nur die lokale Next-Hop-Zuordnung, nicht globale IPv4-Erreichbarkeit. |

## Core Concepts

### Klassen sind Geschichte, Präfixe sind der Vertrag

Classful IPv4 (A, B, C) wurde durch CIDR in der operativen Praxis ersetzt. Ein Präfix wie `/20` oder `/27` ist explizit und ermöglicht flexible Größe sowie Aggregation. Die Schreibweise `10.0.0.0/8` beschreibt ein Netz mit acht Netzbits, nicht „eine Klasse A als Designvorgabe“.

| Aussage | Korrekte Einordnung |
|---|---|
| „172.x ist privat.“ | Falsch. Nur `172.16.0.0/12` ist RFC-1918-Privatbereich; viele andere `172.x`-Adressen sind es nicht. |
| „192.168 ist immer lokal.“ | Falsch. `192.168.0.0/16` ist privat, aber seine lokale bzw. geroutete Erreichbarkeit ergibt sich aus Routen und Organisation. |
| „Private IPs werden nie geroutet.“ | Falsch. Sie sollen nicht über inter-enterprise/öffentliche Grenzen propagiert werden, können aber innerhalb eines koordinierten privaten Netzes geroutet werden. |
| „Public IP heißt Internet-reachable.“ | Falsch. Firewall, Route, NAT, DDoS-Edge, Provider, Bind, Service und Autorisierung entscheiden zusätzlich. |
| „Gleiche Zahl bedeutet gleicher Host.“ | Falsch. Überlappende private Räume können dieselbe Adresse in verschiedenen Kontexten legal verwenden, aber Integrationsprobleme verursachen. |

### Relevante Bereiche und ihre Grenzen

Der aktuelle [IANA IPv4 Special-Purpose Address Registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml) ist die maßgebliche zeitabhängige Referenz für Special-Purpose-Zuordnungen. Die folgende Tabelle ist eine Architekturhilfe, keine vollständige Ersatzkopie der Registry.

| Bereich | Typische Bedeutung | Architektur- und Sicherheitsgrenze |
|---|---|---|
| `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` | RFC 1918 private use | nur im koordinierten privaten Kontext eindeutig; nicht an öffentlichen/inter-enterprise Grenzen leaken. |
| `100.64.0.0/10` | Shared Address Space nach RFC 6598 | für Provider-/Carrier-Shared-Use vorgesehen; nicht automatisch ein weiterer Enterprise-Privatbereich. Konkrete Nutzung und Kollisionsrisiko prüfen. |
| `169.254.0.0/16` | IPv4 Link-Local nach RFC 3927 | lokal begrenzt; nicht als planbarer, gerouteter Enterprise-Adressraum behandeln. |
| `127.0.0.0/8` | Loopback | lokale Hostbedeutung; kein remote Service-Locator. |
| `0.0.0.0/8`, `255.255.255.255/32` | besondere/unspezifizierte bzw. limited broadcast-Kontexte | nicht wie reguläre Endpunktpräfixe planen. |
| `192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` | Dokumentation | für Beispiele und Labs, nicht für reale Zuweisung. |
| `224.0.0.0/4` | Multicast | Gruppenkommunikation, keine normale Hostzuweisung. |
| weitere IANA-Sonderbereiche | spezifische Reservierungen | vor Nutzung stets Registry und Plattformdokumentation prüfen. |

RFC 1918 reserviert genau drei private Bereiche. Der Nutzen ist freie interne Planung; der Preis ist mögliche Mehrdeutigkeit bei Zusammenschluss, Partneranbindung, Multi-Cloud und externen Services. RFC 1918 selbst benennt Renumbering als reale Kostenfolge.

### Lokal versus geroutet

Ein Host betrachtet ein Ziel anhand des längsten passenden Präfixes und der Routing-/Policy-Regeln. Vereinfacht:

```text
destination 10.20.30.55
local interface 10.20.30.40/24
  -> direct/on-link candidate
  -> ARP target 10.20.30.55

destination 10.20.31.55
local interface 10.20.30.40/24
default route via 10.20.30.1
  -> remote candidate
  -> ARP target 10.20.30.1, not 10.20.31.55
```

Die Vereinfachung darf nicht über VRFs, Network Namespaces, Policy Routing, Cloud Route Tables, Overlay-Fabrics, Proxy-/NAT-Grenzen oder mehrere Interfaces hinwegtäuschen. Deshalb ist „subnet match“ ein erster Hinweis, kein alleiniger Produktionsbeweis.

### Broadcast-Grenzen

IPv4 kennt den Limited Broadcast `255.255.255.255`, der nicht durch Router weitergeleitet wird. Ein **directed broadcast** ist die Adresse, bei der alle Hostbits eines Präfixes Eins sind, beispielsweise `192.0.2.255` für `192.0.2.0/24`. Ob und wie directed broadcasts behandelt werden, hängt von Präfix, Host-/Routerimplementation und Policy ab. RFC 2644 setzte den Standardrouter-Default auf das Nicht-Weiterleiten von directed broadcasts, insbesondere um Smurf-artige Amplification-Risiken zu reduzieren.

Vermeide die Regel „erste Adresse ist immer Netzadresse und letzte immer Broadcast“ ohne Präfixkontext:

- bei typischen Multi-Access-Subnetzen ist diese Denkregel als Planungsheuristik nützlich;
- auf Punkt-zu-Punkt-Links können `/31`-Präfixe nach RFC 3021 beide Adressen für die zwei Endpunkte nutzen;
- `/32` repräsentiert eine einzelne Hostroute/Adresse und besitzt keine traditionelle Broadcast-Domäne;
- Plattformen und virtuelle Fabrics können weitere Constraints oder Abstraktionen einführen.

## Architecture und Data Flow

### Beispiel: Multi-Zone-Produktplattform

```text
Enterprise IPAM
  ├─ production 10.40.0.0/16
  │   ├─ zone-a application 10.40.16.0/20
  │   ├─ zone-b application 10.40.32.0/20
  │   └─ shared services 10.40.48.0/20
  ├─ non-production 10.50.0.0/16
  └─ partner connectivity: explicitly translated or non-overlapping prefixes

Workload request:
service name -> selected A/AAAA record -> route/policy -> next hop
              -> ARP/ND if local-next-hop mapping needed
              -> firewall/NAT/LB -> remote route -> workload identity/TLS/application
```

Das Beispiel zeigt eine **hierarchische Zuordnung**, keine universelle Größe. Ein Plan muss Zuständigkeit, Wachstumsreserve und verbindliche Grenzen abbilden. Das Produktionspräfix wird nicht einfach nach Zahl „größer“ gewählt, sondern nach erwarteten Zonen, organisatorischen Ownership-Grenzen, Aggregationsziel, Migrationspfad und Plattformlimits.

### Overlap als Daten- und Betriebsproblem

Zwei Firmen, Clouds oder Business Units können beide `10.0.0.0/8` verwenden. Solange sie vollständig getrennt bleiben, ist das zulässig. Sobald ein Request eine Verbindung, eine VPN-/WAN-Strecke, gemeinsame DNS-Zone, Sicherheitsanalyse oder Observability-Pipeline überquert, kann `10.1.2.3` mehrdeutig sein.

| Ansatz | Nutzen | Kosten / Risiko | Geeignet wenn |
|---|---|---|---|
| Renumbering | langfristig eindeutiger, einfacher Datenpfad | Migration, DNS-/Config-/Firewall-/Audit-Arbeit | dauerhafte Integration und klare Zukunftsarchitektur. |
| Translation/NAT/Proxy | kurzfristige Entkopplung | Zustand, Troubleshooting, Logs, Identitäts- und Protokollgrenzen | begrenzter, dokumentierter Verkehrsfluss. |
| VRF/Netzwerkvirtualisierung | getrennte Routingkontexte | erhöht Betriebs- und Observabilitykomplexität | echte Mandanten-/Domänentrennung nötig ist. |
| Applikationsvermittlung | kann IP-Overlap hinter klaren APIs verbergen | Latenz, HA, Zertifikat/Auth, neue Betriebskomponente | nur wenige definierte Dienste verbunden werden. |
| „Wir merken uns den Kontext im Kopf“ | kein kurzfristiger Aufwand | nicht skalierbar, hohe Incidentgefahr | niemals als Architekturentscheidung. |

Eine Translation löst nicht automatisch die Beweiskette in Logs. Telemetrie muss Original- und übersetzten Kontext, aber auch Datenschutz, Zugriff und Retention nachvollziehbar behandeln.

### Adressierung ist ein Lebenszyklus

```text
demand -> capacity model -> prefix reservation in IPAM
       -> environment/zone/owner assignment
       -> route + security + DNS/service design
       -> automated allocation and change evidence
       -> utilization / conflict / leakage monitoring
       -> renumbering, release and audit closure
```

Ein nicht dokumentiertes „freies /24“ ist keine Reserve. Es ist ein Risiko für Overlap, Schatteninfrastruktur und Migrationskosten.

## Protocols, Standards, Tools und Technologien

| Bezug | Aussage | Anwendungsgrenze |
|---|---|---|
| [RFC 1918](https://www.rfc-editor.org/rfc/rfc1918) | Private IPv4-Bereiche und die Folgen nicht global eindeutiger Adressen. | Kein Ersatz für aktuelle IANA Registry, IPAM und konkrete Routingpolicy. |
| [IANA Special-Purpose Registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml) | aktueller Status besonderer IPv4-Bereiche. | Zeitabhängig: immer aktuell prüfen. |
| [RFC 3927](https://www.rfc-editor.org/rfc/rfc3927) | IPv4 Link-Local und Konflikterkennungskontext. | Link-local nicht als reguläres geroutetes Design missbrauchen. |
| [RFC 2644](https://www.rfc-editor.org/rfc/rfc2644) | directed broadcast Router-Default und Sicherheitsmotivation. | Produkt-/Policyverhalten konkret validieren. |
| [RFC 3021](https://www.rfc-editor.org/rfc/rfc3021) | `/31` auf Punkt-zu-Punkt-Links. | Nur mit passenden Endpunkten/Netztypen und dokumentierter Unterstützung. |
| [RFC 2827](https://www.rfc-editor.org/rfc/rfc2827) | Ingress Filtering gegen Source-Address-Spoofing. | Filtering ist Teil eines mehrschichtigen Sicherheitsdesigns. |
| IPAM / DDI / IaC | Source of Truth, Vergabe, DNS-/DHCP-/Policy-Anbindung | Produktwahl, Datenmodell, RBAC und Change-/Rollback bleiben Architekturarbeit. |
| Cloud VPC/VNet / CNI / VRF | virtuelle Adress- und Routingkontexte | Reserven, Non-overlap-Regeln, egress und Observability sind provider-/versionabhängig. |

## Konfiguration und Implementation

### Adressplan als maschinenlesbarer Vertrag

Ein Plan sollte mindestens folgende Felder pro Präfix führen:

```yaml
prefix: 10.40.16.0/20
environment: production
zone: zone-a
purpose: application-workloads
routing-domain: prod-core
owner_team: platform-network
allocation_source: ipam
growth_reservation: documented
dns_policy: service-discovery-only
egress_policy: approved-egress-class-a
overlap_status: unique-in-target-integration-scope
data_classification: internal
change_and_rollback: CHG-XXXX
```

Dies ist ein Schema, keine produktionsfertige Konfiguration. Vermeide das Eintragen von Secrets, Kundendaten oder unredigierten Incidentdetails in allgemeine Netzplandateien.

### Präfixzuteilung mit Wachstum und Aggregation

1. Zähle nicht nur heutige Hosts, sondern Zonen, Workloadarten, temporäre Migration, Autoscaling, Blue/Green, Bastion-/Managementpfade und Reserve.
2. Lege eine Hierarchie fest: Organisation/Region → Environment → Zone/Site → Funktion → Segment. Die Hierarchie darf Teamgrenzen abbilden, ohne unkontrollierte Fragmentierung zu erzeugen.
3. Reserviere nur mit dokumentierter Begründung; ungebundene große Blöcke verstecken Knappheit.
4. Prüfe Überschneidung gegen alle realen Integrationsräume: On-Prem, Cloud Accounts/Subscriptions, Partner, akquirierte Firmen, VPN/Transit, Container-/Pod-/Service-Netze und Out-of-Band-Management.
5. Verknüpfe Route, DNS, Firewall, Observability und Owner automatisiert mit der IPAM-Quelle.
6. Plane Renumbering beim ersten Entwurf: TTLs, Konfigurationswerte, Zertifikat-/ACL-Referenzen, Migrationsfenster, Dual Reachability, Erfolgskriterien und Rückbau.

### Statische, dynamische und reservierte Adressen

Eine Adresse kann automatisch zugeteilt, statisch reserviert oder manuell gesetzt sein. Die Technik allein entscheidet nicht über Governance:

- dynamisch braucht belastbare Lease-/Lifecycle-/Inventory- und Konfliktprozesse;
- statisch braucht Eigentümer, Zweck, Change-Control, Ersatz-/HA-Plan und Rückgabe;
- reserviert braucht Ablaufdatum, Kapazitätsbegründung und regelmäßige Review;
- Adressbezug in Anwendungen sollte durch Namen/Discovery/konfigurierbare Intent-Schichten erfolgen, nicht durch fest eingebaute IP-Literale.

### NAT, Proxy und Load Balancer

NAT kann Adressen und gegebenenfalls Ports übersetzen; ein Proxy oder Load Balancer kann Verbindungen terminieren und neu aufbauen. Keiner dieser Bausteine entfernt die Pflicht zu Eindeutigkeit in jedem jeweiligen Kontext. Dokumentiere:

```text
original source/destination context
-> translation or termination point
-> translated context
-> policy and identity decision
-> log correlation key
-> return path / asymmetry assumption
```

NAT ist kein Ersatz für Netzwerksegmentierung, starke Workloadidentität, sichere Application-Protokolle oder IPAM. Zudem können Protokolle, Diagnose und Audit durch Übersetzung komplexer werden.

## Scalability und Performance

### Was skaliert tatsächlich?

Adressraum ist kein reiner Zähler. Die Engpässe können bei IPAM-Workflows, Route-/FIB-/TCAM-Kapazität, Sicherheitsregeln, NAT-Ports, Load-Balancer-Targets, DNS-Records, Cloud-Quoten, CNI-IPs pro Node oder Incident-Verständlichkeit liegen.

| Signal | Wofür es hilft | Fehlinterpretation vermeiden |
|---|---|---|
| Präfixauslastung nach Purpose | Kapazitäts- und Reserveplanung | hohe freie Rate heißt nicht automatisch kein Overlap. |
| Allocation-/Release-Rate | Churn und Automatisierungsbedarf | hoher Churn ist nicht per se Fehler. |
| Duplicate/Conflict Events | IPAM-/DHCP-/Statisches Drift-Signal | Ursache kann HA/Migration/Fehlkonfiguration sein. |
| Route-/Rule-/FIB-Fehler | Routing-/Scale-Grenze | ein einzelner Fehler beweist kein Adressraumproblem. |
| NAT-Port-/Connection-Auslastung | Egress-/Translation-Grenze | keine direkte Aussage über freie IPv4-Adressen. |
| Anzahl überlappender Integrationsräume | Architektur- und M&A-Risiko | technisch isolierbar bedeutet nicht betrieblich einfach. |

### Performance- und Belastungstests

Plane kontrollierte Testfälle mit synthetischen Präfixen und isolierter Umgebung:

- Import eines neuen IPAM-Blocks mit Overlap-Detection;
- Autoscaling-Simulation gegen Zuweisungsrate und Reserven;
- Renumbering eines Testservice mit DNS-/Policy-/Log-Korrelation;
- `/31`-Punkt-zu-Punkt-Support nur auf dafür zugelassenen Komponenten;
- Leak-Tests für private/Sonderpräfixe an expliziten Egress-Grenzen.

Kein Test rechtfertigt die Freigabe eines nicht abgestimmten Prefixes in produktive Route Tables.

## Reliability und Failure Modes

| Symptom | Typische Ursacheklasse | Evidenzkette | Nicht sofort tun |
|---|---|---|---|
| Ziel ist nur aus einem Standort erreichbar | Overlap, asymmetrische Route, Policy oder DNS split horizon | Ziel-IP, Präfix, VRF, Route, Übersetzung, Firewall, Zeitfenster vergleichen | private Adresse pauschal umnummerieren. |
| Zwei Systeme „teilen“ eine IPv4-Adresse | Zuweisungskonflikt, HA-Design oder Leak | IPAM, Lease, ARP, Change, Cluster-/VIP-Intent korrelieren | Cache löschen und Ursache verdecken. |
| Broadcast-bezogene Last/Incident | große L2-Domäne, Fehlkonfiguration, Amplification-Risiko | Präfix/L2-Grenze, Events, Routerpolicy, Senderverteilung | directed broadcast aktivieren. |
| Verbindung nach Firmenfusion scheitert | überlappende RFC-1918-Räume | beide IPAM-Quellen, VPN/Transit, DNS/ACL/NAT-Map prüfen | eine Seite ohne Migrationsplan umnummerieren. |
| Externes System sieht private Quelladresse | Egress-/NAT-/Route-Leak | Paket-/Logkontext, NAT und Filterregel, Zeitpunkt prüfen | nur DNS ändern. |
| Point-to-point-Link nutzt „fehlende“ Netz-/Broadcastadresse | `/31`-Sonderfall oder Fehlkonfiguration | Linktyp, RFC-3021-Support, Konfig/Owner prüfen | mit /24-Heuristik urteilen. |
| Public-Adresse ist nicht erreichbar | Policy, Bind, route, NAT, LB, service oder Provider | End-to-End-Übergänge prüfen | Adresse als alleinige Ursache annehmen. |

### Diagnosefolge

```text
1. Welche Adresse, welches Präfix, welche Familie, welcher Kontext?
2. Ist die Adresse gemäß aktueller Registry und IPAM für diesen Zweck zulässig?
3. Welche Route, VRF/Namespace, Interface und welcher Next Hop werden wirklich gewählt?
4. Besteht ein Overlap im Integrationsraum oder eine Translation?
5. Ist der Fehler vor (DNS), innerhalb (route/neighbor/policy) oder nach (transport/TLS/app) IPv4?
6. Welche Änderung, Lease, M&A-Anbindung, Migration oder Deployment korreliert zeitlich?
7. Welche minimal-invasive Beobachtung kann die Hypothese widerlegen?
```

## Security, Governance und Compliance

### Security

IPv4-Adressierung ist kein Autorisierungsmodell. Source-IP-Allowlisting kann in klar begrenzten, zusätzlichen Kontrollen sinnvoll sein, ist aber anfällig für NAT, Proxy, Spoofing, Mobility, Fehlkonfiguration und kompromittierte interne Systeme. RFC 2827 beschreibt Ingress Filtering gegen Spoofing; in der Praxis muss jede Grenze definieren, welche Präfixe plausibel hinein- und hinausdürfen.

Mindestkontrollen:

- Egress-/Ingress-Filter gegen unplausible private, Spezial- und fremde Präfixe an geeigneten Grenzen;
- eindeutige IPAM-Ownership und Drift-/Overlap-Detection;
- Network Segmentation und explizite erlaubte Flüsse;
- mTLS, Workload Identity und Applikationsautorisierung für schützenswerte Dienste;
- sichere, datensparsame Logkorrelation über NAT-/Proxy-Grenzen;
- Change-Review für Route-, Prefix-, NAT-, DNS- und Firewalländerungen;
- Incident-Prozess für Spoofing, Leak, Conflict und unberechtigte Route Advertisements.

### Governance

| Governancefrage | Architekturantwort |
|---|---|
| Wer darf einen Präfix reservieren? | definierte IPAM-RBAC-Rolle mit Zweck, Owner, Ablauf und Review. |
| Wann ist ein Overlap akzeptabel? | nur in dokumentiert getrennten Routingdomänen; Integrationspfad und Exitstrategie müssen existieren. |
| Wie werden private Präfixe vor Leak geschützt? | Egress-/Ingress-Routing- und Paketfilter, Monitoring, Tests und Incident Ownership. |
| Wie bleibt eine Migration auditierbar? | Change-ID, alte/neue Präfixe, DNS/Policy-Mapping, Zeitfenster, Testevidenz, Rollback und Rückbau. |
| Was gilt als Assetidentität? | IP ist ein Kontextattribut; robuste Zuordnung verwendet Workload-/Geräteidentität, Eigentümer und Zeitfenster. |

IP- und NAT-Logs können Personenbezug oder sensitive Betriebsinformationen enthalten. Lege Zweckbindung, Zugriff, Retention, Redaction und gesicherte Incident-Ausnahmen fest. Ein vollständiger Subnet-Scan oder dauerhafte Rohtelemetrie ist keine Standardlösung für Asset Management.

## Observability und Troubleshooting

### Korrelationsmodell

```text
request / incident id
+ timestamp
+ service name and chosen IPv4 destination
+ source context: workload identity, namespace/VRF, interface
+ selected route / next-hop class
+ IPAM prefix and owner
+ NAT/proxy correlation id when applicable
+ security decision
+ transport/TLS/application outcome
+ change or deployment id
```

Nur die Kombination ermöglicht Aussagen wie: „Der Service verwendete nach einer DNS-Änderung eine Adresse im überlappenden Partnerpräfix, die Route wählte Kontext B, der Egressfilter blockierte die private Source; der Fehler begann mit Change X.“ Eine einzelne IP-Adresse genügt nicht.

### Sichere Diagnosefragen

- Stimmt der erwartete Präfix mit IPAM und tatsächlichem Routingkontext überein?
- Ist das Ziel on-link oder über einen Router erreichbar? Siehe [KB-0051](03-arp-und-neighbor-discovery.md).
- Gibt es die Zahl in mehreren VRFs, VPCs, Sites oder Partnernetzen?
- Gehört die Adresse zu einem Sonderbereich, dessen Nutzung im konkreten Kontext unzulässig ist?
- Wurde der Pfad durch NAT, Proxy, Load Balancer, Service Mesh oder Cloud Fabric verändert?
- Gibt es eine korrelierte Lease-, Route-, Firewall-, DNS- oder M&A-Änderung?
- Was beweist der gemessene Test genau, und welche späteren Schichten bleiben offen?

## Cost und FinOps

Private IPv4-Räume wirken kostenlos, aber Overlap erzeugt spätere Kosten: Migrationsprogramme, NAT-/Proxy-Schichten, Sonderrouting, Support, Audit, Fehlersuche und verzögerte Integrationen. Öffentliche IPv4-Knappheit kann zu adressbezogenen Providerkosten und zu komplexen Translationen führen. IPv6-Einführung verursacht ebenfalls Investitionen in Dual-Stack-Tooling, Security, Schulung und Prozessreife.

Ein belastbares Finanzmodell betrachtet:

- erwartete Lebensdauer eines Präfixes und M&A-/Partnerwahrscheinlichkeit;
- Kosten für Renumbering vor und nach Produktivsetzung;
- Cloud- und Providerquoten, öffentliche-IP-, NAT-/Egress- und Transitkosten;
- Supportzeit durch Overlap-/Translationkomplexität;
- Kosten einer falsch dimensionierten L2-/L3- oder IPAM-Automatisierung;
- Risiko- und Compliancekosten von Prefix-/DNS-/Route-Leaks.

Zahlen, Preislisten, Cloud-Limits und Providerbedingungen sind zeitabhängig und vor jeder Entscheidung am konkreten Vertrag zu prüfen.

## Trade-offs und Anti-Patterns

| Entscheidung | Vorteil | Nachteil/Risiko | Leitplanke |
|---|---|---|---|
| RFC-1918 mit sauberem IPAM | flexible interne Planung | M&A-/Partner-Overlap möglich | globalen Integrationsraum und Renumberingpfad vorab planen. |
| Shared Address Space nutzen | kann Provider-/Sonderfälle adressieren | Kollision mit Plattform-/Providerannahmen | nur gemäß verbindlichem Zielkontext und geprüfter Policy. |
| Frühe Renumbering-Entscheidung | reduziert Dauerkomplexität | kurzfristige Migrationskosten | konkreten Nutzen, Zeitfenster, Rollback und Abhängigkeiten belegen. |
| NAT/Proxy vor Overlap | schnelle begrenzte Integration | Log-/Identity-/Troubleshootingkomplexität | Scope begrenzen, Mapping und Exit dokumentieren. |
| Große Präfixreserve | Wachstumspuffer | verdeckte Knappheit, Fragmentierung | Reserve mit Owner, Ablauf und Review. |
| Public IP am Workload | einfache Außenadressierung | größerer Attack Surface und Kosten | nur mit Edge-/Identity-/Policy- und Monitoringdesign. |

**Anti-Pattern: „10/8 gehört uns.“** RFC 1918 erlaubt vielfache private Nutzung; es schafft keine globale Eindeutigkeit oder Eigentumsrechte außerhalb des koordinierten Bereichs.

**Anti-Pattern: Adressen in Code festschreiben.** Das macht Renumbering, Failover und Cloud-Migration teuer. Nutze konfigurierbare Discovery und dokumentiere Ausnahmen.

**Anti-Pattern: Private Adresse als Sicherheitslabel.** Private Space kann ein Exposure reduzieren, autorisiert aber keine Verbindung und schützt nicht gegen kompromittierte interne Identitäten.

**Anti-Pattern: Broadcast als Discovery-Lösung skalieren.** Broadcast ist auf Linkgrenzen beschränkt und kann eine große Fehler- und Amplification-Fläche schaffen.

## Staff-, Principal- und Chief-Level Decisions

### Staff / Principal

1. **Adressierungs-ADR:** Entscheide Präfixhierarchie, Owners, Integrationsraum, IPAM-Quelle, DHCP-/statische Strategie, Prefix-Reserve und Renumberingprinzip.
2. **Overlap Gate:** Jede neue VPC/VNet, Site, Akquisition, Partnerverbindung und CNI-Range wird automatisiert gegen den bekannten Integrationskatalog geprüft.
3. **Connectivity Review:** Prüfe Name, Zieladresse, Route, Next Hop, NAT/Proxy, Policy und Identity als Kette. „IP erreichbar“ ist nur ein Zwischensignal.
4. **Migration Engineering:** Baue DNS-/Config-Abstraktion, Dual-Run, ACL-/Certificate-Updates, Observability und Rückbau vor der Umnummerierung.
5. **Evidence:** Berichte Auslastung, Overlaps, Leaks, statische Ausnahmen, Migrationsrisiko und Mean Time to Explain statt bloßer Zahl freier Adressen.

### Chief

1. **IPv4-zu-IPv6-Strategie:** Definiere Zielbilder je Produkt, Standort, Cloud und Edge; finanziere Tooling, Security, Training und Support über mehrere Jahre.
2. **Enterprise Address Authority:** Etabliere IPAM-Governance über Unternehmensgrenzen, aber ohne lokale Teams in manuelle Ticketwarteschlangen zu zwingen.
3. **M&A-/Partner-Readiness:** Behandle IP-Overlap als Due-Diligence- und Integrationsrisiko mit klaren Entscheidungsoptionen, Kostenband und Timeline.
4. **Architecture Debt:** Messe abweichende oder nicht zuordenbare Präfixe, nicht dokumentierte NATs, fehlende Owner und IP-Literale als technische Schuld.
5. **Security Alignment:** Verknüpfe Routing-/Prefix-Policy mit Zero-Trust-/Workload-Identity-Programm; Adresse ist Kontext, nicht primäre Berechtigung.

## Production Checklist

- [ ] Jede IPv4-Zuweisung hat Präfix, Zweck, Environment, Zone, Routingdomäne, Owner und IPAM-Quelle.
- [ ] Private, Shared, Link-Local, Loopback, Dokumentations- und andere Sonderbereiche werden nach aktueller IANA Registry geprüft.
- [ ] Alle Integrationsräume sind im Overlap-Katalog enthalten: Cloud, On-Prem, Partner, M&A, VPN/Transit, CNI und Management.
- [ ] Route, VRF/Namespace, Next Hop und erwarteter Rückweg sind pro Zielklasse dokumentiert.
- [ ] Öffentliche und private Präfixe besitzen begründete Egress-/Ingress-/Anti-Spoofing-Policy.
- [ ] Directed Broadcast ist nicht als allgemeine Betriebsfunktion eingeplant; Ausnahmen sind formal geprüft.
- [ ] `/31` wird nur für passende Punkt-zu-Punkt-Links mit nachgewiesener Unterstützung verwendet.
- [ ] IPAM, DNS, DHCP/Allocation, Firewall, Route und Observability referenzieren eine gemeinsame Change-/Owner-Kette.
- [ ] Statische Zuweisungen haben Lifecycle, HA-/Ersatzplan und regelmäßigen Drift-Review.
- [ ] NAT/Proxy-Übersetzungen besitzen korrelierbare Logs, Security-/Identity-Grenzen und Exitstrategie.
- [ ] Renumbering ist für kritische Systeme als getesteter, reversibler Prozess dokumentiert.
- [ ] Telemetrie minimiert personen- und betriebsbezogene Daten, regelt Zugriff und Retention.
- [ ] Last-/Churn-/Quota-Annahmen und Providerlimits sind vor Kapazitätsfreigabe validiert.

## Praktisches Lab: Offline-Präfix- und Overlap-Modell

**Status:** `reviewed_only`. Dieses Lernlab ist als lokale Python-Fallarbeit entworfen und in dieser Wissensbasis nicht ausgeführt. Es verwendet ausschließlich Dokumentationsadressen und die Standardbibliothek `ipaddress`.

### Lernziele

- Präfixe klassenunabhängig darstellen;
- Überlappung von Netzen erkennen;
- private, Link-Local- und Dokumentationsbereiche unterscheiden;
- gerichteten Broadcast kontextgebunden ableiten;
- `/31` als Punkt-zu-Punkt-Ausnahme sehen.

```python
import ipaddress

prefixes = {
    "prod_app": ipaddress.ip_network("10.40.16.0/20"),
    "partner_overlap": ipaddress.ip_network("10.40.0.0/16"),
    "documentation": ipaddress.ip_network("198.51.100.0/24"),
    "link_local": ipaddress.ip_network("169.254.0.0/16"),
    "p2p": ipaddress.ip_network("192.0.2.0/31"),
}

def kind(address: str) -> str:
    ip = ipaddress.ip_address(address)
    if ip in ipaddress.ip_network("10.0.0.0/8") or \
       ip in ipaddress.ip_network("172.16.0.0/12") or \
       ip in ipaddress.ip_network("192.168.0.0/16"):
        return "RFC1918_PRIVATE"
    if ip in ipaddress.ip_network("169.254.0.0/16"):
        return "IPV4_LINK_LOCAL"
    if ip in ipaddress.ip_network("192.0.2.0/24") or \
       ip in ipaddress.ip_network("198.51.100.0/24") or \
       ip in ipaddress.ip_network("203.0.113.0/24"):
        return "DOCUMENTATION"
    return "REQUIRES_IANA_AND_IPAM_CONTEXT"

print(prefixes["prod_app"].overlaps(prefixes["partner_overlap"]))  # True
print(kind("10.40.16.7"))                                         # RFC1918_PRIVATE
print(kind("198.51.100.9"))                                      # DOCUMENTATION
print(prefixes["prod_app"].broadcast_address)                    # /20 broadcast value
print(list(prefixes["p2p"].hosts()))                             # both P2P endpoints
```

### Interpretation und Gegenproben

1. **Overlap:** `10.40.16.0/20` liegt innerhalb von `10.40.0.0/16`; zwei getrennte Unternehmen können beide Abschnitte verwenden, aber eine direkte Integration wird mehrdeutig.
2. **Scope:** RFC-1918 sagt nichts darüber, ob der Host on-link ist. Für diese Frage bräuchte man zusätzlich Route, Interface und Kontext.
3. **Dokumentation:** Die TEST-NET-Adresse ist für Beispiele geeignet, kein Kandidat für reale Zuweisung.
4. **Broadcast:** Der berechnete Wert ist nur eine Präfixeigenschaft; er rechtfertigt nicht, dass Router einen directed broadcast weiterleiten.
5. **`/31`:** Beide Adressen werden im Modell als Hostadressen gezeigt. Daraus folgt nicht, dass jeder Linktyp oder jede Plattform diesen Einsatz unterstützt.

### Cleanup

Lösche nur die temporäre lokale Python-Datei. Das Lab erstellt keine Adressen, Routen, Interfaces, Pakete, DNS-Records oder Cloudressourcen und hinterlässt keinen Systemzustand.

## Interviewfragen mit Antworten

### 1. Warum ist „private Adresse“ nicht gleich „nicht routbar“?

RFC-1918-Adressen sind innerhalb eines koordinierten privaten Netzes verwendbar und können dort sehr wohl geroutet werden. Sie sollen nicht als globale, inter-enterprise Routinginformation propagiert werden. Ob ein konkretes Ziel erreichbar ist, bestimmen Route, VRF/Namespace, Next Hop, Policy und weitere Schichten.

### 2. Was ist das zentrale Risiko überlappender RFC-1918-Netze?

Die gleiche IP-Zahl wird mehrdeutig, sobald getrennte Netze integriert oder in Logs, DNS, ACLs, Monitoring und Incident-Prozessen zusammengeführt werden. Man braucht dann Renumbering, Translation, isolierte Routingdomänen oder eine vermittelnde Servicegrenze – jeweils mit Kosten und Betriebsfolgen.

### 3. Warum darf man `172.20.1.1` nicht allein anhand von `172` als privat klassifizieren?

Nur `172.16.0.0/12`, also `172.16.0.0` bis `172.31.255.255`, ist der RFC-1918-Bereich. Andere `172.x`-Bereiche müssen über die aktuelle IANA Registry, IPAM und den konkreten Kontext eingeordnet werden.

### 4. Wann ist die letzte Adresse eines Präfixes ein Broadcast?

Bei traditionellen IPv4-Multi-Access-Subnetzen entspricht die Adresse mit allen Hostbits Eins dem directed broadcast. Das ist keine universelle Regel: `/31`-Punkt-zu-Punkt-Präfixe nach RFC 3021 und `/32`-Hostrouten sind wichtige Gegenbeispiele. Router leiten directed broadcasts standardmäßig nicht weiter.

### 5. Löst NAT ein Overlap-Problem dauerhaft?

NAT kann einen begrenzten Datenpfad überlappen lassen, verschiebt aber Komplexität in State, Logging, Identität, Protokollverhalten, Security, Observability und Support. Für dauerhaft integrierte Plattformen ist Renumbering oder explizite Routingdomänentrennung oft langfristig klarer.

### 6. Welche Informationen müssen bei einem Incident zusätzlich zur IP-Adresse vorliegen?

Mindestens Zeit, Adresse plus Präfix, Address Family, Environment/Zone, Routingdomäne/VRF/Namespace, Interface, gewählte Route und Next Hop, IPAM-Owner, NAT-/Proxykontext, Securityentscheidung, betroffene Serviceoperation und korrelierte Changes.

### 7. Warum ist IPv4-Adressierung ein Chief-Level-Thema?

Sie beeinflusst Cloud- und M&A-Integration, Security, Kosten, Providerabhängigkeit, Incidentfähigkeit, IPv6-Übergang und die Geschwindigkeit zukünftiger Produktentwicklungen. Späte Entscheidungen erzeugen teure Umnummerierungs- und Translationlandschaften.

## Dependencies und Cross-References

| Beziehung | Datei | Verwendung |
|---|---|---|
| Voraussetzung | [KB-0049](01-osi-und-tcp-ip-als-analysemodelle.md) | IP-Schicht, Adresse, Route und Next-Hop-Modell. |
| Voraussetzung | [KB-0051](03-arp-und-neighbor-discovery.md) | lokale Auflösung des ausgewählten Next Hops. |
| Vertiefung | [KB-0053](05-ipv6-adressierung-und-uebergang.md) | IPv6-Adressarten, SLAAC und Übergänge. |
| Vertiefung | [KB-0054](06-subnetting-und-cidr.md) | Binärlogik, Präfixberechnung, Aggregation und Adressraumbedarf. |
| Vertiefung | [KB-0055](07-routing-und-forwarding.md) | Route Selection, Weiterleitung und Fehlersuche im Routingpfad. |
| Anwendung | [KB-0080](../04-software-architecture/10-konfigurations-und-feature-management.md) | IP-Literale vermeiden und konfigurierbare Ziel-/Migrationspfade schaffen. |
| Anwendung | [KB-0562](../23-security-identity/26-security-incident-response.md) | Spoofing, Leaks, Beweissicherung und Eindämmung. |
| Evidenz | [KB-0720](../30-architect-practice/44-portfolioevidenz-und-reifemodelle.md) | Adressierungs-ADR, Kapazitätsdaten und reale Migrationsbelege. |

## Quellen und zeitliche Einordnung

| Quelle | Wofür sie verwendet wird | Stand |
|---|---|---|
| Dateikatalog KB-0052 | verbindlicher Scope und Reihenfolge. | Planstand 2026-09-14 |
| [RFC 1918](https://www.rfc-editor.org/rfc/rfc1918) | private Bereiche, Eindeutigkeit, Leak- und Renumberingfolgen. | abgerufen 2026-09-16 |
| [IANA IPv4 Special-Purpose Registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml) | aktueller Status besonderer IPv4-Bereiche. | abgerufen 2026-09-16 |
| [RFC 3927](https://www.rfc-editor.org/rfc/rfc3927) | IPv4 Link-Local und Konflikterkennungskontext. | abgerufen 2026-09-16 |
| [RFC 2644](https://www.rfc-editor.org/rfc/rfc2644) | directed broadcast und Router-Default. | abgerufen 2026-09-16 |
| [RFC 3021](https://www.rfc-editor.org/rfc/rfc3021) | 31-Bit-Präfixe für Punkt-zu-Punkt-Links. | abgerufen 2026-09-16 |
| [RFC 2827](https://www.rfc-editor.org/rfc/rfc2827) | Ingress Filtering gegen Quelladress-Spoofing. | abgerufen 2026-09-16 |
| [KB-0049](01-osi-und-tcp-ip-als-analysemodelle.md) und [KB-0051](03-arp-und-neighbor-discovery.md) | kanonische Protokoll- und Next-Hop-Voraussetzungen. | 2026-09-16 |

IANA-Zuweisungen, Betriebssystem-/Router-/Cloud-Implementierungen, CNI-/VPC-/VNet-Reservierungen, IPAM-Produktfunktionen, Providerpreise, Quoten und Compliancevorgaben sind zeitabhängig. Vor Einführung oder Änderung gelten die aktuelle Registry, Plattformdokumentation, vertragliche Begrenzungen, freigegebene Architektur, Datenklassifikation und der Change-/Rollbackprozess.

## Bonus: New Tech and Innovations

**Stand 2026-09-16 — IPAM-as-Code und Policy-as-Code können Prefix-Reservierung, Overlap-Prüfung, DNS-/Route-/Firewall-Intent und Change-Evidenz enger verbinden.** **Reifegrad: adaptiert bis etabliert je Plattform.** Der Gewinn entsteht nur, wenn die IPAM-Quelle autoritativ, versioniert, zugriffsgesteuert und mit tatsächlichem Runtime-Drift abgeglichen wird.

**Stand 2026-09-16 — Cloud-Networking- und CNI-Plattformen automatisieren viele IPv4-Zuweisungen, führen aber zusätzlich Provider-/Overlay-/Node- und Service-Prefixe ein.** **Reifegrad: etabliert.** Ein Architekturreview braucht deshalb eine durchgängige Karte der Adressräume statt der Annahme, dass nur VMs Adressen verbrauchen.

**Stand 2026-09-16 — Der nachhaltige Innovationspfad ist ein adressfamilienübergreifendes Connectivity-Modell mit IPv6-Fähigkeit, starker Workload Identity und weniger IP-Literalen.** **Reifegrad: adaptiert bis etabliert je Organisation.** A pilot accepts an IPv4 plan only when overlap detection, migration evidence, security boundaries and an IPv6 transition path are all explicit.

