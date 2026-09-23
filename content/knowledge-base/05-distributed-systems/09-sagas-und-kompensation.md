---
{"id": "KB-0109", "title": "Sagas und Kompensation", "domain": "05", "sequence": 9, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0108", "concepts": ["Atomizität", "2PC"], "needed_for": "both"}], "related": ["KB-0113", "KB-0562", "KB-0720"], "applies": ["KB-0113", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine orchestrierte Saga mit Kompensationsschritt lokal simulieren und einen irreversiblen Schritt markieren.", "rationale": "Kein Message-Broker nötig, um das Kompensationsprinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Für einen Cross-Service-Geschäftsprozess Saga-Schritte, Kompensationen und irreversible Grenzen entwerfen.", "rationale": "Nicht jeder Schritt ist kompensierbar; das muss beim Design sichtbar sein."}, "STAFF-TARGET": {"active": true, "scope": "Eine fehlgeschlagene Kompensation diagnostizieren und den Fall für manuelle Klärung eskalieren.", "rationale": "Kompensation kann selbst fehlschlagen und braucht einen definierten Fallback."}, "CHIEF-TARGET": {"active": true, "scope": "Saga als Standardmuster für Cross-Service-Konsistenz gegenüber 2PC positionieren und Eskalationsprozesse für irreversible Fehler verlangen.", "rationale": "Ohne definierten Eskalationsprozess bleiben fehlgeschlagene Kompensationen unsichtbar liegen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Saga-Orchestrierungs-Frameworks und choreografierte Event-basierte Sagas im Detail sind Vertiefung.", "rationale": "Kern ist das Kompensationsprinzip und der Umgang mit irreversiblen Schritten."}}, "lab_validation": [{"lab_id": "KB-0109-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für orchestrierte Saga mit Fehler in Schritt 3", "evidence": "Bei Fehlschlag in Schritt 3 werden Schritte 2 und 1 in umgekehrter Reihenfolge kompensiert.", "limitations": "Kein echter Message-Broker, keine Produktion."}]}
---
# Sagas und Kompensation

> **Ziel:** Eine Saga zerlegt eine Cross-Service-Geschäftstransaktion in eine Folge lokaler Schritte, von denen jeder eine definierte Kompensation hat. Scheitert ein Schritt, werden vorherige Schritte in umgekehrter Reihenfolge kompensiert — das ersetzt echte Atomizität durch eine geschäftlich abgestimmte Rückabwicklung.

## Zweck, Mental Model und Dependencies

Statt wie 2PC ([KB-0108](08-verteilte-transaktionen.md)) alle Teilnehmer atomar zu sperren, führt eine Saga jeden Schritt als eigene lokale Transaktion aus und committet sofort. Scheitert ein späterer Schritt, gibt es keinen automatischen Rollback wie bei ACID — stattdessen werden explizit definierte Kompensationsaktionen für die bereits abgeschlossenen Schritte ausgeführt (z. B. „Zahlung reservieren“ wird durch „Reservierung freigeben“ kompensiert, nicht durch ein Datenbank-Rollback). Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0108](08-verteilte-transaktionen.md).

~~~text
Step1: reserve payment -> Step2: reserve inventory -> Step3: schedule shipping [FAILS]
compensate Step2: release inventory <- compensate Step1: release payment
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Orchestrierung vs. Choreografie | zentraler Koordinator oder Event-Kette? | Choreografie ohne zentralen Überblick erschwert Debugging |
| Kompensation | ist jeder Schritt wirklich rückabwickelbar? | irreversible Schritte (z. B. E-Mail versendet) ohne Ersatzstrategie |
| Kompensationsfehlschlag | was passiert, wenn die Kompensation selbst scheitert? | System bleibt in inkonsistentem Zwischenzustand |
| Isolation | sehen andere Prozesse Zwischenzustände vor vollständigem Abschluss? | fehlende Semantic-Lock erzeugt sichtbare Inkonsistenz |

Implementierung: Orchestrierte Sagas (ein zentraler Koordinator ruft jeden Schritt auf und verwaltet den Zustand) sind einfacher zu überwachen und zu debuggen als choreografierte Sagas (jeder Service reagiert auf Events des vorherigen). Jeder Schritt braucht eine explizit definierte, idempotente Kompensation; irreversible Schritte (z. B. eine bereits versendete Benachrichtigung) müssen als solche markiert und gegebenenfalls durch eine kompensierende Folgeaktion (Korrektur-E-Mail) statt echter Rückabwicklung behandelt werden.

## Scalability, Reliability, Security und Observability

Sagas skalieren besser als 2PC, weil keine langlebigen verteilten Sperren gehalten werden. Reliability-Grenze: eine fehlgeschlagene Kompensation ist ein ernstzunehmender Fall, der nicht stillschweigend ignoriert werden darf — er braucht einen Eskalationspfad (Retry mit Backoff, dann manuelle Klärung).

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Bestellung „hängt“ in Zwischenzustand | Kompensation eines Schritts fehlgeschlagen | Saga-Log auf letzten erfolgreichen/fehlgeschlagenen Schritt prüfen |
| doppelte Kompensation ausgeführt | fehlende Idempotenz der Kompensationsaktion | Kompensations-Handler auf Wiederholbarkeit prüfen |
| Nutzer sieht widersprüchlichen Zwischenzustand | fehlende Isolation/Statusanzeige während laufender Saga | Saga-Status als expliziten, sichtbaren Zustand modellieren |
| irreversibler Schritt kann nicht kompensiert werden | Schritt fälschlich als kompensierbar angenommen | Liste irreversibler Schritte gegen Saga-Design prüfen |

Security: Kompensationsaktionen müssen dieselben Berechtigungsprüfungen durchlaufen wie der ursprüngliche Schritt, sonst entsteht ein Umgehungspfad. Observability korreliert Saga-ID, aktuellen Schritt, Kompensationsstatus und Zeit im aktuellen Zustand.

## Trade-offs und Entscheidungen

**Staff** identifiziert vor Implementierung explizit, welche Schritte irreversibel sind, und definiert für diese eine Ersatzstrategie statt echter Kompensation. **Principal** definiert Standard für Orchestrierung versus Choreografie und verlangt Idempotenz für jede Kompensationsaktion. **Chief** verlangt einen definierten Eskalationsprozess für fehlgeschlagene Kompensationen als Voraussetzung für Produktivfreigabe.

Anti-Patterns: einen Schritt als „kompensierbar“ annehmen, ohne die reale Rückabwickelbarkeit zu prüfen (z. B. externe Zahlungsanbieter-Aktionen); Kompensationsfehler stillschweigend ignorieren; Choreografie ohne zentrales Monitoring/Tracing einsetzen, was Debugging bei komplexen Ketten erschwert.

## Production Checklist

- [ ] Jeder Saga-Schritt hat eine definierte, idempotente Kompensation oder ist explizit als irreversibel markiert.
- [ ] Eskalationsprozess für fehlgeschlagene Kompensationen definiert (Retry, dann manuell).
- [ ] Saga-Status ist sichtbar/nachvollziehbar (Tracing/Log pro Saga-ID).
- [ ] Isolationsverhalten während laufender Saga für Nutzer/andere Prozesse geklärt.

## Interviewfragen

### 1. Was ist der Hauptunterschied zwischen Saga und 2PC?

**Antwort:** Eine Saga committet jeden Schritt sofort lokal und rollt bei Fehlern explizit über Kompensationsaktionen zurück, statt wie 2PC alle Teilnehmer bis zur gemeinsamen Entscheidung gesperrt zu halten.

### 2. Was ist eine Kompensation?

**Antwort:** Eine geschäftlich definierte Gegenaktion, die den Effekt eines bereits abgeschlossenen Schritts rückgängig macht oder ausgleicht — kein technisches Datenbank-Rollback.

### 3. Wie gehst du mit einem irreversiblen Schritt um (z. B. versendete E-Mail)?

**Antwort:** Ich markiere ihn explizit als nicht kompensierbar und plane stattdessen eine Ersatzstrategie wie eine Korrekturmitteilung, statt fälschlich anzunehmen, er sei rückabwickelbar.

### 4. Was passiert, wenn eine Kompensation selbst fehlschlägt?

**Antwort:** Sie muss mit Retry/Backoff wiederholt werden; bleibt sie erfolglos, muss der Fall an einen definierten manuellen Eskalationsprozess übergeben werden, statt unsichtbar liegen zu bleiben.

### 5. Orchestrierung oder Choreografie — wie entscheidest du?

**Antwort:** Orchestrierung für bessere Überwachbarkeit und zentrale Fehlerbehandlung bei komplexeren Sagas; Choreografie nur bei einfachen, wenigen Schritten mit akzeptiertem Verzicht auf zentrale Sicht.

### 6. Widersprüchliche Anforderung: Produkt will sofortige Bestätigung UND vollständige Rückabwickelbarkeit bei jedem Fehler — wie gehst du vor?

**Antwort:** Ich würde klären, dass „sofortige Bestätigung“ bedeutet, dass Zwischenzustände sichtbar werden können, bevor die Saga vollständig abgeschlossen ist; ich würde einen expliziten „pending“-Status kommunizieren und die Bestätigung erst nach dem kritischen, nicht kompensierbaren Schritt aussprechen.

## Praktische Labs

~~~python
executed = []
compensations = {"reserve_payment": "release_payment", "reserve_inventory": "release_inventory"}

def run_step(name, should_fail=False):
    if should_fail:
        raise RuntimeError(f"{name} failed")
    executed.append(name)

try:
    run_step("reserve_payment")
    run_step("reserve_inventory")
    run_step("schedule_shipping", should_fail=True)
except RuntimeError:
    for step in reversed(executed):
        print("compensating:", compensations[step])
~~~

## Dependencies, Cross-References und Quellen

1. Garcia-Molina, Salem: [Sagas](https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf), ACM SIGMOD 1987, abgerufen 2026-09-17.

Produktspezifische Saga-Orchestrierungs-Framework-Details vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Verwaltete Saga-Orchestrierungsdienste mit eingebautem Tracing | Adopting | Sichtbarkeit von Kompensationsfehlern vor Vertrauen prüfen. |
| Deklarative Saga-Definitionen statt Code-basierter Orchestrierung | Emerging | Ausdruckskraft für irreversible-Schritt-Sonderfälle prüfen. |

Ein Team akzeptiert ein Saga-Design erst, wenn Kompensierbarkeit jedes Schritts geprüft, Idempotenz nachgewiesen und ein Eskalationsprozess für Kompensationsfehler definiert ist.
