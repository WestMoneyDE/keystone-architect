---
{"id": "KB-0667", "title": "Reservierungen und Allocation", "domain": "29", "sequence": 5, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "ENTERPRISE"], "requires": [{"id": "KB-0666", "concepts": ["Bestand vs. Verfügbarkeit", "Atomare Verfügbarkeitsprüfung"], "needed_for": "Reservierungen sind der konkrete Mechanismus, über den die in KB-0666 beschriebene Verfügbarkeit tatsächlich reduziert wird"}], "related": ["KB-0665"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Reservierungsdauer, Freigabe und Zuteilung korrekt modellieren und für ein gegebenes Szenario eine Reservierungslogik entwerfen können, die abgebrochene Checkouts korrekt behandelt.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein Commerce-Vorhaben explizit gestalten, wie Teillieferungen und konkurrierende Nachfrage mit einem eindeutigen Bestandseigentümer koordiniert werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Reservierung ohne definierte Ablaufzeit dauerhaft Bestand blockiert, obwohl der zugehörige Checkout tatsächlich abgebrochen wurde.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Reservierungs- und Zuteilungslogik festlegen, die definierte Ablaufzeiten und eindeutige Bestandseigentümerschaft vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, verteilte Zuteilung über mehrere physische Lagerstandorte mit Prioritätsregeln im Detail ist Vertiefung.", "rationale": "Kern ist die grundlegende Reservierungs- und Zuteilungslogik mit eindeutigem Bestandseigentümer, nicht die Mehrstandort-Prioritätslogik."}}, "lab_validation": [{"lab_id": "KB-0667-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Veranschaulichung von Reservierungsablauf und Freigabe bei abgebrochenem Checkout, kein reales Commerce-System verwendet", "evidence": "Ein lokales Skript simuliert eine Reservierung mit definierter Ablaufzeit und zeigt, dass eine nicht abgeschlossene Reservierung nach Ablauf korrekt freigegeben wird und der Bestand wieder verfügbar ist.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Commerce-System getestet."}]}
---
# Reservierungen und Allocation

> **Ziel:** Reservierungen und Allocation sind der konkrete Mechanismus, über den die in KB-0666 beschriebene Verfügbarkeit tatsächlich verwaltet wird, aufgebaut auf drei Elementen: **Reservierungsdauer** (die Zeitspanne, für die ein Artikel für einen Kunden während des Checkout-Prozesses tatsächlich blockiert wird), **Freigabe** (der Mechanismus, der eine Reservierung nach Ablauf oder bei Abbruch tatsächlich wieder für andere Käufer verfügbar macht) und **Zuteilung** (die Entscheidung, welcher konkreten Bestellung ein physisch begrenzter Bestand bei Teillieferung oder konkurrierender Nachfrage tatsächlich zugewiesen wird). Der zentrale Punkt dieses Kapitels ist, dass jede Reservierung tatsächlich genau einen eindeutigen Bestandseigentümer (die konkrete Bestellung, die sie hält) haben muss — eine Reservierung ohne definierte Ablaufzeit oder ohne eindeutigen Eigentümer blockiert Bestand tatsächlich dauerhaft, auch wenn der zugehörige Checkout-Prozess tatsächlich längst abgebrochen wurde, was zu einer künstlichen, nicht durch tatsächliche Nachfrage begründeten Verknappung führt.

## Zweck, Mental Model und Dependencies

Reservierungsdauer muss explizit und begrenzt definiert sein: Ein Artikel wird für einen Kunden während des Checkout-Prozesses (etwa während der Eingabe von Zahlungsdaten) tatsächlich für eine begrenzte Zeit blockiert, damit der Kunde nicht während des Kaufvorgangs erfährt, dass der Artikel inzwischen an jemand anderen verkauft wurde — diese Dauer muss jedoch tatsächlich begrenzt sein, da eine unbegrenzte Reservierung bei einem abgebrochenen Checkout (etwa der Kunde schließt den Browser) den Bestand tatsächlich dauerhaft und unnötig blockieren würde. Freigabe ist der komplementäre Mechanismus zur Reservierungsdauer: Läuft eine Reservierung ab, ohne dass der zugehörige Checkout tatsächlich abgeschlossen wurde, muss der reservierte Bestand automatisch und zuverlässig wieder für andere Käufer freigegeben werden — ein System ohne zuverlässige Freigabe akkumuliert tatsächlich über die Zeit immer mehr "verlorene" Reservierungen, die Bestand blockieren, ohne dass eine tatsächliche Kaufabsicht mehr dahintersteht. Zuteilung wird relevant, wenn tatsächlich mehr Nachfrage als verfügbarer Bestand besteht (etwa bei einem limitierten Artikel) oder wenn eine Bestellung nur teilweise erfüllt werden kann (Teillieferung, weil nicht alle bestellten Artikel tatsächlich vollständig verfügbar sind) — die Zuteilungslogik muss explizit definieren, nach welchem Kriterium (etwa Bestellzeitpunkt, Priorität) verfügbarer Bestand konkurrierenden Bestellungen tatsächlich zugewiesen wird, statt dies implizit und damit potenziell inkonsistent zu handhaben. Der eindeutige Bestandseigentümer ist das zentrale Konsistenzprinzip: Jede Einheit reservierten oder zugeteilten Bestands muss tatsächlich genau einer konkreten Bestellung zugeordnet sein, niemals mehreren gleichzeitig — dies verhindert, dass zwei Bestellungen fälschlich beide glauben, dieselbe physische Einheit zu besitzen, was andernfalls zu genau dem in KB-0666 beschriebenen Overselling-Problem führen würde, hier jedoch auf der Ebene der konkreten Zuordnung statt der reinen Mengenprüfung.

~~~text
Reservations + Allocation = concrete mechanism managing KB-0666's availability, built on
  3 elements
  RESERVATION DURATION: timespan an item is ACTUALLY blocked for a customer during
  checkout
  RELEASE: mechanism ACTUALLY making a reservation available to other buyers again after
  expiry/abandonment
  ALLOCATION: decision on which concrete order ACTUALLY gets assigned physically limited
  stock under partial delivery or competing demand
KEY POINT: every reservation must ACTUALLY have exactly one unambiguous stock owner
  (the concrete order holding it)
  reservation w/o defined expiry or w/o unambiguous owner ACTUALLY blocks stock
  permanently even if associated checkout process ACTUALLY long abandoned -> artificial
  scarcity not grounded in actual demand
RESERVATION DURATION must be explicitly + boundedly defined: item ACTUALLY blocked for
  customer during checkout (entering payment info) for limited time so customer doesn't
  discover mid-purchase item was sold to someone else meanwhile
  duration must ACTUALLY be bounded -- unbounded reservation on abandoned checkout
  (customer closes browser) would ACTUALLY permanently+unnecessarily block stock
RELEASE = complementary mechanism to reservation duration: if reservation expires w/o
  associated checkout ACTUALLY completing, reserved stock must be automatically+reliably
  released back to other buyers
  system w/o reliable release ACTUALLY accumulates ever more "lost" reservations over
  time, blocking stock w/o actual purchase intent behind them anymore
ALLOCATION relevant when ACTUALLY more demand than available stock (limited item) or
  order only partially fulfillable (partial delivery, not all ordered items ACTUALLY
  fully available)
  allocation logic must explicitly define by which criterion (order timestamp, priority)
  available stock ACTUALLY gets assigned to competing orders, instead of handling this
  implicitly + thus potentially inconsistently
UNAMBIGUOUS STOCK OWNER = central consistency principle: every unit of reserved/allocated
  stock must ACTUALLY be assigned to exactly one concrete order, never multiple
  simultaneously
  prevents two orders falsely both believing they own same physical unit -- otherwise
  leads to exact overselling problem from KB-0666, here at level of concrete assignment
  instead of pure quantity check
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Begrenzte Reservierungsdauer | blockiert Artikel während Checkout nur befristet | verhindert dauerhafte Blockierung bei Abbruch |
| Zuverlässige Freigabe | gibt abgelaufene, nicht abgeschlossene Reservierungen frei | verhindert Akkumulation "verlorener" Reservierungen |
| Explizite Zuteilungskriterien | definiert Priorität bei konkurrierender Nachfrage/Teillieferung | verhindert implizite, inkonsistente Zuteilung |
| Eindeutiger Bestandseigentümer | jede Einheit genau einer Bestellung zugeordnet | verhindert Overselling auf Zuordnungsebene |

Implementierung: Jede Reservierung erhält eine explizite, begrenzte Ablaufzeit. Ein zuverlässiger, automatisierter Freigabemechanismus gibt abgelaufene Reservierungen zurück in die Verfügbarkeit. Zuteilungskriterien für konkurrierende Nachfrage und Teillieferung sind explizit dokumentiert. Jede reservierte oder zugeteilte Einheit ist eindeutig einer Bestellung zugeordnet.

## Scalability, Reliability, Security und Observability

Eine Reservierungs- und Allocation-Architektur skaliert über die Anzahl gleichzeitig aktiver Reservierungen; die Reliability-Grenze liegt darin, dass eine unzuverlässige Freigabe abgelaufener Reservierungen zu tatsächlich künstlicher Verknappung führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Artikel erscheint dauerhaft ausverkauft, obwohl tatsächlich Bestand vorhanden ist | abgelaufene Reservierungen werden nicht zuverlässig freigegeben | den Freigabemechanismus für abgelaufene Reservierungen prüfen und automatisieren |
| ein Kunde erfährt während des Checkouts, dass der Artikel bereits verkauft wurde | die Reservierungsdauer ist zu kurz oder wurde nicht korrekt implementiert | die Reservierungsdauer an die tatsächliche Checkout-Prozessdauer anpassen |
| zwei Bestellungen beanspruchen fälschlich dieselbe physische Einheit | der Bestandseigentümer ist nicht eindeutig einer Bestellung zugeordnet | die Zuordnung so implementieren, dass jede Einheit genau einer Bestellung zugewiesen ist |

Security: Der Freigabemechanismus sollte gegen manipulierte oder verzögerte Client-Anfragen abgesichert sein, die eine Reservierung künstlich verlängern könnten. Observability: Die tatsächliche Anzahl abgelaufener, nicht abgeschlossener Reservierungen ist ein zentrales Signal zur Bewertung der Checkout-Conversion und der Freigabemechanismus-Zuverlässigkeit.

## Trade-offs und Entscheidungen

**Staff** implementiert eine korrekte, befristete Reservierung mit Freigabemechanismus für ein gegebenes Szenario. **Principal** entwirft die vollständige Reservierungs- und Zuteilungsarchitektur mit expliziten Kriterien für ein Commerce-Vorhaben. **Chief** legt unternehmensweite Standards für Reservierungsdauer und Zuteilungskriterien fest.

Anti-Patterns: Reservierungen ohne definierte Ablaufzeit implementieren; keinen zuverlässigen, automatisierten Freigabemechanismus für abgelaufene Reservierungen vorsehen; Zuteilung bei konkurrierender Nachfrage implizit statt anhand expliziter Kriterien handhaben.

## Production Checklist

- [ ] Jede Reservierung hat eine explizite, begrenzte Ablaufzeit.
- [ ] Ein zuverlässiger, automatisierter Freigabemechanismus für abgelaufene Reservierungen existiert.
- [ ] Zuteilungskriterien für konkurrierende Nachfrage und Teillieferung sind explizit dokumentiert.
- [ ] Jede reservierte oder zugeteilte Einheit ist eindeutig einer Bestellung zugeordnet.

## Interviewfragen

### 1. Warum muss eine Reservierung eine begrenzte Ablaufzeit haben?

**Antwort:** Damit ein abgebrochener Checkout-Prozess den Bestand nicht dauerhaft und unnötig blockiert.

### 2. Was passiert ohne einen zuverlässigen Freigabemechanismus für abgelaufene Reservierungen?

**Antwort:** Das System akkumuliert über die Zeit immer mehr "verlorene" Reservierungen, die Bestand blockieren, ohne dass eine tatsächliche Kaufabsicht mehr dahintersteht, was zu künstlicher Verknappung führt.

### 3. Warum ist ein eindeutiger Bestandseigentümer für jede reservierte Einheit notwendig?

**Antwort:** Um zu verhindern, dass zwei Bestellungen fälschlich beide glauben, dieselbe physische Einheit zu besitzen, was zu Overselling führen würde.

### 4. Wann wird eine explizite Zuteilungslogik relevant?

**Antwort:** Wenn tatsächlich mehr Nachfrage als verfügbarer Bestand besteht oder eine Bestellung nur teilweise erfüllt werden kann.

### 5. Wie gehst du vor, wenn ein Artikel dauerhaft ausverkauft erscheint, obwohl tatsächlich Bestand vorhanden ist?

**Antwort:** Ich prüfe, ob abgelaufene Reservierungen zuverlässig freigegeben werden, und automatisiere den Freigabemechanismus, falls dies nicht der Fall ist.

### 6. Widersprüchliche Anforderung: Das Marketing-Team will eine großzügige Reservierungsdauer, um Kunden während des Checkouts nicht zu verlieren, UND die Organisation will maximale Bestandsverfügbarkeit für andere Käufer — wie gehst du vor?

**Antwort:** Ich würde die Reservierungsdauer eng an die tatsächlich gemessene, typische Checkout-Prozessdauer koppeln statt sie pauschal großzügig zu bemessen, und zusätzlich eine vorzeitige Freigabe bei erkanntem Checkout-Abbruch (etwa Browser-Schließung) implementieren, um beide Ziele gleichzeitig zu bedienen.

## Praktische Labs

~~~python
# Local, deterministic simulation of reservation expiry and release (executed locally, no real commerce system):

import time

def reserve(item_id, reservations, ttl_seconds, now):
    reservations[item_id] = {"expires_at": now + ttl_seconds, "owner": "order-123"}

def release_expired(reservations, now):
    expired = [k for k, v in reservations.items() if v["expires_at"] < now]
    for k in expired:
        del reservations[k]
    return expired

reservations = {}
reserve("sku-1", reservations, ttl_seconds=600, now=time.time() - 700)  # already expired
print(release_expired(reservations, now=time.time()))
print(reservations)
~~~

## Dependencies, Cross-References und Quellen

1. Medusa: [Medusa Inventory Module — Reservations Documentation](https://docs.medusajs.com/resources/commerce-modules/inventory/reservations), abgerufen 2026-09-18.
2. AWS: [Amazon DynamoDB — Conditional Writes for Atomic Reservation Patterns](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html), abgerufen 2026-09-18.

Dieses Kapitel konkretisiert die in KB-0666 (Inventory Consistency) beschriebene Unterscheidung von Bestand und Verfügbarkeit auf den konkreten Reservierungs- und Zuteilungsmechanismus.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Prädiktive, KI-gestützte Reservierungsdauer-Anpassung basierend auf historischem Checkout-Abbruchverhalten pro Kundensegment | Emerging | Bei künftigen Neuvorhaben mit hohem Checkout-Volumen evaluieren, jedoch bis zur belastbaren Validierung weiterhin auf feste, konservativ bemessene Reservierungsdauern setzen. |

Ein Team akzeptiert eine Reservierungs- und Allocation-Implementierung erst, wenn begrenzte Reservierungsdauer, zuverlässige Freigabe und eindeutige Bestandseigentümerschaft nachweislich implementiert sind.
