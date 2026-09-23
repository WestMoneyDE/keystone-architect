---
{"id": "KB-0396", "title": "Autoscaling für Workloads", "domain": "16", "sequence": 18, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0395", "concepts": ["Ressourcenmanagement im Cluster"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Horizontal Pod Autoscaler mit einer CPU-basierten Zielmetrik konfigurieren und dessen Reaktion auf eine simulierte Lastspitze mit Berücksichtigung der Signalverzögerung beobachten.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Zwischen HPA (horizontale Skalierung der Replica-Anzahl), VPA (vertikale Skalierung der Ressourcen-Requests/Limits) und ereignisbasierter Skalierung basierend auf dem tatsächlichen Lastprofil einer Anwendung wählen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein instabiles, wiederholt hoch- und herunterskalierendes Autoscaling-Verhalten auf eine unzureichend berücksichtigte Signalverzögerung oder Startupzeit statt auf einen Konfigurationsfehler im Allgemeinen zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Autoscaling-Konfigurationen, die Signalverzögerung und Startupzeiten explizit berücksichtigen, als Standard für stabile, produktive Skalierung im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene, benutzerdefinierte Metrik-Adapter für HPA im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis der Skalierungsmodelle und ihrer Zeitverzögerungsproblematik, nicht ein spezifischer Metrik-Adapter."}}, "lab_validation": [{"lab_id": "KB-0396-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes HPA-Modell mit einer Lastspitze und unterschiedlich konfigurierter Reaktionsverzögerung", "evidence": "Ein simulierter Horizontal Pod Autoscaler mit zu kurzer Stabilisierungsphase reagiert auf eine kurzzeitige Lastspitze mit sofortigem Hoch- und unmittelbar folgendem Herunterskalieren (Oszillation), während eine korrekt konfigurierte Stabilisierungsphase dieses instabile Verhalten durch eine bewusste Verzögerung vermeidet.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, künstlich konstruiertes Lastspitzenszenario."}]}
---
# Autoscaling für Workloads

> **Ziel:** Der Horizontal Pod Autoscaler (HPA) skaliert die Anzahl der Pod-Replicas basierend auf beobachteten Metriken (z. B. CPU-Auslastung, siehe [KB-0395](17-ressourcenmanagement-im-cluster.md)); der Vertical Pod Autoscaler (VPA) passt stattdessen die Ressourcen-Requests/Limits einzelner Pods an; ereignisbasierte Skalierung (z. B. über KEDA) skaliert basierend auf externen Ereignisquellen (z. B. Nachrichtenwarteschlangenlänge) statt reiner Ressourcenmetriken. Der zentrale Punkt dieses Kapitels ist, dass jede dieser Skalierungsformen eine inhärente Signalverzögerung und Startupzeit-Problematik hat, die bei nicht ausreichender Berücksichtigung zu instabilem, oszillierendem Skalierungsverhalten führt.

## Zweck, Mental Model und Dependencies

HPA beobachtet eine Zielmetrik in regelmäßigen Abständen und passt die Replica-Anzahl an, um die Metrik in der Nähe eines Zielwerts zu halten (z. B. 50% durchschnittliche CPU-Auslastung); VPA beobachtet stattdessen den tatsächlichen Ressourcenverbrauch eines Pods über die Zeit und schlägt (oder erzwingt) angepasste Requests/Limits vor, um Über- oder Unterprovisionierung zu vermeiden. Ereignisbasierte Skalierung reagiert auf externe Signale, die nicht direkt Ressourcenverbrauch sind (z. B. die Länge einer Nachrichtenwarteschlange), was für Anwendungen mit stoßweiser, ereignisgetriebener Last besser geeignet sein kann als reine ressourcenbasierte Metriken. Der zentrale, häufig unterschätzte Punkt bei allen drei Formen ist die Signalverzögerung: zwischen dem tatsächlichen Auftreten einer Laständerung, der Erfassung der entsprechenden Metrik, der Entscheidung des Autoscalers, und der tatsächlichen Verfügbarkeit neuer Pod-Replicas (die selbst eine Startupzeit benötigen, bevor sie tatsächlich Last übernehmen können) vergeht eine nicht triviale Zeitspanne. Wird diese Verzögerung bei der Autoscaling-Konfiguration nicht berücksichtigt (z. B. durch eine zu kurze Stabilisierungsphase, die eine sofortige Reaktion auf jede kurzzeitige Lastschwankung erlaubt), entsteht ein instabiles Oszillationsmuster: eine kurze Lastspitze löst ein Hochskalieren aus, doch bis die neuen Replicas tatsächlich verfügbar sind, ist die Lastspitze bereits vorüber, sodass unmittelbar danach wieder herunterskaliert wird — dieses Muster wiederholt sich bei jeder neuen Schwankung und führt zu ständigem, ressourcenintensivem Auf- und Abskalieren, ohne tatsächlich stabile Kapazität bereitzustellen.

~~~text
HPA: scales REPLICA COUNT based on observed metrics (e.g. CPU utilization, cf. KB-0395)
VPA: scales individual pod's RESOURCE requests/limits based on observed actual usage over time
Event-driven scaling (e.g. KEDA): scales based on EXTERNAL signals (e.g. queue length), not just resource metrics
  -> better fit for bursty, event-driven load patterns
UNDERESTIMATED PROBLEM common to ALL THREE: signal delay
  actual load change -> metric collection -> autoscaler decision -> new replica creation -> replica STARTUP TIME before it can take load
  -> non-trivial total delay
INSUFFICIENT stabilization window -> OSCILLATION:
  brief load spike -> triggers scale-up -> by the time new replicas are ready, spike is ALREADY OVER -> immediate scale-down
  -> repeats on every fluctuation -> constant, resource-intensive up/down scaling WITHOUT providing actually stable capacity
~~~

## Core Concepts, Architektur und Implementierung

| Skalierungsform | Basis | Typisches Zeitverzögerungsproblem |
|---|---|---|
| HPA | beobachtete Ressourcenmetrik (z. B. CPU) | Metrikerfassungsintervall plus Pod-Startupzeit |
| VPA | beobachteter tatsächlicher Ressourcenverbrauch über Zeit | Anpassung erfordert oft Pod-Neustart, was kurzzeitige Unterbrechung bedeuten kann |
| Ereignisbasierte Skalierung | externe Ereignisquelle (z. B. Warteschlangenlänge) | Verzögerung zwischen Ereignisänderung und tatsächlicher Skalierungsreaktion |

Implementierung: Für Anwendungen mit relativ stabiler, vorhersehbarer Last wird HPA mit einer bewusst konfigurierten Stabilisierungsphase eingesetzt, die kurzzeitige Lastschwankungen bewusst ignoriert, um Oszillation zu vermeiden. Für Anwendungen mit stark variierendem Ressourcenbedarf, aber stabiler Replica-Anzahl wird VPA eingesetzt. Für Anwendungen mit stoßweiser, ereignisgetriebener Last (z. B. Verarbeitung aus einer Warteschlange) wird ereignisbasierte Skalierung bevorzugt, da sie direkter auf die tatsächliche Arbeitslast statt auf eine indirekte Ressourcenmetrik reagiert. In allen Fällen wird die tatsächliche Startupzeit der Anwendung (wie lange dauert es, bis ein neuer Pod tatsächlich produktiv Last übernehmen kann, einschließlich Initialisierung und Readiness-Probe, siehe [KB-0384](06-pods-und-lebenszyklen.md)) explizit bei der Konfiguration der Skalierungsparameter berücksichtigt.

## Scalability, Reliability, Security und Observability

Autoscaling skaliert Kapazität proportional zur tatsächlichen Last, mit einer inhärenten Verzögerung entsprechend der Summe aus Metrikerfassungsintervall, Entscheidungslatenz und Pod-Startupzeit; die Reliability-Grenze liegt darin, dass eine unzureichend konfigurierte Stabilisierungsphase proportional zur Häufigkeit kurzzeitiger Lastschwankungen zu instabilem Oszillationsverhalten führt, das mehr Ressourcen verbraucht, ohne stabile Kapazität zu liefern.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Anwendung skaliert wiederholt schnell hoch und unmittelbar danach wieder herunter | die Stabilisierungsphase des Autoscalers ist zu kurz, um kurzzeitige Lastschwankungen zu glätten | die Stabilisierungsphase verlängern und die tatsächliche Lastvolatilität gegen die neue Konfiguration prüfen |
| eine Lastspitze führt zu spürbaren Leistungseinbußen, bevor ausreichend neue Replicas verfügbar sind | die Pod-Startupzeit ist länger als die vom Autoscaling-Modell angenommene Reaktionszeit | die tatsächliche Pod-Startupzeit messen und die Skalierungsparameter (z. B. proaktivere Skalierungsschwellen) entsprechend anpassen |
| eine Anwendung mit stoßweiser, ereignisgetriebener Last skaliert trotz aktiver HPA-Konfiguration nicht angemessen | eine reine ressourcenbasierte Metrik (CPU) spiegelt die tatsächliche, ereignisgetriebene Arbeitslast nicht genau wider | eine ereignisbasierte Skalierungslösung evaluieren, die direkt auf die tatsächliche externe Ereignisquelle reagiert |

Security: Unkontrolliertes, oszillierendes Autoscaling kann zu unerwarteten Kostenspitzen und zu einer erhöhten Angriffsfläche durch häufig neu erstellte, potenziell unzureichend initialisierte Pod-Instanzen führen. Observability: Die Häufigkeit und Amplitude von Skalierungsereignissen über die Zeit, die gemessene Signalverzögerung zwischen Laständerung und tatsächlicher Kapazitätsanpassung, und die tatsächliche Pod-Startupzeit sind zentrale Autoscaling-Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert bewusst konfigurierte Stabilisierungsphasen basierend auf der tatsächlichen Lastvolatilität und Pod-Startupzeit. **Principal** macht beobachtete Skalierungsmuster und deren Ursachen für das Team nachvollziehbar. **Chief** etabliert Autoscaling-Konfigurationen, die Signalverzögerung und Startupzeiten explizit berücksichtigen, als Standard für stabile, produktive Skalierung im Unternehmen.

Anti-Patterns: eine Stabilisierungsphase ohne Bezug zur tatsächlichen Lastvolatilität und Pod-Startupzeit konfigurieren; eine reine ressourcenbasierte Metrik für Anwendungen mit stark stoßweiser, ereignisgetriebener Last verwenden; instabiles Oszillationsverhalten als "normales" Autoscaling-Verhalten hinnehmen, statt die zugrunde liegende Konfiguration zu korrigieren.

## Production Checklist

- [ ] Die Stabilisierungsphase ist basierend auf der tatsächlichen Lastvolatilität konfiguriert, um Oszillation zu vermeiden.
- [ ] Die tatsächliche Pod-Startupzeit ist gemessen und bei der Skalierungskonfiguration berücksichtigt.
- [ ] Anwendungen mit stoßweiser, ereignisgetriebener Last verwenden ereignisbasierte statt rein ressourcenbasierter Skalierung.
- [ ] Die Häufigkeit und Amplitude von Skalierungsereignissen wird überwacht, um Oszillation frühzeitig zu erkennen.

## Interviewfragen

### 1. Was ist der Unterschied zwischen HPA und VPA?

**Antwort:** HPA skaliert die Anzahl der Pod-Replicas basierend auf beobachteten Metriken; VPA passt stattdessen die Ressourcen-Requests/Limits einzelner Pods basierend auf tatsächlichem Verbrauch an.

### 2. Warum ist ereignisbasierte Skalierung für manche Anwendungen besser geeignet als reine ressourcenbasierte Skalierung?

**Antwort:** Bei stoßweiser, ereignisgetriebener Last (z. B. Warteschlangenverarbeitung) spiegelt eine ressourcenbasierte Metrik wie CPU die tatsächliche Arbeitslast oft ungenau wider; ereignisbasierte Skalierung reagiert direkt auf das tatsächliche externe Signal.

### 3. Was verursacht Oszillation beim Autoscaling, und wie kann sie vermieden werden?

**Antwort:** Eine zu kurze Stabilisierungsphase führt dazu, dass kurzzeitige Lastspitzen ein sofortiges Hoch- und unmittelbar folgendes Herunterskalieren auslösen; eine ausreichend lange Stabilisierungsphase glättet diese kurzzeitigen Schwankungen.

### 4. Warum ist die Pod-Startupzeit für die Autoscaling-Konfiguration relevant?

**Antwort:** Zwischen der Skalierungsentscheidung und der tatsächlichen Verfügbarkeit eines neuen Pods vergeht die Startupzeit; ist diese lang, kann eine Lastspitze bereits vorüber sein, bevor die neue Kapazität tatsächlich zur Verfügung steht.

### 5. Wie gehst du vor, wenn eine Anwendung wiederholt instabil hoch- und herunterskaliert?

**Antwort:** Ich prüfe die konfigurierte Stabilisierungsphase gegen die tatsächliche Lastvolatilität und verlängere sie bei Bedarf, um kurzzeitige Schwankungen nicht als dauerhafte Trendänderung zu interpretieren.

### 6. Widersprüchliche Anforderung: Team will sehr schnelle Reaktion auf Lastspitzen UND garantiert kein instabiles Oszillationsverhalten — wie gehst du vor?

**Antwort:** Ich würde eine asymmetrische Konfiguration vorschlagen: schnelles Hochskalieren bei tatsächlich anhaltender Last (kurze Verzögerung beim Scale-up), aber eine deutlich längere Stabilisierungsphase beim Herunterskalieren (Scale-down), sodass auf echte Lastspitzen zügig reagiert wird, während kurzzeitige Rückgänge nicht sofort zu einem Abbau der gerade erst bereitgestellten Kapazität führen.

## Praktische Labs

~~~python
class SimulatedHPA:
    def __init__(self, target_cpu_percent, stabilization_window):
        self.target_cpu_percent = target_cpu_percent
        self.stabilization_window = stabilization_window
        self.recent_decisions = []
        self.current_replicas = 2

    def observe_and_decide(self, tick, observed_cpu_percent):
        desired_replicas = max(1, round(self.current_replicas * observed_cpu_percent / self.target_cpu_percent))
        # Only act if the desired state has been consistent within the stabilization window
        self.recent_decisions.append((tick, desired_replicas))
        recent_in_window = [d for t, d in self.recent_decisions if t > tick - self.stabilization_window]
        if len(set(recent_in_window)) == 1 and recent_in_window:
            self.current_replicas = recent_in_window[0]
        return self.current_replicas

load_pattern = [50, 90, 95, 50, 48, 52, 50, 50, 50]  # a brief spike, then back to normal

hpa_unstable = SimulatedHPA(target_cpu_percent=50, stabilization_window=1)  # too short -> oscillates
hpa_stable = SimulatedHPA(target_cpu_percent=50, stabilization_window=3)  # smooths brief spikes

print("Unstable (short stabilization window):")
for tick, cpu in enumerate(load_pattern):
    print(f"  tick={tick}, cpu={cpu}% -> replicas={hpa_unstable.observe_and_decide(tick, cpu)}")

print("\nStable (longer stabilization window):")
for tick, cpu in enumerate(load_pattern):
    print(f"  tick={tick}, cpu={cpu}% -> replicas={hpa_stable.observe_and_decide(tick, cpu)}")
~~~

## Dependencies, Cross-References und Quellen

1. Kubernetes-Dokumentation: [Horizontal Pod Autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/), abgerufen 2026-09-17.
2. KEDA-Dokumentation: [Concepts](https://keda.sh/docs/latest/concepts/), abgerufen 2026-09-17.

Ressourcenmanagement im Cluster ist kanonisch in [KB-0395](17-ressourcenmanagement-im-cluster.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Prädiktives Autoscaling, das historische Lastmuster nutzt, um Kapazität proaktiv statt rein reaktiv anzupassen | Evaluating | Gegenüber rein reaktivem Autoscaling abwägen, sobald das Lastprofil ausreichend vorhersehbare, wiederkehrende Muster zeigt. |
| Integrierte HPA/VPA-Kombinationsmodi, die horizontale und vertikale Skalierung koordiniert statt unabhängig anwenden | Evaluating | Gegenüber getrennter HPA-/VPA-Konfiguration abwägen, sobald Konflikte zwischen beiden Skalierungsformen in der Praxis auftreten. |

Ein Team akzeptiert eine Autoscaling-Konfiguration erst, wenn sie nachweislich stabil auf realistische Lastschwankungen reagiert, ohne zu oszillieren.
