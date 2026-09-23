---
{"id": "KB-0430", "title": "Ray Serve", "domain": "17", "sequence": 18, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "MLOPS"], "requires": [{"id": "KB-0355", "concepts": ["Ray Tune und verteilte Experimente"], "needed_for": "understanding"}, {"id": "KB-0429", "concepts": ["KServe, Plattformintegration"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Ray-Serve-Deployment-Definition mit mehreren Replicas anhand offizieller Dokumentation erstellen und erklären können, wie ein Requestgraph mehrere Deployments zu einem zusammengesetzten Inferenzdienst verkettet.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Bewerten, wann Ray Serve gegenüber spezialisierten Inferenz-Servern (z. B. Triton, vLLM) für einen zusammengesetzten, Python-lastigen Inferenzdienst mit heterogener Verarbeitungslogik angemessen ist.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Zustandsinkonsistenz bei der Skalierung von Ray-Serve-Replicas auf eine fehlerhafte Annahme über gemeinsam genutzten, replica-lokalen Zustand zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Den Einsatz von Ray Serve gegenüber spezialisierten Inferenz-Engines im Unternehmen anhand der tatsächlichen Anforderungen an verteilte Python-Verarbeitungslogik statt anhand allgemeiner Popularität entscheiden.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung des Ray-Object-Store und der Aktorplatzierung im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Deployments, Requestgraphen und Ressourcensteuerung als Entscheidungsgrundlage, nicht die Ray-Core-Interna."}}, "lab_validation": [{"lab_id": "KB-0430-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Konzeptuelle Einordnung anhand offizieller Ray-Serve-Dokumentation, kein aktives Cluster-Deployment verwendet", "evidence": "Anhand der offiziellen Ray-Serve-Dokumentation wird nachvollzogen, wie Deployments als replizierbare Verarbeitungseinheiten definiert werden, wie ein Requestgraph mehrere Deployments zu einer zusammengesetzten Pipeline verkettet, und wie Ressourcensteuerung (CPU/GPU pro Replica) konfiguriert wird.", "limitations": "Kein reales Cluster-Deployment getestet, keine realen Skalierungs- oder Latenzmessungen erhoben."}]}
---
# Ray Serve

> **Ziel:** Ray Serve ist ein Framework für verteiltes Model-Serving auf Basis von Ray, das Inferenzlogik als Deployments (replizierbare, in Python geschriebene Verarbeitungseinheiten) definiert, die über einen Requestgraphen zu zusammengesetzten Inferenzdiensten verkettet werden können — z. B. eine Pipeline aus Vorverarbeitung, mehreren Modellaufrufen und Nachverarbeitung, jeweils als eigenes, unabhängig skalierbares Deployment. Der zentrale Punkt dieses Kapitels ist, dass Ray Serve primär dann einen Vorteil gegenüber spezialisierten Inferenz-Servern (z. B. Triton, siehe [KB-0419](07-nvidia-triton.md), oder vLLM) bietet, wenn die tatsächliche Verarbeitungslogik heterogen und Python-lastig ist (z. B. komplexe, individuelle Vor-/Nachverarbeitungsschritte, Aufrufe unterschiedlicher externer Dienste) — für reine, homogene Modellinferenz ohne komplexe Zwischenlogik sind spezialisierte Inferenz-Engines oft effizienter.

## Zweck, Mental Model und Dependencies

Ein Ray-Serve-Deployment kapselt eine Verarbeitungseinheit (z. B. ein Modell oder eine benutzerdefinierte Vor-/Nachverarbeitungsfunktion) und kann unabhängig von anderen Deployments horizontal skaliert werden, indem die Anzahl der Replicas erhöht oder verringert wird. Ein Requestgraph (auch Deployment-Graph) verkettet mehrere Deployments zu einer Pipeline, wobei jedes Deployment eigene Ressourcenanforderungen (CPU, GPU, Speicher) definieren kann — dies ermöglicht es, rechenintensive Modellaufrufe mit GPU-Ressourcen und leichtgewichtige Vor-/Nachverarbeitungsschritte ohne GPU-Zuweisung im selben zusammengesetzten Dienst zu kombinieren. Da Ray Serve auf dem verteilten Ray-Framework aufbaut, wird Zustand standardmäßig nicht automatisch zwischen Replicas eines Deployments geteilt — jede Replica ist eine unabhängige Instanz, und gemeinsamer Zustand (z. B. ein Cache) muss explizit über Ray-eigene Mechanismen (z. B. den Ray Object Store oder externe Speicher) verwaltet werden, statt implizit als geteilter, replica-lokaler Zustand angenommen zu werden. Der zentrale methodische Punkt ist, dass der Vorteil von Ray Serve proportional zur tatsächlichen Komplexität und Heterogenität der Verarbeitungslogik steigt — bei einer einzelnen, homogenen Modellinferenz ohne komplexe Zwischenschritte bietet ein spezialisierter Inferenz-Server typischerweise eine effizientere, einfacher zu betreibende Lösung.

~~~text
Ray Serve Deployment: encapsulates ONE processing unit (model OR custom pre/postprocessing function)
  scales INDEPENDENTLY via replica count
Request graph: chains MULTIPLE deployments into a pipeline
  each deployment declares its OWN resource needs (CPU/GPU/memory)
  -> mix GPU-heavy model calls WITH lightweight, no-GPU pre/postprocessing in one composed service
IMPORTANT: state is NOT automatically shared across replicas of a deployment
  each replica = independent instance; shared state needs EXPLICIT mechanism (Ray Object Store, external store)
KEY METHODOLOGICAL POINT: Ray Serve's advantage scales with ACTUAL heterogeneity/complexity of processing logic
  single, homogeneous model inference w/o complex intermediate steps -> specialized inference server typically more efficient
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Deployment | replizierbare, in Python geschriebene Verarbeitungseinheit | unabhängig skalierbar, eigene Ressourcenanforderungen |
| Requestgraph | verkettet mehrere Deployments zu einer Pipeline | ermöglicht heterogene, zusammengesetzte Inferenzdienste |
| Ressourcensteuerung | CPU/GPU-Zuweisung pro Deployment | muss zur tatsächlichen Rechenanforderung jedes Verarbeitungsschritts passen |
| Zustandslosigkeit über Replicas | keine automatische Zustandsteilung zwischen Replicas | geteilter Zustand erfordert explizite Mechanismen |

Implementierung: Vor der Wahl von Ray Serve gegenüber einem spezialisierten Inferenz-Server wird geprüft, ob die tatsächliche Verarbeitungslogik heterogene, Python-lastige Zwischenschritte (individuelle Vor-/Nachverarbeitung, Aufrufe externer Dienste) erfordert, die in einer spezialisierten Engine schwerer abzubilden wären. Jedes Deployment im Requestgraphen wird mit den seiner tatsächlichen Verarbeitungslast entsprechenden Ressourcenanforderungen konfiguriert (GPU nur für rechenintensive Modellaufrufe, nicht pauschal für alle Deployments). Bei Skalierungsentscheidungen wird explizit geprüft, ob ein Deployment zustandslos ist oder gemeinsamen Zustand über Replicas hinweg benötigt, um zu vermeiden, dass eine implizite Annahme über geteilten, replica-lokalen Zustand bei der Skalierung zu Inkonsistenzen führt.

## Scalability, Reliability, Security und Observability

Ray Serve skaliert die Verarbeitungskapazität jedes Deployments unabhängig proportional zur konfigurierten Replica-Anzahl; die Reliability-Grenze liegt darin, dass eine fehlerhafte Annahme über geteilten, replica-lokalen Zustand proportional zur Anzahl der Replicas zu inkonsistentem Verhalten bei der Skalierung führt, wenn Zustand nicht explizit über geeignete Mechanismen verwaltet wird.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| nach einer Skalierung (mehr Replicas) verhält sich der Dienst inkonsistent | ein Deployment geht implizit von geteiltem, replica-lokalem Zustand aus, der tatsächlich nicht automatisch geteilt wird | den Zustandsverwaltungsmechanismus des Deployments prüfen und gegebenenfalls auf einen expliziten, geteilten Speicher umstellen |
| die GPU-Auslastung ist unerwartet niedrig trotz hoher Anfragelast | ein rechenintensives Deployment im Requestgraphen ist unterdimensioniert (zu wenige Replicas oder zu geringe Ressourcenzuweisung) | die Ressourcenzuweisung und Replica-Anzahl dieses spezifischen Deployments erhöhen |
| der Betriebsaufwand für Ray Serve übersteigt den Nutzen gegenüber einer spezialisierten Inferenz-Engine | die tatsächliche Verarbeitungslogik ist homogen genug, um von einer spezialisierten Engine effizienter bedient zu werden | den tatsächlichen Bedarf an heterogener, Python-lastiger Verarbeitungslogik neu bewerten |

Security: Deployments, die externe Dienste aufrufen oder Nutzerdaten in Zwischenschritten verarbeiten, sollten mit denselben Zugriffskontroll- und Datenschutzmaßnahmen wie andere produktive Serviceverbindungen abgesichert werden. Observability: Die Latenz und Auslastung jedes einzelnen Deployments im Requestgraphen getrennt, sowie die End-to-End-Latenz der gesamten Pipeline, sind zentrale Metriken zur Bewertung von Engpässen.

## Trade-offs und Entscheidungen

**Staff** wählt Ray Serve gezielt für Anwendungsfälle mit tatsächlich heterogener, Python-lastiger Verarbeitungslogik, statt es pauschal für jede Modellinferenz einzusetzen. **Principal** macht die Abwägung zwischen Ray Serve und spezialisierten Inferenz-Engines für das Team nachvollziehbar. **Chief** entscheidet den Einsatz von Ray Serve im Unternehmen anhand der tatsächlichen Anforderungen an verteilte, zusammengesetzte Verarbeitungslogik.

Anti-Patterns: Ray Serve für eine einzelne, homogene Modellinferenz ohne komplexe Zwischenlogik einsetzen, wo eine spezialisierte Inferenz-Engine effizienter wäre; implizit von geteiltem Zustand zwischen Replicas ausgehen, ohne einen expliziten Zustandsverwaltungsmechanismus zu implementieren; Ressourcenzuweisungen pauschal für alle Deployments im Requestgraphen identisch konfigurieren, unabhängig von deren tatsächlicher Rechenanforderung.

## Production Checklist

- [ ] Die tatsächliche Verarbeitungslogik rechtfertigt Ray Serve gegenüber einer spezialisierten Inferenz-Engine.
- [ ] Jedes Deployment im Requestgraphen ist mit seiner tatsächlichen Ressourcenanforderung konfiguriert.
- [ ] Zustandsverwaltung über Replicas hinweg ist explizit implementiert, wo geteilter Zustand benötigt wird.
- [ ] Latenz und Auslastung jedes Deployments werden getrennt überwacht.

## Interviewfragen

### 1. Was ist ein Deployment in Ray Serve?

**Antwort:** Eine replizierbare, in Python geschriebene Verarbeitungseinheit, die unabhängig von anderen Deployments skaliert werden kann und eigene Ressourcenanforderungen definiert.

### 2. Was ist ein Requestgraph, und welches Problem löst er?

**Antwort:** Er verkettet mehrere Deployments zu einer zusammengesetzten Pipeline, sodass heterogene Verarbeitungsschritte (z. B. Vorverarbeitung, Modellaufruf, Nachverarbeitung) mit jeweils unterschiedlichen Ressourcenanforderungen im selben Dienst kombiniert werden können.

### 3. Wann ist Ray Serve gegenüber einem spezialisierten Inferenz-Server wie Triton angemessen?

**Antwort:** Wenn die tatsächliche Verarbeitungslogik heterogen und Python-lastig ist (individuelle Vor-/Nachverarbeitung, Aufrufe externer Dienste); für homogene, reine Modellinferenz ohne komplexe Zwischenlogik ist eine spezialisierte Engine oft effizienter.

### 4. Wird Zustand automatisch zwischen Replicas eines Ray-Serve-Deployments geteilt?

**Antwort:** Nein, jede Replica ist eine unabhängige Instanz; geteilter Zustand muss explizit über Mechanismen wie den Ray Object Store oder externe Speicher verwaltet werden.

### 5. Wie gehst du vor, wenn sich ein Dienst nach einer Skalierung (mehr Replicas) inkonsistent verhält?

**Antwort:** Ich prüfe, ob ein Deployment implizit von geteiltem, replica-lokalem Zustand ausgeht, der tatsächlich nicht automatisch geteilt wird, und stelle die Zustandsverwaltung gegebenenfalls auf einen expliziten, geteilten Mechanismus um.

### 6. Widersprüchliche Anforderung: Team will eine einzelne Modellinferenz mit minimalem Betriebsaufwand UND die Flexibilität, später komplexe, mehrstufige Pipelines hinzuzufügen — wie gehst du vor?

**Antwort:** Ich würde für die aktuelle, einzelne Modellinferenz eine spezialisierte Inferenz-Engine empfehlen, da sie geringeren Betriebsaufwand bedeutet, und den Wechsel zu Ray Serve erst dann vorschlagen, wenn tatsächlich heterogene, mehrstufige Verarbeitungslogik benötigt wird, statt die zusätzliche Komplexität vorab ohne konkreten Bedarf einzuführen.

## Praktische Labs

~~~python
# Conceptual Ray Serve deployment/request-graph structure (not executed against a real Ray cluster):

deployments = {
    "preprocess": {"replicas": 3, "resources": {"cpu": 1}},
    "model_inference": {"replicas": 2, "resources": {"cpu": 2, "gpu": 1}},
    "postprocess": {"replicas": 3, "resources": {"cpu": 1}},
}

def estimate_pipeline_capacity(deployments, latency_per_stage_ms):
    # rough approximation: pipeline throughput is bounded by the slowest stage's effective capacity
    stage_capacities = {
        name: (cfg["replicas"] * 1000) / latency_per_stage_ms[name]
        for name, cfg in deployments.items()
    }
    bottleneck = min(stage_capacities, key=stage_capacities.get)
    return {
        "stage_capacities_req_per_sec": {k: round(v, 1) for k, v in stage_capacities.items()},
        "bottleneck_stage": bottleneck,
    }

latency_per_stage_ms = {"preprocess": 10, "model_inference": 80, "postprocess": 5}
result = estimate_pipeline_capacity(deployments, latency_per_stage_ms)
print(result)
~~~

## Dependencies, Cross-References und Quellen

1. Ray-Dokumentation: [Ray Serve — Key Concepts](https://docs.ray.io/en/latest/serve/key-concepts.html), abgerufen 2026-09-17.
2. Ray-Dokumentation: [Ray Serve — Resource Allocation](https://docs.ray.io/en/latest/serve/resource-allocation.html), abgerufen 2026-09-17.

Ray Tune ist kanonisch in [KB-0355](../15-mlops-evaluation/05-ray-tune-und-verteilte-experimente.md) behandelt; NVIDIA Triton in [KB-0419](07-nvidia-triton.md), Plattformintegration in [KB-0429](17-kserve.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Native Integration von Ray Serve mit LLM-spezifischen Serving-Optimierungen (z. B. kontinuierliches Batching über Ray-Deployments hinweg) | Evaluating | Gegenüber dem Einsatz spezialisierter LLM-Serving-Engines innerhalb eines Ray-Serve-Deployments erst nach Vergleich der gemessenen Effizienz bevorzugen. |

Ein Team akzeptiert die Einführung von Ray Serve erst, wenn ein tatsächlicher, dokumentierter Bedarf an heterogener, Python-lastiger, zusammengesetzter Verarbeitungslogik nachgewiesen ist, der eine spezialisierte Inferenz-Engine nicht ebenso effizient abdecken würde.
