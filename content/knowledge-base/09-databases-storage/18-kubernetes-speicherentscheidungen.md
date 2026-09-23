---
{"id": "KB-0212", "title": "Kubernetes-Speicherentscheidungen", "domain": "09", "sequence": 18, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "CLOUD"], "requires": [{"id": "KB-0209", "concepts": ["Block Storage"], "needed_for": "understanding"}, {"id": "KB-0211", "concepts": ["Verteilte Speicherpools"], "needed_for": "understanding"}], "related": ["KB-0210"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Modell für PVC-Zugriffsmodus-Kompatibilität (ReadWriteOnce vs. ReadWriteMany) gegen einen Pod-Skalierungsplan prüfen.", "rationale": "Der Konflikt zwischen Zugriffsmodus und Skalierungsanforderung wird erst durch konkrete Prüfung sichtbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Persistenz-, Durability- und Performance-Anforderungen eines Workloads gegen passende Speicherklasse begründet abbilden.", "rationale": "Falsche Speicherklassenwahl erzeugt entweder unnötige Kosten oder unzureichende Ausfallsicherheit."}, "STAFF-TARGET": {"active": true, "scope": "Pod-Scheduling-Fehler auf Topologie-Inkompatibilität zwischen Volume und Knoten statt auf ein Ressourcenproblem zurückführen können.", "rationale": "Zonengebundene Volumes können Pods nur auf Knoten in derselben Zone scheduling-fähig machen, was ohne dieses Wissen falsch diagnostiziert wird."}, "CHIEF-TARGET": {"active": true, "scope": "Kubernetes-Speicherentscheidungen als Zusammenspiel von Zugriffsmodus, Topologie und Wiederherstellbarkeit positionieren, nicht als reine Kapazitätsfrage.", "rationale": "Speicherentscheidungen in Kubernetes betreffen Scheduling, Verfügbarkeit und Datenwiederherstellung gleichzeitig."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "CSI-Protokolldetails und Plugin-Implementierung sind kanonisch in Domain 16 und hier bewusst nicht vertieft.", "rationale": "Diese Datei fokussiert auf Speicherentscheidungen aus Anwendungssicht, nicht auf die CSI-Protokollebene."}}, "lab_validation": [{"lab_id": "KB-0212-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für PVC-Zugriffsmodus-Kompatibilitätsprüfung", "evidence": "Ein Volume mit ReadWriteOnce-Zugriffsmodus kann nicht gleichzeitig von Pods auf mehreren Knoten gemountet werden, was horizontale Skalierung über Knoten hinweg strukturell einschränkt.", "limitations": "Kein echtes Kubernetes-Cluster, keine reale CSI-Interaktion, keine Produktion."}]}
---
# Kubernetes-Speicherentscheidungen

> **Ziel:** Kubernetes-Speicherentscheidungen (PersistentVolumes, Zugriffsmodi, Storage Classes) bestimmen, ob ein Workload überhaupt korrekt skaliert und wiederhergestellt werden kann. Die Wahl des Zugriffsmodus (ReadWriteOnce, ReadWriteMany) und der Topologie-Bindung ist keine reine Konfigurationsdetail-Frage, sondern beeinflusst direkt, wo Pods geschedult werden können und wie Ausfälle sich auswirken.

## Zweck, Mental Model und Dependencies

PersistentVolumeClaims (PVCs) abstrahieren die konkrete Speicherimplementierung (Block Storage, verteilte Speicherpools wie Ceph, siehe [KB-0209](15-block-storage.md) und [KB-0211](17-ceph-und-verteilte-speicherpools.md)) hinter einer Kubernetes-nativen API, aber die zugrunde liegende Speicherart bestimmt weiterhin die realen Grenzen: ein block-basiertes Volume unterstützt typischerweise nur ReadWriteOnce (ein Knoten gleichzeitig), während ein verteiltes Dateisystem-basiertes Volume ReadWriteMany (mehrere Knoten gleichzeitig) ermöglichen kann. Topologie-Bindung bedeutet, dass ein Volume oft an eine bestimmte Verfügbarkeitszone gebunden ist (z. B. bei zonalen Block-Storage-Diensten), was den Kubernetes-Scheduler zwingt, Pods nur auf Knoten in derselben Zone zu platzieren — eine Einschränkung, die bei Knotenausfällen in anderen Zonen zu scheinbar unerklärlichen Scheduling-Fehlern führen kann. Wiederherstellbarkeit hängt von der Backup-/Snapshot-Fähigkeit der zugrunde liegenden Speicherklasse ab, die Kubernetes selbst nicht automatisch bereitstellt. Lies [KB-0209](15-block-storage.md) und [KB-0211](17-ceph-und-verteilte-speicherpools.md).

~~~text
Block-backed PVC:          ReadWriteOnce -> single node at a time -> StatefulSet with 1 replica per volume works, shared access does not
Distributed-fs-backed PVC: ReadWriteMany -> multiple nodes simultaneously -> shared access across pod replicas works
Zonal volume + pod in different zone -> scheduling failure, looks like a resource problem but is a topology mismatch
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Zugriffsmodus-Kompatibilität | passt der PVC-Zugriffsmodus zum tatsächlichen Pod-Skalierungsplan? | ReadWriteOnce-Volume für einen Workload mit mehreren gleichzeitig schreibenden Pod-Replikaten gewählt, Scheduling-Konflikt |
| Topologie-Bindung | ist die Zonenbindung des Volumes mit der Knotenverteilung des Clusters kompatibel? | Pod kann nicht geschedult werden, weil kein Knoten in der Volume-Zone verfügbar ist |
| Storage-Class-Wahl | passt die gewählte Storage Class zu Performance- und Durability-Anforderungen des Workloads? | falsche Storage-Class-Wahl erzeugt unnötige Kosten oder unzureichende Performance |
| Backup-/Snapshot-Fähigkeit | ist die Wiederherstellbarkeit des Volumes über Snapshots oder Backups sichergestellt? | Datenverlust bei Volume-Beschädigung ohne funktionierende Wiederherstellungsstrategie |

Implementierung: der PVC-Zugriffsmodus wird explizit gegen den geplanten Pod-Skalierungsansatz geprüft — Workloads mit mehreren gleichzeitig schreibenden Replikaten benötigen ReadWriteMany-fähige Speicherklassen, während StatefulSets mit einem Volume pro Replika mit ReadWriteOnce auskommen. Topologie-Bindung wird bei der Kapazitätsplanung berücksichtigt, indem sichergestellt wird, dass ausreichend Knoten in jeder Zone verfügbar sind, in der zonengebundene Volumes existieren. Die Storage-Class-Wahl wird anhand dokumentierter Performance- (IOPS, Latenz) und Durability-Eigenschaften der zugrunde liegenden Speicherimplementierung getroffen, nicht nach Standardkonfiguration. Backup-/Snapshot-Fähigkeit wird vor Produktivsetzung getestet, nicht erst bei einem realen Datenverlustvorfall.

## Scalability, Reliability, Security und Observability

Kubernetes-Speicherentscheidungen bestimmen die tatsächliche Skalierbarkeit eines Workloads unabhängig von der Compute-Skalierbarkeit — ein Workload kann beliebig viele Pod-Replikate haben, aber wenn das zugrunde liegende Volume nur ReadWriteOnce unterstützt, skaliert der zustandsbehaftete Teil des Workloads trotzdem nicht horizontal. Reliability-Grenze: Topologie-Fehlkonfiguration führt nicht zu einem sofortigen Fehler, sondern zu einem latenten Scheduling-Risiko, das erst sichtbar wird, wenn Knoten in der gebundenen Zone ausfallen oder nicht verfügbar sind.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Pod bleibt im Pending-Status, obwohl ausreichend Compute-Ressourcen verfügbar sind | Volume-Topologie-Bindung erlaubt kein Scheduling auf verfügbaren Knoten | Zonenbindung des Volumes gegen die Zone der verfügbaren Knoten prüfen |
| zweiter Pod-Replikat kann Volume nicht mounten | PVC-Zugriffsmodus ist ReadWriteOnce, aber Workload erfordert gleichzeitigen Mehrknotenzugriff | Zugriffsmodus des PVC gegen den tatsächlichen Skalierungsplan prüfen |
| Wiederherstellung nach Volume-Beschädigung schlägt fehl oder liefert veraltete Daten | Backup-/Snapshot-Strategie war nicht wie angenommen konfiguriert oder getestet | Snapshot-/Backup-Konfiguration und letzten erfolgreichen Wiederherstellungstest prüfen |
| I/O-Latenz für einen Workload ist unerwartet hoch trotz ausreichender Compute-Ressourcen | Storage Class bietet nicht die für den Workload benötigte Performance-Klasse | Storage-Class-Eigenschaften gegen den tatsächlichen I/O-Bedarf des Workloads vergleichen |

Security: Volume-Verschlüsselung und Zugriffskontrolle müssen konsistent mit der Kubernetes-RBAC-Konfiguration sein, da ein PVC allein keine Datenverschlüsselung garantiert, wenn die zugrunde liegende Speicherklasse sie nicht standardmäßig aktiviert. Observability: PVC-Bindungsstatus, Volume-I/O-Metriken und Pod-Scheduling-Fehlermeldungen (insbesondere Topologie-bezogene) sind zentrale Diagnosewerkzeuge.

## Trade-offs und Entscheidungen

**Staff** prüft Zugriffsmodus-Kompatibilität gegen den tatsächlichen Pod-Skalierungsplan vor Produktivsetzung. **Principal** macht Topologie-Bindungsrisiken für das Team in der Kapazitätsplanung sichtbar. **Chief** positioniert Kubernetes-Speicherentscheidungen als Zusammenspiel von Zugriffsmodus, Topologie und Wiederherstellbarkeit, nicht als reine Kapazitätsfrage.

Anti-Patterns: Storage Class nach Standardkonfiguration ohne Prüfung von Performance-/Durability-Anforderungen wählen; Zugriffsmodus-Kompatibilität erst bei einem Scheduling-Fehler in Produktion entdecken; Backup-/Snapshot-Strategie ungetestet lassen, bis ein realer Datenverlustvorfall eintritt.

## Production Checklist

- [ ] PVC-Zugriffsmodus ist gegen den tatsächlichen Pod-Skalierungsplan geprüft.
- [ ] Topologie-Bindung des Volumes ist mit der Knotenverteilung des Clusters kompatibel.
- [ ] Storage-Class-Wahl basiert auf dokumentierten Performance-/Durability-Eigenschaften.
- [ ] Backup-/Snapshot-Wiederherstellung ist getestet, nicht nur konfiguriert.

## Interviewfragen

### 1. Warum kann ein Pod trotz ausreichender Compute-Ressourcen im Pending-Status bleiben?

**Antwort:** Wenn das angeforderte Volume an eine bestimmte Verfügbarkeitszone gebunden ist und kein Knoten mit ausreichenden Ressourcen in dieser Zone verfügbar ist, kann der Scheduler den Pod nicht platzieren, obwohl in anderen Zonen Ressourcen frei sind.

### 2. Was ist der Unterschied zwischen ReadWriteOnce und ReadWriteMany, und warum ist er für Skalierung wichtig?

**Antwort:** ReadWriteOnce erlaubt Mounting nur auf einem Knoten gleichzeitig, ReadWriteMany erlaubt gleichzeitigen Zugriff mehrerer Knoten — ein Workload mit mehreren gleichzeitig schreibenden Pod-Replikaten benötigt einen ReadWriteMany-fähigen Speichertyp, sonst schlägt das Mounting für weitere Replikate fehl.

### 3. Warum garantiert ein PersistentVolumeClaim allein keine Datenwiederherstellbarkeit?

**Antwort:** Kubernetes abstrahiert den Zugriff auf Speicher, stellt aber selbst keine Backup-/Snapshot-Funktionalität bereit — diese hängt von der zugrunde liegenden Speicherklasse und einer separat konfigurierten und getesteten Backup-Strategie ab.

### 4. Wie diagnostizierst du, ob ein Scheduling-Fehler auf ein Topologie-Problem statt ein Ressourcenproblem zurückzuführen ist?

**Antwort:** Ich prüfe die Zonenbindung des angeforderten Volumes gegen die Zonenverteilung der verfügbaren Knoten — ein Ressourcenmangel zeigt sich clusterweit, ein Topologie-Problem zeigt sich nur bei fehlenden Knoten in der spezifischen gebundenen Zone.

### 5. Warum sollte Storage-Class-Wahl nicht nach Standardkonfiguration erfolgen?

**Antwort:** Unterschiedliche Storage Classes bieten unterschiedliche Performance- (IOPS, Latenz) und Durability-Eigenschaften; eine ungeprüfte Standardwahl kann entweder unnötige Kosten (Überdimensionierung) oder unzureichende Performance/Ausfallsicherheit (Unterdimensionierung) für den tatsächlichen Workload bedeuten.

### 6. Widersprüchliche Anforderung: Team will einen zustandsbehafteten Workload mit vielen parallel schreibenden Replikaten UND die niedrige Latenz eines block-basierten, zonengebundenen Volumes — wie gehst du vor?

**Antwort:** Ich würde erklären, dass block-basierte Volumes strukturell meist nur ReadWriteOnce unterstützen und daher nicht mit vielen parallel schreibenden Replikaten kompatibel sind; ich würde entweder eine ReadWriteMany-fähige verteilte Speicherklasse mit etwas höherer Latenz vorschlagen oder das Workload-Design überdenken (z. B. Partitionierung, sodass jedes Replikat ein eigenes Volume schreibt), statt die inkompatible Kombination zu erzwingen.

## Praktische Labs

~~~python
# PVC access mode vs pod scaling plan compatibility check
def check_compatibility(access_mode, planned_concurrent_writers):
    if access_mode == "ReadWriteOnce" and planned_concurrent_writers > 1:
        return False, "ReadWriteOnce volume cannot serve multiple concurrent writing nodes"
    if access_mode == "ReadWriteMany":
        return True, "compatible with multiple concurrent writers"
    return True, "single writer, compatible"

cases = [
    ("ReadWriteOnce", 1),
    ("ReadWriteOnce", 3),
    ("ReadWriteMany", 3),
]

for access_mode, writers in cases:
    ok, reason = check_compatibility(access_mode, writers)
    print(f"{access_mode} with {writers} writers -> {'OK' if ok else 'CONFLICT'}: {reason}")

ok, _ = check_compatibility("ReadWriteOnce", 3)
assert ok is False
ok, _ = check_compatibility("ReadWriteMany", 3)
assert ok is True
~~~

## Dependencies, Cross-References und Quellen

1. Kubernetes: [Persistent Volumes Documentation](https://kubernetes.io/docs/concepts/storage/persistent-volumes/), abgerufen 2026-09-17.
2. Kubernetes: [Storage Classes Documentation](https://kubernetes.io/docs/concepts/storage/storage-classes/), abgerufen 2026-09-17.
3. Kubernetes: [Volume Topology-Aware Scheduling](https://kubernetes.io/docs/concepts/storage/storage-classes/#volume-binding-mode), abgerufen 2026-09-17.

CSI-Protokoll- und Plugin-Details sind kanonisch in Domain 16 behandelt und werden dort vertieft. Kubernetes-Versionsdetails vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Generic Ephemeral Volumes für Pod-lokale, nicht-persistente Speicheranforderungen | Established | Für Workloads ohne echten Persistenzbedarf gezielt statt PVC einsetzen. |
| Volume-Snapshot-API als Kubernetes-natives Backup-Primitiv über CSI-Treiber | Established | Backup-Strategie über die native API standardisieren statt anbieterspezifische Tools zu duplizieren. |

Ein Team akzeptiert ein Kubernetes-Speicherdesign erst, wenn Zugriffsmodus-Kompatibilität und Topologie-Bindung gegen den Skalierungsplan geprüft sowie Wiederherstellung nachweisbar getestet sind.
