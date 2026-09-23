---
{"id": "KB-0381", "title": "CNI und Pod-Netzwerke", "domain": "16", "sequence": 3, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0039", "concepts": ["Linux-Netzwerkstack und Paketpfade"], "needed_for": "understanding"}, {"id": "KB-0380", "concepts": ["CRI und Container-Runtimes"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Die Pod-Erreichbarkeit über zwei Knoten hinweg nachvollziehen und dabei zwischen CNI-Zuständigkeit (Pod-zu-Pod-Konnektivität) und Kubernetes-Service-Zuständigkeit (stabile Adressierung) unterscheiden.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Entscheiden, welches Routingmodell (Overlay vs. natives Routing) für ein gegebenes Netzwerkumfeld geeignet ist, basierend auf tatsächlichen Infrastruktureinschränkungen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein Pod-Erreichbarkeitsproblem auf die CNI-Ebene (IPAM/Routing) statt auf die darüberliegende Service-Ebene zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Klare Abgrenzung zwischen Linux-Netzwerkstack-Grundlagen, CNI-Zuständigkeit und konkreter CNI-Implementierung (z. B. Cilium) als Diagnosestandard im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Der konkrete Betrieb und die eBPF-basierte Implementierung von Cilium im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis von CNI-Zuständigkeit (Netzwerkanbindung, IPAM, Routing) im Allgemeinen, nicht der Betrieb einer spezifischen Implementierung."}}, "lab_validation": [{"lab_id": "KB-0381-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Diagnoseszenario mit einem Pod-Erreichbarkeitsproblem zwischen zwei simulierten Knoten", "evidence": "Ein simuliertes Erreichbarkeitsproblem zwischen Pods auf unterschiedlichen Knoten wird korrekt auf eine fehlende Routing-Regel zwischen den Knoten-Subnetzen (CNI-Ebene) statt auf ein fehlerhaftes Kubernetes-Service-Objekt zurückgeführt, was eine gezielte statt geratene Korrektur ermöglicht.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, künstlich konstruiertes Netzwerkszenario."}]}
---
# CNI und Pod-Netzwerke

> **Ziel:** Das Container Network Interface (CNI) ist zuständig für Netzwerkanbindung (jeder Pod erhält eine eigene Netzwerkschnittstelle), IPAM (IP Address Management — die Zuweisung eindeutiger IP-Adressen an Pods) und Routingmodelle (wie Pakete zwischen Pods auf unterschiedlichen Knoten tatsächlich transportiert werden), aufbauend auf den Linux-Netzwerkstack-Grundlagen (siehe [KB-0039](../02-linux-systems/09-linux-netzwerkstack-und-paketpfade.md)) und der CRI-Ebene (siehe [KB-0380](02-cri-und-container-runtimes.md)). Der zentrale Punkt dieses Kapitels ist die klare Abgrenzung von drei Ebenen: allgemeine Linux-Netzwerkstack-Grundlagen, die CNI-Zuständigkeit für Pod-Erreichbarkeit im Allgemeinen, und der konkrete Betrieb einer spezifischen CNI-Implementierung wie Cilium.

## Zweck, Mental Model und Dependencies

Die CNI-Schicht löst ein spezifisches Problem, das die Linux-Netzwerkstack-Grundlagen allein nicht lösen: in einem Kubernetes-Cluster müssen potenziell tausende Pods, verteilt über viele Knoten, jeweils eine eigene, eindeutige IP-Adresse erhalten und direkt miteinander kommunizieren können, unabhängig davon, auf welchem physischen Knoten sie laufen. IPAM verwaltet die Zuteilung dieser eindeutigen IP-Adressen an neu erstellte Pods, üblicherweise aus einem für den Cluster reservierten Adressbereich, der pro Knoten in kleinere Teilbereiche aufgeteilt wird. Das Routingmodell bestimmt, wie ein Paket von einem Pod auf Knoten A tatsächlich zu einem Pod auf Knoten B gelangt — bei einem Overlay-Netzwerk werden Pakete zwischen Knoten in ein zusätzliches Transportprotokoll gekapselt (z. B. VXLAN), was flexibel, aber mit zusätzlichem Overhead verbunden ist; bei nativem Routing werden Pod-Subnetze direkt in die physische Netzwerkinfrastruktur eingebunden (z. B. über BGP), was effizienter ist, aber eine entsprechend konfigurierbare physische Netzwerkumgebung voraussetzt. Wichtig ist die Abgrenzung: die CNI-Ebene stellt ausschließlich die grundlegende Pod-zu-Pod-Erreichbarkeit sicher — die stabile, DNS-basierte Adressierung eines Dienstes über mehrere, sich ändernde Pod-Instanzen hinweg (Kubernetes Services) ist eine eigene, darüberliegende Abstraktionsebene, die nicht Teil der CNI-Zuständigkeit ist. Cilium ist eine konkrete, eBPF-basierte CNI-Implementierung mit zusätzlichen Funktionen (z. B. Netzwerkrichtlinien, Observability); ihr konkreter Betrieb ist eine spezifische Vertiefung, während die grundlegenden CNI-Konzepte (Netzwerkanbindung, IPAM, Routing) implementierungsunabhängig gelten.

~~~text
CNI solves: potentially thousands of pods across many nodes each need a UNIQUE IP and DIRECT pod-to-pod connectivity
IPAM: allocates unique IPs to new pods, typically from a per-node subset of a cluster-wide reserved range
Routing models:
  Overlay (e.g. VXLAN): packets encapsulated in an extra transport protocol between nodes -> flexible, extra overhead
  Native routing (e.g. via BGP): pod subnets integrated directly into physical network infra -> efficient, requires compatible infra
THREE LAYERS TO KEEP DISTINCT:
  1. Linux network stack fundamentals (KB-0039) -- general packet handling
  2. CNI responsibility -- pod-to-pod reachability ONLY (NOT stable DNS-based service addressing -- that's Kubernetes Services, a layer ABOVE CNI)
  3. Concrete CNI implementation (e.g. Cilium, eBPF-based) -- specific operational details, a deepening of layer 2
~~~

## Core Concepts, Architektur und Implementierung

| Ebene | Zuständigkeit | Nicht Teil dieser Ebene |
|---|---|---|
| Linux-Netzwerkstack | grundlegende Paketverarbeitung, Namespaces, Routing-Tabellen | Pod-spezifische IP-Zuteilung über einen Cluster hinweg |
| CNI (allgemein) | IPAM, Pod-zu-Pod-Routing über Knoten hinweg | stabile, DNS-basierte Dienstadressierung (Kubernetes Services) |
| Konkrete CNI-Implementierung (z. B. Cilium) | spezifische Umsetzung, ggf. zusätzliche Funktionen (Netzwerkrichtlinien, Observability) | grundlegende CNI-Konzepte selbst, die implementierungsunabhängig gelten |

Implementierung: Bei der Diagnose eines Netzwerkproblems wird zunächst geklärt, auf welcher der drei Ebenen das Problem tatsächlich liegt: ein grundlegendes Paketverarbeitungsproblem (Linux-Netzwerkstack), eine fehlende Pod-zu-Pod-Erreichbarkeit über Knoten hinweg (CNI-Ebene, IPAM/Routing), oder ein Problem mit der stabilen Adressierung eines Dienstes trotz funktionierender Pod-Erreichbarkeit (Kubernetes-Service-Ebene, oberhalb von CNI). Die Wahl zwischen Overlay- und nativem Routing erfolgt basierend auf den tatsächlichen Einschränkungen der physischen Netzwerkinfrastruktur (z. B. ob BGP-Peering mit der physischen Netzwerkinfrastruktur möglich ist) statt einer pauschalen Standardwahl.

## Scalability, Reliability, Security und Observability

CNI-Routingmodelle skalieren Pod-Konnektivität unterschiedlich: natives Routing skaliert effizienter bei kompatibler physischer Infrastruktur, Overlay-Netzwerke skalieren flexibler unabhängig von der physischen Infrastruktur, aber mit zusätzlichem Verarbeitungsoverhead pro Paket. Die Reliability-Grenze liegt darin, dass eine Verwechslung von CNI-Ebene und Service-Ebene bei der Diagnose proportional zur Häufigkeit von Netzwerkproblemen zu falsch zugeordneten, wirkungslosen Korrekturversuchen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Pods auf demselben Knoten erreichen sich, Pods auf unterschiedlichen Knoten nicht | ein CNI-Routingproblem zwischen den Knoten-Subnetzen liegt vor | die Routing-Konfiguration zwischen den betroffenen Knoten-Subnetzen prüfen |
| ein Kubernetes-Service leitet Anfragen nicht korrekt an die dahinterliegenden Pods weiter, obwohl die Pods direkt erreichbar sind | das Problem liegt auf der Service-Ebene, nicht auf der CNI-Ebene | die Service-/Endpoint-Konfiguration statt der CNI-Konfiguration prüfen |
| ein neu erstellter Pod erhält keine gültige IP-Adresse | der IPAM-Adressbereich für den betroffenen Knoten ist erschöpft | den verfügbaren IPAM-Adressbereich für den Knoten prüfen und bei Bedarf erweitern |

Security: Die konkrete CNI-Implementierung bestimmt, welche Netzwerkrichtlinien-Funktionen (z. B. Pod-zu-Pod-Zugriffsbeschränkungen) verfügbar sind — nicht jede CNI-Implementierung unterstützt dieselbe Tiefe an Netzwerkrichtlinien-Durchsetzung, was bei sicherheitsrelevanten Anforderungen explizit geprüft werden muss. Observability: Paketverlustrate zwischen Knoten, IPAM-Adressbereichsauslastung pro Knoten, und die Latenz zwischen Pod-zu-Pod-Kommunikation über verschiedene Knoten hinweg sind zentrale CNI-Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert eine klare Diagnoseabgrenzung zwischen Linux-Netzwerkstack, CNI-Ebene und Service-Ebene bei jedem Netzwerkproblem. **Principal** macht die gewählte Routingmodell-Entscheidung für das Team nachvollziehbar. **Chief** etabliert klare Abgrenzung zwischen den drei Netzwerkebenen als Diagnosestandard im Unternehmen.

Anti-Patterns: ein Service-Adressierungsproblem fälschlich auf der CNI-Ebene statt auf der Service-Ebene diagnostizieren; ein Routingmodell (Overlay vs. nativ) ohne Prüfung der tatsächlichen physischen Infrastrukturkompatibilität wählen; eine spezifische CNI-Implementierung mit den allgemeinen CNI-Konzepten verwechseln, wodurch implementierungsspezifisches Wissen fälschlich als allgemeingültig behandelt wird.

## Production Checklist

- [ ] Netzwerkprobleme werden zunächst der richtigen Ebene (Linux-Stack, CNI, Service) zugeordnet, bevor eine Korrektur erfolgt.
- [ ] Die Wahl des Routingmodells basiert auf der tatsächlichen physischen Infrastrukturkompatibilität.
- [ ] IPAM-Adressbereiche werden auf ausreichende Kapazität pro Knoten überwacht.
- [ ] Netzwerkrichtlinien-Anforderungen sind gegen die Fähigkeiten der konkret eingesetzten CNI-Implementierung geprüft.

## Interviewfragen

### 1. Welches spezifische Problem löst die CNI-Ebene, das der Linux-Netzwerkstack allein nicht löst?

**Antwort:** Die eindeutige IP-Zuteilung an potenziell tausende Pods über viele Knoten hinweg (IPAM) und die direkte Pod-zu-Pod-Erreichbarkeit unabhängig vom physischen Knoten.

### 2. Was ist der Unterschied zwischen Overlay- und nativem Routing?

**Antwort:** Bei Overlay-Routing werden Pakete zwischen Knoten in ein zusätzliches Transportprotokoll gekapselt (flexibel, mit Overhead); bei nativem Routing werden Pod-Subnetze direkt in die physische Netzwerkinfrastruktur eingebunden (effizienter, aber infrastrukturabhängig).

### 3. Warum ist die stabile, DNS-basierte Dienstadressierung nicht Teil der CNI-Zuständigkeit?

**Antwort:** CNI stellt ausschließlich die grundlegende Pod-zu-Pod-Erreichbarkeit sicher; die stabile Adressierung eines Dienstes über sich ändernde Pod-Instanzen hinweg ist eine eigene, darüberliegende Abstraktionsebene (Kubernetes Services).

### 4. Warum ist die Unterscheidung zwischen allgemeinen CNI-Konzepten und einer konkreten Implementierung wie Cilium wichtig?

**Antwort:** Allgemeine CNI-Konzepte (Netzwerkanbindung, IPAM, Routing) gelten implementierungsunabhängig, während der konkrete Betrieb und zusätzliche Funktionen einer spezifischen Implementierung wie Cilium eine eigene Vertiefung darstellen, die nicht mit den Grundkonzepten verwechselt werden sollte.

### 5. Wie gehst du vor, wenn Pods auf demselben Knoten sich erreichen, aber Pods auf unterschiedlichen Knoten nicht?

**Antwort:** Ich prüfe die CNI-Routing-Konfiguration zwischen den Knoten-Subnetzen, da dies auf ein Routingproblem auf der CNI-Ebene statt auf ein allgemeines Netzwerkstack- oder Service-Problem hindeutet.

### 6. Widersprüchliche Anforderung: Team will maximale Netzwerkperformance durch natives Routing UND garantiert flexible Portabilität über unterschiedliche Infrastrukturumgebungen — wie gehst du vor?

**Antwort:** Ich würde die tatsächliche Kompatibilität der Zielinfrastruktur mit nativem Routing prüfen und bei heterogenen oder wechselnden Umgebungen ein Overlay-Netzwerk als portablere Standardwahl empfehlen, natives Routing gezielt nur dort einsetzen, wo eine stabile, kompatible physische Infrastruktur die Performance-Vorteile tatsächlich realisierbar macht.

## Praktische Labs

~~~python
class SimulatedCluster:
    def __init__(self):
        self.node_subnets = {"node_a": "10.0.1.0/24", "node_b": "10.0.2.0/24"}
        self.inter_node_routes = set()  # missing routes simulate a CNI routing problem
        self.pod_ips = {}

    def assign_pod_ip(self, pod_name, node):
        subnet_base = self.node_subnets[node].split("/")[0].rsplit(".", 1)[0]
        ip = f"{subnet_base}.{len(self.pod_ips) + 10}"
        self.pod_ips[pod_name] = {"ip": ip, "node": node}
        return ip

    def add_inter_node_route(self, node_a, node_b):
        self.inter_node_routes.add(frozenset({node_a, node_b}))

    def can_reach(self, pod_a, pod_b):
        node_a = self.pod_ips[pod_a]["node"]
        node_b = self.pod_ips[pod_b]["node"]
        if node_a == node_b:
            return True  # same-node pods always reachable
        return frozenset({node_a, node_b}) in self.inter_node_routes

cluster = SimulatedCluster()
cluster.assign_pod_ip("pod1", "node_a")
cluster.assign_pod_ip("pod2", "node_a")
cluster.assign_pod_ip("pod3", "node_b")

print(f"pod1 -> pod2 (same node) reachable: {cluster.can_reach('pod1', 'pod2')}")
print(f"pod1 -> pod3 (different nodes, NO route yet) reachable: {cluster.can_reach('pod1', 'pod3')}")

cluster.add_inter_node_route("node_a", "node_b")
print(f"pod1 -> pod3 (after adding CNI route) reachable: {cluster.can_reach('pod1', 'pod3')}")
~~~

## Dependencies, Cross-References und Quellen

1. Kubernetes-Dokumentation: [Cluster Networking](https://kubernetes.io/docs/concepts/cluster-administration/networking/), abgerufen 2026-09-17.
2. Cilium-Dokumentation: [Concepts — Networking](https://docs.cilium.io/en/stable/network/concepts/), abgerufen 2026-09-17.

Linux-Netzwerkstack und Paketpfade sind kanonisch in [KB-0039](../02-linux-systems/09-linux-netzwerkstack-und-paketpfade.md) behandelt; CRI und Container-Runtimes in [KB-0380](02-cri-und-container-runtimes.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| eBPF-basierte CNI-Implementierungen (z. B. Cilium) mit reduziertem Overhead gegenüber traditionellen iptables-basierten Ansätzen | Adopting | Gegenüber traditionellen iptables-basierten CNI-Implementierungen für bessere Performance bei großen Clustern bevorzugen. |
| Standardisierte Multi-Cluster-Netzwerkkonnektivität über CNI-Erweiterungen | Evaluating | Gegenüber isolierten Einzelcluster-Netzwerken abwägen, sobald ein konkreter Multi-Cluster-Bedarf besteht. |

Ein Team akzeptiert eine Netzwerkproblem-Diagnose erst, wenn sie eindeutig einer der drei Ebenen (Linux-Stack, CNI, Service) zugeordnet wurde.
