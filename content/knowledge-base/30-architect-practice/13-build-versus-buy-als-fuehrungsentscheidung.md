---
{"id": "KB-0689", "title": "Build-versus-Buy als Führungsentscheidung", "domain": "30", "sequence": 13, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0647", "concepts": ["Build-versus-Buy-Ökonomie"], "needed_for": "Dieses Kapitel referenziert die in KB-0647 behandelte ökonomische Modellierung und ergänzt die Führungsdimension der Entscheidung"}], "related": ["KB-0688"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für eine gegebene Build-versus-Buy-Entscheidung Differenzierung, Lieferfähigkeit und Kontrollbedarf verhandeln und daraus tatsächliche organisatorische Folgelasten explizit ableiten können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine komplexe Build-versus-Buy-Entscheidung mehrere Optionen anhand von Differenzierung, Lieferfähigkeit und Kontrollbedarf gegenüberstellen und die jeweiligen organisatorischen Folgelasten transparent machen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Build-versus-Buy-Entscheidung ausschließlich anhand kurzfristiger Kosten getroffen wird, ohne die tatsächlichen, langfristigen organisatorischen Folgelasten zu berücksichtigen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Eine unternehmensweite Build-versus-Buy-Entscheidung unter Berücksichtigung von Differenzierung, Lieferfähigkeit, Kontrollbedarf und organisatorischen Folgelasten treffen und verantworten.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, quantitative TCO-Modellierung im Detail ist Vertiefung und wird als etabliert referenziert (siehe KB-0647).", "rationale": "Kern ist die Führungsdimension der Entscheidung (Differenzierung, Kontrollbedarf, Folgelasten), nicht die quantitative Kostenmodellierung selbst."}}, "lab_validation": [{"lab_id": "KB-0689-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung organisatorischer Folgelasten einer Build-Entscheidung, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie eine Build-Entscheidung, die nur anhand kurzfristiger Kosten getroffen wird, tatsächliche, langfristige organisatorische Folgelasten (Wartungspersonal, Wissenserhalt) unterschätzt, die eine reine Kostenrechnung nicht abbildet.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# Build-versus-Buy als Führungsentscheidung

> **Ziel:** Dieses Kapitel referenziert die in KB-0647 behandelte, ökonomische Modellierung von Build-versus-Buy (Total Cost of Ownership, Sensitivitätsanalyse) als bereits etabliert und konzentriert sich auf die Führungsdimension der Entscheidung: **Differenzierung** (baut das Unternehmen tatsächlich etwas, das es tatsächlich vom Wettbewerb unterscheidet, oder handelt es sich um eine Commodity-Funktion, die tatsächlich besser eingekauft wird), **Lieferfähigkeit** (kann die Organisation eine Eigenentwicklung tatsächlich in angemessener Zeit und Qualität liefern) und **Kontrollbedarf** (wie wichtig ist tatsächlich die vollständige Kontrolle über die Funktionalität, etwa aus regulatorischen oder strategischen Gründen). Der zentrale Punkt dieses Kapitels ist, dass die tatsächlichen organisatorischen Folgelasten einer Entscheidung explizit gemacht werden müssen — eine Build-Entscheidung, die nur anhand kurzfristiger Entwicklungskosten bewertet wird, unterschätzt tatsächlich häufig die langfristige Last (Wartungspersonal, Wissenserhalt bei Mitarbeiterfluktuation, technische Schuld), die eine reine Kostenrechnung tatsächlich nicht vollständig abbildet.

## Zweck, Mental Model und Dependencies

Differenzierung zu bewerten bedeutet, tatsächlich zu prüfen, ob die betrachtete Funktionalität tatsächlich zur angestrebten Wettbewerbsdifferenzierung des Unternehmens beiträgt (siehe KB-0686, Technologiestrategie) — eine Funktionalität, die tatsächlich eine Commodity ist (etwa eine Standard-Authentifizierungslösung), die kein Unternehmen der Branche tatsächlich als Unterscheidungsmerkmal nutzt, sollte tatsächlich eher eingekauft werden, während eine Funktionalität, die tatsächlich den Kern der angestrebten Differenzierung bildet, tatsächlich eher selbst entwickelt werden sollte, um volle Kontrolle über die Weiterentwicklung zu behalten. Lieferfähigkeit zu bewerten bedeutet, tatsächlich ehrlich einzuschätzen, ob die eigene Organisation eine Eigenentwicklung tatsächlich in angemessener Zeit und Qualität liefern kann — eine Organisation ohne tatsächlich ausreichende Kapazität oder Erfahrung in einem spezifischen technischen Bereich riskiert tatsächlich, eine Build-Entscheidung zu treffen, die zu einer langwierigen, qualitativ mangelhaften Eigenentwicklung führt, während eine etablierte, im Markt verfügbare Lösung tatsächlich schneller und zuverlässiger verfügbar wäre. Kontrollbedarf zu bewerten bedeutet, tatsächlich zu klären, wie wichtig vollständige Kontrolle über die Funktionalität ist — etwa aus regulatorischen Gründen (eine Aufsichtsbehörde verlangt tatsächlich vollständige Nachvollziehbarkeit einer Kernfunktion) oder aus strategischen Gründen (eine Abhängigkeit von einem externen Anbieter für eine kritische Funktion stellt tatsächlich ein Risiko dar) — dieser Kontrollbedarf kann eine Build-Entscheidung tatsächlich rechtfertigen, selbst wenn eine reine Kostenrechnung für Buy spricht. Organisatorische Folgelasten explizit zu machen bedeutet, tatsächlich über die initiale Entwicklungskostenschätzung hinauszudenken — eine Eigenentwicklung erfordert tatsächlich dauerhaftes Wartungspersonal, das tatsächliche Wissen über die Eigenentwicklung geht tatsächlich verloren, wenn Schlüsselmitarbeiter das Unternehmen verlassen, und eine über Jahre gewachsene Eigenentwicklung sammelt tatsächlich technische Schuld an, die eine reine, einmalige Kostenrechnung zum Entscheidungszeitpunkt tatsächlich nicht abbildet; diese Folgelasten müssen tatsächlich explizit in die Entscheidung einfließen, nicht nur implizit als Betriebsrisiko akzeptiert werden.

~~~text
This chapter references KB-0647's economic modeling of build-vs-buy (TCO, sensitivity
  analysis) as already established, focuses on leadership dimension of decision
  DIFFERENTIATION: does org ACTUALLY build something ACTUALLY distinguishing it from
  competition, or is it commodity function ACTUALLY better bought
  DELIVERY CAPABILITY: can org ACTUALLY deliver in-house dev in appropriate time+quality
  CONTROL NEED: how ACTUALLY important is full control over functionality (regulatory,
  strategic reasons)
KEY POINT: actual organizational follow-on burdens of a decision must be made explicit --
  build decision evaluated only via short-term dev costs ACTUALLY frequently
  underestimates long-term burden (maintenance staff, knowledge retention on employee
  turnover, technical debt) a pure cost calc ACTUALLY doesn't fully capture
ASSESSING DIFFERENTIATION means ACTUALLY checking whether considered functionality
  ACTUALLY contributes to org's intended competitive differentiation (see KB-0686,
  Technology Strategy) -- functionality that's ACTUALLY commodity (standard auth
  solution) no industry org ACTUALLY uses as differentiator should ACTUALLY rather be
  bought, while functionality ACTUALLY core to intended differentiation should ACTUALLY
  rather be built in-house to keep full control over further development
ASSESSING DELIVERY CAPABILITY means ACTUALLY honestly assessing whether own org can
  ACTUALLY deliver in-house dev in appropriate time+quality -- org w/o ACTUALLY
  sufficient capacity/experience in specific technical area ACTUALLY risks making a
  build decision leading to prolonged, qualitatively deficient in-house dev, while
  established, market-available solution would ACTUALLY be faster+more reliably
  available
ASSESSING CONTROL NEED means ACTUALLY clarifying how important full control over
  functionality is -- regulatory reasons (regulator ACTUALLY demands full traceability
  of a core function) or strategic reasons (dependency on external vendor for critical
  function is ACTUALLY a risk) -- this control need CAN ACTUALLY justify a build
  decision even when pure cost calc favors buy
MAKING ORGANIZATIONAL FOLLOW-ON BURDENS EXPLICIT means ACTUALLY thinking beyond initial
  dev cost estimate -- in-house dev ACTUALLY requires permanent maintenance staff,
  ACTUAL knowledge about in-house dev ACTUALLY gets lost when key employees leave, and
  in-house dev grown over years ACTUALLY accumulates technical debt a pure, one-time
  cost calc at decision time ACTUALLY doesn't capture -- these follow-on burdens must
  ACTUALLY explicitly feed into decision, not just be implicitly accepted as operational
  risk
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Differenzierungsbewertung | prüft Bezug zur strategischen Wettbewerbsdifferenzierung | Commodity-Funktionalität eher kaufen, differenzierende eher bauen |
| Lieferfähigkeitseinschätzung | ehrliche Bewertung eigener Umsetzungskapazität | verhindert langwierige, qualitativ mangelhafte Eigenentwicklung |
| Kontrollbedarfsbewertung | regulatorische/strategische Notwendigkeit voller Kontrolle | kann Build-Entscheidung trotz ungünstiger reiner Kostenrechnung rechtfertigen |
| Explizite organisatorische Folgelasten | Wartungspersonal, Wissenserhalt, technische Schuld | verhindert Unterschätzung langfristiger Last durch reine Einmalkostenrechnung |

Implementierung: Jede Build-versus-Buy-Entscheidung wird explizit gegen Differenzierung, Lieferfähigkeit und Kontrollbedarf bewertet. Organisatorische Folgelasten (Wartungspersonal, Wissenserhaltungsrisiko, technische Schuld) werden explizit dokumentiert und in die Entscheidung einbezogen, nicht nur die initiale Kostenschätzung.

## Scalability, Reliability, Security und Observability

Eine Build-versus-Buy-Führungspraxis skaliert über die Anzahl der parallel zu treffenden Entscheidungen in einem Unternehmen; die Reliability-Grenze liegt darin, dass eine ausschließlich kostenbasierte Entscheidung die tatsächlichen, langfristigen organisatorischen Folgelasten unterschätzt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Eigenentwicklung erfordert langfristig deutlich mehr Wartungsaufwand als ursprünglich geplant | die organisatorischen Folgelasten wurden bei der Entscheidung nicht explizit berücksichtigt | künftige Build-Entscheidungen explizit um eine Folgelastenbewertung ergänzen |
| eine strategisch wichtige Funktionalität wurde eingekauft, obwohl sie tatsächlich zur Kerndifferenzierung gehört | die Differenzierungsbewertung wurde nicht durchgeführt oder ignoriert | die Entscheidung rückwirkend gegen die tatsächliche strategische Differenzierung neu bewerten |
| eine Eigenentwicklung verzögert sich erheblich gegenüber dem ursprünglichen Zeitplan | die tatsächliche Lieferfähigkeit der Organisation wurde vor der Entscheidung überschätzt | für künftige Entscheidungen eine ehrlichere, evidenzbasierte Lieferfähigkeitseinschätzung durchführen |

Security: Bei Kontrollbedarf aus regulatorischen Gründen sollte die Build-Entscheidung explizit gegen die tatsächlichen regulatorischen Anforderungen dokumentiert werden. Observability: Die tatsächlich entstandenen Wartungskosten und Wissenserhaltungsvorfälle nach einer Build-Entscheidung sind ein zentrales Signal zur Bewertung, ob die Folgelasten korrekt eingeschätzt wurden.

## Trade-offs und Entscheidungen

**Staff** liefert für eine begrenzte Funktionalität eine ehrliche Lieferfähigkeitseinschätzung. **Principal** entwirft die vollständige Build-versus-Buy-Bewertung mit Differenzierung, Kontrollbedarf und Folgelasten für ein komplexes Vorhaben. **Chief** trifft und verantwortet die unternehmensweite Build-versus-Buy-Entscheidung unter Berücksichtigung aller vier Dimensionen.

Anti-Patterns: eine Build-versus-Buy-Entscheidung ausschließlich anhand kurzfristiger Entwicklungskosten treffen; eine Commodity-Funktionalität ohne Differenzierungsbezug selbst entwickeln; organisatorische Folgelasten implizit als Betriebsrisiko akzeptieren statt explizit in die Entscheidung einzubeziehen.

## Production Checklist

- [ ] Die Entscheidung ist explizit gegen Differenzierung, Lieferfähigkeit und Kontrollbedarf bewertet.
- [ ] Organisatorische Folgelasten (Wartungspersonal, Wissenserhaltungsrisiko, technische Schuld) sind explizit dokumentiert.
- [ ] Die zugrunde liegende ökonomische Modellierung (siehe KB-0647) ist referenziert und einbezogen.
- [ ] Die Entscheidung ist einem konkret verantwortlichen Entscheidungsträger zugeordnet.

## Interviewfragen

### 1. Warum sollte eine Commodity-Funktionalität eher eingekauft als selbst entwickelt werden?

**Antwort:** Weil sie tatsächlich nicht zur angestrebten Wettbewerbsdifferenzierung beiträgt und die Entwicklungsressourcen für tatsächlich differenzierende Funktionalität besser eingesetzt werden.

### 2. Warum kann eine hohe Kontrollnotwendigkeit eine Build-Entscheidung rechtfertigen, obwohl eine reine Kostenrechnung für Buy spricht?

**Antwort:** Weil regulatorische Anforderungen oder strategische Abhängigkeitsrisiken tatsächlich vollständige Kontrolle erfordern können, die eine eingekaufte Lösung nicht bietet.

### 3. Welche organisatorischen Folgelasten werden bei einer reinen, initialen Kostenschätzung häufig unterschätzt?

**Antwort:** Dauerhafter Wartungsaufwand, das Risiko des Wissensverlusts bei Mitarbeiterfluktuation und die über Zeit anwachsende technische Schuld einer Eigenentwicklung.

### 4. Warum ist eine ehrliche Lieferfähigkeitseinschätzung vor einer Build-Entscheidung wichtig?

**Antwort:** Weil eine Organisation ohne tatsächlich ausreichende Kapazität oder Erfahrung riskiert, eine langwierige, qualitativ mangelhafte Eigenentwicklung zu produzieren, statt eine schneller verfügbare, etablierte Lösung zu nutzen.

### 5. Wie gehst du vor, wenn eine Eigenentwicklung langfristig deutlich mehr Wartungsaufwand erfordert als ursprünglich geplant?

**Antwort:** Ich prüfe, ob die organisatorischen Folgelasten bei der ursprünglichen Entscheidung explizit berücksichtigt wurden, und ergänze künftige Build-Entscheidungen um eine systematische Folgelastenbewertung.

### 6. Widersprüchliche Anforderung: Das Entwicklungsteam will aus technischem Interesse eine Eigenentwicklung UND die Organisation will minimale langfristige Betriebslast — wie gehst du vor?

**Antwort:** Ich würde die Entscheidung explizit gegen Differenzierung und Kontrollbedarf statt gegen technisches Interesse allein prüfen und die tatsächlichen, langfristigen Folgelasten transparent gegenüberstellen, sodass die Entscheidung auf Basis der tatsächlichen strategischen Relevanz statt technischer Präferenz getroffen wird.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Unternehmen erwägt, eine eigene Authentifizierungslösung statt eines etablierten Identity-Providers zu entwickeln (angelehnt an Domain 23, Security/Identity), mit der Begründung, dies könne kurzfristig günstiger sein.

~~~python
# Local, deterministic illustration of a build-vs-buy leadership evaluation beyond pure cost (fictional lab example, no real organization):

def evaluate_build_vs_buy(is_differentiating, delivery_capability_sufficient, control_need_high, initial_cost_favors_build):
    if is_differentiating and control_need_high:
        return "build (strategic differentiation + control need outweigh pure cost)"
    if not delivery_capability_sufficient:
        return "buy (delivery capability risk too high, regardless of cost)"
    if initial_cost_favors_build and not is_differentiating:
        return "buy (commodity functionality, cost advantage insufficient justification)"
    return "buy (default without strong build justification)"

result = evaluate_build_vs_buy(
    is_differentiating=False,
    delivery_capability_sufficient=True,
    control_need_high=False,
    initial_cost_favors_build=True,
)
print(result)
~~~

Erwartete Beobachtung: Trotz kurzfristigem Kostenvorteil empfiehlt die Bewertung Buy, da Authentifizierung als Commodity-Funktionalität ohne Differenzierungsbezug eingestuft wird. Auswertung: Eine rein kostenbasierte Entscheidung hätte die fehlende strategische Rechtfertigung für eine Eigenentwicklung übersehen und die langfristigen Wartungsfolgelasten unterschätzt.

## Dependencies, Cross-References und Quellen

1. Geoffrey Moore: [Dealing with Darwin — Core vs. Context](https://www.geoffreyamoore.com/), abgerufen 2026-09-18.
2. Harvard Business School: [Make-or-Buy Decisions — Transaction Cost Economics](https://www.hbs.edu/), abgerufen 2026-09-18.

Dieses Kapitel baut auf der in KB-0647 (Build-versus-Buy-Ökonomie) beschriebenen quantitativen Modellierung auf und ergänzt sie um die Führungsdimension.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte, automatisierte Schätzung organisatorischer Folgelasten (Wartungsaufwand, Wissensverlustrisiko) basierend auf historischen Projektdaten | Emerging | Bei künftigen, umfangreichen Build-Entscheidungen als Ergänzung evaluieren, jedoch die finale Bewertung von Differenzierung und Kontrollbedarf weiterhin durch menschliches, strategisches Urteilsvermögen treffen lassen. |

Ein Team akzeptiert eine Build-versus-Buy-Entscheidung erst, wenn Differenzierung, Lieferfähigkeit, Kontrollbedarf und organisatorische Folgelasten nachweislich explizit bewertet wurden.
