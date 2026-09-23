---
{"id": "KB-0087", "title": "SDN und programmierbare Netze", "domain": "04", "sequence": 11, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["ENTERPRISE", "CLOUD", "PLATFORM", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0064", "concepts": ["FIB", "Routing"], "needed_for": "both"}, {"id": "KB-0078", "concepts": ["BGP", "Policy"], "needed_for": "understanding"}, {"id": "KB-0081", "concepts": ["Overlay", "VTEP"], "needed_for": "understanding"}, {"id": "KB-0086", "concepts": ["Controller", "Intent", "Policy"], "needed_for": "both"}], "related": ["KB-0088", "KB-0089", "KB-0562", "KB-0720"], "applies": ["KB-0088", "KB-0089", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein lokales Desired-/Actual-State-Modell mit Konflikt prüfen.", "rationale": "Ohne Controller oder Geräte."}, "ARCHITECT-TARGET": {"active": true, "scope": "Control/Data/Management Plane, Intent, API, SoT, Konsistenz, Security, Failure und Rollback entwerfen.", "rationale": "Programmierung verändert den Betriebsvertrag."}, "STAFF-TARGET": {"active": true, "scope": "Drift, Partial Failure, Controllerausfall und canary rollout durchgängig testen.", "rationale": "Controller-/Geräte-/Policygrenzen sind gekoppelt."}, "CHIEF-TARGET": {"active": true, "scope": "Automationsstrategie, Vendorbindung, Kontrollmodell, Plattformbetrieb und Exit steuern.", "rationale": "SDN ist Organisations- und Risikodesign."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "OpenFlow, P4, gNMI, NETCONF/YANG, OpenConfig, ONOS/ODL und vendor fabrics sind Vertiefungen.", "rationale": "Kern ist nachweisbarer Intent und sicherer Betrieb."}}, "lab_validation": [{"lab_id": "KB-0087-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Lokales Tabellenmodell", "evidence": "Desired und Actual State werden verglichen.", "limitations": "Keine APIs, Controller, Geräte oder Produktion."}]}
---
# SDN und programmierbare Netze

> **Ziel:** SDN entkoppelt nicht magisch alle Ebenen, sondern macht Steuerung, Intent, APIs und Automationspfade explizit. Ein programmierbares Netz ist nur zuverlässig, wenn Desired State, Actual State, Controllerverfügbarkeit, Gerätekonsistenz, Policy, Security und Rollback nachweisbar verbunden sind.

## Zweck, Mental Model und Dependencies

Control Plane entscheidet Wege und Zustände; Data Plane leitet Daten weiter; Management Plane konfiguriert, beobachtet und sichert sie. Ein Controller kann diese Ebenen koordinieren, aber er ist keine Garantie für Konsistenz. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0064](../03-network-foundations/16-routingtabellen-und-weiterleitung.md), [KB-0078](02-bgp-policy-und-route-reflection.md), [KB-0081](05-evpn-und-vxlan-fabrics.md) und [KB-0086](10-sd-wan-und-pfadsteuerung.md).

~~~text
intent/SoT -> compiler/controller -> API/device config -> control/data plane
    ^             |                     |                 |
    |---- audit/drift/telemetry <--------+-----------------+
~~~

## Core Concepts, Architektur und Implementierung

| Ebene | Frage | Failure |
|---|---|---|
| Intent/SoT | Welche Geschäftspolicy, Tenant-/Service-/Ownerabsicht? | widersprüchliche oder unvollständige Absicht |
| Compiler/Controller | Wie wird Intent validiert und in Geräteaktionen übersetzt? | bug, API limit, stale cache, HA split brain |
| API/Device | Welche Operation wurde atomar, teilweise oder gar nicht angewendet? | timeout, retries, version mismatch, drift |
| Control/Data | Welcher Pfad funktioniert tatsächlich? | config exists, forwarding fails |
| Observability | Wie wird Soll/Ist und Wirkung korreliert? | grüner Controller ohne Data Plane Sicht |

YANG-/NETCONF-/RESTCONF-/gNMI-/OpenConfig- oder proprietäre Modelle sind Schnittstellenfamilien, keine einheitliche Semantik. RFC 8342 beschreibt Network Management Datastore Architecture als Modellkontext. Vor Einsatz prüfen: Capability discovery, Schema-/Versionkompatibilität, Transaction/Rollback, idempotency, rate limits, secrets, RBAC, HA/DR, audit und Vendor-Lifecycle.

## Scalability, Reliability, Security und Observability

Skaliere Controller nicht nur nach Geräten: Intentobjekte, API-Raten, Telemetrie, Compilezeit, Policy-Diffs, Zertifikate, Queues, Device-TCAM/FIB und Operator-Review sind Grenzen. Ein Controllerverlust kann je Produkt bestehende Forwardingzustände belassen, neue Änderungen verhindern oder Failover auslösen; das ist konkret zu testen.

| Symptom | Ursache | Gegenprobe |
|---|---|---|
| desired grün, Service rot | partial apply, data-plane failure, dependency/return path | device state + flow/SLI vergleichen |
| devices unterschiedlich | retry/timeout/version/drift/manual change | revision, audit, capability, config diff |
| rollout trifft viele Tenants | global intent/template/policy error | scope/canary/blast radius/rollback |
| controller flappt | HA quorum, API/backend/PKI/resource | component timeline and safe mode |
| telemetry fehlt | collector/schema/permission/backpressure | data completeness and alert gap |

Security verlangt getrennte Managementplane, least-privilege RBAC, MFA, API-/client certificates, secret rotation, immutable audit, policy review, tenant separation und datensparsame Telemetrie. Automatisierung verstärkt Fehler ebenso wie Korrekturen; deshalb sind approval, dry run, policy validation, canary, bounded concurrency und geteste Rückabwicklung Kernkontrollen.

## Trade-offs, Staff/Chief und Production Checklist

Central intent liefert Konsistenz- und Geschwindigkeitspotenzial, erhöht aber Controller-/Vendor-/Schemaabhängigkeit. Geräteweise Administration reduziert zentrale Blast Radius, erzeugt Drift und Reviewlast. Wähle je Dienst/Failure-/Complianceprofil.

**Staff** baut Desired-/Actual-/SLI-Tests für Controllerloss, teilweisen Push, Konflikt, Rollback und manuellen Drift. **Principal** standardisiert SoT, Modelle, APIs, Testumgebung, Changegates und Plattform-SLO. **Chief** entscheidet Ownership, Vendor-/Open-Source-Strategie, Compliance, Audit, Skills und Exit.

- [ ] Intent, Owner, Policy, Datenklasse und akzeptierte Ausnahmen versioniert.
- [ ] Schema/capability/API/RBAC/secrets/HA/DR geprüft.
- [ ] Precheck, dry-run, canary, Actual State, SLI, drift, audit und rollback nachgewiesen.
- [ ] Controller-/API-/device-/telemetry-/security-Failure und Blast Radius getestet.

## Interviewfragen

### 1. Ist SDN nur ein Controller?

**Antwort:** Nein. Es umfasst das Zusammenspiel von Intent, Modell, API, Controller, Geräten, Control/Data Plane und Betrieb.

### 2. Was ist Drift?

**Antwort:** Abweichung zwischen genehmigtem Desired State und tatsächlichem Zustand, etwa durch Teilfehler oder manuelle Änderung.

### 3. Warum ist idempotente Automation wichtig?

**Antwort:** Wiederholte Ausführung muss einen bekannten Zustand erzeugen, ohne zusätzliche Nebenwirkung nach Timeout oder Retry.

### 4. Wie begrenzt du Blast Radius?

**Antwort:** Scope, Policyvalidation, dry run, Canary, concurrency limits, Observability, Approval und getesteter Rollback.

### 5. Beweist Controllerstatus Data Plane?

**Antwort:** Nein. Forwarding, Policy, MTU, Rückweg und Anwendungssignal werden zusätzlich gemessen.

### 6. Was ist der Exitplan?

**Antwort:** Modelle/Intent/Policies exportieren, Geräte-/APIabhängigkeiten migrieren, Credentials/Audit/Telemetry umziehen und Rückbau testen.

## Praktische Labs

~~~python
desired={"tenant-a":{"vrf":"a","allow":["dns"]}}
actual={"tenant-a":{"vrf":"a","allow":["dns","all"]}}
assert desired != actual
print("Drift requires review; synthetic data only.")
~~~

## Dependencies, Cross-References und Quellen

1. [RFC 8342: Network Management Datastore Architecture](https://datatracker.ietf.org/doc/html/rfc8342), abgerufen 2026-09-16.
2. [NIST SP 800-207](https://csrc.nist.gov/pubs/sp/800/207/final), abgerufen 2026-09-16.

Zeitabhängige API-/Controller-/NOS-/Schema-/Lizenz-/Securityangaben vor Umsetzung aktuell prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Intent validation/digital twin | adopting | model fidelity, failure replay, approval und rollback prüfen. |
| Streaming telemetry | established/adopting je Plattform | scale, privacy, time correlation und cost nachweisen. |
| AI-assisted operations | adopting | evidence, guardrails, approval, audit und safe failure definieren. |

Ein Pilot akzeptiert eine SDN-Innovation erst, wenn Intent-/SoT-/Controller-/API-/Schema-/Device-/Control-/Dataplane-/Drift-/Rollbacksemantik, Failure-Diversität, Service-SLO, Security/Privacy, Observability, Capacity/Cost, Owner, Change und Rollback nachgewiesen sind.
