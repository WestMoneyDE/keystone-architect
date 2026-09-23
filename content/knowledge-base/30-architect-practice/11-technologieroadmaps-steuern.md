---
{"id": "KB-0687", "title": "Technologieroadmaps steuern", "domain": "30", "sequence": 11, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0686", "concepts": ["Überprüfbare strategische Wette"], "needed_for": "Eine Roadmap setzt die in KB-0686 beschriebene strategische Wette in konkrete Meilensteine um"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für eine gegebene strategische Wette eine Roadmap mit Abhängigkeiten, Meilensteinen und Evidenzpunkten planen und diese bei neuen Erkenntnissen tatsächlich aktualisieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine komplexe, mehrjährige Roadmap Abhängigkeiten zwischen Meilensteinen explizit modellieren und Evidenzpunkte definieren, an denen die Roadmap tatsächlich neu bewertet wird.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Roadmap als bloße Terminliste ohne strategischen Entscheidungsbezug geführt wird, sodass sie bei neuen Erkenntnissen tatsächlich nicht angepasst wird.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Roadmap-Governance festlegen, die explizite Evidenzpunkte und verpflichtende Aktualisierung bei neuen Erkenntnissen vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, formale Abhängigkeitsgraph-Modellierung für Projektplanung im Detail ist Vertiefung.", "rationale": "Kern ist die strategische Steuerung der Roadmap mit Evidenzpunkten, nicht die formale Projektplanungsdetailtiefe."}}, "lab_validation": [{"lab_id": "KB-0687-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung einer Roadmap mit Evidenzpunkten, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie eine Roadmap mit explizit definierten Evidenzpunkten bei einer neuen, entscheidungsrelevanten Erkenntnis tatsächlich angepasst wird, während eine als bloße Terminliste geführte Roadmap trotz neuer Erkenntnis unverändert fortgeführt wird.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# Technologieroadmaps steuern

> **Ziel:** Eine Technologieroadmap setzt eine strategische Wette (siehe KB-0686) in konkrete, zeitlich geordnete Schritte um, über drei Elemente: **Abhängigkeiten** (welche Schritte tatsächlich vor anderen abgeschlossen sein müssen), **Meilensteine** (konkrete, überprüfbare Zwischenziele) und **Evidenzpunkte** (explizit geplante Zeitpunkte, an denen tatsächlich neue Erkenntnisse eingeholt und die Roadmap gegebenenfalls angepasst wird). Der zentrale Punkt dieses Kapitels ist die Unterscheidung zwischen einer bloßen Terminliste (die lediglich festlegt, wann etwas fertig sein soll, ohne strategischen Entscheidungsbezug) und einer tatsächlich strategisch gesteuerten Roadmap (die explizit vorsieht, bei neuen Erkenntnissen tatsächlich angepasst zu werden) — eine Roadmap, die als reine Terminliste geführt wird, wird tatsächlich stur weiterverfolgt, selbst wenn eine neue, entscheidungsrelevante Erkenntnis eigentlich eine Anpassung nahelegen würde.

## Zweck, Mental Model und Dependencies

Abhängigkeiten zwischen Roadmap-Schritten explizit zu modellieren bedeutet, tatsächlich sichtbar zu machen, welcher Schritt von welchem anderen tatsächlich abhängt, statt eine lineare Liste von Terminen zu präsentieren, die implizit unabhängig voneinander erscheinen — eine unklar modellierte Abhängigkeit führt tatsächlich dazu, dass eine Verzögerung an einer Stelle nicht sichtbar auf abhängige, nachgelagerte Schritte durchschlägt, bis das Problem tatsächlich zu spät entdeckt wird. Meilensteine als konkrete, überprüfbare Zwischenziele zu definieren bedeutet, tatsächlich messbare Kriterien statt vager Fortschrittsbeschreibungen zu formulieren — "Phase 2 abgeschlossen" ist tatsächlich weniger überprüfbar als "die neue Plattform verarbeitet tatsächlich 10.000 Anfragen pro Tag in Produktion", da Letzteres eine tatsächliche, objektiv feststellbare Erfüllung ermöglicht. Evidenzpunkte sind das zentrale, unterscheidende Element einer strategisch gesteuerten Roadmap: Sie sind explizit geplante Zeitpunkte (nicht nur Meilensteine, sondern tatsächliche Entscheidungspunkte), an denen die Roadmap gegen neue, seit der ursprünglichen Planung eingetretene Erkenntnisse geprüft wird — etwa: Ist die zugrunde liegende, strategische Annahme (siehe KB-0686) noch tatsächlich gültig? Hat sich eine Randbedingung tatsächlich verändert? Diese Evidenzpunkte entsprechen strukturell den in KB-0683 beschriebenen ADR-Überprüfungen, hier jedoch auf die zeitliche Ablaufplanung einer strategischen Wette angewendet. Der Unterschied zwischen Terminliste und strategisch gesteuerter Roadmap zeigt sich konkret in der Reaktion auf neue Erkenntnisse: Eine Terminliste wird tatsächlich unverändert weiterverfolgt, selbst wenn sich die zugrunde liegenden Annahmen tatsächlich geändert haben, da sie keine expliziten Evidenzpunkte für eine Neubewertung vorsieht — eine strategisch gesteuerte Roadmap hingegen sieht an ihren Evidenzpunkten tatsächlich eine bewusste Entscheidung vor: die Roadmap unverändert fortzusetzen, sie anzupassen, oder die zugrunde liegende strategische Wette tatsächlich zu beenden, wenn sich ihre Grundannahmen als tatsächlich falsch erwiesen haben.

~~~text
Technology Roadmap translates a strategic bet (see KB-0686) into concrete, chronologically
  ordered steps, via 3 elements
  DEPENDENCIES: which steps ACTUALLY must be complete before others
  MILESTONES: concrete, checkable intermediate goals
  EVIDENCE POINTS: explicitly planned points in time where new insights ACTUALLY get
  gathered + roadmap possibly adjusted
KEY POINT: distinguishing mere timeline (merely fixes when something should be done, no
  strategic decision link) from ACTUALLY strategically steered roadmap (explicitly
  foresees being ACTUALLY adjusted on new insights) -- roadmap run as pure timeline gets
  ACTUALLY stubbornly followed even when a new, decision-relevant insight would actually
  suggest adjustment
EXPLICITLY MODELING DEPENDENCIES between roadmap steps means ACTUALLY making visible
  which step ACTUALLY depends on which other, instead of presenting linear list of dates
  implicitly appearing independent -- unclearly modeled dependency ACTUALLY causes a
  delay at one point to not visibly propagate to dependent, downstream steps until
  problem ACTUALLY discovered too late
DEFINING MILESTONES as concrete, checkable intermediate goals means ACTUALLY formulating
  measurable criteria instead of vague progress descriptions -- "phase 2 complete" is
  ACTUALLY less checkable than "new platform ACTUALLY processes 10,000 requests/day in
  production", since latter enables ACTUAL, objectively determinable fulfillment
EVIDENCE POINTS = central, distinguishing element of strategically steered roadmap:
  explicitly planned points in time (not just milestones, but ACTUAL decision points)
  where roadmap checked against new insights ACTUALLY emerged since original planning --
  is underlying strategic assumption (see KB-0686) still ACTUALLY valid? has a constraint
  ACTUALLY changed?
  structurally corresponds to KB-0683's ADR reviews, here applied to time schedule of a
  strategic bet
DIFFERENCE between timeline and strategically steered roadmap shows concretely in
  reaction to new insights: timeline ACTUALLY gets followed unchanged even if underlying
  assumptions ACTUALLY changed, since it foresees no explicit evidence points for
  reassessment
  strategically steered roadmap, at its evidence points, ACTUALLY foresees a deliberate
  decision: continue roadmap unchanged, adjust it, or ACTUALLY end underlying strategic
  bet if its base assumptions ACTUALLY proved wrong
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Explizit modellierte Abhängigkeiten | zeigt tatsächliche Reihenfolge- und Verzögerungswirkung | verhindert unsichtbares Durchschlagen von Verzögerungen |
| Konkrete, überprüfbare Meilensteine | messbare statt vage Fortschrittskriterien | ermöglicht objektive Erfüllungsfeststellung |
| Explizite Evidenzpunkte | geplante Neubewertung gegen aktuelle Erkenntnisse | zentrales Unterscheidungsmerkmal zur reinen Terminliste |
| Bewusste Reaktionsentscheidung an Evidenzpunkten | fortsetzen, anpassen oder beenden | verhindert stures Fortführen bei widerlegten Annahmen |

Implementierung: Roadmap-Schritte werden mit expliziten Abhängigkeiten modelliert. Jeder Meilenstein hat ein konkretes, messbares Erfüllungskriterium. An definierten Evidenzpunkten wird die Roadmap aktiv gegen neue Erkenntnisse geprüft, mit einer expliziten Entscheidung über Fortsetzung, Anpassung oder Beendigung.

## Scalability, Reliability, Security und Observability

Eine Roadmap-Steuerungspraxis skaliert über die Anzahl der parallel verfolgten, strategisch gesteuerten Roadmaps; die Reliability-Grenze liegt darin, dass eine als reine Terminliste geführte Roadmap tatsächlich unverändert fortgeführt wird, selbst wenn sich zugrunde liegende Annahmen als falsch erwiesen haben.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Verzögerung an einer Stelle wird erst spät für nachgelagerte Schritte sichtbar | Abhängigkeiten zwischen Roadmap-Schritten sind nicht explizit modelliert | die Abhängigkeiten explizit nachträglich modellieren und Verzögerungswirkungen sichtbar machen |
| eine Roadmap wird trotz widerlegter Grundannahme unverändert fortgeführt | keine expliziten Evidenzpunkte für eine Neubewertung wurden geplant | Evidenzpunkte nachträglich einführen und eine explizite Neubewertung der Roadmap durchführen |
| ein Meilenstein wird als "erreicht" gemeldet, ohne dass dies tatsächlich überprüfbar ist | der Meilenstein wurde vage statt als konkretes, messbares Kriterium formuliert | den Meilenstein in ein konkretes, messbares Erfüllungskriterium umformulieren |

Security: Sicherheitsrelevante Roadmap-Meilensteine sollten mit besonders konkreten, überprüfbaren Kriterien versehen werden. Observability: Die tatsächliche Anzahl von Roadmaps mit aktuell durchgeführten Evidenzpunkt-Überprüfungen ist ein zentrales Signal zur Bewertung der Roadmap-Governance-Qualität.

## Trade-offs und Entscheidungen

**Staff** definiert für einen gegebenen Roadmap-Abschnitt konkrete, überprüfbare Meilensteine. **Principal** entwirft die vollständige Roadmap mit Abhängigkeiten und Evidenzpunkten für eine strategische Wette. **Chief** legt unternehmensweite Standards für Roadmap-Governance fest, die verpflichtende Evidenzpunkt-Überprüfung vorschreiben.

Anti-Patterns: eine Roadmap als reine Terminliste ohne Abhängigkeitsmodellierung führen; Meilensteine vage statt als konkrete, messbare Kriterien formulieren; eine Roadmap trotz widerlegter Grundannahme unverändert fortführen, weil keine Evidenzpunkte für eine Neubewertung geplant waren.

## Production Checklist

- [ ] Abhängigkeiten zwischen Roadmap-Schritten sind explizit modelliert.
- [ ] Jeder Meilenstein hat ein konkretes, messbares Erfüllungskriterium.
- [ ] Explizite Evidenzpunkte für eine Neubewertung sind geplant.
- [ ] An jedem Evidenzpunkt wird eine bewusste Entscheidung über Fortsetzung, Anpassung oder Beendigung getroffen.

## Interviewfragen

### 1. Was unterscheidet eine strategisch gesteuerte Roadmap von einer bloßen Terminliste?

**Antwort:** Eine strategisch gesteuerte Roadmap sieht explizit geplante Evidenzpunkte vor, an denen sie gegen neue Erkenntnisse geprüft und gegebenenfalls angepasst wird, während eine Terminliste unverändert weiterverfolgt wird.

### 2. Warum sind explizit modellierte Abhängigkeiten zwischen Roadmap-Schritten wichtig?

**Antwort:** Weil eine unklar modellierte Abhängigkeit dazu führt, dass eine Verzögerung nicht sichtbar auf nachgelagerte Schritte durchschlägt, bis das Problem zu spät entdeckt wird.

### 3. Warum ist ein Meilenstein wie "Phase 2 abgeschlossen" weniger geeignet als ein konkretes, messbares Kriterium?

**Antwort:** Weil er keine objektiv feststellbare Erfüllung ermöglicht, während ein konkretes Kriterium wie eine bestimmte Verarbeitungskapazität tatsächlich überprüfbar ist.

### 4. Was passiert an einem Evidenzpunkt einer strategisch gesteuerten Roadmap?

**Antwort:** Die Roadmap wird gegen neue, seit der ursprünglichen Planung eingetretene Erkenntnisse geprüft, mit einer bewussten Entscheidung über Fortsetzung, Anpassung oder Beendigung.

### 5. Wie gehst du vor, wenn eine Roadmap trotz widerlegter Grundannahme unverändert fortgeführt wird?

**Antwort:** Ich führe nachträglich Evidenzpunkte ein und veranlasse eine explizite Neubewertung der Roadmap gegen die aktuelle, tatsächliche Erkenntnislage.

### 6. Widersprüchliche Anforderung: Das Programmmanagement will eine stabile, verlässliche Roadmap ohne häufige Änderungen UND die Organisation will Flexibilität bei neuen, entscheidungsrelevanten Erkenntnissen — wie gehst du vor?

**Antwort:** Ich würde wenige, bewusst platzierte Evidenzpunkte statt einer kontinuierlichen Neubewertung definieren, sodass die Roadmap zwischen diesen Punkten tatsächlich stabil bleibt, aber an den definierten Punkten gezielt gegen neue Erkenntnisse geprüft wird, statt entweder starr unveränderlich oder ständig in Bewegung zu sein.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Eine Roadmap für die in KB-0686 skizzierte GenAI-Kundeninteraktionsplattform sieht einen Evidenzpunkt nach 18 Monaten vor. Zu diesem Zeitpunkt zeigt sich, dass die tatsächliche Automatisierungsrate deutlich unter der ursprünglichen Annahme liegt.

~~~python
# Local, deterministic illustration of an evidence point triggering a roadmap decision (fictional lab example, no real project):

def evaluate_evidence_point(actual_metric, expected_metric, tolerance_pct=20):
    deviation_pct = abs(actual_metric - expected_metric) / expected_metric * 100
    if deviation_pct > tolerance_pct:
        return "adjust_or_reconsider_bet"
    return "continue_as_planned"

result = evaluate_evidence_point(actual_metric=15, expected_metric=40)  # 15% actual vs 40% expected automation
print(result)
~~~

Erwartete Beobachtung: Die deutliche Abweichung von der ursprünglichen Erwartung löst eine explizite Entscheidung zur Anpassung oder Neubewertung aus, statt die Roadmap unverändert fortzuführen. Auswertung: Ohne den explizit geplanten Evidenzpunkt hätte das Team die Roadmap möglicherweise trotz der deutlich niedrigeren tatsächlichen Automatisierungsrate unreflektiert weiterverfolgt.

## Dependencies, Cross-References und Quellen

1. Project Management Institute (PMI): [The Standard for Program Management — Roadmap Governance](https://www.pmi.org/), abgerufen 2026-09-18.
2. Gartner: [IT Roadmap Best Practices — Evidence-Based Planning](https://www.gartner.com/en/information-technology), abgerufen 2026-09-18.

Dieses Kapitel baut auf der in KB-0686 (Technologiestrategie entwickeln) beschriebenen strategischen Wette auf und setzt sie in eine konkrete, zeitlich gesteuerte Roadmap um.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte, kontinuierliche Signalerkennung zur automatisierten Identifikation, wann ein Evidenzpunkt vorzeitig ausgelöst werden sollte | Emerging | Bei künftigen, umfangreichen Roadmap-Programmen evaluieren, jedoch die finale Entscheidung über Fortsetzung, Anpassung oder Beendigung weiterhin durch den verantwortlichen Owner treffen lassen. |

Ein Team akzeptiert eine Technologieroadmap erst, wenn Abhängigkeiten explizit modelliert, Meilensteine messbar formuliert und Evidenzpunkte mit tatsächlich durchgeführten Neubewertungen dokumentiert sind.
