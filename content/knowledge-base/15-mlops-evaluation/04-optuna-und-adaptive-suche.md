---
{"id": "KB-0354", "title": "Optuna und adaptive Suche", "domain": "15", "sequence": 4, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0348", "concepts": ["Hyperparameter und Suchräume"], "needed_for": "understanding"}], "related": ["KB-0352"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Optuna-Studie mit mehreren Trials durchführen und einen Pruner zum vorzeitigen Abbruch schlecht laufender Trials einsetzen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine adaptive Suchstrategie mit geeignetem Sampler und Pruner gestalten, die Rechenaufwand gegenüber einer erschöpfenden Grid-Search deutlich reduziert.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein Pruner-Kriterium versehentlich auf Basis der Testmenge statt der Validierungsmenge definiert wurde, und dies korrigieren.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Adaptive, budgetbewusste Hyperparameter-Suche als Standard gegenüber erschöpfender Grid-Search im Unternehmen etablieren, ohne die Validierungsgrenze aus KB-0348 zu verletzen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene Sampler-Algorithmen wie CMA-ES sind Vertiefung.", "rationale": "Kern ist das Verständnis von Trials, Samplern und Prunern als Konzept, nicht jeder einzelne Sampler-Algorithmus."}}, "lab_validation": [{"lab_id": "KB-0354-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokale Optuna-Studie mit einem kleinen synthetischen Datensatz und einem Pruner basierend auf Zwischenvalidierungsergebnissen", "evidence": "Eine Optuna-Studie mit Pruner bricht schlecht laufende Trials frühzeitig anhand von Zwischenergebnissen auf der Validierungsmenge ab, wodurch die Gesamtsuche deutlich weniger Rechenzeit benötigt als eine vollständige Grid-Search über denselben Suchraum, bei vergleichbarem finalem Validierungsergebnis der besten gefundenen Konfiguration.", "limitations": "Kein produktives Suchsystem, kein realer Geschäftsdatensatz, kleiner Suchraum."}]}
---
# Optuna und adaptive Suche

> **Ziel:** Optuna ist ein Framework für adaptive Hyperparameter-Suche, das über Trials (einzelne getestete Konfigurationen), Sampler (Strategien zur Auswahl der nächsten zu testenden Konfiguration basierend auf bisherigen Ergebnissen) und Pruner (Mechanismen zum vorzeitigen Abbruch schlecht laufender Trials) den Suchraum effizienter durchsucht als eine erschöpfende Grid-Search, aufbauend auf den Suchraum-Grundlagen (siehe [KB-0348](../14-ml-engineering/18-hyperparameter-und-suchraeume.md)). Der zentrale Kontrollpunkt ist, dass sowohl die adaptive Sampler-Strategie als auch das Pruner-Abbruchkriterium ausschließlich auf der Validierungsmenge basieren dürfen, um eine verzerrte, zu optimistische Bewertung zu vermeiden.

## Zweck, Mental Model und Dependencies

Ein Trial ist ein einzelner Durchlauf mit einer konkreten Hyperparameter-Konfiguration innerhalb einer Studie (der Gesamtheit aller Trials für eine Suchaufgabe). Ein Sampler entscheidet, welche Konfiguration als Nächstes getestet wird, basierend auf den Ergebnissen bereits abgeschlossener Trials — im Gegensatz zu Grid-Search, die den gesamten Suchraum unabhängig von Zwischenergebnissen erschöpfend durchläuft, konzentriert ein adaptiver Sampler die Suche zunehmend auf vielversprechende Bereiche des Suchraums. Ein Pruner überwacht einen laufenden Trial anhand von Zwischenergebnissen (z. B. Validierungsfehler nach wenigen Trainingsepochen) und bricht ihn frühzeitig ab, wenn er im Vergleich zu bereits abgeschlossenen Trials erkennbar schlecht abschneidet, wodurch Rechenzeit gespart wird, die sonst in einen aussichtslosen Trial investiert würde. Der zentrale methodische Punkt ist, dass sowohl die Sampler-Entscheidung als auch das Pruner-Kriterium ausschließlich auf der Validierungsmenge (nie der Testmenge) basieren müssen — würde stattdessen die Testmenge zur Steuerung der Suche verwendet, sickerte Information aus der Testmenge indirekt in die adaptive Suchstrategie selbst ein, was eine noch subtilere Form der in [KB-0348](../14-ml-engineering/18-hyperparameter-und-suchraeume.md) beschriebenen Leakage darstellt, da nicht nur die finale Auswahl, sondern jeder einzelne Zwischenschritt der Suche potenziell verzerrt wird.

~~~text
Trial: one run with a concrete hyperparameter configuration, within a Study (the full search)
Sampler: chooses NEXT configuration based on RESULTS of completed trials (adaptive)
  vs. Grid Search: exhaustively tests entire search space, ignoring intermediate results
Pruner: monitors a RUNNING trial's intermediate results -> aborts EARLY if clearly underperforming
  -> saves compute that would otherwise go into a doomed trial
CRITICAL: sampler decisions AND pruner criteria must be based ONLY on the validation set, NEVER the test set
  -> test-set-driven search steering = leakage into the search process itself (subtler than KB-0348's final-selection leakage)
~~~

## Core Concepts, Architektur und Implementierung

| Element | Funktion | Effekt gegenüber Grid-Search |
|---|---|---|
| Trial | ein einzelner Durchlauf mit konkreter Konfiguration | identisch zu einem Grid-Search-Durchlauf |
| Sampler | wählt die nächste Konfiguration basierend auf bisherigen Ergebnissen | konzentriert Suche auf vielversprechende Bereiche statt erschöpfender Abdeckung |
| Pruner | bricht schlecht laufende Trials anhand von Zwischenergebnissen frühzeitig ab | spart Rechenzeit, die in aussichtslose Konfigurationen investiert würde |

Implementierung: Eine Optuna-Studie definiert den Suchraum (analog zu [KB-0348](../14-ml-engineering/18-hyperparameter-und-suchraeume.md)) und ein Budget an Trials oder Zeit. Für jeden Trial wird das Modell trainiert und in regelmäßigen Zwischenschritten (z. B. nach jeder Epoche) der Validierungsfehler an den Pruner gemeldet; unterschreitet der Zwischenwert deutlich das bisher beobachtete Potenzial im Vergleich zu anderen Trials, wird der Trial abgebrochen. Nach Abschluss der Studie wird die Konfiguration mit dem besten Validierungsergebnis ausgewählt und, wie in [KB-0348](../14-ml-engineering/18-hyperparameter-und-suchraeume.md) beschrieben, einmalig auf der Testmenge final bewertet.

## Scalability, Reliability, Security und Observability

Adaptive Suche mit Pruning skaliert das effektiv nutzbare Suchbudget proportional zur eingesparten Rechenzeit durch frühzeitigen Abbruch; die Reliability-Grenze liegt darin, dass ein zu aggressives Pruner-Kriterium vielversprechende, aber langsam startende Konfigurationen fälschlich zu früh verwerfen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| die finale ausgewählte Konfiguration zeigt eine unerwartet optimistische Testgenauigkeit | das Pruner-Kriterium oder der Sampler wurde versehentlich anhand der Testmenge statt der Validierungsmenge gesteuert | den Suchcode prüfen und sicherstellen, dass ausschließlich Validierungsmetriken an Sampler und Pruner gemeldet werden |
| eine adaptive Suche liefert schlechtere Ergebnisse als eine einfache Grid-Search über denselben Suchraum | das Pruner-Kriterium ist zu aggressiv und verwirft vielversprechende, aber langsam konvergierende Konfigurationen zu früh | das Pruner-Kriterium lockern (z. B. mehr Zwischenschritte vor der ersten Abbruchentscheidung zulassen) |
| die Suche benötigt trotz Pruning kaum weniger Rechenzeit als eine vollständige Grid-Search | zu wenige Trials wurden tatsächlich frühzeitig abgebrochen, das Pruner-Kriterium greift kaum | die Pruner-Konfiguration und die Verteilung der Abbruchzeitpunkte über alle Trials prüfen |

Security: Kein spezifisches, über allgemeine Hyperparameter-Suchrisiken (siehe [KB-0348](../14-ml-engineering/18-hyperparameter-und-suchraeume.md)) hinausgehendes Sicherheitsrisiko; die Validierungsgrenze bleibt der zentrale Kontrollpunkt. Observability: Anzahl abgeschlossener vs. abgebrochener Trials, eingesparte Rechenzeit durch Pruning und die Konvergenz des besten gefundenen Validierungsergebnisses über die Anzahl der Trials sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert adaptive Suche mit Sampler und Pruner für Suchräume, bei denen erschöpfende Grid-Search zu rechenintensiv wäre. **Principal** macht die Sampler-/Pruner-Konfiguration und die eingesparte Rechenzeit für das Team nachvollziehbar. **Chief** etabliert adaptive, budgetbewusste Suche als Standard gegenüber erschöpfender Grid-Search im Unternehmen, ohne die Validierungsgrenze zu verletzen.

Anti-Patterns: Sampler- oder Pruner-Entscheidungen anhand der Testmenge statt der Validierungsmenge steuern; ein zu aggressives Pruner-Kriterium ohne Prüfung der dadurch verworfenen Konfigurationen verwenden; adaptive Suche bei sehr kleinen Suchräumen einsetzen, wo eine einfache Grid-Search ausreichend und transparenter wäre.

## Production Checklist

- [ ] Sampler- und Pruner-Entscheidungen basieren ausschließlich auf der Validierungsmenge.
- [ ] Das Pruner-Kriterium ist gegen fälschliches frühzeitiges Verwerfen vielversprechender Konfigurationen geprüft.
- [ ] Die finale Konfiguration wird nach Abschluss der Studie einmalig auf der Testmenge bewertet.
- [ ] Eingesparte Rechenzeit durch Pruning wird dokumentiert, um den Suchprozess nachvollziehbar zu machen.

## Interviewfragen

### 1. Was ist der Unterschied zwischen einem Trial und einer Studie in Optuna?

**Antwort:** Ein Trial ist ein einzelner Durchlauf mit einer konkreten Hyperparameter-Konfiguration; eine Studie ist die Gesamtheit aller Trials für eine bestimmte Suchaufgabe.

### 2. Wie unterscheidet sich ein adaptiver Sampler von Grid-Search?

**Antwort:** Ein adaptiver Sampler wählt die nächste zu testende Konfiguration basierend auf den Ergebnissen bereits abgeschlossener Trials, während Grid-Search den gesamten Suchraum unabhängig von Zwischenergebnissen erschöpfend durchläuft.

### 3. Was macht ein Pruner, und welchen Vorteil bietet er?

**Antwort:** Ein Pruner überwacht einen laufenden Trial anhand von Zwischenergebnissen und bricht ihn frühzeitig ab, wenn er erkennbar schlecht abschneidet, wodurch Rechenzeit gespart wird.

### 4. Warum ist es kritisch, dass Sampler und Pruner ausschließlich auf der Validierungsmenge basieren?

**Antwort:** Würde die Testmenge zur Steuerung der Suche verwendet, sickerte Information aus der Testmenge in jeden Zwischenschritt der Suche ein, was eine subtile Form von Leakage darstellt, die über die reine finale Konfigurationsauswahl hinausgeht.

### 5. Wie diagnostizierst du, dass ein Pruner-Kriterium zu aggressiv eingestellt ist?

**Antwort:** Ich prüfe, ob die adaptive Suche schlechtere Ergebnisse liefert als eine vergleichbare Grid-Search über denselben Suchraum, was darauf hindeutet, dass vielversprechende, aber langsam konvergierende Konfigurationen zu früh verworfen wurden.

### 6. Widersprüchliche Anforderung: Team will maximale Rechenzeitersparnis durch aggressives Pruning UND garantiert keine vielversprechende Konfiguration wird übersehen — wie gehst du vor?

**Antwort:** Ich würde das Pruner-Kriterium so konfigurieren, dass es erst nach ausreichend vielen Zwischenschritten greift (um langsam konvergierende, aber letztlich gute Konfigurationen nicht vorschnell zu verwerfen), und die Pruning-Aggressivität schrittweise erhöhen, während ich die Ergebnisqualität gegen eine weniger aggressive Referenzkonfiguration validiere.

## Praktische Labs

~~~python
import optuna
import torch
import torch.nn as nn

torch.manual_seed(0)
X = torch.randn(80, 3)
y = (X[:, 0] + X[:, 1] > 0).long()
X_train, y_train = X[:56], y[:56]
X_val, y_val = X[56:], y[56:]

def objective(trial):
    lr = trial.suggest_float("lr", 1e-3, 1e-1, log=True)
    hidden = trial.suggest_categorical("hidden_units", [8, 32])

    model = nn.Sequential(nn.Linear(3, hidden), nn.ReLU(), nn.Linear(hidden, 2))
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)

    for epoch in range(30):
        optimizer.zero_grad()
        loss = nn.CrossEntropyLoss()(model(X_train), y_train)
        loss.backward()
        optimizer.step()

        with torch.no_grad():
            val_loss = nn.CrossEntropyLoss()(model(X_val), y_val).item()
        trial.report(val_loss, epoch)  # validation-only signal reported to pruner
        if trial.should_prune():
            raise optuna.TrialPruned()

    return val_loss

study = optuna.create_study(direction="minimize", pruner=optuna.pruners.MedianPruner())
study.optimize(objective, n_trials=10)

print(f"Completed trials: {len([t for t in study.trials if t.state == optuna.trial.TrialState.COMPLETE])}")
print(f"Pruned trials: {len([t for t in study.trials if t.state == optuna.trial.TrialState.PRUNED])}")
print(f"Best configuration (selected via validation loss only): {study.best_params}")
~~~

## Dependencies, Cross-References und Quellen

1. Optuna-Dokumentation: [Key Features — Efficient Optimization Algorithms and Pruning](https://optuna.readthedocs.io/en/stable/tutorial/index.html), abgerufen 2026-09-17.
2. Akiba et al.: [Optuna — A Next-generation Hyperparameter Optimization Framework](https://arxiv.org/abs/1907.10902), abgerufen 2026-09-17.

Hyperparameter und Suchräume sind kanonisch in [KB-0348](../14-ml-engineering/18-hyperparameter-und-suchraeume.md) behandelt; Weights and Biases in [KB-0352](02-weights-and-biases.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Multi-Fidelity-Pruning-Strategien, die frühe Trial-Ergebnisse mit reduzierter Datenmenge/Modellgröße vorab bewerten | Evaluating | Gegenüber standardmäßigem Zwischenschritt-Pruning abwägen, sobald der Suchraum groß genug ist, um den zusätzlichen Implementierungsaufwand zu rechtfertigen. |
| Integrierte Distributed-Tuning-Unterstützung für parallele Trials über mehrere Maschinen | Adopting | Gegenüber sequenzieller Trial-Ausführung für schnellere Suchdurchläufe bei ausreichend verfügbarer Rechenkapazität bevorzugen. |

Ein Team akzeptiert eine über adaptive Suche gefundene Konfiguration erst, wenn dokumentiert ist, dass Sampler und Pruner ausschließlich auf Validierungsmetriken basierten.
