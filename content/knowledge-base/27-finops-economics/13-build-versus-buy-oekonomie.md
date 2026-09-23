---
{"id": "KB-0647", "title": "Build-versus-Buy-Ökonomie", "domain": "27", "sequence": 13, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "PLATFORM", "GENAI", "CHIEF"], "requires": [{"id": "KB-0646", "concepts": ["Total Cost of Ownership"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eigenbau, Produktkauf und Managed Services für eine konkrete Funktion anhand der bereits in KB-0646 behandelten TCO-Methodik finanziell vergleichen und Sensitivitätsanalysen für zentrale Kostenannahmen durchführen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Differenzierungspotenzial (rechtfertigt der Eigenbau tatsächlich einen wettbewerbsrelevanten Vorteil) als zentrales, nicht rein finanzielles Kriterium in die Build-versus-Buy-Entscheidung einfließt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Build-versus-Buy-Entscheidung ausschließlich anhand kurzfristiger Kosten getroffen wird, ohne Wartungs-, Lizenzierungs- und Exit-Kosten über die gesamte Nutzungsdauer zu berücksichtigen, und die daraus resultierende, unvollständige Bewertung von einer tatsächlich fundierten Entscheidung unterscheiden können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Build-versus-Buy-Entscheidungen festlegen, die Differenzierungspotenzial, vollständige TCO und Sensitivitätsanalysen verbindlich zur Entscheidungsgrundlage machen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, finanzmathematische Sensitivitätsanalyse-Methodik im Detail ist Vertiefung.", "rationale": "Kern ist die Verbindung von Differenzierungspotenzial mit vollständiger TCO und Sensitivitätsprüfung, nicht die finanzmathematische Detailmethodik der Sensitivitätsanalyse selbst."}}, "lab_validation": [{"lab_id": "KB-0647-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Sensitivitätsanalyse einer Build-versus-Buy-Entscheidung gegenüber unsicheren Kostenannahmen, kein produktives Entscheidungs-Tool verwendet", "evidence": "Ein lokales Skript variiert zentrale Kostenannahmen (etwa Personalkosten oder Lizenzpreisentwicklung) einer Build-versus-Buy-Berechnung und zeigt, ob die ursprünglich favorisierte Option auch bei plausibel abweichenden Annahmen tatsächlich weiterhin die wirtschaftlich günstigere bleibt.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Entscheidungs-Tool."}]}
---
# Build-versus-Buy-Ökonomie

> **Ziel:** Build-versus-Buy-Ökonomie vergleicht Eigenbau, Produktkauf und Managed Services für eine konkrete Funktion finanziell, aufbauend auf der bereits in [KB-0646](12-total-cost-of-ownership.md) behandelten, vollständigen TCO-Methodik (einschließlich Wartungs-, Lizenzierungs- und Exit-Kosten, nicht nur initialer Kosten). Der zentrale Punkt dieses Kapitels ist, dass diese Entscheidung nicht rein finanziell getroffen werden sollte, sondern explizit das **Differenzierungspotenzial** einer Funktion berücksichtigen muss — rechtfertigt ein Eigenbau tatsächlich einen wettbewerbsrelevanten, strategischen Vorteil, der den zusätzlichen Aufwand gegenüber einer zugekauften Lösung tatsächlich rechtfertigt, oder handelt es sich um eine undifferenzierte, für den Wettbewerbsvorteil irrelevante Funktion, für die ein Kauf oder Managed Service wirtschaftlich sinnvoller ist. Eine reine Kostenbetrachtung ohne diese strategische Einordnung kann zu einer finanziell scheinbar günstigen, aber strategisch fehlgeleiteten Entscheidung führen.

## Zweck, Mental Model und Dependencies

Das Differenzierungspotenzial ist das entscheidende, oft übersehene Kriterium, das eine reine Kostenbetrachtung ergänzen muss: Eine Funktion, die tatsächlich einen wettbewerbsrelevanten, strategischen Unterschied zu Mitbewerbern erzeugt (etwa ein proprietärer Algorithmus, der tatsächlich die Kernkompetenz eines Produkts darstellt), rechtfertigt typischerweise den zusätzlichen Aufwand eines Eigenbaus, da eine zugekaufte, standardisierte Lösung diese strategische Differenzierung nicht bieten kann — dieselbe Funktion tatsächlich intern zu entwickeln, ermöglicht eine Kontrolle und Anpassungsfähigkeit, die für den tatsächlichen, geschäftlichen Wettbewerbsvorteil entscheidend ist. Eine Funktion, die dagegen keine tatsächliche, strategische Differenzierung erzeugt (etwa eine Standardfunktion wie Authentifizierung oder Zahlungsabwicklung, die für praktisch jede Organisation gleichermaßen benötigt wird, ohne einen tatsächlichen Wettbewerbsvorteil zu erzeugen), sollte typischerweise gekauft oder als Managed Service bezogen werden, da der zusätzliche Aufwand eines Eigenbaus für eine solche, undifferenzierte Funktion wirtschaftlich nicht gerechtfertigt ist, selbst wenn ein Eigenbau technisch möglich wäre. Die vollständige TCO-Betrachtung (siehe [KB-0646](12-total-cost-of-ownership.md)) ist für Build-versus-Buy-Entscheidungen besonders bedeutsam, da die drei Optionen strukturell unterschiedliche Kostenprofile über die Zeit haben: Ein Eigenbau hat typischerweise höhere initiale Entwicklungskosten, aber potenziell geringere laufende Lizenzkosten; ein Produktkauf hat geringere initiale Kosten, aber laufende Lizenzkosten und begrenzte Anpassungsfähigkeit; ein Managed Service hat die geringsten initialen Kosten, aber laufende, nutzungsabhängige Kosten und die geringste Kontrolle. Die Sensitivitätsanalyse ist der methodisch entscheidende, abschließende Schritt: Eine Build-versus-Buy-Entscheidung, die auf einer einzelnen, angenommenen Kostenschätzung basiert, sollte explizit geprüft werden, ob sie auch bei plausibel abweichenden Annahmen (etwa höhere tatsächliche Personalkosten für den Eigenbau, oder eine tatsächlich stärkere Lizenzpreissteigerung des zugekauften Produkts über die Zeit) weiterhin die wirtschaftlich günstigere Option bleibt — eine Entscheidung, die nur unter der ursprünglichen, optimistischen Annahme vorteilhaft erscheint, aber bei plausibel abweichenden Annahmen kippt, ist tatsächlich eine risikoreiche, nicht robuste Entscheidung.

~~~text
Build-vs-buy economics: financially compares build, buy, managed service for a concrete
  function, building on KB-0646's complete TCO methodology (incl. maintenance/licensing/
  exit costs, not just initial costs)
KEY POINT: decision should NOT be purely financial, must explicitly consider DIFFERENTIATION
  POTENTIAL of a function -- does building it actually justify a competitively-relevant,
  strategic advantage that ACTUALLY justifies additional effort vs bought solution
  or is it an undifferentiated function irrelevant to competitive advantage, for which
  buying/managed service is economically more sensible
  pure cost view w/o this strategic classification -> can lead to financially seemingly
  cheap but strategically misguided decision
DIFFERENTIATION POTENTIAL = decisive, often-overlooked criterion complementing pure cost view
  function ACTUALLY creating competitively-relevant, strategic difference from competitors
  (proprietary algorithm actually representing core product competency)
  typically justifies additional build effort, since bought, standardized solution CANNOT
  offer this strategic differentiation
  actually developing this function internally enables control+adaptability decisive for
  actual, business competitive advantage
function w/o actual, strategic differentiation (standard function like authentication or
  payment processing, needed practically equally by every org, w/o creating actual
  competitive advantage)
  should typically be bought/managed-service-sourced, since additional build effort for such
  undifferentiated function is economically NOT justified, even if technically possible
COMPLETE TCO view (KB-0646) especially significant for build-vs-buy, since the three options
  have structurally DIFFERENT cost profiles over time
  build: typically higher initial dev cost, potentially lower ongoing license cost
  buy: lower initial cost, ongoing license cost, limited adaptability
  managed service: lowest initial cost, ongoing usage-dependent cost, least control
SENSITIVITY ANALYSIS = methodically decisive, final step
  build-vs-buy decision based on single, assumed cost estimate
  should explicitly check whether it remains economically preferable option even under
  plausibly-deviating assumptions
  (higher actual personnel cost for build, or actually stronger license price increase of
  bought product over time)
  decision advantageous only under original, optimistic assumption but flipping under
  plausibly-deviating assumptions = actually risky, non-robust decision
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Differenzierungspotenzial | bewertet tatsächlichen, strategischen Wettbewerbsvorteil | primäres, nicht rein finanzielles Entscheidungskriterium |
| Vollständige TCO über die Zeit | erfasst unterschiedliche Kostenprofile von Build/Buy/Managed | Grundlage für fairen Kostenvergleich |
| Exit-Kosten | Kosten eines späteren Wechsels von der gewählten Option | oft übersehener Bestandteil der Gesamtbetrachtung |
| Sensitivitätsanalyse | prüft Robustheit der Entscheidung gegen abweichende Annahmen | verhindert riskante, nicht robuste Entscheidung |

Implementierung: Jede Funktion wird explizit auf ihr tatsächliches Differenzierungspotenzial geprüft, bevor eine Build-versus-Buy-Entscheidung finanziell bewertet wird. Die vollständige TCO über die gesamte Nutzungsdauer wird für alle drei Optionen (Eigenbau, Kauf, Managed Service) berechnet, einschließlich Exit-Kosten. Eine Sensitivitätsanalyse prüft, ob die favorisierte Option auch unter plausibel abweichenden Kostenannahmen wirtschaftlich vorteilhaft bleibt.

## Scalability, Reliability, Security und Observability

Build-versus-Buy-Ökonomie skaliert die tatsächliche, strategische und wirtschaftliche Angemessenheit von Entscheidungen proportional zur Verbindung von Differenzierungspotenzial mit vollständiger TCO und Sensitivitätsprüfung; die Reliability-Grenze liegt darin, dass eine rein finanzielle, nicht sensitivitätsgeprüfte Entscheidung bei abweichenden, tatsächlichen Kostenentwicklungen kippen und sich nachträglich als Fehlentscheidung erweisen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine undifferenzierte Standardfunktion wurde mit erheblichem, internem Entwicklungsaufwand selbst gebaut | das tatsächliche Differenzierungspotenzial wurde vor der Entscheidung nicht geprüft | das Differenzierungspotenzial künftiger Build-Entscheidungen explizit bewerten, bevor Eigenbau gerechtfertigt wird |
| eine ursprünglich als günstiger bewertete Build-Option erweist sich tatsächlich als teurer | die ursprüngliche Kostenschätzung war eine einzelne, nicht sensitivitätsgeprüfte Annahme | eine Sensitivitätsanalyse für künftige Entscheidungen gegen plausibel abweichende Kostenannahmen durchführen |
| ein Wechsel von einer zugekauften Lösung zu einer Alternative verursacht unerwartet hohe Kosten | Exit-Kosten wurden bei der ursprünglichen Build-versus-Buy-Entscheidung nicht berücksichtigt | Exit-Kosten explizit als Bestandteil künftiger TCO-Vergleiche einbeziehen |

Security: Bei sicherheitskritischen Funktionen kann ein Eigenbau zusätzliche, spezialisierte Sicherheitsexpertise erfordern, die in die TCO-Betrachtung einbezogen werden sollte. Observability: Die tatsächliche Übereinstimmung zwischen ursprünglicher Build-versus-Buy-Kostenschätzung und tatsächlich angefallenen Gesamtkosten über die Zeit ist ein zentrales Signal zur Bewertung der Entscheidungsqualität.

## Trade-offs und Entscheidungen

**Staff** bewertet eine gegebene Build-versus-Buy-Entscheidung korrekt anhand vollständiger TCO und Differenzierungspotenzial. **Principal** entwirft die vollständige Build-versus-Buy-Bewertungsmethodik mit Sensitivitätsanalyse für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für Build-versus-Buy-Entscheidungen fest, die Differenzierungspotenzial und vollständige TCO verbindlich zur Entscheidungsgrundlage machen.

Anti-Patterns: eine Build-versus-Buy-Entscheidung ausschließlich anhand initialer Kosten treffen, ohne Wartungs-, Lizenzierungs- und Exit-Kosten über die Nutzungsdauer zu berücksichtigen; eine undifferenzierte Standardfunktion ohne strategische Rechtfertigung selbst entwickeln; eine Entscheidung ohne Sensitivitätsprüfung gegen abweichende Kostenannahmen treffen.

## Production Checklist

- [ ] Das tatsächliche Differenzierungspotenzial einer Funktion ist vor der Build-versus-Buy-Entscheidung explizit bewertet.
- [ ] Die vollständige TCO (einschließlich Wartung, Lizenzierung, Exit-Kosten) ist für alle drei Optionen berechnet.
- [ ] Eine Sensitivitätsanalyse prüft die Robustheit der Entscheidung gegen plausibel abweichende Kostenannahmen.
- [ ] Exit-Kosten sind explizit als Bestandteil des TCO-Vergleichs einbezogen.

## Interviewfragen

### 1. Warum sollte eine Build-versus-Buy-Entscheidung nicht rein finanziell getroffen werden?

**Antwort:** Weil das tatsächliche Differenzierungspotenzial einer Funktion berücksichtigt werden muss — eine strategisch differenzierende Funktion kann einen Eigenbau rechtfertigen, selbst wenn er finanziell teurer erscheint, während eine undifferenzierte Funktion typischerweise gekauft werden sollte.

### 2. Warum rechtfertigt eine strategisch differenzierende Funktion typischerweise einen Eigenbau?

**Antwort:** Weil eine zugekaufte, standardisierte Lösung diese strategische Differenzierung nicht bieten kann, während ein Eigenbau die für den tatsächlichen Wettbewerbsvorteil notwendige Kontrolle und Anpassungsfähigkeit ermöglicht.

### 3. Warum ist die vollständige TCO-Betrachtung für Build-versus-Buy-Entscheidungen besonders bedeutsam?

**Antwort:** Weil Eigenbau, Kauf und Managed Service strukturell unterschiedliche Kostenprofile über die Zeit haben (unterschiedliche initiale Kosten gegenüber laufenden Kosten), die nur eine vollständige TCO-Betrachtung fair vergleichbar macht.

### 4. Wofür dient eine Sensitivitätsanalyse bei Build-versus-Buy-Entscheidungen?

**Antwort:** Sie prüft, ob die favorisierte Option auch bei plausibel abweichenden Kostenannahmen weiterhin wirtschaftlich vorteilhaft bleibt, statt sich auf eine einzelne, möglicherweise zu optimistische Kostenschätzung zu verlassen.

### 5. Wie gehst du vor, wenn eine undifferenzierte Standardfunktion mit erheblichem, internem Entwicklungsaufwand selbst gebaut wurde?

**Antwort:** Ich prüfe, ob das tatsächliche Differenzierungspotenzial dieser Funktion vor der Entscheidung bewertet wurde, und stelle sicher, dass künftige Entscheidungen dieses Kriterium explizit berücksichtigen.

### 6. Widersprüchliche Anforderung: Das Engineering-Team will eine Funktion aus technischem Interesse selbst entwickeln UND die Organisation will nur strategisch differenzierende Funktionen selbst bauen — wie gehst du vor?

**Antwort:** Ich würde das tatsächliche Differenzierungspotenzial der Funktion explizit gegen verfügbare, zugekaufte Alternativen bewerten und die Entscheidung anhand dieser strategischen Einordnung statt reinem technischem Interesse treffen, um sicherzustellen, dass Entwicklungsressourcen auf tatsächlich wettbewerbsrelevante Funktionen konzentriert werden.

## Praktische Labs

~~~python
# Local, deterministic simulation of sensitivity analysis for a build-vs-buy decision (executed locally, no real decision tool):

def build_vs_buy_tco(option, personnel_cost_multiplier=1.0, license_increase_multiplier=1.0):
    if option == "build":
        return 200000 * personnel_cost_multiplier + 50000  # dev cost scales with personnel assumption
    else:  # buy
        return 80000 + 60000 * license_increase_multiplier  # license cost scales with price increase assumption

print("baseline:", build_vs_buy_tco("build"), "vs", build_vs_buy_tco("buy"))
print("higher personnel cost + higher license increase:",
      build_vs_buy_tco("build", personnel_cost_multiplier=1.3),
      "vs", build_vs_buy_tco("buy", license_increase_multiplier=1.5))
~~~

## Dependencies, Cross-References und Quellen

1. Harvard Business Review (referenced framework): [When to Build, Buy, or Partner for New Capabilities](https://hbr.org/2022/09/when-to-build-buy-or-partner-for-new-capabilities), abgerufen 2026-09-18.
2. FinOps Foundation: [Build vs Buy Economic Considerations](https://www.finops.org/framework/capabilities/unit-economics/), abgerufen 2026-09-18.

Total Cost of Ownership ist kanonisch in [KB-0646](12-total-cost-of-ownership.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Neubewertung getroffener Build-versus-Buy-Entscheidungen anhand aktualisierter Kostenannahmen und veränderten Differenzierungspotenzials | Evaluating | Als periodisches Überprüfungswerkzeug einführen, jedoch die abschließende Neubewertungsentscheidung weiterhin als bewusste, strategische Entscheidung statt automatisierten Wechsel behandeln. |

Ein Team akzeptiert eine Build-versus-Buy-Entscheidung erst, wenn Differenzierungspotenzial, vollständige TCO und eine Sensitivitätsanalyse gegen abweichende Annahmen nachweislich einbezogen wurden.
