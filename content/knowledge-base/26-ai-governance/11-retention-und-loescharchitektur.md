---
{"id": "KB-0627", "title": "Retention und Löscharchitektur", "domain": "26", "sequence": 11, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "GENAI", "CHIEF"], "requires": [{"id": "KB-0618", "concepts": ["GDPR und Datenschutzarchitektur"], "needed_for": "understanding"}, {"id": "KB-0585", "concepts": ["Backup-Betrieb und Wiederherstellungsnachweise"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Aufbewahrungsfristen und Löschpfade für ein konkretes Datenobjekt über alle Systeme (einschließlich Replikate und Backups) anhand etablierter Praxis korrekt verfolgen und technische Vollständigkeit nachweisen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Löschpfade über die bereits in KB-0585 behandelte Backup-Architektur hinweg vollständig nachvollziehbar sind, statt nur die primären, aktiven Systeme abzudecken.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein formal ausgeführter Löschvorgang tatsächlich nur die primären Systeme, nicht aber Replikate oder Backups erreicht hat, und die daraus resultierende, unvollständige Löschung von einer tatsächlich vollständigen Löschung unterscheiden können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Retention- und Löscharchitektur festlegen, die technische Vollständigkeit über alle Systeme einschließlich Backups verbindlich nachweisen, statt formale Löschung ohne diesen Nachweis zu akzeptieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, technische Implementierung spezifischer Backup-Löschmechanismen ist bereits in Domain 24 behandelt.", "rationale": "Kern ist die vollständige, nachvollziehbare Verfolgung von Löschpfaden über alle Systeme, nicht die technische Detailimplementierung einzelner Löschmechanismen."}}, "lab_validation": [{"lab_id": "KB-0627-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Prüfung vollständiger Löschung über primäre Systeme, Replikate und Backups, kein produktives Löschsystem verwendet", "evidence": "Ein lokales Skript prüft, ob ein angeforderter Löschvorgang tatsächlich in allen Systemen (primäres System, Replikat, Backup) ausgeführt wurde, und markiert Systeme mit weiterhin vorhandenen Daten als unvollständige Löschung.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Löschsystem."}]}
---
# Retention und Löscharchitektur

> **Ziel:** Retention-Vorgaben legen fest, wie lange ein Datenobjekt für einen bestimmten, dokumentierten Zweck (siehe die bereits in [KB-0618](02-gdpr-und-datenschutzarchitektur.md) behandelte Zweckbindung) aufbewahrt werden darf, bevor es tatsächlich gelöscht werden muss. Der zentrale Punkt dieses Kapitels ist, dass ein Löschvorgang nur dann tatsächlich vollständig ist, wenn er über **alle** Systeme verfolgt wird, in denen das betroffene Datenobjekt tatsächlich existiert — nicht nur das primäre, aktive System, sondern auch **Replikate** und **Backups** (siehe die bereits in [KB-0585](../24-observability-sre/21-backup-betrieb-und-wiederherstellungsnachweise.md) behandelte Backup-Architektur). Eine Löschung, die formal im primären System ausgeführt wird, aber in einem Backup oder einer Replikation fortbesteht, ist keine tatsächlich vollständige Löschung, selbst wenn sie formal als "durchgeführter Löschvorgang" dokumentiert wird.

## Zweck, Mental Model und Dependencies

Die strukturelle Herausforderung einer vollständigen Löschung liegt in der bereits in [KB-0585](../24-observability-sre/21-backup-betrieb-und-wiederherstellungsnachweise.md) behandelten Eigenschaft von Backups: Backups sind bewusst so konzipiert, dass sie Daten über den Zeitpunkt hinaus bewahren, zu dem sie im primären System gelöscht wurden — genau dieser Zweck (Wiederherstellbarkeit nach Datenverlust oder versehentlicher Löschung) steht in einem strukturellen Spannungsverhältnis zu der Anforderung, ein Datenobjekt tatsächlich vollständig zu löschen. Eine Löscharchitektur muss diesen Zielkonflikt explizit auflösen, statt ihn zu ignorieren: Entweder werden Backups mit einer eigenen, dokumentierten Aufbewahrungsfrist versehen, nach deren Ablauf sie automatisch und vollständig gelöscht werden (wodurch eine gelöschte Information nach Ablauf der Backup-Aufbewahrungsfrist tatsächlich aus allen Systemen verschwindet, auch wenn dies länger dauert als eine sofortige Löschung im primären System), oder es wird ein technischer Mechanismus implementiert, der eine gezielte Löschung einzelner Datenobjekte auch innerhalb bereits bestehender Backups ermöglicht (was technisch aufwendiger ist, aber eine schnellere, vollständige Löschung ermöglicht). Replikate (etwa in Multi-Region-Architekturen, siehe die bereits in [KB-0587](../24-observability-sre/23-multi-region-failover-im-betrieb.md) behandelte Multi-Region-Replikation) stellen eine ähnliche, aber technisch andere Herausforderung dar: Eine Löschung muss tatsächlich zu allen Replikaten propagiert werden, nicht nur zur primären, ursprünglich angesprochenen Instanz — eine unvollständige Propagierung kann dazu führen, dass gelöschte Daten in einer sekundären Region weiterhin abrufbar bleiben. Die Verantwortlichkeit für die tatsächliche Löschvollständigkeit muss explizit einem benannten Dateninhaber zugeordnet sein, der nicht nur die formale Löschanforderung entgegennimmt, sondern auch tatsächlich nachweist, dass die Löschung über alle relevanten Systeme (primär, Replikate, Backups) vollständig durchgeführt wurde, statt eine Löschanforderung nach der Ausführung im primären System als abgeschlossen zu betrachten.

~~~text
Retention rule: defines how long a data object may be retained for a documented purpose (KB-0618)
  before it must actually be deleted
KEY POINT: a deletion is only actually complete when tracked across ALL systems the affected
  data object actually exists in -- NOT just primary active system, but also REPLICAS and BACKUPS
  (backup architecture, KB-0585)
deletion formally executed in primary system but persisting in a backup/replication
  = NOT actually complete deletion, even if formally documented as "deletion performed"
STRUCTURAL CHALLENGE: KB-0585's backup property
  backups deliberately designed to preserve data BEYOND point of primary-system deletion
  this EXACT purpose (recoverability after data loss/accidental deletion)
  structurally TENSIONS with requirement to actually fully delete a data object
Deletion architecture must EXPLICITLY resolve this conflict, not ignore it
  EITHER: backups given own, documented retention period, after which auto+fully deleted
    (deleted info actually vanishes from all systems after backup retention expires,
     even if slower than immediate primary-system deletion)
  OR: technical mechanism implemented enabling TARGETED deletion of individual data objects
    even WITHIN already-existing backups
    (more technically complex, but enables faster, complete deletion)
REPLICAS (e.g. multi-region architectures, KB-0587) = similar-but-technically-different challenge
  deletion must actually PROPAGATE to ALL replicas, not just primary, originally-addressed instance
  incomplete propagation -> deleted data can remain retrievable in a secondary region
RESPONSIBILITY for actual deletion completeness must be explicitly assigned to a named data owner
  who not just RECEIVES the formal deletion request
  but ACTUALLY PROVES deletion was completely executed across ALL relevant systems
    (primary, replicas, backups)
  instead of considering deletion request complete after execution in primary system alone
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Backup-Aufbewahrungsfrist | begrenzt, wie lange gelöschte Daten in Backups fortbestehen | löst Zielkonflikt zwischen Wiederherstellbarkeit und Löschung |
| Gezielte Backup-Löschung | ermöglicht schnellere, vollständige Löschung einzelner Objekte | technisch aufwendiger, aber nicht auf Fristablauf angewiesen |
| Replikatspropagierung | überträgt Löschung auf alle Replikate | verhindert weiterhin abrufbare Daten in sekundären Regionen |
| Benannter Dateninhaber | verantwortlich für Nachweis vollständiger Löschung | verhindert vorzeitige Abschlusserklärung |

Implementierung: Für jedes Datenobjekt wird explizit verfolgt, in welchen Systemen (primär, Replikate, Backups) es tatsächlich existiert. Backups erhalten eine dokumentierte, eigene Aufbewahrungsfrist oder einen technischen Mechanismus für gezielte Löschung. Replikatspropagierung wird bei jeder Löschung explizit sichergestellt und überprüft. Ein benannter Dateninhaber ist für den tatsächlichen Vollständigkeitsnachweis einer Löschung verantwortlich.

## Scalability, Reliability, Security und Observability

Retention- und Löscharchitektur skaliert die tatsächliche Löschvollständigkeit proportional zur expliziten Auflösung des Zielkonflikts zwischen Backup-Wiederherstellbarkeit und tatsächlicher Löschung; die Reliability-Grenze liegt darin, dass eine formal im primären System ausgeführte Löschung ohne Verfolgung über Replikate und Backups keine tatsächliche Löschvollständigkeit garantiert.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| gelöschte Daten sind über einen Wiederherstellungsprozess aus einem Backup weiterhin abrufbar | keine dokumentierte Backup-Aufbewahrungsfrist oder gezielte Backup-Löschung wurde angewendet | eine Backup-Aufbewahrungsfrist einführen oder einen Mechanismus für gezielte Backup-Löschung implementieren |
| gelöschte Daten sind in einer sekundären Region weiterhin abrufbar | die Löschpropagierung zu allen Replikaten war unvollständig | die Replikatspropagierung bei jeder Löschung explizit prüfen und sicherstellen |
| eine Löschanforderung gilt formal als abgeschlossen, aber niemand kann die tatsächliche Vollständigkeit belegen | kein benannter Dateninhaber ist für den Vollständigkeitsnachweis verantwortlich | einen benannten Dateninhaber mit expliziter Nachweispflicht für vollständige Löschung einführen |

Security: Gelöschte, aber weiterhin in Backups vorhandene Daten stellen bei einem Backup-Kompromittierungsszenario ein zusätzliches, oft übersehenes Risiko dar. Observability: Die tatsächliche, nachgewiesene Löschvollständigkeit über primäre Systeme, Replikate und Backups ist ein zentrales Signal zur Bewertung der Retention- und Löscharchitektur-Qualität.

## Trade-offs und Entscheidungen

**Staff** verfolgt eine gegebene Löschanforderung korrekt über primäres System, Replikate und Backups. **Principal** entwirft die vollständige Retention- und Löscharchitektur mit expliziter Backup-Aufbewahrungsstrategie für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für Löschvollständigkeit fest, die den Zielkonflikt zwischen Backup-Wiederherstellbarkeit und Löschpflicht verbindlich auflösen.

Anti-Patterns: eine Löschung als abgeschlossen betrachten, sobald sie im primären System ausgeführt wurde, ohne Replikate und Backups zu berücksichtigen; keine dokumentierte Backup-Aufbewahrungsfrist oder Löschmechanismus für Backups definieren; Löschanforderungen ohne benannten, verantwortlichen Dateninhaber bearbeiten.

## Production Checklist

- [ ] Für jedes Datenobjekt ist verfolgt, in welchen Systemen (primär, Replikate, Backups) es tatsächlich existiert.
- [ ] Backups haben eine dokumentierte Aufbewahrungsfrist oder einen Mechanismus für gezielte Löschung.
- [ ] Löschpropagierung zu allen Replikaten wird bei jeder Löschung explizit geprüft.
- [ ] Ein benannter Dateninhaber ist für den tatsächlichen Vollständigkeitsnachweis jeder Löschung verantwortlich.

## Interviewfragen

### 1. Warum ist eine Löschung, die nur im primären System ausgeführt wird, nicht automatisch vollständig?

**Antwort:** Weil das betroffene Datenobjekt möglicherweise weiterhin in Replikaten oder Backups existiert, die nicht automatisch von einer Löschung im primären System erfasst werden.

### 2. Welcher strukturelle Zielkonflikt besteht zwischen Backup-Architektur und Löschpflicht?

**Antwort:** Backups sind bewusst so konzipiert, dass sie Daten über den Löschzeitpunkt im primären System hinaus bewahren, um Wiederherstellbarkeit zu ermöglichen — dies steht im Spannungsverhältnis zur Anforderung, Daten tatsächlich vollständig zu löschen.

### 3. Welche zwei Lösungsansätze gibt es für den Backup-Löschkonflikt?

**Antwort:** Eine dokumentierte, eigene Aufbewahrungsfrist für Backups mit automatischer, vollständiger Löschung nach Fristablauf, oder ein technischer Mechanismus für gezielte Löschung einzelner Datenobjekte innerhalb bestehender Backups.

### 4. Warum ist eine explizite Replikatspropagierung bei Löschungen notwendig?

**Antwort:** Weil eine Löschung tatsächlich zu allen Replikaten propagiert werden muss, sonst können gelöschte Daten in einer sekundären Region weiterhin abrufbar bleiben.

### 5. Wie gehst du vor, wenn gelöschte Daten über einen Wiederherstellungsprozess aus einem Backup weiterhin abrufbar sind?

**Antwort:** Ich prüfe, ob eine dokumentierte Backup-Aufbewahrungsfrist oder ein Mechanismus für gezielte Backup-Löschung angewendet wurde, und führe eine entsprechende Lösung ein, falls sie fehlt.

### 6. Widersprüchliche Anforderung: Der Betrieb will lange Backup-Aufbewahrungsfristen zur Wiederherstellungssicherheit UND die Organisation muss Löschanforderungen zeitnah und vollständig erfüllen — wie gehst du vor?

**Antwort:** Ich würde einen technischen Mechanismus für gezielte Löschung einzelner Datenobjekte innerhalb bestehender Backups implementieren, der lange Aufbewahrungsfristen für die Wiederherstellungssicherheit beibehält, während spezifische Löschanforderungen dennoch zeitnah erfüllt werden können, statt entweder die Aufbewahrungsfrist zu verkürzen oder Löschanforderungen erst nach Fristablauf zu erfüllen.

## Praktische Labs

~~~python
# Local, deterministic simulation of verifying deletion completeness across primary, replicas, and backups (executed locally, no real deletion system):

def check_deletion_completeness(object_id, systems_containing_object):
    remaining = [s for s in systems_containing_object if s["still_present"]]
    return {"object": object_id, "fully_deleted": len(remaining) == 0, "remaining_in": [s["system"] for s in remaining]}

systems = [
    {"system": "primary_db", "still_present": False},
    {"system": "eu_replica", "still_present": False},
    {"system": "backup_snapshot_q3", "still_present": True},
]

print(check_deletion_completeness("user-4521", systems))
~~~

## Dependencies, Cross-References und Quellen

1. Europäischer Datenschutzausschuss: [Guidelines on the Right to Erasure ('Right to be Forgotten')](https://edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-52019-criteria-right-be-forgotten-search-engines_en), abgerufen 2026-09-18.
2. NIST: [SP 800-88 Rev. 1 — Guidelines for Media Sanitization](https://csrc.nist.gov/pubs/sp/800/88/r1/final), abgerufen 2026-09-18.

Backup-Betrieb und Wiederherstellungsnachweise sind kanonisch in [KB-0585](../24-observability-sre/21-backup-betrieb-und-wiederherstellungsnachweise.md) behandelt; GDPR und Datenschutzarchitektur in [KB-0618](02-gdpr-und-datenschutzarchitektur.md); Multi-Region-Replikation in [KB-0587](../24-observability-sre/23-multi-region-failover-im-betrieb.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Kryptografisches Löschen (Crypto-Shredding) durch Vernichtung des Verschlüsselungsschlüssels statt physischer Datenlöschung in Backups | Evaluating | Als technisch effiziente Alternative für verschlüsselt gespeicherte Backups prüfen, jedoch die tatsächliche, dauerhafte Unwiederherstellbarkeit des Schlüssels vor produktivem Vertrauen validieren. |

Ein Team akzeptiert eine Löschanforderung erst als vollständig erfüllt, wenn nachweislich alle Systeme (primär, Replikate, Backups) tatsächlich keine Daten des betroffenen Objekts mehr enthalten oder ein dokumentierter, technischer Ausnahmegrund (etwa befristete Backup-Aufbewahrung) vorliegt.
