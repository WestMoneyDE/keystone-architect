---
{"id": "KB-0358", "title": "AI-Lineage und Abhängigkeiten", "domain": "15", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0353", "concepts": ["DVC und Datenversionierung"], "needed_for": "understanding"}, {"id": "KB-0356", "concepts": ["Model Registries und Freigabestatus"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für eine gegebene produktive Modellantwort die vollständige Lineage-Kette (Datenversion, Code-Version, Prompt-Version, Modellversion) zurückverfolgen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Lineage-Struktur gestalten, die Daten-, Code-, Prompt- und Modellartefakt-Versionen so verknüpft, dass eine Änderung an jeder einzelnen Komponente bis zu betroffenen produktiven Antworten nachvollziehbar bleibt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Bei einem gemeldeten Problem mit einer produktiven Antwort die Ursache durch Lineage-Rückverfolgung auf eine spezifische Daten-, Code-, Prompt- oder Modelländerung eingrenzen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Durchgängige Lineage-Nachvollziehbarkeit von jeder produktiven Antwort bis zu ihren Ursprungskomponenten als Governance- und Rechenschaftsstandard im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Automatisierte, graphbasierte Lineage-Visualisierungswerkzeuge für sehr große Abhängigkeitsnetzwerke sind Vertiefung.", "rationale": "Kern ist das Verständnis der Verkettung von Daten/Code/Prompts/Modellartefakten, nicht ein spezifisches Visualisierungswerkzeug."}}, "lab_validation": [{"lab_id": "KB-0358-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Lineage-Modell, das eine produktive Antwort auf Daten-, Code-, Prompt- und Modellversion zurückführt", "evidence": "Eine simulierte produktive Antwort wird über eine verkettete Lineage-Struktur vollständig auf ihre zugrunde liegende Datenversion, Code-Version, Prompt-Version und Modellversion zurückgeführt; eine simulierte Änderung an der Prompt-Version macht sofort sichtbar, welche nachgelagerten Antworten davon potenziell betroffen wären.", "limitations": "Kein produktives Lineage-System, kein realer Geschäftsdatensatz, kleine simulierte Abhängigkeitskette."}]}
---
# AI-Lineage und Abhängigkeiten

> **Ziel:** AI-Lineage verknüpft alle Komponenten, die zu einer produktiven Modellantwort beitragen — Daten (siehe [KB-0353](03-dvc-und-datenversionierung.md)), Code, Prompts und Modellartefakte (siehe [KB-0356](06-model-registries-und-freigabestatus.md)) — zu einer nachvollziehbaren Kette, sodass die Auswirkung einer Änderung an jeder einzelnen Komponente bis zu betroffenen produktiven Antworten ermittelt werden kann. Dies erweitert die einzelnen Versionierungskonzepte (Datenversionierung, Modell-Registry) um die explizite Verknüpfung zwischen ihnen, die keines der Einzelkonzepte allein herstellt.

## Zweck, Mental Model und Dependencies

Datenversionierung (DVC) macht nachvollziehbar, welche Datenversion für ein Training verwendet wurde; eine Model Registry macht nachvollziehbar, welche Modellversion in Produktion läuft. Keines dieser Konzepte beantwortet jedoch allein die Frage: "Welche produktiven Antworten wurden durch eine bestimmte Modell-, Daten-, Code- oder Prompt-Änderung beeinflusst?" AI-Lineage schließt diese Lücke, indem sie eine explizite Verkettung herstellt: eine produktive Antwort referenziert die verwendete Modellversion, die Modellversion referenziert die Trainingsdatenversion und den Trainingscode, und bei generativen Systemen referenziert die Antwort zusätzlich die verwendete Prompt-Version. Diese Kette erlaubt zwei Richtungen der Nachverfolgung: vorwärts (eine Änderung an einer Komponente — z. B. einer Prompt-Version — macht sichtbar, welche zukünftigen Antworten davon betroffen sein werden) und rückwärts (eine auffällige oder fehlerhafte Antwort macht sichtbar, auf welcher genauen Kombination von Daten-, Code-, Prompt- und Modellversion sie beruhte). Ohne diese explizite Verkettung bleibt die Fehlersuche bei einer unerwarteten produktiven Antwort auf Vermutungen angewiesen, welche der potenziell vielen kürzlich geänderten Komponenten tatsächlich ursächlich war.

~~~text
Data versioning (DVC) alone: knows WHICH data version trained a model
Model registry alone: knows WHICH model version is in production
NEITHER answers: "which production responses were affected by THIS specific change?"
AI Lineage: explicit chain -> response references model version
                              -> model version references training data version + training code
                              -> response ALSO references prompt version (generative systems)
TWO DIRECTIONS enabled:
  FORWARD:  a component changes (e.g. prompt v3) -> which FUTURE responses will be affected?
  BACKWARD: a flawed response occurs -> which EXACT data/code/prompt/model combination produced it?
WITHOUT explicit chain: root-causing an unexpected response = guesswork among many recently-changed components
~~~

## Core Concepts, Architektur und Implementierung

| Komponente | Referenziert durch Lineage | Ohne Lineage-Verkettung |
|---|---|---|
| Datenversion | Modellversion referenziert ihre Trainingsdatenversion | unklar, welche Daten ein spezifisches Modellverhalten geprägt haben |
| Code-Version | Modellversion referenziert die verwendete Trainings-/Verarbeitungscode-Version | unklar, ob ein Code-Fehler statt der Daten für ein Problem verantwortlich ist |
| Prompt-Version | produktive Antwort referenziert die verwendete Prompt-Version | eine Prompt-Änderung kann unbemerkt viele Antworten beeinflussen, ohne nachvollziehbar zu sein |
| Modellversion | produktive Antwort referenziert die verwendete Modellversion | eine Antwort kann nicht auf eine spezifische, geprüfte Modellversion zurückgeführt werden |

Implementierung: Jede produktive Antwort wird mit den Kennungen aller beitragenden Komponenten protokolliert: der verwendeten Modellversion (aus der Registry, siehe [KB-0356](06-model-registries-und-freigabestatus.md)), der verwendeten Prompt-Version (bei generativen Systemen) und indirekt, über die Modellversion, der zugrunde liegenden Trainingsdatenversion (aus DVC, siehe [KB-0353](03-dvc-und-datenversionierung.md)) und Code-Version. Bei einer gemeldeten fehlerhaften Antwort wird diese Kette rückwärts durchlaufen, um die exakte Kombination der beitragenden Komponenten zu identifizieren. Vor einer geplanten Änderung an einer Komponente (z. B. einer neuen Prompt-Version) wird die Kette vorwärts geprüft, um abzuschätzen, welche Antwortpfade davon betroffen sein werden.

## Scalability, Reliability, Security und Observability

AI-Lineage skaliert Nachvollziehbarkeit proportional zur Vollständigkeit der protokollierten Verkettung zwischen Komponenten; die Reliability-Grenze liegt darin, dass eine Lücke in der Kette (eine Komponente, die nicht mit ihrer Quelle verknüpft protokolliert wurde) die Rückverfolgung an genau dieser Stelle abbricht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine fehlerhafte produktive Antwort kann nicht eindeutig auf eine Ursache zurückgeführt werden | die Lineage-Kette zwischen Antwort, Modellversion, Prompt-Version und Trainingsdaten ist an mindestens einer Stelle unvollständig | die protokollierten Referenzen der betroffenen Antwort Schritt für Schritt prüfen und die Lücke identifizieren |
| eine geplante Prompt-Änderung wird ohne Abschätzung der betroffenen Antwortpfade vorgenommen | keine vorwärtsgerichtete Lineage-Prüfung wurde vor der Änderung durchgeführt | vor der Änderung prüfen, welche aktuellen Antwortpfade dieselbe Prompt-Version referenzieren |
| mehrere kürzlich geänderte Komponenten (Daten, Code, Prompt, Modell) machen die Fehlersuche bei einem Problem unübersichtlich | ohne explizite Verkettung ist unklar, welche Kombination tatsächlich für die konkrete Antwort verantwortlich war | die exakte Lineage-Kette der betroffenen Antwort abrufen, statt alle kürzlichen Änderungen einzeln zu vermuten |

Security: Vollständige Lineage-Nachvollziehbarkeit ist eine Voraussetzung für Rechenschaftspflicht bei sicherheitsrelevanten oder schädlichen produktiven Antworten, da sie die exakte verantwortliche Komponentenkombination identifizierbar macht statt auf Vermutungen angewiesen zu sein. Observability: Der Anteil produktiver Antworten mit vollständig protokollierter Lineage-Kette, sowie die durchschnittliche Zeit bis zur Ursachenidentifikation bei gemeldeten Problemen, sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert vollständige Lineage-Protokollierung für jede produktive Antwort. **Principal** macht Lineage-Ketten bei gemeldeten Problemen für das Team nachvollziehbar abrufbar. **Chief** etabliert durchgängige Lineage-Nachvollziehbarkeit von jeder produktiven Antwort bis zu ihren Ursprungskomponenten als Governance- und Rechenschaftsstandard im Unternehmen.

Anti-Patterns: produktive Antworten ohne Referenz auf die verwendete Modell- und Prompt-Version protokollieren; eine Komponentenänderung ohne vorherige vorwärtsgerichtete Auswirkungsabschätzung vornehmen; bei Fehlersuche auf Vermutungen statt auf die tatsächliche Lineage-Kette zurückgreifen.

## Production Checklist

- [ ] Jede produktive Antwort protokolliert Referenzen auf Modell-, Prompt- und (indirekt über die Modellversion) Datenversion.
- [ ] Eine rückwärtsgerichtete Lineage-Abfrage ist für jede gemeldete fehlerhafte Antwort verfügbar.
- [ ] Vor jeder Komponentenänderung wird eine vorwärtsgerichtete Auswirkungsabschätzung durchgeführt.
- [ ] Der Anteil produktiver Antworten mit vollständiger Lineage-Kette wird überwacht.

## Interviewfragen

### 1. Welche Frage beantwortet AI-Lineage, die Datenversionierung und Model Registry allein nicht beantworten?

**Antwort:** Welche produktiven Antworten durch eine bestimmte Modell-, Daten-, Code- oder Prompt-Änderung beeinflusst wurden bzw. werden.

### 2. Was sind die beiden Richtungen der Lineage-Nachverfolgung?

**Antwort:** Vorwärts (eine Änderung an einer Komponente zeigt, welche zukünftigen Antworten betroffen sein werden) und rückwärts (eine fehlerhafte Antwort zeigt, auf welcher exakten Komponentenkombination sie beruhte).

### 3. Warum reicht eine Model Registry allein nicht für vollständige Rechenschaftspflicht bei produktiven Antworten aus?

**Antwort:** Sie macht nachvollziehbar, welche Modellversion in Produktion läuft, aber nicht, welche spezifische Prompt-Version oder Trainingsdatenversion zu einer konkreten Antwort beigetragen hat.

### 4. Wie gehst du vor, wenn eine fehlerhafte produktive Antwort gemeldet wird?

**Antwort:** Ich durchlaufe die Lineage-Kette rückwärts von der Antwort über die verwendete Modell- und Prompt-Version bis zur zugrunde liegenden Trainingsdaten- und Code-Version, um die exakte verantwortliche Kombination zu identifizieren.

### 5. Was prüfst du vor einer geplanten Änderung an einer Prompt-Version?

**Antwort:** Ich prüfe die Lineage-Kette vorwärts, um zu ermitteln, welche aktuellen Antwortpfade dieselbe Prompt-Version referenzieren und somit von der Änderung betroffen sein könnten.

### 6. Widersprüchliche Anforderung: Team will schnelle, unkomplizierte Änderungen an Prompts/Modellen UND garantiert vollständige Rückverfolgbarkeit jeder produktiven Antwort — wie gehst du vor?

**Antwort:** Ich würde die Lineage-Protokollierung vollständig automatisieren, sodass jede Antwort automatisch mit den relevanten Versionsreferenzen versehen wird, ohne manuellen Zusatzaufwand bei Änderungen, sodass Änderungsgeschwindigkeit erhalten bleibt, während die Rückverfolgbarkeit durchgängig garantiert ist.

## Praktische Labs

~~~python
lineage_records = []

def log_response(response_id, model_version, prompt_version):
    lineage_records.append({
        "response_id": response_id,
        "model_version": model_version,
        "prompt_version": prompt_version,
    })

model_lineage = {
    "model_v1": {"data_version": "data_v1", "code_version": "code_v1"},
    "model_v2": {"data_version": "data_v2", "code_version": "code_v1"},
}

log_response("resp_101", "model_v1", "prompt_v1")
log_response("resp_102", "model_v1", "prompt_v2")
log_response("resp_103", "model_v2", "prompt_v2")

def trace_backward(response_id):
    record = next(r for r in lineage_records if r["response_id"] == response_id)
    model_info = model_lineage[record["model_version"]]
    return {**record, **model_info}

print("Backward trace for a flawed response (resp_102):")
print(trace_backward("resp_102"))

def trace_forward(prompt_version):
    return [r["response_id"] for r in lineage_records if r["prompt_version"] == prompt_version]

print(f"\nForward trace: responses affected if 'prompt_v2' changes: {trace_forward('prompt_v2')}")
~~~

## Dependencies, Cross-References und Quellen

1. Zaharia et al.: [Accelerating the Machine Learning Lifecycle with MLflow](https://cs.stanford.edu/~matei/papers/2018/ieee_mlflow.pdf), abgerufen 2026-09-17.
2. OpenLineage-Dokumentation: [Concepts — Lineage Metadata](https://openlineage.io/docs/spec/facets/), abgerufen 2026-09-17.

DVC und Datenversionierung sind kanonisch in [KB-0353](03-dvc-und-datenversionierung.md) behandelt; Model Registries und Freigabestatus in [KB-0356](06-model-registries-und-freigabestatus.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte Lineage-Metadatenformate (z. B. OpenLineage) für werkzeugübergreifende Interoperabilität | Evaluating | Gegenüber proprietären, tool-spezifischen Lineage-Formaten abwägen, sobald ein breit unterstützter Standard für die eingesetzten Werkzeuge verfügbar ist. |
| Automatisierte, graphbasierte Lineage-Explorer für interaktive Vorwärts-/Rückwärts-Abfragen über große Abhängigkeitsnetzwerke | Adopting | Gegenüber manueller Kettenverfolgung für schnellere Ursachenidentifikation bei komplexen, vielschichtigen Systemen bevorzugen. |

Ein Team akzeptiert eine Rechenschaftsanfrage zu einer produktiven Antwort erst, wenn die vollständige Lineage-Kette bis zu Daten-, Code-, Prompt- und Modellversion nachvollziehbar abgerufen werden kann.
