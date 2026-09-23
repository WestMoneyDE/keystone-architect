---
{"id": "KB-0219", "title": "ETL und ELT", "domain": "10", "sequence": 1, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "GENAI", "MLOPS"], "requires": [{"id": "KB-0200", "concepts": ["Transaktionen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine idempotente, inkrementelle Datenlieferkette mit Fehlerisolation lokal implementieren.", "rationale": "Wiederholbarkeit und Fehlerisolation werden erst durch konkrete Implementierung einer inkrementellen Pipeline greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "ETL gegenüber ELT für einen konkreten Datenlieferkette-Anwendungsfall begründet wählen, basierend auf Transformationskomplexität und Zielsystem-Fähigkeiten.", "rationale": "Beide Ansätze verschieben die Transformationslast an unterschiedliche Stellen der Pipeline mit unterschiedlichen Kompromissen."}, "STAFF-TARGET": {"active": true, "scope": "Einen fehlgeschlagenen Pipeline-Lauf mit teilweise geladenen Daten auf fehlende Fehlerisolation statt auf ein Quelldatenproblem zurückführen können.", "rationale": "Ohne Fehlerisolation kann ein einzelner fehlerhafter Datensatz einen gesamten Lauf blockieren oder inkonsistente Teilzustände hinterlassen."}, "CHIEF-TARGET": {"active": true, "scope": "Wiederholbarkeit (Idempotenz) als Grundvoraussetzung für zuverlässige Datenlieferketten positionieren, nicht als optionale Verbesserung.", "rationale": "Ohne Idempotenz ist ein erneuter Lauf nach einem Fehler riskant, was Recovery in Produktion erschwert."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Produktspezifische Orchestrierungswerkzeuge (Airflow, dbt) sind Vertiefung.", "rationale": "Kern ist das Prinzip von Inkrementalität, Fehlerisolation und Idempotenz, nicht die Werkzeugkonfiguration."}}, "lab_validation": [{"lab_id": "KB-0219-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für idempotente, inkrementelle Datenverarbeitung mit Fehlerisolation", "evidence": "Ein idempotenter Verarbeitungsschritt liefert bei wiederholter Ausführung mit denselben Eingabedaten dasselbe Ergebnis, ohne Duplikate zu erzeugen; ein fehlerhafter Datensatz wird isoliert, ohne den gesamten Lauf zu blockieren.", "limitations": "Kein echtes Orchestrierungssystem, keine reale Datenquelle, keine Produktion."}]}
---
# ETL und ELT

> **Ziel:** ETL (Extract, Transform, Load) transformiert Daten vor dem Laden in das Zielsystem; ELT (Extract, Load, Transform) lädt Rohdaten zuerst und transformiert im Zielsystem selbst. Die Wahl zwischen beiden ist ein Trade-off zwischen früher Datenqualitätskontrolle und Nutzung der Rechenleistung moderner Zielsysteme — aber unabhängig von der Wahl sind Idempotenz und Fehlerisolation die Grundvoraussetzung für zuverlässige Datenlieferketten.

## Zweck, Mental Model und Dependencies

ETL transformiert Daten in einer separaten Verarbeitungsschicht, bevor sie in das Zielsystem (z. B. ein Data Warehouse) geladen werden — das ermöglicht frühe Datenqualitätsprüfung und -bereinigung, erfordert aber dedizierte Transformationsinfrastruktur und macht Rohdaten im Zielsystem nicht verfügbar. ELT lädt Rohdaten zuerst unverändert in das Zielsystem und nutzt dessen Rechenleistung (z. B. eines modernen, spaltenorientierten Data Warehouse) für die Transformation — das erhält die Rohdaten für spätere, andere Transformationszwecke und nutzt oft günstigere, elastische Zielsystem-Rechenleistung, verschiebt aber Datenqualitätsprobleme später in die Pipeline. Unabhängig von der Wahl zwischen ETL und ELT sind zwei Eigenschaften kritisch: Idempotenz (ein wiederholter Lauf mit denselben Eingabedaten liefert dasselbe Ergebnis, ohne Duplikate zu erzeugen) ermöglicht sicheres erneutes Ausführen nach einem Fehler, und Fehlerisolation (ein fehlerhafter Datensatz blockiert nicht den gesamten Lauf) verhindert, dass einzelne problematische Datensätze die gesamte Pipeline zum Stillstand bringen.

~~~text
ETL:  extract -> TRANSFORM (separate layer) -> load clean data -> early quality control, no raw data preserved
ELT:  extract -> load RAW data -> TRANSFORM (in target system) -> raw data preserved, leverages target compute
Both need: idempotency (safe re-run) + error isolation (one bad record doesn't block the whole run)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Idempotenz | liefert ein wiederholter Lauf mit denselben Eingabedaten dasselbe Ergebnis? | fehlende Idempotenz erzeugt Duplikate bei erneutem Lauf nach einem Fehler |
| Fehlerisolation | wird ein fehlerhafter Datensatz isoliert behandelt, ohne den gesamten Lauf zu blockieren? | ein einzelner fehlerhafter Datensatz blockiert die gesamte Pipeline oder erzeugt inkonsistente Teilzustände |
| Inkrementelle Verarbeitung | werden nur geänderte/neue Daten verarbeitet, statt bei jedem Lauf die gesamte Datenmenge neu zu laden? | Vollverarbeitung bei jedem Lauf skaliert nicht mit wachsendem Datenvolumen |
| ETL vs. ELT-Wahl | passt die Wahl zur Transformationskomplexität und den Fähigkeiten des Zielsystems? | ELT mit einem Zielsystem ohne ausreichende Transformationsfähigkeiten erzeugt Performanceprobleme |

Implementierung: Idempotenz wird durch deterministische, eindeutige Identifikation jedes verarbeiteten Datensatzes erreicht (z. B. Upsert-Operationen statt reinem Insert, oder explizite Deduplizierung anhand eines eindeutigen Schlüssels), sodass ein erneuter Lauf keine Duplikate erzeugt. Fehlerisolation wird durch explizite Dead-Letter-Mechanismen umgesetzt: fehlerhafte Datensätze werden separat protokolliert und aus dem Hauptverarbeitungsfluss ausgeschlossen, statt den gesamten Lauf abzubrechen. Inkrementelle Verarbeitung nutzt einen expliziten Änderungsmarker (Zeitstempel, Sequenznummer, oder Change-Data-Capture-Signal) statt bei jedem Lauf die gesamte Quelldatenmenge zu verarbeiten. Die ETL/ELT-Wahl richtet sich danach, ob frühe Datenqualitätskontrolle vor dem Laden erforderlich ist (spricht für ETL) oder ob Rohdaten für spätere, unterschiedliche Transformationszwecke erhalten bleiben sollen und das Zielsystem ausreichend Rechenleistung bietet (spricht für ELT).

## Scalability, Reliability, Security und Observability

ELT skaliert oft besser für sehr große Datenmengen, weil moderne Data-Warehouse-Zielsysteme elastische, spezialisierte Rechenleistung für Transformationen bieten, die eine separate ETL-Verarbeitungsschicht erst aufwendig nachbilden müsste. Reliability-Grenze: fehlende Idempotenz ist ein latentes Risiko, das erst sichtbar wird, wenn ein Lauf nach einem Teilfehler erneut ausgeführt werden muss — ohne Idempotenz entstehen dann Duplikate oder inkonsistente Zustände, die manuell bereinigt werden müssen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| nach einem erneuten Pipeline-Lauf erscheinen Datensätze doppelt im Zielsystem | Verarbeitungsschritt ist nicht idempotent, erneuter Lauf erzeugt Duplikate statt zu überschreiben | prüfen, ob der Ladeschritt Upsert-Semantik oder reine Insert-Semantik verwendet |
| ein einzelner fehlerhafter Datensatz führt zum Abbruch des gesamten Pipeline-Laufs | fehlende Fehlerisolation, keine Dead-Letter-Behandlung für problematische Datensätze | prüfen, ob die Pipeline einzelne fehlerhafte Datensätze isolieren kann, statt komplett abzubrechen |
| Pipeline-Laufzeit wächst proportional mit der Gesamtdatenmenge, nicht mit den tatsächlichen Änderungen | Pipeline verarbeitet bei jedem Lauf die gesamte Datenmenge statt nur inkrementelle Änderungen | prüfen, ob ein Änderungsmarker (Zeitstempel, CDC-Signal) für inkrementelle Verarbeitung genutzt wird |
| Transformationen im Zielsystem sind unerwartet langsam oder teuer | ELT-Ansatz gewählt, aber Zielsystem hat unzureichende Transformationsfähigkeiten für die Komplexität | Transformationskomplexität gegen die tatsächlichen Rechenfähigkeiten des Zielsystems prüfen |

Security: Rohdaten, die bei ELT unverändert ins Zielsystem geladen werden, können sensible Informationen enthalten, die bei ETL bereits vor dem Laden maskiert oder entfernt worden wären — Zugriffskontrolle und Datenmaskierung müssen bei ELT entsprechend im Zielsystem selbst durchgesetzt werden. Observability: Lauf-Erfolgsrate, Anzahl isolierter Fehlerdatensätze (Dead-Letter-Rate) und Verarbeitungsdauer relativ zur inkrementellen Datenmenge sind zentrale Metriken für Pipeline-Gesundheit.

## Trade-offs und Entscheidungen

**Staff** implementiert Idempotenz durch Upsert-Semantik und eindeutige Datensatzidentifikation. **Principal** macht Fehlerisolationsmechanismen für das Team explizit nachvollziehbar, statt Pipelines bei einzelnen fehlerhaften Datensätzen komplett abbrechen zu lassen. **Chief** positioniert Idempotenz und Fehlerisolation als Grundvoraussetzung für zuverlässige Datenlieferketten, unabhängig von der ETL/ELT-Wahl.

Anti-Patterns: Pipelines ohne Idempotenz betreiben und bei jedem Fehler manuell Duplikate bereinigen; einen einzelnen fehlerhaften Datensatz den gesamten Pipeline-Lauf blockieren lassen; ELT ohne Prüfung der tatsächlichen Transformationsfähigkeiten des Zielsystems wählen.

## Production Checklist

- [ ] Verarbeitungsschritte sind idempotent (Upsert-Semantik oder gleichwertige Deduplizierung).
- [ ] Fehlerhafte Datensätze werden isoliert (Dead-Letter-Mechanismus), ohne den gesamten Lauf zu blockieren.
- [ ] Verarbeitung ist inkrementell, basierend auf einem expliziten Änderungsmarker.
- [ ] ETL/ELT-Wahl ist gegen tatsächliche Transformationskomplexität und Zielsystem-Fähigkeiten geprüft.

## Interviewfragen

### 1. Was ist der grundlegende Unterschied zwischen ETL und ELT?

**Antwort:** ETL transformiert Daten in einer separaten Verarbeitungsschicht vor dem Laden ins Zielsystem, ELT lädt Rohdaten zuerst unverändert und transformiert im Zielsystem selbst, wodurch Rohdaten erhalten bleiben und die Rechenleistung des Zielsystems genutzt wird.

### 2. Warum ist Idempotenz eine Grundvoraussetzung für zuverlässige Datenlieferketten?

**Antwort:** Ohne Idempotenz erzeugt ein erneuter Lauf nach einem Teilfehler Duplikate oder inkonsistente Zustände; mit Idempotenz (z. B. durch Upsert-Semantik) liefert ein wiederholter Lauf mit denselben Eingabedaten dasselbe Ergebnis, was sicheres Recovery nach Fehlern ermöglicht.

### 3. Was bedeutet Fehlerisolation in einer Datenpipeline, und warum ist sie wichtig?

**Antwort:** Fehlerisolation bedeutet, dass ein einzelner fehlerhafter Datensatz separat behandelt (z. B. in einen Dead-Letter-Mechanismus verschoben) wird, ohne den gesamten Pipeline-Lauf zu blockieren — ohne Fehlerisolation kann ein einzelner problematischer Datensatz die gesamte Datenlieferkette zum Stillstand bringen.

### 4. Wie diagnostizierst du doppelte Datensätze im Zielsystem nach einem erneuten Pipeline-Lauf?

**Antwort:** Ich prüfe, ob der Ladeschritt Upsert-Semantik (idempotent) oder reine Insert-Semantik (nicht idempotent) verwendet — fehlende Idempotenz ist die häufigste Ursache für Duplikate nach einem erneuten Lauf.

### 5. Wann ist ELT gegenüber ETL die bessere Wahl?

**Antwort:** Wenn Rohdaten für spätere, unterschiedliche Transformationszwecke erhalten bleiben sollen und das Zielsystem ausreichend elastische Rechenleistung für die Transformation bietet — ELT verschiebt Transformationskomplexität in ein oft leistungsfähigeres und flexibleres Zielsystem.

### 6. Widersprüchliche Anforderung: Team will minimale Pipeline-Laufzeit durch reine Inkrementalität UND garantierte Vollständigkeit auch bei verspätet eintreffenden Quelldaten — wie gehst du vor?

**Antwort:** Ich würde erklären, dass reine Inkrementalität ohne Berücksichtigung verspäteter Daten Vollständigkeit gefährdet; ich würde ein explizites Toleranzfenster für verspätete Daten in die inkrementelle Verarbeitung einbauen (ähnlich wie bei Zeitreihendaten), das einen Kompromiss zwischen Laufzeit und Vollständigkeit herstellt, statt beide Ziele ohne Kompromiss zu versprechen.

## Praktische Labs

~~~python
# Idempotent, incremental processing with error isolation
target_store = {}
dead_letter = []

def process_record(record):
    if "amount" not in record or not isinstance(record["amount"], (int, float)):
        raise ValueError(f"invalid record: {record}")
    return {"id": record["id"], "amount": record["amount"] * 1.1}  # example transform

def run_pipeline(records):
    for record in records:
        try:
            transformed = process_record(record)
            target_store[transformed["id"]] = transformed  # upsert - idempotent by id
        except ValueError:
            dead_letter.append(record)  # error isolation - bad record doesn't block the run

batch = [
    {"id": 1, "amount": 100},
    {"id": 2, "amount": "invalid"},  # bad record
    {"id": 3, "amount": 200},
]

run_pipeline(batch)
assert len(target_store) == 2
assert len(dead_letter) == 1

# Re-run with same batch: idempotent, no duplicates, same result
run_pipeline(batch)
assert len(target_store) == 2  # still 2, not 4 - upsert prevented duplication
print(f"Target store after re-run: {len(target_store)} records (idempotent). Dead letter: {len(dead_letter)} isolated bad records.")
~~~

## Dependencies, Cross-References und Quellen

1. dbt Labs: [What is ELT vs ETL?](https://www.getdbt.com/blog/etl-vs-elt), abgerufen 2026-09-17.
2. Apache Airflow: [Best Practices for Idempotency](https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html), abgerufen 2026-09-17.
3. Fowler: [Patterns of Enterprise Application Architecture — Gateway/Data Mapper](https://martinfowler.com/eaaCatalog/), abgerufen 2026-09-17.

Werkzeugspezifische Orchestrierungsdetails (Airflow, dbt, Fivetran) vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Deklarative Transformations-Frameworks (z. B. dbt) mit eingebauter Testbarkeit und Versionierung | Established | Für ELT-Transformationen gegenüber prozeduralem SQL-Skripting standardmäßig bevorzugen. |
| Streaming-ETL mit kontinuierlicher inkrementeller Verarbeitung statt Batch-Läufen | Adopting | Für Anwendungsfälle mit niedrigem Latenzbedarf gegenüber klassischem Batch-ETL evaluieren. |

Ein Team akzeptiert eine ETL-/ELT-Pipeline erst, wenn Idempotenz und Fehlerisolation nachweisbar getestet sind, nicht nur der erfolgreiche Standardlauf.
