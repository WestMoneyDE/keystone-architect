---
{"id": "KB-0072", "title": "Forward und Reverse Proxies", "domain": "03", "sequence": 24, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Fehlersuche", "Evidenz"], "needed_for": "both"}, {"id": "KB-0067", "concepts": ["TLS-Termination", "Serviceidentität", "mTLS"], "needed_for": "both"}, {"id": "KB-0068", "concepts": ["HTTP-Semantik", "Authority", "Header", "Pufferung"], "needed_for": "both"}, {"id": "KB-0069", "concepts": ["HTTP/2", "Stream-/Connectiongrenzen", "Protokollhops"], "needed_for": "understanding"}], "related": ["KB-0073", "KB-0074", "KB-0418", "KB-0562", "KB-0720"], "applies": ["KB-0073", "KB-0418", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Das Lab bewertet eine lokale Header-/Trust- und Buffering-Entscheidungsmatrix mit einem nicht ausführbaren NGINX-Konfigurationsmodell. Es startet keinen NGINX-Prozess und öffnet keinen Port.", "rationale": "Die Übung trainiert Proxygrenzen und negative Fälle ohne Netzwerkverkehr, TLS-Zertifikate, Container, Server-, Gateway-, Cloud- oder Produktionsänderung."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein Proxyvertrag definiert Rolle, Owner, Listener, Authority, TLS-/mTLS-Termination, Upstream-Identity, erlaubte Header, Trust-Chain, Forwarded-/X-Forwarded-Semantik, Request-/Response-Buffering, Limits, Timeouts, Caching, Streaming, Retry, Logs, Datenschutz, Failure- und Drainverhalten.", "rationale": "Ein HTTP-prozessierender Proxy ist pro Hop zugleich Server und Client; er darf Originalkontext nur aus nachgewiesen kontrollierten Quellen übernehmen und muss einen neuen, sicheren Upstreamvertrag erzeugen."}, "STAFF-TARGET": {"active": true, "scope": "Teams testen Client-, Edge-, Mesh- und Backendhop mit gefälschten Forwarded Headers, Host-/Authority-Konflikten, falscher TLS-Identity, langsamen Bodies, großen Responses, abgebrochenen Clients, Upstream-Timeouts, Bufferdruck und gestaffeltem Drain.", "rationale": "Sie trennen Peer-IP, deklarierte Client-IP, vertrauenswürdige Chain, TLS- und Upstreamfehler, Request-/Responsebuffering, Streaming/Backpressure, Cache und Anwendung anhand pro-Hop-Evidenz."}, "CHIEF-TARGET": {"active": true, "scope": "Die Organisation steuert Egress-/Forward-Proxies, Ingress-/Reverse-Proxies, TLS-Termination/-Inspection, Clientidentity-/Privacy-, Header-/Logging-, Produkt-/Patch-, Drittanbieter-, Ausnahme- und Kostenpolitik als verbindliche Plattformarchitektur.", "rationale": "Ein breiter Trust für clientgelieferte Header, unklare TLS-Termination oder unkontrolliertes Buffering kann Zugangskontrolle, Datenschutz, Availability, Compliance und Kosten vieler Produkte gleichzeitig gefährden."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "NGINX/Envoy/HAProxy/Apache/IIS-Internals, PROXY protocol, HTTP/2/3-proxied transport, WAF-, cache-/buffer-/event-loop-Tuning, TLS interception CA operation, hardware/load-balancer integration and packet-level tracing are specialist depth.", "rationale": "Die Zielrollen müssen Sicherheitsgrenze, Dienstvertrag, Limits, Ownership, Tests und Nachweise steuern; produktspezifische Konfiguration und Laufzeitoptimierung erfolgt mit Plattform-, Netzwerk- und Security-Spezialisten."}}, "lab_validation": [{"lab_id": "KB-0072-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox und nicht ausgeführtes NGINX-Konfigurationsmodell ohne Netzwerkzugriff", "evidence": "Headerwerden, Trust-Chain, Terminierungsgrenze, Request-/Responsebuffering, Host-/Authority-Validierung und negative Spoofingfälle wurden als deklarative Fallarbeit geprüft.", "limitations": "Nicht ausgeführt; kein NGINX, Socket, Port, TLS-Zertifikat, Proxy, Cache, Container, Server, Gateway, Cloud-, Netzwerk- oder Produktionssystem wurde verwendet oder verändert."}]}
---
# Forward und Reverse Proxies

> **Ziel:** Ein Proxy verändert einen Kommunikationspfad. Ein Forward Proxy vertritt den Client gegenüber externen Zielen; ein Reverse Proxy vertritt einen Dienst gegenüber Clients. Beide sind auf ihrem Eingangs-Hop Server und auf ihrem Ausgangs-Hop Client. Darum müssen Identität, Authority, TLS, Header, Buffer, Timeouts und Datenschutz pro Hop neu definiert werden.

## Purpose, Definition und Scope

Forward und Reverse Proxies vermitteln HTTP- oder Tunnelverkehr zwischen zwei Seiten. Ein **Forward Proxy** wird vom Client oder dessen Organisation als Egress-Vermittler gewählt: Er kann Ziele erlauben, Egress steuern, Caches betreiben oder Zugriffe protokollieren. Ein **Reverse Proxy** steht vor einem oder mehreren Origins: Er kann TLS terminieren, nach Host/Path routen, Raten begrenzen, Responses cachen, Anwendungen abschirmen und neue Upstreamverbindungen aufbauen.

Dieses Kapitel erklärt Rollen, Headerweitergabe, TLS-Termination, Clientidentität, Buffering und Fehlergrenzen. Es nutzt NGINX als ein **nicht ausgeführtes Konfigurationsmodell**, nicht als universelle Produktvorgabe. Die konkrete Produktversion und die tatsächliche Mehrhoptopologie sind vor jedem Einsatz maßgeblich. HTTP-Parsing, Authority und Connection Management sind in KB-0068 kanonisch beschrieben; TLS in KB-0067; HTTP/2- und HTTP/3-Hops in KB-0069 und KB-0070.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Ein Proxy ist eine neue Sicherheits-, Terminierungs-, Header- und Ressourcenverarbeitungsgrenze. |
| HANDS-ON-TARGET | Lokale Vertrauens-/Bufferfallarbeit, kein gestarteter Proxy. |
| ARCHITECT-TARGET | Rolle, Terminierung, Header-Trust, Upstream-Identity, Limits, Buffer, Timeouts und Beobachtbarkeit bilden einen Vertrag. |
| STAFF/PRINCIPAL | Mehrhop- und Negativtests zeigen, welcher Proxy welche Behauptung über Client und Request bilden darf. |
| CHIEF | Proxy-/Egress-/TLS-/Privacy-/Lieferantenpolitik wird als gemeinsame Plattformfähigkeit geführt. |

## Mental Model: Jeder L7-Proxy erzeugt zwei Verbindungen

```text
client -- connection A --> proxy -- connection B --> upstream
             proxy is server       proxy is client
```

Der Proxy kann auf beiden Seiten unterschiedliche Protokolle verwenden:

```text
browser -- TLS + HTTP/2 --> edge reverse proxy -- mTLS + HTTP/1.1 --> app
employee -- HTTP CONNECT --> forward proxy -- TLS --> external origin
```

Connection A und B teilen nicht automatisch TCP-/QUIC-/TLS-Schlüssel, Connection Pools, Stream IDs, Timeouts, Peer-IP oder Headers. Der Proxy entscheidet, welche Semantik von A als kontrollierte Aussage auf B neu erzeugt wird.

```text
incoming peer IP       = direct transport peer to proxy
claimed client IP      = Header value; untrusted until trust chain validates it
original scheme/host   = application claim; trusted only from defined terminator
upstream peer identity = TLS/mTLS/route policy for connection B
```

## Prerequisites und Dependencies

| ID | Art | Warum sie hier nötig ist |
|---|---|---|
| [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Verständnis und Lab | Mehrhophypothesen und Evidence. |
| [KB-0067](19-tls-verbindungen-und-zertifikatspruefung.md) | Verständnis und Lab | Zertifikate, SNI, TLS-/mTLS-Termination. |
| [KB-0068](20-http-1-1-und-verbindungsnutzung.md) | Verständnis und Lab | HTTP-Authority, Header, Framing und Bufferingkontext. |
| [KB-0069](21-http-2-und-multiplexing.md) | Verständnis | Stream-/Connectiongrenzen und Protokollhops. |

## Core Concepts

### Forward Proxy

Ein Forward Proxy ist im Regelfall eine Client-/Egresskontrolle. Der Client spricht zuerst den Proxy an; der Proxy baut dann eine Verbindung zum Ziel auf oder vermittelt ein Tunnelprotokoll. Beim expliziten HTTP-Proxy kann die Request Line absolute-form enthalten. Für HTTPS ist häufig `CONNECT` relevant: Der Client bittet um einen Tunnel zu Host und Port; nach erfolgreichem Aufbau transportiert der Tunnel Bytes, oft für TLS zwischen Client und Zielorigin.

```text
client -> forward proxy:
CONNECT api.partner.example:443 HTTP/1.1
Host: api.partner.example:443

proxy -> client:
HTTP/1.1 200 Connection Established

then: tunnel bytes; client and origin may establish TLS through it
```

| Kontrollziel | Forward-Proxy-Frage |
|---|---|
| Zielbeschränkung | Welche Hosts, Ports, IP-/DNS-Klassen und Kategorien dürfen erreicht werden? |
| Clientidentität | Wie authentisiert der Proxy den aufrufenden Nutzer/Workload? |
| Egressnachweis | Welche Requests/Tunnel sind auditierbar, wie werden Daten minimiert? |
| DNS | Wer löst den Namen auf, und welche DNS-/SSRF-/Rebinding-Policy gilt? |
| TLS | Ist es ein reiner Tunnel, oder ist TLS-Inspection rechtlich, technisch und organisatorisch explizit erlaubt? |
| Availability | Was passiert bei Proxy-, PAC-, Zertifikats-, Auth- oder Zielauflösungsfehler? |
| Kosten | Wie werden Egress, Inspection, Logging und Hochverfügbarkeit gemessen? |

**TLS-Inspection** ist keine normale Proxyfunktion, die implizit eingeschaltet werden darf. Sie benötigt eine kontrollierte Unternehmens-CA/Trust-Verteilung, transparente Scope-/Privacy-/Complianceentscheidung, Ausschlussklassen, sichere Schlüsselverwaltung, klare Clientpopulation, Incidentpfade und eine valide Upstream-TLS-Prüfung. Sie kann End-to-End-Eigenschaften verändern und Software-/Zertifikatspinning inkompatibel machen.

### Reverse Proxy

Ein Reverse Proxy repräsentiert serverseitige Origins. Ein Client adressiert die öffentliche Authority; der Proxy routet zu einem Upstream und kann dort einen anderen Hostnamen, ein anderes Netzwerk und eine getrennte TLS-/mTLS-Identität verwenden.

```text
public client
  -> https://api.example.com
  -> edge validates client request and terminates TLS
  -> edge creates HTTPS/mTLS connection to orders.backend.internal
  -> backend validates edge/workload identity and authorized forwarding contract
```

| Funktion | Nutzen | Vertragspflicht |
|---|---|---|
| TLS termination | zentrale Zertifikat-/Cipher-/ALPN-Policy | Klartextzone, Backend-Schutz, Logging und Client-Identity. |
| Routing | vHost/path-/method-based Dispatch | Authority-/Host-Allowlist, Path-Normalisierung, Tenant-/Routeownership. |
| Load balancing | Verteilung auf Upstreams | Healthsemantik, Drain, Reuse, Session-/State- und Retrypolicy. |
| Rate limiting/WAF | Schutz vor teuren Upstreamoperationen | echte Clientidentity und datenschutzgerechte Schlüssel. |
| Caching | niedrigere Latenz/Originlast | Cache Key, Auth-/Tenantisolation, Freshness/Invalidation. |
| Buffering/Streaming | Entkopplung und Ressourcensteuerung | Body-/Headerlimits, Backpressure, Timeout und Cancel. |
| Observability | einheitliche Ereignisse | sichere Correlation, Redaction und Hop-spezifische Latenz. |

Ein Reverse Proxy ist kein „sicheres internes Netz“. Der Backend-Hop ist eine neue Verbindung mit eigener TLS-/mTLS- und Authorisierungspolicy. Eine entgegengenommene Headerbehauptung ersetzt weder Workload Identity noch Anwendungsauthorisierung.

### Header: Ende-zu-Ende-Information gegen pro-Hop-Behauptung

Ein Proxy kann Header lesen, entfernen, ergänzen oder neu bilden. Das ist mächtig und gefährlich. Header wie `Host`, `Forwarded`, `X-Forwarded-For`, `X-Forwarded-Proto`, `X-Forwarded-Host`, `Authorization`, Cookies, `Connection` und `Via` haben unterschiedliche Sicherheits-, Privacy- und Hop-Semantik.

RFC 7239 standardisiert das optionale `Forwarded`-Feld, mit etwa `for`, `by`, `host` und `proto`. Es ist wertvoll, wenn die Chain kontrolliert ist, kann sensible Ursprungs-/Topologieinformation offenlegen und soll bewusst, nicht pauschal aktiviert werden. `X-Forwarded-*` sind verbreitete Konventionen, aber nicht derselbe Standardvertrag.

```text
untrusted client sends:
X-Forwarded-For: 10.0.0.1
X-Forwarded-Proto: https

public edge sees TCP peer = 198.51.100.27
  -> remove or overwrite client-supplied forwarding headers
  -> construct edge-owned forwarding metadata
  -> backend accepts it only from edge identity/network
```

**Kein Backend darf eine clientgelieferte Forwarded-/X-Forwarded-Behauptung direkt für Zugriffskontrolle, Rate Limit, Redirect-Scheme, Mandantentrennung oder Audit verwenden.** Die Aussage wird erst vertrauenswürdig, wenn der direkte Peer als erlaubter Proxy authentisiert/autorisiert ist und jede vorherige Headerinstanz nach festgelegter Policy entfernt oder nachweisbar normalisiert wurde.

### Vertrauenskette und Client-IP

Unterscheide drei Werte:

| Wert | Quelle | Vertrauensstatus |
|---|---|---|
| `peer_ip` | TCP/QUIC-Remoteadresse des direkten Peers | technisch beobachtet, sagt aber bei Proxy nur etwas über den letzten Hop. |
| `claimed_client_ip` | `Forwarded` oder `X-Forwarded-For` | untrusted, bis ein kontrollierter Proxy ihn neu gebildet hat. |
| `trusted_client_ip` | aus definierter proxy-authenticated Chain extrahiert | nur für den expliziten Zweck und unter Datenschutz-/Spoofingpolicy. |

Ein Beispiel für eine **öffentliche Edge-Grenze** ist Overwrite statt Append:

```nginx
# Konzeptionelles Modell: nur am öffentlichen, direkt vom Client erreichbaren Edge.
# Vor Produktnutzung: Server Names, CIDRs, TLS, Limits und Produktversion prüfen.
location / {
    proxy_pass https://orders_backend;

    # upstream authority ist bewusst festgelegt, nicht aus unvalidiertem Client-Host abgeleitet
    proxy_set_header Host orders.backend.internal;

    # client supplied X-Forwarded-* wird an dieser öffentlichen Grenze nicht übernommen
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto https;
    proxy_set_header X-Forwarded-Host api.example.com;

    proxy_set_header X-Request-ID $request_id;
}
```

Das Beispiel beweist keine vollständige Sicherheit. Es muss in einer realen Topologie mit vHost-/Hostvalidierung, Headerlimits, TLS-/mTLS-Policy, Upstreamzertifikatsprüfung, getrennten Netzen und observierter Client-/Proxychain kombiniert werden. `$remote_addr` ist nur dann die direkte Clientadresse, wenn am Edge kein weiterer unmodellierter L4-/CDN-/Proxyhop davorliegt.

### NGINX Real IP: Trust wird konfiguriert, nicht erraten

Das NGINX Real-IP-Modul kann die Clientadresse aus einem spezifizierten Header übernehmen, aber nur von explizit konfigurierten vertrauenswürdigen Adressen/Netzen. `set_real_ip_from` markiert zulässige Quellen, `real_ip_header` wählt das Feld, und `real_ip_recursive` beeinflusst die Auswertung einer Headerkette. Diese Funktion darf nur hinter einer nachgewiesenen, begrenzten L4-/CDN-/Proxygrenze konfiguriert werden.

```nginx
# Konzeptionelles Modell für einen internen Reverse Proxy.
# Die CIDR/Identität muss der tatsächlichen vorgelagerten, vertrauenswürdigen Edge entsprechen.
set_real_ip_from 192.0.2.0/24;
real_ip_header X-Forwarded-For;
real_ip_recursive on;

location / {
    proxy_pass https://orders_backend;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

Dieses Modell ist **nicht** für einen Internetlistener kopierbar. Wenn `set_real_ip_from` zu breit ist oder ein nicht vertrauenswürdiger Peer den Header setzen kann, wird `$remote_addr` manipuliert. `real_ip_recursive on` ist kein Sicherheitsupgrade ohne exakte Chainkenntnis; es ändert nur, wie Werte entlang einer als vertrauenswürdig definierten Kette bewertet werden. Eine alternative Architektur verwendet mTLS/Workload Identity zwischen Proxies und übergibt eine signierte oder an diesen Peer gebundene Clientkontextbehauptung mit klarer Lebensdauer.

### Authority, Host und Scheme

Ein Proxy muss den Zielorigin und das Routing ohne Raterei bestimmen. Für öffentliche Eingänge sind erlaubte Authorities/Hostnamen, TLS-SNI/VHost-Konfiguration und Routen bewusst zu koordinieren. Ein beliebiger Host Header darf nicht eine interne Upstream-URL, einen Passwort-Reset-Link oder eine Redirect-Authority bestimmen.

```text
client URL authority + SNI + TLS certificate
  -> edge listener/vHost allowlist
  -> normalized internal route
  -> fixed or route-approved upstream authority
  -> backend receives only trusted original-host/scheme metadata
```

`X-Forwarded-Proto: https` sagt einem Backend nur dann etwas, wenn der direkte Peer ein vertrauter TLS-Terminator ist. Sonst kann ein Angreifer sichere-Cookie-, Redirect-, CORS- oder Authentscheidungen beeinflussen.

## Terminierung und Datenfluss

### TLS termination, passthrough und re-encryption

```text
A) passthrough:
client TLS ------------------------------------------> backend TLS endpoint

B) edge termination:
client TLS --> edge plaintext processing --> backend protected separately

C) re-encryption / mTLS:
client TLS --> edge terminates --> new TLS/mTLS --> backend
```

| Modell | Wann es passen kann | Verpflichtung |
|---|---|---|
| TLS passthrough | Backend muss originale TLS-Session/Clientcert sehen | L7-Routing/WAF/Caching eingeschränkt, Backend skalierbar machen. |
| Edge termination + protected Backend | Edge benötigt L7-Funktionen | Klartext am Edge dokumentieren; Backendhop mit TLS/mTLS-/Netz- und Identitypolicy schützen. |
| TLS re-encryption | zentrale Edgefunktion plus verschlüsselter Backendhop | zwei Zertifikats-/Trust-/Hostname-/Timeout-Paare testen. |
| mTLS intern | Workload-to-workload Identity | Zertifikatsidentität in Principal-/Authorization-Vertrag übersetzen. |

Das Original-TLS endet am Terminator. Jede Annahme über „Ende-zu-Ende-verschlüsselt“ muss deshalb die realen Endpunkte nennen. TLS passthrough mit einem TLS-inspecting Forward Proxy ist keine neutrale Variante, sondern eine andere Sicherheits- und Datenschutzentscheidung.

## Buffering, Streaming und Backpressure

Ein Proxy kann Request Bodies vor dem Upstream teilweise oder vollständig puffern und Responses vom Upstream puffern, bevor er an den Client sendet. NGINX bietet dafür eigene Request-/Response-Buffering-Steuerungen; deren konkrete Defaults und Storageverhalten müssen für die verwendete Version geprüft werden.

```text
request buffering:
slow client -> proxy buffer/disk/memory -> upstream starts after policy point

request streaming:
slow client ---------------------------> upstream receives incrementally

response buffering:
upstream -> proxy buffer/disk/memory -> client

response streaming:
upstream -----------------------------> slow client
```

| Entscheidung | Vorteil | Risiko/Trade-off |
|---|---|---|
| Request buffering | schützt Upstream vor Slow Upload; kann vor Weitergabe prüfen | Memory/disk, Latenz, große Bodies; Failover nach Begonnenem Stream eingeschränkt. |
| Request streaming | niedrige Startlatenz, große Streams | Slow Client bindet Upstream; Backpressure/Cancel/limits müssen sauber sein. |
| Response buffering | entkoppelt Upstream von Slow Clients; Caching möglich | Memory/disk und höhere TTFB, besonders bei großen/streaming Responses. |
| Response streaming | frühe Daten und niedriger Bufferbedarf | Slow downstream wirkt zurück; Cache/Retry/observability komplexer. |
| Disk spill | schützt RAM bei großen Buffern | I/O, Datenschutz, Verschlüsselung/Retention und Capacity. |

Nginx `proxy_request_buffering` und `proxy_buffering` sind keine bloßen Performanceflags. Bei deaktiviertem Request Buffering wird der Body an den Upstream gesendet, während er vom Client eintrifft; wenn die Übertragung bereits begonnen hat, ist ein Upstreamwechsel für diese Request semantisch begrenzt. Response-Buffering und temporäre Dateien können personenbezogene oder sensitive Daten verarbeiten. Datenklassifikation und Bereinigung gehören in das Design.

### Abstraktes NGINX-Bufferingmodell

```nginx
# Nicht ausführen. Konzeptionelles Modell, keine Produktfreigabe.
location /upload {
    client_max_body_size 10m;

    # bewusst: Slow clients werden vor Upstreamübertragung begrenzt
    proxy_request_buffering on;
    proxy_buffering on;

    # Produkt- und route-spezifische Werte müssen per Last-/Privacytest bestimmt werden
    proxy_connect_timeout 2s;
    proxy_send_timeout 30s;
    proxy_read_timeout 30s;

    proxy_pass https://uploads_backend;
}
```

Für eine echte Streamingroute kann die andere Wahl korrekt sein, jedoch nur zusammen mit Client-/Upstream-Timeoutbudget, Body-/Rate-Limit, cancellation, Backpressure, Fehler-/Retrysemantik, Temp-Storagepolicy, Observability und Capacitytest.

## Konfiguration und Implementierung

### Abstrakter Proxyvertrag

```yaml
proxy_role: reverse-edge
listener:
  public_authorities: ["api.example.com"]
  client_protocols: ["h2", "http/1.1"]
  client_tls_termination: true
upstream:
  authority: "orders.backend.internal"
  protocol: "h2"
  mTLS: required
identity:
  direct_peer_policy: "public-client-at-edge"
  forwarded_headers: "discard-untrusted; construct-edge-owned"
  backend_acceptance: "edge-workload-identity-only"
limits:
  request_line_bytes: 8192
  header_bytes: 32768
  request_body_bytes: 10485760
  concurrent_requests: "capacity-derived"
timeouts:
  client_header: 10s
  upstream_connect: 2s
  upstream_headers: 15s
buffering:
  request: "route-specific"
  response: "route-specific"
logging:
  redact: ["authorization", "cookie", "sensitive-query", "body"]
```

Dieses Modell zeigt, welche Entscheidungen explizit sein sollen. Produktkonfiguration muss die tatsächliche Syntax, Defaults, Headerinteraktionen, Temp-Dateipfade, TLS-Validierung, DNS-Resolver, Worker-/Eventloop- und Restartsemantik nachweisen.

### Timeouts, Retries und Circuit Breaking

Ein Proxy ist keine Berechtigung, unendlich zu warten oder nicht-idempotente Arbeit zu wiederholen. Ein End-to-End-Budget wird über Client Header/Body, Edge Queue, Upstream Connect, TLS, Upstream Header/Body, Buffering und mögliche Retries verteilt. Ein Upstreamwechsel nach gesendetem Request Body kann fachlich unklar sein. Circuit Breaking und Outlier Detection können Schutz bieten, benötigen aber eine definierte Healthsignal-, Half-open-, Recovery- und Loadtestsemantik.

```text
request deadline 2s
  edge queue       0.10s
  upstream connect 0.20s
  upstream first byte 1.30s
  body/return      0.20s
  reserve          0.20s
```

### Sichere Change-Sequenz

1. Inventarisiere alle Hops, Authorities, TLS-Endpunkte, Proxyrollen, DNS, Client-/Backendprotokolle, Header, Trustquellen, Buffering, Tempstorage, Limits und aktuelle SLOs.
2. Erstelle ein Data-Flow-Diagramm mit `peer_ip`, claimed/trusted client identity, Originalscheme/authority, TLS-/mTLS-Trust, Cleartextzonen und sensiblen Header-/Bodydaten.
3. Teste fehlende/doppelte/gefälschte Forwarded-/X-Forwarded-/Host-/Proto-Headers, untrusted Proxyquellen, falsche Upstreamzertifikate, Body-/Headerlimits, Slow Clients, große Responses, Diskspill, Cancel, 502/504, Upstreamdrain und Fallback.
4. Rolle in kleine Routen/Clientkohorten aus; beobachte hopbezogene Latenz, buffer/disk/memory, active/idle upstream connections, error class, trusted-header rejects und Datenredaktionsverletzungen.
5. Drain Verbindungen kontrolliert; rolle auf geprüfte sichere Policy/Version zurück, nicht auf unbounded Headertrust oder deaktivierte TLSprüfung.
6. Entferne Migrationausnahmen und temporäre Header-/Buffer-/Timeoutwerte nach gemessener Stabilisierung.

## Scalability, Performance und Reliability

### Kapazitätsmodell

Proxies konsumieren File Descriptors, Sockets, TLS/QUIC-/HTTP-State, Worker CPU, Memory, Buffer, Temp-Disk, Cache, Upstreampools und Logvolumen. Messe unabhängig von Request/Sekunde:

```text
proxy_connections{hop,state}
proxy_requests_total{route,status_class}
proxy_upstream_connect_seconds{upstream}
proxy_upstream_response_headers_seconds{upstream}
proxy_buffer_bytes{direction=request|response}
proxy_temp_storage_bytes{route}
proxy_header_rejected_total{reason}
proxy_upstream_pool_queue_seconds{upstream}
proxy_trusted_identity_total{source=edge|mesh|rejected}
proxy_retries_total{reason}
```

Ein 504 kann Clientupload, Buffer, Edgequeue, DNS, Upstreamconnect, TLS, Backendpool, Anwendung oder Responsebackpressure sein. Eine 200 kann aus Cache kommen und nicht den Origin beweisen. Prüfe deshalb Request ID/Tracehop, aber ohne Secrets oder unkontrolliert hochkardinale Header in Standardlogs.

### Failure Modes und Troubleshooting

| Symptom | Mögliche Ursache | Sichere nächste Prüfung |
|---|---|---|
| Backend sieht falsche Client-IP | untrusted XFF übernommen, falsches Real-IP trustset, Chainappend | direct peer, header mutations, allowed proxy identity/CIDR und configversion prüfen. |
| Redirect auf falsches Host/Scheme | `Host`/proto spoofed, terminator contract broken | edge authority, TLS, trusted forwarded policy, backend URL builder prüfen. |
| 400 am Edge | Host/header/framing/limit invalid | Parserreason, route policy, redigierte Testrequest. |
| 502/504 | DNS/connect/TLS/upstream/timeout/buffer failure | client-edge und edge-upstream timings, TLS identity, pool, retry split. |
| Upstream overrun by slow clients | request streaming, missing rate/body limit | request buffering, read rate, active upload and backend concurrency. |
| Memory/disk spike | response/request buffering, temp file, cache, large bodies | buffer/temp metrics, route/data class, I/O and cleanup policy. |
| Client gets stale/wrong data | cache key/tenant/auth policy | cache identity/freshness/variation, bypass and purge. |
| only some routes fail after proxy reload | h1/h2/h3 or upstream policy difference | protocol per hop, drained connections, route config diff. |
| TLS works client-side but backend fails | termination/re-encryption misconfigured | edge-backend SNI, chain, mTLS identity and allowlist. |

## Security, Governance und Compliance

Proxy policy is security policy. Review at least:

- **Identity:** Direct peer, client identity, workload identity, user identity and authority are separate claims with separate evidence.
- **Header trust:** Public ingress overwrites/strips untrusted forwarding headers. Internal receivers only honor headers from named, authenticated proxy paths.
- **TLS:** Termination, cleartext zones, upstream TLS/mTLS, certificate validation and inspection scope are documented and owned.
- **Egress:** Forward-proxy targets, DNS, CONNECT ports, private-address/metadata access, auth and logging follow egress policy.
- **Data:** Authorization, cookies, client IPs, URI query, request/response bodies, temp files, cache and debug dumps are classified, redacted, retained and deleted correctly.
- **Availability:** Limits defend backend, but health checks and critical control paths receive explicit controlled treatment.
- **Change:** Config as code, peer review, staged rollout, immutable version evidence, secret rotation and tested rollback.
- **Suppliers:** CDN/WAF/LB/managed proxy terms identify TLS, headers, IP data, cache, region, incident and evidence ownership.

A proxy that preserves privacy may intentionally omit `Forwarded` information. A proxy that needs traceability may use minimally necessary, bounded/obfuscated values. Neither decision should be made accidentally by a default logging or headerappend rule.

## Cost und FinOps

Proxy costs include compute, TLS/QUIC handshakes, connection concurrency, buffer RAM, temp disk I/O, cache storage/hit rate, egress, WAF/CDN/managed gateway pricing, logs/traces and operational support. A high cache hit rate can lower Origin cost but increase data-isolation risk if keys are wrong. Turning off buffering can reduce buffer cost while moving pressure to upstreams.

| Decision | Cost benefit | Hidden cost |
|---|---|---|
| Central reverse proxy | shared policy/operations | central capacity and blast radius. |
| Forward proxy inspection | egress governance | CA/key/CPU/privacy/compliance and compatibility. |
| Response buffering | protects origin from slow clients | RAM/disk/TTFB/data retention. |
| Streaming | early delivery/less buffer | upstream concurrency/backpressure. |
| Shared cache | lower origin/egress load | isolation, invalidation/storage, debugging. |
| mTLS backend | identity control | certificate lifecycle and handshake capacity. |

Measure per route and data class. Do not decide by total proxy throughput alone.

## Trade-offs und Anti-Patterns

| Decision | Advantage | Cost/Risk | Required control |
|---|---|---|---|
| Forward proxy tunnel | external TLS can remain end-to-end | reduced L7 visibility | egress target/auth policy. |
| TLS inspection | policy/content visibility | major trust/privacy/compatibility cost | explicit CA/scope/governance. |
| Reverse TLS termination | central L7 capabilities | cleartext at edge, new backend hop | mTLS/re-encryption and data policy. |
| Append XFF | preserves chain inside trusted network | spoofing if boundary is wrong | strip/overwrite at entry, peer auth. |
| Request buffering | protects upstream | disk/memory/latency | route-specific limits/retention. |
| Stream-through | lower TTFB | backpressure/upstream tie-up | cancel/timeout/rate limits. |

**Anti-Patterns**

- `X-Forwarded-For` oder `Forwarded` von öffentlichen Clients als Clientidentität verwenden.
- Einen Forward Proxy, Reverse Proxy, TLS terminator und WAF als dieselbe Vertrauensgrenze behandeln.
- TLS am Edge terminieren und den Backendhop als automatisch privat/sicher annehmen.
- `$proxy_add_x_forwarded_for` am öffentlichen Edge nutzen, ohne untrusted Header vorher zu entfernen oder zu überschreiben.
- Host-/Scheme-Headers aus jeder Quelle für Redirect, Cookie oder Tenantlogik akzeptieren.
- Buffering global an/aus schalten, ohne Bodyklasse, Backpressure, Temp Disk, Datenklassifikation und Timeoutbudget.
- Nicht-idempotente Requests nach teilweise gesendeten Bodies blind auf neuen Upstream wiederholen.
- Proxydebuglogs mit Authorization, Cookies, Headerblöcken oder Bodies dauerhaft speichern.
- NGINX-Snippets ohne Produktversion, Trust-CIDR/Identity, Architekturdiagramm und Negativtest kopieren.

## Staff-Level Decisions

Ein Staff-/Principal-Entscheidungsrecord beantwortet:

1. Ist jede Komponente Forward Proxy, Reverse Proxy, Gateway, Tunnel oder L4 Load Balancer und wer besitzt sie?
2. Welche Authorities, Ziele, Ports, TLS-/mTLS-Identitäten und Protokolle gelten auf **jedem** Hop?
3. Welche `peer_ip`, client-/workload-/useridentity und `Forwarded`-/X-Forwarded-Behauptungen sind jeweils vertrauenswürdig und warum?
4. Welcher Edge overwrites untrusted Header, welcher internal hop darf verifizierte Chainwerte erweitern, und wie werden Header für Backends neu erzeugt?
5. Welche Routen buffer/streamen Request und Response, mit welchen Größen, Raten, Temppfaden, Storage-/Privacyregeln und Cancel?
6. Wie werden Retry, timeout, circuit break, health and drain für idempotente und nicht-idempotente Operations getrennt?
7. Wie trennen Metrics/Logs/Traces Client-Edge, Edge-Backend, Cache, DNS, TLS, connection pool, buffer and application?
8. Welche Client-/Proxy-/CDN-/VPN-/Backendmatrix beweist H1/H2/H3-, TLS-, Forwarded- und Bufferkompatibilität?

## Chief-Level Decisions

Chief-Level schafft einen gemeinsamen Proxyrahmen:

- Standardisiere Edge, Egress, Gateway, Headertrust, TLS termination/mTLS, logging/redaction, limits, caching and exception lifecycle.
- Ernenne Ownership für managed CDN/WAF/LB/mesh/proxy und ihre Zertifikats-, Update-, Incident- und Auditverträge.
- Bewerte TLS inspection, client-IP persistence, location/region and proxy logs als Datenschutz- und Complianceentscheidung, nicht als technische Defaultoption.
- Erzwinge config-as-code, Review, staged rollout, drift detection, secure emergency change and post-incident learning.
- Berichte Sicherheit und Leistung als konkrete Messwerte: spoofed-header rejections, untrusted peer attempts, upstream identity failures, timeout/buffer saturation, cache isolation defects and temporary exceptions.
- Investiere in Proxy capacity and resilience by route/data class, including dependency outage and vendor/CDN failure scenarios.

## Production Checklist

- [ ] Alle L4-/L7-/Forward-/Reverse-/Gateway-/CDN-/Mesh-Hops sind mit Owner, Listener, Authority, Protokoll und Terminierung dokumentiert.
- [ ] TLS-/mTLS-Identity und Trust Stores sind auf Client-, Edge- und Backendhop getestet.
- [ ] Öffentliche Eingangspunkte entfernen/überschreiben untrusted `Forwarded`-/`X-Forwarded-*`-Headers.
- [ ] Backends akzeptieren Forwarded-/Clientkontext nur von explizit authentisierten/autorisierten Proxyquellen.
- [ ] Host/Authority/SNI/original scheme und Backendauthority sind als Allowlist/Vertrag vorhanden.
- [ ] Header-, Request-Line-, Body-, Stream-, Rate-, Connection-, Buffer- und Tempstorage-Limits sind route- und datenklassenspezifisch getestet.
- [ ] Request-/Responsebuffering, streaming, cancel, retry, upstream switch, timeouts and drains have documented semantics.
- [ ] Cache Keys, `Vary`, auth/tenant isolation, purge and stale behavior are validated.
- [ ] Logs, traces, error pages, cache/temporary files and inspection paths redact/retain/delete sensitive data correctly.
- [ ] NGINX/product version, modules, defaults, secrets, config review and rollback are verifiable.
- [ ] Negative tests cover spoofed headers, wrong peer, invalid host, TLS error, slow/large/aborted body, cache leak, upstream failure and proxy reload.

## Interviewfragen mit Antworten

### 1. Was unterscheidet einen Forward von einem Reverse Proxy?

Ein Forward Proxy vertritt den Client gegenüber vielen externen Origins und kontrolliert typischerweise Egress. Ein Reverse Proxy vertritt einen oder mehrere serverseitige Origins gegenüber Clients und kontrolliert typischerweise Ingress/Routing. Beide erzeugen auf ihrem Ausgangshop eine neue Clientverbindung.

### 2. Wann ist `X-Forwarded-For` vertrauenswürdig?

Nur wenn die Anwendung die direkte Proxyquelle nachweisbar kontrolliert und die Kette an einer definierten Boundary bereinigt/neu erzeugt wurde. Ein öffentlich erreichbarer Client kann den Header selbst setzen; dann ist sein Inhalt keine Clientidentität.

### 3. Was endet bei TLS-Termination?

Der ursprüngliche TLS-Kanal endet am Terminator. Ein Backendhop braucht eigene Verschlüsselung/Identity, zum Beispiel TLS oder mTLS. Header über das ursprüngliche Scheme oder die IP sind nur innerhalb des Proxyvertrauensmodells Aussagen.

### 4. Wann ist Request Buffering sinnvoll?

Wenn der Proxy langsame Uploads begrenzen oder vor Weitergabe kontrollieren soll und RAM/Disk/Latency/Privacy dafür vorgesehen sind. Für große/streamende Requests kann es ungeeignet sein. Die Entscheidung hängt von Route, Upstreamschutz, Cancel, Failover und Datenklasse ab.

### 5. Warum kann ein Proxy nicht jede fehlerhafte Request wiederholen?

Nach teilweise oder vollständig gesendetem Body kann der Upstream die Operation bereits verarbeitet haben. Besonders bei nicht-idempotenten Handlungen kann Retry Duplikate erzeugen. Retry braucht Methoden-/Idempotency-/Error-/Budget-/Backend-Evidenz.

### 6. Warum ist TLS Inspection ein Governance-Thema?

Inspection verändert, wer Klartext, Clientidentität und Zertifikatsvertrauen sieht. Sie benötigt Trust-Distribution, Schlüssel-/CA-Betrieb, Privacy-/Complianceentscheidung, Ausnahmen, Kompatibilitätstest und klare Verantwortlichkeit.

### 7. Was zeigt eine 504 vom Reverse Proxy?

Sie zeigt zunächst, dass der Proxy innerhalb seines Timeout-/Upstreamvertrags keine erfolgreiche Antwort erlangt hat. Ursache kann Queueing, DNS, Connect, TLS, Pool, Backend, Responsebackpressure oder Policy sein. Client-Edge und Edge-Upstream müssen getrennt diagnostiziert werden.

## Praktisches Lab: Header-Trust und Buffering als lokales Modell

**Zweck:** Bewerte, welche Header ein Proxy weitergeben darf und welche Bufferpolicy zu einer Route passt. Die Funktion modelliert keine HTTP-/NGINX-Implementation.

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class ProxyInput:
    direct_peer_is_trusted_proxy: bool
    incoming_xff: str | None
    peer_ip: str
    route: str
    request_body_bytes: int
    streaming_required: bool

def forwarded_client_ip(i: ProxyInput) -> str:
    if i.direct_peer_is_trusted_proxy and i.incoming_xff:
        return "USE: validated proxy-chain value after policy parsing"
    return f"USE: direct peer only ({i.peer_ip})"

def request_buffering(i: ProxyInput) -> str:
    if i.request_body_bytes > 10_000_000:
        return "REJECT: route body limit"
    if i.streaming_required:
        return "STREAM: require upstream backpressure/cancel/rate controls"
    return "BUFFER: require memory/disk/privacy/timeout budget"
```

Fallarbeit:

1. Öffentlicher Peer sendet `X-Forwarded-For: 10.0.0.1`: Ergebnis muss direkte Peer-IP sein.
2. Ein nachweisbar erlaubter Edge sendet eine bereits normalisierte Chain: dokumentiere genau, welches Glied die Anwendung nutzen darf.
3. Eine Route mit 20 MB Body überschreitet die Modellgrenze und wird vor dem Upstream abgewiesen.
4. Eine Streamingroute wird nicht einfach gepuffert; ergänze Rate, upstream timeout, cancel and data-class policy.
5. Zeichne Client → TLS edge → mTLS backend und markiere Klartext-/Header-/Trustgrenzen.
6. Prüfe, ob `Host`, `X-Forwarded-Proto` und `Authorization` aus einer untrusted Anfrage am Backend ankommen dürften.
7. Ergänze eine Konfigurationsänderung und benenne erforderliche Negativtests und Rollbacksignale.

**Aufräumen:** Lösche temporäre lokale Dateien/Interpreterzustand. Es werden kein NGINX-Prozess, Socket, Port, TLS-Zertifikat, Proxy, Cache, Container, Server, Gateway, Cloud-, Netzwerk- oder Produktionssystem verwendet oder verändert.

## Dependencies und Cross-References

| Beziehung | Datei | Zweck |
|---|---|---|
| Requires | [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Mehrhopdiagnose und Evidenz. |
| Requires | [KB-0067](19-tls-verbindungen-und-zertifikatspruefung.md) | TLS-/mTLS-Termination und Serviceidentity. |
| Requires | [KB-0068](20-http-1-1-und-verbindungsnutzung.md) | HTTP Authority, Header, Framing und Cache. |
| Requires | [KB-0069](21-http-2-und-multiplexing.md) | HTTP/2-Hop-/Streamgrenzen. |
| Applies to | KB-0073 | Traffic Management und Load Balancing. |
| Applies to | KB-0418 | Plattformgateway und Workloadkontrakte. |
| Applies to | KB-0562 | Cloud-/Edge-/Netzwerkfähigkeit. |
| Applies to | KB-0720 | Enterprise-/Chief-Level-Steuerung. |

## Quellen und Aktualitätsgrenze

**Recherche-Cutoff: 2026-09-16.** NGINX-/Proxy-/CDN-/WAF-/Gateway-/Mesh-Implementierungen, Module, Defaults, Headerinteraktionen und Sicherheitsvorgaben ändern sich. Vor Produktnutzung sind die aktuelle Primärdokumentation, reale Topologie und Mehrhoptests maßgeblich.

1. [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/info/rfc9110/) — HTTP Intermediaries, Authority, CONNECT, Fields und Semantik.
2. [RFC 7239 — Forwarded HTTP Extension](https://www.rfc-editor.org/info/rfc7239/) — standardisiertes Forwarded-Feld, Trust-/Privacy-/Integrityüberlegungen.
3. [NGINX `ngx_http_proxy_module`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html) — `proxy_pass`, Header, Request-/Responsebuffering, Timeouts und Upstreamverhalten.
4. [NGINX `ngx_http_realip_module`](https://nginx.org/en/docs/http/ngx_http_realip_module.html) — vertrauenswürdige Quellen und Header-basierte Real-IP-Verarbeitung.
5. [NGINX Request Processing](https://nginx.org/en/docs/http/request_processing.html) — Server-/Locationauswahl und Requestverarbeitungsmodell.
6. [KB-0067](19-tls-verbindungen-und-zertifikatspruefung.md), [KB-0068](20-http-1-1-und-verbindungsnutzung.md) und [KB-0069](21-http-2-und-multiplexing.md) — kanonischer lokaler Lernkontext.

## Bonus: New Tech and Innovations

Moderne Proxies entwickeln sich zu programmierbaren Plattformdatenpfaden: Gateway APIs, Workload Identity, mTLS, eBPF-nahe Observability, adaptive Concurrency, Policy-as-Code, HTTP/3/QUIC und datensparsame Telemetrie erlauben feinere Steuerung. Jede zusätzliche programmierbare Ebene erhöht aber auch den Bedarf an klaren Ownership-, Test-, Privacy- und Rollbackgrenzen.

Privacy-preserving Client Context, signierte Weitergabe von Kontext und Zero-Trust-Workloadidentity können die Abhängigkeit von frei formbaren Headerketten verringern. Ein Pilot akzeptiert eine Proxyinnovation erst, wenn Rollen und Terminierung, Header-/Identity-Trust, Authority, Buffering/Backpressure, TLS-/mTLS-Policy, Failure-/Retry-/Drainsemantik, Client-/Proxy-/Backendkompatibilität, Datenklassifikation, Capacity/Cost, Observability, Security, Compliance und Rollback über alle Hops nachgewiesen sind.

