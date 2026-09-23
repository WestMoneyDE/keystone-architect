---
{"id": "KB-0346", "title": "Datensplits und Leakage", "domain": "14", "sequence": 16, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0345", "concepts": ["Robustheit und Verteilungsänderung"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Training-, Validierungs- und Testdaten sauber trennen und einen konkreten Leakage-Fall (z. B. zeitliche Vermischung) an einem lokalen Beispiel erkennen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Einen Datensplit-Prozess gestalten, der zeitliche, gruppenbezogene und nahezu identische Daten explizit als Leakage-Risiken behandelt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartet hohe Testgenauigkeit auf Leakage zwischen Trainings- und Testdaten statt auf tatsächliche Modellqualität zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Datensplit-Disziplin als Grundvoraussetzung für jede glaubwürdige Modellbewertung positionieren, ohne die jede weitere Metrik potenziell irreführend ist.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Automatisierte Leakage-Detektionswerkzeuge sind Vertiefung.", "rationale": "Kern ist das Verständnis der Leakage-Mechanismen, nicht ein spezifisches Tool."}}, "lab_validation": [{"lab_id": "KB-0346-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales, synthetisches Datenset mit absichtlich eingebauter zeitlicher und gruppenbezogener Leakage", "evidence": "Ein Modell, das mit einem naiven zufälligen Split trainiert wird, bei dem zeitlich oder gruppenbezogen zusammengehörige Datenpunkte über Trainings- und Testmenge verteilt sind, erreicht eine deutlich höhere Testgenauigkeit als ein identisches Modell mit einem sauberen, leakage-freien Split, was die Testgenauigkeit des ersten Modells als irreführend entlarvt.", "limitations": "Kein produktives Datenpipeline-System, kein realer Geschäftsdatensatz."}]}
---
# Datensplits und Leakage

> **Ziel:** Eine saubere Trennung von Trainings-, Validierungs- und Testdaten ist die Grundvoraussetzung für jede glaubwürdige Modellbewertung, einschließlich der in [KB-0345](15-robustheit-und-verteilungsaenderung.md) behandelten Robustheitstests. Data Leakage — das unbeabsichtigte Durchsickern von Informationen aus Trainings- in Testdaten — untergräbt diese Grundvoraussetzung und kann zu einer scheinbar hervorragenden, tatsächlich aber irreführenden Testgenauigkeit führen. Der Fokus liegt auf drei konkreten Leakage-Risiken: zeitliche Vermischung, gruppenbezogene Vermischung und nahezu identische Daten über den Split hinweg.

## Zweck, Mental Model und Dependencies

Ein Trainings-/Validierungs-/Testsplit soll sicherstellen, dass die auf der Testmenge gemessene Genauigkeit eine ehrliche Schätzung der Modellleistung auf neuen, ungesehenen Daten ist. Data Leakage tritt auf, wenn diese Trennung faktisch verletzt wird, weil Informationen, die in Produktion zum Vorhersagezeitpunkt nicht verfügbar wären, in die Trainings- oder Feature-Erstellung einfließen oder weil Trainings- und Testdaten nicht wirklich unabhängig sind. Zeitliche Leakage tritt auf, wenn bei zeitlich geordneten Daten (z. B. Transaktionen, Log-Einträge) ein zufälliger statt eines zeitlich geordneten Splits verwendet wird, sodass das Modell effektiv aus der "Zukunft" relativ zu einzelnen Testpunkten lernen kann. Gruppenbezogene Leakage tritt auf, wenn mehrere Datenpunkte zu derselben übergeordneten Einheit gehören (z. B. mehrere Datensätze desselben Kunden oder Patienten) und ein zufälliger Split Datenpunkte derselben Einheit über Trainings- und Testmenge verteilt, sodass das Modell einheitenspezifische statt generalisierbare Muster lernt. Nahezu identische Daten (Near-Duplicates) entstehen, wenn sich sehr ähnliche oder leicht modifizierte Kopien desselben Datenpunkts sowohl in Trainings- als auch in Testdaten befinden, wodurch das Modell diese "im Test" effektiv bereits gesehen hat. In allen drei Fällen ist die auf der Testmenge gemessene Genauigkeit systematisch zu optimistisch und kein verlässlicher Indikator für die tatsächliche Generalisierungsfähigkeit.

~~~text
Temporal leakage:  random split on time-ordered data -> model implicitly learns from the "future"
Group leakage:     random split with multiple rows per entity -> model learns entity-specific, not generalizable patterns
Near-duplicate leakage: near-identical rows in BOTH train and test -> model has effectively already "seen" the test point
ALL THREE -> test accuracy is SYSTEMATICALLY OPTIMISTIC, not a reliable indicator of true generalization
~~~

## Core Concepts, Architektur und Implementierung

| Leakage-Typ | Split-Strategie zur Vermeidung | Symptom bei Verletzung |
|---|---|---|
| Zeitliche Leakage | zeitlich geordneter Split (Training = Vergangenheit, Test = Zukunft) statt zufälliger Split | Testgenauigkeit sinkt beim Übergang zu echtem Live-Betrieb deutlich unter die im Backtest gemessene Genauigkeit |
| Gruppenbezogene Leakage | gruppenbasierter Split (alle Datenpunkte derselben Einheit konsequent in derselben Menge) statt zufälliger Split | Modell performt bei neuen, im Training ungesehenen Einheiten deutlich schlechter als bei Testdaten mit bekannten Einheiten |
| Nahezu identische Daten | explizite Deduplizierungs-/Ähnlichkeitsprüfung zwischen Trainings- und Testmenge vor dem Training | Testgenauigkeit ist unglaubwürdig hoch im Vergleich zur Komplexität der Aufgabe |

Implementierung: Vor jedem Modelltraining wird geprüft, ob die Daten eine zeitliche Ordnung oder eine Gruppenstruktur (mehrere Datenpunkte pro übergeordneter Einheit) aufweisen; bei zeitlich geordneten Daten wird ein zeitlich geordneter statt eines zufälligen Splits verwendet, bei Gruppenstruktur ein gruppenbasierter Split, der alle Datenpunkte einer Einheit konsequent derselben Menge zuordnet. Zusätzlich wird eine explizite Ähnlichkeitsprüfung zwischen Trainings- und Testmenge durchgeführt, um nahezu identische Datenpunkte zu identifizieren und zu entfernen. Die Validierungsmenge (für Hyperparameter-Tuning) folgt denselben Split-Prinzipien wie die Testmenge, um Leakage über den Tuning-Prozess zu vermeiden.

## Scalability, Reliability, Security und Observability

Ein sauberer Datensplit-Prozess skaliert die Verlässlichkeit jeder nachgelagerten Modellbewertung; die Reliability-Grenze liegt darin, dass unentdeckte Leakage proportional zur Datenkomplexität (mehr zeitliche/gruppenbezogene Struktur) zunehmend wahrscheinlicher wird, während die daraus resultierende, zu optimistische Testgenauigkeit unverändert glaubwürdig erscheint.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein im Backtest hervorragend performendes Modell zeigt in echtem Live-Betrieb deutlich schlechtere Ergebnisse | zeitliche Leakage durch einen zufälligen statt zeitlich geordneten Split hat die Backtest-Genauigkeit künstlich erhöht | den Split auf einen strikt zeitlich geordneten Split umstellen und die Genauigkeit neu messen |
| ein Modell performt bei neuen Kunden/Einheiten deutlich schlechter als im Test gemessen | gruppenbezogene Leakage durch Datenpunkte derselben Einheit in Trainings- und Testmenge hat die Testgenauigkeit künstlich erhöht | einen gruppenbasierten Split verwenden, der Einheiten konsequent trennt, und die Genauigkeit neu messen |
| die Testgenauigkeit erscheint unglaubwürdig hoch für die Komplexität der Aufgabe | nahezu identische Datenpunkte befinden sich sowohl in Trainings- als auch in Testmenge | eine explizite Ähnlichkeitsprüfung zwischen Trainings- und Testmenge durchführen und betroffene Duplikate entfernen |

Security: Data Leakage kann in regulierten Kontexten (z. B. Kreditvergabe, Medizin) dazu führen, dass ein tatsächlich unzureichendes Modell fälschlich als geeignet für den Produktivbetrieb eingestuft wird, mit realen Konsequenzen für betroffene Personen. Observability: Der Unterschied zwischen Backtest-/Testgenauigkeit und tatsächlicher Live-Genauigkeit nach Produktivsetzung ist die wichtigste nachträgliche Kontrollmetrik für unentdeckte Leakage.

## Trade-offs und Entscheidungen

**Staff** implementiert zeitlich geordnete oder gruppenbasierte Splits je nach Datenstruktur konsequent. **Principal** macht die gewählte Split-Strategie und ihre Begründung für das Team nachvollziehbar. **Chief** positioniert Datensplit-Disziplin als nicht verhandelbare Grundvoraussetzung, ohne die jede weitere Modellmetrik potenziell irreführend ist.

Anti-Patterns: bei zeitlich geordneten Daten einen zufälligen statt zeitlich geordneten Split verwenden; bei Daten mit Gruppenstruktur einen zufälligen statt gruppenbasierten Split verwenden; Trainings- und Testdaten ohne explizite Ähnlichkeitsprüfung auf nahezu identische Datenpunkte verwenden.

## Production Checklist

- [ ] Zeitlich geordnete Daten verwenden einen zeitlich geordneten, keinen zufälligen Split.
- [ ] Daten mit Gruppenstruktur verwenden einen gruppenbasierten Split.
- [ ] Eine explizite Ähnlichkeitsprüfung schließt nahezu identische Daten zwischen Trainings- und Testmenge aus.
- [ ] Die Validierungsmenge folgt denselben Split-Prinzipien wie die Testmenge.

## Interviewfragen

### 1. Was ist Data Leakage, und warum ist es besonders gefährlich?

**Antwort:** Das unbeabsichtigte Durchsickern von Informationen aus Trainings- in Testdaten, das zu einer scheinbar hervorragenden, aber tatsächlich irreführenden Testgenauigkeit führt, da die Testmenge die Modellleistung auf echte, ungesehene Daten nicht mehr ehrlich abbildet.

### 2. Warum ist ein zufälliger Split bei zeitlich geordneten Daten riskant?

**Antwort:** Das Modell kann effektiv aus der "Zukunft" relativ zu einzelnen Testpunkten lernen, da zeitlich spätere Datenpunkte im Training und zeitlich frühere im Test landen können, was in echtem Live-Betrieb nicht möglich wäre.

### 3. Was ist gruppenbezogene Leakage, und wie wird sie vermieden?

**Antwort:** Mehrere Datenpunkte derselben übergeordneten Einheit werden über Trainings- und Testmenge verteilt, sodass das Modell einheitenspezifische statt generalisierbare Muster lernt; vermieden wird dies durch einen gruppenbasierten Split, der alle Datenpunkte einer Einheit konsequent derselben Menge zuordnet.

### 4. Warum sind nahezu identische Daten über den Split hinweg problematisch?

**Antwort:** Das Modell hat den Testdatenpunkt effektiv bereits im Training in nahezu identischer Form gesehen, wodurch die Testgenauigkeit die tatsächliche Generalisierungsfähigkeit nicht mehr korrekt widerspiegelt.

### 5. Wie diagnostizierst du eine unerwartet schlechte Live-Performance trotz hervorragender Testgenauigkeit?

**Antwort:** Ich prüfe zuerst, ob eine zeitliche oder gruppenbezogene Leakage im ursprünglichen Split vorlag, indem ich die Datenstruktur (zeitliche Ordnung, Gruppenzugehörigkeit) analysiere und bei Bedarf mit einem korrigierten Split neu evaluiere.

### 6. Widersprüchliche Anforderung: Team will schnelle Modellentwicklung mit einfachem zufälligem Split UND garantiert leakage-freie, produktionsrepräsentative Evaluierung — wie gehst du vor?

**Antwort:** Ich würde erklären, dass ein zufälliger Split bei zeitlich geordneten oder gruppierten Daten strukturell leakage-anfällig ist, unabhängig vom Aufwand; ich würde vorschlagen, den korrekten Split-Typ (zeitlich oder gruppenbasiert) einmalig als festen Standardprozess zu etablieren, der danach genauso schnell wie ein zufälliger Split anwendbar ist, statt Split-Korrektheit dauerhaft gegen Geschwindigkeit abzuwägen.

## Praktische Labs

~~~python
import numpy as np

rng = np.random.default_rng(0)

n_entities = 20
rows_per_entity = 5
entity_ids = np.repeat(np.arange(n_entities), rows_per_entity)
X = rng.normal(size=(n_entities * rows_per_entity, 1)) + entity_ids.reshape(-1, 1) * 0.01
y = (entity_ids % 2 == 0).astype(int)  # label depends mostly on entity identity

# Naive random split: rows of the SAME entity can land in both train and test (group leakage)
perm = rng.permutation(len(X))
split = int(0.7 * len(X))
train_idx_naive, test_idx_naive = perm[:split], perm[split:]

# Group-aware split: all rows of an entity stay together
entities = np.arange(n_entities)
rng.shuffle(entities)
train_entities = set(entities[:14])
train_idx_group = np.array([i for i, e in enumerate(entity_ids) if e in train_entities])
test_idx_group = np.array([i for i, e in enumerate(entity_ids) if e not in train_entities])

def nearest_neighbor_accuracy(train_idx, test_idx):
    correct = 0
    for i in test_idx:
        distances = np.abs(X[train_idx, 0] - X[i, 0])
        nearest = train_idx[np.argmin(distances)]
        correct += int(y[nearest] == y[i])
    return correct / len(test_idx)

print(f"Naive random split accuracy (group leakage present): {nearest_neighbor_accuracy(train_idx_naive, test_idx_naive):.2%}")
print(f"Group-aware split accuracy (leakage-free): {nearest_neighbor_accuracy(train_idx_group, test_idx_group):.2%}")
~~~

## Dependencies, Cross-References und Quellen

1. Kaufman et al.: [Leakage in Data Mining — Formulation, Detection, and Avoidance](https://dl.acm.org/doi/10.1145/2382577.2382579), abgerufen 2026-09-17.
2. scikit-learn: [Cross-validation — GroupKFold und TimeSeriesSplit](https://scikit-learn.org/stable/modules/cross_validation.html), abgerufen 2026-09-17.

Robustheit und Verteilungsänderung sind kanonisch in [KB-0345](15-robustheit-und-verteilungsaenderung.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Near-Duplicate- und Ähnlichkeits-Detektionswerkzeuge für Trainings-/Testsplits | Adopting | Gegenüber rein manueller Sichtprüfung für systematischere Leakage-Erkennung bei großen Datensätzen bevorzugen. |
| Standardisierte, versionierte Split-Definitionen als Teil der Datenpipeline statt Ad-hoc-Splits pro Experiment | Adopting | Gegenüber wiederholt neu erzeugten Zufallssplits für Reproduzierbarkeit und Vermeidung schleichender Leakage bevorzugen. |

Ein Team akzeptiert eine Modellbewertung erst, wenn die verwendete Split-Strategie explizit dokumentiert und gegen zeitliche, gruppenbezogene und Near-Duplicate-Leakage geprüft ist.
