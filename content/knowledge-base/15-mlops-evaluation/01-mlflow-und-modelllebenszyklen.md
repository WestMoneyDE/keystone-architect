---
{"id": "KB-0351", "title": "MLflow und Modelllebenszyklen", "domain": "15", "sequence": 1, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0349", "concepts": ["Experimentdesign für ML"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Trainingslauf mit MLflow-Tracking protokollieren (Parameter, Metriken, Artefakte) und einen Run über die Registry versionieren.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Runs-/Artefakt-/Registry-Struktur gestalten, die reproduzierbare Experimenterfassung mit einer klaren Übergabe zwischen Forschung und Betrieb verbindet.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein Team davon überzeugen, Modellversionen konsequent über eine Registry statt über Ad-hoc-Dateiablagen zu verwalten, um Nachvollziehbarkeit bei Produktionsproblemen sicherzustellen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Ein durchgängiges Lebenszyklus-Tracking von Experiment bis Produktion als Governance-Standard im Unternehmen etablieren, gegenüber unstrukturierter, nicht nachvollziehbarer Modellverwaltung.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Der Betrieb einer selbst gehosteten MLflow-Serverinfrastruktur im großen Maßstab ist Vertiefung.", "rationale": "Kern ist das Verständnis von Runs, Artefakten und Registry-Konzepten, nicht der Betrieb einer spezifischen Serverinstallation."}}, "lab_validation": [{"lab_id": "KB-0351-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal ausgeführtes MLflow-Tracking eines einfachen Trainingslaufs mit anschließender Modellregistrierung", "evidence": "Ein lokaler Trainingslauf wird mit MLflow protokolliert (Parameter, Metrik, Modellartefakt), als Run gespeichert und anschließend in der MLflow Model Registry als benannte Modellversion registriert, wodurch der Lauf über seine Run-ID nachträglich vollständig nachvollziehbar bleibt.", "limitations": "Kein produktiver MLflow-Server, kein Team-Zugriff, keine reale Multi-User-Registry."}]}
---
# MLflow und Modelllebenszyklen

> **Ziel:** MLflow (und vergleichbare Werkzeuge) strukturieren den Modelllebenszyklus über drei Kernkonzepte: Runs (ein einzelner protokollierter Trainingsversuch mit Parametern, Metriken und Artefakten), Artefakte (gespeicherte Ausgaben eines Runs, z. B. das trainierte Modell selbst) und Registry-Verknüpfungen (eine versionierte, benannte Verwaltung von Modellen über ihren Lebenszyklus von Entwicklung bis Produktion). Aufbauend auf reproduzierbarem Experimentdesign (siehe [KB-0349](../14-ml-engineering/19-experimentdesign-fuer-ml.md)) ermöglicht dies eine strukturierte Übergabe zwischen Forschung und Betrieb, statt Modelle und Experimentergebnisse informell in Ad-hoc-Dateien oder Notizen zu verwalten.

## Zweck, Mental Model und Dependencies

Ein Run erfasst einen einzelnen Trainingsversuch vollständig: die verwendeten Hyperparameter, die erzielten Metriken (z. B. Validierungsgenauigkeit), und Metadaten wie Zeitstempel und Code-Version. Artefakte sind die konkreten Ausgabedateien eines Runs — typischerweise das trainierte Modell selbst, aber auch Diagramme, Vorverarbeitungsobjekte oder Konfigurationsdateien — die zusammen mit dem Run gespeichert werden, sodass ein Run vollständig reproduzierbar und nachvollziehbar bleibt. Die Model Registry verknüpft mehrere Runs zu einer benannten Modell-Historie: ein Modell (z. B. "Betrugserkennung") kann mehrere Versionen haben, jede Version verweist auf den Run, aus dem sie stammt, und jede Version kann einer Lebenszyklusphase (z. B. "Staging", "Production", "Archived") zugeordnet werden. Diese Struktur löst ein konkretes Übergabeproblem: ohne sie besteht die Übergabe eines Modells von Forschung zu Betrieb oft aus informell weitergegebenen Dateien ohne klaren Bezug zu den Trainingsbedingungen, was Nachvollziehbarkeit bei später auftretenden Problemen erschwert. Mit Runs, Artefakten und Registry ist für jede produktiv eingesetzte Modellversion exakt nachvollziehbar, mit welchen Daten, Hyperparametern und welchem Code sie erzeugt wurde.

~~~text
Run: single tracked training attempt -> hyperparameters + metrics + metadata (timestamp, code version)
Artifact: concrete output of a run -> trained model file, plots, preprocessing objects, configs
Model Registry: named model history across multiple runs
  -> each version references its originating run
  -> each version tagged with a lifecycle stage: Staging / Production / Archived
SOLVES: informal file handoff from research to production loses traceability
  -> WITH tracking: every production model version traces exactly back to its data/hyperparameters/code
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Rolle im Lebenszyklus | Ohne dieses Konzept |
|---|---|---|
| Run | erfasst einen einzelnen Trainingsversuch reproduzierbar | Trainingsversuche sind nicht systematisch miteinander vergleichbar |
| Artefakt | speichert die konkrete Ausgabe (Modell, Diagramme) eines Runs | das trainierte Modell ist von seinem Trainingskontext getrennt |
| Registry | verwaltet benannte, versionierte Modelle über Lebenszyklusphasen | keine klare Zuordnung, welche Modellversion aktuell in Produktion läuft |

Implementierung: Jeder Trainingslauf protokolliert seine Hyperparameter, Metriken und das resultierende Modellartefakt als Run. Ein als geeignet befundener Run wird in die Model Registry unter einem benannten Modell als neue Version registriert. Die Übergabe zu Produktion erfolgt durch explizites Umstufen dieser Version in die Produktionsphase, statt durch informelles Kopieren einer Modelldatei; dadurch bleibt bei jedem produktiven Modell nachvollziehbar, aus welchem Run und mit welchen Trainingsbedingungen es entstand.

## Scalability, Reliability, Security und Observability

Strukturiertes Lebenszyklus-Tracking skaliert die Nachvollziehbarkeit proportional zur Anzahl der Experimente und Modellversionen; die Reliability-Grenze liegt darin, dass ohne diese Struktur die Nachvollziehbarkeit bei wachsender Anzahl paralleler Experimente und Modellversionen proportional schneller verloren geht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein in Produktion beobachtetes Modellverhalten kann nicht auf die ursprünglichen Trainingsbedingungen zurückgeführt werden | das Modell wurde ohne Run-/Artefakt-Tracking informell übergeben | prüfen, ob ein zugehöriger Run mit Hyperparametern, Metriken und Artefakt in der Registry existiert |
| ein Team ist unsicher, welche Modellversion aktuell in Produktion läuft | keine klare Registry-Umstufung zwischen Staging und Production wurde vorgenommen | die Registry-Phase der betroffenen Modellversionen prüfen und explizit klären |
| zwei Teammitglieder erzielen mit denselben Hyperparametern unterschiedliche Ergebnisse | fehlende Run-Protokollierung von Code-Version und Datenreferenz verhindert vollständige Reproduktion | die Run-Metadaten beider Versuche vergleichen, insbesondere Code-Version und Datenreferenz |

Security: Eine Registry mit klaren Zugriffsrechten verhindert, dass unautorisierte Modellversionen ohne Review in die Produktionsphase umgestuft werden. Observability: Die Anzahl der Runs pro Modell, die aktuelle Registry-Phase jeder Version und die Metrikhistorie über Runs hinweg sind zentrale Nachvollziehbarkeitsmetriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Run- und Artefakt-Tracking als Standardbestandteil jedes Trainingslaufs. **Principal** macht die Registry-Struktur und Umstufungsprozesse für das Team nachvollziehbar. **Chief** etabliert durchgängiges Lebenszyklus-Tracking von Experiment bis Produktion als Governance-Standard im Unternehmen.

Anti-Patterns: trainierte Modelle informell als Dateien ohne Bezug zum ursprünglichen Run weitergeben; Modellversionen ohne expliziten Registry-Umstufungsprozess direkt in Produktion einsetzen; Runs ohne vollständige Hyperparameter- und Metrikerfassung protokollieren.

## Production Checklist

- [ ] Jeder Trainingsversuch wird als Run mit Hyperparametern und Metriken protokolliert.
- [ ] Trainierte Modelle werden als Artefakte mit Bezug zu ihrem Run gespeichert.
- [ ] Produktiv eingesetzte Modellversionen sind über die Registry benannt und versioniert.
- [ ] Die Umstufung einer Modellversion in die Produktionsphase erfolgt explizit und nachvollziehbar.

## Interviewfragen

### 1. Was erfasst ein Run in einem Modelllebenszyklus-System?

**Antwort:** Einen einzelnen Trainingsversuch mit seinen Hyperparametern, den erzielten Metriken und Metadaten wie Zeitstempel und Code-Version.

### 2. Welches Problem löst eine Model Registry gegenüber informeller Modellweitergabe?

**Antwort:** Sie verknüpft jede Modellversion nachvollziehbar mit dem Run, aus dem sie stammt, und ordnet ihr eine klare Lebenszyklusphase zu, statt Modelle als isolierte Dateien ohne Bezug zu ihrem Trainingskontext weiterzugeben.

### 3. Was ist der Unterschied zwischen einem Run und einem Artefakt?

**Antwort:** Ein Run erfasst den gesamten Trainingsversuch (Parameter, Metriken, Metadaten); ein Artefakt ist eine konkrete Ausgabedatei dieses Runs, z. B. das trainierte Modell selbst.

### 4. Wie stellst du sicher, dass ein Produktionsproblem auf die ursprünglichen Trainingsbedingungen zurückverfolgt werden kann?

**Antwort:** Indem jedes produktive Modell über die Registry mit seinem ursprünglichen Run verknüpft ist, der Hyperparameter, Metriken, Code-Version und Datenreferenz enthält.

### 5. Wie gehst du vor, wenn zwei Teammitglieder mit denselben Hyperparametern unterschiedliche Ergebnisse erzielen?

**Antwort:** Ich vergleiche die Run-Metadaten beider Versuche, insbesondere Code-Version und Datenreferenz, um die tatsächliche Ursache der Abweichung zu identifizieren.

### 6. Widersprüchliche Anforderung: Team will schnelle, informelle Experimentiergeschwindigkeit UND vollständige Nachvollziehbarkeit jedes Produktionsmodells — wie gehst du vor?

**Antwort:** Ich würde ein leichtgewichtiges, automatisiertes Tracking (Runs/Artefakte werden automatisch bei jedem Trainingslauf protokolliert, ohne manuellen Zusatzaufwand) etablieren, sodass Experimentiergeschwindigkeit erhalten bleibt, während jede Modellversion beim Übergang in die Registry automatisch vollständig nachvollziehbar bleibt.

## Praktische Labs

~~~python
import mlflow
import mlflow.sklearn
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=200, n_features=5, random_state=0)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)

mlflow.set_experiment("kb-0351-demo")

with mlflow.start_run() as run:
    C = 1.0
    model = LogisticRegression(C=C).fit(X_train, y_train)
    accuracy = model.score(X_test, y_test)

    mlflow.log_param("C", C)
    mlflow.log_metric("test_accuracy", accuracy)
    mlflow.sklearn.log_model(model, "model")

    print(f"Run ID: {run.info.run_id}")
    print(f"Logged param C={C}, test_accuracy={accuracy:.2%}")

    result = mlflow.register_model(
        model_uri=f"runs:/{run.info.run_id}/model",
        name="kb-0351-demo-model",
    )
    print(f"Registered as '{result.name}' version {result.version}")
~~~

## Dependencies, Cross-References und Quellen

1. MLflow-Dokumentation: [MLflow Tracking](https://mlflow.org/docs/latest/tracking.html), abgerufen 2026-09-17.
2. MLflow-Dokumentation: [MLflow Model Registry](https://mlflow.org/docs/latest/model-registry.html), abgerufen 2026-09-17.

Experimentdesign für ML ist kanonisch in [KB-0349](../14-ml-engineering/19-experimentdesign-fuer-ml.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Integrierte MLOps-Plattformen, die Tracking, Registry und Deployment-Übergabe in einem durchgängigen Workflow bündeln | Adopting | Gegenüber getrennten, manuell verknüpften Werkzeugen für Tracking und Deployment für konsistentere Übergaben bevorzugen. |
| Automatisierte Modell-Lineage-Erfassung, die Datenquellen und Code-Versionen direkt mit Runs verknüpft | Evaluating | Gegenüber manueller Dokumentation der Datenherkunft abwägen, sobald die Integration mit bestehenden Datenpipelines ausgereift ist. |

Ein Team akzeptiert eine produktive Modellumstufung erst, wenn die zugehörige Registry-Version vollständig auf einen dokumentierten Run mit Hyperparametern, Metriken und Artefakt zurückverfolgbar ist.
