---
{"id": "KB-0203", "title": "Elasticsearch und OpenSearch", "domain": "09", "sequence": 9, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "CLOUD"], "requires": [{"id": "KB-0196", "concepts": ["Index"], "needed_for": "understanding"}, {"id": "KB-0179", "concepts": ["Partition"], "needed_for": "understanding"}], "related": ["KB-0204", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen invertierten Index lokal aufbauen und Refresh-Verzögerung bei Nahe-Echtzeit-Suche demonstrieren.", "rationale": "Kein echter Elasticsearch-Cluster nötig, um das Kernprinzip zu zeigen."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Shard-Anzahl, Mapping-Design und Refresh-Intervall für einen konkreten Such-Anwendungsfall begründet dimensionieren.", "rationale": "Diese Grundentscheidungen bestimmen direkt Suchperformance und operative Flexibilität."}, "STAFF-TARGET": {"active": true, "scope": "Ein 'fehlendes' gerade indiziertes Dokument in einer Suchanfrage auf Refresh-Verzögerung (Nahe-Echtzeit statt Echtzeit) zurückführen.", "rationale": "Elasticsearch ist near-real-time, nicht real-time, was ein häufiges Missverständnis ist."}, "CHIEF-TARGET": {"active": true, "scope": "Elasticsearch/OpenSearch als kanonische Suchlösung gegenüber Datenbank-eingebauter Volltextsuche positionieren, wenn Anforderungen es rechtfertigen.", "rationale": "Ein dedizierter Suchcluster bringt Betriebskomplexität, die gegen den Suchfunktionsbedarf abgewogen werden muss."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Detaillierte Relevanz-Scoring-Algorithmen (BM25) und Aggregationspipelines sind Vertiefung.", "rationale": "Kern ist invertierter Index, Sharding und Near-Real-Time-Verhalten."}}, "lab_validation": [{"lab_id": "KB-0203-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für invertierten Index mit Refresh-Verzögerung", "evidence": "Ein neu indiziertes Dokument ist erst nach einem simulierten Refresh-Zyklus in Suchergebnissen sichtbar, nicht unmittelbar nach der Indizierung selbst.", "limitations": "Kein echter Elasticsearch-Cluster, keine Produktion."}]}
---
# Elasticsearch und OpenSearch

> **Ziel:** Elasticsearch/OpenSearch nutzen einen invertierten Index (Wort → Liste der Dokumente, die es enthalten) für effiziente Volltextsuche, verteilt über Shards ähnlich Kafka-Partitionen ([KB-0179](03-kafka-und-partitionierte-ereignislogs.md)). Der zentrale, oft missverstandene Betriebsaspekt: neu indizierte Dokumente sind nicht sofort durchsuchbar — ein Refresh-Zyklus macht sie erst nach einer kurzen Verzögerung sichtbar (Near-Real-Time, nicht Real-Time).

## Zweck, Mental Model und Dependencies

Ein invertierter Index kehrt die natürliche Dokumentstruktur um: statt „Dokument → enthaltene Wörter" wird „Wort → Liste der Dokumente, die es enthalten" gespeichert, was Volltextsuche extrem effizient macht (statt jedes Dokument einzeln zu durchsuchen, wird direkt die Liste relevanter Dokumente für einen Suchbegriff nachgeschlagen). Ein Index wird in mehrere Shards aufgeteilt (analog zu Kafka-Partitionen, [KB-0179](03-kafka-und-partitionierte-ereignislogs.md)), die über einen Cluster verteilt sind. Neu indizierte Dokumente landen zunächst in einem In-Memory-Puffer und werden erst bei einem periodischen Refresh (Standard: alle 1 Sekunde) in ein durchsuchbares Segment geschrieben — Elasticsearch ist damit „Near-Real-Time", nicht „Real-Time". Lies [KB-0196](02-indizes-und-zugriffskosten.md) und [KB-0179](03-kafka-und-partitionierte-ereignislogs.md).

~~~text
Index "products" split into shards: shard0, shard1, shard2 (distributed across cluster nodes)
Document indexed -> written to in-memory buffer -> NOT yet searchable
Refresh cycle (default ~1s) -> buffer flushed to a searchable segment -> NOW document appears in search results
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Invertierter Index | Mapping (Feldtypen, Analyzer) passend zum Suchbedarf definiert? | falsches Mapping erzeugt unerwartetes Suchverhalten (z. B. keine Teilstring-Suche) |
| Shard-Anzahl | ausreichend für gewünschte Parallelität, aber nicht übermäßig fragmentiert? | zu viele kleine Shards erzeugen unnötigen Overhead |
| Refresh-Intervall | passend zu Aktualitätsanforderung versus Indexierungs-Performance? | zu häufiger Refresh kostet Performance, zu seltener verzögert Sichtbarkeit |
| Cluster-Health | grün/gelb/rot-Status aktiv überwacht? | unbemerkter Shard-Ausfall reduziert Redundanz stillschweigend |

Implementierung: das Mapping (Feldtypen, Analyzer für Tokenisierung) wird explizit vor der ersten Indizierung definiert, da nachträgliche Änderungen oft eine Neu-Indizierung erfordern. Die Shard-Anzahl wird anhand erwarteter Datenmenge und Such-Parallelität dimensioniert — sie ist bei vielen Elasticsearch-Versionen nach Erstellung nicht mehr änderbar, was eine sorgfältige initiale Planung erfordert. Das Refresh-Intervall wird bewusst gegen die tatsächliche Aktualitätsanforderung abgewogen — für Anwendungsfälle, die sofortige Sichtbarkeit nach Indizierung benötigen, kann ein expliziter Refresh nach kritischen Schreibvorgängen ausgelöst werden, statt das globale Intervall zu verkürzen.

## Scalability, Reliability, Security und Observability

Elasticsearch/OpenSearch skaliert Suchdurchsatz und -kapazität über Shards und Cluster-Knoten, ähnlich horizontal wie Kafka. Reliability-Grenze: die Near-Real-Time-Natur ist eine strukturelle Eigenschaft, kein Konfigurationsfehler — ein Team, das sofortige Sichtbarkeit nach Indizierung erwartet, wird regelmäßig auf scheinbar „fehlende" Dokumente stoßen, die tatsächlich nur noch nicht durch den nächsten Refresh-Zyklus gelaufen sind.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| gerade indiziertes Dokument erscheint nicht sofort in Suchergebnissen | Refresh-Zyklus noch nicht abgelaufen, erwartetes Near-Real-Time-Verhalten | Zeitabstand zwischen Indizierung und erfolgreicher Suche gegen Refresh-Intervall vergleichen |
| Suchergebnisse unerwartet, Teilstring-/Fuzzy-Suche funktioniert nicht wie erwartet | Mapping/Analyzer passt nicht zum tatsächlichen Suchbedarf | Feld-Mapping und verwendeten Analyzer gegen Suchanforderung prüfen |
| Cluster-Performance degradiert bei wachsendem Datenvolumen | zu viele kleine Shards oder falsche initiale Shard-Dimensionierung | tatsächliche Shard-Größe und -Anzahl gegen empfohlene Richtwerte prüfen |
| Cluster-Status wechselt unbemerkt zu gelb/rot | fehlende aktive Cluster-Health-Überwachung | Alarmierung auf Cluster-Health-Status-Änderungen prüfen |

Security: Feldebenen- und dokumentebenen-Zugriffskontrolle sollte konfiguriert werden, wenn der Suchindex sensible Daten enthält, da eine Volltextsuche sonst potenziell Zugriff auf Daten ermöglicht, die über andere Kanäle geschützt wären. Observability: Cluster-Health, Indizierungs-Latenz und Such-Latenz sind zentrale Metriken für Elasticsearch/OpenSearch-Betrieb.

## Trade-offs und Entscheidungen

**Staff** erklärt „fehlende" Suchergebnisse zuerst über Refresh-Timing, bevor ein Indizierungsfehler vermutet wird. **Principal** dimensioniert Shard-Anzahl sorgfältig vor der initialen Index-Erstellung, mit Bewusstsein für die eingeschränkte nachträgliche Änderbarkeit. **Chief** entscheidet, ob ein dedizierter Suchcluster gegenüber Datenbank-eingebauter Volltextsuche gerechtfertigt ist, basierend auf tatsächlichem Suchfunktionsbedarf.

Anti-Patterns: sofortige Sichtbarkeit nach Indizierung als garantiert annehmen, ohne Refresh-Verhalten zu berücksichtigen; Shard-Anzahl ohne Bezug zur erwarteten Datenmenge und ohne Möglichkeit nachträglicher Anpassung wählen; Mapping erst nach Produktivsetzung definieren, was teure Neu-Indizierung erzwingt.

## Production Checklist

- [ ] Mapping (Feldtypen, Analyzer) ist vor initialer Indizierung sorgfältig definiert.
- [ ] Shard-Anzahl ist anhand erwarteter Datenmenge dimensioniert, vor Index-Erstellung.
- [ ] Refresh-Intervall ist bewusst gegen Aktualitätsanforderung abgewogen.
- [ ] Cluster-Health wird aktiv überwacht mit Alarmierung bei Statusänderung.

## Interviewfragen

### 1. Was ist ein invertierter Index und warum ist er effizient für Volltextsuche?

**Antwort:** Er kehrt die Struktur um zu „Wort → Liste der Dokumente", was direktes Nachschlagen relevanter Dokumente für einen Suchbegriff ermöglicht, statt jedes Dokument einzeln durchsuchen zu müssen.

### 2. Was bedeutet „Near-Real-Time" bei Elasticsearch konkret?

**Antwort:** Neu indizierte Dokumente sind nicht sofort durchsuchbar, sondern erst nach dem nächsten Refresh-Zyklus (standardmäßig etwa jede Sekunde), der den In-Memory-Puffer in ein durchsuchbares Segment überführt.

### 3. Warum ist die initiale Shard-Dimensionierung so wichtig?

**Antwort:** Bei vielen Elasticsearch-Versionen ist die Shard-Anzahl nach Index-Erstellung nicht mehr änderbar, ohne den gesamten Index neu aufzubauen — eine falsche initiale Dimensionierung ist entsprechend teuer zu korrigieren.

### 4. Wie erzwingst du sofortige Sichtbarkeit für eine kritische Operation?

**Antwort:** Über einen expliziten Refresh-Aufruf nach dem kritischen Schreibvorgang, statt das globale Refresh-Intervall für den gesamten Index unnötig zu verkürzen.

### 5. Warum ist Cluster-Health-Monitoring wichtig?

**Antwort:** Ein Wechsel von grün zu gelb oder rot zeigt reduzierte Redundanz oder tatsächlichen Datenverlust an; ohne aktive Überwachung bleibt das unbemerkt, bis es zu einem echten Ausfallproblem eskaliert.

### 6. Widersprüchliche Anforderung: Team will sofortige Sichtbarkeit jeder Änderung UND maximalen Indizierungsdurchsatz — wie gehst du vor?

**Antwort:** Ich würde erklären, dass ein sehr kurzes globales Refresh-Intervall den Indizierungsdurchsatz beeinträchtigt; ich würde stattdessen ein normales, durchsatzfreundliches Refresh-Intervall beibehalten und nur für die wenigen tatsächlich zeitkritischen Operationen einen expliziten Refresh gezielt auslösen.

## Praktische Labs

~~~python
buffer = []
searchable_segments = []

def index_document(doc):
    buffer.append(doc)  # not yet searchable

def refresh():
    global buffer
    searchable_segments.extend(buffer)
    buffer = []

def search(term):
    return [d for d in searchable_segments if term in d]

index_document("elasticsearch tutorial")
assert search("elasticsearch") == []  # not yet visible, refresh hasn't run
refresh()
assert search("elasticsearch") == ["elasticsearch tutorial"]
print("Document became searchable only after the refresh cycle, demonstrating near-real-time behavior.")
~~~

## Dependencies, Cross-References und Quellen

1. Elastic: [Elasticsearch Guide - Near real-time search](https://www.elastic.co/guide/en/elasticsearch/reference/current/near-real-time.html), abgerufen 2026-09-17.
2. OpenSearch: [OpenSearch Documentation](https://opensearch.org/docs/latest/), abgerufen 2026-09-17.

Elasticsearch-/OpenSearch-Versionsdetails (Lizenzänderungen, Feature-Unterschiede zwischen den Forks) vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Vektorsuche/Hybrid-Suche (Kombination Volltextsuche mit Embedding-basierter Ähnlichkeitssuche) | Established, aktiv weiterentwickelt | Relevanz-Qualität gegen zusätzlichen Betriebs-/Kostenaufwand für den konkreten Anwendungsfall bewerten. |

Ein Team akzeptiert eine Elasticsearch-/OpenSearch-Implementierung erst, wenn Mapping, Shard-Dimensionierung und Refresh-Verhalten gegen den tatsächlichen Suchbedarf nachweisbar getestet sind.
