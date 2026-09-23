---
{"id": "KB-0090", "title": "Nautobot und Netzwerkdatenprodukte", "domain": "04", "sequence": 14, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["ENTERPRISE", "CLOUD", "PLATFORM", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0087", "concepts": ["Intent", "Drift", "API"], "needed_for": "both"}, {"id": "KB-0089", "concepts": ["SoT", "IPAM", "Ownership"], "needed_for": "both"}], "related": ["KB-0091", "KB-0092", "KB-0562", "KB-0720"], "applies": ["KB-0091", "KB-0092", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Lokales fiktives Datenprodukt-/Driftmodell prüfen.", "rationale": "Keine Instanz oder API."}, "ARCHITECT-TARGET": {"active": true, "scope": "Datenmodell, Jobs, Erweiterungen, Automationsgrenzen, Ownership und Datenqualität entwerfen.", "rationale": "Datenprodukte brauchen Verträge."}, "STAFF-TARGET": {"active": true, "scope": "Jobfehler, Drift, API, Backfill, Audit und Rollback testen.", "rationale": "Automatisierung propagiert Datenfehler."}, "CHIEF-TARGET": {"active": true, "scope": "Plattformauswahl, Governance, Integrationen, Lizenz/Lifecycle und Exit steuern.", "rationale": "Network data ist eine Plattformfähigkeit."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Nautobot apps/jobs/SSoT, GraphQL, plugin development und CMDB integration sind Vertiefungen.", "rationale": "Kern ist vertrauenswürdige Automation."}}, "lab_validation": [{"lab_id": "KB-0090-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Lokales Tabellenmodell", "evidence": "Discrepancy braucht freigegebenen Change.", "limitations": "Keine Nautobot-Instanz, API oder Produktion."}]}
---
# Nautobot und Netzwerkdatenprodukte

> **Ziel:** Nautobot kann Daten, Jobs, Erweiterungen und Automationsworkflows um Netzwerkressourcen organisieren. Der Wert entsteht nicht durch eine Plattforminstallation, sondern durch ein versioniertes Datenprodukt mit Ownership, Qualitätsregeln, beobachtetem Zustand, sicheren Changes und Rückbau.

## Zweck, Mental Model und Dependencies

Nautobot ist eine Plattformperspektive für Netzwerkdaten und Automationsarbeit. NetBox ist eine alternative SoT-Perspektive; beides sind keine austauschbaren Namen ohne Prüfung von Datenmodell, API, Jobs, Erweiterungen, RBAC, Migrationsweg, Operations und Lizenz. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0087](11-sdn-und-programmierbare-netze.md) und [KB-0089](13-netbox-als-source-of-truth.md).

~~~text
domain owner -> governed data product -> validation/job/API -> change
        ^            |                         |             |
 observed state -----+-> discrepancy/quality ---+-> audit/rollback
~~~

## Core Concepts, Architektur und Implementierung

| Element | Vertrag | Failure Mode |
|---|---|---|
| Datenmodell | Objekt, Beziehung, Owner, Status, Quelle, Frische | unklare/duplizierte Semantik |
| Job/Workflow | Input, Validierung, Berechtigung, idempotency, Output | Partial change/retry side effects |
| Erweiterung | Version, compatibility, threat model, lifecycle | plugin breaks upgrade/API |
| SSoT/Discovery | observed source, mapping, conflict policy | discovery overwrites approved intent |
| API | schema, RBAC, rate/retry, audit, secrets | automation broadens stale data |
| Datenprodukt | consumer, quality SLO, support, cost | nobody owns correction |

Nautobot versus NetBox wird anhand konkreter Einsatzanforderungen bewertet: Domänenmodell, Integrationen, Job-/App-Ökosystem, API/GraphQL, Backup/HA, Security, Operations, Migration und Exit. Eine angepasste Plattform ist nicht automatisch besser; jede Erweiterung erhöht Versions-, Test-, Security- und Ownerpflicht.

## Scalability, Reliability, Security und Observability

Skalierung umfasst Objekt-/Relationshipzahl, API-/Jobrate, Queue/Worker, Integrationen/Webhooks, Datenvolumen, Backfill, Berechtigungen und Reviewfähigkeit. Reliability braucht Backup/Restore, Migrationproben, Job-Timeout/Retry/Idempotency, Versionierung, Audit, degraded operations und klare Grenze: Ein Datenworkflow darf bei unklarem Zustand keinen breiten Produktionschange auslösen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Job überschreibt Sollzustand | SSoT mapping/conflict policy falsch | diff, source timestamp, approval |
| API liefert inkonsistent | schema/version/cache/permission | contract test, revision, RBAC |
| Drift wächst | owner/freshness/discovery/change gap | quality SLO, discrepancy age |
| Upgrade bricht workflow | extension dependency/migration | preproduction restore/compatibility test |
| Queue staut | fan-out/rate/retry/downstream failure | job metrics, backpressure, bounded concurrency |

Security: least privilege, Tokens/Secrets außerhalb der Datenobjekte, MFA/RBAC, getrennte Umgebungen, signierte/geprüfte Erweiterungen soweit unterstützt, Audit, Privacy-/Retention und sichere Exporte. Observability: data completeness/freshness/uniqueness, job success/latency/retry, API error/rate, discrepancy age, change blast radius, consumer SLI and owner.

## Trade-offs, Entscheidungen und Checklist

**Staff** testet Mappingkonflikt, Jobtimeout, Retry, Backfill, Upgrade, Restore, Drift und Automationrollback. **Principal** definiert Datenproduktstandards, Quality-SLO, Integrationsgates, Modell-/APIversion und Referenzworkflows. **Chief** entscheidet Plattform-/Vendor-/Open-Source-Strategie, Governance, Skills, Operationsbudget und Exit.

- [ ] Owner, Consumer, Objekt-/Beziehungsmodell, Quality-SLO und Quellen definiert.
- [ ] Job/API schema/RBAC/secrets/idempotency/rate/retry/audit und dry-run/canary getestet.
- [ ] Discovery-/SSoT-Konflikt, Backup/restore/migration/upgrade, drift/rollback und privacy geklärt.

## Interviewfragen

### 1. Was ist ein Netzwerkdatenprodukt?

**Antwort:** Ein Datenbestand mit klaren Konsumenten, Ownern, Qualitäts-SLO, Modell, Lifecycle und sicheren Schnittstellen, nicht nur eine Geräteliste.

### 2. Warum ist Discovery keine Source of Truth?

**Antwort:** Sie misst unvollständig und kann falsch oder alt sein. Abweichungen benötigen einen kontrollierten Abgleich.

### 3. Was macht einen Job sicher?

**Antwort:** Validierung, minimale Berechtigung, Idempotency, begrenzter Scope, dry run, Audit, Retryregel und getesteter Rollback.

### 4. Welche Kosten hat Anpassung?

**Antwort:** Test, Upgrade, Securityreview, Ownership, Dokumentation, Ausfall- und Migrationsrisiko.

### 5. Wie misst du Qualität?

**Antwort:** Vollständigkeit, Frische, Eindeutigkeit, Konsistenz, Discrepancy-Alter, Jobfehler und Zeit bis Korrektur.

### 6. Wann darf Automation stoppen?

**Antwort:** Bei fehlender Datenqualität, Konflikt, unbelegter Fähigkeit, unverhältnismäßigem Blast Radius oder fehlendem Rollback.

## Praktische Labs

~~~python
intent={"edge-a":{"site":"berlin","owner":"network"}}
observed={"edge-a":{"site":"frankfurt","owner":"network"}}
assert intent["edge-a"]["site"] != observed["edge-a"]["site"]
print("Discrepancy requires review, not blind overwrite.")
~~~

## Dependencies, Cross-References und Quellen

1. [Nautobot Documentation](https://docs.nautobot.com/), abgerufen 2026-09-16.
2. [RFC 8342: NMDA](https://datatracker.ietf.org/doc/html/rfc8342), abgerufen 2026-09-16.

Zeitabhängige Nautobot-/Plugin-/Job-/API-/RBAC-/Lizenzdetails vor Einsatz aktuell prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| SSoT/automation apps | adopting/established | mapping, data quality, failure and rollback prove. |
| policy-as-data | adopting | ownership, schema, approval and audit validate. |
| AI reconciliation | emerging | evidence, human review, privacy and safe failure require. |

Ein Pilot akzeptiert eine Netzwerkdatenprodukt-Innovation erst, wenn Modell-/Owner-/Source-/Freshness-/API-/Job-/SSoT-/Discovery-/Drift-/Approval-/Rollbacksemantik, Data-Quality-SLO, Security/Privacy, Observability, Capacity/Cost, Change und Exit nachgewiesen sind.
