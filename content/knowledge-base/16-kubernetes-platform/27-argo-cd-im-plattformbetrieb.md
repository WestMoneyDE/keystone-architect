---
{"id": "KB-0405", "title": "Argo CD im Plattformbetrieb", "domain": "16", "sequence": 27, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0397", "concepts": ["Helm und Paketverwaltung"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Argo-CD-Application erstellen, die einen Git-Repository-Zustand mit dem Cluster synchronisiert, und den Health-Status nach einer absichtlich fehlerhaften Änderung beobachten.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein Multi-Mandanten-Argo-CD-Setup gestalten, das Berechtigungen und Mandantengrenzen zwischen unterschiedlichen Teams technisch durchsetzt, statt sich auf organisatorische Vereinbarungen zu verlassen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen fehlgeschlagenen Sync-Vorgang auf eine konkrete Diskrepanz zwischen deklariertem Git-Zustand und tatsächlichem Cluster-Zustand zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Technisch durchgesetzte Mandantengrenzen in Argo-CD-basiertem Plattformbetrieb als verpflichtenden Standard im Unternehmen etablieren, statt organisatorischer Vereinbarungen allein zu vertrauen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene ApplicationSet-Muster für dynamische Multi-Cluster-Bereitstellung im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis von Applications, Sync, Health und Mandantengrenzen, nicht jedes ApplicationSet-Muster."}}, "lab_validation": [{"lab_id": "KB-0405-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal beschriebener Argo-CD-Workflow anhand offizieller Dokumentation, kein aktiver Cluster verwendet", "evidence": "Anhand der offiziellen Argo-CD-Dokumentation wird der Ablauf von Application-Definition, Sync-Vorgang und Health-Status-Bewertung nachvollzogen, sowie die Notwendigkeit technisch durchgesetzter RBAC-Grenzen zwischen mehreren Mandanten (Teams) auf derselben Argo-CD-Instanz beschrieben.", "limitations": "Keine reale Ausführung gegen eine produktive Argo-CD-Installation."}]}
---
# Argo CD im Plattformbetrieb

> **Ziel:** Argo CD implementiert eine Application-Ressource, die einen deklarierten Zustand aus einem Git-Repository (aufbauend auf Helm-Charts, siehe [KB-0397](19-helm-und-paketverwaltung.md), oder rohen Kubernetes-Manifesten) mit dem tatsächlichen Cluster-Zustand über einen kontinuierlichen Sync-Vorgang abgleicht, und dessen Health-Status bewertet. Der zentrale Punkt dieses Kapitels ist die praktische Verantwortungsübernahme im Plattformbetrieb: Mandantengrenzen (klare Trennung, welches Team auf welche Applications/Cluster zugreifen darf) und Berechtigungen müssen technisch durchgesetzt werden, wenn mehrere Teams dieselbe Argo-CD-Instanz gemeinsam nutzen. Die allgemeine GitOps-Prozesssemantik (deklarativer, git-basierter Betrieb als Grundprinzip) wird in Domain 22 kanonisch behandelt und hier nicht wiederholt.

## Zweck, Mental Model und Dependencies

Eine Argo-CD-Application-Ressource verknüpft eine Quelle (ein Git-Repository mit einem Pfad, der Kubernetes-Manifeste oder einen Helm-Chart enthält) mit einem Ziel (einem konkreten Cluster und Namespace). Der Sync-Vorgang vergleicht kontinuierlich den im Git-Repository deklarierten Zustand mit dem tatsächlichen Cluster-Zustand und wendet bei Abweichungen die notwendigen Änderungen an, um beide Zustände wieder in Übereinstimmung zu bringen — dies ist eine Anwendung desselben Reconciliation-Prinzips wie bei Kubernetes-Controllern (siehe [KB-0398](20-controller-und-operatoren.md)), nur auf der Ebene ganzer Anwendungsbereitstellungen statt einzelner Ressourcentypen. Der Health-Status einer Application bewertet, ob die tatsächlich bereitgestellten Ressourcen nicht nur syntaktisch mit Git übereinstimmen (Sync-Status), sondern auch tatsächlich funktionsfähig sind (z. B. sind alle Pods bereit, ist ein Deployment vollständig ausgerollt) — eine Application kann synchronisiert, aber dennoch ungesund sein, wenn die bereitgestellten Ressourcen zwar korrekt aus Git übernommen wurden, aber zur Laufzeit fehlschlagen. Im praktischen Plattformbetrieb, bei dem mehrere unterschiedliche Teams dieselbe Argo-CD-Instanz gemeinsam nutzen, ist die technische Durchsetzung von Mandantengrenzen kritisch: jedes Team sollte technisch (über Argo-CD-eigene RBAC-Projekte, nicht nur organisatorische Vereinbarungen) auf seine eigenen Applications und Zielcluster/-Namespaces beschränkt sein, um zu verhindern, dass ein Team versehentlich oder böswillig Änderungen an den Ressourcen eines anderen Teams vornehmen kann.

~~~text
Argo CD Application: links a SOURCE (git repo + path, containing manifests or a Helm chart) to a TARGET (cluster + namespace)
Sync: continuously compares Git-declared state vs. actual cluster state -> applies changes to reconcile
  (same reconciliation principle as Kubernetes controllers, cf. KB-0398, but at the WHOLE-APPLICATION level)
Health status: is the deployed resource ACTUALLY FUNCTIONAL (pods ready, deployment fully rolled out)?
  -> Sync-status ("matches Git") and Health-status ("actually works") are DIFFERENT dimensions
  -> an Application can be Synced but Unhealthy
PRACTICAL PLATFORM OPERATION CONCERN: multi-tenant Argo CD instance shared across teams
  -> mandate boundaries MUST be technically enforced via Argo CD's own RBAC projects, NOT just organizational agreement
  -> prevents one team from (accidentally or maliciously) modifying another team's resources
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Multi-Mandanten-Risiko ohne technische Durchsetzung |
|---|---|---|
| Application | verknüpft Git-Quelle mit Cluster-Ziel | ohne Beschränkung kann jedes Team beliebige Applications erstellen/ändern |
| Sync-Status | zeigt Übereinstimmung zwischen Git und Cluster | allein nicht ausreichend, um Funktionsfähigkeit zu beurteilen |
| Health-Status | zeigt tatsächliche Funktionsfähigkeit der Ressourcen | eine synchronisierte, aber ungesunde Application kann unbemerkt bleiben, wenn nur Sync-Status geprüft wird |
| RBAC-Projekte | begrenzen technisch, welches Team auf welche Applications/Cluster zugreifen darf | ohne technische Durchsetzung sind Mandantengrenzen nur organisatorische Vereinbarungen |

Implementierung: Für jedes Team, das dieselbe Argo-CD-Instanz nutzt, wird ein eigenes, technisch abgegrenztes RBAC-Projekt konfiguriert, das den Zugriff auf Applications, Cluster und Namespaces explizit auf die tatsächlich diesem Team zugewiesenen Ressourcen beschränkt. Sowohl Sync- als auch Health-Status jeder Application werden aktiv überwacht — ein "Synced, aber Unhealthy"-Zustand wird als eigenständiges, zu untersuchendes Signal behandelt, nicht als "im Wesentlichen erfolgreich" ignoriert. Bei einem fehlgeschlagenen Sync-Vorgang wird die konkrete Diskrepanz zwischen deklariertem Git-Zustand und tatsächlichem Cluster-Zustand (z. B. eine manuell am Cluster vorgenommene, nicht in Git reflektierte Änderung) identifiziert, statt den Sync pauschal zu wiederholen.

## Scalability, Reliability, Security und Observability

Argo CD skaliert konsistente, git-basierte Bereitstellung über viele Applications und Cluster proportional zur Konsistenz der zugrunde liegenden RBAC-Projektstruktur; die Reliability-Grenze liegt darin, dass eine ausschließlich organisatorisch (nicht technisch) durchgesetzte Mandantentrennung proportional zur Anzahl der Teams das Risiko unbeabsichtigter, teamübergreifender Änderungen erhöht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Application zeigt "Synced", aber die zugehörige Anwendung funktioniert nicht korrekt | der Sync-Status allein wurde geprüft, ohne den Health-Status zu berücksichtigen | den Health-Status der Application explizit prüfen und die zugrunde liegende Ressourcen-Diagnose (z. B. Pod-Status) untersuchen |
| ein Team kann versehentlich Applications eines anderen Teams ändern | keine technisch durchgesetzten RBAC-Projekte trennen die Zugriffsrechte der Teams | ein eigenes RBAC-Projekt pro Team konfigurieren, das den Zugriff technisch auf die zugewiesenen Ressourcen beschränkt |
| ein Sync-Vorgang schlägt wiederholt fehl | eine manuelle, nicht in Git reflektierte Änderung am Cluster steht im Konflikt mit dem deklarierten Git-Zustand | die konkrete Diskrepanz zwischen Git- und Cluster-Zustand identifizieren, statt den Sync pauschal zu wiederholen |

Security: Technisch durchgesetzte Mandantengrenzen über Argo-CD-RBAC-Projekte sind essenziell in einer Multi-Team-Plattform, um zu verhindern, dass ein kompromittiertes oder fehlerhaft konfiguriertes Team-Zugriffskonto Ressourcen außerhalb seines zugewiesenen Bereichs verändern kann. Observability: Der Sync- und Health-Status jeder Application, die Häufigkeit von "Synced, aber Unhealthy"-Zuständen, und die Anzahl technisch durchgesetzter RBAC-Projektgrenzen sind zentrale Plattformbetriebs-Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert technisch durchgesetzte RBAC-Projekte pro Team in einer Multi-Mandanten-Argo-CD-Instanz. **Principal** macht Sync- und Health-Status jeder Application für das Team nachvollziehbar. **Chief** etabliert technisch durchgesetzte Mandantengrenzen im Argo-CD-basierten Plattformbetrieb als verpflichtenden Standard im Unternehmen, statt organisatorischer Vereinbarungen allein zu vertrauen.

Anti-Patterns: eine Application allein am Sync-Status als "erfolgreich" beurteilen, ohne den Health-Status zu prüfen; mehrere Teams auf derselben Argo-CD-Instanz ohne technisch durchgesetzte RBAC-Projektgrenzen betreiben; manuelle, nicht in Git reflektierte Änderungen am Cluster vornehmen, die mit dem deklarierten GitOps-Zustand in Konflikt geraten.

## Production Checklist

- [ ] Jedes Team in einer Multi-Mandanten-Argo-CD-Instanz besitzt ein technisch abgegrenztes RBAC-Projekt.
- [ ] Sowohl Sync- als auch Health-Status jeder Application werden aktiv überwacht.
- [ ] Manuelle Cluster-Änderungen außerhalb des Git-deklarierten Zustands werden vermieden oder explizit dokumentiert.
- [ ] Fehlgeschlagene Sync-Vorgänge werden auf die konkrete Git-Cluster-Diskrepanz zurückgeführt.

## Interviewfragen

### 1. Was ist der Unterschied zwischen Sync-Status und Health-Status einer Argo-CD-Application?

**Antwort:** Der Sync-Status zeigt, ob der Cluster-Zustand mit dem in Git deklarierten Zustand übereinstimmt; der Health-Status zeigt, ob die bereitgestellten Ressourcen tatsächlich funktionsfähig sind — eine Application kann synchronisiert, aber dennoch ungesund sein.

### 2. Warum ist die technische Durchsetzung von Mandantengrenzen in einer Multi-Team-Argo-CD-Instanz wichtig?

**Antwort:** Ohne technisch durchgesetzte RBAC-Projekte könnte ein Team versehentlich oder böswillig Änderungen an den Applications oder Clustern eines anderen Teams vornehmen, da eine rein organisatorische Vereinbarung keine tatsächliche Zugriffskontrolle darstellt.

### 3. Was tut der Sync-Vorgang bei einer Argo-CD-Application?

**Antwort:** Er vergleicht kontinuierlich den in Git deklarierten Zustand mit dem tatsächlichen Cluster-Zustand und wendet bei Abweichungen die notwendigen Änderungen an, um beide wieder in Übereinstimmung zu bringen.

### 4. Warum kann eine Application "Synced" sein, aber trotzdem nicht funktionieren?

**Antwort:** Der Sync-Status prüft nur die syntaktische Übereinstimmung mit Git; der tatsächliche Funktionszustand (z. B. ob Pods bereit sind) wird separat über den Health-Status bewertet, der unabhängig fehlschlagen kann.

### 5. Wie gehst du vor, wenn ein Sync-Vorgang wiederholt fehlschlägt?

**Antwort:** Ich identifiziere die konkrete Diskrepanz zwischen dem deklarierten Git-Zustand und dem tatsächlichen Cluster-Zustand (z. B. eine manuelle, nicht in Git reflektierte Änderung), statt den Sync-Vorgang pauschal zu wiederholen.

### 6. Widersprüchliche Anforderung: mehrere Teams wollen dieselbe Argo-CD-Instanz für geringeren Betriebsaufwand nutzen UND garantiert keine gegenseitige Beeinflussung — wie gehst du vor?

**Antwort:** Ich würde für jedes Team ein eigenes, technisch abgegrenztes RBAC-Projekt konfigurieren, das den Zugriff auf Applications, Cluster und Namespaces strikt auf die zugewiesenen Ressourcen beschränkt, sodass die gemeinsame Infrastruktur den Betriebsaufwand reduziert, während jedes Team technisch daran gehindert wird, auf Ressourcen anderer Teams zuzugreifen.

## Praktische Labs

~~~python
class SimulatedArgoApplication:
    def __init__(self, name, git_declared_state, cluster_actual_state, pods_ready=True):
        self.name = name
        self.git_declared_state = git_declared_state
        self.cluster_actual_state = cluster_actual_state
        self.pods_ready = pods_ready

    @property
    def sync_status(self):
        return "Synced" if self.git_declared_state == self.cluster_actual_state else "OutOfSync"

    @property
    def health_status(self):
        return "Healthy" if self.pods_ready else "Unhealthy"

apps = [
    SimulatedArgoApplication("app-a", "replicas=3", "replicas=3", pods_ready=True),
    SimulatedArgoApplication("app-b", "replicas=3", "replicas=3", pods_ready=False),  # synced but pods failing
    SimulatedArgoApplication("app-c", "replicas=5", "replicas=3", pods_ready=True),  # manual drift from Git
]

for app in apps:
    print(f"{app.name}: sync={app.sync_status}, health={app.health_status}")
    if app.sync_status == "Synced" and app.health_status == "Unhealthy":
        print(f"  -> ATTENTION: '{app.name}' matches Git but is NOT actually functioning correctly!")
~~~

## Dependencies, Cross-References und Quellen

1. Argo CD-Dokumentation: [Core Concepts](https://argo-cd.readthedocs.io/en/stable/core_concepts/), abgerufen 2026-09-17.
2. Argo CD-Dokumentation: [RBAC Configuration](https://argo-cd.readthedocs.io/en/stable/operator-manual/rbac/), abgerufen 2026-09-17.

Helm und Paketverwaltung sind kanonisch in [KB-0397](19-helm-und-paketverwaltung.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| ApplicationSets für dynamische, templated Multi-Cluster-/Multi-Umgebungs-Bereitstellung | Adopting | Gegenüber manuell erstellten Einzel-Applications für konsistentere, skalierbarere Multi-Cluster-Verwaltung bevorzugen. |
| Automatisierte Drift-Erkennung mit proaktiver Benachrichtigung bei manuellen Cluster-Änderungen außerhalb von Git | Adopting | Gegenüber reiner periodischer Sync-Prüfung für schnellere Erkennung unbeabsichtigter manueller Änderungen bevorzugen. |

Ein Team akzeptiert eine Multi-Mandanten-Argo-CD-Konfiguration erst, wenn technisch durchgesetzte RBAC-Projektgrenzen für jedes beteiligte Team nachgewiesen sind.
