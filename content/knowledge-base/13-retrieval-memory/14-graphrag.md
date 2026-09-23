---
{"id": "KB-0318", "title": "GraphRAG", "domain": "13", "sequence": 14, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0311", "concepts": ["Hybrid Retrieval"], "needed_for": "understanding"}], "related": ["KB-0317"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine einfache Wissensgraphextraktion aus Text implementieren und deren Fehleranfälligkeit anhand mehrdeutiger Entitätsbezüge demonstrieren.", "rationale": "Das Extraktionsfehlerrisiko von GraphRAG wird erst durch konkrete Implementierung einer Graphextraktion greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Entscheiden, wann GraphRAG gegenüber einfachem RAG (siehe KB-0305) für einen konkreten Anwendungsfall gerechtfertigt ist, basierend auf dem tatsächlichen Bedarf an Beziehungsabfragen statt auf genereller Technologiebegeisterung.", "rationale": "GraphRAG erzeugt zusätzliche Extraktions- und Pflegekosten, die nur gerechtfertigt sind, wenn der Anwendungsfall tatsächlich von Beziehungsabfragen zwischen Entitäten profitiert."}, "STAFF-TARGET": {"active": true, "scope": "Eine fehlerhafte Beziehungsantwort auf einen Extraktionsfehler im zugrunde liegenden Wissensgraphen statt auf ein allgemeines Retrieval-Problem zurückführen können.", "rationale": "Ein automatisch aus Text extrahierter Wissensgraph kann fehlerhafte oder mehrdeutige Beziehungen enthalten, die zu falschen Antworten auf Beziehungsanfragen führen."}, "CHIEF-TARGET": {"active": true, "scope": "GraphRAG als Erweiterung mit signifikanten zusätzlichen Extraktions- und Pflegekosten positionieren, die nur bei nachgewiesenem Bedarf an Beziehungsabfragen gerechtfertigt ist, nicht als generelle RAG-Verbesserung.", "rationale": "Die zusätzliche Komplexität von GraphRAG ist nicht für jeden Anwendungsfall gerechtfertigt; einfaches RAG kann für rein inhaltsbasierte Anfragen ausreichend und wartungsärmer sein."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Graphextraktionsalgorithmen und Community-Detection-Verfahren sind Vertiefung.", "rationale": "Kern ist die Abwägung von Extraktionskosten gegen Beziehungsabfragebedarf, nicht die konkrete Extraktionstechnik."}}, "lab_validation": [{"lab_id": "KB-0318-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell einer einfachen Graphextraktion mit demonstriertem Extraktionsfehler bei mehrdeutigen Entitätsbezügen", "evidence": "Eine automatische Extraktion von Beziehungen aus Text kann bei mehrdeutigen Namensbezügen (z. B. zwei Personen mit ähnlichem Namen) eine falsche Beziehung zwischen den falschen Entitäten erzeugen, was bei einer nachfolgenden Beziehungsanfrage zu einer fehlerhaften Antwort führt.", "limitations": "Kein echtes GraphRAG-System, keine echte Graphdatenbank, kein produktives System."}]}
---
# GraphRAG

> **Ziel:** GraphRAG erweitert einfaches RAG (siehe [KB-0305](01-rag-pipelines-und-grounding.md)) um graphgestützte Beziehungen zwischen Entitäten und unterscheidet zwischen lokaler Suche (Beantwortung spezifischer Fragen über einzelne Entitäten und deren direkte Beziehungen) und globaler Suche (Beantwortung übergreifender Fragen, die eine Zusammenfassung über den gesamten Wissensgraphen erfordern). Der zentrale Punkt ist, Extraktionsfehler (fehlerhafte oder mehrdeutige automatisch extrahierte Beziehungen) und zusätzliche Pflegekosten gegenüber einfachem RAG explizit zu bewerten, statt GraphRAG pauschal als generelle Verbesserung einzusetzen.

## Zweck, Mental Model und Dependencies

Graphgestützte Beziehungen bedeuten, dass zusätzlich zu den reinen Textinhalten explizite Beziehungen zwischen Entitäten (Personen, Organisationen, Konzepte) in einem Wissensgraphen modelliert werden — dies ermöglicht Anfragen, die über reine inhaltliche Ähnlichkeit hinausgehen (z. B. "Welche Projekte hat Person X mit Organisation Y durchgeführt?"), die ein einfaches RAG-System mit reiner Textähnlichkeit oft nicht zuverlässig beantworten kann. Lokale Suche nutzt den Graphen, um spezifische Fragen über einzelne Entitäten und deren direkte Nachbarn zu beantworten. Globale Suche nutzt Community-Detection oder Zusammenfassungstechniken über größere Teile des Graphen, um übergreifende, thematische Fragen zu beantworten, die kein einzelnes Dokument vollständig beantworten könnte. Der zentrale, oft übersehene Risikofaktor ist, dass der Wissensgraph selbst typischerweise automatisch aus Text extrahiert wird (durch ein Sprachmodell, das Entitäten und Beziehungen identifiziert) — diese Extraktion ist fehleranfällig, insbesondere bei mehrdeutigen Entitätsbezügen (z. B. zwei Personen mit ähnlichem Namen, ein Begriff mit mehreren Bedeutungen). Ein Extraktionsfehler an dieser Stelle kann sich auf alle nachfolgenden Beziehungsabfragen auswirken, die auf der fehlerhaften Graphstruktur basieren. Zusätzlich erzeugt der Wissensgraph selbst Pflegekosten: bei Änderungen am zugrunde liegenden Textbestand muss der Graph aktualisiert werden, was deutlich aufwendiger ist als eine einfache Neuindexierung von Embeddings bei einfachem RAG.

~~~text
Graph-based relationships: model EXPLICIT entity relationships beyond pure text similarity
  -> enables queries plain RAG struggles with ("what projects did X do with Y?")
Local search: answer specific queries about entities + their direct neighbors
Global search: community detection/summarization over large graph portions -> thematic, cross-document questions
CRITICAL RISK: knowledge graph is typically AUTO-EXTRACTED from text by an LLM -> extraction is error-prone
  -> ambiguous entity references (similar names, polysemous terms) -> WRONG relationships in the graph
  -> extraction error propagates to ALL downstream relationship queries using that graph structure
Maintenance cost: graph updates on source text change are MUCH more expensive than simple RE-EMBEDDING
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Explizite Bewertung des Beziehungsabfragebedarfs | wurde geprüft, ob der konkrete Anwendungsfall tatsächlich von expliziten Beziehungsabfragen profitiert, die einfaches RAG nicht zuverlässig beantworten kann? | ohne diese Prüfung kann GraphRAG für Anwendungsfälle eingesetzt werden, die auch mit einfacherem RAG ausreichend bedient wären |
| Kontrolle von Extraktionsfehlern bei mehrdeutigen Entitäten | existiert ein Mechanismus, der mehrdeutige Entitätsbezüge bei der Extraktion erkennt oder zumindest deren Unsicherheit dokumentiert? | unerkannte mehrdeutige Extraktion kann falsche Beziehungen in den Graphen einbringen, die nachfolgende Abfragen fehlerhaft beantworten |
| Bewusste Pflegekosten-Kalkulation | ist der zusätzliche Pflegeaufwand für Graphaktualisierung gegenüber einfacher Re-Indexierung bei RAG explizit kalkuliert? | eine unterschätzte Pflegekostenkalkulation kann zu einem veralteten, nicht mehr aktuell gehaltenen Wissensgraphen führen |
| Getrennte Behandlung lokaler und globaler Suche | ist klar definiert, welche Anfragetypen lokale versus globale Graphsuche benötigen? | eine undifferenzierte Behandlung kann zu ineffizienten oder unpassenden Antworten für bestimmte Anfragetypen führen |

Implementierung: Vor der Einführung von GraphRAG wird explizit geprüft und mit konkreten Beispielanfragen belegt, dass der Anwendungsfall tatsächlich von Beziehungsabfragen profitiert, die einfaches RAG nicht zuverlässig beantworten kann. Bei der automatischen Graphextraktion werden mehrdeutige Entitätsbezüge, wo möglich, erkannt und mit einer Unsicherheitsmarkierung versehen, statt sie stillschweigend als eindeutige Beziehung in den Graphen zu übernehmen. Der Pflegeaufwand für Graphaktualisierung bei Änderungen des zugrunde liegenden Textbestands wird explizit kalkuliert und gegen den Pflegeaufwand einer einfachen Re-Indexierung bei reinem RAG verglichen. Lokale und globale Suchanfragen werden unterschiedlich behandelt, mit spezifischen Mechanismen für Einzelentitäts-Abfragen versus übergreifende, zusammenfassende Fragen.

## Scalability, Reliability, Security und Observability

GraphRAG skaliert die Beantwortbarkeit von Beziehungsabfragen proportional zur Extraktionsqualität des zugrunde liegenden Wissensgraphen; die Reliability-Grenze liegt in unkontrollierten Extraktionsfehlern bei mehrdeutigen Entitäten, die mit wachsender Graphgröße proportional mehr fehlerhafte Beziehungsantworten erzeugen können.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Beziehungsanfrage liefert eine falsche Antwort über die Verbindung zwischen zwei Entitäten | ein Extraktionsfehler bei mehrdeutigen Entitätsbezügen hat eine falsche Beziehung in den Graphen eingebracht | prüfen, ob die betroffenen Entitäten bei der Extraktion eindeutig oder mehrdeutig identifizierbar waren |
| der Wissensgraph spiegelt nicht mehr den aktuellen Stand des zugrunde liegenden Textbestands wider | unzureichende Pflege des Graphen nach Änderungen am Textbestand, höherer Aufwand als erwartet | prüfen, ob die tatsächliche Aktualisierungsfrequenz des Graphen mit der Änderungsfrequenz des Textbestands Schritt hält |
| GraphRAG wird eingesetzt, aber die Nutzeranfragen profitieren nicht messbar von den zusätzlichen Beziehungsabfragen | fehlende Vorabprüfung, ob der Anwendungsfall tatsächlich von Beziehungsabfragen profitiert | prüfen, ob konkrete Beispielanfragen belegen, dass einfaches RAG diese nicht zuverlässig beantworten könnte |

Security: Ein automatisch extrahierter Wissensgraph, der aus vertraulichen oder zugriffsbeschränkten Dokumenten stammt, muss dieselben Zugriffskontrollen wie die ursprünglichen Dokumente erben — eine Beziehungsabfrage könnte sonst Informationen über Entitätsverbindungen preisgeben, die aus einer für den anfragenden Nutzer nicht autorisierten Quelle stammen. Observability: Häufigkeit erkannter mehrdeutiger Entitätsextraktionen, tatsächliche Nutzung lokaler versus globaler Suchanfragen und Aktualität des Graphen gegenüber dem zugrunde liegenden Textbestand sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** prüft vor jeder GraphRAG-Einführung explizit, ob der Anwendungsfall tatsächlich von Beziehungsabfragen profitiert. **Principal** macht Extraktionsfehlerraten und Pflegekosten für das Team nachvollziehbar dokumentiert. **Chief** positioniert GraphRAG als Erweiterung mit signifikanten Zusatzkosten, die nur bei nachgewiesenem Bedarf gerechtfertigt ist, nicht als generelle RAG-Verbesserung.

Anti-Patterns: GraphRAG pauschal als Verbesserung ohne Prüfung des tatsächlichen Beziehungsabfragebedarfs einsetzen; automatische Extraktion ohne Behandlung mehrdeutiger Entitätsbezüge betreiben; den Pflegeaufwand für Graphaktualisierung unterschätzen und den Graphen veralten lassen.

## Production Checklist

- [ ] Der Bedarf an Beziehungsabfragen ist mit konkreten Beispielanfragen belegt.
- [ ] Mehrdeutige Entitätsbezüge werden bei der Extraktion erkannt oder markiert.
- [ ] Der Pflegeaufwand für Graphaktualisierung ist explizit gegen einfaches RAG kalkuliert.
- [ ] Lokale und globale Suchanfragen werden mit unterschiedlichen, angepassten Mechanismen behandelt.

## Interviewfragen

### 1. Was ist der zentrale Unterschied zwischen GraphRAG und einfachem RAG?

**Antwort:** GraphRAG modelliert explizite Beziehungen zwischen Entitäten in einem Wissensgraphen, was Beziehungsabfragen ermöglicht, die einfaches, rein textähnlichkeitsbasiertes RAG oft nicht zuverlässig beantworten kann.

### 2. Warum ist die automatische Graphextraktion ein spezifisches Risiko bei GraphRAG?

**Antwort:** Der Wissensgraph wird typischerweise automatisch aus Text extrahiert; bei mehrdeutigen Entitätsbezügen kann diese Extraktion fehlerhafte Beziehungen erzeugen, die sich auf alle nachfolgenden Beziehungsabfragen auswirken.

### 3. Was ist der Unterschied zwischen lokaler und globaler Suche in GraphRAG?

**Antwort:** Lokale Suche beantwortet spezifische Fragen über einzelne Entitäten und deren direkte Beziehungen; globale Suche nutzt Zusammenfassung über größere Teile des Graphen für übergreifende, thematische Fragen.

### 4. Warum sind die Pflegekosten von GraphRAG höher als bei einfachem RAG?

**Antwort:** Änderungen am zugrunde liegenden Textbestand erfordern eine Aktualisierung des Graphen, was aufwendiger ist als eine einfache Re-Indexierung von Embeddings bei reinem RAG.

### 5. Wie diagnostizierst du eine falsche Beziehungsantwort in einem GraphRAG-System?

**Antwort:** Ich prüfe, ob die betroffenen Entitäten bei der automatischen Extraktion eindeutig oder mehrdeutig identifizierbar waren — eine mehrdeutige Extraktion ist die wahrscheinlichste Ursache für eine falsche Beziehungszuordnung.

### 6. Widersprüchliche Anforderung: Team will GraphRAG für maximale Antwortfähigkeit bei allen Anfragetypen einführen UND garantiert minimale zusätzliche Extraktions- und Pflegekosten gegenüber einfachem RAG — wie gehst du vor?

**Antwort:** Ich würde erklären, dass GraphRAG signifikante Zusatzkosten erzeugt, die nur für tatsächliche Beziehungsabfragen gerechtfertigt sind; ich würde vorschlagen, konkret zu prüfen, welcher Anteil der tatsächlichen Nutzeranfragen von Beziehungsabfragen profitiert, und GraphRAG nur für diesen spezifischen Anteil einzusetzen, statt es pauschal für den gesamten Wissensbestand zu implementieren.

## Praktische Labs

~~~python
# GraphRAG entity extraction with ambiguity detection
def extract_relationships(text, known_entities):
    relationships = []
    for entity_a in known_entities:
        for entity_b in known_entities:
            if entity_a != entity_b and entity_a in text and entity_b in text:
                relationships.append({"from": entity_a, "to": entity_b, "ambiguous": False})
    return relationships

def detect_ambiguous_entity(mention, entity_candidates):
    matches = [e for e in entity_candidates if mention.lower() in e.lower()]
    if len(matches) > 1:
        return {"mention": mention, "candidates": matches, "ambiguous": True}
    return {"mention": mention, "candidates": matches, "ambiguous": False}

text = "John Smith led the migration project with the Data Platform team."
known_entities = ["John Smith (Engineering)", "John Smith (Sales)", "Data Platform team"]

ambiguity_check = detect_ambiguous_entity("John Smith", known_entities)
print(f"Ambiguity check: {ambiguity_check}")

if ambiguity_check["ambiguous"]:
    print("WARNING: Extraction would create a relationship to an INCORRECTLY disambiguated entity without manual resolution.")
else:
    print("Entity unambiguous — safe to extract relationship.")
~~~

## Dependencies, Cross-References und Quellen

1. Edge et al.: [From Local to Global: A Graph RAG Approach to Query-Focused Summarization](https://arxiv.org/abs/2404.16130), abgerufen 2026-09-17.
2. Microsoft: [GraphRAG Project Documentation](https://microsoft.github.io/graphrag/), abgerufen 2026-09-17.
3. Neo4j: [Knowledge Graphs for RAG](https://neo4j.com/developer-blog/knowledge-graph-rag-application/), abgerufen 2026-09-17.

Hybrid Retrieval ist kanonisch in [KB-0311](07-hybrid-retrieval.md) behandelt; Zitationen und Provenienz in [KB-0317](13-zitationen-und-provenienz.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Konfidenzbewertung für extrahierte Graphbeziehungen, die unsichere Extraktionen markiert statt sie als sicher zu behandeln | Emerging | Beobachten; würde Extraktionsfehlerrisiko reduzieren, aber noch nicht breit produktionsreif etabliert. |
| Inkrementelle Graphaktualisierung, die nur geänderte Textabschnitte neu extrahiert statt den gesamten Graphen neu aufzubauen | Adopting | Gegenüber vollständiger Neuextraktion für geringeren Pflegeaufwand bevorzugen. |

Ein Team akzeptiert eine GraphRAG-Architektur erst, wenn der Beziehungsabfragebedarf belegt und Extraktionsfehlerrisiko sowie Pflegekosten gegenüber einfachem RAG dokumentiert sind.
