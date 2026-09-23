---
{"id": "KB-0684", "title": "Architekturreviews durchführen", "domain": "30", "sequence": 8, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0678", "concepts": ["Messbare Qualitätsszenarien"], "needed_for": "Ein Architekturreview prüft ein Design gegen die in KB-0678 beschriebenen, messbaren NFR-Szenarien"}, {"id": "KB-0682", "concepts": ["Dokumentierte Optionen und Implementierungsfolgen"], "needed_for": "Ein Architekturreview bewertet das im Design Doc aus KB-0682 dokumentierte Design"}], "related": ["KB-0612"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für ein gegebenes Design ein Architekturreview anhand NFRs, Trust Boundaries und Betriebsfolgen durchführen und dabei evidenzbasierte, umsetzbare Rückmeldungen statt reiner Geschmacksurteile liefern.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein komplexes Design mehrere Reviewfeststellungen nach tatsächlicher Priorität ordnen und begründen, welche Feststellung vor Umsetzungsbeginn tatsächlich adressiert werden muss.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Reviewrückmeldung ein reines Geschmacksurteil ohne belastbare Evidenz oder konkrete Umsetzbarkeit darstellt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Architekturreviews festlegen, die evidenzbasierte, priorisierte und umsetzbare Rückmeldung als verbindliche Reviewqualität vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, automatisierte Architecture-Fitness-Function-Implementierung im Detail ist Vertiefung und wird als etabliert referenziert.", "rationale": "Kern ist die menschliche Reviewpraxis mit evidenzbasierter, priorisierter Rückmeldung, nicht die automatisierte Fitness-Function-Implementierung selbst."}}, "lab_validation": [{"lab_id": "KB-0684-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung evidenzbasierter versus geschmacksbasierter Reviewrückmeldung, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie eine Reviewrückmeldung ohne Evidenzbezug und Priorität im Vergleich zu einer evidenzbasierten, priorisierten Rückmeldung unterschiedlich wirksam zur tatsächlichen Designverbesserung beiträgt.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# Architekturreviews durchführen

> **Ziel:** Ein Architekturreview prüft ein konkretes Design gegen drei Dimensionen: **NFRs** (ob das Design die in KB-0678 beschriebenen, messbaren Qualitätsszenarien tatsächlich erfüllen kann), **Trust Boundaries** (ob Vertrauensgrenzen zwischen Systemkomponenten tatsächlich korrekt gezogen sind, sodass eine Komponente nicht implizit mehr vertraut als tatsächlich gerechtfertigt) und **Betriebsfolgen** (was das Design tatsächlich für den laufenden Betrieb bedeutet — Wartbarkeit, Diagnosefähigkeit, Ausfallverhalten). Der zentrale Punkt dieses Kapitels ist, dass ein Architekturreview evidenzbasierte, priorisierte und tatsächlich umsetzbare Rückmeldungen liefern muss, statt reiner Geschmacksurteile ("ich würde das anders machen") — eine Rückmeldung ohne belastbare Evidenz und ohne konkreten Umsetzungsvorschlag zwingt den Designautor tatsächlich dazu, den eigentlichen Kritikpunkt selbst zu erraten, was den Reviewprozess tatsächlich ineffektiv macht.

## Zweck, Mental Model und Dependencies

NFR-Prüfung bedeutet, das Design tatsächlich konkret gegen die zuvor in einem NFR-Workshop (siehe KB-0678) festgelegten, messbaren Qualitätsszenarien zu prüfen — eine Reviewaussage wie "das könnte zu langsam sein" ist tatsächlich nicht überprüfbar, während "das Design sieht bei 1000 gleichzeitigen Nutzern einen synchronen Datenbankaufruf pro Anfrage vor, was das im NFR-Workshop festgelegte 500ms-Ziel voraussichtlich verfehlt" eine tatsächlich überprüfbare, konkrete Feststellung ist. Trust-Boundary-Prüfung bedeutet, tatsächlich zu verifizieren, dass jede Komponente nur die Daten und Berechtigungen erhält, die sie tatsächlich benötigt, und dass Vertrauensgrenzen (etwa zwischen einem öffentlich zugänglichen Frontend und einem internen Backend) tatsächlich explizit im Design gezogen sind — ein Design, das implizit annimmt, eine Komponente sei vertrauenswürdig, ohne dies tatsächlich zu begründen, stellt ein tatsächliches Sicherheitsrisiko dar, das ein Review explizit aufdecken muss. Betriebsfolgen zu prüfen bedeutet, tatsächlich zu bewerten, was das Design für den laufenden Betrieb bedeutet — kann ein Fehler tatsächlich diagnostiziert werden, ist das Ausfallverhalten tatsächlich definiert (entsprechend dem in KB-0649 eingeführten Prinzip), ist die Wartbarkeit für das tatsächlich verantwortliche Team tatsächlich angemessen; ein Design, das rein funktional korrekt ist, aber tatsächlich schwer zu betreiben ist, hat ein Review-relevantes Problem, das ebenso wichtig ist wie ein funktionaler Mangel. Evidenz statt Geschmacksurteile bedeutet, jede Reviewfeststellung tatsächlich zu belegen — nicht "ich mag diesen Ansatz nicht", sondern "dieser Ansatz führt bei X zu Y, was tatsächlich gegen Anforderung Z verstößt"; diese Evidenzpflicht zwingt den Reviewer tatsächlich dazu, seine eigene Kritik zu prüfen, bevor er sie äußert, statt eine subjektive Präferenz als objektiven Mangel zu präsentieren. Priorität bedeutet, dass nicht jede Reviewfeststellung gleich schwer wiegt — eine Feststellung, die eine tatsächliche Sicherheitslücke oder einen tatsächlichen NFR-Verstoß betrifft, muss tatsächlich vor Umsetzungsbeginn adressiert werden, während eine stilistische Anmerkung tatsächlich nachrangig behandelt werden kann; ein Review, das alle Feststellungen undifferenziert gleich behandelt, überfordert den Designautor tatsächlich mit der Frage, was tatsächlich kritisch ist. Umsetzbarkeit bedeutet, dass eine Reviewfeststellung tatsächlich einen konkreten, nachvollziehbaren Lösungsweg nahelegt, statt lediglich ein Problem zu benennen, ohne eine tatsächlich verfolgbare Richtung für die Behebung aufzuzeigen.

~~~text
Architecture Review checks a concrete design against 3 dimensions
  NFRs: whether design CAN ACTUALLY meet KB-0678's measurable quality scenarios
  TRUST BOUNDARIES: whether trust boundaries between system components are ACTUALLY
  correctly drawn, so a component doesn't implicitly trust more than ACTUALLY justified
  OPERATIONAL CONSEQUENCES: what design ACTUALLY means for ongoing operations --
  maintainability, diagnosability, failure behavior
KEY POINT: architecture review must deliver evidence-based, prioritized, ACTUALLY
  actionable feedback instead of pure taste judgments ("I'd do it differently") -- feedback
  w/o solid evidence + w/o concrete implementation suggestion ACTUALLY forces design
  author to guess the actual criticism themselves, making review process ACTUALLY
  ineffective
NFR CHECK means ACTUALLY concretely checking design against measurable quality scenarios
  previously fixed in NFR workshop (see KB-0678) -- review statement like "that might be
  too slow" ACTUALLY unverifiable, while "design foresees synchronous DB call per
  request at 1000 concurrent users, likely missing NFR workshop's 500ms target" =
  ACTUALLY verifiable, concrete finding
TRUST BOUNDARY CHECK means ACTUALLY verifying every component only gets data+permissions
  it ACTUALLY needs, and trust boundaries (public frontend vs internal backend)
  ACTUALLY explicitly drawn in design -- design implicitly assuming a component
  trustworthy w/o ACTUALLY justifying this = ACTUAL security risk review must explicitly
  uncover
OPERATIONAL CONSEQUENCES CHECK means ACTUALLY assessing what design means for ongoing
  operations -- can a fault ACTUALLY be diagnosed, is failure behavior ACTUALLY defined
  (per KB-0649's principle), is maintainability ACTUALLY appropriate for the ACTUALLY
  responsible team -- design purely functionally correct but ACTUALLY hard to operate
  has a review-relevant problem equally important as a functional defect
EVIDENCE INSTEAD OF TASTE JUDGMENTS means ACTUALLY substantiating every review finding
  -- not "I don't like this approach" but "this approach leads to Y under X, ACTUALLY
  violating requirement Z" -- this evidence obligation ACTUALLY forces reviewer to check
  own criticism before voicing it, instead of presenting subjective preference as
  objective flaw
PRIORITY means not every review finding weighs equally -- finding touching an ACTUAL
  security gap or ACTUAL NFR violation must ACTUALLY be addressed before implementation
  begins, while a stylistic remark can ACTUALLY be treated as secondary -- review
  treating all findings undifferentiated equally ACTUALLY overburdens design author w/
  question of what's ACTUALLY critical
ACTIONABILITY means a review finding ACTUALLY suggests a concrete, traceable solution
  path instead of merely naming a problem w/o showing an ACTUALLY followable direction
  for remediation
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| NFR-Prüfung gegen messbare Szenarien | macht Reviewfeststellungen überprüfbar | vage Aussagen ("zu langsam") sind nicht überprüfbar |
| Trust-Boundary-Prüfung | deckt unbegründetes, implizites Vertrauen auf | verhindert tatsächliche Sicherheitsrisiken |
| Betriebsfolgen-Prüfung | bewertet Diagnosefähigkeit, Ausfallverhalten, Wartbarkeit | funktional korrekt, aber schwer betreibbar ist ebenfalls relevant |
| Evidenzpflicht statt Geschmacksurteil | zwingt Reviewer zur Prüfung eigener Kritik | verhindert subjektive Präferenz als objektiver Mangel |
| Explizite Priorisierung | unterscheidet kritisch von nachrangig | verhindert Überforderung durch undifferenzierte Feststellungen |
| Umsetzbare Lösungsrichtung | zeigt konkreten Weg statt bloßer Problemnennung | ermöglicht tatsächliche Adressierung |

Implementierung: Jede Reviewfeststellung wird gegen ein konkretes NFR, eine Trust Boundary oder eine Betriebsfolge belegt. Feststellungen werden explizit nach Priorität (kritisch vor Umsetzung vs. nachrangig) geordnet. Jede kritische Feststellung enthält einen konkreten, umsetzbaren Lösungsvorschlag.

## Scalability, Reliability, Security und Observability

Eine Architekturreview-Praxis skaliert über die Anzahl der parallel geprüften Designs; die Reliability-Grenze liegt darin, dass ein unbegründetes Geschmacksurteil den Reviewprozess tatsächlich ineffektiv macht, da der Designautor die eigentliche Kritik nicht nachvollziehen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Reviewfeedback wird vom Designautor nicht umgesetzt, da unklar bleibt, was gemeint ist | die Feststellung war ein Geschmacksurteil ohne Evidenz und ohne konkreten Lösungsvorschlag | die Feststellung mit belastbarer Evidenz und konkretem Lösungsvorschlag nacharbeiten |
| ein Design mit tatsächlichem NFR-Verstoß wird trotz Review umgesetzt | die kritische Feststellung wurde nicht explizit priorisiert und ging in einer Liste nachrangiger Punkte unter | eine explizite Priorisierung mit klarer Kennzeichnung kritischer Feststellungen einführen |
| eine Komponente erhält unerwartet mehr Zugriff, als sie tatsächlich benötigt | die Trust-Boundary-Prüfung im Review hat das implizite Vertrauen nicht aufgedeckt | die Trust-Boundary-Prüfung explizit als eigenen Reviewschritt verankern |

Security: Trust-Boundary-Feststellungen sollten immer als kritisch priorisiert werden, da unbegründetes Vertrauen ein tatsächliches Sicherheitsrisiko darstellt. Observability: Die tatsächliche Rate umgesetzter, kritischer Reviewfeststellungen ist ein zentrales Signal zur Bewertung der Reviewwirksamkeit.

## Trade-offs und Entscheidungen

**Staff** liefert für einen begrenzten Designbereich eine evidenzbasierte, umsetzbare Reviewfeststellung. **Principal** führt ein vollständiges Architekturreview mit NFR-, Trust-Boundary- und Betriebsfolgenprüfung sowie expliziter Priorisierung durch. **Chief** legt unternehmensweite Standards für Architekturreviews fest, die evidenzbasierte, priorisierte und umsetzbare Rückmeldung verpflichtend vorschreiben.

Anti-Patterns: Reviewfeststellungen als reine Geschmacksurteile ohne Evidenz äußern; alle Feststellungen undifferenziert gleich priorisieren; ein Problem benennen, ohne eine tatsächlich umsetzbare Lösungsrichtung aufzuzeigen.

## Production Checklist

- [ ] Jede Reviewfeststellung ist mit konkreter Evidenz gegen NFR, Trust Boundary oder Betriebsfolge belegt.
- [ ] Feststellungen sind explizit nach Priorität geordnet.
- [ ] Kritische Feststellungen enthalten einen konkreten, umsetzbaren Lösungsvorschlag.
- [ ] Trust-Boundary-Prüfung ist als eigenständiger Reviewschritt durchgeführt.

## Interviewfragen

### 1. Warum ist eine Reviewfeststellung ohne Evidenz problematisch?

**Antwort:** Weil sie den Designautor zwingt, den eigentlichen Kritikpunkt selbst zu erraten, was den Reviewprozess ineffektiv macht.

### 2. Was prüft die Trust-Boundary-Dimension eines Architekturreviews?

**Antwort:** Ob jede Komponente nur die Daten und Berechtigungen erhält, die sie tatsächlich benötigt, und ob Vertrauensgrenzen explizit statt implizit angenommen im Design gezogen sind.

### 3. Warum sollten Betriebsfolgen ebenso wichtig wie funktionale Korrektheit im Review bewertet werden?

**Antwort:** Weil ein Design, das funktional korrekt, aber schwer zu betreiben, zu diagnostizieren oder zu warten ist, ein ebenso relevantes Problem darstellt wie ein funktionaler Mangel.

### 4. Warum müssen Reviewfeststellungen priorisiert werden?

**Antwort:** Weil nicht jede Feststellung gleich schwer wiegt; kritische Sicherheits- oder NFR-Verstöße müssen vor Umsetzungsbeginn adressiert werden, während stilistische Anmerkungen nachrangig behandelt werden können.

### 5. Wie gehst du vor, wenn ein Reviewfeedback vom Designautor nicht umgesetzt wird, da unklar bleibt, was gemeint ist?

**Antwort:** Ich prüfe, ob die Feststellung ein unbegründetes Geschmacksurteil war, und arbeite sie mit belastbarer Evidenz und einem konkreten Lösungsvorschlag nach.

### 6. Widersprüchliche Anforderung: Das Entwicklungsteam will minimale Reviewzyklen für schnellen Umsetzungsbeginn UND die Organisation will vollständige NFR-, Trust-Boundary- und Betriebsfolgenprüfung vor jeder Umsetzung — wie gehst du vor?

**Antwort:** Ich würde das Review auf die tatsächlich kritischen Dimensionen (Sicherheitsrelevante Trust Boundaries, harte NFR-Grenzen) fokussieren und nachrangige, stilistische Aspekte in einem separaten, nicht-blockierenden Feedback-Kanal behandeln, sodass die kritische Prüfung erhalten bleibt, ohne den Umsetzungsbeginn unnötig zu verzögern.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Design für eine neue Order-Service-Komponente (angelehnt an Domain 29) wird im Architekturreview geprüft. Ein Reviewer merkt an "der Code-Stil gefällt mir nicht", während ein zweiter Reviewer feststellt, dass der Order-Service direkten Datenbankzugriff auf das Payment-Service-Schema erhält.

~~~python
# Local, deterministic illustration of evidence-based, prioritized review findings vs. taste judgments (fictional lab example, no real system):

findings = [
    {"finding": "code style preference", "evidence": None, "priority": "low", "actionable": False},
    {"finding": "Order Service has direct DB access to Payment Service schema", "evidence": "violates trust boundary between services", "priority": "critical", "actionable": True},
]

def filter_blocking_findings(findings):
    return [f for f in findings if f["priority"] == "critical" and f["evidence"] is not None]

print(filter_blocking_findings(findings))
~~~

Erwartete Beobachtung: Nur die Trust-Boundary-Feststellung mit Evidenz wird als blockierend für die Umsetzung eingestuft, während das nicht belegte Geschmacksurteil zum Code-Stil als nachrangig behandelt wird. Auswertung: Der Designautor kann sich auf die tatsächlich kritische, evidenzbasierte Feststellung konzentrieren, statt beide Punkte als gleichwertig zu behandeln.

## Dependencies, Cross-References und Quellen

1. Neal Ford, Rebecca Parsons, Patrick Kua: [Building Evolutionary Architectures — Architecture Fitness Functions](https://www.oreilly.com/library/view/building-evolutionary-architectures/9781491986356/), abgerufen 2026-09-18.
2. Software Engineering Institute (SEI), Carnegie Mellon University: [Architecture Tradeoff Analysis Method (ATAM)](https://insights.sei.cmu.edu/library/atam-method-for-architecture-evaluation/), abgerufen 2026-09-18.

Dieses Kapitel baut auf der in KB-0678 (NFR-Workshops moderieren) beschriebenen Szenario-Konkretisierung und der in KB-0682 (Design Docs als Arbeitsinstrument) beschriebenen Dokumentation auf.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Architecture Fitness Functions zur kontinuierlichen, codebasierten Prüfung von NFR- und Trust-Boundary-Regeln | Growing Adoption | Bei künftigen Vorhaben als Ergänzung zu manuellen Architekturreviews evaluieren, jedoch die menschliche Bewertung von Betriebsfolgen und Kontext weiterhin als notwendige Ergänzung zu automatisierten Prüfungen beibehalten. |

Ein Team akzeptiert ein Architekturreview erst abgeschlossen, wenn alle kritischen Feststellungen evidenzbasiert, priorisiert und mit umsetzbarem Lösungsvorschlag dokumentiert sind.
