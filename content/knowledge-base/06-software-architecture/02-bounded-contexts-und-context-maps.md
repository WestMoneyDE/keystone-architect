---
{"id": "KB-0130", "title": "Bounded Contexts und Context Maps", "domain": "06", "sequence": 2, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0129", "concepts": ["Ubiquitous Language", "DDD"], "needed_for": "both"}], "related": ["KB-0131", "KB-0107", "KB-0562", "KB-0720"], "applies": ["KB-0131", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Context Map für zwei Beispielkontexte mit Upstream-/Downstream-Beziehung und Übersetzungsschicht entwerfen.", "rationale": "Kein reales Projekt nötig, um die Modellierungsmethodik zu üben."}, "ARCHITECT-TARGET": {"active": true, "scope": "Für ein System mit mehreren fachlichen Kontexten Modellgrenzen und Integrationsverträge explizit festlegen.", "rationale": "Unklare Kontextgrenzen erzeugen widersprüchliche Begriffe und ungeplante Kopplung."}, "STAFF-TARGET": {"active": true, "scope": "Einen Integrationsfehler auf eine fehlende oder fehlerhafte Übersetzungsschicht zwischen zwei Kontexten zurückführen.", "rationale": "Das ist eine häufige Ursache für 'derselbe Begriff, unterschiedliche Bedeutung'-Bugs."}, "CHIEF-TARGET": {"active": true, "scope": "Context-Map-Beziehungstypen (Partnership, Customer-Supplier, Conformist) als Governance-Werkzeug für Teamabhängigkeiten nutzen.", "rationale": "Die Beziehungstypen machen organisatorische Machtverhältnisse zwischen Teams explizit."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Anti-Corruption-Layer-Implementierungsmuster im Detail sind Vertiefung.", "rationale": "Kern ist das Erkennen von Kontextgrenzen und Beziehungstypen, nicht jede Implementierungsvariante."}}, "lab_validation": [{"lab_id": "KB-0130-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Modell für zwei Kontexte mit widersprüchlicher Begriffsbedeutung", "evidence": "Der Begriff 'Produkt' bedeutet im Verkaufskontext ein verkaufbares Angebot, im Lagerkontext eine physische Lagereinheit; eine Übersetzungsschicht macht diese Differenz explizit statt sie zu vermischen.", "limitations": "Kein reales Projekt, rein methodische Übung."}]}
---
# Bounded Contexts und Context Maps

> **Ziel:** Ein Bounded Context definiert eine explizite Grenze, innerhalb derer ein Begriff eine einzige, konsistente Bedeutung hat. Eine Context Map macht sichtbar, wie mehrere Bounded Contexts zueinander stehen (wer ist Upstream, wer Downstream) und welche Übersetzungsschicht nötig ist, wenn sich Begriffe zwischen Kontexten unterscheiden.

## Zweck, Mental Model und Dependencies

Der Versuch, eine einzige, global konsistente Ubiquitous Language ([KB-0129](01-domain-driven-design-und-fachmodelle.md)) für ein ganzes großes System zu erzwingen, scheitert meist, weil derselbe Begriff in unterschiedlichen fachlichen Bereichen unterschiedliche, beide legitime Bedeutungen hat — „Produkt" bedeutet im Verkauf ein verkaufbares Angebot, im Lager eine physische Einheit mit Bestandsmenge. Ein Bounded Context akzeptiert das: innerhalb seiner Grenze ist die Bedeutung konsistent, über die Grenze hinweg braucht es eine explizite Übersetzung. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0129](01-domain-driven-design-und-fachmodelle.md) und [KB-0107](../05-distributed-systems/07-sharding-und-mandantenplatzierung.md).

~~~text
Sales Context: "Product" = sellable offering (price, description)
Inventory Context: "Product" = physical stock unit (quantity, location)
Context Map: Sales -[Customer-Supplier]-> Inventory, translation layer maps between the two "Product" meanings
~~~

## Core Concepts, Architektur und Implementierung

| Beziehungstyp | Bedeutung | Organisatorische Implikation |
|---|---|---|
| Partnership | zwei Teams entwickeln gemeinsam abgestimmt | enge Koordination, gemeinsame Roadmap nötig |
| Customer-Supplier | Downstream-Team hat Einfluss auf Upstream-Anforderungen | Upstream muss Downstream-Bedürfnisse einplanen |
| Conformist | Downstream übernimmt Upstream-Modell ohne Einfluss | Downstream passt sich an, keine Verhandlungsmacht |
| Anti-Corruption Layer | Downstream übersetzt Upstream-Modell explizit in eigenes Modell | schützt eigenes Modell vor fremden Konzepten, kostet Übersetzungsaufwand |

Implementierung: Kontextgrenzen werden explizit gezogen, meist entlang organisatorischer Teamgrenzen oder fachlich klar abgrenzbarer Verantwortlichkeiten. Für jede Integration zwischen zwei Kontexten wird der Beziehungstyp explizit benannt (nicht implizit angenommen), und wenn die Modelle stark divergieren, wird ein Anti-Corruption Layer eingeführt, der fremde Konzepte übersetzt statt sie unreflektiert ins eigene Modell durchsickern zu lassen.

## Scalability, Reliability, Security und Observability

Bounded Contexts skalieren Teamautonomie: jedes Team kann sein Modell innerhalb seines Kontexts weiterentwickeln, ohne globalen Konsens für jede Änderung zu benötigen. Reliability-Grenze: eine fehlende oder unvollständige Übersetzungsschicht zwischen Kontexten mit unterschiedlicher Begriffsbedeutung führt zu subtilen, schwer zu findenden Fehlern, da Code auf beiden Seiten syntaktisch korrekt aussieht, aber semantisch aneinander vorbeiredet.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Feld wird zwischen zwei Systemen falsch interpretiert, obwohl der Name gleich ist | fehlende Übersetzungsschicht zwischen unterschiedlichen Kontextbedeutungen | Begriffsbedeutung in beiden Kontexten explizit vergleichen |
| ein Team kann keine Änderung vornehmen, ohne ein anderes Team abzustimmen | Partnership- oder Conformist-Beziehung nicht als solche erkannt/dokumentiert | Beziehungstyp zwischen den beteiligten Kontexten explizit benennen |
| fremde Modellkonzepte sickern unkontrolliert ins eigene Modell | fehlender Anti-Corruption Layer bei starker Modelldivergenz | Grad der Modellübernahme vom Upstream-System prüfen |
| Kontextgrenzen verschwimmen über Zeit | fehlende explizite Dokumentation/Durchsetzung der Grenze | aktuelle Modellgrenzen gegen ursprüngliche Context Map prüfen |

Security: Kontextgrenzen können auch Sicherheitsgrenzen abbilden (unterschiedliche Zugriffsrechte pro Kontext); eine Übersetzungsschicht sollte auch Berechtigungsprüfung beim Grenzübertritt vornehmen, nicht nur Datenformat übersetzen. Observability: Integrationsfehler zwischen Kontexten lassen sich leichter diagnostizieren, wenn die Context Map dokumentiert ist und als Referenz für Tracing/Debugging dient.

## Trade-offs und Entscheidungen

**Staff** prüft bei Integrationsfehlern zwischen Systemen zuerst, ob eine Begriffsbedeutung zwischen den beteiligten Kontexten stillschweigend unterschiedlich angenommen wurde. **Principal** dokumentiert die Context Map explizit mit Beziehungstypen für alle wesentlichen Systemintegrationen. **Chief** nutzt die Context Map als Werkzeug zur Klärung organisatorischer Abhängigkeiten und Verhandlungsmacht zwischen Teams.

Anti-Patterns: Kontextgrenzen implizit lassen, ohne sie zu dokumentieren; ein Downstream-Modell unreflektiert an ein Upstream-Modell koppeln (Conformist), ohne zu prüfen, ob eine Anti-Corruption-Schicht nötig wäre; eine Context Map einmalig erstellen und nie aktualisieren, obwohl sich Systemgrenzen ändern.

## Production Checklist

- [ ] Kontextgrenzen explizit dokumentiert, meist entlang Teamverantwortlichkeit.
- [ ] Beziehungstyp (Partnership/Customer-Supplier/Conformist) für jede Kontextintegration benannt.
- [ ] Anti-Corruption Layer bei stark divergierenden Modellen implementiert.
- [ ] Context Map bei Systemänderungen aktiv aktualisiert.

## Interviewfragen

### 1. Was ist ein Bounded Context?

**Antwort:** Eine explizite Grenze, innerhalb derer ein Begriff eine einzige, konsistente Bedeutung hat — außerhalb dieser Grenze kann derselbe Begriff eine andere, ebenso legitime Bedeutung haben.

### 2. Warum ist eine einzige globale Ubiquitous Language für ein großes System oft nicht praktikabel?

**Antwort:** Weil derselbe Begriff in unterschiedlichen fachlichen Bereichen unterschiedliche, jeweils korrekte Bedeutungen haben kann; ein erzwungener globaler Konsens würde diese legitime Vielfalt künstlich unterdrücken.

### 3. Was ist ein Anti-Corruption Layer?

**Antwort:** Eine Übersetzungsschicht, die Konzepte eines fremden (meist Upstream-)Modells explizit in das eigene Modell übersetzt, um zu verhindern, dass fremde Konzepte unreflektiert das eigene Modell verzerren.

### 4. Was bedeutet eine Conformist-Beziehung in einer Context Map?

**Antwort:** Das Downstream-Team übernimmt das Upstream-Modell ohne eigenen Einfluss darauf, meist weil es keine Verhandlungsmacht hat oder die Integration nicht wichtig genug für eigenen Übersetzungsaufwand ist.

### 5. Wie erkennst du, dass zwei Systeme fälschlich denselben Begriff mit unterschiedlicher Bedeutung austauschen?

**Antwort:** Durch Vergleich der tatsächlichen Bedeutung des Begriffs in beiden beteiligten Kontexten anhand ihrer jeweiligen Fachlichkeit, nicht nur durch Vergleich des Feldnamens.

### 6. Widersprüchliche Anforderung: Zwei Teams wollen unabhängig voneinander ihre Modelle weiterentwickeln UND nahtlose, verlustfreie Integration ohne Übersetzungsaufwand — wie gehst du vor?

**Antwort:** Ich würde erklären, dass unabhängige Modellentwicklung und verlustfreie direkte Kopplung sich widersprechen; eine Übersetzungsschicht (Anti-Corruption Layer) ist der Preis für Unabhängigkeit und sollte als bewusste Investition statt als vermeidbarer Aufwand verstanden werden.

## Praktische Labs

~~~python
sales_product = {"name": "Widget", "price": 9.99}
inventory_product = {"sku": "Widget", "quantity": 42, "location": "A1"}

def translate_sales_to_inventory(sales_item, inventory_lookup):
    return inventory_lookup.get(sales_item["name"])

lookup = {"Widget": inventory_product}
translated = translate_sales_to_inventory(sales_product, lookup)
assert translated["quantity"] == 42
print("Explicit translation layer correctly bridges the two different meanings of 'Product'.")
~~~

## Dependencies, Cross-References und Quellen

1. Evans: [Domain-Driven Design: Tackling Complexity in the Heart of Software](https://www.domainlanguage.com/ddd/), Addison-Wesley 2003, abgerufen 2026-09-17.
2. Vernon: [Implementing Domain-Driven Design](https://vaughnvernon.com/), Addison-Wesley 2013, abgerufen 2026-09-17.

Diese Methodik ist zeitstabil; konkrete Integrationstechnologien für Übersetzungsschichten sollten dennoch gegen aktuelle Tooling-Optionen geprüft werden.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Context-Map-Erkennung aus API-Verkehrsanalyse | Emerging | Vollständigkeit und Korrektheit der automatisch erkannten Grenzen manuell validieren. |
| Schema-Registries mit expliziter Versionierung als technische Unterstützung für Kontextgrenzen | Established | Versionierungsdisziplin gegen tatsächliche Übersetzungsanforderungen prüfen. |

Diese Methodik ist ein etabliertes, stabiles Fundament; der Bonus betrifft primär, wie Tooling die Erkennung und Pflege von Kontextgrenzen unterstützen kann, ohne die fachliche Analyse zu ersetzen.
