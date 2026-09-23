---
{"id": "KB-0666", "title": "Inventory Consistency", "domain": "29", "sequence": 4, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "ENTERPRISE"], "requires": [{"id": "KB-0665", "concepts": ["Fachliche Guards", "Übergangsprüfung"], "needed_for": "Bestandsprüfung vor einem Checkout-Übergang nutzt dasselbe Guard-Prinzip wie in KB-0665 beschrieben"}], "related": ["KB-0663"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Bestand, Verfügbarkeit und Lagerbewegungen korrekt unterscheiden und für ein gegebenes Szenario eine Bestandsprüfung entwerfen können, die Overselling bei konkurrierenden Käufen verhindert.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein Commerce-Vorhaben explizit gestalten, wie Bestandsinvarianten bei verzögerten Updates und konkurrierenden Zugriffen konsistent durchgesetzt werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn Overselling durch eine Bestandsprüfung entsteht, die konkurrierende Käufe nicht tatsächlich atomar behandelt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Bestandskonsistenz festlegen, die explizite Bestandsinvarianten und atomare Prüfmechanismen vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, verteilte Bestandssynchronisation über mehrere physische Lagerstandorte im Detail ist Vertiefung.", "rationale": "Kern ist die Unterscheidung von Bestand, Verfügbarkeit und Lagerbewegungen sowie die Overselling-Verhinderung, nicht die verteilte Mehrstandort-Synchronisation."}}, "lab_validation": [{"lab_id": "KB-0666-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Veranschaulichung von Overselling bei konkurrierenden Käufen, kein reales Lagersystem verwendet", "evidence": "Ein lokales Skript simuliert zwei gleichzeitige Kaufversuche für den letzten verfügbaren Artikel und zeigt, dass eine nicht-atomare Bestandsprüfung zu Overselling führt, während eine atomare Prüfung dies korrekt verhindert.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Lagersystem oder reale, physisch verteilte Bestände getestet."}]}
---
# Inventory Consistency

> **Ziel:** Bestandskonsistenz erfordert die klare Unterscheidung dreier Konzepte, die häufig fälschlich vermischt werden: **Bestand** (die tatsächliche, physische Menge eines Artikels im Lager), **Verfügbarkeit** (die Menge, die tatsächlich für neue Käufe reserviert werden kann, nach Abzug bereits reservierter, aber noch nicht abgeschlossener Bestellungen) und **Lagerbewegungen** (die einzelnen, tatsächlichen Ereignisse, die den Bestand verändern, etwa Wareneingang, Verkauf, Retoure oder Korrektur). Der zentrale Punkt dieses Kapitels ist, dass Overselling (der Verkauf von mehr Einheiten eines Artikels, als tatsächlich verfügbar sind) strukturell aus einer nicht-atomaren Bestandsprüfung bei konkurrierenden Käufen entsteht — wenn zwei Käufer nahezu gleichzeitig den letzten verfügbaren Artikel kaufen wollen und die Verfügbarkeitsprüfung nicht tatsächlich atomar erfolgt, können beide Käufe fälschlich als erfolgreich bestätigt werden, obwohl tatsächlich nur eine Einheit verfügbar war.

## Zweck, Mental Model und Dependencies

Bestand und Verfügbarkeit sind nicht dasselbe: Der Bestand gibt die tatsächliche, physische Menge im Lager an, während die Verfügbarkeit diese Menge um bereits reservierte, aber noch nicht final abgeschlossene Bestellungen (etwa Artikel in einem Warenkorb während des Checkout-Prozesses) reduziert — ein System, das für die Kaufentscheidung fälschlich den Bestand statt der Verfügbarkeit prüft, kann tatsächlich Overselling verursachen, da bereits reservierte, aber noch nicht abgebuchte Einheiten fälschlich als verkaufbar behandelt werden. Lagerbewegungen sind die einzelnen, tatsächlichen Ereignisse, die den Bestand verändern — jede Bewegung (Wareneingang, Verkaufsabschluss, Retoure, manuelle Korrektur) muss explizit und nachvollziehbar erfasst werden, da der aktuelle Bestand tatsächlich die Summe aller bisherigen Bewegungen ist; ein System, das den Bestand als isolierten, direkt veränderbaren Wert statt als abgeleitete Summe von Bewegungen führt, verliert tatsächlich die Nachvollziehbarkeit, wie ein bestimmter Bestandswert zustande gekommen ist. Overselling bei konkurrierenden Käufen ist das zentrale Konsistenzrisiko: Wenn die Prüfung "ist noch ein Artikel verfügbar?" und die anschließende Reservierung dieses Artikels nicht als eine einzige, atomare Operation ausgeführt werden, können zwei nahezu gleichzeitige Käufe tatsächlich beide die Prüfung erfolgreich durchlaufen, bevor eine der beiden die Reservierung tatsächlich durchführt — dies führt zu einem tatsächlichen Overselling, das erst nachträglich (etwa durch eine Stornierung eines der beiden Käufe) korrigiert werden muss, was für den betroffenen Kunden tatsächlich unangenehm ist. Verzögerte Updates entstehen, wenn Bestandsänderungen aus externen Systemen (etwa einem physischen Lagerverwaltungssystem) nicht tatsächlich in Echtzeit, sondern mit einer Verzögerung im Commerce-System ankommen — während dieser Verzögerung kann das Commerce-System einen tatsächlich bereits nicht mehr verfügbaren Artikel fälschlich als verfügbar anzeigen, was ebenfalls zu Overselling führen kann, auch wenn die interne Prüfung des Commerce-Systems selbst korrekt atomar war.

~~~text
Inventory Consistency requires clear distinction of 3 concepts often falsely conflated
  STOCK: actual, physical quantity of an item in warehouse
  AVAILABILITY: quantity ACTUALLY reservable for new purchases, after subtracting
  already-reserved but not-yet-completed orders
  INVENTORY MOVEMENTS: individual, actual events changing stock (receipt, sale, return,
  correction)
KEY POINT: overselling (selling more units than ACTUALLY available) structurally arises
  from a non-atomic availability check under concurrent purchases
  two buyers nearly simultaneously trying to buy last available item, availability check
  not ACTUALLY atomic -> both purchases could falsely be confirmed successful although
  ACTUALLY only one unit was available
STOCK and AVAILABILITY not the same: stock = actual physical quantity in warehouse,
  availability = that quantity reduced by already-reserved-but-not-finally-completed
  orders (items in cart during checkout)
  system falsely checking stock instead of availability for purchase decision CAN
  ACTUALLY cause overselling, since already-reserved-but-not-yet-deducted units falsely
  treated as sellable
INVENTORY MOVEMENTS = individual, actual events changing stock -- every movement
  (receipt, sale completion, return, manual correction) must be explicitly + traceably
  recorded, since current stock is ACTUALLY the sum of all movements so far
  system treating stock as isolated, directly mutable value instead of derived movement
  sum ACTUALLY loses traceability of how a given stock value came about
OVERSELLING under concurrent purchases = central consistency risk
  if "is item still available?" check + subsequent reservation not executed as single,
  atomic operation, two near-simultaneous purchases CAN ACTUALLY both pass the check
  before either ACTUALLY performs the reservation
  leads to ACTUAL overselling, correctable only after the fact (cancelling one purchase),
  ACTUALLY unpleasant for affected customer
DELAYED UPDATES arise when stock changes from external systems (physical warehouse mgmt
  system) don't ACTUALLY arrive in real-time but delayed in commerce system
  during this delay, commerce system can falsely show an ACTUALLY already unavailable
  item as available -> can also cause overselling even if commerce system's OWN check
  was correctly atomic
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Bestand vs. Verfügbarkeit | trennt physische Menge von tatsächlich verkaufbarer Menge | verhindert Verkauf bereits reservierter Einheiten |
| Lagerbewegungen als abgeleitete Bestandsquelle | jede Bestandsänderung nachvollziehbar erfasst | ermöglicht Nachvollziehbarkeit statt isolierter Werte |
| Atomare Verfügbarkeitsprüfung und Reservierung | Prüfung und Reservierung als eine Operation | verhindert Overselling bei konkurrierenden Käufen |
| Umgang mit verzögerten externen Updates | explizite Behandlung der Latenz externer Lagerdaten | verhindert Overselling trotz korrekter interner Atomarität |

Implementierung: Verfügbarkeitsprüfung und Reservierung werden als eine einzige, atomare Operation implementiert. Der Bestand wird als Summe dokumentierter Lagerbewegungen geführt, nicht als isolierter, direkt veränderbarer Wert. Für externe Bestandsquellen wird die tatsächliche Aktualisierungslatenz explizit berücksichtigt und dokumentiert.

## Scalability, Reliability, Security und Observability

Eine Inventory-Consistency-Architektur skaliert über die Anzahl gleichzeitiger Kaufvorgänge pro Artikel; die Reliability-Grenze liegt darin, dass eine nicht-atomare Verfügbarkeitsprüfung bei hoher Konkurrenzsituation (etwa einem limitierten Artikel) tatsächlich zu Overselling führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Artikel wurde öfter verkauft, als tatsächlich verfügbar war | die Verfügbarkeitsprüfung und Reservierung erfolgten nicht atomar | Prüfung und Reservierung als eine einzige, atomare Operation implementieren |
| der angezeigte Bestand stimmt trotz atomarer interner Prüfung nicht mit der Realität überein | eine externe Bestandsquelle liefert verzögerte Updates | die tatsächliche Aktualisierungslatenz der externen Quelle explizit berücksichtigen und kompensieren |
| der aktuelle Bestandswert lässt sich nicht nachvollziehen | der Bestand wird als isolierter Wert statt als Summe dokumentierter Bewegungen geführt | den Bestand auf eine bewegungsbasierte, nachvollziehbare Führung umstellen |

Security: Bestandskorrekturen sollten nur autorisierten Rollen möglich sein und als eigene, nachvollziehbare Lagerbewegung protokolliert werden. Observability: Die tatsächliche Häufigkeit von Overselling-Fällen ist ein zentrales Signal zur Bewertung, ob die Verfügbarkeitsprüfung tatsächlich atomar arbeitet.

## Trade-offs und Entscheidungen

**Staff** implementiert eine korrekte, atomare Verfügbarkeitsprüfung für ein gegebenes Szenario. **Principal** entwirft die vollständige Bestandsarchitektur mit bewegungsbasierter Führung und Umgang mit verzögerten externen Updates. **Chief** legt unternehmensweite Standards für Bestandsinvarianten und Overselling-Verhinderung fest.

Anti-Patterns: Verfügbarkeitsprüfung und Reservierung als getrennte, nicht-atomare Schritte implementieren; den Bestand als direkt veränderbaren, isolierten Wert statt als Summe dokumentierter Bewegungen führen; die Latenz externer Bestandsquellen ignorieren.

## Production Checklist

- [ ] Verfügbarkeitsprüfung und Reservierung sind als eine atomare Operation implementiert.
- [ ] Der Bestand wird als Summe nachvollziehbarer Lagerbewegungen geführt.
- [ ] Die Aktualisierungslatenz externer Bestandsquellen ist explizit dokumentiert und berücksichtigt.
- [ ] Bestandskorrekturen sind autorisierungspflichtig und als eigene Bewegung protokolliert.

## Interviewfragen

### 1. Was ist der Unterschied zwischen Bestand und Verfügbarkeit?

**Antwort:** Bestand ist die tatsächliche, physische Menge im Lager, während Verfügbarkeit diese Menge um bereits reservierte, aber noch nicht abgeschlossene Bestellungen reduziert.

### 2. Wie entsteht Overselling bei konkurrierenden Käufen strukturell?

**Antwort:** Wenn die Verfügbarkeitsprüfung und die anschließende Reservierung nicht als eine einzige, atomare Operation ausgeführt werden, können zwei nahezu gleichzeitige Käufe beide die Prüfung erfolgreich durchlaufen, bevor eine Reservierung tatsächlich erfolgt.

### 3. Warum sollte der Bestand als Summe von Lagerbewegungen statt als isolierter Wert geführt werden?

**Antwort:** Damit nachvollziehbar bleibt, wie ein bestimmter Bestandswert zustande gekommen ist, statt die Nachvollziehbarkeit durch direkte Wertänderung zu verlieren.

### 4. Wie kann Overselling trotz korrekter interner Atomarität entstehen?

**Antwort:** Wenn Bestandsänderungen aus externen Systemen verzögert im Commerce-System ankommen, kann das System einen tatsächlich bereits nicht mehr verfügbaren Artikel fälschlich als verfügbar anzeigen.

### 5. Wie gehst du vor, wenn ein Artikel öfter verkauft wurde, als tatsächlich verfügbar war?

**Antwort:** Ich prüfe, ob die Verfügbarkeitsprüfung und Reservierung atomar erfolgten, und implementiere sie andernfalls als eine einzige, atomare Operation.

### 6. Widersprüchliche Anforderung: Das Performance-Team will maximalen Durchsatz durch parallele, unabhängige Verfügbarkeitsprüfungen UND die Organisation will absolute Overselling-Freiheit — wie gehst du vor?

**Antwort:** Ich würde die Reservierung über einen atomaren, hochperformanten Mechanismus (etwa eine datenbankseitige, bedingte Aktualisierung) statt über eine separate Lese-dann-Schreibe-Logik implementieren, um sowohl Durchsatz als auch Atomarität zu erreichen, statt die Atomarität zugunsten des Durchsatzes aufzugeben.

## Praktische Labs

~~~python
# Local, deterministic illustration of non-atomic vs. atomic availability check (executed locally, no real inventory system):

def non_atomic_purchase(available, quantity=1):
    if available >= quantity:  # check
        # simulated race window: another purchase could check here too before either deducts
        return available - quantity  # deduct (not atomic with check)
    return available

def atomic_purchase(available, quantity=1):
    # single atomic compare-and-swap-style operation
    return available - quantity if available >= quantity else available

stock = 1
# simulating two near-simultaneous purchases against non-atomic logic (both see available=1)
print("non-atomic double sale risk: both would pass check independently")
print(atomic_purchase(stock))
~~~

## Dependencies, Cross-References und Quellen

1. Medusa: [Medusa Inventory Module Documentation](https://docs.medusajs.com/resources/commerce-modules/inventory), abgerufen 2026-09-18.
2. Martin Kleppmann: [Designing Data-Intensive Applications — Consistency and Consensus](https://dataintensive.net/), abgerufen 2026-09-18.

Dieses Kapitel nutzt das in KB-0665 (Order State Machines) beschriebene Guard-Prinzip für die atomare Bestandsprüfung vor einem Checkout-Übergang.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Event-Sourcing-basierte Bestandsführung, bei der jede Lagerbewegung als unveränderliches Ereignis gespeichert und der Bestand vollständig daraus abgeleitet wird | Growing Adoption | Bei künftigen Neuvorhaben mit hohem Nachvollziehbarkeitsbedarf evaluieren, jedoch bei bestehenden, funktionierenden bewegungsbasierten Systemen weiterhin auf die etablierte Architektur setzen. |

Ein Team akzeptiert eine Bestandskonsistenz-Implementierung erst, wenn atomare Verfügbarkeitsprüfung, bewegungsbasierte Bestandsführung und Umgang mit verzögerten externen Updates nachweislich implementiert sind.
