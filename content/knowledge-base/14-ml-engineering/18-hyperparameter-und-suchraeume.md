---
{"id": "KB-0348", "title": "Hyperparameter und Suchräume", "domain": "14", "sequence": 18, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0336", "concepts": ["Optimierer und Gradienten"], "needed_for": "understanding"}, {"id": "KB-0346", "concepts": ["Datensplits und Leakage"], "needed_for": "understanding"}], "related": ["KB-0347"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine einfache Hyperparameter-Suche über einen definierten Suchraum durchführen und Ergebnisse ausschließlich auf der Validierungsmenge vergleichen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Architektur-, Optimierungs- und Datenparameter kategorisieren und einen sinnvoll begrenzten Suchraum mit Budget für einen reproduzierbaren Modellvergleich definieren.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein Modellvergleich durch Testmengen-Leakage im Rahmen der Hyperparameter-Suche verzerrt wurde, und den Vergleich korrekt auf die Validierungsmenge umstellen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Reproduzierbare, budgetierte Hyperparameter-Suchprozesse mit strikter Validierungsgrenze als Standard für glaubwürdige Modellvergleiche im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene Suchstrategien wie Bayessche Optimierung oder Population-Based Training sind Vertiefung.", "rationale": "Kern ist die korrekte Kategorisierung von Parametern und die Validierungsgrenze, nicht die konkrete Suchstrategie."}}, "lab_validation": [{"lab_id": "KB-0348-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales, synthetisches Datenset mit Grid-Search über einen kleinen, definierten Hyperparameter-Suchraum", "evidence": "Eine Grid-Search über Lernrate und Weight Decay, ausschließlich anhand der Validierungsmenge bewertet, identifiziert eine Konfiguration mit deutlich niedrigerem Validierungsfehler als eine willkürlich gewählte Standardkonfiguration, während die Testmenge während der gesamten Suche unberührt bleibt.", "limitations": "Kein produktives Hyperparameter-Tuning-System, kein realer Geschäftsdatensatz, kleiner Suchraum."}]}
---
# Hyperparameter und Suchräume

> **Ziel:** Hyperparameter sind Konfigurationswerte, die vor dem Training festgelegt werden (im Gegensatz zu den während des Trainings gelernten Modellgewichten) und in Architektur-, Optimierungs- und Datenparameter unterschieden werden können. Ein sinnvoll begrenzter Suchraum mit klarem Budget, aufbauend auf Optimierer-Grundlagen (siehe [KB-0336](06-optimierer-und-gradienten.md)) und einem sauberen Datensplit (siehe [KB-0346](16-datensplits-und-leakage.md)), ist Voraussetzung für einen reproduzierbaren und ehrlichen Modellvergleich. Der zentrale Punkt ist, dass jeder Hyperparameter-Vergleich ausschließlich auf der Validierungsmenge erfolgen darf — die Testmenge bleibt für die finale, einmalige Bewertung reserviert.

## Zweck, Mental Model und Dependencies

Architekturparameter (z. B. Anzahl der Schichten, Anzahl der Neuronen pro Schicht) bestimmen die Kapazität und Struktur des Modells selbst. Optimierungsparameter (z. B. Lernrate, Weight Decay, Batch-Größe) bestimmen, wie das Training abläuft, aufbauend auf den Optimierer-Grundlagen zu Gradientenstabilität (siehe [KB-0336](06-optimierer-und-gradienten.md)). Datenparameter (z. B. Umfang der Datenaugmentierung, Anteil der Trainingsdaten) bestimmen, welche und wie viele Daten für das Training verwendet werden. Ein Suchraum definiert für jeden relevanten Hyperparameter einen sinnvollen Wertebereich (z. B. Lernrate zwischen 1e-4 und 1e-1 auf logarithmischer Skala statt eines beliebig großen Bereichs), basierend auf Domänenwissen oder vorläufigen Experimenten, statt eines unbegrenzten oder willkürlichen Bereichs. Ein Budget begrenzt die Anzahl der getesteten Konfigurationen oder die verfügbare Rechenzeit explizit, um die Suche reproduzierbar und zeitlich planbar zu machen. Der zentrale methodische Punkt ist die Validierungsgrenze: jede Konfiguration wird während der Suche ausschließlich anhand der Validierungsmenge verglichen (nie der Testmenge), und erst die final ausgewählte, beste Konfiguration wird einmalig auf der Testmenge bewertet — wird stattdessen die Testmenge wiederholt während der Suche verwendet, sickert Information aus der Testmenge indirekt in die Modellauswahl (eine Form von Leakage, siehe [KB-0346](16-datensplits-und-leakage.md)), was die finale Testgenauigkeit zu optimistisch erscheinen lässt.

~~~text
Architecture params:   layers, units per layer -> model capacity/structure
Optimization params:   learning rate, weight decay, batch size -> HOW training proceeds (cf. KB-0336)
Data params:           augmentation extent, training data fraction -> WHICH/HOW MUCH data is used
Search space: sensible bounded range per hyperparameter (e.g. learning rate 1e-4..1e-1, log scale)
Budget: explicit limit on number of configurations tested OR compute time -> reproducible, planable
VALIDATION BOUNDARY (critical): compare configurations ONLY on validation set during search
  -> test set touched ONCE, only for the final selected configuration
  -> repeated test-set use during search = indirect leakage into model selection (cf. KB-0346)
~~~

## Core Concepts, Architektur und Implementierung

| Parametertyp | Beispiele | Typischer Suchraum |
|---|---|---|
| Architektur | Anzahl Schichten, Neuronen pro Schicht | kleine, diskrete Menge sinnvoller Konfigurationen |
| Optimierung | Lernrate, Weight Decay, Batch-Größe | logarithmische Skala für Lernrate/Weight Decay, diskrete Menge für Batch-Größe |
| Daten | Augmentierungsumfang, Trainingsdatenanteil | begrenzte, domänenspezifisch sinnvolle Werte |

Implementierung: Für jeden Hyperparameter wird explizit kategorisiert, ob es sich um einen Architektur-, Optimierungs- oder Datenparameter handelt, und ein sinnvoll begrenzter Wertebereich basierend auf Domänenwissen definiert. Ein Suchbudget (maximale Anzahl Konfigurationen oder Rechenzeit) wird vorab festgelegt. Jede Konfiguration wird auf der Trainingsmenge trainiert und ausschließlich auf der Validierungsmenge bewertet; die beste Konfiguration nach diesem Kriterium wird ausgewählt und erst danach einmalig auf der Testmenge bewertet, um eine ehrliche, nicht durch die Suche verzerrte Abschätzung der finalen Modellleistung zu erhalten.

## Scalability, Reliability, Security und Observability

Hyperparameter-Suchen skalieren proportional zum Suchraum und Budget in Rechenaufwand; die Reliability-Grenze liegt darin, dass eine unbegrenzte oder wiederholte Nutzung der Testmenge während der Suche die finale Testgenauigkeit systematisch zu optimistisch erscheinen lässt, unabhängig von der tatsächlichen Modellqualität.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| die finale Testgenauigkeit nach einer umfangreichen Hyperparameter-Suche ist deutlich höher als in Produktion beobachtet | die Testmenge wurde wiederholt während der Suche zur Konfigurationsauswahl verwendet (indirekte Leakage) | den Suchprozess prüfen und sicherstellen, dass ausschließlich die Validierungsmenge während der Suche verwendet wurde |
| die Hyperparameter-Suche liefert keine sinnvolle Verbesserung gegenüber einer Standardkonfiguration | der definierte Suchraum ist zu eng oder deckt den relevanten Wertebereich nicht ab | den Suchraum anhand von Domänenwissen oder vorläufigen Experimenten erweitern und neu prüfen |
| die Suche benötigt unvorhersehbar viel Rechenzeit | kein explizites Budget wurde vor Beginn der Suche festgelegt | ein explizites Budget (Anzahl Konfigurationen oder Rechenzeit) vor der nächsten Suche festlegen |

Security: Ein unbegrenzter Suchraum ohne Budget kann zu unkontrolliertem Ressourcenverbrauch führen, insbesondere in geteilten Recheninfrastrukturen. Observability: Validierungsfehler pro getesteter Konfiguration, verbrauchtes Budget relativ zum geplanten Budget und die Differenz zwischen Validierungs- und späterer Testmengenleistung sind zentrale Metriken zur Überwachung der Suchqualität.

## Trade-offs und Entscheidungen

**Staff** implementiert Hyperparameter-Suchen mit klar definiertem Suchraum, Budget und strikter Validierungsgrenze. **Principal** macht die Kategorisierung der Parameter und die Suchergebnisse für das Team nachvollziehbar dokumentiert. **Chief** etabliert reproduzierbare, budgetierte Suchprozesse mit strikter Validierungsgrenze als Standard für glaubwürdige Modellvergleiche im Unternehmen.

Anti-Patterns: die Testmenge wiederholt während der Hyperparameter-Suche zur Konfigurationsauswahl verwenden; einen Suchraum ohne Domänenwissen willkürlich groß oder klein wählen; eine Suche ohne vorab definiertes Budget starten.

## Production Checklist

- [ ] Jeder Hyperparameter ist als Architektur-, Optimierungs- oder Datenparameter kategorisiert.
- [ ] Der Suchraum ist sinnvoll begrenzt und basiert auf Domänenwissen oder vorläufigen Experimenten.
- [ ] Ein explizites Budget (Konfigurationsanzahl oder Rechenzeit) ist vor Beginn der Suche festgelegt.
- [ ] Die Testmenge wird ausschließlich einmalig für die final ausgewählte Konfiguration verwendet.

## Interviewfragen

### 1. Wie unterscheidest du Architektur-, Optimierungs- und Datenparameter?

**Antwort:** Architekturparameter bestimmen Struktur und Kapazität des Modells selbst, Optimierungsparameter bestimmen den Trainingsablauf, Datenparameter bestimmen welche und wie viele Daten verwendet werden.

### 2. Warum darf die Testmenge nicht wiederholt während der Hyperparameter-Suche verwendet werden?

**Antwort:** Eine wiederholte Nutzung lässt Information aus der Testmenge indirekt in die Modellauswahl einfließen, was die finale Testgenauigkeit systematisch zu optimistisch erscheinen lässt — eine Form von Leakage.

### 3. Wie definierst du einen sinnvollen Suchraum für einen Hyperparameter wie die Lernrate?

**Antwort:** Ich definiere einen begrenzten, meist logarithmisch skalierten Wertebereich basierend auf Domänenwissen oder vorläufigen Experimenten, statt eines beliebig großen oder willkürlichen Bereichs.

### 4. Warum ist ein explizites Suchbudget wichtig?

**Antwort:** Es macht die Suche reproduzierbar und zeitlich planbar, verhindert unkontrollierten Ressourcenverbrauch und ermöglicht einen fairen Vergleich mehrerer Suchläufe.

### 5. Wie diagnostizierst du eine Diskrepanz zwischen finaler Testgenauigkeit und tatsächlicher Produktionsleistung nach einer Hyperparameter-Suche?

**Antwort:** Ich prüfe zuerst, ob die Testmenge während der Suche mehrfach zur Konfigurationsauswahl verwendet wurde, statt strikt nur die Validierungsmenge; falls ja, wiederhole ich die Suche mit korrekter Validierungsgrenze und bewerte die Testmenge erneut nur einmalig.

### 6. Widersprüchliche Anforderung: Team will schnellstmöglich die beste Konfiguration finden UND garantiert unverzerrte, glaubwürdige finale Testgenauigkeit — wie gehst du vor?

**Antwort:** Ich würde erklären, dass beide Ziele vereinbar sind, solange die Suche strikt auf der Validierungsmenge erfolgt; ich würde ein klar budgetiertes Suchverfahren mit definiertem Suchraum vorschlagen, das schnell durchführbar ist, ohne die Testmenge während der Suche zu berühren, sodass die finale, einmalige Testmengenbewertung glaubwürdig bleibt.

## Praktische Labs

~~~python
import torch
import torch.nn as nn
import itertools

torch.manual_seed(0)
n = 60
X = torch.randn(n, 2)
y = (X[:, 0] + X[:, 1] > 0).long()
X_train, y_train = X[:36], y[:36]
X_val, y_val = X[36:48], y[36:48]
X_test, y_test = X[48:], y[48:]

search_space = {
    "lr": [0.01, 0.1],
    "weight_decay": [0.0, 0.05],
}

best_val_loss = float("inf")
best_config = None
for lr, wd in itertools.product(search_space["lr"], search_space["weight_decay"]):
    torch.manual_seed(1)
    model = nn.Sequential(nn.Linear(2, 16), nn.ReLU(), nn.Linear(16, 2))
    optimizer = torch.optim.Adam(model.parameters(), lr=lr, weight_decay=wd)
    for _ in range(100):
        optimizer.zero_grad()
        loss = nn.CrossEntropyLoss()(model(X_train), y_train)
        loss.backward()
        optimizer.step()
    with torch.no_grad():
        val_loss = nn.CrossEntropyLoss()(model(X_val), y_val).item()
    print(f"lr={lr}, weight_decay={wd} -> validation loss: {val_loss:.4f}")
    if val_loss < best_val_loss:
        best_val_loss = val_loss
        best_config = (lr, wd)

print(f"\nBest configuration selected via VALIDATION set only: lr={best_config[0]}, weight_decay={best_config[1]}")

torch.manual_seed(1)
final_model = nn.Sequential(nn.Linear(2, 16), nn.ReLU(), nn.Linear(16, 2))
optimizer = torch.optim.Adam(final_model.parameters(), lr=best_config[0], weight_decay=best_config[1])
for _ in range(100):
    optimizer.zero_grad()
    loss = nn.CrossEntropyLoss()(final_model(X_train), y_train)
    loss.backward()
    optimizer.step()
test_accuracy = (final_model(X_test).argmax(dim=1) == y_test).float().mean().item()
print(f"Final test accuracy (test set touched ONCE, after selection): {test_accuracy:.2%}")
~~~

## Dependencies, Cross-References und Quellen

1. Bergstra, Bengio: [Random Search for Hyper-Parameter Optimization](https://www.jmlr.org/papers/v13/bergstra12a.html), abgerufen 2026-09-17.
2. Feurer, Hutter: [Hyperparameter Optimization](https://www.automl.org/wp-content/uploads/2018/09/chapter1-hpo.pdf), abgerufen 2026-09-17.

Optimierer und Gradienten sind kanonisch in [KB-0336](06-optimierer-und-gradienten.md) behandelt; Datensplits und Leakage in [KB-0346](16-datensplits-und-leakage.md); Overfitting und Regularisierung in [KB-0347](17-overfitting-und-regularisierung.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Hyperparameter-Suchframeworks mit integrierter Budgetverwaltung und früher Terminierung schlechter Konfigurationen | Adopting | Gegenüber manueller Grid-Search für effizientere Nutzung des Suchbudgets bevorzugen. |
| Multi-Fidelity-Suchstrategien, die vielversprechende Konfigurationen zunächst mit reduziertem Rechenaufwand vorfiltern | Evaluating | Gegenüber vollständigem Training jeder Konfiguration abwägen, sobald der Suchraum groß genug ist, um den zusätzlichen Implementierungsaufwand zu rechtfertigen. |

Ein Team akzeptiert eine finale Hyperparameter-Konfiguration erst, wenn die Suche dokumentiert mit definiertem Suchraum, Budget und strikter Validierungsgrenze durchgeführt wurde.
