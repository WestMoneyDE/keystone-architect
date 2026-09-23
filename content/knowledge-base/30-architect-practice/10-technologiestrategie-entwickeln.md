---
{"id": "KB-0686", "title": "Technologiestrategie entwickeln", "domain": "30", "sequence": 10, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0594", "concepts": ["Capability Mapping"], "needed_for": "Technologiestrategie verbindet Geschäftsrichtung mit den in KB-0594 beschriebenen Fähigkeiten"}, {"id": "KB-0685", "concepts": ["Unsicherheit offen darstellen"], "needed_for": "Eine strategische Wette nutzt dieselbe Unsicherheitsdarstellung wie das in KB-0685 beschriebene Trade-off-Narrativ"}], "related": ["KB-0680"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für ein gegebenes Unternehmen Geschäftsrichtung und technische Fähigkeiten zu einer überprüfbaren strategischen Wette verbinden und explizite Nichtziele festlegen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine mehrjährige Technologiestrategie mehrere strategische Wetten mit jeweiligen Überprüfungskriterien entwerfen und begründen, warum bestimmte Fähigkeiten explizit außerhalb des Strategiefokus liegen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Technologiestrategie keine überprüfbaren Kriterien enthält, sodass ihr Erfolg oder Misserfolg tatsächlich nicht feststellbar ist.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Eine mehrjährige Technologiestrategie mit überprüfbaren strategischen Wetten, expliziten Nichtzielen und benannten Verantwortlichen festlegen und deren Fortschritt tatsächlich verfolgen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, formale Capability-Mapping-Methodik im Detail ist Vertiefung und wird als etabliert referenziert.", "rationale": "Kern ist die Verbindung von Geschäftsrichtung und Fähigkeiten zu überprüfbaren Wetten, nicht die formale Mapping-Methodendetailtiefe."}}, "lab_validation": [{"lab_id": "KB-0686-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung einer überprüfbaren strategischen Wette, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie eine vage Technologiestrategieaussage in eine überprüfbare strategische Wette mit konkretem Überprüfungskriterium, Nichtzielen und benanntem Verantwortlichen überführt wird.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# Technologiestrategie entwickeln

> **Ziel:** Eine Technologiestrategie verbindet Geschäftsrichtung (wohin sich das Unternehmen tatsächlich entwickeln will), Differenzierung (was das Unternehmen tatsächlich vom Wettbewerb unterscheiden soll) und technische Fähigkeiten (siehe KB-0594, Capability Mapping) zu überprüfbaren **strategischen Wetten** — konkreten, mehrjährigen Investitionsentscheidungen mit einem tatsächlich definierten Überprüfungskriterium, statt vager Absichtserklärungen wie "wir setzen auf KI". Der zentrale Punkt dieses Kapitels ist, dass eine Technologiestrategie ebenso explizit **Nichtziele** (Fähigkeiten oder Bereiche, in die bewusst tatsächlich nicht investiert wird) und **Verantwortliche** (wer die strategische Wette tatsächlich über die Jahre verfolgt und deren Fortschritt bewertet) benennen muss — eine Strategie ohne explizite Nichtziele verspricht implizit, überall gleichzeitig führend zu sein, was tatsächlich bei begrenzten Ressourcen nicht realistisch ist.

## Zweck, Mental Model und Dependencies

Eine strategische Wette unterscheidet sich von einer vagen Absichtserklärung dadurch, dass sie tatsächlich konkret und überprüfbar ist — nicht "wir setzen auf KI", sondern "wir investieren über drei Jahre in eine eigene, GenAI-gestützte Kundeninteraktionsplattform, mit dem Überprüfungskriterium, dass bis Jahr zwei tatsächlich X% der Kundenanfragen automatisiert bearbeitet werden" — diese Konkretisierung ermöglicht es tatsächlich, nach einer definierten Zeit zu bewerten, ob die Wette tatsächlich aufgeht, statt eine unklare strategische Absicht endlos fortzuführen, ohne jemals eine tatsächliche Erfolgsbewertung vorzunehmen. Die Verbindung von Geschäftsrichtung und technischen Fähigkeiten bedeutet, dass eine strategische Wette tatsächlich auf dem in KB-0594 beschriebenen Capability Mapping aufbaut — eine Wette auf eine Fähigkeit, die tatsächlich nicht zur Geschäftsrichtung passt (etwa eine hochspezialisierte technische Fähigkeit ohne tatsächlichen Bezug zur angestrebten Differenzierung), verschwendet tatsächlich Ressourcen, die für strategisch relevantere Wetten benötigt würden. Nichtziele explizit zu benennen bedeutet, bewusst zu entscheiden, in welche Fähigkeiten oder Bereiche tatsächlich nicht investiert wird — dies ist ebenso wichtig wie die positive Wette selbst, da eine Organisation mit begrenzten Ressourcen tatsächlich nicht in jedem Bereich gleichzeitig führend sein kann; ein explizites Nichtziel (etwa "wir bauen keine eigene Basis-Modellinfrastruktur, sondern nutzen etablierte Anbieter") schützt tatsächlich davor, Ressourcen in einen Bereich zu zerstreuen, der für die eigentliche Differenzierung tatsächlich nicht entscheidend ist. Verantwortliche zu benennen bedeutet, dass für jede strategische Wette tatsächlich eine konkrete Person oder Rolle die Verfolgung über die mehrjährige Laufzeit übernimmt — ohne diese Verantwortlichkeit verliert eine strategische Wette tatsächlich an Aufmerksamkeit, sobald das ursprüngliche Momentum nachlässt, und ihre tatsächliche Überprüfung zum definierten Zeitpunkt unterbleibt tatsächlich, wenn niemand konkret dafür zuständig ist.

~~~text
Technology Strategy connects business direction (where company ACTUALLY wants to go),
  differentiation (what ACTUALLY should distinguish company from competition), and
  technical capabilities (see KB-0594, Capability Mapping) into checkable STRATEGIC BETS
  -- concrete, multi-year investment decisions w/ ACTUALLY defined review criterion,
  instead of vague statements of intent like "we're betting on AI"
KEY POINT: technology strategy must equally explicitly name NON-GOALS (capabilities/
  areas deliberately ACTUALLY not invested in) and OWNERS (who ACTUALLY tracks strategic
  bet over the years, assesses its progress) -- strategy w/o explicit non-goals
  implicitly promises being leading everywhere simultaneously, ACTUALLY not realistic
  under limited resources
STRATEGIC BET differs from vague statement of intent by being ACTUALLY concrete +
  checkable -- not "we're betting on AI" but "we invest over 3 years in own, GenAI-
  driven customer interaction platform, w/ review criterion that ACTUALLY X% of customer
  inquiries automated by year 2" -- this concretization ACTUALLY enables assessing after
  defined time whether bet ACTUALLY pays off, instead of endlessly continuing unclear
  strategic intent w/o ever ACTUALLY assessing success
CONNECTING BUSINESS DIRECTION + TECHNICAL CAPABILITIES means strategic bet ACTUALLY
  builds on KB-0594's capability mapping -- bet on a capability ACTUALLY not fitting
  business direction (highly specialized technical capability w/o ACTUAL relation to
  intended differentiation) ACTUALLY wastes resources needed for more strategically
  relevant bets
EXPLICITLY NAMING NON-GOALS means deliberately deciding which capabilities/areas
  ACTUALLY not invested in -- equally important as the positive bet itself, since
  resource-limited organization ACTUALLY can't lead everywhere simultaneously
  explicit non-goal ("we don't build own base-model infrastructure, use established
  providers instead") ACTUALLY protects against scattering resources into an area not
  ACTUALLY decisive for actual differentiation
NAMING OWNERS means every strategic bet ACTUALLY has a concrete person/role tracking it
  over multi-year duration -- w/o this ownership, strategic bet ACTUALLY loses attention
  once initial momentum fades, its ACTUAL review at defined time ACTUALLY doesn't happen
  when nobody's concretely responsible for it
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Konkrete, überprüfbare strategische Wette | ersetzt vage Absichtserklärung durch prüfbares Kriterium | ermöglicht tatsächliche Erfolgsbewertung nach definierter Zeit |
| Verbindung zu Capability Mapping | stellt Bezug zur tatsächlichen Geschäftsrichtung sicher | verhindert Ressourcenverschwendung auf irrelevante Fähigkeiten |
| Explizite Nichtziele | benennt bewusst nicht verfolgte Bereiche | verhindert implizites Versprechen allgegenwärtiger Führung |
| Benannte Verantwortliche | konkrete Person verfolgt Wette über Jahre | verhindert Aufmerksamkeitsverlust und unterbliebene Überprüfung |

Implementierung: Jede strategische Wette wird mit einem konkreten, zeitgebundenen Überprüfungskriterium formuliert. Die Wette wird explizit gegen das Capability Mapping des Unternehmens geprüft. Explizite Nichtziele werden ebenso dokumentiert wie die positiven Wetten. Für jede Wette wird ein konkreter, namentlich benannter Verantwortlicher festgelegt.

## Scalability, Reliability, Security und Observability

Eine Technologiestrategie-Praxis skaliert über die Anzahl der parallel verfolgten strategischen Wetten; die Reliability-Grenze liegt darin, dass eine Wette ohne benannten Verantwortlichen tatsächlich an Aufmerksamkeit verliert und ihre Überprüfung ausbleibt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine strategische Wette wird nie tatsächlich auf Erfolg überprüft | kein konkretes, zeitgebundenes Überprüfungskriterium wurde definiert | die Wette rückwirkend um ein konkretes Kriterium und einen Überprüfungszeitpunkt ergänzen |
| Ressourcen verteilen sich über zu viele, teils irrelevante technische Bereiche | keine expliziten Nichtziele wurden festgelegt | explizite Nichtziele definieren, die bewusst nicht verfolgte Bereiche benennen |
| eine strategische Wette verliert nach anfänglichem Momentum an Aufmerksamkeit | kein konkreter Verantwortlicher wurde für die Verfolgung über die Jahre benannt | einen konkreten, namentlich benannten Verantwortlichen für die Wette festlegen |

Security: Sicherheitsrelevante strategische Wetten (etwa eine Zero-Trust-Transformation) sollten mit besonders klaren, überprüfbaren Kriterien versehen werden, da ihre Wirksamkeit sonst schwer messbar ist. Observability: Die tatsächliche Anzahl strategischer Wetten mit aktuellem, dokumentiertem Fortschrittsstatus ist ein zentrales Signal zur Bewertung der Strategieverfolgung.

## Trade-offs und Entscheidungen

**Staff** setzt eine gegebene, technische Fähigkeit im Rahmen einer bestehenden strategischen Wette um. **Principal** entwirft mehrere strategische Wetten mit Capability-Mapping-Bezug für einen Unternehmensbereich. **Chief** legt die vollständige, mehrjährige Technologiestrategie mit strategischen Wetten, expliziten Nichtzielen und benannten Verantwortlichen fest.

Anti-Patterns: eine Technologiestrategie als vage Absichtserklärung ohne überprüfbares Kriterium formulieren; keine expliziten Nichtziele festlegen, sodass implizit allgegenwärtige Führung versprochen wird; eine strategische Wette ohne konkreten, namentlich benannten Verantwortlichen führen.

## Production Checklist

- [ ] Jede strategische Wette hat ein konkretes, zeitgebundenes Überprüfungskriterium.
- [ ] Jede Wette ist explizit gegen das Capability Mapping des Unternehmens geprüft.
- [ ] Explizite Nichtziele sind dokumentiert.
- [ ] Jede Wette hat einen konkreten, namentlich benannten Verantwortlichen.

## Interviewfragen

### 1. Was unterscheidet eine strategische Wette von einer vagen Absichtserklärung?

**Antwort:** Eine strategische Wette hat ein konkretes, zeitgebundenes Überprüfungskriterium, das eine tatsächliche Erfolgsbewertung ermöglicht, während eine vage Absichtserklärung keine überprüfbare Aussage trifft.

### 2. Warum sind explizite Nichtziele ebenso wichtig wie die positiven strategischen Wetten?

**Antwort:** Weil eine Organisation mit begrenzten Ressourcen nicht in jedem Bereich gleichzeitig führend sein kann; Nichtziele verhindern die Zerstreuung von Ressourcen in weniger strategisch relevante Bereiche.

### 3. Warum muss eine strategische Wette einen benannten Verantwortlichen haben?

**Antwort:** Weil eine Wette ohne diese Verantwortlichkeit an Aufmerksamkeit verliert, sobald das ursprüngliche Momentum nachlässt, und ihre tatsächliche Überprüfung dann ausbleibt.

### 4. Wie verbindet sich eine strategische Wette mit dem Capability Mapping eines Unternehmens?

**Antwort:** Die Wette wird gegen die tatsächliche Geschäftsrichtung geprüft, sodass Investitionen in Fähigkeiten fließen, die tatsächlich zur angestrebten Differenzierung beitragen, statt in irrelevante Bereiche.

### 5. Wie gehst du vor, wenn eine strategische Wette nie tatsächlich auf Erfolg überprüft wird?

**Antwort:** Ich ergänze die Wette rückwirkend um ein konkretes, zeitgebundenes Überprüfungskriterium und benenne einen konkreten Verantwortlichen für die künftige Verfolgung.

### 6. Widersprüchliche Anforderung: Das Führungsteam will maximale strategische Flexibilität ohne feste Festlegungen UND die Organisation will klare, überprüfbare strategische Wetten mit definierten Kriterien — wie gehst du vor?

**Antwort:** Ich würde strategische Wetten mit definierten Zwischenüberprüfungspunkten formulieren, bei denen eine Wette basierend auf tatsächlichen Zwischenergebnissen angepasst oder beendet werden kann, statt entweder starre, unveränderliche Festlegungen oder völlig unverbindliche Absichtserklärungen zu treffen.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Unternehmen formuliert die vage Strategieaussage "wir wollen KI-getrieben werden" für die kommenden drei Jahre, ohne konkrete Kriterien oder Verantwortliche.

~~~python
# Local, deterministic illustration of transforming a vague strategy statement into a checkable strategic bet (fictional lab example, no real organization):

def formalize_bet(vague_statement, capability, review_criterion, review_date, owner, non_goals):
    return {
        "bet": f"Invest in {capability}",
        "review_criterion": review_criterion,
        "review_date": review_date,
        "owner": owner,
        "non_goals": non_goals,
    }

bet = formalize_bet(
    vague_statement="we want to become AI-driven",
    capability="GenAI-based customer interaction platform",
    review_criterion="40% of customer inquiries automated",
    review_date="2028-Q4",
    owner="Head of Platform Engineering",
    non_goals=["We will not build our own foundation model", "We will not replace human agents for complex cases"],
)
print(bet)
~~~

Erwartete Beobachtung: Die vage Absicht wird in eine konkrete, überprüfbare Wette mit Kriterium, Datum, Verantwortlichem und expliziten Nichtzielen überführt. Auswertung: Ohne diese Konkretisierung hätte das Unternehmen keine Möglichkeit gehabt, nach drei Jahren tatsächlich zu bewerten, ob die Strategie erfolgreich war.

## Dependencies, Cross-References und Quellen

1. Martin Reeves, Knut Haanæs, Janmejaya Sinha: [Your Strategy Needs a Strategy](https://www.hbs.edu/), abgerufen 2026-09-18.
2. A.G. Lafley, Roger Martin: [Playing to Win — How Strategy Really Works](https://www.harvardbusiness.org/), abgerufen 2026-09-18.

Dieses Kapitel baut auf der in KB-0594 (Capability Mapping) beschriebenen Fähigkeitszuordnung und der in KB-0685 (Trade-off-Narrative) beschriebenen Unsicherheitsdarstellung auf.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte Szenarioanalyse zur Simulation unterschiedlicher strategischer Wettenausgänge basierend auf historischen Markt- und Technologiedaten | Emerging | Bei künftigen, umfangreichen Strategiezyklen als Ergänzung evaluieren, jedoch die finale strategische Entscheidung weiterhin durch die Führungsebene mit menschlichem Urteilsvermögen treffen lassen. |

Ein Team akzeptiert eine Technologiestrategie erst, wenn strategische Wetten überprüfbare Kriterien haben, Nichtziele explizit benannt sind und jede Wette einen konkreten Verantwortlichen besitzt.
