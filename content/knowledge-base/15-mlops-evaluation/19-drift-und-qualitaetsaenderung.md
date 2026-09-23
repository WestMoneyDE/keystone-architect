---
{"id": "KB-0369", "title": "Drift und Qualitätsänderung", "domain": "15", "sequence": 19, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0368", "concepts": ["Offline- und Online-Evaluation"], "needed_for": "understanding"}, {"id": "KB-0345", "concepts": ["Robustheit und Verteilungsänderung"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Drift-Alarm anhand eines Referenzfensters konfigurieren und zwischen einem simulierten Daten-Drift- und einem Konzept-Drift-Szenario unterscheiden.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Überwachungsstrategie gestalten, die Alarme, Referenzfenster und einen klaren Untersuchungsweg für erkannten Drift definiert, ohne Drift automatisch mit Modellversagen gleichzusetzen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Bei einem Drift-Alarm die Ursache methodisch zwischen Daten-, Konzept- und Verhaltensdrift eingrenzen, bevor eine Modelländerung veranlasst wird.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Einen strukturierten Untersuchungsprozess für Drift-Alarme als Governance-Standard etablieren, der eine vorschnelle Gleichsetzung von Drift mit Modellversagen im Unternehmen verhindert.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene statistische Drift-Detektionsverfahren (z. B. Kolmogorov-Smirnov-Tests) sind Vertiefung.", "rationale": "Kern ist die Unterscheidung der Drift-Arten und der Untersuchungsprozess, nicht ein spezifisches statistisches Testverfahren."}}, "lab_validation": [{"lab_id": "KB-0369-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simulierte Datenverteilung mit separat simuliertem Daten-Drift- und Konzept-Drift-Szenario gegenüber einem festen Referenzfenster", "evidence": "Ein simuliertes Daten-Drift-Szenario zeigt eine veränderte Eingabeverteilung bei unveränderter Beziehung zwischen Eingabe und korrekter Ausgabe, während ein simuliertes Konzept-Drift-Szenario eine unveränderte Eingabeverteilung, aber eine veränderte Beziehung zwischen Eingabe und korrekter Ausgabe zeigt; beide lösen denselben oberflächlichen Genauigkeitsabfall-Alarm aus, erfordern aber unterschiedliche Reaktionen.", "limitations": "Kein produktives Monitoring-System, kein realer Geschäftsdatensatz, künstlich konstruierte Drift-Szenarien."}]}
---
# Drift und Qualitätsänderung

> **Ziel:** Drift beschreibt eine Veränderung der Datenverteilung oder des zugrunde liegenden Zusammenhangs zwischen Ein- und Ausgabe im Zeitverlauf, die zu einer beobachtbaren Qualitätsänderung führt, aufbauend auf den Grundlagen der Verteilungsänderung (siehe [KB-0345](../14-ml-engineering/15-robustheit-und-verteilungsaenderung.md)) und der Offline-/Online-Evaluationslücke (siehe [KB-0368](18-offline-und-online-evaluation.md)). Der zentrale Punkt dieses Kapitels ist, drei Arten von Drift — Daten-, Konzept- und Verhaltensdrift — sauber zu unterscheiden und einen strukturierten Untersuchungsweg zu definieren, statt einen Drift-Alarm automatisch mit einem Modellversagen gleichzusetzen.

## Zweck, Mental Model und Dependencies

Daten-Drift beschreibt eine Veränderung der Verteilung der Eingabedaten selbst, während der zugrunde liegende Zusammenhang zwischen Eingabe und korrekter Ausgabe unverändert bleibt (z. B. ändert sich die Zusammensetzung der Kundenanfragen saisonal, aber die Regel, welche Antwort für einen bestimmten Anfragetyp korrekt ist, bleibt gleich). Konzept-Drift beschreibt eine Veränderung des zugrunde liegenden Zusammenhangs selbst, während die Eingabeverteilung möglicherweise unverändert bleibt (z. B. ändert sich eine Geschäftsregel oder ein externer Sachverhalt, sodass dieselbe Anfrage nun eine andere korrekte Antwort erfordert als zuvor). Verhaltensdrift beschreibt eine Veränderung im Nutzungsverhalten oder in der Interaktion mit dem System selbst (z. B. Nutzer formulieren Anfragen zunehmend anders, nutzen neue Funktionen, oder reagieren anders auf Systemantworten), die weder reine Daten- noch reine Konzeptdrift ist, sondern die Mensch-System-Interaktion selbst betrifft. Diese drei Arten erfordern grundsätzlich unterschiedliche Reaktionen: Daten-Drift kann oft durch Nachtraining mit aktuelleren, repräsentativen Daten adressiert werden; Konzept-Drift erfordert eine Aktualisierung der zugrunde liegenden Wissensbasis oder Regeln, nicht nur neuere Trainingsdaten; Verhaltensdrift kann eine Anpassung der Nutzerführung oder Schnittstelle statt einer Modelländerung erfordern. Der zentrale methodische Fehler ist, jeden beobachteten Drift-Alarm (typischerweise ein Rückgang einer überwachten Qualitätsmetrik gegenüber einem Referenzfenster) automatisch als Modellversagen zu interpretieren und reflexartig ein Nachtraining anzustoßen, ohne zunächst zu untersuchen, welche der drei Drift-Arten tatsächlich vorliegt — die falsche Reaktion (z. B. Nachtraining bei tatsächlichem Konzept-Drift) behebt das eigentliche Problem nicht.

~~~text
Data drift: INPUT distribution changes, underlying input->output relationship stays the SAME
  (e.g. seasonal shift in query mix, but correct answer per query type unchanged)
Concept drift: underlying input->output relationship ITSELF changes, input distribution may stay the same
  (e.g. a business rule or external fact changes -- same query now needs a different correct answer)
Behavioral drift: change in USER behavior/interaction with the system itself
  (users phrase queries differently, adopt new features, react differently to responses)
EACH REQUIRES A DIFFERENT RESPONSE:
  data drift    -> often addressable via retraining with more current, representative data
  concept drift -> requires updating the underlying knowledge/rules, NOT just newer training data
  behavioral drift -> may need UX/guidance changes, not a model change at all
CORE ERROR: treating every drift alarm as "model failure" -> reflexive retraining WITHOUT diagnosing which type
  -> wrong response (e.g. retraining for actual concept drift) doesn't fix the real problem
~~~

## Core Concepts, Architektur und Implementierung

| Drift-Art | Was sich ändert | Typische korrekte Reaktion |
|---|---|---|
| Daten-Drift | Verteilung der Eingaben, Zusammenhang bleibt gleich | Nachtraining mit aktuelleren, repräsentativen Daten |
| Konzept-Drift | zugrunde liegender Zusammenhang zwischen Eingabe und korrekter Ausgabe | Aktualisierung der Wissensbasis/Regeln, nicht nur neuere Trainingsdaten |
| Verhaltensdrift | Nutzungsverhalten/Interaktion mit dem System | Anpassung der Nutzerführung/Schnittstelle statt Modelländerung |

Implementierung: Eine überwachte Qualitätsmetrik wird gegen ein definiertes Referenzfenster (z. B. die letzten n Wochen unter als stabil bekannten Bedingungen) verglichen; ein signifikanter Rückgang löst einen Drift-Alarm aus. Statt sofort ein Nachtraining anzustoßen, wird zunächst untersucht: hat sich die Eingabeverteilung verändert (Daten-Drift), hat sich die korrekte Antwort für gleichbleibende Eingaben verändert (Konzept-Drift), oder hat sich das Nutzerverhalten selbst verändert (Verhaltensdrift)? Erst nach dieser Diagnose wird die jeweils passende Reaktion (Nachtraining, Wissensbasis-Update, oder UX-Anpassung) veranlasst.

## Scalability, Reliability, Security und Observability

Drift-Überwachung skaliert Frühwarnfähigkeit proportional zur Sensitivität und Aktualität des Referenzfensters; die Reliability-Grenze liegt darin, dass eine falsche Diagnose (Drift-Art wird verwechselt) proportional zur Häufigkeit falscher Reaktionen das eigentliche Qualitätsproblem ungelöst lässt, während Ressourcen in die falsche Gegenmaßnahme fließen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine überwachte Qualitätsmetrik sinkt gegenüber dem Referenzfenster, ein Nachtraining mit neueren Daten bringt aber keine Verbesserung | tatsächlich liegt Konzept-Drift vor (die korrekte Antwort selbst hat sich geändert), kein reiner Daten-Drift | prüfen, ob sich die zugrunde liegende Wissensbasis oder ein externer Sachverhalt geändert hat, statt nur die Eingabeverteilung zu betrachten |
| eine Qualitätsmetrik sinkt, obwohl weder die Eingabeverteilung noch der zugrunde liegende Zusammenhang sich erkennbar geändert haben | Verhaltensdrift liegt vor — Nutzer interagieren anders mit dem System | das Nutzungsverhalten (neue Anfrageformulierungen, veränderte Interaktionsmuster) explizit untersuchen |
| ein Team stößt bei jedem Drift-Alarm reflexartig ein vollständiges Nachtraining an, ohne die Ursache zu diagnostizieren | kein strukturierter Untersuchungsprozess zur Unterscheidung der Drift-Arten ist etabliert | einen verpflichtenden Diagnoseschritt vor jeder Reaktion auf einen Drift-Alarm einführen |

Security: Eine falsch diagnostizierte Konzept-Drift (z. B. eine geänderte Sicherheits- oder Compliance-Regel), die fälschlich als reiner Daten-Drift behandelt und durch Nachtraining "gelöst" wird, kann dazu führen, dass ein System weiterhin nach der veralteten, nicht mehr korrekten Regel operiert. Observability: Die Qualitätsmetrik im Vergleich zum Referenzfenster, die gemessene Eingabeverteilungsverschiebung, sowie dokumentierte Änderungen an externen Sachverhalten oder Nutzungsmustern sind zentrale Diagnosemetriken.

## Trade-offs und Entscheidungen

**Staff** implementiert einen strukturierten Diagnoseschritt vor jeder Reaktion auf einen Drift-Alarm. **Principal** macht die diagnostizierte Drift-Art und die gewählte Reaktion für das Team nachvollziehbar. **Chief** etabliert diesen strukturierten Untersuchungsprozess als Governance-Standard, um eine vorschnelle Gleichsetzung von Drift mit Modellversagen im Unternehmen zu verhindern.

Anti-Patterns: bei jedem Drift-Alarm reflexartig ein Nachtraining anstoßen, ohne die Drift-Art zu diagnostizieren; Konzept-Drift durch reines Nachtraining statt durch eine Aktualisierung der Wissensbasis adressieren; Verhaltensdrift als Modellproblem statt als UX-/Interaktionsproblem behandeln.

## Production Checklist

- [ ] Ein Drift-Alarm löst zunächst einen strukturierten Diagnoseschritt aus, bevor eine Reaktion erfolgt.
- [ ] Daten-, Konzept- und Verhaltensdrift werden explizit unterschieden.
- [ ] Die gewählte Reaktion (Nachtraining, Wissensbasis-Update, UX-Anpassung) entspricht der diagnostizierten Drift-Art.
- [ ] Das verwendete Referenzfenster wird regelmäßig auf Aktualität und Repräsentativität geprüft.

## Interviewfragen

### 1. Was unterscheidet Daten-Drift von Konzept-Drift?

**Antwort:** Bei Daten-Drift ändert sich die Verteilung der Eingaben, während der Zusammenhang zwischen Eingabe und korrekter Ausgabe gleich bleibt; bei Konzept-Drift ändert sich dieser zugrunde liegende Zusammenhang selbst.

### 2. Was ist Verhaltensdrift, und wie unterscheidet sie sich von den beiden anderen Drift-Arten?

**Antwort:** Eine Veränderung im Nutzungsverhalten oder in der Interaktion mit dem System selbst, die weder reine Daten- noch reine Konzeptdrift ist, sondern die Mensch-System-Interaktion betrifft.

### 3. Warum ist es ein Fehler, jeden Drift-Alarm automatisch mit Modellversagen gleichzusetzen?

**Antwort:** Die drei Drift-Arten erfordern grundsätzlich unterschiedliche Reaktionen; eine falsche Reaktion (z. B. Nachtraining bei tatsächlichem Konzept-Drift) behebt das eigentliche Problem nicht.

### 4. Wie reagierst du typischerweise auf erkannten Konzept-Drift im Vergleich zu Daten-Drift?

**Antwort:** Bei Daten-Drift trainiere ich mit aktuelleren, repräsentativen Daten nach; bei Konzept-Drift aktualisiere ich die zugrunde liegende Wissensbasis oder die Regeln, da neuere Trainingsdaten allein den veränderten Zusammenhang nicht korrigieren.

### 5. Wie gehst du vor, wenn ein Nachtraining nach einem Drift-Alarm keine Verbesserung bringt?

**Antwort:** Ich prüfe, ob tatsächlich Konzept-Drift statt Daten-Drift vorliegt, indem ich untersuche, ob sich die zugrunde liegende Wissensbasis oder ein externer Sachverhalt geändert hat.

### 6. Widersprüchliche Anforderung: Team will bei jedem Qualitätsabfall sofortiges Nachtraining UND garantiert die tatsächlich richtige, ursachengerechte Reaktion — wie gehst du vor?

**Antwort:** Ich würde einen kurzen, standardisierten Diagnoseschritt (Vergleich der Eingabeverteilung, Prüfung auf bekannte externe Sachverhaltsänderungen, Prüfung des Nutzungsverhaltens) vor jeder Reaktion etablieren, der schnell genug ist, um die Reaktionsgeschwindigkeit kaum zu verlangsamen, aber sicherstellt, dass die gewählte Reaktion tatsächlich zur diagnostizierten Ursache passt.

## Praktische Labs

~~~python
import random

random.seed(0)

def reference_window_accuracy():
    return 0.90  # stable historical baseline

def data_drift_scenario():
    # Input distribution shifts, but input->output relationship unchanged -> retraining helps
    return 0.78

def concept_drift_scenario():
    # Same inputs, but correct answer has changed -> retraining on OLD-labeled data won't help
    return 0.75

def behavioral_drift_scenario():
    # Users interact differently (e.g. new phrasing patterns) -> not a model correctness issue per se
    return 0.80

scenarios = {
    "data_drift": data_drift_scenario(),
    "concept_drift": concept_drift_scenario(),
    "behavioral_drift": behavioral_drift_scenario(),
}

reference = reference_window_accuracy()
print(f"Reference window accuracy: {reference:.2f}\n")

for name, observed in scenarios.items():
    print(f"{name}: observed accuracy = {observed:.2f} (drop of {reference - observed:.2f}) -- SAME alarm signature")

print("\nAll three trigger the same surface-level alarm, but require DIFFERENT diagnosed responses:")
print("  data_drift       -> retrain with current, representative data")
print("  concept_drift    -> update underlying knowledge base/rules, retraining alone won't fix it")
print("  behavioral_drift -> investigate UX/interaction changes, may not be a model issue at all")
~~~

## Dependencies, Cross-References und Quellen

1. Gama et al.: [A Survey on Concept Drift Adaptation](https://dl.acm.org/doi/10.1145/2523813), abgerufen 2026-09-17.
2. Evidently AI-Dokumentation: [Data and Concept Drift](https://www.evidentlyai.com/ml-in-production/data-drift), abgerufen 2026-09-17.

Offline- und Online-Evaluation sind kanonisch in [KB-0368](18-offline-und-online-evaluation.md) behandelt; Robustheit und Verteilungsänderung in [KB-0345](../14-ml-engineering/15-robustheit-und-verteilungsaenderung.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Drift-Klassifikationswerkzeuge, die Daten-, Konzept- und Verhaltensdrift statistisch zu unterscheiden versuchen | Evaluating | Gegenüber rein manueller Diagnose abwägen, sobald die automatisierte Klassifikation nachweislich zuverlässig zwischen den Drift-Arten unterscheidet. |
| Kontinuierliches, mehrdimensionales Monitoring, das Eingabeverteilung, Ausgabequalität und Nutzungsverhalten gemeinsam überwacht | Adopting | Gegenüber isolierter Überwachung einzelner Dimensionen für ganzheitlichere Drift-Diagnose bevorzugen. |

Ein Team akzeptiert eine Reaktion auf einen Drift-Alarm erst, wenn eine dokumentierte Diagnose die tatsächliche Drift-Art bestätigt hat.
