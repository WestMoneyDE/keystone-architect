---
{"id": "KB-0078", "title": "BGP-Policy und Route Reflection", "domain": "04", "sequence": 2, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["ENTERPRISE", "CLOUD", "PLATFORM", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe", "Change"], "needed_for": "both"}, {"id": "KB-0054", "concepts": ["CIDR", "Aggregation", "Präfix"], "needed_for": "both"}, {"id": "KB-0064", "concepts": ["RIB", "FIB", "Next Hop"], "needed_for": "both"}, {"id": "KB-0066", "concepts": ["Policy", "ACL", "Control Plane"], "needed_for": "understanding"}, {"id": "KB-0077", "concepts": ["IGP", "Konvergenz", "RIB/FIB"], "needed_for": "both"}], "related": ["KB-0079", "KB-0080", "KB-0084", "KB-0562", "KB-0720"], "applies": ["KB-0079", "KB-0080", "KB-0084", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Das Lab modelliert lokal Prefiximport, Policyentscheidung, Route Reflection und Leak-Gegenprobe; es startet keinen BGP-Prozess und verändert keine Route.", "rationale": "Es übt Policydenken ohne Session, TCP, Interface, VM, Cloud, Netzwerk oder Produktion."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein BGP-Vertrag umfasst Peeringrollen, AFI/SAFI, Prefix-/AS-PATH-/Next-Hop-/Communitypolicy, Default deny, Route Reflectors, IGP-Abhängigkeit, maximale Präfixe, Auth/TTL-/Control-Plane-Schutz, Beobachtung, Change und Rollback.", "rationale": "BGP ist policybasierte Reachability-Verteilung; eine fehlerhafte Exportregel kann ein großes Failure Domain erzeugen."}, "STAFF-TARGET": {"active": true, "scope": "Teams testen Session-/FSM-, Import-/Export-, Community-, Reflection-, Next-Hop-, RIB/FIB-, Prefixlimit-, Leak-, Withdrawal- und IGP-Failure gegen Servicewirkung und Rollback.", "rationale": "Sie trennen erlernte, akzeptierte, beste, exportierte und installierte Routen."}, "CHIEF-TARGET": {"active": true, "scope": "Die Organisation steuert Peering-/Route-Server-/RR-Referenzarchitektur, Prefix- und Community-Taxonomie, Policy-as-Code, unabhängige Review, RPKI-/Securitygrenzen, Lieferanten-, Standort- und Ausnahmegovernance.", "rationale": "Route Leaks, falsche Communities oder ungesicherte Sessions können globale Erreichbarkeit, Kosten und Sicherheitsgrenzen beeinflussen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "BGP-LS, EVPN, VPNv4/v6, flowspec, add-path, ORR, RPKI, BGPsec, GR/LLGR, PIC, damping und Carrier-/IX-Policy sind Spezialtiefe.", "rationale": "Die Zielrollen verantworten Verträge und Risiko; AFI/SAFI-/Carrierimplementierung vertiefen Spezialisten."}}, "lab_validation": [{"lab_id": "KB-0078-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox mit fiktiven Prefix-/Policyobjekten ohne Netzwerkzugriff", "evidence": "Die Fallarbeit zeigt default-deny Import/Export, erlaubte Community und Leakversuch als unzulässig.", "limitations": "Nicht ausgeführt; kein BGP-Prozess, TCP, Session, Paket, Interface, Route, VM, Cloud-, Netzwerk- oder Produktionssystem wurde verwendet oder verändert."}]}
---
# BGP-Policy und Route Reflection

> **Ziel:** BGP verteilt Erreichbarkeit unter Policy. Eine Session ist nur Transport; Import, Auswahl, Export, Next-Hop-Auflösung und FIB bestimmen die Wirkung. Route Reflection löst iBGP-Vollvermaschung, braucht aber klare Cluster-, Client- und Failure-Domain-Regeln.

## Zweck, Definition und Scope

BGP ist ein Inter-AS-Protokoll zur Verteilung von Präfixen und Path-Attributen. RFC 4271 beschreibt Adj-RIB-In, Loc-RIB und Adj-RIB-Out: erlernte Route, lokal ausgewählte Route und peerspezifisch angekündigte Route. Policies entscheiden, welche Informationen akzeptiert, verändert oder exportiert werden. RFC 4456 beschreibt Route Reflection als Alternative zur iBGP-Vollvermaschung. RFC 8212 verlangt für EBGP explizite Import- und Exportpolicy; dies ist ein sicherer Architekturgrundsatz auch über die konkrete Normgrenze hinaus.

### Lernziele

1. Session, Adj-RIB-In, Loc-RIB, Adj-RIB-Out und FIB unterscheiden.
2. Prefix-, AS_PATH-, NEXT_HOP-, LOCAL_PREF-, MED- und Community-Kontext als Policyinputs bewerten.
3. Route Reflector, Cluster-ID, Originator-ID und Clientbeziehung nach Failure Domain entwerfen.
4. Route Leak, fehlende Default-Deny-Policy, Next-Hop-Unreachability und unerwarteten Pfad systematisch untersuchen.
5. Ein überprüfbares BGP-Change-, Security- und Rollbackmodell aufstellen.

## Kompetenzstatus und Mental Model

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| HANDS-ON-TARGET | Lokales Policy-/Leakmodell ohne Netzwerk. |
| ARCHITECT-TARGET | Peering, Policy, RR, Security, Limits und IGP-Abhängigkeit als Vertrag. |
| STAFF/PRINCIPAL | Routelebenszyklus und Failuretests über Control- und Dataplane. |
| CHIEF | Taxonomie, Review, Lieferanten- und Risikoportfolio. |

~~~text
peer TCP/BGP session -> Adj-RIB-In -> import policy -> Loc-RIB selection
 -> next-hop resolvability / IGP -> RIB/FIB -> data plane
 -> export policy per peer -> Adj-RIB-Out -> advertised route
~~~

Eine Route kann empfangen sein und trotzdem verworfen werden; sie kann lokal beste Route sein und dennoch nicht exportiert werden; sie kann exportiert sein und bei einem Peer anders entschieden werden. Ein Established-State beweist keine korrekte Policy oder Serviceerreichbarkeit.

## Prerequisites und Core Concepts

| Voraussetzung | Bedeutung |
|---|---|
| [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0054](../03-network-foundations/06-cidr-und-subnetting.md) | Hypothesen, Präfixe und Aggregation. |
| [KB-0064](../03-network-foundations/16-routing-grundlagen.md), [KB-0066](../03-network-foundations/18-acls-und-filtering.md) | RIB/FIB und Policy-/Control-Plane-Grenze. |
| [KB-0077](01-ospf-und-interne-konvergenz.md) | IGP-Auflösung und Konvergenz. |

| Objekt | Nutzen | typische Fehlannahme |
|---|---|---|
| NLRI/Prefix | beworbene Destination | Prefix sei autorisiert |
| AS_PATH | Path-/Loopkontext | kürzester Pfad sei immer richtig |
| NEXT_HOP | Dataplaneabhängigkeit | BGP-Route sei ohne IGP/FIB nutzbar |
| LOCAL_PREF | lokale Policypräferenz | global standardisiert |
| MED | Nachbarhinweis im passenden Vergleichskontext | universelle Latenzmetrik |
| Community | Policy-Metadaten | untrusted Community dürfe übernommen werden |
| Prefix-/AS-PATH filter | akzeptierbare Menge | einzelner Allow ohne Default deny reiche |
| max-prefix | Ressourcen-/Leakbremse | vollständige Policy ersetze sich dadurch |

## Route Reflection, Policy und Data Flow

iBGP verteilt standardmäßig nicht jede iBGP-gelernte Route an weitere iBGP-Peers. Route Reflectors reflektieren Clientrouten, um Full Mesh zu reduzieren. Originator-ID und Cluster-List dienen der Schleifenvermeidung. RR erhöht Skalierbarkeit, kann aber Sicht, Pfade und Ausfallverhalten konzentrieren; redundante RRs, konsistente Clientzuordnung, IGP-Erreichbarkeit, Upgrade-/Split-Brain-Tests und Telemetrie sind nötig.

~~~text
EBGP peer -> edge policy -> RR cluster -> client policy/Loc-RIB -> IGP next hop -> FIB
                         \-> export policy -> peer-specific announcement
Route leak: unintended accepted/exported prefix or transit policy violation
~~~

Ein Route-Leak ist nicht nur ein großer Prefixcount. Prüfe Quelle, Sessionrolle, AFI/SAFI, erlaubte Prefixmenge, AS_PATH, Community, Next Hop, Attribute nach Transformation, Exportpeer, erwarteten Kunden-/Transit-/Standortvertrag und tatsächliche FIB-/Servicewirkung.

## Konfiguration, Reliability und Security

Ein Konfigurationsvertrag enthält Peeridentität und AS, AFI/SAFI, Sessiontransport, Import-/Export default deny, Prefix-/AS_PATH-/Community-Listen, erlaubte Änderungen, Next-hop-Policy, RR-Cluster/Clients, Max-Prefix/Graceful-Restart-Annahmen, Authentisierung und Secretrotation, TTL/GTSM-/ACL/CoPP-Grenzen, Logging/Telemetry, Owner und Rollback. Produktdefaults, Auswahlreihenfolge und Featureverfügbarkeit sind versionsabhängig und müssen gegen konkrete Plattformdokumentation geprüft werden.

| Symptom | Hypothesen | Gegenprobe |
|---|---|---|
| Session nicht Established | TCP/TTL/ACL/auth/AS/FSM/Address family | beide Peers, sichere Logs, keine blindes Reset |
| Route empfangen, nicht Loc-RIB | Importpolicy, Next Hop, Attribute, route preference | Adj-RIB-In/Policyreason/IGP prüfen |
| Loc-RIB, kein FIB/Traffic | next-hop/FIB/ACL/ECMP/return path | RIB/FIB/Flow/Servicepfad |
| unerwartete Routen | leak, community/prefix filter, RR role | Source/attribute/export history/limits |
| RR-Ausfall | Client/cluster/IGP/restart/failure domain | Redundanz/withdrawal/serviceflow/rollback |

Security schützt Sessions und Policy: nur erwartete Peers, starke passende Authentisierung/Keyrotation, Prefix-/AS-PATH-/Community sanitization, default deny, max-prefix, control-plane rate/ACL, Managementtrennung, config-as-code, unabhängiges Review, Audit und Alarm für Session-/prefix-/attribute-Churn. Communities können Steuerung und Datenklassifikation verraten; Logs und RIB-Dumps brauchen Zugriff und Retention.

## Observability, Cost und Entscheidungen

Messe FSM, Establish-/Resetgrund, Prefixcount, accepted/rejected/exported, policy reason, attribute-/communitydistribution, next-hop resolution, Loc-RIB/FIB, RR-/cluster-/client health, IGP reachability, CPU/memory, convergence/withdrawal und Nutzerfluss. Kosten umfassen Router-/Cloud-/Transitkapazität, RR-Redundanz, Operations, Telemetrie, Change-Review, Outage und falschen Transit.

| Ebene | Entscheidung |
|---|---|
| Staff | reproduzierbares Policy-Review, Leaktest, RIB/FIB-/Service-Evidenz und Incidentrunbook. |
| Principal | Rollen-/Community-/Prefix-Taxonomie, RR-Failure-Domain und Policy-as-Code über Teams. |
| Chief | Peering-/Transit-/Cloud-/Securitystrategie, unabhängige Controls und Ausnahme-/Lieferantengovernance. |

Anti-Patterns: permit-any; Community blind vertrauen; RR als bloßen Skalierungsschalter; Received-RIB mit FIB verwechseln; Prefixlimit statt Policy; Next Hop/IGP ignorieren; Policychange ohne peer-spezifische Diff-/Rollbackprüfung.

## Production Checklist

| Kriterium | Nachweis |
|---|---|
| Peeringrolle, AFI/SAFI, Prefix-/Community-/AS-Policy und Default deny | reviewed Policy-as-Code |
| RR-Cluster, Client-, IGP-, Failure-Domain und Upgradeplan | Architektur- und Failuretest |
| Auth/ACL/CoPP, max-prefix, Secrets und Managementgrenze | Securityreview |
| Adj-RIB-In/Loc-RIB/Adj-RIB-Out/FIB und Serviceflow | Changeevidenz |
| Leak-/Withdrawal-/Peer-/RR-Failover, Owner, Alarm und Rollback | Übung und Runbook |

## Interviewfragen mit Antwortleitfäden

### 1. Was sind Adj-RIB-In, Loc-RIB und Adj-RIB-Out?

**Antwortleitfaden:** empfangen vor Policy, lokal ausgewählt nach Policy und peerspezifisch exportiert. FIB folgt getrennt.

### 2. Warum braucht BGP explizite Import- und Exportpolicy?

**Antwortleitfaden:** Default deny begrenzt unbeabsichtigte Reachability, Transit und Leaks; Prefixlimit allein genügt nicht.

### 3. Wie reduziert Route Reflection iBGP-Komplexität?

**Antwortleitfaden:** Clients peeren mit RR statt Full Mesh; Originator-/Clusterinformationen begrenzen Schleifen. Redundanz und Pfadwirkung bleiben nötig.

### 4. Weshalb kann eine beste BGP-Route nicht forwarden?

**Antwortleitfaden:** NEXT_HOP/IGP-/FIB-/ACL-/Dataplane-/Rückwegproblem. RIB- und Serviceevidenz trennen.

### 5. Welche Attribute dürfen externe Communities überschreiben?

**Antwortleitfaden:** Nur ausdrücklich vertrauenswürdige und dokumentierte Werte; sonst sanitizen/ignorieren. Policy und Securityowner entscheiden.

### 6. Wie untersuchst du einen Route Leak?

**Antwortleitfaden:** Quelle, Rolle, Prefix, Attributes, Import, Loc-RIB, Export, Peer, FIB und Nutzerwirkung in Zeitachse vergleichen; Export stoppen und kontrolliert zurückrollen.

## Praktische Labs und Fallarbeit

### KB-0078-LAB-01: Default-Deny-Policymodell

**Status:** reviewed_only. Keine BGP-Session oder Route wird erzeugt.

~~~python
allowed = {"10.20.0.0/16": {"community": "SITE-A"}}
received = [("10.20.0.0/16","SITE-A"),("0.0.0.0/0","UNTRUSTED")]
accepted = [p for p,c in received if p in allowed and allowed[p]["community"] == c]
print("accepted", accepted)
print("rejected leak candidate", "0.0.0.0/0")
~~~

**Gegenprobe:** Entferne Community- oder Prefix-Allow-List und erläutere, warum eine offene Exportregel den Leak nicht begrenzt. **Cleanup:** Keine Dateien, Prozesse oder Netzwerkressourcen.

## Dependencies, Cross-References und Quellen

1. [RFC 4271: BGP-4](https://www.rfc-editor.org/info/rfc4271), abgerufen 2026-09-16. BGP, RIBs, Session, UPDATE, Attribute und Auswahlkontext.
2. [RFC 4456: BGP Route Reflection](https://www.rfc-editor.org/info/rfc4456), abgerufen 2026-09-16. RR-/Cluster-/Loopkontext.
3. [RFC 8212: Default EBGP Route Propagation Behavior](https://www.rfc-editor.org/info/rfc8212), abgerufen 2026-09-16. Explizite Import-/Exportpolicy.
4. Weiterführung: KB-0079, KB-0080, KB-0084, KB-0562 und KB-0720.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad und Nutzen | Einführungsentscheidung |
|---|---|---|
| Policy-as-Code und Offline-Route-Simulation | **Adopting.** Wiederholbare Diffs, Review und Leaktests. | Datenmodell, unabhängige Prüfung, Deployment-/Rollback und Actual-vs-Intent-Drift testen. |
| RPKI-Origin Validation | **Adopting / Established je Peeringkontext.** Kann unautorisierte Origin-Ankündigungen markieren/filtern. | ROA-/Policyabdeckung, Ausnahmeprozess, Providerverhalten und Fehlklassifikation prüfen. |
| BGP Graceful Restart/LLGR | **Established / kontextabhängig.** Kann Control-Plane-Unterbrechung abmildern. | Stale-Route-/Failure-Risiko, Interoperabilität und Servicewirkung nachweisen. |
| BGP-LS/EVPN/Cloud-Routingintegration | **Adopting.** Größere Automatisierung und Servicekontext. | AFI/SAFI-Scope, Hardware/Cloudlimits, Security, Migration und Exitplan evaluieren. |

Ein Pilot akzeptiert eine BGP-Innovation erst, wenn Peering-/AFI-/SAFI-/Policymodell, Adj-RIB-In/Loc-RIB/Adj-RIB-Out/FIB-/Next-Hop-Semantik, Prefix-/AS_PATH-/Community-/Leak-/RR-Failure, Control-Plane-Security, Service-/Konvergenz-SLO, Observability, Capacity/Cost, Owner, Change und Rollback nachgewiesen sind.
