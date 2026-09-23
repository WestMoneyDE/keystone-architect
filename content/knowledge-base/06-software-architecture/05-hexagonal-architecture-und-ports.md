---
{"id": "KB-0133", "title": "Hexagonal Architecture und Ports", "domain": "06", "sequence": 5, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0129", "concepts": ["DDD"], "needed_for": "understanding"}], "related": ["KB-0134", "KB-0562", "KB-0720"], "applies": ["KB-0134", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Fachkern mit Port-Interface und austauschbarem Adapter lokal implementieren und den Austausch demonstrieren.", "rationale": "Kein reales Backend nötig, um das Strukturprinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Für ein Backend-System Ports und Adapter so entwerfen, dass externe Abhängigkeiten austauschbar sind.", "rationale": "Fest verdrahtete externe Abhängigkeiten erschweren Tests und Technologiewechsel."}, "STAFF-TARGET": {"active": true, "scope": "Testbarkeitsprobleme auf fehlende Port-Abstraktion zwischen Fachkern und externer Infrastruktur zurückführen.", "rationale": "Ohne Ports erfordern Unit-Tests des Fachkerns echte externe Systeme."}, "CHIEF-TARGET": {"active": true, "scope": "Hexagonal Architecture als Standardstruktur für Systeme mit hoher Testbarkeits- und Austauschbarkeitsanforderung festlegen.", "rationale": "Konsistente Strukturprinzipien erleichtern Technologiewechsel und Teamübergaben."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Mehrere Adapter-Varianten für denselben Port (z. B. Test-Double versus echte Implementierung) im Detail sind Vertiefung.", "rationale": "Kern ist die Trennung Fachkern/Ports/Adapter, nicht jede Adapter-Variante."}}, "lab_validation": [{"lab_id": "KB-0133-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Fachkern mit austauschbarem Port-Adapter", "evidence": "Derselbe Fachkern-Code läuft unverändert mit einem In-Memory-Adapter im Test und würde mit einem Datenbank-Adapter in Produktion laufen, da beide nur das Port-Interface implementieren.", "limitations": "Kein reales Backend, keine Produktion."}]}
---
# Hexagonal Architecture und Ports

> **Ziel:** Hexagonal Architecture (Ports and Adapters) trennt den Fachkern strikt von externen Abhängigkeiten (Datenbank, Messaging, externe APIs) über explizite Schnittstellen (Ports), die von austauschbaren Adaptern implementiert werden. Der Fachkern kennt nur die Ports, nie eine konkrete externe Technologie — das macht ihn testbar ohne echte Infrastruktur und Technologien austauschbar ohne Fachkern-Änderung.

## Zweck, Mental Model und Dependencies

Ein Port ist eine vom Fachkern definierte Schnittstelle (z. B. „OrderRepository" mit Methoden wie „save" und „findById"), die beschreibt, was der Fachkern von der Außenwelt braucht — ohne festzulegen, wie es implementiert wird. Ein Adapter implementiert diesen Port konkret (z. B. eine PostgreSQL-Implementierung oder eine In-Memory-Implementierung für Tests). Der Fachkern hängt nur vom Port-Interface ab, nie von einer konkreten Adapter-Implementierung — die Abhängigkeitsrichtung zeigt vom Adapter zum Port, nie umgekehrt. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0129](01-domain-driven-design-und-fachmodelle.md).

~~~text
Domain Core -> depends on -> Port (interface: OrderRepository)
Adapter(Postgres) -> implements -> Port      Adapter(InMemory, for tests) -> implements -> Port
Domain Core never imports Postgres directly - only the Port interface
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Port | vom Fachkern definiert, technologieunabhängig formuliert? | Port-Interface leakt technologiespezifische Details (z. B. SQL-Konzepte) |
| Adapter | austauschbar ohne Fachkern-Änderung? | Fachkern importiert versehentlich konkrete Adapter-Klasse direkt |
| Abhängigkeitsrichtung | zeigt immer vom Adapter zum Port, nie umgekehrt? | Fachkern hängt von Infrastruktur-Bibliothek ab |
| Test-Adapter | eigener, einfacher Adapter für Tests verfügbar? | Tests des Fachkerns benötigen echte externe Systeme |

Implementierung: Ports werden vom Fachkern aus formuliert, in seiner eigenen fachlichen Sprache, nicht in der Sprache der externen Technologie (z. B. „findConfirmedOrders" statt „executeQuery"). Für jeden Port existieren mindestens zwei Adapter in der Praxis: die produktive Implementierung (z. B. Datenbank) und eine Test-Implementierung (z. B. In-Memory), die identisch gegen dieselbe Schnittstelle getestet werden können. Der Fachkern selbst enthält keine Imports von Infrastruktur-Bibliotheken.

## Scalability, Reliability, Security und Observability

Hexagonal Architecture skaliert als Organisationsprinzip: Teams können den Fachkern unabhängig von Infrastrukturentscheidungen weiterentwickeln, und Infrastrukturwechsel (z. B. Datenbankmigration) berühren nur den betroffenen Adapter. Reliability-Grenze: die Struktur schützt nicht automatisch vor fachlichen Fehlern im Kern selbst, sie isoliert nur externe technische Abhängigkeiten — ein fehlerhafter Fachkern bleibt fehlerhaft, unabhängig von der Adapter-Struktur.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Unit-Tests des Fachkerns benötigen eine echte Datenbank | fehlende Port-Abstraktion, direkter Infrastruktur-Import | prüfen, ob Fachkern-Code Infrastruktur-Bibliotheken direkt importiert |
| Technologiewechsel (z. B. Datenbank) erfordert Änderungen im Fachkern | Port-Interface leakt technologiespezifische Konzepte | Port-Methodennamen und -Signaturen auf Technologieneutralität prüfen |
| zwei Adapter für denselben Port verhalten sich unterschiedlich | Adapter erfüllt Port-Vertrag nicht vollständig | beide Adapter gegen dieselbe Testsuite gegen das Port-Interface prüfen |
| Fachkern-Code wird bei jeder Infrastrukturänderung angepasst | Abhängigkeitsrichtung verletzt (Fachkern kennt Adapter-Details) | Import-Richtung zwischen Fachkern und Adaptern prüfen |

Security: Ports sind ein natürlicher Ort, um Sicherheitsanforderungen (z. B. welche Daten ein Repository zurückgeben darf) explizit im Interface zu formulieren, unabhängig von der konkreten Implementierung. Observability: Adapter-Grenzen sind natürliche Instrumentierungspunkte (z. B. Latenzmessung pro Adapter-Aufruf), ohne den Fachkern selbst zu instrumentieren.

## Trade-offs und Entscheidungen

**Staff** prüft bei schwer testbarem Code zuerst, ob eine fehlende Port-Abstraktion die Ursache ist. **Principal** definiert, welche externen Abhängigkeiten zwingend über Ports abstrahiert werden müssen (typisch: Persistenz, Messaging, externe APIs). **Chief** legt Hexagonal Architecture als Standardstruktur für Systeme mit hoher Testbarkeits- oder Technologiewechsel-Anforderung fest.

Anti-Patterns: Port-Interfaces in der Sprache der externen Technologie statt des Fachkerns formulieren; Fachkern-Code, der Infrastruktur-Bibliotheken direkt importiert; nur einen Adapter pro Port implementieren und dadurch die eigentliche Austauschbarkeit nie tatsächlich beweisen.

## Production Checklist

- [ ] Fachkern enthält keine direkten Importe von Infrastruktur-Bibliotheken.
- [ ] Ports in fachlicher Sprache formuliert, nicht in Technologiesprache.
- [ ] Mindestens zwei Adapter (produktiv und Test) pro kritischem Port implementiert.
- [ ] Abhängigkeitsrichtung (Adapter → Port, nie umgekehrt) im Code verifiziert.

## Interviewfragen

### 1. Was ist der Unterschied zwischen einem Port und einem Adapter?

**Antwort:** Ein Port ist eine vom Fachkern definierte, technologieunabhängige Schnittstelle; ein Adapter ist eine konkrete Implementierung dieser Schnittstelle für eine bestimmte Technologie.

### 2. Warum sollte der Fachkern keine Infrastruktur-Bibliotheken direkt importieren?

**Antwort:** Weil das den Fachkern an eine konkrete Technologie koppelt, Tests ohne echte Infrastruktur unmöglich macht und Technologiewechsel zu Fachkern-Änderungen zwingt.

### 3. Wie testest du den Fachkern ohne echte Datenbank?

**Antwort:** Über einen In-Memory-Adapter, der dasselbe Port-Interface implementiert wie der produktive Datenbank-Adapter, sodass der Fachkern-Code unverändert gegen beide läuft.

### 4. Was bedeutet die Abhängigkeitsrichtung „Adapter hängt vom Port ab, nicht umgekehrt"?

**Antwort:** Der Fachkern definiert die Schnittstelle nach seinen eigenen Bedürfnissen; Adapter müssen sich daran anpassen, statt dass der Fachkern sich an eine externe Technologie anpasst.

### 5. Wie erkennst du, dass ein Port-Interface technologiespezifische Details leakt?

**Antwort:** Wenn Methodennamen oder Parameter Konzepte der externen Technologie (z. B. SQL-Begriffe, HTTP-Statuscodes) statt fachlicher Begriffe verwenden.

### 6. Widersprüchliche Anforderung: Team will maximale Testbarkeit ohne echte Infrastruktur UND minimalen zusätzlichen Abstraktionsaufwand — wie gehst du vor?

**Antwort:** Ich würde Ports gezielt nur für die wirklich kritischen, austauschrelevanten externen Abhängigkeiten einführen (z. B. Persistenz), statt jede triviale Abhängigkeit zu abstrahieren, um den Abstraktionsaufwand proportional zum tatsächlichen Testbarkeits-/Austauschbarkeitsnutzen zu halten.

## Praktische Labs

~~~python
from abc import ABC, abstractmethod

class OrderRepository(ABC):  # Port
    @abstractmethod
    def save(self, order): ...
    @abstractmethod
    def find_by_id(self, order_id): ...

class InMemoryOrderRepository(OrderRepository):  # Adapter for tests
    def __init__(self):
        self.store = {}
    def save(self, order):
        self.store[order["id"]] = order
    def find_by_id(self, order_id):
        return self.store.get(order_id)

def confirm_order(repo: OrderRepository, order_id):  # Domain core, depends only on the Port
    order = repo.find_by_id(order_id)
    order["status"] = "confirmed"
    repo.save(order)
    return order

repo = InMemoryOrderRepository()
repo.save({"id": 1, "status": "pending"})
result = confirm_order(repo, 1)
assert result["status"] == "confirmed"
print("Domain core worked unchanged against the in-memory adapter through the Port interface.")
~~~

## Dependencies, Cross-References und Quellen

1. Cockburn: [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/), 2005, abgerufen 2026-09-17.

Diese Methodik ist zeitstabil; konkrete Framework-Unterstützung für Dependency Injection sollte dennoch gegen aktuelle Dokumentation geprüft werden.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Framework-generierte Adapter aus Port-Interfaces (Codegenerierung) | Adopting | Generierte Adapter gegen dieselbe Testsuite wie manuelle Adapter validieren. |

Diese Methodik ist ein etabliertes, stabiles Strukturprinzip; der Bonus betrifft primär, wie Tooling die Adapter-Erstellung beschleunigen kann, ohne die Trennung Fachkern/Infrastruktur aufzuweichen.
