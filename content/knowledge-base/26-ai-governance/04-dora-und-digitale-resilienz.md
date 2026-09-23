---
{"id": "KB-0620", "title": "DORA und digitale Resilienz", "domain": "26", "sequence": 4, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "GENAI", "CHIEF"], "requires": [{"id": "KB-0586", "concepts": ["Disaster Recovery und Übungen"], "needed_for": "understanding"}, {"id": "KB-0619", "concepts": ["NIS2 und Sicherheitsorganisation"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "IKT-Risiken, Drittparteirisiken und Resilienztests für einen relevanten Finanzkontext anhand offizieller Quellen einordnen und mit technischen Kontrollnachweisen verbinden können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation im relevanten Finanzkontext explizit gestalten, wie DORA-Resilienztests auf der bereits in KB-0586 behandelten Disaster-Recovery-Übungsmethodik aufbauen und wie Auslagerungs-/Exit-Anforderungen technisch nachweisbar gemacht werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein formal durchgeführter Resilienztest nicht den DORA-Anforderungen an tatsächliche, nachweisbare Testtiefe entspricht, und den Unterschied zu einer oberflächlichen, nicht ausreichenden Übung benennen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für DORA-Compliance festlegen, die IKT-Risikomanagement, Drittparteirisiken und Resilienztests mit nachvollziehbaren, technischen Kontrollnachweisen verbinden.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die vollständige, juristische Detailauslegung der DORA-Verordnung im Detail ist Vertiefung und erfordert juristische Fachberatung.", "rationale": "Kern ist die technische Verbindung von Resilienztests und Auslagerungsanforderungen mit bestehender DR-Übungsmethodik, nicht die abschließende, juristische Auslegung."}}, "lab_validation": [{"lab_id": "KB-0620-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Prüfung, ob ein Resilienztest die DORA-Anforderungen an tatsächliche Testtiefe erfüllt, kein produktives Compliance-Tool verwendet", "evidence": "Ein lokales Skript prüft eine Liste durchgeführter Resilienztests darauf, ob sie tatsächliche, kritische Drittparteiabhängigkeiten einbeziehen, statt sich nur auf intern kontrollierte Systeme zu beschränken, und markiert unvollständige Tests entsprechend.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Compliance-Tool und keine juristische Beratung."}]}
---
# DORA und digitale Resilienz

> **Ziel:** DORA (Digital Operational Resilience Act) verlangt von Organisationen im relevanten Finanzkontext ein systematisches Management von **IKT-Risiken**, eine explizite Bewertung von **Drittparteirisiken** (insbesondere bei kritischen IKT-Dienstleistern), regelmäßige **Resilienztests**, und klare **Auslagerungs- und Exit-Anforderungen** (wie eine Organisation im Falle eines Ausfalls oder einer Vertragsbeendigung eines kritischen Drittanbieters tatsächlich handlungsfähig bleibt). Der zentrale Punkt dieses Kapitels ist, dass DORA-Resilienztests auf der bereits in [KB-0586](../24-observability-sre/22-disaster-recovery-und-uebungen.md) behandelten Disaster-Recovery-Übungsmethodik aufbauen, jedoch eine zusätzliche, tatsächlich nachweisbare Testtiefe erfordern — ein Resilienztest, der sich ausschließlich auf intern kontrollierte Systeme beschränkt, ohne tatsächlich kritische Drittparteiabhängigkeiten einzubeziehen, erfüllt die DORA-Anforderungen nicht, selbst wenn er formal als "durchgeführter Resilienztest" dokumentiert wird.

## Zweck, Mental Model und Dependencies

IKT-Risikomanagement unter DORA geht über die bereits in anderen Kapiteln behandelte, allgemeine Kapazitäts- und Verfügbarkeitsplanung hinaus, indem es explizit die Abhängigkeit von Drittanbietern in die Risikobewertung einbezieht — eine Organisation, die einen kritischen Geschäftsprozess über einen externen Cloud- oder IKT-Dienstleister abwickelt, trägt weiterhin die eigentliche Verantwortung für die digitale Resilienz dieses Prozesses, auch wenn die technische Ausführung ausgelagert ist; diese Verantwortung lässt sich nicht durch bloße vertragliche Auslagerung an den Drittanbieter übertragen. Resilienztests unter DORA bauen auf derselben methodischen Grundlage wie die bereits in [KB-0586](../24-observability-sre/22-disaster-recovery-und-uebungen.md) behandelten, tatsächlich geprobten DR-Übungen auf (die Notwendigkeit, Annahmen nicht nur zu dokumentieren, sondern tatsächlich zu testen), gehen jedoch in ihrer erforderlichen Testtiefe darüber hinaus: Ein DORA-konformer Resilienztest muss tatsächlich kritische Drittparteiabhängigkeiten einbeziehen (etwa das Szenario eines Ausfalls eines kritischen Cloud-Anbieters), nicht nur intern kontrollierte Systeme — ein Test, der ausschließlich prüft, wie gut die eigene, intern kontrollierte Infrastruktur einen Ausfall übersteht, ohne die tatsächliche Abhängigkeit von externen, kritischen Dienstleistern in das Testszenario einzubeziehen, deckt genau die Risikodimension nicht ab, die DORA explizit adressieren soll. Auslagerungs- und Exit-Anforderungen ergänzen dies um eine vorausschauende Dimension: Eine Organisation muss nicht nur nachweisen, dass sie einen Ausfall eines kritischen Drittanbieters kurzfristig übersteht, sondern auch, dass sie im Falle einer notwendigen, längerfristigen Beendigung der Zusammenarbeit mit diesem Anbieter (etwa aufgrund wiederholter Ausfälle oder einer Vertragsbeendigung) tatsächlich in der Lage ist, zu einem alternativen Anbieter oder einer internen Lösung zu wechseln, ohne dass der betroffene Geschäftsprozess dauerhaft unterbrochen wird — dieser Exit-Nachweis erfordert eine konkrete, technisch geprüfte Migrationsfähigkeit, nicht nur eine vertragliche Kündigungsoption.

~~~text
DORA (Digital Operational Resilience Act): requires orgs in relevant financial context:
  systematic ICT RISK management, explicit THIRD-PARTY RISK assessment (esp. critical ICT providers),
  regular RESILIENCE TESTS, clear OUTSOURCING/EXIT requirements
  (how org actually stays functional if a critical third-party fails or contract ends)
KEY POINT: DORA resilience tests build on KB-0586 DR exercise methodology
  but require ADDITIONAL, actually-demonstrable TEST DEPTH
  test limited exclusively to internally-controlled systems, w/o actually including critical
    third-party dependencies -> does NOT satisfy DORA requirements
    even if formally documented as "conducted resilience test"
ICT RISK MANAGEMENT under DORA goes beyond general capacity/availability planning by explicitly
  including third-party dependency in risk assessment
  org running critical business process via external cloud/ICT provider still carries ACTUAL
    responsibility for that process's digital resilience, even w/ execution outsourced
  this responsibility NOT transferable via mere contractual outsourcing to third party
RESILIENCE TESTS build on same methodological basis as KB-0586's actually-drilled DR exercises
  (necessity to not just document but ACTUALLY test assumptions)
  but go BEYOND in required test depth
  DORA-conformant test MUST actually include critical third-party dependencies
    (scenario: critical cloud provider outage), not just internally-controlled systems
  test checking ONLY how well internally-controlled infra survives outage, w/o including actual
    dependency on external critical providers in test scenario
    -> misses exactly the risk dimension DORA is meant to address
OUTSOURCING/EXIT requirements add forward-looking dimension:
  org must prove not just it survives short-term critical-provider outage
  but ALSO that in case of necessary, longer-term termination of collaboration w/ that provider
    (repeated outages, contract termination)
  it can actually switch to alternative provider or internal solution
    w/o permanently interrupting affected business process
  this exit proof requires CONCRETE, technically-verified migration capability, not just
    a contractual termination option
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| IKT-Risikomanagement | bezieht Drittparteirisiken explizit ein | Verantwortung bleibt bei auslagernder Organisation |
| Resilienztest mit Drittparteieinbindung | testet tatsächlich kritische externe Abhängigkeiten | unterscheidet DORA-konforme von oberflächlicher Übung |
| Auslagerungsanforderung | bewertet Risiko der Drittanbieterabhängigkeit vorab | Grundlage für Exit-Fähigkeitsprüfung |
| Technisch geprüfte Exit-Fähigkeit | nachweisbare Migrationsfähigkeit zu Alternative | ersetzt reine vertragliche Kündigungsoption |

Implementierung: IKT-Risikomanagement bezieht kritische Drittanbieter explizit als eigenständige Risikodimension ein, mit klarer Verantwortungszuordnung bei der auslagernden Organisation. Resilienztests werden so gestaltet, dass sie tatsächlich das Ausfallszenario kritischer Drittanbieter einbeziehen, aufbauend auf der bestehenden DR-Übungsmethodik. Für kritische Auslagerungen wird eine technisch geprüfte Exit-Fähigkeit zu einem alternativen Anbieter oder einer internen Lösung nachgewiesen.

## Scalability, Reliability, Security und Observability

DORA-Compliance skaliert die tatsächliche digitale Resilienz proportional zur Testtiefe, mit der kritische Drittparteiabhängigkeiten tatsächlich in Resilienztests einbezogen werden; die Reliability-Grenze liegt darin, dass ein Resilienztest ohne Einbeziehung tatsächlicher Drittparteiabhängigkeiten die eigentliche, von DORA adressierte Risikodimension unentdeckt lässt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein durchgeführter Resilienztest gilt formal als abgeschlossen, deckt aber ein tatsächliches Ausfallrisiko nicht ab | der Test beschränkte sich auf intern kontrollierte Systeme, ohne kritische Drittparteiabhängigkeiten einzubeziehen | den Testumfang um das Ausfallszenario kritischer Drittanbieter erweitern |
| eine Organisation kann bei einem tatsächlichen Ausfall eines kritischen Drittanbieters nicht rechtzeitig wechseln | keine technisch geprüfte Exit-Fähigkeit zu einer Alternative wurde vorab nachgewiesen | eine konkrete, technisch geprüfte Migrationsfähigkeit zu einem alternativen Anbieter etablieren |
| die Verantwortung für einen ausgelagerten, kritischen Prozess ist unklar | die Organisation hat die Verantwortung fälschlich als an den Drittanbieter vollständig übertragen behandelt | die eigene, fortbestehende Verantwortung für digitale Resilienz explizit dokumentieren und tragen |

Security: DORA-Resilienztests sollten mit begrenztem, kontrolliertem Risiko durchgeführt werden, analog zur bereits in Domain 24 behandelten Chaos-Engineering-Praxis. Observability: Die tatsächliche Einbeziehung kritischer Drittparteiabhängigkeiten in durchgeführte Resilienztests ist ein zentrales Signal zur Bewertung der DORA-Compliance-Tiefe.

## Trade-offs und Entscheidungen

**Staff** führt einen gegebenen Resilienztest korrekt mit Einbeziehung relevanter Drittparteiabhängigkeiten durch. **Principal** entwirft die vollständige DORA-Resilienztest- und Exit-Nachweisstrategie für eine Organisation im relevanten Finanzkontext. **Chief** legt unternehmensweite Standards für DORA-Compliance fest, die IKT-Risikomanagement mit tatsächlich technisch nachweisbarer Resilienz verbinden.

Anti-Patterns: Resilienztests auf intern kontrollierte Systeme beschränken, ohne kritische Drittparteiabhängigkeiten einzubeziehen; die Verantwortung für digitale Resilienz eines ausgelagerten Prozesses als vollständig an den Drittanbieter übertragen behandeln; eine Exit-Fähigkeit nur vertraglich statt technisch geprüft nachweisen.

## Production Checklist

- [ ] IKT-Risikomanagement bezieht kritische Drittanbieter explizit als eigenständige Risikodimension ein.
- [ ] Resilienztests beziehen tatsächlich kritische Drittparteiabhängigkeiten ein, nicht nur intern kontrollierte Systeme.
- [ ] Eine technisch geprüfte Exit-Fähigkeit zu einem alternativen Anbieter ist für kritische Auslagerungen nachgewiesen.
- [ ] Die Verantwortung für digitale Resilienz ausgelagerter Prozesse verbleibt explizit dokumentiert bei der Organisation.

## Interviewfragen

### 1. Warum erfüllt ein Resilienztest, der sich ausschließlich auf intern kontrollierte Systeme beschränkt, DORA nicht?

**Antwort:** Weil er die eigentliche, von DORA adressierte Risikodimension der Abhängigkeit von kritischen Drittanbietern nicht abdeckt, selbst wenn er formal als abgeschlossen dokumentiert wird.

### 2. Bleibt die Verantwortung für digitale Resilienz bei einem ausgelagerten, kritischen Prozess bei der Organisation?

**Antwort:** Ja, die vertragliche Auslagerung an einen Drittanbieter überträgt nicht die eigentliche Verantwortung für die digitale Resilienz dieses Prozesses.

### 3. Was ist der Unterschied zwischen einer vertraglichen Kündigungsoption und einer technisch geprüften Exit-Fähigkeit?

**Antwort:** Eine vertragliche Kündigungsoption ist eine rechtliche Möglichkeit, während eine technisch geprüfte Exit-Fähigkeit eine tatsächlich nachgewiesene, konkrete Migrationsfähigkeit zu einem alternativen Anbieter oder einer internen Lösung ist.

### 4. Worauf bauen DORA-Resilienztests methodisch auf, und was fordern sie zusätzlich?

**Antwort:** Sie bauen auf der Notwendigkeit tatsächlich geprobter, statt nur dokumentierter Übungen auf (wie bei Disaster-Recovery-Übungen), fordern aber zusätzlich die Einbeziehung tatsächlich kritischer Drittparteiabhängigkeiten in das Testszenario.

### 5. Wie gehst du vor, wenn ein durchgeführter Resilienztest ein tatsächliches Ausfallrisiko nicht abdeckt?

**Antwort:** Ich prüfe, ob der Test sich auf intern kontrollierte Systeme beschränkte, und erweitere den Testumfang um das Ausfallszenario tatsächlich kritischer Drittanbieter.

### 6. Widersprüchliche Anforderung: Die Organisation will minimale Störung des Produktivbetriebs durch Resilienztests UND vollständige DORA-Konformität mit realistischer Drittparteieinbindung — wie gehst du vor?

**Antwort:** Ich würde Resilienztests mit Drittparteieinbindung in kontrollierter, isolierter Umgebung mit begrenztem Risiko durchführen, analog zur Chaos-Engineering-Praxis, statt entweder auf realistische Drittparteieinbindung zu verzichten oder den Produktivbetrieb unkontrolliert zu gefährden.

## Praktische Labs

~~~python
# Local, deterministic simulation of checking resilience test coverage of third-party dependencies (executed locally, no real compliance tool):

def check_resilience_test(test):
    includes_critical_third_party = any(dep["critical"] for dep in test["scenario_dependencies"])
    return {"test": test["name"], "dora_compliant_depth": includes_critical_third_party}

tests = [
    {"name": "internal_db_failover_test", "scenario_dependencies": [{"name": "internal_db", "critical": False}]},
    {"name": "cloud_provider_outage_test", "scenario_dependencies": [{"name": "cloud_provider_x", "critical": True}]},
]

for t in tests:
    print(check_resilience_test(t))
~~~

## Dependencies, Cross-References und Quellen

1. Europäische Union: [Regulation (EU) 2022/2554 (DORA) — Official Text](https://eur-lex.europa.eu/eli/reg/2022/2554/oj), abgerufen 2026-09-18.
2. Europäische Bankenaufsichtsbehörde (EBA): [DORA Regulatory Technical Standards Overview](https://www.eba.europa.eu/regulation-and-policy/operational-resilience), abgerufen 2026-09-18.

Disaster Recovery und Übungsmethodik sind kanonisch in [KB-0586](../24-observability-sre/22-disaster-recovery-und-uebungen.md) behandelt; NIS2 und Sicherheitsorganisation in [KB-0619](03-nis2-und-sicherheitsorganisation.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Überwachung der Betriebsstabilität kritischer Drittanbieter zur frühzeitigen Erkennung von Auslagerungsrisiken | Evaluating | Als ergänzendes Frühwarnsystem einsetzen, jedoch die abschließende Bewertung der Exit-Notwendigkeit und -Fähigkeit weiterhin als menschliche, geschäftliche Entscheidung behandeln. |

Ein Team akzeptiert eine DORA-Compliance-Praxis erst, wenn Resilienztests nachweislich kritische Drittparteiabhängigkeiten einbeziehen und eine technisch geprüfte Exit-Fähigkeit für kritische Auslagerungen dokumentiert ist.
