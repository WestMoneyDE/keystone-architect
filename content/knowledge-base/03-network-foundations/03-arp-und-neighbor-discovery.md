---
{"id": "KB-0051", "title": "ARP und Neighbor Discovery", "domain": "03", "sequence": 3, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0039", "concepts": ["Linux-Netzwerkstack", "Paketpfad", "Routingkontext"], "needed_for": "understanding"}, {"id": "KB-0046", "concepts": ["Hypothesen", "Zeitachsen", "Performance-Debugging"], "needed_for": "both"}, {"id": "KB-0049", "concepts": ["OSI/TCP-IP", "Kapselung", "Next Hop"], "needed_for": "both"}, {"id": "KB-0050", "concepts": ["Ethernet-Frame", "MAC-Weiterleitung", "Broadcast-Domäne"], "needed_for": "both"}], "related": ["KB-0052", "KB-0053", "KB-0054", "KB-0055", "KB-0117", "KB-0562", "KB-0720"], "applies": ["KB-0117", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein rein lokales Python-Modell simuliert ARP- und ND-Cachezustände, einen doppelten Adresskonflikt und den Unterschied zwischen DNS- und Nachbarfehlern.", "rationale": "Die Fallarbeit erzeugt keinen Frame, fragt keinen Host ab und verändert weder Interface, Nachbarcache, Route, DNS, Firewall noch Cloud- oder Produktionsressourcen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein Connectivity-Vertrag ordnet Präfix, Gateway, Adressvergabe, Router Advertisement, Neighbor-Cache-Verhalten, Sicherheitskontrollen, Ownership, Telemetrie und Rollback zu.", "rationale": "Der Entwurf trennt lokale Nachbarerreichbarkeit von Namensauflösung, Routing, Transport, Identität und Anwendungssemantik."}, "STAFF-TARGET": {"active": true, "scope": "Teams verwenden eine gemeinsame Diagnoseabfolge: Ziel präzisieren, Route und Next Hop bestimmen, Cachezustand und Ereignisse korrelieren, zugelassene Messung durchführen, Hypothese widerlegen und erst dann eine freigegebene Änderung ausführen.", "rationale": "Dadurch sinkt das Risiko, DNS, Remote-Routing, Firewall oder Applikationsfehler fälschlich mit ARP/ND zu erklären."}, "CHIEF-TARGET": {"active": true, "scope": "IPv4-/IPv6-Adressierung, L2/L3-Grenzen, IPAM, Segmentierung, Router-Advertisement-Policy, Endpoint-Identität, Telemetrie, Incident-Prozess und Lieferantenabhängigkeiten werden als Portfolio entschieden.", "rationale": "MAC- und IP-Zuordnungen sind lokale technische Hinweise; sie ersetzen weder Workload-Identität, Autorisierung noch eine datenschutzgerechte Asset- und Betriebsstrategie."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Hardware-FDB/TCAM-Dimensionierung, EVPN ARP/ND Suppression, Wi-Fi-Roaming, SEND-PKI, DPU-Offload, Captures, ASIC-Telemetrie und RFC-konforme Host-/Routerimplementierung sind Spezialistentiefe.", "rationale": "Die Zielrollen müssen Voraussetzungen, Risiken, Evidenz und Eskalationsgrenzen bewerten; die feingranulare Implementierung kann bei Netzwerk- und Plattformfachleuten liegen."}}, "lab_validation": [{"lab_id": "KB-0051-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox ohne Socket- oder Interfacezugriff", "evidence": "Deterministische Cachezustände, Adresskonflikt und DNS-/Neighbor-Fehlerklassifikation samt Gegenproben und Cleanup fachlich geprüft.", "limitations": "Nicht ausgeführt; kein Ethernet-Frame, kein ARP/ND-Paket, keine ICMPv6-Nachricht, kein Neighbor-Cache, kein Interface, keine Route, keine Namensauflösung, keine Firewall, keine Cloud- oder Produktionsressource wurde gelesen oder verändert."}]}
---
# ARP und Neighbor Discovery

> **Ziel:** ARP und IPv6 Neighbor Discovery beantworten eine lokale Frage: *Über welche Link-Layer-Adresse erreiche ich den bereits bestimmten nächsten IP-Hop auf diesem Link?* Sie beantworten weder „wie heißt der Service?“, noch „ist die Remote-IP geroutet?“, noch „darf der Request ausgeführt werden?“. Diese Trennung macht Diagnose, Architektur und Security belastbar.

## Purpose, Definition und Scope

IPv4 Address Resolution Protocol (ARP) ordnet auf einem lokalen Link eine IPv4-Adresse einer Link-Layer-Adresse zu. Für ein Ethernet-Segment ist das in der Regel die MAC-Adresse, über die der Frame an den **nächsten Hop** adressiert wird. ARP ist kein Internet-Routingprotokoll und keine globale IP-zu-MAC-Datenbank.

IPv6 verwendet nicht ARP. Neighbor Discovery (ND) ist ein Satz von ICMPv6-Nachrichten und Regeln: Router- und Präfixinformationen, Parameter, Next-Hop-Bestimmung, Address Resolution, Neighbor Unreachability Detection (NUD) und Redirects. Duplicate Address Detection (DAD) ist in der IPv6 Stateless Address Autoconfiguration spezifiziert und prüft, ob eine vorgesehene Adresse bereits auf dem Link verwendet wird.

Dieses Kapitel behandelt:

- IPv4-ARP, IPv6-ND und DAD als lokale Kontrollpfade;
- Neighbor-Caches, Zustände, Alterung und beobachtbare Fehler;
- Unterschied zwischen On-Link-Ziel und Default-Gateway/Router als Next Hop;
- Abgrenzung gegenüber DNS, IP-Routing, Transport, TLS, Netzwerkpolicy und Anwendung;
- skalierbare L2/L3-Grenzen, Sicherheitskontrollen, Governance und Incident-Diagnose.

Nicht im Scope sind vollständige IPv4-/IPv6-Adressplanung, Routingprotokolle, DHCP, DNS, Ethernet-Switch-Konfiguration, Cloud-VPC-Implementierungen, Packet-Capture-Runbooks oder das sichere Ändern eines produktiven Neighbor-Caches. Diese Themen erhalten kanonische Folgekapitel.

Nach dem Studium kannst du:

1. den IPv4-ARP- und IPv6-ND-Pfad für ein lokales Ziel und für ein geroutetes Ziel präzise unterscheiden;
2. erklären, warum bei einer Remote-IP die MAC-Adresse des Gateways und nicht die des Endziels aufgelöst wird;
3. ARP-Cache, Linux-Neighbor-Cache und NUD-Zustände als Evidenz einordnen, ohne sie zu überschätzen;
4. einen IPv6-DAD-Konflikt, einen fehlenden Router Advertisement und einen DNS-Fehler voneinander trennen;
5. L2/L3-, IPAM-, Security- und Betriebsentscheidungen mit Ownership, Messung und Rollback entwerfen.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | RFCs und Linux-Dokumentation erklären Protokollrollen, Cachezustände und Sicherheitsgrenzen. |
| HANDS-ON-TARGET | Das Lab modelliert nur Datenstrukturen und Zustandsübergänge lokal. Es ist kein Test gegen ein Netzwerk. |
| ARCHITECT-TARGET | Ein Entwurf definiert den lokalen Link, Präfixe, Gateways, Adressquelle, Sicherheitskontrollen, Monitoring und Verantwortliche. |
| STAFF/PRINCIPAL | Die Diagnose verbindet Zeitachse, Route, Next Hop, Cachezustand, zulässige Messung und eine widerlegbare Hypothese. |
| CHIEF | Adressierung, IPAM, L2/L3-Grenzen, Identitätsmodell, Netzwerksecurity und Betriebsmodell werden über Domänen hinweg gesteuert. |

## Mental Model: Karte, Wegpunkt und lokale Zustellung

Stelle dir drei getrennte Dinge vor:

1. **Namenskarte:** Ein Name kann in eine oder mehrere IP-Adressen aufgelöst werden. Das ist DNS- oder Service-Discovery-Arbeit.
2. **Routenkarte:** Der Host entscheidet anhand von Zieladresse und Routingtabelle, ob das Ziel direkt on-link ist oder welcher Router der nächste Hop ist.
3. **Lokale Zustellkarte:** ARP oder ND liefert die Link-Layer-Zuordnung für genau diesen On-Link-Nachbarn: entweder das lokale Ziel oder den Router.

```text
service name
  -> DNS/service discovery -> chosen IP destination
  -> route lookup          -> on-link target OR gateway/next-hop IP
  -> ARP (IPv4) / ND (IPv6)-> next-hop IPv4/IPv6 to link-layer address
  -> Ethernet/Wi-Fi frame  -> local link
  -> router repeats route lookup on its own forwarding context
```

Ein **Neighbor-Cache-Hit** beweist nur, dass der Host aktuell eine lokale Zuordnung besitzt oder glaubt zu besitzen. Er beweist nicht, dass:

- die IP-Adresse zum erwarteten Workload gehört;
- die Adresse hinter einem anderen Router erreichbar ist;
- eine Security Group, Firewall, Network Policy oder ACL zulässt;
- TCP/QUIC/TLS/HTTP funktionsfähig ist;
- ein Service autorisiert oder gesund ist.

Die nützliche Diagnosefrage lautet daher nicht „ist ARP okay?“, sondern: **Welcher nächste Hop wurde gewählt, welche lokale Zuordnung braucht er, in welchem Zustand ist sie, und welcher beobachtete Übergang widerlegt welche Alternative?**

## Prerequisites und Dependencies

| ID | Art | Warum sie nötig ist |
|---|---|---|
| [KB-0039](../02-linux-systems/09-linux-netzwerkstack-und-paketpfade.md) | Verständnis | Lokaler Paketpfad, Routingkontext und Policy-Hooks ordnen Nachbarauflösung in den Host ein. |
| [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Anwendung und Lab | Hypothesen, Zeitachse, Gegenprobe und Messbudget verhindern Aktionismus. |
| [KB-0049](01-osi-und-tcp-ip-als-analysemodelle.md) | Anwendung und Lab | Kapselung und die Trennung von Link- und Network-Layer erklären, warum die Link-Adresse pro Hop gilt. |
| [KB-0050](02-ethernet-und-mac-weiterleitung.md) | Anwendung und Lab | Ethernet-Frames, FDB-Lernen, Broadcast-Domäne und MTU sind das L2-Substrat für ARP/ND. |

Weiterführend vertiefen [KB-0052](04-ipv4-adressierung.md) IPv4-Präfixe, [KB-0053](05-ipv6-adressierung-und-uebergang.md) IPv6-Adressierung und Übergang sowie [KB-0054](06-subnetting-und-cidr.md) Netzgrenzen. Dieses Kapitel kopiert deren Inhalte nicht.

## Core Concepts und Protokollrollen

### Der entscheidende Unterschied: Ziel-IP ist nicht immer Next-Hop-IP

| Situation | Routingentscheidung | Aufzulösende Adresse | Häufiger Denkfehler |
|---|---|---|---|
| IPv4-Ziel liegt im eigenen Präfix und Interface | direkt verbunden | IPv4-Adresse des Zielhosts | „ARP fragt immer das Default Gateway.“ |
| IPv4-Ziel liegt außerhalb des lokalen Präfixes | Route über Router | IPv4-Adresse des Gateways/Next Hops | „Mein Host braucht die MAC des entfernten API-Servers.“ |
| IPv6-Ziel liegt on-link | direkt verbunden | IPv6-Adresse des Zielhosts über ND | „IPv6 nutzt ARP mit größeren Adressen.“ |
| IPv6-Ziel ist remote | Route über Router | IPv6-Adresse des Routers über ND | „Die Neighbor-Table enthält die gesamte Internetroute.“ |
| Proxy/Load Balancer ist bewusst Endpoint | Route zum Proxy/LB | seine Next-Hop-Beziehung | „Ein erfolgreicher Neighbor-Eintrag beweist das Endziel.“ |

Der Router erhält den Frame, entfernt dessen Link-Header und entscheidet danach in seinem eigenen Routingkontext weiter. Der nächste Link hat andere MAC-Adressen und möglicherweise eine andere MTU, VLAN-/Overlay- und Security-Grenze.

### IPv4 ARP

ARP nach RFC 826 transportiert mindestens Hardwaretyp, Protokolltyp, Längen, Operation sowie Sender-/Ziel-Hardware- und Protokolladressen. Ein IPv4-ARP-Request enthält die zu suchende Target Protocol Address und wird auf dem lokalen Link typischerweise als Ethernet-Broadcast versendet. Der Besitzer der Ziel-IP kann antworten; der Reply wird üblicherweise direkt zugestellt. Aus den Senderfeldern lernen Hosts Zuordnungen.

```text
Host A: needs IPv4 next hop 192.0.2.1
A -> LAN broadcast:
  "Who has 192.0.2.1? Tell 192.0.2.10"
  sender MAC = MAC-A, sender IPv4 = 192.0.2.10

Gateway G -> A:
  "192.0.2.1 is at MAC-G"
  sender MAC = MAC-G, sender IPv4 = 192.0.2.1

A cache: 192.0.2.1 -> MAC-G
A sends the IP packet for a remote destination in an Ethernet frame to MAC-G.
```

ARP löst keine Verbindung zum Remote-Ziel auf. Es ist ebenso kein Eigentumsnachweis: Ein Frame mit behaupteter Sender-IP/MAC kann in einem ungeschützten lokalen Segment manipuliert sein. Address Conflict Detection nach RFC 5227 ergänzt standardisierte ARP-Probes und Announcements, um IPv4-Adresskonflikte beim Konfigurieren und später passiv zu erkennen. Ein ARP-Probe nutzt eine Sender-IP `0.0.0.0`, damit andere Caches nicht mit einer noch nicht beanspruchten Adresse verunreinigt werden.

### IPv6 Neighbor Discovery

Neighbor Discovery verwendet ICMPv6; es bündelt mehrere Aufgaben, die IPv4-Umgebungen teils über ARP, Router Discovery, ICMP Redirect und Konfiguration lösen. Wesentliche Nachrichtentypen sind:

| Nachricht | ICMPv6-Typ | Zweck | Typische Diagnosefrage |
|---|---:|---|---|
| Router Solicitation (RS) | 133 | Host bittet Router um zeitnahe Ankündigung. | Erhält ein neuer Host eine gültige Router-/Präfixinformation? |
| Router Advertisement (RA) | 134 | Router liefert unter anderem Präfix-, Default-Router- und Parameterinformationen. | Ist der Router legitim und ist die RA-Policy korrekt? |
| Neighbor Solicitation (NS) | 135 | Auflösung einer IPv6-Nachbaradresse, NUD oder DAD. | Kann der passende Nachbar seine Adresse vertreten? |
| Neighbor Advertisement (NA) | 136 | Antwort bzw. Ankündigung einer Nachbaradresse. | Wurde ein widersprüchlicher oder passender Nachbar beobachtet? |
| Redirect | 137 | Router weist auf einen besseren ersten Hop auf demselben Link hin. | Ist Redirect im konkreten Sicherheits- und Betriebsmodell zugelassen? |

Für die Address Resolution nutzt ND nicht den Ethernet-All-Hosts-Broadcast. Eine Neighbor Solicitation für eine IPv6-Adresse wird typischerweise an deren solicited-node multicast address gesendet: `ff02::1:ffXX:XXXX`, abgeleitet aus den unteren 24 Bits der Zieladresse. Auf Ethernet entspricht dies einem Multicast-Zielpräfix `33:33:ff:XX:XX:XX`. Das verringert die Empfängergruppe gegenüber einem allgemeinen Broadcast, ist aber keine Garantie für geringe Last oder sichere Identität.

### NUD: Cachealterung ist keine Erreichbarkeitsgarantie

NDs Neighbor Unreachability Detection unterscheidet sich von „ein Cacheeintrag hat ein TTL“. Sie versucht, brauchbare Nachbarerreichbarkeit über Hinweise aus höherer Schicht oder explizite Probes zu bewerten. Linux bildet Zustände wie `INCOMPLETE`, `REACHABLE`, `STALE`, `DELAY`, `PROBE`, `FAILED`, `NOARP` und `PERMANENT` ab. Die genaue Transition und Timer sind betriebssystem-, Interface- und Konfigurationsabhängig; dokumentiere nie pauschal einen Timer als universelle Zusage.

| Zustand | Praktische Bedeutung | Was er nicht beweist |
|---|---|---|
| `INCOMPLETE` | Auflösung läuft; Link-Layer-Adresse ist noch nicht nutzbar bekannt. | Dass der Zielservice kaputt ist. |
| `REACHABLE` | Der Stack hat jüngst positive Erreichbarkeitsindizien. | Dass die Anwendung, Authentisierung oder Remote-Route funktioniert. |
| `STALE` | Eintrag ist vorhanden, aber nicht frisch bestätigt. | Dass ein Fehler existiert; Nutzung kann weitere Prüfung auslösen. |
| `DELAY` / `PROBE` | Der Stack prüft einen zuvor nutzbar erscheinenden Nachbarn. | Dass ein Netzwerkteam sofort den Switch ändern muss. |
| `FAILED` | Aktuelle Auflösung/Probe ist fehlgeschlagen. | Dass DNS, TCP, TLS oder der Remote-Service die Ursache ist. |
| `PERMANENT` | Statisch verwaltete Zuordnung. | Dass sie korrekt, skalierbar oder sicher ist. |

### Duplicate Address Detection

Bevor ein IPv6-Host eine tentative Adresse regulär benutzt, führt er DAD aus. Eine DAD-Neighbor Solicitation verwendet die nicht spezifizierte Quelle `::` und zielt auf die solicited-node multicast address der zu prüfenden Adresse. Eine passende Neighbor Solicitation oder Advertisement kann einen Konflikt anzeigen. Der genaue Umgang muss dem Host-/SLAAC-/Adressvergabemodell entsprechen.

DAD ist kein Sicherheitsprotokoll. Ein Angreifer auf dem Link kann Antworten fälschen; umgekehrt können legitime, koordinierte virtuelle IP-Übernahmen und failoverfähige Systeme besondere, dokumentierte Regeln benötigen. Ein DAD-Fehler ist deshalb ein Incident-Signal, kein Anlass, einen Cache blind zu leeren oder Adressschutz zu deaktivieren.

## Architecture und Data Flow

### Datenfluss A: IPv4-API zu Remote-Ziel über ein Gateway

```text
1. Client resolves api.example -> 198.51.100.25
2. Route lookup selects default route via 10.20.0.1 on eth0
3. Host needs only a local mapping for 10.20.0.1
4. Neighbor cache miss:
   ARP request on the eth0 broadcast domain
5. Gateway replies; host records 10.20.0.1 -> MAC-G
6. Host emits:
   Ethernet dst MAC-G / src MAC-client
   IPv4 dst 198.51.100.25 / src client-IP
   TCP/UDP/QUIC payload
7. Gateway routes IP packet, creates a new frame for its next hop
8. Later faults can occur independently at firewall, NAT, route, provider, TLS, service or authorization
```

Die richtige Prüfsequenz ist: **Name → gewählte Ziel-IP → gewählte Route → Next Hop → Nachbarzustand → IP-/Transport-/Policy-/Anwendungsübergang**. Ein `REACHABLE`-Gateway cache rettet keinen falschen DNS-Record, keine überlappenden Präfixe und keine fehlende Remote-Route.

### Datenfluss B: IPv6 on-link und ND

```text
1. Host has a destination IPv6 address and determines it is on-link.
2. Neighbor cache does not contain a usable link-layer mapping.
3. Host sends ICMPv6 Neighbor Solicitation to the solicited-node multicast address.
4. Target host receives the solicitation and returns Neighbor Advertisement as appropriate.
5. Initiator installs/updates neighbor mapping and sends the IPv6 packet in a link frame.
6. NUD later uses traffic evidence and, where required, probes to assess reachability.
```

Wenn das IPv6-Ziel remote ist, wird Schritt 3 gegen den IPv6-Router/Next Hop ausgeführt. Die Remote-IP ist weiterhin der IP-Zielwert im Paket; nur die Link-Destination ist der lokale Router.

### Datenfluss C: IPv6 Start und DAD

```text
interface gets link-local or SLAAC candidate
  -> candidate is tentative
  -> DAD NS with source ::
  -> no conflicting response within applicable procedure
  -> address becomes usable
  -> router/prefix/route rules decide later connectivity
```

Ein Host kann eine gültige lokale IPv6-Adresse besitzen und dennoch keinen erlaubten Default Router, keine passende Route, keine DNS-Information oder keine zulässige Security-Policy haben. Diese Fehler müssen getrennt observiert werden.

### Ownership- und Entscheidungsfluss

| Artefakt | Verantwortliche Rolle | Mindestinhalt |
|---|---|---|
| IPAM-/Präfixeintrag | Network/Cloud Platform Owner | Präfix, Zweck, Umgebung, Inhaber, Lebensdauer, Konfliktregel, Source of Truth. |
| Gateway-/RA-Policy | Network + Security | zugelassene Router, Präfixe, Flags/Parameter, Guard- und Change-Prozess. |
| Segment-/L2-L3-Grenze | Enterprise/Platform Architect | Broadcast-/Multicast-Umfang, Failure Domain, Routingpunkt, Mandantentrennung, Skalierungsannahme. |
| Workload-Connectivityvertrag | Application + Platform + Security | Name, Zielklasse, Ports/Protokolle, TLS/Identität, Policy, SLO, Telemetrie, Fallback. |
| Incident-Triage | SRE/Platform/Network | Zeitfenster, betroffene Präfixe, Route/Next Hop, Cache-/Eventevidenz, Sicherheitsgrenze, Rollbackautorität. |

## Protocols, Standards, Tools und Technologien

| Kategorie | Kanonischer Bezug | Einsatzgrenze |
|---|---|---|
| IPv4 ARP | [RFC 826](https://www.rfc-editor.org/rfc/rfc826), ergänzt für Konflikterkennung durch [RFC 5227](https://www.rfc-editor.org/rfc/rfc5227) | lokale IPv4-zu-Link-Layer-Auflösung, keine globale Reachability oder Identität. |
| IPv6 ND | [RFC 4861](https://www.rfc-editor.org/rfc/rfc4861) | ICMPv6-basierte Router-/Neighbor-Funktionen; Security und Host-/Routerpolicy sind zusätzlich nötig. |
| IPv6 DAD/SLAAC | [RFC 4862](https://www.rfc-editor.org/rfc/rfc4862) | tentative Adresse und Konflikterkennung, kein Besitznachweis. |
| IPv6-Paketgrundlage | [RFC 8200](https://www.rfc-editor.org/rfc/rfc8200) | IP-Schicht; Link- und Security-Entscheidungen liegen außerhalb des Paketformats. |
| SEND | [RFC 3971](https://www.rfc-editor.org/rfc/rfc3971) | kryptografische ND-Erweiterung mit beträchtlichem PKI-/Betriebsaufwand; Eignung und Implementierungsstand konkret prüfen. |
| Linux-Inspection | [`ip-neighbour(8)`](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html), [IP Sysctl](https://www.kernel.org/doc/html/latest/networking/ip-sysctl.html) | beobachtende Hostdiagnose und bewusst verwaltete Konfiguration; kein blindes Produktionsrezept. |
| Fabric-/Cloud-Varianten | Software Bridges, Overlays, virtuelle NICs, managed VPCs/VNets | Semantik, Limits, ARP/ND-Suppression, Telemetrie, Preise und Sicherheitskontrollen sind produkt- und versionsabhängig. |

**Zeitstand 2026-09-16:** Standards wie RFC 4861/4862 sind stabile Referenzen; ihre Interpretation in Betriebssystemen, Cloud-Fabrics, NIC-Offloads und Security-Appliances verändert sich mit Version, Provider und Konfiguration. Vor einer Änderung gelten die konkrete Plattformdokumentation, die freigegebene Architektur und der Change-Prozess.

## Konfiguration und Implementation: sichere Entwurfsregeln

### 1. Route und Next Hop zuerst modellieren

Eine Konfiguration ist nur nachvollziehbar, wenn sie für jede Zielklasse beschreibt:

```text
destination prefix
  -> route/table/rule selection
  -> egress interface
  -> direct neighbor OR router next-hop
  -> expected link/VLAN/overlay segment
  -> security controls
  -> observable events and rollback owner
```

Vermeide eine Tabelle „IP → MAC“ als Architekturquelle. Eine Nachbarzuordnung ist flüchtige Laufzeitinformation. Die dauerhafte Quelle ist IPAM plus Netzwerk-/Cloud-Intent, nicht ein Snapshot aus `ip neigh`.

### 2. IPv4 Address Conflict Detection bewusst behandeln

Bei dynamischer oder manueller IPv4-Adressvergabe muss definiert sein:

- welche Instanz die Adresse autoritativ zuteilt;
- ob und wie der Client vor Benutzung auf Konflikte prüft;
- wie ein Konflikt dem IPAM-/DHCP- und Incident-Prozess gemeldet wird;
- wie absichtliche virtuelle IP- oder Failover-Muster von einer Fehlkonfiguration unterschieden werden;
- wie Rate Limits und Alert-Deduplizierung Incident-Stürme verhindern.

Ein „gratuitous ARP“ ist kein Freifahrtschein, eine Adresszuordnung global neu zu setzen. Er kann bei dokumentierter Mobilität/Failover hilfreich sein, benötigt aber eine Change-/Security-/Rollback-Begründung und beobachtbare Akzeptanzkriterien.

### 3. IPv6 RA, SLAAC und DAD als zusammengesetzte Policy behandeln

Ein IPv6-Design muss mindestens klären:

- welche Links Router Advertisements senden dürfen;
- welche Präfixe, Default-Router- und DNS-/Konfigurationsinformationen zulässig sind;
- wie SLAAC, DHCPv6 oder statische Zuweisung zum IPAM und zum Geräte-/Workloadlebenszyklus passen;
- wie DAD-Fehler, temporäre Adressen und Address Rotations observiert und supportet werden;
- wo Router Advertisement Guard, L2-Segmentierung, Hostpolicy und Incident-Handhabung greifen;
- ob Redirects im konkreten Modell erforderlich oder bewusst eingeschränkt sind.

Ra- und ND-Nachrichten sind Control-Plane-Daten. Das Blockieren von „ICMPv6 insgesamt“ ist ein Anti-Pattern: Es kann ND, Path-MTU- und Diagnosefunktionen beschädigen. Definiere stattdessen zulässige Nachrichtentypen, Richtung, Linkgrenze, Gerätetyp, Rate-/Anomaliegrenzen und erwartete Protokollpfade.

### 4. Nur kontrollierte Ausnahmefälle für statische Neighbors

Statische `PERMANENT`-Einträge oder vergleichbare Bindings können in isolierten Sonderfällen begründbar sein. Sie verlagern jedoch ein dynamisches Discovery-Problem in manuelle Lebenszyklusarbeit. Vor Freigabe müssen MAC-/Interface-Wechsel, HA/Failover, Ersatzhardware, Monitoring, Dokumentation, Rollback und Ownership gelöst sein. Sie sind keine allgemeine Abwehr gegen ARP-/ND-Spoofing und keine Ersatzidentität.

### 5. Pseudocode für einen sicheren Connectivity-Preflight

```text
given service intent:
  resolve intended name through approved resolver path
  select an allowed destination and address family
  inspect policy-visible route decision
  determine immediate next hop
  observe cache/event state without clearing or changing it
  correlate timing with link, RA, DHCP/IPAM, security and service events
  form one falsifiable hypothesis
  run only an approved, minimally scoped measurement
  change only through an owner-approved, reversible procedure
```

## Scalability und Performance

### Broadcast-/Multicast-Domänen sind Kapazitäts- und Fehlerdomänen

ARP-Broadcast und IPv6-Multicast sind lokaler Kontrollverkehr. Ein sehr großer Layer-2-Bereich erhöht nicht automatisch die Nutzbarkeit; er vergrößert jedoch die Menge möglicher Teilnehmer, Fehler- und Security-Effekte. Gleichzeitig können zu kleine, unkoordiniert angelegte Segmente zu Fragmentierung, unnötigem Hairpinning und komplexer Policy führen.

Skalierung beginnt mit Fragen, nicht mit einer universellen Anzahl:

- Wie viele dynamische Endpoints, Container, VMs, Geräte und virtuelle Interfaces können gleichzeitig je Segment aktiv sein?
- Wie hoch sind Churn, Restart-, Autoscaling- und Failover-Raten?
- Welche Neighbor-/FDB-/TCAM-/Control-Plane-Grenzen gelten für die konkrete Hardware oder Cloud-Fabric?
- Welche DAD-/ARP-/ND-Events treten in einem Maintenance- oder Wiederanlaufszenario gleichzeitig auf?
- Wie isoliert man Broadcast/Multicast, Flaps und Spoofing ohne die benötigte Service-Konnektivität zu zerstören?
- Kann der Supportpfad pro Präfix, VNI/VLAN, Availability Zone oder Site eindeutige Ownership nachweisen?

### Performance-Metriken mit Aussagegrenze

| Messgröße | Signal | Aussagegrenze |
|---|---|---|
| Neighbor entries nach Zustand und Interface | Auflösungs-/Churn-Muster | Kein direkter Service-Gesundheitswert. |
| `INCOMPLETE`-/`FAILED`-Rate | fehlende aktuelle lokale Auflösung | Kann durch Link, VLAN, RA/ND, Host, Rate Limit oder Policy beeinflusst sein. |
| ARP-/ND-Rate und Multicast-/Broadcast-Anteil | Control-Plane-Last und Anomalien | Hohe Rate braucht Zeitfenster, Baseline und Kontext; sie beweist keinen Angriff. |
| DAD-Failures | Adresskonflikt-/Policy-/Linksignal | Benötigt Abgleich mit absichtlicher HA und IPAM. |
| MAC-/Neighbor-Moves | Mobility, Failover, Spoofing oder Fehlverkabelung | Erfordert Korrelation mit Change, Authentisierung und Topologie. |
| Zeit bis erste erfolgreiche Verbindung nach Start | Start-/Discovery- und Dependency-Effekt | enthält DNS, route, TLS, Service readiness und Retry-Policy. |

Wähle SLO-/Alert-Regeln als Verhältnis zur Baseline pro Segment und Zeitfenster. Ein einzelnes Cacheevent ist meist Debug-Evidenz, kein Pager. Ein flächiger Übergang zu `FAILED` zusammen mit Link-, RA- oder Fabric-Events kann dagegen einen klaren Incident-Auslöser bilden.

## Reliability und Failure Modes

| Fehlerbild | Wahrscheinliche Ebene | Beobachtbare Hinweise | Sichere nächste Hypothese |
|---|---|---|---|
| Name löst nicht auf | DNS/Service Discovery | kein gewähltes Ziel-IP-Objekt | Resolver, Record, Search Path, Policy getrennt prüfen; nicht ARP. |
| Route wählt unerwartetes Interface/Next Hop | Routing/Policy | Zielpräfix und Route widersprechen Erwartung | Prefix/Route Rule/VRF/Namespace/Cloud route table prüfen. |
| IPv4 ARP bleibt unvollständig | lokaler Link/Next Hop | Requests, aber keine passende Antwort bzw. Cache bleibt unbrauchbar | VLAN/Link/Target/Gateway/Portsecurity/Rate Limit im zuständigen Segment prüfen. |
| IPv6 ND bleibt unvollständig | lokaler Link/ND | NS ohne passende NA, Neighbor `INCOMPLETE`/`FAILED` | on-link-Annahme, link-local Scope, RA/ND-Policy, VLAN/Multicastpfad prüfen. |
| IPv6-Adresse bleibt tentative oder DAD schlägt fehl | Adresskonflikt/Hostpolicy | DAD-Event, konkurrierende Ankündigung | IPAM, HA-Ausnahme und Linkevidenz korrelieren; keine blinde Cachelöschung. |
| Cache besitzt falsche/stale Zuordnung | Mobility/Failover/Manipulation/Churn | MAC/neighbor move, asymmetrische Erreichbarkeit | autorisierte Change-/Failover-Zeitachse, Security- und Topologieevidenz abgleichen. |
| Gateway-Nachbar ist erreichbar, Remote-Service nicht | jenseits des ersten Hops | Neighbor positiv, TCP/QUIC/TLS/HTTP scheitert | Remote route, firewall/policy, NAT, LB, certificate, service health prüfen. |
| Nur ein Workload ist betroffen | Host/Namespace/Workload | andere Endpoints im selben Segment funktionieren | Interface-/Netns-/route-/policy-/identity-Differenz prüfen. |
| Nach Massendeployment viele Zeitüberschreitungen | Churn/Control Plane/Rate Limits | hohe ARP/ND, Startwelle, Nachbar-/Fabriclimits | Deployment drosseln, Kapazitätsannahmen prüfen, kein pauschales Timer-Tuning. |

### Kontrollierte Wiederherstellung

Eine Wiederherstellung benötigt eine eindeutige Fehlersignatur, einen Owner und einen rücknehmbaren Eingriff. Beispiele für genehmigungspflichtige Änderungen sind: Router Advertisement anpassen, VLAN/Overlay ändern, static neighbor setzen/löschen, Cache löschen, Interface neu starten, Security-Guard lockern oder eine IP neu vergeben. Jede davon kann die Beweislage verändern oder einen Angriff verdecken.

Der sichere Ablauf ist:

1. Betroffenen Präfix, Interface, Namespace/VM/Node, Zeitpunkt und Nutzerwirkung festhalten.
2. Ziel-IP, gewählte Route und erwarteten Immediate Next Hop von der autoritativen Architektur ableiten.
3. Cachezustände, Logs, Change- und Securityereignisse zeitlich korrelieren.
4. Eine Hypothese inklusive erwarteter Gegenbeobachtung formulieren.
5. Nur eine freigegebene, minimal scoped Messung oder reversible Änderung ausführen.
6. Akzeptanzkriterium, Rückfallbedingung und Nachbeobachtung dokumentieren.
7. IPAM, Runbook und Alert-Baseline aktualisieren, falls die Ursache strukturell war.

## Security, Governance und Compliance

### Bedrohungsmodell

ARP besitzt keine eingebaute kryptografische Herkunftsprüfung. ND-Nachrichten können ebenfalls auf einem nicht ausreichend geschützten Link manipuliert werden. Mögliche Wirkungen sind Man-in-the-Middle, Denial of Service, falscher Default Router, Traffic-Umleitung, DAD-Störung, Asset-Verwirrung und erhöhte Incident-Kosten.

Ein belastbarer Schutz kombiniert mehrere Ebenen:

| Ebene | Kontrollidee | Grenze |
|---|---|---|
| Segmentierung | begrenze, wer denselben lokalen Control Plane-Link teilen kann | VLAN/Overlay allein ist keine Workload-Identität. |
| Access/Port Policy | nur zugelassene Geräte/Ports/Workloads erhalten Linkzugang | operativer Ersatz-, Mobility- und HA-Prozess bleibt nötig. |
| ARP-/ND-/RA-Guard | erkenne oder filtere unzulässige Claims nach verbindlicher Policy | Produktsemantik, Ausnahmen und Fehlalarme sind konkret zu testen. |
| IPAM/DHCP-/Adressquelle | autoritative Zuweisung und Konfliktablauf | löst keine aktive Spoofing-Situation allein. |
| Host/Workload Security | Authentisierung, mTLS, Autorisierung, Egress-/Ingress-Policy | schützt nicht zwingend lokalen L2-Control-Traffic. |
| Beobachtung und IR | sichere Events, Anomalien, Zeitachse und Eigentümer | Telemetrie muss datensparsam, zugriffsgesteuert und manipulationsresistent sein. |

Dynamic ARP Inspection, DHCP Snooping, RA Guard, IP Source Guard, 802.1X, MACsec, SEND und ähnliche Mechanismen sind kein austauschbarer Warenkorb. Prüfe für jedes konkrete Produkt: Unterstützung, Reihenfolge im Paketpfad, IPv4-/IPv6-Abdeckung, HA-/Failover-Verhalten, Telemetrie, Bypass-Risiko, Logging, Performance und Rollback. Eine „MAC-Allowlist“ allein ist keine belastbare Mandanten- oder Nutzeridentität.

### Governance und Datenschutz

- **IPAM als Source of Truth:** Adresse, Präfix, Segment, Zweck, Owner, Laufzeit und Konfliktbehandlung müssen nachvollziehbar sein.
- **Keine dauerhafte personenbezogene Korrelation ohne Zweck:** MAC-, IP- und Neighbor-Telemetrie kann Personen oder Geräte indirekt identifizierbar machen. Definiere Zweck, Zugriff, Retention, Redaction und Incident-Ausnahme.
- **Temporäre IPv6-Adressen:** Privacy Extensions können die Bindung „Adresse = Asset“ absichtlich schwächen. Inventar, Support und Security müssen Workload-/Geräteidentität auf stärkere Identifikatoren stützen; Details richten sich nach konkreter Plattform und [RFC 8981](https://www.rfc-editor.org/rfc/rfc8981).
- **Change Governance:** Router, Präfix, RA, Guard-Regel, Neighbor-Override und IPAM-Neuvergabe benötigen autorisierte Owner, Review, Zeitfenster, Rollback und Nachweis.
- **Supplier Governance:** Managed Network Fabric und CNI/Cloud-Provider können Teile der ARP-/ND-Sicht abstrahieren. Dokumentiere Sichtbarkeit, Supportvertrag, Limits und Eskalationsweg.

## Observability und Troubleshooting

### Diagnoseleitfaden: zuerst klassifizieren, dann messen

```text
Start: Ein Client erreicht ein Ziel nicht.

A. Gibt es einen beabsichtigten Namen und eine erwartete Ziel-IP?
   Nein -> DNS/Service Discovery/Intent klären.
   Ja  -> B.

B. Wählt der Host die erwartete Route, Interface und den erwarteten Next Hop?
   Nein -> Präfix, Route, Rule, VRF/Netns oder Cloud-Routing analysieren.
   Ja  -> C.

C. Ist der aktuelle Neighborzustand für den Immediate Next Hop plausibel?
   Nein -> lokales Link-/VLAN-/ND-/ARP-/Gateway-Signal untersuchen.
   Ja  -> D.

D. Scheitert der Fluss später bei Policy, Transport, TLS, Proxy, Auth oder Anwendung?
   Ja -> diesen Übergang untersuchen; Neighbor-Erfolg nicht überinterpretieren.
   Unklar -> Zeitachse, minimalen Test und Ownergrenze präzisieren.
```

### Beobachtungen und ihre Beweisstärke

| Beobachtung | Stützt | Widerlegt nicht |
|---|---|---|
| `ip neigh show` enthält einen Eintrag | Host hat Cachezustand für ein lokales Ziel | Remote-Routing, Policy, Servicegesundheit, Identität. |
| `ip neigh get <next-hop>` zeigt eine erwartete Auswahl | lokale Lookup-Perspektive zum Zeitpunkt der Messung | historisches Verhalten, andere Namespaces/Nodes, Cloud-Fabric intern. |
| RA/ND-Event am Host | Control-Plane-Aktivität | Autorisierung/Legitimität ohne weitere Evidenz. |
| DNS-Antwort enthält Ziel-IP | Namensauflösung zu diesem Zeitpunkt | dass Route, Neighbor, TLS oder App funktionieren. |
| MAC-/Neighbor-Wechsel | Veränderung im lokalen Zuordnungsbild | böswillige Ursache ohne Change-/Topology-/Security-Korrelation. |
| erfolgreiche Anwendungstransaktion | End-to-End-Erfolg für diesen Versuch | alle Alternativpfade, Rückfallpfade und SLO-Auslastung. |

**Read-only Linux-Beobachtung als Vorlage, nicht als ausgeführtes Lab:**

```bash
ip -4 neigh show
ip -6 neigh show
ip neigh get 192.0.2.1
ip -6 route get 2001:db8:100::25
ip -d link show dev eth0
```

Diese Befehle sind kontextabhängig und dürfen nicht als Incident-Rezept gegen einen fremden, geteilten oder produktiven Host verstanden werden. Sie ersetzen keine Freigabe für Packet Capture, Cacheflush, Interface-Restart oder Netzänderung.

### Telemetriedesign

Ein gutes Ereignisschema enthält:

```text
timestamp, environment, site/zone, segment identifier,
host/workload identity, interface or virtual attachment,
address family, destination prefix class, selected next-hop class,
neighbor state transition, route decision version,
RA/ARP/ND event class, security-policy decision,
change correlation id, privacy classification, retention policy
```

Vermeide standardmäßig Payloads, vollständige Rohpakete oder dauerhafte personenbezogene Zuordnungen. Sampling, Aggregation, Zugriffskontrolle und Incident-Export müssen Teil des Telemetrievertrags sein.

## Cost und FinOps

Neighbor Discovery selbst wird selten als isolierte Rechnungsposition ausgewiesen. Kosten entstehen indirekt:

- zu große Layer-2- oder Overlay-Failure-Domains erhöhen Operations-, Incident- und Change-Kosten;
- Autoscaling- und Restart-Stürme erzeugen Kontrollverkehr, Verzögerung und Fehlersuche;
- hochpreisige Managed-Network-Produkte können Discovery-/Security-Komplexität verlagern, aber nicht Ownership eliminieren;
- fehlende IPAM-/Telemetriedisziplin verlängert Störungen und Auditaufwand;
- nicht abgestimmte IPv4-/IPv6-Strategien können NAT-, Adressraum-, Tooling- und Supportkosten erhöhen.

Bewerte Optionen daher mit einem Szenario: Anzahl dynamischer Endpoints, Churn, allowed failure domain, Datenklasse, Incident-Zielzeit, Telemetriebedarf, Change-Frequenz, Provider-/Hardwarelimits und Kompetenzen der Betriebsteams. Preise, Quoten und Implementation-Limits sind zeit- und vertragsabhängig; überprüfe sie am konkreten Angebot.

## Trade-offs und Anti-Patterns

| Entscheidung | Gewinn | Kosten/Risiko | Gute Leitplanke |
|---|---|---|---|
| Größere L2-Domäne | weniger Routinggrenzen, teils einfache lokale Konnektivität | größere Broadcast/Multicast- und Security-/Fehlerdomäne | nur mit Kapazitätsmodell, Guard-Policy und klarer Ownership. |
| Frühere L3-Segmentierung | kleinere Fehlerdomänen und explizitere Policies | mehr Routing-/Adress-/Betriebsdesign | Präfix-/IPAM-/Observability-Automatisierung mitliefern. |
| Statische Neighbor-Zuordnung | deterministisch in engen Ausnahmen | Lifecycle- und HA-Bruch, drift | Ausnahme mit Owner, Ablaufdatum, Test und Rollback. |
| ARP/ND/RA strikt filtern | reduziert Angriffsfläche | kann legitime IPv6-/Discovery-Funktionen brechen | erlaubte Typen und Pfade explizit modellieren und testen. |
| MAC-basierte Freigabe | einfache lokale Heuristik | Spoofing, Mobility, Virtualisierung, kein starker Identitätsbeweis | Workload-Identität und kryptografische App-Sicherheit ergänzen. |
| Cache flush als Sofortmaßnahme | kann kurzfristig neue Auflösung anstoßen | zerstört Evidenz, erzeugt Churn, verdeckt Ursache | nur nach Diagnose und freigegebenem Change. |
| „Ping geht, also Netzwerk okay“ | schneller Basisindikator | ignoriert Adresse, Familie, Policy, MTU, Transport und App | eine präzise End-to-End-Operation und ihr erwartetes Ergebnis definieren. |

**Anti-Pattern: DNS mit ARP verwechseln.** Ein fehlender Name hat keine ARP-Ursache, weil noch keine Ziel-IP für eine Route vorliegt.

**Anti-Pattern: Remote-IP ARPen wollen.** Bei einer gerouteten Destination löst der Host den Gateway-Neighbor auf. Eine MAC des Remote-Servers ist außerhalb des lokalen Links nicht relevant.

**Anti-Pattern: ICMPv6 pauschal blockieren.** ND und weitere IPv6-Funktionen benötigen differenzierte, getestete Control-Plane-Policy.

**Anti-Pattern: Cache-Snapshot als Assetinventar.** Caches sind dynamisch, unvollständig, scopegebunden und potenziell manipuliert.

## Staff-, Principal- und Chief-Level Decisions

### Staff / Principal

1. **Connectivityvertrag vor Deployment:** Jede Plattformvorlage legt Address Family, DNS-/Service-Discovery-Pfad, Egressklasse, erwarteten Next Hop, Securitypolicy, Telemetrie und Besitzer fest.
2. **Failure-Domain-Review:** Prüfe L2-/L3-Grenze gegen Churn, HA, Multi-Tenancy, Incident-Blast-Radius und Supportfähigkeit.
3. **Triage-Standard:** Zwinge Incidents in eine Folge aus Ziel, Route, Next Hop, Cachezustand, späterem Übergang und Gegenprobe. „Netzwerkproblem“ ist keine ausreichende Klassifikation.
4. **Safe Automation:** Automatisiere Inventory, Read-only Health-Signale, Change-Preflight, Guard-Policy und Rollbackchecks. Automatisiere keinen unkontrollierten Cacheflush oder Security-Bypass.
5. **Evidenzqualität:** Ein Dashboard braucht zeitlich korrelierte Cache-/RA-/Route-/Security-/Change-Daten und einen dokumentierten Datenschutzrahmen.

### Chief

1. **IPv4/IPv6-Portfolio:** Entscheide, welche Zielarchitekturen Dual Stack, IPv6-only oder Übergangsmechanismen benötigen und wie Tooling, Security, Support und IPAM gemeinsam reifen.
2. **L2/L3-Governance:** Lege ein organisationsweites Prinzip für Segmentierung, Broadcast/Multicast, Overlay/Underlay, Router-/RA-Ownership, Multi-Cloud und On-Prem-Anbindung fest.
3. **Identity über Adresse:** Mache explizit, dass IP/MAC nicht die primäre Zugriffsidentität sind. Investiere in Workload Identity, mTLS, Autorisierung und auditierbare Policies.
4. **Capability und Lieferantenrisiko:** Bewerte, ob Teams die abstrakte Cloud-/CNI-Connectivity ausreichend beobachten und debuggen können, und welche Einsicht bei Provider-/Hardwareausfall fehlt.
5. **Resilienz und Kosten:** Messe nicht nur Linkausfälle, sondern Wiederanlauf unter Churn, Guard-Verhalten, Telemetrielücken, Mean Time to Explain und die Kosten großer Failure Domains.

## Production Checklist

- [ ] Für jede Zielklasse sind Name, Zielpräfix, Address Family, erwartete Route und Immediate Next Hop dokumentiert.
- [ ] IPAM enthält Owner, Zweck, Präfix, Segment, Lifecycle, Konflikt- und Change-Regel.
- [ ] On-link- und remote-Ziele werden im Runbook getrennt behandelt.
- [ ] IPv4 Address Conflict Detection bzw. die konkrete Adressvergabe-/Konfliktstrategie ist beschrieben.
- [ ] IPv6 RA-, SLAAC/DHCPv6-, DAD- und Default-Router-Policy ist für jedes Segment festgelegt.
- [ ] RA/ND/ARP-Sicherheitskontrollen sind produkt-, versions- und HA-spezifisch getestet.
- [ ] Securitypolicy behandelt ICMPv6 differenziert; es gibt keinen unbegründeten Gesamtblock.
- [ ] Neighbor-/RA-/Route-/Security-Events sind mit Zeit, Segment, Scope und Change-ID korrelierbar.
- [ ] Telemetrie minimiert Payload und personenbezogene Daten; Zugriff und Retention sind definiert.
- [ ] Kapazitätsmodell umfasst Endpointzahl, Churn, Cache-/Fabriclimits, Restartwellen und Incident-Szenarien.
- [ ] Statische Neighbor-Ausnahmen haben Owner, Ablauf, HA-Test, Monitoring und Rollback.
- [ ] Ein freigegebener Incident-Ablauf verbietet blinde Cacheflushes und unautorisierte Guard-Änderungen.
- [ ] End-to-End-Probes prüfen die beabsichtigte Serviceoperation zusätzlich zu Link-/Neighbor-Signalen.
- [ ] Provider-, CNI-, Switch- und Betriebssystemversionen sowie deren Supportgrenzen sind im Architekturentscheid vermerkt.

## Praktisches Lab: lokales Modell für Nachbarzustand und Fehlerklassifikation

**Status:** `reviewed_only`. Das folgende Lab ist als rein lokales Lernmodell entworfen und in diesem Wissensstand nicht ausgeführt. Es öffnet keine Sockets, erzeugt keine Frames, liest keinen echten Cache und verändert keine Systemeinstellung.

### Lernziele

- IPv4-ARP und IPv6-ND als Mapping für den **nächsten Hop** modellieren;
- `INCOMPLETE`, `REACHABLE`, `STALE` und `FAILED` als Zustände statt als Serviceurteil verstehen;
- einen DNS-Fehler vor Route/Neighbor und einen DAD-Konflikt als getrennte Ursachen erkennen;
- eine Gegenprobe formulieren, die keine Infrastruktur ändert.

### Ablauf

Erstelle lokal eine temporäre Datei mit folgendem Python-Code:

```python
from dataclasses import dataclass

@dataclass
class Neighbor:
    family: str
    ip: str
    link_address: str | None
    state: str

cache = {
    ("ipv4", "10.20.0.1"): Neighbor("ipv4", "10.20.0.1", None, "INCOMPLETE"),
    ("ipv6", "fe80::1"): Neighbor("ipv6", "fe80::1", "33:33:00:00:00:01", "REACHABLE"),
}

def route_for(destination: str) -> tuple[str, str]:
    if destination.startswith("10.20."):
        return ("ipv4", destination)          # on-link example
    return ("ipv4", "10.20.0.1")              # remote example: gateway is next hop

def classify(name_result, destination):
    if name_result is None:
        return "DNS_OR_SERVICE_DISCOVERY: no destination IP selected"
    family, next_hop = route_for(destination)
    neighbor = cache.get((family, next_hop))
    if neighbor is None or neighbor.state in {"INCOMPLETE", "FAILED"}:
        return f"NEIGHBOR_RESOLUTION: next hop {next_hop} is not usable"
    return f"NEIGHBOR_OK_ONLY: {next_hop} is {neighbor.state}; test later layers separately"

print(classify(None, "198.51.100.25"))
print(classify("api.example", "198.51.100.25"))
cache[("ipv4", "10.20.0.1")] = Neighbor("ipv4", "10.20.0.1", "02:00:00:00:20:01", "REACHABLE")
print(classify("api.example", "198.51.100.25"))

tentative = "2001:db8:100::42"
observed_claims = {"2001:db8:100::42"}
print("DAD_CONFLICT" if tentative in observed_claims else "DAD_CLEAR")
```

**Erwartete Interpretation:**

1. Ohne Namensresultat endet die Analyse vor ARP/ND.
2. Für `198.51.100.25` wird der modellierte Gateway `10.20.0.1`, nicht die Remote-IP, als Next Hop benötigt.
3. Ein `REACHABLE`-Zustand beweist nur die lokale Next-Hop-Ebene.
4. Der DAD-Konflikt ist ein separater Address-Claim-Konflikt; er ist keine DNS- oder TCP-Aussage.

### Negative Probes

Ändere nur Daten im lokalen Modell:

- Setze den Gateway auf `FAILED`: Erwartung ist **Neighbor Resolution** statt „Service down“.
- Lasse `name_result` auf `None`: Erwartung ist **DNS/Service Discovery** ohne Neighbor-Interpretation.
- Belasse den Neighbor `REACHABLE`, aber ergänze gedanklich einen TLS- oder Authorization-Fehler: Erwartung ist, dass der Cache nicht als End-to-End-Beweis verwendet wird.
- Entferne den DAD-Claim aus `observed_claims`: Erwartung ist **DAD_CLEAR**, ohne dass dadurch Router oder Remote-Service bewiesen wären.

### Cleanup

Lösche ausschließlich die lokale temporäre Python-Datei. Das Modell enthält keine reale Netzwerkressource und hinterlässt keinen Cache-, Interface-, DNS-, Routing-, Firewall-, Cloud- oder Produktionszustand.

## Interviewfragen mit Antworten

### 1. Warum fragt ein Host für eine Remote-IPv4-Adresse nicht per ARP nach der MAC des Remote-Servers?

Die Route entscheidet zuerst. Liegt die Ziel-IP nicht on-link, ist der Router die unmittelbare Layer-2-Destination. ARP löst daher die IPv4-Adresse des Next Hops/Gateways zu dessen Link-Layer-Adresse auf. Der Remote-Server bleibt IP-Ziel im Paket, aber seine MAC-Adresse ist nur in seinem lokalen Segment relevant.

### 2. Ersetzt IPv6 Neighbor Discovery nur ARP?

Nein. ND enthält neben Address Resolution auch Router Discovery, Prefix/Parameter Discovery, Next-Hop-Bestimmung, Neighbor Unreachability Detection und Redirect-Funktionen. DAD ist eng mit IPv6-Adresseinrichtung verbunden. Ein IPv6-Design muss deshalb RA, DAD, Hostpolicy, Linkscope und Security berücksichtigen.

### 3. Bedeutet ein `REACHABLE` Neighbor-Status, dass der Service gesund ist?

Nein. Er stützt nur eine lokale Erreichbarkeitsannahme des Stacks für den Next Hop. Die Operation kann weiterhin an Route hinter dem Gateway, Firewall, NAT, MTU, Transport, TLS, Proxy, Authorization, Rate Limit oder Anwendung scheitern.

### 4. Worin unterscheiden sich ARP Probe und IPv6 DAD konzeptionell?

Beide wollen Konflikte vor regulärer Adressnutzung erkennen, aber sie sind unterschiedliche Verfahren in verschiedenen Protokollfamilien. RFC 5227 definiert IPv4 Address Conflict Detection mit ARP-Probes und Announcements; IPv6 DAD verwendet Neighbor Solicitations für tentative IPv6-Adressen. Sicherheit, OS-Verhalten und HA-Ausnahmen müssen jeweils separat geprüft werden.

### 5. Warum ist eine feste MAC-/IP-Bindung keine ausreichende Sicherheitsstrategie?

MAC-Adressen sind lokale Linkattribute, können in vielen Umgebungen geändert oder virtualisiert werden und bilden weder Nutzer- noch Workload-Autorisierung ab. Eine tragfähige Strategie kombiniert Segmentierung, L2-Control-Plane-Policy, autoritative Adressquellen, Workload Identity, mTLS, Autorisierung, Observability und Incident Response.

### 6. Wie würdest du einen massenhaften ND-Fehler nach einem Deployment analysieren?

Zuerst Scope und Zeitachse eingrenzen: welche Segmente, Adressefamilien, Interfaces, Nodes und Workloadklassen? Dann Ziel, Route und Next Hop pro betroffenem Pfad mit der erwarteten Architektur vergleichen. Neighbor-State-/RA-/Security-/Change-Ereignisse und Churn korrelieren, Kapazitäts-/Rate-Limit-Annahmen prüfen und eine minimal-invasive Gegenprobe wählen. Cacheflush, Guard-Deaktivierung oder Routeränderung erfolgen nur autorisiert und rücknehmbar.

### 7. Was ist der Architekturgewinn einer expliziten L3-Grenze?

Sie begrenzt lokale Broadcast-/Multicast- und Failure-Domains und zwingt Adressierung, Routing, Policy und Ownership zur expliziten Modellierung. Der Preis sind zusätzliche Design- und Betriebsanforderungen: IPAM, Routingautomation, Observability, Security und Support müssen mitwachsen.

## Dependencies und Cross-References

| Beziehung | Datei | Verwendung |
|---|---|---|
| Voraussetzung | [KB-0049](01-osi-und-tcp-ip-als-analysemodelle.md) | Schichten, Kapselung, Addressing und Next-Hop-Modell. |
| Voraussetzung | [KB-0050](02-ethernet-und-mac-weiterleitung.md) | Linkframe, FDB, Broadcast-Domäne, MAC-Weiterleitung. |
| Vertiefung | [KB-0052](04-ipv4-adressierung.md) | IPv4-Präfixe, private Bereiche und lokale/geroutete Ziele. |
| Vertiefung | [KB-0053](05-ipv6-adressierung-und-uebergang.md) | IPv6-Typen, SLAAC, Dual Stack, Header und Firewallfolgen. |
| Vertiefung | [KB-0054](06-subnetting-und-cidr.md) | Präfixgrenzen, Aggregation und Konfliktvermeidung. |
| Anwendung | [KB-0117](../05-distributed-systems/17-backpressure-und-ueberlast.md) | Startwellen, Churn, Rate Limits und kontrollierter Lastabwurf. |
| Anwendung | [KB-0562](../23-security-identity/26-security-incident-response.md) | Beweissicherung, Eindämmung und Security-Incident-Grenze. |
| Evidenz | [KB-0720](../30-architect-practice/44-portfolioevidenz-und-reifemodelle.md) | Architekturentscheid, Messung und tatsächliche Reife belegen. |

## Quellen und zeitliche Einordnung

| Quelle | Wofür sie verwendet wird | Stand |
|---|---|---|
| Dateikatalog KB-0051 | verbindlicher Scope und Reihenfolge. | Planstand 2026-09-14 |
| [RFC 826](https://www.rfc-editor.org/rfc/rfc826) | IPv4-zu-Link-Layer-Auflösung und ARP-Felder/Verhalten. | abgerufen 2026-09-16 |
| [RFC 5227](https://www.rfc-editor.org/rfc/rfc5227) | IPv4 Address Conflict Detection, Probe und Announcement. | abgerufen 2026-09-16 |
| [RFC 4861](https://www.rfc-editor.org/rfc/rfc4861) | Neighbor Discovery, RS/RA/NS/NA/Redirect und NUD. | abgerufen 2026-09-16 |
| [RFC 4862](https://www.rfc-editor.org/rfc/rfc4862) | IPv6 Stateless Address Autoconfiguration und DAD. | abgerufen 2026-09-16 |
| [RFC 8200](https://www.rfc-editor.org/rfc/rfc8200) | IPv6-Paket- und Adresskontext. | abgerufen 2026-09-16 |
| [RFC 3971](https://www.rfc-editor.org/rfc/rfc3971) | SEND als sicherheitsrelevante ND-Erweiterung. | abgerufen 2026-09-16 |
| [`ip-neighbour(8)`](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html) | Linux-Neighbor-Zustände und Inspection-Kontext. | abgerufen 2026-09-16 |
| [Linux IP Sysctl](https://www.kernel.org/doc/html/latest/networking/ip-sysctl.html) | kernel- und konfigurationsabhängiger Netzwerkparameterkontext. | abgerufen 2026-09-16 |
| [KB-0049](01-osi-und-tcp-ip-als-analysemodelle.md) und [KB-0050](02-ethernet-und-mac-weiterleitung.md) | kanonische Layer- und Ethernet-Voraussetzungen. | 2026-09-16 |

RFCs, Betriebssysteme, Fabric-/Cloud-Implementierungen, Guard-Mechanismen, Hardware-/NIC-Offloads, Cachelimits, Telemetrie, Preise und Compliancevorgaben sind versions-, produkt-, vertrag- und umgebungsabhängig. Vor einer Änderung werden die konkrete Implementierung, die freigegebene Architektur, Datenklassifikation, Owner, Supportgrenze, Sicherheitsregel und Rückfallstrategie validiert.

## Bonus: New Tech and Innovations

**Stand 2026-09-16 — EVPN- und Overlay-Fabrics können ARP-/ND-Suppression oder Proxy-Funktionen bereitstellen und dadurch lokale Discovery-Last anders verteilen.** **Reifegrad: etabliert bis adaptiert je Fabric.** Das erleichtert Skalierung nicht automatisch: Control-Plane-Korrektheit, Update-Latenz, Telemetrie, Failure-Domain und Fallback müssen wie Teil des Datenpfads geprüft werden.

**Stand 2026-09-16 — SmartNICs, DPUs und virtuelle Switches können Teile von Neighbor-/Security-/Offload-Verhalten außerhalb des klassischen Host-Kernels implementieren.** **Reifegrad: adaptiert bis spezialisiert je Plattform.** Ein Pilot verlangt deshalb einen klaren Capture-/Telemetry-Punkt, Sicht auf Offloadzustände und einen getesteten Fallback ohne blinden Funktionsverlust.

**Stand 2026-09-16 — IPv6 Privacy Addresses und stärker identitätsbasierte Service-Connectivity verschieben die operative Praxis weg von „IP/MAC ist Assetidentität“.** **Reifegrad: etabliert.** Der tragfähige Fortschritt ist eine Verbindung aus IPAM, Workload Identity, mTLS, Authorization und datensparsamer Telemetrie. A pilot accepts a dynamic address model only when ownership, security evidence, support workflow and incident rollback remain explicit.

