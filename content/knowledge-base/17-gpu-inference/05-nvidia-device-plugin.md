---
{"id": "KB-0417", "title": "NVIDIA Device Plugin", "domain": "17", "sequence": 5, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "MLOPS"], "requires": [{"id": "KB-0394", "concepts": ["Scheduling und Platzierungsregeln"], "needed_for": "understanding"}, {"id": "KB-0416", "concepts": ["MIG und MPS"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Pod-Manifest mit einer GPU-Ressourcenanforderung erstellen und nachvollziehen, wie der Device Plugin die tatsächliche GPU-Zuweisung durch den Scheduler ermöglicht.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Cluster-Konfiguration gestalten, die sowohl vollständige GPUs als auch MIG-partitionierte GPU-Ressourcen (siehe KB-0416) über den Device Plugin korrekt an Kubernetes meldet.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen Pod, der trotz verfügbarer GPU-Hardware nicht geplant werden kann, auf einen fehlerhaften oder nicht funktionierenden Device Plugin statt auf ein allgemeines Scheduling-Problem zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Korrekt konfigurierte und überwachte Device-Plugin-Integration als Voraussetzung für zuverlässige GPU-Ressourcenzuweisung im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Implementierung eines eigenen, benutzerdefinierten Device Plugins für andere Beschleuniger-Hardware im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der Geräteerkennungs- und Meldungsfunktion, nicht die Implementierung eines eigenen Plugins."}}, "lab_validation": [{"lab_id": "KB-0417-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Modell mit einem funktionierenden und einem fehlerhaften Device Plugin", "evidence": "Ein simulierter Cluster mit funktionierendem Device Plugin meldet korrekt verfügbare GPU-Ressourcen an den Scheduler, wodurch ein Pod mit GPU-Anforderung erfolgreich platziert wird; ein simulierter Cluster mit fehlerhaftem oder ausgefallenem Device Plugin meldet keine GPU-Ressourcen, wodurch derselbe Pod trotz physisch verfügbarer GPU-Hardware unschedulierbar bleibt.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, künstlich konstruiertes Fehlerszenario."}]}
---
# NVIDIA Device Plugin

> **Ziel:** Der NVIDIA Device Plugin ist die Kubernetes-native Komponente, die GPU-Ressourcen (einschließlich MIG-partitionierter GPU-Instanzen, siehe [KB-0416](04-mig-und-mps.md)) an den Kubernetes-Scheduler (siehe [KB-0394](16-scheduling-und-platzierungsregeln.md)) meldet, sodass Pods mit GPU-Anforderungen tatsächlich auf Knoten mit verfügbarer GPU-Hardware geplant werden können. Der zentrale Punkt dieses Kapitels ist, dass ohne einen funktionierenden Device Plugin selbst physisch vorhandene GPU-Hardware für Kubernetes unsichtbar bleibt — ein Pod mit GPU-Anforderung bleibt dann unschedulierbar, obwohl die eigentliche Hardware verfügbar wäre, was bei der Diagnose leicht mit einem allgemeinen Scheduling-Problem verwechselt werden kann.

## Zweck, Mental Model und Dependencies

Kubernetes selbst hat kein eingebautes Wissen über GPU-Hardware — der Scheduler kennt standardmäßig nur allgemeine Ressourcentypen wie CPU und Speicher. Der Device Plugin ist eine auf jedem Knoten laufende Komponente, die die tatsächlich vorhandene GPU-Hardware erkennt (Geräteerkennung), deren Gesundheitszustand überwacht (Health-Checks der GPU selbst), und diese Information dem Kubernetes-Scheduler als verfügbare, zuweisbare Ressource meldet. Erst durch diese Meldung kann ein Pod, der eine GPU-Ressource explizit anfordert, tatsächlich auf einem Knoten mit entsprechend gemeldeter GPU platziert werden — ohne den Device Plugin würde der Scheduler die physisch vorhandene GPU schlicht nicht als verfügbare, zuweisbare Ressource kennen. Bei MIG-partitionierten GPUs (siehe [KB-0416](04-mig-und-mps.md)) meldet der Device Plugin jede einzelne MIG-Instanz als separate, zuweisbare Ressource, sodass unterschiedliche Pods gezielt unterschiedlichen MIG-Instanzen derselben physischen GPU zugewiesen werden können. Der zentrale diagnostische Punkt ist: fällt der Device Plugin auf einem Knoten aus oder funktioniert er fehlerhaft, verschwindet die gemeldete GPU-Ressource für diesen Knoten aus Sicht des Schedulers, selbst wenn die physische Hardware weiterhin funktionsfähig ist — ein Pod mit GPU-Anforderung bleibt dann im Zustand "Pending" (nicht platzierbar), was bei oberflächlicher Betrachtung wie ein allgemeines Scheduling- oder Kapazitätsproblem aussieht, tatsächlich aber eine spezifische Device-Plugin-Störung ist.

~~~text
Kubernetes has NO built-in knowledge of GPU hardware -- scheduler natively knows only generic resources (CPU, memory)
Device Plugin: per-node component that
  1. DISCOVERS actual GPU hardware present
  2. MONITORS its health status
  3. REPORTS it to the Kubernetes scheduler as an available, allocatable resource
ONLY after this reporting can a pod requesting a GPU resource actually be placed on a node with that reported GPU
MIG case: Device Plugin reports EACH MIG instance as a SEPARATE allocatable resource
  -> different pods can be targeted to different MIG instances of the SAME physical GPU
KEY DIAGNOSTIC POINT: Device Plugin failure/malfunction on a node
  -> the reported GPU resource DISAPPEARS from the scheduler's view, EVEN IF the physical hardware still works
  -> a GPU-requesting pod stays "Pending" -- looks like a generic scheduling/capacity issue at first glance,
     but is actually a SPECIFIC Device Plugin malfunction
~~~

## Core Concepts, Architektur und Implementierung

| Funktion | Was sie tut | Diagnoseauswirkung bei Ausfall |
|---|---|---|
| Geräteerkennung | identifiziert physisch vorhandene GPU-Hardware | ohne Erkennung meldet der Knoten keine GPU-Ressource |
| Health-Checks | überwacht den Gesundheitszustand der GPU-Hardware | eine als ungesund erkannte GPU wird nicht mehr als zuweisbar gemeldet |
| Ressourcenmeldung an Scheduler | macht GPU-Ressourcen für Pod-Platzierung sichtbar | ohne Meldung bleibt physisch verfügbare Hardware für den Scheduler unsichtbar |
| MIG-Instanz-Meldung | meldet jede MIG-Partition separat | fehlerhafte Meldung kann zu falscher Zuordnung von Pods zu MIG-Instanzen führen |

Implementierung: Der Device Plugin wird auf jedem GPU-ausgestatteten Knoten als DaemonSet betrieben (analog zu den allgemeinen DaemonSet-Grundlagen), um sicherzustellen, dass jeder relevante Knoten seine tatsächlich vorhandene GPU-Kapazität dem Scheduler meldet. Der Gesundheitszustand des Device Plugins selbst wird überwacht, um sicherzustellen, dass ein Ausfall dieser Komponente schnell erkannt wird, statt fälschlich als allgemeines Kapazitätsproblem interpretiert zu werden. Bei einem unschedulierbaren Pod mit GPU-Anforderung wird explizit geprüft, ob der Device Plugin auf den in Frage kommenden Knoten tatsächlich funktioniert und GPU-Ressourcen aktuell meldet, bevor andere Scheduling-Ursachen (siehe [KB-0394](16-scheduling-und-platzierungsregeln.md)) untersucht werden.

## Scalability, Reliability, Security und Observability

Der Device Plugin skaliert die Sichtbarkeit von GPU-Ressourcen für den Scheduler proportional zur Anzahl der Knoten, auf denen er korrekt läuft; die Reliability-Grenze liegt darin, dass ein Ausfall dieser Komponente auf einem Knoten dessen gesamte GPU-Kapazität für den Scheduler unsichtbar macht, unabhängig vom tatsächlichen physischen Hardwarezustand.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Pod mit GPU-Anforderung bleibt trotz physisch verfügbarer GPU-Hardware im Zustand "Pending" | der Device Plugin auf dem betroffenen Knoten funktioniert nicht oder meldet keine Ressourcen | den Status des Device Plugin DaemonSets auf dem betroffenen Knoten prüfen |
| eine MIG-partitionierte GPU zeigt nur einen Teil der erwarteten Instanzen als verfügbar | der Device Plugin erkennt oder meldet nicht alle konfigurierten MIG-Instanzen korrekt | die Device-Plugin-Konfiguration gegen die tatsächliche MIG-Partitionierung der GPU prüfen |
| eine GPU wird nach einem Hardware-Fehler weiterhin als verfügbar gemeldet | die Health-Check-Funktion des Device Plugin erkennt den tatsächlichen Fehlerzustand nicht korrekt | die Health-Check-Konfiguration und -Logs des Device Plugin prüfen |

Security: Ein kompromittierter oder fehlerhaft konfigurierter Device Plugin könnte theoretisch falsche Ressourceninformationen melden, was zu einer fehlerhaften Pod-Platzierung führen könnte; die Integrität dieser Komponente sollte entsprechend ihrer kritischen Rolle geschützt werden. Observability: Der Status des Device Plugin DaemonSets auf jedem Knoten, die tatsächlich gemeldete versus die physisch vorhandene GPU-Kapazität, und die Häufigkeit von "Pending"-Pods aufgrund fehlender GPU-Ressourcenmeldung sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert eine aktive Überwachung des Device Plugin DaemonSets auf allen GPU-Knoten. **Principal** macht die Diskrepanz zwischen physischer und gemeldeter GPU-Kapazität für das Team nachvollziehbar. **Chief** etabliert korrekt konfigurierte und überwachte Device-Plugin-Integration als Voraussetzung für zuverlässige GPU-Ressourcenzuweisung im Unternehmen.

Anti-Patterns: einen unschedulierbaren GPU-Pod pauschal als allgemeines Scheduling-Problem diagnostizieren, ohne den Device-Plugin-Status zu prüfen; den Device Plugin ohne aktive Statusüberwachung betreiben; MIG-Instanz-Meldungen nicht gegen die tatsächliche Partitionierungskonfiguration verifizieren.

## Production Checklist

- [ ] Der Device Plugin läuft als überwachtes DaemonSet auf allen GPU-ausgestatteten Knoten.
- [ ] Der Status des Device Plugin wird aktiv überwacht, getrennt von allgemeinen Scheduling-Metriken.
- [ ] Bei unschedulierbaren GPU-Pods wird zuerst der Device-Plugin-Status geprüft.
- [ ] Gemeldete MIG-Instanzen werden gegen die tatsächliche Partitionierungskonfiguration verifiziert.

## Interviewfragen

### 1. Warum benötigt Kubernetes einen Device Plugin, um GPU-Ressourcen zu verwalten?

**Antwort:** Kubernetes hat kein eingebautes Wissen über GPU-Hardware; der Device Plugin erkennt die tatsächlich vorhandene GPU, überwacht ihren Gesundheitszustand, und meldet sie dem Scheduler als verfügbare, zuweisbare Ressource.

### 2. Was passiert, wenn der Device Plugin auf einem Knoten ausfällt, während die GPU-Hardware physisch funktioniert?

**Antwort:** Die GPU-Ressource verschwindet aus Sicht des Schedulers, da sie nicht mehr gemeldet wird, wodurch Pods mit GPU-Anforderung auf diesem Knoten nicht mehr platziert werden können, obwohl die Hardware funktionsfähig bleibt.

### 3. Wie meldet der Device Plugin MIG-partitionierte GPUs?

**Antwort:** Er meldet jede einzelne MIG-Instanz als separate, zuweisbare Ressource, sodass unterschiedliche Pods gezielt unterschiedlichen MIG-Instanzen derselben physischen GPU zugewiesen werden können.

### 4. Warum wird ein Device-Plugin-Ausfall bei oberflächlicher Diagnose leicht mit einem allgemeinen Scheduling-Problem verwechselt?

**Antwort:** Das Symptom (ein Pod bleibt "Pending") sieht identisch zu anderen Scheduling-Problemen aus, obwohl die tatsächliche Ursache eine spezifische Fehlfunktion der Device-Plugin-Komponente ist, nicht ein allgemeines Kapazitäts- oder Constraint-Problem.

### 5. Wie gehst du vor, wenn ein Pod mit GPU-Anforderung trotz physisch verfügbarer GPU-Hardware unschedulierbar bleibt?

**Antwort:** Ich prüfe zuerst den Status des Device Plugin DaemonSets auf dem betroffenen Knoten, bevor ich andere allgemeine Scheduling-Ursachen untersuche.

### 6. Widersprüchliche Anforderung: Team will zuverlässige GPU-Ressourcenverfügbarkeit UND minimalen Überwachungsaufwand — wie gehst du vor?

**Antwort:** Ich würde eine automatisierte, kontinuierliche Überwachung des Device-Plugin-Status als Teil der Standard-Cluster-Observability etablieren, sodass ein Ausfall automatisch und ohne manuellen Zusatzaufwand erkannt wird, statt dass jeder unschedulierbare GPU-Pod manuell auf diese spezifische Ursache hin untersucht werden muss.

## Praktische Labs

~~~python
class SimulatedNode:
    def __init__(self, name, has_gpu_hardware, device_plugin_healthy):
        self.name = name
        self.has_gpu_hardware = has_gpu_hardware
        self.device_plugin_healthy = device_plugin_healthy

    def reported_gpu_capacity(self):
        # Scheduler only sees GPU capacity if the device plugin ACTUALLY reports it
        if self.has_gpu_hardware and self.device_plugin_healthy:
            return 1
        return 0  # even with physical hardware, unhealthy plugin -> reported capacity is ZERO

def schedule_gpu_pod(nodes):
    for node in nodes:
        if node.reported_gpu_capacity() > 0:
            return f"Pod scheduled on '{node.name}'."
    return "Pod remains PENDING -- no node reports available GPU capacity."

healthy_node = SimulatedNode("node-1", has_gpu_hardware=True, device_plugin_healthy=True)
broken_plugin_node = SimulatedNode("node-2", has_gpu_hardware=True, device_plugin_healthy=False)

print(f"Cluster with healthy device plugin: {schedule_gpu_pod([healthy_node])}")
print(f"Cluster with BROKEN device plugin (physical GPU present, but unreported): {schedule_gpu_pod([broken_plugin_node])}")
~~~

## Dependencies, Cross-References und Quellen

1. NVIDIA-Dokumentation: [NVIDIA Device Plugin for Kubernetes](https://github.com/NVIDIA/k8s-device-plugin), abgerufen 2026-09-17.
2. Kubernetes-Dokumentation: [Device Plugins](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/), abgerufen 2026-09-17.

Scheduling und Platzierungsregeln sind kanonisch in [KB-0394](16-scheduling-und-platzierungsregeln.md) behandelt; MIG und MPS in [KB-0416](04-mig-und-mps.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Der GPU Operator, der Device Plugin, Treiberinstallation und weitere GPU-bezogene Komponenten als integriertes, verwaltetes Paket bereitstellt | Adopting | Gegenüber manuell einzeln verwalteten GPU-Komponenten für konsistentere, weniger fehleranfällige GPU-Cluster-Verwaltung bevorzugen. |
| Erweiterte, automatisierte Device-Plugin-Health-Checks mit proaktiver Benachrichtigung bei Fehlfunktion | Adopting | Gegenüber reiner reaktiver Fehlerdiagnose für schnellere Erkennung von GPU-Verfügbarkeitsproblemen bevorzugen. |

Ein Team akzeptiert eine GPU-Cluster-Konfiguration erst, wenn der Device-Plugin-Status aktiv und getrennt von allgemeinen Scheduling-Metriken überwacht wird.
