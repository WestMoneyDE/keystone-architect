---
{"id": "KB-0221", "title": "Flink und zustandsbehaftete Streams", "domain": "10", "sequence": 3, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "GENAI", "MLOPS"], "requires": [{"id": "KB-0220", "concepts": ["Streaming Data Products"], "needed_for": "understanding"}, {"id": "KB-0179", "concepts": ["Kafka"], "needed_for": "understanding"}], "related": ["KB-0217"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Watermark-basiertes Modell zur Behandlung verspäteter Ereignisse in einer zustandsbehafteten Stream-Verarbeitung lokal implementieren.", "rationale": "Der Unterschied zwischen Event Time und Processing Time wird erst durch konkrete Watermark-Implementierung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Checkpoint-Intervall und Late-Event-Toleranz für einen konkreten Stream-Processing-Anwendungsfall begründet dimensionieren.", "rationale": "Falsche Checkpoint-Frequenz oder Watermark-Toleranz erzeugt entweder unnötigen Overhead oder Datenverlust bei Recovery."}, "STAFF-TARGET": {"active": true, "scope": "Fehlende oder falsche Aggregationsergebnisse auf verspätete Ereignisse außerhalb der Watermark-Toleranz statt auf einen Verarbeitungsfehler zurückführen können.", "rationale": "Ereignisse, die nach Ablauf des Watermark-Toleranzfensters eintreffen, werden je nach Konfiguration verworfen oder gesondert behandelt, was ohne dieses Wissen als Datenverlustbug fehlgedeutet wird."}, "CHIEF-TARGET": {"active": true, "scope": "Zustandsbehaftetes Stream-Processing als eigenständige Verarbeitungsklasse mit expliziten Zeit- und Recovery-Garantien positionieren, nicht als einfache Erweiterung von Batch-Verarbeitung.", "rationale": "Event Time, Watermarks und Checkpoint-basierte Wiederherstellung sind fundamentale, nicht triviale Konzepte, die Batch-Verarbeitung nicht kennt."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Flink-spezifische State-Backend-Implementierungsdetails (RocksDB State Backend) sind Vertiefung.", "rationale": "Kern ist das Verständnis von Event Time, Watermarks, State und Checkpoints, nicht die Werkzeugimplementierung."}}, "lab_validation": [{"lab_id": "KB-0221-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Watermark-basierte Behandlung verspäteter Ereignisse in Stream-Aggregation", "evidence": "Ein Watermark markiert den Punkt, ab dem keine früheren Ereignisse mehr erwartet werden; Ereignisse, die nach diesem Punkt mit einem älteren Zeitstempel eintreffen, werden als verspätet erkannt und gesondert behandelt.", "limitations": "Kein echtes Flink-Cluster, kein echtes Checkpointing, keine Produktion."}]}
---
# Flink und zustandsbehaftete Streams

> **Ziel:** Zustandsbehaftetes Stream-Processing (z. B. Apache Flink) unterscheidet zwischen Event Time (wann ein Ereignis tatsächlich geschah) und Processing Time (wann es verarbeitet wird) — Watermarks schätzen, wann keine früheren Ereignisse mehr zu erwarten sind, und Checkpoints ermöglichen konsistente Wiederherstellung des internen Zustands nach einem Ausfall. Diese Konzepte sind fundamental anders als klassische Batch-Verarbeitung, nicht nur eine kontinuierliche Variante davon.

## Zweck, Mental Model und Dependencies

Event Time ist der Zeitpunkt, zu dem ein Ereignis tatsächlich in der realen Welt stattfand (z. B. im Zeitstempel des Ereignisses selbst kodiert); Processing Time ist der Zeitpunkt, zu dem das Stream-Processing-System das Ereignis tatsächlich verarbeitet — durch Netzwerkverzögerung, Pufferung oder Systemausfälle können diese deutlich auseinanderfallen. Watermarks sind eine Heuristik, die schätzt, wann für ein bestimmtes Zeitfenster keine weiteren, früher datierten Ereignisse mehr zu erwarten sind — das ermöglicht dem System, ein Zeitfenster als "abgeschlossen" zu behandeln und ein Aggregationsergebnis zu emittieren, auch wenn theoretisch noch verspätete Ereignisse eintreffen könnten. Zustandsbehaftete Verarbeitung (State) bedeutet, dass die Verarbeitung nicht zustandslos jedes Ereignis isoliert behandelt, sondern akkumulierten Zustand über Zeit pflegt (z. B. laufende Summen, Fensteraggregationen) — dieser Zustand muss bei einem Systemausfall wiederherstellbar sein, wofür Checkpoints (periodische, konsistente Schnappschüsse des internen Zustands) genutzt werden. Lies [KB-0220](02-kafka-fuer-streaming-data-products.md) und [KB-0179](../08-messaging-workflows/03-kafka-und-partitionierte-ereignislogs.md).

~~~text
Event time:      when the event actually happened (embedded in the event data)
Processing time:  when the system actually processes it (can lag far behind event time)
Watermark:        heuristic estimate of "no earlier event-time events expected past this point" -> window can close
Late event (after watermark passed its window): dropped or side-output, depending on configuration - NOT a bug
Checkpoint:        periodic consistent snapshot of internal state -> enables recovery without losing accumulated aggregation
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Event-Time-Semantik | verwendet die Verarbeitung Event Time statt Processing Time für zeitbasierte Aggregation? | Processing-Time-basierte Aggregation liefert falsche Ergebnisse bei Netzwerkverzögerung oder Systempausen |
| Watermark-Toleranz | ist die Watermark-Verzögerung bewusst gegen die erwartete maximale Ereignisverspätung dimensioniert? | zu enge Watermark-Toleranz verwirft legitime, nur leicht verspätete Ereignisse |
| Checkpoint-Frequenz | ist die Checkpoint-Frequenz gegen den Kompromiss zwischen Overhead und Recovery-Datenverlust dimensioniert? | zu seltene Checkpoints erzeugen größeren Datenverlust bei Recovery; zu häufige erzeugen unnötigen Overhead |
| Zustandsgröße | ist die Größe des akkumulierten Zustands im Kapazitätsplan berücksichtigt? | unbegrenzt wachsender Zustand (z. B. ohne Zeitfenster-Begrenzung) erschöpft Speicherressourcen |

Implementierung: zeitbasierte Aggregationen werden grundsätzlich auf Event Time statt Processing Time definiert, mit Zeitstempeln, die aus den Ereignisdaten selbst extrahiert werden, nicht aus der Ankunftszeit im System. Watermark-Toleranz wird anhand der gemessenen oder erwarteten maximalen Verzögerung in der Datenquelle dimensioniert, mit explizitem Bewusstsein für den Kompromiss zwischen Ergebnis-Aktualität (kürzere Toleranz, schnellere Fensterschließung) und Vollständigkeit (längere Toleranz, weniger verworfene verspätete Ereignisse). Checkpoint-Frequenz wird gegen den akzeptablen Datenverlust bei Recovery (wie viel Verarbeitung müsste nach einem Ausfall wiederholt werden) und den Checkpoint-Overhead abgewogen. Zustandsgröße wird durch explizite Zeitfenster-Begrenzung (z. B. Tumbling oder Sliding Windows mit definierter Größe) kontrolliert, statt unbegrenzt akkumulierenden Zustand zu erlauben.

## Scalability, Reliability, Security und Observability

Zustandsbehaftetes Stream-Processing skaliert horizontal durch Partitionierung des Zustands über mehrere parallele Verarbeitungsinstanzen, wobei jede Instanz nur für ihre zugewiesene Zustandspartition verantwortlich ist. Reliability-Grenze: ohne funktionierende Checkpoints ist ein Systemausfall katastrophal für zustandsbehaftete Verarbeitung, da der gesamte akkumulierte Zustand (z. B. laufende Aggregationen über Stunden) verloren geht, nicht nur einzelne unverarbeitete Ereignisse.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Aggregationsergebnisse für ein Zeitfenster fehlen oder sind unvollständig | Ereignisse trafen nach Ablauf der Watermark-Toleranz für dieses Fenster ein und wurden verworfen | Ereignis-Zeitstempel der fehlenden Daten gegen die konfigurierte Watermark-Toleranz und Fensterschließzeit vergleichen |
| nach einem Systemausfall geht viel bereits verarbeiteter Zustand verloren | Checkpoint-Intervall war zu lang relativ zur Ausfallhäufigkeit | Checkpoint-Frequenz gegen den beobachteten Datenverlust bei Recovery-Ereignissen prüfen |
| Speicherverbrauch des Stream-Processing-Systems wächst kontinuierlich ohne Obergrenze | Zeitfenster-Aggregation ist nicht begrenzt, Zustand akkumuliert unbegrenzt | Fensterdefinition auf explizite zeitliche Begrenzung (Tumbling/Sliding Window) prüfen |
| Aggregationsergebnisse unterscheiden sich je nachdem, wann die Verarbeitung tatsächlich lief | Aggregation basiert auf Processing Time statt Event Time | Zeitstempel-Quelle der Fensterzuordnung auf Event-Time- versus Processing-Time-Semantik prüfen |

Security: zustandsbehaftete Stream-Processing-Systeme speichern oft sensible aggregierte Daten im internen Zustand (z. B. laufende Nutzerverhalten-Aggregationen), was denselben Verschlüsselungs- und Zugriffskontrollanforderungen wie jede andere sensible Datenspeicherung unterliegen sollte, inklusive der Checkpoint-Speicherung selbst. Observability: Watermark-Fortschritt, Anzahl verworfener verspäteter Ereignisse, Checkpoint-Dauer und Zustandsgröße sind zentrale Metriken für die Gesundheit zustandsbehafteter Stream-Verarbeitung.

## Trade-offs und Entscheidungen

**Staff** definiert zeitbasierte Aggregationen konsequent auf Event Time, nicht Processing Time. **Principal** macht den Kompromiss zwischen Watermark-Toleranz und Ergebnis-Aktualität für das Team explizit nachvollziehbar. **Chief** positioniert zustandsbehaftetes Stream-Processing als eigenständige Verarbeitungsklasse mit expliziten Zeit- und Recovery-Garantien, nicht als triviale Erweiterung von Batch-Verarbeitung.

Anti-Patterns: zeitbasierte Aggregation auf Processing Time statt Event Time definieren; Watermark-Toleranz ohne Prüfung tatsächlicher Verspätungsmuster der Datenquelle konfigurieren; Zeitfenster-Aggregation ohne explizite Größenbegrenzung betreiben, wodurch Zustand unbegrenzt wächst.

## Production Checklist

- [ ] Zeitbasierte Aggregationen verwenden Event Time, aus den Ereignisdaten selbst extrahiert.
- [ ] Watermark-Toleranz ist gegen gemessene oder erwartete Ereignisverspätung dimensioniert.
- [ ] Checkpoint-Frequenz ist gegen Recovery-Datenverlust und Overhead abgewogen.
- [ ] Zeitfenster-Aggregation hat eine explizite Größenbegrenzung gegen unbegrenztes Zustandswachstum.

## Interviewfragen

### 1. Was ist der Unterschied zwischen Event Time und Processing Time, und warum ist er wichtig?

**Antwort:** Event Time ist der Zeitpunkt, zu dem ein Ereignis tatsächlich geschah, Processing Time ist der Zeitpunkt der tatsächlichen Verarbeitung — beide können durch Netzwerkverzögerung oder Systempausen deutlich auseinanderfallen; zeitbasierte Aggregation sollte auf Event Time basieren, um korrekte Ergebnisse unabhängig von Verarbeitungsverzögerungen zu liefern.

### 2. Was ist ein Watermark, und welches Problem löst er?

**Antwort:** Ein Watermark ist eine Heuristik, die schätzt, wann für ein Zeitfenster keine früheren Ereignisse mehr zu erwarten sind — er ermöglicht dem System, ein Fenster als abgeschlossen zu behandeln und ein Ergebnis zu emittieren, ohne unbegrenzt auf möglicherweise nie eintreffende, noch spätere Ereignisse zu warten.

### 3. Warum ist ein fehlendes Aggregationsergebnis in einem Zeitfenster nicht automatisch ein Bug?

**Antwort:** Ereignisse, die nach Ablauf der Watermark-Toleranz für ihr Zeitfenster eintreffen, werden je nach Konfiguration verworfen oder gesondert behandelt — das ist beabsichtigtes Verhalten des Watermark-Mechanismus, kein Verarbeitungsfehler.

### 4. Warum ist zustandsbehaftetes Stream-Processing bei einem Systemausfall besonders kritisch?

**Antwort:** Anders als bei zustandsloser Verarbeitung geht bei einem Ausfall ohne funktionierende Checkpoints der gesamte akkumulierte Zustand (z. B. laufende Aggregationen über Stunden) verloren, nicht nur einzelne unverarbeitete Ereignisse.

### 5. Wie diagnostizierst du, warum sich Aggregationsergebnisse je nach Verarbeitungszeitpunkt unterscheiden?

**Antwort:** Ich prüfe, ob die Fensterzuordnung auf Event Time oder Processing Time basiert — Processing-Time-basierte Aggregation liefert unterschiedliche Ergebnisse je nachdem, wann die Verarbeitung tatsächlich lief, während Event-Time-basierte Aggregation konsistente Ergebnisse unabhängig von Verarbeitungsverzögerung liefert.

### 6. Widersprüchliche Anforderung: Team will sofortige Aggregationsergebnisse (minimale Watermark-Toleranz) UND garantierte Vollständigkeit auch bei stark verspäteten Ereignissen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass dies ein struktureller Zielkonflikt ist — minimale Watermark-Toleranz bedeutet, dass Fenster früh geschlossen werden und stark verspätete Ereignisse verworfen werden; ich würde vorschlagen, ein moderates Watermark-Toleranzfenster für die Hauptaggregation zu nutzen und stark verspätete Ereignisse über einen Side-Output-Mechanismus separat zu behandeln (z. B. für eine spätere Korrektur-Aggregation), statt beide widersprüchlichen Ziele an ein einzelnes Fenster zu stellen.

## Praktische Labs

~~~python
# Watermark-based late event handling model
events = [
    (1, 100),  # (event_time, value)
    (2, 200),
    (5, 150),
    (3, 300),  # arrives "late" relative to processing order, but still within tolerance
    (10, 400), # advances watermark significantly
    (4, 999),  # arrives AFTER watermark passed timestamp 4's window -> too late
]

WATERMARK_TOLERANCE = 2  # max expected out-of-orderness

def process_stream(events):
    max_event_time_seen = 0
    window_sums = {}
    late_events = []

    for event_time, value in events:
        watermark = max_event_time_seen - WATERMARK_TOLERANCE
        if event_time < watermark:
            late_events.append((event_time, value))  # too late, side-output
        else:
            window_sums[event_time] = window_sums.get(event_time, 0) + value
        max_event_time_seen = max(max_event_time_seen, event_time)

    return window_sums, late_events

results, late = process_stream(events)
print(f"Processed windows: {results}")
print(f"Late events (arrived after watermark passed their window): {late}")
assert len(late) == 1
assert late[0] == (4, 999)
print("The late event is correctly isolated, not silently dropped or silently corrupting a closed window's result.")
~~~

## Dependencies, Cross-References und Quellen

1. Apache Flink: [Event Time and Watermarks](https://nightlies.apache.org/flink/flink-docs-stable/docs/concepts/time/), abgerufen 2026-09-17.
2. Apache Flink: [Checkpointing Documentation](https://nightlies.apache.org/flink/flink-docs-stable/docs/dev/datastream/fault-tolerance/checkpointing/), abgerufen 2026-09-17.
3. Akidau et al.: [The Dataflow Model](https://research.google/pubs/pub43864/), VLDB 2015, abgerufen 2026-09-17.

Flink-spezifische State-Backend-Konfiguration vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Unified Batch-und-Stream-APIs (dieselbe Logik für begrenzte und unbegrenzte Datenströme) | Established | Für neue Pipelines gegenüber getrennten Batch- und Stream-Implementierungen bevorzugen, wo unterstützt. |
| Inkrementelles Checkpointing zur Reduktion des Checkpoint-Overheads bei großem Zustand | Established | Für Anwendungsfälle mit großem akkumuliertem Zustand standardmäßig gegenüber vollständigen Checkpoints nutzen. |

Ein Team akzeptiert ein zustandsbehaftetes Stream-Processing-Design erst, wenn Event-Time-Semantik, Watermark-Toleranz und Checkpoint-Recovery nachweisbar getestet sind.
