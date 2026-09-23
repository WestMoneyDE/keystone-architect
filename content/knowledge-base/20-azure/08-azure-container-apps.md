---
{"id": "KB-0488", "title": "Azure Container Apps", "domain": "20", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI", "ENTERPRISE"], "requires": [{"id": "KB-0487", "concepts": ["Azure Kubernetes Service"], "needed_for": "understanding"}, {"id": "KB-0471", "concepts": ["ECS und Fargate"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Container-App mit mehreren Revisionen und ereignisbasierter Skalierung (z. B. über KEDA-basierte Skalierungsregeln) anhand offizieller Dokumentation konfigurieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für einen konkreten Anwendungsfall begründet zwischen Azure Container Apps, AKS und einfachen Webdiensten (z. B. App Service) entscheiden, basierend auf dem tatsächlichen Bedarf an Kubernetes-API-Kontrolle gegenüber Betriebseinfachheit.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete, gleichzeitige Aktivität mehrerer Revisionen einer Container-App auf eine fehlerhaft konfigurierte Traffic-Splitting-Regel zurückführen können, statt einen Deployment-Fehler anzunehmen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Container-Plattformrichtlinien im Unternehmen anhand des tatsächlichen Bedarfs an Kubernetes-API-Kontrolle gegenüber vereinfachter, serverloser Container-Bereitstellung statt anhand einer pauschalen AKS-Präferenz festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der zugrunde liegenden Kubernetes-/KEDA-Infrastruktur von Container Apps im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Revisionsmodellen, Umgebungen und ereignisbasierter Skalierung als Entscheidungsgrundlage, nicht die zugrunde liegende Infrastruktur-Interna."}}, "lab_validation": [{"lab_id": "KB-0488-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Azure-Container-Apps-Dokumentation, kein aktives Azure-Konto verwendet", "evidence": "Anhand offizieller Microsoft-Dokumentation wird nachvollzogen, wie Azure Container Apps auf zugrunde liegender Kubernetes- und KEDA-Infrastruktur aufbaut, ohne dem Kunden direkten Kubernetes-API-Zugriff zu gewähren, wie Revisionen mehrere Versionen einer Container-App parallel betreiben und über Traffic-Splitting-Regeln steuern, welchen Anteil des Datenverkehrs jede Revision erhält, und wie ereignisbasierte Skalierung (z. B. basierend auf Warteschlangenlänge) über KEDA-Skalierungsregeln konfiguriert wird.", "limitations": "Kein aktives Azure-Konto verwendet, keine reale Container-Apps-Konfiguration erstellt."}]}
---
# Azure Container Apps

> **Ziel:** Azure Container Apps positioniert sich zwischen Azure Kubernetes Service (siehe [KB-0487](07-azure-kubernetes-service.md), volle Kubernetes-API-Kontrolle, höherer Betriebsaufwand) und einfachen Webdiensten (z. B. App Service, minimale Konfiguration, aber eingeschränkte Container-Orchestrierungsfähigkeiten) — es baut auf zugrunde liegender Kubernetes- und KEDA-Infrastruktur auf, ohne dem Kunden direkten Kubernetes-API-Zugriff zu gewähren, was den Betriebsaufwand gegenüber AKS erheblich reduziert (vergleichbar mit dem Verhältnis zwischen ECS/Fargate und EKS bei AWS, siehe [KB-0471](../19-aws/09-ecs-und-fargate.md)), jedoch auch die Kontrolltiefe einschränkt. Der zentrale Punkt dieses Kapitels ist, dass Container Apps ein Revisionsmodell nutzt, bei dem mehrere Versionen (Revisionen) derselben Container-App gleichzeitig aktiv sein können, wobei Traffic-Splitting-Regeln explizit festlegen, welcher Anteil des eingehenden Datenverkehrs an welche Revision geht — eine unerwartete, gleichzeitige Aktivität mehrerer Revisionen (statt einer sauberen, vollständigen Umstellung auf die neue Version) ist typischerweise auf eine fehlerhaft konfigurierte oder unvollständig abgeschlossene Traffic-Splitting-Regel zurückzuführen, nicht auf einen allgemeinen Deployment-Fehler.

## Zweck, Mental Model und Dependencies

Azure Container Apps abstrahiert die zugrunde liegende Kubernetes-Infrastruktur vollständig — der Kunde definiert eine Container-App (Container-Image, Ressourcenanforderungen, Umgebungsvariablen) und eine Umgebung (eine gemeinsam genutzte, isolierte Grenze für mehrere Container-Apps, die z. B. dasselbe VNet und dieselbe Log-Analytics-Konfiguration teilen), ohne selbst Kubernetes-Ressourcen wie Pods oder Deployments direkt zu verwalten. Ein Revisionsmodell erlaubt es, dass bei jeder Aktualisierung einer Container-App eine neue Revision erstellt wird, während die vorherige Revision zunächst weiterhin aktiv bleiben kann — dies ermöglicht kontrollierte Rollout-Strategien wie Blue-Green-Deployments oder schrittweise Traffic-Verlagerung, bei denen explizite Traffic-Splitting-Regeln festlegen, welcher prozentuale Anteil des eingehenden Datenverkehrs an die alte versus die neue Revision geleitet wird. Ereignisbasierte Skalierung nutzt KEDA (Kubernetes Event-Driven Autoscaling) im Hintergrund, um die Anzahl laufender Instanzen einer Container-App basierend auf externen Ereignisquellen zu skalieren (z. B. die Länge einer Nachrichtenwarteschlange, statt ausschließlich auf CPU-/Speicherauslastung basierend zu skalieren wie bei klassischem Kubernetes-HPA) — dies ermöglicht eine präzisere Skalierung für ereignisgetriebene Workloads, deren tatsächliche Last sich nicht direkt in CPU-/Speicherauslastung widerspiegelt. Der zentrale methodische Punkt ist, dass eine unerwartete, gleichzeitige Aktivität mehrerer Revisionen einer Container-App (bei der Nutzer inkonsistent unterschiedliche Versionen der Anwendung erleben) typischerweise nicht auf einen fundamentalen Deployment-Fehler zurückzuführen ist, sondern auf eine Traffic-Splitting-Regel, die entweder fehlerhaft konfiguriert wurde (z. B. ein nicht vollständig auf 100% umgestellter Traffic-Anteil) oder deren vollständige Umstellung auf die neue Revision schlicht noch nicht abgeschlossen wurde — dieses Verhalten ist bei korrektem Verständnis des Revisionsmodells erwartbar und beabsichtigt, nicht fehlerhaft, solange die Traffic-Splitting-Konfiguration tatsächlich dem beabsichtigten Rollout-Plan entspricht.

~~~text
Azure Container Apps: sits BETWEEN AKS (full K8s API control, higher ops burden)
  and simple web services (App Service: minimal config, limited orchestration)
  built on underlying Kubernetes + KEDA infra, but NO direct Kubernetes API access for the customer
  (parallel to ECS/Fargate vs. EKS at AWS, see KB-0471)
Environment: shared, isolated boundary for multiple Container Apps (shared VNet, Log Analytics)
Revision model: EACH update creates a NEW revision
  PREVIOUS revision can stay ACTIVE simultaneously -> enables Blue-Green / gradual traffic shift
  Traffic-splitting rules: EXPLICITLY define what % of incoming traffic goes to OLD vs. NEW revision
Event-driven scaling: KEDA-based -- scales on EXTERNAL event sources (e.g. queue length)
  NOT limited to CPU/memory like classic Kubernetes HPA
  -> more precise scaling for event-driven workloads whose real load isn't reflected in CPU/memory
KEY METHODOLOGICAL POINT: unexpected simultaneous activity of MULTIPLE revisions
  (users inconsistently experiencing different app versions)
  typically NOT a fundamental deployment bug
  -> traceable to a MISCONFIGURED or INCOMPLETE traffic-splitting rule
     -- EXPECTED, INTENDED behavior of the revision model when config matches actual rollout intent
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Container-App und Umgebung | zugrunde liegende Kubernetes-Infrastruktur abstrahiert | kein direkter Kubernetes-API-Zugriff für den Kunden |
| Revision | mehrere Versionen derselben App parallel aktiv | ermöglicht kontrollierte Rollout-Strategien |
| Traffic-Splitting-Regel | steuert Verkehrsverteilung zwischen Revisionen | falsche Konfiguration führt zu unerwarteter, gemischter Revisionsaktivität |
| Ereignisbasierte Skalierung (KEDA) | skaliert basierend auf externen Ereignisquellen | präziser als reine CPU-/Speicherbasierte Skalierung für ereignisgetriebene Workloads |

Implementierung: Vor der Wahl zwischen Container Apps und AKS wird geprüft, ob tatsächlich direkter Kubernetes-API-Zugriff (z. B. für spezifische Operatoren oder Custom Resource Definitions) benötigt wird, oder ob die vereinfachte, serverlose Bereitstellung von Container Apps ausreichend ist. Bei jedem Rollout einer neuen Revision wird die Traffic-Splitting-Regel explizit und vollständig konfiguriert, mit klarer Dokumentation des beabsichtigten Übergangs (schrittweise oder vollständige Umstellung), statt eine unvollständige Konfiguration unbeachtet zu lassen. Für ereignisgetriebene Workloads wird KEDA-basierte, ereignisquellenbasierte Skalierung eingesetzt, statt sich ausschließlich auf CPU-/Speicherbasierte Skalierungsmetriken zu verlassen, die die tatsächliche Last solcher Workloads oft unzureichend widerspiegeln.

## Scalability, Reliability, Security und Observability

Azure Container Apps skaliert die Betriebseinfachheit für containerisierte Anwendungen proportional zur Delegation der Kubernetes-Infrastrukturverantwortung an Azure; die Reliability-Grenze liegt darin, dass eine unvollständig oder fehlerhaft konfigurierte Traffic-Splitting-Regel proportional zur betroffenen Nutzeranzahl zu inkonsistenter, gemischter Erfahrung unterschiedlicher Anwendungsversionen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Nutzer erleben inkonsistent unterschiedliche Versionen derselben Anwendung gleichzeitig | die Traffic-Splitting-Regel ist nicht vollständig auf die neue Revision umgestellt oder fehlerhaft konfiguriert | die Traffic-Splitting-Konfiguration gegen den beabsichtigten Rollout-Plan prüfen |
| eine ereignisgetriebene Anwendung skaliert nicht wie erwartet bei steigender Ereignislast | die Skalierungsregel basiert auf CPU-/Speicherauslastung statt auf der tatsächlichen Ereignisquelle | eine KEDA-basierte, ereignisquellenbasierte Skalierungsregel konfigurieren |
| ein Team benötigt spezifische Kubernetes-Operatoren oder Custom Resource Definitions, die mit Container Apps nicht kompatibel sind | Container Apps wurde für einen Anwendungsfall gewählt, der tatsächlich direkten Kubernetes-API-Zugriff benötigt | den tatsächlichen Bedarf an Kubernetes-API-Kontrolle neu bewerten und gegebenenfalls zu AKS migrieren |

Security: Container Apps innerhalb derselben Umgebung teilen bestimmte Infrastrukturaspekte (z. B. VNet); die Zugriffskontrolle zwischen Container Apps innerhalb einer Umgebung sollte explizit geprüft werden, insbesondere bei unterschiedlichen Vertrauensstufen der jeweiligen Anwendungen. Observability: Die tatsächliche Traffic-Verteilung zwischen aktiven Revisionen, die Skalierungsaktivität relativ zu den konfigurierten Ereignisquellen, und die Dauer, in der mehrere Revisionen gleichzeitig aktiv sind, sind zentrale Metriken zur Bewertung der Container-Apps-Nutzung.

## Trade-offs und Entscheidungen

**Staff** konfiguriert Traffic-Splitting-Regeln bei jedem Rollout explizit und vollständig entsprechend dem beabsichtigten Übergangsplan. **Principal** macht das Revisionsmodell und dessen Konfiguration für das Team nachvollziehbar. **Chief** legt Container-Plattformrichtlinien im Unternehmen anhand des tatsächlichen Bedarfs an Kubernetes-API-Kontrolle fest.

Anti-Patterns: Traffic-Splitting-Regeln bei einem Rollout unvollständig konfigurieren und dadurch unbeabsichtigte, gemischte Revisionsaktivität riskieren; Container Apps für einen Anwendungsfall wählen, der tatsächlich direkten Kubernetes-API-Zugriff benötigt; ereignisgetriebene Workloads ausschließlich mit CPU-/Speicherbasierter statt ereignisquellenbasierter Skalierung konfigurieren.

## Production Checklist

- [ ] Traffic-Splitting-Regeln sind bei jedem Rollout explizit und vollständig entsprechend dem Rollout-Plan konfiguriert.
- [ ] Die Wahl zwischen Container Apps und AKS ist anhand des tatsächlichen Bedarfs an Kubernetes-API-Kontrolle begründet.
- [ ] Ereignisgetriebene Workloads nutzen KEDA-basierte, ereignisquellenbasierte Skalierung.
- [ ] Die Dauer gleichzeitig aktiver Revisionen wird überwacht.

## Interviewfragen

### 1. Wo positioniert sich Azure Container Apps zwischen AKS und einfachen Webdiensten?

**Antwort:** Es bietet vereinfachte, serverlose Container-Bereitstellung ohne direkten Kubernetes-API-Zugriff, mit geringerem Betriebsaufwand als AKS, aber mehr Container-Orchestrierungsfähigkeiten als einfache Webdienste wie App Service.

### 2. Was ermöglicht das Revisionsmodell von Container Apps?

**Antwort:** Mehrere Versionen (Revisionen) derselben Container-App können gleichzeitig aktiv sein, wobei Traffic-Splitting-Regeln steuern, welcher Anteil des Datenverkehrs an welche Revision geht, was kontrollierte Rollout-Strategien ermöglicht.

### 3. Warum ist eine gleichzeitige Aktivität mehrerer Revisionen nicht automatisch ein Fehler?

**Antwort:** Weil dies das beabsichtigte Verhalten des Revisionsmodells bei schrittweisen Rollout-Strategien (z. B. Blue-Green-Deployment) ist, solange die Traffic-Splitting-Konfiguration tatsächlich dem beabsichtigten Rollout-Plan entspricht.

### 4. Was ist der Vorteil ereignisbasierter Skalierung über KEDA gegenüber klassischer CPU-/Speicherbasierter Skalierung?

**Antwort:** Sie ermöglicht präzisere Skalierung für ereignisgetriebene Workloads, deren tatsächliche Last sich nicht direkt in CPU-/Speicherauslastung widerspiegelt, z. B. basierend auf der Länge einer Nachrichtenwarteschlange.

### 5. Wie gehst du vor, wenn Nutzer inkonsistent unterschiedliche Versionen derselben Anwendung erleben?

**Antwort:** Ich prüfe die Traffic-Splitting-Konfiguration gegen den beabsichtigten Rollout-Plan, da eine unvollständige oder fehlerhafte Konfiguration der Traffic-Splitting-Regel die wahrscheinlichste Ursache ist, nicht ein allgemeiner Deployment-Fehler.

### 6. Widersprüchliche Anforderung: Team will minimalen Betriebsaufwand (Container Apps) UND volle Kubernetes-API-Kontrolle für spezifische Operatoren — wie gehst du vor?

**Antwort:** Ich würde erklären, dass Container Apps bewusst keinen direkten Kubernetes-API-Zugriff bietet, und empfehlen, entweder auf AKS für die spezifischen Anforderungen umzusteigen, oder zu prüfen, ob die benötigte Funktionalität durch native Container-Apps-Funktionen ohne direkten API-Zugriff erreichbar ist.

## Praktische Labs

~~~python
# Conceptual traffic-splitting rollout completeness check (not executed against a real Azure account):

def check_traffic_splitting_completion(revisions_traffic_percentages, intended_rollout_complete):
    total_percentage = sum(revisions_traffic_percentages.values())
    active_revisions = [r for r, pct in revisions_traffic_percentages.items() if pct > 0]

    if intended_rollout_complete and len(active_revisions) > 1:
        return {"status": "MISCONFIGURATION: rollout intended complete but multiple revisions still active"}
    return {"status": "consistent", "active_revisions": active_revisions, "total_percentage": total_percentage}

result = check_traffic_splitting_completion(
    revisions_traffic_percentages={"revision-v1": 20, "revision-v2": 80},
    intended_rollout_complete=True,  # should be 100% on v2, but v1 still has traffic
)
print(result)
~~~

## Dependencies, Cross-References und Quellen

1. Microsoft-Dokumentation: [Azure Container Apps — Revisions](https://learn.microsoft.com/en-us/azure/container-apps/revisions), abgerufen 2026-09-18.
2. Microsoft-Dokumentation: [Azure Container Apps — Scaling with KEDA](https://learn.microsoft.com/en-us/azure/container-apps/scale-app), abgerufen 2026-09-18.

Azure Kubernetes Service ist kanonisch in [KB-0487](07-azure-kubernetes-service.md) behandelt; ECS und Fargate in [KB-0471](../19-aws/09-ecs-und-fargate.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, native Unterstützung für zusätzliche KEDA-Skalierungsquellen innerhalb von Container Apps | Adopting | Gegenüber CPU-/Speicherbasierter Skalierung bevorzugen, sobald eine passende Ereignisquelle für die konkrete Workload verfügbar ist. |

Ein Team akzeptiert eine Container-Apps-Traffic-Splitting-Konfiguration erst, wenn diese nachweislich vollständig und konsistent mit dem beabsichtigten Rollout-Plan übereinstimmt.
