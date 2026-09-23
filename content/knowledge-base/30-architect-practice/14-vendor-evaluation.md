---
{"id": "KB-0690", "title": "Vendor Evaluation", "domain": "30", "sequence": 14, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0689", "concepts": ["Kontrollbedarfsbewertung"], "needed_for": "Vendor Evaluation konkretisiert die in KB-0689 beschriebene Buy-Option auf die tatsächliche Anbieterauswahl"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für eine gegebene Vendor-Auswahl konkrete Anforderungen, Prüfszenarien und Ausschlusskriterien festlegen und Produktnachweise statt Demonstrationen systematisch bewerten können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine komplexe Vendor-Entscheidung Vertragsgrenzen und Exit-Fähigkeit explizit prüfen und gegen die tatsächlichen Anforderungen abwägen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Vendor-Entscheidung auf Basis einer Demonstration statt eines systematischen Produktnachweises getroffen wird.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Vendor Evaluation festlegen, die systematische Prüfszenarien und verpflichtende Exit-Fähigkeitsbewertung vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, vertragsrechtliche Prüfung spezifischer Klauseln im Detail ist Vertiefung und erfordert typischerweise juristische Fachberatung.", "rationale": "Kern ist die technische, systematische Anforderungs- und Nachweisprüfung, nicht die vertragsrechtliche Detailprüfung."}}, "lab_validation": [{"lab_id": "KB-0690-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung von Ausschlusskriterien gegenüber einer eindrucksvollen Demonstration, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie ein Anbieter mit einer eindrucksvollen Demonstration ein explizites Ausschlusskriterium (fehlende Exit-Fähigkeit) tatsächlich nicht erfüllt und deshalb korrekt ausgeschlossen wird, statt aufgrund des positiven Demonstrationseindrucks ausgewählt zu werden.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# Vendor Evaluation

> **Ziel:** Vendor Evaluation prüft eine externe Lösung systematisch anhand vorab festgelegter **Anforderungen**, **Prüfszenarien** (konkrete, tatsächlich durchgeführte Tests gegen diese Anforderungen) und **Ausschlusskriterien** (explizite Bedingungen, deren Nichterfüllung einen Anbieter tatsächlich automatisch disqualifiziert, unabhängig von anderen Stärken). Der zentrale Punkt dieses Kapitels ist die Unterscheidung zwischen tatsächlichen Produktnachweisen und einer bloßen Demonstration oder Marketingbehauptung — eine vom Anbieter vorbereitete, eindrucksvolle Demonstration zeigt tatsächlich nur, was unter für den Anbieter optimalen, kontrollierten Bedingungen funktioniert, während ein systematischer Produktnachweis (etwa ein eigener Test gegen die tatsächlichen, eigenen Anforderungen) tatsächlich zeigt, ob die Lösung unter den eigenen, realen Bedingungen tatsächlich funktioniert.

## Zweck, Mental Model und Dependencies

Anforderungen vorab festzulegen bedeutet, tatsächlich vor Beginn der Anbieterprüfung zu definieren, was die Lösung tatsächlich leisten muss — ohne diese Vorab-Festlegung besteht tatsächlich das Risiko, dass die Bewertung sich unbewusst an den Stärken eines bereits präferierten Anbieters orientiert, statt objektiv gegen die tatsächlichen, eigenen Bedürfnisse zu prüfen. Prüfszenarien sind konkrete, tatsächlich durchgeführte Tests, die verifizieren, ob eine Lösung die festgelegten Anforderungen tatsächlich erfüllt — dies unterscheidet sich fundamental von einer Anbieter-Demonstration, da ein Prüfszenario tatsächlich unter den eigenen, realistischen Bedingungen (etwa mit den eigenen, tatsächlichen Datenvolumina oder Lastprofilen) durchgeführt wird, während eine Demonstration typischerweise unter für den Anbieter optimierten, nicht notwendigerweise repräsentativen Bedingungen stattfindet. Ausschlusskriterien sind explizite, nicht verhandelbare Bedingungen, deren Nichterfüllung einen Anbieter automatisch disqualifiziert — etwa eine fehlende Exit-Fähigkeit (siehe unten) bei einer geschäftskritischen Funktion, oder eine fehlende, regulatorisch tatsächlich erforderliche Zertifizierung; diese Kriterien verhindern, dass ein Anbieter mit ansonsten überzeugenden Eigenschaften trotz eines tatsächlich kritischen Mangels ausgewählt wird, weil dieser Mangel in der Gesamtbewertung unterging. Vertragsgrenzen zu prüfen bedeutet, tatsächlich zu verstehen, was der Vertrag konkret zusichert und was er tatsächlich nicht zusichert (etwa Verfügbarkeits-SLAs mit tatsächlichen, nicht nur beworbenen Werten, oder Haftungsgrenzen bei Datenverlust) — eine Marketingbehauptung zur Verfügbarkeit ist tatsächlich nicht bindend, während eine vertraglich zugesicherte SLA tatsächlich einklagbar ist; diese Unterscheidung muss bei der Bewertung tatsächlich getroffen werden. Exit-Fähigkeit zu prüfen bedeutet, tatsächlich zu klären, wie eine Organisation den Anbieter tatsächlich wieder verlassen kann — welche Daten in welchem Format tatsächlich exportierbar sind, welche Migrationsaufwände tatsächlich entstehen, und ob eine Abhängigkeit tatsächlich so tief wird, dass ein späterer Wechsel praktisch unmöglich wird (Vendor Lock-in) — diese Prüfung ist besonders wichtig für geschäftskritische Funktionen, bei denen ein tatsächlicher Anbieterwechsel später tatsächlich notwendig werden könnte.

~~~text
Vendor Evaluation systematically checks external solution against predefined
  REQUIREMENTS, TEST SCENARIOS (concrete, ACTUALLY conducted tests against these
  requirements), EXCLUSION CRITERIA (explicit conditions whose non-fulfillment
  ACTUALLY automatically disqualifies a vendor, independent of other strengths)
KEY POINT: distinguishing ACTUAL product evidence from mere demonstration or marketing
  claim -- vendor-prepared, impressive demo ACTUALLY shows only what works under
  vendor-optimal, controlled conditions, while systematic product evidence (own test
  against ACTUAL, own requirements) ACTUALLY shows whether solution ACTUALLY works
  under own, real conditions
PREDEFINING REQUIREMENTS means ACTUALLY defining before vendor evaluation begins what
  solution ACTUALLY must deliver -- w/o this pre-definition, ACTUAL risk that evaluation
  unconsciously orients toward strengths of an already-preferred vendor, instead of
  objectively checking against ACTUAL, own needs
TEST SCENARIOS = concrete, ACTUALLY conducted tests verifying whether solution ACTUALLY
  fulfills defined requirements -- fundamentally differs from vendor demo, since test
  scenario ACTUALLY conducted under own, realistic conditions (own actual data volumes/
  load profiles), while demo typically happens under vendor-optimized, not necessarily
  representative conditions
EXCLUSION CRITERIA = explicit, non-negotiable conditions whose non-fulfillment
  automatically disqualifies a vendor -- missing exit capability (see below) for
  business-critical function, or missing, regulatorily ACTUALLY required certification
  -- these criteria prevent vendor w/ otherwise convincing properties from being chosen
  despite an ACTUALLY critical flaw that got lost in overall assessment
CHECKING CONTRACT BOUNDARIES means ACTUALLY understanding what contract concretely
  guarantees vs ACTUALLY doesn't guarantee -- availability SLA w/ ACTUAL, not just
  advertised values, or liability limits on data loss -- marketing claim on
  availability ACTUALLY not binding, while contractually guaranteed SLA ACTUALLY
  enforceable -- this distinction must ACTUALLY be made in evaluation
CHECKING EXIT CAPABILITY means ACTUALLY clarifying how an org can ACTUALLY leave the
  vendor again -- which data in which format ACTUALLY exportable, what migration effort
  ACTUALLY arises, whether dependency ACTUALLY becomes so deep a later switch becomes
  practically impossible (vendor lock-in) -- especially important for business-critical
  functions where an ACTUAL later vendor switch could ACTUALLY become necessary
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Vorab festgelegte Anforderungen | verhindert unbewusste Ausrichtung an präferiertem Anbieter | Grundlage objektiver Bewertung |
| Eigene Prüfszenarien statt Demonstration | testet unter tatsächlich eigenen, realistischen Bedingungen | Demonstration zeigt nur anbieteroptimierte Bedingungen |
| Explizite Ausschlusskriterien | disqualifiziert automatisch bei kritischem Mangel | verhindert Verschwinden eines kritischen Mangels in Gesamtbewertung |
| Vertragsgrenzen vs. Marketingbehauptung | unterscheidet einklagbare Zusagen von Werbeaussagen | verhindert Verlass auf nicht bindende Behauptungen |
| Exit-Fähigkeitsprüfung | klärt Datenexport, Migrationsaufwand, Lock-in-Risiko | besonders relevant bei geschäftskritischen Funktionen |

Implementierung: Vor der Anbieterprüfung werden Anforderungen, Prüfszenarien und Ausschlusskriterien explizit dokumentiert. Prüfszenarien werden unter eigenen, realistischen Bedingungen tatsächlich durchgeführt, nicht nur anhand einer Anbieter-Demonstration bewertet. Vertragsgrenzen und Exit-Fähigkeit werden vor einer finalen Entscheidung explizit geprüft.

## Scalability, Reliability, Security und Observability

Eine Vendor-Evaluation-Praxis skaliert über die Anzahl der parallel geprüften Anbieter; die Reliability-Grenze liegt darin, dass eine auf Demonstrationen statt systematischen Prüfszenarien basierende Entscheidung tatsächliche Produktmängel unentdeckt lässt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein ausgewählter Anbieter erfüllt unter tatsächlichen Produktionsbedingungen nicht die erwartete Leistung | die Entscheidung basierte auf einer Anbieter-Demonstration statt einem eigenen Prüfszenario | für künftige Entscheidungen eigene Prüfszenarien unter realistischen Bedingungen verpflichtend durchführen |
| ein Anbieterwechsel erweist sich später als praktisch unmöglich | die Exit-Fähigkeit wurde vor der Entscheidung nicht geprüft | für künftige Entscheidungen die Exit-Fähigkeit explizit als Ausschlusskriterium prüfen |
| eine zugesicherte Verfügbarkeit wird nicht eingehalten, ohne dass eine vertragliche Konsequenz möglich ist | die Verfügbarkeit war eine Marketingbehauptung, nicht Teil des Vertrags | künftige Verträge um verbindliche, einklagbare SLA-Klauseln ergänzen |

Security: Anbieter mit Zugriff auf sensible Daten sollten explizit gegen Sicherheitszertifizierungen und Ausschlusskriterien geprüft werden, nicht nur gegen funktionale Anforderungen. Observability: Die tatsächliche Erfüllungsrate vertraglich zugesicherter SLAs nach Vertragsabschluss ist ein zentrales Signal zur Bewertung der Vendor-Evaluation-Qualität.

## Trade-offs und Entscheidungen

**Staff** führt ein Prüfszenario für eine begrenzte, konkrete Anforderung durch. **Principal** entwirft die vollständige Vendor-Evaluation mit Anforderungen, Prüfszenarien, Ausschlusskriterien und Exit-Fähigkeitsprüfung für eine komplexe Entscheidung. **Chief** legt unternehmensweite Standards für Vendor Evaluation fest, die systematische Prüfung statt Demonstrationsvertrauen vorschreiben.

Anti-Patterns: eine Vendor-Entscheidung ausschließlich auf Basis einer Anbieter-Demonstration treffen; Marketingbehauptungen als vertraglich bindend behandeln; Exit-Fähigkeit vor Vertragsabschluss nicht prüfen.

## Production Checklist

- [ ] Anforderungen, Prüfszenarien und Ausschlusskriterien sind vor der Anbieterprüfung dokumentiert.
- [ ] Eigene Prüfszenarien unter realistischen Bedingungen wurden tatsächlich durchgeführt.
- [ ] Vertragsgrenzen sind explizit von Marketingbehauptungen unterschieden.
- [ ] Exit-Fähigkeit (Datenexport, Migrationsaufwand, Lock-in-Risiko) ist geprüft.

## Interviewfragen

### 1. Warum reicht eine Anbieter-Demonstration allein nicht für eine fundierte Vendor-Entscheidung aus?

**Antwort:** Weil eine Demonstration typischerweise unter für den Anbieter optimierten Bedingungen stattfindet, während ein eigenes Prüfszenario unter tatsächlich eigenen, realistischen Bedingungen zeigt, ob die Lösung tatsächlich funktioniert.

### 2. Warum sind explizite Ausschlusskriterien wichtig?

**Antwort:** Weil sie verhindern, dass ein Anbieter mit ansonsten überzeugenden Eigenschaften trotz eines tatsächlich kritischen Mangels ausgewählt wird, der in der Gesamtbewertung sonst untergehen könnte.

### 3. Was unterscheidet eine Vertragsklausel von einer Marketingbehauptung?

**Antwort:** Eine Vertragsklausel ist tatsächlich einklagbar, während eine Marketingbehauptung tatsächlich nicht bindend ist.

### 4. Warum ist die Prüfung der Exit-Fähigkeit besonders bei geschäftskritischen Funktionen wichtig?

**Antwort:** Weil ein späterer Anbieterwechsel bei geschäftskritischen Funktionen tatsächlich notwendig werden könnte, und ein tiefes Vendor-Lock-in einen solchen Wechsel praktisch unmöglich machen kann.

### 5. Wie gehst du vor, wenn ein ausgewählter Anbieter unter tatsächlichen Produktionsbedingungen nicht die erwartete Leistung erfüllt?

**Antwort:** Ich prüfe, ob die ursprüngliche Entscheidung auf einer Anbieter-Demonstration statt einem eigenen Prüfszenario basierte, und etabliere für künftige Entscheidungen verpflichtende, eigene Prüfszenarien unter realistischen Bedingungen.

### 6. Widersprüchliche Anforderung: Der Einkauf will eine schnelle Anbieterentscheidung ohne ausgedehnte Prüfphase UND die Organisation will vollständige Sicherheit durch systematische Prüfszenarien und Exit-Fähigkeitsprüfung — wie gehst du vor?

**Antwort:** Ich würde die Prüfung auf die tatsächlich kritischen Anforderungen und Ausschlusskriterien fokussieren, statt jede denkbare Anforderung zu testen, sodass die Prüfphase begrenzt bleibt, ohne die tatsächlich entscheidungskritischen Risiken (Ausschlusskriterien, Exit-Fähigkeit) ungeprüft zu lassen.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Unternehmen prüft zwei Anbieter für eine geschäftskritische Datenplattform. Anbieter A liefert eine eindrucksvolle Demonstration, kann aber keinen vollständigen Datenexport in einem offenen Format zusichern. Anbieter B liefert eine weniger beeindruckende Demonstration, erfüllt aber alle Ausschlusskriterien.

~~~python
# Local, deterministic illustration of exclusion criteria overriding demo impression (fictional lab example, no real vendor evaluation):

vendors = [
    {"name": "Vendor A", "demo_impression": "excellent", "exit_capability": False},
    {"name": "Vendor B", "demo_impression": "adequate", "exit_capability": True},
]

def filter_eligible(vendors):
    return [v for v in vendors if v["exit_capability"]]

print(filter_eligible(vendors))
~~~

Erwartete Beobachtung: Trotz der weniger eindrucksvollen Demonstration wird nur Anbieter B als geeignet eingestuft, da er das Ausschlusskriterium der Exit-Fähigkeit tatsächlich erfüllt. Auswertung: Eine Entscheidung allein anhand der Demonstration hätte Anbieter A ausgewählt und die Organisation einem tatsächlichen, später kritischen Vendor-Lock-in-Risiko ausgesetzt.

## Dependencies, Cross-References und Quellen

1. Gartner: [Magic Quadrant Methodology — Vendor Evaluation Criteria](https://www.gartner.com/en/research/methodologies/magic-quadrants-research), abgerufen 2026-09-18.
2. National Institute of Standards and Technology (NIST): [NIST SP 800-53 — Supply Chain Risk Management Controls](https://csrc.nist.gov/pubs/sp/800/53/r5/final), abgerufen 2026-09-18.

Dieses Kapitel konkretisiert die in KB-0689 (Build-versus-Buy als Führungsentscheidung) beschriebene Buy-Option auf die tatsächliche Anbieterauswahl.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte, herstellerübergreifende Exit-Fähigkeits-Zertifizierungen (Datenportabilitätsstandards) zur objektiveren Bewertung von Lock-in-Risiken | Emerging | Bei künftigen Vendor-Evaluationen evaluieren, jedoch bis zur breiteren Marktdurchdringung weiterhin eigene, projektspezifische Exit-Fähigkeitsprüfungen durchführen. |

Ein Team akzeptiert eine Vendor Evaluation erst, wenn Anforderungen, Prüfszenarien und Ausschlusskriterien systematisch geprüft und Vertragsgrenzen sowie Exit-Fähigkeit explizit bewertet sind.
