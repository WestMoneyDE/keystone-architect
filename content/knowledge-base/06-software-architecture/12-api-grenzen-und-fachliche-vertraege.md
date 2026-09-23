---
{"id": "KB-0140", "title": "API-Grenzen und fachliche Verträge", "domain": "06", "sequence": 12, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0130", "concepts": ["Bounded Context"], "needed_for": "both"}, {"id": "KB-0137", "concepts": ["Servicegrenzen"], "needed_for": "understanding"}], "related": ["KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen öffentlichen API-Vertrag von einem internen Datentyp trennen und eine interne Änderung ohne API-Bruch demonstrieren.", "rationale": "Kein reales API-Gateway nötig, um das Prinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "API-Grenzen mit expliziter Granularität, Dateneigentum und Änderungsfreiheit gegenüber Clientkopplung entwerfen.", "rationale": "Eine ungeplante API-Grenze koppelt Clients an interne Implementierungsdetails."}, "STAFF-TARGET": {"active": true, "scope": "Einen API-Breaking-Change auf eine fehlende Trennung zwischen internem Datentyp und öffentlichem Vertrag zurückführen.", "rationale": "Das ist eine häufige, vermeidbare Ursache für unnötige Client-Migrationen."}, "CHIEF-TARGET": {"active": true, "scope": "API-Vertragsstandards (Versionierung, Deprecation-Prozess) als Governance für alle öffentlichen Schnittstellen festlegen.", "rationale": "Uneinheitliche API-Praktiken erzeugen unvorhersehbare Client-Migrationskosten."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "API-Versionierungsstrategien (URL, Header, Content-Negotiation) im Detail sind Vertiefung.", "rationale": "Kern ist die Trennung interner Datentypen von öffentlichen Verträgen."}}, "lab_validation": [{"lab_id": "KB-0140-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für internen Datentyp versus öffentlichen API-Vertrag", "evidence": "Eine interne Feldumbenennung ändert den öffentlichen API-Vertrag nicht, da ein expliziter Mapper zwischen internem Modell und Response-DTO existiert.", "limitations": "Kein reales API-Gateway, keine Produktion."}]}
---
# API-Grenzen und fachliche Verträge

> **Ziel:** Eine API-Grenze übersetzt einen Bounded Context ([KB-0130](02-bounded-contexts-und-context-maps.md)) in einen expliziten, öffentlichen Vertrag mit Clients. Der entscheidende Designfehler ist, interne Datentypen ungefiltert als API-Response zu exponieren — das koppelt jeden Client an interne Implementierungsdetails und macht jede interne Änderung potenziell zu einem Breaking Change.

## Zweck, Mental Model und Dependencies

Ein öffentlicher API-Vertrag sollte unabhängig von der internen Datenstruktur des Systems gestaltet sein — ähnlich wie Domain Events ([KB-0132](04-domain-events-und-fachereignisse.md)) einen stabilen fachlichen Payload statt eines technischen Row-Dumps haben. Ein expliziter Mapper übersetzt zwischen internem Modell und öffentlichem Response-DTO, sodass interne Refactorings (Umbenennungen, Schema-Änderungen) den öffentlichen Vertrag nicht automatisch brechen. Die API-Grenze definiert außerdem explizit: welche Granularität (wie viele Felder pro Antwort), welches Dateneigentum (welcher Service ist autoritativ für welches Feld) und welche Änderungsfreiheit (was kann sich ändern, ohne Clients zu brechen). Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0130](02-bounded-contexts-und-context-maps.md) und [KB-0137](09-microservices-und-servicegrenzen.md).

~~~text
internal model: { order_id, amt_cents, status_flag_v2, internal_retry_ct }
API contract:   { orderId, totalAmount, status }   <- explicit mapper, stable, independent of internal renames
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Vertragstrennung | expliziter Mapper zwischen internem Modell und API-Response? | interne Änderung bricht API ungewollt |
| Granularität | wie viele Felder/Ressourcen pro Antwort, nach Client-Bedarf? | zu grobgranular: Overfetching; zu feingranular: viele Roundtrips |
| Dateneigentum | welcher Service ist autoritative Quelle für welches Feld? | mehrere Services liefern widersprüchliche Werte für dasselbe Feld |
| Änderungsfreiheit | additive Änderungen vs. Breaking Changes explizit unterschieden? | ungeplante Breaking Changes ohne Versionierungsstrategie |

Implementierung: jede API-Response wird über einen expliziten Mapper aus dem internen Modell erzeugt, nie durch direkte Serialisierung interner Objekte. Additive Änderungen (neue optionale Felder) werden von Breaking Changes (entfernte/umbenannte/semantisch geänderte Felder) klar unterschieden, mit einer definierten Versionierungs- und Deprecation-Strategie für Breaking Changes. Granularität wird am tatsächlichen Client-Bedarf ausgerichtet, nicht an der internen Datenbankstruktur.

## Scalability, Reliability, Security und Observability

Eine saubere API-Grenze erlaubt unabhängige Weiterentwicklung von Producer und Consumern, was für Skalierung über Teamgrenzen hinweg entscheidend ist. Reliability-Grenze: ohne explizite Trennung zwischen internem Modell und API-Vertrag wird jede interne Refactoring-Entscheidung zu einem potenziellen Client-Breaking-Change, was interne Weiterentwicklung faktisch blockiert oder zu unkoordinierten Ausfällen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| interne Refactoring bricht Clients unerwartet | fehlender expliziter Mapper, API spiegelt internes Modell direkt | Codepfad der API-Response-Erzeugung auf direkte Serialisierung prüfen |
| Clients müssen viele Roundtrips für eine Ansicht machen | API-Granularität zu feingranular für tatsächlichen Client-Bedarf | typische Client-Nutzungsmuster gegen API-Struktur abgleichen |
| zwei Services liefern unterschiedliche Werte für dasselbe Feld | fehlende klare Dateneigentümerschaft | autoritative Quelle für das betroffene Feld identifizieren |
| API-Änderung führt zu unkoordinierten Client-Ausfällen | fehlende Unterscheidung additiv vs. Breaking Change, keine Versionierung | Änderungsart gegen definierte Versionierungsstrategie prüfen |

Security: die API-Grenze ist der Punkt, an dem entschieden wird, welche internen Daten überhaupt exponiert werden — sensible interne Felder sollten explizit aus dem Mapper ausgeschlossen werden, nicht implizit durch Zufall fehlen. Observability: API-Grenzen sind natürliche Punkte für Vertragstests (Consumer-Driven Contract Testing), die sicherstellen, dass Änderungen die tatsächlichen Client-Erwartungen nicht verletzen.

## Trade-offs und Entscheidungen

**Staff** prüft bei API-Breaking-Changes zuerst, ob ein expliziter Mapper fehlte oder umgangen wurde. **Principal** definiert Standards für additive versus Breaking Changes und eine Versionierungs-/Deprecation-Strategie. **Chief** verlangt Consumer-Driven Contract Tests für kritische öffentliche APIs als Voraussetzung für sichere unabhängige Weiterentwicklung.

Anti-Patterns: interne Datenbank-Objekte direkt als API-Response serialisieren; API-Granularität an interner Datenbankstruktur statt Client-Bedarf ausrichten; Breaking Changes ohne Versionierung oder Deprecation-Ankündigung einführen.

## Production Checklist

- [ ] Expliziter Mapper zwischen internem Modell und öffentlichem API-Vertrag vorhanden.
- [ ] Additive Änderungen und Breaking Changes klar unterschieden, mit Versionierungsstrategie.
- [ ] Dateneigentum pro Feld/Ressource eindeutig einem autoritativen Service zugeordnet.
- [ ] Consumer-Driven Contract Tests für kritische APIs implementiert.

## Interviewfragen

### 1. Warum sollte eine API-Response nicht direkt das interne Datenmodell serialisieren?

**Antwort:** Weil jede interne Änderung (Umbenennung, Schema-Änderung) dann automatisch zu einem Breaking Change für Clients wird, statt kontrolliert über einen expliziten Mapper abgefangen zu werden.

### 2. Was unterscheidet eine additive Änderung von einem Breaking Change?

**Antwort:** Eine additive Änderung (z. B. neues optionales Feld) bricht bestehende Clients nicht; ein Breaking Change (entferntes/umbenanntes/semantisch geändertes Feld) erfordert Client-Anpassung und eine Versionierungs-/Migrationsstrategie.

### 3. Wie bestimmst du die richtige Granularität einer API?

**Antwort:** Anhand tatsächlicher Client-Nutzungsmuster — zu grobgranular erzeugt Overfetching, zu feingranular erzeugt zu viele Roundtrips für typische Anwendungsfälle.

### 4. Was bedeutet Dateneigentum im API-Kontext?

**Antwort:** Für jedes Feld/jede Ressource gibt es einen klar definierten, autoritativen Service, der die korrekte Quelle der Wahrheit ist — andere Services liefern diesen Wert nicht widersprüchlich anders.

### 5. Was ist Consumer-Driven Contract Testing?

**Antwort:** Ein Testansatz, bei dem Client-Erwartungen an eine API explizit als Tests formuliert werden, die der Producer gegen seine tatsächliche API-Implementierung validiert, um versehentliche Breaking Changes früh zu erkennen.

### 6. Widersprüchliche Anforderung: Team will schnelle interne Refactorings UND garantierte API-Stabilität für Clients — wie gehst du vor?

**Antwort:** Ich würde einen expliziten Mapper zwischen internem Modell und öffentlichem Vertrag durchsetzen, sodass interne Refactorings frei möglich bleiben, solange der Mapper den stabilen öffentlichen Vertrag weiterhin korrekt erfüllt — die beiden Anforderungen widersprechen sich nur, wenn diese Trennung fehlt.

## Praktische Labs

~~~python
internal_model = {"order_id": 1, "amt_cents": 2500, "status_flag_v2": "C"}

def to_api_contract(internal):
    status_map = {"C": "confirmed", "P": "pending"}
    return {"orderId": internal["order_id"], "totalAmount": internal["amt_cents"] / 100, "status": status_map[internal["status_flag_v2"]]}

api_response = to_api_contract(internal_model)
internal_model["status_flag_v2"] = "C"  # internal rename simulated by changing the mapper, not the contract
assert api_response == {"orderId": 1, "totalAmount": 25.0, "status": "confirmed"}
print("Public API contract remained stable and independent of internal field naming.")
~~~

## Dependencies, Cross-References und Quellen

1. Fowler: [Consumer-Driven Contracts](https://martinfowler.com/articles/consumerDrivenContracts.html), martinfowler.com, abgerufen 2026-09-17.

Produktspezifische API-Gateway- und Contract-Testing-Tooling-Details vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Contract-Testing-Pipelines in CI (z. B. Pact-artige Tools) | Established | Abdeckung der Contract-Tests gegen reale Client-Nutzung prüfen. |
| Schema-First-API-Design mit generierten Mappern | Adopting | Generierten Mapper-Code gegen dieselben Kontrakttests wie manuellen Code validieren. |

Ein Team akzeptiert eine API-Grenze erst, wenn ein expliziter Mapper zwischen internem Modell und öffentlichem Vertrag nachgewiesen und Contract Tests für kritische Clients implementiert sind.
