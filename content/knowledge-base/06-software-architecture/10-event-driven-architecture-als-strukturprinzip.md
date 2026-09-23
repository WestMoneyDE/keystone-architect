---
{"id": "KB-0138", "title": "Event-Driven Architecture als Strukturprinzip", "domain": "06", "sequence": 10, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0132", "concepts": ["Domain Events"], "needed_for": "both"}, {"id": "KB-0109", "concepts": ["Sagas"], "needed_for": "understanding"}], "related": ["KB-0137", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Ereigniskette (Choreografie) und einen expliziten Orchestrierungsaufruf für denselben Anwendungsfall lokal vergleichen.", "rationale": "Kein reales Messaging-System nötig, um den Unterschied zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Für einen Prozess entscheiden, ob Choreografie (emergente Ereignisketten) oder Orchestrierung (expliziter Ablauf) angemessen ist.", "rationale": "Choreografie ohne Übersicht erzeugt schwer nachvollziehbare, emergente Prozessabläufe."}, "STAFF-TARGET": {"active": true, "scope": "Einen nicht nachvollziehbaren Prozessablauf auf verteilte, undokumentierte Ereignisketten (Choreografie) zurückführen.", "rationale": "Das ist eine häufige Ursache für 'wo kommt dieser Aufruf her'-Debugging-Probleme."}, "CHIEF-TARGET": {"active": true, "scope": "Entscheiden, für welche Prozessklassen Choreografie versus Orchestrierung als Standard gilt, basierend auf Nachvollziehbarkeitsanforderung.", "rationale": "Kritische Geschäftsprozesse brauchen oft explizite Nachvollziehbarkeit, die reine Choreografie erschwert."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Event-Mesh-Architekturen und komplexe Event-Processing-Muster sind Vertiefung.", "rationale": "Kern ist die Wahl zwischen Choreografie und Orchestrierung und ihre Nachvollziehbarkeitsfolgen."}}, "lab_validation": [{"lab_id": "KB-0138-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Choreografie versus Orchestrierung desselben Prozesses", "evidence": "Bei Choreografie ist der Gesamtablauf nur durch Verfolgen aller Event-Handler rekonstruierbar; bei Orchestrierung ist der Ablauf an einer zentralen Stelle sichtbar.", "limitations": "Kein reales Messaging-System, keine Produktion."}]}
---
# Event-Driven Architecture als Strukturprinzip

> **Ziel:** Event-Driven Architecture entkoppelt Services zeitlich und strukturell über Ereignisse statt direkter Aufrufe. Choreografie (jeder Service reagiert unabhängig auf Ereignisse) erzeugt hohe Entkopplung, aber der Gesamtprozessablauf wird emergent und schwer nachvollziehbar. Orchestrierung (ein zentraler Koordinator ruft Schritte explizit auf) bleibt nachvollziehbarer, koppelt aber enger an den Koordinator.

## Zweck, Mental Model und Dependencies

Bei Choreografie veröffentlicht jeder Service Domain Events ([KB-0132](04-domain-events-und-fachereignisse.md)), auf die andere Services unabhängig reagieren, ohne dass ein zentraler Punkt den Gesamtablauf kennt — der Prozess „emergiert" aus vielen lokalen Reaktionen. Bei Orchestrierung ruft ein zentraler Koordinator (vergleichbar mit einer Saga-Orchestrierung, [KB-0109](../05-distributed-systems/09-sagas-und-kompensation.md)) jeden Schritt explizit auf und kennt den vollständigen Ablauf. Beide sind valide Strukturprinzipien mit unterschiedlichen Nachvollziehbarkeits-/Kopplungs-Trade-offs. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0132](04-domain-events-und-fachereignisse.md) und [KB-0109](../05-distributed-systems/09-sagas-und-kompensation.md).

~~~text
Choreography:  OrderCreated -> [Inventory reacts] -> StockReserved -> [Shipping reacts] -> ShipmentScheduled
               (no single place shows the full flow; each service only knows its own reaction)
Orchestration: Coordinator explicitly calls: reserveStock() -> scheduleShipment() -> confirmOrder()
               (full flow visible in one place)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Trade-off |
|---|---|---|
| Choreografie | Services reagieren unabhängig auf Events? | hohe Entkopplung, aber emergenter, schwer nachvollziehbarer Gesamtablauf |
| Orchestrierung | zentraler Koordinator ruft Schritte explizit auf? | nachvollziehbarer Ablauf, aber engere Kopplung an den Koordinator |
| Nachvollziehbarkeit | kann der Gesamtprozess an einer Stelle verstanden werden? | Choreografie erfordert verteiltes Tracing, um den Ablauf zu rekonstruieren |
| Fehlerbehandlung | wo wird ein fehlgeschlagener Prozessschritt behandelt? | bei Choreografie verstreut über mehrere Event-Handler, bei Orchestrierung zentral |

Implementierung: für Prozesse mit hoher Änderungsfrequenz an der Ablauflogik oder hohem Nachvollziehbarkeitsbedarf (z. B. regulierte Geschäftsprozesse) ist Orchestrierung oft angemessener, da der Ablauf explizit und zentral änderbar bleibt. Für lose gekoppelte, unabhängig entwickelte Randprozesse (z. B. „sende eine Benachrichtigung, wenn X passiert") ist Choreografie angemessen, da kein zentraler Koordinator für jede neue Reaktion angepasst werden muss. Eine Mischform ist üblich: kritische Kernprozesse orchestriert, periphere Reaktionen choreografiert.

## Scalability, Reliability, Security und Observability

Choreografie skaliert organisatorisch gut, da neue Services einfach auf bestehende Events reagieren können, ohne einen zentralen Koordinator ändern zu müssen. Reliability-Grenze: bei Choreografie ist unklar, wer für die Gesamtkorrektheit eines Prozesses verantwortlich ist, wenn ein Zwischenschritt fehlschlägt — es gibt keinen zentralen Ort, der den Gesamtstatus kennt, was Fehlerbehandlung und Monitoring erschwert.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Prozessablauf lässt sich nicht an einer Stelle nachvollziehen | reine Choreografie ohne zentrales Tracing | prüfen, ob verteiltes Tracing über alle beteiligten Event-Handler existiert |
| unklar, wer einen fehlgeschlagenen Prozessschritt behandelt | fehlende zentrale Verantwortlichkeit bei Choreografie | Fehlerbehandlungslogik über alle beteiligten Services suchen |
| neue Reaktion auf ein Event erfordert Änderung am Koordinator | eigentlich choreografierbarer Prozess wurde orchestriert | Kopplungsgrad des neuen Reaktionsbedarfs an den Koordinator prüfen |
| kritischer Geschäftsprozess ist schwer auditierbar | Choreografie für einen Prozess mit hohem Nachvollziehbarkeitsbedarf gewählt | Nachvollziehbarkeitsanforderung gegen gewähltes Strukturprinzip prüfen |

Security: bei Choreografie ist schwerer nachvollziehbar, welche Services auf welche sensiblen Ereignisse reagieren — ein Event-Zugriffsmodell (wer darf welche Events konsumieren) wird wichtiger als bei zentraler Orchestrierung. Observability: Choreografie erfordert verteiltes Tracing als Pflicht, nicht als Option, um den Gesamtprozess überhaupt sichtbar zu machen.

## Trade-offs und Entscheidungen

**Staff** prüft bei schwer nachvollziehbaren Prozessabläufen zuerst, ob eine Choreografie ohne ausreichendes Tracing vorliegt. **Principal** entscheidet pro Prozesstyp zwischen Choreografie (lose gekoppelte Randprozesse) und Orchestrierung (kritische Kernprozesse mit hohem Nachvollziehbarkeitsbedarf). **Chief** legt fest, für welche Prozessklassen explizite Orchestrierung aus Audit-/Compliance-Gründen verpflichtend ist.

Anti-Patterns: reine Choreografie für kritische, regulierte Geschäftsprozesse ohne zentrales Tracing; Orchestrierung für jeden trivialen Randprozess, was den Koordinator unnötig aufbläht und zum Flaschenhals macht; kein explizites Event-Zugriffsmodell bei Choreografie.

## Production Checklist

- [ ] Prozesstyp (kritisch/regulatorisch vs. lose gekoppelt) bewusst Choreografie oder Orchestrierung zugeordnet.
- [ ] Verteiltes Tracing für choreografierte Prozesse implementiert.
- [ ] Fehlerbehandlungsverantwortung für jeden Prozessschritt explizit geklärt.
- [ ] Event-Zugriffsmodell (wer darf welche Events konsumieren) definiert.

## Interviewfragen

### 1. Was ist der Hauptunterschied zwischen Choreografie und Orchestrierung?

**Antwort:** Bei Choreografie reagieren Services unabhängig auf Ereignisse ohne zentralen Überblick; bei Orchestrierung ruft ein zentraler Koordinator jeden Schritt explizit auf und kennt den vollständigen Ablauf.

### 2. Warum ist Choreografie schwerer nachvollziehbar als Orchestrierung?

**Antwort:** Der Gesamtprozessablauf emergiert aus vielen unabhängigen lokalen Reaktionen, ohne dass eine einzelne Stelle den vollständigen Ablauf kennt — er muss über verteiltes Tracing rekonstruiert werden.

### 3. Wann ist Choreografie angemessen?

**Antwort:** Für lose gekoppelte, unabhängig entwickelte Randprozesse, wo neue Reaktionen auf bestehende Ereignisse hinzugefügt werden können, ohne einen zentralen Koordinator ändern zu müssen.

### 4. Wann ist Orchestrierung vorzuziehen?

**Antwort:** Für kritische, regulierte oder häufig geänderte Geschäftsprozesse, wo Nachvollziehbarkeit und zentrale Änderbarkeit des Ablaufs wichtiger sind als maximale Entkopplung.

### 5. Was ist bei Choreografie besonders wichtig für Observability?

**Antwort:** Verteiltes Tracing über alle beteiligten Event-Handler ist Pflicht, da es sonst keine Möglichkeit gibt, den Gesamtprozessablauf nachzuvollziehen.

### 6. Widersprüchliche Anforderung: Team will maximale Entkopplung UND vollständige Nachvollziehbarkeit eines kritischen Prozesses — wie gehst du vor?

**Antwort:** Ich würde eine Mischform vorschlagen: den kritischen Kernablauf orchestriert mit zentraler Sichtbarkeit, während periphere, nicht-kritische Reaktionen (z. B. Benachrichtigungen) weiterhin choreografiert und lose gekoppelt bleiben.

## Praktische Labs

~~~python
event_log = []

def publish(event_name, data):
    event_log.append((event_name, data))

def inventory_handler(event_name, data):
    if event_name == "OrderCreated":
        publish("StockReserved", data)

def shipping_handler(event_name, data):
    if event_name == "StockReserved":
        publish("ShipmentScheduled", data)

publish("OrderCreated", {"order_id": 1})
inventory_handler(*event_log[-1])
shipping_handler(*event_log[-1])

flow = [e[0] for e in event_log]
assert flow == ["OrderCreated", "StockReserved", "ShipmentScheduled"]
print("Full flow only reconstructable by tracing every handler's reaction - the choreography trade-off.")
~~~

## Dependencies, Cross-References und Quellen

1. Fowler: [What do you mean by "Event-Driven"?](https://martinfowler.com/articles/201701-event-driven.html), martinfowler.com 2017, abgerufen 2026-09-17.

Produktspezifische Messaging-/Event-Broker-Tooling-Details vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Event-Mesh-Infrastruktur mit eingebautem Cross-Service-Tracing | Adopting | Tracing-Vollständigkeit gegen tatsächliche Event-Ketten-Komplexität prüfen. |
| Visualisierungstools für emergente Choreografie-Abläufe | Emerging | Vollständigkeit der Visualisierung gegen reale Produktionsabläufe validieren. |

Ein Team akzeptiert eine choreografierte Architektur für einen kritischen Prozess erst, wenn verteiltes Tracing und Fehlerbehandlungsverantwortung für jeden Schritt nachgewiesen sind.
