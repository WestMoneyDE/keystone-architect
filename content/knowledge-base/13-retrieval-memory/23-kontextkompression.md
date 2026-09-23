---
{"id": "KB-0327", "title": "Kontextkompression", "domain": "13", "sequence": 23, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0316", "concepts": ["Kontextzusammenstellung"], "needed_for": "understanding"}], "related": ["KB-0326"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Extraktive und generative Kompression desselben Textes implementieren und deren Auswirkung auf eine nachgelagerte, detailabhängige Aufgabe vergleichen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Kompressionsstrategie wählen, die anhand der tatsächlichen nachgelagerten Aufgabenqualität statt anhand reiner Kompressionsrate bewertet wird, und Quellenreferenzen sowie relevante Ausnahmen explizit erhält.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine fehlerhafte nachgelagerte Antwort auf einen bei Kompression verlorenen, entscheidenden Detailwert oder eine verlorene Ausnahme statt auf ein allgemeines Modellproblem zurückführen können.", "rationale": "Generative Kompression insbesondere kann relevante Details oder seltene Ausnahmefälle beim Verdichten verlieren, wenn sie nicht explizit für den Erhalt kritischer Details ausgelegt ist."}, "CHIEF-TARGET": {"active": true, "scope": "Kontextkompression als Effizienzmaßnahme mit messbarem Qualitätsrisiko positionieren, deren Erfolg anhand der tatsächlichen nachgelagerten Aufgabenqualität, nicht anhand der Kompressionsrate allein bewertet wird.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete generative Kompressionsmodelle sind Vertiefung.", "rationale": "Kern ist die Abwägung zwischen Kompressionsrate und Aufgabenqualität, nicht das konkrete Kompressionsmodell."}}, "lab_validation": [{"lab_id": "KB-0327-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell von extraktiver und generativer Kompression mit Vergleich anhand einer detailabhängigen Testaufgabe", "evidence": "Eine extraktive Kompression, die zentrale Sätze wortwörtlich beibehält, erhält eine kritische Ausnahmeregel vollständig; eine simulierte generative Kompression, die den Text umformuliert, lässt die spezifische Ausnahme in der verdichteten Zusammenfassung weg.", "limitations": "Kein echtes Kompressionsmodell, kein produktives System, keine reale Aufgabenqualitätsmessung."}]}
---
# Kontextkompression

> **Ziel:** Kontextkompression verdichtet Inhalte, die bereits in den Kontext zusammengestellt wurden (siehe [KB-0316](12-kontextzusammenstellung.md)), um Tokenbudget einzusparen. Extraktive Kompression (wortwörtliche Auswahl der wichtigsten Sätze) und generative Kompression (Umformulierung zu einer kürzeren Zusammenfassung) haben unterschiedliche Risikoprofile für Detailverlust, Ausnahmenverlust und Quellenreferenzerhalt — der zentrale Bewertungsmaßstab ist die tatsächliche nachgelagerte Aufgabenqualität, nicht die reine Kompressionsrate.

## Zweck, Mental Model und Dependencies

Extraktive Kompression wählt die wichtigsten Sätze oder Passagen wortwörtlich aus dem Originaltext aus und verwirft den Rest — dies erhält den exakten Wortlaut der ausgewählten Teile, einschließlich präziser Details, Zahlen und Ausnahmeformulierungen, verliert aber vollständig alles, was nicht ausgewählt wurde. Generative Kompression nutzt ein Sprachmodell, um den Inhalt in eigenen Worten kürzer zusammenzufassen — dies kann Information aus dem gesamten Text integrieren, birgt aber das Risiko, dass die generative Umformulierung spezifische Details, Zahlen oder seltene Ausnahmefälle unbeabsichtigt weglässt oder ungenau wiedergibt, da ein Sprachmodell bei der Zusammenfassung tendenziell allgemeine, häufige Muster stärker gewichtet als seltene Sonderfälle. Der zentrale, oft übersehene Bewertungsfehler ist, Kompressionsqualität allein anhand der Kompressionsrate (wie viele Tokens wurden eingespart) zu bewerten, statt anhand der tatsächlichen Qualität einer nachgelagerten Aufgabe, die auf dem komprimierten Kontext basiert — eine sehr hohe Kompressionsrate, die eine entscheidende Ausnahmeregel verliert, kann eine nachgelagerte Aufgabe (z. B. eine Anfrage, die genau diese Ausnahme betrifft) zum Scheitern bringen, selbst wenn die Kompression insgesamt sehr effizient erscheint. Quellenreferenzen (siehe Zitationen, [KB-0317](13-zitationen-und-provenienz.md)) müssen bei beiden Kompressionsarten erhalten bleiben, damit eine komprimierte Aussage weiterhin auf ihre ursprüngliche Quelle zurückverfolgt werden kann, auch nach Verdichtung.

~~~text
Extractive compression: verbatim selection of most important sentences -> keeps EXACT wording, details, numbers, exceptions
  BUT discards everything not selected
Generative compression: LLM rephrases into shorter summary -> integrates info across whole text
  RISK: model tends to weight COMMON patterns over RARE edge cases/exceptions -> can drop/distort specifics
CRITICAL EVALUATION ERROR: judging compression by RATIO ALONE (tokens saved), not by DOWNSTREAM TASK QUALITY
  -> high compression ratio that drops a critical exception can BREAK a downstream task that needed exactly that exception
Source references must survive compression -> compressed claim still traceable to original source (KB-0317)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Bewertung anhand nachgelagerter Aufgabenqualität | wird die Kompressionsstrategie anhand der tatsächlichen Qualität nachgelagerter Aufgaben statt allein anhand der Kompressionsrate bewertet? | eine hohe Kompressionsrate ohne Qualitätsprüfung kann kritische Details verlieren, ohne dass dies bei reiner Ratenbetrachtung auffällt |
| Bewusste Wahl zwischen extraktiv und generativ je nach Detailkritikalität | wird für Inhalte mit hoher Detailkritikalität (Zahlen, Ausnahmen) bevorzugt extraktive Kompression eingesetzt? | generative Kompression kann bei detailkritischen Inhalten unbeabsichtigt Präzision verlieren |
| Erhalt von Ausnahmen und Sonderfällen | wird geprüft, ob seltene, aber relevante Ausnahmeregeln bei der Kompression erhalten bleiben? | ein Sprachmodell kann bei generativer Kompression seltene Ausnahmen zugunsten häufigerer Muster weglassen |
| Erhalt der Quellenreferenz nach Kompression | bleibt eine komprimierte Aussage weiterhin auf ihre ursprüngliche Quelle zurückführbar? | ohne erhaltene Quellenreferenz kann eine komprimierte Aussage nicht mehr gemäß cite-or-decline (siehe KB-0317) verifiziert werden |

Implementierung: Für Inhalte mit hoher Detailkritikalität (z. B. exakte Zahlenwerte, Ausnahmeregeln, rechtlich relevante Formulierungen) wird bevorzugt extraktive Kompression eingesetzt, die den exakten Wortlaut erhält. Für Inhalte, bei denen eine thematische Zusammenfassung ausreichend ist, kann generative Kompression eingesetzt werden, wobei diese explizit gegen Testfälle mit bekannten Ausnahmefällen evaluiert wird, um unbeabsichtigten Detailverlust zu erkennen. Die Kompressionsstrategie wird anhand der tatsächlichen Qualität einer repräsentativen nachgelagerten Aufgabe gemessen, nicht allein anhand der erzielten Kompressionsrate. Bei beiden Kompressionsarten wird die Quellenreferenz zur ursprünglichen Passage explizit mit der komprimierten Aussage verknüpft, sodass diese weiterhin zurückverfolgbar bleibt.

## Scalability, Reliability, Security und Observability

Kontextkompression skaliert Effizienz der Tokenbudget-Nutzung proportional zur Sorgfalt der Detailerhaltung; die Reliability-Grenze liegt in generativer Kompression ohne Prüfung gegen kritische Ausnahmefälle, die mit wachsender Kompressionsrate proportional mehr unentdeckten Detail- und Ausnahmenverlust erzeugen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine nachgelagerte Aufgabe liefert eine falsche Antwort, die eine spezifische Ausnahmeregel betrifft | die Ausnahmeregel wurde bei der Kompression (insbesondere generativer Kompression) unbeabsichtigt weggelassen | prüfen, ob die betroffene Ausnahmeregel im Originaltext vorhanden, aber im komprimierten Kontext nicht mehr enthalten war |
| eine komprimierte Aussage enthält einen ungenauen oder falschen Zahlenwert | generative Kompression hat den exakten Wert unbeabsichtigt verändert oder ungenau wiedergegeben | den komprimierten Wert direkt gegen den exakten Originalwert vergleichen |
| eine komprimierte Aussage lässt sich nicht mehr auf ihre ursprüngliche Quelle zurückführen | fehlender Erhalt der Quellenreferenz während der Kompression | prüfen, ob die Kompressionslogik die Quellenreferenz explizit mit der komprimierten Aussage verknüpft hat |

Security: Eine Kompression, die Quellenreferenzen verliert, untergräbt die cite-or-decline-Anforderung (siehe [KB-0317](13-zitationen-und-provenienz.md)) und kann dazu führen, dass eine komprimierte, tatsächlich unbelegte Aussage fälschlich als überprüfbar erscheint. Observability: Ergebnis von Testfällen mit bekannten Ausnahmefällen nach Kompression, Vollständigkeit erhaltener Quellenreferenzen und tatsächliche nachgelagerte Aufgabenqualität nach Kompression im Vergleich zu unkomprimiertem Kontext sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** wählt Kompressionsart bewusst nach Detailkritikalität des jeweiligen Inhalts. **Principal** macht Testfälle mit bekannten Ausnahmefällen für das Team nachvollziehbar dokumentiert. **Chief** positioniert Kompressionsqualität als anhand nachgelagerter Aufgabenqualität, nicht allein anhand der Kompressionsrate zu bewertende Entscheidung.

Anti-Patterns: Kompressionsqualität allein anhand der Kompressionsrate ohne Prüfung nachgelagerter Aufgabenqualität bewerten; generative Kompression für hochgradig detailkritische Inhalte ohne Prüfung gegen Ausnahmefälle einsetzen; Quellenreferenzen bei der Kompression verlieren.

## Production Checklist

- [ ] Die Kompressionsart ist bewusst nach Detailkritikalität des Inhalts gewählt.
- [ ] Generative Kompression ist explizit gegen bekannte Ausnahmefälle getestet.
- [ ] Kompressionsqualität wird anhand nachgelagerter Aufgabenqualität, nicht nur der Kompressionsrate bewertet.
- [ ] Quellenreferenzen bleiben nach Kompression erhalten.

## Interviewfragen

### 1. Was ist der Unterschied zwischen extraktiver und generativer Kompression?

**Antwort:** Extraktive Kompression wählt wortwörtlich die wichtigsten Sätze aus dem Originaltext aus und erhält so exakte Details; generative Kompression formuliert den Inhalt mit einem Sprachmodell kürzer um, was Information integrieren kann, aber Detailverlust bei seltenen Fällen riskiert.

### 2. Warum ist Kompressionsrate allein kein ausreichendes Qualitätsmaß?

**Antwort:** Eine sehr hohe Kompressionsrate kann eine kritische Ausnahmeregel oder ein wichtiges Detail verlieren, was eine nachgelagerte Aufgabe zum Scheitern bringen kann, selbst wenn die Rate insgesamt effizient erscheint.

### 3. Warum ist generative Kompression bei hochgradig detailkritischen Inhalten riskanter als extraktive?

**Antwort:** Ein Sprachmodell tendiert bei der Zusammenfassung dazu, häufige, allgemeine Muster stärker zu gewichten als seltene Sonderfälle, was zum unbeabsichtigten Weglassen oder Verändern spezifischer Details führen kann.

### 4. Warum müssen Quellenreferenzen die Kompression überstehen?

**Antwort:** Ohne erhaltene Quellenreferenz kann eine komprimierte Aussage nicht mehr gemäß cite-or-decline-Anforderungen (siehe KB-0317) auf ihre ursprüngliche Quelle zurückgeführt und verifiziert werden.

### 5. Wie diagnostizierst du eine fehlerhafte nachgelagerte Antwort nach Kontextkompression?

**Antwort:** Ich prüfe, ob eine für die Antwort entscheidende Ausnahmeregel oder ein Detailwert im Originaltext vorhanden war, aber im komprimierten Kontext nicht mehr enthalten ist — dies ist die wahrscheinlichste Ursache bei generativer Kompression.

### 6. Widersprüchliche Anforderung: Team will maximale Kompressionsrate für minimalen Tokenverbrauch UND garantiert keinen Verlust kritischer Details oder Ausnahmen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass maximale Kompression und garantierter Detailerhalt sich widersprechen, wenn generative Kompression pauschal auf alle Inhalte angewendet wird; ich würde vorschlagen, detailkritische Abschnitte gezielt extraktiv zu behandeln und nur thematisch weniger kritische Abschnitte generativ stärker zu komprimieren, statt eine einheitliche Kompressionsrate für den gesamten Kontext zu erzwingen.

## Praktische Labs

~~~python
# Extractive vs generative compression, evaluated on downstream task quality
original_text = (
    "Standard tier costs $10/month. Enterprise tier costs $50/month. "
    "Exception: customers in the EU pilot program pay $8/month for the standard tier through 2026."
)

def extractive_compress(text, key_sentence_indices):
    sentences = text.split(". ")
    return ". ".join(sentences[i] for i in key_sentence_indices)

def generative_compress_simulation(text):
    # Simulates a generative model dropping the rare exception clause while summarizing
    return "Pricing: standard tier $10/month, enterprise tier $50/month."

def answer_pricing_question_for_eu_pilot_customer(compressed_context):
    if "EU pilot" in compressed_context or "$8" in compressed_context:
        return "$8/month (EU pilot program rate)"
    return "$10/month (standard rate — exception not found in context)"

extractive_result = extractive_compress(original_text, key_sentence_indices=[0, 2])
generative_result = generative_compress_simulation(original_text)

print(f"Extractive compression preserves exception: {extractive_result}")
print(f"Downstream answer: {answer_pricing_question_for_eu_pilot_customer(extractive_result)}")

print(f"\nGenerative compression (simulated) drops exception: {generative_result}")
print(f"Downstream answer: {answer_pricing_question_for_eu_pilot_customer(generative_result)}")
~~~

## Dependencies, Cross-References und Quellen

1. LangChain: [Contextual Compression Documentation](https://python.langchain.com/docs/how_to/contextual_compression/), abgerufen 2026-09-17.
2. Jiang et al.: [LLMLingua — Compressing Prompts for Accelerated Inference](https://arxiv.org/abs/2310.05736), abgerufen 2026-09-17.
3. Anthropic: [Building Effective AI Agents — Context Engineering](https://www.anthropic.com/engineering/building-effective-agents), abgerufen 2026-09-17.

Kontextzusammenstellung ist kanonisch in [KB-0316](12-kontextzusammenstellung.md) behandelt; Zitationen und Provenienz in [KB-0317](13-zitationen-und-provenienz.md); Autoritätserhalt im Wissenssystem in [KB-0326](22-autoritaetserhalt-im-wissenssystem.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Prompt-Kompressionsmodelle (z. B. LLMLingua-artige Ansätze), die gezielt weniger informationsreiche Tokens entfernen statt vollständiger Umformulierung | Adopting | Gegenüber reiner generativer Zusammenfassung für kontrollierbareren, feingranularen Kompressionsansatz bevorzugen. |
| Automatisierte Ausnahmefall-Erkennung, die seltene, aber relevante Details vor der Kompression markiert und gezielt schützt | Emerging | Beobachten; würde unbeabsichtigten Detailverlust bei generativer Kompression strukturell reduzieren, aber noch nicht breit etabliert. |

Ein Team akzeptiert eine Kontextkompressionsstrategie erst, wenn sie anhand nachgelagerter Aufgabenqualität, einschließlich bekannter Ausnahmefälle, getestet und dokumentiert ist.
