---
{"id": "KB-0106", "title": "Partitionierung und Datenverteilung", "domain": "05", "sequence": 6, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0103", "concepts": ["Replikation"], "needed_for": "understanding"}], "related": ["KB-0107", "KB-0562", "KB-0720"], "applies": ["KB-0107", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Range-, Hash- und Verzeichnispartitionierung lokal simulieren und Hotspot-Effekte erzeugen.", "rationale": "Kein Cluster nötig, um Verteilungsungleichheit zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Partitionierungsschema anhand Zugriffsmuster, Wachstum und Hotspot-Risiko begründet wählen.", "rationale": "Falsche Wahl erzeugt Hotspots, die erst bei Skalierung sichtbar werden."}, "STAFF-TARGET": {"active": true, "scope": "Einen Hotspot anhand von Zugriffsverteilung pro Partition diagnostizieren.", "rationale": "Ungleiche Last ist eine häufige, aber diagnostizierbare Skalierungsursache."}, "CHIEF-TARGET": {"active": true, "scope": "Rebalancing-Fähigkeit als Pflichtkriterium für jedes System mit erwartetem Datenwachstum verlangen.", "rationale": "Ohne Rebalancing-Pfad wird eine anfänglich gute Partitionierung zur Wachstumsbremse."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konsistentes Hashing im Detail und automatisiertes Online-Rebalancing sind Vertiefung.", "rationale": "Kern ist das Verständnis der drei Grundschemata und ihres Hotspot-Risikos."}}, "lab_validation": [{"lab_id": "KB-0106-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Hash- versus Range-Partitionierung", "evidence": "Sequenzielle Schlüssel (Zeitstempel) erzeugen bei Range-Partitionierung einen Hotspot auf der letzten Partition; Hash-Partitionierung verteilt dieselben Schlüssel gleichmäßig.", "limitations": "Kein reales Datenbanksystem, keine echte Last, keine Produktion."}]}
---
# Partitionierung und Datenverteilung

> **Ziel:** Partitionierung verteilt Daten auf mehrere Knoten, um Speicher- und Durchsatzgrenzen einzelner Knoten zu überwinden. Range-, Hash- und Verzeichnispartitionierung unterscheiden sich in Hotspot-Risiko, Bereichsabfrage-Effizienz und Rebalancing-Aufwand — es gibt kein universell bestes Schema.

## Zweck, Mental Model und Dependencies

Range-Partitionierung sortiert Schlüssel in zusammenhängende Bereiche pro Partition — gut für Bereichsabfragen, anfällig für Hotspots bei sequenziellen Schlüsseln (z. B. Zeitstempel, auto-increment IDs), da neue Schreibvorgänge immer dieselbe letzte Partition treffen. Hash-Partitionierung verteilt Schlüssel über eine Hashfunktion gleichmäßig — vermeidet Hotspots, zerstört aber Bereichsabfrage-Lokalität. Verzeichnispartitionierung führt eine explizite Zuordnungstabelle — flexibel, aber die Tabelle selbst wird zum potenziellen Engpass/Single-Point. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0103](03-replikationsmodelle-und-konflikte.md).

~~~text
range:      [A-F]->P1  [G-M]->P2  [N-S]->P3  [T-Z]->P4     (sequential keys -> hotspot on one partition)
hash:       hash(key) % N -> Pn                              (even distribution, no range scans)
directory:  lookup_table[key] -> Pn                           (flexible, lookup table is critical path)
~~~

## Core Concepts, Architektur und Implementierung

| Schema | Hotspot-Risiko | Bereichsabfragen | Rebalancing-Komplexität |
|---|---|---|---|
| Range | hoch bei sequenziellen Schlüsseln | effizient | moderat (Bereichsgrenzen verschieben) |
| Hash | niedrig | ineffizient (Scatter-Gather nötig) | einfacher mit konsistentem Hashing |
| Verzeichnis | abhängig von Zuordnungslogik | abhängig von Design | hohe Flexibilität, Tabelle als Engpass |

Implementierung: Bei Range-Partitionierung sequenzielle Schlüssel vermeiden oder durch Präfixierung (z. B. Hash-Präfix vor Zeitstempel) entschärfen. Bei Hash-Partitionierung konsistentes Hashing statt einfachem Modulo verwenden, damit Rebalancing nicht fast alle Schlüssel neu verteilt. Bei jedem Schema: Partitionsgröße überwachen und einen getesteten Rebalancing-Pfad vor Produktivsetzung nachweisen.

## Scalability, Reliability, Security und Observability

Ungleiche Partitionsgrößen (Hotspots) begrenzen die effektive Skalierung, selbst wenn genug Knoten vorhanden sind — der überlastete Knoten wird zum Flaschenhals, unabhängig von der Gesamtkapazität des Clusters. Reliability-Grenze: Rebalancing selbst ist ein riskanter Vorgang (Datenverschiebung unter Last); ohne getesteten, überwachten Prozess kann es neue Hotspots oder Datenverlust erzeugen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Partition/ein Knoten deutlich stärker belastet | sequenzielle Schlüssel bei Range-Partitionierung | Zugriffsverteilung pro Partition/Schlüsselpräfix messen |
| Bereichsabfrage sehr langsam | Hash-Partitionierung zerstört Schlüssel-Lokalität | Scatter-Gather-Kosten über beteiligte Partitionen prüfen |
| Rebalancing verschiebt fast alle Daten | einfaches Modulo-Hashing statt konsistentem Hashing | Anteil verschobener Schlüssel bei Knotenänderung berechnen |
| Verzeichnistabelle wird selbst zum Engpass | zentrale Lookup ohne Caching/Replikation | Lookup-Latenz und Fehlerquote der Zuordnungstabelle prüfen |

Security: Partitionsgrenzen können Mandantentrennung unterstützen oder gefährden — eine falsch konfigurierte Hash-Funktion kann Mandantendaten unvorhersehbar mischen. Observability korreliert Größe/Last pro Partition, Rebalancing-Ereignisse und Latenzverteilung über Partitionsgrenzen hinweg.

## Trade-offs und Entscheidungen

**Staff** misst tatsächliche Zugriffsverteilung vor der Partitionierungsentscheidung, statt Hotspot-Risiko theoretisch abzuschätzen. **Principal** definiert Standardschema (meist Hash mit konsistentem Hashing) und verlangt explizite Begründung plus Rebalancing-Test für Range-Partitionierung. **Chief** verlangt einen nachgewiesenen Rebalancing-Pfad als Voraussetzung für Produktivfreigabe jedes Systems mit erwartetem signifikantem Datenwachstum.

Anti-Patterns: Range-Partitionierung mit sequenziellen Schlüsseln ohne Präfixierung; einfaches Modulo-Hashing bei erwartetem Knotenwachstum (erzwingt fast vollständige Neuverteilung); Partitionierungsschema ohne Messung realer Zugriffsmuster wählen.

## Production Checklist

- [ ] Zugriffsmuster (sequenziell vs. gleichverteilt, Bereichsabfragebedarf) vor Schemawahl gemessen.
- [ ] Konsistentes Hashing statt einfachem Modulo bei Hash-Partitionierung mit erwartetem Wachstum.
- [ ] Rebalancing-Pfad unter simulierter Last getestet, nicht nur theoretisch beschrieben.
- [ ] Monitoring für Größe/Last pro Partition mit Alarmschwelle vorhanden.

## Interviewfragen

### 1. Warum erzeugen sequenzielle Schlüssel bei Range-Partitionierung einen Hotspot?

**Antwort:** Alle neuen Schreibvorgänge landen wegen der aufsteigenden Reihenfolge in derselben, meist letzten Partition, während ältere Partitionen kaum noch Last erhalten.

### 2. Was ist der Nachteil von Hash-Partitionierung?

**Antwort:** Bereichsabfragen (z. B. „alle Einträge zwischen X und Y“) verlieren ihre Lokalität und erfordern ein Scatter-Gather über potenziell alle Partitionen.

### 3. Warum ist konsistentes Hashing besser als einfaches Modulo bei wachsendem Cluster?

**Antwort:** Einfaches Modulo (key % N) verändert bei jeder Änderung von N fast alle Zuordnungen; konsistentes Hashing minimiert die Anzahl der bei Knotenänderung tatsächlich verschobenen Schlüssel.

### 4. Wie erkennst du einen Hotspot in Produktion?

**Antwort:** Über ungleiche Last-/Größenmetriken pro Partition, korreliert mit dem Schlüsselverteilungsmuster (z. B. Zeitstempel-Präfix).

### 5. Was ist der Nachteil einer Verzeichnispartitionierung?

**Antwort:** Die Zuordnungstabelle selbst wird zu einer kritischen Komponente, die Latenz, Verfügbarkeit und Konsistenz des gesamten Systems beeinflusst, wenn sie nicht selbst skaliert und abgesichert ist.

### 6. Widersprüchliche Anforderung: Produkt will effiziente Bereichsabfragen UND garantiert keine Hotspots — wie gehst du vor?

**Antwort:** Ich würde eine Hybridlösung vorschlagen, z. B. Range-Partitionierung mit einem zufälligen oder Hash-Präfix vor dem sequenziellen Schlüssel, um Bereichsabfragen innerhalb eines Präfix-Buckets zu erhalten und gleichzeitig Last über mehrere Buckets zu streuen.

## Praktische Labs

~~~python
def range_partition(key, boundaries):
    for i, b in enumerate(boundaries):
        if key <= b:
            return i
    return len(boundaries)

keys = list(range(1000, 1010))  # sequential timestamps
partitions = [range_partition(k, [1002, 1005, 1008]) for k in keys]
hotspot = partitions.count(max(set(partitions), key=partitions.count)) > len(keys) / 2
assert hotspot
print("Sequential keys concentrate on a single range partition, confirming the hotspot risk.")
~~~

## Dependencies, Cross-References und Quellen

1. Karger et al.: [Consistent Hashing and Random Trees](https://www.akamai.com/site/en/documents/technical-publication/consistent-hashing-and-random-trees-distributed-caching-protocols-for-relieving-hot-spots-on-the-world-wide-web-technical-publication.pdf), STOC 1997, abgerufen 2026-09-17.

Produktspezifische Partitionierungsdefaults und Rebalancing-Mechanik vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisiertes Online-Rebalancing in verwalteten Datenbanken | Established je Anbieter | Rebalancing-Verhalten unter realer Last vor Vertrauen testen. |
| Adaptive/dynamische Partitionsgrenzen statt statischer Schemata | Adopting | Beobachtbarkeit und Vorhersagbarkeit der automatischen Anpassung prüfen. |

Ein Team akzeptiert ein Partitionierungsschema erst, wenn reale Zugriffsmuster gemessen, Hotspot-Risiko bewertet und ein Rebalancing-Pfad unter Last getestet wurden.
