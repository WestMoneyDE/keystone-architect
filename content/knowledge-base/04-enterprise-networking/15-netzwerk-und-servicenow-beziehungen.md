---
{"id": "KB-0091", "title": "Netzwerk und ServiceNow-Beziehungen", "domain": "04", "sequence": 15, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["ENTERPRISE", "CLOUD", "PLATFORM", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0089", "concepts": ["SoT", "Ownership", "IPAM"], "needed_for": "both"}, {"id": "KB-0090", "concepts": ["Datenprodukt", "Discovery", "Drift"], "needed_for": "both"}], "related": ["KB-0092", "KB-0590", "KB-0591", "KB-0720"], "applies": ["KB-0092", "KB-0590", "KB-0591", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Lokales CI-/Service-/Owner-Beziehungsmodell prüfen.", "rationale": "Keine ServiceNowinstanz."}, "ARCHITECT-TARGET": {"active": true, "scope": "Netzwerkobjekte, Services, CIs, Ownership, Discovery, Datenqualität und Changewirkung verknüpfen.", "rationale": "Beziehungen verbinden Technik mit Geschäftsservices."}, "STAFF-TARGET": {"active": true, "scope": "CI-Drift, Incident-Impact, Discoverykonflikt und Changefreigabe testen.", "rationale": "Fehlerhafte Beziehungen verzerren Betrieb."}, "CHIEF-TARGET": {"active": true, "scope": "CMDB-/SoT-Governance, Datenqualität, Betriebsmodell und Audit steuern.", "rationale": "Servicebeziehungen sind Unternehmensdaten."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "ServiceNow Discovery/Service Mapping/CMDB Health, CSDM, IntegrationHub und APIs sind Vertiefungen.", "rationale": "Kern ist kontrollierte Beziehungssemantik."}}, "lab_validation": [{"lab_id": "KB-0091-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Lokales Modell", "evidence": "Ein CI ohne Owner/Service bleibt unvollständig.", "limitations": "Keine CMDB, Discovery oder Produktion."}]}
---
# Netzwerk und ServiceNow-Beziehungen

> **Ziel:** Netzwerkdaten werden wertvoll, wenn sie mit Services, CIs, Standorten, Verantwortlichen, Risiken und Changes verbunden sind. Eine CMDB-Beziehung ist nur dann verlässlich, wenn Semantik, Quelle, Owner, Frische, Datenqualität und Korrekturpfad geklärt sind.

## Zweck, Mental Model und Dependencies

Netzwerk-SoT/IPAM, Discovery und ServiceNow/CMDB haben unterschiedliche Aufgaben. SoT hält freigegebene Netzabsicht; Discovery misst beobachteten Zustand; CMDB verbindet CIs und Geschäfts-/Technikservices. Keine Quelle darf eine andere ungeprüft überschreiben. Die kanonische CMDB-Vertiefung liegt in Domain 25; dieses Kapitel beschreibt Netzwerkübergaben.

Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0089](13-netbox-als-source-of-truth.md) und [KB-0090](14-nautobot-und-netzwerkdatenprodukte.md).

~~~text
network SoT/device/IP/circuit -> governed mapping -> CMDB CI/relationship/service/owner
        ^ observed discovery               |                 |
        +-> discrepancy/quality <----------+-> incident/change/impact
~~~

## Core Concepts, Architektur und Implementierung

| Beziehung | Bedeutung | Anti-Pattern |
|---|---|---|
| device -> site/rack | physische Zuordnung | Standort aus Hostname raten |
| interface -> circuit/provider | Übergabe/Abhängigkeit | Link-up als komplette Servicewirkung |
| network/VRF/prefix -> service | Netzkontext unterstützt Service | Präfix ohne Owner/Service |
| CI -> owner/support group | Betriebsverantwortung | Teamname ohne Eskalationsvertrag |
| service -> dependency | Impact-/Changebeziehung | automatische Kausalität aus Discovery |
| observation -> CI | gemessene Evidenz mit Zeit/Quelle | Discovery überschreibt genehmigten CI |

Mappingregeln definieren stabile Identitäten, erlaubte Quellen, Matchingpriorität, Konfidenz, Frische, Owner, Konfliktworkflow und Audit. Seriennummer, Provider-Circuit-ID oder kontrollierte UUID sind oft robuster als Namen oder IP allein. Discovery erzeugt Kandidaten und Discrepancies; freigegebene Prozesse entscheiden Änderungen.

## Scalability, Reliability, Security und Observability

Skalierung umfasst CI-/Relationzahl, Discovery-/APIrate, Reconciliationjobs, Klassenmodell, Stale Records, Ownership, Audit und Changevolumen. Reliability verlangt Backup/Restore, Schnittstellenmonitoring, pausierbare Synchronisierung, rückspielbare Revisionen und einen Betriebsmodus bei CMDB-/Discoveryausfall. Falsche Impactbeziehungen können in einem Incident Zeit kosten oder einen unzulässigen Change freigeben.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Incident trifft falsches Team | Owner/relationship stale | CI/source/freshness/audit prüfen |
| Changeimpact zu groß/klein | service mapping unvollständig | dependency evidence and owner review |
| Discoveryduplikat | identity/matching conflict | stable ID, source priority, merge review |
| Netzwerkgerät fehlt | scope/credential/API/retention | collector coverage and discrepancy queue |
| Service grün, path rot | CMDB relation is metadata only | data-plane/SLI separat messen |

Security schützt Contact-, Standort-, IP-, Provider- und Architekturinformationen durch RBAC, least privilege, Tokens/Secrets, Audit, Datenminimierung, Retention und Exportkontrolle. Service-/CI-Information ersetzt keine Zugriffserlaubnis oder Networkpolicy.

## Trade-offs, Entscheidungen und Checklist

**Staff** testet Mapping-, Konflikt-, Discovery-, API-, Changeimpact- und Restorefälle. **Principal** standardisiert CI-/Relationshipsemantik, Quellen, Quality-SLO, Owner und Integrationsgates. **Chief** entscheidet CMDB-/SoT-Governance, Audit, Skills, Betriebsbudget und Exit.

- [ ] CI-/Service-/Owner-/Relationshipsemantik, Quellen, IDs und Frische definiert.
- [ ] Discoverykonflikt, approval/audit, API/RBAC, backup/restore und Driftworkflow getestet.
- [ ] Change-/incident-impact nutzt Relations als Hinweis und prüft realen Data Plane/SLI zusätzlich.

## Interviewfragen

### 1. Ist Discovery eine autoritative CMDB-Quelle?

**Antwort:** Sie ist Beobachtung. Autorität hängt von semantischem Scope, Identität, Frische, Owner und kontrolliertem Reconciliationprozess ab.

### 2. Warum reicht eine IP nicht als CI-Identität?

**Antwort:** IPs können umgenutzt, überlappend, übersetzt oder temporär sein. Stabile, kontextreiche Identitäten sind nötig.

### 3. Wie vermeidest du falsche Changeimpacts?

**Antwort:** Beziehungen brauchen Quelle, Evidence, Ownerreview, Frische und Gegenprüfung am realen Service-/Datenpfad.

### 4. Was ist Datenqualität hier?

**Antwort:** Vollständigkeit, Eindeutigkeit, Konsistenz, Frische, nachvollziehbare Quelle, Owner und rechtzeitige Konfliktauflösung.

### 5. Wie schützt du CMDB-Daten?

**Antwort:** RBAC, minimaler Zugriff, sichere APIs/Tokens, Audit, Retention/Exportkontrolle und Klassifikation.

### 6. Was passiert bei CMDB-Ausfall?

**Antwort:** Ein definierter degradierter Prozess nutzt geprüfte Exporte, pausiert riskante Sync/Changes und stellt aus Backups wieder her.

## Praktische Labs

~~~python
ci={"name":"edge-a","owner":None,"service":None}
assert ci["owner"] is None or ci["service"] is None
print("Unowned or unlinked CI is incomplete; local model only.")
~~~

## Dependencies, Cross-References und Quellen

1. [ServiceNow CMDB Documentation](https://www.servicenow.com/docs/bundle/zurich-servicenow-platform/page/product/configuration-management/concept/cmdb-landing-page.html), abgerufen 2026-09-16.
2. [NIST SP 800-207](https://csrc.nist.gov/pubs/sp/800/207/final), abgerufen 2026-09-16.

Zeitabhängige ServiceNow-/CSDM-/Discovery-/API-/Lizenz- und Integrationsdetails vor Einsatz aktuell prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| service graph/reconciliation | established/adopting je Plattform | source priority, evidence, owner and drift validate. |
| event-to-CI correlation | adopting | false positives, privacy, incident workflow and audit prove. |
| AI impact analysis | emerging | evidence, confidence, human approval and safe failure require. |

Ein Pilot akzeptiert eine Netzwerk-CMDB-Innovation erst, wenn CI-/Service-/Owner-/Relationship-/Source-/Identity-/Discovery-/Reconciliation-/Drift-/Changeimpact-/Rollbacksemantik, Data-Quality-SLO, Security/Privacy, Observability, Capacity/Cost und Exit nachgewiesen sind.
