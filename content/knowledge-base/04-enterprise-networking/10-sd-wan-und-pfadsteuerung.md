---
{"id": "KB-0086", "title": "SD-WAN und Pfadsteuerung", "domain": "04", "sequence": 10, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["ENTERPRISE", "CLOUD", "PLATFORM", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0064", "concepts": ["Routing", "FIB"], "needed_for": "both"}, {"id": "KB-0078", "concepts": ["BGP-Policy"], "needed_for": "both"}, {"id": "KB-0082", "concepts": ["ECMP", "BFD", "SLO"], "needed_for": "both"}, {"id": "KB-0085", "concepts": ["WAN", "Provider", "Failover"], "needed_for": "both"}], "related": ["KB-0087", "KB-0088", "KB-0562", "KB-0720"], "applies": ["KB-0087", "KB-0088", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Lokale Policy-/Pfadmatrix ohne Tunnel oder Controller prüfen.", "rationale": "Nur fiktive Daten."}, "ARCHITECT-TARGET": {"active": true, "scope": "Underlay, Overlay, Controller, Policy, lokale Ausleitung, Identity, Security, SLO und Exit entwerfen.", "rationale": "SD-WAN verschiebt Verantwortung, beseitigt sie nicht."}, "STAFF-TARGET": {"active": true, "scope": "Policy-/Pfad-/Failover-/SLO- und Control-Plane-Tests organisieren.", "rationale": "Controller und Sitegrenzen erzeugen neue Fehlerpfade."}, "CHIEF-TARGET": {"active": true, "scope": "Vendor-/Cloud-/SASE-/Carrierstrategie, Datenresidenz, Kosten, Betrieb und Exit entscheiden.", "rationale": "SD-WAN ist ein langfristiges Plattformmodell."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "SASE, SSE, service chaining, ZTP, app classification und vendor-specific fabric sind Vertiefungen.", "rationale": "Kern ist der belegte Standortservice."}}, "lab_validation": [{"lab_id": "KB-0086-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Lokale fiktive Policy-Matrix", "evidence": "Kritische und Standardflüsse erhalten explizite Path- und Fallbackregeln.", "limitations": "Keine Controller, Tunnel, Provider oder Produktion."}]}
---
# SD-WAN und Pfadsteuerung

> **Ziel:** SD-WAN verbindet einen oder mehrere Underlaypfade mit einem kontrollierten Overlay, zentral verteilter Policy und anwendungsbezogener Pfadwahl. Es verbessert nur dann den Standortservice, wenn Controller, Tunnel, lokale Ausleitung, Security, Messung, Provider- und Vendorgrenzen nachweisbar sind.

## Zweck, Mental Model und Dependencies

SD-WAN besteht typischerweise aus Branch Edges, Underlay-Transporten, verschlüsselten Overlays, einer Management-/Control-Plane und einer Policy-/Analytics-Ebene. Ein Controller kann Intent verteilen; er beweist weder den Data Plane noch die Zielanwendung. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0064](../03-network-foundations/16-routingtabellen-und-weiterleitung.md), [KB-0078](02-bgp-policy-und-route-reflection.md), [KB-0082](06-ecmp-und-bfd.md) und [KB-0085](09-wan-und-standortanbindung.md).

~~~text
application/identity -> branch policy -> overlay tunnel -> selected underlay/path -> remote edge/SaaS
                       ^ controller intent       ^ loss/jitter/latency     ^ return/security
~~~

## Architektur, Data Flow und Implementierung

| Ebene | Vertrag | Gegenprobe |
|---|---|---|
| Underlay | Internet/MPLS/LTE/Interconnect, demarc, MTU, capacity | path erreichbar ohne Overlay? |
| Overlay | tunnel endpoint, crypto, route/VRF, segmentation | correct tenant and reverse path? |
| Control | controller, certificates, HA, policy propagation | control loss, stale policy, recovery? |
| Data policy | app class, path SLA, steering/fallback/local breakout | actual flow vs desired policy? |
| Security | identity, firewall/SSE/SASE, logs, key/secret lifecycle | least privilege and egress? |
| Operations | SoT, ZTP, drift, alert, provider/vendor escalation | canary/change/rollback? |

Lokale Ausleitung kann Latenz und Backhaul senken, erweitert aber Sicherheits-, DNS-, Identity-, Egress- und Compliancegrenzen. Path Steering wählt anhand konfigurierter Messungen; kleine Intervalle oder Klassifikationsfehler können Flapping, Reordering, stateful Firewallprobleme und Kosten erzeugen. Vor Umsetzung müssen Plattformversion, App-Erkennung, Tunnel-/crypto-/MTU-Semantik, Controller-HA, API/RBAC, Lizenz, SLA und Providergrenzen aktuell geprüft werden.

## Scalability, Reliability, Security und Observability

Skalierungstreiber sind Sites, Tunnels, Controller-/Analyticscapacity, Zertifikate, Policyobjekte, Flows, lokale Egresspunkte und Telemetrie. Reliability prüft Link-, CPE-, Tunnel-, Controller-, DNS/Identity-, SaaS-, Policy- und Providerfehler getrennt. Ein Controllerausfall kann neue Policies verhindern, muss aber nicht zwingend bestehende Datenflüsse brechen; das konkrete Verhalten ist Anbieter- und Konfigurationsabhängig.

| Symptom | Hypothese | Messung |
|---|---|---|
| Policy sichtbar, App fehlerhaft | classification, MTU, security, return, SaaS | flow path, tunnel, edge, app SLI |
| Path switching flaps | SLA threshold, jitter, loss, BFD, controller update | timeline path/SLI/queue/change |
| local breakout unsicher | DNS/identity/firewall/egress policy | resolution, auth, allow/deny, audit |
| Standort offline | power/CPE/underlay/cert/control | physical, tunnel, control, data paths |
| Kosten steigen | local egress, cloud/SaaS path, license | service-flow/cost correlation |

Security verlangt mTLS/PKI- und Secret-Lifecycle nach Produktfähigkeit, RBAC, getrennte Managementplane, Segment-/VRF-/Identitypolicy, datensparsame Logs und klare Vendor-/Providerzugriffe. NIST SP 800-207 erinnert daran, dass Netzposition allein kein Vertrauen gibt.

## Trade-offs, Entscheidungen und Production Checklist

**Staff** validiert App-/Path-/Fallback-/local-breakout-/return- und Control-Loss-Fälle. **Principal** standardisiert Site-/Policy-/certificate-/telemetry-/rolloutmodelle. **Chief** entscheidet Vendorbindung, Carrier-/SASE-/Cloudstrategie, Residenz, Kosten und Exit.

Anti-Patterns: Controllerstatus als Anwendungsnachweis; alle Apps anhand unscharfer Signaturen steuern; Local Breakout ohne Security/DNS/Identity; SD-WAN als Ersatz für Carrierdiversität oder Verschlüsselungsdesign; globale Policy ohne Canary/Rollback.

- [ ] Underlaydiversität, demarc, MTU, capacity und provider SLA geprüft.
- [ ] Overlay/tunnel/VRF/routing/crypto, app policy, fallback, local breakout und return path nachgewiesen.
- [ ] Controller/PKI/RBAC/HA/drift, SLO/telemetry, cost, incident/escalation, canary/rollback getestet.

## Interviewfragen

### 1. Was unterscheidet Underlay und SD-WAN Overlay?

**Antwort:** Underlay liefert Transport; Overlay kapselt und steuert Dienstverkehr mit Policy. Beide müssen separat beobachtet werden.

### 2. Warum ist Local Breakout riskant?

**Antwort:** Er erweitert Egress-, DNS-, Identity-, Firewall-, Privacy- und Compliancegrenzen am Standort.

### 3. Beweist ein Controller eine funktionierende Site?

**Antwort:** Nein. Tunnel-, Data-Plane-, App-, Rückweg- und Securityfehler bleiben möglich.

### 4. Wie vermeidest du Pfadflapping?

**Antwort:** Realistische SLO-Schwellen, Hysterese/Hold-down nach Produktsemantik, Capacity, Messung, Canary und Rollback testen.

### 5. Ist SD-WAN automatisch Zero Trust?

**Antwort:** Nein. Segmentierung/Tunnel ersetzen keine Ressourcen-/Identity-/Device-/Policyentscheidung.

### 6. Was gehört in den Exitplan?

**Antwort:** Policyexport, Zertifikate/Keys, CPE-Rückbau, Routing-/DNS-/security migration, Daten/Logs, Vertrags- und Betriebsübergabe.

## Praktische Labs

~~~python
flows={"voice":{"primary":"mpls","fallback":"internet"},"web":{"primary":"internet","fallback":"mpls"}}
assert flows["voice"]["primary"] != flows["voice"]["fallback"]
print("Synthetic policy only; measurements and real tunnel behavior remain unproven.")
~~~

## Dependencies, Cross-References und Quellen

1. [NIST SP 800-207](https://csrc.nist.gov/pubs/sp/800/207/final), abgerufen 2026-09-16.
2. [RFC 5880: BFD](https://datatracker.ietf.org/doc/rfc5880/), abgerufen 2026-09-16.
3. [RFC 2992: ECMP](https://datatracker.ietf.org/doc/html/rfc2992), abgerufen 2026-09-16.

Zeitabhängige Anbieter-/Controller-/SASE-/Cloud-/Carrier-/Pricing-/Securityinformationen müssen vor Einsatz aktuell verifiziert werden.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| SSE/SASE Integration | anbieterabhängig | identity, egress, privacy, latency, resilience und exit testen. |
| AI-assisted path analytics | adopting | Datenqualität, explainability, guardrails und rollback belegen. |
| Intent/ZTP | established je Plattform | certificate bootstrap, drift, failure recovery und audit prüfen. |

Ein Pilot akzeptiert eine SD-WAN-Innovation erst, wenn Underlay-/Overlay-/Tunnel-/Controller-/Policy-/App-/Local-Breakout-/Crypto-/Routing-/Rückwegsemantik, Failure-Diversität, Service-SLO, Security/Privacy, Observability, Capacity/Cost, Owner, Change und Rollback nachgewiesen sind.
