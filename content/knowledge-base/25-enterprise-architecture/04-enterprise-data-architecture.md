---
{"id": "KB-0592", "title": "Enterprise Data Architecture", "domain": "25", "sequence": 4, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0591", "concepts": ["Application Architecture im Unternehmen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Datenobjekte, Eigentümer und Systemgrenzen für eine konkrete Organisation anhand etablierter Data-Architecture-Praxis korrekt verbinden und Stammdatenverantwortung eindeutig zuordnen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Stammdatenverantwortung, Datenaustausch und semantische Konsistenz als unternehmensweite Entscheidungen getroffen werden, unabhängig von der technischen Pipelineimplementierung.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine semantische Inkonsistenz (derselbe Datenbegriff wird in unterschiedlichen Systemen unterschiedlich definiert) zu fehlerhaften, unternehmensweiten Entscheidungen führt, und die Ursache auf fehlende Stammdatenverantwortung zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Stammdatenverantwortung und semantische Konsistenz festlegen, die als organisatorische Entscheidung statt als reine technische Pipelinefrage behandelt werden.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die technische Implementierung von Datenpipelines ist bereits kanonisch in Domain 10 behandelt und hier bewusst nicht wiederholt.", "rationale": "Kern ist die unternehmensweite, organisatorische Entscheidung über Stammdatenverantwortung und semantische Konsistenz, nicht die technische Pipelineimplementierung."}}, "lab_validation": [{"lab_id": "KB-0592-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Erkennung semantischer Inkonsistenz zwischen Systemen, kein produktives Data-Governance-Tool verwendet", "evidence": "Ein lokales Skript vergleicht die Definition eines Datenbegriffs (etwa 'aktiver Kunde') in mehreren Systemen und zeigt, wie unterschiedliche, nicht abgestimmte Definitionen zu widersprüchlichen, unternehmensweiten Kennzahlen führen können.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Data-Governance-Tool."}]}
---
# Enterprise Data Architecture

> **Ziel:** Enterprise Data Architecture verbindet Datenobjekte (die fachlich bedeutsamen Datenentitäten eines Unternehmens, etwa "Kunde", "Produkt", "Auftrag"), deren Eigentümer (welche Organisationseinheit für die Korrektheit und Pflege eines Datenobjekts verantwortlich ist) und Systemgrenzen (welche Anwendungen ein Datenobjekt tatsächlich verwalten oder nutzen). Der zentrale Punkt dieses Kapitels ist, dass Stammdatenverantwortung, Datenaustausch und semantische Konsistenz als **unternehmensweite, organisatorische Entscheidungen** behandelt werden müssen — nicht als reine technische Pipelineimplementierung, deren konkrete technische Mechanik bereits kanonisch in Domain 10 behandelt ist. Eine technisch einwandfrei funktionierende Datenpipeline kann dennoch semantisch inkonsistente Daten transportieren, wenn derselbe Datenbegriff (etwa "aktiver Kunde") in den beteiligten Systemen unterschiedlich definiert ist — dieses Problem lässt sich nicht durch bessere Pipelinetechnik lösen, sondern nur durch eine explizite, organisatorische Entscheidung über eine einheitliche, unternehmensweite Definition und deren verantwortlichen Eigentümer.

## Zweck, Mental Model und Dependencies

Stammdaten (Master Data) sind Datenobjekte, die von mehreren Systemen im Unternehmen gemeinsam genutzt werden und daher eine eindeutige, unternehmensweit abgestimmte Definition benötigen — ohne eine klar zugeordnete Stammdatenverantwortung (welche Organisationseinheit die maßgebliche, autoritative Version eines Datenobjekts pflegt und für dessen Korrektheit verantwortlich ist) entstehen typischerweise mehrere, parallele, leicht unterschiedliche Versionen desselben fachlichen Objekts in verschiedenen Systemen, die im Zeitverlauf zunehmend auseinanderdriften. Semantische Konsistenz betrifft nicht die technische Übertragung von Daten (die bereits in Domain 10 behandelte Pipelinemechanik: wie Daten technisch von System A nach System B transportiert werden), sondern die fachliche Bedeutung der übertragenen Daten: Zwei Systeme können technisch fehlerfrei Daten austauschen, während sie denselben Begriff (etwa "aktiver Kunde": definiert System A als "hat in den letzten 12 Monaten eine Bestellung getätigt", System B als "hat ein aktives Abonnement") unterschiedlich definieren — das Ergebnis ist eine technisch korrekt funktionierende, aber fachlich irreführende Datenintegration, deren daraus abgeleitete unternehmensweite Kennzahlen (etwa "Anzahl aktiver Kunden") je nach Datenquelle widersprüchliche Werte liefern, ohne dass ein technischer Fehler vorliegt. Die entscheidende methodische Konsequenz ist, dass diese semantische Konsistenz nicht durch technische Pipelineverbesserung gelöst werden kann, sondern eine explizite, organisatorische Entscheidung erfordert: eine unternehmensweit abgestimmte, dokumentierte Definition jedes zentralen Datenbegriffs, mit einem klar benannten, verantwortlichen Eigentümer, der bei künftigen Abweichungen die maßgebliche Definition durchsetzt.

~~~text
Enterprise Data Architecture: connects data objects (business-meaningful entities: "customer", "product", "order"),
  their OWNERS (which org unit responsible for correctness/maintenance), and system boundaries
  (which apps actually manage/use a data object)
KEY POINT: master data ownership, data exchange, and SEMANTIC CONSISTENCY
  must be treated as ENTERPRISE-WIDE, ORGANIZATIONAL decisions
  NOT as pure technical pipeline implementation (technical mechanics already canonical in Domain 10)
  technically flawless data pipeline can STILL transport semantically inconsistent data
    if same data term (e.g. "active customer") defined differently across involved systems
  this problem NOT solvable via better pipeline tech -- only via explicit, organizational decision
    on unified, enterprise-wide definition + responsible owner
MASTER DATA: data objects shared by multiple systems, need unique, enterprise-wide agreed definition
  without clearly assigned master data ownership
    (which org unit maintains the authoritative version, responsible for correctness)
  -> typically multiple, parallel, slightly different versions of same business object emerge
     across different systems, increasingly diverging over time
SEMANTIC CONSISTENCY != technical data transport
  (Domain 10 pipeline mechanics: how data technically moves from System A to System B)
  concerns instead: BUSINESS MEANING of transported data
  two systems CAN technically exchange data flawlessly while defining same term differently
    (e.g. "active customer": System A = "ordered in last 12 months", System B = "has active subscription")
  RESULT: technically correctly functioning, but business-misleading data integration
    -> derived enterprise-wide metrics (e.g. "number of active customers")
       give CONTRADICTORY values depending on data source, with NO technical error present
CENTRAL METHODOLOGICAL CONSEQUENCE: semantic consistency NOT solvable via pipeline improvement
  requires explicit, organizational decision: enterprise-wide agreed, documented definition
    of each central data term, with clearly named responsible owner enforcing authoritative definition
    on future deviations
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Stammdaten (Master Data) | Datenobjekte, die mehrere Systeme gemeinsam nutzen | benötigen eindeutige, unternehmensweite Definition |
| Stammdatenverantwortung | benennt verantwortliche Organisationseinheit je Datenobjekt | verhindert auseinanderdriftende, parallele Versionen |
| Semantische Konsistenz | fachlich einheitliche Bedeutung eines Datenbegriffs | unabhängig von technisch korrektem Datenaustausch |
| Datenaustausch (Systemgrenze) | dokumentiert, welche Systeme welche Daten nutzen | Grundlage für Konsistenzprüfung über Systemgrenzen hinweg |

Implementierung: Zentrale Datenobjekte werden mit einer eindeutig benannten, verantwortlichen Organisationseinheit als Stammdateneigentümer dokumentiert. Zentrale Datenbegriffe werden unternehmensweit einheitlich definiert und dokumentiert, unabhängig von der technischen Pipelineimplementierung. Abweichende, lokale Definitionen werden bei ihrer Entdeckung explizit auf die maßgebliche, unternehmensweite Definition zurückgeführt.

## Scalability, Reliability, Security und Observability

Enterprise Data Architecture skaliert die Verlässlichkeit unternehmensweiter, datenbasierter Entscheidungen proportional zur Konsequenz, mit der semantische Konsistenz als organisatorische statt rein technische Frage behandelt wird; die Reliability-Grenze liegt darin, dass technisch einwandfreie Datenpipelines ohne abgestimmte semantische Konsistenz widersprüchliche, aber jeweils technisch korrekt berechnete Kennzahlen liefern können.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| dieselbe unternehmensweite Kennzahl liefert je nach Datenquelle widersprüchliche Werte | derselbe Datenbegriff ist in den beteiligten Systemen unterschiedlich definiert | die Definitionen des betroffenen Datenbegriffs über die beteiligten Systeme vergleichen und vereinheitlichen |
| ein Stammdatenobjekt driftet in mehreren Systemen zunehmend auseinander | keine klar zugeordnete Stammdatenverantwortung existiert für dieses Objekt | eine verantwortliche Organisationseinheit als Stammdateneigentümer explizit benennen |
| eine technisch fehlerfreie Datenintegration führt dennoch zu fachlich falschen Ergebnissen | ein semantisches Konsistenzproblem statt ein technisches Pipelineproblem liegt vor | die fachliche Definition der beteiligten Datenbegriffe statt die technische Pipeline prüfen |

Security: Stammdatenverantwortung ist auch für sicherheitsrelevante Datenklassifizierung relevant (wer entscheidet, welche Datenobjekte als sensibel gelten). Observability: Die tatsächliche Konsistenz zentraler Kennzahlen über verschiedene Datenquellen hinweg ist ein zentrales Signal zur Bewertung, ob semantische Konsistenz tatsächlich durchgesetzt wird.

## Trade-offs und Entscheidungen

**Staff** dokumentiert Datenobjekte und deren Definition für ein gegebenes System korrekt. **Principal** entwirft die vollständige Stammdatenverantwortungsstruktur und semantische Konsistenzstrategie für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für Stammdatenverantwortung und semantische Konsistenz fest.

Anti-Patterns: semantische Konsistenzprobleme als reine technische Pipelinefragen behandeln, statt eine organisatorische Definitionsentscheidung zu treffen; Stammdatenobjekte ohne klar zugeordnete, verantwortliche Organisationseinheit pflegen; zentrale Datenbegriffe in verschiedenen Systemen unterschiedlich definieren lassen, ohne dies unternehmensweit abzustimmen.

## Production Checklist

- [ ] Zentrale Stammdatenobjekte haben eine eindeutig benannte, verantwortliche Organisationseinheit.
- [ ] Zentrale Datenbegriffe sind unternehmensweit einheitlich definiert und dokumentiert.
- [ ] Abweichende, lokale Definitionen werden bei Entdeckung auf die maßgebliche Definition zurückgeführt.
- [ ] Die Konsistenz zentraler, unternehmensweiter Kennzahlen wird über Datenquellen hinweg überwacht.

## Interviewfragen

### 1. Warum reicht eine technisch fehlerfreie Datenpipeline nicht aus, um semantische Konsistenz sicherzustellen?

**Antwort:** Weil zwei Systeme technisch korrekt Daten austauschen können, während sie denselben fachlichen Begriff unterschiedlich definieren, was zu widersprüchlichen, abgeleiteten Kennzahlen führt, ohne dass ein technischer Fehler vorliegt.

### 2. Was ist Stammdatenverantwortung und wofür wird sie benötigt?

**Antwort:** Die klare Zuordnung einer Organisationseinheit als verantwortlicher Eigentümer eines Stammdatenobjekts, die verhindert, dass parallele, leicht unterschiedliche Versionen desselben Objekts in verschiedenen Systemen auseinanderdriften.

### 3. Warum wird semantische Konsistenz als organisatorische statt technische Frage behandelt?

**Antwort:** Weil die Lösung eine unternehmensweit abgestimmte, dokumentierte Definition mit benanntem, verantwortlichem Eigentümer erfordert, nicht eine Verbesserung der technischen Datenübertragung.

### 4. Was unterscheidet Enterprise Data Architecture von der technischen Datenpipelineimplementierung?

**Antwort:** Enterprise Data Architecture trifft organisatorische Entscheidungen über Stammdatenverantwortung, Datenaustausch und semantische Konsistenz, während die technische Pipelineimplementierung (bereits in Domain 10 behandelt) die tatsächliche, technische Datenübertragung umsetzt.

### 5. Wie gehst du vor, wenn dieselbe unternehmensweite Kennzahl je nach Datenquelle widersprüchliche Werte liefert?

**Antwort:** Ich vergleiche die Definitionen des betroffenen Datenbegriffs in den beteiligten Systemen, da eine unterschiedliche fachliche Definition trotz technisch korrekter Datenübertragung zu widersprüchlichen Werten führen kann.

### 6. Widersprüchliche Anforderung: Geschäftsbereiche wollen eigene, lokal angepasste Definitionen zentraler Datenbegriffe UND die Organisation will unternehmensweit konsistente Kennzahlen — wie gehst du vor?

**Antwort:** Ich würde eine unternehmensweit maßgebliche Kerndefinition für zentrale, bereichsübergreifend genutzte Kennzahlen festlegen und lokale Zusatzdefinitionen explizit als abgeleitete, klar gekennzeichnete Varianten zulassen, statt entweder lokale Flexibilität vollständig zu unterbinden oder unternehmensweite Konsistenz zentraler Kennzahlen zu gefährden.

## Praktische Labs

~~~python
# Local, deterministic simulation of semantic inconsistency across systems (executed locally, no real data governance tool):

def check_definition_consistency(definitions):
    unique_definitions = set(definitions.values())
    return {"consistent": len(unique_definitions) == 1, "definitions": definitions}

definitions = {
    "System A": "ordered in last 12 months",
    "System B": "has active subscription",
    "System C": "ordered in last 12 months",
}

print(check_definition_consistency(definitions))
~~~

## Dependencies, Cross-References und Quellen

1. The Open Group: [TOGAF Standard, 10th Edition — Data Architecture](https://pubs.opengroup.org/togaf-standard/introduction/), abgerufen 2026-09-18.
2. DAMA International: [DAMA-DMBOK: Data Management Body of Knowledge — Master Data Management Overview](https://www.dama.org/cpages/body-of-knowledge), abgerufen 2026-09-18.

Application Architecture ist kanonisch in [KB-0591](03-application-architecture-im-unternehmen.md) behandelt; technische Datenpipelinemechanik in Domain 10.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, KI-gestützte Erkennung semantischer Inkonsistenzen zwischen Systemen durch Analyse von Feldnamen und Wertverteilungen | Evaluating | Als ergänzendes Diagnosewerkzeug zur Priorisierung prüfen, jedoch die abschließende, maßgebliche Definitionsentscheidung weiterhin als organisatorische, nicht automatisierte Entscheidung behandeln. |

Ein Team akzeptiert eine Enterprise Data Architecture erst, wenn Stammdatenverantwortung eindeutig zugeordnet und zentrale Datenbegriffe nachweislich unternehmensweit einheitlich definiert sind, statt semantische Konsistenz als rein technisches Pipelineproblem zu behandeln.
