---
{"id": "KB-0365", "title": "Evaluationsdatensätze", "domain": "15", "sequence": 15, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0346", "concepts": ["Datensplits und Leakage"], "needed_for": "understanding"}], "related": ["KB-0364"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Evaluationsdatensatz aus realen Aufgaben, Negativfällen und relevanten Subgruppen zusammenstellen und dessen Nutzungsrechte dokumentieren.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Struktur gestalten, die Entwicklungs- und Abnahme-Evaluationsdatensätze organisatorisch und technisch strikt trennt, um Overfitting auf den Abnahmedatensatz zu verhindern.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein Entwicklungsteam wiederholten Zugriff auf den Abnahmedatensatz nutzt, um darauf zu optimieren, und dies durch eine strukturelle Trennung unterbinden.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Strikte organisatorische Trennung zwischen Entwicklungs- und Abnahme-Evaluationsdatensätzen als Governance-Standard im Unternehmen etablieren, um glaubwürdige Abnahmeentscheidungen zu sichern.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die rechtliche Prüfung komplexer, mehrschichtiger Nutzungsrechte bei Drittanbieter-Datenquellen ist Vertiefung.", "rationale": "Kern ist das Verständnis der Trennungsdisziplin und grundlegender Nutzungsrechtsdokumentation, nicht die juristische Detailprüfung."}}, "lab_validation": [{"lab_id": "KB-0365-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Szenario mit getrenntem Entwicklungs- und Abnahmedatensatz gegenüber einem gemeinsam genutzten Datensatz", "evidence": "Ein Entwicklungsteam, das wiederholten Zugriff auf denselben Datensatz für Entwicklung und Abnahme hat, erzielt bei simulierter wiederholter Optimierung eine zunehmend höhere, aber zunehmend weniger repräsentative Punktzahl auf diesem Datensatz, während ein strikt getrennter Abnahmedatensatz stabil die tatsächliche, unverzerrte Leistung widerspiegelt.", "limitations": "Kein produktives Datensatzverwaltungssystem, kein realer Geschäftsdatensatz, simuliertes Optimierungsverhalten."}]}
---
# Evaluationsdatensätze

> **Ziel:** Ein belastbarer Evaluationsdatensatz sammelt reale Aufgaben (tatsächliche, repräsentative Nutzungsszenarien statt künstlich konstruierter Beispiele), Negativfälle (Beispiele, bei denen die korrekte Antwort eine Ablehnung oder ein "ich weiß es nicht" ist) und relevante Subgruppen, aufbauend auf der allgemeinen Datensplit-Disziplin (siehe [KB-0346](../14-ml-engineering/16-datensplits-und-leakage.md)). Der zentrale Governance-Punkt dieses Kapitels ist die strikte organisatorische und technische Trennung zwischen Entwicklungs- und Abnahme-Evaluationsdatensätzen, ergänzt um nachvollziehbare Nutzungsrechte und Annotation der gesammelten Daten.

## Zweck, Mental Model und Dependencies

Reale Aufgaben in einem Evaluationsdatensatz spiegeln tatsächliche Nutzungsszenarien wider, statt nur einfache, künstlich konstruierte Beispiele zu enthalten, die die tatsächliche Schwierigkeit und Vielfalt realer Anfragen unterschätzen könnten. Negativfälle sind ebenso wichtig wie positive Fälle: ein System muss nicht nur korrekte Antworten liefern können, sondern auch erkennen, wann keine ausreichend fundierte Antwort möglich ist und eine Ablehnung die korrekte Reaktion ist — ein Evaluationsdatensatz ohne Negativfälle kann ein System, das niemals ablehnt, fälschlich als vollständig kompetent bewerten. Relevante Subgruppen im Datensatz ermöglichen die in der Robustheitsprüfung beschriebene getrennte Bewertung (siehe Subgruppenfehler), statt nur eine globale Durchschnittsmetrik zu berichten. Der zentrale Governance-Punkt ist die strikte Trennung zwischen einem Entwicklungsdatensatz (den ein Team beliebig zur iterativen Verbesserung nutzen darf) und einem Abnahmedatensatz (der für die finale Freigabeentscheidung reserviert ist und dem Entwicklungsteam nicht für wiederholte Optimierung zur Verfügung steht) — ohne diese Trennung entsteht dasselbe Grundproblem wie bei wiederholter Nutzung der Testmenge während einer Hyperparameter-Suche: das Entwicklungsteam optimiert implizit auf den Abnahmedatensatz, wodurch die Abnahmeentscheidung ihre Aussagekraft verliert.

~~~text
Real tasks: reflect ACTUAL usage scenarios, not just simplified constructed examples
Negative cases: examples where the CORRECT answer is refusal/"I don't know"
  -> without these, a system that NEVER refuses can be wrongly rated as fully competent
Relevant subgroups: enable separate evaluation (cf. subgroup errors, robustness) instead of only a global average
GOVERNANCE CORE: strict separation
  Development dataset: team may use freely for iterative improvement
  Acceptance dataset: RESERVED for final release decision, NOT available for repeated dev-team optimization
  -> without separation: same problem as reusing the test set during hyperparameter search
  -> dev team implicitly optimizes toward the acceptance dataset -> acceptance decision loses its meaning
~~~

## Core Concepts, Architektur und Implementierung

| Element | Zweck | Risiko ohne dieses Element |
|---|---|---|
| Reale Aufgaben | spiegeln tatsächliche Nutzungsszenarien wider | künstlich vereinfachte Beispiele unterschätzen reale Schwierigkeit |
| Negativfälle | prüfen korrekte Ablehnung statt erzwungener Antwort | ein System, das nie ablehnt, wird fälschlich als kompetent bewertet |
| Relevante Subgruppen | ermöglichen getrennte, nicht nur globale Bewertung | Subgruppenfehler bleiben im Durchschnitt verborgen |
| Strikte Entwicklungs-/Abnahme-Trennung | sichert die Aussagekraft der finalen Freigabeentscheidung | implizites Optimieren auf den Abnahmedatensatz entwertet die Abnahme |

Implementierung: Ein Evaluationsdatensatz wird aus realen, repräsentativen Nutzungsszenarien zusammengestellt, ergänzt um explizit konstruierte Negativfälle und Beispiele relevanter Subgruppen. Der Datensatz wird von Beginn an in einen Entwicklungsteil (frei nutzbar für iterative Verbesserung) und einen Abnahmeteil (organisatorisch getrennt verwaltet, dem Entwicklungsteam nicht zugänglich) aufgeteilt. Für jede in den Datensatz aufgenommene Datenquelle werden Nutzungsrechte dokumentiert (darf diese Quelle für Training/Evaluation verwendet werden, gibt es Einschränkungen), und Annotationen (z. B. korrekte Antwort, Subgruppenzugehörigkeit) werden nachvollziehbar mit Quelle und Ersteller dokumentiert.

## Scalability, Reliability, Security und Observability

Strikte Entwicklungs-/Abnahme-Trennung skaliert die Glaubwürdigkeit von Freigabeentscheidungen unabhängig von der Größe des Entwicklungsteams; die Reliability-Grenze liegt darin, dass jede Aufweichung dieser Trennung proportional zur Häufigkeit des Zugriffs auf den Abnahmedatensatz dessen Aussagekraft als unabhängiger Prüfstein verringert.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein System besteht die interne Abnahmeprüfung durchgehend, zeigt aber in Produktion unerwartete Schwächen | das Entwicklungsteam hatte wiederholten Zugriff auf den Abnahmedatensatz und hat implizit darauf optimiert | prüfen, ob die organisatorische Trennung zwischen Entwicklungs- und Abnahmedatensatz tatsächlich eingehalten wurde |
| ein System liefert bei eindeutig unbeantwortbaren Anfragen dennoch erfundene Antworten, obwohl es die Abnahmeprüfung bestanden hat | der Abnahmedatensatz enthielt keine oder zu wenige Negativfälle | den Abnahmedatensatz um explizite Negativfälle erweitern und die Abnahmeprüfung wiederholen |
| eine Datenquelle im Evaluationsdatensatz wird nachträglich als rechtlich problematisch identifiziert | die Nutzungsrechte dieser Quelle wurden nicht vor Aufnahme in den Datensatz geprüft und dokumentiert | die Nutzungsrechte aller Datenquellen im Evaluationsdatensatz nachträglich prüfen und unklare Quellen entfernen |

Security: Undokumentierte Nutzungsrechte bei Evaluationsdaten können zu rechtlichen Risiken führen, insbesondere bei Daten aus Drittquellen oder mit personenbezogenen Inhalten. Observability: Der Anteil realer gegenüber künstlich konstruierter Aufgaben, die Abdeckung relevanter Subgruppen und Negativfälle, sowie die Historie von Zugriffen auf den Abnahmedatensatz sind zentrale Governance-Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert eine strikte technische und organisatorische Trennung zwischen Entwicklungs- und Abnahmedatensatz. **Principal** macht Nutzungsrechte und Annotationsherkunft für das Team nachvollziehbar dokumentiert. **Chief** etabliert diese Trennung als Governance-Standard im Unternehmen, um glaubwürdige Abnahmeentscheidungen zu sichern.

Anti-Patterns: denselben Datensatz für Entwicklung und finale Abnahme ohne Trennung verwenden; Evaluationsdatensätze ohne dokumentierte Nutzungsrechte aus beliebigen Quellen zusammenstellen; Negativfälle und relevante Subgruppen bei der Datensatzkuration vernachlässigen.

## Production Checklist

- [ ] Entwicklungs- und Abnahme-Evaluationsdatensätze sind organisatorisch und technisch strikt getrennt.
- [ ] Der Datensatz enthält reale Aufgaben, explizite Negativfälle und relevante Subgruppen.
- [ ] Nutzungsrechte jeder Datenquelle sind vor Aufnahme in den Datensatz dokumentiert.
- [ ] Annotationen sind nachvollziehbar mit Quelle und Ersteller dokumentiert.

## Interviewfragen

### 1. Warum sind Negativfälle in einem Evaluationsdatensatz genauso wichtig wie positive Fälle?

**Antwort:** Ein System muss nicht nur korrekte Antworten liefern, sondern auch erkennen, wann eine Ablehnung die korrekte Reaktion ist; ohne Negativfälle kann ein System, das nie ablehnt, fälschlich als kompetent bewertet werden.

### 2. Warum ist die strikte Trennung zwischen Entwicklungs- und Abnahmedatensatz notwendig?

**Antwort:** Ohne diese Trennung optimiert das Entwicklungsteam implizit auf den Abnahmedatensatz, wodurch die finale Freigabeentscheidung ihre Aussagekraft als unabhängiger Prüfstein verliert.

### 3. Wie ist dieses Problem mit der Testmengen-Leakage bei Hyperparameter-Suchen verwandt?

**Antwort:** Beide beschreiben denselben Grundmechanismus: wiederholter Zugriff auf eine eigentlich für die finale Bewertung reservierte Datenmenge führt zu implizitem Overfitting auf diese Menge und entwertet ihre Aussagekraft.

### 4. Warum sind dokumentierte Nutzungsrechte bei Evaluationsdaten wichtig?

**Antwort:** Undokumentierte Nutzungsrechte können zu rechtlichen Risiken führen, insbesondere bei Daten aus Drittquellen oder mit personenbezogenen Inhalten.

### 5. Wie gehst du vor, wenn ein System die interne Abnahmeprüfung besteht, aber in Produktion unerwartete Schwächen zeigt?

**Antwort:** Ich prüfe, ob die organisatorische Trennung zwischen Entwicklungs- und Abnahmedatensatz tatsächlich eingehalten wurde, und ob das Entwicklungsteam wiederholten Zugriff auf den Abnahmedatensatz hatte.

### 6. Widersprüchliche Anforderung: Entwicklungsteam will schnellen, direkten Zugriff auf realistische Testdaten UND garantiert unabhängige, aussagekräftige Abnahmeprüfung — wie gehst du vor?

**Antwort:** Ich würde einen separaten, für das Entwicklungsteam frei zugänglichen Entwicklungsdatensatz mit ähnlicher Struktur und Schwierigkeit wie der Abnahmedatensatz bereitstellen, sodass realistisches Testen während der Entwicklung möglich bleibt, während der eigentliche Abnahmedatensatz organisatorisch getrennt und dem Entwicklungsteam nicht zugänglich bleibt.

## Praktische Labs

~~~python
import random

random.seed(0)

acceptance_dataset = [{"id": i, "true_quality": random.uniform(0.5, 0.9)} for i in range(20)]
dev_dataset = [{"id": i, "true_quality": random.uniform(0.5, 0.9)} for i in range(20)]

def simulate_repeated_optimization(dataset, rounds):
    reported_scores = []
    for r in range(rounds):
        # Simulates a dev team tuning against this exact dataset repeatedly
        noise = random.uniform(0, 0.05 * r)
        reported_scores.append(sum(d["true_quality"] for d in dataset) / len(dataset) + noise)
    return reported_scores

print("Scores when dev team repeatedly optimizes DIRECTLY against the 'acceptance' set (LEAKAGE):")
leaked_scores = simulate_repeated_optimization(acceptance_dataset, 5)
for i, s in enumerate(leaked_scores):
    print(f"  round {i}: reported score = {s:.3f} (increasingly inflated, NOT reflecting real quality)")

print("\nStrictly separated acceptance dataset (never touched during dev iteration):")
true_acceptance_score = sum(d["true_quality"] for d in acceptance_dataset) / len(acceptance_dataset)
print(f"  final, unbiased acceptance score: {true_acceptance_score:.3f} (stable, trustworthy)")
~~~

## Dependencies, Cross-References und Quellen

1. Ribeiro et al.: [Beyond Accuracy — Behavioral Testing of NLP Models with CheckList](https://arxiv.org/abs/2005.04118), abgerufen 2026-09-17.
2. Gebru et al.: [Datasheets for Datasets](https://arxiv.org/abs/1803.09010), abgerufen 2026-09-17.

Datensplits und Leakage sind kanonisch in [KB-0346](../14-ml-engineering/16-datensplits-und-leakage.md) behandelt; DeepEval und Bewertungsmetriken in [KB-0364](14-deepeval-und-bewertungsmetriken.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte "Datasheets"-Dokumentationsformate für Evaluationsdatensätze (Herkunft, Nutzungsrechte, Annotationsverfahren) | Adopting | Gegenüber unstrukturierter, ad-hoc dokumentierter Datensatzherkunft für bessere Nachvollziehbarkeit bevorzugen. |
| Automatisierte Zugriffskontrollsysteme, die technisch erzwingen, dass Entwicklungsteams nicht auf Abnahmedatensätze zugreifen können | Adopting | Gegenüber rein organisatorischer (nicht technisch erzwungener) Trennung für zuverlässigere Governance bevorzugen. |

Ein Team akzeptiert eine Freigabeentscheidung erst, wenn sie auf einem organisatorisch getrennten, nie für Entwicklungszwecke genutzten Abnahmedatensatz beruht.
