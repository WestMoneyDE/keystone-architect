---
{"id": "KB-0582", "title": "Betriebliche Kapazitätssteuerung", "domain": "24", "sequence": 18, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "CLOUD", "MLOPS"], "requires": [{"id": "KB-0567", "concepts": ["Metriken und Zeitreihen"], "needed_for": "understanding"}, {"id": "KB-0579", "concepts": ["Alerting und Bereitschaftsdienst"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Sättigungsmetriken und Wachstumsverläufe anhand offizieller Dokumentation korrekt beobachten und eine kurzfristige Kapazitätsreserve von einer langfristigen Planungsentscheidung unterscheiden können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein konkretes System explizit gestalten, welche Sättigungssignale eine kurzfristige, operative Entlastung erfordern und welche eine langfristige, ökonomisch abzuwägende Kapazitätsentscheidung darstellen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine akute Sättigungswarnung von einem langfristigen, strukturellen Kapazitätswachstum unterscheiden können, statt eine kurzfristige, operative Reaktion auf eine Frage anzuwenden, die eine langfristige Planungsentscheidung erfordert.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Kapazitätssteuerung festlegen, die kurzfristige operative Entlastung von langfristiger, ökonomisch fundierter Kapazitätsplanung strukturell trennen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Detaillierte, finanzmathematische Kapazitätsportfolio-Optimierungsmodelle im Detail sind Vertiefung.", "rationale": "Kern ist die Unterscheidung zwischen kurzfristiger Entlastung und langfristiger Kapazitätsplanung als operative Entscheidungsgrundlage, nicht die finanzmathematische Optimierung von Kapazitätsportfolios."}}, "lab_validation": [{"lab_id": "KB-0582-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Unterscheidung zwischen kurzfristiger Sättigungswarnung und langfristigem Wachstumstrend, kein produktives Kapazitätsplanungssystem verwendet", "evidence": "Ein lokales Skript simuliert, wie eine kurzfristige, akute Sättigungsspitze (etwa durch einen einzelnen Lastspitze) von einem stetigen, über mehrere Wochen anhaltenden Wachstumstrend unterschieden werden kann, und zeigt damit den strukturellen Unterschied zwischen operativer Entlastung und langfristiger Kapazitätsplanung.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Kapazitätsplanungssystem."}]}
---
# Betriebliche Kapazitätssteuerung

> **Ziel:** Kapazitätssteuerung beobachtet Sättigung (wie nahe ein System an seiner tatsächlichen Kapazitätsgrenze arbeitet, siehe die bereits in [KB-0567](03-metriken-und-zeitreihen.md) behandelten Metriktypen) und Wachstumsverläufe, um Reserven angemessen zu bemessen. Der zentrale Punkt dieses Kapitels ist die strukturelle Trennung dreier unterschiedlicher Entscheidungsebenen, die bei Kapazitätsfragen leicht vermischt werden: Eine **kurzfristige, operative Entlastung** (etwa das schnelle Hinzufügen von Instanzen bei einer akuten Sättigungsspitze) ist eine taktische, sofort wirksame Reaktion; **langfristige Kapazitätsplanung** (die Vorhersage künftigen Bedarfs anhand von Wachstumsverläufen und die entsprechend vorausschauende Bereitstellung) ist eine strategische, vorausschauende Entscheidung; und **ökonomische Portfoliodebatten** (etwa die Abwägung zwischen reservierter und On-Demand-Kapazität, oder zwischen verschiedenen Anbietern) sind eine finanzielle, geschäftliche Entscheidung, die über die rein technische Kapazitätsfrage hinausgeht — eine akute Sättigungswarnung sollte nicht direkt zu einer langfristigen Portfolioentscheidung führen, und umgekehrt sollte eine langfristige Portfoliodebatte nicht als Ersatz für eine notwendige, sofortige operative Entlastung dienen.

## Zweck, Mental Model und Dependencies

Sättigung beschreibt, wie nahe eine Ressource (CPU, Speicher, Netzwerk, Warteschlangentiefe) an ihrer tatsächlichen Kapazitätsgrenze arbeitet, und ist damit ein anderes Signal als reine Auslastung — ein System kann bei moderater durchschnittlicher Auslastung dennoch punktuell gesättigt sein, wenn die Last ungleichmäßig verteilt ist oder kurzzeitig stark ansteigt. Die drei Entscheidungsebenen unterscheiden sich vor allem in ihrem Zeithorizont und ihrer Reaktionsart: Eine kurzfristige, operative Entlastung reagiert auf eine bereits eingetretene oder unmittelbar bevorstehende Sättigung mit sofort wirksamen Maßnahmen (zusätzliche Instanzen, temporäre Drosselung nicht-kritischer Last, siehe die bereits in [KB-0579](15-alerting-und-bereitschaftsdienst.md) behandelte Alarmierung als Auslöser) und ist bewusst taktisch, nicht auf langfristige Kostenoptimierung ausgelegt. Langfristige Kapazitätsplanung nutzt dagegen historische Wachstumsverläufe, um künftigen Bedarf über Wochen oder Monate vorherzusagen und Kapazität vorausschauend, nicht reaktiv bereitzustellen — diese Planung berücksichtigt bewusst längerfristige Trends statt kurzfristiger Lastspitzen, da eine Kapazitätsentscheidung, die auf eine einzelne, kurzzeitige Spitze reagiert, langfristig zu überdimensionierter, unnötig teurer Kapazität führen kann. Ökonomische Portfoliodebatten gehen noch einen Schritt weiter und betreffen nicht die Frage "wie viel Kapazität wird benötigt", sondern "wie wird diese Kapazität wirtschaftlich am günstigsten bereitgestellt" (etwa reservierte Kapazität mit Preisvorteil bei vorhersehbarem Grundbedarf, kombiniert mit On-Demand-Kapazität für unvorhersehbare Spitzen) — diese Entscheidung erfordert zusätzlich zur technischen Kapazitätsprognose eine geschäftliche Abwägung von Kosten, Vertragsbindung und Risikotoleranz, die über die rein operative oder technische Planungsebene hinausgeht.

~~~text
Capacity steering: observes SATURATION (how close system runs to actual capacity limit, metrics from KB-0567)
  + growth trajectories -> sizes reserves appropriately
KEY POINT: three DISTINCT decision levels, easily conflated:
  SHORT-TERM operational relief: tactical, immediately effective reaction (e.g. add instances during acute spike)
  LONG-TERM capacity planning: strategic, forward-looking prediction of future need from growth trends
  ECONOMIC portfolio debate: financial/business decision (reserved vs on-demand, vendor choice), goes beyond pure tech
  acute saturation warning should NOT directly trigger a long-term portfolio decision
  long-term portfolio debate should NOT substitute for necessary IMMEDIATE operational relief
SATURATION differs from plain utilization:
  describes how close a resource (CPU, memory, network, queue depth) runs to its actual capacity limit
  system can be moderately loaded on average yet locally saturated
    (uneven load distribution, brief sharp spike)
THREE LEVELS differ mainly in TIME HORIZON + response type:
  short-term relief: reacts to already-occurred/imminent saturation, immediately-effective measures
    (extra instances, temporary throttling of non-critical load, alerting from KB-0579 as trigger)
    deliberately TACTICAL, not optimized for long-term cost
  long-term planning: uses historical growth trajectories to predict weeks/months-ahead need
    provisions capacity PROACTIVELY, not reactively
    deliberately considers longer trends, not short spikes
      (reacting to single brief spike -> long-term OVER-provisioned, unnecessarily expensive capacity)
  economic portfolio debate: NOT "how much capacity is needed" but "how is it most economically provided"
    (reserved capacity at price advantage for predictable baseline + on-demand for unpredictable spikes)
    requires business tradeoff (cost, contract lock-in, risk tolerance) BEYOND pure operational/technical level
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Sättigung | zeigt Nähe zur tatsächlichen Kapazitätsgrenze | präziseres Signal als reine Durchschnittsauslastung |
| Kurzfristige operative Entlastung | sofort wirksame Reaktion auf akute Sättigung | taktisch, nicht kostenoptimiert |
| Langfristige Kapazitätsplanung | vorausschauende Bereitstellung anhand von Wachstumsverläufen | vermeidet Überdimensionierung durch kurzzeitige Spitzen |
| Ökonomische Portfoliodebatte | wirtschaftliche Abwägung der Bereitstellungsart | geschäftliche, nicht rein technische Entscheidung |

Implementierung: Sättigungsmetriken werden kontinuierlich beobachtet und mit Alarmierung für akute Entlastung verknüpft. Wachstumsverläufe werden über längere Zeiträume ausgewertet und getrennt von kurzfristigen Sättigungsspitzen für die langfristige Kapazitätsplanung herangezogen. Ökonomische Portfolioentscheidungen (reservierte vs. On-Demand-Kapazität) werden als separate, geschäftliche Entscheidung auf Basis der langfristigen Planung getroffen, nicht als Reaktion auf einzelne akute Sättigungsereignisse.

## Scalability, Reliability, Security und Observability

Betriebliche Kapazitätssteuerung skaliert die tatsächliche Systemstabilität proportional zur konsequenten Trennung der drei Entscheidungsebenen; die Reliability-Grenze liegt darin, dass eine Vermischung von kurzfristiger Entlastung und langfristiger Planung entweder zu unnötig teurer Überdimensionierung oder zu wiederholten, vermeidbaren akuten Sättigungsvorfällen führen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine akute Sättigungsspitze löst eine langfristige Portfolioentscheidung (etwa einen mehrjährigen Reservierungsvertrag) aus | kurzfristige und langfristige Entscheidungsebene wurden vermischt | die Spitze zunächst mit kurzfristiger, operativer Entlastung adressieren und langfristige Trends separat auswerten |
| die Kapazität ist chronisch überdimensioniert und unnötig teuer | vergangene Kapazitätsentscheidungen wurden auf Basis einzelner Spitzen statt langfristiger Wachstumsverläufe getroffen | die Kapazitätsplanung auf tatsächliche, über längere Zeiträume beobachtete Wachstumstrends umstellen |
| wiederholte akute Sättigungsvorfälle trotz vorhandener langfristiger Kapazitätsplanung | die langfristige Planung deckt kurzfristige, operative Entlastungsmechanismen nicht ab | einen expliziten, kurzfristigen Entlastungsmechanismus (etwa automatische Skalierung) ergänzend zur langfristigen Planung einrichten |

Security: Kapazitätsdaten (etwa tatsächliche Lastverläufe) können geschäftlich sensible Informationen über Nutzungsmuster enthalten und sollten entsprechend zugriffsgeschützt sein. Observability: Die tatsächliche Trefferquote der langfristigen Wachstumsprognose gegenüber dem tatsächlich eingetretenen Bedarf ist ein zentrales Signal zur Bewertung der Kapazitätsplanungsqualität selbst.

## Trade-offs und Entscheidungen

**Staff** beobachtet Sättigungsmetriken korrekt und reagiert mit angemessener kurzfristiger Entlastung. **Principal** entwirft die vollständige Kapazitätsplanungsstrategie, die kurzfristige Entlastung und langfristige Planung strukturell trennt. **Chief** trifft oder begleitet die ökonomische Portfolioentscheidung zwischen reservierter und On-Demand-Kapazität auf Basis der langfristigen Planung.

Anti-Patterns: eine akute Sättigungsspitze direkt in eine langfristige, vertraglich bindende Portfolioentscheidung überführen; Kapazität dauerhaft anhand einzelner, kurzzeitiger Lastspitzen statt langfristiger Wachstumsverläufe dimensionieren; eine langfristige Planungsdebatte als Ersatz für eine notwendige, sofortige operative Entlastung nutzen.

## Production Checklist

- [ ] Sättigungsmetriken werden kontinuierlich beobachtet und mit Alarmierung für akute Entlastung verknüpft.
- [ ] Langfristige Kapazitätsplanung basiert auf über längere Zeiträume beobachteten Wachstumsverläufen, nicht auf einzelnen Spitzen.
- [ ] Ökonomische Portfolioentscheidungen werden getrennt von akuten Sättigungsereignissen als geschäftliche Entscheidung getroffen.
- [ ] Die Trefferquote der Wachstumsprognose wird regelmäßig gegen den tatsächlichen Bedarf überprüft.

## Interviewfragen

### 1. Was unterscheidet Sättigung von reiner Auslastung?

**Antwort:** Sättigung zeigt, wie nahe eine Ressource an ihrer tatsächlichen Kapazitätsgrenze arbeitet, während reine Durchschnittsauslastung punktuelle Lastspitzen bei ungleichmäßiger Verteilung verdecken kann.

### 2. Welche drei Entscheidungsebenen werden bei Kapazitätssteuerung unterschieden?

**Antwort:** Kurzfristige, operative Entlastung; langfristige Kapazitätsplanung anhand von Wachstumsverläufen; und ökonomische Portfoliodebatten über die wirtschaftliche Bereitstellungsart.

### 3. Warum sollte eine akute Sättigungsspitze nicht direkt eine langfristige Portfolioentscheidung auslösen?

**Antwort:** Weil eine einzelne, kurzzeitige Spitze nicht repräsentativ für den tatsächlichen, langfristigen Bedarf ist und eine darauf basierende, vertraglich bindende Entscheidung zu unnötig teurer Überdimensionierung führen kann.

### 4. Was unterscheidet eine ökonomische Portfoliodebatte von reiner Kapazitätsplanung?

**Antwort:** Die Portfoliodebatte betrifft nicht die Frage, wie viel Kapazität benötigt wird, sondern wie diese Kapazität wirtschaftlich am günstigsten bereitgestellt wird, unter Abwägung von Kosten, Vertragsbindung und Risikotoleranz.

### 5. Wie gehst du vor, wenn eine akute Sättigungsspitze auftritt?

**Antwort:** Ich adressiere sie zunächst mit einer kurzfristigen, operativen Entlastungsmaßnahme und werte den langfristigen Wachstumstrend separat aus, statt die Spitze direkt in eine langfristige Kapazitätsentscheidung zu überführen.

### 6. Widersprüchliche Anforderung: Finance will minimale Kapazitätsreserve zur Kostenersparnis UND Operations will maximale Reserve zur Vermeidung akuter Sättigung — wie gehst du vor?

**Antwort:** Ich würde die Kapazitätsreserve auf Basis tatsächlicher, langfristig beobachteter Wachstumsverläufe dimensionieren und akute Lastspitzen über kurzfristige, automatisierte Skalierungsmechanismen statt über eine dauerhaft überdimensionierte Basisreserve abfangen, um Kosten und operative Sicherheit zu verbinden, statt eine der beiden Anforderungen vollständig zu opfern.

## Praktische Labs

~~~python
# Local, deterministic simulation of distinguishing an acute spike from a long-term growth trend (executed locally, no real capacity system):

def classify_signal(daily_saturation):
    recent_avg = sum(daily_saturation[-7:]) / 7
    overall_avg = sum(daily_saturation) / len(daily_saturation)
    trend_growing = recent_avg > overall_avg * 1.2
    single_spike = max(daily_saturation) > 90 and recent_avg < 60
    return {"long_term_trend": trend_growing, "acute_spike_only": single_spike}

daily_saturation = [40, 42, 45, 43, 95, 44, 46, 45, 43, 44]  # one spike day among stable baseline
print(classify_signal(daily_saturation))
~~~

## Dependencies, Cross-References und Quellen

1. Google SRE Book: [Handling Overload](https://sre.google/sre-book/handling-overload/), abgerufen 2026-09-18.
2. Google SRE Workbook: [Capacity Planning](https://sre.google/workbook/implementing-slos/), abgerufen 2026-09-18.

Metriktypen und Sättigungssignale sind kanonisch in [KB-0567](03-metriken-und-zeitreihen.md) behandelt; Alarmierung als Auslöser kurzfristiger Entlastung in [KB-0579](15-alerting-und-bereitschaftsdienst.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Prädiktive, KI-gestützte Kapazitätsprognosen zur automatischen Unterscheidung zwischen kurzfristigen Spitzen und langfristigen Trends | Evaluating | Gegen die bestehende, auf historischen Wachstumsverläufen basierende Planung validieren, bevor automatische Prognosen als alleinige Grundlage für langfristige Portfolioentscheidungen eingesetzt werden. |

Ein Team akzeptiert eine Kapazitätssteuerungsstrategie erst, wenn kurzfristige operative Entlastung, langfristige Kapazitätsplanung und ökonomische Portfoliodebatten nachweislich als getrennte Entscheidungsebenen behandelt werden.
