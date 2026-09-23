---
{"id": "KB-0060", "title": "NTP und Zeitsynchronisation", "domain": "03", "sequence": 12, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Zeitachse", "Korrelation", "Fehlersuche"], "needed_for": "both"}, {"id": "KB-0049", "concepts": ["Netzwerkpfad", "Schichtenmodell", "Endpunktgrenzen"], "needed_for": "understanding"}, {"id": "KB-0057", "concepts": ["UDP", "Jitter", "Delay", "Paketverlust"], "needed_for": "both"}, {"id": "KB-0058", "concepts": ["DNS-Auflösung", "Zeitstempel", "Cache-Diagnose"], "needed_for": "understanding"}, {"id": "KB-0059", "concepts": ["Lease-Timer", "Client-Bootstrap", "Optionspfad"], "needed_for": "both"}], "related": ["KB-0034", "KB-0061", "KB-0063", "KB-0151", "KB-0562", "KB-0720"], "applies": ["KB-0061", "KB-0151", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Das Lab berechnet Offset, Delay, Zeitfenster und die Wirkung eines Wall-Clock-Sprungs nur mit lokalen Zahlen und ohne Netzwerk oder Systemuhränderung.", "rationale": "Es kontaktiert keinen Zeitserver und stellt weder Systemzeit noch Hardware Clock, NTP-Daemon, Container-, Cloud- oder Produktionszeit um."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein Zeitdienstvertrag definiert Zeitskala, Referenzquellen, Stratum- und Fehlerdomänen, Genauigkeitsbudget, Clientpfad, Schritt-/Slew-Policy, Security, Monitoring und den Umgang mit unsicherer Zeit.", "rationale": "Wall-clock Zeit, Zeitdauer und Reihenfolge werden nach ihrem fachlichen Zweck getrennt modelliert."}, "STAFF-TARGET": {"active": true, "scope": "Teams instrumentieren Offset, Delay, Jitter, Dispersion, Stratum, ausgewählte Quelle, Synchronisationsstatus, Zeitsprünge und deren Auswirkungen auf Authentisierung, Scheduling, Logs und Datenreihen.", "rationale": "Sie korrelieren Ereignisse über monotone Dauer und vertrauenswürdige Zeitquellen, statt aus sortierten Wall-Clock-Timestamps voreilig Kausalität abzuleiten."}, "CHIEF-TARGET": {"active": true, "scope": "Die Organisation führt Zeit als gemeinsame Sicherheits-, Compliance-, Forensik-, Plattform- und Verfügbarkeitsabhängigkeit mit klaren Fehlerdomänen, Sovereignty-/Providerregeln und Wiederanlaufzielen.", "rationale": "Falsche Zeit kann gleichzeitig Zugang, Zertifikate, Token, Reihenfolge, Abrechnung und Incidentanalyse beeinträchtigen; eine zentrale, ungemessene Quelle ist ein organisationsweiter Blast Radius."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "PTP/IEEE 1588, Boundary/Transparent Clocks, GNSS-Antennen/Holdover, oscillator disciplining, leap-smear-Implementierungen, timestamping in NIC/PHC, NTP-Implementierungsalgorithmen und Hochpräzisionshandel sind Spezialistentiefe.", "rationale": "Die Zielrollen müssen Fehlerbudget, Abhängigkeiten, Security und Betriebsgrenzen entscheiden; physische Zeitverteilung und Mikrosekunden-/Nanosekundentiefe bleiben Spezialrollen vorbehalten."}}, "lab_validation": [{"lab_id": "KB-0060-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox ohne Netzwerkzugriff", "evidence": "Vier-Timestamp-Offset/Delay, asymmetrischer Pfad, Wall-Clock-Schritt und monotone Dauer als deterministische Fallarbeit geprüft.", "limitations": "Nicht ausgeführt; kein NTP-/NTS-/PTP-Paket, kein Zeitserver, keine Systemzeit, Hardware Clock, Daemon-, Container-, Cloud- oder Produktionsressource wurde verwendet oder verändert."}]}
---
# NTP und Zeitsynchronisation

> **Ziel:** Zeit ist eine verteilte Messgröße, keine globale Gewissheit. NTP schätzt Offset und Netzverzögerung gegenüber Zeitquellen und diszipliniert eine Systemuhr. Entwerfe Systeme so, dass sie Wall-Clock-Zeit für menschen- und vertrauensbezogene Zeitpunkte, monotone Zeit für Dauer und Reihenfolge innerhalb eines Prozesses und nachweisbare Zeitqualität für Security und Forensik unterscheiden.

## Purpose, Definition und Scope

Network Time Protocol (NTP) synchronisiert Systemuhren über ein Netzwerk mit einer Zeitreferenz. NTP verwendet Zeitstempel und mehrere Messungen, um Offset, Delay, Jitter und Fehlergrenzen zu schätzen. Zeit fließt dabei von Referenzquellen über Serverhierarchien zu Clients; ein **Stratum** beschreibt die Entfernung in dieser Synchronisationshierarchie, nicht automatisch eine universelle Qualitätsnote.

Dieses Kapitel erklärt Zeitquellen, Stratum, Offset und Drift, NTP-Datenfluss, Schritt und Slew, Wall Clock und monotonic clock sowie die Auswirkungen falscher Zeit auf Logs, Tokens, Zertifikate, Scheduler und verteilte Systeme. Es behandelt keine Präzisionszeitverteilung auf Hardwareebene und keine konkrete Produktkonfiguration.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | NTP nutzt Netzwerkmessungen und Clock-Discipline, um Systemzeit gegenüber Referenzen zu steuern. |
| HANDS-ON-TARGET | Das Lab rechnet mit synthetischen Zeitstempeln und verändert keine Uhr. |
| ARCHITECT-TARGET | Zeitquellen, Fehlerbudget, Zeitskala, Clientpolicy, Sicherheitsmodell und Fallback sind ein expliziter Vertrag. |
| STAFF/PRINCIPAL | Teams messen die Qualität der Zeit und testen die Auswirkungen schlechter oder springender Zeit. |
| CHIEF | Zeit wird als gemeinsame Basis für Sicherheit, Audit, Abrechnung und Incidentführung verantwortet. |

## Mental Model: Es gibt Zeitpunkte, Dauern und Schätzungen

Eine Maschine besitzt mehrere nützliche Zeitdarstellungen:

```text
reference time (for example UTC)
        ^
        | NTP measurement and clock discipline
system wall clock (can jump forward/backward)
        |
        +-- logs, certificates, token expiry, user-visible timestamps
        |
monotonic clock (moves forward while system runs)
        |
        +-- timeout, duration, retry delay, local event ordering
```

- **Wall clock / real-time clock:** Ein Zeitpunkt auf einer Zeitskala, etwa UTC. Sie kann durch NTP, Administratoraktion oder Wiederanlauf vor- oder zurückspringen.
- **Monotone Uhr:** Für gemessene Dauer und Deadlines. Sie soll innerhalb eines laufenden Systems nicht rückwärts gehen; sie ist nicht automatisch eine globale Uhrzeit.
- **Hardware clock / RTC:** Eine lokale Uhr, die ein System beim Booten initialisieren kann. Ihre Qualität und Stromversorgung sind nicht gleich einer synchronisierten Referenz.
- **Zeitqualität:** Offset, Unsicherheit, Netzwerkdelay, Jitter, Quelle, Alter der letzten guten Messung und Synchronisationsstatus.

Eine Aussage wie „der Logeintrag war um 10:01:05“ ist nur so zuverlässig wie Zeitquelle, Synchronisationsstatus, Timestamp-Typ, Zeitzone/Format, Transport und Korrelation. Eine Aussage wie „dieser Request dauerte 230 ms“ sollte aus einer monotonen Uhr stammen, damit ein Wall-Clock-Sprung die Messung nicht verfälscht.

## Prerequisites und Dependencies

| ID | Art | Wofür nötig |
|---|---|---|
| [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Verständnis und Lab | Zeitachsen und hypothesenbasierte Incidentdiagnose. |
| [KB-0049](01-osi-und-tcp-ip-als-analysemodelle.md) | Verständnis | NTP als Anwendungsprotokoll über Netzpfade. |
| [KB-0057](09-udp-und-datagrammverhalten.md) | Verständnis und Lab | UDP, Paketverlust, Delay und Jitter. |
| [KB-0058](10-dns-aufloesung-und-caches.md) | Verständnis | Namensauflösung der Zeitquellen und Logkorrelation. |
| [KB-0059](11-dhcp-und-adressvergabe.md) | Verständnis und Lab | Client-Bootstrap und zeitbezogene Konfigurationspfade. |

## Core Concepts

### Zeitquelle, Stratum und Fehlerdomäne

Eine primäre Zeitquelle ist direkt oder über ein spezialisiertes System auf eine Referenzzeitskala rückführbar, etwa über GNSS oder nationale Zeitdienste. Ein NTP-Server, der direkt mit einer solchen Quelle synchron ist, wird im NTP-Modell als Stratum 1 bezeichnet; nachgelagerte Server haben höhere Strata. Das bedeutet nicht: niedrigeres Stratum ist immer für jeden Client besser. Netzpfad, Stabilität, Ausfallkopplung, Authentizität und gemessene Synchronisationsdistanz gehören ebenfalls zur Bewertung.

| Begriff | Bedeutung | Fehlannahme |
|---|---|---|
| Reference clock | Referenz für eine Zeitquelle | Ein GPS-Empfänger macht ohne Antennen-, Holdover- und Security-Design automatisch gute Zeit. |
| Stratum | Ebene im NTP-Synchronisationsbaum | Stratum ist keine vertragliche Genauigkeitsgarantie. |
| Peer | NTP-Partner mit Mess- und Auswahlbeziehung | Mehr Peers sind nicht automatisch unabhängige Quellen. |
| Offset | geschätzter Unterschied zwischen lokaler und Referenzzeit | Ein einzelner Offsetwert genügt nicht ohne Delay und Unsicherheit. |
| Drift/Frequency error | systematische Gangabweichung der lokalen Uhr | Drift verschwindet nicht, weil einmalig ein Timestamp gesetzt wurde. |
| Jitter | Variation wiederholter Messungen | Jitter ist nicht identisch mit durchschnittlichem Delay. |
| Root distance | zusammengefasste Entfernung/Unsicherheit zur Referenz | Ein niedriger Ping allein ist kein Ersatzwert. |

Eine gute Quellenarchitektur vermeidet gemeinsame Ausfälle: mehrere Zeitserver können dieselbe Upstream-Quelle, dasselbe Rechenzentrum, denselben DNS-Pfad, dieselbe Stromversorgung oder denselben Provider teilen. Solche Quellen erhöhen Verfügbarkeit nur scheinbar.

### Vier Zeitstempel: Offset und Delay

Im vereinfachten NTP-Austausch hält der Client seine Sendezeit `t1` und Empfangszeit `t4` fest. Der Server trägt Empfangszeit `t2` und Sendezeit `t3` ein.

```text
client                         server
  t1 --- request ----------->  t2
  t4 <--- response ---------  t3
```

Unter der Annahme, dass Hin- und Rückweg ähnlich lang sind:

```text
round-trip delay δ = (t4 - t1) - (t3 - t2)
offset θ = ((t2 - t1) + (t3 - t4)) / 2
```

Die Annahme symmetrischer Pfade ist ein Modell, nicht garantiert. Asymmetrie, Queueing, Verlust, Angriff oder wechselnde Routen beeinflussen die Schätzung. NTP nutzt deshalb wiederholte Samples, Filterung, Auswahl und Clock-Discipline statt einer einzelnen Anfrage als unfehlbare Wahrheit zu behandeln.

### Polling, Auswahl und Clock Discipline

NTP-Clients befragen Quellen in Intervallen und beurteilen Qualität anhand gemessener Eigenschaften. Sie wählen nicht blind den ersten oder den am nächsten antwortenden Server. Die Implementierung diszipliniert dann die lokale Systemuhr:

| Aktion | Wirkung | Betriebsrisiko |
|---|---|---|
| Step | Wall Clock wird deutlich auf einen neuen Zeitpunkt gesetzt | Zeit kann vor- oder zurückspringen; Logs, Tokens, Timer und Datenreihen können verwirrt werden. |
| Slew | Uhrfrequenz wird zeitweise angepasst, damit sich Offset graduell abbaut | Korrektur dauert; bei großem Fehler bleibt Zeit länger ungenau. |
| Holdover / unsynchronisiert | letzte bekannte Zeit läuft lokal weiter | Drift wächst; Security-/Forensikqualität sinkt mit dem Alter. |
| Quelle wechseln | Client wählt anderen Kandidaten | Wechsel kann unsichtbare Fehlerdomäne oder plötzliche Offsets offenlegen. |

Die zulässige Schritt-/Slew-Policy hängt von Workload und Bootstrap ab. Ein neu gestartetes, isoliertes System kann eine große Korrektur anders behandeln als ein laufender Datenbankknoten, ein Authentifizierungsdienst oder ein System mit streng zeitabhängigen Prozessen. Diese Policy muss Produkt- und Plattformfolgen benennen.

## Architecture und Data Flow

### Referenzmodell

```text
[UTC-traceable source or trusted upstream]
              |
     [independent time-server groups]
              |
       [site / region time service]
              |
         [clients and workloads]
              |
[wall clock, monotonic timers, logs, auth, schedulers, data stores]
```

Der Dienst ist nicht nur „UDP/123 offen“. Ein belastbarer Pfad umfasst:

1. Namens- oder Adressauflösung einer Quelle.
2. Netzerreichbarkeit und sichere Source-Policy.
3. Zeitmessung, Filterung, Auswahl und lokale Uhrdisziplin.
4. Status- und Qualitätsmetrik.
5. Konsum durch Betriebssystem, Laufzeiten, Anwendungen, Logs, Token-/Zertifikatsprüfungen und Scheduler.
6. Verhalten bei Source-Verlust, großem Offset und Neustart.

### Zeitqualität als Servicevertrag

Ein Zeitvertrag sollte mindestens enthalten:

- Zeitskala und Darstellung: UTC, Zeitzone für Anzeige, Leap-Second-/Smear-Policy;
- erlaubte Quellen, Anzahl unabhängiger Fehlerdomänen und Source-Auswahl;
- maximale Offset- und Unsicherheitsgrenzen je Serviceklasse;
- Alarmgrenzen für Verlust der Synchronisation und Alter letzter guter Messung;
- Step-/Slew- und Bootstrappolicy;
- NTP-/NTS-/Zugriffsschutz und Logging;
- Verhalten bei „time uncertain“: Dienststart sperren, eingeschränkt arbeiten, Ereignisse markieren oder kontrolliert ablehnen;
- Wiederanlauf, Incidentkorrelation und Nachweis.

## Wall Clock, monotonic clock und Uhrsprünge

Linux stellt unterschiedliche Clock IDs bereit. `CLOCK_REALTIME` repräsentiert wall-clock Zeit und kann gesetzt werden; `CLOCK_MONOTONIC` dient monotone Zeitmessung und wird nicht durch diskontinuierliche Systemzeitänderungen zurückgesetzt. Anwendungen dürfen daraus keine falsche Globalordnung ableiten: Eine monotone Zeit eines Hosts lässt sich nicht ohne weiteres mit der eines anderen Hosts vergleichen.

| Anwendungsfall | Richtige Zeitbasis | Warum |
|---|---|---|
| Nutzeranzeige, Auditzeitpunkt, Zertifikatgültigkeit | Wall Clock in UTC, mit Zeitqualität | Es geht um einen fachlichen Zeitpunkt. |
| Request-Dauer, Retry-Backoff, lokale Deadline | monotonic clock | Ein Rücksprung darf kein negatives Duration- oder Timeoutverhalten erzeugen. |
| verteilte Ereignisreihenfolge | Sequenz/kausaler Kontext plus Zeit | Wall Clock allein ordnet bei Offsets und Sprüngen nicht sicher. |
| Cron-/Kalenderausführung | Wall Clock plus Doppelausführungs-/Miss-Policy | Lokale Zeitumstellung und Step können Jobs doppelt oder gar nicht auslösen. |
| Datenbank-TTL und Tokenablauf | definierte Zeitskala, Skewbudget, Serverauthorität | Clientzeit darf keinen unkontrollierten Sicherheitsvorteil schaffen. |

Ein Uhrsprung ist kein Grund, Logdaten nachträglich zu löschen oder Timestamp-Reihen unbesehen zu sortieren. Logs brauchen Quelle, UTC-Format, optional monotone Korrelation und Metadaten über Synchronisationsstatus. Zeitunbestimmtheit soll sichtbar sein.

## Protocols, Standards und aktuelle Technologien

| Standard/Technologie | Relevanz | Architekturentscheidung |
|---|---|---|
| RFC 5905 | NTPv4, Zeitstempel, Modi, Auswahl- und Clock-Discipline-Modelle | Grundlage für NTP-Pfad und Qualitätsbegriffe. |
| RFC 8633 | NTP Best Current Practices | Konfiguration, Betriebs- und Sicherheitsentscheidungen gegen BCP prüfen. |
| RFC 7384 | Security Requirements for Time Protocols | Bedrohungen wie Manipulation, Delay und Source-Angriffe betrachten. |
| RFC 8915 | Network Time Security (NTS) | Authentisierte Zeitbeschaffung für geeignete Client-/Serverpfade planen. |
| RFC 7822 | NTP Extension Fields | Erweiterte Funktionen benötigen Interoperabilitäts- und Sicherheitsprüfung. |
| `clock_gettime` | OS-Zeitquellen | Wall-clock und monotone Messungen im Code bewusst wählen. |
| PTP / IEEE 1588 | präzise lokale Zeitverteilung | Nur bei nachgewiesenem Genauigkeitsbedarf samt Hardware-/Netzwerkdesign einsetzen. |

**Stand 2026-09-16:** RFC 5905 wurde durch weitere RFCs aktualisiert; der Artikel verwendet ihn für das Grundmodell und ergänzt BCP sowie NTS als aktuelle Sicherheits- und Betriebsreferenzen. Implementierungs- und Providerunterstützung bleibt zeitabhängig und wird vor Einsatz pro Umgebung geprüft.

## Scalability und Performance

NTP ist leichtgewichtig, aber sehr breite Clientflotten können Quellen, Resolver, Firewalls und Netzwerkpfade belasten. Unkontrolliertes sehr häufiges Polling verschlechtert nicht automatisch Genauigkeit; es kann Last, Rate-Limits und asymmetrische Queues erhöhen. Ebenso kann ein zentraler Zeitdienst ohne regionale oder standortbezogene Kapazität beim gleichzeitigen Neustart vieler Geräte ausfallen.

| Kennzahl | Aussage | Entscheidungsgrenze |
|---|---|---|
| Offset nach Quelle/Region | Abweichung der Clients | Dienstklasse bestimmt maximale tolerierte Abweichung. |
| Delay, Jitter, Root Distance | Qualität/Unsicherheit des Pfads | nicht nur Mittelwert, sondern p95/p99 und Wechsel betrachten. |
| Source selection / reachability | verwendete und erreichbare Quellen | gemeinsame Fehlerdomänen sichtbar machen. |
| Synchronisationsstatus und Alter | Vertrauen in aktuelle Zeit | „unsynchronized“ ist ein sicherheitsrelevanter Zustand. |
| Step-/Slew-Ereignisse | sprunghafte oder graduelle Korrekturen | mit Auth-, Scheduler- und Datenfehlern korrelieren. |
| Client-QPS und Poll-Intervall | Lastverhalten | Mass restart, Auto Scaling und Reconnect testen. |
| NTS-/Auth-Fehler | Vertrauens- und Schlüsselpfad | nicht still auf ungesicherte Quellen zurückfallen. |

## Reliability und Failure Modes

| Fehlerbild | Ursacheklasse | Beleg | Sofortmaßnahme | Dauerhafte Verbesserung |
|---|---|---|---|---|
| großer Offset | Bootzeit, Drift, schlechte Quelle, falsche Zeitskala | Offset/Quelle/Alter/Stepstatus | Workloadrisiko nach Policy begrenzen | Bootstrap-/Holdover- und Source-Design. |
| Zeit springt rückwärts | Step oder manuelle Änderung | Wall-/monotone Korrelation, Audit | Token/Scheduler/Data-path bewerten | monotone Dauer, Step-Policy, Alarm. |
| Zeit driftet schleichend | Quelle weg, Hardware-/VM-Drift | Offsettrend, last good sample | Synchronisation wiederherstellen | unabhängige Quellen und Age-Alarme. |
| nur ein Standort fehlerhaft | lokale Netz-/Relay-/DNS-/Firewallgrenze | Quellenvergleich nach Standort | Pfad isolieren | regionale/standortbezogene Fehlerdomänen. |
| Authentisierung schlägt fehl | Zeit außerhalb Clock-Skew-Fenster | Token-/Zertifikatsfehler plus Offset | Zeitqualität und Issuer-/Verifierzeit prüfen | gemeinsames Skewbudget, Startgates. |
| Logs scheinen kausal falsch | unsynchrone oder springende Wall Clock | Zeitstatus und monotone Reihenfolge | Daten kennzeichnen, nicht umdeuten | UTC, time-quality fields, trace IDs. |
| Zeitmanipulation | gefälschte, verzögerte oder umgeleitete Quelle | Quellwechsel, Delay/Offset-Anomalie | Quelle sperren, sichere Policy aktivieren | NTS, Source-Allowlist, Mehrquellen- und Netzschutz. |

### Authentisierung, Tokens und Zertifikate

Zeitabhängige Sicherheitsmechanismen definieren meist ein Gültigkeitsfenster: „not before“, „expires at“, Signaturzeit oder Replay-Fenster. Zu langsame Zeit kann abgelaufene Credentials weiterhin akzeptieren oder neue als noch nicht gültig sehen; zu schnelle Zeit kann gültige Credentials ablehnen. Das präzise Verhalten hängt vom jeweiligen Protokoll und der Implementierung ab. Deshalb dokumentiert ein Security-Architekturvertrag:

- welche Seite die Zeit prüft;
- welches Skewbudget zulässig ist;
- welche Zeitquelle als maßgeblich gilt;
- wie Bootstrap bei großer Abweichung funktioniert;
- ob ein unsynchronisiertes System sicher starten, aber keine sensitiven Aktionen ausführen darf;
- wie Incidentteams Zeitfehler von Schlüssel-, Zertifikats- oder Netzfehlern trennen.

## Security, Governance und Compliance

Zeitmanipulation kann Authentisierung umgehen, Logs verfälschen, Replay-Fenster erweitern, Zertifikatprüfung stören, Abrechnung verfälschen oder Incidentanalysen erschweren. NTP über UDP besitzt ohne zusätzliche Schutzmechanismen keine allgemeine Garantie, dass eine Antwort vertrauenswürdig oder unverzögert ist. RFC 7384 beschreibt entsprechende Sicherheitsanforderungen; NTS spezifiziert einen Schutzmechanismus für NTP.

| Risiko | Kontrolle |
|---|---|
| Rogue/umgeleitete Quelle | zugelassene Quellen, Netz-/DNS-Policy, Monitoring von Source- und Offsetwechseln. |
| gefälschte oder veränderte Zeit | NTS oder geeignete Authentisierung, Mehrquellenvergleich, keine unkontrollierte Fallbackquelle. |
| Delay-/Asymmetrieangriff | Delay/Root-Distance beobachten, Fehlerdomänen diversifizieren, Genauigkeitsgrenzen definieren. |
| zentraler Zeitserverausfall | mehrfach unabhängige Quellen, Holdover- und Degradationspolicy, Recovery-Drill. |
| forensische Unklarheit | UTC, Time-Quality-Metadaten, auditierbare Zeitplattform und gesicherte Logpipeline. |
| übermäßige Clientidentifikation | minimale NTP-/NTS-Logdaten, klare Retention und Zugriffskontrolle. |

Zeitdienste gehören in die Sicherheitsarchitektur, aber sie ersetzen keine Signaturen, keine Autorisierung und keine manipulationssichere Ereignisprotokollierung. Eine NTP-Antwort mit gutem Offset beweist nicht, dass ein Token legitim ist.

## Observability und Troubleshooting

### Ereignisschema

```text
timestamp_utc, monotonic_elapsed, host/service identity,
selected source, candidate sources, stratum, offset, delay,
jitter, dispersion/root distance, reachability, last-good-age,
synchronization state, step-or-slew event, authentication/NTS status,
network context, software version, related request/trace id
```

Die Felder sind je nach Privacy- und Betriebsanforderungen zu minimieren. Für sicherheitskritische Untersuchungen muss die Korrelation zwischen Host, Quelle und Zeitqualität nachvollziehbar sein.

### Triage-Reihenfolge

1. **Zeitproblem konkret machen:** Betrifft es UTC-Zeitpunkt, gemessene Dauer, Token-/Zertifikatsfenster, Logsortierung oder Scheduler?
2. **Synchronisationsstatus lesen:** Ausgewählte Quelle, Stratum, Offset, Delay, Jitter, Alter letzter guter Messung und Stepstatus erfassen.
3. **Fehlerdomäne vergleichen:** Gleichartige Clients anderer Region/Standort/Quelle prüfen; gemeinsame Upstreams erkennen.
4. **Netzpfad trennen:** DNS, UDP-Erreichbarkeit, Loss/Jitter, Firewall und Rate-Limits gegen Source-Policy prüfen.
5. **Clock-Typ im Code prüfen:** Für Dauer-/Timeoutfehler monotonic Verwendung nachweisen; für Audit UTC-Format und Zeitqualität prüfen.
6. **Securityauswirkung prüfen:** Token, Zertifikat, Signatur, Replay- und Jobfenster gegen gemessenen Offset und definierte Skewgrenze legen.
7. **Korrektur kontrollieren:** Step-/Slew-Policy und Workloadfolgen berücksichtigen; keine pauschale Uhränderung ohne Incidentplan.

| Symptom | Geeignete Hypothese | Nicht ausreichender Schluss |
|---|---|---|
| negative oder riesige Requestdauer | Wall Clock wurde für Dauer verwendet | „NTP ist langsam.“ |
| Zertifikat „noch nicht gültig“ | Client oder Verifier liegt außerhalb Skewbudget | „Das Zertifikat ist kaputt.“ |
| Logs wechseln Reihenfolge | Offset/Step oder mehrere Hosts unsynchron | „Ereignis B muss Ursache von A sein.“ |
| Client kann Source nicht erreichen | DNS/UDP/Firewall oder Sourcepolicy | „Die lokale RTC ist falsch.“ |
| gleicher Offset auf vielen Hosts | gemeinsamer Upstream/Provider/Templatefehler | „Jede VM driftet zufällig.“ |

## Cost und FinOps

Zeitdienstkosten umfassen nicht nur Server oder Provider: regionale Redundanz, Hardware-/GNSS-Referenzen, NTS-/Schlüsselbetrieb, Netzpfade, Telemetrie, Logs, Tests und Incidentzeit gehören dazu. Ein kostengünstiger einzelner öffentlicher Upstream kann ein unvertretbarer Single Point of Failure oder Datenschutzpfad sein. Eine sehr genaue Plattform kann unnötig teuer und komplex sein, wenn der Workload nur Sekunden- oder Minutenpräzision benötigt.

FinOps-Entscheidungen koppeln daher Serviceklasse und Fehlerbudget:

- Welche Genauigkeit braucht ein Dienst wirklich?
- Welche Kosten verursacht Zeitunsicherheit für Auth, Abrechnung oder Compliance?
- Welche Fehlerdomänen werden durch zusätzliche Quellen tatsächlich reduziert?
- Welche Logs sind für Forensik nötig und welche Retention ist verhältnismäßig?
- Wann rechtfertigt PTP/GNSS-Hardware den messbaren Businessnutzen?

## Trade-offs und Anti-Patterns

| Entscheidung | Gewinn | Preis | Leitplanke |
|---|---|---|---|
| Step bei großem Offset | schnelle UTC-Korrektur | Sprungfolgen für aktive Workloads | pro Serviceklasse steuern und testen. |
| Slew bevorzugen | keine diskontinuierliche Wall Clock | längere Unsicherheit | nur mit akzeptiertem Korrekturfenster. |
| wenige zentrale Quellen | einfache Governance | gemeinsamer Ausfall-/Manipulationspfad | echte Fehlerdomänendiversität prüfen. |
| externe Quellen direkt für jeden Client | geringe eigene Infrastruktur | Privacy, Rate, Netz- und Providerabhängigkeit | zentrale Policy und Kapazität bewerten. |
| lokale Zeitserver | geringe Latenz, Standortautonomie | zusätzlicher Betrieb | Referenz, Holdover und Monitoring nachweisen. |
| NTS einsetzen | bessere Authentizität bestimmter Pfade | Schlüssel-, TLS- und Kompatibilitätsbetrieb | Fallback nicht still entwerten. |

Anti-Patterns:

- Stratum als alleinige Qualitätsmetrik behandeln.
- Einen einzelnen „richtigen“ Timestamp als Beweis für Zeitgesundheit verwenden.
- Dauer oder Retryfristen auf Wall Clock basieren lassen.
- Zeitkorrektur als folgenlosen Infrastrukturchange betrachten.
- Mehrere Quellen konfigurieren, die dieselbe Fehlerdomäne teilen.
- Unsynchronisierte Zeit nicht messen und nur bei Securityfehlern bemerken.
- NTP-Quelle über DNS konfigurieren, ohne die DNS-/Netz-/Security-Abhängigkeit zu dokumentieren.
- Zeitstempel in lokaler Zeitzone ohne Offset/UTC-Konvention für forensische Korrelation verwenden.

## Staff-, Principal- und Chief-Level Decisions

### Staff / Principal

- Definiere Time-Quality-SLOs pro Workloadklasse und mache „unsynchronized“ zu einem beobachtbaren Betriebszustand.
- Verlange, dass APIs und Services zwischen Zeitpunkt, Dauer, Reihenfolge und Zeitunsicherheit unterscheiden.
- Baue Tests für Start mit großem Offset, Sourceverlust, Wall-Clock-Step, asymmetrischen Delay und Token-/Zertifikatsfenster.
- Verknüpfe NTP-Telemetrie mit Auth-, Scheduler-, Daten- und Logfehlern, ohne kausale Schlüsse ohne Evidenz zu ziehen.
- Prüfe gemeinsame Fehlerdomänen von NTP-Servern, DNS, Routing, VM-Templates und Providerdiensten.
- Lege eine sichere Degradationsentscheidung fest statt unkontrolliert auf lokale Drift oder fremde Quellen zurückzufallen.

### Chief

- Etabliere eine organisationsweite Zeitstrategie mit Sicherheits-, Compliance-, Forensik-, Platform- und Network-Ownern.
- Segmentiere Genauigkeits- und Verfügbarkeitsziele für Standard-IT, kritische Transaktionen, OT/Edge, Datenplattformen und regulatorische Systeme.
- Bewerte geografische und Provider-Souveränität, Zeitreferenz, Lieferketten- und GNSS-/NTS-Risiken.
- Priorisiere bei großen Architekturentscheidungen Zeitkonsistenz und Evidenzfähigkeit gleichrangig mit Compute- und Netzwerkverfügbarkeit.
- Verlange Übungen für massenhaften Clientrestart, Zeitquellenausfall, falsche Zeitverteilung und forensische Rekonstruktion.

## Production Checklist

- [ ] Zeitskala, UTC-/Zeitzonenformat und Leap-Second-/Smear-Policy sind dokumentiert.
- [ ] Jede Serviceklasse besitzt ein messbares Offset-/Unsicherheitsbudget und eine Unsynchronized-Policy.
- [ ] Mehrere Quellen sind nach tatsächlichen Fehlerdomänen, nicht nur Hostnamen, diversifiziert.
- [ ] Source-Auswahl, Stratum, Offset, Delay, Jitter, Root Distance, Alter und Step-/Slew-Ereignisse sind beobachtbar.
- [ ] Bootstrap-, Recovery-, Holdover-, Step- und Slew-Verhalten sind für relevante Workloads getestet.
- [ ] Dauer und Timeouts verwenden monotone Zeit; Audit-/Security-Zeitpunkte nutzen UTC mit Zeitqualitätskontext.
- [ ] Token, Zertifikate, Scheduler, Datenbanken und Logs haben ein explizites Skew-/Zeitsprungverhalten.
- [ ] Zeitquellen, DNS, UDP/Firewall, NTS/Auth und Logging folgen Security- und Privacy-Policy.
- [ ] Quellenwechsel, NTS-/Auth-Fehler und große Offsets lösen abgestufte Alarme mit Ownern aus.
- [ ] Wiederherstellung und Incidentrunbook enthalten Korrelation über mehrere Hosts und Fehlerdomänen.

## Praktisches Lab: Vier Zeitstempel, Asymmetrie und Wall-Clock-Sprung

**Ziel:** Das Lab rechnet Offset und Delay aus einer rein lokalen Zahlenfolge. Es illustriert, warum symmetrische Netzwege eine Annahme und warum Dauer nicht aus einer springenden Wall Clock abgeleitet wird.

```python
def ntp_estimate(t1, t2, t3, t4):
    delay = (t4 - t1) - (t3 - t2)
    offset = ((t2 - t1) + (t3 - t4)) / 2
    return {"delay_ms": delay, "offset_ms": offset}

# Millisekunden auf den jeweiligen Uhren, rein synthetisch
print(ntp_estimate(t1=1000, t2=1018, t3=1020, t4=1042))

wall_start, wall_end = 10_000, 9_700     # Rücksprung
mono_start, mono_end = 5_000, 5_300      # nur vorwärts
print({"wall_duration_ms": wall_end - wall_start,
       "monotonic_duration_ms": mono_end - mono_start})
```

**Erwartete Auswertung:**

| Probe | Erwartung | Aussage |
|---|---|---|
| vier Zeitstempel | Delay und Offset werden getrennt berechnet | Eine kurze RTT beweist keinen null Offset. |
| Rücksprung der Wall Clock | negative Wall-Dauer möglich | Wall Clock ist für lokale Dauer ungeeignet. |
| monotone Werte | positive Dauer von 300 ms | Für Timeouts und Dauer ist monotone Zeit geeignet. |
| asymmetrische Variation | Offsetschätzung verändert sich | Netzpfadannahmen beeinflussen Zeitqualität. |

**Negative Probes:**

1. Erhöhe nur `t4` und erkläre die größere Rückwegverzögerung. Begründe, warum der geschätzte Offset ohne Symmetrie nicht zur absoluten Wahrheit wird.
2. Setze `wall_end` weit in die Zukunft. Beschreibe die Auswirkung auf Retry-, Token- oder Schedulerlogik, wenn sie Wall Clock verwendet.
3. Simuliere zwei Quellen mit gleichem Offset, aber einer gemeinsamen „Upstream“-Kennzeichnung. Begründe, warum dies keine unabhängige Redundanz ist.
4. Ergänze einen `last_good_age_s`-Wert. Leite eine Degradationsentscheidung aus Serviceklasse und Alter ab, nicht aus der bloßen Tatsache einer laufenden lokalen Uhr.

**Cleanup:** Interpreter beenden und gegebenenfalls temporäre lokale Labdateien entfernen. Das Lab verändert keinerlei Uhr, Daemon, Netzpfad, Zeitquelle, Container-, Cloud- oder Produktionsressource.

## Interviewfragen mit Antwortkernen

1. **Was misst NTP mit den vier Zeitstempeln?**  
   Es schätzt Round-Trip Delay und Clock Offset unter einer Annahme über die Pfadsymmetrie. Wiederholte Messung und Auswahl mehrerer Quellen begrenzen, aber eliminieren nicht jede Unsicherheit.

2. **Warum ist Stratum keine alleinige Qualitätsmetrik?**  
   Stratum beschreibt die Ebene zur Referenz. Netzdelay, Jitter, Quellengesundheit, Security und gemeinsame Fehlerdomänen bestimmen die effektive Zeitqualität zusätzlich.

3. **Wann brauchst du monotone statt Wall-Clock Zeit?**  
   Bei Dauern, Timeouts, Retryfristen und lokaler Ablaufsteuerung. Ein NTP-Step oder manueller Uhrsprung darf diese Berechnungen nicht rückwärts oder unplausibel machen.

4. **Welche Wirkung hat eine zu schnelle Systemzeit auf Authentisierung?**  
   Zertifikate oder Tokens können als abgelaufen oder noch nicht gültig gelten. Die genaue Wirkung hängt vom Prüfer und Skewbudget ab, deshalb braucht sie gezielte Tests.

5. **Was ist der Unterschied zwischen Step und Slew?**  
   Step setzt Wall Clock sprunghaft; Slew verändert die Rate, um den Fehler über Zeit abzubauen. Step korrigiert schnell, kann aber laufende Software stärker beeinflussen.

6. **Wie erkennst du eine scheinbar redundante, aber gemeinsame Zeitfehlerdomäne?**  
   Vergleiche Upstream, Standort, Strom, Netzwerk, DNS, Provider, VM-Template und Sicherheitsverwaltung statt nur Servernamen und IP-Adressen.

7. **Was schützt NTS und was nicht?**  
   NTS schützt NTP-Austauschmechanismen mit kryptografischen Mitteln für passende Implementierungen. Es ersetzt weder Availability-Design, Delay-/Asymmetriebeobachtung noch Anwendungsauthorisierung.

8. **Wie verbesserst du Logs für einen Zeitincident?**  
   UTC-Timestamps, Zeitqualität und Source-Status, monotone Dauer, Trace-/Request-IDs sowie eine dokumentierte Zeitzonen- und Step-Policy ermöglichen eine belastbarere Rekonstruktion.

## Dependencies, Cross-References und Quellen

| Beziehung | Dokument | Nutzung |
|---|---|---|
| Voraussetzung | [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Zeitachsen und Incidentmethodik. |
| Voraussetzung | [KB-0057](09-udp-und-datagrammverhalten.md) | NTP-Netztransport, Delay und Jitter. |
| Voraussetzung | [KB-0058](10-dns-aufloesung-und-caches.md) | Zeitquellenauflösung und Logs. |
| Voraussetzung | [KB-0059](11-dhcp-und-adressvergabe.md) | Client-Bootstrap und Konfigurationspfad. |
| Weiterführung | KB-0061 VLAN und Broadcast-Segmentierung | Zeitquellen- und Clientnetzgrenzen. |
| Weiterführung | KB-0151 Distributed Systems Zeit und Konsistenz | Logische Zeit, Kausalität und verteilte Semantik. |
| Weiterführung | KB-0562 Enterprise DNS und Namensräume | Zeitquellen- und Namensraum-Ownership. |
| Nachweis | KB-0720 Portfolioevidenz und Reifemodelle | Nachweisbare Zeitarchitektur und Labs. |

Primärquellen, abgerufen und inhaltlich geprüft am **2026-09-16**:

- [RFC 5905 – Network Time Protocol Version 4](https://www.rfc-editor.org/rfc/rfc5905)
- [RFC 8633 – Network Time Protocol Best Current Practices](https://www.rfc-editor.org/rfc/rfc8633)
- [RFC 7384 – Security Requirements of Time Protocols](https://www.rfc-editor.org/rfc/rfc7384)
- [RFC 8915 – Network Time Security for NTP](https://www.rfc-editor.org/rfc/rfc8915)
- [RFC 7822 – NTPv4 Extension Fields](https://www.rfc-editor.org/rfc/rfc7822)
- [clock_gettime(2) – Linux clock APIs](https://man7.org/linux/man-pages/man2/clock_gettime.2.html)

## Bonus: New Tech and Innovations

NTS erlaubt für unterstützte NTP-Clients und -Server eine modernere, kryptografisch abgesicherte Zeitbeschaffung. Die Einführung ist ein Security- und Betriebsprojekt: TLS-/Cookie-/Schlüsselpfad, Clientkompatibilität, Source-Auswahl, Fehlermeldung und Fallback müssen gemessen werden. Ein unbemerkter Rückfall auf eine ungesicherte Quelle kann den Sicherheitsnutzen aufheben.

PTP, Hardware-Timestamping und lokale Referenzuhren können deutlich präzisere Zeit liefern als ein allgemeiner NTP-Pfad. Sie erhöhen aber Abhängigkeit von NICs, Switches, Boundary-/Transparent-Clocks, physischer Referenz und Betriebswissen. Sie gehören nur in Serviceklassen mit einem belegten Präzisionsbedarf und einem vollständigen Fehlerbudget.

Ein Pilot akzeptiert eine neue Zeitfunktion erst, wenn Genauigkeit, Unsicherheit, Fehlerdomänen, Step-/Slew-Folgen, Security, Privacy, Observability und Rückbau für alle betroffenen Workloads nachgewiesen sind.

