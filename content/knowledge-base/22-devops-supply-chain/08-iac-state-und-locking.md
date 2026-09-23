---
{"id": "KB-0520", "title": "IaC State und Locking", "domain": "22", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "MLOPS", "CLOUD"], "requires": [{"id": "KB-0519", "concepts": ["Terraform und OpenTofu"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Remote Backends und State-Locking anhand offizieller Dokumentation korrekt konfigurieren und einen beschädigten oder inkonsistenten State mit kontrollierten Reparaturschritten behandeln können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Team-Umgebung explizit entscheiden, wie Remote-Backend- und Locking-Strategie gestaltet werden, um gleichzeitigen Zugriff mehrerer Teammitglieder oder Automatisierungen sicher zu ermöglichen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen beschädigten oder inkonsistenten State auf einen fehlgeschlagenen, nicht ordnungsgemäß gesperrten gleichzeitigen Zugriff zurückführen können, statt eine Reparatur ohne Ursachenanalyse zu versuchen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für State-Management, Locking und kontrollierte State-Reparaturprozesse als Grundlage zuverlässiger Infrastructure-as-Code-Praxis festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung spezifischer Backend-Locking-Mechanismen (z. B. DynamoDB-basiertes Locking) im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Remote-Backend-Notwendigkeit, Locking-Prinzip und kontrollierter State-Reparatur, nicht die backend-spezifische Locking-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0520-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation von State-Locking-Konflikten bei gleichzeitigem Zugriff, kein produktives IaC-Backend verwendet", "evidence": "Ein lokales Skript simuliert, wie zwei gleichzeitige Apply-Versuche ohne Locking denselben State inkonsistent verändern können, während ein Locking-Mechanismus den zweiten Versuch explizit blockiert, bis der erste abgeschlossen ist, und zeigt damit die strukturelle Notwendigkeit von Locking bei gemeinsam genutztem State.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Remote-Backend mit tatsächlicher Netzwerk- und Nebenläufigkeitsdynamik."}]}
---
# IaC State und Locking

> **Ziel:** Der State (siehe [KB-0519](07-terraform-und-opentofu.md)) muss bei mehr als einer Person oder Automatisierung, die dieselbe Infrastruktur verwaltet, in einem **Remote Backend** (zentral gespeichert, z. B. in einem Cloud-Objektspeicher statt lokal auf einem einzelnen Rechner) mit **Locking** (einem Sperrmechanismus, der verhindert, dass zwei gleichzeitige Apply-Vorgänge denselben State gleichzeitig verändern) verwaltet werden. Der zentrale Punkt dieses Kapitels ist, dass ein beschädigter oder inkonsistenter State typischerweise nicht auf einen Fehler im deklarativen Code zurückzuführen ist, sondern auf einen fehlgeschlagenen, nicht ordnungsgemäß gesperrten gleichzeitigen Zugriff — zwei parallele Apply-Vorgänge ohne Locking können denselben State in überlappender, widersprüchlicher Weise verändern, was zu einem State führt, der nicht mehr korrekt den tatsächlichen Infrastrukturzustand widerspiegelt und kontrollierte, explizite Reparaturschritte (etwa über einen Import, der eine bestehende, tatsächliche Ressource explizit wieder in den State aufnimmt) statt einer unreflektierten erneuten Ausführung erfordert.

## Zweck, Mental Model und Dependencies

Ein lokal gespeicherter State (auf der Festplatte eines einzelnen Entwicklers) funktioniert nur, solange ausschließlich diese eine Person die Infrastruktur verwaltet — sobald ein Team oder eine Automatisierungspipeline gemeinsam dieselbe Infrastruktur verwaltet, muss der State zentral in einem Remote Backend liegen, auf das alle Beteiligten zugreifen, statt dass jeder eine eigene, potenziell veraltete lokale Kopie hat. Locking adressiert das daraus entstehende Nebenläufigkeitsproblem: Ohne Sperrmechanismus könnten zwei gleichzeitige Apply-Vorgänge (etwa ein Entwickler, der manuell einen Apply ausführt, während gleichzeitig eine CI/CD-Pipeline denselben State verändert) beide gleichzeitig auf denselben, zu diesem Zeitpunkt konsistenten State zugreifen, jeweils unabhängig ihre eigenen Änderungen berechnen und anwenden, und dabei den State in eine Zwischenform bringen, die keine der beiden beabsichtigten Endzustände korrekt widerspiegelt. Ein Locking-Mechanismus verhindert dies, indem der zweite Apply-Versuch explizit blockiert wird, bis der erste abgeschlossen ist — dies verlangsamt gleichzeitige Operationen, stellt aber sicher, dass der State stets aus einer konsistenten, nicht überlappenden Abfolge von Änderungen entsteht. Wenn ein State dennoch beschädigt oder inkonsistent wird (etwa durch einen fehlgeschlagenen Lock, einen abgebrochenen Apply-Vorgang, oder eine externe Manipulation), ist eine kontrollierte Reparatur nötig: Ein Import nimmt eine bereits real existierende Ressource explizit (unter Angabe ihrer tatsächlichen Cloud-Identität) in den State auf, ohne sie neu zu erstellen, was es ermöglicht, den State schrittweise, nachvollziehbar und ohne destruktive Neuerstellung von Ressourcen wieder mit der tatsächlichen Infrastruktur in Einklang zu bringen, statt den beschädigten State unreflektiert zu löschen und alle Ressourcen destruktiv neu zu erstellen.

~~~text
IaC State (see KB-0519) needs REMOTE BACKEND + LOCKING once MORE THAN ONE person/automation manages it
  local state (single dev's disk): fine ONLY for that one person
  -> team/CI-CD sharing infra -> state MUST be central (e.g. cloud object storage), not per-person local copies
LOCKING: prevents concurrent modification
  WITHOUT lock: 2 simultaneous applies both read same consistent state, compute independent changes, apply
    -> state ends up in inconsistent INTERMEDIATE form reflecting NEITHER intended end state
  WITH lock: second apply attempt BLOCKED until first completes -> consistent, non-overlapping change sequence
CORRUPTED/INCONSISTENT state usually != code bug
  -> usually = failed/missing lock during concurrent access
CONTROLLED REPAIR: IMPORT
  explicitly brings an ALREADY-existing real resource (by its actual cloud identity) into state
  -> WITHOUT recreating it -> incremental, traceable state repair
  vs deleting corrupted state + destructively recreating everything (DANGEROUS)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Remote Backend | zentrale State-Speicherung für Team-/Automatisierungszugriff | notwendig sobald mehr als eine Person/Automatisierung verwaltet |
| Locking | verhindert gleichzeitige, widersprüchliche State-Änderungen | blockiert zweiten Zugriff, bis erster abgeschlossen ist |
| Drift | Diskrepanz zwischen State und tatsächlichem Cloud-Zustand | siehe [KB-0519](07-terraform-und-opentofu.md), separat von State-Beschädigung |
| Import | kontrollierte Aufnahme einer real existierenden Ressource in den State | Reparaturmechanismus ohne destruktive Neuerstellung |

Implementierung: Sobald mehr als eine Person oder Automatisierung dieselbe Infrastruktur verwaltet, wird explizit ein Remote Backend mit aktiviertem Locking eingerichtet, statt lokalen State beizubehalten. Bei einem beschädigten oder inkonsistenten State wird zunächst die tatsächliche Ursache (fehlgeschlagener Lock, abgebrochener Apply) geklärt, bevor eine Reparatur über gezielte Imports statt destruktiver Neuerstellung erfolgt. Locking-Konflikte werden nicht ignoriert oder erzwungen umgangen, sondern als Signal für tatsächlich gleichzeitigen Zugriff behandelt.

## Scalability, Reliability, Security und Observability

IaC-State-Management skaliert die Team-Zusammenarbeit proportional zur konsequenten Nutzung von Remote Backend und Locking; die Reliability-Grenze liegt darin, dass fehlendes oder umgangenes Locking proportional zur Häufigkeit gleichzeitiger Zugriffe zu State-Inkonsistenz führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| der State ist nach mehreren parallelen Änderungen inkonsistent oder beschädigt | Locking fehlte oder wurde umgangen bei gleichzeitigem Zugriff mehrerer Prozesse | prüfen, ob ein Remote Backend mit aktiviertem Locking korrekt konfiguriert ist |
| ein Apply-Versuch bleibt unerwartet lange blockiert | ein vorheriger Lock wurde nach einem abgebrochenen Vorgang nicht ordnungsgemäß freigegeben | den verwaisten Lock explizit und kontrolliert lösen, nachdem der abgebrochene Vorgang tatsächlich beendet ist |
| eine Ressource existiert real, ist aber nicht im State erfasst | die Ressource wurde außerhalb des Werkzeugs erstellt oder ging durch eine State-Beschädigung verloren | die Ressource explizit über einen Import in den State aufnehmen, statt sie neu zu erstellen |

Security: Remote-Backend-Zugriff sollte mit minimalen, zweckgebundenen Berechtigungen erfolgen, und State-Inhalte sollten verschlüsselt gespeichert werden, da sie sensible Informationen enthalten können (siehe [KB-0519](07-terraform-und-opentofu.md)). Observability: Die Häufigkeit von Locking-Konflikten, verwaisten Locks, und State-Reparaturen über Imports sind zentrale Betriebssignale zur Bewertung der State-Management-Zuverlässigkeit.

## Trade-offs und Entscheidungen

**Staff** konfiguriert ein Remote Backend mit Locking für ein gegebenes Team korrekt. **Principal** entwirft die State-Management-Strategie inklusive kontrollierter Reparaturprozesse für eine Infrastrukturarchitektur. **Chief** legt unternehmensweite Standards für State-Management und Locking als Grundlage zuverlässiger IaC-Praxis fest.

Anti-Patterns: lokalen State bei mehr als einer beteiligten Person oder Automatisierung beibehalten; Locking-Konflikte erzwungen umgehen, statt die zugrunde liegende Ursache zu klären; einen beschädigten State unreflektiert löschen und alle Ressourcen destruktiv neu erstellen, statt gezielte Imports zur Reparatur zu nutzen.

## Production Checklist

- [ ] Ein Remote Backend mit aktiviertem Locking ist für jede von mehr als einer Person/Automatisierung verwaltete Infrastruktur konfiguriert.
- [ ] Locking-Konflikte werden als Signal für gleichzeitigen Zugriff untersucht, nicht erzwungen umgangen.
- [ ] Verwaiste Locks werden nur nach expliziter Bestätigung, dass der ursprüngliche Vorgang tatsächlich beendet ist, gelöst.
- [ ] State-Reparaturen erfolgen über gezielte Imports, nicht über destruktive Neuerstellung.

## Interviewfragen

### 1. Wann wird ein Remote Backend für den State notwendig?

**Antwort:** Sobald mehr als eine Person oder Automatisierung dieselbe Infrastruktur verwaltet, da lokaler State nur für einen einzelnen Nutzer funktioniert.

### 2. Was leistet Locking beim State-Management?

**Antwort:** Es verhindert, dass zwei gleichzeitige Apply-Vorgänge denselben State gleichzeitig und widersprüchlich verändern, indem der zweite Zugriff blockiert wird, bis der erste abgeschlossen ist.

### 3. Warum ist ein beschädigter State häufig kein Fehler im deklarativen Code?

**Antwort:** Weil er typischerweise durch fehlendes oder umgangenes Locking bei gleichzeitigem Zugriff entsteht, nicht durch einen Fehler in der deklarierten Ressourcendefinition.

### 4. Was leistet ein Import zur State-Reparatur, und warum ist er einer destruktiven Neuerstellung vorzuziehen?

**Antwort:** Ein Import nimmt eine bereits real existierende Ressource explizit in den State auf, ohne sie neu zu erstellen, was eine schrittweise, nachvollziehbare Reparatur ohne Datenverlust oder destruktive Nebenwirkungen ermöglicht.

### 5. Wie gehst du vor, wenn der State nach mehreren parallelen Änderungen inkonsistent oder beschädigt ist?

**Antwort:** Ich prüfe zuerst, ob Locking fehlte oder umgangen wurde, bevor ich eine Reparatur versuche, und repariere den State dann gezielt über Imports statt einer destruktiven Neuerstellung.

### 6. Widersprüchliche Anforderung: Team will maximale Parallelität bei Infrastrukturänderungen für schnelle Entwicklungsgeschwindigkeit UND garantiert konsistenten, nie beschädigten State — wie gehst du vor?

**Antwort:** Ich würde erklären, dass unbegrenzte Parallelität am gemeinsamen State und garantierte Konsistenz sich strukturell widersprechen, und vorschlagen, Locking konsequent beizubehalten (was sequenzielle statt vollständig parallele Änderungen am selben State erzwingt), während Parallelität durch Aufteilung der Infrastruktur in unabhängige, separat verwaltete State-Bereiche (z. B. pro Team oder Komponente) erreicht wird, statt Locking für vermeintliche Geschwindigkeit zu opfern.

## Praktische Labs

~~~python
# Local, deterministic simulation of locking preventing concurrent state corruption (executed locally, no real backend):

class StateLock:
    def __init__(self):
        self.locked = False

    def acquire(self, requester):
        if self.locked:
            return f"{requester}: BLOCKED, lock held by another process"
        self.locked = True
        return f"{requester}: lock acquired, applying changes"

    def release(self, requester):
        self.locked = False
        return f"{requester}: lock released"

lock = StateLock()
print(lock.acquire("ci-pipeline"))
print(lock.acquire("developer-manual-apply"))
print(lock.release("ci-pipeline"))
print(lock.acquire("developer-manual-apply"))
~~~

## Dependencies, Cross-References und Quellen

1. Terraform-Dokumentation: [Backend Configuration — Remote State and Locking](https://developer.hashicorp.com/terraform/language/backend), abgerufen 2026-09-18.
2. Terraform-Dokumentation: [Import — Bringing Existing Resources Under Terraform's Management](https://developer.hashicorp.com/terraform/cli/import), abgerufen 2026-09-18.

Terraform und OpenTofu sind kanonisch in [KB-0519](07-terraform-und-opentofu.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte State-Konsistenzprüfung mit proaktiver Drift- und Beschädigungserkennung außerhalb des manuellen Plan-Zyklus | Evaluating | Gegenüber ausschließlich manueller, plan-basierter Prüfung erst nach Prüfung der tatsächlichen Erkennungsgenauigkeit und des Ressourcenaufwands bevorzugen. |

Ein Team akzeptiert eine State-Management-Konfiguration erst, wenn Remote Backend und Locking nachweislich korrekt eingerichtet sind und State-Reparaturen kontrolliert über Imports statt destruktiver Neuerstellung erfolgen.
