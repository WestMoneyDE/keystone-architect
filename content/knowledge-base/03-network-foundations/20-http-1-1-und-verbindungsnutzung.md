---
{"id": "KB-0068", "title": "HTTP-1.1 und Verbindungsnutzung", "domain": "03", "sequence": 20, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Fehlersuche", "Evidenz"], "needed_for": "both"}, {"id": "KB-0056", "concepts": ["TCP-Verbindung", "Bytestrom", "Überlastung"], "needed_for": "both"}, {"id": "KB-0058", "concepts": ["DNS-Namen", "Auflösung", "Caches"], "needed_for": "understanding"}, {"id": "KB-0067", "concepts": ["TLS-Endpunkt", "Terminierung", "Dienstidentität"], "needed_for": "both"}], "related": ["KB-0069", "KB-0070", "KB-0071", "KB-0418", "KB-0562", "KB-0720"], "applies": ["KB-0069", "KB-0070", "KB-0418", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Das Lab zerlegt lokale Byte-Strings und modelliert Request-Framing, Connection-Reuse sowie Cache-Entscheidungen. Es öffnet keinen Socket und konfiguriert keinen Webserver oder Proxy.", "rationale": "Es trainiert präzises Framing und negative Fälle, ohne HTTP-Daten zu senden oder Infrastruktur zu ändern."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein HTTP-Vertrag definiert Authority/Host, Methoden- und Statussemantik, erlaubte Header, Message-Framing, Header-/Body-Limits, Keep-Alive-/Pool-Policy, Timeouts, Proxy-Hop-Semantik, Cache-Control, TLS-Termination, Forwarded-Header-Vertrauen und Fehlerantworten.", "rationale": "HTTP/1.1 ist ein sequenzielles Nachrichtenprotokoll auf einer Verbindung; jede Mehrhop-Architektur muss eindeutig festlegen, wie jede Komponente dieselben Bytes und Semantiken interpretiert."}, "STAFF-TARGET": {"active": true, "scope": "Teams messen Connection-Reuse, aktive/idle Pools, Queueing, p95/p99, Header-/Body-Limits, Statusklassen, Cache-Hits, Backend-Reuse und Proxy-Parser-Fehler und testen Differenzen von Content-Length, Transfer-Encoding, Host und Connection explizit negativ.", "rationale": "Sie trennen Transport-, TLS-, Authority-, Framing-, Timeout-, Upstream-, Cache- und Anwendungsschicht mit reproduzierbarer Anfragekorrelation."}, "CHIEF-TARGET": {"active": true, "scope": "Die Organisation steuert HTTP-Gateways, API- und Cache-Standards, sichere Parser- und Upgrade-Policies, gemeinsame Limits, Datenschutz in Headers/Logs, Platform-Ownership, Drittanbietergrenzen und den Umstieg auf neuere HTTP-Versionen als nachvollziehbare Architekturpolitik.", "rationale": "Parser-Divergenzen, zu große Shared Pools, unklare Proxy-Trust-Ketten oder unkontrollierte Caches können Sicherheits-, Verfügbarkeits-, Kosten- und Datenschutzrisiken über viele Produkte verbreiten."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "HTTP-Parserimplementierung, Request-Smuggling-Forschung, RFC-ABNF-Compliance, Kernel-Socket-Tuning, CDN-Cache-Internals, WAF-Regelentwicklung, h2c/Upgrade-Internals und Produkt-spezifische NGINX/Envoy/HAProxy/IIS-Apache-Details sind Spezialistentiefe.", "rationale": "Die Zielrollen müssen Semantik, Grenzen, Tests und Entscheidungskriterien kontrollieren; Parser- und Proxyproduktexpertise wird gemeinsam mit Security-, Netzwerk- und Plattform-Spezialisten vertieft."}}, "lab_validation": [{"lab_id": "KB-0068-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox ohne Netzwerkzugriff", "evidence": "Eine lokale Fallarbeit trennt Headerende, Content-Length, chunked Framing, Host/Authority, persistente Verbindungsnutzung, Cache-Entscheidung und widersprüchliches Framing als Ablehnungsfall.", "limitations": "Nicht ausgeführt; kein Socket, HTTP-Request, Webserver, Proxy, Cache, TLS, DNS, Cloud-, Netzwerk- oder Produktionsressource wurde verwendet oder verändert."}]}
---
# HTTP-1.1 und Verbindungsnutzung

> **Ziel:** HTTP/1.1 ist mehr als „JSON über Port 443“. Es beschreibt klar abgegrenzte Request-/Response-Nachrichten auf einer persistenten, aber sequenziell genutzten Verbindung. Sichere Architektur entsteht, wenn Client, Gateway, Proxy und Upstream dieselbe Nachrichtengrenze, Authority, Timeout- und Cache-Semantik teilen.

## Purpose, Definition und Scope

HTTP ist ein zustandsloses Request-/Response-Protokoll auf Anwendungsebene. HTTP/1.1 beschreibt Nachrichtensyntax, Parsing, Connection Management und Sicherheitsaspekte; seine Semantik und sein Caching sind mit den zugehörigen HTTP-Spezifikationen zu lesen. Für einen direkten HTTP/1.1-Request enthält die Request Line Methode, Request Target und Version, dazu Header, eine Leerzeile und gegebenenfalls einen Message Body. Antworten enthalten Status Line, Header, Leerzeile und gegebenenfalls Body.

Dieses Kapitel behandelt Request/Response-Grenzen, Header, Keep-Alive, Content-Length, `Transfer-Encoding: chunked`, Proxy-Hops und Cache-Control. TLS, Zertifikatsprüfung und terminierte HTTPS-Hops werden nur als Abhängigkeit behandelt; siehe KB-0067. HTTP/2 und HTTP/3 haben andere Framing- und Multiplexing-Modelle und sind eigene Kapitel. Eine erfolgreiche 200-Antwort beweist weder fachliche Korrektheit noch Autorisierung oder Datenschutz.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | HTTP/1.1-Nachrichten werden über präzises Byte-Framing und definierte Semantik voneinander getrennt. |
| HANDS-ON-TARGET | Das Lab analysiert lokale Strings und negative Framing-Fälle ohne Netzwerkzugriff. |
| ARCHITECT-TARGET | Authority, Limits, Timeouts, Reuse, Terminierung, Cache und Hop-Grenzen sind ein testbarer Vertrag. |
| STAFF/PRINCIPAL | Teams messen Pool-, Queueing- und Proxyverhalten und prüfen Parser-Differenzen absichtlich negativ. |
| CHIEF | API-, Gateway- und Cache-Standards werden mit Sicherheit, Kosten, Datenschutz und Produktmigration gesteuert. |

## Mental Model: Eine Verbindung ist ein gemeinsamer Bytestrom, keine Liste isolierter Requests

```text
one TCP/TLS connection
  request 1 bytes -> proxy parser -> upstream request 1 bytes -> response 1 bytes
  request 2 bytes -> proxy parser -> upstream request 2 bytes -> response 2 bytes
  ...
```

HTTP/1.1 verwendet in der normalen Nutzung auf einer Verbindung keine unabhängigen Stream-IDs. Eine Verbindung kann für mehrere Nachrichten persistent bleiben, die Nachrichten müssen aber klar voneinander abgegrenzt sein. Langsame oder blockierte Antworten können deshalb nachfolgende Arbeit auf dieser Verbindung aufhalten. Ein Connection Pool schafft Parallelität durch **mehrere** Verbindungen, nicht durch HTTP/1.1-Multiplexing auf einer einzelnen Verbindung.

```text
client pool:  c1 [request A -> response A -> request C]
              c2 [request B -> response B]
              c3 [request D -> response D]
```

Daraus folgen vier Architekturfragen:

1. Wer entscheidet, welche Request-Bytes zu welcher Nachricht gehören?
2. Welche Komponente besitzt den Connection Pool und dessen Queue/Timeouts?
3. Wo endet TLS und wie wird Authority/Original-Scheme vertrauenswürdig weitergegeben?
4. Welche Antwort darf ein Shared Cache für welchen Request wiederverwenden?

## Prerequisites und Dependencies

| ID | Art | Bedeutung |
|---|---|---|
| [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Verständnis und Lab | Messhypothesen und Fehlerkorrelation. |
| [KB-0056](08-tcp-verbindungen-und-ueberlastkontrolle.md) | Verständnis und Lab | Der geordnete Bytestrom und seine Verbindungsgrenzen. |
| [KB-0058](10-dns-aufloesung-und-caches.md) | Verständnis | Name, Adresse und Authority voneinander trennen. |
| [KB-0067](19-tls-verbindungen-und-zertifikatspruefung.md) | Verständnis und Lab | HTTPS, SNI, Zertifikatsprüfung und Terminierung. |

## Core Concepts

### Nachrichtensyntax und Semantik

Eine typische direkte Anfrage:

```http
GET /v1/orders?limit=20 HTTP/1.1
Host: orders.example.internal
Accept: application/json
Authorization: Bearer <redacted>
User-Agent: approved-client/2.4

```

Die Leerzeile beendet den Headerbereich. Erst danach beginnt gegebenenfalls der Message Body. Methoden, Statuscodes und Header haben definierte Semantik; Teams sollen diese nicht nur als beliebige Schlüssel-Werte behandeln.

| Baustein | Frage | Architekturwirkung |
|---|---|---|
| Methode | Welche beabsichtigte Aktion und Wiederholbarkeit beschreibt sie? | Retry, Cache, Audit und Idempotenz hängen davon ab. |
| Request Target | Welche Ressource/Query wird angesprochen? | Routing, Autorisierung und Caching müssen kanonisch dieselbe Ressource sehen. |
| Host/Authority | Für welchen virtuellen Origin ist die Nachricht bestimmt? | vHost-Routing und Tenant-Grenzen dürfen nicht raten. |
| Header | Welche Metadaten sind Ende-zu-Ende, welche hop-by-hop? | Proxies müssen feldspezifische Semantik respektieren. |
| Body Framing | Wie viele Bytes gehören zur Nachricht? | Parser-Sicherheit und Connection-Reuse hängen daran. |
| Status | Was ist Ergebnis, nicht nur Transportzustand? | Client-Retry, Caches, SLIs und Fehlerverhalten leiten sich davon ab. |

HTTP/1.1 fordert einen `Host`-Header in jeder Request Message. Mehrere, fehlende oder ungültige Host-Felder sind keine Gelegenheit für „best effort“-Routing; sie sind ein abzuweisender Ambiguitätsfall. Bei direktem Request wird gewöhnlich origin-form (`/path?query`) genutzt. Gegen einen Forward Proxy ist absolute-form möglich; `CONNECT` nutzt authority-form (`host:port`).

### Message Framing: Content-Length, Transfer-Encoding und Verbindungsschluss

Ein Empfänger muss wissen, wo Header enden und wie der Body abgegrenzt wird. Die sichere Strategie ist: **genau eine explizite, von allen Hops gleich interpretierte Framing-Semantik** pro Nachricht, mit begrenzten Größen und einem Parser, der die aktuelle Spezifikation implementiert.

```text
headers end at CRLF CRLF
  -> no-body status/method? body length is zero by semantics
  -> Transfer-Encoding present? decode permitted coding chain; final chunked framing can delimit
  -> otherwise valid Content-Length? read exactly that many octets
  -> otherwise connection-close framing only where allowed; do not reuse ambiguously
```

`Content-Length` bedeutet die Body-Länge in Oktetten. Chunked Transfer Coding überträgt eine Folge aus Größenzeile, Daten und CRLF und endet mit einem Null-Chunk, möglichen Trailer Fields und leerer Zeile:

```http
Transfer-Encoding: chunked

5
hello
6
 world
0

```

Die Zeilenumbrüche und Größen gehören zum Protokollframing, nicht zum Nutzinhalt. Ein Proxy kann beim Weiterleiten Framing ändern, etwa Chunking dechunking oder umgekehrt, muss die Nachricht aber vollständig und konsistent neu erzeugen. Er darf nicht verschiedene Interpretationen an unterschiedliche Hops weiterreichen.

### Request Smuggling als Architekturfehler zwischen Parsern

Request Smuggling entsteht, wenn zwei oder mehr Komponenten dieselbe Bytefolge unterschiedlich als HTTP-Nachrichten grenzen. Beispielsweise kann ein Frontend `Content-Length` verwenden, während ein Backend ein widersprüchliches `Transfer-Encoding` interpretiert. Bytes, die eine Komponente noch zum Body zählt, können bei der nächsten Komponente als neue Request erscheinen.

```text
client -> edge: one ambiguous byte sequence
edge parser:    request A has body length N
backend parser: request A ends earlier; remaining bytes start request B
```

Die Abwehr ist keine einzelne WAF-Regel. Sie verlangt:

- aktuelle, konforme Parser und zeitnahe Security Updates;
- konsequente Ablehnung widersprüchlicher oder mehrdeutiger Framing-Headers;
- definierte Header-/Request-/Trailer-Limits an jedem Hop;
- keine unkontrollierte Mischung lenienter Parser mit strengen Parsern;
- normalisierte, neu serialisierte Weiterleitung statt unkritischem Byte-Passthrough dort, wo ein Intermediary HTTP verarbeitet;
- eindeutige Ownership für Proxy, Gateway und Upstream-Parser;
- Negativtests über die tatsächliche Mehrhop-Kette.

Lenientes „Reparieren“ von Whitespace oder fehlerhaften Zeilen kann bei nur einem Empfänger pragmatisch wirken, wird über mehrere Empfänger zur Sicherheitsfläche. Aktuelle HTTP/1.1-Vorgaben behandeln vorlaufendes Whitespace zwischen Start Line und erstem Header als Fall zum Ablehnen oder Ignorieren der ganzen betroffenen Feldzeilen, gerade um Smuggling- und Response-Splitting-Differenzen zu vermeiden.

### Persistente Verbindungen und Keep-Alive

HTTP/1.1 verwendet standardmäßig persistente Verbindungen, sofern eine Nachricht oder Verbindung nicht explizit das Schließen fordert. Ein Client darf eine Verbindung wiederverwenden, wenn die vorherige Nachricht vollständig abgearbeitet ist und beide Seiten die Connection weiterführen. „Keep-Alive“ ist daher nicht einfach ein unendlicher Socket; er ist eine Policy aus Idle Timeout, Max Requests/Connection, Poolgröße, Life Time, Fehlerbehandlung und Drain-Verhalten.

| Parameter | Zu kurze Policy | Zu lange Policy | Gute Steuerung |
|---|---|---|---|
| Idle timeout | Handshake-/Connect-Churn | viele unproduktive offene Sockets | an Load Balancer, Proxy und Clients abgestimmt |
| Max connections | Queueing und Head-of-line-Blockierung | Ressourcen- und Portverbrauch | pro Ziel/Route/Poolbudget |
| Max requests per connection | wenig Reuse | fehleranfällige Langzeitbindungen/Uneinheitlichkeit | bei Drain und Librarysemantik bewusst |
| Connection lifetime | unregelmäßige Spitzen bei Ersatz | alte DNS-/Routing-/Policybindungen | jittered rotation und graceful drain |
| Request timeout | hängende Ressourcen | Abbruch normaler langsamer Arbeit | budgetiert nach End-to-End-SLO |
| Response body drain | Connection nicht wiederverwendbar | unbounded Speicher/Stream | Body limit und geregeltes Discard/close |

HTTP/1.1-Pipelining soll in neuen Architekturentscheidungen nicht als leichtgewichtige Lösung für Parallelität angenommen werden. Es ist sequenziell und kann durch Head-of-line Blocking sowie Intermediary-Kompatibilität problematisch sein. Für echte Multiplexing-Anforderungen prüfe HTTP/2 oder HTTP/3 in ihren eigenen Kapiteln; migriere auf Grundlage realer Client-, Gateway- und Upstream-Fähigkeiten.

### Reverse Proxy, Forward Proxy und Origin

Ein **Reverse Proxy** repräsentiert einen oder mehrere Origins gegenüber Clients. Er kann TLS terminieren, routen, Rate Limits anwenden, Requests puffern/streamen, cachen und eine neue Backend-Verbindung erzeugen. Ein **Forward Proxy** nimmt Clientrequests zu beliebigen Origins entgegen, oft mit absolute-form oder CONNECT. Der Origin ist die Autorität, die eine Ressource letztlich bereitstellt.

```text
client -- HTTPS/HTTP1.1 --> reverse proxy -- HTTP1.1 or other --> origin service
client -- HTTP1.1 absolute-form --> forward proxy -- HTTP1.1 --> remote origin
```

Jeder HTTP-verarbeitende Hop wird selbst Sender und Empfänger. Er muss daher neue Connection- und Framing-Entscheidungen korrekt treffen. TCP Keep-Alive zwischen Client und Edge beweist nichts über Backend-Reuse. Ebenso kann ein 502/504 vom Gateway entstehen, obwohl der Client-Edge-Kanal korrekt ist.

Hop-by-hop-Informationen gehören nicht blind zum nächsten Hop. Die `Connection`-Headerwerte benennen feldspezifische Optionsfelder für die konkrete Verbindung; ein Forwarder muss daraus resultierende hop-by-hop Feldsemantik behandeln, bevor er die nächste Nachricht bildet. `Proxy-Connection` ist keine standardisierte Ersatzarchitektur.

### TLS, Host, Forwarded Headers und Authority

Bei HTTPS berührt die Verbindung mehrere Namensformen:

```text
URL authority             -> api.example.com
TLS SNI / certificate ref -> api.example.com
HTTP Host                 -> api.example.com
proxy backend authority   -> orders.cluster.internal
```

Sie können bewusst unterschiedlich sein, aber nur in einem dokumentierten Routingvertrag. Nach TLS-Termination darf ein Backend `X-Forwarded-Proto`, `Forwarded`, Client-IP- oder Original-Host-Felder ausschließlich von seinen explizit erlaubten Proxies vertrauen. Ein Internet-Client darf solche Felder nicht selbst setzen und damit Sicherheitsentscheidungen beeinflussen.

| Kontrolle | Beispiel |
|---|---|
| Edge bereinigt | entfernt clientgelieferte Forwarded-/X-Forwarded-Header vor Neubildung. |
| Backend-Netzgrenze | akzeptiert Verkehrsquelle nur aus bekannten Proxy-/Mesh-Pfaden. |
| Authority allowlist | vHost und tenant-/hostbasierte Routen erlauben nur registrierte Authorities. |
| Original scheme | Redirects, Cookies und HSTS-ähnliche Policy basieren auf vertrauenswürdiger Terminierungsinformation. |
| Trace propagation | Trace-ID wird validiert, begrenzt und datensparsam behandelt, nicht blind als Autorisierung. |

## Caching: Wiederverwendung ist eine Semantikentscheidung

HTTP-Caching kann Antwortzeit, Originlast und Kosten senken, aber nur wenn Cache Key, Freshness, Validation und Variation korrekt sind. Eine Cache-Policy ist Teil des API-Vertrags, nicht ein CDN-Schalter.

```text
request -> cache lookup using defined key
  fresh acceptable representation? -> response from cache
  stale but validators available?   -> conditional request upstream
  else                              -> origin request, evaluate store policy
```

`Cache-Control` beschreibt Direktiven für Caches und Clients. Beispiel:

```http
Cache-Control: public, max-age=300
ETag: "orders-v42"
Vary: Accept-Encoding
```

Diese Antwort kann unter den definierten Bedingungen fünf Minuten frisch sein. `ETag` ermöglicht eine spätere bedingte Validierung; `Vary` macht sichtbar, dass ausgewählte Request-Header zur Repräsentationsauswahl gehören. Eine Antwort, die nach `Authorization`, Cookie, Mandant, Sprache, Feature Flag oder Clientidentität variiert, darf nicht versehentlich über einen zu groben Shared Cache Key fremden Clients ausgeliefert werden.

| Policy | Typischer Zweck | Warnung |
|---|---|---|
| `no-store` | sensible Daten nicht speichern | schließt nicht alle Logs, Browserhistorien oder Downstream-Verarbeitung aus. |
| `no-cache` | vor Wiederverwendung validieren | bedeutet nicht „nie speichern“. |
| `private` | Shared Cache darf nicht speichern | Clientseitige Speicherung bleibt eine eigene Datenentscheidung. |
| `public` + `max-age` | kontrollierte Shared-Cache-Nutzung | nur bei klarer Repräsentation, Key und Datenklassifikation. |
| Validator (`ETag`, Last-Modified) | günstige Revalidierung | Validator muss zu tatsächlicher Ressourcenänderung passen. |
| `Vary` | richtige Repräsentationsauswahl | hochkardinale oder sensitive Felder können Hit Rate und Datenschutz verschlechtern. |

Cache Invalidation ist nicht „lösche alles“. Definiere Freshness, Validator, Event/Version, Blast Radius, negative caching, Fehlerantworten und die beobachtbare Frage: Welche Repräsentation konnte wann welchem Nutzer aus welchem Cache geliefert werden?

## Konfiguration und Implementierung

### Beispiel eines abstrakten Gateway-Vertrags

```yaml
route: orders-api
public_authorities: ["api.example.com"]
client_protocol: "http/1.1"
limits:
  request_line_bytes: 8192
  header_bytes: 32768
  body_bytes: 1048576
  header_count: 80
timeouts:
  client_header: 10s
  client_body: 30s
  upstream_connect: 2s
  upstream_response_headers: 15s
connections:
  client_idle: 60s
  upstream_idle: 30s
  upstream_max_requests: 1000
framing:
  reject_ambiguous_content_length_or_transfer_encoding: true
trust:
  forwarded_headers_from: ["edge-gateway-identity"]
cache:
  enabled: true
  shared_response_classes: ["GET", "HEAD"]
  require_explicit_cache_control: true
```

Dies ist kein Produktsnippet. Tatsächliche Limits, Timeoutnamen, Headernormalisierung und Framingverhalten unterscheiden sich zwischen Gateway, Reverse Proxy, Runtime und Version. Übernimm nie eine Konfiguration ohne ihre konkret dokumentierte Parser- und Defaultsemantik zu prüfen.

### Budgetierte Timeouts

Eine requestweite Deadline muss sich auf Verbindung, TLS, Header, Body, Queue, Upstream Connect, Upstream Header, Body-Streaming und Retry verteilen. Wenn jede Schicht unabhängig 30 Sekunden wartet, kann ein kurzer Produkt-SLO durch addierte Wartezeiten weit überschritten werden.

```text
end-to-end budget 2.0 s
  edge queue              0.1 s
  upstream connect        0.2 s
  upstream first byte     1.2 s
  body/serialization      0.3 s
  safety margin           0.2 s
```

Retries sind nur sinnvoll, wenn Methode/Idempotency-Semantik, Fehlerklasse, verbleibendes Budget, Lastzustand und Duplicate-Effects bekannt sind. Ein Proxy, der nicht-idempotente `POST`-Requests nach einem unbekannten Upstream-Abbruch unkontrolliert wiederholt, kann fachliche Duplikate erzeugen.

### Sichere Change-Sequenz

1. Inventarisiere Behörden/Authorities, Routen, Clientlibraries, HTTP-Versionen, Proxyhops, Header, Limits, Cache und aktuelle Fehlerklassen.
2. Dokumentiere ein Request/Response-Beispiel pro kritischer Route mit Authority, erwarteten Headers, Framing, Bodygrenze, Statuscodes, Cache und Timeoutbudget.
3. Teste korrekte sowie doppelte/missing Host, große Headers, widersprüchliche Framingfelder, abgebrochene Bodies, langsame Clients, Backend-Timeout, Cache-Varianten und untrusted Forwarded Header.
4. Rolle Limits und Parser-/Proxy-Versionen gestuft aus; beobachte 4xx/5xx, Upstream-Fehler, Queueing, Reuse, CPU, Memory und Cache-Hit-Rate.
5. Drain bestehende Connections vor Proxy-Rollout; rolle auf eine bekannte sichere Version/Policy zurück, nicht auf unsichere Parser-Toleranz.
6. Entferne Ausnahme-Limits und Legacy-Routen nach gemessener Migration.

## Scalability, Performance und Reliability

### Pooling, Queueing und Head-of-Line Blocking

HTTP/1.1 kann auf einer persistenten Verbindung nur so schnell voranschreiten wie die vorderste ausstehende Anfrage/Antwort. Ein großer Response Body oder langsamer Upstream blockiert nachfolgende Arbeit auf dieser Verbindung. Mehr Connections helfen, erhöhen aber Socket-, File-Descriptor-, NAT-/Ephemeral-Port-, Memory- und Load-Balancer-Kosten.

Messe getrennt:

```text
http_requests_total{route,status_class}
http_request_duration_seconds{route,upstream}
http_client_connections{state=active|idle|draining}
http_upstream_pool_queue_seconds{route}
http_upstream_connections{state=active|idle}
http_message_rejected_total{reason=host|header_limit|framing|body_limit}
http_cache_requests_total{result=hit|miss|revalidated|bypass}
http_response_bytes_total{route}
```

Eine 99%-Latenz kann aus Client Upload, Edge Queue, Pool-Erschöpfung, DNS, TLS, connect, Upstream Queue, Anwendung, Response Body oder Proxy-Buffering stammen. Eine einzelne `request_duration`-Zahl reicht für Ursachen nicht aus. Korrelation braucht Request-ID/Trace-Kontext mit begrenzter Kardinalität und datensparsame Logs.

### Failure Modes

| Symptom | Mögliche Ursache | Sichere Prüfung/Reaktion |
|---|---|---|
| 400 direkt am Edge | fehlender/doppelter Host, Syntax, Headerlimit, ungültiges Framing | Edge-Parsergrund und Client-Bytes sicher redigiert prüfen. |
| 502/504 | Backend DNS/Connect/Timeout/Response-Framing/Health | Hop-spezifische Status und Timing prüfen, nicht nur Clientstatus. |
| viele neue Connections | Idle mismatch, Pool nicht reused, body nicht gedraint, TLS/route change | client- und upstreamseitige Reuse-/Close-Metriken vergleichen. |
| steigende Latenz bei wenig CPU | Pool queue, HOL, langsame Bodies, upstream cap | Queuezeit, active/idle, response size und Route vergleichen. |
| falsche Daten aus Cache | unvollständiger Key, `Vary`, Auth/Cookie/Tenant, Invalidation | Cache Key und Datenklassifikation prüfen, sofortige sichere Bypass-/Purge-Strategie. |
| einzelne Clients funktionieren nicht | Header-/Method-/chunked-Interoperabilität oder Proxypolicy | konkrete Clientklasse und Parserpfad validieren. |
| Sicherheitsalarm | CL/TE- oder Whitespace-Differenz, untrusted forwarded header | betroffenen Hop isolieren, mehrdeutige Nachrichten ablehnen, Parser patchen. |

## Security, Governance und Compliance

Header und URLs können Zugangstokens, E-Mail-Adressen, Mandantenkennungen, Suchbegriffe, interne Hosts oder personenbezogene Daten enthalten. Definiere Logging-Redaktion für `Authorization`, Cookies, Query-Parameter und Bodies; beschränke Debug-Dumps und Cache-Inspector-Zugriff. Ein `Cache-Control: private` ersetzt keine Datenschutzpolitik für Observability oder Clientgeräte.

HTTP-Risiken müssen an der Request-Kette kontrolliert werden:

- Authority/Host allowlists verhindern unklare Virtual-Host- oder Tenant-Auswahl.
- Request-/Header-/Body-/Trailer-Limits begrenzen Parser- und Ressourcenangriffe.
- Canonicalization und Route Matching werden zwischen WAF, Gateway und Anwendung abgestimmt getestet.
- Proxies löschen oder bilden Forwarded-/Client-IP-Headers vertrauenswürdig neu.
- CONNECT und Upgrade sind nach Ziel, Authentisierung und Übergangssemantik beschränkt.
- Cache-Policies werden anhand der Datenklasse und Isolation zwischen Nutzern/Mandanten geprüft.
- Rate Limits und Authentisierung werden vor teuren Upstream- oder Streamingpfaden gesetzt, ohne vertrauenswürdige Health-/Controlplane-Pfade zu blockieren.

RFC 9931 aktualisiert Anforderungen für optimistische Protokollübergänge in HTTP/1.1. Besonders Proxyclients, die für untrusted TCP-Quellen `CONNECT` vermitteln, müssen vor untrusted Payload auf eine erfolgreiche 2xx-Antwort warten oder `Connection: close` einsetzen; bei abgelehntem `CONNECT` muss der Proxy die zugrunde liegende Verbindung schließen. Das ist eine präzise Beispielregel dafür, dass Verbindungsreuse und Sicherheit gemeinsam entworfen werden müssen.

## Cost und FinOps

HTTP-Kosten entstehen durch Gateway-/Proxykapazität, aktive Sockets, TLS-Handshakes bei schlechter Reuse, Egress, CDN-/Cache-Speicher, Logs, Traces und den Origin-Compute bei Cache Misses. Ein sehr großer Pool oder lange Idle Timeouts können in ruhigen Phasen Ressourcen binden; ein zu kleiner Pool oder kurzer Idle Timeout kann in Lastspitzen Connect-/Handshake-Churn erzeugen.

Bewerte Maßnahmen mit Messwerten:

| Maßnahme | Nutzen | Kosten-/Risiko |
|---|---|---|
| Shared Cache | weniger Originlast und Egress | falscher Key kann Daten offenlegen; Speicher/Invalidation. |
| Connection reuse | weniger Connect/TLS-Overhead | Idle Ressourcen und ungleichmäßige Verteilung. |
| Strenge Limits | weniger Amplification/Parserlast | echte Clients können migrieren müssen. |
| Response streaming | geringerer Buffering-Speicher, frühe Ergebnisse | Backpressure, Timeout und Retries anspruchsvoller. |
| Proxy-Konsolidierung | zentrale Policy | Blast Radius, Terminierung und Kapazitätskonzentration. |

## Trade-offs und Anti-Patterns

| Entscheidung | Vorteil | Grenze/Kontrolle |
|---|---|---|
| HTTP/1.1 keep-alive | weniger Verbindungsaufbau | keine echte Multiplexing-Parallelität, begrenzte Pools. |
| Proxy buffering | klare Limits und Retry-/WAF-Kontrolle | Latenz/Memory, Streaming-Semantik. |
| End-to-end streaming | geringe Time-to-first-byte | Backpressure, Disconnect und Observability. |
| Shared caching | Kosten-/Latenzvorteil | korrekter Cache Key, Freshness, Datenschutz. |
| zentrale Gateway-Policy | konsistente Limits/Header | Plattform muss produktteamspezifische Semantik abbilden. |
| Upgrade/CONNECT | Protokoll-/Tunnelbedarf | genaue Ziel-/Auth-/Reuse- und Transitionpolicy. |

**Anti-Patterns**

- `Content-Length` und `Transfer-Encoding` als bloße Headertexte ohne globale Parserpolicy behandeln.
- Eine HTTP/1.1-Verbindung für parallele Arbeit halten und HOL-Queueing ignorieren.
- `Host`, `X-Forwarded-Host` oder `X-Forwarded-Proto` von jedem Client als vertrauenswürdig verwenden.
- Shared Caching für authentisierte oder mandantenspezifische Antworten ohne kontrollierten Key/Vary aktivieren.
- Timeouts an jeder Schicht großzügig und unabhängig setzen.
- Request Body nach frühem Fehler nicht kontrolliert schließen/drainen und die Verbindung blind wiederverwenden.
- 502/504 als „HTTP kaputt“ melden, ohne Client-Edge- und Edge-Upstream-Hop zu trennen.
- Parser-Toleranz oder Downgrade als dauerhaften Kompatibilitätsfix freigeben.

## Staff-Level Decisions

Ein Staff-/Principal-Record beantwortet für jede kritische API-Route:

1. Welcher Origin/Authority-/Host-Vertrag gilt am Edge und am Backend?
2. Welche Methoden, Statuscodes, Idempotency- und Retry-Regeln gelten?
3. Welche Header, Request Targets, Bodygrößen und Framingformen werden angenommen oder abgelehnt?
4. Wo terminiert TLS, welche Proxyhops existieren und welche Forwarded Headers werden von wem neu gebildet?
5. Welches Timeout- und Connection-Poolbudget passt zum End-to-End-SLO?
6. Welche Cache Key-, `Vary`-, Freshness- und Invalidation-Policy ist pro Datenklasse zulässig?
7. Welche negative Tests verhindern Parserdivergenz, Request Smuggling, Cross-Tenant-Cache und Header-Spoofing?

Ein guter Review vergleicht nicht nur Gateway-Konfiguration mit einem Happy Path. Er prüft den tatsächlichen Byte- und Semantikpfad bis zum Upstream mit absichtlich fehlerhaftem Host, begrenzten Headers, abgebrochenem Body, widersprüchlichem Framing und Cache-Varianten.

## Chief-Level Decisions

Chief-Level etabliert einen organisationsweiten HTTP-Rahmen:

- Eine gepflegte Plattformpolicy für Parserupdates, Limits, sichere Defaults, Proxy-Hops und kontrollierte Ausnahmen.
- Ein API-Vertrag, der Authority, Fehlersemantik, Caching, Timeoutbudgets, Authentisierung und Datenschutz als Produktverhalten führt.
- Governance für CDNs, Gateways, WAFs, Service Mesh und Drittanbieterproxies mit klarer Daten-/Terminierungsgrenze.
- Migrationspfade von HTTP/1.1 zu HTTP/2 oder HTTP/3, die echte Clients, TLS/ALPN, Proxies, Beobachtbarkeit und Fallback erfassen.
- Sicherheitskennzahlen für mehrdeutiges Framing, Legacyparser, auslaufende Ausnahmen und unklare Forwarded-Trust-Ketten.
- Kostenberichte, die Hit Rate, Origin-Egress, Handshake-Churn, Connection-Saturation und Observability-Volumen mit Dienstwert verbinden.

## Production Checklist

- [ ] Authority/Host, erwartete SNI/TLS-Grenze und Backend-Authority sind pro Route dokumentiert.
- [ ] Alle Proxy-/Gateway-Hops, TLS-Terminationen, Klartextzonen und neu gebildeten Forwarded Headers sind nachvollziehbar.
- [ ] Parser, Gateway und Upstream sind patchbar inventarisiert; widersprüchliches Framing wird explizit abgelehnt.
- [ ] Header-, Request-Line-, Trailer- und Body-Limits liegen vor und sind mit Clients getestet.
- [ ] Timeouts bilden ein End-to-End-Budget; Poolgrößen und Drain-Verhalten sind gemessen.
- [ ] Client- und Upstream-Reuse, Pool Queueing, Latenz, Statusklassen, Abbruchgründe und Cache-Ergebnis sind beobachtbar.
- [ ] Authentisierte, mandantenspezifische und sensible Antworten haben eine geprüfte Cachepolicy.
- [ ] `Host`/Authority und Forwarded-/Client-IP-Headers werden nur an definierten Grenzen akzeptiert.
- [ ] CONNECT/Upgrade sind policygesteuert, bei untrusted Clients sicher und getestet.
- [ ] Negativtests schließen fehlenden/doppelten Host, Headerlimits, CL/TE-Differenz, Whitespace, Slow Client und Body-Abbruch ein.
- [ ] Logs und Traces redigieren Secrets und unnötige personenbezogene Daten.

## Interviewfragen mit Antworten

### 1. Was bedeutet persistente Verbindung in HTTP/1.1?

Mehrere Request-/Response-Nachrichten können denselben TCP/TLS-Kanal nacheinander nutzen. Die Verbindung ist damit nicht automatisch parallel oder unbegrenzt; Framing, vollständige Nachrichtenverarbeitung, Idle-/Lifetime-Policy und Poolsteuerung entscheiden über die sichere Wiederverwendung.

### 2. Warum ist `Content-Length` sicherheitsrelevant?

Er bestimmt, wie viele Bytes ein Empfänger zum Body rechnet. Wenn Frontend und Backend mit `Content-Length` und `Transfer-Encoding` oder tolerantem Whitespace unterschiedlich umgehen, können sie denselben Bytestrom in unterschiedliche Requests zerlegen. Das ist eine Grundlage für Request Smuggling.

### 3. Was unterscheidet `Host` von TLS-SNI?

SNI hilft dem TLS-Endpunkt, vor HTTP das passende Zertifikat/vHost auszuwählen. `Host` beschreibt die HTTP-Authority in der HTTP/1.1-Nachricht. Bei sauberer Architektur sind sie im Vertrag abgestimmt, aber sie entstehen in unterschiedlichen Protokollschichten und dürfen nicht blind gleichgesetzt werden.

### 4. Wieso reicht ein Client-Keep-Alive nicht als Nachweis für Backend-Reuse?

Ein Reverse Proxy kann die Clientverbindung persistent halten und für jede Anfrage eine neue Upstreamverbindung aufbauen, oder umgekehrt. Client- und Backend-Pools sind getrennte Ressourcen mit eigenen Timeouts, Limits und Fehlerbildern.

### 5. Wann ist `no-cache` sinnvoll und was bedeutet es nicht?

`no-cache` verlangt vor Wiederverwendung Validierung, untersagt aber nicht zwangsläufig Speicherung. Für „nie speichern“ ist `no-store` näher am Protokollzweck, ersetzt aber weiterhin keine Log-, Browser- oder Datenschutzkontrolle.

### 6. Warum ist HTTP/1.1-Pipelining kein Ersatz für HTTP/2-Multiplexing?

HTTP/1.1 ordnet Nachrichten auf einer Verbindung sequenziell; langsame vordere Antworten können folgende Arbeit blockieren. HTTP/2 und HTTP/3 verwenden explizite Streams und eigene Flow-Control-/Fehlersemantik. Die Migration muss deshalb die gesamte Proxy- und Clientkette prüfen.

### 7. Was ist bei einem 504 der erste Architekturfehler, den man vermeiden sollte?

Die gesamte Kette als einen HTTP-Fehler zu behandeln. Ein 504 ist oft eine Gateway-Aussage über einen Upstream-Timeout. Prüfe getrennt Client-Edge-Timing, Edge-Queue, DNS/Connect, TLS, Backend-Pool, Upstream-Headerzeit und Anwendung.

## Praktisches Lab: Lokales Framing- und Cache-Modell

**Zweck:** Trainiere die Trennung zwischen Headergrenze, Bodylänge, Connection-Reuse und Caching ohne Socket oder Webserver.

```python
def parse_decision(headers: dict[str, str]) -> str:
    cl = headers.get("content-length")
    te = headers.get("transfer-encoding")
    host = headers.get("host")

    if not host:
        return "REJECT: missing Host"
    if cl is not None and te is not None:
        return "REJECT: ambiguous framing policy"
    if te is not None and te.lower() != "chunked":
        return "REJECT: unsupported transfer coding in this model"
    if cl is not None and (not cl.isdecimal() or int(cl) > 1_048_576):
        return "REJECT: invalid or oversized Content-Length"
    return "ACCEPT: model one HTTP/1.1 message"

def shared_cache_allowed(headers: dict[str, str]) -> bool:
    cc = headers.get("cache-control", "")
    return "public" in cc and "authorization" not in headers and "cookie" not in headers
```

Arbeite diese Fälle durch:

1. Positiv: ein `Host`, nur numerisches `Content-Length`, begrenzter Body.
2. Negativ: fehlendes oder doppelt modelliertes `Host`; die Route darf nicht raten.
3. Negativ: `Content-Length` und `Transfer-Encoding` zusammen; die Modellpolicy lehnt ab.
4. Negativ: Headergröße/Bodygröße oberhalb des Route-Limits.
5. Cachefall: Antwort variiert nach Mandant/Cookie; diskutiere, warum `public` ohne korrektes Cache Key/Vary unzureichend ist.
6. Erstelle für einen Reverse Proxy ein Zeitbudget und markiere, welcher Hop bei Überschreitung `504` erzeugt.
7. Ergänze `connection: close` und diskutiere, wann der Pool diese Verbindung nicht wiederverwenden darf.

**Aufräumen:** Lösche temporäre lokale Dateien/Interpreterzustand. Keine HTTP-Requests, Sockets, Proxies, Caches, TLS-, DNS-, Cloud-, Netzwerk- oder Produktionsressourcen werden verwendet oder verändert.

## Dependencies und Cross-References

| Beziehung | Datei | Zweck |
|---|---|---|
| Requires | [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Hypothesen und Evidenz. |
| Requires | [KB-0056](08-tcp-verbindungen-und-ueberlastkontrolle.md) | TCP-Bytestrom und Connection-Kontext. |
| Requires | [KB-0058](10-dns-aufloesung-und-caches.md) | Name, Adresse und Caches. |
| Requires | [KB-0067](19-tls-verbindungen-und-zertifikatspruefung.md) | HTTPS und Terminierungsgrenzen. |
| Applies to | KB-0069 | HTTP/2 als abweichendes Framing-/Multiplexing-Modell. |
| Applies to | KB-0070 | HTTP/3 als QUIC-basiertes Modell. |
| Applies to | KB-0418 | Plattformgateway und Service-to-Service-Verträge. |
| Applies to | KB-0720 | Enterprise-/Chief-Level-Entscheidungsrahmen. |

## Quellen und Aktualitätsgrenze

**Recherche-Cutoff: 2026-09-16.** Parserdetails, Gateway-/Proxyversionen, Browser-/Runtimeverhalten und Sicherheitsvorgaben ändern sich. Vor einer Produktentscheidung sind die aktuelle Primärdokumentation der konkreten Implementierung, ihre Release Notes und der gesamte Mehrhop-Test maßgeblich.

1. [RFC 9112 — HTTP/1.1](https://www.rfc-editor.org/info/rfc9112/) — Nachrichtensyntax, Parsing, Framing, Connection Management und Security Considerations.
2. [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/info/rfc9110/) — Methoden-, Status-, Header-, Authority-, CONNECT- und Upgrade-Semantik.
3. [RFC 9111 — HTTP Caching](https://www.rfc-editor.org/info/rfc9111/) — Cache-Control, Freshness, Validation und Caching Policy.
4. [RFC 9931 — Security Considerations for Optimistic Protocol Transitions in HTTP/1.1](https://www.rfc-editor.org/info/rfc9931/) — aktuelle Anforderungen für sichere Upgrade-/CONNECT-Übergänge.
5. [RFC 9113 — HTTP/2](https://www.rfc-editor.org/info/rfc9113/) — Vergleichsrahmen für Stream-Multiplexing und Protokollgrenzen.
6. [KB-0056](08-tcp-verbindungen-und-ueberlastkontrolle.md) — lokaler Transportkontext.
7. [KB-0058](10-dns-aufloesung-und-caches.md) — lokaler Namen-/Cachekontext.
8. [KB-0067](19-tls-verbindungen-und-zertifikatspruefung.md) — lokaler TLS-/Terminierungskontext.

## Bonus: New Tech and Innovations

HTTP/1.1 bleibt an vielen Edge-, API-, Legacy- und Debug-Schnittstellen relevant, aber Innovation geschieht häufig an den Übergängen: HTTP/2 und HTTP/3 verändern Framing, Multiplexing, Flow Control und Fehlereffekte; neue Protokollübergänge brauchen zusätzliche Sicherheitsprüfung. RFC 9931 zeigt exemplarisch, dass eine Optimierung des Connection-Reuse oder ein „optimistischer“ Übergang über HTTP/1.1 neue Parser- und Smuggling-Risiken erzeugen kann.

Moderne Gateway-Plattformen kombinieren HTTP-Policy mit Service Identity, adaptive Concurrency, Echtzeit-Telemetrie und deklarativer Konfiguration. Das ersetzt keine präzise HTTP-Semantik. Ein Pilot akzeptiert HTTP-Innovationen erst, wenn Authority, Framing, Parserkonsistenz, Connection-/Timeoutbudget, Cacheisolation, Proxy-Trust, Datenschutz, beobachtbare Fehlermodi und Rollback über alle betroffenen Hops nachgewiesen sind.

