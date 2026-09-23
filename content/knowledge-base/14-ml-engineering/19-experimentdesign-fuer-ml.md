---
{"id": "KB-0349", "title": "Experimentdesign für ML", "domain": "14", "sequence": 19, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0348", "concepts": ["Hyperparameter und Suchräume"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein neuronales Modell mehrfach mit unterschiedlichen Seeds trainieren und die Streuung der Ergebnisse als Konfidenzintervall statt als Einzelwert berichten.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein Experimentdesign gestalten, das kontrollierte Variation (Seeds, Datenreihenfolge) von der eigentlichen zu testenden Variablen trennt und ein neuronales Modell gegen eine einfache lineare oder baumbasierte Baseline vergleicht.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Entscheiden, ob ein beobachteter Leistungsunterschied zwischen zwei Modellen statistisch bedeutsam ist oder innerhalb der normalen Seed-bedingten Streuung liegt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Statistisch fundiertes Experimentdesign mit Baseline-Vergleich als Standard für glaubwürdige Modellentscheidungen im Unternehmen etablieren, gegenüber Einzelwert-Vergleichen ohne Streuungsangabe.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Formale statistische Signifikanztests (z. B. t-Tests) sind Vertiefung.", "rationale": "Kern ist das Verständnis von Streuung, Konfidenzintervallen und Baseline-Vergleich, nicht die Anwendung eines spezifischen Signifikanztests."}}, "lab_validation": [{"lab_id": "KB-0349-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales, synthetisches Datenset mit mehrfachem Training desselben neuronalen Modells unter verschiedenen Seeds und Vergleich mit einer linearen Baseline", "evidence": "Ein neuronales Modell zeigt über mehrere Seeds hinweg eine spürbare Streuung der Testgenauigkeit; ein einzelner, günstig gewählter Seed kann eine höhere Genauigkeit als eine einfache lineare Baseline suggerieren, während der Mittelwert über mehrere Seeds den tatsächlichen Vorteil gegenüber der Baseline realistischer einschätzt.", "limitations": "Kein produktives Experimentiersystem, kein realer Geschäftsdatensatz, kleine Anzahl an Seed-Wiederholungen."}]}
---
# Experimentdesign für ML

> **Ziel:** Ein belastbares ML-Experimentdesign nutzt Wahrscheinlichkeit, Stichproben und Streuung, um zu unterscheiden, ob ein beobachteter Leistungsunterschied zwischen Modellen real oder zufällig ist, aufbauend auf einer sauber definierten Hyperparameter-Suche (siehe [KB-0348](18-hyperparameter-und-suchraeume.md)). Seeds, Konfidenzintervalle und kontrollierte Variation sind die zentralen Werkzeuge dafür. Ein neuronales Modell wird dabei stets explizit gegen eine einfache lineare oder baumbasierte Nicht-LLM-Baseline verglichen, um den tatsächlichen Mehrwert der höheren Modellkomplexität zu belegen statt anzunehmen.

## Zweck, Mental Model und Dependencies

Ein Seed ist ein fest gewählter Startwert für Zufallsprozesse (Gewichtsinitialisierung, Datenreihenfolge, Dropout-Masken), der ein Training reproduzierbar macht. Da neuronale Modelle jedoch von Natur aus stochastisch trainiert werden, führt bereits ein anderer Seed zu einem leicht unterschiedlichen Endergebnis — ein einzelnes Trainingsergebnis mit einem einzigen Seed ist daher eine Stichprobe aus einer Verteilung möglicher Ergebnisse, nicht ein exakter, wiederholbarer Wert. Ein Konfidenzintervall (z. B. Mittelwert ± Standardabweichung über mehrere Seeds) macht diese Streuung explizit sichtbar, statt einen einzelnen, potenziell zufällig günstigen oder ungünstigen Wert als Ergebnis zu berichten. Kontrollierte Variation bedeutet, bei einem Vergleich (z. B. zweier Hyperparameter-Konfigurationen) alle anderen Faktoren (Daten, Seeds, Trainingsdauer) konstant zu halten, sodass ein beobachteter Unterschied tatsächlich auf die zu testende Variable zurückzuführen ist und nicht auf zufällige Seed-bedingte Streuung. Der zentrale methodische Punkt ist der Baseline-Vergleich: ein neuronales Modell wird explizit gegen eine einfache lineare oder baumbasierte Nicht-LLM-Baseline verglichen, da diese einfacheren Modelle oft überraschend konkurrenzfähig sind und ein neuronales Modell seinen zusätzlichen Komplexitäts- und Rechenaufwand durch einen tatsächlichen, über die normale Streuung hinausgehenden Leistungsvorteil rechtfertigen muss.

~~~text
Seed: fixed starting value for randomness (weight init, data order, dropout masks) -> reproducible training
BUT neural training is inherently stochastic -> a single seed's result is ONE SAMPLE from a distribution
Confidence interval: mean ± spread across MULTIPLE seeds -> makes that spread explicit, not hidden
Controlled variation: hold all other factors constant (data, seeds, training duration) when comparing ONE variable
  -> observed difference attributable to the tested variable, not random seed-driven noise
CRITICAL: neural model vs. simple linear/tree-based non-LLM baseline
  -> extra complexity must justify itself with a REAL advantage beyond normal seed-driven spread
~~~

## Core Concepts, Architektur und Implementierung

| Element | Zweck | Risiko ohne dieses Element |
|---|---|---|
| Mehrfache Seed-Wiederholung | Streuung der Ergebnisse sichtbar machen | ein einzelner, zufällig günstiger Seed suggeriert eine bessere Leistung als tatsächlich vorhanden |
| Konfidenzintervall statt Einzelwert | Unterscheidung zwischen realem Unterschied und normaler Streuung ermöglichen | ein kleiner, innerhalb der Streuung liegender Unterschied wird fälschlich als bedeutsam interpretiert |
| Lineare/baumbasierte Baseline | Mehrwert der Modellkomplexität belegen statt annehmen | ein komplexeres Modell wird eingesetzt, obwohl eine einfachere Baseline gleichwertig performt |
| Kontrollierte Variation | Ursache eines beobachteten Unterschieds korrekt zuordnen | ein Unterschied wird fälschlich der getesteten Variablen statt einer unkontrollierten Störvariablen zugeschrieben |

Implementierung: Jeder Modellvergleich wird mit mehreren (typischerweise mindestens drei bis fünf) unterschiedlichen Seeds wiederholt, und das Ergebnis wird als Mittelwert mit Streuungsmaß (z. B. Standardabweichung) statt als Einzelwert berichtet. Vor jedem neuronalen Modellansatz wird eine einfache lineare oder baumbasierte Baseline auf denselben Daten und demselben Split trainiert und bewertet, um als Vergleichsmaßstab zu dienen. Bei einem Vergleich zweier Konfigurationen werden alle anderen Faktoren (Datensplit, Trainingsdauer, Vorverarbeitung) explizit konstant gehalten, sodass nur die zu testende Variable unterschiedlich ist.

## Scalability, Reliability, Security und Observability

Ein sauberes Experimentdesign skaliert die Verlässlichkeit von Modellentscheidungen proportional zur Anzahl der Seed-Wiederholungen und zur Konsequenz des Baseline-Vergleichs; die Reliability-Grenze liegt darin, dass Einzelwert-Vergleiche ohne Streuungsangabe proportional zur Seed-bedingten Streuung fehlerhafte Entscheidungen begünstigen können.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein als "verbessertes Modell" eingeführtes neuronales Modell zeigt in Produktion keinen erkennbaren Vorteil gegenüber der vorherigen Lösung | der ursprünglich beobachtete Vorteil lag innerhalb der normalen Seed-bedingten Streuung, nicht an einer echten Verbesserung | das Experiment mit mehreren Seeds wiederholen und den Unterschied als Konfidenzintervall statt als Einzelwert neu bewerten |
| ein Team entscheidet sich für ein komplexes neuronales Modell ohne dokumentierten Baseline-Vergleich | die tatsächliche Notwendigkeit der höheren Komplexität wurde nie belegt | eine einfache lineare oder baumbasierte Baseline auf denselben Daten trainieren und den Leistungsunterschied explizit messen |
| zwei scheinbar identische Trainingsläufe liefern deutlich unterschiedliche Ergebnisse | unkontrollierte Variation (unterschiedliche Seeds, Datenreihenfolge) statt eine bewusst getestete Variable verursacht den Unterschied | alle Faktoren außer der zu testenden Variablen explizit konstant halten und den Vergleich wiederholen |

Security: Ohne dokumentierten Baseline-Vergleich kann eine unnötig komplexe, schwerer nachvollziehbare Modelllösung eingesetzt werden, wo eine einfachere, transparentere Baseline ausgereicht hätte. Observability: Mittelwert und Streuung der Zielmetrik über mehrere Seeds, sowie die dokumentierte Baseline-Leistung als Referenzpunkt, sind zentrale Metriken für jede Modellentscheidung.

## Trade-offs und Entscheidungen

**Staff** implementiert Mehrfach-Seed-Wiederholungen und Baseline-Vergleiche als Standardbestandteil jedes Modellexperiments. **Principal** macht Konfidenzintervalle und Baseline-Ergebnisse für das Team nachvollziehbar dokumentiert. **Chief** etabliert statistisch fundiertes Experimentdesign mit Baseline-Vergleich als Standard für glaubwürdige Modellentscheidungen im Unternehmen.

Anti-Patterns: einen Modellvergleich nur mit einem einzigen Seed durchführen und als endgültiges Ergebnis berichten; ein neuronales Modell ohne dokumentierten Vergleich gegen eine einfache Baseline einführen; bei einem Vergleich mehrere Faktoren gleichzeitig ändern, sodass die Ursache eines beobachteten Unterschieds unklar bleibt.

## Production Checklist

- [ ] Jeder Modellvergleich wird mit mehreren unterschiedlichen Seeds wiederholt.
- [ ] Ergebnisse werden als Mittelwert mit Streuungsmaß, nicht als Einzelwert, berichtet.
- [ ] Jedes neuronale Modell wird explizit gegen eine einfache lineare oder baumbasierte Baseline verglichen.
- [ ] Bei Vergleichen werden alle Faktoren außer der zu testenden Variablen konstant gehalten.

## Interviewfragen

### 1. Warum ist ein einzelnes Trainingsergebnis mit einem einzigen Seed keine verlässliche Grundlage für eine Modellentscheidung?

**Antwort:** Neuronales Training ist von Natur aus stochastisch; ein einzelnes Ergebnis ist eine Stichprobe aus einer Verteilung möglicher Ergebnisse und kann zufällig günstig oder ungünstig ausfallen.

### 2. Wie macht ein Konfidenzintervall die Streuung von Modellergebnissen sichtbar?

**Antwort:** Es berichtet Mittelwert und Streuungsmaß (z. B. Standardabweichung) über mehrere Seed-Wiederholungen, statt eines einzelnen Werts, und macht so erkennbar, ob ein Unterschied real oder zufällig ist.

### 3. Warum ist ein Baseline-Vergleich mit einem einfachen linearen oder baumbasierten Modell wichtig?

**Antwort:** Er belegt, ob die zusätzliche Komplexität eines neuronalen Modells tatsächlich einen Leistungsvorteil bringt, statt diesen Vorteil nur anzunehmen.

### 4. Was bedeutet kontrollierte Variation in einem ML-Experiment?

**Antwort:** Bei einem Vergleich werden alle Faktoren außer der zu testenden Variablen (z. B. Daten, Seeds, Trainingsdauer) konstant gehalten, sodass ein beobachteter Unterschied korrekt der getesteten Variablen zugeordnet werden kann.

### 5. Wie gehst du vor, wenn ein "verbessertes" Modell in Produktion keinen erkennbaren Vorteil zeigt?

**Antwort:** Ich wiederhole das ursprüngliche Experiment mit mehreren Seeds und bewerte den Unterschied als Konfidenzintervall, um zu prüfen, ob der ursprünglich beobachtete Vorteil real war oder innerhalb der normalen Streuung lag.

### 6. Widersprüchliche Anforderung: Team will schnellstmögliche Modellentscheidung UND statistisch belastbare, reproduzierbare Ergebnisse — wie gehst du vor?

**Antwort:** Ich würde eine kompakte, aber verpflichtende Mindestanzahl an Seed-Wiederholungen (z. B. drei) und einen obligatorischen Baseline-Vergleich als Standardprozess etablieren, der schnell genug bleibt, um zeitnahe Entscheidungen zu ermöglichen, aber genug statistische Substanz liefert, um eine Entscheidung von reinem Zufall zu unterscheiden.

## Praktische Labs

~~~python
import torch
import torch.nn as nn
import numpy as np
from sklearn.linear_model import LogisticRegression

def make_data(seed):
    g = torch.Generator().manual_seed(seed)
    X = torch.randn(80, 3, generator=g)
    y = (X[:, 0] + 0.5 * X[:, 1] > 0).long()
    return X, y

X, y = make_data(0)
X_train, y_train = X[:56], y[:56]
X_test, y_test = X[56:], y[56:]

baseline = LogisticRegression().fit(X_train.numpy(), y_train.numpy())
baseline_accuracy = baseline.score(X_test.numpy(), y_test.numpy())
print(f"Linear baseline test accuracy: {baseline_accuracy:.2%}")

accuracies = []
for seed in range(5):
    torch.manual_seed(seed)
    model = nn.Sequential(nn.Linear(3, 16), nn.ReLU(), nn.Linear(16, 2))
    optimizer = torch.optim.Adam(model.parameters(), lr=0.05)
    for _ in range(80):
        optimizer.zero_grad()
        loss = nn.CrossEntropyLoss()(model(X_train), y_train)
        loss.backward()
        optimizer.step()
    acc = (model(X_test).argmax(dim=1) == y_test).float().mean().item()
    accuracies.append(acc)

accuracies = np.array(accuracies)
print(f"Neural model accuracy across 5 seeds: {accuracies.mean():.2%} ± {accuracies.std():.2%} (min {accuracies.min():.2%}, max {accuracies.max():.2%})")
print(f"Neural mean vs. baseline: {'real advantage' if accuracies.mean() - accuracies.std() > baseline_accuracy else 'within normal seed spread of baseline'}")
~~~

## Dependencies, Cross-References und Quellen

1. Reimers, Gurevych: [Reporting Score Distributions Makes a Difference — Performance Study of LSTM-Networks for Sequence Tagging](https://arxiv.org/abs/1707.09861), abgerufen 2026-09-17.
2. Henderson et al.: [Deep Reinforcement Learning that Matters](https://arxiv.org/abs/1709.06560), abgerufen 2026-09-17.

Hyperparameter und Suchräume sind kanonisch in [KB-0348](18-hyperparameter-und-suchraeume.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte Experiment-Tracking-Werkzeuge, die Mehrfach-Seed-Läufe und Konfidenzintervalle automatisch aggregieren | Adopting | Gegenüber manueller Aggregation einzelner Trainingsläufe für konsistentere, weniger fehleranfällige Streuungsberichte bevorzugen. |
| Standardisierte Baseline-Bibliotheken, die einfache lineare/baumbasierte Referenzmodelle automatisch für neue Datensätze bereitstellen | Evaluating | Gegenüber manuell implementierten Baselines abwägen, sobald die Bibliothek den spezifischen Datentyp zuverlässig unterstützt. |

Ein Team akzeptiert eine Modellentscheidung erst, wenn sie durch mehrere Seed-Wiederholungen mit Konfidenzintervall und einen dokumentierten Baseline-Vergleich belegt ist.
