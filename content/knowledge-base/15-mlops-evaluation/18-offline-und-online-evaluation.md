---
{"id": "KB-0368", "title": "Offline- und Online-Evaluation", "domain": "15", "sequence": 18, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0367", "concepts": ["AI-Regressionsprüfungen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein simuliertes A/B-Test-Szenario mit verzögerten Labels aufsetzen und die Diskrepanz zwischen Offline-Labormetrik und Online-Ergebnis demonstrieren.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Evaluationsstrategie gestalten, die schnelle Offline-Auswertung mit kontrolliertem Online-A/B-Testing kombiniert und Expositionsrisiken bei Online-Tests explizit begrenzt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Entscheiden, wann eine ausschließlich auf Offline-Labormetriken gestützte Freigabeentscheidung unzureichend ist und ein kontrollierter Online-Test notwendig wird.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Eine klare Eskalationsregel etablieren, ab welchem Risiko- oder Unsicherheitsgrad eine Änderung zusätzlich zur Offline-Evaluation ein kontrolliertes Online-A/B-Testing durchlaufen muss.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene statistische Verfahren zur Behandlung verzögerter Labels (z. B. Survival-Analyse-Ansätze) sind Vertiefung.", "rationale": "Kern ist das Verständnis der Offline-/Online-Diskrepanz und des Expositionsrisikos, nicht ein spezifisches statistisches Verfahren."}}, "lab_validation": [{"lab_id": "KB-0368-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes A/B-Test-Szenario mit verzögerten Labels gegenüber einer Offline-Labormetrik", "evidence": "Eine Modelländerung zeigt auf einem Offline-Evaluationsdatensatz eine verbesserte Labormetrik, führt aber in einem simulierten A/B-Test mit verzögerten, erst später eintreffenden Nutzerlabels zu keiner signifikanten Verbesserung des tatsächlichen Nutzerresultats, was die Diskrepanz zwischen Labormetrik und realem Ergebnis demonstriert.", "limitations": "Kein produktives A/B-Test-System, kein realer Geschäftsdatensatz, kleine simulierte Nutzerpopulation."}]}
---
# Offline- und Online-Evaluation

> **Ziel:** Offline-Evaluation misst Labormetriken auf einem festen Evaluationsdatensatz schnell und reproduzierbar (siehe [KB-0367](17-ai-regressionspruefungen.md)), während Online-Evaluation (insbesondere A/B-Tests) reale Nutzerresultate unter tatsächlichen Produktionsbedingungen misst. Der zentrale Punkt dieses Kapitels ist, dass beide Evaluationsformen unterschiedliche, sich ergänzende Informationen liefern und Offline-Ergebnisse allein nicht automatisch reale Nutzerresultate vorhersagen — insbesondere wegen verzögerter Labels (das tatsächliche Ergebnis einer Interaktion ist oft erst mit zeitlichem Abstand bekannt) und Expositionsrisiken (ein Online-Test setzt echte Nutzer einer möglicherweise fehlerhaften Änderung aus).

## Zweck, Mental Model und Dependencies

Offline-Evaluation ist schnell, reproduzierbar und risikofrei für Nutzer, da sie ausschließlich auf einem festen, zuvor gesammelten Datensatz läuft — sie kann jedoch nur das messen, was der Datensatz tatsächlich repräsentiert, und sagt nichts darüber aus, wie sich eine Änderung auf reale, sich verändernde Nutzeranfragen und tatsächliches Nutzerverhalten auswirkt. Online-Evaluation, typischerweise als A/B-Test (ein Teil der echten Nutzer erhält die neue Version, ein anderer Teil die bisherige Version, und die Ergebnisse werden statistisch verglichen), misst tatsächliches Nutzerverhalten unter realen Bedingungen, ist aber langsamer, aufwendiger und birgt ein Expositionsrisiko: ein Teil echter Nutzer ist während des Tests einer möglicherweise fehlerhaften oder schlechteren Änderung ausgesetzt. Verzögerte Labels erschweren Online-Evaluation zusätzlich: das tatsächliche Ergebnis einer Nutzerinteraktion (z. B. ob eine Empfehlung letztlich zu einer zufriedenstellenden Lösung führte) ist oft nicht sofort, sondern erst nach Tagen oder Wochen bekannt, was die Auswertungszeit eines A/B-Tests verlängert und die Interpretation früher Zwischenergebnisse erschwert. Der zentrale methodische Punkt ist, dass eine verbesserte Offline-Labormetrik keine Garantie für ein verbessertes Online-Ergebnis ist — der Offline-Datensatz deckt möglicherweise nicht die tatsächliche Verteilung realer Anfragen ab, oder die gemessene Metrik korreliert nicht ausreichend stark mit dem tatsächlich relevanten Nutzerresultat.

~~~text
Offline evaluation: fast, reproducible, NO user risk -- runs on a fixed prior dataset
  LIMIT: only measures what the dataset represents, says nothing about real, shifting user behavior
Online evaluation (A/B test): real users, real behavior, REAL conditions
  COST: slower, more effort, EXPOSURE RISK (some real users see a potentially worse/broken variant)
  COMPLICATION: delayed labels -- true outcome of an interaction often known only days/weeks later
                -> lengthens test duration, complicates interpreting early results
KEY RULE: an improved OFFLINE lab metric does NOT guarantee an improved ONLINE result
  -> offline dataset may not represent real query distribution, OR the metric may not correlate strongly enough with the actual outcome that matters
~~~

## Core Concepts, Architektur und Implementierung

| Aspekt | Offline-Evaluation | Online-Evaluation (A/B-Test) |
|---|---|---|
| Geschwindigkeit | schnell, sofort verfügbar | langsam, oft Tage bis Wochen bis zum Ergebnis |
| Nutzerrisiko | keines (kein realer Nutzer beteiligt) | Expositionsrisiko für einen Teil der echten Nutzer |
| Repräsentativität | begrenzt auf den Evaluationsdatensatz | vollständig repräsentativ für reale Nutzung |
| Umgang mit verzögerten Labels | nicht relevant (feste, bereits vorliegende Labels) | zentrale Herausforderung, verlängert Auswertungszeit |

Implementierung: Jede Änderung durchläuft zunächst die schnelle Offline-Evaluation (siehe [KB-0367](17-ai-regressionspruefungen.md)) als erste, risikofreie Prüfung. Zeigt die Offline-Evaluation eine substanzielle Verbesserung oder besteht Unsicherheit über die Übertragbarkeit auf reale Nutzung, wird zusätzlich ein kontrollierter Online-A/B-Test mit begrenzter, definierter Nutzerexposition durchgeführt. Bei verzögerten Labels wird die Auswertungsdauer explizit an die tatsächliche Zeit bis zum Eintreffen aussagekräftiger Labels angepasst, statt vorzeitig auf Basis unvollständiger Zwischendaten zu entscheiden. Das Expositionsrisiko wird durch eine anfänglich kleine Testgruppe begrenzt, die bei positivem Zwischenergebnis schrittweise vergrößert wird.

## Scalability, Reliability, Security und Observability

Offline-Evaluation skaliert Prüfgeschwindigkeit ohne Nutzerrisiko; Online-Evaluation skaliert Aussagekraft über reale Nutzerresultate proportional zur akzeptierten Expositionsdauer und -größe. Die Reliability-Grenze liegt darin, dass eine ausschließlich auf Offline-Metriken gestützte Freigabeentscheidung proportional zur Diskrepanz zwischen Offline-Datensatz und realer Nutzungsverteilung das Risiko einer online tatsächlich schlechteren Änderung erhöht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Änderung mit verbesserter Offline-Labormetrik zeigt in einem A/B-Test keine signifikante Verbesserung des realen Nutzerresultats | der Offline-Datensatz repräsentiert die reale Nutzungsverteilung nicht ausreichend, oder die Labormetrik korreliert schwach mit dem tatsächlichen Nutzerresultat | die Offline-Datensatzverteilung gegen die reale Nutzungsverteilung vergleichen und die Korrelation zwischen Labormetrik und Online-Ergebnis über vergangene Änderungen prüfen |
| ein A/B-Test liefert früh scheinbar eindeutige, aber später widersprüchliche Ergebnisse | verzögerte Labels wurden nicht ausreichend abgewartet, bevor eine vorzeitige Entscheidung getroffen wurde | die Auswertung bis zum vollständigen Eintreffen der relevanten verzögerten Labels fortsetzen, bevor eine endgültige Entscheidung getroffen wird |
| ein Online-Test verursacht sichtbaren Schaden bei einem Teil der Nutzer | die anfängliche Testgruppengröße war zu groß für das tatsächliche Risiko der getesteten Änderung | die Testgruppengröße bei zukünftigen Tests risikoproportional kleiner wählen und schrittweise vergrößern |

Security: Online-Tests bergen ein reales Expositionsrisiko für echte Nutzer und erfordern daher eine explizite Begrenzung der Testgruppengröße proportional zum eingeschätzten Risiko der getesteten Änderung. Observability: Die Korrelation zwischen Offline-Labormetriken und Online-A/B-Test-Ergebnissen über die Zeit, sowie die durchschnittliche Verzögerung bis zum Eintreffen relevanter Labels, sind zentrale strategische Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Offline-Evaluation als schnelle erste Prüfung und Online-A/B-Tests für Änderungen mit substanzieller Unsicherheit über die reale Übertragbarkeit. **Principal** macht die Korrelation zwischen Offline- und Online-Ergebnissen für das Team nachvollziehbar. **Chief** etabliert eine klare Eskalationsregel, ab welchem Risiko- oder Unsicherheitsgrad eine Änderung zusätzlich zur Offline-Evaluation ein kontrolliertes Online-Testing durchlaufen muss.

Anti-Patterns: eine Freigabeentscheidung ausschließlich auf verbesserte Offline-Labormetriken stützen, ohne die Übertragbarkeit auf reale Nutzung zu prüfen; einen A/B-Test vorzeitig vor Eintreffen relevanter verzögerter Labels als abgeschlossen behandeln; eine Online-Testgruppe unangemessen groß für das tatsächliche Risiko der getesteten Änderung wählen.

## Production Checklist

- [ ] Jede Änderung durchläuft zunächst die schnelle, risikofreie Offline-Evaluation.
- [ ] Änderungen mit substanzieller Unsicherheit über reale Übertragbarkeit durchlaufen zusätzlich einen kontrollierten Online-A/B-Test.
- [ ] Die Auswertungsdauer eines A/B-Tests berücksichtigt explizit die tatsächliche Verzögerung relevanter Labels.
- [ ] Die anfängliche Online-Testgruppengröße ist risikoproportional begrenzt.

## Interviewfragen

### 1. Was ist der zentrale Unterschied zwischen Offline- und Online-Evaluation?

**Antwort:** Offline-Evaluation ist schnell, reproduzierbar und risikofrei, misst aber nur, was ein fester Datensatz repräsentiert; Online-Evaluation misst reales Nutzerverhalten unter tatsächlichen Bedingungen, ist aber langsamer und birgt ein Expositionsrisiko für echte Nutzer.

### 2. Warum garantiert eine verbesserte Offline-Labormetrik nicht automatisch ein verbessertes Online-Ergebnis?

**Antwort:** Der Offline-Datensatz repräsentiert möglicherweise nicht die tatsächliche Verteilung realer Anfragen, oder die gemessene Metrik korreliert nicht ausreichend stark mit dem tatsächlich relevanten Nutzerresultat.

### 3. Was sind verzögerte Labels, und warum erschweren sie Online-Evaluation?

**Antwort:** Das tatsächliche Ergebnis einer Nutzerinteraktion ist oft erst nach Tagen oder Wochen bekannt, was die Auswertungszeit eines A/B-Tests verlängert und die Interpretation früher Zwischenergebnisse erschwert.

### 4. Wie begrenzt du das Expositionsrisiko bei einem Online-A/B-Test?

**Antwort:** Durch eine anfänglich kleine, risikoproportionale Testgruppengröße, die bei positivem Zwischenergebnis schrittweise vergrößert wird.

### 5. Wie gehst du vor, wenn ein A/B-Test früh scheinbar eindeutige, aber später widersprüchliche Ergebnisse zeigt?

**Antwort:** Ich setze die Auswertung bis zum vollständigen Eintreffen der relevanten verzögerten Labels fort, statt eine vorzeitige Entscheidung auf Basis unvollständiger Zwischendaten zu treffen.

### 6. Widersprüchliche Anforderung: Team will schnelle Freigabeentscheidung allein auf Basis der Offline-Evaluation UND garantiert kein Risiko einer online tatsächlich schlechteren Änderung — wie gehst du vor?

**Antwort:** Ich würde eine klare Eskalationsregel etablieren: bei geringem Risiko und hoher Korrelation zwischen Offline-Metrik und historischen Online-Ergebnissen reicht die schnelle Offline-Evaluation aus; bei höherem Risiko oder unsicherer Übertragbarkeit ist ein kontrollierter, aber zeitlich begrenzter Online-A/B-Test mit kleiner initialer Testgruppe verpflichtend, um beide Ziele proportional zum tatsächlichen Risiko auszubalancieren.

## Praktische Labs

~~~python
import random

random.seed(0)

def offline_lab_metric(config):
    return 0.85 if config == "new" else 0.80  # new config looks better offline

def simulated_real_user_outcome(config, delay_days):
    # Simulated reality: offline improvement doesn't fully translate; also affected by delayed labels
    base_outcome = 0.82 if config == "new" else 0.81
    noise = random.uniform(-0.03, 0.03)
    return base_outcome + noise

print(f"Offline lab metric -- old: {offline_lab_metric('old'):.2f}, new: {offline_lab_metric('new'):.2f}")
print("Offline suggests 'new' is clearly better.\n")

print("Simulated A/B test with delayed labels (outcome known only after several days):")
for day in [1, 3, 7, 14]:
    old_outcome = simulated_real_user_outcome("old", day)
    new_outcome = simulated_real_user_outcome("new", day)
    print(f"  day {day}: old={old_outcome:.3f}, new={new_outcome:.3f}, diff={new_outcome - old_outcome:+.3f}")

print("\nCONCLUSION: real online difference is much smaller and noisier than the offline metric suggested --")
print("a premature decision at day 1 could have been misleading; full delayed-label window matters.")
~~~

## Dependencies, Cross-References und Quellen

1. Kohavi, Tang, Xu: [Trustworthy Online Controlled Experiments — A Practical Guide to A/B Testing](https://www.cambridge.org/core/books/trustworthy-online-controlled-experiments/), abgerufen 2026-09-17.
2. Kohavi et al.: [Online Controlled Experiments at Large Scale](https://exp-platform.com/Documents/2013%20controlledExperimentsAtScale.pdf), abgerufen 2026-09-17.

AI-Regressionsprüfungen sind kanonisch in [KB-0367](17-ai-regressionspruefungen.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Sequenzielle Testverfahren, die eine frühzeitige, statistisch fundierte Entscheidung ermöglichen, ohne auf das vollständige verzögerte Label-Fenster zu warten | Evaluating | Gegenüber festen Testlaufzeiten abwägen, sobald das Verfahren nachweislich zuverlässige frühzeitige Entscheidungen ermöglicht. |
| Automatisierte, risikoadaptive Testgruppengrößen-Steuerung basierend auf Zwischenergebnissen | Adopting | Gegenüber statisch festgelegten Testgruppengrößen für dynamischere Risikobegrenzung bevorzugen. |

Ein Team akzeptiert eine Freigabeentscheidung bei substanzieller Unsicherheit über reale Übertragbarkeit erst, wenn ein kontrollierter Online-A/B-Test mit ausreichend abgewarteten, vollständigen Labels vorliegt.
