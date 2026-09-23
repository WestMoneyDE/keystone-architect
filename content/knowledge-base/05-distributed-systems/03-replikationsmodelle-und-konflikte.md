---
{"id": "KB-0103", "title": "Replikationsmodelle und Konflikte", "domain": "05", "sequence": 3, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0102", "concepts": ["Konsistenzmodelle"], "needed_for": "both"}], "related": ["KB-0101", "KB-0104", "KB-0562", "KB-0720"], "applies": ["KB-0104", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Synchrone/asynchrone Replikation und Multi-Leader-Konflikte lokal simulieren.", "rationale": "Kein Cluster nötig, um Replikationsverzögerung und Konflikte zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Replikationsmodell (single-leader/multi-leader/leaderless) anhand Schreibverfügbarkeit und Konfliktrisiko begründet wählen.", "rationale": "Jedes Modell hat unterschiedliche Verfügbarkeits-/Konsistenz-/Komplexitätskosten."}, "STAFF-TARGET": {"active": true, "scope": "Replikationsverzögerung diagnostizieren und Konfliktauflösung nach Multi-Leader-Split testen.", "rationale": "Replikationslag ist eine häufige Ursache scheinbar zufälliger Bugs."}, "CHIEF-TARGET": {"active": true, "scope": "Replikationsstandard pro Systemklasse (single-leader als Default, Ausnahmen für Multi-Leader/Leaderless) festlegen.", "rationale": "Multi-Leader/Leaderless-Systeme erhöhen Betriebskomplexität organisationsweit."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "CRDT-Design, Vektoruhren im Detail und Leaderless-Quorum-Tuning (Dynamo-Stil) sind Vertiefung.", "rationale": "Kern ist die Wahl des richtigen Grundmodells und ehrlicher Umgang mit Konflikten."}}, "lab_validation": [{"lab_id": "KB-0103-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Multi-Leader-Konflikt", "evidence": "Zwei gleichzeitige Schreibvorgänge auf unterschiedlichen Leadern erzeugen einen erkennbaren Konflikt statt stillem Überschreiben.", "limitations": "Kein reales Replikationssystem, keine Netzwerklatenz, keine Produktion."}]}
---
# Replikationsmodelle und Konflikte

> **Ziel:** Replikation hält mehrere Kopien derselben Daten synchron. Single-Leader-, Multi-Leader- und Leaderless-Replikation unterscheiden sich in Schreibverfügbarkeit, Konfliktrisiko und Betriebskomplexität. Die Wahl entscheidet, ob Konflikte überhaupt entstehen können und wie sie aufgelöst werden.

## Zweck, Mental Model und Dependencies

Single-Leader: ein Knoten nimmt alle Schreibvorgänge an und verteilt sie an Follower — Konflikte sind strukturell ausgeschlossen, aber der Leader ist ein Verfügbarkeits-Single-Point für Schreibzugriffe. Multi-Leader: mehrere Knoten akzeptieren Schreibvorgänge unabhängig und replizieren sich gegenseitig — höhere Schreibverfügbarkeit, aber Konflikte sind möglich und müssen aufgelöst werden. Leaderless: jeder Knoten kann schreiben, Konsistenz entsteht durch Quorum-Lese-/Schreibüberlappung. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0102](02-konsistenzmodelle-verteilter-systeme.md).

~~~text
single-leader:  client -> Leader -> {Follower1, Follower2}  (writes serialized at Leader)
multi-leader:   client -> LeaderA / LeaderB (independent)    (concurrent writes possible -> conflict)
leaderless:     client -> N nodes (write quorum W, read quorum R, R+W>N for overlap)
~~~

## Core Concepts, Architektur und Implementierung

| Modell | Schreibverfügbarkeit | Konfliktrisiko | typischer Einsatz |
|---|---|---|---|
| Single-Leader | begrenzt durch Leader-Erreichbarkeit | keine (serialisiert) | die meisten OLTP-Datenbanken |
| Multi-Leader | hoch (mehrere Schreibpunkte) | ja, muss aufgelöst werden | Multi-Region-Systeme mit lokalem Schreibbedarf |
| Leaderless | hoch (Quorum-basiert) | ja, über Versionsvektoren erkennbar | hochverfügbare Key-Value-Stores |

Implementierung: Single-Leader benötigt Failover-Mechanik (Leader-Wahl, siehe [KB-0104](04-konsens-und-quoren.md)) und Entscheidung sync/async pro Follower. Multi-Leader benötigt eine explizite Konfliktauflösungsstrategie (Last-Write-Wins mit Zeitstempel, Versionsvektoren mit Anwendungs-Merge, oder CRDT-Datentypen). Leaderless benötigt konfigurierbare Quorum-Größen (R, W, N) und Read-Repair/Hinted-Handoff für Konsistenzangleichung nach Ausfällen.

## Scalability, Reliability, Security und Observability

Replikationsverzögerung (Lag) wächst mit Schreiblast, Netzwerkdistanz und Follower-Anzahl. Reliability-Grenze bei Single-Leader: ein Leader-Ausfall erzeugt eine Schreibpause bis zur Wahl eines neuen Leaders; bei Multi-Leader/Leaderless besteht stattdessen ständiges Konfliktrisiko, das nicht ignoriert werden darf.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Follower liefert veralteten Wert | Replikationslag | Lag-Metrik (Offset/Zeit hinter Leader) prüfen |
| zwei Regionen zeigen unterschiedliche „aktuelle“ Werte dauerhaft | Multi-Leader-Konflikt ohne Auflösung | Konfliktlog/Merge-Historie beider Seiten prüfen |
| Schreibvorgang wird nach Leaderwechsel abgelehnt | alter Leader noch aktiv, Split Brain möglich | Fencing-Token/Epoche des aktuellen Leaders prüfen |
| Leaderless-Lesevorgang liefert inkonsistente Werte trotz Quorum | R+W ≤ N falsch konfiguriert | Quorum-Formel gegen tatsächliche Konfiguration prüfen |

Security: Replikationskanäle benötigen Authentifizierung/Verschlüsselung, da sie vollständige Datenkopien übertragen; ein kompromittierter Follower kann als Datenexfiltrationspfad dienen. Observability korreliert Lag pro Follower/Region, Konfliktanzahl über Zeit und Leader-Wechsel-Historie.

## Trade-offs und Entscheidungen

**Staff** testet Failover-Verhalten, Lag unter Last und Konfliktauflösung unter simulierter Netzwerktrennung. **Principal** definiert Single-Leader als Default und verlangt explizite Begründung plus Konfliktauflösungsstrategie für Multi-Leader/Leaderless-Ausnahmen. **Chief** entscheidet, für welche Systemklassen die höhere Betriebskomplexität von Multi-Leader/Leaderless durch den Verfügbarkeitsgewinn gerechtfertigt ist.

Anti-Patterns: Multi-Leader einsetzen, ohne eine Konfliktauflösungsstrategie zu definieren („wird schon nicht passieren“); Replikationslag ignorieren und Follower für konsistenzkritische Lesevorgänge nutzen; Failover ohne Fencing, was zu Split Brain mit zwei aktiven Leadern führen kann.

## Production Checklist

- [ ] Replikationsmodell und Begründung (Verfügbarkeit vs. Konfliktrisiko) dokumentiert.
- [ ] Konfliktauflösungsstrategie definiert und getestet, wenn Multi-Leader/Leaderless gewählt wurde.
- [ ] Failover-Mechanismus mit Fencing gegen Split Brain getestet.
- [ ] Lag-Monitoring pro Follower/Region vorhanden und mit SLO verknüpft.

## Interviewfragen

### 1. Warum sind Single-Leader-Systeme konfliktfrei?

**Antwort:** Weil alle Schreibvorgänge an einem Punkt serialisiert werden, bevor sie an Follower verteilt werden; es gibt keine zwei unabhängigen Schreibpfade, die kollidieren könnten.

### 2. Wann rechtfertigt sich Multi-Leader-Replikation trotz Konfliktrisiko?

**Antwort:** Wenn lokale Schreibverfügbarkeit über mehrere Regionen wichtiger ist als konfliktfreie Serialisierung und eine belastbare Konfliktauflösungsstrategie existiert.

### 3. Was bedeutet R+W>N bei Leaderless-Replikation?

**Antwort:** Dass sich Lese- und Schreibquorum immer überschneiden, sodass mindestens ein gelesener Knoten den zuletzt geschriebenen Wert kennt.

### 4. Was ist Split Brain und wie verhinderst du es?

**Antwort:** Zwei Knoten glauben gleichzeitig, Leader zu sein, und akzeptieren beide Schreibvorgänge; Fencing-Token/Epochennummern verhindern, dass ein alter Leader nach Wiederverbindung weiterhin akzeptiert wird.

### 5. Wie diagnostizierst du Replikationslag als Ursache eines Bugs?

**Antwort:** Über eine Lag-Metrik pro Follower und Korrelation mit dem Zeitpunkt der gemeldeten Anomalie; ein Read direkt nach Write auf einem lagging Follower erklärt scheinbar „verschwundene“ Daten.

### 6. Widersprüchliche Anforderung: Produkt will lokale Schreibgeschwindigkeit in drei Regionen UND garantiert keine Konflikte — wie gehst du vor?

**Antwort:** Diese Kombination ist mit Multi-Leader nicht erreichbar; ich würde entweder Single-Leader mit regionalem Latenzkompromiss vorschlagen oder Multi-Leader mit einer expliziten, für das Produkt tolerierbaren Konfliktauflösungsstrategie und das Restrisiko dokumentieren.

## Praktische Labs

~~~python
class MultiLeaderStore:
    def __init__(self):
        self.log = []

    def write(self, leader, value, ts):
        self.log.append({"leader": leader, "value": value, "ts": ts})

store = MultiLeaderStore()
store.write("regionA", "price=10", ts=100)
store.write("regionB", "price=12", ts=100)  # concurrent write, same timestamp

conflict = len({e["value"] for e in store.log if e["ts"] == 100}) > 1
assert conflict
print("Concurrent writes with equal timestamp are flagged as a conflict, not silently merged.")
~~~

## Dependencies, Cross-References und Quellen

1. DeCandia et al.: [Dynamo: Amazon's Highly Available Key-value Store](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf), SOSP 2007, abgerufen 2026-09-17.

Produktspezifische Replikationsdefaults und Quorum-Konfigurationsgrenzen vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| CRDTs für automatische, verlustfreie Konfliktauflösung | Adopting | Nur für Datentypen mit definierter Merge-Semantik (Zähler, Sets) einsetzen. |
| Geo-partitionierte Single-Leader-Architekturen (Leader pro Shard/Region) | Established | Shard-Grenze und Cross-Shard-Transaktionsrisiko prüfen. |
| Automatisierte Konflikterkennung in CI/Chaos-Tests | Adopting | Vor Vertrauen: reale Multi-Leader-Partitionssimulation gegen dokumentierte Auflösungsstrategie fahren. |

Ein Team akzeptiert Multi-Leader- oder Leaderless-Replikation erst, wenn Konfliktauflösung, Failover-Fencing und Lag-Monitoring nachweisbar getestet sind.
