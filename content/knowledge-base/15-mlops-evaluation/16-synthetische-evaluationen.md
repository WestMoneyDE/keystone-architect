---
{"id": "KB-0366", "title": "Synthetische Evaluationen", "domain": "15", "sequence": 16, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0365", "concepts": ["Evaluationsdatensätze"], "needed_for": "understanding"}], "related": ["KB-0364"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Mit einem LLM synthetische Testfälle generieren und diese gegen einen kleinen Satz realer Referenzfälle auf Realitätsnähe prüfen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Einen Prozess gestalten, der synthetisch generierte Testfälle vor Aufnahme in einen Evaluationsdatensatz durch unabhängige Prüfung auf unrealistische Verteilungen und Modellpräferenzen filtert.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn synthetisch generierte Testfälle systematisch die Präferenzen oder blinden Flecken des generierenden Modells widerspiegeln, statt tatsächliche Nutzungsvielfalt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Verpflichtende unabhängige Prüfung synthetischer Evaluationen gegen reale Referenzdaten als Standard im Unternehmen etablieren, um verzerrte Testabdeckung zu verhindern.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene, mehrstufige synthetische Generierungspipelines mit iterativer Verfeinerung sind Vertiefung.", "rationale": "Kern ist das Verständnis der Verzerrungsrisiken und der unabhängigen Prüfung, nicht die konkrete Generierungspipeline."}}, "lab_validation": [{"lab_id": "KB-0366-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simulierte synthetische Testfallgenerierung mit anschließendem Vergleich gegen eine kleine Menge realer Referenzfälle", "evidence": "Synthetisch generierte Testfälle konzentrieren sich überproportional auf einfache, häufige Anfragemuster und enthalten kaum die in realen Referenzdaten vorkommenden Randfälle; ein Abgleich gegen die realen Referenzfälle deckt diese Verteilungsverzerrung auf, bevor die synthetischen Fälle ungeprüft in den Evaluationsdatensatz übernommen werden.", "limitations": "Kein produktives Generierungssystem, kein realer Geschäftsdatensatz, kleine simulierte Vergleichsmenge."}]}
---
# Synthetische Evaluationen

> **Ziel:** Synthetische Evaluationen generieren Testfälle mit Hilfe eines Modells statt sie ausschließlich manuell zu kuratieren, um den Umfang eines Evaluationsdatensatzes (siehe [KB-0365](15-evaluationsdatensaetze.md)) effizient zu erweitern. Der zentrale Punkt dieses Kapitels ist, dass synthetisch generierte Testfälle drei spezifischen Verzerrungsrisiken unterliegen — unrealistische Verteilungen, Modellpräferenzen und fehlende Randfälle — die nur durch unabhängige Prüfung gegen reale Referenzdaten zuverlässig begrenzt werden können.

## Zweck, Mental Model und Dependencies

Synthetische Testfallgenerierung nutzt ein LLM, um in kurzer Zeit eine große Anzahl an Testfällen zu erzeugen, was die manuelle Kuration eines vollständigen Evaluationsdatensatzes erheblich beschleunigen kann. Drei spezifische Verzerrungsrisiken treten dabei charakteristisch auf: erstens können unrealistische Verteilungen entstehen, wenn das generierende Modell bestimmte Anfragemuster deutlich häufiger erzeugt, als sie in realen Nutzungsdaten vorkommen (oder umgekehrt reale, häufige Muster unterrepräsentiert). Zweitens können Modellpräferenzen des generierenden Modells (bestimmte Formulierungsstile, Themenbereiche, Komplexitätsniveaus, die dieses Modell "bevorzugt" zu generieren) den synthetischen Datensatz prägen, statt die tatsächliche Vielfalt realer Nutzeranfragen widerzuspiegeln. Drittens fehlen häufig gerade die Randfälle (seltene, aber wichtige Edge Cases), die ein generierendes Modell aufgrund seiner eigenen blinden Flecken oder seiner Tendenz zu "typischen" statt außergewöhnlichen Beispielen nicht von sich aus erzeugt — dies ist besonders problematisch, da Randfälle oft genau die Fälle sind, bei denen ein System am ehesten versagt und deren Testabdeckung daher am wichtigsten wäre. Diese drei Risiken lassen sich nicht durch bloßes Vertrauen in die Generierungsqualität beheben, sondern erfordern eine unabhängige Prüfung: ein Abgleich der synthetischen Testfälle gegen eine kleinere Menge realer Referenzdaten, um Verteilungsabweichungen, Präferenzmuster und fehlende Randfallabdeckung sichtbar zu machen, bevor die synthetischen Fälle ungeprüft in den finalen Evaluationsdatensatz übernommen werden.

~~~text
Synthetic test generation: LLM generates large volume of test cases quickly -> accelerates dataset curation
THREE CHARACTERISTIC BIAS RISKS:
  1. Unrealistic distributions: generating model over/under-represents certain query patterns vs. real usage
  2. Model preferences: generating model's own stylistic/topical/complexity tendencies shape the dataset,
     not actual real-user diversity
  3. Missing edge cases: generating model's blind spots -> rare but important edge cases underrepresented
     -> especially problematic: edge cases are often exactly where systems fail, so their coverage matters most
FIX: cannot be solved by trusting generation quality alone
  -> INDEPENDENT CHECK: compare synthetic cases against a smaller set of REAL reference data
  -> surfaces distribution skew, preference patterns, missing edge-case coverage BEFORE synthetic cases are accepted
~~~

## Core Concepts, Architektur und Implementierung

| Verzerrungsrisiko | Symptom | Gegenmaßnahme durch unabhängige Prüfung |
|---|---|---|
| Unrealistische Verteilungen | bestimmte Anfragemuster sind synthetisch stark über- oder unterrepräsentiert | Verteilung synthetischer Fälle gegen die Verteilung realer Referenzanfragen vergleichen |
| Modellpräferenzen | synthetische Fälle zeigen einen erkennbar einheitlichen Stil/Themenbereich | Stichprobe synthetischer Fälle stilistisch/thematisch gegen reale Referenzfälle vergleichen |
| Fehlende Randfälle | seltene, aber wichtige Edge Cases fehlen im synthetischen Datensatz | bekannte reale Randfälle explizit gegen den synthetischen Datensatz abgleichen und gezielt ergänzen |

Implementierung: Synthetische Testfälle werden mit einem LLM in großem Umfang generiert, jedoch nicht ungeprüft direkt in den finalen Evaluationsdatensatz übernommen. Eine kleinere, sorgfältig kuratierte Menge realer Referenzfälle (einschließlich bekannter Randfälle) dient als unabhängiger Prüfstein: die Verteilung, der Stil und die Abdeckung der synthetischen Fälle werden gegen diese Referenzmenge verglichen. Erkannte Abweichungen (Über-/Unterrepräsentation bestimmter Muster, fehlende Randfälle) werden durch gezielte manuelle Ergänzung oder durch angepasste Generierungsvorgaben korrigiert, bevor der Datensatz final in Entwicklungs- und Abnahmeteil (siehe [KB-0365](15-evaluationsdatensaetze.md)) aufgeteilt wird.

## Scalability, Reliability, Security und Observability

Synthetische Generierung skaliert den Umfang eines Evaluationsdatensatzes proportional zum eingesetzten Generierungsaufwand; die Reliability-Grenze liegt darin, dass unabhängig geprüfte Fälle über die drei genannten Verzerrungsrisiken proportional zur ungeprüften Generierungsmenge zunehmend unrepräsentative Testabdeckung erzeugen können.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein System besteht einen überwiegend synthetisch generierten Evaluationsdatensatz, versagt aber bei realen Randfällen in Produktion | der synthetische Datensatz enthielt keine oder zu wenige der in Produktion tatsächlich auftretenden Randfälle | bekannte, in Produktion aufgetretene Randfälle explizit in den Evaluationsdatensatz aufnehmen und die Evaluation wiederholen |
| die Verteilung der Testfallthemen im synthetischen Datensatz weicht deutlich von der Verteilung realer Nutzeranfragen ab | das generierende Modell hat systematisch bestimmte Themenbereiche über- oder unterrepräsentiert | die Themenverteilung des synthetischen Datensatzes gegen eine Stichprobe realer Anfragen vergleichen und die Generierung entsprechend anpassen |
| synthetische Testfälle zeigen einen auffällig einheitlichen Formulierungsstil | eine Modellpräferenz des generierenden Modells prägt den Stil des gesamten synthetischen Datensatzes | eine Stichprobe stilistisch gegen reale Referenzfälle vergleichen und bei Bedarf mit unterschiedlichen Generierungsvorgaben oder mehreren generierenden Modellen diversifizieren |

Security: Ein Evaluationsdatensatz mit unentdeckten Verzerrungen kann dazu führen, dass ein System für sicherheitsrelevante, aber synthetisch unterrepräsentierte Randfälle fälschlich als ausreichend getestet gilt. Observability: Die gemessene Abweichung zwischen synthetischer Verteilung und realer Referenzverteilung, sowie der Anteil bekannter realer Randfälle, die im finalen Evaluationsdatensatz abgedeckt sind, sind zentrale Qualitätsmetriken.

## Trade-offs und Entscheidungen

**Staff** implementiert eine verpflichtende unabhängige Prüfung synthetischer Testfälle gegen reale Referenzdaten vor deren Aufnahme in den Evaluationsdatensatz. **Principal** macht erkannte Verzerrungen und deren Korrektur für das Team nachvollziehbar. **Chief** etabliert diese unabhängige Prüfung als Standard im Unternehmen, um verzerrte Testabdeckung durch synthetische Generierung zu verhindern.

Anti-Patterns: synthetisch generierte Testfälle ungeprüft direkt in den finalen Evaluationsdatensatz übernehmen; ausschließlich synthetische Fälle ohne jegliche reale Referenzdaten zur Evaluation verwenden; bekannte reale Randfälle bei der Zusammenstellung des Evaluationsdatensatzes vernachlässigen, weil die synthetische Generierung "ausreichend" erscheint.

## Production Checklist

- [ ] Synthetisch generierte Testfälle werden vor Aufnahme gegen eine reale Referenzmenge geprüft.
- [ ] Die Verteilung synthetischer Fälle wird explizit mit der Verteilung realer Anfragen verglichen.
- [ ] Bekannte reale Randfälle sind explizit im finalen Evaluationsdatensatz enthalten, unabhängig von der synthetischen Generierung.
- [ ] Erkannte Verzerrungen (Verteilung, Stil, fehlende Randfälle) werden dokumentiert korrigiert.

## Interviewfragen

### 1. Welche drei charakteristischen Verzerrungsrisiken bestehen bei synthetisch generierten Testfällen?

**Antwort:** Unrealistische Verteilungen (Über-/Unterrepräsentation bestimmter Muster), Modellpräferenzen des generierenden Modells, und fehlende Randfälle aufgrund der blinden Flecken des generierenden Modells.

### 2. Warum ist das Fehlen von Randfällen bei synthetischen Testfällen besonders problematisch?

**Antwort:** Randfälle sind oft genau die Fälle, bei denen ein System am ehesten versagt, weshalb ihre fehlende Testabdeckung ein besonders hohes Risiko für unentdeckte Schwächen darstellt.

### 3. Wie prüfst du, ob ein synthetischer Evaluationsdatensatz verzerrt ist?

**Antwort:** Durch einen Abgleich der Verteilung, des Stils und der Abdeckung synthetischer Fälle gegen eine kleinere Menge sorgfältig kuratierter realer Referenzfälle, einschließlich bekannter Randfälle.

### 4. Warum reicht Vertrauen in die Generierungsqualität allein nicht als Absicherung aus?

**Antwort:** Die drei Verzerrungsrisiken (Verteilung, Präferenz, fehlende Randfälle) sind systematische Eigenschaften des generierenden Modells selbst und werden durch bessere Generierungsqualität allein nicht behoben, sondern nur durch unabhängige Prüfung gegen externe Referenzdaten erkennbar.

### 5. Wie gehst du vor, wenn ein System einen überwiegend synthetischen Evaluationsdatensatz besteht, aber bei realen Randfällen in Produktion versagt?

**Antwort:** Ich nehme die in Produktion aufgetretenen Randfälle explizit in den Evaluationsdatensatz auf und wiederhole die Evaluation, um die tatsächliche Testabdeckung zu verbessern.

### 6. Widersprüchliche Anforderung: Team will schnelle, kostengünstige Skalierung des Evaluationsdatensatzes durch synthetische Generierung UND garantiert repräsentative, unverzerrte Testabdeckung — wie gehst du vor?

**Antwort:** Ich würde synthetische Generierung für die Masse der Testfälle nutzen, um die Skalierung kostengünstig zu erreichen, aber eine feste, unabhängige Prüfung gegen eine sorgfältig kuratierte reale Referenzmenge als obligatorischen Schritt vor der finalen Aufnahme etablieren, sodass Geschwindigkeit und Repräsentativität nicht gegeneinander ausgespielt werden müssen.

## Praktische Labs

~~~python
import random
from collections import Counter

random.seed(0)

# Simulated synthetic generation: skewed toward simple, common topics
synthetic_topics = random.choices(
    ["billing_question", "billing_question", "billing_question", "product_info", "rare_edge_case"],
    weights=[40, 40, 10, 8, 2], k=100,
)

# Real reference distribution (small, curated sample)
real_reference_topics = ["billing_question"] * 40 + ["product_info"] * 30 + ["rare_edge_case"] * 15 + ["account_deletion_request"] * 15

synthetic_dist = Counter(synthetic_topics)
real_dist = Counter(real_reference_topics)

print("Synthetic distribution:", dict(synthetic_dist))
print("Real reference distribution:", dict(real_dist))

missing_in_synthetic = set(real_dist.keys()) - set(synthetic_dist.keys())
print(f"\nTopics present in REAL data but MISSING from synthetic generation: {missing_in_synthetic}")
print("ACTION: manually add representative cases for these missing topics before finalizing the eval dataset.")
~~~

## Dependencies, Cross-References und Quellen

1. Ribeiro et al.: [Beyond Accuracy — Behavioral Testing of NLP Models with CheckList](https://arxiv.org/abs/2005.04118), abgerufen 2026-09-17.
2. Perez et al.: [Red Teaming Language Models with Language Models](https://arxiv.org/abs/2202.03286), abgerufen 2026-09-17.

Evaluationsdatensätze sind kanonisch in [KB-0365](15-evaluationsdatensaetze.md) behandelt; DeepEval und Bewertungsmetriken in [KB-0364](14-deepeval-und-bewertungsmetriken.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Mehrmodell-Generierungsansätze, die synthetische Testfälle aus unterschiedlichen Modellen kombinieren, um Modellpräferenz-Bias zu reduzieren | Evaluating | Gegenüber Generierung durch ein einzelnes Modell abwägen, sobald der zusätzliche Aufwand durch nachweislich diversere Testabdeckung gerechtfertigt ist. |
| Automatisierte Verteilungsvergleichswerkzeuge, die synthetische gegen reale Datensätze statistisch abgleichen | Adopting | Gegenüber manuellem stichprobenartigem Vergleich für systematischere, skalierbare Verzerrungserkennung bevorzugen. |

Ein Team akzeptiert einen überwiegend synthetisch generierten Evaluationsdatensatz erst, wenn eine dokumentierte unabhängige Prüfung gegen reale Referenzdaten keine signifikante Verzerrung zeigt.
