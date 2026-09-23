---
{"id": "KB-0230", "title": "Lakehouse-Architektur", "domain": "10", "sequence": 12, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "GENAI", "MLOPS"], "requires": [{"id": "KB-0228", "concepts": ["Apache Iceberg"], "needed_for": "understanding"}, {"id": "KB-0229", "concepts": ["Delta Lake"], "needed_for": "understanding"}], "related": ["KB-0219"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein dreistufiges Zonenmodell (Roh, bereinigt, konsumierbar) mit expliziten Qualitätsgates lokal implementieren.", "rationale": "Der Wert getrennter Datenzonen wird erst durch konkrete Modellierung der Qualitätsübergänge greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Engine- und Tabellenformat-Auswahl für gemischte Analytiklasten (Batch, Streaming, ML) begründet über die Zonen hinweg gestalten.", "rationale": "Unterschiedliche Zonen und Lastarten können unterschiedliche Engine-Anforderungen haben, die im Gesamtdesign koordiniert werden müssen."}, "STAFF-TARGET": {"active": true, "scope": "Fehlerhafte konsumierbare Daten auf einen fehlenden Qualitätsgate-Übergang zwischen Zonen statt auf einen Engine-Bug zurückführen können.", "rationale": "Ohne explizite Qualitätsgates zwischen Zonen können fehlerhafte Rohdaten unbemerkt bis in konsumierbare Endzustände durchsickern."}, "CHIEF-TARGET": {"active": true, "scope": "Lakehouse-Architektur als organisatorisches Zonenmodell mit Governance-Verantwortung positionieren, nicht nur als Kombination von Tabellenformat und Objektspeicher.", "rationale": "Die technischen Bausteine (Iceberg/Delta Lake, Objektspeicher) allein garantieren keine Datenqualität ohne begleitende Governance-Prozesse."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Produktspezifische Katalog- und Governance-Werkzeugintegrationen sind Vertiefung.", "rationale": "Kern ist das Zonenmodell und die Governance-Verantwortung, nicht die Werkzeugimplementierung."}}, "lab_validation": [{"lab_id": "KB-0230-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für dreistufiges Zonenmodell mit expliziten Qualitätsgates", "evidence": "Daten durchlaufen explizit definierte Qualitätsprüfungen beim Übergang von der Rohzone zur bereinigten Zone; Daten, die die Prüfung nicht bestehen, erreichen die konsumierbare Zone nicht.", "limitations": "Kein echtes Lakehouse-System, keine reale Datenquelle, keine Produktion."}]}
---
# Lakehouse-Architektur

> **Ziel:** Eine Lakehouse-Architektur verbindet die Flexibilität eines Data Lake (rohe, vielfältige Daten auf günstigem Objektspeicher) mit den Konsistenz- und Governance-Eigenschaften eines Data Warehouse — über ein Zonenmodell (Roh, bereinigt, konsumierbar) und offene Tabellenformate (Iceberg, Delta Lake, siehe [KB-0228](10-apache-iceberg.md), [KB-0229](11-delta-lake.md)). Die technischen Tabellenformat-Bausteine allein garantieren keine Datenqualität — explizite Governance-Prozesse und Qualitätsgates zwischen Zonen sind notwendig.

## Zweck, Mental Model und Dependencies

Das klassische Zonenmodell einer Lakehouse-Architektur unterteilt Daten in mindestens drei Stufen: die Rohzone (Bronze) enthält unveränderte Quelldaten in ihrer ursprünglichen Form, ohne Qualitätsgarantien; die bereinigte Zone (Silver) enthält Daten, die validiert, dedupliziert und in ein konsistentes Schema überführt wurden; die konsumierbare Zone (Gold) enthält geschäftsfertig aggregierte, für spezifische Analyse- oder Reporting-Anwendungsfälle optimierte Datensätze. Der Übergang zwischen Zonen erfordert explizite Qualitätsgates (Validierungsregeln, Datentests, siehe [KB-0223](05-dbt-und-analytische-modelle.md)) — ohne diese Gates können fehlerhafte oder unvollständige Rohdaten unbemerkt bis in die konsumierbare Zone durchsickern und dort geschäftskritische Entscheidungen beeinflussen. Offene Tabellenformate (Iceberg, Delta Lake) bringen ACID-Garantien und Schema-Evolution über alle Zonen hinweg, was zuverlässige, konsistente Übergänge zwischen den Zonen technisch ermöglicht — sie ersetzen aber nicht die organisatorische Verantwortung, tatsächlich Qualitätsgates zu definieren und durchzusetzen. Engine-Auswahl (Batch-Verarbeitung, Streaming, ML-Training) kann je nach Zone und Anwendungsfall variieren, wird aber durch die gemeinsame, offene Tabellenformat-Schicht koordiniert, statt für jede Engine separate, inkompatible Datenkopien zu benötigen. Lies [KB-0228](10-apache-iceberg.md), [KB-0229](11-delta-lake.md) und [KB-0219](01-etl-und-elt.md).

~~~text
Raw zone (Bronze):        unmodified source data, no quality guarantees
Cleaned zone (Silver):    validated, deduplicated, consistent schema -> QUALITY GATE required for this transition
Consumable zone (Gold):   business-ready aggregates -> QUALITY GATE required for this transition
Open table format (Iceberg/Delta): technical foundation for consistent transitions - does NOT replace quality gate governance
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Zonenmodell-Klarheit | ist explizit definiert, welche Qualitätsgarantien jede Zone bietet? | unklare Zonengrenzen erzeugen Verwirrung darüber, welchen Daten vertraut werden kann |
| Qualitätsgates zwischen Zonen | werden explizite Validierungsregeln beim Übergang zwischen Zonen durchgesetzt? | fehlende Gates lassen fehlerhafte Rohdaten unbemerkt bis in konsumierbare Endzustände durchsickern |
| Tabellenformat-Konsistenz über Zonen | wird durchgängig ein offenes Tabellenformat über alle Zonen genutzt? | inkonsistente Formate zwischen Zonen erschweren zuverlässige, ACID-garantierte Übergänge |
| Engine-Koordination | können unterschiedliche Engines (Batch, Streaming, ML) dieselbe zugrunde liegende Datenschicht konsistent nutzen? | separate, inkompatible Datenkopien für unterschiedliche Engines erzeugen Konsistenz- und Wartungsprobleme |

Implementierung: Zonengrenzen werden explizit dokumentiert, mit klaren Erwartungen, welche Qualitätsgarantien jede Zone bietet (Rohzone: keine, bereinigte Zone: validiert/dedupliziert, konsumierbare Zone: geschäftsfertig aggregiert). Qualitätsgates werden als automatisierte, deklarative Prüfungen (z. B. über dbt-Datentests, siehe [KB-0223](05-dbt-und-analytische-modelle.md)) beim Übergang zwischen Zonen durchgesetzt, mit expliziter Blockierung fehlerhafter Daten statt stillschweigender Weiterleitung. Ein durchgängiges offenes Tabellenformat (Iceberg oder Delta Lake) wird über alle Zonen hinweg verwendet, um konsistente ACID-Garantien und Schema-Evolution zu ermöglichen. Engine-Auswahl wird pro Anwendungsfall getroffen (z. B. Spark für Batch-Transformationen, Flink für Streaming-Aggregationen), koordiniert über die gemeinsame Tabellenformat-Schicht, statt für jede Engine separate Datenkopien zu pflegen.

## Scalability, Reliability, Security und Observability

Lakehouse-Architektur skaliert gut für gemischte Analytiklasten (Batch-Reporting, Streaming-Dashboards, ML-Feature-Engineering), weil alle Lasten auf derselben zugrunde liegenden, konsistenten Datenschicht arbeiten können, statt separate, potenziell inkonsistente Datenkopien zu pflegen. Reliability-Grenze: fehlende oder unzureichende Qualitätsgates sind ein organisatorisches, nicht rein technisches Risiko — die Tabellenformat-Technologie selbst verhindert nicht, dass fachlich fehlerhafte Daten die bereinigte oder konsumierbare Zone erreichen, wenn keine entsprechenden Prüfungen definiert sind.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| konsumierbare (Gold-Zone) Daten enthalten fachlich fehlerhafte oder unvollständige Werte | Qualitätsgate zwischen Roh- und bereinigter Zone (oder bereinigter und konsumierbarer Zone) fehlt oder ist unzureichend | Validierungsregeln und Datentests an den Zonenübergängen auf Vollständigkeit prüfen |
| unterschiedliche Teams berichten unterschiedliche Zahlen für dieselbe Geschäftskennzahl | inkonsistente oder fehlende Zonen-Governance, mehrere unabhängige, nicht abgestimmte konsumierbare Datensätze | Herkunft der unterschiedlichen Kennzahlen bis zur zugrunde liegenden Zone und Tabellenformat-Quelle zurückverfolgen |
| eine Engine (z. B. ML-Training) verwendet eine veraltete Kopie der Daten statt der aktuellen Lakehouse-Tabelle | separate, nicht koordinierte Datenkopie statt direkter Nutzung der gemeinsamen Tabellenformat-Schicht | prüfen, ob die Engine direkt auf die aktuelle Lakehouse-Tabelle zugreift oder auf eine separate, potenziell veraltete Kopie |
| neue Teammitglieder wissen nicht, welcher Zone sie für welchen Anwendungsfall vertrauen können | Zonenmodell und Qualitätsgarantien sind nicht klar dokumentiert | Dokumentation der Zonendefinitionen und Qualitätsgarantien auf Vollständigkeit und Zugänglichkeit prüfen |

Security: Zugriffskontrolle sollte pro Zone differenziert konfiguriert werden — die Rohzone enthält oft unmaskierte, potenziell sensible Quelldaten und sollte restriktiver zugänglich sein als die konsumierbare Zone, die bereits aggregierte, möglicherweise bereits anonymisierte Daten enthält. Observability: Qualitätsgate-Durchlaufrate (wie viele Datensätze werden an jedem Übergang zurückgewiesen), Zonen-Aktualität (Latenz zwischen Rohdaten-Ankunft und konsumierbarer Verfügbarkeit) und Engine-Zugriffsmuster pro Zone sind zentrale Metriken für Lakehouse-Gesundheit.

## Trade-offs und Entscheidungen

**Staff** setzt automatisierte Qualitätsgates an jedem Zonenübergang durch, statt Daten stillschweigend weiterzuleiten. **Principal** macht Zonengarantien und Governance-Verantwortung für das Team explizit dokumentiert und zugänglich. **Chief** positioniert Lakehouse-Architektur als organisatorisches Zonenmodell mit Governance-Verantwortung, nicht nur als technische Kombination von Tabellenformat und Objektspeicher.

Anti-Patterns: Zonenmodell einführen, aber keine tatsächlichen Qualitätsgates zwischen den Zonen durchsetzen; unterschiedliche, nicht koordinierte Datenkopien für unterschiedliche Engines pflegen statt gemeinsamer Tabellenformat-Nutzung; Zonengrenzen und Qualitätsgarantien nicht dokumentieren, sodass Teams nicht wissen, welcher Zone sie vertrauen können.

## Production Checklist

- [ ] Zonengrenzen und Qualitätsgarantien jeder Zone sind explizit dokumentiert.
- [ ] Automatisierte Qualitätsgates sind an jedem Zonenübergang durchgesetzt.
- [ ] Ein durchgängiges offenes Tabellenformat wird über alle Zonen genutzt.
- [ ] Alle Engines greifen direkt auf die gemeinsame Tabellenformat-Schicht zu, ohne separate, nicht koordinierte Kopien.

## Interviewfragen

### 1. Was ist das klassische Zonenmodell einer Lakehouse-Architektur, und welche Garantie bietet jede Zone?

**Antwort:** Die Rohzone enthält unveränderte Quelldaten ohne Qualitätsgarantien, die bereinigte Zone enthält validierte und deduplizierte Daten in konsistentem Schema, und die konsumierbare Zone enthält geschäftsfertig aggregierte Daten für spezifische Analyse-Anwendungsfälle.

### 2. Warum garantiert die Nutzung von Iceberg oder Delta Lake allein keine Datenqualität?

**Antwort:** Diese Tabellenformate bringen technische ACID-Garantien und Schema-Evolution, ersetzen aber nicht die organisatorische Verantwortung, tatsächliche Qualitätsgates (Validierungsregeln, Datentests) zwischen den Zonen zu definieren und durchzusetzen.

### 3. Wie diagnostizierst du fachlich fehlerhafte Daten in der konsumierbaren (Gold-)Zone?

**Antwort:** Ich prüfe die Validierungsregeln und Datentests an den Zonenübergängen auf Vollständigkeit — fehlerhafte Daten in der konsumierbaren Zone deuten meist auf ein fehlendes oder unzureichendes Qualitätsgate zwischen Roh- und bereinigter oder zwischen bereinigter und konsumierbarer Zone hin.

### 4. Warum ist ein durchgängiges offenes Tabellenformat über alle Zonen hinweg vorteilhaft?

**Antwort:** Es ermöglicht konsistente ACID-Garantien und Schema-Evolution über den gesamten Datenlebenszyklus und erlaubt unterschiedlichen Engines (Batch, Streaming, ML), auf dieselbe konsistente Datenschicht zuzugreifen, statt separate, potenziell inkonsistente Kopien zu benötigen.

### 5. Warum berichten unterschiedliche Teams manchmal unterschiedliche Zahlen für dieselbe Geschäftskennzahl in einem Lakehouse?

**Antwort:** Das deutet meist auf inkonsistente oder fehlende Zonen-Governance hin — mehrere unabhängige, nicht abgestimmte konsumierbare Datensätze für dieselbe Kennzahl, statt einer einzigen, autoritativen, governance-geprüften Quelle.

### 6. Widersprüchliche Anforderung: Analytics-Team will maximale Flexibilität für explorative Ad-hoc-Analysen direkt auf Rohdaten UND garantierte Datenqualität für alle genutzten Daten — wie gehst du vor?

**Antwort:** Ich würde erklären, dass Rohdaten per Definition keine Qualitätsgarantien bieten; ich würde vorschlagen, explorative Ad-hoc-Analysen explizit auf der Rohzone mit klarer Kennzeichnung "ungeprüft" zuzulassen, während für Analysen, die Entscheidungen beeinflussen, die bereinigte oder konsumierbare Zone mit durchgesetzten Qualitätsgates genutzt werden muss — beide Ziele sind über unterschiedliche Zonen erreichbar, nicht über dieselbe Datenquelle gleichzeitig.

## Praktische Labs

~~~python
# Three-tier zone model with explicit quality gates
raw_zone = [
    {"id": 1, "amount": 100, "currency": "EUR"},
    {"id": 2, "amount": -50, "currency": "EUR"},  # invalid: negative amount
    {"id": 3, "amount": 200, "currency": None},   # invalid: missing currency
]

def quality_gate_raw_to_cleaned(record):
    if record["amount"] < 0:
        return False, "negative amount"
    if record["currency"] is None:
        return False, "missing currency"
    return True, "valid"

cleaned_zone = []
rejected = []

for record in raw_zone:
    passed, reason = quality_gate_raw_to_cleaned(record)
    if passed:
        cleaned_zone.append(record)
    else:
        rejected.append((record, reason))

print(f"Raw zone: {len(raw_zone)} records")
print(f"Cleaned zone (passed quality gate): {len(cleaned_zone)} records")
print(f"Rejected at gate: {rejected}")
assert len(cleaned_zone) == 1
assert len(rejected) == 2
print("Bad data is blocked at the gate - it never silently reaches the cleaned or consumable zone.")
~~~

## Dependencies, Cross-References und Quellen

1. Databricks: [What Is a Lakehouse?](https://www.databricks.com/glossary/data-lakehouse), abgerufen 2026-09-17.
2. Armbrust et al.: [Lakehouse: A New Generation of Open Platforms](https://www.cidrdb.org/cidr2021/papers/cidr2021_paper17.pdf), CIDR 2021, abgerufen 2026-09-17.
3. Databricks: [Medallion Architecture (Bronze/Silver/Gold)](https://www.databricks.com/glossary/medallion-architecture), abgerufen 2026-09-17.

Tabellenformat-Grundlagen sind kanonisch in [KB-0228](10-apache-iceberg.md) und [KB-0229](11-delta-lake.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Vereinheitlichte Katalogschichten mit automatischer Governance-Metadaten-Erfassung über alle Zonen | Adopting | Für Lakehouse-Umgebungen mit mehreren Teams zur Reduktion manueller Dokumentationspflege einsetzen. |
| Datenqualitäts-Observability-Plattformen mit automatischer Anomalieerkennung an Zonenübergängen | Adopting | Ergänzend zu deklarativen Qualitätsgates für die Erkennung unbekannter, nicht vordefinierter Datenqualitätsprobleme evaluieren. |

Ein Team akzeptiert eine Lakehouse-Architektur erst, wenn Zonengrenzen dokumentiert und Qualitätsgates an jedem Zonenübergang nachweisbar durchgesetzt sind.
