---
{"id": "KB-0357", "title": "Experiment Tracking als Datenmodell", "domain": "15", "sequence": 7, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0349", "concepts": ["Experimentdesign für ML"], "needed_for": "understanding"}, {"id": "KB-0356", "concepts": ["Model Registries und Freigabestatus"], "needed_for": "understanding"}], "related": ["KB-0351", "KB-0352"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Parameter, Metriken und Artefakte mehrerer Experimente in einer werkzeugunabhängigen, strukturierten Form (z. B. Tabelle) erfassen und auf fehlende Werte prüfen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein Experiment-Tracking-Datenmodell gestalten, das Vergleichbarkeit zwischen Experimenten unabhängig vom eingesetzten Trackingwerkzeug (MLflow, W&B, o.ä.) sicherstellt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn fehlende oder inkonsistent erfasste Experimentdaten einen Vergleich zwischen Experimenten unzuverlässig machen, unabhängig vom verwendeten Tool.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Ein werkzeugunabhängiges Mindestdatenmodell für Experiment-Tracking als Unternehmensstandard etablieren, das Vergleichbarkeit auch bei einem späteren Werkzeugwechsel erhält.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Migration großer historischer Experimentbestände zwischen unterschiedlichen Tracking-Werkzeugen ist Vertiefung.", "rationale": "Kern ist das Verständnis des zugrunde liegenden Datenmodells, nicht die konkrete Migrationstechnik zwischen spezifischen Werkzeugen."}}, "lab_validation": [{"lab_id": "KB-0357-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokale, werkzeugunabhängige tabellarische Erfassung mehrerer simulierter Experimente mit absichtlich fehlenden Werten", "evidence": "Eine werkzeugunabhängige tabellarische Struktur mit Parametern, Metriken und Artefaktreferenzen macht fehlende oder inkonsistent erfasste Werte über mehrere Experimente hinweg sofort sichtbar, wodurch unzuverlässige Vergleiche erkannt werden, bevor eine Entscheidung auf ihrer Grundlage getroffen wird.", "limitations": "Kein produktives Tracking-Tool, kein realer Geschäftsdatensatz, kleine simulierte Experimentanzahl."}]}
---
# Experiment Tracking als Datenmodell

> **Ziel:** Unabhängig davon, ob MLflow (siehe [KB-0351](01-mlflow-und-modelllebenszyklen.md)), Weights & Biases (siehe [KB-0352](02-weights-and-biases.md)) oder ein anderes Werkzeug verwendet wird, folgt Experiment Tracking einem gemeinsamen zugrunde liegenden Datenmodell: strukturiert erfasste Parameter, Metriken und Artefakte pro Experiment, aufbauend auf den Grundlagen des Experimentdesigns (siehe [KB-0349](../14-ml-engineering/19-experimentdesign-fuer-ml.md)). Der zentrale Punkt dieses Kapitels ist, Vergleichbarkeit und Vollständigkeit dieser Daten werkzeugunabhängig zu prüfen, da fehlende oder inkonsistent erfasste Versuchsdaten die Vergleichbarkeit unabhängig vom eingesetzten Trackingwerkzeug untergraben.

## Zweck, Mental Model und Dependencies

Das zugrunde liegende Datenmodell von Experiment Tracking lässt sich unabhängig vom konkreten Werkzeug als eine Tabelle vorstellen: jede Zeile ist ein Experiment (Run), jede Spalte ist entweder ein Parameter (Eingabe, z. B. Lernrate), eine Metrik (Ausgabe, z. B. Validierungsgenauigkeit) oder ein Artefaktverweis (z. B. Pfad zum gespeicherten Modell). Diese Sichtweise macht ein zentrales Qualitätsproblem sichtbar, das unabhängig vom Werkzeug auftreten kann: fehlende Werte. Fehlt für ein Experiment ein bestimmter Parameter (weil er bei diesem Lauf nicht protokolliert wurde) oder eine Metrik (weil die Messung fehlschlug oder vergessen wurde), wird ein Vergleich zwischen diesem und anderen Experimenten unzuverlässig oder sogar irreführend — ein Experiment mit einer fehlenden, tatsächlich schlechten Metrik könnte fälschlich als nicht bewertbar statt als schlecht erscheinen, oder gänzlich aus einem automatisierten Vergleich herausfallen. Diese Prüfung auf Vollständigkeit und Konsistenz ist eine Datenqualitätsfrage, die unabhängig davon gilt, ob die zugrunde liegende Speicherung über MLflow, W&B oder eine eigene Tabelle erfolgt.

~~~text
Underlying data model (tool-independent): one row = one experiment (run)
  columns = parameters (inputs, e.g. learning rate) + metrics (outputs, e.g. val accuracy) + artifact references
CORE QUALITY ISSUE (tool-independent): MISSING VALUES
  missing parameter -> not logged for that run
  missing metric -> measurement failed OR was forgotten
  -> comparison across experiments becomes UNRELIABLE or MISLEADING
  -> an experiment with a missing (actually bad) metric can wrongly appear "unrated" instead of "bad", or drop out of automated comparison entirely
THIS CHECK APPLIES REGARDLESS of underlying tool (MLflow, W&B, custom table)
~~~

## Core Concepts, Architektur und Implementierung

| Datenmodell-Element | Rolle | Risiko bei Lücken |
|---|---|---|
| Parameter (Spalte) | erfasst eine Eingabegröße eines Experiments | ein fehlender Parameter macht ein Experiment für Gruppierung/Filterung nach diesem Parameter unbrauchbar |
| Metrik (Spalte) | erfasst eine Ausgabegröße eines Experiments | eine fehlende Metrik verzerrt Rangfolgen und automatisierte Bestenauswahl |
| Artefaktverweis (Spalte) | verweist auf gespeicherte Ausgaben (z. B. Modell) | ein fehlender Verweis macht ein Experiment nicht reproduzierbar, selbst wenn Metriken vorliegen |

Implementierung: Unabhängig vom eingesetzten Trackingwerkzeug wird vor jedem Vergleich mehrerer Experimente eine explizite Vollständigkeitsprüfung durchgeführt: für jedes einbezogene Experiment wird geprüft, ob alle für den Vergleich relevanten Parameter, Metriken und Artefaktverweise tatsächlich vorhanden sind. Experimente mit fehlenden, für den Vergleich relevanten Werten werden entweder explizit aus dem Vergleich ausgeschlossen und dies dokumentiert, oder die fehlenden Werte werden nachträglich vervollständigt, statt sie stillschweigend als "nicht schlechter als Durchschnitt" zu behandeln.

## Scalability, Reliability, Security und Observability

Ein werkzeugunabhängiges Verständnis des Tracking-Datenmodells skaliert die Übertragbarkeit von Qualitätsprüfungen über verschiedene Tools und einen möglichen späteren Werkzeugwechsel hinweg; die Reliability-Grenze liegt darin, dass unentdeckte fehlende Werte proportional zur Anzahl verglichener Experimente das Risiko einer fehlerhaften automatisierten Bestenauswahl erhöhen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine automatisierte Bestenauswahl über mehrere Experimente wählt ein Experiment mit unvollständigen Daten als "beste" Konfiguration | fehlende Metrikwerte wurden nicht explizit geprüft und führten zu einer verzerrten Rangfolge | eine explizite Vollständigkeitsprüfung über alle einbezogenen Experimente vor der automatisierten Auswahl durchführen |
| ein Vergleich zwischen Experimenten aus unterschiedlichen Tracking-Werkzeugen liefert widersprüchliche Ergebnisse | die zugrunde liegenden Datenmodelle wurden nicht auf ein gemeinsames Schema (Parameter/Metriken/Artefakte) normalisiert | die Daten beider Werkzeuge auf ein gemeinsames, werkzeugunabhängiges Schema abbilden, bevor sie verglichen werden |
| ein als reproduzierbar dokumentiertes Experiment lässt sich nicht tatsächlich reproduzieren | der Artefaktverweis fehlt oder verweist auf ein nicht mehr verfügbares Artefakt | die Vollständigkeit und Gültigkeit der Artefaktverweise für das betroffene Experiment prüfen |

Security: Keine über allgemeine Datenqualitätsrisiken hinausgehende Sicherheitsdimension; relevant bleibt jedoch, dass unvollständige Metadaten die Nachvollziehbarkeit bei sicherheitsrelevanten Modellentscheidungen (siehe [KB-0356](06-model-registries-und-freigabestatus.md)) beeinträchtigen können. Observability: Der Anteil vollständig erfasster Experimente (ohne fehlende, für den Vergleich relevante Werte) gegenüber der Gesamtzahl der Experimente ist eine zentrale Datenqualitätsmetrik.

## Trade-offs und Entscheidungen

**Staff** implementiert eine explizite Vollständigkeitsprüfung vor jedem automatisierten Experimentvergleich. **Principal** macht erkannte Datenlücken für das Team nachvollziehbar sichtbar. **Chief** etabliert ein werkzeugunabhängiges Mindestdatenmodell für Experiment Tracking als Unternehmensstandard, das Vergleichbarkeit auch bei einem späteren Werkzeugwechsel erhält.

Anti-Patterns: Experimente mit fehlenden Metrikwerten stillschweigend aus einem Vergleich ausschließen, ohne dies zu dokumentieren; ein automatisiertes Bestenauswahlkriterium ohne vorherige Vollständigkeitsprüfung anwenden; sich bei Werkzeugwechsel auf eine unvollständige, tool-spezifische Datenmigration verlassen, ohne das zugrunde liegende Datenmodell explizit zu prüfen.

## Production Checklist

- [ ] Eine explizite Vollständigkeitsprüfung erfolgt vor jedem Vergleich mehrerer Experimente.
- [ ] Experimente mit fehlenden, relevanten Werten werden dokumentiert ausgeschlossen oder vervollständigt.
- [ ] Ein gemeinsames, werkzeugunabhängiges Schema (Parameter/Metriken/Artefakte) liegt jedem Vergleich zugrunde.
- [ ] Artefaktverweise werden auf tatsächliche Verfügbarkeit geprüft, nicht nur auf formale Existenz des Verweises.

## Interviewfragen

### 1. Wie sieht das zugrunde liegende Datenmodell von Experiment Tracking unabhängig vom konkreten Werkzeug aus?

**Antwort:** Eine Tabelle, in der jede Zeile ein Experiment ist und jede Spalte entweder einen Parameter, eine Metrik oder einen Artefaktverweis darstellt.

### 2. Warum sind fehlende Werte in Experimentdaten ein besonders tückisches Problem?

**Antwort:** Ein Experiment mit einer fehlenden, tatsächlich schlechten Metrik kann fälschlich als nicht bewertbar statt als schlecht erscheinen oder unbemerkt aus einem automatisierten Vergleich herausfallen, was die Vergleichbarkeit verzerrt.

### 3. Warum ist diese Vollständigkeitsprüfung unabhängig vom verwendeten Trackingwerkzeug relevant?

**Antwort:** Das zugrunde liegende Datenmodell (Parameter, Metriken, Artefakte pro Experiment) ist bei MLflow, W&B oder einer eigenen Tabelle strukturell dasselbe, weshalb dieselbe Qualitätsprüfung unabhängig vom Werkzeug notwendig ist.

### 4. Wie gehst du vor, wenn eine automatisierte Bestenauswahl ein Experiment mit unvollständigen Daten als beste Konfiguration wählt?

**Antwort:** Ich führe eine explizite Vollständigkeitsprüfung über alle einbezogenen Experimente durch und schließe Experimente mit fehlenden, relevanten Werten dokumentiert aus dem Vergleich aus, bevor die automatisierte Auswahl erneut ausgeführt wird.

### 5. Was prüfst du, wenn ein als reproduzierbar dokumentiertes Experiment sich nicht tatsächlich reproduzieren lässt?

**Antwort:** Ich prüfe zuerst, ob der Artefaktverweis für dieses Experiment vollständig und gültig ist, oder ob er fehlt bzw. auf ein nicht mehr verfügbares Artefakt verweist.

### 6. Widersprüchliche Anforderung: Team will schnelle, automatisierte Experimentvergleiche UND garantiert zuverlässige, lückenfreie Vergleichsgrundlage — wie gehst du vor?

**Antwort:** Ich würde eine automatisierte Vollständigkeitsprüfung als festen ersten Schritt vor jedem automatisierten Vergleich etablieren, die Experimente mit fehlenden relevanten Werten automatisch markiert und ausschließt, sodass die Automatisierung schnell bleibt, aber nur auf einer geprüften, lückenfreien Datengrundlage operiert.

## Praktische Labs

~~~python
experiments = [
    {"run_id": "r1", "lr": 0.01, "accuracy": 0.85, "artifact_path": "models/r1.pt"},
    {"run_id": "r2", "lr": 0.1, "accuracy": None, "artifact_path": "models/r2.pt"},  # missing metric
    {"run_id": "r3", "lr": None, "accuracy": 0.90, "artifact_path": "models/r3.pt"},  # missing param
    {"run_id": "r4", "lr": 0.05, "accuracy": 0.88, "artifact_path": None},           # missing artifact
]

required_fields = ["lr", "accuracy", "artifact_path"]

complete = [e for e in experiments if all(e[f] is not None for f in required_fields)]
incomplete = [e for e in experiments if e not in complete]

print(f"Complete experiments (safe to compare): {[e['run_id'] for e in complete]}")
print(f"Incomplete experiments (EXCLUDED from automated comparison, flagged for review):")
for e in incomplete:
    missing = [f for f in required_fields if e[f] is None]
    print(f"  {e['run_id']}: missing {missing}")

if complete:
    best = max(complete, key=lambda e: e["accuracy"])
    print(f"\nBest configuration (from COMPLETE data only): {best['run_id']} (accuracy={best['accuracy']})")
else:
    print("\nNo complete experiments available for a reliable comparison.")
~~~

## Dependencies, Cross-References und Quellen

1. Zaharia et al.: [Accelerating the Machine Learning Lifecycle with MLflow](https://cs.stanford.edu/~matei/papers/2018/ieee_mlflow.pdf), abgerufen 2026-09-17.
2. Sculley et al.: [Hidden Technical Debt in Machine Learning Systems](https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html), abgerufen 2026-09-17.

Experimentdesign für ML ist kanonisch in [KB-0349](../14-ml-engineering/19-experimentdesign-fuer-ml.md) behandelt; Model Registries und Freigabestatus in [KB-0356](06-model-registries-und-freigabestatus.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Datenqualitäts-Validatoren, die Experiment-Tracking-Datensätze auf fehlende oder inkonsistente Werte prüfen | Adopting | Gegenüber manueller Sichtprüfung für systematischere, skalierbare Vollständigkeitskontrolle bevorzugen. |
| Werkzeugunabhängige Export-/Interoperabilitätsstandards zwischen Tracking-Tools (z. B. gemeinsames Austauschformat) | Evaluating | Gegenüber proprietären, tool-spezifischen Formaten abwägen, sobald ein ausgereifter, breit unterstützter Standard verfügbar ist. |

Ein Team akzeptiert einen automatisierten Experimentvergleich erst, wenn eine dokumentierte Vollständigkeitsprüfung die einbezogenen Daten als lückenfrei bestätigt.
