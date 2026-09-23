---
{"id": "KB-0048", "title": "Container als Betriebssystemsubstrat", "domain": "02", "sequence": 18, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["PLATFORM", "CLOUD", "GENAI", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0032", "concepts": ["Prozesslebenszyklus", "PID 1", "Signale"], "needed_for": "both"}, {"id": "KB-0035", "concepts": ["Dateisysteme", "Overlay", "Persistenzpfade"], "needed_for": "understanding"}, {"id": "KB-0037", "concepts": ["Namespaces", "User Namespace", "Mount Namespace"], "needed_for": "both"}, {"id": "KB-0038", "concepts": ["cgroup v2", "Ressourcenlimits", "Delegation"], "needed_for": "both"}, {"id": "KB-0047", "concepts": ["UID/GID", "Capabilities", "LSM", "Least Privilege"], "needed_for": "both"}], "related": ["KB-0040", "KB-0041", "KB-0044", "KB-0095", "KB-0471", "KB-0562", "KB-0720"], "applies": ["KB-0095", "KB-0471", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein lokales, nicht ausführendes OCI-Artifact-Lab unterscheidet Image-Metadaten, Rootfs-Stand-in, deklarierte Runtimeparameter, Digest und flüchtigen Schreibpfad.", "rationale": "Das Lab pullt, startet oder privilegiert keinen Container und erzeugt keine Cloud- oder Registrykosten."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein Workloaddesign legt Kernel-/VM-Grenze, Imageprovenance, Runtimeidentity, Namespace-/cgroup-/Mount-/Networkgrenzen, State, Upgrade und Recovery fest.", "rationale": "Die Entscheidung folgt Datenklasse, Isolation, SLO, Betriebsteam, Portabilität und Kosten statt dem Schlagwort Container."}, "STAFF-TARGET": {"active": true, "scope": "Teams erhalten eine Container-Baseline für PID 1, Signal-/Shutdownverhalten, non-root, Images per Digest, read-only defaults, Ressourcenverträge und negative Tests.", "rationale": "Wiederholbare Defaults verhindern, dass jede Anwendung ihre eigene Host- und Runtimeausnahme erfindet."}, "CHIEF-TARGET": {"active": true, "scope": "Das Plattformportfolio ordnet Container, VMs, Bare Metal und Managed Runtimes nach Daten-, Risiko-, Regulierungs-, Cost- und Betriebsprofil zu.", "rationale": "Containerisierung wird als Plattform- und Operating-Model-Entscheidung geführt, nicht als universelle Standardlösung."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "OCI Runtime Implementierungen, rootless user namespace mappings, overlayfs, cgroup delegation, CRI, containerd, runc, Kata/VM-isolation, gVisor, seccomp/LSM und image provenance sind Spezialistentiefe.", "rationale": "Die Kernzielrolle bewertet Grundmodell, Evidenz, Trade-offs und Supportgrenzen; tiefes Runtime-/Node-Tuning bleibt ein autorisiertes Spezialgebiet."}}, "lab_validation": [{"lab_id": "KB-0048-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplantes lokales, nicht ausführendes OCI-Artefakt-Lab", "evidence": "Konzeptartefakte, Digestprüfung, negative Stateprobe und Cleanup fachlich geprüft.", "limitations": "Kein Containerimage wurde gepullt oder gebaut, keine Runtime gestartet, kein Namespace/cgroup geändert, keine Registry benutzt und kein Produktionssystem getestet."}]}
---
# Container als Betriebssystemsubstrat

> **Ziel:** Ein Container ist kein kleiner virtueller Server. Er ist ein oder mehrere Linux-Prozesse mit einem deklarativen Dateisystem- und Laufzeitkontext, die denselben Hostkernel mit anderen Workloads teilen. Sichere Plattformentscheidungen beginnen daher bei Kernelgrenze, Prozessmodell, Mounts, Identität, Ressourcen und Datenzustand.

## Purpose, Definition und Scope

Ein Application Container verpackt eine Anwendung mit deklarierter Konfiguration und einem Root-Dateisystemkontext, damit eine Runtime einen isoliert erscheinenden Prozess starten kann. Unter Linux entsteht diese Sicht typischerweise aus Namespaces, cgroups, Mounts, Capabilities, LSM, Runtime-Policy und dem Hostkernel. Die OCI Image Specification beschreibt ein Image als Manifest, optionale Indexstruktur, Dateisystem-Layer und Konfiguration. Die OCI Runtime Specification beschreibt Konfiguration, Ausführungsumgebung und Lifecycle eines Containers.

Dieses Kapitel führt die Linuxfundamente zusammen und behandelt:

- den Unterschied von Image, Container, Runtime Bundle und Host;
- Namespaces, cgroups, Mounts, Overlay-/Copy-on-Write-Kontext und Prozessmodell;
- PID 1, Signale, Reaping, Shutdown und Exitsemantik;
- Container- gegenüber VM-Grenzen;
- Rootless-Betrieb und seine tatsächlichen Schutz-/Kompatibilitätsgrenzen;
- Imageprovenance, Digest, State, Persistenz, Observability, Security und Cost.

Nicht im Scope: Kubernetes-API, Scheduler, Helm, CNI/Cilium, spezifische Runtime-Befehle, CRI oder produktive Nodeadministration. Diese werden später kanonisch vertieft. Nach diesem Kapitel kannst du:

1. den Pfad vom OCI-Image zum laufenden Prozess und zurück zu Logs/State skizzieren;
2. Image und Container sowie Container- und VM-Isolation sicher unterscheiden;
3. PID-1-, Signal-, Mount-, Resource-, Identity- und Statefehler in einem Containerbetrieb erkennen;
4. Rootless als Risiko-Reduktion mit Voraussetzungen und Grenzen bewerten;
5. Containerklassen für GenAI-, Platform- und Cloudworkloads anhand von Isolation, Daten, SLO, Support und Kosten entscheiden.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Der Linux-/OCI-Daten- und Kontrollpfad wird hergeleitet und gegen externe Dokumentation begrenzt. |
| HANDS-ON-TARGET | Ein lokales, nicht ausführendes Artefakt-Lab behandelt Image-/Runtime-Metadaten, Digest und Ephemeral State ohne eine Container-Runtime zu verwenden. |
| ARCHITECT-TARGET | Der Workloadvertrag verbindet Runtimeklasse, Kernel-/VM-Grenze, State, Identity, Ressourcen, Upgrade und Recovery. |
| STAFF/PRINCIPAL | Plattformdefaults verhindern Root-, Hostmount-, PID-1-, Image-Tag- und State-Anti-Patterns im Teammaßstab. |
| CHIEF | Container, VM und Managed Runtime gehören in ein risikobasiertes Plattformportfolio mit klarer Ownership. |

## Mental Model: ein Prozess mit einem kuratierten Blick auf Linux

Ein Container ist nicht ein anderer Kernel und nicht automatisch ein anderer Rechner. Er ist ein Hostprozess, dessen Sicht und zulässige Handlungen eingeschränkt und konfiguriert sind.

```text
OCI image:
  manifest + config + ordered filesystem layer changes
             |
             v
runtime prepares bundle:
  rootfs + OCI config + mounts + namespaces + cgroups + process args
             |
             v
host kernel:
  process starts as container PID 1
  shares kernel, uses namespaced views and cgroup budgets
             |
             v
application:
  logs / signals / files / sockets / external APIs
             |
             v
state:
  ephemeral writable layer OR declared durable external storage
```

Die View-Metapher hat Grenzen. Ein Namespace kann Objekte verbergen oder IDs abbilden, aber kein böswilliges Kernelverhalten neutralisieren. Eine cgroup limitiert Ressourcen, ist jedoch keine Datenautorisierung. Ein Image liefert Dateien, ist aber keine dauerhafte Datenbank. Ein Containerprozess kann nach einem Exit verschwinden, während sein External State, Volumes, Logs, Images, Secrets oder Attachments weiter existieren.

## Prerequisites und Dependencies

| ID | Art | Nutzen |
|---|---|---|
| [KB-0032](02-prozesse-und-lebenszyklen.md) | Anwendung und Lab | Prozessbaum, Signale, PID 1, Exit und Reaping. |
| [KB-0035](05-dateisysteme-und-persistenzpfade.md) | Verständnis | Rootfs, Overlay, Mounts, VFS und echter Persistenzpfad. |
| [KB-0037](07-namespaces-und-isolation.md) | Anwendung und Lab | Sichtgrenzen für PID, Netz, Mount, User und IPC. |
| [KB-0038](08-cgroups-und-ressourcenbegrenzung.md) | Anwendung und Lab | Ressourcenbudget und Throttling/OOM-/Noisy-Neighbor-Kontext. |
| [KB-0047](17-linux-sicherheitsgrundlagen.md) | Anwendung und Lab | non-root, Capabilities, LSM, Secrets und Least Privilege. |

Ergänzend behandeln KB-0040/KB-0041 Dienst- und Shutdownverhalten, KB-0044 I/O sowie KB-0095/KB-0471 spätere Containerplattformen.

## Core Concepts und Mechanismen

### Image, Layer, Manifest und Digest

Ein Image ist ein verteilbares Artefakt, kein laufender Prozess. Die OCI Image Specification definiert Manifest, Index, Layer und Konfiguration. Layer beschreiben aufeinanderfolgende Dateisystemänderungen; die Konfiguration enthält unter anderem Runtime-nahe Metadaten. Ein Content Digest referenziert konkrete Inhalte, während ein lesbarer Tag wie `latest` oder `v1` verschiebbar sein kann.

| Objekt | Was es ist | Was es nicht ist |
|---|---|---|
| Image manifest | Metadatenreferenz zu Config und Layern | keine laufende Instanz und keine Vertrauensgarantie. |
| Image layer | ein Dateisystemänderungsset | kein persistenter Arbeitsspeicher und keine Datenbank. |
| Config | deklarierter Imagekontext | keine vollständige Production Runtime Policy. |
| Tag | menschliche, veränderbare Referenz | keine unveränderliche Releaseidentität. |
| Digest | content-addressable Identität | keine Aussage allein über Herkunft, Review oder Laufzeitfreigabe. |
| Runtime bundle | Rootfs + Runtimeconfig für eine Ausführung | kein Ersatz für Orchestrator-/IAM-/Storagevertrag. |
| Container | laufender/gestoppter Prozesskontext | kein virtueller Kernel oder unabhängiger Host. |

Ein sicheres Deployment verweist auf eine geprüfte, unveränderliche Identität und hält Provenance, Scanstatus, SBOM-/Policybezug, Architektur und Releaseintent fest. Ein Digest allein verhindert nicht, dass ein unsicheres Artefakt bewusst oder versehentlich freigegeben wird.

### OCI Runtime und Prozessausführung

Die OCI Runtime Specification definiert, wie eine Runtime Konfiguration, Ausführungsumgebung und Lifecycle eines Containers beschreibt. Unter Linux umfasst der Runtimekontext typischerweise:

```text
process arguments, environment, cwd
+ root filesystem
+ mounts
+ namespaces
+ capabilities / no-new-privileges related settings
+ rlimits / cgroups
+ hooks and lifecycle actions where supported
```

Implementierungen und Orchestratoren können zusätzliche Features, Defaults, Einschränkungen oder Sicherheitsprofile besitzen. OCI-kompatibel heißt daher nicht, dass jedes Runtimefeature, jeder Hook, jedes Kernelverhalten oder jede Policy auf jeder Plattform gleich wirkt. Eine Supportmatrix enthält Runtime, Kernel, Distribution, Architektur, cgroup mode, LSM, rootless support, Storage driver, network model, observability and recovery boundaries.

### Namespaces und cgroups als komplementäre Schichten

Namespaces geben Sicht oder Identitätsbereiche: PID, Mount, Netzwerk, IPC, UTS, User, cgroup/time je nach Kernel. Cgroups kontrollieren und messen Ressourcen von Prozessgruppen. Ein Container braucht häufig beide:

```text
namespace asks: "which processes, paths, IDs and network objects are visible?"
cgroup asks:    "which CPU, memory, I/O and PID resources can this process consume?"
```

Beide haben offene Flanken. Namespaces verhindern nicht jede Host-/Kernel-Schwachstelle. Cgroups verhindern nicht eine falsche Capability, ein Secret-Leak oder eine unbounded externe Retryqueue. Ein rootless User Namespace verändert UID-/Capability-Sicht, ersetzt aber nicht die sorgfältige Prüfung von Mounts, Devices, Network, LSM, Runtime und Hostpolicy.

### Mounts, Rootfs und Copy-on-Write

Ein Containerrootfs besteht aus Image-Inhalten und einer runtime-/storage-driver-spezifischen beschreibbaren Schicht oder Mounts. Copy-on-Write vereinfacht die Wiederverwendung von Layern, kann aber beim Schreiben Metadaten- oder Speicher-/I/O-Kosten verursachen. Schreibdaten gehören deshalb in klare Klassen:

| Datenart | Containerstrategie | Recovery-/Securityfrage |
|---|---|---|
| Anwendungscode, Libraries | immutable Image Layer | digest, provenance, rebuild. |
| Laufzeittempora | eigener ephemeral writable Pfad | cleanup, quota, data minimization. |
| Logs | stdout/stderr oder deklarierter Agentpfad | retention, redaction, backpressure. |
| Cache | ausdrücklich rebuildbar, isoliert | eviction, node loss, encryption. |
| Secret | kurzlebige, read-only Projection/API | rotation, access scope, no image layer. |
| Geschäftsdaten | externer/approved durable Service | RPO/RTO, encryption, IAM, backups. |
| Konfiguration | versionierte externe Konfiguration | validation, rollout, rollback. |

„Ein Container ist stateless“ bedeutet nicht, dass die Anwendung keine Daten ausgeben darf. Es bedeutet, dass jeder persistente Zustand klar außerhalb der flüchtigen Containerinstanz definiert, geschützt, wiederherstellbar und versioniert wird.

### PID 1, Signale und Reaping

Der erste Prozess im PID Namespace trägt besondere Betriebsverantwortung. Wenn die Anwendung PID 1 ist, muss sie signale sinnvoll verarbeiten, Kindprozesse/Defunct-Zustände behandeln und kontrolliert beenden. Ein Shell-Wrapper kann Signale verschlucken, falsche Exitcodes weitergeben oder Zombies nicht reapen. Ein zusätzliches Init-/Supervisorpattern kann helfen, erzeugt aber mehr Zustände und muss bewusst gewählt werden.

Ein Stopvertrag definiert:

1. welcher Prozess das Hauptprogramm ist;
2. welche Signale erwartet werden;
3. wie neue Arbeit gestoppt wird;
4. wie In-flight-Arbeit bis zur Deadline behandelt wird;
5. wie Child Processes beendet/reaped werden;
6. wann Exit erfolgreich, vorübergehend oder fehlerhaft ist;
7. wie der Controller, ein Load Balancer und ein Jobclient diesen Status interpretieren.

Ein „Container exit 0“ beweist weder, dass alle Daten durable waren noch dass eine verteilte Operation abgeschlossen ist. Siehe dafür [KB-0035](05-dateisysteme-und-persistenzpfade.md) und [KB-0041](11-signale-und-kontrolliertes-herunterfahren.md).

### Rootless-Betrieb

Docker dokumentiert Rootless Mode als Ausführung von Daemon und Containern unter einem non-root Nutzer, um bestimmte Risiken im Daemon-/Runtimekontext zu mindern, sofern Voraussetzungen erfüllt sind. Rootless ist eine Risikominderung, kein allgemeines Qualitätssiegel:

- User Namespace Maps und subordinate UID/GID-Ranges müssen zur Umgebung passen;
- Netzwerk, Low Ports, Storage, cgroup delegation, Gerätezugriff und Monitoring können andere Fähigkeiten oder Einschränkungen haben;
- ein im Container kompromittierter Prozess kann weiterhin auf Daten/Netze zugreifen, die der Workloadidentität zugewiesen wurden;
- Image-, Secret-, Application- und IAM-Schwächen bleiben außerhalb dieses Mechanismus;
- Cloud-/Managed-Runtimes legen eigene Rootless-/User-Namespace- und Nodegrenzen fest.

Die richtige Entscheidung lautet daher nicht „Rootless immer“ oder „Rootless nie“, sondern: Welche Host-/Daemonrisiken werden reduziert, welche Funktion/Supportgrenzen entstehen, welche Datenklasse ist betroffen, und welcher getestete Fallback verhindert ein unbemerktes Downgrade?

### Container und virtuelle Maschinen

| Dimension | Container | Virtuelle Maschine |
|---|---|---|
| Kernel | meist gemeinsam mit Host | eigener Gastkernel auf Hypervisor. |
| Isolation | Linux-Kernel- und Runtimekontrollen | zusätzliche Virtualisierungsschicht, aber nicht automatisch fehlerfrei. |
| Start/Image | oft schnell und layerbasiert | OS-/Disk-/Boot-Kontext. |
| Density | oft höher bei passenden Workloads | häufig mehr Overhead pro Gast. |
| Kernel-/Distro-Abhängigkeit | deutlich an Hostkernel gebunden | Gastkernel kann stärker unabhängig sein. |
| Privileg-/Escape-Risiko | Hostkernel/Runtime besonders relevant | Hypervisor/Gast/Hostgrenzen relevant. |
| Betriebsmodell | Prozess-/Image-/Runtimeorientiert | Server-/Guest-OS-orientiert. |
| Daten / Compliance | abhängig von Mounts, Runtime, Node und Policy | abhängig von Disk, Hypervisor, Guest, Network und Policy. |

VM ist nicht „sicherer“ ohne Threat Model, Container nicht „billiger“ ohne Workload und Betriebskosten. Confidential/high-risk workloads, nicht vertrauenswürdiger Code, abweichende Kernelanforderungen, Lizenz- oder regulatorische Grenzen können eine stärkere Isolation oder einen Managed Service rechtfertigen. Kurzlebige API-/Workerworkloads können von Containerportabilität und Dichte profitieren.

## Architecture und Data Flow: ein stateless GenAI-API-Worker

Der Fall dient nur als Architekturübung.

```text
source -> reproducible build -> signed/provenanced OCI image digest
     -> approved registry -> admission/policy gate
     -> runtime bundle on chosen node/runtime class
     -> non-root PID 1 in namespaces + cgroup
     -> read-only code rootfs + bounded /work
     -> workload identity -> model/retrieval/external secret service
     -> structured redacted stdout/stderr + metrics/traces
     -> drain signal -> bounded in-flight completion -> exit
```

**Stategrenzen:**

- Prompt-/Requestdaten verbleiben nur begrenzt in Memory oder einem geschützten temporären Pfad.
- Modelle oder Embeddings werden aus einer freigegebenen Storage-/Cacheklasse geladen, nie als ungeprüfte Schreibdaten in die Image-Layer integriert.
- Durable Conversation-/Audit-/Indexstate liegt hinter einem Service mit IAM, Verschlüsselung und Recoveryvertrag.
- Der Container selbst kann ersetzt werden, ohne dass sein lokales Layer als Quelle der Wahrheit dient.

**Trust Boundaries:** Buildsystem, Registry, Admission, Node Runtime, Workload Identity, Secret Service, Datenservice und Telemetry Backend besitzen getrennte Berechtigungen. Eine Runtime kann eine Imagefreigabe nicht ersetzen; ein Registrydigest gibt keine Laufzeitberechtigung; eine Serviceidentität gibt keinen Hostzugriff.

## Protocols, Standards und Tools

| Standard / Technologie | Rolle | Prüfpunkt |
|---|---|---|
| OCI Image Specification | Interoperables Imageformat mit Manifest, Layern und Config | media types, digest, platform/architecture, provenance policy. |
| OCI Runtime Specification | Bundle, Konfiguration, Ausführungsumgebung und Lifecycle | Linux runtime support, configuration, hooks and version. |
| Linux namespaces | Sicht-/Identityisolation | target kernel, host namespace restrictions, user mapping. |
| cgroup v2 | Ressourcenhierarchie, Limits und Beobachtung | delegation, effective limits, accounting, runtime support. |
| Overlay-/Snapshotter-Mechanismus | Rootfs/layer materialization | storage driver, I/O, garbage collection, kernel/filesystem support. |
| Docker/Podman/containerd/runc | konkrete Implementierungen / Toolchains | version, security posture, support lifecycle, policy integration. |
| Rootless mode | non-root Runtime-/Daemonmodell | prerequisite, mapping, network/storage/cgroup feature matrix. |
| Registry / signature tooling | Artefaktverteilung und Vertrauen | immutable reference, authorization, retention, provenance. |

Ein Toolname ist nicht gleich einem Containerstandard. OCI beschränkt das Artefakt-/Runtimeformat; konkrete Runtime-, Registry-, Orchestrator-, Security- und Observabilityfähigkeiten werden pro Implementierung und Version geprüft.

## Konfiguration und Implementierung: Containervertrag statt „Dockerfile reicht“

Die Vorlage beschreibt ein Plattformprofil, keine lauffähige Deployment- oder Runtimeconfig:

```yaml
container_contract:
  artifact:
    reference: immutable_digest_required
    architecture: explicit
    provenance: verified_by_platform_policy
    mutable_tags: prohibited_for_production
  process:
    entrypoint: single_responsible_pid_1
    signal_contract: documented
    max_shutdown_seconds: declared
    child_reaping: tested
  identity:
    uid_gid: explicit_non_root
    groups: minimum
    capabilities: drop_all_then_add_if_approved
  isolation:
    host_namespaces: prohibited
    privileged: prohibited
    host_devices: prohibited
    root_filesystem: read_only_when_compatible
    writable_paths:
      - /work
  resources:
    cpu_memory_io_pid_budget: declared
    backpressure: declared
  state:
    image_layer: code_only
    ephemeral: bounded_and_cleaned
    durable: approved_external_service_only
  supply_chain:
    build: reproducible_or_attested
    scan_policy: required
    sbom_policy: required
  operations:
    logs: stdout_stderr_redacted
    health: application_semantic
    rollback: prior_digest
    exit_criteria: [signal_test, resource_test, access_denial_test, restore_test]
```

Der Vertrag wird nicht dadurch sicher, dass er viele Felder hat. Jede Zusage braucht einen Evidenzpfad: eine CI-Prüfung, ein Admission-Check, eine negative Probe, ein Runtimeinventar, eine Canaryaussage, ein Recoverytest oder ein Auditereignis.

## Scalability und Performance

### Kapazität beginnt vor `start`

Containerstartzeit kann Build-/Pull-/Unpack-/Snapshot-/Mount-/Init-/Dependency-/Cache-/Modelload-Zeit enthalten. Eine Plattform trennt diese Phasen:

```text
startup_latency =
  artifact_resolution
+ download_or_layer_cache_miss
+ unpack_snapshot_mount
+ process_init
+ config_secret_identity_ready
+ application_warmup
+ dependency_or_model_cache_ready
```

Ein schneller `exec` beweist nicht, dass der Dienst bereit ist. Besonders bei GenAI können Modellgewichte, Tokenizer, GPU-/Deviceinitialisierung, Cachewarming und Netzwerkabhängigkeiten dominieren. Readiness ist eine fachliche Erklärung der verfügbaren Fähigkeit, nicht nur „PID existiert“.

### Ressourcen und Mehrmandantenfähigkeit

Cgroups machen CPU-, Memory-, I/O- und PID-Budgets messbar und begrenzbar. Sie definieren jedoch nicht automatisch faire Queueingsemantik im Application-/API-Pfad. Ein Workloadvertrag enthält Concurrency, Queue Age, per-tenant Limits, Backpressure, Temp-/Layer-/Cache-Speicher und Shutdownbudget. Das verhindert:

- CPU throttling, das als Remote-Latenz fehlinterpretiert wird;
- OOM durch Model-/Cache-/Batch-Spitzen;
- I/O- oder Snapshot-Druck bei massenhaften Neustarts;
- PID exhaustion durch forkende Prozesse;
- Image pull storms und Registry-Limitfehler;
- Lastkonzentration auf Nodes mit spezieller Hardware oder warmen Layern.

### Layer, Cache und Kosten

Layercache kann Startzeit und Registrykosten verbessern, verliert aber Wirkung bei großen, häufig wechselnden oder architekturinkompatiblen Layers. Copy-on-Write kann Schreiblast erzeugen, wenn Images zur Datenablage missbraucht werden. Ein Image wird deshalb nicht „klein“ durch das Entfernen zufälliger Dateien, sondern durch eine klare Build-/Runtime-Trennung, minimale Inhalte, stabile Basen, mehrstufige Builds, geprüfte Abhängigkeiten und eine Datenstrategie außerhalb der Layer.

## Reliability und Failure Modes

| Fehlermodus | Frühes Signal | Schutz / Recovery |
|---|---|---|
| PID 1 ignoriert Signal | lange Drain-/Killzeit, abgebrochene Arbeit | signal/reaping test, bounded shutdown, idempotent retry/reconciliation. |
| Zombie children | wachsende Prozesszahl, PIDbudget erreicht | responsible PID 1 or explicit init pattern, child lifecycle test. |
| Mutable tag drift | unterschiedliche Runtimebehavior ohne Codechange | production digest pinning, release inventory, rollback digest. |
| Image pull / registry failure | start backlog, auth/error, cache miss | cache/registry capacity, credential refresh, controlled backoff. |
| Writable layer as database | node loss / replacement loses state | move truth to durable service, migration and restore test. |
| OOM / throttle | restarts, p99 rise, cgroup events | right-size after measurement, admission/backpressure, workload cache budget. |
| Hostmount/device leak | unexpected host data / privilege | deny by default, policy/admission, inventory and negative test. |
| Rootless incompatibility | network/storage/cgroup feature failure | support matrix, canary, explicit alternative runtime class. |
| Secret in image layer | scan/cache/registry exposure | build guardrail, revoke/rotate, rebuild and audit. |
| Runtime/kernel upgrade | attach/mount/cgroup/LSM behavior changes | compatibility test, progressive rollout, previous node/runtime fallback. |

A restart policy ist keine Recoverystrategie. Sie kann eine Crashloop verstärken, Logs verdrängen, Registry-/Dependencylast erhöhen und in-flight Arbeit wiederholen. Idempotenz, persistent job state, admission und Circuit Breaking gehören über den Container hinaus.

## Security, Governance und Compliance

### Sicherheitskontrollen nach Lebenszyklus

| Phase | Risiko | Kontrolle |
|---|---|---|
| Build | dependency/secret injection, unverifizierte Base | provenance, SBOM/scan policy, secret scanning, reproducible/attested build. |
| Registry | tag overwrite, unauthorized pull, retention leak | immutable digest, scoped credentials, signature/policy, retention/audit. |
| Admission | privileged/hostmount/capability exception | default-deny profile, policy-as-code, exception TTL/owner. |
| Runtime | root, broad groups, writable rootfs, devices | non-root, drop caps, read-only rootfs, explicit writable paths, LSM. |
| Network | broad egress, identity misuse | workload identity, service scope, network policy, short-lived credentials. |
| Data | local layer/cache/volume leak | class-aware storage, encryption, lifecycle, deletion/restore tests. |
| Operations | sensitive logs, unmanaged debug shell | redaction, RBAC, short diagnostics, audit and review. |

### Rootless und Compliance

Rootless kann die Angriffsfläche bestimmter Daemon-/Runtimepfade reduzieren. Es ist aber keine Compliancekontrolle für sich. Datenresidenz, Verschlüsselung, Logging, IAM, Vulnerability Management, change control, evidence and recovery are separate obligations. Architekturartefakte kennzeichnen Rootless als eine lokale Runtimeentscheidung mit einer dokumentierten Risikowirkung, nicht als eine umfassende Zertifizierungsaussage.

## Observability und Troubleshooting

### Die Containerdimensionen einer Diagnose

Jede wichtige Metrik oder Logkorrelation verbindet:

- immutable image digest, build/release/config revision;
- container runtime, kernel, node/runtime class and architecture;
- effective UID/GID, policy/capability profile in redacted form;
- cgroup CPU/memory/I/O/PID context and pressure;
- restart reason, exit code, signal/shutdown phase;
- startup phases: pull, unpack, init, readiness;
- application SLO, queue age, error/retry, dependency state;
- state class: ephemeral cache vs external durable service.

Kein Label enthält Secrets, gesamte Image-Umgebung, Kundendaten, prompt content, raw cgroup path or unlimited container IDs.

### Diagnosepfad bei „Container ist instabil“

1. Prüfe Image Digest, Release, Node/Runtime/Kernelklasse und Status/Exitcode.
2. Trenne Start-, Readiness-, Steady-State- und Shutdownphase.
3. Prüfe cgroup Budget, OOM/throttle/PID-/I/O-/Pressure-Signale vor einem Neustart- oder Nodefix.
4. Prüfe PID-1-Signal-/Child-/Exitsemantik in einer Sandbox oder Canary.
5. Prüfe Mount-/State-/Secret-/Identityvertrag und LSM-/Policydenials.
6. Prüfe Registry/Pull/Cache/Network/Dependencypfad bei Startproblemen.
7. Vergleiche digest-pinned vorherige Revision mit gleicher Last-/Datenform.
8. Mitigiere über Rate/Admission/Rollback/Runtimeklasse, nicht über privilegierte oder dauerhafte Debugausnahmen.
9. Halte Ursache, Sicherheits-/Stateauswirkung, Cost, Recovery und Recheck in Runbook/ADR fest.

## Cost und FinOps

Containerkosten sind nicht nur vCPU/RAM:

```text
container_total_cost =
  node_or_managed_runtime_capacity
+ image_build_scan_signing
+ registry_storage_and_egress
+ artifact_pull_and_layer_cache
+ runtime_cpu_memory_io_pid_overhead
+ telemetry_and_audit
+ external_state_and_secret_services
+ support_upgrade_and_incident_work
```

Die passende Allokationseinheit ist ein Geschäftsergebnis wie erfolgreicher API-Request, sicher abgeschlossener Job oder SLO-konforme Inference, ergänzt um Idle-/Warmup-/Cachekosten. Hochdichte Container können Kosten senken, erhöhen aber bei falschen Ressourcen- oder Isolationsgrenzen Noisy-Neighbor-, Blast-Radius- oder On-call-Kosten. Rootless, VM-Isolation oder spezialisierte Runtimeklassen können mehr Ressourcen benötigen und sich dennoch bei gefährdeten Daten oder nicht vertrauenswürdigem Code lohnen.

## Trade-offs, Alternativen und Anti-Patterns

| Option | Sinnvoll wenn | Preis / Exit |
|---|---|---|
| Container auf shared kernel | standardisierte, vertrauenswürdige Service-/Workerworkloads | Kernel-/runtime-/node policy becomes platform dependency. |
| Rootless runtime | Daemon-/runtime privilege reduction supported and tested | feature, network, storage, cgroup and observability matrix. |
| VM / sandboxed runtime | stronger kernel boundary, untrusted code, special OS/kernel need | boot/density/operations/cost trade-off. |
| Managed runtime | platform team wants lower node/patch burden | provider feature/region/exit constraints. |
| External durable state | business data, resumable jobs, audit records | latency, network, service cost and IAM contract. |
| Ephemeral cache | rebuildable, bounded, class-approved data | node loss, warming and encryption/cleanup design. |
| Single PID 1 process | simple lifecycle and signal ownership | child process design must be explicit. |
| Init/supervisor | multiple child lifecycle needs are real | more process state, configs and failure modes. |

Anti-Patterns:

- Container als VM mit systemd, SSH, mutable administration und unbounded local state behandeln.
- Image Tags in Production ohne Digest-/Releaseinventory verwenden.
- Secrets, Modelweights oder Kundendaten im Image Layer ablegen.
- `privileged`, HostPath, Hostnetwork, UID 0 oder `CAP_SYS_ADMIN` als schnelle Kompatibilitätslösung akzeptieren.
- Container-Reboot als Ersatz für Idempotenz, Data Recovery, Queueing oder Root Cause.
- Non-root oder Rootless als vollständige Securityargumentation ausgeben.
- Healthcheck nur auf offenen Port setzen, obwohl Dependency/State/Model readiness fehlt.
- Rootfs schreibbar lassen, obwohl eine kleine explizite Workdir genügt.
- Layercache, image pull or startup latency nur als Dev-Problem betrachten; bei Scale-out werden sie Production capacity.
- OCI-Kompatibilität mit identischem Runtime-/Securityverhalten über jede Plattform verwechseln.

## Staff-, Principal- und Chief-Level Decisions

### Staff: ein überprüfbarer Workloadvertrag

Staff definiert pro Dienst Image Digest, Entry Point/PID 1, Signal-/Shutdownvertrag, Runtime UID/GID, writable paths, resource budget, concurrency/backpressure, Secret-/Statepfad, Logs, Healthsemantik und Rollbackdigest. Das Team liefert negative Tests für Schreibpfade, Privilegien, fehlende Secrets, Signalhandling und state recovery. Die Entscheidung wird bei Kernel-/Runtime-/Image-/Datenklassenwechseln revalidiert.

### Principal: kuratierte Containerplattform

Principal entscheidet gemeinsame Imagebasen, OCI-/registry-/provenance policy, runtime profiles, rootless/VM/sandbox classes, node support matrix, admission guardrails, cgroup / observability defaults, image lifecycle, state interfaces und exception process. Das Ziel ist nicht eine Runtime zu standardisieren, sondern sichere, produktive Wege für verschiedene Workloads zu schaffen und die Zahl der individuellen Nodeausnahmen zu reduzieren.

### Chief: Plattformportfolio und Operating Model

Chief vergleicht Container, VM, Bare Metal, Managed Runtime und Spezialhardware nach Risiko, Datenklassifikation, regulatorischem Anspruch, Time-to-Market, Dichte, Supply Chain, Vendor Lock-in, Recovery, Skills und Kosten. Die Entscheidung benennt Standard, zulässige Abweichungen, Investment in Node-/Runtime-/Securityteams, Decommissionplan für Legacyimages und Governanceevidenz. Eine Technologieentscheidung ohne Ownership für Hostkernel, runtime update, registry trust and incident response is incomplete.

## Production Checklist

- [ ] Produktionsrelease referenziert einen überprüften Image Digest, Architektur und Provenance/Scanstatus.
- [ ] PID 1, Entrypoint, Signalweitergabe, Child Reaping, Exitcodes und Shutdowndeadline sind getestet.
- [ ] UID/GID, Gruppen, Capabilities, LSM-/runtime profile, host namespace/device/mount boundaries sind default-minimal.
- [ ] Rootfs ist soweit kompatibel read-only; writable paths, quotas, cleanup and ownership are explicit.
- [ ] Stateklassen unterscheiden immutable code, ephemeral cache, secrets, configuration and durable business data.
- [ ] cgroup CPU/memory/I/O/PID budgets, queue/admission and OOM/throttle behavior were exercised.
- [ ] Startup includes pull/unpack/identity/secret/dependency/readiness phases; no port-only readiness.
- [ ] Registry auth, image retention, cache/pull limits and rollback digest are operational.
- [ ] Logs, metrics, traces and audit are redacted, bounded, correlated to digest and retain correct evidence.
- [ ] Runtime/kernel/image/platform upgrades have compatibility test, canary, rollback and recovery plan.

## Interviewfragen mit Antwortleitfäden

### 1. Was unterscheidet Image und Container?

Ein Image ist ein deklaratives, content-addressable Artefakt aus Manifest, Config und Layern. Ein Container ist die Ausführung eines Prozesskontexts mit Rootfs, Mounts, Namespaces, cgroups und Runtimepolicy. Ein Image ist nicht persistent business state; ein Container ist kein eigenständiger Kernel.

### 2. Warum ist ein Container keine VM?

Container teilen meist den Hostkernel und isolieren den Prozess über Linuxmechanismen. Eine VM hat in der Regel einen Gastkernel auf einer Virtualisierungsschicht. Das beeinflusst Isolation, Patchmodell, density, startup, host dependency and failure modes. Welche besser passt, bestimmt ein Threat- und Betriebsmodell.

### 3. Was macht PID 1 besonders?

Er ist der erste Prozess im PID Namespace und trägt Signal-/Child-/Exitverantwortung. Ein falscher Wrapper kann Signale nicht weiterleiten oder Zombies erzeugen. Ich teste graceful drain, deadline, reaping, exit codes and idempotent recovery, nicht nur `docker stop`.

### 4. Wozu dient Digest Pinning?

Ein Digest referenziert konkrete Inhalte, während Tags verschiebbar sind. Digest Pinning verbessert Reproduzierbarkeit, Incidentvergleich und Rollback. Es ersetzt nicht provenance, vulnerability assessment, runtime authorization or policy review.

### 5. Was schützt Rootless und was nicht?

Rootless kann bestimmte Daemon-/Runtimepfade ohne root ausführen und damit deren Privilege-Risiko reduzieren. Es ersetzt nicht Image-/Supply-Chain-Sicherheit, Workload-IAM, Secrets, Datenklassifikation, LSM, Networkpolicy oder Anwendungsauthorisierung. Support und Limits werden pro Umgebung getestet.

### 6. Wo soll Containerstate liegen?

Code im Image, begrenzte rebuildbare Daten in ephemerem Cache, Secrets kurzlebig/projiziert und Geschäfts-/Audit-/Jobstate in einem approved durable external service. Jede Klasse braucht encryption, IAM, lifecycle, recovery and cost model.

### 7. Warum sind cgroups keine Security Boundary?

Sie limitieren und messen Ressourcen. Sie sagen nicht, wer Daten lesen darf, welche Capability gilt, welche Netzverbindung erlaubt ist oder ob ein Mount sicher ist. Sie ergänzen Namespaces, DAC, LSM, runtime policy and enterprise IAM.

### 8. Wie würdest du ein Image mit 12 Minuten Startzeit untersuchen?

Ich zerlege Pull, Layer Cache/Miss, Unpack/Snapshot, Mount, process init, Secret/Identity, dependency connection and application/model warmup. Dann prüfe Artifactgröße, Nodecache, registry, I/O, CPU/memory, runtime and actual readiness. Ein kleineres Image hilft nur, wenn es im dominanten Pfad liegt.

## Praktisches Lab: OCI-Artefakt- und Statevertrag ohne Runtime

> **Status:** `reviewed_only`. Dieses Lab ist eine lokale Artefaktübung. Es startet, pullt, baut oder scannt kein Image, nutzt keine Registry, ändert keine Namespaces/cgroups/Mounts und benötigt keine Container-Runtime.

### Ziel

Unterscheide deklarative Image-/Runtime-Metadaten von einem laufenden Prozess und von einer flüchtigen Schreibschicht. Belege mit einem lokalen SHA-256 nur die Unveränderlichkeit der eigenen Beispieldatei, nicht die Vertrauenswürdigkeit eines echten Containerimages.

### Ablauf

```bash
set -euo pipefail

work_dir="$(mktemp -d "${TMPDIR:-/tmp}/kb0048-XXXXXX")"
trap 'rm -rf -- "$work_dir"' EXIT

mkdir -p "$work_dir/rootfs/app" "$work_dir/ephemeral"
printf '%s\n' 'application placeholder; not an image' > "$work_dir/rootfs/app/service.txt"

cat > "$work_dir/image-contract.json" <<'JSON'
{
  "kind": "learning-stand-in-not-an-oci-image",
  "artifact": {"reference": "example@sha256:replace-after-calculation"},
  "rootfs": {"immutable_intent": true},
  "process": {"pid_1_contract": "signal-and-reap-required"},
  "state": {"ephemeral_path": "/work", "durable_state": "external-service-required"},
  "security": {"non_root": true, "host_namespaces": false}
}
JSON

sha256sum "$work_dir/image-contract.json"
python3 -m json.tool "$work_dir/image-contract.json" > "$work_dir/validated-contract.json"
printf 'temporary runtime data\n' > "$work_dir/ephemeral/request.tmp"

find "$work_dir" -maxdepth 3 -type f -printf '%p %s bytes\n'
```

### Auswertung, Gegenproben und Cleanup

1. `image-contract.json` ist **kein** OCI-Image und der Hash ist keine Signatur oder Freigabe. Es demonstriert nur die Differenz zwischen deklarierter Datei und Runtime.
2. **Gegenprobe 1:** `ephemeral/request.tmp` steht absichtlich außerhalb des `rootfs`-Stand-ins. Lösche den ganzen Arbeitsordner und stelle fest, dass kein langlebiger State existiert.
3. **Gegenprobe 2:** Ändere die JSON-Datei in einer Kopie und berechne den Hash erneut. Der andere Hash beweist Content-Unterschied, nicht Vertrauenswürdigkeit oder Kompatibilität.
4. **Gegenprobe 3:** Wenn `python3` fehlt, wird keine Installation durchgeführt; die JSON-Datei bleibt als statisches Lernartefakt. Das Lab behauptet keine Validierung gegen die OCI Specification.
5. Der `trap` entfernt nur den frisch erzeugten temporären Ordner. Bei einem abgebrochenen Prozess kontrolliere den genauen Pfad, bevor du ihn manuell entfernst.

## Dependencies und Cross-References

- [KB-0032: Prozesse und Lebenszyklen](02-prozesse-und-lebenszyklen.md) erklärt PID 1, Signale und Childprozesse.
- [KB-0035: Dateisysteme und Persistenzpfade](05-dateisysteme-und-persistenzpfade.md) erklärt Rootfs, Mounts und echte Durability.
- [KB-0037: Namespaces und Isolation](07-namespaces-und-isolation.md) ist die kanonische Namespacebasis.
- [KB-0038: cgroups und Ressourcenbegrenzung](08-cgroups-und-ressourcenbegrenzung.md) behandelt Budgets und Isolation.
- [KB-0047: Linux-Sicherheitsgrundlagen](17-linux-sicherheitsgrundlagen.md) erklärt non-root, Capabilities und LSM.
- KB-0095 und KB-0471 führen Container später in Plattform-/Orchestrierungskontexte über.
- [KB-0720: Portfolioevidenz und Reifemodelle](../../30-architect-practice/44-portfolioevidenz-und-reifemodelle.md) sammelt Contract-, Test- und Betriebsnachweise.

## Quellen und Aktualitätsnotizen

| Quelle | Aussage / Verwendung | Stand |
|---|---|---|
| Dateikatalog | Verbindlicher Scope und Reihenfolge. | 2026-09-14 |
| [OCI Runtime Specification](https://github.com/opencontainers/runtime-spec/blob/main/spec.md) | Containerkonfiguration, Ausführungsumgebung und Lifecycle. | abgerufen 2026-09-16 |
| [OCI Image Specification](https://github.com/opencontainers/image-spec/blob/main/spec.md) | Image manifest, index, layers, config and content-addressability. | abgerufen 2026-09-16 |
| [`namespaces(7)`](https://man7.org/linux/man-pages/man7/namespaces.7.html) | Linux Namespace-Typen und Isolation. | Linux man-pages, abgerufen 2026-09-16 |
| [cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html) | Ressourcenhierarchie und Controllerkontext. | Linux Kernel Documentation, abgerufen 2026-09-16 |
| [Docker Rootless Mode](https://docs.docker.com/engine/security/rootless/) | Rootless-Runtime-/Daemon-Kontext und Voraussetzungen. | abgerufen 2026-09-16 |
| [KB-0047](17-linux-sicherheitsgrundlagen.md) | lokale Rechte-/Capability-/LSM-Grundlage. | 2026-09-16 |

OCI-Versionen, Runtime-/snapshotter-/registry-/rootless-Fähigkeiten, cgroup delegation, LSM-/Seccomp-/namespace-Verhalten, managed platform limits, storage drivers, availability and pricing are time- and environment-dependent. A production design validates them against the actual runtime, kernel, node class, registry, data classification and workload.

## Bonus: New Tech and Innovations

**Stand 2026-09-16 — OCI-Artefakte entwickeln sich über klassische Containerimages hinaus zu einem allgemeinen, content-addressable Verpackungsformat für Artefakte.** **Reifegrad: Established für Images, Adopting für breitere Artefaktketten.** Der Nutzen ist eine einheitlichere Provenance-/Distributionkette; die Gefahr ist, einen Digest mit ausreichender Vertrauenswürdigkeit gleichzusetzen. Ein Pilot akzeptiert neue Artefakttypen erst mit Signatur-/Policy-, Retention-, SBOM- und Consumer-Kompatibilitätstest. Grundlage ist die [OCI Image Specification](https://github.com/opencontainers/image-spec/blob/main/spec.md).

**Stand 2026-09-16 — Rootless Runtime-Modelle reduzieren bestimmte Daemon- und Runtimeprivilegien, wenn User Namespace, Netzwerk, Storage, cgroup und Observability auf der Zielplattform getragen werden.** **Reifegrad: Adopting.** Ein Pilot prüft Effektivprivileg, Build/Pull/Run, Network-/Storage-/Resourceverhalten, Support, Denial- und Recoverypfad; eine fehlende Funktion darf nicht in einen stillen privileged Fallback führen. Grundlage sind die [Docker Rootless-Dokumentation](https://docs.docker.com/engine/security/rootless/).

**Stand 2026-09-16 — Für AI-Workloads verschiebt sich der Containervertrag von „Startet der Prozess?“ zu „Ist die modell-, cache-, identity- und resourceabhängige Fähigkeit unter SLO verfügbar?“.** **Reifegrad: Adopting.** Ein Pilot misst artifact pull, cache, model-/dependencywarmup, readyness, p99, resource pressure, state recovery and cost per successful request. Er akzeptiert keinen Portcheck als alleinigen Readinessnachweis.

