---
{"id": "KB-0315", "title": "Retrieval-Evaluation", "domain": "13", "sequence": 11, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0314", "concepts": ["Reranking und Kandidatenauswahl"], "needed_for": "understanding"}], "related": ["KB-0305"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Recall, Precision, MRR und nDCG für ein Testset mit bekannter Relevanz implementieren und deren unterschiedliche Aussagekraft anhand desselben Retrieval-Ergebnisses demonstrieren.", "rationale": "Der Unterschied zwischen diesen Metriken wird erst durch konkrete parallele Berechnung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein Evaluationsset gestalten, das repräsentative Anfragen, harte Negativbeispiele und Berechtigungsfehler als getrennte Testkategorien statt als vermischte Gesamtmenge behandelt.", "rationale": "Eine vermischte Evaluation kann spezifische Schwächen (z. B. bei harten Negativbeispielen oder Berechtigungsfehlern) hinter einem insgesamt akzeptablen Durchschnittswert verbergen."}, "STAFF-TARGET": {"active": true, "scope": "Eine trotz guter Durchschnittsmetriken bestehende, unentdeckte Schwäche bei Berechtigungsfehlern oder harten Negativbeispielen auf eine unzureichend getrennte Evaluation statt auf ein allgemeines Qualitätsproblem zurückführen können.", "rationale": "Ein insgesamt guter Recall- oder Precision-Wert kann eine kleine, aber sicherheitskritische Kategorie von Berechtigungsfehlern statistisch überdecken, wenn diese nicht getrennt gemessen wird."}, "CHIEF-TARGET": {"active": true, "scope": "Retrieval-Evaluation als mehrdimensionale, nach Testkategorien getrennte Messung positionieren, nicht als einzelne aggregierte Qualitätskennzahl.", "rationale": "Eine einzelne aggregierte Kennzahl kann kritische, aber statistisch seltene Fehlerkategorien wie Berechtigungsfehler verbergen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Implementierungsdetails der nDCG-Diskontierungsfunktion sind Vertiefung.", "rationale": "Kern ist die getrennte Messung nach Testkategorien, nicht die konkrete mathematische Formulierung jeder Metrik."}}, "lab_validation": [{"lab_id": "KB-0315-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell von Recall, Precision, MRR und nDCG mit getrennter Auswertung nach repräsentativen Anfragen, harten Negativbeispielen und Berechtigungsfehlern", "evidence": "Ein insgesamt guter Recall-Durchschnittswert über alle Anfragen verbirgt eine deutlich schlechtere Trefferquote speziell bei harten Negativbeispielen, die erst durch getrennte Kategoriemessung sichtbar wird.", "limitations": "Kein echtes Retrieval-System, kein produktives System, kein reales Evaluationsset."}]}
---
# Retrieval-Evaluation

> **Ziel:** Recall, Precision, MRR (Mean Reciprocal Rank) und nDCG (Normalized Discounted Cumulative Gain) messen unterschiedliche Aspekte der Retrieval-Qualität nach Reranking (siehe [KB-0314](10-reranking-und-kandidatenauswahl.md)). Der zentrale Punkt ist, repräsentative Querysets, harte Negativbeispiele und Berechtigungsfehler als getrennte Testkategorien zu messen, statt sie in einer einzigen aggregierten Kennzahl zu vermischen — eine gute Durchschnittsmetrik kann kritische, aber statistisch seltene Schwächen (insbesondere bei Berechtigungsfehlern) verbergen.

## Zweck, Mental Model und Dependencies

Recall misst, welcher Anteil der tatsächlich relevanten Dokumente im Gesamtbestand tatsächlich in den zurückgegebenen Ergebnissen enthalten ist — ein hoher Recall bedeutet, dass wenige relevante Dokumente übersehen wurden. Precision misst, welcher Anteil der zurückgegebenen Ergebnisse tatsächlich relevant ist — eine hohe Precision bedeutet, dass wenige irrelevante Ergebnisse enthalten sind. MRR bewertet, an welcher Position das erste relevante Ergebnis in der Rangliste erscheint, gemittelt über viele Anfragen — dies ist besonders relevant, wenn Nutzer typischerweise nur das erste Ergebnis prüfen. nDCG berücksichtigt zusätzlich Abstufungen der Relevanz (nicht nur relevant/irrelevant, sondern z. B. hoch/mittel/gering relevant) und gewichtet höher platzierte Ergebnisse stärker als niedriger platzierte. Der zentrale, oft übersehene Punkt bei der praktischen Anwendung dieser Metriken ist, dass eine einzige aggregierte Kennzahl über ein gemischtes Anfrageset kritische Schwächen in spezifischen Kategorien verbergen kann: ein insgesamt guter durchschnittlicher Recall-Wert kann eine deutlich schlechtere Leistung speziell bei harten Negativbeispielen (siehe [KB-0314](10-reranking-und-kandidatenauswahl.md)) oder — sicherheitskritisch — bei Anfragen mit Berechtigungsfehlern (Ergebnisse, die eigentlich gefiltert werden sollten) statistisch überdecken, wenn diese Fälle nicht als eigene, getrennt ausgewiesene Testkategorie behandelt werden.

~~~text
Recall: fraction of ACTUALLY relevant docs that were returned (few relevant docs missed?)
Precision: fraction of RETURNED docs that are actually relevant (few irrelevant docs included?)
MRR: average position of the FIRST relevant result across many queries (matters when users check top result only)
nDCG: accounts for GRADED relevance + weights higher-ranked results more
CRITICAL: a single AGGREGATED metric across a mixed query set can HIDE critical category-specific weaknesses
  -> good average recall can mask much worse recall SPECIFICALLY on hard negatives or authorization-error cases
  -> MUST measure representative queries, hard negatives, and authorization errors as SEPARATE categories
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Getrennte Messung nach Testkategorien | werden repräsentative Anfragen, harte Negativbeispiele und Berechtigungsfehler als getrennte, individuell ausgewiesene Kategorien gemessen? | eine vermischte Gesamtmetrik kann kritische Schwächen in einer spezifischen, statistisch kleinen Kategorie verbergen |
| Passende Metrikwahl je nach Nutzungsszenario | wird die geeignete Metrik (Recall bei umfassenden Recherchen, MRR bei "erstes Ergebnis zählt"-Szenarien) für den jeweiligen Anwendungsfall gewählt? | eine unpassende Metrikwahl kann eine für den tatsächlichen Anwendungsfall irrelevante Qualitätsaussage liefern |
| Berücksichtigung abgestufter Relevanz | wird bei Bedarf nDCG statt einer binären Relevanzmetrik eingesetzt, wenn Relevanzgrade tatsächlich existieren? | eine rein binäre Bewertung kann feinere, aber tatsächlich relevante Qualitätsunterschiede zwischen Ergebnissen übersehen |
| Explizite Ausweisung von Berechtigungsfehler-Metriken | wird die Häufigkeit von Berechtigungsfehlern (nicht autorisierte Ergebnisse in der Rückgabe) als eigene, sicherheitskritische Metrik ausgewiesen? | eine fehlende getrennte Ausweisung kann Sicherheitsverletzungen hinter guten Qualitätsmetriken verbergen |

Implementierung: Ein Evaluationsset wird explizit in mindestens drei Kategorien unterteilt: repräsentative Anfragen (die typische Nutzungsmuster widerspiegeln), harte Negativbeispiele (oberflächlich ähnliche, aber inhaltlich falsche Dokumente, siehe [KB-0314](10-reranking-und-kandidatenauswahl.md)) und Berechtigungsfehler-Testfälle (Anfragen, bei denen bestimmte Ergebnisse aus Berechtigungsgründen ausdrücklich nicht erscheinen dürfen). Für jede Kategorie werden Recall, Precision, MRR und nDCG getrennt berechnet und ausgewiesen, statt sie zu einer Gesamtkennzahl zu aggregieren. Die Metrikwahl wird an das tatsächliche Nutzungsszenario angepasst (z. B. MRR für Szenarien, in denen Nutzer typischerweise nur das erste Ergebnis prüfen). Berechtigungsfehler werden als eigene, sicherheitskritische Metrik mit besonderer Aufmerksamkeit ausgewiesen, unabhängig davon, wie gut die übrigen Qualitätsmetriken ausfallen.

## Scalability, Reliability, Security und Observability

Retrieval-Evaluation skaliert die Fähigkeit, echte Qualitätsprobleme zu erkennen, proportional zur Granularität der Kategorietrennung; die Reliability-Grenze liegt in einer aggregierten Gesamtmetrik, die mit wachsender Diversität des Anfragesets proportional mehr kategoriespezifische Schwächen statistisch verbergen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| die Retrieval-Pipeline liefert trotz guter Durchschnittsmetriken gelegentlich nicht autorisierte Ergebnisse | Berechtigungsfehler wurden nicht als eigene Testkategorie getrennt ausgewiesen | prüfen, ob eine dedizierte Berechtigungsfehler-Metrik existiert und separat überwacht wird |
| die Pipeline schneidet bei bestimmten schwierigen Anfragen deutlich schlechter ab als der Durchschnitt vermuten lässt | harte Negativbeispiele wurden nicht als eigene Kategorie in der Evaluation berücksichtigt | prüfen, ob dedizierte Testfälle mit harten Negativbeispielen existieren und getrennt gemessen werden |
| eine gewählte Metrik (z. B. Recall) spiegelt die tatsächliche Nutzererfahrung nicht wider | die Metrikwahl passt nicht zum tatsächlichen Nutzungsszenario (z. B. Recall statt MRR bei "erstes Ergebnis zählt") | prüfen, ob die verwendete Metrik zum tatsächlichen Nutzungsmuster der Anwendung passt |

Security: Berechtigungsfehler-Metriken sind sicherheitskritisch und müssen unabhängig von allgemeinen Qualitätsmetriken überwacht werden — ein einziger unentdeckter Berechtigungsfehler kann eine Sicherheitsverletzung darstellen, selbst wenn die Gesamtqualitätsmetriken exzellent sind. Observability: Recall/Precision/MRR/nDCG getrennt nach Testkategorie (repräsentativ, hartes Negativbeispiel, Berechtigungsfehler), Trend dieser Metriken über Zeit und Häufigkeit erkannter Berechtigungsfehler im Testset sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** misst Recall, Precision, MRR und nDCG getrennt nach Testkategorie, nie ausschließlich aggregiert. **Principal** macht Berechtigungsfehler-Metriken für das Team als eigene, sicherheitskritische Kennzahl nachvollziehbar dokumentiert. **Chief** positioniert Retrieval-Evaluation als mehrdimensionale, kategorisierte Messung, nicht als einzelne aggregierte Qualitätskennzahl.

Anti-Patterns: Recall, Precision, MRR oder nDCG ausschließlich als aggregierte Gesamtkennzahl über ein gemischtes Anfrageset berichten; harte Negativbeispiele oder Berechtigungsfehler nicht als eigene Testkategorien in der Evaluation berücksichtigen; eine für das tatsächliche Nutzungsszenario ungeeignete Metrik verwenden.

## Production Checklist

- [ ] Repräsentative Anfragen, harte Negativbeispiele und Berechtigungsfehler sind als getrennte Testkategorien definiert.
- [ ] Recall, Precision, MRR und nDCG werden pro Kategorie getrennt berechnet und ausgewiesen.
- [ ] Berechtigungsfehler sind als eigene, sicherheitskritische Metrik dediziert überwacht.
- [ ] Die verwendete Metrik ist an das tatsächliche Nutzungsszenario angepasst.

## Interviewfragen

### 1. Was ist der Unterschied zwischen Recall und Precision?

**Antwort:** Recall misst, welcher Anteil der tatsächlich relevanten Dokumente gefunden wurde; Precision misst, welcher Anteil der gefundenen Dokumente tatsächlich relevant ist.

### 2. Wann ist MRR eine geeignetere Metrik als Recall?

**Antwort:** Wenn Nutzer typischerweise nur das erste Ergebnis prüfen, da MRR speziell die Position des ersten relevanten Ergebnisses bewertet, während Recall die Gesamtabdeckung relevanter Dokumente misst.

### 3. Warum sollten harte Negativbeispiele als eigene Testkategorie behandelt werden?

**Antwort:** Eine insgesamt gute Durchschnittsmetrik kann eine deutlich schlechtere Leistung speziell bei diesen schwierigen, oberflächlich ähnlichen Fällen statistisch verbergen, wenn sie nicht getrennt gemessen werden.

### 4. Warum sind Berechtigungsfehler eine besonders kritische Testkategorie?

**Antwort:** Sie sind sicherheitskritisch — ein einziger unentdeckter Berechtigungsfehler kann eine Sicherheitsverletzung darstellen, selbst wenn die Gesamtqualitätsmetriken insgesamt exzellent sind.

### 5. Wie diagnostizierst du eine unentdeckte Schwäche bei harten Negativbeispielen trotz guter Durchschnittsmetriken?

**Antwort:** Ich prüfe, ob dedizierte Testfälle mit harten Negativbeispielen als eigene Kategorie in der Evaluation existieren und getrennt gemessen werden — fehlt diese Trennung, kann eine spezifische Schwäche im Durchschnitt verborgen bleiben.

### 6. Widersprüchliche Anforderung: Team will eine einzige, einfache Gesamtkennzahl für Retrieval-Qualität ohne aufwendige Kategorietrennung UND garantiert keine unentdeckten sicherheitskritischen Berechtigungsfehler — wie gehst du vor?

**Antwort:** Ich würde erklären, dass eine einzige Gesamtkennzahl Berechtigungsfehler statistisch verbergen kann, wenn diese selten, aber kritisch sind; ich würde vorschlagen, weiterhin eine einfache Gesamtkennzahl für allgemeines Reporting zu nutzen, aber zusätzlich eine dedizierte, immer separat ausgewiesene Berechtigungsfehler-Metrik als Sicherheitsindikator zu etablieren, statt auf diese Trennung ganz zu verzichten.

## Praktische Labs

~~~python
# Category-separated retrieval evaluation revealing a hidden weakness
def compute_recall(relevant_ids, returned_ids):
    if not relevant_ids:
        return None
    found = len(set(relevant_ids) & set(returned_ids))
    return found / len(relevant_ids)

test_cases = {
    "representative": [
        {"relevant": ["doc1", "doc2"], "returned": ["doc1", "doc2", "doc3"]},
        {"relevant": ["doc4"], "returned": ["doc4", "doc5"]},
    ],
    "hard_negatives": [
        {"relevant": ["doc_correct"], "returned": ["doc_hard_negative", "doc_correct"]},
        {"relevant": ["doc_correct_2"], "returned": ["doc_hard_negative_2", "doc_unrelated"]},  # missed!
    ],
    "authorization_errors": [
        {"relevant": ["doc_authorized"], "returned": ["doc_authorized"]},
        {"relevant": ["doc_authorized_2"], "returned": ["doc_authorized_2", "doc_UNAUTHORIZED"]},  # leak!
    ],
}

for category, cases in test_cases.items():
    recalls = [compute_recall(c["relevant"], c["returned"]) for c in cases]
    avg_recall = sum(recalls) / len(recalls)
    print(f"{category}: avg recall = {avg_recall:.2f}")

overall_avg = sum(
    compute_recall(c["relevant"], c["returned"])
    for cases in test_cases.values() for c in cases
) / sum(len(cases) for cases in test_cases.values())
print(f"\nAggregated overall recall: {overall_avg:.2f} — looks fine, but HIDES the hard_negatives weakness above.")
~~~

## Dependencies, Cross-References und Quellen

1. Manning, Raghavan, Schütze: [Introduction to Information Retrieval — Evaluation](https://nlp.stanford.edu/IR-book/), abgerufen 2026-09-17.
2. Järvelin, Kekäläinen: [Cumulated Gain-Based Evaluation of IR Techniques (nDCG)](https://dl.acm.org/doi/10.1145/582415.582418), abgerufen 2026-09-17.
3. OWASP: [OWASP Top 10 for LLM Applications — Sensitive Information Disclosure](https://genai.owasp.org/llmrisk/llm02-sensitive-information-disclosure/), abgerufen 2026-09-17.

Reranking und Kandidatenauswahl sind kanonisch in [KB-0314](10-reranking-und-kandidatenauswahl.md) behandelt; RAG-Pipelines und Grounding in [KB-0305](01-rag-pipelines-und-grounding.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| LLM-basierte automatisierte Relevanzbewertung (LLM-as-Judge) für skalierbare Evaluationsset-Erstellung | Adopting | Gegenüber ausschließlich manueller Relevanzannotation für schnellere, skalierbare Evaluation bevorzugen, mit Stichprobenprüfung gegen menschliche Bewertung. |
| Kontinuierliche Produktions-Evaluationspipelines, die reale Nutzeranfragen anonymisiert für laufende Qualitätsmessung nutzen | Adopting | Gegenüber rein statischen, einmalig erstellten Testsets für realitätsnähere, laufend aktuelle Qualitätsmessung bevorzugen. |

Ein Team akzeptiert eine Retrieval-Evaluationsarchitektur erst, wenn repräsentative Anfragen, harte Negativbeispiele und Berechtigungsfehler getrennt gemessen und dokumentiert sind.
