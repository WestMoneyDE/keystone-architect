---
{"id": "KB-0341", "title": "ML-Inferenz und Ausführung", "domain": "14", "sequence": 11, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0337", "concepts": ["Trainingsloops und Checkpoints"], "needed_for": "understanding"}], "related": ["KB-0340"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Modell zwischen Trainings- und Inferenzmodus umschalten und eine numerische Abweichung nach Export in ein anderes Laufzeitformat demonstrieren.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Modellbereitstellungsarchitektur gestalten, die numerische Abweichungen zwischen Trainings- und Produktionsumgebung sowie Laufzeitkompatibilität explizit vor produktiver Bereitstellung verifiziert.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Verhaltensänderung eines Modells in Produktion auf einen vergessenen Wechsel in den Inferenzmodus oder eine numerische Abweichung nach Export statt auf ein allgemeines Modellproblem zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Modellexport und Laufzeitkompatibilität als eigenständige, vor produktiver Bereitstellung zu verifizierende Risikofaktoren positionieren, nicht als automatisch verlustfreien technischen Schritt.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete ONNX- oder TensorRT-Exportdetails sind Vertiefung.", "rationale": "Kern ist das Prinzip der Verifikation numerischer Übereinstimmung und Laufzeitkompatibilität, nicht das konkrete Exportformat."}}, "lab_validation": [{"lab_id": "KB-0341-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales PyTorch-Modell mit Vergleich der Ausgabe im Trainings- gegenüber Inferenzmodus sowie nach simuliertem Export", "evidence": "Ein Modell mit Dropout- oder Batch-Normalization-Layern liefert im Trainingsmodus eine andere Ausgabe als im Inferenzmodus für dieselbe Eingabe, wenn der Modus nicht korrekt umgeschaltet wird; dies demonstriert, warum der Modus vor produktiver Nutzung explizit gesetzt werden muss.", "limitations": "Kein produktives Deployment-System, keine reale Exportinfrastruktur, keine reale Hardware-Inferenz-Messung."}]}
---
# ML-Inferenz und Ausführung

> **Ziel:** Trainingsmodus und Inferenzmodus (aufbauend auf Trainingsloops, siehe [KB-0337](07-trainingsloops-und-checkpoints.md)) unterscheiden sich im Verhalten bestimmter Layer (z. B. Dropout, Batch Normalization). Graphausführung und Export übertragen ein Modell aus der Trainingsumgebung in ein für die Produktion optimiertes Format. Der zentrale Punkt ist, dass numerische Abweichungen zwischen Trainings- und Inferenzausführung sowie Laufzeitkompatibilitätsprobleme explizit vor produktiver Bereitstellung geprüft werden müssen, statt Export und Ausführung als automatisch verlustfreien technischen Schritt zu betrachten.

## Zweck, Mental Model und Dependencies

Bestimmte Layer eines neuronalen Netzes verhalten sich im Trainingsmodus anders als im Inferenzmodus: Dropout deaktiviert während des Trainings zufällig einen Teil der Neuronen, um Überanpassung zu reduzieren, ist aber im Inferenzmodus vollständig deaktiviert, da für eine konsistente, deterministische Vorhersage alle Neuronen aktiv sein sollten. Batch Normalization nutzt während des Trainings die Statistiken (Mittelwert, Varianz) des aktuellen Batches, verwendet im Inferenzmodus jedoch über das Training akkumulierte, feste Statistiken, da zur Inferenzzeit oft nur ein einzelnes Beispiel oder ein kleiner Batch verarbeitet wird, dessen eigene Statistiken nicht repräsentativ wären. Der zentrale, oft übersehene Fehler ist, ein Modell versehentlich im Trainingsmodus für die Inferenz zu verwenden, was zu inkonsistenten, nicht deterministischen Vorhersagen führt. Graphausführung und Export übertragen ein trainiertes Modell in ein optimiertes Format (z. B. ONNX oder ein spezialisiertes Inferenz-Runtime-Format) für effizientere produktive Bereitstellung. Der zweite zentrale Risikofaktor ist, dass dieser Export nicht garantiert numerisch identische Ergebnisse liefert: unterschiedliche numerische Präzision, unterschiedliche Implementierungen derselben mathematischen Operation in unterschiedlichen Laufzeitumgebungen oder inkompatible Operator-Versionen können zu kleinen, aber potenziell folgenreichen numerischen Abweichungen zwischen dem ursprünglichen Trainingsframework und der exportierten Produktionsumgebung führen. Laufzeitkompatibilität bedeutet, dass die exportierte Modellversion tatsächlich von der Zielinfrastruktur (Hardware, Runtime-Version) unterstützt wird, was insbesondere bei neueren Modelloperationen oder speziellen Layer-Typen nicht garantiert ist.

~~~text
Training mode vs inference mode: certain layers behave DIFFERENTLY
  Dropout: randomly disables neurons during training (reduces overfitting) -> FULLY disabled in inference for deterministic output
  Batch Normalization: uses current BATCH statistics during training -> uses ACCUMULATED fixed statistics in inference
    (inference often processes single examples/small batches, whose own stats wouldn't be representative)
CRITICAL ERROR: accidentally running inference in TRAINING mode -> inconsistent, non-deterministic predictions
Export (e.g. to ONNX/specialized runtime): NOT guaranteed to produce numerically IDENTICAL results
  -> different numerical precision, different op implementations, incompatible operator versions -> small but consequential deviations
Runtime compatibility: exported model version must actually be SUPPORTED by target infrastructure (hardware, runtime version)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Korrekter Modus-Wechsel vor Inferenz | wird das Modell explizit in den Inferenzmodus versetzt, bevor es für Vorhersagen genutzt wird? | ein versehentlich im Trainingsmodus belassenes Modell liefert inkonsistente, nicht deterministische Vorhersagen |
| Explizite Verifikation numerischer Übereinstimmung nach Export | wird die Ausgabe des exportierten Modells explizit gegen die Ausgabe des ursprünglichen Trainingsframeworks für dieselben Eingaben verglichen? | ohne diese Verifikation können numerische Abweichungen nach Export unentdeckt bleiben |
| Verifikation der Laufzeitkompatibilität vor Bereitstellung | wird geprüft, ob die exportierte Modellversion von der tatsächlichen Zielinfrastruktur unterstützt wird? | ohne diese Prüfung kann ein Modell in der Zielinfrastruktur fehlschlagen oder unerwartetes Verhalten zeigen |
| Behandlung akzeptabler versus inakzeptabler numerischer Abweichungen | ist definiert, welches Ausmaß numerischer Abweichung nach Export für den konkreten Anwendungsfall akzeptabel ist? | ohne diese Definition kann eine geringe, aber tatsächlich folgenreiche Abweichung übersehen werden |

Implementierung: Vor jeder Inferenz wird das Modell explizit in den Inferenzmodus versetzt, um korrektes Verhalten von Dropout- und Batch-Normalization-Layern sicherzustellen. Nach dem Export in ein produktionsoptimiertes Format wird die Ausgabe des exportierten Modells explizit gegen die Ausgabe des ursprünglichen Trainingsframeworks für eine repräsentative Menge an Testeingaben verglichen, um numerische Abweichungen zu quantifizieren. Die Zielinfrastruktur wird vor produktiver Bereitstellung explizit auf Unterstützung der exportierten Modellversion und verwendeten Operatoren geprüft. Für den konkreten Anwendungsfall wird definiert, welches Ausmaß numerischer Abweichung akzeptabel ist, und diese Schwelle wird bei der Verifikation als Erfolgskriterium herangezogen.

## Scalability, Reliability, Security und Observability

ML-Inferenz-Bereitstellung skaliert Zuverlässigkeit produktiver Vorhersagen proportional zur Konsequenz der Verifikation numerischer Übereinstimmung und Laufzeitkompatibilität; die Reliability-Grenze liegt in unverifiziertem Export, der mit wachsender Komplexität des Modells und der Exportpipeline proportional mehr unentdeckte numerische Abweichungen oder Kompatibilitätsprobleme erzeugen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Modell liefert bei wiederholten identischen Anfragen unterschiedliche Ergebnisse in Produktion | das Modell wurde versehentlich im Trainingsmodus statt im Inferenzmodus betrieben | prüfen, ob das Modell explizit in den Inferenzmodus versetzt wurde, bevor es für Vorhersagen genutzt wird |
| ein exportiertes Modell liefert leicht abweichende Ergebnisse gegenüber dem ursprünglichen Trainingsframework | numerische Abweichungen durch unterschiedliche Präzision oder Operator-Implementierungen im Exportformat | die Ausgabe des exportierten Modells explizit gegen das ursprüngliche Framework für dieselben Testeingaben vergleichen |
| die Bereitstellung eines exportierten Modells schlägt in der Zielinfrastruktur fehl | die Zielinfrastruktur unterstützt die exportierte Modellversion oder bestimmte verwendete Operatoren nicht | die Laufzeitkompatibilität der exportierten Modellversion explizit gegen die tatsächliche Zielinfrastruktur prüfen |

Security: Ein Modell, das versehentlich im Trainingsmodus in Produktion läuft, kann durch die zufällige Natur von Dropout inkonsistente Sicherheitsentscheidungen treffen (z. B. bei einem Klassifikationsmodell für Zugriffsentscheidungen), was ein reales Betriebsrisiko darstellt. Observability: numerische Abweichung zwischen Trainingsframework und exportiertem Modell auf einem Testset, tatsächliche Inferenzlatenz in der Zielinfrastruktur und Häufigkeit von Kompatibilitätsfehlern bei der Bereitstellung sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** stellt konsequent sicher, dass Modelle vor Inferenz explizit in den Inferenzmodus versetzt werden. **Principal** macht die Verifikation numerischer Übereinstimmung nach Export für das Team nachvollziehbar dokumentiert. **Chief** positioniert Export und Laufzeitkompatibilität als eigenständige, zu verifizierende Risikofaktoren vor produktiver Bereitstellung.

Anti-Patterns: ein Modell ohne expliziten Wechsel in den Inferenzmodus für Vorhersagen nutzen; ein exportiertes Modell ohne Verifikation numerischer Übereinstimmung gegen das ursprüngliche Trainingsframework produktiv einsetzen; Laufzeitkompatibilität erst nach fehlgeschlagener Bereitstellung statt vorab prüfen.

## Production Checklist

- [ ] Das Modell wird vor jeder Inferenz explizit in den Inferenzmodus versetzt.
- [ ] Numerische Übereinstimmung zwischen exportiertem Modell und ursprünglichem Trainingsframework ist explizit verifiziert.
- [ ] Laufzeitkompatibilität der exportierten Modellversion mit der Zielinfrastruktur ist vor Bereitstellung geprüft.
- [ ] Ein akzeptables Maß numerischer Abweichung ist für den konkreten Anwendungsfall definiert.

## Interviewfragen

### 1. Warum verhalten sich Dropout und Batch Normalization im Trainings- und Inferenzmodus unterschiedlich?

**Antwort:** Dropout deaktiviert während des Trainings zufällig Neuronen zur Reduktion von Überanpassung, muss aber im Inferenzmodus für deterministische Vorhersagen vollständig deaktiviert sein; Batch Normalization nutzt im Training aktuelle Batch-Statistiken, im Inferenzmodus jedoch akkumulierte, feste Statistiken.

### 2. Was passiert, wenn ein Modell versehentlich im Trainingsmodus für Inferenz verwendet wird?

**Antwort:** Es liefert inkonsistente, nicht deterministische Vorhersagen für dieselbe Eingabe, da zufällige Elemente wie Dropout weiterhin aktiv bleiben.

### 3. Warum garantiert Modellexport nicht automatisch numerisch identische Ergebnisse?

**Antwort:** Unterschiedliche numerische Präzision, unterschiedliche Implementierungen derselben mathematischen Operation und inkompatible Operator-Versionen in der Zielumgebung können zu kleinen, aber potenziell folgenreichen numerischen Abweichungen führen.

### 4. Warum muss Laufzeitkompatibilität vor produktiver Bereitstellung geprüft werden?

**Antwort:** Die exportierte Modellversion oder bestimmte verwendete Operatoren werden möglicherweise nicht von der tatsächlichen Zielinfrastruktur (Hardware, Runtime-Version) unterstützt, was zu Fehlschlägen oder unerwartetem Verhalten führen kann.

### 5. Wie diagnostizierst du inkonsistente Vorhersagen eines produktiven Modells bei identischen Anfragen?

**Antwort:** Ich prüfe, ob das Modell explizit in den Inferenzmodus versetzt wurde — ein versehentlich im Trainingsmodus belassenes Modell mit aktivem Dropout ist die wahrscheinlichste Ursache für nicht deterministische Ergebnisse.

### 6. Widersprüchliche Anforderung: Team will maximale Inferenzgeschwindigkeit durch aggressive Exportoptimierung UND garantiert numerisch identische Ergebnisse zum ursprünglichen Trainingsframework — wie gehst du vor?

**Antwort:** Ich würde erklären, dass aggressive Optimierung (z. B. niedrigere Präzision, Operator-Fusion) das Risiko numerischer Abweichungen erhöht; ich würde vorschlagen, ein akzeptables Abweichungsmaß für den konkreten Anwendungsfall zu definieren und die Optimierungsstufe empirisch bis zu dieser Grenze zu erhöhen, statt maximale Geschwindigkeit ohne Rücksicht auf numerische Übereinstimmung anzustreben.

## Praktische Labs

~~~python
import torch
import torch.nn as nn

# Demonstrating train mode vs eval mode behavioral difference (dropout)
torch.manual_seed(0)

class ModelWithDropout(nn.Module):
    def __init__(self):
        super().__init__()
        self.linear = nn.Linear(4, 4)
        self.dropout = nn.Dropout(p=0.5)

    def forward(self, x):
        return self.dropout(self.linear(x))

model = ModelWithDropout()
x = torch.ones(1, 4)

model.train()  # TRAINING mode: dropout active
train_outputs = [model(x).tolist() for _ in range(3)]
print(f"Training mode outputs (non-deterministic due to active dropout): {train_outputs}")

model.eval()  # INFERENCE mode: dropout disabled
eval_outputs = [model(x).tolist() for _ in range(3)]
print(f"Inference mode outputs (deterministic, dropout disabled): {eval_outputs}")

assert eval_outputs[0] == eval_outputs[1] == eval_outputs[2]
print("Forgetting model.eval() before inference would produce inconsistent, non-deterministic predictions.")
~~~

## Dependencies, Cross-References und Quellen

1. PyTorch: [Model Modes — train() and eval() Documentation](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#torch.nn.Module.eval), abgerufen 2026-09-17.
2. ONNX: [ONNX Model Export and Runtime Documentation](https://onnx.ai/onnx/intro/), abgerufen 2026-09-17.
3. NVIDIA: [TensorRT Documentation — Precision and Numerical Accuracy](https://docs.nvidia.com/deeplearning/tensorrt/developer-guide/index.html), abgerufen 2026-09-17.

Trainingsloops und Checkpoints sind kanonisch in [KB-0337](07-trainingsloops-und-checkpoints.md) behandelt; Quantisierung und Genauigkeitsverluste in [KB-0340](10-quantisierung-und-genauigkeitsverluste.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte numerische Regressionstests, die exportierte Modelle systematisch gegen das ursprüngliche Trainingsframework auf einem Testset vergleichen | Adopting | Gegenüber manueller Stichprobenprüfung für zuverlässigere, systematische Verifikation numerischer Übereinstimmung bevorzugen. |
| Standardisierte Cross-Runtime-Kompatibilitätstests, die vor Bereitstellung automatisch prüfen, ob alle verwendeten Operatoren von der Zielinfrastruktur unterstützt werden | Adopting | Gegenüber reaktivem Erkennen von Kompatibilitätsproblemen erst bei fehlgeschlagener Bereitstellung für proaktive Absicherung bevorzugen. |

Ein Team akzeptiert eine ML-Inferenz-Bereitstellung erst, wenn Inferenzmodus, numerische Übereinstimmung nach Export und Laufzeitkompatibilität dokumentiert und getestet sind.
