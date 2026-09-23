---
{"id": "KB-0079", "title": "VRF und Routing-Isolation", "domain": "04", "sequence": 3, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["ENTERPRISE", "CLOUD", "PLATFORM", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0054", "concepts": ["CIDR", "Präfix"], "needed_for": "both"}, {"id": "KB-0061", "concepts": ["VLAN", "Segmentierung"], "needed_for": "understanding"}, {"id": "KB-0064", "concepts": ["FIB", "Route", "Next Hop"], "needed_for": "both"}, {"id": "KB-0066", "concepts": ["ACL", "Policy"], "needed_for": "both"}, {"id": "KB-0075", "concepts": ["Anfragepfad", "Messpunkte"], "needed_for": "both"}], "related": ["KB-0078", "KB-0080", "KB-0562", "KB-0720"], "applies": ["KB-0080", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Lokales Tabellenmodell für zwei Mandanten und eine explizite Shared-Service-Ausnahme ohne Netzwerkzugriff.", "rationale": "Es übt Isolation ohne Interface, Route, Socket oder Produktion."}, "ARCHITECT-TARGET": {"active": true, "scope": "VRF, Tabellen, Interfacebindung, Shared Services, Route Leak, Firewall, DNS, Observability und Rollback werden als Vertrag entworfen.", "rationale": "Getrennte Tabellen sind nur eine Schicht von Isolation."}, "STAFF-TARGET": {"active": true, "scope": "Teams testen Mandantensicht, Route Leak, Shared Service, DNS, ACL, Rückweg und Datenpfad.", "rationale": "Sie trennen FIB-Isolation von Prozess-, Socket- und Policyisolation."}, "CHIEF-TARGET": {"active": true, "scope": "Die Organisation steuert Mandantentaxonomie, IPAM, Shared-Service-Ausnahmen, Audit, Kosten und Lieferantengrenzen.", "rationale": "Unkontrollierte Leaks verletzen Sicherheit und Mandantentrennung."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "MPLS L3VPN, EVPN, VRF-aware NAT/firewall, namespaces, cloud transit und vendor CLI sind Spezialtiefe.", "rationale": "Kern ist der Isolation-/Ausnahmevertrag."}}, "lab_validation": [{"lab_id": "KB-0079-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Lokales fiktives Routentabellenmodell ohne Netzwerkzugriff", "evidence": "Zwei VRFs teilen keine Routen; nur eine explizite Shared-Service-Route ist zulässig.", "limitations": "Nicht ausgeführt; keine Interfaces, Routen, Sockets, Firewalls, VRFs, Container, Cloud-, Netzwerk- oder Produktionsressourcen."}]}
---
# VRF und Routing-Isolation

> **Ziel:** Eine VRF trennt Routing- und Forwardingkontexte. Sie ist keine vollständige Mandanten- oder Sicherheitsisolation, solange Shared Services, Firewall, DNS, NAT, Prozessbindung und Rückwege nicht explizit kontrolliert werden.

## Zweck, Definition, Mental Model und Dependencies

VRF bedeutet Virtual Routing and Forwarding: getrennte Routinginstanzen können überlappende Adressräume und verschiedene Default Gateways führen. Linux VRF kombiniert ein VRF-Device, eigene FIB-Tabelle und Routing-Regeln; die offizielle Kernel-Dokumentation weist zugleich auf Socket- und Forwarding-Sichtgrenzen hin. RFC 4364 liefert L3VPN-Kontext, ist aber keine Aussage über jede VRF-lite- oder Cloudimplementierung.

~~~text
tenant A interface -> VRF A FIB -> policy -> allowed egress
tenant B interface -> VRF B FIB -> policy -> allowed egress
shared service requires: explicit route + firewall + DNS + identity + reverse path
no implicit table visibility
~~~

Voraussetzungen: [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0054](../03-network-foundations/06-cidr-und-subnetting.md), [KB-0061](../03-network-foundations/13-vlan-und-segmentierung.md), [KB-0064](../03-network-foundations/16-routing-grundlagen.md), [KB-0066](../03-network-foundations/18-acls-und-filtering.md) und [KB-0075](../03-network-foundations/27-netzwerkdiagnose-entlang-des-anfragepfads.md).

## Core Concepts, Architecture und Implementation

| Schicht | Frage | Fehlergrenze |
|---|---|---|
| VRF/FIB | Welche Tabelle wird für Ingress/Egress genutzt? | eine Tabelle schützt keinen Prozess oder NAT automatisch |
| Interface/VRF binding | Welcher Port/VLAN/Tunnel gehört zu welchem Kontext? | falsche Bindung verschiebt verbundene Routen |
| Route leak | Welche Präfixe dürfen in welche Richtung? | Leaks brauchen explizite Rückwege und Policy |
| Shared service | DNS, IdP, Logging, Proxy, NTP, Update? | Service darf nicht zum Transit zwischen Mandanten werden |
| Firewall/NAT | Welche 5-Tupel-/Identität ist erlaubt? | asymmetrische Rückwege und NAT ändern Sicht |
| Application socket | Welche VRF bindet der Dienst? | ungebundene/VRF-aware Sockets können anders selektiert werden |

Linux VRF ist ein konkretes Produktbeispiel: ein VRF-Device ist einer Tabelle zugeordnet; Interfaces werden diesem Kontext zugeordnet. Die Kernel-Dokumentation sagt, dass VRF ab Layer 3 wirkt, höhere Policy-Based-Routing-Regeln vorgehen können und forwarded traffic nicht zwingend über das VRF-Device für tcpdump sichtbar ist. Dies ist keine universelle Semantik für Router, Cloud oder Firewall.

Ein Vertrag definiert VRF-ID/Name, Owner, Tabelle, Interfaces, IPv4/IPv6-Präfixe, Default-/unreachable-Policy, erlaubte Import-/Export- oder Leakpfade, Shared-Service-Endpoint/DNS, Firewall/NAT/Identity, Rückweg, Socket-/Servicebindung, Log-/Metriclabels, Datenklasse, Change, Test und Rollback.

## Scalability, Reliability, Security und Observability

Skalierungstreiber sind Tabellen, Präfixe, Interfaces, Firewall-/NAT-States, Shared-Service-Hubs, DNS-Zonen, Telemetrie und Operations. Ein Shared DNS- oder Proxyservice wird zur Failure Domain; Redundanz und Mandantenberechtigungen bleiben nötig.

| Symptom | Hypothesen | Gegenprobe |
|---|---|---|
| Tenant A erreicht B | Leak, PBR, Firewall/NAT, Shared-Service-Transit | Tabelle, Regeln, ACL, Rückweg, tatsächlichen Flow prüfen |
| Dienst nicht erreichbar | falsche VRF-/Socketbindung, DNS, Route, Rückweg | VRF-spezifische FIB, Servicebind, Logs und Policy |
| Antwort asymmetrisch | different VRF/NAT/default route | beide Richtungen und State prüfen |
| Capture zeigt nichts | forwarded path/Sensorgrenze | VRF-/Interface-/Flowlog-Messpunkt vergleichen |
| überlappende IP kollidiert | falscher VRF/Namespace/Identitykontext | Mandanten-ID, Tabelle und Socketkontext prüfen |

Least privilege verlangt default deny zwischen VRFs, explizite Leaks, getrennte Managementplane, auditierte Changes, VRF-/Tenantlabels für Logs, kurze Retention sensitiver Flows und Security Incident Response für ungewollte Erreichbarkeit. Kosten entstehen durch Netzwerk-/Firewall-/Cloudtransit, Shared-Service-Kapazität, IPAM, Telemetrie, Betriebs- und Incidentaufwand.

## Trade-offs, Entscheidungen und Production Checklist

| Entscheidung | Nutzen | Risiko |
|---|---|---|
| harte VRF-Trennung | klare L3-Failure-/Securitygrenze | Shared Services werden komplizierter |
| expliziter Leak | kontrollierte gemeinsame Funktion | Transit/return-path/Policy-Leak |
| gemeinsamer Proxy/DNS | weniger Betrieb | zentrale Failure-/Datenzugriffsgrenze |
| separate VRF-aware Services | stärkere Isolation | mehr Deployment/Monitoringkosten |

Staff testet Leak-/DNS-/Socket-/Rückwegfälle; Principal standardisiert VRF/IPAM/Shared-Service- und Telemetrieverträge; Chief entscheidet Mandantentaxonomie, Ausnahmen, Kosten und Lieferantengrenzen.

Checklist: Tabellen/Interfaces/Prefixes geprüft; default deny und Leakrichtung bewiesen; Shared Services plus DNS/Identity/Firewall/Rückweg getestet; VRF-aware Socketsemantik geprüft; FIB/Flow/Logs per Tenant korreliert; Capacity, Audit, Owner und Rollback nachgewiesen.

## Interviewfragen

### 1. Ist eine VRF vollständige Sicherheitstrennung?

**Antwort:** Nein. Sie trennt primär L3/FIB; Firewall, NAT, DNS, Socket, Identity, Shared Service und Rückweg sind zusätzliche Grenzen.

### 2. Was ist Route Leaking?

**Antwort:** Explizite Übernahme eines Präfixes zwischen Kontexten. Es braucht Richtung, Policy, Rückroute, Ownership und Ablauf, sonst entsteht Transit oder Leak.

### 3. Warum sind Shared Services schwierig?

**Antwort:** Sie verbinden Sicherheitszonen. DNS, Proxy, IdP oder Logging brauchen explizite Client-/Serviceberechtigung und dürfen keine allgemeine Transitbrücke werden.

### 4. Wie prüfst du einen VRF-Fehler?

**Antwort:** Kontext/Interface, FIB, Rule/PBR, Firewall/NAT, Socketbindung, DNS, Rückweg und Flow an beiden Grenzen messen.

### 5. Was sagt die Linux-VRF-Dokumentation über Capture?

**Antwort:** Sie beschreibt konkrete VRF-Device-Sicht und die Grenze, dass forwarded traffic nicht zwingend über das Device sichtbar ist; Messpunkt begrenzen.

### 6. Wie begrenzt man überlappende Adressen?

**Antwort:** VRF-/Tenantkontext bei FIB, Firewall, NAT, DNS, Logs, Traces und Anwendung konsequent führen.

## Praktische Labs

### KB-0079-LAB-01: Fiktiver Leakvertrag

~~~python
vrf_a = {"10.10.0.0/16", "shared:10.100.0.10/32"}
vrf_b = {"10.20.0.0/16", "shared:10.100.0.10/32"}
assert "10.20.0.0/16" not in vrf_a
print("Only shared service is explicitly reachable; reverse policy still required.")
~~~

**Gegenprobe:** Füge B-Präfix zu A ein und erkläre den zusätzlich nötigen Firewall-, Rückweg- und Auditvertrag. **Cleanup:** Keine Ressourcen entstehen.

## Dependencies, Cross-References und Quellen

1. [Linux Kernel: Virtual Routing and Forwarding](https://www.kernel.org/doc/html/latest/networking/vrf.html), abgerufen 2026-09-16. VRF-lite, Tabelle, Interface-/Socket-/Capturegrenzen.
2. [RFC 4364: BGP/MPLS IP VPNs](https://www.rfc-editor.org/info/rfc4364), abgerufen 2026-09-16. L3VPN-Kontext.
3. [RFC 8299: YANG Data Model for L3VPN Service Delivery](https://www.rfc-editor.org/info/rfc8299), abgerufen 2026-09-16. Service-/Modellkontext.
4. Weiterführung: KB-0080, KB-0562 und KB-0720.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| VRF-aware Linux services | **Established.** VRF-/Socketkontext unterstützt Mandantentrennung. | Socket-/sysctl-/Policysemantik und Capturegrenzen konkret testen. |
| Cloud Transit/Network Virtualization | **Adopting / established je Plattform.** Vereinheitlicht virtuelle Routingdomänen. | Providerlimits, Routepropagation, Firewall, Kosten und Exitplan prüfen. |
| Intent-/YANG-basierte L3VPN-Services | **Adopting.** Standardisierbarere Serviceverträge. | Actual-vs-Intent, Policyreview, APIsecurity und Rollback nachweisen. |

Ein Pilot akzeptiert eine VRF-Innovation erst, wenn Tabellen-/Interface-/Prefix-/Leak-/Shared-Service-/DNS-/Firewall-/NAT-/Socket-/Rückwegsemantik, Mandantenisolation, Observability, Security/Privacy, Capacity/Cost, Owner, Change und Rollback nachgewiesen sind.
