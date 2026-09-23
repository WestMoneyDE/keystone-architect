---
{"id": "KB-0094", "title": "NetFlow und IPFIX", "domain": "04", "sequence": 18, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["ENTERPRISE", "CLOUD", "PLATFORM", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0060", "concepts": ["UDP", "Transport"], "needed_for": "understanding"}, {"id": "KB-0075", "concepts": ["Messpunkte", "Anfragepfad"], "needed_for": "both"}, {"id": "KB-0093", "concepts": ["Monitoring", "Zeit", "Datenqualität"], "needed_for": "both"}], "related": ["KB-0095", "KB-0096", "KB-0562", "KB-0720"], "applies": ["KB-0095", "KB-0096", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Lokale fiktive Flowexport-/Samplingdaten auswerten.", "rationale": "Keine Flowexporter oder Pakete."}, "ARCHITECT-TARGET": {"active": true, "scope": "Exporter, Template, Sampling, Collector, Retention, Privacy, Loss und SLO entwerfen.", "rationale": "Flowdaten sind verdichtete Beobachtung."}, "STAFF-TARGET": {"active": true, "scope": "Samplingbias, Templateverlust, Collectorbackpressure, Zeit-/Counterfehler und Incidentkorrelation testen.", "rationale": "Flowzahlen brauchen Evidenzgrenzen."}, "CHIEF-TARGET": {"active": true, "scope": "Observability-/Privacy-/Retention-/Cost-/SOC-Integration und Betriebsmodell entscheiden.", "rationale": "Flowdaten sind sensible Unternehmensdaten."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "IPFIX information elements, biflows, sFlow, eBPF flows and large-scale collectors are optional depth.", "rationale": "Kern ist interpretierbare Traffic-Evidenz."}}, "lab_validation": [{"lab_id": "KB-0094-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Lokale fiktive Flowtabelle", "evidence": "Samplingrate wird als Unsicherheitsgrenze markiert.", "limitations": "Keine Exporter, Collector, Pakete oder Produktion."}]}
---
# NetFlow und IPFIX

> **Ziel:** NetFlow/IPFIX exportiert verdichtete Flows statt vollständiger Pakete. Es hilft, Verkehrsverschiebungen, Top Talker und Policy-/Incidenthypothesen zu erkennen, beweist aber weder vollständige Payload noch jeden einzelnen Flow, wenn Sampling, Exportverlust, Templateprobleme oder Messpunktlücken bestehen.

## Zweck, Mental Model und Dependencies

Ein Exporter aggregiert Pakete nach Schlüsselfeldern und erzeugt Flowrecords; Collector empfangen, dekodieren, speichern und analysieren sie. IPFIX standardisiert das Exportformat und Information Elements; NetFlow ist eine Produktfamilie mit versionsabhängigen Semantiken. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0060](../03-network-foundations/12-udp-und-multicast.md), [KB-0075](../03-network-foundations/27-netzwerkdiagnose-entlang-des-anfragepfads.md) und [KB-0093](17-snmp-und-geraeteueberwachung.md).

~~~text
packets at observation point -> exporter aggregation/sampling/template -> transport -> collector/parser/store -> query/alert/incident
                         ^ scope/loss/time                         ^ backpressure/privacy
~~~

## Core Concepts, Architektur und Implementierung

| Element | Frage | Grenze |
|---|---|---|
| Observation point | welche Interface/VRF/VTEP/edge sieht Traffic? | kein vollständiger End-to-End-Pfad |
| Flow key | welche 5-tuple/fields/timeout define a record? | implementation/version dependent |
| Sampling | welche Rate/Algorithmus, deterministic/random? | Schätzung, nicht vollständige Zählung |
| Template | welches Feld bedeutet was? | Templateverlust/Versionswechsel verfälscht Parse |
| Export transport | UDP/TCP/SCTP/product option and queue? | Verlust/ordering/backpressure möglich |
| Collector | parse, enrich, store, query, alert | collector truth depends on received data |

IPFIX nach RFC 7011 basiert auf Templates und Data Records. Dokumentiere pro Exporter Gerät/OS, Observation Point, Interface/VRF, enabled fields, active/inactive timeout, sampling, template refresh, transport, collector, retention, owner und Qualitätsmetriken. Eine Dashboardzahl ohne diese Daten ist keine belastbare Incident- oder Kostenentscheidung.

## Scalability, Reliability, Security und Observability

Skalierung umfasst Exportrate, Flowcardinality, sampling, template churn, collector CPUs/queues, storage/index cost, enrichment, query concurrency, retention and alerting. Sampling kann Last senken, verzerrt aber kleine/kurze Flows und absolute Volumen. Exportverlust ist etwas anderes als Sampling: Sampling entscheidet bewusst am Exporter; Verlust entsteht auf Export-/Transport-/Collectorpfad und muss gemessen werden.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| plötzlicher Volumenrückgang | sampling change/export loss/template parse/traffic change | exporter config, sequence/collector drop, independent metric |
| Top talker fehlt | observation gap/flow timeout/sampling/VRF scope | observation map and packet/host/edge evidence |
| Records unlesbar | template missing/version/schema | template refresh/parser/version timeline |
| Collector lag | queue/storage/enrichment/query overload | ingest/parse/store latency and drops |
| Alert wirkt falsch | aggregation/timezone/clock/sampling bias | raw record, sampling metadata, cross-source correlation |

Flowdaten können personenbezogene IP-/Standort-/Kommunikationsmetadaten und Geschäftsbeziehungen enthalten. Schutz: least-privilege RBAC, verschlüsselte Transport-/Storageoptionen nach Plattform, Datensparsamkeit, Klassifikation, Retention, Exportkontrolle, Audit und Incidentzugriff. Vollständiger Paketmitschnitt hat andere Datenschutz-, Kosten- und Sicherheitsfolgen; Flowexport ist kein pauschal risikofreier Ersatz.

## Trade-offs, Entscheidungen und Checklist

**Staff** testet Observation Scope, Sampling/Exportloss, Templateversion, Collectorbackpressure, Zeitkorrelation und SLI-Gegenprobe. **Principal** standardisiert Exportprofile, Collector-/Retentionklassen, Privacy, Cost, Quality-SLO und SOC/SRE-Integration. **Chief** entscheidet Datenstrategie, Compliance, Betriebsbudget, zentrale/föderierte Collector und Exit.

- [ ] Observation Point/VRF/interface, fields, template, timeout, sampling, transport, collector, owner und retention dokumentiert.
- [ ] exporter/collector losses, parse/template errors, time skew, queues, storage cost and data quality monitored.
- [ ] queries state sampling/loss/scope limitations; incident/change conclusions are cross-checked with data plane/SLI.
- [ ] RBAC/transport/storage/retention/privacy/export/audit and rollback/degraded collector mode tested.

## Interviewfragen

### 1. Ist IPFIX ein Packet Capture?

**Antwort:** Nein. Es exportiert verdichtete Flowrecords und in der Regel keine vollständige Payload oder jedes Paket.

### 2. Unterschied Sampling und Exportverlust?

**Antwort:** Sampling ist eine definierte Auswahl vor Export; Verlust ist unbeabsichtigt auf Export-, Transport- oder Collectorseite und muss beobachtet werden.

### 3. Warum sind Templates wichtig?

**Antwort:** Sie definieren, wie Data Records zu interpretieren sind. Fehlende oder falsche Templates können Daten unbrauchbar machen.

### 4. Was sagt ein Top Talker aus?

**Antwort:** Er zeigt eine Beobachtung am konkreten Messpunkt und unter Sampling-/Aggregationannahmen, nicht automatisch Schuld oder End-to-End-Volumen.

### 5. Wie prüfst du Collectorqualität?

**Antwort:** Exporter-/Collector-/Parser-/Queue-/Storagemetriken, Templatezustand, Zeit, Lossindikatoren und Vergleichsquellen.

### 6. Welche Privacyfrage stellst du?

**Antwort:** Welche Kommunikationsmetadaten, Personen-/Standortbezüge, Zwecke, Zugriffe, Aufbewahrung, Exporte und Löschpfade erforderlich sind.

## Praktische Labs

~~~python
record={"bytes":1000,"sampling":100}
estimated=record["bytes"]*record["sampling"]
print({"estimated_bytes":estimated,"limitation":"sampling is an estimate"})
~~~

## Dependencies, Cross-References und Quellen

1. [RFC 7011: IPFIX Protocol](https://datatracker.ietf.org/doc/html/rfc7011), abgerufen 2026-09-16.
2. [RFC 7012: IPFIX Information Model](https://datatracker.ietf.org/doc/html/rfc7012), abgerufen 2026-09-16.

Zeitabhängige Exporter-/Collector-/OS-/Schema-/Retention-/Cloud-/Costdetails vor Einsatz aktuell prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| eBPF flow observation | adopting | scope, overhead, privacy and correlation validate. |
| real-time flow analytics | adopting/established | loss, cost, data quality and alert fatigue prove. |
| encrypted telemetry pipelines | adopting | key, access, retention and failure behavior test. |

Ein Pilot akzeptiert eine Flow-Observability-Innovation erst, wenn Observation-/Exporter-/Template-/Flow-Key-/Sampling-/Transport-/Collector-/Parser-/Retention-/Loss-/Zeit-/Query-/Data-Quality-Semantik, Security/Privacy, Observability, Capacity/Cost, Owner, Change und Rollback nachgewiesen sind.
