---
{"id": "KB-0319", "title": "Knowledge Graphs", "domain": "13", "sequence": 15, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0318", "concepts": ["GraphRAG"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Modell für Ontologieänderungen implementieren, das eine widersprüchliche Aussage bei einer Aktualisierung explizit erkennt, statt sie stillschweigend zu überschreiben.", "rationale": "Der Umgang mit widersprüchlichen Aussagen bei Ontologieänderungen wird erst durch konkrete Implementierung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein Knowledge-Graph-Modell gestalten, das Herkunft (Provenance) für jede Aussage als eigenständiges Attribut behandelt, um Widersprüche zwischen unterschiedlichen Quellen fachlich aufzulösen, statt sie technisch zu verstecken.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine fehlerhafte Antwort aufgrund veralteter, nicht aktualisierter Ontologieinformationen auf eine fehlende Widerspruchsbehandlung statt auf ein allgemeines Datenqualitätsproblem zurückführen können.", "rationale": "Ein Knowledge Graph, der widersprüchliche Aussagen unbemerkt überschreibt statt sie explizit fachlich aufzulösen, kann veraltete oder falsche Information ohne erkennbare Spur weiterführen."}, "CHIEF-TARGET": {"active": true, "scope": "Knowledge Graphs als fachliches Modellierungsproblem (Ontologieänderungen, Widerspruchsbehandlung) positionieren, das über reinen Graphdatenbankbetrieb (Speicherung, Abfrage) hinausgeht.", "rationale": "Der technische Betrieb einer Graphdatenbank ist von der fachlichen Herausforderung zu unterscheiden, Ontologieänderungen und widersprüchliche Aussagen sachgerecht zu modellieren."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Ontologiesprachen (OWL, RDF-Schema) sind Vertiefung.", "rationale": "Kern ist das Prinzip von Provenance-Modellierung und Widerspruchsbehandlung, nicht die konkrete Ontologiesprache."}}, "lab_validation": [{"lab_id": "KB-0319-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell eines Knowledge Graphs mit Provenance-Modellierung, das widersprüchliche Aussagen unterschiedlicher Quellen explizit erkennt statt überschreibt", "evidence": "Eine neue Aussage, die einer bestehenden, mit Provenance versehenen Aussage widerspricht, wird durch einen expliziten Konflikterkennungsschritt sichtbar gemacht, statt die alte Aussage stillschweigend zu ersetzen.", "limitations": "Keine echte Graphdatenbank, kein produktives System, keine reale Ontologieverwaltung."}]}
---
# Knowledge Graphs

> **Ziel:** Ein Knowledge Graph modelliert Entitäten, Relationen zwischen diesen Entitäten und Herkunft (Provenance) für jede Aussage, aufbauend auf GraphRAG (siehe [KB-0318](14-graphrag.md)). Der zentrale, fachliche Punkt ist die Behandlung von Ontologieänderungen (wie ändert sich die Struktur der modellierten Konzepte über Zeit) und widersprüchlichen Aussagen (unterschiedliche Quellen behaupten Unterschiedliches über dieselbe Relation) — dies ist eine fachliche Modellierungsherausforderung, die über den reinen technischen Betrieb einer Graphdatenbank (Speicherung, Abfrage, Skalierung) hinausgeht.

## Zweck, Mental Model und Dependencies

Entitäten sind die modellierten Objekte im Graphen (Personen, Organisationen, Konzepte), Relationen sind die typisierten Verbindungen zwischen ihnen (z. B. "arbeitet für", "ist Teil von"). Provenance dokumentiert für jede Aussage (jede Relation zwischen zwei Entitäten), aus welcher Quelle sie stammt, wann sie erfasst wurde und mit welcher Konfidenz — dies ist notwendig, um widersprüchliche Aussagen fachlich aufzulösen, statt sie technisch zu verstecken. Ontologieänderungen betreffen die Struktur des Modells selbst: wenn sich die Art, wie ein Konzept kategorisiert wird, über Zeit ändert (z. B. eine Organisationseinheit wird umstrukturiert, ein Konzept wird in zwei separate Konzepte aufgeteilt), muss der Knowledge Graph diese strukturelle Änderung nachvollziehbar abbilden, statt historische Aussagen unter der alten Struktur zu verlieren oder zu verfälschen. Der zentrale, oft übersehene fachliche Fehler ist, eine widersprüchliche neue Aussage einfach die alte, bestehende Aussage überschreiben zu lassen (z. B. weil ein neuerer Datenimport eine andere Relation zwischen denselben Entitäten liefert) — ohne explizite Provenance und Konflikterkennung geht dabei die Information verloren, dass ein Widerspruch überhaupt existierte, und es bleibt unklar, welche der beiden Aussagen tatsächlich korrekt ist. Dies unterscheidet sich fundamental vom reinen technischen Graphdatenbankbetrieb, der sich mit Speicherformat, Abfrageeffizienz und Skalierung befasst, aber nicht automatisch die fachliche Frage löst, wie mit widersprüchlichen oder sich ändernden Wissensaussagen umzugehen ist.

~~~text
Entities: modeled objects (people, organizations, concepts)
Relations: typed connections between entities ("works for", "is part of")
Provenance: for EACH statement -> source, timestamp, confidence -> needed to resolve conflicts, not hide them
Ontology change: structure of the model itself changes over time (reorg, concept split)
  -> must be traceably represented, not silently lose/corrupt historical statements
CRITICAL MODELING ERROR: contradictory new statement SILENTLY OVERWRITES old one
  -> loses the fact a conflict even existed, unclear which statement is actually correct
DISTINCT FROM pure graph DB operations (storage format, query efficiency, scaling)
  -> those don't automatically solve the FACTUAL problem of conflicting/evolving knowledge
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Provenance als eigenständiges Attribut jeder Aussage | wird für jede Relation dokumentiert, aus welcher Quelle, wann und mit welcher Konfidenz sie erfasst wurde? | ohne Provenance lässt sich ein Widerspruch zwischen Quellen nicht nachvollziehbar auflösen |
| Explizite Konflikterkennung statt stillem Überschreiben | wird eine widersprüchliche neue Aussage explizit als Konflikt erkannt, statt die bestehende Aussage stillschweigend zu ersetzen? | stilles Überschreiben verliert die Information, dass ein Widerspruch existierte, und verschleiert Unsicherheit |
| Nachvollziehbare Ontologieänderungen | werden strukturelle Änderungen am Modell (Konzeptaufteilung, Umstrukturierung) so abgebildet, dass historische Aussagen weiterhin interpretierbar bleiben? | eine nicht nachvollziehbare Ontologieänderung kann historische Aussagen unter der alten Struktur unbrauchbar oder falsch interpretierbar machen |
| Trennung von fachlicher Modellierung und technischem Betrieb | wird die fachliche Herausforderung (Widersprüche, Ontologieänderungen) getrennt von der rein technischen Graphdatenbankverwaltung behandelt? | eine Vermischung kann dazu führen, dass technische Lösungen (z. B. einfaches Überschreiben) fachliche Probleme scheinbar lösen, ohne sie tatsächlich zu adressieren |

Implementierung: Jede Relation im Knowledge Graph erhält Provenance-Metadaten (Quelle, Zeitstempel, Konfidenz) als eigenständiges, abfragbares Attribut. Bei Aufnahme einer neuen Aussage wird explizit geprüft, ob sie einer bestehenden Aussage zwischen denselben Entitäten widerspricht; ein erkannter Widerspruch wird als solcher markiert und beiden konfligierenden Aussagen mit ihrer jeweiligen Provenance zugänglich gemacht, statt die ältere Aussage stillschweigend zu löschen. Ontologieänderungen werden versioniert dokumentiert, sodass historische Aussagen weiterhin im Kontext ihrer ursprünglichen Struktur interpretierbar bleiben, auch wenn sich die aktuelle Ontologie seitdem geändert hat. Die fachliche Modellierungslogik (Provenance, Konflikterkennung, Ontologieversionierung) wird als eigenständige Schicht über der rein technischen Graphdatenbankinfrastruktur implementiert.

## Scalability, Reliability, Security und Observability

Knowledge Graphs skalieren fachliche Verlässlichkeit proportional zur Konsequenz der Provenance-Modellierung und Konflikterkennung; die Reliability-Grenze liegt in stillem Überschreiben widersprüchlicher Aussagen, das mit wachsender Anzahl an Datenquellen proportional mehr unentdeckte, potenziell falsche Wissensstände erzeugen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Antwort basiert auf einer veralteten oder widerlegten Aussage, obwohl neuere, korrekte Information im System existiert | eine widersprüchliche neuere Aussage wurde nicht erkannt oder die ältere Aussage wurde stillschweigend nicht aktualisiert | prüfen, ob eine explizite Konflikterkennung zwischen den beiden widersprüchlichen Aussagen stattgefunden hat |
| eine historische Aussage lässt sich nach einer Ontologieänderung nicht mehr korrekt interpretieren | die Ontologieänderung wurde nicht versioniert dokumentiert, sodass der historische Kontext verloren ging | prüfen, ob die Ontologieänderung nachvollziehbar versioniert und mit der historischen Aussage verknüpft ist |
| es ist unklar, welche von zwei widersprüchlichen Aussagen im Graphen korrekt ist | fehlende Provenance-Information (Quelle, Zeitstempel, Konfidenz) für die betroffenen Aussagen | prüfen, ob beide Aussagen vollständige Provenance-Metadaten besitzen, die eine fachliche Bewertung ermöglichen |

Security: Provenance-Metadaten können selbst sensible Information über die Herkunft von Wissen offenlegen (z. B. welche interne Quelle eine bestimmte Aussage lieferte) und sollten denselben Zugriffskontrollen wie der zugrunde liegende Inhalt unterliegen. Observability: Häufigkeit erkannter Widersprüche zwischen Aussagen, Vollständigkeit der Provenance-Metadaten pro Relation und Häufigkeit von Ontologieänderungen mit nachvollziehbarer Versionierung sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Provenance-Metadaten und Konflikterkennung als festen Bestandteil jeder Knowledge-Graph-Aktualisierung. **Principal** macht Ontologieversionierung für das Team nachvollziehbar dokumentiert. **Chief** positioniert Knowledge-Graph-Modellierung (Provenance, Widersprüche, Ontologieänderungen) als eigenständige fachliche Herausforderung, getrennt vom rein technischen Graphdatenbankbetrieb.

Anti-Patterns: widersprüchliche neue Aussagen stillschweigend über bestehende Aussagen schreiben lassen, ohne Konflikterkennung; Relationen ohne Provenance-Metadaten modellieren; Ontologieänderungen ohne nachvollziehbare Versionierung durchführen, sodass historische Aussagen unbrauchbar werden.

## Production Checklist

- [ ] Jede Relation im Graphen besitzt vollständige Provenance-Metadaten (Quelle, Zeitstempel, Konfidenz).
- [ ] Widersprüchliche Aussagen werden explizit erkannt, nicht stillschweigend überschrieben.
- [ ] Ontologieänderungen sind nachvollziehbar versioniert.
- [ ] Fachliche Modellierungslogik ist als eigenständige Schicht über der technischen Graphinfrastruktur implementiert.

## Interviewfragen

### 1. Warum ist Provenance für jede Aussage in einem Knowledge Graph notwendig?

**Antwort:** Sie dokumentiert Quelle, Zeitstempel und Konfidenz jeder Aussage und ermöglicht so, Widersprüche zwischen unterschiedlichen Quellen fachlich nachvollziehbar aufzulösen, statt sie zu verschleiern.

### 2. Was passiert, wenn eine widersprüchliche neue Aussage eine bestehende Aussage stillschweigend überschreibt?

**Antwort:** Die Information, dass überhaupt ein Widerspruch existierte, geht verloren, und es bleibt unklar, welche der beiden Aussagen tatsächlich korrekt ist — dies ist ein fachlicher Modellierungsfehler, kein reines Datenmanagementproblem.

### 3. Warum müssen Ontologieänderungen versioniert dokumentiert werden?

**Antwort:** Ohne Versionierung können historische Aussagen unter der alten Ontologiestruktur unbrauchbar oder falsch interpretierbar werden, wenn sich die aktuelle Struktur seitdem geändert hat.

### 4. Warum unterscheidet sich Knowledge-Graph-Modellierung vom reinen Graphdatenbankbetrieb?

**Antwort:** Der technische Betrieb (Speicherung, Abfrage, Skalierung) löst nicht automatisch die fachliche Herausforderung, wie mit widersprüchlichen oder sich über Zeit ändernden Wissensaussagen sachgerecht umzugehen ist.

### 5. Wie diagnostizierst du eine Antwort, die auf einer veralteten, widerlegten Aussage basiert?

**Antwort:** Ich prüfe, ob eine explizite Konflikterkennung zwischen der veralteten und einer neueren, korrekten Aussage stattgefunden hat — fehlt sie, wurde die neuere Aussage wahrscheinlich nicht als widersprechend erkannt oder die ältere nicht aktualisiert.

### 6. Widersprüchliche Anforderung: Team will einen stets "sauberen", widerspruchsfreien Knowledge Graph ohne sichtbare Konflikte UND garantiert keine stillschweigend verlorenen oder überschriebenen Informationen bei widersprüchlichen Quellen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass ein widerspruchsfreier Graph bei tatsächlich widersprüchlichen Quellen nur durch stilles Überschreiben erreichbar wäre, was die zweite Anforderung verletzt; ich würde vorschlagen, erkannte Konflikte in einer separaten, für normale Abfragen ausgeblendeten Konfliktschicht mit vollständiger Provenance zu führen, sodass reguläre Abfragen einen konsistenten Blick erhalten, während die volle Konfliktinformation für fachliche Klärung erhalten bleibt.

## Praktische Labs

~~~python
# Knowledge graph with provenance-based conflict detection instead of silent overwrite
knowledge_graph = {}

def add_statement(entity_a, relation, entity_b, source, timestamp, confidence):
    key = (entity_a, relation)
    new_statement = {"target": entity_b, "source": source, "timestamp": timestamp, "confidence": confidence}
    if key in knowledge_graph and knowledge_graph[key]["target"] != entity_b:
        existing = knowledge_graph[key]
        return {
            "status": "CONFLICT_DETECTED",
            "existing": existing,
            "new": new_statement,
            "message": f"'{entity_a}' {relation} conflicting targets: '{existing['target']}' (from {existing['source']}) vs '{entity_b}' (from {source})",
        }
    knowledge_graph[key] = new_statement
    return {"status": "added", "statement": new_statement}

print(add_statement("ProjectX", "led_by", "Alice", source="HR_system", timestamp="2026-01-01", confidence=0.9))
conflict_result = add_statement("ProjectX", "led_by", "Bob", source="quarterly_report", timestamp="2026-06-01", confidence=0.7)
print(conflict_result)
~~~

## Dependencies, Cross-References und Quellen

1. W3C: [PROV-O — The PROV Ontology](https://www.w3.org/TR/prov-o/), abgerufen 2026-09-17.
2. Hogan et al.: [Knowledge Graphs — Survey](https://arxiv.org/abs/2003.02320), abgerufen 2026-09-17.
3. Neo4j: [Knowledge Graphs for RAG](https://neo4j.com/developer-blog/knowledge-graph-rag-application/), abgerufen 2026-09-17.

GraphRAG ist kanonisch in [KB-0318](14-graphrag.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte Provenance-Ontologien (z. B. PROV-O) für konsistente, interoperable Herkunftsmodellierung über Systeme hinweg | Adopting | Gegenüber proprietären Provenance-Schemata für Interoperabilität und etablierte Semantik bevorzugen. |
| Automatisierte Konflikterkennungsmodelle, die semantisch ähnliche, aber widersprüchliche Aussagen über verschiedene Formulierungen hinweg erkennen | Emerging | Beobachten; würde einfache exakte Widerspruchserkennung ergänzen, aber noch nicht breit etabliert. |

Ein Team akzeptiert eine Knowledge-Graph-Architektur erst, wenn Provenance-Modellierung, Konflikterkennung und Ontologieversionierung dokumentiert und getestet sind.
