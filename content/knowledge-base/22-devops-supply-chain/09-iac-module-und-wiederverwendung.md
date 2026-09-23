---
{"id": "KB-0521", "title": "IaC-Module und Wiederverwendung", "domain": "22", "sequence": 9, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "MLOPS", "CLOUD"], "requires": [{"id": "KB-0520", "concepts": ["IaC State und Locking"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "IaC-Modulschnittstellen mit expliziten Eingabe-/Ausgabeparametern anhand offizieller Dokumentation korrekt gestalten und versionieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Infrastrukturlandschaft explizit entscheiden, wie Module komponiert werden und wie eine Migration bestehender Ressourcenzustände in ein neues Modul kontrolliert erfolgt, ohne überbreite, alle Anwendungsfälle abdeckende Abstraktionen zu erzwingen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Ressourcenzerstörung bei einer Modulmigration auf eine fehlende explizite State-Verschiebung statt einer echten Ressourcenneuerstellung zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Modul-Design und -Versionierung anhand fokussierter, klar abgegrenzter Schnittstellen statt überbreiter Alles-abdeckender Abstraktionen festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Detailmechanik werkzeugspezifischer Modul-Registries im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Modulschnittstellen-Design, Versionierung und kontrollierter State-Migration, nicht die Registry-Interna."}}, "lab_validation": [{"lab_id": "KB-0521-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation von Ressourcenzerstörung bei fehlender State-Verschiebung während einer Modulmigration, kein produktives IaC-System verwendet", "evidence": "Ein lokales Skript simuliert, wie eine Ressource, die aus einer direkten Deklaration in ein neues Modul verschoben wird, ohne explizite State-Verschiebung als 'zu löschen' (alte Deklaration) und 'neu zu erstellen' (Modul-Deklaration) interpretiert wird, obwohl die zugrunde liegende reale Ressource unverändert bleiben sollte, und zeigt, wie eine explizite State-Verschiebungsoperation diese unbeabsichtigte Zerstörung vermeidet.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Modul-Registry-System."}]}
---
# IaC-Module und Wiederverwendung

> **Ziel:** Ein IaC-Modul kapselt eine wiederverwendbare Gruppe von Ressourcen hinter einer expliziten **Schnittstelle** (definierte Eingabeparameter und Ausgabewerte), sodass dieselbe Infrastrukturlogik mehrfach mit unterschiedlichen Parametern instanziiert werden kann, statt dieselben Ressourcendefinitionen an mehreren Stellen zu duplizieren. **Versionierung** ermöglicht kontrollierte Weiterentwicklung eines Moduls, ohne bestehende Nutzer unvorbereitet mit brechenden Änderungen zu konfrontieren. **Composition** kombiniert mehrere fokussierte Module zu größeren Strukturen, statt ein einzelnes, alle denkbaren Anwendungsfälle abdeckendes Modul zu bauen. Der zentrale Punkt dieses Kapitels ist, dass eine unerwartete Ressourcenzerstörung bei einer Modulmigration (bestehende, direkt deklarierte Ressourcen werden in ein neues Modul verschoben) typischerweise nicht auf ein Problem der Zielinfrastruktur hindeutet, sondern auf eine fehlende explizite State-Verschiebung — ohne diese interpretiert das Werkzeug die alte Deklaration als zu löschende und die neue Modul-Deklaration als neu zu erstellende Ressource, obwohl die zugrunde liegende reale Ressource unverändert bleiben sollte.

## Zweck, Mental Model und Dependencies

IaC-Module lösen das Problem, dass ohne Wiederverwendungsmechanismus dieselbe Infrastrukturlogik (etwa: ein Standardmuster für ein Netzwerk mit Subnetzen, Routentabellen und Sicherheitsgruppen) an mehreren Stellen dupliziert werden müsste, was Inkonsistenz und erhöhten Wartungsaufwand bei Änderungen zur Folge hätte. Eine gut gestaltete Modulschnittstelle definiert explizit, welche Eingabeparameter das Modul akzeptiert (mit sinnvollen Standardwerten, wo angemessen) und welche Ausgabewerte es für die Nutzung durch aufrufenden Code bereitstellt, wodurch das Modul als klar abgegrenzte, austauschbare Einheit fungiert, deren interne Implementierung sich ändern kann, ohne die Schnittstelle zu brechen. Versionierung ermöglicht es, ein Modul kontrolliert weiterzuentwickeln — Nutzer können explizit entscheiden, wann sie auf eine neue Modulversion aktualisieren, statt automatisch und unvorbereitet von brechenden Änderungen betroffen zu sein. Ein häufiger Designfehler ist die überbreite Abstraktion: Ein Modul, das versucht, jeden denkbaren Anwendungsfall über eine wachsende Zahl optionaler Parameter abzudecken, wird zunehmend komplex, schwer verständlich und schwer zu warten — ein fokussiertes Modul mit einer klaren, engen Verantwortlichkeit, kombiniert mit anderen fokussierten Modulen über Composition, ist typischerweise wartbarer als ein einzelnes, alles abdeckendes "Superset"-Modul. Die kritischste operative Herausforderung bei der Einführung von Modulen in eine bestehende Infrastruktur ist die Migration: Wenn eine bereits real existierende, direkt (ohne Modul) deklarierte Ressource in ein neues Modul verschoben wird, sieht das Werkzeug standardmäßig zwei unabhängige Änderungen — die alte, direkte Deklaration verschwindet (interpretiert als "löschen"), und die neue, modulbasierte Deklaration erscheint (interpretiert als "neu erstellen") — ohne einen expliziten Mechanismus, der dem Werkzeug mitteilt, dass es sich um dieselbe, im State lediglich an eine neue Adresse verschobene Ressource handelt, würde ein Apply die reale Ressource tatsächlich löschen und neu erstellen, was bei zustandsbehafteten Ressourcen (Datenbanken, Speicher) katastrophale Datenverluste verursachen kann.

~~~text
IaC Module: encapsulates reusable resource group behind EXPLICIT interface (inputs + outputs)
  -> same infra logic instantiated multiple times with different params
     (vs duplicating same resource definitions in multiple places)
Versioning: controlled module evolution -- users explicitly choose when to upgrade
  (vs automatically, unpreparedly hit by breaking changes)
COMMON DESIGN FLAW: overly-broad abstraction
  module trying to cover EVERY conceivable use case via growing optional params
    -> increasingly complex, hard to understand/maintain
  -> FOCUSED module, narrow responsibility, combined via COMPOSITION = more maintainable than one "superset" module
MOST CRITICAL operational challenge: MIGRATING existing resources INTO a new module
  WITHOUT explicit state move:
    old direct declaration disappears -> tool sees "DELETE"
    new module declaration appears -> tool sees "CREATE"
    -> apply would ACTUALLY delete + recreate the real resource
    -> CATASTROPHIC for stateful resources (databases, storage) = real data loss
  WITH explicit state move: tells tool "same resource, just moved state address"
    -> no delete/recreate, resource stays untouched
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Modulschnittstelle | explizite Ein-/Ausgabeparameter | ermöglicht austauschbare, klar abgegrenzte Nutzung |
| Versionierung | kontrollierte Weiterentwicklung | verhindert unvorbereitete brechende Änderungen |
| Composition versus überbreite Abstraktion | fokussierte, kombinierbare Module statt Alles-Modul | wartbarer, verständlicher |
| Explizite State-Verschiebung bei Migration | verhindert Löschen/Neuerstellen bei Modul-Einführung | kritisch für zustandsbehaftete Ressourcen |

Implementierung: Jedes Modul wird mit einer expliziten, fokussierten Schnittstelle gestaltet, statt wachsende Mengen optionaler Parameter für jeden denkbaren Anwendungsfall zu akkumulieren. Modul-Versionen werden explizit vergeben, und Nutzer aktualisieren kontrolliert statt automatisch. Bei jeder Migration bestehender Ressourcen in ein neues Modul wird explizit eine State-Verschiebung durchgeführt und deren Effekt (kein Löschen/Neuerstellen) vor dem eigentlichen Apply über einen Plan verifiziert.

## Scalability, Reliability, Security und Observability

IaC-Module skalieren die Konsistenz der Infrastrukturlogik proportional zur Nutzung fokussierter, wiederverwendbarer Schnittstellen; die Reliability-Grenze liegt bei Migrationen darin, dass eine fehlende explizite State-Verschiebung proportional zur Zustandsbehaftung der betroffenen Ressourcen zu katastrophalem, unbeabsichtigtem Datenverlust führen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Plan zeigt bei einer Modulmigration unerwartet "löschen" und "neu erstellen" für dieselbe logische Ressource | keine explizite State-Verschiebung wurde vor der Modul-Einführung durchgeführt | eine explizite State-Verschiebungsoperation durchführen und den Plan erneut prüfen, bevor ein Apply erfolgt |
| ein Modul wird zunehmend komplex und schwer verständlich | das Modul versucht, zu viele unterschiedliche Anwendungsfälle über wachsende optionale Parameter abzudecken | das Modul in mehrere fokussierte Module mit klar abgegrenzter Verantwortlichkeit aufteilen |
| eine Modulaktualisierung bricht unerwartet bestehende Nutzung | das Modul wurde ohne explizite Versionierung oder ohne dokumentierte brechende Änderungen aktualisiert | eine explizite Versionierungsstrategie mit dokumentierten brechenden Änderungen einführen |

Security: Modulschnittstellen sollten keine sensiblen Standardwerte (z. B. offene Firewallregeln als Default) enthalten, die Nutzer unbeabsichtigt in unsichere Konfigurationen führen könnten. Observability: Die tatsächliche Modulversion, die über verschiedene Instanziierungen hinweg genutzt wird, sowie die Häufigkeit und der Erfolg von State-Verschiebungen bei Migrationen, sind relevante Betriebssignale.

## Trade-offs und Entscheidungen

**Staff** instanziiert ein bestehendes Modul mit korrekten Parametern für einen gegebenen Anwendungsfall. **Principal** entwirft die Modulschnittstelle und Versionierungsstrategie sowie kontrollierte Migrationsprozesse für bestehende Ressourcen. **Chief** legt unternehmensweite Standards für fokussiertes Modul-Design statt überbreiter Abstraktionen fest.

Anti-Patterns: ein einzelnes Modul mit wachsender Zahl optionaler Parameter für jeden denkbaren Anwendungsfall bauen, statt fokussierte, kombinierbare Module zu gestalten; bestehende Ressourcen ohne explizite State-Verschiebung in ein neues Modul migrieren und dadurch unbeabsichtigtes Löschen/Neuerstellen riskieren; Module ohne Versionierung aktualisieren und bestehende Nutzer unvorbereitet mit brechenden Änderungen konfrontieren.

## Production Checklist

- [ ] Jedes Modul hat eine explizite, fokussierte Schnittstelle statt wachsender optionaler Parameter.
- [ ] Module sind explizit versioniert, mit dokumentierten brechenden Änderungen.
- [ ] Jede Migration bestehender Ressourcen in ein neues Modul nutzt eine explizite State-Verschiebung.
- [ ] Der Plan-Effekt einer Migration wird vor dem Apply explizit auf unbeabsichtigtes Löschen/Neuerstellen geprüft.

## Interviewfragen

### 1. Was definiert eine gute IaC-Modulschnittstelle?

**Antwort:** Explizite Eingabeparameter mit sinnvollen Standardwerten und klar definierte Ausgabewerte, die das Modul als austauschbare, klar abgegrenzte Einheit nutzbar machen.

### 2. Warum ist eine überbreite, alles abdeckende Modulabstraktion problematisch?

**Antwort:** Weil sie mit wachsender Zahl optionaler Parameter zunehmend komplex und schwer verständlich wird; ein fokussiertes Modul mit enger Verantwortlichkeit, kombiniert über Composition, ist typischerweise wartbarer.

### 3. Was passiert, wenn eine bestehende Ressource ohne explizite State-Verschiebung in ein neues Modul migriert wird?

**Antwort:** Das Werkzeug interpretiert die alte Deklaration als zu löschen und die neue Modul-Deklaration als neu zu erstellen, was bei einem Apply die reale Ressource tatsächlich löschen und neu erstellen würde.

### 4. Warum ist dies bei zustandsbehafteten Ressourcen wie Datenbanken besonders kritisch?

**Antwort:** Weil ein unbeabsichtigtes Löschen und Neuerstellen bei solchen Ressourcen zu tatsächlichem, irreversiblem Datenverlust führen kann.

### 5. Wie gehst du vor, wenn ein Plan bei einer Modulmigration unerwartet "löschen" und "neu erstellen" für eine bestehende Ressource zeigt?

**Antwort:** Ich führe eine explizite State-Verschiebungsoperation durch, die dem Werkzeug mitteilt, dass es sich um dieselbe Ressource handelt, und prüfe den Plan erneut, bevor ich einen Apply ausführe.

### 6. Widersprüchliche Anforderung: Team will ein einziges, universelles Modul für maximale Wiederverwendung über alle Anwendungsfälle UND einfache, verständliche Modulschnittstellen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass ein universelles Modul und einfache, verständliche Schnittstellen sich mit wachsender Anwendungsfallvielfalt zunehmend widersprechen, und stattdessen mehrere fokussierte Module vorschlagen, die über Composition zu größeren Strukturen kombiniert werden, statt ein einzelnes Modul mit wachsender Parameteranzahl zu überladen.

## Praktische Labs

~~~python
# Local, deterministic simulation of migration risk without explicit state move (executed locally, no real IaC system):

def simulate_migration(has_explicit_state_move, is_stateful_resource):
    if not has_explicit_state_move:
        risk = "CRITICAL: resource will be deleted and recreated" if is_stateful_resource else "resource will be recreated (less critical if stateless)"
        return risk
    return "safe: resource state moved without delete/recreate"

print(simulate_migration(has_explicit_state_move=False, is_stateful_resource=True))
print(simulate_migration(has_explicit_state_move=True, is_stateful_resource=True))
~~~

## Dependencies, Cross-References und Quellen

1. Terraform-Dokumentation: [Modules Overview](https://developer.hashicorp.com/terraform/language/modules), abgerufen 2026-09-18.
2. Terraform-Dokumentation: [Refactoring — moved Blocks](https://developer.hashicorp.com/terraform/language/moved), abgerufen 2026-09-18.

IaC State und Locking sind kanonisch in [KB-0520](08-iac-state-und-locking.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Erkennung riskanter Löschen/Neuerstellen-Operationen bei Modulmigrationen direkt in Plan-Ausgaben | Evaluating | Gegenüber rein manueller Plan-Prüfung erst nach Prüfung der tatsächlichen Erkennungszuverlässigkeit für komplexe Migrationsszenarien bevorzugen. |

Ein Team akzeptiert eine Modulmigration erst, wenn nachweislich eine explizite State-Verschiebung durchgeführt und der resultierende Plan auf unbeabsichtigtes Löschen/Neuerstellen geprüft wurde.
