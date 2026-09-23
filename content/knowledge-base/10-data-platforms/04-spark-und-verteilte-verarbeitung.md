---
{"id": "KB-0222", "title": "Spark und verteilte Verarbeitung", "domain": "10", "sequence": 4, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "GENAI", "MLOPS"], "requires": [{"id": "KB-0221", "concepts": ["Zustandsbehaftete Streams"], "needed_for": "understanding"}], "related": ["KB-0219"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Modell für Datenskew-Erkennung bei Partitionsverteilung lokal implementieren.", "rationale": "Der Effekt von Datenskew auf Verarbeitungszeit wird erst durch konkrete Partitionsgrößen-Analyse greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Partitionierungsstrategie und Clusterressourcen für einen konkreten Spark-Job begründet dimensionieren.", "rationale": "Falsche Partitionierung erzeugt Skew oder ineffiziente Ressourcennutzung."}, "STAFF-TARGET": {"active": true, "scope": "Eine überproportional lange Job-Laufzeit auf Datenskew in wenigen Partitionen statt auf allgemein unzureichende Clusterressourcen zurückführen können.", "rationale": "Ein einzelner überladener Task kann die Gesamtlaufzeit dominieren, während der restliche Cluster größtenteils untätig ist."}, "CHIEF-TARGET": {"active": true, "scope": "Verteilte Verarbeitung mit Spark als bewusste Investition in Ausführungsplan-Verständnis positionieren, nicht als Black-Box-Skalierungslösung.", "rationale": "Shuffle-Kosten, Skew und Speicherdruck erfordern aktives Verständnis des Ausführungsplans, nicht nur mehr Clusterressourcen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Catalyst-Optimizer-Interna und Tungsten-Speichermanagement sind Vertiefung.", "rationale": "Kern ist das Verständnis von Partitionierung, Shuffle und Skew, nicht die interne Optimizer-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0222-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Datenskew-Erkennung bei ungleicher Partitionsgrößenverteilung", "evidence": "Eine stark ungleiche Verteilung von Datensätzen über Partitionen führt dazu, dass ein einzelner Task deutlich länger läuft als alle anderen, was die Gesamtlaufzeit des Jobs dominiert, unabhängig von der Gesamtclusterkapazität.", "limitations": "Kein echtes Spark-Cluster, keine reale Shuffle-Operation, keine Produktion."}]}
---
# Spark und verteilte Verarbeitung

> **Ziel:** Apache Spark verteilt Berechnung über Partitionen einer verteilten Datenmenge, aber Shuffle-Operationen (Datenumverteilung über das Netzwerk) und Datenskew (ungleiche Partitionsgrößen) bestimmen die tatsächliche Job-Performance stärker als die reine Clustergröße. Ausführungsplan-Verständnis ist eine notwendige Fähigkeit, nicht optional — mehr Clusterressourcen lösen Skew- oder Shuffle-Probleme nicht automatisch.

## Zweck, Mental Model und Dependencies

Spark verteilt eine Datenmenge über Partitionen, die parallel auf verschiedenen Cluster-Knoten verarbeitet werden — solange eine Operation nur Daten innerhalb derselben Partition benötigt (z. B. eine einfache Filterung), bleibt die Verarbeitung lokal und effizient. Sobald eine Operation Daten aus mehreren Partitionen zusammenführen muss (z. B. eine Aggregation nach Schlüssel oder ein Join), ist ein Shuffle nötig: Daten werden über das Netzwerk neu verteilt, sodass Datensätze mit demselben Schlüssel in derselben Partition landen — das ist eine der teuersten Operationen in Spark, da sie Netzwerk-I/O, Serialisierung und oft Festplattenzugriff erfordert. Datenskew tritt auf, wenn die Verteilung der Schlüsselwerte stark ungleich ist (z. B. ein Schlüsselwert, der 40 % aller Datensätze umfasst) — nach einem Shuffle landet dann ein unverhältnismäßig großer Anteil der Daten in wenigen Partitionen, deren Verarbeitung die Gesamtlaufzeit des Jobs dominiert, während der Rest des Clusters bereits fertig und untätig ist. Der Ausführungsplan (von Spark durch den Catalyst-Optimizer erzeugt) zeigt, welche Operationen Shuffles auslösen und wie Daten partitioniert werden — dieses Verständnis ist notwendig, um Performanceprobleme gezielt zu diagnostizieren, statt blind mehr Ressourcen hinzuzufügen. Lies [KB-0221](03-flink-und-zustandsbehaftete-streams.md).

~~~text
Narrow operation (filter, map):  stays within partition -> cheap, no network transfer
Wide operation (groupBy, join):  requires SHUFFLE -> network transfer + re-partitioning -> expensive
Even distribution: N partitions finish roughly together
Skewed distribution: 1-2 partitions dominate runtime -> more cluster resources DON'T fix skew, only reduce parallel headroom
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Shuffle-Vermeidung | werden teure Shuffle-Operationen bewusst minimiert (z. B. durch Broadcast Joins bei kleinen Tabellen)? | unnötige Shuffles bei vermeidbaren Operationen erzeugen unnötigen Netzwerk- und I/O-Overhead |
| Datenskew-Erkennung | ist die Schlüsselwertverteilung vor einer Shuffle-Operation auf Skew geprüft? | wenige überladene Partitionen dominieren die Gesamtlaufzeit, unabhängig von Clustergröße |
| Partitionsanzahl-Dimensionierung | ist die Anzahl der Partitionen an die tatsächliche Datenmenge und Clustergröße angepasst? | zu wenige Partitionen unternutzen den Cluster, zu viele erzeugen Overhead durch Task-Verwaltung |
| Speicherdruck | ist Cache-/Speichernutzung gegen die tatsächliche Executor-Speicherkapazität dimensioniert? | Speicherdruck erzwingt Spilling auf Festplatte, was die Performance drastisch verschlechtert |

Implementierung: Shuffle-intensive Operationen werden bewusst minimiert — z. B. durch Broadcast Joins, wenn eine der beiden zu verbindenden Datenmengen klein genug ist, um vollständig an jeden Executor verteilt zu werden, statt einen vollen Shuffle-Join durchzuführen. Datenskew wird proaktiv geprüft, indem die Verteilung der Schlüsselwerte vor einer Aggregations- oder Join-Operation analysiert wird; bei erkanntem Skew werden Techniken wie Salting (künstliche Aufteilung überladener Schlüssel in mehrere Sub-Schlüssel) eingesetzt. Die Partitionsanzahl wird explizit an Datenmenge und Clustergröße angepasst, statt Standardwerte unreflektiert zu übernehmen. Speichernutzung wird überwacht, um Spilling (Auslagerung von Zwischenergebnissen auf Festplatte wegen Speicherdrucks) zu vermeiden oder bewusst zu akzeptieren, wenn Speicherkapazität begrenzt ist.

## Scalability, Reliability, Security und Observability

Spark skaliert gut für gleichmäßig verteilte Daten über viele parallele Partitionen, verschlechtert sich aber nichtlinear bei Datenskew, da zusätzliche Cluster-Ressourcen die überladenen Partitionen nicht automatisch entlasten — mehr parallele Kapazität hilft nur den nicht-überladenen Partitionen, die bereits schnell fertig sind. Reliability-Grenze: starker Speicherdruck durch unzureichend dimensionierte Partitionierung kann zu Out-of-Memory-Fehlern oder drastischer Verlangsamung durch Spilling führen, was einen Job scheitern lassen oder unverhältnismäßig lange laufen lassen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Job läuft deutlich länger als erwartet, obwohl die meisten Tasks schnell abschließen | Datenskew konzentriert einen großen Anteil der Daten in wenigen Partitionen | Verteilung der Task-Ausführungszeiten und Partitionsgrößen prüfen, nach Ausreißern suchen |
| Job schlägt mit Out-of-Memory-Fehlern fehl oder wird durch häufiges Spilling extrem langsam | Speicherdruck durch unzureichend dimensionierte Partitionierung oder zu aggressives Caching | Executor-Speichernutzung und Spilling-Metriken im Ausführungsplan prüfen |
| Join-Operation ist unerwartet langsam trotz kleiner beteiligter Datenmenge | Shuffle-Join wird verwendet, obwohl ein Broadcast Join möglich und günstiger wäre | Ausführungsplan auf Join-Strategie prüfen, Größe der beteiligten Datenmengen für Broadcast-Eignung bewerten |
| Cluster-Auslastung ist über weite Teile der Job-Laufzeit sehr ungleichmäßig | Partitionsanzahl ist nicht an Clustergröße angepasst, zu wenige Partitionen unternutzen parallele Kapazität | Partitionsanzahl gegen verfügbare Executor-Kernanzahl vergleichen |

Security: Spark-Jobs, die auf sensible Daten zugreifen, sollten Zugriffskontrolle konsistent mit der zugrunde liegenden Datenquelle durchsetzen, insbesondere bei Zwischenergebnissen, die temporär auf Festplatte gespillt werden und dort ebenfalls geschützt sein müssen. Observability: Ausführungsplan-Visualisierung (Spark UI), Task-Laufzeitverteilung, Shuffle-Datenmenge und Spilling-Häufigkeit sind zentrale Diagnosewerkzeuge für Spark-Job-Performanceprobleme.

## Trade-offs und Entscheidungen

**Staff** minimiert Shuffle-Operationen bewusst durch geeignete Join-Strategien. **Principal** macht Skew- und Speicherdruck-Diagnosen für das Team über den Ausführungsplan nachvollziehbar, statt reflexhaft Clusterressourcen zu erhöhen. **Chief** positioniert verteilte Verarbeitung als bewusste Investition in Ausführungsplan-Verständnis, nicht als Black-Box-Skalierungslösung.

Anti-Patterns: bei Job-Performanceproblemen reflexhaft mehr Clusterressourcen hinzufügen, ohne Skew oder Shuffle-Kosten zu diagnostizieren; Shuffle-Join verwenden, wo ein Broadcast Join günstiger wäre; Partitionsanzahl nie an tatsächliche Datenmenge und Clustergröße anpassen.

## Production Checklist

- [ ] Shuffle-intensive Operationen sind auf Vermeidbarkeit (z. B. Broadcast Join) geprüft.
- [ ] Schlüsselwertverteilung ist vor Shuffle-Operationen auf Skew geprüft.
- [ ] Partitionsanzahl ist explizit an Datenmenge und Clustergröße angepasst.
- [ ] Speichernutzung und Spilling-Häufigkeit werden überwacht.

## Interviewfragen

### 1. Was ist ein Shuffle in Spark, und warum ist er teuer?

**Antwort:** Ein Shuffle tritt auf, wenn eine Operation Daten aus mehreren Partitionen zusammenführen muss (z. B. groupBy oder Join); Daten werden über das Netzwerk neu verteilt, was Netzwerk-I/O, Serialisierung und oft Festplattenzugriff erfordert — deutlich teurer als Operationen, die innerhalb einer Partition bleiben.

### 2. Was ist Datenskew, und warum lösen mehr Clusterressourcen dieses Problem nicht automatisch?

**Antwort:** Datenskew ist eine stark ungleiche Verteilung von Schlüsselwerten, die nach einem Shuffle dazu führt, dass wenige Partitionen einen unverhältnismäßig großen Datenanteil enthalten; mehr Ressourcen helfen nur den bereits schnellen, nicht-überladenen Partitionen — die überladenen Partitionen bleiben der begrenzende Faktor.

### 3. Wann ist ein Broadcast Join einem Shuffle-Join vorzuziehen?

**Antwort:** Wenn eine der beiden zu verbindenden Datenmengen klein genug ist, um vollständig an jeden Executor verteilt zu werden, vermeidet ein Broadcast Join den teuren Shuffle vollständig, da keine Datenumverteilung über das Netzwerk nötig ist.

### 4. Wie diagnostizierst du, warum ein Spark-Job deutlich länger läuft als erwartet, obwohl die meisten Tasks schnell abschließen?

**Antwort:** Ich prüfe die Verteilung der Task-Ausführungszeiten und Partitionsgrößen auf Ausreißer — eine stark ungleichmäßige Verteilung deutet auf Datenskew hin, bei dem wenige überladene Partitionen die Gesamtlaufzeit dominieren.

### 5. Was passiert bei Speicherdruck in Spark, und warum ist das problematisch?

**Antwort:** Bei unzureichendem Speicher wird Spilling erzwungen — Zwischenergebnisse werden auf Festplatte statt im Speicher gehalten, was die Performance drastisch verschlechtert oder im Extremfall zu Out-of-Memory-Fehlern und Job-Fehlschlag führt.

### 6. Widersprüchliche Anforderung: Team will minimale Clusterkosten durch möglichst wenige Executor-Knoten UND garantiert vorhersehbare, kurze Job-Laufzeiten unabhängig von Datenskew — wie gehst du vor?

**Antwort:** Ich würde erklären, dass minimale Ressourcen und garantiert kurze Laufzeiten bei vorhandenem Skew im Konflikt stehen, da zusätzliche Ressourcen Skew nicht beheben; ich würde vorschlagen, zuerst Skew durch Techniken wie Salting zu adressieren, um die Datenverteilung zu verbessern, und erst danach die minimal nötige Ressourcenmenge für die verbesserte, gleichmäßigere Verteilung zu dimensionieren, statt Ressourcen als alleinige Lösung für ein Skew-Problem einzusetzen.

## Praktische Labs

~~~python
# Data skew detection: partition size distribution analysis
import random

random.seed(4)

# Simulate a skewed key distribution: one key dominates
keys = ["key_A"] * 4000 + [f"key_{i}" for i in range(1, 200)] * 30  # key_A massively overrepresented
random.shuffle(keys)

def partition_by_key(keys, num_partitions=10):
    partitions = [[] for _ in range(num_partitions)]
    for k in keys:
        partition_idx = hash(k) % num_partitions
        partitions[partition_idx].append(k)
    return partitions

partitions = partition_by_key(keys)
sizes = [len(p) for p in partitions]
max_size, min_size = max(sizes), min(sizes)

print(f"Partition sizes: {sizes}")
print(f"Max partition: {max_size} records, min partition: {min_size} records")
assert max_size > min_size * 3  # significant skew detected
print(f"Skew ratio (max/min): {max_size / max(min_size, 1):.1f}x - one partition will dominate total job runtime.")
~~~

## Dependencies, Cross-References und Quellen

1. Apache Spark: [RDD Programming Guide — Shuffle Operations](https://spark.apache.org/docs/latest/rdd-programming-guide.html#shuffle-operations), abgerufen 2026-09-17.
2. Apache Spark: [Performance Tuning — Join Strategy Hints](https://spark.apache.org/docs/latest/sql-performance-tuning.html), abgerufen 2026-09-17.
3. Databricks: [Handling Data Skew in Spark](https://www.databricks.com/blog/2020/04/29/optimize-spark-with-distribute-by-and-cluster-by.html), abgerufen 2026-09-17.

Produktspezifische Ausführungsplan-Analyse (Spark UI, Catalyst Optimizer) vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Adaptive Query Execution (dynamische Laufzeit-Optimierung des Ausführungsplans basierend auf tatsächlichen Datenstatistiken) | Established | Standardmäßig aktivieren, um manuelle Skew-Behandlung teilweise zu automatisieren. |
| Photon-artige, nativ kompilierte Ausführungs-Engines für spaltenorientierte Verarbeitung | Adopting | Performancegewinn gegenüber klassischer JVM-basierter Ausführung für geeignete Workloads evaluieren. |

Ein Team akzeptiert ein Spark-Job-Design erst, wenn Shuffle-Kosten und Datenskew-Risiko nachweisbar geprüft und die Partitionierungsstrategie begründet dokumentiert sind.
