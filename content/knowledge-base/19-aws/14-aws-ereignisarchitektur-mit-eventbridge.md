---
{"id": "KB-0476", "title": "AWS-Ereignisarchitektur mit EventBridge", "domain": "19", "sequence": 14, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0182", "concepts": ["Amazon SQS und SNS"], "needed_for": "understanding"}, {"id": "KB-0472", "concepts": ["AWS Lambda"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine EventBridge-Regel mit einem Event-Pattern und einem Ziel anhand offizieller Dokumentation konfigurieren können und erklären, wofür EventBridge gegenüber direkter SQS-/SNS-Nutzung geeignet ist.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete, ereignisgesteuerte AWS-Lösungsarchitektur begründet zwischen EventBridge (inhaltsbasiertes Routing über Diensteigentumsgrenzen), SQS (Punkt-zu-Punkt-Warteschlange) und SNS (Publish/Subscribe-Verteilung) entscheiden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein unerwartetes, ausbleibendes Event-Routing auf ein fehlerhaft konfiguriertes Event-Pattern in einer EventBridge-Regel zurückführen können, statt einen Fehler im aufrufenden Dienst anzunehmen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Ereignisarchitektur-Richtlinien im Unternehmen anhand klarer Diensteigentumsgrenzen und dokumentierter Fehlerpfade statt anhand einer pauschalen, undifferenzierten Nutzung eines einzelnen Messaging-Dienstes festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der EventBridge-Event-Bus-Infrastruktur im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Routing, Diensteigentum und Fehlerpfaden als Entscheidungsgrundlage für Lösungsdesign, nicht die zugrunde liegende Broker-Interna aus Domain 08."}}, "lab_validation": [{"lab_id": "KB-0476-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller AWS-EventBridge-, SQS- und SNS-Dokumentation, kein aktives AWS-Konto verwendet", "evidence": "Anhand offizieller AWS-Dokumentation wird nachvollzogen, wie EventBridge inhaltsbasiertes Routing über Event-Pattern-Matching zwischen unabhängig voneinander verantworteten Diensten ermöglicht, wie sich dies von der Punkt-zu-Punkt-Semantik von SQS und der Publish/Subscribe-Semantik von SNS unterscheidet, und wie Fehlerpfade (Dead-Letter-Queues, Retry-Richtlinien) für jeden dieser Dienste konfiguriert werden.", "limitations": "Kein aktives AWS-Konto verwendet, keine reale Ereignisarchitektur erstellt."}]}
---
# AWS-Ereignisarchitektur mit EventBridge

> **Ziel:** AWS bietet mehrere Messaging-/Ereignisdienste, die unterschiedliche Kommunikationsmuster adressieren (siehe Amazon SQS und SNS, [KB-0182](../08-messaging-workflows/06-amazon-sqs-und-sns.md)) — SQS implementiert Punkt-zu-Punkt-Warteschlangen (eine Nachricht wird von genau einem Konsumenten verarbeitet), SNS implementiert Publish/Subscribe-Verteilung (eine Nachricht wird an alle abonnierten Ziele verteilt), während EventBridge eine zusätzliche Abstraktionsebene mit inhaltsbasiertem Routing bereitstellt (Regeln definieren Event-Pattern, die bestimmen, welche Ereignisse basierend auf ihrem tatsächlichen Inhalt an welche Ziele weitergeleitet werden, unabhängig davon, welcher Dienst das Ereignis ursprünglich erzeugt hat). Der zentrale Punkt dieses Kapitels ist, dass EventBridge besonders geeignet ist, wenn Ereignisse über die Grenzen unabhängig voneinander verantworteter Dienste oder Teams hinweg geroutet werden müssen (der erzeugende Dienst muss die konsumierenden Dienste nicht kennen, das Routing wird zentral über Event-Pattern definiert), während SQS und SNS geeigneter sind, wenn die Kommunikationsbeziehung zwischen erzeugendem und konsumierendem Dienst bereits explizit und bekannt ist.

## Zweck, Mental Model und Dependencies

Bei SQS sendet ein Erzeuger eine Nachricht in eine spezifische Warteschlange, aus der genau ein Konsument (oder eine Gruppe konkurrierender Konsumenten, von denen jeweils einer die Nachricht erhält) sie liest und verarbeitet — dies eignet sich für Arbeitsverteilung, bei der jede Nachricht genau einmal von einem konkreten, bekannten Verarbeitungsprozess bearbeitet werden soll. Bei SNS sendet ein Erzeuger eine Nachricht an ein Topic, das an alle abonnierten Ziele (mehrere SQS-Warteschlangen, Lambda-Funktionen, oder andere Endpunkte) verteilt wird — dies eignet sich für Broadcast-Szenarien, bei denen mehrere, unabhängige Konsumenten dasselbe Ereignis jeweils eigenständig verarbeiten sollen. EventBridge fügt eine zusätzliche Ebene hinzu: Statt dass ein Erzeuger explizit an eine bestimmte Warteschlange oder ein bestimmtes Topic sendet, veröffentlicht er ein Ereignis auf einem Event Bus, und EventBridge-Regeln definieren Event-Pattern (Kriterien basierend auf dem tatsächlichen Inhalt des Ereignisses, z. B. Ereignistyp, Quelle, oder bestimmte Attributwerte), die bestimmen, welche Ereignisse an welche Ziele weitergeleitet werden — dies entkoppelt den erzeugenden Dienst vollständig von der Kenntnis, welche Dienste seine Ereignisse tatsächlich konsumieren, was besonders in Organisationen mit vielen unabhängig entwickelten Diensten und Teams relevant ist, bei denen neue Konsumenten für bestehende Ereignistypen hinzugefügt werden sollen, ohne den erzeugenden Dienst selbst zu ändern. Der zentrale methodische Punkt ist, dass ein ausbleibendes Event-Routing bei EventBridge typischerweise nicht auf einen Fehler im erzeugenden Dienst zurückzuführen ist, sondern auf ein fehlerhaft konfiguriertes Event-Pattern in der zuständigen Regel, das die tatsächlich veröffentlichten Ereignisse nicht wie erwartet erfasst — dies erfordert eine gezielte Prüfung des Event-Patterns gegen die tatsächliche Struktur der veröffentlichten Ereignisse, statt anzunehmen, dass der erzeugende Dienst fehlerhaft arbeitet.

~~~text
SQS: producer sends to a SPECIFIC queue, ONE consumer (or competing consumer group) reads/processes it
  -> suited for work distribution, each message processed exactly once by a KNOWN process
SNS: producer sends to a TOPIC, distributed to ALL subscribed targets (multiple queues, functions, endpoints)
  -> suited for broadcast, multiple INDEPENDENT consumers each process the same event separately
EventBridge: ADDITIONAL abstraction layer
  producer publishes to an EVENT BUS (doesn't know/care who consumes it)
  RULES define EVENT PATTERNS (content-based: event type, source, specific attribute values)
    -> determine which events route to which targets
  -> FULLY decouples producer from knowledge of actual consumers
     particularly relevant: many independently-developed services/teams,
     new consumers added WITHOUT changing the producing service
KEY METHODOLOGICAL POINT: missing event routing in EventBridge
  typically NOT a bug in the producing service
  -> a MISCONFIGURED event pattern in the responsible rule that doesn't match the ACTUAL published event structure
  -> requires checking the pattern against the actual event, not assuming the producer is broken
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| SQS | Punkt-zu-Punkt-Warteschlange | geeignet, wenn genau ein bekannter Konsument eine Nachricht verarbeiten soll |
| SNS | Publish/Subscribe-Verteilung | geeignet für Broadcast an mehrere, unabhängige Konsumenten |
| EventBridge-Event-Bus | zentraler Veröffentlichungspunkt für Ereignisse | entkoppelt Erzeuger vollständig von der Kenntnis der Konsumenten |
| Event-Pattern | inhaltsbasierte Routing-Kriterien | falsch konfigurierte Pattern sind eine häufige Ursache für ausbleibendes Routing |

Implementierung: Für Kommunikationsbeziehungen mit bereits bekannten, expliziten Erzeuger-Konsument-Paaren wird SQS (für exklusive Verarbeitung) oder SNS (für Broadcast an bekannte Abonnenten) eingesetzt. Für Ereignisse, die über die Grenzen unabhängig voneinander verantworteter Dienste oder Teams hinweg konsumiert werden sollen, wird EventBridge mit explizit dokumentierten, gegen tatsächliche Ereignisstrukturen getesteten Event-Pattern eingesetzt. Für jeden dieser Dienste werden Fehlerpfade (Dead-Letter-Queues für SQS, Retry-Richtlinien und On-Failure-Ziele für EventBridge und SNS) explizit konfiguriert, um endgültig fehlgeschlagene Ereignisse nachvollziehbar zu erfassen.

## Scalability, Reliability, Security und Observability

AWS-Ereignisarchitekturen skalieren die organisatorische Entkopplung zwischen Diensten proportional zur Nutzung inhaltsbasierten Routings über EventBridge, während direkte Punkt-zu-Punkt-Verbindungen über SQS/SNS für bekannte Beziehungen effizienter bleiben; die Reliability-Grenze liegt darin, dass ein fehlerhaft konfiguriertes Event-Pattern proportional zur Anzahl betroffener, tatsächlich erzeugter Ereignisse zu stillem, unbemerktem Verlust erwarteten Routings führt, wenn keine Überwachung des tatsächlichen Ereignisdurchsatzes existiert.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| erwartete Ereignisse erreichen ein Ziel nicht, obwohl der erzeugende Dienst sie scheinbar korrekt veröffentlicht | das Event-Pattern der zuständigen EventBridge-Regel entspricht nicht der tatsächlichen Struktur der veröffentlichten Ereignisse | das Event-Pattern explizit gegen ein tatsächlich veröffentlichtes, protokolliertes Beispielereignis prüfen |
| mehrere Konsumenten erhalten unerwartet dieselbe Nachricht mehrfach über SQS | mehrere Konsumenten lesen konkurrierend aus derselben Warteschlange, statt dass jede Nachricht von genau einem Konsumenten verarbeitet wird | die Konsumentenkonfiguration und Visibility-Timeout-Einstellungen der Warteschlange prüfen |
| endgültig fehlgeschlagene Ereignisse gehen spurlos verloren | keine Dead-Letter-Queue oder kein On-Failure-Ziel ist für den betroffenen Dienst konfiguriert | eine Dead-Letter-Queue beziehungsweise ein On-Failure-Ziel einrichten |

Security: Event Buses, Warteschlangen und Topics sollten über dedizierte, eng gefasste IAM-Policies abgesichert werden, die nur die tatsächlich berechtigten Erzeuger und Konsumenten zum Veröffentlichen beziehungsweise Lesen berechtigen. Observability: Die tatsächliche Übereinstimmungsrate von Event-Pattern gegen veröffentlichte Ereignisse, die Größe und Wachstumsrate von Dead-Letter-Queues, und die tatsächliche Ende-zu-Ende-Latenz zwischen Ereigniserzeugung und -verarbeitung sind zentrale Metriken zur Bewertung der Ereignisarchitektur.

## Trade-offs und Entscheidungen

**Staff** prüft Event-Pattern explizit gegen tatsächlich veröffentlichte Ereignisstrukturen, bevor ein ausbleibendes Routing dem erzeugenden Dienst zugeschrieben wird. **Principal** macht die Wahl zwischen SQS, SNS und EventBridge für das Team nachvollziehbar. **Chief** legt Ereignisarchitektur-Richtlinien im Unternehmen anhand klarer Diensteigentumsgrenzen fest.

Anti-Patterns: EventBridge für eine Kommunikationsbeziehung mit bereits bekanntem, explizitem Erzeuger-Konsument-Paar einsetzen, wo direktes SQS/SNS einfacher wäre; ein Event-Pattern ohne Prüfung gegen tatsächliche Ereignisstrukturen konfigurieren; Dead-Letter-Queues oder On-Failure-Ziele für keinen der eingesetzten Messaging-Dienste konfigurieren.

## Production Checklist

- [ ] Die Wahl zwischen SQS, SNS und EventBridge ist anhand der tatsächlichen Kommunikationsbeziehung (bekannt versus organisationsübergreifend entkoppelt) begründet.
- [ ] Event-Pattern in EventBridge-Regeln sind gegen tatsächlich veröffentlichte Ereignisstrukturen getestet.
- [ ] Dead-Letter-Queues oder On-Failure-Ziele sind für alle eingesetzten Messaging-Dienste konfiguriert.
- [ ] Die tatsächliche Übereinstimmungsrate von Event-Pattern wird überwacht.

## Interviewfragen

### 1. Was unterscheidet SQS von SNS grundlegend?

**Antwort:** SQS implementiert Punkt-zu-Punkt-Warteschlangen, bei denen eine Nachricht von genau einem Konsumenten verarbeitet wird; SNS implementiert Publish/Subscribe-Verteilung, bei der eine Nachricht an alle abonnierten Ziele verteilt wird.

### 2. Welche zusätzliche Abstraktion bietet EventBridge gegenüber SQS und SNS?

**Antwort:** Inhaltsbasiertes Routing über Event-Pattern, die bestimmen, welche Ereignisse an welche Ziele weitergeleitet werden, wodurch der erzeugende Dienst vollständig von der Kenntnis der tatsächlichen Konsumenten entkoppelt wird.

### 3. Wann ist EventBridge gegenüber direkter SQS-/SNS-Nutzung besonders geeignet?

**Antwort:** Wenn Ereignisse über die Grenzen unabhängig voneinander verantworteter Dienste oder Teams hinweg konsumiert werden sollen und neue Konsumenten hinzugefügt werden können sollen, ohne den erzeugenden Dienst zu ändern.

### 4. Was ist eine häufige Ursache für ausbleibendes Event-Routing in EventBridge?

**Antwort:** Ein fehlerhaft konfiguriertes Event-Pattern in der zuständigen Regel, das die tatsächlich veröffentlichten Ereignisse nicht wie erwartet erfasst, nicht ein Fehler im erzeugenden Dienst.

### 5. Wie gehst du vor, wenn erwartete Ereignisse ein Ziel nicht erreichen, obwohl der erzeugende Dienst sie scheinbar korrekt veröffentlicht?

**Antwort:** Ich prüfe das Event-Pattern der zuständigen EventBridge-Regel explizit gegen ein tatsächlich veröffentlichtes, protokolliertes Beispielereignis, statt einen Fehler im erzeugenden Dienst anzunehmen.

### 6. Widersprüchliche Anforderung: Team will maximale Entkopplung zwischen Diensten (EventBridge für alles) UND einfache, direkte Fehlerdiagnose bei ausbleibenden Nachrichten — wie gehst du vor?

**Antwort:** Ich würde EventBridge gezielt für tatsächlich organisationsübergreifende, entkoppelte Kommunikationsbeziehungen einsetzen, während bekannte, einfache Erzeuger-Konsument-Beziehungen weiterhin über direktes SQS/SNS abgebildet werden, um die Diagnosekomplexität nicht unnötig durch pauschale EventBridge-Nutzung zu erhöhen.

## Praktische Labs

~~~python
# Conceptual EventBridge pattern-matching check (not executed against a real AWS account):

def event_matches_pattern(event, pattern):
    for key, expected_values in pattern.items():
        if event.get(key) not in expected_values:
            return False
    return True

rule_pattern = {"source": ["order-service"], "detail-type": ["OrderCreated", "OrderCancelled"]}

published_event_matching = {"source": "order-service", "detail-type": "OrderCreated"}
published_event_not_matching = {"source": "order-service", "detail-type": "OrderShipped"}  # not in pattern

print(f"Matching event routed: {event_matches_pattern(published_event_matching, rule_pattern)}")
print(f"Non-matching event routed: {event_matches_pattern(published_event_not_matching, rule_pattern)}")
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [Amazon EventBridge — Event Patterns](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html), abgerufen 2026-09-18.
2. AWS-Dokumentation: [Amazon SQS and SNS — Choosing the Right Messaging Service](https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html), abgerufen 2026-09-18.

Amazon SQS und SNS sind kanonisch in [KB-0182](../08-messaging-workflows/06-amazon-sqs-und-sns.md) behandelt; AWS Lambda in [KB-0472](10-aws-lambda.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte EventBridge-Schema-Registry-Funktionen, die automatisch Ereignisschemata aus tatsächlich veröffentlichten Ereignissen ableiten und für Pattern-Validierung nutzbar machen | Evaluating | Gegenüber manuell gepflegten Event-Pattern erst nach Prüfung der tatsächlichen Schema-Erkennungsgenauigkeit bevorzugen. |

Ein Team akzeptiert eine EventBridge-basierte Ereignisarchitektur erst, wenn alle relevanten Event-Pattern nachweislich gegen tatsächlich veröffentlichte Ereignisstrukturen getestet sind und Fehlerpfade für nicht zustellbare Ereignisse konfiguriert sind.
