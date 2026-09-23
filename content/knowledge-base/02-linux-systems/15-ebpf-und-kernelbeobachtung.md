---
{"id": "KB-0045", "title": "EBPF und Kernelbeobachtung", "domain": "02", "sequence": 15, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["PLATFORM", "CLOUD", "GENAI", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0031", "concepts": ["Kernel und System Calls", "User Space / Kernel Space", "Kernel ABI"], "needed_for": "understanding"}, {"id": "KB-0036", "concepts": ["Sockets", "TCP", "Netzwerk-I/O"], "needed_for": "understanding"}, {"id": "KB-0037", "concepts": ["Namespaces", "Isolation", "Hostsicht"], "needed_for": "both"}, {"id": "KB-0044", "concepts": ["Latenz", "Queueing", "I/O-Engpassdiagnose"], "needed_for": "both"}], "related": ["KB-0038", "KB-0046", "KB-0047", "KB-0048", "KB-0471", "KB-0562", "KB-0720"], "applies": ["KB-0046", "KB-0471", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein read-only Inventar erfasst Kernel-, BTF-, bpffs- und Berechtigungszustand, formuliert eine Trace-Hypothese und protokolliert eine erwartete Ablehnung ohne Programme zu laden.", "rationale": "Das Ziel ist ein sicheres, reproduzierbares Beobachtungsdesign vor einem autorisierten Sandbox-Pilot."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein Observability-Entwurf wählt Hook, Ereignisrate, Map, Aggregation, Datenminimierung, Fallback und Supportmatrix für eine konkrete Hypothese.", "rationale": "Kernelnähe, Overhead, Privileg und Portabilität werden explizit gegen Nutzen abgewogen."}, "STAFF-TARGET": {"active": true, "scope": "Teams erhalten einen BPF-Exception-Prozess, Budget für Ereignis- und Map-Ressourcen sowie SLO-gebundene Telemetrie.", "rationale": "Eine Debug-Technik wird nur mit Owner, Kill Switch, Sampling und Incident-Rollback betreibbar."}, "CHIEF-TARGET": {"active": true, "scope": "Die Plattformstrategie trennt zentrale, geprüfte Sensoren von Produktcode und legt Governance, Datenresidenz, Upgrade-Support und Spezialistenownership fest.", "rationale": "eBPF kann eine gemeinsame Observability- oder Netzwerkfähigkeit sein, darf aber keine unkontrollierte Kernel-Programmplattform werden."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Verifier-Debugging, CO-RE/relocations, libbpf, BTF, JIT, XDP, tc, LSM, kfuncs, eBPF-Forensics und Cilium-Datapath sind Spezialistenbereiche.", "rationale": "Die Kernzielrolle beherrscht Entscheidungs- und Reviewtiefe; produktive Policy-/Datapath-Änderungen gehören zu autorisierten Spezialisten und späteren kanonischen Dateien."}}, "lab_validation": [{"lab_id": "KB-0045-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplantes read-only Linux-Sandbox-Inventar", "evidence": "Berechtigungsgrenzen, negative Probe, Beobachtungshypothese, Cleanup und keine Attach-/Load-Schritte geprüft.", "limitations": "Kein BPF-Programm, keine Map, kein Hook, kein Cilium-Datapath und keine Kernel- oder Netzwerkrichtlinie wurden geladen, verändert oder getestet."}]}
---
# EBPF und Kernelbeobachtung

> **Ziel:** eBPF liefert eine präzise, kontextreiche Sicht auf Kernelereignisse. Es ist aber kein gefahrloses Debugging-Plugin und keine Abkürzung zu Cilium-Betrieb. Entscheide zuerst, welche Hypothese du prüfen musst, und begrenze Programm, Berechtigung, Ereignisrate, Daten und Lebensdauer danach.

## Purpose, Definition und Scope

Extended Berkeley Packet Filter (eBPF) ist eine Linux-Kernel-Fähigkeit, mit der verifizierte Programme an definierten Ereignissen ausgeführt werden können. Programme erhalten einen kontextabhängigen, eingeschränkten Zugriff auf Daten und Helper-Funktionen. Sie können Ergebnisse in Maps ablegen oder Ereignisse an einen User-Space-Consumer übergeben. Die `bpf(2)`-Schnittstelle beschreibt Programme, Maps, Verifier und mehrere Attach-Klassen.

Der Scope ist **sichere Kernelbeobachtung**: System-Call-nahe Ereignisse, Tracepoints, Netzwerkereignisse, Latenz-/Fehlerhypothesen, Maps, Hooks, Verifier, BTF und der Betriebsvertrag einer Beobachtung. Diese Datei implementiert keine Durchsetzungs- oder Routingpolicy, keine XDP-Optimierung und keinen Cilium-Datapath. Das sind eigene, später zu prüfende Spezial- und Plattformthemen.

Nach der Bearbeitung kannst du:

1. den Lebenszyklus `Quellprogramm → Objekt → Loader → Verifier → Attach → Map/Ring → Consumer` erklären;
2. einen Hook nach Stabilität, Kontext, Kosten und Beobachtungsfrage auswählen;
3. die Rolle von Verifier, Maps, BTF und CO-RE abgrenzen;
4. ein read-only und datensparsames Diagnoseexperiment von einem produktiven Kernel-Änderungsvorhaben unterscheiden;
5. eine eBPF-Ausnahme mit Risiko, Ownership, Kill Switch, Telemetrie und Upgradeprüfung steuern.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Programme, Maps, Hooks, Verifier und Nutzerraum-Export werden technisch modelliert; Aussagen über eine konkrete Kernelumgebung bleiben prüfpflichtig. |
| HANDS-ON-TARGET | Zuerst ein reines Inventar mit erwarteter Berechtigungsgrenze, danach nur in einer autorisierten Sandbox ein minimaler, zeitlich begrenzter Beobachtungspilot. |
| ARCHITECT-TARGET | Hook, Datenmodell, Sampling, Privileg, Supportmatrix, Fallback und Löschfrist folgen der Hypothese und Datenklasse. |
| STAFF/PRINCIPAL | Einheitliche Sensoren, Incident-Runbooks, On-call-Grenzen, Event- und Map-Budgets verhindern eine Sammlung unkontrollierter Kernelprogramme. |
| CHIEF | eBPF ist eine kontrollierte Plattformfähigkeit mit zentraler Freigabe, nicht eine beliebige Produktabhängigkeit. |

## Mental Model: ein extrem eingeschränkter Sensor im Kernel

Ein eBPF-Programm ist eher ein kleiner Sensor als ein allgemeines Kernelmodul. Es darf nicht beliebig Speicher dereferenzieren, Schleifen oder Helper aufrufen. Vor dem Laden modelliert der Verifier mögliche Ausführungspfade und prüft Kontext-, Register-, Pointer- und Boundsregeln. Das senkt das Risiko, beseitigt es aber nicht: ein zugelassenes Programm kann Daten exponieren, CPU verbrauchen, Maps füllen, Event-Pipelines überlasten oder durch Kernel- und Toolunterschiede unerwartet wirken.

```text
Question and success criterion
        |
        v
source / generated program -> ELF object + metadata
        |                           |
        v                           v
loader / policy gate -------> bpf() syscall
                                    |
                              verifier + load policy
                                    |
                         attach to an allowed hook
                                    |
event context -> bounded program -> map / ring buffer
                                    |
                             user-space collector
                                    |
                    aggregation, redaction, export, expiry
```

Die Analogie endet beim Wort „Sensor“. Manche BPF-Programmtypen können Traffic lenken, Entscheidungen beeinflussen oder Sicherheitskontexte integrieren. Deshalb wird zwischen **observe**, **enrich**, **enforce** und **accelerate** unterschieden. Diese Datei behandelt standardmäßig nur `observe`; jede stärkere Klasse braucht einen separaten Architektur- und Sicherheitsentscheid.

## Prerequisites und Dependencies

| ID | Art | Relevanz |
|---|---|---|
| [KB-0031](01-linux-kernel-und-systemaufrufe.md) | harte Voraussetzung | User-/Kernel-Space, System Calls und Kernel-ABI erklären die Attach- und Sichtgrenzen. |
| [KB-0036](06-sockets-und-netzwerk-i-o.md) | harte Voraussetzung | Netzwerkhooks müssen zu Socket-, TCP- und Paketpfaden passen. |
| [KB-0037](07-namespaces-und-isolation.md) | Anwendung und Lab | Container- und Hostsicht können voneinander abweichen. |
| [KB-0044](14-block-i-o-und-engpaesse.md) | Anwendung und Lab | Eine eBPF-Messung soll I/O-/CPU-/Queue-Hypothesen widerlegen oder stützen, nicht ersetzen. |

Ergänzend: KB-0038 für Ressourcengrenzen, [KB-0046](16-linux-fehlersuche-und-performance-debugging.md) für die breitere Debuggingmethode, KB-0047 für Linux-Privilegien und KB-0048 für das Container-Substrat.

## Core Concepts und Mechanismen

### Programm, Loader, Attach und Lifetime

Ein BPF-Programm wird als Bytecodeobjekt über `bpf(2)` geladen. Beim Laden prüfen Kernel und Sicherheitsrichtlinien das Programm. Ein erfolgreicher Program-FD bedeutet noch nicht, dass es dauerhaft aktiv ist. Die Lebenszeit hängt vom Attach ab: ein Programm kann beim Prozessende verschwinden oder durch eine Referenz eines Kernel-Subsystems weiterleben. Ein Betriebsdesign muss daher explizit erfassen:

- welche Binärrevision und welcher Build/Hash geladen ist;
- an welchem Hook und auf welchen Nodes/Namespaces sie hängt;
- welche Maps, Speicherbudgets und Consumer dazugehören;
- welcher Owner Programme deaktiviert oder entfernt;
- wie ein Upgrade, Crash oder Rollback den Zustand verändert.

„Der Debug-Prozess ist beendet“ ist kein verlässlicher Cleanupnachweis. Der Inventar- und Kill-Switch-Pfad ist Teil des Designs.

### Hooks: richtige Frage vor richtiger Technik

Ein Hook bietet einen Zeitpunkt und Kontext. Er gibt nicht automatisch die beste Antwort.

| Hook-Familie | Beobachtungsfrage | Stärken | Grenzen / Stabilität |
|---|---|---|---|
| Tracepoint | „Welches dokumentierte Kernelereignis trat wann auf?“ | klarer Eventbezug, oft gutes Betriebsprofil | Felder und Verfügbarkeit müssen auf Zielkernel geprüft werden. |
| Kprobe / kretprobe | „Wie oft oder wie lange durchläuft eine konkrete Kernelfunktion?“ | tiefe Diagnose, Return-Latenz möglich | Symbol-/Implementierungsabhängigkeit; Upgradefragil. |
| Fentry / fexit | „Welche Funktionsein-/ausgänge mit Typinformation sind relevant?“ | geringerer Overheadpfad in passenden Umgebungen, BTF-Bezug | BTF und Kernel-/Toolsupport voraussetzen. |
| Uprobe / USDT | „Was geschieht in einer bestimmten User-Space-Bibliothek oder Anwendung?“ | verbindet Codepfad mit Kerneltelemetrie | Binary-/Symbol-/Releaseabhängigkeit, Deploywechsel. |
| Socket / cgroup socket | „Welche Socketoperation oder Verbindung passiert in einem Scope?“ | Netzwerk- und Containerkontext | kann Datenschutz-, Policy- und Namespacefragen öffnen. |
| TC / XDP | „Was passiert im Paketpfad sehr früh oder am Traffic-Control-Punkt?“ | niedrige Latenz, Paketkontext | nicht als Debugstandard; kann Traffic beeinflussen, anspruchsvoll. |
| LSM | „Welche sicherheitsrelevante Aktion soll beurteilt werden?“ | tiefer Securitykontext | Enforcement und Governance; nicht in diesem Kapitel implementieren. |

Wähle einen **Tracepoint**, wenn ein dokumentiertes Ereignis die Frage beantwortet. Wähle keinen Kprobe nur weil er „tiefer“ ist. Tiefe ohne stabile Supportmatrix produziert Upgrade- und On-call-Risiko.

### Verifier: Sicherheitsfilter mit Grenzen

Die Kernel-Verifier-Dokumentation beschreibt eine Analyse des Kontrollflusses sowie eine symbolische Nachverfolgung von Registern und Stack über mögliche Pfade. Pointer dürfen nur mit erlaubtem Typ, gültigem Bereich und passender Ausrichtung benutzt werden. Helper haben programmspezifische Signaturen; ein für Tracing erlaubter Helper kann in einem anderen Kontext verboten sein. Der Verifier verhindert viele Klassen unsicherer Programme und erzwingt Terminierung innerhalb seiner Regeln.

Er ist keine umfassende Governanceinstanz:

- Er entscheidet nicht, ob die beobachteten Daten geschäftlich zulässig sind.
- Er kennt keinen Datenminimierungszweck und keine Retention.
- Er garantiert nicht, dass ein zulässiges Programm unter jeder Ereignisrate akzeptablen Overhead hat.
- Er ersetzt keine Freigabe eines Hook- oder Policywechsels.
- Eine Verifier-Rejection ist keine Aufforderung, Schutzmaßnahmen zu lockern; sie ist eine Designrückmeldung.

Aktuelle Kernel entwickeln Loop- und Programmunterstützung weiter. Portabel ist daher nicht die Annahme „alle Loops sind verboten/erlaubt“, sondern: Zielkernel, Programtyp, Verifierlog, Toolchain und Worst-Case-Pfad werden im Supporttest überprüft.

### Maps und Datenfluss

Maps sind vom Kernel verwaltete Datenstrukturen, die eBPF-Programme und User Space gemeinsam verwenden können. `bpf(2)` beschreibt Typ, maximale Einträge, Key- und Value-Größe als wesentliche Mapattribute. Eine Map ist kein unbeschränkter Eventbus.

| Map-/Exportform | Gute Nutzung | Risiko |
|---|---|---|
| Array / per-CPU Array | feste Buckets, Zähler, Histograms | vorallokierter Speicher; Aggregation über CPUs nötig. |
| Hash / LRU Hash | begrenzte Zustände pro Connection, PID oder Key | cardinality explosion, Eviction, Lock-/Memorykosten. |
| Per-CPU Hash | contentionarme lokale Zähler | hoher Speicher pro CPU und Merge-Aufwand. |
| Ring buffer / perf event output | begrenzte Ereignisübertragung an Consumer | Consumerlag, Drop, Datenschutz, Burst-Overhead. |
| Program array / tail calls | modularisierte Programme | höhere Komplexität und Änderungen am Kontrollfluss. |
| Pinning in bpffs | kontrollierte Lifetime / Sharing | verwaiste Objekte und Berechtigungsrisiko. |

Vor der Implementierung rechnet man die Obergrenze:  
`map_memory_upper_bound ≈ max_entries × (key_bytes + value_bytes + implementation_overhead)`; bei per-CPU-Maps zusätzlich ungefähr pro möglicher CPU. Dies ist keine exakte Kernel-Abrechnung, sondern eine Planungsobergrenze, die mit Zielkernel und Messung geprüft wird. Hohe Kardinalität wird nicht „beobachtbarer“, nur weil eine Map größer gesetzt wird.

### BTF, CO-RE und Portabilität

BPF Type Format (BTF) bringt Typinformationen in ein kompaktes Format. In Kombination mit einer geeigneten Toolchain kann CO-RE (Compile Once, Run Everywhere) strukturelle Unterschiede über Relocations besser behandeln. Das reduziert, aber eliminiert nicht, die Abhängigkeit von Kernel, BTF-Verfügbarkeit, Programtyp, Helper, Config und Zielarchitektur. Ein CO-RE-Label ist daher kein Freibrief für jedes beliebige Distribution- oder Managed-Node-Upgrade.

Eine Supportmatrix enthält mindestens: Kernelrelease und -config, CPU-Architektur, BTF-Präsenz, container/runtime constraints, benötigte Capabilities, allowed hooks, Loader-/libbpf-Version, Exportpfad, erwartete Ereignisrate und Fallback ohne BPF.

### JIT und Performance

Viele Systeme führen BPF nach Verifikation über JIT aus. Das ist eine Implementierungs- und Sicherheitskonfiguration, keine SLO-Zusage. Der dominante Aufwand kann außerdem im Eventvolumen, Mapzugriff, User-Space-Export, Serialisierung, Collector oder Backend liegen. Performancearbeit beginnt mit einer begrenzten Frage und einem Sampling-/Aggregationplan; sie beginnt nicht mit maximaler Detailtelemetrie.

## Architecture und Data Flow: diagnose eines steigenden Connect-p99

Das Beispiel ist eine Lernannahme, kein reales Praxisprojekt.

```text
API request
  -> application creates outbound socket
  -> approved tracing hook observes bounded metadata
  -> BPF program aggregates count/latency bucket per service class
  -> ring buffer sends sampled error summary
  -> local collector redacts / labels / rate limits
  -> metrics and trace correlation
  -> incident workflow decides whether DNS, CPU, cgroup, network or remote service is causal
```

**Frage:** Steigt der p99 von ausgehenden Connects für eine Serviceklasse nach einer Runtimeänderung?

**Nicht zulässige Abkürzung:** Vollständige Paketinhalte, Authorization Headers, Promptteile, Kundennamen, beliebige PID-Listen oder ein Enforcementhook werden erfasst, „um sicherzugehen“.

**Boundaries:**

1. Die Anwendung liefert eine erlaubte, pseudonyme Serviceklasse; das BPF-Programm erzeugt keine unbounded Labels.
2. Die Node-Policy erlaubt nur einen signierten/geprüften Sensor mit einem konkreten Hook und Ablaufdatum.
3. Der Collector besitzt Berechtigungen zum Lesen der vorgesehenen Map bzw. des Rings, aber keine generelle Kerneladministration.
4. Export ist tenant- und datenschutzkonform. Samples sind begrenzt und kurzlebig.
5. Bei Drop, Consumerlag, Upgrade-Unsicherheit oder Overhead löst der Kill Switch das Detach aus; der Service läuft mit herkömmlicher Application-/Networktelemetrie weiter.

Die Interpretation bleibt mehrstufig. Ein langsamer Connect kann DNS, SYN-Recovery, route, remote accept, cgroup, CPU-Delay oder User-Space-Scheduling enthalten. eBPF verfeinert eine Hypothese; es beweist nicht ohne Gegenvergleich die Ursache.

## Protocols, Standards und Tools

| Element | Rolle | Vor Einführung prüfen |
|---|---|---|
| `bpf(2)` | Kernel-Syscall für Programm-/Map-Operationen | Command, Programtyp, Sicherheitsmodell, Fehlerpfad. |
| Verifier | statische Sicherheits- und Zustandsprüfung | Verifierlog, Zielkernel, Helper-/Contextrestriktionen. |
| BTF / CO-RE | Typinformation und Kompatibilitätshilfe | BTF, Toolchain, Architektur, Relocations, Upgradepfad. |
| libbpf | Loader-/CO-RE-Ökosystem | Version, Lizenz, Buildchain, Error reporting, ownership. |
| `bpftool` | Inventar, Diagnose und kontrollierte Verwaltung | nur autorisierte Umgebung; Ausgabe redigieren; keine Copy/Paste-Änderungen. |
| bpftrace / BCC | explorative Beobachtungswerkzeuge | Skriptquellen, Privileg, Eventvolumen, temporäre Dauer. |
| perf / OpenTelemetry / App metrics | Ergänzende Sicht | eBPF ersetzt weder Application-Semantik noch Trace-Propagation. |
| Cilium | späteres Plattformprodukt für Networking/Security | nicht aus einer Observability-Datei konfigurieren oder ableiten. |

Es gibt keinen einzelnen branchenweiten „eBPF-Standard“, der eine Anwendung über alle Linuxdistributionen portabel macht. Die primäre Wahrheit ist der Zielkernel mit dessen Konfiguration und die dokumentierte Tool-/Runtime-Supportmatrix.

## Konfiguration und Implementierung: minimaler Beobachtungsvertrag

Das Beispiel ist eine **Policy- und Designvorlage**, keine lauffähige Loaderkonfiguration:

```yaml
kernel_observation:
  id: connect-p99-investigation-v1
  mode: observe
  question: "Welche begrenzte Systemklasse korreliert mit erhöhtem outbound-connect-p99?"
  hook:
    preferred: tracepoint
    fallback: application_metric_only
    prohibited: [xdp, tc_enforcement, lsm_enforcement]
  scope:
    node_pool: approved-sandbox-only
    workload_selector: service-class-hash
    duration_minutes: 30
  data:
    allow: [monotonic_duration_bucket, errno_class, service_class_hash]
    prohibit: [payload, hostname_plaintext, url, authorization_header, prompt, document_content]
  resource_budget:
    max_map_entries: 4096
    max_events_per_second: 200
    sampling: 0.05
    drop_action: "aggregate-and-alert; do-not-retry-in-kernel"
  governance:
    owner: platform-observability
    approver: security-and-platform
    change_ticket: required
    kill_switch: required
    expiry: required
  validation:
    verifier_log_review: required
    kernel_matrix: required
    overhead_baseline: required
    negative_privilege_probe: required
```

Ein sinnvolles Quellprogramm bleibt eng: Eventkontext lesen, benötigte Werte bounds-checken, in festen Buckets aggregieren oder einen begrenzten Sample schreiben, zurückkehren. Es öffnet weder Dateien, noch führt es Netzwerkzugriffe aus, noch serialisiert es Kundennutzlast. Der Loader kontrolliert Version, Attach, Map-Limits, Pinning, Cleanup und die Weitergabe des Verifierlogs an eine abgesicherte Diagnoseablage.

## Scalability und Performance

Die Kosten einer Beobachtung sind ungefähr:

```text
overhead =
  events_per_second
  × (program_execution + map_operation + optional_export)
  + user_space_consumer_cost
  + storage_and_query_cost
```

Die Formel ist ein Modell, keine Kalibrierung. Besonders gefährlich sind seltene Fehlerpfade unter Incidentlast, weil sie plötzlich jede Anfrage beobachten können. Eine Messung muss daher Normal-, Peak- und Fehlerlast abdecken.

### Steuerhebel

| Hebel | Nutzen | Nebenwirkung |
|---|---|---|
| Aggregation im Kernel | wenige Zähler statt einzelner Events | weniger forensische Detailtiefe |
| Sampling | begrenzt Eventkosten | seltene Ereignisse können fehlen |
| feste Buckets | kontrollierte Kardinalität | Verlust feinster Unterschiede |
| zeitliche Begrenzung | reduziert Dauer-/Upgrade-Risiko | möglicherweise kein seltenes Signal |
| per-CPU-Zähler | weniger Contention | Merge und Speicherkosten |
| rate-limited Export | schützt Collector/Backend | Drop- und Bias-Behandlung nötig |
| Fallback zu App metrics | sichere Verfügbarkeit | geringere Kernelkontexttiefe |

SLO für den Sensor: begrenzter zusätzlicher CPUanteil, vorab definierte Map- und Ring-Obergrenzen, beobachtete Drop-Rate, keine Produkt-SLO-Verletzung, vollständig auditiertes Detach innerhalb eines definierten Zeitfensters. Wenn diese Werte nicht nachweisbar sind, bleibt das Instrument deaktiviert.

### Container, Node und Cluster

Ein Container kann eingeschränkte Sicht auf `/sys`, BTF, bpffs und Events haben. Eine hochprivilegierte DaemonSet-artige Architektur verschiebt die Vertrauensgrenze auf den Node und kann alle Workloads sehen. Daraus folgt nicht, dass „Debugging im Container“ harmlos ist. Multi-Tenant-Cluster verlangen eine Plattformentscheidung zu:

- Node-Pool-Isolation und erlaubten Sensoren;
- Scope von Host-, Pod-, cgroup- und Netzwerknamensraum;
- Signierung, Review und Versionierung der Artefakte;
- Exportlabel, Datenresidenz und Zugriff;
- Upgrade-/Rollbackreihenfolge für Kernel, Agent, Runtime und Observabilitybackend;
- Notfall-Detach ohne Verlust der Anwendungsfunktion.

## Reliability und Failure Modes

| Fehlermodus | Typisches Signal | Schutz / Reaktion |
|---|---|---|
| Verifier-Rejection | Loaderfehler, Log mit invalid access/uninitialized register | Programm vereinfachen und Bounds-/Kontextmodell korrigieren; keine Privilegien erweitern. |
| Hook fehlt oder ändert sich | Attachfehler nach Kernel-/Imageupgrade | Supportmatrix, Canary, fallback zu Standardtelemetrie. |
| Consumer zu langsam | Ring drops, steigende Exportlatenz | sampling/aggregation erhöhen, nicht unbounded puffern. |
| Map voll | `E2BIG`/Drop/Eviction, verlorene States | Cardinality begrenzen, eviction semantisch auswerten, Budget prüfen. |
| Sensor erzeugt Overhead | CPU- oder p99-Anstieg korreliert mit Rollout | Kill switch, progressive rollout, Baselinevergleich. |
| Verwaiste Programme/Maps | Inventar zeigt unerwartete Attachments/Pins | Owner- und Lifecycle-Scan, kontrollierter Detach, Postmortem. |
| Kernel-/Tool-Inkompatibilität | CO-RE/loader error, fehlende BTF/Helper | documented fallback; keine stillen ABI-Hacks. |
| Datenleck über Telemetrie | sensitive labels/event fields, breiter Debugzugriff | data allowlist, redaction, RBAC, retention, audit. |
| Policy statt Beobachtung | Programm verändert Traffic/Security ohne Review | scope gate: observe-only; separate architecture board for enforcement. |

Retry ist hier selten die richtige Antwort. Ein abgewiesenes oder inkompatibles Programm wird nicht im Sekundentakt neu geladen. Ein Rollout muss idempotent sein: eindeutige Version, Attach-Status, erwartete Mapnamen, bereinigbarer Owner und Detach vor neuer Revision.

## Security, Governance und Compliance

eBPF ist ein privilegiennahes Interface. `capabilities(7)` dokumentiert `CAP_BPF` für privilegierte BPF-Operationen; konkrete Rechte und die zulässige Programmart sind jedoch abhängig von Kernel, Sicherheitseinstellungen, Namespace, LSM/Lockdown, Container-Runtime und Plattformpolicy. „Hat root“ oder „läuft im Kubernetes-Cluster“ ist keine ausreichende Autorisierung.

| Asset / Risiko | Kontrolle | Beleg |
|---|---|---|
| Kernelintegrität | nur erlaubte, überprüfte Artefakte; Verifierlog, Signatur-/Provenance-Policy; Versionsinventory | change record, hash, approved loader. |
| Daten in Eventkontext | allowlist, Feldminimierung, Sampling, Hashing/Redaction vor Export | schema review, negative data probe. |
| Nodeweite Sicht | getrennte RBAC-Rollen für author, deployer, reader, incident responder | access review and audit logs. |
| Map-/CPU-Ressourcen | feste Limits, cgroup/agent budget, rate limits, expiry | dashboard plus quota test. |
| Persistente Attachments | eindeutiger Owner, TTL, inventory, tested kill switch | attach/map inventory before/after. |
| Supply chain | reproduzierbarer Build, SBOM/attestation nach Plattformstandard, image provenance | build and release evidence. |
| Compliance | Datenklassifikation, Region, Retention und Zweckbindung vor Export | privacy/security review per use case. |

Ein Diagnoseprogramm kann technisch „read-only“ sein und trotzdem personenbezogene, geschäftliche oder geheime Metadaten ableiten. Netzwerkattribute, Dateipfade, Prozessargumente, Containerlabels und Zeitmuster werden deshalb wie potenziell sensitive Telemetrie behandelt.

## Observability und Troubleshooting

### Der Sensor beobachtet sich selbst

Ein eBPF-Design ohne eigene Gesundheitsdaten ist unvollständig. Metriken sollten enthalten:

- `sensor_loaded`, `attach_success`, `active_program_revision`, `active_map_count`;
- event rate, sampled rate, aggregate count, ring/export drops;
- map occupancy, eviction/error counts, memory upper-bound estimate;
- loader/verifier error class, detach action, TTL remaining;
- CPU-/walltime des Collectors und Korrelation mit Produktp99;
- Datenklassifikation, Node Pool, Serviceklasse und Change-ID als erlaubte Dimensionen.

Nicht erlaubt als breitflächiges Label: PID, vollständiger cgroup-Pfad, Dateiname, URL, DNSname, User-ID, Token, Prompt oder Dokumentinhalt.

### Diagnosepfad

1. **Problem und Entscheidung definieren.** „Mehr Sicht“ ist kein Ziel. Formuliere Outcome, erwartetes Signal, SLO und Fallback.
2. **Ohne BPF starten.** Prüfe Application Metrics, Logs, Traces, `ss`, CPU/Memory/I/O-Signale und Change Events. Vielleicht ist die Frage bereits beantwortbar.
3. **Hook-Matrix prüfen.** Welcher stabile und minimal invasive Hook trägt genau die fehlende Information? Dokumentiere Alternativen und warum sie entfallen.
4. **Privilege und Scope verifizieren.** Node, Namespace, BTF, bpffs, Capabilities und Richtlinien read-only erfassen. Eine erwartete Ablehnung zählt als Sicherheitsbeleg.
5. **Sensor begrenzen.** Fixed buckets, maximaler Eventrate, TTL, Kill switch, Owner, Canary und Datenschutzallowlist definieren.
6. **In autorisierter Sandbox prüfen.** Verifierlog, Attach, Eventsemantik, Drop, CPU und Cleanup gegen Baseline. Kein „funktioniert auf meinem Node“ als Clusterfreigabe.
7. **Produktionsrollout nur nach Freigabe.** Small scope, reversible, beobachtbar. Bei Overhead, Sicherheitsbefund oder Kompatibilitätsbruch sofort detachen.
8. **Ergebnis schließen.** Hypothese bestätigt/widerlegt, Antwort in bestehende Metrik oder Runbook überführen, Programm nach Ablauf entfernen.

## Cost und FinOps

BPF selbst hat keinen simplen Listenpreis. Kosten entstehen aus Engineering, Kernel-/Distribution-Support, Agentbetrieb, CPU/Mem/Storage für Telemetrie, Netzwerkexport, Query/Retention, Securityreview und Incidentrisiko. Ein Modell:

```text
total_cost =
  sensor_development_and_review
+ node_agent_cpu_memory
+ event_export_network
+ telemetry_ingest_and_retention
+ kernel_upgrade_compatibility_testing
+ on_call_and_incident_risk
```

Die Nutzenmetrik ist nicht „Events pro Sekunde“, sondern etwa verkürzte Time-to-Diagnosis, weniger unnötige Node-/Storage-Upgrades, frühere Sicherheitsdetektion oder nachweislich weniger Kundenimpact. Ein dauerhafter Sensor braucht eine Kostenallokation pro Plattform- oder Produktklasse. Ein einmaliger Incident-Sensor erhält Ablaufdatum und Budget, damit er nicht unsichtbar zum dauerhaften Kostenfaktor wird.

## Trade-offs, Alternativen und Anti-Patterns

| Option | Wann angemessen | Grenze |
|---|---|---|
| App Metrics / Traces | fachliche Semantik und propagierte Requestkontexte verfügbar | erkennt nicht jede Kernel-/Runtimeursache. |
| Logs | diskrete, geprüfte Ereignisse mit Kontext | hoher Volume, Sampling und PII-Risiko. |
| `strace` / perf | lokal, kurzzeitig, stark eingegrenzt | kann zu invasiv sein, nicht für breitflächigen Dauerbetrieb. |
| eBPF Tracepoint Sensor | fehlender Kernelkontext, begrenzte Frage, autorisierte Plattform | Kernel-/Toolmatrix, Privileg und Datenminimierung nötig. |
| Kprobe/Fentry | tiefe, gezielte Spezialdiagnose | Release-/Symbol-/BTF-Abhängigkeit und Spezialistenreview. |
| XDP/TC/Cilium-Policy | Netzwerkperformance oder Enforcement als eigene Plattformentscheidung | nicht als Diagnoseabkürzung und nicht in dieser Datei. |

Anti-Patterns:

- ein „all events“-Programm laden und später entscheiden, welche Daten nützlich sind;
- Event-Rohdaten mit unbegrenzten Labels an ein Telemetriebackend streamen;
- Verifier-Fehler durch höhere Privilegien oder deaktivierte Schutzmechanismen „lösen“;
- BPF-Tooling in jede Anwendung einbetten, statt zentrale Sensoren bereitzustellen;
- eine Cilium-/XDP-Änderung aus einer Trace-Hypothese ableiten;
- Cleanup dem Prozessende überlassen, obwohl Maps oder Attachments fortbestehen können;
- Featureverfügbarkeit aus einem anderen Kernel, Laptop oder Cloudanbieter kopieren;
- eine Messung ohne Baseline, Negative Probe und Kill Switch als Performancebeweis verwenden.

## Staff-, Principal- und Chief-Level Decisions

### Staff: von Incidenttelemetrie zu einem sicheren Experiment

Staff verantwortet den kleinsten Sensor, der eine konkrete technische Entscheidung ermöglicht. Die Vorlage benennt Hypothese, Hook, Datenallowlist, Frequenz, Mapbudget, Consumer, Alarm, TTL, Owner, Canary, Fallback und Detach. Beleg ist nicht nur ein Screenshot, sondern Verifier-/Attachprotokoll, Overheadvergleich, Drop-Statistik, bereinigte Datenprobe und Cleanup. Neubewertung: Kernelupgrade, geänderte Datenklasse, Produktp99, Dropbudget oder abgelaufene TTL.

### Principal: konsistente Plattformfähigkeit

Principal entscheidet, welche BPF-Artefakte zentral gebaut, geprüft und angeboten werden. Dazu gehören Loader, Signierung, Registry, Supportmatrix, Sandbox, Rolloutmechanik, node pool isolation, Datenschema, Exportpolicy, Kostenallokation und SRE-Ownership. Produktteams konsumieren einen begrenzten Sensorvertrag statt Root-/Hostzugriff. Ausnahmen für kprobe, fentry, XDP oder enforcement brauchen höhere Evidenz und eine Migration-/Exit-Strategie.

### Chief: Risiko- und Portfolioentscheidung

Chief legt fest, ob eBPF eine strategische Plattformfähigkeit ist, welche Lieferanten-/Open-Source-Abhängigkeiten vertretbar sind und wann klassische Telemetrie genügt. Die Governance umfasst Datenresidenz, Audit, Securityresponse, Kernel-Lifecycle, Budget, zentrale Spezialisten und Servicegrenzen. Ein Chief standardisiert nicht „eBPF überall“, sondern eine überprüfbare Entscheidungsmethode: Nutzen, Scope, Privileg, Dauer, SLO, Exit und Verantwortlichkeit müssen je Sensor nachweisbar sein.

## Production Checklist

- [ ] Die Beobachtungsfrage, erwartete Entscheidung und Fallback ohne BPF sind dokumentiert.
- [ ] Zielkernel, Architektur, BTF, Programtyp, Hook, Loader und Toolversion stehen in einer Supportmatrix.
- [ ] Programm-/Maprevision, Owner, Attachpunkte und TTL sind inventarisierbar.
- [ ] Verifierlog wurde für die konkrete Buildrevision geprüft; Rejectionpfad führt nicht zu Privilege Escalation.
- [ ] Eventrate, Maplimit, Drop-/Evictionverhalten, CPUbudget und Collector-Overhead haben Grenzwerte.
- [ ] Datenallowlist, Redaction, RBAC, Retention, Audit und Region sind für den Use Case freigegeben.
- [ ] Canary, Kill Switch, Detach, Fallback und Upgrade-/Rollbackablauf sind getestet.
- [ ] Der Sensor beeinflusst weder Paketpolicy noch Security Enforcement, sofern keine getrennte Freigabe vorliegt.
- [ ] Kosten werden einem Plattform- oder Produktowner zugeordnet; Ablauf wird überprüft.

## Interviewfragen mit Antwortleitfäden

### 1. Was ist eBPF und was verhindert der Verifier?

eBPF erlaubt verifizierte Programme an Kernelereignissen; sie nutzen begrenzte Helper und Maps. Der Verifier analysiert Kontrollfluss sowie Register-, Pointer-, Stack- und Boundszustände. Er verhindert wichtige unsichere Speichermuster, entscheidet aber nicht über Datenschutz, sinnvolle Datenminimierung, Betriebskosten oder fachliche Autorisierung.

### 2. Wann nimmst du einen Tracepoint statt eines Kprobe?

Wenn ein passendes, dokumentiertes Ereignis die Frage beantwortet, bevorzuge ich den Tracepoint wegen des klareren Eventvertrags. Einen Kprobe nutze ich nur für eine begründete Spezialdiagnose, mit Symbol-/Kernelmatrix, Canary, Ablauf und Fallback. „Kprobe zeigt mehr“ ist keine ausreichende Entscheidung.

### 3. Welche Map würdest du für Latenzhistogramme wählen?

Meist eine feste, begrenzte Array-/per-CPU-Struktur mit vorgegebenen Buckets, weil sie Kardinalität kontrolliert. Einen Hash nutze ich nur, wenn ein begrenzter, sinnvoller Key notwendig ist. Ich dokumentiere `max_entries`, Speicherobergrenze, Aggregation und die Semantik von Evictions/Drops.

### 4. Bedeutet erfolgreiche Verifikation, dass das Programm produktionsreif ist?

Nein. Erfolgreiche Verifikation beweist nicht den Nutzen, die Datenzulässigkeit, Hookkompatibilität über Upgrades, Eventrate, Collector-Stabilität oder einen getesteten Rollback. Diese Punkte gehören zum Betriebs- und Securityreview.

### 5. Wie würdest du eBPF in einem Multi-Tenant-Cluster absichern?

Zentrale geprüfte Artefakte, getrennte Rollen, Nodepool-/Scope-Grenzen, minimale Datenfelder, feste Ressourcenbudgets, signierten Releaseprozess, Audit, TTL, Kill Switch und ein Fallback. Ein Pod mit weitreichendem Hostzugriff ist eine Plattformentscheidung, keine lokale Debugkonfiguration.

### 6. Wann ist eBPF nicht die passende Lösung?

Wenn Application Metrics/Traces die Frage schon beantworten, wenn die notwendige Kernel-/Privilege-Matrix nicht erfüllt ist, wenn die Datenfelder nicht verantwortbar minimierbar sind, oder wenn die Fehlerdiagnose ein einmaliger, lokaler Prozess mit klassischen Werkzeugen lösen kann. Auch Enforcement ohne passende Governance ist kein eBPF-Kandidat.

### 7. Wie unterscheidest du eBPF-Observability von Cilium?

eBPF ist die Kerneltechnologie und ein Programm-/Attachmodell. Cilium ist ein später zu behandelndes Plattformprodukt, das eBPF für Networking, Security und Observability nutzen kann. Einen beobachtenden Trace-Sensor zu schreiben oder zu bewerten ist nicht gleichbedeutend mit Cilium zu betreiben oder Netzwerkpolicy zu verantworten.

### 8. Was tust du bei Ring-Buffer-Drops?

Ich korreliere Droprate mit Eventrate, Collector-CPU, Backend und Produktp99. Dann reduziere ich Scope, sample oder aggregiere stärker, statt einen unbounded Puffer einzuführen. Ich dokumentiere Bias: fehlende Events sind kein Beweis, dass sie nicht stattgefunden haben.

## Praktisches Lab: read-only BPF-Inventar und Hypothesendesign

> **Status:** `reviewed_only`. Das Lab lädt **kein** Programm und erstellt, pinnt, verändert oder detached **keine** Maps/Programme. Es ist nur auf einem eigenen, autorisierten Linux-Sandbox-System auszuführen. Produktionsnodes, Shared Clusters und Customerumgebungen sind ausgeschlossen.

### Ziel

Erfasse, ob eine Umgebung grundsätzlich genug Information für einen späteren, separat autorisierten BPF-Pilot liefert. Beweise dabei eine Berechtigungsgrenze durch eine erwartete, folgenlose Read-only-Ablehnung oder die dokumentierte eingeschränkte Sicht. Das Ergebnis darf nicht „BPF funktioniert“ heißen.

### Voraussetzungen und Sicherheitsgrenzen

- Shellzugriff auf eine eigene Linux-Sandbox; keine Rootrechte für dieses Lab voraussetzen.
- `uname`, `mount`, `test`, `find` und `cat` sind übliche Read-only-Werkzeuge. `bpftool` ist optional und wird nicht installiert.
- Keine Befehle wie `bpftool prog load`, `map create`, `link create`, `tc`, `ip`, `bpftool net attach`, `bpftrace` oder Cilium-CLI-Aktionen ausführen.
- Keine Ausgabe mit Hostnamen, Benutzernamen oder sensitiven cgroup-Pfaden in Tickets/Chat übernehmen; vor Weitergabe redigieren.

### Ablauf

```bash
set -euo pipefail

printf 'kernel: '; uname -r
printf 'architecture: '; uname -m

# Nur Existenz und Mountart; keine Objekte anlegen.
test -r /sys/kernel/btf/vmlinux \
  && echo 'BTF vmlinux: readable' \
  || echo 'BTF vmlinux: not readable or unavailable'

findmnt -T /sys/fs/bpf -o TARGET,FSTYPE,OPTIONS 2>/dev/null \
  || echo 'bpffs: not mounted or not visible'

grep -E 'Cap(Prm|Eff|Bnd)' /proc/self/status \
  || echo 'capability view unavailable'

if command -v bpftool >/dev/null 2>&1; then
  echo 'bpftool present: attempting read-only inventory'
  bpftool prog show 2>&1 | sed -n '1,20p' || true
  bpftool map show 2>&1 | sed -n '1,20p' || true
else
  echo 'bpftool absent: no installation requested'
fi
```

Dokumentiere: Kernel/Architektur, BTF-/bpffs-Sicht, optionales Tool, erwartete oder beobachtete Berechtigungseinschränkung, Datenredaction und die offene Frage. Ein `Operation not permitted` bei `bpftool` ist eine hilfreiche Gegenprobe für Least Privilege, kein Fehler, der durch zusätzliche Rechte „repariert“ werden soll.

### Designfall und Gegenproben

1. Formuliere eine Beobachtungsfrage, zum Beispiel: „Erhöht sich die Dauer einer eng definierten Connect-Phase nach Release R?“
2. Erstelle einen Beobachtungsvertrag mit `mode: observe`, maximaler Eventrate, drei erlaubten Feldern, TTL, Owner, Kill Switch und Fallback ohne BPF.
3. **Negative Datenprobe:** Frage, ob die Hypothese ohne Hostname, URL, Payload, Prompt, Datei- oder User-ID beantwortbar ist. Falls nein, wird der Entwurf an Privacy/Security zurückgegeben, nicht erweitert.
4. **Negative Privilegprobe:** Wenn das Read-only-Inventar fehlende Rechte zeigt, notiere das Ergebnis und ende. Kein `sudo`, keine Capability-Änderung und keine DaemonSet-Ausnahme.
5. **Negative Nutzenprobe:** Prüfe, ob die vorhandenen Application Metrics/Traces die Frage bereits beantworten. Falls ja, lade keinen Sensor.
6. **Cleanup:** Die Kommandos erzeugen keine Objekte. Lösche nur deine redigierte lokale Notiz gemäß Sandbox-Richtlinie und bestätige, dass keine Attach-/Map-Aktion erfolgt ist.

## Dependencies und Cross-References

- [KB-0031: Linux Kernel und Systemaufrufe](01-linux-kernel-und-systemaufrufe.md) erklärt die Kernel-/Userspace-Grenze.
- [KB-0036: Sockets und Netzwerk-I/O](06-sockets-und-netzwerk-i-o.md) liefert Netzwerkpfad und Socketbegriffe.
- [KB-0037: Namespaces und Isolation](07-namespaces-und-isolation.md) erklärt Sicht- und Grenzprobleme in Containerumgebungen.
- [KB-0044: Block-I/O und Engpässe](14-block-i-o-und-engpaesse.md) liefert eine Messmethodik für CPU-, Memory- und I/O-Hypothesen.
- [KB-0046: Linux-Fehlersuche und Performance-Debugging](16-linux-fehlersuche-und-performance-debugging.md) wird die übergreifende Hypothesenmethode vertiefen.
- KB-0471 und KB-0562 sind spätere kanonische Anwendungs-/Plattformstellen; Cilium- und Enforcementbetrieb wird nicht hier dupliziert.
- [KB-0720: Portfolioevidenz und Reifemodelle](../../30-architect-practice/44-portfolioevidenz-und-reifemodelle.md) nimmt abgeschlossene Mess- und Entscheidungsartefakte auf.

## Quellen und Aktualitätsnotizen

| Quelle | Aussage / Verwendung | Stand |
|---|---|---|
| Dateikatalog | Verbindlicher Scope und Reihenfolge. | 2026-09-14 |
| [Linux BPF Documentation](https://docs.kernel.org/bpf/index.html) | Offizieller Einstieg, Programmtypen, Maps, Verifier, BTF und Tooling. | abgerufen 2026-09-16 |
| [eBPF Verifier](https://docs.kernel.org/bpf/verifier.html) | Kontrollfluss-, Register-, Pointer-, Stack- und Boundsprüfung. | abgerufen 2026-09-16 |
| [BPF Maps](https://docs.kernel.org/bpf/maps.html) | Mapkonzept, Datenaustausch und Typkontext. | abgerufen 2026-09-16 |
| [BTF](https://docs.kernel.org/bpf/btf.html) | Typformat und Kompatibilitätskontext. | abgerufen 2026-09-16 |
| [`bpf(2)`](https://man7.org/linux/man-pages/man2/bpf.2.html) | Syscall, Programme, Maps, Attach-Lebensdauer und Fehlergrenzen. | Linux man-pages, abgerufen 2026-09-16 |
| [`capabilities(7)`](https://man7.org/linux/man-pages/man7/capabilities.7.html) | Linux Capability-Kontext einschließlich `CAP_BPF`. | Linux man-pages, abgerufen 2026-09-16 |
| [libbpf Dokumentation](https://docs.kernel.org/bpf/libbpf/index.html) | Loader-/CO-RE-Ökosystem. | abgerufen 2026-09-16 |

Kernelversionen, BTF-/Helper-/Hook-Verfügbarkeit, Capability-Anforderungen, JIT-/Lockdown-Policy, Cilium-Funktionen und Distribution-Support sind zeit- und umgebungsabhängig. Vor einem Pilot werden sie am konkreten Kernel, Node Pool, Runtime, Sicherheitsmodell und Toolrelease geprüft.

## Bonus: New Tech and Innovations

**Stand 2026-09-16 — BTF und CO-RE machen eBPF-Programme über Kernelstrukturen hinweg besser wartbar, ersetzen aber keine Supportmatrix für Helper, Programtypen, Kernelconfig, Distribution, Architektur und Loader.** **Reifegrad: Adopting.** Ein Pilot akzeptiert CO-RE erst nach einer mehrkerneligen Canary-Matrix, Verifierlog-Review und geprüfter Rückfalltelemetrie. Grundlage ist die [BTF-Dokumentation des Linux-Kernels](https://docs.kernel.org/bpf/btf.html).

**Stand 2026-09-16 — Ring-buffer- und in-kernel-Aggregationsmuster ermöglichen detaillierte Beobachtung mit begrenztem Exportvolumen.** **Reifegrad: Established bis Adopting je Toolchain.** Sie senken Backendkosten und Datenexposition, erhöhen aber die Pflicht, Sampling-, Drop- und Biassemantik offen zu dokumentieren. Ein Pilot besteht nur, wenn Drop, CPUbudget, Datenminimierung und Detach gemessen sind.

**Stand 2026-09-16 — eBPF wird zunehmend als gemeinsame Plattformfähigkeit für Observability, Security und Networking genutzt.** **Reifegrad: Adopting.** Die Innovation liegt im gemeinsamen, kontrollierten Programm- und Governance-Modell, nicht im unbeschränkten Zugriff auf den Kernel. Einführungsbedingung sind zentrale Artefaktprüfung, Datenklassifikation, Kernel-Lifecycle, Kill Switch, Kostenowner und klare Grenze zwischen Beobachtung und Enforcement.

