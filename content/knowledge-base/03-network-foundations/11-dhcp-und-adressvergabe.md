---
{"id": "KB-0059", "title": "DHCP und Adressvergabe", "domain": "03", "sequence": 11, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Zeitachse", "Fehlersuche"], "needed_for": "both"}, {"id": "KB-0051", "concepts": ["ARP", "Adresskonflikt", "Neighbor Cache"], "needed_for": "both"}, {"id": "KB-0052", "concepts": ["IPv4-Adresse", "Gateway", "Subnetz"], "needed_for": "both"}, {"id": "KB-0054", "concepts": ["CIDR", "Adresspool", "Subnetzgrenze"], "needed_for": "both"}, {"id": "KB-0058", "concepts": ["DNS-Resolver", "Namensdaten", "Clientpfad"], "needed_for": "both"}], "related": ["KB-0053", "KB-0060", "KB-0061", "KB-0063", "KB-0562", "KB-0720"], "applies": ["KB-0060", "KB-0061", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Das Lab modelliert Lease-Zustände, konkurrierende Angebote, falsche Gateway-/DNS-Optionen und Ablaufzeiten in einer lokalen Python-Datenstruktur.", "rationale": "Es sendet keine Broadcasts, konfiguriert keine Netzwerkschnittstelle, aktiviert keinen Relay und verändert keine Route, Firewall, DHCP- oder Produktionsressource."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein Adressvergabevertrag definiert Pools, Reservierungen, Clientidentität, Optionensets, Relay-Grenzen, Lease-Dauer, DNS-Integration, Failover, Security, Monitoring und Rückbau.", "rationale": "Die IP-Adresse wird zusammen mit Präfix, Default-Gateway, DNS-Resolver und Clientkontext als kohärente Konfiguration behandelt."}, "STAFF-TARGET": {"active": true, "scope": "Teams testen und überwachen die vollständige Zustandsfolge sowie Poolauslastung, Offer-/ACK-Quellen, Relay-Information, Optionensets, Lease-Laufzeit, Konflikte und den anschließenden DNS-/Gateway-/Endpunktpfad.", "rationale": "Sie trennen fehlende Adresse, falsche Konfiguration, konkurrierende Server, Relay-Fehler, Adresskonflikt und nachgelagerte Netz- oder Dienstfehler."}, "CHIEF-TARGET": {"active": true, "scope": "Die Organisation steuert IP-Adressraum, Netzsegmentierung, DHCP-/DNS-Ownership, Provider- und Standortabhängigkeiten, Identity-/NAC-Kopplung, Datenschutz, Notfallbetrieb und Kapazität als Plattformprodukt.", "rationale": "Ein DHCP-Ausfall oder eine fehlerhafte globale Option kann breite Clientgruppen gleichzeitig vom Netz und von Diensten trennen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "DHCPv6-PD, IA_NA/IA_PD, Server-HA-Implementierung, Option-82-Design, DHCP snooping, DAI, 802.1X/NAC-Integration, PXE, Firmware-/OS-spezifische Clientbugs und Paketebenenanalyse sind Spezialistentiefe.", "rationale": "Die Zielrollen müssen Schutz-, Abhängigkeits- und Servicegrenzen entscheiden; spezialisierte Netzwerkrollen können Protokolldetails und konkrete Geräteplattformen betreiben."}}, "lab_validation": [{"lab_id": "KB-0059-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox ohne Netzwerkzugriff", "evidence": "DORA-Folge, Lease-Zeit, Serverauswahl, konfliktierende Angebote sowie fehlerhafte Gateway- und DNS-Optionen als deterministische Fallarbeit geprüft.", "limitations": "Nicht ausgeführt; keine DHCP-Nachricht, kein Broadcast, kein Relay, keine Netzwerkschnittstelle, keine Route, keine Firewall, kein DNS-Server und keine Cloud- oder Produktionsressource wurde verwendet oder verändert."}]}
---
# DHCP und Adressvergabe

> **Ziel:** DHCP vergibt nicht nur eine IP-Adresse. Es liefert einen zeitgebundenen Netzwerkkonfigurationsvertrag. Ein Client ist erst dann sinnvoll konfiguriert, wenn Adresse, Präfix, Default-Gateway, DNS-Resolver, Lease-Zeit, Kontext und nachgelagerter Pfad zusammenpassen.

## Purpose, Definition und Scope

Dynamic Host Configuration Protocol (DHCP) versorgt Hosts mit Konfigurationsparametern und kann IP-Adressen automatisch, dynamisch oder manuell zugeordnet übermitteln. DHCPv4 definiert dazu einen Client-Server-Austausch mit Leases und Optionen. DHCPv6 ist ein eigenes Protokollmodell für IPv6-Konfiguration; IPv6 kann zusätzlich oder alternativ Router Advertisements und SLAAC nutzen. Daher darf man „DHCP“ nicht als einzige Quelle jeder Netzkonfiguration unter IPv6 annehmen.

Dieses Kapitel behandelt DHCPv4 Discovery, Offer, Request und Acknowledgement, Leases, Relay Agents, Optionensets, konkurrierende Server, Adresskonflikte und die Diagnose fehlender Gateway- oder DNS-Konfiguration. Es ist ein Architektur- und Betriebsartikel, keine Anleitung zum Einschalten eines bestimmten DHCP-Produkts.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | DHCPv4 liefert Parameter über einen leasebasierten Client-Server-Dialog; Relay Agents verbinden Broadcast-Domänen mit zentralen Servern. |
| HANDS-ON-TARGET | Das Offline-Lab modelliert Entscheidungen, ohne Pakete oder Netzressourcen zu erzeugen. |
| ARCHITECT-TARGET | Ein Konfigurationsvertrag deckt Adresse, Präfix, Gateway, DNS, Lease, Identität, Security und Rückbau ab. |
| STAFF/PRINCIPAL | Triage korreliert DHCP-Zustand und Optionen mit ARP, Route, DNS und tatsächlichem Dienstpfad. |
| CHIEF | Adressvergabe wird mit Segmentierung, Identität, Kapazität, Standortresilienz und Governance verbunden. |

## Mental Model: Ein Lease ist eine befristete Bindung, keine dauerhafte Hostidentität

Ein DHCP-Server verwaltet eine **Binding**: eine Zuordnung von Clientidentität zu Adresse und weiteren Parametern. Bei dynamischer Vergabe ist die Bindung zeitlich begrenzt. Der Client kann sie erneuern, der Server kann sie wiederverwenden, und die Netzumgebung kann eine Adresse trotz Serverbuchhaltung als konfliktbehaftet erkennen.

```text
Client without IPv4 configuration
  -> DISCOVER: "welche Server/Pools sind erreichbar?"
  <- OFFER: address + lease + options proposal
  -> REQUEST: "ich fordere dieses Angebot an"
  <- ACK: configuration binding is confirmed

Client configures:
  IPv4 address + mask/prefix + default gateway + DNS servers + lease timers
  -> address conflict checks / neighbor behavior
  -> DNS resolution and endpoint connectivity happen afterwards
```

DHCP löst nicht automatisch alle Folgeprobleme:

- Die zugewiesene Adresse kann im falschen Subnetz oder mit falscher Route unbrauchbar sein.
- Ein korrektes Gateway kann ausfallen oder durch ACLs nicht nutzbar sein.
- Ein erreichbarer DNS-Resolver kann falsche oder kontextabhängige Antworten liefern.
- Ein Client kann eine IP bekommen, aber keine für seine Identität erlaubten Ressourcen erreichen.
- Ein Lease garantiert weder einen funktionierenden Switch-Port noch Anwendungserfolg.

## Prerequisites und Dependencies

| ID | Art | Bedeutung |
|---|---|---|
| [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Verständnis und Lab | Hypothesen, Timeline und saubere Fehlertrennung. |
| [KB-0051](03-arp-und-neighbor-discovery.md) | Verständnis und Lab | IPv4-Adresskonflikte und Nachbarauflösung. |
| [KB-0052](04-ipv4-adressierung.md) | Verständnis und Lab | Adresse, Gateway und Subnetz als zusammenhängende Konfiguration. |
| [KB-0054](06-subnetting-und-cidr.md) | Verständnis und Lab | Poolgrenzen und Adressraumplanung. |
| [KB-0058](10-dns-aufloesung-und-caches.md) | Verständnis und Lab | DNS-Optionen und der getrennte Namensauflösungspfad. |

## Core Concepts

### DHCPv4: DORA und Clientzustände

DORA ist die geläufige Kurzform für `DISCOVER`, `OFFER`, `REQUEST`, `ACK`. Sie beschreibt eine häufige initiale Zuteilung, nicht jede mögliche Verlängerung oder Fehlerbehandlung. Der Client kann mehrere Offers sehen, wählt nach seiner Implementierungslogik und fordert die gewählte Konfiguration an. Der bestätigende `ACK` macht die Binding nutzbar; ein `NAK` fordert eine erneute Konfiguration.

| Nachricht | Sender | Zweck | Betriebsfrage |
|---|---|---|---|
| `DHCPDISCOVER` | Client | sucht verfügbare Server/Angebote | Erreicht der Broadcast oder Relay den zuständigen Dienst? |
| `DHCPOFFER` | Server | schlägt Binding und Optionen vor | Welche Serverquelle, welcher Pool, welche Optionen? |
| `DHCPREQUEST` | Client | selektiert Angebot oder erneuert Binding | Fordert Client erwartete Adresse/Server an? |
| `DHCPACK` | Server | bestätigt Binding und Konfiguration | Sind Adresse, Lease und Optionen vollständig und konsistent? |
| `DHCPNAK` | Server | lehnt Anfrage ab | Warum passt frühere Binding oder Netzkontext nicht? |
| `DHCPRELEASE` | Client | gibt Binding freiwillig frei | Ist dies tatsächlich verarbeitet und auditierbar? |
| `DHCPINFORM` | Client | verlangt Optionen bei extern konfigurierter Adresse | Nicht mit Adresszuteilung verwechseln. |

Ein Client bewegt sich vereinfacht durch `INIT`, `SELECTING`, `REQUESTING`, `BOUND`, `RENEWING` und `REBINDING`. Diese Zustände sind diagnostisch stärker als die Aussage „DHCP läuft“, weil sie zeigen, ob keine Antwort, kein akzeptiertes Offer, ein abgelehnter Request oder eine fehlgeschlagene Erneuerung vorliegt.

### Lease, T1 und T2

Ein dynamischer Lease hat eine Dauer. Vor Ablauf versucht der Client zuerst beim bisherigen Server zu erneuern (`T1`); später kann er breiter rebind-en (`T2`). Die konkreten Timer werden aus dem Leasevertrag abgeleitet. Leases sind Kapazitäts- und Resilienzparameter:

| Lease-Policy | Vorteil | Preis | Geeignete Frage |
|---|---|---|---|
| kurz | schneller Rückgewinn und Änderungseffekt | mehr Server-/Relay-Last, störanfälliger bei Ausfall | Wie schnell wechseln Clients und wie stabil ist die DHCP-Infrastruktur? |
| lang | geringere Erneuerungslast, toleranter bei kurzfristigem Serverausfall | langsamer Rückbau, Pool länger blockiert | Wie knapp ist der Pool und wie mobil sind Clients? |
| reserviert/manuell vermittelt | vorhersehbare Adresse für klaren Zweck | Identity-/Inventarpflege, Risiko starrer Kopplung | Braucht der Workload tatsächlich eine stabile Adresse? |
| dynamisch | effizient für fluktuierende Clients | korrekte Identitäts- und Konfliktbehandlung nötig | Ist Wiederverwendung gewollt und beobachtbar? |

Eine Lease-Datenbank ist kein CMDB-Ersatz und eine MAC-Adresse ist keine dauerhafte menschliche Identität. Virtuelle NICs, Hardwaretausch, Privacy-Merkmale, Docking und Geräteverwaltung können Identifikatoren ändern. Die Identitätsstrategie muss deshalb explizit dokumentiert werden.

### Optionen bilden den eigentlichen Konfigurationsvertrag

DHCPv4 transportiert viele Parameter als Optionen. Für Plattformbetrieb sind mindestens diese kritisch:

| Option/Kategorie | Wirkung | Prüffrage |
|---|---|---|
| Subnet Mask / Präfixkontext | lokale On-Link-Grenze | Entspricht sie dem Pool und der L2-/VLAN-Grenze? |
| Router / Default Gateway | Pfad zu anderen Netzen | Ist Gateway pro Segment korrekt und erreichbar? |
| Domain Name Server | Resolveradressen | Stimmen Resolver mit Split-DNS-, Privacy- und Standortpolicy? |
| Domain Search | Suffixsuche | Erzeugt sie unbeabsichtigte Auflösungen oder Datenlecks? |
| Lease Time / T1/T2 | Lebensdauer und Erneuerung | Passt sie zu Mobilität, Pool und Notfallbetrieb? |
| NTP / weitere Infrastruktur | zusätzliche Bootstrapping-Daten | Ist die Abhängigkeit dokumentiert, getestet und freigegeben? |
| Vendor-/Client-spezifisch | Gerätespezifische Einstellungen | Sind Semantik, Security und Lifecycle kontrolliert? |

Ein Client mit korrekter IPv4-Adresse, aber ohne Option Router, kann lokale Ziele erreichen und dennoch keinen externen Dienst. Ein Client mit Gateway, aber ohne passende DNS-Option, kann direkte IP-Verbindungen aufbauen und dennoch Namen nicht auflösen. Beides sind Konfigurationsfehler, nicht Belege für einen Anwendungsdefekt.

### Relay Agent und Broadcast-Grenze

DHCPv4 initialisiert oft per Broadcast. Router leiten Broadcasts normalerweise nicht beliebig zwischen Subnetzen weiter. Ein DHCP Relay Agent nimmt die Clientnachricht im lokalen Segment entgegen und übermittelt sie an zentrale Server; Server können anhand der Relay-Information den passenden Pool und Optionensatz wählen. RFC 3046 beschreibt Relay-Agent-Information, die als Option 82 bekannt ist.

```text
Client in VLAN 120  -- broadcast -->  Relay/SVI VLAN 120
Relay identifies ingress context
Relay                 -- unicast --> DHCP server pair
Server selects pool/options for VLAN 120
Relay                 -- local delivery --> Client
```

Der Relay ist damit Teil der Vertrauens- und Fehlerschnittstelle. Falsche Zuordnung des Eingangssegments, fehlende Rückroute, unzulässige Relay-Information oder ein falsch zugeordneter Pool können eine technisch erfolgreiche Antwort mit falscher Clientkonfiguration erzeugen.

## Architecture und Data Flow

### Referenzarchitektur

```text
[Client]
  MAC / Client ID / port or wireless context
        |
[L2 segment or WLAN]
        |
[Relay / gateway interface]
  ingress segment, relay policy, optional relay information
        |
[DHCP service]
  pool + reservation + lease database + policy
        |
[IPAM / source-of-truth / audit]
        |
[DNS, NTP, gateway, access control and endpoint services]
```

Jede Ebene braucht eigene Verantwortlichkeit. DHCP darf nicht zum intransparenten Nebenprodukt eines Routers, Switches oder Cloudnetzes werden, wenn der Dienst unternehmensweit als Basisabhängigkeit dient.

### Änderung an einem DHCP-Optionensatz

1. Betroffene Pools, Clientklassen, VLANs/Segmente und Relay-Wege inventarisieren.
2. Alte Option, neue Option, Zielzeit, Lease- und Cachefenster dokumentieren.
3. In isolierter Testklasse prüfen: Adresse, Präfix, Gateway, DNS, Suchsuffix, Route, Namensauflösung und Zielservice.
4. Gestuft bereitstellen; nach ACKs und tatsächlicher Clientwirkung beobachten.
5. Fehlkonfiguration begrenzen: Pool-/Klassen-Scope, Notfall-Rücknahme und klare Owner bereithalten.
6. Erst nach mindestens einem Erneuerungsfenster und Messung aller relevanten Clienttypen alte Annahmen entfernen.

Ein globaler Gateway- oder DNS-Optionswechsel ist eine Change-Kategorie mit hoher Reichweite. Der Rollback darf nicht davon abhängen, dass alle Clients sofort eine neue Lease anfragen.

## DHCPv4, DHCPv6 und IPv6-Autokonfiguration

DHCPv6 ist kein „DHCPv4 mit längeren Adressen“. RFC 8415 definiert eigene Nachrichten, Identitäten und Zuweisungen. IPv6-Hosts können Adressen über SLAAC und Router Advertisements erhalten, DHCPv6 für zusätzliche Parameter verwenden oder adress- und prefixbezogene Zuweisungen via DHCPv6 erhalten. Daraus folgen drei Pflichtfragen:

1. Welche Quelle liefert IPv6-Adresse und Präfix?
2. Welche Quelle liefert Default Route?
3. Welche Quelle liefert DNS-Resolver und Suchdomain?

Die Antworten können unterschiedliche Mechanismen haben. Ein erfolgreiches DHCPv6-Signal beweist daher nicht allein, dass IPv6-Default-Route oder Resolver korrekt sind. Ebenso ist ein funktionierendes DHCPv4 keine Begründung, IPv6-Diagnose zu überspringen.

## Scalability und Performance

DHCP-Last entsteht beim ersten Join, nach Sleep/Wake, bei Reboots, bei kurzlebigen Geräten und besonders bei gleichzeitigen Ereignissen. Ein Standortausfall, Stromwiederkehr oder großflächiger Neustart kann einen Burst aus Discovery und Renewal auslösen.

| Kennzahl | Aussage | Aktion bei Abweichung |
|---|---|---|
| Pool-Auslastung und freie Adressen | Kapazitätsreserve | Vor Erschöpfung Segment/Pools erweitern oder ungenutzte Bindings bereinigen. |
| Discover-to-ACK-Latenz | Bootstrap-Erlebnis | Relay, Server, Datenbank, Broadcast-/WLAN-Last und Paketverlust unterscheiden. |
| Offer-/ACK-Quelle | unbeabsichtigte Server oder HA-Fehler | erwartete Serveridentität gegen Policy prüfen. |
| NAK-Rate | Kontext-, Binding- oder Clientzustandsproblem | nach Clientklasse, Segment und Ursache zerlegen. |
| Renewal-/Rebind-Erfolg | Lease-Stabilität | Timer, Serververfügbarkeit, Relay/Routing und Datenpersistenz prüfen. |
| Option-Compliance | korrekte Konfiguration | Gateway/DNS/Suchdomain getrennt messen, nicht nur Adresse. |
| Konfliktmeldungen | mögliche Doppelbelegung | ARP-Probe, statische Ausnahmen und IPAM-Daten korrelieren. |

Poolauslastung braucht sowohl absolute Reserve als auch Zeittrend. Ein Pool mit scheinbar 20 Prozent frei kann bei einem Massenevent unzureichend sein, wenn Leasezeiten lange sind und Rückgewinnung träge erfolgt.

## Reliability und Failure Modes

| Fehlerbild | Ursacheklasse | Beweis | Unmittelbare Reaktion | Dauerhafte Maßnahme |
|---|---|---|---|---|
| Keine Adresse | Broadcast/Relay/Server/ACL-Ausfall | Clientzustand und fehlende Offer-/ACK-Zeitlinie | Pfad und Dienst isolieren | redundante Relay-/Serverpfade und Drill. |
| Falsches Subnetz | falscher Relay-Kontext oder Poolregel | `giaddr`/Ingress, Offer, ACK und erwartetes VLAN | betroffene Scope begrenzen | pool-to-segment-Vertrag automatisiert prüfen. |
| Adresse ohne Internet | fehlende/falsche Routeroption oder L3-Policy | ACK-Option, Route, Gateway-Probe | nicht DNS oder Anwendung ändern | Optionstests im Change-Gate. |
| Namen funktionieren nicht | fehlende/falsche DNS-Option oder DNS-Pfad | ACK-Option, Resolverkontext, DNS-Triage | Resolveroption und Sicht prüfen | DHCP-/DNS-Ownership koppeln. |
| Intermittierende Adresse | konkurrierende Server oder instabile Leasepersistenz | Offer-/ACK-Serveridentitäten, Lease-Logs | fremden Server isolieren | Autorität, Netzwerkzugang und HA-Recovery schützen. |
| Doppeladresse | statische Nutzung, stale Binding, Fehler/Angriff | ARP Conflict Detection, IPAM/Leasevergleich | Konfliktcontainment nach Runbook | Reservierungs- und Ausnahmeprozess, DAI/snooping nach Design. |
| Pool erschöpft | Capacity oder Leaserückgabeproblem | freie Adressen, Abfragerate, Leasetrend | Priorisierung/Pool-Erweiterung | Forecast, Segmentplanung, Clientlifecycle. |

## Security, Governance und Compliance

DHCP ist vor der normalen IP-Kommunikation erreichbar und damit attraktiv für Fehlkonfiguration und Missbrauch. Ein nicht autorisierter DHCP-Server kann Clients falsches Gateway oder DNS geben und Verkehr umleiten. DHCP-Optionen sind keine vertrauenswürdige Identitätsbehauptung. Schutz muss sich über Port-/Segmentkontrollen, serverseitige Policy, Logging und nachgelagerte Identitäts-/Zugriffskontrolle erstrecken.

| Risiko | Kontrolle |
|---|---|
| Rogue DHCP Server | kontrollierte Switch-/WLAN-Policies, DHCP Snooping nach geprüftem Design, autorisierte Uplinks und Alarmierung. |
| falsche Pool-/Relay-Zuordnung | change-reviewed Mapping, unabhängige Testclients und Messung der Optionensets. |
| Adresskonflikt | ARP Conflict Detection, IPAM-Abgleich, reservierte Ausnahmen und klare Incidentprozedur. |
| identifizierbare Clientdaten | Zweckbindung, minimale Retention, Zugriffsprotokoll, DSGVO-/lokale Prüfung. |
| unkontrollierte Adminänderung | Least Privilege, Vier-Augen-Review, auditierbarer Export und getesteter Rollback. |
| DHCP als Zugangskontrolle missverstanden | DHCP mit 802.1X/NAC, Firewall und Serviceauthentisierung sinnvoll kombinieren. |

RFC 7844 beschreibt Anonymitätsprofile für DHCP-Clients. Privacy-Optimierung kann mit stabilen Reservierungen, Asset-Management oder Zugriffspolicy kollidieren. Die Organisation muss entscheiden, welche Identifikatoren sie zu welchem Zweck und wie lange verarbeitet; diese Abwägung ist kein reines Netzwerkdetail.

## Observability und Troubleshooting

### Minimales Ereignisschema

```text
timestamp, site, segment/VLAN, relay identity, client identifier,
hardware address (protected as required), transaction id,
message type, server identity, pool, offered address, acknowledged address,
lease/T1/T2, option-set version, router option, DNS option,
outcome, NAK/decline reason, conflict signal, correlation id
```

Sensible Identifikatoren werden je nach Policy pseudonymisiert oder nur kurzzeitig zugänglich gemacht. Für einen aktiven Incident braucht das berechtigte Team einen Weg, den Client dennoch sicher mit den relevanten DHCP-Ereignissen zu korrelieren.

### Triage-Reihenfolge

1. **Clientkontext erfassen:** Interface, Segment/VLAN, Standort, Zeitpunkt, OS/Clienttyp, erwartete Policy.
2. **Zustand erkennen:** Hat der Client kein Offer, keinen ACK, einen NAK oder nur ein nachgelagertes Problem?
3. **Transaktion korrelieren:** Transaction ID, Client ID, Relay, Serveridentität, Pool und Optionen bestimmen.
4. **Konfigurationsvertrag prüfen:** Adresse/Präfix, Router, DNS, Suchdomain, Lease und Reservierung gegen Erwartung vergleichen.
5. **Nachgelagerte Schichten prüfen:** ARP/Neighbor, Gateway, Route, DNS-Auflösung und Endpunktprobe einzeln testen.
6. **Konflikt und Konkurrenz prüfen:** Andere DHCP-Quellen, statische Nutzer, duplicate ARP-Signale, Lease-Datenbank und IPAM vergleichen.
7. **Änderung eingrenzen:** Nur bei belegter Ursache Pool, Relay, Option oder Security-Policy ändern.

| Symptom | Nicht ausreichende Erklärung | Geeigneter Nachweis |
|---|---|---|
| „WLAN verbunden, aber nichts geht“ | Client hat eine IP-Adresse | ACK-Optionen, Default Route, Gateway, DNS und Endpunktpfad. |
| „DHCP ist langsam“ | ein einzelner Clienttimeout | Discover-to-ACK-Verteilung, Relaypfad, Serverlast, Segment-/WLAN-Burst. |
| „Falsche DNS-Antwort“ | DNS allein | DHCP-DNS-Option, verwendeter Resolver und Split-DNS-Kontext. |
| „Doppelte IP“ | Ping-Antwort | ARP-Conflict-Signal, MAC-/Client-ID-Korrelation, statische Ausnahme und Lease-/IPAM-Daten. |

## Cost und FinOps

Die Kosten entstehen nicht nur beim DHCP-Server: sie umfassen Adressraum, Standort- und Relay-Design, Hochverfügbarkeit, IPAM, Observability, Storage für Auditdaten, Security-Kontrollen und Incidentzeit. Kürzere Leases reduzieren ungenutzte Poolbindung, erhöhen aber Server- und Netzwerktransaktionen. Lange Leases senken Last, können Kapazität blockieren und Rückbau verzögern.

FinOps und Plattformteams sollen mindestens verbinden:

- Poolreserve und erwartete Ankunfts-/Reboot-Bursts;
- Lease-Dauer und tatsächliche Clientverweildauer;
- Kosten zentraler Dienste gegen lokale Fehlerdomänen;
- Logging- und Retentionkosten gegen Security-/Forensiknutzen;
- Kosten neuer Subnetze gegen adressraumsparende, aber störanfällige Überbelegung;
- Provider-/Appliance-Lizenz, Export und Wiederherstellbarkeit.

## Trade-offs und Anti-Patterns

| Entscheidung | Gewinn | Preis | Leitplanke |
|---|---|---|---|
| zentrale DHCP-Farm mit Relays | einheitliche Policy und Inventar | Abhängigkeit von WAN/Relay und gemeinsame Fehlerdomäne | lokale Resilienz, Redundanz und Drill bewerten. |
| lokale Server je Standort | geringe Bootstrap-Latenz, Standortautonomie | mehr Betrieb und Policy-Drift | Automatisiertes Konfigurationsmanagement und zentrale Evidenz. |
| lange Lease | weniger Transaktionen | langsame Rückgewinnung, träge Änderungen | für stabile Geräte nur mit Kapazitätsreserve. |
| kurze Lease | schnelle Reaktion und Wiederverwendung | Renewal-Burst und Ausfallabhängigkeit | Last- und Failovermodell nachweisen. |
| MAC-basierte Reservierung | einfaches Mapping | Identifier kann wechseln oder fälschbar sein | nicht als alleinige Sicherheitsidentität nutzen. |
| DHCP Option 82 / Relay-Kontext | präzise Segmentpolicy | Vertrauens- und Gerätekomplexität | Werte validieren, dokumentieren und gegen Spoofing schützen. |

Anti-Patterns:

- „Der Client hat eine IP, DHCP ist ausgeschlossen.“
- Gateway- und DNS-Optionen global ändern, ohne Pool-/Kontextmatrix und Rückbauzeit.
- Zwei Server unabhängig mit überlappenden Pools betreiben und auf „keine Kollision“ hoffen.
- Statische Adressen innerhalb dynamischer Pools ohne Reservierung und Inventar vergeben.
- DHCP-Lease als dauerhafte Geräteidentität oder Zugriffserlaubnis verwenden.
- IPv6 als nachrangig behandeln und Router Advertisements, DHCPv6 und DNS-Quelle nicht getrennt prüfen.
- Eine Poolerschöpfung erst beim ersten Clientfehler erkennen.

## Staff-, Principal- und Chief-Level Decisions

### Staff / Principal

- Behandle jedes Optionenset als versionierten Konfigurationsvertrag, nicht als lose Servereinstellung.
- Lege eine testbare Matrix aus Segment, Clientklasse, Adresse/Präfix, Gateway, DNS, Search Domain, Lease und Zugangspolicy fest.
- Koppel DHCP- und DNS-Änderungen über gemeinsame Ownership und Testevidenz, ohne ihre Fehlerdomänen zu vermischen.
- Mache Poolauslastung, Renewal, NAK, Serverquellen und Option-Compliance zu Plattformsignalen.
- Baue Incident-Runbooks, die DORA und Leasezustand vor nachgelagerten Spekulationen untersuchen.
- Plane Failover und Wiederherstellung als Datenkonsistenz- und Client-Experience-Problem, nicht nur als zweites Servericon.

### Chief

- Definiere, welche Organisation Adressraum, IPAM, DHCP, DNS, L2/L3, Standortnetz, Cloudnetze und Identity-Integration verantwortet.
- Setze Serviceklassen für Campus, Rechenzentrum, Lab, OT, Remote, Cloud und Gastnetz mit unterschiedlichen Lease-, Privacy- und Resilienzzielen.
- Entscheide, wann lokale Notfallfähigkeit den Mehrbetrieb rechtfertigt und wann zentrale Kontrolle besser ist.
- Verlange Provider-Exit, Export, Wiederherstellung und regelmäßig getestete Massenereignisse.
- Steuere Clientidentität, Telemetrie und Retention gemeinsam mit Security, Datenschutz und Workplace/Endpoint-Verantwortung.
- Priorisiere Adressraum- und Segmentierungsentscheidungen nach Business-Kritikalität und Blast Radius statt nur nach historischer Netzstruktur.

## Production Checklist

- [ ] Pool, CIDR, Segment/VLAN, Relay, Serverautorität und Owner sind eindeutig dokumentiert.
- [ ] Adresse, Präfix, Router, DNS, Suchdomain, Lease und Clientklasse ergeben einen validierten Vertrag.
- [ ] Reservierungen liegen außerhalb unkontrollierter dynamischer Vergabe oder sind sauber im Poolmodell abgebildet.
- [ ] Redundanz, Datenpersistenz, Wiederanlauf und Mass-Renewal wurden als relevante Fehlerfälle geprüft.
- [ ] Poolreserve, Lease-Trends, DORA-Latenz, NAK/Decline und Optionskonformität werden überwacht.
- [ ] Rogue-Server-, Relay- und Clientidentitätskontrollen sind passend zum Segment aktiv und auditierbar.
- [ ] IPv4 und IPv6 einschließlich Router Advertisements, DHCPv6 und DNS-Quellen sind getrennt bewertet.
- [ ] Datenschutz für Identifikatoren, Logs und Aufbewahrung ist mit Security/Compliance abgestimmt.
- [ ] DNS- und Gateway-Optionen haben einen gestuften Change und ein Cache-/Lease-bewusstes Rollback.
- [ ] Runbook testet vollständigen Clientpfad bis zu DNS und Zielservice.

## Praktisches Lab: Offline-Modell für Lease, konkurrierende Angebote und fehlerhafte Optionen

**Ziel:** Das Modell zeigt, dass ein bestätigter Lease mit falschem Gateway oder DNS nicht als funktionierende Netzkonfiguration gelten darf. Es verwendet keine Socket- oder Systemnetzwerkfunktion.

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Offer:
    server: str
    address: str
    lease_s: int
    gateway: str | None
    dns: tuple[str, ...]

offers = [
    Offer("dhcp-a", "10.20.4.21", 3600, "10.20.4.1", ("10.20.1.53",)),
    Offer("rogue-or-wrong-scope", "10.88.0.21", 3600, "10.88.0.1", ("10.88.0.53",)),
]

def accept_expected(offer: Offer, expected_prefix: str, expected_gateway: str):
    address_ok = offer.address.startswith(expected_prefix)
    gateway_ok = offer.gateway == expected_gateway
    dns_ok = len(offer.dns) > 0
    return {
        "server": offer.server,
        "accept": address_ok and gateway_ok and dns_ok,
        "address_ok": address_ok,
        "gateway_ok": gateway_ok,
        "dns_ok": dns_ok,
    }

for offer in offers:
    print(accept_expected(offer, "10.20.4.", "10.20.4.1"))
```

**Erwartete Auswertung:**

| Probe | Erwartung | Begründung |
|---|---|---|
| Angebot `dhcp-a` | akzeptierbar im Modell | Poolpräfix, Gateway und DNS passen zur definierten Erwartung. |
| zweites Angebot | ablehnen | Es belegt, dass Offer-Empfang allein keine korrekte Autorität oder Segmentzuordnung beweist. |
| `gateway=None` | Adresse kann vorliegen, Vertrag ist fehlerhaft | Lokale Kommunikation kann möglich bleiben, Off-Link-Verkehr nicht. |
| `dns=()` | direkte IP-Verbindung denkbar, Namensauflösung fehlt | Fehler danach in [KB-0058](10-dns-aufloesung-und-caches.md) getrennt untersuchen. |

**Negative Probes:**

1. Ändere beim erwarteten Offer nur den DNS-Wert und zeige, dass `accept` im einfachen Modell noch wahr sein könnte, obwohl die DNS-Policy fachlich verletzt ist. Ergänze dafür eine erwartete Resolverliste.
2. Simuliere einen Leaseablauf, indem du `lease_s` auf einen kleinen Wert setzt. Begründe, warum eine Erneuerungslast entsteht, statt nur eine lokale Timeoutmeldung zu erwarten.
3. Füge zwei „autorisierten“ Servern denselben Adresswert hinzu. Beschreibe das als Daten- und Failoverdesignfehler, nicht als legitime Redundanz.
4. Füge eine statische Adresse in denselben Pool ein und beschreibe, welche ARP-/IPAM-Evidenz einen möglichen Konflikt prüfen würde.

**Cleanup:** Interpreter beenden und nur temporär angelegte lokale Labdateien entfernen. Es wurden keine Schnittstellen, Routen, DHCP-Server, Relays, Firewall-, Cloud- oder Produktionsressourcen verändert.

## Interviewfragen mit Antwortkernen

1. **Warum ist eine IP-Adresse allein kein erfolgreicher DHCP-Nachweis?**  
   DHCP übermittelt einen Konfigurationsvertrag. Ohne korrektes Präfix, Gateway, DNS, Lease und passenden Kontext kann die Adresse lokal sichtbar, aber für den vorgesehenen Dienstpfad unbrauchbar sein.

2. **Was unterscheidet Discover, Offer, Request und ACK?**  
   Discover sucht Server, Offer schlägt eine Konfiguration vor, Request selektiert oder erneuert, ACK bestätigt die Binding. Die Reihenfolge erlaubt, fehlende Antwort, falsche Quelle und abgelehnte Binding zu unterscheiden.

3. **Wozu dient ein DHCP Relay?**  
   Es überbrückt die Broadcast-Grenze zwischen Clientsegment und zentralem Server und liefert Kontext für die Poolwahl. Seine Zuordnung und Vertrauensgrenze sind daher kritisch.

4. **Wie kann ein DHCP-Fehler DNS-Probleme erzeugen?**  
   Eine falsche oder fehlende DNS-Option lässt den Client einen unpassenden Resolver nutzen oder gar keinen. Danach ist DNS separat über QNAME, Resolver und Antwort zu diagnostizieren.

5. **Warum sind überlappende Pools gefährlich?**  
   Ohne koordinierten gemeinsamen Bindingzustand können verschiedene Server dieselbe Adresse vergeben. Redundanz benötigt konsistente Daten und getestete Failoversemantik.

6. **Welche Fragen stellst du bei Poolerschöpfung?**  
   Freie Adressen, Lease-Dauer, Clientverweildauer, Renewal-/Release-Verhalten, Burst-Ereignisse, Reservierungen, statische Ausnahmen und Subnetzkapazität.

7. **Warum ist DHCPv6 kein Ersatzwort für IPv6-Konfiguration?**  
   IPv6 kann Adressen und Routen auch über Router Advertisements/SLAAC beziehen. DNS- und Prefix-Informationen müssen je Umfeld über ihre tatsächliche Quelle geprüft werden.

8. **Wie begrenzt du Rogue-DHCP-Risiken?**  
   Mit zugelassenen Server-/Uplinkpfaden, Segmentkontrollen wie DHCP Snooping nach validiertem Design, Monitoring der Offerquellen und einer Incidentprozedur; die IP-Adresse selbst ist kein Vertrauenstoken.

## Dependencies, Cross-References und Quellen

| Beziehung | Dokument | Nutzung |
|---|---|---|
| Voraussetzung | [KB-0051](03-arp-und-neighbor-discovery.md) | IPv4-Konflikt- und Nachbaranalyse. |
| Voraussetzung | [KB-0052](04-ipv4-adressierung.md) | Adresse, Gateway und Subnetz. |
| Voraussetzung | [KB-0054](06-subnetting-und-cidr.md) | Pool- und CIDR-Planung. |
| Voraussetzung | [KB-0058](10-dns-aufloesung-und-caches.md) | DNS-Option und Resolverdiagnose. |
| Weiterführung | KB-0060 NTP und Zeitsynchronisation | Zeitabhängige Client-/Logkorrelation. |
| Weiterführung | KB-0061 VLAN und Broadcast-Segmentierung | DHCP-Broadcast- und Segmentgrenzen. |
| Weiterführung | KB-0562 Enterprise DNS und Namensräume | Unternehmensweite Namens-/Adressverantwortung. |
| Nachweis | KB-0720 Portfolioevidenz und Reifemodelle | Nachweisbare Betriebs- und Architekturentscheidungen. |

Primärquellen, abgerufen und inhaltlich geprüft am **2026-09-16**:

- [RFC 2131 – Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131)
- [RFC 2132 – DHCP Options and BOOTP Vendor Extensions](https://www.rfc-editor.org/rfc/rfc2132)
- [RFC 3046 – DHCP Relay Agent Information Option](https://www.rfc-editor.org/rfc/rfc3046)
- [RFC 4361 – Node-specific Client Identifiers for DHCPv4](https://www.rfc-editor.org/rfc/rfc4361)
- [RFC 5227 – IPv4 Address Conflict Detection](https://www.rfc-editor.org/rfc/rfc5227)
- [RFC 7844 – Anonymity Profiles for DHCP Clients](https://www.rfc-editor.org/rfc/rfc7844)
- [RFC 8415 – Dynamic Host Configuration Protocol for IPv6 (DHCPv6)](https://www.rfc-editor.org/rfc/rfc8415)

## Bonus: New Tech and Innovations

In softwaredefinierten Campus-, Edge- und Cloud-Umgebungen können DHCP-, IPAM-, NAC- und Intent-Systeme eine konfigurierte Netzidentität als Ereignis weitergeben. Das erhöht Automatisierung, aber auch den Blast Radius eines fehlerhaften Quellereignisses. Erst eine klare Quellenhierarchie, idempotente Verbraucher, Auditpfad und ein getesteter Rückbau machen diese Integration tragfähig.

Privacy-orientierte DHCP-Clientprofile können die dauerhafte Wiedererkennung eines Geräts verringern. Sie stehen jedoch in Spannung zu festen Reservierungen, Asset-Management und Zugangspolicies. Die Wahl muss pro Netzwerkklasse und Datenzweck dokumentiert sein; ein Feature-Schalter ersetzt keine Privacy-Architektur.

Ein Pilot akzeptiert eine neue Adressvergabefunktion erst, wenn Lease-, Relay-, Pool-, Gateway-, DNS-, Identity-, Privacy-, Monitoring- und Rollbackverhalten unter erwarteten und gestörten Clientzuständen nachgewiesen sind.

