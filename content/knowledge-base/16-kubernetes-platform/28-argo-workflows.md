---
{"id": "KB-0406", "title": "Argo Workflows", "domain": "16", "sequence": 28, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0388", "concepts": ["Jobs und Batchausführung"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen mehrstufigen Workflow mit DAG-Abhängigkeiten und Artefaktweitergabe zwischen Schritten definieren, und ein Retry-Verhalten bei einem simulierten fehlgeschlagenen Schritt beobachten.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Einen Workflow so gestalten, dass jeder Schritt mit minimal notwendigen Berechtigungen läuft und Parallelitätsgrenzen die Ressourcennutzung eines datenintensiven Batchablaufs kontrollieren.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein hängendes oder fehlerhaftes Workflow-Ergebnis auf einen konkreten, fehlgeschlagenen DAG-Schritt statt auf ein allgemeines Workflow-Problem zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Minimal privilegierte, ressourcenbegrenzte Argo-Workflow-Konfigurationen als Standard für daten- und AI-bezogene Batchabläufe im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene Workflow-Templates und wiederverwendbare Cluster-Workflow-Templates im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis von DAGs, Artefaktweitergabe, Retry und Berechtigungsbegrenzung, nicht jedes Template-Wiederverwendungsmuster."}}, "lab_validation": [{"lab_id": "KB-0406-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes DAG-Modell mit einem fehlgeschlagenen Zwischenschritt und Retry-Verhalten", "evidence": "Ein simulierter mehrstufiger Workflow mit DAG-Abhängigkeiten schlägt bei einem konkreten Zwischenschritt fehl; ein konfiguriertes Retry-Verhalten wiederholt ausschließlich diesen fehlgeschlagenen Schritt (statt den gesamten Workflow neu zu starten), was Ressourcen spart und die Diagnose auf den tatsächlich betroffenen Schritt eingrenzt.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, künstlich konstruiertes DAG-Fehlerszenario."}]}
---
# Argo Workflows

> **Ziel:** Argo Workflows orchestriert mehrstufige, komplexe Batchabläufe als gerichtete azyklische Graphen (DAGs), bei denen jeder Schritt als eigenständiger Kubernetes-Pod ausgeführt wird (aufbauend auf den Job-Grundlagen, siehe [KB-0388](10-jobs-und-batchausfuehrung.md)), mit expliziter Artefaktweitergabe zwischen Schritten. Der zentrale Punkt dieses Kapitels ist die praktische Begrenzung dreier Aspekte für daten- oder AI-bezogene Batchabläufe: Retry-Verhalten (welcher konkrete Schritt bei einem Fehler wiederholt wird), Parallelität (wie viele Schritte gleichzeitig laufen dürfen, um Ressourcen zu kontrollieren), und Berechtigungen (welche minimalen Rechte jeder Schritt tatsächlich benötigt).

## Zweck, Mental Model und Dependencies

Ein Argo-Workflow definiert einen DAG (gerichteter azyklischer Graph), bei dem jeder Knoten ein Schritt ist, der als eigenständiger Kubernetes-Pod ausgeführt wird, und die Kanten die Abhängigkeiten zwischen Schritten definieren (welcher Schritt muss abgeschlossen sein, bevor ein anderer beginnen kann). Artefakte (z. B. Zwischenergebnisse einer Datenverarbeitung, trainierte Modell-Checkpoints) werden explizit zwischen Schritten weitergegeben — ein nachfolgender Schritt deklariert, welche Artefakte eines vorherigen Schritts er als Eingabe benötigt, statt implizit auf einen geteilten Zustand zuzugreifen. Retry-Verhalten kann pro Schritt individuell konfiguriert werden: bei einem fehlgeschlagenen Zwischenschritt wird typischerweise nur dieser konkrete Schritt wiederholt (unter Wiederverwendung bereits erfolgreich abgeschlossener vorheriger Schritte und deren Artefakte), statt den gesamten Workflow von Beginn an neu zu starten — dies spart Rechenzeit und macht die Diagnose eines Fehlers präziser, da klar ist, welcher konkrete Schritt tatsächlich fehlschlägt. Parallelitätsgrenzen begrenzen, wie viele Schritte eines Workflows (oder mehrerer gleichzeitig laufender Workflows) gleichzeitig ausgeführt werden dürfen, was besonders bei ressourcenintensiven, datenverarbeitenden oder AI-Trainings-Batchabläufen wichtig ist, um eine unkontrollierte, gleichzeitige Ressourcenanforderung durch viele parallele Schritte zu vermeiden. Jeder Workflow-Schritt läuft mit einem zugewiesenen Service Account (siehe [KB-0392](14-rbac-und-service-accounts.md)) — dieser sollte minimal privilegiert sein und ausschließlich die für den jeweiligen Schritt tatsächlich benötigten Berechtigungen besitzen, statt einen breit berechtigten, für alle Schritte gemeinsamen Service Account zu verwenden.

~~~text
Argo Workflow: DAG (directed acyclic graph) -- each node = a step, executed as its own Kubernetes pod
  edges = dependencies (which step must complete before another starts)
Artifacts: explicitly passed BETWEEN steps (intermediate data, model checkpoints)
  a downstream step DECLARES which artifacts it needs from an upstream step, not implicit shared state
Retry: configurable PER STEP -- a failed intermediate step retries JUST THAT STEP
  (reusing already-completed prior steps and their artifacts), NOT restarting the whole workflow from scratch
  -> saves compute, precise diagnosis (clear which specific step actually fails)
Parallelism limits: bound how many steps (of one or multiple concurrent workflows) run simultaneously
  -> critical for resource-intensive data/AI training batch jobs -- prevents uncontrolled simultaneous resource demand
Each step runs under an assigned Service Account (cf. KB-0392) -> should be MINIMALLY privileged per step,
  NOT a broadly-permissioned account shared across all steps
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Praktische Kontrolle |
|---|---|---|
| DAG-Schritte | strukturiert einen mehrstufigen Ablauf mit expliziten Abhängigkeiten | jeder Schritt ist ein eigenständiger, isolierter Pod |
| Artefaktweitergabe | überträgt Zwischenergebnisse explizit zwischen Schritten | vermeidet impliziten, schwer nachvollziehbaren geteilten Zustand |
| Retry pro Schritt | wiederholt nur den tatsächlich fehlgeschlagenen Schritt | spart Rechenzeit gegenüber vollständigem Workflow-Neustart |
| Parallelitätsgrenzen | begrenzt gleichzeitig laufende Schritte | verhindert unkontrollierte, gleichzeitige Ressourcenanforderung |
| Minimal privilegierte Service Accounts | begrenzt Berechtigungen pro Schritt | reduziert die Angriffsfläche bei Kompromittierung eines einzelnen Schritts |

Implementierung: Ein komplexer Batchablauf (z. B. Datenextraktion, Transformation, Modelltraining, Evaluation) wird als DAG mit expliziten Abhängigkeiten zwischen den Schritten modelliert, wobei jeder Schritt seine benötigten Eingabe-Artefakte explizit deklariert. Retry-Verhalten wird pro Schritt individuell konfiguriert, basierend auf der jeweiligen Fehleranfälligkeit (z. B. mehr Wiederholungsversuche für Schritte mit Abhängigkeit von externen, potenziell instabilen Diensten). Parallelitätsgrenzen werden basierend auf der tatsächlich verfügbaren Cluster-Kapazität konfiguriert, um zu verhindern, dass viele gleichzeitig laufende Schritte die verfügbaren Ressourcen erschöpfen. Jeder Schritt erhält einen eigenen, minimal privilegierten Service Account, der ausschließlich die für diesen spezifischen Schritt tatsächlich benötigten Berechtigungen besitzt.

## Scalability, Reliability, Security und Observability

Argo Workflows skaliert komplexe Batchverarbeitung proportional zur verfügbaren Cluster-Kapazität und den konfigurierten Parallelitätsgrenzen; die Reliability-Grenze liegt darin, dass fehlendes, pro-Schritt-konfiguriertes Retry-Verhalten proportional zur Häufigkeit transienter Fehler in datenintensiven Abläufen zu unnötig wiederholten, vollständigen Workflow-Neustarts führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Workflow-Fehler führt zu einem vollständigen Neustart aller Schritte, einschließlich bereits erfolgreicher | kein pro-Schritt-Retry-Verhalten wurde konfiguriert, wodurch der gesamte Workflow statt nur des fehlgeschlagenen Schritts wiederholt wird | die Retry-Konfiguration auf schrittspezifisches Retry statt vollständigen Workflow-Neustart umstellen |
| ein Cluster wird durch viele gleichzeitig laufende Workflow-Schritte überlastet | keine Parallelitätsgrenzen wurden konfiguriert | explizite Parallelitätsgrenzen basierend auf der verfügbaren Cluster-Kapazität einführen |
| ein kompromittierter Workflow-Schritt ermöglicht weitreichenden, unerwarteten Zugriff | der Schritt läuft mit einem breit berechtigten, für alle Schritte gemeinsamen Service Account | für jeden Schritt einen dedizierten, minimal privilegierten Service Account konfigurieren |

Security: Minimal privilegierte Service Accounts pro Workflow-Schritt sind besonders wichtig bei Batchabläufen, die potenziell externe, weniger vertrauenswürdige Daten verarbeiten, da ein kompromittierter Schritt sonst weitreichenden Zugriff auf Cluster-Ressourcen erhalten könnte. Observability: Der Status jedes einzelnen DAG-Schritts (erfolgreich, fehlgeschlagen, wiederholt), die Artefaktweitergabe zwischen Schritten, und die tatsächliche Parallelitätsauslastung während eines Workflow-Laufs sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert schrittspezifisches Retry-Verhalten und minimal privilegierte Service Accounts pro Workflow-Schritt. **Principal** macht den Status und die Artefaktweitergabe jedes DAG-Schritts für das Team nachvollziehbar. **Chief** etabliert minimal privilegierte, ressourcenbegrenzte Argo-Workflow-Konfigurationen als Standard für daten- und AI-bezogene Batchabläufe im Unternehmen.

Anti-Patterns: einen vollständigen Workflow-Neustart statt schrittspezifischen Retry bei einem einzelnen fehlgeschlagenen Zwischenschritt durchführen; alle Workflow-Schritte mit demselben, breit berechtigten Service Account betreiben; Workflows ohne Parallelitätsgrenzen in produktionskritischen, ressourcenbeschränkten Clustern ausführen.

## Production Checklist

- [ ] Jeder DAG-Schritt hat ein individuell konfiguriertes, schrittspezifisches Retry-Verhalten.
- [ ] Parallelitätsgrenzen sind basierend auf tatsächlicher Cluster-Kapazität konfiguriert.
- [ ] Jeder Workflow-Schritt läuft mit einem dedizierten, minimal privilegierten Service Account.
- [ ] Artefaktweitergabe zwischen Schritten ist explizit deklariert und nachvollziehbar.

## Interviewfragen

### 1. Was ist ein DAG im Kontext von Argo Workflows?

**Antwort:** Ein gerichteter azyklischer Graph, bei dem jeder Knoten ein Schritt ist, der als eigenständiger Kubernetes-Pod ausgeführt wird, und die Kanten die Abhängigkeiten zwischen den Schritten definieren.

### 2. Warum ist schrittspezifisches Retry-Verhalten effizienter als ein vollständiger Workflow-Neustart?

**Antwort:** Bei einem fehlgeschlagenen Zwischenschritt werden bereits erfolgreich abgeschlossene vorherige Schritte und deren Artefakte wiederverwendet, statt den gesamten Workflow von Beginn an neu auszuführen, was Rechenzeit spart und die Diagnose präzisiert.

### 3. Warum sind Parallelitätsgrenzen bei ressourcenintensiven Batchabläufen wichtig?

**Antwort:** Sie verhindern, dass viele gleichzeitig laufende Schritte die verfügbaren Cluster-Ressourcen unkontrolliert erschöpfen, was besonders bei datenintensiven oder AI-Trainings-Abläufen relevant ist.

### 4. Warum sollte jeder Workflow-Schritt einen eigenen, minimal privilegierten Service Account verwenden?

**Antwort:** Ein kompromittierter Schritt mit minimal notwendigen Berechtigungen kann deutlich weniger Schaden anrichten als ein kompromittierter Schritt mit einem breit berechtigten, für alle Schritte gemeinsam genutzten Service Account.

### 5. Wie gehst du vor, wenn ein Workflow-Fehler zu einem vollständigen Neustart aller Schritte führt, einschließlich bereits erfolgreicher?

**Antwort:** Ich prüfe die Retry-Konfiguration und stelle sicher, dass sie schrittspezifisch statt auf den gesamten Workflow angewendet wird, sodass nur der tatsächlich fehlgeschlagene Schritt wiederholt wird.

### 6. Widersprüchliche Anforderung: Team will schnelle, hochparallele Batchverarbeitung UND garantiert keine Cluster-Überlastung durch gleichzeitige Ressourcenanforderung — wie gehst du vor?

**Antwort:** Ich würde explizite Parallelitätsgrenzen basierend auf der tatsächlich verfügbaren Cluster-Kapazität konfigurieren, die eine hohe, aber begrenzte Anzahl gleichzeitiger Schritte erlauben, sodass die Verarbeitung so schnell wie durch die Kapazität tatsächlich unterstützbar erfolgt, ohne den Cluster durch unbegrenzte Parallelität zu überlasten.

## Praktische Labs

~~~python
class SimulatedWorkflowStep:
    def __init__(self, name, dependencies, will_fail_first_attempt=False):
        self.name = name
        self.dependencies = dependencies
        self.will_fail_first_attempt = will_fail_first_attempt
        self.attempts = 0
        self.completed = False
        self.artifact = None

def run_dag(steps, max_retries=2):
    completed_names = set()
    for step in steps:
        if not all(dep in completed_names for dep in step.dependencies):
            print(f"{step.name}: BLOCKED, waiting on dependencies {step.dependencies}")
            continue
        for attempt in range(1, max_retries + 1):
            step.attempts += 1
            if step.will_fail_first_attempt and attempt == 1:
                print(f"{step.name}: attempt {attempt} FAILED -- retrying just this step, not the whole workflow")
                continue
            step.completed = True
            step.artifact = f"artifact_from_{step.name}"
            completed_names.add(step.name)
            print(f"{step.name}: SUCCEEDED on attempt {attempt}, artifact='{step.artifact}'")
            break

extract = SimulatedWorkflowStep("extract", dependencies=[])
transform = SimulatedWorkflowStep("transform", dependencies=["extract"], will_fail_first_attempt=True)
train = SimulatedWorkflowStep("train", dependencies=["transform"])

run_dag([extract, transform, train])
~~~

## Dependencies, Cross-References und Quellen

1. Argo Workflows-Dokumentation: [Core Concepts](https://argo-workflows.readthedocs.io/en/latest/core-concepts/), abgerufen 2026-09-17.
2. Argo Workflows-Dokumentation: [Retrying Failed or Errored Steps](https://argo-workflows.readthedocs.io/en/latest/retries/), abgerufen 2026-09-17.

Jobs und Batchausführung sind kanonisch in [KB-0388](10-jobs-und-batchausfuehrung.md) behandelt; RBAC und Service Accounts in [KB-0392](14-rbac-und-service-accounts.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Wiederverwendbare, versionierte WorkflowTemplates und ClusterWorkflowTemplates für standardisierte Batchabläufe | Adopting | Gegenüber individuell definierten Workflows pro Anwendungsfall für konsistentere, wartbarere Batchprozesse bevorzugen. |
| Integrierte Artefakt-Speicherung mit automatischer Lebenszyklusverwaltung (z. B. automatisches Löschen alter Artefakte) | Evaluating | Gegenüber manueller Artefaktverwaltung abwägen, sobald der Speicherbedarf durch akkumulierte Artefakte signifikant wird. |

Ein Team akzeptiert eine Argo-Workflow-Konfiguration erst, wenn schrittspezifisches Retry, Parallelitätsgrenzen und minimal privilegierte Service Accounts nachgewiesen sind.
