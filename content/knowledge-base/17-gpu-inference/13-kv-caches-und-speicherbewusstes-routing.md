---
{"id": "KB-0425", "title": "KV Caches und speicherbewusstes Routing", "domain": "17", "sequence": 13, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "MLOPS"], "requires": [{"id": "KB-0415", "concepts": ["VRAM und Speicherbudgets"], "needed_for": "understanding"}, {"id": "KB-0423", "concepts": ["NVIDIA Dynamo, Router"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Cachebelegung, Prefix-Reuse und Eviction-Verhalten eines KV-Cache-Systems anhand offizieller Dokumentation nachvollziehen und erklären können, wie Eviction-Entscheidungen den Prefix-Wiederverwendungsvorteil beeinflussen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Bewerten, wann KV-cache-aware Routing gegenüber einfacher Round-Robin-Verteilung einen relevanten Durchsatz- oder Latenzvorteil bringt, basierend auf der tatsächlichen Prefix-Überlappung und Cache-Kapazität der Workload.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartet niedrige Cache-Trefferrate auf eine konkrete Eviction-Konfiguration oder eine Fehlkonfiguration des Routings zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Die Einführung KV-cache-aware Routings im Unternehmen anhand gemessener Cache-Trefferraten und Durchsatzgewinne gegenüber der zusätzlichen Routing-Komplexität entscheiden.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung spezifischer Eviction-Algorithmen (z. B. LRU-Varianten für KV-Caches) im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Cachebelegung, Prefix-Reuse und Routing-Trade-offs als Entscheidungsgrundlage, nicht die Algorithmus-Interna."}}, "lab_validation": [{"lab_id": "KB-0425-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Konzeptuelle Einordnung anhand offizieller Dokumentation von Serving-Frameworks, kein aktives Deployment verwendet", "evidence": "Anhand der offiziellen Dokumentation von vLLM, SGLang und verwandten Serving-Frameworks wird nachvollzogen, wie KV-Cache-Speicher zwischen aktiven Anfragen aufgeteilt wird, wie Prefix-Wiederverwendung erkannt wird, und nach welchen Kriterien (z. B. am längsten ungenutzt) Cache-Einträge bei Speicherdruck verdrängt (evicted) werden.", "limitations": "Keine reale Ausführung gegen ein produktives Deployment durchgeführt, keine realen Cache-Trefferraten oder Latenzmessungen erhoben."}]}
---
# KV Caches und speicherbewusstes Routing

> **Ziel:** Der KV-Cache (Key-Value-Cache) speichert die während der Prefill- und Decode-Phase (siehe [KB-0424](12-disaggregated-prefill-und-decode.md)) berechneten Aufmerksamkeitszustände eines Sprachmodells, um sie bei nachfolgenden Generierungsschritten wiederzuverwenden, statt sie erneut zu berechnen. Der zentrale Punkt dieses Kapitels ist, dass die Cachebelegung (welcher Anteil des verfügbaren VRAM, siehe [KB-0415](03-vram-und-speicherbudgets.md), für den KV-Cache reserviert ist), die Eviction-Strategie (welche Cache-Einträge bei Speicherdruck verdrängt werden) und ein speicherbewusstes Routing (das Anfragen gezielt zu Instanzen mit bereits vorhandenem, relevantem Cache-Inhalt leitet) gemeinsam bestimmen, ob der tatsächliche Nutzen der Cache-Wiederverwendung realisiert wird oder ob einfache Round-Robin-Verteilung (gleichmäßige, cache-unabhängige Verteilung über verfügbare Instanzen) ausreichend ist.

## Zweck, Mental Model und Dependencies

Ein KV-Cache-Eintrag wird für jede aktive Anfrage im VRAM gehalten und wächst proportional zur bisherigen Sequenzlänge (Prompt plus bereits generierte Tokens); da der verfügbare VRAM begrenzt ist, muss bei hoher gleichzeitiger Anfragelast eine Eviction-Strategie entscheiden, welche Cache-Einträge (z. B. von abgeschlossenen oder am längsten inaktiven Anfragen) verdrängt werden, um Platz für neue Anfragen zu schaffen. Prefix-Reuse (die Wiederverwendung gemeinsamer Anfrageanfänge, siehe RadixAttention, [KB-0421](09-sglang.md)) funktioniert nur dann effektiv, wenn der relevante Cache-Eintrag zum Zeitpunkt einer neuen, denselben Prefix teilenden Anfrage noch nicht durch die Eviction-Strategie verdrängt wurde. Speicherbewusstes Routing adressiert dieses Problem auf Ebene der Anfrageverteilung: Statt Anfragen gleichmäßig (Round-Robin) über mehrere Serving-Instanzen zu verteilen, leitet ein cache-bewusster Router eine Anfrage bevorzugt zu der Instanz, die bereits einen relevanten Prefix im Cache vorhält, um die Wahrscheinlichkeit einer Cache-Wiederverwendung zu erhöhen. Der zentrale methodische Punkt ist, dass dieser zusätzliche Routing-Aufwand nur dann gerechtfertigt ist, wenn die tatsächliche Workload eine relevante Prefix-Überlappung aufweist und die Cache-Kapazität ausreicht, relevante Einträge bis zu ihrer Wiederverwendung vorzuhalten — bei geringer Überlappung oder sehr knapper Cache-Kapazität (häufige Eviction) bringt speicherbewusstes Routing keinen messbaren Vorteil gegenüber einfacher Round-Robin-Verteilung.

~~~text
KV-cache entry: per active request, grows with sequence length (prompt + generated tokens so far)
VRAM is limited -> under high concurrent load, EVICTION strategy decides what gets dropped
  (e.g. completed requests, longest-inactive entries) to make room for new ones
Prefix-reuse (RadixAttention, see KB-0421) only works if the relevant cache entry
  has NOT ALREADY BEEN EVICTED by the time a new request sharing that prefix arrives
KV-cache-aware routing: instead of round-robin, route a request to the INSTANCE
  that already holds a relevant prefix in cache -> increases reuse probability
KEY METHODOLOGICAL POINT: this routing overhead is only justified when
  (a) workload has RELEVANT prefix overlap AND (b) cache capacity is sufficient to
  retain relevant entries until reuse -> otherwise no measurable benefit vs. round-robin
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Cachebelegung | wie viel VRAM für den KV-Cache reserviert ist | begrenzt die Anzahl gleichzeitig haltbarer Cache-Einträge, muss gegen andere VRAM-Bedarfe abgewogen werden |
| Prefix-Reuse | Wiederverwendung gemeinsamer Anfrageanfänge im Cache | funktioniert nur, wenn der relevante Eintrag noch nicht verdrängt wurde |
| Eviction | Verdrängung von Cache-Einträgen bei Speicherdruck | Strategie (z. B. am längsten inaktiv) beeinflusst, ob relevante Einträge rechtzeitig verdrängt werden |
| KV-cache-aware Routing | leitet Anfragen zu Instanzen mit relevantem Cache-Inhalt | Vorteil hängt von tatsächlicher Prefix-Überlappung und Cache-Kapazität ab |

Implementierung: Die Cachebelegung wird basierend auf der erwarteten gleichzeitigen Anfragelast und der typischen Sequenzlänge dimensioniert, sodass ausreichend Kapazität für aktive Anfragen sowie für eine sinnvolle Vorhaltung wiederverwendbarer Prefixe besteht. Die Eviction-Strategie wird so konfiguriert, dass sie relevante, wahrscheinlich wiederverwendete Prefixe (z. B. häufig genutzte System-Prompts) bevorzugt länger im Cache hält als einmalige, unwahrscheinlich wiederverwendete Anfrageinhalte. Vor der Einführung KV-cache-aware Routings wird die tatsächliche Cache-Trefferrate unter einfacher Round-Robin-Verteilung gemessen, um eine Baseline zu etablieren, gegen die der Effekt des speicherbewussten Routings anschließend verglichen werden kann.

## Scalability, Reliability, Security und Observability

KV-cache-aware Routing skaliert den Durchsatzvorteil proportional zur tatsächlichen Prefix-Überlappung der Workload und der Fähigkeit der Eviction-Strategie, relevante Einträge bis zur Wiederverwendung vorzuhalten; die Reliability-Grenze liegt darin, dass eine zu aggressive Eviction-Strategie proportional zur Speicherknappheit relevante, wiederverwendbare Cache-Einträge vorzeitig verdrängt und dadurch den erwarteten Prefix-Reuse-Vorteil zunichtemacht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| die Cache-Trefferrate ist trotz hoher erwarteter Prefix-Überlappung niedrig | die Eviction-Strategie verdrängt relevante Cache-Einträge zu früh aufgrund unzureichender Cachebelegung | die Cachebelegung erhöhen oder die Eviction-Strategie anpassen, um relevante Prefixe länger vorzuhalten |
| KV-cache-aware Routing bringt keinen messbaren Vorteil gegenüber Round-Robin-Verteilung | die tatsächliche Workload weist eine geringere Prefix-Überlappung auf als angenommen | die tatsächliche Prefix-Überlappung der Workload messen und die Routing-Strategie entsprechend neu bewerten |
| die VRAM-Auslastung ist unerwartet hoch und führt zu OOM-Fehlern | die Cachebelegung ist zu großzügig dimensioniert relativ zu anderen VRAM-Bedarfen (Modellgewichte, Aktivierungen) | die Cachebelegung gegen das VRAM-Gesamtbudget (siehe [KB-0415](03-vram-und-speicherbudgets.md)) neu dimensionieren |

Security: Bei speicherbewusstem Routing über mehrere Nutzer oder Mandanten hinweg sollte geprüft werden, dass Cache-Einträge nicht versehentlich mandantenübergreifend als wiederverwendbar behandelt werden, wenn dies aus Datenschutzgründen unzulässig ist. Observability: Die Cache-Trefferrate, die Eviction-Rate (wie oft relevante Einträge vor Wiederverwendung verdrängt werden), und die VRAM-Auslastung durch den Cache sind zentrale Metriken zur Bewertung des tatsächlichen Nutzens.

## Trade-offs und Entscheidungen

**Staff** misst die tatsächliche Cache-Trefferrate unter Round-Robin-Verteilung als Baseline, bevor KV-cache-aware Routing eingeführt wird. **Principal** macht die Abwägung zwischen Routing-Komplexität und gemessenem Trefferratengewinn für das Team nachvollziehbar. **Chief** entscheidet die Einführung speicherbewussten Routings im Unternehmen anhand gemessener Cache-Trefferraten und Durchsatzgewinne.

Anti-Patterns: KV-cache-aware Routing einführen, ohne vorher die tatsächliche Prefix-Überlappung der Workload und eine Round-Robin-Baseline zu messen; eine zu aggressive Eviction-Strategie konfigurieren, die relevante, wiederverwendbare Prefixe vorzeitig verdrängt; die Cachebelegung ohne Berücksichtigung anderer VRAM-Bedarfe (Modellgewichte, Aktivierungen) überdimensionieren.

## Production Checklist

- [ ] Die Cache-Trefferrate wurde unter Round-Robin-Verteilung als Baseline gemessen.
- [ ] Die Eviction-Strategie hält relevante, wahrscheinlich wiederverwendete Prefixe ausreichend lange vor.
- [ ] Die Cachebelegung ist gegen das VRAM-Gesamtbudget (Modellgewichte, Aktivierungen) sinnvoll dimensioniert.
- [ ] Cache-Trefferrate, Eviction-Rate und VRAM-Auslastung werden fortlaufend überwacht.

## Interviewfragen

### 1. Was speichert der KV-Cache, und warum wächst er mit der Sequenzlänge?

**Antwort:** Er speichert die während der Prefill- und Decode-Phase berechneten Aufmerksamkeitszustände; da für jeden zusätzlich verarbeiteten Token neue Zustände hinzukommen, wächst der Cache proportional zur bisherigen Sequenzlänge (Prompt plus generierte Tokens).

### 2. Was passiert bei Speicherdruck im KV-Cache, und wie wird entschieden, was verdrängt wird?

**Antwort:** Eine Eviction-Strategie verdrängt Cache-Einträge nach definierten Kriterien (z. B. abgeschlossene oder am längsten inaktive Anfragen), um Platz für neue Anfragen zu schaffen.

### 3. Wann bringt KV-cache-aware Routing einen Vorteil gegenüber einfacher Round-Robin-Verteilung?

**Antwort:** Wenn die Workload eine relevante Prefix-Überlappung aufweist und die Cache-Kapazität ausreicht, relevante Einträge bis zu ihrer Wiederverwendung vorzuhalten — bei geringer Überlappung oder häufiger Eviction bringt es keinen messbaren Vorteil.

### 4. Wie prüfst du, ob sich die Einführung von KV-cache-aware Routing lohnt?

**Antwort:** Ich messe zunächst die Cache-Trefferrate unter einfacher Round-Robin-Verteilung als Baseline und vergleiche sie anschließend mit der Trefferrate unter speicherbewusstem Routing.

### 5. Wie gehst du vor, wenn die Cache-Trefferrate trotz erwarteter Prefix-Überlappung niedrig ist?

**Antwort:** Ich prüfe, ob die Eviction-Strategie relevante Cache-Einträge aufgrund unzureichender Cachebelegung zu früh verdrängt, und passe die Cachebelegung oder die Eviction-Strategie entsprechend an.

### 6. Widersprüchliche Anforderung: Team will maximale Cache-Trefferrate UND maximale gleichzeitige Anfragekapazität — wie gehst du vor?

**Antwort:** Ich würde beide Anforderungen gegeneinander messen, da eine größere Cachebelegung die Trefferrate erhöht, aber gleichzeitig VRAM bindet, das sonst für mehr gleichzeitige Anfragen zur Verfügung stünde; die konkrete Balance würde ich anhand der tatsächlichen Prefix-Überlappung und der Zielkapazität der Workload festlegen.

## Praktische Labs

~~~python
# Conceptual eviction-strategy cache-hit-rate simulation (not executed against a real KV-cache system):

import random

def simulate_lru_eviction(requests, cache_capacity):
    cache = []  # list of prefix ids, most-recently-used at the end
    hits = 0
    for prefix_id in requests:
        if prefix_id in cache:
            hits += 1
            cache.remove(prefix_id)
        elif len(cache) >= cache_capacity:
            cache.pop(0)  # evict least-recently-used
        cache.append(prefix_id)
    return round(hits / len(requests), 2)

random.seed(42)
high_overlap_requests = [random.choice(["SYSTEM_A", "SYSTEM_B", "SYSTEM_C"]) for _ in range(100)]
low_overlap_requests = [f"unique_{i}" for i in range(100)]

print(f"High-overlap workload, small cache (capacity=2): hit rate = {simulate_lru_eviction(high_overlap_requests, cache_capacity=2)}")
print(f"Low-overlap workload, small cache (capacity=2): hit rate = {simulate_lru_eviction(low_overlap_requests, cache_capacity=2)}")
~~~

## Dependencies, Cross-References und Quellen

1. vLLM-Dokumentation: [Automatic Prefix Caching](https://docs.vllm.ai/en/latest/design/automatic_prefix_caching.html), abgerufen 2026-09-17.
2. SGLang-Dokumentation: [RadixAttention und Cache Management](https://sgl-project.github.io/), abgerufen 2026-09-17.

VRAM und Speicherbudgets sind kanonisch in [KB-0415](03-vram-und-speicherbudgets.md) behandelt; verteiltes Routing in [KB-0423](11-nvidia-dynamo.md), Disaggregation in [KB-0424](12-disaggregated-prefill-und-decode.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Hierarchisches KV-Cache-Offloading (Verdrängung in CPU-Speicher oder schnellen Massenspeicher statt vollständigem Verlust) | Evaluating | Gegenüber vollständiger Verdrängung erst nach Messung der tatsächlichen Latenzauswirkung des Offloading-Pfads bevorzugen. |
| Adaptive, lastabhängige Eviction-Strategien, die Verdrängungskriterien basierend auf beobachteter Wiederverwendungswahrscheinlichkeit anpassen | Evaluating | Gegenüber statischer LRU-Eviction erst nach Prüfung der tatsächlichen Vorhersagequalität für die konkrete Workload bevorzugen. |

Ein Team akzeptiert die Einführung von KV-cache-aware Routing erst, wenn eine gemessene Cache-Trefferrate gegenüber einer Round-Robin-Baseline einen relevanten, workloadspezifischen Vorteil nachweist.
