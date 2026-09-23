---
{"id": "KB-0042", "title": "CPU-Scheduling und Lastverteilung", "domain": "02", "sequence": 12, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["PLATFORM", "CLOUD", "GENAI", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0033", "concepts": ["Threads", "Parallelität", "Context Switch", "Pools"], "needed_for": "understanding"}, {"id": "KB-0038", "concepts": ["cgroup CPU", "Throttling", "Resource Budgets"], "needed_for": "understanding"}], "related": ["KB-0031", "KB-0034", "KB-0036", "KB-0043", "KB-0550", "KB-0565", "KB-0580"], "applies": ["KB-0550", "KB-0565", "KB-0580"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein isoliertes Lab erfasst eigene CPU-/Warte-/Poolmetriken unter begrenzter synthetischer Last.", "rationale": "Keine Affinität, Priorität, cgroup, Kernel- oder Hostkonfiguration wird verändert."}, "ARCHITECT-TARGET": {"active": true, "scope": "Workloadklassen, CPUbudget, concurrency, latency SLO, batch/queue und noisy-neighbor-Risiko werden gemeinsam geplant.", "rationale": "CPUauslastung allein ist kein Kapazitätsmodell."}, "STAFF-TARGET": {"active": true, "scope": "Teams nutzen Profile, Runqueue-/Throttlingindikatoren, Lasttests und sichere Pooldefaults.", "rationale": "Mehr Threads wird nicht als Standardantwort auf Latenz verwendet."}, "CHIEF-TARGET": {"active": true, "scope": "Platformpolicy steuert Node-Dichte, Overcommit, Prioritäten, Isolation, Cost und Spezialtuningausnahmen.", "rationale": "Chief-Ebene setzt Betriebsmodell statt pro Dienst Schedulerwerte."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "CFS-/Schedulerinternals, realtime/deadline scheduling, NUMA, IRQ affinity, eBPF scheduler tracing und bare-metal tuning sind Spezialistenfelder.", "rationale": "Zielrollen erkennen Beleg-/Eskalationsbedarf."}}, "lab_validation": [{"lab_id": "KB-0042-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Geplantes isoliertes Lastlab", "evidence": "Messhypothesen, negative Proben und Cleanup beschrieben.", "limitations": "Keine Schedulerklasse, Priorität, Affinität, cgroup, Kernel, Cloud oder Produktion verändert."}]}
---
# CPU-Scheduling und Lastverteilung

> **Ziel:** Unterscheide CPU-Arbeit, runnable Wartezeit, I/O-Wartezeit, cgroup-Throttling und Nachbarinterferenz. Erhöhe weder Threadzahl noch CPUlimit, bevor die Sättigungsquelle anhand korrelierter Messung bekannt ist.

## Purpose, Definition und Scope

Linux schedult ausführbare Threads auf CPUs nach Policy, Priorität, Affinität und verfügbarem Kontext. Eine hohe Anfrage-Latenz kann aus tatsächlicher CPUarbeit, einer Run Queue, cgroupthrottling, Locks, I/O, Garbage Collection oder Downstreamwartezeit entstehen. Scope: Run Queues, Prioritäten, Affinität, Context Switches, CPU versus Wartezeit und Noisy Neighbors.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Runnable, running, waiting, throttled und interrupted werden unterschieden. |
| HANDS-ON-TARGET | Lokales Messlab ohne Scheduleränderung. |
| ARCHITECT-TARGET | CPU-/SLO-/Concurrency-/Queue-/Resourcecontract. |
| STAFF/CHIEF | Messbasierte Defaults und Ausnahmegovernance für Tuning. |

## Mental Model: CPUzeit ist nur ein Teil der Anfragezeit

```text
request latency =
 queue wait + runnable wait + CPU execution + lock wait
 + I/O/dependency wait + runtime pause + throttle delay
```

Eine Threadgruppe kann CPU niedrig auslasten und trotzdem hohe Latenz haben, weil sie auf I/O wartet. Sie kann CPU hoch auslasten, aber produktiv rechnen. Sie kann regelmäßig nicht laufen, weil CPUquota sie drosselt. Ohne Aufteilung führt „CPU hoch“ oder „CPU niedrig“ zu falschen Entscheidungen.

## Prerequisites und Dependencies

| Abhängigkeit | Nutzen |
|---|---|
| [KB-0033 Threads](03-threads-und-parallelitaet.md) | Poolgröße, Context Switch, Contention. |
| [KB-0038 cgroups](08-cgroups-und-ressourcenbegrenzung.md) | CPUquota/weight/throttling. |
| KB-0034 Speicher | GC/reclaim als Latenzursache. |
| KB-0036 Sockets | I/O-/Connectionwartezeit. |
| KB-0580 AI Inference | CPU-/GPU-/batch interplay. |

## Core Concepts

### Run Queue und Zustände

Ein Thread kann laufen, ausführbar sein und auf CPU warten, auf Lock/I/O warten, schlafen oder durch cgroup-/Policygrenzen verzögert werden. Run Queue Pressure bedeutet nicht automatisch, dass der Prozess „zu wenig CPU“ braucht: Prüfe konkurrierende Workloads, CPUquota, Poolgröße, Hot Keys, Interrupt-/Kernelarbeit und Workloadshape.

### Priorität, Policy und Fairness

Normale Schedulerpolicy zielt auf faire Verteilung; Nice-/Prioritäts- und Spezialpolicies verändern Anspruch/Verhalten. Realtime-/Deadline-Policy kann andere Arbeit stören und wird nur mit Spezialistenreview, klarer Deadline, Failuremodell und Hostownership eingesetzt. Anwendungscode soll keine Schedulerklasse als Latenzshortcut setzen.

### Affinität und Context Switches

CPUaffinität ist pro Thread möglich; tatsächliche CPUwahl wird zusätzlich von online CPUs und cpuset/cgroupbeschränkungen beeinflusst. Sie kann Cachemigration reduzieren, senkt aber Flexibilität und kann Hotspots erzeugen. Context Switches sind erwartbar; auffällig werden sie bei unbounded Threads, Spin, Lockcontention, Überpartitionierung oder CPUpressure. Erst Profile/Trace, dann Tuning.

### Noisy Neighbor

Noisy Neighbor ist beobachtbare Interferenz durch andere Workloads auf gemeinsamer Kapazität: CPUtime, cache, memory pressure, I/O, network interrupt oder quota. Die Diagnose braucht Workload-/Node-/cgroup-/Zeitkorrelation. Die Lösung kann Ressourcenklasse, Isolation, Node Pool, limit/request, admission, Workloadreduktion oder Schedulingpolicy sein; nicht jedes Problem wird mit mehr Replicas gelöst.

## Architecture und Data Flow: CPU-bewusster Service

```text
admission -> bounded queue -> CPU pool
 -> dependency/IO pool -> commit
 metrics: queue age, runnable/throttle indication,
 CPU execution, lock wait, dependency wait, outcome
```

CPUlastige Parsing-, Ranking-, Encryption- oder Rerankingarbeit wird von I/O/LLM-Wartearbeit getrennt. Ein AI Gateway beschränkt CPUtasks, Requests, Token-/Modelcalls und Streambuffer separat. Damit kann eine CPUspitze nicht unbemerkt jede Netzwerk-/Modelverbindung blockieren.

## Protokolle, Standards und Tools

| Quelle/Werkzeug | Verwendung |
|---|---|
| `sched(7)` | Linuxschedulingschema, Policies und Prioritäten |
| `sched_setaffinity(2)` | per-thread CPUaffinität und cpusetgrenzen |
| cgroup v2 | CPUbudget/Hierarchie und Workloadgrenze |
| Runtime profiler | CPU versus wall time, locks, GC, task states |
| Trace/metrics | queue age, throttle, request phase, node correlation |

## Konfiguration und Implementierung

```yaml
cpu_contract:
  workload_class: cpu_bound_rerank
  pool: bounded_by_measurement
  request_admission: bounded
  cgroup_cpu_budget: platform_owned
  queue: items_and_bytes_bounded
  latency_slo: explicit
  overload: defer_or_reject
  observability: cpu_wall_queue_throttle_lock_dependency
  affinity_or_priority: prohibited_without_exception
```

Werte sind Profilhypothesen. Ändere nur eine Variable pro Canary und überprüfe p50/p95/p99, Fehler, Queuealter, CPU/Throttle, Kosten und Nachbarwirkung.

## Scalability und Performance

CPUparallelität skaliert bis zu verfügbaren Kernen und seriellen/contended Abschnitten. Mehr Workers als effektive CPU kann bei CPUbound Arbeit Queueing, Cacheverlust und Context Switches steigern. Bei I/Obound Arbeit kann höhere Nebenläufigkeit sinnvoll sein, solange Dependencylimits und Memorybuffer geschützt sind. Amdahl ist eine Denkgrenze, keine Produktionsformel.

## Reliability und Failure Modes

| Symptom | Hypothesen | Antwort |
|---|---|---|
| p99 hoch, CPU niedrig | I/O/lock/queue/throttle | Phasenzeit und cgroup prüfen |
| CPU hoch, Throughput flach | spin, contention, GC, quota | profiler, queue and lock analysis |
| sporadische Latenz | noisy neighbor/pressure | node/cgroup time correlation |
| CPUthrottle | quota versus workload | pool/budget/capacity prüfen |
| Hot core | affinity/hot key/IRQ | topology evidence, specialist if needed |
| context switches hoch | too many threads/locks | reduce pools, ownership design |

## Security, Governance und Compliance

CPUlimits und admission sind DoS-/Kostenkontrollen. Priorität/Affinität/Scheduleränderung ist privilegiert und auditierbar. Traces/Profile können sensitive Inputs enthalten; Zugriff, Sampling und Retention sind geregelt. Tenantfairness verhindert, dass eine Anfrageklasse andere verdrängt.

## Observability und Troubleshooting

Korrigiere nicht nach einer Zahl. Prüfe Revision, Workloadklasse, cgroup/Node, active/runnable/pending, queue age, CPU/wall duration, throttle, locks, GC/reclaim, dependencywait und outcomes. Bei Incident: Last begrenzen → workload trennen → Hypothese über Profil validieren → Canary → Rollback/Policyupdate.

## Cost und FinOps

CPUoverprovisioning senkt Packdichte; unterprovisioning erzeugt Throttle, P99, Retries und Zusatzreplicas. Kosten pro erfolgreicher Arbeit verbinden CPUseconds, queue age, model/tokenkosten und Datenqualität. Noisy-neighbor-Isolation wird gegen Node-/Poolkosten gerechnet.

## Trade-offs und Anti-Patterns

- CPUauslastung mit Ausführungszeit verwechseln.
- Threadpool bei CPUpressure blind erhöhen.
- `nice`/realtime/Affinität ohne Beweis setzen.
- nodeweite Tuningwerte aus einem Benchmark kopieren.
- CPUlimit ohne Queue/Admission.
- Noisy Neighbor ohne Zeit-/cgroupkorrelation behaupten.
- GPUengpass mit CPUthreads behandeln.

## Staff-, Principal- und Chief-Level Decisions

Staff liefert Profiler-/Dashboard-/Loadteststandards und pool defaults. Principal trennt Workloadklassen und koppelt Appprofile an cgroup/node/Autoscaling. Chief definiert Dichte-/Overcommit-/priority-/isolationpolicy sowie Spezialtuningreview und Costmodelle.

## Production Checklist

- [ ] CPU versus wait/throttle/lock/dependency phasenmessbar.
- [ ] CPUbound und I/O-/Modelarbeit getrennt begrenzt.
- [ ] Queue, pool, cgroupbudget und autoscaling konsistent.
- [ ] Noisy-neighbor- und nodecontext vorhanden.
- [ ] Affinität/priorität nur mit Ausnahmeowner/test/rollback.
- [ ] Last-/failure-/costtests über p99 und Ergebnisqualität.

## Interviewfragen mit Modellantworten

### Warum bedeutet CPU 30% nicht „genug Kapazität“?
Es kann I/O, Lock, Queue, quota, one hot core oder ungünstige Verteilung geben. Ich brauche Phasenzeit und Workload-/cgroupkontext.

### Wann ist Affinität sinnvoll?
Nach klarer Profilhypothese, stabiler Topologie, Supportowner und gemessenem Vorteil. Sie ist nicht Standard für Services.

### Wie erkennst du CPUthrottling?
Durch cgroup-/runtime-/nodekorrelierte Messung, nicht nur durch Prozesscpu. Dann prüfe Workload, pool, quota und Capacity.

### Was ist ein Noisy Neighbor?
Messbare Ressourceninterferenz anderer Workloads. Die Behauptung benötigt Zeit-, Node-, cgroup- und Workloadbeweis.

## Praktisches Lab: CPU versus Wartezeit

> `reviewed_only`; keine Scheduling-/Hoständerung.

1. Erzeuge begrenzte CPUarbeit und getrennt begrenzte künstliche I/Owartearbeit.
2. Erfasse wall time, CPUzeit, queue age und active tasks.
3. Negative Probe: erhöhe Worker über das lokale Budget und beobachte Context-/Queue-/P99-Risiko.
4. Beende alle Tasks; dokumentiere, dass Zielhost/cgroup/Node noch nicht validiert sind.

## Dependencies und Cross-References

- [KB-0033 Threads](03-threads-und-parallelitaet.md)
- [KB-0038 cgroups](08-cgroups-und-ressourcenbegrenzung.md)
- KB-0034 Speicher
- KB-0580 AI Inference
- KB-0565 Cloud Architecture

## Quellen und Aktualitätsnotizen

| Quelle | Nutzung | Stand |
|---|---|---|
| Dateikatalog | Scope. | 2026-09-14 |
| [sched_setaffinity(2)](https://man7.org/linux/man-pages/man2/sched_setaffinity.2.html) | Affinität, cpusetgrenzen. | Linux man-pages 6.19 |
| [sched_setscheduler(2)](https://man7.org/linux/man-pages/man2/sched_setscheduler.2.html) | per-thread scheduling attributes. | Linux man-pages 6.19 |
| [cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html) | Ressourcenhierarchie. | 2026-09-15 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — Scheduler-/eBPF-Observability erlaubt präzisere Unterscheidung von CPUzeit, Runqueue und Blockierung.** **Reifegrad: Established im SRE-Spezialbetrieb.** Ein Pilot folgt einer klaren Latenzhypothese und schützt Diagnosedaten.

**Stand 2026-09-15 — Heterogene CPU-/Acceleratornodes machen workload-aware Placement wichtiger.** **Reifegrad: Adopting.** Ein Pilot trennt CPU-, I/O- und Acceleratorklassen anhand messbarer Profile.

**Stand 2026-09-15 — AI-Reranking und Agentorchestrierung verlangen adaptive, aber budgetierte Concurrency.** **Reifegrad: Adopting.** Ein Pilot steuert Queue und Admission nach SLO, Cost und Modelgatewaykapazität.

