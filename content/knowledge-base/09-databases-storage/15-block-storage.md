---
{"id": "KB-0209", "title": "Block Storage", "domain": "09", "sequence": 15, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "CLOUD"], "requires": [{"id": "KB-0208", "concepts": ["Objektspeicher"], "needed_for": "understanding"}], "related": ["KB-0210"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Modell für IOPS-Verbrauch bei unterschiedlichen Zugriffsmustern (sequenziell vs. zufällig) durchrechnen.", "rationale": "IOPS-Grenzen werden erst durch konkrete Zugriffsmuster-Berechnung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Block Storage gegenüber Objektspeicher für latenzkritische Datenbank-Workloads begründet wählen.", "rationale": "Datenbanken benötigen niedrige, konsistente I/O-Latenz, die Objektspeicher strukturell nicht bietet."}, "STAFF-TARGET": {"active": true, "scope": "Attach-Grenzen und Fehlerdomänen von Block-Volumes für ein Team nachvollziehbar erklären.", "rationale": "Ein Block-Volume ist typischerweise an genau einen Compute-Knoten gebunden, was Failover-Design beeinflusst."}, "CHIEF-TARGET": {"active": true, "scope": "Block Storage als Grundlage für latenzkritische, strukturierte Workloads (Datenbanken) positionieren, nicht als generelle Speicherlösung.", "rationale": "Block Storage optimiert für niedrige Latenz bei kleinen, häufigen I/O-Operationen, nicht für massiv skalierbaren unstrukturierten Zugriff."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Produktspezifische Volume-Typen (Provisioned IOPS, gp3, Premium SSD) sind Vertiefung.", "rationale": "Kern ist das Verständnis von IOPS, Attach-Grenzen und Snapshot-Konsistenz, nicht die Kostenoptimierung einzelner Anbieter."}}, "lab_validation": [{"lab_id": "KB-0209-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für IOPS-Verbrauch bei sequenziellem vs. zufälligem Zugriff", "evidence": "Zufällige kleine I/O-Operationen verbrauchen das IOPS-Budget deutlich schneller als sequenzielle Operationen gleicher Gesamtgröße.", "limitations": "Kein echtes Block-Storage-Gerät, keine reale Hardware-Latenz, keine Produktion."}]}
---
# Block Storage

> **Ziel:** Block Storage (z. B. AWS EBS, Azure Managed Disks, Google Persistent Disk) stellt niedriglatenten, blockadressierten Speicher bereit, der typischerweise an genau einen Compute-Knoten gebunden ist — die natürliche Grundlage für Datenbanken und andere latenzkritische, strukturierte Workloads. Die Dimensionierung nach IOPS und Zugriffsmuster, nicht nur nach Kapazität, ist die zentrale Architekturentscheidung.

## Zweck, Mental Model und Dependencies

Block Storage präsentiert sich einem Betriebssystem wie eine lokale Festplatte: rohe Blöcke fester Größe, adressiert über Blocknummern, auf denen ein Dateisystem (oder eine Datenbank-Speicher-Engine direkt) aufsetzt. Im Gegensatz zu Objektspeicher (siehe [KB-0208](14-object-storage.md)) unterstützt Block Storage partielle In-Place-Updates einzelner Blöcke mit niedriger, konsistenter Latenz — genau das, was Datenbanken für Transaktionslogs und Indexstrukturen benötigen. Ein Block-Volume ist üblicherweise an genau einen Compute-Knoten zur gleichen Zeit angehängt (Attach-Grenze), was bedeutet, dass Hochverfügbarkeit durch Replikation auf Anwendungs- oder Speicherdienstebene erreicht werden muss, nicht durch gleichzeitigen Zugriff mehrerer Knoten auf dasselbe Volume. Die Leistungsfähigkeit wird primär in IOPS (I/O-Operationen pro Sekunde) und Durchsatz gemessen, nicht nur in Kapazität — ein Volume mit ausreichend Speicherplatz kann trotzdem für eine Workload mit hoher zufälliger I/O-Rate unzureichend dimensioniert sein. Lies [KB-0208](14-object-storage.md).

~~~text
Object storage:  whole-object writes, HTTP API, massively parallel access across many clients
Block storage:   raw addressable blocks, low latency, in-place partial writes, typically single-node attach
Database storage engines need block storage's in-place write + low latency semantics, not object storage's model
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| IOPS-Dimensionierung | ist das Volume nach tatsächlichem I/O-Zugriffsmuster (nicht nur Kapazität) dimensioniert? | Volume mit ausreichend Speicherplatz, aber unzureichenden IOPS für die reale Workload |
| Attach-Grenze | ist bekannt, dass ein Volume typischerweise nur an einen Knoten gleichzeitig gebunden ist? | Hochverfügbarkeitsdesign geht fälschlich von gemeinsamem Volume-Zugriff mehrerer Knoten aus |
| Snapshot-Konsistenz | ist der Snapshot-Zeitpunkt konsistent mit dem Anwendungszustand (z. B. Datenbank-Flush vor Snapshot)? | inkonsistenter Snapshot bei Wiederherstellung, weil Anwendungs-Cache nicht auf Disk geflusht war |
| Fehlerdomäne | in welcher physischen Fehlerdomäne liegt das Volume relativ zum Compute-Knoten? | Volume und Compute-Knoten teilen eine Fehlerdomäne, die bei Ausfall beide gleichzeitig betrifft |

Implementierung: Volumes werden nach gemessenem oder geschätztem IOPS- und Durchsatzbedarf der Workload dimensioniert, nicht nur nach benötigtem Speicherplatz. Hochverfügbarkeitsdesign berücksichtigt die Attach-Grenze explizit — Failover erfolgt über Replikation (Datenbank-Replikation oder Speicherdienst-Replikation), nicht über gleichzeitigen Multi-Knoten-Zugriff auf ein einzelnes Volume. Snapshots werden mit Anwendungs-Konsistenz koordiniert (z. B. Datenbank-Checkpoint oder Flush vor dem Snapshot-Aufruf), damit ein wiederhergestellter Snapshot einen konsistenten Zustand widerspiegelt.

## Scalability, Reliability, Security und Observability

Block Storage skaliert primär vertikal (größeres/schnelleres Volume) und durch Verteilung der Workload über mehrere Volumes, nicht horizontal wie Objektspeicher. Reliability-Grenze: die Attach-Grenze bedeutet, dass ein Ausfall des angehängten Compute-Knotens ohne vorbereitete Replikationsstrategie zu Nichtverfügbarkeit der Daten führt, auch wenn das Volume selbst physisch intakt ist.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Datenbank-Latenz steigt trotz ausreichend freiem Speicherplatz auf dem Volume | IOPS- oder Durchsatzlimit des Volumes ist erreicht | IOPS-/Durchsatzauslastung gegen das dimensionierte Limit des Volumes vergleichen |
| Wiederhergestellter Snapshot zeigt inkonsistente oder beschädigte Datenbankdaten | Snapshot wurde ohne Koordination mit Anwendungs-Flush erstellt | Snapshot-Erstellungsprozess auf Anwendungs-Konsistenz-Koordination prüfen |
| Failover auf einen anderen Knoten schlägt fehl, weil das Volume nicht verfügbar ist | Hochverfügbarkeitsdesign ging fälschlich von gemeinsamem Volume-Zugriff aus, ohne Replikation | Architektur auf tatsächliche Replikationsstrategie statt angenommenen Multi-Knoten-Zugriff prüfen |
| Volume und zugehöriger Compute-Knoten fallen gleichzeitig aus | beide teilen dieselbe physische Fehlerdomäne | Fehlerdomänen-Zuordnung von Volume und Compute-Knoten beim Anbieter prüfen |

Security: Block-Volumes sollten grundsätzlich verschlüsselt sein (im Ruhezustand), insbesondere da Snapshots oft dieselben Verschlüsselungseigenschaften wie das Quellvolume erben müssen, um keine unverschlüsselte Kopie sensibler Daten zu erzeugen. Observability: IOPS-Auslastung, Durchsatz, Latenzverteilung pro Operation und Warteschlangentiefe (Queue Depth) sind zentrale Metriken zur Diagnose von Block-Storage-Engpässen.

## Trade-offs und Entscheidungen

**Staff** dimensioniert Volumes nach gemessenem IOPS-Bedarf, nicht nur nach Kapazität. **Principal** macht die Attach-Grenze und ihre Folgen für Hochverfügbarkeitsdesign im Team explizit. **Chief** positioniert Block Storage als Grundlage für latenzkritische, strukturierte Workloads, nicht als generelle Speicherlösung für alle Datentypen.

Anti-Patterns: Volume nur nach Kapazität dimensionieren, ohne IOPS-Bedarf zu prüfen; Hochverfügbarkeitsdesign auf angenommenem gemeinsamem Volume-Zugriff mehrerer Knoten aufbauen; Snapshots ohne Anwendungs-Konsistenz-Koordination als Backup-Strategie verwenden.

## Production Checklist

- [ ] Volume ist nach gemessenem oder geschätztem IOPS- und Durchsatzbedarf dimensioniert.
- [ ] Hochverfügbarkeitsdesign berücksichtigt die Attach-Grenze durch explizite Replikationsstrategie.
- [ ] Snapshots sind mit Anwendungs-Konsistenz (Flush/Checkpoint) koordiniert.
- [ ] Volume-Verschlüsselung im Ruhezustand ist aktiviert, inklusive Snapshots.

## Interviewfragen

### 1. Was ist der grundlegende Unterschied zwischen Block Storage und Objektspeicher?

**Antwort:** Block Storage bietet niedriglatente, blockadressierte partielle In-Place-Updates und ist typischerweise an einen einzelnen Compute-Knoten gebunden, während Objektspeicher ganze Objekte über eine HTTP-API adressiert und für massiv parallelen Zugriff über viele Clients optimiert ist, aber keine partiellen In-Place-Updates unterstützt.

### 2. Warum ist IOPS-Dimensionierung wichtiger als reine Kapazitätsdimensionierung bei Datenbank-Volumes?

**Antwort:** Ein Volume kann ausreichend Speicherplatz haben, aber bei hoher zufälliger I/O-Rate trotzdem das IOPS-Limit erreichen und dadurch Latenzprobleme verursachen, die reine Kapazitätsbetrachtung nicht sichtbar macht.

### 3. Was bedeutet die "Attach-Grenze" von Block Storage für Hochverfügbarkeitsdesign?

**Antwort:** Ein Volume ist typischerweise nur an einen Compute-Knoten gleichzeitig gebunden; Hochverfügbarkeit muss deshalb über Replikation auf Anwendungs- oder Speicherdienstebene erreicht werden, nicht über gleichzeitigen Multi-Knoten-Zugriff auf dasselbe Volume.

### 4. Warum kann ein Snapshot trotz technisch erfolgreicher Erstellung ein inkonsistentes Backup liefern?

**Antwort:** Wenn der Snapshot ohne Koordination mit einem Anwendungs-Flush oder -Checkpoint erstellt wird, kann Anwendungs-Cache-Zustand fehlen, der noch nicht auf Disk geschrieben war, was bei Wiederherstellung zu Inkonsistenz führt.

### 5. Wann ist Block Storage die richtige Wahl gegenüber Objektspeicher?

**Antwort:** Wenn niedrige, konsistente I/O-Latenz und partielle In-Place-Updates benötigt werden, typischerweise bei Datenbank-Speicher-Engines oder anderen latenzkritischen, strukturierten Workloads.

### 6. Widersprüchliche Anforderung: Team will maximale Kosteneffizienz durch minimal dimensioniertes Volume UND garantiert niedrige Latenz bei unvorhersehbaren Lastspitzen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass minimale Dimensionierung und garantierte Latenz bei Lastspitzen ein struktureller Zielkonflikt sind; ich würde vorschlagen, das Volume nach realistischen Spitzenlast-Messungen (nicht Durchschnittswerten) zu dimensionieren oder eine Volume-Klasse mit burstfähiger IOPS-Kapazität zu wählen, statt beide Ziele ohne Kompromiss zu versprechen.

## Praktische Labs

~~~python
# IOPS budget model: sequential vs random access pattern
IOPS_BUDGET = 3000

def ops_consumed(total_bytes, op_size_bytes, pattern):
    ops = total_bytes // op_size_bytes
    # random access has more overhead per operation in this simplified model
    overhead_factor = 1.0 if pattern == "sequential" else 1.5
    return int(ops * overhead_factor)

total = 300_000_000  # 300 MB workload
seq_ops = ops_consumed(total, op_size_bytes=1_000_000, pattern="sequential")  # large sequential chunks
rand_ops = ops_consumed(total, op_size_bytes=4_096, pattern="random")  # small random 4KB reads

print(f"Sequential ops needed: {seq_ops}, random ops needed: {rand_ops}")
assert rand_ops > seq_ops
assert rand_ops > IOPS_BUDGET  # random pattern exceeds a modest IOPS budget
print("Same total data volume: random access pattern consumes the IOPS budget far faster than sequential.")
~~~

## Dependencies, Cross-References und Quellen

1. AWS: [Amazon EBS Volume Types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html), abgerufen 2026-09-17.
2. Microsoft: [Azure Managed Disks Overview](https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview), abgerufen 2026-09-17.
3. Google Cloud: [Persistent Disk Performance](https://cloud.google.com/compute/docs/disks/performance), abgerufen 2026-09-17.

Produktspezifische Details (EBS, Azure Managed Disks, Persistent Disk) vor Einsatz an aktueller Dokumentation prüfen. Dateispeicher wird in [KB-0210](16-file-storage.md) vertieft.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| NVMe-basierte lokale Volumes mit sehr niedriger Latenz für ephemere Hochleistungs-Workloads | Established | Datenpersistenz-Anforderung gegen den Latenzgewinn ephemerer lokaler Volumes abwägen. |
| Burstable-IOPS-Volume-Klassen für kosteneffiziente Handhabung unregelmäßiger Lastspitzen | Established | Für Workloads mit vorhersehbaren Ruhephasen und seltenen Spitzen gezielt einsetzen. |

Ein Team akzeptiert eine Block-Storage-Dimensionierung erst, wenn IOPS-Bedarf gemessen und Snapshot-Konsistenz-Koordination nachweisbar geplant sind.
