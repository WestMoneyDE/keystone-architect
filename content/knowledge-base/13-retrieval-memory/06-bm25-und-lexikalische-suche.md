---
{"id": "KB-0310", "title": "BM25 und lexikalische Suche", "domain": "13", "sequence": 6, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0308", "concepts": ["Semantische Suche"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine BM25-basierte Suche implementieren und anhand einer Anfrage mit Eigennamen oder Codes gegen eine rein semantische Suche vergleichen.", "rationale": "Die Stärke lexikalischer Suche bei exakten Begriffen wird erst durch konkreten Vergleich mit semantischer Suche greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Entscheiden, wann lexikalische Suche gegenüber semantischer Suche (siehe KB-0308) für einen konkreten Anfragetyp vorzuziehen ist, statt sich ausschließlich auf Embeddings zu verlassen.", "rationale": "Semantische Suche kann bei exakten Begriffen wie Eigennamen, Produktcodes oder seltenen Fachbegriffen schlechter abschneiden als lexikalische Suche."}, "STAFF-TARGET": {"active": true, "scope": "Eine fehlgeschlagene Suche nach einem exakten Begriff (Eigenname, Code) auf eine rein semantische, nicht lexikalisch ergänzte Suche statt auf ein allgemeines Retrieval-Problem zurückführen können.", "rationale": "Ein Embedding-Modell kann seltene oder spezifische Begriffe wie Eigennamen oder Codes schlechter repräsentieren als häufige, semantisch reichhaltige Begriffe."}, "CHIEF-TARGET": {"active": true, "scope": "Hybride Suche (lexikalisch plus semantisch) als robuste Standardarchitektur positionieren, statt sich ausschließlich auf eine der beiden Methoden zu verlassen.", "rationale": "Lexikalische und semantische Suche haben komplementäre Stärken; eine rein semantische Architektur kann bei bestimmten Anfragetypen strukturell unterlegen sein."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete BM25-Parametertuning-Details (k1, b) sind Vertiefung.", "rationale": "Kern ist das Prinzip der Termgewichtung und die komplementäre Stärke bei exakten Begriffen, nicht die Feinabstimmung der Formel-Parameter."}}, "lab_validation": [{"lab_id": "KB-0310-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell einer BM25-Suche im Vergleich zu einer simulierten semantischen Suche für eine Anfrage mit einem spezifischen Produktcode", "evidence": "Eine Anfrage nach einem exakten Produktcode wird durch BM25 korrekt anhand exakter Termübereinstimmung gefunden, während eine simulierte semantische Suche aufgrund geringer semantischer Repräsentation des seltenen Codes das relevante Dokument niedriger einstuft.", "limitations": "Kein echtes Embedding-Modell, keine echte Produktionssuche, kein produktives System."}]}
---
# BM25 und lexikalische Suche

> **Ziel:** BM25 ist ein lexikalisches Suchverfahren, das Termgewichtung (wie wichtig ist ein Begriff für ein Dokument) und Dokumentlänge (Normalisierung gegen unterschiedlich lange Dokumente) nutzt, um exakte Begriffsübereinstimmungen zu bewerten. Im Gegensatz zu semantischer Suche (siehe [KB-0308](04-semantische-suche.md)), die auf konzeptueller Ähnlichkeit basiert, ist lexikalische Suche besonders stark bei Eigennamen, Codes und seltenen Begriffen, die von Embedding-Modellen oft schlechter repräsentiert werden.

## Zweck, Mental Model und Dependencies

BM25 (Best Matching 25) berechnet für eine Anfrage und ein Dokument einen Relevanzwert basierend auf Termhäufigkeit (wie oft kommt ein Anfrageterm im Dokument vor), inverser Dokumenthäufigkeit (wie selten ist der Term im gesamten Wissensbestand — seltene Terme erhalten höheres Gewicht) und Dokumentlängen-Normalisierung (ein Term in einem kurzen Dokument zählt relativ stärker als derselbe Term in einem sehr langen Dokument). Tokenisierung bei lexikalischer Suche bedeutet typischerweise eine einfachere, oft wortbasierte Zerlegung als bei Sprachmodellen, wobei exakte Übereinstimmung (oder einfache Normalisierungen wie Kleinschreibung, Stemming) im Vordergrund steht. Der zentrale, oft übersehene Vorteil lexikalischer Suche liegt bei Eigennamen (z. B. Produktnamen, Personennamen), Codes (z. B. Fehlercode "ERR-4021", Produktnummer "SKU-88213") und seltenen Fachbegriffen: ein Embedding-Modell repräsentiert solche seltenen, spezifischen Token oft schlechter im Vektorraum als häufige, semantisch reichhaltige Wörter, da das Modell während des Trainings weniger Kontext für diese seltenen Token gesehen hat — eine semantische Suche kann daher bei einer exakten Codeanfrage das relevante Dokument niedriger einstufen als ein Dokument, das nur thematisch ähnlich ist. BM25 hingegen findet die exakte Übereinstimmung eines Codes oder Eigennamens zuverlässig, unabhängig von dessen semantischer Häufigkeit im Trainingskorpus des Embedding-Modells.

~~~text
BM25: relevance score from term frequency + inverse document frequency (rare terms weighted higher) + length normalization
Lexical tokenization: typically simpler, word-based, focuses on EXACT match (with light normalization: case, stemming)
KEY STRENGTH: proper nouns, codes ("ERR-4021", "SKU-88213"), rare technical terms
  -> embedding models often represent RARE/specific tokens POORLY (less training context)
  -> semantic search can rank exact-code match LOWER than a merely thematically-similar doc
BM25 finds EXACT match reliably, regardless of the term's semantic frequency in the embedding model's training corpus
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Termgewichtung nach Seltenheit | werden seltene, spezifische Begriffe (Codes, Eigennamen) bei der Relevanzbewertung höher gewichtet als häufige Begriffe? | ohne diese Gewichtung können generische, häufige Begriffe seltene, aber tatsächlich entscheidende Begriffe überdecken |
| Dokumentlängen-Normalisierung | wird die Dokumentlänge bei der Relevanzbewertung berücksichtigt, um unfaire Bevorzugung sehr langer oder kurzer Dokumente zu vermeiden? | ohne Normalisierung können sehr lange Dokumente allein durch mehr Wortvorkommen künstlich höher bewertet werden |
| Erkennung von exakten-Match-Anfragetypen | wird erkannt, wenn eine Anfrage einen Eigennamen, Code oder seltenen Fachbegriff enthält, der von lexikalischer Suche besser bedient wird? | ohne diese Erkennung kann eine rein semantische Suche bei exakten Begriffen strukturell unterlegen sein |
| Komplementäre statt exklusive Nutzung | wird lexikalische Suche als Ergänzung zu, statt als Ersatz für semantische Suche eingesetzt? | eine ausschließlich lexikalische oder ausschließlich semantische Architektur verliert jeweils die komplementäre Stärke der anderen Methode |

Implementierung: Eine BM25-Implementierung berechnet für jede Anfrage-Dokument-Kombination einen Relevanzwert basierend auf Termhäufigkeit, inverser Dokumenthäufigkeit und Dokumentlängen-Normalisierung. Anfragen werden, wo möglich, auf Muster geprüft, die auf Eigennamen, Codes oder seltene Fachbegriffe hindeuten (z. B. alphanumerische Muster, Großschreibungsmuster), um lexikalische Suche gezielt für diese Fälle zu stärken. Lexikalische und semantische Suche werden komplementär kombiniert (siehe hybride Ansätze), statt eine der beiden Methoden vollständig zu ersetzen — jede Methode deckt Schwächen der anderen ab.

## Scalability, Reliability, Security und Observability

Lexikalische Suche skaliert exakte Begriffsauffindbarkeit unabhängig von der semantischen Häufigkeit eines Begriffs im Trainingskorpus eines Embedding-Modells; die Reliability-Grenze liegt in einer ausschließlich semantischen Architektur, die bei Anfragen mit Eigennamen, Codes oder seltenen Begriffen proportional zur Seltenheit dieser Begriffe schlechtere Ergebnisse liefern kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Anfrage nach einem spezifischen Produktcode oder Fehlercode findet das relevante Dokument nicht oder stuft es niedrig ein | die Suche basiert ausschließlich auf semantischer Ähnlichkeit ohne lexikalische Ergänzung | prüfen, ob eine BM25-basierte oder vergleichbare lexikalische Suche für die betroffene Anfrage parallel eingesetzt wurde |
| Anfragen nach Eigennamen liefern thematisch verwandte, aber nicht exakt passende Dokumente | das Embedding-Modell repräsentiert den seltenen Eigennamen unzureichend im Vektorraum | prüfen, ob eine lexikalische Suche für die exakte Namensübereinstimmung ergänzend eingesetzt wurde |
| sehr lange Dokumente werden systematisch höher bewertet als kürzere, ebenso relevante Dokumente | fehlende oder unzureichende Dokumentlängen-Normalisierung in der Relevanzberechnung | prüfen, ob die verwendete Relevanzformel eine Längen-Normalisierungskomponente enthält |

Security: Lexikalische Suche unterliegt denselben Berechtigungsanforderungen wie semantische Suche (siehe [KB-0308](04-semantische-suche.md)) — eine Berechtigungsfilterung muss unabhängig von der Suchmethode (lexikalisch oder semantisch) konsequent durchgesetzt werden. Observability: Trefferquote für Anfragen mit Eigennamen/Codes im Vergleich zwischen lexikalischer und rein semantischer Suche, Verteilung von Anfragetypen (exakt vs. konzeptuell) und Beitrag jeder Methode zu den finalen hybriden Suchergebnissen sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** kombiniert lexikalische und semantische Suche komplementär, statt sich auf eine Methode zu beschränken. **Principal** macht die Erkennung exakter-Match-Anfragetypen für das Team nachvollziehbar dokumentiert. **Chief** positioniert hybride Suche als robuste Standardarchitektur, die die jeweiligen Schwächen einzelner Methoden ausgleicht.

Anti-Patterns: sich ausschließlich auf semantische Suche verlassen und lexikalische Suche für exakte Begriffe ignorieren; Dokumentlängen-Normalisierung bei der Relevanzberechnung vernachlässigen; lexikalische und semantische Suchergebnisse ohne durchdachte Kombinationsstrategie parallel anbieten.

## Production Checklist

- [ ] BM25 oder eine vergleichbare lexikalische Suche ergänzt die semantische Suche.
- [ ] Dokumentlängen-Normalisierung ist in der Relevanzberechnung implementiert.
- [ ] Anfragen mit Eigennamen, Codes oder seltenen Begriffen werden für lexikalische Suche erkannt.
- [ ] Lexikalische und semantische Ergebnisse werden über eine durchdachte Kombinationsstrategie zusammengeführt.

## Interviewfragen

### 1. Wie berechnet BM25 Relevanz?

**Antwort:** Basierend auf Termhäufigkeit im Dokument, inverser Dokumenthäufigkeit (seltene Terme werden höher gewichtet) und Dokumentlängen-Normalisierung, um unfaire Bevorzugung sehr langer Dokumente zu vermeiden.

### 2. Warum ist lexikalische Suche bei Eigennamen und Codes oft stärker als semantische Suche?

**Antwort:** Embedding-Modelle repräsentieren seltene, spezifische Token wie Eigennamen oder Codes oft schlechter im Vektorraum, da sie während des Trainings weniger Kontext dafür gesehen haben; BM25 findet die exakte Übereinstimmung unabhängig von dieser semantischen Repräsentation zuverlässig.

### 3. Warum sollte lexikalische Suche nicht als Ersatz, sondern als Ergänzung zu semantischer Suche eingesetzt werden?

**Antwort:** Beide Methoden haben komplementäre Stärken — semantische Suche erfasst konzeptuelle Ähnlichkeit, lexikalische Suche exakte Begriffsübereinstimmung; eine ausschließliche Nutzung einer Methode verliert die Stärke der anderen.

### 4. Warum ist Dokumentlängen-Normalisierung bei BM25 wichtig?

**Antwort:** Ohne sie könnten sehr lange Dokumente allein durch mehr Wortvorkommen künstlich höher bewertet werden als kürzere, ebenso relevante Dokumente.

### 5. Wie diagnostizierst du eine fehlgeschlagene Suche nach einem exakten Produktcode?

**Antwort:** Ich prüfe, ob eine lexikalische Suche parallel zur semantischen Suche eingesetzt wurde — fehlt sie, ist die unzureichende semantische Repräsentation des seltenen Codes die wahrscheinlichste Ursache.

### 6. Widersprüchliche Anforderung: Team will ausschließlich semantische Suche für konzeptuelle Flexibilität ohne zusätzlichen Implementierungsaufwand für lexikalische Suche UND garantiert zuverlässige Ergebnisse bei exakten Codes und Eigennamen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass diese Ziele sich strukturell widersprechen, da semantische Suche bei seltenen, exakten Begriffen nachweislich schwächer ist; ich würde vorschlagen, eine leichtgewichtige lexikalische Ergänzung (z. B. eine einfache BM25-Implementierung) nur für erkannte exakte-Match-Anfragemuster einzusetzen, um den zusätzlichen Aufwand zu minimieren, ohne auf Zuverlässigkeit bei diesen Anfragetypen zu verzichten.

## Praktische Labs

~~~python
# BM25-inspired lexical scoring vs simulated poor semantic representation for rare terms
import math

documents = {
    "doc1": "General troubleshooting guide for network issues.",
    "doc2": "Error code ERR-4021 occurs when the API gateway times out.",
    "doc3": "Overview of common API gateway configuration options.",
}

def simple_bm25_score(query_term, doc_text, all_docs, k1=1.5, b=0.75):
    doc_terms = doc_text.lower().split()
    term_freq = doc_terms.count(query_term.lower())
    doc_len = len(doc_terms)
    avg_len = sum(len(d.split()) for d in all_docs.values()) / len(all_docs)
    docs_with_term = sum(1 for d in all_docs.values() if query_term.lower() in d.lower())
    idf = math.log((len(all_docs) - docs_with_term + 0.5) / (docs_with_term + 0.5) + 1)
    score = idf * (term_freq * (k1 + 1)) / (term_freq + k1 * (1 - b + b * doc_len / avg_len))
    return score

query = "ERR-4021"
print(f"BM25 lexical scores for exact code query '{query}':")
for doc_id, text in documents.items():
    score = simple_bm25_score(query, text, documents)
    print(f"  {doc_id}: {score:.3f}")

simulated_semantic_scores = {"doc1": 0.55, "doc2": 0.42, "doc3": 0.51}  # rare code poorly represented in embedding space
print(f"\nSimulated semantic scores (rare code underrepresented): {simulated_semantic_scores}")
print("BM25 correctly ranks doc2 highest via exact match; semantic search alone would misrank it.")
~~~

## Dependencies, Cross-References und Quellen

1. Robertson, Zaragoza: [The Probabilistic Relevance Framework: BM25 and Beyond](https://www.staff.city.ac.uk/~sbrp622/papers/foundations_bm25_review.pdf), abgerufen 2026-09-17.
2. Elastic: [Practical BM25 — Part 1: How Shards Affect Relevance Scoring](https://www.elastic.co/blog/practical-bm25-part-1-how-shards-affect-relevance-scoring-in-elasticsearch), abgerufen 2026-09-17.
3. Pinecone: [Hybrid Search — Combining Lexical and Semantic Retrieval](https://www.pinecone.io/learn/hybrid-search-intro/), abgerufen 2026-09-17.

Semantische Suche ist kanonisch in [KB-0308](04-semantische-suche.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Sparse-Vektor-Modelle (z. B. SPLADE), die lexikalische Präzision mit gelernten Term-Gewichtungen kombinieren | Adopting | Gegenüber reinem BM25 für verbesserte semantische Sensitivität bei weiterhin exakter Begriffsauffindbarkeit bevorzugen. |
| Reciprocal-Rank-Fusion zur automatischen Kombination lexikalischer und semantischer Ranglisten ohne manuelles Gewichtungstuning | Adopting | Gegenüber manueller Score-Gewichtung für robustere, wartungsärmere Hybrid-Suche bevorzugen. |

Ein Team akzeptiert eine Retrieval-Architektur mit lexikalischer Suche erst, wenn die komplementäre Kombination mit semantischer Suche für exakte-Match-Anfragetypen dokumentiert und getestet ist.
