---
{"id": "KB-0077", "title": "OSPF und interne Konvergenz", "domain": "04", "sequence": 1, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["ENTERPRISE", "CLOUD", "PLATFORM", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Zeitreihe", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0054", "concepts": ["CIDR", "Summarization", "Subnetz"], "needed_for": "both"}, {"id": "KB-0061", "concepts": ["VLAN", "Broadcast-Domain", "L2-Grenze"], "needed_for": "understanding"}, {"id": "KB-0064", "concepts": ["Routing", "FIB", "Next Hop"], "needed_for": "both"}, {"id": "KB-0066", "concepts": ["ACL", "Policy", "Control Plane Schutz"], "needed_for": "understanding"}, {"id": "KB-0075", "concepts": ["Anfragepfad", "Messpunkte", "Policy"], "needed_for": "both"}], "related": ["KB-0078", "KB-0079", "KB-0084", "KB-0562", "KB-0720"], "applies": ["KB-0078", "KB-0079", "KB-0084", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Das Lab modelliert lokal Gewichtspfad und Linkausfall; es startet keinen Routing-Daemon und versendet keine OSPF-Pakete.", "rationale": "Es übt Link-State-Denken ohne Interface, Route, Multicast, VM, Cloud, Netzwerk oder Produktion."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein IGP-Vertrag umfasst Area-/Adress-/Summaryplan, Kosten, Redundanz, ECMP, Auth, Control-Plane-Schutz, Konvergenzbudget, Telemetrie, Change und Rollback.", "rationale": "Topologie- und Kostenentscheidungen prägen Pfad, Skalierung und Failure Domain."}, "STAFF-TARGET": {"active": true, "scope": "Teams testen Link-, Router-, Adjacency-, LSA-, Area-/ABR-, Auth-, Cost-, ECMP- und FIB-Fehler gegen Konvergenzzeit und Servicewirkung.", "rationale": "Sie trennen Neighbor, LSDB, SPF, RIB/FIB und Dataplane."}, "CHIEF-TARGET": {"active": true, "scope": "Die Organisation steuert IGP-Referenzarchitektur, IPAM, Change-/Securitystandards, Beobachtbarkeit, Übungen, Lieferanten- und Standortstrategie.", "rationale": "Ungesteuerte IGP-Ausbreitung und Kostenänderung können standortübergreifende Pfad- und Ausfälle erzeugen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "OSPFv3, LSA-Familien, BFD, Graceful Restart, Segment Routing, TI-LFA und vendor CLI/ASIC-Tuning sind Spezialtiefe.", "rationale": "Architekturverantwortung bleibt getrennt von Protokoll-/Hardwaretuning."}}, "lab_validation": [{"lab_id": "KB-0077-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox mit fiktivem Standortgraph ohne Netzwerkzugriff", "evidence": "Das Modell berechnet einen alternativen Kostenpfad nach Linkausfall und grenzt das Ergebnis von realer OSPF-/FIB-/Traffic-Konvergenz ab.", "limitations": "Nicht ausgeführt; kein OSPF-Daemon, Paket, Multicast, Interface, Route, ACL, BFD, VM, Cloud-, Netzwerk- oder Produktionssystem wurde verwendet oder verändert."}]}
---
# OSPF und interne Konvergenz

> **Ziel:** OSPF ist ein Link-State-IGP innerhalb eines autonomen Systems. Nachbarschaft, LSDB, SPF, RIB/FIB und Datenpfad sind getrennte Zustände, die zusammen geprüft werden müssen.

## Zweck, Definition und Scope

OSPF verteilt im eigenen AS Topologieinformationen. Router bilden Nachbarschaften, synchronisieren eine Link-State Database, fluten LSAs, berechnen per SPF Pfade und installieren Routen in RIB/FIB. RFC 2328 beschreibt OSPFv2 als Link-State-IGP mit Areas, ECMP und Authentisierung; RFC 5340 beschreibt OSPF für IPv6. Dieses Kapitel erklärt Nachbarschaften, LSAs, Areas, Kosten, Summarization und Konvergenz für redundante Standortnetze, keine hersteller- oder produktionsfähige Konfiguration.

### Lernziele

1. Neighbor, adjacency, LSDB, SPF, RIB, FIB und Anwendungspfad unterscheiden.
2. Kosten, ECMP, Areas und Summaries nach Failure Domain bewerten.
3. Linkausfall und falsche LSA-/Cost-/Summaryannahmen begründet eingrenzen.
4. IGP-Change mit Security, Messung, Rollback und Service-SLO verantworten.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Link State beschreibt Topologie; FIB und Traffic folgen später. |
| HANDS-ON-TARGET | Sicheres lokales SPF-/Linkausfallmodell. |
| ARCHITECT-TARGET | Area, Adresse, Summary, Cost, Auth und Recovery als IGP-Vertrag. |
| STAFF/PRINCIPAL | Übungen verbinden Control Plane, RIB/FIB und Servicewirkung. |
| CHIEF | Referenzarchitektur, Governance, Lieferanten- und Standortmodell steuern. |

## Mental Model, Dependencies und Core Concepts

~~~text
eligible interface -> Hello match -> neighbor/adjacency -> LSDB synchronization
 -> LSA flooding -> SPF tree -> RIB candidate -> FIB programming -> traffic result
~~~

Ein Full-Nachbar beweist weder richtige FIB, ACL, NAT noch Anwendungserfolg. RFC 2328 beschreibt OSPF als IGP, bei dem Router innerhalb eines AS eine konsistente Topologiedatenbank führen und daraus kürzeste Pfade berechnen.

| Zustand/Artefakt | Bedeutung | nicht bewiesen |
|---|---|---|
| Hello/2-Way | Nachbarentdeckung | vollständige LSDB |
| Exchange/Loading | Datenbanksynchronisierung | stabiler Datenpfad |
| Full | Adjacency synchron | FIB und Application OK |
| LSA/LSDB | Topologie im Scope | gleicher Pfad aus jeder Perspektive |
| SPF/RIB | beste berechnete Route | Hardware-/Kernel-FIB installiert |
| FIB | Weiterleitungskandidat | Ende-zu-Ende-Service funktioniert |

| Voraussetzung | Nutzen |
|---|---|
| [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0054](../03-network-foundations/06-cidr-und-subnetting.md) | Hypothesen, Präfixe und Summary. |
| [KB-0061](../03-network-foundations/13-vlan-und-segmentierung.md), [KB-0064](../03-network-foundations/16-routing-grundlagen.md), [KB-0066](../03-network-foundations/18-acls-und-filtering.md) | L2, RIB/FIB und Control-Plane-Policy. |
| [KB-0075](../03-network-foundations/27-netzwerkdiagnose-entlang-des-anfragepfads.md) | Servicepfad und Messpunkte. |

### Kosten, Areas und Summarization

~~~text
path cost = sum of link costs on the eligible path
selected route = lowest eligible cost, potentially ECMP for equal costs
~~~

Cost ist eine absichtliche Präferenz, keine garantierte Bandbreite oder live gemessene Latenz. Areas begrenzen LSDB-/SPF-Scope; Area 0 ist das Backbone für Inter-Area-Verkehr. ABRs verbinden Areas. Summary reduziert Routen und Churn, kann aber Teilpräfixausfälle verdecken. Es braucht einen zusammenhängenden Adress- und Failure-Domain-Plan, Rückfallpfad sowie gezielte Testflows.

## Architecture, Konfiguration und Konvergenz

Zwei Standorte sind über getrennte Corepfade redundant verbunden. Der primäre Pfad Cost 10, der alternative Cost 20. Beim Linkausfall muss nicht nur Neighbor/LSA, sondern LSDB, SPF, FIB, Securitypolicy und Dienstfluss über den alternativen Pfad nachweisbar sein.

~~~text
Site A -> ABR-A -> Core-1 --\
          cost 10             -> Area 0 -> Core-2 -> ABR-B -> Site B
          cost 20            /
failure: A-Core-1 -> detection -> LSA flood -> SPF -> FIB -> validated flow
~~~

Ein Change-Vertrag nennt Netztyp, Area, Router-ID, Präfix-/Summaryscope, Cost/ECMP, Authentisierung und Keyrotation, erlaubte Neighbor, Timer-/BFD-/Restartpolicy, Management-/Control-Plane ACL, erwartete RIB/FIB, Konvergenzbudget, Beobachtungen, Owner, Wartungsfenster und Rollback. Keine generischen Timer-/CLI-Werte ohne Plattform- und Lastprüfung übernehmen.

## Scalability, Reliability und Security

Große LSDBs, instabile Links und viele Area-Grenzen steigern CPU, Speicher, Flooding- und Changekomplexität. Schnellere Erkennung kann Flaps und SPF-Last verstärken. Messe Neighbor-/LSDB-/SPF-/FIB-Änderungen, LSA-/Retransmissions, CPU/Memory, FIB-Programmierung, ECMP-Flows, Packet Loss, P99 und Nutzer-SLO pro Standort/Area.

| Symptom | Gegenhypothesen | sichere Gegenprobe |
|---|---|---|
| Neighbor nicht Full | Netztyp/Area/Timer/MTU/Auth/L2/ACL | beide Seiten, Paket-/Loggrenze, keine Timerblindänderung |
| LSDB abweichend | Flooding, Filter, Area/ABR, Instabilität | LSA-Header/Origin/Scope und Nachbarn vergleichen |
| RIB korrekt, Traffic fehlschlägt | FIB, ACL/NAT, ECMP, Rückweg, Endpoint | FIB/Flow/Policy und Dienstpfad messen |
| Linkflap erzeugt Ausfall | physisch/L2, aggressive Detektion, Ressourcen | Ereigniszeitachse, Fehlerdomäne, Wiederherstellung testen |
| Summary Black Hole | Teilpräfix down, falscher Scope | spezifischen Testflow und Summaryowner prüfen |

OSPF-Control-Plane braucht Least Privilege: nur erwartete Interfaces/Nachbarn, starke aktuelle Authentisierung gemäß Plattform und Policy, Schlüsselrotation, Managementtrennung, ACL/CoPP, Rate-/Resource-Schutz, auditierte Konfiguration und Alarm bei unerwarteten Adjacencies oder LSA-Churn. Routingtelemetrie kann Topologie und Adressen offenlegen; Zugriff, Retention und Incident-Übergabe gehören zur Governance.

## Cost, Trade-offs und Entscheidungen

Kosten entstehen durch Routerleistung, Lizenzen/Support, Linkredundanz, Operations, Telemetrie, Changefenster und Ausfallzeit. Eine Summary oder ein Costwert wird nicht nach bloßer Kostensenkung bewertet, sondern nach Nutzerpfad, Resilienz, Security, Betriebskomplexität und Exitkosten.

| Ebene | Entscheidung |
|---|---|
| Staff | Konvergenztest, Runbook, Messgrenzen und wiederkehrende Fehlerklasse. |
| Principal | Area-/Summary-/Cost-/Auth-Standard sowie RIB/FIB-/Service-Evidence über Teams. |
| Chief | Standort-/Carrier-/Cloud-/Referenzarchitektur, Resilience Investment und Ausnahmegovernance. |

Anti-Patterns: Full als Servicebeweis behandeln; Summary ohne Failure-Domain; Cost als Kapazitätsersatz; flapping Link durch Timer verstecken; unautorisierte Neighbor zulassen; Change ohne FIB-/Service-Rollback; nur globale Durchschnittskonvergenz messen.

## Production Checklist

| Kriterium | Nachweis |
|---|---|
| Area-/Backbone-, Präfix-/Summary- und Failure-Domain-Design | versioniertes Architekturartefakt |
| Neighbor-/Auth-/ACL-/Control-Plane-Schutz | Security-/Configreview |
| erwartete Cost/ECMP/RIB/FIB und Testflows | Changeplan |
| Link-/Router-/ABR-/LSA-/Summary-Failuretest | Konvergenzzeitachse und SLO |
| Telemetrie, Owner, Incidentpfad, Rollback und Ausnahmeablauf | Betriebsrunbook |

## Interviewfragen mit Antwortleitfäden

### 1. Was unterscheidet LSDB, RIB und FIB?

**Antwortleitfaden:** LSDB speichert Link-State-Topologie, SPF erzeugt RIB-Kandidaten, FIB ist die installierte Forwarding-Sicht. Datenpfad und Anwendung müssen zusätzlich geprüft werden.

### 2. Warum ist Full nicht gleich konvergierter Service?

**Antwortleitfaden:** Full betrifft Adjacency/DB-Synchronisierung. Route, FIB, ACL, ECMP-Rückweg, Ziel und Transportrecovery können trotzdem fehlen.

### 3. Wann hilft Summarization und wann schadet sie?

**Antwortleitfaden:** Sie reduziert Churn/Routen bei passendem Adress- und Failure-Domain-Plan. Sie schadet bei verdeckten Teilpräfixausfällen oder falschen Rückfallrouten.

### 4. Warum nicht Timer immer aggressiver setzen?

**Antwortleitfaden:** Es erhöht Detektion, aber auch Flap-, CPU-, Flooding- und Fehlersignalrisiko. Linkqualität, BFD/Plattform, Servicebudget und Testumfang entscheiden.

### 5. Welche Securitygrenze hat OSPF?

**Antwortleitfaden:** Nur erwartete Router und Interfaces dürfen die Control Plane beeinflussen. Authentisierung, ACL/CoPP, Schlüsselrotation, Managementtrennung und Monitoring sind nötig.

### 6. Wie überprüfst du einen Linkfailover?

**Antwortleitfaden:** Topologie-/Neighbor-/LSA-/LSDB-/SPF-/RIB-/FIB-Zeitachse plus kontrollierter Serviceflow, Rückweg, ECMP und Rollback. Kein einzelner CLI-Befehl reicht.

## Praktische Labs und Fallarbeit

### KB-0077-LAB-01: SPF-Modell ohne Netzwerk

**Status:** reviewed_only. Nicht ausgeführt; ausschließlich lokale Testdaten.

~~~python
graph = {"A":{"C1":10,"C2":20},"C1":{"A":10,"B":10},"C2":{"A":20,"B":10},"B":{"C1":10,"C2":10}}
def cost(path): return sum(graph[a][b] for a,b in zip(path,path[1:]))
before = [["A","C1","B"],["A","C2","B"]]
after = [["A","C2","B"]]  # A-C1 failure is a model assumption
print("before", [(p,cost(p)) for p in before])
print("after", [(p,cost(p)) for p in after])
print("LIMIT: this proves neither adjacency, LSDB, FIB nor real traffic convergence.")
~~~

**Gegenprobe:** Ändere den alternativen Pfad auf fehlend; das Modell zeigt keine sichere Route. Eine reale Konfiguration darf daraus nicht abgeleitet werden. **Cleanup:** Keine Ressourcen entstehen.

## Dependencies, Cross-References und Quellen

1. [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/info/rfc2328), abgerufen 2026-09-16. Link-State, LSDB, SPF, areas, ECMP, authentication und Packet-/LSA-Kontext.
2. [RFC 5340: OSPF for IPv6](https://www.rfc-editor.org/info/rfc5340), abgerufen 2026-09-16. OSPFv3-Kontext.
3. [RFC 3623: Graceful OSPF Restart](https://www.rfc-editor.org/info/rfc3623), abgerufen 2026-09-16. Restart-/Konvergenzkontext, nicht als allgemeines Enablement.
4. Weiterführung: KB-0078, KB-0079, KB-0084, KB-0562 und KB-0720.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad und Nutzen | Einführungsentscheidung |
|---|---|---|
| OSPFv3 | **Established.** IPv6-IGP-Kontext mit eigener Protokoll-/Securityprüfung. | Address Family, Plattform, Auth, Telemetrie und Migration testen. |
| Graceful Restart | **Established / kontextabhängig.** Kann geplante Control-Plane-Unterbrechung abschwächen. | Failure- und Stale-Route-Risiko, Peerinteroperabilität und Rollback nachweisen. |
| BFD und schnelle Failover-Signale | **Established / kontextabhängig.** Kann Erkennung beschleunigen. | Flap-/CPU-/False-Positive-Risiko, Plattform und Servicebudget testen. |
| Segment Routing und TI-LFA | **Adopting.** Erweiterte Pfad-/Fast-Reroute-Fähigkeiten. | Skill, Hardware, Security, Migration, Observability und Exitplan bewerten. |

Ein Pilot akzeptiert eine OSPF-Innovation erst, wenn Area-/Adress-/Summary-/Cost-/ECMP-Modell, Neighbor-/LSA-/LSDB-/SPF-/RIB-/FIB-Semantik, Link-/Router-/ABR-Failure, Control-Plane-Security, Konvergenz-/Service-SLO, Observability, Capacity/Cost, Owner, Change und Rollback nachgewiesen sind.
