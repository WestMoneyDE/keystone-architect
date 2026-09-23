---
{"id": "KB-0093", "title": "SNMP und Geräteüberwachung", "domain": "04", "sequence": 17, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["ENTERPRISE", "CLOUD", "PLATFORM", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0060", "concepts": ["UDP", "Ports"], "needed_for": "understanding"}, {"id": "KB-0075", "concepts": ["Messpunkte", "Anfragepfad"], "needed_for": "both"}, {"id": "KB-0087", "concepts": ["Management Plane", "API", "Drift"], "needed_for": "understanding"}], "related": ["KB-0094", "KB-0095", "KB-0562", "KB-0720"], "applies": ["KB-0094", "KB-0095", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Lokale fiktive Counter-/Polling-/Trapdaten auswerten.", "rationale": "Keine Geräte oder SNMP-Pakete."}, "ARCHITECT-TARGET": {"active": true, "scope": "OID-/MIB-/Polling-/Trap-/SNMPv3-/Retention-/Alert-/SLO-Vertrag entwerfen.", "rationale": "Monitoring ist ein Daten- und Securityservice."}, "STAFF-TARGET": {"active": true, "scope": "Fehlende Samples, Counter resets, Trapverlust, Zeitversatz und Device-/Collectorfehler testen.", "rationale": "Falsche Metrikinterpretation schadet Incidents."}, "CHIEF-TARGET": {"active": true, "scope": "Observabilityplattform, Daten-/Privacy-/Securitygovernance, Kosten und Betriebsmodell entscheiden.", "rationale": "Netztelemetrie ist kritische Unternehmensinformation."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "SNMP proxy, notifications, MIB authoring, streaming telemetry, gNMI and vendor collectors are optional depth.", "rationale": "Kern ist vertrauenswürdige Gerätebeobachtung."}}, "lab_validation": [{"lab_id": "KB-0093-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Lokale Counter-Tabelle", "evidence": "Counter reset wird nicht als negativer Durchsatz interpretiert.", "limitations": "Keine SNMP-Agenten, Geräte, UDP-Pakete oder Produktion."}]}
---
# SNMP und Geräteüberwachung

> **Ziel:** SNMP macht Geräte- und Schnittstellenzustand über Managementdaten sichtbar. Verlässliche Überwachung erfordert jedoch korrekte MIB/OID-Semantik, sichere SNMPv3-Profile, passende Pollintervalle, Trapbehandlung, Zeit-/Counterlogik, Datenqualität und eine Trennung zwischen Devicezustand und Servicewirkung.

## Zweck, Mental Model und Dependencies

SNMP-Manager fragt einen Agent nach OIDs ab oder empfängt Notifications; MIBs geben OIDs Bedeutung und Datentyp. Polling liefert periodische Samples, Traps/Inform-artige Notifications signalisieren Ereignisse. Beides ist begrenzt: ein fehlendes Sample kann Collector, Netzwerk, Agent, Berechtigung, Rate oder Geräteausfall bedeuten; ein Link-up beweist keine End-to-End-Anwendung.

Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0060](../03-network-foundations/12-udp-und-multicast.md), [KB-0075](../03-network-foundations/27-netzwerkdiagnose-entlang-des-anfragepfads.md) und [KB-0087](11-sdn-und-programmierbare-netze.md).

~~~text
device agent/MIB/OID -> SNMPv3 poll/notification -> collector -> normalize/store -> alert/dashboard -> incident/SLI
         ^ version/counter/time/security        ^ loss/rate        ^ semantic and owner
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | typische Fehlinterpretation |
|---|---|---|
| MIB/OID | Welche Metrik, Einheit, Datentyp, Index? | OIDname ohne Geräte-/OS-/MIBversion |
| Polling | Wie oft, mit welchem Timeout/Retry/Scope? | jedes Intervall sei reale Kontinuität |
| Counter | monoton, 32/64 bit, reset/wrap? | negative Differenz sei negativer Traffic |
| Trap/Notification | wie wird Empfang, Dedupe, Verlust, Ack behandelt? | Event ist vollständig und einmalig |
| SNMPv3 | user, auth, privacy, view, engine/time? | SNMP ist harmloses Read-only |
| Collector | queue, parse, normalize, retention, labels | Collector-Daten seien Device-Wahrheit |

Implementiere MIB-/OID-Katalog mit Geräte-/OS-/Version-/Owner-/Einheit-/Index-/Polling-/Alert-/Retentionvertrag. SNMPv3 ersetzt unsichere Community-Profile: nutze an geeigneter Stelle Authentisierung, Privacy, minimale Views, getrennte Managementplane, Zugriffskontrolle und Secret-Lifecycle gemäß aktueller Agent-/Collectorunterstützung. Konkrete Profile, Algorithmen und Kompatibilität sind zeit-/anbieterabhängig.

## Scalability, Reliability, Security und Observability

Skaliere nach Geräten, OIDs, Pollintervallen, Antwortgröße, Collectorworkers, Netzwerk-/Agentlast, Traprate, Storage/Retention, Cardinality und Alertvolumen. Zu häufiges Polling belastet Agents, Managementnetz und Collector; zu seltenes Polling verschleiert kurze Ausfälle. Wahl folgt SLO, Fehlerart, Gerätegrenze, Kosten und Datenklasse.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| keine Samples | agent, ACL/view, DNS/IP, UDP path, collector/job | device/collector/management path and timestamps |
| traffic negative/spike | reset/wrap/index change/interval gap | uptime, counter width, interface identity |
| Trap fehlt | emitter, path, receiver queue, filter/dedupe | controlled event, receiver metrics, audit |
| Alertsturm | flap, threshold, correlated outage, bad label | event timeline, dependency/quality gates |
| SNMP grün, Service rot | device metric scope limited | path/SLI/DNS/security/application probe |

Security: SNMP-Daten können Topologie, IPs, Interfaces, Users und Betriebsmuster verraten. RBAC, SNMPv3, separate Managementplane, credential rotation, ACL/views, Audit, data minimization, retention and export control are required. Observability der Observability erfasst Pollsuccess/latency, missingness, trap ingest/drop, parser errors, time skew, agent resource and collector backlog.

## Trade-offs, Entscheidungen und Checklist

**Staff** validiert MIBsemantik, Counterreset, missing sample, traploss, SNMPv3, Agent-/Collectoroverload und die Verbindung zu SLI. **Principal** standardisiert Profile, OID-Katalog, Intervallklassen, Labels, Retention, Alert-/Incidentdesign und Migration zu ergänzender Telemetrie. **Chief** entscheidet Telemetrieplattform, Security/Privacy, Kosten, Support and lifecycle.

- [ ] MIB/OID/Version/Einheit/Index/Owner/Polling/Alert/Retention dokumentiert.
- [ ] SNMPv3/view/ACL/secrets/management plane, collector capacity and audit geprüft.
- [ ] Counter reset/wrap, missingness, trap receiver/dedupe, time skew, alerts and SLI-Gegenprobe getestet.

## Interviewfragen

### 1. Was ist der Unterschied zwischen Polling und Trap?

**Antwort:** Polling zieht periodisch Zustand ab; Trap/Notification meldet Ereignis. Beide können fehlen oder verzerrt sein und brauchen Kontrollmetriken.

### 2. Warum sind Counterdeltas schwierig?

**Antwort:** Reset, Wrap, Intervalllücke, Indexwechsel und Zeitversatz können Durchsatzberechnung verfälschen.

### 3. Warum SNMPv3?

**Antwort:** Es unterstützt je Profil Authentisierung/Privacy und feinere Zugriffssteuerung; die konkrete sichere Konfiguration wird getestet.

### 4. Wie wählst du ein Pollintervall?

**Antwort:** Nach Service-/Fehlerbudget, Gerätegrenzen, Datenwert, Kosten, Collectorlast und gewünschter Diagnoseauflösung.

### 5. Beweist ein Interface-Up eine Anwendung?

**Antwort:** Nein. Routing, DNS, ACL, MTU, Zielservice und Rückweg können weiterhin fehlschlagen.

### 6. Wie diagnostizierst du ein fehlendes Sample?

**Antwort:** Von Collectorjob und Queue über Managementpfad, Agentprozess, ACL/view/credentials und Devicezeit bis zur OID-/MIBsemantik.

## Praktische Labs

~~~python
samples=[1000,1500,20]
deltas=[b-a for a,b in zip(samples,samples[1:])]
assert deltas[-1] < 0
print("Negative delta requires reset/wrap investigation; local model only.")
~~~

## Dependencies, Cross-References und Quellen

1. [RFC 3411: SNMP Management Framework](https://datatracker.ietf.org/doc/html/rfc3411), abgerufen 2026-09-16.
2. [RFC 3414: USM for SNMPv3](https://datatracker.ietf.org/doc/html/rfc3414), abgerufen 2026-09-16.

Zeitabhängige Agent-/MIB-/OS-/Crypto-/Collector-/Retention- und Herstellerdetails vor Einsatz aktuell prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| streaming telemetry | adopting/established je Plattform | schema, scale, privacy and dual-run validation test. |
| eBPF/host network signals | adopting | trust, overhead, data retention and correlation define. |
| anomaly detection | adopting | data quality, explainability, alert fatigue and human review require. |

Ein Pilot akzeptiert eine Netzwerküberwachungs-Innovation erst, wenn MIB-/OID-/Agent-/SNMPv3-/Polling-/Trap-/Counter-/Zeit-/Collector-/Alert-/SLI-/Data-Quality-Semantik, Security/Privacy, Observability, Capacity/Cost, Owner, Change und Rollback nachgewiesen sind.
