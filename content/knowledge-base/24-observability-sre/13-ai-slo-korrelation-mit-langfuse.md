---
{"id": "KB-0577", "title": "AI-SLO-Korrelation mit Langfuse", "domain": "24", "sequence": 13, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "CLOUD", "MLOPS"], "requires": [{"id": "KB-0565", "concepts": ["SLI, SLO und SLA"], "needed_for": "understanding"}, {"id": "KB-0569", "concepts": ["Distributed Tracing"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Langfuse-Traces mit Produktqualitäts- und Tokenmetriken korrelieren können, um AI-SLOs anhand offizieller Dokumentation zu definieren und auszuwerten.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein konkretes AI-System explizit gestalten, wie Infrastrukturtraces, Tokenmetriken und Produktqualitätssignale in einer gemeinsamen AI-SLO-Sicht verbunden werden, ohne die Langfuse-Technikdetails zu wiederholen, die bereits kanonisch in Domain 15 behandelt sind.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine grün angezeigte Infrastrukturmetrik von einem tatsächlich fehlenden Produktqualitätsbeleg unterscheiden können (green-but-blind), statt formale Infrastrukturgesundheit mit tatsächlicher Ergebnisqualität gleichzusetzen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für AI-SLO-Definition festlegen, die Infrastruktur-, Token- und Produktqualitätssignale explizit verbinden, statt AI-Systeme allein anhand von Infrastrukturmetriken als gesund zu bewerten.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte Langfuse-Instrumentierungstechnik (Trace-Design, Evals) ist in Domain 15 vertieft und hier bewusst nicht wiederholt.", "rationale": "Kern ist die Korrelation von Produktqualität, Tokenmetriken und Infrastrukturtraces zu einer AI-SLO-Sicht, nicht die Instrumentierungsmechanik selbst."}}, "lab_validation": [{"lab_id": "KB-0577-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation von green-but-blind bei AI-Infrastrukturmetriken, kein produktives Langfuse-System verwendet", "evidence": "Ein lokales Skript simuliert, wie eine vollständig grüne Infrastruktur-Traceübersicht (niedrige Latenz, keine Fehler) gleichzeitig mit einer unbeobachteten, tatsächlich gesunkenen Produktqualität (etwa durch fehlende Evaluation-Scores) auftreten kann, und zeigt damit, dass formale Infrastrukturgesundheit keine tatsächliche Ergebnisqualität garantiert.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Langfuse-System."}]}
---
# AI-SLO-Korrelation mit Langfuse

> **Ziel:** Langfuse (dessen konkrete Instrumentierungstechnik bereits kanonisch in Domain 15 behandelt ist) liefert Infrastrukturtraces und Tokenmetriken für AI-Systeme — der zentrale Punkt dieses Kapitels ist, diese Infrastruktursignale gezielt mit tatsächlicher **Produktqualität** zu korrelieren, statt sie isoliert als eigenständigen SLO-Beleg zu behandeln. Eine vollständig grüne Infrastrukturübersicht (niedrige Latenz, keine Fehler, normale Tokenverbrauchsraten) beweist nicht automatisch, dass die tatsächliche Ausgabequalität eines AI-Systems für Nutzer akzeptabel ist — dieses Muster, bei dem formale, grün angezeigte Systemmetriken einen tatsächlich fehlenden oder unbeobachteten Qualitätsbeleg verdecken, wird als **green-but-blind** bezeichnet und muss durch explizite Verbindung von Infrastruktur-, Token- und Produktqualitätsmetriken in der AI-SLO-Definition sichtbar gemacht werden.

## Zweck, Mental Model und Dependencies

Die bereits in [KB-0565](01-sli-slo-und-sla.md) behandelten SLI/SLO-Grundlagen und das in [KB-0569](05-distributed-tracing.md) behandelte verteilte Tracing bilden die technische Basis für AI-SLOs, doch bei AI-Systemen reicht die reine Infrastruktursicht (Latenz, Fehlerrate, Tokenverbrauch) strukturell nicht aus, um die tatsächliche Systemgesundheit zu beurteilen — ein AI-System kann formal alle Infrastruktur-SLOs erfüllen (schnelle Antwortzeiten, keine Fehler, normale Tokenkosten) und gleichzeitig systematisch falsche, irrelevante oder qualitativ schlechte Ausgaben liefern, ohne dass die reinen Infrastrukturmetriken dies anzeigen. Dieses green-but-blind-Muster entsteht, weil Infrastrukturmetriken und Produktqualitätsmetriken aus unterschiedlichen Quellen stammen und unterschiedliche Fragen beantworten: Ein Trace zeigt, dass eine Anfrage erfolgreich und schnell durch das System gelaufen ist, aber nicht, ob die dabei erzeugte Antwort inhaltlich korrekt oder nützlich war — diese Bewertung erfordert eine separate Evaluation-Schicht (etwa automatisierte oder menschliche Qualitätsbewertungen), die explizit mit den zugrunde liegenden Traces und Tokenmetriken verknüpft werden muss, um die Frage "war diese schnelle, fehlerfreie Anfrage auch inhaltlich gut beantwortet?" tatsächlich beantworten zu können. Eine AI-SLO-Definition, die nur Infrastruktursignale (Latenz, Verfügbarkeit, Tokenkosten) umfasst, ist deshalb strukturell unvollständig — sie muss explizit um Produktqualitätssignale (etwa Evaluation-Scores, Nutzerfeedback-Raten) ergänzt werden, die mit denselben Traces korreliert sind, damit eine formal grüne Infrastruktur nicht fälschlich als Beleg für tatsächlich gute Produktqualität interpretiert wird.

~~~text
Langfuse (instrumentation technique canonical in Domain 15): delivers infra traces + token metrics for AI systems
KEY POINT: correlate these infra signals with ACTUAL PRODUCT QUALITY
  not treat infra signals in isolation as standalone SLO evidence
fully green infra overview (low latency, no errors, normal token usage)
  does NOT automatically prove actual output quality is acceptable to users
THIS PATTERN = green-but-blind: formally green system metrics hide an actually missing/unobserved quality signal
  must be made visible by explicitly connecting infra + token + product-quality metrics in AI-SLO definition
WHY green-but-blind occurs: infra metrics and product-quality metrics come from DIFFERENT sources, answer DIFFERENT questions
  a trace shows: request ran successfully+fast through system
  a trace does NOT show: whether the resulting answer was factually correct or useful
  -> needs SEPARATE evaluation layer (automated or human quality scoring)
     explicitly linked to underlying traces + token metrics
  -> to actually answer: "was this fast, error-free request also well-answered content-wise?"
CONSEQUENCE: AI-SLO definition covering ONLY infra signals (latency, availability, token cost)
  -> structurally INCOMPLETE
  must explicitly add product-quality signals (evaluation scores, user feedback rates)
    correlated with the SAME traces
  -> prevents formally-green infra being misread as proof of actually-good product quality
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Infrastrukturtraces | zeigt technischen Erfolg einer Anfrage (Latenz, Fehler) | beantwortet nicht die Qualitätsfrage |
| Tokenmetriken | zeigt Ressourcenverbrauch pro Anfrage | Kostenkontrolle, kein Qualitätssignal |
| Evaluation-Scores | zeigt tatsächliche inhaltliche Qualität einer Antwort | zentraler Baustein gegen green-but-blind |
| Korrelierte AI-SLO | verbindet Infrastruktur-, Token- und Qualitätssignal je Trace | vollständige, statt isolierte, SLO-Sicht |

Implementierung: Jeder Langfuse-Trace wird mit einem zugehörigen Evaluation-Score (automatisiert oder menschlich) verknüpft, statt Infrastruktur- und Qualitätsdaten getrennt zu betrachten. AI-SLOs werden explizit sowohl über Infrastruktursignale als auch über korrelierte Qualitätssignale definiert. Fehlende Evaluation-Abdeckung wird selbst als sichtbares Signal behandelt, nicht stillschweigend als "gesund" interpretiert.

## Scalability, Reliability, Security und Observability

Die AI-SLO-Korrelation skaliert die tatsächliche Diagnosefähigkeit proportional zur Abdeckung der Evaluation-Schicht über die Traces; die Reliability-Grenze liegt darin, dass eine unvollständige Evaluation-Abdeckung green-but-blind-Zustände unentdeckt lässt, unabhängig davon, wie vollständig die reine Infrastruktur-Observability ist.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| alle Infrastruktur-SLOs sind grün, aber Nutzer melden schlechte Antwortqualität | Evaluation-Signale sind nicht mit Traces korreliert, ein green-but-blind-Zustand liegt vor | Evaluation-Abdeckung der betroffenen Traces prüfen und ergänzen |
| die tatsächliche Ursache einer Qualitätsverschlechterung ist unklar | Infrastruktur- und Qualitätsdaten werden getrennt statt korreliert ausgewertet | Traces gezielt mit den zugehörigen Evaluation-Scores und Tokenmetriken verknüpft betrachten |
| ein Team verlässt sich ausschließlich auf Infrastruktur-Dashboards zur Bewertung der AI-Systemgesundheit | Produktqualitätssignale fehlen strukturell in der SLO-Definition | die AI-SLO-Definition explizit um korrelierte Evaluation-Signale ergänzen |

Security: Evaluation-Daten können sensible Nutzerinhalte enthalten und sollten wie andere Betriebsdaten nicht ohne Zugriffskontrolle erreichbar sein. Observability: Die tatsächliche Evaluation-Abdeckungsrate über alle Traces (wie viel Prozent der Anfragen tatsächlich ein Qualitätssignal erhalten) ist ein zentrales Signal, um green-but-blind-Risiko selbst messbar zu machen.

## Trade-offs und Entscheidungen

**Staff** korreliert Traces und Evaluation-Scores für eine gegebene Diagnoseaufgabe korrekt. **Principal** entwirft die vollständige AI-SLO-Definition, die Infrastruktur-, Token- und Qualitätssignale verbindet. **Chief** legt unternehmensweite Standards fest, die AI-Systeme nicht allein anhand von Infrastrukturmetriken als gesund bewerten lassen.

Anti-Patterns: AI-SLOs ausschließlich über Infrastruktursignale (Latenz, Fehlerrate, Tokenkosten) definieren; eine grüne Infrastrukturübersicht ohne Prüfung der Evaluation-Abdeckung als Beleg für gute Produktqualität interpretieren; Evaluation-Daten unkorreliert von den zugrunde liegenden Traces sammeln, sodass eine gezielte Ursachenanalyse nicht möglich ist.

## Production Checklist

- [ ] Jeder relevante Trace ist mit einem Evaluation-Score verknüpft, nicht nur mit Infrastrukturmetriken.
- [ ] AI-SLOs sind explizit über Infrastruktur- und Qualitätssignale gemeinsam definiert.
- [ ] Die Evaluation-Abdeckungsrate wird selbst als Betriebssignal überwacht.
- [ ] Evaluation-Daten mit sensiblen Nutzerinhalten sind zugriffsgeschützt.

## Interviewfragen

### 1. Was bedeutet green-but-blind im Kontext von AI-SLOs?

**Antwort:** Ein Zustand, in dem formal grüne Infrastrukturmetriken (Latenz, Fehlerrate) einen tatsächlich fehlenden oder unbeobachteten Beleg für die inhaltliche Produktqualität verdecken.

### 2. Warum reicht eine reine Infrastruktursicht bei AI-Systemen nicht aus?

**Antwort:** Weil ein Trace zeigt, dass eine Anfrage technisch erfolgreich und schnell verarbeitet wurde, aber nicht, ob die erzeugte Antwort inhaltlich korrekt oder nützlich war — diese Bewertung erfordert eine separate Evaluation-Schicht.

### 3. Wie wird green-but-blind bei AI-SLOs strukturell vermieden?

**Antwort:** Durch explizite Korrelation von Infrastruktur-, Token- und Produktqualitätssignalen (Evaluation-Scores) je Trace in der AI-SLO-Definition.

### 4. Warum ist die Evaluation-Abdeckungsrate selbst ein wichtiges Betriebssignal?

**Antwort:** Weil eine niedrige Abdeckungsrate bedeutet, dass für einen großen Teil der Anfragen kein Qualitätssignal vorliegt, wodurch ein green-but-blind-Risiko unentdeckt bleiben kann.

### 5. Wie gehst du vor, wenn alle Infrastruktur-SLOs grün sind, aber Nutzer schlechte Antwortqualität melden?

**Antwort:** Ich prüfe die Evaluation-Abdeckung der betroffenen Traces, da ein green-but-blind-Zustand vorliegen kann, bei dem die Infrastruktur gesund erscheint, aber keine oder unzureichende Qualitätssignale vorliegen.

### 6. Widersprüchliche Anforderung: Team will minimalen Evaluation-Overhead zur Kostenersparnis UND vollständige Abdeckung zur Vermeidung von green-but-blind-Zuständen — wie gehst du vor?

**Antwort:** Ich würde eine risikobasierte, statistische Stichprobenabdeckung der Evaluation einführen, die für kritische oder auffällige Trace-Muster verdichtet wird, statt entweder auf vollständige Evaluation-Kosten für jede Anfrage zu bestehen oder Evaluation-Abdeckung so weit zu reduzieren, dass green-but-blind-Risiken strukturell unentdeckt bleiben.

## Praktische Labs

~~~python
# Local, deterministic simulation of green-but-blind: healthy infra trace with missing quality signal (executed locally, no real Langfuse):

def check_ai_slo(trace):
    infra_healthy = trace["latency_ms"] < 500 and trace["error"] is False
    has_evaluation = trace.get("evaluation_score") is not None
    return {
        "infra_healthy": infra_healthy,
        "has_evaluation": has_evaluation,
        "green_but_blind": infra_healthy and not has_evaluation,
    }

trace = {"latency_ms": 120, "error": False, "evaluation_score": None}
print(check_ai_slo(trace))
~~~

## Dependencies, Cross-References und Quellen

1. Langfuse-Dokumentation: [Langfuse Evaluation Overview](https://langfuse.com/docs/evaluation/overview), abgerufen 2026-09-18.
2. Langfuse-Dokumentation: [Tracing for LLM Applications](https://langfuse.com/docs/tracing), abgerufen 2026-09-18.

Langfuse-Instrumentierungstechnik ist kanonisch in Domain 15 behandelt; SLI/SLO-Grundlagen in [KB-0565](01-sli-slo-und-sla.md); verteiltes Tracing in [KB-0569](05-distributed-tracing.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| LLM-basierte, automatisierte Evaluation-Judges zur Skalierung der Evaluation-Abdeckung ohne vollständige menschliche Bewertung | Evaluating | Gegen eine Stichprobe menschlicher Bewertungen kalibrieren, bevor automatisierte Judges als alleinige Qualitätsquelle für AI-SLOs eingesetzt werden, da eine unkalibrierte automatische Bewertung selbst ein neues green-but-blind-Risiko erzeugen kann. |

Ein Team akzeptiert eine AI-SLO-Definition erst, wenn Infrastruktur-, Token- und Qualitätssignale nachweislich korreliert sind und die Evaluation-Abdeckungsrate selbst überwacht wird, statt formale Infrastrukturgesundheit als vollständigen Qualitätsbeleg zu behandeln.
