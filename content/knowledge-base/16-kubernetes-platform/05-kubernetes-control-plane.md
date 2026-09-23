---
{"id": "KB-0383", "title": "Kubernetes Control Plane", "domain": "16", "sequence": 5, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0104", "concepts": ["Konsens und Quoren"], "needed_for": "understanding"}, {"id": "KB-0380", "concepts": ["CRI und Container-Runtimes"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Kontrollschleife nachvollziehen, die den beobachteten Ist-Zustand über Watches mit dem deklarierten Soll-Zustand abgleicht und Korrekturaktionen auslöst.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Die Rollen von API Server, etcd und Controllern im Kontrollschleifen-Modell so gestalten, dass deklarativer Zustand konsistent durchgesetzt wird.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Bei einem Cluster-Ausfall unterscheiden, ob der API Server, etcd oder ein spezifischer Controller die Ursache ist, statt den gesamten Control Plane pauschal als 'ausgefallen' zu behandeln.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Ein Verständnis für die Konsensgrundlage (etcd) als kritischen Verfügbarkeitsfaktor der Control Plane als Standard für Plattform-Architekturentscheidungen im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte Raft-Implementierung von etcd ist Vertiefung.", "rationale": "Kern ist das Verständnis der Kontrollschleife und der Rolle jeder Komponente, nicht die interne Konsensalgorithmus-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0383-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simulierte Kontrollschleife mit deklariertem Soll-Zustand und beobachtetem Ist-Zustand", "evidence": "Eine simulierte Kontrollschleife erkennt eine Abweichung zwischen deklariertem Soll-Zustand (3 Replicas) und beobachtetem Ist-Zustand (2 Replicas) über eine Watch-Benachrichtigung und löst automatisch eine Korrekturaktion (Erstellung einer fehlenden Replica) aus, ohne dass eine externe, manuelle Anweisung nötig ist.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, künstlich vereinfachtes Kontrollschleifen-Modell."}]}
---
# Kubernetes Control Plane

> **Ziel:** Die Kubernetes Control Plane setzt sich aus dem API Server (der zentrale, zustandslose Eingangspunkt für alle Anfragen), etcd (dem konsensbasierten, verteilten Speicher für den gesamten Clusterzustand, siehe [KB-0104](../05-distributed-systems/04-konsens-und-quoren.md)) und mehreren Controllern (die spezifische Ressourcentypen überwachen und verwalten) zusammen. Der zentrale Punkt dieses Kapitels ist das Kontrollschleifen-Modell: deklarativer Soll-Zustand wird kontinuierlich über Watches mit dem beobachteten Ist-Zustand verglichen, und Abweichungen lösen automatische Korrekturaktionen aus — dieses Modell zu verstehen ist entscheidend, um Ausfälle der Steuerungsebene selbst korrekt zu diagnostizieren.

## Zweck, Mental Model und Dependencies

Der API Server ist der einzige Punkt, über den alle Komponenten (Kubelet, Controller, Nutzer) mit dem Clusterzustand interagieren; er selbst speichert keinen Zustand dauerhaft, sondern validiert und leitet Anfragen an etcd weiter. Etcd ist ein konsensbasierter (typischerweise Raft-basierter, siehe die allgemeinen Konsensgrundlagen in [KB-0104](../05-distributed-systems/04-konsens-und-quoren.md)) verteilter Speicher, der den gesamten deklarierten Zustand des Clusters (welche Ressourcen sollen in welchem Zustand existieren) persistiert — seine Verfügbarkeit hängt von einem Mehrheitsquorum seiner Knoten ab, analog zu den allgemeinen Konsensprinzipien. Ein Controller ist ein spezialisierter Prozess, der einen bestimmten Ressourcentyp überwacht (z. B. der Deployment-Controller überwacht Deployments) und eine Kontrollschleife implementiert: er abonniert über eine Watch-Verbindung Änderungen am relevanten Zustand im API Server, vergleicht den beobachteten Ist-Zustand mit dem deklarierten Soll-Zustand, und löst bei einer Abweichung eine Korrekturaktion aus (z. B. das Erstellen einer fehlenden Pod-Replica). Dieses Kontrollschleifen-Modell ist fundamental für die Diagnose von Steuerungsausfällen: ein Ausfall des API Servers verhindert jegliche Interaktion mit dem Cluster (auch lesend); ein Ausfall von etcd (bzw. Verlust des Quorums) verhindert Änderungen am deklarierten Zustand, kann aber bestehende, bereits laufende Workloads zunächst unberührt lassen; ein Ausfall eines spezifischen Controllers verhindert nur die Korrekturaktionen für den von diesem Controller verwalteten Ressourcentyp, während andere Ressourcentypen weiterhin normal funktionieren — diese drei Ausfallarten erfordern grundlegend unterschiedliche Diagnose- und Wiederherstellungsschritte, statt pauschal "der Cluster ist down" zu diagnostizieren.

~~~text
API Server: single entry point for ALL cluster interaction, STATELESS, validates/forwards requests to etcd
etcd: consensus-based (Raft) distributed store for the FULL declared cluster state
  availability depends on a MAJORITY QUORUM of its nodes (cf. general consensus principles, KB-0104)
Controller: specialized process per resource type, implements a CONTROL LOOP:
  watch (subscribe to changes) -> compare observed state vs. declared desired state -> trigger correction on mismatch
THREE DISTINCT FAILURE MODES requiring DIFFERENT diagnosis:
  API Server down: ALL cluster interaction blocked, even reads
  etcd quorum lost: state CHANGES blocked, but ALREADY-RUNNING workloads may be initially unaffected
  specific controller down: ONLY that controller's resource type stops self-correcting, others unaffected
~~~

## Core Concepts, Architektur und Implementierung

| Komponente | Rolle | Ausfallwirkung |
|---|---|---|
| API Server | zentraler Eingangspunkt, zustandslos | vollständiger Interaktionsstopp mit dem Cluster (auch Lesezugriffe) |
| etcd | konsensbasierter Zustandsspeicher | bei Quorumverlust: keine Zustandsänderungen mehr möglich, laufende Workloads zunächst unberührt |
| Controller | überwacht und korrigiert einen spezifischen Ressourcentyp | nur der jeweilige Ressourcentyp verliert Selbstkorrektur, andere Typen unbeeinträchtigt |

Implementierung: Bei jedem erkannten Cluster-Problem wird zunächst identifiziert, welche der drei Control-Plane-Komponenten tatsächlich betroffen ist: ein vollständiger Interaktionsausfall (auch Lesezugriffe schlagen fehl) deutet auf den API Server hin; ein Ausfall ausschließlich von Schreiboperationen (Erstellen, Ändern) bei weiterhin funktionierenden Lesezugriffen deutet auf einen etcd-Quorumverlust hin; ein Ausbleiben der Selbstkorrektur nur für einen spezifischen Ressourcentyp (z. B. Deployments werden nicht mehr automatisch skaliert, während andere Ressourcen normal funktionieren) deutet auf einen Ausfall des jeweils zuständigen Controllers hin. Diese Unterscheidung bestimmt die passende Wiederherstellungsmaßnahme.

## Scalability, Reliability, Security und Observability

Die Control Plane skaliert Cluster-Verwaltung unabhängig von der Anzahl der Worker-Knoten, solange etcd ein ausreichendes Quorum behält; die Reliability-Grenze liegt darin, dass ein Verlust des etcd-Mehrheitsquorums proportional zur Ausfalldauer die Fähigkeit des gesamten Clusters einschränkt, auf Zustandsänderungen (Skalierung, neue Deployments) zu reagieren.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| jegliche Interaktion mit dem Cluster, auch einfache Lesezugriffe, schlägt fehl | der API Server selbst ist nicht erreichbar oder abgestürzt | den API-Server-Status und dessen Logs direkt prüfen |
| Lesezugriffe funktionieren, aber neue Ressourcen können nicht erstellt oder geändert werden | etcd hat sein Mehrheitsquorum verloren | den etcd-Cluster-Status und die Anzahl verfügbarer etcd-Knoten prüfen |
| ein bestimmter Ressourcentyp (z. B. Deployments) wird nicht mehr automatisch korrigiert, während andere Ressourcentypen normal funktionieren | der spezifisch zuständige Controller ist ausgefallen oder blockiert | den Status und die Logs des jeweils zuständigen Controllers prüfen |

Security: Der API Server ist der zentrale Zugriffskontrollpunkt für den gesamten Cluster; eine Kompromittierung des API Servers oder von etcd (das den vollständigen Clusterzustand einschließlich Secrets enthalten kann) stellt ein kritisches Sicherheitsrisiko dar. Observability: Die Verfügbarkeit des API Servers, der etcd-Quorumstatus, und die Kontrollschleifen-Latenz (Zeit zwischen Zustandsabweichung und Korrekturaktion) pro Controller sind zentrale Control-Plane-Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert eine getrennte Diagnose der drei Control-Plane-Komponenten bei jedem Cluster-Problem. **Principal** macht den etcd-Quorumstatus und Controller-Zustände für das Team nachvollziehbar. **Chief** etabliert ein Verständnis für die Konsensgrundlage von etcd als kritischen Verfügbarkeitsfaktor als Standard für Plattform-Architekturentscheidungen im Unternehmen.

Anti-Patterns: einen Cluster-Ausfall pauschal als "der Cluster ist down" behandeln, ohne zwischen API Server, etcd und spezifischen Controllern zu unterscheiden; etcd ohne ausreichendes Quorum (z. B. mit einer geraden Anzahl an Knoten oder zu wenigen Knoten für Ausfalltoleranz) betreiben; den Zustand einzelner Controller nicht überwachen.

## Production Checklist

- [ ] Der API Server, etcd und jeder Controller werden getrennt überwacht.
- [ ] Etcd wird mit ausreichender Knotenanzahl für Mehrheitsquorum bei Knotenausfall betrieben.
- [ ] Bei einem Cluster-Problem wird zunächst identifiziert, welche der drei Komponenten betroffen ist.
- [ ] Die Kontrollschleifen-Latenz wird pro Controller überwacht.

## Interviewfragen

### 1. Welche drei Hauptkomponenten bilden die Kubernetes Control Plane?

**Antwort:** Der API Server (zentraler Eingangspunkt), etcd (konsensbasierter Zustandsspeicher) und Controller (überwachen und korrigieren spezifische Ressourcentypen).

### 2. Wie funktioniert eine Kontrollschleife?

**Antwort:** Ein Controller abonniert über eine Watch-Verbindung Änderungen am relevanten Zustand, vergleicht den beobachteten Ist-Zustand mit dem deklarierten Soll-Zustand, und löst bei einer Abweichung eine automatische Korrekturaktion aus.

### 3. Was passiert bei einem Verlust des etcd-Mehrheitsquorums?

**Antwort:** Zustandsänderungen (Erstellen, Ändern von Ressourcen) werden blockiert, während bereits laufende Workloads zunächst unberührt bleiben können, da sie nicht von einer sofortigen etcd-Interaktion abhängen.

### 4. Warum ist es wichtig, zwischen den drei Control-Plane-Komponenten bei einem Ausfall zu unterscheiden?

**Antwort:** Jede Komponente hat eine grundlegend andere Ausfallwirkung und erfordert eine andere Diagnose- und Wiederherstellungsmaßnahme; eine pauschale "Cluster ist down"-Behandlung führt zu falscher oder ineffizienter Fehlerbehebung.

### 5. Wie gehst du vor, wenn ein bestimmter Ressourcentyp nicht mehr automatisch korrigiert wird, während andere normal funktionieren?

**Antwort:** Ich prüfe den Status und die Logs des spezifisch für diesen Ressourcentyp zuständigen Controllers, da dies auf einen isolierten Controller-Ausfall statt auf ein allgemeines Cluster-Problem hindeutet.

### 6. Widersprüchliche Anforderung: Team will maximale Cluster-Verfügbarkeit UND minimale etcd-Infrastrukturkosten — wie gehst du vor?

**Antwort:** Ich würde die minimal notwendige, ungerade Anzahl an etcd-Knoten (typischerweise drei) für ein robustes Mehrheitsquorum bei akzeptablem Ausfallrisiko empfehlen, statt entweder auf Kosten der Verfügbarkeit zu sparen oder unnötig viele Knoten für einen nicht benötigten Ausfalltoleranzgrad zu betreiben.

## Praktische Labs

~~~python
class SimulatedControlLoop:
    def __init__(self, desired_replicas):
        self.desired_replicas = desired_replicas
        self.observed_replicas = desired_replicas

    def simulate_replica_loss(self, lost_count):
        self.observed_replicas -= lost_count
        print(f"Watch event: observed replicas dropped to {self.observed_replicas} (desired: {self.desired_replicas})")

    def reconcile(self):
        # This IS the control loop: compare observed vs. desired, correct if mismatched
        if self.observed_replicas < self.desired_replicas:
            missing = self.desired_replicas - self.observed_replicas
            print(f"Reconciliation: creating {missing} missing replica(s) to match desired state.")
            self.observed_replicas = self.desired_replicas
        else:
            print("Reconciliation: no action needed, observed state matches desired state.")

loop = SimulatedControlLoop(desired_replicas=3)
loop.simulate_replica_loss(1)  # a node failure took one replica down
loop.reconcile()  # controller automatically corrects this, no manual intervention needed
~~~

## Dependencies, Cross-References und Quellen

1. Kubernetes-Dokumentation: [Kubernetes Components](https://kubernetes.io/docs/concepts/overview/components/), abgerufen 2026-09-17.
2. etcd-Dokumentation: [etcd — Understanding Failures](https://etcd.io/docs/latest/faq/), abgerufen 2026-09-17.

Konsens und Quoren sind kanonisch in [KB-0104](../05-distributed-systems/04-konsens-und-quoren.md) behandelt; CRI und Container-Runtimes in [KB-0380](02-cri-und-container-runtimes.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte etcd-Quorum-Überwachungswerkzeuge mit proaktiver Warnung vor Quorumverlust | Adopting | Gegenüber reaktiver, manueller Quorumprüfung für frühzeitigere Erkennung bevorzugen. |
| Alternative Control-Plane-Architekturen für Edge-Umgebungen mit reduzierten Konsensanforderungen | Evaluating | Gegenüber Standard-etcd-basierter Control Plane abwägen, sobald spezifische Edge-Anforderungen dies rechtfertigen. |

Ein Team akzeptiert eine Cluster-Problem-Diagnose erst, wenn eindeutig geklärt ist, welche der drei Control-Plane-Komponenten tatsächlich betroffen ist.
