---
{"id": "KB-0080", "title": "MPLS und Label-Switching", "domain": "04", "sequence": 4, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["ENTERPRISE", "CLOUD", "PLATFORM", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0054", "concepts": ["CIDR", "Präfix"], "needed_for": "understanding"}, {"id": "KB-0064", "concepts": ["FIB", "Route", "Next Hop"], "needed_for": "both"}, {"id": "KB-0077", "concepts": ["IGP-Konvergenz", "Underlay"], "needed_for": "understanding"}, {"id": "KB-0078", "concepts": ["BGP-Policy", "Next Hop"], "needed_for": "both"}, {"id": "KB-0079", "concepts": ["VRF", "Routing-Isolation"], "needed_for": "both"}], "related": ["KB-0081", "KB-0082", "KB-0084", "KB-0562", "KB-0720"], "applies": ["KB-0081", "KB-0084", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein lokales, synthetisches FEC-, LFIB- und Label-Stack-Modell nachvollziehen, ohne Router, Interface, Socket, Paket oder Providerdienst zu betreiben.", "rationale": "Es übt die Semantik und Fehleranalyse mit sicherem Modell."}, "ARCHITECT-TARGET": {"active": true, "scope": "Service, Underlay, FEC, LSP, Label-Stack, VPN, PE/P/CE, MTU, TTL, Übergabe, Telemetrie und Rollback als Vertragsgrenzen entwerfen.", "rationale": "MPLS ist ein zusammengesetzter Service- und Transportvertrag."}, "STAFF-TARGET": {"active": true, "scope": "Änderungen über IGP, LDP, BGP, VRF/VPN, Labelprogrammierung, Datenpfad, Konvergenz und SLO hinweg testbar machen.", "rationale": "Teamübergreifende Fehler entstehen an diesen Grenzen."}, "CHIEF-TARGET": {"active": true, "scope": "Providerstrategie, Standort- und Cloudanbindung, Sicherheitsgrenzen, Betriebsmodell, Kosten, Audit und Exit-Option steuern.", "rationale": "Carrierabhängigkeit und Serviceklassen sind Portfolioentscheidungen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "RSVP-TE, Segment Routing MPLS, Traffic Engineering, Fast Reroute, Multicast VPN, pseudowires und herstellerspezifische CLI/HW-Pipelines sind Vertiefungen.", "rationale": "Die Kernkompetenz ist der überprüfbare L3-Transport- und VPNvertrag."}}, "lab_validation": [{"lab_id": "KB-0080-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Lokales, fiktives Python-Tabellenmodell ohne Netzwerkzugriff", "evidence": "Ein Ingress ordnet einer FEC einen Stack zu; ein Transitknoten swappt das oberste Label; ein Egress poppt es.", "limitations": "Nicht ausgeführt; keine Router, Interfaces, Pakete, Labels, LDP-/BGP-/IGP-Sessions, VPNs, Provider-, Cloud-, Netzwerk- oder Produktionsressourcen."}]}
---
# MPLS und Label-Switching

> **Ziel:** MPLS trennt die Zuordnung eines Pakets zu einer Forwarding Equivalence Class (FEC) von der IP-Präfixsuche auf jedem Transitknoten. Ein belastbarer Entwurf beweist jedoch mehr als Label-Swapping: Service- und Transportvertrag, IGP-/LDP-/BGP-Abhängigkeiten, VPN-/VRF-Grenzen, Stack-, MTU- und TTL-Semantik, Fehlerräume, Übergaben und Rückbau müssen zusammenpassen.

## Zweck, Definition und Mental Model

Multiprotocol Label Switching (MPLS) leitet ein Paket entlang eines Label Switched Path (LSP) weiter. Der Ingress ordnet den Datenverkehr einer FEC zu und fügt mindestens ein Label ein. Transitknoten verwenden das obere Stack-Label als Lookup-Schlüssel und können es durch ein anderes Label ersetzen. Der Egress entfernt ein Label und liefert wieder nach dem passenden Kontext aus. RFC 3031 beschreibt diese Architektur; MPLS ersetzt IP nicht, sondern kann IP-Pakete oder andere Payloads über einen Label-Stack transportieren.

~~~text
Kundenroute / Dienstanforderung
        |
        v
CE ---- PE ingress ---- P transit ---- PE egress ---- CE
       FEC -> [transport | service]  [swap]          [pop -> VRF/FIB]
             ^ control plane             ^ data plane       ^ service plane
~~~

Das Denkmodell hat drei getrennt zu prüfende Fragen:

| Frage | Ebene | Beweis |
|---|---|---|
| Welcher Dienst soll erreicht werden? | Service: VPN, VRF, Präfix, SLA, Mandant | FEC, Route Target/Policy, Berechtigung, Rückweg |
| Welcher Transportpfad trägt ihn? | Transport: LSP, IGP, LDP/RSVP/SR, Next Hop | Labelbindung, Stack, MTU, TTL, Konvergenz |
| Wie wird pro Hop weitergeleitet? | Datenebene: LFIB/NHLFE | eingehendes Label, Operation, ausgehendes Label/Interface |

MPLS ist daher keine Chiffrierung, keine vollständige Mandantentrennung und keine automatische Quality-of-Service-Garantie. Ein äußerer Transportlabel kann zum nächsten LSR führen; ein inneres Service- oder VPN-Label kann beim PE den Ziel-VRF bestimmen. Diese Reihenfolge ist ein Vertrag, keine bloße Implementierungsdetails.

## Voraussetzungen und kanonische Grenzen

Lies zuerst [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0054](../03-network-foundations/06-subnetting-und-cidr.md), [KB-0064](../03-network-foundations/16-routingtabellen-und-weiterleitung.md), [KB-0077](01-ospf-und-interne-konvergenz.md), [KB-0078](02-bgp-policy-und-route-reflection.md) und [KB-0079](03-vrf-und-routing-isolation.md).

- IP-Präfix, Longest Prefix Match, FIB und Next Hop sind in KB-0054/KB-0064 kanonisch. Dieses Kapitel erklärt keine allgemeine IP-Weiterleitung erneut.
- IGP-Reichweite und Konvergenz bilden häufig den MPLS-Transportunterbau. LDP kann keine fehlende, stabile IGP-/Next-Hop-Erreichbarkeit heilen.
- BGP verteilt in vielen L3VPN-Entwürfen Kundenrouten und Serviceattribute; LDP kann Transportlabels verteilen. Beide Rollen müssen explizit getrennt geprüft werden.
- VRF isoliert Servicekontexte. MPLS-L3VPN verbindet nicht beliebige VRFs, sondern liefert gemäß kontrollierter Import-/Export- und Labelzuordnung aus.
- Segment Routing, EVPN/VXLAN und Datacenter Fabrics sind spätere Vertiefungen; siehe [KB-0081](05-evpn-und-vxlan-fabrics.md) und [KB-0084](08-datacenter-netzarchitektur.md).

## Kernbegriffe und Paketsemantik

| Begriff | Präzise Bedeutung | Häufige Verwechslung |
|---|---|---|
| FEC | Menge von Paketen, die am Ingress gleich behandelt werden | nicht gleichbedeutend mit einem IP-Präfix |
| LSP | gerichteter Pfad, über den FEC-Pakete per Label weitergeleitet werden | nicht automatisch eine reservierte, exklusive Leitung |
| LSR | Label Switching Router | ein PE ist oft LSR, aber nicht jeder LSR liefert Kundendienste aus |
| LER | Label Edge Router; Ingress/Egress des MPLS-Bereichs | nicht zwingend identisch mit Kundengerät |
| PE/P/CE | Provider Edge, Provider Transit, Customer Edge | Rollen, keine Garantie für Eigentümer oder Sicherheitsniveau |
| ILM | Zuordnung eingehendes Label zu Weiterleitungsoperation | keine vollständige Servicepolicy |
| NHLFE | Next-Hop Label Forwarding Entry; Operation und ausgehender Kontext | nicht nur ein Labelwert |
| LFIB | Label-Forwarding-Tabelle | keine allgemeine Routingtabelle |
| Label Stack | geordnete Menge von Labels, oberstes Label wird zuerst verarbeitet | innere Bedeutung ist Transit nicht unbedingt sichtbar |
| PHP | Penultimate Hop Popping: vorletzter Hop entfernt ein Label | kein Ersatz für Egress-/Servicevalidierung |

Ein klassischer MPLS-Shim-Header enthält Labelwert, Traffic-Class-Feld, Bottom-of-Stack-Bit und TTL. Seine konkrete Interpretation und die kopierbare TTL-/Traffic-Class-Policy müssen für die verwendete Plattform und den Service dokumentiert werden. Werte, Standardverhalten, Pipeline und Headerzugriff sind zeit- und herstellerspezifisch; RFC 3031 ist die Architekturquelle, keine Konfigurationsanleitung für jede Plattform.

### Operationen: push, swap und pop

~~~text
Ingress:
  IP packet for FEC X -> push [outer transport=16000 | inner service=24000]

Transit:
  receive 16000 -> swap outer label to 16017 -> forward
  inner service label remains opaque to this transit role

Penultimate hop:
  receive 16017 -> pop outer label (PHP) -> forward inner label

Egress PE:
  receive 24000 -> pop, select service/VRF context -> IP FIB lookup -> CE
~~~

Dieser Ablauf ist nur ein vereinfachtes Modell. Ein realer Datenpfad hängt von PHP oder explicit null, ECMP-Hash, MTU, TTL-Modell, Entropy Labels, ACL/CoPP, ASIC-/Softwarepipeline, Routing-/Label-Installationsstatus und Serviceart ab. Jede dieser Annahmen gehört in das Change-Design.

## Architektur: Control Plane, Data Plane und Service Plane

### 1. Control Plane

Control Plane erzeugt oder empfängt die Informationen, aus denen LSPs und Labels entstehen. LDP nach RFC 5036 verteilt Labelbindungen für FECs zwischen Peers. LDP-Discovery, Sessionaufbau, Keepalive, Adressierbarkeit, Transportadresse, Authentication/ACL und IGP-Next-Hop-Beziehung müssen als Zusammenhang geprüft werden.

Ein L3VPN-Entwurf kombiniert oft mindestens:

1. IGP für Provider-Underlay und Erreichbarkeit von PE-/Router-IDs;
2. LDP, RSVP-TE oder Segment Routing für Transport-/Pfadlabels;
3. MP-BGP für VPN-/Service-Routen, einschließlich eines Service-/VPN-Labels;
4. VRF- und Import-/Exportpolicy für Kundenkontexte;
5. CE-PE-Routing und eine geprüfte Rückroute.

RFC 4364 beschreibt den BGP/MPLS-IP-VPN-Kontext. Er ist kein Versprechen, dass jeder Provider exakt dieselben Route Targets, PE-/CE-Protokolle, Sicherheitskontrollen, QoS-Klassen oder Betriebsprozesse verwendet.

### 2. Data Plane

Data Plane entscheidet unter Echtzeitdruck. Der Ingress klassifiziert eine FEC, erzeugt den Stack und übergibt an das ausgehende Interface. Ein P-Router braucht häufig nur den äußeren Transportkontext; ein PE-Egress wertet den Dienstkontext aus. Kontrollplane-Erfolg beweist den Datenpfad nicht: Ein Eintrag kann fehlen, ein Stack falsch sein, ein Paket an MTU scheitern, eine ACL blockieren oder der Rückweg abweichen.

### 3. Service Plane

Service Plane übersetzt eine Geschäfts- oder Mandantenanforderung in eine überprüfbare Leistung: Standorte, Präfixe, VRFs, Import/Export, Latenz-/Loss-/Availability-Ziel, Datenklasse, Routingprotokoll, Providerübergabe, Changefenster, Supportmodell, Audit, Kosten und Exit. Der Service Plane gehört einem klar benannten Owner; ohne ihn wird ein Labelproblem zu einem organisationsweiten Incident ohne Entscheidungspfad.

## Konfiguration und Implementierung als Vertrag

Vendor-CLI sollte aus einer freigegebenen, versionsgebundenen Referenzkonfiguration stammen. Die nachfolgende Reihenfolge ist bewusst produktneutral und verhindert, dass eine einzelne Konfigurationszeile als Designnachweis gilt.

| Schritt | Zu definieren | Akzeptanzkriterium |
|---|---|---|
| Dienstaufnahme | CE/PE-Punkte, VRF, Präfixe, Datenklasse, SLO, Owner | eindeutiger Service-ID- und Rückwegvertrag |
| Underlay | Router-ID, Loopback, IGP, ECMP, MTU, Failure Domain | alle benötigten PE/LSR-Next Hops stabil erreichbar |
| Transport | LDP/RSVP/SR-Scope, Peers, Labelbereich, Auth/Filter, TTL/TC | erwartete FECs und LSPs beidseitig nachweisbar |
| Service-Routing | VRF, MP-BGP, Route Target/Policy, CE-PE-Vertrag | nur zugelassene Präfixe importiert/exportiert |
| Forwarding | LFIB, Stack, PHP/explicit-null-Policy, egress VRF/FIB | Ingress-, Transit- und Egresspfad stimmen überein |
| Betrieb | Telemetrie, Alarmgrenzen, Runbook, Wartung, Rollback | Alert, Diagnose und Rückbau in Übung bewiesen |

Eine minimal dokumentierbare Designabsicht kann so aussehen:

~~~yaml
service: retail-eu-001
customer_context: vrf-retail-eu
endpoints:
  - ce: branch-berlin
    prefix: 10.42.0.0/16
  - ce: dc-frankfurt
    prefix: 10.84.0.0/16
transport:
  underlay: igp-reachable-pe-loopbacks
  signalling: ldp
  mtu_contract: documented-end-to-end
security:
  allowed_prefixes: explicit
  control_plane: authenticated-and-filtered
operations:
  owner: network-platform
  rollback: restore-prior-policy-and-label-state
~~~

Das ist keine Konfiguration. Vor einer Implementierung müssen Plattformsyntax, Defaultwerte, Capability/License, Hardwarelimit, Interoperabilität, Providergrenze und Changeprozess aktuell gegen Hersteller- und Vertragsdokumentation geprüft werden.

## Skalierbarkeit, Performance und Kapazität

Skalierung ist mehrdimensional. Präfix- und FEC-Anzahl belasten Control Plane und Speicher; Labels und LFIB-Einträge belasten Hardwaretabellen; zahlreiche VPNs und Route Targets erhöhen Policykomplexität; ECMP-Varianten und Entropy Labels beeinflussen Flussverteilung; MTU-Overhead begrenzt Nutzlast. Ein größeres Labelbudget löst keine langsame Konvergenz, eine fehlende Telemetrie oder ein falsches SLO.

| Treiber | Messgröße | Fehlentscheidung |
|---|---|---|
| Control Plane | LDP-/BGP-Sessionflaps, Label-/Route-Anzahl, CPU/RAM | Routezahl nur mit Portzahl hochrechnen |
| Forwarding | LFIB-/FIB-Auslastung, Drops, TC/Queue, Interfaceutilisierung | ASIC-Grenze der Zielhardware ignorieren |
| Pfad | RTT, Jitter, Loss, MTU, ECMP-Verteilung | nur Durchschnittslatenz überwachen |
| Service | VPN-/VRF-Anzahl, Prefixes je Kunde, Changevolumen | Mandantenzahl ohne Policy-/Auditaufwand planen |
| Betrieb | Alarmvolumen, MTTR, Provider-Ticketzeit, Fehlerrate | Transport als unsichtbare Unterlage behandeln |

Plane Kapazität pro Verkehrsklasse und Failure Mode: Was geschieht bei Link-, LSR-, PE-, IGP-, LDP-, BGP-, Provider- oder Datenzentrumsausfall? Kann der Restpfad die Last tragen? Wird der Dienst degradiert, verworfen oder unzulässig umgeroutet? Die Antwort muss für kritische GenAI-, Plattform- und Enterprise-Workloads in ein Service-SLO überführt werden, ohne unbelegte Erfahrung im Carrierbetrieb zu behaupten.

## Reliability und Failure Modes

| Symptom | Wahrscheinliche Ursachen | Prüfreihenfolge |
|---|---|---|
| LDP-Session fehlt | Discovery, Transportadresse, IGP-Route, ACL/Auth, MTU/Interface | Underlay, Peer/Session, Logging, Control-Plane-Policy |
| Route ist da, Datenpfad scheitert | fehlende Labelbindung/LFIB, falscher Stack, MTU, ACL, Rückweg | FEC, Label/LFIB, Stack, Interface, Flow, Reverse path |
| VPN erreicht falschen Kontext | Import/Export, Route Target, Service-Label, VRF, CE-Route | VRF/Policy, MP-BGP, Egress-Label, FIB, Audit |
| Blackhole nach Konvergenz | IGP und LDP/BGP konvergieren verschieden schnell, stale state | Zeitachse je Control Plane, LFIB, SLO, rollback |
| Unerwartete Latenz oder Loss | ECMP-Hash, Queue/TC, Mikroburst, Restpfad, MTU | Flow-Verteilung, Queue/Drop, Pfadmessung, Capacity |
| Traceroute ist irreführend | TTL-/PHP-/ICMP-/ACL-Semantik | Plattformdokumentation und mehrere Messpunkte vergleichen |
| Nur Teilflows brechen | Hash, PMTU, asymmetrischer Rückweg, Policy/TC | betroffene 5-Tupel, Größe, Klasse, Richtung eingrenzen |

Die schnelle Reaktion auf eine Session-Flap kann Schaden vergrößern. Staff-Level-Runbooks unterscheiden Beobachtung, Containment, diagnosetaugliche Daten, autorisierte Änderung, Servicekommunikation und Rollback. Vorab festgelegte Guardrails verhindern, dass ein globales Label-/Policy-Update während eines unklaren Incidents weitere VPNs trifft.

## Security, Governance und Compliance

MPLS bietet keine inhärente Verschlüsselung und ersetzt keine Anwendungs-, IPsec-/MACsec- oder Transportverschlüsselung. Auch logische VPN-Isolation ersetzt keine korrekte Route-/Policy-/Identityprüfung. Ein Design dokumentiert die Datenklassifikation, zulässige PE-/CE-/Providergrenzen, kryptografische Schutzschichten, Schlüsselhoheit, Logging, Aufbewahrung, Access Review und Incidentprozesse.

| Kontrolle | Ziel | Nachweis |
|---|---|---|
| Prefix-/Route-Policy | nur beauftragte Netze und Defaultpfade zulassen | peer- und VRF-spezifische Policy-Tests |
| Control-Plane-Schutz | Spoofing, unautorisierte Peers und Ressourcenverbrauch begrenzen | Auth, ACL, CoPP, Managementnetz, Review |
| Managementplane | Konfiguration und Geheimnisse schützen | MFA/RBAC, bastion, immutable audit, Backup |
| Datenebene | unzulässige Übergänge erkennen | Flow-/Drop-/Queue-/Interface-Metriken, Sampling nach Bedarf |
| Provider Governance | Verantwortung und Eskalation klären | SLA, Changefenster, RFO, auditierbarer Übergabepunkt |
| Privacy | personenbezogene Flow-/Standortdaten minimieren | Zweck, Retention, Zugriff, Redaktion und Löschpfad |

Eine Provider-VPN-Anbindung ist ein Lieferantenvertrag mit technischen Grenzen. Chief-Level-Entscheidungen umfassen duale Anbindung, Verschlüsselungs-Overlays, Residenz, Exit-/Portabilitätsplan, Kostenmodell, Auditrecht und das Risiko, dass ein gemeinsamer Provider-Fehlerraum mehrere Business Services trifft.

## Observability und Troubleshooting

Beobachtbarkeit benötigt Korrelation entlang der Ebenen, nicht nur ein grünes Interface:

~~~text
Service-ID / VRF / Kundensuffix
  -> CE-PE Route und Policy
  -> MP-BGP route + service label
  -> IGP next hop + LDP transport label
  -> LFIB action + stack
  -> egress interface / counter / queue / drop
  -> PE egress VRF/FIB + CE return path
~~~

Erfasse kontrolliert und datensparsam: Sessionzustand/Timer, IGP-/BGP-/LDP-Events, Route-/Label-/LFIB-Änderungen, Interface/Queue/Drop, MTU/PMTU-Signale, LSP-/synthetische Dienstprüfungen, Configuration Drift, Provider-Tickets und Change-ID. Labelwerte allein sind keine stabilen fachlichen Identitäten: sie können lokal oder nach Rekonvergenz neu vergeben werden. Korrelation braucht daher Service-/VRF-/Prefix-/PE-/Zeit- und Changekontext.

Troubleshooting beginnt mit einer konkreten FEC und Richtung. Frage anschließend: Wo klassifiziert der Ingress? Welcher Stack ist erwartet? Welcher Hop tauscht/popt? Welche Session und Route programmieren den Eintrag? Gibt es egressseitig den richtigen VRF/FIB- und CE-Rückweg? Welche Beobachtung belegt oder widerlegt jede Hypothese? [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) liefert dafür das Hypothese-/Gegenprobe-Vorgehen.

## Kosten, Trade-offs und Anti-Patterns

| Entscheidung | Vorteil | Kosten oder Risiko |
|---|---|---|
| Managed MPLS-VPN | abgestimmte Carrierleistung und SLA | Providerabhängigkeit, Port-/Bandbreiten-/Cross-connect-Kosten |
| eigenes MPLS-Underlay | Kontrolle über Design und Betrieb | Spezialkompetenz, Hardware, 24x7-Operations, Upgrade-Risiko |
| MPLS plus Verschlüsselungs-Overlay | zusätzliche Vertraulichkeit/Schlüsselhoheit | MTU/CPU/Fehlersuche/Overhead |
| LDP-basierter Transport | verbreitetes, einfaches FEC-Labeling | begrenzte explizite Pfadsteuerung ohne weitere Mechanismen |
| TE-/SR-Erweiterung | gezieltere Pfad-/Resilienzoptionen | höhere Modell-, Automations- und Betriebsreife |
| viele Ausnahmen je Kunde | kurzfristige Businessflexibilität | untestbare Policy- und Auditlandschaft |

Anti-Patterns sind: MPLS als Sicherheits- oder Verschlüsselungsversprechen verkaufen; IGP, LDP und BGP als austauschbare Protokolle behandeln; nur Sessionzustand statt Datenpfad testen; Labelnummern als dauerhafte Inventar-ID dokumentieren; PHP-/TTL-/MTU-Semantik voraussetzen; Provider-SLA mit Ende-zu-Ende-Anwendungssicherheit verwechseln; globale Policyänderungen ohne Canary, Zustandsaufnahme und Rückbau ausrollen.

## Staff-, Principal- und Chief-Level-Entscheidungen

**Staff:** Erstellt eine durchgängige Testmatrix pro FEC und SLO: Normalpfad, Link-/LSR-/PE-Ausfall, Control-Plane-Flap, MTU-Grenze, Egress-VRF, Rückweg, Policyverstoß und Provider-Eskalation. Der Staff Engineer erklärt, welche Messung welche Ebene belegt und welche Unsicherheit bleibt.

**Principal:** Standardisiert Serviceaufnahme, Prefix-/RT-/VRF-Policy, Label-/Route-Telemetrie, Change-Templates, Canary-/Rollback und SRE-Handshakes. Er oder sie entscheidet, wann ein gemeinsamer Transportstandard nützlich ist und wann Unterschiede zwischen Datacenter, WAN und Cloud explizite Adapter benötigen.

**Chief:** Entscheidet über Carrier-/Cloud-/Datacenter-Topologie, zentrale versus föderierte Network-Platform-Ownership, Sicherheits- und Verschlüsselungsbaseline, regionales Risiko, kommerzielle Commitments, Resilienzfinanzierung und Providerwechsel. Die Metrik ist nachweisbare Businesskontinuität und nicht die Zahl verteilter Labels.

## Production Checklist

- [ ] Service-ID, Owner, CE/PE-Übergaben, VRFs, Präfixe, Datenklasse, SLO und Rückweg sind freigegeben.
- [ ] IGP-Erreichbarkeit, Router-ID/Loopback, ECMP, MTU und Failure Domains sind gegen den aktuellen Sollzustand geprüft.
- [ ] LDP/RSVP/SR-Mechanismus, Scope, Peers, Security, Label-/FEC- und Timerverhalten sind dokumentiert.
- [ ] MP-BGP-/VRF-/Route-Target-/Prefixpolicy erlaubt nur den beauftragten Dienst.
- [ ] LFIB, erwarteter Stack, PHP/explicit-null, TTL/TC und Egress-FIB sind für repräsentative Flows nachgewiesen.
- [ ] Link-, LSR-, PE-, Control-Plane-, Provider- und Rückwegfehler sind gegen SLO und Capacity getestet.
- [ ] Observability korreliert Service, VRF, Prefix, PE, Session, Label-/Routeevent, Interface und Change.
- [ ] Managementzugriff, Secrets, RBAC, Audit, Datenminimierung und Incident-Eskalation sind geprüft.
- [ ] Kosten, Commitments, Supportgrenzen, Provider-RFO, Exit und Rollback sind fachlich und technisch akzeptiert.

## Interviewfragen

### 1. Warum genügt ein Label-Swapping-Diagramm nicht für einen MPLS-Entwurf?

**Antwort:** Es zeigt nur eine Datenpfadoperation. Der Entwurf muss zusätzlich FEC-Klassifikation, IGP-/LDP-/BGP-Abhängigkeiten, VRF/VPN-Policy, MTU, TTL, Rückweg, Failure Domains, SLO, Security, Ownership und Rollback beweisen.

### 2. Was unterscheidet FEC und IP-Präfix?

**Antwort:** Ein Präfix kann ein Kriterium einer FEC sein. Eine FEC beschreibt die gleiche Weiterleitungsbehandlung am Ingress und kann Serviceklasse, Ziel, VPN- oder weitere Policyattribute umfassen.

### 3. Welche Rollen spielen IGP, LDP und MP-BGP in einem L3VPN-Beispiel?

**Antwort:** Das IGP macht Provider-Next-Hops erreichbar. LDP kann Transportlabels zu diesen FECs verteilen. MP-BGP kann VPN-Routen und Service-/VPN-Labels verteilen. Die genaue Verteilung ist designabhängig und muss getestet werden.

### 4. Was ist Penultimate Hop Popping und welches Risiko entsteht?

**Antwort:** Der vorletzte Hop entfernt ein äußeres Label, damit der Egress weniger Arbeit hat. Diagnose, TTL-/ICMP-Sicht und Egressannahmen können sich dadurch ändern; PHP muss Teil des Testvertrags sein.

### 5. Warum ist MPLS keine Verschlüsselung?

**Antwort:** Labels steuern Forwarding und können logisch voneinander trennen, schützen aber die Payload nicht kryptografisch. Vertraulichkeitsanforderungen benötigen geeignete Verschlüsselung und Schlüssel-/Betriebsprozesse.

### 6. Wie unterscheidest du Control-Plane- von Data-Plane-Fehlern?

**Antwort:** Eine Session oder Route belegt nur Kontrollzustand. Ich prüfe dann FEC, Labelbindung, LFIB/Stack, Interface/MTU/ACL/Queue, Egress-VRF/FIB und den Rückweg mit korrelierten Messpunkten.

### 7. Welches SLO würdest du für eine MPLS-Leistung formulieren?

**Antwort:** Nicht nur Interface-Uptime. Ich formuliere Dienst-/FEC-bezogene Verfügbarkeit, Latenz, Jitter, Loss, Konvergenzbudget, Wartungsfenster, Messmethode, Fehlerausschlüsse, Eskalation und Datenquelle je Übergabe.

## Praktische Labs

### KB-0080-LAB-01: Lokales Label-Stack-Modell

Das Lab modelliert eine FEC und drei Rollen rein im Speicher. Es sendet keine Pakete und konfiguriert keine Netzwerkschnittstelle.

~~~python
fec = "vpn:retail-eu:10.84.0.0/16"
ingress = {fec: ["16000", "24000"]}        # outer transport, inner service
transit = {"16000": ("swap", "16017")}
egress = {"24000": ("pop_to_vrf", "vrf-retail-eu")}

stack = list(ingress[fec])
action, replacement = transit[stack[0]]
assert action == "swap"
stack[0] = replacement
stack.pop(0)                                # PHP in this simplified model
action, target = egress[stack[0]]
assert action == "pop_to_vrf"
print({"fec": fec, "egress_context": target})
~~~

**Erwartung:** Das Ergebnis weist die FEC dem fiktiven Egresskontext zu. **Gegenprobe:** Tausche das innere Label gegen einen unbekannten Wert und beschreibe, warum der Egress keine VRF-Zuordnung beweisen kann. **Grenze:** Das Modell bildet keine Header, TTL, MTU, IGP, LDP, BGP, ECMP, Router oder Providerleistung ab. **Cleanup:** Es entstehen keine Ressourcen.

## Dependencies, Cross-References und Quellen

1. [RFC 3031: Multiprotocol Label Switching Architecture](https://www.rfc-editor.org/info/rfc3031), abgerufen 2026-09-16. FEC, LSP, LSR/LER, Label Stack und Forwardingarchitektur.
2. [RFC 5036: LDP Specification](https://www.rfc-editor.org/info/rfc5036), abgerufen 2026-09-16. LDP-Discovery, Session- und Label-Distribution-Kontext.
3. [RFC 4364: BGP/MPLS IP Virtual Private Networks](https://www.rfc-editor.org/info/rfc4364), abgerufen 2026-09-16. PE/P/CE-, VRF- und L3VPN-Kontext.
4. Curriculum: KB-0080 im Dateikatalog, Stand 2026-09-14. Scope und Einordnung.

Zeitabhängige Aussagen über Router-OS, ASIC-Grenzen, Provider-SLAs, Lizenzierung, Cloud-Anbindung oder IETF-Implementierungsreife müssen vor einem konkreten Design mit der aktuellen Hersteller-, Provider- und Vertragsdokumentation verifiziert werden. Vertiefe anschließend mit [KB-0081](05-evpn-und-vxlan-fabrics.md), [KB-0082](06-ecmp-und-bfd.md), [KB-0084](08-datacenter-netzarchitektur.md), [KB-0562](../23-security-identity/26-security-incident-response.md) und [KB-0720](../30-architect-practice/44-portfolioevidenz-und-reifemodelle.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad am 2026-09-16 | Architekturentscheidung |
|---|---|---|
| Segment Routing MPLS und SR Policy | **Adopting bis established, abhängig von Netz und Anbieter.** Segment-Listen können Pfadsteuerung anders modellieren als LDP. | Migrations-, Interoperabilitäts-, Observability- und Betriebsreife bewerten; nicht nur Control-Plane-Komplexität verschieben. |
| TI-LFA und schnelle Reparaturpfade | **Established in geeigneten Implementierungen.** Sie können lokale Failure-Reaktion verbessern. | Schutzabdeckung, Microloop-Risiko, Kapazität und tatsächliches Konvergenz-SLO messen. |
| Intent-/Streaming-Telemetrie für Transportservices | **Adopting.** Zustandsabgleich und feingranularere Diagnose sind möglich. | Source of truth, Schema, RBAC, Retention, Drift, Alarmqualität und Rollback beweisen. |
| Verschlüsselte WAN-Overlays über MPLS | **Established als Architekturpattern.** MPLS-Transport und Payload-Vertraulichkeit werden getrennt behandelt. | MTU, Schlüsselverwaltung, Performance, Failure-Domain und Providergrenze explizit testen. |

Ein Pilot akzeptiert eine MPLS-Innovation erst, wenn Label-/FEC-/LSP-/Stack-/PHP-/LDP-/BGP-/VPN-Semantik, PE-/P-/CE- und VRF-/Control-/Dataplane-Grenzen, Underlay-/Next-Hop-/MTU-/TTL-Verhalten, Provider-/IP-Übergabe, Failure-/Konvergenz-/Service-SLO, Security/Privacy, Observability, Capacity/Cost, Owner, Change und Rollback nachgewiesen sind.
