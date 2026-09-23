---
{"id": "KB-0692", "title": "PoCs und Erfolgskriterien", "domain": "30", "sequence": 16, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0610", "concepts": ["Erfolgskriterien und PoC-Governance"], "needed_for": "Dieses Kapitel konkretisiert die in KB-0610 beschriebene PoC-Governance auf die praktische Leitung einzelner PoC-Experimente"}, {"id": "KB-0678", "concepts": ["Messbare Qualitätsszenarien"], "needed_for": "PoC-Erfolgskriterien nutzen dieselbe Konkretisierungslogik wie die in KB-0678 beschriebenen NFR-Szenarien"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für ein gegebenes, unsicheres technisches Vorhaben einen begrenzten PoC mit Hypothese, Messwerten und Abbruchkriterien leiten und die Ergebnisse nachvollziehbar dokumentieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für einen komplexen PoC mehrere Hypothesen mit jeweiligen Messkriterien entwerfen und explizit benennen, welche Produktionsrisiken durch den PoC tatsächlich nicht geprüft wurden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein PoC ohne explizite Abbruchkriterien fortgeführt wird, obwohl die zugrunde liegende Hypothese tatsächlich bereits widerlegt ist.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für PoC-Governance festlegen, die explizite Erfolgskriterien, Abbruchkriterien und transparente Übergabe nicht geprüfter Produktionsrisiken vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, statistische Versuchsplanung (etwa A/B-Test-Methodik) im Detail ist Vertiefung.", "rationale": "Kern ist die praktische PoC-Leitung mit Hypothese und Abbruchkriterien, nicht die statistische Versuchsplanungsdetailtiefe."}}, "lab_validation": [{"lab_id": "KB-0692-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung eines PoCs mit Abbruchkriterium, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie ein PoC mit explizitem Abbruchkriterium korrekt beendet wird, sobald die zugrunde liegende Hypothese widerlegt ist, im Gegensatz zu einem PoC ohne solches Kriterium, der trotz widerlegter Hypothese fortgeführt wird.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# PoCs und Erfolgskriterien

> **Ziel:** Ein Proof of Concept (PoC) ist ein begrenztes Experiment, das eine konkrete **Hypothese** (eine tatsächlich überprüfbare Annahme über technische Machbarkeit oder Eignung, formuliert bevor das Experiment beginnt) anhand tatsächlich vorab definierter **Messwerte** prüft, mit expliziten **Abbruchkriterien** (Bedingungen, unter denen der PoC tatsächlich vorzeitig beendet wird, weil die Hypothese bereits widerlegt ist oder weitere Ressourcen tatsächlich nicht gerechtfertigt sind). Dieses Kapitel konkretisiert die in KB-0610 beschriebene PoC-Governance auf die praktische Leitung eines einzelnen PoCs. Der zentrale Punkt dieses Kapitels ist, dass die Ergebnisse eines PoCs zusammen mit den tatsächlich nicht geprüften Produktionsrisiken nachvollziehbar an Entscheider übergeben werden müssen — ein PoC, der unter kontrollierten, vereinfachten Bedingungen tatsächlich erfolgreich war, beweist tatsächlich nicht automatisch die Produktionsreife, und diese Grenze muss explizit kommuniziert werden, statt implizit einen vollständigen Produktionsnachweis vorzutäuschen.

## Zweck, Mental Model und Dependencies

Eine Hypothese vor Beginn des PoCs zu formulieren bedeutet, tatsächlich präzise zu benennen, was der PoC beweisen oder widerlegen soll — nicht "wir testen die neue Technologie", sondern "wir prüfen, ob die neue Technologie unter X Last tatsächlich eine Antwortzeit unter Y erreicht" — diese Präzisierung entspricht direkt dem in KB-0678 beschriebenen Prinzip messbarer Qualitätsszenarien, hier jedoch auf ein zeitlich begrenztes Experiment statt eine langfristige Architekturentscheidung angewendet. Messwerte vorab zu definieren bedeutet, tatsächlich festzulegen, wie die Hypothese gemessen wird, bevor das Experiment beginnt — eine nachträgliche Definition der Messwerte riskiert tatsächlich, dass die Kriterien unbewusst an das bereits beobachtete Ergebnis angepasst werden, was die Aussagekraft des PoCs tatsächlich untergräbt. Abbruchkriterien explizit zu definieren bedeutet, tatsächlich vorab festzulegen, unter welchen Bedingungen der PoC tatsächlich vorzeitig beendet wird — etwa wenn ein Zwischenergebnis die Hypothese bereits tatsächlich eindeutig widerlegt, oder wenn ein vorab festgelegtes Zeit- oder Ressourcenbudget tatsächlich aufgebraucht ist; ohne diese expliziten Kriterien besteht tatsächlich die Gefahr, dass ein PoC über die eigentlich sinnvolle Dauer hinaus fortgeführt wird, aus Sunk-Cost-Denken oder mangelnder klarer Entscheidungsgrundlage. Nicht geprüfte Produktionsrisiken transparent zu übergeben bedeutet, tatsächlich explizit zu benennen, was der PoC aufgrund seiner begrenzten, vereinfachten Bedingungen tatsächlich nicht geprüft hat — ein PoC, der unter Laborbedingungen mit synthetischen Daten erfolgreich war, hat tatsächlich nicht geprüft, wie das System unter echten Produktionsdaten, echter Skalierung oder echten Fehlerbedingungen verhält; diese Grenze muss explizit an die Entscheider übergeben werden, entsprechend dem in KB-0673 etablierten Prinzip, konzeptionelles Wissen von tatsächlich belegter, praktischer Erfahrung transparent zu trennen.

~~~text
Proof of Concept (PoC) = bounded experiment testing concrete HYPOTHESIS (ACTUALLY
  checkable assumption on technical feasibility/fitness, formulated before experiment
  starts) against ACTUALLY predefined METRICS, w/ explicit ABORT CRITERIA (conditions
  under which PoC ACTUALLY terminated early because hypothesis already refuted or
  further resources ACTUALLY not justified)
  this chapter concretizes KB-0610's PoC governance onto practical leadership of a
  single PoC
KEY POINT: PoC results must be handed to decision-makers together with ACTUALLY unchecked
  production risks, traceably -- PoC ACTUALLY successful under controlled, simplified
  conditions doesn't ACTUALLY automatically prove production readiness, this boundary
  must be explicitly communicated instead of implicitly faking complete production proof
FORMULATING HYPOTHESIS BEFORE PoC STARTS means ACTUALLY precisely naming what PoC should
  prove/disprove -- not "we're testing the new technology" but "we check whether new
  tech ACTUALLY achieves response time under Y at load X" -- directly corresponds to
  KB-0678's measurable quality scenario principle, here applied to a time-bounded
  experiment instead of a long-term architecture decision
PREDEFINING METRICS means ACTUALLY fixing how hypothesis is measured before experiment
  starts -- post-hoc metric definition ACTUALLY risks criteria unconsciously adapted to
  already-observed result, ACTUALLY undermining PoC's evidential value
EXPLICITLY DEFINING ABORT CRITERIA means ACTUALLY fixing in advance under what
  conditions PoC ACTUALLY terminated early -- intermediate result already ACTUALLY
  clearly refuting hypothesis, or predefined time/resource budget ACTUALLY exhausted --
  w/o these explicit criteria, ACTUAL danger PoC continues beyond actually sensible
  duration from sunk-cost thinking or lack of clear decision basis
TRANSPARENTLY HANDING OVER UNCHECKED PRODUCTION RISKS means ACTUALLY explicitly naming
  what PoC, due to its limited, simplified conditions, ACTUALLY didn't check -- PoC
  ACTUALLY successful under lab conditions w/ synthetic data ACTUALLY didn't check how
  system behaves under real production data, real scale, real failure conditions --
  this boundary must be explicitly handed to decision-makers, per KB-0673's principle of
  transparently separating conceptual knowledge from ACTUALLY evidenced, practical
  experience
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Vorab formulierte, präzise Hypothese | macht PoC tatsächlich beweis-/widerlegbar | entspricht Prinzip messbarer Qualitätsszenarien |
| Vorab definierte Messwerte | verhindert nachträgliche, ergebnisangepasste Kriterien | erhält Aussagekraft des Experiments |
| Explizite Abbruchkriterien | ermöglicht rechtzeitige Beendigung bei widerlegter Hypothese | verhindert Sunk-Cost-Fortführung |
| Transparente Produktionsrisiko-Übergabe | benennt tatsächlich ungeprüfte Bereiche | verhindert implizite Vortäuschung von Produktionsreife |

Implementierung: Vor Beginn des PoCs werden Hypothese, Messwerte und Abbruchkriterien explizit dokumentiert. Der PoC wird bei Erfüllung eines Abbruchkriteriums tatsächlich beendet. Das Ergebnisdokument benennt explizit, welche Produktionsrisiken durch den PoC tatsächlich nicht geprüft wurden.

## Scalability, Reliability, Security und Observability

Eine PoC-Praxis skaliert über die Anzahl der parallel durchgeführten Experimente; die Reliability-Grenze liegt darin, dass ein PoC ohne explizite Abbruchkriterien tatsächlich über die sinnvolle Dauer hinaus fortgeführt wird.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein PoC wird trotz eindeutig widerlegter Hypothese fortgeführt | kein explizites Abbruchkriterium wurde vorab definiert | für künftige PoCs verpflichtend explizite Abbruchkriterien vorab festlegen |
| ein nach PoC-Erfolg in Produktion überführtes System zeigt unerwartete Probleme | die im PoC ungeprüften Produktionsrisiken wurden nicht transparent an die Entscheider übergeben | künftige PoC-Ergebnisberichte um eine explizite Liste ungeprüfter Produktionsrisiken ergänzen |
| ein PoC wird als Erfolg gewertet, obwohl die Messkriterien unklar oder nachträglich angepasst wirken | Messwerte wurden nicht vor Beginn des Experiments definiert | für künftige PoCs Messwerte verpflichtend vor Experimentbeginn festlegen |

Security: PoCs mit Zugriff auf sensible oder produktionsnahe Daten sollten denselben Sicherheitsanforderungen wie Produktionssysteme unterliegen, auch wenn sie experimentellen Charakter haben. Observability: Die tatsächliche Rate von PoCs, die mit vorab definierten Hypothesen, Messwerten und Abbruchkriterien durchgeführt wurden, ist ein zentrales Signal zur Bewertung der PoC-Governance-Qualität.

## Trade-offs und Entscheidungen

**Staff** leitet einen begrenzten PoC mit klarer Hypothese und Messwerten. **Principal** entwirft die vollständige PoC-Struktur mit mehreren Hypothesen und expliziter Übergabe ungeprüfter Produktionsrisiken. **Chief** legt unternehmensweite Standards für PoC-Governance fest, die vorab definierte Erfolgs- und Abbruchkriterien verpflichtend vorschreiben.

Anti-Patterns: einen PoC ohne vorab formulierte, präzise Hypothese starten; Messwerte erst nach Beobachtung des Ergebnisses definieren; PoC-Erfolg implizit als vollständigen Produktionsnachweis darstellen, ohne ungeprüfte Risiken zu benennen.

## Production Checklist

- [ ] Die Hypothese ist vor PoC-Beginn präzise und überprüfbar formuliert.
- [ ] Messwerte sind vor Beginn des Experiments definiert.
- [ ] Explizite Abbruchkriterien sind vorab festgelegt.
- [ ] Das Ergebnisdokument benennt explizit die tatsächlich ungeprüften Produktionsrisiken.

## Interviewfragen

### 1. Warum muss die Hypothese eines PoCs vor Beginn des Experiments präzise formuliert werden?

**Antwort:** Damit der PoC tatsächlich beweis- oder widerlegbar ist, statt eine vage Absicht wie "wir testen die Technologie" zu verfolgen, die keine klare Erfolgsbewertung ermöglicht.

### 2. Warum sollten Messwerte vor Beginn des PoCs statt nachträglich definiert werden?

**Antwort:** Weil eine nachträgliche Definition riskiert, dass die Kriterien unbewusst an das bereits beobachtete Ergebnis angepasst werden, was die Aussagekraft des Experiments untergräbt.

### 3. Warum sind explizite Abbruchkriterien für einen PoC wichtig?

**Antwort:** Weil ohne diese Kriterien die Gefahr besteht, dass ein PoC aus Sunk-Cost-Denken über die eigentlich sinnvolle Dauer hinaus fortgeführt wird, selbst wenn die Hypothese bereits widerlegt ist.

### 4. Warum muss ein PoC-Erfolg zusammen mit ungeprüften Produktionsrisiken kommuniziert werden?

**Antwort:** Weil ein unter vereinfachten, kontrollierten Bedingungen erfolgreicher PoC nicht automatisch Produktionsreife beweist, und diese Grenze explizit an Entscheider übergeben werden muss.

### 5. Wie gehst du vor, wenn ein PoC trotz eindeutig widerlegter Hypothese fortgeführt wird?

**Antwort:** Ich prüfe, ob ein explizites Abbruchkriterium vorab definiert war, und führe für künftige PoCs verpflichtend explizite Abbruchkriterien ein.

### 6. Widersprüchliche Anforderung: Das Team ist technisch begeistert von einer neuen Technologie und möchte den PoC trotz negativer Zwischenergebnisse fortsetzen UND die Organisation will eine disziplinierte Ressourcenzuteilung nach den vorab definierten Kriterien — wie gehst du vor?

**Antwort:** Ich würde die vorab definierten Abbruchkriterien konsequent anwenden und den PoC bei deren Erfüllung tatsächlich beenden, jedoch dem Team die Möglichkeit geben, einen neuen, explizit begründeten PoC mit angepasster Hypothese zu beantragen, statt den ursprünglichen PoC ohne klare Kriterien fortzusetzen.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Team führt einen PoC durch, um zu prüfen, ob eine neue Vektordatenbank (angelehnt an Domain 13, Retrieval & Memory) unter simulierter Last tatsächlich eine Retrieval-Latenz unter 100ms erreicht, mit einem Abbruchkriterium bei mehr als 200ms nach der Hälfte des geplanten Testzeitraums.

~~~python
# Local, deterministic illustration of a PoC with explicit abort criterion (fictional lab example, no real system):

def evaluate_poc(observed_latency_ms, abort_threshold_ms, halfway_point_reached):
    if halfway_point_reached and observed_latency_ms > abort_threshold_ms:
        return "abort: hypothesis likely refuted, halt further investment"
    if observed_latency_ms <= 100:
        return "hypothesis supported so far, continue"
    return "inconclusive, continue monitoring"

print(evaluate_poc(observed_latency_ms=250, abort_threshold_ms=200, halfway_point_reached=True))
~~~

Erwartete Beobachtung: Der PoC wird korrekt als abzubrechen eingestuft, da das vorab definierte Abbruchkriterium bei Halbzeit erfüllt ist. Auswertung: Ohne das explizite Abbruchkriterium hätte das Team möglicherweise die verbleibende, vollständige Testzeit investiert, obwohl die Hypothese bereits deutlich widerlegt war.

## Dependencies, Cross-References und Quellen

1. Eric Ries: [The Lean Startup — Build-Measure-Learn](https://theleanstartup.com/), abgerufen 2026-09-18.
2. Gartner: [Proof of Concept Best Practices — Success and Exit Criteria](https://www.gartner.com/en/information-technology), abgerufen 2026-09-18.

Dieses Kapitel konkretisiert die in KB-0610 (Erfolgskriterien und PoC-Governance) beschriebene Governance auf die praktische PoC-Leitung und nutzt die in KB-0678 (NFR-Workshops) beschriebene Konkretisierungslogik.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte PoC-Tracking-Werkzeuge zur kontinuierlichen Überwachung von Hypothesen-Metriken gegen vordefinierte Abbruchschwellen | Growing Adoption | Bei künftigen, umfangreichen PoC-Programmen evaluieren, jedoch die finale Abbruchentscheidung weiterhin durch den verantwortlichen PoC-Leiter treffen lassen. |

Ein Team akzeptiert einen PoC erst als abgeschlossen, wenn Hypothese, Messwerte und Abbruchkriterien vorab dokumentiert waren und die ungeprüften Produktionsrisiken explizit an die Entscheider übergeben wurden.
