---
{"id": "KB-0395", "title": "Ressourcenmanagement im Cluster", "domain": "16", "sequence": 17, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0038", "concepts": ["Cgroups und Ressourcenbegrenzung"], "needed_for": "understanding"}, {"id": "KB-0394", "concepts": ["Scheduling und Platzierungsregeln"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Pod mit unterschiedlichen Requests-/Limits-Kombinationen erstellen, die resultierende QoS-Klasse bestimmen, und ein CPU-Throttling- sowie ein OOM-Ereignis beobachten.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Requests und Limits so konfigurieren, dass die resultierende QoS-Klasse dem tatsächlichen Kritikalitätsgrad einer Anwendung entspricht.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein beobachtetes CPU-Throttling oder einen OOM-Kill auf die zugrunde liegende cgroups-Mechanik zurückführen können, statt sie als unspezifisches Leistungsproblem zu behandeln.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Bewusste QoS-Klassen-Zuordnung basierend auf tatsächlicher Anwendungskritikalität als Standard für Ressourcenkonfiguration im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene cgroups-v2-spezifische Steuerungsmechanismen im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis von Requests/Limits/QoS und deren cgroups-Grundlage, nicht jede cgroups-v2-Detailfunktion."}}, "lab_validation": [{"lab_id": "KB-0395-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Ressourcenmodell mit drei unterschiedlichen Requests-/Limits-Kombinationen und resultierenden QoS-Klassen", "evidence": "Drei simulierte Pod-Konfigurationen (Requests gleich Limits, Requests kleiner als Limits, keine Limits gesetzt) resultieren korrekt in den drei Kubernetes-QoS-Klassen (Guaranteed, Burstable, BestEffort), was die zugrunde liegende Eviction-Priorität bei Ressourcenknappheit auf dem Knoten bestimmt.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, künstlich vereinfachtes QoS-Modell."}]}
---
# Ressourcenmanagement im Cluster

> **Ziel:** Kubernetes-Ressourcenmanagement setzt auf den Linux-cgroups-Mechanismus (siehe [KB-0038](../02-linux-systems/08-cgroups-und-ressourcenbegrenzung.md)) auf, um Requests (garantiert reservierte Ressourcen), Limits (harte Obergrenzen) und die daraus resultierende QoS-Klasse (Guaranteed, Burstable, BestEffort) durchzusetzen, aufbauend auf den Scheduling-Grundlagen (siehe [KB-0394](16-scheduling-und-platzierungsregeln.md)). Der zentrale Punkt dieses Kapitels ist, CPU-Throttling und OOM-Kills (Out-of-Memory-Terminierungen) nicht als isolierte, unspezifische Kubernetes-Phänomene zu behandeln, sondern direkt auf die zugrunde liegende cgroups-Mechanik zurückzuführen, die diese Effekte tatsächlich erzeugt.

## Zweck, Mental Model und Dependencies

Ein Request definiert die Ressourcenmenge, die ein Container garantiert zugewiesen bekommt (und die der Scheduler bei der Knotenauswahl berücksichtigt, siehe [KB-0394](16-scheduling-und-platzierungsregeln.md)); ein Limit definiert die harte Obergrenze, die ein Container nicht überschreiten darf. Bei CPU wird ein Limit über die cgroups-CPU-Quota durchgesetzt: überschreitet ein Prozess seine zugewiesene CPU-Zeit innerhalb eines Zeitfensters, wird er gedrosselt (Throttling) — er läuft weiter, erhält aber für den Rest des Zeitfensters keine weitere CPU-Zeit, was zu spürbaren Latenzspitzen führen kann, selbst wenn der Knoten insgesamt nicht ausgelastet ist. Bei Speicher wird ein Limit über die cgroups-Speichergrenze durchgesetzt: überschreitet ein Prozess sein zugewiesenes Speicherlimit, greift der Linux-OOM-Killer (Out-of-Memory-Killer) und terminiert den Prozess abrupt (OOM-Kill), ohne Möglichkeit einer geordneten Beendigung. Kubernetes leitet aus dem Verhältnis von Requests zu Limits drei QoS-Klassen ab: Guaranteed (Requests gleich Limits für alle Ressourcen — höchste Priorität, wird zuletzt evictet), Burstable (Requests kleiner als Limits, oder nur teilweise gesetzt — mittlere Priorität), und BestEffort (weder Requests noch Limits gesetzt — niedrigste Priorität, wird zuerst evictet bei Ressourcenknappheit auf dem Knoten). Der zentrale methodische Punkt ist: ein beobachtetes CPU-Throttling oder ein OOM-Kill ist kein diffuses "Leistungsproblem", sondern eine direkte, mechanisch erklärbare Konsequenz der konfigurierten cgroups-Limits — die Diagnose sollte daher stets bei den konkreten Requests-/Limits-Werten und der zugrunde liegenden cgroups-Durchsetzung ansetzen, statt bei einer vagen Vermutung über "zu wenig Ressourcen".

~~~text
Request: guaranteed resource amount (also used by scheduler for node selection, cf. KB-0394)
Limit: hard ceiling a container may not exceed
CPU limit enforcement: via cgroups CPU quota
  process exceeds its allotted CPU time within a period -> THROTTLED (keeps running, gets NO more CPU time for rest of period)
  -> visible latency spikes, even if the NODE overall isn't fully utilized
Memory limit enforcement: via cgroups memory limit
  process exceeds its memory limit -> Linux OOM-Killer terminates it ABRUPTLY (OOM-KILL), no graceful shutdown chance
QoS classes derived from requests-vs-limits ratio:
  Guaranteed: requests == limits for ALL resources -> highest priority, evicted LAST
  Burstable:  requests < limits, or partially set -> medium priority
  BestEffort: neither requests nor limits set -> lowest priority, evicted FIRST under node pressure
KEY POINT: throttling/OOM-kill are NOT vague "performance issues" -- direct, MECHANICALLY explainable consequences of configured cgroups limits
~~~

## Core Concepts, Architektur und Implementierung

| QoS-Klasse | Requests/Limits-Verhältnis | Eviction-Priorität bei Ressourcenknappheit |
|---|---|---|
| Guaranteed | Requests = Limits für alle Ressourcen | zuletzt evictet (höchste Priorität) |
| Burstable | Requests < Limits, oder teilweise gesetzt | mittlere Priorität |
| BestEffort | weder Requests noch Limits gesetzt | zuerst evictet (niedrigste Priorität) |

Implementierung: Für kritische Anwendungen wird die Guaranteed-QoS-Klasse durch identische Requests- und Limits-Werte für CPU und Speicher konfiguriert, um die höchste Eviction-Priorität bei Ressourcenknappheit zu sichern. Für Anwendungen mit variablem, aber begrenztem Ressourcenbedarf wird Burstable durch unterschiedliche Requests-/Limits-Werte konfiguriert. Bei einem beobachteten CPU-Throttling wird das konfigurierte CPU-Limit gegen die tatsächliche CPU-Nutzung des Containers verglichen; bei einem OOM-Kill wird das konfigurierte Speicherlimit gegen den tatsächlichen Speicherverbrauch zum Zeitpunkt der Terminierung geprüft, statt die Ursache pauschal als "Anwendungsfehler" zu vermuten.

## Scalability, Reliability, Security und Observability

Explizite Requests-/Limits-Konfiguration skaliert Ressourcenvorhersagbarkeit proportional zur Genauigkeit der deklarierten Werte gegenüber dem tatsächlichen Bedarf; die Reliability-Grenze liegt darin, dass zu niedrig angesetzte Limits proportional zur tatsächlichen Lastspitzenhöhe zu Throttling oder OOM-Kills führen, selbst wenn die Anwendung selbst fehlerfrei arbeitet.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Anwendung zeigt periodische Latenzspitzen, obwohl der Knoten insgesamt nicht ausgelastet ist | die Anwendung wird durch ihr konfiguriertes CPU-Limit gedrosselt (Throttling) | das konfigurierte CPU-Limit gegen die tatsächliche CPU-Nutzung während der Latenzspitzen vergleichen |
| ein Container wird wiederholt abrupt terminiert, ohne erkennbaren Anwendungsfehler | ein OOM-Kill aufgrund eines zu niedrig konfigurierten Speicherlimits liegt vor | das konfigurierte Speicherlimit gegen den tatsächlichen Speicherverbrauch zum Terminierungszeitpunkt prüfen |
| bei Ressourcenknappheit auf einem Knoten wird eine kritische Anwendung vor weniger kritischen Anwendungen evictet | die kritische Anwendung besitzt eine niedrigere QoS-Klasse (Burstable/BestEffort) als beabsichtigt | die Requests-/Limits-Konfiguration der kritischen Anwendung prüfen und auf Guaranteed umstellen |

Security: Eine Anwendung ohne konfigurierte Limits (BestEffort) kann bei einem Fehlverhalten (z. B. einem Speicherleck) unbegrenzt Ressourcen auf einem Knoten beanspruchen und dadurch andere, korrekt limitierte Anwendungen auf demselben Knoten beeinträchtigen; explizite Limits sind daher auch eine Isolationsmaßnahme. Observability: Die Häufigkeit von CPU-Throttling-Ereignissen, OOM-Kill-Ereignissen, und die Verteilung der QoS-Klassen über alle laufenden Workloads sind zentrale Ressourcenmanagement-Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert explizite, realistische Requests-/Limits-Werte für jede Anwendung basierend auf tatsächlich beobachtetem Ressourcenbedarf. **Principal** macht die resultierende QoS-Klasse und deren Begründung für das Team nachvollziehbar. **Chief** etabliert bewusste QoS-Klassen-Zuordnung basierend auf tatsächlicher Anwendungskritikalität als Standard für Ressourcenkonfiguration im Unternehmen.

Anti-Patterns: Anwendungen ohne jegliche Requests/Limits (BestEffort) in Produktion betreiben; CPU-Throttling oder OOM-Kills als unspezifisches "Leistungsproblem" statt als direkte cgroups-Konsequenz diagnostizieren; kritische Anwendungen ohne Guaranteed-QoS-Konfiguration betreiben, obwohl ihre Kritikalität dies erfordern würde.

## Production Checklist

- [ ] Jede Anwendung besitzt explizit konfigurierte, realistische Requests- und Limits-Werte.
- [ ] Kritische Anwendungen sind mit Guaranteed-QoS (Requests = Limits) konfiguriert.
- [ ] Beobachtetes CPU-Throttling oder OOM-Kills werden direkt gegen die konfigurierten cgroups-Limits diagnostiziert.
- [ ] Die Verteilung der QoS-Klassen über alle Workloads wird überwacht und regelmäßig überprüft.

## Interviewfragen

### 1. Was ist der Unterschied zwischen einem Request und einem Limit?

**Antwort:** Ein Request ist die garantiert zugewiesene Ressourcenmenge, die auch bei der Scheduler-Knotenauswahl berücksichtigt wird; ein Limit ist die harte Obergrenze, die ein Container nicht überschreiten darf.

### 2. Was passiert mechanisch bei CPU-Throttling, und warum kann es Latenzspitzen verursachen?

**Antwort:** Die cgroups-CPU-Quota erkennt, dass ein Prozess seine zugewiesene CPU-Zeit innerhalb eines Zeitfensters überschritten hat, und entzieht ihm für den Rest des Zeitfensters weitere CPU-Zeit, was zu spürbaren Latenzspitzen führt, selbst bei insgesamt nicht ausgelastetem Knoten.

### 3. Wie entstehen die drei Kubernetes-QoS-Klassen?

**Antwort:** Aus dem Verhältnis von Requests zu Limits — Guaranteed bei identischen Requests/Limits für alle Ressourcen, Burstable bei unterschiedlichen oder teilweise gesetzten Werten, BestEffort bei weder gesetzten Requests noch Limits.

### 4. Warum sollte ein OOM-Kill nicht pauschal als Anwendungsfehler behandelt werden?

**Antwort:** Ein OOM-Kill ist eine direkte, mechanische Konsequenz eines überschrittenen, konfigurierten Speicherlimits über die cgroups-Speichergrenze; die eigentliche Ursache kann ein zu niedrig angesetztes Limit statt eines echten Anwendungsfehlers sein.

### 5. Wie gehst du vor, wenn eine Anwendung wiederholt abrupt terminiert wird?

**Antwort:** Ich prüfe das konfigurierte Speicherlimit gegen den tatsächlichen Speicherverbrauch zum Terminierungszeitpunkt, um festzustellen, ob ein OOM-Kill aufgrund eines zu niedrigen Limits statt eines Anwendungsfehlers vorliegt.

### 6. Widersprüchliche Anforderung: Team will maximale Ressourceneffizienz durch niedrige Limits UND garantiert keine Throttling-/OOM-Ereignisse bei normaler Last — wie gehst du vor?

**Antwort:** Ich würde die tatsächliche Ressourcennutzung der Anwendung unter realistischer Last messen und die Limits basierend auf dieser Messung mit einem angemessenen Sicherheitspuffer konfigurieren, statt Limits willkürlich niedrig zum Zweck der Effizienz oder willkürlich hoch aus reiner Vorsicht zu setzen.

## Praktische Labs

~~~python
def determine_qos_class(cpu_request, cpu_limit, memory_request, memory_limit):
    if cpu_request is None and cpu_limit is None and memory_request is None and memory_limit is None:
        return "BestEffort"
    if cpu_request == cpu_limit and memory_request == memory_limit and None not in (cpu_request, cpu_limit, memory_request, memory_limit):
        return "Guaranteed"
    return "Burstable"

configs = [
    {"cpu_request": 1, "cpu_limit": 1, "memory_request": 512, "memory_limit": 512},  # Guaranteed
    {"cpu_request": 0.5, "cpu_limit": 2, "memory_request": 256, "memory_limit": 1024},  # Burstable
    {"cpu_request": None, "cpu_limit": None, "memory_request": None, "memory_limit": None},  # BestEffort
]

for i, config in enumerate(configs, 1):
    qos = determine_qos_class(**config)
    print(f"Pod {i}: {config} -> QoS class: {qos}")

print("\nEviction order under node resource pressure: BestEffort first, then Burstable, Guaranteed last.")
~~~

## Dependencies, Cross-References und Quellen

1. Kubernetes-Dokumentation: [Resource Management for Pods and Containers](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/), abgerufen 2026-09-17.
2. Kubernetes-Dokumentation: [Configure Quality of Service for Pods](https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/), abgerufen 2026-09-17.

Cgroups und Ressourcenbegrenzung sind kanonisch in [KB-0038](../02-linux-systems/08-cgroups-und-ressourcenbegrenzung.md) behandelt; Scheduling und Platzierungsregeln in [KB-0394](16-scheduling-und-platzierungsregeln.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Vertical Pod Autoscaling (VPA), das Requests/Limits automatisch basierend auf beobachtetem Ressourcenverbrauch anpasst | Adopting | Gegenüber manuell festgelegten, statischen Requests/Limits für dynamischere, präzisere Ressourcenzuweisung bevorzugen. |
| cgroups v2 mit verbesserter, einheitlicherer Ressourcensteuerung gegenüber cgroups v1 | Adopting | Gegenüber cgroups v1 bevorzugen, sobald die zugrunde liegende Node-Infrastruktur cgroups v2 vollständig unterstützt. |

Ein Team akzeptiert eine Ressourcenkonfiguration erst, wenn die resultierende QoS-Klasse nachweislich der tatsächlichen Anwendungskritikalität entspricht.
