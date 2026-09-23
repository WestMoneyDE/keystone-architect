---
{"id": "KB-0337", "title": "Trainingsloops und Checkpoints", "domain": "14", "sequence": 7, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0336", "concepts": ["Optimierer und Gradienten"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen vollständigen Trainingsloop mit Forward Pass, Backpropagation, Optimierung, festen Seeds und Checkpoint-Speicherung implementieren und dessen Reproduzierbarkeit über zwei identische Läufe verifizieren.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Trainingsloop-Architektur gestalten, die Checkpoints an sinnvollen Intervallen speichert und Ressourcen (insbesondere GPU-Speicher) nach jedem Experiment zuverlässig freigibt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein nicht reproduzierbares Trainingsergebnis auf fehlende oder unvollständige Seed-Kontrolle statt auf ein allgemeines Modellproblem zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Reproduzierbarkeit von ML-Experimenten als Grundvoraussetzung für verlässliche Modellentwicklung positionieren, die explizite Kontrolle über Seeds, Checkpoints und Ressourcenfreigabe erfordert.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete verteilte Trainings-Checkpoint-Strategien sind Vertiefung.", "rationale": "Kern ist das Prinzip reproduzierbarer Einzel-Trainingsloops, nicht verteiltes Training über mehrere Geräte."}}, "lab_validation": [{"lab_id": "KB-0337-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokaler PyTorch-Trainingsloop mit festem Seed, der zweimal identisch ausgeführt wird, um Reproduzierbarkeit zu verifizieren", "evidence": "Zwei identische Trainingsläufe mit demselben festen Seed erzeugen exakt dieselben Parameterwerte nach jedem Trainingsschritt, während ein Lauf ohne festen Seed bei jeder Ausführung unterschiedliche Ergebnisse liefert.", "limitations": "Kein produktives Trainingssystem, kein großer Datensatz, keine reale GPU-Infrastruktur getestet."}]}
---
# Trainingsloops und Checkpoints

> **Ziel:** Ein Trainingsloop kombiniert Forward Pass (Berechnung der Modellausgabe), Backpropagation (Berechnung der Gradienten, aufbauend auf Optimierern, siehe [KB-0336](06-optimierer-und-gradienten.md)) und Optimierung (Parameterupdate) in einer wiederholten Schleife über die Trainingsdaten. Seeds (feste Zufallszahlen-Initialisierung), Checkpoints (periodische Speicherung des Trainingszustands) und zuverlässige Ressourcenfreigabe sind notwendig, um Experimente nachvollziehbar und reproduzierbar zu machen — ohne diese Kontrolle ist ein Trainingsergebnis nicht verlässlich wiederholbar oder vergleichbar.

## Zweck, Mental Model und Dependencies

Der Forward Pass berechnet die Modellausgabe für einen Batch von Eingabedaten, indem die Eingabe durch alle Layer des Netzes propagiert wird. Backpropagation berechnet anschließend die Gradienten des Loss-Werts bezüglich jedes Parameters über die Kettenregel (siehe [KB-0336](06-optimierer-und-gradienten.md)). Der Optimierer aktualisiert die Parameter basierend auf diesen Gradienten. Diese drei Schritte werden wiederholt über viele Batches und Epochen (vollständige Durchläufe durch den Trainingsdatensatz) ausgeführt. Der zentrale, oft übersehene Punkt für nachvollziehbare Experimente ist die Kontrolle über Zufallsquellen: ein Trainingsloop enthält typischerweise mehrere Quellen von Zufälligkeit (Parameterinitialisierung, Datenreihenfolge beim Mischen, Dropout-Masken), die alle über einen festen Seed kontrolliert werden müssen, um exakt reproduzierbare Ergebnisse zu erzielen — wird auch nur eine dieser Zufallsquellen nicht kontrolliert, unterscheiden sich wiederholte Läufe trotz identischer sonstiger Konfiguration. Checkpoints speichern den vollständigen Trainingszustand (Modellparameter, Optimiererzustand, aktuelle Trainingsposition) in regelmäßigen Intervallen, sodass ein unterbrochenes Training fortgesetzt oder ein früherer, möglicherweise besserer Zustand wiederhergestellt werden kann. Zuverlässige Ressourcenfreigabe (insbesondere GPU-Speicher) nach Abschluss oder Abbruch eines Experiments verhindert, dass nachfolgende Experimente durch nicht freigegebene Ressourcen aus vorherigen Läufen beeinträchtigt werden.

~~~text
Forward pass: compute model output for a batch of input data
Backpropagation: compute gradients of loss w.r.t. each parameter via chain rule (KB-0336)
Optimizer step: update parameters based on gradients
Repeated across many batches and epochs
CRITICAL FOR REPRODUCIBILITY: multiple randomness sources in a training loop
  (parameter init, data shuffling order, dropout masks) -> ALL must be seeded, or repeated runs diverge
Checkpoints: save FULL training state (params, optimizer state, position) at intervals
  -> enables resuming interrupted training or restoring an earlier, possibly better state
Reliable resource release: prevents leftover GPU memory from one run corrupting the next experiment
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Vollständige Seed-Kontrolle aller Zufallsquellen | werden alle relevanten Zufallsquellen (Parameterinitialisierung, Datenreihenfolge, Dropout) durch einen festen Seed kontrolliert? | eine unvollständige Seed-Kontrolle führt zu nicht reproduzierbaren Ergebnissen, obwohl scheinbar dieselbe Konfiguration verwendet wurde |
| Vollständiger Checkpoint-Zustand | speichert ein Checkpoint den vollständigen Zustand (Parameter, Optimiererzustand, Trainingsposition), nicht nur die Modellparameter? | ein unvollständiger Checkpoint kann nach Wiederherstellung zu einem inkonsistenten Optimiererzustand führen, der die Fortsetzung des Trainings beeinträchtigt |
| Angemessenes Checkpoint-Intervall | ist das Checkpoint-Intervall angemessen zwischen Speicheraufwand und akzeptablem Fortschrittsverlust bei Unterbrechung gewählt? | ein zu seltenes Checkpoint-Intervall kann bei Unterbrechung erheblichen Trainingsfortschritt kosten |
| Zuverlässige Ressourcenfreigabe nach Experimentende | wird GPU-Speicher und andere Ressourcen nach Abschluss oder Abbruch eines Experiments zuverlässig freigegeben? | nicht freigegebene Ressourcen können nachfolgende Experimente durch unzureichenden verfügbaren Speicher beeinträchtigen oder zum Absturz bringen |

Implementierung: Vor Beginn eines Trainingsexperiments werden alle relevanten Zufallsquellen (Parameterinitialisierung, Datenreihenfolge, Dropout-Masken) explizit mit demselben festen Seed initialisiert. Checkpoints speichern den vollständigen Trainingszustand einschließlich Modellparameter, Optimiererzustand und aktueller Trainingsposition, in einem Intervall, das zwischen Speicheraufwand und akzeptablem Fortschrittsverlust bei Unterbrechung abgewogen ist. Nach Abschluss oder Abbruch eines Experiments wird die Ressourcenfreigabe explizit (z. B. über einen try-finally-Block) sichergestellt, statt sich auf automatisches Garbage Collection zu verlassen, das bei GPU-Speicher nicht immer zuverlässig und zeitnah greift.

## Scalability, Reliability, Security und Observability

Trainingsloop-Reproduzierbarkeit skaliert Verlässlichkeit von ML-Experimenten proportional zur Vollständigkeit der Seed-Kontrolle; die Reliability-Grenze liegt in unvollständiger Seed-Kontrolle, die mit wachsender Anzahl an Zufallsquellen im Trainingsprozess proportional mehr nicht reproduzierbare Trainingsergebnisse erzeugen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| zwei Trainingsläufe mit scheinbar identischer Konfiguration liefern unterschiedliche Ergebnisse | eine oder mehrere Zufallsquellen (Datenreihenfolge, Dropout) wurden nicht durch denselben Seed kontrolliert | prüfen, ob alle relevanten Zufallsquellen explizit geseedet wurden, nicht nur die Parameterinitialisierung |
| ein aus einem Checkpoint fortgesetztes Training zeigt unerwartetes Verhalten gegenüber einem durchgehenden Trainingslauf | der Checkpoint hat nicht den vollständigen Zustand (z. B. fehlenden Optimiererzustand) gespeichert | prüfen, ob der Checkpoint alle für eine konsistente Fortsetzung notwendigen Zustandskomponenten enthält |
| nachfolgende Experimente schlagen mit Speicherfehlern fehl, obwohl genug GPU-Speicher verfügbar sein sollte | Ressourcen aus einem vorherigen Experiment wurden nicht zuverlässig freigegeben | prüfen, ob nach dem vorherigen Experiment eine explizite Ressourcenfreigabe stattgefunden hat |

Security: Nicht zuverlässig freigegebene Ressourcen können in gemeinsam genutzten Trainingsumgebungen zu einer Form von Denial-of-Service für andere Nutzer oder nachfolgende Experimente führen, wenn GPU-Speicher dauerhaft belegt bleibt. Observability: Reproduzierbarkeit identischer Konfigurationen über mehrere Läufe, Checkpoint-Speicherzeitpunkte und -größen sowie tatsächlicher Ressourcenverbrauch vor und nach jedem Experiment sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** kontrolliert alle relevanten Zufallsquellen explizit über einen festen Seed für reproduzierbare Experimente. **Principal** macht Checkpoint-Intervalle und deren Abwägung für das Team nachvollziehbar dokumentiert. **Chief** positioniert Reproduzierbarkeit als Grundvoraussetzung für verlässliche Modellentwicklung.

Anti-Patterns: Trainingsläufe ohne vollständige Seed-Kontrolle aller Zufallsquellen durchführen; Checkpoints ohne vollständigen Trainingszustand (nur Modellparameter, ohne Optimiererzustand) speichern; sich auf automatisches Garbage Collection für GPU-Ressourcenfreigabe verlassen, statt diese explizit sicherzustellen.

## Production Checklist

- [ ] Alle relevanten Zufallsquellen sind durch einen festen Seed kontrolliert.
- [ ] Checkpoints speichern den vollständigen Trainingszustand (Parameter, Optimierer, Position).
- [ ] Das Checkpoint-Intervall ist zwischen Speicheraufwand und Fortschrittsverlust abgewogen.
- [ ] Ressourcenfreigabe nach jedem Experiment ist explizit sichergestellt.

## Interviewfragen

### 1. Warum reicht es nicht, nur die Parameterinitialisierung zu seeden, um reproduzierbare Trainingsläufe zu erhalten?

**Antwort:** Ein Trainingsloop enthält weitere Zufallsquellen wie Datenreihenfolge beim Mischen und Dropout-Masken; werden diese nicht ebenfalls geseedet, unterscheiden sich wiederholte Läufe trotz identischer Parameterinitialisierung.

### 2. Warum muss ein Checkpoint mehr als nur die Modellparameter speichern?

**Antwort:** Ohne den Optimiererzustand (z. B. die adaptiven Momente bei Adam) kann eine Fortsetzung des Trainings aus dem Checkpoint zu inkonsistentem Verhalten führen, da der Optimierer seinen internen Zustand neu beginnen müsste.

### 3. Welchen Trade-off löst die Wahl des Checkpoint-Intervalls?

**Antwort:** Ein häufigeres Intervall reduziert den Fortschrittsverlust bei einer Unterbrechung, erhöht aber Speicheraufwand und -zeit; ein selteneres Intervall reduziert diesen Aufwand, erhöht aber das Risiko größeren Fortschrittsverlusts.

### 4. Warum ist zuverlässige Ressourcenfreigabe nach einem Trainingsexperiment wichtig?

**Antwort:** Nicht freigegebener GPU-Speicher aus einem vorherigen Experiment kann nachfolgende Experimente durch unzureichend verfügbaren Speicher beeinträchtigen oder zum Absturz bringen.

### 5. Wie diagnostizierst du ein nicht reproduzierbares Trainingsergebnis trotz scheinbar identischer Konfiguration?

**Antwort:** Ich prüfe systematisch, ob alle relevanten Zufallsquellen (nicht nur die Parameterinitialisierung) explizit mit demselben Seed kontrolliert wurden.

### 6. Widersprüchliche Anforderung: Team will maximale Trainingsgeschwindigkeit ohne den zusätzlichen Aufwand für häufige Checkpoints UND garantiert minimalen Fortschrittsverlust bei unerwarteter Unterbrechung — wie gehst du vor?

**Antwort:** Ich würde erklären, dass diese Ziele sich direkt widersprechen, wenn Checkpoints komplett ausgelassen werden; ich würde vorschlagen, das Checkpoint-Intervall an die tatsächliche Ausfallwahrscheinlichkeit und Trainingsdauer zu koppeln, sodass der Speicheraufwand minimiert wird, ohne bei einer realistisch erwarteten Unterbrechung erheblichen Fortschritt zu riskieren.

## Praktische Labs

~~~python
import torch
import torch.nn as nn

# Fully reproducible training loop with seed control and checkpointing
def set_seed(seed):
    torch.manual_seed(seed)

def train_loop(seed, steps=5, checkpoint_path=None):
    set_seed(seed)
    model = nn.Linear(4, 1)
    optimizer = torch.optim.Adam(model.parameters(), lr=0.1)
    X, y = torch.randn(8, 4), torch.randn(8, 1)

    for step in range(steps):
        optimizer.zero_grad()
        loss = nn.MSELoss()(model(X), y)
        loss.backward()
        optimizer.step()

    if checkpoint_path:
        torch.save({
            "model_state": model.state_dict(),
            "optimizer_state": optimizer.state_dict(),
            "step": steps,
        }, checkpoint_path)

    return list(model.parameters())[0].detach().clone()

run1_params = train_loop(seed=42)
run2_params = train_loop(seed=42)  # same seed -> should be IDENTICAL
run3_params = train_loop(seed=99)  # different seed -> should DIFFER

print(f"Run 1 vs Run 2 (same seed) identical: {torch.allclose(run1_params, run2_params)}")
print(f"Run 1 vs Run 3 (different seed) identical: {torch.allclose(run1_params, run3_params)}")
~~~

## Dependencies, Cross-References und Quellen

1. PyTorch: [Reproducibility Documentation](https://pytorch.org/docs/stable/notes/randomness.html), abgerufen 2026-09-17.
2. PyTorch: [Saving and Loading Models Documentation](https://pytorch.org/tutorials/beginner/saving_loading_models.html), abgerufen 2026-09-17.
3. Weights & Biases: [Best Practices for ML Experiment Reproducibility](https://wandb.ai/site/articles/reproducibility-in-ml), abgerufen 2026-09-17.

Optimierer und Gradienten sind kanonisch in [KB-0336](06-optimierer-und-gradienten.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Experiment-Tracking-Plattformen (z. B. MLflow, Weights & Biases), die Seeds, Checkpoints und Konfigurationen automatisch versioniert protokollieren | Adopting | Gegenüber manueller Protokollierung für zuverlässigere, nachvollziehbare Experimentverwaltung bevorzugen. |
| Automatisierte Ressourcenfreigabe-Wrapper, die GPU-Speicher auch bei unerwarteten Trainingsabbrüchen zuverlässig freigeben | Adopting | Gegenüber manueller Try-Finally-Implementierung für robustere Standardabsicherung bevorzugen. |

Ein Team akzeptiert eine Trainingsloop-Implementierung erst, wenn Reproduzierbarkeit über mehrere identische Läufe verifiziert und Checkpoint-Vollständigkeit getestet ist.
