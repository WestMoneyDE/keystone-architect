---
{"id": "KB-0089", "title": "NetBox als Source of Truth", "domain": "04", "sequence": 13, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["ENTERPRISE", "CLOUD", "PLATFORM", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0054", "concepts": ["CIDR", "IPAM"], "needed_for": "both"}, {"id": "KB-0083", "concepts": ["Campus", "Inventory"], "needed_for": "understanding"}, {"id": "KB-0084", "concepts": ["Datacenter", "Fabric"], "needed_for": "both"}, {"id": "KB-0087", "concepts": ["Intent", "Drift"], "needed_for": "both"}], "related": ["KB-0090", "KB-0091", "KB-0562", "KB-0720"], "applies": ["KB-0090", "KB-0091", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Lokales fiktives IP-/Geräte-/Portmodell validieren.", "rationale": "Keine API oder Infrastruktur."}, "ARCHITECT-TARGET": {"active": true, "scope": "Datenmodell, Ownership, Qualität, Freigabe, API, Discovery-Abgleich und Changevertrag entwerfen.", "rationale": "SoT ist Daten- und Betriebsarchitektur."}, "STAFF-TARGET": {"active": true, "scope": "Datenqualität, Imports, Konflikte, Drift, Audit und Automation kontrollieren.", "rationale": "Falsche Inventardaten erzeugen reale Änderungen."}, "CHIEF-TARGET": {"active": true, "scope": "Governance, Verantwortlichkeiten, Lifecycle, Kontrollmodell und Investition in Datenqualität entscheiden.", "rationale": "SoT ist eine Unternehmensfähigkeit."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "NetBox Plugins, GraphQL, webhooks, custom scripts, Nautobot and CMDB integrations are optional depth.", "rationale": "Kern ist trustworthy data."}}, "lab_validation": [{"lab_id": "KB-0089-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Lokales Tabellenmodell", "evidence": "Doppelte IP-Zuweisung wird abgelehnt.", "limitations": "Keine NetBox-Instanz, API oder Produktion."}]}
---
# NetBox als Source of Truth

> **Ziel:** Eine Network Source of Truth (SoT) verbindet IPAM, Geräte, Racks, Ports, Kabel, VRFs, Prefixes, Tenants und Ownership in einem kontrollierten Datenmodell. Discovery, Controller oder Tabellen dürfen SoT-Daten ergänzen, aber nicht ungeprüft überschreiben.

## Zweck, Mental Model und Dependencies

NetBox ist ein verbreitetes Werkzeug für Infrastrukturressourcenmodellierung; seine konkrete Version, API, Plugins und Berechtigungssemantik sind zeitabhängig. Die Architekturidee ist wichtiger: **SoT beschreibt genehmigte Absicht und Verantwortlichkeit; Observed State beschreibt gemessene Wirklichkeit; ein kontrollierter Abgleich erzeugt Change, nicht blindes Überschreiben.**

Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0054](../03-network-foundations/06-subnetting-und-cidr.md), [KB-0083](07-campus-netzarchitektur.md), [KB-0084](08-datacenter-netzarchitektur.md) und [KB-0087](11-sdn-und-programmierbare-netze.md).

~~~text
approved intent/owner -> SoT/IPAM -> validation/change -> automation/device
                                ^                         |
observed discovery/telemetry ---+-> discrepancy review <-+
~~~

## Core Concepts, Architektur und Implementierung

| Objekt | Vertrag | Qualitätsfrage |
|---|---|---|
| Tenant/site/region | Ownership, data class, lifecycle | eindeutiger Verantwortlicher? |
| Prefix/IP/VRF | CIDR, role, status, allocation, DNS | overlap, free/reserved/assigned korrekt? |
| Device/rack/interface | role, model, serial, location, port/cable | physischer und logischer Zustand getrennt? |
| Circuit/provider | demarc, bandwidth, SLA, termination | aktualisiert bei Providerchange? |
| Service/connection | endpoint, dependency, policy/owner | darf Automation daraus handeln? |
| Change/audit | requester, approval, revision, evidence | nachvollziehbar und reversibel? |

Datenmodellierung beginnt mit minimalen, verpflichtenden Feldern: ID, Owner, Status, Scope, Quelle, Aktualitätsdatum und Freigabepfad. Freitext ersetzt keine Beziehung. Discovery ist eine Beobachtungsquelle mit Fehlern: fehlende Geräte, falsche Interfaces, alte Namen oder Zugriffsgrenzen werden als Discrepancy erfasst und erst durch zuständigen Owner oder geprüften Workflow in SoT überführt.

API-Nutzung braucht idempotente, schema-/versiongeprüfte Requests, least-privilege Tokens, Rate-/Retrygrenzen, Validierung, dry run, Review, Audit, Rollback und Secretmanagement. Import-/Automation darf nicht aus einer unvollständigen IPAM-Abfrage eine Produktionseinrichtung ableiten.

## Scalability, Reliability, Security und Observability

Skalierung umfasst Objekte, Beziehungen, Custom Fields, API QPS, Webhooks, Jobs, Attachments, Integrationen, RBAC und Reviewkapazität. Reliability heißt Backup/Restore, Migrationsplan, HA nach Bedarf, Datenexport, Changefreeze und degradierte Betriebsabläufe, wenn SoT nicht verfügbar ist. Falsche Daten sind oft gefährlicher als fehlende Daten.

| Symptom | Ursache | Gegenprobe |
|---|---|---|
| IP doppelt vergeben | Import/race/manual change/overlap | prefix/VRF/tenant/status and audit |
| Automation trifft falsches Gerät | stale name/serial/interface/role | source timestamp, device identity, approval |
| Discovery überschreibt intent | unidirektionaler sync fehlt | compare/exception workflow |
| API alarmiert | rate/permission/schema/webhook loop | client, RBAC, queue, version, retry |
| Fabric weicht ab | ungemeldete Änderung/partial rollout | SoT revision, observed state, change ID |

Security schützt personenbezogene Standort-/Device-/IP-/Kontaktinformationen durch RBAC, getrennte Tokens, Audit, Retention, Exportkontrolle und Secrets außerhalb von Inventartexten. SoT ersetzt weder CMDB-Governance noch Security-Assetmanagement, kann aber kontrollierte Schnittstellen bieten.

## Trade-offs, Entscheidungen und Checklist

**Staff** prüft Modellconstraints, Import-/Discovery-Konflikte, API-Failure, Backups und Automationblast-Radius. **Principal** standardisiert Schema, Naming/IPAM, Ownership, Quality-SLO, Integrationsgates und Lifecycle. **Chief** finanziert Datenqualität, benennt Governance und entscheidet System-/Vendor-/Exitstrategie.

- [ ] Objekt-/Owner-/Status-/Scope-/Source-/freshness-Felder und Qualitätsregeln definiert.
- [ ] IP/VRF/prefix/device/interface/circuit/service Beziehungen validiert.
- [ ] Discovery-Abgleich, Approval, API/RBAC, audit, backup/restore, drift, dry run/canary/rollback getestet.
- [ ] Secret/Privacy/retention/export, Automationblast-Radius und Betriebsfallback geklärt.

## Interviewfragen

### 1. Was unterscheidet SoT und Discovery?

**Antwort:** SoT ist freigegebene Absicht mit Ownership; Discovery ist beobachteter Zustand. Unterschiede lösen Review oder Change aus.

### 2. Warum ist eine IP ohne VRF/Status unzureichend?

**Antwort:** Derselbe Adressraum kann Kontext benötigen; ohne Status/Owner/Scope ist Allocation und Sicherheit mehrdeutig.

### 3. Was ist die gefährlichste Automationfolge?

**Antwort:** Eine falsche oder alte Inventarannahme wird automatisiert in einen breiten Produktionschange übersetzt.

### 4. Wie begrenzt man Importfehler?

**Antwort:** Schema-/identity validation, dry run, diff, approval, bounded batch, audit und rollback.

### 5. Welche SoT-Ausfallstrategie braucht man?

**Antwort:** Read-only/degraded process, geprüfte Exporte/Backups, klare Changepause und Wiederherstellung ohne unsichtbare Schattenlisten.

### 6. Wie misst du Datenqualität?

**Antwort:** Vollständigkeit, Aktualität, Eindeutigkeit, Beziehungskonsistenz, bestätigte Discrepancies, Fehlerquote und Zeit bis Korrektur.

## Praktische Labs

~~~python
assigned={"10.0.0.10":"server-a"}
candidate="10.0.0.10"
assert candidate in assigned
print("Allocation conflict requires owner-reviewed change.")
~~~

## Dependencies, Cross-References und Quellen

1. [NetBox Documentation](https://netboxlabs.com/docs/netbox/), abgerufen 2026-09-16.
2. [RFC 8342: NMDA](https://datatracker.ietf.org/doc/html/rfc8342), abgerufen 2026-09-16.

Zeitabhängige NetBox-/Plugin-/API-/RBAC-/Lizenz-/Integrationsdetails vor Einsatz aktuell prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| SoT-driven IaC | adopting/established | validation, drift, approvals und rollback nachweisen. |
| graph-based dependency analysis | adopting | data quality, ownership und privacy prüfen. |
| AI-assisted reconciliation | emerging | evidence, human approval, audit und safe failure verpflichten. |

Ein Pilot akzeptiert eine Network-SoT-Innovation erst, wenn Objekt-/IPAM-/VRF-/Device-/Interface-/Circuit-/Owner-/Source-/API-/Discovery-/Drift-/Approval-/Rollbacksemantik, Data-Quality-SLO, Security/Privacy, Observability, Capacity/Cost, Change und Exit nachgewiesen sind.
