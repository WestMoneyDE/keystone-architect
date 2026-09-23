---
{"id": "KB-0236", "title": "Data Lineage", "domain": "10", "sequence": 18, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "GENAI", "MLOPS"], "requires": [{"id": "KB-0223", "concepts": ["dbt", "Lineage"], "needed_for": "understanding"}, {"id": "KB-0225", "concepts": ["Assetorientierte Orchestrierung"], "needed_for": "understanding"}], "related": ["KB-0235"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein spaltenebenen-Lineage-Modell für Impactanalyse bei geplanten Schemaänderungen lokal implementieren.", "rationale": "Der Nutzen von Spaltenabhängigkeits-Tracking für Impactanalyse wird erst durch konkrete Rückwärtssuche greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Lineage-Abdeckung (technisch und fachlich) für eine konkrete Datenplattform begründet gestalten, inklusive expliziter Lückenerkennung.", "rationale": "Unvollständige Lineage-Abdeckung mit unerkannten Lücken erzeugt ein trügerisches Gefühl vollständiger Nachverfolgbarkeit."}, "STAFF-TARGET": {"active": true, "scope": "Eine übersehene nachgelagerte Auswirkung einer Schemaänderung auf eine Lineage-Lücke statt auf unzureichende Kommunikation zurückführen können.", "rationale": "Selbst mit funktionierendem Lineage-System können unerfasste Abhängigkeiten (z. B. manuelle Exporte) zu übersehenen Impacts führen."}, "CHIEF-TARGET": {"active": true, "scope": "Data Lineage als Grundlage für verlässliche Impactanalyse und Audit-Fähigkeit positionieren, nicht als reines Visualisierungs-Feature.", "rationale": "Der eigentliche Wert von Lineage liegt in der Fähigkeit, vor einer Änderung alle Auswirkungen zu kennen, nicht nur in einer grafischen Darstellung."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Produktspezifische Lineage-Extraktionsmechanismen (SQL-Parsing, API-Integration) sind Vertiefung.", "rationale": "Kern ist das Prinzip von Spaltenabhängigkeiten, Lückenerkennung und Impactanalyse, nicht die Extraktionsimplementierung."}}, "lab_validation": [{"lab_id": "KB-0236-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für spaltenebenen-Lineage mit Rückwärts-Impactanalyse", "evidence": "Ein Spaltenabhängigkeitsgraph erlaubt, vor einer geplanten Schemaänderung alle nachgelagerten Abhängigkeiten rückwärts zu identifizieren, die von der Änderung betroffen wären.", "limitations": "Kein echtes Lineage-Werkzeug, keine reale Datenplattform, keine Produktion."}]}
---
# Data Lineage

> **Ziel:** Data Lineage verbindet technische Herkunft (welche Transformation hat welches Feld aus welchen Quellfeldern erzeugt) mit fachlicher Herkunft (welche Geschäftsbedeutung hat ein Datenfeld) — der eigentliche Wert liegt in verlässlicher Impactanalyse vor Änderungen, nicht in reiner Visualisierung. Unerkannte Lücken in der Lineage-Abdeckung sind gefährlicher als offensichtlich fehlende Lineage, weil sie ein trügerisches Gefühl von Vollständigkeit erzeugen.

## Zweck, Mental Model und Dependencies

Technische Lineage verfolgt, welche Transformation (SQL-Query, Pipeline-Schritt) welches Zielfeld aus welchen Quellfeldern erzeugt hat — auf Spaltenebene (Column-Level Lineage) statt nur auf Tabellenebene, was präzisere Impactanalyse ermöglicht: eine Änderung an einer bestimmten Quellspalte betrifft nur die tatsächlich davon abhängigen Zielspalten, nicht automatisch die gesamte Zieltabelle. Fachliche Lineage ergänzt diese technische Sicht um die Geschäftsbedeutung — welches Feld repräsentiert welche Geschäftskennzahl, und welche Geschäftsprozesse hängen von welchen Datenflüssen ab. Impactanalyse nutzt den Lineage-Graphen rückwärts (welche nachgelagerten Systeme wären von einer geplanten Änderung betroffen) und vorwärts (welche Datenqualitätsprobleme in einer Quelle könnten sich wie weit propagieren) — beide Richtungen sind für unterschiedliche Entscheidungen relevant. Lücken in der Lineage-Abdeckung (z. B. durch manuelle, nicht erfasste Datenexporte oder Transformationen außerhalb des überwachten Systems) sind besonders gefährlich, weil sie nicht als "fehlende Information" erkennbar sind, sondern als scheinbar vollständiger, aber tatsächlich unvollständiger Graph erscheinen. Lies [KB-0223](05-dbt-und-analytische-modelle.md) und [KB-0225](07-dagster-und-datenorientierte-orchestrierung.md) für verwandte Lineage-Konzepte in spezifischen Werkzeugen.

~~~text
Technical lineage:  which transformation produced which field from which source fields (column-level)
Business lineage:    what business meaning does a field represent, what depends on it
Backward impact analysis:  planned change -> which downstream consumers are affected?
Forward impact analysis:   source data quality issue -> how far does it propagate?
UNRECOGNIZED gaps (manual exports, untracked transforms) are worse than obviously missing lineage - false sense of completeness
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Spaltenebenen-Granularität | ist Lineage auf Spaltenebene erfasst, nicht nur auf Tabellenebene? | grobgranulare Tabellen-Lineage erzeugt unpräzise Impactanalysen mit vielen falsch-positiven Auswirkungen |
| Lückenerkennung | werden nicht erfasste Transformationspfade (manuelle Exporte, externe Systeme) aktiv identifiziert? | unerkannte Lücken erzeugen trügerisches Gefühl vollständiger Nachverfolgbarkeit |
| Fachliche Anreicherung | ist technische Lineage mit fachlicher Bedeutung (Geschäftskennzahlen, Prozesse) verknüpft? | rein technische Lineage beantwortet nicht, welche Geschäftsauswirkung eine Änderung hat |
| Impactanalyse-Nutzung | wird Lineage tatsächlich vor geplanten Änderungen für Impactanalyse konsultiert? | vorhandene Lineage-Information wird nicht genutzt, Änderungen werden ohne Impactprüfung durchgeführt |

Implementierung: Lineage-Erfassung wird auf Spaltenebene angestrebt, wo technisch möglich (z. B. durch SQL-Parsing oder native Werkzeugunterstützung), da Tabellenebene-Lineage zu unpräzise für verlässliche Impactanalyse ist. Bekannte Lücken in der Lineage-Abdeckung (manuelle Prozesse, externe Systeme ohne native Integration) werden aktiv dokumentiert und kommuniziert, statt stillschweigend als vollständig zu gelten. Technische Lineage wird mit fachlicher Bedeutung angereichert, indem kritische Geschäftskennzahlen explizit mit ihren zugrunde liegenden technischen Datenflüssen verknüpft werden. Impactanalyse wird als verpflichtender Schritt vor geplanten Breaking Changes etabliert, mit dem Lineage-Graphen als primärem Werkzeug zur Identifikation betroffener nachgelagerter Systeme.

## Scalability, Reliability, Security und Observability

Data Lineage skaliert Impactanalyse-Fähigkeit über komplexe, wachsende Datenplattformen mit vielen Transformationsschritten, weil Abhängigkeiten automatisch statt manuell durch Rücksprache mit allen beteiligten Teams identifiziert werden können. Reliability-Grenze: unerkannte Lineage-Lücken sind ein besonders tückisches Risiko, weil sie erst sichtbar werden, wenn eine tatsächliche Änderung ein nicht erfasstes nachgelagertes System bricht, das der Lineage-Graph fälschlich als "nicht betroffen" auswies.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine geplante Änderung bricht ein nachgelagertes System, das laut Lineage-Graph nicht betroffen sein sollte | Lineage-Lücke, das betroffene System nutzt einen nicht erfassten Datenpfad (z. B. manueller Export) | tatsächlichen Datenzugriffspfad des betroffenen Systems auf Erfassung im Lineage-Graphen prüfen |
| Impactanalyse vor einer Änderung identifiziert zu viele oder zu wenige betroffene Systeme | Lineage-Granularität ist auf Tabellenebene statt Spaltenebene, erzeugt unpräzise Ergebnisse | Lineage-Granularität für die betroffene Transformationskette prüfen |
| Team kann Geschäftsauswirkung einer technischen Änderung nicht einschätzen | technische Lineage ist nicht mit fachlicher Bedeutung angereichert | prüfen, ob betroffene technische Felder mit Geschäftskennzahlen oder -prozessen verknüpft dokumentiert sind |
| eine Breaking Change wird ohne vorherige Impactanalyse durchgeführt | Lineage-Konsultation ist kein verpflichtender Schritt im Änderungsprozess | Änderungsprozess auf verpflichtende Impactanalyse-Schritte vor Breaking Changes prüfen |

Security: Lineage-Metadaten selbst können sensible Informationen über interne Datenflüsse und Geschäftslogik offenlegen und sollten entsprechenden Zugriffsbeschränkungen unterliegen, insbesondere wenn sie Rückschlüsse auf sensible Geschäftsprozesse erlauben. Observability: Lineage-Abdeckungsgrad (Anteil erfasster versus bekannter Gesamtdatenflüsse), Anzahl dokumentierter Lücken und Häufigkeit der tatsächlichen Impactanalyse-Nutzung vor Änderungen sind zentrale Metriken für Lineage-Governance-Gesundheit.

## Trade-offs und Entscheidungen

**Staff** strebt Spaltenebenen-Granularität für präzise Impactanalyse an, wo technisch möglich. **Principal** macht bekannte Lineage-Lücken für das Team explizit dokumentiert, statt sie stillschweigend als vollständig zu behandeln. **Chief** positioniert Data Lineage als Grundlage für verlässliche Impactanalyse und Audit-Fähigkeit, nicht als reines Visualisierungs-Feature ohne operative Konsequenz.

Anti-Patterns: Lineage-Visualisierung als Selbstzweck ohne tatsächliche Nutzung für Impactanalyse vor Änderungen betreiben; bekannte Lücken in der Lineage-Abdeckung nicht dokumentieren und ein trügerisches Gefühl von Vollständigkeit erzeugen; grobgranulare Tabellenebene-Lineage als ausreichend für präzise Impactanalyse akzeptieren.

## Production Checklist

- [ ] Lineage ist auf Spaltenebene erfasst, wo technisch möglich.
- [ ] Bekannte Lücken in der Lineage-Abdeckung sind explizit dokumentiert.
- [ ] Technische Lineage ist mit fachlicher Bedeutung (Geschäftskennzahlen/-prozesse) angereichert.
- [ ] Impactanalyse über den Lineage-Graphen ist verpflichtender Schritt vor Breaking Changes.

## Interviewfragen

### 1. Warum ist Spaltenebenen-Lineage präziser für Impactanalyse als Tabellenebene-Lineage?

**Antwort:** Spaltenebenen-Lineage zeigt genau, welche Zielfelder von einer bestimmten Quellspalte abhängen, während Tabellenebene-Lineage nur die gesamte Zieltabelle als potenziell betroffen ausweist — das erzeugt bei Tabellenebene-Analyse viele falsch-positive, unnötig breite Impactanalyse-Ergebnisse.

### 2. Warum sind unerkannte Lineage-Lücken gefährlicher als offensichtlich fehlende Lineage?

**Antwort:** Eine offensichtlich fehlende Lineage-Erfassung wird als Unsicherheit behandelt und vorsichtig gehandhabt; eine unerkannte Lücke erzeugt hingegen ein trügerisches Gefühl von Vollständigkeit, wodurch ein tatsächlich betroffenes System fälschlich als "nicht betroffen" gilt.

### 3. Was ist der Unterschied zwischen rückwärts- und vorwärtsgerichteter Impactanalyse?

**Antwort:** Rückwärtsgerichtete Impactanalyse identifiziert vor einer geplanten Änderung, welche nachgelagerten Systeme betroffen wären; vorwärtsgerichtete Impactanalyse verfolgt, wie weit sich ein bereits aufgetretenes Datenqualitätsproblem einer Quelle propagiert hat.

### 4. Wie diagnostizierst du, dass eine Änderung ein nachgelagertes System bricht, das laut Lineage-Graph nicht betroffen sein sollte?

**Antwort:** Ich prüfe den tatsächlichen Datenzugriffspfad des betroffenen Systems auf Erfassung im Lineage-Graphen — häufig nutzt das betroffene System einen nicht erfassten Pfad (z. B. einen manuellen Export), der eine Lücke in der Lineage-Abdeckung darstellt.

### 5. Warum reicht rein technische Lineage nicht aus, um Geschäftsauswirkungen einer Änderung einzuschätzen?

**Antwort:** Technische Lineage zeigt nur Datenflüsse zwischen Feldern, nicht deren Geschäftsbedeutung; ohne Verknüpfung mit fachlichen Konzepten (Geschäftskennzahlen, -prozessen) kann ein Team nicht einschätzen, welche geschäftliche Konsequenz eine technische Änderung tatsächlich hat.

### 6. Widersprüchliche Anforderung: Team will vollständige Lineage-Abdeckung über die gesamte Datenplattform UND minimalen Instrumentierungsaufwand für neue Datenflüsse — wie gehst du vor?

**Antwort:** Ich würde erklären, dass vollständige Abdeckung proportionalen Instrumentierungsaufwand für jeden neuen Datenfluss erfordert; ich würde vorschlagen, Lineage-Erfassung für kritische, geschäftsrelevante Datenflüsse zu priorisieren und bekannte, weniger kritische Lücken explizit zu dokumentieren, statt vollständige Abdeckung ohne entsprechenden Aufwand zu versprechen.

## Praktische Labs

~~~python
# Column-level lineage with backward impact analysis
lineage_graph = {
    "gold.customer_ltv": {"sources": ["silver.orders.amount", "silver.customers.signup_date"]},
    "silver.orders.amount": {"sources": ["bronze.raw_orders.amount"]},
    "silver.customers.signup_date": {"sources": ["bronze.raw_customers.created_at"]},
    "dashboard.executive_kpi": {"sources": ["gold.customer_ltv"]},
}

def find_downstream_impact(changed_field, graph):
    impacted = []
    for field, info in graph.items():
        if changed_field in info["sources"]:
            impacted.append(field)
            impacted.extend(find_downstream_impact(field, graph))
    return impacted

impact = find_downstream_impact("bronze.raw_orders.amount", lineage_graph)
print(f"Changing 'bronze.raw_orders.amount' impacts: {impact}")
assert "silver.orders.amount" in impact
assert "gold.customer_ltv" in impact
assert "dashboard.executive_kpi" in impact
print("Backward impact analysis correctly identifies the full downstream chain, including the executive dashboard - not just the direct consumer.")
~~~

## Dependencies, Cross-References und Quellen

1. OpenLineage: [OpenLineage Specification](https://openlineage.io/docs/), abgerufen 2026-09-17.
2. dbt Labs: [Column-Level Lineage](https://docs.getdbt.com/docs/collaborate/column-level-lineage), abgerufen 2026-09-17.
3. Data Mesh Principles: [Data Discoverability and Lineage](https://www.datamesh-architecture.com/), abgerufen 2026-09-17.

dbt-Lineage-Grundlagen sind kanonisch in [KB-0223](05-dbt-und-analytische-modelle.md) behandelt. Produktspezifische Lineage-Extraktionswerkzeuge vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte, werkzeugübergreifende Lineage-Protokolle (z. B. OpenLineage) für Interoperabilität zwischen Orchestrierungs- und Transformationswerkzeugen | Adopting | Gegenüber proprietären, werkzeugspezifischen Lineage-Implementierungen für Multi-Tool-Umgebungen bevorzugen. |
| Automatische Lückenerkennung durch Abgleich deklarierter Lineage gegen beobachtete tatsächliche Datenzugriffsmuster | Adopting | Ergänzend zu manueller Lückendokumentation für kontinuierliche Verifikation einsetzen. |

Ein Team akzeptiert ein Data-Lineage-System erst, wenn Spaltenebenen-Abdeckung für kritische Datenflüsse und bekannte Lücken nachweisbar dokumentiert sind.
