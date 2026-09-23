---
{"id": "KB-0112", "title": "Zustandsautomaten und Invarianten", "domain": "05", "sequence": 12, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0108", "concepts": ["Transaktion", "Zustand"], "needed_for": "understanding"}], "related": ["KB-0113", "KB-0562", "KB-0720"], "applies": ["KB-0113", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Zustandsautomaten mit Guards implementieren und einen illegalen Übergang lokal abfangen.", "rationale": "Kein externes System nötig, um das Prinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Für einen Geschäftsprozess explizite Zustände, Übergänge und Guards statt impliziter Statusfelder entwerfen.", "rationale": "Implizite Zustandslogik (verstreute if-Bedingungen) erzeugt unsichtbare illegale Übergänge."}, "STAFF-TARGET": {"active": true, "scope": "Einen aufgetretenen illegalen Zustandsübergang im Produktionslog auf eine fehlende Guard-Bedingung zurückführen.", "rationale": "Solche Bugs sind oft schwer reproduzierbar, wenn Zustand nicht explizit modelliert ist."}, "CHIEF-TARGET": {"active": true, "scope": "Explizite Zustandsmodellierung als Standard für kritische Geschäftsprozesse mit vielen Zuständen verlangen.", "rationale": "Implizite Zustandslogik ist eine wiederkehrende Fehlerquelle in kritischen Workflows."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Statecharts (hierarchische Zustände), formale Modellprüfung und Workflow-Engines sind Vertiefung.", "rationale": "Kern ist explizite Zustände/Übergänge/Guards statt verstreuter Bedingungslogik."}}, "lab_validation": [{"lab_id": "KB-0112-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell eines Bestellzustandsautomaten", "evidence": "Ein Übergang von 'shipped' zurück zu 'paid' wird von der Guard-Logik abgelehnt, weil er nicht in der erlaubten Übergangstabelle steht.", "limitations": "Kein reales Workflow-System, keine Produktion."}]}
---
# Zustandsautomaten und Invarianten

> **Ziel:** Ein expliziter Zustandsautomat modelliert Zustände, erlaubte Übergänge und Guard-Bedingungen als eigenständige, prüfbare Struktur — statt Zustand implizit über verstreute Statusfelder und if-Bedingungen im Code zu verwalten. Das macht illegale Übergänge strukturell unmöglich statt nur hoffentlich verhindert.

## Zweck, Mental Model und Dependencies

Ein Zustandsautomat besteht aus Zuständen, einer Übergangstabelle (welcher Zustand darf in welchen anderen wechseln) und Guards (zusätzliche Bedingungen, die erfüllt sein müssen, damit ein an sich erlaubter Übergang tatsächlich ausgeführt wird). Der entscheidende Unterschied zu impliziter Zustandslogik: die Menge der erlaubten Übergänge ist explizit und an einer Stelle geprüft, statt über mehrere Codepfade verstreut, wo ein vergessener Check einen illegalen Übergang durchlässt. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0108](08-verteilte-transaktionen.md).

~~~text
states: created -> paid -> shipped -> delivered
                 -> cancelled (from created or paid, not from shipped)
transition(shipped, "cancel") -> REJECTED: not in allowed transition table
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Zustandsmenge | vollständig und überschneidungsfrei definiert? | undefinierter Zwischenzustand wird stillschweigend akzeptiert |
| Übergangstabelle | jeder erlaubte Übergang explizit gelistet? | „Standardmäßig erlaubt“ statt „Standardmäßig verboten“ öffnet Lücken |
| Guard | zusätzliche Bedingung (z. B. Zahlung bestätigt) geprüft vor Übergang? | Übergang technisch erlaubt, fachlich aber verfrüht |
| deterministisch vs. probabilistisch | harte Prozesslogik von KI-Auswahl getrennt? | ein LLM „entscheidet“ direkt über einen kritischen Zustandsübergang ohne deterministischen Guard |

Implementierung: Übergangstabelle als „Default verboten, explizit erlaubt“ definieren, nicht umgekehrt. Guards als separate, testbare Funktionen implementieren, die vor jedem Übergang geprüft werden, unabhängig davon, von wo der Übergang ausgelöst wird (API, Batch-Job, Event). Bei KI-gestützten Systemen: ein Modell darf einen Übergang vorschlagen, aber die tatsächliche Ausführung bleibt an eine deterministisch geprüfte Guard-Bedingung gebunden — eine höhere Modell-Temperatur oder ein überzeugend klingender Vorschlag ersetzt keine Berechtigungs-/Zustandsprüfung.

## Scalability, Reliability, Security und Observability

Ein expliziter Zustandsautomat skaliert gut über wachsende Prozesskomplexität, weil neue Zustände/Übergänge an einer zentralen Stelle ergänzt werden, statt verstreute Bedingungen im gesamten Code zu suchen. Reliability-Grenze: ein Zustandsautomat schützt nur vor Übergängen, die er kennt — ein fehlender Zustand für einen realen Edge Case (z. B. teilweise Rückerstattung) führt zu einem erzwungenen, fachlich falschen Workaround.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Bestellung in unerwartetem Zustand | fehlender oder nicht erzwungener Übergangscheck | Übergangshistorie gegen erlaubte Tabelle prüfen |
| Übergang technisch erfolgreich, fachlich falsch | fehlende Guard-Bedingung | Guard-Funktion für diesen konkreten Übergang auf Vollständigkeit prüfen |
| gleicher Bug an mehreren Stellen im Code | Zustandslogik dupliziert statt zentralisiert | Anzahl der Stellen zählen, die Zustandsübergänge auslösen |
| KI-Agent löst unerwünschten kritischen Übergang aus | fehlende deterministische Guard zwischen Vorschlag und Ausführung | prüfen, ob Ausführung unabhängig vom Modell validiert wird |

Security: Zustandsübergänge mit Berechtigungsrelevanz (z. B. „genehmigt“, „storniert“) müssen ihre Guard-Prüfung serverseitig und unabhängig vom aufrufenden Client durchführen. Observability korreliert Entität-ID, Ausgangszustand, versuchten Übergang, Guard-Ergebnis und tatsächlichen Zielzustand.

## Trade-offs und Entscheidungen

**Staff** modelliert bei wiederkehrenden „unmöglicher Zustand“-Bugs den Prozess explizit als Automat, statt weitere if-Bedingungen hinzuzufügen. **Principal** definiert, ab welcher Prozesskomplexität (Anzahl Zustände/Übergänge) explizite Modellierung verpflichtend ist. **Chief** verlangt für kritische Geschäftsprozesse (Zahlung, Genehmigung, Vertragsstatus) explizite Zustandsmodellierung als Architekturstandard.

Anti-Patterns: Zustand als freies String-/Enum-Feld ohne erzwungene Übergangstabelle; Guards nur im UI statt serverseitig; „Default erlaubt“ statt „Default verboten“ bei der Übergangsdefinition; ein KI-Modell direkt einen kritischen Zustandsübergang ausführen lassen ohne deterministische Nachprüfung.

## Production Checklist

- [ ] Zustandsmenge vollständig definiert, inklusive Edge Cases (z. B. Teilstornierung).
- [ ] Übergangstabelle nach „Default verboten“-Prinzip implementiert.
- [ ] Guards serverseitig und unabhängig vom Aufrufer geprüft.
- [ ] Bei KI-beteiligten Prozessen: deterministische Guard zwischen Modellvorschlag und Ausführung nachgewiesen.

## Interviewfragen

### 1. Warum ist ein expliziter Zustandsautomat besser als verstreute if-Bedingungen?

**Antwort:** Weil die Menge erlaubter Übergänge an einer zentralen, prüfbaren Stelle definiert ist, statt sich auf konsistente Prüfung an jeder einzelnen Codestelle zu verlassen, wo ein vergessener Check einen illegalen Übergang zulässt.

### 2. Was ist ein Guard und warum reicht die Übergangstabelle allein nicht?

**Antwort:** Ein Guard ist eine zusätzliche fachliche Bedingung, die erfüllt sein muss, damit ein technisch erlaubter Übergang tatsächlich ausgeführt wird — z. B. darf „bezahlt zu versendet“ erlaubt sein, aber nur wenn die Zahlung tatsächlich bestätigt ist.

### 3. Warum sollte die Übergangstabelle „Default verboten“ statt „Default erlaubt“ sein?

**Antwort:** Weil ein vergessener, nicht explizit verbotener Übergang sonst stillschweigend zugelassen wird; „Default verboten“ zwingt dazu, jeden gültigen Übergang bewusst zu definieren.

### 4. Wie trennst du deterministische Prozesslogik von KI-gestützter Auswahl?

**Antwort:** Ein Modell darf einen Übergang vorschlagen, aber die tatsächliche Ausführung bleibt an eine unabhängig geprüfte, deterministische Guard-Bedingung gebunden, die nicht durch Modellüberzeugung oder Temperatur beeinflusst wird.

### 5. Wie diagnostizierst du einen „unmöglichen“ Zustand in Produktion?

**Antwort:** Über die Übergangshistorie der betroffenen Entität, verglichen mit der definierten Übergangstabelle, um die Stelle zu finden, an der ein nicht erlaubter oder nicht geguardeter Übergang stattfand.

### 6. Widersprüchliche Anforderung: Produkt will maximale Flexibilität für Sonderfälle UND garantiert keine illegalen Zustände — wie gehst du vor?

**Antwort:** Ich würde jeden bekannten Sonderfall als expliziten, definierten Zustand/Übergang mit eigener Guard-Bedingung modellieren, statt eine generische „Freitext“-Ausnahme zuzulassen; unbekannte neue Sonderfälle würden einen bewussten Erweiterungsprozess der Zustandsdefinition auslösen, keine stille Umgehung.

## Praktische Labs

~~~python
transitions = {
    ("created", "pay"): "paid",
    ("paid", "ship"): "shipped",
    ("shipped", "deliver"): "delivered",
    ("created", "cancel"): "cancelled",
    ("paid", "cancel"): "cancelled",
}

def transition(state, action):
    key = (state, action)
    if key not in transitions:
        raise ValueError(f"illegal transition: {state} -> {action}")
    return transitions[key]

assert transition("paid", "ship") == "shipped"
try:
    transition("shipped", "cancel")
    raise AssertionError("expected rejection")
except ValueError as e:
    print("Illegal transition correctly rejected:", e)
~~~

## Dependencies, Cross-References und Quellen

1. Harel: [Statecharts: A Visual Formalism for Complex Systems](https://www.sciencedirect.com/science/article/pii/0167642387900359), Science of Computer Programming 1987, abgerufen 2026-09-17.

Produktspezifische Workflow-Engine-Details vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Deklarative Workflow-/State-Machine-Engines als verwalteter Dienst | Established | Guard-Ausdruckskraft und Testbarkeit vor Vertrauen prüfen. |
| LLM-vorgeschlagene Übergänge mit nachgelagerter deterministischer Validierung | Adopting | Sicherstellen, dass Ausführung nie allein vom Modellvorschlag abhängt. |

Ein Team akzeptiert eine Zustandsautomaten-Implementierung erst, wenn Vollständigkeit der Zustandsmenge, Default-verboten-Übergangstabelle und serverseitige Guard-Prüfung nachgewiesen sind.
