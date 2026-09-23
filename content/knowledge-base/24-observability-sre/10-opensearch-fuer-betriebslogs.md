---
{"id": "KB-0574", "title": "OpenSearch für Betriebslogs", "domain": "24", "sequence": 10, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "CLOUD", "MLOPS"], "requires": [{"id": "KB-0573", "concepts": ["Loki und Logpipelines"], "needed_for": "understanding"}, {"id": "KB-0568", "concepts": ["Strukturierte Logs"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "OpenSearch-Logindizes mit sinnvollen Lebenszyklus-Richtlinien anhand offizieller Dokumentation korrekt konfigurieren und Suchabfragen gezielt auf Incidentfragen ausrichten können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Betriebslog-Anforderung explizit entscheiden, welche Indexstruktur und Lebenszyklus-Richtlinie (Hot-Warm-Cold-Übergänge, Retention) tatsächlich benötigt wird, ohne Clusterinternas neu zu behandeln, die bereits in Domain 09 kanonisch abgedeckt sind.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartet teure oder langsame Logsuche auf eine ungeeignete Indexstruktur oder fehlende Zeitraumeingrenzung zurückführen können, statt eine grundsätzliche Clusterstörung zu vermuten.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Logindex-Lebenszyklen und den Umgang mit sensiblen Betriebsdaten in einer OpenSearch-basierten Logplattform festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Cluster-Sharding- und Replikationsmechanik von OpenSearch im Detail ist Vertiefung und in Domain 09 behandelt.", "rationale": "Kern ist die Ausrichtung von Logindizes, Lebenszyklen und Suche auf tatsächliche Incidentfragen, nicht die interne Clusterarchitektur, die bereits kanonisch in Domain 09 behandelt ist."}}, "lab_validation": [{"lab_id": "KB-0574-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation einer zeitraumbegrenzten vs. unbegrenzten Logsuche, kein produktives OpenSearch-System verwendet", "evidence": "Ein lokales Skript simuliert, wie eine Logsuche ohne Zeitraumeingrenzung eine sehr große Anzahl von Indizes durchsuchen muss, während dieselbe Suche mit einer Zeitraumeingrenzung nur die relevanten, zeitlich begrenzten Indizes durchsucht, und zeigt damit den strukturellen Zusammenhang zwischen Indexlebenszyklus-Gestaltung und Suchperformance.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales OpenSearch-System."}]}
---
# OpenSearch für Betriebslogs

> **Ziel:** OpenSearch wird in diesem Kapitel gezielt als Logplattform für Betriebsdaten behandelt, nicht als allgemeines Clustersystem — die interne Sharding- und Replikationsmechanik von OpenSearch-Clustern ist bereits kanonisch in Domain 09 behandelt und wird hier bewusst nicht wiederholt. Der zentrale Punkt dieses Kapitels ist, dass Logindizes, Lebenszyklus-Richtlinien und Suchabfragen gezielt auf tatsächliche Incidentfragen ausgerichtet werden müssen — eine Logsuche, die primär zur Incident-Diagnose dient, braucht in der Regel eine enge Zeitraumeingrenzung und eine auf den vermuteten Dienst oder Fehlerbereich zugeschnittene Indexstruktur, statt eine unbegrenzte Volltextsuche über die gesamte, historisch gewachsene Logmenge.

## Zweck, Mental Model und Dependencies

Anders als das bereits in [KB-0573](09-loki-und-logpipelines.md) behandelte Loki, das nur Labels indiziert und den eigentlichen Logtext erst zur Abfragezeit durchsucht, indiziert OpenSearch den vollständigen Logtext vollständig vorab — dies ermöglicht flexible, unstrukturierte Volltextsuchen, die bei Loki teuer wären, geht jedoch mit einem deutlich größeren Indexspeicherbedarf einher. Für Betriebslogs bedeutet dies, dass die Indexstruktur und die Lebenszyklus-Richtlinien bewusst auf die tatsächliche Nutzung ausgerichtet werden müssen: Ein typischer Index-Lebenszyklus führt neue Logdaten zunächst in schnell durchsuchbare "Hot"-Indizes, verschiebt ältere, seltener abgefragte Daten in kostengünstigere "Warm"- oder "Cold"-Speicherstufen, und löscht Daten nach Ablauf der Retention-Vorgabe vollständig. Die bereits in [KB-0568](04-strukturierte-logs.md) behandelte Strukturierung von Logs bleibt auch hier zentral: Strukturierte Felder (etwa Dienstname, Fehlercode, Request-ID) ermöglichen präzise, auf die tatsächliche Incidentfrage zugeschnittene Suchabfragen, während unstrukturierter Freitext primär eine breite, aber ungenaue Suche ermöglicht. Der entscheidende Unterschied zur allgemeinen Suchmaschinen-Nutzung ist die bewusste Ausrichtung auf Incidentfragen: Eine Logsuche im Betriebskontext dient in aller Regel der Beantwortung einer konkreten, zeitlich und thematisch eingegrenzten Frage (etwa "welche Fehler traten im Dienst X zwischen 14:00 und 14:15 Uhr auf?"), nicht einer allgemeinen, unbegrenzten Exploration der gesamten Logmenge — eine unbegrenzte Suche ohne Zeitraum- oder Diensteingrenzung ist sowohl performanceseitig teuer als auch für die eigentliche Incident-Diagnose selten zielführend.

~~~text
OpenSearch here: treated as LOG PLATFORM for operational data, NOT general cluster system
  cluster sharding/replication internals already canonical in Domain 09, deliberately not repeated here
UNLIKE Loki (KB-0573, indexes only labels, log text searched at query time):
  OpenSearch fully indexes complete log text UP FRONT
  -> enables flexible unstructured full-text search (expensive at Loki)
  -> at cost of much larger index storage requirement
KEY POINT: log index structure + lifecycle policies must be deliberately aligned to ACTUAL incident questions
  incident-diagnosis search typically needs: tight time-range scoping + structure tailored to suspected service/error area
  NOT unbounded full-text search over entire, historically-grown log volume
TYPICAL INDEX LIFECYCLE:
  new log data -> fast-searchable "hot" indices
  older, less-queried data -> cheaper "warm"/"cold" storage tiers
  data deleted entirely after retention policy expires
Structured logs (KB-0568) remain central:
  structured fields (service name, error code, request ID) -> precise, incident-question-scoped search
  unstructured free text -> broad but imprecise search only
DECISIVE DIFFERENCE from general search-engine usage:
  operational log search usually answers a CONCRETE, time+topic-scoped question
    (e.g. "which errors occurred in service X between 14:00-14:15?")
  NOT unbounded exploration of entire log volume
  unbounded search w/o time/service scoping -> expensive AND rarely useful for actual incident diagnosis
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Vollständige Textindizierung | ermöglicht flexible Volltextsuche | größerer Indexspeicherbedarf als bei Loki |
| Index-Lebenszyklus (Hot/Warm/Cold) | staffelt Speicherkosten nach Alter/Zugriffshäufigkeit | senkt Gesamtkosten bei großer Logmenge |
| Strukturierte Felder | ermöglicht präzise, incidentbezogene Suche | wichtiger als reine Volltextsuche für Diagnose |
| Zeitraumeingrenzung | begrenzt die durchsuchte Indexmenge | zentral für Suchperformance |

Implementierung: Logindizes werden mit Lebenszyklus-Richtlinien versehen, die neue Daten in schnell durchsuchbare Indizes leiten und ältere Daten in kostengünstigere Speicherstufen verschieben. Suchabfragen werden bewusst mit Zeitraum- und Diensteingrenzung formuliert, um die durchsuchte Datenmenge auf die tatsächliche Incidentfrage zu begrenzen. Sensible Betriebsdaten in Logs werden vor Indizierung identifiziert und entsprechend begrenzt oder maskiert.

## Scalability, Reliability, Security und Observability

OpenSearch als Logplattform skaliert die Suchperformance proportional zur Qualität der Index-Lebenszyklus-Gestaltung und der Präzision der Suchabfragen; die Reliability-Grenze liegt darin, dass eine unbegrenzte, ungeeignet strukturierte Logsuche die Clusterkapazität überproportional beanspruchen kann (Clusterinternas hierzu in Domain 09).

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Logsuche zur Incident-Diagnose ist unerwartet langsam | die Abfrage hat keine oder eine zu weite Zeitraumeingrenzung und durchsucht zu viele Indizes | die Abfrage mit einer engeren Zeitraum- und Diensteingrenzung wiederholen |
| die Speicherkosten der Logplattform steigen unerwartet | die Index-Lebenszyklus-Richtlinie verschiebt ältere Daten nicht rechtzeitig in kostengünstigere Speicherstufen | die Lebenszyklus-Richtlinie an die tatsächliche Zugriffshäufigkeit anpassen |
| sensible Betriebsdaten erscheinen in Suchergebnissen | Logdaten wurden ohne vorherige Maskierung sensibler Felder indiziert | die Logpipeline um eine Maskierungsstufe vor der Indizierung ergänzen |

Security: Sensible Betriebsdaten (etwa personenbezogene Daten oder Zugangsdaten) sollten vor der Indizierung maskiert oder ausgeschlossen werden, da eine nachträgliche Entfernung aus einem bereits indizierten Logbestand aufwendig ist. Observability: Die tatsächliche Suchlatenz für typische Incident-Diagnosefragen und die Speicherkostenverteilung über die Lebenszyklusstufen sind zentrale Betriebssignale.

## Trade-offs und Entscheidungen

**Staff** formuliert Logsuchen für eine gegebene Incidentfrage mit korrekter Zeitraum- und Diensteingrenzung. **Principal** entwirft die vollständige Index-Lebenszyklus-Struktur für eine Logplattform. **Chief** legt unternehmensweite Standards für Logindex-Lebenszyklen und den Umgang mit sensiblen Betriebsdaten fest.

Anti-Patterns: Logsuchen routinemäßig ohne Zeitraum- oder Diensteingrenzung gegen den gesamten historischen Logbestand ausführen; keine Index-Lebenszyklus-Richtlinie definieren und dadurch alte, selten abgefragte Daten dauerhaft in teuren Hot-Indizes belassen; sensible Betriebsdaten ohne Maskierung vor der Indizierung in die Logplattform übernehmen.

## Production Checklist

- [ ] Logindizes sind mit einer Hot-Warm-Cold-Lebenszyklus-Richtlinie versehen.
- [ ] Typische Incident-Diagnosefragen sind mit engen Zeitraum- und Diensteingrenzungen formulierbar.
- [ ] Sensible Betriebsdaten werden vor der Indizierung maskiert oder ausgeschlossen.
- [ ] Die Retention-Dauer ist an den tatsächlichen Bedarf angepasst, nicht pauschal maximal konfiguriert.

## Interviewfragen

### 1. Was unterscheidet OpenSearch strukturell von Loki im Umgang mit Logtext?

**Antwort:** OpenSearch indiziert den vollständigen Logtext vollständig vorab, was flexible Volltextsuche ermöglicht, aber mehr Indexspeicher benötigt; Loki indiziert nur Labels und durchsucht den Logtext erst zur Abfragezeit.

### 2. Wofür dient ein Hot-Warm-Cold-Index-Lebenszyklus?

**Antwort:** Um neue, häufig abgefragte Daten in schnell durchsuchbaren, teureren Indizes zu halten und ältere, seltener abgefragte Daten in kostengünstigere Speicherstufen zu verschieben, bevor sie nach Ablauf der Retention gelöscht werden.

### 3. Warum ist eine Zeitraumeingrenzung für Incident-Diagnosefragen zentral?

**Antwort:** Weil sie die durchsuchte Indexmenge auf den tatsächlich relevanten Zeitraum begrenzt und dadurch sowohl die Suchperformance verbessert als auch die Diagnose auf den tatsächlich relevanten Zeitraum fokussiert.

### 4. Warum sollten sensible Betriebsdaten vor der Indizierung maskiert werden?

**Antwort:** Weil eine nachträgliche Entfernung aus einem bereits indizierten Logbestand aufwendig ist und sensible Daten in Suchergebnissen ansonsten ungeschützt erscheinen können.

### 5. Wie gehst du vor, wenn eine Logsuche zur Incident-Diagnose unerwartet langsam ist?

**Antwort:** Ich prüfe, ob die Abfrage eine ausreichend enge Zeitraum- und Diensteingrenzung verwendet, da eine unbegrenzte Suche über den gesamten Logbestand die Performance unnötig belastet.

### 6. Widersprüchliche Anforderung: Team will unbegrenzte, explorative Volltextsuche über alle historischen Logs UND minimale Speicherkosten — wie gehst du vor?

**Antwort:** Ich würde eine gestaffelte Lebenszyklus-Struktur mit reduzierter Suchfähigkeit für ältere, in Cold-Speicher verschobene Daten vorschlagen und explizit klären, für welchen konkreten Anwendungsfall die unbegrenzte Volltextsuche tatsächlich benötigt wird, statt pauschal vollständige Volltextsuchfähigkeit über die gesamte Historie bei minimalen Kosten zu versprechen.

## Praktische Labs

~~~python
# Local, deterministic simulation of time-scoped vs unscoped log search cost (executed locally, no real OpenSearch):

def search_cost(indices, time_range=None):
    if time_range:
        matching = [idx for idx in indices if idx["day"] in time_range]
    else:
        matching = indices
    return {"indices_searched": len(matching), "cost_units": len(matching) * 5}

indices = [{"day": d} for d in range(365)]  # one index per day over a year

print("unscoped search:", search_cost(indices))
print("scoped search (last 2 days):", search_cost(indices, time_range=[363, 364]))
~~~

## Dependencies, Cross-References und Quellen

1. OpenSearch-Dokumentation: [Index State Management](https://opensearch.org/docs/latest/im-plugin/ism/index/), abgerufen 2026-09-18.
2. OpenSearch-Dokumentation: [OpenSearch Query DSL](https://opensearch.org/docs/latest/query-dsl/), abgerufen 2026-09-18.

Clusterinternas (Sharding, Replikation) sind kanonisch in Domain 09 behandelt; strukturierte Logs in [KB-0568](04-strukturierte-logs.md); die Label-basierte Alternative in [KB-0573](09-loki-und-logpipelines.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Erkennung und Maskierung sensibler Felder direkt in der Logpipeline vor Indizierung | Evaluating | Vor produktivem Einsatz gegen manuelle Stichprobenprüfung validieren, da eine unvollständige automatische Erkennung ein falsches Sicherheitsgefühl erzeugen kann. |

Ein Team akzeptiert eine OpenSearch-basierte Logplattform erst, wenn Index-Lebenszyklus, Zeitraumeingrenzung bei typischen Suchen und Maskierung sensibler Daten nachweislich auf tatsächliche Incidentfragen statt auf unbegrenzte Exploration ausgerichtet sind.
