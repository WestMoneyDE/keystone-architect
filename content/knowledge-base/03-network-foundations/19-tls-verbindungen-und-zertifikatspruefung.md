---
{"id": "KB-0067", "title": "TLS-Verbindungen und Zertifikatsprüfung", "domain": "03", "sequence": 19, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Fehlersuche", "Evidenz"], "needed_for": "both"}, {"id": "KB-0056", "concepts": ["TCP-Verbindung", "Ports", "verlässlicher Bytestrom"], "needed_for": "both"}, {"id": "KB-0058", "concepts": ["DNS-Namen", "Auflösung", "Caches"], "needed_for": "understanding"}, {"id": "KB-0060", "concepts": ["Zeit", "Gültigkeitsfenster", "Clock Skew"], "needed_for": "both"}, {"id": "KB-0065", "concepts": ["Verbindungszustand", "NAT", "Terminationspfad"], "needed_for": "understanding"}], "related": ["KB-0068", "KB-0069", "KB-0418", "KB-0562", "KB-0720"], "applies": ["KB-0068", "KB-0418", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Das Lab bewertet eine lokale Datenstruktur für Hostname, Kette, Zeit, Trust Anchor und Terminierung. Es erzeugt keine Schlüssel, kein Zertifikat und keine TLS- oder Netzwerkverbindung.", "rationale": "Die Übung trainiert Entscheidungslogik und negative Fälle, ohne Kryptografie selbst zu implementieren oder Infrastruktur zu verändern."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein TLS-Vertrag definiert Dienstname, Clientpopulation, Protokoll- und Versionpolicy, Vertrauensanker, Identitätsprüfung, Clientauthentisierung, Terminierungspunkte, Backend-Schutz, Resumption/0-RTT, Telemetrie, Rotationsschnittstelle und Fallback-Verbot.", "rationale": "TLS ist ein Ende-zu-Ende-Kanal zwischen konkreten Peers. Ein Load Balancer, Proxy oder Sidecar erzeugt beim Terminieren eine neue Sicherheitsgrenze."}, "STAFF-TARGET": {"active": true, "scope": "Teams prüfen Handshake- und Namensfehler nach Ursache, messen Versionen, Negotiation, Zertifikatsrestlaufzeit, Ketten- und Alertfehler sowie Resumption und führen Änderungen mit Kompatibilitätsmatrix und Rollback aus.", "rationale": "Sie trennen DNS-, Zeit-, Ketten-, Trust-Store-, SNI-, Client-, Terminierungs- und Anwendungsprobleme mit reproduzierbarer Evidenz."}, "CHIEF-TARGET": {"active": true, "scope": "Die Organisation steuert TLS als verbindliche Vertrauensarchitektur mit klaren CA-/Trust-Store-Eigentümern, zentralen Ausnahmen, kryptographischer Agilität, Datenschutz an Terminierungspunkten, Lieferantenanforderungen, Incidentprozessen und messbarer Migrationspolitik.", "rationale": "Ein zu weiter Trust Store, eine unsichtbare Terminierung oder ein Legacy-Fallback kann gleichzeitig Vertraulichkeit, Verfügbarkeit, Compliance und organisationsweite Lieferfähigkeit gefährden."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Krypto-Bibliotheksinternals, formale Protokollanalyse, HSM- und CA-Betrieb, Browser-Trust-Programme, OCSP/CRL-Detailpolitik, TLS-Fingerprinting, Post-Quantum-KEM-Parameter, ECH-Deployment und Pakettraces auf Rekordebene sind Spezialistentiefe.", "rationale": "Die Zielrollen müssen Grenzen, Anforderungen, Nachweise und Entscheidungen kontrollieren; die genaue Kryptografie- und PKI-Implementierung wird mit Security-, PKI- und Plattform-Spezialisten verantwortet."}}, "lab_validation": [{"lab_id": "KB-0067-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox ohne Netzwerk, Schlüsselmaterial oder Zertifikatsdateien", "evidence": "Eine deklarative Server-Identity-Prüfung für erwarteten DNS-Namen, Zeitfenster, Chain-to-Anchor, EKU-Absicht, Terminierungsgrenze und 0-RTT-Methodenklasse einschließlich negativer Fälle wurde als Fallarbeit geprüft.", "limitations": "Nicht ausgeführt; keine echte Kryptografie, kein Handshake, kein Zertifikat, kein Trust Store, keine TLS-Konfiguration, kein DNS und keine Cloud-, Netzwerk- oder Produktionsressource wurden verwendet oder verändert."}]}
---
# TLS-Verbindungen und Zertifikatsprüfung

> **Ziel:** TLS schützt einen Kanal zwischen genau zwei Endpunkten. Vertraue einem Server erst, wenn Version und Handshake verhandelt, die erwartete Dienstidentität geprüft, eine zulässige Zertifikatskette bis zu einem kontrollierten Vertrauensanker aufgebaut und der tatsächliche Terminierungspunkt verstanden sind.

## Purpose, Definition und Scope

Transport Layer Security (TLS) schützt einen Kommunikationskanal gegen Abhören, unbemerkte Veränderung und Fälschung. Dazu verhandeln Client und Server einen Handshake; anschließend schützt die Record Layer Anwendungsdaten mit abgeleiteten Traffic Keys. Die aktuelle TLS-1.3-Spezifikation ist RFC 9846, die RFC 8446 ablöst; sie konkretisiert unter anderem Verbots- und Klarstellungspunkte für ältere Versionen sowie Key-Sharing und Key-Updates.

Dieses Kapitel erklärt den Verbindungsaufbau, die Prüfung einer Serveridentität und die Folgen von TLS-Termination. Es behandelt nicht den gesamten Lebenszyklus einer Unternehmens-PKI: CA-Auswahl, Zertifikatsausstellung, Sperrlisten, HSM-Administration, Trust-Programm und Rotation werden später als eigene Betriebsdomänen vertieft. Eine technisch gültige Kette ist außerdem keine Anwendungsautorisierung und keine Aussage darüber, ob der Dienst sichere Geschäftslogik ausführt.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | TLS bindet ausgehandelte Schlüssel und Identität an einen Handshake; die Anwendung muss die erwartete Identität festlegen. |
| HANDS-ON-TARGET | Das Lab modelliert Prüfentscheidungen lokal; es erstellt keine Schlüssel oder Verbindungen. |
| ARCHITECT-TARGET | Dienstname, Trust Anchor, mTLS-Bedarf, Terminierung, Backend-Schutz, Resumption und Telemetrie werden als Vertrag bestimmt. |
| STAFF/PRINCIPAL | Kompatibilitätsmatrix, negative Prüfung und evidenzbasierte Fehleranalyse verhindern „verify=false“-Abkürzungen. |
| CHIEF | Kryptografische Agilität, Trust-Governance, Datenschutz und Ausnahmeprozesse werden organisationsweit gesteuert. |

## Mental Model: Ein verschlossener, adressierter Kanal

```text
application intent: "I need https://api.example.internal"
  -> DNS resolves an address; the intended service name remains api.example.internal
  -> TCP (or another TLS-capable transport) reaches a concrete TLS endpoint
  -> ClientHello offers versions, algorithms, key material and often SNI
  -> server proves control of a key and presents identity material
  -> client validates chain + time + intended name + policy
  -> both sides bind handshake transcript to keys and exchange protected records
```

Drei Aussagen müssen gleichzeitig gelten:

1. **Kanal:** Der Handshake hat zulässige Parameter und Schlüssel für diese Verbindung erzeugt.
2. **Identität:** Das präsentierte, geprüfte Identity-Material passt zum Namen oder zur ausdrücklich erwarteten IP-Identität des Dienstes.
3. **Vertrauen:** Die Kette endet in einem für diese Clientpopulation erlaubten Trust Anchor und erfüllt deren Validierungspolicy.

Eine TCP-Verbindung zu `203.0.113.10:443` allein trägt keine Aussage über den Dienstnamen. DNS löst Namen auf; TLS-Identity-Prüfung beantwortet, ob der erreichte Peer für den **erwarteten** Namen glaubwürdig ist. Ein Client, der jede „irgendwie gültige“ Kette akzeptiert, prüft keine Dienstidentität.

## Prerequisites und Dependencies

| ID | Art | Warum sie hier nötig ist |
|---|---|---|
| [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Verständnis und Lab | Fehlerhypothesen und beobachtbare Evidenz. |
| [KB-0056](08-tcp-verbindungen-und-ueberlastkontrolle.md) | Verständnis und Lab | TLS über einem zuverlässigen, geordneten Bytestrom und Port-Kontext. |
| [KB-0058](10-dns-aufloesung-und-caches.md) | Verständnis | Dienstname, Auflösung und DNS-Fehler werden nicht mit Zertifikatsnamen verwechselt. |
| [KB-0060](12-ntp-und-zeitsynchronisation.md) | Verständnis und Lab | Zertifikatsgültigkeit setzt nachvollziehbare Zeit voraus. |
| [KB-0065](17-nat-und-verbindungszustand.md) | Verständnis | NAT und Conntrack verändern Pfade, ersetzen aber keinen TLS-Endpunkt. |

## Core Concepts

### Handshake, Record Layer und Security Properties

RFC 9846 beschreibt zwei Protokollteile. Der **Handshake** handelt Version, Algorithmen und Schlüsselmaterial aus, authentisiert die Gegenstelle und bindet die Verhandlung gegen Manipulation. Die **Record Layer** teilt anschließende Daten in einzeln geschützte Records. TLS 1.3 nutzt AEAD-Schutz für die verbleibenden symmetrischen Cipher Suites und trennt Authentisierung/Key Exchange von der Record-Suite.

```text
Client                                                   Server
ClientHello: versions, cipher/hash offers, key_share,
             SNI/ALPN and optional PSK  -------------->
                                           ServerHello: chosen parameters/key share
                                      <--- {EncryptedExtensions}
                                      <--- {Certificate, CertificateVerify}
                                      <--- {Finished}
{Certificate, CertificateVerify, Finished} ------------>
[protected application data] <=======================> [protected application data]
```

Geschweifte Nachrichten sind nach dem Schlüsseltausch durch Handshake Keys geschützt; Anwendungsdaten erhalten Application Traffic Keys. `CertificateVerify` beweist den Besitz des zum präsentierten öffentlichen Schlüssel passenden privaten Schlüssels über den Handshake-Transcript. `Finished` bestätigt Schlüssel und Integrität des Transcripts. Client-Zertifikate sind optional; eine normale Serverzertifikatsprüfung authentisiert nicht automatisch den aufrufenden Benutzer.

TLS verschleiert nicht automatisch IP-Adressen, Paketgrößen, Zeitverhalten oder jedes Metadatum. Die Endpunkte können nach Terminierung Klartext sehen. TLS verhindert auch keine SSRF, IDOR, Injection, fehlerhafte Autorisierung oder ein kompromittiertes Endsystem.

### Versionen, Negotiation und sichere Defaults

Eine Version- und Cipher-Policy ist eine Kompatibilitätsentscheidung, kein beliebiger Härtungsschalter. RFC 9846 obsoletiert RFC 8446, behält TLS 1.3 als Versionsnummer und verbietet die Verhandlung von TLS 1.0 und TLS 1.1, die durch RFC 8996 deprecated sind. TLS 1.2 kann aus Kompatibilitätsgründen vorkommen, benötigt aber eine bewusst begrenzte Policy, gemessene Verbraucher und einen Migrationsplan.

| Entscheidung | Gute Fragestellung | Gefährliche Abkürzung |
|---|---|---|
| Mindestversion | Welche Clientklasse benötigt sie, wie lange, und wie wird Nutzung gemessen? | „Alle Versionen für Kompatibilität aktivieren.“ |
| Cipher/Group | Unterstützt die Bibliothek die aktuelle sichere Policy ohne selbst gebaute Kryptografie? | Eigene Cipher- oder Prioritätslogik schreiben. |
| ALPN | Welches Anwendungsprotokoll wird auf diesem TLS-Kanal erwartet? | Protokollannahme nur aus Port 443 ableiten. |
| SNI | Welchen Namen erwartet der Client, wenn viele Dienste eine IP teilen? | SNI mit erfolgreicher Namensprüfung gleichsetzen. |
| Fallback | Ist ein Downgrade absichtlich, sichtbar, zeitlich begrenzt und rückrollbar? | Bei jedem Fehler still auf Klartext oder Legacy fallen. |

Die Laufzeitbibliothek soll Versionen, Named Groups, Signatur- und Cipher-Auswahl implementieren. Architektur definiert die Policy und Testmatrix; sie implementiert keine Kryptografie selbst.

### Zertifikat, Kette und Vertrauensanker

Ein X.509-Zertifikat bindet einen öffentlichen Schlüssel an Aussagen, etwa Subject Alternative Names (SAN), Aussteller und Gültigkeitszeit. In einer üblichen PKIX-Kette signiert eine Intermediate CA das Leaf-Zertifikat; weitere Intermediate-Zertifikate führen zu einem Trust Anchor im Client-Trust-Store. Der Trust Anchor ist eine lokale Vertrauensentscheidung, nicht eine Eigenschaft, die der Server frei mitliefert.

```text
expected DNS name: api.example.internal
      |
leaf: SAN DNS:api.example.internal; public key; validity; issuer
      | signed by
intermediate CA: constraints and issuing key
      | signed by
trust anchor: locally approved CA/public key in this client population
```

Eine robuste Prüfung umfasst als Mindestmodell:

| Prüfaspekt | Frage | Typische Fehlermeldung/Evidenz |
|---|---|---|
| Kettenaufbau | Kann das Leaf über zulässige Intermediates zu einem lokalen Anchor validiert werden? | unknown CA, unable to get issuer, path building failed |
| Zeit | Liegt die lokale Prüfzeit im gültigen Fenster und ist die Zeitquelle plausibel? | expired, not yet valid, clock skew |
| Dienstidentität | Passt der erwartete DNS-ID oder IP-ID nach Service-Identity-Policy? | hostname mismatch, name not in SAN |
| Schlüssel/Usage | Erlauben Zertifikat und lokale Policy die beabsichtigte Authentisierung? | unsupported signature, key usage/EKU policy failure |
| Handshake-Bindung | Beweist `CertificateVerify` den Besitz des Schlüssels und bestätigt `Finished` den Transcript? | bad certificate verify, decrypt/error alert |
| Status/Policy | Verlangt die Umgebung zusätzliche Revocation- oder Enterprise-Policy? | policy-specific validation failure |

RFC 9525 behandelt die Service Identity bei TLS. Für eine DNS-basierte Zielidentität wird der vom Client beabsichtigte Referenzname gegen geeignete Identity-Informationen des Servers validiert. Der Name soll aus der Dienstkonfiguration kommen, nicht aus einem zufällig gelieferten Reverse-DNS-Eintrag. Wildcards, Canonical Names und IP-Literale haben präzise Regeln und benötigen Bibliotheksfunktionen statt selbst geschriebener Stringvergleiche.

### SNI, DNS und der erwartete Name

Server Name Indication (SNI) ist eine TLS-Erweiterung, mit der der Client dem Server beim ClientHello einen Servernamen geben kann. Das hilft, bei gemeinsamer IP oder gemeinsamen Listenern das richtige Zertifikat und die richtige vHost-Konfiguration auszuwählen. SNI ist **kein** Vertrauensbeweis: Der Client muss nach Auswahl des Zertifikats weiterhin die erwartete Serveridentität prüfen.

```text
client intent: payments.example.internal
DNS answer: 10.10.8.20
SNI: payments.example.internal
server selects certificate for payments.example.internal
client validates chain AND DNS-ID payments.example.internal
```

Eine häufige Fehlersuche trennt daher vier Ebenen: falscher DNS-Name, richtige Adresse aber falsches SNI, richtige Kette aber falscher SAN, oder richtige Identität aber nicht vertrauenswürdiger Anchor. Ein temporäres Abschalten der Verifikation verschmilzt diese Ursachen zu einem verdeckten Sicherheitsfehler.

### Schlüsselableitung, Forward Secrecy und Sitzung

Ein Schlüsseltausch erzeugt pro Verbindung oder Resumption-konform frisches Schlüsselmaterial nach der spezifizierten Key Schedule. Bei modernem, ephemeral asymmetrischem Key Exchange soll der spätere Verlust eines langfristigen Signaturschlüssels nicht nachträglich aufgezeichneten Verkehr entschlüsselbar machen. Das ist Forward Secrecy, keine Garantie gegen kompromittierte Endpunkte oder bereits gestohlene Session Secrets.

TLS 1.3 kann PSK und `NewSessionTicket` zur Resumption einsetzen. Das spart Latenz und Last, verschiebt jedoch Entscheidungen über Ticket-Schutz, gemeinsame Key-Rotation, Load-Balancer-Sharing und Observability in die Plattform. Resumption darf nicht dazu führen, dass ein Client nach Trust-Store- oder Policy-Änderung unsichtbar alte Annahmen weiterträgt.

**0-RTT Early Data** kann einen Round Trip sparen, hat aber Replay-Eigenschaften. Eine Wiederholung kann bei mehreren Servern, nach Paketwiederholung oder verteilter Ticketverarbeitung eintreffen. Akzeptiere 0-RTT nur für bewusst sichere, idempotente Operationen mit Anwendungs- und Infrastrukturmaßnahmen gegen Wiederholung. Zahlung auslösen, Token ausgeben, Zustände ändern oder Authentisierungsgrenzen verschieben ist kein Standardfall für Early Data.

## Architektur und Data Flow

### Edge-Termination als neue Sicherheitsgrenze

TLS ist Ende-zu-Ende zwischen seinen technischen Endpunkten. Endet eine Verbindung an CDN, API Gateway, Load Balancer, Reverse Proxy oder Service Mesh Proxy, endet dort auch der ursprüngliche kryptografische Kanal. Der nächste Hop braucht eine eigene, explizit geschützte Verbindung und eigene Identitäts- und Autorisierungsannahmen.

```text
Browser -- TLS A --> edge proxy -- TLS B/mTLS --> application -- TLS C --> dependency
          ^                   ^                ^                 ^
          client trusts       A ends here       B starts here     each channel is distinct
```

| Modell | Nutzen | Verpflichtung |
|---|---|---|
| Passthrough | Backend bleibt TLS-Endpunkt, geringere Klartextfläche am Edge. | L7-Funktionen und Zertifikatsrouting sind eingeschränkt; Backend skaliert Handshakes. |
| Edge-Termination | Edge kann L7-Routing, WAF-Integration und zentrale Beobachtung ausführen. | Klartext ist am Edge verfügbar; Backend-Hop braucht eine definierte Schutzgrenze. |
| Re-encrypt | Edge terminiert und baut TLS zum Backend neu auf. | Zwei Zertifikats-/Trust-Domänen, Hostname und mTLS-Policy müssen überprüft werden. |
| mTLS intern | Beide Peers authentisieren sich auf Kanalebene. | Workload-Identity, Mapping, Rotation und Autorisierung sind getrennt zu gestalten. |

Header wie `X-Forwarded-For` oder `X-Forwarded-Proto` sind nur innerhalb einer kontrollierten Proxy-Vertrauenskette aussagekräftig. Ein Backend darf sie nicht von jedem beliebigen Netzwerkpeer als Sicherheitswahrheit akzeptieren. Die Terminierungsdokumentation nennt deshalb Listener, Protokoll, Zertifikatsquelle, erwarteten Namen pro Hop, Forwarded-Header-Vertrag, Klartextzonen und Logging-Redaktion.

### mTLS und Anwendungsauthorisierung

mTLS lässt beide TLS-Peers kryptografisches Identity-Material vorlegen. Das kann einen Workload, ein Gerät oder eine Organisationseinheit authentisieren, ist aber nicht automatisch Benutzer- oder Business-Autorisierung. Ein Dienst muss entscheiden, wie ein validierter Client-Subject/SAN in eine interne Principal-ID übersetzt wird, wer diese Zuordnung besitzt und welche Berechtigung daraus folgt.

```text
TLS client certificate valid
  -> map certificate identity to workload principal
  -> apply service authorization policy
  -> log decision without disclosing certificate/private data unnecessarily
```

Vermeide, ein `CN`-Stringfeld als globale Rollenverwaltung zu behandeln. Definiere eine stabile Identity-Semantik, den zulässigen Issuer/Anchor, SAN-Profile, Widerruf-/Ablaufverhalten, Onboarding und Ersetzungsweg bei kompromittierter Workload.

## Konfiguration und Implementierung

### Policy als überprüfbarer Dienstvertrag

Eine produktionsreife Konfiguration beschreibt Absicht, nicht nur Schalter:

```yaml
service: orders-api
listener:
  expected_dns_names: ["orders.example.internal"]
  minimum_protocol: "TLSv1.2"
  preferred_protocol: "TLSv1.3"
  application_protocols: ["h2", "http/1.1"]
identity:
  server_certificate_source: "approved-issuer-interface"
  client_validation: "required-for-admin-api"
trust:
  client_trust_bundle: "orders-workload-v3"
termination:
  public_edge: "edge-gateway"
  backend: "tls-reencrypt-with-workload-identity"
resumption:
  tickets: "enabled-with-rotatable-protected-keys"
  early_data: "disabled"
observability:
  handshake_metrics: true
  certificate_expiry_alert_days: [30,14,7]
```

Das ist ein Modell, keine kopierbare Produktsyntax. Es muss pro Plattform gegen tatsächliche Konfigurationssemantik und Version geprüft werden. Besonders wichtig sind Defaultwerte: Ein Secret mit Zertifikat, ein Ingress-Objekt oder eine `tls=true`-Option beweist allein weder Namensprüfung noch sichere Backend-Verbindung.

### Sichere Change-Sequenz

1. Inventarisiere Clients, Endpunkte, DNS-Namen, Protokolle, Bibliotheken, Trust Stores und aktuelle Handshake-Telemetrie.
2. Formuliere Minimum/Target, Ausnahmebegründung, Ablaufdatum und Messsignal; verbiete automatisch unbekannte Fallbacks.
3. Teste eine Kompatibilitätsmatrix: moderne und Legacy-Clients, korrekter/falscher Name, fehlender Intermediate, falsche Zeit, untrusted CA, Resumption und Terminierungs-Hop.
4. Rolle gestuft aus, beobachte Version, Alertklasse, Namensfehler, Latenz, CPU und Zertifikatsrestlaufzeit.
5. Rolle bei definierter Regression auf eine dokumentierte, zeitgebundene kompatible Policy zurück; starte Ursachenbehebung statt die Verifikation abzuschalten.
6. Entferne Ausnahme und Legacy-Unterstützung nach gemessener Migration.

Zertifikats- oder Trust-Store-Änderungen sind Sicherheitsänderungen. Ein Backup allein ist kein Rollback, wenn Clients alte Anchors gecacht haben, mehrere Trust Bundles verwenden oder ein Load Balancer unterschiedliche Listenerstände hat.

## Skalierbarkeit, Performance und Reliability

### Latenz, CPU und Kapazität

Vollständige Handshakes kosten Round Trips und asymmetrische Operationen. Resumption kann Last senken, aber Zustandsverteilung und Schlüsselmaterialschutz komplexer machen. Skaliere anhand von Handshakes pro Sekunde, neuen versus resumed Sessions, CPU-Zeit, p95 Handshake-Dauer, Error-/Alert-Raten und Peak-Reconnect-Szenarien, nicht nur anhand des HTTP-Durchsatzes.

| Beobachtung | Mögliche Ursache | Nächste Evidenz |
|---|---|---|
| Hohe Handshake-Latenz | RTT, CPU, Key-Operation, Overload, falsche Route | Client/edge/server Zeitstempel, Version, resumed/full |
| CPU-Spitze nach Deploy | Resumption verlorengegangen, neue Cipher/Group, Retry-Sturm | Ticket-Quote, handshakes/s, Versionen, Connection age |
| Einzelne Clients scheitern | Alte Bibliothek, fehlender Root, TLS-Policy | Clientklasse, Alert, Chain/Name/Version getrennt |
| Fehler genau um Mitternacht | Ablauf, Rotation oder Zeitabweichung | NotBefore/NotAfter, NTP, Rollout- und Cache-Stand |
| Backend in Klartext sichtbar | Terminierung ohne Re-encryption/mTLS | Hop-Diagramm, Listener-, Proxy- und Paketgrenzen |

Plane Rotationswellen und Verbindungswiederaufbau. Eine ansonsten korrekte Zertifikatserneuerung kann bei globalem gleichzeitigen Cache-Flush, fehlenden Intermediates oder nicht synchronisierten Trust Stores eine Ausfallwelle auslösen.

### Failure Modes

| Fehlerbild | Wahrscheinliche Klassen | Sichere Reaktion |
|---|---|---|
| `hostname mismatch` | falscher Zielname, SNI/vHost, SAN, Proxy-Routing | erwarteten Namen, SNI, SAN und Terminierungs-Hop vergleichen; Verifikation aktiv lassen. |
| `unknown CA` | falscher oder fehlender Trust Anchor/Intermediate | Ketten- und Trust-Bundle-Herkunft feststellen, keine beliebige CA importieren. |
| `certificate expired/not yet valid` | Ablauf, falsche Uhr, Rolloutversatz | Zeit und Zertifikatsfenster prüfen, kontrolliert erneuern/rollbacken. |
| protocol/cipher handshake failure | inkompatible Policy oder Clientbibliothek | Messbare Ausnahme oder Clientmigration, niemals Klartext-Fallback. |
| Lastspitze nach Rotation | Session/Ticket-Verlust, Cache, Client-Reconnect | Handshake-Kapazität, gestuftes Rollout, Retry-Budgets. |
| mTLS akzeptiert falschen Dienst | zu weiter Anchor, fehlendes Identity-Mapping | Trust-Domain einschränken und SAN-/Issuer-Policy prüfen. |
| 0-RTT schreibt doppelt | Replay nicht abgefangen | Early Data deaktivieren oder explizite Idempotenz-/Anti-Replay-Architektur einführen. |

## Security, Governance und Compliance

TLS-Policy muss die Datenklassifikation und die Vertrauensgrenze abbilden. Bei Edge-Termination ist Klartextzugriff möglich: Operatorrechte, Debug-Logs, APM-Agenten, WAF, Header und Speicherorte benötigen Zugriffskontrolle, Maskierung und Löschregeln. „Verschlüsselt im Internet“ beantwortet nicht, welche internen Systeme Klartext sehen.

Governance-Fragen sind konkret:

- Wer genehmigt Root-/Intermediate-Änderungen in welchem Trust Store?
- Welche Namespaces oder Teams dürfen eine Dienstidentität beantragen?
- Wie werden ablaufende Zertifikate und verbliebene Legacy-Versionen als Risiko gemessen?
- Wie werden Ausnahme, Owner, Begründung, Ablauf und Entfernung auditiert?
- Welche Vertrags- und Datenresidenzanforderungen gelten an CDN-, Gateway- oder Service-Mesh-Termination?
- Welcher Incidentprozess gilt bei potenzieller Schlüsselkompromittierung, falscher Kette oder großflächiger Validierungsstörung?

Keine Team- oder Cloud-Grenze ersetzt eine explizite Trust-Domain. Besonders private CAs brauchen begrenzte Ausstellungspolicy; ein Client, der einem sehr breiten Unternehmensroot für jede externe Dienstidentität vertraut, trägt eine größere Angriffsfläche als sein Dienstvertrag erkennen lässt.

## Observability und Troubleshooting

### Metriken, Logs und sichere Diagnostik

Erhebe aggregiert und datensparsam:

```text
tls_handshakes_total{listener,version,result}
tls_handshake_duration_seconds{listener,version}
tls_alerts_total{alert_class,peer_class}
tls_sessions_total{mode=full|resumed}
tls_certificate_not_after_seconds{service,identity_set}
tls_policy_exception_total{exception_id}
```

Messe Namen oder vollständige Zertifikate nicht pauschal als hochkardinale Metrik und logge keine Session Secrets, private Schlüssel, Credentials oder vollständigen personenbezogenen Requestinhalt. Detaildiagnostik erfordert Zugriffskontrolle und zeitlich begrenzte, redigierte Erfassung. Ein Zertifikatsfingerprint kann hilfreich sein, ist aber kein Ersatz für Ketten-, Namen- und Policy-Prüfung.

### Diagnosestammbaum

```text
TLS failure
  -> Is TCP/route/name reachability established? (KB-0056, KB-0058)
  -> Which endpoint actually terminates TLS?
  -> Which expected service name and SNI were sent?
  -> Which version/ALPN and alert were negotiated or rejected?
  -> Does chain build to the intended local anchor?
  -> Is time within validity and synchronized? (KB-0060)
  -> Does SAN match reference identity under policy?
  -> Is this full/resumed/0-RTT/mTLS path?
  -> Did a proxy re-encrypt or forward an untrusted header?
```

Ein Testclient darf für Diagnose eine Kette sichtbar machen, ersetzt aber nicht die Bibliothek des tatsächlich betroffenen Clients. Vergleiche deshalb Runtime, OS-Trust-Store, Container-Image, Proxy, erwarteten Namen und Netzwerkpfad. „Browser funktioniert“ beweist nicht, dass ein Batch-Job, ein Java-Trust Store oder ein mTLS-Workload dieselbe Policy besitzt.

## Cost und FinOps

TLS-Kosten bestehen aus Handshake-CPU, Lastspitzen, Zertifikats-/PKI-Dienst, Gateway- oder CDN-Kapazität, Log- und Tracing-Volumen sowie Engineering für Kompatibilität. Eine zu breit erlaubte Legacy-Policy verschiebt Kosten häufig in Risiken und unendliche Ausnahmen; eine abrupt strenge Policy verschiebt sie in Incidents. Kostensteuerung braucht daher messbare Migration, einen Besitzer und ein Entferndatum.

Resumption ist kein pauschaler Kostensparer: Sie kann Edge-CPU und Latenz reduzieren, aber Ticket-Key-Verteilung, Rotation und mögliche Fehlerdomänen vergrößern. Bewerte sie mit Volumen, Bedrohungsmodell und operationaler Beherrschbarkeit.

## Trade-offs und Anti-Patterns

| Entscheidung | Vorteil | Kosten/Risiko | Kontrollpunkt |
|---|---|---|---|
| Zentral terminieren | einheitliche Policy und L7-Steuerung | Klartext am Edge, Backend-Hop und Konzentration | dokumentierte Re-encryption/mTLS-Grenze |
| Passthrough | kleine Klartextfläche | weniger Edge-Funktionen, Backend-Handshakes | Backend-Skalierung und Routing |
| Privater Anchor | kontrollierte interne Identitäten | Trust-Verteilung und Fehlkonfiguration | begrenzte Issuance und Bundle-Governance |
| Öffentlicher Anchor | breite Client-Kompatibilität | externe Namens-/Ausstellungs- und Lifecycle-Anforderungen | klarer Scope und automatisierte Erneuerung |
| 0-RTT | geringere Startlatenz | Replay-Semantik | nur safe/idempotent mit Anti-Replay |
| mTLS | Kanalidentität beider Peers | Mapping, Rotation und Betriebsaufwand | Principal- und Authorization-Vertrag |

**Anti-Patterns**

- `verify=false`, „insecure skip verify“ oder das dauerhafte Akzeptieren jedes Zertifikats als Incident-Workaround.
- Einen Hostnamen durch die IP oder den `CN`-String zu ersetzen, ohne die definierte Identity-Policy.
- TLS am Edge zu terminieren und den Backend-Hop als implizit vertrauenswürdig zu behandeln.
- Einen beliebigen Unternehmensroot in jeden Client zu importieren.
- Eine Legacy-TLS-Ausnahme ohne Owner, Messwert und Ablaufdatum.
- 0-RTT für jede HTTP-Methode oder fachliche Aktion freizugeben.
- Private Schlüssel, Session Secrets oder unredigierte Zertifikats-/Requestdaten in Standardlogs zu schreiben.

## Staff-Level Decisions

Ein Staff-/Principal-Entscheidungsrecord beantwortet mindestens:

1. Welcher Dienstname und welche Clientklassen sind Teil des Vertrags?
2. Wo enden und beginnen TLS-Kanäle, und welche Daten sind an jedem Hop sichtbar?
3. Welche Versionen/ALPNs sind Minimum und Target, welche Ausnahme existiert bis wann?
4. Welche Trust Anchors und SAN-/Issuer-Profile dürfen diese Clientpopulation authentisieren?
5. Wann ist mTLS nötig, wie wird eine Zertifikatsidentität in eine Principal-ID übersetzt und wie bleibt Anwendungsauthorisierung separat?
6. Wie werden Zertifikate erneuert, Backends re-encrypted und Fehler ohne Deaktivierung der Prüfung rückgerollt?
7. Welche Metriken beweisen Migration, Restlaufzeit, Handshakekapazität und Fehlerrate?

Ein gutes Review verlangt Testfälle, die ein falsch ausgestelltes, abgelaufenes, falsch benanntes und untrusted Zertifikat **ablehnen**. Ein erfolgreicher Happy Path allein beweist keine Validierung.

## Chief-Level Decisions

Chief-Level setzt einen organisationsweiten Rahmen statt eine einzelne Cipherliste vorzuschreiben:

- Definiere erlaubte Trust-Domains, CA-/Trust-Store-Ownership und den Weg für Ausnahmen.
- Setze Migrationstermine auf Basis gemessener Clientnutzung; verhindere, dass Legacy-Ausnahmen dauerhaft unsichtbar werden.
- Verknüpfe Terminierung mit Datenschutz-, Lieferanten-, Logging- und Incidentverantwortung.
- Plane kryptografische Agilität: Bibliotheksinventar, Konfigurationsschnittstellen, Testlabs, Kompatibilität und Ausstiegspfade vor einem Algorithmuswechsel.
- Entscheide, welche Control Plane Zertifikate verteilt und welche evidenzbasierte Trennung zwischen Ausstellung, Deployment, Trust und Anwendungsauthorisierung gilt.
- Berichte Risiko als ablaufende Identitäten, nicht migrierte Clients, unklare Terminierung, zu breite Trusts und nicht verifizierbare Ausnahmebestände.

## Production Checklist

- [ ] Erwartete DNS-/IP-Identität ist für jeden Client dokumentiert; DNS-Auflösung ist davon getrennt.
- [ ] TLS-Endpunkte, Terminierungspunkte, Backend-Hops und Klartextzonen sind als Diagramm und Vertrag vorhanden.
- [ ] Mindest-/Target-Version, ALPN und zeitgebundene Ausnahmen haben Owner und Messwert.
- [ ] Zertifikatskette, Trust Anchor, SAN-/Issuer-Policy und Zeitprüfungen sind für jede Clientpopulation getestet.
- [ ] mTLS-Bedarf, Principal-Mapping und Anwendungsauthorisierung sind getrennt dokumentiert.
- [ ] Re-encryption oder mTLS für relevante Backend-Hops ist explizit validiert.
- [ ] Rotation enthält gestuftes Rollout, Restlaufzeit-Alerts, Rollback und Peak-Reconnect-Kapazität.
- [ ] Vollständige und resumed Handshakes, Alertklassen, Latenz und Policy-Ausnahmen sind beobachtbar.
- [ ] Logs enthalten keine privaten Schlüssel, Session Secrets oder unnötigen Klartext.
- [ ] 0-RTT ist deaktiviert oder pro Operation technisch und fachlich gegen Replay abgesichert.
- [ ] Negativtests für falschen Namen, fehlende Kette, falsche Zeit und untrusted Anchor sind automatisiert.

## Interviewfragen mit Antworten

### 1. Warum reicht eine erfolgreiche TCP-Verbindung zu Port 443 nicht?

TCP beweist Erreichbarkeit eines Sockets. TLS muss zusätzlich eine zulässige Version/Verhandlung schaffen, die erwartete Peer-Identität prüfen und die Kette bis zu einem lokalen Trust Anchor validieren. Port 443 ist keine Identität.

### 2. Was unterscheidet SNI von der Zertifikatsnamensprüfung?

SNI ist ein beim Handshake gesendeter Hinweis, mit dem ein gemeinsamer Listener das passende vHost/Zertifikat auswählen kann. Der Client muss anschließend weiterhin den konfigurierten Referenznamen gegen die Serveridentität validieren. SNI allein ist kein Trust-Signal.

### 3. Was endet bei TLS-Termination an einem Gateway?

Der ursprüngliche TLS-Kanal und seine Traffic Keys enden am Gateway. Ein Backend-Hop braucht eine neue Verbindung und eine eigene Policy. Header, die das Gateway weitergibt, sind nur innerhalb einer explizit kontrollierten Proxy-Vertrauenskette verwertbar.

### 4. Warum ist `verify=false` kein vertretbarer Produktionsfix?

Es unterdrückt gerade die Prüfung, die eine falsche oder bösartige Gegenstelle erkennen soll. Die kurzfristige Symptomfreiheit verdeckt Ursachen wie falscher Name, abgelaufenes Zertifikat oder falscher Trust Store und schafft eine dauerhafte MitM-Fläche.

### 5. Was ist der zentrale Trade-off von Session Resumption und 0-RTT?

Resumption kann Latenz und Handshake-CPU verringern, benötigt aber kontrollierte Ticket-/Key-Verteilung und Rotation. 0-RTT kann zusätzlich einen Round Trip sparen, erlaubt jedoch Replay-Risiken; es darf nur für eng abgegrenzte, sichere Anwendungssemantik verwendet werden.

### 6. Authentisiert mTLS einen Benutzer?

Nicht zwangsläufig. mTLS authentisiert den TLS-Peer gemäß dessen Zertifikats- und Trust-Policy, oft einen Workload oder ein Gerät. Die Anwendung braucht weiterhin ein Mapping zu einer Principal-ID und eine eigenständige Berechtigungsentscheidung.

### 7. Warum ist ein breiter Unternehmensroot in jedem Trust Store riskant?

Jede CA unter dieser Vertrauenshierarchie kann unter Umständen Identitäten ausstellen, die der Client akzeptieren würde. Ohne Einschränkung auf Dienst- und Trust-Domain vergrößert das die Menge der akzeptierbaren Gegenstellen und erschwert Incidentführung.

## Praktisches Lab: Deklarative TLS-Validierungsentscheidung

**Zweck:** Trainiere die Reihenfolge der Prüfentscheidungen ohne echten Handshake und ohne Kryptografie selbst zu implementieren. Die Daten repräsentieren Ergebnisbehauptungen eines vertrauenswürdigen Validators, nicht echte Zertifikatsprüfung.

```python
from dataclasses import dataclass
from datetime import date

@dataclass(frozen=True)
class PeerEvidence:
    expected_dns: str
    presented_sans: tuple[str, ...]
    chain_to_anchor: bool
    valid_from: date
    valid_to: date
    server_terminates_here: bool
    early_data_method: str | None

def decide(p: PeerEvidence, now: date) -> str:
    if not p.server_terminates_here:
        return "REJECT: termination boundary unknown"
    if not p.chain_to_anchor:
        return "REJECT: chain does not reach approved anchor"
    if not (p.valid_from <= now <= p.valid_to):
        return "REJECT: certificate validity window"
    if p.expected_dns not in p.presented_sans:
        return "REJECT: service identity mismatch"
    if p.early_data_method not in (None, "GET", "HEAD"):
        return "REJECT: replay-sensitive early data"
    return "ACCEPT: modeled policy only"
```

Führe als Fallarbeit aus oder diskutiere:

1. Positivfall: erwarteter Name steht in SAN, Kette und Zeit sind gültig, klarer Terminierungspunkt, keine Early Data.
2. Negativfall: DNS liefert die richtige IP, SAN enthält aber einen anderen Namen. Ergebnis muss Ablehnung sein.
3. Negativfall: SAN stimmt, die Kette erreicht keinen genehmigten Anchor. Ergebnis muss Ablehnung sein.
4. Negativfall: Uhr liegt vor `valid_from` oder nach `valid_to`; prüfe den Bezug zu KB-0060.
5. Negativfall: bekannte Kette und Name, aber `POST` als Early Data. Ergebnis muss Ablehnung sein.
6. Ergänze ein Feld `client_principal`; diskutiere, warum dessen erfolgreiche Validierung noch keine Geschäftsberechtigung ergibt.

**Aufräumen:** Lösche die lokale Datei oder den temporären Interpreterzustand. Kein Netzwerk, keine Schlüssel, keine Zertifikate, Trust Stores, DNS-Einträge, Proxy-, Gateway-, Cloud- oder Produktionsressourcen werden angefasst.

## Dependencies und Cross-References

| Beziehung | Datei | Zweck |
|---|---|---|
| Requires | [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Hypothesen und Evidenz. |
| Requires | [KB-0056](08-tcp-verbindungen-und-ueberlastkontrolle.md) | Transport- und Portkontext. |
| Requires | [KB-0058](10-dns-aufloesung-und-caches.md) | Referenzname und DNS voneinander trennen. |
| Requires | [KB-0060](12-ntp-und-zeitsynchronisation.md) | Zeitprüfung und Clock Skew. |
| Requires | [KB-0065](17-nat-und-verbindungszustand.md) | Pfad- und Zwischenkomponentenmodell. |
| Applies to | [KB-0068](20-quic-und-http3.md) | TLS-1.3-Integration über QUIC. |
| Applies to | KB-0418 | Plattformterminierung und Workload-Identity. |
| Applies to | KB-0720 | Enterprise- und Chief-Level-Entscheidungsrahmen. |

## Quellen und Aktualitätsgrenze

**Recherche-Cutoff: 2026-09-16.** Versionstatus, Browser-/Bibliotheksunterstützung, CA-/Trust-Store-Policy und Produkte ändern sich. Prüfe vor einer Produktentscheidung stets die primären Dokumentationen der eingesetzten Runtime und Plattform.

1. [RFC 9846 — TLS Protocol Version 1.3](https://www.rfc-editor.org/info/rfc9846/) — aktuelle TLS-1.3-Spezifikation, Handshake, Record Layer, Version- und Sicherheitsanforderungen.
2. [RFC 9525 — Service Identity in TLS](https://www.rfc-editor.org/info/rfc9525/) — Referenzidentität und Serveridentitätsprüfung für TLS-Protokolle.
3. [RFC 5280 — Internet X.509 PKI Certificate and CRL Profile](https://www.rfc-editor.org/info/rfc5280/) — PKIX-Zertifikats- und Pfadvalidierungsmodell.
4. [RFC 6066 — TLS Extensions](https://www.rfc-editor.org/info/rfc6066/) — historische TLS-Erweiterungen einschließlich SNI; durch aktuelle TLS-Spezifikation teilweise aktualisiert.
5. [RFC 8996 — Deprecating TLS 1.0 and TLS 1.1](https://www.rfc-editor.org/info/rfc8996/) — Status alter TLS-Versionen.
6. [RFC 8701 — GREASE](https://www.rfc-editor.org/info/rfc8701/) — Interoperabilitätstests gegen starre TLS-Implementierungen.
7. [KB-0056](08-tcp-verbindungen-und-ueberlastkontrolle.md) — lokaler Wissenskontext für Transportverhalten.
8. [KB-0058](10-dns-aufloesung-und-caches.md) — lokaler Wissenskontext für Namen und Auflösung.
9. [KB-0060](12-ntp-und-zeitsynchronisation.md) — lokaler Wissenskontext für Zertifikatszeit.

## Bonus: New Tech and Innovations

RFC 9846 formuliert TLS 1.3 so, dass der asymmetrische Schlüsseltausch nicht nur auf klassische Diffie-Hellman-Varianten festgelegt ist, sondern Erweiterungen für Key-Encapsulation Mechanisms abbilden können. Post-Quantum-Hybrid-Deployment ist dennoch kein „Cipher-Switch“: Client-/Server-Kompatibilität, Handshake-Größe, Middleboxes, Zertifikats- und Trust-Policy, Performance, Telemetrie und Rückbau müssen als ganze Migration erprobt werden.

Privacy-Innovationen wie Encrypted Client Hello (ECH) können sichtbare ClientHello-Metadaten verringern, ändern jedoch nicht die Pflicht zur Dienstidentitätsprüfung oder die Sichtbarkeit an einem Terminierungspunkt. GREASE hilft Implementierungen, unbekannte Werte robust zu behandeln. Beide Themen eignen sich für kontrollierte Interoperabilitäts-Piloten mit echten Clientklassen und negativen Tests, nicht für eine ungemessene globale Aktivierung.

Ein Pilot akzeptiert eine TLS-Innovation erst, wenn Handshake, Namens- und Vertrauensprüfung, Terminierungsgrenzen, Sitzungs- und Replaysemantik, Observability, Datenschutz und Rollback für jede betroffene Client- und Serverklasse nachgewiesen sind.

