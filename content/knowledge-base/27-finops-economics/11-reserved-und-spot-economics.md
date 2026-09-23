---
{"id": "KB-0645", "title": "Reserved und Spot Economics", "domain": "27", "sequence": 11, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "PLATFORM", "GENAI", "CHIEF"], "requires": [{"id": "KB-0637", "concepts": ["Budgets und Forecasting"], "needed_for": "understanding"}, {"id": "KB-0644", "concepts": ["Autoscaling Economics"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Bindung, Rabatte und Unterbrechungsrisiken für konkrete Kaufentscheidungen anhand der bereits in KB-0637 behandelten Forecasting-Unsicherheit vergleichen und flexible Lasten für Spot-Nutzung korrekt identifizieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Reserved- und Spot-Kapazität anhand tatsächlicher Forecastunsicherheit (statt einer einzelnen, angenommenen Punktschätzung) und tatsächlicher Lastflexibilität wirtschaftlich sinnvoll kombiniert werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Reserved-Kapazitätsbindung auf Basis einer unsicheren, punktschätzungsbasierten Prognose eingegangen wurde, und das daraus resultierende Risiko einer Fehlbindung von einer tatsächlich abgesicherten Kaufentscheidung unterscheiden können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Reserved- und Spot-Kapazitätsentscheidungen festlegen, die Forecastunsicherheit und tatsächliche Lastflexibilität verbindlich in die Kaufentscheidung einbeziehen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, produktspezifische Preisstruktur einzelner Cloud-Anbieter für Reserved- und Spot-Instanzen ist Vertiefung.", "rationale": "Kern ist die methodische Abwägung von Bindung, Rabatt und Unterbrechungsrisiko gegen Forecastunsicherheit und Lastflexibilität, nicht die produktspezifische Preisdetailkenntnis."}}, "lab_validation": [{"lab_id": "KB-0645-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Bewertung des Risikos einer Reserved-Kapazitätsbindung bei unsicherer Forecast-Bandbreite, kein produktives Kostenrechnungs-Tool verwendet", "evidence": "Ein lokales Skript vergleicht die erwarteten Kosten einer Reserved-Kapazitätsbindung basierend auf der wahrscheinlichsten Prognose mit den tatsächlichen Kosten bei Eintreten des unteren Bandbreitenrands, und zeigt das finanzielle Risiko einer Fehlbindung bei tatsächlich geringerer Nachfrage.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Kostenrechnungs-Tool."}]}
---
# Reserved und Spot Economics

> **Ziel:** Reserved-Kapazität bietet Preisrabatte gegenüber On-Demand-Preisen im Austausch für eine langfristige **Bindung** (etwa ein Jahr oder drei Jahre Nutzungsverpflichtung), während Spot-Kapazität noch größere Rabatte bietet, jedoch mit einem tatsächlichen **Unterbrechungsrisiko** (der Cloud-Anbieter kann Spot-Kapazität mit kurzer Vorankündigung jederzeit zurückfordern). Der zentrale Punkt dieses Kapitels ist, dass die Wahl zwischen Reserved- und Spot-Kapazität explizit die bereits in [KB-0637](03-budgets-und-forecasting.md) behandelte **Forecastunsicherheit** und die tatsächliche **Lastflexibilität** (kann eine Arbeitslast tatsächlich unterbrochen und später fortgesetzt werden, ohne geschäftlichen Schaden zu verursachen) berücksichtigen muss — eine Reserved-Bindung auf Basis einer unsicheren, als sicher behandelten Punktschätzung riskiert eine finanzielle Fehlbindung, während Spot-Kapazität für tatsächlich unterbrechungsunempfindliche Arbeitslasten erhebliche, wirtschaftlich sinnvolle Einsparungen ermöglicht, für tatsächlich unterbrechungsempfindliche Arbeitslasten jedoch ungeeignet ist.

## Zweck, Mental Model und Dependencies

Eine Reserved-Kapazitätsbindung ist eine finanzielle Wette auf eine bestimmte, künftige Nachfrage — der Rabatt wird im Austausch für die Verpflichtung gewährt, die gebundene Kapazität über die gesamte Bindungsdauer tatsächlich zu bezahlen, unabhängig davon, ob die tatsächliche Nachfrage diese Kapazität tatsächlich benötigt. Diese Bindung verbindet sich direkt mit der bereits in [KB-0637](03-budgets-und-forecasting.md) behandelten Forecastunsicherheit: Eine Reserved-Bindung, die auf Basis der wahrscheinlichsten Prognose (dem mittleren Wert einer Budgetbandbreite) eingegangen wird, ohne die tatsächliche Unsicherheit dieser Prognose zu berücksichtigen, riskiert eine finanzielle Fehlbindung, wenn die tatsächliche Nachfrage sich näher am unteren Rand der Bandbreite entwickelt — die Organisation zahlt dann für gebundene Kapazität, die tatsächlich nicht benötigt wird, ohne die Möglichkeit, diese Bindung vorzeitig zu beenden. Eine wirtschaftlich sinnvolle Reserved-Entscheidung bindet deshalb typischerweise nur den Anteil der Kapazität, der auch im unteren, pessimistischeren Bereich der Forecast-Bandbreite tatsächlich mit hoher Sicherheit benötigt wird, während der darüber hinausgehende, unsicherere Bedarf über flexiblere, nicht gebundene Kapazität gedeckt wird. Spot-Kapazität adressiert eine strukturell andere Frage: nicht die Unsicherheit der Nachfrage, sondern die tatsächliche Flexibilität der Arbeitslast gegenüber Unterbrechung — eine Arbeitslast, die tatsächlich unterbrochen und später fortgesetzt werden kann, ohne dass dies zu geschäftlichem Schaden führt (etwa Batch-Verarbeitung, die bei Unterbrechung einfach später fortgesetzt wird, oder Trainingsjobs mit regelmäßigen Zwischenspeicherungen), kann die erheblichen Spot-Rabatte tatsächlich wirtschaftlich nutzen, da eine tatsächliche Unterbrechung keinen tatsächlichen, geschäftlichen Schaden verursacht. Eine Arbeitslast, die tatsächlich unterbrechungsempfindlich ist (etwa eine interaktive Anwendung, bei der eine plötzliche Unterbrechung tatsächlich zu einer für Nutzer sichtbaren Störung führt), ist für Spot-Kapazität ungeeignet, unabhängig vom finanziellen Rabattanreiz — die wirtschaftlich sinnvolle Entscheidung erfordert deshalb eine explizite Klassifikation jeder Arbeitslast nach ihrer tatsächlichen Unterbrechungsempfindlichkeit, bevor eine Spot-Nutzung in Betracht gezogen wird.

~~~text
Reserved capacity: offers price discounts vs on-demand in exchange for long-term COMMITMENT
  (e.g. 1 or 3 years usage obligation)
Spot capacity: offers even larger discounts but w/ actual INTERRUPTION RISK
  (cloud provider can reclaim spot capacity w/ short notice anytime)
KEY POINT: choice between reserved and spot must explicitly account for KB-0637's forecast
  uncertainty AND actual LOAD FLEXIBILITY (can a workload actually be interrupted and later
  resumed w/o causing business harm)
  reserved commitment based on uncertain point estimate treated as certain -> risks financial
  mis-commitment
  spot capacity enables substantial, economically sound savings for actually interruption-
  insensitive workloads, but is unsuitable for actually interruption-sensitive workloads
RESERVED COMMITMENT = financial bet on specific, future demand
  discount granted in exchange for obligation to actually pay for committed capacity over
  whole commitment period, regardless of whether actual demand actually needs that capacity
  connects DIRECTLY to KB-0637 forecast uncertainty
  reserved commitment based on most-likely forecast (median of a budget range), w/o
  accounting for actual forecast uncertainty
  -> risks financial mis-commitment if actual demand develops closer to lower band edge
  org then pays for committed capacity actually not needed, w/o ability to prematurely end
  commitment
ECONOMICALLY SOUND reserved decision typically commits only the SHARE of capacity actually
  needed w/ high certainty even in lower, more pessimistic band of forecast
  while demand beyond that, more uncertain, covered via more flexible, uncommitted capacity
SPOT CAPACITY addresses structurally DIFFERENT question: not demand uncertainty, but actual
  workload flexibility toward interruption
  workload actually interruptible+later-resumable w/o business harm (batch processing simply
  resumed later, training jobs w/ regular checkpointing)
  -> can actually economically use substantial spot discounts, since actual interruption
     causes no actual business harm
  workload actually interruption-SENSITIVE (interactive app where sudden interruption actually
  causes user-visible disruption)
  -> unsuitable for spot capacity, REGARDLESS of financial discount incentive
  economically sound decision requires explicit classification of every workload by its
  actual interruption sensitivity, BEFORE considering spot usage
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Reserved-Bindung | Rabatt gegen langfristige Zahlungsverpflichtung | Risiko finanzieller Fehlbindung bei unsicherer Prognose |
| Forecast-Bandbreiten-Bindungsanteil | bindet nur mit hoher Sicherheit benötigte Kapazität | reduziert Risiko der Reserved-Fehlbindung |
| Spot-Unterbrechungsrisiko | Kapazität kann kurzfristig zurückgefordert werden | erfordert tatsächliche Lastflexibilität |
| Unterbrechungsempfindlichkeits-Klassifikation | bestimmt Eignung einer Arbeitslast für Spot | Voraussetzung vor jeder Spot-Nutzungsentscheidung |

Implementierung: Reserved-Kapazität wird nur für den Anteil der Kapazität gebunden, der auch im unteren, pessimistischeren Bereich der Forecast-Bandbreite mit hoher Sicherheit benötigt wird. Jede Arbeitslast wird explizit nach ihrer tatsächlichen Unterbrechungsempfindlichkeit klassifiziert, bevor eine Spot-Nutzungsentscheidung getroffen wird. Nur tatsächlich unterbrechungsunempfindliche Arbeitslasten werden auf Spot-Kapazität verlagert.

## Scalability, Reliability, Security und Observability

Reserved- und Spot-Economics skalieren die tatsächliche, wirtschaftliche Effizienz proportional zur Konsequenz, mit der Forecastunsicherheit und tatsächliche Lastflexibilität in die Kaufentscheidung einbezogen werden; die Reliability-Grenze liegt darin, dass eine unreflektierte Reserved-Bindung auf Basis einer unsicheren Punktschätzung oder eine Spot-Nutzung für unterbrechungsempfindliche Arbeitslasten zu tatsächlichen, finanziellen oder betrieblichen Schäden führen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Reserved-Kapazitätsbindung erweist sich als teurer als tatsächlich benötigt | die Bindung wurde auf Basis der wahrscheinlichsten Prognose statt des unteren, pessimistischeren Bandbreitenrands eingegangen | künftige Bindungen nur für den mit hoher Sicherheit benötigten Kapazitätsanteil eingehen |
| eine Spot-Instanz-Unterbrechung führt zu tatsächlichem, für Nutzer sichtbarem Schaden | die betroffene Arbeitslast war tatsächlich unterbrechungsempfindlich, wurde aber trotzdem auf Spot-Kapazität verlagert | eine explizite Unterbrechungsempfindlichkeits-Klassifikation vor jeder Spot-Nutzungsentscheidung durchführen |
| die tatsächlichen Einsparungen durch Spot-Kapazität fallen geringer aus als erwartet | die Häufigkeit tatsächlicher Unterbrechungen wurde bei der Wirtschaftlichkeitsrechnung nicht berücksichtigt | die tatsächliche, historische Unterbrechungshäufigkeit in die Spot-Wirtschaftlichkeitsrechnung einbeziehen |

Security: Sicherheitskritische Arbeitslasten sollten aufgrund ihrer typischerweise geringen Unterbrechungstoleranz nicht auf Spot-Kapazität ohne ausreichende Redundanz betrieben werden. Observability: Die tatsächliche Auslastungsquote gebundener Reserved-Kapazität und die tatsächliche Unterbrechungshäufigkeit genutzter Spot-Kapazität sind zentrale Signale zur Bewertung, ob die getroffenen Kaufentscheidungen wirtschaftlich tatsächlich angemessen waren.

## Trade-offs und Entscheidungen

**Staff** trifft eine gegebene Reserved- oder Spot-Kaufentscheidung korrekt unter Berücksichtigung von Forecastunsicherheit und Unterbrechungsempfindlichkeit. **Principal** entwirft die vollständige Reserved-/Spot-Strategie mit Bandbreiten-basierter Bindung und Unterbrechungsklassifikation für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für Reserved- und Spot-Kapazitätsentscheidungen fest, die Forecastunsicherheit und Lastflexibilität verbindlich einbeziehen.

Anti-Patterns: Reserved-Kapazität auf Basis der wahrscheinlichsten Prognose ohne Berücksichtigung der tatsächlichen Unsicherheit binden; Spot-Kapazität für tatsächlich unterbrechungsempfindliche Arbeitslasten ohne vorherige Klassifikation nutzen; die tatsächliche, historische Unterbrechungshäufigkeit bei der Spot-Wirtschaftlichkeitsrechnung ignorieren.

## Production Checklist

- [ ] Reserved-Kapazität ist nur für den mit hoher Sicherheit benötigten Kapazitätsanteil gebunden.
- [ ] Jede Arbeitslast ist explizit nach ihrer tatsächlichen Unterbrechungsempfindlichkeit klassifiziert.
- [ ] Nur tatsächlich unterbrechungsunempfindliche Arbeitslasten werden auf Spot-Kapazität verlagert.
- [ ] Die tatsächliche, historische Unterbrechungshäufigkeit ist in die Spot-Wirtschaftlichkeitsrechnung einbezogen.

## Interviewfragen

### 1. Warum ist eine Reserved-Kapazitätsbindung eine finanzielle Wette auf künftige Nachfrage?

**Antwort:** Weil die Organisation sich verpflichtet, die gebundene Kapazität über die gesamte Bindungsdauer zu bezahlen, unabhängig davon, ob die tatsächliche Nachfrage diese Kapazität tatsächlich benötigt.

### 2. Wie sollte eine Reserved-Bindung anhand der Forecast-Bandbreite wirtschaftlich sinnvoll bemessen werden?

**Antwort:** Sie sollte nur den Kapazitätsanteil binden, der auch im unteren, pessimistischeren Bereich der Forecast-Bandbreite mit hoher Sicherheit benötigt wird, um das Risiko einer finanziellen Fehlbindung zu reduzieren.

### 3. Welche Frage adressiert Spot-Kapazität strukturell anders als Reserved-Kapazität?

**Antwort:** Nicht die Unsicherheit der Nachfrage, sondern die tatsächliche Flexibilität der Arbeitslast gegenüber Unterbrechung.

### 4. Welche Arbeitslasten sind für Spot-Kapazität geeignet?

**Antwort:** Arbeitslasten, die tatsächlich unterbrochen und später fortgesetzt werden können, ohne geschäftlichen Schaden zu verursachen, etwa Batch-Verarbeitung oder Trainingsjobs mit regelmäßigen Zwischenspeicherungen.

### 5. Wie gehst du vor, wenn eine Reserved-Kapazitätsbindung sich als teurer als tatsächlich benötigt erweist?

**Antwort:** Ich prüfe, ob die Bindung auf Basis der wahrscheinlichsten Prognose statt des unteren, pessimistischeren Bandbreitenrands eingegangen wurde, und gehe künftige Bindungen nur für den mit hoher Sicherheit benötigten Anteil ein.

### 6. Widersprüchliche Anforderung: Die Finanzabteilung will maximale Reserved-Rabatte durch möglichst hohe Bindung UND die Organisation hat eine tatsächlich unsichere, schwankende Nachfrageprognose — wie gehst du vor?

**Antwort:** Ich würde die Reserved-Bindung explizit auf den mit hoher Sicherheit benötigten Anteil der Forecast-Bandbreite begrenzen und den unsicheren, darüber hinausgehenden Bedarf über flexible, nicht gebundene oder Spot-Kapazität decken, statt die maximale Bindung anzustreben und dadurch das Risiko einer finanziellen Fehlbindung einzugehen.

## Praktische Labs

~~~python
# Local, deterministic simulation of reserved capacity mis-commitment risk under forecast uncertainty (executed locally, no real cost tool):

def evaluate_reserved_commitment(committed_capacity, forecast_low, forecast_likely, price_per_unit_reserved, price_per_unit_ondemand):
    reserved_cost = committed_capacity * price_per_unit_reserved
    underutilization = max(0, committed_capacity - forecast_low)
    wasted_cost = underutilization * price_per_unit_reserved
    return {"reserved_cost": reserved_cost, "risk_scenario_wasted_cost": wasted_cost}

print(evaluate_reserved_commitment(committed_capacity=100, forecast_low=70, forecast_likely=100, price_per_unit_reserved=0.6, price_per_unit_ondemand=1.0))
~~~

## Dependencies, Cross-References und Quellen

1. FinOps Foundation: [Rate Optimization — Commitment-Based Discounts and Spot](https://www.finops.org/framework/capabilities/rate-optimization/), abgerufen 2026-09-18.
2. AWS-Dokumentation: [Spot Instances — Interruption Behavior](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-instance-interruptions.html), abgerufen 2026-09-18.

Budgets und Forecasting sind kanonisch in [KB-0637](03-budgets-und-forecasting.md) behandelt; Autoscaling Economics in [KB-0644](10-autoscaling-economics.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Reserved-Bindungsoptimierung, die Bindungsanteile dynamisch an aktualisierte Forecast-Bandbreiten anpasst | Evaluating | Als ergänzendes, kontinuierliches Optimierungswerkzeug einführen, jedoch größere, strategische Bindungsentscheidungen weiterhin als bewusste, menschliche Entscheidung mit expliziter Risikoabwägung treffen. |

Ein Team akzeptiert eine Reserved- oder Spot-Kapazitätsentscheidung erst, wenn Forecastunsicherheit und tatsächliche Unterbrechungsempfindlichkeit nachweislich in die Kaufentscheidung einbezogen wurden.
