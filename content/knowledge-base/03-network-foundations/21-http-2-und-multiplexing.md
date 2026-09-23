---
{"id": "KB-0069", "title": "HTTP-2 und Multiplexing", "domain": "03", "sequence": 21, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Fehlersuche", "Lastprofil"], "needed_for": "both"}, {"id": "KB-0056", "concepts": ["TCP-Bytestrom", "Paketverlust", "Überlastkontrolle"], "needed_for": "both"}, {"id": "KB-0067", "concepts": ["TLS", "ALPN", "Terminierung"], "needed_for": "both"}, {"id": "KB-0068", "concepts": ["HTTP-Semantik", "Authority", "Proxy", "Connection-Reuse"], "needed_for": "both"}], "related": ["KB-0070", "KB-0071", "KB-0418", "KB-0562", "KB-0720"], "applies": ["KB-0070", "KB-0418", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Das Lab simuliert in einer lokalen Python-Datenstruktur Streamfenster, Frame-Reihenfolge, Queueing und Verbindungs- versus Streamfehler. Es öffnet keine Verbindung und implementiert keinen HTTP/2-Parser.", "rationale": "Es trainiert Modell, Budget und negative Fallarbeit, ohne Frames, TLS, Clients, Server oder Infrastruktur zu erzeugen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein HTTP/2-Vertrag definiert ALPN/Terminierung, Client- und Backend-Protokoll pro Hop, maximale Connections/Streams/Frames/Header/Body, Stream- und Connection-Flow-Control, Timeouts, GOAWAY/Drain, Priorisierung, Server-Push-Policy, Headerkompressionsgrenzen, Telemetrie und Fallback.", "rationale": "Multiplexing ist nur innerhalb einer bestimmten HTTP/2-TCP-Verbindung wirksam und fügt verbindungsweite Ressourcen, Fehlerdomänen und Rückstau hinzu."}, "STAFF-TARGET": {"active": true, "scope": "Teams testen HTTP/1.1-, HTTP/2- und Proxykombinationen gegen repräsentative Lastprofile, messen concurrent streams, Window-Stalls, Frame-/Reset-/GOAWAY-Fehler, Headergrößen, Queueing, Latenz und CPU/Memory und führen Drains mit echter Clientmatrix aus.", "rationale": "Sie unterscheiden Anwendungs-HOL, TCP-HOL, Stream-Flow-Control, Connection-Flow-Control, Headerkompression, Proxy-Übersetzung, Lastspitze und Transportverlust anhand von Evidenz."}, "CHIEF-TARGET": {"active": true, "scope": "Die Organisation steuert HTTP-Versionen, API-Gateway-/Mesh-Policies, Limits und Parserpatches, Terminierungs-/Datenschutzgrenzen, Kosten und Kapazität, Ausnahmen und die sichere Migration zu HTTP/2/HTTP/3 als Plattformstandard.", "rationale": "Eine falsche globalisierte Stream-/Header-/Reset-Policy oder eine ungetestete Protokollumstellung kann viele Dienste gleichzeitig überlasten, Sicherheitsgrenzen verschieben oder Kompatibilität beeinträchtigen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Binäres Frame-Parsing, HPACK-Encoder/Decoder-Internals, Huffman-Coding, RFC-ABNF, TCP-Socket-/Kernel-Tuning, CDN-/Envoy/NGINX/HAProxy-Parameter, Angriffsforschung und Implementierungsprofiling sind Spezialistentiefe.", "rationale": "Die Zielrollen müssen Zielprofil, Sicherheits- und Fehlergrenzen sowie betriebliche Nachweise vorgeben; produktspezifische Parser- und Runtimeoptimierung erfolgt mit Plattform-, Security- und Netzwerk-Spezialisten."}}, "lab_validation": [{"lab_id": "KB-0069-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox ohne Netzwerkzugriff", "evidence": "Ein deklaratives Modell prüft Stream- versus Connectionfenster, Begrenzung gleichzeitiger Streams, DATA-Queueing, RST_STREAM, GOAWAY und unzulässige Framegröße als Fallarbeit.", "limitations": "Nicht ausgeführt; kein HTTP/2-Frame, Socket, TLS/ALPN, Webserver, Proxy, Gateway, Cache, Cloud-, Netzwerk- oder Produktionssystem wurde verwendet oder verändert."}]}
---
# HTTP-2 und Multiplexing

> **Ziel:** HTTP/2 überträgt mehrere unabhängige HTTP-Austausche als Streams auf einer TCP-Verbindung. Das reduziert HTTP/1.1-Anwendungskopfblockierung und redundante Header, ersetzt aber weder TCP-Verlustblockierung noch Capacity-, Timeout-, Security- oder Proxydesign.

## Purpose, Definition und Scope

HTTP/2 ist eine binäre Abbildung der HTTP-Semantik auf eine verbindungsorientierte Transportverbindung. Es nutzt Frames, Streams, Feldkompression und Flow Control. Mehrere Requests und Responses können gleichzeitig auf Streams einer Verbindung fortschreiten; Frames werden ineinander verschachtelt. RFC 9113 obsoletiert RFC 7540 und RFC 8740 und definiert die aktuelle HTTP/2-Basisspezifikation.

Dieses Kapitel erklärt Streams, Frames, Header-Kompression, Flow Control, Priorisierung, Fehlerdomänen und Übergänge über Proxies. Es vergleicht HTTP/2 mit HTTP/1.1 anhand von Lastprofilen und zeigt die TCP-bedingte Grenze: Verlorene TCP-Segmente blockieren die geordnete Auslieferung späterer Bytes der **ganzen** TCP-Verbindung. HTTP/3 mit QUIC wird separat behandelt. Dieses Kapitel implementiert keinen Parser und macht keine Produkt- oder Clientkompatibilitätszusage.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Streams erlauben parallele HTTP-Austausche innerhalb einer Verbindung; Frames und Flussfenster steuern ihren Fortschritt. |
| HANDS-ON-TARGET | Lokale Modellfälle zu Fenstern, Frames, GOAWAY und Fehlerdomänen ohne Netzwerkzugriff. |
| ARCHITECT-TARGET | Pro Hop werden ALPN, Terminierung, Limits, Flow Control, Timeouts, Drain, Telemetrie und Fallback festgelegt. |
| STAFF/PRINCIPAL | Last- und Negativtests trennen Streamstau, TCP-HOL, Proxyübersetzung und Ressourcenerschöpfung. |
| CHIEF | Ein versionierter HTTP-Plattformstandard verbindet Sicherheit, Kapazität, Governance, Kosten und Migration. |

## Mental Model: Mehrere markierte Gespräche in einem geordneten Rohr

```text
one TCP + TLS + HTTP/2 connection
  stream 1: HEADERS, DATA, DATA ...
  stream 3: HEADERS, DATA ...
  stream 5: HEADERS, DATA ...
wire order:  [1:H] [3:H] [1:D] [5:H] [3:D] [1:D] ...
```

Jeder Frame trägt einen Stream Identifier; Stream 0 ist für verbindungsweite Frames. Daraus folgt:

```text
application exchange
  -> one stream id
  -> HEADERS and optional DATA frames
  -> per-stream and connection flow-control budget
  -> stream finishes, resets, or errors
  -> connection remains usable unless a connection-level error/GOAWAY occurs
```

HTTP/2 löst die HTTP/1.1-Frage „darf Request B auf dieser Verbindung beginnen, während Request A wartet?“ besser: B erhält einen eigenen Stream. Es löst nicht die Frage „kann TCP Byte N+1 an die Anwendung liefern, wenn Byte N im Netz verloren ging?“ Das bleibt durch den zuverlässigen, geordneten TCP-Bytestrom verbindungsweit blockiert.

## Prerequisites und Dependencies

| ID | Art | Warum sie hier nötig ist |
|---|---|---|
| [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Verständnis und Lab | Lastprofile, Hypothesen und Beweise. |
| [KB-0056](08-tcp-verbindungen-und-ueberlastkontrolle.md) | Verständnis und Lab | TCP-Verlust, geordnete Zustellung und Überlastkontrolle. |
| [KB-0067](19-tls-verbindungen-und-zertifikatspruefung.md) | Verständnis und Lab | HTTPS, ALPN, TLS-Endpunkt und Terminierung. |
| [KB-0068](20-http-1-1-und-verbindungsnutzung.md) | Verständnis und Lab | HTTP-Semantik, Authority, Proxy und HTTP/1.1-Vergleich. |

## Core Concepts

### Start einer HTTP/2-Verbindung: ALPN, Preface und SETTINGS

Bei `https` wird HTTP/2 normalerweise während des TLS-Handshakes mit ALPN als `h2` ausgehandelt. Der Client bietet unterstützte Anwendungsprotokolle an, der Server wählt eines oder lehnt ab. Das TLS- und Zertifikatsvertrauen bleibt Voraussetzung; `h2` ist kein Sicherheitsersatz und keine Aussage über den Backend-Hop.

```text
client                                  edge/server
TLS ClientHello: ALPN [h2, http/1.1]  ->
                          <- TLS ServerHello: selected h2
TLS channel established
client preface + SETTINGS               ->
                          <- server SETTINGS
SETTINGS ACKs exchanged
streams can carry HTTP semantics
```

HTTP/2 over TLS verwendet `h2`. Der frühere HTTP/1.1-Upgrade-Token `h2c` und das `HTTP2-Settings`-Headerfeld sind in RFC 9113 deprecated, weil sie nicht breit eingesetzt wurden. Cleartext HTTP/2 braucht vorab bekannte Unterstützung; eine allgemeine Architektur soll sie nicht als stillen Fallback annehmen. An jedem Proxyhop kann eine andere Aushandlung gelten: Client–Edge kann HTTP/2 sein, Edge–Backend HTTP/1.1 oder umgekehrt.

`SETTINGS` benennt Verbindungseigenschaften, etwa maximale konkurrierende Streams, Header Table Size, Initial Window Size oder Max Frame Size. Einstellungen haben Richtung und Zeitpunkt: Ein Endpunkt darf nicht so tun, als hätte der andere eine neue Einstellung bereits bestätigt, wenn deren Wirksamkeit noch nicht erreicht ist.

### Frames, Streams und Zustände

Ein HTTP/2-Frame hat einen festen 9-Oktett-Header mit Payload-Länge, Typ, Flags und 31-Bit-Stream-ID sowie typabhängiger Nutzlast. Relevante Framearten:

| Frame | Scope | Zweck |
|---|---|---|
| `SETTINGS` | Verbindung | Aushandlung von Limits und Parametern. |
| `HEADERS` / `CONTINUATION` | Stream | komprimierte Feldsektion, Pseudo-Headers und normale Header. |
| `DATA` | Stream | Content Bytes, unterliegt Flow Control. |
| `WINDOW_UPDATE` | Stream oder Verbindung | gibt Empfängerbudget wieder frei. |
| `RST_STREAM` | Stream | beendet genau einen Stream mit Fehlercode. |
| `GOAWAY` | Verbindung | kontrolliertes Beenden/Draining der Verbindung. |
| `PING` | Verbindung | Liveness-/RTT-bezogene Kontrollnachricht, kein Anwendungs-Healthcheck. |
| `PRIORITY_UPDATE` | Verbindung / Zielstream | moderne Prioritätsinformation gemäß Erweiterung. |
| `PUSH_PROMISE` | Stream | optionaler Server Push; nicht als universell verfügbar annehmen. |

Ein Stream hat einen Lebenszyklus, etwa idle, open, half-closed und closed. Stream IDs folgen festen Regeln, unter anderem unterscheiden ungerade und gerade IDs die von Client bzw. Server initiierten Streams. Die Laufzeitbibliothek verwaltet den Zustandsautomaten. Architektur muss jedoch Limits und die Aussage „dieser Fehler betrifft einen Stream oder die gesamte Verbindung“ verstehen.

```text
stream 7:
  HEADERS -> open
  DATA -> open
  END_STREAM -> half closed / closed
  RST_STREAM -> closed immediately for this stream
connection:
  GOAWAY -> no new streams after advertised last id; drain eligible work
```

Ein `RST_STREAM` ist nicht gleichbedeutend mit „die Anfrage hat nicht gewirkt“. Bei einer nicht-idempotenten Operation kann das Backend die Aktion bereits ausgeführt haben, obwohl die Antwort oder der Stream abgebrochen wurde. Retry benötigt daher weiterhin Methoden-, Idempotency-Key-, Fehler- und Budgetsemantik.

### Pseudo-Headers und HTTP-Semantik

HTTP/2 kodiert bekannte HTTP-Informationen als Pseudo-Headers wie `:method`, `:scheme`, `:authority` und `:path`. Sie erscheinen vor regulären Feldzeilen; die genaue Mapping-Regel ist strikt. Ein Gateway darf einen Host-/Authority-Konflikt nicht nach Belieben auflösen. HTTP-Semantik — Methode, Status, Authentisierung, Cache-Control, Content Type, Retry- und Datenschutzvertrag — bleibt erhalten; sie wird nur binär anders transportiert.

```text
HTTP/1.1:
GET /v1/items HTTP/1.1
Host: api.example.com

HTTP/2 field section:
:method = GET
:scheme = https
:authority = api.example.com
:path = /v1/items
```

Nicht jede HTTP/1.1-Feldzeile kann unverändert übertragen werden. Connection-spezifische/hop-by-hop Informationen sind nicht einfach Ende-zu-Ende. Ein Intermediary, der beide Seiten als HTTP verarbeitet, hat auf jedem Hop eine eigene Protokollverantwortung.

### HPACK: Feldkompression mit Zustand und Grenzen

HTTP/2 verwendet HPACK für Feldsektion-Kompression. Encoder und Decoder teilen pro Verbindung einen dynamischen Tabellenkontext; Wiederholungen können dadurch kleiner übertragen werden. Headerkompression verkleinert nicht automatisch Speicher oder Angriffsfäche. Dynamische Tabellen, komprimierte Eingaben und später dekomprimierte Feldwerte benötigen klare Grenzen.

```text
field section -> HPACK encoder context -> compressed field block
                             network
compressed field block -> HPACK decoder context -> field section
```

Kontrolliere mindestens:

- maximale Header Field-/Field-Section-Größe und Feldanzahl;
- maximale dynamische Header Table und vollständige Speicherrechnung;
- Decoder-/CPU-Budgets und Zeitlimits für ungewöhnliche Field Blocks;
- Versionen/Patches der HTTP/2-Implementierung;
- Logredaktion, denn nach Dekodierung können Tokens, Cookies und personenbezogene Werte sichtbar sein;
- gleichwertige Limits an Edge, Mesh, Gateway und Backend, damit kein Hop eine vorher abgewehrte Last wieder zulässt.

Das Dynamikmodell macht die Verbindung zu einer Ressource mit mehr Zustand als ein einzelner HTTP/1.1-Request. Ein Load Balancer kann Streamlast, Header-/Memorylast und CPU nicht allein aus Requestzahl schätzen.

### Flow Control: Empfängerbudget statt Durchsatzgarantie

HTTP/2-Flow Control ist kreditbasiert und gilt für `DATA`-Frames. Es existiert ein Fenster für die gesamte Verbindung und ein Fenster je Stream. Der Sender darf nur Daten senden, für die **beide** Fenster Budget haben. Der Empfänger sendet `WINDOW_UPDATE`, wenn er Kapazität freigibt.

```text
effective_data_budget(stream 11)
  = min(connection_send_window, stream_11_send_window)

sender sends DATA n bytes
  -> connection window -= n
  -> stream 11 window -= n
receiver consumes bytes
  -> WINDOW_UPDATE stream 11 and/or connection
```

Flow Control ist nicht TCP-Überlastkontrolle und nicht Anwendungsbackpressure in voller Breite. TCP schützt das Netz und garantiert geordnete Zustellung; HTTP/2 schützt den Empfänger vor zu viel ungepuffertem Content auf Verbindung/Stream. Anwendung, Proxybuffer, Message Broker oder Datenbank benötigen weiterhin ihre eigenen Budgets und Cancel-Semantik.

| Problem | Beispiel | Nötige Evidenz |
|---|---|---|
| Streamfenster erschöpft | großer Upload zu Stream 7 hält nur diesen Content an | Streamfenster, consumer rate, `WINDOW_UPDATE`-Verlauf |
| Connectionfenster erschöpft | ein oder mehrere große Streams blockieren alle neuen DATA | Connection window, aktive Streams, Scheduler, Bytes/stream |
| CPU/Decoder begrenzt | kleine Frames, viele Header/Streams erzeugen Overhead | frame rate, header size, CPU, memory, reset/errors |
| TCP Verlust | Segmentverlust enthält Frames mehrerer Streams | Retransmits/RTT, TCP metrics, client/edge timing |
| langsamer Client | Client konsumiert Response nicht | egress window, downstream queue, stream cancellation |

### Multiplexing, Priorität und Fairness

Frames verschiedener Streams können verschachtelt werden. Das bedeutet nicht, dass jeder Stream fair oder priorisiert fortschreitet. Ein Scheduler muss sich zwischen kleinen Latenzantworten, großen Downloads, Server-Sent Events/Streaming, Control Frames und Clientprioritäten verhalten. Zu große Frames können zeitkritische Frames hinter sich auf dem Sendepfad verzögern; zu kleine Frames erhöhen Overhead.

Die frühere HTTP/2-Tree-Priorisierung ist in RFC 9113 deprecated. RFC 9218 definiert ein erweiterbares Priorisierungsschema für HTTP, einschließlich Dringlichkeit (`u`) und Incremental-Flag (`i`). Priorität ist ein Hinweis, keine Garantie. Plattformen dürfen die Signale ignorieren, vereinfachen oder nur in bestimmten Hops anwenden; Client- oder Endbenutzerprioritäten dürfen nicht unkontrolliert Ressourcenhoheit überschreiben.

```text
route class      suggested policy
interactive API  high urgency, small bounded responses
HTML/document    high initial urgency
image/video      incremental, fair sharing
bulk export      lower urgency, cancellable, separate capacity class
```

Teste Priorisierung mit realistischen konkurrierenden Lastprofilen. Eine Lab-Demo mit zwei kleinen Requests beweist nicht, dass ein Gateway unter Paketverlust, großen Streams, vielen Clients und Rückstau die gewünschte Nutzererfahrung liefert.

### Server Push und moderne Alternativen

HTTP/2 Server Push ist optional. Der Server kann mit `PUSH_PROMISE` eine synthetische Request/Response-Verarbeitung anstoßen, bevor der Client sie explizit anfragt. Es kann Round Trips sparen, aber Cachezustand, Browser-/Clientunterstützung, Bandbreite, Priorisierung und Observability machen die Wirkung unsicher. Plane daher nicht auf Server Push als universellen Beschleuniger.

Bevorzuge einen messbaren Ressourcenvertrag: korrekte Cache-Hinweise, Preload-/Fetch-Strategie auf Anwendungsebene, HTTP/2/3-kompatible Priorität, Bundle-/Assetdesign und kontrollierte Experimente. Ein Push, der bereits gecachte oder nicht benötigte Bytes sendet, verschlechtert Kosten und kritische Latenz.

## Architektur und Data Flow

### Protokoll kann pro Hop wechseln

```text
browser -- TLS ALPN h2 --> edge gateway -- h2 --> mesh proxy -- http/1.1 --> service
                                        \-- separate pool --> identity provider
```

Ein h2-Client sieht nur seine Verbindung zum Edge. Der Edge kann Backends anders ansprechen. Daraus folgen getrennte Pools, Streams, Limits, TLS-Identitäten, Fehlerdomänen und Telemetrie pro Hop.

| Hop | Muss dokumentiert werden |
|---|---|
| Client → Edge | ALPN, TLS, max streams, request limits, timeout, h2 policy, authority. |
| Edge → Mesh/Backend | gewähltes Protokoll, pool/sharing, stream-/connectionlimits, mTLS, retry/drain. |
| Mesh → Service | Backend capability, request mapping, backpressure, response streaming, cancellation. |
| Service → Dependency | separate client policy, IDs/deadlines, isolation vom eingehenden stream. |

Ein Gateway darf eine eingehende Stream-ID nicht als globale Correlation-ID oder Autorisierungsidentität behandeln. Sie ist nur lokal für diese Verbindung. Verwende einen validierten Request-/Trace-Kontext, ohne Tokens oder personenbezogene Inhalte ungeprüft zu übertragen.

### Draining mit GOAWAY

`GOAWAY` signalisiert, dass keine neuen Streams über eine Verbindung angenommen werden sollen, und enthält den letzten verarbeiteten Stream-Identifier. Ein kontrollierter Rollout oder Shutdown nutzt GOAWAY, setzt Deadlines, lässt geeignete Streams enden und zwingt Clients danach auf neue Connections. Es ist kein garantierter Abschluss jeder Geschäftsoperation.

```text
announce drain
  -> stop accepting new connections at load balancer when appropriate
  -> send GOAWAY with last accepted stream id
  -> allow bounded completion of eligible streams
  -> cancel/close after deadline
  -> correlate retried vs possibly processed operations
```

Client und Server brauchen eine klare Retrysemantik für Streams oberhalb des `last-stream-id` und für ungeklärte Abbrüche. Idempotency Keys oder fachliche Deduplizierung können für schreibende Vorgänge nötig sein.

## Konfiguration und Implementierung

### Abstrakter Protokollvertrag

```yaml
route_group: public-api
client_hop:
  protocol: ["h2", "http/1.1"]
  tls_alpn: ["h2", "http/1.1"]
  max_concurrent_streams: 100
  max_header_bytes: 32768
  max_body_bytes: 10485760
  initial_stream_window: "documented-platform-default"
  idle_timeout: 60s
backend_hop:
  protocol: "h2"
  max_connections_per_endpoint: 20
  max_concurrent_streams: 50
  connect_timeout: 200ms
  response_headers_timeout: 1500ms
drain:
  goaway_enabled: true
  grace_period: 20s
security:
  reject_invalid_frame_state: true
  header_limit_enforced_all_hops: true
  server_push: disabled
```

Dies ist ein Architekturmodell, keine Produktsyntax. Die genaue Bedeutung von `max_concurrent_streams`, Window Defaults, Headergrenzen, Frame-/Reset-Ratelimits, GOAWAY und Draining unterscheidet sich zwischen Runtime, Gateway und Version. Ein Default ist erst nach Herstellerdokumentation und Lasttest eine Policy.

### Timeout- und Cancellation-Vertrag

Multiplexing verändert Timeoutfragen. Ein abgelaufener Stream soll nicht eine gesamte Connection töten, sofern der Fehler streamlokal bleibt. Ein Connectionfehler betrifft dagegen viele parallele Requests. Definiere:

- End-to-End Deadline und verbleibendes Budget je Hop;
- Header-, Body-, Stream-idle-, Connection-idle-, Pool-queue- und Drain-Timeout;
- wer bei Client-Cancel den Upstream abbricht;
- wie auf dem Backend laufende Arbeit begrenzt/kompensiert wird;
- ob ein RST oder Connection Close eine Wiederholung erlaubt;
- wie gRPC- oder Streaming-Protokolle ihre Rückstau- und Cancel-Semantik abbilden.

Eine lange lebende Streaming-Antwort kann eine Stream-Slot- und Connection-Window-Kapazität beeinflussen. Isoliere solche Routen, maximiere nicht pauschal alle Limits und messe ihre Ressourcennutzung unter realer Konsumrate.

## Scalability, Performance und Reliability

### Vergleich nach Lastprofil

| Lastprofil | HTTP/1.1 | HTTP/2 | Entscheidungsfrage |
|---|---|---|---|
| viele kleine parallele API-Aufrufe | mehrere Connections/Pools nötig | Streams reduzieren Connection-Churn und Anwendung-HOL | Welche Clients/Gateways nutzen h2 wirklich? |
| einzelne große Downloads | eine Connection kann andere Arbeit blockieren | Scheduler/Flow Control helfen, aber TCP-Verlust bleibt verbindungsweit | Separate Asset-/Bulkklasse sinnvoll? |
| hoher Headeranteil | wiederholte Headerbytes | HPACK kann Übertragung senken | Wie bleiben Header-/Memory-Limits sicher? |
| Paketverlust/Mobilfunk | jede TCP-Connection betroffen | mehrere h2 streams teilen TCP-HOL | Bringt HTTP/3 in der realen Pfadmatrix einen Wert? |
| viele long-lived streams | viele H1 Sockets | Streams sparen Sockets, beanspruchen Stream-/Window-/Memorylimits | Wie werden Drain und Fairness garantiert? |
| heterogene Proxies | breite Legacyunterstützung | Übersetzung/ALPN/Backendh2 muss getestet werden | Welche Hops verhalten sich tatsächlich h2-konform? |

HTTP/2 kann Tail-Latenz senken, kann sie aber auch durch übervolle einzelne Connections oder verbindungsweite TCP-Verluste konzentrieren. Verwende Lastprofile mit parallelen kleinen Requests, großen Bodies, langsamen Konsumenten, Paketverlust-/RTT-Klassen, Mobil-/Enterprise-Proxies, Connection Recycling und Rolloutspitzen.

### Observability

Erhebe hinreichend, aber ohne Stream-ID-/Header-Kardinalitätsexplosion:

```text
http2_connections{hop,state}
http2_active_streams{hop,route_class}
http2_streams_total{hop,result}
http2_frames_total{type,direction}
http2_connection_errors_total{code}
http2_stream_errors_total{code}
http2_flow_control_stall_seconds{scope=connection|stream}
http2_goaway_total{reason}
http2_header_section_bytes{hop}
http_request_duration_seconds{route,protocol,status_class}
```

Ein Protokoll-Dashboard sollte getrennt zeigen: negotiated protocol am Clienthop, Protokoll am Backendhop, TCP retransmission/RTT aus geeigneter Netztelemetrie, aktive Streams, Windowstalls, RST-/GOAWAY-/Connection-Fehler, Queuezeiten und businessrelevante SLOs. Vollständige Header, Access Tokens, Cookies und komprimierte Payloads gehören nicht in Standardmetriken oder ungesicherte Logs.

### Failure Modes und Troubleshooting

| Beobachtung | Wahrscheinliche Ursache | Nächste Prüfung |
|---|---|---|
| HTTP/1.1 statt h2 | ALPN-/TLS-/Gatewaypolicy, alte Clientklasse | negotiated ALPN und Protokoll pro Hop messen. |
| viele `REFUSED_STREAM`/RST | Streamlimit, Drain, Overload, Cancel | Settings, active streams, GOAWAY, Retrysemantik. |
| alle Streams pausieren | Connection Window, TCP-Verlust, Proxy-/CPU-Stall | Window- und TCP-Telemetrie, nicht nur Requestzeit. |
| einzelner Stream pausiert | Stream Window oder Client/Backend Backpressure | stream class, consumer rate, WINDOW_UPDATE. |
| Header-/Compression-Error | Field-/Frame-Limit, HPACK-Divergenz, Parserbug | Version/Patch, limits, error code, nicht Headerwerte loggen. |
| viele neue h2 Connections | GOAWAY/idle mismatch, ALPN fallback, client pool | connection state, drain, client vs edge pool. |
| CPU/Memory-Anstieg | zu viele Streams/Frames/Header, Decode/Buffering | limits, frame rate, active stream duration, heap. |
| Schreiboperation doppelt | retry nach unbekanntem Stream/Connectionabbruch | Idempotency Key, last stream ID, Backend audit. |

Troubleshooting beginnt mit der Frage **welcher Hop** betroffen ist. Danach: Protokoll/ALPN, Connection State, Stream State, Settings/Limits, Window, Frame-/Errorcode, TCP-Zustand, Proxyübersetzung und Anwendung. Ein `GOAWAY` ist kein pauschaler Serverfehler; seine Last-Stream-Information und die Clientretry-Policy bestimmen die Handlung.

## Security, Governance und Compliance

HTTP/2 erweitert die Angriffsfläche um Streamerzeugung, Framefrequenz, Headerkompression, Flow Control und verbindungsweite Fehler. Gegenmaßnahmen sind begrenzte Ressourcen, aktueller Parser/Gatewaybetrieb und reproduzierbare Negativtests, nicht selbst geschriebene Framefilter.

| Kontrolle | Warum |
|---|---|
| Max concurrent streams und Verbindungsrate | begrenzen fan-out und Ressourcen pro Peer. |
| Header-/Frame-/Field-Section-Limits | schützen Decoder, Memory und Downstream. |
| Stream-/Connection-Error-Trennung | reduziert Blast Radius bei lokalen Fehlern. |
| Reset-/Frame-/Ping-Ratelimits | begrenzen Control-Plane-Missbrauch. |
| Patch- und Versioninventar | Parser- und Protocol-DoS-Fixes müssen zeitnah ausrollbar sein. |
| GOAWAY/Drain | kontrolliert Rollouts ohne unbounded Reconnectstorm. |
| TLS/ALPN pro Hop | verhindert Annahmen, dass h2 alleine End-to-End-Schutz bedeutet. |
| Header- und Trace-Redaktion | schützt Secrets und personenbezogene Daten nach Dekodierung. |

Der Security Review umfasst echte Client–Gateway–Backend-Ketten, nicht nur einen h2-Server. Eine unvereinbare Übersetzung, ein überbreiter Headerlimitwert oder Trust in clientgelieferte Forwarded Headers bleibt unabhängig vom HTTP-Level ein Risiko.

## Cost und FinOps

HTTP/2 kann Socket-/Handshake-/Headeroverhead und Originverbindungen senken. Gleichzeitig vergrößert eine einzelne langlebige Connection die Konzentration von Streams, Memory, Headerzustand und TCP-HOL-Risiko. Kostensteuerung betrachtet daher Connectionzahl **und** Stream/Frame/Header/Window-Verbrauch.

| Hebel | Erwarteter Nutzen | Prüffrage |
|---|---|---|
| h2 am Clientedge | weniger parallele TCP-/TLS-Connections | verbessert es die gemessene p95/p99-Latenz und CPU? |
| h2 am Backend | effiziente Poolnutzung | unterstützt das Backend die Limits und Drains? |
| Headerlimits | kontrollierter Speicher/Decode | sind legitime Partner vorab getestet? |
| Streamlimits | begrenzter Fan-out | entstehen Queues oder Reconnectstürme? |
| getrennte Bulkklasse | schützt interaktive APIs | sind Kosten und Quotas transparent? |
| HTTP/3-Pilot | kann TCP-HOL auf problematischen Pfaden senken | übersteigt Quic-/UDP-/Edgekomplexität den belegten Nutzen? |

## Trade-offs und Anti-Patterns

| Entscheidung | Vorteil | Kosten/Risiko | Kontrollpunkt |
|---|---|---|---|
| ein großer h2 Pool | wenige Connections | TCP-HOL und große Fehlerdomäne | pro Route/Clientklasse begrenzen. |
| viele kleine h2 Pools | Isolierung | Handshake-/Socketoverhead | nach Lastprofil und SLO messen. |
| höhere Windowgrößen | gute Durchsatznutzung | Bufferbloat/Memory/Fairness | end-to-end Backpressure beobachten. |
| niedrige Windowgrößen | starke Empfängergrenze | Throughput-/Stallrisiko | echte BDP/RTT/Bodyprofile testen. |
| Priorität | bessere UX möglich | uneinheitliche Hopunterstützung | als Hinweis mit Fallback messen. |
| Server Push | potenziell weniger RTT | ungenutzte Bytes/Cache-/Support-Risiko | nicht als Standard voraussetzen. |

**Anti-Patterns**

- HTTP/2 als Ende von Head-of-Line Blocking zu verkaufen, obwohl TCP-Verlust alle Streams einer Verbindung verzögern kann.
- `max_concurrent_streams` oder Windowgrößen global zu maximieren, ohne Memory-, Queue- und Fairnessmodell.
- Jeden `RST_STREAM` automatisch und mehrfach zu wiederholen, auch für schreibende Operationen.
- Client–Edge h2 als Beweis zu nehmen, dass Edge–Backend ebenfalls h2 und sicher konfiguriert ist.
- Große Header-/HPACK-Tabellen ohne Memory-/CPU-Limit und Parserpatchmanagement zu erlauben.
- `GOAWAY` als sofortigen Connection-Close zu behandeln oder Draining ohne Idempotency-/Retryplan auszurollen.
- Stream IDs als globale Nutzer-, Tenant- oder Auditidentität zu verwenden.
- Server Push oder Priorität ohne realen Browser-/Client-/Proxy-Test zur kritischen Produktabhängigkeit zu machen.

## Staff-Level Decisions

Ein Staff-/Principal-Entscheidungsrecord beantwortet:

1. Für welche Hops und Clientklassen ist h2 Ziel-, Fallback- oder Ausschlussprotokoll?
2. Wie werden ALPN, TLS- und Backendterminierung samt Authority-/Forwarded-Trust nachgewiesen?
3. Welche Maximums gelten für Connections, Streams, Frame-/Header-/Bodygrößen, Reset/Ping-Rate und dynamischen Kompressionszustand?
4. Wie verteilen Stream- und Connection-Flow-Control, Pooling und Timeoutbudget Rückstau?
5. Welche Routen sind interaktiv, bulk, long-lived oder schreibend, und wie werden sie isoliert/priorisiert?
6. Wie gehen Clients bei RST, GOAWAY und Connectionverlust fachlich sicher mit Wiederholungen um?
7. Welche h1/h2/h3-Kompatibilitäts- und Mehrhop-Lasttests sind Freigabekriterium?

Der Review muss mindestens einen Streamfehler bei übriger Connection, einen verbindungsweiten Fehler, einen `GOAWAY`-Drain, Headerlimitüberschreitung, Windowstall, Paketverlustklasse, Backendprotokollwechsel und nicht-idempotenten Abbruch modellieren.

## Chief-Level Decisions

Chief-Level steuert HTTP/2 als Plattform-, nicht als Einzelfeature:

- Definiere einen Version-/Patch-/Limitstandard für Edge, Gateway, Service Mesh und Produktteams.
- Sorge für gemeinsames Telemetriemodell, das Version, Stream-/Connectionkapazität, Parser-/Resetfehler, TCP-Telemetrie und Nutzer-SLO verbindet.
- Priorisiere Protokollmigrationen anhand von Clientpopulation, Netzwerkpfad, Latenz, Kosten und Sicherheitsrisiko; ein Label „modern“ ist kein Business Case.
- Setze einen Ausnahmeprozess mit Owner, Restlaufzeit, Messsignal und Rückbau für HTTP/1.1-, h2c-, Header-/Limit- oder Proxyabweichungen.
- Verknüpfe TLS-Termination, Datenverarbeitung, Logging, Drittanbieteredge und Backendhop mit Compliance- und Lieferantensteuerung.
- Plane Connectiondrain, Kapazität und Incidentführung für globale Rollouts und Parser-/Sicherheitsupdates.

## Production Checklist

- [ ] Client-, Edge-, Mesh- und Backendhop nennen tatsächlich ausgehandeltes Protokoll und TLS-/ALPN-Grenze.
- [ ] H2/H1-Fallbacks sind bewusst, gemessen, zeitgebunden und nicht still auf Klartext gestellt.
- [ ] Connection-, Stream-, Frame-, Header-, Body-, Ping-/Reset- und Memory-/CPU-Limits sind je Hop getestet.
- [ ] Flow-Control-Fenster und Sender-/Empfängerbackpressure sind mit großen und langsamen Bodies validiert.
- [ ] Timeouts bilden ein Ende-zu-Ende-Budget; Streamcancel und Backendcancel sind definiert.
- [ ] GOAWAY-/Drainablauf enthält last-stream-id, Grace Period, Retry-/Idempotencyplan und Reconnectkapazität.
- [ ] HPACK-/Headergrenzen, Parserpatches und mehrhopige Negativtests sind im Securityprozess enthalten.
- [ ] Server Push ist bewusst deaktiviert oder für verifizierte Clientpopulationen gemessen.
- [ ] Stream-/Connection-/Frame-/Flow-/Error-/TCP-Metriken sind datensparsam verfügbar.
- [ ] Cache, Authority und Forwarded-Header folgen weiterhin dem HTTP-/Proxyvertrag aus KB-0068.
- [ ] Lasttests umfassen Parallelität, große Streams, langsame Empfänger, Paketverlust, Proxyübersetzung und Rollout.

## Interviewfragen mit Antworten

### 1. Welches Problem löst HTTP/2-Multiplexing gegenüber HTTP/1.1?

Mehrere Request-/Response-Austausche können als getrennte Streams gleichzeitig über eine Verbindung Fortschritt machen. Dadurch wird die HTTP/1.1-Anwendungskopfblockierung reduziert und die Zahl paralleler Connections kann sinken. HTTP-Semantik bleibt bestehen.

### 2. Warum kann HTTP/2 dennoch Head-of-Line Blocking haben?

HTTP/2 läuft üblicherweise über TCP. TCP liefert Bytes geordnet; bei Segmentverlust wartet die Anwendung auf die fehlenden Bytes. Wenn die TCP-Verbindung Frames mehrerer Streams trägt, kann dieser Verlust ihre Zustellung gemeinsam verzögern.

### 3. Was unterscheidet ein Streamfenster vom Connectionfenster?

Ein Streamfenster begrenzt Content für einen einzelnen Stream. Das Connectionfenster begrenzt Content über alle Streams zusammen. Sender benötigen Budget aus beiden, daher kann ein einzelner großer Stream oder eine Gruppe Streams den verbindungsweiten Fortschritt beeinflussen.

### 4. Was ist HPACK und warum braucht es Grenzen?

HPACK komprimiert HTTP/2-Feldsektionen mithilfe eines statischen und dynamischen Kontexts pro Verbindung. Es spart redundante Bytes, benötigt aber Decoder-, Memory- und CPUressourcen. Header- und Tabellenlimits sowie gepatchte Implementierungen sind deshalb Sicherheitskontrollen.

### 5. Wie hilft GOAWAY beim Rollout?

GOAWAY informiert Peers, dass keine neuen Streams mehr akzeptiert werden sollen und bis zu welchem Stream gearbeitet wurde. Damit kann eine Verbindung kontrolliert drainen. Clients brauchen trotzdem eine sichere Retryregel, insbesondere für schreibende Vorgänge mit unbekanntem Ergebnis.

### 6. Warum kann ein h2-Client trotzdem ein HTTP/1.1-Backend haben?

Ein Reverse Proxy ist auf Client- und Backendseite jeweils eigener HTTP-Endpunkt. Er kann h2 per ALPN mit dem Client aushandeln und anschließend H1 oder h2 zu seinem Upstream verwenden. Limits, Pools und Fehler sind deshalb pro Hop getrennt zu beobachten.

### 7. Sollte eine Organisation HTTP/2 Server Push standardmäßig aktivieren?

Nein. Server Push ist optional und seine Wirkung hängt von Clientunterstützung, Cachezustand, Priorität und Assets ab. Er gehört in einen gemessenen, kontrollierten Einsatzfall, nicht in eine pauschale Leistungsannahme.

## Praktisches Lab: Lokales Stream- und Fensterbudgetmodell

**Zweck:** Prüfe die begriffliche Trennung zwischen Stream-, Verbindungsbudget und Fehlerdomäne. Das Modell ist keine HTTP/2-Implementierung.

```python
from dataclasses import dataclass

@dataclass
class Connection:
    send_window: int = 120
    max_streams: int = 2
    active_streams: int = 0
    draining: bool = False

@dataclass
class Stream:
    ident: int
    send_window: int = 80
    closed: bool = False

def send_data(conn: Connection, stream: Stream, n: int) -> str:
    if conn.draining:
        return "REJECT: connection draining; no new work"
    if stream.closed:
        return "REJECT: stream closed"
    if n > conn.send_window or n > stream.send_window:
        return "STALL: wait for modeled WINDOW_UPDATE"
    conn.send_window -= n
    stream.send_window -= n
    return f"SENT {n}; conn={conn.send_window}; stream={stream.send_window}"

def reset_stream(stream: Stream) -> str:
    stream.closed = True
    return "RST_STREAM modeled: connection may remain available"
```

Arbeite diese Fälle durch:

1. Sende 40 Bytes auf Stream 1 und danach 40 Bytes auf Stream 3: beide Streamfenster erlauben es, das Connectionfenster sinkt gemeinsam.
2. Erschöpfe das Connectionfenster mit mehreren Streams: ein zusätzlicher Stream muss warten, obwohl sein eigenes Fenster noch Budget hat.
3. Erschöpfe nur Stream 1: Stream 3 kann weiterarbeiten, solange Connectionbudget verfügbar ist.
4. Rufe `reset_stream` auf Stream 1 auf; prüfe, dass Stream 3 nicht automatisch geschlossen wird.
5. Setze `draining=True` und diskutiere, dass ein echter GOAWAY keine Geschäftsretrygarantie ist.
6. Ergänze eine Obergrenze für Header-/Frameanzahl und markiere, wann ein lokaler Stream- und wann ein Connectionfehler logisch angemessen wäre.
7. Zeichne ein Lastprofil mit großem Download und drei kurzen API-Aufrufen; vergleiche h1-Pool, h2 mit TCP-Verlust und einen späteren h3-Pilot.

**Aufräumen:** Lösche temporäre lokale Dateien/Interpreterzustand. Es werden keine Frames, Sockets, TLS/ALPN-Handshakes, Webserver, Proxies, Gateways, Cloud-, Netzwerk- oder Produktionssysteme verwendet oder verändert.

## Dependencies und Cross-References

| Beziehung | Datei | Zweck |
|---|---|---|
| Requires | [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Lastprofile und Evidenz. |
| Requires | [KB-0056](08-tcp-verbindungen-und-ueberlastkontrolle.md) | TCP-HOL und Transportverhalten. |
| Requires | [KB-0067](19-tls-verbindungen-und-zertifikatspruefung.md) | TLS, ALPN und Terminierungsgrenzen. |
| Requires | [KB-0068](20-http-1-1-und-verbindungsnutzung.md) | HTTP-Semantik, Authority und Proxygrenzen. |
| Applies to | KB-0070 | HTTP/3-/QUIC-Vergleich und Migration. |
| Applies to | KB-0071 | API-/Proxy- und Performance-Entscheidungen. |
| Applies to | KB-0418 | Plattformgateway und Service-to-Service-Vertrag. |
| Applies to | KB-0720 | Enterprise-/Chief-Level-Steuerung. |

## Quellen und Aktualitätsgrenze

**Recherche-Cutoff: 2026-09-16.** HTTP/2-Implementation, ALPN-/Proxy-/Gateway-/Mesh-Defaults, Browser- und Runtimeunterstützung sowie Sicherheitsgrenzen ändern sich. Vor einer Produktionsentscheidung gelten die aktuelle Primärdokumentation und die reale Mehrhop-Clientmatrix der eingesetzten Komponenten.

1. [RFC 9113 — HTTP/2](https://www.rfc-editor.org/info/rfc9113/) — aktuelle HTTP/2-Basisspezifikation für Frames, Streams, Flow Control, HPACK-Kontext und Protokollstart.
2. [RFC 9218 — Extensible Prioritization Scheme for HTTP](https://www.rfc-editor.org/info/rfc9218/) — moderne, erweiterbare HTTP-Priorisierung.
3. [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/info/rfc9110/) — semantischer Rahmen für Methoden, Status, Felder und Intermediaries.
4. [RFC 9114 — HTTP/3](https://www.rfc-editor.org/info/rfc9114/) — Vergleichsrahmen für HTTP über QUIC und getrennte Streamzustellung.
5. [RFC 7541 — HPACK](https://www.rfc-editor.org/info/rfc7541/) — Feldkompressionsmodell, das HTTP/2 nutzt.
6. [KB-0056](08-tcp-verbindungen-und-ueberlastkontrolle.md) — lokaler TCP-Kontext.
7. [KB-0067](19-tls-verbindungen-und-zertifikatspruefung.md) — lokaler TLS-/ALPN-Kontext.
8. [KB-0068](20-http-1-1-und-verbindungsnutzung.md) — lokaler HTTP/1.1-/Proxykontext.

## Bonus: New Tech and Innovations

Die aktuelle Priorisierung nach RFC 9218 löst sich von der alten HTTP/2-Prioritätsbaumlogik und kann HTTP-Versionen übergreifend als klarere Dringlichkeits- und Inkrementalitätsinformation eingesetzt werden. Ihr Nutzen entsteht erst, wenn Client, CDN, Gateway und Origin sie kompatibel verstehen und Lasttests die beabsichtigte Nutzerwirkung nachweisen.

HTTP/3 kann die TCP-bedingte verbindungsweite Blockierung bei Verlust vermeiden, führt jedoch QUIC-/UDP-, Connection-ID-, TLS-1.3- und Edge-Betriebskomplexität ein. Ein Pilot akzeptiert HTTP/2- oder HTTP/3-Innovationen erst, wenn ALPN und Terminierung, Stream-/Connectionlimits, Flow Control, Header-/Parsergrenzen, Lastprofile, Fehler- und Drainingsemantik, Proxykompatibilität, Datenschutz, Observability und Rollback für jede betroffene Clientklasse nachgewiesen sind.

