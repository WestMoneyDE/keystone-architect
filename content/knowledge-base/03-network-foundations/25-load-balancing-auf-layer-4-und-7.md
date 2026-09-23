---
{"id": "KB-0073", "title": "Load Balancing auf Layer 4 und 7", "domain": "03", "sequence": 25, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Fehlersuche", "Lastprofil"], "needed_for": "both"}, {"id": "KB-0056", "concepts": ["TCP-Verbindung", "Überlastung", "lange Connections"], "needed_for": "both"}, {"id": "KB-0069", "concepts": ["HTTP/2 Streams", "Multiplexing", "GOAWAY"], "needed_for": "understanding"}, {"id": "KB-0072", "concepts": ["Reverse Proxy", "Upstream Pool", "Headertrust", "Buffering"], "needed_for": "both"}], "related": ["KB-0074", "KB-0075", "KB-0418", "KB-0562", "KB-0720"], "applies": ["KB-0074", "KB-0418", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Das Lab simuliert in einer lokalen Python-Datenstruktur Endpointgewicht, aktive Connections, Requestkosten, Healthzustand, Affinität und Draining. Es sendet keinen Traffic und verändert keinen Load Balancer.", "rationale": "Es trainiert Auswahl- und Fehlerlogik ohne Socket, DNS, TLS, Proxy-, Container-, Cloud-, Netzwerk- oder Produktionsressourcen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein Load-Balancing-Vertrag definiert Layer/Terminierung, Zielgruppen, Auswahl- und Gewichtungsmodell, Health-/Readiness-Semantik, Connection-/Request-/Streamlimits, Affinitätsgrund, Hash-/Cookie-/Privacy-Policy, Warm-up, Retry/Timeout, Drain, Fallback, Telemetrie, Capacity und Rollback.", "rationale": "Verteilung ist nicht gleich Einheitslast: L4 sieht Verbindungen, L7 sieht HTTP-/gRPC-Semantik; lange, gemultiplexte oder kostenungleiche Arbeit benötigt eine bewusst gemessene Steuerung."}, "STAFF-TARGET": {"active": true, "scope": "Teams testen ungleiche Requestkosten, hohe Latenz, lange WebSocket-/gRPC-/H2-/H3-Verbindungen, Health-Flapping, DNS-/Endpointwechsel, Affinity-Churn, Scale-out, ungleiches Gewicht, Drain und abgebrochene nicht-idempotente Requests gegen SLO und Capacity.", "rationale": "Sie trennen Endpoint-Auswahl, Connection-/Stream-/Requestverteilung, Queueing, Netzwerk/TLS, Healthsignal, Readiness, Warm-up, Retry und Anwendungseffekt durch per-Hop-Metriken und reproduzierbare Lastprofile."}, "CHIEF-TARGET": {"active": true, "scope": "Die Organisation steuert Traffic Management als gemeinsame Edge-/Platform-/SRE-/Security-Fähigkeit mit verbindlichen Health-/Drain-/Affinity-/Limit-/Datenschutzstandards, Lieferanten-/Cloud-LB-/CDN-Governance, Kosten-/Kapazitätsmodellen, Ausnahmen und kontrollierten Disaster-/Updateprozessen.", "rationale": "Ein falscher globaler Healthcheck, eine klebrige Affinität oder ein ungebremster Retry-/Drainablauf kann große Ausfälle, Kostenanstiege, Privacy-Risiken und ungleiche Last über viele Produkte verbreiten."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Produktgenaue NGINX/Envoy/HAProxy/F5/Cloud-LB-/CDN-Parameter, Maglev-/Ring-Hash-Implementierung, EWMA-/adaptive Schedulers, kernel/NIC tuning, BGP/Anycast/L4 DSR, PROXY protocol, packet capture and chaos/injection at scale are specialist depth.", "rationale": "Die Zielrollen verantworten SLO-, Sicherheits-, Kapazitäts- und Changeverträge; produktspezifische Datenpfadoptimierung und Netztechnik wird mit Traffic-, Netzwerk-, Edge- und Security-Spezialisten vertieft."}}, "lab_validation": [{"lab_id": "KB-0073-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox ohne Netzwerkzugriff", "evidence": "Ein deklaratives Modell vergleicht weighted round-robin, least-active, Kostenungleichheit, Health-/Readiness, Affinity und Draining mit positiven und negativen Fällen.", "limitations": "Nicht ausgeführt; kein Paket, Socket, DNS, TLS, Proxy, NGINX/Envoy/Load-Balancer, Container, Cloud-, Netzwerk- oder Produktionssystem wurde verwendet oder verändert."}]}
---
# Load Balancing auf Layer 4 und 7

> **Ziel:** Load Balancing verteilt nicht abstrakte „Last“, sondern konkrete Verbindungen, Streams, Requests und Ressourcen auf konkrete Zielgruppen. Wähle Layer, Algorithmus, Healthsignal, Affinität, Limits und Draining nach Lastprofil und Fehlersemantik, nicht nach einer universellen Standardregel.

## Purpose, Definition und Scope

Load Balancing wählt für neue Arbeit einen Zielendpunkt aus einer Zielgruppe. Es kann auf **Layer 4** über IP, Port und Transportverbindungen oder auf **Layer 7** über Anwendungssemantik wie HTTP Authority, Path, Header, Cookie, gRPC-Methode oder Stream stattfinden. Es verbessert Verfügbarkeit und Kapazitätsnutzung, ersetzt aber keine horizontale Skalierbarkeit, Datenkonsistenz, Rate Limits, Backpressure, Idempotenz oder Anwendungsgesundheit.

Dieses Kapitel vergleicht Verteilalgorithmen, Health Checks, Session Affinity, ungleiche Last, lange Verbindungen und Connection Draining. Es verwendet aktuelle NGINX- und Envoy-Dokumentation als Produktbeispiele, ohne deren Defaults oder Fähigkeiten auf andere Produkte zu übertragen. Der Reverse-Proxy-Vertrag ist in KB-0072 kanonisch beschrieben. DNS-, Multi-Region- und globales Routing kommen in späteren Kapiteln vertieft vor.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Auswahl funktioniert nur gegen eine messbare Zielgruppe und eine definierte Arbeitseinheit. |
| HANDS-ON-TARGET | Lokales Auswahl- und Drainmodell ohne Netzwerk oder Produktkonfiguration. |
| ARCHITECT-TARGET | Layer, Algorithmus, Health/Readiness, Affinität, Limits, Warm-up, Retry und Drain sind Dienstvertrag. |
| STAFF/PRINCIPAL | Reale Lastprofile widerlegen Scheingleichverteilung und testen kontrollierte Mitgliedschaftswechsel. |
| CHIEF | Traffic Management wird als resiliente, sichere und kostenbewusste Plattformfähigkeit geführt. |

## Mental Model: Was wird eigentlich verteilt?

```text
new client event
  -> what is selectable? L4 connection / L7 request / stream / session?
  -> which endpoints are eligible? discovery + readiness + routing + policy
  -> which selection rule? weight, load, hash, latency, locality, priority
  -> can it be retried? semantics, deadline, idempotency
  -> what happens during member change? warm-up, drain, cutoff, rollback
```

Ein Algorithmus kann nur die Signale verwenden, die an seinem Layer sichtbar sind.

```text
L4 load balancer
  sees: source/destination, TCP/UDP connection, bytes, connection duration
  cannot generally see: HTTP route, status, request cost, tenant, gRPC method

L7 reverse proxy/load balancer
  sees: HTTP/gRPC metadata, per-request/stream timing, response/status
  may terminate TLS and needs header/identity/privacy controls
```

Ein HTTP/2- oder HTTP/3-Client kann viele parallele Requests/Streams auf einer langen Verbindung senden. Ein L4-Balancer sieht dann möglicherweise **eine** Connection, während ein L7-Balancer Streams und Requests steuern kann. Umgekehrt kann ein L7-Proxy Buffer-, Parser-, TLS- und CPUlast einführen. Die Entscheidung ist ein Trade-off, keine Ebenenrangliste.

## Prerequisites und Dependencies

| ID | Art | Bedeutung |
|---|---|---|
| [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Verständnis und Lab | Last- und Fehlerhypothesen. |
| [KB-0056](08-tcp-verbindungen-und-ueberlastkontrolle.md) | Verständnis und Lab | Connections, Überlastung und lange Sessions. |
| [KB-0069](21-http-2-und-multiplexing.md) | Verständnis | Streams, Multiplexing und GOAWAY. |
| [KB-0072](24-forward-und-reverse-proxies.md) | Verständnis und Lab | Reverse Proxy, Upstreampool, Headertrust und Buffering. |

## Core Concepts

### Layer 4 und Layer 7

| Merkmal | Layer 4 | Layer 7 |
|---|---|---|
| Auswahlzeitpunkt | beim Aufbau einer Transportverbindung | pro HTTP-/gRPC-Request oder Stream nach Protokollverarbeitung |
| Sichtbare Signale | Adresse, Port, Connectionzustand, Bytes/Timing | Authority, Path, Methode, Header, Cookie, Status, request/stream timing |
| TLS | oft passthrough oder separate Terminierung | kann TLS terminieren und neues Upstream-TLS/mTLS bauen |
| Protokollabhängigkeit | gering | hoch; Parser-/Version-/Headerregeln nötig |
| Kosten | meist geringere L7-Verarbeitung | TLS/Parsing/Buffer/Logs/Caching können CPU/Memory erhöhen |
| Langes Connectionprofil | kann einen Zielhost lange binden | kann ggf. einzelne HTTP-Arbeit verteilen, je nach Protokoll/Proxy-Topologie |
| Security/Privacy | weniger Inhalt sichtbar | erfordert klare Klartext-, Header-, Auth- und Loggingpolicy |
| Typische Anwendung | TCP/UDP, TLS passthrough, nicht-HTTP | APIs, gRPC, vHost/path routing, auth/rate/caching |

Layer 4 kann nicht zwangsläufig eine HTTP/2-Connection über mehrere Backends aufteilen, ohne selbst den Protokollkontext zu terminieren. Layer 7 kann nicht jeden lang laufenden Stream beliebig „umschalten“, wenn seine Wirkung bereits im Ziel begonnen hat. Eine neue Auswahl gilt fast immer nur für noch nicht gebundene Arbeit.

### Zielgruppen, Eligibility und Discovery

Eine Zielgruppe ist mehr als eine Liste von IPs:

```text
endpoint identity + route capability + version + zone/region + weight
+ health/readiness + capacity limit + drain state + policy eligibility
```

Ein Endpoint ist erst **eligible**, wenn er zur Route, Datenklasse und Sicherheitspolicy passt und sein Health-/Readinesszustand die ausgewählte Arbeit zulässt. Service Discovery informiert, welche Mitglieder existieren; sie beweist nicht, dass sie sicher oder bereit sind. DNS, Kubernetes Endpoint-Listen, Cloud Target Groups oder statische Konfiguration benötigen jeweils Caching-, Update-, Stale-, Entfernen- und Rollbackverhalten.

| Status | Darf neue Arbeit erhalten? | Typische Bedeutung |
|---|---|---|
| discovered | nicht zwingend | Mitglied bekannt, noch nicht bewiesen geeignet. |
| warming | begrenzt/gewichtet | startend, Caches/Connections/JIT noch nicht stabil. |
| ready/healthy | ja, nach Limits/Policy | Ziel kann die definierte Route bedienen. |
| overloaded | nur nach Schutzpolicy | unter Kapazitätsdruck, Queue/Concurrency grenzwertig. |
| draining | nein für neue Arbeit | bestehende/bound work darf kontrolliert auslaufen. |
| unhealthy | nein | Healthsignal fehlt oder aktive Fehlergrenze überschritten. |
| removed | nein | nicht mehr Teil der Zielgruppe; Verbindungscleanup folgt. |

### Verteilalgorithmen

Kein Algorithmus ist „fair“, ohne eine definierte Arbeitseinheit. Gleich viele Connections sind nicht gleich viele Requests, CPUsekunden, Bytes, Datenbankaufrufe oder Geldtransaktionen.

| Algorithmus | Gute Annahme | Typischer Vorteil | Gefahr |
|---|---|---|---|
| Round Robin | kurze, ähnliche Arbeit | einfach, gut nachvollziehbar | lange/teure Requests verteilen sich ungleich. |
| Weighted Round Robin | Kapazität ist ungefähr bekannt/stabil | unterschiedliche Maschinen/Quoten berücksichtigen | Gewichte altern oder ignorieren Laufzeitlast. |
| Least Connections | aktive Connections korrelieren mit Last | schützt bei unterschiedlich langen Connections | H2/H3 Multiplexing: eine Connection kann viele Streams tragen. |
| Least Requests/Streams | aktive Arbeit korreliert besser als Connections | geeignet für L7 mit Requestsicht | Requestkosten können stark schwanken. |
| Least Time/EWMA/latency-aware | vergangene Latenz sagt etwas über unmittelbare Kapazität | reagiert auf langsame Ziele | Rückkopplung, Cold Start, noisy metrics und Hysterese. |
| Random / power of two choices | große Zielgruppen, geringe globale Koordination | robust und skalierbar | braucht sinnvolles Auswahlmetriksmodell. |
| Hash / consistent hash | Lokalität/Cache-/Sessionbindung notwendig | stabile Zuordnung, weniger Remapping | Hot keys, membership churn, Privacy-/Skewrisiko. |
| Priority / failover tiers | Klassen statt gleichwertige Targets | kontrollierter Fallback | Backup kann ungeübt/unterkapazitiert sein. |

NGINX dokumentiert etwa Round Robin, Least Connected, IP Hash und gewichtete Auswahl für HTTP-Upstreams. Envoy dokumentiert mehrere Auswahlmechanismen und Connection Pools. Die Produktnamen oder Messmethoden dürfen nicht in Architekturentscheidungen als standardisierte Semantik erscheinen.

### Ungleiche Last: Warum Gleichverteilung täuschen kann

```text
request A: 1 KB response, 5 ms CPU, no database
request B: 2 GB export, 30 min connection, 5 GB database scan
request C: 20 H2 streams on one client connection
```

Round Robin zählt diese drei Ereignisse vielleicht je einmal. Least Connections kann B schwer, C aber leicht zählen, obwohl C viele Streams enthält. A latency-aware algorithm may select an endpoint whose historic average looks good while its queue is about to explode. The application must expose or infer a safe load signal.

Mögliche Signale, die nie isoliert als Wahrheit gelten:

- aktive Requests/Streams und active connections;
- Requestklassen, Body-/Responsebytes, Duration und CPU;
- Queuezeit und concurrency slots;
- Upstream-/Database-/GPU-/dependency saturation;
- p50/p95/p99 service time und Fehler;
- endpoint health, zone/region, warm-up and autoscaling phase;
- client-/tenant-/affinity distribution.

Ein Ziel mit zehn offenen WebSockets ist nicht zwingend „zehnmal so belastet“ wie eines mit einer Connection. Ein Ziel mit einer H2-Connection kann hunderte Streams haben. Definiere daher route- und protokollspezifische Capacity Units.

### Health Checks, Readiness und passive Evidenz

**Liveness** fragt, ob ein Prozess oder Endpoint grundsätzlich reagiert. **Readiness** fragt, ob er jetzt die konkrete Traffic-Klasse bedienen darf. Ein Health Check kann auf mehreren Ebenen liegen:

| Check | Beispiel | Was er beweist | Was er nicht beweist |
|---|---|---|---|
| Network/L4 | TCP connect, TLS handshake | Listener/Pfad erreichbar | Route, Auth, Dependency oder echte Nutzerqualität. |
| HTTP/L7 | `GET /readyz` mit erwarteter Statusklasse | definierte Anwendungsschnittstelle reagiert | jede Geschäftsoperation oder jeder Downstream ist gesund. |
| Protocol-specific | gRPC health / application ping | Protokollservice nach definierter Semantik | korrektes Daten- oder Berechtigungsverhalten. |
| Passive | echte connect/timeout/5xx-Ausfälle | realer Verkehr sah Fehler | Ursache, globale Unverfügbarkeit oder readiness bei geringer Last. |
| Synthetic journey | Authentisierter kritischer Ablauf | enger Geschäftspfad | vollständige Skalierung und alle Nutzer-/Datenschutzfälle. |

Eine Readinessroute darf nicht blind jede optionale Abhängigkeit einbeziehen: Ein Ausfall eines nicht benötigten Features könnte sonst alle Endpoints aus der Zielgruppe nehmen und einen vollständigen Ausfall erzeugen. Umgekehrt ist „HTTP 200“ unzureichend, wenn die kritische Route keine Datenbank, kein Zertifikat oder keine erforderliche Konfiguration verwenden kann. Dokumentiere, welche Route/Operation jedes Signal repräsentiert.

Passive Healthchecks brauchen ausreichend evidenzbasierte Schwellen. NGINX dokumentiert beispielhaft passive Fehlerversuche innerhalb eines Zeitfensters; andere Produkte haben aktive Checks, Outlier Detection oder eigene Semantik. Ein einzelner Timeout kann Netzwerkrauschen sein, ein zu langer Threshold schickt weiter Traffic zu einem echten Totalausfall. Health-Flapping verlangt Hysterese, Mindestdauer, Stabilisierung und eine Ursachenanalyse.

### Session Affinity und Stateful Workloads

Session Affinity hält zusammengehörige Anfragen bevorzugt bei demselben Ziel. Gründe können lokale Cachewärme, stateful Legacy-Session, Connection-bound Authentication oder Streamingkontext sein. Sie ist eine **Kosten- und Resilienzschuld**, wenn der Zustand nicht ersetzt/verteilt werden kann.

| Affinitätsmechanismus | Nutzen | Risiko |
|---|---|---|
| L4 5-tuple/Connection | natürliche Bindung einer Transportconnection | lange/ungleich verteilte Connections, kein Appsession-Modell. |
| Client IP Hash | leicht verfügbar | NAT, Mobilität, VPN/proxy, Privacy und Hot-Networks; nicht als verlässliche Nutzer-ID. |
| Cookie / signed token | route-/anwendungsbezogene Bindung | Key lifecycle, Datenschutz, Ausfall des Zieles, Manipulation/expiry. |
| Consistent hash key | Cache-/shard locality | Hot key, membership churn, key governance. |
| Application session store | stateless L7 routing möglich | central dependency, consistency/latency/cost. |
| Connection-bound auth | Kompatibilität für Legacy | pool/scale/drain constraints, security review. |

Affinität darf nie bedeuten, dass ein unhealthy/removed Ziel unbegrenzt neue Arbeit bekommt. Definiere Fallbackverhalten und die fachliche Wirkung, wenn die Bindung bricht. Ein mobile Client behind NAT can move; H3/QUIC introduces migration; an IP-derived affinity key can therefore degrade fairness and privacy.

## Architektur und Data Flow

### Layer 4 passthrough

```text
client TCP/TLS -> L4 LB chooses backend -> backend terminates TLS
```

Vorteil: Der Backenddienst bleibt TLS-Endpunkt. Grenzen: der LB kann ohne Termination HTTProute, Header oder Requestkosten nicht sehen. Eine lange Connection bleibt typischerweise am gewählten Backend.

### Layer 7 reverse proxy

```text
client TLS/H2 -> L7 LB terminates and parses -> chooses upstream -> new TLS/mTLS/H2 connection
```

Vorteil: Route-, Header-, Request-/Stream- und Statussignale können in den Vertrag einfließen. Grenzen: Der Proxy ist Klartext- und Headertrustgrenze, muss Buffer-/Pool-/TLS-/Capacity-/Privacy- und Parserupdates verantworten.

### Mehrstufige Verteilung

```text
global/edge route -> regional L4/L7 LB -> namespace/service proxy -> workload
```

Jede Stufe hat eine eigene Zielgruppe, Health- und Failure-Domain. Ein globaler Healthstatus darf nicht unbesehen in eine podlokale Readiness übersetzt werden. Umgekehrt kann ein lokales „ready“ den globalen Egress-/Zertifikat-/Datenresidenzpfad nicht beweisen.

## Konfiguration und Implementierung

### Abstrakter Load-Balancing-Vertrag

```yaml
route_group: orders-api
selection:
  layer: L7
  algorithm: least_active_requests
  weights: capacity-reviewed
eligibility:
  readiness: "route-specific readiness contract"
  max_inflight_requests_per_endpoint: 80
  zones: ["zone-a", "zone-b"]
affinity:
  mode: none
timeouts_and_retries:
  request_deadline: 2s
  retry: "idempotent operations and remaining budget only"
drain:
  no_new_work: true
  protocol_signal: "GOAWAY or connection-close semantics by hop"
  grace_period: 45s
  hard_cutoff: 120s
warmup:
  enabled: true
  ramp: 60s
observability:
  endpoint_selection: true
  queue_and_inflight: true
  health_transitions: true
  drain_events: true
```

Der Wert `80` ist illustrativ. Leite echte Concurrency, Gewicht und Grace Period aus SLO, CPU/Memory, Dependencybudget, maximaler Request-/Streamdauer, Connectiontyp und Recoveryfähigkeit ab. Aktuelle Produktdefaults müssen explizit gelesen und getestet werden.

### NGINX-Upstream als Konfigurationsmodell

```nginx
# Nicht ausführen. Beispiel zeigt Auswahl- und Connectionfragen, keine sichere Produktfreigabe.
upstream orders_backend {
    least_conn;

    server orders-a.internal max_conns=100;
    server orders-b.internal max_conns=100;

    # Keepalive/HTTP-Version/Connection semantics are version-dependent and need validation.
    keepalive 32;
}

server {
    location / {
        proxy_pass https://orders_backend;
        proxy_next_upstream error timeout;
    }
}
```

Das Modell erklärt nicht, ob ein Retry fachlich sicher ist. `proxy_next_upstream` muss mit Methode, Idempotency Key, Bodysendestatus, Deadline, Health und Endpointeffekt abgestimmt werden. `max_conns` kann je nach Produkt/Worker-/Shared-State-Semantik nicht die Gesamtanzahl aller physischen/inaktiven Verbindungen bedeuten. NGINX-Dokumentation weist ausdrücklich auf solche Kontextabhängigkeiten hin.

### Connection Draining

Ein kontrollierter Endpointwechsel hat Phasen:

```text
1. declare draining: no new eligible work
2. remove from discovery/selection consistently
3. signal protocol-specific graceful close
4. allow bounded completion of existing connections/streams
5. observe active work, errors, reconnects and deadline
6. cancel/terminate only at documented hard cutoff
7. confirm zero/accepted residual and remove endpoint
```

| Protokollklasse | Drainsignal | Besonderheit |
|---|---|---|
| HTTP/1.1 short requests | keine neue Upstreamwahl, Connection Close nach Response | Keepaliveclients brauchen neue Auswahl. |
| HTTP/2 / gRPC | `GOAWAY`, keine neuen Streams, bestehende bounded lassen | Stream IDs, retry and long RPC semantics prüfen. |
| HTTP/3 | H3/QUIC graceful connection handling | neue Streams/connection lifecycle and client fallback test. |
| WebSocket / long polling | application notification + bounded window | unbegrenzte Sessions brauchen Geschäftspolicy. |
| TCP long connection | L4 deregistration / connection drain | L4 sieht kein Requestende; cutoff kann disruptive sein. |

Draining ist nicht nur „Healthcheck fail“. Ein Endpoint mit `unhealthy` soll schnell keine Arbeit mehr erhalten; ein Endpoint mit `draining` ist absichtlich funktionsfähig und bekommt keine **neue** Arbeit. Wer beides vermischt, kann beim Deployment unnötig bestehende Nutzerunterhaltungen oder kritische Writes abbrechen.

### Warm-up und Slow Start

Neue Endpoints können Caches, JIT, Connection Pools, certificates, image layers, database connections or rate quotas aufbauen. Ein sofortiges volles Gewicht kann eine Kaskade aus Timeouts, Health Failures und Rückverteilung auslösen. Warm-up/slow start erhöht gezielt die Trafficzufuhr, bis Capacity-Evidenz vorliegt. Es darf einen echten Fehler nicht verdecken; kann ein Endpoint die minimale Readiness nicht bedienen, bleibt er ineligible.

## Scalability, Performance und Reliability

### Metriken

```text
lb_selection_total{route,algorithm,endpoint}
lb_inflight{endpoint,unit=connection|stream|request}
lb_queue_seconds{route}
lb_endpoint_response_seconds{endpoint,route}
lb_endpoint_errors_total{endpoint,class}
lb_health_state_transitions_total{endpoint,to_state}
lb_affinity_total{result=hit|miss|fallback}
lb_connection_drain_total{endpoint,phase}
lb_active_connections{endpoint,protocol}
lb_active_streams{endpoint,protocol}
lb_retry_total{route,reason}
```

Zusätzlich braucht eine Kapazitätsansicht CPU, Memory, worker queues, open sockets, TLS handshakes, buffer/disk, dependency saturation, autoscale events and zone distribution. Zähle nicht nur 5xx: eine hohe Queue oder unbalanced active streams kann vor der Fehlerwelle warnen.

### Troubleshooting

```text
uneven latency
  -> compare endpoint selection count AND work unit (bytes, CPU, streams, duration)
  -> inspect health/readiness transitions and warm-up
  -> inspect affinity distribution and hot keys
  -> inspect connection reuse/long-lived streams
  -> inspect client-edge, LB-upstream and dependency timing separately
```

| Symptom | Wahrscheinliche Klassen | Nächster Nachweis |
|---|---|---|
| ein Target heiß, andere idle | affinity/hot key, long connection, wrong weight, stale membership | active connections/streams/requests, key distribution, discovery generation. |
| alle Targets 200, aber SLO schlecht | queue, overload, dependency, unrepresentative health check | readiness contract, queue/service time, synthetic journey. |
| endpoints flappen | short thresholds, shared dependency, startup/resource pressure | health timeline, error class, dependency correlation, hysteresis. |
| deploy causes spike | no drain, no warm-up, connection recycle, retry storm | selection/drain/reconnect/retry events, client protocol. |
| long sessions block scale-in | L4 binding, WebSocket/RPC/stream lifecycle | session age, max duration, notification/cutoff policy. |
| sticky users see errors | target failed, affinity fallback missing | affinity key/expiry/health state, business session recovery. |
| load even by request but CPU uneven | work costs differ | CPU/bytes/dependency calls per route/class. |
| retry doubles writes | unknown endpoint result | method/idempotency/key/audit and sent-body state. |

## Security, Governance und Compliance

Load balancing directs potentially sensitive traffic. Apply these controls:

- Target membership and health endpoints require strong ownership and change control.
- Health endpoints expose only necessary state, avoid secrets/topology, and are network-/auth-restricted as appropriate.
- Layer 7 header-/clientidentity trust follows KB-0072; selection keys must not trust spoofable headers.
- Affinity cookies/tokens are integrity-protected, scoped, expiring, redacted and assessed for privacy.
- Source-IP affinity is not a user authentication mechanism.
- TLS/mTLS termination and upstream verification are validated for every selected endpoint class.
- Retry and failover for writes obey idempotency/transaction semantics, not availability pressure.
- Zone/region/tenant/data-residency policy constrains eligible targets before algorithm selection.
- DDoS/rate/connection/stream limits protect the balancer and targets.
- Managed LB/CDN contracts specify health, draining, logging, TLS, update, region, incident and evidence ownership.

A healthy endpoint is not automatically authorized for every tenant or data class. Eligibility must include the policy constraints that precede balancing.

## Cost und FinOps

Layer 4 often has lower per-request processing overhead but may retain more backend connection work and lose request-level optimization. Layer 7 can improve cache/routing/reuse and protect targets but adds termination, proxy CPU, buffer/disk, log, managed-gateway and operational cost. Affinity can improve cache locality but can strand capacity.

| Cost driver | Measurement |
|---|---|
| connections/handshakes | per protocol, client class, endpoint and deploy event. |
| L7 CPU/memory/buffering | route/body/response class and proxy hop. |
| target imbalance | capacity waste: max endpoint saturation vs fleet average. |
| failed health/retries | duplicate compute and cascading egress/dependency cost. |
| drain rollout | dual capacity, reconnect and temporary overlap. |
| cache/affinity | hit ratio and cost versus skew/availability risk. |
| managed LB/CDN | requests, rules, connections, data processed and egress. |

Compare cost with successful business outcome and tail SLO per cohort. A low LB bill can coexist with a high upstream or incident cost.

## Trade-offs und Anti-Patterns

| Decision | Advantage | Cost/Risk | Control |
|---|---|---|---|
| L4 passthrough | simple, original TLS endpoint | little request visibility, long connection pinning | backend capacity / connection drain. |
| L7 termination | route-aware selection | proxy security/privacy/CPU complexity | explicit trust and capacity contract. |
| Round Robin | simple, transparent | ignores work cost/duration | homogeneous short-work proof. |
| Least Connections | handles long simple connections | H2/H3 multiplexing hides streams | stream/request metrics. |
| Latency-aware | responds to slow endpoints | feedback/cold-start instability | smoothing/hysteresis and experiments. |
| Affinity | locality/session compatibility | skew and target dependency | bounded key and state recovery. |
| Active health | faster readiness signal | synthetic false certainty | route-specific contract. |
| Passive health | real user evidence | too late/noisy at low traffic | combine carefully. |
| Fast drain | quick rollout | aborts long work | grace/cutoff/idempotency plan. |

**Anti-Patterns**

- Connections, requests, streams, CPU and bytes als dieselbe Lastgröße behandeln.
- Layer 4 für pro-HTTProute-/tenant-/headerbasierte Verteilung verantwortlich machen.
- Layer 7 aktivieren, ohne TLS-, Header-, Buffer-, Privacy- und Capacityvertrag.
- `200 /health` als Beweis für jede kritische Route betrachten.
- Eine optionale, nicht kritische Dependency in Readiness aufnehmen und dadurch die ganze Fleet entfernen.
- Session Affinity mit Source IP als dauerhafte Nutzeridentität oder Sicherheitskontrolle nutzen.
- Weight, threshold, slow start or health timeout aus einer Produktdokumentation als globale Wahrheit kopieren.
- Endpoint aus Health entfernen und sofort alle Connections hart beenden.
- Retry/Failover von Writes im LB konfigurieren, ohne fachlichen Effekt zu kontrollieren.
- Backupziele nie unter realistischer Last oder Draining testen.

## Staff-Level Decisions

Ein Staff-/Principal-Entscheidungsrecord beantwortet:

1. Welche Arbeitseinheit wird wo verteilt: Connection, Stream, Request, Session oder Shard?
2. Welche Layer-4-/Layer-7-Topologie, TLS-/mTLS- und Proxygrenze hat jeder Hop?
3. Welcher Algorithmus passt zu Kosten/Dauer/Parallelität/Locality, welche Daten beweisen diese Annahme?
4. Welche Zielgruppen-/Zone-/Tenant-/Datenresidenz-/Versionpolicy definiert Eligibility?
5. Welche Liveness-, Readiness-, passive- and synthetic signals existieren, mit welchen Schwellen, Hysterese, Owner und Failure-Domain?
6. Ist Affinität nötig, welcher Key ist geschützt/privat, wie ist Churn/Targetausfall fachlich beherrscht?
7. Wie sind `max_inflight`, queue, timeouts, retries, outlier/circuit rules and warm-up calibrated?
8. Wie drainen H1/H2/H3/gRPC/TCP/long-lived protocols ohne unkontrollierte Abbrüche?
9. Welche SLO-/Cost-/Safety-Metrics beweisen, dass kein Endpoint oder Clientcohort verdeckt benachteiligt ist?

## Chief-Level Decisions

Chief-Level etabliert Traffic Management als Plattformstandard:

- Einheitliche Begriffe, minimal sichere Defaults und Ownership für Target Membership, Health, Readiness, Affinity, retry, drain and emergency traffic shifts.
- Anforderungen an Cloud LB, CDN, API Gateway, Service Mesh and application teams for TLS/identity, header trust, health semantics, logging, privacy, patch and incident evidence.
- Capacity funding for deploy overlap, zone loss, long connections, backup targets, tests and global failover rather than average request rate only.
- Limits on session affinity and source-IP use, with state externalization or a documented recovery path as strategic direction.
- Governance for health endpoint exposure, data residency, tenant isolation and supplier operational dependencies.
- Executive metrics that surface endpoint skew, health flapping, drain aborts, retry duplicate effects, tail SLO, cost per success and exception age.

## Production Checklist

- [ ] Work unit, Layer, protocol, TLS/termination and target group are documented for each traffic class.
- [ ] Eligibility includes readiness, security, data residency/tenant/zone and capacity policy.
- [ ] Algorithm and weights have representative workload evidence, not only equal-request tests.
- [ ] L4 connection, L7 request and H2/H3 stream metrics are all visible where relevant.
- [ ] Health checks distinguish liveness/readiness/passive/synthetic signals, thresholds, hysteresis and owners.
- [ ] Health endpoints are safe, restricted and do not reveal unnecessary internals.
- [ ] Affinity is justified, protected, privacy-reviewed, bounded and has a target-loss recovery path.
- [ ] Max connections/streams/inflight/queue/body/timeouts/rates align with endpoint capacity and dependency budgets.
- [ ] Retry/failover obey method, idempotency, sent-body state and remaining deadline.
- [ ] Warm-up, scale-out, membership/discovery changes, zone loss and backup targets are tested.
- [ ] Draining disables new work, signals protocol-specific closure, observes completion and has grace/hard cutoff.
- [ ] L7 header identity trust, logs, cache and cleartext zones satisfy the proxy contract in KB-0072.

## Interviewfragen mit Antworten

### 1. Wann ist Layer 4 besser als Layer 7?

Layer 4 fits when transport-level selection and passthrough meet the required routing/security model, such as generic TCP/UDP or original TLS termination at the backend. Layer 7 is needed when routing, control or measurement relies on application semantics. “Better” depends on required visibility and operational cost.

### 2. Why can least connections be misleading for HTTP/2?

A single HTTP/2 connection can multiplex many active streams. An L4 counter may see one connection although it carries substantial work. Per-stream/request, bytes, CPU and duration signals can be more representative.

### 3. What is the difference between readiness and liveness?

Liveness asks whether the component is alive enough to respond. Readiness asks whether it should receive a specified class of new traffic now. A process can be live but not ready during startup, drain, overload or missing critical configuration.

### 4. Why is IP affinity fragile?

Many clients share NAT/proxy addresses, mobile clients change network, IPv6 and VPN behavior vary, and the IP is sensitive personal/network data. It should not be treated as a stable user identity or a security credential.

### 5. What does connection draining require for HTTP/2?

Stop accepting new eligible work, signal graceful connection handling such as GOAWAY as appropriate, allow bounded existing streams, and implement safe retry/idempotency behavior. A hard close alone can abort long RPCs and produce unknown results.

### 6. Why can an active health check still be insufficient?

It only proves its declared synthetic interaction. A simple 200 may not exercise a critical route, authorization, certificate, required datastore or actual client path. Combine signals based on a documented failure model.

### 7. Why are weights not a capacity plan?

A weight expresses a relative selection preference, usually based on assumptions. It does not model current CPU, requests, streams, dependency saturation, queue, warm-up or endpoint failure. Revalidate weights under actual load.

## Praktisches Lab: Lokales Auswahl- und Drainingmodell

**Zweck:** Vergleiche Auswahlregeln, ungleiche Arbeit und Endpointzustände ohne echte Requests oder Infrastruktur.

```python
from dataclasses import dataclass

@dataclass
class Endpoint:
    name: str
    active_connections: int
    active_requests: int
    healthy: bool
    draining: bool
    weight: int = 1

def eligible(e: Endpoint) -> bool:
    return e.healthy and not e.draining

def least_active_request(endpoints: list[Endpoint]) -> str:
    choices = [e for e in endpoints if eligible(e)]
    if not choices:
        return "NO_ENDPOINT"
    return min(choices, key=lambda e: (e.active_requests, e.active_connections)).name

def start_drain(e: Endpoint) -> str:
    e.draining = True
    return f"{e.name}: no new work; existing work must finish or hit cutoff"
```

Fallarbeit:

1. Zwei Endpoints haben je eine Connection; einer hat 50 H2-Streams, der andere einen kurzen Request. Diskutiere, warum `least_connections` unzureichend sein kann.
2. Markiere einen Endpoint als `draining`; neue Auswahl darf ihn nicht wählen, vorhandene Arbeit wird nicht automatisch beendet.
3. Markiere alle Endpoints als `healthy=False`; das Ergebnis soll eine klar definierte Überlast-/Fehlerreaktion sein, nicht eine zufällige Zielauswahl.
4. Ergänze unterschiedliche CPUkosten pro Request und vergleiche Round Robin mit requestcount.
5. Ergänze einen Hot-Affinity-Key und diskutiere Skew, Targetausfall und Recovery.
6. Zeichne einen H2-GOAWAY- und einen WebSocket-Drain mit Grace Period und Hard Cutoff.
7. Beschreibe für eine nicht-idempotente Operation, warum ein Retry nach LB-Timeout kein algorithmischer Standardfall ist.

**Aufräumen:** Lösche temporäre lokale Dateien/Interpreterzustand. Es werden keine Pakete, Sockets, DNS, TLS, Proxy-, NGINX/Envoy-/Load-Balancer-, Container-, Cloud-, Netzwerk- oder Produktionssysteme verwendet oder verändert.

## Dependencies und Cross-References

| Beziehung | Datei | Zweck |
|---|---|---|
| Requires | [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Last-/Fehlerhypothesen. |
| Requires | [KB-0056](08-tcp-verbindungen-und-ueberlastkontrolle.md) | Connections, Stau und Dauer. |
| Requires | [KB-0069](21-http-2-und-multiplexing.md) | Streams und GOAWAY. |
| Requires | [KB-0072](24-forward-und-reverse-proxies.md) | Proxy-/Upstreampool-/Trustkontext. |
| Applies to | KB-0074 | Health, resiliency and incident design. |
| Applies to | KB-0075 | API-/Gateway-/service traffic policy. |
| Applies to | KB-0418 | Plattformtrafficmanagement. |
| Applies to | KB-0562 | Cloud-/Edge-/Netzwerktraffic. |
| Applies to | KB-0720 | Enterprise-/Chief-Level-Governance. |

## Quellen und Aktualitätsgrenze

**Recherche-Cutoff: 2026-09-16.** Load-Balancer-/CDN-/Gateway-/Mesh-/Cloudproduktalgorithmen, Health-/drain-/connection-pool-Defaults, Lizenzumfang und Versionen ändern sich. Vor Produktnutzung sind aktuelle Herstellerdokumentation, reale Topologie und Last-/Fehler-/Drainingtests maßgeblich.

1. [NGINX: Using nginx as HTTP Load Balancer](https://nginx.org/en/docs/http/load_balancing.html) — Round Robin, Least Connections, IP Hash, Gewichte und passive Healthchecks als Produktbeispiele.
2. [NGINX `ngx_http_upstream_module`](https://nginx.org/en/docs/http/ngx_http_upstream_module.html) — Upstreammembership, limits, hash, keepalive, states and draining product semantics.
3. [Envoy Load Balancing Overview](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/overview) — aktuelle Produktperspektive auf Zielauswahl.
4. [Envoy Connection Pooling](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/connection_pooling) — aktuelle Produktperspektive auf Upstreampools und Protokollgrenzen.
5. [KB-0056](08-tcp-verbindungen-und-ueberlastkontrolle.md), [KB-0069](21-http-2-und-multiplexing.md) und [KB-0072](24-forward-und-reverse-proxies.md) — kanonischer lokaler Lernkontext.

## Bonus: New Tech and Innovations

Adaptive Load Balancing kombiniert per-Endpoint-Telemetrie, Queue-/Latenzsignale, Outlier Detection, locality-aware routing, consistent hashing and controlled slow start. Service Meshes, Gateway APIs, eBPF-basierte Sicht und HTTP/3 verändern, welche Signale an welchem Hop verfügbar sind; sie ersetzen weder eine repräsentative Capacity Unit noch einen sicheren Readiness-/Drainvertrag.

KI-gestützte Anomalieerkennung kann Health-Flapping oder Hot-Shard-Muster früher markieren, darf aber nicht ohne begrenzte, erklärbare und rückrollbare Policy autonom Traffic umleiten. Ein Pilot akzeptiert eine Traffic-Management-Innovation erst, wenn Arbeitseinheit, Layer/Terminierung, Zielgruppen-/Health-/Readinesssemantik, Auswahl-/Affinity-/Warm-up-/Limit-/Retry-/Drainpolicy, ungleiche Last und lange Connections, Security/Privacy, Capacity/Cost, Client-/Endpointkompatibilität, Observability, Incidentführung und Rollback nachgewiesen sind.

