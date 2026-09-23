---
{"id": "KB-0257", "title": "GenAI in Unternehmensprozessen", "domain": "11", "sequence": 17, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0247", "concepts": ["Function Calling"], "needed_for": "understanding"}, {"id": "KB-0253", "concepts": ["Fallback und Abstention"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Modell für explizite Verantwortungsübergabe zwischen AI-Schritt und deterministischem Prozessschritt lokal implementieren.", "rationale": "Der Übergabepunkt zwischen AI-generiertem Vorschlag und deterministischer Geschäftslogik muss explizit und nachvollziehbar modelliert sein."}, "ARCHITEKT-TARGET": {"active": true, "scope": "AI-Schritt-Integration in einen Geschäftsprozess begründet gestalten, mit expliziter Berechtigungsanbindung und definierten Ausnahmepfaden.", "rationale": "Ein AI-Schritt innerhalb eines Geschäftsprozesses muss dieselben Berechtigungs- und Ausnahmebehandlungsanforderungen erfüllen wie jeder andere Prozessschritt."}, "STAFF-TARGET": {"active": true, "scope": "Eine unautorisierte Geschäftsaktion auf eine fehlende explizite Berechtigungsprüfung am AI-Schritt statt auf ein allgemeines Prozessdesign-Problem zurückführen können.", "rationale": "Ein AI-Schritt, der Berechtigungsprüfung implizit voraussetzt statt explizit durchzusetzen, kann Aktionen auslösen, die die eigentliche Prozesslogik nie autorisiert hätte."}, "CHIEF-TARGET": {"active": true, "scope": "GenAI-Integration in Unternehmensprozesse als expliziten, verantwortungsklaren Prozessschritt mit definierten Ausnahmepfaden positionieren, nicht als informellen Zusatz zu bestehenden Prozessen.", "rationale": "AI-Schritte müssen dieselbe Prozessdisziplin (Verantwortung, Ausnahmebehandlung, Auditierbarkeit) wie deterministische Schritte erfüllen, um in produktiven Geschäftsprozessen vertretbar zu sein."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Produktspezifische Workflow-Engine-Implementierungsdetails sind Vertiefung.", "rationale": "Kern ist die explizite Modellierung von Verantwortung, Ausnahmepfaden und Übergabe, nicht die Workflow-Engine-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0257-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für explizite Verantwortungsübergabe zwischen AI-Schritt und deterministischem Prozessschritt", "evidence": "Ein AI-Schritt innerhalb eines Geschäftsprozesses kann einen Vorschlag generieren, der explizit gegen Berechtigungen geprüft und bei Ablehnung an einen definierten Ausnahmepfad statt an eine unautorisierte Aktion übergeben wird.", "limitations": "Kein echtes produktives Workflow-System, keine reale Geschäftsprozessumgebung, keine Produktion."}]}
---
# GenAI in Unternehmensprozessen

> **Ziel:** Ein AI-Schritt innerhalb eines Geschäftsprozesses muss an Datenquellen, Berechtigungen und Geschäftsaktionen mit derselben Prozessdisziplin angebunden werden wie jeder deterministische Schritt (aufbauend auf Function-Calling-Prinzipien, siehe [KB-0247](07-function-calling-und-werkzeugvertraege.md)) — Verantwortung, Ausnahmepfade und die explizite Übergabe an deterministische Prozesse müssen ausdrücklich modelliert sein, nicht informell vorausgesetzt werden.

## Zweck, Mental Model und Dependencies

Ein Geschäftsprozess, der einen AI-Schritt einbindet, unterscheidet sich strukturell nicht von einem Prozess mit ausschließlich deterministischen Schritten — jeder Schritt (ob AI-basiert oder klassisch) muss dieselben Grundanforderungen erfüllen: Zugriff auf die richtigen Datenquellen, Durchsetzung von Berechtigungen, klare Verantwortungszuordnung und definierte Reaktion auf Ausnahmefälle. Die Anbindung an Datenquellen bedeutet, dass ein AI-Schritt nur auf Daten zugreift, für die er im Kontext des aktuellen Prozessschritts autorisiert ist, nicht auf beliebige verfügbare Daten. Die Anbindung an Berechtigungen (verwandt mit der Autorisierungsschicht bei Function Calling, siehe [KB-0247](07-function-calling-und-werkzeugvertraege.md)) bedeutet, dass ein vom AI-Schritt vorgeschlagener Geschäftsvorgang (z. B. eine Freigabe, eine Bestellung) explizit gegen die tatsächlichen Berechtigungen des im Prozess handelnden Akteurs geprüft wird, bevor die Aktion tatsächlich ausgeführt wird. Ausnahmepfade definieren, was geschieht, wenn der AI-Schritt keine ausreichend zuverlässige Entscheidung treffen kann (verwandt mit Abstention, siehe [KB-0253](13-fallback-und-degradierte-ai-antworten.md)) — in diesem Fall muss der Prozess explizit an einen alternativen Pfad übergeben werden (z. B. menschliche Prüfung), statt entweder zu blockieren oder eine unzuverlässige automatische Entscheidung zu erzwingen. Die Übergabe an deterministische Prozesse ist der Punkt, an dem ein AI-generierter Vorschlag in eine tatsächliche, unveränderliche Geschäftsaktion überführt wird — dieser Übergang muss explizit und auditierbar modelliert sein, nicht als impliziter, unsichtbarer Schritt.

~~~text
AI step in a business process = same requirements as any deterministic step:
- Data source access: scoped to what THIS step is authorized to see
- Permission enforcement: proposed action checked against ACTUAL actor permissions before execution
- Exception paths: AI step cannot decide reliably -> explicit handoff (e.g. human review), not silent block or forced decision
- Handoff to deterministic process: explicit, auditable transition point from AI proposal to actual business action
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Datenquellen-Scoping | greift der AI-Schritt nur auf für diesen Kontext autorisierte Daten zu? | zu breiter Datenzugriff erzeugt unnötige Exposition sensibler Informationen |
| Berechtigungsdurchsetzung am AI-Schritt | wird ein AI-generierter Vorschlag explizit gegen tatsächliche Akteur-Berechtigungen geprüft? | fehlende Prüfung erlaubt AI-Schritt effektiv, Berechtigungsgrenzen des handelnden Akteurs zu umgehen |
| Definierte Ausnahmepfade | ist explizit modelliert, was bei unzureichender AI-Entscheidungssicherheit geschieht? | fehlende Ausnahmepfade erzwingen entweder unzuverlässige automatische Entscheidungen oder unerklärte Prozessblockaden |
| Auditierbare Übergabe | ist der Übergang von AI-Vorschlag zu tatsächlicher Geschäftsaktion nachvollziehbar dokumentiert? | fehlende Auditierbarkeit erschwert nachträgliche Nachvollziehbarkeit, wer/was eine Geschäftsaktion tatsächlich ausgelöst hat |

Implementierung: Datenquellenzugriff für einen AI-Schritt wird explizit auf den für diesen Prozesskontext notwendigen Umfang beschränkt (Scoping), statt dem AI-Schritt pauschalen Zugriff auf alle verfügbaren Datenquellen zu gewähren. Jeder von einem AI-Schritt vorgeschlagene Geschäftsvorgang wird vor Ausführung explizit gegen die tatsächlichen Berechtigungen des im Prozesskontext handelnden Akteurs geprüft, analog zur Autorisierungsschicht bei Function Calling. Ausnahmepfade werden für den Fall unzureichender AI-Entscheidungssicherheit explizit definiert (z. B. Übergabe an eine menschliche Prüfungsschleife, Human-in-the-Loop), mit klaren Kriterien, wann dieser Pfad ausgelöst wird. Die Übergabe von einem AI-generierten Vorschlag zu einer tatsächlichen, deterministischen Geschäftsaktion wird als expliziter, auditierbarer Prozessschritt modelliert, mit vollständiger Protokollierung, welcher Vorschlag zu welcher tatsächlichen Aktion geführt hat.

## Scalability, Reliability, Security und Observability

GenAI-Integration in Geschäftsprozesse skaliert Automatisierungsgrad über wachsende Prozessvolumina, wenn Ausnahmepfade und Berechtigungsdurchsetzung robust genug sind, um auch bei zunehmendem Volumen zuverlässig zu funktionieren, statt bei Skalierung zu überlastungsbedingten Umgehungen zu führen. Reliability-Grenze: ein AI-Schritt ohne explizite Berechtigungsdurchsetzung ist ein kritisches, oft unterschätztes Risiko — er kann effektiv als Umgehung der eigentlichen Prozess-Governance fungieren, wenn er implizit mit höheren Rechten agiert als der tatsächlich handelnde Akteur haben sollte.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Geschäftsaktion wurde ausgeführt, die der handelnde Akteur eigentlich nicht autorisiert hätte | AI-Schritt hat den Vorschlag nicht explizit gegen tatsächliche Akteur-Berechtigungen geprüft | Berechtigungsprüfungslogik am AI-Schritt auf tatsächliche Durchsetzung gegen Akteur-Berechtigungen prüfen |
| ein Prozess bleibt unerklärt hängen, wenn der AI-Schritt eine unsichere Entscheidung trifft | fehlender oder unzureichend definierter Ausnahmepfad für unzureichende AI-Entscheidungssicherheit | Prozessdefinition auf explizite Ausnahmepfad-Konfiguration für den betroffenen AI-Schritt prüfen |
| nachträglich kann nicht nachvollzogen werden, welcher AI-Vorschlag zu welcher Geschäftsaktion geführt hat | fehlende Auditierbarkeit der Übergabe von Vorschlag zu tatsächlicher Aktion | Audit-Log auf vollständige Verknüpfung zwischen AI-Vorschlag und resultierender Geschäftsaktion prüfen |
| AI-Schritt greift auf Daten zu, die für den aktuellen Prozesskontext nicht relevant sein sollten | fehlendes Datenquellen-Scoping für den AI-Schritt | tatsächlichen Datenzugriff des AI-Schritts gegen den für diesen Prozesskontext notwendigen Umfang prüfen |

Security: die Berechtigungsdurchsetzung am AI-Schritt ist eine kritische Sicherheitsgrenze — ohne sie kann ein manipulierter oder fehlerhafter AI-Vorschlag effektiv Berechtigungsgrenzen umgehen, die für deterministische Prozessschritte selbstverständlich durchgesetzt würden. Observability: Häufigkeit ausgelöster Ausnahmepfade, Berechtigungsablehnungsrate am AI-Schritt und Vollständigkeit der Audit-Verknüpfung zwischen AI-Vorschlag und Geschäftsaktion sind zentrale Metriken für GenAI-Prozessintegrations-Gesundheit.

## Trade-offs und Entscheidungen

**Staff** setzt Berechtigungsprüfung am AI-Schritt explizit durch, nicht implizit vorausgesetzt. **Principal** macht Ausnahmepfade für unzureichende AI-Entscheidungssicherheit für das Team nachvollziehbar dokumentiert. **Chief** positioniert GenAI-Integration als expliziten, verantwortungsklaren Prozessschritt mit derselben Prozessdisziplin wie deterministische Schritte, nicht als informellen Zusatz.

Anti-Patterns: AI-Schritt mit implizitem, ungeprüftem Zugriff auf Datenquellen oder Berechtigungen agieren lassen; keinen definierten Ausnahmepfad für unzureichende AI-Entscheidungssicherheit vorsehen; die Übergabe von AI-Vorschlag zu Geschäftsaktion ohne Auditierbarkeit gestalten.

## Production Checklist

- [ ] Datenquellenzugriff des AI-Schritts ist explizit auf den notwendigen Prozesskontext beschränkt.
- [ ] AI-Vorschläge werden explizit gegen tatsächliche Akteur-Berechtigungen geprüft.
- [ ] Ausnahmepfade für unzureichende AI-Entscheidungssicherheit sind explizit definiert.
- [ ] Die Übergabe von AI-Vorschlag zu Geschäftsaktion ist vollständig auditierbar.

## Interviewfragen

### 1. Warum muss ein AI-Schritt in einem Geschäftsprozess dieselben Anforderungen wie ein deterministischer Schritt erfüllen?

**Antwort:** Ein Geschäftsprozess muss unabhängig davon, ob ein Schritt AI-basiert oder deterministisch ist, konsistente Berechtigungs-, Auditierbarkeits- und Ausnahmebehandlungsgarantien bieten — ein AI-Schritt mit geringeren Anforderungen könnte effektiv als Umgehung der eigentlichen Prozess-Governance fungieren.

### 2. Warum ist explizite Berechtigungsprüfung am AI-Schritt kritisch?

**Antwort:** Ohne explizite Prüfung könnte ein AI-Vorschlag Geschäftsaktionen auslösen, die der tatsächlich handelnde Akteur gar nicht autorisiert gewesen wäre — der AI-Schritt würde effektiv mit implizit höheren Rechten agieren als vorgesehen.

### 3. Was ist ein Ausnahmepfad im Kontext von GenAI in Geschäftsprozessen, und warum ist er notwendig?

**Antwort:** Ein Ausnahmepfad ist eine definierte Reaktion (z. B. Übergabe an menschliche Prüfung), wenn der AI-Schritt keine ausreichend zuverlässige Entscheidung treffen kann; ohne ihn würde entweder eine unzuverlässige Entscheidung erzwungen oder der Prozess unerklärt blockieren.

### 4. Wie diagnostizierst du, dass eine unautorisierte Geschäftsaktion durch einen AI-Schritt ausgelöst wurde?

**Antwort:** Ich prüfe, ob die Berechtigungsprüfungslogik am AI-Schritt tatsächlich gegen die Berechtigungen des handelnden Akteurs durchgesetzt wurde — eine fehlende oder unzureichende Prüfung an dieser Stelle ist die wahrscheinlichste Ursache für eine unautorisierte, aber vom AI-Schritt ausgelöste Aktion.

### 5. Warum muss die Übergabe von AI-Vorschlag zu tatsächlicher Geschäftsaktion auditierbar sein?

**Antwort:** Nachträgliche Nachvollziehbarkeit (wer/was hat eine Geschäftsaktion tatsächlich ausgelöst) ist für Compliance, Fehleranalyse und Vertrauen in den Prozess essenziell; ohne explizite, protokollierte Verknüpfung zwischen Vorschlag und Aktion bleibt diese Nachvollziehbarkeit unmöglich.

### 6. Widersprüchliche Anforderung: Team will maximale Prozessautomatisierung (AI-Schritt entscheidet vollständig autonom) UND garantiert, dass jede Geschäftsaktion nachweisbar korrekt autorisiert war — wie gehst du vor?

**Antwort:** Ich würde erklären, dass vollständige Autonomie ohne Berechtigungsprüfung dem zweiten Ziel direkt widerspricht; ich würde eine Architektur vorschlagen, bei der der AI-Schritt autonom Vorschläge generiert, aber jede resultierende Geschäftsaktion weiterhin durch eine explizite, unabhängige Berechtigungsprüfung laufen muss, bevor sie ausgeführt wird — Autonomie bei der Vorschlagsgenerierung, aber keine Umgehung der Autorisierungsschicht.

## Praktische Labs

~~~python
# AI step integrated into a business process with permission enforcement and exception path
def ai_step_propose_action(request):
    # simulated: AI proposes an approval action
    return {"action": "approve_expense", "amount": 5000, "target_account": "acc-42"}

def check_actor_permission(actor_role, action, amount):
    approval_limits = {"employee": 500, "manager": 2000, "director": 10000}
    limit = approval_limits.get(actor_role, 0)
    return amount <= limit

def run_process_step(request, actor_role):
    proposal = ai_step_propose_action(request)

    authorized = check_actor_permission(actor_role, proposal["action"], proposal["amount"])
    if authorized:
        return f"EXECUTED: {proposal['action']} for {proposal['amount']} by {actor_role}"
    else:
        return f"EXCEPTION PATH: proposal for {proposal['amount']} exceeds {actor_role} limit - routed to human review"

print(run_process_step("expense request", actor_role="manager"))
print(run_process_step("expense request", actor_role="employee"))

result = run_process_step("expense request", actor_role="employee")
assert "EXCEPTION PATH" in result
print("\nThe AI's proposal alone did NOT execute the action - actual authorization was checked against the real actor's permission first.")
~~~

## Dependencies, Cross-References und Quellen

1. Anthropic: [Building Effective AI Agents](https://www.anthropic.com/engineering/building-effective-agents), abgerufen 2026-09-17.
2. OWASP: [LLM Excessive Agency Risks](https://owasp.org/www-project-top-10-for-large-language-model-applications/), abgerufen 2026-09-17.
3. Camunda: [Human-in-the-Loop Workflow Patterns](https://camunda.com/best-practices/), abgerufen 2026-09-17.

Function-Calling- und Fallback-/Abstentions-Grundlagen sind kanonisch in [KB-0247](07-function-calling-und-werkzeugvertraege.md) und [KB-0253](13-fallback-und-degradierte-ai-antworten.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte Agenten-Governance-Frameworks mit eingebauter Berechtigungs- und Audit-Infrastruktur | Adopting | Gegenüber selbstgebauter Governance-Logik für neue AI-Prozessintegrationen evaluieren. |
| Ereignisbasierte Prozess-Runtimes (Event Sourcing) für vollständige Nachvollziehbarkeit von AI-Vorschlag bis Geschäftsaktion | Established | Für Prozesse mit hohen Auditierbarkeitsanforderungen gegenüber zustandsbasierten Prozess-Engines bevorzugen. |

Ein Team akzeptiert eine GenAI-Prozessintegration erst, wenn Berechtigungsdurchsetzung, Ausnahmepfade und auditierbare Übergabe nachweisbar implementiert sind.
