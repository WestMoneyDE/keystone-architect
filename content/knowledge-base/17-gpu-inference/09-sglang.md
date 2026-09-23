---
{"id": "KB-0421", "title": "SGLang", "domain": "17", "sequence": 9, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "MLOPS"], "requires": [{"id": "KB-0420", "concepts": ["VLLM, PagedAttention, KV-Cache"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein einfaches strukturiertes Generierungsprogramm mit SGLang anhand offizieller Dokumentation nachvollziehen und die Wirkung der Prefix-Wiederverwendung auf wiederholte Anfragen erklären können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Workloads identifizieren, bei denen SGLangs Prefix-Wiederverwendung (RadixAttention) einen empirisch nachweisbaren Vorteil gegenüber anderen Serving-Engines bietet, und diese gezielt einsetzen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Diskrepanz zwischen erwartetem und tatsächlichem Durchsatzgewinn durch Prefix-Wiederverwendung auf eine konkrete Workload-Eigenschaft (geringe Prefix-Überlappung) zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Die Wahl zwischen SGLang und alternativen Serving-Engines im Unternehmen anhand empirisch verifizierter, workloadspezifischer Kriterien statt pauschaler Präferenz entscheiden.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der RadixAttention-Baumstruktur im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Programmiermodell und Prefix-Wiederverwendung als Entscheidungsgrundlage, nicht die interne Baumstruktur-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0421-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal beschriebener SGLang-Workflow anhand offizieller Dokumentation, kein aktiver GPU-Cluster verwendet", "evidence": "Anhand der offiziellen SGLang-Dokumentation wird nachvollzogen, wie das strukturierte Programmiermodell komplexe Generierungsabläufe beschreibt, wie RadixAttention gemeinsame Prefixe zwischen Anfragen im KV-Cache wiederverwendet, und welche Kompatibilitätsgrenzen gegenüber anderen Serving-Engines bei bestimmten Modelltypen bestehen.", "limitations": "Keine reale Ausführung gegen einen produktiven SGLang-Server, keine realen GPU-Ressourcen genutzt, kein empirischer Vergleich mit anderen Engines gegen eine konkrete Workload durchgeführt."}]}
---
# SGLang

> **Ziel:** SGLang ist ein Serving-Framework für große Sprachmodelle mit einem eigenen strukturierten Programmiermodell zur Beschreibung komplexer Generierungsabläufe (z. B. mehrstufige Prompts, parallele Verzweigungen) und RadixAttention, einer Technik zur Prefix-Wiederverwendung im KV-Cache (siehe [KB-0420](08-vllm.md)), die gemeinsame Anfrageanfänge zwischen mehreren Requests erkennt und deren bereits berechnete Aufmerksamkeitszustände wiederverwendet, statt sie erneut zu berechnen. Der zentrale Punkt dieses Kapitels ist, dass der tatsächliche Durchsatzvorteil von RadixAttention stark von der Prefix-Überlappung der konkreten Workload abhängt — bei Anfragen mit hoher struktureller Ähnlichkeit (z. B. wiederholte System-Prompts, Few-Shot-Beispiele) kann der Vorteil erheblich sein, bei weitgehend unabhängigen Anfragen jedoch vernachlässigbar, was empirisch statt pauschal beurteilt werden muss.

## Zweck, Mental Model und Dependencies

Das Programmiermodell von SGLang erlaubt es, komplexe Generierungsabläufe (etwa: mehrere alternative Fortsetzungen parallel generieren und die beste auswählen, oder eine Sequenz von Zwischenschritten mit Zwischenverarbeitung) als strukturiertes Programm statt als Folge unabhängiger API-Aufrufe zu beschreiben, wodurch das Framework Optimierungsmöglichkeiten über den gesamten Ablauf hinweg erkennen kann, die bei isolierten Einzelaufrufen nicht sichtbar wären. RadixAttention organisiert den KV-Cache in einer Baumstruktur (Radix-Baum), in der gemeinsame Prefixe mehrerer Anfragen (z. B. derselbe System-Prompt am Anfang vieler unterschiedlicher Nutzeranfragen) als gemeinsamer Pfad im Baum gespeichert werden, sodass deren KV-Cache-Werte nur einmal berechnet und von allen Anfragen mit demselben Prefix wiederverwendet werden. Der zentrale methodische Punkt ist, dass diese Wiederverwendung nur dann einen relevanten Durchsatzvorteil erzeugt, wenn die tatsächliche Workload eine signifikante Prefix-Überlappung aufweist — dies muss anhand der konkreten Anfragemuster empirisch gemessen werden (z. B. durch Vergleich der Cache-Trefferrate), statt anzunehmen, dass RadixAttention pauschal für jede Workload einen Vorteil bringt.

~~~text
Programming model: structured generation flows (parallel branches, multi-step w/ intermediate processing)
  described as ONE program, not independent API calls
  -> framework sees optimization opportunities across the WHOLE flow (not visible in isolated calls)
RadixAttention: KV-cache organized as a RADIX TREE
  shared prefixes across requests (e.g. same system prompt) = shared tree path
  -> computed ONCE, reused by all requests sharing that prefix
KEY METHODOLOGICAL POINT: throughput benefit is WORKLOAD-DEPENDENT
  high prefix overlap (repeated system prompts, few-shot examples) -> significant benefit
  low prefix overlap (mostly independent requests) -> negligible benefit
  -> MUST measure empirically (e.g. cache hit rate) for the actual workload, never assume uniformly
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Strukturiertes Programmiermodell | beschreibt komplexe Generierungsabläufe als ein Programm | Optimierungspotenzial hängt von der tatsächlichen Ablaufkomplexität ab |
| RadixAttention | reduziert redundante KV-Cache-Berechnung bei gemeinsamen Prefixen | Vorteil hängt von der tatsächlichen Prefix-Überlappung der Workload ab |
| Servingpfade | unterschiedliche Bereitstellungsformen (lokal, verteilt) | Kompatibilität mit der Zielumgebung muss geprüft werden |
| Kompatibilitätsgrenzen | nicht jede Modellarchitektur wird gleichermaßen unterstützt | Unterstützung der konkreten Modellarchitektur muss anhand offizieller Dokumentation geprüft werden |

Implementierung: Vor dem Einsatz von SGLang wird die tatsächliche Prefix-Überlappung der Ziel-Workload analysiert (z. B. Anteil wiederkehrender System-Prompts oder Few-Shot-Präfixe an der Gesamtanfragemenge), um abzuschätzen, ob RadixAttention einen relevanten Durchsatzvorteil erwarten lässt. Bei komplexen Generierungsabläufen (parallele Verzweigungen, mehrstufige Prompts mit Zwischenverarbeitung) wird geprüft, ob das strukturierte Programmiermodell von SGLang den Ablauf gegenüber einer Implementierung mit unabhängigen API-Aufrufen tatsächlich vereinfacht oder beschleunigt. Vor einer produktiven Entscheidung zwischen SGLang und alternativen Serving-Engines (siehe [KB-0420](08-vllm.md)) wird ein empirischer Vergleich anhand der tatsächlichen Ziel-Workload durchgeführt, statt sich auf allgemeine, framework-übergreifende Benchmark-Aussagen zu verlassen.

## Scalability, Reliability, Security und Observability

SGLang skaliert den Durchsatz bei Workloads mit hoher Prefix-Überlappung proportional zur Größe der wiederverwendbaren, gemeinsamen Prefixe; die Reliability-Grenze liegt darin, dass eine pauschale, ungeprüfte Annahme eines Durchsatzvorteils proportional zur tatsächlich geringen Prefix-Überlappung der Workload zu enttäuschenden, nicht eintretenden Verbesserungen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| der erwartete Durchsatzgewinn durch RadixAttention bleibt aus | die tatsächliche Workload weist eine geringe Prefix-Überlappung auf | die Cache-Trefferrate für die konkrete Workload messen und mit der Erwartung vergleichen |
| eine bestimmte Modellarchitektur wird von SGLang nicht unterstützt | die eingesetzte SGLang-Version unterstützt diese Architektur noch nicht | die offizielle Dokumentation/Release Notes auf Unterstützung der spezifischen Architektur prüfen |
| ein komplexer Generierungsablauf verhält sich unerwartet | das strukturierte Programmiermodell wurde nicht korrekt für den gewünschten Ablauf (z. B. parallele Verzweigung) konfiguriert | den SGLang-Programmcode Schritt für Schritt gegen die beabsichtigte Ablauflogik prüfen |

Security: Bei gemeinsam genutzten Prefixen im KV-Cache über mehrere Anfragen (möglicherweise unterschiedlicher Nutzer) hinweg sollte geprüft werden, dass keine sensiblen, nutzerspezifischen Daten versehentlich in einem als gemeinsam behandelten Prefix landen. Observability: Die Cache-Trefferrate von RadixAttention, der tatsächliche Durchsatz, und die Latenzverteilung pro Anfragetyp sind zentrale SGLang-Metriken zur Bewertung des tatsächlichen Nutzens.

## Trade-offs und Entscheidungen

**Staff** misst die tatsächliche Prefix-Überlappung und Cache-Trefferrate der eigenen Workload, statt den Durchsatzvorteil von RadixAttention pauschal anzunehmen. **Principal** macht die empirische Entscheidungsgrundlage (gemessene Trefferrate versus Annahme) für das Team nachvollziehbar. **Chief** entscheidet die Wahl zwischen SGLang und alternativen Serving-Engines im Unternehmen anhand empirisch verifizierter, workloadspezifischer Kriterien.

Anti-Patterns: SGLang für eine Workload mit geringer Prefix-Überlappung einsetzen, ohne den erwarteten Durchsatzvorteil vorab empirisch zu prüfen; eine Modellarchitektur ohne Prüfung der offiziellen Dokumentation auf SGLang-Kompatibilität produktiv einsetzen; sensible, nutzerspezifische Daten unreflektiert in einen als gemeinsam behandelten Prefix einbetten.

## Production Checklist

- [ ] Die Prefix-Überlappung der Ziel-Workload wurde vor dem Einsatz von SGLang empirisch abgeschätzt.
- [ ] Die eingesetzte Modellarchitektur wird laut offizieller Dokumentation von SGLang unterstützt.
- [ ] Ein empirischer Vergleich mit alternativen Serving-Engines liegt für die konkrete Ziel-Workload vor.
- [ ] Cache-Trefferrate und Durchsatz werden fortlaufend überwacht.

## Interviewfragen

### 1. Was ist RadixAttention, und welches Problem löst es?

**Antwort:** Eine Technik, die den KV-Cache in einer Baumstruktur organisiert und gemeinsame Prefixe mehrerer Anfragen wiederverwendet, statt deren Aufmerksamkeitszustände redundant erneut zu berechnen.

### 2. Wovon hängt der tatsächliche Durchsatzvorteil von RadixAttention ab?

**Antwort:** Von der tatsächlichen Prefix-Überlappung der Workload — bei hoher struktureller Ähnlichkeit der Anfragen (z. B. wiederholte System-Prompts) ist der Vorteil erheblich, bei weitgehend unabhängigen Anfragen vernachlässigbar.

### 3. Was ermöglicht das strukturierte Programmiermodell von SGLang?

**Antwort:** Komplexe Generierungsabläufe (parallele Verzweigungen, mehrstufige Prompts mit Zwischenverarbeitung) als ein zusammenhängendes Programm statt als Folge unabhängiger API-Aufrufe zu beschreiben, wodurch übergreifende Optimierungen möglich werden.

### 4. Wie prüfst du, ob SGLang für eine konkrete Workload einen Vorteil bringt?

**Antwort:** Ich analysiere die tatsächliche Prefix-Überlappung der Anfragen und messe die Cache-Trefferrate empirisch, statt einen pauschalen Vorteil anzunehmen.

### 5. Wie gehst du vor, wenn der erwartete Durchsatzgewinn durch RadixAttention ausbleibt?

**Antwort:** Ich prüfe, ob die tatsächliche Workload eine geringere Prefix-Überlappung als angenommen aufweist, und messe die Cache-Trefferrate, um die Ursache zu bestätigen.

### 6. Widersprüchliche Anforderung: Team will SGLang unternehmensweit als Standard einführen, weil ein Benchmark hohe Gewinne zeigt — wie gehst du vor?

**Antwort:** Ich würde vor einer unternehmensweiten Einführung die Prefix-Überlappung repräsentativer, unterschiedlicher Workloads im Unternehmen messen, da der Benchmark-Vorteil stark workloadabhängig ist und nicht pauschal auf alle Anwendungsfälle übertragen werden darf.

## Praktische Labs

~~~python
# Conceptual prefix-overlap cache-hit-rate estimation (not executed against a real SGLang server):

def estimate_cache_hit_rate(requests):
    """requests: list of (prefix, suffix) tuples representing shared vs unique parts of each request."""
    prefix_counts = {}
    for prefix, _ in requests:
        prefix_counts[prefix] = prefix_counts.get(prefix, 0) + 1

    total = len(requests)
    reused = sum(count - 1 for count in prefix_counts.values() if count > 1)
    hit_rate = reused / total if total else 0
    return round(hit_rate, 2)

high_overlap_workload = [("SYSTEM_PROMPT_A", f"user question {i}") for i in range(20)]
low_overlap_workload = [(f"unique_prefix_{i}", f"user question {i}") for i in range(20)]

print(f"High-overlap workload cache hit rate: {estimate_cache_hit_rate(high_overlap_workload)}")
print(f"Low-overlap workload cache hit rate: {estimate_cache_hit_rate(low_overlap_workload)}")
~~~

## Dependencies, Cross-References und Quellen

1. SGLang-Dokumentation: [SGLang — Backend: RadixAttention](https://sgl-project.github.io/), abgerufen 2026-09-17.
2. SGLang-GitHub-Repository: [sgl-project/sglang — README und Dokumentation](https://github.com/sgl-project/sglang), abgerufen 2026-09-17.

vLLM und PagedAttention sind kanonisch in [KB-0420](08-vllm.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte strukturierte Constrained-Decoding-Unterstützung innerhalb von SGLang (z. B. für garantiert valides JSON) | Evaluating | Gegenüber nachgelagerter Validierung erst nach eigenem Test der tatsächlichen Zuverlässigkeit und Latenzauswirkung bevorzugen. |
| Speculative Decoding in Kombination mit RadixAttention zur weiteren Latenzreduktion | Evaluating | Gegenüber Standard-Decoding erst nach eigenem Lasttest zur Verifikation des kombinierten Effekts bevorzugen. |

Ein Team akzeptiert die Einführung von SGLang erst, wenn eine empirisch gemessene Cache-Trefferrate für die tatsächliche Ziel-Workload einen relevanten Vorteil gegenüber der bisherigen Serving-Lösung nachweist.
