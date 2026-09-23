---
{"id": "KB-0385", "title": "Deployments und ReplicaSets", "domain": "16", "sequence": 7, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0384", "concepts": ["Pods und Lebenszyklen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Rolling Update mit konfigurierten Surge- und Unavailable-Parametern durchführen und den Rolloutstatus während des Übergangs beobachten.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Rolling-Update-Parameter (maxSurge, maxUnavailable) so konfigurieren, dass Verfügbarkeit und Rollout-Geschwindigkeit für einen gegebenen Anwendungsfall ausbalanciert sind.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein hängendes Rolling Update auf eine fehlschlagende Readiness-Probe der neuen Version statt auf ein allgemeines Deployment-Problem zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Korrekt konfigurierte Rolling Updates mit Readiness-Kopplung als Standard für Produktions-Deployments im Unternehmen etablieren, um Verfügbarkeitseinbußen bei Versionswechseln zu vermeiden.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene Deployment-Strategien (Blue-Green, Canary auf Deployment-Ebene) sind Vertiefung.", "rationale": "Kern ist das Verständnis von Desired State, Rolling Updates und Readiness-Kopplung, nicht jede alternative Deployment-Strategie."}}, "lab_validation": [{"lab_id": "KB-0385-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Rolling-Update-Szenario mit einer neuen Version, deren Readiness-Probe fehlschlägt", "evidence": "Ein simuliertes Rolling Update, bei dem die neue Pod-Version ihre Readiness-Probe nie besteht, bleibt korrekt bei einem Teil der neuen Replicas hängen, ohne die verbleibenden, funktionsfähigen alten Replicas zu entfernen, wodurch die Gesamtverfügbarkeit trotz fehlgeschlagenem Rollout erhalten bleibt.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, künstlich konstruiertes Fehlerszenario."}]}
---
# Deployments und ReplicaSets

> **Ziel:** Ein Deployment verwaltet den Desired State (die deklarierte Anzahl und Version von Pod-Replicas) über ein oder mehrere ReplicaSets, aufbauend auf den Pod-Lebenszyklus-Grundlagen (siehe [KB-0384](06-pods-und-lebenszyklen.md)). Der zentrale Punkt dieses Kapitels ist, dass ein Rolling Update (der schrittweise Übergang von einer alten zu einer neuen Pod-Version) über Readiness-Probes mit dem tatsächlichen Verfügbarkeitszustand der neuen Version gekoppelt ist — dieses Kopplungsprinzip ist entscheidend, um hängende oder fehlerhafte Rollouts korrekt zu diagnostizieren.

## Zweck, Mental Model und Dependencies

Ein Deployment erzeugt für jede deklarierte Pod-Spezifikation ein ReplicaSet, das die tatsächliche Anzahl laufender Pod-Instanzen mit der deklarierten Anzahl abgleicht (analog zur allgemeinen Kontrollschleifen-Logik der Control Plane). Bei einer Änderung der Pod-Spezifikation (z. B. ein neues Container-Image) erzeugt das Deployment ein neues ReplicaSet für die neue Version und führt ein Rolling Update durch: schrittweise werden alte Replicas durch neue ersetzt, statt alle gleichzeitig auszutauschen. Zwei Parameter steuern dieses Verhalten: maxSurge (wie viele zusätzliche, über die deklarierte Anzahl hinausgehende Replicas während des Updates vorübergehend erstellt werden dürfen) und maxUnavailable (wie viele Replicas während des Updates vorübergehend nicht verfügbar sein dürfen). Der entscheidende Kopplungsmechanismus ist: ein neu erstellter Pod der neuen Version wird erst dann als "erfolgreich ausgerollt" gezählt und ein entsprechender alter Pod entfernt, wenn die Readiness-Probe des neuen Pods tatsächlich erfolgreich ist (siehe [KB-0384](06-pods-und-lebenszyklen.md)) — besteht die neue Version ihre Readiness-Probe nie, bleibt das Rolling Update bei einem Teil der neuen Replicas hängen, ohne die verbleibenden, funktionsfähigen alten Replicas zu entfernen. Dieses Verhalten ist ein eingebauter Sicherheitsmechanismus: ein fehlerhaftes Rolling Update führt zu einem hängenden, aber nicht zu einem vollständig ausgefallenen Deployment, solange die Readiness-Kopplung korrekt konfiguriert ist.

~~~text
Deployment -> creates a ReplicaSet per pod spec version -> ReplicaSet reconciles actual vs. desired replica COUNT
Spec change (new image) -> Deployment creates a NEW ReplicaSet -> ROLLING UPDATE begins
  maxSurge: extra replicas allowed temporarily ABOVE desired count during update
  maxUnavailable: replicas allowed temporarily UNAVAILABLE during update
CRITICAL COUPLING MECHANISM: a new-version pod counts as "successfully rolled out" -> old pod removed
  ONLY when the new pod's READINESS PROBE actually succeeds (cf. KB-0384)
  -> new version NEVER passing readiness -> rollout STALLS at partial new replicas,
     WITHOUT removing remaining functional old replicas
  -> BUILT-IN SAFETY: a broken rollout gets STUCK, not a FULL OUTAGE, as long as readiness coupling is configured correctly
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Rolle | Konsequenz bei Fehlkonfiguration |
|---|---|---|
| Desired State (ReplicaSet) | erzwingt die deklarierte Anzahl Replicas | keine — dies ist der grundlegende Kontrollschleifenmechanismus |
| maxSurge | steuert vorübergehende Überprovisionierung während des Updates | zu niedrig: langsamerer Rollout; zu hoch: temporär hoher Ressourcenverbrauch |
| maxUnavailable | steuert vorübergehende Unterverfügbarkeit während des Updates | zu hoch: Verfügbarkeitseinbußen während des Rollouts |
| Readiness-Kopplung | bindet Fortschritt des Rollouts an tatsächliche Bereitschaft der neuen Version | ohne korrekte Readiness-Probe: fehlerhafte Version könnte fälschlich als "bereit" durchgereicht werden |

Implementierung: Ein Deployment wird mit expliziten maxSurge-/maxUnavailable-Werten konfiguriert, die auf den tatsächlichen Verfügbarkeitsanforderungen der Anwendung basieren (z. B. maxUnavailable=0 für Anwendungen, bei denen keine Kapazitätsreduktion während des Updates toleriert werden kann). Die Readiness-Probe der Anwendung wird so konfiguriert, dass sie tatsächliche Betriebsbereitschaft (nicht nur Prozessexistenz) prüft, da die Korrektheit des gesamten Rolling-Update-Sicherheitsmechanismus von einer aussagekräftigen Readiness-Probe abhängt. Bei einem hängenden Rollout wird zunächst der Rolloutstatus (welcher Anteil neuer Replicas ist bereit) und die Readiness-Probe-Historie der neuen Version geprüft, bevor ein manueller Rollback erwogen wird.

## Scalability, Reliability, Security und Observability

Rolling Updates skalieren Verfügbarkeit während Versionswechseln proportional zur Sorgfalt der maxSurge-/maxUnavailable-Konfiguration; die Reliability-Grenze liegt darin, dass eine unzureichende oder immer erfolgreiche (nicht aussagekräftige) Readiness-Probe den eingebauten Sicherheitsmechanismus des Rolling Updates wirkungslos macht, da eine fehlerhafte neue Version dann fälschlich als "bereit" durchgereicht wird.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Rolling Update bleibt dauerhaft bei einem Teil der neuen Replicas hängen | die neue Version besteht ihre Readiness-Probe nicht, was den Rollout korrekt anhält | die Readiness-Probe-Logs der neuen Pod-Version prüfen, um die zugrunde liegende Anwendungsursache zu identifizieren |
| ein Rolling Update mit fehlerhafter neuer Version führt trotzdem zu einem vollständigen Ausfall | die Readiness-Probe der neuen Version ist nicht aussagekräftig (z. B. immer erfolgreich) und lässt die fehlerhafte Version fälschlich durch | die Readiness-Probe-Konfiguration prüfen und um eine tatsächliche Funktionsprüfung ergänzen |
| ein Rolling Update verursacht spürbare Kapazitätseinbußen während des Übergangs | maxUnavailable ist zu hoch für die tatsächlichen Verfügbarkeitsanforderungen konfiguriert | maxUnavailable reduzieren, gegebenenfalls auf 0, bei entsprechend höherem maxSurge |

Security: Ein Rolling Update mit unzureichender Readiness-Kopplung kann eine fehlerhafte oder unsichere neue Version unbemerkt vollständig ausrollen, da der eingebaute Sicherheitsmechanismus (Anhalten bei fehlgeschlagener Readiness) nur bei einer aussagekräftigen Probe tatsächlich greift. Observability: Der Rolloutstatus (Anteil bereiter neuer Replicas gegenüber Gesamtanzahl), die Readiness-Probe-Erfolgsrate neuer Versionen, und die Dauer eines abgeschlossenen versus hängenden Rollouts sind zentrale Deployment-Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert aussagekräftige Readiness-Probes und explizit begründete maxSurge-/maxUnavailable-Werte für jedes Deployment. **Principal** macht den Rolloutstatus und identifizierte Ursachen hängender Rollouts für das Team nachvollziehbar. **Chief** etabliert korrekt konfigurierte Rolling Updates mit Readiness-Kopplung als Standard für Produktions-Deployments im Unternehmen.

Anti-Patterns: eine Readiness-Probe verwenden, die immer erfolgreich ist, wodurch der Rolling-Update-Sicherheitsmechanismus wirkungslos wird; maxUnavailable ohne Bezug zu tatsächlichen Verfügbarkeitsanforderungen setzen; bei einem hängenden Rollout ohne Prüfung der Readiness-Probe-Ursache vorschnell einen Rollback durchführen.

## Production Checklist

- [ ] Readiness-Probes prüfen tatsächliche Betriebsbereitschaft, nicht nur Prozessexistenz.
- [ ] maxSurge und maxUnavailable sind explizit an tatsächliche Verfügbarkeitsanforderungen angepasst.
- [ ] Bei einem hängenden Rollout wird zunächst die Readiness-Probe-Historie der neuen Version geprüft.
- [ ] Der Rolloutstatus wird während jedes Deployments aktiv überwacht.

## Interviewfragen

### 1. Wie ist ein Rolling Update mit der Readiness-Probe gekoppelt?

**Antwort:** Ein neuer Pod gilt erst dann als erfolgreich ausgerollt (mit entsprechender Entfernung eines alten Pods), wenn seine Readiness-Probe tatsächlich erfolgreich ist.

### 2. Was passiert, wenn eine neue Version während eines Rolling Updates ihre Readiness-Probe nie besteht?

**Antwort:** Das Rolling Update bleibt bei einem Teil der neuen Replicas hängen, ohne die verbleibenden, funktionsfähigen alten Replicas zu entfernen — dies verhindert einen vollständigen Ausfall.

### 3. Was steuern die Parameter maxSurge und maxUnavailable?

**Antwort:** maxSurge steuert, wie viele zusätzliche Replicas vorübergehend über die deklarierte Anzahl hinaus erstellt werden dürfen; maxUnavailable steuert, wie viele Replicas während des Updates vorübergehend nicht verfügbar sein dürfen.

### 4. Warum macht eine immer erfolgreiche Readiness-Probe den Rolling-Update-Sicherheitsmechanismus wirkungslos?

**Antwort:** Da der Rollout-Fortschritt an den Erfolg der Readiness-Probe gekoppelt ist, würde eine fehlerhafte neue Version fälschlich als "bereit" durchgereicht, wenn die Probe keine echte Funktionsprüfung durchführt.

### 5. Wie gehst du vor, wenn ein Rolling Update dauerhaft bei einem Teil der neuen Replicas hängen bleibt?

**Antwort:** Ich prüfe zuerst die Readiness-Probe-Logs der neuen Pod-Version, um die zugrunde liegende Anwendungsursache zu identifizieren, bevor ich einen manuellen Rollback in Betracht ziehe.

### 6. Widersprüchliche Anforderung: Team will schnelle Rollouts UND garantiert keine Kapazitätseinbußen während des Versionswechsels — wie gehst du vor?

**Antwort:** Ich würde maxUnavailable auf 0 setzen (keine Kapazitätsreduktion) und maxSurge entsprechend höher konfigurieren, sodass neue Replicas zusätzlich zu den bestehenden erstellt werden, bevor alte entfernt werden — dies ermöglicht einen zügigen Rollout ohne Verfügbarkeitseinbußen, erfordert jedoch temporär mehr Rechenressourcen.

## Praktische Labs

~~~python
class SimulatedDeployment:
    def __init__(self, desired_replicas, max_surge, max_unavailable):
        self.desired_replicas = desired_replicas
        self.max_surge = max_surge
        self.max_unavailable = max_unavailable
        self.old_replicas = desired_replicas
        self.new_replicas_ready = 0
        self.new_replicas_created = 0

    def rolling_update_step(self, new_version_readiness_check):
        capacity_limit = self.desired_replicas + self.max_surge
        while (self.old_replicas + self.new_replicas_created) < capacity_limit and self.new_replicas_created < self.desired_replicas:
            self.new_replicas_created += 1
            if new_version_readiness_check():
                self.new_replicas_ready += 1
                if self.old_replicas > 0:
                    self.old_replicas -= 1  # only remove an old replica once new one is READY
            else:
                print(f"New replica {self.new_replicas_created} failed readiness -- rollout STALLS here, old replicas preserved.")
                break

deploy_success = SimulatedDeployment(desired_replicas=3, max_surge=1, max_unavailable=0)
deploy_success.rolling_update_step(new_version_readiness_check=lambda: True)
print(f"Successful rollout: old={deploy_success.old_replicas}, new_ready={deploy_success.new_replicas_ready}\n")

deploy_stuck = SimulatedDeployment(desired_replicas=3, max_surge=1, max_unavailable=0)
deploy_stuck.rolling_update_step(new_version_readiness_check=lambda: False)
print(f"Stalled rollout (safety mechanism working): old={deploy_stuck.old_replicas}, new_ready={deploy_stuck.new_replicas_ready}")
~~~

## Dependencies, Cross-References und Quellen

1. Kubernetes-Dokumentation: [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/), abgerufen 2026-09-17.
2. Kubernetes-Dokumentation: [ReplicaSet](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/), abgerufen 2026-09-17.

Pods und Lebenszyklen sind kanonisch in [KB-0384](06-pods-und-lebenszyklen.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Rollout-Analyse-Werkzeuge, die Readiness-Probe-Muster während Deployments in Echtzeit auswerten | Adopting | Gegenüber manueller Log-Sichtung für schnellere Erkennung hängender Rollouts bevorzugen. |
| Progressive Delivery-Controller (z. B. Argo Rollouts), die Rolling Updates um automatisierte Canary-/Analysephasen erweitern | Evaluating | Gegenüber Standard-Deployment-Rolling-Updates abwägen, sobald automatisierte Qualitätsanalyse während des Rollouts benötigt wird. |

Ein Team akzeptiert eine Deployment-Konfiguration erst, wenn die Readiness-Probe nachweislich eine echte Funktionsprüfung statt einer trivial erfolgreichen Prüfung durchführt.
