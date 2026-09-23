---
{"id": "KB-0345", "title": "Robustheit und Verteilungsänderung", "domain": "14", "sequence": 15, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0344", "concepts": ["Kalibrierung und Unsicherheit"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Modell mit leicht perturbierten Eingaben und Out-of-Distribution-Daten testen, um den Unterschied zwischen durchschnittlicher Genauigkeit unter idealisierten Bedingungen und tatsächlicher Robustheit zu demonstrieren.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Testsuite gestalten, die Perturbationen, Out-of-Distribution-Daten und Subgruppenfehler systematisch neben der Standardbewertung auf idealisierten Testdaten einschließt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein in Produktion unerwartet schlecht performendes Modell auf eine Verteilungsänderung zwischen Trainings- und Produktionsdaten statt auf ein allgemeines Modellproblem zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Robustheit als eigenständige, von durchschnittlicher Testgenauigkeit unter idealisierten Bedingungen zu unterscheidende Qualitätsdimension positionieren, die explizite Tests gegen Perturbationen, OOD-Daten und Subgruppen erfordert.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete adversariale Perturbationsalgorithmen sind Vertiefung.", "rationale": "Kern ist die Unterscheidung zwischen idealisierter Testgenauigkeit und tatsächlicher Robustheit, nicht die konkrete Perturbationstechnik."}}, "lab_validation": [{"lab_id": "KB-0345-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Modell mit Vergleich der Genauigkeit auf sauberen Testdaten gegenüber leicht perturbierten und Out-of-Distribution-Daten", "evidence": "Ein Modell mit hoher Genauigkeit auf sauberen, idealisierten Testdaten zeigt eine deutlich schlechtere Genauigkeit bei leicht perturbierten Eingaben und bei Daten außerhalb der ursprünglichen Trainingsverteilung, was zeigt, dass durchschnittliche Testgenauigkeit allein keine Robustheit garantiert.", "limitations": "Kein produktives Testsystem, kein realer Geschäftsdatensatz, keine reale Verteilungsänderung getestet."}]}
---
# Robustheit und Verteilungsänderung

> **Ziel:** Robustheit bewertet, wie stabil ein Modell gegenüber Perturbationen (kleine Störungen der Eingabe), Out-of-Distribution-Daten (OOD, Daten außerhalb der ursprünglichen Trainingsverteilung) und Subgruppenfehlern (systematisch schlechtere Leistung bei bestimmten Datenuntergruppen) bleibt, aufbauend auf Kalibrierung, siehe [KB-0344](14-kalibrierung-und-unsicherheit.md). Der zentrale Punkt ist, dass Robustheit ausdrücklich von durchschnittlicher Genauigkeit unter idealisierten Testbedingungen zu unterscheiden ist — eine hohe Genauigkeit auf sauberen, repräsentativen Testdaten garantiert keine stabile Leistung unter realen, oft weniger idealisierten Produktionsbedingungen.

## Zweck, Mental Model und Dependencies

Perturbationen sind kleine, oft unauffällige Störungen der Eingabe (z. B. leichtes Bildrauschen, geringfügige Textvariationen, minimale numerische Abweichungen), die ein Modell im Idealfall nicht wesentlich beeinflussen sollten, da sie die eigentliche Bedeutung der Eingabe kaum verändern. Out-of-Distribution-Daten sind Eingaben, die sich strukturell oder statistisch deutlich von der ursprünglichen Trainingsverteilung unterscheiden (z. B. ein für eine bestimmte Branche trainiertes Modell, das plötzlich mit Daten einer völlig anderen Branche konfrontiert wird) — Modelle können bei solchen Daten unvorhersehbares, oft überkonfident falsches Verhalten zeigen (verwandt mit Kalibrierungsproblemen, siehe [KB-0344](14-kalibrierung-und-unsicherheit.md)). Subgruppenfehler treten auf, wenn ein Modell im Durchschnitt gut performt, aber bei bestimmten Datenuntergruppen (z. B. bestimmten demografischen Gruppen, seltenen Produktkategorien) systematisch schlechter abschneidet, was eine ausschließlich durchschnittsbasierte Bewertung nicht sichtbar macht. Der zentrale, oft übersehene methodische Fehler ist, eine hohe Genauigkeit auf einem sauberen, repräsentativen Testset als ausreichenden Beleg für Produktionstauglichkeit zu interpretieren: reale Produktionsdaten enthalten häufig Rauschen, unerwartete Variationen und potenziell Daten außerhalb der ursprünglichen Trainingsverteilung, die von einem idealisierten Testset nicht abgedeckt werden — ein Modell muss daher explizit gegen diese realistischeren, herausfordernderen Bedingungen getestet werden, statt sich auf die Testgenauigkeit unter idealisierten Bedingungen zu verlassen.

~~~text
Perturbations: small, often subtle input disturbances (noise, minor text variations, numerical deviations)
  -> ideally should NOT substantially affect a robust model
Out-of-distribution (OOD) data: inputs structurally/statistically DIFFERENT from original training distribution
  -> models can show unpredictable, often OVERCONFIDENT wrong behavior (cf. calibration, KB-0344)
Subgroup errors: model performs well ON AVERAGE, but systematically WORSE on specific data subgroups
  -> average-based evaluation ALONE does not reveal this
CRITICAL METHODOLOGICAL ERROR: high accuracy on a clean, representative test set != production readiness
  -> real production data has noise, unexpected variation, potential OOD inputs an idealized test set doesn't cover
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Explizite Perturbationstests | wird die Modellleistung explizit unter leicht perturbierten, nicht nur unter sauberen Eingaben getestet? | ohne diese Tests kann eine Instabilität bei geringfügigen, realistischen Eingabevariationen unentdeckt bleiben |
| Explizite Out-of-Distribution-Tests | wird das Modellverhalten explizit mit Daten außerhalb der ursprünglichen Trainingsverteilung getestet? | ohne diese Tests kann unvorhersehbares, überkonfident falsches Verhalten bei OOD-Daten in Produktion unentdeckt auftreten |
| Explizite Subgruppentests | wird die Modellleistung explizit getrennt für relevante Datenuntergruppen gemessen, nicht nur im Durchschnitt? | ohne diese Tests kann eine systematisch schlechtere Leistung bei bestimmten Untergruppen im Durchschnitt untergehen |
| Trennung von Testgenauigkeit und Robustheit als Erfolgskriterien | werden Testgenauigkeit unter idealisierten Bedingungen und Robustheit unter realistischen Bedingungen als getrennte, jeweils zu erfüllende Kriterien behandelt? | eine Vermischung kann zu einer als produktionsreif eingestuften, tatsächlich fragilen Modelllösung führen |

Implementierung: Neben der Standardbewertung auf sauberen, repräsentativen Testdaten wird eine explizite Testsuite mit leicht perturbierten Varianten derselben Testdaten erstellt, um Stabilität gegenüber realistischen Eingabevariationen zu messen. Eine separate Testmenge mit Daten außerhalb der ursprünglichen Trainingsverteilung wird genutzt, um das Modellverhalten bei OOD-Eingaben zu prüfen, idealerweise kombiniert mit Kalibrierungsmessung (siehe [KB-0344](14-kalibrierung-und-unsicherheit.md)), um zu prüfen, ob das Modell bei OOD-Daten angemessen unsicher ist. Die Modellleistung wird explizit getrennt für relevante Datenuntergruppen gemessen, um systematisch schlechtere Leistung bei spezifischen Gruppen zu erkennen. Testgenauigkeit unter idealisierten Bedingungen und Robustheit unter perturbierten/OOD-Bedingungen werden als getrennte, beide zu erfüllende Erfolgskriterien behandelt, bevor ein Modell als produktionsreif eingestuft wird.

## Scalability, Reliability, Security und Observability

Robustheitstests skalieren die Verlässlichkeit von Produktionsvorhersagen proportional zur Abdeckung realistischer Herausforderungsbedingungen; die Reliability-Grenze liegt in einer ausschließlichen Bewertung auf idealisierten Testdaten, die mit wachsender Diskrepanz zwischen Test- und tatsächlicher Produktionsdatenverteilung proportional mehr unentdeckte Robustheitsprobleme in Produktion erzeugen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Modell mit hoher Testgenauigkeit zeigt in Produktion deutlich schlechtere Leistung | eine Verteilungsänderung zwischen Trainings-/Testdaten und tatsächlichen Produktionsdaten wurde nicht durch OOD-Tests erkannt | die Produktionsdatenverteilung explizit gegen die ursprüngliche Trainingsverteilung vergleichen und OOD-Tests nachträglich durchführen |
| ein Modell zeigt bei geringfügig unterschiedlich formatierten, aber inhaltlich gleichen Eingaben stark unterschiedliche Ergebnisse | fehlende Perturbationstests haben eine Instabilität gegenüber realistischen Eingabevariationen nicht aufgedeckt | Perturbationstests mit geringfügigen, realistischen Eingabevariationen nachträglich durchführen |
| ein Modell zeigt bei bestimmten Kunden- oder Datenuntergruppen systematisch schlechtere Ergebnisse als im globalen Durchschnitt | fehlende Subgruppentests haben diese systematische Schwäche im Durchschnitt verborgen gelassen | die Modellleistung explizit getrennt für die betroffene Untergruppe gegen den globalen Durchschnitt vergleichen |

Security: Ein Modell, das bei Out-of-Distribution-Eingaben überkonfident falsches Verhalten zeigt, kann bei sicherheitsrelevanten Anwendungsfällen (z. B. Anomalieerkennung) ein reales Risiko darstellen, wenn tatsächlich neuartige, potenziell bösartige Muster fälschlich als bekannt und unproblematisch klassifiziert werden. Observability: Genauigkeit unter Perturbation im Vergleich zu sauberen Daten, Konfidenzverhalten bei OOD-Daten und Leistungsverteilung über relevante Datenuntergruppen sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Perturbations-, OOD- und Subgruppentests als festen Bestandteil der Modellbewertung. **Principal** macht die Ergebnisse dieser Robustheitstests für das Team nachvollziehbar dokumentiert. **Chief** positioniert Robustheit als eigenständige, von idealisierter Testgenauigkeit zu unterscheidende Qualitätsdimension.

Anti-Patterns: ein Modell allein anhand der Genauigkeit auf sauberen, idealisierten Testdaten als produktionsreif einstufen; OOD-Verhalten des Modells vor Produktivsetzung nicht explizit testen; Modellleistung nur global, ohne Subgruppenanalyse bewerten.

## Production Checklist

- [ ] Perturbationstests messen Stabilität gegenüber realistischen Eingabevariationen.
- [ ] Out-of-Distribution-Tests prüfen das Modellverhalten außerhalb der Trainingsverteilung.
- [ ] Subgruppentests messen Leistung getrennt für relevante Datenuntergruppen.
- [ ] Testgenauigkeit unter idealisierten Bedingungen und Robustheit sind getrennte Erfolgskriterien.

## Interviewfragen

### 1. Warum garantiert hohe Testgenauigkeit auf sauberen Daten keine Produktionstauglichkeit?

**Antwort:** Reale Produktionsdaten enthalten oft Rauschen, unerwartete Variationen und potenziell Daten außerhalb der ursprünglichen Trainingsverteilung, die von einem idealisierten Testset nicht abgedeckt werden.

### 2. Was sind Out-of-Distribution-Daten, und warum sind sie ein spezifisches Risiko?

**Antwort:** Daten, die strukturell oder statistisch deutlich von der ursprünglichen Trainingsverteilung abweichen; Modelle können bei solchen Daten unvorhersehbares, oft überkonfident falsches Verhalten zeigen.

### 3. Warum können Subgruppenfehler durch eine reine Durchschnittsbewertung übersehen werden?

**Antwort:** Ein Modell kann im globalen Durchschnitt gut performen, während es bei einer spezifischen, kleineren Datenuntergruppe systematisch schlechter abschneidet, was der Durchschnittswert nicht sichtbar macht.

### 4. Warum sollten Testgenauigkeit und Robustheit als getrennte Erfolgskriterien behandelt werden?

**Antwort:** Eine Vermischung kann zu einer als produktionsreif eingestuften, tatsächlich fragilen Modelllösung führen, die zwar auf idealisierten Daten gut, unter realistischen Bedingungen aber schlecht abschneidet.

### 5. Wie diagnostizierst du eine unerwartet schlechte Modellleistung in Produktion trotz hoher Testgenauigkeit?

**Antwort:** Ich vergleiche die Produktionsdatenverteilung explizit gegen die ursprüngliche Trainingsverteilung und führe nachträglich OOD- und Perturbationstests durch, um eine mögliche Verteilungsänderung oder Instabilität zu identifizieren.

### 6. Widersprüchliche Anforderung: Team will schnelle Modellfreigabe basierend allein auf hoher Testgenauigkeit UND garantiert stabile Leistung unter allen realistischen Produktionsbedingungen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass hohe Testgenauigkeit allein keine Garantie für Robustheit unter realistischen Bedingungen ist; ich würde vorschlagen, eine kompakte, aber verpflichtende Robustheitstestsuite (Perturbation, OOD, Subgruppen) als festen Bestandteil des Freigabeprozesses zu etablieren, die schnell durchführbar ist, aber wesentliche Robustheitslücken vor der Freigabe aufdeckt, statt auf diese Tests zugunsten der Geschwindigkeit ganz zu verzichten.

## Praktische Labs

~~~python
import torch
import torch.nn as nn

# Demonstrating the gap between clean-data accuracy and robustness under perturbation/OOD
torch.manual_seed(0)

model = nn.Sequential(nn.Linear(4, 8), nn.ReLU(), nn.Linear(8, 2))
clean_X = torch.randn(50, 4)
clean_y = (clean_X.sum(dim=1) > 0).long()

optimizer = torch.optim.Adam(model.parameters(), lr=0.1)
for _ in range(100):
    optimizer.zero_grad()
    loss = nn.CrossEntropyLoss()(model(clean_X), clean_y)
    loss.backward()
    optimizer.step()

clean_accuracy = (model(clean_X).argmax(dim=1) == clean_y).float().mean().item()
print(f"Accuracy on clean, in-distribution test data: {clean_accuracy:.2%}")

perturbed_X = clean_X + torch.randn_like(clean_X) * 0.3  # small realistic perturbation
perturbed_accuracy = (model(perturbed_X).argmax(dim=1) == clean_y).float().mean().item()
print(f"Accuracy under small perturbation: {perturbed_accuracy:.2%}")

ood_X = torch.randn(50, 4) * 5  # out-of-distribution: much larger scale than training data
ood_predictions = torch.softmax(model(ood_X), dim=1)
ood_max_confidence = ood_predictions.max(dim=1).values.mean().item()
print(f"Average reported confidence on OOD data: {ood_max_confidence:.2%} (potentially overconfident despite being outside training distribution)")
~~~

## Dependencies, Cross-References und Quellen

1. Hendrycks, Dietterich: [Benchmarking Neural Network Robustness to Common Corruptions and Perturbations](https://arxiv.org/abs/1903.12261), abgerufen 2026-09-17.
2. Hendrycks, Gimpel: [A Baseline for Detecting Misclassified and Out-of-Distribution Examples](https://arxiv.org/abs/1610.02136), abgerufen 2026-09-17.
3. Buolamwini, Gebru: [Gender Shades — Intersectional Accuracy Disparities in Commercial Gender Classification](http://proceedings.mlr.press/v81/buolamwini18a.html), abgerufen 2026-09-17.

Kalibrierung und Unsicherheit sind kanonisch in [KB-0344](14-kalibrierung-und-unsicherheit.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Robustheits-Benchmark-Suiten, die Perturbations-, OOD- und Subgruppentests systematisch für gängige Modelltypen bereitstellen | Adopting | Gegenüber manuell erstellten Ad-hoc-Robustheitstests für systematischere, reproduzierbare Abdeckung bevorzugen. |
| Kontinuierliches Produktions-Monitoring, das Verteilungsverschiebungen zwischen Trainingsdaten und tatsächlichen Produktionsanfragen automatisch erkennt | Adopting | Gegenüber periodischer, manueller Verteilungsprüfung für zeitnähere Erkennung von Robustheitsrisiken bevorzugen. |

Ein Team akzeptiert eine Modellfreigabe erst, wenn Perturbations-, OOD- und Subgruppentests neben der Standardgenauigkeit dokumentiert und bestanden sind.
