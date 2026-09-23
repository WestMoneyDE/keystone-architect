---
{"id": "KB-0225", "title": "Dagster und datenorientierte Orchestrierung", "domain": "10", "sequence": 7, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "GENAI", "MLOPS"], "requires": [{"id": "KB-0224", "concepts": ["Airflow", "Task-Orchestrierung"], "needed_for": "understanding"}], "related": ["KB-0223"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Asset-basiertes Abhängigkeitsmodell mit Lineage-Nachverfolgung lokal implementieren.", "rationale": "Der Unterschied zwischen taskorientierter und assetorientierter Orchestrierung wird erst durch konkrete Modellierung des Datenzustands greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Asset-orientierte Orchestrierung gegenüber taskorientierter Orchestrierung für einen konkreten Anwendungsfall begründet abgrenzen.", "rationale": "Beide Modelle lösen dasselbe Orchestrierungsproblem aus unterschiedlicher konzeptueller Perspektive mit unterschiedlichen Stärken."}, "STAFF-TARGET": {"active": true, "scope": "Eine unklare Datenherkunftsfrage (welche Quelle hat diesen Datenzustand erzeugt) auf fehlende Lineage-Nachverfolgung statt auf fehlende Dokumentation zurückführen können.", "rationale": "Taskorientierte Systeme dokumentieren primär Ausführungsreihenfolge, nicht zwingend den erzeugten Datenzustand und seine Herkunft."}, "CHIEF-TARGET": {"active": true, "scope": "Datenorientierte Orchestrierung als Antwort auf Datenlineage- und Datenzustand-Transparenzanforderungen positionieren, nicht als generellen Airflow-Ersatz.", "rationale": "Die Wahl zwischen task- und assetorientierter Orchestrierung hängt vom Bedarf an Datenzustand-Transparenz ab, nicht von genereller technischer Überlegenheit."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Dagster-spezifische Sensor- und Schedule-Implementierungsdetails sind Vertiefung.", "rationale": "Kern ist das Prinzip von Assets, Partitions und Lineage, nicht die Werkzeugimplementierung."}}, "lab_validation": [{"lab_id": "KB-0225-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für assetorientierte Abhängigkeitsverfolgung mit Lineage", "evidence": "Ein assetorientiertes Modell verfolgt explizit, welcher Datenzustand (Asset) aus welchen anderen Datenzuständen erzeugt wurde, was direkte Beantwortung von Herkunftsfragen ermöglicht, ohne separate Dokumentation zu benötigen.", "limitations": "Kein echtes Dagster-System, keine reale Datenquelle, keine Produktion."}]}
---
# Dagster und datenorientierte Orchestrierung

> **Ziel:** Dagster modelliert Orchestrierung um Assets (konkrete, referenzierbare Datenzustände) statt um Tasks (Ausführungsschritte) — das macht Datenherkunft (Lineage) und Datenzustand direkt nachvollziehbar, im Gegensatz zu rein taskorientierten Systemen (siehe [KB-0224](06-airflow-und-workflow-scheduling.md)), die primär Ausführungsreihenfolge, nicht zwingend den erzeugten Datenzustand dokumentieren.

## Zweck, Mental Model und Dependencies

Taskorientierte Orchestrierung (wie klassisches Airflow, siehe [KB-0224](06-airflow-und-workflow-scheduling.md)) modelliert einen Workflow als Abfolge auszuführender Schritte — der Fokus liegt auf "was wird wann ausgeführt", nicht primär auf "welcher Datenzustand wird dabei erzeugt". Assetorientierte Orchestrierung (wie Dagster) modelliert stattdessen die Datenzustände selbst als erstklassige, referenzierbare Objekte (Assets) — ein Asset repräsentiert einen konkreten, materialisierten Datenzustand (z. B. eine Tabelle, eine Datei), und Abhängigkeiten werden zwischen Assets definiert, nicht nur zwischen Ausführungsschritten. Das macht Lineage (welcher Datenzustand wurde aus welchen anderen Datenzuständen erzeugt) direkt aus dem Orchestrierungsmodell ablesbar, statt separat dokumentiert werden zu müssen. Partitions in Dagster erweitern das Asset-Konzept um zeitliche oder kategoriale Unterteilung (ähnlich Airflows logischem Intervall), sodass ein Asset in einzelnen Partitionen materialisiert und nachverfolgt werden kann. Materializations sind die konkreten Erzeugungsereignisse eines Asset-Zustands, mit Metadaten über den Erzeugungszeitpunkt und die verwendeten Eingabe-Assets. Lies [KB-0224](06-airflow-und-workflow-scheduling.md).

~~~text
Task-oriented (Airflow):   models EXECUTION STEPS -> "what runs when" -> lineage requires separate documentation
Asset-oriented (Dagster):  models DATA STATES -> "what data exists, derived from what" -> lineage is built into the model
Asset materialization: a concrete data state, with explicit dependency on the upstream assets that produced it
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Asset-Modellierung | repräsentieren Assets tatsächliche, referenzierbare Datenzustände statt nur Ausführungsschritte? | Assets, die nur Tasks nachbilden, verlieren den Lineage-Vorteil gegenüber taskorientierter Orchestrierung |
| Lineage-Transparenz | kann die Herkunft eines Datenzustands direkt aus dem Orchestrierungsmodell nachvollzogen werden? | fehlende explizite Asset-Abhängigkeiten erzwingen manuelle, fehleranfällige Dokumentation der Datenherkunft |
| Partitionsdesign | ist die Partitionierung der Assets an die tatsächliche Datenaktualisierungsgranularität angepasst? | falsche Partitionsgranularität erzeugt entweder unnötigen Overhead oder unzureichende Nachverfolgbarkeit |
| Task- vs. Asset-Orientierung-Wahl | passt die gewählte Orchestrierungsperspektive zum tatsächlichen Transparenzbedarf? | assetorientierte Orchestrierung für reine Ausführungsreihenfolge-Anwendungsfälle ohne Lineage-Bedarf erzeugt unnötige Komplexität |

Implementierung: Assets werden so modelliert, dass sie tatsächliche, bedeutungsvolle Datenzustände repräsentieren (z. B. eine spezifische Tabelle oder ein Modell-Artefakt), nicht nur technische Zwischenschritte ohne eigenständige Bedeutung. Abhängigkeiten zwischen Assets werden explizit deklariert, sodass Dagster den vollständigen Lineage-Graphen automatisch ableiten kann. Partitionierung wird an die tatsächliche Aktualisierungsgranularität der zugrunde liegenden Daten angepasst (z. B. tägliche Partitionen für täglich aktualisierte Faktentabellen). Die Wahl zwischen task- und assetorientierter Orchestrierung wird bewusst getroffen: assetorientierte Orchestrierung wird gewählt, wenn Datenlineage, Datenzustand-Transparenz oder selektive Neuberechnung einzelner Datenzustände ein zentrales Anforderungsziel sind.

## Scalability, Reliability, Security und Observability

Assetorientierte Orchestrierung skaliert Transparenz über komplexe Datenpipelines mit vielen Abhängigkeiten besser als taskorientierte Systeme, weil Lineage-Fragen direkt aus dem Modell beantwortbar sind, statt separate Dokumentation zu pflegen, die veralten kann. Reliability-Grenze: falsch oder unvollständig modellierte Asset-Abhängigkeiten erzeugen ein trügerisches Gefühl von Lineage-Transparenz — das System zeigt einen Abhängigkeitsgraphen, der nicht der tatsächlichen Datenherkunft entspricht, wenn Abhängigkeiten unvollständig deklariert wurden.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Team kann nicht nachvollziehen, welche Quelldaten einen bestimmten Endzustand beeinflusst haben | Asset-Abhängigkeiten sind nicht vollständig oder korrekt deklariert | Asset-Abhängigkeitsgraph auf Vollständigkeit gegen die tatsächliche Datenverarbeitungslogik prüfen |
| Neuberechnung eines einzelnen fehlerhaften Datenzustands erfordert Neuberechnung der gesamten Pipeline | Assets sind zu grobgranular modelliert, keine selektive Neuberechnung einzelner Zustände möglich | Asset-Granularität gegen tatsächlichen Bedarf für selektive Neuberechnung prüfen |
| Lineage-Graph zeigt Abhängigkeiten, die nicht der tatsächlichen Datenverarbeitung entsprechen | Asset-Abhängigkeiten wurden unvollständig oder fehlerhaft deklariert | deklarierte Abhängigkeiten stichprobenartig gegen tatsächlichen Datenverarbeitungscode verifizieren |
| Partitionierte Assets zeigen inkonsistente Materialisierungshistorie | Partitionsgranularität passt nicht zur tatsächlichen Aktualisierungsfrequenz der Quelldaten | Partitionsdefinition gegen tatsächliches Quelldaten-Aktualisierungsmuster prüfen |

Security: Asset-Metadaten (Lineage-Informationen) können selbst sensible Informationen über interne Datenflüsse und Geschäftslogik offenlegen und sollten entsprechend den gleichen Zugriffsbeschränkungen wie die zugrunde liegenden Daten unterliegen. Observability: Asset-Materialisierungshistorie, Lineage-Graph-Vollständigkeit und Partitionsstatus sind zentrale Metriken für die Gesundheit einer assetorientierten Orchestrierungspipeline.

## Trade-offs und Entscheidungen

**Staff** modelliert Assets so, dass sie tatsächliche, bedeutungsvolle Datenzustände repräsentieren, nicht nur technische Zwischenschritte. **Principal** macht Lineage-Transparenz als direkten Vorteil assetorientierter Orchestrierung für das Team nachvollziehbar. **Chief** positioniert die Wahl zwischen task- und assetorientierter Orchestrierung als bewusste Entscheidung basierend auf dem tatsächlichen Bedarf an Datenzustand-Transparenz, nicht als generelle technische Überlegenheit einer Methode.

Anti-Patterns: Assets nur als Nachbildung von Tasks ohne eigenständige Bedeutung modellieren, wodurch der Lineage-Vorteil verloren geht; Asset-Abhängigkeiten unvollständig deklarieren und trotzdem auf vollständige Lineage-Transparenz vertrauen; assetorientierte Orchestrierung für Anwendungsfälle ohne echten Lineage-Bedarf einsetzen, wo einfachere taskorientierte Orchestrierung ausreichen würde.

## Production Checklist

- [ ] Assets repräsentieren tatsächliche, bedeutungsvolle Datenzustände, nicht nur technische Zwischenschritte.
- [ ] Asset-Abhängigkeiten sind vollständig und korrekt gegen die tatsächliche Datenverarbeitungslogik deklariert.
- [ ] Partitionsgranularität ist an die tatsächliche Aktualisierungsfrequenz der Quelldaten angepasst.
- [ ] Die Wahl zwischen task- und assetorientierter Orchestrierung ist gegen den tatsächlichen Lineage-Transparenzbedarf begründet.

## Interviewfragen

### 1. Was ist der grundlegende Unterschied zwischen taskorientierter und assetorientierter Orchestrierung?

**Antwort:** Taskorientierte Orchestrierung modelliert Ausführungsschritte ("was läuft wann"), während assetorientierte Orchestrierung Datenzustände selbst als erstklassige Objekte modelliert ("welche Daten existieren, abgeleitet aus welchen anderen Daten") — Letzteres macht Lineage direkt aus dem Modell ablesbar.

### 2. Warum ist Lineage-Transparenz ein zentraler Vorteil assetorientierter Orchestrierung?

**Antwort:** Weil Abhängigkeiten zwischen konkreten Datenzuständen (Assets) statt nur zwischen Ausführungsschritten deklariert werden, kann die Herkunft eines Datenzustands direkt aus dem Orchestrierungsmodell nachvollzogen werden, ohne separate, potenziell veraltende Dokumentation zu pflegen.

### 3. Wie diagnostizierst du, dass ein Team die Datenherkunft eines bestimmten Endzustands nicht nachvollziehen kann?

**Antwort:** Ich prüfe, ob die Asset-Abhängigkeiten vollständig und korrekt deklariert sind — unvollständige Abhängigkeitsdeklaration ist die häufigste Ursache für fehlende Lineage-Transparenz, auch wenn assetorientierte Orchestrierung genutzt wird.

### 4. Warum kann ein Lineage-Graph trotz assetorientierter Orchestrierung irreführend sein?

**Antwort:** Wenn Asset-Abhängigkeiten unvollständig oder fehlerhaft deklariert wurden, zeigt der Lineage-Graph nicht die tatsächliche Datenherkunft, sondern nur die deklarierten Abhängigkeiten — das erzeugt ein trügerisches Gefühl von Transparenz, ohne tatsächlich korrekt zu sein.

### 5. Wann ist assetorientierte Orchestrierung gegenüber taskorientierter Orchestrierung die bessere Wahl?

**Antwort:** Wenn Datenlineage, Transparenz über konkrete Datenzustände oder selektive Neuberechnung einzelner Datenzustände zentrale Anforderungen sind — für reine Ausführungsreihenfolge-Anwendungsfälle ohne diesen Bedarf kann taskorientierte Orchestrierung einfacher und ausreichend sein.

### 6. Widersprüchliche Anforderung: Team will vollständige Lineage-Transparenz für jede einzelne Transformation UND minimalen Modellierungsaufwand bei der Pipeline-Entwicklung — wie gehst du vor?

**Antwort:** Ich würde erklären, dass vollständige Lineage-Transparenz auf sehr feiner Granularität einen entsprechenden Modellierungsaufwand erfordert, da jede bedeutungsvolle Zwischentransformation als eigenständiges Asset deklariert werden muss; ich würde vorschlagen, Asset-Granularität auf tatsächlich geschäftsrelevante Datenzustände zu beschränken (nicht jeden technischen Zwischenschritt), was einen praktikablen Kompromiss zwischen Transparenz und Modellierungsaufwand darstellt.

## Praktische Labs

~~~python
# Asset-oriented lineage tracking model
assets = {}

def materialize_asset(name, upstream_assets, data):
    assets[name] = {
        "data": data,
        "upstream": upstream_assets,
        "materialized_at": "2026-09-17T10:00:00",
    }

def trace_lineage(asset_name, visited=None):
    if visited is None:
        visited = []
    visited.append(asset_name)
    for upstream in assets[asset_name]["upstream"]:
        trace_lineage(upstream, visited)
    return visited

materialize_asset("raw_orders", [], data="raw order data")
materialize_asset("cleaned_orders", ["raw_orders"], data="cleaned order data")
materialize_asset("order_summary", ["cleaned_orders"], data="aggregated summary")

lineage = trace_lineage("order_summary")
print(f"Lineage of 'order_summary': {lineage}")
assert lineage == ["order_summary", "cleaned_orders", "raw_orders"]
print("Full data provenance is directly queryable from the asset model - no separate documentation needed.")
~~~

## Dependencies, Cross-References und Quellen

1. Dagster: [Software-Defined Assets Concept](https://docs.dagster.io/concepts/assets/software-defined-assets), abgerufen 2026-09-17.
2. Dagster: [Partitions Documentation](https://docs.dagster.io/concepts/partitions-schedules-sensors/partitions), abgerufen 2026-09-17.
3. Dagster: [Asset Lineage and Data Catalog](https://docs.dagster.io/concepts/dagit/dagit#asset-graph), abgerufen 2026-09-17.

Airflow-Taskorientierung ist kanonisch in [KB-0224](06-airflow-und-workflow-scheduling.md) behandelt. Produktspezifische Sensor- und Schedule-Details vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Datenqualitäts-Checks direkt an Asset-Materialisierungen gekoppelt | Adopting | Für kritische Assets gegenüber separaten, entkoppelten Datenqualitäts-Pipelines bevorzugen. |
| Hybride Orchestrierung (assetorientierte Modellierung mit taskorientierter Ausführungsengine im Hintergrund) | Established | Für Teams mit bestehender taskorientierter Infrastruktur als Migrationspfad evaluieren. |

Ein Team akzeptiert ein assetorientiertes Orchestrierungsdesign erst, wenn Asset-Abhängigkeiten nachweisbar vollständig deklariert und gegen die tatsächliche Datenverarbeitungslogik verifiziert sind.
