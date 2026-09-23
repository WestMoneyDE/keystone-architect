---
{"id": "KB-0223", "title": "Dbt und analytische Modelle", "domain": "10", "sequence": 5, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "GENAI", "MLOPS"], "requires": [{"id": "KB-0219", "concepts": ["ETL/ELT"], "needed_for": "understanding"}], "related": ["KB-0222"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Modell-Abhängigkeitsgraph mit inkrementellem Build und Datentests lokal implementieren.", "rationale": "Der Nutzen deklarativer Abhängigkeitsauflösung wird erst durch konkrete Graph-Implementierung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Materialization-Strategie (View, Table, Incremental) für ein konkretes analytisches Modell begründet wählen.", "rationale": "Jede Materialization-Art hat unterschiedliche Kompromisse zwischen Abfragegeschwindigkeit und Build-Kosten."}, "STAFF-TARGET": {"active": true, "scope": "Fehlerhafte Analyseergebnisse auf einen fehlgeschlagenen Datentest statt auf einen Dashboard-Bug zurückführen können.", "rationale": "Dbt-Datentests fangen Datenqualitätsprobleme an der Quelle ab, bevor sie nachgelagerte Analysen verfälschen."}, "CHIEF-TARGET": {"active": true, "scope": "Analytische Transformationen als versionierte, testbare Software-Artefakte positionieren, nicht als Ad-hoc-SQL-Skripte.", "rationale": "Dbt bringt Software-Engineering-Praktiken (Versionierung, Tests, Dokumentation, Abhängigkeitsmanagement) in analytische SQL-Transformationen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Produktspezifische Makro- und Paket-Ökosystem-Details sind Vertiefung.", "rationale": "Kern ist das Prinzip von Materializations, Abhängigkeitsgraphen und Datentests, nicht die Werkzeugökosystem-Details."}}, "lab_validation": [{"lab_id": "KB-0223-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für dbt-artige Abhängigkeitsauflösung mit Datentests", "evidence": "Ein deklarativer Abhängigkeitsgraph zwischen Modellen erlaubt automatische Ausführungsreihenfolge; ein fehlgeschlagener Datentest an einem Basismodell kann abhängige nachgelagerte Modelle explizit blockieren, statt fehlerhafte Daten stillschweigend weiterzureichen.", "limitations": "Kein echtes dbt, kein echtes Data Warehouse, keine Produktion."}]}
---
# Dbt und analytische Modelle

> **Ziel:** dbt (data build tool) bringt Software-Engineering-Praktiken — Versionierung, automatische Abhängigkeitsauflösung, Tests, Dokumentation — in SQL-basierte analytische Transformationen. Ein dbt-Modell ist ein versioniertes, testbares Artefakt, kein isoliertes Ad-hoc-SQL-Skript; die Wahl der Materialization-Strategie (View, Table, Incremental) bestimmt den Kompromiss zwischen Abfragegeschwindigkeit und Build-Kosten.

## Zweck, Mental Model und Dependencies

dbt-Modelle sind SQL-SELECT-Anweisungen, die aufeinander referenzieren können (über eine `ref()`-Funktion statt hartkodierter Tabellennamen) — dbt löst daraus automatisch einen Abhängigkeitsgraphen auf und führt Modelle in der korrekten Reihenfolge aus, ohne dass Entwickler die Ausführungsreihenfolge manuell verwalten müssen. Materialization-Strategien bestimmen, wie ein Modell physisch im Data Warehouse gespeichert wird: eine View berechnet das Ergebnis bei jeder Abfrage neu (keine Build-Kosten, aber potenziell langsame Abfragen bei komplexen Transformationen), eine Table materialisiert das Ergebnis vollständig bei jedem Build (schnelle Abfragen, aber vollständige Neuberechnung jedes Mal), und Incremental-Materialization verarbeitet nur neue oder geänderte Daten seit dem letzten Build (schnellere Builds bei großen, wachsenden Datenmengen, aber komplexere Logik für korrekte inkrementelle Aktualisierung). Datentests (z. B. Eindeutigkeit, Nicht-Null-Prüfung, referenzielle Integrität) werden deklarativ definiert und automatisch bei jedem Build ausgeführt — ein fehlgeschlagener Test an einem Basismodell kann die Ausführung abhängiger nachgelagerter Modelle explizit blockieren, statt fehlerhafte Daten stillschweigend durch die gesamte Transformationskette weiterzureichen. Lies [KB-0219](01-etl-und-elt.md).

~~~text
Raw SQL scripts:  manual execution order, no versioning discipline, no automated quality checks
dbt models:       ref()-based dependency graph -> automatic execution order
                   + declarative tests -> failed test at base model BLOCKS downstream models, doesn't silently propagate bad data
View:        no build cost, computed at query time -> can be slow for complex transforms
Table:       full rebuild each run -> fast queries, but rebuild cost scales with data volume
Incremental: only new/changed data processed -> fast builds at scale, but correctness logic is non-trivial
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Abhängigkeitsdeklaration | referenzieren Modelle sich über `ref()` statt hartkodierter Tabellennamen? | hartkodierte Referenzen umgehen die automatische Abhängigkeitsauflösung, Ausführungsreihenfolge kann fehlerhaft sein |
| Materialization-Wahl | passt die gewählte Materialization-Strategie zur Abfragehäufigkeit und Datenmenge des Modells? | falsche Wahl erzeugt entweder unnötige Build-Kosten oder unnötig langsame Abfragen |
| Datentest-Abdeckung | sind kritische Datenqualitätsannahmen (Eindeutigkeit, Nicht-Null, referenzielle Integrität) als Tests deklariert? | fehlende Tests lassen Datenqualitätsprobleme unbemerkt bis in nachgelagerte Analysen durchsickern |
| Inkrementelle Korrektheit | ist die Logik für inkrementelle Aktualisierung gegen Spätankunft oder Rückwirkende Änderungen der Quelldaten geprüft? | fehlerhafte inkrementelle Logik kann veraltete oder unvollständige Daten dauerhaft im Modell belassen |

Implementierung: Modelle referenzieren andere Modelle konsequent über `ref()`, damit dbt den vollständigen Abhängigkeitsgraphen automatisch auflösen und die korrekte Ausführungsreihenfolge sicherstellen kann. Materialization wird pro Modell explizit gewählt — Views für selten abgefragte oder einfache Transformationen, Tables für häufig abgefragte, aufwendig zu berechnende Endergebnisse, Incremental für große, kontinuierlich wachsende Faktentabellen. Datentests werden für alle kritischen Datenqualitätsannahmen deklariert und als Teil der regulären Build-Pipeline ausgeführt, mit expliziter Konfiguration, ob ein fehlgeschlagener Test nachgelagerte Modelle blockiert oder nur eine Warnung erzeugt. Inkrementelle Modelle werden explizit gegen Szenarien wie rückwirkende Quelldatenänderungen getestet, mit einer definierten Full-Refresh-Strategie für den Fall, dass die inkrementelle Logik zurückgesetzt werden muss.

## Scalability, Reliability, Security und Observability

dbt skaliert analytische Transformationsentwicklung durch Wiederverwendbarkeit (Modelle referenzieren andere Modelle statt Logik zu duplizieren) und durch inkrementelle Materialization für wachsende Datenmengen. Reliability-Grenze: fehlende oder unzureichende Datentests sind ein latentes Risiko, das erst sichtbar wird, wenn fehlerhafte Daten durch die gesamte Transformationskette bis in ein Dashboard oder eine Geschäftsentscheidung durchsickern, oft lange bevor die eigentliche Ursache identifiziert wird.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Dashboard zeigt unplausible oder fehlerhafte Zahlen | ein Datentest an einem Basismodell in der Transformationskette ist fehlgeschlagen oder fehlt | Testergebnisse für alle Modelle in der Abhängigkeitskette des betroffenen Dashboards prüfen |
| ein Modell wird in falscher Reihenfolge relativ zu seiner Abhängigkeit ausgeführt | Modell referenziert eine Abhängigkeit über hartkodierten Tabellennamen statt `ref()` | Modell-Quellcode auf konsequente Nutzung von `ref()` statt hartkodierter Referenzen prüfen |
| inkrementelles Modell enthält veraltete Daten trotz erfolgreicher Builds | inkrementelle Logik berücksichtigt rückwirkende Quelldatenänderungen nicht korrekt | Full-Refresh des betroffenen Modells durchführen und Ergebnis mit dem inkrementellen Zustand vergleichen |
| Build-Zeiten wachsen unverhältnismäßig mit der Datenmenge | Table-Materialization für ein großes, kontinuierlich wachsendes Modell statt Incremental verwendet | Materialization-Strategie des betroffenen Modells gegen Datenwachstum und Build-Zeit-Trend prüfen |

Security: Zugriffskontrolle für dbt-Modelle sollte konsistent mit den zugrunde liegenden Datenquellen sein, insbesondere wenn ein materialisiertes Modell sensible Rohdaten aggregiert und damit potenziell breiter zugänglich macht als die ursprüngliche Quelle. Observability: Testfehlerrate pro Modell, Build-Dauer-Trends und Abhängigkeitsgraph-Visualisierung sind zentrale Werkzeuge zur Diagnose von Datenqualitäts- und Performanceproblemen in der Transformationskette.

## Trade-offs und Entscheidungen

**Staff** referenziert Modelle konsequent über `ref()` für korrekte automatische Abhängigkeitsauflösung. **Principal** macht Datentest-Abdeckung für kritische Datenqualitätsannahmen im Team explizit sichtbar. **Chief** positioniert analytische Transformationen als versionierte, testbare Software-Artefakte, nicht als isolierte Ad-hoc-SQL-Skripte.

Anti-Patterns: Modelle über hartkodierte Tabellennamen statt `ref()` referenzieren; kritische Datenqualitätsannahmen ohne deklarierte Tests lassen; Table-Materialization für große, wachsende Faktentabellen verwenden, wo Incremental angemessener wäre.

## Production Checklist

- [ ] Modelle referenzieren Abhängigkeiten konsequent über `ref()`.
- [ ] Materialization-Strategie ist pro Modell explizit gegen Abfragehäufigkeit und Datenmenge gewählt.
- [ ] Kritische Datenqualitätsannahmen sind als deklarative Tests abgedeckt.
- [ ] Inkrementelle Modelle sind gegen rückwirkende Quelldatenänderungen getestet, mit definierter Full-Refresh-Strategie.

## Interviewfragen

### 1. Warum ist die konsequente Nutzung von `ref()` statt hartkodierter Tabellennamen wichtig?

**Antwort:** `ref()` ermöglicht dbt, den vollständigen Abhängigkeitsgraphen zwischen Modellen automatisch aufzulösen und Modelle in korrekter Reihenfolge auszuführen; hartkodierte Referenzen umgehen diesen Mechanismus und können zu fehlerhafter Ausführungsreihenfolge führen.

### 2. Was ist der Unterschied zwischen View-, Table- und Incremental-Materialization?

**Antwort:** Eine View berechnet das Ergebnis bei jeder Abfrage neu ohne Build-Kosten, eine Table materialisiert das Ergebnis vollständig bei jedem Build, und Incremental verarbeitet nur neue oder geänderte Daten seit dem letzten Build — die Wahl ist ein Kompromiss zwischen Abfragegeschwindigkeit, Build-Kosten und Implementierungskomplexität.

### 3. Warum sind deklarative Datentests in dbt wichtiger als reine Code-Reviews der SQL-Transformationen?

**Antwort:** Datentests prüfen die tatsächlichen Daten zur Build-Zeit (z. B. Eindeutigkeit, Nicht-Null, referenzielle Integrität) und können nachgelagerte Modelle bei einem Fehlschlag explizit blockieren — Code-Reviews prüfen nur die Transformationslogik, nicht ob die tatsächlichen Daten zur Laufzeit den Erwartungen entsprechen.

### 4. Wie diagnostizierst du unplausible Zahlen in einem Analyse-Dashboard, das auf dbt-Modellen basiert?

**Antwort:** Ich prüfe die Testergebnisse aller Modelle in der Abhängigkeitskette, die zu diesem Dashboard führt — ein fehlgeschlagener oder fehlender Datentest an einem Basismodell ist eine wahrscheinliche Ursache für fehlerhafte nachgelagerte Zahlen.

### 5. Warum ist Incremental-Materialization für große, wachsende Faktentabellen oft die bessere Wahl gegenüber Table-Materialization?

**Antwort:** Table-Materialization berechnet bei jedem Build die gesamte Datenmenge neu, was mit wachsendem Datenvolumen unverhältnismäßig lange dauert; Incremental verarbeitet nur neue oder geänderte Daten, was die Build-Zeit deutlich reduziert, allerdings mit höherer Implementierungskomplexität für korrekte inkrementelle Logik.

### 6. Widersprüchliche Anforderung: Analytics-Team will maximale Abfragegeschwindigkeit für alle Modelle (alles als Table materialisieren) UND minimale Build-Kosten und -Zeit — wie gehst du vor?

**Antwort:** Ich würde erklären, dass dies ein struktureller Zielkonflikt ist — Table-Materialization für alle Modelle maximiert Abfragegeschwindigkeit, aber auch Build-Kosten; ich würde vorschlagen, Materialization pro Modell nach tatsächlicher Abfragehäufigkeit zu differenzieren (Views für selten abgefragte Zwischenmodelle, Tables oder Incremental nur für häufig abgefragte Endergebnisse), statt eine einzelne Strategie für alle Modelle unreflektiert anzuwenden.

## Praktische Labs

~~~python
# dbt-like dependency graph with test-gated execution
models = {
    "stg_orders": {"deps": [], "test_passed": True},
    "stg_customers": {"deps": [], "test_passed": False},  # failing data test
    "fct_orders": {"deps": ["stg_orders", "stg_customers"], "test_passed": True},
}

def resolve_execution_order(models):
    order = []
    visited = set()

    def visit(name):
        if name in visited:
            return
        visited.add(name)
        for dep in models[name]["deps"]:
            visit(dep)
        order.append(name)

    for name in models:
        visit(name)
    return order

def build_models(models):
    order = resolve_execution_order(models)
    built = []
    blocked = []
    for name in order:
        deps = models[name]["deps"]
        if any(dep in blocked for dep in deps):
            blocked.append(name)  # downstream model blocked by failed upstream test
            continue
        if not models[name]["test_passed"]:
            blocked.append(name)
            continue
        built.append(name)
    return built, blocked

built, blocked = build_models(models)
print(f"Built successfully: {built}")
print(f"Blocked (upstream test failure): {blocked}")
assert "stg_customers" in blocked
assert "fct_orders" in blocked  # correctly blocked because it depends on the failing model
print("fct_orders is blocked, NOT built with bad data - the failed test propagates as a block, not silently.")
~~~

## Dependencies, Cross-References und Quellen

1. dbt Labs: [dbt Model Documentation](https://docs.getdbt.com/docs/build/models), abgerufen 2026-09-17.
2. dbt Labs: [Materializations](https://docs.getdbt.com/docs/build/materializations), abgerufen 2026-09-17.
3. dbt Labs: [Data Tests](https://docs.getdbt.com/docs/build/data-tests), abgerufen 2026-09-17.

Produktspezifische Makro- und Paket-Ökosystem-Details vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Column-Level Lineage (automatische Nachverfolgung, welche Spalte aus welcher Quellspalte abgeleitet ist) | Adopting | Für komplexe Transformationsketten gezielt zur Impact-Analyse bei Schema-Änderungen nutzen. |
| Unit Tests für dbt-Modelle (Tests gegen synthetische statt echte Daten) | Adopting | Für kritische Transformationslogik ergänzend zu Datentests auf echten Daten einsetzen. |

Ein Team akzeptiert ein dbt-Modell erst, wenn Datentests für kritische Annahmen definiert sind und die Materialization-Wahl gegen Abfragehäufigkeit und Datenmenge begründet ist.
