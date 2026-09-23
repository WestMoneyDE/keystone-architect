---
{"id": "KB-0096", "title": "GNMI und GNOI", "domain": "04", "sequence": 20, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "CLOUD", "PLATFORM", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0095", "concepts": ["YANG", "Datastore", "Capability"], "needed_for": "both"}, {"id": "KB-0093", "concepts": ["Polling", "Monitoring"], "needed_for": "understanding"}], "related": ["KB-0097", "KB-0098", "KB-0562", "KB-0720"], "applies": ["KB-0097", "KB-0098", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Lokales Subscription-/Pfad-/RPC-Modell mit Fehlerfällen selbst prüfen.", "rationale": "Kein Gerät, kein gNMI-Target nötig."}, "ARCHITECT-TARGET": {"active": true, "scope": "Telemetry-Pfad, Subscription-Mode, RPC-Scope, Auth und Ausfallverhalten als Vertrag entwerfen.", "rationale": "gNMI/gNOI sind API-Verträge mit Betriebsfolgen."}, "STAFF-TARGET": {"active": true, "scope": "Reconnect-Verhalten, Sample-Verlust, RPC-Fehlklassen und Berechtigungsgrenzen testen.", "rationale": "Streaming-Telemetry hat andere Fehlermodi als Polling."}, "CHIEF-TARGET": {"active": true, "scope": "Telemetry-/Automationsstandard, Vendor-Coverage und Betriebsmodellwechsel von Polling zu Streaming entscheiden.", "rationale": "Migrationsentscheidung mit Werkzeug- und Skillfolgen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "gNMI Dial-in/Dial-out, gNOI Cert/OS/Factory-RPCs und OpenConfig-Pfadmodellierung sind Vertiefung.", "rationale": "Kern ist kontrollierte Telemetry und sichere Betriebs-RPCs."}}, "lab_validation": [{"lab_id": "KB-0096-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales fiktives Subscription-/RPC-Modell", "evidence": "Ein abgelaufenes Sample-Intervall wird als Datenlücke erkannt, nicht als stabiler Wert interpretiert.", "limitations": "Kein reales gNMI/gNOI-Target, keine Geräte, keine Produktion."}]}
---
# GNMI und GNOI

> **Ziel:** gNMI liefert modellierte Konfiguration und Streaming Telemetry über eine einzige gRPC-Verbindung; gNOI liefert Betriebs-RPCs wie Zertifikatswechsel, OS-Installation oder Reboot. Gegenüber Polling reduziert Streaming Latenz und Last, ersetzt aber nicht Berechtigungsprüfung, Reconnect-Handling und Datenlückenerkennung.

## Zweck, Mental Model und Dependencies

gNMI (gRPC Network Management Interface) kapselt Get/Set/Subscribe für YANG-/OpenConfig-Pfade über gRPC; gNOI kapselt sicherheitskritische Betriebsaktionen als separate RPC-Dienste. Beide sind keine Ersatz-Standards für NETCONF/RESTCONF, sondern ein anderer Transport- und Interaktionsstil mit eigenem Fehler- und Berechtigungsmodell. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0095](19-netconf-restconf-und-yang.md) und [KB-0093](17-snmp-und-geraeteueberwachung.md).

~~~text
subscription request -> path/mode(stream|once|poll) -> device telemetry -> sample/heartbeat -> collector
        ^ auth/RBAC                 ^ sample loss?                              ^ gap detection
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Subscribe-Mode | stream/once/poll, sample vs. on-change? | falsche Annahme über Aktualität |
| Pfadmodell | OpenConfig/vendor-Pfad, Version, Coverage? | Pfad existiert nicht auf Zielplattform |
| gNOI-Scope | Cert, OS, Factory Reset, Reboot, Ping? | destruktive RPC ohne ausreichende Prüfung |
| Reconnect | Backoff, Resync, Heartbeat-Timeout? | stiller Datenausfall wird als „stabil“ gelesen |
| Auth/RBAC | mTLS, Rolle, Scope pro RPC? | zu weite Berechtigung für Betriebs-RPCs |

Implementierung beginnt mit Capability-/Pfad-Discovery, minimalem Subscription-Scope, mTLS/Auth, getrennten RBAC-Rollen für Telemetry versus gNOI-Betriebsaktionen, Heartbeat-/Gap-Detection, Backoff, Collector-Puffer und explizitem Freigabeprozess für destruktive gNOI-RPCs wie Factory Reset. Ein fehlendes Sample ist ein Ereignis, kein Nullwert.

## Scalability, Reliability, Security und Observability

Skalierung hängt von Anzahl Targets, Pfaden, Sample-Rate, Collector-Fanout und gRPC-Verbindungslimits ab. Reliability erfordert Reconnect mit Backoff, Resubscribe, Dedup und explizite Behandlung von Lücken statt linearer Interpolation. Ein „on-change“-Modus reduziert Last, verlangt aber Vertrauen in die korrekte Change-Erkennung des Targets.

| Symptom | Ursache | Gegenprobe |
|---|---|---|
| Telemetry-Lücke als Nullwert geplottet | fehlende Gap-Detection | Heartbeat/Timestamp-Kontinuität prüfen |
| Subscription bricht dauerhaft ab | Auth-Ablauf, RBAC, Ressourcenlimit | Reconnect-Log, Zertifikatsgültigkeit, Quota |
| gNOI-RPC nicht verfügbar | Plattform/Version unterstützt Dienst nicht | Capability-Antwort vor RPC-Aufruf prüfen |
| Reboot/Factory-Reset falsch ausgelöst | zu weite RBAC-Rolle, fehlende Bestätigung | Rollenscope, Change-Approval, Audit-Log |
| Sample-Rate überlastet Collector | zu granulare Pfade/Rate ohne Kapazitätsplanung | Fanout- und Backpressure-Metriken |

Security trennt strikt Telemetry-Lesezugriff von gNOI-Betriebsaktionen; mTLS, kurzlebige Zertifikate, minimale RBAC-Scopes pro RPC-Familie und vollständiges Audit-Logging destruktiver Aktionen sind Pflicht. Observability korreliert Subscription-Status, Sample-Lücken, RPC-Erfolg/-Fehler, Auth-Fehler und Collector-Kapazität.

## Trade-offs, Entscheidungen und Checklist

**Staff** testet Reconnect, Sample-Verlust, RBAC-Grenzen und gNOI-Fehlerpfade vor Rollout. **Principal** definiert Pfad-/Subscription-/RBAC-Standards und Migrationsstrategie von Polling zu Streaming. **Chief** entscheidet Coverage-Anforderungen, Vendor-Interoperabilität und ob gNOI-Betriebsaktionen zentral orchestriert werden dürfen.

- [ ] Pfad-/Capability-Coverage pro Zielplattform geprüft.
- [ ] mTLS/RBAC getrennt für Telemetry und gNOI-Betriebsaktionen implementiert.
- [ ] Reconnect, Gap-Detection, Backoff und Collector-Kapazität getestet.
- [ ] Destruktive gNOI-RPCs mit Approval-Prozess und Audit-Log abgesichert.

## Interviewfragen

### 1. Was unterscheidet gNMI von SNMP-Polling?

**Antwort:** gNMI streamt Änderungen oder Samples aktiv über eine persistente gRPC-Verbindung statt periodisch abzufragen; das reduziert Latenz und Last, verlangt aber Reconnect- und Lückenlogik.

### 2. Was ist gNOI und warum getrennt von gNMI?

**Antwort:** Betriebs-RPCs wie Zertifikatswechsel oder Reboot sind sicherheitskritisch und werden separat autorisiert, damit Telemetry-Leser nicht automatisch destruktive Aktionen ausführen können.

### 3. Wie erkennst du eine Telemetry-Lücke?

**Antwort:** Über Heartbeat/Timestamp-Kontinuität und Reconnect-Logs, nicht über einen scheinbar stabilen letzten Wert.

### 4. Wann ist on-change riskant?

**Antwort:** Wenn die Change-Erkennung des Targets fehlerhaft oder unvollständig ist und dadurch reale Änderungen nicht gemeldet werden.

### 5. Wie sicherst du Factory-Reset-RPCs ab?

**Antwort:** Über minimale RBAC-Rolle, expliziten Approval-Schritt, Audit-Log und getrennte Anmeldedaten von reinen Telemetry-Clients.

### 6. Warum reicht Capability-Discovery nicht allein?

**Antwort:** Sie zeigt unterstützte Pfade/RPCs, aber nicht Sample-Rate-Grenzen, Lastverhalten oder reale Betriebssemantik unter Fehlerbedingungen.

## Praktische Labs

~~~python
samples = [{"t": 1, "v": 10}, {"t": 2, "v": 10}, {"t": 5, "v": 10}]
gap = samples[2]["t"] - samples[1]["t"] > 1
assert gap
print("Missing heartbeat detected as a gap, not interpolated as a stable value.")
~~~

## Dependencies, Cross-References und Quellen

1. [gNMI Specification (OpenConfig)](https://github.com/openconfig/gnmi/blob/master/doc/gnmi-specification.md), abgerufen 2026-09-17.
2. [gNOI Specification (OpenConfig)](https://github.com/openconfig/gnoi), abgerufen 2026-09-17.
3. [gRPC Documentation](https://grpc.io/docs/), abgerufen 2026-09-17.

Zeitabhängige Vendor-Coverage, Pfadmodelle, gRPC-Client-Versionen und Sicherheitsdetails vor Einsatz aktuell prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| gNMI als primärer Telemetry-Transport | adopting je Vendor | Pfad-Coverage, Sample-Last und Collector-Kapazität vor Migration prüfen. |
| gNOI für zentralisierte Zertifikatsrotation | adopting | RBAC-Trennung, Audit und Rollback-Pfad vor Rollout nachweisen. |
| kombinierte gNMI/gNOI-Orchestrierung | emerging | Blast Radius, Approval-Gates und Fehlerisolation vor Breiteneinsatz testen. |

Ein Pilot akzeptiert gNMI/gNOI erst, wenn Pfad-Coverage, Auth/RBAC-Trennung, Reconnect-/Gap-Verhalten, Audit-Logging destruktiver RPCs, Kapazität und Rollback nachgewiesen sind.
