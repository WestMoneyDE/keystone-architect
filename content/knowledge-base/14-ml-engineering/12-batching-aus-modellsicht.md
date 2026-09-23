---
{"id": "KB-0342", "title": "Batching aus Modellsicht", "domain": "14", "sequence": 12, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0341", "concepts": ["ML-Inferenz und Ausführung"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Batch mit unterschiedlich langen Sequenzen padden und den zusätzlichen Speicher- und Rechenaufwand durch Padding gegenüber individueller Verarbeitung messen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Batching-Strategie gestalten, die Sequenzlängen-Bucketing einsetzt, um Padding-Overhead zu reduzieren, statt Sequenzen unterschiedlicher Länge unstrukturiert in einer Batch zu mischen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen unerwarteten Speicherdruck oder numerische Instabilität bei größeren Batchgrößen auf Padding-Overhead oder Batch-Normalization-Effekte statt auf ein allgemeines Infrastrukturproblem zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Batching als Modellierungsentscheidung mit direkten Speicher- und numerischen Konsequenzen positionieren, die von der reinen Serving-Scheduling-Frage (siehe Domain 17) zu unterscheiden ist.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete dynamische Batching-Scheduler-Implementierungen gehören zu Domain 17 (Serving), nicht zu dieser Datei.", "rationale": "Diese Datei behandelt Batching aus Modellsicht (Speicher, Padding, numerische Effekte), nicht die operative Scheduling-Frage im Serving-Betrieb."}}, "lab_validation": [{"lab_id": "KB-0342-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales PyTorch-Modell mit gepaddeten Batches unterschiedlicher Sequenzlängen im Vergleich zu Sequenzlängen-Bucketing", "evidence": "Eine Batch mit stark unterschiedlichen Sequenzlängen erzeugt erheblichen Padding-Overhead, da alle Sequenzen auf die Länge der längsten Sequenz aufgefüllt werden müssen; Sequenzlängen-Bucketing (Gruppierung ähnlich langer Sequenzen) reduziert diesen Overhead deutlich.", "limitations": "Kein produktives Serving-System, kein großer Datensatz, keine reale GPU-Infrastruktur getestet."}]}
---
# Batching aus Modellsicht

> **Ziel:** Batchgrößen, Padding und Sequenzlängen interagieren aus Modellsicht auf eine Weise, die Speicherdruck und numerische Effekte erzeugt (aufbauend auf ML-Inferenz, siehe [KB-0341](11-ml-inferenz-und-ausfuehrung.md)). Der zentrale Fokus dieser Datei ist die modellseitige Perspektive — wie Batching Speicherbedarf und numerisches Verhalten beeinflusst; die operative Frage, wie ein Serving-System Anfragen dynamisch zu Batches zusammenfasst (Scheduling), wird in Domain 17 (Serving) behandelt, nicht hier.

## Zweck, Mental Model und Dependencies

Eine Batch fasst mehrere Eingabebeispiele zusammen, um sie gemeinsam durch das Modell zu verarbeiten, was auf paralleler Hardware (GPU) deutlich effizienter ist als die Verarbeitung einzelner Beispiele nacheinander. Der zentrale, oft übersehene Komplikationsfaktor ist, dass Sequenzen innerhalb einer Batch üblicherweise unterschiedliche Längen haben (z. B. unterschiedlich lange Sätze), aber die zugrunde liegende Tensor-Datenstruktur eine einheitliche Form für alle Elemente der Batch benötigt. Padding löst dieses Problem, indem kürzere Sequenzen mit speziellen Füll-Tokens auf die Länge der längsten Sequenz in der Batch aufgefüllt werden — dies erzeugt jedoch Speicher- und Rechenaufwand für die Padding-Positionen, die keine tatsächliche Information enthalten, aber dennoch verarbeitet werden müssen (typischerweise mit einer Attention-Maske, die verhindert, dass diese Padding-Positionen das Ergebnis inhaltlich beeinflussen). Wenn eine Batch Sequenzen mit stark unterschiedlichen Längen enthält (z. B. eine sehr kurze und eine sehr lange Sequenz), kann der Padding-Overhead erheblich werden, da alle kurzen Sequenzen auf die Länge der einzigen langen Sequenz aufgefüllt werden müssen. Sequenzlängen-Bucketing adressiert dies, indem Sequenzen ähnlicher Länge in derselben Batch gruppiert werden, was den notwendigen Padding-Umfang deutlich reduziert. Speicherdruck entsteht, weil größere Batchgrößen proportional mehr Speicher für Aktivierungen (Zwischenergebnisse) während des Forward Pass benötigen — bei begrenztem verfügbarem Speicher begrenzt dies direkt die maximal mögliche Batchgröße. Numerische Effekte entstehen insbesondere bei Layern wie Batch Normalization, deren Statistikberechnung von der tatsächlichen Batchgröße und -zusammensetzung abhängt, was zu leicht unterschiedlichem Verhalten bei unterschiedlichen Batchgrößen führen kann.

~~~text
Batch: process multiple inputs together -> efficient on parallel hardware (GPU)
COMPLICATION: sequences within a batch have DIFFERENT lengths, but tensor structure needs UNIFORM shape
Padding: fill shorter sequences with special tokens up to the longest sequence's length
  -> creates memory/compute overhead for padding positions containing NO actual information
  -> requires attention mask to prevent padding from influencing the result
Sequence length bucketing: group SIMILAR-length sequences into the same batch -> reduces padding overhead significantly
Memory pressure: larger batch = proportionally MORE memory for activations during forward pass -> limits max batch size
Numerical effects: layers like Batch Normalization depend on actual batch size/composition
  -> can cause slightly different behavior at different batch sizes
NOTE: dynamic batching SCHEDULING (how a serving system groups requests) belongs to Domain 17, NOT here
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Angemessene Padding-Strategie mit Attention-Maskierung | wird Padding korrekt mit einer Attention-Maske kombiniert, die verhindert, dass Padding-Positionen das Ergebnis beeinflussen? | ohne korrekte Maskierung können Padding-Positionen fälschlich in die Berechnung einfließen und das Ergebnis verfälschen |
| Sequenzlängen-Bucketing zur Overhead-Reduktion | werden Sequenzen ähnlicher Länge gruppiert, um den Padding-Overhead zu reduzieren, statt Sequenzen beliebiger Länge zu mischen? | ohne Bucketing kann eine einzelne sehr lange Sequenz erheblichen unnötigen Padding-Overhead für die gesamte Batch erzeugen |
| Batchgrößen-Begrenzung anhand verfügbaren Speichers | ist die maximale Batchgröße explizit an den verfügbaren Speicher für Aktivierungen angepasst? | eine zu große Batchgröße kann zu Speicherüberlauf während des Trainings oder der Inferenz führen |
| Bewusstsein für batchgrößenabhängige numerische Effekte | ist bekannt, dass Layer wie Batch Normalization je nach Batchgröße leicht unterschiedliches Verhalten zeigen können? | ohne dieses Bewusstsein können unerwartete Leistungsunterschiede zwischen unterschiedlichen Batchgrößen fälschlich als anderes Problem interpretiert werden |

Implementierung: Padding wird konsequent mit einer Attention-Maske kombiniert, die sicherstellt, dass Padding-Positionen keinen inhaltlichen Einfluss auf das Ergebnis haben. Sequenzen werden, wo möglich, nach Länge gruppiert (Bucketing), bevor sie zu Batches zusammengefasst werden, um den notwendigen Padding-Umfang zu minimieren. Die maximale Batchgröße wird explizit anhand des verfügbaren Speichers für Modellaktivierungen kalibriert, mit einem Sicherheitspuffer gegen Speicherüberlauf bei ungewöhnlich langen Sequenzen. Bei Verwendung von Batch Normalization oder ähnlichen batchgrößenabhängigen Layern wird das Modellverhalten explizit bei unterschiedlichen Batchgrößen verglichen, um unerwartete numerische Unterschiede zu erkennen.

## Scalability, Reliability, Security und Observability

Batching skaliert Verarbeitungseffizienz proportional zur Angemessenheit der Padding-Strategie und Batchgrößen-Kalibrierung; die Reliability-Grenze liegt in unstrukturiertem Mischen von Sequenzen stark unterschiedlicher Länge, das mit wachsender Längenvarianz innerhalb einer Batch proportional mehr Padding-Overhead und Speicherdruck erzeugen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| die Inferenz- oder Trainingsgeschwindigkeit ist deutlich langsamer als erwartet, obwohl die Hardware ausreichend dimensioniert scheint | Batches enthalten Sequenzen stark unterschiedlicher Länge, was erheblichen Padding-Overhead erzeugt | die tatsächliche Längenvarianz innerhalb der verwendeten Batches prüfen und Sequenzlängen-Bucketing als Vergleich testen |
| ein Trainings- oder Inferenzlauf schlägt mit einem Speicherüberlauf fehl | die Batchgröße wurde nicht ausreichend an den verfügbaren Speicher für Aktivierungen angepasst, insbesondere bei ungewöhnlich langen Sequenzen | die maximale Sequenzlänge in der fehlgeschlagenen Batch gegen die kalibrierte Speichergrenze prüfen |
| ein Modell mit Batch Normalization zeigt bei unterschiedlichen Batchgrößen leicht unterschiedliche Ergebnisse | die batchgrößenabhängige Statistikberechnung von Batch Normalization erzeugt dieses erwartete Verhalten | das Modellverhalten explizit bei den betroffenen unterschiedlichen Batchgrößen vergleichen und gegen bekannte Batch-Normalization-Effekte einordnen |

Security: Eine unbegrenzte oder unzureichend geprüfte Batchgröße kann bei böswillig sehr langen Eingabesequenzen zu einem Denial-of-Service-Risiko durch übermäßigen Speicherverbrauch führen, insbesondere in Kombination mit der quadratischen Kostenskalierung von Attention (siehe [KB-0333](03-attention-und-positionsinformation.md)). Observability: tatsächlicher Padding-Anteil pro Batch, Speicherverbrauch in Abhängigkeit von Batchgröße und Sequenzlängen sowie Leistungsunterschiede zwischen unterschiedlichen Batchgrößen sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Sequenzlängen-Bucketing zur Reduktion von Padding-Overhead, wo dies praktikabel ist. **Principal** macht Batchgrößen-Kalibrierung und deren Speichergrenzen für das Team nachvollziehbar dokumentiert. **Chief** positioniert Batching als Modellierungsentscheidung mit direkten Speicher- und numerischen Konsequenzen, getrennt von der operativen Serving-Scheduling-Frage.

Anti-Patterns: Sequenzen stark unterschiedlicher Länge ohne Bucketing in derselben Batch mischen; Padding ohne korrekte Attention-Maskierung implementieren; die Batchgröße ohne Berücksichtigung des verfügbaren Speichers für Aktivierungen unbegrenzt erhöhen.

## Production Checklist

- [ ] Padding ist korrekt mit einer Attention-Maske kombiniert.
- [ ] Sequenzlängen-Bucketing reduziert Padding-Overhead, wo praktikabel.
- [ ] Die maximale Batchgröße ist an den verfügbaren Speicher für Aktivierungen kalibriert.
- [ ] Batchgrößenabhängige numerische Effekte (z. B. Batch Normalization) sind bekannt und dokumentiert.

## Interviewfragen

### 1. Warum ist Padding bei der Verarbeitung von Sequenzen unterschiedlicher Länge in einer Batch notwendig?

**Antwort:** Die zugrunde liegende Tensor-Datenstruktur benötigt eine einheitliche Form für alle Elemente einer Batch; Padding füllt kürzere Sequenzen mit speziellen Tokens auf die Länge der längsten Sequenz auf.

### 2. Warum ist eine Attention-Maske bei gepaddeten Sequenzen notwendig?

**Antwort:** Ohne Maskierung könnten die Padding-Positionen, die keine tatsächliche Information enthalten, fälschlich in die Attention-Berechnung einfließen und das Ergebnis verfälschen.

### 3. Was ist Sequenzlängen-Bucketing, und wozu dient es?

**Antwort:** Sequenzen ähnlicher Länge werden in derselben Batch gruppiert, um den notwendigen Padding-Umfang zu reduzieren, der entsteht, wenn Sequenzen stark unterschiedlicher Länge gemischt werden.

### 4. Warum kann Batch Normalization bei unterschiedlichen Batchgrößen unterschiedliches Verhalten zeigen?

**Antwort:** Batch Normalization berechnet Statistiken (Mittelwert, Varianz) basierend auf der tatsächlichen Batch, weshalb unterschiedliche Batchgrößen zu leicht unterschiedlichen berechneten Statistiken und damit leicht unterschiedlichem Modellverhalten führen können.

### 5. Wie diagnostizierst du unerwartet langsame Verarbeitung trotz ausreichender Hardware?

**Antwort:** Ich prüfe die tatsächliche Längenvarianz innerhalb der verwendeten Batches — eine hohe Varianz ohne Sequenzlängen-Bucketing kann erheblichen, unnötigen Padding-Overhead erzeugen.

### 6. Widersprüchliche Anforderung: Team will maximale Batchgröße für höchsten Durchsatz UND garantiert keinen Speicherüberlauf bei beliebig langen Eingabesequenzen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass maximale Batchgröße und unbegrenzte Sequenzlänge sich direkt widersprechen, da der Speicherbedarf mit beiden Faktoren wächst; ich würde vorschlagen, eine maximale Sequenzlänge zu definieren und die Batchgröße dynamisch an die tatsächliche Längenverteilung der aktuellen Batch anzupassen, statt eine feste, maximale Batchgröße unabhängig von der Sequenzlänge zu verwenden.

## Praktische Labs

~~~python
import torch

# Demonstrating padding overhead with and without sequence-length bucketing
def pad_batch(sequences, pad_value=0):
    max_len = max(len(s) for s in sequences)
    padded = torch.full((len(sequences), max_len), pad_value)
    mask = torch.zeros((len(sequences), max_len), dtype=torch.bool)
    for i, seq in enumerate(sequences):
        padded[i, :len(seq)] = torch.tensor(seq)
        mask[i, :len(seq)] = True
    return padded, mask

mixed_length_batch = [[1, 2, 3], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [1, 2]]
bucketed_batch_short = [[1, 2, 3], [1, 2]]
bucketed_batch_long = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]

padded_mixed, _ = pad_batch(mixed_length_batch)
padded_short, _ = pad_batch(bucketed_batch_short)
padded_long, _ = pad_batch(bucketed_batch_long)

mixed_padding_tokens = padded_mixed.numel() - sum(len(s) for s in mixed_length_batch)
bucketed_padding_tokens = (padded_short.numel() - sum(len(s) for s in bucketed_batch_short)) + \
                          (padded_long.numel() - sum(len(s) for s in bucketed_batch_long))

print(f"Mixed-length batch: {mixed_padding_tokens} padding tokens (wasted computation)")
print(f"Bucketed batches: {bucketed_padding_tokens} padding tokens total")
print("Bucketing similar-length sequences significantly reduces padding overhead.")
~~~

## Dependencies, Cross-References und Quellen

1. Hugging Face: [Padding and Truncation Documentation](https://huggingface.co/docs/transformers/pad_truncation), abgerufen 2026-09-17.
2. Ioffe, Szegedy: [Batch Normalization — Accelerating Deep Network Training](https://arxiv.org/abs/1502.03167), abgerufen 2026-09-17.
3. NVIDIA: [Deep Learning Performance Guide — Batching](https://docs.nvidia.com/deeplearning/performance/dl-performance-fully-connected/index.html), abgerufen 2026-09-17.

ML-Inferenz und Ausführung sind kanonisch in [KB-0341](11-ml-inferenz-und-ausfuehrung.md) behandelt; Attention und Positionsinformation (quadratische Kostenskalierung) in [KB-0333](03-attention-und-positionsinformation.md). Serving-Scheduling für dynamisches Batching wird in Domain 17 vertieft.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Continuous Batching (dynamisches Hinzufügen/Entfernen von Sequenzen innerhalb einer laufenden Batch während der Generierung) | Adopting | Gegenüber statischem Batching für signifikant höheren Durchsatz bei generativen Modellen bevorzugen (vertieft in Domain 17). |
| Automatisiertes, adaptives Sequenzlängen-Bucketing basierend auf der tatsächlichen Längenverteilung eingehender Anfragen | Adopting | Gegenüber statisch konfigurierten Bucket-Grenzen für effizientere Anpassung an reale Nutzungsmuster bevorzugen. |

Ein Team akzeptiert eine Batching-Strategie erst, wenn Padding-Overhead, Speicherbedarf und batchgrößenabhängige numerische Effekte dokumentiert und getestet sind.
