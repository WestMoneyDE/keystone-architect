---
{"id": "KB-0058", "title": "DNS-Auflösung und Caches", "domain": "03", "sequence": 10, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Zeitachse", "Lastanalyse"], "needed_for": "both"}, {"id": "KB-0049", "concepts": ["Namensauflösung", "Transport-Schicht", "Endpunktmodell"], "needed_for": "both"}, {"id": "KB-0056", "concepts": ["TCP", "Timeouts", "Verbindungsdiagnose"], "needed_for": "understanding"}, {"id": "KB-0057", "concepts": ["UDP", "Datagrammverlust", "Fallback"], "needed_for": "both"}], "related": ["KB-0055", "KB-0059", "KB-0060", "KB-0061", "KB-0562", "KB-0720"], "applies": ["KB-0059", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Das Lab modelliert positive und negative Caches, TTL-Ablauf, Split-DNS-Kontexte und Stale-Antworten mit einer lokalen Python-Datenstruktur ohne Netzwerkzugriff.", "rationale": "Es wird kein echter Name abgefragt, keine Zone geändert, kein Resolver konfiguriert und keine Cloud-, Netzwerk- oder Produktionsressource verwendet."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein Namensdienstvertrag definiert Zonenautorität, Client-Kontexte, Record-Semantik, TTL- und Änderungsbudget, Resolverpfad, DNSSEC-/Privacy-Policy, Monitoring und Rollback.", "rationale": "Eine DNS-Antwort wird getrennt von Endpunktgesundheit, Routing und Applikationsfreigabe bewertet."}, "STAFF-TARGET": {"active": true, "scope": "Teams instrumentieren QNAME/QTYPE/RCODE, Cachequelle, verbleibende TTL, Resolver, Transport, Validierungsstatus und Endpunktprobe und testen Änderungen über alle Client-Kontexte.", "rationale": "Sie unterscheiden negative Caches, Split-DNS, Delegations-/Autorisierungsprobleme und UDP/TCP-/Netzprobleme anhand einer reproduzierbaren Zeitachse."}, "CHIEF-TARGET": {"active": true, "scope": "Die Organisation steuert Namensräume, Ownership, externe und interne Auflösung, Ausfallgrenzen, Privacy, DNSSEC, Change-Fenster, Provider- und Kostenrisiken als gemeinsame Plattformentscheidung.", "rationale": "DNS ist ein geteilter Kontroll- und Datenpfad; unklare Zuständigkeit oder ungemessene Cache-Propagation erzeugen organisationsweite Ausfälle."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Autoritative Serverimplementierung, DNSSEC-Key-Lifecycle, Anycast, DNS Cookies, Response Rate Limiting, Resolver-Hardening, EDNS(0), DoQ, tiefes Packet-Debugging und Registry-Delegation sind Spezialistentiefe.", "rationale": "Die Zielrollen müssen Schutz- und Betriebsgrenzen wirksam entscheiden und prüfen können; die detaillierte Protokoll- und Flottenimplementierung kann bei DNS-/Netzwerkspezialisten liegen."}}, "lab_validation": [{"lab_id": "KB-0058-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox ohne Netzwerkzugriff", "evidence": "Positive und negative Cache-Einträge, TTL-Ablauf, kontextabhängige private/öffentliche Antworten und kontrollierte Stale-Nutzung als deterministische Fallarbeit geprüft.", "limitations": "Nicht ausgeführt; keine DNS-Anfrage, kein Resolver, keine Zone, kein Record, kein Paketmitschnitt, kein Firewall-, Cloud- oder Produktionssystem wurde verwendet oder verändert."}]}
---
# DNS-Auflösung und Caches

> **Ziel:** DNS beantwortet eine präzise Datenfrage zu einem Namen zu einem Zeitpunkt aus einer bestimmten Sicht. Eine erfolgreiche Antwort beweist weder, dass alle Clients dieselbe Antwort sehen, noch dass die Zieladresse erreichbar oder der Dienst gesund ist. Entwerfe, ändere und diagnostiziere DNS deshalb als verteilten, gecachten Datenpfad.

## Purpose, Definition und Scope

Das Domain Name System (DNS) ist eine hierarchische, verteilte Datenbank für benannte Ressourcen. Ein Client stellt typischerweise eine Frage wie `api.example.internal. IN A`; ein Resolver liefert eine Antwort aus seinem Cache oder beschafft sie über Delegationen von autoritativen Servern. Resource Records (RRs) wie `A`, `AAAA`, `CNAME`, `NS`, `SOA`, `MX`, `TXT`, `SRV` und `PTR` beschreiben unterschiedliche Daten zu einem Namen.

Dieses Kapitel erklärt Rekursion, autoritative Antworten, positive und negative Caches, TTL, Split DNS und eine belastbare Diagnose inkonsistenter Antworten. Es behandelt den DNS-Pfad bis zu einer Antwort, nicht die Betriebsdetails eines bestimmten Produkts.

Nicht im Scope sind DHCP, NTP, detaillierte DNSSEC-Key-Zeremonien, Anycast-Engineering und konkrete Cloud-Provider-Konfigurationen. Sie werden in späteren kanonischen Artikeln vertieft.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | DNS ist eine verteilte, nach Record-Typ abgefragte Datenbank mit Delegationen, autoritativen Zonen und lokalem Caching. |
| HANDS-ON-TARGET | Das Lab modelliert Antworten und Cache-TTLs offline; es führt keine Netzabfrage aus. |
| ARCHITECT-TARGET | Namensraum, Antworten, TTLs, Client-Sichten, Ownership, Security, Beobachtung und Rückbau erhalten einen überprüfbaren Vertrag. |
| STAFF/PRINCIPAL | Triage trennt Antwortdaten und Cachezustand von Transport, Routing, TLS und Dienstgesundheit. |
| CHIEF | DNS wird als gemeinsame Plattform mit klaren Zuständigkeiten, Risiko-, Privacy- und Kostensteuerung geführt. |

## Mental Model: Verteilte Daten mit Ablaufzeit, keine globale Wahrheit

DNS ist kein Telefonbuch, das atomar umgeschrieben wird. Es ist eine verteilte Datenbank mit mehreren Ebenen von Kopien. Der Inhaber einer Zone veröffentlicht autoritative Daten; rekursive Resolver und Clients dürfen sie für eine begrenzte TTL wiederverwenden. Deshalb kann ein Name gleichzeitig aus mehreren legitimen Blickwinkeln unterschiedliche Antworten liefern.

```text
Anwendung
  -> Stub Resolver / Betriebssystemcache
  -> lokaler oder zentraler rekursiver Resolver
       -> Cache-Treffer
       -> oder Delegationspfad:
          Root -> TLD -> autoritativer Server für Zone
  -> DNS-Antwort mit RCODE, RRset, TTL und ggf. Sicherheitsstatus
  -> Anwendung verbindet sich separat mit Zieladresse und Dienst
```

Drei Aussagen müssen getrennt bleiben:

1. **Namensdaten:** Welches RRset antwortet dieser Resolver für QNAME, QTYPE und Klasse?
2. **Netzpfad:** Erreichen Client und Resolver einander sowie Resolver und autoritative Server?
3. **Dienstpfad:** Akzeptiert ein Ziel hinter der beantworteten Adresse eine Verbindung und erfüllt es die erwartete Anwendungsschnittstelle?

`NOERROR` für einen `A`-Record ist nur Aussage 1. Ein HTTPS-Aufruf kann trotz korrekter DNS-Antwort an Route, Firewall, TLS, Load Balancer, Zertifikat, Health Check oder Anwendung scheitern.

## Prerequisites und Dependencies

| ID | Art | Wofür nötig |
|---|---|---|
| [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Verständnis und Lab | Hypothesen, Korrelation und zeitbasierte Fehlersuche. |
| [KB-0049](01-osi-und-tcp-ip-als-analysemodelle.md) | Verständnis und Lab | Trennung von Anwendung, Namensauflösung, Transport und IP-Pfad. |
| [KB-0056](08-tcp-verbindungen-und-ueberlastkontrolle.md) | Verständnis | DNS-Transport und die separate TCP-/Dienstprobe. |
| [KB-0057](09-udp-und-datagrammverhalten.md) | Verständnis und Lab | Datagramm-Timeouts, Verlust und Fallback als mögliche Ursachen. |

## Core Concepts

### Namespace, Zone und Autorität

Der DNS-Namensraum ist ein Baum. Eine **Zone** ist ein administrierter Ausschnitt dieses Baums; sie muss nicht mit jeder organisatorischen oder technischen Grenze übereinstimmen. Autoritative Server halten die Zonendaten und beantworten Fragen innerhalb ihrer Autorität. `NS`-Records und Delegationen verweisen auf die Server, die für untergeordnete Zonen zuständig sind. Ein `SOA`-Record beschreibt die Zone und trägt unter anderem Felder für Zonenbetrieb.

Ein autoritativer Server kann eine Antwort aus eigener Zonendatenquelle liefern. Ein rekursiver Resolver ist dagegen der Beschaffer und Cache für seine Clients. Die beiden Rollen können im selben Produkt oder Prozess vorkommen, müssen aber in Architektur und Betrieb getrennt gedacht werden.

| Begriff | Präzise Bedeutung | Häufiger Irrtum |
|---|---|---|
| Name | Label-Pfad im DNS-Baum, z. B. `api.example.com.` | Ein Name ist keine Adresse und keine Service-Garantie. |
| Zone | administrierte Menge autoritativer Daten | Eine Zone ist nicht automatisch eine Firma, ein Cluster oder ein Netzwerk. |
| Delegation | Verweis auf zuständige Server für einen Teilbaum | Der Parent hält nicht alle Daten des Child. |
| Autoritative Antwort | Antwort aus Daten, für die der Server zuständig ist | Autoritativ heißt nicht „von jedem Client sichtbar“. |
| Rekursion | Server verfolgt weitere DNS-Schritte im Auftrag des Clients | Rekursion heißt nicht, dass der Client die gesamte Internet-Hierarchie kontaktiert. |
| Cache | temporäre Kopie mit Ablaufzeit | Cache ist ein beabsichtigtes Konsistenz- und Verfügbarkeitsmerkmal, kein Fehler. |

### Resolver, Rekursion und Iteration

Ein Stub Resolver in Betriebssystem oder Laufzeitbibliothek fragt meist einen konfigurierten rekursiven Resolver. Dieser kann aus Cache antworten oder den delegierten Pfad verfolgen. In einer iterativen Folge erhält der Resolver Verweise auf nächste zuständige Server, bis er eine autoritative Antwort erlangt.

```text
Client asks recursive resolver: api.example.com A
resolver cache miss
  root referral         -> servers for .com
  .com referral         -> servers for example.com
  authoritative answer  -> A 203.0.113.42 TTL 300
resolver returns answer and caches it
```

Dieses Bild ist ein Analysemodell, keine Zusage über jede Paketfolge. Eine Unternehmensumgebung kann interne Zonen lokal autoritativ bedienen, externe Queries über einen zentralen Resolver steuern und mehrere Caches hintereinander haben. Der einzelne Client sieht deshalb nur seinen konfigurierten Pfad.

### Fragen, Antworten und Resource Records

Eine DNS-Frage besteht mindestens aus QNAME, QTYPE und Klasse. In Internetbetrieb ist die Klasse typischerweise `IN`. Relevant für Service- und Plattformdesign sind:

| RR-Typ | Zweck | Architekturhinweis |
|---|---|---|
| `A` | IPv4-Adresse | Mehrere Werte können Traffic verteilen, sind aber kein Gesundheitsprotokoll. |
| `AAAA` | IPv6-Adresse | Dual Stack muss mit Route, Firewall und Dienstfähigkeit zusammen bewertet werden. |
| `CNAME` | Alias auf einen anderen Namen | Der Resolver folgt dem Alias; die Zielbeziehung benötigt klare Ownership und TTL-Planung. |
| `NS` | autoritative Server einer Zone | Delegation und Glue müssen als zusammenhängende Änderung behandelt werden. |
| `SOA` | Zonendaten und negative-Cache-Parameter | Für NODATA/NXDOMAIN und Zonenbetrieb bedeutsam. |
| `MX` | Mail-Zustellung | Kein generischer Service-Discovery-Ersatz. |
| `TXT` | textuelle Daten nach Anwendungsvereinbarung | Größe, Geheimnisse, Ownership und Policy streng begrenzen. |
| `SRV` | Service, Port, Priorität und Gewichtung | Sinnvoll nur, wenn Client und Produktvertrag es auswerten. |
| `PTR` | Reverse Mapping | Identität, Autorisierung und Dienstgesundheit nicht daraus ableiten. |

Ein RRset ist die Menge gleichartiger Records zu Name, Klasse und Typ. Änderung und Cache-Analyse beziehen sich sinnvollerweise auf genau dieses RRset statt auf den unscharfen Satz „DNS wurde geändert“.

### Antwortcodes: Existenz, Datenlosigkeit und Fehler

`RCODE` trennt wesentlich verschiedene Ursachen. Mindestens diese Fälle gehören in jedes Incident-Runbook:

| Ergebnis | Bedeutung | Nächste Frage |
|---|---|---|
| `NOERROR` mit passendem RRset | Antwortdaten vorhanden | Stimmen Adresse, TTL, Kontext und Dienstprobe? |
| `NOERROR` ohne gefragtes RRset | Name existiert, dieser Typ hat keine Daten; oft NODATA | Wurde der richtige QTYPE abgefragt? Existiert nur `AAAA` oder nur `A`? |
| `NXDOMAIN` | Der abgefragte Name existiert nach Sicht des Servers nicht | Welche Zone, welcher Resolver, welcher Cache und welcher Zeitpunkt? |
| `SERVFAIL` | Server konnte Anfrage nicht erfolgreich verarbeiten | Upstream, Validierung, Delegation, Überlast oder lokale Policy prüfen. |
| `REFUSED` | Server verweigert Dienst | Clientnetz, Rekursions-ACL, Split-DNS-Policy und Produktgrenze prüfen. |
| Timeout | Keine verwertbare Antwort im erwarteten Fenster | Nicht sofort „DNS kaputt“ schließen: Transport, Rate Limit, Firewall, Resolverlast und Fallback prüfen. |

Ein Timeout ist keine negative DNS-Antwort. `NXDOMAIN` ist keine Netzwerkunterbrechung. `NOERROR` für den Namen ist keine Bestätigung, dass der angefragte Record-Typ existiert.

## Architecture und Data Flow

### Standardpfad mit Cache-Ebenen

```text
[Application]
    | system call / library
[Stub cache or node-local cache]
    | policy, search domains, configured resolver
[Recursive resolver fleet]
    | cache hit: return with remaining TTL
    | cache miss: iterative resolution
[Authoritative zone servers]
    | zone data / signing / publication
[Returned RRset]
    | address selection, connection, TLS, application request
[Service endpoint]
```

Jede Kante hat eigene Fehler- und Verantwortungsgrenzen. Es genügt nicht, in einem Incident „`dig` funktioniert“ zu sagen, wenn damit weder Clientkontext, Resolveradresse, QTYPE, Zeit, Caches noch der anschließende Diensttest festgehalten werden.

### Veränderungswelle für einen Service-Endpunkt

Eine kontrollierte Migration benötigt einen zeitlichen Vertrag. Beispiel: `api.example.com` soll von einem alten zu einem neuen Endpunkt wechseln.

1. **Vorbereiten:** Zielendpunkt, Zertifikat, Routing, Security und Monitoring separat gegen einen kontrollierten Namen prüfen.
2. **TTL-Plan festlegen:** Die aktuell veröffentlichte TTL und alle bekannten Cache-Ebenen bestimmen. Eine kürzere TTL wirkt erst nach Ablauf bereits gespeicherter Einträge.
3. **Daten veröffentlichen:** Je nach Clientvertrag aliasieren, mehrere Adressen anbieten oder gestuft umschalten. DNS allein ersetzt keinen belastbaren Traffic-Shift- und Health-Mechanismus.
4. **Kontexte beobachten:** Öffentlicher Resolver, Unternehmensresolver, Private Resolver, node-lokaler Cache und relevante Regionen müssen getrennte Messpunkte liefern.
5. **Altes Ziel zurückhalten:** Erst entfernen, wenn das vereinbarte Cache-Fenster, synthetische Prüfungen und reale Fehlerindikatoren den Rückbau erlauben.
6. **Rollback erhalten:** DNS-Rollback kann durch bereits gecachte neue Daten verzögert wirken; der Dienstpfad benötigt deshalb ebenfalls eine Rückfallstrategie.

Die TTL ist kein sofortiger globaler Schalter. Sie ist eine Obergrenze für die Wiederverwendung einer Antwort durch einen regelkonformen Cache ab dessen Empfang. Sie ist weder eine weltweite Propagations-SLA noch ein Fernlöschbefehl für fremde Caches.

## Caches, TTL und negative Antworten

### Positive Cache-Antworten

Ein Resolver speichert eine positive Antwort bis zur TTL. Bei erneutem Abruf sinkt die verbleibende TTL. Unterschiedliche Resolver können eine Änderung zu unterschiedlichen Zeiten sehen, weil sie den Eintrag zu unterschiedlichen Zeitpunkten erhalten haben.

```text
12:00 resolver A caches A=old, TTL 300
12:02 authoritative data changes to A=new
12:03 resolver A may still return old, remaining TTL about 120
12:04 resolver B has a cache miss and may obtain new
```

Daraus folgt: Zwei korrekte Tests können unterschiedliche Antworten erhalten. Die Diagnose muss Cachequelle und Zeitachse aufnehmen, statt eine Antwort pauschal als „falsch“ zu deklarieren.

### Negative Caching: NXDOMAIN und NODATA

RFC 2308 beschreibt negative Cache-Antworten. Ein Resolver darf nicht nur existierende Daten, sondern unter definierten Bedingungen auch Nicht-Existenz oder fehlende Daten eines Typs speichern. Für Betrieb und Rollout ist das entscheidend:

- Ein vorzeitig abgefragter, noch nicht veröffentlichter Name kann `NXDOMAIN` im Resolver cachebar machen.
- Ein Name kann existieren, aber für `AAAA` keine Daten haben; das ist nicht gleich `NXDOMAIN`.
- Negative Caches richten sich nach autoritativen Angaben aus dem `SOA`-Kontext; Produktteams dürfen nicht annehmen, dass ein eben ergänzter Record sofort überall sichtbar ist.
- Eine fehlerhafte negative Antwort muss nach Quelle, RCODE, SOA, TTL, Resolver und Zeitpunkt untersucht werden.

| Fall | Korrekte Deutung | Riskanter Kurzschluss |
|---|---|---|
| `NXDOMAIN` für neuen Namen | Name ist in dieser Resolver-/Zeit-Sicht negativ beantwortet | „Die Zone ist sicher nicht veröffentlicht.“ |
| NODATA für `AAAA` | Name kann existieren, angefragter Typ fehlt | „DNS kann den Namen nicht finden.“ |
| alter `A`-Wert | positiver Cache kann noch laufen | „Der Autoritative Server liefert zwingend den alten Wert.“ |
| `SERVFAIL` | Auflösung konnte nicht erfolgreich abgeschlossen werden | „Der Name existiert nicht.“ |

### Serving Stale

RFC 8767 beschreibt ein Verfahren, bei dem ein Resolver abgelaufene Cache-Daten begrenzt weitergeben kann, um Verfügbarkeit während eines Upstream- oder Autoritätsausfalls zu erhöhen. Das kann für stabile Adressen sinnvoll sein, erhöht aber das Risiko, bereits zurückgezogene oder geänderte Daten weiter zu verwenden.

Eine Stale-Policy braucht explizite Grenzen:

| Entscheidung | Nutzen | Risiko | Nachweis |
|---|---|---|---|
| Stale für kurzlebige Service-Metadaten verhindern | Änderungen wirken früher | Resolverausfall trifft Nutzer stärker | RCODE-/Timeout-/Freshness-Metriken. |
| Stale für stabile Infrastrukturadressen begrenzt erlauben | höhere Verfügbarkeit bei Autoritätsausfall | Rückbau und Incident-Mitigation verzögern sich | max. Stale-Alter, Antwortmarkierung, Drill. |
| Stale pauschal aktivieren | einfache Konfiguration | unvorhersehbare Datenfrische und Security-Folgen | nicht akzeptabel ohne Klassifikation und Review. |

## Split DNS und kontextabhängige Wahrheit

Split DNS bedeutet, dass derselbe Name je nach Abfragekontext unterschiedliche Daten oder Policies liefert. Häufige Kontexte sind internes Netz, VPN, Standort, Private Cloud, öffentliche Resolver, Geräteverwaltung oder getrennte Umgebungen. Es ist ein bewusstes Architekturmittel, aber kein Ersatz für Ownership, Dokumentation und Tests.

```text
query: db.corp.example A

employee on managed network -> 10.20.4.15
employee via approved VPN    -> 10.20.4.15
public internet resolver     -> NXDOMAIN or no public record
unmanaged client             -> REFUSED or different public service
```

Die Antwort hängt mindestens von QNAME/QTYPE, Resolver, Clientquelle, Resolverpolicy, Zone/View, Zeit und Cache ab. Ein Test, der diese Dimensionen nicht dokumentiert, kann eine Split-DNS-Fehlkonfiguration nicht von einem echten Netzproblem trennen.

### Diagnosematrix für inkonsistente Antworten

| Beobachtung | Wahrscheinliche Kategorie | Prüfschritte in Reihenfolge |
|---|---|---|
| Intern Antwort, extern NXDOMAIN | erwartetes oder fehlerhaftes Split DNS | QNAME/QTYPE, zuständiger Resolver, View-/Policy-Entscheidung, autoritative interne und externe Zone vergleichen. |
| Zwei Resolver liefern alt und neu | Cache-/TTL-Differenz | Empfangszeiten, verbleibende TTL, autoritative Daten, negative/positive Cache-Einträge vergleichen. |
| Resolver antwortet, Service scheitert | Nicht DNS oder unvollständige DNS-Änderung | Adresse, Route, TCP/QUIC/TLS, Load Balancer, Zertifikat, Health und Anwendung prüfen. |
| Nur einzelne Clients Timeout | lokaler Pfad, Resolver-ACL, UDP-/TCP-/Firewall- oder Lastproblem | Clientresolver, Transport, Retry/Fallback, Paket-/Resolvertelemetrie und Policy prüfen. |
| `SERVFAIL` nach Zonenänderung | Delegation, Validierung, Autorität oder Resolverproblem | RCODE-Zeitreihe, SOA/NS/Delegation, DNSSEC-Status und authoritative Logs prüfen. |
| Neuer Name bleibt negativ | NXDOMAIN/NODATA-Cache oder falscher QTYPE | negative TTL, SOA, exakt angefragten Typ und Cachequelle prüfen. |

## Protocols, Standards und aktuelle Technologien

| Standard/Technologie | Relevanz | Architekturentscheidung |
|---|---|---|
| RFC 1034/1035 | Namensraum, Resolver, Zonen, Nachrichtenformat | Grundlage für Begriffe und Verantwortungsgrenzen. |
| RFC 2308 | negative Caches | Neue Namen und fehlende Record-Typen mit TTL-/Rollbackplan veröffentlichen. |
| RFC 4033 | DNSSEC-Einführung und Anforderungen | Authentizität und Datenintegrität bewerten; DNSSEC bietet keine Vertraulichkeit. |
| RFC 8767 | Serving Stale | Frische gegen Verfügbarkeit pro Namensklasse abwägen. |
| RFC 9156 | QNAME Minimisation | Resolver-Privacy als Policy und Kompatibilitätsfrage führen. |
| RFC 9460 | SVCB/HTTPS Records | Moderne Service-Bindungen erst einsetzen, wenn Clientunterstützung, Fallback und Telemetrie geprüft sind. |
| DoT, DoH, DoQ | verschlüsselte Resolver-Transporte | Privacy, Unternehmenspolicy, Sichtbarkeit, egress routing und Incidentfähigkeit gemeinsam gestalten. |

**Stand 2026-09-16:** SVCB und HTTPS Resource Records sind mit RFC 9460 standardisiert. Ihre effektive Wirkung hängt jedoch von Client, Resolver, CDN/Edge, Netzwerkpolicy und Fallback ab. Kein Architekturpapier darf aus der Standardisierung eine universelle Interoperabilitätszusage ableiten.

## Konfiguration und Implementierung

### Zonen als überprüfbare Daten

Zonendaten gehören in einen kontrollierten Änderungsprozess: eindeutige Owner, Review, maschinenlesbare Validierung, Trennung von Entwicklungs-/Test-/Produktionszonen, nachvollziehbare Freigabe, Zeitplan und Rollback. Das konkrete Tool ist zweitrangig; der Vertrag verhindert, dass ein einzelner manueller Record gleichzeitig alle Konsumenten unbemerkt verändert.

Ein minimaler Änderungsdatensatz beantwortet:

- Welches **RRset** mit welchem Owner und welcher Zone wird geändert?
- Welche Clientkontexte sollen alt, neu, gar keine oder eine verweigerte Antwort sehen?
- Welche TTL und negative Cache-Dauer gelten vor und nach der Änderung?
- Welche Zielendpunkte und welche Nicht-DNS-Checks bestätigen Bereitschaft?
- Welche Resolver, Regionen und Views werden vor, während und nach der Änderung gemessen?
- Wie sieht Rückbau aus, wenn sich neue Daten bereits in fremden Caches befinden?

### Sichere Record-Entscheidungen

| Muster | Geeignet, wenn | Schutzbedingung |
|---|---|---|
| Direkter `A`/`AAAA`-Record | Adresse und Ownership stabil sind | Dual-Stack, Netzpfad und Servicehealth getrennt testen. |
| `CNAME` auf zentralen Edge-Namen | Alias- und Zielownership geklärt sind | Alias-Ketten klein halten, TTLs und Ausfallkopplung verstehen. |
| Interner Name nur im privaten View | Zugriff bewusst kontextgebunden ist | externe Veröffentlichung, Suchdomänen und Datenleckage prüfen. |
| Mehrere Adressen | Clientstrategie und Endpoint-Kapazität es tragen | kein impliziter Health- oder gewichteter Traffic-Shift ohne getesteten Clientvertrag. |
| kurzer TTL vor Migration | Rollback-/Switch-Fenster dies erfordert | TTL früh genug absenken; Resolverlast, Kosten und Stale-Policy messen. |

Keine technische Konfiguration legitimiert das Speichern von Geheimnissen in frei sichtbaren `TXT`-Records. Ebenso wenig ist ein DNS-Name ein Autorisierungsnachweis: Zugriff erfordert weiterhin Netzwerk-, Identitäts- und Dienstkontrollen.

## Scalability und Performance

DNS skaliert durch Delegation, Redundanz und Caching. Das zentrale Performanceziel ist nicht nur niedrige Median-Latenz, sondern vorhersagbares Verhalten bei Cache Miss, Upstream-Störung, Traffic-Spike, zufälligen Namen und Änderungen.

Zu beobachtende Kennzahlen:

| Kennzahl | Aussage | Fehlinterpretation vermeiden |
|---|---|---|
| Cache-Hit-Rate nach RRset/Kontext | wie viel Last der Cache absorbiert | hohe Hit-Rate kann auch veraltete Daten länger sichtbar machen. |
| p50/p95/p99 Resolution Latency | Nutzererlebnis auf Resolverebene | separat für hit, miss, TCP/UDP/verschlüsselte Transporte auswerten. |
| QPS und Unique QNAME Rate | Last und mögliche Random-Subdomain-Angriffe | QPS allein sagt nichts über Cache-Effekt oder Clientfehler. |
| RCODE-Verteilung | NXDOMAIN, SERVFAIL, REFUSED und Fehlertrends | `NOERROR` misst keine Servicegesundheit. |
| Upstream-/Authority-Latenz | Abhängigkeit bei Misses | am Resolverpfad und nicht nur am Client messen. |
| Stale-Antworten und Alter | Verfügbarkeits-/Frischekompromiss | Stale nicht als normale Cache-Hit-Rate verstecken. |
| DNSSEC-Validation Failures | Validierungs- oder Delegationsprobleme | kein Rückschluss ohne Sicht auf Chain und Clientpolicy. |

Ein großer TTL-Wert spart Resolverlast und kann Kosten senken, verlängert aber Reaktions- und Rollbackzeit. Ein kleiner Wert beschleunigt die Übernahme neuer Daten, erhöht aber Miss-Last, Abhängigkeit von Autoritäten und potenziell Providerkosten. Die richtige Zahl ist eine nach Serviceklasse geprüfte Entscheidung, keine globale Konstante.

## Reliability und Failure Modes

| Fehlerbild | Mechanismus | Erkennung | Sofortmaßnahme | Nachhaltige Verbesserung |
|---|---|---|---|---|
| alte Adresse nach Migration | laufender positiver Cache | TTL, Resolver, Zeitpunkt und Adresse protokollieren | altes Ziel kontrolliert verfügbar halten | TTL-Runbook, Cache-Fenster und gestufter Rückbau. |
| neuer Name nicht sichtbar | negativer Cache oder falscher Record-Typ | NXDOMAIN/NODATA, SOA, negative TTL | nicht blind erneut ändern; Kontext klären | Prepublication und negative-Cache-Test. |
| zentrale Resolverflotte gestört | Cache Misses können nicht aufgelöst werden | Latenz, Timeout, SERVFAIL, upstream errors | redundanten Resolverpfad nach Policy aktivieren | Kapazität, isolierte Fehlerdomänen, Stale-Policy und Drills. |
| autoritative Zone nicht erreichbar | Delegations-/Authority-Pfad bricht | cache miss failures, NS/SOA-Checks | Provider-/Zonenincident behandeln | multiple Autoritäten, kontrollierte Delegationsänderungen. |
| Split-DNS-Leak oder Fehlroute | falsche View/Resolverwahl | Kontextvergleich, Privacy-Log | Zugriff und Resolverpolicy begrenzen | eindeutige Namensraum- und Client-Policy. |
| DNSSEC-/Delegationsfehler | Daten werden nicht validierbar | validation/SERVFAIL-Signale | Änderungsfenster stoppen, Chain prüfen | Key-/DS-/Rollbackprozedur und unabhängige Checks. |
| DNS-Amplification oder zufällige Namen | Miss-Last und Missbrauch | Unique-QNAME, Response-Größen, Quelle | Rate-/Abuse-Controls nach Policy | Response minimieren, Monitoring und Capacity-Tests. |

### Transportgrenzen

DNS wird häufig über UDP abgefragt, kann aber je nach Antwortgröße, Truncation, Policy oder Schutzmechanismus TCP oder weitere Transporte benötigen. Ein Diagnosepfad darf deshalb nie nur einen UDP-Paketmitschnitt oder nur einen Clienttest zur alleinigen Wahrheit erklären. Details zu UDP-Fehlern, MTU und Transportsemantik stehen in [KB-0057](09-udp-und-datagrammverhalten.md); verlässliche TCP-Dienstproben in [KB-0056](08-tcp-verbindungen-und-ueberlastkontrolle.md).

## Security, Governance und Compliance

### Sicherheitsmodell

DNSSEC kann die Authentizität und Integrität bestimmter DNS-Daten entlang einer Vertrauenskette absichern; es verschlüsselt weder Fragen noch Antworten und ersetzt keine Autorisierung. Verschlüsselte Resolvertransporte verbessern Vertraulichkeit auf einzelnen Transportstrecken, können aber Unternehmenssichtbarkeit, Routing, Content-Policy, egress-Kontrolle und Incidentdiagnose verändern.

| Schutzfrage | Mindestentscheidung |
|---|---|
| Wer darf Zonen und Records ändern? | Least Privilege, getrennte Rollen, Review, auditierbarer Change, zeitlich begrenzte Rechte. |
| Welche Namen dürfen extern sichtbar sein? | Datenklassifikation, private/public Views, automatische Leakage-Prüfung und Eigentümer. |
| Wie werden Antworten auf Herkunft geprüft? | DNSSEC-Policy, Validierungsbeobachtung und dokumentierte Ausnahmebehandlung. |
| Wie wird Resolverprivacy behandelt? | zugelassene Resolver, Transportpolicy, Logging-Minimierung, Retention und rechtliche Grundlage. |
| Wie wird Missbrauch begrenzt? | Rekursion nur für berechtigte Clients, Rate-/Abuse-Controls, Kapazitäts- und Incidentplan. |

DNS-Logs können interne Namen, Nutzerkontexte, Gerätebeziehungen und Produktnutzung offenlegen. Retention, Zugriff, Pseudonymisierung, Zweckbindung und Incidentzugriff müssen daher mit Datenschutz-, Security- und Betriebsverantwortlichen vereinbart werden. Das Kapitel bietet keine Rechtsberatung; lokale und sektorspezifische Anforderungen benötigen qualifizierte Prüfung.

### Governance und Ownership

Für jede produktive Zone ist mindestens festzulegen:

- fachlicher Owner des Namensraums;
- technischer Owner der autoritativen Daten und der Resolverpolicy;
- Change- und Notfallfreigabe;
- Serviceklasse mit TTL-/Stale-/Verfügbarkeitszielen;
- geprüfte Clientkontexte und externe Sichtbarkeit;
- Aufbewahrung und Zugriff für DNS-Telemetrie;
- Provider-Exit, Export und Wiederherstellungsverfahren.

## Observability und Troubleshooting

### Ereignisschema

Ein auflösbarer DNS-Incident benötigt strukturierte Ereignisse. Eine Abfrage oder synthetische Messung sollte mindestens erfassen:

```text
timestamp, environment, client network context, resolver identity,
qname, qtype, qclass, transport, cache outcome, remaining ttl,
rcode, answer rrset digest, authority/soa context,
dnssec validation state, latency, retry count,
selected endpoint, connection result, request correlation id
```

Nicht jede Dimension gehört in jedes dauerhafte Log. Privacy und Datenminimierung bestimmen, welche Felder gehasht, gekürzt, aggregiert oder nur während eines freigegebenen Incidents erhoben werden.

### Triage: Antwortinkonsistenz systematisch prüfen

1. **Frage fixieren:** Vollqualifizierten Namen, QTYPE, Zeit, Clientnetz und erwarteten Service festhalten. Suchdomänen und implizite Suffixe ausschließen.
2. **Resolver fixieren:** Tatsächlich verwendeten Stub-/Node-/zentralen Resolver ermitteln. Ein externer Testresolver ersetzt ihn nicht.
3. **Antwort beschreiben:** RCODE, RRset, TTL, CNAME-Kette, SOA/Authority und Validierungsstatus speichern.
4. **Cache-Hypothese prüfen:** Aus verschiedenen Resolvern kontrolliert messen und verbleibende TTL gegen Änderungszeitlinie legen.
5. **Autorität prüfen:** Zuständige Zone, Delegation und autoritative Antwort von Cache-Daten unterscheiden.
6. **Split-DNS prüfen:** Identische Frage aus vorgesehenen Netzwerk-/VPN-/Region-/Identity-Kontexten wiederholen.
7. **Dienst getrennt prüfen:** Gegen die erhaltene Adresse die erwartete Transport-, TLS- und Anwendungskontrolle durchführen.
8. **Änderung begrenzen:** Erst nach belegter Ursache an Zone, Resolverpolicy oder Endpunkt ändern; keine Serienänderungen auf Basis eines einzelnen Tests.

| Symptom | Minimaler Beleg für Hypothese | Kein ausreichender Beleg |
|---|---|---|
| Cache hält alten Wert | Resolveridentität, alter/new RRset, verbleibende TTL, Zeitachse | ein Screenshot einer einzigen Antwort. |
| Split-DNS fehlerhaft | gleiche Frage, definierte Kontexte, dokumentierter erwarteter View | Vergleich interner und öffentlicher Namen ohne Resolvernachweis. |
| DNS ist nicht die Ursache | DNS-Antwort und nachfolgender Endpunkt-/TLS-/Anwendungsfehler korreliert | „Der Browser lädt nicht.“ |
| Resolver überlastet | p99, Timeout, Queue/upstream trend, Cache miss rate | globale Anfragezahl allein. |

## Cost und FinOps

DNS verursacht direkte und indirekte Kosten: autoritative Query- und Zonenpreise, Resolverinfrastruktur, egress beziehungsweise interregionale Pfade, DDoS-/Abuse-Schutz, Logging/SIEM-Speicher, Testumgebungen und Incidentzeit. Caching senkt häufig Querylast und Latenz, aber eine zu lange TTL kann Migrationen verlängern und dadurch höhere Produktions- oder Incidentkosten verursachen.

FinOps-Entscheidungen sollten je Serviceklasse auf Daten beruhen:

- Queryvolumen nach öffentlich, privat, Region und Cache Miss;
- Kosten pro Resolvertransport und autoritativer Anfrage;
- Nutzen einer weiteren Resolver-/Autoritätsfehlerdomäne;
- Loggingkosten gegenüber Security- und Diagnosewert;
- Kosten eines langsamen Rollbacks gegenüber Kosten kürzerer TTLs;
- Providerabhängigkeit, Datenexport und getestete Wiederherstellung.

## Trade-offs und Anti-Patterns

| Entscheidung | Gewinn | Preis | Leitplanke |
|---|---|---|---|
| lange TTL | günstiger, schnellere Cache-Hits | langsamere Umstellung und Rücknahme | nur für stabile Daten mit dokumentiertem Rückbau. |
| kurze TTL | schnellere Aktualisierung | mehr Misses und Authority-Abhängigkeit | vor kritischem Wechsel rechtzeitig planen und messen. |
| Split DNS | private, kontextgerechte Antworten | Diagnose- und Leakage-Komplexität | Kontextmatrix, Owner und synthetische Tests verpflichtend. |
| Serving stale | höhere Namensverfügbarkeit | ältere Sicherheits-/Routingdaten | max. Alter und Serviceklasse festlegen. |
| zentrale Resolver | einheitliche Policy und Telemetrie | gemeinsame Fehlerdomäne | Redundanz und klarer Failoververtrag. |
| verschlüsselter Resolvertransport | bessere Query-Privatsphäre | Governance- und Diagnosewechsel | Privacy, egress und Telemetrie gemeinsam designen. |

Anti-Patterns:

- „DNS propagiert noch“ ohne Resolver, TTL, Zeit, RCODE und Autoritätsbeleg.
- Einen neuen Namen erst nach dem erwarteten Produktionsstart zum ersten Mal abfragen.
- `NXDOMAIN`, NODATA, Timeout und `SERVFAIL` als denselben Fehler behandeln.
- DNS als Health Check, Zugriffskontrolle oder vollständigen Traffic-Shift missverstehen.
- Den gleichen Namen in privaten und öffentlichen Zonen ohne dokumentierte Sichten und Ownership verwenden.
- TTL unmittelbar vor einem Wechsel verkürzen und eine bereits laufende Cachepopulation ignorieren.
- Geheimnisse oder sensible Betriebsdaten unkontrolliert in TXT-Records veröffentlichen.
- Einen manuellen DNS-Fix ohne Change-Record, Rückbauzeit und Monitoring auszuführen.

## Staff-, Principal- und Chief-Level Decisions

### Staff / Principal

Eine Staff-/Principal-Entscheidung macht Namensauflösung für Teams überprüfbar:

- Definiert eine kanonische Namenskonvention, aber zentralisiert nicht jedes Teamdetail ohne Bedarf.
- Verlangt pro Service eine explizite DNS- und Endpunktverantwortung statt einer diffusen „Netzwerkzuständigkeit“.
- Baut Testmatrizen für private/public Views, IPv4/IPv6, Resolverwege, Cache Miss/Hit und Rollback.
- Macht TTL, negative Caches und Stale-Verhalten zu getesteten Designparametern.
- Erzwingt die Trennung von DNS-Antwort, Verbindung und Applikationsantwort in Dashboards und Incidentvorlagen.
- Prüft neue SVCB/HTTPS- oder verschlüsselte DNS-Einsätze auf tatsächliche Clientunterstützung und Fallback.

### Chief

Eine Chief-Entscheidung richtet die Plattform über Bereichsgrenzen aus:

- Welcher Namensraum ist öffentlich, privat, partnerbezogen oder reguliert, und wer ist langfristig dafür verantwortlich?
- Welche Fehlerdomänen sind für autoritative Dienste, Resolver, Provider, Regionen und Verwaltung akzeptabel?
- Welche Serviceklassen benötigen Datenfrische, welche kontrolliert Stale-Verfügbarkeit, und wie wird das risikoangemessen überprüft?
- Wie werden DNS-Änderungen in Produktmigration, Identity, Edge, Netzwerk, Security, Compliance und FinOps eingebettet?
- Welche Exit-Strategie, Datenportabilität, Wiederherstellung und DNSSEC-/Zonenschlüsselkontrolle begrenzt Provider- und Lieferkettenrisiko?
- Welche Telemetrie ist für Incidentführung nötig und gleichzeitig datenschutzgerecht?

## Production Checklist

- [ ] QNAME, Zone, Owner, Record-Typ, Zielkontext und Serviceklasse sind dokumentiert.
- [ ] Autoritative und rekursive Rollen, Clientresolver und Fehlerdomänen sind bekannt.
- [ ] Positive und negative TTL, aktuelle Cachepopulation und Änderungstermin sind im Runbook.
- [ ] Private, öffentliche, VPN-, Region- und IPv4/IPv6-Kontexte sind als relevant oder bewusst ausgeschlossen festgelegt.
- [ ] Zielendpunkt besteht getrennte Netzwerk-, TLS- und Anwendungstests.
- [ ] RCODE-, Cache-, Resolver-, Upstream-, Latenz- und Endpunktmetriken haben Owner und Alarmgrenzen.
- [ ] DNSSEC-/Resolverprivacy-/Loggingpolicy ist geprüft; Geheimnisse sind nicht in Zonen veröffentlicht.
- [ ] Rückbau berücksichtigt fremde Caches, Stale-Policy und bereits sichtbare neue Daten.
- [ ] Delegations- und Autoritätsänderungen haben unabhängige Validierung und Notfallkontakt.
- [ ] Wiederherstellung, Providerwechsel und relevante Missbrauchsszenarien wurden als Übung geprüft.

## Praktisches Lab: Deterministisches Modell für Cache, negative Antwort und Split DNS

**Ziel:** Die Labarbeit zeigt, warum zwei Clients mit einem identischen Namen unterschiedliche, aber erklärbare Antworten erhalten können. Sie simuliert ausschließlich Datenstrukturen und Zeit. Es gibt keine echte DNS-Abfrage.

**Sicherheitsrahmen:** Lokale Python-Sandbox; keine Sockets, keine Bibliothek für Namensauflösung, keine Dateiänderung außerhalb des Lab-Verzeichnisses, keine Cloud-, Netzwerk- oder Produktionsressource.

```python
from dataclasses import dataclass

@dataclass
class Entry:
    rcode: str
    answer: tuple[str, ...]
    expires_at: int
    stale_until: int

zones = {
    ("private", "api.corp.example.", "A"): ("NOERROR", ("10.20.4.15",), 300),
    ("public",  "api.corp.example.", "A"): ("NXDOMAIN", (), 120),
}

cache: dict[tuple[str, str, str], Entry] = {}

def resolve(view: str, qname: str, qtype: str, now: int, allow_stale=False):
    key = (view, qname, qtype)
    item = cache.get(key)
    if item and now <= item.expires_at:
        return "cache-fresh", item.rcode, item.answer, item.expires_at - now

    if item and allow_stale and now <= item.stale_until:
        return "cache-stale", item.rcode, item.answer, 0

    rcode, answer, ttl = zones[key]
    cache[key] = Entry(rcode, answer, now + ttl, now + ttl + 60)
    return "authoritative-model", rcode, answer, ttl

print(resolve("private", "api.corp.example.", "A", now=0))
print(resolve("public", "api.corp.example.", "A", now=0))
print(resolve("private", "api.corp.example.", "A", now=180))
```

**Erwartete Auswertung:**

| Probe | Erwartung | Aussage |
|---|---|---|
| private View bei `t=0` | `NOERROR`, private Adresse | Eine Antwort ist kontextabhängig. |
| public View bei `t=0` | `NXDOMAIN` | Negativdaten sind nicht automatisch Netzfehler. |
| private View bei `t=180` | Cache-Hit mit verbleibender TTL | Der Resolver muss nicht erneut auf die Zonendaten zugreifen. |
| private View nach Ablauf mit `allow_stale=True` | nur im engen Stale-Fenster Stale-Antwort | Verfügbarkeit und Frische sind eine explizite Policy. |

**Negative Probes:**

1. Ändere nur die private Zonenantwort nach dem ersten Lookup und löse vor dem Cacheablauf erneut auf. Begründe den alten Wert über TTL statt über „fehlende Propagation“.
2. Frage denselben Namen im öffentlichen View ab. Begründe `NXDOMAIN` über Sicht und negativen Cache, ohne einen Netzfehler zu behaupten.
3. Setze `allow_stale=False` nach Ablauf und erwarte eine neue Modellabfrage. Vergleiche dies mit der kontrollierten Stale-Entscheidung.
4. Füge einen falschen QTYPE, etwa `AAAA`, ohne Zoneneintrag hinzu. Ergänze das Modell erst danach bewusst für NODATA; vermische es nicht mit `NXDOMAIN`.

**Cleanup:** Interpreter beenden und das temporäre Lab-Verzeichnis löschen, falls es angelegt wurde. Keine Produktionseinstellung wurde verändert.

## Interviewfragen mit Antwortkernen

1. **Warum ist eine TTL kein globales Propagationsversprechen?**  
   Jeder Cache erhält Daten zu einer eigenen Zeit und darf sie bis zum Ablauf wiederverwenden. TTL löscht weder bereits gespeicherte Einträge noch garantiert sie eine gleichzeitige Sicht aller Resolver.

2. **Wie unterscheidest du NXDOMAIN von NODATA?**  
   NXDOMAIN sagt, dass der Name aus dieser Sicht nicht existiert. NODATA bedeutet typischerweise `NOERROR`, aber keine Daten für den gefragten Typ; Name und andere Typen können existieren.

3. **Was bedeutet eine autoritative Antwort?**  
   Der antwortende Server ist für die zugrunde liegende Zone zuständig. Das beweist nicht, dass ein bestimmter Client denselben Server, dieselbe View oder keinen Cache verwendet.

4. **Ein Nutzer erhält die alte Adresse, ein anderer die neue. Welche Hypothese prüfst du zuerst?**  
   Ich erfasse für beide QNAME/QTYPE, Resolver, Zeitpunkt, RRset und verbleibende TTL. Unterschiedliche Cachezeiten sind häufig eine ausreichende Erklärung, bevor ich Zone oder Netzwerk ändere.

5. **Warum ist DNS kein Health Check?**  
   DNS verteilt Daten über Namen. Es bestätigt weder TCP-/QUIC-Erreichbarkeit noch TLS, Authentisierung, Load-Balancer-Health oder Anwendungserfolg.

6. **Wann ist Split DNS sinnvoll und was ist sein Hauptrisiko?**  
   Es ist sinnvoll für private Dienste und kontextabhängige Namensräume. Das Hauptrisiko ist unklare Sichtbarkeit: dieselbe Frage kann je nach Resolverpolicy, Netz oder Cache andere Daten liefern und sensible Namen offenlegen.

7. **Welche Sicherheitsleistung bringt DNSSEC nicht?**  
   DNSSEC verschlüsselt keine Queries und keine Antworten. Es ersetzt keine Zugriffskontrolle und verhindert nicht, dass ein berechtigter Resolver oder Client Namen sehen kann.

8. **Welche Evidenz brauchst du vor einem DNS-Rollback?**  
   Die publizierte und gecachte neue/alte RRset-Version, TTL/negative TTL, relevante Resolverkontexte, Endpointgesundheit, Änderungstimeline und erwartete Wirkung von Rückbau über Cachefenster.

## Dependencies, Cross-References und Quellen

| Beziehung | Dokument | Nutzung |
|---|---|---|
| Voraussetzung | [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) | Hypothesengestützte Fehleranalyse. |
| Voraussetzung | [KB-0049](01-osi-und-tcp-ip-als-analysemodelle.md) | Schichten und Endpunktmodell. |
| Voraussetzung | [KB-0056](08-tcp-verbindungen-und-ueberlastkontrolle.md) | Dienstprobe und TCP-Verhalten. |
| Voraussetzung | [KB-0057](09-udp-und-datagrammverhalten.md) | Datagramm-/Timeout-Grenzen. |
| Weiterführung | KB-0059 DHCP und Adressvergabe | Konfiguration der Netzidentität. |
| Weiterführung | KB-0060 NTP und Zeitsynchronisation | Zeitbasis für TTL, Logs und Incidentkorrelation. |
| Weiterführung | KB-0562 Enterprise DNS und Namensräume | Organisationsweite DNS-Architektur. |
| Nachweis | KB-0720 Portfolioevidenz und Reifemodelle | Nachweisbare Labs und Architekturentscheidungen. |

Primärquellen, abgerufen und inhaltlich geprüft am **2026-09-16**:

- [RFC 1034 – Domain Names: Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034)
- [RFC 1035 – Domain Names: Implementation and Specification](https://www.rfc-editor.org/rfc/rfc1035)
- [RFC 2308 – Negative Caching of DNS Queries](https://www.rfc-editor.org/rfc/rfc2308)
- [RFC 4033 – DNS Security Introduction and Requirements](https://www.rfc-editor.org/rfc/rfc4033)
- [RFC 8767 – Serving Stale Data to Improve DNS Resiliency](https://www.rfc-editor.org/rfc/rfc8767)
- [RFC 9156 – DNS Query Name Minimisation to Improve Privacy](https://www.rfc-editor.org/rfc/rfc9156)
- [RFC 9460 – SVCB and HTTPS Resource Records](https://www.rfc-editor.org/rfc/rfc9460)

## Bonus: New Tech and Innovations

SVCB- und HTTPS-Records können moderne Serviceeigenschaften wie alternative Endpunkte oder Protokollparameter maschinenlesbar vermitteln. Sie sind jedoch kein Ersatz für Kompatibilitätsplanung: Client, Resolver, Edge und Security-Policy müssen den Record verstehen oder einen geprüften Fallback besitzen. Die produktive Einführung beginnt mit einer kleinen, messbaren Clientgruppe und misst tatsächliche Recordnutzung, Fallbackrate, Latenz, Fehlerraten und Rollbackzeit.

QNAME Minimisation reduziert, welche vollständigen Namen ein rekursiver Resolver auf dem Weg durch Delegationen preisgibt. Das verbessert Privacy, kann aber mit fehlerhaften oder sehr alten autoritativen Implementierungen Wechselwirkungen haben. Als Plattformentscheidung verlangt sie daher Resolvertelemetrie, Kompatibilitätstests und eine klar dokumentierte Ausnahmebehandlung statt eines unbeobachteten Schalters.

Verschlüsselte Resolvertransporte und neue DNS-Transporte verbessern die Vertraulichkeit bestimmter Strecken. Sie verschieben zugleich die Sichtbarkeit für Unternehmensnetze, Security Operations und Compliance. Ein Pilot akzeptiert eine DNS-Innovation erst, wenn Resolververhalten, Cache-Semantik, Privacy, Endpunktgesundheit, Observability und Rückbau in jedem relevanten Clientkontext nachgewiesen sind.

