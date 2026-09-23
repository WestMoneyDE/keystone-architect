---
{"id": "KB-0037", "title": "Namespaces und Isolation", "domain": "02", "sequence": 7, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["PLATFORM", "CLOUD", "GENAI", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0032", "concepts": ["PID-Hierarchie", "Signals", "Prozesslebenszyklus"], "needed_for": "understanding"}, {"id": "KB-0035", "concepts": ["Mounts", "OverlayFS", "Persistenzpfade"], "needed_for": "understanding"}, {"id": "KB-0036", "concepts": ["Sockets", "Ports", "Netzwerk-I/O"], "needed_for": "understanding"}], "related": ["KB-0031", "KB-0034", "KB-0038", "KB-0039", "KB-0040", "KB-0550", "KB-0565", "KB-0580"], "applies": ["KB-0550", "KB-0565", "KB-0580"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein isoliertes, nicht privilegiertes Lab vergleicht eigene Prozess-/Mount-/Netzwerkansichten soweit die lokale Runtime dies erlaubt.", "rationale": "Die Übung verändert keine Hostisolation oder Produktionsworkloads."}, "ARCHITECT-TARGET": {"active": true, "scope": "Workloads erhalten getrennte Sichtbarkeit, minimale Privilegien, cgroupbudgets, Volume-/Networkpolicy und Runtime-Härtung.", "rationale": "Containergrenzen sind mehrschichtig und müssen als Vertrag entworfen werden."}, "STAFF-TARGET": {"active": true, "scope": "Teams nutzen sichere Defaults für user, mount, PID und network isolation sowie Nachweise für notwendige Ausnahmen.", "rationale": "Die Angriffsfläche sinkt durch wiederholbare Plattformpfade."}, "CHIEF-TARGET": {"active": true, "scope": "Plattformpolitik definiert Isolationstiefe, Mandantengrenzen, Supply Chain, Runtimehärtung, Logging und Ausnahmegovernance.", "rationale": "Chief-Ebene entscheidet Risikomodell und Investition, nicht einzelne Namespaceflags."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "User-namespace mapping, rootless internals, seccomp/LSM, kernel escapes, CNI, eBPF, runtime internals und sandboxed runtimes sind Spezialistenfelder.", "rationale": "Zielrollen erkennen Grenzen und beziehen Security-/Platformexperten ein."}}, "lab_validation": [{"lab_id": "KB-0037-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Geplantes lokales Sandboxlab", "evidence": "Sichere Beobachtungs- und Gegenproben beschrieben.", "limitations": "Keine privilegierte Namespace-, mount-, network-, cgroup-, cloud- oder Produktionskonfiguration ausgeführt."}]}
---
# Namespaces und Isolation

> **Ziel:** Erkläre präzise, welche Sicht Linux Namespaces verändern, welche Ressourcen cgroups begrenzen und welche Sicherheitskontrollen ein Container zusätzlich braucht. „Im Container“ ist keine einzelne Sicherheitseigenschaft.

## Purpose, Definition und Scope

Linux Namespaces kapseln globale Ressourcen so, dass Prozesse innerhalb eines Namespace eine eigene Instanz sehen. Die man-page nennt unter anderem PID-, Netzwerk-, Mount-, User-, IPC-, UTS-, cgroup- und Time-Namespaces. Container kombinieren solche Sichtbarkeitsgrenzen mit cgroups, Capabilities, LSM/Seccomp, Dateisystem-/Imagepolicy, Runtime und Orchestrierung.

Scope sind PID, Network, Mount und User Namespace, Ressourcensichtbarkeit und konkrete Containergrenzen. Nicht Scope ist die Implementierung einer Container Runtime oder vollständige Kernel-Hardeninganleitung.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Sichtbarkeit, Identitätsmapping, Mount-/Port-/PIDgrenze und deren Lücken können erklärt werden. |
| HANDS-ON-TARGET | Eine Sandbox beobachtet Ansichten, nicht den Host. |
| ARCHITECT-TARGET | Isolation wird als Schichtenmodell mit Least Privilege, Policies und Nachweis entworfen. |
| STAFF/CHIEF | Defaults und Ausnahmeprozesse verhindern „privileged by convenience“. |

## Mental Model: Sichtbarkeit, Berechtigung und Begrenzung sind getrennt

```text
namespace: what a process can see/name
cgroup: what resource budget it can consume
capabilities/LSM/seccomp: what operations are permitted
runtime/image/volume/network policy: what attack paths exist
orchestrator/identity/observability: who owns and proves the boundary
```

Ein PID Namespace kann Hostprozesse verbergen, schützt aber keine CPU. Ein User Namespace kann UID 0 innen auf unprivilegierte Host-ID abbilden, schützt aber keine verletzliche Kerneloberfläche. Ein Network Namespace trennt Ports und Interfaces, ersetzt aber keine Egress Policy. Diese Unterscheidung ist der Kern jeder Containersecurityentscheidung.

## Prerequisites und Dependencies

| Abhängigkeit | Verwendung |
|---|---|
| [KB-0032 Prozesse](02-prozesse-und-lebenszyklen.md) | PID 1, Reaping, Signals. |
| [KB-0035 Dateisysteme](05-dateisysteme-und-persistenzpfade.md) | Mounts, Overlay, Volumes. |
| [KB-0036 Sockets](06-sockets-und-netzwerk-i-o.md) | Ports, Socket-/Networkstack. |
| KB-0034 Speicher | cgroupmemory und OOM. |
| KB-0038 Performance | host-/containerbezogene Messgrenzen. |

## Core Concepts

### PID Namespace

PID Namespaces isolieren Prozessnummern; verschiedene Namespaces können dieselbe PID enthalten. In einem neuen Namespace beginnt die Sicht üblicherweise bei PID 1. `/proc` zeigt nur Prozesse entsprechend dem PID Namespace, in dem procfs gemountet wurde. Daher benötigt ein Container eine konsistente PID-/proc-Sicht, damit Diagnosewerkzeuge keine falsche Welt zeigen.

PID 1 im Namespace hat Lifecycleverantwortung: Signale, Childreaping, Prozessende und Shutdown müssen bewusst gestaltet sein. Ein Namespace macht keinen schlecht weiterleitenden Shellwrapper zuverlässig.

### Mount Namespace

Mount Namespaces isolieren die Liste sichtbarer Mounts und damit die Verzeichnishierarchie. Ein neuer Namespace beginnt als Kopie und Mountpropagation entscheidet, ob spätere Mountänderungen sichtbar werden. Eine Containerroot ist daher eine Sicht, keine Garantie, dass sensible Hostpfade nicht über falsche Bind Mounts, Privilegien oder Runtimeoptionen zugänglich sind. Volumes werden nach Datenklassifikation, Read-only, ownership, propagation und Lifecycle geprüft.

### Network Namespace

Ein Network Namespace besitzt eigene Interfaces, Routen, Firewall-/Netzwerkstackaspekte und Ports. Das ermöglicht gleiche Portnummern in mehreren Workloads und getrennte Topologien. Nicht enthalten sind automatisch DNS-Policy, Egress-Zulassung, Identity, TLS, Network Policy, NAT-/Loadbalancersemantik oder Serviceauthorisierung. Prüfe daher sowohl lokale Namespaceansicht als auch den tatsächlichen Paketpfad.

### User Namespace

User Namespaces isolieren UID/GID, Capabilities und weitere sicherheitsbezogene Attribute. Ein Prozess kann UID 0 im User Namespace sein und außerhalb unprivilegiert bleiben. Das ist nützlich für rootless Modelle, verlangt aber korrekte ID-Mappings, Dateiownership und Runtime-/Kernelpolicy. „Root im Container“ darf niemals pauschal als „harmlos“ oder „Hostroot“ klassifiziert werden; die konkrete Mapping-/Capability-/Mountsituation entscheidet.

### APIs und Observability

Namespaces entstehen über `clone`, `unshare` und teilweise späteres `setns`. Handles erscheinen unter `/proc/<pid>/ns`; offene Handles können Namespacelebensdauer beeinflussen. Diese Fakten helfen bei Diagnose, sind aber keine Einladung, in fremde Namespaces zu wechseln. Produktionszugriffe benötigen berechtigte, auditierbare Break-glass-Prozesse.

## Architecture und Data Flow: Gehärteter Runtimepfad

```text
signed image -> admission policy -> runtime
  -> user identity + capability drop
  -> PID/mount/net namespace
  -> read-only root + explicit writable volumes
  -> cgroup CPU/memory/pids budget
  -> ingress/egress policy + workload identity
  -> telemetry + audit + controlled shutdown
```

Eine AI-Inference-Workload ergänzt Device-/GPU-Zugriff, Modellartefakte, token-/requestbudget und Tool-Egress. GPUgerätzugriff ist eine explizite Ausnahme mit eigener Isolations-/Ownershipbewertung, nicht ein Argument für `privileged`.

## Protokolle, Standards und Tools

| Element | Bedeutung |
|---|---|
| `namespaces(7)` | Typen, APIs und `/proc`-Handles |
| `pid_namespaces(7)` | PID-/proc-Sicht und PID 1 |
| `mount_namespaces(7)` | Mountliste und Propagation |
| `user_namespaces(7)` | UID/GID-/Capabilitymapping |
| `network_namespaces(7)` | Netzwerkstack- und Interfacegrenze |
| cgroup v2 | Ressourcenbudget; kein Namespaceersatz |
| OCI/runtime/orchestrator policy | konkrete Containerimplementierung; versionsabhängig |

## Konfiguration und Implementierung

Ein Plattformcontract enthält mindestens:

```yaml
identity: non_root_or_mapped_root_with_reason
privilege: drop_all_then_add_minimal
filesystem: read_only_root + explicit_scoped_volumes
process: one_lifecycle_owner + pids_budget
network: default_deny_egress_or_explicit_policy
resources: cgroup_cpu_memory_pids_limits
security: seccomp_lsm_runtime_profile
observability: namespace/cgroup/runtime metadata without secrets
exceptions: owner_expiry_review_and_rollback
```

Keine Anwendung benötigt standardmäßig Host Network, Host PID, Host Mount, privilegierten Modus, unbounded capabilities oder writable HostPath. Jede Ausnahme benennt Threat, benötigte Operation, kleinstes Privileg, Test, Owner, Ablaufdatum und Rückbau.

## Scalability und Performance

Namespaces selbst sind kein Autoscalingmechanismus. cgroups, Nodekapazität, Imagepull, Volume-/Networksetup, Sidecars, connection-/FDlimits und Devicezugriff bestimmen Dichte und Latenz. Viele kleine Workloads erhöhen Control-Plane-, Image-, IP-/Port-, Log- und Beobachtungskosten. Messung verbindet Container-/cgroupwerte mit Host-/Nodekontext, um eine falsch interpretierte Isolation zu vermeiden.

## Reliability und Failure Modes

| Problem | Ursache | Antwort |
|---|---|---|
| Container sieht falsches `/proc` | PID namespace/proc mount inkonsistent | Runtime-/mountkonfiguration prüfen |
| Zombie/Shutdownhänger | PID 1 reapt/forwardet nicht | init/entrypoint contract, Signaltest |
| Daten verschwinden | writable layer statt Volume | persistency contract und restart test |
| Portkonflikt/Netzfehler | Namespace/hostNetwork/CNI policy | lokale Sicht und Paketpfad prüfen |
| OOM/CPU throttling | cgroupbudget, nicht Namespace | cgroup events und workloadbudget |
| Privilege escalation risk | capabilities, mounts, user mapping | least privilege, security review |
| Debugging cross-boundary | fehlender auditierter Zugriff | sichere observability/Break-glass |

## Security, Governance und Compliance

Isolationsstärke wird nach Workloadrisiko bestimmt: Trustgrenze, Codeherkunft, Secrets, Netz-/Datenzugriff, Mandantentrennung, Devicezugriff und Kernelattackfläche. Images werden signiert/gescannt nach Plattformpolicy, Secrets über Workloadidentity bereitgestellt, Volumes least privilege gemountet und Network Egress kontrolliert. Namespaces sind eine Verteidigungsschicht, kein Ersatz für Code-, Identity-, Supply-Chain- oder Datenzugriffskontrolle.

## Observability und Troubleshooting

Erfasse Runtime-/Image-/Revision, Namespace-/cgroupzuordnung, PID 1, Mountliste, Volumeidentity, Netzwerkpolicyausgang, Capability-/Securityprofil, cgroup events, Restartgrund und Auditkontext. Keine Secrets, vollständigen Promptinhalte oder unbefugte Namespacehandles loggen.

Runbook: Scope und Autorisierung → Prozess/PID-/proc-Sicht → Mount/Volume → net namespace/policy → cgroupbudget/events → identity/capabilities → reproduzierbarer Canary → Ausnahme zurückbauen.

## Cost und FinOps

Isolation kostet Image-/Runtime-/Sidecar-/Network-/Volume-/Observabilitykapazität. Zu schwache Grenzen verursachen teure Blast-Radius-Ereignisse; übertriebene Ausnahmen oder jede Workload in eigener schwerer Sandbox können Dichte und Latenz verschlechtern. Costmodell bewertet Risiko, Datenklasse, Dichte und Supportaufwand zusammen.

## Trade-offs und Anti-Patterns

- Namespace gleich Sicherheitsboundary setzen.
- root im Container pauschal bewerten.
- HostPath/HostNetwork/privileged als Debugshortcut behalten.
- cgrouplimits ohne Admission/Queuebudget.
- Containerlayer für durable Daten.
- fehlende `/proc`-/PID-Tests.
- Debugzugang ohne Audit/Expiry.
- GPU-/Devicezugriff ohne Ausnahme-/Tenantmodell.

## Staff-, Principal- und Chief-Level Decisions

Staff baut gesicherte Workloadtemplates und Policytests. Principal definiert Trust-/Data-/Network-/Devicezonen und Plattforminterfaces statt Sondercontainer. Chief entscheidet über Baselineisolation, rootless/sandboxed Runtimes, Ausnahmegovernance, Supply Chain, Observability und Investitionen in sichere Developer Experience.

## Production Checklist

- [ ] User, PID, Mount und Network Namespace/Runtimeprofil bewusst gewählt.
- [ ] Non-root oder korrekt begründetes Usermapping; capabilities minimiert.
- [ ] Root filesystem read-only soweit möglich; Volumes scoped und klassifiziert.
- [ ] cgroup CPU/memory/pids und Admission/Queuegrenzen vorhanden.
- [ ] Egress/Ingress, TLS, Workloadidentity und Secretscontract definiert.
- [ ] PID 1, signal, reaping und shutdown getestet.
- [ ] Ausnahmen haben Owner, Audit, Ablauf und Rückbau.

## Interviewfragen mit Modellantworten

### Was isoliert ein PID Namespace?
Prozess-ID-Sicht; PIDs können in verschiedenen Namespaces gleich sein. Er begrenzt weder CPU noch Memory und ersetzt kein Signal-/Reapingdesign.

### Warum ist User Namespace wichtig?
Er trennt UID/GID-/Capability-Sicht; UID 0 innen kann außen unprivilegiert sein. Mapping und Mount-/Capabilitykontext müssen geprüft werden.

### Warum ist `hostNetwork` riskant?
Es entfernt eine Netzsichtgrenze und kann Port-/Traffic-/Policyannahmen verändern. Es ist eine explizite Ausnahme, nicht ein Performance-Default.

### Welche Schicht begrenzt Memory?
cgroup, nicht Namespace. Die Anwendung braucht trotzdem Budget, Queue und Pressurepolicy.

### Wie prüfst du Containerisolation?
Ich prüfe erwartete Sichtbarkeit, identity/capabilities, mounts/volumes, network policy, cgroup events und Shutdown in einer autorisierten Zielumgebung; ein einzelner `ps`-Auszug reicht nicht.

## Praktisches Lab: Sichtbarkeitsvergleich

> **Status:** `reviewed_only`; kein privilegierter oder produktiver Eingriff.

1. In einer lokalen Sandbox vergleiche PID-, Mount- und Netzansichten eines eigenen Workloads mit dokumentierten Runtimeinformationen.
2. Notiere PID 1, `/proc`-Sicht, beschreibbare Pfade und Netzwerkinterfaces ohne geheimen Inhalt.
3. Negative Probe: simuliere fehlenden writable Volumevertrag; verifiziere, dass die Anwendung nicht den Image-Layer als durable Datenbank annimmt.
4. Stoppe den Workload, prüfe Cleanup und lösche lokale Testartefakte.
5. Dokumentiere Grenzen: lokale Runtime ist kein Nachweis der Produktionspolicy.

## Dependencies und Cross-References

- [KB-0032 Prozesse](02-prozesse-und-lebenszyklen.md)
- [KB-0035 Dateisysteme](05-dateisysteme-und-persistenzpfade.md)
- [KB-0036 Sockets](06-sockets-und-netzwerk-i-o.md)
- KB-0034 Virtueller Speicher und Paging
- KB-0550 Platform Engineering
- KB-0565 Cloud Architecture
- KB-0580 AI Infrastructure

## Quellen und Aktualitätsnotizen

| Quelle | Verwendung | Stand |
|---|---|---|
| Dateikatalog | Scope. | 2026-09-14 |
| [namespaces(7)](https://man7.org/linux/man-pages/man7/namespaces.7.html) | Typen, APIs, Sichtbarkeitsmodell. | Linux man-pages 6.19 |
| [pid_namespaces(7)](https://man7.org/linux/man-pages/man7/pid_namespaces.7.html) | PID-/proc-Sicht. | Linux man-pages 6.19 |
| [mount_namespaces(7)](https://man7.org/linux/man-pages/man7/mount_namespaces.7.html) | Mountliste und Propagation. | Linux man-pages 6.19 |
| [user_namespaces(7)](https://man7.org/linux/man-pages/man7/user_namespaces.7.html) | ID-/Capabilitymapping. | Linux man-pages 6.19 |
| [network_namespaces(7)](https://man7.org/linux/man-pages/man7/network_namespaces.7.html) | Netzwerknamespace. | Linux man-pages 6.19 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — Rootless- und user-namespace-basierte Container reduzieren bestimmte Hostprivilegien, erhöhen aber Mapping-, Volume- und Supportkomplexität.** **Reifegrad: Established bis Adopting je Plattform.** Ein Pilot nutzt nicht sensible Workloads, überprüft Ownership, Netzwerk, Volumes und Debugpfad.

**Stand 2026-09-15 — Sandboxed Runtimes ergänzen Namespaces durch stärkere Kernel-/Virtualisierungsgrenzen.** **Reifegrad: Adopting.** Die Auswahl erfolgt nach Threatmodell und Betriebsbeleg, nicht als pauschale Reaktion auf „Container sind unsicher“.

**Stand 2026-09-15 — AI-Workloads verbinden Devicezugriff, Modellartefakte und Tool-Egress mit Isolation.** **Reifegrad: Adopting.** Ein Pilot definiert minimalen Device-/Network-/Volumezugriff und misst Nebenwirkung auf Latenz und operativen Support.

