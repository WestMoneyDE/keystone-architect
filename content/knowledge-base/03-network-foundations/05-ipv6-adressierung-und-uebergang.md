---
{"id": "KB-0053", "title": "IPv6-Adressierung und Übergang", "domain": "03", "sequence": 5, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Fehlerhypothesen", "Zeitachse", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0049", "concepts": ["IP-Schicht", "Kapselung", "End-to-End-Analyse"], "needed_for": "both"}, {"id": "KB-0051", "concepts": ["Neighbor Discovery", "DAD", "Next Hop"], "needed_for": "both"}, {"id": "KB-0052", "concepts": ["Präfixkontext", "Adressgovernance", "lokal versus geroutet"], "needed_for": "understanding"}], "related": ["KB-0054", "KB-0055", "KB-0056", "KB-0057", "KB-0562", "KB-0720"], "applies": ["KB-0055", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein offline Python-Modell normalisiert IPv6-Textformen, klassifiziert dokumentierte Scopes und bewertet Dual-Stack-Ergebnisse als getrennte Pfade.", "rationale": "Es bindet keine IPv6-Adresse, öffnet keine Socketverbindung, sendet kein ND/ICMPv6 und verändert kein Interface, keine Route, keine Firewall oder Cloudressource."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein IPv6-Connectivityvertrag beschreibt Präfixdelegation, Address Source, RA/SLAAC/DHCPv6-Entscheidungen, DNS, Dual-Stack-Fallback, ICMPv6-Policy, Identity, Telemetrie und Rückbau.", "rationale": "IPv6 wird als vollwertiger Daten- und Control-Plane-Pfad geplant, nicht als unsichtbare Nebenfunktion von IPv4."}, "STAFF-TARGET": {"active": true, "scope": "Teams testen IPv4 und IPv6 je Zielklasse getrennt, korrelieren DNS-/Route-/ND-/PMTU-/Firewall-/TLS-Evidenz und vermeiden falsche Erfolgssignale durch stillen IPv4-Fallback.", "rationale": "Der Betrieb erhält eigene SLOs und Fehlersignale pro Adressfamilie sowie sichere, zulässige Diagnosewege."}, "CHIEF-TARGET": {"active": true, "scope": "Die Organisation steuert eine adressfamilienübergreifende Zielarchitektur mit IPv6-Fähigkeit, IPAM/DDI, Security, Lieferantenbewertung, Migration, Betriebsmodell und Kompetenzaufbau.", "rationale": "Die Investition bewertet Produktreichweite, Providerabhängigkeit, technische Schuld, Compliance und langfristige IPv4-Knappheit; sie ist kein reines Netzwerkprojekt."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "IPv6-Routingprotokolle, Extension-Header-Filter/Parsing, NAT64/DNS64, CLAT/464XLAT, Segment Routing, Mobile IPv6, SEND-PKI, ASIC-Offloads und Packet-Level-Fuzzing sind Spezialistentiefe.", "rationale": "Die Zielrollen müssen Grenzen, Risiken, Tests und Eskalationswege steuern, ohne jedes Übergangsverfahren selbst implementieren zu müssen."}}, "lab_validation": [{"lab_id": "KB-0053-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox mit Standardbibliothek ipaddress", "evidence": "Textnormalisierung, Scopeklassifikation und die Trennung von IPv4-/IPv6-Pfadresultaten wurden als reine Fallarbeit fachlich geprüft.", "limitations": "Nicht ausgeführt; keine IPv6-Adresse wurde konfiguriert, kein Router Advertisement oder Neighbor Discovery erzeugt, kein DNS abgefragt und keine Netz-, Firewall-, Cloud- oder Produktionsressource berührt."}]}
---
# IPv6-Adressierung und Übergang

> **Ziel:** IPv6 ist kein größer geschriebenes IPv4. Es bringt 128-Bit-Adressen, Link-Local-First-Betrieb, Neighbor Discovery, Multicast statt Broadcast und mehrere gleichzeitig gültige Adressen pro Interface mit. Ein gutes Design macht diese Eigenschaften sichtbar, beobachtbar und sicher – einschließlich einer expliziten Übergangsstrategie.

## Purpose, Definition und Scope

IPv6 ist die Internet-Protokollversion mit 128-Bit-Adressen. Die Adresse wird einem Interface zugeordnet; ein Interface kann gleichzeitig Link-Local-, globale, Unique-Local-, temporäre, anycast- und multicastbezogene Adressen/Zuordnungen besitzen. RFC 4291 beschreibt die Architektur, RFC 8200 das Paketformat, RFC 4861 Neighbor Discovery und RFC 4862 Stateless Address Autoconfiguration mit Duplicate Address Detection.

Dieses Kapitel erklärt:

- globale, Unique-Local-, Link-Local-, Loopback-, unspecified-, multicast- und anycastbezogene Konzepte;
- Textdarstellung, Präfixe, Scope und die Falle mehrerer Adressen pro Workload;
- SLAAC, Router Advertisements, DAD, temporäre Adressen und die Abgrenzung zu DHCPv6;
- Dual Stack als zwei Datenpfade statt als einzelnes Häkchen;
- Extension Headers, ICMPv6, Firewall- und Erreichbarkeitslücken;
- Architektur, Governance, Observability, Kosten und sichere Migration.

Nicht im Scope: vollständige IPv6-Präfixberechnung, BGP/OSPFv3, konkrete Router-/Firewall-/CNI-Konfiguration, DNS-Implementierung, NAT64/464XLAT-Details oder Packet Captures. Diese Themen werden in ihren kanonischen Dateien vertieft.

Nach diesem Kapitel kannst du:

1. IPv6-Adressen, Präfixe und Scope sauber lesen und dokumentieren;
2. erklären, warum `fe80::/10` unverzichtbar, aber nicht global routbar ist;
3. SLAAC, RA, DAD, temporäre Adressen und DHCPv6 als zusammengesetzte Betriebsentscheidung einordnen;
4. einen IPv6-Fehler von einem IPv4-Fallback, DNS-, ND-, Firewall-, PMTU- oder Anwendungsfehler unterscheiden;
5. eine Dual-Stack-Migration mit Security, IPAM, SLO, Rollback und Ownership planen.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | IETF/IANA-Primärquellen erklären Addressing, Discovery, Autokonfiguration und Betriebsrisiken. |
| HANDS-ON-TARGET | Die Fallarbeit bleibt offline und modelliert nur Adressen und Ergebnisse. |
| ARCHITECT-TARGET | IPv6 erhält gleichwertige Address-, Route-, DNS-, Security- und Observability-Verträge. |
| STAFF/PRINCIPAL | IPv4 und IPv6 werden getrennt getestet und mit gemeinsamer End-to-End-Evidenz geführt. |
| CHIEF | IPv6-Fähigkeit, Übergang, Provider-/Produktreife und Kompetenzaufbau werden als Portfolio entschieden. |

## Mental Model: Adresse ist Interface-Kontext, nicht feste Maschinenidentität

```text
workload interface
  ├─ link-local: fe80::...       (nur auf diesem Link; oft Next-Hop-/RA-Kontext)
  ├─ global unicast: 2001:...    (abhängig von delegiertem Präfix und Route)
  ├─ unique local: fd..:...      (koordinierter privater Scope)
  ├─ temporary address: ...      (Privacy-/Outbound-Kontext, zeitlich wechselnd)
  └─ multicast memberships: ff.. (Gruppen-/Control-Plane-Kontext)
```

Eine Adresse beantwortet nicht allein, welcher Dienst oder welches Gerät dauerhaft gemeint ist. Belastbare Identität kombiniert Workload-/Geräteidentität, IPAM-Owner, Zeitfenster, Interface/Zone, Route, DNS-/Service-Intent und kryptografische Anwendungsidentität.

Für jede Verbindung gilt weiter:

```text
name/discovery -> chosen AAAA or A record -> family-specific route
               -> IPv6 neighbor/next hop -> ICMPv6/PMTU/security path
               -> transport/TLS/proxy/application outcome
```

Ein erfolgreicher IPv4-Request kann einen fehlerhaften IPv6-Pfad verbergen. Ein erfolgreicher IPv6-Neighbor-Eintrag beweist wiederum weder DNS, TLS noch Serviceautorisierung.

## Prerequisites und Dependencies

| ID | Art | Bedeutung |
|---|---|---|
| [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Anwendung und Lab | Hypothese, Zeitachse und Gegenprobe verhindern „IPv6 ist kaputt“-Pauschalurteile. |
| [KB-0049](01-osi-und-tcp-ip-als-analysemodelle.md) | Anwendung und Lab | Schichten und Kapselung ordnen IPv6 zwischen Link, Transport und Anwendung ein. |
| [KB-0051](03-arp-und-neighbor-discovery.md) | Anwendung und Lab | ND, DAD und lokale Next-Hop-Auflösung sind zentrale IPv6-Control-Plane-Funktionen. |
| [KB-0052](04-ipv4-adressierung.md) | Verständnis | Präfix, IPAM, Overlap und Routingkontext liefern den Vergleich für Übergänge. |

## Core Concepts

### Adresse, Präfix und Textform

IPv6-Adressen bestehen aus acht 16-Bit-Gruppen in Hexadezimalform. Führende Nullen dürfen ausgelassen werden; eine zusammenhängende Folge von Nullgruppen kann mit `::` abgekürzt werden, aber nur einmal. RFC 5952 empfiehlt eine kanonische Textform, damit Logs, IPAM, Suchfunktionen und Audits nicht dieselbe Adresse als mehrere Zeichenfolgen behandeln.

```text
expanded:   2001:0db8:0000:0042:0000:0000:0000:0007
canonical:  2001:db8:0:42::7
prefix:     2001:db8:0:42::/64
```

`2001:db8::/32` ist Dokumentationsadressraum und daher für Beispiele geeignet. Er ist keine reale Produktionszuteilung.

### Adresstypen und Scope

| Form / Bereich | Zweck | Grenze |
|---|---|---|
| `::/128` | unspecified | zeigt fehlende Adresse, darf nicht als reguläres Ziel/Node-Address verwendet werden. |
| `::1/128` | loopback | nur derselbe Node; nicht über ein physisches Interface. |
| `fe80::/10` | Link-Local Unicast | gilt nur auf einem Link; für Router/ND essenziell, bei mehrdeutigen Interfaces muss der Scope in Tools/Logs erkennbar sein. |
| Global Unicast | global/gerouteter Address Space | globale Form ist kein Freigabesignal; Route, Firewall, DNS, Provider und Service entscheiden. |
| `fc00::/7` | Unique Local Address (ULA) | private, koordinierte Verwendung; nicht als globale Eindeutigkeit oder Sicherheitslabel behandeln. |
| `ff00::/8` | Multicast | ersetzt Broadcast; Scope/Gruppe und Filterregeln sind Control-Plane-relevant. |
| Anycast | syntaktisch aus Unicast-Space | identische Adresse kann mehreren Interfaces zugeordnet sein; Route bestimmt eine nahe Instanz. |
| IANA special purpose | spezifische Reservierungen | vor Nutzung die aktuelle [IANA Registry](https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry.xhtml) prüfen. |

IPv6 hat keine Broadcast-Adressen. Multicast ist kein „Broadcast mit anderer Schreibweise“: Gruppen-, Scope-, Rate- und Securityregeln müssen bewusst modelliert werden. Ein Interface besitzt mindestens eine Link-Local-Adresse; die konkrete Host- und Plattformimplementierung bestimmt zusätzliche Adressen und Lebensdauern.

### SLAAC, RA, DHCPv6 und DAD

Router Advertisements (RA) informieren Hosts über Parameter und Präfixkontext. Stateless Address Autoconfiguration (SLAAC) kann aus einem erlaubten Präfix eine Adresse bilden. Duplicate Address Detection prüft vor regulärer Benutzung einer tentative address auf Konflikte. DHCPv6 kann je nach Zielarchitektur weitere Zuweisungs- oder Konfigurationsaufgaben übernehmen. Keiner dieser Begriffe ist ein Ersatz für die anderen.

| Entscheidung | Gewinn | Risiko / offene Frage |
|---|---|---|
| SLAAC | wenig Hostkonfiguration, standardisierte Autokonfiguration | Lifecycle, Inventory, temporäre Adressen, DNS-/IPAM-Korrelation und RA-Schutz klären. |
| DHCPv6 | zentralere Zuordnung/Optionen in passenden Designs | Client-/Plattformunterstützung und Zusammenspiel mit RA/DNS prüfen. |
| statische IPv6 | kontrollierte Sonderfälle | Drift, HA, Ersatz, Audit und Skalierung müssen tragbar sein. |
| temporäre Adressen | reduziert langfristige Linkability bestimmter Outbound-Flüsse | Asset-/Support- und Logkorrelation auf stärkere Identität stützen. |
| DAD | erkennt lokale Konflikte vor Nutzung | kein Eigentums- oder Sicherheitsbeweis; HA-Ausnahmen brauchen Design. |

**Wichtige Trennung:** RA liefert nicht automatisch alles, was Anwendungen benötigen. DNS, Routen, Firewall, Service-Discovery, Zertifikate und autorisierte Egresspfade bleiben eigenständige Verträge.

### Extension Headers und Path MTU

RFC 8200 definiert einen festen IPv6-Basisheader und eine Kette möglicher Extension Headers. Middleboxes, Firewalls, Load Balancer und Beobachtungssysteme müssen diese Verarbeitung explizit unterstützen; nicht jeder Pfad akzeptiert jede Headerfolge oder Fragmentierung gleich. Deshalb gilt:

- nutze Extension Headers nicht als unsichtbare Transportannahme;
- definiere, welche Header-/Fragmentierungsfälle Produkt und Security unterstützen;
- teste mit realistischen, freigegebenen End-to-End-Probes;
- behandle ICMPv6 Packet Too Big und Path-MTU-Signale als Teil der Erreichbarkeit;
- blockiere ICMPv6 nicht pauschal.

Die konkrete Policy richtet sich nach Protokoll, Datenklasse, Device-Software, Cloud Fabric und Bedrohungsmodell. RFC 9099 beschreibt operative IPv6-Sicherheitsaspekte; sie ersetzt keine Produktvalidierung.

## Architecture und Data Flow

### IPv6-Start eines Workloads

```text
interface activation
  -> link-local address + DAD
  -> listens for / requests Router Advertisement
  -> learns prefix, default-router and applicable parameters
  -> SLAAC and/or DHCPv6 according to policy
  -> DAD for candidate address
  -> DNS/service discovery chooses AAAA/A according to client policy
  -> route selects on-link target or IPv6 router
  -> ND resolves local next hop
  -> ICMPv6, security, PMTU, transport, TLS and application complete the path
```

Jeder Pfeil besitzt einen Owner und eine Fehlerklasse. Ein IPv6-Enabled Interface ohne gültige Route oder RA-Policy ist kein fertiger IPv6-Service. Ein AAAA-Record ohne funktionierenden v6-Egress erzeugt verzögerte oder fehlgeschlagene Kundenerfahrungen, besonders wenn Clients IPv6 bevorzugen oder familienparallele Verbindungsstrategien verwenden.

### Dual Stack als zwei überprüfbare Pfade

```text
service name
  ├─ A     -> IPv4 address -> IPv4 route/ARP/NAT/policy -> service
  └─ AAAA  -> IPv6 address -> IPv6 route/ND/ICMPv6/policy -> service
```

Dual Stack ist nur dann belastbar, wenn beide Pfade alle beabsichtigten Operationen erfüllen. „Der Browser erreicht den Dienst“ genügt nicht: Der Client kann unbemerkt zur anderen Familie wechseln. Teste mindestens wichtige APIs, Authentisierung, Upload/Download, Long-Lived Connections, Error Handling, Monitoring, Egress, Ingress und Recovery pro Familie.

### Transition-Optionen

| Option | Geeignet für | Risiko / Entscheidungskriterium |
|---|---|---|
| Dual Stack | schrittweise Migration mit v4- und v6-fähigen Clients | doppelte Policy-/Observabilityfläche; beide Pfade müssen gleichwertig betrieben werden. |
| IPv6-only Segment + Translation/Gateway | kontrollierte moderne Workloadzonen | Übergangskomponente, DNS-/App-Kompatibilität, Logging/Identity und Failure Domain dokumentieren. |
| IPv4-only fortführen | kurzfristige Legacy-Grenze | verlängert Knappheits-, NAT- und Migrationsschuld; Exit-Datum und Begründung nötig. |
| Proxy/API Boundary | wenige klar definierte Legacy-Beziehungen | zusätzliche Latenz/HA/Ops, aber klare Entkopplung möglich. |

NAT64/DNS64 oder andere Übersetzungen können sinnvoll sein, sind aber keine generische „IPv6 einschalten“-Taste. Ihre Protokollkompatibilität, Fehlerbilder, Security- und Telemetriegrenzen gehören in einen eigenen Architekturentscheid.

## Protocols, Standards, Tools und Technologien

| Bezug | Wofür er dient | Grenze |
|---|---|---|
| [RFC 4291](https://www.rfc-editor.org/rfc/rfc4291) | IPv6 Addressing Architecture, Unicast/Anycast/Multicast/Link-Local. | Updates und konkrete Plattformsemantik beachten. |
| [RFC 5952](https://www.rfc-editor.org/rfc/rfc5952) | kanonische Textdarstellung. | Parser müssen weiterhin legale RFC-4291-Formen akzeptieren. |
| [RFC 8200](https://www.rfc-editor.org/rfc/rfc8200) | IPv6-Paket und Extension Header Kontext. | keine Firewall-/Middlebox-Supportzusage. |
| [RFC 4861](https://www.rfc-editor.org/rfc/rfc4861) | Neighbor Discovery und Router Advertisements. | RA/ND-Security und lokale Policy zusätzlich designen. |
| [RFC 4862](https://www.rfc-editor.org/rfc/rfc4862) | SLAAC und DAD. | IPAM/Identity/Support entstehen nicht automatisch. |
| [RFC 8981](https://www.rfc-editor.org/rfc/rfc8981) | Temporary Address Extensions/Privacy. | Address rotation ist kein Ersatz für Zugriffskontrolle. |
| [RFC 9099](https://www.rfc-editor.org/rfc/rfc9099) | operative IPv6-Sicherheitsüberlegungen. | konkrete Hardening- und Change-Tests bleiben erforderlich. |
| [IANA IPv6 Registry](https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry.xhtml) | aktuelle special-purpose Zuweisungen. | zeitabhängig; nicht aus alten Tabellen übernehmen. |
| `ip -6`, `ip -6 route`, `ip -6 neigh`, Logs/Flow Telemetry | beobachtender Host- und Pfadkontext. | nur autorisiert, scopebewusst und ohne vorschnelle State-Änderung verwenden. |

## Konfiguration und Implementation

### IPv6-Connectivityvertrag

```yaml
service_class: internet-api
address_families: [ipv4, ipv6]
ipv6_prefix_source: delegated-and-recorded-in-ipam
addressing_mode: slaac-or-platform-managed
ra_policy: authorized-router-only
dns_policy: A-and-AAAA-with-family-specific-health-evidence
ingress_policy: explicit-v6-listener-and-firewall-rules
egress_policy: explicit-v6-destination-classes
icmpv6_policy: protocol-aware, not blanket-deny
observability: family-labelled-route-nd-pmtu-security-application-events
identity: workload-identity-and-mtls
rollback: documented, tested, owner-approved
```

Das ist ein Entwurfsschema, keine Konfigurationsdatei. Es zwingt die Entscheidungen sichtbar zu machen: ein v6-Präfix ohne Owner, ein AAAA-Record ohne Family-SLO oder ein IPv6-Listener ohne Policy sind unvollständige Implementierungen.

### Security Policy für ICMPv6 und RA

Eine Firewallregel „deny all ICMPv6“ ist gefährlich, weil sie Neighbor Discovery und Path-MTU-Signale beeinträchtigen kann. Eine gute Policy ist restriktiv **und** protokollbewusst:

1. Definiere zugelassene ICMPv6-Typen, Richtung, Link-/Zone-Scope und Rate Limits.
2. Beschränke RA-Quellen auf autorisierte Router und dokumentiere Ausnahmen.
3. Prüfe ND-/RA-Guard-Mechanismen der konkreten Fabric auf HA, Virtualisierung, Overlays und Telemetrie.
4. Korreliere verworfene Control-Plane-Pakete mit konkreter Servicewirkung.
5. Ermögliche nur freigegebene, datensparsame Diagnose; kein pauschaler Capture als Standard.

### DNS und Address-Family-Policy

- AAAA-Records nur veröffentlichen, wenn der IPv6-Pfad inklusive Security, TLS, Application und Monitoring die SLO-Anforderungen erfüllt.
- A- und AAAA-Health dürfen nicht nur denselben Load Balancer als indirekte Annahme prüfen; sie müssen family-spezifische Pfade beobachten.
- Vermeide IP-Literale in Anwendungscode; sie erschweren Dual Stack und Renumbering.
- Proxies, service meshes und egress gateways müssen den v6-Ingress und v6-Egress ausdrücklich dokumentieren.
- Service- und Clientteams benötigen ein gemeinsames Verhalten bei unterschiedlichen A-/AAAA-Ergebnissen, Timeouts und Rückfällen.

## Scalability und Performance

IPv6 beseitigt nicht die Notwendigkeit von Kapazitätsplanung. Relevante Grenzen sind Präfixdelegation, RA-/ND-Control-Plane, Neighbor/FIB/TCAM-Kapazität, Firewall-/Load-Balancer-Parsing, DNS-/Telemetry-Dimensionierung, CNI-/Cloud-Quoten und Supportfähigkeit.

| Signal | Aussage | Begrenzung |
|---|---|---|
| Anzahl Prefixes/Interfaces pro Zone | Adress- und Routingkomplexität | sagt nichts über gültige Security-/Servicepfade. |
| RA-/ND-/DAD-Rate | Startwellen, Churn oder Control-Plane-Anomalie | braucht Baseline und Change-Korrelation. |
| v6-/v4-Erfolgsrate je Operation | Family-Parität und Kundenwirkung | Aggregation kann einzelne Regionen/Clients verstecken. |
| PMTU-/Packet-Too-Big-Events | Pfad-/Encapsulation-/Firewall-Hinweis | kein alleiniger Beweis für Client- oder Serverfehler. |
| AAAA-zu-v6-Verbindungsanteil | tatsächliche Nutzung | Fallback kann fehlerhafte v6-Erfahrung kaschieren. |
| Address-/Prefix-Lifecycle Drift | IPAM-/Platform-Integration | temporäre Adressen erfordern Zeit- und Identitätskontext. |

Plane besonders für Wiederanlauf: Viele Nodes können gleichzeitig RA, DAD, DNS und Downstream-Verbindungen auslösen. Drossele Deployments, prüfe Limits und beobachte die Control Plane, statt nur Adressraum als „unendlich“ zu behandeln.

## Reliability und Failure Modes

| Fehlerbild | Mögliche Ursache | Evidenz und nächste Hypothese |
|---|---|---|
| Host hat `fe80::`, aber keine globale Verbindung | kein passendes RA/Prefix/default router, Policy oder Route | Interface-/RA-/Route-/Scope- und Ownerkontext prüfen. |
| AAAA existiert, Client scheitert/spät | IPv6-Ingress/Egress, firewall, PMTU, TLS oder Service nur v4-gesund | v6-spezifischen Pfad messen, nicht Erfolg über A-Record ableiten. |
| DAD schlägt fehl | echter Konflikt, HA-/VIP-Design oder böswillige/fehlerhafte ND-Antwort | IPAM, Change, Link-/Securityereignis und Clusterintent korrelieren. |
| Nur bestimmte Zone ist betroffen | Prefix, RA-Quelle, route table, CNI/overlay, firewall oder provider edge | familien- und zonenspezifische Architekturkarte vergleichen. |
| Große Payload hängt, kleine Antwort klappt | PMTU/Encapsulation/ICMPv6-Filter/Fragmentierung | Path- und Securitypolicy prüfen; keine pauschale Fragmentierung erzwingen. |
| Logs können Workload nicht zuordnen | temporäre Adresse, fehlende IPAM-/identity-Korrelation | Zeitfenster, Workload-ID, Interface/zone und privacy policy verbinden. |
| v4 funktioniert, v6 nicht | unvollständiger Dual Stack | als echte Produktionslücke behandeln, nicht als akzeptablen Fallback. |

### Sicherer Triageablauf

```text
1. Welche konkrete Operation und welche Address Family war betroffen?
2. Welche Adresse/AAAA, Route, Interface und v6 next hop wurden gewählt?
3. Waren RA, DAD, ND und Prefix-Lifecycle für diesen Scope erwartbar?
4. Welche ICMPv6-/Firewall-/PMTU-/TLS-/App-Ereignisse korrelieren?
5. Ist IPv4-Erfolg nur Fallback oder eine separate Vergleichsevidenz?
6. Welche minimal-invasive, autorisierte Messung kann die Hypothese widerlegen?
7. Welche Owner können eine reversible Änderung an RA, Prefix, policy oder service path freigeben?
```

## Security, Governance und Compliance

IPv6 vergrößert die Adressmenge, nicht die Vertrauensmenge. „Nicht scannbar“ ist kein Security-Design. Angriffe und Fehler nutzen Discovery, kompromittierte Endpunkte, falsche Router Advertisements, ND-Manipulation, Policy-Lücken, fehlende Logs, Proxy-/NAT-Grenzen oder App-Schwachstellen.

Mindestkontrollen:

- autoritative IPv6-IPAM-/Prefix-Delegation und eindeutige Owner;
- RA-/ND- und ICMPv6-Policy mit getesteten Guard-/HA-Ausnahmen;
- gleichwertige Firewall, Egress, DDoS-/Edge, TLS, Logging und Incident-Prozesse für v4 und v6;
- Workload Identity und mTLS statt IP-/MAC-Identität;
- Datensparsame Korrelation temporärer Adressen mit berechtigten Incident- und Supportworkflows;
- Threat Modeling für Extension Headers, Fragmentation, Tunnel/Translation und Dual-Stack-Downgrade/Fallback;
- regelmäßige externe und interne Exposure-Reviews pro Address Family.

Governance muss auch Lieferanten abdecken: CNI, Kubernetes, Cloud VPC/VNet, Load Balancer, Firewall, Observability-Agent und Managed-DNS können IPv6 unterschiedlich unterstützen. „IPv6 supported“ ist ohne Version, Funktionsumfang, Limits, SLA und Beobachtbarkeit keine freigabefähige Aussage.

## Observability und Troubleshooting

Ein IPv6-taugliches Ereignisschema enthält mindestens:

```text
timestamp, workload/service identity, environment/zone,
address family, canonical source/destination representation,
prefix and IPAM owner, interface/VRF/namespace,
route and next-hop class, RA/ND/DAD/PMTU signal,
DNS answer family, security policy decision,
translation/proxy context, TLS/application result, change id
```

| Beobachtung | Stützt | Beweist nicht |
|---|---|---|
| Link-local Adresse vorhanden | v6-Stack-/Interface-Grundzustand | globales Routing oder Service-Erreichbarkeit. |
| RA empfangen | Control-Plane-Aktivität | Legitimität, vollständige DNS-/Policy-/Servicekonfiguration. |
| DAD erfolgreich | kein beobachteter lokaler Konflikt im Verfahren | globale Eindeutigkeit oder Autorisierung. |
| AAAA-Record | Namensauflösung zu einer v6-Adresse | Route, PMTU, Firewall, TLS oder App-Gesundheit. |
| IPv6 HTTP-Erfolg | diese Operation im v6-Pfad gelang | v4/v6-Parität über andere Zonen, Clients oder Payloadgrößen. |
| ICMPv6 drop | Policy-/Pfadhinweis | dass jede ICMPv6-Nachricht unzulässig ist. |

## Cost und FinOps

IPv6 kann Abhängigkeit von knappen öffentlichen IPv4-Adressen und manche Translation-/NAT-Grenzen reduzieren, erzeugt jedoch Einführungs- und Betriebsaufwand: IPAM/DDI, Firewall-/Edge-Fähigkeit, Load Balancing, Logs, Tests, Support, Schulung, Provider-/SaaS-Integration und übergangsweise Dual-Stack-Komplexität.

Bewerte Kosten als Portfolio:

- Produkt- und Marktanforderungen für IPv6-Erreichbarkeit;
- laufende öffentliche IPv4-, NAT-, Egress- und Translationkosten;
- Kosten einer verzögerten Integration von Cloud, Partnern oder M&A;
- Test-/Observability-/Incident-Aufwand für zwei Familien;
- technische Schuld durch IP-Literale und nicht v6-fähige Komponenten;
- Migrationsrisiko und Nutzen eines schrittweisen Rollouts.

Preise, Quoten, Funktionsumfang und Providerverträge ändern sich. Sie werden zum Entscheidungszeitpunkt für die konkrete Region, Plattform und Last überprüft.

## Trade-offs und Anti-Patterns

| Entscheidung | Gewinn | Risiko | Leitplanke |
|---|---|---|---|
| Dual Stack | pragmatische Migration | doppelte Betriebsfläche und versteckte Fallbacks | SLO, Tests und Telemetrie je Familie. |
| IPv6-only Zielzone | reduziert v4-Schuld in neuen Plattformen | Übergang zu v4-Legacy braucht explizite Lösung | nur mit Produkt-/Provider-/Security-Nachweis. |
| ULA | private interne Koordination | Overlap und falsches Sicherheitsgefühl möglich | IPAM, Integrationsscope und Exit planen. |
| Temporäre Adressen | Privacy-Vorteil | Asset-/Support-Korrelation schwieriger | Identity und zeitgebundene Telemetrie stärken. |
| ICMPv6 pauschal blockieren | scheinbar einfache Policy | beschädigt ND/PMTU und Diagnose | typ- und scopebasierte Regeln testen. |
| AAAA früh veröffentlichen | schnelle Reichweite | Kunden treffen ungetesteten v6-Pfad | erst bei end-to-end Family-Parität. |

**Anti-Pattern: „IPv6 ist nur eine IP-Adresse mehr.“** RA, ND, DAD, Multicast, Scope, PMTU, Privacy und mehrere Adressen pro Interface ändern Betriebs- und Securityannahmen.

**Anti-Pattern: „IPv4 funktioniert, also ist der Dienst gesund.“** Dual Stack kann v6-Kunden trotzdem schaden. Messen und betreiben Sie die Familien getrennt.

**Anti-Pattern: Link-Local-Adresse als globalen Locator verwenden.** Sie braucht Linkscope und ist keine übergreifend routbare Serviceadresse.

**Anti-Pattern: IPv6 deaktivieren, um eine ungeklärte Policy-Lücke zu kaschieren.** Ursachen, Anforderungen und Übergangsplan müssen sichtbar bleiben.

## Staff-, Principal- und Chief-Level Decisions

### Staff / Principal

1. Lege pro Serviceklasse fest, ob IPv6 Ingress, Egress, DNS, Load Balancing, Observability und Incident-Support gleichwertig sind.
2. Baue ein IPv6 Readiness Gate für Komponenten: Listener, DNS, Firewall, CNI, proxy, TLS, logs, alerting, backup/restore und Runbook.
3. Modellieren Sie RA-/ND-/DAD-Ownership samt Netzsegment, Router, Guard, HA-Ausnahme und Rollback.
4. Teste v4/v6 mit gleichen funktionalen Journeys und variierter Payloadgröße; erfasse Fallback separat.
5. Behandle temporäre Adressen als Privacy-/Lifecycle-Entscheidung, nicht als Inventarfehler.

### Chief

1. Entscheide das IPv6-Zielbild nach Kundenreichweite, Cloud-/Edge-Strategie, Public-v4-Kosten, Lieferantenreife und Legacyprofil.
2. Sorge für eine einheitliche Address-Family-Governance in IPAM, Architecture Review, Security, Procurement, SRE und Produktteams.
3. Priorisiere die Beseitigung von IP-Literalen, v4-only Firewalls/LBs und blindem Fallback als technische Schuld.
4. Messe Outcome: IPv6-End-to-End-Erfolg, Incident-Dauer, Support-Reife, Cloud-/Providerblocker, Kosten und Abdeckung kritischer Flows.
5. Investiere in Plattformtemplates und Training, nicht in eine einmalige „IPv6-Projektphase“ ohne Betriebsmodell.

## Production Checklist

- [ ] Jedes IPv6-Präfix und jede Delegation hat IPAM-Owner, Zweck, Zone, Routingdomäne, Lifecycle und Integrationsscope.
- [ ] Link-Local, Global/ULA, Multicast, Loopback, Dokumentations- und Special-Purpose-Verwendung ist korrekt getrennt.
- [ ] RA-, SLAAC-, DHCPv6-, DAD- und temporäre-Adress-Policy ist pro Segment dokumentiert.
- [ ] RA-Quellen, ND-/ICMPv6-Regeln und Guard-Mechanismen sind für HA, Overlay, Cloud und Fehlerfall getestet.
- [ ] A- und AAAA-Records besitzen family-spezifische Health- und Rollbackkriterien.
- [ ] Ingress und Egress v6 sind an Load Balancer, Firewall, NAT/Translation, Proxy und Workload explizit konfiguriert.
- [ ] PMTU-/ICMPv6-Pfad ist als Teil der Verbindungsfähigkeit getestet; keine pauschale ICMPv6-Blockade existiert.
- [ ] Logs/Traces enthalten kanonische Address Family, Prefix-/Owner-/Scope-Kontext und datensparsame Identity-Korrelation.
- [ ] IPv4-/IPv6-SLOs, Alerts und Incident-Runbooks vergleichen beide Pfade, ohne Fallback zu verschleiern.
- [ ] Extension Header-/Fragmentierungsannahmen sind für alle Middleboxes/Provider getestet und dokumentiert.
- [ ] Provider-, CNI-, Firewall-, LB- und DNS-Support ist versions- und vertragsbezogen bewertet.
- [ ] Übergang, Rollback und Ausstieg aus Legacy-v4-Abhängigkeiten besitzen Owner, Budget und überprüfbare Meilensteine.

## Praktisches Lab: Offline-IPv6-Adress- und Dual-Stack-Modell

**Status:** `reviewed_only`. Das Lab ist als lokale Python-Fallarbeit geplant. Es nutzt Test-/Dokumentationswerte und keine Netzwerkfunktion.

```python
import ipaddress

addresses = [
    "2001:db8:42::7",   # documentation
    "fe80::1",          # link-local
    "fd12:3456:789a::7",# ULA example
    "::1",              # loopback
]

for text in addresses:
    ip = ipaddress.ip_address(text)
    print(text, "->", ip.compressed, "link_local=", ip.is_link_local,
          "loopback=", ip.is_loopback, "multicast=", ip.is_multicast)

paths = {
    "ipv4": {"dns": True, "route": True, "policy": True, "tls": True},
    "ipv6": {"dns": True, "route": True, "policy": False, "tls": None},
}

def family_result(path):
    for stage, result in path.items():
        if result is not True:
            return f"FAIL_AT_{stage.upper()}"
    return "END_TO_END_OK"

print("v4:", family_result(paths["ipv4"]))
print("v6:", family_result(paths["ipv6"]))
```

### Interpretation und Gegenproben

1. Die textuelle Komprimierung ändert nicht den Address Value; Logs/IPAM sollten kanonisch schreiben und robust parsen.
2. `fe80::1` ist Link-Local. Ohne Interface-/Linkscope ist sie kein eindeutiger Service-Locator.
3. Der v4-Erfolg hebt das v6-Policy-Failure nicht auf. Beide Familien werden separat gemessen.
4. Setze im Modell `policy` für IPv6 auf `True` und `tls` auf `False`: Das Ergebnis verschiebt sich zu TLS, ohne dass DNS oder ND dafür verantwortlich werden.
5. Ergänze gedanklich eine `Packet Too Big`-Bedingung: Prüfe PMTU/ICMPv6 als Hypothese, bevor du eine allgemeine Transportstörung behauptest.

### Cleanup

Lösche ausschließlich die temporäre lokale Python-Datei. Es werden keine IPv6-Interfaces, Adressen, RA-/ND-Pakete, DNS-Abfragen, Firewallregeln, Routen, Clouds oder Produktionsressourcen verändert.

## Interviewfragen mit Antworten

### 1. Warum braucht ein IPv6-Interface eine Link-Local-Adresse?

Link-Local-Adressen sind für lokale IPv6-Kommunikation und insbesondere Router-/Neighbor-Discovery-Kontexte zentral. Sie gelten nur auf dem jeweiligen Link. Sie sind kein globaler Service-Locator und erfordern bei mehreren Interfaces einen klaren Scope.

### 2. Ersetzt SLAAC DHCPv6 vollständig?

Nein. SLAAC, RA, DHCPv6, DNS-Information, IPAM, DAD und Hostpolicy bilden gemeinsam den Konfigurations- und Betriebsprozess. Welche Funktionen über welches Verfahren kommen, muss pro Plattform und Zielbild entschieden und getestet werden.

### 3. Woran erkennst du einen echten Dual-Stack-Service?

Er erfüllt die beabsichtigten End-to-End-Operationen über A/IPv4 und AAAA/IPv6 inklusive Ingress, Egress, Security, PMTU, TLS, Anwendung, Telemetrie und Recovery. Ein Browsererfolg oder ein stiller IPv4-Fallback reicht nicht.

### 4. Warum darf ICMPv6 nicht global blockiert werden?

IPv6 benötigt ICMPv6 für unter anderem Neighbor Discovery und Path-MTU-Signale. Eine sichere Policy erlaubt kontrollierte, scope- und typbezogene notwendige Nachrichten und schützt gleichzeitig gegen unzulässige Quellen, Raten und Payloads.

### 5. Sind ULA-Adressen „privat und daher sicher“?

Nein. ULA ist ein Address-Scope für koordinierte private Nutzung. Sicherheit entsteht durch Segmentierung, Router-/Firewall-/RA-Policy, Workload Identity, TLS, Autorisierung und Monitoring. ULA kann ebenfalls überlappen und falsch geroutet werden.

### 6. Welche Risiken haben temporäre IPv6-Adressen?

Sie können langfristige Linkability reduzieren, erschweren aber Asset-Inventar, Support, Incident-Korrelation und manche Regeln, wenn diese nur auf IP beruhen. Verwende zeitgebundene IPAM-/Telemetry-Kontexte und stärkere Workload-Identität.

### 7. Warum sind Extension Headers ein Architekturthema?

Sie beeinflussen, was Endpoints, Firewalls, Load Balancer, Proxies und Observability-Systeme parsen, zulassen oder protokollieren. Unterschiedliche Unterstützung kann zu Sicherheits- oder Erreichbarkeitslücken führen; der erlaubte Umfang muss deshalb getestet und dokumentiert sein.

## Dependencies und Cross-References

| Beziehung | Datei | Verwendung |
|---|---|---|
| Voraussetzung | [KB-0049](01-osi-und-tcp-ip-als-analysemodelle.md) | IP-Schichten und End-to-End-Analyse. |
| Voraussetzung | [KB-0051](03-arp-und-neighbor-discovery.md) | ND, DAD und Next-Hop-Auflösung. |
| Voraussetzung | [KB-0052](04-ipv4-adressierung.md) | Präfix-/IPAM-/Overlap-Grundlagen und Übergangsvergleich. |
| Vertiefung | [KB-0054](06-subnetting-und-cidr.md) | Präfixplanung und Aggregation. |
| Vertiefung | [KB-0055](07-icmp-und-pfadfehler.md) | ICMP, PMTU und Pfadfehler. |
| Vertiefung | [KB-0056](08-tcp-verbindungen-und-ueberlastkontrolle.md) | Transportverhalten über familienbezogene Pfade. |
| Anwendung | [KB-0562](../23-security-identity/26-security-incident-response.md) | IPv6-Securityereignisse, Beweissicherung und Eindämmung. |
| Evidenz | [KB-0720](../30-architect-practice/44-portfolioevidenz-und-reifemodelle.md) | messbare IPv6-Reife, ADRs und Betriebsevidenz. |

## Quellen und zeitliche Einordnung

| Quelle | Verwendung | Stand |
|---|---|---|
| Dateikatalog KB-0053 | verbindlicher Scope und Reihenfolge. | Planstand 2026-09-14 |
| [RFC 4291](https://www.rfc-editor.org/rfc/rfc4291) | IPv6 Addressing Architecture und Address Types. | abgerufen 2026-09-16 |
| [RFC 5952](https://www.rfc-editor.org/rfc/rfc5952) | kanonische IPv6-Textdarstellung. | abgerufen 2026-09-16 |
| [RFC 8200](https://www.rfc-editor.org/rfc/rfc8200) | IPv6-Basisheader und Extension-Header-Kontext. | abgerufen 2026-09-16 |
| [RFC 4861](https://www.rfc-editor.org/rfc/rfc4861) | ND und Router Advertisements. | abgerufen 2026-09-16 |
| [RFC 4862](https://www.rfc-editor.org/rfc/rfc4862) | SLAAC und DAD. | abgerufen 2026-09-16 |
| [RFC 8981](https://www.rfc-editor.org/rfc/rfc8981) | temporäre IPv6-Adressen und Privacy-Erweiterungen. | abgerufen 2026-09-16 |
| [RFC 9099](https://www.rfc-editor.org/rfc/rfc9099) | operative IPv6-Sicherheitsüberlegungen. | abgerufen 2026-09-16 |
| [IANA IPv6 Special-Purpose Registry](https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry.xhtml) | aktuelle Spezialadresszuweisungen. | abgerufen 2026-09-16 |
| [KB-0051](03-arp-und-neighbor-discovery.md) und [KB-0052](04-ipv4-adressierung.md) | kanonische lokale Discovery- und Adressgovernance-Voraussetzungen. | 2026-09-16 |

IETF-Standards, IANA-Zuweisungen, Betriebssysteme, CNI/Fabric-/Cloud-Implementierungen, Firewall-/Load-Balancer-Parser, Providerlimits, Pricing und Compliancevorgaben sind zeit- und umgebungsabhängig. Vor einem Change werden aktuelle Dokumentation, Produktversion, Datenklassifikation, Owner, Supportvertrag, Securitypolicy und Rollback in der Zielumgebung geprüft.

## Bonus: New Tech and Innovations

**Stand 2026-09-16 — IPv6-only-Workloadzonen mit gezielten Übergangsdiensten können die Abhängigkeit von IPv4-Adressknappheit und pauschalem NAT verringern.** **Reifegrad: adaptiert bis etabliert je Provider und Produkt.** Ein Einsatz benötigt nachgewiesene Client-/SaaS-/Observability-/Security-Kompatibilität sowie einen klaren Rückfall- und Supportpfad.

**Stand 2026-09-16 — Moderne CNI-, Cloud- und Edge-Plattformen bieten zunehmend IPv6- und Dual-Stack-Funktionen, unterscheiden sich jedoch erheblich bei Präfixdelegation, Network Policy, Load Balancing, Logging und Quoten.** **Reifegrad: etabliert bis adaptiert je Plattform.** Architekturentscheidungen müssen Features pro Region, Version und Datenpfad verifizieren, nicht nur ein Marketingmerkmal übernehmen.

**Stand 2026-09-16 — Address-family-aware Observability verbindet IPv6-Prefix-/Scope-Kontext mit Workload Identity, PMTU-/ICMPv6-Ereignissen und End-to-End-SLOs.** **Reifegrad: adaptiert.** A pilot accepts a dual-stack service only when IPv6 has explicit ownership, security evidence, family-specific health signals and a tested rollback path.

