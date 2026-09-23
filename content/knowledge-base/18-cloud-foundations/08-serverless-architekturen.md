---
{"id": "KB-0448", "title": "Serverless-Architekturen", "domain": "18", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE"], "requires": [{"id": "KB-0113", "concepts": ["Idempotenz"], "needed_for": "understanding"}, {"id": "KB-0445", "concepts": ["Cloud-Compute-Modelle"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine ereignisgesteuerte Serverless-Funktion mit einer erwarteten Ausführungsgrenze (Zeit, Speicher) anhand offizieller Dokumentation implementieren können und den Cold-Start-Effekt erklären.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für einen konkreten Anwendungsfall begründet zwischen einer Serverless-Architektur und einem dauerhaft laufenden Dienst entscheiden, basierend auf Lastmuster, Latenztoleranz und Zustandsverwaltungsbedarf.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Latenzspitze oder Kostenexplosion auf Cold-Start-Effekte beziehungsweise ein unkontrolliertes, ereignisgetriebenes Skalierungsverhalten zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Architekturrichtlinien für den Einsatz von Serverless-Funktionen im Unternehmen anhand tatsächlicher Lastmuster und Kostenrisiken statt anhand pauschaler Modernitätsannahmen festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der Ausführungsumgebung eines spezifischen Serverless-Anbieters im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Ereignisauslösung, Ausführungsgrenzen und Kostenrisiken als Entscheidungsgrundlage, nicht die anbieterspezifische Laufzeitumgebungs-Interna."}}, "lab_validation": [{"lab_id": "KB-0448-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand öffentlich verfügbarer Serverless-Dokumentation, kein aktives Cloud-Konto verwendet", "evidence": "Anhand öffentlich verfügbarer Dokumentation wird nachvollzogen, wie Serverless-Funktionen durch Ereignisse ausgelöst werden, welche Ausführungsgrenzen (maximale Laufzeit, Speicher) typischerweise gelten, warum Cold Starts bei selten aufgerufenen Funktionen zusätzliche Latenz erzeugen, und welche Kostenrisiken bei unkontrolliertem, ereignisgetriebenem Skalierungsverhalten entstehen können.", "limitations": "Kein aktives Cloud-Deployment getestet, keine realen Cold-Start- oder Kostenmessungen erhoben."}]}
---
# Serverless-Architekturen

> **Ziel:** Eine Serverless-Funktion wird durch ein Ereignis ausgelöst (z. B. eine eingehende HTTP-Anfrage, eine neue Nachricht in einer Warteschlange, eine Änderung in einem Datenspeicher), läuft innerhalb definierter Ausführungsgrenzen (maximale Laufzeit, verfügbarer Speicher), und skaliert automatisch mit der Anzahl eingehender Ereignisse, ohne dass der Kunde Server-Instanzen selbst verwalten muss. Der zentrale Punkt dieses Kapitels ist, dass dieses Modell drei praktische Risiken mit sich bringt, die gegen dauerhaft laufende Dienste abgewogen werden müssen — Cold Starts (zusätzliche Latenz beim ersten Aufruf einer selten genutzten Funktion, da eine neue Ausführungsumgebung initialisiert werden muss), Zustandsverwaltung (eine Serverless-Funktion ist zwischen Aufrufen typischerweise zustandslos, was explizite, externe Zustandsspeicherung erfordert, siehe Idempotenz, [KB-0113](../04-verteilte-systeme/06-idempotenz.md)), und Kostenrisiken (die automatische Skalierung mit eingehenden Ereignissen kann bei unerwartet hoher Ereignisrate — z. B. durch einen Fehler in einer aufrufenden Komponente, der zu wiederholten, unkontrollierten Aufrufen führt — zu unerwartet hohen Kosten führen, da die Kostenstruktur direkt an die Ausführungsanzahl gekoppelt ist).

## Zweck, Mental Model und Dependencies

Bei einem dauerhaft laufenden Dienst (z. B. auf einer virtuellen Maschine, siehe Cloud-Compute-Modelle, [KB-0445](05-cloud-compute-modelle.md)) bleibt die Ausführungsumgebung zwischen Anfragen bestehen, wodurch keine wiederholte Initialisierung nötig ist und lokaler, In-Memory-Zustand über mehrere Anfragen hinweg erhalten bleiben kann. Bei einer Serverless-Funktion wird die Ausführungsumgebung hingegen bei Bedarf erzeugt und nach einer gewissen Inaktivitätsphase wieder beendet — wenn eine Funktion nach einer solchen Beendigung erneut aufgerufen wird, muss eine neue Ausführungsumgebung initialisiert werden (Cold Start), was zusätzliche Latenz gegenüber einem "warmen" Aufruf einer bereits initialisierten Umgebung verursacht; bei häufig aufgerufenen Funktionen bleibt die Umgebung meist "warm" und dieser Effekt ist selten spürbar, bei selten aufgerufenen Funktionen kann er jedoch signifikant und für latenzkritische Anwendungsfälle problematisch sein. Da eine Serverless-Funktion zustandslos zwischen Aufrufen ist (kein garantiert erhaltener lokaler Zustand), muss jeder benötigte Zustand explizit in einem externen, persistenten Speicher gehalten werden — dies erfordert insbesondere bei wiederholten oder parallelen Aufrufen, dass die Funktion idempotent implementiert wird (mehrfache Ausführung mit denselben Eingaben führt nicht zu unterschiedlichen oder fehlerhaften Ergebnissen), da das ereignisgetriebene Skalierungsmodell mehrfache, parallele oder wiederholte Aufrufe desselben Ereignisses nicht ausschließt. Der zentrale methodische Punkt ist, dass die automatische, ereignisgetriebene Skalierung — der zentrale Vorteil von Serverless — gleichzeitig das zentrale Kostenrisiko darstellt: Da Kosten direkt an die Anzahl der Ausführungen gekoppelt sind, kann ein Fehler in einer aufrufenden Komponente (z. B. eine fehlerhafte Retry-Logik, die dieselbe Anfrage wiederholt auslöst) zu einer unkontrollierten Vervielfachung der Ausführungen und entsprechend unerwartet hohen Kosten führen, ohne dass eine feste Obergrenze wie bei einem dauerhaft laufenden Dienst mit fester Kapazität automatisch greift.

~~~text
Always-on service (VM, see KB-0445): execution env PERSISTS between requests
  no repeated init, local in-memory state can persist across requests
Serverless function: execution env created ON DEMAND, torn down after inactivity
  re-invocation after teardown -> NEW env must initialize -> COLD START (added latency)
  frequently-called functions: usually stays "warm" -> rarely noticeable
  rarely-called functions: cold start can be significant, problematic for latency-critical use cases
Stateless between invocations: NO guaranteed local state -> explicit EXTERNAL persistent storage needed
  event-driven scaling doesn't exclude duplicate/parallel invocations of the SAME event
  -> function MUST be implemented IDEMPOTENT (see KB-0113)
KEY METHODOLOGICAL POINT: automatic event-driven scaling = the KEY ADVANTAGE
  AND the KEY COST RISK: cost directly tied to invocation count
  -> a bug in a caller (faulty retry logic) -> uncontrolled invocation multiplication
     -> unexpectedly high costs, no automatic fixed ceiling like a fixed-capacity always-on service
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Ereignisauslösung | startet Funktionsausführung bei eingehendem Ereignis | Häufigkeit und Muster der Ereignisse bestimmen Cold-Start-Häufigkeit und Kosten |
| Ausführungsgrenzen | maximale Laufzeit und Speicher pro Ausführung | müssen gegen die tatsächliche Anforderung der Funktion geprüft werden |
| Cold Start | zusätzliche Latenz bei Initialisierung einer neuen Ausführungsumgebung | relevant bei selten aufgerufenen, latenzkritischen Funktionen |
| Zustandslosigkeit | kein garantierter lokaler Zustand zwischen Aufrufen | erfordert externe Zustandsspeicherung und idempotente Implementierung |

Implementierung: Vor dem Einsatz einer Serverless-Funktion für einen latenzkritischen Anwendungsfall wird geprüft, wie häufig die Funktion tatsächlich aufgerufen wird, um den erwarteten Cold-Start-Effekt abzuschätzen — bei seltener Aufrufhäufigkeit und strikten Latenzanforderungen wird ein dauerhaft laufender Dienst oder eine Mindestanzahl vorgewärmter Instanzen (sofern vom Anbieter unterstützt) in Betracht gezogen. Jede Funktion wird idempotent implementiert, um mehrfache oder parallele Ausführung desselben Ereignisses sicher zu handhaben, und benötigter Zustand wird explizit in einem externen, persistenten Speicher gehalten. Für kostensensible Anwendungsfälle werden explizite Obergrenzen für die Ausführungsanzahl oder -rate konfiguriert, um eine unkontrollierte Kostenvervielfachung durch fehlerhafte, wiederholte Aufrufe zu verhindern.

## Scalability, Reliability, Security und Observability

Serverless-Architekturen skalieren die Ausführungskapazität automatisch proportional zur eingehenden Ereignisrate, ohne dass eine manuelle Kapazitätsplanung erforderlich ist; die Reliability-Grenze liegt darin, dass eine nicht idempotent implementierte Funktion proportional zur Häufigkeit mehrfacher oder paralleler Ereignisauslösung zu fehlerhaften, inkonsistenten Ergebnissen führt, und dass eine fehlende Obergrenze für die Ausführungsrate proportional zur Fehlerhäufigkeit aufrufender Komponenten zu unkontrollierten Kosten führen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine selten aufgerufene Funktion zeigt unerwartet hohe Latenz bei einzelnen Aufrufen | ein Cold Start tritt aufgrund der geringen Aufrufhäufigkeit regelmäßig auf | die tatsächliche Aufrufhäufigkeit messen und gegebenenfalls vorgewärmte Instanzen oder eine alternative Architektur evaluieren |
| dieselbe Aktion wird bei einem einzelnen Ereignis mehrfach ausgeführt | die Funktion ist nicht idempotent implementiert und das ereignisgetriebene System löst gelegentlich Mehrfachauslösungen desselben Ereignisses aus | die Funktion auf Idempotenz prüfen und gegebenenfalls eine Deduplizierungslogik ergänzen |
| die Kosten für einen Serverless-Dienst steigen unerwartet stark an | eine fehlerhafte, aufrufende Komponente löst wiederholt, unkontrolliert Ausführungen aus | die Aufrufhistorie auf ungewöhnliche Muster prüfen und eine Obergrenze für die Ausführungsrate konfigurieren |

Security: Da Serverless-Funktionen häufig über IAM-Rollen (siehe [KB-0444](04-cloud-iam-grundarchitektur.md)) mit spezifischen Berechtigungen ausgestattet werden, sollte jede Funktion eine dedizierte, eng gefasste Berechtigungsstruktur erhalten, statt eine breite, gemeinsam genutzte Rolle über mehrere Funktionen hinweg zu verwenden. Observability: Die tatsächliche Ausführungsanzahl, Cold-Start-Häufigkeit, Laufzeit pro Ausführung, und die daraus resultierenden Kosten sind zentrale Metriken zur Bewertung der Serverless-Architektur.

## Trade-offs und Entscheidungen

**Staff** implementiert jede Serverless-Funktion idempotent und prüft den Cold-Start-Effekt gegen die tatsächliche Aufrufhäufigkeit. **Principal** macht die Zustandsverwaltungsstrategie und Kostenrisiken für das Team nachvollziehbar. **Chief** legt Architekturrichtlinien für den Einsatz von Serverless-Funktionen im Unternehmen anhand tatsächlicher Lastmuster und Kostenrisiken fest.

Anti-Patterns: eine Serverless-Funktion für einen latenzkritischen, selten aufgerufenen Anwendungsfall einsetzen, ohne den Cold-Start-Effekt zu prüfen; eine Funktion ohne Idempotenz implementieren und dadurch fehlerhafte Ergebnisse bei Mehrfachauslösung riskieren; Serverless-Funktionen ohne Obergrenze für die Ausführungsrate produktiv einsetzen und dadurch unkontrollierte Kostenrisiken eingehen.

## Production Checklist

- [ ] Der Cold-Start-Effekt wurde gegen die tatsächliche Aufrufhäufigkeit und Latenzanforderung geprüft.
- [ ] Jede Funktion ist idempotent implementiert.
- [ ] Benötigter Zustand wird explizit in einem externen, persistenten Speicher gehalten.
- [ ] Eine Obergrenze für die Ausführungsrate begrenzt das Kostenrisiko bei fehlerhaften, wiederholten Aufrufen.

## Interviewfragen

### 1. Was ist ein Cold Start, und wann tritt er auf?

**Antwort:** Die zusätzliche Latenz beim Aufruf einer Funktion, deren Ausführungsumgebung nach einer Inaktivitätsphase beendet wurde und daher neu initialisiert werden muss; besonders relevant bei selten aufgerufenen Funktionen.

### 2. Warum müssen Serverless-Funktionen idempotent implementiert werden?

**Antwort:** Weil das ereignisgetriebene Skalierungsmodell mehrfache oder parallele Auslösung desselben Ereignisses nicht ausschließt; eine nicht idempotente Implementierung kann bei Mehrfachausführung zu fehlerhaften oder inkonsistenten Ergebnissen führen.

### 3. Worin besteht das zentrale Kostenrisiko von Serverless-Architekturen?

**Antwort:** Kosten sind direkt an die Anzahl der Ausführungen gekoppelt; ein Fehler in einer aufrufenden Komponente kann zu unkontrollierter Vervielfachung der Ausführungen und entsprechend unerwartet hohen Kosten führen, ohne dass eine feste Kapazitätsobergrenze automatisch greift.

### 4. Wie wird Zustand bei einer Serverless-Funktion typischerweise gehalten?

**Antwort:** Explizit in einem externen, persistenten Speicher, da kein garantierter lokaler Zustand zwischen Funktionsaufrufen erhalten bleibt.

### 5. Wie gehst du vor, wenn die Kosten für einen Serverless-Dienst unerwartet stark ansteigen?

**Antwort:** Ich prüfe die Aufrufhistorie auf ungewöhnliche Muster (z. B. eine fehlerhafte, wiederholt auslösende Komponente) und konfiguriere eine Obergrenze für die Ausführungsrate, um das Risiko zukünftig zu begrenzen.

### 6. Widersprüchliche Anforderung: Team will maximale Kosteneffizienz (Serverless für alles) UND garantiert niedrige Latenz für eine selten, aber latenzkritisch aufgerufene Funktion — wie gehst du vor?

**Antwort:** Ich würde für diese spezifische, latenzkritische Funktion entweder vorgewärmte Instanzen (sofern vom Anbieter unterstützt) konfigurieren oder einen dauerhaft laufenden Dienst empfehlen, während Serverless gezielt für Anwendungsfälle mit höherer Latenztoleranz oder häufigerer, gleichmäßigerer Aufrufrate eingesetzt wird.

## Praktische Labs

~~~python
# Conceptual cold-start impact and cost-risk estimation (not executed against a real cloud account):

def estimate_serverless_impact(invocations_per_hour, cold_start_ms, warm_execution_ms, cost_per_invocation):
    # rough approximation: low invocation rate -> higher fraction of cold starts
    cold_start_fraction = max(0.05, min(1.0, 1 / (invocations_per_hour + 1)))
    avg_latency_ms = cold_start_fraction * cold_start_ms + (1 - cold_start_fraction) * warm_execution_ms
    hourly_cost = invocations_per_hour * cost_per_invocation

    return {
        "estimated_cold_start_fraction": round(cold_start_fraction, 3),
        "avg_latency_ms": round(avg_latency_ms, 1),
        "hourly_cost": round(hourly_cost, 4),
    }

rarely_called = estimate_serverless_impact(invocations_per_hour=2, cold_start_ms=800, warm_execution_ms=50, cost_per_invocation=0.0002)
frequently_called = estimate_serverless_impact(invocations_per_hour=5000, cold_start_ms=800, warm_execution_ms=50, cost_per_invocation=0.0002)
runaway_scenario = estimate_serverless_impact(invocations_per_hour=500000, cold_start_ms=800, warm_execution_ms=50, cost_per_invocation=0.0002)

print(f"Rarely called: {rarely_called}")
print(f"Frequently called: {frequently_called}")
print(f"Runaway/misconfigured caller scenario: {runaway_scenario}")
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [AWS Lambda — Function Execution Environment and Cold Starts](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html), abgerufen 2026-09-18.
2. Google Cloud-Dokumentation: [Cloud Run — Container Runtime Contract](https://cloud.google.com/run/docs/container-contract), abgerufen 2026-09-18.

Idempotenz ist kanonisch in [KB-0113](../04-verteilte-systeme/06-idempotenz.md) behandelt; Cloud-Compute-Modelle in [KB-0445](05-cloud-compute-modelle.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte Snapshot-basierte Techniken zur Reduktion von Cold-Start-Latenz bei großen Ausführungsumgebungen | Evaluating | Gegenüber Standard-Cold-Start-Verhalten bevorzugen, sobald die tatsächliche Latenzreduktion für die eigene Funktionsgröße geprüft ist. |

Ein Team akzeptiert den produktiven Einsatz einer Serverless-Funktion erst, wenn Cold-Start-Effekt, Idempotenz-Implementierung und eine Obergrenze für die Ausführungsrate nachweislich geprüft und konfiguriert sind.
