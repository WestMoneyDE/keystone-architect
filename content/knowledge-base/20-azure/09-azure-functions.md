---
{"id": "KB-0489", "title": "Azure Functions", "domain": "20", "sequence": 9, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI", "ENTERPRISE"], "requires": [{"id": "KB-0472", "concepts": ["AWS Lambda"], "needed_for": "understanding"}, {"id": "KB-0113", "concepts": ["Idempotenz"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Azure Function mit einem konkreten Trigger und Binding anhand offizieller Dokumentation konfigurieren können und die Unterschiede zwischen den verfügbaren Hostingplänen (Consumption, Premium, Dedicated) erklären.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für einen asynchronen Unternehmensprozess eine Azure-Functions-Architektur gestalten, die den passenden Hostingplan für das tatsächliche Lastprofil wählt und Retry-Semantik sowie Laufzeitgrenzen explizit gegen die Prozessanforderungen prüft.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete, mehrfache Verarbeitung eines Ereignisses auf das dokumentierte Retry-Verhalten eines bestimmten Trigger-Typs zurückführen können, analog zur AWS-Lambda-Idempotenz-Anforderung.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Serverless-Funktionsrichtlinien im Unternehmen anhand konsequenter Idempotenz-Anforderungen und bewusster Hostingplan-Wahl statt anhand impliziter Annahmen über Ausführungsgarantien festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der Azure-Functions-Ausführungsumgebung im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Triggern, Bindings, Hostingplänen und Retry-Semantik als Entscheidungsgrundlage, nicht die Ausführungsumgebungs-Interna."}}, "lab_validation": [{"lab_id": "KB-0489-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Azure-Functions-Dokumentation, kein aktives Azure-Konto verwendet", "evidence": "Anhand offizieller Microsoft-Dokumentation wird nachvollzogen, wie Trigger eine Funktionsausführung auslösen und Bindings die Verbindung zu Ein-/Ausgabedatenquellen deklarativ herstellen, wie sich die Hostingpläne (Consumption: reine Pay-per-Execution mit Cold Starts; Premium: vorgewärmte Instanzen; Dedicated: feste, dauerhafte Kapazität) in Kosten und Kaltstartverhalten unterscheiden, und warum je nach Trigger-Typ unterschiedliches, dokumentiertes Retry-Verhalten eine Idempotenz-Anforderung analog zu AWS Lambda (siehe KB-0472) erzeugt.", "limitations": "Kein aktives Azure-Konto verwendet, keine reale Azure-Functions-Konfiguration erstellt."}]}
---
# Azure Functions

> **Ziel:** Azure Functions ist Azures Serverless-Funktionsdienst, konzeptionell strukturell vergleichbar mit AWS Lambda (siehe [KB-0472](../19-aws/10-aws-lambda.md)) — ein Trigger löst die Funktionsausführung aus (z. B. eine HTTP-Anfrage, eine neue Nachricht in einer Warteschlange, ein Zeitplan), während Bindings deklarativ die Verbindung zu Ein- und Ausgabedatenquellen herstellen, ohne dass der Funktionscode selbst die Verbindungslogik implementieren muss. Der zentrale Punkt dieses Kapitels ist, dass die Wahl des Hostingplans (Consumption: reine Pay-per-Execution-Abrechnung mit potenziellen Cold Starts bei seltener Nutzung; Premium: vorgewärmte Instanzen zur Vermeidung von Cold Starts, höhere laufende Kosten; Dedicated: feste, dauerhaft zugewiesene Kapazität) explizit gegen das tatsächliche Lastprofil und die Latenzanforderungen des jeweiligen asynchronen Prozesses geprüft werden muss, und dass — analog zu AWS Lambda — nahezu jede Azure Function mit beobachtbarem Effekt idempotent implementiert werden muss, da das dokumentierte Retry-Verhalten unterschiedlicher Trigger-Typen eine mehrfache Ausführung mit demselben Ereignis unter bestimmten Umständen zulässt.

## Zweck, Mental Model und Dependencies

Ein Trigger bestimmt, wodurch eine Azure Function ausgeführt wird (z. B. ein HTTP-Trigger für synchrone Web-Anfragen, ein Queue-Trigger für asynchrone Nachrichtenverarbeitung, ein Timer-Trigger für zeitgesteuerte Ausführung), während Bindings die tatsächliche Datenverbindung deklarativ definieren (z. B. eine automatische Verbindung zu einer Datenbank oder einem Speicherkonto, ohne dass der Funktionscode selbst die Verbindungsaufbau-Logik implementieren muss) — diese Trennung reduziert Boilerplate-Code erheblich gegenüber einer manuellen Implementierung jeder Datenverbindung. Der Consumption-Hostingplan berechnet Kosten strikt nach tatsächlicher Ausführungszeit und -anzahl, wobei Funktionsinstanzen bei Inaktivität vollständig herunterskaliert werden, was bei seltener Nutzung zu Cold Starts (zusätzliche Latenz bei Initialisierung einer neuen Instanz) führt — analog zur allgemeinen Serverless-Problematik (siehe [KB-0448](../18-cloud-foundations/08-serverless-architekturen.md)). Der Premium-Plan hält eine konfigurierbare Anzahl vorgewärmter Instanzen bereit, um Cold Starts für latenzkritische Funktionen zu vermeiden, zu entsprechend höheren, kontinuierlichen Kosten. Der Dedicated-Plan (App Service Plan) betreibt Funktionen auf dauerhaft zugewiesener, nicht mit anderen Kunden geteilter Kapazität, was bei bereits vorhandener, ungenutzter App-Service-Kapazität kosteneffizient sein kann. Wie bei AWS Lambda (siehe [KB-0472](../19-aws/10-aws-lambda.md)) zeigen unterschiedliche Trigger-Typen unterschiedliches, dokumentiertes Retry-Verhalten bei Fehlern — ein Queue-Trigger kann eine Nachricht bei einem Verarbeitungsfehler erneut zustellen, was bedeutet, dass eine Funktion, die eine nicht rückgängig machbare Aktion (z. B. eine Datenbankänderung) ausführt, idempotent implementiert werden muss, um eine mehrfache, fehlerhafte Ausführung bei einem solchen Retry zu vermeiden. Der zentrale methodische Punkt ist, dass die Wahl des Hostingplans keine reine Kostenentscheidung ist, sondern explizit gegen die tatsächlichen Latenzanforderungen des jeweiligen Prozesses abgewogen werden muss — ein latenzkritischer, aber selten aufgerufener Prozess benötigt möglicherweise den Premium-Plan trotz höherer Kosten, während ein unkritischer, aber häufig aufgerufener Prozess mit dem kostengünstigeren Consumption-Plan gut bedient sein kann.

~~~text
Trigger: WHAT invokes the function (HTTP, Queue message, Timer schedule)
Bindings: DECLARATIVE data connections (input/output) -- no manual connection-setup code needed
Hosting plans:
  Consumption: STRICT pay-per-execution, scales to ZERO on inactivity -> COLD STARTS possible (see KB-0448)
  Premium: pre-warmed instances -> AVOIDS cold starts, higher ONGOING cost
  Dedicated (App Service Plan): fixed, non-shared capacity -- cost-efficient if unused App Service capacity exists
Like AWS Lambda (see KB-0472): DIFFERENT trigger types -> DIFFERENT documented retry behavior on failure
  Queue trigger CAN redeliver a message on processing failure
  -> function with an IRREVERSIBLE effect (DB write) MUST be idempotent
KEY METHODOLOGICAL POINT: hosting plan choice is NOT a pure cost decision
  -> must be explicitly weighed against ACTUAL latency requirements of the specific process
     latency-critical but rarely-invoked process -> Premium plan may be needed DESPITE higher cost
     non-critical but frequently-invoked process -> Consumption plan often sufficient
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Trigger | löst Funktionsausführung aus | Retry-Verhalten unterscheidet sich je nach Trigger-Typ |
| Binding | deklarative Ein-/Ausgabedatenverbindung | reduziert Boilerplate-Code gegenüber manueller Verbindungslogik |
| Consumption-Plan | reine Pay-per-Execution, potenzielle Cold Starts | geeignet für unkritische, unregelmäßig aufgerufene Funktionen |
| Premium/Dedicated-Plan | vermeidet Cold Starts, höhere laufende Kosten | geeignet für latenzkritische, kontinuierlich benötigte Funktionen |

Implementierung: Für jeden asynchronen Unternehmensprozess wird zunächst das tatsächliche Lastprofil (Aufrufhäufigkeit) und die Latenzanforderung geprüft, um den passenden Hostingplan (Consumption, Premium, Dedicated) zu wählen, statt pauschal den kostengünstigsten Plan zu verwenden. Jede Funktion mit beobachtbarem, nicht rückgängig machbarem Effekt wird idempotent implementiert, basierend auf einer expliziten Prüfung des dokumentierten Retry-Verhaltens des jeweils genutzten Trigger-Typs. Bindings werden für Standarddatenverbindungen genutzt, um Boilerplate-Code zu vermeiden, wobei bei komplexeren, nicht durch Standard-Bindings abgedeckten Anforderungen explizite Verbindungslogik implementiert wird.

## Scalability, Reliability, Security und Observability

Azure Functions skaliert die Verarbeitungskapazität automatisch proportional zur eingehenden Ereignisrate innerhalb der Grenzen des gewählten Hostingplans; die Reliability-Grenze liegt darin, dass eine nicht idempotent implementierte Funktion proportional zur Häufigkeit von Retry-Ereignissen (die ein normaler, dokumentierter Bestandteil des Ausführungsmodells sind) zu fehlerhaften, mehrfach ausgeführten Effekten führt, analog zu AWS Lambda.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Ereignis wird unerwartet mehrfach mit sichtbarem, wiederholtem Effekt verarbeitet | die Funktion ist nicht idempotent implementiert, und ein normales Retry des jeweiligen Trigger-Typs hat zu einer erneuten Ausführung geführt | eine Idempotenzprüfung basierend auf einem eindeutigen Ereignisschlüssel implementieren |
| eine latenzkritische Funktion zeigt regelmäßig hohe Latenz bei seltenen Aufrufen | die Funktion nutzt den Consumption-Plan, obwohl Cold Starts für diesen Anwendungsfall nicht tolerierbar sind | einen Wechsel zum Premium-Plan mit vorgewärmten Instanzen evaluieren |
| die Kosten für einen unkritischen, seltenen Prozess sind höher als erwartet | der Prozess läuft auf dem Premium- statt dem kostengünstigeren Consumption-Plan, ohne tatsächlichen Latenzbedarf | die tatsächliche Latenzanforderung des Prozesses neu bewerten und gegebenenfalls auf Consumption umstellen |

Security: Azure Functions sollten über dedizierte, eng gefasste Managed Identities (siehe [KB-0482](02-entra-tenant-design-fuer-azure.md)) für den Zugriff auf andere Azure-Ressourcen konfiguriert werden, statt dauerhafter Zugangsschlüssel. Observability: Die tatsächliche Retry-Häufigkeit, die Verteilung zwischen Cold- und Warm-Start-Ausführungen, und die tatsächliche Kostenverteilung über die verschiedenen Hostingpläne sind zentrale Metriken zur Bewertung der Azure-Functions-Architektur.

## Trade-offs und Entscheidungen

**Staff** implementiert jede Funktion mit beobachtbarem Effekt idempotent und wählt den Hostingplan anhand tatsächlicher Latenzanforderungen. **Principal** macht die Trigger-spezifische Retry-Semantik und Hostingplan-Wahl für das Team nachvollziehbar. **Chief** legt Serverless-Funktionsrichtlinien im Unternehmen anhand konsequenter Idempotenz-Anforderungen fest.

Anti-Patterns: eine Funktion mit beobachtbarem, nicht rückgängig machbarem Effekt ohne Idempotenzprüfung implementieren; den Hostingplan ausschließlich nach Kostenaspekten wählen, ohne die tatsächliche Latenzanforderung zu prüfen; Bindings für komplexe, nicht standardmäßig abgedeckte Anforderungen erzwingen, statt explizite Verbindungslogik zu implementieren.

## Production Checklist

- [ ] Jede Azure Function mit beobachtbarem Effekt ist idempotent implementiert.
- [ ] Der Hostingplan ist anhand des tatsächlichen Lastprofils und der Latenzanforderungen gewählt.
- [ ] Managed Identities werden für den Zugriff auf andere Azure-Ressourcen genutzt.
- [ ] Die tatsächliche Retry-Häufigkeit und Cold-Start-Verteilung wird überwacht.

## Interviewfragen

### 1. Was ist der Unterschied zwischen einem Trigger und einem Binding in Azure Functions?

**Antwort:** Ein Trigger löst die Funktionsausführung aus; ein Binding stellt deklarativ eine Verbindung zu Ein- oder Ausgabedatenquellen her, ohne dass der Funktionscode die Verbindungslogik selbst implementieren muss.

### 2. Worin unterscheiden sich Consumption-, Premium- und Dedicated-Hostingplan?

**Antwort:** Consumption berechnet strikt nach Ausführung mit möglichen Cold Starts; Premium hält vorgewärmte Instanzen zur Cold-Start-Vermeidung bereit, zu höheren Kosten; Dedicated nutzt feste, dauerhaft zugewiesene Kapazität.

### 3. Warum muss eine Azure Function mit beobachtbarem Effekt praktisch immer idempotent implementiert werden?

**Antwort:** Weil unterschiedliche Trigger-Typen dokumentiertes Retry-Verhalten zeigen, das dieselbe Funktion unter bestimmten Umständen mehrfach mit demselben Ereignis aufrufen kann, analog zu AWS Lambda.

### 4. Warum ist die Wahl des Hostingplans keine reine Kostenentscheidung?

**Antwort:** Weil sie explizit gegen die tatsächlichen Latenzanforderungen des jeweiligen Prozesses abgewogen werden muss — ein latenzkritischer, seltener Prozess benötigt trotz höherer Kosten möglicherweise den Premium-Plan.

### 5. Wie gehst du vor, wenn ein Ereignis unerwartet mehrfach mit sichtbarem, wiederholtem Effekt verarbeitet wird?

**Antwort:** Ich prüfe, ob die Funktion idempotent implementiert ist, da ein normales Retry-Verhalten des jeweiligen Trigger-Typs eine plausible, dokumentierte Erklärung für eine mehrfache Ausführung ist.

### 6. Widersprüchliche Anforderung: Team will maximale Kosteneinsparung (Consumption-Plan für alles) UND garantiert niedrige Latenz für eine kritische, selten aufgerufene Funktion — wie gehst du vor?

**Antwort:** Ich würde für diese spezifische, latenzkritische Funktion den Premium-Plan mit vorgewärmten Instanzen empfehlen, während andere, unkritische Funktionen weiterhin auf dem kostengünstigeren Consumption-Plan verbleiben, statt eine pauschale Plan-Wahl für alle Funktionen zu treffen.

## Praktische Labs

~~~python
# Conceptual hosting plan recommendation based on latency sensitivity and call frequency (not executed against a real Azure account):

def recommend_hosting_plan(latency_critical, call_frequency):
    if latency_critical and call_frequency == "low":
        return "Premium (avoid cold starts for critical, rarely-called function)"
    if call_frequency == "high":
        return "Consumption (frequent calls keep instances warm naturally)"
    return "Consumption (default, cost-efficient for non-critical, infrequent calls)"

functions = {
    "payment_webhook": {"latency_critical": True, "call_frequency": "low"},
    "log_processor": {"latency_critical": False, "call_frequency": "high"},
    "nightly_report": {"latency_critical": False, "call_frequency": "low"},
}

for name, attrs in functions.items():
    print(f"{name}: {recommend_hosting_plan(**attrs)}")
~~~

## Dependencies, Cross-References und Quellen

1. Microsoft-Dokumentation: [Azure Functions — Hosting Options](https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale), abgerufen 2026-09-18.
2. Microsoft-Dokumentation: [Azure Functions — Triggers and Bindings Concepts](https://learn.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings), abgerufen 2026-09-18.

AWS Lambda ist kanonisch in [KB-0472](../19-aws/10-aws-lambda.md) behandelt; Idempotenz in [KB-0113](../04-verteilte-systeme/06-idempotenz.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte Flex-Consumption-Hostingpläne, die Elemente von Consumption- und Premium-Plänen kombinieren (skalierbar, aber mit konfigurierbarer Mindestinstanzanzahl gegen Cold Starts) | Evaluating | Gegenüber klassischen Consumption- oder Premium-Plänen erst nach Prüfung der tatsächlichen Kosten-/Latenz-Balance für die eigene Workload bevorzugen. |

Ein Team akzeptiert eine Azure-Functions-Architektur erst, wenn Idempotenz für Funktionen mit beobachtbarem Effekt nachgewiesen und der Hostingplan nachweislich gegen die tatsächlichen Latenzanforderungen gewählt ist.
