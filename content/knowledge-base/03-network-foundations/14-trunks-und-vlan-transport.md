---
{"id": "KB-0062", "title": "Trunks und VLAN-Transport", "domain": "03", "sequence": 14, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE", "GENAI", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0050", "concepts": ["Ethernet-Frame", "MAC-FDB", "Weiterleitung"], "needed_for": "understanding"}, {"id": "KB-0057", "concepts": ["MTU", "Paketpfad", "Fehlerdiagnose"], "needed_for": "understanding"}, {"id": "KB-0061", "concepts": ["VLAN-Zugehörigkeit", "PVID", "Broadcast-Segment"], "needed_for": "both"}], "related": ["KB-0063", "KB-0064", "KB-0065", "KB-0066", "KB-0562", "KB-0720"], "applies": ["KB-0063", "KB-0064", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Das Lab modelliert erlaubte VLANs und die Konsistenz einer dreigliedrigen Trunkstrecke mit Python-Datenstrukturen.", "rationale": "Es sendet keine Frames und verändert keine Netzwerkschnittstelle, kein VLAN, keine Bridge, keinen Switch, Router, MTU-, Firewall-, Cloud- oder Produktionszustand."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein Trunkvertrag definiert Endpunkte, Zweck, erlaubte VLAN-/VNI-Mengen, tag-/untagged- und PVID-Policy, MTU, LAG-/Redundanzpfade, Security, Monitoring, Change und Rückbau.", "rationale": "Jede VLAN-Zugehörigkeit muss als durchgehender Pfad nachweisbar sein; eine Konfiguration an einem Linkende ist keine transportierte Mitgliedschaft."}, "STAFF-TARGET": {"active": true, "scope": "Teams vergleichen Soll- und Ist-Allowed-Listen pro Linkende und Hop, prüfen Tagged-/Untagged-Klassifikation, MAC-/ARP-/DHCP-/Gatewayfolge, MTU und Offload-Sichtbarkeit und testen fehlende beziehungsweise überbreite Transportpfade.", "rationale": "Sie unterscheiden fehlendes VLAN auf einem Trunk, PVID-/Native-Mismatch, LAG-Mitgliedsdrift, MTU-/Encapsulation-Problem, L3-Policy und falsche Observabilityannahme."}, "CHIEF-TARGET": {"active": true, "scope": "Die Organisation standardisiert Fabric- und Overlaygrenzen, Segmentownership, Automatisierung, Security, Lifecycle, Provider-/Hardwareabhängigkeiten und Betriebsresilienz für Trunk- und Transportdesigns.", "rationale": "Breite oder intransparente Trunks schaffen große Blast Radien; übermäßig komplexe Punktlösungen können Change- und Recoveryrisiken ebenso erhöhen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Q-in-Q/802.1ad, LACP/MLAG/vPC, STP/MSTP, hardware offload, SR-IOV/VF VLAN policy, DCB/PFC, VLAN pruning, VXLAN/EVPN/Geneve, packet capture an ASIC-Grenzen und Herstellerinteroperabilität sind Spezialistentiefe.", "rationale": "Die Zielrollen müssen Sicherheits-, Betriebs- und Architekturgrenzen bewerten; die detaillierte Fabric-Implementierung und Validierung liegt bei Netzwerk-/Virtualisierungsspezialisten."}}, "lab_validation": [{"lab_id": "KB-0062-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Python-Sandbox ohne Netzwerkzugriff", "evidence": "End-to-end Allowed-Set-Schnittmenge, Native-/PVID-Konsistenz und ein fehlendes VLAN auf einem Zwischenhop als deterministische Fallarbeit geprüft.", "limitations": "Nicht ausgeführt; keine Ethernetframes, Tags, Interfaces, Bridges, Switches, Router, MTU, Firewall-, Cloud- oder Produktionsressourcen wurden verwendet oder verändert."}]}
---
# Trunks und VLAN-Transport

> **Ziel:** Ein Trunk ist ein kontrollierter Transportpfad für mehrere Layer-2-Segmente. Er funktioniert nur, wenn VLAN-Zugehörigkeit, Tagged-/Untagged-Policy, Allowed Lists, MTU und Redundanzpfade über jeden Hop konsistent sind. Behandle ihn als vertraglichen Pfad, nicht als „Link mit allen VLANs“.

## Purpose, Definition und Scope

Ein Trunk transportiert Frames aus mehreren VLANs über eine Verbindung zwischen Switches, Bridges, Hypervisoren, Firewalls oder anderen Netzkomponenten. IEEE 802.1Q-Tags erlauben es, die VLAN-Zugehörigkeit am Transportpfad sichtbar zu machen. Auf einem Trunk wird üblicherweise eine explizite Liste erlaubter VLANs geführt; je nach Plattform werden untagged Frames durch PVID/native-VLAN-Policy eingeordnet oder verworfen.

Dieses Kapitel behandelt 802.1Q-Tags, Native VLAN, Allowed Lists und die Diagnose inkonsistenter VLAN-Zuordnung zwischen Switches. Es vertieft nicht die Topologieschleifen oder Link Aggregation selbst, verweist dafür aber auf Folgethemen.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Ein Trunk transportiert nur die VLANs, die beidseitig und über jeden Zwischenhop konsistent erlaubt und klassifiziert sind. |
| HANDS-ON-TARGET | Das Lab prüft Sets und Policies rein lokal. |
| ARCHITECT-TARGET | Jeder Transportpfad besitzt einen expliziten Zweck, eine geringe erlaubte Menge, MTU- und Rückbauvertrag. |
| STAFF/PRINCIPAL | Triage prüft jeden Hop und trennt L2-Transport, L3-Policy, MTU und Beobachtung. |
| CHIEF | Fabric- und Overlaystrategie verbindet Sicherheitsgrenzen, Betriebsmodell und Lieferantenrisiken. |

## Mental Model: Ein VLAN muss den ganzen Pfad überleben

```text
endpoint -> access classification -> switch A
         -> trunk A-B -> switch B
         -> trunk B-C -> gateway or destination

VLAN 120 usable only if:
  access classification = 120
  A-B allows 120 with compatible tag/PVID policy
  B-C allows 120 with compatible tag/PVID policy
  destination/gateway has VLAN 120 membership
```

Ein fehlender Eintrag auf einem einzigen Hop erzeugt oft ein asymmetrisches oder standortbezogenes Fehlerbild. Ein überbreiter Eintrag kann dagegen ein Segment über unnötige Topologie und Fehlerdomänen ausdehnen.

Die Transportebene beantwortet ausschließlich: „Kann ein Frame dieses VLAN mit seiner gewollten Klassifikation über diesen Link passieren?“ Sie beantwortet nicht: „Darf die Anwendung kommunizieren?“ Diese Frage folgt an L3, Firewall, Identity und Service.

## Prerequisites und Dependencies

| ID | Art | Bedeutung |
|---|---|---|
| [KB-0050](02-ethernet-und-mac-weiterleitung.md) | Verständnis | Ethernetframe, MAC-Lernen und Weiterleitung. |
| [KB-0057](09-udp-und-datagrammverhalten.md) | Verständnis | MTU und Pfadfehler als Transportdiagnose. |
| [KB-0061](13-vlan-und-broadcast-segmentierung.md) | Verständnis und Lab | VLAN-Zugehörigkeit, PVID und Broadcastgrenze. |

## Core Concepts

### 802.1Q-Tag und Framekontext

Ein 802.1Q-Tag trägt eine VLAN-Identifier-Information sowie Prioritäts-/Kennzeichnungsfelder im Ethernet-Kontext. Plattformen können Tags hardwareunterstützt einfügen oder entfernen. Daher kann der auf einem Host lokal aufgezeichnete Frame anders aussehen als das, was auf dem Draht transportiert wird. `ip link` dokumentiert beispielsweise VLAN-Offload und die mögliche Ausblendung des Headers beim Empfang.

| Begriff | Bedeutung | Prüfpflicht |
|---|---|---|
| tagged frame | VLAN-Zugehörigkeit ist im Transportframe markiert | tag nur akzeptieren, wenn Port und Allowed List ihn erlauben. |
| untagged frame | Zugehörigkeit folgt lokaler Port-/PVID-Policy | keine implizite Default-Zuordnung dulden. |
| native VLAN / PVID | Kontext für untagged Frames | beidseitige Policy und Drift prüfen. |
| Allowed List | explizit transportierbare VLANs | auf jedem Linkende und jedem Hop vergleichen. |
| VLAN pruning | Entfernen nicht benötigter VLANs vom Trunk | reduziert Ausbreitung, aber kann Pfade unterbrechen. |
| 802.1ad / Q-in-Q | zusätzliche Tag-Schicht für spezialisierte Modelle | MTU, Ownership und Interoperabilität separat bewerten. |

### Native VLAN: kein neutrales Fallback

Ein Native-VLAN-/PVID-Mismatch ist gefährlich, weil beide Linkenden untagged Frames gültig klassifizieren können, jedoch in unterschiedliche Segmente. Das Ergebnis kann zu Datenleckage, falschem DHCP, asymmetrischen Pfaden oder schwer reproduzierbaren Ausfällen führen.

Sichere Muster sind:

- untagged Verhalten nur dort zulassen, wo es ausdrücklich gebraucht wird;
- PVID/native VLAN auf beiden Enden als deklarierte Konfiguration prüfen;
- eine ungenutzte und nicht produktiv geroutete native Zuordnung nutzen, wenn dies zur Plattformpolicy passt;
- erwartete tagged VLANs als kleine allowlist führen;
- Access- und Trunk-Portrollen nicht automatisch aushandeln oder vermischen.

Die konkrete Option ist plattformabhängig. Entscheidend ist der belegbare Vertrag, nicht der Markenname einer Switchfunktion.

### Allowed Lists und Pfadschnittmenge

Für einen Pfad ist nicht die Vereinigung, sondern die Schnittmenge der erlaubten VLANs relevant:

```text
A-B allows {120, 130, 200}
B-C allows {120, 200}
C-D allows {120, 300}

end-to-end transportable = {120}
```

Das Modell muss zudem Tag-/PVID-Policy, Linkstatus, LAG-Mitglied, STP-/Forwardingstatus, MTU und Zielmitgliedschaft berücksichtigen. Eine „VLAN exists“ Ausgabe auf einem Switch ist daher kein End-to-End-Nachweis.

## Architecture und Data Flow

### Trunkvertrag

```text
[Segment contract]
  VLAN ID, L3 prefix/gateway, DHCP/DNS/NTP, access and security policy
        |
[Transport contract]
  endpoint pair, allowed VLAN set, tag/PVID policy, MTU,
  LAG/redundancy, forwarding state, monitoring, change owner
        |
[Path evidence]
  per-hop configuration + observed classification + functional test
```

Für jeden produktiven Trunk erfasse:

- Linkenden, Geräte-/Virtualisierungskontext und physische/virtuelle Topologie;
- zulässige VLAN-/VNI-Menge mit Segmentowner und Ablaufdatum für Übergangseinträge;
- Tagged-/Untagged-/PVID-/native-VLAN-Policy;
- MTU einschließlich Tag- oder Overlay-Overhead sowie PMTU-/Failure-Plan;
- LAG-/Redundanzpfade und die Gleichheit ihrer Policies;
- MAC-/ARP-/DHCP-/Gateway- und L3-Policy-Beobachtung;
- Freigabe, Rückbau und Notfallzugang.

### Ein standardisierter Change

1. Segmentvertrag und tatsächlichen Quell-/Zielpfad festlegen.
2. VLAN und Gateway-/DHCP-/DNS-Policy vor Transportfreigabe validieren.
3. Allowed Set auf allen nötigen Hops deklarativ erweitern; PVID/native VLAN unverändert und bewusst prüfen.
4. End-to-End Test mit erlaubtem und verbotenem VLAN/Flow durchführen.
5. MTU, MAC-Lernen, Broadcast-/Unknown-Unicast, DHCP und Gatewaymetrik beobachten.
6. Übergangs-VLAN nach gemessenem Abschluss und dokumentiertem Rückbau wieder entfernen.

## MTU, Encapsulation und Offloading

802.1Q- und Overlay-Kapselung fügen Header hinzu. Ob eine Netzwerkkarte oder ein virtueller Switch das Tag lokal einfügt/entfernt, beeinflusst Capture und Interface-MTU-Anzeige. Der Architektursatz lautet nicht „vier Byte sind immer egal“, sondern: Die End-to-End-MTU einschließlich aller Encapsulationen, LAG-/Firewall-/Tunnelpfade und Offload-Sichtbarkeit muss für die tatsächliche Workload nachgewiesen werden.

| Symptom | Mögliche Ursache | Nachweis |
|---|---|---|
| kleine Requests funktionieren, große nicht | MTU-/PMTU-/Encapsulation-Grenze | größenbezogener Test, ICMP-/ICMPv6- und Interface-/Tunnel-MTU-Telemetrie. |
| Capture zeigt keinen VLAN-Tag | NIC-/Kernel-Offload blendet ihn lokal aus | Offloadstatus, Capturepunkt und Draht-/Switchsicht vergleichen. |
| nur Overlaypfad fehlerhaft | zusätzlicher Header/Unterlayroute | effektive MTU und Tunnelpolicy je Pfad vergleichen. |
| unterschiedliches Verhalten im LAG | Policy-/MTU-Drift pro Mitglied | jedes aktive Mitglied und Hashpfad prüfen. |

Details zu PMTU und Datagrammgrenzen stehen in [KB-0057](09-udp-und-datagrammverhalten.md); Overlayentwicklung wird in späteren Fabricartikeln vertieft.

## Scalability und Performance

Breite Trunks können große Mengen von Broadcast, Multicast, Unknown-Unicast und MAC-Lerneinträgen in viele Topologieabschnitte tragen. Restriktive Listen begrenzen dies, aber starke Änderungen können Migration und Fehlersuche erschweren. Die Steuerung braucht eine Lebenszyklusregel: Jeder erlaubte Eintrag benötigt Zweck, Owner und eine regelmäßige Entfernung ungenutzter Transportfreigaben.

| Kennzahl | Aussage |
|---|---|
| erlaubte VLANs pro Trunk und deren Alter | Breite/Drift und Übergangsreste. |
| VLAN-/PVID-Mismatch-Events | potenzielles Segmentierungs- oder Sicherheitsproblem. |
| MAC/FDB pro VLAN und MAC moves | Transport- und Topologiegesundheit. |
| Broadcast/unknown-unicast pro VLAN | Ausbreitung und L2-Fehlerlast. |
| MTU-/fragment-/PMTU-Signale | Kapselungs- und Pfadgrenzen. |
| LAG-Mitgliedskonformität | Symmetrie und Redundanzqualität. |
| End-to-end Synthetics | tatsächliche Segment-/Gateway-/Dienstwirkung. |

## Reliability und Failure Modes

| Fehlerbild | Ursacheklasse | Diagnose | Sofortmaßnahme | Vorbeugung |
|---|---|---|---|---|
| VLAN nur lokal erreichbar | fehlt auf Zwischenhop | allowed set pro Hop vergleichen | nur nötigen Pfad korrigieren | Soll-/Ist-Driftprüfung. |
| falsches Segment bei untagged Verkehr | PVID/native mismatch | Klassifikation an beiden Enden | Link-/Portpolicy begrenzen | native Policy explizit und getestet. |
| sporadischer Ausfall | LAG-Mitglied oder redundanter Pfad weicht ab | Hash-/Mitgliedskorrelation | fehlerhaftes Mitglied isolieren | Bündel als ein Konfigurationsobjekt prüfen. |
| große Pakete scheitern | MTU/Overlayoverhead | größenabhängige Messung | Workloadrisiko begrenzen | End-to-end MTU-Vertrag. |
| unerwartete L2-Reichweite | Allowed List zu breit | Pfad- und MAC-/VLAN-Beleg | unnötige Einträge entfernen | minimale Listen, Owner, Ablauf. |
| VLAN in Capture unsichtbar | Offload-/Capturepunkt | Offloadstatus und alternativer Messpunkt | Diagnose korrigieren | Runbook zu Capturesemantik. |

## Security, Governance und Compliance

Ein Trunk ist eine hochprivilegierte Transportgrenze: Ein versehentlich erlaubtes VLAN kann einen Segmentpfad öffnen, den die Sicherheitsarchitektur nicht vorgesehen hat. Ein native-VLAN-Mismatch kann untagged Traffic in den falschen Kontext einordnen. Schutz besteht aus klaren Portrollen, minimalen Allowed Lists, getrennten Administrationrechten, Change-Review, Konfigurationsbackups, Driftkontrolle und ergänzenden L3-/Identity-/Application-Kontrollen.

| Risiko | Kontrollmaßnahme |
|---|---|
| unautorisierter VLAN-Transport | minimale, ownergebundene allowlist und kontinuierlicher Soll-/Ist-Abgleich. |
| untagged Fehlklassifikation | native/PVID explizit, keine Autonegotiation ohne Policy, Test an beiden Enden. |
| Trunk an untrusted endpoint | Portrolle und NAC/physical security; keine pauschale Trunkfreigabe. |
| Konfigurationsdrift | deklarative Quelle, Review, Audit, Backup und automatischer Vergleich. |
| Datendurchsatz über falsche Zone | L3-Firewall, Identity und Encryption zusätzlich zum L2-Segment. |
| Diagnoseblindheit durch Offload | Dokumentierte Capturepunkte und Privilegien für erforderliche Sicht. |

## Observability und Troubleshooting

### Ereignisschema

```text
timestamp, path/change id, device and port pair, port role,
allowed VLAN set digest, PVID/native policy, tagged/untagged counters,
forwarding/LAG member state, MTU/offload state, MAC/FDB and ARP/ND evidence,
DHCP relay/pool, gateway and L3 policy outcome, source/destination context
```

### Triage-Reihenfolge

1. **Segmentvertrag festlegen:** erwartete VLAN-ID, Quelle, Ziel, Gateway, Portrollen, erlaubter Flow.
2. **Endpunktklassifikation prüfen:** Access-PVID oder tagged Erwartung am Ursprung nachvollziehen.
3. **Jeden Transporthop prüfen:** erlaubte Liste, PVID/native Policy, Link-/Forwardingstatus und redundante Mitglieder vergleichen.
4. **L2-Belege aufnehmen:** MAC/FDB, ARP/ND, Broadcast-/Unknown-Unicast und DHCP-Transit pro VLAN prüfen.
5. **MTU/Offload einbeziehen:** Paketgröße und Capturepunkt bewerten, nicht aus einem taglosen Hostcapture schließen.
6. **L3 und Dienstpfad getrennt prüfen:** Gateway, Firewall, Identity, DNS und Anwendungstest.
7. **Änderung begrenzen:** Nur den belegten Fehlhop oder Übergangseintrag korrigieren und Rückbau dokumentieren.

## Cost und FinOps

Trunks beeinflussen Kosten über Fabricportkapazität, Gateway-/Firewalllast, Overlay-/Tunneloverhead, Automatisierung, Telemetrie, Changezeit und Incidentauswirkung. Eine „alles auf allen Uplinks“-Policy senkt kurzfristig Konfigurationsaufwand, erhöht aber Risiko und forensischen Aufwand. Ein sehr granularer Pfad reduziert Reichweite, benötigt jedoch verlässliche Automatisierung und Tests.

Messe pro Segment-/Trunkklasse: Nutzung, erlaubte Menge, Alter temporärer Ausnahmen, Testaufwand, Incidentzeit, MTU-/Overlaykosten und verbleibendes Risiko. Kostenoptimierung darf weder minimalen Transportpfad noch den Nachweis eines sicheren Rückbaus streichen.

## Trade-offs und Anti-Patterns

| Entscheidung | Gewinn | Preis | Leitplanke |
|---|---|---|---|
| alle VLANs erlauben | schneller Erstaufbau | große Fehler-/Securitydomäne | nur kurzfristige, genehmigte Migration mit Ablauf. |
| minimale Allowlist | geringe Reichweite | mehr Changekoordination | deklarative Pfadvorlagen und Tests. |
| untagged native Verkehr | Legacy-/Endpoint-Kompatibilität | Mismatch- und Leakage-Risiko | explizit, beidseitig, möglichst begrenzt. |
| Tagging überall | klare Transportsemantik | Endpunkt-/Legacykompatibilität | nicht ohne Portrollenkonzept. |
| Hardware offload | Leistung | weniger offensichtliches Capturebild | Observability/Runbook anpassen. |
| Overlay transport | Skalierung über L3 | MTU/Control-Plane/Operationskomplexität | Gesamtdesign statt Punktfeature. |

Anti-Patterns:

- Einer Trunkverbindung pauschal alle VLANs zuweisen.
- Nur ein Linkende oder eine Switchausgabe prüfen.
- Native/PVID als unbenannte Standardoption behandeln.
- LAG-Mitglieder mit unterschiedlicher VLAN-/MTU-Policy betreiben.
- Fehlende Tags in einem Hostcapture als Beweis gegen VLAN-Transport lesen.
- Ein Trunkproblem mit einer breiten Firewallregel überdecken.
- Temporäre Migrationseinträge ohne Owner und Ablaufdatum behalten.

## Staff-, Principal- und Chief-Level Decisions

### Staff / Principal

- Erstelle aus Segment- und Trunkverträgen maschinenprüfbare Sollzustände für Links, Hops, MTU und LAG-Mitglieder.
- Nutze Ende-zu-Ende-Synthetics für erlaubte und verbotene Pfade; Konfigurationsvergleich allein genügt nicht.
- Behandle native/PVID-Policy und Capture-/Offload-Semantik als fester Teil von Designreviews und Runbooks.
- Mache temporäre Ausnahmen sichtbar, ownergebunden und automatisch ablaufend.
- Plane Layer-2- und Overlaytransport mit derselben Disziplin für Sicherheit, Observability und Rückbau.

### Chief

- Lege ein Fabric- und Overlay-Zielbild fest, das Sicherheitsgrenzen, Standort-/Cloudmodelle, Betriebsrollen und Providerabhängigkeiten abbildet.
- Finanziere Automatisierung, Konsistenzprüfung und Training als Voraussetzungen für feingranulare Segmentierung.
- Bewerte Trunk- und Overlayentscheidungen nach tatsächlichem Blast Radius, Recoveryzeit und Securitywirkung statt nur nach Portauslastung.
- Fordere standardisierte Change- und Incidentdaten über Network, Platform, Security und Cloud hinweg.
- Steuere den Übergang von historischen „all VLANs everywhere“-Muster zu minimalen, nachweisbaren Pfaden als mehrwelliges Risikoprogramm.

## Production Checklist

- [ ] Quell-/Zielgeräte, Topologie, Segmentowner und Trunkzweck sind dokumentiert.
- [ ] Allowed VLANs sind auf jedem Linkende und Zwischenhop minimal, identisch und geprüft.
- [ ] PVID/native-VLAN-/tagged-/untagged-Policy ist explizit und getestet.
- [ ] LAG-/Redundanzmitglieder haben gleiche VLAN-, MTU- und Security-Policy.
- [ ] L3-Präfix, Gateway, DHCP/DNS/NTP und Inter-VLAN-Policy passen zum transportierten Segment.
- [ ] MTU einschließlich Tag-/Overlayoverhead ist end-to-end validiert; Captureoffload ist bekannt.
- [ ] MAC/FDB, ARP/ND, Broadcast/Unknown-Unicast und Change-/Driftereignisse sind beobachtbar.
- [ ] Untrusted Endpoints erhalten keine unkontrollierte Trunkrolle.
- [ ] Temporäre Transportfreigaben besitzen Owner, Ende und getesteten Rückbau.
- [ ] Zulässige und verbotene Flows sind von allen relevanten Endpunkten geprüft.

## Praktisches Lab: Offline-Modell für Allowed Sets und Pfadkonsistenz

**Ziel:** Das Lab berechnet die transportierbare VLAN-Menge aus mehreren Hops. Es konfiguriert keine Schnittstelle.

```python
links = {
    "A-B": {"allowed": {120, 130, 200}, "pvid": 999},
    "B-C": {"allowed": {120, 200}, "pvid": 999},
    "C-D": {"allowed": {120, 300}, "pvid": 999},
}

def path_vlans(path):
    sets = [links[name]["allowed"] for name in path]
    return set.intersection(*sets)

def native_consistent(path):
    return len({links[name]["pvid"] for name in path}) == 1

path = ["A-B", "B-C", "C-D"]
print({"end_to_end": sorted(path_vlans(path)),
       "native_consistent": native_consistent(path)})
```

**Erwartete Auswertung:**

| Probe | Erwartung | Aussage |
|---|---|---|
| Pfadschnittmenge | nur VLAN 120 | Ein VLAN muss an jedem Hop erlaubt sein. |
| PVID-Prüfung | `True` | Konsistente native Policy ist ein überprüfbarer Vertrag. |
| VLAN 130 von A nach D | nicht transportierbar | Seine Präsenz auf A-B ist kein Ende-zu-Ende-Nachweis. |
| PVID auf B-C ändern | `False` | Ungleiches untagged Verhalten ist ein Mismatchrisiko. |

**Negative Probes:**

1. Entferne VLAN 120 aus B-C und dokumentiere den präzisen Fehlhop statt alle Links zu ändern.
2. Füge VLAN 300 nur auf A-B hinzu. Begründe, warum dies die Pfadschnittmenge nicht erweitert.
3. Ändere den PVID eines Links und beschreibe die mögliche Fehlklassifikation untagged Frames.
4. Ergänze eine `mtu_ok`-Variable pro Link. Zeige, dass auch eine korrekte Allowlist ohne einheitlichen MTU-Vertrag unzureichend ist.

**Cleanup:** Interpreter beenden und temporäre lokale Labdateien löschen. Es wurden keine Frames, VLANs, MTUs, Interfaces, Bridges, Switches, Router, Firewalls, Cloud- oder Produktionsressourcen verändert.

## Interviewfragen mit Antwortkernen

1. **Was ist ein Trunk?**  
   Ein kontrollierter Link, der mehrere Layer-2-Segmente transportiert. Seine Funktion hängt von tag-/untagged-Policy, erlaubten VLANs und durchgängiger Pfadkonsistenz ab.

2. **Warum genügt die Konfiguration eines Linkendes nicht?**  
   Das VLAN muss über beide Enden und jeden Zwischenhop erlaubt und korrekt klassifiziert sein. Der engste bzw. fehlende Hop bestimmt den End-to-End-Erfolg.

3. **Was ist das Risiko eines Native-VLAN-Mismatch?**  
   Untagged Frames können an den Linkenden unterschiedlichen Segmenten zugeordnet werden, was Fehlrouting, falsches DHCP oder Datenleckage erzeugen kann.

4. **Warum kann ein Packet Capture keinen VLAN-Tag zeigen, obwohl VLAN-Transport aktiv ist?**  
   Kernel oder NIC können VLAN-Offload nutzen und den Tag vor dem Capture einfügen oder nach Empfang entfernen. Capturepunkt und Offloadstatus gehören zur Evidenz.

5. **Wie wirkt sich ein fehlendes VLAN auf einem LAG-Mitglied aus?**  
   Der Fehler kann abhängig vom Hashpfad sporadisch sein. Alle aktiven Mitglieder benötigen denselben Sollzustand.

6. **Warum braucht ein Trunk einen MTU-Vertrag?**  
   Tags und Overlays erhöhen Kapselung. Bei inkonsistentem Budget scheitern manche Paketgrößen, obwohl kleine Tests funktionieren.

7. **Was bedeutet VLAN pruning?**  
   Nicht benötigte VLANs werden vom Trunk entfernt. Das reduziert Reichweite und Risiko, verlangt aber einen zuverlässigen Pfad- und Migrationsnachweis.

8. **Ist ein minimaler Trunk automatisch sicher?**  
   Er reduziert L2-Reichweite, ersetzt aber keine L3-/Identity-/Application-Policy und keine saubere Konfigurationssicherheit.

## Dependencies, Cross-References und Quellen

| Beziehung | Dokument | Nutzung |
|---|---|---|
| Voraussetzung | [KB-0050](02-ethernet-und-mac-weiterleitung.md) | Frame- und FDB-Grundlage. |
| Voraussetzung | [KB-0057](09-udp-und-datagrammverhalten.md) | MTU und Pfadfehler. |
| Voraussetzung | [KB-0061](13-vlan-und-broadcast-segmentierung.md) | VLAN-Segmentvertrag. |
| Weiterführung | KB-0063 STP, RSTP und Schleifenvermeidung | L2-Forwarding und Loops. |
| Weiterführung | KB-0064 Link Aggregation und LACP | Redundante Linkbündel. |
| Weiterführung | KB-0066 VXLAN und Overlay-Netze | Overlaytransport und Skalierung. |
| Nachweis | KB-0720 Portfolioevidenz und Reifemodelle | Prüffähige Trunkverträge. |

Primär- und Implementierungsquellen, abgerufen und inhaltlich geprüft am **2026-09-16**:

- [IEEE 802.1Q – Bridges and Bridged Networks](https://standards.ieee.org/ieee/802.1Q/7073/)
- [Linux ip-link(8) – VLAN interfaces and offload context](https://man7.org/linux/man-pages/man8/ip-link.8.html)
- [Linux bridge(8) – VLAN filtering and bridge state](https://man7.org/linux/man-pages/man8/bridge.8.html)
- [Linux Kernel – Ethernet Bridging documentation](https://docs.kernel.org/networking/bridge.html)
- [RFC 8926 – Geneve Generic Network Virtualization Encapsulation](https://www.rfc-editor.org/rfc/rfc8926)

## Bonus: New Tech and Innovations

Overlaymechanismen wie Geneve können Metadaten für Netzwerkvirtualisierung mit einer Layer-3-Underlay-Architektur verbinden. Ihre Flexibilität macht einen klaren Daten-/Control-Plane-Vertrag, MTU-Budget, Security-Policy und eine beobachtbare Gatewaystrategie wichtiger, nicht weniger wichtig.

Hardware-Offload und SmartNIC-/DPU-Funktionen können Tagging, Encapsulation und Policy beschleunigen. Sie verändern jedoch oft, wo ein Frame sichtbar ist und welche Softwaretelemetrie noch vollständig ist. Ein Performanceprojekt wird erst produktionsreif, wenn die Sichtbarkeit für Betrieb und Forensik nachgewiesen bleibt.

Ein Pilot akzeptiert eine neue Trunk- oder Transportfunktion erst, wenn Tagged-/Untagged-Policy, Allowed Sets, MTU, Redundanz, Security, Observability, Migration und Rückbau über den vollständigen Pfad nachgewiesen sind.

