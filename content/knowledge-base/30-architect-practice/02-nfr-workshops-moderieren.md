---
{"id": "KB-0678", "title": "NFR-Workshops moderieren", "domain": "30", "sequence": 2, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0677", "concepts": ["Fakten-/Annahmen-Trennung"], "needed_for": "NFR-Workshops nutzen dieselbe Trennung von Fakten und Annahmen bei der Erfassung von Stakeholderwünschen"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für ein gegebenes Vorhaben Stakeholderwünsche in konkrete, messbare Qualitätsszenarien überführen und dabei Zielkonflikte explizit sichtbar machen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für widersprüchliche Stakeholderprioritäten mehrere Kompromissoptionen entwerfen und deren jeweilige technische und organisatorische Konsequenzen transparent machen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein vage formulierter Stakeholderwunsch (etwa 'das System muss schnell sein') ohne Überführung in ein messbares Szenario in die Architekturplanung einfließt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für NFR-Erhebung festlegen, die verpflichtende Überführung vager Wünsche in messbare Szenarien vor Architekturfestlegung vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, formale NFR-Notation (etwa Quality Attribute Scenarios nach SEI) im Detail ist Vertiefung.", "rationale": "Kern ist die Moderationspraxis zur Überführung vager Wünsche in messbare Szenarien, nicht die formale Notationstiefe."}}, "lab_validation": [{"lab_id": "KB-0678-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung der Überführung vager Wünsche in messbare Szenarien, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie der vage Wunsch 'das System muss schnell sein' in ein konkretes, messbares Qualitätsszenario mit Lastprofil, Zielmetrik und Schwellenwert überführt wird.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# NFR-Workshops moderieren

> **Ziel:** Ein NFR-Workshop (Non-Functional Requirements) überführt vage, subjektiv formulierte Stakeholderwünsche (etwa "das System muss schnell sein" oder "die Lösung muss sicher sein") in tatsächlich messbare Qualitätsszenarien — konkrete, überprüfbare Aussagen mit Lastprofil, Zielmetrik und Schwellenwert. Dieses Kapitel referenziert die technische NFR-Methodik (etwa formale Quality-Attribute-Scenario-Notation) als bereits etabliertes Grundwissen und konzentriert sich stattdessen auf die Moderationspraxis: Wie werden Stakeholderwünsche tatsächlich erhoben, wie werden Zielkonflikte zwischen unterschiedlichen Stakeholdern sichtbar gemacht, und wie wird gemeinsam eine tatsächlich tragfähige Priorisierung erreicht. Der zentrale Punkt dieses Kapitels ist, dass ein vager Wunsch, der nicht in ein messbares Szenario überführt wird, tatsächlich nicht überprüfbar ist — ein System, das angeblich "schnell" ist, kann gegen keine spezifische Anforderung getestet werden, solange "schnell" nicht als konkrete Metrik mit Schwellenwert definiert ist.

## Zweck, Mental Model und Dependencies

Die Überführung eines vagen Wunsches in ein messbares Szenario erfordert gezieltes Nachfragen: "Das System muss schnell sein" wird durch Fragen wie "Bei welcher tatsächlichen Last?", "Welche konkrete Aktion soll wie schnell abgeschlossen sein?" und "Was ist die tatsächlich noch akzeptable Obergrenze?" zu einem konkreten Szenario wie "Bei 1000 gleichzeitigen Nutzern soll eine Produktsuche in unter 500ms antworten" — diese Konkretisierung ist die zentrale moderative Fähigkeit, da Stakeholder ihre Wünsche tatsächlich meist zunächst vage formulieren, ohne die zugrunde liegende, konkrete Erwartung selbst bereits präzise artikuliert zu haben. Zielkonflikte zwischen Stakeholdern entstehen tatsächlich häufig, wenn unterschiedliche Stakeholder widersprüchliche Prioritäten haben (etwa: das Produktteam will maximale Flexibilität für schnelle Featureentwicklung, das Betriebsteam will maximale Stabilität mit minimalen Änderungen) — ein guter NFR-Workshop macht diese Konflikte explizit sichtbar, statt sie zu übergehen, da ein übergangener Zielkonflikt tatsächlich später, wenn die Architektur bereits festgelegt ist, zu Konflikten führt, die dann erheblich teurer zu lösen sind. Priorisierung gemeinsam festzulegen bedeutet, dass nicht der Architekt allein entscheidet, welche NFR tatsächlich Vorrang hat, sondern dass die beteiligten Stakeholder die Konsequenzen unterschiedlicher Priorisierungen tatsächlich verstehen und eine bewusste, gemeinsam getragene Entscheidung treffen — dies entspricht strukturell der in KB-0677 beschriebenen Trennung von Fakten und Annahmen: Eine NFR-Priorität, die stillschweigend vom Architekten angenommen statt tatsächlich mit den Stakeholdern geklärt wird, ist eine unverifizierte Annahme, die später tatsächlich falsch sein könnte. Die technische NFR-Methodik (formale Notation für Qualitätsszenarien, etwa Stimulus-Response-Formate) wird in diesem Kapitel als bereits etabliert referenziert — der Fokus liegt auf der vorgelagerten, moderativen Fähigkeit, die überhaupt erst die Rohdaten liefert, die diese Methodik formal strukturieren kann.

~~~text
NFR Workshop (Non-Functional Requirements) transforms vague, subjectively formulated
  stakeholder wishes (e.g. "system must be fast", "solution must be secure") into
  ACTUALLY measurable quality scenarios -- concrete, checkable statements w/ load
  profile, target metric, threshold
  this chapter references technical NFR methodology (formal quality-attribute-scenario
  notation) as already established base knowledge, focuses instead on moderation
  practice: how are stakeholder wishes ACTUALLY elicited, how are conflicting priorities
  between different stakeholders made visible, how is a jointly, ACTUALLY viable
  prioritization achieved
KEY POINT: a vague wish not transformed into a measurable scenario is ACTUALLY not
  checkable -- system allegedly "fast" can't be tested against any specific requirement
  as long as "fast" isn't defined as concrete metric w/ threshold
TRANSFORMING vague wish into measurable scenario requires targeted follow-up questions:
  "system must be fast" -> "at what ACTUAL load?", "which concrete action should
  complete how fast?", "what is the ACTUALLY still acceptable ceiling?" -> concrete
  scenario like "at 1000 concurrent users, product search should respond in under 500ms"
  this concretization = central moderation skill, since stakeholders ACTUALLY usually
  formulate wishes vaguely first, w/o having precisely articulated underlying, concrete
  expectation themselves
CONFLICTING PRIORITIES between stakeholders ACTUALLY frequently arise when different
  stakeholders have contradictory priorities (product team wants max flexibility for
  fast feature dev, ops team wants max stability w/ minimal changes)
  good NFR workshop makes these conflicts explicitly visible instead of glossing over
  them -- glossed-over conflict ACTUALLY leads to later conflicts once architecture
  already fixed, then ACTUALLY substantially more expensive to resolve
JOINTLY FIXING PRIORITIZATION means architect doesn't decide alone which NFR ACTUALLY
  takes precedence -- involved stakeholders ACTUALLY understand consequences of
  different prioritizations and make a conscious, jointly-owned decision
  structurally corresponds to KB-0677's fact/assumption separation: NFR priority
  silently assumed by architect instead of ACTUALLY clarified w/ stakeholders = an
  unverified assumption that could ACTUALLY prove wrong later
TECHNICAL NFR METHODOLOGY (formal notation for quality scenarios, stimulus-response
  formats) referenced as already established in this chapter -- focus on the upstream,
  moderative skill that first delivers raw data that methodology can formally structure
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Gezieltes Nachfragen (Last, Aktion, Schwellenwert) | überführt vagen Wunsch in messbares Szenario | ermöglicht tatsächliche Überprüfbarkeit |
| Explizit sichtbare Zielkonflikte | zeigt widersprüchliche Stakeholder-Prioritäten | verhindert später teurere, übergangene Konflikte |
| Gemeinsam getragene Priorisierung | Stakeholder verstehen Konsequenzen der Wahl | verhindert stillschweigende, unverifizierte Architektenannahme |
| Referenz auf technische NFR-Methodik | formale Notation als etabliertes Grundwissen vorausgesetzt | Fokus bleibt auf Moderationspraxis statt Notationsdetails |

Implementierung: Jeder vage formulierte Stakeholderwunsch wird im Workshop durch gezieltes Nachfragen in ein konkretes, messbares Szenario mit Lastprofil, Metrik und Schwellenwert überführt. Erkannte Zielkonflikte werden explizit dokumentiert und den betroffenen Stakeholdern zur gemeinsamen Priorisierung vorgelegt, statt vom Architekten allein entschieden zu werden.

## Scalability, Reliability, Security und Observability

Eine NFR-Workshop-Praxis skaliert über die Anzahl der beteiligten Stakeholdergruppen mit potenziell widersprüchlichen Prioritäten; die Reliability-Grenze liegt darin, dass ein übergangener, nicht explizit gemachter Zielkonflikt tatsächlich erst nach Architekturfestlegung sichtbar wird, wenn seine Korrektur bereits teuer ist.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Architektur erfüllt einen Stakeholderwunsch nicht, obwohl er im Workshop besprochen wurde | der Wunsch wurde nicht tatsächlich in ein messbares Szenario überführt, sondern vage belassen | den Wunsch nachträglich durch gezieltes Nachfragen in ein konkretes Szenario überführen |
| nach Architekturfestlegung entsteht ein Konflikt zwischen Produkt- und Betriebsteam | der zugrunde liegende Zielkonflikt wurde im Workshop nicht explizit sichtbar gemacht | einen nachgelagerten Workshop zur expliziten Klärung des Zielkonflikts durchführen |
| eine NFR-Priorität wurde vom Architekten allein festgelegt, ohne Stakeholderabstimmung | keine gemeinsam getragene Priorisierung wurde durchgeführt | die Priorisierung mit den betroffenen Stakeholdern explizit nachholen |

Security: Sicherheitsbezogene NFRs sollten mit denselben Konkretisierungsanforderungen behandelt werden wie Performance-NFRs, statt als vage "muss sicher sein"-Aussage stehen zu bleiben. Observability: Die tatsächliche Anzahl noch vager, nicht in Szenarien überführter Stakeholderwünsche zum Workshop-Abschluss ist ein zentrales Signal für die Workshop-Qualität.

## Trade-offs und Entscheidungen

**Staff** überführt für einen gegebenen, vagen Stakeholderwunsch ein konkretes, messbares Szenario. **Principal** moderiert den vollständigen NFR-Workshop mit mehreren Stakeholdergruppen und macht Zielkonflikte explizit sichtbar. **Chief** legt unternehmensweite Standards fest, die verpflichtende Szenario-Konkretisierung vor jeder größeren Architekturfestlegung vorschreiben.

Anti-Patterns: einen vagen Stakeholderwunsch ungeklärt in die Architekturplanung übernehmen; einen erkannten Zielkonflikt zwischen Stakeholdern übergehen statt explizit sichtbar zu machen; NFR-Priorität allein als Architekt festlegen statt gemeinsam mit Stakeholdern zu klären.

## Production Checklist

- [ ] Jeder vage Stakeholderwunsch ist in ein konkretes, messbares Szenario mit Lastprofil, Metrik und Schwellenwert überführt.
- [ ] Erkannte Zielkonflikte zwischen Stakeholdern sind explizit dokumentiert.
- [ ] Die Priorisierung widersprüchlicher NFRs ist gemeinsam mit den betroffenen Stakeholdern getroffen, nicht allein vom Architekten.
- [ ] Zum Workshop-Abschluss sind keine entscheidungsrelevanten Wünsche mehr vage.

## Interviewfragen

### 1. Warum ist ein vager Wunsch wie "das System muss schnell sein" nicht überprüfbar?

**Antwort:** Weil er keine konkrete Last, Aktion oder Zielmetrik mit Schwellenwert benennt, gegen die eine tatsächliche Erfüllung getestet werden könnte.

### 2. Wie wird ein vager Wunsch in ein messbares Szenario überführt?

**Antwort:** Durch gezieltes Nachfragen nach der tatsächlichen Last, der konkreten Aktion und dem akzeptablen Schwellenwert, bis ein konkretes Stimulus-Response-Szenario entsteht.

### 3. Warum sollten Zielkonflikte zwischen Stakeholdern im Workshop explizit sichtbar gemacht werden?

**Antwort:** Weil ein übergangener Zielkonflikt später, nach Architekturfestlegung, zu erheblich teureren Konflikten führt.

### 4. Warum sollte die Priorisierung von NFRs nicht allein vom Architekten getroffen werden?

**Antwort:** Weil eine stillschweigend vom Architekten angenommene Priorität eine unverifizierte Annahme darstellt, die später falsch sein könnte, während eine gemeinsam getragene Entscheidung die tatsächlichen Konsequenzen für alle Stakeholder transparent macht.

### 5. Wie gehst du vor, wenn eine Architektur einen Stakeholderwunsch nicht erfüllt, obwohl er im Workshop besprochen wurde?

**Antwort:** Ich prüfe, ob der Wunsch tatsächlich in ein messbares Szenario überführt wurde oder vage geblieben ist, und hole die Konkretisierung nach, um die tatsächliche Erwartung klarzustellen.

### 6. Widersprüchliche Anforderung: Das Produktteam will maximale Flexibilität für schnelle Featureentwicklung UND das Betriebsteam will maximale Stabilität mit minimalen Änderungen — wie moderierst du diesen Konflikt im Workshop?

**Antwort:** Ich würde den Konflikt explizit als Zielkonflikt benennen, für beide Positionen die jeweiligen Konsequenzen (Risiko bei Flexibilität, Verzögerung bei Stabilität) transparent machen und eine bewusste, gemeinsam getragene Priorisierung oder einen expliziten Kompromiss (etwa gestaffelte Release-Zyklen) erarbeiten, statt den Konflikt unadressiert zu lassen.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: In einem Workshop für eine B2B-Commerce-Plattform (angelehnt an Domain 29) formuliert ein Stakeholder den Wunsch "die Produktsuche muss schnell sein", während ein anderer Stakeholder gleichzeitig "das System muss auch bei Lastspitzen stabil bleiben" fordert.

~~~python
# Local, deterministic illustration of transforming vague wishes into measurable scenarios (fictional lab example, no real system):

def concretize_wish(vague_wish, load, action, threshold_ms):
    return f"At {load} concurrent users, '{action}' must respond within {threshold_ms}ms"

scenario_1 = concretize_wish("system must be fast", load=1000, action="product search", threshold_ms=500)
scenario_2 = concretize_wish("system must be stable under peak load", load=5000, action="checkout completion", threshold_ms=2000)
print(scenario_1)
print(scenario_2)
~~~

Erwartete Beobachtung: Beide vagen Wünsche werden zu konkreten, testbaren Szenarien mit unterschiedlichen Lastprofilen. Auswertung: Die beiden Szenarien zeigen tatsächlich unterschiedliche, potenziell konkurrierende Ressourcenanforderungen (schnelle Antwortzeit bei normaler Last vs. Stabilität bei Lastspitzen), die im Workshop als expliziter Zielkonflikt zur gemeinsamen Priorisierung vorgelegt werden müssen.

## Dependencies, Cross-References und Quellen

1. Software Engineering Institute (SEI), Carnegie Mellon University: [Quality Attribute Workshops (QAW)](https://insights.sei.cmu.edu/documents/1381/2003_005_001_14163.pdf), abgerufen 2026-09-18.
2. Len Bass, Paul Clements, Rick Kazman: [Software Architecture in Practice — Quality Attribute Scenarios](https://www.oreilly.com/library/view/software-architecture-in/9780132942799/), abgerufen 2026-09-18.

Dieses Kapitel baut auf der in KB-0677 (Architektur-Discovery in der Praxis) beschriebenen Fakten-/Annahmen-Trennung auf und wendet sie auf die NFR-Erhebung an.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte Workshop-Moderationsassistenz zur automatisierten Erkennung vager Formulierungen und Vorschlägen für Nachfragen | Emerging | Bei künftigen Workshops evaluieren, jedoch die finale Konkretisierung und Priorisierung weiterhin durch menschliche Moderation mit den tatsächlichen Stakeholdern sicherstellen. |

Ein Team akzeptiert einen NFR-Workshop erst abgeschlossen, wenn alle entscheidungsrelevanten Wünsche in messbare Szenarien überführt und Zielkonflikte explizit sichtbar sowie gemeinsam priorisiert sind.
