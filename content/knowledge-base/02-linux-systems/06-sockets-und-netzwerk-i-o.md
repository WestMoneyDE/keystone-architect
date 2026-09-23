---
{"id": "KB-0036", "title": "Sockets und Netzwerk-I/O", "domain": "02", "sequence": 6, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["PLATFORM", "CLOUD", "GENAI", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0031", "concepts": ["System Calls", "File Descriptors", "Kernel/User-Space"], "needed_for": "understanding"}, {"id": "KB-0032", "concepts": ["Prozesslebenszyklus", "Signale", "Shutdown"], "needed_for": "understanding"}, {"id": "KB-0033", "concepts": ["Concurrency-Budget", "Backpressure", "Threads"], "needed_for": "understanding"}], "related": ["KB-0035", "KB-0037", "KB-0038", "KB-0039", "KB-0040", "KB-0080", "KB-0565", "KB-0580"], "applies": ["KB-0080", "KB-0565", "KB-0580"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein lokales Loopbacklab beobachtet Listener, Verbindung, Timeout, Backlog und FD-Cleanup.", "rationale": "Es vermittelt sichere Diagnose ohne Netz-/Hoständerung."}, "ARCHITECT-TARGET": {"active": true, "scope": "Services besitzen Connection-, FD-, Queue-, Timeout-, TLS- und Shutdownbudgets.", "rationale": "Netzwerk-I/O wird als begrenzter Vertrag entworfen."}, "STAFF-TARGET": {"active": true, "scope": "Teams standardisieren Clientpools, cancellation, backpressure, retries und Sockettelemetrie.", "rationale": "Lokale Parallelität wird nicht zu Dependencyüberlast."}, "CHIEF-TARGET": {"active": true, "scope": "Plattformstandards setzen Ingress-/Egress-, Latenz-, Sicherheits- und Kostenbudgets.", "rationale": "Chief-Ebene steuert systemische Grenzen und Betriebsmodell."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "epoll-Interna, TCP-Tuning, kernel queueing, eBPF networking und NIC-/IRQ-Tuning sind Spezialistenfelder.", "rationale": "Die Zielrollen erkennen Bedarf und Eskalationsgrenze."}}, "lab_validation": [{"lab_id": "KB-0036-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Geplantes lokales Loopbacklab", "evidence": "Ablauf, negative Proben und Cleanup dokumentiert.", "limitations": "Keine Firewall-, Kernel-, TCP-, container-, cloud- oder Produktionskonfiguration ausgeführt."}]}
---
# Sockets und Netzwerk-I/O

> **Ziel:** Behandle jede Verbindung als begrenzte Ressource mit Lebenszyklus. Listener, Backlog, Socketbuffer, File Descriptor, Requestdeadline, Clientpool und Shutdown müssen zusammenpassen; `epoll` ersetzt diese Grenzen nicht.

## Purpose, Definition und Scope

Sockets sind die Linuxschnittstelle zwischen Prozess und Netzwerkprotokollstack. Ein Socket ist über einen File Descriptor bedienbar. TCP bietet einen zuverlässigen, geordneten Byte-Stream ohne Record Boundaries; UDP bietet Datagramme mit anderer Zuverlässigkeits- und Reihenfolgesemantik. Scope: Socketlebenszyklus, Listenerqueues, `epoll`, Backlog, Verbindungs-/FD-Grenzen, Leaks und Backenddiagnose.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Connectionstate, Backlog, nonblocking I/O, FDownership und Backpressure werden erklärt. |
| HANDS-ON-TARGET | Loopbacktests verwenden eigene Ports und synthetische Requests. |
| ARCHITECT-TARGET | Servicebudget verbindet Ingress, Clients, FD, Zeit, TLS und Dependency. |
| STAFF/CHIEF | Standards und Plattformgrenzen verhindern Verbindungskaskaden. |

## Mental Model: Ein Socket ist ein Lease auf knappe Kapazität

```text
client -> SYN/accept queue -> accepted socket FD -> protocol parser
       -> bounded work -> dependency client socket -> response/drain/close
```

Jeder Pfeil kann begrenzen, warten oder scheitern. Die Frage lautet: **Wer besitzt diesen FD, wie lange darf er leben, und was geschieht bei Sättigung oder Cancel?**

## Prerequisites und Dependencies

| Abhängigkeit | Nutzen |
|---|---|
| [KB-0031 Kernel und Systemaufrufe](01-linux-kernel-und-systemaufrufe.md) | FD und Syscallgrenze. |
| [KB-0032 Prozesse](02-prozesse-und-lebenszyklen.md) | Shutdown, Signal, Owner. |
| [KB-0033 Threads](03-threads-und-parallelitaet.md) | Pool-/Queuegrenzen. |
| KB-0035 Dateisysteme | FD-Lifecycle als gemeinsames Muster. |
| KB-0080 APIs und HTTP | Protokoll-/Anwendungsgrenze. |

## Core Concepts

### Socket Lifecycle

Server: `socket -> bind -> listen(backlog) -> accept -> read/write -> shutdown/close`. Client: `socket -> connect -> read/write -> shutdown/close`. `accept` ergibt einen **neuen** Socket-FD. Linux dokumentiert, dass der angenommene Socket File-Statusflags nicht verlässlich vom Listener übernimmt; Anwendungen setzen erforderliche Flags explizit, etwa mit `accept4`.

Ein vollständiges TCP-Schließen ist kein einzelner Moment. TCP ist full duplex; `shutdown` kann eine Richtung schließen, `close` gibt den FD frei. Anwendungscode braucht Framing, Deadline und klare Regel für Clientdisconnect, nicht nur „Socket geschlossen“.

### Backlog und Queues

`listen(backlog)` begrenzt die Queue vollständig etablierter, noch nicht akzeptierter Verbindungen. Linux kann den Wert mit `somaxconn` cappen; unvollständige Handshakes haben weitere Protokoll-/Kernelgrenzen. Ein größerer Backlog hilft nur bei kurzen Accept-Spitzen. Er heilt keine langsame App, keine CPU-/FD-Erschöpfung und keine Downstream-Latenz.

### Nonblocking, Readiness und epoll

Bei `O_NONBLOCK` geben Operationen, die warten würden, typischerweise `EAGAIN` zurück; Connect kann `EINPROGRESS` liefern. `epoll` überwacht viele FDs und skaliert laut man-page für große Watch-Sets. Readiness ist keine Zusage, dass eine spätere Operation beliebig viele Bytes liefern oder niemals blockieren kann. Edge-triggered Modelle verlangen vollständiges Lesen/Schreiben bis `EAGAIN`; level-triggered Modelle sind einfacher, können aber wiederholt wecken. Runtime-/Frameworksemantik wird vor eigener epoll-Implementierung verstanden.

### Socket Buffer, Flow Control und Timeouts

Socketbuffer koppeln App und Kernel. Große Buffer verändern Memoryfootprint und Latenz; kleine Buffer erhöhen Backpressure. TCP schützt geordnete Übertragung, nicht Fachsemantik. Timeout muss pro Phase gelten: DNS/Connect, TLS, Header, Body, Idle, Gesamtrequest und Shutdown. Ein einzelner globaler Timeout führt zu falschen Retries und unklarer Cancellation.

## Architecture und Data Flow: Bounded Backenddienst

```text
ingress limit -> listener/backlog -> accept + FD budget
 -> TLS/parser body limits -> request admission
 -> bounded worker/dependency clients -> response buffer
 -> drain deadline -> close
```

Der Dienst hat separate Limits für offene Inbound Connections, in-flight Requests, Bodybytes, Worker, ausgehende DB/HTTP/LLM-Verbindungen und Responsebuffer. Ein Clientpool ist eine Queue mit Ownership, Timeout und Fehlerpolicy. Ein 100-Request-Service darf nicht 100 gleichzeitige teure Modellcalls starten, wenn Gateway/GPUbudget 10 zulässt.

## Protokolle, Standards und Tools

| Quelle | Bedeutung |
|---|---|
| TCP / RFC 9293 | zuverlässiger geordneter Byte-Stream, Zustände und Queuegrenzen |
| `socket(7)` | Linux Socket API, nonblocking, Buffers, `SO_REUSEPORT` |
| `listen(2)` | passive Socket-/Backlogsemantik |
| `accept(2)` | neue FD- und Flaggrenze |
| `epoll(7)` | Watch- und ready-event-Modell |

## Konfiguration und Implementierung

```yaml
service: model-gateway
limits:
  inbound_connections: bounded
  in_flight_requests: bounded
  request_body_bytes: bounded
  accept_backlog: measured_with_platform_cap
  outbound_llm_connections: bounded
timeouts:
  connect: explicit
  tls: explicit
  request_total: explicit
  idle: explicit
  graceful_shutdown: explicit
failure:
  overload: reject_or_defer
  cancel: propagate_to_children
  retry: classified_and_capped
```

`SO_REUSEPORT`, Socketbuffer, busy polling, TCP-CORK oder Kernel-Sysctl sind keine Standardwerte. Sie verlangen Zielplattformtest, Security-/Supportowner und Profilhypothese. `SO_REUSEPORT` kann laut `socket(7)` Accept-Verteilung verbessern, braucht aber bewusstes Deployment- und UID-/Securitymodell.

## Scalability und Performance

Miss open FDs, accepted/sec, backlog/connection errors, active connections, handshake-/request-/dependencylatency, bytes, read/write EAGAIN, clientpool pending, timeouts, resets, retries und CPU. Ein hoher Accept-Durchsatz bei wachsender Requestqueue ist kein Erfolg. Sättigung soll früh als 429/503/defer sichtbar sein, nicht später als FD exhaustion, OOM oder Downstreamstorm.

## Reliability und Failure Modes

| Fehler | Ursache | Antwort |
|---|---|---|
| Backlog voll | App akzeptiert/arbeitet zu langsam | Admission, worker/dependencybudget, Backlog nur als Schutzpuffer |
| FD exhaustion | Leaks oder zu viele Connections | lifecycleowner, `CLOEXEC`, close/defer, limits, FDmetriken |
| Connection storm | Retry/fan-out ohne Budget | jitter, circuit breaker, bounded pools |
| Slowloris/body bomb | langsamer/großer Input | header/body/idle limits |
| Half-open/shutdown loss | fehlende Drain-/Cancellationpolicy | Stop acceptance, deadline, drain, idempotency |
| EPIPE/SIGPIPE | Schreiben nach Close | Fehler klassifizieren, sichere Writepolicy |
| Event-loop block | Blocking Call im I/O-Thread | CPU/Blockingarbeit auslagern, Profiling |

## Security, Governance und Compliance

TLS, Zertifikatrotation, Auth vor teurer Arbeit, Requestgrößen, Rate-/Tenantlimits, egress allowlists und redigierte Sockettelemetrie gehören zum Contract. FD-/Connectionlimits sind DoS-Schutz. Client-IP-/Headerdaten sind personenbezogene Telemetrie und werden mit Retention-/Zugriffsregeln behandelt. Eine offene TCP-Verbindung ist keine Autorisierung für Toolaction oder Datenzugriff.

## Observability und Troubleshooting

Korrelieren: listener state, FDcount, connection age, handshake outcome, backlog-/refusal signal, request bytes, active/pending work, dependency connection pool, timeout reason, TLS/protocol error, retry and response outcome. Diagnose: zuerst Admission/FD/Queue, dann Appthread/Eventloop, dann Downstream; TCPtuning erst nach belastbarer Hypothese.

## Cost und FinOps

Viele idle Connections kosten FDs, Memory, NAT/Load-Balancer-/Gatewaykapazität und Telemetrie. Retries und lange Streams multiplizieren Egress und Modell-/Toolkosten. Budgets pro Tenant und Workloadklasse koppeln Reliability an Kosten.

## Trade-offs und Anti-Patterns

- Backlog erhöhen statt Downstream-/Requestbudget korrigieren.
- `epoll` als Ersatz für Backpressure ansehen.
- Inbound und Outbound Connectiongrenzen vermischen.
- unbounded Response-/Requestbuffer.
- Socket/Fd ohne Owner/Closepfad.
- Retry auf Connect-/Timeoutfehler ohne Deadline/Jitter.
- Kernelparameter aus Blog/Snippet in Produktion kopieren.

## Staff-, Principal- und Chief-Level Decisions

Staff liefert Client-/Servertemplates mit Deadline, Limit, TLS, Trace, Pool, Shutdown und FD-Tests. Principal entkoppelt Workloadklassen und koppelt Appbudgets an Gateway/DB/LLM-Grenzen. Chief legt Ingress-/Egress-, Zertifikat-, Netzwerkobservability-, DoS- und Costpolicy fest und behandelt Kernel/NIC-Tuning als Ausnahme mit Spezialistenreview.

## Production Checklist

- [ ] FD, inbound/outbound connections, queues, body/response bytes und in-flight work begrenzt.
- [ ] Jeder Socket hat Owner, Deadline, Cancel-/Drain- und Closepfad.
- [ ] Listener-/Backlog-/platformcap und Accept-Fehler beobachtbar.
- [ ] TLS/auth/rate limit vor teurer Arbeit.
- [ ] Timeoutphasen, Retryklassifikation und idempotente Seiteneffekte definiert.
- [ ] Shutdown stoppt Admission, drainiert begrenzt und beendet Clientpools.
- [ ] Last-/Slow-client-/Downstreamfailuretest geplant.

## Interviewfragen mit Modellantworten

### Was begrenzt `listen(backlog)`?
Auf Linux die Queue etablierter, noch nicht akzeptierter Verbindungen, zusätzlich gecappt durch Systemgrenzen. Es ist kein Durchsatzregler für die gesamte Anwendung.

### Warum braucht `accept` einen eigenen FD-Contract?
Weil jede neue Connection einen knappen FD, Buffer, TLS-/Parserzustand und Lifecycle besitzt. Flags und Cleanup werden explizit gesetzt.

### Was ist der Unterschied zwischen Readiness und Datenverfügbarkeit?
Readiness zeigt, dass eine Operation möglich sein kann. Anwendungscode behandelt partielle Reads/Writes, `EAGAIN`, HUP, Fehler und Framing robust.

### Wie verhinderst du eine LLM-Gatewaykaskade?
Separate Admission und Semaphore/Pool für Modelcalls, Token-/Timeoutbudget, Retrycap/Jitter, circuit breaker und klare Degradation.

### Wann nutzt du `SO_REUSEPORT`?
Nach Messung und Plattformreview, wenn mehrere Listener gezielt Accept-Last verteilen sollen. Security-/Deploymentsemantik wird geprüft.

## Praktisches Lab: Loopback-Listener und FD-Cleanup

> `reviewed_only`; nicht ausgeführt und nur für eigene lokale Testprozesse.

1. Starte einen Listener auf Loopback mit begrenztem Backlog und dokumentiere FD/Port/Owner.
2. Sende synthetische kurze Clients und beobachte Accept, Requestdeadline, Close und FDcount.
3. Negative Probe: lasse Clients ohne vollständige Anfrage offen; verifiziere Idle-/Headerlimit.
4. Negative Probe: begrenze Worker/Downstream künstlich und prüfe reject/defer statt unbounded Queue.
5. Stoppe Admission, drainiere bis Deadline, schließe FDs und entferne Testprozesse.

## Dependencies und Cross-References

- [KB-0031](01-linux-kernel-und-systemaufrufe.md), [KB-0032](02-prozesse-und-lebenszyklen.md), [KB-0033](03-threads-und-parallelitaet.md)
- KB-0035 Dateisysteme und Persistenzpfade
- KB-0080 APIs und HTTP
- KB-0565 Cloud Architecture und Landing Zones
- KB-0580 AI Infrastructure, GPU und Inference

## Quellen und Aktualitätsnotizen

| Quelle | Nutzung | Stand |
|---|---|---|
| Dateikatalog | Scope. | 2026-09-14 |
| [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html) | Socket API, nonblocking, buffers, reuseport. | 2026-09-15 |
| [listen(2)](https://man7.org/linux/man-pages/man2/listen.2.html) | Backlog-/Queuegrenzen. | Linux man-pages 6.19 |
| [accept(2)](https://man7.org/linux/man-pages/man2/accept.2.html) | Accepted FD/Flags. | Linux man-pages 6.19 |
| [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html) | Event notification. | Linux man-pages 6.19 |
| [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html) | TCPstream, buffers, options. | Linux man-pages 6.19 |
| [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293.html) | TCP-Standard. | 2022, abgerufen 2026-09-15 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — Event-driven I/O bleibt ein Kernmechanismus für connectionreiche Services, aber Runtime-/Frameworkabstraktionen reduzieren direkte epoll-Nutzung.** **Reifegrad: Established.** Ein Pilot misst Loop-Lag, FD/Connectionbudget und Downstream-Sättigung, nicht nur Events/sec.

**Stand 2026-09-15 — QUIC/HTTP-3 verschiebt Multiplexing- und Connection-Trade-offs, ersetzt aber nicht Application-Backpressure und Tenantbudgets.** **Reifegrad: Adopting bis Established je Plattform.** Ein Pilot vergleicht Latenz, Observability, Sicherheits- und Load-Balancer-Support.

**Stand 2026-09-15 — Model-/Agent-Gateways brauchen zunehmend egress- und toolbezogene Concurrency-Controls.** **Reifegrad: Adopting.** Ein Pilot startet mit read-only Toolcalls, Request-/Tokenlimits und durchgängiger Cancellation.

