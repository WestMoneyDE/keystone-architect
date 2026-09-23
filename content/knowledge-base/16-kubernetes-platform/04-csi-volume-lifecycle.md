---
{"id": "KB-0382", "title": "CSI und Volume-Lifecycle im Cluster", "domain": "16", "sequence": 4, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0209", "concepts": ["Block Storage"], "needed_for": "understanding"}, {"id": "KB-0379", "concepts": ["Docker und OCI"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein PersistentVolumeClaim mit einer StorageClass erstellen und den vollständigen Ablauf von Provision über Attach bis Mount nachvollziehen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Die Beziehung zwischen PVC, PV, StorageClass und Snapshot gestalten, sodass Speicheranforderungen von Anwendungen deklarativ von der konkreten Speicherimplementierung entkoppelt sind.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen fehlgeschlagenen Pod-Start auf ein Topologie-Fehlpassung zwischen Pod-Scheduling und Volume-Verfügbarkeitszone zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "CSI als standardisierte Abstraktionsebene für Speicheranbindung im Unternehmen etablieren, die Anwendungsanforderungen von konkreter Speicherinfrastruktur trennt.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Implementierungsdetails spezifischer CSI-Treiber verschiedener Cloud-Anbieter sind Vertiefung.", "rationale": "Kern ist das Verständnis des CSI-Protokollablaufs und der PVC/PV/StorageClass-Beziehung, nicht die Details einzelner Treiber."}}, "lab_validation": [{"lab_id": "KB-0382-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Topologie-Fehlpassungsszenario zwischen Pod-Scheduling und Volume-Verfügbarkeitszone", "evidence": "Ein simulierter Pod wird auf einem Knoten in Zone A eingeplant, während sein angefordertes Volume nur in Zone B verfügbar ist; der Mount-Schritt schlägt entsprechend fehl, was korrekt auf eine Topologie-Fehlpassung statt auf einen allgemeinen Speicherfehler zurückgeführt wird.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, künstlich konstruiertes Topologie-Szenario."}]}
---
# CSI und Volume-Lifecycle im Cluster

> **Ziel:** Das Container Storage Interface (CSI) ist der standardisierte Vertrag zwischen Kubernetes und einer konkreten Speicherimplementierung, umgesetzt über Controller-Plugins (clusterweite Operationen wie Provisionierung) und Node-Plugins (knotenlokale Operationen wie Mounten), aufbauend auf den Block-Storage-Grundlagen (siehe [KB-0209](../09-databases-storage/15-block-storage.md)). Der zentrale Punkt dieses Kapitels ist der vollständige Volume-Lifecycle — Provision, Attach, Mount — sowie die Verbindung von PersistentVolumeClaim (PVC), PersistentVolume (PV), StorageClass und Snapshots, mit besonderem Fokus auf die Diagnose von Topologiefehlern.

## Zweck, Mental Model und Dependencies

Ein PersistentVolumeClaim (PVC) ist eine deklarative Anforderung einer Anwendung nach Speicher mit bestimmten Eigenschaften (Größe, Zugriffsmodus), ohne dass die Anwendung wissen muss, welche konkrete Speicherimplementierung diese Anforderung erfüllt. Eine StorageClass definiert, welcher CSI-Treiber und welche Parameter für die Erfüllung eines PVC verwendet werden — sie ist die Brücke zwischen der abstrakten Anforderung und der konkreten Implementierung. Ein PersistentVolume (PV) ist die tatsächliche, konkrete Speicherressource, die einem PVC zugeordnet wird, entweder durch dynamische Provisionierung (der CSI-Controller erstellt bei Bedarf ein neues PV basierend auf der StorageClass) oder durch statische Vorab-Erstellung. Der vollständige Volume-Lifecycle durchläuft drei Schritte: Provision (der CSI-Controller erstellt die konkrete Speicherressource, z. B. eine Cloud-Blockspeicher-Disk), Attach (die Speicherressource wird logisch an den Knoten angebunden, auf dem der Pod läuft), und Mount (das angebundene Volume wird in den Dateisystem-Namespace des Containers eingebunden). Ein Snapshot erfasst den Zustand eines Volumes zu einem bestimmten Zeitpunkt und kann zur Wiederherstellung oder zum Klonen verwendet werden. Ein besonders häufiger, aber diagnostisch oft missverstandener Fehler ist die Topologie-Fehlpassung: ein Pod wird von Kubernetes auf einem Knoten in einer bestimmten Verfügbarkeitszone eingeplant, während das angeforderte Volume (z. B. eine zonengebundene Cloud-Disk) nur in einer anderen Zone verfügbar ist — dies führt zu einem Fehler beim Attach- oder Mount-Schritt, der leicht fälschlich als allgemeiner Speicherfehler statt als spezifisches Topologieproblem interpretiert werden kann.

~~~text
PVC (PersistentVolumeClaim): app's DECLARATIVE storage request (size, access mode) -- no knowledge of concrete implementation
StorageClass: bridges PVC to a specific CSI driver + parameters -- defines HOW the request gets fulfilled
PV (PersistentVolume): the ACTUAL concrete storage resource bound to a PVC (dynamically provisioned or pre-created)
FULL VOLUME LIFECYCLE:
  1. Provision: CSI controller creates the concrete storage resource (e.g. a cloud block disk)
  2. Attach:    storage resource logically attached to the NODE the pod runs on
  3. Mount:     attached volume bound into the container's filesystem namespace
Snapshot: point-in-time capture of a volume -- restore or clone from it
COMMON MISDIAGNOSED FAILURE: topology mismatch
  pod scheduled in zone A, but requested volume (e.g. zone-bound cloud disk) only available in zone B
  -> attach/mount fails -- easily mistaken for a GENERIC storage error instead of a SPECIFIC topology problem
~~~

## Core Concepts, Architektur und Implementierung

| Element | Rolle | Häufiger Diagnosefehler |
|---|---|---|
| PVC | deklarative Anwendungsanforderung | verwechselt mit der konkreten Speicherressource selbst |
| StorageClass | Bindeglied zwischen PVC und konkretem CSI-Treiber | falsche StorageClass-Parameter werden übersehen |
| PV | konkrete Speicherressource | Zonenbindung des PV wird bei der Fehlersuche ignoriert |
| Provision/Attach/Mount | die drei Lebenszyklusschritte | ein Fehler in einem Schritt wird pauschal als "Speicherfehler" statt spezifischem Schritt-Fehler behandelt |

Implementierung: Anwendungen definieren ihre Speicheranforderung über einen PVC mit einer referenzierten StorageClass, ohne die konkrete Speicherimplementierung zu kennen. Der CSI-Controller provisioniert bei Bedarf dynamisch das entsprechende PV. Bei einem fehlgeschlagenen Pod-Start mit Volume-Bezug wird explizit geprüft, in welchem der drei Lebenszyklusschritte (Provision, Attach, Mount) der Fehler tatsächlich auftrat, und insbesondere, ob eine Topologie-Fehlpassung zwischen der Verfügbarkeitszone des eingeplanten Knotens und der Zonenbindung des Volumes vorliegt — Kubernetes bietet hierfür Topologie-Constraints, die das Scheduling bereits an die Volume-Verfügbarkeitszone binden können, um dieses Problem präventiv zu vermeiden.

## Scalability, Reliability, Security und Observability

CSI-basierte Speicheranbindung skaliert Anwendungsportabilität über unterschiedliche Speicherimplementierungen hinweg, ohne Anwendungscode ändern zu müssen; die Reliability-Grenze liegt darin, dass unentdeckte Topologie-Fehlpassungen proportional zur Anzahl der Verfügbarkeitszonen im Cluster zunehmend wahrscheinlicher werden.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Pod bleibt im Zustand "ContainerCreating" mit einer volume-bezogenen Fehlermeldung | eine Topologie-Fehlpassung zwischen Pod-Scheduling-Zone und Volume-Verfügbarkeitszone liegt vor | die Verfügbarkeitszone des eingeplanten Knotens mit der Zonenbindung des zugehörigen PV vergleichen |
| ein PVC bleibt dauerhaft im Zustand "Pending" | der CSI-Controller konnte kein passendes PV gemäß der referenzierten StorageClass provisionieren | die StorageClass-Parameter und die CSI-Controller-Logs auf Provisionierungsfehler prüfen |
| ein Volume lässt sich nicht in einen Container mounten, obwohl es erfolgreich an den Knoten angebunden (attached) wurde | der Fehler liegt spezifisch im Mount-Schritt, nicht im Attach-Schritt | die Node-Plugin-Logs für den spezifischen Mount-Vorgang prüfen, statt den gesamten Volume-Lifecycle erneut zu wiederholen |

Security: Snapshots und Volumes können sensible Daten enthalten und erfordern dieselben Zugriffskontrollen wie die ursprünglichen Datenquellen, insbesondere bei der Wiederherstellung oder dem Klonen aus einem Snapshot in eine andere Umgebung. Observability: Die Erfolgsrate jedes Lebenszyklusschritts (Provision, Attach, Mount) getrennt, sowie die Häufigkeit erkannter Topologie-Fehlpassungen, sind zentrale CSI-Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert eine getrennte Diagnose der drei Volume-Lebenszyklusschritte bei jedem Speicherfehler. **Principal** macht Topologie-Constraints und deren Zweck für das Team nachvollziehbar. **Chief** etabliert CSI als standardisierte Abstraktionsebene für Speicheranbindung im Unternehmen, die Anwendungsanforderungen von konkreter Speicherinfrastruktur trennt.

Anti-Patterns: einen volume-bezogenen Pod-Startfehler pauschal als "Speicherfehler" behandeln, ohne den spezifischen Lebenszyklusschritt zu identifizieren; Topologie-Constraints bei zonengebundenem Speicher ignorieren; Anwendungscode direkt an eine konkrete Speicherimplementierung statt an die CSI-Abstraktion (PVC/StorageClass) binden.

## Production Checklist

- [ ] Anwendungen definieren Speicheranforderungen über PVC/StorageClass, nicht direkt gegen eine konkrete Implementierung.
- [ ] Topologie-Constraints binden das Pod-Scheduling an die Verfügbarkeitszone des zugehörigen Volumes.
- [ ] Bei Speicherfehlern wird der spezifische Lebenszyklusschritt (Provision, Attach, Mount) identifiziert.
- [ ] Snapshots und Volumes unterliegen denselben Zugriffskontrollen wie die ursprünglichen Datenquellen.

## Interviewfragen

### 1. Was ist der Unterschied zwischen einem PVC, einem PV und einer StorageClass?

**Antwort:** Ein PVC ist die deklarative Anforderung einer Anwendung; eine StorageClass definiert, welcher CSI-Treiber diese Anforderung erfüllt; ein PV ist die tatsächliche, konkrete Speicherressource, die dem PVC zugeordnet wird.

### 2. Welche drei Schritte durchläuft der Volume-Lifecycle?

**Antwort:** Provision (Erstellung der konkreten Speicherressource), Attach (logische Anbindung an den Knoten) und Mount (Einbindung in den Container-Dateisystem-Namespace).

### 3. Was ist eine Topologie-Fehlpassung, und warum wird sie oft falsch diagnostiziert?

**Antwort:** Ein Pod wird in einer Verfügbarkeitszone eingeplant, während sein Volume nur in einer anderen Zone verfügbar ist; der resultierende Attach-/Mount-Fehler wird leicht fälschlich als allgemeiner Speicherfehler statt als spezifisches Topologieproblem interpretiert.

### 4. Wie verhindert man Topologie-Fehlpassungen präventiv?

**Antwort:** Durch Topologie-Constraints, die das Pod-Scheduling bereits an die Verfügbarkeitszone des zugehörigen Volumes binden, bevor der Pod eingeplant wird.

### 5. Wie gehst du vor, wenn ein Pod mit einer volume-bezogenen Fehlermeldung im Zustand "ContainerCreating" hängen bleibt?

**Antwort:** Ich vergleiche zuerst die Verfügbarkeitszone des eingeplanten Knotens mit der Zonenbindung des zugehörigen PV, um eine mögliche Topologie-Fehlpassung als Ursache zu prüfen.

### 6. Widersprüchliche Anforderung: Team will maximale Speicherportabilität über verschiedene Cloud-Anbieter UND garantierte Performance durch anbieterspezifische Speicheroptimierungen — wie gehst du vor?

**Antwort:** Ich würde die CSI-Abstraktion über PVC/StorageClass für die Anwendungsschicht beibehalten, um Portabilität zu erhalten, während anbieterspezifische Performance-Optimierungen ausschließlich in der StorageClass-Konfiguration (nicht im Anwendungscode) verankert werden, sodass ein Wechsel des Anbieters nur eine StorageClass-Anpassung statt einer Anwendungsänderung erfordert.

## Praktische Labs

~~~python
class SimulatedVolume:
    def __init__(self, volume_id, zone):
        self.volume_id = volume_id
        self.zone = zone
        self.attached_to_node = None
        self.mounted = False

class SimulatedNode:
    def __init__(self, node_name, zone):
        self.node_name = node_name
        self.zone = zone

def attach_volume(volume, node):
    if volume.zone != node.zone:
        raise RuntimeError(
            f"TOPOLOGY MISMATCH: volume '{volume.volume_id}' is in zone '{volume.zone}', "
            f"but node '{node.node_name}' is in zone '{node.zone}'. Attach failed."
        )
    volume.attached_to_node = node.node_name
    print(f"Volume '{volume.volume_id}' successfully attached to node '{node.node_name}'.")

volume = SimulatedVolume("vol-1", zone="zone-a")
node_wrong_zone = SimulatedNode("node-2", zone="zone-b")
node_correct_zone = SimulatedNode("node-1", zone="zone-a")

try:
    attach_volume(volume, node_wrong_zone)
except RuntimeError as e:
    print(f"FAILED (as expected, correctly diagnosed as topology issue): {e}")

attach_volume(volume, node_correct_zone)
~~~

## Dependencies, Cross-References und Quellen

1. Kubernetes-Dokumentation: [Container Storage Interface (CSI) for Kubernetes GA](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/), abgerufen 2026-09-17.
2. Kubernetes-Dokumentation: [Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/), abgerufen 2026-09-17.

Block Storage ist kanonisch in [KB-0209](../09-databases-storage/15-block-storage.md) behandelt; Docker und OCI in [KB-0379](01-docker-und-oci.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| CSI-Volume-Snapshots als natives, standardisiertes Kubernetes-Feature statt anbieterspezifischer Backup-Werkzeuge | Adopting | Gegenüber anbieterspezifischen Backup-Lösungen für portablere, standardisierte Snapshot-Verwaltung bevorzugen. |
| Generic Ephemeral Volumes für kurzlebige, pod-gebundene Speicheranforderungen ohne separate PVC-Verwaltung | Evaluating | Gegenüber klassischen PVCs abwägen, sobald der Anwendungsfall tatsächlich rein pod-gebundene, nicht persistente Anforderungen betrifft. |

Ein Team akzeptiert eine Speicherfehler-Diagnose erst, wenn der spezifische Lebenszyklusschritt (Provision, Attach, Mount) und eine mögliche Topologie-Fehlpassung geprüft wurden.
