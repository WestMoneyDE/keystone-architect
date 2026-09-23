---
{"id": "KB-0046", "title": "Linux-Fehlersuche und Performance-Debugging", "domain": "02", "sequence": 16, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["PLATFORM", "CLOUD", "GENAI", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0032", "concepts": ["Prozesszustand", "Threads", "Lebenszyklus"], "needed_for": "understanding"}, {"id": "KB-0034", "concepts": ["Virtueller Speicher", "Page Faults", "Memory Pressure"], "needed_for": "both"}, {"id": "KB-0038", "concepts": ["cgroups", "Effective Limits", "Ressourcenisolation"], "needed_for": "both"}, {"id": "KB-0042", "concepts": ["CPU Scheduling", "Run Queue", "Throttling"], "needed_for": "both"}, {"id": "KB-0044", "concepts": ["Block-I/O", "Page Cache", "Queueing"], "needed_for": "both"}, {"id": "KB-0045", "concepts": ["eBPF Beobachtungsgrenzen", "Hook", "Overhead"], "needed_for": "understanding"}], "related": ["KB-0033", "KB-0040", "KB-0041", "KB-0043", "KB-0047", "KB-0151", "KB-0562", "KB-0720"], "applies": ["KB-0151", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein eigenes Sandbox-Lab erzeugt eine harmlose CPU- und Wartephase, misst sie mit begrenzten Standardwerkzeugen und dokumentiert eine Gegenhypothese.", "rationale": "Ausschließlich ein selbst gestarteter Testprozess wird beobachtet; keine fremden oder produktiven Prozesse werden angehängt oder beeinflusst."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein Diagnosevertrag verbindet Produkt-SLO, Hypothese, Scope, Datenklassifikation, Messinstrument, Budget, Abbruchregel, Gegenprobe und Rollback.", "rationale": "Eine technische Messung wird nur durchgeführt, wenn sie eine konkrete Architektur- oder Betriebsentscheidung verändern kann."}, "STAFF-TARGET": {"active": true, "scope": "Teams nutzen eine einheitliche Hypothesenmatrix, sichere Diagnose-Runbooks und evidenzbasierte Capacity-/Reliability-Fixes.", "rationale": "Das reduziert voreilige Host-, Cloud- oder Codeänderungen während Incidents."}, "CHIEF-TARGET": {"active": true, "scope": "Plattformweite Profilingzugänge, Datenminimierung, Kernel-/Runtime-Support, Incidentrollen und FinOps werden als gemeinsame Fähigkeit gesteuert.", "rationale": "Tiefes Debugging braucht Governance, damit privilegierte Daten und teure Ad-hoc-Maßnahmen beherrschbar bleiben."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "PMU-Eventwahl, perf sampling/callchains, flamegraphs, eBPF-Profiling, JIT-/GC-Analyse, NUMA-/IRQ-Forensik und Kerneltracing sind Spezialistentiefe.", "rationale": "Die Zielrollen können die Evidenz bewerten und Spezialisten führen, ohne alle Hardwarezähler selbst zu kalibrieren."}}, "lab_validation": [{"lab_id": "KB-0046-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Linux-Sandbox mit selbst gestarteter Python- oder Shell-Last", "evidence": "Sicherer Ablauf, Messhypothesen, negative Proben, Abbruchregeln und Cleanup fachlich geprüft.", "limitations": "Nicht ausgeführt; kein Attach an fremde Prozesse, keine Produktionsdaten, keine Root-/Kerneländerungen, keine Cloudressourcen und keine Performanceaussagen behauptet."}]}
---
# Linux-Fehlersuche und Performance-Debugging

> **Ziel:** Debugging ist ein kontrolliertes Ausschließen von Ursachen. `top`, `strace`, `perf` und I/O-Metriken sind Messinstrumente mit Sichtgrenzen. Ein Graph oder ein einzelner Befehl wird erst mit einer klaren Hypothese, einem Gegenbeweis und einer überprüften Änderung zu belastbarer Evidenz.

## Purpose, Definition und Scope

Linux-Fehlersuche und Performance-Debugging untersuchen, warum ein System oder eine Nutzeroperation langsamer, fehlerhafter oder unzuverlässiger als vereinbart ist. Sie verbinden Produkt-Symptom, Anwendung, Runtime, Prozess, cgroup, Kernel, I/O, Netzwerk und externe Abhängigkeit. Das Ziel ist nicht maximale Detailtelemetrie, sondern eine sichere, wiederholbare Entscheidung: **welche Ursache ist ausreichend belegt, welche Änderung ist klein und reversibel, und welche Aussage bleibt unsicher?**

Diese Datei behandelt die methodische Verwendung von `top`, `/proc`, `strace`, `perf`, PSI und I/O-Metriken. Sie grenzt davon ab:

- [KB-0044](14-block-i-o-und-engpaesse.md) erklärt den Block-I/O-Pfad und dessen Engpässe;
- [KB-0045](15-ebpf-und-kernelbeobachtung.md) erklärt eBPF als eingeschränkte Kernelbeobachtung;
- spätere Dateien behandeln SRE, verteilte Traces, Cloud-Plattformen, Datenbanken oder Cilium;
- keine Anleitung autorisiert Zugriff auf fremde, produktive oder besonders geschützte Prozesse.

Nach dem Kapitel kannst du:

1. ein Symptom in messbare SLO-, Last-, Zeit- und Scope-Parameter übersetzen;
2. Prozesshänger, CPU-Sättigung, CPU-Throttling, Memory Pressure, I/O-Wartezeit, Lock- und Remote-Latenz voneinander unterscheiden;
3. `strace`, `perf`, `top` und `/proc` nach Aussagekraft, Nebenwirkung und Berechtigung auswählen;
4. eine Gegenprobe entwerfen, die eine bequeme, aber falsche Erklärung widerlegen kann;
5. eine Diagnose in ein sicher rückrollbares Fix-, Capacity- oder Architekturartefakt überführen.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Der Diagnosezyklus, Linux-Messquellen, typische Sättigungsmechanismen und ihre Sichtgrenzen werden unabhängig von eigener Praxiserfahrung erklärt. |
| HANDS-ON-TARGET | Ein eigener Prozess in einer Sandbox wird mit Zeit, CPU-/Wartephasen und einer begrenzten Syscall-Zusammenfassung beobachtet. |
| ARCHITECT-TARGET | Ein Messauftrag enthält Geschäftsentscheidung, SLO, Scope, Risiko, Datenmodell, Kosten, Abbruch und alternative Erklärung. |
| STAFF/PRINCIPAL | Teams erhalten ein gemeinsames Runbook, sichere Rechte-/Datenregeln und eine Evidenzschwelle für Kapazitäts- und Architekturänderungen. |
| CHIEF | Das Unternehmen erhält eine Governance für Profiling, Support und Datenminimierung statt unkontrollierter Diagnosezugänge. |

Die sechs Kompetenzmarker und die Evidenzgrenzen stehen vollständig im Frontmatter. Ein Lernziel ist kein Nachweis bereits ausgeführter Produktionsarbeit.

## Mental Model: Diagnose als Entscheidungsbaum mit Gegenbeweisen

Ein Incident beginnt oft mit „die Anwendung hängt“. Das ist ein Symptom, keine Ursache. Ein brauchbares mentales Modell hat sieben Schritte:

```text
Symptom / SLO breach
  -> precise question and scope
  -> baseline and recent changes
  -> ranked hypotheses
  -> least-invasive measurement
  -> counterfactual / negative probe
  -> bounded change, outcome and rollback
```

Eine Hypothese muss falsifizierbar sein. „Der Host ist langsam“ wird etwa zu: „Bei gleichem Requestmix steigt die CPU-Run-Queue und aktive CPUzeit der Worker; die End-to-End-p99 folgt dieser Änderung, ohne I/O-/Memory-/Remote-Signale.“ Ein geeignetes Messergebnis kann die Hypothese stützen oder widerlegen.

Drei Regeln halten den Baum ehrlich:

1. **Messe die Nutzeroperation.** Hostwerte ohne Request-, Job- oder Ablaufbezug können nur Indizien sein.
2. **Trenne Ursache, Verstärker und Folge.** Eine volle Queue kann durch eine langsame Dependency entstehen; Retries können dann das ursprüngliche Problem verstärken.
3. **Ändere nur nach Evidenz.** Mehr CPU, größere Volumes, neue Nodes oder ein Kernelparameter sind nicht neutral. Sie haben Kosten, Risiken und können die ursprüngliche Beobachtung verdecken.

## Prerequisites und Dependencies

| ID | Harte Voraussetzung | Warum |
|---|---|---|
| [KB-0032](02-prozesse-und-lebenszyklen.md) | Prozess-/Threadzustände und Lebenszyklus | Ein „hängender“ Prozess kann rechnen, warten, blockieren, gestoppt sein oder nicht mehr leben. |
| [KB-0034](04-virtueller-speicher-und-paging.md) | Page Faults, Working Set, Reclaim | Memory Pressure und Page Cache dürfen nicht mit freiem oder „unbenutztem“ Speicher verwechselt werden. |
| [KB-0038](08-cgroups-und-ressourcenbegrenzung.md) | Effective Limits, Isolation | cgroup-Limits, Throttling und Quotas ändern die sichtbare Kapazität. |
| [KB-0042](12-cpu-scheduling-und-lastverteilung.md) | Run Queue und Scheduling | Hohe Latenz kann CPU-Wartezeit sein, obwohl die durchschnittliche CPU niedrig wirkt. |
| [KB-0044](14-block-i-o-und-engpaesse.md) | I/O, Cache, Queueing | Geräte- und Writeback-Hypothesen brauchen einen getrennten Pfad. |
| [KB-0045](15-ebpf-und-kernelbeobachtung.md) | BPF-Sicht- und Sicherheitsgrenzen | Tiefere Traces sind nicht der Startpunkt jeder Diagnose. |

## Core Concepts und Mechanismen

### Symptomarten und Zustandsmodell

Ein Prozess ist nicht binär „läuft“ oder „hängt“. Er kann CPU ausführen, auf eine Runnable-Slot warten, auf einen Lock, eine I/O-Completion, Netzwerk, Timer, Child Process, Speicherreclaim, cgroup-Budget, GC oder eine externe Antwort warten. Mehrere dieser Zustände können sich in einem Request überlagern.

| Symptom | Präzise Frage | Erste sichere Evidenz | Nicht ausreichender Schluss |
|---|---|---|---|
| p99 steigt | Welche Operation, welcher Tenant, welche Phase, seit wann? | Produktlatenz + Error/Timeout + Load/Change timeline | „CPU ist bei 70 %, also ist sie schuld.“ |
| Prozess reagiert nicht | Hat er aktive CPU, wartet er, ist er gestoppt oder tot? | PID-/Threadzustand, Logs, Health, Eltern-/Kindbeziehung | Ein einzelner `ps`-Snapshot beweist keinen Deadlock. |
| Durchsatz fällt | Ist die Ankunftsrate, Servicezeit oder abgelehnte Arbeit verändert? | arrivals, completions, queue age, rejection rate | Mehr Worker lösen jede Warteschlange. |
| Speicher wächst | Ist es Cache, Working Set, Fragmentierung, Leak oder Backlog? | RSS/cgroup memory, faults, reclaim, allocation trend | „Linux nutzt RAM, daher Leak.“ |
| I/O wird langsam | Ist es Geräte-/Volume-Latenz, Writeback, Page Cache, quota oder Remote-Service? | app phase + I/O completion + queue + error/limit correlation | `iowait` allein beweist Device-Sättigung. |
| Fehler nach Deploy | Welche Revision, Konfiguration, Abhängigkeit, Datenform hat sich geändert? | immutable release/change ID and before/after comparison | Der letzte Deploy ist immer Ursache. |

### Zeitdomänen und Messkorrektheit

Vergleiche nur Messungen mit gemeinsamer Zeitbasis. Produkttraces verwenden oft monotone Dauer, Logs Wall Clock und Infrastrukturmetriken Aggregationsfenster. Uhrenversatz, Sampling, Zeitzonen und Zeitfenster machen scheinbare Korrelationen. Eine Diagnose notiert:

- Start-/Endzeit, Zeitzone und Abtastrate;
- Operation-/Release-/Configuration-ID;
- Node, cgroup, Container, Storage-/Networkklasse soweit erlaubt;
- ob Daten warm/kalt, Cache-, Retry- oder Rate-Limit-Zustand kontrolliert sind;
- wo Zahlen geschätzt, gesampelt oder aggregiert wurden.

Der Mittelwert verschleiert häufig Tail-Probleme. Für Interaktivität oder Deadlines gehören p50, p95/p99, absolute Fehlerzahl, Queue Age und abgelehnte Arbeit zusammen. Bei wenigen Datenpunkten ist ein Perzentil instabil; dann nenne man Stichprobengröße und Rohverteilung statt eines scheinpräzisen p99.

### `top`, `/proc` und Prozesssicht

`top(1)` ist ein dynamischer Überblick über Tasks und Ressourcen. Er eignet sich für schnelle Orientierung, nicht für eine forensische Einzelursache. Die Daten ändern sich während der Anzeige; virtuelle CPUs, Containergrenzen und Prozess-/Threadansichten prägen die Bedeutung.

`/proc/<pid>/stat`, `status`, `io`, `smaps` und verwandte Dateien liefern kernelnahe Moment- oder Zählerwerte. `proc_pid_stat(5)` dokumentiert, dass Felder kontext- und berechtigungssensitiv sein können. Ein isolierter Prozesswert muss gegen cgroup-Limits, Pod-/Containergrenze und Gesamtlast gelesen werden.

Sichere Reihenfolge: erst Produkt-Symptom und Prozessidentität validieren, dann kurze Momentaufnahme sammeln, danach über ein begrenztes Intervall Raten berechnen. „CPU 0 %“ bedeutet häufig nur, dass der Thread gerade wartet oder die Stichprobe ihn nicht beim Rechnen getroffen hat.

### `strace`: Grenze zwischen Programm und Syscall

`strace` beobachtet Systemaufrufe und Signale eines gestarteten oder angehängten Prozesses. Es beantwortet Fragen wie: „Wiederholt der Prozess `connect`, `poll`, `futex`, `read`, `write`, `openat` oder schlägt ein Syscall mit `ENOENT`, `EACCES`, `ETIMEDOUT` fehl?“ Es zeigt nicht zuverlässig die gesamte Anwendungslogik, CPU-Arbeit zwischen Syscalls, fachliche Kausalität oder Remote-Servicezeit.

Wichtige Grenzen:

- Attaching erfordert passende ptrace-Berechtigung und kann den Zielprozess beeinflussen; auf Produktivsystemen ist das eine explizite, zeitlich begrenzte Incidententscheidung.
- Vollständige Argumente können Pfade, Secrets, Payload-Fragmente oder personenbezogene Daten sichtbar machen.
- `strace -c` fasst Syscall-Klassen zusammen und reduziert Datenmenge, verliert aber zeitliche Reihenfolge und Detail.
- Eine große Zeit bei `futex` sagt „Synchronisationswartepfad sichtbar“, nicht automatisch „der Lock ist die Wurzel“. Owner, Contention, CPU, I/O oder Dependency können dahinter stehen.

Für ein Standardrunbook genügt eine sichere Frage: „Welche Syscallklasse dominiert in einem selbst erzeugten Testpfad?“ Ein fremder PID-Attach ist kein Standarddiagnoseschritt.

### `perf`: Ereignisse, Sampling und PMU-Grenzen

`perf_event_open(2)` richtet Performanceevents ein. Der Kernel unterscheidet zählende und gesampelte Events; Events können CPU-, Software-, Tracepoint- oder hardware-/PMU-spezifisch sein. Die Interpretation hängt von Architektur, Virtualisierung, Kernelkonfiguration, Berechtigung, PMU-Verfügbarkeit, Eventmultiplexing und Samplingrate ab.

`perf stat` ist geeignet, eine begrenzte Operation mit Zählern zu vergleichen. `perf record`/Reports oder andere Profiler können Samples und Callchains sammeln. Sie sind nicht selbsterklärend:

- Nicht jeder Hardwarezähler existiert oder misst auf jeder CPU gleich.
- Mehr Events als gleichzeitig messbare Counter können Multiplexing erzeugen; Skalierung und Laufzeit müssen sichtbar sein.
- Eine hohe Zahl Cache Misses ist ohne Datenlayout, CPUmodell, Last und Vergleich keine Architekturentscheidung.
- Berechtigungen wie `CAP_PERFMON`, ptrace-Regeln oder `perf_event_paranoid` können Messung beschränken. Eine Ablehnung wird dokumentiert, nicht durch informelle Privilege Elevation umgangen.
- Profiling kann Messoverhead und sensitive Symbol-/Callchaininformationen erzeugen.

### PSI und Pressure statt nur Auslastung

Pressure Stall Information (PSI) stellt für CPU, Memory und I/O Zeitanteile bereit, in denen Tasks wegen Ressourcendrucks verzögert sind. Die Kernel-Dokumentation beschreibt `some` und `full` als unterschiedliche Stalldimensionen. PSI ergänzt CPUauslastung und Memory-/I/O-Zähler: Ein System kann gute Durchschnittsauslastung zeigen, während genau die wichtigen Tasks wiederholt auf eine Ressource warten.

PSI ist kein Diagnoseabschluss. Es sagt nicht, welche Tenantklasse, welcher Prozess, welches Gerät oder welche externe Ursache Druck erzeugt. Kombiniere es mit cgroup-, Application- und Dependency-Daten sowie einer Last- und Zeitachsenanalyse.

### Diagnosesignale nach Ressource

| Ressource / Grenze | Nützliche Signale | Gegenhypothese |
|---|---|---|
| CPU aktiv | Prozess-/Thread CPU time, run queue, profile hot paths, request CPU time | Der Thread wartet auf Lock, I/O, network oder quota. |
| CPU quota | cgroup throttle events/time, effektive CPU, burst profile | Mehr CPU wäre verfügbar, aber Workload/lock/dependency begrenzt. |
| Memory | RSS/cgroup use, major faults, reclaim, PSI, GC/allocation, OOM events | Page Cache oder geplante Cachewarmth ist kein Leak. |
| I/O | completion latency, queue age/depth, errors, bytes, dirty/writeback, volume limits | CPU/Memory/Remote Service erzeugt die sichtbare I/O-Wartezeit. |
| Synchronisation | `futex`/lock waits, thread states, owner behavior, queue contention | Lock ist ein Symptom für CPU starvation, I/O oder hot key. |
| Netzwerk/remote | DNS, connect/handshake, pool wait, RTT, server latency, error/retry | Lokaler CPU- oder scheduler delay liegt vor dem Send/Receive. |
| Anwendung | queue age, retries, idempotency status, deadline, deploy flag | Infrastrukturwert ist Folge von Retry/backpressure. |

## Architecture und Data Flow: der Diagnosevertrag eines Retrieval-Services

Das folgende Beispiel ist ein Lernfall. Es behauptet keinen realen Praxiseinsatz.

```text
customer request
  -> API deadline / tenant admission
  -> retrieval and ranking
  -> cache / index / remote call
  -> response

diagnostic plane:
SLO breach -> incident question -> approved collector
  -> product trace + runtime/cgroup + Linux snapshots
  -> hypothesis ledger
  -> bounded experiment
  -> decision / rollback / evidence archive
```

Die Datenebene bleibt von der Diagnoseebene getrennt. Der Collector darf keine vollständigen Dokumente, Prompts, Tokens, URLs mit Secrets oder unredigierte Prozessargumente exportieren. Ein Incident Owner kann Scope und Dauer begrenzen; ein Security-/Platform Owner kontrolliert privilegierte Tools.

**Beispielfrage:** Nach Release R steigt `retrieval_response_p99` von 350 ms auf 1,6 s, während p50 stabil bleibt.  
**Priorisierte Hypothesen:** (1) neue Parallelität erzeugt CPU quota throttling, (2) Cache-Miss und I/O Queue wachsen, (3) Remote reranker hat Tail-Latenz, (4) Lock/retry amplification.  
**Messdesign:** Vergleiche identischen Requestmix, Revisionen, Tenantklasse, cache outcome und Zeitfenster; beginne mit Produkt-, cgroup- und I/O-Signalen. Erst wenn eine Lücke bleibt, benutze ein speziell freigegebenes Prozess-/Syscall-/Profilerinstrument.

## Protocols, Standards und Tools

| Tool / Schnittstelle | Zweck | Richtige Frage | Wichtige Grenze |
|---|---|---|---|
| `top` / `ps` | momentane Task-/CPU-/Memorientierung | „Welche Tasks sind im Zeitfenster auffällig?“ | Momentaufnahme und Darstellungssemantik. |
| `/proc` | kernelnahe Prozess-/Systemzähler | „Welche Raten/Zustände sieht der Kernel?“ | Zugang, Container-/Hostsicht und Felder variieren. |
| `strace` | Syscall-/Signalgrenze | „Welche Syscalls/Fehler/Warteklassen dominieren?“ | ptrace, Overhead, Datenleck, keine vollständige Programmlogik. |
| `perf` | CPU-/Software-/Tracepoint-/PMU-Events | „Welcher Code-/Ereignispfad unterscheidet zwei gleiche Läufe?“ | Architektur, Multiplexing, Privileg, Samplingbias. |
| PSI | Ressourcenstalls | „Stehen Tasks wegen CPU/Memory/I/O unter Druck?“ | keine per-process root cause. |
| `vmstat` / `pidstat` / `iostat` | Zeitreihen-Sicht auf CPU, Scheduler, Prozess, I/O | „Welche Rate verändert sich mit dem Symptom?“ | optionales Tool, Versions-/Virtualisierungsgrenzen. |
| eBPF | gezielte Kernelkontextlücke | „Welche autorisierte Hypothese bleibt offen?“ | siehe KB-0045; kein Default. |
| App traces / metrics | fachliche Dauer und Kausalität | „Welcher Nutzerpfad verletzt welches SLO?“ | Instrumentation kann fehlen oder Samplebias haben. |

Es gibt keinen universell sicheren Befehlssatz. Die Toolwahl folgt Zweck, Rechte, Datenklasse, Umgebung, Servicekritikalität und erwarteter Wirkung auf das Zielsystem.

## Konfiguration und Implementierung: ein versionierter Diagnoseauftrag

```yaml
diagnostic_contract:
  incident_or_change: INC-EXAMPLE-001
  decision_to_inform: "choose rollback, capacity change, or code fix"
  symptom:
    operation: retrieval_response
    target: p99_under_800ms
    observed: p99_over_1600ms
    window_utc: "declared-at-execution"
  scope:
    environment: approved-sandbox-or-canary
    release_compare: [previous, candidate]
    tenant_class: pseudonymous-class-only
  hypotheses:
    - cpu_quota_or_run_queue
    - memory_pressure_or_cache_churn
    - block_io_or_writeback
    - remote_dependency_tail
    - synchronization_or_retry_amplification
  measurements:
    baseline: [product_latency, error_rate, queue_age, cgroup_limits]
    optional_tools: [top, proc, strace_summary, perf_stat, psi]
    prohibited_capture: [payload, token, prompt, secret, full_url, raw_process_args]
  safety:
    max_duration_minutes: 20
    owner: service-and-platform
    stop_conditions: [product_slo_regression, data_exposure, unexpected_tool_overhead]
    fallback: "disable diagnostic collection and use standard telemetry"
  outcome:
    required: [hypothesis_status, evidence_links, uncertainty, change, rollback, recheck_trigger]
```

Eine Implementierung ist erst vollständig, wenn sie die Diagnose wieder beenden kann. Das bedeutet: zeitlich begrenzte Konfiguration, sichere Defaults, Redaction, Owner, Audittrail, Messdatenretention, Rückbau und eine eindeutige Entscheidung für „keine Änderung nötig“.

## Scalability und Performance

### Lastmodell vor Toolmodell

Bevor ein Profiler läuft, beschreibe die Arbeit:

```text
load = arrival_rate × object_size_distribution × read_write_mix × concurrency
service_time = cpu + scheduling_wait + memory_wait + io_wait + network_wait + lock_wait
end_to_end_latency = queue_wait + service_time + retries + client/network overhead
```

Die Terme sind ein Entscheidungsmodell; sie sind nicht unabhängig und meist nicht direkt in einer Zahl sichtbar. Mehr Concurrency kann Throughput erhöhen, bis CPU, Memory, I/O, Network, Lock oder ein Tenantlimit sättigt. Danach wächst oft `queue_wait`; p99 und Kosten können steigen, ohne dass die erfolgreiche Rate proportional wächst.

### Progressive Instrumentierung

1. **Low cost:** SLO, Errors, Queue Age, Release, cgroup limits, Capacity.
2. **Medium cost:** zeitlich begrenzte `/proc`-, PSI-, CPU-/I/O-/Netzwerkzeitreihen.
3. **Focused:** `strace -c` oder `perf stat` für einen selbst gestarteten oder autorisierten, klar abgegrenzten Prozess.
4. **Specialist:** callchain sampling, eBPF, kernel tracing, PMU/NUMA/IRQ Analyse.
5. **Fix validation:** gleiche Last, gleiche Datenform, Canary, Rollback and cost comparison.

Jede Stufe braucht eine Informationslücke, die die vorherige nicht schließen kann. So bleibt die Diagnoselast kleiner als das Risiko des Symptoms.

### AI- und Plattformworkloads

Bei einer Modell-/RAG-Plattform sind Phasen wichtig: Queueing, Tokenisierung, Retrieval, Netzwerk, Cache, Modellladen, Host-to-Device Transfer, Inference, Streaming, Persistenz. Ein hoher CPUwert kann Tokenisierung oder Serde bedeuten; GPU-Idle kann auf Queueing, Host-Memory, Transfer oder Request-Admission folgen; ein File-I/O-Signal kann einen cold-start-Artifactpfad zeigen statt den steady state.

Das Profil trägt daher Phasen- und Versionsdimensionen: `workload_phase`, `model_or_index_revision`, `cache_outcome`, `batch_class`, `tenant_class`, `node_class`, `result`. Es trägt keine Kundennutzlast.

## Reliability und Failure Modes

| Fehlermodus | Signal | Sichere Reaktion |
|---|---|---|
| Tool selbst verschlechtert Service | p99/CPU/overhead steigt mit Diagnosebeginn | Messung sofort stoppen, Standardtelemetrie nutzen, Incident dokumentieren. |
| Falscher PID/Namespace | Messung passt nicht zur betroffenen Workload | Identität, cgroup/container/node vor Interpretation verifizieren. |
| ptrace/perf verweigert | Permission denied, policy restriction | als Sicherheitsgrenze festhalten; keine Rechte improvisieren. |
| Samplingbias | seltene Tail-Fälle fehlen | Sample- und Dropsemantik nennen, Lastfenster erweitern oder andere Evidenz nutzen. |
| Datenleck in Ausgabe | Pfad, Argument, Identifier, Payload sichtbar | stop, redact, access review, retention/incident prüfen. |
| Deploy ändert Lastform | andere Daten, Cache, concurrency | A/B/C canary oder kontrollierter Vergleich; keine Kausalität ohne Konstanz. |
| Retry storm verdeckt Ursprung | retry/queue/error steigen zusammen | Retrybudget begrenzen, Idempotenz/Reconciliation beachten, Herkunft suchen. |
| Fix verbessert Mittelwert, schadet p99 | p50 besser, deadline/error schlechter | SLO-Verteilung, tenant classes, costs and failure tests vergleichen. |
| Verwaiste Profilingkonfiguration | dauerhafte Daten-/Kostenlast | TTL, inventory, cleanup owner, post-incident review. |

Ein Fehlerbild kann auch mehrfach kausal sein. Ein Remote-Timeout führt zu Retries, Retries erzeugen CPU-/I/O-Queueing, Queueing löst Timeouts für gesunde Requests aus. Die Maßnahme wird am frühesten verantwortbaren und stärksten wirkenden Punkt gewählt, nicht nur am sichtbarsten Signal.

## Security, Governance und Compliance

Debuggingzugang ist ein Produktionszugang. `strace` kann Argumente und Pfade sehen; `perf`/Callchains und `/proc` können Code- und Prozessinformationen preisgeben; Host- oder Containertelemetrie kann Mandantengrenzen verletzen. Ein Diagnoseplan enthält daher Datenklassifikation und Zugriff genauso wie die Messidee.

| Schutzbereich | Kontrolle | Nachweis |
|---|---|---|
| Prozesszugriff | eigener Testprozess oder zeitlich begrenzte, genehmigte Rolle | Ticket, RBAC, PID-/scope record. |
| Telemetriedaten | allowlist, Aggregation, Redaction, kurze Retention | schema/test evidence, retention setting. |
| Privilegien | least privilege; `CAP_PERFMON`/ptrace-/container policy nicht umgehen | permission outcome, approval path. |
| Geheimnisse | keine ungefilterten Argumente, Umgebungsvariablen, Payloads oder Raw Traces exportieren | negative data probe. |
| Multi-Tenancy | tenant class statt tenant identity; aggregierte Grenzen | isolation review. |
| Änderungssicherheit | Canary, TTL, Stopcondition, Rollback | runbook and change record. |
| Audit | Owner, Grund, Dauer, Toolrevision, Zugriff und Löschung erfassen | immutable audit/event trail. |

Compliancepflichten richten sich nach Datenklasse, Vertrags-/Branchenkontext, Jurisdiktion und Zeitpunkt. Die technische Möglichkeit einer Messung begründet keine Zulässigkeit.

## Observability und Troubleshooting

### Standarddashboard für eine Diagnose

Ein Dashboard oder Abfragefenster verbindet mindestens:

- **Outcome:** SLO, success/error, deadline, retries, client cancellations.
- **Load:** arrivals, object-size class, read/write mix, concurrency, queue age.
- **Work:** active CPU, run queue/throttle, memory/reclaim/PSI, I/O completion/queue, network/remote time.
- **Scope:** release, config, node class, cgroup/namespace class, storage/network class, tenant class.
- **Safety:** tool enabled, sampling/drop, collector CPU, data-redaction status, TTL.

Alle Werte tragen einen Zeitbereich und eine Quelle. „Kein Wert vorhanden“ wird als fehlende Beobachtbarkeit registriert, nicht als Null interpretiert.

### Systematischer Diagnoseablauf

1. **Ereignis bestätigen:** SLO, Zeitraum, Betroffene und Businessimpact anhand Produkttelemetrie prüfen.
2. **Scope reduzieren:** Release, Region/Zone, Nodeklasse, Tenantklasse, Datenform, Cachezustand und Laständerungen vergleichen.
3. **Hypothesen priorisieren:** Wähle maximal wenige, testbare Hypothesen mit erwarteten positiven und negativen Signalen.
4. **Baseline erhalten:** Vor einem Fix einen vergleichbaren Fall oder eine kontrollierte Referenz erfassen.
5. **Günstigste Messung:** Nutze zuerst Produkt-/Runtime-/cgroup-/I/O-Signale; führe ein tieferes Tool nur bei klarer Lücke ein.
6. **Gegenprobe führen:** Teste gezielt, was die Lieblingshypothese widerlegen würde. Beispielsweise konstante CPUzeit trotz hoher Latenz, oder stabile I/O-Completions trotz wachsender Requestqueue.
7. **Mitigieren:** Admission, Rate, Retry, Priorität, Featureflag oder Rollback stabilisieren den Dienst, bevor langfristiges Tuning beginnt.
8. **Ursache und Fix trennen:** Dokumentiere den Mechanismus, die Evidenz, Alternativen, Restunsicherheit, Change, Outcome und Recheck trigger.
9. **Wissen operationalisieren:** Runbook, Dashboard, SLO, Capacitymodell oder Architekturentscheidung werden aktualisiert; temporäre Instrumentierung wird abgebaut.

## Cost und FinOps

Diagnosekosten entstehen auf mehreren Ebenen:

```text
diagnosis_cost =
  engineer_and_incident_time
+ tool_and_agent_cpu_memory
+ telemetry_ingest_query_retention
+ extra_storage_and_network
+ canary_or_sandbox_capacity
+ risk_of_customer_impact
+ cost_of_wrong_capacity_or_architecture_decision
```

Die teuerste Messung ist manchmal die, die eine falsche Infrastrukturinvestition legitimiert. Ein Hochskalieren ohne Ursache kann p99 kurzfristig verdecken, lässt aber Lock-, Retry-, Daten- oder Quota-Probleme bestehen. Daher wird ein Fix nach Kosten pro erfolgreich SLO-konformer Operation verglichen: zusätzliche Node-/IOPS-/GPU-/Telemetrykosten, Fehlerquote, p99, RTO/RPO-Auswirkung und Betriebsaufwand.

Zeitabhängige Cloudpreise, CPU-/Volume-Tiers, Managed-Observability-Preise und Ingestlimits werden vor einer Entscheidung direkt beim konkreten Anbieter und Region geprüft. Dieses Kapitel liefert kein Preisversprechen.

## Trade-offs, Alternativen und Anti-Patterns

| Technik | Gut geeignet für | Nicht geeignet als |
|---|---|---|
| SLO/Trace/Metrics | Nutzerpfad, Zustände, SLOverletzung, Releasevergleich | vollständige Kernel-/CPUursachenanalyse. |
| `top` / `/proc` | schnelle, sichere Orientierung und Raten | alleiniger Perfomancebeweis. |
| `strace -c` | Syscallklassen eines eng begrenzten Prozesses | allgemeiner Production-Profiler oder Geheimnisfilter. |
| `perf stat` | Vergleich definierter gleichartiger Läufe | universeller Hardware-/Codevergleich über Plattformen. |
| PSI | Ressourcendruck auf System-/cgroup-Ebene | per-request Kausalität. |
| eBPF | gezielte Lücke mit korrekter Governance | Default für jede Latenz oder Cilium-Ersatz. |
| Skalieren | nachgewiesene nachhaltige Kapazitätsgrenze | Ersatz für unbounded retry/queue oder Leak. |
| Rollback | Regression/Change als plausible Ursache | Ersatz für Root Cause und Learnings. |

Anti-Patterns:

- Befehle sammeln, bevor eine Frage und ein Abbruchkriterium existieren.
- Auf einem fremden Prozess `strace` anhängen, weil ein Dashboard nicht reicht.
- `perf`-Zähler verschiedener CPUtypen/VMs ohne Baseline vergleichen.
- Paging-, I/O- oder CPU-Hypothesen aus einer einzelnen Auslastungszahl ableiten.
- eine sichtbare Queue vergrößern, ohne Arrival-, Service- und Retryverhalten zu modellieren.
- Debuglogs länger als nötig aufbewahren oder hochkardinale sensible Daten als Labels nutzen.
- eine Maßnahme als Erfolg ausgeben, obwohl nur p50 oder der Durchsatz, nicht aber p99, Errors, Kosten und Recovery geprüft wurden.
- Spezialtracing in Produktcode oder Standardimages dauerhaft einbauen, ohne Owner, TTL und Supportmatrix.

## Staff-, Principal- und Chief-Level Decisions

### Staff: reproduzierbarer Entscheidungsnachweis

Staff formuliert vor dem Tool: Symptom, SLO, Scope, Hypothesen, erwartete Signale, Gegenprobe, Safetybudget und Entscheidung. Das Ergebnis ist ein kleiner, nachvollziehbarer Nachweis: Warum wurde ein Rollback, Codefix, Capacity Change, Limit oder kein Change gewählt? Staff schützt den Service zuerst, reduziert Scope und macht den Fix mit Canary, Rollback und Recheck messbar.

### Principal: gemeinsame Debuggingfähigkeit

Principal schafft eine Plattform, auf der Teams nicht individuell privilegierte Diagnosen erfinden: Standarddashboards, cgroup-/release-/tenant-aware Telemetrie, Sandbox, gesicherte Profiler, Supportmatrix, Datenpolicy, Incident-Templates und SLO-basierte Capacitymodelle. Principal entscheidet, wann ein neues Instrument zentralisiert wird und wann ein Fall in bestehende Observability überführt wird.

### Chief: Risiko, Kosten und Organisationsmodell

Chief steuert den Trade-off zwischen schneller Störungsdiagnose und der Angriffs-/Datenschutz-/Betriebslast privilegierter Tools. Das Portfolio definiert On-call-Grenzen, zentrale Spezialisten, Privacy/Security-Freigaben, Kernel- und Runtime-Lifecycle, Telemetrieausgaben, Kostenowner, Lieferantenrisiko und messbaren Geschäftsnutzen. Rechecks erfolgen bei neuen Plattformen, großen Last-/Datenklassenwechseln, wiederkehrenden Incidents oder einer Änderung der gesetzlichen/vertraglichen Rahmenbedingungen.

## Production Checklist

- [ ] Das betroffene Outcome, SLO, Zeitraum, Scope und Businessimpact sind präzise dokumentiert.
- [ ] Release-, Konfigurations-, Last-, Cache- und Dependencyänderungen wurden in derselben Zeitachse geprüft.
- [ ] Für jede Hauptursache existieren erwartete und widerlegende Signale.
- [ ] Produkt-, Runtime-, cgroup-, CPU-, Memory-, I/O- und Remote-Sicht sind getrennt, aber korreliert.
- [ ] Toolwahl folgt Datenklasse, Scope, Berechtigung, Overheadbudget und Informationslücke.
- [ ] `strace`, `perf`, eBPF oder andere tiefe Tools laufen nur zeitlich begrenzt, mit Owner, Audit, Redaction und Stopcondition.
- [ ] Eine fehlende Berechtigung wird als Policygrenze dokumentiert; sie löst keine improvisierte Rechteausweitung aus.
- [ ] Mitigation, Rollback, Recovery und Idempotenz sind vor langfristigem Tuning berücksichtigt.
- [ ] Fixvalidierung vergleicht gleiche Last und bewertet p50/p95/p99, Fehler, Queue, Kosten und Nebenwirkungen.
- [ ] Temporäre Instrumentierung und Daten sind inventarisiert, abgelaufen/gelöscht und in Runbooks überführt.

## Interviewfragen mit Antwortleitfäden

### 1. Wie beginnst du eine Linux-Performanceanalyse?

Ich beginne mit der Nutzeroperation, dem SLO, Zeitfenster, Scope, Lastform und den jüngsten Änderungen. Dann bilde ich wenige falsifizierbare Hypothesen und nutze die günstigste sichere Messung. Ich starte nicht mit `perf` oder `strace`, weil ein Tool keine Fragestellung ersetzt.

### 2. Warum reicht hohe CPUauslastung nicht als Ursache?

Sie kann aktive Produktarbeit, Retry-Overhead, GC, Kompression, Nachbarlast oder eine Folge von I/O-/Netzwerkwartezeit bedeuten. Ich prüfe CPUzeit pro Request, Run Queue, cgroup throttle, Profilpfad und die Gegenhypothesen aus Memory, I/O, Lock und Remote Service.

### 3. Wann würdest du `strace` verwenden?

Für eine klar abgegrenzte Syscallfrage, idealerweise an einem selbst gestarteten Prozess oder mit ausdrücklich autorisiertem Incident-Scope. Ich bevorzuge Zusammenfassungen und begrenze Dauer/Daten. Ich behandle `strace` nicht als vollständige Programmlogik und exportiere keine sensitiven Argumente.

### 4. Was bedeutet ein hoher `futex`-Anteil?

Er zeigt eine sichtbar gewordene Synchronisationswartezeit. Er beweist keinen fehlerhaften Lock. Ich prüfe Owner, Threadzustand, Hot Key, CPU availability, I/O, Dependency und Retries, bevor ich Concurrency oder Locking ändere.

### 5. Was liefert PSI zusätzlich zu CPU-/Memory-/I/O-Auslastung?

PSI beschreibt beobachteten Ressourcendruck über Stallzeit. Das kann Warteschlangen sichtbar machen, die eine Durchschnittsauslastung verdeckt. PSI allein benennt aber weder Prozess noch Tenant noch Ursache; ich korreliere es mit cgroup und Requestdaten.

### 6. Warum ist `perf stat` über zwei Maschinen schwer vergleichbar?

CPUmodell, PMU, Virtualisierung, Frequenz, Kernel, Eventverfügbarkeit, Multiplexing, Compiler/Runtime, Daten und Lastform können abweichen. Ich vergleiche nur kontrollierte, gleichartige Konfigurationen und dokumentiere laufende/aktiv gemessene Zeit sowie Einschränkungen.

### 7. Wie gehst du mit „Permission denied“ bei einem Profilingtool um?

Ich dokumentiere es als beabsichtigte Sicherheitsgrenze. Dann prüfe ich, ob Standardtelemetrie reicht, oder nutze den genehmigten Ausnahmeweg mit Scope, Datenreview, TTL und Owner. Ich ändere weder Capabilities noch Kernelpolicy spontan.

### 8. Wie stellst du sicher, dass ein Fix nicht nur ein Mittelwert-Optimierung ist?

Ich vergleiche Stichprobengröße, p50/p95/p99, Errors, deadline/cancellations, Queue Age, Tenantfairness, Recovery und Cost per Outcome unter derselben Last. Ein Fix ohne Rollback und Recheck ist unvollständig.

## Praktisches Lab: sichere Hypothesenprüfung mit eigenem Testprozess

> **Status:** `reviewed_only`. Führe dieses Lab nur auf einer eigenen Linux-Sandbox aus. Es startet einen kleinen, selbst kontrollierten Prozess. Es attachiert niemals an eine fremde PID und installiert keine Tools, erzeugt keine Cloudkosten, verändert keine Kernelparameter und nutzt keine Produktionsdaten.

### Ziel und Hypothesen

**Hypothese A:** Ein Prozess mit absichtlicher CPUarbeit zeigt höhere eigene CPUzeit als ein Prozess, der kontrolliert schläft.  
**Hypothese B:** Eine Syscall-Zusammenfassung kann bei einem selbst gestarteten Prozess die erwartete Warte-/I/O-/Zeitklasse sichtbar machen, falls `strace` lokal vorhanden und zulässig ist.  
**Gegenhypothese:** Eine lange Wall Clock allein beweist keine CPU-Sättigung; sie kann aus `sleep`, I/O, Locks oder externer Wartezeit entstehen.

### Voraussetzungen und Grenzen

- Linux-Sandbox, `python3` **oder** ein anderer eigener, harmloser Testprozess.
- `time`, `ps`, `/proc` werden read-only verwendet; `strace` und `perf` sind optional. Keine Installation und kein `sudo`.
- Vorher `pwd`, `id` und den Zielprozess verifizieren. Nicht in Shared-/Productionumgebungen durchführen.
- Dauer maximal 30 Sekunden pro Test; Prozess wird garantiert beendet.

### Ablauf

```bash
set -euo pipefail

work_dir="$(mktemp -d "${TMPDIR:-/tmp}/kb0046-XXXXXX")"
cleanup() { rm -rf -- "$work_dir"; }
trap cleanup EXIT

cat >"$work_dir/workload.py" <<'PY'
import os, time
start = time.monotonic()
acc = 0
while time.monotonic() - start < 2.0:
    acc = (acc * 33 + 17) % 1000003
time.sleep(1.0)
print("finished", acc)
PY

python3 "$work_dir/workload.py" &
pid="$!"

printf 'pid=%s\n' "$pid"
ps -o pid,ppid,stat,etime,time,comm -p "$pid"
test -r "/proc/$pid/status" && grep -E 'State|VmRSS|Threads' "/proc/$pid/status" || true
wait "$pid"

# Optional: only execute on the same self-created workload.
if command -v strace >/dev/null 2>&1; then
  strace -c -f python3 "$work_dir/workload.py" 2>&1 | sed -n '1,80p'
else
  echo 'strace absent: no installation requested'
fi

if command -v perf >/dev/null 2>&1; then
  perf stat -- python3 "$work_dir/workload.py" 2>&1 | sed -n '1,80p' || \
    echo 'perf unavailable or not permitted: document the boundary'
else
  echo 'perf absent: no installation requested'
fi
```

### Auswertung und negative Proben

1. Notiere Wall Clock, Prozess-CPUzeit, State, Runtime-/Kernelversion, cgroup-/Containergrenze soweit sichtbar und die Toolverfügbarkeit.
2. Die CPUphase und `sleep`-Phase sind absichtlich verschieden. Wenn die Wall Clock ungefähr drei Sekunden beträgt, ist das **kein** Beweis, dass drei Sekunden CPUarbeit geleistet wurden.
3. Wenn `strace` fehlt oder abgewiesen wird, notiere die fehlende Berechtigung als erwartete Sicherheitsgrenze. Es wird nicht nachinstalliert und es werden keine Rechte verändert.
4. Wenn `perf` abgewiesen wird, gilt dasselbe. Kein `perf_event_paranoid`-, Capability- oder Kernel-Change.
5. Prüfe nach `wait`, dass `/proc/$pid` nicht mehr existiert; der `trap` entfernt die temporäre Datei.
6. Formuliere eine fachliche Entscheidung: Welches Signal würde bei einem echten SLO-Incident zuerst reichen, und welche zusätzliche Messung wäre erst nach einer offenen Informationslücke gerechtfertigt?

## Dependencies und Cross-References

- [KB-0032: Prozesse und Lebenszyklen](02-prozesse-und-lebenszyklen.md) für States, Threads und kontrolliertes Prozessende.
- [KB-0034: Virtueller Speicher und Paging](04-virtueller-speicher-und-paging.md) für Faults, Reclaim und Working Set.
- [KB-0038: cgroups und Ressourcenbegrenzung](08-cgroups-und-ressourcenbegrenzung.md) für effektive Limits und Throttling.
- [KB-0042: CPU-Scheduling und Lastverteilung](12-cpu-scheduling-und-lastverteilung.md) für Run Queue und CPUwartezeit.
- [KB-0044: Block-I/O und Engpässe](14-block-i-o-und-engpaesse.md) für I/O-/Cache-/Queue-Hypothesen.
- [KB-0045: EBPF und Kernelbeobachtung](15-ebpf-und-kernelbeobachtung.md) für gezielte, privilegiennahe Messung.
- KB-0151 und KB-0562 verwenden den Diagnosevertrag später für Observability und Plattformbetrieb.
- [KB-0720: Portfolioevidenz und Reifemodelle](../../30-architect-practice/44-portfolioevidenz-und-reifemodelle.md) sammelt Nachweise und Reifeentscheidungen.

## Quellen und Aktualitätsnotizen

| Quelle | Aussage / Verwendung | Stand |
|---|---|---|
| Dateikatalog | Verbindlicher Scope und Reihenfolge. | 2026-09-14 |
| [`strace(1)`](https://man7.org/linux/man-pages/man1/strace.1.html) | Syscall-/Signaltracing, Optionen und Zugangskontext. | Linux man-pages, abgerufen 2026-09-16 |
| [`perf_event_open(2)`](https://man7.org/linux/man-pages/man2/perf_event_open.2.html) | Performanceevents, Zähler/Sampling, Scope und Berechtigungsgrenzen. | Linux man-pages, abgerufen 2026-09-16 |
| [`top(1)`](https://man7.org/linux/man-pages/man1/top.1.html) | Task-/Ressourcenansicht und Darstellungsgrenzen. | Linux man-pages, abgerufen 2026-09-16 |
| [`proc_pid_stat(5)`](https://man7.org/linux/man-pages/man5/proc_pid_stat.5.html) | Prozessstatistiken und `/proc`-Kontext. | Linux man-pages, abgerufen 2026-09-16 |
| [Pressure Stall Information](https://docs.kernel.org/accounting/psi.html) | CPU-, Memory- und I/O-Stallindikatoren. | Linux Kernel Documentation, abgerufen 2026-09-16 |
| [KB-0044](14-block-i-o-und-engpaesse.md) | kanonische I/O-/Queue-Mechanik. | 2026-09-16 |

Kernel-/Toolversionen, PMU-Events, `perf`-Berechtigungen, `strace`-Policies, PSI- und cgroup-Sicht, Containergrenzen, Managed-Hostzugang sowie Cloudkosten sind umgebungs- und zeitabhängig. Vor einer operativen Nutzung prüft das Team sie am konkreten Zielsystem.

## Bonus: New Tech and Innovations

**Stand 2026-09-16 — PSI macht Ressourcendruck als Stallzeit sichtbar und ergänzt traditionelle Auslastungsmetriken für CPU, Memory und I/O.** **Reifegrad: Established.** Der Nutzen liegt in einer besseren Frühwarnung für wartende Tasks; die Einschränkung ist fehlende per-request oder per-process Kausalität. Ein Pilot besteht, wenn PSI mit cgroup- und Produkt-SLO-Daten korreliert wird und keine unzulässigen Labels exportiert werden. Grundlage ist die [offizielle PSI-Dokumentation](https://docs.kernel.org/accounting/psi.html).

**Stand 2026-09-16 — Profiling wird zunehmend als dauerhafte, budgetierte Plattformtelemetrie statt als unkontrollierter Incidentzugang aufgebaut.** **Reifegrad: Adopting.** Der Nutzen sind kürzere Diagnosezeiten und reproduzierbare Capacityentscheidungen; Risiken sind Datenexposition, Kernel-/Runtimekompatibilität, Kosten und Overhead. Einführung nur über zentrale Datenpolicy, Supportmatrix, Samplingbudget, TTL, Audit und Kill Switch.

**Stand 2026-09-16 — Für AI- und heterogene Plattformworkloads wird die Phasenkorrelation zwischen Request, CPU, Memory, I/O, Netzwerk und Accelerator wichtiger als ein isolierter Hostzähler.** **Reifegrad: Adopting.** Ein Pilot misst gleiche Workloadphasen und End-to-End-p99 über eine definierte Revision; er akzeptiert keine Kausalbehauptung nur aus GPU-, CPU- oder I/O-Auslastung.

