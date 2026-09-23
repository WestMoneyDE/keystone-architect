---
{"id": "KB-0033", "title": "Threads und Parallelität", "domain": "02", "sequence": 3, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["PLATFORM", "CLOUD", "GENAI", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0032", "concepts": ["Prozesslebenszyklus", "PID-/TID-Kontext", "Signale", "Ressourcen- und Lifecycleownership"], "needed_for": "understanding"}], "related": ["KB-0031", "KB-0034", "KB-0035", "KB-0036", "KB-0037", "KB-0038", "KB-0039", "KB-0040", "KB-0410", "KB-0550", "KB-0580", "KB-0720"], "applies": ["KB-0410", "KB-0550", "KB-0580", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein lokales, isoliertes Lab modelliert eine begrenzte Work Queue, cancellation, join, Timeout, Race und Deadlock-Gegenprobe ohne Produktionsdaten oder Hosttuning.", "rationale": "Nebenläufigkeit wird durch beobachtbare Invarianten, negative Tests und sauberes Cleanup statt durch vermutete Geschwindigkeit gelernt."}, "ARCHITECT-TARGET": {"active": true, "scope": "Architekturen definieren Concurrency-Budget, Ownership, Dateninvarianten, Queuegrenzen, Cancellation, Backpressure, Retry, Idempotenz und Isolation pro Workload.", "rationale": "Nebenläufige Komponenten bleiben nur dann zuverlässig, wenn ihr gemeinsamer Zustand und ihre Abbruchsemantik Teil des Designs sind."}, "STAFF-TARGET": {"active": true, "scope": "Teams erhalten Standards für Thread-/Task-Pools, strukturierte Concurrency, lockfreie Zustandsvermeidung, Korrelation, Profiler-Nutzung und reproduzierbare Last-/Failure-Tests.", "rationale": "Ein gemeinsames Modell verhindert, dass lokale Parallelisierung eine systemweite Contention- oder Duplikatlast erzeugt."}, "CHIEF-TARGET": {"active": true, "scope": "Plattform-, Sprach-, Runtime- und Computeentscheidungen berücksichtigen Supportmodell, Sicherheitsgrenzen, Latenz-/Durchsatzprofile, Kosten, Entwicklerproduktivität und Betriebsrisiko.", "rationale": "Chief-Ebene setzt Entscheidungskriterien und Governance für Parallelität; sie implementiert keine Anwendungssperren im Detail."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Memory-model-Beweise, lock-free Algorithmen, Kernel-Scheduler, NUMA, Real-Time Scheduling, eBPF-Scheduleranalyse, JVM-/runtimeinternals und GPU-Kernelparallelität sind Spezialistenvertiefungen.", "rationale": "Die Zielrollen müssen Risiken, Messgrenzen und Eskalationsbedarf erkennen und für tiefe Optimierung spezialisierte Expertise einbinden."}}, "lab_validation": [{"lab_id": "KB-0033-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Geplantes lokales, isoliertes Lab mit eigenen Testdaten und einer begrenzten Work Queue", "evidence": "Der Artikel enthält Ablauf, Invarianten, Race- und Deadlock-Gegenproben, Messpunkte und Cleanup. Der Ablauf wurde konzeptionell gegen die Quellen- und Fehlergrenzen geprüft.", "limitations": "Keine Thread-Affinität, Priority, Schedulerklasse, cgroup-, Container-, Produktions- oder GPU-Konfiguration wurde ausgeführt oder als gemessen behauptet."}]}
---
# Threads und Parallelität

> **Ziel:** Entwirf und diagnostiziere Nebenläufigkeit als begrenztes System: mehrere Ausführungsstränge teilen Prozessressourcen, konkurrieren um CPU, Speicher und externe Abhängigkeiten und brauchen explizite Ownership, Synchronisation, Cancellation, Backpressure und Beobachtbarkeit. Mehr Threads bedeuten weder automatisch mehr Parallelität noch mehr Durchsatz.

## Purpose, Definition und Scope

Ein **Thread** ist ein Ausführungsstrang innerhalb eines Prozesses. POSIX beschreibt mehrere Flows of Control in einem gemeinsamen Address Space: Threads teilen globale Daten, Heap, Prozessidentität, offene File Descriptors und weitere prozessweite Attribute; jeder Thread besitzt dagegen eigenen Stack und Ausführungskontext. Linux-NPTL bildet Pthreads typischerweise 1:1 auf Kernel-Scheduling-Entities ab und verwendet für umkämpfte Synchronisation Futexe. Diese Implementierungsdetails erklären viele Beobachtungen, sind aber kein Freibrief, Anwendungsarchitektur aus Kernelmechanik abzuleiten.

**Nebenläufigkeit** bedeutet, dass mehrere Arbeitseinheiten zeitlich überlappen können. **Parallelität** bedeutet, dass sie tatsächlich gleichzeitig auf verschiedenen Rechenressourcen laufen. Ein einzelner CPU-Kern kann viele Threads nebenläufig fortschalten, ohne ihre CPU-Arbeit parallel auszuführen. I/O-lastige Workloads profitieren oft von überlappender Wartezeit; CPU-lastige Workloads werden durch zu viele ausführbare Threads oft langsamer, weil Scheduling, Context Switches, Cacheeffekte und Contention steigen.

Dieser Artikel behandelt Kernelthreads, Synchronisation, Kontextwechsel, Race Conditions, Thread-Pool-Grenzen, Cancellation und Diagnose. Er ersetzt keine Spezialistenanalyse von Memory Models, Real-Time-Scheduling, NUMA oder lockfreien Algorithmen. Der Schwerpunkt liegt auf den Entscheidungen, die Platform-, Cloud- und GenAI-Architekturen zuverlässig machen.

### Lernziele

Nach diesem Kapitel kannst du:

1. Thread, Task, Prozess, Nebenläufigkeit und echte CPU-Parallelität präzise unterscheiden.
2. Shared State, Invarianten, Critical Sections und Memory Synchronization im Design sichtbar machen.
3. Mutex, Condition Variable, Semaphore, Read-Write Lock, Barrier und Queue nach ihrer Semantik auswählen.
4. Race, Deadlock, Livelock, Starvation, Thread Leak, Pool Exhaustion und Priority Inversion diagnostisch einordnen.
5. Ein Concurrency-Budget für API-, Worker- und AI-Inference-Workloads aus Abhängigkeiten und Ressourcen ableiten.
6. Staff- und Chief-Entscheidungen zu Runtime, Standards, Messung und Rollout begründen.

## Kompetenzstatus: Nachweis, Konzeptwissen und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Thread-Ownership, Shared State, Synchronisation, Backpressure, Cancellation und Failure Modes können anhand von Invarianten erklärt werden. |
| HANDS-ON-TARGET | Ein isoliertes Lab erzeugt kontrolliert Race- und Shutdownsituationen und bewertet Korrektheit vor Durchsatz. |
| ARCHITECT-TARGET | Jeder parallele Pfad hat Auftrag, Budget, Timeout, Abbruchweg, Shared-State-Regel, Fehlerklassifikation und Messpunkte. |
| STAFF-TARGET | Teams verwenden wiederverwendbare Structured-Concurrency- und Pool-Templates, testen negative Fälle und messen Sättigung. |
| CHIEF-TARGET | Runtime- und Plattformstandards schaffen sichere Defaultgrenzen, statt unbegrenzte Parallelisierung in Produktteams zu verlagern. |
| SPECIALIST-OPTIONAL | Lock-free, Memory Ordering auf Maschinenebene, Scheduler-/NUMA-/Realtime-Tuning und GPU-Parallelität werden bei Bedarf spezialisiert vertieft. |

## Mental Model: Nebenläufigkeit ist ein Vertrag über Ownership

```text
              request / job / event
                       |
       deadline, tenant, priority, trace context
                       v
              bounded admission gate
                       |
           +-----------+-----------+
           |                       |
           v                       v
     CPU-/I/O-Task A         CPU-/I/O-Task B
           |                       |
       immutable input       private state
           |                       |
           +---- controlled handoff / queue ----+
                       |
                 single owner of mutation
                       |
                  durable result / ack
```

Die zentrale Architekturfrage lautet nicht „Wie viele Threads?“, sondern:

> **Welche Arbeit besitzt welchen Zustand, wie wird sie beendet, und welche gemeinsame Invariante darf sie verändern?**

Eine gute Antwort beginnt mit einem Owner. Eine Request-Task besitzt nur ihren Requestkontext. Ein Queue Consumer besitzt ein Lease oder eine Nachricht bis Ack/Nack. Ein Aggregator besitzt die Mutation eines bestimmten Key-Shards. Ein Pool besitzt seine Worker, Queuekapazität und Stop-Reihenfolge. Ohne Owner wird die Sperre zum zufälligen Ersatz für ein fehlendes Datenmodell.

**Invariante vor Mechanik:** Vor der Wahl von `mutex`, atomarem Zähler oder Queue schreibe die Wahrheit auf, die erhalten bleiben muss. Beispiele:

- Ein Auftrag wird höchstens einmal als *committed* markiert.
- Die verfügbare Kapazität eines Tenants wird nie negativ.
- Eine Antwort gehört genau zu einem Korrelationsschlüssel.
- Nach Shutdown werden keine neuen externen Seiteneffekte begonnen.
- Ein `ack` erfolgt erst, wenn die persistente Wirkung bestätigbar ist.

Die Synchronisation erzwingt dann diese Invariante. Sie ist nicht die Invariante selbst.

## Prerequisites und Dependencies

| Abhängigkeit | Warum sie hier gebraucht wird |
|---|---|
| [KB-0032 Prozesse und Lebenszyklen](02-prozesse-und-lebenszyklen.md) | Prozess-/Thread-Lifecycle, Signals, Ressourcenownership und Shutdownkontext. |
| [KB-0031 Linux Kernel und Systemaufrufe](01-linux-kernel-und-systemaufrufe.md) | Kernel/User-Space, Blockierung, Privilegien und Syscallgrenzen. |
| KB-0034 Virtueller Speicher und Page Faults | Stacks, Shared Heap, Copy-on-write, Speicherpressure und OOM-Folgen. |
| KB-0035 Sockets und Netzwerk-I/O | I/O-Wartezeit, Connection Handling, Timeouts und Draining. |
| KB-0036 Namespaces und cgroups | CPU-/Memory-/PID-Grenzen verändern beobachtbare Parallelität. |
| KB-0038 Linux Performance Analysis und eBPF | Profiler, Scheduler-Wartezeit und Contention messen statt raten. |
| KB-0410 Durable Workflows und Distributed Coordination | Lokale Threadparallelität ersetzt keine verteilte Idempotenz oder Koordination. |
| KB-0580 AI Infrastructure, GPU und Inference | CPU-Threading, Batching, GPU-Queues und Requestcancellation müssen gemeinsam budgetiert werden. |

## Core Concepts

### 1. Prozess, Thread, Task und Coroutine sind verschiedene Grenzen

| Begriff | Typische Bedeutung | Was wird geteilt? | Typische Ownershipfrage |
|---|---|---|---|
| Prozess | OS-Isolations- und Fehlergrenze | innerhalb des Prozesses definierte Ressourcen | Wer startet, beendet und reapet ihn? |
| Kernelthread | vom OS schedulbare Ausführungseinheit | Prozessadressraum und Prozessressourcen | Wer besitzt Stack, Abbruch und Join? |
| Runtime Task / Coroutine | sprach- oder runtimeverwaltete Arbeitseinheit | abhängig von Runtime; oft weniger OS-Threads als Tasks | Wo kann sie blockieren, cancellieren oder hängen? |
| Worker | dauerhafter Konsument von Arbeit | Pool-/Queue-/Clientressourcen | Wie begrenzt, drainiert und ersetzt er sich? |
| Request | fachliche Arbeitseinheit | Requestkontext und bisweilen Cache/Clients | Wann ist sie abgebrochen, idempotent oder abgeschlossen? |

Verwechsle diese Ebenen nicht. Ein Java Virtual Thread oder eine Go-Routine kann viel günstiger als ein OS-Thread sein, löst aber weder externe Connection Limits noch Datenrennen noch unendliche Fan-outs. Ein Kubernetes Pod kann zehn Threads haben; ein Thread kann wiederum mehrere asynchrone Tasks koordinieren. Das Concurrency-Budget wird daher auf jeder Ebene begrenzt und korreliert.

### 2. Shared Memory erzeugt Leistungspotenzial und Beweispflicht

Threads teilen Heap und globale Daten. Das vermeidet explizite IPC-Kopien, erzeugt aber eine Beweispflicht: Lesen und Schreiben desselben veränderlichen Zustands muss korrekt koordiniert sein. Eine **Data Race** liegt vor, wenn konkurrierende, nicht ausreichend synchronisierte Zugriffe auf denselben veränderlichen Ort stattfinden und mindestens einer schreibt. Die konkrete sprachliche Definition variiert, aber die Entwurfsfolge ist universell: Ein beobachtetes „funktioniert meistens“ ist kein Korrektheitsbeweis.

Ein scheinbar atomarer Ausdruck wie `counter = counter + 1` umfasst konzeptionell Lesen, Rechnen und Schreiben. Zwei Threads können denselben alten Wert lesen und ein Update verlieren. Ebenso gefährlich sind mehrteilige Invarianten:

```text
if capacity > 0:
    capacity = capacity - 1
    allocate(resource)
```

Die Invariante betrifft Test, Dekrement und Allokation zusammen. Eine einzelne atomare Variable schützt nicht automatisch die fachliche Transaktion mit externem System.

### 3. Kontextwechsel ist kein kostenloses Scheduling

Ein Context Switch speichert den Zustand eines laufenden Threads und stellt den eines anderen wieder her. Relevante Kosten entstehen durch Schedulerarbeit, Cache-/TLB-Lokalität, Lock-Contention, Wakeups und verlorene CPU-Cachewärme. Diese Kosten hängen von Host, Kernzahl, Runtime, Workload, CPU Quota, cgroups, I/O und Abhängigkeiten ab. Deshalb sind Aussagen wie „N Threads pro Core“ nur Ausgangshypothesen.

Linux erlaubt CPU-Affinität pro Thread; die effektive Menge wird zusätzlich durch verfügbare CPUs und `cpuset`-Einschränkungen begrenzt. Affinität kann Cachemigration reduzieren, bindet aber Betrieb und Schedulability an eine konkrete Topologie. Für normale Cloud- und Application-Workloads ist sie keine erste Optimierung. Erst messen, dann mit Plattformowner und Supportmatrix entscheiden.

### 4. Synchronisation ordnet Speicher und Zugriff

POSIX.1-2024 beschreibt, dass Mutex-Lock/Unlock und das Freigeben/Wiedererlangen eines Mutex beim Condition Wait Speicher synchronisieren. Das erlaubt eine klare Regel: Der Zustand wird unter dem dazugehörigen Mutex geprüft und verändert; die Condition Variable signalisiert **Zustandsänderung**, nicht die Sache selbst.

```text
lock(m)
while predicate is false:
    wait(condition, m)      // atomically releases m, later reacquires it
consume or mutate predicate
unlock(m)
```

Das `while` ist Pflichtdenken, keine Stilfrage. Ein Wakeup bedeutet nicht, dass die fachliche Bedingung nun wahr ist: Ein anderer Consumer kann sie bereits konsumiert haben, ein Broadcast weckt mehrere Wartende, ein Timeout oder eine Unterbrechung kann eintreten. Die Bedingung wird unter dem Lock neu geprüft.

### 5. Join, Detach und Cancellation sind Lifecycleverträge

Ein erzeugter joinable Thread behält Ressourcen, bis er gejoint oder detached wird. POSIX empfiehlt für jeden joinable Thread schließlich `pthread_join()` oder `pthread_detach()`, damit zugehöriger Speicher zurückgewonnen werden kann. In Managed Runtimes heißen die Mechanismen anders, doch der Vertrag bleibt: Wer Tasks startet, besitzt ihr Ende und kennt ihr Ergebnis.

**Cancellation** ist eine Aufforderung, kein magischer Rollback. Sie muss kooperativ sein:

1. Parent setzt Cancel-/Deadline-Signal.
2. Child prüft an sicheren Punkten und beendet neue Arbeit.
3. Laufende I/O hat eigene Timeouts und kann abgebrochen werden, soweit der Client es unterstützt.
4. Child publiziert einen eindeutigen Endzustand.
5. Parent joinet/awaitet oder eskaliert nach Grace Period.
6. Fachliche Seiteneffekte werden über Idempotency Key, Outbox, Lease oder Compensation abgesichert.

Unkontrolliertes „Thread töten“ kann Locks, Speicher, Logik und externe Transaktionen in einem unklaren Zustand lassen. Bevorzugt werden strukturierte Taskbäume, in denen Parent und Children gemeinsam beendet und beobachtet werden.

### 6. Bounded Concurrency ist ein Schutzvertrag

Ein Worker Pool besteht nicht nur aus `N` Threads. Er braucht:

```text
admission -> bounded queue -> workers -> dependency clients -> result/ack
          ^                  |                 |
          |                  +-- timeout ------+
          +-- reject/defer/retry/dlq ----------
```

Wichtige Grenzen:

- **Admission:** Wie viele neue Requests/Jobs werden pro Tenant, Priorität und Zeit akzeptiert?
- **Queue:** Wie viele Elemente und Bytes sind erlaubt? Was geschieht bei voll?
- **Pool:** Wie viele gleichzeitig aktive CPU-/I/O-/GPU-Operationen?
- **Dependency:** Wie viele DB-, HTTP-, LLM-, GPU- oder Storage-Requests gleichzeitig?
- **Timeout:** Wann wird Arbeit nicht mehr sinnvoll begonnen?
- **Result:** Wann gilt Arbeit als erfolgreich, retrybar, abzubrechen oder zu kompensieren?

Little’s Law hilft als Plausibilitätscheck: `L = λ × W`. Bei steigender mittlerer Wartezeit `W` wächst die Zahl gleichzeitiger Aufgaben `L` bei gleicher Ankunftsrate `λ`. Unbegrenzte Queues verstecken Überlast nur als Latenz, Speicherverbrauch und späteren Ausfall. Ein Pool ist daher ein Lastregler, nicht nur ein Beschleuniger.

## Architecture und Data Flow: Bounded Request- und Worker-Parallelität

Ein robustes Muster für API, Retrieval, Tool-orchestrierung oder Batch Worker trennt CPU, I/O und externe Seiteneffekte.

```text
client/event
    |
    v
[admission + auth + tenant quota]
    | reject/defer with visible reason
    v
[request coordinator]
    | creates deadline, trace, idempotency key
    +----> [bounded I/O task group] ---> retrieval / HTTP / DB
    |                   |                        |
    |                   +--- cancellation -------+
    |
    +----> [bounded CPU task group] ---> parse / rank / transform
    |
    v
[single-writer or keyed shard]
    | validates invariant; persists outbox/result
    v
[ack / response / follow-up]
```

### Schrittweise Daten- und Kontrollflussanalyse

1. **Eingang:** Authentifizierung, Tenant, Requestgröße, Priorität und Deadline werden festgelegt. Kein unbounded Spawn vor diesen Prüfungen.
2. **Admission:** Eine volle Kapazität führt zu definierter Ablehnung, Verzögerung oder asynchroner Annahme. „Wir probieren es trotzdem“ verlagert Fehler in Abhängigkeiten.
3. **Fan-out:** Der Koordinator startet nur begrenzte Teilaufgaben. Jede Teilaufgabe erhält immutable Input, korrelierte Telemetrie und ein Child-Deadlinebudget.
4. **Handoff:** Ergebnisse werden über klare Ownership übergeben. Bei shared mutation nutzt der Entwurf einen Schlüssel-Shard, Actor/Single Writer oder kurze Critical Section.
5. **External I/O:** Clientpools und Semaphoren begrenzen jede Abhängigkeit separat. Ein 100-Thread-App-Pool darf nicht 1000 gleichzeitige Datenbankverbindungen erzwingen.
6. **Join:** Der Koordinator sammelt Erfolg, partielle Fehler, Timeout und Cancellation. Er entscheidet nach fachlicher Policy: fail-fast, degrade, quorum, retry later oder compensate.
7. **Commit/Ack:** Dauerhafte Wirkung wird vor Ack bestätigt; volatile In-memory-Parallelität ist kein Delivery-Nachweis.
8. **Shutdown:** Admission schließt zuerst, Warteschlangen werden nach Policy drainiert, Child-Tasks bekommen Cancellation, Abhängigkeiten schließen zuletzt und der Prozess beendet sich erst nach definiertem Restzustand.

### GenAI-Beispiel: Retrieval plus Modellaufruf

Eine GenAI-Anfrage enthält oft parallelisierbare Retrievalquellen, Re-Ranking, Sicherheitsfilter, Model Calls, Tool Calls und Streaming. Das verleitet zu unbounded Fan-out. Ein besseres Modell hat getrennte Budgets:

| Ressource | Sinnvolle Grenze | Warum |
|---|---|---|
| Retrieval | kleine, zeitbegrenzte Teilmenge | verhindert Fächerung in Vector-/Search-Backends |
| Re-Ranking | CPU/GPU- oder API-Semaphore | schützt Latenz und Kosten |
| Modellaufruf | Provider-/Deployment-Concurrency | respektiert Rate, GPU Queue und Spend |
| Tool Calls | per Tool und Tenant begrenzt | begrenzt Seiteneffekte und Blast Radius |
| Streaming | Connection- und Outputbudget | schützt Memory und Clientressourcen |
| Orchestrierung | Anfragebaum + Deadline | ermöglicht Cancellation und Diagnose |

Die Reihenfolge ist fachlich: Zuerst Safety/Policy und Budget, dann Arbeit. Ein abgebrochener Stream muss Toolaction nicht automatisch abbrechen oder weiterlaufen lassen; der Vertrag benennt es explizit.

## Protokolle, Standards und Tools

### POSIX Threads und Linux-Grundlagen

| Artefakt | Relevanz | Architektursicht |
|---|---|---|
| POSIX.1-2024 Threads | Threadmanagement, Synchronisation, Thread-Safety, Memory Synchronization | Portabler Semantikrahmen; konkrete Runtime trotzdem testen. |
| `pthreads(7)` | Linux-NPTL, 1:1-Threadmodell, `clone(2)`, Futexbezug | Erklärt Linuxverhalten, ersetzt kein Sprachruntimewissen. |
| `futex(7)` | user-space fast path, Kernelarbitration bei Contention | Höhere Locks bauen meist darauf auf; Endanwendungen verwenden sie selten direkt. |
| `pthread_join()` | Lifecycle und Ressourcenrückgabe | Spawn ohne Join/Detach ist ein Leakrisiko. |
| `sched_setaffinity(2)` | per-thread CPU-Affinität | Spezialwerkzeug nach Messung und Supportprüfung. |

### Geeignete Werkzeuge nach Frage

| Frage | Werkzeugklasse | Beispielfrage |
|---|---|---|
| Haben wir Korrektheit? | Unit-/Property-/Race-/Failure-Test | „Kein Auftrag wird doppelt committed.“ |
| Wo ist Zeit? | Trace, Profiler, CPU/Wall-Clock Flamegraph | „Wartet der Request auf Lock, I/O oder CPU?“ |
| Ist der Pool voll? | Queue-/Semaphore-/Executor-Metrik | „Wie lang und wie alt ist die Warteschlange?“ |
| Wer blockiert wen? | Thread Dump, Lock-/Wait-Analyse | „Welcher Lockowner verhindert Progress?“ |
| Warum steigt CPU? | Profiling + Scheduler-/Containerkontext | „Sind Threads runnable, throttled oder spinning?“ |
| Warum bricht Durchsatz ein? | Dependency-Metriken + Sättigung | „Ist die App oder die DB/LLM-Gateway-Grenze voll?“ |

Werkzeuge sind runtimeabhängig: Java besitzt Thread Dumps und JFR; Go hat `pprof`, Trace und Context; .NET hat EventPipe/PerfView-Ökosystem; Python, Node.js und Rust haben jeweils eigene Profiler und Concurrency-Modelle. Ein Plattformstandard beschreibt Messziele und sichere Erfassungswege, nicht nur eine Toolliste.

## Konfiguration und Implementierung

### 1. Der kleinste hilfreiche Concurrency-Contract

Dokumentiere pro Komponente mindestens:

```yaml
workload: retrieval-coordinator
owner: search-platform
concurrency:
  admission_per_tenant: bounded
  in_flight_requests: bounded
  io_fanout: bounded
  cpu_workers: measured_and_bounded
  external_dependency_limits:
    vector_search: bounded
    reranker: bounded
    llm_gateway: bounded
queue:
  capacity_items: explicit
  capacity_bytes: explicit
  full_behavior: reject_or_defer
time:
  request_deadline: explicit
  child_deadline_budget: explicit
  graceful_shutdown: explicit
correctness:
  shared_state_owner: keyed_single_writer
  idempotency_key: required_for_side_effects
  ack_after: durable_commit
observability:
  required_metrics: [queue_depth, queue_age, active_work, rejected, cancelled, dependency_wait]
```

Die Werte sind absichtlich nicht als universelle Zahlen vorgegeben. Sie entstehen aus Lastprofil, CPU/Memory, Containerquota, Dependencylimits, SLO, Fehlermodell, Kosten und Testmessung. Für jeden Wert braucht es Owner, Grundannahme und Re-Evaluation-Trigger.

### 2. Synchronisationswahl

| Bedarf | Bevorzugter Mechanismus | Achtung |
|---|---|---|
| Eine kurze, lokal geteilte Mutation | Mutex mit kleiner Critical Section | kein I/O oder Remote Call im Lock |
| Auf Zustandsänderung warten | Condition Variable plus Predicate und Mutex | immer Predicate erneut prüfen |
| Begrenzte gleichzeitige Nutzung | Semaphore / Capacity Limiter | Freigabe bei Fehler und Cancellation garantieren |
| Viele Leser, seltene Writer | Read-Write Lock oder immutable Snapshot | Messung; Fairness und Writer Starvation prüfen |
| Phasenabschluss | Barrier / Join / Task Group | dynamische Teilnehmer und Cancellation beachten |
| Nachricht an Consumer | Bounded Queue / Channel | Kapazität und Full-Policy explizit |
| Keybezogene Mutation | Sharding, Actor, Single Writer | Hot Key und Rebalancing beobachten |
| Verteilte Nebenläufigkeit | Persistente Lease, idempotenter Command, Transaktion/Outbox | lokaler Mutex schützt nur einen Prozess |

Eine **Sperre über I/O** ist meist ein Anti-Pattern. Sie koppelt Latenz einer Abhängigkeit an alle Wartenden und macht Timeout-/Cancellationsemantik kompliziert. Besser: State reservieren/markieren, Lock freigeben, I/O ausführen, Ergebnis anhand eines Version-/Lease-/Idempotenzvertrags bestätigen.

### 3. Lockordering und Deadlockprävention

Wenn mehrere Locks unvermeidbar sind, definiere eine globale Ordnungsrelation, zum Beispiel `tenant -> account -> job`. Jeder Pfad nimmt Locks in dieser Reihenfolge. Ergänze:

- keine unbekannten Callbacks unter Lock;
- keine verschachtelten Locks ohne Designreview;
- Zeitbudget für Lock Acquisition nur mit klarer Fehlerpolicy;
- keine Synchronisation über zufällige globale Objekte;
- Lockname und Owner in Dumps/Telemetrie sichtbar;
- atomare Multiobjektoperationen durch Datenmodell oder Partitionierung vereinfachen.

### 4. Safe Pseudocode: bounded worker group

```text
function handle(request):
  ctx = child_context(request.deadline, request.trace, request.tenant)
  permit = admission.try_acquire(ctx)
  if permit is absent:
      return overloaded_with_retry_hint()

  try:
      result = task_group(ctx, max_children = policy.io_fanout)
          .run_each(bounded_inputs(request), child -> {
              return call_dependency(child.context, child.input)
          })
          .join_using(policy.partial_failure_rule)

      return commit_if_current_and_idempotent(request.idempotency_key, result)
  finally:
      permit.release()

on_shutdown:
  admission.close()
  cancel_root_after(grace_period)
  await_workers_to_join_until(deadline)
  close_clients_after_work_is_quiescent()
```

Dieses Beispiel abstrahiert Sprache und Runtime. Die entscheidenden Eigenschaften sind begrenzte Admission, vererbte Deadline/Trace/Identity, kontrolliertes Fan-out, bekannte Joinpolicy, idempotenter Commit und determinierter Shutdown.

### 5. Sprache ist eine Implementierungsentscheidung, kein Sicherheitsargument

- **OS-/Platform Threads:** sinnvoll für echte CPU-Arbeit und FFI/Blocking-APIs; teuer genug, um Pools und Stack-/Memorybudget zu brauchen.
- **Async/Coroutines:** gut für I/O-Überlappung; gefährlich, wenn blockierende Calls den Event Loop oder Runtime Worker festhalten.
- **Green-/Virtual Threads:** vereinfachen Request-per-Task-Stil bei vielen Wartenden; sie beseitigen keine DB-/LLM-/CPU-Grenze. JEP 444 beschreibt Virtual Threads als in JDK 21 gelieferte leichte Threads; sie sollen pro Aufgabe erstellt und nicht wie Platform Threads gepoolt werden.
- **Actor/Single Writer:** reduziert Shared-Memory-Fehler über Ownership; Mailboxen bleiben begrenzt, und Hot Keys werden zu Engpässen.
- **Process Isolation:** eignet sich bei Fehler-/Securitygrenzen oder nicht thread-sicheren Bibliotheken; sie erhöht IPC- und Betriebsaufwand.

## Scalability und Performance

### Amdahl, Warteschlangen und die falsche Metrik

Für CPU-Parallelität begrenzt der serielle Anteil die Beschleunigung. Amdahl ist kein Produktionsmodell, aber ein nützlicher Einwand gegen „wir erhöhen einfach Workers“. Bei I/O-lastiger Last ist oft nicht CPU, sondern Abhängigkeitswartezeit entscheidend. Ein System kann hohen Durchsatz melden und zugleich unbrauchbare Tail-Latency produzieren.

Miss mindestens:

| Ebene | Kernmetriken | Interpretation |
|---|---|---|
| Admission | accepts, rejects, deferred, tenant fairness | Überlast wird kontrolliert oder versteckt. |
| Queue | depth, age, bytes, oldest item | Wartezeit und Memoryrisiko. |
| Execution | active workers, runnable/waiting, task duration | Poolauslastung und Workshape. |
| Locks | acquisition wait, hold time, contention, timeout | Shared-state-Engpass und Lock-I/O. |
| CPU | utilization, throttling, context-switch tendency | CPUarbeit, Quota oder Overcommit. |
| Dependencies | connections in use, pending, latency, errors | Engpass außerhalb des App-Pools. |
| Correctness | duplicate suppression, stale lease, cancellation outcome | Leistung ohne Wahrheitsverlust. |
| Cost | CPU-seconds, memory, accelerator time, retries | Parallelität kann Kosten vervielfachen. |

### Kapazitätsmodell als Hypothese

1. Klassifiziere Arbeit als CPU, I/O, external-service, GPU oder gemischt.
2. Ermittle pro Klasse Servicezeit, p50/p95/p99, Fehlerquote und Ressourcenverbrauch unter repräsentativer Last.
3. Setze **separate** Limits pro begrenzender Abhängigkeit.
4. Bestimme eine Queue- und Full-Policy, die SLO und Datenhaltbarkeit respektiert.
5. Erzeuge Last bis zu kontrollierter Sättigung und beobachte, ob Reject/Defer früher eintreten als Timeouts, OOM oder Kaskadenfehler.
6. Dokumentiere das Ergebnis als Bereich mit Annahmen, nicht als ewige Zahl.
7. Wiederhole bei Runtime-, Modell-, Node-, Containerquota-, Dependency- oder Trafficänderung.

### GenAI-/Inference-Trade-off

Ein Modellgateway kann viele wartende Netzwerkrequests aufnehmen, während die Inference-GPU nur wenige sinnvolle aktive Sequenzen oder Batches verarbeitet. Höhere Appthreadzahl kann dann Queueing, KV-Cache-Druck, Providerfehler und Kosten erhöhen. Das richtige Budget sitzt am Engpass: Admission, Token-/Requestbudget, Batch-/Queuepolicy, Modellgateway und Tenantfairness. Anwendungs-CPUthreads werden danach dimensioniert, nicht umgekehrt.

## Reliability und Failure Modes

| Fehlerbild | Typisches Symptom | Ursache | Design- und Betriebsantwort |
|---|---|---|---|
| Race Condition | seltene falsche Werte, Duplikate, verlorene Updates | ungeschützter Shared State | Invariante definieren, Ownership/Lock/Atomics prüfen, deterministische Gegenprobe bauen |
| Deadlock | Tasks hängen, Durchsatz fällt auf null | zyklische Locks, Callback/I/O unter Lock | Lockorder, Dumps, Timeouts mit Fehlerpolicy, Datenmodell vereinfachen |
| Livelock | CPU hoch, Fortschritt gering | wiederholtes Ausweichen/Retry | Backoff, Jitter, Ursache/Owner sichtbar machen |
| Starvation | einzelne Tenant/Key/Taskklasse kommt nie voran | unfaire Queue, Hot Key, Priorität | Fairness/quotas, Aging, Sharding, klare SLO |
| Priority Inversion | wichtige Arbeit wartet hinter niedriger Priorität | geteilter Lock/Ressource | Critical Section kürzen, Policy prüfen, Spezialist bei RT-Anforderungen |
| Thread Leak | Thread-/Taskzahl wächst | fehlender Join/Detach, hängende I/O, unbounded spawn | Lifecycleowner, Dumps, Cancellation, Budget |
| Pool Exhaustion | Queue und Requestlatenz wachsen | blockierende Arbeit oder Dependencylimit | Workload trennen, dependency-specific limiter, Backpressure |
| Queue Explosion | OOM, alte Aufgaben, späte Fehlerwelle | unbounded queue | Bytes/items begrenzen, reject/defer/DLQ |
| Cancellation Leak | abgebrochene Requests arbeiten weiter | Context nicht propagiert, I/O ohne Deadline | Child context, cancellation points, join/await |
| Shutdown Loss | Duplikate oder verlorene Wirkung | Ack vor Commit, abruptes Stoppen | outbox/idempotency/lease, drain contract |
| Cache Thrash | CPU steigt, Durchsatz sinkt | zu viele runnable threads / Migration | Pool senken, Profiling, erst dann Affinität prüfen |
| Dependency Storm | DB/LLM/API bricht ein | Fan-out multipliziert Retries | budgets, circuit breaker, retry caps, jitter |

**Failure-Diagnose-Reihenfolge:**

1. Schütze die Wahrheit: Admission drosseln oder schädliche Seiteneffekte stoppen.
2. Prüfe Queuealter, aktive Arbeit und Dependency-Sättigung vor Optimierungsversuchen.
3. Korrigiere Uhrzeit, Korrelations- und Tenantkontext; ohne Korrelation sind Thread Dumps unvollständig.
4. Erhebe sichere Profile/Dumps unter der geltenden Datenschutz- und Zugriffsregel.
5. Bestimme für jeden wartenden Thread/Task: running, runnable, waiting on lock, waiting on I/O, throttled, canceled oder orphaned.
6. Verbinde den lokalen Zustand mit Request, Queueelement, Dependency und Commit/Ack.
7. Formuliere eine Hypothese, reproduziere sie isoliert und ändere nur eine Variable.
8. Roll out mit Limit, Alarm, Rollback und Kill Switch.

## Security, Governance und Compliance

Nebenläufigkeit ist auch Security-Relevant, weil Limits und Ownership den Blast Radius bestimmen.

- **Tenant-Isolation:** Gemeinsame Pools ohne Tenantquota können einen lauten Tenant zur Verdrängung anderer befähigen. Begrenze Admission, Queue, externe Clients und Cost Budget pro Tenant/Policyklasse.
- **Identity Propagation:** Thread-/Tasklokale Daten sind keine Autorisierungsquelle. Identity, Request-ID und Policy müssen an APIgrenzen explizit und unveränderlich übergeben werden. Prüfe Cleanup, damit keine Anfragedaten in wiederverwendeten Workern verbleiben.
- **Secret Exposure:** Dumps und Profiler können Argumente, Requestdaten oder Speicherfragmente enthalten. Zugriff, Redaction, Aufbewahrung und Incidentprozess müssen definiert sein.
- **Cancellation Security:** Ein Clientdisconnect ist nicht automatisch Autorisierung zum Abbruch oder zur Fortsetzung einer Zahlung, Provisionierung oder Toolaction. Die Fachpolicy steuert den Übergang.
- **Resource Exhaustion:** Unbounded Tasks, Parsing, Fan-out und Retries sind DoS-Multiplikatoren. Limits werden früh vor teuren Schritten durchgesetzt.
- **Change Governance:** Schedulerklasse, CPU-Affinität, Runtimeflags und Threadpoolwerte sind produktionswirksame Änderungen. Sie brauchen Owner, Messbaseline, Rollback und Recheck bei Node-/Runtimewechsel.
- **Compliance Evidence:** Für regulierte Pfade zeichne Entscheidung, Policyversion, idempotency key, Queue-/Deadlineausgang und dauerhaften Commit auf, aber keine unnötigen Prompt-/PII-/Secretdaten.

## Observability und Troubleshooting

### Ereignisse und Metriken, die wirklich helfen

```text
request_id, trace_id, tenant, workload_class,
admission_outcome, queue_name, queue_age_ms,
task_group_id, active_tasks, cancellation_reason,
lock_name, lock_wait_ms, dependency_name,
dependency_wait_ms, result_class, commit_state
```

Ergänze keine unbounded Kardinalität aus zufälligen IDs als Metriklabels. IDs gehören in Traces/Logs; Metriken aggregieren nach begrenzten Dimensionen wie workload class, tenant tier, dependency oder outcome.

### Alarmierung als Symptomsprache

| Alarm | Erste Frage | Fehlentscheidung vermeiden |
|---|---|---|
| Queuealter verletzt SLO | Admission oder Consumer/Dependency gesättigt? | blind Worker erhöhen |
| Lock-Wartezeit steigt | Welche Invariante und welcher Owner? | globalen Lock entfernen ohne Korrektheitsersatz |
| Threadzahl wächst | fehlt Join, hängt I/O oder gibt es unbounded Spawn? | nur Threadlimit erhöhen |
| CPU hoch, Durchsatz flach | spin, contention, throttling oder echte CPUarbeit? | mehr Nodes ohne Profil |
| Cancellations steigen | Clientdeadline, Dependencylatenz oder Shutdown? | alle Timeouts global erhöhen |
| Duplicate/late results | Ack/Commit/Race/Retry Vertrag verletzt? | nur Retry deaktivieren |
| GPU/Provider Queue steigt | App Fan-out, Rate, Batch oder Modellkapazität? | CPU Threadpool optimieren |

### Thread Dump lesen – aber mit Kontext

Ein Dump zeigt eine Momentaufnahme. Er beantwortet nicht allein, ob ein Lock „schuld“ ist. Kombiniere ihn mit Zeitreihe, Trace, Queuealter und Dependency-Metriken. Suche nach vielen Threads in gleichem Wait, einem Owner mit langem Hold, wiederholtem Stackmuster, fehlenden Cancellation Checks oder einem Pool, der ausschließlich auf dieselbe Abhängigkeit wartet. Redigiere sensible Nutzlasten nach Prozessvorgabe.

### Troubleshooting-Runbook

1. **Scope:** Welche Workloadklasse, Revision, Region/Nodegruppe, Tenantklasse und Zeit?
2. **Safety:** Admission senken, kostspielige Tool-/Model-/Writepfade begrenzen, SLO-Kommunikation starten.
3. **Saturation:** Queue tiefe/Alter, active workers, concurrency limit, dependency pending/connection use vergleichen.
4. **Lifecycle:** Gibt es neue Tasks nach Shutdown/Cancel? Werden alle Child Tasks gejoint?
5. **Contention:** Lock Wait/Hold, keyed shard skew, Hot Tenant/Key und synchronisierte Retrywellen prüfen.
6. **Runtime:** CPU quota/throttling, Memorypressure, GC/Runtimepausen und blockierende Calls erfassen.
7. **Correctness:** Idempotency-, Lease-, Commit-/Ackausgänge und Duplikatsuppression prüfen.
8. **Experiment:** Einen begrenzten Test oder Canary mit dokumentierter Hypothese durchführen.
9. **Recovery:** Limit/Rollback, Backlogpolicy, Nachbearbeitung und Incidentlernen dokumentieren.

## Cost und FinOps

Mehr Parallelität erhöht oft gleichzeitig CPU, Memory, offene Verbindungen, Tokens, Provideranfragen, Log-/Tracevolumen und Retries. Eine auf Durchsatz optimierte Poolgröße kann bei gleichem fachlichen Ergebnis teurer sein.

| Kostenhebel | Risiko | Steuerung |
|---|---|---|
| CPUthreads | Context Switches, Cacheverlust, Quota/Autoscaling | gemessene CPU-Pools, Workloadtrennung |
| Queues | Memory, Storage, spätere Lastwelle | items/bytes/age begrenzen, Defer/DLQ |
| Connections | DB/API-Sättigung und Lizenz-/NATkosten | clientpool pro Dependency, fair quotas |
| GenAI Fan-out | Token-/Requestkosten und Toolaufrufe | budgeted retrieval/model/tool concurrency |
| Retries | Cost-Multiplikation | Fehlerklasse, Cap, Jitter, Circuit Breaker |
| Telemetrie | Kardinalität/Storage/PII | Sampling, bounded labels, Redaction |
| Overprovisioning | Idle Compute | Reservation nach Bedarf, schrittweise Skalierung |

FinOps-Frage für ein Architekturreview: *Wie verändert ein Faktor zwei mehr Admission die Kosten, Tail-Latency, Erfolgsquote und Fairness bei normaler und degradierten Abhängigkeit?* Diese Antwort verlangt Messung über mindestens einen Last- und Failure-Fall.

## Trade-offs und Anti-Patterns

### Entscheidungsübersicht

| Entscheidung | Vorteil | Preis | Wann vermeiden |
|---|---|---|---|
| großer Shared Pool | einfach initial | Cross-workload interference | unterschiedliche SLO, Trust oder Dependencygrenzen |
| getrennte Pools | Isolation und klare Budgets | mehr Konfiguration | wenn Workload sehr klein und Messung keine Interferenz zeigt |
| Mutex | leicht verständliche lokale Korrektheit | Contention/Deadlockrisiko | über Remote I/O oder ohne Invariante |
| Atomics | effizient für enges Protokoll | hoher Beweisaufwand | mehrteilige fachliche Transaktionen |
| Actor/Single Writer | Ownership klar | Mailbox/Hot-Key-Risiko | unbounded mailbox oder ohne Backpressure |
| async I/O | hohe I/O-Überlappung | Blockierungsfallen und Debugging | Library blockiert Event Loop |
| virtual/green tasks | viel wartende Arbeit | externe Limits bleiben | als Ersatz für Admission/Rate Limits |
| mehr Replikas | erhöht Kapazität | verteilte Duplikate/Kosten | lokaler Engpass/DBlimit ungelöst |

### Anti-Patterns

1. **„Thread pro Event ohne Obergrenze.“** Jeder Burst wird zu Memory-, Scheduler- und Dependencylast.
2. **„Der Pool ist unser Backpressure.“** Ohne Admission und Queuepolicy warten Clients unkontrolliert oder sterben mit Timeout.
3. **„Wir schützen alles mit einem globalen Lock.“** Korrektheit wird zur Latenzkatastrophe; Datenmodell und Ownership fehlen.
4. **„Wir halten den Lock während des HTTP-/DB-/LLM-Calls.“** Der langsamste externe Aufruf blockiert lokale Progress.
5. **„Retries erhöhen Durchsatz.“** Bei Überlast vervielfachen sie die Ursache.
6. **„Thread-safe Bibliothek bedeutet fachlich race-free.“** Die Bibliothek schützt interne Daten, nicht die Geschäftsregel zwischen Calls.
7. **„Clientdisconnect beendet automatisch jede Arbeit.“** Fachliche Wirkung, Audit, Commit und Compensation sind separate Verträge.
8. **„Affinity als erster Performancefix.“** Ohne Profil, CPU quota und Topologiemodell entsteht fragile Infrastruktur.
9. **„Ein lokaler Lock schützt die verteilte Welt.“** Mehrere Pods/Prozesse/Retryer benötigen durable Idempotenz und Koordination.
10. **„Dumps ohne Datenschutzprozess.“** Diagnose erzeugt selbst ein Sicherheitsrisiko.

## Staff-, Principal- und Chief-Level Decisions

### Staff: Muster im Team wirksam machen

- Lege pro Service einen kurzen Concurrency Contract neben API-/SLO-Definition an.
- Biete geprüfte Bibliotheks-/Templatepfade für Context/Deadline, bounded task group, client limiter, idempotenten Commit und graceful shutdown.
- Fordere bei Shared State eine schriftliche Invariante und Ownershipentscheidung im Design Review.
- Baue Tests für Race, Timeout, Cancellation, Queuevoll, Dependencyslowdown und Shutdown in die Lieferpipeline ein.
- Sorge dafür, dass Telemetrie Korrektheit und Sättigung zugleich sichtbar macht.

### Principal: Grenzen zwischen Systemen gestalten

- Entkoppel Workloadklassen mit verschiedenen SLO, Sensitivität oder Kostenprofilen durch eigene Budgets, Queues und Deployments.
- Entscheide, ob Serialisierung in Datenmodell, Key-Shard, Workflow-Engine oder Datenbanktransaktion gehört; ein Threadpool ist keine Koordinationsplattform.
- Verbinde Application- und Platformlimits mit DB, Message Broker, LLM Gateway, GPU Scheduler, Network Egress und Tenantquotas.
- Leite Capacity-Ranges aus Messung ab und verankere sie in Rollout-/Autoscaling-/Incidentprozessen.
- Prüfe, ob Local Concurrency eine verteilte Duplicate-/Ordering-/Exactly-once-Anforderung verschleiert.

### Chief: Betriebsmodell und Investitionsrahmen setzen

- Definiere firmeneinheitliche Mindeststandards für Admission, deadline propagation, cancellation, queueing, idempotency, telemetry privacy und Sättigungsalarme.
- Priorisiere Plattformcapabilities, die sichere Defaults liefern: zentrale Quotas, Client-/Connectionmanagement, Async Job Governance, Profilerzugang und kontrollierte Lasttests.
- Entscheide Sprache/Runtime nach Support, Talent, Security, Observability, Kosten und Workloadprofil, nicht nach einer einzelnen Microbenchmark.
- Verlange bei teuren AI- und Tool-Systemen ein Budgetmodell pro Tenant/Workload und einen sicheren Degradationsmodus.
- Behandle Scheduler-/Affinity-/Real-Time-/NUMA-Eingriffe als ausnahmebasierte Spezialistenentscheidungen mit Review, Owner und Rückbauplan.

## Production Checklist

### Korrektheit und Ownership

- [ ] Jede mutable Invariante hat einen benannten Owner und Testfall.
- [ ] Shared State ist immutable, key-serialisiert, gelockt oder durch einen dokumentierten atomaren Vertrag geschützt.
- [ ] Keine externe I/O- oder unbekannte Callbackausführung unter einem Lock ohne expliziten Review.
- [ ] Spawned Threads/Tasks haben Parent, Join-/Awaitpfad, Resultatklassifikation und Cancellation.
- [ ] Seiteneffekte haben Idempotency/Lease/Outbox-/Compensationvertrag.

### Begrenzung und Reliability

- [ ] Admission, In-flight, Queue items/bytes, Consumer, Clientconnections und externe Requests sind begrenzt.
- [ ] Voller Queuefall ist fachlich definiert: reject, defer, persist, retry later oder DLQ.
- [ ] Deadline und Grace Period sind pro Workload begründet; Childbudgets überschreiten Parentbudget nicht.
- [ ] Retry ist nach Fehlerklasse begrenzt, mit Jitter und Circuit/Backoffpolicy.
- [ ] Shutdown schließt Admission, drainiert nach Policy, canceliert, joinet und verhindert Ack vor Commit.

### Observability, Security und Cost

- [ ] Queuealter, active work, rejections, cancellation outcomes, dependency pending und Commitausgang sind messbar.
- [ ] Trace-/Logkontext über Tasks wird bewusst propagiert und ohne sensible Nutzlast ausgegeben.
- [ ] Dumps/Profile folgen Zugriff-, Redaction- und Aufbewahrungsregel.
- [ ] Tenant- und Workloadquotas begrenzen Fairness-, DoS- und Kostenrisiko.
- [ ] Load-/Failure-Test und Baseline sind vor Rollout dokumentiert.
- [ ] Runtime-/Pool-/Affinity-/Scheduleränderungen haben Owner, Canary, Rollback und Rechecktrigger.

## Interviewfragen mit Modellantworten

### 1. Was ist der Unterschied zwischen Nebenläufigkeit und Parallelität?

Nebenläufigkeit beschreibt die überlappende Organisation mehrerer Arbeitseinheiten; Parallelität bedeutet zeitgleiche Ausführung auf mehreren Rechenressourcen. Ein I/O-lastiger Dienst kann hoch nebenläufig sein, obwohl nur wenige CPU-Kerne arbeiten. Architekturentscheidungen müssen daher Wartezeit, CPU, externe Limits und Korrektheit getrennt betrachten.

### 2. Warum löst ein größerer Threadpool nicht automatisch eine langsame API?

Er kann die langsame Dependency stärker belasten, mehr Threads in Warteposition bringen und Queueing sowie Tail-Latency erhöhen. Zuerst prüfe ich Dependency-Limit, Connection Pool, Requestdeadline, Queuealter und Retryverhalten. Danach setze ich einen gemessenen, getrennten Concurrency-Limiter.

### 3. Wann verwendest du einen Mutex und wann eine Queue?

Ein Mutex schützt eine kurze lokale Mutation mit klarer Invariante. Eine bounded Queue übergibt Arbeit zwischen Ownern und macht Backpressure sichtbar. Wenn das Problem eine Reihenfolge, Lastverteilung oder asynchrone Übergabe ist, ist ein Mutex allein fast nie das passende Modell.

### 4. Warum wartet man bei einer Condition Variable in einer Schleife?

Das Signal allein beweist nicht, dass die fachliche Bedingung noch gilt. Andere Consumer können sie verändert haben; Broadcast, Timeout oder Unterbrechung sind möglich. Das Predicate wird unter dem assoziierten Mutex wieder geprüft.

### 5. Was ist ein Thread Leak?

Threads oder Tasks wachsen, weil sie nicht beendet, gejoint, detached oder durch Cancellation erreicht werden. Ursachen sind unbounded Spawn, hängende I/O, verlorene Handles oder fehlende Shutdownownership. Ich erkenne ihn durch Thread-/Taskzahl, Altersverteilung, Dumps, aktive Queue und fehlende Joinmetriken.

### 6. Wie schützt du eine GenAI-Orchestrierung vor unbounded Fan-out?

Mit Admission pro Tenant, begrenzten Retrieval-/Rerank-/Model-/Tool-Semaphores, Request- und Child-Deadlines, Queuepolicy, Idempotency für Seiteneffekte und expliziter partial-failure-/cancellationregel. Die Zahl der Appthreads ist nur ein Teil davon.

### 7. Ist eine thread-safe Clientbibliothek ausreichend für korrekte Geschäftslogik?

Nein. Sie verhindert höchstens Datenrennen innerhalb ihres Vertrags. Die Geschäftsregel zwischen mehreren Clientcalls, persistierter Wirkung, Retry und Ack muss separat durch Transaktion, Idempotenz, Version oder Workflowvertrag gesichert werden.

### 8. Wann würdest du CPU-Affinität einsetzen?

Nur bei klar messbarem Vorteil, bekannter Hosttopologie, stabiler Supportmatrix und ownerfähigem Betrieb. Ich prüfe vorher CPU quotas, Scheduling, Contention, Memory/NUMA, Workloadprofil und Alternativen wie Poolgrenze oder Partitionierung. Für Standardservices ist sie kein erster Hebel.

### 9. Wie testest du einen Race-Fehler sinnvoll?

Ich formuliere zuerst die Invariante und baue ein kleines reproduzierbares Szenario mit Barrieren/gezieltem Interleaving, vielen Wiederholungen und klarer Orakelbedingung. Danach teste ich die Korrektur und negative Fälle wie Cancellation, Timeout und partial failure. Ein einmaliger erfolgreicher Lauf beweist nichts.

### 10. Welche Chief-Entscheidung steckt hinter Concurrency?

Die Wahl eines verlässlichen Betriebsmodells: sichere Defaults für Quotas, Deadline/Cancellation, Queueing, Idempotenz und Observability, passende Runtime-/Platforminvestitionen sowie klare Ausnahmen für Spezialtuning. Sie reduziert systemische Risiken und Kosten über alle Teams.

## Praktisches Lab: Bounded Worker, Race-Gegenprobe und kontrollierter Shutdown

> **Status:** `reviewed_only`. Dieses Lab ist eine sichere Lernanleitung. Es wurde in diesem Auftrag nicht ausgeführt. Es verändert keine Host-, Scheduler-, cgroup-, Container-, Cloud-, GPU- oder Produktionskonfiguration.

### Ziel und Sicherheitsgrenze

Nutze ein lokales Sandboxprojekt mit synthetischen Aufträgen. Das Lab soll beweisen, dass eine begrenzte Workergruppe auf `cancel` reagiert, jedes Ergebnis genau einmal klassifiziert, volle Kapazität sichtbar macht und eine absichtlich ungeschützte Zählervariante verliert. Verwende keine Kundendaten, Secrets, externen APIs oder privilegierten Tools.

### Aufbau

```text
producer -> bounded queue (capacity 8) -> 2 workers -> result collector
                 |                         |
                 +-- overload counter -----+-- cancellation token
```

### Ablauf

1. Implementiere `Job{id, idempotency_key, deadline}` und einen Collector, der für jede ID genau einen Endzustand erwartet.
2. Erzeuge eine bounded Queue mit Kapazität 8 und zwei Workern. Jeder Worker prüft vor und nach simulierter Arbeit `cancel` und veröffentlicht `success`, `cancelled` oder `failed`.
3. Reiche 100 synthetische Jobs schneller ein, als sie verarbeitet werden. Zähle `accepted` und `rejected`; ein voller Queuefall darf nicht schweigend blockieren.
4. Starte einen Timer, der nach kurzer Zeit Cancellation auslöst. Stoppe neue Admission zuerst, dann canceliere Workerarbeit, dann join/await alle Worker.
5. Prüfe die Invarianten: `accepted = terminal_results`, jede `job.id` höchstens einmal, `rejected` hat erklärten Grund, nach Join existiert keine aktive Workerarbeit.
6. Implementiere separat den absichtlich falschen Counter `value = value + 1` aus vielen parallelen Tasks ohne Synchronisation. Wiederhole den Test, bis ein verlorenes Update sichtbar wird oder erkläre, warum die gewählte Runtime das Interleaving nicht erzwingen konnte.
7. Korrigiere den Counter durch klaren Owner, Mutex oder eine passende atomare Operation. Wiederhole denselben Orakeltest.
8. Schreibe Queuealter, aktive Worker, Cancelgrund, Jobdauer, Ergebnisklasse und fehlgeschlagene Admission als lokale Testtelemetrie.
9. Führe Cleanup aus: Worker joinen, Queue schließen, temporäre Dateien entfernen, keine Hintergrundprozesse zurücklassen.

### Negative Proben und erwartete Befunde

| Probe | Erwarteter Befund | Lernpunkt |
|---|---|---|
| Queuekapazität auf unbounded ändern | Memory/Alter kann ohne klare Grenze wachsen | Backpressure ist ein Vertrag. |
| Worker blockiert ohne Deadline | Join kann hängen | Cancellation muss an Blockierungsgrenzen wirken. |
| Lock über simuliertem Remote Call | Lock-Wartezeit wächst | Critical Section muss klein bleiben. |
| Join entfernen | Task-/Threadressourcen bleiben unklar | Spawn verlangt Lifecycleowner. |
| Retry ohne Cap | Anzahl Versuche wächst schnell | Retry ist Last und Kosten, nicht Heilung. |
| Idempotency Key ignorieren | Duplikatresultate möglich | Nebenläufigkeit braucht fachliche Wahrheit. |

### Abnahmekriterien

- [ ] Keine akzeptierte Job-ID hat mehr als einen terminalen Zustand.
- [ ] Rejection und Cancellation sind zählbar und begründet.
- [ ] Nach Shutdown sind alle lokal gestarteten Worker gejoint/awaited.
- [ ] Der Race-Gegenfall ist als Risiko dokumentiert, auch wenn er im gewählten Runtime-Lauf nicht reproduzierbar war.
- [ ] Der korrigierte Pfad besitzt eine explizite Invariante, keinen bloßen „funktioniert jetzt“-Befund.
- [ ] Keine Produktions-, Cloud-, GPU-, Host- oder privilegierte Konfiguration wurde verändert.

## Dependencies und Cross-References

- [KB-0031 – Linux Kernel und Systemaufrufe](01-linux-kernel-und-systemaufrufe.md)
- [KB-0032 – Prozesse und Lebenszyklen](02-prozesse-und-lebenszyklen.md)
- KB-0034 – Virtueller Speicher und Page Faults
- KB-0035 – Sockets und Netzwerk-I/O
- KB-0036 – Namespaces und cgroups
- KB-0038 – Linux Performance Analysis und eBPF
- KB-0040 – Linux Service Management und Operations
- KB-0410 – Durable Workflows und Distributed Coordination
- KB-0550 – Platform Engineering und Developer Platform
- KB-0580 – AI Infrastructure, GPU und Inference
- KB-0720 – Portfolioevidenz und Reifemodelle

## Quellen und Aktualitätsnotizen

| Quelle | Verwendung | Stand |
|---|---|---|
| Dateikatalog 720 | Verbindlicher Scope: Kernelthreads, Synchronisation, Kontextwechsel, Nebenläufigkeit/Parallelität, Race Conditions und Thread-Pool-Grenzen. | Planstand 2026-09-14 |
| [POSIX.1-2024, Threads](https://pubs.opengroup.org/onlinepubs/9799919799/functions/V2_chap02.html) | Threadmanagement, thread-safe APIs und Synchronisationsrahmen. | Abgerufen 2026-09-15 |
| [POSIX.1-2024, Memory Synchronization](https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap04.html) | Mutex-/Condition-Variable-Speichersynchronisation und Data-Race-Rahmen. | Abgerufen 2026-09-15 |
| [pthread_join](https://pubs.opengroup.org/onlinepubs/9799919799.2024edition/functions/pthread_join.html) | Join-/Detach- und Ressourcenlebenszyklus. | Abgerufen 2026-09-15 |
| [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html) | POSIX Threads auf Linux, NPTL, 1:1-Modell und Futexbezug. | Linux man-pages 6.19, abgerufen 2026-09-15 |
| [futex(7)](https://man7.org/linux/man-pages/man7/futex.7.html) | Fast-path in User Space und Kernelarbitration bei Contention. | Linux man-pages 6.19, abgerufen 2026-09-15 |
| [sched_setaffinity(2)](https://man7.org/linux/man-pages/man2/sched_setaffinity.2.html) | Per-thread CPU Affinity und cpuset-Einschränkungen. | Linux man-pages 6.19, abgerufen 2026-09-15 |
| [JEP 444: Virtual Threads](https://openjdk.org/jeps/444) | JDK-21-Virtual-Threads und ihre Pooling-/Observability-Eigenschaften. | JEP aktualisiert 2025-10-30, abgerufen 2026-09-15 |
| [Go Context](https://go.dev/blog/context) | Deadline-, Cancellation- und Request-Kontextmodell für Go-Server. | Abgerufen 2026-09-15 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — Strukturierte Nebenläufigkeit verschiebt die Frage von „wo wurde gespawnt?“ zu „welcher Parent besitzt, canceliert und beobachtet jedes Child?“.** Moderne Runtimes und Bibliotheken bieten Task Groups, Scopes oder Join-Sets. **Reifegrad: Adopting bis Established, je Sprache/Runtime.** Der Wert entsteht nur, wenn Deadline, Resultatklasse und Shutdown fachlich modelliert sind. Ein Pilot nimmt einen einzelnen I/O-lastigen Pfad, erzwingt Child-Join und prüft Cancel-/Fehlerpropagation gegen einen unstrukturierten Vergleich.

**Stand 2026-09-15 — Virtual Threads und andere user-mode Tasks vereinfachen hohe I/O-Nebenläufigkeit, verschieben aber keinen externen Engpass.** JEP 444 liefert Virtual Threads in JDK 21; die JEP empfiehlt, sie pro Aufgabe zu erzeugen und nicht wie Platform Threads zu poolen. **Reifegrad: Established im JDK-21-Kontext.** Ein Pilot misst Connection-, DB-, Gateway- und CPU-Grenzen sowie Thread Dumps, bevor ein großer Executor durch Virtual Threads ersetzt wird.

**Stand 2026-09-15 — Cancellation wird bei GenAI- und Tool-Orchestrierung zu einer Sicherheits- und Kostensteuerung.** Streaming, lange Inference und Toolcalls verlangen einen sichtbaren Unterschied zwischen Clientabbruch, Deadline, Policyabbruch, Commit und Compensation. **Reifegrad: Adopting.** Ein Pilot startet mit read-only Tools, End-to-End-Korrelation und einer harten per-Tenant-Work-/Costgrenze; erst danach werden seiteneffektbehaftete Tools zugelassen.

**Stand 2026-09-15 — Scheduler- und eBPF-gestützte Diagnose kann Warteschlange, Runqueue und Blockierungsgrund besser verbinden, darf aber kein Standardzugriff ohne Governance werden.** **Reifegrad: Established für spezialisierte Linux/SRE-Praxis, specialist optional für die Zielrollen.** Ein Pilot definiert privilegierten Zugriff, Redaction, Sampling, Datenaufbewahrung und eine konkrete Hypothese, bevor Profildaten erhoben werden.

