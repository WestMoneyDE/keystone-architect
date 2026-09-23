---
{"id": "KB-0034", "title": "Virtueller Speicher und Paging", "domain": "02", "sequence": 4, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["PLATFORM", "CLOUD", "GENAI", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0032", "concepts": ["Prozessadressraum", "Fork/Exec", "Ressourcenownership", "Signale und Exit"], "needed_for": "understanding"}, {"id": "KB-0033", "concepts": ["Threads", "Shared Heap", "Parallelität", "Concurrency-Budget"], "needed_for": "understanding"}], "related": ["KB-0031", "KB-0035", "KB-0036", "KB-0038", "KB-0039", "KB-0040", "KB-0565", "KB-0580", "KB-0720"], "applies": ["KB-0565", "KB-0580", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein lokales, nicht privilegiertes Lab liest sichere Prozess-/cgroup-Statistiken, erzeugt begrenzt anonyme und file-backed Zuordnungen und unterscheidet kontrolliert RSS, Cache und Leak-Symptome.", "rationale": "Das Lernziel ist eine reproduzierbare Diagnosekette ohne Änderungen an Host, Limits, Swap oder Produktion."}, "ARCHITECT-TARGET": {"active": true, "scope": "Services erhalten Memory-Budgets, Obergrenzen, Headroom, Worker-/Batchgrenzen, Daten- und Cacheownership, OOM-Verhalten sowie Load-/Failure-Testkriterien.", "rationale": "Virtueller Speicher verbindet Code, Runtime, Containerlimit, Nodekapazität und Verfügbarkeitsvertrag."}, "STAFF-TARGET": {"active": true, "scope": "Teams messen RSS, working set, page faults, GC-/Allocatorverhalten, cgroup events und Queuealter; sie vermeiden unbounded Caches, Batches und Concurrency.", "rationale": "Gemeinsame Diagnose- und Budgetmuster verhindern, dass Memory Pressure erst als zufälliger OOM sichtbar wird."}, "CHIEF-TARGET": {"active": true, "scope": "Plattform- und Kapazitätsstandards definieren Limit-Policy, Observability, Memory-Headroom, Workloadisolation, Datenhaltbarkeit und sichere Sourcinggrenzen.", "rationale": "Chief-Ebene gestaltet ein skalierbares Betriebsmodell und genehmigt Spezialtuning nur mit Evidenz."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Page-table-Walks, NUMA-Reclaim, Memory-Compaction, HugeTLB/THP-Tuning, eBPF-MM-Analyse, Kernelallocatoren und GPU unified memory sind Spezialistenvertiefungen.", "rationale": "Die Zielrollen beurteilen Wirkung und Eskalationsbedarf, ohne Kernel-/Hardwareoptimierung zu behaupten."}}, "lab_validation": [{"lab_id": "KB-0034-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Geplantes lokales, nicht privilegiertes Linux-/Container-Lab mit synthetischen Daten", "evidence": "Die Labanleitung enthält sichere Leseschritte, Invarianten, negative Proben und Cleanup. Sie wurde als Fallarbeit gegen die Quellen- und Betriebsgrenzen geprüft.", "limitations": "Keine cgroup-, Swap-, Huge-Page-, Kernel-, Container-Runtime-, Cloud-, GPU- oder Produktionskonfiguration wurde ausgeführt oder als geprüft behauptet."}]}
---
# Virtueller Speicher und Paging

> **Ziel:** Lies Speichernutzung als Ursache-Wirkungs-Kette: Ein Prozess reserviert virtuellen Adressraum, faultet Seiten bei Zugriff ein, hält einen Teil resident, teilt File Cache mit dem System und kann unter cgroup- oder Hostdruck reclaimen, swappen, stallen oder vom OOM-Killer beendet werden. RSS allein erklärt diese Kette nicht.

## Purpose, Definition und Scope

Virtueller Speicher abstrahiert physische Seiten von Anwendungen. Jede Speicherreferenz nutzt eine virtuelle Adresse; die CPU übersetzt sie über hierarchische Seitentabellen in eine physische Adresse. Linux kann dadurch nur benötigte Daten resident halten, Speicher schützen und kontrolliert zwischen Prozessen teilen. Die Kernel-Dokumentation beschreibt Seitenrahmen, Seitentabellen, TLB, Page Cache, anonyme Speicherbereiche, Reclaim, Compaction und OOM als zusammenhängendes Modell.

Dieser Artikel behandelt Adressräume, Seitentabellen, Demand Paging, Page Faults, Copy-on-Write, Page Cache, RSS, Swap, cgroup-v2-Memorygrenzen, OOM und Leakdiagnose. Er gibt keine allgemeingültigen Zahlen für Limits oder Tuningflags vor: Seitenformat, Kernel, Distribution, Containerplattform, Runtime, Datensatz und Workload entscheiden.

### Lernziele

1. Virtuellen Adressraum, residenten Speicher, Page Cache, Swap und physische RAM-Nutzung unterscheiden.
2. Minor/Major Page Fault, Demand Paging, Copy-on-Write und TLB als Leistungsmodell erklären.
3. Einen Container-/Service-OOM von Leak, Cachewachstum, Batchspitze, Fragmentierung und Node Pressure trennen.
4. `mmap`, anonyme Zuordnung, file-backed mapping und Advisory-Hinweise in ihrer Verantwortung einordnen.
5. Memory-Budget, Headroom, Concurrency und Queuegrenzen für Backend- und AI-Workloads zusammen planen.
6. Grenzen von THP, HugeTLB, Swap und Kernel-/cgroup-Tuning verstehen und Spezialistenfälle erkennen.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Adressübersetzung, Faults, COW, Reclaim, OOM und cgroup-Hierarchie können präzise als Diagnosemodell erklärt werden. |
| HANDS-ON-TARGET | Lokale Messung arbeitet mit synthetischen Daten, ohne Limits, Swap oder Hostkernel zu verändern. |
| ARCHITECT-TARGET | Workloads haben begründete Budgets für Heap, Cache, Batch, Concurrency, Queue, native Speicher und Headroom. |
| STAFF-TARGET | Teams etablieren Messung, Failure-Proben und sichere Defaults gegen unbounded Memoryverbrauch. |
| CHIEF-TARGET | Plattformstandards verbinden Limits, Workloadisolation, Kapazität, Kosten, Datensicherheit und Supportmodell. |
| SPECIALIST-OPTIONAL | Kernel-MM, NUMA, Huge Pages und hardware-/GPUnahe Optimierung verlangen Spezialwissen. |

## Mental Model: Reservieren ist nicht Residentsein

```text
virtual address space
  |  mappings / reservations
  v
page tables + permissions
  | access to missing page
  v
page fault -> zero page / file cache / allocate / COW
  |                    |
  v                    v
resident anonymous     file-backed page cache
  \                    /
   reclaim / writeback / swap (if configured)
            |
            v
cgroup or host cannot make progress -> OOM selection
```

Vier Zahlen werden häufig verwechselt:

| Begriff | Frage | Fehlinterpretation vermeiden |
|---|---|---|
| Virtuelle Größe / mapped address space | „Welche Bereiche könnte der Prozess adressieren?“ | große virtuelle Reservierung ist nicht automatisch RAMverbrauch |
| RSS | „Welche Prozessseiten sind derzeit resident?“ | RSS ist kein vollständiger Container-/Node-Footprint und kann shared pages anders darstellen |
| Page Cache | „Welche Dateidaten hält der Kernel im RAM?“ | verfügbarer Cache ist oft reclaimbar, nicht „ungenutzter Fehler“ |
| cgroup memory current/limit | „Welche Nutzung und Grenze gelten für diese Workloadhierarchie?“ | Pod-/Containerlimit ersetzt kein Anwendungsbudget |
| Swap | „Welche anonyme Seiten liegen ausgelagert?“ | Swap kann Kapazität erkaufen, aber Latenz und Failureverhalten verändern |

Eine robuste Diagnose fragt: **Welcher Speicher ist es, wem gehört er, ist er reclaimbar, wächst er weiter, und welche Allocation löst den sichtbaren Fehler aus?**

## Prerequisites und Dependencies

| Abhängigkeit | Anwendung |
|---|---|
| [KB-0032 Prozesse und Lebenszyklen](02-prozesse-und-lebenszyklen.md) | Prozessadressraum, Fork/Exec, Signals, Exit und OOM-Folge. |
| [KB-0033 Threads und Parallelität](03-threads-und-parallelitaet.md) | Shared Heap, Stacks, Concurrency, Pools und Queuegrenzen. |
| KB-0031 Linux Kernel und Systemaufrufe | User-/Kernelgrenze, `mmap` und Systemaufrufe. |
| KB-0036 Namespaces und cgroups | Containergrenzen, cgroup hierarchy und Memorycontroller. |
| KB-0038 Linux Performance Analysis und eBPF | Messung von Faults, Reclaim und Stalls. |
| KB-0580 AI Infrastructure, GPU und Inference | Host-RAM, Modellgewichte, KV Cache und Accelerator-Speicherbudget. |

## Core Concepts

### Demand Paging, Seitentabellen und TLB

Physischer Speicher ist endlich und nicht zwingend zusammenhängend. Seitentabellen bilden virtuelle Seiten auf physische Page Frames ab; mehrstufige Tabellen reduzieren den Aufwand für riesige Adressräume. Translation Lookaside Buffers cachen Übersetzungen. Große Working Sets oder ungünstige Zugriffsmuster können TLB-Misses verursachen. Linux unterstützt auf geeigneten Architekturen große Zuordnungen; HugeTLB und Transparent Huge Pages sind unterschiedliche Mechanismen und keine pauschale Optimierung.

**Page Fault** heißt zunächst nur: Die aktuelle virtuelle Adresse hat keine unmittelbar verwendbare Translation mit den nötigen Rechten. Der Kernel kann eine Zero Page zuordnen, eine anonyme Seite anlegen, eine Datei-/Cache-Seite laden, eine COW-Seite kopieren oder bei ungültiger Adresse ein Signal auslösen. Page Faults sind normal; problematisch werden Rate, Latenz, Major-Fault-Anteil, Direct Reclaim, Workload-SLO und Fehlerfolge.

### Anonymous Memory, file-backed mapping und Page Cache

Heap und Stack sind typischerweise anonymous memory. Linux beschreibt, dass anonyme Mappings zunächst virtuelle Bereiche sein können; bei Lesezugriff entsteht eine Zuordnung zur speziellen Nullseite, beim Schreiben wird eine reguläre physische Seite allokiert. File-backed Daten laufen über den Page Cache: Ein Read füllt Cache, ein Write markiert Seiten dirty, Writeback persistiert später.

Folge: Ein Prozess kann stabile RSS haben, während Node- oder Containerdruck durch Cache, andere Workloads oder Kernelverbrauch steigt. Umgekehrt ist freier RAM allein kein Ziel; Cache kann I/O sparen und wird bei Druck reclaimt.

### Copy-on-Write

Nach `fork()` können Parent und Child Seiten zunächst logisch teilen. Erst ein Schreibzugriff verlangt eine private Kopie. Das spart beim schnellen `exec` Arbeit, kann aber bei großen schreibenden Kindern einen plötzlichen Memoryanstieg verursachen. Runtime-, Preload- und Worker-Design darf COW daher nicht als dauerhaft kostenlose Sharingstrategie behandeln. Frage bei einem Spike: *forkte ein Prozess, änderte er viele Seiten, wuchs Heap oder wurde ein Mapping privat?*

### Reclaim, Direct Reclaim, Compaction und OOM

Reclaim räumt Seiten frei, die verworfen oder ausgelagert werden können. Unter moderatem Druck arbeitet `kswapd` asynchron; bei stärkerem Druck kann eine Allocation Direct Reclaim auslösen und den anfragenden Pfad stallen. Compaction versucht, zusammenhängende physische Bereiche zu schaffen. Wenn der Kernel nicht genügend Speicher reclaimen kann, wählt der OOM-Killer einen zu opfernden Task, damit das System weiterarbeiten kann.

Ein OOM ist keine Ursache. Er ist ein Endzustand nach Budgetüberschreitung, fehlender Reclaimbarkeit, Memorylimit, Fragmentierung oder Systemdruck. Die Diagnose muss `memory.events`, Prozess-/Runtime-Metriken, Queue/Concurrency, Datensätze, Kernellogs und den zeitlichen Lastverlauf verbinden.

### cgroup v2 Memory als hierarchischer Vertrag

cgroup v2 organisiert Prozesse hierarchisch und verteilt Ressourcen kontrolliert. Standardmäßig gehören alle Threads eines Prozesses derselben cgroup an; Controller und Limits sind hierarchisch, nähere Grenzen können elterliche Restriktionen nur weiter beschränken. Der Memorycontroller ist daher keine private Containeroption: Ein Pod-/Servicebudget wirkt innerhalb einer Node- und Plattformhierarchie.

Entscheide nie allein aus einem YAML-Limit. Prüfe: Ist der Controller aktiviert? Welcher Elternbudgetpfad gilt? Welche Usage-, Event- und Pressure-Signale liefert die Zielplattform? Wie behandelt Orchestrator/Runtime den Exit? Die konkrete Implementierung wird auf Zielkernel und Plattform validiert.

## Architecture und Data Flow: Memory Budget eines AI-Backends

```text
request admission
  -> bounded input / parser
  -> bounded retrieval / cache
  -> bounded model or tool call
  -> result stream / durable output

Memory domains:
  runtime heap + stacks + native allocations
  + page cache / mapped index
  + queue buffers / request bodies
  + model weights / KV-cache / accelerator allocations
  + observability buffers
  + operating headroom
```

Ein Memorybudget ist ein Gleichgewicht, keine einzelne Limitzahl:

```text
limit >= stable runtime
       + peak concurrent work
       + bounded queue/batch buffers
       + cache policy allowance
       + native/allocator overhead
       + observability overhead
       + safety headroom
```

Ein Vektorindex kann file-backed gemappt sein, ein Reranker native Speicher allokieren, ein Modelserver Host-RAM und GPU-Speicher getrennt nutzen und ein Stream pro Request Buffers halten. Deshalb werden Komponenten nach Speicherprofil isoliert: API, Retrieval, Batchworker, Inference und ETL erhalten getrennte Limits, Concurrency und Rolloutpfade. Eine gemeinsam unbegrenzte Runtime schafft Cross-Workload-OOMs und zerstört Diagnose.

## Protokolle, Standards und Tools

| Quelle/Werkzeug | Nutzen | Grenze |
|---|---|---|
| Kernel MM Concepts | virtuell/physisch, Cache, Reclaim, Compaction, OOM | Semantik, keine Zielumgebungsmessung |
| `mmap(2)` | file-/anonymous mapping, Schutz, Flags | falsche Mappingwahl kann Sicherheit/Fehlerverhalten ändern |
| `madvise(2)` | Advisory für Zugriffs-/Reclaimverhalten | Hinweis, kein Ersatz für Datenmodell oder Test |
| `/proc/<pid>/status` | Prozessstatus inkl. Speichermetriken | Momentaufnahme; Version/Kernel beachten |
| cgroup v2 | Hierarchie, Controller, memory events/limits | Plattform kann Zugriffe abstrahieren |
| Runtime profiler | Heap, Allocations, GC, native memory | nur mit Datenschutz-/Accessregeln |
| Trace/metrics | Queueage, batch size, OOM exit, cache hit, fault/reclaim signals | Labels begrenzen, PII vermeiden |

## Konfiguration und Implementierung

### Memory Contract pro Workload

```yaml
workload: retrieval-api
owner: search-platform
memory:
  limit: derived_from_measured_profile
  stable_baseline: measured
  peak_concurrency: bounded
  request_body_bytes: bounded
  queue_items_and_bytes: bounded
  cache: explicit_eviction_and_maximum
  native_memory: identified_or_unknown_risk
  headroom: explicit
failure:
  on_memory_pressure: shed_load_then_degrade
  on_oom_exit: classify_and_stop_crashloop
observability:
  metrics: [rss, cgroup_current, cgroup_events, queue_age, allocation_rate, gc_or_runtime_pause]
```

Jede `bounded`-Angabe braucht tatsächlichen Wert, Owner und Testbeleg in der implementierenden Umgebung. Der Vertrag verhindert den Fehler, eine Heap-Grenze mit dem gesamten Prozessfootprint gleichzusetzen.

### Cache und Batch richtig begrenzen

- Caches haben **maximalen Eintrag-/Bytewert**, TTL oder Evictionpolicy, Hit-/Missrate, Owner und Degradation bei Ausfall.
- Batches haben maximale **Elementzahl und Bytes**, Cancellation, Teilfehlerregeln und keine unbounded Akkumulation.
- Streams verwenden Backpressure und begrenzte Outputbuffer statt komplette Antworten im Speicher.
- Queues begrenzen Elemente **und Bytes**; sehr wenige große Payloads können ein Elementlimit umgehen.
- Libraries mit nativer Allokation, Mappings oder Subprozessen werden ausdrücklich inventarisiert.
- Memorylimits werden gemeinsam mit CPU, concurrency, connection pools und GPUbudgets gewählt; eine höhere Parallelität verändert Spitzen.

### Swap, THP und Huge Pages

Swap, Transparent Huge Pages und HugeTLB verändern Latenz, Reclaim- und Kapazitätsverhalten. Der Kernel dokumentiert, dass Huge Pages TLB-Druck reduzieren können, aber HugeTLB vorab konfigurierte Ressourcen braucht; THP ist transparenter, bleibt jedoch workload- und distributionsabhängig. Für Standardanwendungsworkloads gilt: erst Profil, Zielplattform, Failuretest und Supportowner; keine generischen Systemänderungen aus einem Artikel übernehmen.

## Scalability und Performance

Speicher skaliert nicht nur mit Requestzahl. Ein einfaches Modell ist:

```text
peak memory ≈ baseline + (in_flight × per_request_peak)
              + queue_bytes + cache + native/fragmentation + headroom
```

Die unabhängigen Variablen sind wichtig: Ein Modellaufruf kann Token-/KV-Cachebedarf mit Eingabelänge multiplizieren; ein CSV-/JSON-Batch kann Dekompression und Objektgraph vervielfachen; ein Retry kann Payload mehrfach gleichzeitig halten. Plane deshalb p95/p99-Größen und Fehlerpfade, nicht nur Durchschnitt.

| Symptom | Wahrscheinliche Hypothesen | Nächster Nachweis |
|---|---|---|
| RSS wächst stetig über Idlezyklen | Leak, Cache ohne Eviction, native Allocation | Heap-/native Profile und Objekt-/Mappingtrend |
| RSS springt bei Last und fällt zurück | Batch, Concurrency, request buffer | in-flight, payload bytes, batch size, GC/allocator |
| OOM bei stabiler App-RSS | cgroup accounting, Cache/andere Prozesse, native/GPU/sidecar | cgroup events/current, Pod-/Nodeaufteilung |
| hohe Latenz ohne OOM | direct reclaim, major faults, swap, compaction | fault/reclaim/pressure zusammen mit traces |
| großer VSZ, geringer RSS | Reservierung/mapping | Accesspattern und resident pages prüfen |
| Modellserver bricht bei langen Prompts | KV cache/parallel sequences | token length, active sequences, GPU/host budget |

## Reliability und Failure Modes

| Failure Mode | Erklärung | Gegenmaßnahme |
|---|---|---|
| Heap Leak | nicht mehr benötigte Objekte bleiben erreichbar | Ownership, eviction, heap diff, Canary |
| Native Leak | Runtimeprofil sieht nicht alle Allocations | native library inventory, process/cgroup trend |
| Cache Explosion | unbounded keys/bytes/TTL | maximum bytes, eviction, tenant fairness |
| Batch Spike | große Daten plus Transformationen gleichzeitig | byte cap, streaming, small batches |
| COW Spike | forked child schreibt viele Seiten | lifecycle/design prüfen, target-test |
| Queue Pressure | Arbeit wartet im Memory | item+byte cap, admission/defer |
| Direct Reclaim Stall | Allocation wartet auf Reclaim | Load shed, headroom, profile, capacity |
| OOM Kill / cgroup OOM | Budget oder Fortschritt erschöpft | Ereignis korrelieren, Crashloop stoppen, Ursache korrigieren |
| Page-cache Verwechslung | „RAM voll“ ohne Ownershipmodell | reclaimability/working set analysieren |
| THP/Huge-Page Überraschung | Latenz/Fragmentierung/Limitinteraktion | Spezialistenreview und Test |
| Swap Thrash | Kapazität wird mit Latenz bezahlt | working set, pressure, policy, platformreview |

Bei OOM gilt eine Reihenfolge: schädliche Admission senken, Crashloop stoppen, Ereigniszeit und Workloadrevision sichern, cgroup-/Runtime-/Queue-/Payloaddaten korrelieren, Ursache isolieren und erst dann Limit/Nodegröße ändern. Höhere Limits ohne Leak-/Batch-/Cacheursache verlagern den Ausfall.

## Security, Governance und Compliance

Memory ist ein Sicherheits- und Datenschutzthema. Unbounded Parsing, Decompression, Prompt-/Uploadgröße, Retrievalfan-out und Cachekeys sind DoS-Flächen. Speicherdiagnosen können Payload, Secrets oder PII offenlegen. Setze Größenlimits vor teurer Dekodierung, tenantbezogene Budgets, sichere Parser, Redaction und zugriffsgesteuerte Profiler/Dumps ein.

Datenlebenszyklen gelten auch in RAM: Cache-/mapping-/temporary-file-Ownership, TTL, Verschlüsselungs-/Keygrenzen und sichere Löschung werden für sensible Workloads auf Architektur- und Plattformebene geprüft. Ein OOM darf keine unvollständige Side Effect als Erfolg markieren; durable Commit, Idempotenz und Reconciliation gehören zum Fehlervertrag.

## Observability und Troubleshooting

Erfasse zeitkorreliert:

```text
revision, workload, tenant tier, request bytes, in_flight,
queue items/bytes/age, rss, mapped/virtual, cgroup current/max/events,
allocation rate, GC/runtime pause, page faults, cache hit/bytes,
OOM exit and kernel/platform event, result/commit outcome
```

Keine Request-ID oder Prompt als hochkardinales Metriklabel. Diese Daten gehören, redigiert, in Traces/Logs.

**Diagnosepfad:**

1. Ist es OOM, Latenz/Stall oder nur hoher reservierter Adressraum?
2. Welche cgroup/Pod/Nodegrenze und welches Event gelten zur Fehlerzeit?
3. Wächst der Wert dauerhaft, lastproportional oder bei einem Revision-/Datensatzwechsel?
4. Welche Kategorie: Heap, native, mappings, cache, queue, batch, sidecar, GPU host allocation?
5. Welche Admission-/Concurrency-/Payload-/Tokenwerte lagen vor?
6. Gibt es Direct Reclaim, Fault-/I/O-/GC-/Dependencywartesymptome?
7. Kann eine kleine, synthetische Gegenprobe die Hypothese unterscheiden?
8. Roll out mit Canary, Alert und Rückbauplan.

## Cost und FinOps

RAM wird als Node-, Container-, Managed-Service- oder Acceleratorressource bezahlt; OOM und Overprovisioning kosten Verfügbarkeit bzw. Kapazität. Caches reduzieren I/O, können aber Memorykosten und tenantbezogene Ungleichheit erhöhen. Große Queues verschieben statt lösen und führen zu späteren Compute-/Token-/Retrykosten.

| Hebel | FinOps-Entscheidung |
|---|---|
| Memory headroom | gegen Restart-/Tail-Latency-Risiko abwägen, auf Messdaten basieren |
| Cache | Hit-Rate und vermiedene I/O gegen RAM-/Eviction-/Fairnesskosten messen |
| Batch/Concurrency | Throughput gegen Peakmemory, provider-/GPUkosten und Queueage abwägen |
| Modellkontext | Token-/KV-memorybudget pro Tenant/Request begrenzen |
| Telemetrie | ausreichendes Sampling statt Speicher-/PII-intensiver Dumps dauerhaft sammeln |

## Trade-offs und Anti-Patterns

- **„Freier RAM ist immer gut.“** Page Cache kann nützlich und reclaimbar sein.
- **„RSS ist die ganze Wahrheit.“** Native, shared, cgroup-, cache- und acceleratorbezogene Nutzung fehlen im einfachen Blick.
- **„Ein höheres Limit löst OOM.“** Es kann den nächsten Ausfall verzögern und Node Density verschlechtern.
- **„Heaplimit begrenzt den Prozess.“** Stacks, native Libraries, mappings, buffers und Runtimeoverhead bleiben.
- **„Unbounded Cache ist Performance.“** Ohne Bytebudget ist er ein Leak mit anderem Namen.
- **„Swap verhindert Ausfälle.“** Sie verändert besonders Tail Latenz und muss zur SLO-/Plattformpolicy passen.
- **„Huge Pages sind universell schneller.“** Sie ändern Fragmentierung, Accounting und Betrieb.
- **„OOM ist ein zufälliger Infrastrukturfehler.“** Oft liegt die Ursacheninformation in Workload-/Budget-/Datenpfad.

## Staff-, Principal- und Chief-Level Decisions

**Staff:** erstellt Memory Contracts, wiederverwendbare bounded-cache/-queue/-batch Bausteine, Dashboard- und Failuretestvorlagen. Es macht native Allocation und cgroup events im Service sichtbar und verhindert falsche RSS-Schlüsse.

**Principal:** trennt Workloads nach Profil und Failure Domain, verbindet Appbudgets mit Node-/Autoscaling-/Storage-/GPUgrenzen und entscheidet, ob Streaming, Sharding, Precomputation oder Managed Service das geeignetere Kosten-/Reliabilitymodell liefert.

**Chief:** definiert Mindestpolicy für Limits/Headroom, Profilingzugriff, OOM-Handling, Capacity Forecast und sensible Diagnostic Data. THP/HugeTLB, Swap, Kernelparameter und nodeweite Spezialtuningmaßnahmen werden nur mit Supportowner, Testbeleg, Rückbau und klarer wirtschaftlicher Begründung zugelassen.

## Production Checklist

- [ ] Heap, native, mappings, cache, queue, batch und observability buffers sind inventarisiert.
- [ ] In-flight, Payload, Token, Batch, Queue items und Queue bytes sind begrenzt.
- [ ] Cache besitzt Bytegrenze, Eviction, TTL/Invalidation, Owner und Hit-/Costmetriken.
- [ ] cgroup-/containerlimit, Headroom, Node Density und platformseitige OOM-Reaktion sind verstanden.
- [ ] OOM-/memory events, RSS, queue age, allocation trend und Revision sind korrelierbar.
- [ ] Service kann bei Pressure Admission senken oder degradieren, bevor er unkontrolliert abstürzt.
- [ ] Durable Wirkung/Ack bleibt bei OOM/restart korrekt und reconcilierbar.
- [ ] Load-, große Payload-, Cache-, Cancellation- und OOM-nahe Failureproben sind geplant.
- [ ] Dumps/Profile sind redigiert, zugriffsgesteuert und zeitlich begrenzt.
- [ ] Kernel-/Swap-/THP-/HugePage-Änderungen besitzen Spezialistenreview und Rollback.

## Interviewfragen mit Modellantworten

### Was unterscheidet VSZ, RSS und Page Cache?
VSZ beschreibt virtuellen adressierbaren Bereich, RSS resident zugeordnete Prozessseiten und Page Cache dateibasierte Daten im RAM. Sie beantworten verschiedene Fragen. Für eine OOM-Diagnose kombiniere ich sie mit cgroup usage/events, native Speicher, Queue und Workloadlast.

### Warum sind Page Faults nicht automatisch Fehler?
Demand Paging erzeugt sie normal beim ersten Zugriff oder beim Laden file-backed Daten. Kritisch sind Rate, Major-Fault-/I/O-Folge, Direct Reclaim, Tail-Latency und SLO. Ich messe Ursache und Auswirkung statt eine Zahl isoliert zu optimieren.

### Was ist Copy-on-Write beim Fork?
Parent und Child können Seiten zunächst teilen; beim Schreiben wird eine private Kopie benötigt. Das kann einen späteren Memory Peak auslösen. Besonders wichtig ist es bei Pre-Fork-/Worker-Designs und großen veränderlichen Heaps.

### Wie unterscheidest du Leak von Cache?
Ein Leak wächst ohne fachlich begründete Rückkehr zum Baselinezustand und hält nicht mehr benötigte Referenzen/Allocation. Ein Cache besitzt ein Owner-, Key-, Byte-, Eviction- und Nutzenmodell. Trends, Heap/native profile, Hit rate und kontrolliertes Evictionverhalten unterscheiden sie.

### Was tust du nach einem Container-OOM?
Ich stoppe schädliche Crashloops und sichere Revision/Zeit/Workloadkontext. Dann korreliere ich cgroup events/current, Prozess-/Runtimeprofil, Queue/Concurrency/Payload, Cache/Batches und Nodeumgebung. Erst eine bestätigte Ursache führt zu Code-, Budget- oder Kapazitätsänderung.

### Warum genügt ein Memorylimit nicht?
Es begrenzt nicht automatisch unbounded Concurrency, Queue, Parser, Cache, native Libraries oder die fachliche Fehlerwirkung. Es muss mit Headroom, Admission, Telemetrie, OOM-Policy und Loadtests kombiniert werden.

### Wann würdest du Huge Pages verwenden?
Nur nach gemessenem TLB-/Workingsetproblem, Zielplattformtest, Accounting-/Fragmentierungsbewertung und klarer Betriebsverantwortung. Für Standardservicecode ist es ein Spezialistenhebel.

### Welche Memoryfrage ist in GenAI entscheidend?
Die simultane Workmenge: Kontext-/Tokenlänge, aktive Sequenzen, Retrieval-/Rerankbatches, Streambuffer, Modell-/KV-Cache sowie Host- und Acceleratorgrenzen. Ein Requestlimit allein reicht nicht.

## Praktisches Lab: Address Space, RSS, Faults und begrenzte Last

> **Status:** `reviewed_only`. Die folgenden Schritte sind nicht ausgeführt. Sie verwenden nur ein lokales, synthetisches Testprojekt und verändern keine Hostlimits, Swap-, Kernel-, THP-, HugePage-, Cloud- oder Produktionskonfiguration.

1. Starte einen eigenen lokalen Testprozess und notiere PID, Startzeit und verwendete synthetische Payloadgröße.
2. Lies in der Zielumgebung die dokumentierten, erlaubten Prozess-/cgroup-Statusdaten; notiere, welche Werte vorhanden sind, ohne sie als universell vergleichbar zu behandeln.
3. Erzeuge in einem kleinen Programm eine begrenzte anonyme Allocation, greife sie seitenweise an und miss vor/nachher Prozess- und Laufzeitmetriken.
4. Wiederhole mit file-backed Zugriff auf eine lokale Testdatei. Lösche die Datei erst nach Abschluss aller Messungen.
5. Baue eine bounded Queue und begrenze gleichzeitig Producer, Consumers, Payloadbytes und Batchgröße. Steigere nur eine Variable pro Durchlauf.
6. Negative Probe: entferne im isolierten Code die Cachebytegrenze oder die Queuebytegrenze. Stoppe vor Speichererschöpfung anhand einer niedrigen lokalen Testschwelle und dokumentiere das Wachstum.
7. Negative Probe: simuliere eine abgebrochene Anfrage; verifiziere, dass Buffer, Task und Ergebnisstatus beendet/klassifiziert werden.
8. Cleanup: Prozesse beenden, Testdateien entfernen, keine Hintergrundworker und keine geänderten Systemwerte zurücklassen.

**Abnahmekriterien:** Ein Dashboard/Log zeigt Trend statt Momentaufnahme; jede Spitze ist mit Payload, in-flight, Queue und Revision korreliert; alle Limits sind als Annahme markiert; kein OOM wird absichtlich provoziert.

## Dependencies und Cross-References

- [KB-0032 – Prozesse und Lebenszyklen](02-prozesse-und-lebenszyklen.md)
- [KB-0033 – Threads und Parallelität](03-threads-und-parallelitaet.md)
- KB-0031 – Linux Kernel und Systemaufrufe
- KB-0036 – Namespaces und cgroups
- KB-0038 – Linux Performance Analysis und eBPF
- KB-0040 – Linux Service Management und Operations
- KB-0565 – Cloud Architecture und Landing Zones
- KB-0580 – AI Infrastructure, GPU und Inference
- KB-0720 – Portfolioevidenz und Reifemodelle

## Quellen und Aktualitätsnotizen

| Quelle | Verwendung | Stand |
|---|---|---|
| Dateikatalog 720 | Verbindlicher Scope. | Planstand 2026-09-14 |
| [Linux MM Concepts](https://docs.kernel.org/admin-guide/mm/concepts.html) | virtuelle/physische Seiten, TLB, Cache, anonymous memory, reclaim, compaction, OOM. | Abgerufen 2026-09-15 |
| [cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html) | Hierarchie, Prozess-/Threadzuordnung und Controllersemantik. | Abgerufen 2026-09-15 |
| [mmap(2)](https://man7.org/linux/man-pages/man2/mmap.2.html) | Speicherzuordnungen. | Linux man-pages 6.19, abgerufen 2026-09-15 |
| [madvise(2)](https://man7.org/linux/man-pages/man2/madvise.2.html) | Advice für Mapping-/Zugriffsverhalten. | Linux man-pages 6.19, abgerufen 2026-09-15 |
| [proc_pid_status(5)](https://man7.org/linux/man-pages/man5/proc_pid_status.5.html) | Prozessstatus-/Speicherbeobachtung. | Linux man-pages 6.19, abgerufen 2026-09-15 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — Memory Pressure wird in modernen Plattformen zunehmend als frühes Steuerungssignal statt als letzter OOM-Befund behandelt.** cgroup-v2-Events und Workloadtelemetrie erlauben Load Shedding vor Restart. **Reifegrad: Established für Linux-/Containerplattformen, implementationsabhängig.** Ein Pilot korreliert Queuealter, memory events und Resultatqualität in einem nicht kritischen Service.

**Stand 2026-09-15 — AI-Inference verbindet Context-/KV-Cache-, Host-RAM- und Acceleratorbudget enger als klassische Requestserver.** **Reifegrad: Adopting.** Ein Pilot begrenzt Tokenlänge, aktive Sequenzen, Streambuffer und Tenantbudget gemeinsam; ein GPU-OOM wird nicht durch mehr CPU-RAM „behoben“.

**Stand 2026-09-15 — THP, HugeTLB und speichernahe Hardwareoptimierung bleiben wirkungsvolle, aber spezialisierte Hebel.** **Reifegrad: Established im Spezialbetrieb.** Ein Pilot hat vorab Profilhypothese, Plattformowner, Accounting-/Failuretest und Rückbau; er ersetzt keine Cache-/Batch-/Concurrencydisziplin.

