---
{"id": "KB-0018", "title": "System Architect als Zielrolle", "domain": "01", "sequence": 8, "document_type": "role", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0002", "concepts": ["Rollen-Kompetenz-Matrix", "Tiefenstufen", "Nachweisarten"], "needed_for": "understanding"}, {"id": "KB-0004", "concepts": ["Evidenzgrenzen", "zulässige Aussagen", "Zielkompetenzen"], "needed_for": "understanding"}, {"id": "KB-0005", "concepts": ["Kompetenzcanvas", "Entscheidungsreichweite", "Wirkungskette"], "needed_for": "understanding"}, {"id": "KB-0006", "concepts": ["Hands-on-Tiefe", "Architekturnachweis", "Spezialistenübergabe"], "needed_for": "understanding"}, {"id": "KB-0009", "concepts": ["Labstrategie", "Gegenprobe", "Evidenzgrenze"], "needed_for": "lab"}], "related": ["KB-0013", "KB-0016", "KB-0017", "KB-0019", "KB-0020", "KB-0031", "KB-0434", "KB-0572", "KB-0720"], "applies": ["KB-0031", "KB-0434", "KB-0572", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein lokales oder freigegebenes Testsystem wird als Messfall dokumentiert: Hardwaretopologie, OS-/cgroup-Ressourcen, Netzwerkpfad, Prozess-/Containerlast, Speicher-/NUMA-Annahme, Telemetrie, Fehlerprobe und Cleanup.", "rationale": "Systementscheidungen sind erst mit inventarisierter Umgebung, Messwerten und klarer Abhängigkeit über die Schichten nachvollziehbar."}, "ARCHITECT-TARGET": {"active": true, "scope": "Die Rolle kann Hardware-, OS-, Netzwerk-, Runtime-, Daten- und Betriebseigenschaften zu Performance-, Zuverlässigkeits- und Sicherheitszielen verbinden.", "rationale": "Sie verantwortet die Gesamtwirkung und Systemgrenze statt isolierte Komponentenentscheidungen."}, "STAFF-TARGET": {"active": true, "scope": "Sie etabliert Performancebudgets, Referenzsysteme, Messprotokolle, Capacity-/Failure-Reviews und klare Spezialistenübergaben für mehrere Teams.", "rationale": "Staff-Wirkung liegt in reproduzierbarer systemischer Diagnose und weniger produktionsnahen Überraschungen."}, "CHIEF-TARGET": {"active": true, "scope": "Sie steuert Build/Buy, Hardware-/Cloud-Kapazität, Standardisierung, technische Schuld, Resilienz- und Energie-/Kostenrisiko über systemkritische Plattformen.", "rationale": "Chief-Entscheidungen betreffen mehrjährige Beschaffungs-, Betriebs- und Souveränitätsfolgen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Kernel, Treiber, Firmware, InfiniBand/RDMA, GPU-Kernel, Storage-Firmware, Echtzeit, Safety, Elektrotechnik und Rechenzentrumsdesign werden mit Spezialisten vertieft.", "rationale": "Der System Architect trägt Integrations- und Risikoentscheidungen, nicht eine unbelegte Behauptung über jede Fachdisziplin."}}, "lab_validation": [{"lab_id": "KB-0018-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Lokaler oder freigegebener nicht produktiver Linux-/Container-Testfall, in dieser Bearbeitung als vollständige Fallarbeit", "evidence": "Das Lab definiert Inventar, Schichtdiagramm, CPU-/Memory-/Network-Budget, cgroup-/Containerannahmen, Messplan, OOM-/Netz-/Dependency-Gegenprobe, Observability und Cleanup.", "limitations": "Es wurden keine lokalen Systemkommandos, Hardwaremessungen, GPU-Partitionierungen, Kernelparameter oder produktiven Workloads ausgeführt oder verändert."}]}
---
# System Architect als Zielrolle

## Zweck, Definition und Scope

Ein System Architect betrachtet Hardware, Firmware, Betriebssystem, Virtualisierung/Container, Netzwerk, Storage, Laufzeit, Anwendung, Daten und Betrieb als zusammenhängendes System. Die Rolle fragt nicht nur, ob jede Komponente technisch funktioniert. Sie erklärt, wie Topologie, Ressourcen, Zeit, Fehlerdomänen, Datenpfade, Identitäten und Bedienung gemeinsam eine zugesagte Wirkung ermöglichen oder verhindern.

Diese Zielrolle liegt tiefer als eine reine Softwarestruktur und breiter als die Konfiguration eines einzelnen Servers. Ein Software Architect entscheidet etwa über Modulgrenzen und Änderbarkeit des Codes. Ein Cloud Architect über Landing Zone, Workloadplatzierung und Providergrenzen. Ein System Architect verbindet die konkrete Wirkung über Schichten: Warum erhöht ein CPU-Limit Latenz? Welche Memory-/NUMA-Topologie beeinflusst ein Inferenzprozess? Wo erzeugt NIC-, DNS-, TLS-, Queue- oder Storageverhalten eine Zeitgrenze? Welche Fehlermeldung und Messung trennt Hardware-, Kernel-, Container-, Netzwerk- und Anwendungsfehler?

Ein eigenes Konzept zu Servern, Nodes, Containern, GPU-Partitionierung, Routing, Tracing und Evaluation oder begrenzte Praxis-/Ausbildungskontexte in physischer technischer Infrastruktur liefern Lernkontext. Das ist kein Nachweis produktiver GPU-/Clusteroperations, Kernel-/Treiberentwicklung, Netzwerkbetrieb, Zertifizierung oder eines System-Architect-Titels.

Nach diesem Kapitel kann der Leser:

1. eine Systemgrenze mit Hardware, OS, Netzwerk, Runtime, Daten, Bedienung und Failure Domains statt als bloße Komponentenliste beschreiben;
2. ein NFR in messbare Ressourcen- und Zeitbudgets für CPU, Memory, Storage, Netzwerk, Accelerator, Queue und Softwarepfad zerlegen;
3. cgroups, Scheduler, Containerrequests/-limits, NUMA, Device-/GPU-Partitionierung und Netzwerkpfade in ihren Grenzen erklären;
4. einen Performance-, Capacity-, Reliability- und Securitynachweis durch Inventar, Hypothese, Messung, Gegenprobe und Recoveryplan strukturieren;
5. Komponenten- und Lieferanteneigenschaften nicht mit einer End-to-End-Systemzusage verwechseln;
6. Staff- und Chief-Entscheidungen zu Standardhardware, Kapazität, Betriebsmodell, Souveränität und Failure-Risiko formulieren.

## Kompetenzmarker und Evidenzgrenzen

| Marker | Status | Bedeutung |
|---|---|---|
| CURRENT-EVIDENCE | offen | Eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| HANDS-ON-TARGET | aktiv | Ein Testsystem wird inventarisiert, ein Last-/Fehlerfall gemessen und die Schichtabhängigkeiten werden nachvollziehbar dokumentiert. |
| ARCHITECT-TARGET | aktiv | Hardware, OS, Netzwerk, Runtime und Anwendung werden gegen explizite Leistungs-, Zuverlässigkeits-, Sicherheits- und Kostenanforderungen abgewogen. |
| STAFF-TARGET | aktiv | Performancebudgets, Referenzsysteme, Capacity-/Failure-Reviews und Messprotokolle werden wiederverwendbar. |
| CHIEF-TARGET | aktiv | Kapazitäts-, Beschaffungs-, Cloud-/On-prem-, Energie-, Souveränitäts- und Standardisierungsentscheidungen werden als Portfolio geführt. |
| SPECIALIST-OPTIONAL | aktiv | Kernel, Treiber, Firmware, RDMA, Echtzeit, Elektro-/Safety- und GPU-Kernelthemen sind klar begrenzte Spezialgebiete. |

## Mental Model: Ein Orchester mit physikalischen Grenzen

Ein System ist ein Orchester. Die Partitur beschreibt den gewünschten Ablauf; die Musiker sind Prozesse, Threads, Dienste und Geräte; der Saal liefert Akustik, Strom, Netzwerk und Temperatur; die Dirigentin koordiniert Zeit und Ressourcen. Ein Fehler in einem Instrument kann die Gesamtwirkung stören, auch wenn die übrigen perfekt spielen. Ein schneller GPU-Kernel nützt wenig, wenn Daten über einen langsamen Pfad kommen. Eine kurze Netzwerk-Roundtrip-Zeit nützt wenig, wenn Speicher reclaimt, cgroups throttlen oder ein Consumerlag wächst.

Die Analogie ist begrenzt: Computerkomponenten folgen präzisen, messbaren Regeln. Der System Architect ersetzt Vermutung durch ein Schichtenmodell und Evidence:

```text
Workload / Nutzerziel
  → Anwendung und Prozessmodell
  → Runtime, Container, VM, Scheduler
  → OS, cgroups, memory, filesystems, drivers
  → CPU, NUMA, RAM, NIC, storage, accelerator, firmware
  → Netzwerk, Strom, Standort, Provider/Operations
```

Die Kerninvarianten sind:

1. **End-to-End zählt.** Der langsamste oder fehlerhafte Pfad bestimmt Nutzerwirkung, nicht die beste Einzelmetrik.
2. **Requests/Limits sind Modelle.** Sie beeinflussen Scheduling und Enforcement, garantieren aber nicht pauschal Latenz oder verfügbare Hardware.
3. **Isolation ist mehrschichtig.** cgroup, VM, Container, NIC, VPC, GPU-Slice, IAM und Datenzugriff haben verschiedene Schutzobjekte.
4. **Topologie ist Verhalten.** CPU-, Memory-, PCIe-, NIC-, Storage- und Netzdistanz können Latenz, Bandbreite, Fehler und Kosten verändern.
5. **Messung benötigt Workload und Gegenprobe.** Durchschnittsnutzung ohne Lastprofil, Tail-Latenz, Fehlerklasse oder Kontrollfall ist keine Architekturbegründung.

## Prerequisites und Dependencies

Die [Rollenmatrix](../00-navigation-governance/02-rollen-kompetenz-matrix.md), [Selbsteinschätzung und Evidenzgrenzen](../00-navigation-governance/04-cv-istbild-und-zielkompetenzen.md), das [Kompetenzmodell](../00-navigation-governance/05-kompetenzmodell-fuer-staff-principal-und-chief.md), die [Lerntiefe](../00-navigation-governance/06-praktische-und-architektonische-lerntiefe.md) und die [Labstrategie](../00-navigation-governance/09-laborstrategie-und-beweisartefakte.md) sind harte Grundlagen.

| Beziehung | Kapitel | Anschluss |
|---|---|---|
| related | [KB-0013: AI Platform Architect](03-ai-platform-architect-als-zielrolle.md) | Gemeinsame AI-Runtime und GPU-Kapazität benötigen Systemtopologie und Betriebsnachweis. |
| related | [KB-0016: Cloud Architect](06-cloud-architect-als-zielrolle.md) | Provider-/Landing-Zone-Entscheidungen bilden den äußeren Systemrahmen. |
| related | [KB-0017: Solution Architect](07-solution-architect-als-zielrolle.md) | End-to-End-Lösung entscheidet NFR und Abnahme; Systemarchitektur macht ihre Schichten nachweisbar. |
| related | [KB-0019: Software Architect](09-software-architect-als-zielrolle.md) | Softwarestruktur und Laufzeitverhalten werden gegen physische Grenzen entworfen. |
| related | [KB-0020](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0020) | Weitere Zielrollen- und Entscheidungsvertiefung. |
| applies | [KB-0031](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0031) | System- und Linuxgrundlagen werden später kanonisch vertieft. |
| applies | [KB-0434: NVLink und NVSwitch](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0434) | Accelerator-/Interconnecttiefe. |
| applies | [KB-0572: Grafana](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0572) | Betriebsdashboards für die Evidenzkette. |
| applies | [KB-0720: Portfolioevidenz](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0720) | Test- und Berufsevidenz sauber trennen. |

## Core Concepts und Mechanismen

### Systemgrenze, Kontext und Failure Domain

Eine Systemgrenze beginnt bei der Wirkung und nicht beim Rack oder Pod. Für einen Inferenzservice kann das System aus Client, DNS, Edge, Auth, API, Queue, Retriever, Modelserver, GPU, Storage, Netz, Provider und On-call bestehen. Eine „GPU-Performance“-Aussage, die Kontextaufbereitung, Netzwerk und Queue ausklammert, ist eine Komponentenmetrik, keine Systemzusage.

| Begriff | Frage | Beispiel |
|---|---|---|
| System of Interest | Was wird als Ganzes beurteilt? | Commerce-Statusservice mit AI-Erklärpfad. |
| Boundary | Was gehört zum System, was ist externe Dependency? | Eigene API/Runtime versus ERP, Modellprovider und DNSdienst. |
| Interface | Wie kreuzen Daten, Befehle, Energie oder Kontrolle die Grenze? | TLS API, Event, PCIe DMA, block I/O, OIDC token. |
| Failure Domain | Welche Teile können gemeinsam ausfallen? | Host, Rack, Zone, Region, Provider, Identity Provider, Brokerpartition. |
| Trust Boundary | Wo ändert sich Vertrauensniveau oder Berechtigung? | Client → Edge, Runtime → Datenservice, Workload → Provider. |
| Performance Domain | Wo wird um knappe Ressource konkurriert? | CPU run queue, NUMA node, NIC queue, IOPS, GPU profile, API quota. |
| Operations Boundary | Wer diagnostiziert, patcht und recoveriert? | Produktteam, SRE, Plattform, Cloud-/Hardwarelieferant. |

Ein Abhängigkeitsdiagramm muss die Richtungen klar machen. Ein Netzwerkpfad kann Daten transportieren, aber ein Identityprovider kann gleichzeitig die Kontrollplane blockieren. Ein Storageausfall kann sowohl Datenpfad als auch Wiederanlauf beeinträchtigen. Die Systemarchitektur markiert solche Mehrfachwirkungen statt eine ungerichtete Boxenlandschaft zu zeichnen.

### Ressourcenpfad: CPU, Memory, I/O, Network und Accelerator

Eine Nutzeranfrage verbraucht Ressourcen nicht gleichmäßig. Ein Beispiel für AI-Inferenz:

```text
request → TLS/parse → CPU scheduling → context/retrieval I/O → host-to-device transfer
        → GPU compute + memory/KV cache → device-to-host → API serialization → network response
```

Die obere Grenze der End-to-End-Zeit ist nicht die Summe stabiler Mittelwerte. Warteschlangen, Cache-Misses, GC, Page Faults, TLS-Handshakes, Storage tails, NIC congestion, GPU batching, Scheduling and retries erhöhen insbesondere p95/p99. Der Architect teilt Budget und Messung auf:

\[
T_{e2e}=T_{edge}+T_{cpu}+T_{memory/io}+T_{network}+T_{accelerator}+T_{queue}+T_{application}
\]

Diese Formel ist ein Diagnosemodell, keine direkte Messung. Jede Größe braucht Instrumentierung und Lastprofil.

### cgroups, Container und Scheduler

cgroup v2 organisiert Prozesse hierarchisch und verteilt Ressourcen über Controller. Die Kernel-Dokumentation unterscheidet beispielsweise Gewichte, Limits, Protections und exklusive Allocations; die Vererbung im Baum beschränkt untergeordnete Gruppen weiter. `cpu.weight` ist eine verhältnisbasierte Verteilung bei Konkurrenz, während ein Limit eine Obergrenze sein kann. Daher bedeutet „CPU request“ nicht „feste CPU mit unveränderbarer Latenz“.

Kubernetes verknüpft Container Requests und Limits mit Scheduling und Linux-cgroups: Requests beeinflussen die Platzierung/relative CPUgewichtung; CPUlimits begrenzen Zeit, Memorylimits können zu OOM-Eingriff führen. Ein Pod kann bei niedriger realer Nutzung trotzdem unschedulable sein, wenn seine Requests nicht mehr in die Nodekapazität passen. Siehe [Kubernetes Resource Management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) und [cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html).

| Mechanismus | Beabsichtigte Wirkung | Systemgrenze |
|---|---|---|
| CPU request/weight | Schedulingbedarf und relative Zuteilung bei Konkurrenz | Kein exklusiver Core, kein End-to-End-SLO. |
| CPU limit | Obergrenze der CPUzeit | Kann Throttling/Tail-Latenz erzeugen; Container wird für CPUüberschreitung nicht einfach beendet. |
| Memory request | Placement/Schutzhinweis | Reale Verbrauchs- und Nodepressure-Situation bleiben relevant. |
| Memory limit | cgroup-Obergrenze | OOM kann Prozess beenden; `emptyDir` im RAM zählt gegen Speicher. |
| ResourceQuota | Namespace-aggregierte Begrenzung | Keine Node-/Netz-/Datenisolation. |
| cgroup weight/protection | Hierarchische Fairness/Schutz | Overcommit und Elternlimit können Schutz einschränken. |
| Pod/Node scheduling | Ressourcenplatzierung | Topologie, Fragmentierung, Device-/Quota-/Policygrenzen entscheiden mit. |

### NUMA, PCIe und Accelerator

Bei NUMA ist Memory nicht für jede CPU gleich weit entfernt. Linux Memory Policy steuert, aus welchen Nodes Speicher zugeteilt wird; cpusets und Memory Policy sind verschiedene Mechanismen, wobei cpuset-Einschränkungen Vorrang haben können. Das ist besonders bei hohem Memory- oder Acceleratordurchsatz relevant. Eine Anwendung kann genügend gesamtes RAM sehen und dennoch unter Remote Memory, Fragmentierung oder unpassender CPU-/PCIe-/NIC-/GPU-Platzierung leiden. Siehe [Linux NUMA Memory Policy](https://docs.kernel.org/6.2/admin-guide/mm/numa_memory_policy.html).

NVIDIA MIG partitioniert unterstützte GPUs in Instanzen mit zugewiesenen Compute- und Memoryressourcen. Das kann QoS und Auslastung für geeignete Workloads verbessern. Es ist jedoch weder eine globale Tenancy- noch eine vollständige Anwendungssicherheitsstrategie: Identity, Daten, Netzwerk, Container-/VM-, Betriebs- und Providergrenzen bleiben separate Entscheidungen. Hardware-, Treiber-, Runtime-, Device-Plugin- und Profilmatrix müssen konkret validiert werden. Siehe [NVIDIA MIG User Guide](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/).

## Architecture / Data Flow: Inferenzservice als Gesamtsystem

```text
Client
  │ DNS/TLS/Auth
  ▼
Edge / API Gateway ── trace and rate limit
  │
  ▼
Application Pod / process
  │ CPU, memory, cgroup, queue
  ├──── retrieval → storage/network/dependency
  │
  └──── model runtime → PCIe/NVLink → GPU memory/compute
                                  │
                             driver/firmware/device plugin
  ▼
response + metrics/logs/traces → collector/backend → SLO/incident/capacity
```

Für jede Pfeilverbindung werden sechs Fragen beantwortet:

1. Welche Daten/Kommandos kreuzen die Grenze und welche Klasse haben sie?
2. Welche Identity und Autorisierung wirken dort?
3. Welche Ressourcen, Limits, Quotas, Queues und Zeitbudgets gelten?
4. Welche Failure Modes und Degradationen sind akzeptiert?
5. Welche Signale messen Erfolg, Last, Fehler, Sicherheit und Kosten?
6. Wer besitzt Change, Incident, Capacity und Exit?

Beispiel: Ein Modellserver kann eine MIG-Instanz nutzen. Der Containerrequest beschreibt nur die vom Orchestrator annoncierte Ressource. Er sagt nichts über Modellgewicht, KV-Cache, Kontextlänge, Batch, Device-Memoryfragmentierung, PCIe-Topologie, Netzwerkzufuhr, Modellqualität oder Mandantendaten aus. Der System Architect dokumentiert diese Annahmen und prüft sie unter Last.

## Protocols, Standards und Tools

| Bereich | Mechanismen und Tools | Ziel und Grenze |
|---|---|---|
| Hardwareinventar | CPU/RAM/NIC/Storage/GPU/PCIe/Firmwareinventar, BMC-/Providerdaten | Reproduzierbarer Istzustand; Inventar ersetzt keine Performanceanalyse. |
| OS/Prozess | Linux scheduler, cgroup v2, namespaces, systemd, filesystems, OOM | Ressourcen- und Isolationsverhalten; Policies sind Kernel-/Runtimeabhängig. |
| Container/Orchestrierung | OCI, container runtime, Kubernetes requests/limits, Device Plugin, scheduler | Deklarierter Workloadzustand und Platzierung; keine automatische SLOgarantie. |
| Netzwerk | Ethernet/IP/TCP/UDP/TLS/DNS, load balancer, service discovery, flow logs | Ende-zu-Ende-Pfad, Security und Fehlersuche; Pakettransport ersetzt fachliche Korrektheit nicht. |
| Storage | block/file/object, IOPS/throughput/latency, backup, checksums, replication | Datenhaltbarkeit und Performance; Backup nicht gleich Restore. |
| Telemetrie | OpenTelemetry, node/process/device metrics, logs, traces, profiles | Korrelation über Schichten; sensitive Daten und Kardinalität begrenzen. |
| Capacity | load test, chaos/failure test, benchmark, SLO/error budget, cost meter | Entscheidungsbeleg; Ergebnis ohne Testbedingungen ist nicht übertragbar. |
| Standards | ISO 42010/Architecture Description, Herstellerkompatibilitätsmatrix | Stakeholder-/Viewpoint-Disziplin und konkrete Unterstützung; nicht eine automatische Implementierung. |

Technologien ändern ihre Versionen, Treiber und Feature Gates häufig. Eine Systemarchitektur führt daher eine Matrix: Hardwaremodell, BIOS/Firmware, Kernel, Runtime, Driver, Device Plugin, Orchestrator, CNI/CSI, Modell-/Softwareversion, aktivierte Features, Messdatum und bekannte Einschränkung. „Unterstützt“ bedeutet erst dann etwas, wenn die konkrete Kombination getestet oder vom zuständigen Lieferanten begrenzt zugesichert ist.

## Konfiguration / Implementierung: Ressourcenvertrag statt magischer Tuningwerte

Ein Ressourcenvertrag trennt deklarierte Anforderungen von gemessener Wirklichkeit. Das Beispiel zeigt einen generischen Containerworkload; der Acceleratorname ist bewusst kein echter Gerätename.

```yaml
resources:
  requests:
    cpu: "2"
    memory: "8Gi"
    example.com/accelerator-profile: "1"
  limits:
    cpu: "4"
    memory: "12Gi"
    example.com/accelerator-profile: "1"
performance_contract:
  workload: "synthetic-inference-test"
  input_profile: "documented-token-and-concurrency-distribution"
  target:
    p95_end_to_end_latency: "measured-per-release"
    error_budget: "defined-by-product-owner"
  measurements:
    - cpu_throttling
    - memory_events
    - queue_depth
    - device_memory
    - network_rtt
    - storage_latency
```

`example.com/accelerator-profile` ist ein Platzhalter. Vor einer echten Ausführung muss das Team die tatsächlich annoncierten Extended Resources, Node-/Device-Pluginversionen und Profile prüfen. Kubernetes behandelt Extended Resources nicht als overcommittable; wenn Request und Limit gesetzt sind, müssen sie für diese Ressource gleich sein. Das erklärt Scheduling, nicht die Modellperformance.

Eine Konfiguration ist erst reviewbar, wenn sie folgende Begleitdaten hat: erwartete Last, Messmethodik, Baseline, Ressourcen-/Topologieinventar, Dependencies, SLO, Fehlerbudget, Security-/Data-Constraint, Cost Scope, Owner, Rollback, Cleanup und ein negativer Test. Tuningwerte aus fremden Benchmarks ohne Topologie und Version sind keine sichere Produktionsanleitung.

## Scalability und Performance

### Capacity Planning

\[
Capacity_{needed} \geq Peak\ Demand + Failure\ Reserve + Deployment\ Headroom
\]

Diese einfache Formel braucht Definitionen. Peak kann Requestrate, Token/s, Events/s, IOPS oder gleichzeitige Gerätejobs bedeuten. Failure Reserve muss die gewählte Failure Domain abdecken; Deployment Headroom berücksichtigt Rollout, Cachewarmup, Rebuild, Rebalance und Diagnose. Kapazität darf nicht aus Durchschnittsauslastung abgeleitet werden.

| Dimension | Lastmodell | Engpass | Messung |
|---|---|---|---|
| CPU | RPS, Threads, Parse/Encrypt/Serialize | run queue, throttling, contention, GC | utilization, throttled time, run queue, p95/p99. |
| Memory | working set, cache, KV cache, buffers | OOM, reclaim, page fault, NUMA distance | RSS, cgroup events, PSI, page faults, OOM. |
| Storage | IOPS, throughput, block size, queue depth | latency tails, saturation, backup/restore | p50/p95/p99 I/O, queue, errors, restore duration. |
| Network | packets/s, bytes/s, connections, RTT | loss, queue, TLS/DNS, egress/limit | RTT, retransmit, connection error, flow/egress. |
| Accelerator | batch, tokens, context, precision, device memory | cache, compute, transfer, profile fragmentation | utilization, memory, queue, TTFT, token latency. |
| Orchestrator | pod count, request, quota, scheduling | insufficient resources, topology, admission | pending time/reason, eviction, node pressure. |
| Human operations | alerts, changes, incidents | cognition, access, unclear ownership | MTTA/MTTR, change failure, runbook success. |

System performance is a Pareto problem: optimising average throughput can worsen tail latency, power, cost, fairness or recovery. A large batch can improve accelerator utilisation but violate response time. CPU pinning or NUMA alignment may help a known workload but reduces scheduling flexibility. The architecture records what is optimised, for which load and at which cost.

## Reliability / Failure Modes

| Fehlerbild | Symptom | Detektion | Schutz/Recovery |
|---|---|---|---|
| CPU throttling | p99 steigt bei hoher Nutzung, nicht zwingend CPU 100% | cgroup CPU throttled time, trace, run queue | limits/requests/workload prüfen; nicht blind CPUs erhöhen. |
| Memory pressure/OOM | restarts, eviction, latency spikes, cache loss | cgroup memory events, kernel/container events, RSS/PSI | working set, limits, `emptyDir`, leak, node reserve prüfen; Rollback/scale. |
| NUMA/topology mismatch | ausreichend Gesamtressource, aber schlechte tail latency/throughput | topology inventory, CPU/memory/device correlation | placement, CPU/memory affinity, pool/profile bewerten; test before pinning. |
| Storage tail/volume issue | timeouts, queue depth, inconsistent performance | I/O latency/error, filesystem, provider metrics | queue/backpressure, tier, backup/restore, dependency recovery. |
| Network/DNS/TLS path fault | connection errors, retransmits, handshake latency | DNS, TLS, flow, trace, synthetic checks | allowlist/DNS/route/cert verify; never open network broadly as shortcut. |
| Device/driver issue | device missing, process error, health event | device plugin/driver logs, node condition, metrics | cordon/drain/replace/restart per runbook; retain failed evidence. |
| Scheduler/quota mismatch | pending despite low average use | Pending reason, requests, quotas, profile availability | capacity/topology/quotas reconcile; average utilisation is insufficient. |
| Telemetry overload | dropped signals, cost spike, sidecar contention | collector queue/drop, cardinality, node resource use | sampling, aggregation, isolated pipeline; do not blind operations. |
| Power/host/rack failure | simultaneous node/dependency loss | BMC/provider/zone health, multi-node symptoms | failure-domain design, tested recovery, inventory/replace process. |

A hardware replacement, driver upgrade or kernel feature change is a system change. It receives compatibility tests, staged rollout, observability, rollback and owner. Version drift can turn a correct theoretical architecture into a production incident.

## Security, Governance und Compliance

| Schutzbereich | Systementscheidung | Nachweis |
|---|---|---|
| Boot/Firmware/Host | asset inventory, update policy, secure access, lifecycle | version, owner, vulnerability/change record. |
| OS/Runtime | least privilege, patching, namespaces/cgroups, minimal host access | image/runtime policy, access audit, hardening baseline. |
| Network | segmentation, TLS, DNS, ingress/egress, control-plane access | dataflow, firewall/flow evidence, cert rotation. |
| Data/Storage | encryption, key access, backup, retention, secure disposal | data owner, restore test, key/retention record. |
| Accelerator/Device | device allocation, driver/plugin trust, tenant/ops boundary | compatibility matrix, allocation/audit, supported profile. |
| Observability | access, redaction, retention, integrity, volume/cost control | telemetry schema and role model. |
| Operations | JIT admin, break-glass, incident and forensic process | approval, expiration, immutable/audited logs. |
| Supply chain | firmware/driver/image provenance, dependency and update policy | approved source, signature/SBOM where applicable, staged rollout. |

System Architecture cannot assert regulatory compliance from encryption or segmentation alone. Applicability, data role, contract, retention, access and local legal requirements must be reviewed by competent owners. The Architect makes scope, assumptions, evidence and remaining gaps visible.

## Observability und Troubleshooting

A system dashboard combines **golden signals** with resource and topology context. A CPU percentage alone cannot diagnose tail latency; an accelerator utilisation alone cannot explain queue or quality.

| Layer | Minimum signals | Hypothesis enabled |
|---|---|---|
| User/API | rate, p50/p95/p99, errors, saturation, outcome | Is the service failing or merely slow? |
| Process/Runtime | GC, threads, FDs, RSS, cgroup CPU/memory events | Is the problem in the runtime or resource enforcement? |
| OS/Host | load/run queue, PSI, OOM, disk/network error, kernel logs | Is the host under pressure or fault? |
| Network | DNS, handshake, RTT, retransmit, flow/egress | Is the path or policy blocking/slow? |
| Storage | IOPS, latency, queue, errors, capacity, restore | Is state retrieval or persistence the bottleneck? |
| Device | memory/compute, device errors, PCIe/link, driver/plugin | Is accelerator capacity, topology or health involved? |
| Orchestrator | requested/allocated, pending, eviction, node condition | Is scheduling/policy/capacity preventing the desired state? |
| Business/Cost | accepted tasks, stale/denied, cost/task, incident support | Is optimisation harming outcome or economics? |

Troubleshooting path for an overloaded inference node:

1. Identify one affected request and correlate from edge through application, queue, retrieval, device and response. Establish before/after release and workload profile.
2. Determine whether requests are pending, throttled, waiting in queue, retransmitting or blocked by dependency. Do not infer from average CPU/GPU alone.
3. Read cgroup memory/CPU events, runtime process metrics and node condition. Separate OOM/reclaim/CPU throttling from application deadlock or remote dependency.
4. Compare CPU, memory, NIC and accelerator topology. Test a controlled placement/limit variation only in a permitted test environment; avoid production kernel tuning as a diagnosis shortcut.
5. Inspect model/context/batch and device memory pressure. A larger batch can improve throughput yet increase queue and tail latency.
6. Check storage/retrieval and network egress; a device may be idle while it waits for data.
7. Choose safe recovery: queue/demand shed, scale within approved capacity, rollback a release, route to an approved fallback or mark the response pending. Record evidence and post-incident system assumptions.

## Cost / FinOps

\[
C_{system}=C_{hardware/cloud}+C_{energy}+C_{network}+C_{storage}+C_{software}+C_{operations}+C_{risk}+C_{exit}
\]

\[
C_{useful\ capacity}=\frac{C_{system}}{\max(1,accepted\ workload\ units)}
\]

The denominator needs a real product unit: authorised status checks, processed events, inferenced tokens under quality threshold or accepted workflows. High utilisation is not equivalent to useful capacity. An overloaded accelerator can have high utilisation and low user value; a redundant node can appear idle and be the correct failure reserve.

| Driver | Measurement | Architecture leverage | Wrong conclusion |
|---|---|---|---|
| Compute/accelerator | allocated/active time, queue, profile, energy | pool sizing, batching, scheduling, provider/host choice | full utilisation is always optimal. |
| Memory/storage | GB, IOPS, replication, backup, retention | lifecycle, tier, cache, data model | memory-backed cache has no cost/risk. |
| Network | egress, cross-zone/rack, bandwidth, retransmit | placement, compression, data path | compute price is total system cost. |
| Operations | on-call, driver patch, spare, incident, training | managed service, automation, standard matrix | hardware cost is total TCO. |
| Failure reserve | spare capacity, replication, recovery test | SLO/RTO/RPO decision | idle capacity is automatically waste. |
| Exit | migration, disposal, contract, data export, retraining | interfaces, inventory, lifecycle | benchmark portability equals operational exit. |

A Chief decision between own GPU capacity, cloud accelerators or external model provider must include duty cycle, demand variance, staff competence, facility/energy, data/souvereignty, availability, upgrade cadence, contracts and exit—not merely token price or accelerator utilisation.

## Trade-offs und Anti-Patterns

| Entscheidung | Optionen | Trade-off |
|---|---|---|
| General-purpose nodes | specialised CPU/GPU/FPGA nodes | flexibility and utilisation versus profile, driver and capacity complexity. |
| Shared resources | reserved/pinned resources | efficiency versus tail-latency/tenant isolation; request models must match workload. |
| VM | container | stronger boundary/operating model versus density/start time/tooling; neither guarantees security alone. |
| Local storage/cache | remote/durable storage | low latency versus durability/portability/recovery. |
| Single host | multi-node/zone | simplicity versus host failure and coordination; distributed state adds consistency cost. |
| On-prem hardware | cloud/managed device/provider | control versus procurement/operations; provider elasticity versus dependency/data/cost. |
| Aggressive tuning | portable baseline | throughput versus maintainability, upgrade and specialist dependence. |
| Broad telemetry | targeted telemetry | visibility versus overhead, privacy and cost. |

Anti-Patterns: hardware inventory as architecture, benchmark without workload, CPU percentage as performance proof, container as security boundary, `request` as reserved physical capacity, GPU partition as complete multi-tenancy, NUMA pinning without topology test, average latency as SLO, tuning kernel settings in production to guess a cause, untested restore, unowned driver/firmware lifecycle and oversizing without failure/cost rationale.

## Staff-, Principal- und Chief-Entscheidungen

| Ebene | Entscheidung | Evidenz und Trigger |
|---|---|---|
| Staff | Standard system evidence pack einführen | Inventar, topology, workload, baseline, test, failure probe, SLO, cost and owner. Repeated incident gaps improve the pack. |
| Staff | Performance budgets across layers define | API, queue, storage, network, runtime and device budgets reconcile to user SLO. Tail breach triggers review. |
| Principal | Workload profile and placement choose | topological, runtime, data, network, capacity and operational constraints demonstrate the choice. New model/driver/data path triggers revalidation. |
| Principal | Shared versus isolated resource model choose | fairness, tail, security, cost, capacity and recovery tests guide decision. Noisy-neighbor or safety finding triggers re-evaluation. |
| Chief | Hardware/cloud/provider capacity strategy | demand, energy, staffing, contract, sovereignty, availability and exit form an investment case. Demand/price/regulatory change triggers review. |
| Chief | System standardization boundary set | validated reference systems reduce risk; exceptions remain evidence-backed. Large exception rate signals wrong standard or unmet needs. |
| Chief | Lifecycle risk accepted or remediated | firmware/driver/kernel end-of-support, spare/recovery and migration cost are visible in portfolio planning. |

## Production Checklist

| Bereich | Prüfnachweis | Owner | Stop-/Rollback |
|---|---|---|---|
| System boundary | context, dependencies, trust/failure/operations boundaries | System + Product Owner | critical dependency/owner unknown. |
| Inventory/topology | CPU/RAM/NIC/storage/device, OS/kernel/driver/runtime versions | Platform/Operations | unvalidated or unsupported combination. |
| Workload/NFR | load, p95/p99, throughput, quality, RTO/RPO, cost unit | Product/System Owner | vague target/no failure boundary. |
| Resource model | requests/limits/quotas, scheduling, capacity, reserve | Platform/System | quota/limit presented as untested guarantee. |
| Data/network | dataflow, identity, DNS/TLS/egress, storage/backup | Data/Security/Network | unapproved path or absent data owner. |
| Reliability | failure domains, health, fallback, runbook, recovery test | SRE/Operations | RTO/RPO without test or responsible team. |
| Security | host/runtime/device access, patch/lifecycle, audit | Security + Operations | shared admin, unowned vulnerability/driver plan. |
| Observability | signals, topology labels, alerts, retention/redaction | SRE/System | cannot distinguish system layers in incident. |
| Cost | capacity, energy/cloud, storage/network, reserve, exit owner | Finance + System Owner | no scope/owner or false utilisation target. |
| Change/Exit | staged rollout, compatibility, rollback, decommission | System/Platform Owner | destructive change without evidence/backout. |

## Interviewfragen mit Antwortleitfäden

1. **Was macht System Architecture anders als Software Architecture?** Sie verbindet Software mit Runtime, OS, hardware, network, storage, operations and physical/provider constraints to explain end-to-end behavior.
2. **Warum ist CPU utilisation keine Leistungszusage?** Scheduler, throttling, queue, memory pressure, I/O, topology and dependency latency can dominate p99. Define workload and measure the path.
3. **Was bewirkt cgroup v2?** Hierarchische Prozessorganisation und Controller für Ressourcenverteilung. Weights, limits and protections have different semantics; they do not automatically reserve all physical resources.
4. **Wie unterscheiden sich Kubernetes Request und Limit?** Request informs scheduling/relative allocation; limit constrains usage. Both need interpretation with node capacity, cgroups, quotas, workload and failure behavior.
5. **Wann ist NUMA relevant?** Bei memory-/device-/network-intensiven Workloads mit mehreren Nodes. Determine topology and test; do not pin based on a generic tutorial.
6. **Was liefert MIG und was nicht?** Partitioned compute/memory on supported GPUs for QoS and sharing. It does not replace IAM, data, network, operations or application isolation.
7. **Wie planen Sie Kapazität?** Peak model, failure reserve, deployment headroom, quota/provider constraints and test evidence. Average utilisation alone misleads.
8. **Wie diagnostizieren Sie OOM?** Correlate cgroup events, RSS, limits, request, node pressure, `emptyDir`, application allocation and restart/eviction. Then choose controlled recovery.
9. **Wann kaufen Sie Hardware statt Cloud?** Compare stable demand, data/souvereignty, performance, energy/facility, staff, availability, contract and exit. Both require full TCO and lifecycle evidence.

## Praktisches Lab / Fallarbeit: Schichtübergreifender Inferenzsystemnachweis

**Status:** **reviewed_only**, Stand 2026-09-15. Diese Fallarbeit beschreibt ein späteres Testverfahren. Es wurden keine lokalen Kommandos, cgroup-/kernel-/NUMA-Einstellungen, Containerlimits, GPUprofile, Netzwerkregeln oder produktiven Systeme ausgeführt beziehungsweise verändert.

### Ziel und Umgebung

Untersuche einen fiktiven Dokumentenassistenten mit API, Retrieval, Inferenzruntime und optionalem Accelerator. Der geplante Service soll bei einer synthetisch definierten Last stabile, quellengebundene Antworten liefern. Für das Lab existiert nur ein nicht produktiver Linux- oder Container-Testhost. Es gibt keine reale GPU-Annahme; bei fehlendem Accelerator wird eine simulierte Geräteabhängigkeit dokumentiert.

### Aufbau

1. Erstelle ein Inventarblatt für CPU, Memory, NUMA, Storage, NIC, Accelerator, OS/Kernel, Container Runtime, Driver, Orchestrator und Telemetrieversion. Jeder unbekannte Wert bleibt offen, wird nicht geraten.
2. Zeichne Systemgrenze, Data/Trust/Failure/Operations Boundaries und den E2E-Pfad. Weise Component Owner, SLO, Cost Scope und Recoveryowner zu.
3. Definiere eine kleine Testlast: Requests/s, input/output profile, concurrency, retrieval size, expected p95, error budget and test duration. Alle Werte sind Lernannahmen.
4. Lege Messpunkte fest: Edge/API trace, cgroup CPU/memory events, process RSS/FDs, run queue, storage latency, DNS/TLS/RTT, queue, device health/memory, deployment revision and cost meter.
5. Erstelle einen Container-Ressourcenvertrag mit Requests/Limits und dokumentiere, welche Aussagen er erlaubt und welche nicht. Für einen Accelerator nutze nur einen Platzhalter, keine erfundene Device-Resource.
6. Beschreibe drei Kapazitätsoptionen: shared node, dedicated/NUMA-aware pool, external/managed accelerator. Bewerte tail latency, fairness, operations, security, cost, sovereignty and exit.
7. Schreibe Runbooks für OOM, pending scheduler, device unavailable, storage slowdown, DNS/egress error and telemetry drop. Jede Aktion nennt einen sicheren Testscope und keine Produktionstuninganweisung.

### Negative Gegenproben

| Probe | Erwartete Beobachtung | Was sie nicht beweist |
|---|---|---|
| Memorylimit wird hypothetisch unterschritten | cgroup-/runtime-OOM-/restart oder failure path wird erwartet und instrumentiert | konkrete OOM-Auswahl in einer realen Kernel-/Runtimekombination. |
| CPUlimit erzeugt Lastkonkurrenz | throttling/queue/p95 wird als Hypothese gemessen, nicht nur CPU-Prozent | dass mehr CPU das richtige Fix ist. |
| Pod bleibt pending trotz niedriger Hostauslastung | Requests, quota, extended resource and topology reason are checked | reale Schedulerdiagnose ohne Cluster. |
| GPUprofil ist nicht verfügbar | Workload bleibt unschedulable oder Fallback wird bewusst gewählt | dass ein generisches Ressourcenlabel ein echtes MIGprofil ist. |
| DNS/Egress to dependency fails | trace/flow/runbook distinguishes network policy from app failure | dass eine offene Firewall eine sichere Lösung ist. |
| Telemetriecollector überläuft | drops/queue/cost are visible; service has a safe operating stance | dass vollständige observability is required for every response. |

### Auswertung und Cleanup

Das Lab ist erst funktional bestanden, wenn ein kontrollierter Testhost die definierten positiven und negativen Proben mit Versionen, Inventar, Messdaten, Kosten und Recoverybeobachtung dokumentiert. Die daraus abgeleiteten Entscheidungen müssen benennen, was gemessen, geschätzt und nicht getestet wurde. Bei dieser reinen Fallarbeit werden lokale Synthetikdaten gelöscht und keine Systemänderung rückgängig gemacht, weil keine durchgeführt wurde.

## Dependencies, Cross-References und Quellen

Rollen- und Nachweisgrundlagen liegen in [KB-0002](../00-navigation-governance/02-rollen-kompetenz-matrix.md), [KB-0004](../00-navigation-governance/04-cv-istbild-und-zielkompetenzen.md), [KB-0005](../00-navigation-governance/05-kompetenzmodell-fuer-staff-principal-und-chief.md), [KB-0006](../00-navigation-governance/06-praktische-und-architektonische-lerntiefe.md) und [KB-0009](../00-navigation-governance/09-laborstrategie-und-beweisartefakte.md). Die benachbarten Perspektiven stehen in [KB-0013](03-ai-platform-architect-als-zielrolle.md), [KB-0016](06-cloud-architect-als-zielrolle.md), [KB-0017](07-solution-architect-als-zielrolle.md) und [KB-0019](09-software-architect-als-zielrolle.md).

| Quelle | Verwendete Aussage | Stand |
|---|---|---|
| Dateikatalog der Knowledge Base, KB-0018 | Verbindlicher Scope, Zielrollenfokus und Pfad. | Planstand 2026-09-14 |
| [Linux cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html) | Hierarchische Prozessorganisation und Ressourcenverteilung mit Weights, Limits, Protections und Allocations. | Abgerufen 2026-09-15 |
| [Linux NUMA Memory Policy](https://docs.kernel.org/6.2/admin-guide/mm/numa_memory_policy.html) | Memory Policy, Node-Auswahl und Verhältnis zu cpusets. | Abgerufen 2026-09-15 |
| [Kubernetes Resource Management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) | Requests/Limits, Scheduling, cgroups, OOM-/CPU-Verhalten und Extended Resources. | Abgerufen 2026-09-15 |
| [NVIDIA MIG User Guide](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/) | Partitionierung unterstützter GPUs und konkrete Hardware-/Softwareabhängigkeiten. | Abgerufen 2026-09-15 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — Pod-zentrierte Ressourcenverwaltung für performance-sensitive Kubernetes-Workloads.** Kubernetes dokumentiert Pod-level Resource Managers als Beta in v1.37, standardmäßig deaktiviert. Sie können podweite Ressourcenbudgets mit exklusiven, NUMA-ausgerichteten Containeranteilen und einem geteilten Podpool kombinieren. **Reifegrad: Emerging.** Der Nutzen ist eine präzisere Topologie- und Ressourcenmodellierung bei Main-Container plus Sidecars. Risiken sind Feature-Gate-/Kompatibilitätsabhängigkeit, Schedulingkomplexität und falsche Erwartung an SLO-Garantien. Ein Pilot prüft exakte Version, Feature Gates, kubelet-/Topology-Manager, Container-Ressourcen, NUMA-Inventar, p95/p99, OOM-/Pending-Proben und Rollback. Quelle: [Kubernetes Pod-level Resource Managers](https://kubernetes.io/docs/concepts/resource-management/pod-level-resource-managers/).

**Stand 2026-09-15 — GPU-Partitionierung wird als QoS-Baustein reifer, bleibt aber systemisch begrenzt.** NVIDIA beschreibt MIG auf unterstützter Hardware als Partitionierung von Compute- und Memoryressourcen mit isolierten Speicherpfaden je Instanz. **Reifegrad: Established innerhalb geprüfter Kompatibilitätsmatrizen.** Der Nutzen ist vorhersehbarere Leistung und bessere Auslastung. Risiken liegen in Profilfragmentierung, Treiber-/Runtime-/Orchestratorabhängigkeit, observability gaps und der falschen Gleichsetzung mit vollständiger Tenant-/Datensicherheit. Ein Pilot verlangt Hardware-/Firmware-/Treiber-/Pluginmatrix, Scheduler- und OOM-Test, Queue-/Latenzvergleich, Incidentrunbook und Cost-per-useful-task. Quelle: [NVIDIA MIG Introduction](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/introduction.html).

**Stand 2026-09-15 — Systemobservability verschiebt sich vom Komponentenmonitoring zur Topologieevidenz.** cgroup v2, Containerresourceverwaltung und acceleratorfähige Orchestrierung erzeugen mehrere Ebenen von deklarierter, zugeteilter und realer Nutzung. **Reifegrad: Adopting.** Der Nutzen entsteht, wenn Trace, cgroup-/Node-/Device-Metrik, Queue und Cost Scope mit Revision und Topologie korreliert werden. Der neue Aufwand sind Kardinalität, Datenschutz, Betrieb und die Notwendigkeit, Signale nicht falsch zu interpretieren. Ein Pilot misst nur eine kritische Workloadkette und zeigt, dass ein Tail-Latenzincident mindestens CPU-, Memory-, Netz-, Storage-, Device- und Deploymenthypothese unterscheiden kann. Quellen: [cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html), [Kubernetes Resource Management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/).

