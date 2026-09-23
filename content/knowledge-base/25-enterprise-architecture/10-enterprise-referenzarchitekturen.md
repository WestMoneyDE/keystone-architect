---
{"id": "KB-0598", "title": "Enterprise-Referenzarchitekturen", "domain": "25", "sequence": 10, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0593", "concepts": ["Technology Architecture"], "needed_for": "understanding"}, {"id": "KB-0597", "concepts": ["ArchiMate und Modellbeziehungen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Enterprise-Referenzarchitektur mit explizitem Geltungsbereich, dokumentierten Variationspunkten und klarer Konformitätsdefinition anhand etablierter Praxis korrekt erstellen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie eine Referenzarchitektur als wiederverwendbares Muster mit definiertem Geltungsbereich und Variationspunkten von einer unverbindlichen Beispielarchitektur abgegrenzt wird.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Abweichung von einer Referenzarchitektur fälschlich als Nichtkonformität statt als legitimer, dokumentierter Variationspunkt behandelt wird, oder umgekehrt eine tatsächliche Nichtkonformität fälschlich als Variation toleriert wird.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Referenzarchitektur-Governance festlegen, die Konformität, Variationspunkte und die kontinuierliche Weiterentwicklung der Referenzarchitektur verbindlich regeln.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte technische Implementierung einzelner Referenzarchitektur-Bausteine ist bereits in den jeweiligen technischen Domains dieses Curriculums behandelt.", "rationale": "Kern ist die Definition von Geltungsbereich, Variationspunkten und Konformität einer Referenzarchitektur, nicht die technische Implementierung einzelner Bausteine."}}, "lab_validation": [{"lab_id": "KB-0598-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Unterscheidung von legitimer Variation und tatsächlicher Nichtkonformität, kein produktives EA-Tool verwendet", "evidence": "Ein lokales Skript prüft eine Liste von Systemabweichungen von einer Referenzarchitektur gegen deren dokumentierte Variationspunkte und klassifiziert jede Abweichung entweder als legitime, abgedeckte Variation oder als tatsächliche Nichtkonformität.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales EA-Tool."}]}
---
# Enterprise-Referenzarchitekturen

> **Ziel:** Eine Enterprise-Referenzarchitektur ist ein wiederverwendbares Muster (etwa für eine bestimmte Technologieklasse, siehe die bereits in [KB-0593](05-technology-architecture.md) behandelte Technology Architecture), das für mehrere, ähnlich gelagerte Architekturentscheidungen als Vorlage dient. Der zentrale Punkt dieses Kapitels ist die explizite Unterscheidung zwischen einer Referenzarchitektur mit klar definiertem **Geltungsbereich**, dokumentierten **Variationspunkten** (den Stellen, an denen eine konkrete Umsetzung bewusst und legitim von der Vorlage abweichen darf) und einer **Konformitätsdefinition** (was tatsächlich als Einhaltung der Referenzarchitektur gilt) gegenüber einer bloß unverbindlichen **Beispielarchitektur**, die keinen verbindlichen Anspruch erhebt. Diese Unterscheidung ist entscheidend, da eine Referenzarchitektur ohne diese drei expliziten Elemente entweder zu starr angewendet wird (legitime, notwendige Abweichungen werden fälschlich als Regelverstoß behandelt) oder ihre eigentliche Steuerungswirkung verliert (tatsächliche Nichtkonformität wird unentdeckt als vermeintlich legitime Variation toleriert).

## Zweck, Mental Model und Dependencies

Der Geltungsbereich einer Referenzarchitektur legt explizit fest, für welche Art von Architekturentscheidungen sie tatsächlich als Vorlage dienen soll (etwa "alle neuen, internen Microservices" statt pauschal "alle Systeme") — ohne einen klar definierten Geltungsbereich wird eine Referenzarchitektur entweder auf Fälle angewendet, für die sie nicht konzipiert wurde (was zu unpassenden, erzwungenen Lösungen führt), oder ihre Anwendung bleibt unklar und wird inkonsistent gehandhabt. Variationspunkte sind die bewusst vorgesehenen Stellen, an denen eine konkrete Umsetzung von der Referenzarchitektur abweichen darf, ohne als nichtkonform zu gelten (etwa "die konkrete Datenbanktechnologie kann innerhalb der offiziell unterstützten Zielplattformen variieren, solange die Schnittstellenverträge eingehalten werden") — diese explizite Dokumentation legitimer Variation ist der entscheidende Unterschied zu einer starren Vorlage, die keine Anpassung an unterschiedliche, konkrete Kontexte zulässt. Die Konformitätsdefinition schließlich legt fest, was tatsächlich als Einhaltung der Referenzarchitektur gilt: nicht jede Abweichung außerhalb der dokumentierten Variationspunkte ist automatisch eine Nichtkonformität (manche Aspekte der Referenzarchitektur mögen unwesentlich sein), aber jede Abweichung, die einen als konform definierten Aspekt betrifft, muss explizit als Nichtkonformität erkannt und behandelt werden. Die Abgrenzung zu einer unverbindlichen Beispielarchitektur ist methodisch wichtig: Eine Beispielarchitektur zeigt lediglich, wie eine mögliche Lösung aussehen könnte, ohne einen verbindlichen Anspruch zu erheben oder Konformität einzufordern — wird eine solche unverbindliche Beispielarchitektur fälschlich wie eine verbindliche Referenzarchitektur behandelt (etwa in einem Governance-Prozess durchgesetzt), entsteht unnötiger Konflikt, da die ursprüngliche Absicht der Beispielarchitektur gerade keine verbindliche Vorgabe war.

~~~text
Enterprise Reference Architecture: reusable pattern (e.g. for a tech class, KB-0593) serving as template
  for multiple, similarly-scoped architecture decisions
KEY POINT: explicit distinction between reference architecture WITH clearly defined
  SCOPE, documented VARIATION POINTS (places where concrete implementation may LEGITIMATELY deviate),
  and CONFORMANCE DEFINITION (what actually counts as adherence)
  vs a merely non-binding EXAMPLE architecture claiming no binding force
this distinction decisive: ref architecture WITHOUT these three explicit elements
  EITHER applied too rigidly (legitimate, necessary deviations wrongly treated as rule violations)
  OR loses its actual steering effect (actual non-conformance goes undetected, tolerated as supposedly legitimate variation)
SCOPE explicitly defines which kind of decisions the ref architecture actually serves as template for
  (e.g. "all new internal microservices" not blanket "all systems")
  w/o clear scope -> either applied to cases it wasn't designed for (unfitting, forced solutions)
    or application stays unclear -> handled inconsistently
VARIATION POINTS = deliberately provided places where concrete implementation may deviate w/o being non-conformant
  (e.g. "concrete DB tech can vary within officially supported target platforms,
   as long as interface contracts are honored")
  explicit documentation of legitimate variation = decisive difference from a rigid template
    permitting no adaptation to different concrete contexts
CONFORMANCE DEFINITION: what actually counts as adherence
  not every deviation outside documented variation points automatically = non-conformance
    (some ref architecture aspects may be inessential)
  but every deviation touching an aspect DEFINED as conformant MUST be explicitly recognized+treated as non-conformance
BOUNDARY vs non-binding EXAMPLE architecture methodically important:
  example architecture merely shows what a possible solution could look like, claims NO binding force,
    requires no conformance
  such non-binding example wrongly treated like a binding ref architecture (e.g. enforced in governance process)
    -> unnecessary conflict, since original intent of example architecture was precisely NOT a binding requirement
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Geltungsbereich | legt fest, für welche Fälle die Referenzarchitektur gilt | verhindert unpassende oder inkonsistente Anwendung |
| Variationspunkt | dokumentiert legitime, zulässige Abweichung | unterscheidet zulässige Variation von Regelverstoß |
| Konformitätsdefinition | legt fest, was tatsächlich als Einhaltung gilt | Grundlage für belastbare Governance-Entscheidungen |
| Beispielarchitektur | unverbindliches Beispiel ohne Konformitätsanspruch | darf nicht wie eine verbindliche Referenzarchitektur durchgesetzt werden |

Implementierung: Jede Referenzarchitektur wird mit explizitem Geltungsbereich, dokumentierten Variationspunkten und einer klaren Konformitätsdefinition veröffentlicht. Abweichungen werden systematisch gegen die dokumentierten Variationspunkte geprüft, bevor sie als Nichtkonformität behandelt werden. Unverbindliche Beispielarchitekturen werden explizit als solche gekennzeichnet und nicht in Governance-Prozessen wie verbindliche Referenzarchitekturen durchgesetzt.

## Scalability, Reliability, Security und Observability

Enterprise-Referenzarchitekturen skalieren die Konsistenz und Wiederverwendbarkeit von Architekturentscheidungen proportional zur Klarheit von Geltungsbereich, Variationspunkten und Konformitätsdefinition; die Reliability-Grenze liegt darin, dass eine Referenzarchitektur ohne diese expliziten Elemente entweder zu starr angewendet wird oder ihre Steuerungswirkung durch unentdeckte, tatsächliche Nichtkonformität verliert.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine notwendige, kontextbedingte Abweichung wird fälschlich als Regelverstoß behandelt | die Referenzarchitektur dokumentiert diesen Fall nicht als legitimen Variationspunkt | prüfen, ob diese Abweichungsart als neuer, legitimer Variationspunkt aufgenommen werden sollte |
| eine tatsächliche Nichtkonformität bleibt unentdeckt und wird als akzeptable Variation toleriert | die Konformitätsdefinition ist nicht präzise genug, um diese Abweichung als Nichtkonformität zu erkennen | die Konformitätsdefinition für den betroffenen Aspekt präzisieren |
| eine unverbindliche Beispielarchitektur wird in einem Governance-Prozess wie eine verbindliche Vorgabe durchgesetzt | die Beispielarchitektur wurde nicht explizit als unverbindlich gekennzeichnet | die Beispielarchitektur eindeutig als unverbindlich kennzeichnen und aus verbindlichen Governance-Prozessen herausnehmen |

Security: Sicherheitsrelevante Aspekte einer Referenzarchitektur (etwa verbindliche Zugriffskontrollmuster) sollten explizit als konform-relevant statt als Variationspunkt definiert werden. Observability: Die tatsächliche Konformitätsquote von Systemen gegenüber ihrer jeweiligen Referenzarchitektur ist ein zentrales Signal zur Bewertung der tatsächlichen Steuerungswirkung.

## Trade-offs und Entscheidungen

**Staff** wendet eine gegebene Referenzarchitektur korrekt an und nutzt dokumentierte Variationspunkte angemessen. **Principal** entwirft eine vollständige Referenzarchitektur mit Geltungsbereich, Variationspunkten und Konformitätsdefinition für eine Technologieklasse. **Chief** legt unternehmensweite Standards für Referenzarchitektur-Governance fest, die Konformität und Weiterentwicklung verbindlich regeln.

Anti-Patterns: eine Referenzarchitektur ohne explizite Variationspunkte starr durchsetzen und legitime, kontextbedingte Abweichungen fälschlich als Regelverstoß behandeln; eine unpräzise Konformitätsdefinition verwenden, die tatsächliche Nichtkonformität unentdeckt lässt; eine unverbindliche Beispielarchitektur wie eine verbindliche Referenzarchitektur in Governance-Prozessen durchsetzen.

## Production Checklist

- [ ] Jede Referenzarchitektur hat einen explizit definierten Geltungsbereich.
- [ ] Legitime Variationspunkte sind dokumentiert und von tatsächlicher Nichtkonformität unterschieden.
- [ ] Eine klare Konformitätsdefinition legt fest, was tatsächlich als Einhaltung gilt.
- [ ] Unverbindliche Beispielarchitekturen sind explizit als solche gekennzeichnet.

## Interviewfragen

### 1. Was unterscheidet eine Referenzarchitektur von einer unverbindlichen Beispielarchitektur?

**Antwort:** Eine Referenzarchitektur erhebt einen verbindlichen Anspruch mit definiertem Geltungsbereich, Variationspunkten und Konformitätsdefinition, während eine Beispielarchitektur lediglich eine mögliche Lösung zeigt, ohne Konformität einzufordern.

### 2. Wofür dienen Variationspunkte in einer Referenzarchitektur?

**Antwort:** Sie dokumentieren Stellen, an denen eine konkrete Umsetzung bewusst und legitim von der Referenzarchitektur abweichen darf, ohne als nichtkonform zu gelten.

### 3. Was passiert, wenn eine Referenzarchitektur ohne dokumentierte Variationspunkte angewendet wird?

**Antwort:** Legitime, notwendige Abweichungen werden fälschlich als Regelverstoß behandelt, was zu unpassenden, erzwungenen Lösungen oder unnötigem Konflikt führt.

### 4. Warum ist eine präzise Konformitätsdefinition wichtig?

**Antwort:** Weil ohne sie tatsächliche Nichtkonformität unentdeckt als vermeintlich legitime Variation toleriert werden kann, was die Steuerungswirkung der Referenzarchitektur untergräbt.

### 5. Wie gehst du vor, wenn eine notwendige, kontextbedingte Abweichung fälschlich als Regelverstoß behandelt wird?

**Antwort:** Ich prüfe, ob diese Abweichungsart als neuer, legitimer Variationspunkt in die Referenzarchitektur aufgenommen werden sollte, statt sie weiterhin als Regelverstoß zu behandeln.

### 6. Widersprüchliche Anforderung: Teams wollen maximale Flexibilität bei der konkreten Umsetzung UND die Organisation will konsistente, durchsetzbare Referenzarchitekturen — wie gehst du vor?

**Antwort:** Ich würde den Geltungsbereich und die tatsächlich kritischen, konformitätsrelevanten Aspekte der Referenzarchitektur eng fassen, dabei aber möglichst viele legitime Variationspunkte explizit dokumentieren, um Teams innerhalb dieser definierten Grenzen maximale Flexibilität zu ermöglichen, statt entweder Flexibilität vollständig zu unterbinden oder Konsistenz vollständig zu opfern.

## Praktische Labs

~~~python
# Local, deterministic simulation of classifying deviations as legitimate variation vs non-conformance (executed locally, no real EA tool):

def classify_deviation(deviation, documented_variation_points, conformance_relevant_aspects):
    if deviation in documented_variation_points:
        return "legitimate_variation"
    elif deviation in conformance_relevant_aspects:
        return "non_conformance"
    return "not_relevant"

documented_variation_points = ["database_technology_within_target_platforms"]
conformance_relevant_aspects = ["interface_contract", "access_control_pattern"]

deviations = ["database_technology_within_target_platforms", "access_control_pattern", "logging_format"]
for d in deviations:
    print(d, "->", classify_deviation(d, documented_variation_points, conformance_relevant_aspects))
~~~

## Dependencies, Cross-References und Quellen

1. The Open Group: [TOGAF Standard, 10th Edition — Reference Models](https://pubs.opengroup.org/togaf-standard/introduction/), abgerufen 2026-09-18.
2. NIST: [NIST Special Publication 500-292 — Cloud Computing Reference Architecture](https://www.nist.gov/publications/nist-cloud-computing-reference-architecture), abgerufen 2026-09-18.

Technology Architecture ist kanonisch in [KB-0593](05-technology-architecture.md) behandelt; ArchiMate-Modellbeziehungen in [KB-0597](09-archimate-und-modellbeziehungen.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Konformitätsprüfung von Systemen gegen Referenzarchitekturen über Infrastructure-as-Code-Scans | Evaluating | Als ergänzendes, kontinuierliches Prüfwerkzeug für formal definierte, konformitätsrelevante Aspekte einsetzen, jedoch die Bewertung neuer, potenziell legitimer Variationspunkte weiterhin als menschliche, architektonische Entscheidung behandeln. |

Ein Team akzeptiert eine Enterprise-Referenzarchitektur erst, wenn Geltungsbereich, Variationspunkte und Konformitätsdefinition explizit dokumentiert sind und klar von unverbindlichen Beispielarchitekturen unterschieden werden.
