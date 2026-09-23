---
{"id": "KB-0472", "title": "AWS Lambda", "domain": "19", "sequence": 10, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0448", "concepts": ["Serverless-Architekturen"], "needed_for": "understanding"}, {"id": "KB-0113", "concepts": ["Idempotenz"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Lambda-Funktion mit einem konkreten Trigger (z. B. eine Warteschlange) und einer expliziten Concurrency-Grenze anhand offizieller Dokumentation konfigurieren können und das Retry-Verhalten bei unterschiedlichen Trigger-Typen erklären.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete, ereignisgesteuerte Anwendung eine Lambda-Architektur gestalten, die Retry-Semantik, Concurrency-Grenzen und Zustandsübergabe zwischen Funktionsaufrufen explizit und idempotent handhabt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete, mehrfache Verarbeitung eines Ereignisses auf das Retry-Verhalten eines bestimmten Trigger-Typs zurückführen können, statt einen Fehler in der Funktionslogik anzunehmen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Serverless-Funktionsrichtlinien im Unternehmen anhand konsequenter Idempotenz-Anforderungen und expliziter Concurrency-Planung statt anhand impliziter Annahmen über Ausführungsgarantien festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der Lambda-Ausführungsumgebung (Firecracker-MicroVMs) im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Triggern, Concurrency, Retry-Semantik und Idempotenz-Anforderungen als Entscheidungsgrundlage, nicht die MicroVM-Interna."}}, "lab_validation": [{"lab_id": "KB-0472-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller AWS-Lambda-Dokumentation, kein aktives AWS-Konto verwendet", "evidence": "Anhand offizieller AWS-Dokumentation wird nachvollzogen, wie unterschiedliche Trigger-Typen (synchron wie API Gateway, asynchron wie S3-Ereignisse, poll-basiert wie SQS) jeweils unterschiedliches Retry-Verhalten bei Fehlern zeigen, wie Concurrency-Grenzen die Anzahl gleichzeitig laufender Funktionsinstanzen begrenzen, und warum daraus eine zwingende Anforderung an idempotente Funktionsimplementierung folgt.", "limitations": "Kein aktives AWS-Konto verwendet, keine reale Lambda-Funktion erstellt."}]}
---
# AWS Lambda

> **Ziel:** AWS Lambda ist AWS' Serverless-Funktionsdienst (siehe Serverless-Architekturen, [KB-0448](../18-cloud-foundations/08-serverless-architekturen.md)), bei dem unterschiedliche Trigger-Typen (synchrone Aufrufe wie über API Gateway, asynchrone Ereignisse wie S3-Objekterstellung, oder poll-basierte Quellen wie SQS-Warteschlangen) jeweils fundamental unterschiedliches Retry-Verhalten bei Fehlern zeigen. Der zentrale Punkt dieses Kapitels ist, dass eine Lambda-Funktion praktisch immer idempotent implementiert werden muss (siehe [KB-0113](../04-verteilte-systeme/06-idempotenz.md)), da nahezu jeder Trigger-Typ unter bestimmten Umständen dieselbe Funktion mehrfach mit demselben Ereignis aufrufen kann — dies ist keine seltene Ausnahme, sondern ein grundlegendes, dokumentiertes Verhalten des zugrunde liegenden Ausführungsmodells, weshalb eine unerwartete, mehrfache Verarbeitung eines Ereignisses typischerweise nicht auf einen Fehler in der Funktionslogik selbst hindeutet, sondern auf eine fehlende Idempotenz-Behandlung angesichts des normalen, dokumentierten Retry-Verhaltens.

## Zweck, Mental Model und Dependencies

Bei einem synchronen Trigger (z. B. über API Gateway) wartet der aufrufende Client direkt auf die Antwort der Lambda-Funktion — bei einem Fehler liegt die Entscheidung über eine Wiederholung typischerweise beim aufrufenden Client selbst, nicht bei Lambda. Bei einem asynchronen Trigger (z. B. S3-Ereignisse, SNS-Benachrichtigungen) übernimmt Lambda selbst die Retry-Logik: Bei einem Fehler wird die Funktion automatisch erneut aufgerufen, mit einer konfigurierbaren maximalen Anzahl an Wiederholungsversuchen, bevor das Ereignis (sofern konfiguriert) an eine Dead-Letter-Queue oder ein On-Failure-Ziel weitergeleitet wird. Bei einem poll-basierten Trigger (z. B. SQS-Warteschlangen, DynamoDB Streams) liest Lambda kontinuierlich Nachrichten aus der Quelle und verarbeitet sie in Batches — bei einem Fehler innerhalb eines Batches kann je nach Konfiguration der gesamte Batch oder nur die fehlgeschlagenen Elemente erneut verarbeitet werden, wobei eine Nachricht durch dieses Verhalten potenziell mehrfach an die Funktion übergeben werden kann, selbst wenn ein Teil der Verarbeitung bereits erfolgreich abgeschlossen wurde, bevor der Fehler auftrat. Zusätzlich begrenzt eine Concurrency-Grenze (entweder eine reservierte, garantierte Kapazität für eine bestimmte Funktion, oder eine gemeinsam genutzte Kontokapazität über alle Funktionen hinweg) die Anzahl gleichzeitig laufender Funktionsinstanzen — bei poll-basierten Triggern kann eine erreichte Concurrency-Grenze dazu führen, dass Nachrichten in der Quelle länger als erwartet auf Verarbeitung warten, was bei zeitkritischen Anwendungsfällen relevant werden kann. Der zentrale methodische Punkt ist, dass diese Retry-Mechanismen ein integraler, dokumentierter Bestandteil des Lambda-Ausführungsmodells sind, nicht ein seltener Ausnahmefall — jede Lambda-Funktion, die eine Aktion mit einem beobachtbaren, nicht rückgängig machbaren Effekt ausführt (z. B. eine Datenbankänderung, eine ausgehende Benachrichtigung), muss daher so implementiert werden, dass eine mehrfache Ausführung mit denselben Eingaben nicht zu einem fehlerhaften oder unerwünscht wiederholten Effekt führt, üblicherweise durch die Verwendung eines eindeutigen Idempotenzschlüssels, der bereits verarbeitete Ereignisse erkennt und erneut identische Verarbeitung überspringt.

~~~text
Sync trigger (API Gateway): CALLER waits for response, retry decision typically with the CALLER, not Lambda
Async trigger (S3, SNS): Lambda itself retries automatically on failure (configurable max attempts)
  -> then, if configured, routed to Dead-Letter Queue / on-failure destination
Poll-based trigger (SQS, DynamoDB Streams): Lambda reads/processes messages in BATCHES
  on failure within a batch: whole batch OR just failed items re-processed (config-dependent)
  -> a message CAN be delivered MULTIPLE times, even if part of processing already succeeded
     before the error occurred
Concurrency limit: caps how many function instances run simultaneously
  reached limit + poll-based trigger -> messages wait LONGER than expected in the source
KEY METHODOLOGICAL POINT: these retry mechanisms are an INTEGRAL, DOCUMENTED part of the execution model
  NOT a rare edge case -- ANY function with an observable, irreversible effect (DB write, outbound notification)
  MUST be idempotent -- typically via a unique idempotency key that detects already-processed events
     and skips redundant identical processing
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Synchroner Trigger | Client wartet direkt auf Antwort | Retry-Entscheidung liegt typischerweise beim aufrufenden Client |
| Asynchroner Trigger | Lambda übernimmt automatische Retry-Logik | konfigurierbare maximale Wiederholungsversuche, Dead-Letter-Queue |
| Poll-basierter Trigger | Batch-Verarbeitung aus einer Quelle | mehrfache Nachrichtenverarbeitung bei Batch-Fehlern möglich |
| Concurrency-Grenze | begrenzt gleichzeitig laufende Instanzen | kann bei poll-basierten Triggern zu Verarbeitungsverzögerung führen |

Implementierung: Jede Lambda-Funktion mit einem beobachtbaren, nicht rückgängig machbaren Effekt wird idempotent implementiert, indem ein eindeutiger Idempotenzschlüssel aus dem Ereignis extrahiert und gegen bereits verarbeitete Schlüssel geprüft wird, bevor die eigentliche Verarbeitung durchgeführt wird. Für asynchrone und poll-basierte Trigger wird die maximale Anzahl an Wiederholungsversuchen sowie das Verhalten bei endgültigem Fehlschlag (Dead-Letter-Queue, On-Failure-Ziel) explizit konfiguriert, statt sich auf Standardwerte zu verlassen, ohne deren tatsächliche Eignung für den Anwendungsfall zu prüfen. Concurrency-Grenzen werden explizit gegen die tatsächliche, erwartete Ereignisrate dimensioniert, um sowohl unnötige Kosten (zu großzügige, reservierte Kapazität) als auch Verarbeitungsverzögerungen (zu knapp bemessene Kapazität) zu vermeiden.

## Scalability, Reliability, Security und Observability

AWS Lambda skaliert die Verarbeitungskapazität automatisch proportional zur eingehenden Ereignisrate innerhalb der konfigurierten Concurrency-Grenzen; die Reliability-Grenze liegt darin, dass eine nicht idempotent implementierte Funktion proportional zur Häufigkeit von Retry-Ereignissen (die ein normaler, dokumentierter Bestandteil des Ausführungsmodells sind) zu fehlerhaften, mehrfach ausgeführten Effekten führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Ereignis wird unerwartet mehrfach mit sichtbarem, wiederholtem Effekt verarbeitet | die Funktion ist nicht idempotent implementiert, und ein normales Retry des jeweiligen Trigger-Typs hat zu einer erneuten Ausführung geführt | eine Idempotenzprüfung basierend auf einem eindeutigen Ereignisschlüssel implementieren |
| Nachrichten in einer SQS-Warteschlange warten länger als erwartet auf Verarbeitung | die konfigurierte Concurrency-Grenze der Lambda-Funktion ist für die tatsächliche Ereignisrate zu niedrig dimensioniert | die Concurrency-Grenze gegen die tatsächliche, gemessene Ereignisrate neu dimensionieren |
| fehlgeschlagene Ereignisse gehen scheinbar spurlos verloren | keine Dead-Letter-Queue oder kein On-Failure-Ziel wurde für den asynchronen Trigger konfiguriert | eine Dead-Letter-Queue konfigurieren, um endgültig fehlgeschlagene Ereignisse nachvollziehbar zu erfassen |

Security: Lambda-Funktionen sollten über dedizierte, eng gefasste IAM-Rollen (siehe [KB-0464](02-aws-iam-und-rollenmodell.md)) verfügen, die nur die tatsächlich benötigten Berechtigungen für die jeweilige Funktion enthalten. Observability: Die tatsächliche Retry-Häufigkeit, die Größe und Wachstumsrate von Dead-Letter-Queues, und die tatsächliche Concurrency-Auslastung relativ zur konfigurierten Grenze sind zentrale Metriken zur Bewertung der Lambda-Architektur.

## Trade-offs und Entscheidungen

**Staff** implementiert jede Lambda-Funktion mit beobachtbarem Effekt idempotent, unabhängig vom Trigger-Typ. **Principal** macht die Retry-Semantik jedes Trigger-Typs und deren Konsequenzen für das Team nachvollziehbar. **Chief** legt Serverless-Funktionsrichtlinien im Unternehmen anhand konsequenter Idempotenz-Anforderungen fest.

Anti-Patterns: eine Lambda-Funktion mit beobachtbarem, nicht rückgängig machbarem Effekt ohne Idempotenzprüfung implementieren; Concurrency-Grenzen ohne Bezug zur tatsächlichen Ereignisrate konfigurieren; asynchrone Trigger ohne Dead-Letter-Queue oder On-Failure-Ziel betreiben und dadurch endgültig fehlgeschlagene Ereignisse spurlos verlieren.

## Production Checklist

- [ ] Jede Lambda-Funktion mit beobachtbarem Effekt ist idempotent implementiert.
- [ ] Retry-Verhalten und maximale Wiederholungsversuche sind für jeden Trigger-Typ explizit konfiguriert.
- [ ] Eine Dead-Letter-Queue oder ein On-Failure-Ziel erfasst endgültig fehlgeschlagene Ereignisse.
- [ ] Concurrency-Grenzen sind gegen die tatsächliche, gemessene Ereignisrate dimensioniert.

## Interviewfragen

### 1. Warum muss eine AWS-Lambda-Funktion praktisch immer idempotent implementiert werden?

**Antwort:** Weil nahezu jeder Trigger-Typ (asynchron, poll-basiert) unter bestimmten, dokumentierten Umständen dieselbe Funktion mehrfach mit demselben Ereignis aufrufen kann, was bei nicht-idempotenter Implementierung zu fehlerhaften, wiederholten Effekten führt.

### 2. Wie unterscheidet sich das Retry-Verhalten bei synchronen, asynchronen und poll-basierten Triggern?

**Antwort:** Bei synchronen Triggern liegt die Retry-Entscheidung typischerweise beim aufrufenden Client; bei asynchronen Triggern übernimmt Lambda selbst automatische Wiederholungsversuche; bei poll-basierten Triggern kann ein Batch-Fehler zur erneuten Verarbeitung ganzer Batches oder einzelner Elemente führen.

### 3. Was ist eine Dead-Letter-Queue, und wofür wird sie genutzt?

**Antwort:** Ein Ziel, an das endgültig fehlgeschlagene Ereignisse (nach Ausschöpfung der konfigurierten Wiederholungsversuche) weitergeleitet werden, um sie nachvollziehbar zu erfassen statt sie spurlos zu verlieren.

### 4. Welche Auswirkung kann eine zu niedrig dimensionierte Concurrency-Grenze bei einem poll-basierten Trigger haben?

**Antwort:** Nachrichten in der Quelle (z. B. SQS-Warteschlange) warten länger als erwartet auf Verarbeitung, da nicht ausreichend gleichzeitige Funktionsinstanzen zur Verfügung stehen.

### 5. Wie gehst du vor, wenn ein Ereignis unerwartet mehrfach mit sichtbarem, wiederholtem Effekt verarbeitet wird?

**Antwort:** Ich prüfe, ob die Funktion idempotent implementiert ist, da ein normales Retry-Verhalten des jeweiligen Trigger-Typs eine plausible, dokumentierte Erklärung für eine mehrfache Ausführung ist, und implementiere eine Idempotenzprüfung basierend auf einem eindeutigen Ereignisschlüssel.

### 6. Widersprüchliche Anforderung: Team will maximale Verarbeitungsgeschwindigkeit (keine Idempotenzprüfung, da diese Overhead bedeutet) UND garantiert korrekte, nicht doppelt ausgeführte Effekte — wie gehst du vor?

**Antwort:** Ich würde erklären, dass die Idempotenzprüfung angesichts des dokumentierten Retry-Verhaltens von Lambda keine optionale Optimierung, sondern eine notwendige Korrektheitsanforderung ist, und eine effiziente, leichtgewichtige Idempotenzprüfung (z. B. über einen schnellen Key-Value-Speicher) vorschlagen, die den Geschwindigkeitsoverhead minimiert, ohne auf Korrektheit zu verzichten.

## Praktische Labs

~~~python
# Conceptual idempotency check for a Lambda-style handler (not executed against a real Lambda function):

processed_event_ids = set()  # in reality: an external, persistent store (e.g. DynamoDB)

def handle_event(event_id, payload):
    if event_id in processed_event_ids:
        return {"status": "skipped_duplicate", "event_id": event_id}
    # actual processing logic would run here
    processed_event_ids.add(event_id)
    return {"status": "processed", "event_id": event_id}

# Simulating a Lambda retry delivering the SAME event twice
first_call = handle_event("evt-123", {"amount": 50})
retry_call = handle_event("evt-123", {"amount": 50})  # duplicate delivery due to retry

print(f"First call: {first_call}")
print(f"Retry call: {retry_call}")
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [AWS Lambda — Retry Behavior](https://docs.aws.amazon.com/lambda/latest/dg/invocation-retries.html), abgerufen 2026-09-18.
2. AWS-Dokumentation: [AWS Lambda — Concurrency and Scaling](https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html), abgerufen 2026-09-18.

Serverless-Architekturen sind kanonisch in [KB-0448](../18-cloud-foundations/08-serverless-architekturen.md) behandelt; Idempotenz in [KB-0113](../04-verteilte-systeme/06-idempotenz.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, native Idempotenz-Unterstützung in AWS-Lambda-Powertools-Bibliotheken, die Idempotenzprüfung deklarativ statt manuell implementierbar macht | Adopting | Gegenüber manueller Idempotenzimplementierung bevorzugen, sobald die Integration für die eigene Laufzeitumgebung geprüft ist. |

Ein Team akzeptiert eine Lambda-Funktion mit beobachtbarem Effekt erst, wenn deren Idempotenz nachweislich implementiert und gegen das tatsächliche Retry-Verhalten des jeweiligen Trigger-Typs getestet ist.
