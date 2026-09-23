---
{"id": "KB-0032", "title": "Prozesse und Lebenszyklen", "domain": "02", "sequence": 2, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["PLATFORM", "CLOUD", "GENAI", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0031", "concepts": ["Kernel/User-Space", "System Calls", "Credentials", "Signals und I/O-Grenzen"], "needed_for": "understanding"}], "related": ["KB-0033", "KB-0034", "KB-0035", "KB-0036", "KB-0037", "KB-0038", "KB-0039", "KB-0040", "KB-0041", "KB-0550", "KB-0565", "KB-0580", "KB-0720"], "applies": ["KB-0550", "KB-0565", "KB-0580", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein lokales, nicht produktives Lab beobachtet Eltern-/Kindprozesse, Exec, Exitstatus, Wait/Reaping, Signale und begrenzte Service-Shutdowns ohne Hoständerungen.", "rationale": "Die Prozesssemantik wird durch sichere, reproduzierbare Beobachtung und Gegenproben gelernt."}, "ARCHITECT-TARGET": {"active": true, "scope": "Backend-, Worker-, Container- und AI-Dienstarchitektur berücksichtigt PID-Ownership, Start/Readiness, Signalweiterleitung, Shutdown, Reaping, Exitcodes und Wiederanlauf.", "rationale": "Robuste Services behandeln den Prozesslebenszyklus als Teil ihres Vertrags."}, "STAFF-TARGET": {"active": true, "scope": "Teams erhalten Templates und Runbooks für Entrypoints, One-process/one-responsibility, Signalhandling, Health/Readiness, Grace Period, Child Reaping und Restartdiagnose.", "rationale": "Wiederkehrende Lifecyclefehler werden durch klare Standards und Tests reduziert."}, "CHIEF-TARGET": {"active": true, "scope": "Prozess- und Supervisorverhalten wird als Plattform-, Reliability-, Security-, Kosten- und Betriebsmodell in Standards und Sourcingentscheidungen berücksichtigt.", "rationale": "Chief-Ebene entscheidet supportbare Betriebsgrenzen, nicht die konkrete Implementation jedes Signalhandlers."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Init-/Supervisorimplementierung, PID namespaces internals, real-time process control, deep systemd/container-runtime behavior und kernel scheduler diagnostics sind Spezialistenvertiefungen.", "rationale": "Die Zielrollen müssen Wirkung, Risiken und Eskalation verstehen und bei Tiefe geeignete Experten einbinden."}}, "lab_validation": [{"lab_id": "KB-0032-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Geplantes lokales, nicht produktives Linux-/Containerlab mit eigenen Testprozessen", "evidence": "Der Artikel beschreibt sichere Beobachtungs-/Testschritte, erwartete Zustände, negative Proben und Cleanup. Es wurde kein echter Service Supervisor, Produktionshost, Containerorchestrator oder Prozesslimit verändert.", "limitations": "Keine Hostinit-, systemd-, cgroup-, PID-Namespace-, Container-Runtime- oder Cloudkonfiguration wurde ausgeführt oder als geprüft behauptet."}]}
---
# Prozesse und Lebenszyklen

> **Ziel:** Beherrsche die Lebensgeschichte eines Linuxdienstes: Er wird erstellt, erbt Kontext, lädt über `execve()` ein Programm, verarbeitet Arbeit, reagiert auf Signale, beendet sich mit Status und muss von einem zuständigen Elternprozess oder Supervisor beobachtet und gegebenenfalls neu gestartet werden. Diese Kette ist Teil der Zuverlässigkeit eines Backends, Workers, Containers und AI-Runtimes.

## Purpose, Definition und Scope

Ein Prozess ist eine Kernelrepräsentation eines laufenden Programms mit PID, Parent PID, Credentials, Adressraum, offenen Dateideskriptoren, Signalzustand und Ressourcen. Ein Prozess entsteht häufig aus `fork()` oder einer Runtime-/Supervisorabstraktion. `fork()` erzeugt ein Kind; `execve()` ersetzt im existierenden Prozess das ausgeführte Programmimage und kehrt bei Erfolg nicht zurück. Der Prozess muss bei Ende einen Status liefern, den ein Elternprozess mit `wait`/`waitpid`/`waitid` abholen kann. Ohne Reaping bleibt der Endstatus als Zombie erhalten.

Ein Dienstlebenszyklus umfasst mehr als diese Syscalls:

```text
create -> configure -> exec -> initialize -> readiness
-> serve/work -> drain -> terminate -> reap -> restart or retire
```

Die schwierigen Teile liegen an den Übergängen: Kindprozess nach `fork()` in multithreaded Code, geerbte File Descriptors, falsche PID-1-Semantik im Container, Signale nur an Wrapper statt an Worker, unausgeräumte Zombies, unendliche Restartschleifen, keine Readiness, abgebrochene Seiteneffekte bei Shutdown und fehlende Ownership für neu gestartete Dienste.

Scope: Fork, Exec, PID-Hierarchie, Zustände, Zombies, Signale, Supervisorverhalten und saubere Beendigung. Der Artikel vertieft nicht jede Init-System- oder Container-Runtime-Implementierung; er macht die Architektur- und Betriebsfolgen verständlich.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Fork/Exec/Wait, Parent/Child, Zombies, Signale, Shutdown und Restart können präzise erklärt werden. |
| HANDS-ON-TARGET | Ein lokaler Testprozess zeigt PID, Parent/Child, Exit, Wait und SIGTERM-Verhalten mit sicheren Gegenproben. |
| ARCHITECT-TARGET | Jede Servicearchitektur besitzt Start-, Readiness-, Work-, Shutdown-, Restart-, Daten-/Idempotenz- und Observabilityvertrag. |
| STAFF-TARGET | Teams haben gemeinsame Muster für Entrypoints, Grace Period, Health, Reaping, Stop/Restartdiagnose. |
| CHIEF-TARGET | Plattform-/Container-/Supervisorpolitik berücksichtigt Reliability, Security, Cost, Support und Risiken. |
| SPECIALIST-OPTIONAL | Init-/Runtimeinternals, systemd-/containerd-/Kubernetesdetails und Echtzeit-/Kernelsteuerung werden mit Spezialisten vertieft. |

## Mental Model: Der Prozessbaum als Verantwortungsbaum

```text
init / service manager / container runtime
                  |
                  v
         parent / supervisor (owns lifecycle)
           |             |
           v             v
      service process   helper/worker children
           |             |
           +--- reap exit status / restart policy ---+
```

Die wichtigste Frage ist nicht „Wer hat PID 1?“, sondern: **Wer beobachtet und verantwortet jeden Kindprozess?** Ein Parent, der ein Kind startet und nie wartet, kann Zombies ansammeln. Ein Wrapper, der Signale nicht weiterleitet, kann verhindern, dass der eigentliche Dienst sauber beendet wird. Ein Supervisor, der jeden Exit sofort neu startet, kann eine fehlerhafte Konfiguration in eine Restart-/Cost-/Logschleife verwandeln.

PID 1 hat innerhalb eines PID Namespace besondere Verantwortung, weil es Reaping/Signalverhalten und die Lebensdauer des Namespace beeinflusst. Details unterscheiden sich nach Runtime und müssen für die konkrete Plattform geprüft werden. Die sichere Architekturregel bleibt: Lifecycleownership, Signalweiterleitung und Reaping sind explizit.

## Prerequisites und Dependencies

| Abhängigkeit | Anwendung |
|---|---|
| [KB-0031 Linux Kernel und Systemaufrufe](01-linux-kernel-und-systemaufrufe.md) | Kernel/User-Space, Syscalls, Credentials, Signal-/I/O-Grenzen. |
| KB-0033 Virtueller Speicher und Page Faults | Fork-/Copy-on-write-/Memory- und OOM-Folgen. |
| KB-0035 Sockets und Netzwerk-I/O | Listener, Connection Workers, graceful draining. |
| KB-0036 Namespaces und cgroups | PID namespace, pids controller und Containergrenzen. |
| KB-0037 Security, Credentials und Capabilities | Prozessidentität, Privilegien und sichere Exec-/Service-Konfiguration. |
| KB-0040 Linux Service Management und Operations | systemd-/Supervisor-/Containeroperation vertiefen. |

## Core Concepts

### 1. `fork()` ist Kindprozess, nicht „neues Programm“

Die aktuelle Linux-man-page beschreibt, dass ein Kindprozess mit einer Kopie des virtuellen Adressraums und einer Kopie der offenen File Descriptors entsteht. Nach `fork()` in einem multithreaded Programm existiert im Kind nur der aufrufende Thread; bis zum `execve()` darf es laut Dokumentation nur async-signal-safe Funktionen aufrufen. Das ist eine wichtige, oft unterschätzte Fehlergrenze: Locks, Laufzeitbibliotheken und FD-Zustand können im Kind inkonsistent sein.

```text
parent process
  fork()
    -> parent receives child PID
    -> child receives 0
    -> both continue from same code point
child:
  minimal safe setup -> execve(new program) or _exit(error)
parent:
  supervise -> wait/reap -> classify exit
```

Für moderne Services ist ein direkter Fork häufig nur Teil einer Runtime oder eines Supervisors. Architekten müssen nicht jede Sprachebene umgehen, sollen aber erkennen, wann Child Creation, Worker Pools, Shell Wrappers oder Pre-Fork-Server diese Semantik berühren.

### 2. `execve()` ersetzt Programmimage

`execve()` führt bei Erfolg keinen neuen Prozess mit neuer PID aus. Es arrangiert, dass der bestehende Prozess ein anderes Programm ausführt; die PID bleibt nach man-pages erhalten. Viele Attribute ändern sich oder bleiben unterschiedlich erhalten, darunter behandelte versus ignorierte Signaldispositionen. Praktische Folge: Ein Prozessbaum, File Descriptor Inheritance, Credentials, Environment, Working Directory und `close-on-exec`-Verhalten sind Sicherheits-/Betriebsdesign, nicht nur Startupdetails.

**Anti-pattern:** Shell mit unsicherer Stringkonkatenation starten, um einen Worker auszuführen. Das verkompliziert Argumentescaping, Signalweiterleitung, Exitstatus, Prozessbaum und Injectionrisiko. Nutze strukturierte Exec-APIs und explizite Argumente, wenn ein Prozessstart wirklich nötig ist.

### 3. Parent, Child, Orphan und Zombie

- **Parent:** hat ein Kind geschaffen; kann dessen Zustand abholen.
- **Child:** führt eigene Arbeit aus und kann weitere Kinder erzeugen.
- **Zombie:** Prozess hat beendet, aber Exitstatus ist noch nicht vom Parent abgeholt. Er verbraucht keine normale Ausführungszeit, belegt aber Process-Table-/PID-Ressource bis zum Reap.
- **Orphan:** Parent ist beendet oder nicht mehr zuständig; Reparenting/Adoption hängt von Namespace/Init-/Subreaperkontext ab.
- **Reaping:** `wait`-Familie holt den Status eines Kindprozesses ab und entfernt den Zombieeintrag.

Ein Zombie ist kein „hängender Prozess“, sondern ein unbeobachteter Abschluss. Viele Zombies weisen auf einen Fehler in Lifecycleownership hin. Ein blindes Killen hilft nicht; der Parent muss korrekt warten oder ein passender Supervisor/Subreaper muss zuständig sein.

### 4. Prozesszustände richtig lesen

Werkzeuge wie `ps` zeigen Zustandskürzel. Diese sind Momentaufnahmen und Kernel-/Tooldarstellungen, keine vollständige Ereignisgeschichte. Häufige Kategorien:

- laufend/ausführbar;
- interruptible sleep (wartet auf Ereignis und kann häufig durch Signal unterbrochen werden);
- uninterruptible sleep, oft I/O-bezogen (nicht automatisch „Kernel hängt“);
- stopped/traced;
- zombie.

Die konkrete Bedeutung und Sichtbarkeit variiert. Architektur- und Incidentdiagnose verbindet Prozesszustand immer mit I/O, Locks, CPU, Memory, cgroup, Netzwerk, Downstream und Changehistory.

### 5. Signale sind asynchrone Steuerungsereignisse

Signale können von Kernel, Terminal, Supervisor oder einem anderen berechtigten Prozess stammen. `SIGTERM` ist übliche Bitte zur geordneten Beendigung; ein Prozess kann sie behandeln, ignorieren oder default handeln. `SIGKILL` kann nicht gefangen oder aufgeräumt werden. `SIGCHLD` informiert einen Parent über Zustandsänderungen von Kindern. Signaldisposition ist pro Prozess, Signalmaske pro Thread; process-directed signals können an einen unmaskierten Thread geliefert werden.

Eine Anwendung darf aus `SIGTERM` nicht ableiten, dass alle Businessaktionen sicher abgeschlossen sind. Sie braucht einen Shutdownvertrag: keine neue Arbeit annehmen, In-flight Work nach klarer Deadline drainen oder abbrechen, Seiteneffekte idempotent machen, Status/Telemetry setzen, Handles schließen und mit eindeutigem Exitcode enden.

### 6. Supervisor ist Policy, nicht Magie

Ein Supervisor kann Start, Environment, Logs, Restart, Ressourcen, Signalweitergabe und Zustandsbeobachtung steuern. Ob systemd, Container Runtime, Orchestrator oder Sprache/Process Manager: Sein Contract muss beantwortet werden:

- Was ist der Hauptprozess?
- Wie wird Readiness/Liveness/Failure unterschieden?
- Welche Signale werden an welche Prozessgruppe weitergegeben?
- Wie lange ist Graceful Shutdown erlaubt?
- Wann und wie oft wird neu gestartet?
- Wie werden Exitcodes/Crashs klassifiziert?
- Wer reapt Kinder?
- Welche Logs/Metrics/Events belegen Lifecycle?
- Wann wird ein Crashloop angehalten und eskaliert?

Ein Restart ist nicht immer Recovery. Bei Konfigurationsfehler, Datenmigration, fehlerhaften Secrets, unzulässiger Berechtigung oder korruptem State kann er Schaden und Kosten verstärken.

## Architecture und Data Flow: Service Lifecycle eines Workers

```text
image/binary + config + identity
             |
             v
supervisor starts main process
             |
             v
process initializes dependencies / validates config
             |
          readiness gate
             |
             v
accept work -> execute with deadline/idempotency -> emit state/metrics
             |
      SIGTERM / deployment / failure
             |
             v
stop intake -> drain/cancel -> persist/compensate as contract requires
             |
             v
close resources -> exit code -> parent reaps
             |
             +--> supervisor: stop / restart / backoff / alert / escalate
```

### Design Example: Event Worker

| Phase | Contract | Failure concern |
|---|---|---|
| Start | validates config, identity, contract/version and dependency reachability bounded by deadline | startup hides missing secret/provider; restart loop |
| Ready | consumes only after dependencies/observability can support it | liveness confused with business readiness |
| Work | bounded batch/concurrency; idempotent processing; lease/offset semantics | duplicate, in-flight side effect, backpressure |
| Terminate | stop fetch, finish/abort within deadline, commit only valid work | SIGTERM races with commit/ack |
| Exit | structured reason/exitcode, metrics/trace flush within limit | abrupt exit/no reaping/no diagnosis |
| Restart | classified backoff and alert, not unconditional loop | poison message/config issue burns capacity/cost |

### PID and Container Boundary

```text
host init
  -> container runtime
       -> PID namespace init / entrypoint
            -> application
                 -> worker children
```

If an entrypoint launches a shell which launches the app without `exec`, the shell can become the signal recipient while the app does not receive/handle shutdown as expected. This is an archetypal lifecycle bug. The correct design is platform-specific but should make the intended main process and signal/reaping chain explicit.

## Protokolle, Standards und Technologien

| Thema | Bedeutung |
|---|---|
| `fork(2)` | Kindprozesssemantik, FD-/Address-Space-Vererbung, multithreaded Grenze. |
| `execve(2)` | bestehender Prozess lädt neues Programm; PID-/signal-/environment implications. |
| `wait`/`waitpid`/`waitid` | Parent erhält Child-State und reapt Exitstatus. |
| `signal(7)` / `sigaction` | Signaldisposition, masks, process-/thread-directed delivery. |
| process groups/sessions | Signal-/job-control-/supervisorgrenzen. |
| `/proc`, `ps`, `pstree` | beobachtbare Prozess-/Parent-/State-Sicht, mit Snapshotgrenzen. |
| system/service manager/container runtime | konkrete Supervisorpolicy, unbedingt distributions-/platformspezifisch validieren. |
| cgroups/PID namespaces | Prozesszahl, Sicht, OOM/kill-/container lifecycle; spätere Vertiefung. |

## Konfiguration und Implementierung

### 1. Sicheres Child-Management-Pseudocode

```text
pid = fork()
if pid == 0:
  close/redirect only intended descriptors
  execve(program, argv, envp)
  _exit(error)          # exec failed; do not run parent cleanup
else:
  register child ownership
  while child not reaped:
    status = waitpid(pid, ...)
    classify exit / signal / retry policy
```

Dies ist Lehrpseudocode, nicht eine vollständige Multithreading-/Security-/Runtime-Implementierung. In multithreaded Prozessen nach `fork()` gelten besondere async-signal-safety-Grenzen; bevor eine eigene Implementierung entsteht, wähle eine sichere Laufzeit-/Process-Manager-API oder ziehe Spezialreview hinzu.

### 2. Shutdown State Machine

```text
RUNNING
  --SIGTERM--> DRAINING
DRAINING
  --completed before deadline--> CLEAN_EXIT
  --deadline/unsafe work--> CANCEL_OR_COMPENSATE -> EXIT
RUNNING
  --fatal error--> EXIT_FAILURE
supervisor
  --classified exit--> STOP | BACKOFF_RESTART | ESCALATE
```

Konfigurationselemente, die je Plattform überprüft werden:

```yaml
service:
  main_process: "one explicit executable or reviewed init wrapper"
  stop_signal: "documented"
  grace_period: "matches longest safe unit of work, bounded"
  readiness: "separate from process running"
  restart:
    policy: "classified exits, bounded rate/backoff"
    alert_after: "defined failed attempts/time window"
  resources:
    pids: "bounded where supported"
  observability:
    lifecycle_events: "start, ready, drain, exit, restart, reason"
```

### 3. Exitcodes als Vertrag

Exitcodes sind nicht universell standardisiert für jeden Dienst, aber ein Team kann sie konsistent klassifizieren:

- clean stop;
- retryable/transient dependency failure;
- configuration/identity/policy failure;
- data/contract incompatibility;
- unrecoverable bug/panic;
- operator-requested shutdown.

Ein Supervisor darf diese Klassen nicht blind vertrauen. Logs, config state, backoff, alert und Humanentscheidung bleiben nötig.

## Scalability und Performance

### Prozessmodell nach Workload wählen

| Modell | Vorteil | Risiko |
|---|---|---|
| Ein Prozess, async event loop | geringe Prozesswechsel, viele I/O-Operationen | blocking code blockiert Loop; cancellation/CPU work schwierig |
| Multiple workers/processes | isolation, CPU parallelism, crash blast radius | memory/FD/port/child/reaping/coordination cost |
| Thread pool | shared memory, low creation overhead | lock/contention, no automatic crash isolation |
| External queue + stateless workers | elastic scale, delivery isolation | duplicate/ordering/lease/offset/shutdown complexity |
| Pre-fork workers | controlled worker count | complex inherit/FD/multithread semantics |

Prozessanzahl ist nicht Durchsatzgarantie. Sie interagiert mit CPU quotas, memory, pids limits, cache, network connections, storage, downstream quotas und operational support.

### Backpressure statt Fork-Storm

Bei Last oder Fehlern kann unkontrolliertes Spawnen von Prozessen/Threads PID-, Memory- und FD-Limits erreichen. `fork(2)` kann unter anderem an cgroup PID limits oder Memorydruck scheitern. Gute Systeme begrenzen concurrency, Queue Age, batch size, retries und restart rate und machen Überlast sichtbar.

## Reliability und Failure Modes

| Failure | Symptom | Ursache | Response |
|---|---|---|---|
| zombie accumulation | `Z` states, PID/resource pressure | parent never waits | fix owner/reaping; restart parent only with impact analysis |
| orphaned children | work continues after supervisor exit | wrong process group/wrapper/ownership | explicit child lifecycle, subreaper/supervisor design |
| signal swallowed | deployment hangs/forced kill | shell/wrapper doesn't forward | `exec` or signal-aware init/wrapper; test termination |
| crash loop | repeated restarts/log/cost burn | config/secret/data/panic/policy | bounded backoff, classify, alert, halt/escalate |
| false readiness | traffic before dependencies safe | only process alive checked | readiness contract with bounded checks |
| unsafe drain | duplicates/lost work | acknowledgement/side effect race | idempotency, leases, transactional/outbox pattern |
| hard kill data loss | SIGKILL ends process | deadline too short/hang | bound work, safe recovery, avoid relying on cleanup |
| fork in MT trap | child hangs/corrupts state | locks/runtime state after fork | exec immediately or redesign/review |
| PID exhaustion | fork/thread fails | leak/storm/no pids bound | WIP/concurrency/pids control, diagnose source |

### Supervisor Runbook: Crashloop

1. Stop automatic amplification: apply bounded backoff, reduce intake, protect data/users.
2. Identify scope: deployment/version/config/secret/node/namespace, not just the latest exit.
3. Read lifecycle signals: exit status, signal, startup phase, readiness, child tree, FD/PID/resource/error.
4. Classify: transient dependency versus permanent config/security/data/code.
5. Roll back, correct config/identity/contract or isolate poison work; do not simply increase restart count.
6. Confirm reaping, readiness and shutdown behavior after recovery.
7. Add alert, test, contract/ADR/runbook and ownership evidence.

## Security, Governance und Compliance

Process lifecycle is security-relevant:

- Use explicit executable/arguments; avoid untrusted shell interpolation.
- Keep inherited FDs minimal and use close-on-exec policy where appropriate; accidental inherited listening sockets, pipes or secrets are boundary leaks.
- Run as least-privilege service identity; separate OS UID/GID/capabilities from business authorization.
- Restrict environment, working directory, writable paths, devices and network according to workload policy.
- Treat supervisor config and entrypoints as supply-chain/configuration artifacts; review images/binaries, configs and dependency versions.
- Do not make process inspection, core dumps, traces or logs broadly accessible; they can include paths, environment, tokens or user data.
- Restart policies must not bypass security/identity failure: a missing/invalid secret should alert and remain bounded, not hammer an identity provider.

## Observability und Troubleshooting

### Lifecycle Signals

| Signal | Question |
|---|---|
| PID/PPID/process tree | Who owns this child, and is the intended main process alive? |
| state/exit status/signal | Did it exit, stop, crash, wait or become zombie? |
| start/ready/drain timestamps | Which lifecycle phase is slow or failing? |
| restart count/backoff | Is recovery bounded or amplifying failure? |
| FD/PID/thread counts | Leak, process storm, inherited descriptor or resource exhaustion? |
| queue/in-flight/ack state | Can shutdown duplicate, lose or strand work? |
| SLO/error/latency | What user impact exists beyond process status? |
| config/identity/version | Is failure tied to change, secret, contract or deployment? |

### Troubleshooting: Service ignores termination

1. Verify whether the intended app process, a shell wrapper or init is PID target.
2. Inspect process tree and platform signal policy in an approved environment.
3. Confirm how SIGTERM is handled, whether children receive it and whether threads block shutdown.
4. Check whether work intake stops and whether deadline/cancellation is bounded.
5. Ensure worker/task contracts tolerate cancellation/restart through idempotency/recovery.
6. Use forced kill only as availability/safety containment; record possible side effects.
7. Correct entrypoint/signal forwarding/readiness/drain/runbook and add a termination test.

## Cost und FinOps

Lifecycle bugs create direct cost:

```text
cost of lifecycle failure =
restart compute + repeated initialization + duplicate work +
log/trace volume + downstream retries + support/incident +
lost or delayed business work
```

Examples: a crashloop repeatedly initializes a model client and consumes tokens; a worker restarts before ack and duplicates tasks; a process leak prevents node packing; an overly long grace period holds capacity but may protect data. FinOps decision should weigh cost with safety, correctness, recovery and user impact. A cheap forced kill can be expensive if it duplicates payments or corrupts state.

## Trade-offs und Anti-Patterns

| Trade-off | Bad choice | Better approach |
|---|---|---|
| Fast stop / correct stop | immediate kill as normal | bounded drain/cancel/idempotent recovery, forced kill only containment |
| Simple wrapper / lifecycle correctness | `sh -c` wrapper ignores process tree | explicit executable or reviewed signal-aware init |
| Restart / diagnosis | restart forever | classify exit, backoff, alert, stop/escalate permanent failure |
| One process / helper need | arbitrary background children | explicit ownership/reaping or robust supervisor |
| Liveness / readiness | process exists = ready | dependency-/contract-/operation-aware readiness |
| Scale / resources | fork/thread until busy | bounded concurrency/PID/memory/queue and backpressure |
| Logs / privacy | dump environment/process data | minimal/redacted access-controlled lifecycle evidence |

## Staff-, Principal- und Chief-Level Decisions

| Level | Decision |
|---|---|
| Hands-on | implement cancellation, deadlines, exit handling, child wait, health and tests. |
| Architect | select worker/process/supervisor model, define lifecycle/side-effect contract and failure boundaries. |
| Staff | create templates/runbooks for entrypoints, signals, readiness, drain, restart and diagnosis. |
| Principal | align lifecycle behavior across services, platforms, migrations and recurring incident patterns. |
| Chief | set supported runtime/supervisor policy, platform reliability investment, risk/cost boundaries and specialist ownership. |

## Production Checklist

- [ ] Main process, parent/child ownership, process group and supervisor are explicit.
- [ ] Start, readiness, work intake, shutdown, exit and restart states have contracts and signals.
- [ ] SIGTERM, deadline, cancellation, forced-stop recovery and idempotency are tested.
- [ ] Children are reaped; zombie/orphan/process-tree behavior is observed.
- [ ] Exit statuses are classified with backoff, alert and escalation policy.
- [ ] Concurrency, threads, PIDs, FDs, queue and memory are bounded.
- [ ] Entrypoints avoid unreviewed shells and unintended FD/environment inheritance.
- [ ] OS identity, secrets, diagnostics and supervisor configuration meet security policy.
- [ ] SLO, lifecycle events, runbook and incident ownership exist.
- [ ] Cost of restart, duplicate work, grace period and operation is included.
- [ ] Independent platform/security/operations review is planned before production.
- [ ] Self-assessment/lab/real production evidence stays distinct.

## Interviewfragen mit Modellantworten

### 1. Explain `fork()` and `execve()`.

**Modellantwort:** `fork()` creates a child execution context; the parent and child continue from the fork point with different return values. The child initially inherits copies of relevant context such as address space and file descriptors. `execve()` then replaces the current process program image; on success it does not return, and it does not create a new PID. In a multithreaded parent the child should only call async-signal-safe functions until exec, so I prefer managed APIs or immediate exec patterns.

### 2. What is a zombie and how do you fix it?

**Modellantwort:** A zombie has already terminated but its parent has not collected its status through the wait family. It is a lifecycle ownership failure, not a running CPU task. I identify the parent, correct reaping or supervisor behavior, and assess restart impact. Killing the zombie does not solve the uncollected status; blindly restarting a service may affect children and in-flight work.

### 3. How do you shut down a queue worker safely?

**Modellantwort:** Stop intake, record readiness/draining, allow bounded in-flight work to finish or cancel according to an idempotent/lease/ack contract, release resources, exit with a classified status and let the supervisor reap it. SIGTERM alone is not transaction completion. I test termination during each phase and document forced-kill recovery.

### 4. What does your existing evidence demonstrate here?

**Modellantwort:** Project work around integrations, workflows or runtime design provides limited technical context at best. On its own it does not demonstrate production supervisor, Linux, container or incident responsibility. I name concrete artefacts and their limits rather than claiming depth. I treat process lifecycle as an explicit hands-on and architecture learning target with bounded lab evidence.

## Praktisches Lab: Parent, Child, Signals und Reaping

### Ziel und Evidenzgrenze

**Status: reviewed_only.** Verwende nur eigene lokale Testprozesse in einer nicht produktiven Linux-/WSL-/VM-/Sandboxumgebung. Kein PID namespace, cgroup, Hostinit, systemd service, produktiver Container oder fremder Prozess wird manipuliert.

### Schritte

1. Erstelle ein kleines lokales Programm/Script, das einen Childprozess startet, PID/PPID ausgibt, auf dessen Ende wartet und den Exitstatus protokolliert.
2. Vergleiche Child mit `exec` gegen Child, das nur weiterläuft; dokumentiere PID-/Programm-/Parentbezug ohne sensible Daten.
3. Lass das Kind kontrolliert mit Erfolg und Fehlerstatus enden; prüfe, dass der Parent beide Fälle reapt und klassifiziert.
4. Starte ein begrenztes Testkind, sende nur diesem eigenen Prozess SIGTERM und beobachte einen definierten Drain/Exitpfad.
5. Simuliere Timeout/Childhang mit kurzer harter Begrenzung und dokumentiere, dass forced kill keine fachliche Garantieleistung ist.
6. Zeichne Prozessbaum, Start-/Ready-/Drain-/Exit-State-Machine, Ownership und Runbook.
7. Schreibe einen „crashloop“-Simulator nur als Dokument/Mock; erhöhe keine echten Restartlimits oder Hostressourcen.
8. Lege negative Tests und Cleanup an.

### Negative Gegenproben

| Probe | Erwartung |
|---|---|
| Parent startet Child, ruft kein wait. | Theorie/Mock zeigt Zombiegefahr; kein echter Prozessleak im Lab stehen lassen. |
| Wrapper fängt SIGTERM, leitet nicht weiter. | Testdesign zeigt, warum Prozessbaum/Supervisorpolicy wichtig ist. |
| Child erzeugt Seiteneffekt vor Abruch. | Idempotency/recovery contract muss vorher existieren. |
| Restart auf Konfigurationsfehler. | Runbook klassifiziert als Stop/Eskalation, kein unendlicher Loop. |
| Fork nach mehreren Threads. | Lab dokumentiert async-signal-safety Grenze; keine unsichere Implementation behaupten. |
| SIGKILL als Normalpfad. | Review verwirft, weil Cleanup/Transaktionsgarantie fehlt. |
| Process log enthält secret. | Lab stoppt und korrigiert Testdaten/Redaction/Access. |
| PID/FD count steigt nach Test. | Cleanup/Handle-/child management fehlgeschlagen, erst korrigieren. |

### Cleanup

Alle Testprozesse mit ihrem sicheren Pfad beenden, abwarten/reapen, Testdateien/-logs löschen und prüfen, dass keine Hintergrundkinder, Zombies, Tokens oder sensitiven Daten zurückbleiben. Das Lab belegt keine produktive Supervisor-/Container-/Cloudkompetenz.

## Dependencies und Cross-References

- [KB-0031 – Linux Kernel und Systemaufrufe](01-linux-kernel-und-systemaufrufe.md)
- KB-0033 – Virtueller Speicher und Page Faults
- KB-0035 – Sockets und Netzwerk-I/O
- KB-0036 – Namespaces und cgroups
- KB-0037 – Security, Credentials und Linux Capabilities
- KB-0040 – Linux Service Management und Operations
- KB-0550 – Platform Engineering und Developer Platform
- KB-0565 – Cloud Architecture und Landing Zones
- KB-0580 – AI Infrastructure, GPU und Inference
- KB-0720 – Integrierende Staff-/Principal-/Chief-Architekturpraxis

## Quellen und Aktualitätsnotizen

| Quelle | Verwendung | Stand |
|---|---|---|
| Dateikatalog 720 | Scope: Fork, Exec, PID-Hierarchien, Zombies, Prozesszustände, Supervisor und Dienstbeendigung. | Planstand 2026-09-14 |
| [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html) | Fork-, multithreaded-/async-signal-safe-, FD- und PID-limit-Semantik. | Abgerufen 2026-09-15 |
| [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html) | `execve()` ersetzt bei Erfolg das Programmimage; PID bleibt erhalten. | Abgerufen 2026-09-15 |
| [wait(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html) | Warten auf und Abholen von Child-Zustandsänderungen. | Abgerufen 2026-09-15 |
| [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html) | Signaldisposition, Signalmaske, Thread-/Prozesszustellung und Exec-Folgen. | Abgerufen 2026-09-15 |
| [credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html) | PID/PPID und Beziehung zu `fork`/`execve`. | Abgerufen 2026-09-15 |
| [Linux Kernel documentation](https://docs.kernel.org/) | Primärdokumentation des Linux-Kernels, mit Verweis auf Userspace- und Administrationsthemen. | Abgerufen 2026-09-15 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — Prozesslebenszyklen werden in modernen Plattformen zunehmend als deklarativer Contract modelliert.** Container- und Orchestrierungsplattformen kombinieren Entrypoint, Health/Readiness, Grace Period, Ressourcen, Restart Policy und Observability. **Reifegrad: Established für grundlegende Mechanismen; implementations- und distributionsabhängig.** Das senkt manuelle Supervisorarbeit, kann aber falsche Signal-/PID-/Restartannahmen verbergen. Ein Pilot testet explizit Prozessbaum, SIGTERM, Drain, Exitcode, Backoff und Recovery statt nur „Container läuft“.

**Stand 2026-09-15 — Workload Identity und kurzlebige Credentials verschieben Startupfehler in sichere, aber anspruchsvollere Lifecycle-Gates.** Dienste holen bei Start oder Laufzeit Identität/Token; fehlende oder rotierte Credentials müssen klar von transienten Netzwerkfehlern unterschieden werden. **Reifegrad: Adopting bis Established je Plattform.** Risiko sind Crashloops, blindes Retry und Secrets in Logs. Ein Pilot klassifiziert Identityfehler, begrenzt Restart, redigiert Diagnosen und definiert Owner/Eskalation.

**Stand 2026-09-15 — AI-Worker verstärken die Bedeutung idempotenter Shutdown- und Restartverträge.** Lange Inference, Streaming, Toolcalls und Queuearbeit können bei Abbruch Kosten, Duplikate oder unklare Seiteneffekte erzeugen. **Reifegrad: Adopting.** Ein robuster Designpfad trennt Read-only-Ausgabe, idempotente Commands, Human Gate, Lease/Ack und sichere Degradation. Ein Lab beginnt ohne echte Toolaction und prüft Termination mitten im Workflow.

