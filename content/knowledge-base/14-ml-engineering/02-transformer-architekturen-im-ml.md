---
{"id": "KB-0332", "title": "Transformer-Architekturen im ML", "domain": "14", "sequence": 2, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0331", "concepts": ["Neuronale Netze und Repräsentationen"], "needed_for": "understanding"}, {"id": "KB-0241", "concepts": ["Transformer für Lösungsarchitekten"], "needed_for": "comparison"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine minimale Encoder- und eine minimale Decoder-Komponente implementieren und deren strukturellen Unterschied in der Attention-Maskierung demonstrieren.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Entscheiden, wann eine Encoder-, Decoder- oder Encoder-Decoder-Architektur für einen konkreten ML-Anwendungsfall (nicht nur reine Textgenerierung) angemessen ist.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein unerwartetes Trainingsverhalten auf eine falsche Attention-Maskierung für die gewählte Architektur statt auf ein allgemeines Datenproblem zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Transformer-Architekturwahl (Encoder, Decoder, autoregressiv) als strukturelle Trainingsentscheidung positionieren, die über die funktionale Betrachtung aus Domain 11 hinausgeht und tatsächliche Trainings- und Parametereigenschaften einschließt.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Positionsencoding-Varianten sind Vertiefung.", "rationale": "Kern ist der strukturelle Unterschied zwischen Encoder-, Decoder- und autoregressiven Architekturen, nicht die konkrete Positionsencoding-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0332-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales PyTorch-Modell einer minimalen autoregressiven Decoder-Komponente mit kausaler Attention-Maskierung im Vergleich zu einer unmaskierten Encoder-Komponente", "evidence": "Eine kausale Attention-Maske verhindert, dass ein Decoder-Token auf zukünftige Tokens zugreift, was für autoregressive Textgenerierung notwendig ist; eine Encoder-Komponente ohne diese Maskierung kann bidirektional auf die gesamte Eingabesequenz zugreifen, was für Verständnisaufgaben geeignet, für autoregressive Generierung aber ungeeignet ist.", "limitations": "Kein produktives Trainingssystem, kein großer Datensatz, keine reale GPU-Infrastruktur getestet."}]}
---
# Transformer-Architekturen im ML

> **Ziel:** Encoder-, Decoder- und autoregressive Transformer-Architekturen unterscheiden sich strukturell in ihrer Attention-Maskierung, Parameterstruktur und Trainingseigenschaften. Während Domain 11 ([KB-0241](../11-genai-architecture/01-transformer-fuer-loesungsarchitekten.md)) Transformer funktional aus Anwendungsperspektive erklärt (Attention, Tokenvorhersage, Modellkapazität für Anwendungsentscheidungen), vertieft diese Datei die tatsächliche strukturelle und trainingsbezogene Unterscheidung dieser Architekturtypen auf ML-Engineering-Ebene.

## Zweck, Mental Model und Dependencies

Ein Encoder verarbeitet eine gesamte Eingabesequenz bidirektional — jedes Token kann auf alle anderen Tokens der Sequenz zugreifen (sowohl davor als auch danach), was Encoder für Verständnisaufgaben geeignet macht, bei denen der vollständige Kontext einer Eingabe gleichzeitig verfügbar ist (z. B. Klassifikation, Embedding-Erzeugung). Ein Decoder verwendet hingegen eine kausale Attention-Maskierung — jedes Token kann nur auf sich selbst und vorherige Tokens zugreifen, nicht auf zukünftige, was für autoregressive Generierung notwendig ist, bei der ein Modell Token für Token erzeugt und dabei nicht auf Information zugreifen darf, die es selbst erst noch generieren soll. Ein autoregressives Modell (die für moderne Sprachmodelle dominante Architektur) baut auf dieser Decoder-Struktur auf und erzeugt eine Ausgabesequenz iterativ, wobei jedes neu generierte Token von allen vorherigen abhängt. Der zentrale, oft übersehene strukturelle Unterschied zur funktionalen Betrachtung aus Domain 11 ist, dass die Wahl zwischen Encoder-, Decoder- und Encoder-Decoder-Architekturen direkte Auswirkungen auf Trainingseigenschaften hat: ein reiner Encoder wird typischerweise mit einem Masked-Language-Modeling-Ziel trainiert (zufällig maskierte Tokens vorhersagen), während ein Decoder mit einem Next-Token-Prediction-Ziel trainiert wird — diese unterschiedlichen Trainingsziele erfordern unterschiedliche Datenaufbereitung und beeinflussen, welche Art von nachgelagerten Aufgaben das resultierende Modell nativ am besten löst.

~~~text
Encoder: BIDIRECTIONAL attention -> every token sees ALL others (before AND after) -> good for understanding tasks
Decoder: CAUSAL (masked) attention -> token sees only itself + PREVIOUS tokens -> required for autoregressive generation
Autoregressive model: decoder-based, generates output iteratively, each new token depends on all previous ones
STRUCTURAL DIFFERENCE beyond Domain 11's functional view (KB-0241):
  Encoder training objective: masked language modeling (predict randomly masked tokens)
  Decoder training objective: next-token prediction
  -> different objectives require different data prep, shape which downstream tasks the model natively solves best
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Korrekte Attention-Maskierung für den Architekturtyp | verwendet ein Decoder eine kausale Maske, die zukünftige Tokens ausblendet, während ein Encoder bidirektional zugreifen kann? | eine fehlende kausale Maskierung in einem Decoder kann während des Trainings Informationslecks aus zukünftigen Tokens erzeugen ("Cheating") |
| Passendes Trainingsziel für den Architekturtyp | wird ein Encoder mit Masked-Language-Modeling und ein Decoder mit Next-Token-Prediction trainiert, statt ein unpassendes Ziel zu verwenden? | ein unpassendes Trainingsziel kann die native Eignung des Modells für bestimmte nachgelagerte Aufgaben erheblich beeinträchtigen |
| Begründete Architekturwahl je nach Aufgabentyp | wurde die Wahl zwischen Encoder-, Decoder- und Encoder-Decoder-Architektur anhand der tatsächlichen Aufgabe (Verständnis vs. Generierung vs. Übersetzung) getroffen? | eine unpassende Architekturwahl kann zu suboptimaler Leistung führen, selbst bei ansonsten korrektem Training |
| Parameterstruktur-Verständnis für Kapazitätsplanung | ist bekannt, wie sich Parameteranzahl auf Attention-Layer, Feed-Forward-Layer und Embedding-Schichten verteilt? | ohne dieses Verständnis kann eine Kapazitätsplanung (z. B. für Fine-Tuning-Ressourcen) ungenau ausfallen |

Implementierung: Für Verständnisaufgaben (Klassifikation, Embedding-Erzeugung, siehe Embeddings für Retrieval, Domain 13) wird eine Encoder-Architektur mit bidirektionaler Attention und Masked-Language-Modeling-Training gewählt. Für generative Aufgaben (Textfortsetzung, Chat) wird eine Decoder-Architektur mit kausaler Attention-Maskierung und Next-Token-Prediction-Training gewählt. Für Sequenz-zu-Sequenz-Aufgaben (Übersetzung, Zusammenfassung mit stark unterschiedlicher Eingabe-/Ausgabestruktur) kann eine kombinierte Encoder-Decoder-Architektur eingesetzt werden, bei der der Encoder die Eingabe bidirektional verarbeitet und der Decoder die Ausgabe autoregressiv unter Einbeziehung der Encoder-Repräsentation generiert. Die kausale Maskierung eines Decoders wird technisch als additive Maske mit negativ unendlichen Werten für zukünftige Positionen vor der Softmax-Berechnung der Attention-Gewichte implementiert.

## Scalability, Reliability, Security und Observability

Transformer-Architekturwahl skaliert Eignung für die jeweilige Aufgabenklasse proportional zur Übereinstimmung zwischen Architekturtyp und Trainingsziel; die Reliability-Grenze liegt in einer fehlerhaften Attention-Maskierung, die bei einem Decoder-Modell während des Trainings zu einem Informationsleck aus zukünftigen Tokens führen kann, was zu einer trügerisch guten Trainingsleistung führt, die sich bei tatsächlicher autoregressiver Generierung nicht reproduzieren lässt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Decoder-Modell zeigt während des Trainings eine unrealistisch gute Leistung, die sich bei tatsächlicher Generierung nicht reproduzieren lässt | die kausale Attention-Maskierung fehlt oder ist fehlerhaft implementiert, wodurch das Modell während des Trainings auf zukünftige Tokens zugreifen konnte | die Implementierung der Attention-Maske explizit prüfen, ob zukünftige Positionen tatsächlich ausgeblendet werden |
| ein für Verständnisaufgaben trainiertes Modell zeigt bei generativen Aufgaben schlechte Ergebnisse | eine Encoder-Architektur mit Masked-Language-Modeling wurde für eine tatsächlich generative Aufgabe eingesetzt | prüfen, ob die gewählte Architektur (Encoder vs. Decoder) zur tatsächlichen Aufgabenklasse passt |
| eine Kapazitätsschätzung für Fine-Tuning-Ressourcen weicht deutlich von der tatsächlichen Ressourcennutzung ab | die Parameterverteilung über Attention-, Feed-Forward- und Embedding-Schichten wurde bei der Schätzung nicht korrekt berücksichtigt | die tatsächliche Parameterverteilung des konkreten Modells gegen die Schätzungsannahmen prüfen |

Security: Ein Encoder-Modell mit bidirektionalem Zugriff auf die gesamte Eingabesequenz kann bei der Verarbeitung sensibler Daten eine größere Angriffsfläche für Membership-Inference-Angriffe bieten als ein reines Decoder-Modell, da die vollständige bidirektionale Repräsentation potenziell mehr Information über einzelne Trainingsdatenpunkte kodiert. Observability: Trainingsverlust getrennt für maskierte versus kausale Trainingsziele, Attention-Musterverteilung während des Trainings und tatsächliche Parameterverteilung über Modellschichten sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Attention-Maskierung konsequent passend zum gewählten Architekturtyp. **Principal** macht die Architekturwahl (Encoder vs. Decoder vs. Encoder-Decoder) für das Team nachvollziehbar begründet dokumentiert. **Chief** positioniert Transformer-Architekturwahl als strukturelle Trainingsentscheidung, die über die funktionale Anwendungsperspektive hinausgeht.

Anti-Patterns: eine Decoder-Architektur ohne korrekte kausale Attention-Maskierung trainieren; eine Encoder-Architektur für eine tatsächlich generative Aufgabe einsetzen; Kapazitätsplanung ohne Berücksichtigung der tatsächlichen Parameterverteilung über Modellschichten vornehmen.

## Production Checklist

- [ ] Decoder-Architekturen verwenden korrekt implementierte kausale Attention-Maskierung.
- [ ] Das Trainingsziel (Masked Language Modeling vs. Next-Token-Prediction) passt zum gewählten Architekturtyp.
- [ ] Die Architekturwahl ist anhand der tatsächlichen Aufgabenklasse begründet.
- [ ] Parameterverteilung über Attention-, Feed-Forward- und Embedding-Schichten ist für Kapazitätsplanung bekannt.

## Interviewfragen

### 1. Was ist der strukturelle Unterschied zwischen Encoder- und Decoder-Attention?

**Antwort:** Ein Encoder verwendet bidirektionale Attention, bei der jedes Token auf alle anderen Tokens der Sequenz zugreifen kann; ein Decoder verwendet kausale Attention, bei der jedes Token nur auf sich selbst und vorherige Tokens zugreifen kann.

### 2. Warum ist kausale Attention-Maskierung für autoregressive Generierung notwendig?

**Antwort:** Ohne sie könnte ein Modell während des Trainings auf zukünftige Tokens zugreifen, die es zur Inferenzzeit selbst erst noch generieren müsste, was zu einem Informationsleck und einer trügerisch guten Trainingsleistung führt.

### 3. Welche unterschiedlichen Trainingsziele werden für Encoder und Decoder typischerweise verwendet?

**Antwort:** Encoder werden typischerweise mit Masked-Language-Modeling (zufällig maskierte Tokens vorhersagen) trainiert, Decoder mit Next-Token-Prediction (das nächste Token in der Sequenz vorhersagen).

### 4. Wann ist eine Encoder-Decoder-Architektur gegenüber einer reinen Encoder- oder Decoder-Architektur angemessen?

**Antwort:** Bei Sequenz-zu-Sequenz-Aufgaben mit stark unterschiedlicher Eingabe-/Ausgabestruktur (z. B. Übersetzung), bei denen der Encoder die Eingabe bidirektional verarbeitet und der Decoder die Ausgabe autoregressiv unter Einbeziehung der Encoder-Repräsentation generiert.

### 5. Wie diagnostizierst du ein Informationsleck durch fehlerhafte Attention-Maskierung?

**Antwort:** Ich prüfe, ob die Trainingsleistung eines Decoder-Modells unrealistisch gut erscheint, verglichen mit der tatsächlichen Generierungsleistung, und verifiziere direkt die Implementierung der Attention-Maske auf korrekte Ausblendung zukünftiger Positionen.

### 6. Widersprüchliche Anforderung: Team will ein einziges Modell, das sowohl exzellente bidirektionale Verständnisaufgaben als auch exzellente autoregressive Generierung beherrscht, ohne separate Architekturen zu pflegen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass bidirektionale und kausale Attention strukturell unterschiedliche Eigenschaften haben, die sich nicht ohne Kompromisse in einer einzigen Attention-Struktur vereinen lassen; ich würde vorschlagen, entweder eine Encoder-Decoder-Architektur zu verwenden, die beide Attention-Typen kombiniert, oder je nach dominierendem Anwendungsfall eine Architektur zu priorisieren und die andere Aufgabenklasse mit einem separaten, spezialisierten Modell abzudecken.

## Praktische Labs

~~~python
import torch

# Demonstrating causal masking (decoder) vs unmasked attention (encoder)
def scaled_dot_product_attention(query, key, value, causal_mask=False):
    seq_len = query.shape[0]
    scores = query @ key.T / (query.shape[-1] ** 0.5)
    if causal_mask:
        mask = torch.triu(torch.ones(seq_len, seq_len), diagonal=1).bool()
        scores = scores.masked_fill(mask, float('-inf'))  # block access to FUTURE positions
    attention_weights = torch.softmax(scores, dim=-1)
    return attention_weights @ value, attention_weights

torch.manual_seed(0)
seq = torch.randn(4, 8)  # 4 tokens, 8-dim representation

_, encoder_weights = scaled_dot_product_attention(seq, seq, seq, causal_mask=False)
_, decoder_weights = scaled_dot_product_attention(seq, seq, seq, causal_mask=True)

print("Encoder attention weights (bidirectional, token 0 attends to ALL positions):")
print(encoder_weights[0].round(decimals=2))

print("\nDecoder attention weights (causal, token 0 attends ONLY to itself, position 0):")
print(decoder_weights[0].round(decimals=2))
print("\nToken 2 in decoder attends only to positions 0-2, never position 3 (future):")
print(decoder_weights[2].round(decimals=2))
~~~

## Dependencies, Cross-References und Quellen

1. Vaswani et al.: [Attention Is All You Need](https://arxiv.org/abs/1706.03762), abgerufen 2026-09-17.
2. Devlin et al.: [BERT — Pre-training of Deep Bidirectional Transformers](https://arxiv.org/abs/1810.04805), abgerufen 2026-09-17.
3. Radford et al.: [Improving Language Understanding by Generative Pre-Training (GPT)](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf), abgerufen 2026-09-17.

Neuronale Netze und Repräsentationen sind kanonisch in [KB-0331](01-neuronale-netze-und-repraesentationen.md) behandelt; die funktionale Architekten-Perspektive auf Transformer in [KB-0241](../11-genai-architecture/01-transformer-fuer-loesungsarchitekten.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Effizientere Attention-Varianten (z. B. FlashAttention), die exakte Attention-Berechnung bei reduziertem Speicherverbrauch ermöglichen | Adopting | Gegenüber Standard-Attention-Implementierungen für Trainingseffizienz bei langen Sequenzen bevorzugen. |
| Hybride Architekturen, die selektiv bidirektionale und kausale Attention innerhalb eines Modells kombinieren (z. B. Prefix-LM-Ansätze) | Emerging | Beobachten; vielversprechend für Aufgaben mit gemischten Verständnis-/Generierungsanforderungen, aber noch nicht breit etabliert. |

Ein Team akzeptiert eine Transformer-Architekturwahl erst, wenn Attention-Maskierung, Trainingsziel und Architekturtyp nachweislich zur tatsächlichen Aufgabenklasse passen.
