---
{"id": "KB-0693", "title": "Wertbeiträge von Architektur belegen", "domain": "30", "sequence": 17, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0638", "concepts": ["Cloud Unit Economics"], "needed_for": "Wertbeitragsbelege nutzen häufig die in KB-0638 beschriebene Unit-Economics-Modellierung als Grundlage der Messwerte"}, {"id": "KB-0685", "concepts": ["Faire Behandlung von Gegenargumenten"], "needed_for": "Ein Erfolgsnarrativ muss ebenso fair Gegenfaktoren behandeln wie das in KB-0685 beschriebene Trade-off-Narrativ Gegenargumente"}], "related": ["KB-0680"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für eine gegebene technische Maßnahme einen Wertbeitragsbeleg erstellen, der Gegenfaktoren, Attribution und zeitliche Verzögerung offen berücksichtigt.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine komplexe Architekturmaßnahme mehrere mögliche Erklärungen für ein beobachtetes Geschäftsresultat gegeneinander abwägen und die tatsächlich wahrscheinlichste Attribution begründen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein Erfolgsnarrativ einer Architekturmaßnahme tatsächliche Gegenfaktoren oder zeitliche Verzögerung ignoriert und dadurch einen übertriebenen Kausalzusammenhang suggeriert.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Wertbeitragsbelege festlegen, die offene Behandlung von Gegenfaktoren und Attribution als verbindliche Qualität vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, statistische Kausalinferenzmethodik (etwa Differenz-von-Differenzen-Schätzung) im Detail ist Vertiefung.", "rationale": "Kern ist die praktische, nachvollziehbare Belegführung, nicht die formale, statistische Kausalinferenzmethodik."}}, "lab_validation": [{"lab_id": "KB-0693-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung ehrlicher Attribution gegenüber übertriebenem Kausalanspruch, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie eine Kostensenkung, die tatsächlich teilweise durch eine parallele Marktpreisänderung statt ausschließlich durch die Architekturmaßnahme verursacht wurde, bei ehrlicher Attribution korrekt anteilig statt vollständig der Architekturmaßnahme zugeschrieben wird.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# Wertbeiträge von Architektur belegen

> **Ziel:** Der Wertbeitrag einer technischen Maßnahme (etwa eine Architekturmigration oder eine Plattforminvestition) zu einem messbaren Geschäftsresultat (Kosteneinsparung, Umsatzsteigerung, Risikoreduktion) muss tatsächlich belastbar belegt werden, nicht nur behauptet. Der zentrale Punkt dieses Kapitels ist, dass ein solcher Beleg drei Fallstricke offen berücksichtigen muss: **Gegenfaktoren** (andere, parallele Einflüsse, die das beobachtete Ergebnis tatsächlich mitverursacht haben könnten, unabhängig von der technischen Maßnahme), **Attribution** (wie viel des beobachteten Ergebnisses tatsächlich der Maßnahme zugeschrieben werden kann, statt sie vollständig zu vereinnahmen) und **zeitliche Verzögerung** (ein Geschäftsresultat tritt tatsächlich oft erst deutlich nach der technischen Maßnahme ein, was eine naive, unmittelbare Vorher-Nachher-Betrachtung tatsächlich verfälschen kann). Ein Erfolgsnarrativ, das diese drei Fallstricke ignoriert, wirkt tatsächlich überzeugender, ist aber tatsächlich unehrlich und untergräbt langfristig die Glaubwürdigkeit künftiger Wertbeitragsbelege, entsprechend dem in KB-0685 beschriebenen Prinzip fairer Gegenargumentbehandlung.

## Zweck, Mental Model und Dependencies

Gegenfaktoren zu berücksichtigen bedeutet, tatsächlich zu prüfen, ob ein beobachtetes Geschäftsresultat auch durch andere, parallele Einflüsse verursacht worden sein könnte — etwa eine allgemeine Marktpreisänderung, eine parallele Prozessverbesserung in einem anderen Bereich, oder saisonale Effekte; ein Wertbeitragsbeleg, der diese Gegenfaktoren nicht prüft, riskiert tatsächlich, einer technischen Maßnahme ein Ergebnis zuzuschreiben, das tatsächlich größtenteils durch andere Faktoren verursacht wurde. Attribution korrekt zu bestimmen bedeutet, tatsächlich anzuerkennen, dass ein Geschäftsresultat häufig nicht vollständig einer einzigen Maßnahme zugeschrieben werden kann, sondern anteilig mehreren, parallel wirkenden Ursachen — diese anteilige, ehrliche Zuschreibung ist tatsächlich weniger beeindruckend als eine vollständige Vereinnahmung des Ergebnisses, aber tatsächlich glaubwürdiger und nachhaltiger, da eine spätere, genauere Prüfung eine übertriebene Attribution tatsächlich aufdecken würde. Zeitliche Verzögerung zu berücksichtigen bedeutet, tatsächlich zu erkennen, dass der Effekt einer technischen Maßnahme häufig verzögert eintritt — eine Plattforminvestition zeigt ihren tatsächlichen Wertbeitrag (etwa schnellere Featurebereitstellung) möglicherweise erst Monate nach Abschluss der Investition, wenn nutzende Teams die neue Fähigkeit tatsächlich adoptiert haben; ein Beleg, der unmittelbar nach der Maßnahme eine Vorher-Nachher-Messung durchführt, könnte den Wertbeitrag tatsächlich unterschätzen, weil die volle Wirkung noch nicht eingetreten ist, während eine Messung zu spät nach der Maßnahme tatsächlich Gefahr läuft, zwischenzeitlich eingetretene, andere Einflüsse fälschlich der Maßnahme zuzuschreiben. Cloud Unit Economics (siehe KB-0638) liefert häufig die zugrunde liegende, quantitative Messgrundlage für Kosteneinsparungsbelege — der Wertbeitragsbeleg übersetzt diese quantitative Grundlage dann in ein tatsächlich nachvollziehbares, ehrliches Narrativ, das Gegenfaktoren, Attribution und zeitliche Verzögerung explizit berücksichtigt, statt die rohe Zahl unkommentiert als vollständigen, alleinigen Erfolg der Maßnahme zu präsentieren.

~~~text
Value contribution of a technical measure (architecture migration, platform investment)
  to a measurable business result (cost savings, revenue increase, risk reduction) must
  ACTUALLY be substantively evidenced, not just claimed
KEY POINT: such evidence must openly consider 3 pitfalls
  CONFOUNDING FACTORS: other, parallel influences that could ACTUALLY have co-caused
  observed result, independent of technical measure
  ATTRIBUTION: how much of observed result can ACTUALLY be credited to the measure,
  instead of fully claiming it
  TIME LAG: business result ACTUALLY often occurs substantially after technical
  measure, which CAN ACTUALLY distort a naive, immediate before-after comparison
  success narrative ignoring these 3 pitfalls ACTUALLY appears more convincing but is
  ACTUALLY dishonest + long-term undermines credibility of future value-contribution
  evidence, per KB-0685's fair-counterargument-treatment principle
CONSIDERING CONFOUNDING FACTORS means ACTUALLY checking whether observed business result
  could also have been caused by other, parallel influences -- general market price
  change, parallel process improvement elsewhere, seasonal effects
  value-contribution evidence not checking these confounders ACTUALLY risks crediting a
  technical measure w/ a result ACTUALLY largely caused by other factors
CORRECTLY DETERMINING ATTRIBUTION means ACTUALLY acknowledging a business result often
  can't be fully credited to a single measure, but proportionally to multiple, parallel-
  acting causes -- this proportional, honest attribution ACTUALLY less impressive than
  full claiming of result, but ACTUALLY more credible+sustainable, since later, more
  precise check would ACTUALLY uncover exaggerated attribution
CONSIDERING TIME LAG means ACTUALLY recognizing technical measure's effect often occurs
  delayed -- platform investment shows ACTUAL value contribution (faster feature
  delivery) possibly only months after investment completion, once using teams ACTUALLY
  adopted new capability
  evidence conducting before-after measurement immediately after measure COULD ACTUALLY
  underestimate value contribution since full effect not yet occurred, while measurement
  too late after measure ACTUALLY risks falsely crediting other, meanwhile-occurred
  influences to the measure
CLOUD UNIT ECONOMICS (see KB-0638) frequently delivers underlying, quantitative
  measurement basis for cost-savings evidence -- value-contribution evidence then
  translates this quantitative basis into an ACTUALLY traceable, honest narrative
  explicitly considering confounders, attribution, time lag, instead of presenting raw
  number uncommented as complete, sole success of the measure
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Gegenfaktoren-Prüfung | prüft parallele, alternative Ursachen des Ergebnisses | verhindert Zuschreibung tatsächlich fremdverursachter Effekte |
| Anteilige, ehrliche Attribution | erkennt mehrere, parallel wirkende Ursachen an | glaubwürdiger und nachhaltiger als vollständige Vereinnahmung |
| Zeitliche Verzögerungsberücksichtigung | passt Messzeitpunkt an tatsächlichen Wirkungseintritt an | verhindert Unter- oder Überschätzung durch falschen Messzeitpunkt |
| Quantitative Grundlage aus Unit Economics | liefert Messbasis für ehrliches Narrativ | übersetzt rohe Zahl in nachvollziehbaren, verantwortungsvollen Beleg |

Implementierung: Vor der Wertbeitragsmessung werden mögliche Gegenfaktoren explizit identifiziert und geprüft. Die Attribution wird anteilig statt vollständig formuliert, wenn mehrere Ursachen tatsächlich plausibel sind. Der Messzeitpunkt wird explizit an den erwarteten, tatsächlichen Wirkungseintritt angepasst.

## Scalability, Reliability, Security und Observability

Eine Wertbeitragsbeleg-Praxis skaliert über die Anzahl der parallel zu belegenden Architekturmaßnahmen; die Reliability-Grenze liegt darin, dass ein übertriebenes, ungeprüftes Erfolgsnarrativ die Glaubwürdigkeit künftiger Belege untergräbt, sobald eine genauere Prüfung die Übertreibung aufdeckt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Wertbeitragsbeleg wird bei genauerer Prüfung als übertrieben entlarvt | Gegenfaktoren wurden nicht geprüft, das Ergebnis wurde vollständig der Maßnahme zugeschrieben | künftige Belege um eine explizite Gegenfaktoren-Prüfung und anteilige Attribution ergänzen |
| eine Maßnahme zeigt unmittelbar nach Abschluss keinen messbaren Effekt, obwohl sie tatsächlich wirksam war | der Messzeitpunkt lag vor dem tatsächlichen Wirkungseintritt | den Messzeitpunkt an die tatsächlich erwartete Verzögerung anpassen |
| ein späterer Effekt wird fälschlich einer bereits abgeschlossenen Maßnahme zugeschrieben | zwischenzeitlich eingetretene, andere Einflüsse wurden nicht als mögliche Ursache geprüft | die zeitliche Distanz zwischen Maßnahme und Messung explizit auf plausible Alternativursachen prüfen |

Security: Wertbeitragsbelege zu sicherheitsrelevanten Maßnahmen (etwa Risikoreduktion) sollten besonders vorsichtig mit Kausalitätsbehauptungen umgehen, da ein nicht eingetretener Sicherheitsvorfall tatsächlich mehrdeutig interpretierbar ist. Observability: Die tatsächliche Übereinstimmung zwischen ursprünglich prognostiziertem und später tatsächlich beobachtetem Wertbeitrag ist ein zentrales Signal zur Bewertung der Belegqualität.

## Trade-offs und Entscheidungen

**Staff** liefert für eine begrenzte, technische Maßnahme eine erste, quantitative Messgrundlage. **Principal** entwirft den vollständigen Wertbeitragsbeleg mit Gegenfaktoren-Prüfung, Attribution und zeitlicher Anpassung für eine komplexe Maßnahme. **Chief** verantwortet die unternehmensweite Kommunikation von Wertbeiträgen unter Einhaltung ehrlicher Attributionsstandards.

Anti-Patterns: ein Geschäftsresultat vollständig einer technischen Maßnahme zuschreiben, ohne Gegenfaktoren zu prüfen; die Messung unmittelbar nach der Maßnahme durchführen, ohne die tatsächlich erwartete Verzögerung zu berücksichtigen; einen Wertbeitragsbeleg ohne nachvollziehbare, quantitative Grundlage präsentieren.

## Production Checklist

- [ ] Mögliche Gegenfaktoren sind explizit identifiziert und geprüft.
- [ ] Die Attribution ist anteilig statt vollständig formuliert, wenn mehrere Ursachen plausibel sind.
- [ ] Der Messzeitpunkt ist an den tatsächlich erwarteten Wirkungseintritt angepasst.
- [ ] Der Beleg basiert auf einer nachvollziehbaren, quantitativen Messgrundlage.

## Interviewfragen

### 1. Warum müssen Gegenfaktoren bei einem Wertbeitragsbeleg explizit geprüft werden?

**Antwort:** Weil ein beobachtetes Geschäftsresultat auch durch andere, parallele Einflüsse verursacht worden sein könnte, und ein Beleg ohne diese Prüfung riskiert, der Maßnahme ein Ergebnis zuzuschreiben, das größtenteils durch andere Faktoren verursacht wurde.

### 2. Warum ist eine anteilige, ehrliche Attribution glaubwürdiger als eine vollständige Vereinnahmung des Ergebnisses?

**Antwort:** Weil eine spätere, genauere Prüfung eine übertriebene, vollständige Attribution aufdecken würde, was die Glaubwürdigkeit künftiger Belege untergräbt.

### 3. Warum kann eine unmittelbare Vorher-Nachher-Messung nach einer technischen Maßnahme den Wertbeitrag unterschätzen?

**Antwort:** Weil der volle Effekt der Maßnahme oft erst verzögert eintritt, etwa wenn nutzende Teams eine neue Fähigkeit erst nach einiger Zeit tatsächlich adoptieren.

### 4. Welche Rolle spielt Cloud Unit Economics für einen Wertbeitragsbeleg?

**Antwort:** Sie liefert häufig die zugrunde liegende, quantitative Messgrundlage, die der Wertbeitragsbeleg dann in ein ehrliches, Gegenfaktoren und Attribution berücksichtigendes Narrativ übersetzt.

### 5. Wie gehst du vor, wenn ein Wertbeitragsbeleg bei genauerer Prüfung als übertrieben entlarvt wird?

**Antwort:** Ich prüfe, ob Gegenfaktoren bei der ursprünglichen Bewertung geprüft wurden, und ergänze künftige Belege um eine explizite Gegenfaktoren-Prüfung mit anteiliger statt vollständiger Attribution.

### 6. Widersprüchliche Anforderung: Das Management will ein klares, überzeugendes Erfolgsnarrativ für eine Architekturmaßnahme UND die Organisation will vollständige Ehrlichkeit über Gegenfaktoren und Attributionsunsicherheit — wie gehst du vor?

**Antwort:** Ich würde den tatsächlich wahrscheinlichsten, anteiligen Wertbeitrag klar und überzeugend darstellen, jedoch die zugrunde liegenden Gegenfaktoren und Attributionsunsicherheiten explizit als solche kennzeichnen, statt sie zu verschweigen — ein klares Narrativ und ehrliche Attribution schließen sich tatsächlich nicht gegenseitig aus.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Team migriert eine GPU-Inference-Workload (angelehnt an Domain 17) auf eine kosteneffizientere Infrastruktur. Gleichzeitig sinken die Marktpreise für die genutzten GPU-Instanzen um 15%, unabhängig von der Migration.

~~~python
# Local, deterministic illustration of honest attribution accounting for a confounding factor (fictional lab example, no real project):

def attribute_savings(total_observed_savings_pct, market_price_change_pct):
    attributable_to_measure_pct = total_observed_savings_pct - market_price_change_pct
    return {
        "total_observed": total_observed_savings_pct,
        "confounding_factor": market_price_change_pct,
        "actually_attributable_to_measure": max(attributable_to_measure_pct, 0),
    }

print(attribute_savings(total_observed_savings_pct=35, market_price_change_pct=15))
~~~

Erwartete Beobachtung: Von den beobachteten 35% Einsparung werden nur 20% tatsächlich der Architekturmaßnahme zugeschrieben, die übrigen 15% dem parallelen Marktpreisrückgang. Auswertung: Ein Beleg ohne diese Gegenfaktoren-Prüfung hätte der Migration fälschlich die vollen 35% Einsparung zugeschrieben, was bei einer späteren, genaueren Prüfung als Übertreibung aufgefallen wäre.

## Dependencies, Cross-References und Quellen

1. Judea Pearl, Dana Mackenzie: [The Book of Why — The New Science of Cause and Effect](https://www.basicbooks.com/), abgerufen 2026-09-18.
2. FinOps Foundation: [FinOps Framework — Measuring and Communicating Value](https://www.finops.org/framework/), abgerufen 2026-09-18.

Dieses Kapitel baut auf der in KB-0638 (Cloud Unit Economics) beschriebenen quantitativen Grundlage und der in KB-0685 (Trade-off-Narrative) beschriebenen fairen Gegenargumentbehandlung auf.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Attributionsmodellierung (Difference-in-Differences-Ansätze) für laufende Wertbeitragsmessung technischer Maßnahmen | Emerging | Bei künftigen, umfangreichen Maßnahmen mit verfügbaren Vergleichsgruppen evaluieren, jedoch bei einfacheren Maßnahmen weiterhin auf transparente, manuelle Gegenfaktoren-Prüfung setzen. |

Ein Team akzeptiert einen Wertbeitragsbeleg erst, wenn Gegenfaktoren geprüft, Attribution anteilig und ehrlich formuliert sowie der Messzeitpunkt an die tatsächliche Wirkungsverzögerung angepasst ist.
