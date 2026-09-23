---
{"id": "KB-0376", "title": "Approval Workflows für AI-Releases", "domain": "15", "sequence": 26, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0373", "concepts": ["Model Governance im Delivery-Prozess"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Approval-Workflow implementieren, der eine Freigabe an ein konkretes, unveränderliches Release-Artefakt bindet und bei nachträglicher Artefaktänderung die Freigabe ungültig macht.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Einen Approval-Workflow gestalten, der Prüfer, Nachweise und Freigabeobjekte strukturell verknüpft und Funktionstrennung (Ersteller und Prüfer sind unterschiedliche Personen) technisch durchsetzt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine erteilte Freigabe nach nachträglicher Änderung des freigegebenen Artefakts fälschlich weiterhin als gültig behandelt wird.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Automatisierte Durchsetzung von Funktionstrennung und erneuter Prüfung bei Artefaktänderung als Governance-Standard für AI-Release-Approval-Workflows im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Integration von Approval-Workflows in unternehmensweite Identity- und Access-Management-Systeme ist Vertiefung.", "rationale": "Kern ist die Bindung von Freigabe an Nachweis und Artefakt sowie die Funktionstrennung, nicht die IAM-Integration."}}, "lab_validation": [{"lab_id": "KB-0376-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell eines Approval-Workflows mit Artefakt-Hash-Bindung und Funktionstrennungsprüfung", "evidence": "Eine Freigabe, die an einen Hash des konkreten Release-Artefakts gebunden ist, wird bei nachträglicher Änderung des Artefakts automatisch ungültig; ein Versuch, dieselbe Person als Ersteller und Prüfer einzutragen, wird durch eine Funktionstrennungsprüfung technisch abgelehnt.", "limitations": "Kein produktives Approval-System, kein realer Geschäftsdatensatz, keine reale Enterprise-Release-Pipeline getestet."}]}
---
# Approval Workflows für AI-Releases

> **Ziel:** Ein Approval Workflow verknüpft Prüfer (wer genehmigt), Nachweise (welche Evidenz liegt der Genehmigung zugrunde, siehe [KB-0373](23-model-governance-im-delivery-prozess.md)) und Freigabeobjekte (welches konkrete Artefakt wird genehmigt) strukturell miteinander, aufbauend auf dem etablierten Human-Gate-Prinzip für agentische und automatisierte Workflows. Der zentrale Punkt dieses Kapitels ist die automatisierte Durchsetzung zweier Kontrollen: Funktionstrennung (die Person, die ein Release erstellt oder anfordert, darf nicht dieselbe Person sein, die es genehmigt) und erneute Prüfung bei geänderten Artefakten (eine Freigabe verliert automatisch ihre Gültigkeit, wenn sich das freigegebene Artefakt nachträglich ändert).

## Zweck, Mental Model und Dependencies

Ein Approval Workflow bindet eine Freigabeentscheidung strukturell an drei Elemente: den Prüfer (die konkrete, verantwortliche Person), die Nachweise (die Evidenz, auf deren Grundlage die Entscheidung getroffen wurde) und das Freigabeobjekt (das konkrete, eindeutig identifizierbare Artefakt, z. B. über einen Inhalts-Hash, das genehmigt wird). Funktionstrennung stellt sicher, dass die Person, die ein Release erstellt oder dessen Freigabe anfordert, technisch nicht in der Lage ist, dieselbe Freigabe selbst zu erteilen — dies ist ein grundlegendes Kontrollprinzip, das verhindert, dass eine einzelne Person ohne unabhängige Prüfung eine Änderung sowohl vornehmen als auch genehmigen kann. Die erneute Prüfung bei geänderten Artefakten ist ebenso kritisch: wird ein Freigabeobjekt nach erteilter Genehmigung nachträglich verändert (z. B. eine zusätzliche Codeänderung nach der Freigabe, aber vor dem tatsächlichen Deployment), muss die ursprüngliche Freigabe automatisch ungültig werden, da sie sich auf ein anderes, nicht mehr identisches Artefakt bezog — dies ist analog zum Prinzip der Approval-Bindung bei Human Gates für Agentenaktionen, bei dem eine Freigabe an einen Hash der konkreten Aktion gebunden wird und bei nachträglicher Änderung ungültig wird. Ohne diese beiden automatisierten Kontrollen bleibt ein Approval Workflow lediglich eine formale Dokumentation ohne tatsächliche Durchsetzungskraft.

~~~text
Approval workflow binds THREE elements structurally: reviewer, evidence, release artifact (identified e.g. by content hash)
Segregation of duties: the person who CREATES/requests a release must NOT be able to APPROVE it themselves
  -> technically enforced, not just a policy statement
Re-review on artifact change: an approval is bound to a SPECIFIC artifact (hash)
  -> artifact changes AFTER approval -> approval automatically becomes INVALID (analogous to Human Gate action-binding)
WITHOUT both automated controls: an approval workflow is just formal documentation with no real enforcement power
~~~

## Core Concepts, Architektur und Implementierung

| Kontrolle | Was sie verhindert | Durchsetzungsmechanismus |
|---|---|---|
| Prüfer-Nachweis-Bindung | eine Freigabe ohne nachvollziehbare Grundlage | die Freigabe erfasst explizit Prüfer und zugrunde liegende Evidenz |
| Funktionstrennung | Selbstgenehmigung durch die erstellende/anfordernde Person | technische Prüfung: Ersteller-ID darf nicht mit Prüfer-ID übereinstimmen |
| Artefakt-Hash-Bindung | Gültigkeit einer Freigabe für ein nachträglich geändertes Artefakt | die Freigabe wird an einen Hash des konkreten Artefakts gebunden, Änderung invalidiert automatisch |

Implementierung: Jeder Approval-Antrag erfasst das konkrete Freigabeobjekt über einen eindeutigen Inhalts-Hash, die zugrunde liegenden Nachweise (z. B. Testergebnisse, Robustheitsprüfungen), und die Identität der antragstellenden Person. Das System prüft technisch, dass die genehmigende Person nicht mit der antragstellenden Person identisch ist, bevor eine Genehmigung erteilt wird. Nach erteilter Genehmigung wird der Hash des Freigabeobjekts weiterhin überwacht; ändert sich das Artefakt (ein neuer Hash entsteht), wird die bestehende Genehmigung automatisch als ungültig markiert und ein erneuter Approval-Prozess ist erforderlich, bevor das geänderte Artefakt deployt werden kann.

## Scalability, Reliability, Security und Observability

Automatisierte Approval Workflows skalieren Governance-Durchsetzung proportional zur Anzahl der Releases ohne proportional wachsenden manuellen Prüfaufwand pro Release; die Reliability-Grenze liegt darin, dass eine nicht durchgesetzte Funktionstrennung oder eine fehlende Hash-Bindung proportional zur Häufigkeit von Selbstgenehmigungen oder unbemerkten Nachträgsänderungen das Governance-Ziel untergräbt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Release wird deployt, das nach der ursprünglichen Genehmigung nachträglich verändert wurde | die Freigabe war nicht an einen Hash des konkreten Artefakts gebunden, sondern an eine allgemeine Referenz | die Approval-Bindung um eine Hash-basierte Artefaktidentifikation ergänzen, die bei Änderung automatisch invalidiert |
| eine Person genehmigt ihre eigene Release-Anfrage | keine technische Funktionstrennungsprüfung wurde implementiert | eine technische Prüfung einführen, die Ersteller- und Prüfer-Identität vergleicht und bei Übereinstimmung die Genehmigung ablehnt |
| eine Genehmigung existiert, aber es ist unklar, auf welcher Evidenz sie beruhte | die Nachweise wurden nicht strukturell mit der Genehmigung verknüpft | einen verpflichtenden Nachweis-Anhang als Teil jedes Approval-Antrags einführen |

Security: Funktionstrennung und Hash-basierte Artefaktbindung sind zentrale Kontrollen gegen sowohl unautorisierte Selbstgenehmigung als auch nachträgliche, ungeprüfte Manipulation eines bereits genehmigten Release-Artefakts. Observability: Der Anteil der Approvals mit vollständiger Prüfer-Nachweis-Artefakt-Bindung, die Anzahl technisch verhinderter Selbstgenehmigungsversuche, und die Häufigkeit automatisch invalidierter Genehmigungen durch Artefaktänderung sind zentrale Governance-Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert technische Funktionstrennung und Hash-basierte Artefaktbindung für jeden Approval-Workflow. **Principal** macht Prüfer, Nachweise und Freigabeobjekte für das Team nachvollziehbar dokumentiert. **Chief** etabliert automatisierte Durchsetzung von Funktionstrennung und erneuter Prüfung bei Artefaktänderung als Governance-Standard für AI-Release-Approval-Workflows im Unternehmen.

Anti-Patterns: eine Freigabe ohne Bindung an ein spezifisches, hash-identifiziertes Artefakt erteilen; Funktionstrennung nur als organisatorische Regel statt als technisch erzwungene Kontrolle behandeln; eine bestehende Genehmigung nach nachträglicher Artefaktänderung weiterhin als gültig betrachten.

## Production Checklist

- [ ] Jede Freigabe ist an einen Hash des konkreten Freigabeobjekts gebunden.
- [ ] Funktionstrennung zwischen Ersteller/Antragsteller und Prüfer ist technisch, nicht nur organisatorisch, durchgesetzt.
- [ ] Eine Genehmigung wird bei nachträglicher Artefaktänderung automatisch ungültig.
- [ ] Nachweise sind strukturell mit jeder Genehmigung verknüpft dokumentiert.

## Interviewfragen

### 1. Welche drei Elemente verknüpft ein Approval Workflow strukturell?

**Antwort:** Den Prüfer (verantwortliche Person), die Nachweise (zugrunde liegende Evidenz) und das Freigabeobjekt (das konkrete, eindeutig identifizierbare Artefakt).

### 2. Warum muss Funktionstrennung technisch statt nur organisatorisch durchgesetzt werden?

**Antwort:** Eine rein organisatorische Regel kann umgangen werden; eine technische Prüfung, die Ersteller- und Prüfer-Identität vergleicht, verhindert Selbstgenehmigung zuverlässig.

### 3. Warum muss eine Genehmigung bei nachträglicher Artefaktänderung automatisch ungültig werden?

**Antwort:** Die ursprüngliche Genehmigung bezog sich auf ein spezifisches Artefakt; nach einer Änderung ist das aktuelle Artefakt nicht mehr identisch mit dem geprüften und genehmigten, sodass die ursprüngliche Genehmigung nicht mehr gültig sein kann.

### 4. Wie stellst du die Bindung einer Genehmigung an ein konkretes Artefakt technisch sicher?

**Antwort:** Durch einen Inhalts-Hash des Artefakts, der Teil der Genehmigung wird; ändert sich der Hash durch eine nachträgliche Änderung, wird die Genehmigung automatisch als ungültig erkannt.

### 5. Wie gehst du vor, wenn ein Release deployt wird, das nach der ursprünglichen Genehmigung verändert wurde?

**Antwort:** Ich prüfe, ob die Freigabe an einen Hash des konkreten Artefakts gebunden war, und ergänze diese Bindung, falls sie fehlte, um zukünftige unbemerkte Nachträgsänderungen zu verhindern.

### 6. Widersprüchliche Anforderung: Team will schnelle, unkomplizierte Release-Freigaben UND garantiert lückenlose Funktionstrennung und Artefaktintegrität — wie gehst du vor?

**Antwort:** Ich würde die Funktionstrennungs- und Hash-Bindungsprüfung vollständig automatisieren, sodass sie ohne manuellen Zusatzaufwand bei jeder Genehmigung greift, wodurch schnelle Freigaben weiterhin möglich bleiben, während Selbstgenehmigung und unbemerkte Artefaktänderungen strukturell ausgeschlossen sind.

## Praktische Labs

~~~python
import hashlib

class ApprovalWorkflow:
    def __init__(self):
        self.approvals = {}

    def _hash_artifact(self, artifact_content):
        return hashlib.sha256(artifact_content.encode()).hexdigest()

    def request_approval(self, requester_id, artifact_content, evidence):
        artifact_hash = self._hash_artifact(artifact_content)
        self.approvals[artifact_hash] = {
            "requester_id": requester_id,
            "evidence": evidence,
            "approver_id": None,
            "artifact_content": artifact_content,
        }
        return artifact_hash

    def approve(self, artifact_hash, approver_id):
        entry = self.approvals[artifact_hash]
        if approver_id == entry["requester_id"]:
            raise PermissionError("Segregation of duties violation: requester cannot approve their own release.")
        entry["approver_id"] = approver_id
        print(f"Approved artifact {artifact_hash[:8]}... by {approver_id} (requested by {entry['requester_id']})")

    def is_valid(self, artifact_hash, current_artifact_content):
        entry = self.approvals.get(artifact_hash)
        if entry is None or entry["approver_id"] is None:
            return False
        return self._hash_artifact(current_artifact_content) == artifact_hash

workflow = ApprovalWorkflow()
artifact_v1 = "release_config_v1_content"
h = workflow.request_approval(requester_id="dev_alice", artifact_content=artifact_v1, evidence=["tests_passed"])

try:
    workflow.approve(h, approver_id="dev_alice")
except PermissionError as e:
    print(f"BLOCKED: {e}")

workflow.approve(h, approver_id="qa_bob")
print(f"Approval still valid for unchanged artifact: {workflow.is_valid(h, artifact_v1)}")

artifact_v1_modified = "release_config_v1_content_MODIFIED"
print(f"Approval valid for MODIFIED artifact (should be False): {workflow.is_valid(h, artifact_v1_modified)}")
~~~

## Dependencies, Cross-References und Quellen

1. NIST: [AI Risk Management Framework (AI RMF 1.0)](https://www.nist.gov/itl/ai-risk-management-framework), abgerufen 2026-09-17.
2. OWASP: [Segregation of Duties](https://owasp.org/www-community/Access_Control), abgerufen 2026-09-17.

Human Gates für Agentenaktionen sind kanonisch in KB-0289 behandelt; Model Governance im Delivery-Prozess in [KB-0373](23-model-governance-im-delivery-prozess.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Policy-Engines, die Funktionstrennung und Artefaktbindung deklarativ statt in Anwendungscode durchsetzen | Adopting | Gegenüber fest im Anwendungscode verankerten Prüfungen für konsistentere, zentral pflegbare Governance-Regeln bevorzugen. |
| Kryptografisch signierte Genehmigungen, die eine manipulationssichere Nachweiskette pro Release-Artefakt erzeugen | Evaluating | Gegenüber einfacher Hash-Bindung abwägen, sobald ein konkretes Bedrohungsmodell nachträgliche Manipulation der Genehmigungsdaten selbst als reales Risiko einstuft. |

Ein Team akzeptiert eine Release-Freigabe erst, wenn Funktionstrennung technisch durchgesetzt und die Genehmigung an den aktuellen Artefakt-Hash gebunden ist.
