---
{"id": "KB-0134", "title": "Clean Architecture und Abhängigkeitsrichtung", "domain": "06", "sequence": 6, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0133", "concepts": ["Ports", "Adapter"], "needed_for": "both"}], "related": ["KB-0135", "KB-0562", "KB-0720"], "applies": ["KB-0135", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Entities, Use Cases und einen Infrastruktur-Mapper lokal implementieren und die Dependency Rule demonstrieren.", "rationale": "Kein reales Backend nötig, um das Strukturprinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Für ein System Entities, Use Cases und Infrastruktur so schichten, dass die Dependency Rule eingehalten wird.", "rationale": "Verletzte Abhängigkeitsrichtung koppelt Geschäftslogik an Infrastrukturdetails."}, "STAFF-TARGET": {"active": true, "scope": "Eine Verletzung der Dependency Rule im Code identifizieren und ihre Konsequenz für Testbarkeit erklären.", "rationale": "Das ist eine häufige schleichende Architekturerosion in wachsenden Systemen."}, "CHIEF-TARGET": {"active": true, "scope": "Mapping-Kosten zwischen Schichten gegen den Nutzen strikter Trennung im Architekturstandard abwägen.", "rationale": "Strikte Trennung erzeugt Mapping-Aufwand, der bewusst gegen den Testbarkeits-/Flexibilitätsgewinn abgewogen werden muss."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Interactor-/Presenter-Muster und DTOs im Detail für jede Schichtgrenze sind Vertiefung.", "rationale": "Kern ist die Dependency Rule, nicht jedes taktische Zwischenmuster."}}, "lab_validation": [{"lab_id": "KB-0134-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Entity, Use Case und Infrastruktur-Mapping", "evidence": "Die Use-Case-Schicht kennt nur die Entity, nie die konkrete Datenbank-Row-Struktur; ein Mapper übersetzt zwischen beiden an der Infrastrukturgrenze.", "limitations": "Kein reales Backend, keine Produktion."}]}
---
# Clean Architecture und Abhängigkeitsrichtung

> **Ziel:** Clean Architecture ordnet Code in konzentrische Schichten (Entities im Zentrum, dann Use Cases, dann Infrastruktur/Frameworks außen) mit einer strikten Regel: Abhängigkeiten zeigen immer nach innen, nie nach außen (Dependency Rule). Die innerste Geschäftslogik kennt weder Datenbank noch Web-Framework — das macht sie testbar und unabhängig von Technologieentscheidungen, kostet aber Mapping-Aufwand an den Schichtgrenzen.

## Zweck, Mental Model und Dependencies

Entities enthalten die fachlichen Kernregeln, die unabhängig von jeder Anwendung gelten würden. Use Cases orchestrieren Entities für konkrete Anwendungsfälle. Außen liegen Infrastruktur und Frameworks (Datenbank, Web, UI). Die Dependency Rule besagt: Code in einer inneren Schicht darf nichts von einer äußeren Schicht wissen — ein Use Case darf nicht wissen, dass Daten in PostgreSQL gespeichert werden, sondern kennt nur ein Port-Interface ([KB-0133](05-hexagonal-architecture-und-ports.md)), das von außen implementiert wird. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0133](05-hexagonal-architecture-und-ports.md).

~~~text
Entities (core business rules) <- Use Cases (application logic) <- Interface Adapters <- Frameworks/DB
Dependency Rule: arrows point inward only. Entities never import from Use Cases or Infrastructure.
~~~

## Core Concepts, Architektur und Implementierung

| Schicht | Verantwortung | Verstoß gegen Dependency Rule |
|---|---|---|
| Entities | fachliche Kernregeln, unabhängig von jeder Anwendung | Entity importiert Datenbank-Bibliothek |
| Use Cases | orchestriert Entities für konkrete Anwendungsfälle | Use Case kennt HTTP-Statuscodes oder SQL-Details |
| Interface Adapters | übersetzt zwischen Use Cases und externer Welt | fehlende Übersetzung, Framework-Objekte direkt in Use Case übergeben |
| Frameworks/Infrastruktur | konkrete Technologie (DB, Web, UI) | — (äußerste Schicht, darf alles kennen) |

Implementierung: an jeder Schichtgrenze findet explizites Mapping statt (z. B. Datenbank-Row zu Entity, Entity zu API-Response-DTO) — das ist bewusster Mehraufwand, der die Entkopplung erkauft. Entities enthalten reine Geschäftslogik ohne jegliche Framework-Annotations oder Persistenz-Bibliotheks-Importe. Use Cases hängen nur von Entities und von Ports ab, nie von konkreten Infrastruktur-Implementierungen.

## Scalability, Reliability, Security und Observability

Clean Architecture skaliert als Organisationsprinzip ähnlich wie Hexagonal Architecture: Kernlogik bleibt stabil und testbar, während sich Infrastruktur unabhängig weiterentwickeln kann. Reliability-Grenze: der Mapping-Aufwand an Schichtgrenzen ist eine reale Kosten- und Fehlerquelle — ein fehlerhaftes Mapping (z. B. verlorenes Feld) kann fachlich korrekte Kernlogik trotzdem zu falschen Ergebnissen führen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Entity-Code importiert eine ORM-Bibliothek | Dependency Rule verletzt, Entity kennt Persistenzdetails | Imports der Entity-Klassen auf Infrastruktur-Abhängigkeiten prüfen |
| Use-Case-Tests benötigen einen laufenden Webserver | Use Case kennt Framework-Details statt nur Entities/Ports | Abhängigkeiten des Use-Case-Codes auf Framework-Importe prüfen |
| Daten gehen zwischen Datenbank und Entity verloren | fehlerhaftes oder unvollständiges Mapping an der Infrastrukturgrenze | Mapping-Funktion isoliert gegen bekannte Testfälle prüfen |
| hoher wahrgenommener Boilerplate-Aufwand für einfache CRUD-Operationen | strikte Schichtentrennung für trivialen Anwendungsfall überdimensioniert | Nutzen der Trennung gegen tatsächliche Komplexität des Anwendungsfalls abwägen |

Security: Entities können fachliche Sicherheitsinvarianten (z. B. „eine stornierte Bestellung kann nicht erneut bestätigt werden") unabhängig von der Infrastruktur durchsetzen, was Sicherheitslogik testbar und zentral macht statt über mehrere Infrastrukturschichten verstreut. Observability: Mapping-Grenzen sind natürliche Stellen, um Datenintegrität zwischen Schichten zu validieren und zu loggen.

## Trade-offs und Entscheidungen

**Staff** prüft bei schwer isoliert testbarer Geschäftslogik zuerst Verstöße gegen die Dependency Rule. **Principal** entscheidet pro Systemtyp, ob der Mapping-Aufwand strikter Schichtentrennung gerechtfertigt ist (typisch: ja bei komplexer, langlebiger Geschäftslogik; eher nein bei einfachen CRUD-Diensten). **Chief** legt fest, für welche Systemklassen Clean Architecture als Standard gilt, und akzeptiert bewusst pragmatischere Strukturen für einfache Systeme.

Anti-Patterns: Entities mit Framework-Annotations oder ORM-Importen verunreinigen; Clean Architecture unreflektiert für jeden trivialen CRUD-Dienst erzwingen, ohne den Mapping-Mehraufwand gegen den tatsächlichen Nutzen abzuwägen; Mapping-Funktionen ungetestet lassen, obwohl sie eine reale Fehlerquelle sind.

## Production Checklist

- [ ] Entities enthalten keine Framework- oder Infrastruktur-Importe.
- [ ] Use Cases hängen nur von Entities und Ports ab, nie von konkreten Infrastruktur-Implementierungen.
- [ ] Mapping-Funktionen an jeder Schichtgrenze isoliert getestet.
- [ ] Strikte Schichtentrennung bewusst gegen tatsächliche Systemkomplexität abgewogen, nicht pauschal angewendet.

## Interviewfragen

### 1. Was besagt die Dependency Rule in Clean Architecture?

**Antwort:** Abhängigkeiten zeigen immer nach innen, zu den fachlichen Kernschichten; äußere Schichten (Infrastruktur, Frameworks) dürfen von inneren Schichten wissen, aber niemals umgekehrt.

### 2. Warum sollten Entities keine ORM-Bibliothek importieren?

**Antwort:** Weil das die fachliche Kernlogik an eine konkrete Persistenztechnologie koppelt und sie unabhängig von Infrastrukturentscheidungen testbar und wiederverwendbar sein soll.

### 3. Was kostet die strikte Trennung zwischen Schichten?

**Antwort:** Expliziten Mapping-Aufwand an jeder Schichtgrenze (z. B. Datenbank-Row zu Entity, Entity zu API-Response), der bewusst gegen den Testbarkeits- und Entkopplungsgewinn abgewogen werden muss.

### 4. Wann ist Clean Architecture möglicherweise überdimensioniert?

**Antwort:** Bei einfachen CRUD-Diensten ohne komplexe, langlebige Geschäftslogik, wo der Mapping-Mehraufwand den geringen tatsächlichen Nutzen der strikten Trennung übersteigt.

### 5. Wie testest du eine Use-Case-Schicht ohne laufenden Webserver oder Datenbank?

**Antwort:** Indem der Use Case nur von Entities und Port-Interfaces abhängt, die im Test durch einfache In-Memory-Implementierungen ersetzt werden können.

### 6. Widersprüchliche Anforderung: Team will maximale Entkopplung UND minimalen Boilerplate-/Mapping-Aufwand — wie gehst du vor?

**Antwort:** Ich würde die Schichtentrennung selektiv auf die Bereiche mit tatsächlich komplexer, veränderlicher Geschäftslogik anwenden und für einfache, stabile Randbereiche pragmatischere, direktere Strukturen zulassen, statt die volle Strenge überall gleich durchzusetzen.

## Praktische Labs

~~~python
class Order:  # Entity - pure business rule, no infrastructure imports
    def __init__(self, id, status):
        self.id = id
        self.status = status
    def confirm(self):
        if self.status == "cancelled":
            raise ValueError("cannot confirm a cancelled order")
        self.status = "confirmed"

def row_to_entity(row):  # Mapper at the infrastructure boundary
    return Order(id=row["id"], status=row["status"])

db_row = {"id": 1, "status": "pending", "internal_db_column": "unused"}
order_entity = row_to_entity(db_row)
order_entity.confirm()
assert order_entity.status == "confirmed"
print("Entity never saw the raw database row; mapping happened explicitly at the boundary.")
~~~

## Dependencies, Cross-References und Quellen

1. Martin: [Clean Architecture: A Craftsman's Guide to Software Structure and Design](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html), Prentice Hall 2017, abgerufen 2026-09-17.

Diese Methodik ist zeitstabil; konkrete Framework-Unterstützung für Schichtentrennung sollte dennoch gegen aktuelle Dokumentation geprüft werden.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Codegenerierte Mapper zwischen Schichten zur Reduktion von Boilerplate | Established | Generierten Mapper-Code gegen dieselben Testfälle wie manuellen Code prüfen. |

Diese Methodik ist ein etabliertes, stabiles Strukturprinzip; der Bonus betrifft primär, wie Tooling den Mapping-Aufwand reduzieren kann, ohne die Dependency Rule aufzuweichen.
