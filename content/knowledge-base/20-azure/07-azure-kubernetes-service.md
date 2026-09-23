---
{"id": "KB-0487", "title": "Azure Kubernetes Service", "domain": "20", "sequence": 7, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI", "ENTERPRISE"], "requires": [{"id": "KB-0470", "concepts": ["Amazon EKS"], "needed_for": "understanding"}, {"id": "KB-0482", "concepts": ["Entra-Tenant-Design für Azure, Managed Identities"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein AKS-Cluster mit einem Nodepool und Workload-Identity-Integration anhand offizieller Dokumentation konfigurieren können und erklären, welche Kubernetes-Kontrollebenen-Komponenten Azure bei AKS betreibt.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine AKS-Betriebsstrategie gestalten, die Nodepools nach Workload-Anforderungen trennt, Managed-Identity-basierten Azure-Ressourcenzugriff nutzt, und proaktive Upgrade-/Wartungsfenster-Planung mit der tatsächlichen Verantwortungsteilung zwischen Azure und Kunde abstimmt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Betriebsstörung auf ein automatisches, nicht ausreichend geplantes Kubernetes-Version-Upgrade oder Wartungsfenster zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "AKS-Betriebsrichtlinien im Unternehmen anhand proaktiver Upgrade-Planung und expliziter Verantwortungsteilung statt anhand impliziter Annahmen über automatische Wartung festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der AKS-Kontrollebenen-Infrastruktur im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Nodepools, Netzwerkmodellen, Managed-Identity-Integration und Upgrade-Verantwortung als Entscheidungsgrundlage, nicht die Kontrollebenen-Interna."}}, "lab_validation": [{"lab_id": "KB-0487-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Azure-Kubernetes-Service-Dokumentation, kein aktives Azure-Konto verwendet", "evidence": "Anhand offizieller Microsoft-Dokumentation wird nachvollzogen, welche Kubernetes-Kontrollebenen-Komponenten Azure bei AKS betreibt, wie Nodepools unterschiedliche Worker-Node-Konfigurationen innerhalb desselben Clusters ermöglichen, wie Workload Identity es Kubernetes-Pods ermöglicht, Managed Identities für den Zugriff auf Azure-Ressourcen zu nutzen (analog zu AWS IRSA, siehe KB-0470), und wie automatische Upgrade- und Wartungsfenster-Einstellungen die tatsächliche Betriebsplanung beeinflussen.", "limitations": "Kein aktives Azure-Konto verwendet, kein reales AKS-Cluster erstellt."}]}
---
# Azure Kubernetes Service

> **Ziel:** Azure Kubernetes Service (AKS) ist Azures Managed-Kubernetes-Angebot (siehe Amazon EKS, [KB-0470](../19-aws/08-amazon-eks.md), für das strukturell vergleichbare AWS-Pendant), bei dem Azure die Kubernetes-Kontrollebene betreibt, während der Kunde für Nodepools (Gruppen von Worker-Nodes mit einheitlicher Konfiguration, die unterschiedliche Workload-Anforderungen innerhalb desselben Clusters abbilden können) und die Anwendungsbereitstellung verantwortlich bleibt. Der zentrale Punkt dieses Kapitels ist, dass AKS über Workload Identity eine Integration mit Microsoft-Entra-Managed-Identities bereitstellt (siehe Entra-Tenant-Design für Azure, [KB-0482](02-entra-tenant-design-fuer-azure.md)), die es Kubernetes-Pods ermöglicht, Azure-Ressourcen ohne gespeicherte Zugangsschlüssel zu erreichen — analog zu AWS IRSA — und dass automatische Kubernetes-Upgrades und Wartungsfenster explizit geplant werden müssen, da eine unerwartete Betriebsstörung häufig auf ein automatisches, nicht ausreichend vorab kommuniziertes oder getestetes Upgrade zurückzuführen ist, nicht auf eine allgemeine Instabilität von AKS selbst.

## Zweck, Mental Model und Dependencies

Bei AKS betreibt Azure die Kubernetes-Kontrollebene (API-Server, etcd, Scheduler) vollständig verwaltet, analog zu Amazon EKS (siehe [KB-0470](../19-aws/08-amazon-eks.md)), wodurch der Kunde von der Komplexität des Kontrollebenen-Betriebs entlastet wird, jedoch weiterhin für Nodepools verantwortlich bleibt. Nodepools ermöglichen es, innerhalb eines einzelnen AKS-Clusters unterschiedliche Worker-Node-Konfigurationen für unterschiedliche Workload-Anforderungen zu betreiben (z. B. ein Nodepool mit GPU-ausgestatteten Instanzen für ML-Workloads, ein anderer mit Standard-Compute-Instanzen für allgemeine Anwendungen), wobei jeder Nodepool unabhängig skaliert und konfiguriert werden kann. Workload Identity ist der Mechanismus, über den ein Kubernetes-Pod eine Microsoft-Entra-Managed-Identity übernehmen kann, um auf Azure-Ressourcen außerhalb des Clusters zuzugreifen, ohne dass Zugangsschlüssel im Cluster gespeichert werden müssen — konzeptionell und funktional vergleichbar mit AWS IRSA (siehe [KB-0470](../19-aws/08-amazon-eks.md)), wobei beide Kubernetes-RBAC (für Kubernetes-API-Ressourcen) und Azure-IAM/Entra-Berechtigungen (für Azure-Ressourcen) als getrennte, unabhängig voneinander korrekt zu konfigurierende Ebenen behandelt werden müssen, analog zur bereits etablierten AWS-EKS-Logik. Der zentrale methodische Punkt betrifft die Upgrade- und Wartungsverantwortung: AKS bietet automatische Upgrade-Kanäle (die Kubernetes-Version automatisch auf neuere, unterstützte Versionen aktualisieren) und automatische Wartungsfenster (Zeiträume, in denen Azure Wartungsarbeiten wie Knoten-Patches durchführt) — diese Automatisierung reduziert zwar den manuellen Betriebsaufwand, kann jedoch bei unzureichender Planung zu unerwarteten Betriebsstörungen führen, wenn ein automatisches Upgrade oder Wartungsfenster mit kritischen Geschäftszeiten kollidiert oder eine Anwendungskompatibilität mit der neuen Kubernetes-Version nicht vorab getestet wurde — eine unerwartete Betriebsstörung ist daher häufig auf eine unzureichend geplante Nutzung dieser Automatisierung zurückzuführen, nicht auf eine allgemeine Instabilität der AKS-Plattform selbst.

~~~text
AKS: Azure manages the Kubernetes CONTROL PLANE (API server, etcd, scheduler) -- same pattern as EKS (see KB-0470)
  customer remains responsible for: NODE POOLS, app deployment
Node pools: DIFFERENT worker-node configs WITHIN the same cluster for different workload needs
  (e.g. GPU pool for ML, standard pool for general apps), independently scaled/configured
Workload Identity: pod assumes a Microsoft Entra Managed Identity for Azure resource access
  NO stored access keys in the cluster
  -> functionally EQUIVALENT to AWS IRSA (see KB-0470)
  -> Kubernetes RBAC (K8s API resources) + Azure IAM/Entra (Azure resources)
     remain TWO SEPARATE, independently-configured layers, SAME logic as EKS
KEY METHODOLOGICAL POINT: AKS offers automatic upgrade channels + automatic maintenance windows
  reduces manual ops burden, BUT insufficient planning:
  auto-upgrade/maintenance colliding with critical business hours,
  OR app compatibility with the new K8s version untested beforehand
  -> unexpected disruption traceable to INSUFFICIENTLY PLANNED use of this automation
     NOT general AKS platform instability
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Verwaltete Kontrollebene | Azure betreibt API-Server, etcd, Scheduler | Kunde bleibt für Nodepools und Anwendungsbereitstellung verantwortlich |
| Nodepool | Gruppe von Worker-Nodes mit einheitlicher Konfiguration | ermöglicht unterschiedliche Workload-Anforderungen im selben Cluster |
| Workload Identity | Azure-Ressourcenzugriff für Pods ohne gespeicherte Zugangsschlüssel | funktional äquivalent zu AWS IRSA, getrennt von Kubernetes-RBAC |
| Automatische Upgrades/Wartungsfenster | reduziert manuellen Betriebsaufwand | erfordert proaktive Planung, um Betriebsstörungen zu vermeiden |

Implementierung: Nodepools werden gezielt nach tatsächlichen Workload-Anforderungen (z. B. GPU-Bedarf, Rechenintensität) strukturiert, statt alle Workloads auf einen einzigen, undifferenzierten Nodepool zu platzieren. Kubernetes-Pods, die Azure-Ressourcen benötigen, werden über Workload Identity mit dedizierten, eng gefassten Managed Identities konfiguriert, konsistent mit der allgemeinen Entra-Praxis. Automatische Upgrade-Kanäle und Wartungsfenster werden explizit auf Zeiträume außerhalb kritischer Geschäftszeiten konfiguriert, und Anwendungskompatibilität mit neuen Kubernetes-Versionen wird vor deren automatischer Übernahme in einer Staging-Umgebung getestet.

## Scalability, Reliability, Security und Observability

Azure Kubernetes Service skaliert die Betriebsentlastung proportional zur sinnvollen Nutzung von Nodepool-Differenzierung und Automatisierungsfunktionen; die Reliability-Grenze liegt darin, dass eine unzureichend geplante Nutzung automatischer Upgrades oder Wartungsfenster proportional zur Diskrepanz zwischen Automatisierungszeitpunkt und tatsächlichen Geschäftsanforderungen zu vermeidbaren Betriebsstörungen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine unerwartete Betriebsstörung fällt mit einem automatischen Kubernetes-Upgrade oder Wartungsfenster zusammen | die Automatisierung wurde ohne ausreichende Planung gegen kritische Geschäftszeiten konfiguriert | die Upgrade-Kanal- und Wartungsfenster-Konfiguration gegen kritische Geschäftszeiten prüfen und anpassen |
| ein Pod mit korrekten Kubernetes-RBAC-Berechtigungen kann dennoch nicht auf eine Azure-Ressource zugreifen | die Workload-Identity-Konfiguration für den zugehörigen Service-Account fehlt oder ist fehlerhaft | die Workload-Identity- und Managed-Identity-Zuordnung getrennt von der Kubernetes-RBAC-Konfiguration prüfen |
| bestimmte Workloads zeigen unerwartete Leistungsprobleme trotz ausreichender Cluster-Gesamtkapazität | alle Workloads laufen auf einem undifferenzierten Nodepool ohne Berücksichtigung ihrer spezifischen Ressourcenanforderungen | dedizierte Nodepools für Workloads mit unterschiedlichen Ressourcenprofilen (z. B. GPU-Bedarf) einrichten |

Security: Workload-Identity-Zuordnungen sollten nach dem Prinzip geringster Berechtigung konfiguriert werden, mit dedizierten Managed Identities pro Service-Account statt einer gemeinsam genutzten, breiten Identität über mehrere Anwendungen hinweg. Observability: Die tatsächliche Kubernetes-Version relativ zum Azure-Support-Zeitplan, die Konsistenz zwischen RBAC- und Workload-Identity-Konfiguration, und die Nodepool-Auslastung im Verhältnis zur zugeordneten Workload-Kategorie sind zentrale Kontrollpunkte.

## Trade-offs und Entscheidungen

**Staff** plant automatische Upgrades und Wartungsfenster explizit gegen kritische Geschäftszeiten. **Principal** macht die getrennte Konfiguration von Kubernetes-RBAC und Workload Identity für das Team nachvollziehbar. **Chief** legt AKS-Betriebsrichtlinien im Unternehmen anhand proaktiver Upgrade-Planung fest.

Anti-Patterns: automatische Upgrade-Kanäle und Wartungsfenster ohne Prüfung gegen kritische Geschäftszeiten konfigurieren; annehmen, dass korrekte Kubernetes-RBAC-Berechtigungen automatisch Zugriff auf Azure-Ressourcen bedeuten, ohne Workload Identity getrennt zu prüfen; alle Workloads auf einem undifferenzierten Nodepool betreiben, unabhängig von deren tatsächlichen Ressourcenanforderungen.

## Production Checklist

- [ ] Automatische Upgrade-Kanäle und Wartungsfenster sind gegen kritische Geschäftszeiten geplant.
- [ ] Anwendungskompatibilität mit neuen Kubernetes-Versionen wird vor automatischer Übernahme getestet.
- [ ] Workload Identity ist für Azure-Ressourcenzugriff dediziert und eng gefasst pro Service-Account konfiguriert.
- [ ] Nodepools sind nach tatsächlichen Workload-Ressourcenanforderungen strukturiert.

## Interviewfragen

### 1. Welche Kubernetes-Kontrollebenen-Komponenten betreibt Azure bei AKS?

**Antwort:** API-Server, etcd und Scheduler; der Kunde bleibt für Nodepools und die Anwendungsbereitstellung verantwortlich, analog zur Verantwortungsteilung bei Amazon EKS.

### 2. Was ist Workload Identity, und womit ist es funktional vergleichbar?

**Antwort:** Ein Mechanismus, der Kubernetes-Pods die Übernahme einer Microsoft-Entra-Managed-Identity für den Zugriff auf Azure-Ressourcen ohne gespeicherte Zugangsschlüssel ermöglicht, funktional vergleichbar mit AWS IRSA bei EKS.

### 3. Warum reichen korrekte Kubernetes-RBAC-Berechtigungen allein nicht aus, damit ein Pod auf eine Azure-Ressource zugreifen kann?

**Antwort:** Weil Kubernetes-RBAC und Workload Identity zwei unabhängige Berechtigungsebenen sind — RBAC regelt Zugriff auf Kubernetes-API-Ressourcen, Workload Identity regelt Zugriff auf Azure-Ressourcen, und beide müssen separat korrekt konfiguriert sein.

### 4. Warum kann ein automatisches Kubernetes-Upgrade zu einer unerwarteten Betriebsstörung führen?

**Antwort:** Wenn das Upgrade ohne ausreichende Planung mit kritischen Geschäftszeiten kollidiert oder die Anwendungskompatibilität mit der neuen Kubernetes-Version nicht vorab getestet wurde.

### 5. Wie gehst du vor, wenn eine unerwartete Betriebsstörung mit einem automatischen Kubernetes-Upgrade zusammenfällt?

**Antwort:** Ich prüfe die Upgrade-Kanal- und Wartungsfenster-Konfiguration gegen kritische Geschäftszeiten und passe diese an, um zukünftige Kollisionen zu vermeiden.

### 6. Widersprüchliche Anforderung: Team will minimalen manuellen Betriebsaufwand (volle Automatisierung von Upgrades) UND garantiert keine Betriebsstörungen durch unerwartete Upgrades — wie gehst du vor?

**Antwort:** Ich würde automatische Upgrade-Kanäle mit explizit konfigurierten Wartungsfenstern außerhalb kritischer Geschäftszeiten nutzen und zusätzlich eine Staging-Umgebung einrichten, die neue Kubernetes-Versionen vor deren automatischer Übernahme in der Produktionsumgebung testet, sodass Automatisierung und Betriebssicherheit kombiniert werden, statt eines der beiden Ziele zu opfern.

## Praktische Labs

~~~python
# Conceptual maintenance-window vs. business-hours collision check (not executed against a real AKS cluster):

def check_maintenance_window_conflict(maintenance_window_hours, critical_business_hours):
    conflicts = [h for h in maintenance_window_hours if h in critical_business_hours]
    return {"conflict_detected": len(conflicts) > 0, "conflicting_hours": conflicts}

maintenance_window_hours = set(range(14, 16))  # 14:00-16:00
critical_business_hours = set(range(9, 18))  # 9:00-18:00

result = check_maintenance_window_conflict(maintenance_window_hours, critical_business_hours)
print(result)
~~~

## Dependencies, Cross-References und Quellen

1. Microsoft-Dokumentation: [Azure Kubernetes Service — Cluster Architecture](https://learn.microsoft.com/en-us/azure/aks/concepts-clusters-workloads), abgerufen 2026-09-18.
2. Microsoft-Dokumentation: [AKS Workload Identity Overview](https://learn.microsoft.com/en-us/azure/aks/workload-identity-overview), abgerufen 2026-09-18.

Amazon EKS ist kanonisch in [KB-0470](../19-aws/08-amazon-eks.md) behandelt; Entra-Tenant-Design für Azure in [KB-0482](02-entra-tenant-design-fuer-azure.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, planbare Upgrade-Zeitfenster-Werkzeuge, die automatische Upgrades präziser an definierte Wartungszeiträume binden | Adopting | Gegenüber Standard-Upgrade-Kanälen bevorzugen, sobald die tatsächliche Planungsgenauigkeit für die eigene Umgebung verifiziert ist. |

Ein Team akzeptiert eine AKS-Cluster-Konfiguration erst, wenn Upgrade- und Wartungsfenster nachweislich gegen kritische Geschäftszeiten geplant sind und Workload Identity getrennt von Kubernetes-RBAC geprüft ist.
