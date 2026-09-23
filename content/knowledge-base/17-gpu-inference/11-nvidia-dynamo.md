---
{"id": "KB-0423", "title": "NVIDIA Dynamo", "domain": "17", "sequence": 11, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "MLOPS"], "requires": [{"id": "KB-0420", "concepts": ["VLLM, KV-Cache"], "needed_for": "understanding"}, {"id": "KB-0421", "concepts": ["SGLang, RadixAttention"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Die Rolle von Router und verteilten Serving-Komponenten in einer NVIDIA-Dynamo-Architektur anhand offizieller Architekturunterlagen nachvollziehen und erklären können, welches Problem verteiltes Inferenz-Serving gegenüber einer Einzelinstanz löst.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Bewerten, wann ein verteiltes Serving-System wie NVIDIA Dynamo gegenüber einer einzelnen Inferenz-Engine (z. B. vLLM, SGLang) für einen konkreten Skalierungsbedarf angemessen ist.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Latenz- oder Verfügbarkeitsproblematik in einem verteilten Serving-Setup auf eine konkrete Ursache im Routing oder in der Datenbewegung zwischen Komponenten zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Den Einsatz eines verteilten Serving-Systems im Unternehmen anhand des tatsächlichen Skalierungsbedarfs statt anhand der Neuheit der Technologie entscheiden.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der Router- und Datenbewegungskomponenten im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der Architekturrollen und des Zusammenspiels mit bestehenden Engines, nicht die Interna der Komponenten."}}, "lab_validation": [{"lab_id": "KB-0423-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Konzeptuelle Einordnung anhand aktueller offizieller Architekturunterlagen, kein aktives Deployment verwendet", "evidence": "Anhand der offiziellen NVIDIA-Dynamo-Architekturunterlagen wird nachvollzogen, welche Rolle Router-Komponenten beim Verteilen von Anfragen über mehrere Serving-Instanzen einnehmen und wie das System mit bestehenden Inferenz-Engines (z. B. vLLM, SGLang) zusammenspielt.", "limitations": "Kein reales Deployment getestet, keine Latenz- oder Durchsatzmessungen erhoben. NVIDIA Dynamo ist ein sich schnell weiterentwickelndes Projekt; Architekturdetails sollten vor produktivem Einsatz stets gegen die zum Einsatzzeitpunkt aktuelle offizielle Dokumentation geprüft werden, da sich Komponentenbezeichnungen und Funktionsumfang ändern können."}]}
---
# NVIDIA Dynamo

> **Ziel:** NVIDIA Dynamo ist ein Framework für verteiltes Inferenz-Serving, das mehrere Instanzen einer oder mehrerer Inferenz-Engines (z. B. vLLM, siehe [KB-0420](08-vllm.md), oder SGLang, siehe [KB-0421](09-sglang.md)) über Router-Komponenten koordiniert, die eingehende Anfragen basierend auf Kapazität, Auslastung oder Cache-Zustand der einzelnen Instanzen verteilen. Der zentrale Punkt dieses Kapitels ist, dass verteiltes Serving ein zusätzliches Problem löst, das eine einzelne Engine-Instanz nicht adressiert — horizontale Skalierung über mehrere GPUs oder Knoten hinweg mit koordinierter Anfrageverteilung — dieses Problem jedoch nur dann relevant ist, wenn der tatsächliche Lastbedarf die Kapazität einer Einzelinstanz übersteigt; für kleinere, stabile Workloads ist die zusätzliche Architekturkomplexität eines verteilten Systems oft nicht gerechtfertigt.

## Zweck, Mental Model und Dependencies

Eine einzelne Inferenz-Engine-Instanz (vLLM, SGLang, TensorRT-LLM) ist durch die Kapazität einer oder weniger GPUs begrenzt; sobald der Lastbedarf diese Kapazität übersteigt, wird eine Koordination mehrerer Instanzen notwendig. NVIDIA Dynamo adressiert dieses Problem durch Router-Komponenten, die eingehende Anfragen intelligent auf mehrere Serving-Instanzen verteilen — dabei können Faktoren wie die aktuelle Auslastung, der Cache-Zustand einer Instanz (z. B. ob eine Instanz bereits einen relevanten Prefix im KV-Cache vorhält, siehe RadixAttention/PagedAttention-Konzepte) oder die Lokalität von Daten berücksichtigt werden, um die Datenbewegung zwischen Komponenten zu minimieren. Der zentrale methodische Punkt ist, dass die Einführung eines verteilten Serving-Systems selbst Komplexität hinzufügt (zusätzliche Netzwerkkommunikation, Routing-Logik, potenzielle neue Fehlerquellen), die nur dann gerechtfertigt ist, wenn der tatsächliche Skalierungsbedarf dies erfordert — eine vorschnelle Einführung verteilter Architektur für einen Lastbedarf, der von einer Einzelinstanz bedient werden könnte, erzeugt unnötigen Betriebsaufwand.

~~~text
Single engine instance (vLLM/SGLang/TensorRT-LLM): capacity-limited by ONE or FEW GPUs
Load exceeds single-instance capacity -> coordination across MULTIPLE instances needed
NVIDIA Dynamo: Router component(s) distribute incoming requests across serving instances
  considers: current load, per-instance cache state (KV-cache/prefix locality), data locality
  -> minimizes unnecessary data movement between components
KEY METHODOLOGICAL POINT: distributed serving itself ADDS complexity
  (network comms, routing logic, new failure modes)
  -> only justified when ACTUAL scaling need exceeds single-instance capacity
  -> premature adoption for load a single instance could handle = unnecessary operational overhead
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Router-Komponenten | verteilen Anfragen über mehrere Serving-Instanzen | Verteilungsstrategie (last-, cache- oder datenlokalitätsbasiert) muss zur konkreten Workload passen |
| Zusammenspiel mit Engines | koordiniert bestehende Inferenz-Engines statt sie zu ersetzen | Kompatibilität mit der konkret eingesetzten Engine muss anhand aktueller Dokumentation geprüft werden |
| Datenbewegung | minimiert unnötige Übertragung von Zustand (z. B. KV-Cache) zwischen Instanzen | tatsächlicher Effekt hängt von der Cache-Lokalitätsstrategie und der Workload ab |
| Skalierungsbedarf | Rechtfertigung für die zusätzliche Systemkomplexität | muss anhand des tatsächlichen Lastbedarfs geprüft werden, nicht pauschal angenommen werden |

Implementierung: Vor der Einführung von NVIDIA Dynamo wird geprüft, ob der tatsächliche Lastbedarf die Kapazität einer einzelnen Serving-Instanz (oder eines einfachen, statischen Lastverteilers ohne Cache-Bewusstsein) tatsächlich übersteigt, da die zusätzliche Router- und Koordinationskomplexität nur bei echtem Skalierungsbedarf gerechtfertigt ist. Die Router-Konfiguration wird basierend auf der tatsächlichen Workload-Charakteristik gewählt — bei hoher Prefix-Überlappung zwischen Anfragen (siehe RadixAttention, [KB-0421](09-sglang.md)) ist eine cache-bewusste Routing-Strategie relevanter als bei weitgehend unabhängigen Anfragen. Da sich NVIDIA Dynamo als Projekt schnell weiterentwickelt, wird die Kompatibilität mit der konkret eingesetzten Engine-Version vor jedem produktiven Einsatz gegen die zum Zeitpunkt aktuelle offizielle Dokumentation geprüft, statt sich auf möglicherweise veraltete Informationen zu verlassen.

## Scalability, Reliability, Security und Observability

NVIDIA Dynamo skaliert die effektive Serving-Kapazität proportional zur Anzahl koordinierter Instanzen und zur Qualität der Routing-Strategie; die Reliability-Grenze liegt darin, dass eine vorschnell eingeführte verteilte Architektur proportional zu ihrer zusätzlichen Komplexität neue Fehlerquellen (Netzwerkausfälle, Routing-Fehlkonfiguration) einführt, die bei einer ausreichenden Einzelinstanz nicht existieren würden.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Anfragen werden trotz freier Kapazität an anderen Instanzen ungleichmäßig verteilt | die Routing-Strategie berücksichtigt die tatsächliche Instanzauslastung nicht korrekt | die Router-Konfiguration und die zugrunde liegenden Lastmetriken prüfen |
| erwarteter Cache-Wiederverwendungsvorteil bleibt trotz Router-Einsatz aus | die Routing-Strategie ist nicht cache-bewusst konfiguriert oder die Workload weist geringe Prefix-Überlappung auf | die Cache-Trefferrate pro Instanz messen und die Routing-Strategie entsprechend anpassen |
| das verteilte Setup ist komplexer und störanfälliger als die vorherige Einzelinstanz, ohne klaren Kapazitätsgewinn | der tatsächliche Lastbedarf hätte auch mit einer Einzelinstanz bedient werden können | den tatsächlichen Skalierungsbedarf neu bewerten und gegebenenfalls zu einer einfacheren Architektur zurückkehren |

Security: Die zusätzliche Netzwerkkommunikation zwischen Router und Serving-Instanzen sollte mit denselben Zugriffskontroll- und Verschlüsselungsmaßnahmen wie andere interne Serviceverbindungen abgesichert werden. Observability: Die Lastverteilung über die einzelnen Instanzen, die Cache-Trefferrate pro Instanz, und die End-to-End-Latenz inklusive Routing-Overhead sind zentrale Metriken zur Bewertung des tatsächlichen Nutzens eines verteilten Serving-Setups.

## Trade-offs und Entscheidungen

**Staff** prüft den tatsächlichen Skalierungsbedarf, bevor ein verteiltes Serving-System wie NVIDIA Dynamo eingeführt wird, statt es vorschnell für jeden Anwendungsfall einzusetzen. **Principal** macht die Abwägung zwischen Skalierungsbedarf und zusätzlicher Architekturkomplexität für das Team nachvollziehbar. **Chief** entscheidet den Einsatz verteilter Serving-Systeme im Unternehmen anhand des tatsächlichen, gemessenen Lastbedarfs statt anhand der Neuheit oder Popularität der Technologie.

Anti-Patterns: ein verteiltes Serving-System für einen Lastbedarf einführen, der von einer Einzelinstanz bedient werden könnte; die Routing-Strategie ohne Berücksichtigung der tatsächlichen Cache-Lokalität oder Workload-Charakteristik konfigurieren; Architekturannahmen über ein sich schnell weiterentwickelndes Projekt ungeprüft aus veralteten Quellen übernehmen, statt die aktuelle offizielle Dokumentation zu konsultieren.

## Production Checklist

- [ ] Der tatsächliche Lastbedarf übersteigt nachweislich die Kapazität einer einzelnen Serving-Instanz.
- [ ] Die Routing-Strategie ist an die tatsächliche Workload-Charakteristik (Cache-Lokalität, Lastverteilung) angepasst.
- [ ] Die Kompatibilität mit der eingesetzten Engine-Version ist gegen die aktuelle offizielle Dokumentation geprüft.
- [ ] Lastverteilung, Cache-Trefferrate und End-to-End-Latenz werden fortlaufend überwacht.

## Interviewfragen

### 1. Welches Problem löst NVIDIA Dynamo gegenüber einer einzelnen Inferenz-Engine-Instanz?

**Antwort:** Es koordiniert mehrere Serving-Instanzen über Router-Komponenten, um horizontale Skalierung über die Kapazitätsgrenze einer einzelnen Instanz hinaus zu ermöglichen.

### 2. Welche Faktoren kann eine Router-Komponente bei der Anfrageverteilung berücksichtigen?

**Antwort:** Die aktuelle Auslastung der Instanzen, den Cache-Zustand (z. B. ob eine Instanz bereits relevante KV-Cache-Daten vorhält) und die Datenlokalität.

### 3. Warum ist verteiltes Serving nicht für jeden Anwendungsfall gerechtfertigt?

**Antwort:** Weil es zusätzliche Komplexität (Netzwerkkommunikation, Routing-Logik, neue Fehlerquellen) einführt, die nur bei einem tatsächlichen Skalierungsbedarf über eine Einzelinstanz hinaus gerechtfertigt ist.

### 4. Wie prüfst du, ob ein Einsatz von NVIDIA Dynamo für einen Anwendungsfall sinnvoll ist?

**Antwort:** Ich prüfe, ob der tatsächliche Lastbedarf die Kapazität einer einzelnen Serving-Instanz übersteigt, und wäge den Kapazitätsgewinn gegen die zusätzliche Architekturkomplexität ab.

### 5. Wie gehst du vor, wenn ein verteiltes Setup komplexer und störanfälliger ist als die vorherige Lösung, ohne klaren Nutzen?

**Antwort:** Ich bewerte den tatsächlichen Skalierungsbedarf neu und ziehe gegebenenfalls eine Rückkehr zu einer einfacheren, weniger komplexen Architektur in Betracht, wenn der Kapazitätsgewinn den zusätzlichen Betriebsaufwand nicht rechtfertigt.

### 6. Widersprüchliche Anforderung: Team will sofort auf ein verteiltes Serving-System umstellen, weil es "moderner" wirkt, obwohl die aktuelle Last stabil und gering ist — wie gehst du vor?

**Antwort:** Ich würde den tatsächlichen, gemessenen Lastbedarf gegen die Kapazität der bestehenden Einzelinstanz stellen und empfehlen, bei ausreichender Kapazität auf die zusätzliche Architekturkomplexität zu verzichten, bis ein echter Skalierungsbedarf nachweisbar ist.

## Praktische Labs

~~~python
# Conceptual scaling-need justification check (not executed against a real Dynamo deployment):

def justify_distributed_serving(current_load_rps, single_instance_capacity_rps, routing_overhead_ms):
    scaling_needed = current_load_rps > single_instance_capacity_rps
    overhead_acceptable = routing_overhead_ms < 20  # example threshold
    recommendation = "distributed serving (e.g. NVIDIA Dynamo)" if scaling_needed and overhead_acceptable else "single instance sufficient"
    return {
        "scaling_needed": scaling_needed,
        "routing_overhead_acceptable": overhead_acceptable,
        "recommendation": recommendation,
    }

low_load_case = justify_distributed_serving(current_load_rps=50, single_instance_capacity_rps=200, routing_overhead_ms=8)
high_load_case = justify_distributed_serving(current_load_rps=350, single_instance_capacity_rps=200, routing_overhead_ms=8)

print(low_load_case)
print(high_load_case)
~~~

## Dependencies, Cross-References und Quellen

1. NVIDIA-Dokumentation: [NVIDIA Dynamo — Architecture Overview](https://docs.nvidia.com/dynamo/latest/), abgerufen 2026-09-17.
2. NVIDIA-GitHub-Repository: [ai-dynamo/dynamo — README und Architekturunterlagen](https://github.com/ai-dynamo/dynamo), abgerufen 2026-09-17.

vLLM ist kanonisch in [KB-0420](08-vllm.md) behandelt, SGLang und RadixAttention in [KB-0421](09-sglang.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Disaggregiertes Prefill/Decode-Serving zur getrennten Skalierung von Prompt-Verarbeitung und Token-Generierung | Evaluating | Gegenüber gemeinsamer Prefill/Decode-Verarbeitung erst nach Prüfung der tatsächlichen Lastcharakteristik und Kosten bevorzugen. |
| Cache-bewusstes, KV-Cache-lokalitätsoptimiertes Routing über mehrere Knoten hinweg | Evaluating | Gegenüber last-basiertem Routing erst nach Messung der tatsächlichen Cache-Trefferrate für die konkrete Workload bevorzugen. |

Ein Team akzeptiert die Einführung eines verteilten Serving-Systems wie NVIDIA Dynamo erst, wenn ein gemessener, tatsächlicher Lastbedarf die Kapazität einer einzelnen Serving-Instanz nachweislich übersteigt.
