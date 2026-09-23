---
{"id": "KB-0355", "title": "Ray Tune und verteilte Experimente", "domain": "15", "sequence": 5, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0354", "concepts": ["Optuna und adaptive Suche"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Mehrere Trials parallel über verfügbare Ressourcen verteilen und einen unterbrochenen Suchlauf aus einem Checkpoint wieder aufnehmen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein Trial-Scheduling gestalten, das verfügbare Rechenressourcen (CPU/GPU) effizient auf parallele Trials verteilt und Checkpoints für Wiederaufnahme nach Unterbrechung vorsieht.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Wirtschaftlich beurteilen, ob eine verteilte Suche über mehrere Maschinen gegenüber einfachem lokalem Tuning für einen gegebenen Suchraum und ein gegebenes Budget gerechtfertigt ist.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Eine klare Entscheidungsregel etablieren, ab welcher Suchraumgröße oder welchem Rechenbedarf verteilte statt lokaler Hyperparameter-Suche wirtschaftlich sinnvoll ist.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Der Betrieb eines produktiven, mehrknotigen Ray-Clusters im großen Maßstab ist Vertiefung.", "rationale": "Kern ist das Verständnis von Trial-Scheduling, Ressourcenkoordination und Checkpoint-Wiederaufnahme, nicht der Betrieb einer spezifischen Cluster-Infrastruktur."}}, "lab_validation": [{"lab_id": "KB-0355-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simulierte Ray-Tune-Suche mit mehreren parallelen Trials und einem simulierten Checkpoint-Wiederaufnahme-Szenario", "evidence": "Eine Suche mit mehreren gleichzeitig laufenden Trials nutzt verfügbare lokale Rechenressourcen parallel aus, wodurch die Gesamtsuchzeit gegenüber sequenzieller Ausführung derselben Trials reduziert wird; ein simuliert unterbrochener Trial wird aus seinem letzten Checkpoint erfolgreich fortgesetzt, statt von vorn zu beginnen.", "limitations": "Kein produktiver Mehrknoten-Cluster, kein realer Geschäftsdatensatz, lokale Simulation der Parallelität."}]}
---
# Ray Tune und verteilte Experimente

> **Ziel:** Ray Tune koordiniert Hyperparameter-Suchen über mehrere Ressourcen (CPU/GPU, potenziell über mehrere Maschinen) hinweg durch Trial-Scheduling (Zuteilung von Trials zu verfügbaren Ressourcen), Ressourcenverwaltung und Checkpoints (gespeicherte Zwischenzustände, die eine Wiederaufnahme nach Unterbrechung ermöglichen), aufbauend auf den adaptiven Suchkonzepten aus [KB-0354](04-optuna-und-adaptive-suche.md). Der zentrale Punkt ist die wirtschaftliche Beurteilung: verteilte, parallele Suche lohnt sich nur, wenn der Koordinationsaufwand und die zusätzliche Infrastruktur durch eine entsprechend große Zeitersparnis gegenüber einfachem lokalem, sequenziellem Tuning aufgewogen werden.

## Zweck, Mental Model und Dependencies

Trial-Scheduling entscheidet, wie viele Trials gleichzeitig laufen und welche Ressourcen (z. B. ein bestimmter Anteil an CPU-Kernen oder eine GPU) jedem Trial zugewiesen werden — bei ausreichend verfügbaren Ressourcen können mehrere Trials parallel statt sequenziell ausgeführt werden, was die Gesamtsuchzeit deutlich verkürzt. Ein Checkpoint speichert den Zwischenzustand eines Trials (z. B. Modellgewichte nach einer bestimmten Anzahl an Trainingsschritten), sodass ein durch Unterbrechung (Hardwareausfall, vorzeitiges Stoppen zur Ressourcenumverteilung) abgebrochener Trial nicht von vorn beginnen muss, sondern an seinem letzten gespeicherten Zustand fortgesetzt werden kann. Der zentrale wirtschaftliche Abwägungspunkt ist, dass verteilte Suche einen realen Koordinationsaufwand mit sich bringt (Cluster-Infrastruktur, Netzwerkkommunikation zwischen Knoten, Ressourcenverwaltung), der sich nur lohnt, wenn der Suchraum groß genug oder das verfügbare Zeitbudget knapp genug ist, dass die durch Parallelisierung gewonnene Zeitersparnis diesen Aufwand übersteigt — bei kleinen Suchräumen oder ausreichend Zeit ist einfaches lokales, sequenzielles Tuning (wie in [KB-0354](04-optuna-und-adaptive-suche.md) beschrieben) oft die pragmatischere Wahl.

~~~text
Trial scheduling: how many trials run CONCURRENTLY + which resources (CPU/GPU share) each gets
  -> sufficient resources available -> parallel execution -> shorter total search time
Checkpoint: saved intermediate state (e.g. model weights at step N)
  -> interrupted trial (hardware failure, resource reallocation) resumes from last checkpoint, NOT from scratch
ECONOMIC TRADE-OFF: distributed search = real coordination overhead (cluster infra, network, resource management)
  -> worth it ONLY when search space is large enough / time budget tight enough that parallelization savings > overhead
  -> otherwise: simple local sequential tuning (KB-0354) is the more pragmatic choice
~~~

## Core Concepts, Architektur und Implementierung

| Element | Funktion | Wirtschaftliche Relevanz |
|---|---|---|
| Trial-Scheduling | verteilt Trials auf verfügbare Ressourcen, ermöglicht Parallelität | reduziert Gesamtsuchzeit proportional zur genutzten Parallelität |
| Ressourcenzuteilung | legt fest, wie viel CPU/GPU jeder Trial erhält | bestimmt, wie viele Trials gleichzeitig ohne Ressourcenkonflikt laufen können |
| Checkpoints | speichern Zwischenzustände für Wiederaufnahme | verhindert Verlust bereits investierter Rechenzeit bei Unterbrechung |

Implementierung: Vor dem Einsatz verteilter Suche wird geschätzt, wie lange eine sequenzielle, lokale Suche über den definierten Suchraum benötigen würde, und dies gegen den Koordinationsaufwand und die Kosten zusätzlicher Rechenressourcen abgewogen. Bei ausreichend großem Suchraum wird Trial-Scheduling so konfiguriert, dass verfügbare Ressourcen (lokal oder über einen Cluster) parallel genutzt werden, wobei jedem Trial ein angemessener Ressourcenanteil zugewiesen wird. Lang laufende Trials speichern regelmäßig Checkpoints, sodass eine Unterbrechung nicht zum vollständigen Verlust der bis dahin investierten Rechenzeit führt.

## Scalability, Reliability, Security und Observability

Verteilte Suche skaliert die Gesamtsuchzeit umgekehrt proportional zur Anzahl parallel nutzbarer Ressourcen; die Reliability-Grenze liegt darin, dass ohne Checkpoints eine Unterbrechung eines lang laufenden Trials die gesamte bis dahin investierte Rechenzeit verloren gehen lässt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine verteilte Suche über einen kleinen Suchraum dauert nicht wesentlich kürzer als eine lokale sequenzielle Suche | der Koordinationsaufwand der verteilten Infrastruktur übersteigt den Parallelisierungsgewinn bei diesem kleinen Suchraum | den Suchraum und das Zeitbudget neu bewerten und für kleine Suchräume auf lokales, sequenzielles Tuning umstellen |
| ein durch Hardwareausfall unterbrochener Trial muss komplett neu gestartet werden | keine Checkpoints wurden während des Trials gespeichert | Checkpoint-Speicherung in regelmäßigen Abständen für lang laufende Trials konfigurieren |
| mehrere parallele Trials konkurrieren um dieselben Ressourcen und verlangsamen sich gegenseitig | die Ressourcenzuteilung pro Trial wurde nicht an die tatsächlich verfügbare Gesamtkapazität angepasst | die Anzahl gleichzeitig laufender Trials reduzieren oder den Ressourcenanteil pro Trial anpassen |

Security: Ein verteilter Cluster für Hyperparameter-Suche erfordert dieselben Netzwerk- und Zugriffskontrollen wie andere verteilte Recheninfrastrukturen, insbesondere wenn sensible Trainingsdaten über mehrere Knoten verteilt verarbeitet werden. Observability: Anzahl parallel laufender Trials, Ressourcenauslastung pro Knoten, Häufigkeit von Checkpoint-Wiederaufnahmen nach Unterbrechung und die tatsächlich erzielte Zeitersparnis gegenüber sequenzieller Ausführung sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Checkpoints für alle lang laufenden Trials, unabhängig davon, ob verteilt oder lokal gesucht wird. **Principal** macht die wirtschaftliche Abwägung zwischen verteilter und lokaler Suche für das Team nachvollziehbar. **Chief** etabliert eine klare Entscheidungsregel, ab welcher Suchraumgröße oder welchem Rechenbedarf verteilte Suche wirtschaftlich gerechtfertigt ist.

Anti-Patterns: verteilte Suchinfrastruktur für kleine Suchräume einsetzen, bei denen der Koordinationsaufwand den Nutzen übersteigt; lang laufende Trials ohne Checkpoints ausführen; die tatsächlich genutzte Parallelität nicht überwachen, sodass Ressourcenkonflikte unentdeckt bleiben.

## Production Checklist

- [ ] Vor dem Einsatz verteilter Suche ist die wirtschaftliche Abwägung gegenüber lokalem Tuning dokumentiert.
- [ ] Lang laufende Trials speichern regelmäßig Checkpoints.
- [ ] Die Ressourcenzuteilung pro Trial ist an die tatsächlich verfügbare Gesamtkapazität angepasst.
- [ ] Die tatsächlich erzielte Zeitersparnis durch Parallelisierung wird nach Abschluss der Suche überprüft.

## Interviewfragen

### 1. Was ist der Unterschied zwischen Trial-Scheduling und Ressourcenzuteilung in Ray Tune?

**Antwort:** Trial-Scheduling entscheidet, wie viele Trials gleichzeitig laufen; Ressourcenzuteilung legt fest, wie viel CPU/GPU jeder einzelne Trial dabei erhält.

### 2. Welchen Zweck erfüllt ein Checkpoint bei verteilten Experimenten?

**Antwort:** Er speichert den Zwischenzustand eines Trials, sodass eine Unterbrechung (z. B. durch Hardwareausfall) nicht zum vollständigen Verlust der bis dahin investierten Rechenzeit führt, da der Trial an seinem letzten Checkpoint fortgesetzt werden kann.

### 3. Wann lohnt sich verteilte Suche wirtschaftlich gegenüber lokalem, sequenziellem Tuning?

**Antwort:** Wenn der Suchraum groß genug oder das verfügbare Zeitbudget knapp genug ist, dass die durch Parallelisierung gewonnene Zeitersparnis den Koordinationsaufwand der verteilten Infrastruktur übersteigt.

### 4. Was passiert, wenn zu viele Trials gleichzeitig um dieselben Ressourcen konkurrieren?

**Antwort:** Die Trials verlangsamen sich gegenseitig, da die verfügbaren Ressourcen nicht ausreichen, um jedem Trial den zugewiesenen Anteil tatsächlich bereitzustellen.

### 5. Wie gehst du vor, wenn eine verteilte Suche über einen kleinen Suchraum kaum schneller ist als eine lokale sequenzielle Suche?

**Antwort:** Ich bewerte den Suchraum und das Zeitbudget neu und stelle bei kleinen Suchräumen auf lokales, sequenzielles Tuning um, da der Koordinationsaufwand der verteilten Infrastruktur in diesem Fall den Nutzen übersteigt.

### 6. Widersprüchliche Anforderung: Team will maximale Suchgeschwindigkeit durch verteilte Infrastruktur UND minimalen Infrastruktur-/Kostenaufwand — wie gehst du vor?

**Antwort:** Ich würde zunächst die geschätzte Dauer einer lokalen sequenziellen Suche gegen die Kosten und den Koordinationsaufwand einer verteilten Infrastruktur abwägen und verteilte Suche nur dann empfehlen, wenn die Zeitersparnis diesen Aufwand nachweislich übersteigt, statt verteilte Infrastruktur standardmäßig einzusetzen.

## Praktische Labs

~~~python
# Konzeptioneller Ablauf typischer Ray-Tune-Konfiguration (nicht in dieser Umgebung ausgeführt):
from ray import tune

def trainable(config, checkpoint_dir=None):
    start_step = 0
    if checkpoint_dir:
        start_step = load_checkpoint_step(checkpoint_dir)  # resume instead of restarting from scratch

    for step in range(start_step, 100):
        val_loss = simulate_training_step(config["lr"], step)
        if step % 10 == 0:
            save_checkpoint(step)  # periodic checkpoint for interruption resilience
        tune.report(val_loss=val_loss)

analysis = tune.run(
    trainable,
    config={"lr": tune.loguniform(1e-4, 1e-1)},
    num_samples=8,            # number of trials
    resources_per_trial={"cpu": 1},  # explicit resource allocation per trial -> enables parallelism
    scheduler=tune.schedulers.ASHAScheduler(metric="val_loss", mode="min"),
)

print(f"Best config found via parallel search: {analysis.best_config}")
~~~

## Dependencies, Cross-References und Quellen

1. Ray-Dokumentation: [Ray Tune — Key Concepts](https://docs.ray.io/en/latest/tune/key-concepts.html), abgerufen 2026-09-17.
2. Liaw et al.: [Tune — A Research Platform for Distributed Model Selection and Training](https://arxiv.org/abs/1807.05118), abgerufen 2026-09-17.

Optuna und adaptive Suche sind kanonisch in [KB-0354](04-optuna-und-adaptive-suche.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Serverlose, elastisch skalierende Cluster-Backends für Ray, die Ressourcen automatisch je nach Suchbedarf zuteilen | Evaluating | Gegenüber statisch dimensionierten Clustern abwägen, sobald Kostenmodell und Startlatenz des serverlosen Backends für den Anwendungsfall geeignet sind. |
| Integrierte Multi-Fidelity-Scheduler (z. B. ASHA), die frühe Trial-Ergebnisse mit reduziertem Ressourceneinsatz vorab bewerten | Adopting | Gegenüber gleichmäßiger Ressourcenzuteilung an alle Trials für effizientere Nutzung des Suchbudgets bevorzugen. |

Ein Team akzeptiert den Einsatz verteilter Suchinfrastruktur erst, wenn eine dokumentierte wirtschaftliche Abwägung gegenüber lokalem Tuning den Mehrwert belegt.
