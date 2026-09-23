---
{"id": "KB-0350", "title": "Trade-offs von Modellarchitekturen", "domain": "14", "sequence": 20, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0332", "concepts": ["Transformer-Architekturen im ML"], "needed_for": "understanding"}, {"id": "KB-0349", "concepts": ["Experimentdesign für ML"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein lineares Modell, ein baumbasiertes Modell und ein kleines neuronales Modell auf derselben Aufgabe trainieren und Kapazität, Hardwarebedarf und Ergebnis vergleichen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Modellarchitektur anhand von Aufgabenpassung, Kapazitätsbedarf, Kontextkosten und Hardwarebedarf begründet auswählen statt eine Standardarchitektur anzunehmen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein Team davon überzeugen, eine einfachere Architektur (linear/baumbasiert) statt eines aufwendigeren neuronalen Modells zu wählen, wenn reproduzierbare Experimente keinen ausreichenden Mehrwert der Komplexität zeigen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Architekturauswahl als aufgabengetriebene, experimentell begründete Entscheidung statt als Trend- oder Standardwahl im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Detaillierte Hardware-spezifische Optimierungen einzelner Architekturen sind Vertiefung.", "rationale": "Kern ist die vergleichende Trade-off-Analyse, nicht die hardwarespezifische Feinabstimmung einer einzelnen Architektur."}}, "lab_validation": [{"lab_id": "KB-0350-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokaler Vergleich eines linearen Modells, eines baumbasierten Modells und eines kleinen neuronalen Modells auf demselben synthetischen Datensatz", "evidence": "Auf einem Datensatz mit überwiegend linearer Struktur erreicht ein einfaches lineares Modell eine vergleichbare Genauigkeit wie ein deutlich rechenaufwendigeres neuronales Modell, was zeigt, dass die höhere Kapazität des neuronalen Modells für diese Aufgabe keinen ausreichenden Mehrwert bietet.", "limitations": "Kein produktives System, kein realer Geschäftsdatensatz, kleine Modellgrößen."}]}
---
# Trade-offs von Modellarchitekturen

> **Ziel:** Die Wahl einer Modellarchitektur — lineares Modell, baumbasiertes Modell (z. B. Gradient Boosting) oder neuronales Modell einschließlich Transformer-Architekturen (siehe [KB-0332](02-transformer-architekturen-im-ml.md)) — sollte auf Kapazität, Kontextkosten, Hardwarebedarf und Aufgabenpassung begründet sein, verifiziert durch reproduzierbare Experimente (siehe [KB-0349](19-experimentdesign-fuer-ml.md)), statt auf einer Standard- oder Trendannahme zu beruhen. Lineare Modelle und Bäume sind dabei ausdrücklich als vollwertige Alternativen einzubeziehen, nicht nur als Ausgangspunkt vor dem "eigentlichen" neuronalen Modell.

## Zweck, Mental Model und Dependencies

Lineare Modelle (z. B. logistische Regression) haben geringe Kapazität (sie können nur lineare Beziehungen zwischen Merkmalen und Zielgröße abbilden), sind aber schnell zu trainieren, gut interpretierbar und benötigen minimalen Hardwarebedarf. Baumbasierte Modelle (z. B. Gradient Boosting, Random Forests) können nicht-lineare Beziehungen und Interaktionen zwischen Merkmalen abbilden, bleiben aber vergleichsweise recheneffizient und funktionieren oft gut auf strukturierten, tabellarischen Daten auch mit moderater Datenmenge. Neuronale Modelle, insbesondere Transformer-Architekturen, bieten die höchste Kapazität und eignen sich besonders für unstrukturierte Daten (Text, Bilder) und sehr große Datenmengen, benötigen dafür aber deutlich mehr Rechenleistung, spezialisierte Hardware (GPUs) und mehr Trainingsdaten, um ihr Kapazitätspotenzial auszuschöpfen, ohne zu überanpassen. Kontextkosten bezeichnen bei Transformer-Architekturen insbesondere die quadratisch mit der Eingabelänge wachsenden Rechenkosten der Aufmerksamkeitsberechnung. Der zentrale methodische Punkt ist, diese Architekturentscheidung nicht anhand von Popularität oder Standardannahmen ("neuronale Modelle sind immer besser") zu treffen, sondern anhand der tatsächlichen Aufgabenpassung (strukturierte vs. unstrukturierte Daten, Datenmenge, Interpretierbarkeitsanforderung) und anhand reproduzierbarer Experimente mit Baseline-Vergleich (siehe [KB-0349](19-experimentdesign-fuer-ml.md)), die den tatsächlichen Mehrwert der höheren Kapazität und Kosten belegen.

~~~text
Linear models:        low capacity, fast, interpretable, minimal hardware -> good for genuinely linear structure
Tree-based models:    non-linear/interaction capacity, compute-efficient -> strong default for structured/tabular data
Neural (incl. Transformer): highest capacity, best for unstructured data (text/images) + large data volume
                       -> needs significant compute, specialized hardware (GPU), more data to avoid overfitting
Transformer context cost: attention computation scales QUADRATICALLY with input length
DECISION RULE: architecture choice driven by TASK FIT + reproducible experiments (KB-0349), NOT popularity/trend
~~~

## Core Concepts, Architektur und Implementierung

| Architektur | Kapazität | Hardwarebedarf | Typische Eignung |
|---|---|---|---|
| Linear | gering (nur lineare Beziehungen) | minimal (CPU ausreichend) | genuin lineare Zusammenhänge, hohe Interpretierbarkeitsanforderung, sehr wenig Daten |
| Baumbasiert (z. B. Gradient Boosting) | mittel bis hoch (nicht-lineare Beziehungen, Interaktionen) | moderat (CPU meist ausreichend) | strukturierte/tabellarische Daten mit moderater bis großer Datenmenge |
| Neuronal / Transformer | sehr hoch, aber quadratisch wachsende Kontextkosten bei Aufmerksamkeit | hoch (spezialisierte Hardware/GPU meist nötig) | unstrukturierte Daten (Text, Bilder), sehr große Datenmengen |

Implementierung: Vor der Wahl einer Modellarchitektur wird die Aufgabe explizit nach Datentyp (strukturiert/tabellarisch vs. unstrukturiert), verfügbarer Datenmenge, Interpretierbarkeitsanforderung und verfügbarem Hardwarebudget charakterisiert. Für strukturierte Daten wird zunächst ein lineares oder baumbasiertes Modell als Baseline trainiert (siehe [KB-0349](19-experimentdesign-fuer-ml.md)); ein neuronales Modell wird nur eingeführt, wenn ein reproduzierbares Experiment einen tatsächlichen, über die normale Streuung hinausgehenden Leistungsvorteil zeigt, der die zusätzlichen Kosten (Hardware, Trainingsdauer, Interpretierbarkeitsverlust) rechtfertigt.

## Scalability, Reliability, Security und Observability

Architekturwahl skaliert Trainings- und Inferenzkosten proportional zur gewählten Kapazität; die Reliability-Grenze liegt darin, dass eine unbegründet komplexe Architektur (neuronales Modell ohne belegten Mehrwert) proportional zu ihrer Komplexität mehr Betriebs-, Wartungs- und Interpretierbarkeitsrisiken erzeugt, ohne einen entsprechenden Leistungsgewinn zu liefern.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein neuronales Modell liefert kaum bessere Ergebnisse als eine einfache Baseline, verursacht aber deutlich höhere Infrastrukturkosten | die Architekturwahl war nicht durch ein reproduzierbares Experiment mit Baseline-Vergleich begründet | ein lineares oder baumbasiertes Modell als Baseline nachträglich trainieren und den tatsächlichen Leistungsunterschied messen |
| die Inferenzkosten eines Transformer-Modells steigen bei längeren Eingaben unverhältnismäßig stark | die quadratisch wachsenden Kontextkosten der Aufmerksamkeitsberechnung wurden bei der Architekturwahl nicht berücksichtigt | die Eingabelängenverteilung der tatsächlichen Aufgabe prüfen und gegen die quadratischen Kontextkosten abwägen |
| ein Team kann die Entscheidungen eines eingesetzten Modells nicht nachvollziehen | eine hochkapazitive Architektur wurde gewählt, obwohl die Aufgabe keine hohe Kapazität erforderte und Interpretierbarkeit wichtig gewesen wäre | prüfen, ob ein interpretierbareres lineares oder baumbasiertes Modell dieselbe Aufgabe mit vertretbarem Genauigkeitsverlust lösen könnte |

Security: Eine unnötig komplexe, schwer nachvollziehbare Architektur erschwert die Rechenschaftspflicht bei fehlerhaften oder diskriminierenden Modellentscheidungen. Observability: Trainings-/Inferenzkosten pro Architektur, gemessener Leistungsunterschied gegenüber der Baseline und die dokumentierte Begründung der Architekturwahl sind zentrale Nachvollziehbarkeitsmetriken.

## Trade-offs und Entscheidungen

**Staff** implementiert stets einen linearen/baumbasierten Baseline-Vergleich, bevor eine neuronale Architektur eingeführt wird. **Principal** macht die Architekturentscheidung und ihre experimentelle Begründung für das Team nachvollziehbar. **Chief** etabliert aufgabengetriebene, experimentell begründete Architekturauswahl als Standard gegenüber Trend- oder Standardwahl im Unternehmen.

Anti-Patterns: eine neuronale oder Transformer-Architektur allein aufgrund von Popularität ohne Baseline-Vergleich wählen; die quadratisch wachsenden Kontextkosten von Transformer-Architekturen bei langen Eingaben ignorieren; ein einfaches, gut geeignetes lineares oder baumbasiertes Modell vorschnell zugunsten eines komplexeren Modells verwerfen.

## Production Checklist

- [ ] Die Aufgabe ist nach Datentyp, Datenmenge, Interpretierbarkeitsanforderung und Hardwarebudget charakterisiert.
- [ ] Ein lineares oder baumbasiertes Modell ist als Baseline vor jeder neuronalen Architektur trainiert.
- [ ] Der Mehrwert einer neuronalen Architektur ist durch ein reproduzierbares Experiment belegt.
- [ ] Kontextkosten bei Transformer-Architekturen sind gegen die tatsächliche Eingabelängenverteilung abgewogen.

## Interviewfragen

### 1. Wann ist ein lineares Modell einem neuronalen Modell vorzuziehen?

**Antwort:** Wenn die Beziehung zwischen Merkmalen und Zielgröße überwiegend linear ist, hohe Interpretierbarkeit gefordert ist oder nur sehr wenig Trainingsdaten verfügbar sind.

### 2. Warum sind baumbasierte Modelle bei strukturierten/tabellarischen Daten oft eine starke Wahl?

**Antwort:** Sie können nicht-lineare Beziehungen und Interaktionen zwischen Merkmalen abbilden, bleiben dabei vergleichsweise recheneffizient und funktionieren auch mit moderater Datenmenge gut, ohne spezialisierte Hardware zu benötigen.

### 3. Was sind die Kontextkosten von Transformer-Architekturen, und warum sind sie relevant für die Architekturwahl?

**Antwort:** Die Rechenkosten der Aufmerksamkeitsberechnung wachsen quadratisch mit der Eingabelänge, was bei Aufgaben mit langen Eingaben zu unverhältnismäßig hohen Kosten führen kann.

### 4. Wie begründest du die Wahl einer neuronalen statt einer einfacheren Architektur?

**Antwort:** Durch ein reproduzierbares Experiment, das die neuronale Architektur explizit gegen eine lineare oder baumbasierte Baseline vergleicht und einen tatsächlichen, über die normale Streuung hinausgehenden Leistungsvorteil zeigt, der die zusätzlichen Kosten rechtfertigt.

### 5. Wie gehst du vor, wenn ein Team eine neuronale Architektur ohne Baseline-Vergleich einsetzen will?

**Antwort:** Ich schlage vor, zunächst eine einfache lineare oder baumbasierte Baseline auf denselben Daten zu trainieren und den tatsächlichen Leistungsunterschied zu messen, bevor die zusätzlichen Kosten und Komplexität der neuronalen Architektur akzeptiert werden.

### 6. Widersprüchliche Anforderung: Team will state-of-the-art Modellarchitektur UND minimalen Hardware-/Betriebsaufwand — wie gehst du vor?

**Antwort:** Ich würde erklären, dass "state-of-the-art" architekturunabhängig als "die Architektur mit dem besten belegten Aufgaben-Fit" statt als "die komplexeste verfügbare Architektur" verstanden werden sollte; ich würde einen Baseline-Vergleich vorschlagen, der zeigt, welche Architektur den geforderten Genauigkeitsbedarf mit dem geringsten Hardwareaufwand erfüllt.

## Praktische Labs

~~~python
import time
import torch
import torch.nn as nn
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import GradientBoostingClassifier

torch.manual_seed(0)
n = 200
X = torch.randn(n, 5)
y = (X[:, 0] + 0.3 * X[:, 1] > 0).long()  # mostly linear structure
X_train, y_train = X[:140], y[:140]
X_test, y_test = X[140:], y[140:]

start = time.time()
linear = LogisticRegression().fit(X_train.numpy(), y_train.numpy())
linear_time = time.time() - start
linear_accuracy = linear.score(X_test.numpy(), y_test.numpy())

start = time.time()
tree = GradientBoostingClassifier(random_state=0).fit(X_train.numpy(), y_train.numpy())
tree_time = time.time() - start
tree_accuracy = tree.score(X_test.numpy(), y_test.numpy())

start = time.time()
model = nn.Sequential(nn.Linear(5, 32), nn.ReLU(), nn.Linear(32, 32), nn.ReLU(), nn.Linear(32, 2))
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
for _ in range(200):
    optimizer.zero_grad()
    loss = nn.CrossEntropyLoss()(model(X_train), y_train)
    loss.backward()
    optimizer.step()
neural_time = time.time() - start
neural_accuracy = (model(X_test).argmax(dim=1) == y_test).float().mean().item()

print(f"Linear:  accuracy={linear_accuracy:.2%}, train_time={linear_time:.4f}s")
print(f"Tree:    accuracy={tree_accuracy:.2%}, train_time={tree_time:.4f}s")
print(f"Neural:  accuracy={neural_accuracy:.2%}, train_time={neural_time:.4f}s")
print("On mostly-linear structure, the neural model's extra compute cost buys little to no accuracy advantage.")
~~~

## Dependencies, Cross-References und Quellen

1. Grinsztajn, Oyallon, Varoquaux: [Why do tree-based models still outperform deep learning on tabular data?](https://arxiv.org/abs/2207.08815), abgerufen 2026-09-17.
2. Vaswani et al.: [Attention Is All You Need](https://arxiv.org/abs/1706.03762), abgerufen 2026-09-17.

Transformer-Architekturen im ML sind kanonisch in [KB-0332](02-transformer-architekturen-im-ml.md) behandelt; Experimentdesign für ML in [KB-0349](19-experimentdesign-fuer-ml.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Effizientere Aufmerksamkeitsmechanismen mit sub-quadratischer Kontextkosten-Skalierung | Evaluating | Gegenüber Standard-Aufmerksamkeit abwägen, sobald Aufgaben mit sehr langen Eingaben und ausreichender Bibliotheksreife vorliegen. |
| Automatisierte Architektur-Auswahlwerkzeuge (AutoML), die linear/baumbasiert/neuronal systematisch vergleichen | Adopting | Gegenüber rein manueller Architekturwahl für systematischere, experimentell belegte Entscheidungen bevorzugen. |

Ein Team akzeptiert eine neuronale Architekturentscheidung erst, wenn ein dokumentierter Baseline-Vergleich den tatsächlichen Mehrwert gegenüber einem linearen oder baumbasierten Modell belegt.
