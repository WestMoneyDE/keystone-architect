---
{"id": "KB-0677", "title": "Architektur-Discovery in der Praxis", "domain": "30", "sequence": 1, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für ein gegebenes, unklares Vorhaben eine strukturierte Discovery mit Interviews, Systemspuren und Hypothesen durchführen und dabei Fakten, Annahmen und offene Fragen sichtbar trennen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine unklare Ausgangslage mehrere plausible Erklärungshypothesen entwerfen und anhand tatsächlich verfügbarer Evidenz gegeneinander bewerten, bevor eine Lösung festgelegt wird.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Lösung vor Abschluss einer ausreichenden Discovery festgelegt wird, und die daraus entstehenden teamübergreifenden Risiken benennen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Discovery-Praxis festlegen, die verpflichtende Trennung von Fakten, Annahmen und offenen Fragen vor jeder größeren Architekturentscheidung vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte Methodik spezifischer Interviewtechniken (etwa kontextuelle Befragung) im Detail ist Vertiefung.", "rationale": "Kern ist die strukturierte Trennung von Fakten, Annahmen und offenen Fragen, nicht die Detailmethodik einzelner Interviewtechniken."}}, "lab_validation": [{"lab_id": "KB-0677-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung der Trennung von Fakten, Annahmen und offenen Fragen, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie dieselbe unklare Ausgangslage bei unstrukturierter Erfassung zu einer vorschnellen, falschen Lösungsannahme führt, während eine explizite Trennung von Fakten, Annahmen und offenen Fragen die tatsächliche Wissenslücke sichtbar macht.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation oder reale Organisation."}]}
---
# Architektur-Discovery in der Praxis

> **Ziel:** Architektur-Discovery ist der strukturierte Prozess, mit dem eine unklare Ausgangslage (etwa ein neues Vorhaben ohne dokumentierte Architektur, oder eine bestehende Landschaft ohne aktuelle Übersicht) in tatsächlich belastbares Wissen überführt wird, über drei Quellen: **Interviews** (strukturierte Gespräche mit Beteiligten, die tatsächliches Kontextwissen tragen), **Systemspuren** (tatsächlich beobachtbare Artefakte wie Code, Konfiguration, Logs, Netzwerkverkehr, die unabhängig von subjektiven Aussagen ein objektives Bild liefern) und **Hypothesen** (explizit formulierte, vorläufige Erklärungsversuche, die gegen weitere Evidenz geprüft werden, statt als bereits bestätigte Fakten behandelt zu werden). Der zentrale Punkt dieses Kapitels ist die explizite, sichtbare Trennung von **Fakten** (durch mehrere unabhängige Quellen bestätigt), **Annahmen** (plausibel, aber tatsächlich nicht verifiziert) und **offenen Fragen** (tatsächlich noch unbeantwortet) — eine Lösung, die vor dieser Trennung und vor ausreichender Klärung offener Fragen festgelegt wird, riskiert tatsächlich, auf einer unentdeckten, falschen Annahme aufzubauen.

## Zweck, Mental Model und Dependencies

Interviews liefern subjektives, aber tatsächlich wertvolles Kontextwissen — ein erfahrener Mitarbeiter kennt tatsächlich historische Entscheidungsgründe, die aus reinem Code oder Dokumentation nicht mehr ableitbar sind; gleichzeitig ist eine einzelne Interviewaussage tatsächlich nicht automatisch ein Fakt, da subjektive Erinnerung und individuelle Perspektive tatsächlich von der objektiven Systemrealität abweichen können — mehrere, unabhängig befragte Personen, deren Aussagen sich tatsächlich decken, liefern eine deutlich verlässlichere Evidenzbasis als eine einzelne Aussage. Systemspuren (Code, Konfigurationsdateien, tatsächlich beobachtete Logs oder Netzwerkverkehr) liefern objektive, nicht durch subjektive Erinnerung verzerrte Evidenz — sie zeigen tatsächlich, was ein System tut, nicht was jemand glaubt, dass es tut; allerdings können Systemspuren tatsächlich veraltet oder unvollständig sein (etwa eine Konfigurationsdatei, die zwar vorhanden, aber tatsächlich nicht mehr aktiv genutzt wird), sodass auch sie nicht unkritisch als vollständiges Bild behandelt werden dürfen. Hypothesen sind explizit als vorläufig gekennzeichnete Erklärungsversuche, die eine unklare Beobachtung plausibel erklären könnten — der zentrale methodische Fehler wäre, eine Hypothese fälschlich bereits als bestätigten Fakt zu behandeln, bevor sie tatsächlich gegen weitere, unabhängige Evidenz geprüft wurde. Die explizite Trennung von Fakten, Annahmen und offenen Fragen (etwa in einer sichtbaren, gemeinsam geführten Liste) macht den tatsächlichen Wissensstand für alle Beteiligten nachvollziehbar — ein Team, das diese Trennung nicht vornimmt, behandelt Annahmen implizit als Fakten, was tatsächlich dazu führt, dass eine spätere Lösung auf einer unentdeckten, falschen Grundlage aufgebaut wird, deren Korrektur dann tatsächlich erheblich teurer ist als eine frühzeitige Klärung.

~~~text
Architecture Discovery = structured process turning an unclear starting situation (new
  project w/o documented architecture, existing landscape w/o current overview) into
  ACTUALLY reliable knowledge, via 3 sources
  INTERVIEWS: structured conversations w/ stakeholders carrying ACTUAL context knowledge
  SYSTEM TRACES: ACTUALLY observable artifacts (code, config, logs, network traffic)
  giving objective picture independent of subjective statements
  HYPOTHESES: explicitly formulated, tentative explanation attempts checked against
  further evidence, not treated as already-confirmed facts
KEY POINT: explicit, visible separation of FACTS (confirmed by multiple independent
  sources), ASSUMPTIONS (plausible but ACTUALLY unverified), OPEN QUESTIONS (ACTUALLY
  still unanswered)
  a solution fixed before this separation + before sufficient clarification of open
  questions ACTUALLY risks building on an undiscovered, wrong assumption
INTERVIEWS deliver subjective but ACTUALLY valuable context knowledge -- experienced
  staff member ACTUALLY knows historical decision reasons no longer derivable from pure
  code/docs
  single interview statement ACTUALLY not automatically a fact, since subjective memory+
  individual perspective CAN ACTUALLY diverge from objective system reality
  multiple, independently interviewed people whose statements ACTUALLY agree deliver
  substantially more reliable evidence base than single statement
SYSTEM TRACES (code, config files, ACTUALLY observed logs/network traffic) deliver
  objective evidence not distorted by subjective memory -- ACTUALLY show what a system
  does, not what someone believes it does
  can ACTUALLY be outdated or incomplete (config file present but ACTUALLY no longer
  actively used) -> also must not be uncritically treated as complete picture
HYPOTHESES explicitly marked as tentative explanation attempts that could plausibly
  explain an unclear observation -- central methodological error would be falsely
  treating a hypothesis as already-confirmed fact before it's ACTUALLY checked against
  further, independent evidence
EXPLICIT SEPARATION of facts/assumptions/open questions (visible, jointly maintained
  list) makes ACTUAL knowledge state traceable for all involved
  team not doing this separation implicitly treats assumptions as facts -> ACTUALLY
  leads to a later solution building on an undiscovered, wrong foundation, whose
  correction is then ACTUALLY substantially more expensive than early clarification
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Interviews mit mehreren, unabhängigen Quellen | liefert Kontextwissen, das aus Systemspuren nicht ableitbar ist | einzelne Aussage ist noch kein Fakt |
| Systemspuren (Code, Config, Logs) | liefert objektive, nicht subjektiv verzerrte Evidenz | kann veraltet oder unvollständig sein |
| Explizit gekennzeichnete Hypothesen | vorläufige Erklärungsversuche vor Bestätigung | Fehler: Hypothese fälschlich als Fakt behandeln |
| Sichtbare Fakten-/Annahmen-/Fragen-Trennung | macht tatsächlichen Wissensstand nachvollziehbar | verhindert Lösung auf unentdeckter, falscher Annahme |

Implementierung: Für jede Discovery-Phase wird eine gemeinsam geführte, sichtbare Liste mit drei Kategorien (Fakten, Annahmen, offene Fragen) geführt. Jeder Eintrag wird explizit der Quelle zugeordnet (Interview, Systemspur, Hypothese). Eine Lösung wird erst festgelegt, wenn alle für die Entscheidung relevanten offenen Fragen tatsächlich geklärt sind.

## Scalability, Reliability, Security und Observability

Eine Discovery-Praxis skaliert über die Anzahl unabhängiger Quellen, die für eine Fakten-Bestätigung herangezogen werden; die Reliability-Grenze liegt darin, dass eine implizit als Fakt behandelte Annahme tatsächlich zu einer auf falscher Grundlage aufgebauten Lösung führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine festgelegte Lösung erweist sich später als auf falscher Grundlage aufgebaut | eine Annahme wurde implizit als bestätigter Fakt behandelt, ohne tatsächliche Verifikation | die Discovery-Liste rückwirkend prüfen und die fälschlich als Fakt behandelte Annahme identifizieren |
| unterschiedliche Interviewpartner widersprechen sich zu demselben Sachverhalt | keine unabhängige Verifikation über mehrere Quellen wurde vorgenommen | zusätzliche, unabhängige Quellen (weitere Interviews, Systemspuren) zur Klärung heranziehen |
| eine Systemspur zeigt ein scheinbar aktives Element, das tatsächlich nicht mehr genutzt wird | die Systemspur wurde unkritisch als vollständiges, aktuelles Bild behandelt | die tatsächliche Nutzung des Elements zusätzlich über Laufzeitbeobachtung verifizieren |

Security: Bei Discovery-Interviews sollten sensible, vertrauliche Informationen (etwa Sicherheitslücken) mit angemessener Vertraulichkeit behandelt werden. Observability: Die tatsächliche Anzahl noch offener, entscheidungsrelevanter Fragen zum geplanten Entscheidungszeitpunkt ist ein zentrales Signal zur Bewertung, ob die Discovery-Phase tatsächlich ausreichend abgeschlossen ist.

## Trade-offs und Entscheidungen

**Staff** führt für einen gegebenen Teilbereich eine strukturierte Discovery mit klarer Fakten-/Annahmen-Trennung durch. **Principal** entwirft die vollständige Discovery-Strategie für ein größeres, unklares Vorhaben, einschließlich Priorisierung, welche offenen Fragen vor einer Lösungsfestlegung tatsächlich geklärt sein müssen. **Chief** legt unternehmensweite Standards fest, die eine Mindest-Discovery-Praxis vor größeren Architekturentscheidungen vorschreiben.

Anti-Patterns: eine Lösung festlegen, bevor entscheidungsrelevante offene Fragen tatsächlich geklärt sind; eine einzelne Interviewaussage ungeprüft als Fakt behandeln; Systemspuren unkritisch als vollständiges, aktuelles Bild interpretieren.

## Production Checklist

- [ ] Eine sichtbare, gemeinsam geführte Liste trennt Fakten, Annahmen und offene Fragen.
- [ ] Jeder Fakteneintrag ist durch mindestens zwei unabhängige Quellen bestätigt.
- [ ] Hypothesen sind explizit als vorläufig gekennzeichnet, bis sie verifiziert sind.
- [ ] Eine Lösung wird erst festgelegt, wenn entscheidungsrelevante offene Fragen tatsächlich geklärt sind.

## Interviewfragen

### 1. Warum ist eine einzelne Interviewaussage noch kein Fakt?

**Antwort:** Weil subjektive Erinnerung und individuelle Perspektive von der objektiven Systemrealität abweichen können; erst mehrere, unabhängig übereinstimmende Quellen liefern eine verlässliche Evidenzbasis.

### 2. Warum können auch Systemspuren nicht unkritisch als vollständiges Bild behandelt werden?

**Antwort:** Weil sie tatsächlich veraltet oder unvollständig sein können, etwa eine vorhandene, aber nicht mehr aktiv genutzte Konfiguration.

### 3. Was unterscheidet eine Hypothese von einem Fakt in der Discovery-Praxis?

**Antwort:** Eine Hypothese ist ein explizit als vorläufig gekennzeichneter Erklärungsversuch, der erst gegen weitere, unabhängige Evidenz geprüft werden muss, während ein Fakt bereits durch mehrere unabhängige Quellen bestätigt ist.

### 4. Warum sollte eine Lösung nicht vor Abschluss entscheidungsrelevanter Klärung festgelegt werden?

**Antwort:** Weil die Lösung sonst tatsächlich auf einer unentdeckten, falschen Annahme aufbauen könnte, deren spätere Korrektur erheblich teurer ist als eine frühzeitige Klärung.

### 5. Wie gehst du vor, wenn sich eine festgelegte Lösung später als auf falscher Grundlage aufgebaut erweist?

**Antwort:** Ich prüfe die ursprüngliche Discovery-Liste rückwirkend, identifiziere die fälschlich als Fakt behandelte Annahme, und etabliere für künftige Vorhaben eine strengere Verifikationsanforderung vor Lösungsfestlegung.

### 6. Widersprüchliche Anforderung: Das Management will eine schnelle Lösungsfestlegung ohne ausgedehnte Discovery-Phase UND die Organisation will Sicherheit, dass die Lösung nicht auf falschen Annahmen aufbaut — wie gehst du vor?

**Antwort:** Ich würde die Discovery-Phase gezielt auf die tatsächlich entscheidungskritischen offenen Fragen fokussieren, statt eine vollständige, umfassende Discovery aller Aspekte durchzuführen, sodass eine schnelle Festlegung möglich bleibt, ohne die tatsächlich kritischen Wissenslücken ungeklärt zu lassen.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Team übernimmt ein bestehendes, undokumentiertes Bestellsystem (angelehnt an das in Domain 29 behandelte Commerce-Umfeld). Drei Interviewpartner geben unterschiedliche Auskünfte darüber, ob ein bestimmter Legacy-Zahlungsdienst noch aktiv genutzt wird. Eine Systemspur (Netzwerkverkehr-Log) zeigt tatsächlich seit drei Monaten keine Anfragen an diesen Dienst mehr.

~~~python
# Local, deterministic illustration of fact/assumption/open-question separation (fictional lab example, no real system):

discovery_log = [
    {"item": "Legacy-Zahlungsdienst wird laut Interview A noch genutzt", "type": "assumption", "sources": 1},
    {"item": "Legacy-Zahlungsdienst zeigt seit 3 Monaten keine Netzwerkanfragen", "type": "fact", "sources": 1},
    {"item": "Ob ein Batch-Prozess den Dienst monatlich nutzt, ist unklar", "type": "open_question", "sources": 0},
]

def promote_to_fact(item, independent_sources):
    return independent_sources >= 2

for entry in discovery_log:
    print(entry["item"], "-> confirmed fact" if promote_to_fact(entry, entry["sources"] + 1) else "needs more verification")
~~~

Erwartete Beobachtung: Die widersprüchliche Interviewaussage allein reicht nicht aus, um den Legacy-Dienst als aktiv oder inaktiv zu bestätigen. Die Systemspur liefert einen starken Hinweis, aber die offene Frage zum monatlichen Batch-Prozess muss vor einer Abschaltentscheidung tatsächlich geklärt werden. Auswertung: Ohne die explizite Trennung hätte das Team den Dienst möglicherweise vorschnell als inaktiv behandelt und abgeschaltet, was den monatlichen Batch-Prozess tatsächlich gebrochen hätte.

## Dependencies, Cross-References und Quellen

1. Gregor Hohpe: [The Architect Elevator — Discovery and Stakeholder Engagement](https://architectelevator.com/), abgerufen 2026-09-18.
2. IEEE: [ISO/IEC/IEEE 42010 — Systems and Software Engineering, Architecture Description](https://www.iso.org/standard/74393.html), abgerufen 2026-09-18.

Dieses Kapitel eröffnet Domain 30 (Architect Practice) und hat keine kapitelinternen Vorgängerabhängigkeiten innerhalb dieses Domains.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte Codebasis- und Konfigurationsanalyse zur automatisierten Extraktion von Systemspuren als Discovery-Beschleuniger | Growing Adoption | Bei künftigen Discovery-Vorhaben mit großer, unbekannter Codebasis evaluieren, jedoch die automatisiert extrahierten Systemspuren weiterhin explizit als Ausgangspunkt für Verifikation statt als bereits bestätigte Fakten behandeln. |

Ein Team akzeptiert eine Architektur-Discovery erst abgeschlossen, wenn Fakten, Annahmen und offene Fragen nachweislich sichtbar getrennt sind und entscheidungsrelevante offene Fragen tatsächlich geklärt wurden.
