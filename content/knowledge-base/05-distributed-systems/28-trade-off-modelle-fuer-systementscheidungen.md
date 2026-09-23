---
{"id": "KB-0128", "title": "Trade-off-Modelle für Systementscheidungen", "domain": "05", "sequence": 28, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0127", "concepts": ["Operationalisierte Anforderungen"], "needed_for": "both"}], "related": ["KB-0126", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Entscheidungsmatrix mit expliziten Achsen und Sensitivitätsanalyse für ein Beispielszenario selbst erstellen.", "rationale": "Kein reales Projekt nötig, um die Methodik zu üben."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Systementscheidung Entscheidungsachsen, Unsicherheit und Sensitivität explizit gegeneinander abwägen.", "rationale": "Implizite Trade-off-Entscheidungen sind später nicht nachvollziehbar oder überprüfbar."}, "STAFF-TARGET": {"active": true, "scope": "Eine getroffene Architekturentscheidung anhand der zugrunde liegenden Trade-off-Achsen kritisch hinterfragen.", "rationale": "Explizite Achsen machen sichtbar, welche Annahme sich geändert haben könnte."}, "CHIEF-TARGET": {"active": true, "scope": "Explizite Trade-off-Dokumentation als Pflichtbestandteil von Architecture Decision Records verlangen.", "rationale": "Nachvollziehbare Entscheidungsbegründung ist Voraussetzung für spätere Neubewertung."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Formale multikriterielle Entscheidungsanalyse (z. B. gewichtete Scoring-Modelle) ist Vertiefung.", "rationale": "Kern ist explizite Achsen, Unsicherheit und Sensitivität, nicht eine bestimmte formale Notation."}}, "lab_validation": [{"lab_id": "KB-0128-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Modell für eine Trade-off-Matrix mit Sensitivitätsanalyse", "evidence": "Eine Änderung der angenommenen Lastannahme um 50% ändert das Ranking zweier Architekturvarianten, was die Sensitivität der Entscheidung gegenüber dieser Annahme sichtbar macht.", "limitations": "Kein reales Projekt, rein methodische Übung."}]}
---
# Trade-off-Modelle für Systementscheidungen

> **Ziel:** Eine Architekturentscheidung ohne explizite Achsen, Unsicherheitsangabe und Sensitivitätsprüfung ist später nicht nachvollziehbar und nicht überprüfbar, wenn sich Annahmen ändern. Ein Trade-off-Modell macht sichtbar, entlang welcher Kriterien Alternativen verglichen wurden, wie sicher die zugrunde liegenden Annahmen sind, und wie empfindlich die Entscheidung auf Annahmeänderungen reagiert.

## Zweck, Mental Model und Dependencies

Eine Entscheidung wie „wir nutzen System X statt Y" braucht mehr als eine Liste von Vor- und Nachteilen — sie braucht explizite Entscheidungsachsen (z. B. Konsistenz, Betriebskomplexität, Kosten, Latenz), eine Einschätzung der Unsicherheit jeder zugrunde liegenden Annahme (wie sicher ist die angenommene Last?), und eine Sensitivitätsprüfung (würde sich das Ergebnis ändern, wenn eine Annahme um 50% abweicht?). Diese Struktur baut direkt auf operationalisierten Anforderungen ([KB-0127](27-nichtfunktionale-anforderungen-operationalisieren.md)) auf. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0127](27-nichtfunktionale-anforderungen-operationalisieren.md).

~~~text
axes: [consistency, ops complexity, cost, latency] -> score each alternative per axis
assumption: "expected load = 10k req/s" (confidence: medium)
sensitivity check: if load = 15k req/s (+50%), does the ranking of alternatives change?
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Häufiger Fehler |
|---|---|---|
| Entscheidungsachsen | welche Kriterien sind für diese Entscheidung relevant? | zu wenige oder implizite Achsen, wichtige Kriterien fehlen |
| Unsicherheit | wie sicher ist jede zugrunde liegende Annahme? | Annahmen als Fakten behandelt statt als unsichere Schätzung markiert |
| Sensitivität | ändert sich das Ergebnis bei Annahmeänderung? | Entscheidung wirkt robust, ist aber tatsächlich knapp und annahmesensitiv |
| Dokumentation | ist die Begründung später nachvollziehbar? | „wir haben uns für X entschieden" ohne Achsen/Annahmen-Protokoll |

Implementierung: für jede wesentliche Architekturentscheidung eine kurze Matrix erstellen — Zeilen sind Alternativen, Spalten sind explizite Achsen, Zellen enthalten eine begründete Einschätzung (nicht nur eine Zahl ohne Kontext). Jede kritische Annahme (Last, Wachstum, Teamgröße, Budget) wird mit einer Unsicherheitsangabe versehen. Eine Sensitivitätsprüfung testet, ob eine plausible Abweichung der unsichersten Annahme das Ranking der Alternativen ändert — wenn ja, ist die Entscheidung fragil und sollte das explizit vermerken.

## Scalability, Reliability, Security und Observability

Diese Methodik skaliert als Entscheidungswerkzeug über Teamgröße und Organisationskomplexität — je mehr Stakeholder eine Entscheidung betrifft, desto wichtiger wird explizite, nachvollziehbare Dokumentation. Reliability-Grenze der Methodik: eine Sensitivitätsprüfung deckt nur die explizit identifizierten unsicheren Annahmen ab — unentdeckte, nicht berücksichtigte Annahmen bleiben ein blinder Fleck.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Architekturentscheidung wird nach kurzer Zeit infrage gestellt | zugrunde liegende Annahme änderte sich, Entscheidung war sensitiv darauf | Sensitivitätsprüfung nachträglich mit aktuellen Werten wiederholen |
| Team ist uneinig über die richtige Wahl trotz „objektiver" Analyse | implizite unterschiedliche Gewichtung der Achsen zwischen Beteiligten | Gewichtung der Achsen explizit diskutieren und dokumentieren |
| Entscheidung kann nicht erklärt werden, wenn neue Teammitglieder fragen | keine dokumentierte Trade-off-Matrix vorhanden | Architecture Decision Record auf Vorhandensein der Matrix prüfen |
| zwei Alternativen erscheinen knapp gleich gut | Entscheidung ist grenzwertig und stark annahmesensitiv | explizite Sensitivitätsprüfung durchführen, statt subjektiv zu entscheiden |

Security: Sicherheitsrelevante Achsen (Angriffsfläche, Blast Radius, Compliance-Aufwand) sollten als eigene, nicht implizite Achsen in der Matrix auftauchen, statt in „Betriebskomplexität" versteckt zu werden. Observability: die getroffene Entscheidung sollte einen definierten Neubewertungsauslöser haben (welche Metrik, welcher Schwellenwert löst eine erneute Prüfung aus).

## Trade-offs und Entscheidungen

**Staff** erstellt für jede nicht-triviale technische Entscheidung eine kurze, explizite Trade-off-Matrix statt einer informellen Diskussion ohne Dokumentation. **Principal** verlangt, dass Unsicherheit und Sensitivität explizit benannt werden, besonders bei knappen Entscheidungen. **Chief** etabliert Trade-off-Dokumentation mit Neubewertungsauslösern als Pflichtbestandteil von Architecture Decision Records.

Anti-Patterns: eine Entscheidung nachträglich rechtfertigen, statt sie vorab anhand expliziter Achsen herzuleiten; Annahmen als sicher behandeln, ohne Unsicherheit zu benennen; keine Sensitivitätsprüfung bei knappen Entscheidungen durchführen, obwohl das Ergebnis stark von einer unsicheren Annahme abhängt.

## Production Checklist

- [ ] Entscheidungsachsen für jede wesentliche Architekturentscheidung explizit benannt.
- [ ] Unsicherheit jeder kritischen zugrunde liegenden Annahme dokumentiert.
- [ ] Sensitivitätsprüfung für knappe oder annahmeabhängige Entscheidungen durchgeführt.
- [ ] Neubewertungsauslöser (Metrik, Schwellenwert) für die getroffene Entscheidung definiert.

## Interviewfragen

### 1. Warum reicht eine einfache Vor-/Nachteile-Liste nicht für eine wichtige Architekturentscheidung?

**Antwort:** Sie macht weder explizit, wie stark jedes Kriterium gewichtet wird, noch wie sicher die zugrunde liegenden Annahmen sind, noch ob die Entscheidung bei veränderten Annahmen noch Bestand hätte.

### 2. Was ist eine Sensitivitätsprüfung im Kontext von Architekturentscheidungen?

**Antwort:** Die Prüfung, ob eine plausible Abweichung einer unsicheren zugrunde liegenden Annahme (z. B. Last, Wachstum) das Ranking der verglichenen Alternativen verändern würde.

### 3. Warum sollte Unsicherheit explizit dokumentiert werden?

**Antwort:** Weil eine als sicher behandelte, aber tatsächlich unsichere Annahme später zu einer fälschlich als robust wahrgenommenen Entscheidung führt, die bei Annahmeänderung überraschend fragil ist.

### 4. Was gehört in einen Neubewertungsauslöser?

**Antwort:** Eine konkrete Metrik und ein Schwellenwert, bei deren Überschreitung die getroffene Entscheidung aktiv erneut geprüft werden sollte, statt sie unbefristet als final zu betrachten.

### 5. Wie gehst du mit uneinigen Stakeholdern bei einer „objektiven" Trade-off-Analyse um?

**Antwort:** Ich würde prüfen, ob die Uneinigkeit tatsächlich aus unterschiedlicher impliziter Gewichtung der Achsen entsteht, und diese Gewichtung explizit zur Diskussion stellen, statt die Uneinigkeit als reinen Meinungsstreit zu behandeln.

### 6. Widersprüchliche Anforderung: Management will eine schnelle Entscheidung UND vollständige Trade-off-Dokumentation mit Sensitivitätsanalyse — wie gehst du vor?

**Antwort:** Ich würde eine verkürzte, aber vollständige Matrix mit den wichtigsten zwei bis drei Achsen und einer schnellen Sensitivitätsprüfung nur der unsichersten Annahme anbieten, statt entweder überstürzt ohne Dokumentation zu entscheiden oder eine vollständige, zeitaufwendige Analyse zu erzwingen.

## Praktische Labs

~~~python
def rank(alternatives, load):
    scores = {}
    for name, cost_per_req in alternatives.items():
        scores[name] = cost_per_req * load
    return sorted(scores, key=scores.get)

alternatives = {"managed_service": 0.002, "self_hosted": 0.0015}
ranking_base = rank(alternatives, load=10_000)
ranking_high_load = rank(alternatives, load=15_000)  # +50% assumption change
print("Ranking at base load:", ranking_base)
print("Ranking at +50% load:", ranking_high_load)
~~~

## Dependencies, Cross-References und Quellen

1. Kazman, Bass, Klein: [ATAM: Method for Architecture Evaluation](https://insights.sei.cmu.edu/library/atam-method-for-architecture-evaluation/), Software Engineering Institute, abgerufen 2026-09-17.

Diese Methodik ist zeitstabil; konkrete Kostenannahmen und Vergleichswerte sollten dennoch gegen aktuelle Anbieterpreise geprüft werden.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte Generierung von Trade-off-Matrizen aus Anforderungsdokumenten | Emerging | Vorschläge immer gegen eigene Sensitivitätsprüfung und Domänenwissen validieren. |

Diese Methodik ist ein etabliertes, stabiles Werkzeug; der Bonus betrifft primär, wie Tooling die Matrix-Erstellung beschleunigen kann, ohne die kritische Prüfung von Unsicherheit und Sensitivität zu ersetzen.
