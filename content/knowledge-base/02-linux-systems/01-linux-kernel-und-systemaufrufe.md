---
{"id": "KB-0031", "title": "Linux Kernel und Systemaufrufe", "domain": "02", "sequence": 1, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["PLATFORM", "CLOUD", "GENAI", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [], "related": ["KB-0032", "KB-0033", "KB-0034", "KB-0035", "KB-0036", "KB-0037", "KB-0038", "KB-0039", "KB-0040", "KB-0041", "KB-0042", "KB-0043", "KB-0044", "KB-0045", "KB-0550", "KB-0565", "KB-0580", "KB-0720"], "applies": ["KB-0550", "KB-0565", "KB-0580", "KB-0720"], "dependency_status": "none_required", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein isoliertes lokales Linux-/Containerlab beobachtet System Calls, Dateideskriptoren, Prozesse, Signale, Blockierung, Netzwerk-I/O und Ressourcenansichten mit sicheren, lesenden Werkzeugen.", "rationale": "Der Kernel wird über beobachtbares Prozessverhalten und Fehlergrenzen gelernt, nicht durch unkontrollierte Systemänderungen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Backend-, Plattform- und AI-Runtime-Entscheidungen werden von User-/Kernel-Übergang, Scheduling, I/O, Identität, Isolation, Treiber/Devices und Failure Modes her begründet.", "rationale": "Architekturqualität verlangt ein korrektes mentales Modell der darunterliegenden Betriebssystemgrenzen."}, "STAFF-TARGET": {"active": true, "scope": "Teams erhalten Laufzeit- und Debuggingstandards für Timeouts, Limits, Signale, File Descriptors, Beobachtung und sichere Diagnose.", "rationale": "Staff-Wirkung entsteht durch wiederverwendbare Diagnose- und Betriebspraktiken, nicht durch implizites Kernelwissen einzelner Personen."}, "CHIEF-TARGET": {"active": true, "scope": "OS-/Kernelgrenzen werden als Risiko-, Kapazitäts-, Sicherheits-, Kosten- und Plattformentscheidung in Portfolio und Standards übersetzt.", "rationale": "Chief-Ebene muss Folgen für Betriebsmodell, Sourcing, Compliance und Reliability verstehen, ohne Kernel-Spezialisten zu ersetzen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Kernel-/Treiberentwicklung, eBPF-Programmierung, Scheduler-/NUMA-Tuning, Echtzeit, Hochleistungsnetzwerk und GPU-Treiber werden mit spezialisierten Betriebssystem-, SRE-, Netzwerk- und Hardwareexperten vertieft.", "rationale": "Die Zielrollen müssen die Schnittstellen und Risiken entscheiden können, nicht jedes Kernel-/Treiberdetail allein implementieren."}}, "lab_validation": [{"lab_id": "KB-0031-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Geplantes lokales, nicht produktives Linux-/Containerlab mit lesenden Prozess- und Syscallbeobachtungen", "evidence": "Der Artikel liefert reproduzierbare Schritte, erwartete Beobachtungen, negative Proben und Cleanup. Es wurde in diesem Eintrag keine produktive Host-, Kernel-, Treiber-, Cloud- oder GPU-Konfiguration verändert.", "limitations": "Keine Kernelmodule, IRQ-Affinitäten, sysctl-Produktionswerte, cgroup-Limits, privilegierten Container oder Hardwaretreiber wurden ausgeführt oder als geprüft behauptet."}]}
---
# Linux Kernel und Systemaufrufe

> **Ziel:** Verstehe Linux als Grenze zwischen Anwendung und Hardware: Prozesse und Threads führen User-Space-Code aus; privilegierte Operationen, Scheduling, Speicherverwaltung, Dateisysteme, Netzwerke, Geräte, Interrupts und Isolation durchlaufen Kernelmechanismen. Dieses mentale Modell erklärt viele Backend-, Container-, Cloud- und AI-Runtime-Fehler besser als ein Framework-spezifisches Debuggingrezept.

## Purpose, Definition und Scope

Der Linux-Kernel verwaltet Hardwarezugriff und stellt User Space kontrollierte Schnittstellen bereit. Anwendungen rufen nicht beliebig Geräte oder physische Speicheradressen auf. Sie verwenden System Calls, Dateien, Sockets, Laufzeitbibliotheken und weitere Kernel/User-Space-Schnittstellen. Der Kernel überprüft Privilegien, verwaltet Ressourcen, führt Scheduling und I/O aus, liefert Ergebnisse oder Fehler zurück und vermittelt zwischen Treibern, Geräten, Netz und Speicher.

Für Backend- und Plattformarbeit sind fünf Aussagen besonders wichtig:

1. Ein scheinbar einfacher Anwendungsaufruf kann mehrere Zustände und Warteschlangen im Kernel und Netzwerk berühren.
2. „Blockiert“ hat mehrere Ursachen: CPU-Scheduling, Lock, Page Fault, Dateisystem-/Block-I/O, DNS/Netzwerk, Socket-Backpressure, Timer, Signal oder eine externe Abhängigkeit.
3. Container teilen den Kernel des Hosts. Namespaces und cgroups begrenzen Sicht und Ressourcen, ersetzen aber keinen eigenen Kernel.
4. Ein Prozess besitzt Identität, Credentials, Dateideskriptoren, Adressraum, Signalzustand und Ressourcen; ein Thread teilt Teile davon mit anderen Threads desselben Prozesses.
5. Driver-, Interrupt- und Deviceverhalten beeinflussen Latenz, Durchsatz, CPU-Last, Speicher, Netz und GPU-Workloads, werden aber selten durch eine einzelne Frameworkoption gelöst.

Scope dieses Artikels: Kernel/User-Space, System Calls, Privilegienwechsel, Interrupts, Treibergrenzen und ihre Folgen für Backend-/Container-/AI-Runtimes. Spätere Domainartikel vertiefen Prozesse, Scheduler, Speicher, Filesystems, cgroups, Namespaces, eBPF und Performance.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Zulässige Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Der System-Call-Pfad, Kernel-/User-Space-Trennung, Interrupt-/Drivergrenzen und typische Blockingursachen können erklärt und für Design-/Debugginghypothesen genutzt werden. |
| HANDS-ON-TARGET | Ein isoliertes lokales Lab beobachtet Prozesse, Datei-/Socket-I/O und Syscalls mit lesenden Werkzeugen sowie sichere Gegenproben. |
| ARCHITECT-TARGET | Laufzeit-, Container-, Plattform- und AI-Runtime-Entscheidungen berücksichtigen Kernelgrenzen, Identität, Ressourcen, I/O und Failure Modes. |
| STAFF-TARGET | Teams erhalten Diagnoseroutinen, Limits, Runbooks und sichere Standards rund um Timeouts, Signale, Deskriptoren, Ressourcen und Observability. |
| CHIEF-TARGET | Kernel-/OS-Wissen wird in Plattform-, Sourcing-, Kapazitäts-, Sicherheits- und Risikofragen übersetzt; Spezialgebiete werden richtig delegiert. |
| SPECIALIST-OPTIONAL | Kernelmodule, eBPF, NUMA, IRQ-/Netzwerk-/GPU-Tuning und Echtzeit sind spezialisierte Vertiefungen mit enger Reviewpflicht. |

## Mental Model: Kontrollierte Übergänge und Warteschlangen

```text
Application / runtime / library (user mode)
    |
    | system call, trap, page fault, signal, device interrupt
    v
Kernel: validate -> schedule -> manage memory/I/O/network -> drivers
    |
    v
device / storage / NIC / GPU / timer / other host
    |
    v
interrupt / completion / wakeup
    |
    v
Kernel resumes or schedules a user-space thread
```

Der Übergang ist nicht „Anwendung ruft Kernel, Kernel antwortet sofort“. Der Kernel kann einen Thread schlafen legen, andere Arbeit schedulen, I/O abschicken, auf Daten warten, Fehler zurückgeben, einen Signalhandler auslösen oder später eine Completion verarbeiten. Die Anwendung sieht oft nur Latenz, `errno`, Timeout oder abgebrochene Verbindung.

Ein Backendrequest kann gleichzeitig durch mehrere Warteschlangen gehen:

```text
socket accept -> user runtime queue -> syscall -> TCP receive queue
-> application parse -> database/network syscall -> NIC/driver/interrupt
-> remote service -> completion -> scheduler -> response write
```

Latenz ist damit Systemverhalten. Frameworkmetriken allein zeigen nicht immer, wo die Zeit verbrannt wird.

## Prerequisites und Dependencies

Diese Datei ist laut Masterplan ohne harte Vorbedingung. Für Vertiefung folgen:

- KB-0032 Prozesse, Threads und Scheduling;
- KB-0033 Virtueller Speicher und Page Faults;
- KB-0034 Filesystems, VFS und Block I/O;
- KB-0035 Sockets und Netzwerk-I/O;
- KB-0036 Namespaces und cgroups;
- KB-0037 Security, Credentials und Capabilities;
- KB-0038 eBPF und Kernelobservability;
- KB-0039 Performanceanalyse und Profiling;
- KB-0040–KB-0045 Linux-Operations- und Plattformthemen.

## Core Concepts

### 1. CPU-Modi und Privilegienwechsel

Auf üblichen Linux-Architekturen wird Anwendungslogik im weniger privilegierten User Mode ausgeführt. Kernelcode läuft im privilegierten Kernel Mode. Die genaue CPU-Mechanik ist architekturabhängig; das Sicherheitsprinzip bleibt: Ein Prozess kann nicht ohne kontrollierten Übergang Kerneloperationen wie Geräte-I/O, Page-Table-Verwaltung oder privilegierte Steuerung ausführen.

Ein System Call ist eine wohldefinierte Schnittstelle, etwa `read`, `write`, `openat`, `close`, `socket`, `connect`, `accept`, `fork`, `execve`, `mmap`, `futex`, `epoll_wait` oder `io_uring`-bezogene Aufrufe. Bibliotheken können Aufrufe kapseln, auf mehrere Calls abbilden oder manche Operationen rein im User Space erledigen. Für Diagnose und Security zählt die tatsächliche Kernelgrenze, nicht nur die Sprache/API.

### 2. System Call: Eingabe, Validierung, Arbeit, Ergebnis

```text
user code
  -> ABI / syscall number + arguments
  -> CPU transition to kernel entry
  -> argument/address/permission validation
  -> subsystem work or queueing
  -> return value / errno / later completion
  -> user-space runtime continues
```

Ein erfolgreicher Rückgabewert bedeutet nicht zwingend, dass eine entfernte Wirkung eingetreten ist. `write()` kann beispielsweise Bytes in einen Puffer übergeben; Übertragung, Persistenz oder fachliche Verarbeitung liegen später. Das ist für Eventing, Logging, Datenbanken und verteilte Systeme entscheidend.

### 3. Prozess, Thread und Address Space

Ein Prozess ist eine Ausführungseinheit mit PID, Credentials, virtueller Adressraumzuordnung, offenen Dateideskriptoren, Signalzustand und weiteren Kernelressourcen. Threads teilen typischerweise den Address Space und weitere Prozessressourcen, besitzen aber eigene Ausführungskontexte. Linux implementiert Aufgaben über `task_struct`; Nutzer sollten daraus keine stabile Userspace-API ableiten.

Für Architekturfragen gilt:

- Ein Prozesscrash trennt Speicher, aber nicht unbedingt externe Seiteneffekte.
- Threads brauchen Synchronisation für geteilten Speicher; ein „einfacher“ Block kann ganze Workergruppen beeinflussen.
- `fork()` erzeugt einen neuen Prozesskontext; `execve()` ersetzt das Programmimage, die PID bleibt laut man-pages erhalten.
- Dateideskriptoren sind prozessbezogene Handles, keine unendliche Ressource. Leaks führen zu `EMFILE`/`ENFILE`-artigen Fehlerbildern.
- Prozesse und Threads sind keine Container; Container nutzen Kernelisolation darüber.

### 4. Datei ist Interface, nicht nur Persistenz

Unix-artige Systeme modellieren viele Ressourcen über File Descriptors: reguläre Dateien, Pipes, Sockets, Geräte, Event-/Timer-/Signalquellen. `read`/`write`-ähnliche Schnittstellen können deshalb sehr verschiedene Semantik haben. Ein Byte-Stream-Socket hat andere Nachrichten- und Fehlereigenschaften als eine reguläre Datei oder ein Datagramm.

Das Prinzip „everything is a file“ ist eine nützliche Vereinfachung, aber keine vollständige Wahrheit. Nicht jede Operation ist seekbar, synchron, persistent oder gleichermaßen pollbar. Architektur muss die konkrete API-/Protokollsemantik betrachten.

### 5. Blocking, Nonblocking und Readiness

Ein Thread kann warten, weil Daten fehlen, eine Sperre belegt ist, I/O noch nicht vollständig verarbeitet wurde oder CPU-/Memorydruck besteht. Nonblocking I/O ändert die Steuerung: Ein Call kann `EAGAIN`/`EWOULDBLOCK` liefern, und die Anwendung wartet über Mechanismen wie `poll`, `epoll` oder andere Runtime-Abstraktionen auf Readiness.

**Readiness bedeutet nicht vollständige fachliche Verfügbarkeit.** Ein Socket kann lesbar sein, aber der Anwendungspuffer enthält erst Teilnachrichten. Ein Socket kann schreibbar sein, aber ein späterer Netzwerkfehler ist möglich. Daher benötigen Protokolle Framing, Timeouts, Backpressure, Abbruch und Fehlerbehandlung.

### 6. Interrupts, Ausnahmen und Deferred Work

Ein Interrupt signalisiert dem Kernel typischerweise ein asynchrones Ereignis von Hardware oder einem Controller, etwa eine Netzwerk-/Storagecompletion oder Timerereignis. Der Kernel muss diese Arbeit so behandeln, dass Latenz und Systemstabilität gewahrt bleiben. Viele Details sind Kernel-/Treiber-/Architekturabhängig. Für Anwendungsarchitektur genügt der Kernpunkt: CPU-Zeit und Antwortlatenz werden auch durch externe Ereignisse, IRQ-Verteilung, Softirq-/Deferred Work und Gerätewarteschlangen beeinflusst.

Eine CPU-Ausnahme, ein Page Fault oder ein System Call ist nicht dasselbe wie ein Hardwareinterrupt, kann aber ebenfalls einen kontrollierten Übergang zum Kernel auslösen. Begriffe nicht vermischen: Die Diagnose und zulässige Arbeit im jeweiligen Kontext unterscheiden sich.

### 7. Treiber und Device Model

Treiber verbinden Kernel-Subsysteme mit Hardware/virtuellen Geräten. Linux dokumentiert ein Driver Model mit Bus, Device, Driver und Binding. Beim Plattformmodell kann ein Device Ressourcen wie Adressen und IRQs haben; ein Treiber wird beim passenden Binding über `probe()` aktiviert. Dies ist Spezialistengebiet, beeinflusst aber Plattformdesign: NIC-, Storage-, GPU-, IOMMU-, vNIC-/vDisk- und Virtio-/Cloudgeräte besitzen Treiber- und Queueverhalten.

Für Container-/Cloudanwender folgt daraus:

- Ein Container sieht nur die vom Host und Runtime exponierten Geräte/Interfaces.
- Devicezugriff ist Security- und Isolationsthema, nicht nur ein Mount.
- GPU-/RDMA-/High-performance-Networking benötigt kompatible Hosttreiber, Runtime/Device Plugin, Berechtigungen und Versions-/Supportprüfung.
- Ein App-Team sollte nicht mit Hosttreiber-/IRQ-Tuning reagieren, bevor es Lastprofil, Anwendung, Netzwerk, Limits und Betriebsmethode geklärt hat.

## Architecture und Data Flow: Von einem HTTP-Request zum Kernel

### Beispiel: Backend liest Request und fragt einen Downstream-Service

```text
Client
  -> NIC / driver / receive queue / interrupt or polling mechanism
  -> kernel TCP/IP stack + socket receive buffer
  -> readiness notification / scheduler wakeup
  -> backend thread/event loop reads and parses request
  -> application authorization / business logic
  -> socket connect/write to downstream
  -> kernel network stack / NIC driver
  -> remote service
  <- response completion / wakeup
  -> app writes client response
```

Jede Stufe hat eigenes Failure- und Observabilityprofil:

| Stufe | Mögliche Störung | Nützliches Signal | Architekturreaktion |
|---|---|---|---|
| Listener/socket | accept backlog, FD exhaustion | connection errors, open FD count | limit, backpressure, graceful shedding |
| Runtime | blocked event loop, worker starvation | queue delay, thread state, CPU | avoid sync blocking, isolate workload |
| Kernel/Netz | retransmit, buffer pressure, DNS/route | TCP counters, latency, errors | timeouts, pooling, network diagnosis |
| Downstream | slow/failing service | dependency latency/error | deadline, circuit breaker, fallback |
| Driver/device | IRQ/queue/device issue | host/driver metrics, kernel logs | operator escalation, capacity/hardware review |
| App logic | oversized request, lock/contention | trace, profile, lock/wait evidence | bound input, concurrency design, optimize after proof |

### AI Runtime: Warum Kernelgrenzen wichtig sind

Eine AI-Runtime kann Modellprovider, lokale Inference, Retrieval, Tokenisierung, Netzwerk, Storage und GPU kombinieren. Schon ohne Kernelentwicklung müssen Architekten fragen:

- Wo entstehen CPU- versus GPU-Wartezeit?
- Welche Daten werden lokal/remote gelesen, gecacht, kopiert oder gemappt?
- Welche Socket-/HTTP-/gRPC-Timeouts begrenzen Provider- oder Toolaufrufe?
- Wie wirken cgroup CPU-/Memory-/PID-/Device-Limits?
- Sind File Descriptors, epoll-/event-loop-Kapazität oder Connection Pools begrenzt?
- Wie werden GPU Device/Driver/Runtime-Kompatibilität, Isolation und Scheduling als produktive Annahme verifiziert?
- Wie degradiert ein Workflow bei Device-, Provider- oder Memorydruck?

Ein reines Architekturkonzept ist nur Kontext für solche Fragen. Es ist keine Evidenz, dass diese Fragen in einem produktiven GPU-Cluster gelöst wurden.

## Protokolle, Standards und Technologien

| Bereich | Relevante Schnittstelle | Praktische Bedeutung |
|---|---|---|
| Linux UAPI | System Calls, `ioctl`, `/proc`, `/sys`, netlink, seccomp-/Landlock-APIs | Kernel/User-Space-Vertrag; Version/ABI nicht aus Annahmen ableiten. |
| POSIX/C Library | `open`, `read`, `write`, `fork`, `exec`, `pthread`, `errno` | Portabilitäts-/Programmiermodell; konkrete Linux-Erweiterung kenntlich machen. |
| Credentials | UID/GID, effective/saved IDs, capabilities, namespaces | Authentisierung im OS ist nicht gleich Anwendungsautorisation. |
| I/O | sockets, pipes, `epoll`, `mmap`, `io_uring` | Throughput-/Latency-/Backpressure-Design; Mechanismus an Workload messen. |
| Devices | PCI/USB/platform/virtio, driver model, sysfs | Host-/Cloud-/Containerdevicezugriff und Supportgrenzen. |
| Observability | `strace`, `/proc`, `ss`, `lsof`, perf, eBPF (später) | Hypothesen prüfen, nicht blind Systemparameter ändern. |
| Isolation | namespaces, cgroups, seccomp, LSMs | Container-/Sandbox-/Workloadgrenzen, später vertieft. |

Zeitabhängige Kernel- und Tooldetails werden mit Stand **2026-09-15** angegeben. Kernelversion, Distribution-Patches, Cloudkernel, Securitybackports, Container Runtime und Hardwaretreiber müssen in der Zielumgebung geprüft werden.

## Konfiguration und Implementierung

### 1. System Call bewusst behandeln

Pseudocode für einen robusten I/O-Pfad:

```text
set deadline
while bytes remain:
  n = write(fd, buffer)
  if n > 0:
    advance buffer
  else if interrupted:
    check cancellation/deadline and retry according to policy
  else if would_block:
    wait for readiness within deadline
  else:
    classify error, release resources, fail safely
```

Konkrete Semantik hängt von API, Sprache und Runtime ab. Wichtige Regeln:

- keine unendlichen Retries auf `EINTR`, `EAGAIN`, Netzwerk- oder Ressourcenfehler;
- Deadline statt nur einzelner Socket-/Librarytimeout;
- Idempotenz bei wiederholten Seiteneffekten oberhalb des Syscalllevels;
- Buffer-/Inputlimits, um Memory-/FD-/Queueangriffe zu begrenzen;
- immer `close`/defer/finally für Handles, auch in Fehlerpfaden;
- keine `errno`-Werte ohne Kontext loggen; Operation, Ziel, Correlation und Sicherheit beachten.

### 2. Prozess- und FD-Hygiene

```bash
# Lesende Diagnosebeispiele: nur im erlaubten, nicht produktiven Kontext
ps -eo pid,ppid,stat,comm
ls /proc/$$/fd
cat /proc/$$/status
```

Interpretation benötigt Vorsicht: Prozesse können sich zwischen Abfragen ändern; Container sehen ggf. einen Namespaceausschnitt; Berechtigungen beschränken Sicht. Die Befehle ändern nichts, sind aber keine vollständige Sicherheits-/Betriebsprüfung.

### 3. Container-/Runtime-Konfiguration: Denkfragen statt Copy/Paste

Für jede Workloadkonfiguration beantworten:

```yaml
workload:
  user: "non-root where compatible"
  resources:
    cpu: "explicit request/limit policy"
    memory: "explicit request/limit policy"
    pids: "bounded where supported"
  filesystem: "read-only where compatible; writable paths explicit"
  network: "egress/ingress according to policy"
  devices: "none by default; explicit reviewed exposure"
  shutdown:
    deadline: "grace period matches request/work queue semantics"
  observability:
    "process, FD, latency, error, resource and safe kernel signals"
```

Diese YAML ist kein universelles Kubernetes- oder Container Runtime Manifest. Sie ist eine Checkliste: konkrete Felder und Support sind distributions-, orchestrator- und workloadabhängig.

### 4. Von Symptom zu Kernelhypothese

```text
symptom: latency / timeout / crash / resource error
  -> scope: one pod, node, region, route, build or all?
  -> application signal: trace, error, queue, deployment change
  -> user-space state: process, threads, FDs, sockets, limits
  -> kernel/host signal: pressure, network/device errors, logs
  -> smallest safe mitigation: shed/rollback/limit/fallback
  -> root cause / system change: code, contract, capacity, policy, platform or driver escalation
```

Nicht mit `sysctl`, privileged containers, host networking, unlimited resources oder Kernelparameterexperimenten beginnen. Diese Eingriffe können Sicherheits- und Nachbareffekte haben.

## Scalability und Performance

### Kosten eines System Calls ist kein konstanter Wert

Der Übergang User↔Kernel hat Overhead, aber seine Bedeutung hängt von Workload, CPU, Cache, Arbeit im Kernel, Datenkopien, Kontextwechsel, I/O, Locking und Queueing ab. Eine hohe Callzahl ist nicht automatisch schlecht; eine Optimierung wie Batching, `io_uring`, `mmap`, busy polling oder Kernelbypass hat eigene Komplexitäts-, Security- und Betriebsfolgen.

### Performancefragen nach Workload

| Workload | Wahrscheinlicher Fokus | Anti-Pattern |
|---|---|---|
| HTTP/API | sockets, epoll/event loop, TLS, DNS, downstream, connection pool | jede Latenz dem Kernel zuschreiben |
| Event Consumer | polling, backpressure, FD/connection, idempotency, storage/network | endlose retries bei Queue-/Netzfehlern |
| Datenpipeline | page cache, files, block I/O, memory pressure, batch size | page cache als „freier“ Speicher deuten |
| AI Inference | CPU/GPU scheduling, memory, device drivers, I/O, token queues | GPUauslastung ohne End-to-End-Latenz/Cost optimieren |
| Container Platform | cgroups/namespaces, pid/FD limits, image/runtime, node pressure | Container als VM mit eigenem Kernel behandeln |

### Kapazitätsmodell

```text
end-to-end capacity =
min(CPU scheduling, memory availability, FD/socket limits,
    network queues, storage, downstream quotas, device capacity,
    application concurrency and safe error budget)
```

Ein einziger unbounded Pfad kann das System dominieren. Deshalb gehören Limits, Admission Control, Timeouts, Quota, Queue Age und Degradation in Backend-/Plattformarchitektur.

## Reliability und Failure Modes

| Failure Mode | Typisches Symptom | Diagnosehypothese | Sichere Reaktion |
|---|---|---|---|
| FD leak | `too many open files`, accept/connect failure | Handles nicht geschlossen, Pool/cleanup falsch | limit/rollback, leak suchen, close/finally, capacity nur nach Ursache |
| blocked workers | steigende Latenz/queue, wenig CPU | sync I/O, lock, downstream wait, GC/page fault | trace/thread state, deadline/backpressure, isolate blocking work |
| OOM / memory pressure | kill/crash, latency, reclaim | unbounded buffers/cache, cgroup limit, leak | bound input/concurrency, inspect limit, restart/rollback with evidence |
| PID exhaustion | process/thread creation fails | fork bomb, thread leak, no pids control | stop offender, pids bound, investigate creation path |
| TCP backlog/port pressure | refused/timeouts | accept/read/write/connections/ephemeral ports | load shed, connection policy, host/network review |
| DNS delay | request tails/errors | resolver, network, cache/timeout | cache carefully, deadline/fallback, diagnose resolver |
| signal handling fault | abrupt termination/retry issue | SIGTERM/SIGKILL, EINTR, shutdown race | graceful shutdown, cancellation/deadline, idempotency |
| driver/device fault | host errors, device disappearance, I/O timeouts | driver/firmware/device/virtualization | failover, operator escalation, supportable configuration |
| privilege error | `EPERM`/`EACCES` | UID/GID/capability/mount/LSM/seccomp | least-privilege policy review, no blanket privilege escalation |

### Graceful Shutdown

A deployment sends termination; the process needs to stop accepting new work, drain within a bounded deadline, cancel safely, flush only where contract requires it, close resources and exit. A `SIGKILL` cannot be gracefully handled. Architecture must make writes idempotent and consumers recoverable; kernel signals cannot guarantee business transaction completion.

## Security, Governance und Compliance

Kernel boundaries are security boundaries:

- Run processes with least privilege; root inside a container is not an automatic safe boundary.
- Prefer explicit non-root identity, read-only filesystem where compatible, minimal capabilities and no device exposure by default.
- Treat `CAP_SYS_ADMIN`, privileged containers, host namespaces, host PID/network, arbitrary mounts and kernel module access as high-risk decisions requiring explicit review.
- Separate OS identity from application/business authorization. UID/GID/capabilities do not decide whether a user may approve an invoice or execute a commerce action.
- Use seccomp, LSMs, Landlock or other controls only with tested, supportable policies; a permissive profile is not a security model.
- Redact sensitive args/payloads from syscall/tracing logs; process diagnostics can reveal paths, tokens, data or user identifiers.
- Track kernel/distribution lifecycle, security patches, driver compatibility and cloud-provider support as operational governance, not one-time installation work.

## Observability und Troubleshooting

### Signal hierarchy

```text
user impact / SLO
  -> application trace/metric/log
  -> process/thread/FD/socket state
  -> cgroup/container/node resource state
  -> kernel/network/device telemetry
  -> hardware/provider support path
```

Start from user impact and scope downward. A kernel metric without workload context can mislead; an application trace without host state can hide resource pressure.

### Safe first tools

| Tool/interface | Question | Boundary |
|---|---|---|
| `strace` | Which syscalls/errors/blocking patterns occur? | can add overhead; avoid indiscriminate production attachment; redact sensitive args. |
| `/proc/<pid>` | FDs, status, limits, maps, namespaces? | race-prone snapshot; permissions/namespaces limit view. |
| `ss` | Socket states and queues? | network namespace/context matters. |
| `lsof` | Which handles are open? | permissions/privacy; output can be large. |
| `journalctl` / kernel logs | Driver/kernel/OOM/cgroup messages? | access-controlled; logs may contain sensitive system detail. |
| `perf`/eBPF | CPU/stack/syscall/scheduling evidence? | specialist tool; overhead/security/kernel compatibility; later chapters deepen it. |

### Troubleshooting: API requests hang under load

1. Define scope: all pods/nodes or one; which release, route and downstream?
2. Verify safe rollout/rollback and protect users with deadline/degradation before deep host diagnosis.
3. Inspect application queue, thread/event-loop state, FD count, sockets and timeout errors.
4. Compare CPU, memory/cgroup pressure, network retransmit/queue and downstream latency.
5. If syscall evidence is needed, use limited, approved observation in a safe environment; never collect payloads by default.
6. Determine whether issue is app concurrency, contract/retry policy, resource limit, node/network/device or provider.
7. Fix system cause and add a guardrail: cap, timeout, test, alert, runbook, pool policy, capacity or escalation rule.

## Cost und FinOps

OS behavior affects unit economics:

```text
cost per qualified request =
compute time + memory footprint + network/storage I/O +
shared node/runtime + GPU/device allocation + operations/rework
--------------------------------------------------------------
qualified completed requests within quality/safety target
```

Examples:

- Busy retry loops burn CPU/API/provider spend without yielding value.
- Oversized memory limits reduce packing and raise node cost; too-small limits create OOM/restarts and rework.
- High connection churn, unbounded logs/traces and excessive data copies raise network/storage/observability cost.
- GPU device allocation is not equivalent to useful throughput; measure queue, batch, tail latency, quality and cost.
- A special kernel/driver/runtime choice adds support, patch, compliance and exit cost.

FinOps decision: use workload evidence, not a generic “make it faster/cheaper” target. Security and reliability constraints remain hard boundaries.

## Trade-offs und Anti-Patterns

| Trade-off | Bad shortcut | Better decision |
|---|---|---|
| Throughput / isolation | privileged container or host device access | minimal reviewed capability/device exposure and measured need |
| Async / complexity | make all I/O nonblocking blindly | match concurrency model to workload, ownership, cancellation and tests |
| Cache / memory | rely on page cache as free capacity | account for cgroup/working set/eviction and workload behavior |
| Retry / availability | retry every error forever | classify error, deadline, budget, backoff, idempotency and fallback |
| Optimization / supportability | kernel/sysctl tweak first | observe, bound, reproduce, change smallest safe layer |
| Observability / privacy | trace all syscalls/payloads | limited safe signals, access, redaction, retention |
| Container convenience / security | run root/privileged by default | least privilege, explicit exceptions and reviewed operational need |

Anti-patterns:

- Container with a shared host kernel described as a virtual machine.
- `kill -9` as normal shutdown policy.
- `ulimit`/resource value changed without workload/host/cgroup context.
- Treating `write()` as durable business commit.
- Ignoring partial read/write, `EINTR`, `EAGAIN`, cancellation and timeout.
- Increasing CPU/Memory because blocked threads lack diagnosis.
- Granting `CAP_SYS_ADMIN` to “make it work.”
- Reading sensitive `/proc`/trace data without access and retention design.
- Driver-/IRQ-/GPU-tuning copied from another kernel/hardware/cloud without support validation.

## Staff-, Principal- und Chief-Level Decisions

| Level | Linux-/Kernelentscheidung |
|---|---|
| Hands-on | Correct I/O/error/timeout/FD/signal handling; tests and safe diagnosis. |
| Architect | Choose concurrency, isolation, resource, device, observability and degradation boundaries for a workload. |
| Staff | Standardize runtime diagnostics, resource/timeout policy, templates, runbooks and review paths across teams. |
| Principal | Connect platform capacity, workload classes, SLO, transition and recurring failure patterns across programs. |
| Chief | Decide platform supportability, cloud/kernel/device policy, lifecycle/risk/cost strategy and specialist capability investment. |

A Chief does not personally tune every IRQ or kernel scheduler parameter; they ensure the organization has supportable configurations, ownership, observability, incident paths and specialist escalation.

## Production Checklist

### Runtime and API

- [ ] Workload has explicit deadlines, cancellation and bounded retry/backoff.
- [ ] File descriptors, sockets, buffers, threads/processes and queues have ownership and limits.
- [ ] Partial I/O, error classes, idempotency and graceful shutdown are tested.
- [ ] Blocking work cannot silently starve critical event-loop/worker capacity.
- [ ] Application authorization remains distinct from OS/container identity.
- [ ] `SIGTERM`/timeout/forced stop behavior matches data/side-effect contract.

### Platform and Security

- [ ] User/UID/GID, capabilities, filesystem, network, devices and namespaces are least-privilege reviewed.
- [ ] Container/host/kernel/distribution/driver versions and support lifecycle are known.
- [ ] cgroup/resource policy uses measured workload assumptions and safe failure behavior.
- [ ] Device/GPU/RDMA access has explicit owner, compatibility, isolation and rollback plan.
- [ ] Host-level tuning/privilege is exception-controlled, reviewed and documented.
- [ ] Secrets/sensitive payloads are not exposed through process/syscall diagnostic defaults.

### Operations and Economics

- [ ] SLO/SLI, process/FD/socket/resource signals, alert, runbook and escalation exist.
- [ ] Degradation protects user/data/security before aggressive troubleshooting.
- [ ] Cost model covers compute, memory, I/O, device, observability and support/exit.
- [ ] Capacity tests separate CPU, memory, network, storage and downstream constraints.
- [ ] Independent security/operations review is planned before production.
- [ ] Self-assessment, lab and production evidence levels remain visibly separate.

## Interviewfragen mit Modellantworten

### 1. What happens when an application calls `read()`?

**Modellantwort:** The process runs in user space and crosses into the kernel through a defined system-call interface. The kernel validates state and permissions, then may copy/return data, block until data is available, return an error or expose readiness through the chosen I/O model. The exact behavior depends on the descriptor type, flags, runtime and signal state. I would not assume the call implies a complete protocol message or an external business effect.

### 2. Why does a container not isolate the kernel?

**Modellantwort:** Containers use a shared host kernel. Namespaces change the view of resources and cgroups manage resource accounting/control, while security controls restrict privileges. A kernel or host-level vulnerability, privileged configuration, broad device exposure or incorrect namespace/capability policy can cross the intended boundary. I treat container configuration as a layered isolation design, not as a VM equivalent.

### 3. How would you diagnose high backend latency?

**Modellantwort:** I begin with user impact and scope, then application traces/errors/queues, process/thread/FD/socket state, cgroup/node pressure, network/downstream and only then host/kernel/device signals as needed. I establish deadline/degradation first. I form a hypothesis and use the smallest safe, privacy-aware observation. I avoid tuning sysctls or privileges before evidence points there.

### 4. What is the difference between a system call and an interrupt?

**Modellantwort:** A system call is an intentional user-to-kernel transition for a defined service. An interrupt is typically an asynchronous hardware event, such as device completion or timer activity. Exceptions/page faults also cross into the kernel but have different causes. All influence scheduling and latency; their handling constraints are not interchangeable.

### 5. What evidence supports your knowledge here?

**Modellantwort:** I name concrete artefacts — labs, repositories, ADRs, reviews, runbooks — and state their limits. Backend, integration or runtime projects can make OS/runtime questions relevant, but they do not by themselves prove kernel, driver, Linux production, GPU cluster, performance or incident operations. I use bounded labs and architecture artifacts to build this knowledge and state clearly which level (concept, lab, production) each claim reaches.

## Praktisches Lab: Syscall- und Runtime-Beobachtung ohne Hoständerung

### Ziel und Evidenzgrenze

**Status: reviewed_only.** Führe nur in einer eigenen, nicht produktiven Linux-VM, WSL-/Containerumgebung oder ausdrücklich freigegebenen Sandbox lesende Beobachtungen aus. Keine Kernelmodule, privilegierten Container, Hostnetworking, Device-Passthrough, sysctl-Änderungen oder Fremdprozesse verwenden.

### Aufbau

1. Schreibe ein kleines Programm oder verwende ein lokales Tool, das eine Datei öffnet, schreibt, liest und schließt; dokumentiere erwartete Deskriptor-/Syscallfolge.
2. Beobachte den eigenen Prozess gezielt mit einer begrenzten Syscallansicht oder `/proc/<pid>`; entferne/verdecke keine sensitiven Argumente nur scheinbar, sondern verwende Testpfade ohne Secrets.
3. Erzeuge einen lokalen Pipe-/Socket-Paar-Fall mit zeitbegrenztem Read und einer sauberen Timeout-/Cancellationbehandlung.
4. Vergleiche blocking und nonblocking Verhalten in einem kleinen, kontrollierten Beispiel. Dokumentiere `EAGAIN` als erwarteten Zustand, nicht als „Fehler verschwinden lassen“.
5. Öffne absichtlich mehrere Testdeskriptoren innerhalb eines sicheren kleinen Limits und prüfe Cleanup durch `close`.
6. Simuliere einen Downstreamtimeout mit lokalem Dummyserver; zeige Deadline, Backoffentscheidung, sichere Fehlermeldung und keinen unendlichen Retry.
7. Zeichne Context/Runtime View: Prozess, FD/Socket, Kernelgrenze, Datenfluss, Timeout, Signal/Shutdown und Observability.
8. Ergänze ein Runbook „Request hängt“ mit Scope, Signal, Hypothese, sicherer Mitigation und Eskalation.

### Negative Gegenproben

| Probe | Erwartete Beobachtung |
|---|---|
| Descriptor wird im Fehlerpfad nicht geschlossen. | FD-Zahl bleibt erhöht; Test/Routine muss Cleanup erzwingen. |
| Socketread wartet ohne Deadline. | Test zeigt unbounded wait; Design wird um Cancellation/Deadline ergänzt. |
| Nonblocking write ignoriert `EAGAIN`. | Daten/Progress gehen verloren oder Fehlerpfad ist unklar; Readiness-/Bufferlogik nötig. |
| SIGTERM während Arbeit. | Programm stoppt/unterbricht gemäß Design; echte Seiteneffektgarantie wird nicht behauptet. |
| Timeout führt zu sofortigen Endlosretries. | CPU/Log/Last steigt; Backoff/Budget/Circuit-Breaker wird ergänzt. |
| Trace enthält Testsecret. | Lab wird gestoppt; Testdaten/Redaction/Accessmodell korrigieren. |
| Container wird für Devicezugriff privilegiert. | Securitycheck verwirft den Schritt; keine Umgehung im Lab. |
| Kernel-/Driverwert wird ohne Hostkontext verändert. | Labplan verwirft Veränderung; dokumentiert nur Hypothese/Eskalationsweg. |

### Cleanup

Beende eigene Testprozesse sauber, schließe Handles, entferne Testdateien/-sockets/-logs und kontrolliere, dass keine Secrets oder realen Daten in Traceausgaben liegen. Alle Ergebnisse bleiben `reviewed_only`. Eine isolierte Syscallbeobachtung belegt keine Produktionsleistung, Kernelkompetenz oder Hardware-/Driverbetrieb.

## Dependencies und Cross-References

- KB-0032 – Prozesse, Threads und Scheduling
- KB-0033 – Virtueller Speicher und Page Faults
- KB-0034 – Filesystems, VFS und Block I/O
- KB-0035 – Sockets und Netzwerk-I/O
- KB-0036 – Namespaces und cgroups
- KB-0037 – Security, Credentials und Linux Capabilities
- KB-0038 – eBPF und Kernelobservability
- KB-0039 – Linux Performanceanalyse und Profiling
- KB-0550 – Platform Engineering und Developer Platform
- KB-0565 – Cloud Architecture und Landing Zones
- KB-0580 – AI Infrastructure, GPU und Inference
- KB-0720 – Integrierende Staff-/Principal-/Chief-Architekturpraxis

## Quellen und Aktualitätsnotizen

| Quelle | Verwendung | Stand |
|---|---|---|
| Dateikatalog 720 | Verbindlicher Scope zu Kernel/User Space, System Calls, Interrupts, Treibern, Privilegien und Backendlaufzeiten. | Planstand 2026-09-14 |
| [Linux Kernel User-space API guide](https://docs.kernel.org/userspace-api/index.html) | Kernel dokumentiert User-space-Schnittstellen, darunter System Calls, Security- und Device-I/O-APIs. | Abgerufen 2026-09-15 |
| [Linux Kernel IRQ documentation](https://docs.kernel.org/core-api/irq/index.html) | IRQ-Subsystem, Affinität und Mapping als Kernelkontext. | Abgerufen 2026-09-15 |
| [Linux Kernel Driver Model](https://docs.kernel.org/next/driver-api/driver-model/index.html) | Bus, Device, Driver und Binding im Driver Model. | Abgerufen 2026-09-15 |
| [Linux platform devices and drivers](https://docs.kernel.org/driver-api/driver-model/platform.html) | Plattformdevice-/Driver-Ressourcen, Probe/Remove und Bindingbeispiele. | Abgerufen 2026-09-15 |
| [Linux credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html) | Prozessidentitäten und Zusammenhang mit Prozesserzeugung/-steuerung. | Abgerufen 2026-09-15 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — Moderne Linux-UAPIs erweitern die Werkzeuge für sichere, performante Laufzeiten, erhöhen aber die Kernel-/Supportabhängigkeit.** Die offizielle Kernel-UAPI-Dokumentation umfasst unter anderem `io_uring`-nahe, eBPF-, seccomp-, Landlock-, futex2- und weitere Schnittstellen. **Reifegrad: unterschiedlich je API und Distribution.** Der Nutzen kann geringere Overheads oder stärkere Isolation bringen; Risiken sind Kernelversionsunterschiede, unzureichende Beobachtung und falsche Annahmen über Security. Ein Pilot prüft Kernel-/Distribution-/Runtime-Support, Fehlerpfade, Limits und Exit auf einer isolierten Umgebung vor Produktion. Quelle: [Linux Kernel User-space API guide](https://docs.kernel.org/userspace-api/index.html).

**Stand 2026-09-15 — Device- und IRQ-Affinität bleiben für hochdurchsatzfähige Storage-, Netzwerk- und AI-Systeme relevant, sind aber keine pauschale App-Optimierung.** Linux dokumentiert verwaltete IRQ-Affinität und die Verbindung mit Gerätequeues. **Reifegrad: Established als Kernel-/Treibermechanismus.** Der Nutzen entsteht bei nachgewiesener Host-/Device-Engpasslage; Risiken sind CPU-Isolation, falsche Verteilung, nicht supportete Cloudhardware und unklare Betriebshoheit. Ein Pilot beginnt mit Lastprofil, Hostmetriken, Supportmatrix und Operatorreview; keine zufällige Produktionsänderung. Quelle: [Affinity managed interrupts](https://docs.kernel.org/core-api/irq/managed_irq.html).

**Stand 2026-09-15 — eBPF-basierte Observability verlagert Diagnose näher an den Kernel, verlangt aber stärkere Datenschutz-, Sicherheits- und Betriebsdisziplin.** Sie kann Syscall-, Netzwerk- und Laufzeitsignale korrelieren, ohne jede Anwendung umzubauen. **Reifegrad: Adopting bis Established je Plattform.** Risiken sind Kernelkompatibilität, Overhead, sensitive Argumente, zu breite Privilegien und schwer interpretierbare Daten. Dieser Plan vertieft eBPF erst in KB-0038; bis dahin bleiben einfache, begrenzte User-Space- und Hostsignale der sichere Ausgangspunkt.

