---
{"id": "KB-0569", "title": "Distributed Tracing", "domain": "24", "sequence": 5, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "CLOUD", "MLOPS"], "requires": [{"id": "KB-0568", "concepts": ["Strukturierte Logs"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Spans, Trace-Kontext und Sampling anhand offizieller OpenTelemetry-Spezifikation korrekt einsetzen können, um konkrete Anfragepfade über mehrere Dienste hinweg nachzuvollziehen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete verteilte Architektur explizit gestalten, wie Trace-Kontext über synchrone und insbesondere asynchrone Dienstübergaben propagiert wird, um Kontextverlust an Warteschlangen- oder Ereignisgrenzen zu vermeiden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unvollständige oder abgebrochene Trace-Rekonstruktion auf verlorenen Trace-Kontext an einer asynchronen Übergabe (Warteschlange, Ereignisbus) zurückführen können, statt eine fehlende Instrumentierung zu vermuten.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für konsistente Trace-Kontext-Propagierung über synchrone und asynchrone Übergaben sowie bewusste Sampling-Strategien festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung spezifischer Tracing-Backend-Speichersysteme im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Span-/Kontext-Propagierung über Dienstgrenzen und Sampling-Trade-offs, nicht die Backend-Speicherimplementierung."}}, "lab_validation": [{"lab_id": "KB-0569-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation von Trace-Kontextverlust an einer asynchronen Übergabe, kein produktives Tracing-System verwendet", "evidence": "Ein lokales Skript simuliert, wie ein Trace-Kontext bei einer synchronen HTTP-Anfrage zwischen zwei Diensten zuverlässig über Header propagiert wird, während derselbe Kontext bei einer asynchronen Übergabe über eine Warteschlange verloren geht, wenn die Nachricht nicht explizit mit Trace-Kontext-Metadaten angereichert wird, wodurch der nachgelagerte, aus der Warteschlange konsumierende Dienst einen neuen, nicht verknüpften Trace beginnt, statt den ursprünglichen Anfragepfad fortzusetzen.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Tracing-System mit tatsächlicher verteilter Infrastrukturdynamik."}]}
---
# Distributed Tracing

> **Ziel:** Distributed Tracing rekonstruiert den vollständigen Weg einer einzelnen Anfrage über mehrere, unabhängige Dienste hinweg über **Spans** (einzelne, zeitlich begrenzte Arbeitseinheiten innerhalb eines Dienstes, etwa "Datenbankabfrage ausführen"), **Trace-Kontext** (eine eindeutige Kennung, die bei Anfrageeintritt erzeugt und über alle beteiligten Dienste hinweg propagiert wird, um alle zugehörigen Spans einem gemeinsamen Trace zuzuordnen — strukturell analog zur bereits behandelten Korrelations-ID bei strukturierten Logs, siehe [KB-0568](04-strukturierte-logs.md)), und **Sampling** (die bewusste Entscheidung, nur einen Teil aller Anfragen tatsächlich vollständig zu tracen, um Speicher- und Verarbeitungsaufwand bei hohem Anfragevolumen zu begrenzen). Der zentrale Punkt dieses Kapitels ist, dass eine unvollständige oder abgebrochene Trace-Rekonstruktion typischerweise nicht auf fehlende Instrumentierung eines einzelnen Dienstes zurückzuführen ist, sondern auf **verlorenen Trace-Kontext an einer asynchronen Übergabe** — während synchrone Aufrufe (etwa HTTP-Anfragen zwischen Diensten) den Trace-Kontext zuverlässig über standardisierte Header propagieren, muss dieser Kontext bei asynchronen Übergaben (eine Nachricht wird in eine Warteschlange geschrieben und später von einem anderen Prozess konsumiert) explizit als Metadaten in der Nachricht selbst mitgeführt werden — geschieht dies nicht, beginnt der aus der Warteschlange konsumierende Dienst einen vollständig neuen, nicht mit dem ursprünglichen Anfragepfad verknüpften Trace.

## Zweck, Mental Model und Dependencies

Ein einzelner Span repräsentiert eine zeitlich begrenzte Arbeitseinheit innerhalb eines Dienstes, mit einem Start- und Endzeitpunkt sowie zugehörigen Metadaten (welcher Dienst, welche Operation, welches Ergebnis) — mehrere Spans, die tatsächlich zur selben ursprünglichen Anfrage gehören, werden über eine gemeinsame Trace-ID zu einem vollständigen Trace zusammengefügt, wobei jeder Span zusätzlich typischerweise eine Referenz auf seinen übergeordneten Span trägt, um die tatsächliche Aufrufhierarchie (welcher Dienst rief welchen anderen Dienst auf) zu rekonstruieren. Die Propagierung des Trace-Kontexts (Trace-ID und übergeordnete Span-ID) ist der technisch kritischste Aspekt: Bei einer synchronen Anfrage (etwa einem HTTP-Aufruf von Dienst A an Dienst B) wird dieser Kontext standardisiert über HTTP-Header übertragen (etwa gemäß der W3C-Trace-Context-Spezifikation), was eine zuverlässige, werkzeugübergreifend interoperable Propagierung ermöglicht. Bei asynchronen Übergaben (Dienst A schreibt eine Nachricht in eine Warteschlange, Dienst B konsumiert diese Nachricht zu einem späteren, unbestimmten Zeitpunkt, siehe die bereits behandelten Messaging-Muster in Domain 8) existiert jedoch kein direkter, synchroner Aufruf, über den Header automatisch propagiert werden könnten — der Trace-Kontext muss stattdessen explizit als Teil der Nachrichten-Metadaten (nicht der eigentlichen Nutzdaten) mitgeführt werden, was eine bewusste, zusätzliche Implementierungsentscheidung an jeder asynchronen Übergabestelle erfordert. Wird diese explizite Kontextpropagierung an einer einzigen asynchronen Übergabe im gesamten Anfragepfad übersehen, bricht die Trace-Kette an genau dieser Stelle ab — der konsumierende Dienst beginnt einen neuen, unabhängigen Trace, wodurch der ursprüngliche, zusammenhängende Anfragepfad in zwei nicht mehr miteinander verknüpfbare Fragmente zerfällt, was bei der Fehlersuche fälschlich den Eindruck erwecken kann, der nachgelagerte Dienst sei überhaupt nicht Teil des ursprünglichen Anfragepfads gewesen. Sampling adressiert das praktische Problem, dass eine vollständige Tracing-Erfassung jeder einzelnen Anfrage bei hohem Produktionsvolumen unverhältnismäßigen Speicher- und Verarbeitungsaufwand verursachen würde — durch bewusstes Sampling (etwa "nur 1% aller Anfragen vollständig tracen", oder adaptives Sampling, das Anfragen mit erkennbaren Fehlern oder ungewöhnlich hoher Latenz bevorzugt vollständig erfasst) wird der Ressourcenaufwand kontrolliert begrenzt, während die statistische Aussagekraft für die Erkennung systematischer Probleme erhalten bleibt.

~~~text
Distributed Tracing: reconstructs full path of ONE request across MULTIPLE independent services
  Span: single, time-bounded unit of work within a service (start/end time, service, operation, result)
    -> multiple spans sharing a Trace ID = one complete trace
    -> each span references its PARENT span -> reconstructs actual call hierarchy
  Trace Context: unique ID generated at request entry, propagated across ALL involved services
    (structurally same as correlation ID in structured logs, KB-0568)
  Sampling: deliberate decision to fully trace only a SUBSET of requests
    -> controls storage/processing overhead at high production volume
CRITICAL PROPAGATION DISTINCTION: synchronous vs asynchronous handoffs
  Synchronous (HTTP call A->B): context propagated RELIABLY via standardized headers (W3C Trace Context)
  Asynchronous (message written to queue, consumed LATER by another process, Domain 8 messaging patterns)
    -> NO direct synchronous call for headers to auto-propagate through
    -> context MUST be EXPLICITLY carried as message METADATA (not payload)
       -> requires deliberate implementation decision at EVERY async handoff point
MISSING this at even ONE async handoff -> trace chain BREAKS exactly there
  -> consuming service starts a NEW, unrelated trace
  -> original connected request path fractures into 2 unlinkable fragments
  -> can falsely suggest downstream service wasn't part of the original request path at all
INCOMPLETE/broken trace reconstruction usually != missing instrumentation in a single service
  -> usually = lost trace context at an ASYNC handoff (queue/event bus)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Span | zeitlich begrenzte Arbeitseinheit mit Eltern-Referenz | rekonstruiert tatsächliche Aufrufhierarchie |
| Trace-Kontext | eindeutige Kennung, propagiert über alle beteiligten Dienste | Grundlage für vollständige Trace-Rekonstruktion |
| Synchrone Propagierung | standardisierte Header-Übertragung (W3C Trace Context) | zuverlässig, automatisch bei direkten Aufrufen |
| Asynchrone Propagierung | explizite Metadaten-Anreicherung bei Warteschlangen/Events | häufigste Fehlerquelle für abgebrochene Traces |
| Sampling | bewusste Begrenzung der vollständig getracten Anfragen | balanciert Ressourcenaufwand und statistische Aussagekraft |

Implementierung: Jede asynchrone Übergabestelle (Warteschlange, Ereignisbus) wird explizit darauf geprüft, ob Trace-Kontext als Nachrichten-Metadaten propagiert wird, statt implizit auf automatische Propagierung wie bei synchronen Aufrufen zu vertrauen. Sampling-Strategien werden bewusst gewählt, mit erhöhter Erfassungswahrscheinlichkeit für Anfragen mit erkennbaren Fehlern oder ungewöhnlicher Latenz. Trace-IDs werden konsistent mit den bereits etablierten Korrelations-IDs aus strukturiertem Logging verknüpft, um Traces und Logs gemeinsam durchsuchbar zu machen.

## Scalability, Reliability, Security und Observability

Distributed Tracing skaliert die tatsächliche Diagnosefähigkeit proportional zur vollständigen, insbesondere über asynchrone Übergaben hinweg konsistenten Trace-Kontext-Propagierung; die Reliability-Grenze liegt darin, dass eine einzelne, übersehene asynchrone Übergabe ohne Kontext-Propagierung die gesamte nachgelagerte Trace-Kette unwiederbringlich abbricht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Trace bricht an einer bestimmten Stelle im Anfragepfad ab, obwohl nachgelagerte Dienste korrekt instrumentiert sind | an dieser Stelle erfolgt eine asynchrone Übergabe, bei der Trace-Kontext nicht als Nachrichten-Metadaten propagiert wird | die betroffene Übergabestelle explizit auf Kontext-Propagierung über die Nachrichten-Metadaten prüfen und ergänzen |
| systematische, aber seltene Fehler werden im Tracing nicht erfasst | die Sampling-Rate ist zu niedrig oder nicht adaptiv für Fehlerfälle konfiguriert | eine adaptive Sampling-Strategie einführen, die Anfragen mit erkennbaren Fehlern bevorzugt vollständig erfasst |
| Traces und Logs derselben Anfrage können nicht gemeinsam korreliert werden | Trace-ID und Log-Korrelations-ID sind nicht konsistent miteinander verknüpft | die Trace-ID explizit als Korrelations-ID in strukturierten Logs verwenden |

Security: Trace-Metadaten sollten keine sensiblen Nutzdaten enthalten, da Tracing-Backends häufig breiteren Zugriff als die eigentlichen, verarbeiteten Daten haben, ähnlich der bereits bei strukturierten Logs behandelten Sensible-Daten-Vermeidung. Observability: Die tatsächliche Vollständigkeit rekonstruierter Traces relativ zur erwarteten Dienstanzahl im Anfragepfad, sowie die Sampling-Rate relativ zur tatsächlichen Fehlererfassung, sind zentrale Betriebssignale zur Bewertung der Tracing-Infrastruktur selbst.

## Trade-offs und Entscheidungen

**Staff** instrumentiert einen einzelnen Dienst mit korrekter Span-Erzeugung und Kontext-Propagierung. **Principal** entwirft die vollständige Trace-Kontext-Propagierungsstrategie über synchrone und asynchrone Übergaben sowie die Sampling-Strategie für ein System. **Chief** legt unternehmensweite Standards für konsistente Kontext-Propagierung über alle Übergabearten fest.

Anti-Patterns: Trace-Kontext bei asynchronen Übergaben implizit als automatisch propagiert annehmen, ohne explizite Metadaten-Anreicherung; eine feste, nicht adaptive Sampling-Rate nutzen, die Fehlerfälle nicht bevorzugt erfasst; Trace-ID und Log-Korrelations-ID getrennt und nicht konsistent verwalten.

## Production Checklist

- [ ] Jede asynchrone Übergabestelle propagiert Trace-Kontext explizit als Nachrichten-Metadaten.
- [ ] Eine adaptive Sampling-Strategie erfasst Fehlerfälle bevorzugt vollständig.
- [ ] Trace-ID und Log-Korrelations-ID sind konsistent miteinander verknüpft.
- [ ] Die Vollständigkeit rekonstruierter Traces wird gegen die erwartete Dienstanzahl im Anfragepfad überwacht.

## Interviewfragen

### 1. Was ist ein Span, und wie werden mehrere Spans zu einem vollständigen Trace zusammengefügt?

**Antwort:** Ein Span ist eine zeitlich begrenzte Arbeitseinheit innerhalb eines Dienstes; mehrere Spans, die eine gemeinsame Trace-ID tragen, werden über diese ID zu einem vollständigen Trace zusammengefügt, wobei Eltern-Referenzen die tatsächliche Aufrufhierarchie rekonstruieren.

### 2. Warum ist die Propagierung von Trace-Kontext bei asynchronen Übergaben besonders fehleranfällig?

**Antwort:** Weil bei synchronen Aufrufen Header automatisch propagiert werden, während bei asynchronen Übergaben (Warteschlangen, Ereignisbusse) kein direkter Aufruf existiert, über den der Kontext automatisch übertragen würde — er muss explizit als Nachrichten-Metadaten mitgeführt werden.

### 3. Was passiert, wenn Trace-Kontext an einer asynchronen Übergabe nicht propagiert wird?

**Antwort:** Der konsumierende Dienst beginnt einen neuen, unabhängigen Trace, wodurch der ursprüngliche Anfragepfad in zwei nicht mehr miteinander verknüpfbare Fragmente zerfällt.

### 4. Wofür wird Sampling bei Distributed Tracing genutzt?

**Antwort:** Um den Speicher- und Verarbeitungsaufwand bei hohem Produktionsvolumen zu begrenzen, indem nur ein bewusst gewählter Anteil aller Anfragen tatsächlich vollständig getract wird.

### 5. Wie gehst du vor, wenn ein Trace an einer bestimmten Stelle abbricht, obwohl nachgelagerte Dienste korrekt instrumentiert sind?

**Antwort:** Ich prüfe, ob an dieser Stelle eine asynchrone Übergabe (Warteschlange, Ereignisbus) erfolgt, bei der Trace-Kontext nicht als Nachrichten-Metadaten propagiert wird, da dies die häufigste Ursache für abgebrochene Trace-Ketten ist.

### 6. Widersprüchliche Anforderung: Team will minimalen Instrumentierungsaufwand bei asynchronen Systemen UND garantiert vollständig rekonstruierbare Traces über alle synchronen und asynchronen Übergaben hinweg — wie gehst du vor?

**Antwort:** Ich würde eine standardisierte Messaging-Bibliothek oder ein Middleware-Muster einführen, das Trace-Kontext-Propagierung automatisch bei jeder Nachrichtenerstellung und -konsumierung übernimmt, ohne dass Entwickler dies bei jeder einzelnen asynchronen Übergabe manuell implementieren müssen — minimaler Instrumentierungsaufwand und vollständige Trace-Rekonstruktion lassen sich durch geeignete, wiederverwendbare Tooling-Unterstützung statt durch manuellen, fehleranfälligen Einzelaufwand vereinbaren.

## Praktische Labs

~~~python
# Local, deterministic simulation of trace context loss at an async handoff (executed locally, no real tracing system):

def sync_call(trace_context, target_service):
    # synchronous call: context propagated automatically via "headers"
    return {"service": target_service, "trace_id": trace_context["trace_id"], "linked": True}

def async_publish_without_context(message, target_service):
    # async handoff WITHOUT explicit trace context propagation -- BUG
    return {"service": target_service, "trace_id": "NEW-UNLINKED-TRACE", "linked": False}

def async_publish_with_context(message, trace_context, target_service):
    # async handoff WITH explicit trace context propagation -- CORRECT
    return {"service": target_service, "trace_id": trace_context["trace_id"], "linked": True}

trace_context = {"trace_id": "trace-abc123"}

print("sync call:", sync_call(trace_context, "service-b"))
print("async without context propagation:", async_publish_without_context({}, "service-c"))
print("async with context propagation:", async_publish_with_context({}, trace_context, "service-d"))
~~~

## Dependencies, Cross-References und Quellen

1. OpenTelemetry-Dokumentation: [Traces — Spans and Context Propagation](https://opentelemetry.io/docs/concepts/signals/traces/), abgerufen 2026-09-18.
2. W3C-Dokumentation: [Trace Context Specification](https://www.w3.org/TR/trace-context/), abgerufen 2026-09-18.

Strukturierte Logs sind kanonisch in [KB-0568](04-strukturierte-logs.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatische Trace-Kontext-Propagierung direkt in gängigen Messaging-Bibliotheken (statt manueller Metadaten-Anreicherung durch Entwickler) | Evaluating | Gegenüber manueller Kontext-Propagierung erst nach Prüfung der tatsächlichen Abdeckung für die konkret genutzten Messaging-Systeme bevorzugen. |

Ein Team akzeptiert eine Distributed-Tracing-Implementierung erst, wenn Trace-Kontext nachweislich sowohl über synchrone als auch über alle asynchronen Übergaben hinweg vollständig propagiert wird.
