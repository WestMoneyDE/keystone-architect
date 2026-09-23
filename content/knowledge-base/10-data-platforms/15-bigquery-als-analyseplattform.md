---
{"id": "KB-0233", "title": "BigQuery als Analyseplattform", "domain": "10", "sequence": 15, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "GENAI", "MLOPS"], "requires": [{"id": "KB-0231", "concepts": ["Data Warehouses"], "needed_for": "understanding"}, {"id": "KB-0227", "concepts": ["Spaltenorientierte Formate"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Modell für Query-Kostenschätzung basierend auf gescannter Datenmenge und Partitionierung lokal implementieren.", "rationale": "Der direkte Zusammenhang zwischen Partitionierung, gescannter Datenmenge und Abfragekosten wird erst durch konkrete Berechnung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Partitionierungs- und Clustering-Strategie für ein konkretes BigQuery-Tabellendesign begründet gegen erwartete Abfragemuster und Kosten dimensionieren.", "rationale": "Falsche Partitionierung erzeugt unnötig hohe Abfragekosten, da BigQuery nach gescannter Datenmenge abrechnet."}, "STAFF-TARGET": {"active": true, "scope": "Unerwartet hohe Abfragekosten auf fehlende Partitionsfilterung statt auf allgemein ineffiziente Abfragen zurückführen können.", "rationale": "Eine Abfrage ohne Partitionsfilter kann die gesamte Tabelle scannen, selbst wenn die Tabelle partitioniert ist und nur ein kleiner Zeitraum relevant wäre."}, "CHIEF-TARGET": {"active": true, "scope": "BigQuery als spaltenorientierte, nach gescannter Datenmenge abrechnende Analyseplattform positionieren, mit Kostenkontrolle als zentrale Architekturüberlegung.", "rationale": "Das Abrechnungsmodell nach gescannter Datenmenge macht Partitionierungs- und Abfragedesign zu einer direkten Kostenentscheidung, nicht nur einer Performanceoptimierung."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "GCP-Organisationsstruktur und Cloud-IAM-Konfiguration sind bewusst nicht Teil dieser Datei und im Providertrack behandelt.", "rationale": "Diese Datei fokussiert auf das Data-Platform-Design (Spaltenanalyse, Partitionierung, Query-Kosten), nicht auf GCP-Plattformverwaltung."}}, "lab_validation": [{"lab_id": "KB-0233-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für partitionsbasierte Query-Kostenschätzung", "evidence": "Eine Abfrage mit explizitem Partitionsfilter scannt nur die relevanten Partitionen, während eine Abfrage ohne Partitionsfilter die gesamte Tabelle scannt, was bei nach gescannter Datenmenge abrechnenden Systemen einen direkten Kostenunterschied bedeutet.", "limitations": "Kein echtes BigQuery-System, keine reale Abrechnung, keine Produktion."}]}
---
# BigQuery als Analyseplattform

> **Ziel:** BigQuery ist eine spaltenorientierte Analyseplattform (siehe [KB-0227](09-parquet-und-spaltenorientierte-dateien.md) für das zugrunde liegende Prinzip), die nach tatsächlich gescannter Datenmenge abrechnet — Partitionierung und Clustering sind damit nicht nur Performanceoptimierungen, sondern direkte Kostenentscheidungen. Diese Datei behandelt Data-Platform-Design (Spaltenanalyse, Partitionierung, Query-Kosten); GCP-Organisationsstruktur und Cloud-IAM werden bewusst im Providertrack behandelt.

## Zweck, Mental Model und Dependencies

BigQuery speichert Daten spaltenorientiert (siehe [KB-0227](09-parquet-und-spaltenorientierte-dateien.md) für das Grundprinzip) und rechnet Abfragekosten typischerweise nach der Menge der tatsächlich gescannten Daten ab, nicht nach Abfragezeit oder Ergebnisgröße — das bedeutet, eine Abfrage über eine sehr große Tabelle kann teuer sein, selbst wenn sie nur wenige Ergebniszeilen liefert, wenn sie viele Spalten oder die gesamte Tabelle scannen muss. Partitionierung (typischerweise nach Datum) teilt eine Tabelle physisch in separate Segmente, sodass eine Abfrage mit explizitem Partitionsfilter (z. B. "WHERE datum = '2026-01-01'") nur die relevante Partition scannt, statt die gesamte Tabelle — das reduziert gescannte Datenmenge und damit Kosten drastisch. Clustering sortiert Daten innerhalb von Partitionen nach häufig gefilterten Spalten, was zusätzliches Überspringen irrelevanter Datenblöcke innerhalb einer Partition ermöglicht. Der zentrale Denkfehler ist, Abfragen ohne explizite Partitionsfilterung zu schreiben, auch wenn die Tabelle partitioniert ist — ohne Filter auf der Partitionierungsspalte scannt die Abfrage weiterhin die gesamte Tabelle, unabhängig von der physischen Partitionierung. Lies [KB-0231](13-data-warehouses.md) und [KB-0227](09-parquet-und-spaltenorientierte-dateien.md).

~~~text
Billing model: cost proportional to DATA SCANNED, not query time or result size
Partitioned table + query WITH partition filter    -> scans only relevant partition -> low cost
Partitioned table + query WITHOUT partition filter  -> scans ENTIRE table -> high cost, partitioning provides NO benefit
Clustering within partition -> skips irrelevant blocks based on frequently filtered columns
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Partitionsfilterung | enthalten Abfragen konsequent einen Filter auf der Partitionierungsspalte? | Abfrage ohne Partitionsfilter scannt die gesamte Tabelle, Partitionierung bringt keinen Kostenvorteil |
| Partitionierungsschlüssel-Wahl | entspricht der Partitionierungsschlüssel dem dominanten Abfrage-Filterkriterium? | falscher Partitionierungsschlüssel verhindert effektive Kostenreduktion durch Partitionierung |
| Clustering-Nutzung | ist Clustering für häufig gefilterte Nicht-Partitionierungsspalten konfiguriert? | fehlendes Clustering lässt zusätzliches Optimierungspotenzial innerhalb von Partitionen ungenutzt |
| Query-Kostenschätzung vor Ausführung | wird die geschätzte gescannte Datenmenge vor Ausführung teurer Abfragen geprüft? | unerwartet teure Abfragen werden erst nach Ausführung und Abrechnung bemerkt |

Implementierung: Abfragen werden konsequent mit explizitem Filter auf der Partitionierungsspalte geschrieben, insbesondere für Tabellen mit großem historischem Datenvolumen, bei denen typischerweise nur ein begrenzter aktueller Zeitraum relevant ist. Der Partitionierungsschlüssel wird bewusst nach dem tatsächlich dominanten Abfrage-Filterkriterium gewählt (häufig Datum/Zeit), nicht nach einem beliebigen verfügbaren Feld. Clustering wird für Spalten konfiguriert, die zusätzlich zur Partitionierung häufig in Filterbedingungen verwendet werden, um weitere Kostenreduktion innerhalb von Partitionen zu erreichen. Vor Ausführung potenziell teurer, ungefilterter oder explorativer Abfragen wird die geschätzte gescannte Datenmenge geprüft (viele Abfrage-Werkzeuge bieten eine Vorabschätzung), statt Abfragen blind auszuführen und die Kosten erst im Nachhinein zu erkennen.

## Scalability, Reliability, Security und Observability

BigQuery skaliert analytische Abfragen über sehr große Datenmengen gut, da die zugrunde liegende Infrastruktur elastisch Rechenressourcen für parallele Verarbeitung bereitstellt, ohne dass Nutzer Cluster-Größe manuell dimensionieren müssen. Reliability-Grenze: fehlende Kostenkontrolle ist kein Verfügbarkeits-, sondern ein finanzielles Betriebsrisiko — eine unbeabsichtigt teure, wiederholt ausgeführte Abfrage (z. B. in einem automatisierten, aber fehlerhaft konfigurierten Dashboard) kann unerwartet hohe Kosten über Zeit akkumulieren, ohne dass dies technisch als "Fehler" sichtbar wird.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Abfragekosten für eine bestimmte Tabelle sind unerwartet hoch, obwohl die Tabelle partitioniert ist | Abfragen enthalten keinen expliziten Filter auf der Partitionierungsspalte | Abfrage-SQL auf Vorhandensein eines Filters auf der Partitionierungsspalte prüfen |
| Gesamtkosten für Analyseplattform-Nutzung steigen unerwartet schnell über Zeit | eine automatisierte, wiederholt ausgeführte Abfrage (z. B. Dashboard-Refresh) scannt unnötig viel Datenmenge | wiederkehrende Abfragen mit hoher gescannter Datenmenge identifizieren und auf Partitionsfilterung prüfen |
| Abfragen mit Filtern auf einer bestimmten Spalte sind langsamer/teurer als erwartet trotz Partitionierung | die gefilterte Spalte ist nicht die Partitionierungsspalte und auch nicht als Clustering-Spalte konfiguriert | prüfen, ob die häufig gefilterte Spalte als Clustering-Spalte innerhalb der Partitionierung konfiguriert ist |
| Team wird von einer einzelnen Abfrage überrascht, die deutlich teurer war als erwartet | geschätzte gescannte Datenmenge wurde vor Ausführung nicht geprüft | Prozess für Kostenschätzung vor Ausführung potenziell teurer Abfragen etablieren |

Security: Zeilen- und spaltenbasierte Zugriffskontrolle sollte für sensible Datenteilmengen genutzt werden, insbesondere da eine Analyseplattform oft Daten aus vielen Quellsystemen zentral zusammenführt und unterschiedliche Teams unterschiedliche Sensitivitätsstufen sehen dürfen sollten. Observability: gescannte Datenmenge pro Abfrage, Kostenentwicklung über Zeit nach Team/Workspace und Häufigkeit ungefilterter Abfragen auf partitionierten Tabellen sind zentrale Metriken für Kostenkontrolle.

## Trade-offs und Entscheidungen

**Staff** schreibt Abfragen konsequent mit explizitem Partitionsfilter für partitionierte Tabellen. **Principal** macht Query-Kostenschätzung vor Ausführung teurer, ungefilterter Abfragen für das Team zur Routine. **Chief** positioniert BigQuery als nach gescannter Datenmenge abrechnende Plattform, bei der Partitionierungs- und Abfragedesign eine direkte Kostenentscheidung ist, nicht nur eine Performanceoptimierung.

Anti-Patterns: Abfragen ohne Partitionsfilter auf großen, partitionierten Tabellen ausführen und den Kostenvorteil der Partitionierung verschenken; Partitionierungsschlüssel ohne Rücksicht auf tatsächliche Abfrage-Filterkriterien wählen; teure, ungefilterte oder explorative Abfragen ohne vorherige Kostenschätzung blind ausführen.

## Production Checklist

- [ ] Abfragen auf partitionierten Tabellen enthalten konsequent einen Filter auf der Partitionierungsspalte.
- [ ] Partitionierungsschlüssel entspricht dem tatsächlich dominanten Abfrage-Filterkriterium.
- [ ] Clustering ist für häufig zusätzlich gefilterte Spalten konfiguriert.
- [ ] Query-Kostenschätzung wird vor Ausführung potenziell teurer Abfragen genutzt.

## Interviewfragen

### 1. Warum sind Abfragekosten in BigQuery direkt an das Tabellendesign gekoppelt, nicht nur an die Abfragelogik?

**Antwort:** Die Abrechnung erfolgt nach tatsächlich gescannter Datenmenge, nicht nach Abfragezeit oder Ergebnisgröße; Partitionierung und Clustering bestimmen direkt, wie viel Datenmenge für eine gegebene Abfrage gescannt werden muss, was Tabellendesign zu einer direkten Kostenentscheidung macht.

### 2. Warum bringt Partitionierung keinen Kostenvorteil, wenn eine Abfrage keinen Partitionsfilter enthält?

**Antwort:** Ohne einen expliziten Filter auf der Partitionierungsspalte kann BigQuery nicht wissen, welche Partitionen relevant sind, und muss die gesamte Tabelle scannen — die physische Partitionierung existiert dann zwar, wird aber für diese Abfrage nicht genutzt.

### 3. Was ist der Unterschied zwischen Partitionierung und Clustering in BigQuery?

**Antwort:** Partitionierung teilt eine Tabelle physisch in separate Segmente (meist nach Datum), während Clustering Daten innerhalb von Partitionen nach häufig gefilterten Spalten sortiert, um zusätzliches Überspringen irrelevanter Datenblöcke innerhalb einer Partition zu ermöglichen.

### 4. Wie diagnostizierst du unerwartet hohe Abfragekosten für eine partitionierte Tabelle?

**Antwort:** Ich prüfe zuerst, ob die betroffenen Abfragen einen expliziten Filter auf der Partitionierungsspalte enthalten — eine fehlende Partitionsfilterung ist die häufigste Ursache dafür, dass eine partitionierte Tabelle trotzdem vollständig gescannt und dadurch unnötig teuer abgefragt wird.

### 5. Warum ist eine Kostenschätzung vor Ausführung potenziell teurer Abfragen sinnvoll?

**Antwort:** Da die Kosten proportional zur gescannten Datenmenge sind, kann eine vorherige Schätzung unerwartet teure Abfragen identifizieren, bevor sie tatsächlich ausgeführt und abgerechnet werden — das verhindert nachträgliche Kostenüberraschungen bei explorativen oder fehlerhaft formulierten Abfragen.

### 6. Widersprüchliche Anforderung: Analytics-Team will flexible, ungefilterte Ad-hoc-Analysen über die gesamte historische Datenmenge UND minimale Abfragekosten — wie gehst du vor?

**Antwort:** Ich würde erklären, dass vollständig ungefilterte Analysen über große historische Datenmengen proportional hohe Kosten verursachen, unabhängig von der Abfragekomplexität; ich würde vorschlagen, für explorative Analysen zunächst auf repräsentativen Stichproben oder eingeschränkten Zeiträumen zu arbeiten und erst bei tatsächlichem Bedarf auf die vollständige historische Datenmenge zuzugreifen, um Kosten und Flexibilität bewusst auszubalancieren.

## Praktische Labs

~~~python
# Partition-filtered vs unfiltered query cost estimation
partitions = {f"2026-{month:02d}-{day:02d}": 1_000_000 for month in range(1, 4) for day in range(1, 29)}
total_rows = sum(partitions.values())

def estimate_scanned_rows(query_has_partition_filter, filter_date=None):
    if query_has_partition_filter and filter_date in partitions:
        return partitions[filter_date]
    return total_rows  # no filter -> scans everything

filtered_scan = estimate_scanned_rows(query_has_partition_filter=True, filter_date="2026-02-15")
unfiltered_scan = estimate_scanned_rows(query_has_partition_filter=False)

print(f"Filtered query scans: {filtered_scan:,} rows")
print(f"Unfiltered query scans: {unfiltered_scan:,} rows")
assert filtered_scan < unfiltered_scan
cost_ratio = unfiltered_scan / filtered_scan
print(f"Unfiltered query costs {cost_ratio:.0f}x more than the partition-filtered equivalent, for the SAME logical result.")
~~~

## Dependencies, Cross-References und Quellen

1. Google Cloud: [BigQuery — Introduction to Partitioned Tables](https://cloud.google.com/bigquery/docs/partitioned-tables), abgerufen 2026-09-17.
2. Google Cloud: [BigQuery — Clustered Tables](https://cloud.google.com/bigquery/docs/clustered-tables), abgerufen 2026-09-17.
3. Google Cloud: [BigQuery — Estimate and Control Costs](https://cloud.google.com/bigquery/docs/best-practices-costs), abgerufen 2026-09-17.

Data-Warehouse-Grundlagen sind kanonisch in [KB-0231](13-data-warehouses.md) behandelt. GCP-Organisationsstruktur und Cloud-IAM werden im Providertrack behandelt, nicht hier.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Kapazitätsbasierte Preismodelle (feste Slot-Reservierung statt nach gescannter Datenmenge) als Alternative | Established | Für Organisationen mit sehr hohem, vorhersehbarem Abfragevolumen gegenüber On-Demand-Preisen evaluieren. |
| BI Engine und materialisierte Sichten für wiederkehrende Dashboard-Abfragen mit reduzierten Scankosten | Established | Für häufig wiederholte, identische Abfragemuster standardmäßig gegenüber wiederholtem vollem Scan nutzen. |

Ein Team akzeptiert ein BigQuery-Tabellendesign erst, wenn Partitionsfilterung in allen relevanten Abfragen nachweisbar verifiziert und Kostenschätzung für teure Abfragen etabliert sind.
