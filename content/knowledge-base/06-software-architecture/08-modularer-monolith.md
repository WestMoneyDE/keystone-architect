---
{"id": "KB-0136", "title": "Modularer Monolith", "domain": "06", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0130", "concepts": ["Bounded Context"], "needed_for": "both"}], "related": ["KB-0137", "KB-0562", "KB-0720"], "applies": ["KB-0137", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Zwei Module mit expliziter API-Grenze innerhalb eines Prozesses lokal implementieren und einen Grenzverstoß (direkter Zugriff auf internes Modul-Datenmodell) demonstrieren.", "rationale": "Kein reales verteiltes System nötig, um das Modularitätsprinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Module mit expliziter API und eigener Datenhoheit entwerfen, ohne die Modulgrenzen mit Prozessgrenzen zu verwechseln.", "rationale": "Modularität und Deployment-Granularität sind unabhängige Entscheidungen."}, "STAFF-TARGET": {"active": true, "scope": "Eine versteckte Modulkopplung durch direkten Datenbankzugriff über Modulgrenzen hinweg identifizieren.", "rationale": "Das ist die häufigste Ursache, warum ein 'modularer' Monolith de facto nicht modular ist."}, "CHIEF-TARGET": {"active": true, "scope": "Modularer Monolith als bewussten Zwischenschritt oder Dauerzustand gegenüber vorschneller Microservices-Fragmentierung positionieren.", "rationale": "Vorschnelle Microservices-Aufteilung ohne bewiesene Modulgrenzen erzeugt verteilte Kopplung ohne deren Nutzen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Modul-Extraktionsstrategien (späterer Übergang zu separaten Services) im Detail sind Vertiefung.", "rationale": "Kern ist die saubere Modulgrenze mit eigener Datenhoheit innerhalb eines Deployments."}}, "lab_validation": [{"lab_id": "KB-0136-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für zwei Module mit expliziter API und getrennten Datenspeichern", "evidence": "Ein Versuch, direkt auf die interne Datenstruktur von Modul B aus Modul A zuzugreifen, wird als Verstoß gegen die Modulgrenze erkannt.", "limitations": "Kein reales System, keine Produktion."}]}
---
# Modularer Monolith

> **Ziel:** Ein modularer Monolith organisiert ein System in Module mit expliziten APIs und eigener Datenhoheit, während alle Module weiterhin gemeinsam als ein Prozess deployt werden. Modularität (klare Grenzen) und Deployment-Granularität (wie viele separate Prozesse) sind unabhängige Entscheidungen — ein modularer Monolith trennt sie bewusst.

## Zweck, Mental Model und Dependencies

Der verbreitete Irrglaube ist, dass nur Microservices echte Modularität erzwingen. Tatsächlich kann ein Monolith intern in Module mit klaren Bounded-Context-Grenzen ([KB-0130](02-bounded-contexts-und-context-maps.md)) organisiert sein, jedes mit eigener, expliziter API und eigenem Datenmodell — nur eben in einem gemeinsamen Deployment-Artefakt. Diese Trennung von Modulgrenze (logisch) und Deployment-Grenze (physisch) erlaubt, die Vorteile klarer Modularität zu erhalten, ohne die Betriebskomplexität und verteilte Kopplung eines vorschnell fragmentierten Microservices-Systems zu übernehmen. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0130](02-bounded-contexts-und-context-maps.md).

~~~text
Single deployable process
  Module Orders  { public API: OrderService } { private data: orders_table }
  Module Inventory { public API: InventoryService } { private data: inventory_table }
Orders calls Inventory only via InventoryService, never touches inventory_table directly
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Verstoß |
|---|---|---|
| Modul-API | explizite, öffentliche Schnittstelle definiert? | andere Module rufen interne Klassen/Funktionen direkt auf |
| Datenhoheit | jedes Modul besitzt seine eigenen Datenstrukturen exklusiv? | ein anderes Modul liest/schreibt direkt in fremde Tabellen |
| Kompilierungs-/Import-Grenze | technisch durchgesetzt oder nur Konvention? | fehlende technische Durchsetzung lässt Grenzen erodieren |
| Extraktionsfähigkeit | könnte ein Modul theoretisch als eigener Service laufen? | starke interne Kopplung würde eine spätere Extraktion sehr teuer machen |

Implementierung: jedes Modul definiert eine explizite öffentliche API (z. B. ein Interface oder Package-Grenze), über die andere Module ausschließlich kommunizieren dürfen — kein direkter Zugriff auf interne Klassen oder Datenbanktabellen eines anderen Moduls. Datenhoheit bedeutet, dass jedes Modul seine eigenen Tabellen/Datenstrukturen exklusiv besitzt; Cross-Modul-Datenzugriffe laufen immer über die öffentliche API, nie über direkte Datenbankabfragen. Diese Grenzen sollten technisch durchgesetzt werden (z. B. über Modul-/Package-Visibility, nicht nur Konvention), damit sie nicht über Zeit erodieren.

## Scalability, Reliability, Security und Observability

Ein modularer Monolith skaliert als ein einziges Deployment-Artefakt (vertikal/horizontal repliziert), was operative Einfachheit gegenüber verteilten Microservices bietet, aber keine unabhängige Skalierung einzelner Module erlaubt. Reliability-Grenze: da alle Module im selben Prozess laufen, kann ein Fehler in einem Modul (z. B. ein Memory Leak) theoretisch den gesamten Prozess und damit alle Module gleichzeitig beeinträchtigen — anders als bei physisch getrennten Services.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Modul A liest Daten direkt aus der Tabelle von Modul B | Datenhoheit verletzt, keine technische Durchsetzung | Datenbankzugriffe auf modul-fremde Tabellen im Code suchen |
| Refactoring in Modul B bricht unerwartet Modul A | Modul A ruft interne (nicht-öffentliche) Klassen von Modul B auf | Aufrufe zwischen Modulen auf öffentliche API-Nutzung prüfen |
| eine Modul-Extraktion zu einem separaten Service erweist sich als extrem aufwendig | starke, unbemerkte interne Kopplung zwischen den Modulen | tatsächliche Anzahl direkter Abhängigkeiten zwischen den betroffenen Modulen zählen |
| ein Modul-Fehler beeinträchtigt den gesamten Prozess | gemeinsamer Prozessraum ohne Fehlerisolation zwischen Modulen | Ressourcenverbrauch/Fehlerausbreitung auf Prozessebene prüfen |

Security: Modulgrenzen können auch als Sicherheitsgrenzen dienen, wenn sensible Daten eines Moduls (z. B. Zahlungsdaten) durch die API-Grenze zusätzlich geschützt und nicht durch andere Module direkt zugreifbar sind. Observability: Modul-API-Aufrufe sind natürliche Instrumentierungspunkte, auch innerhalb eines einzigen Prozesses, um Kopplungsgrad und Abhängigkeiten zwischen Modulen sichtbar zu machen.

## Trade-offs und Entscheidungen

**Staff** prüft bei unerwarteten Kopplungsproblemen zuerst, ob Modulgrenzen (API, Datenhoheit) tatsächlich eingehalten wurden. **Principal** etabliert technisch durchgesetzte Modul-/Package-Grenzen statt reiner Namenskonvention. **Chief** positioniert den modularen Monolithen als validen, oft überlegenen Ausgangspunkt gegenüber vorschneller Microservices-Fragmentierung, mit der Option zur späteren Extraktion bei nachgewiesenem Bedarf.

Anti-Patterns: Module nur als Ordnerstruktur ohne technisch durchgesetzte Grenzen; direkter Datenbankzugriff über Modulgrenzen hinweg „weil es einfacher ist"; vorschnelle Aufteilung in Microservices, bevor die internen Modulgrenzen überhaupt sauber etabliert und bewiesen sind.

## Production Checklist

- [ ] Jedes Modul hat eine explizite, technisch durchgesetzte öffentliche API.
- [ ] Jedes Modul besitzt seine Datenstrukturen exklusiv, kein direkter Cross-Modul-Datenzugriff.
- [ ] Modul-Grenzen sind technisch durchgesetzt (Compiler/Package-Visibility), nicht nur Konvention.
- [ ] Extraktionsfähigkeit eines Moduls als separater Service wurde konzeptionell geprüft.

## Interviewfragen

### 1. Was unterscheidet einen modularen Monolithen von einem klassischen, unstrukturierten Monolithen?

**Antwort:** Explizite, technisch durchgesetzte Modulgrenzen mit eigener API und Datenhoheit pro Modul, statt eines einzigen, unstrukturierten Codebestands ohne klare interne Grenzen.

### 2. Warum sind Modulgrenzen und Deployment-Grenzen unabhängige Entscheidungen?

**Antwort:** Modularität betrifft die logische Struktur des Codes (Grenzen, APIs, Datenhoheit); Deployment-Granularität betrifft, wie viele separate Prozesse/Services tatsächlich betrieben werden — beides kann unabhängig voneinander variieren.

### 3. Warum ist direkter Datenbankzugriff über Modulgrenzen hinweg problematisch?

**Antwort:** Er umgeht die öffentliche API des Moduls und erzeugt versteckte Kopplung, die eine spätere unabhängige Weiterentwicklung oder Extraktion des Moduls erheblich erschwert.

### 4. Wann ist ein modularer Monolith einer sofortigen Microservices-Architektur vorzuziehen?

**Antwort:** Wenn die tatsächlichen Modulgrenzen noch nicht bewiesen und stabil sind — eine vorschnelle physische Aufteilung entlang falscher Grenzen erzeugt verteilte Kopplung ohne den eigentlichen Nutzen unabhängiger Services.

### 5. Wie prüfst du, ob ein Modul später als eigener Service extrahierbar wäre?

**Antwort:** Durch Zählen und Bewerten der tatsächlichen Abhängigkeiten zwischen diesem Modul und anderen — starke, verstreute interne Kopplung deutet darauf hin, dass die Modulgrenze noch nicht sauber genug ist.

### 6. Widersprüchliche Anforderung: Team will die operative Einfachheit eines Monolithen UND die unabhängige Skalierbarkeit einzelner Bereiche — wie gehst du vor?

**Antwort:** Ich würde einen modularen Monolithen mit sauberen internen Modulgrenzen vorschlagen, der bei nachgewiesenem Skalierungsbedarf eines einzelnen Moduls gezielt und mit geringem Aufwand als separater Service extrahiert werden kann, statt von Anfang an vollständig zu fragmentieren.

## Praktische Labs

~~~python
class OrdersModule:
    def __init__(self):
        self._orders_table = {}  # private, not to be accessed directly by other modules
    def create_order(self, order_id):
        self._orders_table[order_id] = {"status": "created"}
    def get_status(self, order_id):
        return self._orders_table[order_id]["status"]

orders = OrdersModule()
orders.create_order(1)
assert orders.get_status(1) == "created"  # correct: via public API
try:
    orders._orders_table[1]["status"] = "hacked"  # violation: direct internal access
    print("Warning: internal data structure accessed directly, bypassing the module API.")
except AttributeError:
    pass
~~~

## Dependencies, Cross-References und Quellen

1. Newman, Ford, Parsons: [Building Evolutionary Architectures](https://www.oreilly.com/library/view/building-evolutionary-architectures/9781491986356/), O'Reilly 2017, abgerufen 2026-09-17.
2. Kua, Fowler: [MonolithFirst](https://martinfowler.com/bliki/MonolithFirst.html), martinfowler.com, abgerufen 2026-09-17.

Diese Methodik ist zeitstabil; konkrete Sprach-/Framework-Unterstützung für Modul-Visibility sollte dennoch gegen aktuelle Dokumentation geprüft werden.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Sprach-native Modul-Boundaries mit erzwungener Visibility (statt reiner Ordnerkonvention) | Established je Sprache/Ökosystem | Tatsächliche Durchsetzungsstärke der Sprachfeature prüfen. |
| Automatisierte Kopplungsanalyse zur Bewertung der Extraktionsfähigkeit von Modulen | Adopting | Ergebnis gegen manuelle Architekturbewertung validieren. |

Ein Team akzeptiert einen modularen Monolithen als Architekturentscheidung erst, wenn Modulgrenzen technisch durchgesetzt und Datenhoheit pro Modul nachgewiesen sind.
