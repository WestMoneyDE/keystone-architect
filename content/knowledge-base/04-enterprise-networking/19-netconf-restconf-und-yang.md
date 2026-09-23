---
{"id": "KB-0095", "title": "NETCONF, RESTCONF und YANG", "domain": "04", "sequence": 19, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["ENTERPRISE", "CLOUD", "PLATFORM", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0087", "concepts": ["Intent", "API", "Control Plane"], "needed_for": "both"}, {"id": "KB-0089", "concepts": ["SoT", "Data Quality"], "needed_for": "understanding"}, {"id": "KB-0092", "concepts": ["Model", "Actual State"], "needed_for": "understanding"}], "related": ["KB-0096", "KB-0097", "KB-0562", "KB-0720"], "applies": ["KB-0096", "KB-0097", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Lokale Modell-/Schema-/Transaktionshypothesen prüfen.", "rationale": "Keine Geräte/API."}, "ARCHITECT-TARGET": {"active": true, "scope": "YANGmodell, Datastore, Capability, Transaktion, Version, Security und Rollback entwerfen.", "rationale": "Modellierte APIs sind Vertragsgrenzen."}, "STAFF-TARGET": {"active": true, "scope": "Schemaabweichung, Partial Failure, Lock, Commit, Confirmed Commit und Drift testen.", "rationale": "APIsemantik bestimmt Änderungsrisiko."}, "CHIEF-TARGET": {"active": true, "scope": "Automationsstandard, Interoperabilität, Vendor-/Schema-/Skills-/Exitstrategie steuern.", "rationale": "Modelldefinition prägt Plattformbindung."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "YANG modules/augment/deviation, NMDA, OpenConfig, gNMI and model compilers are optional depth.", "rationale": "Kern ist sichere modellierte Änderung."}}, "lab_validation": [{"lab_id": "KB-0095-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Lokales fiktives Schema-/Datastoremodell", "evidence": "Unbekanntes Schemafeld wird nicht übernommen.", "limitations": "Keine NETCONF/RESTCONF-Server, Geräte oder Produktion."}]}
---
# NETCONF, RESTCONF und YANG

> **Ziel:** NETCONF und RESTCONF bieten modellierte Geräte-APIs; YANG beschreibt die Datenstruktur und Constraints. Gegenüber CLI-Automation können sie validierbarere und teils transaktionale Änderungen ermöglichen, aber Capability, Datastore, Schemaabweichung, Lock, Commit, Partial Failure und Rollback bleiben konkret zu prüfen.

## Zweck, Mental Model und Dependencies

YANG modelliert Konfiguration und State; NETCONF arbeitet mit Remote Procedure Calls und Datastores; RESTCONF repräsentiert modellierte Daten über HTTP-API-Muster. RFC 6241, RFC 8040 und RFC 7950 definieren zentrale Standardkonzepte. Nicht jedes Gerät implementiert jedes Modell oder jede Operation gleich. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0087](11-sdn-und-programmierbare-netze.md), [KB-0089](13-netbox-als-source-of-truth.md) und [KB-0092](16-ip-fabric-und-pfadvalidierung.md).

~~~text
intent/SoT -> YANG schema/capabilities -> NETCONF/RESTCONF operation -> candidate/running/operational state
   ^                 |                         |                    |
   +---- diff/audit/actual/SLI <----------------+-> commit/rollback
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| YANG | nodes, types, constraints, modules, version/deviation? | vendor schema differs from expected |
| Datastore | running/candidate/operational semantics? | assuming uniform transactional behavior |
| Capability | supported model/operation/version? | request unsupported or differently interpreted |
| Transaction | lock, edit, validate, commit, confirmed commit? | partial or unrecoverable change |
| RESTCONF | resource path/HTTP method/etag/error semantics? | retry changes non-idempotent state |
| Observed State | configuration versus operational result? | config accepted while data plane fails |

Implementation begins with current capability discovery, schema inventory, source version, intent mapping, validation, minimal RBAC, secure transport/auth, secrets, timeouts/retries, lock scope, concurrency bounds, pre/post state, audit, canary and rollback. CLI may remain needed for unsupported functions, but it must not be hidden behind a false atomicity claim.

## Scalability, Reliability, Security und Observability

Scale depends on devices, modules, payload size, RPC/API rate, locks, controller workers, retries, telemetry, schema cache and review capacity. Reliability needs timeouts, idempotency, bounded retry, lock expiry behavior, disconnected sessions, partial commit recovery, backup/restore and degraded procedures. A confirmed commit can reduce certain rollback risks where supported, but its semantics and timeout must be tested on the actual platform.

| Symptom | Ursache | Gegenprobe |
|---|---|---|
| validation fails | schema/capability/version/constraint | retrieve capability/schema and minimal payload |
| change partial | device/API timeout, multi-device scope, lock | pre/post diff, audit, reconcile/rollback |
| lock blocks rollout | stale session/concurrency/ownership | lock holder/expiry/runbook |
| config accepted, path fails | data plane/FIB/MTU/policy/return | actual state plus flow/SLI |
| retry duplicates change | non-idempotent resource/API behavior | operation semantics and revision/etag |

Security needs TLS/SSH as supported, certificate/key lifecycle, RBAC, NACM-like policy where applicable, encrypted secret handling, audit, device/management-plane segmentation, rate protection and data minimization. Models can expose sensitive topology or credentials references; query/export scope is controlled.

## Trade-offs, Entscheidungen und Checklist

**Staff** tests schema capability, validation, lock, lost session, partial/multi-device change, confirmed commit, drift, actual data plane and rollback. **Principal** defines model/API standards, SoT mapping, test suites, version strategy, change gates and exceptions. **Chief** decides interoperable versus vendor model strategy, governance, skills, lifecycle and exit.

- [ ] Current models/capabilities/version/deviations/datastores and owner documented.
- [ ] Authentication/RBAC/secrets/transport/audit/rate/lock/retry/idempotency and payload boundaries tested.
- [ ] Pre/post diff, validate, canary, actual state/SLI, partial-failure recovery and rollback proven.

## Interviewfragen

### 1. Was löst YANG?

**Antwort:** Es beschreibt Datenstruktur, Typen und Constraints. Es garantiert nicht, dass jedes Gerät dasselbe Modul oder Verhalten implementiert.

### 2. Ist NETCONF immer atomar?

**Antwort:** Nein. Atomizität hängt von Datastore, Operation, Capability und Plattform ab; sie wird konkret getestet.

### 3. Was ist Capability Discovery?

**Antwort:** Abfragen, welche Modelle, Versionen, Datastores und Operationen ein Ziel tatsächlich unterstützt.

### 4. Warum reicht konfigurierte State nicht?

**Antwort:** Operational State und Data Plane können wegen Ressourcen, Policy, Routing, MTU oder Rückweg abweichen.

### 5. Wie sicherst du Retry ab?

**Antwort:** Idempotente Operationen, Revision/etag/transaction semantics, Pre-/Postcheck, bounded retry and audit.

### 6. Wann nutze ich CLI?

**Antwort:** Für nicht modellierte/unterstützte Funktionen, aber mit expliziter Ausnahme, Validation, Audit, Canary und Rollback.

## Praktische Labs

~~~python
schema={"interface":{"enabled":bool}}
candidate={"interface":{"enabled":True,"mystery":1}}
assert "mystery" not in schema["interface"]
print("Schema validation would reject unknown field; local model only.")
~~~

## Dependencies, Cross-References und Quellen

1. [RFC 7950: YANG 1.1](https://datatracker.ietf.org/doc/html/rfc7950), abgerufen 2026-09-16.
2. [RFC 6241: NETCONF](https://datatracker.ietf.org/doc/html/rfc6241), abgerufen 2026-09-16.
3. [RFC 8040: RESTCONF](https://datatracker.ietf.org/doc/html/rfc8040), abgerufen 2026-09-16.

Zeitabhängige NOS-/Modul-/API-/Crypto-/lizenz- und Interoperabilitätsdetails vor Einsatz aktuell prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| OpenConfig/gNMI | adopting/established je Plattform | coverage, schema/version and rollback validate. |
| model-driven assurance | adopting | actual-state, data quality and change gate prove. |
| AI config assistants | emerging | schema validation, approval, audit and safe failure require. |

Ein Pilot akzeptiert eine modellgetriebene Netzwerk-Innovation erst, wenn YANG-/Capability-/Datastore-/NETCONF-/RESTCONF-/Lock-/Validate-/Commit-/Partial-Failure-/Actual-State-/Drift-/Rollbacksemantik, Security/Privacy, Observability, Capacity/Cost, Owner, Change und Exit nachgewiesen sind.
