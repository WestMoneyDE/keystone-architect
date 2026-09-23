---
{"id": "KB-0637", "title": "Budgets und Forecasting", "domain": "27", "sequence": 3, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "PLATFORM", "GENAI", "CHIEF"], "requires": [{"id": "KB-0636", "concepts": ["Tagging und Kostenallokation"], "needed_for": "understanding"}, {"id": "KB-0582", "concepts": ["Betriebliche Kapazitätssteuerung"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Kostenverläufe und Wachstum für ein konkretes System anhand der bereits in KB-0636 behandelten Kostenallokation modellieren und daraus belastbare Budgetbandbreiten statt einzelner Punktschätzungen ableiten können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie saisonale Lasten sowie Preis- und Produktänderungen in ein Forecasting-Modell einfließen, das explizite Unsicherheitsbandbreiten statt einer einzelnen, scheinbar präzisen Kostenzahl liefert.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein Budget als einzelne Punktschätzung ohne Unsicherheitsbandbreite formuliert ist, und die daraus resultierende, irreführende Scheinpräzision von einer tatsächlich belastbaren Budgetprognose unterscheiden können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Forecasting festlegen, die explizite Unsicherheitsbandbreiten statt einzelner Punktschätzungen verbindlich vorschreiben, um Budgetentscheidungen auf einer tatsächlich belastbaren Grundlage zu treffen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, statistische Modellierung fortgeschrittener Prognoseverfahren im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis, warum Budgetbandbreiten statt Punktschätzungen notwendig sind, nicht die statistische Detailmodellierung einzelner Prognoseverfahren."}}, "lab_validation": [{"lab_id": "KB-0637-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Berechnung einer Budgetbandbreite aus historischen Kostenverläufen mit saisonaler Schwankung, kein produktives Forecasting-Tool verwendet", "evidence": "Ein lokales Skript berechnet aus historischen, saisonal schwankenden Kostendaten eine Budgetbandbreite (Minimum, wahrscheinlichster Wert, Maximum) statt einer einzelnen Punktschätzung und zeigt, wie diese Bandbreite tatsächliche Unsicherheit sichtbar macht.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Forecasting-Tool."}]}
---
# Budgets und Forecasting

> **Ziel:** Kosten-Forecasting modelliert Kostenverläufe, Wachstum und Unsicherheit für ein System, aufbauend auf der bereits in [KB-0636](02-tagging-und-kostenallokation.md) behandelten, verlässlichen Kostenallokation — eine Forecasting-Grundlage, die auf unvollständig zugeordneten oder verzerrten historischen Kostendaten basiert, kann keine tatsächlich belastbare Prognose liefern. Der zentrale Punkt dieses Kapitels ist, dass ein belastbares Budget als **Bandbreite** (Minimum, wahrscheinlichster Wert, Maximum) formuliert werden sollte, statt als einzelne, scheinbar präzise **Punktschätzung** — ein Budget, das eine einzelne Zahl als "die" erwartete Kostenprognose präsentiert, suggeriert eine Genauigkeit, die angesichts tatsächlicher Unsicherheitsfaktoren wie saisonaler Lasten (siehe die bereits in [KB-0582](../24-observability-sre/18-betriebliche-kapazitaetssteuerung.md) behandelte Kapazitätssteuerung) und künftiger Preis- oder Produktänderungen tatsächlich nicht besteht.

## Zweck, Mental Model und Dependencies

Eine Punktschätzung (etwa "die Kosten im nächsten Quartal werden 50.000 Euro betragen") suggeriert eine Genauigkeit, die bei einer Kostenprognose praktisch nie tatsächlich vorliegt — die tatsächlichen Kosten hängen von mehreren, nicht vollständig vorhersagbaren Faktoren ab (saisonale Nutzungsschwankungen, künftige Preisänderungen des Cloud-Anbieters, geplante oder ungeplante Produktänderungen, die die tatsächliche Ressourcennutzung verändern), und eine einzelne Zahl kann diese inhärente Unsicherheit nicht abbilden. Eine Budgetbandbreite (etwa "die Kosten werden voraussichtlich zwischen 45.000 und 58.000 Euro liegen, mit 50.000 Euro als wahrscheinlichstem Wert") macht diese tatsächliche Unsicherheit explizit sichtbar und ermöglicht dadurch fundiertere, geschäftliche Entscheidungen — eine Organisation kann anhand einer Bandbreite tatsächlich abwägen, wie sie mit dem oberen Ende der Unsicherheit umgehen möchte (etwa durch zusätzliche Reserven oder eine bewusste Risikoakzeptanz), während eine Punktschätzung diese Abwägung verdeckt und bei einer tatsächlichen Kostenüberschreitung fälschlich als "Prognosefehler" statt als erwartbare, aber unberücksichtigte Unsicherheit erscheint. Saisonale Lasten sind ein zentraler, oft unterschätzter Unsicherheitsfaktor: Ein System, dessen Nutzung tatsächlich saisonalen Schwankungen unterliegt (etwa erhöhte Last während bestimmter Geschäftsperioden), benötigt eine Forecasting-Methodik, die diese saisonale Struktur explizit berücksichtigt, statt eine lineare Fortschreibung historischer Durchschnittswerte anzuwenden, die saisonale Spitzen systematisch unterschätzen würde. Preis- und Produktänderungen sind eine zweite, praktisch bedeutsame Unsicherheitsquelle: Cloud-Anbieter ändern gelegentlich Preismodelle, und geplante Produktänderungen (etwa die Einführung eines neuen Features mit zusätzlichem Ressourcenbedarf) verändern die tatsächliche Kostenstruktur — ein belastbares Forecasting-Modell muss diese bekannten, geplanten Änderungen explizit einbeziehen, statt eine reine Fortschreibung vergangener Kostenmuster ohne Berücksichtigung bekannter, künftiger Veränderungen vorzunehmen.

~~~text
Cost forecasting: models cost trajectories, growth, uncertainty for a system
  builds on KB-0636's reliable cost allocation
  forecasting basis on incomplete/distorted historical cost data cannot yield actually
    reliable prognosis
KEY POINT: reliable budget should be formulated as RANGE (min, most-likely, max)
  instead of single, seemingly precise POINT ESTIMATE
  budget presenting single number as "the" expected cost forecast -> suggests precision
    that ACTUALLY doesn't exist given real uncertainty factors (seasonal load KB-0582,
    future price/product changes)
POINT ESTIMATE suggests precision practically never actually present in cost forecast
  actual costs depend on multiple, not-fully-predictable factors
    (seasonal usage fluctuation, future cloud provider price changes,
     planned/unplanned product changes altering actual resource use)
  single number cannot represent this inherent uncertainty
BUDGET RANGE ("costs expected between 45k-58k EUR, 50k most likely") makes this actual
  uncertainty EXPLICITLY visible -> enables more informed business decisions
  org can actually weigh how to handle upper end of uncertainty (additional reserves,
    deliberate risk acceptance)
  point estimate hides this tradeoff, and on actual cost overrun wrongly appears as
    "forecast error" instead of expectable-but-unaccounted uncertainty
SEASONAL LOAD = central, often-underestimated uncertainty factor
  system w/ actually seasonal usage fluctuation (elevated load during certain business periods)
  needs forecasting methodology explicitly accounting for this seasonal structure
  instead of applying linear extrapolation of historical averages
    (would systematically underestimate seasonal peaks)
PRICE/PRODUCT CHANGES = second, practically significant uncertainty source
  cloud providers occasionally change pricing models
  planned product changes (new feature w/ additional resource need) alter actual cost structure
  reliable forecasting model must explicitly incorporate these KNOWN, PLANNED changes
  instead of pure extrapolation of past cost patterns w/o considering known future changes
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Budgetbandbreite | zeigt Minimum, wahrscheinlichsten Wert, Maximum | macht tatsächliche Unsicherheit explizit sichtbar |
| Saisonale Forecasting-Methodik | berücksichtigt wiederkehrende Nutzungsschwankungen | verhindert systematische Unterschätzung von Lastspitzen |
| Preis-/Produktänderungs-Einbeziehung | integriert bekannte, künftige Veränderungen | verhindert reine, veraltete Fortschreibung vergangener Muster |
| Verlässliche Kostenbasis | baut auf vollständiger Tagging-/Allokationspraxis auf | verhindert Forecasting auf verzerrter Grundlage |

Implementierung: Kosten-Forecasting wird als Bandbreite (Minimum, wahrscheinlichster Wert, Maximum) formuliert, basierend auf einer vollständigen, verlässlichen Kostenallokation. Die Forecasting-Methodik berücksichtigt explizit saisonale Nutzungsmuster statt linearer Durchschnittsfortschreibung. Bekannte, geplante Preis- und Produktänderungen werden explizit in die Prognose einbezogen.

## Scalability, Reliability, Security und Observability

Budgets und Forecasting skalieren die tatsächliche Belastbarkeit von Kostenentscheidungen proportional zur expliziten Darstellung von Unsicherheit als Bandbreite statt Punktschätzung; die Reliability-Grenze liegt darin, dass eine Punktschätzung ohne Berücksichtigung saisonaler Lasten und bekannter Preis-/Produktänderungen eine irreführende Scheinpräzision suggeriert.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| tatsächliche Kosten überschreiten wiederholt das prognostizierte Budget | die Prognose wurde als Punktschätzung ohne saisonale Berücksichtigung oder Unsicherheitsbandbreite formuliert | eine Budgetbandbreite mit expliziter saisonaler Modellierung einführen |
| ein Budget erscheint präzise, basiert aber auf unvollständig zugeordneten historischen Kostendaten | die zugrunde liegende Kostenallokation aus KB-0636 war unvollständig oder verzerrt | die Tagging-Vollständigkeit prüfen, bevor die Forecasting-Grundlage verwendet wird |
| eine bekannte, geplante Produktänderung führt zu einer unerwarteten Kostenüberschreitung | die Prognose wurde ohne Berücksichtigung dieser bekannten, künftigen Änderung erstellt | bekannte, geplante Preis- und Produktänderungen explizit in die Prognose einbeziehen |

Security: Budgetprognosen für sicherheitsrelevante Infrastruktur sollten konservativ genug bemessen sein, um notwendige Sicherheitsmaßnahmen nicht durch zu knappe Kostenannahmen zu gefährden. Observability: Die tatsächliche Abweichung realer Kosten von der prognostizierten Bandbreite über die Zeit ist ein zentrales Signal zur Bewertung der Forecasting-Modellqualität.

## Trade-offs und Entscheidungen

**Staff** erstellt eine Kostenprognose für ein gegebenes System korrekt als Bandbreite statt Punktschätzung. **Principal** entwirft die vollständige Forecasting-Methodik mit saisonaler Modellierung und Preis-/Produktänderungs-Einbeziehung für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für Budgets und Forecasting fest, die Bandbreiten statt Punktschätzungen verbindlich vorschreiben.

Anti-Patterns: ein Budget als einzelne Punktschätzung ohne Unsicherheitsbandbreite präsentieren; saisonale Nutzungsschwankungen bei der Forecasting-Methodik ignorieren; bekannte, geplante Preis- oder Produktänderungen nicht in die Prognose einbeziehen.

## Production Checklist

- [ ] Budgetprognosen sind als Bandbreite (Minimum, wahrscheinlichster Wert, Maximum) formuliert.
- [ ] Die Forecasting-Methodik berücksichtigt explizit saisonale Nutzungsmuster.
- [ ] Bekannte, geplante Preis- und Produktänderungen sind in die Prognose einbezogen.
- [ ] Die Forecasting-Grundlage basiert auf vollständiger, verlässlicher Kostenallokation.

## Interviewfragen

### 1. Warum sollte ein Budget als Bandbreite statt als Punktschätzung formuliert werden?

**Antwort:** Weil eine einzelne Zahl eine Genauigkeit suggeriert, die angesichts tatsächlicher Unsicherheitsfaktoren (saisonale Lasten, künftige Preis-/Produktänderungen) nicht besteht, während eine Bandbreite diese Unsicherheit explizit sichtbar macht.

### 2. Warum ist eine lineare Fortschreibung historischer Durchschnittswerte für saisonale Systeme problematisch?

**Antwort:** Weil sie saisonale Lastspitzen systematisch unterschätzt, statt die wiederkehrende, saisonale Struktur der tatsächlichen Nutzung explizit zu berücksichtigen.

### 3. Warum müssen bekannte, geplante Preis- oder Produktänderungen explizit in eine Kostenprognose einbezogen werden?

**Antwort:** Weil eine reine Fortschreibung vergangener Kostenmuster diese bekannten, künftigen Veränderungen nicht abbildet und dadurch die tatsächliche Kostenstruktur verfehlt.

### 4. Warum ist eine verlässliche Kostenallokation Voraussetzung für belastbares Forecasting?

**Antwort:** Weil eine Forecasting-Grundlage auf unvollständig zugeordneten oder verzerrten historischen Kostendaten keine tatsächlich belastbare Prognose liefern kann.

### 5. Wie gehst du vor, wenn tatsächliche Kosten wiederholt das prognostizierte Budget überschreiten?

**Antwort:** Ich prüfe, ob die Prognose als Punktschätzung ohne saisonale Berücksichtigung oder Unsicherheitsbandbreite formuliert wurde, und führe eine Bandbreite mit expliziter saisonaler Modellierung ein.

### 6. Widersprüchliche Anforderung: Die Geschäftsführung will eine einzelne, klare Budgetzahl für die Planung UND das FinOps-Team will die tatsächliche Unsicherheit transparent darstellen — wie gehst du vor?

**Antwort:** Ich würde den wahrscheinlichsten Wert der Bandbreite als primäre Planungszahl kommunizieren, dabei aber explizit die zugehörige Bandbreite und die wesentlichen Unsicherheitsfaktoren als Kontext mitliefern, statt entweder eine irreführend präzise Einzelzahl oder eine für die Planung zu unhandliche, reine Bandbreite ohne Orientierungspunkt zu präsentieren.

## Praktische Labs

~~~python
# Local, deterministic simulation of computing a budget range from historical seasonal cost data (executed locally, no real forecasting tool):

def compute_budget_range(historical_costs):
    avg = sum(historical_costs) / len(historical_costs)
    min_cost = min(historical_costs)
    max_cost = max(historical_costs)
    return {"min": min_cost, "most_likely": round(avg), "max": max_cost}

historical_costs = [42000, 45000, 58000, 47000, 50000, 44000]  # includes a seasonal peak (58000)
print(compute_budget_range(historical_costs))
~~~

## Dependencies, Cross-References und Quellen

1. FinOps Foundation: [Forecasting — FinOps Capability](https://www.finops.org/framework/capabilities/forecasting/), abgerufen 2026-09-18.
2. FinOps Foundation: [Budgeting — FinOps Capability](https://www.finops.org/framework/capabilities/budgeting/), abgerufen 2026-09-18.

Tagging und Kostenallokation sind kanonisch in [KB-0636](02-tagging-und-kostenallokation.md) behandelt; betriebliche Kapazitätssteuerung in [KB-0582](../24-observability-sre/18-betriebliche-kapazitaetssteuerung.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, KI-gestützte Zeitreihenprognosemodelle zur Berechnung von Budgetbandbreiten aus historischen Kostendaten | Evaluating | Als ergänzendes, statistisches Werkzeug zur Bandbreitenberechnung einsetzen, jedoch bekannte, geplante Preis- und Produktänderungen weiterhin explizit und manuell in die Prognose einbeziehen, da automatisierte Modelle diese zukünftigen, noch nicht in historischen Daten sichtbaren Ereignisse nicht selbstständig erfassen können. |

Ein Team akzeptiert eine Kostenprognose erst, wenn sie als Bandbreite statt Punktschätzung formuliert ist, saisonale Muster explizit berücksichtigt und bekannte Preis-/Produktänderungen einbezieht.
