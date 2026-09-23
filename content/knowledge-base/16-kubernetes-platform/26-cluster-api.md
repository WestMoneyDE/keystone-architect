---
{"id": "KB-0404", "title": "Cluster API", "domain": "16", "sequence": 26, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0383", "concepts": ["Kubernetes Control Plane"], "needed_for": "understanding"}, {"id": "KB-0398", "concepts": ["Controller und Operatoren"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Workload-Cluster deklarativ über Cluster-API-Ressourcen definieren und dessen Bootstrap-Prozess von einem Management-Cluster aus nachvollziehen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Cluster-Lifecycle-Strategie gestalten, die Management-Cluster-Ausfälle als eigenständiges, kontrolliertes Betriebsszenario statt als übersehenes Randproblem behandelt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein fehlgeschlagenes Cluster-Upgrade auf einen konkreten Schritt im Machine-Lebenszyklus (Bootstrap, Rollout, Health-Check) zurückführen können, statt es pauschal als 'Cluster-API-Problem' zu behandeln.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Kontrollierte, getestete Wiederherstellungsprozesse für Management-Cluster-Ausfälle als verpflichtenden Standard für Cluster-API-basierten Betrieb im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Providerspezifische Cluster-API-Infrastruktur-Provider-Implementierungen im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis von deklarativem Cluster-Lifecycle-Management und Management-Cluster-Risiken, nicht ein spezifischer Infrastruktur-Provider."}}, "lab_validation": [{"lab_id": "KB-0404-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal beschriebener Cluster-API-Workflow anhand offizieller Dokumentation, kein aktiver Management-Cluster verwendet", "evidence": "Anhand der offiziellen Cluster-API-Dokumentation wird der deklarative Ablauf von Cluster-, Machine- und Bootstrap-Ressourcen nachvollzogen, sowie das Risiko eines Management-Cluster-Ausfalls beschrieben, der die Verwaltungsfähigkeit aller von ihm verwalteten Workload-Cluster beeinträchtigen kann.", "limitations": "Keine reale Ausführung gegen eine produktive Cluster-API-Installation."}]}
---
# Cluster API

> **Ziel:** Cluster API verwaltet den vollständigen Lebenszyklus von Kubernetes-Clustern selbst (nicht von Workloads innerhalb eines Clusters) deklarativ, über einen sogenannten Management-Cluster, der die Erstellung, Aktualisierung und Löschung anderer, sogenannter Workload-Cluster steuert. Der zentrale Punkt dieses Kapitels ist, dass ein Ausfall des Management-Clusters selbst ein eigenständiges, kontrolliert zu behandelndes Betriebsszenario ist — wird er übersehen, kann die Verwaltungsfähigkeit aller von diesem Management-Cluster gesteuerten Workload-Cluster beeinträchtigt werden, selbst wenn die Workload-Cluster selbst weiterhin unabhängig funktionsfähig bleiben.

## Zweck, Mental Model und Dependencies

Cluster API überträgt das aus Controllern und Operatoren bekannte Reconciliation-Muster (siehe [KB-0398](20-controller-und-operatoren.md)) auf die Ebene ganzer Kubernetes-Cluster: eine Cluster-Ressource deklariert den gewünschten Zustand eines Kubernetes-Clusters (Kubernetes-Version, Netzwerkkonfiguration), Machine-Ressourcen deklarieren die einzelnen Knoten dieses Clusters, und ein Infrastruktur-Provider (spezifisch für die jeweilige Cloud- oder On-Premise-Umgebung) setzt diese deklarierten Ressourcen in tatsächliche, provisionierte Maschinen um. Der Bootstrap-Prozess initialisiert einen neuen Knoten (z. B. Installation der Kubernetes-Komponenten, Beitritt zum Cluster) basierend auf einer deklarierten Bootstrap-Konfiguration. Diese gesamte Verwaltungslogik läuft selbst als Kubernetes-Controller auf einem separaten Management-Cluster — ein zentraler, oft übersehener architektonischer Punkt ist, dass dieser Management-Cluster selbst ein Single Point of Failure für die Verwaltungsfähigkeit (nicht notwendigerweise die Funktionsfähigkeit) aller von ihm gesteuerten Workload-Cluster darstellt: fällt der Management-Cluster aus, können bestehende Workload-Cluster weiterhin unabhängig funktionieren (sie sind nach der Erstellung nicht mehr direkt vom Management-Cluster abhängig), aber es ist nicht mehr möglich, neue Cluster zu erstellen, bestehende zu aktualisieren, oder Knoten automatisch zu ersetzen, bis der Management-Cluster wiederhergestellt ist. Ein Upgrade eines Workload-Clusters durchläuft mehrere diskrete Schritte (Bootstrap neuer Knoten mit der Ziel-Kubernetes-Version, schrittweiser Rollout, Health-Checks pro Knoten) — ein fehlgeschlagenes Upgrade sollte auf den konkreten, fehlgeschlagenen Schritt zurückgeführt werden, statt pauschal als "Cluster-API-Problem" behandelt zu werden.

~~~text
Cluster API: applies the reconciliation pattern (cf. KB-0398) to WHOLE Kubernetes clusters, not workloads within one
  Cluster resource: declares desired cluster state (K8s version, networking)
  Machine resources: declare individual nodes
  Infrastructure provider: translates declared resources into actual provisioned machines (cloud/on-prem specific)
  Bootstrap: initializes a new node (install K8s components, join cluster) per declared bootstrap config
CRITICAL, OFTEN OVERLOOKED ARCHITECTURAL POINT: this all runs as controllers on a SEPARATE Management Cluster
  Management Cluster is a SINGLE POINT OF FAILURE for MANAGEMENT capability of all its workload clusters
  -> workload clusters keep RUNNING independently after creation, but:
     no new clusters, no upgrades, no automatic node replacement possible until management cluster is restored
Upgrade steps (discrete): bootstrap new nodes at target version -> staged rollout -> per-node health checks
  -> a failed upgrade should be traced to the SPECIFIC failed step, not treated as a generic "Cluster API problem"
~~~

## Core Concepts, Architektur und Implementierung

| Ressource/Konzept | Rolle | Risiko bei Management-Cluster-Ausfall |
|---|---|---|
| Management-Cluster | betreibt die Cluster-API-Controller selbst | Verlust der Verwaltungsfähigkeit für alle gesteuerten Workload-Cluster |
| Workload-Cluster | der eigentliche, von Anwendungen genutzte Cluster | funktioniert nach Erstellung weiterhin unabhängig, solange kein Upgrade/keine Skalierung nötig ist |
| Bootstrap-Konfiguration | initialisiert neue Knoten | ein fehlgeschlagener Bootstrap-Schritt blockiert die Knotenerstellung an dieser konkreten Stelle |

Implementierung: Der Management-Cluster wird mit derselben Sorgfalt betrieben wie jeder andere kritische Produktionscluster, einschließlich eigener Backup-, Hochverfügbarkeits- und Wiederherstellungsstrategien — nicht als Nebensächlichkeit, sondern als eigenständiges, kritisches System behandelt, dessen Ausfall die Verwaltungsfähigkeit aller Workload-Cluster beeinträchtigt. Ein dokumentierter, getesteter Wiederherstellungsprozess für den Management-Cluster selbst (z. B. Wiederherstellung aus einem Backup, oder Bootstrap eines neuen Management-Clusters mit Übernahme der bestehenden Cluster-API-Ressourcendefinitionen) wird vor dem tatsächlichen Bedarf verifiziert. Bei einem fehlgeschlagenen Cluster-Upgrade wird der Status der Machine-Ressourcen und des Bootstrap-Prozesses geprüft, um den konkreten fehlgeschlagenen Schritt (Bootstrap, Rollout, Health-Check) zu identifizieren.

## Scalability, Reliability, Security und Observability

Cluster API skaliert die Verwaltung vieler Kubernetes-Cluster über eine einheitliche, deklarative Schnittstelle proportional zur Konsistenz der zugrunde liegenden Infrastruktur-Provider-Implementierung; die Reliability-Grenze liegt darin, dass ein einzelner, nicht hochverfügbar betriebener Management-Cluster proportional zur Anzahl der von ihm verwalteten Workload-Cluster ein wachsendes Risiko für deren Verwaltungsfähigkeit darstellt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| neue Workload-Cluster können nicht mehr erstellt werden, obwohl bestehende Cluster weiterhin funktionieren | der Management-Cluster selbst ist ausgefallen oder nicht erreichbar | den Status und die Verfügbarkeit des Management-Clusters direkt prüfen |
| ein Cluster-Upgrade bleibt bei einem Teil der Knoten hängen | ein konkreter Bootstrap- oder Health-Check-Schritt für die betroffenen Knoten ist fehlgeschlagen | den Status der betroffenen Machine-Ressourcen und die Bootstrap-Logs für den konkret fehlgeschlagenen Schritt prüfen |
| ein Team hat keinen dokumentierten Prozess zur Wiederherstellung eines ausgefallenen Management-Clusters | der Management-Cluster wurde als Nebensächlichkeit statt als eigenständiges kritisches System behandelt | einen expliziten, getesteten Wiederherstellungsprozess für den Management-Cluster dokumentieren und verifizieren |

Security: Der Management-Cluster besitzt typischerweise weitreichende Berechtigungen zur Erstellung und Verwaltung von Infrastruktur in der zugrunde liegenden Cloud-Umgebung; sein Zugriffsschutz sollte entsprechend seiner kritischen, privilegierten Rolle besonders sorgfältig konfiguriert werden. Observability: Die Verfügbarkeit des Management-Clusters selbst, der Status jeder Machine-Ressource während eines Upgrades, und die Häufigkeit fehlgeschlagener Bootstrap- oder Health-Check-Schritte sind zentrale Cluster-API-Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert dieselben Betriebssorgfalt (Backup, Hochverfügbarkeit) für den Management-Cluster wie für jeden anderen kritischen Produktionscluster. **Principal** macht den Status jedes Machine-Lebenszyklus-Schritts während eines Upgrades für das Team nachvollziehbar. **Chief** etabliert kontrollierte, getestete Wiederherstellungsprozesse für Management-Cluster-Ausfälle als verpflichtenden Standard für Cluster-API-basierten Betrieb im Unternehmen.

Anti-Patterns: den Management-Cluster als Nebensächlichkeit ohne eigene Backup-/Hochverfügbarkeitsstrategie betreiben; ein fehlgeschlagenes Cluster-Upgrade pauschal als "Cluster-API-Problem" behandeln, ohne den konkret fehlgeschlagenen Schritt zu identifizieren; keinen getesteten Wiederherstellungsprozess für einen Management-Cluster-Ausfall dokumentieren.

## Production Checklist

- [ ] Der Management-Cluster wird mit derselben Sorgfalt wie jeder andere kritische Produktionscluster betrieben.
- [ ] Ein getesteter Wiederherstellungsprozess für einen Management-Cluster-Ausfall ist dokumentiert.
- [ ] Bei fehlgeschlagenen Upgrades wird der konkrete fehlgeschlagene Machine-Lebenszyklus-Schritt identifiziert.
- [ ] Der Zugriffsschutz des Management-Clusters entspricht seiner privilegierten, infrastrukturweiten Rolle.

## Interviewfragen

### 1. Was ist der Unterschied zwischen einem Management-Cluster und einem Workload-Cluster in Cluster API?

**Antwort:** Der Management-Cluster betreibt die Cluster-API-Controller selbst und steuert die Erstellung/Verwaltung anderer Cluster; der Workload-Cluster ist der eigentliche, von Anwendungen genutzte Cluster, der von diesem Management-Cluster erstellt und verwaltet wird.

### 2. Warum ist ein Ausfall des Management-Clusters ein kritisches, eigenständiges Betriebsszenario?

**Antwort:** Bestehende Workload-Cluster funktionieren nach ihrer Erstellung zwar weiterhin unabhängig, aber die Verwaltungsfähigkeit (neue Cluster erstellen, bestehende aktualisieren, Knoten ersetzen) geht verloren, bis der Management-Cluster wiederhergestellt ist.

### 3. Welche diskreten Schritte durchläuft ein Cluster-Upgrade über Cluster API?

**Antwort:** Bootstrap neuer Knoten mit der Ziel-Kubernetes-Version, ein schrittweiser Rollout, und Health-Checks pro Knoten.

### 4. Warum sollte ein fehlgeschlagenes Cluster-Upgrade nicht pauschal als "Cluster-API-Problem" behandelt werden?

**Antwort:** Die tatsächliche Ursache liegt in einem konkreten, diskreten Schritt (Bootstrap, Rollout, Health-Check), und eine pauschale Diagnose verhindert die gezielte Identifikation und Behebung der tatsächlichen Ursache.

### 5. Wie gehst du vor, wenn neue Workload-Cluster nicht mehr erstellt werden können, obwohl bestehende Cluster funktionieren?

**Antwort:** Ich prüfe zuerst den Status und die Verfügbarkeit des Management-Clusters selbst, da dies auf einen Management-Cluster-Ausfall statt auf ein Problem der einzelnen Workload-Cluster hindeutet.

### 6. Widersprüchliche Anforderung: Team will minimalen Betriebsaufwand für den Management-Cluster UND garantiert keine Beeinträchtigung der Verwaltungsfähigkeit bei dessen Ausfall — wie gehst du vor?

**Antwort:** Ich würde den Management-Cluster mit einer angemessenen, aber nicht übermäßigen Hochverfügbarkeitskonfiguration betreiben (z. B. mehrere Control-Plane-Knoten statt eines einzelnen) und einen dokumentierten, getesteten Wiederherstellungsprozess als Rückfalloption bereithalten, sodass der laufende Betriebsaufwand begrenzt bleibt, während ein tatsächlicher Ausfall kontrolliert und zeitnah behoben werden kann.

## Praktische Labs

~~~python
# Conceptual Cluster API resource model (not executed against a real management cluster):

class ClusterResource:
    def __init__(self, name, k8s_version):
        self.name = name
        self.k8s_version = k8s_version
        self.machines = []

class MachineResource:
    def __init__(self, name, bootstrap_status="pending"):
        self.name = name
        self.bootstrap_status = bootstrap_status  # pending, bootstrapping, ready, failed
        self.health_check_passed = False

def diagnose_upgrade_failure(cluster):
    for machine in cluster.machines:
        if machine.bootstrap_status == "failed":
            return f"UPGRADE FAILURE on '{machine.name}': bootstrap step failed."
        if machine.bootstrap_status == "ready" and not machine.health_check_passed:
            return f"UPGRADE FAILURE on '{machine.name}': health check step failed after successful bootstrap."
    return "No failure detected -- all machines bootstrapped and health-checked successfully."

cluster = ClusterResource("prod-cluster", k8s_version="1.31")
cluster.machines = [
    MachineResource("node-1", bootstrap_status="ready"),
    MachineResource("node-2", bootstrap_status="failed"),  # this one failed at the bootstrap step
]
cluster.machines[0].health_check_passed = True

print(diagnose_upgrade_failure(cluster))
~~~

## Dependencies, Cross-References und Quellen

1. Cluster API-Dokumentation: [Cluster API Book — Concepts](https://cluster-api.sigs.k8s.io/user/concepts), abgerufen 2026-09-17.
2. Cluster API-Dokumentation: [Cluster API Book — Bootstrap](https://cluster-api.sigs.k8s.io/tasks/bootstrap-cluster-topology.html), abgerufen 2026-09-17.

Kubernetes Control Plane ist kanonisch in [KB-0383](05-kubernetes-control-plane.md) behandelt; Controller und Operatoren in [KB-0398](20-controller-und-operatoren.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Selbst-verwaltende (self-hosted) Cluster-API-Topologien, bei denen ein Cluster seine eigene Management-Funktion übernimmt | Evaluating | Gegenüber einem separaten dedizierten Management-Cluster abwägen, sobald die zusätzliche Komplexität durch den konkreten Anwendungsfall gerechtfertigt ist. |
| Standardisierte Cluster-Topologievorlagen (ClusterClass), die konsistente Cluster-Konfigurationen über mehrere Umgebungen hinweg garantieren | Adopting | Gegenüber individuell konfigurierten Clustern pro Umgebung für konsistentere, wartbarere Multi-Cluster-Verwaltung bevorzugen. |

Ein Team akzeptiert eine Cluster-API-basierte Verwaltungsarchitektur erst, wenn ein getesteter Wiederherstellungsprozess für den Management-Cluster selbst vorliegt.
