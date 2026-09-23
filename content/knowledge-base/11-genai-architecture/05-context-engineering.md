---
{"id": "KB-0245", "title": "Context Engineering", "domain": "11", "sequence": 5, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0243", "concepts": ["Kontextfenster"], "needed_for": "understanding"}, {"id": "KB-0244", "concepts": ["Prompt Design"], "needed_for": "understanding"}], "related": ["KB-0205"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Kontext-Kompositionsmodell mit Aktualitäts- und Autoritätspriorisierung bei begrenztem Tokenbudget lokal implementieren.", "rationale": "Die Entscheidung, welche Evidenz bei begrenztem Platz Vorrang hat, wird erst durch konkrete Priorisierungslogik greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Kontextkomposition (Instruktionen, Evidenz, Werkzeugergebnisse) für einen konkreten Anwendungsfall als systemische Architekturentscheidung begründet gestalten.", "rationale": "Context Engineering ist eine Systemdesign-Aufgabe, die über einzelne Prompt-Formulierung hinausgeht und mehrere Eingabequellen koordiniert."}, "STAFF-TARGET": {"active": true, "scope": "Widersprüchliche Modellausgaben auf veraltete oder nicht-autoritative Evidenz im zusammengesetzten Kontext statt auf ein Modellproblem zurückführen können.", "rationale": "Wenn mehrere Evidenzquellen mit unterschiedlicher Aktualität oder Autorität kombiniert werden, kann veraltete Information die Ausgabe verfälschen, ohne dass dies ein Modellfehler ist."}, "CHIEF-TARGET": {"active": true, "scope": "Context Engineering als systemische Eingabeentscheidung positionieren, die Aktualität, Autorität und Tokenpriorisierung explizit steuert, nicht als bloße Prompt-Formulierung.", "rationale": "Der Unterschied zu reinem Prompt Design liegt in der systemischen Zusammenstellung mehrerer dynamischer Eingabequellen, nicht nur statischer Anweisungstexte."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Werkzeugspezifische Context-Assembly-Frameworks sind Vertiefung.", "rationale": "Kern ist das Prinzip von Aktualität, Autorität und Tokenpriorisierung bei Kontextkomposition, nicht die Framework-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0245-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Kontextkomposition mit Aktualitäts-/Autoritätspriorisierung bei begrenztem Tokenbudget", "evidence": "Bei begrenztem Tokenbudget werden aktuellere und autoritativere Evidenzquellen bevorzugt in den Kontext aufgenommen, veraltete oder weniger autoritative Quellen werden zuerst verworfen.", "limitations": "Kein echtes produktives Retrieval-System, keine reale Werkzeugintegration, keine Produktion."}]}
---
# Context Engineering

> **Ziel:** Context Engineering komponiert systemisch Instruktionen, Evidenz (z. B. aus Retrieval, siehe [KB-0205](../09-databases-storage/11-vektordatenbanken-und-ann-indizes.md)) und Werkzeugergebnisse zu einem kohärenten Modelleingabe — es ist eine Systemarchitekturentscheidung, die Aktualität, Autorität und Tokenpriorisierung explizit steuert, nicht bloße Prompt-Formulierung (siehe [KB-0244](04-prompt-design-und-anweisungsstruktur.md)) mit statischem Text.

## Zweck, Mental Model und Dependencies

Während Prompt Design (siehe [KB-0244](04-prompt-design-und-anweisungsstruktur.md)) primär statische Anweisungsstruktur (Rolle, Beispiele, Constraints) betrifft, behandelt Context Engineering die dynamische Zusammenstellung mehrerer Eingabequellen zur Laufzeit: Instruktionen (die grundlegende Aufgabenbeschreibung), Evidenz (z. B. abgerufene Dokumente aus einem Retrieval-System) und Werkzeugergebnisse (Ausgaben externer Funktionsaufrufe, die das Modell während der Interaktion nutzt). Diese Quellen müssen systemisch zu einem kohärenten Gesamtkontext zusammengesetzt werden, mit expliziten Entscheidungen über Priorisierung: Aktualität bedeutet, dass bei mehreren möglichen Evidenzquellen neuere Information tendenziell bevorzugt wird, sofern nicht explizit historischer Kontext benötigt wird — veraltete Evidenz, die unreflektiert in den Kontext aufgenommen wird, kann zu faktisch falschen oder widersprüchlichen Ausgaben führen. Autorität bedeutet, dass nicht alle Evidenzquellen gleichwertig vertrauenswürdig sind — eine offizielle Dokumentationsquelle sollte gegenüber einer informellen, möglicherweise veralteten Quelle bevorzugt werden, wenn beide zur Verfügung stehen. Tokenpriorisierung ist die praktische Konsequenz aus begrenztem Kontextfenster (siehe [KB-0243](03-kontextfenster-und-informationsgrenzen.md)): bei mehr verfügbarer Evidenz, als in das Budget passt, muss systematisch entschieden werden, welche Information Vorrang erhält, statt willkürlich oder nach Verfügbarkeitsreihenfolge zu kürzen.

~~~text
Prompt design:       static instruction structure (role, examples, constraints)
Context engineering: DYNAMIC composition of instructions + retrieved evidence + tool results at runtime
Priority dimensions: RECENCY (prefer current over stale) + AUTHORITY (prefer trusted over informal) + TOKEN BUDGET (what fits, deliberately chosen)
Unmanaged composition -> stale/low-authority evidence silently dilutes or contradicts the model's output
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Aktualitätspriorisierung | wird neuere Evidenz systematisch gegenüber veralteter bevorzugt, wenn beide verfügbar sind? | veraltete Evidenz im Kontext erzeugt faktisch falsche oder widersprüchliche Ausgaben |
| Autoritätspriorisierung | werden vertrauenswürdigere Quellen systematisch gegenüber informellen bevorzugt? | niedrig-autoritative Quellen im Kontext können fälschlich als gleichwertig zuverlässig behandelt werden |
| Tokenbudget-Priorisierung | ist bei begrenztem Platz eine explizite, systematische Auswahlregel für Evidenz definiert? | willkürliche oder verfügbarkeitsbasierte Kürzung lässt relevante Information zufällig wegfallen |
| Werkzeugergebnis-Integration | werden Werkzeugergebnisse strukturiert und klar von Instruktionen/Evidenz getrennt in den Kontext integriert? | vermischte, unstrukturierte Integration erschwert dem Modell die Unterscheidung zwischen Anweisung und Datenquelle |

Implementierung: Evidenzquellen werden mit expliziten Metadaten (Zeitstempel, Autoritätsstufe) versehen, die eine systematische Priorisierungsregel ermöglichen, statt Evidenz unstrukturiert und ungeordnet in den Kontext einzufügen. Bei begrenztem Tokenbudget wird eine explizite Auswahlregel angewendet (z. B. "aktuellste und autoritativste N Quellen zuerst"), statt Evidenz nach zufälliger Verfügbarkeitsreihenfolge zu kürzen. Werkzeugergebnisse werden strukturell klar von Instruktionen und Evidenz getrennt (z. B. durch explizite Kennzeichnung, welcher Kontextteil eine Werkzeugausgabe ist), damit das Modell die Herkunft und den Vertrauensgrad jeder Information unterscheiden kann. Die Gesamtkomposition wird als systemische Architekturentscheidung dokumentiert (welche Quellen, in welcher Priorität, mit welcher Kürzungsregel), nicht als Ad-hoc-Entscheidung zur Laufzeit ohne nachvollziehbare Logik.

## Scalability, Reliability, Security und Observability

Context Engineering skaliert Antwortqualität über wachsende, vielfältige Evidenzquellen, wenn systematische Priorisierungsregeln statt Ad-hoc-Zusammenstellung genutzt werden. Reliability-Grenze: unmanaged Kontextkomposition ist ein latentes Risiko, das erst sichtbar wird, wenn tatsächlich mehrere, teilweise widersprüchliche Evidenzquellen gleichzeitig verfügbar sind — bei einer einzigen, konsistenten Quelle bleibt das Problem unsichtbar, bis die Datenlandschaft komplexer wird.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Modellausgabe enthält widersprüchliche oder veraltete Information trotz aktueller verfügbarer Quellen | Kontextkomposition priorisiert Aktualität nicht systematisch, veraltete Evidenz beeinflusst die Ausgabe | Zeitstempel der tatsächlich in den Kontext aufgenommenen Evidenz gegen verfügbare aktuellere Quellen prüfen |
| Modell behandelt eine informelle, wenig vertrauenswürdige Quelle wie eine offizielle Dokumentation | fehlende Autoritätspriorisierung, alle Quellen werden gleichwertig behandelt | Autoritätsstufe der im Kontext enthaltenen Quellen gegen die tatsächliche Vertrauenswürdigkeit prüfen |
| relevante Evidenz fehlt in der Ausgabe, obwohl sie ursprünglich verfügbar war | Tokenbudget-Kürzung erfolgte ohne systematische Priorisierungsregel | Kürzungslogik auf explizite, nachvollziehbare Auswahlregel statt Zufallsreihenfolge prüfen |
| Modell verwechselt eine Werkzeugausgabe mit einer direkten Anweisung | fehlende strukturelle Trennung zwischen Instruktionen, Evidenz und Werkzeugergebnissen im Kontext | Kontextstruktur auf klare, für das Modell erkennbare Kennzeichnung jeder Quellenart prüfen |

Security: Werkzeugergebnisse und extern abgerufene Evidenz sollten wie potenziell nicht vertrauenswürdige Eingaben behandelt werden, da sie außerhalb der direkten Kontrolle des Systembetreibers liegen können — eine strukturelle Trennung zwischen vertrauenswürdigen Systemanweisungen und extern stammender Evidenz reduziert das Risiko, dass manipulierte externe Inhalte als autoritative Anweisung fehlinterpretiert werden (Indirect Prompt Injection). Observability: Anteil aktueller versus veralteter Evidenz im tatsächlich genutzten Kontext, Autoritätsverteilung der einbezogenen Quellen und Häufigkeit von Tokenbudget-bedingten Kürzungen sind zentrale Metriken für Context-Engineering-Qualität.

## Trade-offs und Entscheidungen

**Staff** versieht Evidenzquellen mit expliziten Metadaten für systematische Priorisierung. **Principal** macht Kürzungsregeln bei begrenztem Tokenbudget für das Team nachvollziehbar dokumentiert. **Chief** positioniert Context Engineering als systemische Architekturentscheidung mit expliziter Aktualitäts-, Autoritäts- und Tokenpriorisierung, nicht als bloße Prompt-Formulierung.

Anti-Patterns: Evidenz unstrukturiert und ohne Metadaten in den Kontext einfügen; bei begrenztem Tokenbudget nach willkürlicher Verfügbarkeitsreihenfolge statt systematischer Priorisierungsregel kürzen; Werkzeugergebnisse ohne strukturelle Trennung von Instruktionen vermischen.

## Production Checklist

- [ ] Evidenzquellen sind mit Aktualitäts- und Autoritätsmetadaten versehen.
- [ ] Eine explizite, dokumentierte Auswahlregel steuert Kürzung bei begrenztem Tokenbudget.
- [ ] Werkzeugergebnisse sind strukturell klar von Instruktionen und Evidenz getrennt.
- [ ] Externe Evidenz wird wie potenziell nicht vertrauenswürdige Eingabe behandelt (Prompt-Injection-Bewusstsein).

## Interviewfragen

### 1. Was unterscheidet Context Engineering von reinem Prompt Design?

**Antwort:** Prompt Design betrifft primär statische Anweisungsstruktur (Rolle, Beispiele, Constraints), während Context Engineering die dynamische, systemische Zusammenstellung mehrerer Eingabequellen (Instruktionen, Retrieval-Evidenz, Werkzeugergebnisse) zur Laufzeit mit expliziter Aktualitäts-, Autoritäts- und Tokenpriorisierung behandelt.

### 2. Warum kann veraltete Evidenz im Kontext zu faktisch falschen Ausgaben führen, auch wenn aktuellere Information verfügbar wäre?

**Antwort:** Ohne systematische Aktualitätspriorisierung kann eine Kontextkomposition veraltete Evidenz gleichwertig neben aktueller Information einbeziehen, was das Modell zu einer Mischung aus korrekter und überholter Information verleiten kann, statt konsequent die aktuellste verfügbare Quelle zu nutzen.

### 3. Warum ist eine explizite Kürzungsregel bei begrenztem Tokenbudget wichtig?

**Antwort:** Ohne systematische Regel (z. B. nach Aktualität und Autorität priorisieren) wird Evidenz nach zufälliger Verfügbarkeitsreihenfolge gekürzt, was relevante Information willkürlich wegfallen lassen kann, statt bewusst die wichtigste Evidenz im begrenzten Budget zu erhalten.

### 4. Wie diagnostizierst du, dass eine Modellausgabe durch veraltete Evidenz im Kontext verfälscht wurde?

**Antwort:** Ich prüfe die Zeitstempel der tatsächlich in den Kontext aufgenommenen Evidenz gegen verfügbare aktuellere Quellen — wenn aktuellere Information verfügbar war, aber nicht im Kontext berücksichtigt wurde, deutet das auf fehlende Aktualitätspriorisierung hin.

### 5. Warum sollten Werkzeugergebnisse strukturell von Instruktionen getrennt werden?

**Antwort:** Eine klare Trennung hilft dem Modell, zwischen vertrauenswürdigen Systemanweisungen und potenziell extern beeinflussten Daten (Werkzeugergebnisse, abgerufene Evidenz) zu unterscheiden, was sowohl die Interpretationsqualität verbessert als auch das Risiko von Indirect Prompt Injection reduziert.

### 6. Widersprüchliche Anforderung: Anwendung soll möglichst viel verfügbare Evidenz für maximale Antwortqualität einbeziehen UND striktes, kleines Tokenbudget für minimale Kosten einhalten — wie gehst du vor?

**Antwort:** Ich würde erklären, dass beide Ziele bei tatsächlich umfangreicher verfügbarer Evidenz im Konflikt stehen; ich würde eine explizite, systematische Priorisierungsregel (Aktualität und Autorität zuerst) implementieren, die innerhalb des strikten Budgets die wertvollste verfügbare Evidenz auswählt, statt entweder unreflektiert alles einzubeziehen oder willkürlich zu kürzen — der Kompromiss liegt in bewusster Selektion, nicht in der Aufgabe eines der beiden Ziele.

## Praktische Labs

~~~python
from datetime import datetime

# Context composition with recency + authority prioritization under token budget
evidence_sources = [
    {"text": "Policy updated in 2026 with new rate limits.", "timestamp": datetime(2026, 8, 1), "authority": "official_docs", "tokens": 50},
    {"text": "Old forum post suggesting different rate limits.", "timestamp": datetime(2023, 1, 1), "authority": "informal", "tokens": 40},
    {"text": "Official API reference on rate limiting.", "timestamp": datetime(2026, 9, 1), "authority": "official_docs", "tokens": 60},
    {"text": "Blog post with outdated rate limit example.", "timestamp": datetime(2022, 5, 1), "authority": "informal", "tokens": 45},
]

AUTHORITY_RANK = {"official_docs": 2, "informal": 1}
TOKEN_BUDGET = 100

def prioritize_evidence(sources, budget):
    ranked = sorted(sources, key=lambda s: (AUTHORITY_RANK[s["authority"]], s["timestamp"]), reverse=True)
    selected = []
    used_tokens = 0
    for source in ranked:
        if used_tokens + source["tokens"] <= budget:
            selected.append(source)
            used_tokens += source["tokens"]
    return selected

selected = prioritize_evidence(evidence_sources, TOKEN_BUDGET)
for s in selected:
    print(f"Selected: '{s['text']}' (authority={s['authority']}, date={s['timestamp'].date()})")

assert all(s["authority"] == "official_docs" for s in selected)
print("\nOnly current, official sources made it into the limited budget - stale/informal evidence was systematically excluded, not randomly.")
~~~

## Dependencies, Cross-References und Quellen

1. Anthropic: [Context Engineering Best Practices](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview), abgerufen 2026-09-17.
2. LangChain: [Retrieval-Augmented Generation Patterns](https://python.langchain.com/docs/concepts/rag/), abgerufen 2026-09-17.
3. Lewis et al.: [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401), NeurIPS 2020, abgerufen 2026-09-17.

Kontextfenster- und Prompt-Design-Grundlagen sind kanonisch in [KB-0243](03-kontextfenster-und-informationsgrenzen.md) und [KB-0244](04-prompt-design-und-anweisungsstruktur.md) behandelt. Vektordatenbank-Retrieval-Grundlagen sind in [KB-0205](../09-databases-storage/11-vektordatenbanken-und-ann-indizes.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, metadatenbasierte Kontext-Kompaktierung mit dynamischer Aktualitäts-/Autoritätsbewertung | Adopting | Für Anwendungen mit vielen dynamischen Evidenzquellen gegenüber statischer, manueller Priorisierung bevorzugen. |
| Strukturierte Kontext-Formate mit expliziter Quellentyp-Kennzeichnung als Industriestandard-Praxis | Established | Für neue Anwendungen standardmäßig gegenüber unstrukturiertem Freitext-Kontext nutzen. |

Ein Team akzeptiert ein Context-Engineering-Design erst, wenn Aktualitäts-/Autoritätspriorisierung und Tokenbudget-Kürzungsregel nachweisbar dokumentiert sind.
