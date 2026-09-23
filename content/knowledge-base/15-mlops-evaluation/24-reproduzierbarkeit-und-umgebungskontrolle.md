---
{"id": "KB-0374", "title": "Reproduzierbarkeit und Umgebungskontrolle", "domain": "15", "sequence": 24, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0337", "concepts": ["Trainingsloops und Checkpoints"], "needed_for": "understanding"}, {"id": "KB-0359", "concepts": ["Daten-, Modell- und Promptversionen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Trainingslauf mit fixierten Seeds und dokumentierten Dependencies zweimal ausführen und die Ergebnisse mit einer realistischen Toleranz statt exakter Gleichheit vergleichen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Reproduzierbarkeitsstrategie gestalten, die Seeds, Dependencies und Datenstände sichert und Hardware-/Providerabweichungen als dokumentierte, nicht eliminierbare Toleranzquellen behandelt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Bei einem als nicht reproduzierbar gemeldeten Ergebnis unterscheiden, ob eine tatsächliche Reproduzierbarkeitslücke oder eine realistische, tolerierbare Hardware-/Providerabweichung vorliegt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Realistische Toleranzgrenzen für Reproduzierbarkeit als Standard etablieren, statt exakte bitgenaue Gleichheit als unrealistisches Ziel vorauszusetzen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Deterministische GPU-Kernel-Konfigurationen zur Minimierung von Hardwareabweichungen sind Vertiefung.", "rationale": "Kern ist das Verständnis realistischer Toleranzgrenzen, nicht die vollständige Elimination jeder Hardwareabweichung."}}, "lab_validation": [{"lab_id": "KB-0374-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal zweimal ausgeführter Trainingslauf mit identischem Seed und identischen Dependencies", "evidence": "Ein zweimal mit identischem Seed, identischen Dependencies und identischem Datenstand ausgeführter Trainingslauf liefert nahezu, aber nicht exakt identische Ergebnisse aufgrund nicht-deterministischer Hardware-Operationen; die Abweichung liegt innerhalb einer realistisch definierten Toleranz und wird nicht als Reproduzierbarkeitsfehler behandelt.", "limitations": "Kein produktives Trainingssystem, kein realer Geschäftsdatensatz, lokale CPU-Ausführung ohne GPU-spezifische Nichtdeterminismen."}]}
---
# Reproduzierbarkeit und Umgebungskontrolle

> **Ziel:** Reproduzierbarkeit sichert Seeds, Dependencies (exakte Bibliotheksversionen) und Datenstände (siehe [KB-0359](09-daten-modell-und-promptversionen.md)), aufbauend auf den Grundlagen von Trainingsloops und Checkpoints (siehe [KB-0337](../14-ml-engineering/07-trainingsloops-und-checkpoints.md)). Der zentrale Punkt dieses Kapitels ist, Hardware- und Providerabweichungen als reale, nicht vollständig eliminierbare Quellen von Nichtdeterminismus offen zu dokumentieren und Wiederholungsergebnisse anhand realistischer Toleranzen statt exakter bitgenauer Gleichheit zu beurteilen.

## Zweck, Mental Model und Dependencies

Vollständige Reproduzierbarkeit erfordert die Kontrolle mehrerer Faktoren: ein fixierter Seed macht Zufallsprozesse (Gewichtsinitialisierung, Datenreihenfolge) deterministisch; exakt dokumentierte Dependencies (Bibliotheksversionen von z. B. PyTorch, CUDA-Treiberversionen) stellen sicher, dass dieselbe Software-Umgebung verwendet wird; ein fixierter Datenstand (siehe [KB-0359](09-daten-modell-und-promptversionen.md)) stellt sicher, dass dieselben Trainingsdaten verwendet werden. Trotz vollständiger Kontrolle dieser drei Faktoren bleiben jedoch reale Quellen von Nichtdeterminismus bestehen: bestimmte GPU-Operationen sind von Natur aus nicht bitgenau deterministisch (parallele Gleitkomma-Summationen können je nach Ausführungsreihenfolge minimal unterschiedliche Ergebnisse liefern), und unterschiedliche Hardware (verschiedene GPU-Modelle) oder unterschiedliche Provider-Infrastruktur (bei Nutzung externer Recheninfrastruktur) können zu geringfügig unterschiedlichen numerischen Ergebnissen führen, selbst bei identischem Seed, identischen Dependencies und identischen Daten. Der zentrale methodische Fehler ist, exakte bitgenaue Gleichheit zwischen zwei Trainingsläufen als das zu erreichende Ziel zu definieren — dies ist bei GPU-basiertem Training in der Praxis oft unrealistisch. Stattdessen sollte eine realistische Toleranz definiert werden (z. B. eine Abweichung der finalen Genauigkeit innerhalb eines kleinen Prozentbereichs), innerhalb derer zwei Wiederholungen als "erfolgreich reproduziert" gelten, während Hardware- und Providerabweichungen als dokumentierte, akzeptierte Rahmenbedingung offengelegt werden, statt sie zu verschweigen oder fälschlich als Bug zu behandeln.

~~~text
Full reproducibility requires controlling THREE factors:
  1. Seed: fixes random processes (weight init, data order)
  2. Dependencies: exact library versions (PyTorch, CUDA driver) -- same software environment
  3. Data state: fixed dataset version (cf. KB-0359)
EVEN WITH ALL THREE CONTROLLED, real non-determinism remains:
  certain GPU operations are NOT bit-exact deterministic (parallel float summation order varies)
  different hardware (GPU models) or provider infrastructure -> slightly different numerical results
  -> even with identical seed/dependencies/data
CORE ERROR: expecting bit-exact equality as the goal -- often UNREALISTIC in practice for GPU training
FIX: define a REALISTIC TOLERANCE (e.g. final accuracy within a small percentage range)
  -> reproduction "succeeds" within tolerance; hardware/provider variance documented as accepted, not hidden or treated as a bug
~~~

## Core Concepts, Architektur und Implementierung

| Kontrollfaktor | Was er sichert | Verbleibende Unsicherheit trotz Kontrolle |
|---|---|---|
| Seed | Determinismus der Zufallsprozesse | GPU-Operationen können trotzdem nicht-bitgenau sein |
| Dependencies | identische Software-Umgebung | Hardware-Unterschiede bleiben unabhängig von Software-Version bestehen |
| Datenstand | identische Trainingsdaten | Provider-Infrastrukturunterschiede können weiterhin auftreten |
| Realistische Toleranz | akzeptiert verbleibende Abweichung explizit | erfordert eine bewusst definierte, dokumentierte Grenze statt exakter Gleichheit |

Implementierung: Jeder Trainingslauf dokumentiert seinen Seed, seine exakten Dependency-Versionen und seinen referenzierten Datenstand als Teil des Experiment-Trackings (siehe [KB-0357](07-experiment-tracking-als-datenmodell.md)). Bei einem Reproduktionsversuch werden diese drei Faktoren exakt repliziert. Das Ergebnis wird gegen eine vorab definierte, realistische Toleranz verglichen (z. B. Genauigkeitsabweichung innerhalb eines kleinen Prozentbereichs), statt exakte bitgenaue Gleichheit zu erwarten. Werden unterschiedliche Hardware oder Provider für Original- und Reproduktionslauf verwendet, wird dies explizit dokumentiert, um beobachtete Abweichungen korrekt einzuordnen statt sie fälschlich als Implementierungsfehler zu interpretieren.

## Scalability, Reliability, Security und Observability

Reproduzierbarkeitskontrolle skaliert Vertrauen in Trainingsergebnisse proportional zur Vollständigkeit der dokumentierten Kontrollfaktoren; die Reliability-Grenze liegt darin, dass unrealistische Erwartungen an bitgenaue Gleichheit proportional zur tatsächlichen Hardware-Heterogenität zu häufigen, aber unbegründeten "Reproduzierbarkeitsfehler"-Meldungen führen können.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein wiederholter Trainingslauf mit identischem Seed liefert ein geringfügig anderes Ergebnis | eine nicht-deterministische GPU-Operation oder eine Hardwareabweichung verursacht eine innerhalb der Toleranz liegende Differenz | die Abweichung gegen die definierte realistische Toleranz prüfen, statt sie automatisch als Fehler zu behandeln |
| zwei Teammitglieder erzielen mit denselben dokumentierten Seed/Dependencies/Daten deutlich unterschiedliche Ergebnisse, weit außerhalb der Toleranz | eine tatsächliche Reproduzierbarkeitslücke liegt vor (z. B. eine undokumentierte Dependency-Abweichung oder ein nicht erfasster Zufallsprozess) | die tatsächlich verwendeten Dependency-Versionen und Umgebungsdetails beider Läufe im Detail vergleichen |
| ein auf einem Provider trainiertes Modell zeigt bei Reproduktion auf einer anderen Hardware ein spürbar anderes Ergebnis | Hardware-/Providerunterschiede wurden nicht als Einflussfaktor dokumentiert und erklären die Abweichung | die verwendete Hardware/Provider-Infrastruktur beider Läufe dokumentieren und die Abweichung im Licht dieser Differenz neu bewerten |

Security: Unklare Reproduzierbarkeitsgrenzen können zu falschen Annahmen über die Verlässlichkeit eines Modells führen, wenn scheinbar unterschiedliche Ergebnisse fälschlich als reale Modellinstabilität statt als akzeptierte Hardwarevarianz interpretiert werden. Observability: Die gemessene Abweichung zwischen Original- und Reproduktionslauf im Verhältnis zur definierten Toleranz, sowie die Vollständigkeit der dokumentierten Umgebungsfaktoren (Seed, Dependencies, Datenstand, Hardware) sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert vollständige Dokumentation von Seed, Dependencies und Datenstand für jeden Trainingslauf. **Principal** macht definierte Toleranzgrenzen und beobachtete Hardware-/Providerabweichungen für das Team nachvollziehbar. **Chief** etabliert realistische Toleranzgrenzen für Reproduzierbarkeit als Standard, statt exakte bitgenaue Gleichheit als unrealistisches Ziel vorauszusetzen.

Anti-Patterns: exakte bitgenaue Gleichheit zwischen Trainingsläufen als unrealistisches Reproduzierbarkeitsziel erwarten; Hardware- oder Providerabweichungen bei einem Reproduktionsversuch nicht dokumentieren; jede beobachtete Abweichung automatisch als Implementierungsfehler statt möglicherweise als akzeptierte Varianz behandeln.

## Production Checklist

- [ ] Seed, Dependency-Versionen und Datenstand sind für jeden Trainingslauf vollständig dokumentiert.
- [ ] Eine realistische Toleranzgrenze für Reproduzierbarkeit ist explizit definiert.
- [ ] Verwendete Hardware und Provider-Infrastruktur sind bei jedem Reproduktionsversuch dokumentiert.
- [ ] Abweichungen werden gegen die definierte Toleranz geprüft, bevor sie als Fehler behandelt werden.

## Interviewfragen

### 1. Welche drei Faktoren müssen für Reproduzierbarkeit kontrolliert werden?

**Antwort:** Der Seed für Zufallsprozesse, exakt dokumentierte Dependency-Versionen, und ein fixierter Datenstand.

### 2. Warum bleibt trotz vollständiger Kontrolle dieser drei Faktoren eine Restunsicherheit bestehen?

**Antwort:** Bestimmte GPU-Operationen sind nicht bitgenau deterministisch, und unterschiedliche Hardware oder Provider-Infrastruktur können zu geringfügig unterschiedlichen numerischen Ergebnissen führen.

### 3. Warum ist exakte bitgenaue Gleichheit oft ein unrealistisches Reproduzierbarkeitsziel?

**Antwort:** Bei GPU-basiertem Training führen nicht-deterministische Operationen und Hardwareunterschiede in der Praxis zu geringfügigen Abweichungen, die auch bei identischen Seeds, Dependencies und Daten nicht vollständig vermeidbar sind.

### 4. Wie definierst du eine realistische Toleranz für Reproduzierbarkeit?

**Antwort:** Als akzeptierten Abweichungsbereich (z. B. Genauigkeit innerhalb eines kleinen Prozentbereichs), innerhalb dessen zwei Wiederholungen als erfolgreich reproduziert gelten, statt exakte Gleichheit zu fordern.

### 5. Wie gehst du vor, wenn zwei Teammitglieder mit denselben dokumentierten Bedingungen deutlich unterschiedliche, außerhalb der Toleranz liegende Ergebnisse erzielen?

**Antwort:** Ich vergleiche die tatsächlich verwendeten Dependency-Versionen und Umgebungsdetails beider Läufe im Detail, um eine mögliche undokumentierte Abweichung als tatsächliche Reproduzierbarkeitslücke zu identifizieren.

### 6. Widersprüchliche Anforderung: Team will strikt reproduzierbare Trainingsergebnisse UND flexible Nutzung unterschiedlicher, kostengünstiger Hardware/Provider — wie gehst du vor?

**Antwort:** Ich würde eine realistische Toleranzgrenze definieren, die geringfügige, durch Hardware-/Providerunterschiede verursachte Abweichungen explizit akzeptiert, während Seed, Dependencies und Datenstand strikt kontrolliert und dokumentiert werden, sodass Flexibilität bei der Hardware-Wahl möglich bleibt, ohne die grundsätzliche Nachvollziehbarkeit der Ergebnisse zu verlieren.

## Praktische Labs

~~~python
import torch
import torch.nn as nn

def run_training(seed):
    torch.manual_seed(seed)
    X = torch.randn(40, 3)
    y = (X[:, 0] > 0).long()
    model = nn.Sequential(nn.Linear(3, 8), nn.ReLU(), nn.Linear(8, 2))
    optimizer = torch.optim.Adam(model.parameters(), lr=0.05)
    for _ in range(50):
        optimizer.zero_grad()
        loss = nn.CrossEntropyLoss()(model(X), y)
        loss.backward()
        optimizer.step()
    accuracy = (model(X).argmax(dim=1) == y).float().mean().item()
    return accuracy

# Same documented seed, dependencies (implicit: same torch version in this environment), same data generation logic
run1_accuracy = run_training(seed=42)
run2_accuracy = run_training(seed=42)

TOLERANCE = 0.02  # realistic tolerance, not bit-exact equality

deviation = abs(run1_accuracy - run2_accuracy)
print(f"Run 1 accuracy: {run1_accuracy:.4f}")
print(f"Run 2 accuracy: {run2_accuracy:.4f}")
print(f"Deviation: {deviation:.4f} (tolerance: {TOLERANCE})")
print(f"Reproduction {'SUCCEEDS within realistic tolerance' if deviation <= TOLERANCE else 'FAILS -- exceeds tolerance, investigate further'}")
~~~

## Dependencies, Cross-References und Quellen

1. Pineau et al.: [Improving Reproducibility in Machine Learning Research](https://arxiv.org/abs/2003.12206), abgerufen 2026-09-17.
2. PyTorch-Dokumentation: [Reproducibility](https://pytorch.org/docs/stable/notes/randomness.html), abgerufen 2026-09-17.

Trainingsloops und Checkpoints sind kanonisch in [KB-0337](../14-ml-engineering/07-trainingsloops-und-checkpoints.md) behandelt; Daten-, Modell- und Promptversionen in [KB-0359](09-daten-modell-und-promptversionen.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Deterministische GPU-Kernel-Modi (z. B. torch.use_deterministic_algorithms), die Nichtdeterminismus auf Kosten der Geschwindigkeit reduzieren | Evaluating | Gegenüber Standard-GPU-Operationen abwägen, wenn strikte Reproduzierbarkeit die Priorität gegenüber Trainingsgeschwindigkeit hat. |
| Standardisierte Umgebungs-Snapshot-Werkzeuge (Container-Images mit exakt fixierten Dependency-Versionen) | Adopting | Gegenüber manuell dokumentierten Dependency-Listen für zuverlässigere, automatisch reproduzierbare Umgebungen bevorzugen. |

Ein Team akzeptiert ein Reproduktionsergebnis erst, wenn die Abweichung innerhalb der vorab definierten, realistischen Toleranz liegt und alle relevanten Umgebungsfaktoren dokumentiert sind.
