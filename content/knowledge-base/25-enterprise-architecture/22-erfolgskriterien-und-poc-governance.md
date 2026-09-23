---
{"id": "KB-0610", "title": "Erfolgskriterien und PoC-Governance", "domain": "25", "sequence": 22, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0600", "concepts": ["Technology Radar"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Proof of Concept mit expliziter Hypothese, messbaren Abnahmekriterien und definierten Ausstiegskriterien anhand etablierter Praxis korrekt planen und durchführen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie PoCs als begrenzte, zeitlich befristete Evidenzprojekte (aufbauend auf dem bereits in KB-0600 behandelten Technology Radar) statt als verkappte Produktionsfreigabe gesteuert werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein PoC ohne definierte Ausstiegskriterien schleichend in eine faktische Produktionsnutzung übergeht, und dies von einem tatsächlich kontrollierten, befristeten Evidenzprojekt unterscheiden können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für PoC-Governance festlegen, die messbare Erfolgskriterien und Ausstiegskriterien verbindlich machen, um PoC-Wildwuchs und faktische Produktionsnutzung ohne formale Freigabe zu verhindern.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte technische Durchführung einzelner PoCs in spezifischen Technologiebereichen ist bereits in den jeweiligen technischen Domains dieses Curriculums behandelt.", "rationale": "Kern ist die Governance-Struktur (Hypothese, messbare Abnahme, Ausstiegskriterien) eines PoC, nicht die technische Durchführung in einem spezifischen Bereich."}}, "lab_validation": [{"lab_id": "KB-0610-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Prüfung eines PoC gegen definierte Ausstiegskriterien, kein produktives PoC-Governance-Tool verwendet", "evidence": "Ein lokales Skript prüft, ob ein PoC nach Ablauf seiner definierten Zeitgrenze oder ohne erfüllte Abnahmekriterien tatsächlich beendet oder in einen formalen Produktionsfreigabeprozess überführt wurde, statt informell fortgesetzt zu werden.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales PoC-Governance-Tool."}]}
---
# Erfolgskriterien und PoC-Governance

> **Ziel:** Ein Proof of Concept (PoC) ist ein begrenztes, zeitlich befristetes Evidenzprojekt, das eine konkrete, explizite **Hypothese** (etwa "Technologie X eignet sich für Anwendungsfall Y", siehe die bereits in [KB-0600](12-technology-radar.md) behandelte Evidenzanforderung für den Technology Radar) anhand **messbarer Abnahmekriterien** überprüft. Der zentrale Punkt dieses Kapitels ist, dass ein PoC explizit definierte **Ausstiegskriterien** benötigt — sowohl für den Fall des Erfolgs (was passiert, wenn die Hypothese bestätigt wird: formaler Übergang in einen Produktionsfreigabeprozess) als auch für den Fall des Misserfolgs (was passiert, wenn die Hypothese widerlegt wird: definierter, tatsächlicher Abbruch) —, da ein PoC ohne diese Kriterien strukturell dazu neigt, schleichend in eine faktische, informelle Produktionsnutzung überzugehen, ohne jemals die eigentlich erforderliche, formale Produktionsfreigabe durchlaufen zu haben.

## Zweck, Mental Model und Dependencies

Die explizite Hypothese ist die methodische Grundlage eines wirksamen PoC: Ohne eine konkrete, überprüfbare Hypothese (etwa "diese Technologie kann die Anfragen dieses Anwendungsfalls mit einer bestimmten Latenz und einem bestimmten Fehlerbudget verarbeiten") bleibt unklar, wann ein PoC tatsächlich als erfolgreich oder gescheitert gelten soll — ein PoC ohne klare Hypothese neigt dazu, unbegrenzt fortgesetzt zu werden, da es kein definiertes Kriterium gibt, das seinen Abschluss auslöst. Messbare Abnahmekriterien übersetzen diese Hypothese in konkrete, überprüfbare Schwellenwerte (etwa "Latenz unter 200ms bei 95. Perzentil", "Fehlerrate unter 1%"), die eindeutig feststellen lassen, ob die Hypothese tatsächlich bestätigt wurde — vage, unmessbare Erfolgskriterien (etwa "die Technologie funktioniert gut") lassen unterschiedliche Interpretationsspielräume zu und ermöglichen keine eindeutige, nachvollziehbare Entscheidung über Erfolg oder Misserfolg. Die entscheidende, häufig vernachlässigte Komponente sind explizite Ausstiegskriterien für beide möglichen Ausgänge: Ein erfolgreicher PoC muss einen definierten, formalen Übergang in einen tatsächlichen Produktionsfreigabeprozess durchlaufen (der zusätzliche, produktionsrelevante Anforderungen wie Sicherheit, Skalierbarkeit und operative Reife prüft, die ein PoC typischerweise nicht abdeckt), statt informell und ohne diese zusätzliche Prüfung in den Produktivbetrieb überzugehen; ein gescheiterter PoC muss tatsächlich und definitiv beendet werden, statt in reduzierter Form unbegrenzt fortzubestehen. Das strukturelle Risiko, das diese Ausstiegskriterien adressieren, ist der schleichende Übergang eines PoC in eine faktische Produktionsnutzung: Ein PoC-System, das zunächst nur zu Testzwecken eingerichtet wurde, beginnt gelegentlich, tatsächliche Geschäftsdaten oder -prozesse zu verarbeiten, ohne dass dies jemals bewusst als Produktionsentscheidung getroffen wurde — dieses System läuft dann faktisch produktiv, ohne die für Produktionssysteme erforderliche Sicherheits-, Skalierbarkeits- und Betriebsreifeprüfung jemals durchlaufen zu haben, was ein erhebliches, unentdecktes Risiko darstellt.

~~~text
Proof of Concept (PoC): limited, time-boxed evidence project testing a concrete, explicit HYPOTHESIS
  (e.g. "technology X suits use case Y", relates to KB-0600's evidence requirement for tech radar)
  via MEASURABLE ACCEPTANCE CRITERIA
KEY POINT: PoC needs explicitly defined EXIT CRITERIA
  BOTH for success case (what happens if hypothesis confirmed: formal transition to production approval process)
  AND for failure case (what happens if hypothesis refuted: defined, ACTUAL termination)
  PoC w/o these criteria structurally tends to creep into de facto, informal production use
    w/o ever undergoing the actually-required, formal production approval
EXPLICIT HYPOTHESIS = methodological basis of effective PoC
  w/o concrete, verifiable hypothesis -> unclear when PoC should actually count as success/failure
  PoC w/o clear hypothesis tends to continue indefinitely, no defined criterion triggers its conclusion
MEASURABLE ACCEPTANCE CRITERIA translate hypothesis into concrete, verifiable thresholds
  (latency < 200ms p95, error rate < 1%)
  vague, unmeasurable success criteria ("the technology works well")
  -> leave room for differing interpretation, no clear, traceable success/failure decision
DECISIVE, OFTEN-NEGLECTED component: explicit exit criteria for BOTH possible outcomes
  successful PoC -> must go through defined, FORMAL transition to actual production approval process
    (checks additional, production-relevant requirements: security, scalability, operational maturity
     that a PoC typically doesn't cover)
    NOT informally moving to production w/o this additional check
  failed PoC -> must be ACTUALLY, definitively terminated
    NOT continuing indefinitely in reduced form
STRUCTURAL RISK these exit criteria address: PoC creeping into de facto production use
  PoC system initially set up only for testing purposes
  occasionally starts processing actual business data/processes
    w/o this ever being consciously made as a production decision
  -> system runs de facto production WITHOUT ever undergoing required security/scalability/
     operational-maturity review for production systems -> significant, undetected risk
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Hypothese | konkrete, überprüfbare Erwartung an den PoC | bestimmt, wann PoC als erfolgreich/gescheitert gilt |
| Messbare Abnahmekriterien | übersetzt Hypothese in konkrete Schwellenwerte | ermöglicht eindeutige Erfolgs-/Misserfolgsentscheidung |
| Erfolgs-Ausstiegskriterium | definiert Übergang in formalen Produktionsfreigabeprozess | verhindert informellen Übergang zur Produktion |
| Misserfolgs-Ausstiegskriterium | definiert tatsächliche Beendigung bei Nichterfüllung | verhindert unbegrenzte Fortführung gescheiterter PoCs |

Implementierung: Jeder PoC wird mit einer schriftlich formulierten, überprüfbaren Hypothese und konkreten, messbaren Abnahmekriterien vor Beginn definiert. Ein zeitlicher Rahmen und explizite Ausstiegskriterien für Erfolg und Misserfolg werden vorab festgelegt. Ein erfolgreicher PoC wird formal in einen Produktionsfreigabeprozess überführt, der zusätzliche produktionsrelevante Anforderungen prüft; ein gescheiterter PoC wird tatsächlich beendet.

## Scalability, Reliability, Security und Observability

PoC-Governance skaliert die tatsächliche Kontrolle über Technologieeinführung proportional zur Konsequenz messbarer Abnahme- und Ausstiegskriterien; die Reliability-Grenze liegt darin, dass ein PoC ohne diese Kriterien strukturell zu faktischer, ungeprüfter Produktionsnutzung mit erheblichem, unentdecktem Risiko führen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein ursprünglich als PoC eingerichtetes System verarbeitet inzwischen tatsächliche Geschäftsdaten | keine expliziten Ausstiegskriterien haben den PoC vor einem schleichenden Produktionsübergang geschützt | das System entweder formal durch den Produktionsfreigabeprozess führen oder tatsächlich abschalten |
| die Erfolgsbewertung eines PoC ist umstritten oder nicht eindeutig | die zugrunde liegende Hypothese oder die Abnahmekriterien waren zu vage formuliert | die Hypothese und Abnahmekriterien für künftige PoCs konkret und messbar formulieren |
| ein gescheiterter PoC wird in reduzierter Form unbegrenzt fortgeführt | kein definiertes Misserfolgs-Ausstiegskriterium wurde durchgesetzt | das ursprünglich vereinbarte Ausstiegskriterium tatsächlich anwenden und den PoC beenden |

Security: PoCs, die auch nur testweise mit sensiblen oder produktiven Daten arbeiten, sollten dieselben grundlegenden Sicherheitskontrollen wie Produktionssysteme erhalten, unabhängig von ihrem PoC-Status. Observability: Die tatsächliche Zeitspanne zwischen PoC-Start und formaler Ausstiegsentscheidung (statt unbegrenzter, informeller Fortführung) ist ein zentrales Signal zur Bewertung der PoC-Governance-Wirksamkeit.

## Trade-offs und Entscheidungen

**Staff** definiert Hypothese und messbare Abnahmekriterien für einen gegebenen PoC korrekt. **Principal** entwirft die vollständige PoC-Governance-Struktur mit Ausstiegskriterien und Produktionsübergang für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für PoC-Governance fest, die faktische, ungeprüfte Produktionsnutzung strukturell verhindern.

Anti-Patterns: einen PoC ohne konkrete, messbare Abnahmekriterien starten; keine expliziten Ausstiegskriterien für Erfolgs- und Misserfolgsfall definieren; ein ursprünglich als PoC eingerichtetes System informell und ohne formale Produktionsfreigabe in den tatsächlichen Produktivbetrieb übergehen lassen.

## Production Checklist

- [ ] Jeder PoC hat eine schriftlich formulierte, überprüfbare Hypothese.
- [ ] Messbare Abnahmekriterien sind vor Beginn des PoC definiert.
- [ ] Explizite Ausstiegskriterien für Erfolg (Produktionsübergang) und Misserfolg (Abbruch) sind vorab festgelegt.
- [ ] Kein PoC-System verarbeitet tatsächliche Geschäftsdaten ohne formale Produktionsfreigabe.

## Interviewfragen

### 1. Warum benötigt ein PoC eine explizite, überprüfbare Hypothese?

**Antwort:** Ohne sie bleibt unklar, wann der PoC tatsächlich als erfolgreich oder gescheitert gelten soll, wodurch er dazu neigt, unbegrenzt fortgesetzt zu werden.

### 2. Warum sind vage Erfolgskriterien wie "die Technologie funktioniert gut" problematisch?

**Antwort:** Sie lassen unterschiedliche Interpretationsspielräume zu und ermöglichen keine eindeutige, nachvollziehbare Entscheidung über Erfolg oder Misserfolg.

### 3. Was sollte mit einem erfolgreichen PoC geschehen, statt ihn direkt in den Produktivbetrieb zu überführen?

**Antwort:** Er sollte formal in einen Produktionsfreigabeprozess überführt werden, der zusätzliche, produktionsrelevante Anforderungen (Sicherheit, Skalierbarkeit, operative Reife) prüft, die ein PoC typischerweise nicht abdeckt.

### 4. Welches strukturelle Risiko entsteht, wenn ein PoC keine expliziten Ausstiegskriterien hat?

**Antwort:** Der PoC kann schleichend in eine faktische, informelle Produktionsnutzung übergehen, ohne jemals die erforderliche, formale Produktionsfreigabe durchlaufen zu haben.

### 5. Wie gehst du vor, wenn ein ursprünglich als PoC eingerichtetes System inzwischen tatsächliche Geschäftsdaten verarbeitet?

**Antwort:** Ich prüfe, ob das System formal durch einen Produktionsfreigabeprozess geführt werden sollte, oder ich stelle es tatsächlich ab, statt es informell im faktischen Produktivbetrieb zu belassen.

### 6. Widersprüchliche Anforderung: Teams wollen schnelle, unbürokratische PoCs zur Technologieerkundung UND die Organisation will strikte Kontrolle über faktische Produktionsnutzung — wie gehst du vor?

**Antwort:** Ich würde einen schlanken, schnellen PoC-Startprozess mit obligatorischer, aber minimaler Definition von Hypothese, Abnahme- und Ausstiegskriterien etablieren, dessen Einhaltung automatisiert überwacht wird, statt entweder PoCs bürokratisch zu erschweren oder unkontrollierte, faktische Produktionsnutzung zuzulassen.

## Praktische Labs

~~~python
# Local, deterministic simulation of enforcing PoC exit criteria (executed locally, no real PoC governance tool):

def evaluate_poc(poc, current_day):
    within_timebox = current_day <= poc["end_day"]
    criteria_met = poc["measured_latency_ms"] <= poc["acceptance_latency_ms"]
    if not within_timebox and not criteria_met:
        return {"status": "must_terminate", "reason": "timebox expired, criteria not met"}
    elif criteria_met:
        return {"status": "success", "action": "route to production approval process"}
    return {"status": "in_progress"}

poc = {"end_day": 60, "acceptance_latency_ms": 200, "measured_latency_ms": 180}
print(evaluate_poc(poc, current_day=45))
~~~

## Dependencies, Cross-References und Quellen

1. The Open Group: [TOGAF Standard, 10th Edition — Proof of Concept Practices](https://pubs.opengroup.org/togaf-standard/introduction/), abgerufen 2026-09-18.
2. Gartner-Referenzmodell: [Managing Proof of Concept Projects in Enterprise IT](https://www.gartner.com/en/information-technology/glossary/proof-of-concept-poc), abgerufen 2026-09-18.

Technology Radar ist kanonisch in [KB-0600](12-technology-radar.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Erkennung von PoC-Systemen, die tatsächliche Produktionsdatenverkehr verarbeiten, zur frühzeitigen Aufdeckung schleichender Produktionsnutzung | Evaluating | Als ergänzendes Überwachungswerkzeug einführen, das erkannte Fälle an die verantwortliche Governance-Instanz meldet, jedoch die abschließende Entscheidung über Abschaltung oder formale Produktionsfreigabe weiterhin menschlich treffen lassen. |

Ein Team akzeptiert eine PoC-Governance-Praxis erst, wenn Hypothese, messbare Abnahmekriterien und explizite Ausstiegskriterien für beide möglichen Ausgänge nachweislich etabliert sind und faktische, ungeprüfte Produktionsnutzung strukturell verhindert wird.
