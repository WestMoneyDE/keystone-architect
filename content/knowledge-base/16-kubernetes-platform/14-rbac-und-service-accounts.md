---
{"id": "KB-0392", "title": "RBAC und Service Accounts", "domain": "16", "sequence": 14, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0383", "concepts": ["Kubernetes Control Plane"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Role und ein RoleBinding erstellen, die einem Service Account minimal notwendige Berechtigungen für eine spezifische Operation gewähren, und einen unautorisierten Zugriffsversuch beobachten.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein RBAC-Modell gestalten, bei dem jeder Controller und jede Anwendung einen eigenen, minimal privilegierten Service Account statt eines gemeinsamen, breit berechtigten Kontos verwendet.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein unautorisiertes API-Server-Zugriffsproblem auf eine fehlende oder überprivilegierte RoleBinding statt auf ein allgemeines Berechtigungsproblem zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Least-Privilege-RBAC-Konfiguration mit dediziertem Service Account pro Workload als verpflichtenden Standard im Unternehmen etablieren, um die Angriffsfläche kompromittierter Workloads zu begrenzen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene RBAC-Aggregation und ClusterRole-Vererbungsmuster im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis von Roles, Bindings und Least Privilege, nicht jedes fortgeschrittene Vererbungsmuster."}}, "lab_validation": [{"lab_id": "KB-0392-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes RBAC-Modell mit einem minimal privilegierten und einem überprivilegierten Service Account", "evidence": "Ein Service Account mit einer minimal privilegierten Role kann nur die explizit erlaubte Operation (Lesen von Pods) ausführen und wird bei einem Versuch, eine nicht erlaubte Operation (Löschen von Pods) durchzuführen, korrekt abgelehnt; ein überprivilegierter Service Account mit einer breiten ClusterRole kann beide Operationen ausführen, was das erhöhte Risiko bei dessen Kompromittierung demonstriert.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, künstlich konstruiertes Berechtigungsszenario."}]}
---
# RBAC und Service Accounts

> **Ziel:** Role-Based Access Control (RBAC) in Kubernetes definiert über Roles (welche Operationen auf welchen Ressourcen erlaubt sind) und Bindings (welche Identität eine bestimmte Role erhält), wer welche Aktionen über die API-Server-Schnittstelle (siehe [KB-0383](05-kubernetes-control-plane.md)) durchführen darf. Ein Service Account ist die Identität, die eine Anwendung oder ein Controller (im Gegensatz zu einem menschlichen Nutzer) beim Zugriff auf die Kubernetes-API verwendet. Der zentrale Punkt dieses Kapitels ist die konsequente Anwendung des Least-Privilege-Prinzips: jeder Controller und jede Anwendung sollte einen eigenen, minimal privilegierten Service Account statt eines gemeinsamen, breit berechtigten Kontos verwenden.

## Zweck, Mental Model und Dependencies

Eine Role (namensraum-beschränkt) oder ClusterRole (clusterweit) definiert eine Liste erlaubter Operationen (z. B. "get", "list", "delete") auf bestimmten Ressourcentypen (z. B. "pods", "secrets"). Ein RoleBinding oder ClusterRoleBinding verknüpft eine solche Role mit einer konkreten Identität — üblicherweise einem Service Account für Anwendungen und Controller, oder einem Nutzerkonto für Menschen. Jeder Pod kann einem spezifischen Service Account zugeordnet werden; dieser Service Account erhält ein automatisch projiziertes, zeitlich begrenztes Token, das der Anwendung im Pod zur Authentifizierung gegenüber dem API Server zur Verfügung steht. Der zentrale Sicherheitsgrundsatz ist Least Privilege: statt einen einzigen, breit berechtigten Service Account für viele unterschiedliche Anwendungen zu verwenden (was bei Kompromittierung einer einzelnen Anwendung Zugriff auf alle mit diesem Konto verknüpften Berechtigungen ermöglicht), erhält jede Anwendung oder jeder Controller einen eigenen, dedizierten Service Account mit ausschließlich den tatsächlich für seine Funktion notwendigen Berechtigungen. Dies begrenzt den Schaden im Falle einer Kompromittierung: ein kompromittierter Service Account mit minimal notwendigen Rechten kann deutlich weniger Schaden anrichten als ein kompromittierter, breit berechtigter Service Account, der versehentlich von vielen unterschiedlichen Anwendungen gemeinsam genutzt wird.

~~~text
Role/ClusterRole: list of ALLOWED operations (get, list, delete, ...) on specific resource types (pods, secrets, ...)
RoleBinding/ClusterRoleBinding: connects a Role to a concrete identity (Service Account for apps/controllers, user for humans)
Service Account: identity a pod uses to authenticate to the API Server -- gets an auto-projected, time-limited token
LEAST PRIVILEGE PRINCIPLE:
  BAD: one broadly-permissioned Service Account shared across many different applications
       -> compromise of ANY ONE app grants access to ALL permissions bound to that shared account
  GOOD: each app/controller gets its OWN dedicated Service Account with ONLY the permissions its function actually needs
       -> compromise blast radius limited to that one app's minimal necessary permissions
~~~

## Core Concepts, Architektur und Implementierung

| Element | Rolle | Least-Privilege-Konsequenz |
|---|---|---|
| Role/ClusterRole | definiert erlaubte Operationen auf Ressourcentypen | so eng wie möglich fassen, nur tatsächlich benötigte Verben/Ressourcen |
| RoleBinding/ClusterRoleBinding | verknüpft eine Role mit einer Identität | pro Anwendung/Controller eine eigene, gezielte Bindung statt gemeinsamer breiter Bindung |
| Service Account | Identität von Anwendungen/Controllern | dediziert pro Workload, nicht gemeinsam über mehrere Workloads genutzt |

Implementierung: Für jede Anwendung oder jeden Controller wird ein dedizierter Service Account erstellt, dem über eine spezifisch zugeschnittene Role ausschließlich die für seine tatsächliche Funktion notwendigen Berechtigungen zugewiesen werden (z. B. nur Lesezugriff auf eine bestimmte ConfigMap, statt Vollzugriff auf alle Ressourcen im Namespace). Bei einem gemeldeten Berechtigungsproblem wird zuerst geprüft, ob der Service Account des betroffenen Pods tatsächlich über die für die angeforderte Operation notwendige Role-Bindung verfügt. Regelmäßig wird geprüft, ob bestehende Roles Berechtigungen enthalten, die von der jeweiligen Anwendung tatsächlich nicht mehr genutzt werden, und diese werden entsprechend eingeschränkt.

## Scalability, Reliability, Security und Observability

Least-Privilege-RBAC skaliert die Sicherheitsisolation zwischen Workloads proportional zur Granularität der zugewiesenen Berechtigungen; die Reliability-Grenze liegt darin, dass gemeinsam genutzte, breit berechtigte Service Accounts proportional zur Anzahl der sie nutzenden Anwendungen das Risiko einer weitreichenden Kompromittierung bei einem einzelnen Sicherheitsvorfall erhöhen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Anwendung erhält eine "Forbidden"-Fehlermeldung beim Zugriff auf die Kubernetes-API | der zugeordnete Service Account besitzt keine passende RoleBinding für die angeforderte Operation | die Role-Berechtigungen des Service Accounts gegen die tatsächlich angeforderte Operation und Ressource prüfen |
| ein kompromittierter Pod ermöglicht einem Angreifer weitreichenden Zugriff auf viele unterschiedliche Cluster-Ressourcen | der Service Account des kompromittierten Pods ist überprivilegiert und wird möglicherweise von mehreren Anwendungen gemeinsam genutzt | die dem Service Account zugewiesenen Berechtigungen auf das tatsächlich benötigte Minimum reduzieren und dedizierte Service Accounts pro Anwendung einführen |
| eine neue Anwendung funktioniert nach dem Deployment nicht, da sie bestimmte Kubernetes-API-Operationen nicht durchführen kann | dem Service Account der Anwendung fehlen die für ihre Funktion notwendigen, spezifischen Berechtigungen | die tatsächlich von der Anwendung benötigten API-Operationen identifizieren und eine entsprechend zugeschnittene Role erstellen |

Security: Das zentrale Sicherheitsprinzip dieses Kapitels ist Least Privilege — jeder Service Account sollte ausschließlich die für seine tatsächliche Funktion notwendigen Berechtigungen besitzen, um die Angriffsfläche bei Kompromittierung zu minimieren. Observability: Die Anzahl der Service Accounts mit tatsächlich ungenutzten, überschüssigen Berechtigungen, sowie die Anzahl der Anwendungen, die einen gemeinsamen statt dedizierten Service Account verwenden, sind zentrale Sicherheitsmetriken.

## Trade-offs und Entscheidungen

**Staff** implementiert dedizierte, minimal privilegierte Service Accounts für jede Anwendung und jeden Controller. **Principal** macht die zugewiesenen Berechtigungen und deren Begründung für das Team nachvollziehbar. **Chief** etabliert Least-Privilege-RBAC mit dediziertem Service Account pro Workload als verpflichtenden Standard im Unternehmen, um die Angriffsfläche kompromittierter Workloads zu begrenzen.

Anti-Patterns: mehrere unterschiedliche Anwendungen einen gemeinsamen, breit berechtigten Service Account verwenden lassen; ClusterRoles mit weitreichenden Berechtigungen ("*") ohne tatsächlichen Bedarf zuweisen; Berechtigungen von Service Accounts nie auf tatsächliche Nutzung überprüfen und regelmäßig eingeschränkt werden.

## Production Checklist

- [ ] Jede Anwendung/jeder Controller verwendet einen dedizierten, nicht gemeinsam genutzten Service Account.
- [ ] Roles gewähren ausschließlich die für die jeweilige Funktion tatsächlich notwendigen Berechtigungen.
- [ ] Bestehende Role-Berechtigungen werden regelmäßig gegen tatsächliche Nutzung geprüft und eingeschränkt.
- [ ] Bei Berechtigungsproblemen wird die spezifische Role-Bindung des betroffenen Service Accounts geprüft.

## Interviewfragen

### 1. Was ist der Unterschied zwischen einer Role und einem RoleBinding?

**Antwort:** Eine Role definiert eine Liste erlaubter Operationen auf bestimmten Ressourcentypen; ein RoleBinding verknüpft diese Role mit einer konkreten Identität (Service Account oder Nutzer).

### 2. Was ist ein Service Account, und wozu wird er verwendet?

**Antwort:** Die Identität, die eine Anwendung oder ein Controller (im Gegensatz zu einem menschlichen Nutzer) beim Zugriff auf die Kubernetes-API verwendet, authentifiziert über ein automatisch projiziertes Token.

### 3. Warum ist ein gemeinsam genutzter, breit berechtigter Service Account riskant?

**Antwort:** Eine Kompromittierung einer einzelnen Anwendung, die diesen Service Account verwendet, gewährt Zugriff auf alle mit diesem Konto verknüpften Berechtigungen, auch solche, die für diese spezifische Anwendung gar nicht notwendig wären.

### 4. Wie wendest du das Least-Privilege-Prinzip bei der RBAC-Konfiguration an?

**Antwort:** Jede Anwendung oder jeder Controller erhält einen eigenen, dedizierten Service Account mit einer spezifisch zugeschnittenen Role, die ausschließlich die für die tatsächliche Funktion notwendigen Berechtigungen enthält.

### 5. Wie gehst du vor, wenn eine Anwendung eine "Forbidden"-Fehlermeldung beim API-Zugriff erhält?

**Antwort:** Ich prüfe, ob der zugeordnete Service Account tatsächlich über eine passende RoleBinding für die angeforderte Operation und Ressource verfügt, und ergänze diese bei Bedarf gezielt.

### 6. Widersprüchliche Anforderung: Team will schnelle, unkomplizierte Entwicklung ohne wiederholte Berechtigungsanfragen UND garantiert minimal privilegierte Service Accounts — wie gehst du vor?

**Antwort:** Ich würde ein standardisiertes Set an vordefinierten, eng zugeschnittenen Rollenvorlagen für häufige Anwendungsmuster bereitstellen, die Entwicklerteams direkt verwenden können, sodass keine individuelle Berechtigungsanfrage pro neuer Anwendung nötig ist, während jede Vorlage weiterhin dem Least-Privilege-Prinzip entspricht.

## Praktische Labs

~~~python
class SimulatedRBAC:
    def __init__(self):
        self.role_permissions = {}  # role_name -> set of (verb, resource)
        self.bindings = {}  # service_account -> role_name

    def create_role(self, role_name, permissions):
        self.role_permissions[role_name] = set(permissions)

    def bind_role(self, service_account, role_name):
        self.bindings[service_account] = role_name

    def can_perform(self, service_account, verb, resource):
        role_name = self.bindings.get(service_account)
        if not role_name:
            return False
        return (verb, resource) in self.role_permissions.get(role_name, set())

rbac = SimulatedRBAC()

rbac.create_role("pod-reader", permissions=[("get", "pods"), ("list", "pods")])
rbac.bind_role("app-a-service-account", "pod-reader")

rbac.create_role("cluster-admin-like", permissions=[("get", "pods"), ("list", "pods"), ("delete", "pods"), ("delete", "secrets")])
rbac.bind_role("shared-legacy-service-account", "cluster-admin-like")

print(f"app-a (minimal privilege) can list pods: {rbac.can_perform('app-a-service-account', 'list', 'pods')}")
print(f"app-a (minimal privilege) can delete pods: {rbac.can_perform('app-a-service-account', 'delete', 'pods')} (correctly denied)")
print(f"shared-legacy (over-privileged) can delete secrets: {rbac.can_perform('shared-legacy-service-account', 'delete', 'secrets')} (RISK if compromised)")
~~~

## Dependencies, Cross-References und Quellen

1. Kubernetes-Dokumentation: [Using RBAC Authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/), abgerufen 2026-09-17.
2. Kubernetes-Dokumentation: [Managing Service Accounts](https://kubernetes.io/docs/reference/access-authn-authz/service-accounts-admin/), abgerufen 2026-09-17.

Kubernetes Control Plane ist kanonisch in [KB-0383](05-kubernetes-control-plane.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte RBAC-Analysewerkzeuge, die ungenutzte oder überschüssige Berechtigungen von Service Accounts erkennen | Adopting | Gegenüber manueller Berechtigungsprüfung für systematischere, kontinuierliche Least-Privilege-Durchsetzung bevorzugen. |
| Kurzlebige, automatisch rotierende Service-Account-Tokens statt langlebiger, statischer Tokens | Adopting | Gegenüber langlebigen Tokens für reduziertes Risiko bei kompromittierten Anmeldedaten bevorzugen. |

Ein Team akzeptiert eine RBAC-Konfiguration erst, wenn jeder Service Account nachweislich nur die tatsächlich für seine Funktion notwendigen Berechtigungen besitzt.
