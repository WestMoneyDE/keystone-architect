---
{"id": "KB-0211", "title": "Ceph und verteilte Speicherpools", "domain": "09", "sequence": 17, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "CLOUD"], "requires": [{"id": "KB-0208", "concepts": ["Objektspeicher"], "needed_for": "understanding"}, {"id": "KB-0209", "concepts": ["Block Storage"], "needed_for": "understanding"}], "related": ["KB-0210"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein vereinfachtes CRUSH-artiges Platzierungsmodell lokal implementieren, das Failure Domains berücksichtigt.", "rationale": "Das Prinzip algorithmischer, deterministischer Datenplatzierung ohne zentrale Lookup-Tabelle wird erst durch Implementierung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Replikation gegenüber Erasure Coding für einen konkreten Speicherpool begründet wählen, basierend auf Kapazitätseffizienz- und Recovery-Verkehr-Trade-offs.", "rationale": "Beide Redundanzstrategien haben fundamental unterschiedliche Kapazitäts- und Recovery-Kosten."}, "STAFF-TARGET": {"active": true, "scope": "Erhöhten Recovery-Netzwerkverkehr nach einem Knotenausfall auf Erasure-Coding-Wiederherstellungskosten statt auf ein Netzwerkproblem zurückführen können.", "rationale": "Erasure-Coding-Recovery erzeugt strukturell mehr Netzwerkverkehr als Replikations-Recovery, was ohne dieses Wissen falsch diagnostiziert wird."}, "CHIEF-TARGET": {"active": true, "scope": "Ceph als Infrastrukturentscheidung für einheitliche Object-, Block- und File-Dienste auf gemeinsamer verteilter Speicherbasis positionieren, mit ihren Betriebskosten.", "rationale": "Ceph bietet Flexibilität über drei Speicherarten, erfordert aber erhebliche Betriebsexpertise für Failure-Domain-Design und Recovery-Tuning."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "CRUSH-Map-Tuning-Details und PG-Anzahl-Optimierung sind Vertiefung.", "rationale": "Kern ist das Verständnis von Failure Domains, Replikation vs. Erasure Coding, nicht Cluster-Tuning-Feinheiten."}}, "lab_validation": [{"lab_id": "KB-0211-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für CRUSH-artige, failure-domain-bewusste Datenplatzierung", "evidence": "Ein deterministischer Platzierungsalgorithmus kann Datenreplikate über unterschiedliche Failure Domains verteilen, ohne eine zentrale Lookup-Tabelle zu benötigen.", "limitations": "Kein echtes Ceph-Cluster, keine reale Recovery-Verkehrsmessung, keine Produktion."}]}
---
# Ceph und verteilte Speicherpools

> **Ziel:** Ceph bietet eine einheitliche, verteilte Speicherbasis (RADOS) für Object-, Block- und File-Dienste, die Daten über CRUSH — einen deterministischen Platzierungsalgorithmus ohne zentrale Lookup-Tabelle — über explizit definierte Failure Domains verteilt. Die Wahl zwischen Replikation und Erasure Coding für einen Speicherpool ist ein bewusster Trade-off zwischen Kapazitätseffizienz und Recovery-Netzwerkverkehr.

## Zweck, Mental Model und Dependencies

RADOS (Reliable Autonomic Distributed Object Store) ist die zugrunde liegende Speicherschicht von Ceph, auf der Object-, Block- (RBD) und File-Dienste (CephFS) aufsetzen — alle drei nutzen dieselbe verteilte Objektspeicherbasis, was Ceph von spezialisierten Einzelzweck-Speichersystemen unterscheidet. CRUSH (Controlled Replication Under Scalable Hashing) berechnet die Platzierung jedes Datenobjekts algorithmisch aus einer Cluster-Topologie-Map, statt eine zentrale Metadaten-Lookup-Tabelle zu pflegen — das vermeidet einen zentralen Flaschenhals und Single Point of Failure bei der Objektlokalisierung. Failure Domains (z. B. Host, Rack, Rechenzentrum) werden explizit in der CRUSH-Map definiert, damit Replikate oder Erasure-Coding-Fragmente bewusst über unabhängige Ausfallgrenzen verteilt werden, statt zufällig auf Knoten zu landen, die denselben Stromkreis oder dieselbe Netzwerkverbindung teilen. Lies [KB-0208](14-object-storage.md) und [KB-0209](15-block-storage.md).

~~~text
Central lookup table:  object location -> query metadata server -> bottleneck, single point of failure
CRUSH:                  object location -> deterministic function of cluster topology map -> no lookup needed, no bottleneck
Failure domain awareness: replicas/fragments placed across independent failure boundaries (host, rack, datacenter)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Failure-Domain-Design | sind Replikate/Fragmente über unabhängige Ausfallgrenzen verteilt? | Replikate landen auf Knoten, die denselben Stromkreis/Rack/Netzwerkpfad teilen, gleichzeitiger Ausfall aller Kopien möglich |
| Replikation vs. Erasure Coding | ist die Redundanzstrategie bewusst nach Kapazitäts-/Recovery-Trade-off gewählt? | Erasure Coding für latenzkritische, häufig geänderte Daten gewählt, unnötiger Recovery-Overhead |
| Recovery-Verkehr | ist der Netzwerkverkehr bei Knotenausfall-Recovery im Kapazitätsplan berücksichtigt? | unerwartet hoher Recovery-Verkehr überlastet das Cluster-Netzwerk bei Knotenausfall |
| PG-Verteilung (Placement Groups) | sind Placement Groups gleichmäßig über das Cluster verteilt? | ungleiche PG-Verteilung erzeugt Kapazitäts-Hotspots auf einzelnen Knoten |

Implementierung: Failure Domains werden in der CRUSH-Map explizit auf der höchsten sinnvollen Ebene definiert (typischerweise Host oder Rack), damit ein einzelner Hardware-Ausfall nicht mehrere Kopien derselben Daten gleichzeitig betrifft. Replikation (mehrere vollständige Kopien) wird für latenzkritische, häufig geänderte Daten gewählt, da sie schnellere Reads/Writes und schnellere Recovery bei Ausfällen bietet; Erasure Coding (Daten in Fragmente mit Paritätsinformation aufgeteilt) wird für kapazitätskritische, seltener geänderte Daten gewählt, da es deutlich weniger Rohkapazität für dieselbe Ausfallsicherheit benötigt, aber bei Recovery mehr Netzwerkverkehr und Rechenleistung erfordert (Fragmente müssen aus mehreren Quellen rekonstruiert werden).

## Scalability, Reliability, Security und Observability

Ceph skaliert horizontal durch Hinzufügen weiterer Knoten, wobei CRUSH die Datenverteilung automatisch anpasst, ohne eine zentrale Instanz zu überlasten. Reliability-Grenze: unzureichendes Failure-Domain-Design ist ein latentes Risiko, das erst bei einem korrelierten Ausfall (z. B. Stromausfall eines ganzen Racks) sichtbar wird, wenn mehrere vermeintlich unabhängige Replikate gleichzeitig verschwinden.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| mehrere Datenreplikate fallen bei einem einzelnen Hardware-Ereignis gleichzeitig aus | Failure-Domain-Design platziert Replikate nicht über unabhängige Ausfallgrenzen | CRUSH-Map auf tatsächliche Failure-Domain-Zuordnung der betroffenen Replikate prüfen |
| Recovery nach Knotenausfall erzeugt unerwartet hohe Netzwerklast | Erasure-Coding-Pool erfordert Rekonstruktion aus mehreren verteilten Fragmenten | Recovery-Verkehr für den betroffenen Pool gegen die erwartete Erasure-Coding-Rekonstruktionslast vergleichen |
| bestimmte Knoten zeigen deutlich höhere Kapazitätsauslastung als andere | Placement Groups sind ungleichmäßig über das Cluster verteilt | PG-Verteilung nach Knoten prüfen und gegen erwartete Gleichverteilung vergleichen |
| Latenz für häufig geänderte Daten ist höher als erwartet | Daten liegen in einem Erasure-Coding-Pool statt einem Replikations-Pool | Pool-Typ für die betroffenen Daten gegen das tatsächliche Änderungsmuster prüfen |

Security: Ceph-Zugriffskontrolle (CephX-Authentifizierung) muss konsistent für alle drei Dienstarten (Object, Block, File) konfiguriert werden, da unterschiedliche Zugriffspfade sonst inkonsistente Sicherheitsgrenzen erzeugen können. Observability: PG-Status (aktiv/degradiert/wiederherstellend), Recovery-Verkehr und Kapazitätsverteilung pro Knoten sind zentrale Diagnosewerkzeuge für Ceph-Cluster-Gesundheit.

## Trade-offs und Entscheidungen

**Staff** definiert Failure Domains explizit auf Host- oder Rack-Ebene statt Standardkonfiguration zu übernehmen. **Principal** macht den Recovery-Verkehr-Trade-off zwischen Replikation und Erasure Coding für das Team im Kapazitätsplan sichtbar. **Chief** positioniert Ceph als Infrastrukturentscheidung für einheitliche Multi-Dienst-Speicherung mit realen Betriebskosten, nicht als kostenlose Universallösung.

Anti-Patterns: Failure-Domain-Design ignorieren und Standardkonfiguration ohne Prüfung übernehmen; Erasure Coding für latenzkritische, häufig geänderte Daten wählen, ohne den Recovery-Overhead zu bedenken; Ceph ohne ausreichende Betriebsexpertise für CRUSH-Map-Design einführen.

## Production Checklist

- [ ] Failure Domains sind explizit in der CRUSH-Map auf sinnvoller Ebene (Host/Rack) definiert.
- [ ] Redundanzstrategie (Replikation vs. Erasure Coding) ist pro Pool bewusst nach Zugriffsmuster gewählt.
- [ ] Recovery-Netzwerkverkehr bei Knotenausfall ist im Kapazitätsplan berücksichtigt.
- [ ] Placement-Group-Verteilung wird auf Gleichmäßigkeit überwacht.

## Interviewfragen

### 1. Was ist der Vorteil von CRUSH gegenüber einer zentralen Metadaten-Lookup-Tabelle?

**Antwort:** CRUSH berechnet die Objektplatzierung algorithmisch aus der Cluster-Topologie, ohne eine zentrale Lookup-Instanz abzufragen — das vermeidet einen zentralen Flaschenhals und Single Point of Failure bei der Objektlokalisierung.

### 2. Warum ist Failure-Domain-Design in Ceph kritisch für echte Ausfallsicherheit?

**Antwort:** Ohne explizite Failure-Domain-Definition können Replikate auf Knoten landen, die dieselbe physische Ausfallgrenze (z. B. Stromkreis, Rack) teilen — ein einzelnes Hardware-Ereignis könnte dann mehrere vermeintlich unabhängige Kopien gleichzeitig zerstören.

### 3. Was ist der zentrale Trade-off zwischen Replikation und Erasure Coding?

**Antwort:** Replikation bietet schnellere Reads/Writes und schnellere Recovery, benötigt aber mehr Rohkapazität; Erasure Coding ist kapazitätseffizienter, erfordert aber mehr Netzwerkverkehr und Rechenleistung bei der Recovery, da Fragmente aus mehreren Quellen rekonstruiert werden müssen.

### 4. Wie diagnostizierst du unerwartet hohen Netzwerkverkehr nach einem Ceph-Knotenausfall?

**Antwort:** Ich prüfe zuerst, ob die betroffenen Daten in einem Erasure-Coding-Pool liegen — Erasure-Coding-Recovery erzeugt strukturell mehr Netzwerkverkehr als Replikations-Recovery, da Fragmente aus mehreren verteilten Quellen rekonstruiert werden müssen.

### 5. Warum bietet Ceph eine einheitliche Speicherbasis für drei unterschiedliche Speicherarten?

**Antwort:** Object-, Block- (RBD) und File-Dienste (CephFS) setzen alle auf derselben verteilten RADOS-Objektspeicherschicht auf, was gemeinsame Skalierungs- und Redundanzmechanismen über alle drei Zugriffsarten hinweg ermöglicht.

### 6. Widersprüchliche Anforderung: Team will maximale Kapazitätseffizienz (Erasure Coding überall) UND minimale Recovery-Zeit bei Knotenausfällen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass dies ein struktureller Zielkonflikt ist — Erasure Coding ist kapazitätseffizienter, aber langsamer bei der Recovery; ich würde vorschlagen, latenz- und recovery-kritische Pools auf Replikation zu belassen und nur kapazitätskritische, seltener geänderte Pools auf Erasure Coding umzustellen, statt eine einzelne Strategie für widersprüchliche Ziele zu erzwingen.

## Praktische Labs

~~~python
import hashlib

# Simplified CRUSH-like deterministic placement respecting failure domains
hosts = {
    "rack1": ["host1", "host2"],
    "rack2": ["host3", "host4"],
    "rack3": ["host5", "host6"],
}

def place_replicas(object_id, num_replicas=3):
    racks = list(hosts.keys())
    placements = []
    for i in range(num_replicas):
        # deterministic hash-based selection, one replica per distinct rack (failure domain)
        h = int(hashlib.sha256(f"{object_id}-{i}".encode()).hexdigest(), 16)
        rack = racks[h % len(racks)]
        while rack in [p[0] for p in placements]:  # enforce distinct failure domain per replica
            i += 1
            h = int(hashlib.sha256(f"{object_id}-{i}".encode()).hexdigest(), 16)
            rack = racks[h % len(racks)]
        host = hosts[rack][h % len(hosts[rack])]
        placements.append((rack, host))
    return placements

placements = place_replicas("obj-42")
assert len(set(rack for rack, host in placements)) == 3  # all 3 replicas in distinct racks
print(f"Replicas placed across distinct failure domains: {placements}")
~~~

## Dependencies, Cross-References und Quellen

1. Weil et al.: [CRUSH: Controlled, Scalable, Decentralized Placement of Replicated Data](https://ceph.io/assets/pdfs/weil-crush-sc06.pdf), 2006, abgerufen 2026-09-17.
2. Ceph: [Architecture Documentation](https://docs.ceph.com/en/latest/architecture/), abgerufen 2026-09-17.
3. Ceph: [Erasure Coding Documentation](https://docs.ceph.com/en/latest/rados/operations/erasure-code/), abgerufen 2026-09-17.

Ceph-Versionsdetails und CRUSH-Map-Syntax vor Einsatz an aktueller Dokumentation prüfen. Kubernetes-Speicherintegration wird in [KB-0212](18-kubernetes-speicherentscheidungen.md) vertieft.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| BlueStore-Backend für direkten Block-Device-Zugriff ohne Dateisystem-Zwischenschicht | Established | Performancegewinn gegenüber älteren Backends bei Neuaufsetzung standardmäßig nutzen. |
| Managed-Ceph-Angebote in Cloud-Umgebungen zur Reduktion des Betriebsaufwands | Adopting | Betriebsaufwandsersparnis gegen reduzierte CRUSH-Map-Kontrolle abwägen. |

Ein Team akzeptiert ein Ceph-Speicherdesign erst, wenn Failure-Domain-Zuordnung nachweisbar geprüft und Recovery-Verkehr-Trade-off dokumentiert sind.
