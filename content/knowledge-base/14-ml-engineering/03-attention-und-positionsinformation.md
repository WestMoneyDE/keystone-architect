---
{"id": "KB-0333", "title": "Attention und Positionsinformation", "domain": "14", "sequence": 3, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0332", "concepts": ["Transformer-Architekturen im ML"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Query-, Key- und Value-Projektionen sowie Positionskodierung von Grund auf implementieren und die quadratische Kostenskalierung mit wachsender Sequenzlänge empirisch messen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Entscheiden, wann alternative Attention-Ansätze (lokale Attention, Sparse Attention) gegenüber vollständiger Attention für lange Sequenzen angemessen sind, basierend auf der tatsächlichen quadratischen Kostenskalierung.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen unerwarteten Speicher- oder Latenzanstieg bei wachsender Sequenzlänge auf die quadratische Kostenskalierung von Standard-Attention statt auf ein allgemeines Infrastrukturproblem zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Attention-Mechanismuswahl als Kapazitäts- und Kostenentscheidung positionieren, die mit wachsender Sequenzlänge quadratisch skaliert und daher explizit gegen alternative Ansätze abgewogen werden muss.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Sparse-Attention-Implementierungsdetails sind Vertiefung.", "rationale": "Kern ist das Verständnis der quadratischen Kostenskalierung und deren Konsequenzen, nicht die konkrete Sparse-Attention-Algorithmik."}}, "lab_validation": [{"lab_id": "KB-0333-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales PyTorch-Modell der Attention-Berechnung mit empirischer Messung der Rechenkosten bei verdoppelter Sequenzlänge", "evidence": "Eine Verdopplung der Sequenzlänge führt zu einer Vervierfachung der für die Attention-Matrix benötigten Rechenoperationen und des Speicherbedarfs, was die quadratische Kostenskalierung konkret demonstriert.", "limitations": "Kein produktives Trainingssystem, keine reale GPU-Infrastruktur, keine große Sequenzlänge getestet."}]}
---
# Attention und Positionsinformation

> **Ziel:** Query, Key und Value sind die drei gelernten Projektionen, die den Attention-Mechanismus eines Transformers berechnen (aufbauend auf Transformer-Architekturen, siehe [KB-0332](02-transformer-architekturen-im-ml.md)). Positionskodierung liefert dem Modell Information über die Reihenfolge der Tokens, die der Attention-Mechanismus selbst nicht inhärent kodiert. Der zentrale Punkt ist, dass Standard-Attention quadratisch mit der Sequenzlänge skaliert — eine Verdopplung der Sequenzlänge vervierfacht die Rechenkosten —, was lokale und alternative Attention-Ansätze für lange Sequenzen notwendig macht.

## Zweck, Mental Model und Dependencies

Query, Key und Value sind drei separate, gelernte lineare Projektionen derselben Eingabe-Repräsentation. Die Query eines Tokens wird gegen die Keys aller Tokens der Sequenz verglichen (über ein Skalarprodukt), um zu bestimmen, wie relevant jedes andere Token für das aktuelle Token ist — diese Relevanzwerte werden normalisiert (Softmax) und dienen als Gewichte, mit denen die Values aller Tokens kombiniert werden, um die neue Repräsentation des aktuellen Tokens zu erzeugen. Der zentrale, oft übersehene Kostenfaktor ist, dass diese Berechnung für jedes Token-Paar der Sequenz durchgeführt wird — bei einer Sequenzlänge von n Tokens entstehen n² Query-Key-Vergleiche, was bedeutet, dass sowohl Rechenzeit als auch Speicherbedarf quadratisch mit der Sequenzlänge wachsen. Positionskodierung ist notwendig, weil der Attention-Mechanismus selbst permutationsinvariant ist — ohne zusätzliche Information würde eine Umordnung der Eingabetokens zum selben Ergebnis führen, was für Sprache offensichtlich falsch wäre, da die Reihenfolge der Wörter Bedeutung trägt. Positionskodierung fügt daher explizite Information über die Position jedes Tokens hinzu, entweder als additive Einbettung (klassische sinusförmige Positionskodierung) oder als relative Modifikation der Attention-Berechnung selbst (z. B. Rotary Position Embeddings). Aufgrund der quadratischen Kostenskalierung werden für sehr lange Sequenzen alternative Ansätze eingesetzt: lokale Attention beschränkt jedes Token darauf, nur mit einem begrenzten Fenster benachbarter Tokens zu interagieren, was die Kosten linear statt quadratisch skalieren lässt, aber die Fähigkeit einschränkt, sehr weit entfernte Abhängigkeiten direkt zu erfassen.

~~~text
Query, Key, Value: three learned linear projections of the same input representation
  Query of token X compared against Keys of ALL tokens -> relevance scores (dot product)
  Softmax-normalized scores weight the Values -> new representation of token X
COST: computed for EVERY token pair -> n tokens = n² comparisons -> QUADRATIC compute AND memory scaling
  -> doubling sequence length QUADRUPLES the cost
Position encoding: attention itself is PERMUTATION-INVARIANT -> needs explicit position info
  (additive sinusoidal embedding OR relative modification like Rotary Position Embeddings)
Alternatives for long sequences: local attention -> limited window -> LINEAR scaling, but limits direct long-range dependencies
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Verständnis der quadratischen Kostenskalierung | ist bekannt, dass eine Verdopplung der Sequenzlänge die Attention-Rechenkosten vervierfacht, nicht nur verdoppelt? | eine falsche Kostenannahme (lineare statt quadratische Skalierung) kann zu erheblich unterschätztem Ressourcenbedarf bei langen Sequenzen führen |
| Notwendigkeit expliziter Positionskodierung | wird explizite Positionsinformation bereitgestellt, da der Attention-Mechanismus selbst permutationsinvariant ist? | ohne Positionskodierung kann das Modell die Reihenfolge der Tokens nicht berücksichtigen, was für sprachliche Bedeutung essenziell ist |
| Begründete Wahl zwischen vollständiger und alternativer Attention | wurde für lange Sequenzen explizit geprüft, ob lokale oder alternative Attention-Ansätze gegenüber vollständiger Attention angemessen sind? | eine ungeprüfte Verwendung vollständiger Attention bei sehr langen Sequenzen kann zu unpraktikablem Speicher- und Rechenbedarf führen |
| Trade-off zwischen Kosteneinsparung und Fernabhängigkeiten bei lokaler Attention | ist bewusst abgewogen, welcher Verlust an direkter Erfassung weit entfernter Abhängigkeiten durch lokale Attention für den Anwendungsfall akzeptabel ist? | eine unkritische Anwendung lokaler Attention kann bei Aufgaben, die tatsächlich weitreichende Abhängigkeiten benötigen, die Modellqualität beeinträchtigen |

Implementierung: Query-, Key- und Value-Projektionen werden als separate, gelernte lineare Transformationen der Eingabe-Repräsentation implementiert. Positionskodierung wird explizit hinzugefügt, entweder additiv zur Eingabe-Embedding oder als relative Modifikation innerhalb der Attention-Berechnung. Bei der Verarbeitung langer Sequenzen wird die tatsächliche Rechenkosten- und Speicherbedarfsskalierung explizit gegen die verfügbare Infrastruktur geprüft, bevor vollständige Attention über die gesamte Sequenz eingesetzt wird. Für sehr lange Sequenzen, bei denen vollständige Attention unpraktikabel ist, werden lokale oder alternative Attention-Ansätze eingesetzt, mit einer expliziten Bewertung, welcher Verlust an direkter Erfassung weit entfernter Abhängigkeiten für den konkreten Anwendungsfall akzeptabel ist.

## Scalability, Reliability, Security und Observability

Attention-Mechanismen skalieren Modellierungsfähigkeit für Abhängigkeiten zwischen Tokens quadratisch mit der Sequenzlänge; die Reliability-Grenze liegt in einer ungeprüften Anwendung vollständiger Attention auf sehr lange Sequenzen, die proportional zur Sequenzlänge quadratisch wachsenden Speicher- und Rechenbedarf erzeugt und bei ausreichender Länge zu praktischer Unmöglichkeit führen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Speicherbedarf oder Trainingszeit wachsen bei zunehmender Sequenzlänge deutlich stärker als erwartet | die quadratische Kostenskalierung von Standard-Attention wurde bei der Ressourcenplanung nicht berücksichtigt | den tatsächlichen Speicher- und Rechenbedarf gegen die quadratische Skalierungsformel für die verwendete Sequenzlänge vergleichen |
| ein Modell berücksichtigt die Reihenfolge der Eingabetokens nicht korrekt | fehlende oder fehlerhafte Positionskodierung | prüfen, ob eine explizite Positionskodierung implementiert und korrekt mit der Eingabe-Repräsentation kombiniert wurde |
| ein Modell mit lokaler Attention verfehlt Aufgaben, die weitreichende Abhängigkeiten zwischen weit entfernten Tokens benötigen | die gewählte Fenstergröße der lokalen Attention ist zu klein für die tatsächlich benötigten Abhängigkeitsreichweiten | prüfen, ob die typische Distanz relevanter Abhängigkeiten in der Aufgabe die gewählte lokale Fenstergröße überschreitet |

Security: Sehr lange Eingabesequenzen können bei vollständiger Attention zu einem Denial-of-Service-Risiko werden, wenn ein Angreifer gezielt extrem lange Eingaben sendet, um durch die quadratische Kostenskalierung übermäßigen Ressourcenverbrauch zu erzwingen — eine Begrenzung der maximalen Eingabesequenzlänge ist daher auch eine Sicherheitsmaßnahme. Observability: tatsächlicher Speicher- und Rechenzeitverbrauch in Abhängigkeit von der Sequenzlänge, Verteilung der Attention-Gewichte über Tokendistanzen und Trainingsverlust bei unterschiedlichen Positionskodierungsstrategien sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** prüft die quadratische Kostenskalierung explizit gegen die tatsächliche Sequenzlänge, bevor vollständige Attention eingesetzt wird. **Principal** macht die Wahl zwischen vollständiger und alternativer Attention für das Team nachvollziehbar begründet dokumentiert. **Chief** positioniert Attention-Mechanismuswahl als Kapazitäts- und Kostenentscheidung, die explizit gegen die erwartete Sequenzlänge abgewogen werden muss.

Anti-Patterns: vollständige Attention ohne Prüfung der quadratischen Kostenskalierung auf sehr lange Sequenzen anwenden; ein Modell ohne explizite Positionskodierung trainieren; lokale Attention ohne Bewertung des Verlusts an weitreichenden Abhängigkeiten für den konkreten Anwendungsfall einsetzen.

## Production Checklist

- [ ] Die quadratische Kostenskalierung von Attention ist bei der Ressourcenplanung explizit berücksichtigt.
- [ ] Positionskodierung ist explizit implementiert und korrekt mit der Eingabe-Repräsentation kombiniert.
- [ ] Für lange Sequenzen ist die Wahl zwischen vollständiger und alternativer Attention begründet.
- [ ] Die maximale Eingabesequenzlänge ist begrenzt, um übermäßigen Ressourcenverbrauch zu verhindern.

## Interviewfragen

### 1. Wie berechnet der Attention-Mechanismus die Relevanz zwischen Tokens?

**Antwort:** Die Query eines Tokens wird über ein Skalarprodukt gegen die Keys aller Tokens verglichen, die resultierenden Werte werden normalisiert (Softmax) und dienen als Gewichte für die Kombination der Values aller Tokens.

### 2. Warum skaliert Standard-Attention quadratisch mit der Sequenzlänge?

**Antwort:** Die Relevanzberechnung erfolgt für jedes Token-Paar der Sequenz; bei n Tokens entstehen n² Vergleiche, wodurch sowohl Rechenzeit als auch Speicherbedarf quadratisch mit der Sequenzlänge wachsen.

### 3. Warum benötigt ein Transformer explizite Positionskodierung?

**Antwort:** Der Attention-Mechanismus selbst ist permutationsinvariant — ohne explizite Positionsinformation würde eine Umordnung der Eingabetokens zum selben Ergebnis führen, was für sprachliche Bedeutung falsch wäre.

### 4. Welchen Trade-off geht lokale Attention gegenüber vollständiger Attention ein?

**Antwort:** Lokale Attention skaliert linear statt quadratisch mit der Sequenzlänge, schränkt aber die Fähigkeit ein, sehr weit entfernte Abhängigkeiten zwischen Tokens direkt zu erfassen.

### 5. Wie diagnostizierst du einen unerwartet hohen Ressourcenverbrauch bei wachsender Sequenzlänge?

**Antwort:** Ich vergleiche den tatsächlichen Speicher- und Rechenzeitverbrauch gegen die erwartete quadratische Skalierungsformel für die verwendete Sequenzlänge — ein deutlich stärkerer Anstieg als quadratisch erwartet deutet auf ein zusätzliches, separates Problem hin.

### 6. Widersprüchliche Anforderung: Team will ein Modell, das beliebig lange Sequenzen mit vollständiger, uneingeschränkter Attention über alle Tokens verarbeitet UND garantiert konstante, vorhersehbare Rechenkosten unabhängig von der Sequenzlänge — wie gehst du vor?

**Antwort:** Ich würde erklären, dass vollständige Attention über beliebig lange Sequenzen und konstante Rechenkosten sich strukturell widersprechen, da die quadratische Skalierung mathematisch inhärent ist; ich würde vorschlagen, eine maximale Sequenzlänge zu definieren, innerhalb derer vollständige Attention praktikabel bleibt, und für längere Eingaben auf lokale oder alternative Attention-Ansätze mit linearer Skalierung umzusteigen, statt konstante Kosten bei unbegrenzter Sequenzlänge zu versprechen.

## Praktische Labs

~~~python
import torch
import time

# Empirically measuring quadratic scaling of attention with sequence length
def attention_forward_pass(seq_len, dim=64):
    query = torch.randn(seq_len, dim)
    key = torch.randn(seq_len, dim)
    value = torch.randn(seq_len, dim)
    scores = query @ key.T / (dim ** 0.5)  # O(seq_len^2) operations here
    weights = torch.softmax(scores, dim=-1)
    return weights @ value

for seq_len in [256, 512, 1024, 2048]:
    start = time.time()
    for _ in range(20):
        attention_forward_pass(seq_len)
    elapsed = time.time() - start
    memory_estimate = seq_len ** 2 * 4 / (1024 ** 2)  # bytes for float32 attention matrix, in MB
    print(f"seq_len={seq_len}: time={elapsed:.4f}s, attention matrix memory={memory_estimate:.2f} MB")

print("\nDoubling sequence length roughly quadruples both compute time and attention matrix memory.")
~~~

## Dependencies, Cross-References und Quellen

1. Vaswani et al.: [Attention Is All You Need](https://arxiv.org/abs/1706.03762), abgerufen 2026-09-17.
2. Su et al.: [RoFormer — Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864), abgerufen 2026-09-17.
3. Beltagy et al.: [Longformer — The Long-Document Transformer](https://arxiv.org/abs/2004.05150), abgerufen 2026-09-17.

Transformer-Architekturen im ML sind kanonisch in [KB-0332](02-transformer-architekturen-im-ml.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| FlashAttention und verwandte speichereffiziente exakte Attention-Implementierungen, die die quadratische Rechenkomplexität beibehalten, aber Speicherbedarf drastisch reduzieren | Adopting | Gegenüber naiver Attention-Implementierung für signifikant reduzierten Speicherbedarf bei gleicher Genauigkeit bevorzugen. |
| Lineare-Aufmerksamkeit- und State-Space-Modell-Ansätze (z. B. Mamba-artige Architekturen) als Alternative zu quadratischer Attention für sehr lange Sequenzen | Emerging | Beobachten; vielversprechend für extrem lange Kontexte, aber Reifegrad und breite Anwendbarkeit noch nicht ausreichend belegt. |

Ein Team akzeptiert eine Attention-Mechanismuswahl erst, wenn die Kostenskalierung gegen die erwartete Sequenzlänge explizit geprüft und dokumentiert ist.
