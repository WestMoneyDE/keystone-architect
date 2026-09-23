---
{"id": "KB-0524", "title": "GitOps und deklarative Delivery", "domain": "22", "sequence": 12, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "MLOPS", "CLOUD"], "requires": [{"id": "KB-0518", "concepts": ["Pipeline-Architektur"], "needed_for": "understanding"}, {"id": "KB-0523", "concepts": ["Ansible und Konfigurationsmanagement"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "GitOps-Prinzipien (Git als Zustandsquelle, Pull-basierte Reconciliation) anhand offizieller Dokumentation korrekt für deklarative Delivery einsetzen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Delivery-Architektur explizit gestalten, wie Notfalländerungen, Secrets-Handhabung und Promotion zwischen Umgebungen als überprüfbare Prozessgrenzen in ein GitOps-Modell integriert werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine wiederholt rückgängig gemachte manuelle Änderung an einem GitOps-verwalteten Cluster auf den Reconciliation-Mechanismus zurückführen können, der jede Abweichung vom Git-Zustand automatisch korrigiert.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Delivery-Standards anhand von Git als überprüfbarer, auditierbarer Zustandsquelle statt undokumentierter Push-basierter Ad-hoc-Änderungen festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung spezifischer GitOps-Operatoren/Controller im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Pull-Reconciliation, Drift-Behandlung und Prozessgrenzen (Notfall, Secrets, Promotion), nicht die Operator-Interna."}}, "lab_validation": [{"lab_id": "KB-0524-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation von Pull-basierter Reconciliation gegenüber manueller Drift, kein produktives GitOps-System verwendet", "evidence": "Ein lokales Skript simuliert, wie ein GitOps-Controller in regelmäßigen Abständen den tatsächlichen Cluster-Zustand mit dem in Git deklarierten Zustand vergleicht und jede Abweichung (etwa eine manuelle kubectl-Änderung) automatisch auf den Git-Zustand zurücksetzt, was erklärt, warum manuelle Änderungen an GitOps-verwalteten Ressourcen wiederholt rückgängig gemacht werden, wenn sie nicht zuerst in Git eingecheckt werden.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales GitOps-System mit tatsächlicher Controller-Dynamik."}]}
---
# GitOps und deklarative Delivery

> **Ziel:** GitOps macht **Git zur alleinigen, überprüfbaren Zustandsquelle** für eine Infrastruktur oder Anwendungsbereitstellung — der gewünschte Zustand wird deklarativ in Git-versionierten Manifesten beschrieben, und ein im Zielsystem laufender Controller (Operator) führt **Pull-basierte Reconciliation** durch: Er vergleicht in regelmäßigen Abständen selbstständig den tatsächlichen Zustand mit dem in Git deklarierten Zustand und korrigiert jede Abweichung automatisch, statt auf einen externen Push-Vorgang zu warten. Der zentrale Punkt dieses Kapitels ist, dass eine wiederholt rückgängig gemachte manuelle Änderung an einer GitOps-verwalteten Ressource kein Fehlverhalten des Systems ist, sondern der beabsichtigte Reconciliation-Mechanismus: Jede Abweichung vom Git-Zustand, die nicht selbst in Git eingecheckt wurde, wird beim nächsten Reconciliation-Zyklus automatisch auf den deklarierten Zustand zurückgesetzt — eine dringende Notfalländerung, ein Secrets-Zugriff, oder eine Promotion zwischen Umgebungen müssen daher als explizite, überprüfbare Prozessgrenzen in das GitOps-Modell integriert werden, statt als Ausnahmen außerhalb von Git behandelt zu werden.

## Zweck, Mental Model und Dependencies

GitOps unterscheidet sich fundamental von klassischer, Push-basierter Pipeline-Delivery (siehe [KB-0518](06-pipeline-architektur.md)): Bei einer klassischen Pipeline initiiert ein externes System (die CI/CD-Pipeline) aktiv eine Änderung am Zielsystem, sobald ein Trigger-Ereignis eintritt. Bei GitOps ist es umgekehrt — ein im Zielsystem laufender Controller zieht (pull) kontinuierlich den aktuellen deklarierten Zustand aus Git und gleicht ihn selbstständig mit dem tatsächlichen Zustand ab, ohne dass ein externes System aktiv einen Push-Vorgang initiieren muss. Dieser Pull-basierte Ansatz hat einen entscheidenden Sicherheitsvorteil: Das Zielsystem muss keinen externen Systemen (der CI/CD-Pipeline) Schreibzugriff gewähren, sondern zieht selbst aus einer Quelle, auf die es lesenden Zugriff hat, was die Angriffsfläche für kompromittierte externe Systeme reduziert. Die kontinuierliche Reconciliation bedeutet gleichzeitig, dass jede Abweichung vom Git-Zustand — ob durch eine legitime Notfalländerung, einen Fehler, oder eine böswillige Manipulation — beim nächsten Reconciliation-Zyklus automatisch erkannt und auf den Git-Zustand zurückgesetzt wird, was Drift strukturell unmöglich macht, solange Git als alleinige Quelle respektiert wird. Diese Eigenschaft erfordert jedoch explizite Prozessgestaltung für drei häufige Herausforderungen: Notfalländerungen (eine dringende, sofortige Produktionsänderung muss entweder als beschleunigter, aber weiterhin durch Git laufender Prozess erfolgen, oder eine bewusste, zeitlich begrenzte Reconciliation-Pause wird eingerichtet, statt eine manuelle Änderung zu erzwingen, die sofort wieder rückgängig gemacht wird), Secrets (sensible Werte dürfen nicht im Klartext in Git gespeichert werden, weshalb GitOps-Modelle typischerweise verschlüsselte Secrets-Referenzen in Git ablegen, während die tatsächliche Entschlüsselung erst im Zielsystem oder über einen separaten, sicheren Mechanismus erfolgt), und Promotion (der kontrollierte Übergang einer Änderung von einer Umgebung zur nächsten, etwa von Staging zu Produktion, wird als expliziter, überprüfbarer Git-Vorgang — etwa ein Merge oder Pull Request zwischen umgebungsspezifischen Git-Zweigen oder Verzeichnissen — modelliert, statt als informeller, außerhalb von Git nachvollziehbarer Schritt).

~~~text
GitOps: Git = SOLE, auditable state source
  desired state: declarative, Git-versioned manifests
  Controller/Operator in target system: PULL-based reconciliation
    -> periodically compares actual state vs Git-declared state
    -> AUTO-CORRECTS any deviation, no external push needed
KEY DIFFERENCE from classic push-based pipeline (KB-0518):
  push: external system (CI/CD) actively initiates change on trigger
  pull: target system itself pulls from Git it has READ access to
    -> SECURITY benefit: target system needs NO write access grant to external systems
    -> reduces attack surface from compromised external systems
CONTINUOUS reconciliation -> ANY deviation from Git (legit emergency change, bug, malicious manipulation)
  -> AUTOMATICALLY detected + reset to Git state next cycle -> drift structurally impossible IF Git is respected
3 CHALLENGES requiring explicit process design:
  Emergency changes: accelerated-but-STILL-through-Git process, OR deliberate time-limited reconciliation pause
    (NOT forcing a manual change that gets immediately reverted)
  Secrets: NEVER plaintext in Git -> encrypted references in Git, actual decryption in target system/separate secure mechanism
  Promotion: env-to-env change = EXPLICIT, auditable Git operation (merge/PR between env branches/dirs)
    (NOT an informal, outside-Git step)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Git als Zustandsquelle | einzige, überprüfbare Quelle des gewünschten Zustands | jede Abweichung wird als Drift erkannt |
| Pull-basierte Reconciliation | Controller zieht Zustand selbst, kein externer Push nötig | reduzierte Angriffsfläche gegenüber Push-Modellen |
| Notfalländerungsprozess | beschleunigter, aber weiterhin Git-basierter Ablauf | verhindert Konflikt zwischen dringender Änderung und Reconciliation |
| Secrets-Handhabung | verschlüsselte Referenzen in Git, Entschlüsselung im Zielsystem | verhindert Klartext-Secrets im Versionskontrollsystem |
| Promotion als Git-Vorgang | expliziter, überprüfbarer Übergang zwischen Umgebungen | macht Umgebungsübergänge auditierbar |

Implementierung: Jede beabsichtigte Änderung wird explizit über Git eingecheckt, statt direkt und manuell am Zielsystem vorgenommen zu werden, da Letzteres beim nächsten Reconciliation-Zyklus automatisch rückgängig gemacht wird. Für Notfälle wird ein expliziter, dokumentierter Prozess etabliert, der entweder eine beschleunigte Git-Änderung oder eine bewusste, zeitlich begrenzte Reconciliation-Pause vorsieht. Secrets werden ausschließlich verschlüsselt in Git abgelegt, nie im Klartext. Promotion zwischen Umgebungen erfolgt als expliziter, nachvollziehbarer Git-Vorgang (Merge, Pull Request) statt als informeller Schritt außerhalb von Git.

## Scalability, Reliability, Security und Observability

GitOps skaliert die Zustandskonsistenz proportional zur konsequenten Respektierung von Git als alleiniger Zustandsquelle; die Reliability-Grenze liegt darin, dass jede Umgehung dieses Prinzips (manuelle Änderungen außerhalb von Git) proportional zur Reconciliation-Frequenz zu wiederholt rückgängig gemachten Änderungen und Verwirrung führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine manuelle Änderung an einer GitOps-verwalteten Ressource wird wiederholt rückgängig gemacht | die Änderung wurde nicht in Git eingecheckt, der Reconciliation-Mechanismus setzt sie beim nächsten Zyklus zurück | die Änderung explizit über Git einchecken, statt sie manuell am Zielsystem vorzunehmen |
| eine dringende Notfalländerung ist schwer mit dem GitOps-Modell vereinbar | kein expliziter, dokumentierter Notfallprozess existiert | einen beschleunigten, aber weiterhin Git-basierten Notfallprozess oder eine bewusste Reconciliation-Pause etablieren |
| Secrets sind unbeabsichtigt im Klartext in Git sichtbar | Secrets wurden direkt statt als verschlüsselte Referenz in Git abgelegt | die Secrets-Handhabung auf verschlüsselte Referenzen mit Entschlüsselung im Zielsystem umstellen |

Security: Secrets dürfen niemals im Klartext in Git gespeichert werden; verschlüsselte Referenzen mit sicherer Entschlüsselung im Zielsystem sind der Standardansatz. Observability: Die Häufigkeit erkannter und korrigierter Drift-Vorfälle, die Nutzung des Notfalländerungsprozesses, und die Nachvollziehbarkeit von Promotion-Vorgängen über Git-Historie sind zentrale Betriebssignale.

## Trade-offs und Entscheidungen

**Staff** checkt beabsichtigte Änderungen korrekt über Git ein, statt direkte manuelle Änderungen vorzunehmen. **Principal** entwirft Notfalländerungs-, Secrets- und Promotion-Prozesse als explizite, überprüfbare Prozessgrenzen innerhalb des GitOps-Modells. **Chief** legt unternehmensweite Delivery-Standards fest, die Git als überprüfbare, auditierbare Zustandsquelle statt undokumentierter Ad-hoc-Änderungen vorschreiben.

Anti-Patterns: manuelle Änderungen direkt am GitOps-verwalteten Zielsystem vornehmen, ohne sie in Git einzuchecken; Secrets im Klartext in Git speichern; Promotion zwischen Umgebungen als informellen, außerhalb von Git nachvollziehbaren Schritt behandeln.

## Production Checklist

- [ ] Jede beabsichtigte Änderung erfolgt über Git, nicht direkt am Zielsystem.
- [ ] Ein expliziter, dokumentierter Notfalländerungsprozess existiert.
- [ ] Secrets sind ausschließlich verschlüsselt, nie im Klartext, in Git abgelegt.
- [ ] Promotion zwischen Umgebungen ist ein expliziter, nachvollziehbarer Git-Vorgang.

## Interviewfragen

### 1. Was ist der zentrale Unterschied zwischen GitOps und einer klassischen Push-basierten Pipeline?

**Antwort:** Bei GitOps zieht ein Controller im Zielsystem selbst kontinuierlich den Zustand aus Git (Pull), statt dass ein externes System aktiv eine Änderung am Zielsystem initiiert (Push).

### 2. Warum bietet Pull-basierte Reconciliation einen Sicherheitsvorteil gegenüber Push-basierten Pipelines?

**Antwort:** Das Zielsystem muss keinen externen Systemen Schreibzugriff gewähren, sondern zieht selbst aus einer Quelle mit nur lesendem Zugriff, was die Angriffsfläche für kompromittierte externe Systeme reduziert.

### 3. Warum wird eine manuelle Änderung an einer GitOps-verwalteten Ressource wiederholt rückgängig gemacht?

**Antwort:** Weil der Reconciliation-Controller jede Abweichung vom in Git deklarierten Zustand beim nächsten Zyklus automatisch erkennt und auf den Git-Zustand zurücksetzt.

### 4. Wie sollten Secrets in einem GitOps-Modell gehandhabt werden?

**Antwort:** Sie sollten niemals im Klartext in Git gespeichert werden, sondern als verschlüsselte Referenz, wobei die tatsächliche Entschlüsselung im Zielsystem oder über einen separaten, sicheren Mechanismus erfolgt.

### 5. Wie gehst du vor, wenn eine manuelle Änderung an einer GitOps-verwalteten Ressource wiederholt rückgängig gemacht wird?

**Antwort:** Ich checke die beabsichtigte Änderung explizit über Git ein, statt sie weiterhin manuell am Zielsystem vorzunehmen, da nur eingecheckte Änderungen im GitOps-Modell dauerhaft bestehen bleiben.

### 6. Widersprüchliche Anforderung: Team will garantiert konsistenten, driftfreien Zustand durch strikte GitOps-Reconciliation UND die Möglichkeit für sofortige, ungeprüfte manuelle Notfalländerungen bei kritischen Vorfällen — wie gehst du vor?

**Antwort:** Ich würde einen expliziten, dokumentierten Notfallprozess etablieren, der entweder eine stark beschleunigte, aber weiterhin über Git laufende Änderung ermöglicht, oder eine bewusste, zeitlich begrenzte Reconciliation-Pause vorsieht, die nach der Notfallbehebung sofort beendet und die Änderung nachträglich in Git nachgezogen wird — unkontrollierte, dauerhaft von Git abweichende manuelle Änderungen untergraben das gesamte GitOps-Modell und sollten vermieden werden.

## Praktische Labs

~~~python
# Local, deterministic simulation of pull-based reconciliation resetting manual drift (executed locally, no real cluster):

def reconcile(git_declared_state, actual_state):
    if actual_state != git_declared_state:
        return git_declared_state, "drift detected, reset to Git state"
    return actual_state, "no drift, state matches Git"

git_declared_state = {"replicas": 3}
actual_state_after_manual_change = {"replicas": 5}

new_state, message = reconcile(git_declared_state, actual_state_after_manual_change)
print(f"{message}: {new_state}")
~~~

## Dependencies, Cross-References und Quellen

1. CNCF-Dokumentation: [OpenGitOps Principles](https://opengitops.dev/), abgerufen 2026-09-18.
2. CNCF-Dokumentation: [GitOps Working Group — Reconciliation](https://github.com/gitops-working-group/gitops-working-group), abgerufen 2026-09-18.

Pipeline-Architektur ist kanonisch in [KB-0518](06-pipeline-architektur.md) behandelt; Ansible und Konfigurationsmanagement in [KB-0523](11-ansible-und-konfigurationsmanagement.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, progressive Delivery-Integration (automatisiertes Canary-Rollback basierend auf Metriken direkt im Reconciliation-Zyklus) | Evaluating | Gegenüber manuell gesteuertem Rollout erst nach Prüfung der tatsächlichen Zuverlässigkeit automatisierter Metrik-basierter Rollback-Entscheidungen bevorzugen. |

Ein Team akzeptiert eine GitOps-Delivery erst, wenn Notfalländerungs-, Secrets- und Promotion-Prozesse nachweislich als explizite, überprüfbare Git-Vorgänge statt informeller Ausnahmen gestaltet sind.
