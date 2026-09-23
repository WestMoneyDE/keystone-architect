---
{"id": "KB-0038", "title": "Cgroups und Ressourcenbegrenzung", "domain": "02", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["PLATFORM", "CLOUD", "GENAI", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0033", "concepts": ["Concurrency-Budget", "Threadpools", "Backpressure"], "needed_for": "understanding"}, {"id": "KB-0034", "concepts": ["RSS", "OOM", "Memory Pressure"], "needed_for": "understanding"}, {"id": "KB-0037", "concepts": ["Namespaces", "Containergrenzen", "Isolation"], "needed_for": "understanding"}], "related": ["KB-0031", "KB-0036", "KB-0039", "KB-0040", "KB-0550", "KB-0565", "KB-0580"], "applies": ["KB-0550", "KB-0565", "KB-0580"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein gelesenes, isoliertes Lab untersucht vorhandene Runtime-/cgroupinformationen ohne Limits zu ändern.", "rationale": "Ressourcenverträge werden erst in einer autorisierten Zielumgebung validiert."}, "ARCHITECT-TARGET": {"active": true, "scope": "Limits, Requests/Budgets, Admission, Queue, Headroom, OOM- und Throttlingverhalten werden gemeinsam designt.", "rationale": "Ein Containerlimit allein ist kein Kapazitätsmodell."}, "STAFF-TARGET": {"active": true, "scope": "Teams etablieren Workloadprofile, Sättigungsmetriken, Last-/Failuretests und sichere Defaultbudgets.", "rationale": "Cgroupereignisse werden als Frühwarnung statt als nachträglicher OOMbefund genutzt."}, "CHIEF-TARGET": {"active": true, "scope": "Plattformpolitik steuert Overcommit, Workloadklassen, Node-Dichte, Capacity Forecast, Kosten und Ausnahmegovernance.", "rationale": "Chief-Ebene schafft wiederholbare Ressourcenwirtschaft."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "cgroup-v2-Controllerinternals, PSI, IO scheduler, NUMA, CPU affinity und kernel-/nodeweite Tuningmaßnahmen sind Spezialistenfelder.", "rationale": "Zielrollen verstehen die Wirkung und eskalieren Spezialfälle."}}, "lab_validation": [{"lab_id": "KB-0038-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Geplantes read-only Sandboxlab", "evidence": "Metriken, Invarianten und negative Lastproben dokumentiert.", "limitations": "Keine Controller-, Limit-, Scheduler-, Container-, Cloud- oder Produktionsänderung ausgeführt."}]}
---
# Cgroups und Ressourcenbegrenzung

> **Ziel:** Dimensioniere Container und Dienste nach einem überprüfbaren Ressourcenvertrag. cgroups begrenzen und verteilen Ressourcen hierarchisch; sie ersetzen weder Anwendungslimits, noch Backpressure, noch eine fachliche Degradations- und OOM-Policy.

## Purpose, Definition und Scope

cgroup v2 organisiert Prozesse hierarchisch und verteilt Ressourcen kontrolliert. Controller für CPU, Memory, I/O und PIDs machen Verbrauch und Grenzen sichtbar. Im Unterschied zu Namespaces geht es nicht darum, was ein Prozess sieht, sondern was er verbrauchen darf. Scope: CPU, Speicher, I/O, Limits, Throttling, OOM, Hostknappheit und Containerdimensionierung.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Limit, Gewichtung, Throttling, Memory Pressure und OOM können getrennt erklärt werden. |
| HANDS-ON-TARGET | Read-only Beobachtung und sichere Lastfallplanung. |
| ARCHITECT-TARGET | Budgets verbinden Workload, Queue, Concurrency, SLO, Failure und Kosten. |
| STAFF/CHIEF | Standards verhindern unkontrolliertes Overcommit und versteckte Sättigung. |

## Mental Model: Grenze, Anspruch und tatsächlicher Engpass

```text
node capacity
  -> cgroup hierarchy / controller policy
    -> workload CPU, memory, IO, pids budget
      -> application admission, queues, pools, caches
        -> latency, error, throttle, OOM or controlled degradation
```

Ein CPUlimit kann eine Workload drosseln, obwohl Host-CPU frei erscheint. Ein Container-OOM kann eintreten, obwohl der Node noch RAM zeigt. Umgekehrt kann Node Pressure mehrere Workloads betreffen, obwohl kein einzelnes Limit überschritten wurde. Diagnose startet daher mit **welcher cgroup, welches Event, welche Zeit, welcher Workload**, nicht mit „Kubernetes ist langsam“.

## Prerequisites und Dependencies

| Abhängigkeit | Nutzen |
|---|---|
| [KB-0033 Threads](03-threads-und-parallelitaet.md) | Pools, Queue, CPU-Parallelität. |
| [KB-0034 Speicher](04-virtueller-speicher-und-paging.md) | RSS, Reclaim, OOM und Headroom. |
| [KB-0037 Namespaces](07-namespaces-und-isolation.md) | Sichtbarkeit versus Begrenzung. |
| KB-0036 Sockets | Connection-/FD-/Egressbudgets. |
| KB-0580 AI Inference | CPU/RAM/GPU-/Tokenbudget. |

## Core Concepts

### Hierarchie und Controller

cgroup v2 hat eine einheitliche Hierarchie. Prozesse gehören in genau eine cgroup; Kinder starten in der cgroup ihres Parents. Controller wirken top-down: Ein Child kann nur verteilen, was ihm sein Parent bereitstellt, und kann übergeordnete Restriktionen nicht aufheben. Das verhindert, dass Workloadteams Nodekapazität durch lokale Konfiguration „erzeugen“.

### CPU: Gewicht, Quote und Throttling

CPUgewicht beeinflusst Verteilung unter konkurrierenden Workloads; harte Quota begrenzt verfügbare CPUzeit. Throttling kann Durchsatz, Eventloop, GC, TLS und Tail-Latency verschlechtern, auch wenn die nominelle CPUauslastung niedrig wirkt. Mehr Threads erhöhen unter CPUquota oft nur Runnable-/Context-Switch-Druck. Die richtige Antwort kann Poolreduktion, Batchanpassung, Replicas, andere Workloadklasse oder mehr begründete Kapazität sein.

### Memory: Schutz, Druck, OOM

Memorycontrolleraccounting, protection und Grenzen wirken im Hierarchiekontext. Ein Memorybudget umfasst Heap, native Speicher, stacks, cache, buffers, queue, batch und headroom. Erreicht eine Workload ihre harte Grenze und kann nicht fortschreiten, entstehen Events und möglicherweise OOM; das ist kein Ersatz für Garbage Collection oder Leakerkennung. `memory.events` und Runtime-/Queue-/Revisionkontext sind Kernbeweise.

### I/O und PIDs

I/O-Kontrolle begrenzt oder gewichtet Blockdevicezugriff, bleibt jedoch stark abhängig von Storage-/Scheduler-/Runtimeumgebung. Ein generischer I/Owert wird nie blind kopiert. PIDs begrenzen Prozess-/Threaderstattung und verhindern fork-/threadbomben, müssen aber zu Server, Runtime, Sidecars und Debug-/Shutdownpfaden passen.

## Architecture und Data Flow: Ressourcenbewusster Service

```text
tenant admission -> bounded request/queue
 -> CPU pool + memory-bounded parser/cache
 -> dependency/IO limiter
 -> durable result
 -> metrics: throttle, pressure, event, queue age, outcome
```

Jeder Engpass hat ein Limit und jedes Limit einen sichtbaren Full Case. Beispiel AI Gateway: CPU für Parsing/Policy, Memory für Kontext/Buffer, External concurrency für Modelcalls, GPU-/Providerbudget, PIDs/Fds für Runtimes und I/O für Modelle/Logs. Containerlimits ohne Token-/Request-/Queuebudget können weiterhin OOM oder Kostenspitzen erzeugen.

## Protokolle, Standards und Tools

| Artefakt | Zweck |
|---|---|
| [cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html) | Hierarchie, Controller, Prozess-/Threadzuordnung, events |
| `memory.events` / cgroup files | cgroupspezifische Failure-/Pressureindikatoren |
| Runtime metrics | Heap/native, GC, pool, queue, allocation |
| Node/platform metrics | allocatable capacity, pressure, throttling, IO |
| Load/failure tests | Budgethypothese gegen echte Workload validieren |

## Konfiguration und Implementierung

```yaml
workload_class: inference-api
resources:
  cpu: measured_request_and_limit
  memory: baseline + peak_in_flight + cache + native + headroom
  pids: runtime + workers + sidecars + safety_margin
  io: platform-reviewed-if-needed
application:
  admission: bounded_per_tenant
  queue: bytes_and_items_bounded
  concurrency: dependency_specific
failure:
  pressure: shed_or_degrade
  oom: classify_stop_crashloop_reconcile
observability:
  cgroup: current_events_throttle
  service: queue_age_inflight_outcome
```

Die Werte stammen aus einem Profilbereich und Testdaten, nicht aus einem Copy-paste. Ressourcenrequest, Limit und Autoscalingpolicy werden als zusammenhängende Plattformsemantik in der jeweiligen Runtime nachgeschlagen.

## Scalability und Performance

Kapazität folgt dem Minimum der Engpässe. CPUquota kann Tail-Latency erhöhen, Memorylimit kann Cacheeffizienz senken, I/Olimit kann Queuealter erhöhen und PIDlimit kann Workerstarts verhindern. Daher wird bei Last mindestens gemessen: in-flight, queue items/bytes/age, CPU usage/throttle, memory current/events, allocation/GC, IO latency, FD/PIDs, dependency pending, error/outcome und Kosten pro erfolgreicher Arbeit.

## Reliability und Failure Modes

| Befund | Trennung | Reaktion |
|---|---|---|
| CPU throttling | Workloadquota versus Host-CPU | pools/replicas/budget prüfen |
| cgroup OOM | Workloadlimit versus Node Pressure | event, peak source, queue/cache/native, crashloop stoppen |
| Node pressure | mehrere Workloads/allocatable capacity | scheduling/capacity/platform escalation |
| I/O stall | cgroup/device/dependency | workload und storage path messen |
| PID limit | spawn/thread surge | lifecycle/pool/limit prüfen |
| Overcommit cascade | zu viele gleichzeitige Peaks | admission, class isolation, capacity forecast |

## Security, Governance und Compliance

Limits reduzieren DoS und Blast Radius, sind aber keine Autorisierung. Tenantquotas, Body-/Tokenlimits, egress policy und Workloadidentity ergänzen sie. Änderungen an Node-/Controller-/Schedulerpolicy sind privilegiert, auditierbar und mit Rollback. Ressourcendaten können Tenant-/Nutzungsinformationen enthalten; Retention und Zugriff werden geregelt.

## Observability und Troubleshooting

1. Scope: cgroup/Pod, Revision, Node, Workloadklasse, Zeit.
2. Event: throttle, memory event/OOM, pids or I/O symptom?
3. Ursache: request shape, queue, cache, native/heap, dependency, other workloads?
4. Safety: Admission reduzieren, teure Calls begrenzen, Crashloop stoppen.
5. Hypothese: isolierter Canary mit einer geänderten Variablen.
6. Recovery: Reconcile durable Wirkung, rollback, capacity/contract anpassen.

## Cost und FinOps

Limits beeinflussen Node Density und damit Compute-/Managed-Servicekosten. Zu niedrige Limits erzeugen restarts und Overhead; zu hohe Limits senken Packdichte und verstecken Leaks. Cache, GPU/Provider, I/O und retries werden pro erfolgreichem Ergebnis bewertet. Per-Tenantbudgets koppeln Kosten an Fairness.

## Trade-offs und Anti-Patterns

- cgroup gleich Securityboundary setzen.
- CPUlimit erhöhen ohne Queue-/pool-/dependencyanalyse.
- OOM nur mit Memorylimit erhöhen behandeln.
- I/Otuning ohne Storage-/Kernel-/Supportevidenz.
- PIDs nicht budgetieren.
- Overcommit ohne Peak-/Failuremodell.
- Ressourcenwerte ohne Revision/Lastprofil kopieren.

## Staff-, Principal- und Chief-Level Decisions

Staff baut Workloadprofile, Dashboards, Templatewerte und Failuretests. Principal trennt Klassen mit unterschiedlichen SLO/Peak-/Trustprofilen und verbindet App-/Platformbudget. Chief setzt Overcommit-/Capacity-/Cost-/Exceptionpolicy, investiert in sichere Telemetrie und verlangt Nachweise für Node-/Kernel-Spezialtuning.

## Production Checklist

- [ ] CPU, memory, PIDs und bei Bedarf I/O sind begründet und gemessen.
- [ ] Admission, queue bytes/items, concurrency, cache und batch korrespondieren zum Budget.
- [ ] cgroup events/throttle und Serviceoutcomes sind korrelierbar.
- [ ] OOM, throttle, disk-/dependencypressure und nodepressure sind getrennt diagnostizierbar.
- [ ] Crashloop-/reconciliation-/degradationpolicy existiert.
- [ ] Änderungen haben Owner, Canary, Rollback und Rechecktrigger.

## Interviewfragen mit Modellantworten

### Was unterscheidet Namespace und cgroup?
Namespace isoliert Sicht und Namensraum; cgroup organisiert und begrenzt Ressourcen. Beides kann im Container vorkommen, beantwortet aber unterschiedliche Risiken.

### Warum kann CPUthrottling Latenz verschlechtern?
Die Workload erhält nicht kontinuierlich CPUzeit; Runnable Arbeit, GC oder Eventloop warten. Mehr Threads kann die Quota nicht vergrößern.

### Was beweist ein cgroup OOM?
Dass diese Ressourcen-/Fehlergrenze nicht fortschreiten konnte. Es beweist nicht allein, ob Leak, Cache, Batch, native Speicher, Queue oder Limitfehler die Ursache ist.

### Wie dimensionierst du Memory?
Baseline plus gemessene Peak-In-Flightarbeit, Cache, native/stacks/buffers, Queue/Batches und Headroom; dann unter Last/Fault testen.

### Wann passt ein PIDs Limit?
Immer als Schutz vor unbounded process/thread creation, aber hoch genug für Runtime, Workers, Sidecars und kontrollierten Shutdown. Der Wert wird getestet.

## Praktisches Lab: Read-only Ressourcenvertrag

> `reviewed_only`; keine Controller-/Limitänderung.

1. Lies nur zulässige Runtime-/cgroupinformationen eines lokalen Sandboxworkloads.
2. Erzeuge synthetische, begrenzte Last und korreliere in-flight, Queue und Prozessmetriken.
3. Negative Probe: simuliere volle Applicationqueue; prüfe reject/defer statt unbounded Memory.
4. Dokumentiere, welche Werte die lokale Runtime zeigt und welche Zielplattformvalidierung noch fehlt.
5. Beende Testprozesse und entferne Testdaten.

## Dependencies und Cross-References

- [KB-0033 Threads](03-threads-und-parallelitaet.md)
- [KB-0034 Virtueller Speicher](04-virtueller-speicher-und-paging.md)
- [KB-0037 Namespaces](07-namespaces-und-isolation.md)
- KB-0550 Platform Engineering
- KB-0565 Cloud Architecture
- KB-0580 AI Infrastructure

## Quellen und Aktualitätsnotizen

| Quelle | Nutzung | Stand |
|---|---|---|
| Dateikatalog | Scope. | 2026-09-14 |
| [cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html) | Hierarchie, Prozesse/Threads, Controller und Events. | Abgerufen 2026-09-15 |
| [Linux MM Concepts](https://docs.kernel.org/admin-guide/mm/concepts.html) | Reclaim, Pressure, OOM. | Abgerufen 2026-09-15 |
| [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html) | Thread-/Kernelcontext. | Linux man-pages 6.19 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — cgroup-v2-Events und Pressure-Signale erlauben zunehmend frühere Degradation statt Restart nach OOM.** **Reifegrad: Established in Linux-/Containerplattformen.** Ein Pilot korreliert Events mit Queuealter und fachlichem Ergebnis.

**Stand 2026-09-15 — AI-Workloads brauchen mehrdimensionale Budgets für CPU, Host-RAM, Accelerator, Tokens und Egress.** **Reifegrad: Adopting.** Ein Pilot setzt separate Grenzen pro Engpass statt nur ein Podmemorylimit.

**Stand 2026-09-15 — Workloadklassen mit sicheren Ressourcen-Defaults verbessern Packdichte und verringern Ausnahmebetrieb.** **Reifegrad: Established bis Adopting.** Policies werden mit gemessenen Profilen revidiert, nicht als unveränderliche Tiers behandelt.

