---
{"id": "KB-0504", "title": "Cloud Run", "domain": "21", "sequence": 6, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0503", "concepts": ["Google Kubernetes Engine"], "needed_for": "understanding"}, {"id": "KB-0488", "concepts": ["Azure Container Apps"], "needed_for": "context"}, {"id": "KB-0471", "concepts": ["ECS und Fargate"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Cloud-Run-Revisionen, Request-basierte Skalierung und Concurrency-Konfiguration anhand offizieller Dokumentation für zustandslose Container-Workloads einrichten können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Anwendung explizit entscheiden, ob Cloud Run geeignet ist (zustandslos, kurze bis mittlere Requestlaufzeiten) oder ob eine langlaufende Prozessanforderung eine andere Compute-Option (Compute Engine, GKE) erfordert.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen unerwarteten Requestabbruch auf eine Überschreitung des konfigurierten Timeout-Limits oder eine fälschliche Annahme von Prozesszustand zwischen Requests zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Compute-Auswahlstandards im Unternehmen anhand einer klaren Abgrenzung zwischen für Cloud Run geeigneten zustandslosen Workloads und langlaufenden Prozessanforderungen festlegen, die eine andere Plattform benötigen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung des Cloud-Run-Request-Routings im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der Zustandslosigkeits- und Concurrency-Anforderungen als Entscheidungsgrundlage, nicht die Routing-Interna."}}, "lab_validation": [{"lab_id": "KB-0504-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Google-Cloud-Dokumentation zu Cloud Run, kein aktives GCP-Konto verwendet", "evidence": "Anhand offizieller Google-Cloud-Dokumentation wird nachvollzogen, wie eine Cloud-Run-Revision eine unveränderliche Bereitstellung eines Container-Images mit fester Konfiguration darstellt, wie Cloud Run Instanzen basierend auf eingehenden Requests automatisch skaliert (einschließlich Skalierung auf null bei fehlendem Traffic), wie Concurrency die Anzahl gleichzeitiger Requests pro Instanz begrenzt, und warum Cloud-Run-Container zustandslos sein müssen, da Instanzen jederzeit beendet werden können.", "limitations": "Kein aktives GCP-Konto verwendet, kein realer Cloud-Run-Dienst bereitgestellt."}]}
---
# Cloud Run

> **Ziel:** Cloud Run ist ein vollständig verwalteter, requestbasiert skalierender Container-Dienst — strukturell vergleichbar mit AWS Fargate (siehe [KB-0471](../19-aws/09-ecs-und-fargate.md)) und Azure Container Apps (siehe [KB-0488](../20-azure/08-azure-container-apps.md)). Eine **Revision** ist eine unveränderliche Bereitstellung eines Container-Images mit fester Konfiguration; neue Deployments erzeugen eine neue Revision, wobei Traffic graduell oder vollständig zwischen Revisionen verschoben werden kann. **Requests** treiben die automatische Skalierung — Cloud Run skaliert Instanzen basierend auf eingehendem Traffic, einschließlich Skalierung auf null Instanzen bei fehlendem Traffic (mit entsprechender Kaltstartlatenz bei der nächsten Anfrage). **Concurrency** begrenzt die Anzahl gleichzeitiger Requests, die eine einzelne Instanz bearbeitet. Der zentrale Punkt dieses Kapitels ist, dass Cloud-Run-Container **zustandslos** sein müssen, da Instanzen jederzeit ohne Vorwarnung beendet werden können — eine langlaufende Prozessanforderung (z. B. ein Prozess, der über Requests hinweg In-Memory-Zustand behält oder mehrere Stunden ununterbrochen laufen muss) ist für Cloud Run grundsätzlich ungeeignet und erfordert eine andere Compute-Option wie Compute Engine oder GKE (siehe [KB-0502](04-compute-engine.md) und [KB-0503](05-google-kubernetes-engine.md)).

## Zweck, Mental Model und Dependencies

Cloud Run adressiert das Problem, containerisierte HTTP-basierte Anwendungen ohne Infrastrukturverwaltung zu betreiben — Entwickler stellen ein Container-Image bereit, und Cloud Run übernimmt Skalierung, Load Balancing und TLS-Terminierung automatisch, ohne dass Nodes oder Cluster verwaltet werden müssen. Eine Revision kapselt eine spezifische, unveränderliche Konfiguration (Container-Image, Umgebungsvariablen, Ressourcenlimits) — dies ermöglicht kontrollierte Rollouts, bei denen Traffic schrittweise von einer alten zu einer neuen Revision verschoben wird, mit der Möglichkeit, bei Problemen sofort zur vorherigen Revision zurückzukehren. Die requestbasierte Skalierung unterscheidet sich fundamental von einer dauerhaft laufenden VM- oder Node-Infrastruktur: Cloud Run kann Instanzen bei fehlendem Traffic vollständig auf null skalieren, was Kosten für ungenutzte Kapazität eliminiert, aber bei der nächsten eingehenden Anfrage eine Kaltstartlatenz verursacht, während neue Instanzen initialisiert werden — für latenzsensitive Anwendungen kann eine minimale Instanzanzahl konfiguriert werden, um Kaltstarts zu vermeiden, was jedoch die Kosteneinsparung durch Skalierung auf null wieder einschränkt. Die Concurrency-Einstellung bestimmt, wie viele gleichzeitige Requests eine einzelne Instanz bearbeitet, bevor eine neue Instanz gestartet wird — eine zu hohe Concurrency-Einstellung für eine CPU-intensive Anwendung kann zu Ressourcenkonkurrenz innerhalb einer Instanz führen, während eine zu niedrige Einstellung unnötig viele Instanzen für leichte, IO-gebundene Anfragen erzeugt. Die grundlegende architektonische Anforderung ist Zustandslosigkeit: Da Cloud-Run-Instanzen jederzeit ohne Vorwarnung beendet werden können (etwa bei Skalierung nach unten), darf eine Anwendung keinen kritischen Zustand ausschließlich im Instanzspeicher halten — jeglicher persistenter Zustand muss in externen Diensten (Datenbanken, Cloud Storage) gehalten werden.

~~~text
Cloud Run: fully managed, REQUEST-based scaling container service
  (parallel to AWS Fargate, KB-0471, and Azure Container Apps, KB-0488)
Revision: IMMUTABLE deployment of a container image + fixed config
  -> new deploy = new revision -> gradual/full traffic shift between revisions -> instant rollback possible
Request-based scaling: instances scale with incoming traffic, CAN SCALE TO ZERO
  -> zero traffic = zero cost, BUT next request pays COLD START latency
  -> min-instance config avoids cold starts but reduces scale-to-zero cost savings
Concurrency: max simultaneous requests PER instance
  -> too high for CPU-heavy app -> resource contention within instance
  -> too low for light IO-bound app -> unnecessarily many instances
CORE ARCHITECTURAL REQUIREMENT: STATELESSNESS
  -> instances can be terminated ANYTIME without warning
  -> NO critical state in instance memory -- persistent state MUST live in external services (DB, Cloud Storage)
  -> long-running process needing continuous execution / in-memory state across requests -> WRONG FIT for Cloud Run
     -> needs Compute Engine (KB-0502) or GKE (KB-0503) instead
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Revision | unveränderliche Bereitstellung mit fester Konfiguration | ermöglicht kontrollierte Rollouts und sofortigen Rollback |
| Requestbasierte Skalierung | Instanzen skalieren mit Traffic, bis auf null | Kosteneinsparung versus Kaltstartlatenz |
| Concurrency | max. gleichzeitige Requests pro Instanz | Trade-off zwischen Ressourcenkonkurrenz und Instanzanzahl |
| Zustandslosigkeit | keine kritische In-Memory-Zustandshaltung | Instanzen können jederzeit beendet werden |

Implementierung: Für jede Anwendung wird explizit geprüft, ob sie zustandslos ist und keine langlaufende, ununterbrochene Prozessanforderung hat, bevor Cloud Run statt Compute Engine oder GKE gewählt wird. Concurrency wird anhand der tatsächlichen Ressourcencharakteristik der Anwendung (CPU- versus IO-gebunden) konfiguriert. Für latenzsensitive Anwendungen wird explizit geprüft, ob eine minimale Instanzanzahl zur Kaltstartvermeidung den Kosten-Trade-off rechtfertigt. Traffic-Verschiebung zwischen Revisionen erfolgt schrittweise mit Überwachung, statt abrupt vollständig auf eine neue Revision umzuschalten.

## Scalability, Reliability, Security und Observability

Cloud Run skaliert die Kapazität proportional zum tatsächlichen Request-Volumen; die Reliability-Grenze liegt darin, dass eine Anwendung mit unerwartetem, nicht-zustandslosem Verhalten proportional zur Instanzterminierungsrate zu Datenverlust oder inkonsistentem Verhalten führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Requests werden unerwartet abgebrochen | das konfigurierte Timeout-Limit wird von der tatsächlichen Verarbeitungszeit überschritten | das Timeout-Limit gegen die tatsächliche Verarbeitungszeit der Anwendung prüfen |
| Daten gehen zwischen Requests unerwartet verloren | die Anwendung hält kritischen Zustand im Instanzspeicher statt in einem externen Dienst | prüfen, ob persistenter Zustand konsequent in externe Dienste ausgelagert wird |
| hohe Latenz bei sporadischem Traffic | Instanzen skalieren auf null und die nächste Anfrage erleidet Kaltstartlatenz | eine minimale Instanzanzahl konfigurieren, falls die Latenzanforderung dies rechtfertigt |

Security: Cloud-Run-Dienste sollten mit minimalen IAM-Berechtigungen über einen dedizierten Service Account statt eines breiten Standard-Service-Accounts konfiguriert werden. Observability: Die tatsächliche Kaltstartrate relativ zur Latenzanforderung, die Concurrency-Auslastung pro Instanz, und die Traffic-Verteilung zwischen Revisionen während eines Rollouts sind zentrale Betriebssignale.

## Trade-offs und Entscheidungen

**Staff** konfiguriert Concurrency und Skalierungsparameter für einen gegebenen Cloud-Run-Dienst korrekt. **Principal** entscheidet, ob Cloud Run oder eine andere Compute-Option (Compute Engine, GKE) für eine konkrete Anwendung geeignet ist, basierend auf Zustandslosigkeits- und Laufzeitanforderungen. **Chief** legt Compute-Auswahlstandards im Unternehmen fest, die zustandslose Workloads klar von langlaufenden Prozessanforderungen abgrenzen.

Anti-Patterns: eine Anwendung mit kritischem In-Memory-Zustand oder langlaufenden, ununterbrochenen Prozessen auf Cloud Run betreiben; Concurrency ohne Rücksicht auf die tatsächliche Ressourcencharakteristik der Anwendung konfigurieren; Traffic abrupt und ohne Überwachung vollständig auf eine neue Revision umschalten.

## Production Checklist

- [ ] Jede auf Cloud Run betriebene Anwendung ist explizit auf Zustandslosigkeit geprüft.
- [ ] Concurrency ist anhand der tatsächlichen Ressourcencharakteristik konfiguriert.
- [ ] Für latenzsensitive Anwendungen ist die Notwendigkeit einer minimalen Instanzanzahl gegen die Kosteneinsparung durch Skalierung auf null abgewogen.
- [ ] Traffic-Verschiebung zwischen Revisionen erfolgt schrittweise mit Überwachung.

## Interviewfragen

### 1. Was ist eine Revision in Cloud Run?

**Antwort:** Eine unveränderliche Bereitstellung eines Container-Images mit fester Konfiguration, die kontrollierte Rollouts und sofortigen Rollback ermöglicht.

### 2. Warum müssen Cloud-Run-Container zustandslos sein?

**Antwort:** Weil Instanzen jederzeit ohne Vorwarnung beendet werden können, etwa bei Skalierung nach unten oder auf null — kritischer Zustand darf daher nicht ausschließlich im Instanzspeicher gehalten werden.

### 3. Was ist der Trade-off zwischen Skalierung auf null und minimaler Instanzanzahl?

**Antwort:** Skalierung auf null eliminiert Kosten bei fehlendem Traffic, verursacht aber Kaltstartlatenz bei der nächsten Anfrage; eine minimale Instanzanzahl vermeidet Kaltstarts, reduziert aber die Kosteneinsparung.

### 4. Für welche Art von Anwendung ist Cloud Run ungeeignet?

**Antwort:** Für Anwendungen mit langlaufenden, ununterbrochenen Prozessanforderungen oder solche, die kritischen Zustand über Requests hinweg im Instanzspeicher halten müssen — diese benötigen Compute Engine oder GKE.

### 5. Wie gehst du vor, wenn Daten zwischen Requests unerwartet verloren gehen?

**Antwort:** Ich prüfe, ob die Anwendung kritischen Zustand im Instanzspeicher statt in einem externen, persistenten Dienst hält, da Cloud-Run-Instanzen jederzeit beendet werden können.

### 6. Widersprüchliche Anforderung: Team will maximale Kosteneinsparung durch Skalierung auf null UND garantiert niedrige Latenz für jede einzelne Anfrage — wie gehst du vor?

**Antwort:** Ich würde erklären, dass Skalierung auf null und garantiert niedrige Latenz für jede Anfrage sich strukturell widersprechen, da Kaltstarts unvermeidlich Latenz verursachen, und vorschlagen, eine minimale Instanzanzahl gezielt für latenzkritische Endpunkte zu konfigurieren, während weniger kritische Endpunkte weiterhin auf null skalieren.

## Praktische Labs

~~~python
# Conceptual Cloud Run suitability check based on statelessness and runtime requirements (not executed against a real GCP account):

def is_cloud_run_suitable(is_stateless, max_request_duration_minutes, needs_continuous_background_process):
    if needs_continuous_background_process:
        return False, "long-running continuous process -- use Compute Engine or GKE instead"
    if not is_stateless:
        return False, "critical in-memory state -- move state to external service or use a different compute option"
    if max_request_duration_minutes > 60:
        return False, "request duration exceeds typical Cloud Run limits -- verify current timeout limits"
    return True, "suitable for Cloud Run"

apps = [
    {"is_stateless": True, "max_request_duration_minutes": 2, "needs_continuous_background_process": False},
    {"is_stateless": False, "max_request_duration_minutes": 1, "needs_continuous_background_process": False},
]

for app in apps:
    print(is_cloud_run_suitable(**app))
~~~

## Dependencies, Cross-References und Quellen

1. Google-Cloud-Dokumentation: [Cloud Run Overview](https://cloud.google.com/run/docs/overview/what-is-cloud-run), abgerufen 2026-09-18.
2. Google-Cloud-Dokumentation: [About Container Instance Autoscaling](https://cloud.google.com/run/docs/about-instance-autoscaling), abgerufen 2026-09-18.

Google Kubernetes Engine ist kanonisch in [KB-0503](05-google-kubernetes-engine.md) behandelt; ECS und Fargate in [KB-0471](../19-aws/09-ecs-und-fargate.md); Azure Container Apps in [KB-0488](../20-azure/08-azure-container-apps.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte GPU-Unterstützung in Cloud Run für kurzlebige Inferenz-Workloads ohne dedizierte GKE-Infrastruktur | Evaluating | Gegenüber GKE für Inferenz-Workloads erst nach Prüfung, ob die Zustandslosigkeits- und Laufzeitanforderungen des konkreten Modells tatsächlich zu Cloud Run passen, bevorzugen. |

Ein Team akzeptiert eine Cloud-Run-Bereitstellung erst, wenn die Anwendung nachweislich zustandslos ist und keine langlaufende, ununterbrochene Prozessanforderung besteht, die eine andere Compute-Option erfordern würde.
