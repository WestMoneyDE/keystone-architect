---
{"id": "KB-0439", "title": "Inferenzkapazität und Lastprofile", "domain": "17", "sequence": 27, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "GENAI", "MLOPS"], "requires": [{"id": "KB-0426", "concepts": ["Continuous Batching"], "needed_for": "understanding"}, {"id": "KB-0438", "concepts": ["Verteilte Inferenz und Parallelisierung"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein reproduzierbares Lastprofil (Prefill-/Decode-Anteile, Kontextlängenverteilung, Nebenläufigkeit) für einen konkreten Inferenzdienst erstellen und daraus die tatsächliche Kapazitätsgrenze messen können, statt sich auf theoretische FLOPS-Angaben zu verlassen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Kapazitätsplanung für einen Inferenzdienst anhand gemessener, reproduzierbarer Lastprofile statt anhand von Hersteller-Benchmark-Zahlen durchführen, die typischerweise abweichende Lastannahmen zugrunde legen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Kapazitätsüberschreitung im produktiven Betrieb auf eine Diskrepanz zwischen dem bei der Planung angenommenen und dem tatsächlichen Lastprofil zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Kapazitätsplanungsrichtlinien für Inferenzdienste im Unternehmen anhand gemessener, reproduzierbarer Lastprofile statt anhand theoretischer Hardware-Spezifikationen festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung spezifischer Lasttest-Werkzeuge im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis reproduzierbarer Kapazitätsmessung als Entscheidungsgrundlage, nicht die Werkzeug-Interna."}}, "lab_validation": [{"lab_id": "KB-0439-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand von Serving-Framework-Dokumentation zu Lasttest-Methodik, kein aktives Deployment verwendet", "evidence": "Anhand von Dokumentation zu Lasttest-Methodik für LLM-Serving-Systeme wird nachvollzogen, warum theoretische FLOPS-Angaben allein keine verlässliche Kapazitätsgrenze liefern, welche Lastprofil-Dimensionen (Prefill-/Decode-Anteile, Kontextlängenverteilung, Nebenläufigkeit) für eine reproduzierbare Messung erfasst werden müssen, und warum Abbruch- und Überlastfälle getrennt von der regulären Kapazitätsgrenze gemessen werden sollten.", "limitations": "Kein reales Deployment getestet, keine realen Kapazitätsmessungen für einen konkreten Inferenzdienst erhoben."}]}
---
# Inferenzkapazität und Lastprofile

> **Ziel:** Die tatsächliche Kapazitätsgrenze eines Inferenzdienstes (wie viele gleichzeitige Anfragen bei welcher Latenz bedient werden können) lässt sich nicht zuverlässig aus theoretischen FLOPS-Angaben (Gleitkommaoperationen pro Sekunde) der eingesetzten GPU-Hardware ableiten, da die tatsächliche Auslastung von zahlreichen Faktoren abhängt, die reale Lastprofile bestimmen — dem Verhältnis von Prefill- zu Decode-Anteil (siehe Disaggregated Prefill/Decode, [KB-0424](12-disaggregated-prefill-und-decode.md)), der Kontextlängenverteilung, und der tatsächlichen Nebenläufigkeit unter kontinuierlichem Batching (siehe [KB-0426](14-continuous-batching.md)). Der zentrale Punkt dieses Kapitels ist, dass Kapazitätsplanung auf reproduzierbaren, gemessenen Lastprofilen basieren muss, die dem tatsächlichen, erwarteten Nutzungsmuster entsprechen, statt auf theoretischen Hardware-Spezifikationen oder aus abweichenden Kontexten übernommenen Benchmark-Zahlen, und dass Abbruch- (z. B. vorzeitig beendete Anfragen) und Überlastfälle (Verhalten jenseits der Kapazitätsgrenze) getrennt von der regulären Kapazitätsmessung betrachtet werden müssen.

## Zweck, Mental Model und Dependencies

Eine theoretische FLOPS-Angabe beschreibt die maximale, unter idealen Bedingungen erreichbare Rechenleistung einer GPU, sagt jedoch wenig darüber aus, wie viele tatsächliche Anfragen ein konkreter Inferenzdienst gleichzeitig bedienen kann — diese tatsächliche Kapazität hängt von der Decode-Phase (die primär durch Speicherbandbreite, nicht Rechenleistung limitiert ist, siehe GPU-Architektur, [KB-0413](01-gpu-architektur-und-rechenpfade.md)), von der VRAM-Belegung durch den KV-Cache (die mit der Kontextlänge jeder aktiven Anfrage wächst, siehe [KB-0425](13-kv-caches-und-speicherbewusstes-routing.md)), und vom tatsächlichen Verhältnis zwischen Prefill- und Decode-Last ab. Ein reproduzierbares Lastprofil erfasst diese Dimensionen explizit: das Verhältnis von Prefill- zu Decode-Anteil (wie lang sind typische Eingabe-Prompts im Verhältnis zu generierten Ausgaben), die Kontextlängenverteilung (nicht nur der Durchschnitt, sondern die tatsächliche Verteilung, da wenige sehr lange Kontexte den VRAM-Bedarf unverhältnismäßig beeinflussen können), und die Nebenläufigkeit (wie viele Anfragen tatsächlich gleichzeitig aktiv sind, nicht nur die Gesamtanfragerate über die Zeit gemittelt). Der zentrale methodische Punkt ist, dass Kapazitätsgrenzen unter Last gemessen werden müssen, die diesem tatsächlichen Profil entspricht — ein Lasttest mit gleichmäßig kurzen Prompts und kurzen Ausgaben liefert eine andere, potenziell irreführende Kapazitätsgrenze als ein Lasttest mit dem tatsächlichen, gemischten Lastmuster der Produktionsumgebung. Zusätzlich müssen Abbruch- und Überlastfälle (z. B. wie sich der Dienst verhält, wenn Anfragen vorzeitig abgebrochen werden, oder wenn die tatsächliche Last die gemessene Kapazitätsgrenze überschreitet) getrennt gemessen werden, da sich diese Fälle grundlegend anders verhalten können als der reguläre Betrieb innerhalb der Kapazitätsgrenze.

~~~text
Theoretical FLOPS: describes MAX achievable compute under ideal conditions
  -> says LITTLE about how many actual concurrent requests a real service can serve
Actual capacity depends on:
  decode phase (memory-bandwidth-bound, NOT compute-bound, see KB-0413)
  KV-cache VRAM usage (grows with context length of EACH active request, see KB-0425)
  actual prefill:decode ratio of the workload
Reproducible load profile MUST capture:
  prefill:decode ratio (typical prompt length vs. generated output length)
  context length DISTRIBUTION (not just average -- few very long contexts skew VRAM need disproportionately)
  concurrency (requests ACTUALLY active simultaneously, not just average rate over time)
KEY METHODOLOGICAL POINT: capacity limits must be measured under load matching the ACTUAL profile
  test w/ uniform short prompts/outputs -> MISLEADING capacity number vs. real mixed production load
  overload/abort cases MUST be measured SEPARATELY from within-capacity regular behavior
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Prefill-/Decode-Anteil | bestimmt Rechen- versus Speicherbandbreitenbedarf | muss dem tatsächlichen Nutzungsmuster entsprechen |
| Kontextlängenverteilung | beeinflusst VRAM-Bedarf durch KV-Cache | Durchschnittswerte allein sind unzureichend, Verteilung ist relevant |
| Nebenläufigkeit | tatsächlich gleichzeitig aktive Anfragen | bestimmt die reale, nicht nur die über die Zeit gemittelte Last |
| Abbruch-/Überlastfälle | Verhalten außerhalb oder am Rand der Kapazitätsgrenze | müssen getrennt von der regulären Kapazitätsmessung betrachtet werden |

Implementierung: Vor einer Kapazitätsplanung wird das tatsächliche, erwartete Lastprofil des Zielanwendungsfalls erhoben (Prefill-/Decode-Verhältnis, Kontextlängenverteilung, erwartete Nebenläufigkeit), statt sich auf generische Benchmark-Zahlen aus abweichenden Kontexten zu verlassen. Ein Lasttest wird mit einem reproduzierbaren, diesem tatsächlichen Profil entsprechenden Lastgenerator durchgeführt, um die tatsächliche Kapazitätsgrenze (maximale Nebenläufigkeit bei akzeptabler Latenz) zu messen. Das Verhalten bei Abbruch (z. B. Client-seitig abgebrochene Anfragen) und bei Überlast (Anfragen jenseits der gemessenen Kapazitätsgrenze) wird in separaten, gezielten Tests erhoben, um sicherzustellen, dass der Dienst in diesen Randfällen ein angemessenes, definiertes Verhalten zeigt (z. B. kontrollierte Ablehnung statt unkontrollierten Absturzes).

## Scalability, Reliability, Security und Observability

Inferenzkapazitätsplanung skaliert die Verlässlichkeit der geplanten Kapazitätsgrenze proportional zur Passgenauigkeit des gemessenen Lastprofils zum tatsächlichen Produktionslastmuster; die Reliability-Grenze liegt darin, dass eine anhand eines abweichenden Lastprofils (z. B. theoretischer FLOPS-Angaben oder generischer Benchmarks) geplante Kapazität proportional zur Diskrepanz zum tatsächlichen Lastprofil zu unerwarteten Kapazitätsüberschreitungen im produktiven Betrieb führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| der Dienst überschreitet im produktiven Betrieb unerwartet die geplante Kapazitätsgrenze | das bei der Planung angenommene Lastprofil weicht vom tatsächlichen Produktionslastmuster ab | das tatsächliche Produktionslastprofil messen und mit dem bei der Planung angenommenen Profil vergleichen |
| der Dienst zeigt bei Überlast unkontrolliertes, undefiniertes Verhalten | das Verhalten bei Überlast wurde nicht separat getestet, sondern nur die reguläre Kapazität innerhalb der Grenze | einen gezielten Überlasttest durchführen und ein definiertes, kontrolliertes Ablehnungsverhalten implementieren |
| die gemessene Kapazitätsgrenze weicht stark zwischen verschiedenen Testläufen ab | der Lasttest ist nicht reproduzierbar konfiguriert (z. B. variierende Kontextlängenverteilung zwischen Testläufen) | den Lasttest mit einem exakt definierten, reproduzierbaren Lastprofil wiederholen |

Security: Lasttests, die reale oder realitätsnahe Daten verwenden, sollten mit denselben Datenschutzüberlegungen wie andere Testumgebungen behandelt werden. Observability: Die tatsächliche Nebenläufigkeit, die Latenzverteilung unter verschiedenen Lastniveaus, und das Verhalten bei Erreichen oder Überschreiten der Kapazitätsgrenze sind zentrale Metriken zur Bewertung der Kapazitätsplanung.

## Trade-offs und Entscheidungen

**Staff** misst die tatsächliche Kapazitätsgrenze anhand eines reproduzierbaren, dem realen Nutzungsmuster entsprechenden Lastprofils, statt sich auf theoretische FLOPS-Angaben zu verlassen. **Principal** macht die Lastprofil-Annahmen und deren Grundlage für das Team nachvollziehbar. **Chief** legt Kapazitätsplanungsrichtlinien für Inferenzdienste im Unternehmen anhand gemessener, reproduzierbarer Lastprofile fest.

Anti-Patterns: Kapazitätsplanung ausschließlich anhand theoretischer FLOPS-Angaben oder generischer, aus abweichenden Kontexten übernommener Benchmark-Zahlen durchführen; Lasttests mit unrealistisch gleichmäßigen Anfragemustern statt dem tatsächlichen, gemischten Produktionslastmuster durchführen; Abbruch- und Überlastfälle nicht separat testen und dadurch undefiniertes Verhalten im produktiven Betrieb riskieren.

## Production Checklist

- [ ] Das tatsächliche, erwartete Lastprofil (Prefill-/Decode-Anteil, Kontextlängenverteilung, Nebenläufigkeit) ist erhoben.
- [ ] Die Kapazitätsgrenze wurde mit einem reproduzierbaren, diesem Profil entsprechenden Lasttest gemessen.
- [ ] Das Verhalten bei Abbruch- und Überlastfällen wurde separat getestet und ist definiert.
- [ ] Nebenläufigkeit, Latenzverteilung und Kapazitätsgrenze werden im produktiven Betrieb überwacht.

## Interviewfragen

### 1. Warum reichen theoretische FLOPS-Angaben nicht aus, um die tatsächliche Inferenzkapazität zu bestimmen?

**Antwort:** Weil die tatsächliche Kapazität von der primär speicherbandbreitenlimitierten Decode-Phase, der VRAM-Belegung durch den KV-Cache, und dem tatsächlichen Prefill-/Decode-Verhältnis der Workload abhängt, die theoretische FLOPS-Angaben nicht abbilden.

### 2. Welche Dimensionen muss ein reproduzierbares Lastprofil erfassen?

**Antwort:** Das Verhältnis von Prefill- zu Decode-Anteil, die Kontextlängenverteilung (nicht nur den Durchschnitt), und die tatsächliche Nebenläufigkeit aktiver Anfragen.

### 3. Warum ist die Kontextlängenverteilung relevanter als der Durchschnittswert allein?

**Antwort:** Weil wenige sehr lange Kontexte den VRAM-Bedarf durch den KV-Cache unverhältnismäßig stark beeinflussen können, was ein reiner Durchschnittswert nicht sichtbar macht.

### 4. Warum sollten Abbruch- und Überlastfälle getrennt von der regulären Kapazitätsmessung getestet werden?

**Antwort:** Weil sich der Dienst in diesen Randfällen grundlegend anders verhalten kann als im regulären Betrieb innerhalb der Kapazitätsgrenze, und ein undefiniertes Verhalten in diesen Fällen im produktiven Betrieb zu unkontrollierten Ausfällen führen kann.

### 5. Wie gehst du vor, wenn ein Dienst im produktiven Betrieb unerwartet die geplante Kapazitätsgrenze überschreitet?

**Antwort:** Ich messe das tatsächliche Produktionslastprofil und vergleiche es mit dem bei der Planung angenommenen Profil, um die Diskrepanz zu identifizieren, die zur Fehleinschätzung geführt hat.

### 6. Widersprüchliche Anforderung: Team will eine schnelle Kapazitätsschätzung ohne aufwendigen Lasttest, aber verlässliche Produktionszahlen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass eine schnelle Schätzung anhand theoretischer Hardware-Spezifikationen ein erhebliches Risiko für Fehleinschätzungen birgt, und zumindest einen minimalen, aber reproduzierbaren Lasttest mit dem grob erwarteten Lastprofil vorschlagen, statt auf jegliche Messung zu verzichten.

## Praktische Labs

~~~python
# Conceptual load-profile-driven capacity estimation (not executed against a real deployment):

def estimate_capacity(vram_gb, model_weights_gb, kv_cache_gb_per_request_avg, concurrency_safety_margin=0.85):
    available_for_kv_cache = vram_gb - model_weights_gb
    max_concurrent_requests = available_for_kv_cache / kv_cache_gb_per_request_avg
    safe_capacity = int(max_concurrent_requests * concurrency_safety_margin)
    return safe_capacity

# Scenario A: short-context-dominant profile
capacity_short_context = estimate_capacity(vram_gb=80, model_weights_gb=40, kv_cache_gb_per_request_avg=0.5)

# Scenario B: long-context-dominant profile (same hardware, different ACTUAL load profile)
capacity_long_context = estimate_capacity(vram_gb=80, model_weights_gb=40, kv_cache_gb_per_request_avg=3.0)

print(f"Estimated safe capacity, short-context-dominant profile: {capacity_short_context} concurrent requests")
print(f"Estimated safe capacity, long-context-dominant profile: {capacity_long_context} concurrent requests")
~~~

## Dependencies, Cross-References und Quellen

1. vLLM-Dokumentation: [Performance and Tuning — Benchmarking Guidance](https://docs.vllm.ai/en/latest/), abgerufen 2026-09-18.

Continuous Batching ist kanonisch in [KB-0426](14-continuous-batching.md) behandelt; Verteilte Inferenz und Parallelisierung in [KB-0438](26-verteilte-inferenz-und-parallelisierung.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, produktionslastbasierte Lastprofil-Generierung aus realen Anfrageprotokollen für reproduzierbare Lasttests | Evaluating | Gegenüber manuell konstruierten, synthetischen Lastprofilen bevorzugen, sobald die Repräsentativität der generierten Profile geprüft ist. |

Ein Team akzeptiert eine Kapazitätsplanung für einen Inferenzdienst erst, wenn sie auf einem reproduzierbaren Lasttest basiert, dessen Lastprofil (Prefill-/Decode-Anteil, Kontextlängenverteilung, Nebenläufigkeit) nachweislich dem tatsächlichen, erwarteten Produktionsmuster entspricht.
