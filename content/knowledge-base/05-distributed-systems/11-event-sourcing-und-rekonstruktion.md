---
{"id": "KB-0111", "title": "Event Sourcing und Rekonstruktion", "domain": "05", "sequence": 11, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0110", "concepts": ["CQRS", "Projektion"], "needed_for": "both"}], "related": ["KB-0112", "KB-0562", "KB-0720"], "applies": ["KB-0112", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Zustand aus einem Ereignislog rekonstruieren und einen Snapshot zur Beschleunigung einsetzen.", "rationale": "Kein Event-Store nötig, um das Prinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Aggregatsgrenzen, Snapshot-Strategie und Umgang mit Schema-/Ereignisänderungen entwerfen.", "rationale": "Falsche Aggregatsgrenzen erzeugen unkontrollierbar große Event-Streams."}, "STAFF-TARGET": {"active": true, "scope": "Eine fehlerhafte Rekonstruktion nach Schema-Änderung eines alten Ereignistyps diagnostizieren.", "rationale": "Ereignisse sind unveränderlich; Schema-Evolution muss rückwärtskompatibel sein."}, "CHIEF-TARGET": {"active": true, "scope": "Event Sourcing als begründete Ausnahme für Audit-/Nachvollziehbarkeitsanforderungen statt Standardmuster positionieren.", "rationale": "Der Rekonstruktions- und Migrationsaufwand ist erheblich und muss durch echten Bedarf gerechtfertigt sein."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Event-Versionierung, Upcasting und Event-Store-Skalierungsmuster sind Vertiefung.", "rationale": "Kern ist das Rekonstruktionsprinzip und die Unveränderlichkeit von Ereignissen."}}, "lab_validation": [{"lab_id": "KB-0111-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Ereignislog-Replay und Snapshot", "evidence": "Zustand aus vollständigem Replay stimmt mit Zustand aus Snapshot plus nachfolgenden Ereignissen überein.", "limitations": "Kein echter Event-Store, keine Produktion."}]}
---
# Event Sourcing und Rekonstruktion

> **Ziel:** Event Sourcing speichert jede Zustandsänderung als unveränderliches Ereignis statt nur den aktuellen Zustand. Der aktuelle Zustand wird durch Replay der Ereignisse rekonstruiert — das liefert vollständige Nachvollziehbarkeit, verlangt aber sorgfältige Aggregatsgrenzen, Snapshot-Strategie und rückwärtskompatible Ereignisschemata.

## Zweck, Mental Model und Dependencies

Statt „Konto-Saldo = 100“ zu speichern, speichert Event Sourcing die Folge „Eingezahlt 150“, „Abgehoben 50“ — der Saldo ist eine Ableitung, kein gespeicherter Fakt. Das Ereignislog ist die Quelle der Wahrheit (Source of Truth); jede Leseansicht (inklusive „aktueller Zustand“) ist eine Projektion davon, siehe [KB-0110](10-cqrs-und-getrennte-datenmodelle.md). Ereignisse sind unveränderlich — ein Fehler wird durch ein Korrekturereignis behoben, nicht durch nachträgliches Ändern eines alten Ereignisses. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0110](10-cqrs-und-getrennte-datenmodelle.md).

~~~text
Event1(Deposited,150) -> Event2(Withdrawn,50) -> Event3(Deposited,20) -> replay -> current state: balance=120
                                              snapshot@Event2(balance=100) -> replay only Event3 -> balance=120
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Aggregatsgrenze | welche Entität hat ihren eigenen Event-Stream? | zu große Aggregate erzeugen lange, langsame Replays |
| Snapshot | ab wann/wie oft, um vollständigen Replay zu vermeiden? | fehlende Snapshots machen Rekonstruktion bei großen Streams langsam |
| Schema-Evolution | wie werden alte Ereignistypen bei Codeänderung gelesen? | Breaking Change auf altem Ereignis bricht Rekonstruktion |
| Korrektur | wie wird ein fehlerhaftes Ereignis behandelt? | rückwirkendes Ändern zerstört Nachvollziehbarkeit |

Implementierung: Aggregatsgrenzen an fachlichen Konsistenzgrenzen ausrichten (z. B. ein Konto, nicht „alle Konten einer Bank“). Snapshots in regelmäßigen Abständen erzeugen, sodass Rekonstruktion nur den Snapshot plus wenige nachfolgende Ereignisse liest. Neue Ereignisversionen rückwärtskompatibel gestalten oder einen expliziten Upcasting-Schritt (alte Ereignisform in neue transformieren) beim Lesen einbauen. Fehlerhafte historische Ereignisse werden durch ein neues Korrekturereignis ausgeglichen, nie gelöscht oder verändert.

## Scalability, Reliability, Security und Observability

Skalierung hängt von Aggregatsgröße (Anzahl Ereignisse pro Stream) und Snapshot-Frequenz ab; ohne Snapshots wächst die Rekonstruktionszeit linear mit der Ereignisanzahl. Reliability-Grenze: ein Event-Store ist die einzige Quelle der Wahrheit — sein Verlust bedeutet vollständigen Datenverlust, daher braucht er mindestens denselben Backup-/Replikationsstandard wie eine primäre Datenbank.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Zustandsrekonstruktion wird langsam | fehlende oder zu seltene Snapshots | Anzahl Ereignisse seit letztem Snapshot messen |
| Rekonstruktion schlägt nach Deployment fehl | Schema-Änderung ohne Rückwärtskompatibilität/Upcasting | alten Ereignistyp gegen neuen Lesecode prüfen |
| falscher historischer Zustand sichtbar | fehlerhaftes Ereignis nachträglich verändert statt korrigiert | Unveränderlichkeit des Ereignislogs prüfen |
| Aggregat wird unhandlich groß | Aggregatsgrenze zu weit gefasst | fachliche Konsistenzgrenze neu bewerten |

Security: das Ereignislog enthält oft die vollständige Historie sensibler Daten (auch gelöschter/überschriebener Werte); Löschanforderungen (z. B. Datenschutz) erfordern explizite Strategien wie Crypto-Shredding, da Ereignisse nicht einfach gelöscht werden können. Observability korreliert Aggregats-ID, Ereignisanzahl, letzten Snapshot-Zeitpunkt und Rekonstruktionsdauer.

## Trade-offs und Entscheidungen

**Staff** prüft bei Rekonstruktionsfehlern zuerst Schema-Kompatibilität zwischen altem Ereignis und aktuellem Lesecode. **Principal** definiert Aggregatsgrenzen-Richtlinien und verpflichtende Snapshot-Strategie ab definierter Ereignisanzahl. **Chief** verlangt eine explizite Begründung (Audit-Anforderung, Nachvollziehbarkeit) für jeden Event-Sourcing-Einsatz und eine Datenschutz-Löschstrategie vor Produktivfreigabe.

Anti-Patterns: Event Sourcing „weil es modern klingt“ ohne echten Nachvollziehbarkeitsbedarf einsetzen; Ereignisse nachträglich ändern statt zu korrigieren; keine Snapshot-Strategie für langlebige Aggregate; keine Löschstrategie für personenbezogene Daten im Ereignislog.

## Production Checklist

- [ ] Aggregatsgrenzen an fachlichen Konsistenzgrenzen ausgerichtet.
- [ ] Snapshot-Strategie definiert und Rekonstruktionsdauer gemessen.
- [ ] Schema-Evolution/Upcasting für alte Ereignistypen getestet.
- [ ] Löschstrategie für personenbezogene Daten im unveränderlichen Log dokumentiert.

## Interviewfragen

### 1. Was ist der Unterschied zwischen Event Sourcing und klassischer Zustandsspeicherung?

**Antwort:** Event Sourcing speichert die Folge aller Zustandsänderungen als unveränderliche Ereignisse; der aktuelle Zustand wird durch Replay abgeleitet, statt direkt gespeichert zu sein.

### 2. Warum werden Ereignisse nie geändert, sondern korrigiert?

**Antwort:** Die Unveränderlichkeit ist die Grundlage der Nachvollziehbarkeit; ein nachträglich geändertes Ereignis würde die Historie verfälschen und Audit-Garantien zerstören.

### 3. Wozu dienen Snapshots?

**Antwort:** Sie vermeiden, bei jeder Rekonstruktion den gesamten Ereignisverlauf von Anfang an lesen zu müssen, indem ein periodisch gespeicherter Zwischenzustand als Startpunkt dient.

### 4. Wie gehst du mit einer Schema-Änderung eines alten Ereignistyps um?

**Antwort:** Über rückwärtskompatible Erweiterung oder einen expliziten Upcasting-Schritt, der alte Ereignisformen beim Lesen in die aktuelle Form transformiert, ohne die gespeicherten Ereignisse selbst zu verändern.

### 5. Wie löschst du personenbezogene Daten aus einem unveränderlichen Ereignislog?

**Antwort:** Meist über Crypto-Shredding: sensible Feldwerte werden verschlüsselt gespeichert, und das Löschen des Schlüssels macht sie faktisch unlesbar, ohne die Ereignisstruktur selbst zu verändern.

### 6. Widersprüchliche Anforderung: Produkt will vollständige Audit-Historie UND das Recht auf Löschung nach DSGVO — wie gehst du vor?

**Antwort:** Ich würde erklären, dass beide Anforderungen über Crypto-Shredding vereinbar sind: die Ereignisstruktur und Audit-Kette bleiben vollständig erhalten, während sensible Nutzdaten durch Schlüssellöschung unlesbar werden.

## Praktische Labs

~~~python
events = [{"type": "deposit", "amount": 150}, {"type": "withdraw", "amount": 50}, {"type": "deposit", "amount": 20}]

def replay(events):
    balance = 0
    for e in events:
        balance += e["amount"] if e["type"] == "deposit" else -e["amount"]
    return balance

full_replay = replay(events)
snapshot_balance = 100  # after first two events
tail_replay = snapshot_balance + replay(events[2:])
assert full_replay == tail_replay == 120
print("Full replay and snapshot+tail replay agree on the reconstructed state.")
~~~

## Dependencies, Cross-References und Quellen

1. Fowler: [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html), martinfowler.com, abgerufen 2026-09-17.

Produktspezifische Event-Store-Implementierungsdetails vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Verwaltete Event-Store-Dienste mit eingebautem Snapshotting | Established je Anbieter | Rekonstruktionsdauer und Kosten unter realer Aggregatsgröße messen. |
| Crypto-Shredding als Standardansatz für DSGVO-konformes Event Sourcing | Adopting | Schlüsselverwaltung und Nachweisbarkeit der Löschung vor Vertrauen prüfen. |

Ein Team akzeptiert Event Sourcing erst, wenn Aggregatsgrenzen, Snapshot-Strategie, Schema-Evolution und Löschstrategie für personenbezogene Daten nachweisbar getestet sind.
