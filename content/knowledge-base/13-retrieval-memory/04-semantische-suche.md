---
{"id": "KB-0308", "title": "Semantische Suche", "domain": "13", "sequence": 4, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0307", "concepts": ["Embeddings für Retrieval"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine semantische Suche implementieren, die semantisch nahe, aber fachlich irrelevante oder nicht autorisierte Ergebnisse anhand von Gegenbeispielen explizit ausschließt.", "rationale": "Der Unterschied zwischen semantischer Nähe und tatsächlicher Relevanz wird erst durch konkrete Gegenbeispiele greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine semantische Suche gestalten, die Berechtigungsfilterung als eigenständigen, von der reinen Ähnlichkeitsberechnung getrennten Schritt behandelt.", "rationale": "Semantische Nähe sagt nichts über die Zugriffsberechtigung eines Nutzers auf ein Dokument aus; diese Dimensionen müssen getrennt behandelt werden."}, "STAFF-TARGET": {"active": true, "scope": "Eine unautorisierte Informationspreisgabe über semantische Suche auf eine fehlende Berechtigungsfilterung statt auf ein allgemeines Suchproblem zurückführen können.", "rationale": "Eine semantische Suche ohne separate Berechtigungsfilterung kann Dokumente zurückgeben, auf die der anfragende Nutzer eigentlich keinen Zugriff haben sollte."}, "CHIEF-TARGET": {"active": true, "scope": "Semantische Suche als Kombination aus Ähnlichkeitsberechnung und eigenständiger Relevanz-/Berechtigungsprüfung positionieren, nicht als reine Vektor-Nähe-Suche.", "rationale": "Reine semantische Nähe ohne Relevanz- und Berechtigungsfilterung kann zu irreführenden oder unautorisierten Suchergebnissen führen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Vektordatenbank-Filterimplementierungsdetails sind Vertiefung.", "rationale": "Kern ist die Trennung von semantischer Nähe, fachlicher Relevanz und Berechtigung, nicht die konkrete Filtertechnologie."}}, "lab_validation": [{"lab_id": "KB-0308-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell einer semantischen Suche mit Gegenbeispiel für semantisch nahe, aber fachlich irrelevante und nicht autorisierte Ergebnisse", "evidence": "Ein Dokument mit hoher semantischer Ähnlichkeit zur Anfrage, aber ohne Zugriffsberechtigung des anfragenden Nutzers, wird durch eine separate Berechtigungsfilterung korrekt ausgeschlossen, obwohl die reine Ähnlichkeitsberechnung es als relevant einstufen würde.", "limitations": "Kein echtes Embedding-Modell, keine echte Vektordatenbank, kein produktives System."}]}
---
# Semantische Suche

> **Ziel:** Semantische Suche berechnet Ähnlichkeit zwischen Query- und Dokumentrepräsentationen, aufbauend auf Embeddings (siehe [KB-0307](03-embeddings-fuer-retrieval.md)). Der zentrale Punkt ist, semantische Nähe (geometrische Ähnlichkeit im Vektorraum) ausdrücklich von fachlicher Relevanz (ist das Ergebnis tatsächlich hilfreich für die Anfrage) und von Berechtigung (darf der anfragende Nutzer dieses Ergebnis überhaupt sehen) zu unterscheiden — diese drei Dimensionen dürfen nicht vermischt werden, und Gegenbeispiele (semantisch nahe, aber tatsächlich irrelevante oder nicht autorisierte Nachbarschaften) machen diesen Unterschied konkret sichtbar.

## Zweck, Mental Model und Dependencies

Eine Query-Repräsentation ist der Embedding-Vektor einer Suchanfrage, eine Dokumentrepräsentation der Embedding-Vektor eines gespeicherten Inhalts — semantische Suche findet die Dokumentrepräsentationen, die der Query-Repräsentation im Vektorraum am nächsten liegen. Der zentrale, oft übersehene Punkt ist, dass geometrische Nähe im Vektorraum nicht automatisch fachliche Relevanz bedeutet: zwei Inhalte können semantisch ähnlich sein (z. B. weil sie dasselbe allgemeine Thema behandeln), ohne dass einer davon tatsächlich die konkrete Anfrage beantwortet — ein Gegenbeispiel macht dies konkret: eine Anfrage nach "Kündigungsfristen für Mitarbeiter" kann semantisch nahe Dokumente über "Kündigungsfristen für Mietverträge" finden, die thematisch verwandt, aber fachlich irrelevant sind. Ebenso wenig sagt semantische Nähe etwas über Berechtigung aus: ein Dokument kann semantisch perfekt zur Anfrage passen, aber der anfragende Nutzer hat keine Zugriffsberechtigung dafür (z. B. ein vertrauliches Gehaltsdokument bei einer allgemeinen HR-Anfrage). Diese drei Dimensionen — semantische Nähe, fachliche Relevanz, Berechtigung — müssen daher als getrennte, aufeinanderfolgende Prüfschritte behandelt werden: die semantische Suche liefert Kandidaten, eine Relevanzprüfung filtert thematisch passende, aber sachlich unpassende Ergebnisse, und eine Berechtigungsfilterung entfernt Ergebnisse, auf die der Nutzer keinen Zugriff hat — unabhängig davon, wie hoch die berechnete semantische Ähnlichkeit ist.

~~~text
Query representation: embedding vector of the search query
Document representation: embedding vector of a stored item
Semantic search: finds document reps CLOSEST to query rep in vector space
CRITICAL DISTINCTIONS (must NOT be merged):
  Semantic proximity: geometric closeness in vector space
  Topical relevance: does the result ACTUALLY answer the query (counter-example: "employee termination notice" vs "lease termination notice" - related topic, WRONG answer)
  Authorization: is the requesting user ALLOWED to see this result AT ALL, regardless of similarity score
Pipeline: semantic search -> candidates -> relevance filter -> authorization filter (in that order, all THREE required)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Getrennte Behandlung von Nähe, Relevanz und Berechtigung | werden diese drei Dimensionen als separate, aufeinanderfolgende Prüfschritte behandelt statt vermischt? | eine Vermischung kann semantisch nahe, aber fachlich irrelevante oder unautorisierte Ergebnisse fälschlich als passend ausgeben |
| Explizite Gegenbeispiel-Prüfung | werden bei der Entwicklung/Evaluation der Suche gezielt semantisch nahe, aber fachlich falsche Nachbarschaften als Testfälle geprüft? | ohne solche Gegenbeispiele bleibt das Risiko fachlich falscher, aber semantisch plausibler Ergebnisse unentdeckt |
| Berechtigungsfilterung unabhängig von der Ähnlichkeitsbewertung | wird die Berechtigungsprüfung als eigenständiger Schritt durchgeführt, unabhängig davon, wie hoch die semantische Ähnlichkeit eines Ergebnisses ist? | eine hohe semantische Ähnlichkeit darf eine fehlende Berechtigung niemals überschreiben |
| Konsistente Filterreihenfolge | ist die Reihenfolge von Ähnlichkeitsberechnung, Relevanzfilterung und Berechtigungsfilterung konsistent definiert und dokumentiert? | eine inkonsistente Reihenfolge kann zu unvorhersehbarem oder ineffizientem Filterverhalten führen |

Implementierung: Die semantische Suche liefert zunächst eine Liste von Kandidaten anhand geometrischer Nähe im Vektorraum. Eine nachgelagerte Relevanzprüfung filtert Kandidaten, die zwar thematisch verwandt, aber sachlich nicht passend zur konkreten Anfrage sind (z. B. durch zusätzliche Klassifikations- oder Reranking-Schritte). Eine unabhängige Berechtigungsfilterung entfernt anschließend alle Ergebnisse, auf die der anfragende Nutzer keine Zugriffsberechtigung hat — diese Filterung erfolgt unabhängig von der Ähnlichkeitsbewertung und darf durch keine noch so hohe semantische Nähe umgangen werden. Bei der Entwicklung und Evaluation der Suche werden gezielt Gegenbeispiele (semantisch nahe, aber fachlich falsche oder nicht autorisierte Fälle) als Testfälle eingesetzt, um diese Unterscheidung konkret zu verifizieren.

## Scalability, Reliability, Security und Observability

Semantische Suche skaliert die Auffindbarkeit relevanter Inhalte proportional zur Konsequenz der Trennung von Nähe, Relevanz und Berechtigung; die Reliability-Grenze liegt in einer Vermischung dieser Dimensionen, die mit wachsendem Wissensbestand proportional mehr fachlich falsche oder unautorisierte Ergebnisse in den Suchergebnissen erzeugen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| die Suche liefert thematisch verwandte, aber sachlich falsche Ergebnisse | fehlende oder unzureichende Relevanzfilterung nach der semantischen Ähnlichkeitsberechnung | prüfen, ob nach der semantischen Suche ein separater Relevanzfilterungsschritt stattfindet |
| ein Nutzer erhält ein Suchergebnis, auf das er eigentlich keinen Zugriff haben sollte | fehlende oder unabhängige Berechtigungsfilterung, die durch hohe semantische Ähnlichkeit umgangen wurde | prüfen, ob die Berechtigungsfilterung unabhängig von der Ähnlichkeitsbewertung als eigener Schritt implementiert ist |
| die Suchqualität bei bestimmten Anfragetypen ist unerwartet schlecht | fehlende Gegenbeispiel-Tests haben eine systematische Schwäche bei bestimmten semantisch nahen, aber irrelevanten Nachbarschaften übersehen | gezielt Gegenbeispiele für den betroffenen Anfragetyp als Testfälle prüfen |

Security: Die Berechtigungsfilterung muss als eigenständiger, nicht durch semantische Ähnlichkeit umgehbarer Sicherheitsschritt implementiert werden — eine semantische Suche, die Berechtigung nur implizit über die Filterung des Wissensbestands vor Indexierung berücksichtigt, kann bei dynamischen oder feingranularen Berechtigungen unzureichend sein und muss zur Anfragezeit erneut geprüft werden. Observability: Anteil durch Relevanzfilterung entfernter semantisch naher Kandidaten, Häufigkeit durch Berechtigungsfilterung entfernter Ergebnisse und Ergebnis dedizierter Gegenbeispiel-Testläufe sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Relevanz- und Berechtigungsfilterung immer als eigenständige Schritte nach der semantischen Ähnlichkeitsberechnung. **Principal** macht Gegenbeispiel-Testfälle für das Team nachvollziehbar dokumentiert. **Chief** positioniert semantische Suche als Kombination aus Ähnlichkeitsberechnung und eigenständiger Relevanz-/Berechtigungsprüfung, nicht als reine Vektor-Nähe-Suche.

Anti-Patterns: semantische Ähnlichkeit als alleinigen Indikator für Relevanz oder Berechtigung behandeln; Berechtigungsfilterung nur implizit über die Indexzusammensetzung statt als expliziten Anfragezeit-Schritt umsetzen; die Suche ohne gezielte Gegenbeispiel-Tests für semantisch nahe, aber fachlich falsche Nachbarschaften evaluieren.

## Production Checklist

- [ ] Semantische Nähe, fachliche Relevanz und Berechtigung sind als getrennte Prüfschritte implementiert.
- [ ] Berechtigungsfilterung erfolgt unabhängig von der Ähnlichkeitsbewertung als eigenständiger Anfragezeit-Schritt.
- [ ] Gegenbeispiele (semantisch nah, fachlich falsch/nicht autorisiert) sind als Testfälle dokumentiert.
- [ ] Die Filterreihenfolge (Nähe, Relevanz, Berechtigung) ist konsistent definiert.

## Interviewfragen

### 1. Warum ist semantische Nähe nicht dasselbe wie fachliche Relevanz?

**Antwort:** Zwei Inhalte können thematisch verwandt und damit semantisch nah sein, ohne dass einer davon die konkrete Anfrage tatsächlich beantwortet — ein Gegenbeispiel macht diesen Unterschied konkret sichtbar.

### 2. Warum muss Berechtigungsfilterung unabhängig von der semantischen Ähnlichkeit erfolgen?

**Antwort:** Ein Dokument kann semantisch perfekt zur Anfrage passen, aber der anfragende Nutzer hat keine Zugriffsberechtigung; eine hohe Ähnlichkeit darf eine fehlende Berechtigung niemals überschreiben.

### 3. Warum sind Gegenbeispiele bei der Entwicklung semantischer Suche wichtig?

**Antwort:** Sie machen konkret sichtbar, wo semantisch nahe, aber fachlich falsche oder nicht autorisierte Ergebnisse auftreten können, und ermöglichen so eine gezielte Prüfung dieser Unterscheidung.

### 4. In welcher Reihenfolge sollten semantische Suche, Relevanzfilterung und Berechtigungsfilterung stattfinden?

**Antwort:** Zunächst liefert die semantische Suche Kandidaten anhand geometrischer Nähe, danach filtert die Relevanzprüfung fachlich unpassende Kandidaten, und abschließend entfernt die Berechtigungsfilterung nicht autorisierte Ergebnisse.

### 5. Wie diagnostizierst du eine unautorisierte Informationspreisgabe über semantische Suche?

**Antwort:** Ich prüfe, ob die Berechtigungsfilterung als eigenständiger, von der Ähnlichkeitsbewertung unabhängiger Schritt implementiert ist — fehlt sie oder wird sie durch hohe Ähnlichkeit umgangen, ist das die wahrscheinlichste Ursache.

### 6. Widersprüchliche Anforderung: Team will maximale Suchgeschwindigkeit ohne zusätzliche Filterschritte nach der semantischen Ähnlichkeitsberechnung UND garantiert keine irrelevanten oder unautorisierten Ergebnisse — wie gehst du vor?

**Antwort:** Ich würde erklären, dass Relevanz- und Berechtigungsfilterung notwendige, nicht optionale Schritte sind, um diese Garantie zu erfüllen; ich würde vorschlagen, diese Filterung effizient zu gestalten (z. B. Berechtigungsfilterung direkt in der Vektordatenbankabfrage statt als separater Nachbearbeitungsschritt), statt sie ganz auszulassen.

## Praktische Labs

~~~python
# Semantic search with separated relevance and authorization filtering
candidates = [
    {"doc": "employee_termination_policy.pdf", "similarity": 0.91, "topic_match": True, "user_authorized": True},
    {"doc": "lease_termination_notice.pdf", "similarity": 0.88, "topic_match": False, "user_authorized": True},  # semantically close, WRONG topic
    {"doc": "confidential_salary_review.pdf", "similarity": 0.85, "topic_match": True, "user_authorized": False},  # relevant, but NOT authorized
]

def search_pipeline(candidates):
    # Step 1: semantic proximity already computed (candidates list)
    # Step 2: relevance filter
    relevant = [c for c in candidates if c["topic_match"]]
    # Step 3: authorization filter, independent of similarity score
    authorized = [c for c in relevant if c["user_authorized"]]
    return authorized

results = search_pipeline(candidates)
print("Final results after relevance + authorization filtering:")
for r in results:
    print(f"  {r['doc']} (similarity={r['similarity']})")

excluded = [c for c in candidates if c not in results]
print("\nExcluded despite semantic proximity:")
for c in excluded:
    reason = "topic mismatch" if not c["topic_match"] else "not authorized"
    print(f"  {c['doc']} (similarity={c['similarity']}) — excluded: {reason}")
~~~

## Dependencies, Cross-References und Quellen

1. Pinecone: [Semantic Search — What It Is and How It Works](https://www.pinecone.io/learn/semantic-search/), abgerufen 2026-09-17.
2. OWASP: [OWASP Top 10 for LLM Applications — Sensitive Information Disclosure](https://genai.owasp.org/llmrisk/llm02-sensitive-information-disclosure/), abgerufen 2026-09-17.
3. Elastic: [Reranking and Relevance Tuning in Semantic Search](https://www.elastic.co/what-is/semantic-search), abgerufen 2026-09-17.

Embeddings für Retrieval sind kanonisch in [KB-0307](03-embeddings-fuer-retrieval.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Cross-Encoder-Reranking als zweite Relevanzprüfungsstufe nach initialer Vektor-Ähnlichkeitssuche | Adopting | Gegenüber reiner Bi-Encoder-Ähnlichkeit für präzisere fachliche Relevanzbewertung bevorzugen. |
| Row-Level-Security direkt in Vektordatenbank-Abfragen integriert, statt Berechtigungsfilterung als separaten Nachbearbeitungsschritt | Adopting | Gegenüber nachgelagerter Filterung für Effizienz und geringeres Risiko versehentlicher Auslassung bevorzugen. |

Ein Team akzeptiert eine semantische Suchimplementierung erst, wenn Relevanz- und Berechtigungsfilterung als getrennte, getestete Schritte gegen Gegenbeispiele dokumentiert sind.
