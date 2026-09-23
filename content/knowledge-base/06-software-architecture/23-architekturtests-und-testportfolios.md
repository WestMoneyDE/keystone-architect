---
{"id": "KB-0151", "title": "Architekturtests und Testportfolios", "domain": "06", "sequence": 23, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0142", "concepts": ["Fitness Functions"], "needed_for": "both"}], "related": ["KB-0152", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Property-Test und einen Mutation-Test lokal implementieren und zeigen, welche Fehlerklasse jeder aufdeckt.", "rationale": "Kein reales Projekt nötig, um die Testarten zu vergleichen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein Testportfolio zusammenstellen, das unterschiedliche Testarten gezielt für unterschiedliche Fehlerklassen einsetzt.", "rationale": "Kein einzelner Testtyp deckt alle relevanten Fehlerklassen ab."}, "STAFF-TARGET": {"active": true, "scope": "Erklären, warum eine hohe Testabdeckung trotzdem einen bestimmten Fehler nicht gefunden hat.", "rationale": "Abdeckung allein sagt nichts über die Qualität der Prüfung selbst aus."}, "CHIEF-TARGET": {"active": true, "scope": "Testportfolio-Diversität als Qualitätsstandard einfordern statt sich auf eine einzelne Testmetrik zu verlassen.", "rationale": "Eine einzelne Metrik wie Codeabdeckung kann falsches Vertrauen erzeugen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Mutation-Testing-Tools und ihre Performance-Kosten im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis, welche Testart welche Fehlerklasse aufdeckt und welche nicht."}}, "lab_validation": [{"lab_id": "KB-0151-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Property-Test versus Beispiel-basierten Test", "evidence": "Ein Beispiel-basierter Test mit festen Eingaben übersieht einen Edge Case, den ein Property-Test mit generierten Eingaben aufdeckt.", "limitations": "Kein reales Projekt, rein methodische Übung."}]}
---
# Architekturtests und Testportfolios

> **Ziel:** Kein einzelner Testtyp deckt alle relevanten Fehlerklassen ab. Property-Tests, Contract-Tests, Mutation-Tests und Strukturtests (Fitness Functions, [KB-0142](14-architecture-fitness-functions.md)) prüfen jeweils unterschiedliche Invarianten — ein durchdachtes Testportfolio kombiniert sie gezielt, statt sich auf eine einzelne Metrik wie Codeabdeckung zu verlassen.

## Zweck, Mental Model und Dependencies

Ein Beispiel-basierter Unit-Test prüft konkrete, vom Entwickler gewählte Eingabe-/Ausgabe-Paare — er übersieht Edge Cases, an die niemand gedacht hat. Ein Property-Test generiert viele zufällige Eingaben und prüft eine allgemeine Eigenschaft („für jede sortierte Liste gilt: erstes Element ≤ letztes Element"), was Edge Cases systematisch findet, die Beispiel-Tests übersehen. Ein Contract-Test ([KB-0140](12-api-grenzen-und-fachliche-vertraege.md)) prüft, ob ein API-Vertrag eingehalten wird. Ein Mutation-Test prüft nicht den Code selbst, sondern die Qualität der Tests: er verändert den Code künstlich (mutiert ihn) und prüft, ob die Tests den Fehler erkennen — überlebt eine Mutation unbemerkt, zeigt das eine Testlücke. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0142](14-architecture-fitness-functions.md).

~~~text
Example test:   assert sort([3,1,2]) == [1,2,3]                    -- misses untested edge cases
Property test:  for random list L: assert sort(L)[0] <= sort(L)[-1] -- finds edge cases systematically
Mutation test:  flip a comparison operator in sort() -> do tests fail? if not, tests have a gap
Fitness function: assert no import from domain/ to infrastructure/  -- checks structure, not behavior
~~~

## Core Concepts, Architektur und Implementierung

| Testart | Prüft | Was sie NICHT findet |
|---|---|---|
| Beispiel-basiert | konkrete bekannte Fälle | unvorhergesehene Edge Cases |
| Property-basiert | allgemeine Invarianten über generierte Eingaben | fachlich falsche, aber „konsistente" Logik |
| Contract-Test | Einhaltung eines API-Vertrags | interne Implementierungsfehler innerhalb des Vertrags |
| Mutation-Test | Qualität/Aussagekraft der bestehenden Tests | fehlt komplett ungetesteter Code (keine Mutation ohne Test-Baseline) |
| Fitness Function (Strukturtest) | Architekturregeln (Abhängigkeiten, Latenz) | fachliche Korrektheit des geprüften Codes selbst |

Implementierung: ein Testportfolio wird bewusst aus mehreren Testarten zusammengestellt, jede für die Fehlerklasse, die sie am besten aufdeckt — nicht als Ersatz füreinander, sondern als Ergänzung. Codeabdeckung (welcher Prozentsatz Code wurde ausgeführt) wird nicht mit Testqualität verwechselt; ein Mutation-Test zeigt, ob die Abdeckung tatsächlich aussagekräftige Prüfungen enthält oder nur ausgeführten, aber ungeprüften Code.

## Scalability, Reliability, Security und Observability

Ein diverses Testportfolio skaliert Vertrauen in ein System besser als eine einzelne hohe Metrik, da unterschiedliche Testarten unterschiedliche, komplementäre Fehlerklassen abdecken. Reliability-Grenze: hohe Codeabdeckung allein ist keine verlässliche Qualitätsmetrik — Code kann zu 100% ausgeführt, aber mit schwachen Assertions „getestet" sein, was Mutation-Testing aufdeckt, reine Abdeckungsmessung aber nicht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Fehler in Produktion trotz hoher Testabdeckung | Tests ausgeführt, aber schwache/fehlende Assertions | Mutation-Test durchführen, um Testqualität statt nur Abdeckung zu prüfen |
| Edge Case in Produktion, der im Test nie vorkam | nur Beispiel-basierte Tests, keine Property-Tests | Property-Test für die betroffene Funktion nachträglich ergänzen |
| Client bricht nach API-Änderung, obwohl Unit-Tests grün waren | fehlender Contract-Test zwischen Producer und Consumer | Contract-Test-Abdeckung für die betroffene API prüfen |
| Architekturregel verletzt trotz umfangreicher funktionaler Tests | fehlende Fitness Function für diese strukturelle Regel | prüfen, ob überhaupt ein Strukturtest für diese Regel existiert |

Security: Mutation-Testing ist besonders wertvoll für sicherheitskritischen Code, da es aufdeckt, ob ein Test tatsächlich eine sicherheitsrelevante Bedingung prüft oder nur oberflächlich Code ausführt. Observability: der Trend der Mutation-Score (Anteil erkannter Mutationen) über Zeit zeigt, ob die tatsächliche Testqualität mit dem Code mitwächst oder zurückfällt.

## Trade-offs und Entscheidungen

**Staff** wählt für jede kritische Funktion bewusst die passende Testart(en) statt sich nur auf Beispiel-basierte Tests zu verlassen. **Principal** verlangt Mutation-Testing für sicherheits- oder geschäftskritischen Code, um Testqualität statt nur Abdeckung zu prüfen. **Chief** etabliert Testportfolio-Diversität als Qualitätsstandard, statt eine einzelne Metrik wie Codeabdeckung als alleinigen Erfolgsindikator zu verwenden.

Anti-Patterns: Codeabdeckung als alleinige Qualitätsmetrik verwenden; nur Beispiel-basierte Tests ohne Property-Tests für Funktionen mit komplexen Invarianten; API-Änderungen ohne Contract-Tests gegen tatsächliche Consumer-Erwartungen vornehmen.

## Production Checklist

- [ ] Testportfolio kombiniert bewusst mehrere Testarten für unterschiedliche Fehlerklassen.
- [ ] Mutation-Testing für sicherheits-/geschäftskritischen Code eingesetzt, nicht nur Codeabdeckung gemessen.
- [ ] Property-Tests für Funktionen mit klaren, allgemeinen Invarianten vorhanden.
- [ ] Contract-Tests für kritische API-Grenzen implementiert.

## Interviewfragen

### 1. Warum ist hohe Codeabdeckung keine verlässliche Qualitätsmetrik?

**Antwort:** Code kann vollständig ausgeführt werden, ohne dass die Tests aussagekräftige Assertions enthalten — die Abdeckung misst Ausführung, nicht Prüfungsqualität.

### 2. Was ist der Unterschied zwischen einem Beispiel-basierten und einem Property-Test?

**Antwort:** Ein Beispiel-basierter Test prüft konkrete, vom Entwickler gewählte Fälle; ein Property-Test generiert viele Eingaben und prüft eine allgemeine Eigenschaft, wodurch er systematisch Edge Cases findet, an die niemand explizit gedacht hat.

### 3. Was misst ein Mutation-Test tatsächlich?

**Antwort:** Nicht den Code selbst, sondern die Qualität der bestehenden Tests — indem der Code künstlich verändert wird und geprüft wird, ob die Tests diese Veränderung erkennen.

### 4. Warum reicht ein einzelner Testtyp nicht aus?

**Antwort:** Jede Testart deckt eine andere Fehlerklasse ab (Beispielfälle, allgemeine Invarianten, Vertragskonformität, Testqualität, Architekturstruktur) — kein einzelner Typ prüft alle relevanten Aspekte.

### 5. Wann ist ein Contract-Test besonders wichtig?

**Antwort:** Wenn ein Producer und ein Consumer unabhängig voneinander entwickelt werden und sichergestellt werden muss, dass Änderungen am Producer die tatsächlichen Erwartungen des Consumers nicht brechen.

### 6. Widersprüchliche Anforderung: Team will 100% Codeabdeckung UND begrenzte Zeit für Tests — wie gehst du vor?

**Antwort:** Ich würde erklären, dass 100% Abdeckung ohne Rücksicht auf Testqualität wenig Sicherheit bringt; ich würde stattdessen begrenzte Testzeit gezielt auf die kritischsten Funktionen mit den aussagekräftigsten Testarten (Property-/Mutation-Tests) statt auf reine Abdeckungsmaximierung über den gesamten Code lenken.

## Praktische Labs

~~~python
def buggy_max(a, b):
    return a if a > b else b  # looks correct

def example_test():
    assert buggy_max(3, 5) == 5  # passes, doesn't reveal the equal-case bug

def property_test():
    import random
    for _ in range(100):
        a, b = random.randint(-10, 10), random.randint(-10, 10)
        result = buggy_max(a, b)
        assert result == max(a, b)  # would still pass here, but demonstrates broader coverage

example_test()
property_test()
print("Property test exercised many more input combinations than the single example test.")
~~~

## Dependencies, Cross-References und Quellen

1. Claessen, Hughes: [QuickCheck: A Lightweight Tool for Random Testing of Haskell Programs](https://dl.acm.org/doi/10.1145/351240.351266), ICFP 2000, abgerufen 2026-09-17 (Ursprung des Property-Testing-Konzepts).
2. Jia, Harman: [An Analysis and Survey of the Development of Mutation Testing](https://www.researchgate.net/publication/224140648), IEEE Transactions on Software Engineering 2011, abgerufen 2026-09-17.

Konkrete Property-/Mutation-Testing-Tool-Details vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Mutation-Testing-Integration in Standard-CI-Pipelines | Adopting | Laufzeitkosten gegen tatsächlichen Qualitätsgewinn für das jeweilige System abwägen. |
| KI-gestützte Generierung von Property-Test-Invarianten aus Code | Emerging | Vorgeschlagene Invarianten immer fachlich validieren, nie ungeprüft übernehmen. |

Ein Team akzeptiert ein Testportfolio als ausreichend erst, wenn es mehrere komplementäre Testarten nachweisbar für die jeweils relevanten Fehlerklassen kombiniert.
