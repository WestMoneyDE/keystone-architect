---
{"id": "KB-0137", "title": "Microservices und Servicegrenzen", "domain": "06", "sequence": 9, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0136", "concepts": ["Modularer Monolith"], "needed_for": "both"}, {"id": "KB-0109", "concepts": ["Sagas"], "needed_for": "understanding"}], "related": ["KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Zwei Services mit eigener Datenhoheit über eine API kommunizieren lassen und die Kosten einer Cross-Service-Konsistenzanforderung zeigen.", "rationale": "Kein reales verteiltes System nötig, um die Kernkonsequenzen zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Servicegrenzen anhand Deploybarkeit, Dateneigentum und Teamgrenzen statt technischer Bequemlichkeit ziehen.", "rationale": "Falsch gezogene Servicegrenzen erzeugen verteilte Kopplung ohne den Nutzen unabhängiger Services."}, "STAFF-TARGET": {"active": true, "scope": "Verteilte Transaktionskosten und Kopplung als direkte Folge falsch geschnittener Servicegrenzen diagnostizieren.", "rationale": "Das ist eine häufige, teure Fehlentscheidung bei vorschneller Microservices-Einführung."}, "CHIEF-TARGET": {"active": true, "scope": "Microservices-Einführung an nachgewiesenem organisatorischem und technischem Bedarf statt an Trendfolge ausrichten.", "rationale": "Microservices lösen primär Organisations-/Skalierungsprobleme, nicht automatisch technische Qualität."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Service-Mesh-Infrastruktur und Multi-Service-Deployment-Orchestrierung im Detail sind Vertiefung.", "rationale": "Kern ist die Servicegrenzen-Entscheidung selbst, nicht die Betriebs-Tooling-Wahl."}}, "lab_validation": [{"lab_id": "KB-0137-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für zwei Services mit Cross-Service-Konsistenzanforderung", "evidence": "Eine fachliche Operation, die beide Services konsistent ändern muss, erfordert eine Saga statt einer einfachen lokalen Transaktion, was die zusätzliche Komplexität sichtbar macht.", "limitations": "Kein reales verteiltes System, keine Produktion."}]}
---
# Microservices und Servicegrenzen

> **Ziel:** Microservices teilen ein System in unabhängig deploybare Services mit eigener Datenhoheit auf. Die Servicegrenze sollte an Deploybarkeit, Dateneigentum und Teamgrenzen ausgerichtet sein — nicht an technischer Bequemlichkeit. Eine falsch gezogene Grenze erzeugt verteilte Kopplung und Transaktionskosten (Sagas statt lokaler Transaktionen), ohne den eigentlichen Nutzen unabhängiger Services zu liefern.

## Zweck, Mental Model und Dependencies

Ein Microservice ist unabhängig deploybar (kann ohne Koordination mit anderen Services released werden), besitzt seine Daten exklusiv (kein anderer Service greift direkt auf seine Datenbank zu) und ist meist einem Team zugeordnet (Conway's Law: Systemstruktur spiegelt Organisationsstruktur). Der entscheidende Unterschied zum modularen Monolithen ([KB-0136](08-modularer-monolith.md)): die Modulgrenze wird zur physischen Prozess-/Netzwerkgrenze, was Cross-Service-Operationen sofort alle Kosten verteilter Systeme einführt (Netzwerkfehler, Latenz, keine lokalen Transaktionen mehr). Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0136](08-modularer-monolith.md) und [KB-0109](../05-distributed-systems/09-sagas-und-kompensation.md).

~~~text
Modular Monolith:  Module A -> Module B (in-process call, one local transaction possible)
Microservices:      Service A -> network call -> Service B (two separate transactions, needs a Saga for consistency)
~~~

## Core Concepts, Architektur und Implementierung

| Kriterium für Servicegrenze | Frage | Falsche Grenze |
|---|---|---|
| Deploybarkeit | kann dieser Bereich unabhängig released werden? | künstliche Aufteilung ohne unabhängige Release-Kadenz |
| Dateneigentum | besitzt der Service seine Daten exklusiv? | mehrere Services teilen sich dieselbe Datenbank |
| Teamgrenze | entspricht die Servicegrenze einer Teamverantwortung? | ein Team muss über mehrere Services hinweg koordinieren für eine einzige Änderung |
| Transaktionskosten | wie oft braucht eine fachliche Operation Cross-Service-Konsistenz? | häufige Cross-Service-Transaktionen deuten auf falsch gezogene Grenze hin |

Implementierung: Servicegrenzen werden idealerweise aus einem bereits bewiesenen modularen Monolithen extrahiert, dessen interne Modulgrenzen sich als stabil und wenig gekoppelt erwiesen haben ([KB-0136](08-modularer-monolith.md)) — nicht von Anfang an als „Greenfield Microservices" entworfen, ohne die tatsächlichen fachlichen Grenzen zu kennen. Jeder Service besitzt seine eigene Datenbank exklusiv; Cross-Service-Datenzugriffe laufen ausschließlich über die API des besitzenden Services. Fachliche Operationen, die mehrere Services betreffen, werden als Saga mit Kompensation modelliert, nie als verteilte 2PC-Transaktion.

## Scalability, Reliability, Security und Observability

Microservices erlauben unabhängige Skalierung einzelner Services entsprechend ihrer individuellen Last. Reliability-Grenze: jede Servicegrenze führt eine neue potenzielle Fehlerquelle (Netzwerk, Timeout, Teilausfall) ein — eine zu feingranulare Aufteilung erzeugt mehr Fehlerfläche und Betriebskomplexität, als der Modularitätsgewinn rechtfertigt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| jede fachliche Änderung erfordert koordinierte Deployments mehrerer Services | Servicegrenze folgt nicht echter fachlicher/Team-Trennung | Häufigkeit gemeinsamer Deployments zwischen den betroffenen Services messen |
| viele Cross-Service-Aufrufe für eine einzige Nutzeranfrage | Services zu feingranular geschnitten (Nano-Services) | Anzahl Service-Aufrufe pro typischer Nutzeranfrage zählen |
| zwei Services teilen sich dieselbe Datenbank | Dateneigentum nicht eingehalten, verdeckte Kopplung | Datenbankzugriffe beider Services auf gemeinsame Tabellen prüfen |
| Team muss ständig mit anderen Teams koordinieren für eigene Änderungen | Servicegrenze entspricht nicht der tatsächlichen Teamgrenze | organisatorische Abhängigkeiten gegen Servicegrenzen abgleichen |

Security: jede Servicegrenze ist auch eine Netzwerkgrenze und damit ein potenzieller Angriffspunkt (Authentifizierung/Autorisierung zwischen Services muss explizit durchgesetzt werden, nicht implizit vom gemeinsamen Prozessraum wie im Monolithen profitieren). Observability wird bei Microservices deutlich anspruchsvoller: verteiltes Tracing über Service-Grenzen hinweg ist Pflicht, um eine einzelne Nutzeranfrage über mehrere Services nachzuvollziehen.

## Trade-offs und Entscheidungen

**Staff** misst die tatsächliche Häufigkeit von Cross-Service-Konsistenzanforderungen und Deployment-Koordination als Signal für falsch gezogene Grenzen. **Principal** bevorzugt Servicegrenzen-Extraktion aus bewiesenen Modulgrenzen statt Greenfield-Microservices-Design. **Chief** entscheidet Microservices-Einführung anhand nachgewiesenen organisatorischen (Teamgröße, unabhängige Release-Notwendigkeit) und technischen (Skalierungs-)Bedarfs, nicht anhand von Architektur-Trends.

Anti-Patterns: Microservices als Standardarchitektur unabhängig von tatsächlichem Bedarf einführen; Servicegrenzen entlang technischer Schichten statt fachlicher Verantwortung ziehen (z. B. ein „Datenbank-Service" und ein „Business-Logic-Service"); geteilte Datenbank zwischen mehreren Services „für Einfachheit".

## Production Checklist

- [ ] Servicegrenzen an Deploybarkeit, Dateneigentum und Teamgrenzen ausgerichtet, nicht an technischer Bequemlichkeit.
- [ ] Jeder Service besitzt seine Datenbank exklusiv, keine geteilte Datenbank zwischen Services.
- [ ] Cross-Service-Konsistenzanforderungen als Sagas modelliert, nicht als verteilte 2PC-Transaktionen.
- [ ] Verteiltes Tracing über Servicegrenzen hinweg implementiert.

## Interviewfragen

### 1. Was sind die drei Hauptkriterien für eine gute Servicegrenze?

**Antwort:** Unabhängige Deploybarkeit, exklusives Dateneigentum und Ausrichtung an der tatsächlichen Teamverantwortung — nicht rein technische Aufteilung.

### 2. Warum ist eine geteilte Datenbank zwischen zwei Microservices ein Problem?

**Antwort:** Sie erzeugt verdeckte Kopplung, die die eigentliche Idee unabhängiger Services untergräbt — ein Schema-Änderung in der geteilten Datenbank kann beide Services gleichzeitig brechen.

### 3. Wie unterscheidet sich eine Cross-Modul-Operation im modularen Monolithen von einer Cross-Service-Operation bei Microservices?

**Antwort:** Im Monolithen kann eine lokale Transaktion beide Module atomar ändern; bei Microservices erfordert dieselbe fachliche Operation eine Saga mit expliziter Kompensation, da keine gemeinsame lokale Transaktion mehr möglich ist.

### 4. Was deutet auf eine zu feingranulare Microservices-Aufteilung hin?

**Antwort:** Sehr viele Cross-Service-Aufrufe für eine einzelne typische Nutzeranfrage, sowie häufige koordinierte Deployments mehrerer Services für eine einzige fachliche Änderung.

### 5. Warum empfiehlt sich oft, Servicegrenzen aus einem bewiesenen modularen Monolithen zu extrahieren, statt Greenfield-Microservices zu entwerfen?

**Antwort:** Weil die tatsächlichen, stabilen fachlichen Grenzen oft erst durch praktische Erfahrung mit dem System sichtbar werden; ein Greenfield-Design ohne diese Erfahrung führt häufiger zu falsch geschnittenen, später teuer zu korrigierenden Grenzen.

### 6. Widersprüchliche Anforderung: Management will maximale Team-Unabhängigkeit UND einfache, konsistente Cross-Team-Datenoperationen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass echte Team-Unabhängigkeit über Servicegrenzen zwangsläufig verteilte Konsistenzkosten (Sagas statt Transaktionen) mit sich bringt; ich würde vorschlagen, kritische, häufig gemeinsam geänderte Datenbereiche in einem gemeinsamen Service/Modul zu belassen und nur tatsächlich unabhängige Bereiche zu trennen.

## Praktische Labs

~~~python
class OrderService:
    def __init__(self):
        self.orders = {}
    def create(self, order_id):
        self.orders[order_id] = "pending"

class InventoryService:
    def __init__(self):
        self.stock = {"item1": 5}
    def reserve(self, item, qty):
        if self.stock[item] < qty:
            raise ValueError("insufficient stock")
        self.stock[item] -= qty

orders = OrderService()
inventory = InventoryService()

def place_order_saga(order_id, item, qty):
    orders.create(order_id)  # step 1: local transaction in OrderService
    try:
        inventory.reserve(item, qty)  # step 2: separate transaction in InventoryService
    except ValueError:
        orders.orders[order_id] = "cancelled"  # compensation, no shared transaction exists
        raise

place_order_saga("o1", "item1", 3)
assert orders.orders["o1"] == "pending"
print("Cross-service consistency required an explicit saga step, unlike a single local transaction.")
~~~

## Dependencies, Cross-References und Quellen

1. Newman: [Building Microservices](https://samnewman.io/books/building_microservices_2nd_edition/), O'Reilly 2021, abgerufen 2026-09-17.
2. Fowler, Lewis: [Microservices](https://martinfowler.com/articles/microservices.html), martinfowler.com, abgerufen 2026-09-17.

Produktspezifische Service-Mesh- und Orchestrierungs-Tooling-Details vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Extraktion aus modularem Monolithen als bevorzugter Startpunkt statt Greenfield-Microservices | Established als Best Practice | Extraktionsprozess gegen tatsächliche Modulgrenzen-Stabilität prüfen. |
| Automatisierte Erkennung von Cross-Service-Kopplung aus Traffic-/Deployment-Daten | Adopting | Ergebnis gegen manuelle Architekturbewertung validieren. |

Ein Team akzeptiert eine Microservices-Aufteilung erst, wenn Servicegrenzen an Deploybarkeit, Dateneigentum und Teamverantwortung nachgewiesen ausgerichtet sind und Cross-Service-Konsistenzanforderungen als Sagas modelliert wurden.
