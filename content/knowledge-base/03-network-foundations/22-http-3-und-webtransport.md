---
{"id": "KB-0070", "title": "HTTP-3 und Webtransport", "domain": "03", "sequence": 22, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Fehlersuche", "Lastprofil"], "needed_for": "both"}, {"id": "KB-0057", "concepts": ["UDP", "Datagrammverlust", "Reordering"], "needed_for": "both"}, {"id": "KB-0067", "concepts": ["TLS 1.3", "ALPN", "Terminierung"], "needed_for": "both"}, {"id": "KB-0069", "concepts": ["HTTP-2", "Multiplexing", "Flow Control", "Proxy"], "needed_for": "both"}], "related": ["KB-0071", "KB-0418", "KB-0562", "KB-0720"], "applies": ["KB-0071", "KB-0418", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Das Lab bewertet lokal einen deklarativen H3-Fallback-, QUIC-Stream- und Datagrammvertrag. Es sendet kein UDP-Paket, öffnet keine QUIC-Verbindung und führt keinen Browser- oder Gatewaytest aus.", "rationale": "Die Fallarbeit trainiert Fallback- und Semantikentscheidungen, ohne Netzwerk, TLS, DNS, Alt-Svc, Proxy, Cache oder Cloudinfrastruktur zu verändern."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein HTTP/3-Vertrag definiert Origin und TLS-Identität, H3/QUIC-Version- und ALPN-Policy, UDP-/Firewall-/NAT-Pfad, Alt-Svc/DNS-Discovery, Client- und Backendprotokoll pro Hop, Stream-/Datagramm-/QPACK-Limits, Connection IDs/Migration, Timeouts, Fallback, WebTransport-Status, Telemetrie und Rollback.", "rationale": "HTTP/3 ist HTTP über QUIC und QUIC über UDP; Deployment gelingt nur, wenn die gesamte Pfad-, Edge-, Client- und Sicherheitskette den neuen Transport korrekt unterstützt."}, "STAFF-TARGET": {"active": true, "scope": "Teams testen h2/h3-Fallback und Wiederherstellung über repräsentative Netzklassen, messen UDP-Blockierung, Handshake, Version Negotiation/Retry, Streamverlust, QPACK-Blockierung, Connection-Migration, Datagrammverlust, Alt-Svc-Cache, Gatewayhops und Lastspitzen.", "rationale": "Sie unterscheiden DNS/Alt-Svc-, UDP-/Firewall-, QUIC-/TLS-, H3-, QPACK-, Proxy-, Stream-, Application- und Fallbackursachen auf Basis korrelierter Evidenz."}, "CHIEF-TARGET": {"active": true, "scope": "Die Organisation steuert QUIC/HTTP/3 als Edge- und Plattformfähigkeit mit Standards-/Patchmanagement, UDP- und Drittanbieternetzen, Kosten/Kapazität, Datenschutz an Terminierungspunkten, Clientsegmentierung, Ausnahmen, Compliance und klaren Rückfallgrenzen.", "rationale": "Eine ungemessene globale H3-Aktivierung kann UDP-Pfadprobleme, neue Observabilitylücken, Mehrkosten oder unbemerkte Sicherheitsdowngrades über eine große Nutzerpopulation verteilen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "QUIC-Paket-/Frame-Implementierung, Congestion-Control-Algorithmen, Loss Recovery, Retry/Token-/Anti-Amplification-Details, Connection-ID-Rotation, QPACK-Encoderoptimierung, UDP-Kernel-/NIC-Tuning, Browsernetzwerkstacks und WebTransport-Draft-Implementierung sind Spezialistentiefe.", "rationale": "Die Zielrollen benötigen einen belastbaren Architektur-, Sicherheits- und Betriebsvertrag; Protokoll- und Runtime-Optimierung wird mit Netzwerk-, Security-, Edge- und Runtime-Spezialisten verantwortet."}}, "lab_validation": [{"lab_id": "KB-0070-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox ohne Netzwerkzugriff", "evidence": "Eine deklarative Entscheidungsmatrix prüft Alt-Svc-Freshness, valide Origin-Identität, UDP-Pfad, H3-Unterstützung, erlaubten HTTPS-H2-Fallback, Datagrammverlust und WebTransport-Fähigkeit als Fallarbeit.", "limitations": "Nicht ausgeführt; kein UDP-, QUIC-, HTTP/3-, WebTransport-, TLS-, DNS-, Alt-Svc-, Browser-, Proxy-, Gateway-, Cloud-, Netzwerk- oder Produktionssystem wurde verwendet oder verändert."}]}
---
# HTTP-3 und Webtransport

> **Ziel:** HTTP/3 überträgt dieselbe HTTP-Semantik über QUIC statt TCP. QUIC nutzt UDP als Pakettransport, enthält aber eigene TLS-1.3-Integration, zuverlässige Streams, Verlustbehandlung, Flow Control und Connection IDs. Ein H3-Deployment ist deshalb eine Ende-zu-Ende-Pfad- und Fallbackentscheidung, keine Änderung eines einzigen Listener-Schalters.

## Purpose, Definition und Scope

HTTP/3 ist die Abbildung der HTTP-Semantik auf QUIC. QUIC ist ein sicheres, multiplexendes Transportprotokoll auf UDP-Basis. HTTP/3 verwendet QUIC Streams, eigene Control-/QPACK-Streams und QUIC-TLS-1.3-Integration. HTTP/3 reduziert die transportbedingte verbindungsweite Blockierung, die HTTP/2 über TCP bei Paketverlust behalten kann: Verlust eines QUIC-Pakets blockiert nicht die Auslieferung unabhängiger QUIC Streams, sofern deren Daten bereits verfügbar sind.

Dieses Kapitel erklärt HTTP/3, QUIC, QPACK, Alt-Svc, UDP-Erreichbarkeit, Fallback und die aktuelle Einordnung von WebTransport. Es definiert keine individuelle CDN-, Browser-, Gateway- oder Runtimeunterstützung. **Stand 2026-09-16** ist WebTransport über HTTP/3 im IETF als Internet-Draft in Arbeit; plane daher nur gegen tatsächlich verifizierte Client- und Serverunterstützung, nicht gegen eine angenommene universelle Norm.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | HTTP/3 trägt HTTP über QUIC, das zuverlässige Streams und optionale unzuverlässige Datagrams auf UDP bereitstellt. |
| HANDS-ON-TARGET | Lokale Vertrags- und Fallbackfallarbeit ohne Netzwerkzugriff. |
| ARCHITECT-TARGET | Discovery, UDP-Pfad, H3/ALPN, TLS/Origin, Limits, Proxypfade, Fallback und Telemetrie sind verbindlich. |
| STAFF/PRINCIPAL | Teams messen Netzwerkklassen und Fehlerzustände über H3, H2 und jeden Proxyhop getrennt. |
| CHIEF | H3 wird als Kapazitäts-, Lieferanten-, Sicherheits-, Datenschutz- und Migrationsfähigkeit gesteuert. |

## Mental Model: Viele unabhängige, verschlüsselte Streams in einer QUIC-Verbindung

```text
HTTP semantics
  -> HTTP/3 request stream / response stream
  -> QUIC stream (reliable, independently ordered)
  -> QUIC packets (encrypted; may contain frames from multiple streams)
  -> UDP datagrams across the network path
```

```text
client -- UDP --> edge QUIC endpoint -- protocol may change --> backend service
               TLS 1.3 is integrated into QUIC handshake
               ALPN identifies h3
```

Die Formel „QUIC über UDP“ ist unvollständig. UDP selbst ist verbindungslos und liefert nicht zuverlässig; QUIC baut darauf eigene Verbindungs-, Verschlüsselungs-, Stream-, Loss-Recovery-, Congestion-Control- und Flow-Control-Semantik auf. Ein QUIC-Stream ist keine UDP-Nachricht. Umgekehrt sind QUIC DATAGRAM Frames absichtlich nicht zuverlässig und nicht geordnet.

## Prerequisites und Dependencies

| ID | Art | Bedeutung |
|---|---|---|
| [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Verständnis und Lab | Pfad- und Fehlerhypothesen. |
| [KB-0057](09-udp-und-datagrammverhalten.md) | Verständnis und Lab | UDP, Verlust, Reordering und Netzpfad. |
| [KB-0067](19-tls-verbindungen-und-zertifikatspruefung.md) | Verständnis und Lab | TLS 1.3, Dienstidentität, ALPN und Terminierung. |
| [KB-0069](21-http-2-und-multiplexing.md) | Verständnis und Lab | HTTP/2-Vergleich, Multiplexing, Proxy- und Flow-Control-Kontext. |

## Core Concepts

### QUIC und HTTP/3

HTTP/3 läuft über QUIC; QUIC verwendet UDP, enthält aber einen vollständigen sicheren Transport. QUIC verwendet TLS 1.3 für seinen kryptografischen Handshake und die Schlüsselerzeugung. HTTP/3 nutzt ALPN-IDs wie `h3`, um die HTTP-Anwendung über der QUIC-Verbindung auszuhandeln. Der TLS-Servername, die Zertifikatsprüfung und die Terminierungspflicht aus KB-0067 gelten weiter.

| Ebene | Verantwortung |
|---|---|
| UDP | IP-/Port-basierter Datagrammtransport; Pfad kann UDP anders behandeln als TCP. |
| QUIC | sichere Verbindung, Version, Connection IDs, zuverlässige Streams, Packet Number Spaces, Verlust-/Congestion-/Flow-Control. |
| HTTP/3 | HTTP Request/Response-Semantik, Control Stream, QPACK, Priorisierung und Fehlermapping. |
| Anwendung | Authentisierung, Autorisierung, Idempotenz, Datenklassifikation, Business-Retries und Beobachtbarkeit. |

HTTP/3 ist kein „HTTP/2 über UDP“. HTTP/2-Framing, HPACK-Context und TCP-Verbindungsmodell werden durch HTTP/3-/QUIC-Mechanismen ersetzt. Semantik wie Methoden, Statuscodes, Authority, Cache-Control und Cookies sind weiter HTTP-Semantik.

### QUIC Streams und Verlustisolierung

QUIC Streams sind unabhängig geordnet. Der Verlust eines Pakets kann einen Stream verzögern, dessen Bytebereiche verloren gingen; ein anderer Stream kann fortfahren, wenn seine Daten vollständig vorliegen. Das vermeidet TCPs verbindungsweite geordnete Zustellbarriere.

```text
packet 100: stream 4 bytes 0..999      lost
packet 101: stream 8 bytes 0..999      received

HTTP/2 over TCP: later bytes wait behind loss in shared ordered byte stream
HTTP/3 over QUIC: stream 8 can become readable; stream 4 waits for recovery
```

Das ist keine Latenzgarantie. Packet Loss, Congestion Control, CPU, NAT-/Firewallzustand, Edgekapazität, Path MTU, Retry, Client-Queue, Anwendung und Backend sind weiterhin begrenzend. Außerdem kann eine H3-Verbindung mit vielen Streams eine bedeutende Fehler- und Kapazitätsdomäne bleiben.

### Connection IDs, Adresswechsel und Migration

QUIC identifiziert eine Verbindung durch Connection IDs, nicht ausschließlich durch das klassische 4-Tupel aus Quell-/Ziel-IP und Port. Das erlaubt unter passenden Voraussetzungen einen Wechsel des Netzwerkpfads, etwa bei Wechsel von WLAN zu Mobilfunk, ohne zwingend jede Anwendungssitzung neu aufzubauen. Endpunkte validieren neue Pfade; Architektur darf daraus keine pauschale Mobilitätsgarantie ableiten.

```text
old path: client IP A:port X -> edge IP E:443/UDP
new path: client IP B:port Y -> edge IP E:443/UDP
QUIC connection identity: may remain after path validation
```

Network Address Translation, UDP-State-Timeouts, Unternehmensfirewalls, VPNs, Load-Balancer-Sharding, Connection-ID-Routing und Produktimplementation entscheiden, ob der Pfad funktioniert. Connection IDs sind keine Benutzeridentität und dürfen nicht in Logs/Analytics ungeschützt zu Langzeittracking führen.

### Flow Control und Congestion Control

QUIC hat Connection- und Stream-Flow-Control sowie Congestion Control. Flow Control begrenzt, wie viel ein Empfänger akzeptieren kann; Congestion Control reagiert auf Netzkapazität und Verlust. HTTP/3 ergänzt semantische und Control-Streams, macht aber keine unendliche Bufferkapazität.

```text
application data
  -> HTTP/3 stream semantics
  -> QUIC stream flow-control credits
  -> QUIC connection flow-control credits
  -> congestion window / pacing / path conditions
  -> UDP packets
```

Ein großer Upload/Download kann Streamfenster, Connectionfenster, Sendepuffer und Congestion Window beanspruchen. Arbeite mit Budget statt unbegrenztem Buffering. Ein Datagramm ist nicht wiederholbar durch QUIC; die Anwendung muss entscheiden, ob Verlust, Alter oder Reordering akzeptabel sind.

### QPACK: Header Compression ohne HTTP/2-typische Blockierung

HTTP/3 verwendet QPACK statt HPACK. QPACK trennt Encoder-/Decoder-Anweisungen auf eigene unidirektionale QUIC Streams von Request Streams. Dadurch wird verhindert, dass Verlust oder Verzögerung eines Headerkompressionsupdates zwingend jeden HTTP Request Stream in derselben Weise wie bei einer gemeinsamen TCP-Bytefolge blockiert. Es kann aber weiterhin QPACK-Blocking geben, wenn ein Field Section auf dynamische Tabellenreferenzen wartet.

```text
QPACK encoder stream  -> dynamic table instructions
request stream        -> encoded field section references
QPACK decoder stream  -> acknowledgements/cancellations
```

QPACK braucht explizite Limits für dynamische Tabelle, blockierte Streams, Header-/Field-Section-Größe, Decoder-CPU und Memory. Eine abstrakte Annahme „QPACK eliminiert Headerprobleme“ ist falsch. Jeder Edge-/Proxy-/Backendhop hat eigene QPACK-Zustände und Limits.

### HTTP/3 Control Stream und Fehlerdomänen

HTTP/3 verwendet unidirektionale Control Streams für Einstellungen und andere verbindungsweite Kontrollinformationen. Request Streams tragen einzelne HTTP Exchanges. Fehler können streamlokal oder verbindungsweit sein.

| Ereignis | Reichweite | Architekturreaktion |
|---|---|---|
| abgebrochener Request Stream | einzelner Exchange | Methode/Idempotenz/Cancel prüfen, nicht global neu verbinden. |
| QPACK-Blockierung | betroffene Field Sections; Ressourcenwirkung kann wachsen | Limits, Encoder-/Decoder-Status und Timeouts prüfen. |
| ungültige verbindungsweite Settings/Control | gesamte HTTP/3 Connection | sauber schließen, neue Connection kontrolliert aufbauen. |
| QUIC Path Failure/Migration failure | Verbindung/Pfad | sichere neue Verbindung oder protokollkonformer Fallback. |
| UDP nicht erreichbar | Clientpfad oder Zwischenkomponente | H2/H1 über TLS nach bewusster Fallbackpolicy. |
| Backend-Fehler hinter Edge | einzelner Upstreamhop | H3 Clienthop von Edge-Backendhop trennen. |

### QUIC DATAGRAM und HTTP Datagrams

RFC 9221 definiert QUIC DATAGRAM Frames für potenziell unzuverlässige Anwendungsdaten ohne Retransmission. RFC 9297 definiert HTTP Datagrams als Konvention für HTTP-Erweiterungen; sie sind einer HTTP-Requestkontext zugeordnet, aber nicht Teil des HTTP Message Content. HTTP Datagrams über H3 können die QUIC-Datagram-Fähigkeit nutzen; über andere Transportsituationen gibt es die Capsule Protocol-Form mit anderen Zuverlässigkeitsmerkmalen.

```text
reliable need:   HTTP/3 request stream / QUIC reliable stream
realtime tolerant: HTTP Datagram -> QUIC DATAGRAM frame
fallback encoding: Capsule -> reliable stream, semantics must be made explicit
```

Verlust, Duplikate, Reihenfolge und Größe müssen pro Anwendungsfall konstruktiv behandelt werden. Ein „live cursor“-Update oder Positionssignal kann Verlust überleben; eine Zahlungsanweisung oder Zustandsänderung nicht. Ein Datagramm darf nicht still zu einer unendlichen, verlässlichen Nachricht werden, wenn die Anwendung seine Real-Time-Semantik voraussetzt.

### WebTransport: aktuell nur gegen nachgewiesene Unterstützung planen

WebTransport ist ein Framework für sichere, multiplexte Kommunikation für Webclients. Der aktuelle IETF-Draft für WebTransport über HTTP/3 beschreibt bidirektionale Streams, unidirektionale Streams und Datagrams innerhalb einer HTTP/3-Verbindung; eine Sitzung beginnt über Extended CONNECT und verlangt ausgehandelte Fähigkeiten. Der Draft kann sich vor finaler Standardisierung ändern.

```text
browser/app -- HTTP/3 extended CONNECT --> WebTransport-capable edge
  session
    -> reliable bidi streams
    -> reliable uni streams
    -> optionally unreliable datagrams
```

Behandle WebTransport nicht als „WebSocket 2.0“. Es hat andere Stream-/Datagramm-/Sitzungs- und Supporteigenschaften. Ein Produktionsentscheid braucht mindestens: Browser-/SDK-/Gateway-Interoperabilität, Origin-/CORS-/Authmodell, Session-/Quota-/Idlepolicy, Proxyunterstützung, Datagrammgrenzen, Backpressure, Abbruch-/Fallbacksemantik, Kosten und Datenschutz. Ist irgendein Teil nicht verifiziert, bleibt der sichere Weg ein explizit unterstütztes Protokoll wie HTTP/2/WebSocket oder H3 ohne WebTransport, nicht eine stillschweigende Funktionszusage.

## Discovery, Alt-Svc und Fallback

### Alt-Svc als Hinweis, nicht als Vertrauensumgehung

HTTP Alternative Services können einem Client eine alternative Protokoll-/Host-/Port-Kombination mitteilen. Ein H3-Deployment nutzt beispielsweise eine `Alt-Svc`-Anzeige, damit ein Client mit bestehender HTTPS-Verbindung eine QUIC/H3-Verbindung ausprobieren kann.

```http
Alt-Svc: h3=":443"; ma=86400
```

Die Origin-Authority bleibt relevant. Ein alternativer Endpunkt muss für den Origin ausreichend authentisiert werden; die Einführung einer anderen Adresse/Portkombination erlaubt nicht, TLS-Namens- oder Vertrauensprüfung zu überspringen. Alternative Services besitzen Frische-/Cachezeit, können fehlschlagen und müssen bei 421 Misdirected Request oder Konfigurationswechsel korrekt behandelt werden.

| Schritt | Erwartete Kontrolle |
|---|---|
| Advertise | nur von kontrolliertem HTTPS-Origin über klaren `Alt-Svc`-Vertrag. |
| Discover | Client prüft Freshness und eigene Proxypolicy; nicht jeder Client nutzt H3. |
| Connect | UDP-Pfad, QUIC-Version, TLS 1.3, ALPN `h3`, Origin-Zertifikat und Endpointpolicy. |
| Use | Telemetrie für H3-Erfolg, Handshake, Path Failure und fachliche Ergebnisqualität. |
| Fail | bewusster Fallback zu sicherem HTTPS H2/H1 unter gleichen Auth-/Cache-/Requestsemantiken. |
| Withdraw | `Alt-Svc: clear` oder konsistente Ablauf-/DNS-/Edgeänderung; Alt-Svc-Caches berücksichtigen. |

DNS HTTPS/SVCB Resource Records können ebenfalls Service-/ALPN-/Endpunktinformationen veröffentlichen. Sie sind kein Ersatz für TLS-Authentisierung; RFC 9460 modelliert DNS-Auflösung ohne zwingenden Authentizitätsbeweis. Ein Deployment braucht eine gemeinsame Source-of-Truth- und Rollbackstrategie für DNS, Alt-Svc, TLS-Zertifikate, QUIC Listener und Edge Routing.

### UDP-Erreichbarkeit und sichere Fallbacks

UDP/443 kann durch Firewall, captive portal, VPN, Provider, Unternehmensproxy, NATstate, DDoS-Schutz, Load Balancer oder Netzwerkpolicy blockiert, rate-limited oder anders beobachtet werden als TCP/443. Messe die Verteilung nach Netzwerkklasse, Region, Clientversion, Egress- und Providersegment; ein einzelner Bürotest ist kein globaler Beweis.

```text
try H3 only where discovery/policy permits
  -> successful H3: record negotiated protocol and performance
  -> UDP/path/QUIC failure: use approved HTTPS H2/H1 fallback
  -> never silently change to unauthenticated HTTP or loosen certificate validation
```

Fallback darf fachliche Operationen nicht doppelt auslösen. Wenn ein H3-Request nach möglichen Servereffekten fehlschlägt, gelten Idempotenz, Idempotency Keys, Deduplizierung und verbleibendes Zeitbudget unabhängig vom darunterliegenden Transport.

## Architektur und Proxy Paths

```text
browser -- QUIC/UDP/H3 --> CDN/edge -- H3 or H2 --> gateway -- H1/H2 --> service
                                           ^
                                 transport terminates and restarts here
```

Ein H3-Edge kann QUIC terminieren und zu einem H2- oder H1-Backend weiterleiten. Der Client sieht keine Backend-QUIC-Details; die Plattform muss jedoch Header, Authority, TLS-/mTLS-Grenze, Timeout, Cancellation, Datagramm-/Streamingfähigkeiten und Observability pro Hop sauber übersetzen.

| Modell | Nutzen | Begrenzung |
|---|---|---|
| H3 nur Client–Edge | breite Edgeverbesserung, Backend kann stabil bleiben | nur dieser Hop gewinnt QUIC-Eigenschaften. |
| H3 Edge–Backend | Multiplexing auch intern möglich | Mesh/Gateway/Service-Support, UDPpolicy und Debugging werden komplexer. |
| H3 End-to-End | weniger Übersetzung | seltene vollständige Kontrolle über alle Pfade, Termination-/Securityanforderungen beachten. |
| H2/H1 Fallback | Erreichbarkeit für UDP-gestörte Pfade | zwei Protokollpfade brauchen gemeinsame Semantik und Tests. |
| WebTransport Edge Session | Echtzeitfähigkeiten | unreife/heterogene Unterstützung und strenge Session-/Quota-Grenzen. |

Proxies können HTTP Requests verarbeiten, aber QUIC-Transportdetails nicht beliebig „durchreichen“. Ein L7-Proxy ist selbst QUIC/H3-Endpunkt auf seiner Eingangsseite und erzeugt einen neuen Hop. Connection IDs, Stream IDs und kryptografische Schlüssel enden dort.

## Konfiguration und Implementierung

### Abstrakter H3-Vertrag

```yaml
origin: api.example.com
client_edge:
  protocols: ["h3", "h2", "http/1.1"]
  alpn: ["h3", "h2", "http/1.1"]
  udp_listener: "443/udp"
  tls_identity: "api.example.com approved certificate policy"
  alt_svc:
    enabled: true
    max_age_seconds: 3600
  limits:
    max_connections_per_client_class: "measured"
    max_streams: "documented-platform-limit"
    max_header_bytes: 32768
    max_qpack_table: "documented-platform-limit"
    max_blocked_qpack_streams: "documented-platform-limit"
  datagrams: disabled
fallback:
  approved_protocols: ["h2", "http/1.1"]
  require_tls_identity_validation: true
backend:
  protocol: "h2"
  mTLS: true
webtransport:
  enabled: false
```

Das Modell ist kein Produktkonfigurationsfragment. QUIC-Versionen, ALPN-Strings, Connection-ID- und Retry-/Token-Policy, H3-/QPACK-Limits, UDP Listener, DDoS-Integrationen und WebTransport Flags unterscheiden sich stark nach Produkt und Version. Validierung braucht die konkrete Herstellerspezifikation und reale Testclients.

### Rolloutsequenz

1. Inventarisiere Origin, DNS/SVCB, Alt-Svc, Zertifikate, UDP Listener, Firewall/NAT/LB/DDoS, Clients, Proxies, Backendhops und aktuelle H1/H2-SLOs.
2. Formuliere einen H3-Success- und Fallbackvertrag: TLS-/Originvalidierung, idempotente Retryregeln, gleiche Auth-/Cache-/Rate-limit-Semantik und klare Nichtsichtbarkeit von H3 ohne Telemetrie.
3. Starte mit begrenzter Client-/Region-/Edgegruppe und einer konservativen Alt-Svc-Freshness; beobachte UDP Reachability, Handshake, Version/ALPN, Connection-/Streamfehler, CPU, egress und Applikations-SLO.
4. Teste absichtlich UDP-Block, falsches Zertifikat, stale Alt-Svc, Quic-/H3-Abbruch, Path Change, große Header/QPACK-Grenze, Backenddegradation und H2-Fallback.
5. Erweitere nur bei vergleichbarer oder besserer SLO-/Kosten-/Fehlerlage; behandle wachsende Fallbackquote als Pfad- oder Konfigurationsbefund.
6. Rolle bei Regression Advertisement und Listener kontrolliert zurück, beachte gecachte Alt-Svc-/DNSinformationen und bewahre sicheren H2/H1-Betrieb.

## Scalability, Performance und Reliability

### Was messen?

```text
http_requests_total{protocol=h1|h2|h3,route,status_class}
quic_connections_total{result,version,client_class}
quic_handshake_duration_seconds{result,region}
quic_path_validation_total{result}
quic_connection_close_total{error_class}
http3_streams_total{result}
http3_qpack_blocked_streams{hop}
http3_datagrams_total{result=sent|received|dropped}
http3_fallback_total{from=h3,to=h2|h1,reason}
udp_reachability_total{client_class,network_class,result}
```

Messe Requesterfolg, Handshake, Transport-, H3- und Applikationsfehler getrennt. Eine erfolgreich aufgebaute QUIC-Verbindung beweist keine vollständige Response. Eine H2-Fallbackquote ohne Pfadsegmentierung beweist nicht, ob Firewalls, Clients, DNS/Alt-Svc, Edge oder Anwendung die Ursache sind.

### Failure Modes

| Symptom | Denkbare Ursache | Nächste Evidenz |
|---|---|---|
| H3 wird kaum genutzt | Client-/Proxy-Support, fehlendes Alt-Svc, UDP blockiert, Zertifikat/ALPN | Discovery, attempt, ALPN, path und Fallbackreason getrennt messen. |
| hohe H3-Handshakefehler | QUIC/TLS/Version/Retry, Edgecapacity, UDP path | QUIC error class, TLS identity, version and region. |
| H3 langsam trotz Erfolg | Loss/RTT, congestion, QPACK, app/backend, large streams | transport metrics, blocked streams, hop timing, body profile. |
| Path Change bricht ab | NAT/VPN/firewall/LB routing, migration policy | client network transition, CID routing, validation result. |
| neue 4xx/5xx nur bei H3 | proxy translation, header/QPACK limit, request mapping | protocol/hop comparison with redacted test corpus. |
| Backend sieht H1 | expected protocol termination | document/measure backend hop, do not diagnose client H3 as backend H3. |
| Datagramme fehlen | expected unreliable delivery, MTU, policy or intermediary transformation | datagram size, loss, ordering and feature negotiation. |
| WebTransport session fails | draft/API/support/settings/extended CONNECT/origin/auth | exact client/server version and negotiated capabilities. |

### Capacity, DDoS und Connection Lifecycle

QUIC/TLS-Handshake, encryption, header processing, Connection IDs, UDP receive/send queues and anti-amplification behavior require capacity planning. H3 can shift edge load from TCP state/handshakes to UDP/QUIC user-space or appliance processing depending on implementation. Do not estimate capacity from H2 requests per second alone.

Connection lifecycles also differ. Long-lived QUIC connections can survive path changes but consume state. Track active, idle, draining and migration-attempting connections, set bounded idle/lifetime policy, and test mass reconnect/redeploy behavior. UDP DDoS and reflection controls must be implemented in the selected edge product and network path; this chapter does not prescribe packet-level mitigations.

## Security, Governance und Compliance

HTTP/3 inherits the need for correct TLS service identity and HTTP authorization. Its additional controls include:

- QUIC/TLS/H3 versions and patches are owned and current;
- UDP listener, firewall, DDoS mitigation, edge routing and connection-ID handling are approved for the data class;
- Alt-Svc/DNS/HTTPS records, certificate lifecycle and origin authority are changed through controlled, auditable workflows;
- H3/H2/H1 fallback never weakens TLS validation, authorization or privacy policy;
- QPACK/Header/Stream/Datagram/Connection limits protect CPU, memory and bandwidth;
- Connection IDs, addresses, User Agent, authority, URI and headers are logged minimally and redacted appropriately;
- L7 termination points identify where plaintext and identity data can be observed;
- WebTransport gets a separate security review for origin, cross-origin exposure, session lifecycle, quotas, unreliable data and draft-version compatibility.

A fallback to secure H2/H1 can be a normal availability action. A fallback to cleartext HTTP or a bypassed certificate check is a security regression and must not be automated as a generic recovery action.

## Cost und FinOps

HTTP/3 can improve end-user performance on loss-prone paths and reduce some connection behavior, but can add UDP/QUIC edge capacity, observability, DDoS protection, product licensing or egress costs. Cost models separate:

| Dimension | H3-specific question |
|---|---|
| Edge CPU | Is QUIC encryption/packet processing more or less costly under actual client mix? |
| Network | Does lower retransmission blocking or different path use reduce effective transfer time/egress? |
| Connection state | Are long-lived/migrating connections sized, expired and sharded efficiently? |
| Fallback | Is dual H3+H2/H1 capacity retained during migration? |
| Observability | Can packet/connection diagnostics be sampled and redacted without exploding volume? |
| Delivery | Does the measured UX/SLO improvement justify client, proxy, firewall and operational complexity? |

Use cohort comparisons with same route, region, client class and data size. A global averaged latency improvement can hide a severe enterprise-network regression or a cost increase at the edge.

## Trade-offs und Anti-Patterns

| Entscheidung | Vorteil | Kosten/Risiko | Kontrollpunkt |
|---|---|---|---|
| H3 Edge-only | geringes Backendmigrationsrisiko | Proxyterminierung, dual stack | per-hop telemetry. |
| End-to-end QUIC | weniger protocol translation | selten vollständig kontrollierte Pfade | security/operability review. |
| Alt-Svc rollout | standardsbasierte Discovery | stale cache, multiple paths | bounded `ma`, withdrawal/rollback. |
| H2 fallback | erreichbare TCP-Pfade | zwei implementationspfade | same auth/cache/retry semantics. |
| QUIC DATAGRAM | Echtzeit bei Verlusttoleranz | loss/reorder/size | application-level semantics. |
| WebTransport pilot | streams + datagrams in web context | draft/support/security risk | gated capability matrix. |

**Anti-Patterns**

- HTTP/3 als „UDP ohne Zuverlässigkeit“ zu beschreiben und QUIC-Streams/Loss-Recovery zu ignorieren.
- H3 nur am Listener aktivieren, ohne UDP/443-Pfad, Alt-Svc, Zertifikat, Firewall, NAT, DDoS, Proxy und Fallback zu testen.
- Eine H3-Fallbackquote als Erfolg zu behandeln, ohne Grund, Netzklasse und fachliches Ergebnis zu messen.
- H3-Fehler durch `verify=false`, Cleartext-Fallback oder global abgeschwächte TLS-Policy zu kaschieren.
- Stream ID oder Connection ID als dauerhafte Nutzeridentität oder unredigiertes Loggingmerkmal zu verwenden.
- QPACK- und Headerlimits zu ignorieren, weil Daten „komprimiert“ sind.
- QUIC DATAGRAM für zuverlässige Geschäftsoperationen einzusetzen.
- WebTransport aus einer Demo als breit standardisiert/verfügbar anzunehmen.
- H3 am Clientedge als Nachweis zu sehen, dass das Backend über H3 arbeitet oder von H3 profitiert.

## Staff-Level Decisions

Ein Staff-/Principal-Record beantwortet:

1. Welche Clients, Regionen und Netzklassen sollen H3 nutzen, welche sichere Fallbackroute gilt?
2. Wie verknüpfen sich DNS/SVCB, Alt-Svc, QUIC Version/ALPN, Originzertifikat, UDP Listener und Load-Balancer-Routing?
3. Wo terminiert QUIC, welches Protokoll und welche Identity gilt auf jedem Backendhop?
4. Welche Limits gelten für Connections, Streams, Header/QPACK, Request Bodies, Datagrams, Idle/Lifetime, Rate und CPU/Memory?
5. Welche Fehler sind path-, QUIC-, H3-, QPACK-, Proxy- oder anwendungsbezogen und wie werden sie sichtbar?
6. Wann darf eine Anfrage nach H3-Abbruch wiederholt werden, und welche Idempotency-/Deduplizierungsregel schützt fachliche Änderungen?
7. Was ist der konkrete WebTransport-Status pro Client/Server und welche zusätzliche Sicherheits- und Quota-Policy ist Voraussetzung?

Ein guter Review enthält realistische UDP-blocked- und enterprise-proxy-Fälle, stale Discovery, falsche Originidentität, H3->H2-Fallback, Loss/RTT, QPACK-/Headergrenzen, Edge-Backendprotokollwechsel, Connectiondrain und Abbrüche von schreibenden Requests.

## Chief-Level Decisions

Chief-Level steuert die gesamte H3-Fähigkeit:

- Entscheide anhand gemessener Nutzer- und Geschäftswirkung, nicht am Protokolltrend, welche Produkte/Regionen H3 nutzen.
- Verknüpfe Edge-, Netzwerk-, Security-, SRE-, Legal-/Privacy- und Produktownership für UDP, QUIC, Terminierung, Logging und Drittanbieter-CDNs.
- Setze einen Patch-/Vulnerabilitäts- und Versionsprozess für QUIC/H3/QPACK-/Gatewayruntimes mit koordinierter Rollbackkapazität.
- Führe zentrale Mindeststandards für Fallback, TLS-Identity, Header-/Stream-/Datagrammlimits, Telemetrie und Datenredaktion.
- Berichte H3 nicht als „aktiv“, sondern nach successful delivery, UDP reachability, fallback distribution, cost, tail latency, failures and data-class compliance.
- Verlange für WebTransport eine eigene Capability- und Risikoentscheidung, solange Standardisierung und Ökosystemunterstützung sich ändern.

## Production Checklist

- [ ] Origin, DNS/SVCB, Alt-Svc, QUIC/H3 ALPN, TLS-Zertifikat und UDP Listener sind als zusammenhängender Vertrag dokumentiert.
- [ ] UDP-/Firewall-/NAT-/VPN-/DDoS-/Load-Balancer-Pfad ist für relevante Netzklassen getestet.
- [ ] H3, H2 und H1 haben identische Mindest-TLS-, Auth-, Cache-, Rate-limit- und fachliche Retryregeln.
- [ ] Clientedge- und Backendhop-Protokoll, Terminierung, mTLS/Identity und Timeouts sind getrennt beobachtbar.
- [ ] Connection-, Stream-, Header-/QPACK-, Body-, Datagramm-, Idle-/Lifetime- und Ratelimits sind getestet.
- [ ] QPACK-Blockierung, Decoderressourcen und Headerredaktion sind kontrolliert.
- [ ] Handshake, ALPN, Version, Path/Migration, close/error, streams, datagrams, fallback und SLO-Metriken sind verfügbar.
- [ ] Rollout nutzt kleine Kohorten, begrenzte Advertisement-Freshness und einen getesteten Withdrawal-/Rollbackplan.
- [ ] Nicht-idempotente Requests haben sichere Retry-/Deduplizierungsregeln bei H3-/H2-Fallback und Abbruch.
- [ ] WebTransport ist deaktiviert oder mit aktueller Fähigkeitsmatrix, Origin/Auth/Quota/Datagrammtests und eigener Freigabe abgesichert.
- [ ] Keine Logs enthalten unnötige Connection IDs, Tokens, Cookies, unredigierte Header oder sensible Bodies.

## Interviewfragen mit Antworten

### 1. Warum verwendet HTTP/3 UDP, obwohl HTTP zuverlässige Responses braucht?

UDP stellt die IP-Pakete bereit; QUIC auf UDP implementiert zuverlässige Streams, Verschlüsselung, Flow Control und Loss Recovery. HTTP/3 trägt Requests/Responses auf diesen QUIC Streams. Die Zuverlässigkeit kommt aus QUIC, nicht aus UDP selbst.

### 2. Welchen Blockierungsvorteil hat HTTP/3 gegenüber HTTP/2?

HTTP/2 über TCP kann bei Segmentverlust die geordnete Byteauslieferung für alle Streams einer TCP-Verbindung verzögern. QUIC hat unabhängige Streamzustellung; Verlust für Stream A muss Stream B nicht blockieren, wenn B vollständig verfügbar ist. Netz- und Anwendungsstau bleiben dennoch möglich.

### 3. Was ist QPACK und wieso ist es nicht einfach HPACK?

QPACK ist Headerkompression für HTTP/3. Encoder-/Decoderanweisungen laufen auf eigenen QUIC Streams, damit ein verlorenes Paket nicht die gesamte Request-Bytefolge wie bei HTTP/2/TCP blockiert. Field Sections können jedoch auf dynamische Tabellenreferenzen warten, deshalb bleiben Limits und Observability nötig.

### 4. Was tut Alt-Svc?

Ein Origin kann Clients auf eine alternative Dienstkombination aus ALPN, Host und Port aufmerksam machen, etwa H3 über UDP/443. Der Client muss den alternativen Endpoint trotzdem passend authentisieren; Alt-Svc umgeht keine TLS-Namens- oder Trust-Prüfung und hat eine Freshnessdauer.

### 5. Wann ist ein H2-Fallback sicher?

Wenn er über HTTPS mit der gleichen Serviceidentität sowie konsistenter Authentisierung, Autorisierung, Cache-, Rate-limit- und Retrysemantik läuft. Bei möglicherweise ausgeführter Schreiboperation braucht der Client zusätzlich Idempotenz-/Deduplizierungsschutz, bevor er erneut sendet.

### 6. Wofür eignen sich QUIC DATAGRAMs?

Für Daten, bei denen Verlust, Reordering und Größenbegrenzung akzeptabel sind und Frische wertvoller als garantierte Zustellung sein kann. Sie sind ungeeignet als alleiniger Träger für verlässliche oder nicht wiederholbare Geschäftsoperationen.

### 7. Ist WebTransport bereits eine universelle Produktionsschnittstelle?

Nein. Am Recherche-Cutoff ist WebTransport über HTTP/3 ein IETF-Draft. Implementierungs- und Browser-/Gateway-/Proxyunterstützung muss pro Zielpopulation nachgewiesen werden. Es benötigt eine eigene Origin-, Auth-, Session-, Quota- und Fallbackentscheidung.

## Praktisches Lab: Deklarierter H3- und Fallbackvertrag

**Zweck:** Prüfe H3-Discovery, Pfad, Sicherheit und Fallback als Entscheidungskette ohne reale Verbindung.

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Attempt:
    alt_svc_fresh: bool
    origin_identity_valid: bool
    udp_path_available: bool
    h3_supported: bool
    request_is_idempotent: bool
    datagram_loss_tolerant: bool
    webtransport_capability_proven: bool

def choose_protocol(a: Attempt) -> str:
    if not a.origin_identity_valid:
        return "REJECT: origin TLS identity is not valid"
    if a.alt_svc_fresh and a.udp_path_available and a.h3_supported:
        return "USE: H3 with measured QUIC/H3 limits"
    return "FALLBACK: approved HTTPS H2/H1 only"

def retry_after_unknown_result(a: Attempt) -> str:
    return "RETRY permitted by model" if a.request_is_idempotent else \
           "STOP: require idempotency key or business reconciliation"
```

Fallarbeit:

1. Positiv: frisches Alt-Svc, valide Origin-Identity, erreichbares UDP und nachgewiesenes H3 führen zu H3.
2. Negativ: falsche Zertifikatsidentität muss unabhängig von UDP/H3 zur Ablehnung führen.
3. Negativ: blockiertes UDP führt nur zu sicherem HTTPS-H2/H1-Fallback, nie zu Cleartext.
4. Schreibe eine Operation mit unbekanntem H3-Ergebnis; das Modell darf sie ohne Idempotenz nicht erneut senden.
5. Markiere ein Positionssignal als datagrammverlusttolerant und eine Zahlung als nicht verlusttolerant.
6. Setze `webtransport_capability_proven=False`; diskutiere, warum eine H3-Verbindung allein keine WebTransportfreigabe ist.
7. Zeichne Client–H3 Edge–H2 Backend und benenne für jeden Hop Protokoll, TLS-Endpunkt, Limit, Timeout und Messwert.

**Aufräumen:** Lösche temporäre lokale Dateien/Interpreterzustand. Kein UDP-, QUIC-, HTTP/3-, WebTransport-, TLS-, DNS-, Alt-Svc-, Browser-, Proxy-, Gateway-, Cloud-, Netzwerk- oder Produktionssystem wird verwendet oder verändert.

## Dependencies und Cross-References

| Beziehung | Datei | Zweck |
|---|---|---|
| Requires | [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Hypothesen und Evidenz. |
| Requires | [KB-0057](09-udp-und-datagrammverhalten.md) | UDP-/Datagrammgrundlagen. |
| Requires | [KB-0067](19-tls-verbindungen-und-zertifikatspruefung.md) | TLS, ALPN, Serviceidentität und Terminierung. |
| Requires | [KB-0069](21-http-2-und-multiplexing.md) | H2-/TCP-Vergleich, Multiplexing und Proxyhops. |
| Applies to | KB-0071 | API-/Proxy- und Performanceentscheidung. |
| Applies to | KB-0418 | Plattformgateway und Service-to-Service-Verträge. |
| Applies to | KB-0562 | Edge-/Cloud- und Netzwerkfähigkeiten. |
| Applies to | KB-0720 | Enterprise-/Chief-Level-Steuerung. |

## Quellen und Aktualitätsgrenze

**Recherche-Cutoff: 2026-09-16.** QUIC/H3-/WebTransport-Versionen, Browser-/SDK-/Gateway-/CDN-Unterstützung, UDP-Netzpfade, Defaults und Security Guidance verändern sich. Eine Produktionsentscheidung erfordert die aktuelle Primärdokumentation und Tests für jede reale Client- und Proxypopulation.

1. [RFC 9114 — HTTP/3](https://www.rfc-editor.org/info/rfc9114/) — HTTP-Semantik über QUIC, Control Streams und HTTP/3-Fehler.
2. [RFC 9000 — QUIC: A UDP-Based Multiplexed and Secure Transport](https://www.rfc-editor.org/info/rfc9000/) — QUIC-Transport, Streams, Connection IDs, Migration, Flow/Loss/Congestion Control.
3. [RFC 9001 — Using TLS to Secure QUIC](https://www.rfc-editor.org/info/rfc9001/) — TLS 1.3 in QUIC.
4. [RFC 9204 — QPACK](https://www.rfc-editor.org/info/rfc9204/) — Field Compression für HTTP/3.
5. [RFC 9221 — An Unreliable Datagram Extension to QUIC](https://www.rfc-editor.org/info/rfc9221/) — QUIC DATAGRAM Frames.
6. [RFC 9297 — HTTP Datagrams and the Capsule Protocol](https://www.rfc-editor.org/info/rfc9297/) — HTTP Datagrams und Capsule Protocol.
7. [RFC 7838 — HTTP Alternative Services](https://www.rfc-editor.org/info/rfc7838/) — Alt-Svc Discovery, Freshness, Authentisierung und Fallback.
8. [RFC 9460 — DNS SVCB and HTTPS Resource Records](https://www.rfc-editor.org/info/rfc9460/) — DNS-basierte Service-/ALPN-Information und Alt-Svc-Vergleich.
9. [WebTransport over HTTP/3 — IETF Internet-Draft](https://datatracker.ietf.org/doc/draft-ietf-webtrans-http3/) — zeitabhängiger Draftstatus und Capabilitymodell, abgerufen am 2026-09-16.
10. [KB-0057](09-udp-und-datagrammverhalten.md), [KB-0067](19-tls-verbindungen-und-zertifikatspruefung.md) und [KB-0069](21-http-2-und-multiplexing.md) — lokaler Lernkontext.

## Bonus: New Tech and Innovations

HTTP/3 verbindet QUIC-Multiplexing, TLS 1.3 und moderne HTTP-Priorisierung mit einer Transportbasis, die sich in User Space schneller entwickeln kann als klassische TCP-Stacks. DNS HTTPS/SVCB, ECH-Bootstrapping, QUIC Version 2, HTTP Datagrams und WebTransport zeigen, dass Discovery, Privacy, Echtzeit und Endpunktinteroperabilität gemeinsam entworfen werden müssen.

WebTransport kann künftig browsernahe Echtzeitfälle mit Streams und Datagrammen vereinheitlichen, bleibt am Recherche-Cutoff aber ein sich entwickelnder IETF-Draft. Ein Pilot akzeptiert HTTP/3-, QUIC- oder WebTransport-Innovationen erst, wenn Origin-/TLS-Identität, Discovery, UDP-Erreichbarkeit, Proxypfade, Stream-/QPACK-/Datagrammlimits, Verlust-/Retry-/Fallbacksemantik, Clientfähigkeit, Security, Datenschutz, Kosten, Observability und Rollback für jede betroffene Zielpopulation nachgewiesen sind.

