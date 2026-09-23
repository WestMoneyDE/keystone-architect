---
{"id": "KB-0064", "title": "Routingtabellen und Weiterleitung", "domain": "03", "sequence": 16, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Fehleranalyse", "Zeitachse"], "needed_for": "both"}, {"id": "KB-0052", "concepts": ["IPv4-Adresse", "Default-Gateway", "Subnetz"], "needed_for": "both"}, {"id": "KB-0053", "concepts": ["IPv6-Adresse", "Next Hop", "Dual Stack"], "needed_for": "both"}, {"id": "KB-0054", "concepts": ["CIDR", "Präfix", "Adressaggregation"], "needed_for": "both"}, {"id": "KB-0055", "concepts": ["ICMP", "Time Exceeded", "Destination Unreachable"], "needed_for": "both"}], "related": ["KB-0065", "KB-0066", "KB-0067", "KB-0068", "KB-0562", "KB-0720"], "applies": ["KB-0065", "KB-0066", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Das Lab modelliert Longest Prefix Match, administrative Präferenz, Next-Hop-Wahl und einen fehlenden Rückweg mit lokalen Python-Daten.", "rationale": "Es installiert keine Route und verändert keine Routingtabelle, Schnittstelle, Firewall, Cloud-, Provider- oder Produktionsressource."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein Routingvertrag definiert Präfixownership, Quellen von Routen, Präferenz-/Metrikpolicy, Next-Hop-Auflösung, ECMP, Rückwege, VRF-/Segmentgrenzen, Security, Observability, Change und Rückbau.", "rationale": "Eine Route ist ein kontrollierter Vorschlag für einen Zielpräfixpfad; sie ersetzt keine Securitypolicy oder bestätigte Rückkommunikation."}, "STAFF-TARGET": {"active": true, "scope": "Teams testen RIB-/FIB-Entscheidung, Longest Prefix Match, aktive Route, Next-Hop-/Neighborauflösung, Rückweg, ECMP-Hash, ICMP-Signale und erlaubte/verbotene Flows über relevante VRFs, Regionen und Address Families.", "rationale": "Sie trennen fehlende Route, falsche Präferenz, unresolved next hop, return-path-/stateful-filtering-Problem, MTU/ICMP und Dienstfehler anhand von Pfadevidenz."}, "CHIEF-TARGET": {"active": true, "scope": "Die Organisation steuert Präfix- und AS-/VRF-Ownership, hybride Cloud-/Campus-/Datacenter-Routinggrenzen, Providerdiversität, Sicherheitskontrollen, Route-Leak-Risiken, Kosten und Recovery als Plattformarchitektur.", "rationale": "Ein globaler Default, Route Leak oder unkontrollierter Next-Hop-Wechsel kann breite Regionen oder Datenklassen betreffen; die Entscheidung benötigt Guardrails und beweisbare Rollbacks."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "BGP, OSPF, IS-IS, MPLS/SR, EVPN, VRF, Policy Based Routing, FIB programming, TCAM, ECMP hashing, fast reroute, route reflectors, multicast routing und provider peering sind Spezialistentiefe.", "rationale": "Die Zielrollen müssen Zielbild, Risiko, Sicherheitsgrenzen, Verfügbarkeit und Nachweise entscheiden; detaillierte Protokoll- und Geräteimplementierung ist Netzwerk-Spezialistentiefe."}}, "lab_validation": [{"lab_id": "KB-0064-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox ohne Netzwerkzugriff", "evidence": "Präfixvergleich, Longest Prefix Match, Präferenz, Next Hop und asymmetrischer Rückweg als deterministische Fallarbeit geprüft.", "limitations": "Nicht ausgeführt; keine Route, FIB/RIB, Schnittstelle, Neighbor, Firewall, Cloud-, Provider- oder Produktionsressource wurde abgefragt oder verändert."}]}
---
# Routingtabellen und Weiterleitung

> **Ziel:** Routing entscheidet für jedes Zielpräfix, welche Weiterleitungsregel gelten soll. Die Regel mit dem längsten passenden Präfix gewinnt vor einer weniger spezifischen Route; zwischen gleich spezifischen Kandidaten entscheiden Herkunft, administrative Präferenz und Metrik nach Plattformpolicy. Ein funktionierender Hinweg beweist dennoch keinen Rückweg, keine Firewallfreigabe und keinen erfolgreichen Dienst.

## Purpose, Definition und Scope

Eine Routingtabelle enthält Regeln für Zielpräfixe, Next Hops, Ausgangsinterfaces, Metriken und weitere Attribute. Ein Router oder Host nutzt sie, um einen IP-Frame an einen lokalen Empfänger zu liefern oder an den nächsten Hop weiterzuleiten. RFC 1812 beschreibt Router-Weiterleitung einschließlich Next Hop und administrativer Präferenz; CIDR liefert die Präfixgrundlage.

Dieses Kapitel erklärt Longest Prefix Match, Next Hop, administrative Präferenzen, statische Routen, Control und Data Plane sowie Rückwege. Dynamische Routingprotokolle, BGP und OSPF werden in späteren Artikeln vertieft.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Weiterleitung wählt für ein Ziel die passendste aktive Route und löst deren Next Hop am Ausgangssegment auf. |
| HANDS-ON-TARGET | Offline-Lab bewertet Datenstrukturen, ohne Routen zu installieren. |
| ARCHITECT-TARGET | Präfix, Routequelle, Präferenz, Next Hop, Rückweg, VRF, Security und Rollback bilden einen Vertrag. |
| STAFF/PRINCIPAL | Triage verfolgt die konkrete RIB-/FIB- und Rückwegentscheidung. |
| CHIEF | Routinggrenzen, Providerabhängigkeit, Route-Leaks und Kosten werden als Gesamtarchitektur geführt. |

## Mental Model: Control Plane entscheidet, Data Plane führt aus

```text
route sources: connected | static | dynamic protocol | controller
                   |
                   v
RIB: candidate routes and policy selection
                   |
                   v
FIB: active forwarding entries optimized for lookups
                   |
packet destination -> longest prefix match -> next hop/interface
                   |
neighbor resolution -> L2 frame -> next router or local destination
```

- **Control Plane:** lernt, berechnet, validiert und bevorzugt Routenkandidaten.
- **RIB:** Routing Information Base; logische Kandidaten-/Policy-Sicht.
- **FIB:** Forwarding Information Base; die für schnelle Paketweiterleitung installierte Sicht.
- **Data Plane:** verarbeitet jedes Paket gegen die aktive Forwardingentscheidung.
- **Management Plane:** konfiguriert, beobachtet und autorisiert die anderen Ebenen.

Nicht jedes Produkt trennt diese Strukturen sichtbar gleich, aber die Denkgrenze verhindert Diagnosefehler: Eine Route kann als Kandidat existieren, ohne aktiv in der FIB zu sein; eine aktive Vorwärtsroute kann funktionieren, während Rückweg oder Stateful Firewall den Dienst brechen.

## Prerequisites und Dependencies

| ID | Art | Bedeutung |
|---|---|---|
| [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Verständnis und Lab | Pfadhypothesen und Zeitkorrelation. |
| [KB-0052](04-ipv4-adressierung.md) | Verständnis und Lab | IPv4, Gateway und lokale/entfernte Ziele. |
| [KB-0053](05-ipv6-adressierung-und-uebergang.md) | Verständnis und Lab | IPv6-/Dual-Stack-Next-Hops. |
| [KB-0054](06-subnetting-und-cidr.md) | Verständnis und Lab | Präfixe und Aggregation. |
| [KB-0055](07-icmp-und-pfadfehler.md) | Verständnis und Lab | Route-/TTL-/Unreachable-Signale. |

## Core Concepts

### Longest Prefix Match

Ein Paket zu `10.20.4.55` kann mehrere passende Routen haben:

```text
10.0.0.0/8       via 192.0.2.1
10.20.0.0/16     via 192.0.2.2
10.20.4.0/24     via 192.0.2.3
0.0.0.0/0        via 192.0.2.254
```

Die Route `10.20.4.0/24` gewinnt, weil `/24` der längste passende Präfix ist. Der Default `/0` wird nur genutzt, wenn keine spezifischere Route passt. Dies gilt als Kernprinzip unabhängig davon, ob die Route statisch, connected oder dynamisch stammt.

| Stufe | Auswahlfrage |
|---|---|
| 1 | Enthält der Zielpräfix die Zieladresse? |
| 2 | Welche passende Route hat die größte Präfixlänge? |
| 3 | Bei gleich spezifischen Routen: Welche hat nach lokaler Policy bessere administrative Präferenz? |
| 4 | Bei gleicher Präferenz: Welche Metrik oder ECMP-Regel gewinnt? |
| 5 | Ist der Next Hop auflösbar und das Ausgangsinterface aktiv? |

Administrative Präferenz ist keine universelle Zahl. Geräte und Betriebssysteme benennen und berechnen sie unterschiedlich. Dokumentiere deshalb die absichtliche Reihenfolge der Routequellen statt eine herstellerfremde „Standardzahl“ zu übernehmen.

### Next Hop und rekursive Auflösung

Ein Next Hop ist die nächste Adresse oder ein direkt verbundenes Ausgangsinterface, nicht zwingend das Endziel. Der Router muss den Next Hop über ein lokales Präfix erreichen und anschließend seine L2-Adresse mittels ARP oder Neighbor Discovery auflösen.

```text
destination 203.0.113.9
  route: 203.0.113.0/24 via 10.20.4.1 dev vlan120
  next-hop route: 10.20.4.0/24 directly connected dev vlan120
  ARP/ND: resolve 10.20.4.1 -> L2 destination
  transmit frame on vlan120
```

Ein syntaktisch vorhandener Next Hop ist daher keine funktionsfähige Route. Bei fehlender Neighborauflösung, falschem VLAN, MTU-/L2-Problem oder deaktiviertem Interface bleibt der Paketpfad fehlerhaft.

### Statische, connected und dynamische Routen

| Quelle | Gewinn | Risiko | Leitplanke |
|---|---|---|---|
| connected | direkt aus Interface/Präfix | Interfacefehler beeinflusst Forwarding | Segment-/Interfaceownership. |
| static | klar, deterministisch, wenig Control Plane | Drift, Blackhole, schlechter Failover | Owner, Health-/Tracking, Review und Rückbau. |
| dynamic protocol | Anpassung an Topologie | Policy-/Komplexitäts-/Leak-Risiko | Scope, Authentisierung, Filter und Telemetrie. |
| controller/API | Intent und Automatisierung | Control-plane-Ausfall oder falscher Intent | Validierung, Staging, auditierbare Änderung. |

Statische Routen sind nicht veraltet und dynamische Routen sind nicht automatisch resilient. Entscheidend sind Fehlerdomänen, Präfixownership, Rückweg, Health, Changefrequenz und Nachweis.

## Architecture und Data Flow

### Ein Ende-zu-Ende-Pfad

```text
client -> local default gateway
       -> egress route/FIB decision
       -> next hop and L2 resolution
       -> transit routers select further prefixes
       -> destination subnet / service
return -> destination's routing decision
       -> reverse next hops / firewall state
       -> client
```

Für jede kritische Kommunikation wird mindestens dokumentiert:

- Quelle und Zielpräfix inklusive IPv4/IPv6 und VRF/Segment;
- aktive RIB-/FIB-Route, Herkunft, Präferenz, Metrik und Next Hop;
- L2-/VLAN-/Neighborauflösung am Ausgang;
- Sicherheits-/NAT-/Load-Balancer-/Service-Mittelpfad;
- Rückroute aus Sicht des Zielnetzes;
- ECMP-/Hash- und Failoververhalten;
- Zuständigkeit, Beobachtungsdaten und Rollback.

### Rückwege und asymmetrische Pfade

IP verlangt nicht, dass der Rückweg die Hinroute spiegelt. Asymmetrie kann zulässig sein, insbesondere bei mehreren Standorten, Providern oder ECMP. Probleme entstehen, wenn Stateful Firewalls, NAT, IP-source-validation, Load Balancer, Sessions oder Telemetrie eine bestimmte Rückrichtung voraussetzen.

| Beobachtung | Mögliche Erklärung | Prüfung |
|---|---|---|
| SYN erreicht Ziel, keine Antwort beim Client | fehlende Rückroute oder Rückwegfilter | Ziel-FIB, Rück-Next-Hop, Firewall/NAT state. |
| nur manche Flows scheitern | ECMP-Hash oder einzelner Pfad | Flow-/Hash-/Next-Hop-/Interfacekorrelation. |
| Antwort nutzt andere Adresse | NAT/Load Balancer/Servicepolicy | Translation und Sessionlogs. |
| Route sieht richtig aus, Paket verschwindet | unresolved next hop, MTU, ACL oder blackhole | FIB, neighbor, counters, ICMP, securitylogs. |

## Scalability und Performance

Routing skaliert über Aggregation, effiziente FIB-Lookups, ECMP und klare Fehlerdomänen. Zu viele spezifische Routen können FIB-/TCAM-/Control-Plane-Ressourcen belasten; zu grobe Aggregate können unerwünschte Ziele einschließen oder Incidentcontainment erschweren.

| Kennzahl | Aussage |
|---|---|
| RIB-/FIB-Größe und Installfehler | Kapazität und Policykomplexität. |
| Route churn / convergence time | Stabilität und Recovery nach Änderungen. |
| Next-hop reachability / neighbor failures | tatsächliche Weiterleitbarkeit. |
| ECMP-Verteilung per Flow | Kapazität und Pfadschieflage. |
| Prefix-specific deny/blackhole hits | Sicherheits- und Containmentwirkung. |
| ICMP Unreachable/Time Exceeded | Pfad- und TTL-Anomalien. |
| Return-path/SNAT drops | asymmetrische oder stateful Fehler. |

## Reliability und Failure Modes

| Fehlerbild | Ursacheklasse | Evidenz | Sofortmaßnahme | Dauerhafte Verbesserung |
|---|---|---|---|---|
| Traffic nimmt Default statt spezifischem Pfad | fehlende/zu breite Route | FIB lookup und Präfixvergleich | konkrete Präfixpolicy korrigieren | Routingtests für Ausnahmen/Aggregate. |
| Blackhole nach static change | Next Hop nicht erreichbar | route vorhanden, neighbor/counter fehlerhaft | Change begrenzen/rollback | Tracking, Gesundheits- und Rückwegchecks. |
| Rückantwort fehlt | Rückroute, firewall, NAT | Ziel-/Transit-FIB plus Sessionstate | Rückweg beheben, nicht nur Hinroute ändern | bidirektionale Synthetics und Policyowner. |
| ungewollter Pfad nach route leak | Scope-/Filterfehler | Route source, VRF, prefix ownership | Leak isolieren | Import/export guards und review. |
| intermittierender Flow | ECMP-/member-/MTU-Problem | flow hash, interface counters, PMTU | fehlerhaften Pfad isolieren | ECMP-/MTU-Vertrag pro Pfad. |
| IPv4 gut, IPv6 nicht | getrennte FIB/Next Hop/Policy | family-specific route and neighbor check | Dual-stack Scope korrigieren | IPv4/IPv6 als getrennte Tests. |

## Security, Governance und Compliance

Routen steuern Erreichbarkeit; sie sind daher sicherheitsrelevant, aber keine vollständige Zugriffskontrolle. Ein Route Leak, falscher Default, unkontrollierter Next Hop oder Source-Validation-Fehler kann Daten in falsche Netze lenken oder legitimen Verkehr blockieren.

| Risiko | Kontrolle |
|---|---|
| unerwünschte Präfixweitergabe | Präfixownership, Import-/Exportfilter, VRF-Grenzen, Change-Review. |
| falsche Quelladresse / spoofing | Ingress-/source-validation nach Kontextrisikoprüfung. |
| Routeinjection | Routingprotokollauthentisierung, Peer-/API-Policy und Monitoring. |
| unkontrollierte statische Ausnahme | Owner, Ablaufdatum, Test, Audit und automatischer Rückbau. |
| asymmetrischer Securitybreak | Firewall/NAT-/Load-Balancer und Rückweg gemeinsam modellieren. |
| forensische Lücke | Route source, version, FIB change, next hop und flow result zeitkorreliert erfassen. |

## Observability und Troubleshooting

### Ereignisschema

```text
timestamp, source/destination prefix and VRF, address family,
RIB candidates, active FIB entry, route source, prefix length,
admin preference, metric, next hop, egress interface, neighbor state,
ECMP member/hash, packet/byte/drop counters, ICMP, NAT/firewall result,
return-path evidence, change id and owner
```

### Triage-Reihenfolge

1. Exakte Quell-/Zieladresse, Protokoll, Port, VRF und Address Family festlegen.
2. Einen FIB-Lookup aus Sicht des tatsächlichen Quellknotens durchführen; nicht eine ähnliche Route auf anderem Gerät verwenden.
3. Präfixlänge, Routequelle, Präferenz, Metrik, Next Hop und Ausgangsinterface prüfen.
4. Next-Hop-/Neighborauflösung, Link/VLAN, MTU und Counter belegen.
5. Ziel- und Rückweg-FIB sowie Firewall/NAT/Load-Balancer-Session prüfen.
6. ECMP-/regionale Pfade und v4/v6 getrennt vergleichen.
7. Erst bei belegter Ursache Route, Policy oder Securityzustand minimal ändern und Rückweg mitmessen.

## Cost und FinOps

Routingkosten entstehen durch Gateways, Transit-/Egresspfade, FIB-/Appliancekapazität, Provider, Interregion, Firewall-/NAT-Verarbeitung, Telemetrie und Incidentzeit. Ein „kürzester“ Pfad ist nicht zwingend der günstigste oder zulässige: Datenresidenz, Security, Providervertrag, Rückweg und Servicequalität zählen mit.

FinOps-Reviews verbinden:

- Kosten pro Transit-/Egress-/Interregionpfad;
- Präfixaggregation gegen Sicherheits-/Containmentkosten;
- Redundante Provider-/Next-Hop-Pfade gegen gemessenen Ausfallnutzen;
- Routechurn und Control-Plane-Kapazität;
- Kosten asymmetrischer Rückwege in Stateful Services;
- Rückbau temporärer Routen und verwaister Egressausnahmen.

## Trade-offs und Anti-Patterns

| Entscheidung | Gewinn | Preis | Leitplanke |
|---|---|---|---|
| Default-Route | einfache Abdeckung unbekannter Ziele | großer Auswirkungsradius | spezifische Security-/Servicepräfixe explizit behandeln. |
| spezifische Präfixe | präzise Steuerung | FIB-/Operationskomplexität | aggregieren, wo Ownership und Security es erlauben. |
| statische Route | deterministische Entscheidung | Drift/Falloverrisiko | Health, Owner und expiration. |
| ECMP | Kapazität/Redundanz | Flow-/State-/Debugkomplexität | per-flow Semantik und Mitgliederkonsistenz. |
| asymmetrischer Rückweg | flexible Topologie | Stateful-Systemrisiko | Security/NAT/observability bewusst designen. |
| separate VRFs | Isolation | mehr Policy-/Operationsobjekte | klare Import-/Export- und Ownerregeln. |

Anti-Patterns:

- Eine pingbare Next-Hop-Adresse als Nachweis für den vollständigen Dienstpfad behandeln.
- Longest Prefix Match mit „niedrigster Metrik gewinnt immer“ verwechseln.
- Nur die Hinroute prüfen.
- Statische Routen ohne Owner, Health oder Ablaufdatum belassen.
- IPv4-Erfolg auf IPv6 übertragen.
- Route Leaks mit breitem Default oder unsichtbarem NAT kaschieren.
- Securitypolicy und Routingzustand getrennt ändern, ohne den Gesamtpfad zu testen.

## Staff-, Principal- und Chief-Level Decisions

### Staff / Principal

- Formuliere Route Ownership, Präfixgrenzen, bevorzugte Quellen, ECMP und Rückweg als maschinenprüfbaren Vertrag.
- Baue bidirektionale Synthetics mit v4/v6, VRF, allowed/denied Flow, Next Hop und Serviceproben.
- Begrenze statische Ausnahmen durch Owner, Ablaufdatum, health-aware Verhalten und Review.
- Verknüpfe FIB-/Routechurn, neighbor, ICMP, firewall/NAT und service telemetry in einer Incidentzeitachse.
- Prüfe RIB/FIB-Kapazität, Aggregation und Failure Domains vor großflächigen Plattformmigrationen.

### Chief

- Lege ein hybrides Routingzielbild mit präzisen Grenzen zwischen Campus, Datacenter, Cloud, Partnern und Internet fest.
- Verlange die gemeinsame Ownership von Präfix, Security, Egresskosten und Rückweg zwischen Network, Cloud, Platform und Security.
- Priorisiere Providerdiversität, Data Sovereignty, Recovery und Route-Leak-Containment auf Basis von Serviceklassen.
- Bewerte Controller-/Intent-/Overlayprojekte nach nachweisbarer Sicherheit, Betriebsfähigkeit und Exitfähigkeit, nicht nach Automatisierungsversprechen allein.
- Erhalte eine organisationsweite, auditierbare Präfix- und Egressquelle als strategisches Infrastrukturasset.

## Production Checklist

- [ ] Zielpräfix, VRF, Address Family, Owner und erlaubter Datenfluss sind dokumentiert.
- [ ] Aktive RIB-/FIB-Entscheidung, Präfixlänge, Quelle, Präferenz, Metrik, Next Hop und Interface sind nachvollziehbar.
- [ ] Next Hop ist über aktuelles L2/Neighbor-/Interfaceverhalten erreichbar.
- [ ] Rückweg, NAT, Firewall, Load Balancer und source validation sind für kritische Flows geprüft.
- [ ] v4 und v6 besitzen getrennte, getestete Routing- und Securitypfade.
- [ ] ECMP-/redundante Mitglieder sind konsistent für MTU, VLAN, Security und Telemetrie.
- [ ] Prefiximport/-export, VRF- und Defaultroute-Policy begrenzen Leaks und Blast Radius.
- [ ] Routechurn, FIB-Kapazität, Next-Hop-Fehler, ICMP und Rückwegdrops werden überwacht.
- [ ] Temporäre statische Routen besitzen Owner, Zweck, Ende und geprüften Rollback.
- [ ] Change-Test umfasst erlaubte und verbotene Flows sowie Source-/Destination-/Return-Belege.

## Praktisches Lab: Offline-Modell für LPM, Präferenz und Rückweg

**Ziel:** Das Lab bestimmt eine aktive Vorwärtsroute und zeigt, dass eine Rückroute separat vorhanden sein muss. Es verändert keine Systemroute.

```python
routes = [
    {"prefix": "10.0.0.", "length": 8,  "pref": 100, "next_hop": "192.0.2.1"},
    {"prefix": "10.20.",  "length": 16, "pref": 100, "next_hop": "192.0.2.2"},
    {"prefix": "10.20.4.","length": 24, "pref": 200, "next_hop": "192.0.2.3"},
    {"prefix": "",        "length": 0,  "pref": 50,  "next_hop": "192.0.2.254"},
]

def lookup(address, table):
    matches = [r for r in table if address.startswith(r["prefix"])]
    return sorted(matches, key=lambda r: (r["length"], r["pref"]), reverse=True)[0]

forward = lookup("10.20.4.55", routes)
return_routes = [{"prefix": "198.51.100.", "length": 24, "pref": 100,
                  "next_hop": "10.20.4.254"}]
print({"forward": forward, "return_for_client": lookup("198.51.100.7", return_routes)})
```

**Erwartete Auswertung:**

| Probe | Erwartung | Aussage |
|---|---|---|
| Ziel `10.20.4.55` | `/24` gewinnt | Längeres Präfix schlägt weniger spezifische Kandidaten. |
| mehrere gleiche Präfixe | Präferenz/Metrik entscheidet nach lokaler Policy | Präferenz erst nach Präfixlänge auswerten. |
| Rückroute fehlt | kein vollständiger Dialog | Hinroute beweist keine Antwortzustellung. |
| Defaultroute | nur bei fehlender spezifischerer Route | `/0` nicht als Ersatz für Intent verstehen. |

**Negative Probes:**

1. Entferne die `/24`-Route und erkläre den Wechsel auf `/16`.
2. Setze den Next Hop der Gewinnerroute auf „unresolved“. Beschreibe die Differenz zwischen ausgewählter FIB-Regel und realer Weiterleitbarkeit.
3. Entferne die Rückroute. Begründe einen Fehler bei einer stateful Verbindung, ohne nur die Quellroute zu ändern.
4. Ergänze eine IPv6-Tabelle mit anderem Ergebnis. Zeige, warum v4- und v6-Nachweise getrennt bleiben.

**Cleanup:** Interpreter beenden und temporäre lokale Labdateien entfernen. Keine Route, FIB/RIB, Schnittstelle, Neighbor-, Firewall-, Cloud-, Provider- oder Produktionsressource wurde verwendet oder verändert.

## Interviewfragen mit Antwortkernen

1. **Was ist Longest Prefix Match?**  
   Unter allen Routen, deren Präfix die Zieladresse enthält, gewinnt die spezifischste. Erst danach entscheiden lokale Präferenz-/Metrikregeln.

2. **Was ist der Unterschied zwischen RIB und FIB?**  
   Die RIB enthält Routenkandidaten und Policyentscheidungen; die FIB enthält aktive, für Paketweiterleitung installierte Einträge. Die Umsetzung ist produktspezifisch, die Denkgrenze ist essenziell.

3. **Warum kann eine statische Route problematisch sein?**  
   Sie passt sich nicht selbst an Kontext oder Health an. Ohne Owner, Test, Next-Hop-Validierung und Rückbau kann sie Blackholes oder falsche Pfade verursachen.

4. **Was ist ein Next Hop?**  
   Die nächste Adresse oder das direkt verbundene Interface auf dem Weg zum Ziel. Sie muss selbst über lokalen L2-/Neighborzustand erreichbar sein.

5. **Warum genügt eine erfolgreiche Hinroute nicht?**  
   Die Rückseite benötigt eigene Routing- und Securityentscheidungen. NAT, Firewalls, source validation oder asymmetrische Pfade können Antworten stoppen.

6. **Was ist ein Route Leak?**  
   Ein Präfix überschreitet unbeabsichtigt eine Routing-/VRF-/Policygrenze. Es kann Wege öffnen, umleiten oder große Teile des Netzes beeinflussen.

7. **Welche Evidenz brauchst du vor einer Route-Änderung?**  
   Präfixowner, Routequelle, LPM-/Präferenzwirkung, Next Hop, Rückweg, Firewall/NAT, v4/v6, ECMP, Kosten, Monitoring und Rollback.

8. **Wie debugst du ein nur gelegentlich auftretendes Routingproblem?**  
   Ich korreliere Flow mit ECMP-/Hashmitglied, FIB-/Next-Hop-/Interfacecountern, MTU/ICMP, Rückweg und Securitystate anstatt eine einzige Route pauschal zu ändern.

## Dependencies, Cross-References und Quellen

| Beziehung | Dokument | Nutzung |
|---|---|---|
| Voraussetzung | [KB-0052](04-ipv4-adressierung.md) | IPv4/Gateway. |
| Voraussetzung | [KB-0053](05-ipv6-adressierung-und-uebergang.md) | IPv6-Next-Hops. |
| Voraussetzung | [KB-0054](06-subnetting-und-cidr.md) | Präfixe/Aggregation. |
| Voraussetzung | [KB-0055](07-icmp-und-pfadfehler.md) | ICMP/Pfaddiagnose. |
| Weiterführung | KB-0065 VRF und Routing-Isolation | getrennte Routingdomänen. |
| Weiterführung | KB-0066 VXLAN und Overlay-Netze | Overlay-/Gatewaypfade. |
| Weiterführung | KB-0067 OSPF | dynamische Interior-Routen. |
| Nachweis | KB-0720 Portfolioevidenz und Reifemodelle | Nachweisbarer Routingvertrag. |

Primär- und Implementierungsquellen, abgerufen und inhaltlich geprüft am **2026-09-16**:

- [RFC 1812 – Requirements for IP Version 4 Routers](https://www.rfc-editor.org/rfc/rfc1812)
- [RFC 4632 – Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632)
- [RFC 8200 – IPv6 Specification](https://www.rfc-editor.org/rfc/rfc8200)
- [Linux ip-route(8) – IP routing table management](https://man7.org/linux/man-pages/man8/ip-route.8.html)
- [Linux Kernel – IP Sysctl](https://docs.kernel.org/networking/ip-sysctl.html)

## Bonus: New Tech and Innovations

Intent- und Controller-basierte Routingplattformen können viele Routen aus einem deklarativen Modell ableiten. Sie reduzieren manuelle Drift nur dann, wenn Präfixownership, Change-Validierung, Simulation, Controllerverfügbarkeit und der Rückbau in die Systemarchitektur integriert sind. Ein API-Write allein ist keine sichere Routingentscheidung.

Programmierte FIBs, hardwarebeschleunigtes ECMP und Cloud-Transitdienste erweitern Skalierung und Pfadwahl. Sie machen die tatsächliche Data-Plane-Sicht, Hash- und Providertelemetrie jedoch wichtiger. Ein verteiltes System darf nie voraussetzen, dass „die Route“ ein einzelnes, überall gleich sichtbares Objekt ist.

Ein Pilot akzeptiert eine Routinginnovation erst, wenn LPM-/Präferenzwirkung, Next-Hop-Auflösung, Rückwege, Security, ECMP, v4/v6, Observability, Kosten und Rollback für alle betroffenen Präfixe und Serviceklassen nachgewiesen sind.

