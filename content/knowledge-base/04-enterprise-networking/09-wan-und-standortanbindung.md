---
{"id": "KB-0085", "title": "WAN und Standortanbindung", "domain": "04", "sequence": 9, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["ENTERPRISE", "CLOUD", "PLATFORM", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0064", "concepts": ["Routing", "Next Hop"], "needed_for": "both"}, {"id": "KB-0078", "concepts": ["BGP-Policy"], "needed_for": "both"}, {"id": "KB-0079", "concepts": ["VRF", "Isolation"], "needed_for": "both"}, {"id": "KB-0080", "concepts": ["MPLS", "Provider VPN"], "needed_for": "both"}, {"id": "KB-0082", "concepts": ["ECMP", "BFD", "Failure"], "needed_for": "both"}], "related": ["KB-0086", "KB-0087", "KB-0562", "KB-0720"], "applies": ["KB-0086", "KB-0087", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Fiktive Pfad- und SLA-Matrix lokal bewerten.", "rationale": "Keine Provider- oder Netzressourcen nötig."}, "ARCHITECT-TARGET": {"active": true, "scope": "Leitung, Übergabe, Routing, VRF, Verschlüsselung, Failover, SLO und Exit als Vertrag entwerfen.", "rationale": "WAN ist ein Provider- und Servicevertrag."}, "STAFF-TARGET": {"active": true, "scope": "Failover, Pfadasymmetrie, BGP/BFD, Providerübergabe und Service-SLI testen.", "rationale": "Fehler liegen über Organisationsgrenzen."}, "CHIEF-TARGET": {"active": true, "scope": "Carrierdiversität, Budget, Vertrags-/Residenz-/Exitstrategie und Betriebsmodell entscheiden.", "rationale": "WAN-Redundanz ist geschäftskritisch."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "SD-WAN, SASE, QoS, MPLS TE, Internet Exchange und optische Last Mile sind Vertiefungen.", "rationale": "Kern ist der nachweisbare Standortservice."}}, "lab_validation": [{"lab_id": "KB-0085-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Lokale fiktive Pfadmatrix", "evidence": "Gemeinsame Provider- und Trassendependenzen werden sichtbar.", "limitations": "Nicht ausgeführt; keine Leitungen, Provider, Router, Cloud- oder Produktionsressourcen."}]}
---
# WAN und Standortanbindung

> **Ziel:** WAN verbindet Standorte, Datacenter und Cloud über technische und vertragliche Übergaben. Mehr Leitungen erhöhen Verfügbarkeit nur bei nachgewiesener Diversität von Trasse, Gebäude, Provider, PoP, Strom, Routing, Control Plane und Betrieb.

## Zweck, Mental Model und Dependencies

Leitungstypen wie Internet, MPLS-VPN, Ethernet, Mobilfunk oder Cloud-Interconnect sind keine Rangfolge. Sie unterscheiden sich in Latenz, Jitter, Loss, Kapazität, Serviceklassen, Übergabepunkt, Sicherheit, Verfügbarkeit, Vertrag und Exit. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0064](../03-network-foundations/16-routingtabellen-und-weiterleitung.md), [KB-0078](02-bgp-policy-und-route-reflection.md), [KB-0079](03-vrf-und-routing-isolation.md), [KB-0080](04-mpls-und-label-switching.md) und [KB-0082](06-ecmp-und-bfd.md).

~~~text
site LAN/VRF -> CPE/edge -> local access -> carrier/Internet/cloud -> remote edge -> remote VRF/service
                   ^ provider handoff       ^ diverse path claim        ^ return policy
~~~

## Architektur, Datenfluss und Implementierung

Ein Standortvertrag definiert Endpoint-/VRF-/Prefixscope, CPE/Provider-Demarcation, Addressing/BGP-/static policy, NAT/firewall/crypto, QoS, MTU, DNS/identity/shared services, Monitoring, SLA, Change/Incident/Owner und Rückweg. Ein Paket muss an jeder Übergabe den erwarteten Kontext behalten; providerseitige Route oder Link-up-Meldung beweist nicht den Anwendungspfad.

| Entscheidung | Nachweis |
|---|---|
| Primary/secondary path | physische und logische Failure-Domain-Karte |
| Active-active/standby | Routingpolicy, ECMP/hash, stateful middleboxes, failover-SLO |
| Internet/MPLS/overlay | security, latency/loss/jitter, service class, cost, exit |
| Cloud/DCI | provider edge, egress, encryption, routes, identity, data residency |
| Provider handoff | demarc, NID/CPE, test ID, support/escalation, RFO |
| MTU/QoS | packet budget, DSCP policy, queue/drop, end-to-end validation |

Konfiguration kommt aus einem versionierten Serviceintent. Vor Umsetzung sind aktuelle CPE-/NOS-/provider-/cloud- und Firewallfähigkeiten, Defaultwerte, BGP/BFD/VRF/NAT/crypto/QoS-Semantik sowie Vertragsgrenzen zu prüfen.

## Scalability, Performance, Reliability und Security

Plane Kapazität für Standortpeak, Backup, Voice/Video, SaaS, Replikation und Ausfall des stärksten Pfads. Latenz, Jitter und Loss sind Pfad- und Zeitreihenwerte, nicht nur Provider-SLA-Zahlen. Asymmetrie kann Firewall/NAT, TCP/QUIC, Monitoring und Kosten verändern.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Link up, Service down | VRF/BGP/NAT/DNS/firewall/return | End-to-end FEC/flow in beide Richtungen |
| Failover bricht Sessions | stateful edge, rehash, DNS, capacity | BFD/routing/FIB/application timeline |
| beide Leitungen aus | shared trench/PoP/power/provider/config | dependency map und outage drill |
| SaaS langsam | Internet peering, proxy, QoS, MTU, target | path metrics plus app SLI |
| Kosten steigen | egress/commit/burst/routing asymmetry | per-service traffic/cost correlation |

Security umfasst Verschlüsselungsentscheidung, Key-/identity ownership, CPE-Management, BGP/Control-plane-Schutz, VRF/ACL, Logs, Providerzugriff und Privacy. MPLS/Internettransport ist keine automatische Payloadverschlüsselung. Observability korreliert Service/VRF/prefix, CPE, handoff, BGP/BFD, path/loss/jitter, firewall/NAT, remote edge, return path, Change und SLI.

## Trade-offs und Entscheidungen

**Staff** testet Normal-, Last-, MTU-, asymmetrischen und Provider-/CPE-/Pfadausfall. **Principal** standardisiert Site-Blueprints, Carrier-/SLA-Matrix, BGP/VRF/QoS/crypto, Telemetrie, Change und Rollback. **Chief** entscheidet Carrierdiversität, managed versus owned edge, Cloud-/SASE-/MPLS-Rolle, Residenz und Exit.

Anti-Patterns: zwei Leitungen desselben Trench/PoP als divers ausgeben; SLA als End-to-End-SLO interpretieren; aktive Wege ohne Rückweg/state testen; Internet oder MPLS als Verschlüsselung behandeln; Provider-Ticket als Observability ersetzen; Failover ohne Capacity oder Canaries ausrollen.

## Production Checklist

- [ ] Demarcation, Provider, Trasse, PoP, Strom, CPE, Owner und Failure-Diversität geprüft.
- [ ] VRF/prefix/BGP/NAT/firewall/crypto/QoS/MTU und Rückweg pro Service validiert.
- [ ] Failover, capacity, session impact, observability, SLA/escalation, Change und rollback geprobt.
- [ ] Management/RBAC/audit, data classification, cost/egress and exit dokumentiert.

## Interviewfragen

### 1. Sind zwei Provider diverse Pfade?

**Antwort:** Nur, wenn Access, Trasse, PoP, Strom, Carrier-Backbone, CPE und Betriebsabhängigkeiten ausreichend unabhängig nachgewiesen sind.

### 2. Was misst ein WAN-SLO?

**Antwort:** Servicebezogene Verfügbarkeit, Latenz, Jitter, Loss, Failoverbudget, Messpunkt, Ausschlüsse und Eskalation über beide Richtungen.

### 3. Warum reicht Linkstatus nicht?

**Antwort:** Routing, VRF, NAT, Firewall, DNS, MTU, Providerpeering und Rückweg können den Dienst weiterhin unterbrechen.

### 4. Wann ist Active-active riskant?

**Antwort:** Bei asymmetrischen Pfaden, stateful middleboxes, unklarem Hash, ungleicher Capacity oder ungeprüfter Kosten-/Policywirkung.

### 5. Ist MPLS verschlüsselt?

**Antwort:** Nein. Es liefert Transport-/VPN-Semantik, aber keine kryptografische Payloadvertraulichkeit.

### 6. Wie testest du Providerfailover?

**Antwort:** Kontrolliert mit Serviceflow, BGP/BFD/FIB-Timeline, capacity/queue, state/session, remote return path, SLI und dokumentiertem rollback.

## Praktische Labs

~~~python
paths = [{"name":"primary","trench":"a","provider":"p1"},{"name":"backup","trench":"a","provider":"p2"}]
assert len({p["trench"] for p in paths}) == 1
print("Different providers do not prove physical diversity.")
~~~

## Dependencies, Cross-References und Quellen

1. [RFC 4364: BGP/MPLS IP VPNs](https://www.rfc-editor.org/info/rfc4364), abgerufen 2026-09-16.
2. [RFC 5880: BFD](https://datatracker.ietf.org/doc/rfc5880/), abgerufen 2026-09-16.
3. [RFC 2992: ECMP](https://datatracker.ietf.org/doc/html/rfc2992), abgerufen 2026-09-16.

Zeitabhängige Provider-, Cloud-, CPE-, SD-WAN-, SASE-, Hardware-, Vertrags-, Preis- und Sicherheitsangaben vor Beschaffung oder Änderung aktuell prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| SD-WAN/SASE | Anbieter- und Einsatzabhängig | Path policy, identity, security, observability, exit und Cost testen. |
| Cloud Interconnect | established je Provider | Redundanz, egress, routing, encryption und contract boundary prüfen. |
| Intent/streaming telemetry | adopting | Actual-vs-intent, privacy, alarm quality und rollback beweisen. |

Ein Pilot akzeptiert eine WAN-Innovation erst, wenn Leitungs-/Provider-/Trassen-/PoP-/CPE-/Routing-/VRF-/MTU-/QoS-/Crypto-/Failover-/Rückwegsemantik, Failure-Diversität, Service-SLO, Security/Privacy, Observability, Capacity/Cost, Owner, Change und Rollback nachgewiesen sind.
