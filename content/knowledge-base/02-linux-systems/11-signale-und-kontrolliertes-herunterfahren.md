---
{"id": "KB-0041", "title": "Signale und kontrolliertes Herunterfahren", "domain": "02", "sequence": 11, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["PLATFORM", "CLOUD", "GENAI", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0032", "concepts": ["Prozesslebenszyklus", "Fork/Exec", "Reaping"], "needed_for": "understanding"}, {"id": "KB-0033", "concepts": ["Cancellation", "Task Ownership", "Queues"], "needed_for": "understanding"}, {"id": "KB-0040", "concepts": ["Systemd Units", "Restart", "TimeoutStopSec"], "needed_for": "understanding"}], "related": ["KB-0036", "KB-0037", "KB-0042", "KB-0410", "KB-0550", "KB-0565", "KB-0580"], "applies": ["KB-0410", "KB-0550", "KB-0565", "KB-0580"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein lokales Testprogramm empfängt SIGTERM, stoppt Admission, drainiert begrenzte Arbeit und wird gejoint.", "rationale": "Keine Produktions-, Orchestrator- oder Hostoperation wird daraus abgeleitet."}, "ARCHITECT-TARGET": {"active": true, "scope": "Jeder Dienst besitzt Signal-, Grace-, Drain-, Idempotenz-, Commit/Ack- und Killvertrag.", "rationale": "Deployment ist eine Failure-Injektion und muss Datenwahrheit erhalten."}, "STAFF-TARGET": {"active": true, "scope": "Teams nutzen Shutdowntemplates, Tests und Runbooks für API, Worker und Streamdienste.", "rationale": "Wiederkehrende Restart-/Duplikat-/Verlustfehler werden präventiv reduziert."}, "CHIEF-TARGET": {"active": true, "scope": "Plattformstandards regeln Grace Periods, Deployment-, Autoscaling-, Maintenance- und Recoverypolitik.", "rationale": "Chief-Ebene harmonisiert Availability, Cost und Business Continuity."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Async-signal-safe C handlers, realtime signals, init/runtime internals, kernel signal delivery und exotic runtimes sind Spezialistenfelder.", "rationale": "Die Zielrollen kennen sichere Grenzen und eskalieren Tiefe."}}, "lab_validation": [{"lab_id": "KB-0041-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Geplantes lokales Testprozesslab", "evidence": "Ablauf, negative Signale und Cleanup dokumentiert.", "limitations": "Keine systemd-, container-, Kubernetes-, cloud- oder Produktionsoperation ausgeführt."}]}
---
# Signale und kontrolliertes Herunterfahren

> **Ziel:** Behandle Shutdown als fachlichen Zustandsübergang. Ein Signal beendet nicht automatisch sicher: Der Dienst muss Admission schließen, laufende Arbeit nach Vertrag drainieren oder abbrechen, Ergebnis-/Ackzustand sichern und innerhalb einer klaren Grace Period kontrolliert austreten.

## Purpose, Definition und Scope

Signale sind asynchrone Benachrichtigungen an Prozesse oder Threads. Linux dokumentiert Signaldisposition, Masken und prozess-/threadgerichtete Zustellung. `SIGTERM` ist eine höfliche Beendigungsaufforderung, die behandelt oder ignoriert werden kann. `SIGKILL` kann nicht gefangen, blockiert oder ignoriert werden und beendet den Prozess hart. Scope: Zustellung, Handler, SIGTERM/SIGKILL, PID-1-Besonderheiten und Graceful Shutdown in Deployments und Hintergrundarbeit.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Signal, Parent/Child, handler, deadline, drain und durable outcome sind unterscheidbar. |
| HANDS-ON-TARGET | Lokaler Testprozess, keine Host-/Orchestratoränderung. |
| ARCHITECT-TARGET | Shutdown ist Daten-/SLO-/Sicherheitsvertrag. |
| STAFF/CHIEF | Templates und Plattformgrenzen verhindern unkontrollierte Restarts. |

## Mental Model: Stop ist eine Sequenz

```text
termination request
 -> stop admission
 -> advertise not-ready
 -> propagate cancellation/deadline
 -> drain or abandon safely
 -> persist/reconcile result
 -> close listeners/clients
 -> reap/join children
 -> exit before hard deadline
```

Ein Kill während eines Toolcalls, Batchjobs oder Datenbankwrite ist kein „normaler Erfolg“. Die Fachregel entscheidet: laufende Arbeit abschließen, abbrechen/compensate, lease zurückgeben, später retryen oder menschliche Prüfung verlangen.

## Prerequisites und Dependencies

| Abhängigkeit | Anwendung |
|---|---|
| [KB-0032 Prozesse](02-prozesse-und-lebenszyklen.md) | PID, Parent/Child, signals, reaping. |
| [KB-0033 Threads](03-threads-und-parallelitaet.md) | cancellation, join, bounded queue. |
| [KB-0040 systemd](10-systemd-und-dienstverwaltung.md) | Stopdeadline, restart, unit owner. |
| KB-0036 Sockets | Listenerstop, connection drain. |
| KB-0410 Durable Workflows | Idempotenz und verteilte Recovery. |

## Core Concepts

### Signaldisposition, Masken und sichere Verarbeitung

Ein Signal kann Defaultaktion, Ignore oder Handler besitzen. Der konkrete Thread-/Prozesskontext und die Runtime beeinflussen Verarbeitung. Asynchrone Signalhandler in nativen Programmen dürfen nur sehr eingeschränkt arbeiten; keine komplexe Businesslogik, Locks, Speicherallokation oder I/O darin. Ein sicherer Ansatz setzt ein minimales Flag oder schreibt an eine geeignete Signalleitung; der normale Event-/Workloop übernimmt Drain und Cleanup. Managed Runtimes bieten oft eigene Shutdownhooks, deren Semantik auf Zielversion geprüft wird.

### SIGTERM, SIGINT und SIGKILL

- **SIGTERM:** geordnete Beendigungsanforderung; der bevorzugte Deploymentpfad.
- **SIGINT:** meist interaktiver Interrupt, in Produktion nur mit klarer Policy.
- **SIGKILL:** keine Cleanupchance. Datenverlust-/Duplikatschutz muss vorher durch atomare/durable Verträge existieren.
- **SIGHUP:** traditionsbedingt Reload/Terminalhangup, aber kein universeller Reloadvertrag.

Signalnamen ersetzen keine Fachsemantik. Dokumentiere pro Dienst, welches Signal erwartet wird, wie lange Drain dauert, welche Arbeit abgebrochen wird und was nach Deadline passiert.

### PID 1 und Prozessbaum

In einem PID Namespace wird der erste Prozess PID 1. Er muss Child-Exitbehandlung und Signalweiterleitung bewusst übernehmen oder einen geeigneten Init/Supervisor nutzen. Ein Shellwrapper, der SIGTERM erhält, aber dem Worker nicht weitergibt, führt zu harten Kills und verlorener Arbeit. Ein Container muss deshalb nicht „ein Prozess exakt“ sein, aber Lifecycleowner, Reaping und Forwarding müssen eindeutig sein.

## Architecture und Data Flow: API plus Worker

```text
SIGTERM
 -> readiness false / remove from traffic
 -> API refuses new work
 -> worker stops claiming messages
 -> in-flight work: deadline + idempotent commit/lease release
 -> ack only after durable outcome
 -> clients close after drain
 -> process exits 0 or classified failure
```

Eine Queue-Ack vor dauerhaftem Commit führt bei Kill zu Verlust. Ein Commit ohne Lease-/Idempotencyvertrag kann bei Retry zu Duplikat führen. Streamingantworten brauchen eine Client-/Outputpolicy; Toolactions brauchen zusätzlich eine fachliche Continue-/Abortentscheidung.

## Protokolle, Standards und Tools

| Artefakt | Zweck |
|---|---|
| `signal(7)` | Linuxsignalzustellung und disposition/mask |
| `kill(2)` / Runtime hook | Signal-/Shutdownauslösung |
| systemd service | Stoptimeout/Restart/Unit lifecycle |
| Container/orchestrator | Grace period und lifecycle hook, versionsabhängig |
| Queue/DB/Workflow | durable commit, lease, ack und reconciliation |

## Konfiguration und Implementierung

```yaml
shutdown:
  trigger: SIGTERM
  readiness: false_before_drain
  admission: close_immediately
  in_flight: finish_if_before_deadline_else_cancel_safely
  worker_claim: stop_new_claims
  ack: only_after_durable_outcome
  grace_period: explicit_and_measured
  hard_kill: reconciled_on_next_start
observability:
  signal_received: counted
  draining: gauge
  abandoned_or_retried: counted
  deadline_exceeded: alert
```

Grace Period entsteht aus p99-Arbeit, Connectiondrain, Commit-/Cleanupzeit und SLO. Sie darf kein Freibrief für unendliches Warten sein. Deployments, Autoscaling und Maintenance verwenden denselben Vertrag.

## Scalability und Performance

Zu lange Grace Perioden senken Rolloutgeschwindigkeit und halten Kapazität; zu kurze erzwingen Kill/Retry und erhöhen Tail-Latency/Kosten. Bounded in-flight Work, kleine Checkpoints, idempotente Messages und schnelle Cancellationpunkte verkürzen Risiko. Messe signal-to-not-ready, drain duration, active work, abandon/retry, duplicate suppression, client disconnect, process exit and restart.

## Reliability und Failure Modes

| Fehlerbild | Ursache | Gegenmaßnahme |
|---|---|---|
| Datenverlust | ack vor commit, SIGKILL | durable ordering/reconcile |
| Duplikat | retry nach unklarem Outcome | idempotency/lease/version |
| Shutdown hängt | blockierendes I/O oder Child | timeouts/cancellation/join |
| Hard kill | grace too short or no drain | profile, budget, reduce work units |
| Traffic nach SIGTERM | readiness/listener not closed | phased stop test |
| Zombie children | PID1/parent not reaping | supervisor/owner verify |
| Restartstorm | failure misclassified | backoff/startlimit/alert |

## Security, Governance und Compliance

Shutdown darf Audit-, Lösch-, Sicherheits- oder Freigabeschritte nicht überspringen. Runtime-/Signalzugriff ist privilegiert und wird auditiert. Logs tragen nur redigierte IDs; wenn Arbeit abgebrochen wird, dokumentiert der durable Record Outcome, Policyversion und Reconciliationweg. Für hochkritische Writepfade sind Failover-/Maintenancefenster und Human Gate Teil der Governance.

## Observability und Troubleshooting

Bei einem Deploymentfehler korreliere: Revision, Signalzeit, readiness transition, in-flight count, queue claims, dependency/commit outcome, deadline, exit reason, restart and reconciled work. Unterscheide Apphang, Dependencyhang, PID1 forwarding, Supervisorzeit und Container-/Platformkill. Ändere zuerst Admission/Traffic, nicht blind Grace Period.

## Cost und FinOps

Kill/Retry kann Requests, Tokens, Toolcalls und DBarbeit verdoppeln. Zu große Drains halten alte und neue Replikas zugleich. FinOps misst erfolgreiche fachliche Arbeit, nicht nur „Pods beendet“. Work-unit-/Checkpointdesign reduziert Kosten bei Preemption und Autoscaling.

## Trade-offs und Anti-Patterns

- Signalhandler mit komplexer Businesslogik.
- SIGTERM wie SIGKILL behandeln.
- Ack vor Commit.
- Grace Period ohne Messung.
- Listener offen lassen, während Worker drainiert.
- Shell PID1 ohne Forward/Reap.
- Deployments ohne Abbruch-/Dedupe-/Reconciliationtest.
- Shutdownlogs mit Geheimnissen füllen.

## Staff-, Principal- und Chief-Level Decisions

Staff liefert runtimegerechte shutdown library/template, Tests und Runbook. Principal vereinheitlicht API/worker/workflow Recoveryschnittstellen und vermeidet konkurrierende Supervisoren. Chief bestimmt Deploy-/Maintenance-/Autoscaling-/preemptionpolicy, SLO-/Costgrenzen und Ausnahmen für nicht unterbrechbare Arbeit.

## Production Checklist

- [ ] SIGTERM Contract, readiness, admission, drain, cancellation und exit explizit.
- [ ] Work ist idempotent oder lease-/transactional geschützt.
- [ ] Ack erfolgt nach durable outcome.
- [ ] PID1/Parent forwards and reaps correctly.
- [ ] Grace Period ist p99-basiert, begrenzt und alarmiert.
- [ ] SIGKILL-/Restart-Reconciliation getestet.
- [ ] Deployment-/Autoscalingowner und Telemetrie vorhanden.

## Interviewfragen mit Modellantworten

### Warum ist SIGKILL kein normaler Shutdown?
Er kann nicht verarbeitet werden. Jede Korrektheitsgarantie muss vor dem Kill durch Persistenz, Idempotenz und Recovery etabliert sein.

### Was macht ein Worker zuerst bei SIGTERM?
Er stoppt neue Claims/Admission, signalisiert Drain, verarbeitet oder cancelt aktive Work bis Deadline, schreibt durable Outcome und acked erst danach.

### Warum ist PID 1 wichtig?
Es trägt im Namespace besondere Lifecycleverantwortung. Fehlendes Reaping oder Forwarding führt zu Zombies und harten Kills.

### Wie wählst du eine Grace Period?
Aus gemessener p99-Arbeit plus Commit/Cleanup und Sicherheitsmarge, begrenzt durch Deployment-/SLO-/Kapazitätsbedarf. Sie wird wiederholt getestet.

### Wie vermeidest du Duplikate nach Shutdown?
Idempotency Key, Lease, Version/conditional write, Outbox and Reconciliation; kein lokaler Memoryflag allein.

## Praktisches Lab: SIGTERM und bounded drain

> `reviewed_only`; kein Host-/Container-/Produktionsprozess.

1. Baue einen lokalen Worker mit begrenzter Testqueue und idempotentem Resultatstore.
2. Sende SIGTERM nach Beginn einer Arbeit; erwarte admission closed, keine neuen Claims und klaren Endzustand.
3. Negative Probe: stoppe ohne Ack-/Commitordnung und dokumentiere Verlust-/Duplikatrisiko.
4. Simuliere harte Deadline; markiere verbliebene Arbeit retrybar/reconcilierbar.
5. Join alle Children, lösche Testdaten und prüfe, dass keine Prozesse bleiben.

## Dependencies und Cross-References

- [KB-0032 Prozesse](02-prozesse-und-lebenszyklen.md)
- [KB-0033 Threads](03-threads-und-parallelitaet.md)
- [KB-0040 systemd](10-systemd-und-dienstverwaltung.md)
- KB-0410 Durable Workflows
- KB-0550 Platform Engineering
- KB-0580 AI Infrastructure

## Quellen und Aktualitätsnotizen

| Quelle | Nutzung | Stand |
|---|---|---|
| Dateikatalog | Scope. | 2026-09-14 |
| [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html) | Zustellung, disposition, masks. | Linux man-pages 6.19 |
| [pid_namespaces(7)](https://man7.org/linux/man-pages/man7/pid_namespaces.7.html) | PID namespace/proc context. | Linux man-pages 6.19 |
| [systemd service overview](https://systemd.io/ARCHITECTURE/) | service lifecycle executor context. | 2026-09-15 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — Preemptible/elastic Compute macht kurze, idempotente und checkpointbare Work Units wichtiger.** **Reifegrad: Established bis Adopting je Cloudplattform.** Ein Pilot misst Abbruchrate, Reconcilezeit und Kosten pro Erfolg.

**Stand 2026-09-15 — Agentische Tool-/Workflowausführung benötigt feinere Continue-/Abortverträge als einfache HTTP-Requests.** **Reifegrad: Adopting.** Ein Pilot beginnt read-only und erfasst durable Outcome vor externen Seiteneffekten.

**Stand 2026-09-15 — Strukturierte Cancellation in Runtimes verbessert Childownership, ersetzt aber keine Fachrecovery.** **Reifegrad: Adopting bis Established.** Ein Pilot testet Timeout, SIGTERM und SIGKILL-Simulation getrennt.

