---
{"id": "KB-0583", "title": "Chaos Engineering", "domain": "24", "sequence": 19, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "CLOUD", "MLOPS"], "requires": [{"id": "KB-0580", "concepts": ["SRE Incident Response"], "needed_for": "understanding"}, {"id": "KB-0565", "concepts": ["SLI, SLO und SLA"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Chaos-Experiment mit expliziter Hypothese, begrenztem Blast Radius und definiertem Stoppsignal anhand offizieller Dokumentation korrekt planen und durchführen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein konkretes System explizit entscheiden, welche Abhängigkeitsausfälle kontrolliert injiziert werden sollten, um tatsächliche Resilienzannahmen zu prüfen, statt formale Redundanz ungeprüft als tatsächliche Resilienz vorauszusetzen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein Chaos-Experiment anhand tatsächlicher Nutzerwirkung statt anhand rein interner, technischer Erfolgsindikatoren bewerten können und ein Experiment bei Erreichen des definierten Stoppsignals korrekt abbrechen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Chaos-Engineering-Praxis festlegen, die Hypothesenprüfung, Blast-Radius-Begrenzung und Nutzerwirkungsbewertung strukturell verbindlich machen, bevor Resilienzannahmen als validiert gelten.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung spezifischer Chaos-Engineering-Werkzeuge im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Hypothesenbildung, Blast-Radius-Begrenzung und nutzerwirkungsbasierter Bewertung als methodische Grundlage, nicht die interne Werkzeugimplementierung."}}, "lab_validation": [{"lab_id": "KB-0583-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation eines begrenzten Chaos-Experiments mit Stoppsignal, kein produktives Chaos-Engineering-Werkzeug verwendet", "evidence": "Ein lokales Skript simuliert eine kontrollierte Abhängigkeitsausfall-Injektion mit begrenztem Blast Radius (nur ein kleiner Prozentsatz des Traffics betroffen) und zeigt, wie das Experiment automatisch gestoppt wird, sobald die beobachtete Nutzerwirkung eine vordefinierte Schwelle überschreitet.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Chaos-Engineering-Werkzeug oder Produktionssystem."}]}
---
# Chaos Engineering

> **Ziel:** Chaos Engineering prüft tatsächliche Systemresilienz durch kontrollierte, absichtliche Injektion von Abhängigkeitsausfällen — statt formale Redundanz (etwa "der Dienst hat drei Replikate") ungeprüft als tatsächliche Resilienz vorauszusetzen. Der zentrale Punkt dieses Kapitels ist, dass ein Chaos-Experiment methodisch diszipliniert durchgeführt werden muss: Es beginnt mit einer expliziten **Hypothese** (eine konkrete, überprüfbare Erwartung darüber, wie das System auf einen bestimmten Ausfall reagieren sollte), begrenzt seinen **Blast Radius** (den möglichen Schaden auf einen kontrollierten, kleinen Anteil des tatsächlichen Nutzerverkehrs), definiert ein **Stoppsignal** (einen vorab festgelegten Schwellenwert für tatsächliche Nutzerwirkung, bei dessen Überschreitung das Experiment sofort abgebrochen wird), und bewertet den Erfolg anhand tatsächlicher **Nutzerwirkung**, nicht anhand rein interner, technischer Erfolgsindikatoren.

## Zweck, Mental Model und Dependencies

Eine Hypothese für ein Chaos-Experiment muss konkret und überprüfbar formuliert sein (etwa "wenn Dienst A ausfällt, sollte Dienst B innerhalb von 5 Sekunden auf den Fallback-Pfad umschalten, ohne dass Nutzer eine Fehlermeldung sehen"), nicht vage ("wir testen, was passiert, wenn Dienst A ausfällt") — nur eine konkrete Hypothese ermöglicht eine eindeutige Bewertung, ob das System tatsächlich wie angenommen reagiert hat oder ob eine bislang unentdeckte Resilienzlücke besteht. Der begrenzte Blast Radius ist die zentrale Sicherheitsmaßnahme, die Chaos Engineering von unkontrolliertem, riskantem Experimentieren unterscheidet: Ein Experiment beginnt typischerweise mit einem sehr kleinen Anteil des tatsächlichen Verkehrs (etwa 1%) und wird nur bei erfolgreichem, unauffälligem Verlauf schrittweise ausgeweitet — dies stellt sicher, dass selbst eine unerwartet schlechte Reaktion des Systems nur eine kleine, kontrollierte Nutzergruppe betrifft, statt das gesamte System einem unkontrollierten Risiko auszusetzen. Das Stoppsignal ergänzt diese Sicherheitsmaßnahme um eine automatische Abbruchbedingung: Sobald eine vorab definierte, tatsächliche Nutzerwirkung (etwa eine Fehlerrate oder Latenzschwelle für die vom Experiment betroffene Nutzergruppe) überschritten wird, wird das Experiment sofort und automatisch beendet, unabhängig davon, ob die ursprüngliche Hypothese bereits vollständig geprüft wurde — die Sicherheit des Experiments hat strukturell Vorrang vor der Vollständigkeit der Hypothesenprüfung. Die Bewertung des Experiments erfolgt konsequent anhand tatsächlicher Nutzerwirkung statt anhand rein interner, technischer Signale: Ein System kann formal alle internen Health-Checks bestehen, während Nutzer tatsächlich Fehler oder erhöhte Latenz erleben — ein Chaos-Experiment, das nur interne Signale prüft, könnte eine tatsächliche Resilienzlücke übersehen, die erst in der tatsächlichen Nutzerwirkung sichtbar wird.

~~~text
Chaos Engineering: tests ACTUAL system resilience via controlled, deliberate dependency failure injection
  instead of assuming formal redundancy ("service has 3 replicas") = actual resilience, unverified
METHODICALLY DISCIPLINED experiment structure:
  HYPOTHESIS: concrete, verifiable expectation of system reaction to a specific failure
    (e.g. "if service A fails, service B should switch to fallback path within 5s, no user-visible error")
    NOT vague ("let's test what happens if service A fails")
    -> only concrete hypothesis enables clear judgment: did system react as expected, or undiscovered gap exists
  BLAST RADIUS: limits possible damage to controlled, small share of actual user traffic
    central safety measure distinguishing chaos engineering from uncontrolled, risky experimentation
    experiment starts with very small traffic share (e.g. 1%), only expanded gradually on success
    -> even unexpectedly bad system reaction affects only small, controlled user group
  STOP SIGNAL: predefined threshold for ACTUAL user impact (error rate, latency for affected group)
    exceeding it -> experiment immediately+automatically aborted
    regardless of whether original hypothesis was already fully tested
    -> experiment SAFETY structurally takes precedence over hypothesis-testing COMPLETENESS
  EVALUATION: consistently via ACTUAL user impact, not purely internal technical signals
    system can pass all internal health checks while users actually experience errors/latency
    chaos experiment checking only internal signals -> could miss actual resilience gap
      only visible in actual user impact
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Hypothese | konkrete, überprüfbare Erwartung an Systemreaktion | ermöglicht eindeutige Bewertung des Experiments |
| Blast Radius | begrenzt Experiment auf kleinen Verkehrsanteil | zentrale Sicherheitsmaßnahme gegen unkontrolliertes Risiko |
| Stoppsignal | automatischer Abbruch bei Überschreitung der Nutzerwirkungsschwelle | Sicherheit hat Vorrang vor Vollständigkeit |
| Nutzerwirkungsbewertung | bewertet Experimenterfolg anhand tatsächlicher Nutzererfahrung | deckt Lücken auf, die interne Signale übersehen |

Implementierung: Jedes Chaos-Experiment beginnt mit einer schriftlich formulierten, konkreten Hypothese. Der Blast Radius wird vorab auf einen kleinen, kontrollierten Verkehrsanteil begrenzt und nur bei erfolgreichem Verlauf schrittweise erweitert. Ein automatisches Stoppsignal basierend auf tatsächlicher Nutzerwirkung wird vor Beginn des Experiments konfiguriert. Die Auswertung erfolgt anhand tatsächlicher Nutzererfahrungssignale, nicht ausschließlich interner Health-Check-Ergebnisse.

## Scalability, Reliability, Security und Observability

Chaos Engineering skaliert die tatsächliche Resilienzvalidierung proportional zur methodischen Disziplin von Hypothese, Blast-Radius-Begrenzung und Stoppsignal; die Reliability-Grenze liegt darin, dass ein unkontrolliertes Experiment ohne begrenzten Blast Radius oder Stoppsignal selbst zu einem echten, ungeplanten Vorfall werden kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Chaos-Experiment führt zu einem unerwartet großflächigen Vorfall | der Blast Radius war nicht ausreichend begrenzt oder das Stoppsignal wurde zu spät ausgelöst | die Blast-Radius-Begrenzung und Stoppsignal-Konfiguration vor künftigen Experimenten überprüfen |
| ein Experiment zeigt keine eindeutige Aussage über die Systemresilienz | die zugrunde liegende Hypothese war zu vage formuliert | die Hypothese in eine konkrete, überprüfbare Erwartung umformulieren |
| ein System besteht ein Chaos-Experiment formal, aber Nutzer erleben dennoch Probleme | die Bewertung basierte auf internen Signalen statt tatsächlicher Nutzerwirkung | die Bewertungskriterien auf tatsächliche, nutzerseitige Signale umstellen |

Security: Chaos-Experimente sollten nicht unangekündigt gegen Systeme mit sicherheitskritischen Abhängigkeiten durchgeführt werden, ohne die entsprechenden Sicherheitsteams einzubeziehen. Observability: Die bereits in [KB-0580](16-sre-incident-response.md) behandelte Incident-Response-Infrastruktur (Alarmierung, Statuskommunikation) sollte während eines Chaos-Experiments aktiv beobachtet werden, um ein tatsächlich eskalierendes Experiment frühzeitig zu erkennen.

## Trade-offs und Entscheidungen

**Staff** plant und führt ein einzelnes Chaos-Experiment mit korrekter Hypothese, Blast-Radius-Begrenzung und Stoppsignal durch. **Principal** entwirft die vollständige Chaos-Engineering-Praxis für ein System, einschließlich schrittweiser Blast-Radius-Erweiterung. **Chief** legt unternehmensweite Standards fest, die Chaos-Engineering-Praxis als verbindlichen Bestandteil der Resilienzvalidierung etablieren.

Anti-Patterns: ein Chaos-Experiment ohne konkrete, überprüfbare Hypothese durchführen; ein Experiment ohne begrenzten Blast Radius direkt gegen den vollständigen Produktionsverkehr starten; formale interne Health-Check-Erfolge als ausreichenden Beleg für Resilienz akzeptieren, ohne tatsächliche Nutzerwirkung zu prüfen.

## Production Checklist

- [ ] Jedes Chaos-Experiment beginnt mit einer schriftlich formulierten, konkreten Hypothese.
- [ ] Der Blast Radius ist vorab begrenzt und wird nur bei erfolgreichem Verlauf schrittweise erweitert.
- [ ] Ein automatisches Stoppsignal basierend auf tatsächlicher Nutzerwirkung ist konfiguriert.
- [ ] Die Bewertung erfolgt anhand tatsächlicher Nutzererfahrungssignale, nicht ausschließlich interner Signale.

## Interviewfragen

### 1. Warum muss eine Chaos-Experiment-Hypothese konkret und überprüfbar formuliert sein?

**Antwort:** Weil nur eine konkrete Hypothese eine eindeutige Bewertung ermöglicht, ob das System tatsächlich wie angenommen reagiert hat oder ob eine bislang unentdeckte Resilienzlücke besteht.

### 2. Was ist der Zweck des begrenzten Blast Radius?

**Antwort:** Er begrenzt den möglichen Schaden eines Experiments auf einen kleinen, kontrollierten Anteil des tatsächlichen Verkehrs, sodass selbst eine unerwartet schlechte Systemreaktion nur eine kleine Nutzergruppe betrifft.

### 3. Was passiert, wenn während eines Experiments das Stoppsignal ausgelöst wird?

**Antwort:** Das Experiment wird sofort und automatisch beendet, unabhängig davon, ob die ursprüngliche Hypothese bereits vollständig geprüft wurde — Sicherheit hat Vorrang vor Vollständigkeit.

### 4. Warum sollte die Bewertung eines Chaos-Experiments auf tatsächlicher Nutzerwirkung statt auf internen Signalen basieren?

**Antwort:** Weil ein System formal alle internen Health-Checks bestehen kann, während Nutzer tatsächlich Fehler oder erhöhte Latenz erleben, sodass rein interne Signale eine tatsächliche Resilienzlücke übersehen könnten.

### 5. Wie gehst du vor, wenn ein Chaos-Experiment zu einem unerwartet großflächigen Vorfall führt?

**Antwort:** Ich prüfe, ob der Blast Radius ausreichend begrenzt war und ob das Stoppsignal korrekt und rechtzeitig ausgelöst hat, und passe die Sicherheitskonfiguration vor künftigen Experimenten entsprechend an.

### 6. Widersprüchliche Anforderung: Team will schnelle, umfassende Resilienzvalidierung UND minimales Risiko für tatsächliche Produktionsnutzer — wie gehst du vor?

**Antwort:** Ich würde mit einem sehr kleinen Blast Radius und einer klar begrenzten Hypothese beginnen und den Umfang schrittweise nur bei nachweislich erfolgreichem, unauffälligem Verlauf erweitern, statt entweder auf umfassende Validierung zu verzichten oder ein unkontrolliert großes Experiment direkt gegen den vollständigen Produktionsverkehr zu starten.

## Praktische Labs

~~~python
# Local, deterministic simulation of a chaos experiment with blast radius and stop signal (executed locally, no real chaos tool):

def run_chaos_experiment(user_traffic, blast_radius_pct, stop_threshold_error_rate):
    affected = int(len(user_traffic) * blast_radius_pct / 100)
    affected_group = user_traffic[:affected]
    error_rate = sum(1 for u in affected_group if u["errored"]) / len(affected_group)
    return {
        "affected_users": affected,
        "observed_error_rate": error_rate,
        "experiment_stopped": error_rate > stop_threshold_error_rate,
    }

user_traffic = [{"errored": i % 4 == 0} for i in range(1000)]  # simulated 25% error rate in affected group
print(run_chaos_experiment(user_traffic, blast_radius_pct=5, stop_threshold_error_rate=0.10))
~~~

## Dependencies, Cross-References und Quellen

1. Principles of Chaos Engineering: [principlesofchaos.org](https://principlesofchaos.org/), abgerufen 2026-09-18.
2. Netflix Technology Blog: [Chaos Engineering Upgraded](https://netflixtechblog.com/chaos-engineering-upgraded-878d341f15fa), abgerufen 2026-09-18.

SRE Incident Response ist kanonisch in [KB-0580](16-sre-incident-response.md) behandelt; SLI/SLO-Grundlagen für Nutzerwirkungsbewertung in [KB-0565](01-sli-slo-und-sla.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Kontinuierliches, automatisiertes Chaos Engineering direkt in CI/CD-Pipelines vor Produktionsausrollung | Evaluating | Gegen die Reife der bestehenden manuellen Chaos-Praxis und der Blast-Radius-Kontrollmechanismen abwägen, bevor automatisierte Fehlerinjektion routinemäßig in Deployment-Pipelines integriert wird. |

Ein Team akzeptiert eine Chaos-Engineering-Praxis erst, wenn Hypothesenbildung, Blast-Radius-Begrenzung und Stoppsignal nachweislich methodisch diszipliniert angewendet werden und die Bewertung konsequent auf tatsächlicher Nutzerwirkung basiert.
