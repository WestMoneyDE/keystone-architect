---
{"id": "KB-0475", "title": "Amazon DynamoDB", "domain": "19", "sequence": 13, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0206", "concepts": ["NoSQL-Kategorien und Datenmodelle"], "needed_for": "understanding"}, {"id": "KB-0474", "concepts": ["RDS und Aurora"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine DynamoDB-Tabelle mit Partitionsschlüssel, Sortierschlüssel und einem Global Secondary Index anhand offizieller Dokumentation entwerfen können und erklären, warum das Zugriffsmuster vor dem Schema feststehen muss.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein DynamoDB-Datenmodell für eine konkrete Anwendung entwerfen, das tatsächliche Zugriffsmuster (statt eines normalisierten, relationalen Denkmodells) als primäre Designgrundlage nutzt und bedingte Writes für konsistente Aktualisierungen einsetzt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete, ungleichmäßige Partitionsauslastung (Hot Partition) auf eine ungünstige Wahl des Partitionsschlüssels zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "NoSQL-Datenmodellierungsrichtlinien im Unternehmen anhand zugriffsmustergetriebenen Designs statt anhand relationaler Modellierungsgewohnheiten festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung des DynamoDB-Partitionierungs- und Replikationsmechanismus im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Schlüsselmodell, Zugriffsmustern, Kapazitätsmodi und bedingten Writes als Entscheidungsgrundlage, nicht die interne Partitionierungs-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0475-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Amazon-DynamoDB-Dokumentation, kein aktives AWS-Konto verwendet", "evidence": "Anhand offizieller AWS-Dokumentation wird nachvollzogen, wie DynamoDB-Tabellen über Partitionsschlüssel (bestimmt die physische Partitionierung) und optionale Sortierschlüssel strukturiert werden, warum ein zugriffsmustergetriebenes Design (statt relationaler Normalisierung) zentral für effiziente Abfragen ist, wie Global Secondary Indexes alternative Zugriffspfade ermöglichen, und wie bedingte Writes (Conditional Writes) Race-Conditions bei gleichzeitigen Aktualisierungen verhindern.", "limitations": "Kein aktives AWS-Konto verwendet, keine reale DynamoDB-Tabelle erstellt."}]}
---
# Amazon DynamoDB

> **Ziel:** Amazon DynamoDB ist ein verwalteter NoSQL-Datenbankdienst (siehe NoSQL-Kategorien und Datenmodelle, [KB-0206](../09-databases-storage/12-nosql-kategorien-und-datenmodelle.md)), bei dem der Partitionsschlüssel (und optional ein Sortierschlüssel) sowohl die physische Datenverteilung über Partitionen als auch die effizient abfragbaren Zugriffsmuster bestimmt. Der zentrale Punkt dieses Kapitels ist, dass das Datenmodell in DynamoDB zwingend vom tatsächlichen Zugriffsmuster der Anwendung ausgehend entworfen werden muss (welche Abfragen werden tatsächlich benötigt, mit welcher Häufigkeit), statt — wie bei relationaler Modellierung üblich, siehe RDS und Aurora, [KB-0474](12-rds-und-aurora.md) — zunächst eine normalisierte Datenstruktur zu entwerfen und Abfragen erst nachträglich zu berücksichtigen; ein nachträglicher Versuch, ein für ein anderes Zugriffsmuster entworfenes Schema für neue, ursprünglich nicht bedachte Abfragen zu nutzen, führt in DynamoDB typischerweise zu ineffizienten, aufwendigen Scan-Operationen oder erfordert eine grundlegende Schemaänderung.

## Zweck, Mental Model und Dependencies

In einem relationalen Datenmodell wird die Datenstruktur üblicherweise nach den Prinzipien der Normalisierung entworfen (Vermeidung redundanter Daten, klare Entitätsbeziehungen), und komplexe Abfragen werden zur Laufzeit über Joins zwischen mehreren Tabellen zusammengesetzt — dieses Modell ist flexibel gegenüber sich ändernden oder neu entstehenden Abfrageanforderungen, da neue Join-Kombinationen jederzeit möglich sind. In DynamoDB hingegen bestimmt der gewählte Partitionsschlüssel (und Sortierschlüssel), wie Daten physisch über mehrere Partitionen verteilt werden, und effiziente Abfragen sind nur über diese Schlüsselstruktur (oder über explizit definierte, zusätzliche Indizes) möglich — es gibt keine serverseitigen Joins wie in relationalen Datenbanken, weshalb häufig benötigte Zugriffsmuster durch bewusste Denormalisierung (z. B. redundante Speicherung derselben Daten in mehreren Formen, optimiert für unterschiedliche Abfragen) bereits beim Datenmodell-Entwurf antizipiert werden müssen. Ein Global Secondary Index (GSI) ermöglicht zusätzliche, alternative Zugriffspfade auf dieselben Daten mit einem anderen Partitions-/Sortierschlüssel-Paar, muss jedoch ebenfalls vorab für ein konkretes, erwartetes Zugriffsmuster eingerichtet werden. Die Wahl des Partitionsschlüssels hat direkte Auswirkungen auf die Lastverteilung: Ein Partitionsschlüssel mit geringer Kardinalität oder mit stark ungleichmäßiger Zugriffshäufigkeit (z. B. ein Schlüssel, bei dem ein kleiner Anteil der Werte einen unverhältnismäßig großen Anteil der tatsächlichen Zugriffe erhält) führt zu einer "Hot Partition" — einer einzelnen Partition, die deutlich mehr Last als andere Partitionen trägt, was die effektive Skalierbarkeit der gesamten Tabelle einschränkt, selbst wenn die Gesamtkapazität der Tabelle theoretisch ausreichend dimensioniert wäre. Bedingte Writes (Conditional Writes) ermöglichen es, eine Schreiboperation nur dann auszuführen, wenn eine bestimmte Bedingung über den aktuellen Zustand des Elements erfüllt ist (z. B. "nur aktualisieren, wenn der aktuelle Wert einer Version noch dem erwarteten, zuvor gelesenen Wert entspricht") — dies ist der zentrale Mechanismus, um Race-Conditions bei gleichzeitigen Aktualisierungen desselben Elements zu verhindern, ohne auf verteilte Sperren angewiesen zu sein. Der zentrale methodische Punkt ist, dass ein DynamoDB-Datenmodell, das ohne vorherige, sorgfältige Analyse der tatsächlichen Zugriffsmuster entworfen wird, typischerweise entweder ineffiziente, kostspielige Scan-Operationen (vollständiges Durchsuchen der Tabelle statt gezielter Abfrage) erfordert oder eine grundlegende Neugestaltung des Schemas notwendig macht, sobald neue, ursprünglich nicht bedachte Zugriffsmuster auftreten.

~~~text
Relational model: normalized structure, flexible JOINS at query time for new/changing access needs
DynamoDB: partition key (+ optional sort key) determines BOTH physical partitioning AND efficient query paths
  NO server-side joins -> frequently needed access patterns require DELIBERATE denormalization
    anticipated ALREADY at data model design time
Global Secondary Index (GSI): additional access path with a DIFFERENT key pair
  still requires ADVANCE knowledge of the expected access pattern
Partition key choice -> HOT PARTITION risk: low cardinality or uneven access distribution
  -> one partition carries disproportionate load -> limits effective table scalability
     EVEN IF total table capacity is theoretically sufficient
Conditional Writes: write only executes if a condition on current item state holds
  -> PRIMARY mechanism to prevent race conditions on concurrent updates, no distributed locks needed
KEY METHODOLOGICAL POINT: data model designed WITHOUT careful upfront access-pattern analysis
  -> typically forces EITHER expensive, inefficient SCAN operations
     OR a fundamental schema redesign when new, unanticipated access patterns emerge
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Partitionsschlüssel (+ Sortierschlüssel) | bestimmt Datenverteilung und primäre Abfragepfade | muss anhand tatsächlicher Zugriffsmuster gewählt werden |
| Global Secondary Index | ermöglicht alternative Zugriffspfade | erfordert vorherige Kenntnis des zusätzlichen Zugriffsmusters |
| Hot Partition | ungleichmäßige Lastverteilung durch ungünstigen Schlüssel | begrenzt effektive Skalierbarkeit trotz ausreichender Gesamtkapazität |
| Bedingte Writes | verhindern Race-Conditions bei gleichzeitigen Updates | zentraler Mechanismus ohne verteilte Sperren |

Implementierung: Vor dem Entwurf eines DynamoDB-Datenmodells werden alle tatsächlich benötigten Zugriffsmuster der Anwendung explizit dokumentiert (welche Abfragen, mit welcher Häufigkeit), bevor Partitionsschlüssel, Sortierschlüssel und gegebenenfalls zusätzliche Global Secondary Indexes festgelegt werden. Der Partitionsschlüssel wird auf ausreichend hohe Kardinalität und möglichst gleichmäßige Zugriffsverteilung geprüft, um das Risiko einer Hot Partition zu minimieren. Für alle Schreiboperationen, die auf einem zuvor gelesenen Zustand basieren (Read-Modify-Write-Muster), werden bedingte Writes eingesetzt, um Race-Conditions bei gleichzeitigen Aktualisierungen zu verhindern.

## Scalability, Reliability, Security und Observability

DynamoDB skaliert die effektive Kapazität proportional zur Gleichmäßigkeit der Lastverteilung über Partitionen, die durch die Wahl des Partitionsschlüssels bestimmt wird; die Reliability-Grenze liegt darin, dass ein Datenmodell ohne vorherige Zugriffsmusteranalyse proportional zur Anzahl neu auftretender, nicht antizipierter Abfragen zu ineffizienten Scan-Operationen oder grundlegenden Schema-Neugestaltungen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Tabelle zeigt trotz ausreichender Gesamtkapazität Drosselungsfehler | der gewählte Partitionsschlüssel führt zu einer Hot Partition mit ungleichmäßiger Lastverteilung | die Zugriffsverteilung über Partitionsschlüsselwerte analysieren und gegebenenfalls den Schlüssel neu gestalten |
| eine neue Abfrageanforderung erfordert eine vollständige Tabellendurchsuchung (Scan) | das Datenmodell wurde ohne Berücksichtigung dieses Zugriffsmusters entworfen | einen Global Secondary Index für das neue Zugriffsmuster einrichten oder das Datenmodell überarbeiten |
| gleichzeitige Aktualisierungen desselben Elements führen zu verlorenen Änderungen | Schreiboperationen nutzen keine bedingten Writes zur Race-Condition-Vermeidung | Read-Modify-Write-Operationen auf bedingte Writes umstellen |

Security: Der Zugriff auf DynamoDB-Tabellen sollte über dedizierte, eng gefasste IAM-Policies mit feingranularer Kontrolle bis auf Attributebene erfolgen, wo eine solche Granularität tatsächlich benötigt wird. Observability: Die tatsächliche Verteilung der Zugriffe über Partitionsschlüsselwerte, die Häufigkeit von Drosselungsereignissen, und die Häufigkeit tatsächlich durchgeführter Scan-Operationen sind zentrale Metriken zur Bewertung des Datenmodells.

## Trade-offs und Entscheidungen

**Staff** entwirft DynamoDB-Datenmodelle ausgehend von tatsächlichen, dokumentierten Zugriffsmustern statt relationaler Normalisierungsgewohnheiten. **Principal** macht die Zugriffsmuster-getriebene Modellierung für das Team nachvollziehbar. **Chief** legt NoSQL-Datenmodellierungsrichtlinien im Unternehmen anhand zugriffsmustergetriebenen Designs fest.

Anti-Patterns: ein DynamoDB-Datenmodell nach relationalen Normalisierungsprinzipien ohne Berücksichtigung tatsächlicher Zugriffsmuster entwerfen; einen Partitionsschlüssel mit geringer Kardinalität oder stark ungleichmäßiger Zugriffsverteilung wählen; Read-Modify-Write-Operationen ohne bedingte Writes implementieren und dadurch Race-Conditions riskieren.

## Production Checklist

- [ ] Alle tatsächlich benötigten Zugriffsmuster sind vor dem Datenmodell-Entwurf dokumentiert.
- [ ] Der Partitionsschlüssel weist ausreichend hohe Kardinalität und gleichmäßige Zugriffsverteilung auf.
- [ ] Global Secondary Indexes decken alle zusätzlich benötigten Zugriffspfade ab.
- [ ] Read-Modify-Write-Operationen nutzen bedingte Writes zur Race-Condition-Vermeidung.

## Interviewfragen

### 1. Warum muss das DynamoDB-Datenmodell vom tatsächlichen Zugriffsmuster ausgehend entworfen werden?

**Antwort:** Weil DynamoDB keine serverseitigen Joins wie relationale Datenbanken unterstützt; effiziente Abfragen sind nur über den gewählten Partitions-/Sortierschlüssel oder explizit eingerichtete Indizes möglich, weshalb Zugriffsmuster bereits beim Design antizipiert werden müssen.

### 2. Was ist eine Hot Partition, und wodurch entsteht sie?

**Antwort:** Eine einzelne Partition, die deutlich mehr Last trägt als andere, typischerweise durch einen Partitionsschlüssel mit geringer Kardinalität oder stark ungleichmäßiger Zugriffshäufigkeit, was die effektive Skalierbarkeit der gesamten Tabelle einschränkt.

### 3. Was ermöglicht ein Global Secondary Index?

**Antwort:** Einen alternativen Zugriffspfad auf dieselben Daten mit einem anderen Partitions-/Sortierschlüssel-Paar, muss aber ebenfalls vorab für ein konkretes, erwartetes Zugriffsmuster eingerichtet werden.

### 4. Wie verhindern bedingte Writes Race-Conditions bei gleichzeitigen Aktualisierungen?

**Antwort:** Eine Schreiboperation wird nur ausgeführt, wenn eine Bedingung über den aktuellen Zustand des Elements erfüllt ist (z. B. Übereinstimmung mit einem zuvor gelesenen Wert), wodurch verlorene Änderungen bei konkurrierenden Updates ohne verteilte Sperren verhindert werden.

### 5. Wie gehst du vor, wenn eine Tabelle trotz ausreichender Gesamtkapazität Drosselungsfehler zeigt?

**Antwort:** Ich analysiere die tatsächliche Zugriffsverteilung über die Partitionsschlüsselwerte, um zu prüfen, ob eine Hot Partition durch einen ungünstig gewählten Schlüssel entsteht, und gestalte den Schlüssel gegebenenfalls neu.

### 6. Widersprüchliche Anforderung: Team will maximale Modellierungsflexibilität (wie bei einer relationalen Datenbank) UND die Skalierungsvorteile von DynamoDB — wie gehst du vor?

**Antwort:** Ich würde erklären, dass DynamoDB diese Flexibilität durch die feste Abhängigkeit von Zugriffsmustern bewusst gegen Skalierbarkeit eintauscht, und empfehlen, alle tatsächlich benötigten Zugriffsmuster vorab vollständig zu erfassen und das Datenmodell entsprechend zu gestalten, statt nachträgliche Flexibilität wie bei einer relationalen Datenbank zu erwarten.

## Praktische Labs

~~~python
# Conceptual partition-key access distribution analysis (not executed against a real DynamoDB table):

from collections import Counter

def analyze_partition_distribution(access_log_partition_keys):
    counts = Counter(access_log_partition_keys)
    total_accesses = sum(counts.values())
    top_key, top_count = counts.most_common(1)[0]
    hot_partition_share = top_count / total_accesses
    return {
        "distinct_keys": len(counts),
        "hottest_key": top_key,
        "hot_partition_share_pct": round(hot_partition_share * 100, 1),
        "hot_partition_risk": hot_partition_share > 0.3,
    }

# Example: skewed access pattern (e.g. a "status" field used as partition key, low cardinality)
skewed_access_log = ["active"] * 800 + ["archived"] * 150 + ["deleted"] * 50
result = analyze_partition_distribution(skewed_access_log)
print(result)
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [Amazon DynamoDB — Best Practices for Designing and Using Partition Keys](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html), abgerufen 2026-09-18.
2. AWS-Dokumentation: [Amazon DynamoDB — Conditional Writes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithItems.html#WorkingWithItems.ConditionalUpdate), abgerufen 2026-09-18.

NoSQL-Kategorien und Datenmodelle sind kanonisch in [KB-0206](../09-databases-storage/12-nosql-kategorien-und-datenmodelle.md) behandelt; RDS und Aurora in [KB-0474](12-rds-und-aurora.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Werkzeuge zur Analyse und Empfehlung optimaler Partitionsschlüssel basierend auf tatsächlichen Zugriffsprotokollen | Evaluating | Gegenüber manueller Zugriffsmusteranalyse erst nach Prüfung der tatsächlichen Empfehlungsgenauigkeit für die eigene Anwendung bevorzugen. |

Ein Team akzeptiert ein DynamoDB-Datenmodell erst, wenn alle tatsächlich benötigten Zugriffsmuster dokumentiert sind und der Partitionsschlüssel nachweislich keine Hot-Partition-Risiken aufweist.
