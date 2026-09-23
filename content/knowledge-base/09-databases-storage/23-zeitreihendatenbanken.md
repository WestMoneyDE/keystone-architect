---
{"id": "KB-0217", "title": "Zeitreihendatenbanken und zeitbasierte Suche", "domain": "09", "sequence": 23, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "CLOUD"], "requires": [{"id": "KB-0196", "concepts": ["Index"], "needed_for": "understanding"}, {"id": "KB-0206", "concepts": ["NoSQL-Kategorien"], "needed_for": "understanding"}], "related": ["KB-0216"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Downsampling-Modell für Zeitreihendaten mit unterschiedlicher Auflösung je Altersstufe lokal implementieren.", "rationale": "Der Kompromiss zwischen Speicherplatz und Datenauflösung über Zeit wird erst durch konkrete Implementierung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Serienkardinalität und Retention-Strategie für einen konkreten Zeitreihen-Anwendungsfall begründet dimensionieren.", "rationale": "Unkontrollierte Kardinalität ist die häufigste Ursache für Zeitreihendatenbank-Performanceprobleme."}, "STAFF-TARGET": {"active": true, "scope": "Unerwartete Ingestion-Performanceprobleme auf Kardinalitäts-Explosion statt auf allgemeine Schreiblast zurückführen können.", "rationale": "Hohe Serienkardinalität (viele einzigartige Tag-Kombinationen) erzeugt spezifische, oft unterschätzte Indexierungskosten."}, "CHIEF-TARGET": {"active": true, "scope": "Zeitreihendatenbanken gegenüber relationaler Zeitpartitionierung und Suchindizes für spezifische Anwendungsfälle begründet abgrenzen.", "rationale": "Nicht jeder zeitbasierte Datenbedarf rechtfertigt eine dedizierte Zeitreihendatenbank."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Produktspezifische Kompressionsalgorithmen (z. B. Gorilla-Encoding) sind Vertiefung.", "rationale": "Kern ist das Verständnis von Kardinalität, Retention und Downsampling, nicht die Kompressionsimplementierung."}}, "lab_validation": [{"lab_id": "KB-0217-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für zeitbasiertes Downsampling mit abnehmender Auflösung nach Alter", "evidence": "Aktuelle Daten werden mit voller Auflösung gespeichert, ältere Daten werden zu gröberen Zeitfenstern aggregiert, was Speicherplatz spart, aber Detailgenauigkeit für historische Analysen reduziert.", "limitations": "Kein echtes Zeitreihendatenbanksystem, keine reale verspätete Dateneinlieferung, keine Produktion."}]}
---
# Zeitreihendatenbanken und zeitbasierte Suche

> **Ziel:** Zeitreihendatenbanken optimieren für zeitgeordnete Ingestion, Kompression und zeitfensterbasierte Abfragen — aber unkontrollierte Serienkardinalität (zu viele einzigartige Tag-Kombinationen) ist die häufigste Ursache für Performanceprobleme. Retention und Downsampling sind bewusste Entscheidungen über den Kompromiss zwischen Speicherplatz und historischer Detailgenauigkeit, keine automatischen Optimierungen.

## Zweck, Mental Model und Dependencies

Zeitreihendatenbanken (z. B. InfluxDB, TimescaleDB, Prometheus) modellieren Daten als Zeitstempel plus Messwert plus Tags (Schlüssel-Wert-Paare zur Dimensionalität, z. B. `host=server1, region=eu-west`) — eine "Serie" ist eine eindeutige Kombination aus Metrikname und Tag-Werten. Serienkardinalität beschreibt die Anzahl einzigartiger Serien: hohe Kardinalität (z. B. durch Tags mit vielen einzigartigen Werten wie User-IDs oder Request-IDs) erzeugt exponentiell wachsende Indexierungskosten, da jede einzigartige Serie eigene Indexstrukturen benötigt — das ist der häufigste Grund, warum Zeitreihendatenbanken in Produktion unerwartet langsam werden. Kompression nutzt die zeitliche Ordnung und oft geringe Änderungsrate aufeinanderfolgender Werte aus (Delta-Encoding, spezialisierte Algorithmen), was Zeitreihendatenbanken deutlich kompakter macht als generische relationale Speicherung derselben Daten. Verspätete Daten (Late-Arriving Data, z. B. durch Netzwerkverzögerung bei der Ingestion) müssen explizit gehandhabt werden, da naive Zeitfenster-Aggregation verspätete Daten sonst dem falschen oder gar keinem Zeitfenster zuordnet. Lies [KB-0196](02-indizes-und-zugriffskosten.md) und [KB-0206](12-nosql-kategorien-und-datenmodelle.md).

~~~text
Series = metric name + unique combination of tag values
Low cardinality:   host=server1, host=server2 (few unique hosts) -> manageable index size
High cardinality:  user_id=<millions of unique values> as a tag -> index size explodes, ingestion slows dramatically
Downsampling: full resolution for recent data -> coarser aggregates for older data -> storage/detail trade-off, not free
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Serienkardinalität | sind Tags bewusst auf begrenzte, niedrig-kardinale Wertemengen beschränkt? | hochkardinale Tags (User-ID, Request-ID) erzeugen Indexierungs-Explosion |
| Retention-Policy | ist explizit definiert, wie lange Daten in welcher Auflösung aufbewahrt werden? | unbegrenzte Retention ohne Downsampling erzeugt unkontrolliertes Speicherwachstum |
| Downsampling-Strategie | werden ältere Daten bewusst zu gröberen Zeitfenstern aggregiert? | volle Auflösung für alte, selten abgefragte Daten verschwendet Speicherplatz ohne Nutzen |
| Verspätete-Daten-Handhabung | akzeptiert die Ingestion-Pipeline explizit verspätet eintreffende Zeitstempel? | verspätete Daten werden verworfen oder falsch zugeordnet, wenn nicht explizit behandelt |

Implementierung: Tags werden bewusst auf Dimensionen mit begrenzter, vorhersehbarer Kardinalität beschränkt (z. B. Region, Umgebung, Servertyp), während hochkardinale Bezeichner (User-ID, Request-ID, exakte Zeitstempel als Tag-Wert) als Feldwerte statt Tags modelliert werden, da Felder nicht indiziert werden und keine Kardinalitätsexplosion erzeugen. Retention- und Downsampling-Policies werden explizit pro Anwendungsfall definiert — typischerweise volle Auflösung für aktuelle, operative Daten (Stunden bis Tage) und zunehmend gröbere Aggregation für historische Trendanalyse (Wochen bis Jahre). Die Ingestion-Pipeline wird mit einem expliziten Toleranzfenster für verspätete Daten konfiguriert, das dem erwarteten maximalen Verzögerungsgrad in der Datenquelle entspricht.

## Scalability, Reliability, Security und Observability

Zeitreihendatenbanken skalieren gut für zeitgeordnete Ingestion mit begrenzter Kardinalität, verschlechtern sich aber nichtlinear mit wachsender Kardinalität — ein moderater Anstieg der einzigartigen Serien kann zu einem überproportionalen Anstieg von Speicher- und Rechenbedarf führen. Reliability-Grenze: eine unkontrollierte Kardinalitätsexplosion (z. B. durch versehentliches Tagging mit einem hochkardinalen Feld) kann ein zuvor performantes System abrupt destabilisieren, oft ausgelöst durch eine unscheinbare Code-Änderung.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Ingestion-Performance verschlechtert sich abrupt nach einer Code-Änderung | eine neue oder geänderte Tag-Dimension hat hohe Kardinalität eingeführt | Anzahl einzigartiger Serien vor und nach der Änderung vergleichen |
| Speicherverbrauch wächst schneller als das erwartete Datenvolumen | Retention-Policy fehlt oder Downsampling ist nicht konfiguriert | Retention- und Downsampling-Konfiguration gegen tatsächliches Speicherwachstum prüfen |
| Abfragen über historische Daten liefern unvollständige oder falsch aggregierte Ergebnisse | verspätete Daten wurden außerhalb des konfigurierten Toleranzfensters eingeliefert | Ingestion-Zeitstempel der betroffenen Daten gegen das konfigurierte Verspätungstoleranzfenster prüfen |
| bestimmte Abfragen sind unerwartet langsam trotz insgesamt moderater Datenmenge | die Abfrage selektiert über eine hochkardinale Dimension, die viele einzelne Serien durchsucht | Anzahl der von der Abfrage tatsächlich durchsuchten Serien prüfen |

Security: Zeitreihendaten enthalten oft Betriebs- oder Nutzungsmetriken, die indirekt sensible Informationen preisgeben können (z. B. Nutzungsmuster einzelner Kunden bei zu granularer Tag-Struktur) — Tag-Design sollte auch unter diesem Gesichtspunkt geprüft werden. Observability: Serienzahl (Kardinalität) über Zeit, Ingestion-Rate und Speicherverbrauch nach Retention-Stufe sind zentrale Metriken für Zeitreihendatenbank-Betriebsgesundheit, idealerweise selbst als Zeitreihenmetriken überwacht.

## Trade-offs und Entscheidungen

**Staff** beschränkt Tags bewusst auf niedrig-kardinale Dimensionen, hochkardinale Bezeichner werden als Felder modelliert. **Principal** macht Retention- und Downsampling-Entscheidungen für das Team im Speicherbudget explizit nachvollziehbar. **Chief** positioniert Zeitreihendatenbanken für spezifische, zeitgeordnete Hochfrequenz-Anwendungsfälle, nicht als generische Alternative zu relationaler Zeitpartitionierung.

Anti-Patterns: hochkardinale Bezeichner (User-ID, Request-ID) unreflektiert als Tags statt Felder modellieren; Retention und Downsampling erst nach einem Speicherplatzproblem konfigurieren; Zeitreihendatenbank für Anwendungsfälle wählen, die keine echte hochfrequente zeitgeordnete Ingestion benötigen.

## Production Checklist

- [ ] Tags sind bewusst auf begrenzte, niedrig-kardinale Wertemengen beschränkt.
- [ ] Retention- und Downsampling-Policy ist explizit pro Datenklasse definiert.
- [ ] Ingestion-Pipeline hat ein konfiguriertes Toleranzfenster für verspätete Daten.
- [ ] Serienkardinalität wird kontinuierlich überwacht, nicht nur bei Auffälligkeiten geprüft.

## Interviewfragen

### 1. Was ist Serienkardinalität, und warum ist sie die häufigste Ursache für Zeitreihendatenbank-Performanceprobleme?

**Antwort:** Serienkardinalität ist die Anzahl einzigartiger Kombinationen aus Metrikname und Tag-Werten; hochkardinale Tags (z. B. User-IDs) erzeugen exponentiell wachsende Indexierungskosten, da jede einzigartige Serie eigene Indexstrukturen benötigt.

### 2. Warum werden hochkardinale Bezeichner als Felder statt als Tags modelliert?

**Antwort:** Tags werden indiziert und bestimmen die Serienkardinalität; Felder werden nicht indiziert und erzeugen daher keine Kardinalitätsexplosion, auch wenn sie viele einzigartige Werte enthalten.

### 3. Was ist der Kompromiss bei Downsampling historischer Zeitreihendaten?

**Antwort:** Ältere Daten werden zu gröberen Zeitfenstern aggregiert, was Speicherplatz spart, aber Detailgenauigkeit für historische Analysen reduziert — feine, kurzfristige Anomalien in weit zurückliegenden Daten werden dadurch nicht mehr sichtbar.

### 4. Wie diagnostizierst du eine abrupte Verschlechterung der Ingestion-Performance?

**Antwort:** Ich prüfe zuerst, ob eine neue oder geänderte Tag-Dimension eine hohe Kardinalität eingeführt hat, indem ich die Anzahl einzigartiger Serien vor und nach der vermuteten Änderung vergleiche — das ist die häufigste Ursache für abrupte Performanceverschlechterung in Zeitreihendatenbanken.

### 5. Warum muss verspätete Dateneinlieferung explizit gehandhabt werden?

**Antwort:** Naive Zeitfenster-Aggregation ordnet Daten dem Zeitfenster basierend auf Ankunftszeit zu; ohne explizites Toleranzfenster für verspätete Daten werden solche Daten dem falschen Zeitfenster zugeordnet oder verworfen, was zu unvollständigen oder verfälschten historischen Aggregaten führt.

### 6. Widersprüchliche Anforderung: Team will detaillierte Tag-Dimensionen für granulare Analysen (z. B. pro Nutzer) UND niedrige, vorhersehbare Infrastrukturkosten — wie gehst du vor?

**Antwort:** Ich würde erklären, dass granulare Tags pro Nutzer eine hohe Kardinalität erzeugen, die Kosten unvorhersehbar in die Höhe treiben kann; ich würde vorschlagen, nutzerbezogene Granularität über Felder statt Tags zu modellieren oder eine separate, aggregierte Analyseebene für nutzerbezogene Auswertungen zu nutzen, statt die operative Zeitreihendatenbank mit unkontrollierter Kardinalität zu belasten.

## Praktische Labs

~~~python
from datetime import datetime, timedelta

# Downsampling model: full resolution recent, coarser aggregation for older data
raw_points = [(datetime(2026, 1, 1) + timedelta(minutes=i), 20 + (i % 5)) for i in range(120)]  # 2 hours of minute data

def downsample(points, window_minutes, cutoff_age_minutes, now):
    result = []
    for ts, value in points:
        age_minutes = (now - ts).total_seconds() / 60
        if age_minutes <= cutoff_age_minutes:
            result.append((ts, value))  # keep full resolution
    # aggregate the rest into coarser windows
    older = [(ts, v) for ts, v in points if (now - ts).total_seconds() / 60 > cutoff_age_minutes]
    buckets = {}
    for ts, v in older:
        bucket_key = ts.replace(minute=(ts.minute // window_minutes) * window_minutes, second=0)
        buckets.setdefault(bucket_key, []).append(v)
    aggregated = [(k, sum(v) / len(v)) for k, v in buckets.items()]
    return result, aggregated

now = datetime(2026, 1, 1, 2, 0)
full_res, downsampled = downsample(raw_points, window_minutes=15, cutoff_age_minutes=30, now=now)
print(f"Full resolution points (recent): {len(full_res)}, downsampled buckets (older): {len(downsampled)}")
assert len(full_res) < len(raw_points)
assert len(downsampled) < (len(raw_points) - len(full_res))
print("Older data compressed into fewer, coarser buckets - storage saved, historical detail reduced.")
~~~

## Dependencies, Cross-References und Quellen

1. InfluxData: [Time Series Data and Cardinality](https://docs.influxdata.com/influxdb/v2/write-data/best-practices/resolve-high-cardinality/), abgerufen 2026-09-17.
2. Prometheus: [Data Model and Cardinality Considerations](https://prometheus.io/docs/practices/naming/), abgerufen 2026-09-17.
3. TimescaleDB: [Continuous Aggregates and Downsampling](https://docs.timescale.com/use-timescale/latest/continuous-aggregates/), abgerufen 2026-09-17.

Produktspezifische Details (InfluxDB, TimescaleDB, Prometheus) vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Spaltenorientierte Zeitreihenspeicherung mit spezialisierter Kompression (z. B. Gorilla-Encoding) | Established | Kompressionsgewinn gegenüber generischer Speicherung standardmäßig für Zeitreihendaten nutzen. |
| Automatisierte Kardinalitäts-Limits mit Ingestion-Ablehnung bei Überschreitung | Adopting | Für Systeme mit hohem Risiko versehentlicher Kardinalitätsexplosion gezielt aktivieren. |

Ein Team akzeptiert ein Zeitreihendatenbank-Design erst, wenn Kardinalitätsrisiken geprüft und Retention-/Downsampling-Strategie explizit dokumentiert sind.
