---
{"id": "KB-0402", "title": "Cilium und EBPF-Netzwerke", "domain": "16", "sequence": 24, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0381", "concepts": ["CNI und Pod-Netzwerke"], "needed_for": "understanding"}, {"id": "KB-0045", "concepts": ["EBPF und Kernelbeobachtung"], "needed_for": "understanding"}], "related": ["KB-0393"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Mit Hubble den tatsächlichen Netzwerkverkehr zwischen zwei Pods beobachten und eine Identity-basierte Netzwerkrichtlinie statt einer reinen IP-basierten Regel anwenden.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Entscheiden, wann die zusätzlichen Cilium-spezifischen Funktionen (Identity-basierte Policies, Hubble-Observability) einen konkreten Mehrwert gegenüber einer einfacheren CNI-Implementierung bieten.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein Netzwerkrichtlinienproblem anhand von Hubble-Flow-Daten statt anhand generischer CNI-Logs diagnostizieren.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Produktspezifisches Cilium-Wissen (Datapath, Identity, Hubble) als Ergänzung zu, nicht als Ersatz für, allgemeine CNI-/eBPF-Grundlagen im Unternehmen positionieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Implementierungsdetails des Cilium-eBPF-Datapaths im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis von Identity-basierten Policies und Hubble-Observability als konzeptioneller Mehrwert, nicht die Datapath-Implementierung selbst."}}, "lab_validation": [{"lab_id": "KB-0402-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal beschriebener Cilium-Workflow anhand offizieller Dokumentation, kein aktiver Cluster verwendet", "evidence": "Anhand der offiziellen Cilium-Dokumentation wird der Unterschied zwischen einer traditionellen IP-basierten Netzwerkrichtlinie und einer Cilium-Identity-basierten Richtlinie nachvollzogen, sowie der Ablauf einer Hubble-Flow-Abfrage zur Diagnose eines abgelehnten Verbindungsversuchs.", "limitations": "Keine reale Ausführung gegen einen produktiven Kubernetes-Cluster."}]}
---
# Cilium und EBPF-Netzwerke

> **Ziel:** Cilium ist eine konkrete CNI-Implementierung (siehe [KB-0381](03-cni-und-pod-netzwerke.md)), die auf eBPF (siehe die Kernel-Grundlagen in [KB-0045](../02-linux-systems/15-ebpf-und-kernelbeobachtung.md)) aufbaut, um einen effizienten Datapath (den tatsächlichen Weg, den Netzwerkpakete durch den Kernel nehmen), Identity-basierte Netzwerkrichtlinien (Zugriffskontrolle basierend auf Pod-Identität statt nur IP-Adresse), und Hubble (ein Observability-Werkzeug für den tatsächlichen Netzwerkverkehr) bereitzustellen. Dieser Artikel behandelt diese Cilium-spezifischen Konzepte, ohne die bereits an anderer Stelle behandelten allgemeinen eBPF- und CNI-Grundlagen zu wiederholen.

## Zweck, Mental Model und Dependencies

Der Cilium-Datapath verarbeitet Netzwerkpakete direkt im Linux-Kernel über eBPF-Programme, statt über traditionelle, userspace-basierte Netzwerkregeln (wie klassisches iptables), was signifikant geringeren Overhead pro Paket bedeuten kann, insbesondere bei großen Clustern mit vielen Netzwerkrichtlinien. Identity-basierte Netzwerkrichtlinien sind ein zentraler konzeptioneller Unterschied zu traditionellen, rein IP-basierten Netzwerkrichtlinien (siehe die allgemeinen NetworkPolicy-Grundlagen, [KB-0393](15-networkpolicy-und-netzwerkisolation.md)): statt Regeln an eine sich häufig ändernde Pod-IP-Adresse zu binden, weist Cilium jedem Pod basierend auf seinen Labels eine stabile "Identity" zu, und Netzwerkrichtlinien werden gegen diese Identity statt gegen die volatile IP-Adresse definiert — dies macht Richtlinien robuster gegenüber Pod-Neustarts und -Neuplanungen, bei denen sich die IP-Adresse ändert, die Identity (basierend auf Labels) aber gleich bleibt. Hubble ist ein auf Cilium aufbauendes Observability-Werkzeug, das den tatsächlichen Netzwerkverkehr zwischen Pods (einschließlich abgelehnter Verbindungsversuche durch eine Netzwerkrichtlinie) sichtbar macht — dies ist besonders wertvoll für die Diagnose von Netzwerkrichtlinienproblemen, da es direkt zeigt, welche konkrete Verbindung von welcher Richtlinie abgelehnt wurde, statt indirekt aus generischen CNI-Logs schließen zu müssen.

~~~text
Cilium datapath: processes packets directly in the Linux kernel via eBPF programs
  vs. traditional userspace-based rules (classic iptables) -> significantly LOWER per-packet overhead at scale
Identity-based network policies: KEY conceptual difference from traditional IP-based policies (cf. KB-0393)
  traditional: rules bound to a pod's IP address (changes on restart/rescheduling)
  Cilium: assigns a STABLE "Identity" based on pod LABELS -> policies target the identity, not the volatile IP
  -> policies remain correct across pod restarts/rescheduling even though the IP changes
Hubble: observability built on Cilium -- shows ACTUAL traffic flows between pods, INCLUDING rejected connections
  -> directly shows WHICH policy rejected WHICH connection, instead of inferring from generic CNI logs
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Cilium-spezifischer Mehrwert | Wann besonders relevant |
|---|---|---|
| eBPF-Datapath | geringerer Overhead pro Paket gegenüber iptables-basierten Ansätzen | große Cluster mit vielen Netzwerkrichtlinien und hohem Paketvolumen |
| Identity-basierte Policies | Richtlinien bleiben über Pod-Neustarts/-Neuplanungen hinweg korrekt | Umgebungen mit häufigen Pod-Neustarts oder dynamischer Skalierung |
| Hubble-Observability | direkte Sichtbarkeit tatsächlicher Verkehrsflüsse und Richtlinienentscheidungen | Diagnose komplexer Netzwerkrichtlinienprobleme in produktiven Clustern |

Implementierung: Netzwerkrichtlinien werden in Cilium-Umgebungen gegen Label-basierte Selektoren definiert, die intern auf stabile Identities statt volatile IP-Adressen abgebildet werden, wodurch Richtlinien robust gegenüber Pod-Lebenszyklusänderungen bleiben. Bei der Diagnose eines abgelehnten Verbindungsversuchs wird zunächst Hubble abgefragt, um den konkreten Flow und die dafür verantwortliche Richtlinie direkt zu identifizieren, statt generische CNI-Logs zu durchsuchen. Die Entscheidung für Cilium gegenüber einer einfacheren CNI-Implementierung basiert auf einem konkreten Bedarf an diesen zusätzlichen Funktionen (Performance bei großem Paketvolumen, Identity-Stabilität, detaillierte Observability), nicht auf reiner Popularität.

## Scalability, Reliability, Security und Observability

Der eBPF-basierte Datapath skaliert Netzwerkverarbeitungseffizienz proportional zur Reduktion des Overheads gegenüber traditionellen iptables-basierten Ansätzen, besonders spürbar bei wachsender Anzahl an Netzwerkrichtlinien und Paketvolumen; die Reliability-Grenze liegt darin, dass eine fehlende Nutzung der Identity-basierten Policies proportional zur Häufigkeit von Pod-Neustarts das Risiko fehlerhaft zwischenzeitlich ungültiger IP-basierter Richtlinien erhöht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Netzwerkrichtlinie funktioniert nach einem Pod-Neustart nicht mehr korrekt | die Richtlinie war fälschlich an eine spezifische IP-Adresse statt an eine Identity/Labels gebunden | die Richtlinienkonfiguration prüfen und auf Label-basierte Selektoren statt IP-Bindung umstellen |
| ein Verbindungsversuch wird unerwartet abgelehnt, ohne klare Ursache in generischen Logs | die konkrete verantwortliche Richtlinie ist nicht offensichtlich aus Standard-CNI-Logs ersichtlich | eine Hubble-Flow-Abfrage für die betroffene Verbindung durchführen, um die konkrete ablehnende Richtlinie zu identifizieren |
| ein Cluster mit sehr vielen Netzwerkrichtlinien zeigt spürbaren Netzwerk-Overhead | eine traditionelle, iptables-basierte CNI-Implementierung wird für ein Paketvolumen verwendet, das von einem eBPF-basierten Datapath profitieren würde | die tatsächliche Netzwerklatenz und den CPU-Overhead gegen eine Cilium-Migration evaluieren |

Security: Identity-basierte Richtlinien reduzieren das Risiko, dass eine Richtlinie nach einem Pod-Neustart fälschlich ungültig wird und damit unbeabsichtigt entweder zu restriktiv oder zu offen wird. Observability: Hubble-Flow-Daten (akzeptierte und abgelehnte Verbindungen mit zugehöriger Richtlinienentscheidung) sind die zentrale, produktspezifische Observability-Metrik für Cilium-basierte Netzwerke.

## Trade-offs und Entscheidungen

**Staff** implementiert Identity-basierte statt IP-basierte Netzwerkrichtlinien in Cilium-Umgebungen. **Principal** macht Hubble-Flow-Diagnosen für das Team nachvollziehbar. **Chief** positioniert produktspezifisches Cilium-Wissen als Ergänzung zu, nicht als Ersatz für, allgemeine CNI-/eBPF-Grundlagen im Unternehmen.

Anti-Patterns: Netzwerkrichtlinien weiterhin an spezifische IP-Adressen statt an Identity/Labels binden, obwohl Cilium Identity-basierte Policies unterstützt; bei Netzwerkrichtlinienproblemen generische CNI-Logs statt der verfügbaren Hubble-Flow-Daten zur Diagnose verwenden; Cilium ohne konkreten Bedarf an dessen zusätzlichen Funktionen einführen.

## Production Checklist

- [ ] Netzwerkrichtlinien sind Identity-/Label-basiert statt IP-basiert konfiguriert.
- [ ] Hubble ist für die Diagnose von Netzwerkrichtlinienproblemen verfügbar und wird aktiv genutzt.
- [ ] Die Entscheidung für Cilium basiert auf konkretem Bedarf an dessen zusätzlichen Funktionen.
- [ ] Der tatsächliche Performance-Vorteil des eBPF-Datapaths ist gegen die vorherige CNI-Implementierung gemessen.

## Interviewfragen

### 1. Was ist der zentrale konzeptionelle Unterschied zwischen Identity-basierten und traditionellen IP-basierten Netzwerkrichtlinien?

**Antwort:** Identity-basierte Richtlinien binden Regeln an eine stabile, label-basierte Identität eines Pods, die über Neustarts hinweg gleich bleibt, während IP-basierte Richtlinien an die volatile IP-Adresse gebunden sind, die sich bei Neustarts ändert.

### 2. Wozu dient Hubble, und welchen konkreten Diagnosevorteil bietet es?

**Antwort:** Hubble macht den tatsächlichen Netzwerkverkehr zwischen Pods sichtbar, einschließlich abgelehnter Verbindungsversuche, und zeigt direkt, welche konkrete Richtlinie eine bestimmte Verbindung abgelehnt hat, statt dies indirekt aus generischen Logs erschließen zu müssen.

### 3. Warum bietet der Cilium-eBPF-Datapath einen Performance-Vorteil gegenüber traditionellen iptables-basierten Ansätzen?

**Antwort:** Netzwerkpakete werden direkt im Linux-Kernel über eBPF-Programme verarbeitet, statt über traditionelle, userspace-basierte Regeln, was zu geringerem Overhead pro Paket führt, besonders spürbar bei vielen Netzwerkrichtlinien.

### 4. Was passiert, wenn eine Netzwerkrichtlinie fälschlich an eine IP-Adresse statt an eine Identity gebunden ist?

**Antwort:** Nach einem Pod-Neustart, bei dem sich die IP-Adresse ändert, kann die Richtlinie ungültig werden oder nicht mehr korrekt greifen, obwohl die Identität (basierend auf Labels) unverändert geblieben ist.

### 5. Wie gehst du vor, wenn ein Verbindungsversuch unerwartet abgelehnt wird, ohne klare Ursache in generischen Logs?

**Antwort:** Ich führe eine Hubble-Flow-Abfrage für die betroffene Verbindung durch, um die konkrete verantwortliche Netzwerkrichtlinie direkt zu identifizieren.

### 6. Widersprüchliche Anforderung: Team will maximale Netzwerkperformance durch Cilium UND minimalen zusätzlichen Lernaufwand für das Team — wie gehst du vor?

**Antwort:** Ich würde die allgemeinen CNI-/NetworkPolicy-Grundlagen als Basiswissen voraussetzen und Cilium-spezifisches Wissen (Identity-Modell, Hubble) gezielt und schrittweise als Ergänzung vermitteln, statt das Team mit vollständigen eBPF-Implementierungsdetails zu überfordern, die für den produktiven Betrieb nicht zwingend notwendig sind.

## Praktische Labs

~~~python
# Conceptual comparison: IP-based vs. identity-based policy matching (not executed against a real cluster):

class SimulatedPod:
    def __init__(self, ip, labels):
        self.ip = ip
        self.labels = labels

def ip_based_policy_allows(policy_allowed_ip, pod):
    return pod.ip == policy_allowed_ip

def identity_based_policy_allows(policy_allowed_labels, pod):
    return all(pod.labels.get(k) == v for k, v in policy_allowed_labels.items())

pod_before_restart = SimulatedPod(ip="10.0.1.5", labels={"app": "backend"})
pod_after_restart = SimulatedPod(ip="10.0.1.9", labels={"app": "backend"})  # IP changed, labels same

ip_policy = "10.0.1.5"
identity_policy = {"app": "backend"}

print(f"IP-based policy still valid after restart: {ip_based_policy_allows(ip_policy, pod_after_restart)}")
print(f"Identity-based policy still valid after restart: {identity_based_policy_allows(identity_policy, pod_after_restart)}")
~~~

## Dependencies, Cross-References und Quellen

1. Cilium-Dokumentation: [Cilium Architecture](https://docs.cilium.io/en/stable/overview/component-overview/), abgerufen 2026-09-17.
2. Cilium-Dokumentation: [Hubble — Network, Service & Security Observability](https://docs.cilium.io/en/stable/overview/intro/#hubble), abgerufen 2026-09-17.

CNI und Pod-Netzwerke sind kanonisch in [KB-0381](03-cni-und-pod-netzwerke.md) behandelt; EBPF und Kernelbeobachtung in [KB-0045](../02-linux-systems/15-ebpf-und-kernelbeobachtung.md); NetworkPolicy und Netzwerkisolation in [KB-0393](15-networkpolicy-und-netzwerkisolation.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Cilium als CNI mit integrierter Service-Mesh-Funktionalität (sidecar-frei über eBPF) gegenüber traditionellen Sidecar-basierten Service-Mesh-Lösungen | Evaluating | Gegenüber sidecar-basierten Service-Mesh-Ansätzen abwägen, sobald der Reifegrad der sidecar-freien Implementierung für den konkreten Anwendungsfall ausreichend ist. |
| Erweiterte Hubble-Funktionen für Layer-7-Protokoll-Observability (z. B. HTTP-Anfragedetails) | Adopting | Gegenüber reiner Layer-3/4-Observability für tiefere Anwendungsdiagnose bevorzugen. |

Ein Team akzeptiert eine Cilium-Migration erst, wenn der konkrete Mehrwert (Performance, Identity-Stabilität, Observability) gegenüber der bisherigen CNI-Implementierung nachgewiesen ist.
