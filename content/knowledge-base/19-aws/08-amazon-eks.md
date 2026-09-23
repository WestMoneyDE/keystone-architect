---
{"id": "KB-0470", "title": "Amazon EKS", "domain": "19", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0449", "concepts": ["Containerdienste in der Cloud, Managed Kubernetes"], "needed_for": "understanding"}, {"id": "KB-0464", "concepts": ["AWS IAM und Rollenmodell"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein EKS-Cluster mit einer verwalteten Node-Gruppe und Cluster-Zugriffskontrolle anhand offizieller Dokumentation konfigurieren können und erklären, welche Kubernetes-Kontrollebenen-Komponenten AWS betreibt und welche beim Kunden verbleiben.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein EKS-Cluster eine Netzwerk-, Identity- und Upgrade-Strategie gestalten, die AWS-IAM-Integration (IRSA) mit Kubernetes-RBAC kombiniert und Upgrade-Zyklen explizit gegen den AWS-Kubernetes-Versionslebenszyklus plant.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein unerwartetes Zugriffsproblem für einen Kubernetes-Pod auf eine fehlerhafte IRSA-Konfiguration (IAM Roles for Service Accounts) zurückführen können, statt ausschließlich Kubernetes-RBAC zu untersuchen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "EKS-Betriebsrichtlinien im Unternehmen anhand geplanter, proaktiver Upgrade-Zyklen statt anhand reaktiver Reaktion auf drohende Versions-EOL-Termine festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung des AWS-verwalteten Kubernetes-API-Servers im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der Verantwortungsgrenze zwischen AWS und Kunde sowie IRSA-Integration als Entscheidungsgrundlage, nicht die AWS-interne Kontrollebenen-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0470-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Amazon-EKS-Dokumentation, kein aktives AWS-Konto verwendet", "evidence": "Anhand offizieller AWS-Dokumentation wird nachvollzogen, welche Kubernetes-Kontrollebenen-Komponenten AWS bei EKS betreibt, welche Verantwortung (Worker Nodes, Add-ons, Netzwerkkonfiguration) beim Kunden verbleibt, und wie IAM Roles for Service Accounts (IRSA) es Kubernetes-Pods ermöglicht, AWS-IAM-Rollen zu übernehmen, ohne dass Zugangsschlüssel im Cluster gespeichert werden müssen.", "limitations": "Kein aktives AWS-Konto verwendet, kein reales EKS-Cluster erstellt."}]}
---
# Amazon EKS

> **Ziel:** Amazon EKS (Elastic Kubernetes Service) ist AWS' Managed-Kubernetes-Angebot (siehe Containerdienste in der Cloud, [KB-0449](../18-cloud-foundations/09-containerdienste-in-der-cloud.md)), bei dem AWS die Kubernetes-Kontrollebene betreibt, während der Kunde weiterhin für Worker Nodes (sofern nicht ebenfalls über ein serverloses Angebot betrieben), Add-ons, Netzwerkkonfiguration und die gesamte Anwendungsbereitstellung verantwortlich bleibt. Der zentrale Punkt dieses Kapitels ist, dass EKS eine zusätzliche Identitätsschicht (IAM Roles for Service Accounts, IRSA) bereitstellt, die es Kubernetes-Pods ermöglicht, AWS-IAM-Rollen zu übernehmen (siehe AWS IAM und Rollenmodell, [KB-0464](02-aws-iam-und-rollenmodell.md)) — dies bedeutet, dass eine unerwartete Zugriffsproblematik für einen Pod nicht ausschließlich in der Kubernetes-eigenen RBAC-Konfiguration zu suchen ist, sondern auch in der IRSA-Konfiguration liegen kann, da beide Berechtigungsebenen (Kubernetes-RBAC für Kubernetes-API-Ressourcen, IRSA/IAM für AWS-Ressourcen) unabhängig voneinander korrekt konfiguriert sein müssen.

## Zweck, Mental Model und Dependencies

Bei EKS betreibt AWS die Kubernetes-Kontrollebene (API-Server, etcd, Controller-Manager, Scheduler) vollständig verwaltet, wodurch der Kunde von der Komplexität des Kontrollebenen-Betriebs entlastet wird, jedoch weiterhin für Worker Nodes verantwortlich ist — entweder als selbst verwaltete oder AWS-verwaltete Node-Gruppen (EC2-Instanzen, siehe [KB-0468](06-ec2-und-auto-scaling.md)), oder über ein serverloses Angebot, bei dem auch die Worker-Node-Verwaltung an AWS delegiert wird. Innerhalb eines EKS-Clusters existieren zwei unabhängige, aber komplementäre Berechtigungsebenen: Kubernetes-RBAC (siehe [KB-0392](../16-kubernetes-platform/14-rbac-und-service-accounts.md)) bestimmt, welche Kubernetes-Identitäten welche Aktionen auf welchen Kubernetes-API-Ressourcen (Pods, Deployments, Secrets) ausführen dürfen, während IAM Roles for Service Accounts (IRSA) bestimmt, welche AWS-IAM-Berechtigungen ein spezifischer Kubernetes-Pod erhält, wenn er auf AWS-Ressourcen außerhalb des Clusters zugreift (z. B. einen S3-Bucket oder eine verwaltete Datenbank) — IRSA ermöglicht dies, indem einem Kubernetes-Service-Account eine AWS-IAM-Rolle zugeordnet wird, sodass Pods, die diesen Service-Account nutzen, temporäre AWS-Credentials über einen Web-Identity-Token-Mechanismus erhalten, ohne dass Zugangsschlüssel im Cluster gespeichert werden müssen (konsistent mit dem allgemeinen AWS-IAM-Prinzip, dauerhafte Zugangsschlüssel zu vermeiden). Der zentrale methodische Punkt ist, dass diese beiden Berechtigungsebenen unabhängig voneinander korrekt konfiguriert sein müssen — ein Pod kann volle Kubernetes-RBAC-Berechtigungen für eine bestimmte Kubernetes-Ressource haben, aber dennoch keinen Zugriff auf eine AWS-Ressource außerhalb des Clusters erhalten, wenn die zugehörige IRSA-Konfiguration fehlt oder fehlerhaft ist, und umgekehrt — eine unerwartete Zugriffsproblematik erfordert daher eine getrennte Prüfung beider Ebenen, statt sich ausschließlich auf eine der beiden zu konzentrieren. Zusätzlich unterliegt EKS einem definierten Kubernetes-Versionslebenszyklus, bei dem ältere Versionen nach einer bestimmten Zeit den erweiterten (kostenpflichtigen) oder Standard-Support verlieren — ein proaktiv geplanter Upgrade-Zyklus vermeidet, dass ein Cluster reaktiv unter Zeitdruck auf eine drohende Versions-EOL reagieren muss.

~~~text
EKS control plane: AWS-MANAGED (API server, etcd, controller-manager, scheduler)
  customer remains responsible for: worker nodes (self/AWS-managed node groups, or serverless), add-ons, networking, app deployment
TWO INDEPENDENT permission layers within a cluster:
  Kubernetes RBAC: which Kubernetes identity can do WHAT on WHICH Kubernetes API resource (pods, deployments, secrets)
  IRSA (IAM Roles for Service Accounts): which AWS IAM permissions a SPECIFIC pod gets
    for accessing AWS resources OUTSIDE the cluster (S3, managed DB)
    -> service account mapped to an IAM role -> pods using it get TEMPORARY AWS credentials
       via web-identity-token mechanism, NO access keys stored in cluster
KEY METHODOLOGICAL POINT: BOTH layers must be independently correctly configured
  full K8s RBAC access to a resource ≠ automatic AWS resource access without correct IRSA
  -> unexpected access issue requires checking BOTH layers separately, not just one
ALSO: EKS follows a defined Kubernetes version lifecycle -> proactive upgrade planning
  avoids reactive scrambling under time pressure near a version's EOL
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Verwaltete Kontrollebene | AWS betreibt API-Server, etcd, Controller-Manager | Kunde bleibt für Worker Nodes, Add-ons, Netzwerk verantwortlich |
| Kubernetes-RBAC | Berechtigung für Kubernetes-API-Ressourcen | unabhängig von IRSA, muss separat korrekt konfiguriert sein |
| IRSA | AWS-IAM-Berechtigung für einen spezifischen Pod/Service-Account | ermöglicht temporäre AWS-Credentials ohne gespeicherte Zugangsschlüssel |
| Versionslebenszyklus | definierte Support-Zeiträume für Kubernetes-Versionen | erfordert proaktive, geplante Upgrade-Zyklen |

Implementierung: Bei jeder Anwendung, die sowohl Kubernetes-API-Ressourcen als auch externe AWS-Ressourcen benötigt, werden Kubernetes-RBAC und IRSA getrennt konfiguriert und getestet, statt anzunehmen, dass eine der beiden Ebenen die andere ersetzt. Für jeden Kubernetes-Service-Account, der AWS-Ressourcen benötigt, wird eine dedizierte, eng gefasste IAM-Rolle über IRSA zugeordnet, statt eine breite, gemeinsam genutzte Rolle für mehrere Service-Accounts zu verwenden. Ein proaktiver Upgrade-Zeitplan wird etabliert, der EKS-Cluster vor Erreichen des Standard-Support-Endes einer Kubernetes-Version aktualisiert, statt reaktiv auf eine drohende EOL zu reagieren.

## Scalability, Reliability, Security und Observability

Amazon EKS skaliert die Betriebsentlastung proportional zur Vollständigkeit der von AWS übernommenen Kontrollebenen-Verantwortung; die Reliability-Grenze liegt darin, dass eine unzureichend getrennt geprüfte Kombination aus Kubernetes-RBAC und IRSA proportional zur Anzahl betroffener Pods zu unerwarteten, schwer diagnostizierbaren Zugriffsproblemen führt, wenn nur eine der beiden Ebenen untersucht wird.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Pod mit korrekten Kubernetes-RBAC-Berechtigungen kann dennoch nicht auf eine AWS-Ressource zugreifen | die IRSA-Konfiguration für den zugehörigen Service-Account fehlt oder ist fehlerhaft | die IAM-Rollen-Zuordnung des Service-Accounts und die zugrunde liegende IAM-Policy prüfen |
| ein EKS-Cluster nähert sich dem Ende des Standard-Supports für seine Kubernetes-Version | kein proaktiver Upgrade-Zeitplan wurde etabliert | einen regelmäßigen, geplanten Upgrade-Prozess einführen, der Cluster deutlich vor dem EOL-Termin aktualisiert |
| Worker Nodes zeigen unerwartetes Verhalten trotz funktionierender Kontrollebene | die Verantwortung für Worker-Node-Betrieb liegt beim Kunden und wurde nicht ausreichend gewartet | die Worker-Node-Konfiguration (AMI-Version, Patch-Stand) gegen die aktuellen Empfehlungen prüfen |

Security: IRSA-Rollen sollten nach dem Prinzip geringster Berechtigung konfiguriert werden, mit einer dedizierten Rolle pro Service-Account statt einer gemeinsam genutzten, breiten Rolle über mehrere Anwendungen hinweg. Observability: Die tatsächliche Kubernetes-Version jedes Clusters relativ zum AWS-Support-Zeitplan, die Konsistenz zwischen RBAC- und IRSA-Konfiguration, und der Patch-Stand der Worker Nodes sind zentrale Kontrollpunkte.

## Trade-offs und Entscheidungen

**Staff** konfiguriert und prüft Kubernetes-RBAC und IRSA getrennt für jede Anwendung. **Principal** macht die zwei unabhängigen Berechtigungsebenen für das Team nachvollziehbar. **Chief** legt EKS-Betriebsrichtlinien im Unternehmen anhand proaktiver Upgrade-Zyklen fest.

Anti-Patterns: annehmen, dass korrekte Kubernetes-RBAC-Berechtigungen automatisch Zugriff auf AWS-Ressourcen bedeuten, ohne IRSA getrennt zu prüfen; eine breite, gemeinsam genutzte IAM-Rolle über mehrere Service-Accounts hinweg via IRSA zuordnen; EKS-Cluster ohne proaktiven Upgrade-Zeitplan bis kurz vor dem Support-Ende einer Kubernetes-Version unverändert betreiben.

## Production Checklist

- [ ] Kubernetes-RBAC und IRSA sind für jede Anwendung getrennt konfiguriert und getestet.
- [ ] IRSA-Rollen sind nach dem Prinzip geringster Berechtigung, dediziert pro Service-Account, konfiguriert.
- [ ] Ein proaktiver Upgrade-Zeitplan aktualisiert Cluster deutlich vor dem Support-Ende der jeweiligen Kubernetes-Version.
- [ ] Worker-Node-Konfiguration und Patch-Stand werden regelmäßig geprüft.

## Interviewfragen

### 1. Welche Kubernetes-Kontrollebenen-Komponenten betreibt AWS bei EKS, und was bleibt beim Kunden?

**Antwort:** AWS betreibt API-Server, etcd, Controller-Manager und Scheduler; der Kunde bleibt für Worker Nodes (sofern nicht serverlos betrieben), Add-ons, Netzwerkkonfiguration und Anwendungsbereitstellung verantwortlich.

### 2. Was ist IRSA, und welches Problem löst es?

**Antwort:** IAM Roles for Service Accounts ermöglicht es Kubernetes-Pods, temporäre AWS-IAM-Credentials zu erhalten, indem ein Kubernetes-Service-Account einer AWS-IAM-Rolle zugeordnet wird, ohne dass Zugangsschlüssel im Cluster gespeichert werden müssen.

### 3. Warum reichen korrekte Kubernetes-RBAC-Berechtigungen allein nicht aus, damit ein Pod auf eine AWS-Ressource zugreifen kann?

**Antwort:** Weil Kubernetes-RBAC und IRSA zwei unabhängige Berechtigungsebenen sind — RBAC regelt Zugriff auf Kubernetes-API-Ressourcen, IRSA regelt Zugriff auf AWS-Ressourcen außerhalb des Clusters, und beide müssen separat korrekt konfiguriert sein.

### 4. Warum ist ein proaktiver Upgrade-Zeitplan für EKS-Cluster wichtig?

**Antwort:** Weil EKS einem definierten Kubernetes-Versionslebenszyklus mit begrenztem Support-Zeitraum unterliegt; ohne proaktive Planung muss ein Cluster reaktiv und unter Zeitdruck kurz vor dem Support-Ende aktualisiert werden.

### 5. Wie gehst du vor, wenn ein Pod mit korrekten Kubernetes-RBAC-Berechtigungen dennoch nicht auf eine AWS-Ressource zugreifen kann?

**Antwort:** Ich prüfe die IRSA-Konfiguration des zugehörigen Service-Accounts getrennt von der Kubernetes-RBAC-Konfiguration, da beide Ebenen unabhängig voneinander korrekt konfiguriert sein müssen.

### 6. Widersprüchliche Anforderung: Team will schnelle, unkomplizierte AWS-Ressourcenzugriffe für alle Pods UND striktes Least-Privilege pro Anwendung — wie gehst du vor?

**Antwort:** Ich würde für jeden Service-Account eine dedizierte, eng gefasste IRSA-Rolle konfigurieren, die genau die tatsächlich benötigten AWS-Berechtigungen enthält, statt eine breite, gemeinsam genutzte Rolle für alle Pods einzurichten, da IRSA genau diese granulare Zuordnung pro Service-Account ermöglicht.

## Praktische Labs

~~~python
# Conceptual dual-layer permission check (RBAC + IRSA) illustration (not executed against a real EKS cluster):

def check_pod_permission(rbac_allowed, irsa_role_configured, irsa_policy_allows_action):
    kubernetes_api_access = rbac_allowed
    aws_resource_access = irsa_role_configured and irsa_policy_allows_action
    return {"kubernetes_api_access": kubernetes_api_access, "aws_resource_access": aws_resource_access}

# Pod has full RBAC access but IRSA is misconfigured
result = check_pod_permission(rbac_allowed=True, irsa_role_configured=False, irsa_policy_allows_action=False)
print(result)
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [Amazon EKS — Cluster Architecture and Shared Responsibility](https://docs.aws.amazon.com/eks/latest/userguide/eks-architecture.html), abgerufen 2026-09-18.
2. AWS-Dokumentation: [IAM Roles for Service Accounts (IRSA)](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html), abgerufen 2026-09-18.

Containerdienste in der Cloud sind kanonisch in [KB-0449](../18-cloud-foundations/09-containerdienste-in-der-cloud.md) behandelt; AWS IAM und Rollenmodell in [KB-0464](02-aws-iam-und-rollenmodell.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte EKS-Pod-Identity-Mechanismen als vereinfachte Alternative zu IRSA für die AWS-Ressourcenzugriffskonfiguration | Evaluating | Gegenüber klassischem IRSA erst nach Prüfung der tatsächlichen Funktionsäquivalenz und Migrationsaufwand für die eigene Umgebung bevorzugen. |

Ein Team akzeptiert eine EKS-Cluster-Konfiguration erst, wenn Kubernetes-RBAC und IRSA nachweislich getrennt geprüft sind und ein proaktiver Upgrade-Zeitplan gegen den AWS-Kubernetes-Versionslebenszyklus etabliert ist.
