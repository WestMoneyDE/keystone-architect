---
{"id": "KB-0056", "title": "TCP-Verbindungen und Überlastkontrolle", "domain": "03", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Zeitachse", "Fehlerhypothese", "Performance-Debugging"], "needed_for": "both"}, {"id": "KB-0049", "concepts": ["Transport-Schicht", "Sockets", "Kapselung"], "needed_for": "both"}, {"id": "KB-0053", "concepts": ["IPv6", "Dual Stack", "PMTU-Kontext"], "needed_for": "understanding"}, {"id": "KB-0055", "concepts": ["Path MTU", "ICMP", "Pfadfehler"], "needed_for": "both"}], "related": ["KB-0057", "KB-0058", "KB-0059", "KB-0060", "KB-0105", "KB-0117", "KB-0720"], "applies": ["KB-0105", "KB-0117", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein reines Python-Modell bildet Handshake, Sequenz-/ACK-Fortschritt, einen Verlust, SACK-Hinweis, Rückstau und den geordneten Byte-Stream ab.", "rationale": "Das Lab öffnet keinen Socket und führt keine reale Verbindung, Last, Packet Capture, Kernel-, Firewall-, Cloud- oder Produktionsänderung aus."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein Kommunikationsvertrag verbindet TCP mit Address Family, PMTU, Proxy/LB, TLS, Timeouts, Connection Pooling, Backpressure, Retry/Idempotenz, Observability und Ownership.", "rationale": "TCP-Zustellung bis zum Socket ersetzt weder Geschäftsabschluss noch sichere Wiederholung; diese Semantik liegt über dem Transport."}, "STAFF-TARGET": {"active": true, "scope": "Teams unterscheiden Handshake-, Flow-Control-, Congestion-, Loss-, PMTU-, TLS-, Proxy- und Anwendungsfehler anhand korrelierter Client-, Server-, Plattform- und Netzsignale.", "rationale": "Sie vermeiden reflexhafte Timeout-/Retry-/Pool-/Kerneländerungen und steuern Last, Queues und Deadlines als End-to-End-System."}, "CHIEF-TARGET": {"active": true, "scope": "Die Organisation entwickelt Transport- und Connectivity-Standards für API, Streaming, Edge, Multi-Cloud und GenAI-Workloads inklusive Resilienz, Kosten, Lieferantenanforderungen und Incident-Eskalation.", "rationale": "Entscheidungen zwischen TCP, QUIC, Proxy und Mesh berücksichtigen SLO, Security, Datenklasse, Path Diversity, Betriebsfähigkeit und Produktwirkung."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "TCP-stack internals, BBR/BBRv3, CUBIC-/DCTCP-Tuning, ECN in Fabrics, MPTCP, SYN-cookies, eBPF tcp tracing, NIC offloads und packet-level loss recovery sind Spezialistentiefe.", "rationale": "Die Zielrollen müssen unterstützte Algorithmen, Limits, Nachweise und Risiken bewerten; das tiefgreifende Kernel-/Fabric-Tuning kann bei Spezialisten liegen."}}, "lab_validation": [{"lab_id": "KB-0056-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox ohne Netzwerkzugriff", "evidence": "TCP-Zustandsfolge, Verlust/SACK-, Receive-Window- und HOL-Interpretation als deterministische Fallarbeit geprüft.", "limitations": "Nicht ausgeführt; keine TCP-Socketverbindung, kein SYN, kein Segment, keine Last, kein Capture, keine Kernel-/sysctl-/Firewall-/Route-/Cloud- oder Produktionsressource wurde verwendet oder verändert."}]}
---
# TCP-Verbindungen und Überlastkontrolle

> **Ziel:** TCP liefert einen zuverlässigen, geordneten Byte-Stream zwischen zwei Sockets. Es verspricht keine fachliche Einmaligkeit, keine lückenlose Liveness-Erkennung und keine unbegrenzte Durchsatzrate. Entwerfe Anwendungen so, dass Transportzustand, Backpressure, Timeouts, Retry, Idempotenz und Observability zusammenpassen.

## Purpose, Definition und Scope

Transmission Control Protocol (TCP) ist ein verbindungsorientiertes Transportprotokoll. Es identifiziert Flüsse über Adressen und Ports, nutzt Sequenznummern, Checksummen, Acknowledgements und Retransmissions für zuverlässige, geordnete Byte-Übertragung und reguliert den Versand über Receiver- und Congestion-Window. RFC 9293 ist die aktuelle zusammengeführte Basisreferenz für TCP.

Dieses Kapitel behandelt:

- Handshake, Sequenz-/Acknowledgement-Raum, Segmentierung und Zustandsmaschine;
- Receiver Flow Control, Congestion Control, ECN, Loss Recovery, RTO und SACK;
- Head-of-Line-Blocking auf TCP-Byte-Stream-Ebene;
- FIN, RST, TIME_WAIT und kontrollierten Verbindungsabbau;
- Performance, Security, Observability, Kosten und Architekturentscheidungen.

Nicht im Scope: konkretes Betriebssystem-Tuning, eine vollständige TCP-Implementierung, UDP/QUIC-Implementierung oder HTTP/gRPC-Details. Sie werden nur dort genannt, wo sie die Architekturentscheidung erklären.

Nach diesem Kapitel kannst du:

1. eine TCP-Verbindung vom SYN bis zum Abbau nachvollziehen;
2. Sequenznummern, ACKs, Fenster, Retransmits und SACK sauber interpretieren;
3. Receiver Backpressure von Netzüberlastung unterscheiden;
4. TCP-Level Head-of-Line-Blocking von Anwendungs-/Proxy-/Queue-Latenz abgrenzen;
5. eine Produktionsdiagnose auf echte Transport- und Anwendungsevidenz stützen.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | IETF-Standards erläutern TCP-Funktion, RTO, SACK, ECN und CUBIC. |
| HANDS-ON-TARGET | Offline-Fallarbeit modelliert Zustandsübergänge ohne Netzwerkzugriff. |
| ARCHITECT-TARGET | TCP wird mit Deadline, Retry, Idempotenz, Pooling, PMTU, TLS und SLO zusammen entworfen. |
| STAFF/PRINCIPAL | Triage trennt Handshake, Window, Congestion, Loss, Proxy, TLS und Anwendungswirkung. |
| CHIEF | Transportwahl, Edge-/Mesh-/Providerfähigkeit und Resilienz werden als Portfolio geführt. |

## Mental Model: zwei Budgets begrenzen den Versand

TCP kann nur neue Nutzdaten bis zur kleineren der beiden Grenzen versenden:

```text
sendable data <= min(receiver window, congestion window)

receiver window (rwnd): Empfänger kann oder will nicht mehr puffern.
congestion window (cwnd): Sender reduziert Druck auf den Netzpfad.
```

Das ist eine mentale Vereinfachung, keine vollständige TCP-Implementierung. Zusätzlich wirken Socketpuffer, Application Reads/Writes, MSS, PMTU, ACK-Verhalten, Optionen, Pacing, Loss Recovery, TLS/Proxy, CPU und Queues. Die Architekturfrage lautet: **Wo entsteht Rückstau, welches Budget ist erschöpft und wie reagiert die Anwendung kontrolliert?**

TCP liefert Daten als geordneten Byte-Stream. Es transportiert keine Anwendungsnachrichten als unteilbare Einheiten. Eine Anwendung muss ihre eigene Framing-, Idempotenz- und Completion-Semantik definieren.

## Prerequisites und Dependencies

| ID | Art | Bedeutung |
|---|---|---|
| [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Anwendung und Lab | Zeitachse und Hypothesen verhindern ein blindes „TCP ist langsam“. |
| [KB-0049](01-osi-und-tcp-ip-als-analysemodelle.md) | Anwendung und Lab | Transport-/IP-/Application-Grenzen und Socketmodell. |
| [KB-0053](05-ipv6-adressierung-und-uebergang.md) | Verständnis | IPv6-, Dual-Stack- und Adressfamilienunterschiede. |
| [KB-0055](07-icmp-und-pfadfehler.md) | Anwendung und Lab | PMTU, ICMP/ICMPv6 und Pfadfehler beeinflussen TCP-Segmente. |

## Core Concepts

### Three-Way Handshake

Der Handshake synchronisiert Sequenzraum und verhandelt im SYN-Kontext wichtige Optionen wie MSS und gegebenenfalls Window Scale, SACK Permitted oder Timestamps.

```text
client                                        server
SYN, seq = C  ------------------------------->
                     <---------------- SYN+ACK, seq = S, ack = C+1
ACK, ack = S+1 ------------------------------>

ESTABLISHED                                   ESTABLISHED
```

SYN belegt jeweils eine Sequenznummer. Die ACK-Nummer benennt die **nächste erwartete Byteposition**, nicht „die Anzahl der Pakete“. Ein vollständiger Handshake bedeutet: Der TCP-Listener und Pfad konnten diese Verbindung aufbauen. Er beweist noch keine TLS-Verhandlung, Benutzerautorisierung, Anwendungskapazität oder dauerhafte Liveness.

### Sequenzraum, ACKs und SACK

```text
sender sends bytes 1000..1499, then 1500..1999
receiver receives 1000..1499 and 2000..2499, but 1500..1999 is missing

cumulative ACK: 1500
SACK information: "I already have 2000..2499"
```

Cumulative ACKs bestätigen lückenlos bis zur nächsten erwarteten Position. Selective Acknowledgment (SACK) kann zusätzliche empfangene Bereiche beschreiben und damit unnötige Retransmits reduzieren. SACK ist kein fachlicher Commit; es beschreibt Transportempfang.

### Flow Control, Congestion Control und Backpressure

| Mechanismus | Primäres Ziel | Signal | Häufige Fehlinterpretation |
|---|---|---|---|
| Receiver Flow Control | Empfängerpuffer/-read schützen | advertised receive window, bis Zero Window | „Das Netz ist überlastet.“ |
| Congestion Control | Netzpfad vor Überlast schützen | Loss, ACK-Fortschritt, ECN; Algorithmuszustand | „Der Server liest zu langsam.“ |
| Application Backpressure | begrenzte Business-/Queue-/CPU-Ressourcen schützen | admission control, Queue, Deadline, 429/503 o.ä. | „TCP löst das automatisch.“ |
| Connection Pool Limit | Verbindungskapazität und Isolation | Pool wait, pending requests | „Alles ist TCP-Loss.“ |

TCP Slow Start, Congestion Avoidance, Fast Retransmit/Fast Recovery sind verbreitete Grundkonzepte. Der konkrete Algorithmus kann variieren. CUBIC ist in RFC 9438 spezifiziert und für schnelle/weite Netzwerke beschrieben; andere Plattformen können andere Algorithmen oder versionierte Implementierungen einsetzen. Vermeide die Behauptung eines universellen OS-Defaults.

ECN kann Überlast markieren, bevor Paketverlust eintritt. ECN-Nutzung ist End-to-End- und Pfadabhängig: Client, Server, Netzgeräte, Security-/Middleboxes und Policies müssen sie korrekt unterstützen.

### Loss Recovery und RTO

TCP erkennt Verlust über fehlenden ACK-Fortschritt, wiederholte ACKs/SACK-Information oder ausbleibende Bestätigung innerhalb eines Retransmission Timeout. RFC 6298 beschreibt die Berechnung des RTO. Ein Retransmit kann auch durch Reordering, ACK-Verlust, path asymmetry oder lokale Überlast ausgelöst erscheinen; er ist ein Signal, keine isolierte Ursachenbehauptung.

**Wichtige Grenze:** Wenn der Sender wegen Timeout erneut schreibt, kann die Anwendung unklar lassen, ob die Gegenoperation bereits verarbeitet wurde. Ein Zahlungs-, Job- oder Schreibbefehl braucht daher Idempotency Keys, Zustandsabfrage oder ein anderes Geschäftsprotokoll. TCP schützt Bytes auf einer Verbindung, nicht den fachlichen Exactly-once-Erfolg über Abbruch, Retry, Proxywechsel oder Prozessneustart hinweg.

### Head-of-Line-Blocking

Wenn Bytebereich 1500..1999 fehlt, kann TCP die später empfangenen Bytes ab 2000 der Anwendung auf demselben Stream nicht in Reihenfolge liefern. Das ist TCP-Level Head-of-Line (HOL) Blocking. Bei HTTP/2 können mehrere Anwendungsstreams über eine TCP-Verbindung multiplexiert sein; Verlust eines TCP-Segments kann dadurch auch spätere Bytes anderer HTTP/2-Streams auf dieser Verbindung zurückhalten.

QUIC über UDP organisiert Zuverlässigkeit und Reihenfolge pro Stream und kann deshalb streamübergreifendes TCP-HOL in vielen Fällen reduzieren. Das beseitigt nicht Anwendungsqueues, Congestion, CPU-, Proxy-, Server- oder gemeinsame Pfadengpässe. Transportwahl ist ein messbarer Trade-off, keine Abkürzung zu niedriger Latenz.

### Verbindungsabbau und Reset

```text
active close:
endpoint A: FIN -> B
endpoint B: ACK -> A
endpoint B: FIN -> A
endpoint A: ACK -> B
```

FIN signalisiert „keine weiteren Bytes von dieser Senderseite“, nicht unbedingt das Ende der Gegenrichtung. TIME_WAIT hilft, Verzögerungen und alte Segmente im Abbaukontext zu behandeln; genaue Dauer und Verhalten sind Plattformdetails. RST bricht eine Verbindung abrupt ab und kann verschiedene Ursachen haben: kein Listener, Prozess-/Proxyende, Policy, Stateverlust oder absichtliche Reset-Generierung. Ein RST ist kein ausreichender Security- oder Root-Cause-Beweis ohne Kontext.

## Architecture und Data Flow

### API-Request über TCP, TLS und Proxy

```text
client pool selects connection
  -> DNS/address-family choice
  -> TCP SYN/SYN-ACK/ACK
  -> optional TLS handshake
  -> proxy/LB may terminate and create a second TCP connection
  -> request bytes flow with rwnd/cwnd/PMTU limits
  -> server queue, application and datastore execute
  -> response bytes return over one or more transport connections
  -> FIN/RST/idle timeout or pool reuse
```

Ein Proxy bedeutet, dass zwei TCP-Verbindungen mit getrennten Sequenzräumen, Timern, Congestionzuständen und Fehlern existieren können. Ein Client-Retransmit und ein Upstream-Retransmit sind nicht dasselbe Ereignis. Observability muss Connection-/Hop-/Request-Korrelation modellieren, ohne Nutzdaten unnötig zu speichern.

### Architekturvertrag für kritische Flows

| Feld | Beispiel einer Entscheidung |
|---|---|
| Operation | idempotenter Read, idempotenter Write oder explizit zustandsbehafteter Command. |
| Connection Model | Poolgröße, Idle-/Lifespan-/Handshake-Timeout, Keepalive-/Liveness-Policy. |
| Time Budget | Client deadline, connect/TLS/request budget, retry budget und queue budget. |
| Path | Address Family, proxy/LB/mesh, PMTU-/tunnel-/zone-Annahmen. |
| Backpressure | bounded queues, admission control, shedding und priorisierte Arbeit. |
| Retry | nur bei definiertem Fehlersignal und sicherer Idempotenz/Token. |
| Observability | connection, retransmit, RTT, window, reset, TLS, request outcome, change id. |
| Ownership | Application, Platform, Network, Security und Providerescalation. |

## Protocols, Standards, Tools und Technologien

| Bezug | Aussage | Grenze |
|---|---|---|
| [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293) | TCP Basisfunktion, Header, Zustände, Sequenz-/ACK-/Window-Konzept. | nicht jeder Performancealgorithmus ist darin detailliert. |
| [RFC 5681](https://www.rfc-editor.org/rfc/rfc5681) | TCP Congestion Control Grundkonzepte. | konkrete OS-/Stackwahl prüfen. |
| [RFC 6298](https://www.rfc-editor.org/rfc/rfc6298) | Retransmission Timeout Berechnung. | App-Timeouts dürfen nicht daraus kopiert werden. |
| [RFC 2018](https://www.rfc-editor.org/rfc/rfc2018) | SACK Optionen. | SACK-Policy/Support und Securitykontext prüfen. |
| [RFC 9438](https://www.rfc-editor.org/rfc/rfc9438) | CUBIC für schnelle/weite Netzwerke. | nicht als universeller Plattformdefault annehmen. |
| [RFC 3168](https://www.rfc-editor.org/rfc/rfc3168) | ECN-Grundlage. | middlebox-/path-/providerabhängig. |
| [RFC 9000](https://www.rfc-editor.org/rfc/rfc9000) | QUIC-Kontrast für streambezogene Zuverlässigkeit. | QUIC ist kein pauschaler TCP-Ersatz. |
| Socket-/Kernel-/Proxy-/Flow-Telemetrie | Laufzeitbeobachtung und Triage. | autorisiert, datensparsam und kontextbezogen einsetzen. |

## Konfiguration und Implementation

### Timeouts sind Budget, keine Zahlensammlung

```text
end-to-end deadline
= queue wait + connect + TLS + request send + server work + response read
  + bounded retry budget

Each budget:
  has an owner,
  is measured,
  fails predictably,
  and does not silently multiply across layers.
```

Ein Client, SDK, Proxy, Service Mesh, Load Balancer, Server, Datenbanktreiber und Jobworker können alle eigene Timeouts und Retries besitzen. Ohne ein gemeinsames Budget entstehen Retry-Stürme und Arbeit nach abgelaufener Kundendeadline. Konfiguriere keine TCP-/Kernelzeitwerte aus einer einzelnen Timeoutgrafik; prüfe zuerst Anwendung, Last, Path, Pool, OS und Plattform.

### Retry und Idempotenz

| Operation | Transportfehler möglich? | Sichere Strategie |
|---|---|---|
| Read ohne Seiteneffekt | ja | begrenzter Retry mit Deadline/Jitter und Observability. |
| Idempotenter Write mit Key | ja | Retry nur mit gleicher Idempotency-/Operation-ID und Zustandsabfrage. |
| Nicht idempotenter Command | ja | nicht blind wiederholen; Geschäftsprotokoll/Outbox/Statusabfrage nutzen. |
| Streaming/large upload | ja | Resume-/Chunk-/Checksum-/Sessionmodell über TCP entwerfen. |

### Pooling, Keepalive und Liveness

Connection Pooling kann Handshakes reduzieren, erzeugt aber Stale Connections, unfair queueing, Connection-Explosion oder ungünstige Load Distribution. TCP selbst enthält keine vollständige Liveness-Erkennung. TCP Keepalive, Application Health, Request Deadlines und Load-Balancer-Idle-Timeouts erfüllen unterschiedliche Zwecke. Dokumentiere sie getrennt, teste ihre Wechselwirkung und behandle Werte als umgebungsabhängig.

## Scalability und Performance

### Bandwidth-Delay Product und Windowing

Auf Pfaden mit hoher Bandbreite und Round-Trip-Time muss ausreichend Datenmenge in flight sein, um den Pfad auszulasten. Windows, Window Scaling, Senderpacing, Congestionalgorithmus, MSS und Application Write-Verhalten beeinflussen dies. Das bedeutet nicht, dass jedes System große Buffer benötigt: übergroße Queues können Latenz, Speicher und Fehlerschäden erhöhen.

| Metrik | Stützt | Beweist nicht |
|---|---|---|
| connect/handshake latency | SYN-/Listener-/Path-/Load-Hinweis | TLS/App-Gesundheit. |
| RTT trend | Pfad-/Queue-/Region-Signal | einzelne Routerursache. |
| retransmit/SACK trend | Loss/Reordering/ACK-/Host-/Path-Hinweis | Netzüberlastung als einzige Ursache. |
| cwnd/ECN (wo sichtbar) | Sender-/Congestion-Verhalten | Empfänger- oder App-Backpressure. |
| rwnd/zero-window | Empfänger-/Application-Read-Druck | globale Netzüberlastung. |
| pool wait / pending requests | lokale Kapazität/Pooling | TCP Loss ohne weitere Evidenz. |
| RST/FIN rate | Connection Lifecycle-Anomalie | Angriff oder konkrete Policyursache. |
| bytes in flight / throughput | effektiver Transfer | Servicequalität ohne App-/Queue-Kontext. |

Performanceziele brauchen mindestens p50/p95/p99 für Connect, TLS, First Byte, Completion, Error und Retry; getrennt nach Region, Zone, Address Family, Clientklasse, Proxy-/Direct-Pfad und Payloadklasse.

## Reliability und Failure Modes

| Symptom | Mögliche Ursacheklassen | Nächste sichere Hypothese |
|---|---|---|
| SYN ohne Erfolg | Listener, route, firewall, overload, address family, path | Ziel, Family, route, policy, server accept capacity und Timeouts korrelieren. |
| Handshake klappt, TLS scheitert | certificate, SNI/ALPN, proxy, policy, time | TCP nicht als Root Cause annehmen. |
| Viele Retransmits | loss, reordering, PMTU, host CPU, NIC, congestion, ACK path | Scope/zone/family/payload und ICMP/queue/host signals prüfen. |
| Zero Window | App liest nicht, receiver buffer/pool/CPU pressure | Receiver/app queue und resource limits prüfen. |
| RST-Spike | no listener, proxy deploy, idle timeout, policy/state loss | Source/target/hop/change/time and error classification prüfen. |
| Große Payload langsam/hängt | PMTU/encapsulation, HOL, buffer, flow/congestion, app | Payload-/family-/path-Korrelation nach KB-0055. |
| Ein HTTP/2-Stream blockiert andere | TCP segment loss + multiplexing oder app/proxy queue | TCP-HOL von application HOL durch traces/metrics trennen. |
| Duplicate business action | Client retry after ambiguous failure | Idempotency/operation state design prüfen, nicht TCP tunen. |

## Security, Governance und Compliance

TCP ist keine Identität und keine Verschlüsselung. Port-/IP-basierte Regeln sind nur eine Netzgrenze. Schutz benötigt TLS/mTLS, Workload Identity, Autorisierung, Rate Limits, Inputlimits und sichere Logs. Relevante Risiken:

- SYN-/Connection-Flooding und Erschöpfung von Listener-/NAT-/LB-/Proxyzustand;
- RST-/Spoofing-/State-Desynchronisation, insbesondere über unzuverlässige oder untrusted Grenzen;
- ungebremste Retries und Connection Storms als Verfügbarkeitsangriff oder Selbstverstärkung;
- Transportmetadaten in Flow-/Trace-Logs als sensitive Betriebs- oder Personenbezugdaten;
- TLS- oder Proxytermination als zusätzliche Vertrauens- und Datenverarbeitungsgrenze.

Definiere Rate-, Connection-, Queue- und Payloadlimits gemeinsam mit Produkt-SLOs. Erlaube keine Kernel-/TCP-/SYN-/Firewall-Tuningänderung ohne Lastmodell, Owner, Securityreview, Changeplan und Rollback.

## Observability und Troubleshooting

### Minimum Connection-to-Request Correlation

```text
timestamp, service/workload identity, request/operation id,
address family, source/destination class, direct/proxy hop,
connection lifecycle state, handshake/TLS timing,
RTT/retransmit/window signals where permitted,
PMTU/ICMP correlation, pool/queue state,
reset/timeout class, application outcome, deployment/change id
```

Keine Standardtelemetrie benötigt Payload oder vollständige Rohpakete. Sampling und Zugriff müssen Datenklassifikation und Incidentbedarf ausbalancieren.

### Triage

```text
1. Welche Nutzeroperation und Deadline ist betroffen?
2. Welche Address Family, Route und Proxy-/LB-Hops wurden verwendet?
3. Scheitert Connect, TLS, Request Send, Server Work oder Response Read?
4. Gibt es rwnd-/pool-/queue-Backpressure oder cwnd/loss/PMTU-Hinweise?
5. Was zeigen SACK/retransmit/ECN/ICMP in zeitlichem Kontext?
6. Ist der Retry fachlich sicher und budgetiert?
7. Welche kleinste freigegebene Messung oder reversible Änderung prüft die Hypothese?
```

## Cost und FinOps

TCP-/Connectivityprobleme kosten über Retry-Transfer, Egress, Load-Balancer-/NAT-/Proxy-Connections, CPU/Memory-Puffer, Observability, Kundenwartezeit und Incidentarbeit. Zu aggressive Pools oder riesige Queues können Infrastrukturkosten und Tail Latency zugleich erhöhen. Zu kleine Budgets verursachen Abbrüche und Wiederholungen.

Bewerte:

- Kosten pro erfolgreicher und pro fehlgeschlagener Operation;
- Connection-/Handshake-/TLS-Anteil, Poolauslastung und Egress;
- Retry-Amplification und Arbeit nach Deadline;
- Managed LB/Proxy/NAT-/Network-/Telemetrypreise;
- Kosten unterschiedlicher Transport-/Edge-/Provideroptionen;
- Businesswirkung von p99-Latenz, Fehlerquote und Doppelverarbeitung.

Preise, Limits und Stackdefaults sind zeit- und vertragsabhängig. Sie werden in der Zielumgebung gemessen, nicht aus allgemeinen TCP-Regeln abgeleitet.

## Trade-offs und Anti-Patterns

| Entscheidung | Gewinn | Risiko | Leitplanke |
|---|---|---|---|
| Große Connection Pools | mehr Parallelität | Connection-/NAT-/LB-Druck, unfair queues | Kapazität, Isolation, timeouts und metrics testen. |
| Aggressive Retries | kurzfristige Erfolgsrate | Retry storm, duplicate actions, cost | idempotent, budgetiert, jittered und observable. |
| Große Socket-/Appbuffers | throughput potential | bufferbloat, memory, delayed failure | BDP-/SLO-/queue-Evidenz. |
| TCP Multiplexing | weniger Handshakes | TCP HOL und gemeinsame Failure Domain | workload-/latency-/isolation-Anforderungen prüfen. |
| QUIC einsetzen | streambezogenes Loss-Verhalten | neue UDP/edge/observability/security assumptions | End-to-end Produkt-/Provider-/SLO-Tests. |
| ECN aktivieren | früheres Congestion-Signal | path/middlebox inconsistency | controlled rollout and fallback evidence. |

**Anti-Pattern: „TCP garantiert Exactly Once.“** Es garantiert Transportzustellung auf einer Verbindung, nicht fachliche Einmaligkeit über Ungewissheit und Retries.

**Anti-Pattern: Timeout erhöhen, bis Alarm verschwindet.** Das kann Queues, Arbeit nach Deadline und Kosten vergrößern. Ursache, Budget und Backpressure müssen zusammenpassen.

**Anti-Pattern: Retransmit = Netzwerkfehler.** Host-, NIC-, ACK-, PMTU-, Reordering-, Proxy- und Lastursachen sind möglich.

**Anti-Pattern: HTTP/2 oder gRPC bedeutet kein HOL.** TCP-Level Loss kann multiplexierte Streams auf derselben Verbindung bremsen.

## Staff-, Principal- und Chief-Level Decisions

### Staff / Principal

1. Schreibe einen Time-/Retry-/Idempotency-Standard pro Operationstyp und erzwinge ihn in SDKs, Gateways und Plattformtemplates.
2. Betreibe Connect/TLS/First-Byte/Completion/Retry separat nach Family, Region, Zone, Client und Path.
3. Definiere Pool-/Queue-/Connection-Limits mit Admission Control und Lasttests, nicht über zufällige Defaults.
4. Prüfe PMTU und Transport nach jeder neuen Kapselung, Mesh-, Proxy- oder Providergrenze.
5. Verlange bei TCP-Incidents korrelierte Evidenz aus Client, Server, Proxy, Plattform und Security.

### Chief

1. Entscheide, welche Transportfähigkeiten API, Streaming, Browser, Edge und Internal Platform benötigen und wie TCP/QUIC/Proxy-Optionen bewertet werden.
2. Finanziere gemeinsame Client-/Server-/Observability-Bausteine, die idempotente Wiederholung und Deadline-Propagation standardisieren.
3. Mache Connection-/Retry-/Queue-Amplification und Tail Latency zu Kosten- und Resilienzmetriken.
4. Prüfe Provider-/LB-/Firewall-/Mesh-Support, Limits, Logging und Exitfähigkeit als Beschaffungskriterium.
5. Verbinde DDoS-/Connection-Schutz mit Produktdegradation, Security und Customer Experience statt isoliertem Netzschutz.

## Production Checklist

- [ ] Jede kritische Operation hat Deadline, Retrybudget, Idempotenz- und Completion-Semantik.
- [ ] Connect-, TLS-, Request-, Server- und Response-Budgets sind zusammengenommen kleiner als die End-to-End-Deadline.
- [ ] A-/AAAA-Pfade, PMTU, MSS-/Kapselungsannahmen und TLS/Proxy-Hops sind getestet.
- [ ] Pool-, Connection-, Queue-, Payload- und Rate-Limits sind mit Last-/Failure-Modell belegt.
- [ ] TCP Handshake-, Retransmit-, Window-, Reset-, Timeout- und Application-Outcomes sind zeitkorreliert beobachtbar.
- [ ] Receiver-/Application-Backpressure wird von Congestion/Loss getrennt analysiert.
- [ ] Retry kann keine unkontrollierte Doppelarbeit oder Trafficamplification erzeugen.
- [ ] SACK/ECN/Congestionalgorithmusannahmen werden pro Stack/Provider validiert, nicht global behauptet.
- [ ] Proxy/LB/Mesh-Connection-Grenzen und Idle-/Lifespan-Timeouts sind dokumentiert.
- [ ] SYN-/Connection-Flood-, NAT-/LB-/Pool- und Securitygrenzen sind getestet und owned.
- [ ] Logs minimieren sensitive Metadaten, regeln Retention und erlauben berechtigte Incident-Korrelation.
- [ ] Jeder TCP-/Kernel-/Firewall-/MTU-Change hat Owner, Akzeptanzkriterium, Backout und Nachbeobachtung.

## Praktisches Lab: Offline-TCP-Byte-Stream und Verlustmodell

**Status:** `reviewed_only`. Das Lab modelliert nur Zahlen und Zustände in Python. Es erzeugt keine Netzverbindung.

```python
segments = [
    {"seq": 1000, "length": 500, "arrives": True},
    {"seq": 1500, "length": 500, "arrives": False},
    {"seq": 2000, "length": 500, "arrives": True},
]

next_expected = 1000
sack_blocks = []

for seg in segments:
    if seg["arrives"] and seg["seq"] == next_expected:
        next_expected += seg["length"]
    elif seg["arrives"]:
        sack_blocks.append((seg["seq"], seg["seq"] + seg["length"]))

print("cumulative ACK:", next_expected)      # 1500
print("SACK blocks:", sack_blocks)           # [(2000, 2500)]
print("application delivery:", "blocked at missing bytes 1500..1999")

rwnd = 1000
cwnd = 600
print("maximum new in-flight bytes:", min(rwnd, cwnd))  # 600
```

### Erwartete Erkenntnisse und Gegenproben

1. Der Receiver bestätigt kumulativ nur bis 1500; die spätere Ankunft 2000..2499 macht fehlende Bytes nicht überspringbar.
2. SACK liefert dem Sender Zusatzwissen, ist aber keine Businessbestätigung.
3. Reduziere `rwnd` auf 0: Das Modell beschreibt Receiver-/Application-Backpressure, nicht automatisch Netzcongestion.
4. Reduziere `cwnd`: Das Modell beschreibt senderseitige Congestionbegrenzung; die echte Ursache muss mit Pfad- und Stackevidenz geprüft werden.
5. Ergänze einen App-Retry nach unklarem Verbindungsabbruch: Ohne Idempotency Key darf das Modell keinen „sicheren Wiederholungs“-Schluss ziehen.

### Cleanup

Lösche nur die temporäre lokale Python-Datei. Das Lab verändert keine TCP-Verbindung, Socket, Kernel-, Route-, MTU-, Firewall-, Cloud- oder Produktionsressource.

## Interviewfragen mit Antworten

### 1. Was bedeutet ein TCP ACK?

Nach dem Handshake benennt es die nächste erwartete Byteposition. Es ist eine kumulative Transportbestätigung, kein fachlicher Commit und keine Bestätigung einer bestimmten Anwendungsnachricht.

### 2. Was ist der Unterschied zwischen rwnd und cwnd?

`rwnd` schützt den Empfänger beziehungsweise dessen Puffer/Read-Verhalten. `cwnd` begrenzt den Sender aufgrund geschätzter Netzüberlastung. Beide können den Versand begrenzen, haben aber unterschiedliche Owner und Fehlersignale.

### 3. Warum kann TCP Head-of-Line-Blocking erzeugen?

TCP liefert den Byte-Stream geordnet. Fehlen Bytes, dürfen später empfangene Bytes auf derselben Verbindung der Anwendung nicht vorgezogen werden. Bei Multiplexing über eine TCP-Verbindung kann dies mehrere höhere Streams beeinflussen.

### 4. Wann ist ein Retry gefährlich?

Wenn nach Verbindungsabbruch unklar ist, ob die Gegenoperation bereits wirkte, und der Command nicht idempotent ist. Die Anwendung braucht Operation IDs, Statusabfrage, Outbox/Saga oder eine andere explizite Geschäftssemantik.

### 5. Was sagt eine Retransmission aus?

Sie zeigt, dass TCP einen Verlust-/Bestätigungsfortschrittsverdacht behandelt. Ursache kann Congestion, Reordering, PMTU, ACK-Verlust, Host-/NIC-Druck, Proxy oder Pfadproblem sein. Zeit- und Scopekorrelation sind nötig.

### 6. Warum ist eine TCP-Verbindung nach Handshake nicht automatisch live?

TCP definiert keine vollständige Liveness-Erkennung. Ein Peer oder Pfad kann später verschwinden, während ein lokaler Socket scheinbar offen bleibt. Anwendungen benötigen Deadlines, Health-/Keepalive-Strategie und sichere Retrysemantik.

### 7. Wann könnte QUIC gegenüber TCP sinnvoll sein?

Wenn mehrere unabhängige Streams auf einem Pfad streamübergreifendes TCP-HOL vermeiden sollen und Browser/Client, Edge, Security, UDP-Policy, Observability, SLO und Betriebsmodell nachweislich passen. Es ist keine automatische Leistungssteigerung.

## Dependencies und Cross-References

| Beziehung | Datei | Verwendung |
|---|---|---|
| Voraussetzung | [KB-0049](01-osi-und-tcp-ip-als-analysemodelle.md) | Transport-, Socket- und Kapselungsgrundlage. |
| Voraussetzung | [KB-0055](07-icmp-und-pfadfehler.md) | PMTU/ICMP als Path-/Segmentgrenze. |
| Vertiefung | [KB-0057](09-udp-und-datagrammverhalten.md) | Datagrammverhalten und Transportvergleich. |
| Vertiefung | [KB-0058](10-dns-aufloesung-und-caches.md) | Name/Address Family von TCP-Fehlern trennen. |
| Anwendung | [KB-0105](../05-distributed-systems/05-leader-election-und-fencing.md) | TCP-Verbindung nicht mit Lease-/Leadership-/Fencing-Semantik verwechseln. |
| Anwendung | [KB-0117](../05-distributed-systems/17-backpressure-und-ueberlast.md) | Queues, Admission Control und End-to-End-Überlast. |
| Evidenz | [KB-0720](../30-architect-practice/44-portfolioevidenz-und-reifemodelle.md) | Transport-/Deadline-/Retry-ADR und Betriebsnachweis. |

## Quellen und zeitliche Einordnung

| Quelle | Verwendung | Stand |
|---|---|---|
| Dateikatalog KB-0056 | verbindlicher Scope und Reihenfolge. | Planstand 2026-09-14 |
| [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293) | TCP Basisfunktion, Header, Zustände, Optionen und Byte-Stream. | abgerufen 2026-09-16 |
| [RFC 5681](https://www.rfc-editor.org/rfc/rfc5681) | Congestion Control Grundkonzepte. | abgerufen 2026-09-16 |
| [RFC 6298](https://www.rfc-editor.org/rfc/rfc6298) | Retransmission Timeout. | abgerufen 2026-09-16 |
| [RFC 2018](https://www.rfc-editor.org/rfc/rfc2018) | Selective Acknowledgment. | abgerufen 2026-09-16 |
| [RFC 9438](https://www.rfc-editor.org/rfc/rfc9438) | CUBIC. | abgerufen 2026-09-16 |
| [RFC 3168](https://www.rfc-editor.org/rfc/rfc3168) | Explicit Congestion Notification. | abgerufen 2026-09-16 |
| [RFC 9000](https://www.rfc-editor.org/rfc/rfc9000) | QUIC-Kontrast. | abgerufen 2026-09-16 |
| [KB-0055](07-icmp-und-pfadfehler.md) | PMTU-/ICMP-Voraussetzung. | 2026-09-16 |

TCP-/QUIC-Stacks, Betriebssystemdefaults, Congestionalgorithmen, NIC-/Kernel-Offloads, Proxy/LB/Mesh-/Cloud-Implementierungen, Providerpfade, Limits, Preise und Compliancevorgaben sind versions- und umgebungsabhängig. Vor einem Change sind konkrete Stackversion, Workloadprofil, Datenklasse, Service-Intent, Owner, Securitypolicy, SLO und Rollback in der Zielumgebung zu validieren.

## Bonus: New Tech and Innovations

**Stand 2026-09-16 — Neue TCP- und QUIC-Stacks kombinieren Pacing, modernere Loss-Recovery, ECN-Varianten und anwendungsnähere Telemetrie, um hohe Bandbreite und niedrige Latenz besser auszubalancieren.** **Reifegrad: etabliert bis adaptiert je Stack.** Ein Rollout braucht reale Pfad-, Middlebox-, Client- und SLO-Evidenz statt eines Algorithmusnamens.

**Stand 2026-09-16 — eBPF- und OpenTelemetry-nahe Connectivity-Signale können Connection Lifecycle, RTT, Retransmits, Windowdruck, TLS und Requestwirkung zusammenführen.** **Reifegrad: adaptiert.** Datenschutz, Sampling, Offload-Sichtbarkeit, Kosten und Zugriffskontrolle sind Teil der Architektur.

**Stand 2026-09-16 — QUIC/HTTP-3 wird dort interessanter, wo streambezogene Verlustisolation und schnelle Transportentwicklung mit Browser-/Edge-/Security-Unterstützung zusammenkommen.** **Reifegrad: etabliert bis adaptiert je Produkt.** A pilot accepts a transport change only when application semantics, path behavior, security, observability, cost and rollback are proven end to end.

