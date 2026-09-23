---
{"id": "KB-0074", "title": "Paketmitschnitte mit Wireshark und Tcpdump", "domain": "03", "sequence": 26, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Zeitreihe", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0056", "concepts": ["TCP-Handshake", "Sequenzraum", "Retransmission"], "needed_for": "both"}, {"id": "KB-0058", "concepts": ["DNS-Transaktion", "Resolver", "Negative Antwort"], "needed_for": "both"}, {"id": "KB-0067", "concepts": ["TLS-Handshake", "Zertifikatskette", "Verschlüsselungsgrenze"], "needed_for": "both"}, {"id": "KB-0072", "concepts": ["Proxy-Hops", "Terminierung", "Headervertrauen"], "needed_for": "understanding"}], "related": ["KB-0073", "KB-0075", "KB-0154", "KB-0562", "KB-0720"], "applies": ["KB-0075", "KB-0154", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Das Lab wertet ausschließlich eine lokal eingebettete, synthetische Ereignisliste aus. Es öffnet kein Interface, erzeugt keinen Traffic und speichert keinen echten Netzwerk- oder Nutzdateninhalt.", "rationale": "Es übt Hypothesen, Zeitachsen und fehlende Beobachtungen, ohne eine Berechtigung für reale Mitschnitte oder sensitive Daten vorauszusetzen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein Capture-Vertrag definiert Fragestellung, Messpunkte, erlaubte Datenklasse, BPF- beziehungsweise Display-Filter, Snaplen, Zeitbasis, Limits, Verschlüsselungs- und Schlüsselpolicy, Aufbewahrung, Zugriffsrechte, Beweiskette und Löschung.", "rationale": "Ein Paketmitschnitt ist keine neutrale Debug-Ausgabe; Messpunkt, Filter und Verlustgrenzen bestimmen, welche Aussage überhaupt zulässig ist."}, "STAFF-TARGET": {"active": true, "scope": "Teams führen eine wiederholbare Diagnose von DNS-, TCP- und TLS-Symptomen mit Request-ID, Logs, Metriken und zeitlich abgestimmten Capture-Punkten durch; sie unterscheiden Netzverlust, Capture-Verlust, Offload-Artefakt, Proxyeffekt und Anwendungsfehler.", "rationale": "Sie vermeiden den Fehlschluss, ein einzelner Host-Mitschnitt oder ein Wireshark-Flag beweise allein Ursache, Kausalität oder vollständige Payload."}, "CHIEF-TARGET": {"active": true, "scope": "Die Organisation etabliert eine forensisch und datenschutzrechtlich kontrollierte Capture-Fähigkeit: freigegebene Sensoren, Zugriffs- und Freigabewege, Datenminimierung, Schlüssel-/Secret-Grenzen, Aufbewahrung, Incident-Eskalation, Kostenlimits, Audit und Lieferantenanforderungen.", "rationale": "Unkontrollierte PCAPs können Authentisierungsdaten, Geschäfts- und Personendaten enthalten; fehlende Zeit- und Integritätsnachweise können eine Incidententscheidung zudem entwerten."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "eBPF/XDP-, AF_PACKET-, DPDK-, SPAN/TAP-, Cloud-Traffic-Mirroring-, 802.11-, MPLS-, VXLAN-, QUIC-decryption- und forensische Chain-of-Custody-Tiefe ist eine spezialisierte Vertiefung.", "rationale": "Die Zielrollen müssen Beweisgrenzen, Sicherheits- und Betriebsverträge entscheiden; Sensor- und Protokollimplementierung erfolgt mit Netzwerk-, Security- und Forensik-Spezialisten."}}, "lab_validation": [{"lab_id": "KB-0074-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox mit fest eingebetteten synthetischen Ereignissen und ohne Netzwerkzugriff", "evidence": "Die Fallarbeit prüft Zeitachsen, DNS-Fehler, TCP-SYN ohne beobachtetes SYN-ACK, TLS-Alert und Capture-Lücken als konkurrierende Hypothesen.", "limitations": "Nicht ausgeführt; kein Interface wurde enumeriert oder geöffnet und kein Paket, Socket, DNS-, TLS-, Wireshark-, tcpdump-, libpcap-, eBPF-, Container-, Cloud-, Netzwerk- oder Produktionssystem verwendet oder verändert."}]}
---
# Paketmitschnitte mit Wireshark und Tcpdump

> **Ziel:** Ein Paketmitschnitt ist eine begrenzte Messung an einem bestimmten Ort und Zeitpunkt. Formuliere zuerst Hypothese und Beweisgrenze, minimiere dann die Erfassung und verbinde Paketzeitachsen mit Logs, Metriken und Konfiguration. Ein einzelnes Paket oder Expert-Flag ist kein Kausalitätsbeweis.

## Zweck, Definition und Scope

Ein **Paketmitschnitt** zeichnet Pakete oder ausgewählte Bytes an einem Beobachtungspunkt auf. tcpdump ist ein Kommandozeilenwerkzeug zum Erfassen und Ausgeben von Paketen; Wireshark und TShark dekodieren gespeicherte oder live erfasste Daten in Protokollfelder, Zeitachsen und Statistiken. Die Werkzeuge sind Beobachter, keine Quelle der Netzwerkwahrheit: Ein Capture kann selbst verlieren, kürzen, umsortiert ankommen oder durch Messpunkt und Offloads geprägt sein.

Dieses Kapitel vermittelt einen sicheren, evidenzbasierten Ablauf, um DNS-, TCP- und TLS-Symptome einzugrenzen. Es trennt **Capture-Filter** beim Sammeln von **Display-Filtern** bei der Auswertung, erklärt Zeitkorrelation und Reassembly und behandelt den Mitschnitt als besonders schutzbedürftiges Artefakt. Es beschreibt nicht das Umgehen von Verschlüsselung oder das unbefugte Mitschneiden fremder Systeme.

### Lernziele

1. Capture-Frage, Datenklasse, Messpunkte und Abbruchbedingungen präzise formulieren.
2. Capture-Filter, Snaplen, Ringpuffer und Display-Filter nach Beweisbedarf und Datenminimierung unterscheiden.
3. DNS-, TCP- und TLS-Zeitachsen mit Gegenhypothesen auswerten.
4. Capture-Verlust, Zeitsprung, Asymmetrie, Offloads und Reassembly als Aussagegrenzen dokumentieren.
5. Ein Capture-Artefakt mit Zugriff, Retention, Integrität und Incident-Evidenz führen.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Ein Paket ist eine Beobachtung am Sensor, nicht zwingend die vollständige Übertragung und nie automatisch die Ursache. |
| HANDS-ON-TARGET | Eine lokale synthetische Zeitachse begründet und widerlegt Diagnosehypothesen ohne Netzwerkzugriff. |
| ARCHITECT-TARGET | Ein Capture-Vertrag legt Zweck, Messpunkt, minimale Erfassung, Zeitsynchronisation, Datenschutz, Zugriff und Löschung fest. |
| STAFF/PRINCIPAL | Teams korrelieren sichere Mehrpunktmessungen mit Logs, Traces und Metriken und dokumentieren Unsicherheit. |
| CHIEF | Die Capture-Fähigkeit wird als kontrollierte Incident- und Plattformfunktion mit Audit, Kosten- und Lieferantenregeln geführt. |

## Mental Model: Kamera, Messgerät und Beweiskette

Eine PCAP ähnelt einer Kamera an einer Kreuzung. Sie zeigt nur den Bildausschnitt dieser Kamera. Sie zeigt nicht, was vor der Kreuzung, hinter einer anderen Route oder in einem verschlüsselten Umschlag geschah. Eine überlastete Kamera kann Bilder auslassen; eine falsch gehende Uhr kann die Reihenfolge verzerren.

~~~text
Hypothese -> erlaubter Messpunkt und Datenumfang -> dokumentierte Erfassung
          -> Integritäts- und Zugriffssicherung -> Auswertung/Korrelation
          -> Gegenhypothese und zweite Evidenzquelle -> Befund mit Restunsicherheit
~~~

1. **Beobachtung ist lokal.** Ein Paket, das an Sensor A nicht sichtbar ist, kann unterwegs, an Sensor B oder auf einem anderen Pfad existiert haben.
2. **Zeit braucht Herkunft.** Vergleiche Zeitstempel erst, wenn Zeitzone, Uhrquelle, Drift und Messpunkt dokumentiert sind.
3. **Capture-Verlust ist nicht Netzverlust.** Ein voller Ringpuffer oder gekürzte Daten können dieselben Symptome wie ein Netzproblem erzeugen.
4. **Dechiffrierung ändert den Datenwert.** TLS-Session-Secrets oder Klartext können besonders sensible Daten offenlegen; ohne explizite Freigabe ist ihr Gebrauch nicht zulässig.

## Prerequisites und Dependencies

| ID | Art | Warum sie nötig ist |
|---|---|---|
| [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Verständnis und Lab | Hypothesen, Zeitreihen, Messgrenzen und Gegenproben. |
| [KB-0056](08-tcp-verbindungen-und-ueberlastkontrolle.md) | Verständnis und Lab | Handshake, Sequenzen, ACKs, Fenster und Retransmissions. |
| [KB-0058](10-dns-und-namensaufloesung.md) | Verständnis und Lab | DNS-Transaktionen, Resolverketten und negative Antworten. |
| [KB-0067](19-tls-verbindungen-und-zertifikatspruefung.md) | Verständnis und Lab | TLS-Handshake, Zertifikate und Verschlüsselungsgrenze. |
| [KB-0072](24-forward-und-reverse-proxies.md) | Verständnis | Terminierung, Proxy-Hops und die Zuordnung von Client- zu Upstream-Verkehr. |

## Core Concepts und Mechanismen

### Capture-Filter und Display-Filter sind verschiedene Verträge

Ein **Capture-Filter** wird vor oder während der Speicherung eingesetzt. Seine Sprache orientiert sich an libpcap/BPF-Ausdrücken. Er reduziert im Idealfall, welche Daten in das Artefakt gelangen. Ein **Display-Filter** läuft später beim Analysieren eines bereits erfassten Satzes und wählt angezeigte Frames oder Protokollfelder aus. Wiresharks Display-Filter können Protokollfelder vergleichen, auf Existenz prüfen und Ausdrücke kombinieren; sie können die nicht erfassten Pakete nicht zurückholen.

| Frage | Capture-Filter | Display-Filter |
|---|---|---|
| Wann wirkt er? | vor bzw. während Erfassung | nach vorhandener Erfassung |
| Kann er Datenminimierung erzwingen? | ja, wenn Sensor und Konfiguration korrekt arbeiten | nein; unangezeigte Daten bleiben in der PCAP |
| Kann er spätere Hypothesen erweitern? | nein; verworfene Pakete fehlen | ja, innerhalb der gespeicherten Daten |
| Typische Aufgabe | nur Test-Host und TCP/443, begrenztes Zeitfenster | DNS, ein TCP-Stream, ein TLS-Alert, eine Zeitdifferenz |
| Hauptgefahr | zu eng: entscheidende Gegenprobe fehlt | falsche Sicht: Filter verdeckt relevanten Kontext |

Breiter erfassen erhöht Beweisfähigkeit und Privacy-/Kostenrisiko; eng erfassen minimiert Daten, kann aber die Untersuchung unentscheidbar machen. Der Filter gehört deshalb zur Beweiskette.

### Frame, Format, Snaplen und Verlust

Ein gespeichertes Frame enthält eine sensorseitige Reihenfolge, einen Zeitstempel sowie Link-, Netz- und Transportschichtdaten, soweit sie erfasst wurden. Zusatzinformationen hängen vom Format und Sensor ab. Wiresharks Benutzerhandbuch beschreibt pcap als verbreitetes libpcap-Format und pcapng als flexibleren Nachfolger; nicht jedes Format speichert Drop- oder Interface-Metadaten gleich. Formatwahl ist damit ein Forensik- und Interoperabilitätsentscheid, nicht nur eine Endung.

~~~text
capture point -> NIC / virtual switch / TAP / mirror / host socket
   -> timestamp + link metadata + captured bytes
      -> pcap or pcapng file -> parser/dissector
          -> protocol fields, conversation, stream, expert hint
~~~

Die Dissektion ist eine plausible Interpretation aus Port, Payload, heuristischen Regeln und verfügbaren Schlüsseln. Unknown, malformed, ein nicht erkannter Dienst oder ein fehlgeschlagener Reassembly-Versuch kann auf fehlerhaften Verkehr hinweisen, aber ebenso auf Trunkierung, Start mitten im Flow, fehlende Pakete, falsches Decode As, Versionunterschied oder ein unpassendes Dissector-Profil.

Snaplen begrenzt die gespeicherten Bytes pro Frame. Der Header kann dann noch analysierbar sein, aber Nutzlast, DNS-Record, TLS-Handshakedaten oder ein segmentiertes Protokoll fehlen. Sampling verringert Datenmenge, zerstört jedoch Aussagen über einzelne verlorene oder seltene Pakete. Ringdateien begrenzen Speicher, überschreiben aber historische Evidenz, wenn Export oder Freeze nicht rechtzeitig erfolgt.

| Mechanismus | Vorteil | Aussagegrenze |
|---|---|---|
| voller Frame | beste Dekodier-/Reassemblychance | maximales Daten- und Geheimnisrisiko |
| begrenzter Snaplen | reduziert Inhalt und Speicher | Protokoll/Payload kann nicht rekonstruierbar sein |
| BPF-Capture-Filter | minimiert früh | fehlende Gegenhypothesen sind nicht mehr prüfbar |
| Display-Filter | flexible Analyse | schützt gespeicherte Daten nicht |
| Sampling | niedrigeres Volumen | keine Vollständigkeitsbehauptung |
| Ringpuffer | begrenzter Speicher | ältere Ereignisse können überschrieben sein |

Erfasse Capture-Statistik, Dropzähler, Snaplen, Interface/Linktype, Host/Zone, Filter, Start/Ende, Dateihash und verantwortliche Person. Fehlt einer dieser Werte, darf der Bericht keine Vollständigkeit behaupten.


### Zeitachsen und Korrelation

Eine Antwortzeit lässt sich nur definieren, wenn Start- und Endereignis semantisch feststehen:

~~~text
DNS latency       = observed DNS response timestamp - observed DNS query timestamp
TCP handshake RTT = observed final handshake step - observed initial SYN
TLS handshake     = observed handshake completion - observed ClientHello
application time  = observed response boundary - observed request boundary
~~~

Diese Größen gelten am jeweiligen Capture-Punkt und nur, falls die zugehörigen Ereignisse vorhanden, korrekt korreliert und durch denselben Sensor zeitlich vergleichbar sind. Für zwei Sensoren ist eine scheinbare negative Dauer häufig ein Uhr- oder Zuordnungsproblem, nicht Zeitreise im Netzwerk.

Korrelationsschlüssel in einer mehrschichtigen Anfrage sind:

- Zeitpunkt plus 5-Tupel: Quelle, Ziel, Quellport, Zielport und Transport;
- DNS-Transaktions-ID, mit Vorsicht bei Wiederverwendung und Parallelität;
- TCP-Sequenz-/ACK-Raum für einen vollständig beobachteten Flow;
- TLS-Verbindungs- und Handshake-Kontext, soweit sichtbar;
- sichere Request-/Trace-ID aus Anwendung oder Proxy, sofern Headertrust und Datenschutz geklärt sind.

Eine ID im Log und ein Paket mit ähnlicher Zeit sind keine ausreichende Zuordnung, wenn NAT, Proxyterminierung, Connection Pooling oder HTTP/2-Multiplexing die Beziehung verändern. KB-0069 und KB-0072 behandeln diese Grenzen.

### Reassembly und Offload-Artefakte

TCP ist ein Byte-Stream; HTTP und TLS können über mehrere Segmente verteilt sein. Wireshark kann, je nach Dissector-Einstellung, einen zusammenhängenden TCP-Stream an höhere Protokolle übergeben. Die offizielle Dokumentation weist darauf hin, dass fehlende Segmente, Start mitten im Flow oder andere Reassembly-Einstellungen eine höhere Schicht falsch oder nur teilweise dekodieren können. Reassembly vereinfacht Diagnose, ersetzt aber nicht die Prüfung einzelner Frames und der Capture-Grenze.

Bei QUIC/HTTP/3 sind viele Nutzdaten verschlüsselt und der Transport hat andere Wiederherstellungs- und Migrationsmechanismen als TCP. Ein TCP-Filter oder eine TCP-Reassembly-Erwartung ist dafür keine valide Methode. Siehe KB-0070 und KB-0071.

Ein Capture nahe am Host kann zudem von Checksum-Offload, GRO/GSO/TSO, NIC- und Virtualisierungsverhalten beeinflusst sein. Eine scheinbar ungültige Checksum oder ungewöhnliche Segmentgröße kann ein lokales Beobachtungsartefakt sein.

~~~text
H1: Paket war auf dem Draht fehlerhaft.
H2: Host-Sensor sah Daten vor oder nach NIC-Offload.
H3: Capture oder Dissector interpretierte eine gekürzte virtuelle Darstellung.

Gegenprobe: autorisierten unabhängigen Messpunkt, Host/NIC-/virtual-switch
Kontext und Capture-Statistik vergleichen.
~~~

Die Gegenprobe ist nicht Offload abschalten. Änderungen an produktiven Host- oder Netzparametern sind ein eigener genehmigter Change mit Performance- und Sicherheitsfolgen.

## Architecture und Data Flow: Ein begrenzter Diagnosefall

Angenommen, ein B2B-API-Client meldet periodisch TLS timeouts. Das Team darf für ein enges Incidentfenster nur Metadaten und Header bis zum vereinbarten Snaplen an zwei bereits freigegebenen Messpunkten sammeln: am Client-Node und am Reverse Proxy. Die Anwendung liefert Trace-ID, Zeitbasis, Zielauthority und Fehlerklasse ohne Auth-Header oder Nutzlast.

~~~text
client process --A--> client capture point --network--> edge/proxy capture point --B--> TLS terminator
     |                    |                                  |                          |
     | trace/log          | timestamp, filter, drops           | timestamp, filter, drops| upstream log
     +--------------------+------------- evidence ledger ------+--------------------------+

Question: Did DNS resolve? Did a TCP handshake complete? Was a TLS alert observed?
Boundary: Neither capture proves packets outside its view or decrypts application data.
~~~

1. **Vorher:** Incident-Owner formuliert Hypothese, Datenklasse, zulässige Filter, Retention, Maximaldauer, Messpunkte und Stopbedingung.
2. **Erfassung:** Sensoren dokumentieren monotone/UTC-Zeitbasis, Filter, Snaplen, Interface und Drops. Die PCAP erhält eine Artefakt-ID und Hash.
3. **Korrelation:** Logs und Metriken sind unabhängige Evidenz. Ein Logfehler ohne Paket beweist weder Netzwerk- noch TLS-Ursache.
4. **Auswertung:** DNS, TCP und TLS werden in dieser Reihenfolge geprüft. Eine fehlende Antwort wird gegen Capture-Loss, asymmetrische Route, NAT/Proxy und Zeitfenster getestet.
5. **Befund:** Der Bericht trennt Beobachtung, Interpretation, Gegenbeweis und offene Grenzen. Er sagt am Client-Sensor kein SYN-ACK im Fenster beobachtet, nicht das Netzwerk habe das SYN-ACK verloren.
6. **Abschluss:** Artefakt wird gemäß Retention gelöscht oder an Security Incident Response mit vollständiger Chain of Custody übergeben.

## Protocols, Standards und Tools

### Normative und produktbezogene Quellen

| Gegenstand | Verbindlichkeit | Warum hier relevant |
|---|---|---|
| TCP, DNS, TLS | Protokollnormen, kanonisch in KB-0056/0058/0067 | Definieren erwartbare Schritte und Fehlersignale. |
| libpcap/BPF-Filter | Implementierungs-/Toolkonvention | Beschreibt die Sprache eines Capture-Filters, keine Display-Filter-Sprache. |
| Wireshark Display Filters | Wireshark-Produktdokumentation | Definiert Feld-, Vergleichs-, Existenz- und Ausdruckssemantik der Anzeige. |
| Wireshark User’s Guide | Wireshark-Produktdokumentation | Beschreibt Capture-Formate, Limits, TCP-Analyse und Reassembly. |
| tcpdump | Produkt-/Systemwerkzeug | Erfasst und zeigt Pakete; Optionen, Rechte und Plattformverhalten müssen vor Nutzung lokal geprüft werden. |

Versionen, Defaultwerte, verfügbare Dissectoren, Rechte, Interface-Namen und Offload-Verhalten sind zeit- und umgebungsabhängig. Die im Quellenabschnitt verlinkten Dokumente wurden am **2026-09-16** geprüft; sie ersetzen weder die installierte Version noch eine lokale Sicherheitsrichtlinie.

### Wireshark, TShark und tcpdump nach Aufgabe wählen

| Werkzeug | Geeignet für | Stärken | Grenze / Kontrollpunkt |
|---|---|---|---|
| tcpdump | schlanke, zeitlich begrenzte Erfassung oder Textansicht | verbreitete BPF-Filter, Dateiablage | Rechte, Output, Snaplen, Ring-/Drop-Policy und lokale Optionsemantik vorher prüfen |
| Wireshark | interaktive Dissektion, Gespräche, Zeitachse, Follow Stream | reiche Feldansicht, Filter, Expert-Hinweise, Reassembly | GUI-Komfort kann Rohdaten, Zeitbasis und Sensitivität verdecken |
| TShark | reproduzierbare, nichtinteraktive Auswertung autorisierter PCAPs | Filter/Extraktion automatisierbar | Ergebnis-Schema und Toolversion pinnen; Output kann sensitive Felder enthalten |
| Sensor/TAP/SPAN/Mirror | unabhängiger Messpunkt | kann Hostartefakte entkräften | Sichtbarkeit, Oversubscription, ACL, Verschlüsselung und Ownership prüfen |

Produktname bedeutet keine Interoperabilitätsgarantie. pcap/pcapng, Linktype, Namensauflösung, Dissector-Einstellungen und Dateikompression werden in der Fallakte festgehalten.

### Filterbeispiele als Semantik, nicht als Freigabe

Die folgenden Ausdrücke sind nur Beispiele für eine **vorher genehmigte** Untersuchung. Sie sollen keine reale Erfassung auslösen.

~~~text
Capture-Filter, BPF-artig:
host 192.0.2.10 and tcp port 443
udp port 53 and host 192.0.2.53

Wireshark Display-Filter:
dns.flags.rcode != 0
tcp.flags.syn == 1 and tcp.flags.ack == 0
tcp.analysis.retransmission
tls.alert_message
ip.addr == 192.0.2.10 and tcp.port == 443
~~~

tcp.analysis.retransmission ist ein Wireshark-Analysehinweis, nicht eine Aussage, dass das Netz einen Frame verloren hat. Der Dissector muss den nötigen Kontext gesehen haben; Capture-Verlust, Reihenfolge, Startzeit und Sensorort können die Einordnung beeinflussen. Auch Filterfelder können sich zwischen Toolversionen ändern. Filter zuerst gegen eine nicht-sensitive Test-PCAP und die installierte Referenz prüfen.

## Konfiguration und Implementierung: Capture-Vertrag vor Kommando

### Minimaler Capture-Vertrag

| Feld | Beispielhafte Entscheidung | Prüfnachweis |
|---|---|---|
| Incidentfrage | Warum sieht Clientgruppe X zwischen 10:00–10:10 UTC TLS timeouts? | Ticket mit Hypothese und erwarteten Ereignissen |
| Scope | eigener Test-/Incident-Host, definierter Zielhost, Port | Freigabe und Asset-/Tenant-Grenze |
| Datenminimierung | Filter, minimaler Snaplen, keine Klartext-/Secret-Extraktion | versionierter Filter und Review |
| Messpunkte | Client und terminierender Proxy, nicht irgendwo im Netz | Topologie und Owner |
| Zeitbasis | UTC, NTP/PTP-Status oder dokumentierte Unsicherheit | Status/Offset zum Start |
| Volumen | Maximaldauer, Maximaldatei, Ring-/Freeze-Policy | Kapazitätsrechnung und Alarm |
| Zugriff | benannte Incidentrollen, verschlüsselter Speicher, Audit | IAM-/Ticket-Nachweis |
| Retention | kurze Standardretention; Ausnahme nur mit Owner/Rechtsgrund | Löschzeitpunkt und Exception |
| Integrität | Artefakt-ID, SHA-256, unverändertes Original, Analyse-Kopie | Ledger-Eintrag |
| Abschluss | Befund, Grenzen, Löschung oder Security-Übergabe | Review und Cleanup-Bestätigung |

### Autorisierte lokale Erfassung: Form statt blindem Rezept

Für eine **eigene isolierte Testumgebung** könnte ein freigegebener Runbook-Schritt konzeptionell diese Felder tragen:

~~~text
tool: tcpdump
interface: <approved-test-interface>
capture filter: <reviewed BPF expression>
snaplen: <approved byte limit>
duration or packet cap: <bounded value>
output: <encrypted, access-controlled incident path>
metadata: UTC start/end, tool version, interface/linktype, filter, drops, hash
cleanup: stop, hash, restrict access, retain/delete according to ticket
~~~

Das ist bewusst kein Kommando zum Kopieren: Interface, Rechte, Dateisystem, lokale tcpdump-Version, DLP-/Privacy-Anforderungen und Speicherziel unterscheiden sich. Ein Kommando, das ohne diese Angaben Traffic mitschneidet, wäre fachlich unvollständig und organisatorisch unzulässig.

### Sichere Analysekonfiguration

1. Arbeite auf einer Analyse-Kopie; das Original bleibt unverändert und gehasht.
2. Deaktiviere spontane Namensauflösung, wenn sie weitere Netzaktivität, Datenaustritt oder Zeitverzerrung auslösen könnte; dokumentiere die Einstellung.
3. Lege Zeitzone und Zeitanzeige fest; verwende für einen Vergleich denselben Bezug.
4. Notiere Wireshark-/TShark-Version, Profil und Reassembly-Einstellungen.
5. Verwende Session-Secrets oder private Schlüssel nur, wenn sie ausdrücklich freigegeben, minimal zugänglich und wie Geheimnisse geschützt sind. Für TLS 1.3 ist ein Serverprivatekey in der Regel kein allgemeines Dechiffrierverfahren; die fachliche TLS-Grenze steht in KB-0067.
6. Exportiere keine Follow-Stream- oder Objektdateien, bevor Datenklasse und Freigabe geprüft sind.


## Scalability und Performance

### Lastmodell des Sensors

Die erforderliche Schreibkapazität ist grob:

~~~text
V_raw = frame_rate_per_second * captured_bytes_per_frame
        * duration_seconds * number_of_capture_points
~~~

V_raw ist nur die gespeicherte Frame-Nutzlast. Containerformat, Metadaten, Dateisystem, Verschlüsselung, Indizes, Replikate und Sicherheitskopien kommen hinzu. Beispielannahme: 1.000 Frames/s, 800 gespeicherte Bytes/Frame, 1.800 s und vier Messpunkte ergeben etwa 5,76 GB Rohdaten. Das ist keine Kapazitätszusage; Burst, Snaplen, Linkrate und tatsächliche Paketgröße können die Zahl stark verändern.

| Engpass | Symptom | Messung | Schutz |
|---|---|---|---|
| Capture-CPU / Kernelbuffer | Sensor-Drops | Erfassungsstatistik, CPU, Dropcounter | enger geprüfter Filter, zeitlich begrenzt, geeigneter Sensor |
| Disk / Verschlüsselung | Schreibstau, Ringüberschreibung | Schreiblatenz, Restkapazität, File-Rotation | Kapazitätsreserve, Obergrenzen, Alarm, gesicherter Speicher |
| Analysearbeitsspeicher | langsame Reassembly/GUI | Dateigröße, RAM, Verarbeitungslatenz | Teilfenster, bewusste Reassembly, nicht-sensitive Extrakte |
| Mirror/TAP | blinde Flecken / Oversubscription | Port-/Sensorzähler | Sichtbarkeitsvertrag und unabhängige Messung |
| Menschenprozess | zu große, unzugängliche Artefakte | Durchlaufzeit, Freigabezeiten | vorgeprüfte Runbooks, Rollen, Retention-Automation |

Hohe Paketzahl verlangt eine präzisere Sensorarchitektur, nicht nur ein größeres PCAP-Volume. Wenn der Sensor selbst verliert, ist die zentrale Diagnosefrage möglicherweise unbeantwortbar. In diesem Fall werden Zeitfenster, Filter, Messpunkt oder eine andere Evidenzquelle geändert; aus unvollständiger Erfassung wird kein no packet observed therefore no packet sent.

### Reassembly und Analyseleistung

Reassembly kann Speicher und CPU kosten. Wireshark dokumentiert, dass das Abschalten von TCP-Reassembly die Verarbeitung reduzieren kann, höhere Protokolle dann aber falsch oder unvollständig dargestellt werden können. Entscheide je Fragestellung:

- Für Sequenz-, SYN/ACK- und Fensteranalyse: einzelne Frames, Stream-Statistik und Capture-Vollständigkeit können wichtiger sein.
- Für HTTP-/TLS-PDU-Grenzen: Reassembly kann nötig sein; prüfe fehlende und out-of-order Segmente.
- Für große Produktionsartefakte: eine begrenzte, autorisierte Extraktion plus reproduzierbares Filterprotokoll ist besser als unkontrolliertes Öffnen der Gesamtdaten.

## Reliability und Failure Modes

| Fehlerbild | Beobachtung | konkurrierende Erklärung | Gegenprobe / Recovery |
|---|---|---|---|
| DNS-Query ohne sichtbare Antwort | Query am Sensor, Timeout im Log | Antwort auf anderem Pfad, Capture startete zu spät, Drop, Resolver antwortete nicht | Resolverlog, zweiter Messpunkt, Sensor-Drops, Zeitfenster prüfen |
| SYN ohne sichtbares SYN-ACK | TCP-Start sichtbar | Netz-/ACL-/Route, Server nicht erreichbar, asymmetrischer Rückweg, Client-Sensor-Lücke | Server/edge Messpunkt, Firewall-Flowlog, Connection-Backlog/Logs, keine pauschale Netzschuld |
| Retransmission-Hinweis | Wireshark markiert Frame | echter Verlust, ACK-Verzögerung, Capture-Drop, Out-of-order | ACK-Zeitachse, Sensorstatistik, anderer Messpunkt, Kontext der gesamten Connection |
| TLS-Alert | Alert sichtbar | Zertifikat/Version/SNI/Policy, Proxyterminierung, Anwendungsfehler | Alert-Richtung/Code, Server-/Proxylog, Zertifikats- und Authority-Vertrag, KB-0067 |
| Malformed | Dissector kann Feld nicht deuten | reale Protokollverletzung, Trunkierung, Version/Port falsch, Reassembly-Lücke | Frame-Länge/Snaplen, Startposition, Decode-As/Version, Rohdaten nur freigegeben prüfen |
| negative Dauer zwischen Sensoren | Antwort vor Anfrage | Uhrdrift, Zeitzone, falsche Korrelation | UTC/Offset nachweisen, nur gleiche Sensorbasis rechnen |
| fehlende Payload / Stream | Header sichtbar, Inhalt fehlt | Snaplen, Encryption, Capture-Loss, Flow start midstream | Capture-Plan und TLS-Grenze prüfen; nicht mit kein Inhalt gleichsetzen |
| Disk voll / Ring überschrieben | Datei endet oder frühe Daten fehlen | ungeplantes Volumen, fehlender Alarm | Capture stoppen, Evidenzgrenze melden, Kapazität und Retention reparieren |

### Retries und Diagnose beeinflussen sich gegenseitig

Ein Client-Retry kann neue Verbindungen, andere DNS-Antworten oder andere Backendziele erzeugen. Ein später sichtbarer Erfolg beweist nicht, dass der erste Versuch durch denselben Pfad ging. Für jede Analyse werden Attempt-ID, Retry-Policy, Backoff, Deadline, Idempotenz und Proxy-/Load-Balancer-Hops erfasst. Aktive Tests dürfen keinen Incident durch zusätzliche ungebremste Retries verschärfen.

## Security, Governance und Compliance

### Schutzgüter und Missbrauchsmodell

PCAPs können IP-/MAC-Adressen, DNS-Namen, Hostnamen, Session-Metadaten, Cookies, Tokens, personenbezogene Daten, Geschäftsprozesse oder bei Klartextprotokollen volle Inhalte enthalten. TLS-Session-Secrets, private Schlüssel und exportierte Streams sind besonders kritisch. Mögliche Missbrauchsakteure sind privilegierte Insider, kompromittierte Analyse-Accounts, fehlgeleitete Tickets, zu breit geteilte Dateien und unkontrollierte Tool-Exports.

| Kontrolle | Zweck | überprüfbarer Nachweis |
|---|---|---|
| Zweckbindung / Incident-ID | verhindert sammeln, falls es nützt | verknüpftes Ticket und Hypothese |
| Datenminimierung | reduziert Umfang und Exposition | Filter, Snaplen, Zeit-/Volumenlimit |
| Least Privilege | begrenzt Capture und Leserechte | getrennte Rollen, kurzlebiger Zugriff, Audit |
| Verschlüsselter Speicher | schützt ruhende Artefakte | Schlüsselowner, Zugriffskontrolle, Auditlog |
| Secret-Grenze | verhindert unkontrollierte Dechiffrierung | explizite Freigabe, getrennte Ablage, Rotation-/Löschplan |
| Integrität | trennt Original von Analyse | Hash, schreibgeschützte Originalablage, Artefakt-ID |
| Retention/Löschung | begrenzt Datenlebensdauer | Policy, Löschjob, Ausnahme mit Ablaufdatum |
| Incident-Übergabe | wahrt forensische Beweiskette | Security-Owner und Custody-Protokoll |

Datenschutz- und Compliance-Anforderungen hängen von Datenklasse, Region, Rolle, Vertrag und Rechtsgrund ab. Eine technische Maskierung oder ein enger Filter garantiert keine Rechtskonformität. Security Incident Response und Beweissicherung sind in KB-0562 kanonisch vertieft.

### Netzwerkzugriffe des Analysewerkzeugs

Namensauflösung, automatische Updateprüfung, externe Geo-/OUI-Datenbanken oder Cloud-Synchronisation können bei Analyse zusätzliche Datenflüsse verursachen. Entscheide und dokumentiere diese Einstellungen. Ein air-gapped oder kontrolliertes Analyseprofil kann bei sensitiven Artefakten erforderlich sein. Offline geöffnet ist nur glaubhaft, wenn Tool-, DNS-, Proxy- und Speicherpfad kontrolliert wurden.

## Observability und Troubleshooting

### Mindesttelemetrie neben der PCAP

| Ebene | Beobachtung | Leitfrage |
|---|---|---|
| Sensor | Drops, Snaplen, Filter, Interface, Linktype, Start/Ende, Zeitoffset | Ist die Messung aussagekräftig? |
| DNS | Query-/Response-Zählung, RCODE, Resolverlog, Cachepfad | Wurde Name korrekt und rechtzeitig aufgelöst? |
| TCP | SYN/SYN-ACK/ACK, Reset, FIN, Retransmission-Hinweise, RTT/Window | Scheitert Aufbau, Transport oder Anwendung? |
| TLS | Handshakephase, Alert-Richtung, SNI/ALPN nur falls sichtbar/freigegeben, Zertifikats-/Proxylog | Wo endet die Sicherheitsverhandlung? |
| Proxy / LB | Downstream-/upstream timings, selected target, connection reuse, retry, drain | Hat ein Hop den Endpunkt oder Zeitrahmen verändert? |
| Anwendung | Trace-/Attempt-ID, Deadline, Fehlerklasse, idempotente Operation | Welche Geschäftsoperation und welcher Versuch sind gemeint? |

### Diagnosebaum für DNS, TCP und TLS

~~~text
1. Ist die Capture-Qualität dokumentiert und ohne relevante Sensor-Drops?
   nein -> nur begrenzten Befund berichten; Messung verbessern.
   ja
2. Passt Zeitfenster plus Identity zum Incident?
   nein -> Zuordnung korrigieren.
   ja
3. DNS sichtbar?
   nein -> Cache, anderer Resolver, Filter, Prozessname/DoH/DoT-Grenze prüfen.
   ja -> Query/Response/RCODE am gleichen Sensor prüfen.
4. TCP-Aufbau sichtbar?
   nein -> Route, NAT, Proxy, anderer Connection-Pool, Filter und Messpunkt prüfen.
   ja -> Handshake/Reset/Timeout samt Gegenpunkt auswerten.
5. TLS-Handshake sichtbar?
   nein -> Terminierung, Verschlüsselungsgrenze, bestehende Connection oder Filter prüfen.
   ja -> Richtung, Alert, Zertifikats-/Policylog und Auswirkung des Proxys korrelieren.
6. Reicht Evidenz für Ursache?
   nein -> Befund als Hypothese mit nächstem autorisierten Messschritt formulieren.
~~~

### Beispiel: Aussage mit angemessener Sicherheit

Schlecht: Der Server hat den Client geblockt.

Belastbarer: Am Client-Sensor wurde im dokumentierten Zeitfenster für Attempt A ein SYN zu Ziel Z beobachtet, jedoch kein SYN-ACK. Der Sensor meldete keine erkennbaren lokalen Drops. Der terminierende Proxy sah für denselben bestätigten Attempt keine Downstream-Connection. Die Daten stützen die Hypothese eines Fehlers vor dem Proxy, schließen asymmetrisches Routing oder eine nicht beobachtete NAT-/Firewall-Entscheidung aber nicht aus. Als nächste Gegenprobe wird der autorisierte Edge-Flowlog-Abgleich vorgeschlagen.


## Cost und FinOps

Paketdiagnose kostet nicht nur Speicher. Kostentreiber sind Erfassungsinfrastruktur, Mirror-/Sensortraffic, CPU, verschlüsselter Speicher, Replikation, Analysezeit, Security-Freigabe, Rechtsprüfung und Retention. Ordne Kosten nicht einem Toolnamen, sondern Incident, Dienst, Umgebung, Team und Datenklasse zu.

| Entscheidungsvariable | Kosteneffekt | Steuerung |
|---|---|---|
| breiter Filter / voller Snaplen | mehr Speicher, Risiko, Analysezeit | klare Hypothese, minimale zulässige Sicht |
| lange Dauer / viele Messpunkte | lineare bis burstige Volumenzunahme | Zeit-/Dateigrenze, gestaffelte Diagnose |
| sehr hoher Linkrate-Sensor | hohe Infrastruktur-/Operationskosten | vorgeprüfte zentrale Sensorfähigkeit statt Ad-hoc-Beschaffung |
| lange Retention / Kopien | Speicher- und Auditkosten, höhere Exposition | automatische Löschung, eng begründete Legal Holds |
| Decryption / Export | Review- und Secret-Handlingkosten | Ausnahmeprozess, getrennte Ablage, minimale Personenzahl |

Ein FinOps-Review fragt: Welcher Entscheid wird mit dem Capture ermöglicht? Reicht Metrik/Log/Flowlog? Welches Maximalvolumen ist akzeptabel? Wer trägt Kosten und Datenrisiko? Ein großer Mitschnitt ohne Hypothese ist weder eine günstige noch eine sichere Vorsorge.

## Trade-offs, Alternativen und Anti-Patterns

| Entscheidung | Sinnvoll wenn | Kosten / Risiko | Alternative |
|---|---|---|---|
| Host-Capture | Prozess-/Socketnähe entscheidend ist | Offload-/Namespace-/Hostbias | Edge-/TAP-/Mirror-Messpunkt, Logs, eBPF durch Spezialisten |
| Netzwerk-Mirror/TAP | Drahtsicht und unabhängiger Punkt nötig sind | Sichtbarkeitslücken, Oversubscription, Datenexposition | gezieltes Mehrpunkt-Capture, Flowlogs |
| volle Payload | ausdrücklich freigegebene Protokollforensik nötig ist | höchste Privacy-/Secret-Gefahr | Header-/Metadaten-Capture, App-/Proxylogs |
| PCAPNG | Interface-/Metadaten und moderne Toolkette benötigt werden | Nicht jede Drittsoftware unterstützt alle Details | pcap mit dokumentiertem Verlust an Metadaten |
| Reassembly an | Anwendungspayload-Grenzen nötig sind | Speicher/CPU, Fehlinterpretation bei Lücken | Frame-/Sequenzanalyse |
| zentrale Sensorplattform | wiederkehrende Hochrisiko-Incidents | Governance-/Betriebsaufwand | standardisierte Runbooks und zeitlich begrenzte Fallfreigaben |

**Anti-Patterns**

- Ein Display-Filter schützt die Daten. Er schützt nur die Ansicht; die PCAP enthält weiterhin alles Erfasste.
- Keine Antwort im PCAP bedeutet Netzverlust. Ohne Sensor-Drops, Messpunkt- und Routing-Gegenprobe ist das nur eine Beobachtung.
- Checksum bad bedeutet kaputtes Paket. Bei Host-Captures kann Offload die Anzeige prägen.
- Follow Stream darf man teilen, weil das Problem gelöst ist. Der Export kann Inhalte oder Secrets enthalten und braucht eine neue Datenfreigabe.
- Mehr Capture ist immer besser. Es erhöht Kosten, Exposition und Analyseunsicherheit ohne bessere Hypothese.
- Wireshark Expert Info ist die Ursache. Es ist ein Werkzeughinweis, der mit Rohframes und unabhängiger Evidenz geprüft wird.
- Zeitstempel verschiedener Hosts sind direkt vergleichbar. Ohne Uhr- und Offsetnachweis ist das unsicher.

## Staff-, Principal- und Chief-Entscheidungen

### Entscheidungsprotokoll

| Ebene | Entscheidung | Optionen | Evidenz / Owner | Neubewertung |
|---|---|---|---|---|
| Architect | Capture-Punkt und minimale Datenklasse für einen TLS-Incident | Client, Proxy, Edge, zwei Punkte; Metadaten versus Payload | Topologie, Threat Model, Incident Owner plus Security | neue Terminierung, NAT, Datenklasse oder Route |
| Staff | Standard für zeitlich begrenzte Mehrpunktdiagnose | individuelles Shell-Wissen versus getestetem Runbook | Drop-/Zeit-/Filtermetadaten, SRE plus Platform | wiederholte Fehlbefunde, neue Tool-/OS-Version |
| Principal | Gemeinsame Evidence-Pipeline für Produkte | lokale Ablage versus kontrollierter Artefaktservice | Retention, IAM, Hash, Kosten, Security/SRE | Auditbefund, Incidentklasse, Skalierungswechsel |
| Chief | Organisationsweite Capture-Governance | deaktiviert, Ausnahmeprozess, dauerhafte Sensorplattform | Risikoportfolio, regulatorischer Geltungsbereich, CapEx/OpEx, Lieferantenvertrag | neues Geschäftsgebiet, Datenklasse, Rechtslage, Sicherheitsincident |

Ein Principal macht die Diagnose nicht nur technisch korrekt, sondern wiederholbar: gleiche Artefaktfelder, sichere Rollen, klare Qualitätssignale, Trainingsfall und Rückkopplung in SLOs, Proxypolicy oder Netzarchitektur. Ein Chief entscheidet explizit, für welche Dienste hohe Sichtbarkeit und Betriebslast gerechtfertigt sind und wann Flowlogs, Traces oder Anwendungsmetriken das bessere Standardinstrument sind.

## Production Checklist

| Prüfkriterium | Nachweis | Owner | Abbruch-/Rollbackbedingung |
|---|---|---|---|
| Hypothese, Scope, Datenklasse und Incident-ID fest | freigegebenes Ticket | Incident Commander | unklare Rechtsgrundlage oder unbestimmter Scope |
| Messpunkt und Topologie stimmen | Diagramm, Asset-/Tenant-Grenze | Network/Platform | Sensor sieht nicht den fraglichen Hop |
| Filter, Snaplen, Dauer und Volume geprüft | versionierter Capture-Plan, Kapazitätsrechnung | SRE/Platform | Volumen-/Privacy-Grenze überschritten |
| Zeitbasis und Unsicherheit dokumentiert | UTC/NTP/PTP-/Offsetstatus | SRE | Vergleich mehrerer Zeitquellen ohne Nachweis |
| Zugang und Speicher geschützt | IAM, Verschlüsselung, Audit | Security | keine least-privilege Ablage |
| Sensorqualität sichtbar | Dropcounter, Interface-/Linktype-Metadaten | Operator | relevante Drops oder defekte Speicherung |
| Tool-/Analyseprofil reproduzierbar | Version, Filter, Reassembly-/Resolution-Optionen | Analyst | automatische Datenflüsse oder unbekanntes Profil |
| TLS-/Secret-Grenze geklärt | explizite Freigabe oder keine Dechiffrierung | Security / Data Owner | Schlüssel-/Session-Secret ohne Freigabe |
| Korrelation mit Logs/Metriken geplant | Attempt-/Trace-/Zeitvertrag | Service Owner | keine robuste Identitätszuordnung |
| Abschluss und Retention geregelt | Hash, Befund, Lösch-/Übergabeprotokoll | Evidence Owner | Artefakt unauffindbar, ungeschützt oder über Retention |

## Interviewfragen mit Antwortleitfäden

### 1. Worin unterscheiden sich Capture- und Display-Filter?

**Antwortleitfaden:** Capture-Filter begrenzen, was überhaupt erfasst wird; Display-Filter wählen innerhalb vorhandener Daten. Die Antwort nennt Datenminimierung, nicht rückholbare Gegenhypothesen und unterschiedliche Syntax/Toolsemantik. Eine Fehlannahme ist, ein Display-Filter verringere die Sensitivität der gespeicherten PCAP.

### 2. Wie würdest du SYN ohne SYN-ACK berichten?

**Antwortleitfaden:** Als Beobachtung an einem Sensor mit Zeitfenster, 5-Tupel, Capture-Qualität und korrelierten Gegenpunkten. Mögliche Ursachen sind Route, Policy, Zielverfügbarkeit, asymmetrischer Rückweg oder Sensorlücke. Nicht behaupten, der Server oder das Netzwerk habe bewiesenermaßen verworfen.

### 3. Weshalb kann ein Wireshark-Retransmission-Hinweis falsch eingeordnet werden?

**Antwortleitfaden:** Der Hinweis beruht auf der gesehenen Sequenz-/ACK-Folge. Fehlende/umgeordnete Captures, Start mitten im Flow, Offloads und ein falscher Messpunkt ändern den Kontext. Gegenprobe: Sensor-Drops, ACK-Zeitachse, Endpunktlogs und bei Bedarf ein zweiter autorisierter Messpunkt.

### 4. Wann ist TCP-Reassembly nützlich und wann gefährlich?

**Antwortleitfaden:** Nützlich für PDUs über Segmente, etwa HTTP oder TLS. Gefährlich bei Trunkierung, verlorenen/out-of-order Frames oder anderer Preference, weil höhere Dissektion unvollständig oder irreführend wird. Rohframe- und Reassemblysicht gehören zusammen.

### 5. Darf ein Incident-Team TLS entschlüsseln, wenn es technisch möglich ist?

**Antwortleitfaden:** Nur nach expliziter Zweck-, Daten- und Zugriffsfreigabe. Session-Secrets und Klartext erhöhen Exposure und benötigen Schutz, Audit und Löschung. Technische Fähigkeit ersetzt weder Berechtigung noch sichere Beweiskette.

### 6. Wie dimensionierst du eine Capture-Aktion?

**Antwortleitfaden:** Frage nach Frame-Rate, gespeicherten Bytes, Dauer, Messpunkten, Burst, Container-/Replikationsaufwand und Retention. Rechne ein transparentes Oberlimit, instrumentiere Drops und beende bei einer Sicherheits-/Kapazitätsgrenze.

### 7. Warum kann ein Host-Capture eine ungültige TCP-Checksum zeigen, obwohl der Draht korrekt ist?

**Antwortleitfaden:** Checksum-/Segmentation-Offloads und virtuelle Datenpfade können die Beobachtung vor NIC-Fertigstellung zeigen. Die Antwort fordert unabhängigen Messpunkt und Systemkontext, nicht reflexhaftes Abschalten von Offloads.

### 8. Wie verbindet man eine PCAP mit einem HTTP/2-/Proxy-Incident?

**Antwortleitfaden:** Durch bestätigte Zeit-, Verbindungs- und Trace-/Attempt-Korrelation, wobei ein Downstream-Flow vom Upstream-Pool verschieden sein kann. Connection Pooling und Multiplexing verhindern eine naive Eins-zu-eins-Zuordnung. KB-0069 und KB-0072 sind die kanonischen Vertiefungen.

## Praktische Labs und Fallarbeit

### KB-0074-LAB-01: Synthetische Beweiskette ohne Netzwerk

**Status:** reviewed_only. Dieses Lab wurde nicht ausgeführt. Es verwendet ausschließlich erfundene Ereignisse im Quelltext und öffnet weder Interface noch Socket.

**Ziel:** Unterscheide eine beobachtete TCP-Lücke von einer bewiesenen Netzursache und korreliere sie mit DNS-/TLS-Ereignissen.

**Aufbau und Annahmen:**

- Hostnamen, IP-Adressen und Zeitstempel sind Testwerte und keine echten Assets.
- Die Ereignisse stehen für Beobachtungen eines hypothetischen Client-Sensors.
- Ein capture_gap ist absichtlich eingebaut und widerlegt eine Vollständigkeitsbehauptung.

~~~python
# Python 3, rein lokale Datenverarbeitung, keine Imports mit Netzwerkzugriff.
events = [
    ("10:00:00.000", "dns_query", {"name": "api.test.invalid", "id": 41}),
    ("10:00:00.021", "dns_response", {"name": "api.test.invalid", "id": 41, "rcode": "NOERROR"}),
    ("10:00:00.030", "tcp_syn", {"flow": "c1"}),
    ("10:00:00.180", "capture_gap", {"reason": "sensor_drop_counter_increased"}),
    ("10:00:00.420", "client_timeout", {"flow": "c1"}),
    ("10:00:03.000", "tcp_syn", {"flow": "c2"}),
    ("10:00:03.030", "tcp_syn_ack", {"flow": "c2"}),
    ("10:00:03.060", "tcp_ack", {"flow": "c2"}),
    ("10:00:03.090", "tls_alert", {"flow": "c2", "direction": "server_to_client"}),
]

def flows(rows):
    result = {}
    for timestamp, kind, data in rows:
        if "flow" in data:
            result.setdefault(data["flow"], []).append((timestamp, kind, data))
    return result

for flow, rows in flows(events).items():
    kinds = [kind for _, kind, _ in rows]
    if "tcp_syn" in kinds and "tcp_syn_ack" not in kinds:
        print(flow, "OBSERVATION: SYN without observed SYN-ACK")
        print("LIMIT: capture_gap exists; network loss is not proven.")
    if "tls_alert" in kinds:
        print(flow, "OBSERVATION: TLS alert seen; inspect direction and authorized proxy/server logs.")
~~~

**Erwartete Beobachtung:** c1 darf nicht als Netzverlust klassifiziert werden, weil eine Capture-Lücke erfasst ist. c2 belegt einen beobachteten TLS-Alert, aber nicht dessen Policy-Ursache.

**Gegenprobe:** Entferne in einer Kopie der Ereignisliste den capture_gap. Die Ausgabe wird immer noch nur without observed SYN-ACK sagen; sie darf auch dann keinen Server- oder Netzschuldbeweis erzeugen. Ergänze als zweite hypothetische Evidenz ein Proxylog und entscheide, welche Hypothese dadurch stärker oder schwächer wird.

**Auswertung:** Halte getrennt fest: Rohbeobachtung, Sensorqualität, Interpretation, Gegenhypothese und nächster autorisierter Messschritt.

**Cleanup:** Keine Dateien, Prozesse, Interfaces oder Netzwerkressourcen werden erzeugt. Bei einer realen freigegebenen Capture-Aktion wäre der Cleanup: Erfassung stoppen, Original hashen, Zugriff einschränken, Befund ablegen und Artefakt gemäß Retention löschen oder formal übergeben.


## Dependencies, Cross-References und Quellen

### Kanonische Anschlussstellen

| Beziehung | Kapitel | Grund |
|---|---|---|
| Voraussetzung | [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Hypothesengeleitete Messung und Performance-Debugging. |
| Voraussetzung | [KB-0056](08-tcp-verbindungen-und-ueberlastkontrolle.md) | TCP-Mechanik, ACKs, Fenster und Verlustgrenzen. |
| Voraussetzung | [KB-0058](10-dns-und-namensaufloesung.md) | DNS-Korrelation und Resolverdiagnose. |
| Voraussetzung | [KB-0067](19-tls-verbindungen-und-zertifikatspruefung.md) | TLS-Handshake, Zertifikatsprüfung und Dechiffriergrenzen. |
| Voraussetzung | [KB-0072](24-forward-und-reverse-proxies.md) | Proxy-Hops und Terminierung. |
| Ergänzung | [KB-0073](25-load-balancing-auf-layer-4-und-7.md) | Health-, Draining- und Targetwahl im Diagnosedatenpfad. |
| Nächster Schritt | KB-0075 Netzwerkdiagnose entlang des Anfragepfads | Verbindet Messpunkte über Adressierung, Routing und Anwendung. |
| Anwendung | KB-0154 FastAPI und Request-Lebenszyklen | Verknüpft Request-Telemetrie mit Netzwerkbeobachtung. |
| Anwendung | KB-0562 Security Incident Response | Führt Incidentbeweiskette und Security-Eskalation weiter. |
| Evidenz | KB-0720 Portfolioevidenz und Reifemodelle | Trennt Lernartefakt, Selbstauskunft und operationalen Nachweis. |

### Quellen und Aktualitätsstand

1. [Wireshark Display Filter Reference](https://www.wireshark.org/docs/man-pages/wireshark-filter.html), abgerufen 2026-09-16. Belegt Feldexistenz, Vergleiche, logische Ausdrücke und die Produktsemantik von Display-Filtern.
2. [pcap-filter(7)](https://www.wireshark.org/docs/man-pages/pcap-filter.html), abgerufen 2026-09-16. Produktnahe Referenz für Capture-Filterausdrücke; vor Einsatz gegen lokal installierte Version und Freigabe prüfen.
3. [Wireshark User’s Guide: Filtering while capturing](https://www.wireshark.org/docs/wsug_html_chunked/ChCapCaptureFilterSection.html), abgerufen 2026-09-16. Ordnet Capture-Filter im Erfassungsprozess ein.
4. [Wireshark User’s Guide](https://www.wireshark.org/docs/wsug_html/), abgerufen 2026-09-16. Belegt pcap/pcapng-Kontext, Dateimodi, TCP-Analyse, Reassembly und die Sensitivität exportierter TLS-Session-Keys.
5. [tcpdump Manual](https://www.tcpdump.org/manpages/tcpdump.1.html), abgerufen 2026-09-16. Offizielle Produktreferenz; die lokale Manpage und Version sind vor jedem autorisierten Einsatz maßgeblich.
6. [RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3](https://www.rfc-editor.org/info/rfc8446), abgerufen 2026-09-16. Normativer Kontext für TLS-Sicherheits- und Sichtbarkeitsgrenzen.

## Bonus: New Tech and Innovations

| Entwicklung | Stand 2026-09-16 und Reifegrad | Nutzen | Neue Grenze / Einführungsentscheidung |
|---|---|---|---|
| pcapng statt bloßem pcap | **Established.** Wireshark beschreibt pcapng als flexibleren Nachfolger und eigene Standardausgabe, während Interoperabilität weiterhin geprüft werden muss. | Kann Interface-, Kommentar- und Zusatzmetadaten besser transportieren. | Format ist kein Integritätsbeweis; Toolketten, Metadatenminimierung und Parserkompatibilität vor dem Standardisieren testen. |
| Feldbasierte Display-Filter und reproduzierbare CLI-Auswertung | **Established / Adopting.** Wireshark dokumentiert einen mächtigen Filterausdruck; TShark kann bereits autorisierte PCAPs automatisiert auswerten. | Wiederholbare Hypothesen, weniger manuelle GUI-Fehler. | Filter, Toolversion, Dissectorprofil und Outputdatenklasse gehören in den Befund; Automation darf keine unkontrollierten Exporte erzeugen. |
| Verschlüsselte Transportschichten und QUIC | **Established.** TLS 1.3 und QUIC begrenzen Klartextsicht absichtlich; das ist Sicherheitsfortschritt, keine Diagnosefehlfunktion. | Schutz von Inhalt und Metadatenanteilen auf dem Draht. | Investiere zuerst in sichere Endpunkt-, Proxy- und Tracetelemetrie; Session-Secrets bleiben eine seltene, streng kontrollierte Ausnahme. |
| Programmierbare Telemetrie nahe am Datenpfad | **Adopting.** eBPF-/Cloud-/Mesh-Sensoren können kontextreichere, selektivere Beobachtung liefern. | Potenziell niedrigere Voll-PCAP-Last und bessere Prozess-/Servicekorrelation. | Sensorcode, Privilegien, Kernel-/Agentkompatibilität, Datenschutz, Loss-Semantik und Exitplan benötigen Spezialistenreview; das ersetzt keine Beweiskette. |

Ein Pilot akzeptiert eine Paketdiagnose-Innovation erst, wenn Fragestellung und Datenklasse, Messpunkt/Sichtbarkeit, Filter/Snaplen/Volumen, Zeit- und Dropqualität, Verschlüsselungs-/Secret-Grenze, Zugriff/Retention/Integrität, Korrelation mit Logs/Metriken/Traces, Performance-/Kostenwirkung, Tool-/Formatkompatibilität, Incident-Übergabe und Rollback nachgewiesen sind.
