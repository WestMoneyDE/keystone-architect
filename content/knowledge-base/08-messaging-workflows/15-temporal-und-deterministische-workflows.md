---
{"id": "KB-0191", "title": "Temporal und deterministische Workflows", "domain": "08", "sequence": 15, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF"], "requires": [{"id": "KB-0112", "concepts": ["Zustandsautomat"], "needed_for": "both"}, {"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}], "related": ["KB-0192", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Workflow-Replay aus einer Ereignishistorie lokal implementieren und einen Determinismus-Verstoß zeigen.", "rationale": "Kein echtes Temporal-System nötig, um das Kernprinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Workflow-Code streng deterministisch von nicht-deterministischen Aktivitäten (externe Aufrufe, Zufallswerte) trennen.", "rationale": "Das Replay-Modell von Temporal-artigen Systemen erfordert absolute Determinismusgarantien im Workflow-Code selbst."}, "STAFF-TARGET": {"active": true, "scope": "Einen fehlgeschlagenen Workflow-Replay auf eine nachträgliche, nicht-deterministische Codeänderung zurückführen.", "rationale": "Das ist eine zentrale, oft überraschende Fehlerquelle bei Temporal-artigen Systemen."}, "CHIEF-TARGET": {"active": true, "scope": "Workflow-Versionierungsstrategie für langlebige Geschäftsprozesse als Standard festlegen.", "rationale": "Ohne Versionierungsstrategie brechen laufende Workflow-Instanzen bei jeder Code-Änderung."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Detaillierte Worker-Skalierung und Sticky-Queue-Optimierung sind Vertiefung.", "rationale": "Kern ist Determinismus, Replay und Versionierung."}}, "lab_validation": [{"lab_id": "KB-0191-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Workflow-Replay aus Ereignishistorie", "evidence": "Ein Workflow, der bei jedem Replay dieselbe Ereignishistorie deterministisch durchläuft, liefert konsistente Zustände; eine Version mit einem nicht-deterministischen Zufallsaufruf im Workflow-Code selbst liefert bei erneutem Replay ein abweichendes Ergebnis.", "limitations": "Kein echtes Temporal-System, keine Produktion."}]}
---
# Temporal und deterministische Workflows

> **Ziel:** Temporal-artige Workflow-Engines rekonstruieren den Zustand eines langlebigen Workflows durch Replay seiner Ereignishistorie — jedes Mal, wenn ein Worker den Workflow-Code erneut ausführt (z. B. nach einem Neustart), wird die komplette bisherige Historie erneut durchlaufen. Das funktioniert nur, wenn der Workflow-Code absolut deterministisch ist: bei identischer Historie muss er immer exakt dieselben Entscheidungen treffen. Nicht-deterministischer Code (Zufallswerte, direkte externe Aufrufe, Systemzeit) im Workflow selbst bricht dieses Modell.

## Zweck, Mental Model und Dependensies

Ein Temporal-Workflow zeichnet jede Entscheidung (welche Activity wurde wann mit welchem Ergebnis aufgerufen) in einer Ereignishistorie auf. Bei jedem Neustart eines Workers wird der Workflow-Code von Anfang an erneut ausgeführt, aber statt echte Activities erneut aufzurufen, werden die bereits aufgezeichneten Ergebnisse aus der Historie zurückgegeben (Replay) — der Workflow „glaubt", er führe zum ersten Mal aus, bekommt aber deterministisch dieselben Antworten wie beim letzten Mal, bis er den Punkt erreicht, an dem er tatsächlich fortsetzen muss. Nicht-deterministische Operationen (Zufallszahlen, `time.now()`, direkte HTTP-Aufrufe) müssen daher zwingend in separate „Activities" ausgelagert werden, deren Ergebnis in der Historie aufgezeichnet wird — der Workflow-Code selbst bleibt reiner, deterministischer Kontrollfluss, ähnlich einem expliziten Zustandsautomaten ([KB-0112](../05-distributed-systems/12-zustandsautomaten-und-invarianten.md)). Lies [KB-0112](../05-distributed-systems/12-zustandsautomaten-und-invarianten.md) und [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md).

~~~text
Workflow code (deterministic): result = call_activity("chargePayment", amount)  -- result comes from history on replay
                                if result.success: call_activity("shipOrder")   -- same branch taken deterministically
NEVER in workflow code: random.random(), time.now(), direct requests.get(url)  -- these must be Activities
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Determinismus | enthält Workflow-Code Zufall, Systemzeit oder direkte I/O? | Replay liefert abweichendes Ergebnis, Workflow-Zustand wird inkonsistent |
| Activities | sind alle nicht-deterministischen Operationen als Activity ausgelagert? | direkter externer Aufruf im Workflow-Code bricht Replay-Fähigkeit |
| Versionierung | wird Code-Änderung an einem laufenden Workflow-Typ kontrolliert? | Codeänderung bricht Replay bereits laufender Workflow-Instanzen |
| Workflow History | wächst sie unbegrenzt, oder wird sie durch Continue-As-New begrenzt? | sehr lange laufende Workflows mit unbegrenzt wachsender Historie werden ineffizient |

Implementierung: jede nicht-deterministische Operation (externe API-Aufrufe, Datenbankzugriffe, Zufallswerte, Systemzeit) wird zwingend als Activity implementiert, deren Ergebnis in der Workflow-Historie aufgezeichnet und bei Replay wiederverwendet wird — der Workflow-Code selbst enthält nur deterministischen Kontrollfluss basierend auf Activity-Ergebnissen. Änderungen am Workflow-Code werden versioniert behandelt (z. B. über bedingte Versionsprüfung im Code), damit bereits laufende Workflow-Instanzen mit älterer Historie weiterhin korrekt repliziert werden können, während neue Instanzen die neue Logik nutzen. Für sehr lange laufende Workflows wird die Historie über „Continue-As-New" periodisch zurückgesetzt, um unbegrenztes Wachstum zu vermeiden.

## Scalability, Reliability, Security und Observability

Das Replay-Modell skaliert Zuverlässigkeit für langlebige Geschäftsprozesse (Tage, Wochen, Monate), da der Workflow-Zustand nicht im Worker-Prozessspeicher, sondern in der persistenten Historie lebt — ein Worker-Ausfall verliert keinen Fortschritt. Reliability-Grenze: eine nachträgliche, nicht-deterministische Codeänderung an einem Workflow-Typ mit bereits laufenden Instanzen führt bei deren nächstem Replay zu einem Determinismus-Fehler, da die neue Codeversion bei identischer Historie andere Entscheidungen treffen würde als beim ursprünglichen Lauf.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Workflow-Replay schlägt mit Nondeterminism-Fehler fehl | Code wurde nach Start laufender Instanzen ohne Versionierung geändert | Code-Änderungshistorie gegen Start-/Replay-Zeitpunkt betroffener Instanzen vergleichen |
| Workflow-Verhalten unterscheidet sich zwischen Läufen bei identischer Eingabe | nicht-deterministische Operation direkt im Workflow-Code statt als Activity | Workflow-Code auf direkte Zufalls-/Zeit-/I/O-Aufrufe durchsuchen |
| Workflow-Historie wächst sehr groß und Verarbeitung wird langsam | fehlendes Continue-As-New für sehr lange laufende Workflows | Historiengröße gegen Laufzeit und Continue-As-New-Nutzung prüfen |
| Activity wird bei Replay unerwartet erneut ausgeführt | Activity-Ergebnis wurde nicht korrekt in der Historie aufgezeichnet | Historie-Eintrag für die betroffene Activity auf vollständige Aufzeichnung prüfen |

Security: Activities, die auf sensible externe Systeme zugreifen, sollten mit minimalen, spezifischen Berechtigungen ausgestattet sein, getrennt vom generischen Workflow-Ausführungskontext. Observability: Workflow-Historie selbst ist ein vollständiger Audit-Trail jeder Entscheidung und jedes Activity-Ergebnisses über die gesamte Lebensdauer des Prozesses.

## Trade-offs und Entscheidungen

**Staff** prüft bei jedem Workflow-Code-Review explizit auf nicht-deterministische Operationen außerhalb von Activities. **Principal** etabliert eine Versionierungsstrategie für Workflow-Code-Änderungen, um bereits laufende Instanzen nicht zu brechen. **Chief** verlangt Determinismus-Disziplin als nicht verhandelbaren Standard für alle Temporal-artigen Workflow-Implementierungen.

Anti-Patterns: direkte HTTP-Aufrufe, Zufallswerte oder Systemzeit im Workflow-Code statt in Activities; Codeänderungen an Workflow-Typen mit laufenden Instanzen ohne Versionierungsstrategie; unbegrenzt wachsende Workflow-Historie ohne Continue-As-New für sehr lange Prozesse.

## Production Checklist

- [ ] Alle nicht-deterministischen Operationen sind als Activities ausgelagert, nicht direkt im Workflow-Code.
- [ ] Workflow-Code-Änderungen folgen einer Versionierungsstrategie, die bereits laufende Instanzen nicht bricht.
- [ ] Sehr lange laufende Workflows nutzen Continue-As-New zur Historienbegrenzung.
- [ ] Activities haben minimale, spezifische Berechtigungen getrennt vom Workflow-Kontext.

## Interviewfragen

### 1. Warum muss Workflow-Code in Temporal-artigen Systemen deterministisch sein?

**Antwort:** Der Zustand wird durch Replay der Ereignishistorie rekonstruiert; bei identischer Historie muss der Code immer exakt dieselben Entscheidungen treffen, sonst wird der rekonstruierte Zustand inkonsistent mit dem ursprünglichen Lauf.

### 2. Was ist eine Activity und warum ist die Trennung von Workflow-Code wichtig?

**Antwort:** Eine Activity kapselt nicht-deterministische Operationen (externe Aufrufe, Zufallswerte); ihr Ergebnis wird in der Historie aufgezeichnet und bei Replay wiederverwendet, wodurch der Workflow-Code selbst deterministisch bleiben kann.

### 3. Was passiert, wenn Workflow-Code nach Start laufender Instanzen ohne Versionierung geändert wird?

**Antwort:** Bei deren nächstem Replay würde die neue Codeversion bei identischer Historie andere Entscheidungen treffen als der ursprüngliche Lauf, was zu einem Nondeterminism-Fehler führt.

### 4. Was ist Continue-As-New und wozu dient es?

**Antwort:** Ein Mechanismus, der die Workflow-Historie periodisch zurücksetzt und mit dem aktuellen Zustand als neuem Startpunkt fortsetzt, um unbegrenztes Wachstum der Historie bei sehr lange laufenden Workflows zu vermeiden.

### 5. Warum darf ein Workflow keinen direkten HTTP-Aufruf enthalten?

**Antwort:** Ein direkter Aufruf wäre nicht-deterministisch (das Ergebnis könnte bei Replay anders ausfallen) und würde zudem bei jedem Replay tatsächlich erneut ausgeführt, statt aus der Historie wiederverwendet zu werden.

### 6. Widersprüchliche Anforderung: Team will schnelle, häufige Workflow-Logikänderungen UND garantiert keine Unterbrechung bereits laufender Prozessinstanzen — wie gehst du vor?

**Antwort:** Ich würde eine explizite Versionierungsstrategie im Workflow-Code implementieren (z. B. bedingte Verzweigung basierend auf einer Versionsmarkierung), sodass alte Instanzen weiterhin die alte Logik replizieren, während neue Instanzen die neue Logik nutzen — das erlaubt häufige Änderungen ohne bestehende Instanzen zu brechen.

## Praktische Labs

~~~python
import random

def deterministic_workflow(history):
    # simulates replay: activity result comes from history, not fresh execution
    result = history[0] if history else "fresh_result"
    return "shipped" if result == "success" else "cancelled"

# same history -> same result on every replay
assert deterministic_workflow(["success"]) == deterministic_workflow(["success"])

def nondeterministic_workflow():
    return "shipped" if random.random() > 0.5 else "cancelled"  # ANTI-PATTERN: direct randomness in workflow code

random.seed(1)
r1 = nondeterministic_workflow()
random.seed(2)
r2 = nondeterministic_workflow()
print(f"Deterministic workflow: consistent across replays. Nondeterministic workflow: {r1} vs {r2} - replay risk demonstrated.")
~~~

## Dependencies, Cross-References und Quellen

1. Temporal Technologies: [Temporal Documentation - Determinism Constraints](https://docs.temporal.io/workflows), abgerufen 2026-09-17.

Temporal-Versionsdetails und SDK-spezifische Determinismus-Prüfungen vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Determinismus-Prüfung in CI (Nondeterminism-Detection-Tools) | Adopting | Regelabdeckung gegen bekannte nicht-deterministische Muster verifizieren. |

Ein Team akzeptiert eine Temporal-Workflow-Implementierung erst, wenn Determinismus im Workflow-Code und eine Versionierungsstrategie für Codeänderungen nachweisbar getestet sind.
