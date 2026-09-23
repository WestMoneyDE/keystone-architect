---
{"id": "KB-0110", "title": "CQRS und getrennte Datenmodelle", "domain": "05", "sequence": 10, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0102", "concepts": ["Konsistenzmodelle"], "needed_for": "both"}], "related": ["KB-0111", "KB-0562", "KB-0720"], "applies": ["KB-0111", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Getrennte Schreib-/Lesemodelle mit Projektion und Aktualitätsverzögerung lokal simulieren.", "rationale": "Kein Message-Broker nötig, um das Prinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Für einen konkreten Lesepfad begründen, ob CQRS den zusätzlichen Betriebsaufwand rechtfertigt.", "rationale": "CQRS ist kein Standarddesign, sondern eine gezielte Antwort auf asymmetrische Lese-/Schreibanforderungen."}, "STAFF-TARGET": {"active": true, "scope": "Eine veraltete Projektion nach Schreibvorgang diagnostizieren und von einem Datenverlust unterscheiden.", "rationale": "Projektionsverzögerung ist erwartetes Verhalten, kein Bug per se."}, "CHIEF-TARGET": {"active": true, "scope": "CQRS als Ausnahme für begründete Lese-/Schreib-Asymmetrie statt als Standardmuster positionieren.", "rationale": "Unbegründeter CQRS-Einsatz erhöht Komplexität ohne klaren Nutzen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Kombination mit Event Sourcing und Multi-Projektions-Strategien sind Vertiefung.", "rationale": "Kern ist die begründete Trennung von Schreib- und Lesemodell."}}, "lab_validation": [{"lab_id": "KB-0110-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Schreibmodell plus asynchrone Projektion", "evidence": "Ein sofortiger Read direkt nach Write auf der Projektion liefert den alten Wert, bis die Projektion aktualisiert wird.", "limitations": "Kein reales Event-System, keine Produktion."}]}
---
# CQRS und getrennte Datenmodelle

> **Ziel:** CQRS (Command Query Responsibility Segregation) trennt das Schreibmodell (optimiert für Validierung/Konsistenz) vom Lesemodell (optimiert für Abfragen). Eine oder mehrere Projektionen leiten sich asynchron aus dem Schreibmodell ab — mit dem Preis einer Aktualitätsverzögerung, die explizit gemanagt werden muss.

## Zweck, Mental Model und Dependencies

In einem klassischen Modell teilen sich Lese- und Schreibpfad dieselbe Datenstruktur — ein Kompromiss, wenn beide sehr unterschiedliche Anforderungen haben (z. B. normalisiertes Schreibmodell für Konsistenz versus denormalisierte, für viele Abfragemuster optimierte Leseansicht). CQRS trennt beide: Commands ändern das Schreibmodell, das wiederum Events oder Änderungen emittiert, aus denen eine oder mehrere Projektionen (Leseansichten) asynchron aufgebaut werden. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0102](02-konsistenzmodelle-verteilter-systeme.md).

~~~text
Command -> Write Model (validate, persist) -> emit change/event -> async projector -> Read Model(s)
                                                                          ^ lag window: read model briefly stale
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Trennungsgrund | wirklich asymmetrische Last/Struktur zwischen Read/Write? | CQRS ohne echten Bedarf erhöht nur Komplexität |
| Projektion | eine oder mehrere, wie synchronisiert? | mehrere Projektionen erhöhen Konsistenzaufwand |
| Aktualitätsverzögerung | wie wird sie dem Nutzer sichtbar/verständlich gemacht? | Nutzer interpretiert Lag als Datenverlust |
| Rebuild | kann eine Projektion aus dem Schreibmodell neu aufgebaut werden? | fehlender Rebuild-Pfad macht Projektionsfehler irreversibel |

Implementierung: CQRS nur einführen, wenn Lese- und Schreibanforderungen tatsächlich stark divergieren (unterschiedliche Skalierung, unterschiedliche Datenstruktur, unterschiedliche Teams). Jede Projektion muss aus dem Schreibmodell deterministisch neu aufgebaut werden können (Rebuild-Fähigkeit), sonst wird ein Projektionsfehler zu dauerhaftem Datenverlust auf der Leseseite. Die Aktualitätsverzögerung muss dem Nutzer oder Client explizit kommuniziert werden (z. B. „gespeichert, Anzeige aktualisiert sich in Kürze“).

## Scalability, Reliability, Security und Observability

CQRS erlaubt unabhängige Skalierung von Schreib- und Lesepfad (z. B. viele Leserepliken bei wenigen Schreibvorgängen). Reliability-Grenze: eine fehlerhafte Projektionslogik kann falsche Leseansichten erzeugen, die erst durch einen vollständigen Rebuild korrigiert werden können — ohne Rebuild-Pfad ist der Fehler dauerhaft.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Nutzer sieht eigene Änderung nicht sofort | normale Projektionsverzögerung | Lag-Metrik zwischen Write und Projektion prüfen |
| Leseansicht dauerhaft falsch trotz korrektem Schreibmodell | fehlerhafte Projektionslogik | Rebuild der Projektion aus dem Schreibmodell testen |
| Projektion driftet über Zeit von Schreibmodell ab | Projektor verliert Events (kein Replay-fähiger Consumer) | Event-Offset/Checkpoint des Projektors prüfen |
| hohe Last auf Schreibmodell durch Leseabfragen | CQRS nicht konsequent umgesetzt, Lesezugriffe noch auf Schreibmodell | Zugriffspfade pro Abfrage-Typ auditieren |

Security: Projektionen können unterschiedliche Datenausschnitte für unterschiedliche Zielgruppen enthalten; Zugriffskontrolle muss pro Projektion konsistent zur Berechtigung im Schreibmodell bleiben, sonst entsteht ein Leck über die Leseseite. Observability korreliert Schreibvorgang-ID, Projektionslatenz und Rebuild-Status.

## Trade-offs und Entscheidungen

**Staff** prüft bei jeder gemeldeten „falschen Anzeige“ zuerst Projektionslag, bevor Datenverlust vermutet wird. **Principal** verlangt für jeden CQRS-Einsatz eine dokumentierte Begründung der Lese-/Schreib-Asymmetrie und eine getestete Rebuild-Fähigkeit. **Chief** positioniert CQRS als begründete Ausnahme, nicht als Standardarchitektur, um unnötige Komplexität im Portfolio zu vermeiden.

Anti-Patterns: CQRS einführen, ohne dass Lese-/Schreibanforderungen tatsächlich divergieren; Projektionen ohne Rebuild-Fähigkeit betreiben; Aktualitätsverzögerung dem Nutzer verschweigen statt sie explizit im UX zu berücksichtigen.

## Production Checklist

- [ ] Begründung für CQRS-Einsatz (reale Lese-/Schreib-Asymmetrie) dokumentiert.
- [ ] Jede Projektion kann deterministisch aus dem Schreibmodell neu aufgebaut werden.
- [ ] Projektionslatenz überwacht und mit Nutzer-/API-Erwartung abgestimmt.
- [ ] Zugriffskontrolle pro Projektion konsistent zum Schreibmodell geprüft.

## Interviewfragen

### 1. Was ist der Kernunterschied zwischen CQRS und einem klassischen CRUD-Modell?

**Antwort:** CQRS trennt Schreib- und Lesemodell strukturell und synchronisiert sie asynchron, während ein CRUD-Modell beide über dieselbe Datenstruktur bedient.

### 2. Wann rechtfertigt sich CQRS?

**Antwort:** Wenn Lese- und Schreibanforderungen stark divergieren, etwa sehr unterschiedliche Skalierung, Abfragemuster oder Teamstrukturen — nicht als Standarddesign für jedes System.

### 3. Was passiert, wenn ein Nutzer direkt nach dem Schreiben liest?

**Antwort:** Er kann durch die asynchrone Projektionsverzögerung kurzzeitig einen alten Wert sehen; das ist erwartetes Verhalten und muss im UX/API-Vertrag kommuniziert werden.

### 4. Warum ist Rebuild-Fähigkeit für Projektionen wichtig?

**Antwort:** Ohne die Möglichkeit, eine Projektion deterministisch aus dem Schreibmodell neu aufzubauen, wird ein Fehler in der Projektionslogik zu dauerhaftem, nicht behebbarem Datenfehler auf der Leseseite.

### 5. Wie unterscheidest du normale Projektionsverzögerung von echtem Datenverlust?

**Antwort:** Über eine Lag-Metrik zwischen Schreibzeitpunkt und Projektionsaktualisierung; bleibt die Projektion nach angemessener Zeit dauerhaft abweichend, deutet das auf einen Fehler statt normaler Verzögerung hin.

### 6. Widersprüchliche Anforderung: Produkt will hochskalierbare, denormalisierte Leseansichten UND sofortige Konsistenz nach jedem Schreiben — wie gehst du vor?

**Antwort:** Ich würde erklären, dass asynchrone Projektionen strukturell eine gewisse Verzögerung haben; für Fälle mit zwingendem sofortigen Konsistenzbedarf würde ich einen synchronen Lesepfad direkt gegen das Schreibmodell für genau diesen kritischen Anwendungsfall vorschlagen, statt die gesamte Leseseite synchron zu machen.

## Praktische Labs

~~~python
write_model = {}
read_projection = {}

def write(key, value):
    write_model[key] = value  # committed immediately

def project():
    read_projection.update(write_model)  # simulates async, delayed projection

write("order:1", "pending")
assert read_projection.get("order:1") is None  # not yet projected
project()
assert read_projection["order:1"] == "pending"
print("Read model reflects the write only after the projection step runs.")
~~~

## Dependencies, Cross-References und Quellen

1. Fowler: [CQRS](https://martinfowler.com/bliki/CQRS.html), martinfowler.com, abgerufen 2026-09-17.

Produktspezifische CQRS-Framework- und Streaming-Tooling-Details vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Verwaltete Change-Data-Capture-Dienste als Projektionsquelle | Established | Latenz- und Ordering-Garantien der konkreten CDC-Lösung prüfen. |
| Materialized Views in modernen Datenbanken als leichtgewichtige CQRS-Alternative | Adopting | Prüfen, ob eine eingebaute Materialized View statt vollem CQRS-Stack ausreicht. |

Ein Team akzeptiert CQRS erst, wenn die Lese-/Schreib-Asymmetrie belegt, Rebuild-Fähigkeit getestet und die Aktualitätsverzögerung im UX/API-Vertrag berücksichtigt ist.
