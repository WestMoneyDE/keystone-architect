---
{"id": "KB-0572", "title": "Grafana und Betriebsdashboards", "domain": "24", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "CLOUD", "MLOPS"], "requires": [{"id": "KB-0571", "concepts": ["Prometheus"], "needed_for": "understanding"}, {"id": "KB-0567", "concepts": ["Metriken und Zeitreihen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Grafana-Dashboards mit SLO-, Ressourcen- und Nutzeransichten anhand offizieller Dokumentation korrekt aufbauen und Variablen für Drill-down-Navigation einsetzen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Diagnoseaufgabe explizit gestalten, welche Dashboard-Ansicht (SLO, Ressourcen, Nutzer) und welche Aggregationsebene tatsächlich benötigt wird, statt eine generische Sammelansicht bereitzustellen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine irreführende Aggregation in einem Dashboard (etwa ein Durchschnittswert, der einen kritischen Ausreißer verdeckt) erkennen und auf die tatsächliche zugrunde liegende Verteilung zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Dashboard-Gestaltung (SLO-first, Drill-down-Fähigkeit, Vermeidung irreführender Aggregationen) festlegen, die tatsächliche Diagnosefähigkeit statt bloßer visueller Vollständigkeit sicherstellen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Rendering- und Plugin-Architektur von Grafana im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Dashboard-Design für tatsächliche Diagnoseaufgaben, nicht die interne Rendering-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0572-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation einer irreführenden Durchschnittsaggregation, kein produktives Grafana-System verwendet", "evidence": "Ein lokales Skript simuliert, wie ein Durchschnittswert über eine Gruppe von Instanzen einen einzelnen, kritisch überlasteten Ausreißer verdeckt, und zeigt damit, dass eine aggregierte Dashboard-Ansicht ohne Drill-down-Möglichkeit auf die einzelnen zugrunde liegenden Werte ein irreführendes Gesamtbild erzeugen kann.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Grafana-System."}]}
---
# Grafana und Betriebsdashboards

> **Ziel:** Grafana visualisiert Metriken aus Datenquellen wie Prometheus (siehe [KB-0571](07-prometheus.md)) als Dashboards, die operative Entscheidungen unterstützen sollen. Der zentrale Punkt dieses Kapitels ist, dass ein Dashboard nur so nützlich ist wie seine tatsächliche Diagnosefähigkeit für eine konkrete Aufgabe — eine visuell vollständige, aber undifferenzierte Aggregation (etwa ein Durchschnittswert über viele Instanzen) kann kritische Ausreißer verdecken und damit ein irreführendes Gesamtbild erzeugen, selbst wenn das Dashboard formal alle relevanten Metriken anzeigt. SLO-, Ressourcen- und Nutzeransichten dienen unterschiedlichen Diagnoseaufgaben und müssen jeweils gezielt für diese Aufgabe gestaltet werden, mit Variablen und Drill-down-Fähigkeit, um von einer aggregierten Übersicht zu den tatsächlich zugrunde liegenden Einzelwerten navigieren zu können.

## Zweck, Mental Model und Dependencies

Ein Dashboard ist kein Selbstzweck, sondern ein Werkzeug für eine konkrete Diagnoseaufgabe — eine SLO-Ansicht (aufbauend auf den bereits in [KB-0565](01-sli-slo-und-sla.md) behandelten Zielwerten) beantwortet die Frage, ob ein Dienst innerhalb seines vereinbarten Zuverlässigkeitsziels arbeitet, eine Ressourcenansicht beantwortet die Frage, ob die zugrunde liegende Infrastruktur ausreichend Kapazität hat, und eine Nutzeransicht beantwortet die Frage, wie das System aus Sicht tatsächlicher Nutzeraktivität erscheint — diese drei Ansichten sollten nicht in einer einzigen, undifferenzierten Sammelansicht vermischt werden, da unterschiedliche Diagnoseaufgaben unterschiedliche Aggregationsebenen und unterschiedliche Zeiträume benötigen. Das zentrale Risiko bei Dashboard-Gestaltung ist die irreführende Aggregation: Ein Durchschnittswert über eine Gruppe von Instanzen kann einen einzelnen, kritisch überlasteten Ausreißer vollständig verdecken, da die übrigen, gesunden Instanzen den Durchschnitt nach unten ziehen — ein Dashboard, das nur den Durchschnitt zeigt, suggeriert fälschlich einen insgesamt gesunden Zustand, obwohl ein einzelner Nutzer oder Dienst tatsächlich eine kritische Störung erlebt. Variablen (etwa eine auswählbare Instanz- oder Regions-ID) und Drill-down-Fähigkeit (die Möglichkeit, von einer aggregierten Ansicht gezielt zu den Einzelwerten einer verdächtigen Gruppe zu navigieren) sind die strukturelle Antwort auf dieses Risiko — ein Dashboard, das nur aggregierte Werte ohne Drill-down-Möglichkeit zeigt, kann eine kritische Störung formal vollständig darstellen und sie inhaltlich dennoch vollständig verdecken.

~~~text
Grafana: visualizes metrics from data sources like Prometheus (KB-0571) as dashboards
KEY POINT: dashboard useful only as much as its ACTUAL diagnostic capability for a concrete task
  visually complete but undifferentiated aggregation (e.g. average over many instances)
  -> can hide critical outliers -> misleading overall picture, even if dashboard formally shows all relevant metrics
THREE DISTINCT VIEW TYPES, each for a different diagnostic task:
  SLO view (builds on KB-0565 targets) -> is service operating within agreed reliability target?
  Resource view -> does underlying infra have sufficient capacity?
  User view -> how does system appear from actual user activity perspective?
  -> should NOT be mixed into single undifferentiated collector view
    (different diagnostic tasks need different aggregation levels + time ranges)
CENTRAL RISK: misleading aggregation
  average over instance group can fully hide single critically-overloaded outlier
    (healthy instances pull average down)
  dashboard showing only average -> falsely suggests overall-healthy state
    even though single user/service experiences a critical incident
STRUCTURAL ANSWER: Variables (e.g. selectable instance/region ID) + Drill-down capability
  (navigate from aggregated view to individual values of a suspect group)
  dashboard w/ only aggregated values, NO drill-down
    -> can formally fully display a critical incident and substantively fully hide it
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| SLO-Ansicht | zeigt Zuverlässigkeit relativ zum vereinbarten Ziel | beantwortet "arbeitet der Dienst innerhalb des Ziels?" |
| Ressourcenansicht | zeigt Infrastrukturkapazität | beantwortet "reicht die zugrunde liegende Kapazität?" |
| Nutzeransicht | zeigt Systemzustand aus Nutzersicht | beantwortet "wie erscheint das System tatsächlich Nutzern?" |
| Variablen und Drill-down | Navigation von Aggregation zu Einzelwerten | verhindert irreführende Verdeckung von Ausreißern |

Implementierung: Jede Dashboard-Ansicht wird gezielt für ihre jeweilige Diagnoseaufgabe gestaltet, statt eine generische Sammelansicht zu erstellen. Variablen ermöglichen die Auswahl einzelner Instanzen, Regionen oder Dienste innerhalb einer Ansicht. Drill-down-Panels ermöglichen die Navigation von einer aggregierten Metrik zu den zugrunde liegenden Einzelwerten einer verdächtigen Gruppe.

## Scalability, Reliability, Security und Observability

Grafana skaliert die tatsächliche Diagnosefähigkeit proportional zur gezielten Gestaltung der SLO-, Ressourcen- und Nutzeransichten für ihre jeweilige Diagnoseaufgabe und zur konsequenten Bereitstellung von Drill-down-Fähigkeit; die Reliability-Grenze liegt darin, dass eine rein aggregierte Ansicht ohne Drill-down kritische Ausreißer strukturell verdecken kann, unabhängig von der visuellen Vollständigkeit des Dashboards.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Dashboard zeigt einen insgesamt gesunden Durchschnittswert, während einzelne Nutzer eine Störung melden | eine irreführende Aggregation verdeckt einen einzelnen, kritisch überlasteten Ausreißer | über Variablen und Drill-down zu den Einzelwerten der verdächtigen Instanzgruppe navigieren |
| ein Dashboard beantwortet die eigentliche Diagnosefrage nicht zuverlässig | die Ansicht vermischt SLO-, Ressourcen- und Nutzerperspektive in einer undifferenzierten Sammelansicht | die Ansicht in gezielt auf die jeweilige Diagnoseaufgabe zugeschnittene Teilansichten aufteilen |
| ein Nutzer kann eine verdächtige Gruppe nicht gezielt untersuchen | keine Variablen oder Drill-down-Panels sind im Dashboard vorhanden | Variablen für auswählbare Dimensionen und Drill-down-Panels ergänzen |

Security: Dashboards mit sensiblen Betriebsdaten sollten nicht ohne Zugriffskontrolle öffentlich erreichbar sein. Observability: Die tatsächliche Nutzung einzelner Dashboard-Panels (welche Ansichten tatsächlich zur Diagnose herangezogen werden) ist ein zentrales Signal zur Bewertung, ob eine Dashboard-Gestaltung tatsächlich diagnostisch wirksam ist, statt nur formal vollständig zu erscheinen.

## Trade-offs und Entscheidungen

**Staff** baut ein Dashboard für eine gegebene Diagnoseaufgabe mit korrekten Panels auf. **Principal** entwirft die vollständige Dashboard-Struktur (SLO-, Ressourcen-, Nutzeransicht) mit Variablen und Drill-down für ein System. **Chief** legt unternehmensweite Standards für Dashboard-Gestaltung fest, die irreführende Aggregationen strukturell vermeiden.

Anti-Patterns: eine einzige, undifferenzierte Sammelansicht für alle Diagnoseaufgaben verwenden; ausschließlich aggregierte Durchschnittswerte ohne Drill-down-Möglichkeit zu Einzelwerten anzeigen; ein Dashboard als vollständig betrachten, weil es visuell alle relevanten Metriken zeigt, ohne die tatsächliche Diagnosefähigkeit für konkrete Aufgaben zu prüfen.

## Production Checklist

- [ ] SLO-, Ressourcen- und Nutzeransichten sind als getrennte, gezielt gestaltete Dashboards vorhanden.
- [ ] Variablen ermöglichen die Auswahl einzelner Instanzen, Regionen oder Dienste.
- [ ] Drill-down-Panels ermöglichen die Navigation von Aggregation zu Einzelwerten.
- [ ] Dashboards mit sensiblen Betriebsdaten sind nicht ohne Zugriffskontrolle öffentlich erreichbar.

## Interviewfragen

### 1. Welche drei Dashboard-Ansichten werden typischerweise unterschieden und wofür dienen sie?

**Antwort:** SLO-Ansicht (beantwortet, ob der Dienst innerhalb des Zuverlässigkeitsziels arbeitet), Ressourcenansicht (beantwortet, ob die Infrastrukturkapazität ausreicht) und Nutzeransicht (beantwortet, wie das System aus tatsächlicher Nutzersicht erscheint).

### 2. Warum kann ein Durchschnittswert in einem Dashboard irreführend sein?

**Antwort:** Weil ein einzelner, kritisch überlasteter Ausreißer durch die übrigen, gesunden Instanzen im Durchschnitt verdeckt werden kann, sodass das Dashboard fälschlich einen insgesamt gesunden Zustand suggeriert.

### 3. Wofür werden Variablen in Grafana-Dashboards eingesetzt?

**Antwort:** Um innerhalb einer Ansicht einzelne Dimensionen wie Instanzen, Regionen oder Dienste gezielt auswählen zu können, statt nur eine feste, aggregierte Ansicht zu erhalten.

### 4. Wofür dient Drill-down-Fähigkeit in einem Dashboard?

**Antwort:** Um von einer aggregierten Metrikansicht gezielt zu den zugrunde liegenden Einzelwerten einer verdächtigen Gruppe navigieren zu können.

### 5. Wie gehst du vor, wenn ein Dashboard einen insgesamt gesunden Durchschnittswert zeigt, aber einzelne Nutzer eine Störung melden?

**Antwort:** Ich navigiere über Variablen und Drill-down-Panels zu den Einzelwerten der verdächtigen Instanzgruppe, da eine irreführende Durchschnittsaggregation einen einzelnen, kritisch überlasteten Ausreißer verdecken kann.

### 6. Widersprüchliche Anforderung: Team will ein einziges, übersichtliches Dashboard für alle Stakeholder UND getrennte, gezielt auf SLO/Ressourcen/Nutzer zugeschnittene Ansichten für tatsächliche Diagnosefähigkeit — wie gehst du vor?

**Antwort:** Ich würde eine gezielt aufgeteilte Dashboard-Struktur für die eigentliche Diagnosearbeit beibehalten, aber zusätzlich eine bewusst vereinfachte, aggregierte Übersichtsansicht für breitere Stakeholder bereitstellen, die explizit auf die detaillierten Ansichten verlinkt, statt eine einzige, undifferenzierte Ansicht zu erzwingen, die weder für Diagnose noch für Übersicht tatsächlich geeignet ist.

## Praktische Labs

~~~python
# Local, deterministic simulation of a misleading average hiding a critical outlier (executed locally, no real Grafana):

def check_average_vs_actual(instance_values):
    average = sum(instance_values) / len(instance_values)
    outliers = [v for v in instance_values if v > 90]  # critical threshold
    return {
        "average": average,
        "looks_healthy": average < 70,
        "actual_outliers": outliers,
        "misleading": average < 70 and len(outliers) > 0,
    }

instance_values = [20, 25, 30, 98]  # one critically overloaded instance among healthy ones
result = check_average_vs_actual(instance_values)
print(result)
~~~

## Dependencies, Cross-References und Quellen

1. Grafana-Dokumentation: [Grafana Dashboards Overview](https://grafana.com/docs/grafana/latest/dashboards/), abgerufen 2026-09-18.
2. Grafana-Dokumentation: [Templates and Variables](https://grafana.com/docs/grafana/latest/dashboards/variables/), abgerufen 2026-09-18.

Prometheus als Metrikquelle ist kanonisch in [KB-0571](07-prometheus.md) behandelt; SLI/SLO/SLA-Zielwerte in [KB-0565](01-sli-slo-und-sla.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte, automatische Anomalieerkennung innerhalb von Dashboard-Panels zur proaktiven Hervorhebung verdächtiger Ausreißer | Evaluating | Als ergänzenden Hinweis, nicht als Ersatz für gezielt gestaltete Drill-down-Fähigkeit, einsetzen, da automatische Erkennung eine bewusste Dashboard-Struktur nicht ersetzt. |

Ein Team akzeptiert eine Dashboard-Gestaltung erst, wenn SLO-, Ressourcen- und Nutzeransichten gezielt für ihre jeweilige Diagnoseaufgabe gestaltet sind und Variablen mit Drill-down-Fähigkeit irreführende Aggregationen nachweislich vermeiden.
