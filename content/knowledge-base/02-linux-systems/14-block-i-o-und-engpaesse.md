---
{"id": "KB-0044", "title": "Block-I/O und Engpässe", "domain": "02", "sequence": 14, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["PLATFORM", "CLOUD", "GENAI", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0034", "concepts": ["Page Cache", "Dirty Pages", "Memory Pressure"], "needed_for": "understanding"}, {"id": "KB-0035", "concepts": ["VFS", "Filesystem", "fsync und Persistenzgrenze"], "needed_for": "understanding"}, {"id": "KB-0038", "concepts": ["cgroup v2", "Ressourcenisolation"], "needed_for": "both"}, {"id": "KB-0042", "concepts": ["CPU Scheduling", "Run Queue", "CPU Throttling"], "needed_for": "both"}], "related": ["KB-0036", "KB-0040", "KB-0043", "KB-0045", "KB-0565", "KB-0580", "KB-0720"], "applies": ["KB-0565", "KB-0580", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein lokales, begrenztes Dateilab trennt Cache-, I/O- und CPU-Hypothesen und liefert ein Messprotokoll samt Gegenproben.", "rationale": "Nur ein eigener temporärer Pfad ist zulässig; keine Raw Devices, keine Produktionsvolumes und keine cloudkostenpflichtigen Ressourcen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Architekturentscheidungen vergleichen Datensatzgröße, Zugriffsmuster, Persistenzvertrag, Multi-Tenancy, SLO und Kosten zwischen Cache, Local Disk, Block Storage und Object Storage.", "rationale": "Die Entscheidung wird durch gemessene End-to-End-Latenz und Wiederanlaufgrenzen begründet."}, "STAFF-TARGET": {"active": true, "scope": "Ein Team erhält ein standardisiertes Engpassprotokoll, Lastbudgets, Backpressure-Semantik und sichere Benchmarkregeln.", "rationale": "So werden Queue-Wachstum und Tail-Latenz vor produktiven Zwischenfällen sichtbar."}, "CHIEF-TARGET": {"active": true, "scope": "Storage-Klassen, Datenresidenz, Ausnahmen für lokale Medien, Kostenallokation und Ownership bilden ein überprüfbares Plattformportfolio.", "rationale": "Eine lokale Optimierung darf Resilienz, Compliance, Portabilität und Kostensteuerung nicht unterlaufen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "blk-mq-Interna, NVMe-Queueing, io_uring, eBPF-Block-Trace, Device-Firmware und Kernel-/Filesystem-Tuning sind Spezialistentiefe.", "rationale": "Die Kernrolle kann Evidenz, Risiko und Betriebsfolgen bewerten, ohne ungetestete Kernelparameter vorzugeben."}}, "lab_validation": [{"lab_id": "KB-0044-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplantes lokales Linux-Sandbox-Lab mit temporärem Verzeichnis", "evidence": "Ablauf, Messhypothesen, negative Proben und Cleanup fachlich geprüft.", "limitations": "Nicht ausgeführt; keine Raw Devices, Produktionsvolumes, Root-Änderungen, Cloud-Ressourcen oder Performanceaussagen behauptet."}]}
---
# Block-I/O und Engpässe

> **Ziel:** Ein langsamer Request ist nicht automatisch ein „langsames Laufwerk“. Diese Datei macht den Pfad vom Anwendungsaufruf bis zur Geräteantwort nachvollziehbar und trennt CPU-Arbeit, Speicherreclaim, Queueing und Storage-Sättigung mit belastbaren Messhypothesen.

## Purpose, Definition und Scope

Block-I/O ist die Übertragung von Daten in adressierbaren Blöcken zu oder von einem Blockgerät. Eine Anwendung arbeitet meist auf Dateien. VFS und Dateisystem übersetzen diesen Zugriff; gepufferte Zugriffe laufen häufig über den Page Cache; erst danach kann der Linux-Block-Layer eine Anfrage an Treiber und Gerät übergeben. Der tatsächliche Persistenzpunkt einer geschäftlichen Änderung ist ein separater Vertrag aus [KB-0035](05-dateisysteme-und-persistenzpfade.md).

Diese Datei behandelt Page Cache, Writeback, direkte Zugriffe, Block-Multi-Queue, Queueing, Latenz und Sättigung. Sie erklärt nicht jedes Dateisystem, keine Datenbank-Interna und keine Storage-Array-Firmware. Diese Details gehören in ihre kanonischen Dateien, sobald sie im Plan folgen.

Nach der Bearbeitung kannst du:

1. einen Read- oder Write-Pfad über Anwendung, Cache, Dateisystem, Block-Layer und Gerät skizzieren;
2. Latenz, Durchsatz, Auslastung und Queue-Länge als unterschiedliche Messgrößen erklären;
3. eine I/O-Hypothese gegen CPU- und Memory-Pressure-Hypothesen prüfen;
4. den Einsatz von Buffering, `fsync`, `O_DIRECT`, Advice-Hinweisen und asynchronem I/O begründet eingrenzen;
5. für einen Multi-Tenant-Workload Backpressure, Schutzklassen, Wiederanlauf und Kosten als einen gemeinsamen Vertrag entscheiden.

## Kompetenzstatus: belegte Erfahrung, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Der Datenpfad, die Grenzen von Page Cache und direktem I/O sowie die Unterschiede zwischen CPU-, Memory- und I/O-Wartezeit werden hier technisch hergeleitet. |
| HANDS-ON-TARGET | Ein eigenes Sandbox-Messprotokoll zeigt denselben Datensatz mit kontrolliertem Cachezustand, begrenzter Parallelität und mindestens zwei Gegenproben. |
| ARCHITECT-TARGET | Die Speicherklasse folgt Datenlebenszyklus, Zugriffsmuster, Persistenz-SLO, Isolation, Wiederherstellung und Kosten je Ergebnis. |
| STAFF/PRINCIPAL | Teams bekommen SLO-Budgets, Admission Control, sichere Benchmarkregeln und einen einheitlichen Diagnosepfad. |
| CHIEF | Das Plattformportfolio legt Datenklassen, Residenz, Ausnahmewege, Chargeback und Verantwortlichkeiten fest. |

Die vollständigen maschinenlesbaren Marker stehen im Frontmatter. Sie aktivieren ein Lernziel oder einen eng begrenzten, belegten Praxiskontext; sie sind kein Nachweis für einen Berufstitel oder eine nicht belegte Produktionsleistung.

## Mental Model: fünf Warteschlangen statt „die Platte“

Denke an einen Auftrag, der Pakete durch fünf Stationen bringt. Jede Station hat eine eigene Warteschlange, Kapazität und Fehlergrenze:

```text
Application
  | buffered read/write, sync request, timeout
  v
Page Cache / writeback control
  | cache hit, dirty pages, reclaim, throttling
  v
VFS + filesystem
  | mapping, journal/metadata, flush ordering
  v
block layer (bio -> request, optional scheduler)
  | software contexts -> hardware dispatch queues -> tags
  v
driver / transport / device
  | controller queue, media, networked storage or virtual disk
  v
completion -> application
```

Die Analogie endet an zwei Stellen. Erstens ist ein Cache Hit keine Geräte-I/O; ein schneller Read beweist daher keine schnelle Persistenzschicht. Zweitens ist ein Write-Return oft nur die Übergabe an einen flüchtigen oder später geschriebenen Puffer. Nur ein expliziter, korrekt implementierter Persistenzvertrag kann eine Durability-Aussage tragen.

Drei Invarianten helfen bei der Diagnose:

- **Little’s Law:** Für ein stabiles System gilt näherungsweise `L = λ × W`: mittlere offene Arbeit `L` entspricht Ankunftsrate `λ` mal mittlerer Verweilzeit `W`. Steigt die Wartezeit bei gleicher Rate, wächst die offene Arbeit. Queue Depth ist daher ein Signal, keine alleinige Ursache.
- **Ein Gerät kann 100 % beschäftigt sein und dennoch das falsche Problem sein.** Ein voll ausgelasteter Datenträger kann Folge zu vieler Retries, einer Hot Partition, eines langsamen Remote-Service oder von Memory-Reclaim sein.
- **Die kritischste Kennzahl liegt am Produktpfad.** Gute MB/s aus einem Synthetic Benchmark ersetzen weder p99 der Nutzeroperation noch die Rückgewinnung nach einem Ausfall.

## Prerequisites und Dependencies

| ID | Harte Voraussetzung | Warum sie hier benötigt wird |
|---|---|---|
| [KB-0034](04-virtueller-speicher-und-paging.md) | Page Cache, Dirty Pages, Working Set, Reclaim | Buffered I/O und Memory Pressure wären sonst leicht zu verwechseln. |
| [KB-0035](05-dateisysteme-und-persistenzpfade.md) | VFS, Metadata, `fsync`, Persistenzgrenze | Block-Completion und fachliche Durability sind nicht identisch. |
| [KB-0038](08-cgroups-und-ressourcenbegrenzung.md) | cgroup-v2-Ressourcenkontext | Effective Limits und Tenant-Isolation verändern das beobachtete Verhalten. |
| [KB-0042](12-cpu-scheduling-und-lastverteilung.md) | CPU-Zeit, Run Queue, Throttling | Hohe Requestzeit kann CPU-Wartezeit statt Gerätewartezeit bedeuten. |

Hilfreiche Vertiefungen: [KB-0036](06-sockets-und-netzwerk-i-o.md) für Remote-Storage- oder API-Abhängigkeiten, [KB-0043](13-numa-und-speicherlokalitaet.md) für lokale Device-Nähe, KB-0045 für Diagnosewerkzeuge und KB-0580 für AI-Inference-Pfade.

## Core Concepts und Mechanismen

### Latenz, Durchsatz, Sättigung und Auslastung

**Latenz** ist die Zeit eines einzelnen Vorgangs, zum Beispiel `t_complete - t_submit`, gemessen als Verteilung (p50, p95, p99), nicht nur als Mittelwert. **Durchsatz** ist abgeschlossene Arbeit pro Zeit, etwa IOPS oder MiB/s. **Sättigung** liegt vor, wenn eine begrenzte Ressource schneller Arbeit annimmt als sie nachhaltig abschließen kann; dann steigt die Queue und die Tail-Latenz oft überproportional. **Auslastung** ist ein beobachteter Busy-Anteil, aber ohne Kontext zu Queue, Latenz, Fehlern und Lastprofil unvollständig.

Beispielannahme: Ein Service erhält 2.000 Schreiboperationen pro Sekunde. Jede Operation benötigt im p50 4 ms und im p99 80 ms. Unter einer mittleren Verweilzeit von 10 ms wären ungefähr 20 Operationen gleichzeitig offen. Wenn der Wert bei gleicher Ankunftsrate auf 100 ms steigt, nähert sich die offene Arbeit 200 an. Das besagt nicht, an welcher Station die Schlange entstand. Es rechtfertigt jedoch eine Suche nach einer begrenzten Kapazität oder nach höherem Rework.

### Buffered I/O und Page Cache

Bei normalem File-I/O kopiert oder mappt der Kernel Daten in den Page Cache. Ein Read kann sofort aus diesem Cache kommen. Ein Write kann zunächst Dirty Pages erzeugen und der Anwendung erfolgreich zurückkehren, bevor der tatsächliche Gerätetransfer geschieht. Writeback überführt Dirty Pages später in den Dateisystem- und Blockpfad. Unter Memory Pressure werden Seiten zurückgewonnen; bei zu vielen Dirty Pages kann ein Writer gebremst werden, damit Writeback nachkommt.

Das bringt drei Vorteile: Wiederholte Reads sparen Geräte-I/O, benachbarte Zugriffe können sinnvoll aggregiert werden, und der Kernel kann Schreibarbeit bündeln. Die Kosten sind schwerer vorhersagbare Latenz bei Writeback, Konkurrenz mit dem Anwendungs-Working-Set und eine Durability-Grenze, die man nicht aus `write()` allein ableiten darf.

### Direct I/O ist ein Kompatibilitätsvertrag, keine Beschleunigungstaste

`O_DIRECT` fordert beim `open(2)`-Aufruf, Cacheeffekte für die Datei-I/O möglichst zu umgehen. Die Linux-Manpage warnt ausdrücklich vor Ausrichtungsbeschränkungen, vor filesystemspezifischem Verhalten und davor, `O_DIRECT` mit COW-/`fork()`-Mustern auf privaten Mappings leichtfertig zu kombinieren. Das Flag kann für kontrollierte Datenbank- oder Streaming-Workloads sinnvoll sein, wenn die Anwendung eigenes Buffering, Alignment, Fehlerbehandlung und echte Messung beherrscht.

Direkte I/O kann Cache Pollution und Doppelbuffering reduzieren. Sie kann aber kleine, unaligned, wiederholte oder gemischte Zugriffe verschlechtern; sie nimmt dem Kernel keinen Persistenz-, Ordering- oder Capacity-Contract ab. Ein Architekturstandard lautet deshalb: erst Zugriffsmuster und Cachemissbrauch messen, dann ein eng begrenztes Experiment mit einer dokumentierten Runtime-, Kernel- und Dateisystemmatrix durchführen.

### Advice und asynchrones I/O

`posix_fadvise(2)` gibt dem Kernel nicht bindende Zugriffshinweise wie `POSIX_FADV_SEQUENTIAL`, `RANDOM`, `WILLNEED` oder `DONTNEED`. Ein Advice ist keine Zugriffskontrolle und keine Garantie, dass Daten im Cache bleiben oder verschwinden. Er kann gezielt hilfreich sein, wenn das Anwendungsmuster besser bekannt ist als die Heuristik; er gehört in Messung, Canary und Fallback.

`io_uring` stellt Shared Rings für Submission und Completion bereit. Die `io_uring(7)`-Dokumentation beschreibt eine gemeinschaftlich genutzte Submission Queue und Completion Queue. Das kann Syscall- und Context-Switch-Kosten bei vielen parallelen I/O-Operationen reduzieren. Es ersetzt weder Bounded Concurrency noch Backpressure. Zudem ändern Runtime, Kernel, Bibliothek und verwendete Operationen das Sicherheits- und Betriebsprofil. Ohne klaren Profilbefund wird ein asynchrones API nicht als pauschaler Performance-Fix eingeführt.

### Block Multi-Queue und Gerätepfad

Linux blk-mq nutzt Software-Staging-Queues und Hardware-Dispatch-Queues. Eine Blockanfrage entsteht aus einem oder mehreren `bio`-Objekten und wird als `request` zum Treiber übergeben. Der Kernel kann Requests direkt senden oder für Merging beziehungsweise Scheduler in eine Software-Queue stellen. Hardware-Queues repräsentieren, soweit Treiber und Gerät es unterstützen, parallele Submission-Pfade. Tags begrenzen gleichzeitig ausstehende Gerätearbeit und ordnen Comple­tions zu.

Die Kernel-Dokumentation betont zwei Grenzen: Die konkrete Queue-Anzahl stammt von Hardware und Treiber; und weder Block-Layer noch Geräteprotokoll garantieren die Reihenfolge der **Completion**. Höhere Schichten wie Dateisystem oder Anwendung müssen die benötigte Reihenfolge und Durability selbst herstellen. Ein Scheduler kann Fairness oder bestimmte Zugriffsmuster verbessern, aber seine Wahl ist Geräte-, Kernel-, Workload- und Tenant-spezifisch.

### Backpressure und Warteschlangengrenzen

Unbounded Queues verwandeln temporäre Überlast in lange Tail-Latenz, Speicherverbrauch und möglicherweise einen Ausfall bei Wiederanlauf. Der Vertrag muss an jedem Übergang benennen:

| Übergang | Begrenzung | Reaktion bei Vollstand | Beobachtung |
|---|---|---|---|
| Client zu API | Concurrent requests / deadline | 429, Retry-After oder Degradation | admission rejections, age |
| Worker zu I/O | per-tenant In-flight-Budget | pausieren, priorisieren oder retry mit Jitter | queue age, wait, cancellations |
| Dirty Writeback | Memory-/Writeback-Grenze | Kernel throttling; Anwendung muss Deadline respektieren | dirty/reclaim/blocked writers |
| Block zu Gerät | Tags / device queue | nicht mehr annehmen oder kontrolliert warten | queue depth, completion latency |
| Retry zu Dependency | Retry-Budget | fail fast, circuit break, durable retry queue | retry rate, duplicate risk |

Ein Timeout ist kein Rückgängig-Machen. Nach einem Write-Timeout muss eine fachlich idempotente Anfrage den Zustand klären können; blindes Wiederholen kann Duplikate, Medienarbeit und weitere Sättigung erzeugen.

## Architecture und Data Flow: persistenter Retrieval-Index

Die Beispielarchitektur ist absichtlich generisch. Sie behauptet kein reales Praxisprojekt.

```text
Document ingestion
  -> validation / tenant authorization
  -> bounded transform workers
  -> durable index writer
       -> buffered file or database write
       -> filesystem metadata + journal
       -> block requests
  -> acknowledgement only at defined durability boundary

Query path
  -> authorization
  -> cache / index read
  -> page cache hit OR filesystem/block/device
  -> response with deadline and backpressure
```

**Trust Boundaries:** Der Ingestion-Client darf weder Storage-Pfade noch Device-Einstellungen wählen. Der Worker erhält nur eine Tenant- und Workload-Identität. Der Storage-Adapter kontrolliert Verschlüsselung, Klassifikation, Retention und Audit. Diagnosedaten enthalten keine Dokumentinhalte oder Schlüsselmaterialien.

**Normaler Write-Pfad:** Der Writer prüft Idempotenzschlüssel, hält eine begrenzte Zahl an Writes in flight und bestätigt nur nach dem vorab definierten Persistenzereignis. Dieses Ereignis kann „durable in regional service“, „journal committed“ oder „asynchron übernommen“ bedeuten; es ist sichtbar im API-Vertrag. Ein schneller Buffered-Write ohne entsprechende Zusage ist kein Ersatz.

**Fehler- und Wiederanlaufpfad:** Bei Queue-Überlauf übernimmt ein durabler, kapazitätsbegrenzter Jobstore oder der Client erhält ein kontrolliertes Retry-Signal. Bei Device- oder Volume-Ausfall wird nach Recovery-Plan aus repliziertem beziehungsweise gesichertem Zustand wiederhergestellt. Ein künstlich erhöhter Queue-Limit verschiebt dieses Problem nur.

## Protocols, Standards und Tools

| Kategorie | Normative bzw. primäre Quelle | Was sie festlegt | Architekturrelevante Grenze |
|---|---|---|---|
| Linux Block Layer | Kernel-Dokumentation zu blk-mq | Request-/Queue-Modell, Mapping und Completion | Keine vollständige Garantie für konkrete Treiber-/Geräteperformance. |
| Dateizugriff | `open(2)`, `fsync(2)` | Flags, Fehler- und Persistenzsemantik | Dateisystem und Hardware bestimmen Details. |
| Cache Advice | `posix_fadvise(2)` | Advisory Hints | Hinweis, keine Durchsetzungs- oder Durabilitygarantie. |
| Asynchroner Pfad | `io_uring(7)` | Ring-Schnittstelle und Completionmodell | API-Einsatz ersetzt keine Kapazitätssteuerung. |
| Metrikwerkzeuge | `iostat`, `pidstat`, `vmstat`, `sar`, `fio`, eBPF-Tools | Beobachtung beziehungsweise kontrollierte Messung | Version, Rechte und Umgebung offenlegen; kein Tool-Auszug allein beweist Kausalität. |

Für File- und Device-I/O ist die Linux-ABI wichtiger als ein einzelnes Produkt. Cloud-Blockvolumes, lokale NVMe, SAN und virtuelle Disks verändern Latenzprofil, Fehlermodi, Limits, Redundanz und Abrechnung. Eine Plattformdokumentation braucht deshalb je Storage-Klasse eine geprüfte Support- und SLO-Matrix statt einer globalen „SSD schnell“-Annahme.

## Konfiguration und Implementierung: I/O-Contract statt Tuningrezept

Das folgende Beispiel ist ein **fachlicher Konfigurationsvertrag**, keine direkt ausführbare Kubernetes- oder Kernelkonfiguration:

```yaml
io_contract:
  workload: retrieval-index-writer
  data_classification: confidential
  durability_ack: "after-defined-durable-commit"
  request_deadline_ms: 1500
  admission:
    max_in_flight_per_tenant: 32
    max_global_in_flight: 400
    full_action: "return-controlled-backpressure"
  retry:
    max_attempts: 3
    exponential_jitter: true
    require_idempotency_key: true
  storage:
    class: "platform-approved-durable"
    encryption: "service-managed-with-audited-key-policy"
    locality: "declared-region-and-zone-policy"
  observability:
    dimensions: [tenant_class, operation, cache_outcome, storage_class, result]
    prohibit: [document_content, paths_with_personal_data, secrets]
  exception:
    direct_io: "only_with_benchmark_and_runtime_filesystem_matrix"
    owner: "platform-performance"
    rollback: "revert-to-buffered-path"
```

Die Implementierung muss zusätzlich vier Entscheidungen kodieren:

1. **Admission vor I/O:** Begrenze Arbeit, bevor unkontrollierte Requests den Cache, den Heap oder die Gerätequeue belasten.
2. **Persistenzstatus:** Rückgabeobjekte unterscheiden `accepted`, `durable`, `failed` und `unknown`. Nach `unknown` fragt der Client anhand der Idempotenz-ID nach, statt blind zu schreiben.
3. **Cancellation:** Eine abgebrochene HTTP-Anfrage darf nicht unklar lassen, ob der Write weiterläuft. Der Worker braucht ein dokumentiertes Cancel- oder Completion-Handling.
4. **Fallback:** Wenn die präferierte Storage-Klasse nicht verfügbar ist, wird nur auf einen vorher geprüften Pfad umgeschaltet; lokale Ephemeral-Disk ist kein stiller Ersatz für durable Daten.

## Scalability und Performance

### Ein Messplan, der falsche Schlüsse vermeidet

Definiere vor jedem Test:

- **Workload:** Objektgrößen, Read/Write-Verhältnis, Randomität, Parallelität, Warm-/Cold-Cache, Datenklassifikation und RPO/RTO-Annahme.
- **Ergebnis:** erfolgreiche Operationen, p50/p95/p99, Fehlerklasse, Queue Age, In-flight Count, CPU-/Memoryverbrauch und Kosten pro Erfolg.
- **Konstanz:** gleiche Image-, Kernel-, Runtime-, Storage-Klasse, Datenform, Clientseite, Region/Zone und Beobachtungsintervall.
- **Abbruch:** erwartete Kosten, maximale I/O-Last, kein Production Volume, keine Raw Device Writes und ein sofortiger Cleanup.

Keine einzelne Zahl beantwortet „schnell genug“. Hoher Durchsatz bei riesigen Blöcken kann kleinen Random Reads schaden. Niedrige p50 bei warmem Cache kann kalte Nachladepfade verdecken. Mehr Parallelität erhöht Durchsatz nur bis eine Ressource gesättigt ist; danach steigen Queueing und p99, während nutzbarer Durchsatz kaum wächst.

### CPU-, Memory- und I/O-Engpass unterscheiden

| Hypothese | Typische Signale | Gegenprobe | Häufiger Denkfehler |
|---|---|---|---|
| CPU-bound | hohe aktive CPUzeit, wachsende Run Queue, Profil zeigt Compute/Compression/Serialization | gleiche I/O-Menge mit weniger CPU-Arbeit oder stärkerer CPU-Klasse vergleichen | `iowait` oder Busy-Device als alleinigen Beweis lesen |
| Memory Pressure | Page faults, Reclaim, Swap/PSI, Cache-Evictions, GC-/Allocation-Wartezeit | kleinerer Working Set oder begrenzte Parallelität mit gleichem I/O-Muster | Page Cache mit freiem, „verschwendetem“ Memory verwechseln |
| I/O-bound | steigende request completion latency, queue age/depth, device-/volume-spezifische Limits, I/O errors | gleiche CPU/Memory, anderer geprüfter Storage-Pfad oder kontrollierter Cachezustand | eine hohe Queue als Ursache statt als Wirkung annehmen |
| Remote dependency | Netzwerk-RTT, serverseitige Servicezeit, Connection Pool wait | lokal reproduzierbarer File-I/O-Teil ist unauffällig | jede Remote-Latenz dem virtuellen Volume zuschreiben |
| Quota/Throttle | cgroup-/Tenantlimits, Rate-Limit-Ereignisse, Limits nach kurzer Last | erlaubtes Budget kontrolliert erhöhen oder Last fair reduzieren | Kapazität kaufen, obwohl eine Policy begrenzt |

`iowait` ist eine CPU-Buchhaltungsgröße und kein vollständiges Storage-SLO. Er kann in virtualisierten Systemen anders sichtbar sein und erfasst nicht alle Wartepfade. Korrelation über Application Trace, Runtime, cgroup, VM/Host und Storage-Service ist stärker als eine isolierte Hostzahl.

### AI- und Datenplattformbezug

Bei GenAI-Inference können Modellgewichte beim Start oder beim Cache Miss Storage lesen; während der Generierung dominieren oft GPU, KV Cache, Netzwerkstreaming oder CPU-Tokenisierung. Bei RAG-Ingestion können Embedding, Chunking, Index-Writes und Object-/Block-I/O aufeinander warten. Daher gilt:

```text
do not infer "GPU idle -> storage slow"
do not infer "storage latency -> model load path"
measure phase, bytes, queue, cache outcome and device/runtime correlation
```

Ein Plattformteam baut dafür Phasenmetriken ein: `model_load_seconds`, `cache_hit_ratio`, `index_write_queue_age`, `storage_completion_ms`, `bytes_read/written`, `accelerator_active_seconds`, `tenant_rejections` und `durability_ack_latency`. Keine Metrik enthält Prompt- oder Dokumentinhalte.

## Reliability und Failure Modes

| Ausfallbild | Frühes Signal | Sichere Reaktion | Recovery-Grenze |
|---|---|---|---|
| Device/volume latency spike | p95/p99, queue age, request timeout, Error Code | Load shed, priorisieren, I/O budget senken, Incident eröffnen | Erfolg unbekannter Writes nur idempotent klären |
| Storage full / quota | Capacity trend, `ENOSPC`, provider quota event | Schreibpfad stoppen oder degradieren; keine unendlichen Retries | erst nach Capacity-/Retention-Korrektur wieder öffnen |
| Dirty-writeback-Stall | Dirty/reclaim-Signale, blockierte Writer, steigende app latency | Admission senken, Workload pausieren, Memory-/Write-Rate untersuchen | keine globale Sysctl-Änderung ohne Owner/Rollback |
| Cache-thrashing | Hit ratio fällt, major faults, schwankende p99 | Working Set, concurrency oder Speicherklasse ändern | Warm-cache-Erfolg nicht als dauerhafte SLO-Deckung werten |
| Controller / path reset | Device errors, I/O timeout, Kernel/Service event | Failover nach Plattformvertrag; Cancel-/retry budget einhalten | Fencing und Datenintegrität vor Wiederaufnahme |
| Retry storm | timeout/retry/duplicate rate steigen zusammen | Circuit break, Jitter, stop-the-bleed, DLQ | Idempotenz- und Reconciliation-Plan nötig |
| Noisy tenant | pro-Tenant queue age und I/O share divergieren | Fair queue/admission, quota oder isolierte Klasse | keine globale Queue nur für einen Tenant vergrößern |
| Corrupt or stale replica | checksum/application invariant, repair events | Read repair/restore nach dokumentiertem Prozess | RPO/RTO und Audit Evidence gelten pro Datenklasse |

RTO, RPO und Durability sind vorab vereinbarte Ziele, keine nachträglichen Performancewerte. Eine hohe IOPS-Zahl ersetzt weder Wiederherstellungstest noch die Prüfung von Berechtigungen, Schlüsselzugang und Datenklassifikation.

## Security, Governance und Compliance

Die Assets sind Kundendaten, Indexe, temporäre Dateien, Schlüsselreferenzen, Storage-Metadaten und Diagnosedaten. Relevante Missbrauchspfade sind unautorisierte Reads über falsche Mounts oder Tenant-IDs, Datenreste auf lokalen Medien, unverschlüsselte Snapshots, Debug-Logs mit Pfaden/Inhalt, I/O-Flooding sowie unkontrollierte Benchmarks.

| Kontrolle | Umsetzung | Nachweis |
|---|---|---|
| Least Privilege | Workload-Identität erhält nur die benötigte Storage-API oder Mount-Berechtigung. | IAM-/Service-Account-Review, deny test. |
| Mandantentrennung | Tenant-ID wird an Admission, Authorizer, Storage Namespace und Telemetrie konsistent gebunden. | Cross-tenant negative probe, audit event. |
| Verschlüsselung | At rest und in transit folgen der freigegebenen Datenklasse/Key-Policy. | Key ownership, rotation, recovery test. |
| Datenlebenszyklus | Retention, Delete, Backup, Legal Hold und lokale Caches sind klassifiziert. | Lifecycle policy, erase/recovery evidence. |
| Sichere Diagnose | Zugriff ist zeitlich begrenzt, protokolliert und redigiert. | access log, redaction test. |
| Benchmark-Governance | Nur Sandbox und erlaubte Ressourcen; kein `/dev/*`-Write ohne expliziten Plattformauftrag. | Testplan, owner, cleanup evidence. |

Rechts- und Branchenpflichten hängen von Datenklasse, Verantwortungsrolle, Jurisdiktion, Vertrag und Datum ab. Encryption, Audit und Retention sind technische Kontrollen, keine pauschale Compliance-Zusage.

## Observability und Troubleshooting

### Telemetrievertrag

| Ebene | Metriken / Ereignisse | Frage |
|---|---|---|
| Produkt | Erfolgsrate, End-to-End-p50/p95/p99, Deadline, durable acknowledgement, Abbruch | Erfüllt der Vorgang sein SLO? |
| Anwendung | in-flight, queue age, retry/duplicate, Bytes, Cache Outcome, Pool wait | Entsteht Arbeit vor dem Storage? |
| Runtime / cgroup | CPU time, throttle, RSS, major faults, PSI soweit erlaubt | Wartet der Prozess auf CPU oder Memory? |
| OS / Block | completion latency, queue depth, error class, device reset | Kann der lokale Pfad die Arbeit abschließen? |
| Storage service | Limits, capacity, replication/health, API latency, cost unit | Liegt Grenze außerhalb des Hosts? |
| Governance | Tenant, Datenklasse, Storage-Klasse, Änderungsversion | Wer darf entscheiden und wem wird Last zugerechnet? |

Labels bleiben niedrig kardinal: keine Dateinamen, Request-IDs, Promptteile oder Kundendokumente als Metriklabel. Traces erhalten eine bereinigte Operation-ID; der I/O-Pfad wird mit Sample- und Retention-Policy erfasst.

### Diagnoseablauf mit Gegenbeweisen

1. **Symptom präzisieren.** Betroffen sind welche Operation, Tenants, Storage-Klasse, Region, Cache-Zustand und Prozentile? Ein p99-Anstieg ohne Lastprofil ist keine Hypothese.
2. **Zeitlinie verbinden.** Vergleiche Produktlatenz, In-flight/Queue Age, Retry, CPU, Memory Pressure, Storage Completion und relevante Change Events in demselben Fenster.
3. **Lastform prüfen.** Haben Objektgröße, Randomität, Warmth, Write Ratio, Parallelität oder Modell-/Indexrevision gewechselt?
4. **CPU-Hypothese widerlegen.** Zeigt Prozessprofil echte aktive CPUarbeit und Run Queue? Wenn nicht, ist „mehr CPU“ nicht der erste Fix.
5. **Memory-Hypothese widerlegen.** Prüfe Reclaim, Major Faults, Evictions, Allocation-/GC-Phasen und effektive Limits. Ein gefüllter Page Cache allein ist normal.
6. **I/O-Hypothese isolieren.** Nur in Sandbox oder erlaubtem Test: gleiche Datenform, gleiche Concurrency, kontrollierter Cachezustand und ein alternativer, zugelassener Storage-Pfad.
7. **Begrenzen und erholen.** Senke Admission/Parallelität, schütze kritische Tenants, stoppe Retry-Amplification und entscheide nach RPO/RTO, nicht nach einem Einzelgraphen.
8. **Nachweis bewahren.** Ursache, Gegenprobe, Änderung, Wirkung, Rollback, Kosten und offene Unsicherheit werden in Incident und Architekturregister festgehalten.

## Cost und FinOps

Kosten entstehen nicht nur durch GiB. Das Modell muss mindestens berücksichtigen:

```text
monthly_cost =
  capacity_GiB × price_per_GiB_month
+ provisioned_IOPS × price_per_IOPS_month
+ provisioned_throughput × price_per_MiBps_month
+ requests_or_operations
+ snapshots/backups/replication
+ network_and_cross_zone_transfer
+ compute_held_while_waiting
+ incident_and_operational_overhead
```

Die Terme sind nur ein Modell: konkrete Preise, Mindestwerte, Basiseinheiten, Regionen und Abrechnungsregeln sind zeitabhängig und werden am Beschaffungsdatum beim Anbieter geprüft. Für Local NVMe gehören Nodepreis, geringere Portabilität, Replication, Ersatzkapazität und Recovery-Aufwand dazu; für Remote Block Storage zusätzlich IOPS-/Throughput-Tiers und gegebenenfalls Transfer.

Die bevorzugte Allokationseinheit ist ein fachliches Ergebnis, etwa „erfolgreich durable gespeichertes Dokument“, „vollständige Indexaktualisierung“ oder „p95-konforme Inference“. Reine €/GB oder €/IOPS kann falsche Optimierungen fördern: Ein kleiner Cache spart Storage, kann aber Compute-Wartezeit und Retry erhöhen; ein teurerer Tier lohnt sich nur, wenn er End-to-End-SLO, Resilienz oder Umsatzwirkung messbar verbessert.

## Trade-offs, Alternativen und Anti-Patterns

| Entscheidung | Sinnvoll wenn | Preis / Exit |
|---|---|---|
| Buffered I/O | Wiederverwendung, general-purpose Files, Kernelcache sinnvoll | Cache kann Working Set verdrängen; Durability separat modellieren. |
| Direct I/O | Gemessene Doppelbuffering-/Cache-Pollution-Probleme, kontrollierte Runtime | Alignment, Dateisystem-/Runtime-Support, komplexere Buffer- und Fehlerlogik. |
| Local ephemeral disk | Rebuildbare, verschlüsselte Caches und temporäre Daten | Nodeverlust, Migration, Residenz und Wiederaufbau müssen akzeptiert sein. |
| Durable block storage | Filesystem-/DB-Workloads mit stabiler Latenz- und Recovery-Anforderung | Provisioning, Providerlimit, Zone-/Recovery-Abhängigkeit. |
| Object storage | Große immutable Objekte, Lifecycle, hohe Dauerhaftigkeit | Kein Drop-in-Ersatz für Low-latency POSIX-/random-write-Pfade. |
| Asynchrones I/O | Viele belegte concurrent operations mit sauberer Backpressure | mehr Zustands-/Cancellation-/Observability-Komplexität. |

Anti-Patterns:

- `O_DIRECT` als Standardflag setzen, ohne Alignment-, Dateisystem- und Workloadmatrix.
- `fsync` entfernen, um einen Durability-SLO „schneller“ aussehen zu lassen.
- Queue-Limits bei Überlast erhöhen, statt Ankunftsrate, Retry und Servicekapazität zu steuern.
- Benchmark gegen ein leeres, warmes, lokales Testsystem als Kapazitätsnachweis verwenden.
- `iowait`, Device-Busy oder ein `iostat`-Screenshot als alleinige Ursachenanalyse ausgeben.
- Lokale Disk stillschweigend für regulierte, nicht rebuildbare oder tenantübergreifende Daten verwenden.
- Systemweite Scheduler-/Sysctl-Änderungen als Incident-Reaktion ohne Eigentümer, Canary und Rollback ausführen.
- Kosten je IOPS optimieren, obwohl p99 und durable Erfolg die Geschäftsmetrik sind.

## Staff-, Principal- und Chief-Level Decisions

### Staff: Mess- und Schutzvertrag eines Dienstes

Ein Staff Engineer entscheidet nicht „der Datenträger ist langsam“, sondern formuliert einen überprüfbaren Dienstvertrag: maximale In-flight-Arbeit, Deadline, Priorisierung, Idempotenz, durable Ack-Grenze, SLO und zulässige Degradation. Evidenz sind Traces, Queue-Age-Verlauf, Lasttests mit Gegenprobe, Recovery-Übung und ein dokumentierter Rollback. Neubewertung erfolgt bei 30 Tage Kapazitätstrend, einer neuen Storage-Klasse, auffälligem p99 oder Datenklassifikationswechsel.

### Principal: gemeinsame Plattformgrenzen

Ein Principal definiert ein organisationsübergreifendes Storage- und I/O-Profil: approved classes, Standardobservability, Testharness, Datenresidenz, per-tenant fairness, Ausnahmeprozess für Direct I/O oder Local NVMe und Supportgrenzen. Optionen werden anhand von RPO/RTO, Portabilität, Cost per Outcome, Operability und Exit bewertet. Die Konsequenz einer Ausnahme ist nicht nur ein Performancegewinn, sondern auch ein Owner, eine Supportmatrix und ein Ablaufdatum der Ausnahme.

### Chief: Portfolio, Risiko und Verantwortlichkeit

Ein Chief entscheidet, welche Datenklassen und Storage-Angebote strategisch betrieben oder eingekauft werden, welche regionalen Risiken akzeptabel sind und wie FinOps, Security, Plattform und Produkt gemeinsame Ziele messen. Die Entscheidung enthält Mindestkontrollen, genehmigte Ausnahmewege, Budgetgrenzen, Lieferantenrisiko, Migrationskosten sowie Verantwortliche für Incident, Audit und Ablauf. Ein Neubewertungsauslöser ist etwa eine Provider-/Regionenänderung, ein regulatorischer Umfangwechsel, wiederkehrende SLO-Verletzung oder eine wesentlich andere AI-/Datenlast.

## Production Checklist

| Prüfkriterium | Evidenz | Owner | Stopp- oder Rollbackbedingung |
|---|---|---|---|
| Datenklasse und Durability-Ack sind dokumentiert. | API-/Design-Contract und Review. | Product + Architecture | Unklare Bedeutung von „success“. |
| Workload- und Kapazitätsprofil existiert. | Objektgrößen, R/W-Ratio, p99, In-flight, Wachstum. | Service Owner | Keine Lastannahme oder keine Reserven. |
| Backpressure, Retry und Idempotenz sind durchgängig. | Load-/negative tests, Runbook. | Service Team | Queue Age wächst dauerhaft oder Duplikate ungeklärt. |
| Storage-Klasse passt zu RPO/RTO/Residenz. | Platform support matrix, recovery evidence. | Platform + Security | Datenklasse verletzt oder Recovery nicht nachweisbar. |
| Dashboards und Alarme verbinden Produkt- und I/O-Signale. | Dashboard, exemplarische Trace-Korrelation. | SRE/Platform | Alarm ohne Owner oder ohne Reaktionspfad. |
| Zugang, Verschlüsselung, Retention und Diagnosezugriff geprüft. | IAM review, key/lifecycle/audit evidence. | Security + Data Owner | Cross-tenant/read-path negative probe scheitert. |
| Kostenmodell und Tenantallokation sind geprüft. | Baseline plus Sensitivität für IOPS/Throughput/Capacity. | FinOps + Product | SLO nur mit unbekannter Kostensteigerung erreichbar. |
| Rollback und Recovery wurden geübt. | Canary-/restore-/failover-Protokoll. | Service + Platform | Zurückrollen würde Daten-/Durability-Vertrag brechen. |

## Interviewfragen mit Antwortleitfäden

### 1. Was unterscheidet hohe IOPS von niedriger Anwendungs-Latenz?

IOPS misst abgeschlossene I/O-Operationen pro Zeit. Anwendungs-Latenz enthält zusätzlich Queueing, Serialisierung, CPU, Netzwerk, Cache, Locks, Durability und Retries. Eine gute Antwort fragt nach Objektgröße, Parallelität, Cache-Warmth, p95/p99 und dem Geschäftsabschluss. Die Fehlannahme ist, eine einzelne Gerätezahl als End-to-End-SLO zu behandeln.

### 2. Wann würdest du `O_DIRECT` einsetzen?

Erst nach reproduzierbarem Beleg für Cache-Pollution oder Doppelbuffering und nach Prüfung von Alignment, Dateisystem, Runtime, Buffer Ownership, Durability, Fehlerbehandlung und Rollback. Ein Kandidat kann ein kontrollierter Datenbankpfad sein. „Bei jeder schnellen SSD“ ist keine Begründung.

### 3. Warum beweist eine lange I/O-Queue keinen Storage-Defekt?

Die Queue ist eine Folge von Ankunftsrate, Servicezeit und einer Grenze. Sie kann durch Retries, CPU vor dem Submit, Memory-Thrashing, cgroup-Quota oder Remote-Abhängigkeit wachsen. Ich korreliere Queue Age, Completion Latency, CPU, Memory Pressure, Lastform und Fehler mit einem kontrollierten Gegenvergleich.

### 4. Wie formulierst du ein korrektes Write-API-Semantikmodell?

Ich unterscheide mindestens `accepted`, `durable`, `failed` und `unknown`, dokumentiere die Idempotenz-ID, Timeout- und Retrygrenze, Reconciliation sowie den Eigentümer des Durabilityvertrags. Das erspart eine falsche Aussage, dass `write()` oder ein 200-Response immer fachlich persistent sei.

### 5. Welche Daten dürfen auf lokaler ephemeral Disk liegen?

Nur Daten, deren Klassifikation, Verschlüsselung, Tenanttrennung, Wiederaufbauzeit und Verlust bei Nodeausfall explizit akzeptiert sind, zum Beispiel ein rebuildbarer Cache. Nicht rebuildbare oder regulierte Primärdaten benötigen einen dokumentierten durable Pfad. Die Antwort muss auch Cleanup bei Node-Reuse und Observability erwähnen.

### 6. Wie schützt du einen lauten Tenant bei Storage-Sättigung?

Mit per-Tenant Admission und In-flight-Budgets, fairer Priorisierung, fristgebundenen Jobs, einer klaren Rückmeldung bei Vollstand und getrennten SLO-Klassen. Globale Queueerhöhung oder endlose Retries lassen den lauten Tenant die Fairness zerstören.

### 7. Welche Daten brauchst du für eine Storage-Tier-Entscheidung?

Datensatzgröße und Wachstum, Read/Write-Form, Objektgröße, Randomität, p95/p99, RPO/RTO, Region/Residenz, Tenant-Isolation, bestehende Kosten und Expected Cost per Outcome. Ich dokumentiere auch Exit, Recovery und die Testannahmen, nicht nur Provider-IOPS.

### 8. Ein GenAI-Service lädt Modelle langsam. Ist das ein Block-I/O-Problem?

Möglich, aber unbewiesen. Ich zerlege die Phasen: Artifact Retrieval, Cache Hit/Miss, Decompression, CPU-Initialisierung, Host-to-Device Transfer, GPU Memory Allocation und Runtime warm-up. Jede Phase erhält Bytes, Zeit und Fehler. Erst dann entscheide ich über Cache oder Storage.

## Praktisches Lab: kontrollierte I/O-Hypothese in einer lokalen Sandbox

> **Status:** `reviewed_only`. Das Lab ist absichtlich nicht auf diesem Rechner ausgeführt. Führe es nur auf einem eigenen Linux-Testsystem aus. Es schreibt ausschließlich in ein frisch erzeugtes temporäres Verzeichnis; verwende niemals `/dev/*`, fremde Mounts, Produktionspfade oder freigegebene Laufwerke.

### Ziel und Hypothesen

**Hypothese A:** Ein erster sequenzieller Read kann mehr Zeit benötigen als ein wiederholter Read desselben temporären Files, weil der Page Cache den zweiten Pfad bedient.  
**Hypothese B:** Mehr parallele Leser erhöhen nicht unbegrenzt den nützlichen Durchsatz; Queueing und CPU/Memoryeffekte können p95 verschlechtern.  
**Negative Probe:** Ein unterschiedlicher Cachezustand oder ein CPU-limitierter Prozess kann eine I/O-Erklärung widerlegen. Die Messung darf diese Zustände nicht vermischen.

### Voraussetzungen, Risiken und Kosten

- Linux-Sandbox mit mindestens 1 GiB freiem, **eigenem** Testspeicher; keine Rootrechte nötig.
- Optional `vmstat`, `pidstat`, `iostat` oder `fio` nur, wenn lokal installiert und nach lokaler Richtlinie erlaubt. Fehlende Tools werden nicht nachinstalliert.
- Das Beispiel erzeugt höchstens 256 MiB temporäre Testdaten. Es misst keine Produktions-SLOs und erzeugt keine Cloudkosten.
- Vor Beginn: bestätige mit `pwd` und `df -h .`, dass der Pfad kein Produktiv-/Team-/Systemvolume ist.

### Ablauf

```bash
set -euo pipefail

work_dir="$(mktemp -d "${TMPDIR:-/tmp}/kb0044-XXXXXX")"
trap 'rm -rf -- "$work_dir"' EXIT

# Nur eine begrenzte, eigene Testdatei; kein Blockdevice.
dd if=/dev/zero of="$work_dir/payload.bin" bs=1M count=256 conv=fsync status=none
printf 'work_dir=%s\n' "$work_dir"
df -h "$work_dir"
grep -E 'MemAvailable|Cached|Dirty|Writeback' /proc/meminfo || true

# Read A: Zeit vom vollständigen Lesen der Datei erfassen.
time sh -c 'cat "$1" > /dev/null' sh "$work_dir/payload.bin"

# Read B: gleicher Input, gleiche Aktion; Ergebnis als Cache-Hypothese markieren.
time sh -c 'cat "$1" > /dev/null' sh "$work_dir/payload.bin"

# Nebenbeobachtung, nicht als Beweis isoliert lesen.
vmstat 1 5 || true
test -r /proc/pressure/io && cat /proc/pressure/io || true
```

Dokumentiere Datum, Kernel/Runtime, Pfadklasse, verfügbare CPU/Memorylimits, Dateigröße, beide Zeiten, Fehler und die Unsicherheit. „Read B schneller“ ist nur ein Hinweis; andere Last oder ein anderer Hostzustand machen Vergleiche ungültig.

### Gegenproben und Auswertung

1. **CPU-Gegenprobe:** Wiederhole nicht während parallel laufender Kompression, Buildjobs oder einer CPU-Quota. Wenn die CPUauslastung/Runnable Work deutlich steigt, ist der Vergleich kein reines I/O-Experiment.
2. **Memory-Gegenprobe:** Vergleiche `/proc/meminfo`, Major Faults soweit sichtbar und PSI. Ein verändertes Memorylimit oder starker Reclaim kann die Readzeit beeinflussen.
3. **Parallelitätsprobe:** Starte höchstens zwei Leser auf die eigene temporäre Datei, messe je Vorgang und beende sie vollständig. Steigt p95 ohne nennenswert mehr sinnvollen Durchsatz, reduziere In-flight-Work; erhöhe keine Queue blind.
4. **Fehlerprobe:** Setze den Test bei `ENOSPC`, I/O-Fehler, unerwartetem Pfad oder fehlender Cleanup-Garantie sofort ab. Keine Retry-Schleife schreiben.
5. **Persistenzprobe:** Leite aus diesem Lab keine Aussage über Durability ab. `conv=fsync` ist ein kontrollierter Dateitest und ersetzt weder einen Datenbank- noch einen Plattform-Recoverytest.

Nach dem Exit entfernt der `trap` die Testdatei. Prüfe trotzdem `test ! -e "$work_dir"` beziehungsweise lösche den Ordner bei abgebrochenem Shellprozess manuell nach Sichtprüfung.

## Dependencies und Cross-References

- [KB-0034: Virtueller Speicher und Paging](04-virtueller-speicher-und-paging.md) ist die kanonische Erklärung für Page Cache, Working Set und Reclaim.
- [KB-0035: Dateisysteme und Persistenzpfade](05-dateisysteme-und-persistenzpfade.md) erklärt VFS, Metadata und `fsync`; diese Datei erweitert die Block-Queue-Sicht.
- [KB-0038: cgroups und Ressourcenbegrenzung](08-cgroups-und-ressourcenbegrenzung.md) erläutert Ressourcenisolation und Limits.
- [KB-0042: CPU-Scheduling und Lastverteilung](12-cpu-scheduling-und-lastverteilung.md) trennt CPU-Queueing von Storage-Wartepfaden.
- [KB-0045: Systemdiagnose und Performanceanalyse](15-systemdiagnose-und-performanceanalyse.md) wird die übergreifende Diagnosemethodik vertiefen.
- KB-0565, KB-0580 und KB-0720 verwenden diese Begriffe für Datenplattform-, GPU-/Inference- und Portfolioentscheidungen.

## Quellen und Aktualitätsnotizen

| Quelle | Aussage / Verwendung | Stand |
|---|---|---|
| Dateikatalog | Verbindlicher Scope und Reihenfolge. | 2026-09-14 |
| [Linux MM Concepts](https://docs.kernel.org/admin-guide/mm/concepts.html) | Page Cache, Reclaim und Memory-Management-Kontext. | abgerufen 2026-09-16 |
| [Linux blk-mq](https://docs.kernel.org/block/blk-mq.html) | Software-/Hardware-Queues, Requests, Tags, Scheduler- und Completiongrenzen. | abgerufen 2026-09-16 |
| [`open(2)`](https://man7.org/linux/man-pages/man2/open.2.html) | `O_DIRECT`, Einschränkungen und Dateizugriffsflags. | Linux man-pages, abgerufen 2026-09-16 |
| [`posix_fadvise(2)`](https://man7.org/linux/man-pages/man2/posix_fadvise.2.html) | Advisory Semantik für Zugriffsmuster. | Linux man-pages, abgerufen 2026-09-16 |
| [`io_uring(7)`](https://man7.org/linux/man-pages/man7/io_uring.7.html) | Submission-/Completion-Ringmodell und API-Kontext. | Linux man-pages, abgerufen 2026-09-16 |
| [`fsync(2)`](https://man7.org/linux/man-pages/man2/fsync.2.html) | Persistenzgrenze und Fehlerverhalten, ergänzend zu KB-0035. | Linux man-pages, abgerufen 2026-09-16 |

Zeitabhängige Fakten wie Storagepreise, konkrete Volume-Limits, Kernel-/Treiberunterstützung, `io_uring`-Featureverfügbarkeit und Cloud-Regionen sind nicht aus dieser Datei abzuleiten. Vor einer Einführung werden sie gegen den tatsächlichen Provider, Kernel, Runtime, Dateisystem und die Datenklasse validiert.

## Bonus: New Tech and Innovations

**Stand 2026-09-16 — `io_uring`-basierte I/O-Pfade sind für hochgradig parallele Linux-Workloads eine etablierte API-Grundlage, ihre Integration in eine Anwendung bleibt jedoch abhängig von Kernel, Bibliothek, verwendeten Operations und sauberer Cancellation-/Backpressure-Logik.** **Reifegrad: Adopting.** Ein Pilot vergleicht einen bestehenden Pfad mit identischer Last, denselben Fehlern und identischer Observability; Abnahme sind End-to-End-p99, CPUzeit, Fehler- und Recoveryverhalten statt nur mehr IOPS. Grundlage ist die [offizielle `io_uring(7)`-Dokumentation](https://man7.org/linux/man-pages/man7/io_uring.7.html).

**Stand 2026-09-16 — Hochparallele NVMe- und virtuelle Storage-Pfade profitieren vom blk-mq-Modell, weil es Softwarekontexte und Hardware-Dispatch-Queues trennt.** **Reifegrad: Established.** Das ist keine Empfehlung, jede Scheduler- oder Queue-Option zu ändern: Hardware, Treiber, Dateisystem, Tenants und Workload bestimmen die Wirkung. Ein Pilot misst Queue Age, Completionlatenz, Fairness und Fehler unter einem realistischen Mischprofil. Die Referenz ist die [Linux blk-mq-Dokumentation](https://docs.kernel.org/block/blk-mq.html).

**Stand 2026-09-16 — Speicherklassen werden zunehmend als programmierbarer Plattformvertrag mit Datenklasse, Durability, I/O-Budget, Telemetrie und Kostenattribution behandelt.** **Reifegrad: Adopting.** Der Nutzen ist schnellere, überprüfbare Produktentscheidungen; die neue Gefahr sind zu starre Policies oder vertrauliche Daten in Telemetrie. Einführung erst nach einem Pilot mit Tenant-Fairness, Recoverytest, Audit-Review und Kosten pro erfolgreichem durablem Ergebnis.
