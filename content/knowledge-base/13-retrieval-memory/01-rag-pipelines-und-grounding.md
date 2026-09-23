---
{"id": "KB-0305", "title": "RAG-Pipelines und Grounding", "domain": "13", "sequence": 1, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0245", "concepts": ["Context Engineering"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine minimale RAG-Pipeline implementieren, die eine Antwort mit Belegstellen versieht und bei fehlender Deckung durch Retrieval-Ergebnisse explizit auf Abstention statt Halluzination setzt.", "rationale": "Der Unterschied zwischen belegter Antwort und Abstention wird erst durch konkrete Implementierung einer Grounding-Prüfung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine RAG-Pipeline gestalten, die Wissenslücken (keine relevanten Retrieval-Ergebnisse) explizit als überprüfbares Grounding-Ziel behandelt, statt sie durch eine plausible, aber unbelegte Antwort zu verschleiern.", "rationale": "Eine RAG-Pipeline, die bei Wissenslücken dennoch eine Antwort generiert, untergräbt den eigentlichen Zweck von Grounding."}, "STAFF-TARGET": {"active": true, "scope": "Eine unbelegte, aber plausible Antwort auf eine fehlende Abstention-Logik bei unzureichender Retrieval-Abdeckung statt auf ein allgemeines Modellproblem zurückführen können.", "rationale": "Ein Sprachmodell kann auch bei unzureichenden Retrieval-Ergebnissen eine plausible Antwort generieren; ohne explizite Abstention-Logik wird dieser Fall nicht abgefangen."}, "CHIEF-TARGET": {"active": true, "scope": "Grounding als überprüfbares, aber nicht absolutes Ziel positionieren — eine belegte Antwort ist nachvollziehbarer, aber Grounding allein garantiert keine faktische Richtigkeit der zugrunde liegenden Quellen.", "rationale": "Grounding reduziert das Risiko unbelegter Behauptungen, ersetzt aber nicht die Notwendigkeit, die Qualität und Aktualität der zugrunde liegenden Wissensquellen selbst zu sichern."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Retrieval-Algorithmen (Embedding-Modelle, Reranking) sind Vertiefung.", "rationale": "Kern ist das Prinzip von Grounding, Wissenslücken-Erkennung und Abstention, nicht die konkrete Retrieval-Technologie."}}, "lab_validation": [{"lab_id": "KB-0305-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell einer RAG-Pipeline mit Grounding-Prüfung und expliziter Abstention bei unzureichender Retrieval-Abdeckung", "evidence": "Eine Anfrage ohne ausreichend relevante Retrieval-Ergebnisse löst eine explizite Abstention-Antwort aus, statt eine unbelegte, aber plausible Antwort zu generieren; eine Anfrage mit ausreichender Abdeckung liefert eine mit Quellenverweisen belegte Antwort.", "limitations": "Kein echtes Retrieval-System, kein echtes Sprachmodell, kein produktives System."}]}
---
# RAG-Pipelines und Grounding

> **Ziel:** Eine RAG-Pipeline (Retrieval-Augmented Generation) verbindet Ingestion (Aufbereitung von Wissensquellen), Retrieval (Auffinden relevanter Inhalte) und Generierung (Antworterstellung durch ein Sprachmodell), aufbauend auf Context Engineering (siehe [KB-0245](../11-genai-architecture/05-context-engineering.md)). Belegte Antworten (mit nachvollziehbaren Quellenverweisen), erkannte Wissenslücken (keine relevanten Retrieval-Ergebnisse) und Abstention (explizite Verweigerung einer Antwort bei unzureichender Deckung) sind überprüfbare Grounding-Ziele — Grounding ist dabei keine pauschale Wahrheitsgarantie, sondern reduziert das Risiko unbelegter Behauptungen.

## Zweck, Mental Model und Dependencies

Ingestion bereitet Wissensquellen für die spätere Suche auf (z. B. durch Chunking und Embedding-Erzeugung). Retrieval sucht zu einer konkreten Anfrage die relevantesten aufbereiteten Inhalte aus dem Wissensbestand. Generierung nutzt diese gefundenen Inhalte als Kontext (siehe Context Engineering, [KB-0245](../11-genai-architecture/05-context-engineering.md)) für ein Sprachmodell, das daraus eine Antwort formuliert. Grounding bedeutet, dass die generierte Antwort tatsächlich durch die gefundenen Inhalte gestützt wird — eine belegte Antwort verweist explizit auf die konkreten Quellenstellen, aus denen die Information stammt, statt eine allgemeine, nicht zurückverfolgbare Aussage zu treffen. Der zentrale, oft übersehene Punkt ist, dass Grounding zwei unterschiedliche Fehlermodi adressieren muss: Erstens muss eine Wissenslücke (keine relevanten Retrieval-Ergebnisse zu einer Anfrage) explizit erkannt werden, statt dass das Sprachmodell trotzdem eine plausible, aber unbelegte Antwort generiert (Halluzination). Zweitens muss bei erkannter Wissenslücke eine explizite Abstention erfolgen — die Pipeline antwortet ausdrücklich, dass keine ausreichende Information vorliegt, statt zu raten. Grounding ist dabei ausdrücklich keine pauschale Wahrheitsgarantie: selbst eine korrekt belegte Antwort kann falsch sein, wenn die zugrunde liegende Quelle selbst fehlerhaft oder veraltet ist — Grounding reduziert das Risiko unbelegter Behauptungen, ersetzt aber nicht die Notwendigkeit, die Qualität der Wissensquellen selbst zu sichern.

~~~text
Ingestion: prepare knowledge sources for search (chunking, embeddings)
Retrieval: find MOST RELEVANT prepared content for a specific query
Generation: LLM formulates answer USING retrieved content as context (KB-0245)
Grounding: answer is actually SUPPORTED by retrieved content -> explicit source references, traceable
TWO failure modes to address:
  Knowledge gap: no relevant retrieval results -> LLM should NOT generate a plausible-but-unsupported answer
  Abstention: on detected gap, EXPLICITLY state insufficient information, don't guess
Grounding != absolute truth guarantee: a correctly-grounded answer can still be WRONG if the source itself is wrong/stale
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Explizite Quellenverweise in der Antwort | verweist jede generierte Antwort nachvollziehbar auf die konkreten Retrieval-Ergebnisse, aus denen sie stammt? | eine Antwort ohne Quellenverweise lässt sich nicht auf ihre tatsächliche Grundlage zurückführen |
| Wissenslücken-Erkennung vor Generierung | wird geprüft, ob die Retrieval-Ergebnisse tatsächlich ausreichende Relevanz und Abdeckung für die Anfrage bieten, bevor generiert wird? | ohne diese Prüfung kann das Modell trotz unzureichender Grundlage eine plausible, aber unbelegte Antwort generieren |
| Explizite Abstention bei unzureichender Deckung | antwortet die Pipeline bei erkannter Wissenslücke ausdrücklich mit einer Abstention statt mit einer geratenen Antwort? | eine fehlende Abstention-Logik kann zu einer überzeugend klingenden, aber sachlich unbelegten Antwort führen |
| Trennung von Grounding und faktischer Richtigkeit | wird kommuniziert, dass Grounding die Nachvollziehbarkeit, nicht die absolute Richtigkeit der Antwort garantiert? | eine Verwechslung von Grounding mit Wahrheitsgarantie kann zu blindem Vertrauen in belegte, aber inhaltlich falsche Antworten führen |

Implementierung: Jede generierte Antwort wird mit expliziten Verweisen auf die konkreten Retrieval-Ergebnisse versehen, aus denen die jeweilige Aussage stammt. Vor der Generierung wird geprüft, ob die Retrieval-Ergebnisse eine ausreichende Relevanzschwelle für die gestellte Anfrage erreichen; wird diese Schwelle nicht erreicht, wird eine explizite Wissenslücke erkannt. Bei erkannter Wissenslücke antwortet die Pipeline mit einer expliziten Abstention-Formulierung, statt das Sprachmodell ohne ausreichende Grundlage generieren zu lassen. Die Kommunikation an Nutzer macht explizit deutlich, dass eine belegte Antwort nachvollziehbar, aber nicht automatisch faktisch korrekt ist, da die Richtigkeit von der Qualität der zugrunde liegenden Quelle abhängt.

## Scalability, Reliability, Security und Observability

RAG-Pipelines skalieren die Nachvollziehbarkeit generierter Antworten proportional zur Konsequenz der Grounding-Prüfung; die Reliability-Grenze liegt in einer fehlenden Wissenslücken-Erkennung, die mit wachsendem Anfragevolumen proportional mehr unbelegte, aber plausibel klingende Antworten erzeugen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Antwort klingt plausibel, verweist aber auf keine oder irrelevante Quellenstellen | fehlende oder unzureichende Wissenslücken-Erkennung vor der Generierung | prüfen, ob die Retrieval-Ergebnisse für die betroffene Anfrage tatsächlich eine ausreichende Relevanzschwelle erreicht hatten |
| die Pipeline generiert bei fehlender relevanter Information dennoch eine konkrete Antwort statt einer Abstention | fehlende explizite Abstention-Logik bei erkannter Wissenslücke | prüfen, ob eine explizite Abstention-Formulierung für den betroffenen Fall implementiert und ausgelöst wurde |
| eine korrekt belegte Antwort erweist sich inhaltlich als falsch | die zugrunde liegende Quelle selbst war fehlerhaft oder veraltet | prüfen, ob die referenzierte Quelle zum Antwortzeitpunkt aktuell und korrekt war, unabhängig von der Grounding-Korrektheit |

Security: Eine RAG-Pipeline, die vertrauliche oder zugriffsbeschränkte Wissensquellen einbindet, benötigt Zugriffskontrolle auf Retrieval-Ebene, damit Retrieval-Ergebnisse nicht Informationen preisgeben, auf die der anfragende Nutzer keinen Zugriff haben sollte. Observability: Anteil abstinenter gegenüber generierter Antworten, durchschnittliche Relevanzbewertung der genutzten Retrieval-Ergebnisse und Häufigkeit von Antworten ohne nachvollziehbare Quellenverweise sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert für jede RAG-Pipeline eine explizite Wissenslücken-Erkennung mit Abstention-Logik. **Principal** macht Quellenverweise und Relevanzschwellen für das Team nachvollziehbar dokumentiert. **Chief** positioniert Grounding als überprüfbares, aber nicht absolutes Ziel, das Nachvollziehbarkeit, nicht faktische Wahrheit garantiert.

Anti-Patterns: eine RAG-Pipeline ohne Wissenslücken-Erkennung betreiben, die bei jeder Anfrage eine Antwort erzwingt; Grounding als absolute Wahrheitsgarantie kommunizieren; Quellenverweise in generierten Antworten weglassen oder nicht nachvollziehbar gestalten.

## Production Checklist

- [ ] Jede generierte Antwort enthält explizite, nachvollziehbare Quellenverweise.
- [ ] Eine Wissenslücken-Erkennung prüft die Relevanz der Retrieval-Ergebnisse vor der Generierung.
- [ ] Bei erkannter Wissenslücke erfolgt eine explizite Abstention statt einer geratenen Antwort.
- [ ] Grounding wird als Nachvollziehbarkeits-, nicht als Wahrheitsgarantie kommuniziert.

## Interviewfragen

### 1. Was bedeutet Grounding in einer RAG-Pipeline?

**Antwort:** Die generierte Antwort wird tatsächlich durch die gefundenen Retrieval-Ergebnisse gestützt und verweist explizit auf die konkreten Quellenstellen, aus denen die Information stammt.

### 2. Warum ist Grounding keine pauschale Wahrheitsgarantie?

**Antwort:** Selbst eine korrekt belegte Antwort kann inhaltlich falsch sein, wenn die zugrunde liegende Quelle selbst fehlerhaft oder veraltet ist; Grounding sichert Nachvollziehbarkeit, nicht faktische Richtigkeit.

### 3. Warum ist explizite Abstention bei erkannter Wissenslücke wichtig?

**Antwort:** Ohne Abstention-Logik kann ein Sprachmodell trotz unzureichender Grundlage eine plausible, aber unbelegte Antwort generieren (Halluzination); Abstention macht die fehlende Informationsgrundlage stattdessen explizit.

### 4. Wie wird eine Wissenslücke in einer RAG-Pipeline erkannt?

**Antwort:** Durch Prüfung, ob die Retrieval-Ergebnisse eine ausreichende Relevanzschwelle für die gestellte Anfrage erreichen; wird diese Schwelle nicht erreicht, liegt eine Wissenslücke vor.

### 5. Wie diagnostizierst du eine plausibel klingende, aber unbelegte Antwort?

**Antwort:** Ich prüfe, ob die Antwort auf tatsächlich relevante Retrieval-Ergebnisse verweist oder ob die Wissenslücken-Erkennung fehlte, sodass das Modell trotz unzureichender Grundlage generiert hat.

### 6. Widersprüchliche Anforderung: Team will maximale Antwortrate (möglichst immer eine konkrete Antwort liefern) UND garantiert keine unbelegten oder halluzinierten Aussagen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass diese Ziele sich direkt widersprechen, wenn für jede Anfrage eine konkrete Antwort erzwungen wird; ich würde vorschlagen, Abstention als legitime, transparente Antwortoption zu positionieren und die Antwortrate anhand tatsächlich belegter Antworten statt anhand der Gesamtzahl generierter Antworten zu messen, um den Anreiz für unbelegte Antworten zu beseitigen.

## Praktische Labs

~~~python
# RAG pipeline with knowledge-gap detection and explicit abstention
def retrieve(query, knowledge_base, relevance_threshold=0.5):
    results = [(doc, score) for doc, score in knowledge_base if score >= relevance_threshold]
    return results

def generate_with_grounding(query, knowledge_base):
    results = retrieve(query, knowledge_base)
    if not results:
        return "I don't have sufficient grounded information to answer this reliably (abstaining)."
    sources = ", ".join(doc for doc, _ in results)
    return f"Based on sources [{sources}]: answer grounded in retrieved content."

knowledge_base = [("doc_pricing_2026.pdf", 0.82), ("doc_unrelated_topic.pdf", 0.12)]

print(generate_with_grounding("What is the current pricing?", knowledge_base))
print(generate_with_grounding("What is the CEO's home address?", knowledge_base))
~~~

## Dependencies, Cross-References und Quellen

1. Lewis et al.: [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401), abgerufen 2026-09-17.
2. Anthropic: [Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval), abgerufen 2026-09-17.
3. OWASP: [OWASP Top 10 for LLM Applications — Misinformation](https://genai.owasp.org/llmrisk/llm09-misinformation/), abgerufen 2026-09-17.

Context Engineering ist kanonisch in [KB-0245](../11-genai-architecture/05-context-engineering.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Hybride Retrieval-Ansätze (dichte Embeddings kombiniert mit Keyword-Suche) für robustere Relevanzbewertung | Adopting | Gegenüber reinem Embedding-basiertem Retrieval für bessere Abdeckung unterschiedlicher Anfragetypen bevorzugen. |
| Automatisierte Claim-Prüfung, die jede generierte Aussage einzeln gegen die Retrieval-Quellen validiert (Validation-Repair-Muster) | Adopting | Gegenüber pauschaler Quellenangabe für granularere Grounding-Sicherheit bevorzugen. |

Ein Team akzeptiert eine RAG-Pipeline erst, wenn Wissenslücken-Erkennung, explizite Abstention und nachvollziehbare Quellenverweise dokumentiert und getestet sind.
