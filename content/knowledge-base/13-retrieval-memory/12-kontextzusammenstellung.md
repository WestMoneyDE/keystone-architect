---
{"id": "KB-0316", "title": "Kontextzusammenstellung", "domain": "13", "sequence": 12, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0314", "concepts": ["Reranking und Kandidatenauswahl"], "needed_for": "understanding"}, {"id": "KB-0245", "concepts": ["Context Engineering"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Kontextzusammenstellung implementieren, die redundante Passagen erkennt und entfernt, um das begrenzte Tokenbudget effizienter für vielfältige Quellen zu nutzen.", "rationale": "Der Wert von Redundanzentfernung wird erst durch konkreten Vergleich der Quellenvielfalt bei begrenztem Tokenbudget greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Kontextzusammenstellungsstrategie gestalten, die Relevanz, Aktualität und Autorität als gemeinsame, gewichtete Rangordnungskriterien statt allein Relevanz berücksichtigt.", "rationale": "Eine reine Relevanzsortierung kann veraltete oder wenig autoritative Quellen bevorzugen, obwohl aktuellere oder verlässlichere Alternativen existieren."}, "STAFF-TARGET": {"active": true, "scope": "Eine unzureichend fundierte generierte Antwort auf eine durch Redundanz verschwendete Tokenbudget-Kapazität statt auf ein allgemeines Retrieval-Problem zurückführen können.", "rationale": "Wenn mehrere sehr ähnliche Passagen redundant in den Kontext aufgenommen werden, bleibt weniger Tokenbudget für tatsächlich vielfältige, ergänzende Informationsquellen übrig."}, "CHIEF-TARGET": {"active": true, "scope": "Kontextzusammenstellung als eigenständige Optimierungsstufe zwischen Retrieval und Generierung positionieren, die Relevanz, Aktualität, Autorität und Quellenvielfalt bewusst gegeneinander abwägt.", "rationale": "Eine unreflektierte Übergabe der Top-K-Retrieval-Ergebnisse ohne bewusste Zusammenstellung kann das begrenzte Tokenbudget suboptimal nutzen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Redundanzerkennungsalgorithmen (z. B. Maximal Marginal Relevance) sind Vertiefung.", "rationale": "Kern ist das Prinzip der bewussten Abwägung von Relevanz, Aktualität, Autorität und Redundanz, nicht der konkrete Algorithmus."}}, "lab_validation": [{"lab_id": "KB-0316-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell einer Kontextzusammenstellung mit Redundanzfilterung gegenüber einer naiven Top-K-Übernahme ohne Redundanzprüfung", "evidence": "Eine naive Top-K-Übernahme kann drei nahezu identische Passagen aus verschiedenen Dokumenten enthalten, während eine redundanzbewusste Zusammenstellung stattdessen zwei dieser Plätze für tatsächlich ergänzende, vielfältige Informationsquellen nutzt.", "limitations": "Kein echtes Retrieval-System, kein echtes Sprachmodell, kein produktives System."}]}
---
# Kontextzusammenstellung

> **Ziel:** Gefundene Passagen aus dem Reranking (siehe [KB-0314](10-reranking-und-kandidatenauswahl.md)) müssen für die Übergabe an das Sprachmodell (siehe Context Engineering, [KB-0245](../11-genai-architecture/05-context-engineering.md)) nach Relevanz, Aktualität und Autorität geordnet werden. Redundanz (mehrere sehr ähnliche Passagen), Quellenvielfalt (unterschiedliche, ergänzende Perspektiven) und das begrenzte Tokenbudget müssen dabei gezielt gesteuert werden — eine naive Übernahme der Top-K-Retrieval-Ergebnisse ohne bewusste Zusammenstellung kann das begrenzte Tokenbudget mit redundanten Inhalten verschwenden.

## Zweck, Mental Model und Dependencies

Relevanz (aus dem Retrieval- und Reranking-Schritt) ist nur eines von mehreren Kriterien für die Kontextzusammenstellung. Aktualität berücksichtigt, ob eine Passage aus einer aktuellen oder veralteten Quelle stammt — bei sich ändernden Fachinhalten (z. B. Richtlinien, Preise, technische Spezifikationen) kann eine ältere, aber semantisch hoch relevante Passage tatsächlich irreführend sein, wenn sie durch eine neuere Version ersetzt wurde. Autorität berücksichtigt, wie vertrauenswürdig oder offiziell eine Quelle ist (z. B. eine offizielle Richtlinie gegenüber einer informellen internen Notiz) — bei widersprüchlichen Informationen aus unterschiedlichen Quellen sollte die autoritativere Quelle bevorzugt werden. Der zentrale, oft übersehene Punkt ist Redundanz: wenn die Top-K-Retrieval-Ergebnisse mehrere sehr ähnliche oder nahezu identische Passagen enthalten (z. B. aus mehreren Versionen desselben Dokuments oder aus Dokumenten, die sich gegenseitig zitieren), verschwendet die naive Aufnahme all dieser redundanten Passagen wertvolles, begrenztes Tokenbudget, das stattdessen für tatsächlich ergänzende, vielfältige Informationsquellen genutzt werden könnte. Quellenvielfalt bedeutet daher, bewusst unterschiedliche, sich ergänzende Perspektiven oder Aspekte in den Kontext aufzunehmen, statt mehrfach dieselbe Information zu wiederholen.

~~~text
Relevance (from retrieval/reranking) is only ONE of several criteria for context assembly
Recency: newer content preferred for time-sensitive facts (policies, prices, specs) -> a highly relevant BUT outdated passage can mislead
Authority: prefer more trustworthy/official sources when information conflicts (official policy > informal note)
CRITICAL: redundancy -> near-identical passages from top-K WASTE limited token budget
  -> naive inclusion of all similar passages leaves LESS budget for genuinely complementary, diverse sources
Source diversity: deliberately include DIFFERENT, complementary perspectives instead of repeating the same info
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Mehrdimensionale Rangordnung (Relevanz, Aktualität, Autorität) | werden diese drei Kriterien gemeinsam gewichtet, statt sich allein auf Relevanz zu verlassen? | eine reine Relevanzsortierung kann veraltete oder wenig autoritative, aber semantisch ähnliche Quellen bevorzugen |
| Aktive Redundanzerkennung | wird geprüft, ob mehrere Kandidatenpassagen inhaltlich stark überlappen, bevor sie alle in den Kontext aufgenommen werden? | ohne Redundanzerkennung wird begrenztes Tokenbudget für wiederholte statt für ergänzende Informationen verwendet |
| Bewusste Förderung von Quellenvielfalt | wird aktiv versucht, unterschiedliche, ergänzende Perspektiven statt wiederholter Information in den Kontext aufzunehmen? | fehlende Vielfaltsförderung kann zu einem einseitigen, wenig informativen Kontext trotz vieler Passagen führen |
| Tokenbudget-bewusste Priorisierung | wird die Reihenfolge der Aufnahme in den Kontext explizit an das verfügbare Tokenbudget gekoppelt? | ohne diese Kopplung kann das Tokenbudget durch niedrig priorisierte Passagen erschöpft werden, bevor hochpriorisierte Inhalte aufgenommen wurden |

Implementierung: Kandidatenpassagen aus dem Reranking werden nicht ausschließlich nach Relevanz, sondern nach einer gemeinsamen Gewichtung aus Relevanz, Aktualität und Autorität geordnet. Vor der endgültigen Aufnahme in den Kontext wird geprüft, ob eine Kandidatenpassage inhaltlich stark mit einer bereits aufgenommenen Passage überlappt (z. B. über einen Ähnlichkeitsschwellenwert oder ein Verfahren wie Maximal Marginal Relevance); stark redundante Passagen werden zugunsten vielfältigerer Alternativen zurückgestellt. Die Aufnahme in den Kontext erfolgt in absteigender Priorität, bis das verfügbare Tokenbudget erschöpft ist, sodass die höchstpriorisierten, nicht-redundanten Passagen sicher enthalten sind.

## Scalability, Reliability, Security und Observability

Kontextzusammenstellung skaliert die Informationsdichte des an das Sprachmodell übergebenen Kontexts proportional zur Konsequenz der Redundanzerkennung; die Reliability-Grenze liegt in einer naiven Top-K-Übernahme ohne Redundanzprüfung, die mit wachsender Ähnlichkeit im Wissensbestand proportional mehr Tokenbudget für wiederholte statt ergänzende Information verschwenden kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| generierte Antworten wirken einseitig oder wiederholen dieselbe Information mehrfach | mehrere redundante Passagen wurden ohne Redundanzprüfung in den Kontext aufgenommen | prüfen, ob eine Redundanzerkennung vor der finalen Kontextzusammenstellung stattgefunden hat |
| eine generierte Antwort basiert auf einer veralteten Information, obwohl eine aktuellere Quelle im Wissensbestand existiert | Aktualität wurde nicht als Rangordnungskriterium neben reiner Relevanz berücksichtigt | prüfen, ob die aktuellere Quelle eine höhere oder niedrigere Relevanzbewertung erhielt und ob Aktualität in der Rangordnung berücksichtigt wurde |
| relevante, hochpriorisierte Passagen fehlen im finalen Kontext, obwohl das Tokenbudget nicht vollständig ausgeschöpft scheint | die Priorisierungsreihenfolge bei der Tokenbudget-Zuteilung war nicht korrekt an die tatsächliche Wichtigkeit gekoppelt | prüfen, ob die Aufnahmereihenfolge in den Kontext der beabsichtigten Prioritätsordnung entsprach |

Security: Bei der Kontextzusammenstellung muss die bereits durch Zugriffsschranken gefilterte Kandidatenliste (siehe [KB-0312](08-metadatenfilter-und-zugriffsschranken.md)) erhalten bleiben — die Zusammenstellungslogik darf keine zusätzlichen, nicht autorisierten Quellen einbeziehen, etwa durch nachträgliches Auffüllen des Tokenbudgets aus einem ungefilterten Bestand. Observability: Anteil redundanter Passagen, die durch die Zusammenstellungslogik gefiltert wurden, durchschnittliche Quellenvielfalt im finalen Kontext und tatsächliche Tokenbudget-Ausnutzung sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Redundanzerkennung als festen Bestandteil der Kontextzusammenstellung. **Principal** macht die Gewichtung von Relevanz, Aktualität und Autorität für das Team nachvollziehbar dokumentiert. **Chief** positioniert Kontextzusammenstellung als eigenständige Optimierungsstufe zwischen Retrieval und Generierung.

Anti-Patterns: Top-K-Retrieval-Ergebnisse ohne Redundanzprüfung direkt in den Kontext übernehmen; ausschließlich nach Relevanz sortieren, ohne Aktualität oder Autorität zu berücksichtigen; Tokenbudget-Zuteilung ohne explizite Priorisierungsreihenfolge vornehmen.

## Production Checklist

- [ ] Passagen werden nach einer gemeinsamen Gewichtung aus Relevanz, Aktualität und Autorität geordnet.
- [ ] Redundante Passagen werden vor der Kontextaufnahme erkannt und zugunsten von Vielfalt zurückgestellt.
- [ ] Die Aufnahmereihenfolge ist explizit an das verfügbare Tokenbudget gekoppelt.
- [ ] Zugriffsschranken aus dem Retrieval-Schritt bleiben bei der Zusammenstellung vollständig erhalten.

## Interviewfragen

### 1. Warum reicht reine Relevanzsortierung für die Kontextzusammenstellung nicht aus?

**Antwort:** Eine hoch relevante, aber veraltete oder wenig autoritative Passage kann irreführend sein; Aktualität und Autorität müssen als zusätzliche Kriterien neben Relevanz berücksichtigt werden.

### 2. Warum ist Redundanzerkennung bei der Kontextzusammenstellung wichtig?

**Antwort:** Ohne sie verschwendet eine naive Übernahme mehrerer sehr ähnlicher Passagen begrenztes Tokenbudget, das stattdessen für tatsächlich ergänzende, vielfältige Informationsquellen genutzt werden könnte.

### 3. Was bedeutet Quellenvielfalt im Kontext der Kontextzusammenstellung?

**Antwort:** Bewusste Einbeziehung unterschiedlicher, sich ergänzender Perspektiven oder Aspekte in den Kontext, statt dieselbe Information mehrfach zu wiederholen.

### 4. Wie sollte die Aufnahmereihenfolge in den Kontext bei begrenztem Tokenbudget gestaltet werden?

**Antwort:** In absteigender Priorität basierend auf der gemeinsamen Gewichtung aus Relevanz, Aktualität und Autorität, bis das verfügbare Tokenbudget erschöpft ist, sodass die höchstpriorisierten Inhalte sicher enthalten sind.

### 5. Wie diagnostizierst du eine generierte Antwort, die wiederholt dieselbe Information präsentiert?

**Antwort:** Ich prüfe, ob eine Redundanzerkennung vor der finalen Kontextzusammenstellung stattgefunden hat — fehlt sie, wurden wahrscheinlich mehrere ähnliche Passagen ungefiltert in den Kontext aufgenommen.

### 6. Widersprüchliche Anforderung: Team will maximale Anzahl an Quellenpassagen im Kontext für umfassende Antworten UND garantiert effiziente Nutzung des begrenzten Tokenbudgets ohne Redundanz — wie gehst du vor?

**Antwort:** Ich würde erklären, dass mehr Passagen ohne Redundanzprüfung nicht automatisch mehr Information bedeuten, wenn viele davon inhaltlich überlappen; ich würde vorschlagen, aktive Redundanzfilterung einzusetzen, damit die begrenzte Anzahl an Passagen, die ins Tokenbudget passen, tatsächlich maximale, nicht-redundante Informationsvielfalt liefert.

## Praktische Labs

~~~python
# Context assembly with redundancy filtering vs naive top-K inclusion
candidates = [
    {"id": "p1", "text": "Standard tier pricing is $10/month.", "relevance": 0.95},
    {"id": "p2", "text": "The standard tier costs $10 per month.", "relevance": 0.93},  # near-duplicate of p1
    {"id": "p3", "text": "Enterprise tier includes custom SLAs.", "relevance": 0.80},  # complementary info
]

def text_similarity(a, b):
    a_words, b_words = set(a.lower().split()), set(b.lower().split())
    return len(a_words & b_words) / len(a_words | b_words)

def assemble_context(candidates, token_budget=2, redundancy_threshold=0.5):
    selected = []
    for candidate in sorted(candidates, key=lambda c: -c["relevance"]):
        if len(selected) >= token_budget:
            break
        is_redundant = any(text_similarity(candidate["text"], s["text"]) > redundancy_threshold for s in selected)
        if is_redundant:
            continue
        selected.append(candidate)
    return selected

naive_top_k = sorted(candidates, key=lambda c: -c["relevance"])[:2]
print("Naive top-K (wastes budget on near-duplicate p1/p2):")
for c in naive_top_k:
    print(f"  {c['id']}: {c['text']}")

redundancy_aware = assemble_context(candidates, token_budget=2)
print("\nRedundancy-aware assembly (includes p3 for diversity instead of duplicate p2):")
for c in redundancy_aware:
    print(f"  {c['id']}: {c['text']}")
~~~

## Dependencies, Cross-References und Quellen

1. Carbonell, Goldstein: [Maximal Marginal Relevance for Diversity-Aware Ranking](https://dl.acm.org/doi/10.1145/290941.291025), abgerufen 2026-09-17.
2. Anthropic: [Building Effective AI Agents — Context Engineering](https://www.anthropic.com/engineering/building-effective-agents), abgerufen 2026-09-17.
3. LangChain: [Contextual Compression Documentation](https://python.langchain.com/docs/how_to/contextual_compression/), abgerufen 2026-09-17.

Reranking und Kandidatenauswahl sind kanonisch in [KB-0314](10-reranking-und-kandidatenauswahl.md) behandelt; Context Engineering in [KB-0245](../11-genai-architecture/05-context-engineering.md); Metadatenfilter und Zugriffsschranken in [KB-0312](08-metadatenfilter-und-zugriffsschranken.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Kontextkompression, die redundante Passagen zusammenfasst statt vollständig auszuschließen | Emerging | Beobachten; vielversprechend für Informationserhalt bei gleichzeitiger Redundanzreduktion, aber noch nicht breit produktionsreif etabliert. |
| Dynamische Tokenbudget-Allokation basierend auf der geschätzten Antwortkomplexität der jeweiligen Anfrage | Emerging | Beobachten; würde starre Budgetgrenzen durch bedarfsgerechte Allokation ersetzen, aber Reifegrad noch nicht ausreichend belegt. |

Ein Team akzeptiert eine Kontextzusammenstellungsstrategie erst, wenn Rangordnungskriterien, Redundanzerkennung und Tokenbudget-Priorisierung dokumentiert und getestet sind.
