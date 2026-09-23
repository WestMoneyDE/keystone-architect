---
{"id": "KB-0367", "title": "AI-Regressionsprüfungen", "domain": "15", "sequence": 17, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0365", "concepts": ["Evaluationsdatensätze"], "needed_for": "understanding"}, {"id": "KB-0363", "concepts": ["Promptfoo und Konfigurationstests"], "needed_for": "understanding"}], "related": ["KB-0366"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine AI-Regressionsprüfung für eine Prompt-Änderung durchführen und anhand eines absichtlich unzureichenden Testfalls ein green-but-blind-Szenario demonstrieren.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Regressionsteststrategie gestalten, die Änderungen an Modell, Prompt und Retrieval-Konfiguration systematisch vergleicht und gezielt gegen unvollständige, oberflächlich bestehende Tests absichert.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine bestehende AI-Regressionstestsuite ein green-but-blind-Risiko aufweist, weil sie zwar durchgehend besteht, aber bekannte reale Fehlerarten nicht abdeckt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unabhängige Qualitätsbelege für AI-Regressionstestsuiten (statt reinem Vertrauen auf eine durchgehend grüne Testsuite) als Governance-Standard im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Mutation-Testing-Techniken speziell für AI-Regressionstestsuiten sind Vertiefung.", "rationale": "Kern ist das Verständnis des green-but-blind-Risikos, nicht eine spezifische Mutation-Testing-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0367-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simulierte AI-Regressionstestsuite mit einem absichtlich unzureichenden Testfall, der ein reales Regressionsproblem nicht erkennt", "evidence": "Eine Regressionstestsuite mit oberflächlichen Assertions (z. B. nur Prüfung auf nicht-leere Antwort) besteht durchgehend, obwohl eine simulierte Prompt-Änderung die inhaltliche Qualität der Antworten tatsächlich verschlechtert; eine durch Mutation ergänzte, schärfere Assertion deckt dieses green-but-blind-Verhalten auf.", "limitations": "Kein produktives Regressionstestsystem, kein realer Geschäftsdatensatz, künstlich konstruiertes Szenario."}]}
---
# AI-Regressionsprüfungen

> **Ziel:** AI-Regressionsprüfungen vergleichen Änderungen an Modell, Prompt und Retrieval-Konfiguration systematisch gegen den bisherigen Stand, aufbauend auf Evaluationsdatensätzen (siehe [KB-0365](15-evaluationsdatensaetze.md)) und Matrixtests (siehe [KB-0363](13-promptfoo-und-konfigurationstests.md)). Der zentrale Punkt dieses Kapitels ist das Risiko "green-but-blind": eine Testsuite besteht durchgehend (grün), erkennt aber tatsächliche Regressionen nicht, weil ihre Assertions zu oberflächlich sind — dieses Risiko lässt sich nur durch unabhängige Qualitätsbelege der Testsuite selbst, nicht durch die bloße Tatsache bestehender Tests, begrenzen.

## Zweck, Mental Model und Dependencies

Eine AI-Regressionsprüfung führt denselben Evaluationsdatensatz vor und nach einer Änderung (an Modell, Prompt oder Retrieval-Konfiguration) aus und vergleicht die Ergebnisse, um unbeabsichtigte Qualitätsverschlechterungen zu erkennen, bevor sie in Produktion gelangen. Das green-but-blind-Risiko beschreibt einen speziellen, tückischen Fehlermodus: die Testsuite zeigt durchgehend "grün" (alle Tests bestehen), obwohl eine tatsächliche Regression stattgefunden hat — dies passiert, wenn die verwendeten Assertions zu oberflächlich sind, um die relevante Qualitätsdimension tatsächlich zu prüfen (z. B. eine Assertion, die nur prüft, ob überhaupt eine Antwort zurückgegeben wurde, statt ob die Antwort inhaltlich korrekt ist). Eine durchgehend grüne Testsuite erzeugt dabei ein trügerisches Sicherheitsgefühl: das Team vertraut der Testsuite, ohne zu wissen, dass sie bestimmte, möglicherweise gerade die kritischsten Fehlerarten gar nicht erkennen kann. Der einzige zuverlässige Weg, dieses Risiko zu begrenzen, ist ein unabhängiger Qualitätsbeleg der Testsuite selbst — etwa durch Mutation Testing (die Testsuite wird gegen absichtlich eingeführte Fehler geprüft: erkennt sie diese zuverlässig, ist sie tatsächlich aussagekräftig; besteht sie trotz eingeführtem Fehler weiterhin grün, ist das green-but-blind-Risiko bestätigt) oder durch gezielte, unabhängige Prüfung der Assertion-Tiefe gegen bekannte reale Fehlerfälle.

~~~text
AI regression check: run SAME eval dataset before/after a change (model/prompt/retrieval) -> compare results
GREEN-BUT-BLIND RISK: test suite shows ALL GREEN, but a real regression occurred anyway
  -> happens when assertions are too SHALLOW to actually check the relevant quality dimension
  (e.g. "response is non-empty" instead of "response is factually correct")
  -> a consistently green suite creates FALSE confidence: team trusts it, unaware it can't catch certain failure classes
ONLY RELIABLE MITIGATION: independent quality evidence of the test suite ITSELF
  Mutation testing: deliberately introduce a known bug -> does the suite catch it?
    catches it -> suite is meaningful; stays green despite the bug -> green-but-blind CONFIRMED
~~~

## Core Concepts, Architektur und Implementierung

| Element | Funktion | Green-but-blind-Relevanz |
|---|---|---|
| Vorher-/Nachher-Vergleich auf demselben Evaluationsdatensatz | erkennt Verhaltensänderungen durch eine Änderung | erkennt nur Verhaltensänderungen, die von den Assertions tatsächlich erfasst werden |
| Assertion-Tiefe | bestimmt, welche Qualitätsdimension tatsächlich geprüft wird | oberflächliche Assertions (z. B. "nicht leer") können reale inhaltliche Regressionen übersehen |
| Mutation Testing / unabhängige Prüfung | prüft die Aussagekraft der Testsuite selbst | deckt green-but-blind auf, indem absichtlich eingeführte Fehler gegen die Suite getestet werden |

Implementierung: Vor jeder Änderung an Modell, Prompt oder Retrieval-Konfiguration wird der bestehende Evaluationsdatensatz sowohl gegen den bisherigen als auch gegen den geänderten Stand ausgeführt, und die Ergebnisse werden systematisch verglichen. Die verwendeten Assertions werden regelmäßig durch Mutation Testing oder eine vergleichbare unabhängige Prüfung validiert: ein bekannter, absichtlich eingeführter Fehler wird gegen die Regressionstestsuite geprüft; erkennt die Suite diesen Fehler nicht, werden die betroffenen Assertions als unzureichend identifiziert und durch schärfere, inhaltlich aussagekräftigere Kriterien ersetzt.

## Scalability, Reliability, Security und Observability

AI-Regressionsprüfungen skalieren Vertrauen in Änderungen proportional zur tatsächlichen Aussagekraft der verwendeten Assertions, nicht proportional zur Anzahl bestehender Tests; die Reliability-Grenze liegt darin, dass eine unerkannte green-but-blind-Suite proportional zur Häufigkeit ungeprüfter Änderungen das Risiko unentdeckter Produktionsregressionen erhöht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Prompt-Änderung besteht die Regressionstestsuite vollständig, verursacht aber in Produktion eine sichtbare Qualitätsverschlechterung | die verwendeten Assertions sind zu oberflächlich, um die tatsächlich betroffene Qualitätsdimension zu erfassen | die Assertions durch Mutation Testing gegen einen bekannten, ähnlichen Fehler prüfen und bei Bedarf verschärfen |
| eine Testsuite zeigt seit langer Zeit durchgehend grün, obwohl das System mehrfach substanziell verändert wurde | die Testsuite wurde nie unabhängig auf ihre tatsächliche Fehlererkennungsfähigkeit geprüft | ein Mutation-Testing-Durchlauf gegen die aktuelle Testsuite durchführen, um ihre Aussagekraft zu verifizieren |
| ein Team vertraut vollständig auf eine bestehende Testsuite ohne deren Assertion-Tiefe je hinterfragt zu haben | keine unabhängigen Qualitätsbelege für die Testsuite selbst wurden je erhoben | eine stichprobenartige unabhängige Prüfung der Assertion-Tiefe gegen bekannte reale Fehlerfälle durchführen |

Security: Ein green-but-blind-Zustand kann dazu führen, dass sicherheitsrelevante Regressionen (z. B. eine durch eine Prompt-Änderung eingeführte Sicherheitslücke) unentdeckt in Produktion gelangen, weil die Testsuite fälschlich Vertrauen suggeriert. Observability: Die Fehlererkennungsrate der Testsuite bei Mutation-Testing-Durchläufen, sowie die Häufigkeit unabhängiger Assertion-Tiefe-Prüfungen, sind zentrale Metriken zur Bewertung der tatsächlichen Testsuite-Qualität.

## Trade-offs und Entscheidungen

**Staff** implementiert regelmäßige Mutation-Testing-Durchläufe zur Prüfung der Assertion-Tiefe. **Principal** macht erkannte green-but-blind-Schwachstellen für das Team nachvollziehbar. **Chief** etabliert unabhängige Qualitätsbelege für AI-Regressionstestsuiten als Governance-Standard, statt reinem Vertrauen auf eine durchgehend grüne Testsuite.

Anti-Patterns: eine durchgehend grüne Testsuite als ausreichenden Beleg für Regressionsfreiheit interpretieren, ohne deren Assertion-Tiefe je unabhängig geprüft zu haben; oberflächliche Assertions (z. B. nur "Antwort nicht leer") als ausreichend für inhaltlich kritische Qualitätsdimensionen akzeptieren; Regressionstests ohne Vorher-/Nachher-Vergleich auf demselben Evaluationsdatensatz durchführen.

## Production Checklist

- [ ] Jede Änderung an Modell, Prompt oder Retrieval wird gegen einen Vorher-/Nachher-Vergleich auf demselben Evaluationsdatensatz geprüft.
- [ ] Die Assertion-Tiefe der Regressionstestsuite wird regelmäßig durch Mutation Testing oder vergleichbare unabhängige Prüfung validiert.
- [ ] Erkannte green-but-blind-Schwachstellen werden durch schärfere Assertions behoben, nicht ignoriert.
- [ ] Eine durchgehend grüne Testsuite wird nicht ohne unabhängigen Qualitätsbeleg als ausreichender Regressionsschutz interpretiert.

## Interviewfragen

### 1. Was bedeutet das Risiko "green-but-blind" bei AI-Regressionsprüfungen?

**Antwort:** Die Testsuite besteht durchgehend, obwohl eine tatsächliche Regression stattgefunden hat, weil die verwendeten Assertions zu oberflächlich sind, um die relevante Qualitätsdimension tatsächlich zu prüfen.

### 2. Wie kann man das green-but-blind-Risiko einer bestehenden Testsuite aufdecken?

**Antwort:** Durch Mutation Testing: ein bekannter, absichtlich eingeführter Fehler wird gegen die Suite geprüft; erkennt sie diesen nicht, ist das green-but-blind-Risiko bestätigt.

### 3. Warum ist eine durchgehend grüne Testsuite allein kein ausreichender Beleg für Regressionsfreiheit?

**Antwort:** Eine grüne Testsuite zeigt nur, dass die vorhandenen Assertions bestanden wurden, nicht, dass diese Assertions tatsächlich in der Lage sind, relevante Regressionen zu erkennen.

### 4. Was ist ein Beispiel für eine zu oberflächliche Assertion bei einer AI-Regressionsprüfung?

**Antwort:** Eine Assertion, die nur prüft, ob überhaupt eine nicht-leere Antwort zurückgegeben wurde, statt zu prüfen, ob die Antwort inhaltlich korrekt und qualitativ unverändert ist.

### 5. Wie gehst du vor, wenn eine Prompt-Änderung die Regressionstestsuite vollständig besteht, aber in Produktion eine Qualitätsverschlechterung sichtbar wird?

**Antwort:** Ich prüfe die verwendeten Assertions durch Mutation Testing gegen einen bekannten, ähnlichen Fehler und verschärfe die Assertions, die den beobachteten Regressionstyp nicht erkennen konnten.

### 6. Widersprüchliche Anforderung: Team will schnelle, automatisierte Regressionsprüfung bei jeder Änderung UND garantiert keine green-but-blind-Testsuite — wie gehst du vor?

**Antwort:** Ich würde die automatisierte Regressionsprüfung für jede Änderung beibehalten, aber zusätzlich regelmäßige, automatisierte Mutation-Testing-Durchläufe als festen Bestandteil des Prozesses etablieren, die unabhängig von der eigentlichen Änderungsprüfung die Aussagekraft der Testsuite selbst kontinuierlich validieren.

## Praktische Labs

~~~python
def old_prompt_response(query):
    return "Paris is the capital of France."

def new_prompt_response_with_regression(query):
    return "Paris is a city."  # subtle but real content regression: drops the key fact

def shallow_assertion(response):
    return len(response) > 0  # GREEN-BUT-BLIND: only checks non-empty

def deeper_assertion(response, required_fact):
    return required_fact.lower() in response.lower()

query = "What is the capital of France?"
required_fact = "capital of France"

old_response = old_prompt_response(query)
new_response = new_prompt_response_with_regression(query)

print(f"Shallow assertion (old): {shallow_assertion(old_response)}")
print(f"Shallow assertion (new, WITH regression): {shallow_assertion(new_response)} <- passes despite real regression!")

print(f"\nDeeper assertion (old): {deeper_assertion(old_response, required_fact)}")
print(f"Deeper assertion (new, WITH regression): {deeper_assertion(new_response, required_fact)} <- correctly FAILS, catching the regression")
~~~

## Dependencies, Cross-References und Quellen

1. Zhu et al.: [A Detailed Investigation of the Effectiveness of Mutation Testing](https://arxiv.org/abs/1803.02730), abgerufen 2026-09-17.
2. Promptfoo-Dokumentation: [Configuration Guide](https://www.promptfoo.dev/docs/configuration/guide/), abgerufen 2026-09-17.

Evaluationsdatensätze sind kanonisch in [KB-0365](15-evaluationsdatensaetze.md) behandelt; Promptfoo und Konfigurationstests in [KB-0363](13-promptfoo-und-konfigurationstests.md); Synthetische Evaluationen in [KB-0366](16-synthetische-evaluationen.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, LLM-gestützte Mutation-Generierung für AI-Regressionstestsuiten | Evaluating | Gegenüber manuell konstruierten Mutationsfällen abwägen, sobald die generierten Mutationen nachweislich relevante Assertion-Schwächen aufdecken. |
| Kontinuierliche, in die CI-Pipeline integrierte Mutation-Testing-Durchläufe für AI-Systeme | Adopting | Gegenüber gelegentlichen, manuell angestoßenen Prüfungen für systematischere, frühzeitigere Erkennung von green-but-blind-Zuständen bevorzugen. |

Ein Team akzeptiert eine AI-Regressionstestsuite als ausreichenden Schutz erst, wenn ein dokumentierter Mutation-Testing-Durchlauf ihre tatsächliche Fehlererkennungsfähigkeit bestätigt.
