---
{"id": "KB-0440", "title": "Serving-Benchmarks und Produktionsfreigabe", "domain": "17", "sequence": 28, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "GENAI", "MLOPS"], "requires": [{"id": "KB-0439", "concepts": ["Inferenzkapazität und Lastprofile"], "needed_for": "understanding"}, {"id": "KB-0376", "concepts": ["Approval Workflows für AI-Releases"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Time-to-First-Token (TTFT), Inter-Token-Latenz und Fehlerraten gemeinsam für einen konkreten Inferenzdienst messen können und erklären, warum diese drei Metriken einzeln betrachtet ein unvollständiges Bild liefern.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein belastbares Benchmark-Protokoll für den Vergleich mehrerer Inferenz-Engines (z. B. vLLM, SGLang, TensorRT-LLM) gestalten, das Warmup-Effekte, OOM-Fälle und Anfrageabbrüche explizit berücksichtigt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine irreführende Benchmark-Schlussfolgerung auf einen methodischen Fehler (z. B. fehlender Warmup, ignorierte Fehlerrate, unrepräsentatives Lastprofil) zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Produktionsfreigabe-Kriterien für Inferenzdienste im Unternehmen anhand eines vollständigen, methodisch belastbaren Benchmark-Protokolls statt anhand einzelner, isolierter Metriken festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung spezifischer Benchmark-Werkzeuge im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis eines vollständigen, methodisch belastbaren Benchmark-Protokolls als Entscheidungsgrundlage, nicht die Werkzeug-Interna."}}, "lab_validation": [{"lab_id": "KB-0440-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand von Serving-Framework-Benchmark-Dokumentation, kein aktives Deployment verwendet", "evidence": "Anhand von Dokumentation zu Serving-Benchmark-Methodik wird nachvollzogen, warum TTFT (Zeit bis zum ersten generierten Token), Inter-Token-Latenz (Zeit zwischen aufeinanderfolgenden Tokens) und Fehlerraten gemeinsam betrachtet werden müssen, um ein belastbares Bild der Nutzererfahrung zu erhalten, und warum Warmup-Effekte, OOM-Fälle und Anfrageabbrüche bei einem methodisch soliden Enginevergleich explizit berücksichtigt werden müssen.", "limitations": "Kein reales Deployment getestet, keine realen Benchmark-Messungen für konkrete Engines erhoben."}]}
---
# Serving-Benchmarks und Produktionsfreigabe

> **Ziel:** Ein belastbarer Vergleich von Inferenz-Engines oder eine Produktionsfreigabe-Entscheidung erfordert die gemeinsame Betrachtung mehrerer Metriken — Time-to-First-Token (TTFT, die Zeit vom Absenden einer Anfrage bis zum ersten generierten Token, relevant für die wahrgenommene Reaktionsfähigkeit), Inter-Token-Latenz (die Zeit zwischen aufeinanderfolgenden generierten Tokens, relevant für die wahrgenommene Generierungsgeschwindigkeit), und Fehlerraten (siehe Kapazitätsplanung, [KB-0439](27-inferenzkapazitaet-und-lastprofile.md)) — da eine isolierte Betrachtung einer einzelnen Metrik ein irreführendes Bild liefern kann, z. B. eine niedrige durchschnittliche Latenz bei gleichzeitig hoher Fehlerrate unter Last. Der zentrale Punkt dieses Kapitels ist, dass ein methodisch belastbares Benchmark-Protokoll zusätzlich Warmup-Effekte (anfänglich abweichende Leistung vor Erreichen eines stabilen Betriebszustands), OOM-Fälle (Speichererschöpfung unter hoher Last) und Anfrageabbrüche explizit berücksichtigen muss, statt diese Randfälle aus der Messung auszuschließen und dadurch ein zu optimistisches Bild zu erzeugen.

## Zweck, Mental Model und Dependencies

TTFT und Inter-Token-Latenz messen unterschiedliche Aspekte der Nutzererfahrung: TTFT wird primär durch die Prefill-Phase und die Zeit in der Warteschlange bestimmt (siehe Kapazität und Lastprofile, [KB-0439](27-inferenzkapazitaet-und-lastprofile.md)), während die Inter-Token-Latenz primär durch die Decode-Phase und den Grad der gleichzeitigen Auslastung (kontinuierliches Batching, siehe [KB-0426](14-continuous-batching.md)) bestimmt wird — eine Engine kann bei einer dieser Metriken überlegen sein und bei der anderen unterlegen, weshalb beide gemeinsam betrachtet werden müssen, um ein vollständiges Bild zu erhalten. Fehlerraten (fehlgeschlagene oder abgebrochene Anfragen) müssen ebenfalls Teil desselben Benchmarks sein, da eine Engine, die unter hoher Last einen größeren Anteil an Anfragen ablehnt oder abbricht, möglicherweise niedrigere Latenzwerte für die verbleibenden, erfolgreichen Anfragen zeigt — ein Vergleich, der nur die erfolgreichen Anfragen betrachtet, würde diese Engine fälschlicherweise als überlegen darstellen. Warmup-Effekte entstehen, weil viele Serving-Systeme eine anfängliche Phase durchlaufen (z. B. Cache-Aufbau, JIT-Kompilierung, Speicherallokation), in der die Leistung von der stabilen Betriebsleistung abweicht — ein Benchmark, der diese Phase nicht explizit von der stabilen Messung trennt, liefert verzerrte Ergebnisse. Der zentrale methodische Punkt ist, dass ein belastbares Benchmark-Protokoll all diese Dimensionen (TTFT, Inter-Token-Latenz, Fehlerrate, Warmup-Trennung, OOM- und Abbruchverhalten) gemeinsam und unter einem realistischen, reproduzierbaren Lastprofil (siehe [KB-0439](27-inferenzkapazitaet-und-lastprofile.md)) erfasst, statt eine einzelne, isolierte Metrik als alleinige Entscheidungsgrundlage für einen Enginevergleich oder eine Produktionsfreigabe zu verwenden.

~~~text
TTFT (time to first token): primarily determined by prefill phase + queue wait time
Inter-token latency: primarily determined by decode phase + degree of concurrent load (batching)
  -> an engine can be SUPERIOR on one metric and INFERIOR on the other -> BOTH must be considered together
Error rate MUST be part of the SAME benchmark:
  engine rejecting/aborting MORE requests under load -> LOWER latency for the REMAINING successful ones
  -> comparing successful-requests-only would FALSELY show this engine as superior
Warmup effects: initial phase (cache warm-up, JIT compilation, memory allocation) differs from steady state
  -> benchmark NOT separating warmup from steady-state measurement -> DISTORTED results
KEY METHODOLOGICAL POINT: a solid benchmark protocol captures ALL dimensions TOGETHER
  (TTFT, inter-token latency, error rate, warmup separation, OOM/abort behavior)
  under a REALISTIC, reproducible load profile -- never a single isolated metric alone
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| TTFT | misst Reaktionsfähigkeit (Prefill + Warteschlange) | muss gemeinsam mit Inter-Token-Latenz betrachtet werden |
| Inter-Token-Latenz | misst Generierungsgeschwindigkeit (Decode-Phase) | kann bei hoher Nebenläufigkeit von TTFT abweichende Trends zeigen |
| Fehlerrate | Anteil fehlgeschlagener/abgebrochener Anfragen | muss Teil desselben Benchmarks sein, nicht isoliert von Latenzmetriken betrachtet werden |
| Warmup-Trennung | trennt anfängliche von stabiler Betriebsleistung | fehlende Trennung verzerrt die Messung |
| OOM-/Abbruchverhalten | Verhalten außerhalb der regulären Kapazität | muss explizit getestet werden, nicht aus der Messung ausgeschlossen werden |

Implementierung: Ein Benchmark-Protokoll für einen Enginevergleich oder eine Produktionsfreigabe erfasst TTFT, Inter-Token-Latenz und Fehlerrate gemeinsam unter demselben, reproduzierbaren Lastprofil (siehe [KB-0439](27-inferenzkapazitaet-und-lastprofile.md)), statt diese Metriken isoliert oder unter unterschiedlichen Lastbedingungen zu erheben. Die Messung trennt explizit eine Warmup-Phase (in der die Leistung noch nicht dem stabilen Betriebszustand entspricht) von der eigentlichen, aussagekräftigen Messphase. OOM-Fälle und Anfrageabbrüche werden durch gezielte Überlasttests (siehe [KB-0439](27-inferenzkapazitaet-und-lastprofile.md)) explizit provoziert und deren Verhalten (kontrollierte Ablehnung versus unkontrollierter Absturz) dokumentiert, bevor eine Produktionsfreigabe erteilt wird (siehe Approval Workflows für AI-Releases, [KB-0376](../15-mlops-evaluation/26-approval-workflows-fuer-ai-releases.md)).

## Scalability, Reliability, Security und Observability

Ein methodisch belastbares Benchmark-Protokoll skaliert die Verlässlichkeit einer Produktionsfreigabe-Entscheidung proportional zur Vollständigkeit der erfassten Dimensionen (TTFT, Inter-Token-Latenz, Fehlerrate, Warmup-Trennung, Überlastverhalten); die Reliability-Grenze liegt darin, dass ein unvollständiges Benchmark-Protokoll (z. B. das nur eine isolierte Latenzmetrik ohne Fehlerrate betrachtet) proportional zur Diskrepanz zwischen gemessenem und tatsächlichem Systemverhalten zu einer irreführenden, potenziell falschen Freigabeentscheidung führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Engine zeigt im Benchmark niedrigere Latenz, aber im produktiven Betrieb häufigere Probleme | die Fehlerrate wurde im Benchmark nicht gemeinsam mit der Latenz betrachtet, wodurch eine höhere Ablehnungsrate die Latenzwerte künstlich verbessert hat | die Fehlerrate desselben Benchmarks nachträglich prüfen und mit der Latenzmessung in Bezug setzen |
| Benchmark-Ergebnisse variieren stark zwischen aufeinanderfolgenden Testläufen | Warmup-Effekte wurden nicht von der stabilen Messphase getrennt | die Messung explizit in eine Warmup- und eine stabile Messphase aufteilen |
| der Dienst zeigt im produktiven Betrieb unerwartetes Verhalten bei Überlast, das im Benchmark nicht sichtbar war | OOM- und Abbruchfälle wurden im Benchmark nicht gezielt getestet | einen gezielten Überlasttest durchführen und das Verhalten explizit dokumentieren |

Security: Benchmark-Daten und -Ergebnisse, die interne Kapazitätsgrenzen offenlegen, sollten mit angemessener Vertraulichkeit behandelt werden, insbesondere wenn sie Rückschlüsse auf produktive Systemgrenzen zulassen. Observability: TTFT, Inter-Token-Latenz, Fehlerrate, und explizit markierte Warmup- versus stabile Messphasen sind zentrale, gemeinsam zu betrachtende Metriken für Benchmark- und Freigabeentscheidungen.

## Trade-offs und Entscheidungen

**Staff** erfasst TTFT, Inter-Token-Latenz und Fehlerrate gemeinsam unter einem reproduzierbaren Lastprofil, statt eine einzelne Metrik isoliert zu bewerten. **Principal** macht die Benchmark-Methodik und deren Vollständigkeit für das Team nachvollziehbar. **Chief** legt Produktionsfreigabe-Kriterien für Inferenzdienste im Unternehmen anhand eines vollständigen, methodisch belastbaren Benchmark-Protokolls fest.

Anti-Patterns: eine Engine ausschließlich anhand einer isolierten Latenzmetrik ohne gleichzeitige Betrachtung der Fehlerrate bewerten; Benchmark-Ergebnisse ohne explizite Trennung von Warmup- und stabiler Messphase interpretieren; eine Produktionsfreigabe erteilen, ohne OOM- und Abbruchverhalten gezielt getestet zu haben.

## Production Checklist

- [ ] TTFT, Inter-Token-Latenz und Fehlerrate wurden gemeinsam unter demselben, reproduzierbaren Lastprofil gemessen.
- [ ] Warmup-Phase und stabile Messphase sind explizit getrennt.
- [ ] OOM- und Anfrageabbruchverhalten wurden durch gezielte Überlasttests geprüft und dokumentiert.
- [ ] Die Produktionsfreigabe-Entscheidung basiert auf dem vollständigen Benchmark-Protokoll, nicht auf einer isolierten Metrik.

## Interviewfragen

### 1. Was misst TTFT, und was misst die Inter-Token-Latenz?

**Antwort:** TTFT misst die Zeit vom Absenden einer Anfrage bis zum ersten generierten Token (primär Prefill-Phase und Warteschlangenzeit); die Inter-Token-Latenz misst die Zeit zwischen aufeinanderfolgenden generierten Tokens (primär Decode-Phase).

### 2. Warum kann ein Vergleich, der nur erfolgreiche Anfragen betrachtet, irreführend sein?

**Antwort:** Weil eine Engine, die unter Last mehr Anfragen ablehnt oder abbricht, für die verbleibenden, erfolgreichen Anfragen niedrigere Latenzwerte zeigen kann, was sie fälschlicherweise als überlegen erscheinen lässt, wenn die Fehlerrate nicht mitbetrachtet wird.

### 3. Warum müssen Warmup-Effekte von der stabilen Messphase getrennt werden?

**Antwort:** Weil viele Serving-Systeme eine anfängliche Phase (Cache-Aufbau, JIT-Kompilierung, Speicherallokation) durchlaufen, in der die Leistung von der stabilen Betriebsleistung abweicht; eine fehlende Trennung verzerrt die Messergebnisse.

### 4. Warum sollten OOM- und Abbruchfälle explizit getestet statt aus dem Benchmark ausgeschlossen werden?

**Antwort:** Weil das Verhalten außerhalb der regulären Kapazitätsgrenze für die produktive Nutzung relevant ist; ein Ausschluss dieser Fälle erzeugt ein zu optimistisches, unvollständiges Bild der tatsächlichen Systemrobustheit.

### 5. Wie gehst du vor, wenn eine Engine im Benchmark niedrigere Latenz zeigt, aber im produktiven Betrieb häufigere Probleme auftreten?

**Antwort:** Ich prüfe die Fehlerrate desselben Benchmarks, da eine höhere Ablehnungsrate unter Last die gemessenen Latenzwerte künstlich verbessert haben könnte, was im ursprünglichen Vergleich möglicherweise nicht ausreichend berücksichtigt wurde.

### 6. Widersprüchliche Anforderung: Team will eine schnelle Produktionsfreigabe-Entscheidung anhand einer einzelnen, einfachen Latenzmetrik treffen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass eine isolierte Latenzmetrik ohne Fehlerrate, Warmup-Trennung und Überlastverhalten ein irreführendes Bild liefern kann, und zumindest einen minimalen, aber vollständigen Benchmark-Durchlauf (alle Kerndimensionen, ein reproduzierbares Lastprofil) als Voraussetzung für die Freigabeentscheidung vorschlagen.

## Praktische Labs

~~~python
# Conceptual multi-metric engine comparison (not executed against real engines):

def compare_engines(engine_results):
    """engine_results: {name: {"ttft_ms": ..., "inter_token_latency_ms": ..., "error_rate_pct": ...}}"""
    print(f"{'Engine':<15}{'TTFT (ms)':<12}{'Inter-Token (ms)':<18}{'Error Rate (%)':<15}{'Verdict'}")
    for name, metrics in engine_results.items():
        verdict = "acceptable" if metrics["error_rate_pct"] < 1.0 else "REJECT: error rate too high despite latency"
        print(f"{name:<15}{metrics['ttft_ms']:<12}{metrics['inter_token_latency_ms']:<18}{metrics['error_rate_pct']:<15}{verdict}")

engine_results = {
    "engine_a": {"ttft_ms": 120, "inter_token_latency_ms": 18, "error_rate_pct": 0.3},
    "engine_b": {"ttft_ms": 90, "inter_token_latency_ms": 15, "error_rate_pct": 4.2},  # faster but drops requests
}

compare_engines(engine_results)
~~~

## Dependencies, Cross-References und Quellen

1. vLLM-Dokumentation: [Benchmarking Guidance — TTFT, Inter-Token Latency, Throughput](https://docs.vllm.ai/en/latest/), abgerufen 2026-09-18.

Inferenzkapazität und Lastprofile sind kanonisch in [KB-0439](27-inferenzkapazitaet-und-lastprofile.md) behandelt; Approval Workflows für AI-Releases in [KB-0376](../15-mlops-evaluation/26-approval-workflows-fuer-ai-releases.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte, community-getriebene Benchmark-Suiten für LLM-Serving-Engines mit einheitlicher Methodik über mehrere Frameworks hinweg | Evaluating | Gegenüber selbst entwickelten Benchmark-Protokollen bevorzugen, sobald deren Methodik (Warmup-Trennung, Fehlerraten-Einbeziehung) geprüft und für den eigenen Anwendungsfall repräsentativ ist. |

Ein Team akzeptiert eine Produktionsfreigabe für einen Inferenzdienst erst, wenn TTFT, Inter-Token-Latenz und Fehlerrate gemeinsam unter einem realistischen Lastprofil gemessen wurden und Warmup-, OOM- sowie Abbruchverhalten explizit getestet und dokumentiert sind.
