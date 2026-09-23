---
{"id": "KB-0313", "title": "Query Rewriting und Expansion", "domain": "13", "sequence": 9, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0311", "concepts": ["Hybrid Retrieval"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Query-Expansion implementieren, die mehrere Anfragevarianten erzeugt und deren Retrieval-Ergebnisse kombiniert, während die ursprüngliche Nutzerabsicht als Referenz erhalten bleibt.", "rationale": "Das Risiko semantischer Drift bei Query-Expansion wird erst durch konkrete Implementierung mit Absichtsvergleich greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein Query-Rewriting-System gestalten, das zusätzliche Latenz durch mehrere Anfragevarianten gegen den Nutzen der verbesserten Trefferquote explizit abwägt.", "rationale": "Jede zusätzliche Anfragevariante erhöht die Latenz und Kosten der Retrieval-Pipeline; dieser Aufwand muss gegen den tatsächlichen Nutzen abgewogen werden."}, "STAFF-TARGET": {"active": true, "scope": "Ein für die ursprüngliche Anfrage irrelevantes Suchergebnis auf semantische Drift durch eine zu freie Query-Umformulierung statt auf ein allgemeines Retrieval-Problem zurückführen können.", "rationale": "Eine Umformulierung, die zu weit von der ursprünglichen Nutzerabsicht abweicht, kann Ergebnisse liefern, die zur umformulierten, aber nicht zur eigentlich gemeinten Anfrage passen."}, "CHIEF-TARGET": {"active": true, "scope": "Query Rewriting als kontrollierte Erweiterung der ursprünglichen Nutzerabsicht positionieren, nicht als freie Neuinterpretation der Anfrage.", "rationale": "Query Rewriting soll die Trefferquote für die tatsächlich gemeinte Anfrage verbessern, nicht die Anfrage durch das System eigenmächtig neu definieren."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Implementierungsdetails für LLM-basierte Umformulierung sind Vertiefung.", "rationale": "Kern ist das Prinzip der kontrollierten Erweiterung mit Absichtserhaltung, nicht die konkrete Umformulierungstechnik."}}, "lab_validation": [{"lab_id": "KB-0313-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell einer Query-Expansion mit Absichtsvergleich zwischen ursprünglicher und umformulierter Anfrage", "evidence": "Eine zu freie Umformulierung, die vom ursprünglichen Anfrageschwerpunkt semantisch stark abweicht, wird durch einen expliziten Absichtsvergleich erkannt und verworfen, während eine kontrollierte Erweiterung mit erhaltener Absicht akzeptiert wird.", "limitations": "Kein echtes Sprachmodell, kein produktives Retrieval-System, keine reale Nutzerinteraktion."}]}
---
# Query Rewriting und Expansion

> **Ziel:** Query Rewriting löst mehrdeutige Anfragen auf und Query Expansion erzeugt zusätzliche Anfragevarianten, um die Trefferquote einer Retrieval-Pipeline (siehe [KB-0311](07-hybrid-retrieval.md)) zu verbessern. Der zentrale Punkt ist, semantische Drift (die umformulierte Anfrage entfernt sich zu weit von der ursprünglichen Nutzerabsicht) und zusätzliche Latenz (jede zusätzliche Anfragevariante kostet Zeit und Ressourcen) explizit gegen den Nutzen der ursprünglichen Nutzerabsicht zu kontrollieren, statt Umformulierung als kostenlose, risikofreie Verbesserung zu behandeln.

## Zweck, Mental Model und Dependencies

Eine mehrdeutige Anfrage kann mehrere plausible Interpretationen haben (z. B. "Python" als Programmiersprache oder als Schlangenart) — Query Rewriting versucht, aus dem Kontext die wahrscheinlichste Interpretation zu bestimmen oder mehrere Interpretationen parallel zu berücksichtigen. Query Expansion erzeugt zusätzliche Anfragevarianten (z. B. Synonyme, verwandte Formulierungen, Umschreibungen) und führt für jede Variante ein separates Retrieval durch, um die Trefferquote zu erhöhen — eine Anfrage, die in ihrer ursprünglichen Formulierung möglicherweise nicht genau die im Wissensbestand verwendete Terminologie trifft, kann durch eine umformulierte Variante dennoch fündig werden. Der zentrale, oft übersehene Risikofaktor ist semantische Drift: wenn eine Umformulierung zu frei erfolgt (z. B. durch ein Sprachmodell, das die Anfrage großzügig "verbessert"), kann sich die tatsächliche Bedeutung der Anfrage von der ursprünglichen Nutzerabsicht entfernen, und die daraus resultierenden Retrieval-Ergebnisse passen dann zur umformulierten, aber nicht zur eigentlich gemeinten Anfrage. Zusätzliche Latenz ist der zweite zentrale Trade-off: jede zusätzliche Anfragevariante erfordert ein separates Retrieval (und bei LLM-basierter Umformulierung zusätzlich einen Modellaufruf), was die Gesamtlatenz und die Kosten der Pipeline erhöht — dieser Mehraufwand muss gegen die tatsächlich gemessene Verbesserung der Trefferquote abgewogen werden, statt Query Expansion pauschal für jede Anfrage einzusetzen.

~~~text
Ambiguous query: multiple plausible interpretations (e.g. "Python" language vs snake)
Query rewriting: determine most likely interpretation OR consider multiple in parallel
Query expansion: generate additional variants (synonyms, rephrasing) -> separate retrieval per variant -> improves recall
CRITICAL RISK 1: semantic drift -> overly free rewriting moves AWAY from original user intent
  -> results match the REWRITTEN query, not what the user actually meant
CRITICAL RISK 2: added latency -> each variant = separate retrieval (+ LLM call for rewriting)
  -> overhead MUST be weighed against MEASURED recall improvement, not applied blindly to every query
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Explizite Absichtserhaltung bei Umformulierung | wird die ursprüngliche Nutzerabsicht als Referenz erhalten und gegen die umformulierte Anfrage geprüft? | eine zu freie Umformulierung ohne Absichtsvergleich kann Ergebnisse liefern, die zur falschen (umformulierten) Anfrage passen |
| Begrenzte Anzahl an Anfragevarianten | ist die Anzahl generierter Varianten begrenzt und an den tatsächlichen Nutzen gekoppelt? | eine unbegrenzte Anzahl von Varianten erhöht Latenz und Kosten proportional, ohne dass der Nutzen entsprechend mitwächst |
| Empirische Messung des Trefferquoten-Nutzens | wird der tatsächliche Trefferquoten-Gewinn durch Query Expansion gegen den Latenz-/Kostenaufwand gemessen? | ohne diese Messung kann Query Expansion pauschal eingesetzt werden, obwohl der Nutzen den Mehraufwand nicht rechtfertigt |
| Behandlung echter Mehrdeutigkeit | wird bei einer tatsächlich mehrdeutigen Anfrage (mehrere plausible Interpretationen) explizit mit mehreren parallelen Interpretationen statt einer einzelnen Annahme umgegangen? | eine einzelne, falsch geratene Interpretation kann bei echter Mehrdeutigkeit zu für den Nutzer irrelevanten Ergebnissen führen |

Implementierung: Bei Query Rewriting wird die ursprüngliche Nutzeranfrage als Referenz erhalten, und jede Umformulierung wird explizit gegen diese Referenz auf Absichtserhaltung geprüft, statt eine freie Neuinterpretation ohne Rückbindung zuzulassen. Die Anzahl generierter Anfragevarianten bei Query Expansion wird begrenzt und an den gemessenen Nutzen gekoppelt, statt unbegrenzt viele Varianten zu erzeugen. Der tatsächliche Trefferquoten-Gewinn durch Query Expansion wird empirisch gemessen und gegen den zusätzlichen Latenz- und Kostenaufwand abgewogen, bevor die Technik breit eingesetzt wird. Bei erkannter echter Mehrdeutigkeit werden, wo sinnvoll, mehrere plausible Interpretationen parallel berücksichtigt, statt sich auf eine einzelne, möglicherweise falsche Annahme festzulegen.

## Scalability, Reliability, Security und Observability

Query Rewriting und Expansion skalieren Trefferquote proportional zur Kontrolle der semantischen Drift; die Reliability-Grenze liegt in unkontrollierter, freier Umformulierung, die mit wachsender Abweichung von der ursprünglichen Absicht proportional mehr für den Nutzer irrelevante, aber zur umformulierten Anfrage passende Ergebnisse erzeugen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Suchergebnisse passen nicht zur tatsächlich gestellten Anfrage, wirken aber intern konsistent | semantische Drift durch eine zu freie Umformulierung, die von der ursprünglichen Nutzerabsicht abgewichen ist | prüfen, ob die verwendete umformulierte Anfrage explizit gegen die ursprüngliche Absicht geprüft wurde |
| die Retrieval-Pipeline hat unerwartet hohe Latenz oder Kosten | eine unbegrenzte oder unnötig hohe Anzahl an Anfragevarianten wird für jede Anfrage erzeugt | prüfen, ob die Anzahl der Varianten begrenzt und an den gemessenen Nutzen gekoppelt ist |
| Query Expansion verbessert die Trefferquote nicht messbar, wird aber weiterhin pauschal eingesetzt | fehlende empirische Messung des tatsächlichen Trefferquoten-Nutzens gegen den Mehraufwand | den gemessenen Trefferquoten-Gewinn explizit gegen den Latenz-/Kostenaufwand für den betroffenen Anfragetyp prüfen |

Security: Query Rewriting, das externe oder nutzergenerierte Inhalte in die Umformulierungslogik einbezieht, sollte gegen Prompt-Injection-Risiken abgesichert werden, da eine manipulierte Umformulierung die tatsächliche Suchabsicht des Nutzers verfälschen könnte. Observability: Häufigkeit erkannter semantischer Drift zwischen ursprünglicher und umformulierter Anfrage, durchschnittliche Anzahl generierter Varianten pro Anfrage und gemessener Trefferquoten-Gewinn im Verhältnis zum zusätzlichen Latenzaufwand sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Query Rewriting immer mit expliziter Absichtserhaltung gegenüber der ursprünglichen Anfrage. **Principal** macht die empirische Messung des Trefferquoten-Nutzens für das Team nachvollziehbar dokumentiert. **Chief** positioniert Query Rewriting als kontrollierte Erweiterung der Nutzerabsicht, nicht als freie Neuinterpretation.

Anti-Patterns: Anfragen ohne Absichtsvergleich frei umformulieren lassen; eine unbegrenzte Anzahl an Anfragevarianten für jede Anfrage erzeugen; Query Expansion pauschal einsetzen, ohne den tatsächlichen Trefferquoten-Nutzen gegen den Mehraufwand zu messen.

## Production Checklist

- [ ] Jede Umformulierung wird explizit gegen die ursprüngliche Nutzerabsicht geprüft.
- [ ] Die Anzahl generierter Anfragevarianten ist begrenzt und an den gemessenen Nutzen gekoppelt.
- [ ] Der Trefferquoten-Gewinn durch Query Expansion ist empirisch gegen den Latenz-/Kostenaufwand gemessen.
- [ ] Bei echter Mehrdeutigkeit werden, wo sinnvoll, mehrere Interpretationen parallel berücksichtigt.

## Interviewfragen

### 1. Was ist semantische Drift bei Query Rewriting, und warum ist sie riskant?

**Antwort:** Eine zu freie Umformulierung entfernt sich von der ursprünglichen Nutzerabsicht; die resultierenden Retrieval-Ergebnisse passen dann zur umformulierten, aber nicht zur eigentlich gemeinten Anfrage.

### 2. Warum muss die Anzahl der Anfragevarianten bei Query Expansion begrenzt werden?

**Antwort:** Jede zusätzliche Variante erfordert ein separates Retrieval und erhöht Latenz und Kosten; eine unbegrenzte Anzahl von Varianten erzeugt proportional mehr Aufwand, ohne dass der Nutzen entsprechend mitwächst.

### 3. Warum ist eine empirische Messung des Trefferquoten-Nutzens bei Query Expansion notwendig?

**Antwort:** Ohne diese Messung kann die Technik pauschal eingesetzt werden, obwohl der tatsächliche Trefferquoten-Gewinn den zusätzlichen Latenz- und Kostenaufwand nicht rechtfertigt.

### 4. Wie sollte mit einer tatsächlich mehrdeutigen Anfrage umgegangen werden?

**Antwort:** Wo sinnvoll, sollten mehrere plausible Interpretationen parallel berücksichtigt werden, statt sich auf eine einzelne, möglicherweise falsche Interpretation festzulegen.

### 5. Wie diagnostizierst du irrelevante Suchergebnisse trotz konsistent wirkender interner Verarbeitung?

**Antwort:** Ich prüfe, ob die tatsächlich verwendete, umformulierte Anfrage explizit gegen die ursprüngliche Nutzerabsicht geprüft wurde — eine unkontrollierte semantische Drift ist die wahrscheinlichste Ursache.

### 6. Widersprüchliche Anforderung: Team will maximale Trefferquote durch möglichst viele generierte Anfragevarianten UND garantiert minimale zusätzliche Latenz — wie gehst du vor?

**Antwort:** Ich würde erklären, dass beide Ziele sich direkt widersprechen, wenn die Anzahl der Varianten unbegrenzt erhöht wird; ich würde vorschlagen, die optimale Anzahl an Varianten empirisch anhand des gemessenen Trefferquoten-Grenznutzens zu bestimmen und Query Expansion nur dort einzusetzen, wo der gemessene Nutzen den Latenzaufwand tatsächlich rechtfertigt.

## Praktische Labs

~~~python
# Query rewriting with explicit intent-drift check
def compute_intent_overlap(original_terms, rewritten_terms):
    original_set, rewritten_set = set(original_terms), set(rewritten_terms)
    return len(original_set & rewritten_set) / len(original_set)

def rewrite_with_drift_check(original_query, rewritten_query, min_overlap=0.4):
    original_terms = original_query.lower().split()
    rewritten_terms = rewritten_query.lower().split()
    overlap = compute_intent_overlap(original_terms, rewritten_terms)
    if overlap < min_overlap:
        return original_query, f"Rewrite REJECTED (overlap={overlap:.2f} < {min_overlap}): semantic drift detected"
    return rewritten_query, f"Rewrite ACCEPTED (overlap={overlap:.2f}): intent preserved"

controlled_rewrite = "employee termination notice period policy"
free_drift_rewrite = "workplace culture and benefits overview"
original = "employee termination notice period"

query1, msg1 = rewrite_with_drift_check(original, controlled_rewrite)
print(f"Controlled expansion: {msg1} -> using: '{query1}'")

query2, msg2 = rewrite_with_drift_check(original, free_drift_rewrite)
print(f"Free rewrite: {msg2} -> using: '{query2}'")
~~~

## Dependencies, Cross-References und Quellen

1. Nogueira et al.: [Query Reformulation for Document Retrieval](https://arxiv.org/abs/1904.08375), abgerufen 2026-09-17.
2. Anthropic: [Building Effective AI Agents — Context Engineering](https://www.anthropic.com/engineering/building-effective-agents), abgerufen 2026-09-17.
3. LlamaIndex: [Query Transformations Documentation](https://docs.llamaindex.ai/en/stable/optimizing/advanced_retrieval/query_transformations/), abgerufen 2026-09-17.

Hybrid Retrieval ist kanonisch in [KB-0311](07-hybrid-retrieval.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| HyDE (Hypothetical Document Embeddings) — Generierung einer hypothetischen Antwort zur Verbesserung der Embedding-basierten Ähnlichkeitssuche | Adopting | Gegenüber reiner Anfrageumformulierung für bestimmte Anfrageklassen (komplexe, unterspezifizierte Fragen) bevorzugen, nach empirischer Validierung. |
| Adaptive Query-Expansion-Steuerung, die die Anzahl der Varianten dynamisch anhand der initialen Retrieval-Konfidenz anpasst | Emerging | Beobachten; würde pauschale Expansion durch bedarfsgerechte ersetzen, aber noch nicht breit etabliert. |

Ein Team akzeptiert eine Query-Rewriting-/Expansion-Architektur erst, wenn Absichtserhaltung und empirisch gemessener Trefferquoten-Nutzen gegenüber dem Latenzaufwand dokumentiert sind.
