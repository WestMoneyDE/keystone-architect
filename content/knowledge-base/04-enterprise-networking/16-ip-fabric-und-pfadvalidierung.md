---
{"id": "KB-0092", "title": "IP Fabric und Pfadvalidierung", "domain": "04", "sequence": 16, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["ENTERPRISE", "CLOUD", "PLATFORM", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0064", "concepts": ["FIB", "Routing"], "needed_for": "both"}, {"id": "KB-0075", "concepts": ["Request Path", "Messpunkte"], "needed_for": "both"}, {"id": "KB-0082", "concepts": ["ECMP", "BFD"], "needed_for": "both"}, {"id": "KB-0087", "concepts": ["Intent", "Actual State"], "needed_for": "both"}, {"id": "KB-0089", "concepts": ["SoT", "Data Quality"], "needed_for": "both"}], "related": ["KB-0093", "KB-0094", "KB-0562", "KB-0720"], "applies": ["KB-0093", "KB-0094", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Lokales fiktives Topologie-/Intent-/Observed-Pfadmodell prüfen.", "rationale": "Keine Geräte oder Pakete."}, "ARCHITECT-TARGET": {"active": true, "scope": "Topologiequellen, Snapshotfrische, Modellgrenzen, Pfadfragen, Discrepancies und Changegates entwerfen.", "rationale": "Pfadvalidierung ist Evidenz, keine Wahrheit ohne Scope."}, "STAFF-TARGET": {"active": true, "scope": "Modell-/Data-plane-Differenzen, ECMP, MTU, policy, stale data und Incidenttests korrelieren.", "rationale": "Ein Simulationsresultat braucht Gegenbeweise."}, "CHIEF-TARGET": {"active": true, "scope": "Network assurance, Daten-/Toolgovernance, Risk/Compliance, Betriebsmodell und Vendor/Exit entscheiden.", "rationale": "Validierung prägt Change- und Incidentrisiko."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "IP Fabric/Forward Networks/Batfish, digital twins, vendor telemetry and formal verification are optional depth.", "rationale": "Kern ist nachvollziehbare Evidenzgrenze."}}, "lab_validation": [{"lab_id": "KB-0092-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Lokales fiktives Modell", "evidence": "Soll- und beobachteter Pfad unterscheiden sich sichtbar.", "limitations": "Keine Discovery, Geräte, Telemetrie oder Produktion."}]}
---
# IP Fabric und Pfadvalidierung

> **Ziel:** Pfadvalidierung nutzt Topologie, Routing, Policy und Zustandsdaten, um Fragen über erwartete Erreichbarkeit, Risiken und Changes zu beantworten. Sie ersetzt nicht die Messung des tatsächlichen Paketpfads, wenn Daten veraltet, unvollständig, abstrahiert oder in ihrer Semantik falsch sind.

## Zweck, Mental Model und Dependencies

Ein IP-Fabric-Modell kann Geräte, Interfaces, Links, Routing-/FIB-/ACL-/NAT-/VRF-/Cloud-/Servicekontext sammeln und daraus hypothetische Pfade ableiten. Die Qualität ist durch Zeit, Quelle, Scope, Parsing, Capability und Policysemantik begrenzt. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0064](../03-network-foundations/16-routingtabellen-und-weiterleitung.md), [KB-0075](../03-network-foundations/27-netzwerkdiagnose-entlang-des-anfragepfads.md), [KB-0082](06-ecmp-und-bfd.md), [KB-0087](11-sdn-und-programmierbare-netze.md) und [KB-0089](13-netbox-als-source-of-truth.md).

~~~text
SoT + discovery/config/telemetry snapshot -> parser/model -> intent/path query -> result/confidence
        ^ freshness/coverage                        |                    |
        +----------- observed packet/SLI -----------+-> discrepancy/change/incident
~~~

## Core Concepts, Architektur und Implementierung

| Begriff | Frage | Begrenzung |
|---|---|---|
| Model | Welche Geräte/Links/Policies sind enthalten? | fehlende/alte/unklare Quellen |
| Intent check | Soll Kommunikation erlaubt/verboten sein? | Intent kann unvollständig sein |
| Path simulation | Welcher Pfad folgt dem modellierten Zustand? | ECMP/hash/MTU/state/ASIC können abweichen |
| Reachability | Ist eine logische Regel erreichbar? | kein App-/DNS-/TLS-/Identitynachweis |
| Discrepancy | Wo weicht observed von expected ab? | Messpunkt kann Teilpfad sehen |
| Change gate | Welche Risiken entdeckt das Modell vor Rollout? | kein Ersatz für Canary/Rollback |

Implementierung braucht Quelleninventar, Zeitstempel, Geräte-/OS-/Schemaabdeckung, normalisiertes Modell, Fragenkatalog, Confidence/Limitations, RBAC/Secrets, Audit, Datenretention, Testfälle, Baseline, Alerting und Changeintegration. Ein Queryresultat enthält immer Source snapshot, Scope, Annahmen, Modellversion und welche Ebenen nicht bewertet wurden.

## Scalability, Reliability, Security und Observability

Skalierungstreiber sind Geräte, Konfigurationen, Links, Routingtabellen, ECMP-Pfade, Policies, Clouds, snapshots, Queryrate and integrations. Reliability verlangt versionierte Snapshots, Rebuild/restore, Parser-Tests, Degradation bei fehlender Quelle, Backpressure, Job-/API-Observability und einen manuellen Prozess bei fehlender Validierung. Ein Modellservice darf keine großflächigen Changes freigeben, wenn Datenfrische/Abdeckung unter seinem Qualitäts-SLO liegt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Modell sagt erlaubt, Flow scheitert | stale source, hash/MTU/NAT/state/App | actual path, flow, SLI, snapshot age |
| Modell sagt blockiert, Flow geht | missing policy/device/exception | coverage, parser, config revision, packet evidence |
| Pfade unklar | ECMP/overlay/dynamic state | enumerate assumptions and multiple paths |
| Change pass, Incident folgt | query scope/intent too narrow | test matrix, canary, rollback |
| Device fehlt | credential/scope/discovery issue | coverage report and owner queue |

Security schützt Konfiguration, Routen, Topologie, Credentials, Kundennetze und Flows mit RBAC, Secretsmanagement, Audit, Datenklassifikation, Retention und sicheren Integrationen. Pfadvalidierung liefert Informationsmacht; Zugriffsrechte und Exporte müssen diesen Umstand berücksichtigen.

## Trade-offs, Entscheidungen und Checklist

**Staff** verbindet modellierte Pfade mit Canaries, Data-plane- und SLI-Gegenproben. **Principal** definiert Quellen-/Frische-/Coverage-SLO, Querypatterns, Changegates, Integrationen und Incidentworkflow. **Chief** entscheidet Assuranceplattform, Governance, Vendor-/Data-/Privacy-/Exitstrategie.

- [ ] Quellen, Zeitstempel, Scope, Abdeckung, Parser-/Schema-/OS-Grenzen und Owner dokumentiert.
- [ ] Intent-/Pathqueries enthalten Annahmen, Confidence, Limitations, audit und Change-ID.
- [ ] ECMP/MTU/VRF/ACL/NAT/overlay/state/return-path sowie Data-plane/SLI-Gegenprobe berücksichtigt.
- [ ] RBAC/secrets/retention, quality SLO, degraded mode, canary/rollback und Incidentprozess getestet.

## Interviewfragen

### 1. Ist ein simuliertes Paket ein echtes Paket?

**Antwort:** Nein. Es ist ein Schluss aus modellierten Daten. Es braucht Frische, Scope und bei kritischen Changes tatsächliche Gegenmessung.

### 2. Warum ist Snapshotalter entscheidend?

**Antwort:** Routing, Policy, Links und Geräte können seit der Erhebung geändert sein; ein korrekter alter Snapshot kann aktuell falsch sein.

### 3. Wie behandelst du ECMP?

**Antwort:** Ich dokumentiere Hash-/Member-/Policyannahmen, betrachte Mehrpfade und prüfe mit repräsentativen Flowdaten statt einen einzigen Pfad als sicher zu behaupten.

### 4. Was ist ein guter Changegate?

**Antwort:** Eine reproduzierbare Query mit Scope, Preconditions, Risiko, erwarteter Änderung, Canary, SLI, Approval und Rollback, ergänzt durch Qualitätsgrenzen.

### 5. Welche Sicherheit braucht ein Modelltool?

**Antwort:** Least-privilege Zugriff, geschützte Credentials, Audit, Datenminimierung, Exportschutz und sichere API-/Integrationgrenzen.

### 6. Wann stoppst du eine Validierung?

**Antwort:** Bei fehlender Quelle, schlechter Frische/Coverage, unklarer Semantik, Parserfehler, großem Blast Radius oder fehlendem Rollback.

## Praktische Labs

~~~python
intent=["client->api:allow"]
observed=["client->proxy:allow","proxy->api:deny"]
assert intent != observed
print("Model discrepancy requires scope and evidence review.")
~~~

## Dependencies, Cross-References und Quellen

1. [RFC 8342: NMDA](https://datatracker.ietf.org/doc/html/rfc8342), abgerufen 2026-09-16.
2. [RFC 2992: ECMP](https://datatracker.ietf.org/doc/html/rfc2992), abgerufen 2026-09-16.

Zeitabhängige Tool-/Parser-/OS-/API-/Cloud-/Lizenz- und Integrationsdetails vor Einsatz aktuell prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| network digital twins | adopting | source freshness, model coverage, validation and rollback test. |
| continuous verification | adopting | false positives, change integration and ownership prove. |
| AI path reasoning | emerging | evidence, confidence, privacy and human approval require. |

Ein Pilot akzeptiert eine Pfadvalidierungs-Innovation erst, wenn Source-/Snapshot-/Topologie-/Routing-/FIB-/Policy-/ECMP-/MTU-/Overlay-/Return-/Intent-/Actual-State-/Confidence-/Discrepancy-/Rollbacksemantik, Data-Quality-SLO, Security/Privacy, Observability, Capacity/Cost, Change und Exit nachgewiesen sind.
