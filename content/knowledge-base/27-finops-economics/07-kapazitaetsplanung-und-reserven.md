---
{"id": "KB-0641", "title": "Kapazitätsplanung und Reserven", "domain": "27", "sequence": 7, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "PLATFORM", "GENAI", "CHIEF"], "requires": [{"id": "KB-0582", "concepts": ["Betriebliche Kapazitätssteuerung"], "needed_for": "understanding"}, {"id": "KB-0638", "concepts": ["Cloud Unit Economics"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ankunftsraten, Servicezeiten und Sicherheitsreserven für ein konkretes System anhand quantitativer Modellierung berechnen und Wachstum sowie korrelierte Lastspitzen gegenüber Überprovisionierungs- und Sättigungsrisiko wirtschaftlich bewerten können, aufbauend auf der bereits in KB-0582 behandelten Kapazitätssteuerung.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie quantitative Kapazitätsplanung korrelierte Lastspitzen (mehrere Ursachen treffen gleichzeitig auf) von unabhängigen, sich statistisch ausgleichenden Lastschwankungen unterscheidet, um Sicherheitsreserven wirtschaftlich angemessen statt pauschal zu bemessen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Kapazitätsreserve auf Basis unabhängiger, sich statistisch ausgleichender Lastannahmen bemessen wurde, obwohl die tatsächliche Last korreliert auftritt, und das daraus resultierende, unterschätzte Sättigungsrisiko einordnen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Kapazitätsplanung und Reservenbemessung festlegen, die korrelierte Lastspitzen explizit von unabhängigen Schwankungen unterscheiden und Überprovisionierung gegen Sättigungsrisiko wirtschaftlich abwägen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die vollständige, mathematische Herleitung von Warteschlangentheorie-Modellen im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis, warum korrelierte Lastspitzen anders behandelt werden müssen als unabhängige Schwankungen, nicht die vollständige, mathematische Modellherleitung."}}, "lab_validation": [{"lab_id": "KB-0641-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation korrelierter versus unabhängiger Lastspitzen und deren Auswirkung auf notwendige Reserven, kein produktives Kapazitätsplanungs-Tool verwendet", "evidence": "Ein lokales Skript vergleicht die benötigte Kapazitätsreserve bei unabhängigen, sich statistisch ausgleichenden Lastquellen mit der benötigten Reserve bei korrelierten Lastquellen, die gleichzeitig ansteigen, und zeigt den deutlich höheren Reservebedarf im korrelierten Fall.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Kapazitätsplanungs-Tool."}]}
---
# Kapazitätsplanung und Reserven

> **Ziel:** Dieses Kapitel vertieft die bereits in [KB-0582](../24-observability-sre/18-betriebliche-kapazitaetssteuerung.md) behandelte Kapazitätssteuerung um die quantitative Modellierung von **Ankunftsraten** (wie oft Anfragen tatsächlich eintreffen), **Servicezeiten** (wie lange die Verarbeitung einer Anfrage tatsächlich dauert) und **Sicherheitsreserven** — mit besonderem Fokus auf die wirtschaftliche Abwägung zwischen **Überprovisionierung** (zu viel, ungenutzte, aber bezahlte Kapazität) und **Sättigungsrisiko** (zu wenig Kapazität, die zu tatsächlichen Leistungseinbußen führt). Der zentrale Punkt dieses Kapitels ist, dass **korrelierte Lastspitzen** (mehrere Lastquellen, die tatsächlich gleichzeitig ansteigen, etwa aufgrund eines gemeinsamen, externen Auslösers) einen deutlich höheren Reservebedarf erfordern als unabhängige, sich statistisch gegenseitig ausgleichende Lastschwankungen — eine Kapazitätsplanung, die diese Korrelation nicht explizit berücksichtigt, unterschätzt das tatsächliche Sättigungsrisiko erheblich.

## Zweck, Mental Model und Dependencies

Die statistische Grundintuition, dass sich Lastschwankungen mehrerer, unabhängiger Quellen über die Zeit teilweise gegenseitig ausgleichen (wenn eine Quelle gerade wenig Last erzeugt, kompensiert dies teilweise eine andere Quelle mit gerade hoher Last), gilt nur, wenn diese Lastquellen tatsächlich statistisch unabhängig sind — sobald mehrere Lastquellen tatsächlich korreliert sind (etwa weil ein gemeinsamer, externer Auslöser wie eine Marketingkampagne, ein saisonales Ereignis, oder ein technischer Vorfall bei einem vorgelagerten System gleichzeitig mehrere Lastquellen erhöht), fällt dieser statistische Ausgleichseffekt weg, und die tatsächlichen Lastspitzen addieren sich gleichzeitig, statt sich gegenseitig zu kompensieren. Eine Kapazitätsplanung, die Sicherheitsreserven auf Basis der Annahme unabhängiger, sich ausgleichender Lastquellen bemisst, aber tatsächlich mit korrelierten Lastquellen konfrontiert ist, unterschätzt den tatsächlichen Reservebedarf erheblich — dieselbe methodische Herausforderung, die bereits bei der Unterscheidung zwischen kurzfristiger und langfristiger Kapazitätssteuerung in [KB-0582](../24-observability-sre/18-betriebliche-kapazitaetssteuerung.md) behandelt wurde, muss hier explizit um die Korrelationsstruktur der Lastquellen erweitert werden. Die wirtschaftliche Abwägung zwischen Überprovisionierung und Sättigungsrisiko ist der praktische Kern dieses Kapitels: Eine zu großzügig bemessene Reserve verursacht tatsächliche, laufende Kosten für ungenutzte Kapazität (Überprovisionierung), während eine zu knapp bemessene Reserve zu tatsächlichen Leistungseinbußen bei einer tatsächlich eintretenden Lastspitze führt (Sättigungsrisiko, mit potenziell erheblichen, geschäftlichen Konsequenzen durch schlechte Servicequalität) — die wirtschaftlich sinnvolle Reservenbemessung erfordert eine explizite, quantitative Abwägung zwischen den laufenden Kosten der Überprovisionierung und den erwarteten, geschäftlichen Kosten eines tatsächlich eintretenden Sättigungsereignisses, statt eine pauschale, unbegründete Reserve (etwa "immer 20% zusätzliche Kapazität") anzuwenden, die weder die tatsächliche Korrelationsstruktur noch die tatsächlichen, wirtschaftlichen Konsequenzen berücksichtigt.

~~~text
This chapter deepens KB-0582 capacity steering w/ QUANTITATIVE modeling of
  ARRIVAL RATES (how often requests actually arrive)
  SERVICE TIMES (how long processing an actual request takes)
  SAFETY RESERVES
  focus: economic tradeoff between OVER-PROVISIONING (too much, unused but paid capacity)
  and SATURATION RISK (too little capacity -> actual performance degradation)
KEY POINT: CORRELATED load spikes (multiple load sources actually rising simultaneously,
  e.g. shared external trigger) require substantially HIGHER reserve need than independent,
  statistically-self-offsetting load fluctuations
  capacity planning not explicitly accounting for this correlation -> substantially
  underestimates actual saturation risk
STATISTICAL BASE INTUITION (multiple independent sources' fluctuations partially self-offset
  over time -- one source's low load partially compensates another's simultaneous high load)
  ONLY holds when these load sources are ACTUALLY statistically independent
  once multiple load sources actually CORRELATED (shared external trigger: marketing campaign,
  seasonal event, upstream system incident simultaneously raising multiple load sources)
  -> this statistical offsetting effect DISAPPEARS
  actual load spikes ADD UP SIMULTANEOUSLY instead of mutually compensating
capacity planning sizing safety reserves on assumption of independent, self-offsetting load
  sources, but ACTUALLY facing correlated load sources
  -> substantially underestimates actual reserve need
  SAME methodological challenge already addressed at short-term vs long-term capacity
  steering distinction in KB-0582, must be explicitly extended here by load-source
  correlation structure
ECONOMIC TRADEOFF between over-provisioning and saturation risk = practical core of this chapter
  overly generous reserve -> actual, ongoing cost for unused capacity (over-provisioning)
  overly tight reserve -> actual performance degradation on an actually-occurring load spike
    (saturation risk, potentially substantial business consequences via poor service quality)
  economically sound reserve sizing requires EXPLICIT, QUANTITATIVE tradeoff between
  ongoing over-provisioning cost and expected business cost of an actually-occurring
  saturation event
  instead of applying blanket, unjustified reserve ("always 20% extra capacity")
  neither accounting for actual correlation structure nor actual economic consequences
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Ankunftsrate und Servicezeit | quantitative Grundlage der Kapazitätsmodellierung | bestimmt tatsächlichen, benötigten Kapazitätsbedarf |
| Korrelierte Lastspitzen | mehrere Lastquellen steigen gleichzeitig | erfordern deutlich höhere Reserve als unabhängige Schwankungen |
| Überprovisionierungskosten | laufende Kosten ungenutzter Reservekapazität | eine Seite der wirtschaftlichen Abwägung |
| Sättigungsrisiko-Kosten | erwartete, geschäftliche Kosten eines Sättigungsereignisses | andere Seite der wirtschaftlichen Abwägung |

Implementierung: Ankunftsraten und Servicezeiten werden quantitativ modelliert, statt anhand grober Schätzungen. Die Korrelationsstruktur tatsächlicher Lastquellen (unabhängig oder korreliert) wird explizit bewertet, bevor Sicherheitsreserven bemessen werden. Die Reservenbemessung erfolgt durch explizite, quantitative Abwägung zwischen Überprovisionierungskosten und erwarteten Sättigungsrisiko-Kosten, statt einer pauschalen Reserveregel.

## Scalability, Reliability, Security und Observability

Kapazitätsplanung und Reservenbemessung skalieren die tatsächliche, wirtschaftliche Effizienz proportional zur Berücksichtigung der tatsächlichen Korrelationsstruktur von Lastquellen; die Reliability-Grenze liegt darin, dass eine auf unabhängigen Lastannahmen basierende Reserve bei tatsächlich korrelierten Lastquellen das Sättigungsrisiko erheblich unterschätzt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein System erreicht trotz bemessener Sicherheitsreserve unerwartet Sättigung bei einer Lastspitze | die Reserve wurde auf Basis unabhängiger statt tatsächlich korrelierter Lastquellen bemessen | die Korrelationsstruktur der tatsächlichen Lastquellen analysieren und die Reserve entsprechend anpassen |
| eine Kapazitätsreserve verursacht dauerhaft hohe, aber ungenutzte Kosten | die Reserve wurde pauschal statt anhand einer quantitativen Kosten-Risiko-Abwägung bemessen | eine explizite, quantitative Abwägung zwischen Überprovisionierungskosten und Sättigungsrisiko-Kosten durchführen |
| unklar ist, wie viel zusätzliche Kapazität für ein wachsendes System tatsächlich benötigt wird | keine quantitative Modellierung von Ankunftsraten und Servicezeiten liegt vor | eine quantitative Kapazitätsmodellierung auf Basis tatsächlicher Ankunftsraten und Servicezeiten durchführen |

Security: Sättigungsereignisse können auch sicherheitsrelevante Konsequenzen haben (etwa fehlschlagende Sicherheitsprüfungen unter Last), weshalb Sicherheitsreserven diese Aspekte explizit berücksichtigen sollten. Observability: Die tatsächliche Häufigkeit von Sättigungsereignissen im Verhältnis zur bemessenen Reserve ist ein zentrales Signal zur Bewertung, ob die Reservenbemessung tatsächlich angemessen ist.

## Trade-offs und Entscheidungen

**Staff** modelliert Ankunftsraten und Servicezeiten für ein gegebenes System korrekt und bemisst eine angemessene Reserve. **Principal** entwirft die vollständige, quantitative Kapazitätsplanungsmethodik mit Korrelationsanalyse für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für Kapazitätsplanung fest, die quantitative Abwägung zwischen Überprovisionierung und Sättigungsrisiko verbindlich vorschreiben.

Anti-Patterns: eine pauschale Sicherheitsreserve ohne quantitative Modellierung oder Korrelationsanalyse anwenden; Reserven auf Basis unabhängiger Lastannahmen bemessen, obwohl die tatsächlichen Lastquellen korreliert sind; Kapazitätsentscheidungen ohne explizite Abwägung zwischen Überprovisionierungskosten und Sättigungsrisiko treffen.

## Production Checklist

- [ ] Ankunftsraten und Servicezeiten sind quantitativ modelliert.
- [ ] Die Korrelationsstruktur tatsächlicher Lastquellen ist explizit bewertet.
- [ ] Sicherheitsreserven sind durch quantitative Abwägung zwischen Überprovisionierungs- und Sättigungsrisiko-Kosten bemessen.
- [ ] Die tatsächliche Häufigkeit von Sättigungsereignissen wird gegen die bemessene Reserve überwacht.

## Interviewfragen

### 1. Warum erfordern korrelierte Lastspitzen einen deutlich höheren Reservebedarf als unabhängige Lastschwankungen?

**Antwort:** Weil sich unabhängige Lastschwankungen statistisch teilweise gegenseitig ausgleichen, während korrelierte Lastquellen gleichzeitig ansteigen und sich addieren, ohne dass ein Ausgleichseffekt eintritt.

### 2. Was ist die wirtschaftliche Abwägung, die eine sinnvolle Reservenbemessung erfordert?

**Antwort:** Die explizite, quantitative Abwägung zwischen den laufenden Kosten der Überprovisionierung (ungenutzte Kapazität) und den erwarteten, geschäftlichen Kosten eines tatsächlich eintretenden Sättigungsereignisses.

### 3. Warum reicht eine pauschale Reserveregel (etwa "immer 20% zusätzliche Kapazität") nicht aus?

**Antwort:** Weil sie weder die tatsächliche Korrelationsstruktur der Lastquellen noch die tatsächlichen, wirtschaftlichen Konsequenzen von Überprovisionierung oder Sättigung berücksichtigt.

### 4. Was passiert, wenn eine Kapazitätsreserve auf Basis unabhängiger Lastannahmen bemessen wird, die tatsächliche Last aber korreliert ist?

**Antwort:** Die Reserve unterschätzt den tatsächlichen Bedarf erheblich, da der angenommene, statistische Ausgleichseffekt bei tatsächlich korrelierten Lastquellen tatsächlich nicht eintritt.

### 5. Wie gehst du vor, wenn ein System trotz bemessener Sicherheitsreserve unerwartet Sättigung bei einer Lastspitze erreicht?

**Antwort:** Ich prüfe, ob die Reserve auf Basis unabhängiger statt tatsächlich korrelierter Lastquellen bemessen wurde, und analysiere die tatsächliche Korrelationsstruktur, um die Reserve entsprechend anzupassen.

### 6. Widersprüchliche Anforderung: Die Finanzabteilung will minimale Reservekapazität zur Kostensenkung UND das Betriebsteam will maximale Sicherheit gegen Sättigungsrisiko bei korrelierten Lastspitzen — wie gehst du vor?

**Antwort:** Ich würde eine explizite, quantitative Kosten-Risiko-Abwägung durchführen, die die tatsächliche Korrelationsstruktur der Lastquellen und die erwarteten, geschäftlichen Kosten eines Sättigungsereignisses gegen die laufenden Überprovisionierungskosten stellt, statt entweder pauschal auf Kostensenkung oder auf maximale Sicherheit zu optimieren.

## Praktische Labs

~~~python
# Local, deterministic simulation of correlated vs independent load sources and required reserve (executed locally, no real capacity planning tool):

def required_reserve(load_sources, correlated):
    if correlated:
        peak = sum(s["peak"] for s in load_sources)
    else:
        peak = max(s["peak"] for s in load_sources) * 1.3  # partial statistical offsetting
    baseline = sum(s["baseline"] for s in load_sources)
    return {"required_capacity": peak, "baseline_capacity": baseline, "reserve_needed": peak - baseline}

load_sources = [{"baseline": 100, "peak": 150}, {"baseline": 80, "peak": 130}]

print("independent:", required_reserve(load_sources, correlated=False))
print("correlated (shared trigger):", required_reserve(load_sources, correlated=True))
~~~

## Dependencies, Cross-References und Quellen

1. Google SRE Workbook: [Load Balancing and Capacity Planning](https://sre.google/workbook/implementing-slos/), abgerufen 2026-09-18.
2. FinOps Foundation: [Rate Optimization — FinOps Capability](https://www.finops.org/framework/capabilities/rate-optimization/), abgerufen 2026-09-18.

Betriebliche Kapazitätssteuerung ist kanonisch in [KB-0582](../24-observability-sre/18-betriebliche-kapazitaetssteuerung.md) behandelt; Cloud Unit Economics in [KB-0638](04-cloud-unit-economics.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, statistische Korrelationsanalyse historischer Lastdaten zur kontinuierlichen Aktualisierung der Reservenbemessung | Evaluating | Als ergänzende, datengestützte Grundlage für die Korrelationsbewertung einsetzen, jedoch die abschließende, wirtschaftliche Abwägung zwischen Überprovisionierung und Sättigungsrisiko weiterhin als menschliche, geschäftliche Entscheidung behandeln. |

Ein Team akzeptiert eine Kapazitätsplanung erst, wenn die Korrelationsstruktur tatsächlicher Lastquellen explizit bewertet und die Reservenbemessung nachweislich durch quantitative Kosten-Risiko-Abwägung erfolgt ist.
