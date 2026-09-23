---
{"id": "KB-0360", "title": "Langfuse-Instrumentierung", "domain": "15", "sequence": 10, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0272", "concepts": ["Beobachtbarkeit von AI-Anwendungen"], "needed_for": "understanding"}], "related": ["KB-0302"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine LLM-Anwendung mit Langfuse instrumentieren, Spans und Generations protokollieren und einen Score für die Ausgabequalität hinterlegen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Instrumentierungsstrategie gestalten, die Kontext (Trace-ID) über verschachtelte Spans hinweg weitergibt und sensible Payload-Inhalte gezielt von der Protokollierung ausschließt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Anhand von Langfuse-Kostenmessung pro Trace identifizieren, welcher Teil eines mehrstufigen LLM-Aufrufs die Kosten dominiert, und daraus eine Optimierungsempfehlung ableiten.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Vollständige Instrumentierung mit expliziter Sensitivitätsprüfung von Payloads als Standard für jede produktive GenAI-Anwendung im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Der Betrieb einer selbst gehosteten Langfuse-Infrastruktur im großen Maßstab ist Vertiefung.", "rationale": "Kern ist das Verständnis von Spans, Generations, Scores und Kontextweitergabe, nicht der Betrieb einer spezifischen Serverinstallation."}}, "lab_validation": [{"lab_id": "KB-0360-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simulierte Langfuse-Instrumentierung eines mehrstufigen LLM-Aufrufs mit verschachtelten Spans", "evidence": "Eine simulierte Instrumentierung protokolliert einen übergeordneten Trace mit mehreren verschachtelten Spans (Retrieval, Generation) und zugehörigen Kostenwerten pro Span; die Aggregation der Kosten über alle Spans eines Traces zeigt, welcher Teilschritt die Gesamtkosten dominiert, während als sensibel markierte Payload-Felder gezielt aus der protokollierten Ausgabe entfernt werden.", "limitations": "Kein produktiver Langfuse-Server, kein realer Geschäftsdatensatz, lokal simulierte Instrumentierung."}]}
---
# Langfuse-Instrumentierung

> **Ziel:** Langfuse ist ein Observability-Werkzeug speziell für LLM-Anwendungen, das über Spans (einzelne, potenziell verschachtelte Verarbeitungsschritte innerhalb eines Traces), Generations (spezialisierte Spans für LLM-Aufrufe mit Prompt, Antwort, Token- und Kostenangaben) und Scores (Bewertungen der Ausgabequalität, manuell oder automatisiert) eine detaillierte Sicht auf das Verhalten von GenAI-Anwendungen bietet, aufbauend auf den allgemeinen Beobachtbarkeitsgrundlagen (siehe [KB-0272](../11-genai-architecture/32-beobachtbarkeit-von-ai-anwendungen.md)). Dieser Artikel behandelt Langfuse als kanonischen Technikartikel mit besonderem Fokus auf drei praktische Kontrollpunkte: den Umgang mit sensiblen Payload-Inhalten, korrekte Kontextweitergabe über verschachtelte Spans hinweg und Kostenmessung pro Trace.

## Zweck, Mental Model und Dependencies

Ein Trace repräsentiert eine vollständige Anfrage durch ein System (z. B. eine Nutzeranfrage an eine RAG-Anwendung); innerhalb eines Traces bilden Spans die einzelnen Verarbeitungsschritte ab (z. B. Retrieval, Prompt-Zusammenstellung, LLM-Aufruf, Nachverarbeitung) und können verschachtelt sein, um Teilschritte innerhalb eines größeren Schritts abzubilden. Eine Generation ist ein spezialisierter Span-Typ, der speziell für LLM-Aufrufe zusätzliche Felder erfasst: den verwendeten Prompt, die erhaltene Antwort, verbrauchte Input-/Output-Tokens und die daraus resultierenden Kosten. Ein Score bewertet die Qualität einer Ausgabe (z. B. eines Traces oder einer Generation), entweder manuell durch menschliche Bewertung oder automatisiert durch ein Bewertungsmodell, und ermöglicht damit die systematische Verfolgung von Qualität über die Zeit. Der zentrale praktische Kontrollpunkt ist die Kontextweitergabe: damit verschachtelte Spans korrekt demselben übergeordneten Trace zugeordnet werden, muss die Trace-ID (und gegebenenfalls die übergeordnete Span-ID) explizit von einem Verarbeitungsschritt zum nächsten weitergegeben werden — fehlt diese Weitergabe, erscheinen zusammengehörige Schritte fälschlich als unabhängige, nicht miteinander verknüpfte Traces, was sowohl die Fehlersuche als auch eine korrekte Kostenaggregation pro tatsächlicher Nutzeranfrage verhindert.

~~~text
Trace: one full request through the system (e.g. one user query to a RAG app)
Span: individual processing step within a trace, can be NESTED (retrieval -> prompt assembly -> LLM call -> post-processing)
Generation: specialized span type for LLM calls -> captures prompt, response, input/output tokens, resulting cost
Score: quality rating (manual or automated) attached to a trace/generation -> enables tracking quality over time
CRITICAL CONTROL POINT: context propagation
  trace ID (+ parent span ID) must be explicitly passed from one processing step to the next
  MISSING propagation -> related steps wrongly appear as INDEPENDENT, unlinked traces
  -> breaks both debugging AND correct cost aggregation per actual user request
~~~

## Core Concepts, Architektur und Implementierung

| Element | Erfasst | Praktischer Kontrollpunkt |
|---|---|---|
| Trace | eine vollständige Anfrage durch das System | muss über alle beteiligten Verarbeitungsschritte hinweg dieselbe Trace-ID tragen |
| Span/Generation | einen einzelnen (potenziell verschachtelten) Verarbeitungsschritt | Payload-Felder (Prompt-/Antwortinhalt) müssen auf Sensitivität geprüft werden, bevor sie protokolliert werden |
| Score | eine Qualitätsbewertung einer Ausgabe | sollte konsistent an denselben Trace/dieselbe Generation angehängt werden, die bewertet wurde |
| Kosten (in Generations) | Token- und Kostenangaben pro LLM-Aufruf | aggregierbar pro Trace, um kostendominante Teilschritte zu identifizieren |

Implementierung: Jeder Einstiegspunkt einer Nutzeranfrage erzeugt einen neuen Trace mit eindeutiger Trace-ID; diese ID wird explizit an jeden nachgelagerten Verarbeitungsschritt (Retrieval, Prompt-Zusammenstellung, LLM-Aufruf) weitergegeben, sodass alle zugehörigen Spans demselben Trace zugeordnet bleiben. Vor der Protokollierung eines Spans oder einer Generation wird geprüft, ob der Prompt- oder Antwortinhalt sensible Daten enthält; sensible Felder werden gezielt maskiert oder aus der protokollierten Payload entfernt, statt sie standardmäßig vollständig zu speichern. Kosten werden pro Generation erfasst und über alle Spans eines Traces aggregiert, um zu identifizieren, welcher Teilschritt (z. B. ein besonders langer Kontext bei der Generation) die Gesamtkosten einer Anfrage dominiert.

## Scalability, Reliability, Security und Observability

Langfuse-Instrumentierung skaliert die Nachvollziehbarkeit von GenAI-Anwendungsverhalten proportional zur Vollständigkeit der Kontextweitergabe über Spans hinweg; die Reliability-Grenze liegt darin, dass fehlende Kontextweitergabe proportional zur Anzahl der Verarbeitungsschritte die Fehlersuche und Kostenzuordnung erschwert.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| zusammengehörige Verarbeitungsschritte einer einzelnen Nutzeranfrage erscheinen als mehrere unabhängige Traces | die Trace-ID wurde nicht korrekt von einem Verarbeitungsschritt zum nächsten weitergegeben | den Instrumentierungscode prüfen und sicherstellen, dass die Trace-ID explizit an jeden nachgelagerten Schritt übergeben wird |
| sensible Nutzerdaten erscheinen unerwartet in den protokollierten Langfuse-Payloads | keine explizite Sensitivitätsprüfung und Maskierung vor der Protokollierung wurde durchgeführt | den Instrumentierungscode um eine Prüfung und Maskierung sensibler Felder vor jedem Logging-Aufruf ergänzen |
| die Gesamtkosten einer Anfrage lassen sich nicht auf einen dominanten Teilschritt zurückführen | Kosten wurden nicht konsistent pro Generation erfasst oder nicht korrekt zu einem gemeinsamen Trace aggregiert | die Kostenerfassung pro Generation und die Trace-Zuordnung aller beteiligten Generations prüfen |

Security: Die explizite Prüfung und Maskierung sensibler Payload-Inhalte vor der Protokollierung ist der zentrale Sicherheitskontrollpunkt bei Langfuse-Instrumentierung, da Prompts und Antworten häufig personenbezogene oder vertrauliche Informationen enthalten können. Observability: Vollständigkeit der Trace-Verkettung (Anteil der Spans mit korrekt zugeordneter Trace-ID), aggregierte Kosten pro Trace und die Verteilung der Scores über die Zeit sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert korrekte Trace-ID-Weitergabe über alle Verarbeitungsschritte und explizite Sensitivitätsprüfung vor jeder Protokollierung. **Principal** macht Kostenaggregation pro Trace und erkannte sensible Felder für das Team nachvollziehbar. **Chief** etabliert vollständige Instrumentierung mit expliziter Sensitivitätsprüfung als Standard für jede produktive GenAI-Anwendung im Unternehmen.

Anti-Patterns: Prompt- und Antwortinhalte ohne Sensitivitätsprüfung standardmäßig vollständig protokollieren; Verarbeitungsschritte ohne explizite Trace-ID-Weitergabe instrumentieren, wodurch zusammengehörige Schritte fälschlich als unabhängig erscheinen; Kosten nur grob auf Anwendungsebene statt pro Trace und Teilschritt erfassen.

## Production Checklist

- [ ] Jeder Verarbeitungsschritt einer Nutzeranfrage erhält dieselbe Trace-ID wie die übrigen zugehörigen Schritte.
- [ ] Sensible Payload-Inhalte werden vor der Protokollierung explizit geprüft und bei Bedarf maskiert.
- [ ] Kosten werden pro Generation erfasst und pro Trace aggregierbar gemacht.
- [ ] Scores werden konsistent an den tatsächlich bewerteten Trace bzw. die bewertete Generation angehängt.

## Interviewfragen

### 1. Was ist der Unterschied zwischen einem Trace, einem Span und einer Generation in Langfuse?

**Antwort:** Ein Trace ist eine vollständige Anfrage durch das System; ein Span ist ein einzelner, potenziell verschachtelter Verarbeitungsschritt innerhalb eines Traces; eine Generation ist ein spezialisierter Span-Typ für LLM-Aufrufe mit zusätzlichen Prompt-, Antwort-, Token- und Kostenangaben.

### 2. Warum ist Kontextweitergabe der zentrale praktische Kontrollpunkt bei Langfuse-Instrumentierung?

**Antwort:** Ohne explizite Weitergabe der Trace-ID zwischen Verarbeitungsschritten erscheinen zusammengehörige Schritte fälschlich als unabhängige Traces, was Fehlersuche und korrekte Kostenaggregation verhindert.

### 3. Wie gehst du mit sensiblen Inhalten in Prompts oder Antworten bei der Instrumentierung um?

**Antwort:** Ich prüfe Payload-Inhalte vor der Protokollierung explizit auf Sensitivität und maskiere oder entferne sensible Felder gezielt, statt sie standardmäßig vollständig zu protokollieren.

### 4. Wie identifizierst du anhand von Langfuse-Daten den kostendominanten Teilschritt eines mehrstufigen LLM-Aufrufs?

**Antwort:** Ich aggregiere die pro Generation erfassten Kosten über alle Spans eines Traces und vergleiche die Beiträge der einzelnen Teilschritte, um den größten Kostentreiber zu identifizieren.

### 5. Wie diagnostizierst du, dass zusammengehörige Verarbeitungsschritte als mehrere unabhängige Traces erscheinen?

**Antwort:** Ich prüfe den Instrumentierungscode auf korrekte, explizite Weitergabe der Trace-ID an jeden nachgelagerten Verarbeitungsschritt und korrigiere fehlende Weitergabestellen.

### 6. Widersprüchliche Anforderung: Team will vollständige Observability jeder LLM-Interaktion UND garantiert keine sensiblen Nutzerdaten in Logs — wie gehst du vor?

**Antwort:** Ich würde eine automatisierte Sensitivitätsprüfung als festen Bestandteil jedes Logging-Aufrufs etablieren, die sensible Felder maskiert oder entfernt, bevor sie protokolliert werden, sodass strukturelle Observability (Spans, Kosten, Latenzen) vollständig erhalten bleibt, während sensible Inhalte selbst nie in den Logs landen.

## Praktische Labs

~~~python
import time
import uuid

class SimpleLangfuseSim:
    def __init__(self):
        self.traces = {}

    def start_trace(self):
        trace_id = str(uuid.uuid4())
        self.traces[trace_id] = {"spans": []}
        return trace_id

    def log_generation(self, trace_id, name, prompt, response, cost, sensitive_fields=None):
        sensitive_fields = sensitive_fields or []
        safe_prompt = "[REDACTED]" if "prompt" in sensitive_fields else prompt
        safe_response = "[REDACTED]" if "response" in sensitive_fields else response
        self.traces[trace_id]["spans"].append({
            "name": name, "prompt": safe_prompt, "response": safe_response, "cost": cost,
        })

    def total_cost(self, trace_id):
        return sum(span["cost"] for span in self.traces[trace_id]["spans"])

    def dominant_span(self, trace_id):
        return max(self.traces[trace_id]["spans"], key=lambda s: s["cost"])

sim = SimpleLangfuseSim()
trace_id = sim.start_trace()  # propagated explicitly to every downstream step

sim.log_generation(trace_id, "retrieval_rerank", prompt="rerank query", response="top-5 docs", cost=0.001)
sim.log_generation(
    trace_id, "final_answer",
    prompt="user's personal question with PII",
    response="generated answer",
    cost=0.02,
    sensitive_fields=["prompt"],
)

print(f"Total cost for trace {trace_id}: ${sim.total_cost(trace_id):.4f}")
print(f"Cost-dominant span: {sim.dominant_span(trace_id)['name']}")
print(f"Logged spans (sensitive fields redacted): {sim.traces[trace_id]['spans']}")
~~~

## Dependencies, Cross-References und Quellen

1. Langfuse-Dokumentation: [Tracing — Core Concepts](https://langfuse.com/docs/tracing), abgerufen 2026-09-17.
2. Langfuse-Dokumentation: [Scores and Evaluation](https://langfuse.com/docs/scores/overview), abgerufen 2026-09-17.

Beobachtbarkeit von AI-Anwendungen ist kanonisch in [KB-0272](../11-genai-architecture/32-beobachtbarkeit-von-ai-anwendungen.md) behandelt; Agentenbeobachtung und Trace Replay in [KB-0302](../12-agentic-ai/28-agentenbeobachtung-und-trace-replay.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte PII-Erkennung als eingebaute Vorstufe der Langfuse-Instrumentierung | Evaluating | Gegenüber manuell definierten Maskierungsregeln abwägen, sobald ein zuverlässiger Erkennungsmechanismus für die konkreten Datentypen verfügbar ist. |
| Integrierte, automatisierte Score-Erzeugung durch LLM-basierte Bewertungsmodelle direkt in der Tracing-Pipeline | Adopting | Gegenüber rein manueller Bewertung für skalierbarere, kontinuierliche Qualitätsverfolgung bevorzugen. |

Ein Team akzeptiert eine produktive GenAI-Instrumentierung erst, wenn Trace-ID-Weitergabe, Sensitivitätsprüfung und Kostenerfassung pro Trace dokumentiert vollständig implementiert sind.
