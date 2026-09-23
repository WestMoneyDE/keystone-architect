---
{"id": "KB-0265", "title": "Modellauswahl durch Aufgabenevidenz", "domain": "11", "sequence": 25, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0255", "concepts": ["Qualität, Latenz und Kosten"], "needed_for": "understanding"}, {"id": "KB-0251", "concepts": ["Providerabstraktion"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Evidenzdokumentations-Modell implementieren, das Eval-Ergebnisse, Lizenzbedingungen und Provideränderungen strukturiert als Entscheidungsgrundlage festhält.", "rationale": "Der Unterschied zwischen einer informellen, nicht dokumentierten Modellwahl und einer nachvollziehbaren, evidenzbasierten Entscheidung wird erst durch strukturierte Dokumentation greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Modellauswahlprozess für einen konkreten Anwendungsfall begründet anhand repräsentativer Aufgaben, Sprachbedarf und dokumentierter Einschränkungen gestalten.", "rationale": "Eine nachvollziehbare Modellauswahl erfordert systematische Evidenz, nicht nur eine einmalige, informelle Einschätzung."}, "STAFF-TARGET": {"active": true, "scope": "Eine spätere Modellauswahl-Kritik auf fehlende ursprüngliche Evidenzdokumentation statt auf eine grundsätzlich falsche Entscheidung zurückführen können.", "rationale": "Ohne dokumentierte Entscheidungsevidenz lässt sich nicht nachvollziehen, ob eine Modellwahl zum Entscheidungszeitpunkt angemessen war oder ob sich seitdem die Umstände geändert haben."}, "CHIEF-TARGET": {"active": true, "scope": "Modellauswahl als evidenzbasierten, dokumentierten Prozess positionieren, der Eval-Ergebnisse, Lizenzbedingungen und Provideränderungsrisiken systematisch festhält, nicht als einmalige, informelle Entscheidung.", "rationale": "Eine dokumentierte Entscheidungsgrundlage ermöglicht spätere Nachvollziehbarkeit und erleichtert Neubewertung bei veränderten Umständen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Produktspezifische Lizenzbedingungen einzelner Modellanbieter sind Vertiefung, die sich schnell ändern kann.", "rationale": "Kern ist der strukturierte Evidenzdokumentationsprozess, nicht die aktuellen Lizenzdetails einzelner Anbieter."}}, "lab_validation": [{"lab_id": "KB-0265-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für strukturierte Modellauswahl-Evidenzdokumentation", "evidence": "Eine dokumentierte Entscheidungsgrundlage mit Eval-Ergebnissen, Lizenzbedingungen und identifizierten Einschränkungen erlaubt eine nachvollziehbare Bewertung, ob eine Modellwahl zum ursprünglichen Entscheidungszeitpunkt angemessen begründet war.", "limitations": "Kein echtes produktives Evaluationssystem, keine reale Modellbewertung, keine Produktion."}]}
---
# Modellauswahl durch Aufgabenevidenz

> **Ziel:** Modellauswahl sollte anhand repräsentativer Aufgaben, Sprachbedarf und dokumentierter Einschränkungen erfolgen (aufbauend auf Qualität-/Latenz-/Kosten-Prinzipien, siehe [KB-0255](15-qualitaet-latenz-und-kosten.md)) — mit Eval-Ergebnissen, Lizenzbedingungen und Provideränderungsrisiken als strukturiert dokumentierte Entscheidungsevidenz, nicht als informelle, nicht nachvollziehbare Einzelentscheidung.

## Zweck, Mental Model und Dependencies

Repräsentative Aufgaben sind die Grundlage für eine aussagekräftige Modellauswahl (verwandt mit der Pareto-Analyse anhand realistischer Aufgaben, siehe [KB-0255](15-qualitaet-latenz-und-kosten.md)) — die Bewertung erfolgt anhand von Aufgaben, die die tatsächliche Nutzungscharakteristik der geplanten Anwendung widerspiegeln, nicht anhand generischer Standardbenchmarks. Sprachbedarf muss explizit geprüft werden, insbesondere für mehrsprachige Anwendungsfälle, da Modellleistungsfähigkeit zwischen Sprachen erheblich variieren kann (verwandt mit sprachabhängiger Tokendichte, siehe Tokenbudget-Grundlagen). Eval-Ergebnisse (systematische Bewertungsergebnisse) werden strukturiert dokumentiert, mit klarer Angabe, welche Aufgaben, welche Kriterien und welche Messmethodik verwendet wurden, damit die Ergebnisse später nachvollziehbar und bei veränderten Umständen neu bewertbar sind. Lizenzbedingungen müssen explizit geprüft werden — unterschiedliche Modelle haben unterschiedliche Nutzungsbedingungen (kommerzielle Nutzung, Datenverarbeitung, Weiterverbreitung), die für den konkreten Anwendungsfall rechtlich relevant sein können. Provideränderungsrisiken (verwandt mit API-EOL-Risiken, siehe [KB-0251](11-providerabstraktion-und-portabilitaet.md)) müssen als Teil der Entscheidungsevidenz dokumentiert werden, da ein Anbieter- oder Modellwechsel künftig notwendig werden könnte. Der zentrale Wert strukturierter Dokumentation liegt in der Nachvollziehbarkeit: eine spätere Kritik an einer Modellauswahl kann fair beurteilt werden, wenn dokumentiert ist, welche Evidenz zum Entscheidungszeitpunkt tatsächlich verfügbar war, statt eine Entscheidung rückblickend ohne Kenntnis der damaligen Informationslage zu bewerten.

~~~text
Representative tasks:  evaluation based on ACTUAL usage characteristics, not generic benchmarks
Language requirements:  model capability varies significantly by language - must be checked explicitly
Eval results:            documented WITH methodology, criteria, tasks used -> re-evaluable later
License terms:           commercial use, data processing, redistribution rights - legally relevant, must be checked
Provider change risk:    documented as part of the decision, not discovered later as a surprise
Documented evidence = later criticism of a decision can be FAIRLY judged against what was actually known at the time
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Repräsentative Aufgaben-Evaluation | basiert die Bewertung auf Aufgaben, die die tatsächliche Nutzungscharakteristik widerspiegeln? | generische Benchmark-Bewertung ohne Bezug zur tatsächlichen Anwendung führt zu suboptimaler Wahl |
| Sprachbedarfsprüfung | ist Modellleistungsfähigkeit für alle relevanten Zielsprachen explizit geprüft? | ungeprüfter Sprachbedarf führt zu unerwarteter Qualitätsverschlechterung für nicht getestete Sprachen |
| Strukturierte Eval-Dokumentation | sind Methodik, Kriterien und Ergebnisse der Bewertung nachvollziehbar dokumentiert? | fehlende Dokumentation macht spätere Neubewertung oder faire Kritik der ursprünglichen Entscheidung unmöglich |
| Lizenz- und Provideränderungsrisiko-Dokumentation | sind Nutzungsbedingungen und Anbieteränderungsrisiken explizit als Teil der Entscheidung festgehalten? | undokumentierte Lizenz-/Änderungsrisiken werden erst bei einem tatsächlichen Problem entdeckt |

Implementierung: die Modellauswahl-Evaluation nutzt ein Set repräsentativer Aufgaben, das aus der tatsächlichen oder erwarteten Nutzungscharakteristik der Anwendung abgeleitet wird, statt sich ausschließlich auf generische, öffentliche Benchmarks zu verlassen. Sprachbedarf wird für jede relevante Zielsprache explizit getestet, nicht nur für die primäre Entwicklungssprache angenommen. Eval-Ergebnisse werden strukturiert dokumentiert, mit expliziter Angabe der verwendeten Aufgaben, Bewertungskriterien und Messmethodik, sodass die Bewertung später nachvollzogen und bei Bedarf wiederholt werden kann. Lizenzbedingungen werden vor der finalen Modellwahl explizit geprüft und dokumentiert, insbesondere für Anwendungsfälle mit kommerzieller Nutzung oder spezifischen Datenverarbeitungsanforderungen. Provideränderungsrisiken werden als expliziter Teil der Entscheidungsdokumentation festgehalten, mit Bewusstsein dafür, dass ein künftiger Wechsel notwendig werden könnte.

## Scalability, Reliability, Security und Observability

Evidenzbasierte, dokumentierte Modellauswahl skaliert Entscheidungsqualität über wachsende Anzahl von Anwendungsfällen und Teams, indem ein wiederverwendbarer, nachvollziehbarer Bewertungsprozess statt individueller, informeller Einzelentscheidungen etabliert wird. Reliability-Grenze: eine nicht dokumentierte Modellauswahl ist ein organisatorisches Risiko, das erst sichtbar wird, wenn die ursprüngliche Entscheidung später in Frage gestellt wird (z. B. bei einer Qualitätsbeschwerde) und keine nachvollziehbare Grundlage existiert, um zu beurteilen, ob die Entscheidung zum damaligen Zeitpunkt angemessen war.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Modellwahl wird nachträglich kritisiert, ohne dass die ursprüngliche Entscheidungsgrundlage nachvollziehbar ist | fehlende strukturierte Dokumentation der ursprünglichen Eval-Ergebnisse und Kriterien | prüfen, ob Eval-Methodik, Kriterien und Ergebnisse zum Entscheidungszeitpunkt dokumentiert wurden |
| ein Modell liefert für eine bestimmte Sprache unerwartet schlechte Ergebnisse | Sprachbedarf wurde bei der ursprünglichen Auswahl nicht explizit für diese Sprache getestet | Eval-Dokumentation auf tatsächliche Testabdeckung für die betroffene Sprache prüfen |
| ein Lizenzproblem wird erst nach Produktivsetzung entdeckt | Lizenzbedingungen wurden vor der Modellwahl nicht ausreichend geprüft | Lizenzprüfungsdokumentation auf Vollständigkeit für den tatsächlichen Nutzungskontext prüfen |
| ein Anbieterwechsel wird als unerwartete Krise statt als geplantes Risiko erlebt | Provideränderungsrisiko wurde bei der ursprünglichen Entscheidung nicht dokumentiert | ursprüngliche Entscheidungsdokumentation auf Berücksichtigung von Provideränderungsrisiken prüfen |

Security: Lizenzprüfung sollte auch Datenverarbeitungsbedingungen einschließen (ähnlich der Datenhoheitsprüfung bei lokaler versus verwalteter Inferenz), da unterschiedliche Modellanbieter unterschiedliche Bedingungen für die Verarbeitung und mögliche Weiterverwendung von Eingabedaten haben können. Observability: Vollständigkeit der Evidenzdokumentation pro Modellauswahl-Entscheidung, Häufigkeit nachträglicher Neubewertungen und Zeitspanne zwischen Modellauswahl und tatsächlich notwendigem Wechsel sind zentrale Metriken für Modellauswahl-Prozessgesundheit.

## Trade-offs und Entscheidungen

**Staff** evaluiert Modellkandidaten anhand repräsentativer, aus der tatsächlichen Nutzung abgeleiteter Aufgaben. **Principal** macht Eval-Methodik und -Ergebnisse für das Team strukturiert nachvollziehbar dokumentiert. **Chief** positioniert Modellauswahl als evidenzbasierten, dokumentierten Prozess, nicht als einmalige, informelle Entscheidung ohne nachvollziehbare Grundlage.

Anti-Patterns: Modellauswahl ausschließlich anhand generischer, öffentlicher Benchmarks ohne Bezug zur tatsächlichen Anwendung treffen; Sprachbedarf nur für die primäre Entwicklungssprache testen, andere Zielsprachen ungeprüft annehmen; Lizenzbedingungen und Provideränderungsrisiken nicht als Teil der Entscheidungsdokumentation festhalten.

## Production Checklist

- [ ] Evaluation basiert auf repräsentativen, aus der tatsächlichen Nutzung abgeleiteten Aufgaben.
- [ ] Sprachbedarf ist für alle relevanten Zielsprachen explizit getestet.
- [ ] Eval-Methodik, Kriterien und Ergebnisse sind strukturiert dokumentiert.
- [ ] Lizenzbedingungen und Provideränderungsrisiken sind explizit dokumentiert.

## Interviewfragen

### 1. Warum sollte Modellauswahl anhand repräsentativer Aufgaben statt generischer Benchmarks erfolgen?

**Antwort:** Generische Benchmarks messen oft nicht die tatsächliche Nutzungscharakteristik einer spezifischen Anwendung; eine Bewertung anhand repräsentativer, aus der tatsächlichen Nutzung abgeleiteter Aufgaben liefert aussagekräftigere Ergebnisse für die konkrete Entscheidung.

### 2. Warum ist strukturierte Dokumentation der Eval-Ergebnisse wichtiger als die reine Entscheidung selbst?

**Antwort:** Dokumentierte Methodik, Kriterien und Ergebnisse ermöglichen spätere Nachvollziehbarkeit und faire Beurteilung, ob eine Entscheidung zum damaligen Zeitpunkt angemessen begründet war, sowie eine informierte Neubewertung bei veränderten Umständen.

### 3. Warum muss Sprachbedarf für jede relevante Zielsprache explizit getestet werden?

**Antwort:** Modellleistungsfähigkeit kann zwischen Sprachen erheblich variieren; eine Bewertung, die nur die primäre Entwicklungssprache testet, kann für andere relevante Zielsprachen unerwartet schlechte Ergebnisse übersehen.

### 4. Wie diagnostizierst du, ob eine Modellwahl-Kritik gerechtfertigt ist oder auf fehlender ursprünglicher Dokumentation beruht?

**Antwort:** Ich prüfe, ob die ursprüngliche Eval-Methodik, Kriterien und Ergebnisse dokumentiert wurden — ohne diese Dokumentation lässt sich nicht fair beurteilen, ob die Entscheidung zum damaligen Zeitpunkt angemessen war oder ob sich seitdem die Umstände (z. B. neue Modelle, geänderte Anforderungen) geändert haben.

### 5. Warum sind Lizenzbedingungen ein integraler Bestandteil der Modellauswahl-Evidenz, nicht nur ein nachgelagerter rechtlicher Check?

**Antwort:** Unterschiedliche Modelle haben unterschiedliche Nutzungsbedingungen (kommerzielle Nutzung, Datenverarbeitung, Weiterverbreitung), die für den konkreten Anwendungsfall rechtlich relevant sein können — eine Modellwahl ohne vorherige Lizenzprüfung riskiert, dass technisch geeignete, aber rechtlich unzulässige Modelle produktiv gesetzt werden.

### 6. Widersprüchliche Anforderung: Team will schnelle, pragmatische Modellauswahl ohne aufwendige Dokumentation UND spätere, fundierte Nachvollziehbarkeit der getroffenen Entscheidung bei Bedarf — wie gehst du vor?

**Antwort:** Ich würde erklären, dass ein leichtgewichtiger, strukturierter Dokumentationsprozess (kurze, standardisierte Vorlage für Aufgaben, Kriterien, Ergebnisse, Lizenz- und Risikoprüfung) beide Ziele vereinbaren kann, statt entweder auf Dokumentation zu verzichten oder einen übermäßig aufwendigen Prozess zu etablieren — der Aufwand für minimale, aber ausreichende Nachvollziehbarkeit ist deutlich geringer als der spätere Aufwand, eine undokumentierte Entscheidung rückwirkend zu rekonstruieren.

## Praktische Labs

~~~python
from datetime import datetime

# Structured model selection evidence documentation
def document_model_selection(model_name, tasks_evaluated, languages_tested, license_terms, provider_risk_notes):
    return {
        "model": model_name,
        "decision_date": datetime(2026, 9, 17).isoformat(),
        "representative_tasks": tasks_evaluated,
        "languages_tested": languages_tested,
        "license_terms": license_terms,
        "provider_change_risk": provider_risk_notes,
    }

decision_record = document_model_selection(
    model_name="model_x_v2",
    tasks_evaluated=["customer_support_summarization", "multilingual_faq_response"],
    languages_tested=["en", "de", "es"],
    license_terms="commercial use permitted, no data used for training",
    provider_risk_notes="model deprecation announced with 12-month notice period historically",
)

print("Documented model selection evidence:")
for key, value in decision_record.items():
    print(f"  {key}: {value}")

# Later: a language not in the tested set causes issues - the documentation makes the gap immediately visible
untested_language = "ja"
assert untested_language not in decision_record["languages_tested"]
print(f"\n'{untested_language}' was NOT in the tested languages - this gap is immediately visible from the documented evidence,")
print("rather than requiring reconstruction of what was actually evaluated at decision time.")
~~~

## Dependencies, Cross-References und Quellen

1. Hugging Face: [Open LLM Leaderboard Methodology](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard), abgerufen 2026-09-17.
2. Anthropic: [Usage Policy and Commercial Terms](https://www.anthropic.com/legal/commercial-terms), abgerufen 2026-09-17.
3. Artificial Analysis: [LLM Comparison Methodology](https://artificialanalysis.ai/methodology), abgerufen 2026-09-17.

Qualitäts-/Latenz-/Kosten- und Providerabstraktions-Grundlagen sind kanonisch in [KB-0255](15-qualitaet-latenz-und-kosten.md) und [KB-0251](11-providerabstraktion-und-portabilitaet.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte, werkzeuggestützte Modellvergleichs-Dashboards mit versionierter Evidenzdokumentation | Adopting | Gegenüber manueller Ad-hoc-Dokumentation für konsistente, wiederverwendbare Bewertungsprozesse bevorzugen. |
| Automatisierte, kontinuierliche Re-Evaluation bestehender Modellauswahlentscheidungen bei neuen Modellversionen | Adopting | Für kritische Anwendungen gegenüber rein anlassbezogener Neubewertung einsetzen. |

Ein Team akzeptiert eine Modellauswahl erst, wenn repräsentative Aufgaben-Evaluation, Sprachbedarfsprüfung und Lizenz-/Risikodokumentation nachweisbar strukturiert vorliegen.
