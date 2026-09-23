---
{"id": "KB-0142", "title": "Architecture Fitness Functions", "domain": "06", "sequence": 14, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0135", "concepts": ["Schichtenarchitektur"], "needed_for": "understanding"}, {"id": "KB-0127", "concepts": ["Operationalisierte Anforderungen"], "needed_for": "both"}], "related": ["KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine ausführbare Fitness Function für eine Abhängigkeitsregel lokal implementieren und einen Verstoß erkennen.", "rationale": "Kein reales CI-System nötig, um das Prinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Architekturziele (Abhängigkeitsregeln, Latenzgrenzen, Datenhoheit) in ausführbare, automatisierte Prüfungen übersetzen.", "rationale": "Ungeprüfte Architekturziele erodieren unbemerkt über Zeit."}, "STAFF-TARGET": {"active": true, "scope": "Eine schleichende Architekturerosion (z. B. neue verbotene Abhängigkeit) durch eine fehlgeschlagene Fitness Function erkennen.", "rationale": "Das ist der eigentliche Zweck von Fitness Functions: kontinuierliche, automatisierte Überwachung statt punktueller Reviews."}, "CHIEF-TARGET": {"active": true, "scope": "Fitness Functions als Pflichtbestandteil der CI-Pipeline für Systeme mit definierten Architekturzielen verlangen.", "rationale": "Ohne automatisierte Durchsetzung bleiben Architekturziele unverbindliche Empfehlungen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Komplexe, kontinuierliche Fitness Functions (z. B. Latenz-Trend-Überwachung) sind Vertiefung.", "rationale": "Kern ist das Prinzip: Architekturziel wird zu ausführbarer, automatisierter Prüfung."}}, "lab_validation": [{"lab_id": "KB-0142-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für eine Abhängigkeitsregel-Fitness-Function", "evidence": "Ein simuliertes verbotenes Import zwischen zwei Modulen wird von der Fitness Function automatisch erkannt und als Verstoß gemeldet.", "limitations": "Kein reales CI-System, keine Produktion."}]}
---
# Architecture Fitness Functions

> **Ziel:** Eine Fitness Function übersetzt ein Architekturziel (z. B. „Modul A darf nie Modul B importieren", „diese API-Antwort muss unter 200ms bleiben") in eine ausführbare, automatisierte Prüfung, die kontinuierlich in CI läuft. Ohne sie bleiben Architekturziele Absichtserklärungen, die über Zeit unbemerkt erodieren.

## Zweck, Mental Model und Dependencies

Ein Architektur-Review, das einmalig Regeln festlegt (z. B. „keine Durchgriffe zwischen Schichten", siehe [KB-0135](07-schichtenarchitektur-und-durchgriffe.md)), schützt nicht davor, dass diese Regeln Wochen später unbemerkt verletzt werden — jede neue Codeänderung ist ein potenzieller Verstoß, den niemand manuell bei jedem Commit prüft. Eine Fitness Function macht die Regel zu einem automatisierten Test, der bei jedem Build läuft und bei Verstoß fehlschlägt — dieselbe Disziplin wie operationalisierte nichtfunktionale Anforderungen ([KB-0127](../05-distributed-systems/27-nichtfunktionale-anforderungen-operationalisieren.md)), aber kontinuierlich statt einmalig geprüft. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0135](07-schichtenarchitektur-und-durchgriffe.md) und [KB-0127](../05-distributed-systems/27-nichtfunktionale-anforderungen-operationalisieren.md).

~~~text
Architecture goal: "Domain module must never import Infrastructure module"
Fitness function:  scan imports of domain/* -> assert none reference infrastructure/* -> fail build if violated
Runs on every commit/PR, not just at review time.
~~~

## Core Concepts, Architektur und Implementierung

| Kategorie | Beispiel | Prüfmethode |
|---|---|---|
| Strukturell | verbotene Abhängigkeiten zwischen Modulen | statische Codeanalyse (Import-/Package-Scan) |
| Latenz/Performance | API-Antwortzeit unter Schwellenwert | automatisierter Lasttest gegen Metrikschwelle |
| Datenhoheit | ein Modul greift nicht auf fremde Datenbanktabellen zu | Datenbankzugriffs-Scan oder Laufzeit-Monitoring |
| Sicherheit | keine Hartcodierung von Secrets im Code | statische Analyse/Secret-Scanning |

Implementierung: für jedes wesentliche Architekturziel wird geprüft, ob es sich als ausführbarer Test formulieren lässt — statische Prüfungen (Abhängigkeitsregeln) laufen in CI bei jedem Commit, dynamische Prüfungen (Latenz, Datenhoheit zur Laufzeit) laufen als periodische oder Deployment-gekoppelte Checks. Fitness Functions werden als „atomar" (eine klare Regel, ein klares Bestehen/Scheitern) und „automatisiert" (kein manueller Schritt) gestaltet, damit sie tatsächlich kontinuierlich laufen können.

## Scalability, Reliability, Security und Observability

Fitness Functions skalieren Architektur-Governance über große, wachsende Codebases und Teams, wo manuelle Reviews jede Änderung nicht mehr abdecken können. Reliability-Grenze: eine Fitness Function prüft nur, was explizit formuliert wurde — unformulierte Architekturziele bleiben weiterhin ungeschützt, und eine zu strenge oder falsch kalibrierte Fitness Function kann legitime Änderungen blockieren (false positive).

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Architekturregel wird trotz früherem Review-Konsens verletzt | keine automatisierte Fitness Function für diese Regel vorhanden | prüfen, ob die Regel überhaupt als ausführbarer Test existiert |
| CI blockiert legitime Änderung fälschlich | Fitness Function zu starr/falsch kalibriert | Regel gegen den konkreten, blockierten Anwendungsfall neu bewerten |
| Architekturerosion wird erst spät im Review entdeckt | Fitness Function existiert, läuft aber nicht bei jedem Commit | CI-Pipeline-Konfiguration auf tatsächliche Ausführungshäufigkeit prüfen |
| Latenz-Fitness-Function schlägt sporadisch fehl | Testumgebung/Last nicht repräsentativ für reale Bedingungen | Testbedingungen gegen reale Produktionslast vergleichen |

Security: sicherheitsrelevante Fitness Functions (z. B. Secret-Scanning, verbotene unverschlüsselte Verbindungen) sind ein wirksames, automatisiertes Sicherheits-Gate, das nicht von individueller Reviewer-Aufmerksamkeit abhängt. Observability: der Verlauf von Fitness-Function-Ergebnissen über Zeit zeigt Trends (z. B. schleichend steigende Latenz), nicht nur binäre Bestehen/Scheitern-Momentaufnahmen.

## Trade-offs und Entscheidungen

**Staff** formuliert Architekturregeln aus Reviews aktiv als Fitness Functions, statt sie nur zu dokumentieren. **Principal** priorisiert, welche Architekturziele automatisiert geprüft werden (typisch: die häufig verletzten, kritischen Regeln zuerst). **Chief** verlangt Fitness Functions als Pflichtbestandteil der CI-Pipeline für Systeme mit definierten, kritischen Architekturzielen.

Anti-Patterns: Architekturregeln nur dokumentieren, ohne sie automatisiert zu prüfen; Fitness Functions so streng kalibrieren, dass sie häufig legitime Änderungen blockieren, was zu ihrer Umgehung führt; Fitness Functions einmalig einführen und nie an veränderte Architekturziele anpassen.

## Production Checklist

- [ ] Kritische Architekturziele als ausführbare Fitness Functions formuliert.
- [ ] Fitness Functions laufen automatisiert bei jedem relevanten Commit/Deployment.
- [ ] Kalibrierung regelmäßig gegen false positives/negatives geprüft.
- [ ] Verlauf der Fitness-Function-Ergebnisse für Trendanalyse aufbewahrt.

## Interviewfragen

### 1. Was ist eine Architecture Fitness Function?

**Antwort:** Eine automatisierte, ausführbare Prüfung, die ein konkretes Architekturziel (z. B. eine Abhängigkeitsregel) kontinuierlich validiert, statt sich auf punktuelle manuelle Reviews zu verlassen.

### 2. Warum reicht ein einmaliges Architektur-Review nicht aus, um Architekturziele langfristig zu sichern?

**Antwort:** Jede neue Codeänderung nach dem Review kann die Regel unbemerkt verletzen; ohne kontinuierliche automatisierte Prüfung erodiert die Architektur schleichend über Zeit.

### 3. Nenne ein Beispiel für eine statische und eine dynamische Fitness Function.

**Antwort:** Statisch: ein Import-Scan, der verbotene Abhängigkeiten zwischen Modulen erkennt. Dynamisch: ein automatisierter Lasttest, der prüft, ob eine API-Antwortzeit unter einem Schwellenwert bleibt.

### 4. Was passiert, wenn eine Fitness Function zu streng kalibriert ist?

**Antwort:** Sie blockiert legitime Änderungen (false positives), was Teams dazu verleiten kann, die Prüfung zu umgehen oder zu deaktivieren, wodurch der eigentliche Schutzzweck verloren geht.

### 5. Wie hilft der Verlauf von Fitness-Function-Ergebnissen über Zeit?

**Antwort:** Er zeigt Trends wie schleichend steigende Latenz oder zunehmende Regelverstöße, die eine einzelne Momentaufnahme nicht sichtbar machen würde.

### 6. Widersprüchliche Anforderung: Team will strikte automatisierte Architekturdurchsetzung UND schnelle, unblockierte Entwicklungsgeschwindigkeit — wie gehst du vor?

**Antwort:** Ich würde Fitness Functions priorisiert für die wirklich kritischen, häufig verletzten Regeln einführen und sorgfältig kalibrieren, um false positives zu minimieren, statt jede denkbare Regel sofort als hartes CI-Gate zu erzwingen — Durchsetzungsstrenge sollte proportional zur tatsächlichen Kritikalität der Regel sein.

## Praktische Labs

~~~python
modules = {
    "domain/order.py": ["domain/base"],
    "infrastructure/db.py": ["domain/order"],  # allowed: infra depends on domain
    "domain/customer.py": ["infrastructure/db"],  # violation: domain depends on infra
}

def fitness_function_no_domain_to_infra_dependency(modules):
    violations = []
    for module, imports in modules.items():
        if module.startswith("domain/"):
            for imp in imports:
                if imp.startswith("infrastructure/"):
                    violations.append((module, imp))
    return violations

violations = fitness_function_no_domain_to_infra_dependency(modules)
assert len(violations) == 1
print("Fitness function correctly detected a domain-to-infrastructure dependency violation:", violations)
~~~

## Dependencies, Cross-References und Quellen

1. Ford, Parsons, Kua: [Building Evolutionary Architectures](https://www.oreilly.com/library/view/building-evolutionary-architectures/9781491986356/), O'Reilly 2017, abgerufen 2026-09-17.

Diese Methodik ist zeitstabil; konkrete statische-Analyse-Tool-Details sollten dennoch gegen aktuelle Dokumentation geprüft werden.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Dedizierte Fitness-Function-Frameworks (z. B. ArchUnit-artige Tools) für verschiedene Sprachen | Established | Regelabdeckung gegen tatsächliche Architekturziele des Systems prüfen. |
| KI-gestützte Vorschläge für Fitness Functions aus Architekturdokumenten | Emerging | Vorschläge immer gegen echte Architekturintention validieren, nie ungeprüft übernehmen. |

Ein Team akzeptiert Fitness Functions als Architektur-Governance-Werkzeug erst, wenn sie automatisiert in CI laufen und gegen bekannte reale Verstöße nachweislich funktionieren.
