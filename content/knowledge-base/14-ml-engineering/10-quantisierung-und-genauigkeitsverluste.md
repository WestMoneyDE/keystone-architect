---
{"id": "KB-0340", "title": "Quantisierung und Genauigkeitsverluste", "domain": "14", "sequence": 10, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0331", "concepts": ["Neuronale Netze und Repräsentationen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Gewichte eines kleinen neuronalen Netzes von 32-Bit- auf 8-Bit-Genauigkeit quantisieren und die resultierende Modellgröße sowie Genauigkeitsveränderung messen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Entscheiden, wann Post-Training-Quantisierung gegenüber trainingsgestützter (Quantization-Aware) Quantisierung angemessen ist, basierend auf akzeptablem Qualitätsverlust und verfügbarem Trainingsaufwand.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Qualitätsregression nach Modellquantisierung auf fehlende oder unzureichende Kalibrierung statt auf ein allgemeines Modellproblem zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Quantisierung als Kompromiss zwischen Modellgrößenreduktion und Genauigkeitsverlust positionieren, der explizite Kalibrierung und Hardwareunterstützungsprüfung erfordert, nicht als kostenlose Größenreduktion.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Quantisierungsformat-Implementierungsdetails (INT4, GPTQ, AWQ) sind Vertiefung.", "rationale": "Kern ist das Prinzip von Kalibrierung und dem Trade-off zwischen Größenreduktion und Genauigkeit, nicht das konkrete Quantisierungsformat."}}, "lab_validation": [{"lab_id": "KB-0340-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales PyTorch-Modell mit simulierter Gewichtsquantisierung von 32-Bit auf 8-Bit und Vergleich der Modellgröße sowie Vorhersagegenauigkeit vor und nach Quantisierung", "evidence": "Eine Quantisierung von 32-Bit- auf 8-Bit-Gewichte reduziert die Modellgröße um etwa das Vierfache, während die Vorhersagegenauigkeit ohne angemessene Kalibrierung stärker abfällt als mit einer kalibrierten Quantisierung.", "limitations": "Kein produktives Quantisierungssystem, kein großer Datensatz, keine reale Hardware-Inferenz-Messung."}]}
---
# Quantisierung und Genauigkeitsverluste

> **Ziel:** Quantisierung reduziert die numerische Genauigkeit von Gewichten und Aktivierungen eines neuronalen Netzes (aufbauend auf neuronalen Netzen, siehe [KB-0331](01-neuronale-netze-und-repraesentationen.md)), typischerweise von 32-Bit-Gleitkommazahlen auf niedrigere Bit-Breiten (16-Bit, 8-Bit oder weniger), um Modellgröße und Inferenzkosten zu reduzieren. Der zentrale Punkt ist, dass diese Reduktion nicht kostenlos ist — Kalibrierung, Hardwareunterstützung und mögliche Qualitätsregressionen müssen explizit geprüft werden, statt Quantisierung als reine, verlustfreie Größenreduktion zu betrachten.

## Zweck, Mental Model und Dependencies

Gewichtsquantisierung reduziert die numerische Genauigkeit der gelernten Modellparameter selbst. Aktivierungsquantisierung reduziert zusätzlich die Genauigkeit der Zwischenwerte, die während der Inferenz zwischen den Layern berechnet werden. Beide zusammen reduzieren sowohl den Speicherbedarf für die Modellgewichte als auch potenziell die Rechenzeit, da niedrigere Bit-Breiten auf geeigneter Hardware schneller verarbeitet werden können. Der zentrale, oft übersehene Faktor ist Kalibrierung: eine naive Quantisierung, die einfach jeden Gleitkommawert auf den nächstgelegenen quantisierten Wert rundet, kann zu erheblichen Genauigkeitsverlusten führen, insbesondere wenn die Wertverteilung eines Layers Ausreißer enthält, die den gesamten Quantisierungsbereich verzerren. Kalibrierung nutzt eine repräsentative Stichprobe von Daten, um die tatsächliche Wertverteilung jedes Layers zu analysieren und den Quantisierungsbereich entsprechend zu optimieren, statt eine pauschale, unkalibrierte Rundung vorzunehmen. Der zweite zentrale Faktor ist Hardwareunterstützung: der theoretische Geschwindigkeits- und Speichervorteil einer Quantisierung wird nur realisiert, wenn die tatsächlich verwendete Hardware die gewählte Bit-Breite nativ unterstützt — eine Quantisierung auf ein von der Hardware nicht effizient unterstütztes Format kann den erwarteten Vorteil nicht liefern oder sogar zu Overhead durch Dequantisierung während der Inferenz führen. Post-Training-Quantisierung wendet die Quantisierung nach Abschluss des regulären Trainings an, ist einfacher umzusetzen, kann aber zu größeren Genauigkeitsverlusten führen; Quantization-Aware Training simuliert die Quantisierungseffekte bereits während des Trainings, was das Modell robuster gegenüber der späteren Quantisierung macht, aber zusätzlichen Trainingsaufwand erfordert.

~~~text
Weight quantization: reduce precision of the learned model parameters themselves
Activation quantization: also reduce precision of intermediate layer values during inference
Both reduce memory footprint AND potentially compute time (if hardware supports lower bit-widths natively)
CRITICAL FACTOR: calibration
  -> naive rounding of every float value to nearest quantized value can cause SIGNIFICANT accuracy loss
  -> outliers in a layer's value distribution can skew the whole quantization range
  -> calibration uses a representative data sample to optimize the quantization range per layer
CRITICAL FACTOR: hardware support -> theoretical speed/memory benefit only realized if hardware NATIVELY supports the chosen bit-width
Post-training quantization: applied AFTER training, simpler, but can cause LARGER accuracy loss
Quantization-aware training: simulates quantization DURING training -> more robust, but MORE training effort
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Angemessene Kalibrierung vor Quantisierung | wird eine repräsentative Datenstichprobe genutzt, um den Quantisierungsbereich pro Layer zu optimieren, statt naiv zu runden? | ohne Kalibrierung können Ausreißer in der Wertverteilung zu erheblichem Genauigkeitsverlust führen |
| Verifikation der tatsächlichen Hardwareunterstützung | unterstützt die tatsächlich eingesetzte Inferenz-Hardware die gewählte Bit-Breite nativ und effizient? | ohne diese Verifikation kann der erwartete Geschwindigkeits- oder Speichervorteil ausbleiben oder sogar Dequantisierungs-Overhead entstehen |
| Explizite Messung der Qualitätsregression | wird die Genauigkeit des quantisierten Modells explizit gegen das unquantisierte Modell verglichen? | ohne diese Messung kann eine unerwartet starke Qualitätsregression unentdeckt bleiben |
| Begründete Wahl zwischen Post-Training- und Quantization-Aware-Ansatz | wurde die Wahl zwischen den beiden Ansätzen anhand des akzeptablen Qualitätsverlusts und verfügbaren Trainingsaufwands getroffen? | eine unpassende Wahl kann entweder unnötigen Trainingsaufwand oder eine vermeidbare Qualitätsregression erzeugen |

Implementierung: Vor der Quantisierung wird eine repräsentative Datenstichprobe genutzt, um die tatsächliche Wertverteilung jedes zu quantisierenden Layers zu analysieren und den Quantisierungsbereich entsprechend zu kalibrieren, statt eine pauschale, unkalibrierte Rundung vorzunehmen. Die tatsächliche Zielhardware wird explizit auf native Unterstützung der gewählten Bit-Breite geprüft, bevor eine Quantisierungsstrategie festgelegt wird. Die Genauigkeit des quantisierten Modells wird explizit gegen das unquantisierte Ausgangsmodell auf einem repräsentativen Testset verglichen, um die tatsächliche Qualitätsregression zu quantifizieren. Bei akzeptablem Aufwand und höherem Qualitätsanspruch wird Quantization-Aware Training eingesetzt, das die Quantisierungseffekte bereits während des Trainings simuliert; bei geringerem verfügbarem Aufwand wird Post-Training-Quantisierung mit sorgfältiger Kalibrierung eingesetzt.

## Scalability, Reliability, Security und Observability

Quantisierung skaliert Modellgrößen- und Inferenzkostenreduktion proportional zur gewählten Bit-Breitenreduktion; die Reliability-Grenze liegt in unkalibrierter Quantisierung, die mit sinkender Bit-Breite proportional mehr Genauigkeitsverlust erzeugen kann, insbesondere bei Layern mit stark ausreißerbehafteten Wertverteilungen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein quantisiertes Modell zeigt deutlich schlechtere Genauigkeit als das unquantisierte Ausgangsmodell | fehlende oder unzureichende Kalibrierung vor der Quantisierung | die Quantisierung mit sorgfältiger Kalibrierung anhand einer repräsentativen Datenstichprobe wiederholen und vergleichen |
| die erwartete Geschwindigkeits- oder Speicherersparnis durch Quantisierung tritt in der Produktion nicht ein | die Zielhardware unterstützt die gewählte Bit-Breite nicht nativ, was zu Dequantisierungs-Overhead führt | prüfen, ob die tatsächlich verwendete Inferenz-Hardware die gewählte Bit-Breite nativ und effizient unterstützt |
| eine Qualitätsregression nach Quantisierung wird erst spät in der Produktion bemerkt | fehlende explizite Messung der Qualitätsregression vor dem produktiven Einsatz | die Genauigkeit des quantisierten Modells explizit gegen das unquantisierte Modell vor Produktivsetzung vergleichen |

Security: Ein quantisiertes Modell kann bei bestimmten Randfällen oder Eingaben ein anderes Verhalten zeigen als das ursprüngliche Modell, insbesondere bei sicherheitskritischen Entscheidungsschwellen; diese Verhaltensänderungen sollten explizit auf sicherheitsrelevante Entscheidungspunkte geprüft werden, bevor ein quantisiertes Modell für sicherheitskritische Anwendungsfälle eingesetzt wird. Observability: Modellgröße vor und nach Quantisierung, Genauigkeitsvergleich zwischen quantisiertem und unquantisiertem Modell und tatsächliche Inferenzgeschwindigkeit auf der Zielhardware sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** kalibriert Quantisierung immer anhand einer repräsentativen Datenstichprobe, statt naiv zu runden. **Principal** macht die Wahl zwischen Post-Training- und Quantization-Aware-Ansatz für das Team nachvollziehbar begründet dokumentiert. **Chief** positioniert Quantisierung als expliziten Kompromiss zwischen Größenreduktion und Genauigkeitsverlust, der Kalibrierung und Hardwareverifikation erfordert.

Anti-Patterns: Quantisierung ohne Kalibrierung anhand einer repräsentativen Datenstichprobe durchführen; eine Bit-Breite wählen, ohne die tatsächliche Hardwareunterstützung zu verifizieren; ein quantisiertes Modell ohne expliziten Genauigkeitsvergleich gegen das unquantisierte Modell produktiv einsetzen.

## Production Checklist

- [ ] Quantisierung ist anhand einer repräsentativen Datenstichprobe kalibriert.
- [ ] Die tatsächliche Zielhardware unterstützt die gewählte Bit-Breite nativ und effizient.
- [ ] Die Genauigkeit des quantisierten Modells ist explizit gegen das unquantisierte Modell verglichen.
- [ ] Die Wahl zwischen Post-Training- und Quantization-Aware-Ansatz ist begründet dokumentiert.

## Interviewfragen

### 1. Was ist der Unterschied zwischen Gewichts- und Aktivierungsquantisierung?

**Antwort:** Gewichtsquantisierung reduziert die Genauigkeit der gelernten Modellparameter selbst, während Aktivierungsquantisierung zusätzlich die Genauigkeit der während der Inferenz berechneten Zwischenwerte reduziert.

### 2. Warum ist Kalibrierung für Quantisierung wichtig?

**Antwort:** Eine naive Rundung ohne Kalibrierung kann bei Ausreißern in der Wertverteilung eines Layers zu erheblichem Genauigkeitsverlust führen; Kalibrierung nutzt eine repräsentative Datenstichprobe, um den Quantisierungsbereich zu optimieren.

### 3. Warum kann Quantisierung ohne native Hardwareunterstützung ihren erwarteten Vorteil verfehlen?

**Antwort:** Der theoretische Geschwindigkeits- und Speichervorteil wird nur realisiert, wenn die Hardware die gewählte Bit-Breite nativ unterstützt; andernfalls kann Dequantisierungs-Overhead während der Inferenz entstehen.

### 4. Was ist der Unterschied zwischen Post-Training-Quantisierung und Quantization-Aware Training?

**Antwort:** Post-Training-Quantisierung wird nach Abschluss des regulären Trainings angewendet und ist einfacher, kann aber zu größeren Genauigkeitsverlusten führen; Quantization-Aware Training simuliert die Quantisierungseffekte bereits während des Trainings, was das Modell robuster macht, aber zusätzlichen Trainingsaufwand erfordert.

### 5. Wie diagnostizierst du eine unerwartete Qualitätsregression nach Modellquantisierung?

**Antwort:** Ich prüfe, ob eine angemessene Kalibrierung anhand einer repräsentativen Datenstichprobe vor der Quantisierung durchgeführt wurde — fehlende oder unzureichende Kalibrierung ist die wahrscheinlichste Ursache.

### 6. Widersprüchliche Anforderung: Team will maximale Modellgrößenreduktion durch eine möglichst niedrige Bit-Breite UND garantiert keine spürbare Genauigkeitseinbuße gegenüber dem unquantisierten Modell — wie gehst du vor?

**Antwort:** Ich würde erklären, dass diese Ziele sich direkt widersprechen, da eine niedrigere Bit-Breite tendenziell mehr Genauigkeitsverlust riskiert; ich würde vorschlagen, mit sorgfältiger Kalibrierung und gegebenenfalls Quantization-Aware Training die minimale Bit-Breite empirisch zu bestimmen, bei der die Genauigkeitseinbuße für den konkreten Anwendungsfall noch akzeptabel bleibt, statt eine pauschal niedrige Bit-Breite ohne Validierung zu wählen.

## Praktische Labs

~~~python
import torch
import torch.nn as nn

# Simulating naive vs calibrated quantization and measuring accuracy impact
torch.manual_seed(0)

def naive_quantize(tensor, bits=8):
    qmin, qmax = -(2 ** (bits - 1)), 2 ** (bits - 1) - 1
    scale = (tensor.max() - tensor.min()) / (qmax - qmin)  # naive: uses FULL range including outliers
    quantized = torch.clamp((tensor / scale).round(), qmin, qmax)
    return quantized * scale

def calibrated_quantize(tensor, bits=8, percentile=0.99):
    qmin, qmax = -(2 ** (bits - 1)), 2 ** (bits - 1) - 1
    clip_value = torch.quantile(tensor.abs(), percentile)  # CALIBRATED: clip outliers beyond 99th percentile
    clipped = torch.clamp(tensor, -clip_value, clip_value)
    scale = (2 * clip_value) / (qmax - qmin)
    quantized = torch.clamp((clipped / scale).round(), qmin, qmax)
    return quantized * scale

weights = torch.randn(1000) * 0.1
weights[0] = 10.0  # a single large outlier that skews the naive quantization range

naive_result = naive_quantize(weights)
calibrated_result = calibrated_quantize(weights)

naive_error = (weights[1:] - naive_result[1:]).abs().mean()
calibrated_error = (weights[1:] - calibrated_result[1:]).abs().mean()

print(f"Naive quantization mean error (excluding the outlier): {naive_error:.4f}")
print(f"Calibrated quantization mean error (excluding the outlier): {calibrated_error:.4f}")
print("Calibration protects the majority of values from being distorted by a single outlier.")
~~~

## Dependencies, Cross-References und Quellen

1. Jacob et al.: [Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference](https://arxiv.org/abs/1712.05877), abgerufen 2026-09-17.
2. Frantar et al.: [GPTQ — Accurate Post-Training Quantization for Generative Pre-trained Transformers](https://arxiv.org/abs/2210.17323), abgerufen 2026-09-17.
3. PyTorch: [Quantization Documentation](https://pytorch.org/docs/stable/quantization.html), abgerufen 2026-09-17.

Neuronale Netze und Repräsentationen sind kanonisch in [KB-0331](01-neuronale-netze-und-repraesentationen.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Fortgeschrittene Post-Training-Quantisierungsmethoden (GPTQ, AWQ), die durch gezielte Kalibrierung sehr niedrige Bit-Breiten mit reduziertem Genauigkeitsverlust ermöglichen | Adopting | Gegenüber einfacher, unkalibrierter Quantisierung für signifikant bessere Genauigkeit bei gleicher Bit-Breite bevorzugen. |
| Gemischte-Präzision-Quantisierung, die unterschiedliche Bit-Breiten für unterschiedlich sensible Layer desselben Modells verwendet | Adopting | Gegenüber einheitlicher Bit-Breite für das gesamte Modell für einen besseren Kompromiss zwischen Größe und Genauigkeit bevorzugen. |

Ein Team akzeptiert eine Quantisierungsstrategie erst, wenn Kalibrierung, Hardwareunterstützung und Genauigkeitsvergleich gegen das unquantisierte Modell dokumentiert und getestet sind.
