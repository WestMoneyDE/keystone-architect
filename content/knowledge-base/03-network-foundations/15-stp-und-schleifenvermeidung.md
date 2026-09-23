---
{"id": "KB-0063", "title": "STP und Schleifenvermeidung", "domain": "03", "sequence": 15, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0050", "concepts": ["MAC-Lernen", "Broadcast", "Flooding"], "needed_for": "both"}, {"id": "KB-0061", "concepts": ["Broadcast-Domain", "VLAN", "Segmentvertrag"], "needed_for": "both"}, {"id": "KB-0062", "concepts": ["Trunk", "Forwarding-Pfad", "Redundanzpfad"], "needed_for": "both"}], "related": ["KB-0064", "KB-0065", "KB-0066", "KB-0067", "KB-0562", "KB-0720"], "applies": ["KB-0064", "KB-0065", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Das Lab modelliert Root-Wahl, Portrollen, blockierte Redundanzkante und einen Root-Guard-Entscheid mit lokalen Python-Datenstrukturen.", "rationale": "Es erzeugt keine BPDUs, aktiviert keinen STP-Port und verändert keine Bridge, keinen Switch, Router, Firewall, Cloud- oder Produktionszustand."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein Layer-2-Topologievertrag definiert gewünschte Root-Bridge, Redundanzpfade, Portrollen, Forwarding-/Konvergenzziele, Edge-Port-Schutz, VLAN-/Trunk-Abhängigkeiten, Monitoring, Notfallzugang und Rückbau.", "rationale": "Redundante Physik wird erst durch kontrollierte aktive und blockierte Logik verfügbar und sicher betreibbar."}, "STAFF-TARGET": {"active": true, "scope": "Teams überwachen Root-ID, Root-Port, Portzustände/-rollen, Topology-Changes, BPDU-Events, MAC-Moves, FDB-Aging, Broadcast-/Unknown-Unicast-Raten und Konvergenzzeit und testen Edge- und Root-Schutz.", "rationale": "Sie trennen eine legitime Topologieänderung von einer Schleife, einem Rootwechsel, einem fehlerhaften Trunk oder einer Anwendungslatenz anhand zeitlich korrelierter L2-Evidenz."}, "CHIEF-TARGET": {"active": true, "scope": "Die Organisation entscheidet Fabric-Topologie, L2-Reichweite, Redundanzmodell, Root-Ownership, Sicherheitskontrollen, Recovery, Standort-/Cloud-Grenzen und Lebenszyklus als gemeinsame Network-, Security- und Platform-Verantwortung.", "rationale": "Eine falsche Rootwahl oder unkontrollierte L2-Schleife kann breitflächige Störung verursachen; ungetestete Schutzmechanismen können zugleich legitime Recoverypfade blockieren."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "MSTP, SPB/802.1aq, vendor-specific RSTP variants, STP timers, LAG/MLAG interactions, bridge ASIC behavior, storm control, fabric automation, packet-level BPDU analysis und root-cause analysis bei komplexer physischer Topologie sind Spezialistentiefe.", "rationale": "Die Zielrollen müssen Absicht, Risiken und Erfolgsnachweise definieren; detaillierte Switch-/Fabric-Konfiguration und Herstellerinteroperabilität ist eine Netzwerk-Spezialistenaufgabe."}}, "lab_validation": [{"lab_id": "KB-0063-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox ohne Netzwerkzugriff", "evidence": "Root-Bridge-Wahl, Redundanzkante, Portrolle, Topologieänderung und Root-Guard-Fall als deterministische Fallarbeit geprüft.", "limitations": "Nicht ausgeführt; keine BPDU, keine L2-Schleife, keine Bridge, kein Switch, keine FDB, kein Broadcast, keine Schnittstelle, Firewall-, Cloud- oder Produktionsressource wurde verwendet oder verändert."}]}
---
# STP und Schleifenvermeidung

> **Ziel:** Redundante Layer-2-Links erhöhen Verfügbarkeit nur, wenn eine Schleifenvermeidungslogik aktiv bestimmt, welche Pfade weiterleiten und welche warten. STP/RSTP schützt Ethernet vor unendlichem Flooding, ersetzt aber weder Topologiedesign, Edge-Schutz noch observierbare Recovery.

## Purpose, Definition und Scope

Spanning Tree Protocol (STP) baut aus einer redundanten Layer-2-Topologie eine schleifenfreie logische Baumstruktur. Rapid Spanning Tree Protocol (RSTP) verbessert die Konvergenz gegenüber dem klassischen Modell. IEEE 802.1D definierte historisch MAC Bridges und Spanning Tree; moderne Bridging-Standards bündeln die relevante Weiterentwicklungen in IEEE 802.1Q.

Dieses Kapitel erklärt Root-Wahl, Portrollen, Portzustände, Topologieänderungen, Broadcast-Stürme, Konvergenz, Edge-Port-Schutz, BPDU Guard und Root Guard. Es betrachtet STP als Teil eines Layer-2-Vertrags, nicht als unüberwachtes Standardfeature.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | STP/RSTP wählt einen Root und blockiert ausgewählte redundante Weiterleitungspfade, um Loops zu verhindern. |
| HANDS-ON-TARGET | Das Lab modelliert Wahl und Schutzereignisse offline. |
| ARCHITECT-TARGET | Root, Pfade, Edge-Ports, Konvergenz, Schutz, Telemetrie und Rückbau sind explizite Designentscheidungen. |
| STAFF/PRINCIPAL | Teams prüfen Root- und Portzustand plus L2-Ausbreitungsmetriken statt nur Linkstatus. |
| CHIEF | Fabric-Resilienz und Sicherheitsgrenzen werden über Teams und Standorte hinweg gesteuert. |

## Mental Model: Redundanz ohne Blockierung ist eine Schleife

Ethernet-Frames besitzen typischerweise keine Hop-Limit-Information, die klassische L2-Loops allgemein beendet. Broadcasts und unbekannte Unicasts können daher über parallele Pfade wiederholt geflutet werden. MAC-Lernen wird instabil: dieselbe Quell-MAC erscheint abwechselnd auf mehreren Ports. Das erzeugt Broadcast-Sturm, FDB-Flapping, Paketverlust und hohe Last.

```text
     [bridge A]
       /     \
  link 1     link 2
     /         \
 [bridge B]---[bridge C]

Physical topology: triangle with redundant links
Logical STP topology: one link/port does not forward user frames
```

STP/RSTP verwandelt nicht jede physische Kante in einen aktiven Datenpfad. Es wählt kontrolliert einen Baum. Bei Ausfall kann ein vorher nicht weiterleitender Pfad aktiv werden. Verfügbarkeit entsteht durch dieses **getestete Umschalten**, nicht durch eine dauerhafte gleichzeitige L2-Weiterleitung über alle Redundanzkanten.

## Prerequisites und Dependencies

| ID | Art | Bedeutung |
|---|---|---|
| [KB-0050](02-ethernet-und-mac-weiterleitung.md) | Verständnis und Lab | MAC-FDB, Flooding und Broadcast-Ursache. |
| [KB-0061](13-vlan-und-broadcast-segmentierung.md) | Verständnis und Lab | VLAN- und Broadcast-Domäne. |
| [KB-0062](14-trunks-und-vlan-transport.md) | Verständnis und Lab | Redundante Trunk-/Transportpfade. |

## Core Concepts

### Root Bridge und Bridge ID

STP wählt eine Root Bridge. Vereinfacht gewinnt die niedrigste Bridge ID, die aus Priorität und einer eindeutigen MAC-bezogenen Komponente gebildet wird. Die konkrete Darstellung und Erweiterungen sind standard- und plattformabhängig; das Architekturprinzip bleibt: Der Root soll durch Absicht gewählt werden, nicht zufällig durch eine neu angeschlossene oder fehlkonfigurierte Bridge.

| Element | Zweck | Designfrage |
|---|---|---|
| Root Bridge | logischer Bezugspunkt des Baums | Ist sie in einem stabilen, sicheren und operativ geeigneten Teil der Topologie? |
| Root Port | bester Pfad einer Nicht-Root-Bridge zum Root | Ist Pfadkosten-/Redundanzentscheidung gewollt? |
| Designated Port | weiterleitender Port für ein Segment | Ist der erwartete aktive Pfad dokumentiert? |
| Alternate/Backup Port | redundanter Kandidat, der nicht regulär weiterleitet | Kann er kontrolliert und schnell übernehmen? |
| Path Cost | Auswahlkriterium für den Baum | Spiegelt es absichtliche Kapazitäts-/Topologiewahl statt Zufall? |
| Bridge Priority | beeinflusst Rootwahl | Ist sie geschützt gegen unerwartete Rootwechsel? |

Ein „niedrigerer Wert gewinnt“ ist kein ausreichendes Produktdesign. Rootplatzierung muss Strom-, Standort-, Management-, L3-Gateway-, Change- und Sicherheitsfehlerdomänen berücksichtigen.

### Portzustände und RSTP-Rollen

Das klassische STP-Modell kennt Zustände wie Blocking, Listening, Learning und Forwarding. Linux dokumentiert diese Zustände an Bridgeports: Ein Blocking-Port verarbeitet STP-BPDUs, leitet aber keine regulären Frames weiter; Learning aktualisiert MAC-Informationen, bevor der Port weiterleitet. RSTP verwendet in der Praxis die Zustandslogik Discarding, Learning und Forwarding und beschleunigt Übergänge über Rollen und Handshakes.

| Zustand | Datenweiterleitung | MAC-Lernen | Zweck |
|---|---:|---:|---|
| Disabled | nein | nein | Port nimmt nicht am STP-Forwarding teil. |
| Blocking / Discarding | nein | nein | Schleife vermeiden, BPDUs auswerten. |
| Listening | nein | nein | klassischer Übergang vor Learning. |
| Learning | nein | ja | FDB vorbereiten, bevor Frames weitergeleitet werden. |
| Forwarding | ja | ja | aktiver Datenpfad. |

Portrolle und Portzustand sind nicht dasselbe. Eine Rolle beschreibt die logische Funktion im Baum; der Zustand beschreibt, ob und wie der Port aktuell Frames verarbeitet. Incidentanalyse benötigt beides.

### BPDUs, Topologieänderung und FDB

Bridges tauschen Bridge Protocol Data Units (BPDUs) aus, um Root, Pfade und Portzustände zu bestimmen. Wenn sich Topologie ändert, muss der Baum konvergieren. MAC-/FDB-Informationen können dabei veralten und müssen zeitlich kontrolliert neu gelernt oder verworfen werden. Ohne diese Anpassung würden Frames zu alten Ports gesendet.

```text
topology change
  -> BPDU/control decision
  -> affected port role/state changes
  -> MAC/FDB entries age/flush as needed
  -> traffic relearns on active path
  -> application observes transient loss or reordering
```

Eine Konvergenz ist ein erwartetes Betriebsereignis, darf aber nicht unbeobachtet bleiben. Für kritische Services werden akzeptierte Unterbrechung, Packet Loss, MAC-Relearn-Last und nachgelagerte Protokollreaktion gemessen.

## Architecture und Data Flow

### Topologievertrag

```text
[physical links and trunks]
        |
[declared root / root priority and intended active paths]
        |
[STP/RSTP control plane: BPDUs, roles, states]
        |
[per-VLAN / segment forwarding result]
        |
[MAC/FDB, ARP/ND, DHCP, gateway and service traffic]
        |
[telemetry and incident / rollback workflow]
```

Ein Topologievertrag beschreibt:

- Ziele der Redundanz und die gewollte Root Bridge je Designbereich;
- erlaubte L2-Reichweite, VLAN-/Trunk-/LAG-Zuordnung und aktive/alternative Pfade;
- welche Ports Edge-/Host-, Uplink-, Downlink- oder untrusted Rollen haben;
- konfigurierten STP/RSTP/MSTP-Modus und Kompatibilitätsgrenzen;
- Schutz gegen unerwartete BPDUs und Rootwechsel;
- Konvergenzbudget für Workloads und Testplan;
- Monitoring, Notfallzugang, Changefenster und Rückbau.

### Edge-Port-Schutz: BPDU Guard und Root Guard

Edge-Ports erwarten im Normalfall Endgeräte, nicht weitere Bridges. Wenn dort BPDUs erscheinen, kann ein falscher Switch, ein Host mit Bridgefunktion, eine Schleife oder ein Angriff vorliegen. BPDU Guard kann einen Port bei BPDU-Empfang deaktivieren oder in einen geschützten Zustand bringen. Root Guard verhindert, dass ein untrusted Downstream-Port zum Root-Port wird und damit eine unerwünschte bessere Root-Information annimmt.

| Schutz | Geeigneter Einsatz | Fehlannahme vermeiden |
|---|---|---|
| BPDU Guard | Edge-/Hostport, auf dem keine Bridge erwartet wird | Nicht auf legitimen Uplink setzen; sonst blockiert man gewünschte Topologie. |
| Root Guard | Downstream-/untrusted Pfad, der nicht Root-Pfad werden darf | Schützt nicht gegen jede Schleife oder jede L3-Fehlroute. |
| PortFast/Edge-Weiterleitung | bekannte Endgeräte mit passendem Schutz | Schnell aktiv bedeutet nicht ohne BPDU-/Loopschutz. |
| Loop Guard / ähnliche Funktionen | spezifische Topologie-/BPDU-Verlustszenarien | Produktsemantik und Failoverwirkung vor Einsatz prüfen. |
| Storm Control | Begrenzung von Broadcast/Unknown-Unicast-Mengen | Eindämmt Symptome, ersetzt aber Root-Cause und STP nicht. |

Die genaue Namensgebung und das Verhalten variieren nach Plattform. Die Architekturentscheidung dokumentiert erwartete BPDUs, die Aktion bei Verletzung, verantwortliche Teams und Wiederfreigabe, bevor ein Port in Produktion geschützt wird.

## Scalability und Performance

STP-Scope und große L2-Domänen bestimmen, wie viele Geräte, VLANs, Trunks und MACs eine Topologieänderung betreffen kann. Eine schnelle Konvergenz ist nur wertvoll, wenn sie nicht durch unkontrollierte Flaps, Schleifen oder falsche Rootwechsel ausgelöst wird. Bei großen Fabrics kann ein Design mit stärkerer L3-Unterteilung oder Overlay-Control-Plane geeigneter sein, sofern dies die Gesamtkomplexität reduziert.

| Kennzahl | Aussage |
|---|---|
| Root ID und Root-Port-Verteilung | ungewollter Rootwechsel oder Path-Drift. |
| Portrollen/-zustände je VLAN/Instanz | erwartete aktive/alternative Kanten. |
| Topology-Change-Frequenz | Stabilität der Control Plane. |
| Konvergenzdauer | Auswirkung auf Workload- und Service-SLO. |
| MAC moves/FDB flushes | Loop, Mobility oder Topologieereignis. |
| Broadcast/unknown-unicast-Rate | Ausbreitung und möglicher Sturm. |
| BPDU Guard/Root Guard Events | untrusted Bridge, Fehlverkabelung oder Angriff. |
| CPU/Control-Plane-Last | Fähigkeit, Ereignisse unter Last zu verarbeiten. |

## Reliability und Failure Modes

| Fehlerbild | Ursacheklasse | Evidenz | Sofortmaßnahme | Dauerhafte Verbesserung |
|---|---|---|---|---|
| Broadcast-Sturm | Layer-2-Schleife oder Floodingfehler | pro-VLAN Counters, MAC flaps, CPU, Portzustände | betroffenen Port/Segment nach Runbook eingrenzen | Topologie-/Edge-Schutz, Drill und Kapazitätsgrenze. |
| unerwarteter Rootwechsel | Priorität, neue Bridge oder BPDU von untrusted Pfad | Root ID/Port timeline, BPDU logs | Rootwechsel begrenzen und Kontrollpfad sichern | stabile Rootplanung, Root Guard und Changepolicy. |
| legitimer Linkausfall verursacht lange Unterbrechung | Konvergenz-/Timer-/Portrollendesign | Link-, state-, FDB- und Service timeline | alternativen Pfad prüfen | RSTP-/Topologie-/Workloadtest. |
| Endgerät verliert Netz nach Anschluss | BPDU Guard ausgelöst | Guard event, Portstatus, Endpunkttyp | Endpunkt/Portrolle prüfen, nicht blind aktivieren | Edge-Policy und Wiederfreigabeprozess. |
| sporadische Paketverluste | Flapping, MAC moves, asymmetrische Topologie | zeitkorrelierte FDB/role/counter Daten | fehlerhafte Kante isolieren | Kabel-, LAG-, Virtualisierung- und STP-Design prüfen. |
| STP deaktiviert auf redundanter Fläche | bewusster oder versehentlicher fehlender Schutz | Config drift, loop symptoms | Traffic kontrolliert stoppen | Guardrails gegen unreviewed L2 redundancy. |

## Security, Governance und Compliance

STP-Informationen können eine Topologie beeinflussen. Ein untrusted Gerät mit BPDUs oder fehlerhafter Priorität kann unerwünschte Rootwahl oder Konvergenz auslösen. Schutz ist daher nicht nur Performanceoptimierung, sondern Teil von Access- und Netzwerksecurity.

| Risiko | Kontrolle |
|---|---|
| unerwartete Root Bridge | root priority absichtlich festlegen, Root Guard an passenden Downstreamgrenzen, Monitor Root-ID. |
| BPDU auf Hostport | BPDU Guard, Port-/Identity-Policy, dokumentierte Recovery. |
| physische oder virtuelle Schleife | Edge-/Loop-/Stormkontrollen, Topologiereview und Incidentrunbook. |
| unautorisierte STP-Änderung | Least Privilege, Change-Review, Audit und Soll-/Ist-Konfigurationsvergleich. |
| unklare Segmentausbreitung | minimale VLAN/Trunk-Sets, L3-/Identity-Policy und Traffictelemetrie. |
| forensische Lücke | zeitkorrelierte BPDU, Root, Portstate, FDB und Counters mit Owner und Retention. |

STP verschlüsselt keine Daten und autorisiert keine Clients. Compliancebedarf wird durch Asset- und Datenklassifikation, Zugriffsregeln, Verschlüsselung, Logging und Nachweis erfüllt, nicht durch einen Blocked-Port allein.

## Observability und Troubleshooting

### Ereignisschema

```text
timestamp, site/fabric, bridge ID, root ID, root port,
port role/state, VLAN/STP instance, path cost/priority,
BPDU source and type, topology-change flag,
MAC moves/FDB flushes, broadcast/unknown-unicast counters,
guard action, link/LAG state, DHCP/gateway/service correlation id
```

### Triage-Reihenfolge

1. **Scope definieren:** betroffene VLANs, Standorte, Bridges, Ports, Services und Zeitfenster.
2. **Rootzustand prüfen:** erwartete und beobachtete Root ID, Root Port und Bridge Priority vergleichen.
3. **Portrollen/-zustände lesen:** Forwarding/Discarding/Blocking/Learning und alternative Pfade an jedem betroffenen Segment bestimmen.
4. **Sturm oder Flap belegen:** Broadcast-/Unknown-Unicast, MAC moves, FDB events, CPU und Link-/LAG-Status korrelieren.
5. **BPDUs und Guard prüfen:** Quelle, Portrolle, Schutzaktion und jüngste Topologieänderung erfassen.
6. **L3/Dienst getrennt prüfen:** erst nach stabiler L2-Topologie Gateway, DHCP, DNS und Anwendungen untersuchen.
7. **Containment und Recovery:** eindeutig verantworteten Port/Pfad begrenzen; nach Ursache und Test kontrolliert wieder aufnehmen.

| Symptom | Zu prüfende Hypothese | Kein ausreichender Beleg |
|---|---|---|
| ganze Segmentgruppe instabil | Schleife oder Root-/Topologieflap | ein einzelner Pingfehler. |
| Root hat sich geändert | neue BPDU/Priorität oder ungeplanter Pfad | „Switch wurde neu gestartet.“ |
| Port blockiert | erwartete Schleifenvermeidung oder Guard | „Der Port ist kaputt.“ |
| Dienst wirkt langsam | Control-plane convergence oder Broadcastlast | reine CPU-/Anwendungsmetrik ohne L2-Timeline. |
| MAC wechselt Port | Mobility, LAG, VM oder Loop | eine MAC-Move-Zahl ohne Topologie-/Zeitkontext. |

## Cost und FinOps

L2-Redundanz kostet Ports, optische Strecken, Switchkapazität, Telemetrie, Testzeit, Spares und On-Call-Kompetenz. Der Kostenvorteil einer einfachen redundant verkabelten Topologie wird durch große Blast Radien und komplexe Incidents aufgehoben, wenn Root- und Guard-Policy nicht automatisiert nachweisbar sind. Sehr kleinteilige Fabrics können wiederum mehr Geräte-, Lizenz- und Operationskosten tragen.

Bewerte Kosten gegen nachgewiesenen Nutzen:

- Ausfallfolgen und Konvergenzbudget für geschäftskritische Segmente;
- Häufigkeit und Dauer von Topologieänderungen;
- Kosten physischer Redundanz gegenüber L3-/Overlayalternativen;
- Investition in Testautomation, Konfigurationsdrift und Übungsbetrieb;
- Sicherheits- und Forensikkosten eines unkontrollierten Rootwechsels.

## Trade-offs und Anti-Patterns

| Entscheidung | Gewinn | Preis | Leitplanke |
|---|---|---|---|
| STP auf redundanter L2-Fläche | Schleifenvermeidung | blockierte Reservepfade | aktive/alternative Rolle und Failover testen. |
| STP deaktivieren | vermeintlich einfache Weiterleitung | hohes Loop-/Stormrisiko | nur in explizit schleifenfreier, geprüfter Architektur. |
| RSTP/rasche Konvergenz | kürzere Unterbrechung | höhere Abhängigkeit von korrekten Rollen/Interop | kontrollierte Fabricstandards. |
| Edge-Forwarding | schneller Endpoint-Start | Looprisiko bei Bridgeanschluss | mit BPDU Guard und Portpolicy kombinieren. |
| Root Guard | Schutz vor untrusted Root | kann legitimen Recoverypfad blockieren | nur nach Topologieabsicht. |
| große L2-Domain | flexible L2-Mobilität | großer Ereignisradius | Kapazität, Security und Recovery nachweisen. |

Anti-Patterns:

- Rootwahl der niedrigsten zufälligen MAC überlassen.
- Redundante Links ohne aktiven Schleifen- oder Aggregationsvertrag in Betrieb nehmen.
- BPDU Guard auf echten Uplinks aktivieren oder an Edgeports weglassen.
- Blocked-Port als Fehler behandeln, ohne Rolle und Topologie zu prüfen.
- Root-/Topology-Change-/MAC-Move-Telemetrie nicht speichern.
- Ein Broadcast-Sturm nur mit Storm Control beruhigen und Ursache nicht entfernen.
- Layer-2-Probleme mit breiten L3-Ausnahmen oder Dienstrestarts verschleiern.

## Staff-, Principal- und Chief-Level Decisions

### Staff / Principal

- Definiere gewollte Root Bridges, aktive und alternative Pfade sowie Guardgrenzen als versionierten Topologievertrag.
- Baue Synthetics und Drills für Linkverlust, Rootwechsel, BPDU auf Edgeport, MAC-Flap und Broadcast-Sturm.
- Führe Root-/Port-/FDB-/Counterdaten in einer gemeinsamen Zeitachse zusammen, damit Security, Network und Application Teams dieselbe Evidenz nutzen.
- Verlange, dass jede Redundanzkante eine dokumentierte Schleifenvermeidungs- oder Aggregationsstrategie besitzt.
- Begrenze L2-Scope gezielt und eskaliere nicht jedes Mobilitätsproblem zu einer organisationsweiten Broadcast-Domain.

### Chief

- Setze ein Fabrictarget mit klarer L2-/L3-/Overlaygrenze, Rootownership und Recoveryzielen für Standorte und kritische Serviceklassen.
- Investiere in automatisierte Konfigurationsprüfung und realistische Incidentübungen, nicht nur in zusätzliche Links.
- Verbinde Networksecurity, Identity, physische Sicherheit und Platform-/Cloudtopologie in einem Segmentierungsprogramm.
- Entscheide, wann etablierte STP/RSTP-Modelle genügen und wann eine andere Fabricarchitektur das Risiko und die Operationskosten besser senkt.
- Fordere messbare Recovery und evidenzfähige Root-/Guardpolicy als Abnahmekriterium jeder Campus- oder Datacentererweiterung.

## Production Checklist

- [ ] Gewollte Root Bridge, Rootport und relevante Prioritäten sind pro Designbereich dokumentiert.
- [ ] Redundante Links haben eine geprüfte STP/RSTP-/Aggregation-/Topologiepolicy.
- [ ] Portrollen und Forwarding-/Blocking-/Discardingzustände stimmen mit Solltopologie überein.
- [ ] Edge-, Uplink- und untrusted-Portrollen sind eindeutig; BPDU-/Rootschutz ist passend aktiviert.
- [ ] Rootwechsel, BPDUs, Topology Changes, MAC moves/FDB events und Broadcast-/Unknown-Unicast-Raten werden überwacht.
- [ ] Konvergenzbudget ist pro kritischem Service messbar und bei Link-/Geräteausfall getestet.
- [ ] VLAN-/Trunk-/LAG-/MTU-Konfiguration stimmt über aktive und alternative Pfade überein.
- [ ] Guard-/Shutdown-Ereignisse besitzen Alert, Owner, Wiederfreigabe- und Forensikprozess.
- [ ] L3-, Identity- und Anwendungskontrollen ergänzen die L2-Segmentgrenze.
- [ ] Change-/Rollbackplan enthält Root- und Schutzwirkung sowie Notfallzugang.

## Praktisches Lab: Offline-Modell für Rootwahl, Redundanzkante und Guard

**Ziel:** Das Modell bestimmt eine gewollte Root Bridge und zeigt eine nicht weiterleitende Redundanzkante. Es erzeugt keine BPDU und verändert keine Netzwerkkomponente.

```python
bridges = {
    "core-a": {"priority": 4096, "mac": "00:00:00:00:00:01"},
    "access-b": {"priority": 32768, "mac": "00:00:00:00:00:02"},
    "access-c": {"priority": 32768, "mac": "00:00:00:00:00:03"},
}

def bridge_id(item):
    return (item["priority"], item["mac"])

root = min(bridges, key=lambda name: bridge_id(bridges[name]))
ports = {
    "access-b->core-a": "root/forwarding",
    "access-c->core-a": "root/forwarding",
    "access-b->access-c": "alternate/discarding",
}

def root_guard(received_root, expected_root):
    return "block-and-investigate" if received_root != expected_root and received_root < expected_root else "allow"

print({"root": root, "ports": ports})
print(root_guard((0, "00:00:00:00:00:99"), bridge_id(bridges[root])))
```

**Erwartete Auswertung:**

| Probe | Erwartung | Aussage |
|---|---|---|
| Rootwahl | `core-a` | Rootwahl folgt geplanter Priority-/ID-Ordnung. |
| Access-Link | `root/forwarding` | Jeder Access-Switch wählt seinen Pfad zum Root. |
| Querlink | `alternate/discarding` | Redundanz ist physisch vorhanden, aber verhindert eine Forwarding-Schleife. |
| bessere unerwartete Root-ID | `block-and-investigate` | Root Guard ist eine Policyentscheidung, keine generische Antwort auf jedes BPDU. |

**Negative Probes:**

1. Gib `access-c` eine niedrigere Priority. Dokumentiere den unerwarteten Rootwechsel und die notwendige Korrektur im Designvertrag.
2. Setze den Querlink auf `designated/forwarding`. Erkläre den Loop-Risikofall anhand von Broadcast/FDB-Flapping.
3. Simuliere eine BPDU auf einem Edgeport. Beschreibe, warum BPDU Guard dort den Port begrenzen darf, nicht aber auf einem legitimen Uplink.
4. Ergänze einen Linkausfall und aktiviere den vorher alternativen Link. Miss im Modell eine Konvergenzdauer, statt nur „Redundanz vorhanden“ zu behaupten.

**Cleanup:** Interpreter beenden und temporäre lokale Labdateien entfernen. Es wurden keine BPDUs, keine Loops, keine Bridges, Switches, FDBs, Schnittstellen, Firewalls, Cloud- oder Produktionsressourcen verändert.

## Interviewfragen mit Antwortkernen

1. **Warum sind L2-Schleifen so schädlich?**  
   Broadcast und unbekannte Unicasts können ohne allgemeines Hop Limit weiter geflutet werden. Zusätzlich flappen MAC-Einträge, was Last und Paketverlust erzeugt.

2. **Wie wird eine Root Bridge vereinfacht gewählt?**  
   Über die niedrigste Bridge ID, deren relevante Komponenten Priority und eindeutige MAC-bezogene Identität umfassen. In Produktion wird die gewollte Rootrolle bewusst geplant und geschützt.

3. **Was unterscheidet Portrolle und Portzustand?**  
   Die Rolle beschreibt die Funktion im Baum, etwa Root oder Alternate. Der Zustand beschreibt, ob der Port lernt oder weiterleitet, etwa Discarding, Learning oder Forwarding.

4. **Warum ist ein blocked/discarding Port nicht automatisch fehlerhaft?**  
   Er kann die gewünschte Reservekante sein, die eine Schleife verhindert und bei Ausfall aktiv werden soll. Entscheidend ist der Abgleich mit der Solltopologie.

5. **Wann ist BPDU Guard sinnvoll?**  
   An Edgeports, auf denen nur Endgeräte erwartet werden. Eine empfangene BPDU signalisiert dort eine unerwartete Bridge oder Schleifenmöglichkeit.

6. **Was verhindert Root Guard?**  
   Dass ein untrusted Downstream-Port durch eine bessere Rootinformation unerwartet zum Rootpfad wird. Es ersetzt nicht die gesamte Loop- oder Zugriffskontrolle.

7. **Welche Metriken zeigen eine instabile STP-Topologie?**  
   Root-/Portwechsel, Topology Changes, BPDU-/Guard-Ereignisse, MAC moves, FDB flushes, Broadcast-/Unknown-Unicast-Rate und Konvergenzdauer.

8. **Warum reicht Storm Control nicht als Schleifenschutz?**  
   Es begrenzt Trafficmengen, behebt aber weder falsche Root-/Portentscheidungen noch die Ursache einer L2-Schleife.

## Dependencies, Cross-References und Quellen

| Beziehung | Dokument | Nutzung |
|---|---|---|
| Voraussetzung | [KB-0050](02-ethernet-und-mac-weiterleitung.md) | Flooding und FDB. |
| Voraussetzung | [KB-0061](13-vlan-und-broadcast-segmentierung.md) | Segment-/Broadcast-Grenze. |
| Voraussetzung | [KB-0062](14-trunks-und-vlan-transport.md) | Redundante Trunks und Pfade. |
| Weiterführung | KB-0064 Link Aggregation und LACP | Bündelung statt unkontrollierter paralleler L2-Pfade. |
| Weiterführung | KB-0065 MLAG und Multi-Chassis-Design | Mehrchassis-Redundanz. |
| Weiterführung | KB-0066 VXLAN und Overlay-Netze | Fabric-/Overlayalternativen. |
| Nachweis | KB-0720 Portfolioevidenz und Reifemodelle | Topologievertrag und Drills. |

Primär- und Implementierungsquellen, abgerufen und inhaltlich geprüft am **2026-09-16**:

- [IEEE 802.1D – MAC bridges](https://www.ieee802.org/1/pages/802.1D.html)
- [IEEE 802.1Q – Bridges and Bridged Networks](https://standards.ieee.org/ieee/802.1Q/7073/)
- [Linux Kernel – Ethernet Bridging](https://docs.kernel.org/networking/bridge.html)
- [Linux bridge(8) – Port states, guard and root block](https://man7.org/linux/man-pages/man8/bridge.8.html)
- [RFC 6329 – IS-IS Extensions Supporting IEEE 802.1aq](https://www.rfc-editor.org/rfc/rfc6329)

## Bonus: New Tech and Innovations

Shortest Path Bridging und moderne Overlay-Fabrics können eine andere Antwort auf L2-Redundanz und Multipath geben als ein klassischer einzelner Spanning Tree. Sie verlagern Komplexität in Control Plane, Interoperabilität, Telemetrie und Fabric-Operations. Eine Architekturentscheidung muss nachweisen, dass sie den tatsächlichen Fehler- und Sicherheitsradius verringert und nicht nur mehr Pfade aktiviert.

Automatisierte Topologieerkennung und Intent-Verifikation können Root-/Port-/VLAN-Drift schneller sichtbar machen. Sie bleiben abhängig von vollständigen Inventar-, Telemetrie- und Berechtigungsdaten. Ein Alert ohne sichere Korrelation zu physischer und virtueller Topologie ist noch keine Recoveryfähigkeit.

Ein Pilot akzeptiert eine Schleifenvermeidungs- oder Fabricinnovation erst, wenn Topologie, Root-/Portwahl, Konvergenz, Edge-Schutz, Security, Observability, Fehlerszenarien und Rückbau unter realistischen Last- und Ausfallbedingungen nachgewiesen sind.

