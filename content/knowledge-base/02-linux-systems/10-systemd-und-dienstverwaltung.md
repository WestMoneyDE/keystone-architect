---
{"id": "KB-0040", "title": "Systemd und Dienstverwaltung", "domain": "02", "sequence": 10, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["PLATFORM", "CLOUD", "GENAI", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0032", "concepts": ["Prozesslebenszyklus", "Signals", "Restart", "Reaping"], "needed_for": "understanding"}, {"id": "KB-0037", "concepts": ["Namespaces", "Isolation", "Capabilities"], "needed_for": "understanding"}, {"id": "KB-0038", "concepts": ["cgroups", "Ressourcenbudget"], "needed_for": "understanding"}], "related": ["KB-0031", "KB-0035", "KB-0036", "KB-0039", "KB-0550", "KB-0565", "KB-0580"], "applies": ["KB-0550", "KB-0565", "KB-0580"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein lokales, nicht produktives Beispiel prüft Unit-Syntax und Lifecyclekonzept ohne Systemdienständerung.", "rationale": "Die Zielumgebung entscheidet über Distribution, Rechte und Unitpolicy."}, "ARCHITECT-TARGET": {"active": true, "scope": "Dienste haben Unit-/Dependency-/Restart-/Readiness-/Logging-/Resource-/Hardeningcontract.", "rationale": "Der Supervisor ist Teil des Produktionssystems."}, "STAFF-TARGET": {"active": true, "scope": "Teams nutzen Templates, Drop-ins, Tests, Runbooks und sichere Baselines.", "rationale": "Start-/Shutdown-/Restartfehler werden wiederholbar verhindert."}, "CHIEF-TARGET": {"active": true, "scope": "Host-/Container-/Platform-Betriebsmodell, Hardening- und Logretentionpolicy werden zentral definiert.", "rationale": "Chief-Ebene verbindet Verfügbarkeit, Security, Cost und Support."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "PID1 internals, systemd generators, dbus, bootloader, SELinux/AppArmor, kernel hardening und advanced sandboxing sind Spezialistenvertiefung.", "rationale": "Zielrollen kennen die Grenzen und eskalieren sicher."}}, "lab_validation": [{"lab_id": "KB-0040-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Geplantes lokales, nicht produktives Syntax-/Lifecyclelab", "evidence": "Unitmuster, negative Proben und Cleanup beschrieben.", "limitations": "Kein Systemservice, Bootziel, Journal-, Ressourcen-, Sicherheits- oder Produktionszustand verändert."}]}
---
# Systemd und Dienstverwaltung

> **Ziel:** Betreibe einen hostbasierten Dienst als deklarativen Vertrag: Was startet wann, welche Bedingung gilt als bereit, welche Ressourcen und Rechte besitzt er, wie beendet er sich, wann darf er neu starten und wie wird sein Zustand sicher beobachtet?

## Purpose, Definition und Scope

systemd ist auf vielen Linuxdistributionen Service Manager und PID 1. Es verwaltet Units, startet Prozesse, ordnet Abhängigkeiten, nutzt cgroups für Ressourcensteuerung und integriert Logging/Sandboxing. Scope: Units, Targets, Dependencies, Restart Policies, Bootreihenfolge, Journald und Diensthärtung. Nicht Scope: eine produktive Änderung von Hostunits oder eine vollständige Distribution-/Securityhardeninganleitung.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Unitgraph, service lifecycle, restart, logging, resource and sandboxing boundary. |
| HANDS-ON-TARGET | Nur Sandbox-/Syntax- und kontrollierte Lifecycleübung. |
| ARCHITECT-TARGET | Dienstvertrag enthält Start, Readiness, Stop, Recovery, Security und Telemetrie. |
| STAFF/CHIEF | Standards und Betriebsmodell verhindern fragile Agenten auf Hosts. |

## Mental Model: Unitgraph statt Startskript

```text
target
  -> ordered units + requirement relationships
  -> service process in cgroup
  -> readiness / work / journal
  -> stop signal + timeout + exit classification
  -> restart policy or failed state
```

`After=` ordnet Startreihenfolge; es allein erzeugt keine Erfolgsabhängigkeit. `Requires=`/`Wants=` modellieren unterschiedliche Beziehungstiefe. Eine Datenbank „gestartet“ bedeutet nicht zwangsläufig, dass Schema, TLS, Netzwerk oder fachliche Bereitschaft erfüllt sind. Readiness gehört in den Servicecontract, nicht nur in Bootreihenfolge.

## Prerequisites und Dependencies

| Abhängigkeit | Nutzung |
|---|---|
| [KB-0032 Prozesse](02-prozesse-und-lebenszyklen.md) | Signals, Exit, reaping, restart. |
| [KB-0037 Namespaces](07-namespaces-und-isolation.md) | Unit sandboxing/visibility. |
| [KB-0038 cgroups](08-cgroups-und-ressourcenbegrenzung.md) | Ressourcen in Units. |
| KB-0035 Dateisysteme | State, logs, credentials and mounts. |
| KB-0039 Paketpfade | Netzwerkbereitschaft und Dependencies. |

## Core Concepts

### Unit Types und Targets

Services, Sockets, Timers, Mounts, Paths, Slices und Targets beschreiben verschiedene Betriebsobjekte. Ein Target bündelt Units zu einem gewünschten Zustand. Ein Service soll eine klare Verantwortung haben; zufällige Shellketten und mehrere unkontrollierte Daemons erschweren Signals, Exitcodes, Logging und Recovery.

### Abhängigkeiten, Ordering und Readiness

- `Wants=`: Beziehung, aber Ausfall des gewünschten Units blockiert nicht zwingend.
- `Requires=`: stärkere Anforderung; genaue Fehler-/Stopfolgen auf Zielversion prüfen.
- `After=`/`Before=`: Reihenfolge, keine Gesundheitszusage.
- `Condition`/`Assert`: lokale Voraussetzungen.
- Application readiness: fachlich valide Verbindung, Config/Secret, Migration-/Cache-/Dependencyzustand.

Die Architektur dokumentiert, was geschieht, wenn eine Voraussetzung später ausfällt: degradiert der Service, retried er begrenzt, wird er neu gestartet oder alarmiert er?

### Restart und Failure Budget

`Restart=` ist keine Hochverfügbarkeitsstrategie. Unbegrenzter Restart kann eine fehlerhafte Konfiguration, fehlendes Secret, kaputtes Volume oder Downstreamausfall in CPU-/Log-/Coststorm verwandeln. Dazu gehören Startlimits/Backoff, Crashloopdetektion, Exitcodeklassifikation, Alerting und menschliche Ownership. Nach einem OOM oder externen Seiteneffekt wird der Servicezustand reconciliert, nicht blind wiederholt.

### Journald

journald sammelt strukturierte Unitlogs. `journalctl` kann nach `_SYSTEMD_UNIT` filtern. Die Konfiguration trennt volatile und persistente Speicherung; `journald.conf` beschreibt `Storage=`, Size-/File-/Retentiongrenzen und empfiehlt Drop-ins gegenüber Änderung der Hauptdatei. Logs müssen daher Bytebudget, Redaction, Access, Retention und Exportpfad besitzen. Persistente Logs sind keine Sicherung von Secrets oder Geschäftsdatensätzen.

### Härtung und Credentials

systemd kann bei Serviceausführung Sandbox-/Namespace-/cgroupoptionen anwenden. Die Systemdarchitektur beschreibt, dass der Executor Konfiguration wie Sandboxing, Namespaces und cgroups vor dem endgültigen `exec` anwendet. Credentials können in einem servicebezogenen Verzeichnis bereitgestellt werden; systemd-Dokumentation empfiehlt private Mountsicht für Credentials. Härtung wird inkrementell mit Tests eingeführt: non-root, minimal capabilities, read-only Pfade, explizite writable state/cache/runtime directories, Netz-/Device-/Addressfamilybegrenzung und Seccomp-/LSM nach Plattformpolicy.

## Architecture und Data Flow: Reproduzierbarer Dienst

```text
package/image + config/credential
 -> unit/drop-in validation
 -> dependency/readiness gate
 -> process starts in unit cgroup/sandbox
 -> structured logs + metrics + health
 -> SIGTERM: stop admission, drain, persist/reconcile, exit
 -> classified restart or human escalation
```

Für einen AI Gatewaydienst sind Modellartefakte/Volumes, Devicezugriff, Token-/Requestbudget, egress policy und sensitivitätsgerechte Logs zusätzlich zu prüfen. Systemdunit und Containerorchestrator sind unterschiedliche Supervisorebenen; vermeide konkurrierende Restartowner.

## Protokolle, Standards und Tools

| Artefakt | Anwendung |
|---|---|
| `systemd.unit` / `systemd.service` | Unit- und Servicecontract, versionsabhängig prüfen |
| systemd resource control | Unitzuordnung zu cgroups/Ressourcen |
| `journald.conf` | Storage, rotation, retention und drop-ins |
| `journalctl` | strukturierte Filterung/Incidentanalyse |
| systemd credentials | scoped credential delivery |
| `systemd-analyze`/Distribution tooling | Syntax-/Dependencyvalidierung in autorisierten Umgebungen |

## Konfiguration und Implementierung

Beispiel als Architekturtemplate, nicht als ungetestete Produktionsunit:

```ini
[Unit]
Description=Example API
After=network-online.target
Wants=network-online.target

[Service]
Type=exec
User=example
ExecStart=/opt/example/api
Restart=on-failure
RestartSec=bounded-backoff
TimeoutStopSec=explicit-grace
# Resource and sandbox settings are added incrementally after validation.

[Install]
WantedBy=multi-user.target
```

Ergänze wirkliche Werte erst nach Distribution-/Runtime-/Supportprüfung. `ExecStart` muss keine Shellsemantik verstecken; Argumente, Arbeitsverzeichnis, Umgebungs-/Credentialquelle, Statepfade und Exitcodes sind explizit. Vendor Units werden über versionierte Drop-ins überschrieben, nicht blind editiert.

## Scalability und Performance

Units laufen in cgroups; CPU-/Memory-/Taskslimits, Loggingrate, Restartfrequenz, File Descriptors, Connectionpools und Devicezugriff beeinflussen Latenz. Viele Dienste mit aggressivem Restart oder unbounded Logs verursachen Node- und Costprobleme. Messe startup duration, readiness time, active/failed/restarts, cgroup events, FD/connection counts, log volume/drop, queue age and business outcomes.

## Reliability und Failure Modes

| Fehlerbild | Ursache | Reaktion |
|---|---|---|
| start loop | config/secret/dependency failure | backoff, start limit, classify, alert |
| readiness race | `After` mit echter Bereitstellung verwechselt | application readiness gate |
| dirty shutdown | SIGTERM nicht verarbeitet | drain, deadline, durable reconcile |
| missing logs | volatile/storage cap/access | journald policy and export check |
| log disk pressure | unbounded verbosity/retention | budgets, redaction, rotation |
| privilege breakage | hardening zu früh/zu weit | incremental test, explicit path/device |
| double supervisor | container + host restart conflict | one clear lifecycle owner |
| resource kill | cgroup budget/oom | correlate events, repair cause |

## Security, Governance und Compliance

Unitfiles und Drop-ins sind privilegierte Infrastrukturkonfiguration. Sie werden code-reviewed, versioniert, getestet und auditiert. Secrets gehen nicht als Umgebungsvariable oder Commandline in Logs; credential-/secretmanagerpolicy entscheidet. Journaldaccess ist beschränkt und Logdaten werden redigiert/retained nach Compliance. Härtungsausnahmen benötigen Threat, kleinste Ausnahme, Owner, Ablauf und Retest.

## Observability und Troubleshooting

Erfasse Unitname, revision, active/failed state, exit status, restart counter, start/readiness/stop duration, cgroup events, dependency outcome, relevant journal fields and redacted correlation IDs. Bei Störung: Scope/Revision → Unit/Exit/Restart → Journald → Dependency/Readiness → cgroup/resources → sandbox/credential/path → controlled Canary/Rollback.

## Cost und FinOps

Restartloops, Logvolumen, dauerhaft laufende Nebenprozesse, übergroße Resourcebudgets und persistente Journale sind Kostenquellen. Setze Budgets für Logs/Retention, Ressourcen und Serviceklassen. Spare nicht bei Restore-/Auditnachweis für kritische Systeme; der Preis eines unanalysierbaren Ausfalls ist häufig höher.

## Trade-offs und Anti-Patterns

- `After=network-online` als Appreadiness ansehen.
- `Restart=always` ohne Limit/Backoff/Alert.
- Unit direkt im Vendorpfad editieren.
- Secrets in `Environment=`/Commandline oder Journal.
- globale writable Pfade statt minimale State/Cache/Runtime Verzeichnisse.
- Unit sandboxing ohne Test deaktivieren.
- systemd und Orchestrator als konkurrierende Lifecycleowner.
- persistent journal ohne Size/Retention/Accessmodell.

## Staff-, Principal- und Chief-Level Decisions

Staff erstellt Unit-/Drop-in-/Runbooktemplates mit Syntax-, Restart-, Shutdown- und Härtungstests. Principal trennt Hostservices, containerisierte Dienste und Plattformoperatorverantwortung und bestimmt Dependency-/Recoverypattern. Chief setzt Baselinehardening, credential/log policy, host lifecycle, update/rollback and exception governance.

## Production Checklist

- [ ] Unittype, owner, config/credential, state/volume und exitcodes definiert.
- [ ] Dependencies, ordering und echte readiness getrennt dokumentiert.
- [ ] Stop signal, drain, timeout, reconciliation und restartlimit getestet.
- [ ] cgroupbudget/events, FD/connection/log budgets messbar.
- [ ] Drop-ins versioniert, Syntax geprüft und rollbackbar.
- [ ] non-root/minimal privilege/read-only paths schrittweise validiert.
- [ ] journald storage/retention/redaction/access/export policy vorhanden.
- [ ] Ausnahme hat Owner, Review und Ablaufdatum.

## Interviewfragen mit Modellantworten

### Was ist der Unterschied zwischen `After=` und `Requires=`?
`After=` ordnet; es beweist nicht, dass ein anderer Dienst gesund ist. `Requires=` modelliert eine stärkere Beziehung. Beide ersetzen keine anwendungsspezifische Readiness.

### Warum ist `Restart=always` riskant?
Es kann deterministische Fehler in Crashloops verwandeln. Ich kombiniere Restart mit Fehlerklassifikation, Backoff, Startlimit, Alert und Recoveryentscheidung.

### Wie härtest du eine Unit?
Zuerst ihre notwendigen Pfade, Nutzer, Devices, Netzwerk- und Capabilitybedürfnisse erfassen. Dann minimale Rechte und Sandboxschichten in Canarytests einführen; kein blindes Flagset.

### Wann sollen Logs persistent sein?
Wenn Incident-/Audit-/Recoveryanforderungen es verlangen und Storage, Retention, Redaction, Access und Export geregelt sind. Volatile Logs können für kurzlebige Systeme absichtlich passend sein.

### Was tust du nach Service-OOM?
Exit/Event mit Unit-/cgroup-/Revision-/Workloadkontext korrelieren, Crashloop stoppen, Ursache bei memory/concurrency/cache/budget prüfen und fachlichen Zustand reconciliieren.

## Praktisches Lab: Unitcontract ohne Hoständerung

> `reviewed_only`; kein echter Systemdienst verändert.

1. Schreibe eine Beispielunit für ein lokales Testprogramm und markiere alle Platzhalter.
2. Prüfe Abhängigkeit, Restart, Stopdeadline, User, Statepfad und Log-/Resourcecontract gegen eine Checkliste.
3. Negative Probe: simuliere fehlendes Secret oder nicht erreichbare Dependency; erwartetes Resultat ist begrenzter Fehler und sichtbarer Alarm, nicht unbounded Restart.
4. Simuliere SIGTERM im Testprogramm und verifiziere Drain/Exitklassifikation.
5. Entferne alle Testdateien; keine Unit wird auf dem Host aktiviert.

## Dependencies und Cross-References

- [KB-0032 Prozesse](02-prozesse-und-lebenszyklen.md)
- [KB-0037 Namespaces](07-namespaces-und-isolation.md)
- [KB-0038 cgroups](08-cgroups-und-ressourcenbegrenzung.md)
- KB-0035 Dateisysteme und Persistenzpfade
- KB-0550 Platform Engineering
- KB-0565 Cloud Architecture
- KB-0580 AI Infrastructure

## Quellen und Aktualitätsnotizen

| Quelle | Nutzung | Stand |
|---|---|---|
| Dateikatalog | Scope. | 2026-09-14 |
| [systemd architecture](https://systemd.io/ARCHITECTURE/) | Manager, executor, sandbox/cgroup/namespaces. | Abgerufen 2026-09-15 |
| [systemd resource control](https://cgit.freedesktop.org/systemd/systemd/tree/man/systemd.resource-control.xml) | Units und cgroupbasierte Ressourcensteuerung. | Abgerufen 2026-09-15 |
| [journald.conf](https://www.freedesktop.org/software/systemd/man/252/journald.conf.html) | Storage, drop-ins, Rotation und Retention. | Abgerufen 2026-09-15 |
| [journalctl](https://www.freedesktop.org/software/systemd/man/255/journalctl.html) | Unitfilter und strukturierte Journalabfrage. | Abgerufen 2026-09-15 |
| [systemd credentials](https://systemd.io/CREDENTIALS/) | scoped credentials und mount namespace Empfehlung. | Abgerufen 2026-09-15 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — Systemd bündelt zunehmend Service Lifecycle, cgroups, Namespaces und Credential Delivery als hostbasierten Platformpfad.** **Reifegrad: Established.** Ein Pilot standardisiert nur eine nicht kritische Serviceklasse und misst Start/Stop/Recovery.

**Stand 2026-09-15 — Immutable Hosts und System Extensions reduzieren Drift, erhöhen aber die Bedeutung deklarativer Units, Drop-ins und Rollback.** **Reifegrad: Adopting.** Ein Pilot prüft Update-/Rollback-/Log-/Credentialpfad als Einheit.

**Stand 2026-09-15 — AI-Runtimes benötigen hostseitig besonders klare Device-/Volume-/Egress-/Resource-Ausnahmen.** **Reifegrad: Adopting.** Ein Pilot dokumentiert die minimale Ausnahme und testet sie gegen einen gehärteten Standarddienst.

