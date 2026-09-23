---
{"id": "KB-0370", "title": "AI-Canary-Releases", "domain": "15", "sequence": 20, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0368", "concepts": ["Offline- und Online-Evaluation"], "needed_for": "understanding"}, {"id": "KB-0369", "concepts": ["Drift und Qualitätsänderung"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine gestufte Verkehrsverteilung auf einen neuen Modellstand simulieren und ein Stoppsignal basierend auf einer Kostengrenze statt nur einer Fehlerquote auslösen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Canary-Release-Strategie gestalten, die Qualitäts-, Kosten- und Sicherheitsgrenzen als gleichrangige Stoppsignale neben technischen Fehlerquoten definiert.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein Canary-Release trotz unauffälliger technischer Fehlerquote aufgrund einer Kosten- oder Sicherheitsgrenzverletzung gestoppt werden muss.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Mehrdimensionale Stoppsignale (Qualität, Kosten, Sicherheit) als verpflichtenden Standard für jeden Canary-Release im Unternehmen etablieren, statt sich allein auf technische Fehlerquoten zu verlassen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Automatisierte, adaptive Verkehrssteuerungsalgorithmen für Canary-Releases sind Vertiefung.", "rationale": "Kern ist das Verständnis mehrdimensionaler Stoppsignale, nicht ein spezifischer Steuerungsalgorithmus."}}, "lab_validation": [{"lab_id": "KB-0370-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simulierter Canary-Release mit gestufter Verkehrsverteilung und einer absichtlich eingebauten Kostengrenzverletzung bei unauffälliger Fehlerquote", "evidence": "Ein simulierter neuer Modellstand zeigt eine technisch unauffällige Fehlerquote, verursacht aber pro Anfrage deutlich höhere Kosten als der bisherige Stand; ein reines Fehlerquoten-Stoppsignal würde diesen Canary nicht stoppen, während ein zusätzliches Kosten-Stoppsignal den Rollout korrekt anhält, bevor die Kostenüberschreitung auf den vollständigen Verkehr skaliert.", "limitations": "Kein produktives Release-System, kein realer Geschäftsdatensatz, kleine simulierte Verkehrsmenge."}]}
---
# AI-Canary-Releases

> **Ziel:** Ein Canary-Release lenkt Verkehr gestuft (z. B. zunächst 5%, dann 25%, dann 100%) auf einen neuen Modellstand, aufbauend auf den Grundlagen der Online-Evaluation (siehe [KB-0368](18-offline-und-online-evaluation.md)) und Drift-Überwachung (siehe [KB-0369](19-drift-und-qualitaetsaenderung.md)). Der zentrale Punkt dieses Kapitels ist, dass Stoppsignale für einen Canary-Release nicht nur technische Fehlerquoten umfassen dürfen, sondern explizit auch Qualitäts-, Kosten- und Sicherheitsgrenzen — ein Canary kann technisch fehlerfrei laufen und dennoch aus einem dieser anderen Gründe gestoppt werden müssen.

## Zweck, Mental Model und Dependencies

Ein klassisches Canary-Release-Stoppsignal ist eine erhöhte technische Fehlerquote (z. B. mehr HTTP-Fehler, Timeouts, Abstürze) — dieses Signal ist notwendig, aber bei GenAI-Systemen nicht ausreichend, da ein neuer Modellstand technisch einwandfrei (keine Abstürze, keine Timeouts) laufen kann, während er dennoch aus mehreren anderen Gründen problematisch ist. Ein Qualitäts-Stoppsignal erkennt, wenn die inhaltliche Ausgabequalität (z. B. gemessen über die in [KB-0364](14-deepeval-und-bewertungsmetriken.md) beschriebenen Metriken) gegenüber dem bisherigen Stand signifikant sinkt, auch wenn keine technischen Fehler auftreten. Ein Kosten-Stoppsignal erkennt, wenn ein neuer Modellstand pro Anfrage deutlich teurer ist (z. B. durch längere Generierungen, mehr Tokens, einen teureren zugrunde liegenden Modellanbieter), was bei vollständigem Rollout zu einer erheblichen, ungeplanten Kostensteigerung führen würde, obwohl technisch alles "funktioniert". Ein Sicherheits-Stoppsignal erkennt, wenn ein neuer Modellstand vermehrt unerwünschte oder unsichere Ausgaben produziert (z. B. mehr erfolgreiche Red-Team-Umgehungen, siehe [KB-0363](13-promptfoo-und-konfigurationstests.md)), was ebenfalls unabhängig von der technischen Fehlerquote auftreten kann. Der zentrale methodische Punkt ist, dass alle vier Signalarten (technisch, Qualität, Kosten, Sicherheit) gleichrangig und parallel überwacht werden müssen — ein Canary-Release, der nur auf technische Fehlerquoten achtet, kann einen qualitativ schlechteren, deutlich teureren oder unsichereren Modellstand unbemerkt bis zum vollständigen Rollout durchlaufen lassen.

~~~text
Classic canary stop signal: technical error rate (crashes, timeouts, HTTP errors) -- NECESSARY but NOT SUFFICIENT for GenAI
A new model version can run TECHNICALLY FLAWLESSLY while still being problematic:
  QUALITY stop signal:  output quality (KB-0364 metrics) drops significantly, no technical errors involved
  COST stop signal:     cost per request rises significantly (longer generations, more tokens, pricier provider)
                         -> full rollout would cause a major unplanned cost increase despite "everything working"
  SECURITY stop signal: increased successful red-team bypasses (KB-0363), independent of technical error rate
ALL FOUR SIGNAL TYPES must be monitored IN PARALLEL, with equal standing
  -> a canary watching ONLY technical errors can let a worse/costlier/less-safe version reach full rollout unnoticed
~~~

## Core Concepts, Architektur und Implementierung

| Stoppsignal | Was es erkennt | Beispiel für ein unbemerktes Risiko ohne dieses Signal |
|---|---|---|
| Technisch | Abstürze, Timeouts, HTTP-Fehler | (klassisches Signal, allein nicht ausreichend) |
| Qualität | inhaltliche Ausgabequalität sinkt | ein Modell mit inhaltlich schlechteren, aber technisch fehlerfreien Antworten erreicht vollständigen Rollout |
| Kosten | Kosten pro Anfrage steigen | ein deutlich teurerer Modellstand wird unbemerkt auf den gesamten Verkehr skaliert |
| Sicherheit | vermehrte unerwünschte/unsichere Ausgaben | ein Modellstand mit mehr erfolgreichen Sicherheitsumgehungen erreicht vollständigen Rollout |

Implementierung: Ein Canary-Release beginnt mit einem kleinen Verkehrsanteil (z. B. 5%) auf den neuen Modellstand. Vor jeder Steigerung des Verkehrsanteils werden alle vier Stoppsignale (technisch, Qualität, Kosten, Sicherheit) parallel geprüft; überschreitet auch nur eines dieser Signale seine definierte Grenze, wird der Rollout gestoppt und der Verkehr vollständig auf den bisherigen, bekannt guten Stand zurückgesetzt. Erst wenn alle vier Signale innerhalb akzeptabler Grenzen bleiben, wird der Verkehrsanteil schrittweise erhöht, bis der neue Stand den vollständigen Verkehr übernimmt.

## Scalability, Reliability, Security und Observability

Gestufte Canary-Releases skalieren das Risiko eines fehlerhaften Rollouts proportional zur Kleinheit des initialen Verkehrsanteils; die Reliability-Grenze liegt darin, dass eine Überwachung, die nur technische Fehlerquoten erfasst, proportional zur Häufigkeit rein qualitativer, kostenbezogener oder sicherheitsrelevanter Probleme unentdeckte Rollouts problematischer Modellstände zulässt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein neuer Modellstand erreicht vollständigen Rollout trotz spürbar schlechterer Nutzerzufriedenheit | nur technische Fehlerquoten wurden als Stoppsignal überwacht, kein Qualitätssignal | ein Qualitäts-Stoppsignal basierend auf inhaltlichen Bewertungsmetriken für zukünftige Canary-Releases ergänzen |
| die Betriebskosten steigen unerwartet stark nach einem vollständigen Modell-Rollout | kein Kosten-Stoppsignal wurde während der Canary-Phase überwacht | die Kosten pro Anfrage während der nächsten Canary-Phase explizit als Stoppsignal überwachen |
| ein neuer Modellstand zeigt nach vollständigem Rollout vermehrt problematische Ausgaben | kein Sicherheits-Stoppsignal (z. B. Red-Team-Erfolgsrate) wurde während der Canary-Phase überwacht | Sicherheitsrelevante Testfälle explizit als Stoppsignal in zukünftige Canary-Phasen integrieren |

Security: Ein Sicherheits-Stoppsignal ist essenziell, da ein neuer Modellstand unabhängig von seiner technischen Stabilität ein erhöhtes Risiko unerwünschter oder schädlicher Ausgaben aufweisen kann, das ohne explizite Überwachung unentdeckt bis zum vollständigen Rollout bestehen bleibt. Observability: Der Verlauf aller vier Stoppsignale (technisch, Qualität, Kosten, Sicherheit) über die Rollout-Stufen hinweg ist die zentrale Steuerungsmetrik für jeden Canary-Release.

## Trade-offs und Entscheidungen

**Staff** implementiert alle vier Stoppsignalarten parallel für jeden Canary-Release. **Principal** macht den Verlauf aller Stoppsignale über die Rollout-Stufen für das Team nachvollziehbar. **Chief** etabliert mehrdimensionale Stoppsignale als verpflichtenden Standard für jeden Canary-Release im Unternehmen, statt sich allein auf technische Fehlerquoten zu verlassen.

Anti-Patterns: einen Canary-Release ausschließlich anhand technischer Fehlerquoten überwachen; Kostensteigerungen erst nach vollständigem Rollout statt während der Canary-Phase bemerken; Sicherheitsrelevante Testfälle nicht als Teil der Canary-Überwachung behandeln.

## Production Checklist

- [ ] Ein Canary-Release überwacht technische, Qualitäts-, Kosten- und Sicherheitssignale parallel.
- [ ] Jedes Stoppsignal hat eine explizit definierte Grenze, deren Überschreitung den Rollout stoppt.
- [ ] Eine Verkehrssteigerung erfolgt erst, wenn alle vier Signale innerhalb akzeptabler Grenzen bleiben.
- [ ] Bei Grenzverletzung wird der Verkehr vollständig auf den bisherigen, bekannt guten Stand zurückgesetzt.

## Interviewfragen

### 1. Warum reicht die technische Fehlerquote allein als Stoppsignal für einen AI-Canary-Release nicht aus?

**Antwort:** Ein neuer Modellstand kann technisch fehlerfrei laufen und dennoch qualitativ schlechter, deutlich teurer oder unsicherer sein, was eine reine Fehlerquotenüberwachung nicht erfasst.

### 2. Was erkennt ein Kosten-Stoppsignal, und warum ist es bei GenAI-Systemen besonders relevant?

**Antwort:** Es erkennt, wenn ein neuer Modellstand pro Anfrage deutlich teurer ist, was bei vollständigem Rollout zu einer erheblichen, ungeplanten Kostensteigerung führen würde, obwohl technisch alles funktioniert.

### 3. Was erkennt ein Sicherheits-Stoppsignal bei einem Canary-Release?

**Antwort:** Eine vermehrte Anzahl unerwünschter oder unsicherer Ausgaben, z. B. erfolgreiche Red-Team-Umgehungen, unabhängig von der technischen Fehlerquote.

### 4. Wie sollten die vier Stoppsignalarten (technisch, Qualität, Kosten, Sicherheit) zueinander stehen?

**Antwort:** Sie sollten gleichrangig und parallel überwacht werden, da jedes einzelne Signal unabhängig von den anderen einen Grund darstellen kann, einen Rollout zu stoppen.

### 5. Wie gehst du vor, wenn nach einem vollständigen Modell-Rollout unerwartet hohe Betriebskosten auftreten?

**Antwort:** Ich prüfe, ob während der Canary-Phase ein Kosten-Stoppsignal überwacht wurde, und ergänze dieses für zukünftige Canary-Releases, um Kostensteigerungen frühzeitig vor vollständigem Rollout zu erkennen.

### 6. Widersprüchliche Anforderung: Team will schnellen, unkomplizierten Rollout neuer Modellstände UND garantiert keine unbemerkten Qualitäts-, Kosten- oder Sicherheitsprobleme — wie gehst du vor?

**Antwort:** Ich würde alle vier Stoppsignale automatisiert und parallel während jeder Canary-Stufe überwachen lassen, sodass der Rollout bei unauffälligen Signalen automatisch und schnell fortschreitet, aber bei Verletzung jeder einzelnen Grenze sofort und automatisch gestoppt wird, ohne dass manuelle Zwischenprüfungen den Prozess verlangsamen.

## Praktische Labs

~~~python
def check_canary_stage(technical_error_rate, quality_score_delta, cost_per_request_delta_pct, security_bypass_rate):
    stop_reasons = []
    if technical_error_rate > 0.01:
        stop_reasons.append(f"technical error rate too high: {technical_error_rate:.2%}")
    if quality_score_delta < -0.05:
        stop_reasons.append(f"quality regression detected: {quality_score_delta:+.2%}")
    if cost_per_request_delta_pct > 0.20:
        stop_reasons.append(f"cost increase too high: {cost_per_request_delta_pct:+.2%}")
    if security_bypass_rate > 0.0:
        stop_reasons.append(f"security bypass rate non-zero: {security_bypass_rate:.2%}")
    return stop_reasons

scenario = {
    "technical_error_rate": 0.002,   # technically fine
    "quality_score_delta": -0.01,    # slight, acceptable dip
    "cost_per_request_delta_pct": 0.35,  # 35% more expensive per request
    "security_bypass_rate": 0.0,
}

stop_reasons = check_canary_stage(**scenario)

if stop_reasons:
    print("CANARY STOPPED. Reasons:")
    for r in stop_reasons:
        print(f"  - {r}")
    print("Note: technical error rate alone would have PASSED this canary -- cost signal caught the real issue.")
else:
    print("Canary passes all four signal checks -- safe to increase traffic percentage.")
~~~

## Dependencies, Cross-References und Quellen

1. Humble, Farley: [Continuous Delivery — Canary Releasing](https://martinfowler.com/bliki/CanaryRelease.html), abgerufen 2026-09-17.
2. Sculley et al.: [Hidden Technical Debt in Machine Learning Systems](https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html), abgerufen 2026-09-17.

Offline- und Online-Evaluation sind kanonisch in [KB-0368](18-offline-und-online-evaluation.md) behandelt; Drift und Qualitätsänderung in [KB-0369](19-drift-und-qualitaetsaenderung.md); Promptfoo und Konfigurationstests in [KB-0363](13-promptfoo-und-konfigurationstests.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, mehrdimensionale Canary-Analyse-Plattformen, die technische, Qualitäts-, Kosten- und Sicherheitssignale gemeinsam auswerten | Adopting | Gegenüber isolierten, einzelnen Überwachungswerkzeugen pro Signalart für konsistentere Rollout-Entscheidungen bevorzugen. |
| Automatisierte Rollback-Mechanismen, die bei Grenzverletzung ohne manuelles Eingreifen sofort auf den bisherigen Stand zurücksetzen | Adopting | Gegenüber manuellem Rollback für schnellere Reaktionszeit bei erkannten Problemen bevorzugen. |

Ein Team akzeptiert einen vollständigen Modell-Rollout erst, wenn alle vier Stoppsignalarten während der gesamten Canary-Phase innerhalb akzeptabler Grenzen geblieben sind.
