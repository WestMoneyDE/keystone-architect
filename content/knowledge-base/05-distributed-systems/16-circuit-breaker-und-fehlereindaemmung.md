---
{"id": "KB-0116", "title": "Circuit Breaker und Fehlereindämmung", "domain": "05", "sequence": 16, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0114", "concepts": ["Retry"], "needed_for": "both"}, {"id": "KB-0115", "concepts": ["Timeout"], "needed_for": "both"}], "related": ["KB-0117", "KB-0562", "KB-0720"], "applies": ["KB-0117", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Circuit Breaker mit den drei Zuständen lokal implementieren und einen Fehlklassifikationsfall erzeugen.", "rationale": "Kein echter Dienst nötig, um das Zustandsmodell zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Schwellenwerte, Recovery-Probe-Strategie und Fehlerklassifikation für eine instabile Abhängigkeit entwerfen.", "rationale": "Falsch kalibrierte Schwellen erzeugen entweder zu späte oder zu häufige Abschaltungen."}, "STAFF-TARGET": {"active": true, "scope": "Eine fälschlich ausgelöste Abschaltung (false positive) von einem echten anhaltenden Ausfall unterscheiden.", "rationale": "Beide Fälle sehen im ersten Log-Blick ähnlich aus, erfordern aber unterschiedliche Reaktionen."}, "CHIEF-TARGET": {"active": true, "scope": "Circuit Breaker als Standardpflicht für Aufrufe instabiler externer/interner Abhängigkeiten festlegen.", "rationale": "Ohne Fehlereindämmung kann ein einzelner instabiler Dienst kaskadierende Ausfälle auslösen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Half-Open-Probe-Strategien mit adaptivem Sampling und Bulkhead-Kombination sind Vertiefung.", "rationale": "Kern ist das Drei-Zustands-Modell und korrekte Fehlerklassifikation."}}, "lab_validation": [{"lab_id": "KB-0116-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Circuit-Breaker-Zustandsübergänge", "evidence": "Nach Überschreiten der Fehlerschwelle öffnet der Breaker und blockiert weitere Aufrufe, bis eine Recovery-Probe im Half-Open-Zustand Erfolg meldet.", "limitations": "Kein realer Dienst, keine Produktion."}]}
---
# Circuit Breaker und Fehlereindämmung

> **Ziel:** Ein Circuit Breaker verhindert, dass wiederholte Aufrufe an eine bereits ausgefallene Abhängigkeit weiter Ressourcen binden und den eigenen Dienst mit hinunterziehen. Er kapselt das Wissen „diese Abhängigkeit ist gerade wahrscheinlich down“ als expliziten Zustand statt es bei jedem Aufruf neu über Timeout/Retry herauszufinden.

## Zweck, Mental Model und Dependencies

Ein Circuit Breaker hat drei Zustände: Closed (normale Aufrufe durchgelassen, Fehlerquote überwacht), Open (Aufrufe werden sofort ohne Versuch abgelehnt, nachdem eine Fehlerschwelle überschritten wurde) und Half-Open (nach einer Abkühlphase werden vereinzelt Testaufrufe durchgelassen, um zu prüfen, ob sich die Abhängigkeit erholt hat). Der entscheidende Unterschied zu reinem Timeout/Retry ([KB-0114](14-retries-und-wiederholungsstuerme.md), [KB-0115](15-timeouts-und-deadline-budgets.md)): ein offener Breaker vermeidet den Aufrufversuch komplett, statt jedes Mal erneut auf Timeout zu warten. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0114](14-retries-und-wiederholungsstuerme.md) und [KB-0115](15-timeouts-und-deadline-budgets.md).

~~~text
Closed --(error rate > threshold)--> Open --(cooldown elapsed)--> Half-Open
   ^                                                                  |
   +----------------(probe succeeds)----- (probe fails) --> Open -----+
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Fehlerschwelle | Fehlerrate/-anzahl in welchem Fenster löst Öffnen aus? | zu niedrig: false positives; zu hoch: zu späte Reaktion |
| Cooldown | wie lange bleibt der Breaker offen vor erstem Probe? | zu kurz: wiederholte fehlgeschlagene Probes; zu lang: verzögerte Recovery |
| Half-Open-Probe | wie viele Testaufrufe, welches Erfolgskriterium? | ein einzelner Erfolg reicht nicht als verlässlicher Recovery-Beweis |
| Fehlerklassifikation | zählt jeder Fehler (auch 4xx) gegen die Schwelle? | Klientfehler fälschlich als Abhängigkeitsausfall gewertet |

Implementierung: nur Fehler, die tatsächlich auf Instabilität der Abhängigkeit hindeuten (Timeouts, 5xx, Verbindungsfehler), zählen gegen die Öffnungsschwelle — Klientfehler (4xx) nicht. Half-Open sollte mehrere Testaufrufe mit einer Erfolgsschwelle statt eines einzelnen Aufrufs verlangen, um Flackern zwischen Zuständen zu vermeiden. Jeder Circuit Breaker ist pro Abhängigkeit (nicht global) zu führen, damit der Ausfall einer Abhängigkeit nicht Aufrufe an andere, gesunde Abhängigkeiten blockiert.

## Scalability, Reliability, Security und Observability

Circuit Breaker reduzieren Last auf eine bereits ausgefallene Abhängigkeit und schützen den eigenen Dienst vor Ressourcenerschöpfung durch aufgestaute wartende Aufrufe. Reliability-Grenze: ein zu aggressiv kalibrierter Breaker kann bei kurzzeitigen, tolerierbaren Latenzspitzen fälschlich öffnen (false positive) und dadurch selbst Verfügbarkeit reduzieren, die eigentlich noch gegeben war.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Breaker öffnet bei kurzen, harmlosen Latenzspitzen | Schwelle zu niedrig/Fenster zu kurz kalibriert | Fehlerrate im Öffnungsfenster gegen normale Baseline-Varianz vergleichen |
| Breaker bleibt lange offen trotz erholter Abhängigkeit | Cooldown zu lang oder Half-Open-Kriterium zu streng | Zeitpunkt der tatsächlichen Erholung gegen Cooldown-Ende vergleichen |
| ein Dienst blockiert Aufrufe an gesunde Abhängigkeit | ein globaler statt abhängigkeitsspezifischer Breaker | prüfen, ob Breaker-Zustand pro Abhängigkeit getrennt geführt wird |
| Fehlerquote steigt, Breaker öffnet nicht | Klientfehler verdünnen die gemessene Fehlerrate der echten Instabilität | Fehlerklassifikation (5xx/Timeout vs. 4xx) im Zähler prüfen |

Security: ein offener Circuit Breaker kann als Denial-of-Service-Schutzmechanismus wirken, indem er verhindert, dass ein Angriff auf eine Abhängigkeit über Kaskadeneffekte den gesamten Dienst destabilisiert. Observability korreliert Breaker-Zustand pro Abhängigkeit, Fehlerrate im Beobachtungsfenster und Anzahl/Erfolg der Half-Open-Probes.

## Trade-offs und Entscheidungen

**Staff** kalibriert Schwellen anhand gemessener Baseline-Fehlerraten der konkreten Abhängigkeit statt pauschaler Standardwerte. **Principal** definiert Standard-Circuit-Breaker-Konfiguration pro Abhängigkeitsklasse (extern/instabil vs. intern/stabil). **Chief** verlangt Circuit Breaker als Pflichtmuster für alle Aufrufe an bekannt instabile oder externe Abhängigkeiten.

Anti-Patterns: ein globaler Circuit Breaker für alle Abhängigkeiten statt pro Abhängigkeit; Klientfehler in die Öffnungsschwelle einrechnen; Half-Open mit nur einem Testaufruf ohne Erfolgsschwelle; Schwellenwerte ohne Bezug zur realen Baseline-Fehlerrate raten.

## Production Checklist

- [ ] Circuit Breaker pro Abhängigkeit, nicht global, konfiguriert.
- [ ] Fehlerschwelle anhand gemessener Baseline-Fehlerrate kalibriert.
- [ ] Half-Open-Erfolgskriterium verlangt mehrere erfolgreiche Probes, nicht nur eine.
- [ ] Fehlerklassifikation trennt Abhängigkeitsfehler von Klientfehlern.

## Interviewfragen

### 1. Warum reicht Retry allein nicht bei einer anhaltend ausgefallenen Abhängigkeit?

**Antwort:** Retry versucht bei jedem Aufruf erneut und verschwendet dabei weiter Ressourcen auf eine bekanntermaßen fehlgeschlagene Abhängigkeit; ein Circuit Breaker vermeidet den Versuch komplett, solange der Zustand offen ist.

### 2. Was passiert im Half-Open-Zustand?

**Antwort:** Der Breaker lässt eine begrenzte Anzahl Testaufrufe durch, um zu prüfen, ob sich die Abhängigkeit erholt hat, bevor er vollständig in den Closed-Zustand zurückkehrt.

### 3. Warum sollten Klientfehler (4xx) nicht in die Öffnungsschwelle eingerechnet werden?

**Antwort:** Sie zeigen ein Problem mit der Anfrage selbst, nicht mit der Verfügbarkeit der Abhängigkeit; würden sie mitgezählt, könnte der Breaker fälschlich öffnen, obwohl die Abhängigkeit gesund ist.

### 4. Warum sollte jede Abhängigkeit ihren eigenen Circuit Breaker haben?

**Antwort:** Ein globaler Breaker würde bei Ausfall einer Abhängigkeit auch Aufrufe an andere, gesunde Abhängigkeiten blockieren, was unnötig Verfügbarkeit kostet.

### 5. Wie kalibrierst du eine sinnvolle Öffnungsschwelle?

**Antwort:** Anhand der gemessenen normalen Fehlerrate/-varianz der konkreten Abhängigkeit, nicht anhand eines pauschalen Standardwerts, um false positives zu vermeiden.

### 6. Widersprüchliche Anforderung: Produkt will sofortige Fehlererkennung UND keine false-positive-Abschaltungen bei kurzen Latenzspitzen — wie gehst du vor?

**Antwort:** Ich würde ein ausreichend großes Beobachtungsfenster mit mehreren Datenpunkten statt Einzelfehler-Triggern verwenden und die Schwelle anhand gemessener normaler Varianz kalibrieren, um echte anhaltende Instabilität von kurzen, tolerierbaren Ausreißern zu unterscheiden.

## Praktische Labs

~~~python
class CircuitBreaker:
    def __init__(self, threshold=3):
        self.failures = 0
        self.threshold = threshold
        self.state = "closed"

    def call(self, succeeds):
        if self.state == "open":
            return "rejected: circuit open"
        if succeeds:
            self.failures = 0
            return "ok"
        self.failures += 1
        if self.failures >= self.threshold:
            self.state = "open"
        return "failed"

cb = CircuitBreaker(threshold=3)
for _ in range(3):
    cb.call(succeeds=False)
assert cb.state == "open"
assert cb.call(succeeds=True) == "rejected: circuit open"
print("Breaker opened after threshold failures and now rejects calls without attempting them.")
~~~

## Dependencies, Cross-References und Quellen

1. Nygard: [Release It! - Stability Patterns (Circuit Breaker)](https://pragprog.com/titles/mnee2/release-it-second-edition/), Pragmatic Bookshelf 2018, abgerufen 2026-09-17 (als etablierte Referenz für das Muster).

Produktspezifische Circuit-Breaker-Bibliotheksdefaults vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Adaptive, statistisch kalibrierte Schwellenwerte statt fixer Zahlen | Adopting | Stabilität und Erklärbarkeit gegenüber festen Schwellen vor Einsatz vergleichen. |
| Circuit Breaker als Service-Mesh-Feature statt Anwendungscode | Established | Konsistenz der Konfiguration über Mesh und Anwendungslogik prüfen. |

Ein Team akzeptiert eine Circuit-Breaker-Implementierung erst, wenn Schwellenkalibrierung, Fehlerklassifikation und Half-Open-Recovery-Verhalten unter simuliertem Ausfall getestet sind.
