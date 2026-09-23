---
{"id": "KB-0503", "title": "Google Kubernetes Engine", "domain": "21", "sequence": 5, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0502", "concepts": ["Compute Engine"], "needed_for": "understanding"}, {"id": "KB-0470", "concepts": ["Amazon EKS"], "needed_for": "context"}, {"id": "KB-0487", "concepts": ["Azure Kubernetes Service"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "GKE-Clusterbetriebsmodelle (Autopilot versus Standard), Nodeverwaltung und Workload Identity anhand offizieller Dokumentation konfigurieren und deren Verantwortungsumfang klar abgrenzen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Plattform-Architektur explizit entscheiden, ob Autopilot oder Standard-Modus geeignet ist, und wie Upgrades und Netzwerkgrenzen für Plattformworkloads gestaltet werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Betriebsverantwortung (z. B. für Node-Patching) auf eine falsche Wahl zwischen Autopilot- und Standard-Betriebsmodus zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Plattform-Betriebsstandards im Unternehmen anhand einer bewussten Wahl des GKE-Betriebsmodus entsprechend der tatsächlich verfügbaren Plattform-Team-Kapazität festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung des GKE-Control-Plane-Managements im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der Betriebsmodell-Unterscheidung und der Workload-Identity-Integration als Entscheidungsgrundlage, nicht die Control-Plane-Interna."}}, "lab_validation": [{"lab_id": "KB-0503-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Google-Cloud-Dokumentation zu GKE, kein aktives GCP-Konto verwendet", "evidence": "Anhand offizieller Google-Cloud-Dokumentation wird nachvollzogen, wie GKE Autopilot die Node-Verwaltung vollständig an Google delegiert (reduzierte operative Last, aber weniger Konfigurationsfreiheit), wie GKE Standard volle Node-Kontrolle bei entsprechend höherer Betriebsverantwortung bietet, und wie Workload Identity Kubernetes-Service-Accounts mit GCP-IAM-Service-Accounts verknüpft, analog zu AWS IRSA (siehe KB-0470) und Azure Workload Identity (siehe KB-0487).", "limitations": "Kein aktives GCP-Konto verwendet, kein realer GKE-Cluster erstellt."}]}
---
# Google Kubernetes Engine

> **Ziel:** GKE bietet zwei fundamental unterschiedliche Betriebsmodi: **Autopilot** (Google verwaltet die Node-Infrastruktur vollständig — Patching, Skalierung, Sicherheitshärtung erfolgen automatisch, mit reduzierter Konfigurationsfreiheit) und **Standard** (das Team verwaltet Node Pools selbst, mit voller Kontrolle über Maschinentypen, Node-Konfiguration und Patch-Timing, aber entsprechend höherer Betriebsverantwortung). **Workload Identity** verknüpft Kubernetes-Service-Accounts mit GCP-IAM-Service-Accounts, sodass Pods ohne statische Credentials sicher auf GCP-APIs zugreifen können — strukturell analog zu AWS IRSA (siehe [KB-0470](../19-aws/08-amazon-eks.md)) und Azure Workload Identity (siehe [KB-0487](../20-azure/07-azure-kubernetes-service.md)). Der zentrale Punkt dieses Kapitels ist, dass eine unerwartete Betriebsverantwortung (etwa wenn ein Team plötzlich für Node-Patching zuständig ist, obwohl es dies nicht erwartet hatte) typischerweise auf eine unbedachte Wahl des Standard- statt Autopilot-Modus zurückzuführen ist, ohne die tatsächlich verfügbare Plattform-Team-Kapazität für Node-Verwaltung zu berücksichtigen.

## Zweck, Mental Model und Dependencies

GKE Autopilot und Standard repräsentieren zwei Punkte auf einem Kontinuum zwischen operativer Einfachheit und Konfigurationsfreiheit: Autopilot delegiert die gesamte Node-Infrastrukturverwaltung an Google — es gibt keine sichtbaren Node Pools, die das Team selbst patchen oder skalieren muss, Ressourcen werden pro Pod statt pro Node abgerechnet, und Sicherheitshärtung erfolgt standardmäßig nach Google-Best-Practices. Dies eignet sich für Teams ohne dedizierte Plattform-Engineering-Kapazität oder für Anwendungsfälle, bei denen operative Einfachheit wichtiger ist als granulare Infrastrukturkontrolle. GKE Standard bietet dagegen volle Kontrolle über Node Pools — das Team wählt Maschinentypen, konfiguriert Node-Auto-Scaling-Parameter im Detail, und trägt die Verantwortung für Node-Patching und -Upgrades (wenn auch mit Unterstützung durch automatisierte Upgrade-Kanäle), was für Teams mit spezifischen Infrastrukturanforderungen (z. B. spezielle Hardware, GPU-Nodes mit spezifischer Konfiguration) oder etablierter Plattform-Engineering-Kapazität geeigneter ist. Workload Identity löst das Problem, dass Anwendungen in Kubernetes-Pods sicher auf GCP-APIs zugreifen müssen, ohne statische Service-Account-Schlüssel als Dateien oder Secrets zu speichern — ein Kubernetes-Service-Account wird mit einem GCP-IAM-Service-Account verknüpft, wodurch Pods über kurzlebige, automatisch rotierte Credentials Zugriff erhalten, strukturell dieselbe Problemlösung wie AWS IRSA (IAM Roles for Service Accounts, siehe [KB-0470](../19-aws/08-amazon-eks.md)) und Azure Workload Identity (siehe [KB-0487](../20-azure/07-azure-kubernetes-service.md)).

~~~text
GKE: 2 fundamentally different operating modes
  Autopilot: Google manages ENTIRE node infra (patching, scaling, security hardening AUTOMATIC)
    -> reduced config freedom, per-POD billing (not per-node)
    -> fits teams WITHOUT dedicated platform engineering capacity
  Standard: team manages node pools FULLY
    -> full control (machine types, autoscaling params, patch timing)
    -> team bears node-patching/upgrade responsibility (with automated upgrade channel support)
    -> fits teams with SPECIFIC infra needs (special hardware, custom GPU config) or established platform capacity
Workload Identity: links K8s Service Account <-> GCP IAM Service Account
  -> pods get SHORT-LIVED, auto-rotated credentials, NO static keys stored as files/secrets
  (structurally same solution as AWS IRSA, KB-0470, and Azure Workload Identity, KB-0487)
UNEXPECTED operational burden (e.g. team suddenly owns node patching)
  -> usually = Standard mode chosen WITHOUT considering actual available platform team capacity
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Autopilot | Google verwaltet Node-Infrastruktur vollständig | reduzierte Betriebslast, weniger Konfigurationsfreiheit |
| Standard | Team verwaltet Node Pools selbst | volle Kontrolle, höhere Betriebsverantwortung |
| Workload Identity | K8s-Service-Account verknüpft mit GCP-IAM-Service-Account | analog zu AWS IRSA und Azure Workload Identity |
| Upgrade-Kanäle | automatisierte Cluster-/Node-Upgrade-Steuerung | Verantwortungsabgrenzung zwischen Google und Team |

Implementierung: Für jeden Cluster wird explizit geprüft, ob die tatsächlich verfügbare Plattform-Team-Kapazität für Node-Verwaltung ausreicht, bevor Standard-Modus statt Autopilot gewählt wird. Workload Identity wird konsequent statt statischer Service-Account-Schlüssel für den Zugriff von Pods auf GCP-APIs genutzt. Upgrade-Kanäle werden explizit anhand der tatsächlichen Risikotoleranz der Anwendung (Rapid/Regular/Stable) konfiguriert, statt Standardwerte unreflektiert zu übernehmen.

## Scalability, Reliability, Security und Observability

GKE skaliert die operative Last proportional zur Wahl zwischen Autopilot und Standard; die Reliability-Grenze liegt darin, dass eine Standard-Modus-Wahl ohne ausreichende Plattform-Team-Kapazität proportional zur Betriebslast zu verzögerten Patches oder inkonsistenter Node-Konfiguration führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Team ist unerwartet für Node-Patching zuständig | Standard-Modus wurde ohne Berücksichtigung der tatsächlich verfügbaren Plattform-Kapazität gewählt | prüfen, ob ein Wechsel zu Autopilot oder eine Erweiterung der Plattform-Kapazität sinnvoll ist |
| Pods können nicht sicher auf GCP-APIs zugreifen | Workload Identity ist nicht konfiguriert, stattdessen werden statische Service-Account-Schlüssel genutzt | Workload Identity für den betroffenen Namespace/Service-Account einrichten |
| Cluster-Upgrades erfolgen unerwartet häufig oder selten | der Upgrade-Kanal entspricht nicht der tatsächlichen Risikotoleranz der Anwendung | den Upgrade-Kanal gegen die tatsächliche Risikotoleranz prüfen und anpassen |

Security: Workload Identity sollte konsequent statt statischer Service-Account-Schlüssel genutzt werden, um kurzlebige, automatisch rotierte Credentials für Pod-Zugriff auf GCP-APIs sicherzustellen. Observability: Die tatsächliche Node-Patch-Aktualität (bei Standard-Modus), die Häufigkeit fehlgeschlagener Workload-Identity-Zugriffsversuche, und die Cluster-Upgrade-Historie relativ zum konfigurierten Kanal sind relevante Betriebssignale.

## Trade-offs und Entscheidungen

**Staff** konfiguriert Workload Identity und Node Pools für einen gegebenen Cluster korrekt. **Principal** entscheidet, ob Autopilot oder Standard-Modus für eine konkrete Plattform-Architektur geeignet ist, basierend auf tatsächlicher Team-Kapazität. **Chief** legt Plattform-Betriebsstandards für die konsistente Wahl des GKE-Betriebsmodus im Unternehmen fest.

Anti-Patterns: Standard-Modus ohne Berücksichtigung der tatsächlich verfügbaren Plattform-Team-Kapazität für Node-Verwaltung wählen; statische Service-Account-Schlüssel statt Workload Identity für Pod-Zugriff auf GCP-APIs nutzen; Upgrade-Kanäle ohne Rücksicht auf die tatsächliche Risikotoleranz der Anwendung konfigurieren.

## Production Checklist

- [ ] Die Wahl zwischen Autopilot und Standard berücksichtigt die tatsächlich verfügbare Plattform-Team-Kapazität.
- [ ] Workload Identity ist für alle Pods konfiguriert, die auf GCP-APIs zugreifen, statt statischer Schlüssel.
- [ ] Upgrade-Kanäle entsprechen der tatsächlichen Risikotoleranz jeder Anwendung.
- [ ] Node-Patch-Aktualität wird bei Standard-Modus aktiv überwacht.

## Interviewfragen

### 1. Was ist der zentrale Unterschied zwischen GKE Autopilot und Standard?

**Antwort:** Autopilot delegiert die gesamte Node-Infrastrukturverwaltung an Google mit reduzierter Konfigurationsfreiheit; Standard gibt dem Team volle Kontrolle über Node Pools bei entsprechend höherer Betriebsverantwortung.

### 2. Wofür wird Workload Identity in GKE genutzt?

**Antwort:** Um Kubernetes-Service-Accounts mit GCP-IAM-Service-Accounts zu verknüpfen, sodass Pods über kurzlebige, automatisch rotierte Credentials statt statischer Schlüssel auf GCP-APIs zugreifen können.

### 3. Wie verhält sich GKE Workload Identity zu AWS IRSA und Azure Workload Identity?

**Antwort:** Alle drei lösen strukturell dasselbe Problem — sichere, kurzlebige Credential-Vergabe für Pods ohne statische Schlüssel — mit jeweils cloud-spezifischer Implementierung.

### 4. Für welche Teams eignet sich GKE Autopilot besonders?

**Antwort:** Für Teams ohne dedizierte Plattform-Engineering-Kapazität oder für Anwendungsfälle, bei denen operative Einfachheit wichtiger ist als granulare Infrastrukturkontrolle.

### 5. Wie gehst du vor, wenn ein Team unerwartet für Node-Patching zuständig ist?

**Antwort:** Ich prüfe, ob Standard-Modus ohne Berücksichtigung der tatsächlich verfügbaren Plattform-Kapazität gewählt wurde, und evaluiere einen Wechsel zu Autopilot oder eine Erweiterung der Plattform-Team-Kapazität.

### 6. Widersprüchliche Anforderung: Team will maximale Infrastrukturkontrolle (z. B. für spezielle GPU-Konfiguration) UND minimale operative Last für Node-Verwaltung — wie gehst du vor?

**Antwort:** Ich würde erklären, dass maximale Infrastrukturkontrolle und minimale operative Last sich bei GKE strukturell ausschließen, da Kontrolle im Standard-Modus mit Betriebsverantwortung einhergeht, und vorschlagen, entweder Autopilot mit den dort verfügbaren spezialisierten Optionen zu prüfen oder gezielt Plattform-Kapazität für die benötigte Standard-Modus-Kontrolle aufzubauen.

## Praktische Labs

~~~python
# Conceptual GKE operating-mode recommendation based on platform team capacity (not executed against a real GKE cluster):

def recommend_gke_mode(platform_team_capacity, needs_special_hardware):
    if needs_special_hardware:
        return "Standard (special hardware config requires full node control)"
    if platform_team_capacity == "low":
        return "Autopilot (minimal ops burden, no dedicated node management capacity)"
    return "Standard (sufficient platform capacity for full node control)"

clusters = [
    {"platform_team_capacity": "low", "needs_special_hardware": False},
    {"platform_team_capacity": "high", "needs_special_hardware": True},
]

for c in clusters:
    print(recommend_gke_mode(**c))
~~~

## Dependencies, Cross-References und Quellen

1. Google-Cloud-Dokumentation: [GKE Autopilot Overview](https://cloud.google.com/kubernetes-engine/docs/concepts/autopilot-overview), abgerufen 2026-09-18.
2. Google-Cloud-Dokumentation: [Workload Identity Federation for GKE](https://cloud.google.com/kubernetes-engine/docs/concepts/workload-identity), abgerufen 2026-09-18.

Compute Engine ist kanonisch in [KB-0502](04-compute-engine.md) behandelt; Amazon EKS in [KB-0470](../19-aws/08-amazon-eks.md); Azure Kubernetes Service in [KB-0487](../20-azure/07-azure-kubernetes-service.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte GPU-/TPU-Unterstützung in GKE Autopilot, die zuvor Standard-Modus für spezielle Hardware-Anforderungen erforderte | Evaluating | Gegenüber pauschalem Standard-Modus für Hardware-Anforderungen erst nach Prüfung, ob Autopilot die konkrete Hardware-Konfiguration mittlerweile unterstützt, bevorzugen. |

Ein Team akzeptiert eine GKE-Konfiguration erst, wenn die Wahl zwischen Autopilot und Standard nachweislich der tatsächlich verfügbaren Plattform-Team-Kapazität entspricht und Workload Identity statt statischer Schlüssel genutzt wird.
