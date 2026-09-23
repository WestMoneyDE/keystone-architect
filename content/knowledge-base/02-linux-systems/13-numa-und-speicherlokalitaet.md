---
{"id": "KB-0043", "title": "NUMA und Speicherlokalität", "domain": "02", "sequence": 13, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["PLATFORM", "CLOUD", "GENAI", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0034", "concepts": ["Virtueller Speicher", "Page Frames", "Working Set"], "needed_for": "understanding"}, {"id": "KB-0042", "concepts": ["CPU Scheduling", "Affinität", "Noisy Neighbor"], "needed_for": "understanding"}], "related": ["KB-0033", "KB-0038", "KB-0044", "KB-0580", "KB-0590", "KB-0720"], "applies": ["KB-0580", "KB-0590", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein read-only Lab dokumentiert Node-/CPU-/Memorytopologie und bewertet nur synthetische Profile.", "rationale": "Keine Affinität, numactl, Scheduler-, GPU- oder Hostkonfiguration wird geändert."}, "ARCHITECT-TARGET": {"active": true, "scope": "Datenintensive Workloads berücksichtigen Working Set, CPU/Memory/Device-Nähe, Nodeklasse, Isolation und fallbacks.", "rationale": "Topologie wird erst bei belegtem Engpass zur Designentscheidung."}, "STAFF-TARGET": {"active": true, "scope": "Teams erfassen Topologie in Performanceinvestigationen und vermeiden ungetestete Pinningrezepte.", "rationale": "Messung trennt NUMA von lock-/I/O-/quota-Problemen."}, "CHIEF-TARGET": {"active": true, "scope": "Plattformentscheidungen für GPU-/High-memory-Nodeklassen, Scheduling, Cost und Spezialistenownership werden zentral geregelt.", "rationale": "Topologieoptimierung betrifft Hardwarestrategie und Betriebsmodell."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "NUMA memory policy, IRQ affinity, PCIe/NVLink topology, multi-GPU collectives, kernel allocation and eBPF profiling sind Spezialistenfelder.", "rationale": "Die Zielrollen bewerten Evidenz und Risiko, ohne Tuning zu behaupten."}}, "lab_validation": [{"lab_id": "KB-0043-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Geplantes read-only Topologielab", "evidence": "Messhypothesen, negative Proben und Cleanup beschrieben.", "limitations": "Keine CPU-/Memory-/GPU-Pinning- oder Hoständerung ausgeführt."}]}
---
# NUMA und Speicherlokalität

> **Ziel:** Entscheide Topologie erst nach Messung. NUMA kann die Latenz datenintensiver CPU-/GPU-Workloads verändern, ist aber selten die erste Erklärung für schlechte P99. Working Set, Queue, cgroup, Lock, I/O und Dependencygrenzen werden zuvor ausgeschlossen.

## Purpose, Definition und Scope

NUMA bedeutet Non-Uniform Memory Access: Auf Mehrprozessorsystemen liegen Memory Banks in Knoten mit unterschiedlicher Zugriffszeit abhängig von der CPU. Linux dokumentiert, dass jeder Node eigene Zonen, freie/benutzte Seitenlisten und Statistik hat. Scope: NUMA-Knoten, lokale/entfernte Memoryzugriffe, CPU-Pinning, Cross-Socket-Traffic und GPU-Nähe für datenintensive Workloads.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | CPU, Memory, Device und Interconnectnähe können als Constraintmodell erklärt werden. |
| HANDS-ON-TARGET | Nur Topologiebeobachtung und synthetische Profilhypothese. |
| ARCHITECT-TARGET | Placement folgt Daten-/Device-/SLO-/Costprofil. |
| STAFF/CHIEF | Spezialtuning wird evidenzbasiert und plattformweit gesteuert. |

## Mental Model: Daten bewegen kostet Zeit und Kapazität

```text
CPU core -> local NUMA memory node -> PCIe/NIC/GPU attachment
      \-> remote NUMA memory node -> inter-socket interconnect
```

Ein Thread auf CPU A kann lokalen Memory von Node A schneller erreichen als Memory auf Node B. Eine GPU/NIC kann topologisch näher an bestimmten CPUs/Memory liegen. Die Konsequenz hängt von Workload, Pageplacement, Cache, Kernel, VM/Cloudabstraktion und tatsächlicher Hardware ab.

## Prerequisites und Dependencies

| Abhängigkeit | Nutzen |
|---|---|
| [KB-0034 Speicher](04-virtueller-speicher-und-paging.md) | Pages, allocation, working set. |
| [KB-0042 CPU Scheduling](12-cpu-scheduling-und-lastverteilung.md) | affinity, queue, neighbor load. |
| KB-0038 cgroups | effective CPU/memory budget. |
| KB-0580 AI Inference | GPU/device placement. |

## Core Concepts

### Nodes, lokale und entfernte Zugriffe

Ein NUMA Node enthält Memory-/CPUzuordnung. Linux baut pro Node eigenes Memory Management auf. Lokaler Zugriff ist nicht automatisch schnell genug oder remote automatisch schlecht: Größe, Zugriffsmuster, Cache, Bandbreite, Interconnect, pressure und parallelism zählen. Eine VM kann die physische Topologie verschleiern oder eine virtuelle darstellen. Deshalb ist „Socketanzahl“ allein keine Placementpolicy.

### First Touch und Memoryplacement

Seiten werden häufig dort physisch allokiert, wo sie erstmals genutzt werden, abhängig von Policy und System. Wenn ein Initialisierungsthread auf einem anderen Node arbeitet als spätere Worker, kann das Working Set ungünstig verteilt werden. Das ist eine Hypothese, die mit Topologie-/Profilbeleg getestet wird, nicht ein Anlass für pauschales Pinning.

### CPU Pinning, cpuset und Migration

Affinität kann Threadmigration und Cacheverlust reduzieren. Sie kann auch Lastverteilung verhindern, Hot CPUs erzeugen und unter cgroup/cpuset/Autoscaling fragil werden. CPU Pinning, Memory Policies und Device Placement werden als zusammenhängende Ausnahme behandelt: Owner, Hardwareklasse, Benchmark, Tail-Latency, Failure/rollback und Supportmatrix.

### GPU-/NIC-Nähe

Für Inference können Modellgewichte, KV Cache, CPUpre-/post-processing, GPU, NIC und Storage Datenpfade bilden. PCIe/NVLink/Interconnecttopologie beeinflusst mögliche Datenbewegung. Ein „GPUhat freien Speicher“-Signal genügt nicht für Placement: Modellgröße, active sequences, CPU/host RAM, batch, locality, collective communication und tenantfairness müssen dazugehören.

## Architecture und Data Flow: High-memory Inference Node

```text
request -> CPU parse/tokenize -> host-memory buffers
 -> device-near transfer -> GPU inference/KV cache
 -> CPU postprocess/stream -> network
```

Default: portable Scheduler-/Runtimepfad mit Budgets und Observability. Escalate: Wenn reproduzierbarer Workload nach CPU/memory/GPU isolation noch remote memory-/interconnect-bound ist, prüft ein Spezialistenteam Nodeclass, Placement oder partitioning. Eine lokale Optimierung darf nicht die Schedulerfähigkeit und Failoverfähigkeit zerstören.

## Protokolle, Standards und Tools

| Quelle/Werkzeug | Nutzen |
|---|---|
| Linux MM Concepts | NUMA nodes and per-node MM context |
| `numa(7)`/`numactl` in autorisierter Umgebung | topology/policy inspection |
| `sched_setaffinity(2)` | per-thread CPU affinity |
| cgroup/cpuset | effective CPU availability |
| GPU vendor/runtime tooling | device topology; versionspecific |
| Profiling/trace | remote/local access hypothesis, not guesswork |

## Konfiguration und Implementierung

```yaml
placement_contract:
  workload: large-model-inference
  node_class: topology-declared
  default: scheduler-managed
  exception: pinning_only_after_profile
  evidence: p99_throughput_cpu_memory_device_metrics
  fallback: portable_replica_or_degraded_route
  owner: platform-performance
```

Kein Affinitätswert, `numactl`-Befehl oder GPUbinding gehört ungeprüft in eine allgemeine Deploymentvorlage. Cloud-/Kubernetes-/Runtimeversion und Deviceplugin bestimmen die konkrete Semantik.

## Scalability und Performance

Hohe CPUauslastung kann lokale Arbeit, remote memory, GPUwaiting, locks oder I/O verdecken. Miss workload p50/p95/p99, CPU-/walltime, memory bandwidth/pressure soweit zulässig, cgroup throttle, GC/allocation, active sequences/batch, transfer time, GPU utilisation, queue age and cost. Ein Benchmark ist nur aussagekräftig bei gleicher Hardware, Datenform, Batch, Model, Runtime und Failureprofile.

## Reliability und Failure Modes

| Problem | Ursache | Gegenmaßnahme |
|---|---|---|
| schlechter P99 | remote memory oder andere Wartezeit | profile phases before pinning |
| Hot CPU | pinning/hot key | relax placement or repartition |
| GPU idle | CPU/transfer/queue bottleneck | end-to-end budget |
| host OOM | buffers/first-touch/overcommit | memory contract and isolation |
| fragile rollout | topology-specific config | fallback class and rollback |
| neighbor interference | shared memory/IO/cache | evidence, class isolation |

## Security, Governance und Compliance

Topologie-/Deviceinformationen, profiler und debugzugriff sind Betriebsdaten mit Berechtigungsbedarf. Devicezugriff, GPUsharing, tenant placement und Memorydump folgen Least Privilege, Redaction und auditierter Ausnahme. Pinning darf keine Sicherheits-/Availabilitygrenze umgehen.

## Observability und Troubleshooting

1. Workloadrevision, node class, topology and effective cpuset identify.
2. CPU/wall/queue/throttle/GC/IO/GPU phases correlate.
3. Test locality hypothesis with same data/model/batch.
4. Compare portable default versus bounded exception.
5. Keep rollback/fallback and document economics.

## Cost und FinOps

High-memory/GPU nodes and topology-aware reservations cost more and may reduce scheduling flexibility. Optimize cost per successful inference with latency and availability, not a microbenchmark. Remote-memory reduction is valuable only when it beats cheaper choices such as smaller batch, better cache, model routing or workload partitioning.

## Trade-offs und Anti-Patterns

- NUMA als erste Erklärung jeder Latenz.
- CPU pinning ohne cgroup/host topology/rollback.
- GPU locality ohne host memory/transfer/batch analysis.
- microbenchmark auf anderer Hardware als Produktionsentscheidung.
- static binding ohne failover.
- topology optimization als Ersatz für queue/backpressure.

## Staff-, Principal- und Chief-Level Decisions

Staff reproduziert Messung und dokumentiert Profilgrenzen. Principal definiert Nodeclasses, data/device placement and portable fallbacks. Chief entscheidet Hardware-/acceleratorportfolio, scheduling-/isolationpolicy and specialist ownership.

## Production Checklist

- [ ] Workloadprofil und effective CPU/memory/device topology erfasst.
- [ ] Queue, cgroup, memory, IO, GPU and dependency bottlenecks geprüft.
- [ ] Pinning only with evidence, owner, canary, rollback and fallback.
- [ ] Nodeclass/Scheduler/Device policy versioned and auditable.
- [ ] Cost per outcome compared to portable alternative.

## Interviewfragen mit Modellantworten

### Was ist NUMA?
Memory ist in Knoten organisiert; Zugriffszeit kann von CPU-/Memory-Nähe abhängen. Das wird erst mit Workloadprofil zur Optimierungsentscheidung.

### Warum ist Pinning riskant?
Es kann Cache-/Migrationvorteile liefern, aber Flexibilität, balancing, failover and node utilisation verschlechtern. Cgroup/cpuset can constrain it further.

### Wie bewertet man GPU-Nähe?
End-to-end: CPU preparation, host memory, transfer, GPU memory/KV cache, network, batch, cost and fallback. Ein einzelner topology fact isn't sufficient.

### Was prüfst du vor NUMA-Tuning?
Queue, cgroup throttle, CPU/wall profile, GC/memory pressure, locks, I/O and dependency latency.

## Praktisches Lab: Read-only Topologiehypothese

> `reviewed_only`; keine Pinning-/Hoständerung.

1. Erfasse in einer Sandbox die erlaubte CPU-/Memory-/Deviceansicht.
2. Führe begrenzte synthetische CPU-/memoryintensive Arbeit in identischer Konfiguration aus.
3. Dokumentiere p95, CPU/wall, queue and allocation; keine Schlussfolgerung ohne Vergleich.
4. Probiere keine Affinitäts-/NUMA-/GPUänderung; beende Prozesse und lösche Daten.

## Dependencies und Cross-References

- [KB-0034 Speicher](04-virtueller-speicher-und-paging.md)
- [KB-0042 CPU Scheduling](12-cpu-scheduling-und-lastverteilung.md)
- KB-0038 cgroups
- KB-0580 AI Infrastructure, GPU und Inference
- KB-0590 GPU Scheduling und Capacity

## Quellen und Aktualitätsnotizen

| Quelle | Nutzung | Stand |
|---|---|---|
| Dateikatalog | Scope. | 2026-09-14 |
| [Linux MM Concepts](https://docs.kernel.org/admin-guide/mm/concepts.html) | NUMA nodes/Memory Management. | 2026-09-15 |
| [sched_setaffinity(2)](https://man7.org/linux/man-pages/man2/sched_setaffinity.2.html) | Affinity/cpuset constraints. | Linux man-pages 6.19 |
| [cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html) | CPU/cpuset resource context. | 2026-09-15 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — Heterogene CPU/GPU-/High-memory-Nodeklassen machen topology-aware scheduling wertvoller, aber nur für nachweislich datenbewegungsgebundene Workloads.** **Reifegrad: Adopting.** Ein Pilot vergleicht portable und topology-aware Platzierung mit gleicher Last.

**Stand 2026-09-15 — Multi-GPU-Inference verstärkt die Bedeutung von Interconnect, KV Cache und Collective-Overhead.** **Reifegrad: Established bis Adopting je Runtime.** Ein Pilot betrachtet P99, throughput, failure and cost together.

**Stand 2026-09-15 — Cgroup-/Device-/Schedulertelemetrie kann lokale Placemententscheidungen sicherer machen.** **Reifegrad: Adopting.** Sie ersetzt keine Plattformowner- und Datenschutzgovernance.

