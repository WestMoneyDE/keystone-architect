---
{"id": "KB-0146", "title": "Architekturrefactoring und sichere Schritte", "domain": "06", "sequence": 18, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0145", "concepts": ["Architekturschulden"], "needed_for": "both"}, {"id": "KB-0141", "concepts": ["Expand-Contract"], "needed_for": "understanding"}], "related": ["KB-0147", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Charakterisierungstest für unbekanntes Legacy-Verhalten schreiben, bevor eine strukturelle Änderung vorgenommen wird.", "rationale": "Kein reales Legacy-System nötig, um das Prinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Einen Abhängigkeitsumbau in reversible Zwischenschritte zerlegen, die den Produktbetrieb nicht unterbrechen.", "rationale": "Ein 'Big Bang'-Refactoring ohne Zwischenschritte ist riskant und schwer rückgängig zu machen."}, "STAFF-TARGET": {"active": true, "scope": "Ein fehlgeschlagenes Refactoring auf einen fehlenden Charakterisierungstest oder einen nicht-reversiblen Schritt zurückführen.", "rationale": "Das sind die häufigsten Ursachen für gescheiterte Architektur-Umbauten."}, "CHIEF-TARGET": {"active": true, "scope": "Reversible, schrittweise Refactoring-Strategien gegenüber riskanten Komplettumbauten als Standard bevorzugen.", "rationale": "Große, irreversible Umbauten haben ein deutlich höheres Ausfallrisiko."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Automatisierte Refactoring-Tools und Codemod-Techniken im Detail sind Vertiefung.", "rationale": "Kern ist die Zerlegung in sichere, reversible Schritte, nicht ein bestimmtes Werkzeug."}}, "lab_validation": [{"lab_id": "KB-0146-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Charakterisierungstest vor Refactoring", "evidence": "Ein Charakterisierungstest erfasst das tatsächliche (nicht das vermutete) Verhalten einer Legacy-Funktion, bevor sie umgebaut wird, und erkennt eine unbeabsichtigte Verhaltensänderung im Refactoring.", "limitations": "Kein reales Legacy-System, keine Produktion."}]}
---
# Architekturrefactoring und sichere Schritte

> **Ziel:** Ein Architekturumbau bei laufendem Produktbetrieb braucht reversible Zwischenschritte statt eines riskanten „Big Bang"-Umbaus. Charakterisierungstests erfassen zunächst das tatsächliche (nicht das vermutete) Verhalten des Bestandscodes, bevor strukturelle Änderungen beginnen — sie machen unbeabsichtigte Verhaltensänderungen während des Umbaus sichtbar.

## Zweck, Mental Model und Dependencies

Ein Charakterisierungstest unterscheidet sich von einem gewöhnlichen Unit-Test: er beschreibt nicht, was der Code tun sollte, sondern was er tatsächlich tut — er wird gegen den bestehenden, oft unklaren Legacy-Code geschrieben, um dessen reales Verhalten als Sicherheitsnetz festzuhalten, bevor irgendetwas umgebaut wird. Jeder Refactoring-Schritt wird dann so klein gewählt, dass er einzeln reversibel ist (ein Rollback möglich bleibt) und der Produktbetrieb während des gesamten mehrstufigen Umbaus funktionsfähig bleibt — ähnlich dem Expand-Contract-Prinzip für Schema-Änderungen ([KB-0141](13-schema-evolution-und-kompatibilitaet.md)). Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0145](17-architekturschulden-und-aenderungsreibung.md) und [KB-0141](13-schema-evolution-und-kompatibilitaet.md).

~~~text
1. Write characterization tests capturing ACTUAL current behavior (not intended behavior)
2. Small reversible step 1 -> verify tests still pass -> deploy -> observe
3. Small reversible step 2 -> verify -> deploy -> observe
... each step independently revertible, system stays operational throughout
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko bei Fehlen |
|---|---|---|
| Charakterisierungstest | erfasst tatsächliches, nicht vermutetes Verhalten? | Refactoring ändert unbeabsichtigt reales Verhalten |
| Schrittgröße | ist jeder Schritt einzeln reversibel? | großer Schritt lässt sich bei Problemen nicht mehr sauber zurückrollen |
| Betriebsfähigkeit | bleibt das System während jedes Zwischenzustands funktionsfähig? | Zwischenzustand ist selbst nicht deploybar/lauffähig |
| Beobachtung | wird nach jedem Schritt das reale Verhalten geprüft? | Fehler wird erst spät bemerkt, wenn mehrere Schritte kombiniert wurden |

Implementierung: vor jedem Architekturrefactoring wird zunächst das reale Verhalten des betroffenen Bereichs über Charakterisierungstests eingefangen — auch wenn das Verhalten selbst fragwürdig oder unbeabsichtigt erscheint, wird es zunächst dokumentiert, nicht sofort „korrigiert". Der Umbau wird dann in möglichst kleine, unabhängig deploybare und reversible Schritte zerlegt, jeder Schritt wird beobachtet, bevor der nächste beginnt. Ein Schritt, der das System in einen nicht funktionsfähigen Zwischenzustand versetzen würde, wird weiter zerlegt.

## Scalability, Reliability, Security und Observability

Diese Methodik skaliert für beliebig große Umbauten, solange jeder Einzelschritt klein genug bleibt, um reversibel und beobachtbar zu sein — die Gesamtdauer eines großen Umbaus kann dadurch länger werden, aber das Risiko pro Schritt bleibt gering. Reliability-Grenze: ein „Big Bang"-Umbau ohne Zwischenschritte hat ein deutlich höheres Ausfallrisiko, weil ein einzelner Fehler das gesamte Refactoring gleichzeitig betrifft und ein Rollback den kompletten, oft sehr großen Änderungssatz zurücknehmen müsste.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Refactoring führt zu unerwarteter Verhaltensänderung | fehlender Charakterisierungstest vor dem Umbau | prüfen, ob das reale Vorverhalten überhaupt dokumentiert/getestet wurde |
| Rollback eines fehlgeschlagenen Umbaus ist sehr aufwendig | Schritt war zu groß, nicht unabhängig reversibel | Schrittgröße gegen tatsächlichen Änderungsumfang bewerten |
| Fehler wird erst nach mehreren kombinierten Schritten bemerkt | fehlende Beobachtung nach jedem Einzelschritt | Deployment-/Beobachtungsfrequenz während des Umbaus prüfen |
| Zwischenzustand des Systems ist nicht funktionsfähig | Schritt zu groß gewählt, keine lauffähige Zwischenstufe geplant | prüfen, ob jeder Zwischenzustand tatsächlich deploybar wäre |

Security: bei Refactorings sicherheitsrelevanter Bereiche (Authentifizierung, Autorisierung) sind Charakterisierungstests besonders wichtig, um sicherzustellen, dass keine unbeabsichtigte Sicherheitslücke durch eine Verhaltensänderung entsteht. Observability: Monitoring nach jedem einzelnen Refactoring-Schritt ist Pflicht, nicht optional, um Verhaltensänderungen früh zu erkennen, bevor mehrere Schritte kombiniert wurden.

## Trade-offs und Entscheidungen

**Staff** schreibt Charakterisierungstests vor jedem strukturellen Umbau eines unklaren Legacy-Bereichs. **Principal** verlangt, dass jeder Refactoring-Schritt einzeln reversibel und deploybar ist, statt große, kombinierte Änderungssätze zu akzeptieren. **Chief** bevorzugt schrittweise, reversible Refactoring-Strategien gegenüber riskanten Komplettumbauten als organisatorischen Standard.

Anti-Patterns: ein „Big Bang"-Refactoring ohne Zwischenschritte und ohne Charakterisierungstests durchführen; Refactoring-Schritte so groß wählen, dass sie nicht mehr einzeln reversibel sind; keine Beobachtung nach einzelnen Schritten, nur am Ende des gesamten Umbaus.

## Production Checklist

- [ ] Charakterisierungstests erfassen tatsächliches Verhalten vor Beginn des Refactorings.
- [ ] Jeder Refactoring-Schritt ist einzeln reversibel und unabhängig deploybar.
- [ ] System bleibt in jedem Zwischenzustand funktionsfähig.
- [ ] Beobachtung/Monitoring nach jedem einzelnen Schritt, nicht nur am Ende.

## Interviewfragen

### 1. Was ist ein Charakterisierungstest und wie unterscheidet er sich von einem normalen Unit-Test?

**Antwort:** Ein Charakterisierungstest erfasst das tatsächliche, reale Verhalten von bestehendem Code als Sicherheitsnetz vor einem Umbau, statt zu prüfen, ob der Code ein gewünschtes Verhalten korrekt umsetzt.

### 2. Warum ist ein „Big Bang"-Architekturumbau riskanter als ein schrittweiser?

**Antwort:** Ein einzelner Fehler betrifft den gesamten, oft sehr großen Änderungssatz gleichzeitig, und ein Rollback müsste alles auf einmal zurücknehmen, statt nur einen kleinen, einzelnen Schritt.

### 3. Was bedeutet „jeder Schritt ist reversibel"?

**Antwort:** Jeder einzelne Zwischenschritt des Umbaus kann bei Problemen isoliert zurückgerollt werden, ohne die vorherigen oder nachfolgenden Schritte zu beeinträchtigen.

### 4. Warum muss das System in jedem Zwischenzustand funktionsfähig bleiben?

**Antwort:** Weil ein mehrstufiger Umbau sich über Zeit erstreckt, während der das System weiterhin produktiv laufen und deploybar sein muss — kein Zwischenschritt darf einen nicht lauffähigen Zustand hinterlassen.

### 5. Wann würdest du einen Charakterisierungstest schreiben, obwohl das beschriebene Verhalten fragwürdig erscheint?

**Antwort:** Immer vor einem Umbau — das Ziel ist zunächst, das reale Verhalten festzuhalten, nicht es sofort zu bewerten oder zu korrigieren; eine bewusste Verhaltensänderung ist eine separate, explizite Entscheidung.

### 6. Widersprüchliche Anforderung: Management will einen großen Architekturumbau schnell abgeschlossen sehen UND null Risiko für den laufenden Betrieb — wie gehst du vor?

**Antwort:** Ich würde erklären, dass Geschwindigkeit und Risikofreiheit bei einem großen Umbau nur durch viele kleine, schnell aufeinanderfolgende, aber einzeln sichere Schritte vereinbar sind, nicht durch einen einzigen großen Sprung; die Gesamtdauer kann ähnlich sein, aber mit deutlich geringerem Ausfallrisiko pro Schritt.

## Praktische Labs

~~~python
def legacy_calculate(x):
    return x * 2 + 1  # actual behavior, possibly unintended, captured as-is

def characterization_test():
    assert legacy_calculate(5) == 11  # captures REAL behavior, not "should be"

characterization_test()

def refactored_calculate(x):  # refactored step
    return (x * 2) + 1  # equivalent structure, same real behavior preserved

assert refactored_calculate(5) == legacy_calculate(5)
print("Refactored step preserved the exact previously characterized behavior.")
~~~

## Dependencies, Cross-References und Quellen

1. Feathers: [Working Effectively with Legacy Code](https://www.oreilly.com/library/view/working-effectively-with/0131177052/), Prentice Hall 2004, abgerufen 2026-09-17.

Diese Methodik ist zeitstabil; konkrete Refactoring-Automatisierungs-Tool-Details sollten dennoch gegen aktuelle Dokumentation geprüft werden.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Codemod-Tools für großflächige, mechanische Refactoring-Schritte | Established | Generierte Änderungen weiterhin gegen Charakterisierungstests validieren. |
| KI-gestützte Vorschläge für Refactoring-Schrittfolgen | Emerging | Vorschläge immer auf Reversibilität und Zwischenzustand-Funktionsfähigkeit prüfen, nie blind übernehmen. |

Diese Methodik ist ein etabliertes, stabiles Vorgehen; der Bonus betrifft primär Automatisierungs-Tooling, das die manuelle Schrittdisziplin unterstützt, nicht ersetzt.
