---
{"id": "KB-0107", "title": "Sharding und Mandantenplatzierung", "domain": "05", "sequence": 7, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0106", "concepts": ["Partitionierung", "Hotspot"], "needed_for": "both"}], "related": ["KB-0108", "KB-0562", "KB-0720"], "applies": ["KB-0108", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Shard-Routing und Resharding eines übergroßen Mandanten lokal simulieren.", "rationale": "Kein Cluster nötig, um das Prinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Shard-Schlüssel und Mandantenplatzierung anhand Fehlerisolation, Cross-Shard-Kosten und großer Mandanten begründet entwerfen.", "rationale": "Ein falscher Shard-Schlüssel erzwingt teure Cross-Shard-Operationen oder Hotspots."}, "STAFF-TARGET": {"active": true, "scope": "Cross-Shard-Abfragekosten und einen übergroßen Mandanten (Noisy Neighbor) diagnostizieren.", "rationale": "Große Mandanten sind eine häufige, vorhersehbare Skalierungsgrenze."}, "CHIEF-TARGET": {"active": true, "scope": "Mandanten-Isolationsstandard (shared vs. dedicated shard ab welcher Größe) als Governance-Regel festlegen.", "rationale": "Fehlende Isolation großer Mandanten gefährdet andere Kunden im selben Shard."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Automatisierte Shard-Splitting-Algorithmen und Live-Migration ohne Downtime sind Vertiefung.", "rationale": "Kern ist Shard-Schlüsselwahl und der sichere Migrationspfad."}}, "lab_validation": [{"lab_id": "KB-0107-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Mandanten-Shard-Zuordnung", "evidence": "Ein überproportional großer Mandant auf einem gemeinsamen Shard erhöht die Last für alle Co-Mandanten messbar.", "limitations": "Kein reales Sharding-System, keine echte Last, keine Produktion."}]}
---
# Sharding und Mandantenplatzierung

> **Ziel:** Sharding verteilt Daten über eine Anwendungsebene (nicht nur Speicherebene) auf mehrere unabhängige Datenbankinstanzen. Bei Multi-Tenant-Systemen entscheidet die Mandantenplatzierung über Fehlerisolation, Cross-Shard-Kosten und den Umgang mit überproportional großen Mandanten.

## Zweck, Mental Model und Dependencies

Sharding ist Partitionierung ([KB-0106](06-partitionierung-und-datenverteilung.md)) auf Anwendungsebene: jeder Shard ist eine eigenständige Datenbankinstanz mit eigenem Failure-Domain, nicht nur eine logische Aufteilung innerhalb eines Systems. Der Shard-Schlüssel bestimmt, welcher Mandant/welche Entität auf welchem Shard landet, und damit auch, welche Abfragen shard-lokal bleiben und welche Cross-Shard-Koordination brauchen. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0106](06-partitionierung-und-datenverteilung.md).

~~~text
tenant_id -> shard_key -> routing table -> Shard1 | Shard2 | Shard3 (independent DB instances)
                                  ^ big tenant?      ^ noisy neighbor risk on shared shard
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Shard-Schlüssel | fachlich sinnvoll (z. B. tenant_id) statt technisch bequem? | Cross-Shard-Joins für häufige Abfragen |
| Routing | zentrale Tabelle vs. berechnet (Hash)? | Routing-Tabelle als Single-Point |
| großer Mandant | dedizierter Shard ab welcher Größe/Last? | Noisy-Neighbor-Effekt für Co-Mandanten |
| Resharding | Migrationspfad ohne Downtime getestet? | Datenverlust/Doppelbuchung während Migration |

Implementierung beginnt mit einer klaren Isolationsregel (z. B. „ab X aktiven Nutzern erhält ein Mandant einen dedizierten Shard“), einer Routing-Schicht, die Mandanten transparent umziehen kann, und einem getesteten Zwei-Phasen-Migrationsprozess (Dual-Write/Backfill, Verifikation, Cutover, Cleanup) statt einer einmaligen manuellen Kopie.

## Scalability, Reliability, Security und Observability

Skalierung profitiert von unabhängigen Failure-Domains: ein Ausfall eines Shards betrifft nur dessen Mandanten. Reliability-Grenze: ohne Isolationsregel kann ein einzelner überproportional aktiver Mandant („Noisy Neighbor“) die Performance aller Co-Mandanten auf demselben Shard degradieren.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| mehrere Mandanten auf einem Shard gleichzeitig langsam | Noisy-Neighbor durch einen großen Mandanten | Last pro Mandant auf dem betroffenen Shard messen |
| Abfrage über mehrere Mandanten sehr langsam | Cross-Shard-Query ohne Aggregationsschicht | Anzahl beteiligter Shards pro Abfrage zählen |
| Mandant nach Migration inkonsistent | fehlende Verifikation vor Cutover | Datenabgleich zwischen altem und neuem Shard prüfen |
| Routing liefert falschen Shard nach Umzug | veraltete Routing-Tabelle/Cache | Cache-Invalidierung bei Migration prüfen |

Security: Sharding kann Mandantentrennung als Sicherheitsgrenze verstärken (physische Trennung sensibler Mandanten), erfordert aber konsistente Zugriffskontrolle über alle Shards hinweg. Observability korreliert Last/Latenz pro Shard, Mandantenverteilung pro Shard und Migrationsstatus.

## Trade-offs und Entscheidungen

**Staff** misst reale Last pro Mandant, um Noisy-Neighbor-Kandidaten proaktiv zu identifizieren. **Principal** definiert Isolationsschwellen und einen standardisierten, getesteten Migrationsprozess. **Chief** entscheidet, ob und ab welcher Mandantengröße dedizierte Infrastruktur wirtschaftlich und regulatorisch (Datenresidenz) geboten ist.

Anti-Patterns: Shard-Schlüssel nach technischer Bequemlichkeit statt fachlichem Zugriffsmuster wählen; große Mandanten ohne Isolationsschwelle auf gemeinsamen Shards belassen; Resharding ohne getesteten Rollback-Pfad live durchführen.

## Production Checklist

- [ ] Shard-Schlüssel an häufigstem Zugriffsmuster ausgerichtet, Cross-Shard-Abfragen minimiert.
- [ ] Isolationsschwelle für große Mandanten definiert und überwacht.
- [ ] Migrationsprozess (Dual-Write, Verifikation, Cutover, Rollback) getestet.
- [ ] Monitoring für Last pro Shard und pro Mandant vorhanden.

## Interviewfragen

### 1. Was unterscheidet Sharding von reiner Partitionierung?

**Antwort:** Sharding verteilt Daten auf eigenständige Datenbankinstanzen mit eigenem Failure-Domain, während Partitionierung auch innerhalb eines einzigen Systems erfolgen kann.

### 2. Wie wählst du einen guten Shard-Schlüssel?

**Antwort:** Anhand des häufigsten Zugriffsmusters, meist mandantenbasiert, damit die meisten Abfragen shard-lokal bleiben und keine teure Cross-Shard-Koordination brauchen.

### 3. Was ist ein Noisy Neighbor?

**Antwort:** Ein überproportional aktiver Mandant auf einem gemeinsam genutzten Shard, dessen Last die Performance anderer Mandanten auf demselben Shard degradiert.

### 4. Wie migrierst du einen Mandanten sicher zwischen Shards?

**Antwort:** Über Dual-Write in beide Shards, Backfill historischer Daten, Verifikation der Konsistenz, kontrollierten Cutover und erst danach Cleanup der alten Daten.

### 5. Warum sind Cross-Shard-Abfragen ein Problem?

**Antwort:** Sie erfordern Koordination über mehrere unabhängige Datenbankinstanzen, was Latenz, Konsistenzaufwand und Fehlerfläche gegenüber shard-lokalen Abfragen deutlich erhöht.

### 6. Widersprüchliche Anforderung: Produkt will beliebig viele Mandanten pro Shard UND garantierte Performance-Isolation — wie gehst du vor?

**Antwort:** Ich würde erklären, dass unbegrenzte Ko-Lokation und garantierte Isolation sich widersprechen; Alternative ist eine Lastschwelle, ab der Mandanten automatisch auf dedizierte Shards migriert werden, mit messbarer Kapazitätsreserve pro Shard.

## Praktische Labs

~~~python
shard_load = {"shard1": 0}
tenants = {"small_a": 5, "small_b": 5, "big_tenant": 90}
for t, load in tenants.items():
    shard_load["shard1"] += load

noisy_neighbor_share = tenants["big_tenant"] / shard_load["shard1"]
assert noisy_neighbor_share > 0.8
print(f"big_tenant consumes {noisy_neighbor_share:.0%} of shared shard capacity - isolation needed.")
~~~

## Dependencies, Cross-References und Quellen

1. Kleppmann: [Designing Data-Intensive Applications, Kapitel 6 (Partitioning)](https://dataintensive.net/), O'Reilly 2017, abgerufen 2026-09-17.

Produktspezifische Sharding-/Migrations-Tooling-Details vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisiertes Shard-Splitting bei erkanntem Hotspot | Adopting je Anbieter | Beobachtbarkeit und Rollback-Fähigkeit vor Vertrauen prüfen. |
| Serverless/elastic Sharding ohne manuelle Kapazitätsplanung | Emerging | Kostenmodell und Cold-Start-Latenz gegen Nutzen abwägen. |

Ein Team akzeptiert eine Sharding-Strategie erst, wenn Isolationsschwellen, Migrationsprozess und Cross-Shard-Kosten für reale Zugriffsmuster nachgewiesen sind.
