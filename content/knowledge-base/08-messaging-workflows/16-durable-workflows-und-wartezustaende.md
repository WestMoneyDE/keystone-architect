---
{"id": "KB-0192", "title": "Durable Workflows und Wartezustände", "domain": "08", "sequence": 16, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF"], "requires": [{"id": "KB-0191", "concepts": ["Determinismus", "Replay"], "needed_for": "both"}, {"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}], "related": ["KB-0193", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Workflow mit langem Timer und externem Signal lokal implementieren, der ohne laufenden Prozess persistent wartet.", "rationale": "Kein echtes Temporal-System nötig, um das Kernprinzip zu zeigen."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Wartezustände (Timer, externe Signale) so modellieren, dass ein Workflow ohne aktiven Worker-Prozess Tage oder Wochen persistent überdauert.", "rationale": "Ein naiver 'sleep()'-Aufruf würde einen Prozess unnötig blockieren, statt Ressourcen freizugeben."}, "STAFF-TARGET": {"active": true, "scope": "Einen 'verlorenen' langlaufenden Prozess auf eine fehlende Persistenz des Wartezustands zurückführen, statt auf einen echten Workflow-Fehler.", "rationale": "Das ist ein häufiges Missverständnis beim Umstieg von einfachen Skripten auf durable Workflows."}, "CHIEF-TARGET": {"active": true, "scope": "Durable Workflows als Standard für langlebige Geschäftsprozesse mit Wartezeiten positionieren, gegenüber fragilen selbstgebauten Cron-/Polling-Lösungen.", "rationale": "Selbstgebaute Wartezustandsverwaltung ist eine häufige, unterschätzte Fehlerquelle."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Signal-Handling-Details und komplexe Timer-Kombinationen (Race zwischen Timer und Signal) sind Vertiefung.", "rationale": "Kern ist das Prinzip: Wartezustand ist persistent, nicht prozessgebunden."}}, "lab_validation": [{"lab_id": "KB-0192-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für persistenten Wartezustand mit Timer und externem Signal", "evidence": "Ein Workflow, der auf ein Signal oder einen Timer wartet, benötigt während der Wartezeit keinen laufenden Worker-Prozess; bei Eintreffen des Signals oder Ablauf des Timers wird der Workflow-Zustand aus der persistenten Historie wiederhergestellt und fortgesetzt.", "limitations": "Kein echtes Temporal-System, keine Produktion."}]}
---
# Durable Workflows und Wartezustände

> **Ziel:** Ein durable Workflow kann Tage, Wochen oder Monate auf einen Timer oder ein externes Signal (z. B. eine Kundenfreigabe) warten, ohne dass dafür ein Prozess kontinuierlich laufen muss. Das unterscheidet sich fundamental von einem naiven `sleep()`-Aufruf in einem Skript, der den Prozess und dessen Ressourcen während der gesamten Wartezeit blockieren würde.

## Zweck, Mental Model und Dependencies

In einem durable Workflow-System (wie Temporal, [KB-0191](15-temporal-und-deterministische-workflows.md)) wird ein Wartezustand als Teil der persistenten Workflow-Historie modelliert, nicht als blockierender Prozesszustand. Wartet ein Workflow auf einen Timer oder ein externes Signal, wird der Worker-Prozess freigegeben — es läuft während der Wartezeit kein aktiver Prozess für diesen spezifischen Workflow. Trifft das Signal ein oder läuft der Timer ab, wird der Workflow-Zustand durch Replay der Historie rekonstruiert und an genau der Stelle fortgesetzt, an der er wartete. Das macht durable Workflows robust gegen Worker-Ausfälle während beliebig langer Wartezeiten — ein Vorteil, den selbstgebaute Cron-/Polling-Lösungen ohne erheblichen zusätzlichen Aufwand nicht bieten. Lies [KB-0191](15-temporal-und-deterministische-workflows.md) und [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md).

~~~text
Naive:   def process_order(): ...; time.sleep(7*24*3600); ...  -- blocks a process for a full week
Durable: workflow waits on Timer(7 days) OR Signal("approval") -- no process runs during the wait
         event arrives/timer fires -> workflow state reconstructed from history -> execution resumes exactly there
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Timer | wird die Wartezeit als persistenter Workflow-Timer statt Prozess-Sleep modelliert? | Prozess-Sleep blockiert Ressourcen unnötig und übersteht keinen Neustart |
| Externes Signal | kann ein externes Ereignis den wartenden Workflow gezielt erreichen? | fehlende Signal-Behandlung erzwingt ineffizientes Polling |
| Race zwischen Timer und Signal | was passiert, wenn beide fast gleichzeitig eintreffen? | unklare Priorisierung führt zu unerwartetem Workflow-Verhalten |
| Wiederaufnahme ohne aktiven Prozess | überdauert der Wartezustand einen kompletten Infrastruktur-Neustart? | naive Implementierung verliert Fortschritt bei Infrastrukturausfall während der Wartezeit |

Implementierung: lange Wartezeiten werden als explizite Workflow-Timer modelliert, die von der Workflow-Engine selbst verwaltet werden, statt einen Prozess mit `sleep()` zu blockieren. Externe Ereignisse (z. B. eine Kundenfreigabe über eine API) werden als Signale an die spezifische Workflow-Instanz gesendet, die die Engine dem wartenden Workflow zustellt. Für Fälle, in denen sowohl ein Timer als auch ein Signal möglich sind (z. B. „warte auf Freigabe, aber höchstens 7 Tage"), wird explizit definiert, welches Ereignis Vorrang hat, falls beide nahezu gleichzeitig eintreffen.

## Scalability, Reliability, Security und Observability

Durable Workflows skalieren sehr viele gleichzeitig wartende Prozessinstanzen effizient, da wartende Workflows keine aktiven Ressourcen (Prozess, Speicher, Thread) binden — nur ihre persistente Historie liegt im System. Reliability-Grenze: die Zuverlässigkeitsgarantie gilt nur, wenn Wartezustände tatsächlich über die Workflow-Engine modelliert werden — ein Team, das versehentlich einen blockierenden Sleep innerhalb einer Activity statt eines Workflow-Timers nutzt, verliert diese Garantie und riskiert Ressourcenerschöpfung bei vielen gleichzeitig wartenden Instanzen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| viele Prozesse/Threads blockieren gleichzeitig in Wartezustand | Sleep innerhalb einer Activity statt persistentem Workflow-Timer genutzt | Code auf blockierendes Sleep versus Workflow-Timer-API prüfen |
| externes Ereignis erreicht einen wartenden Workflow nicht | Signal wird nicht korrekt an die spezifische Workflow-Instanz-ID adressiert | Signal-Zustellungsmechanismus und Instanz-ID-Zuordnung prüfen |
| unklares Verhalten, wenn Timer und Signal nahezu gleichzeitig eintreffen | fehlende explizite Priorisierungslogik im Workflow-Code | Race-Condition-Verhalten zwischen Timer und Signal explizit testen |
| ein wartender Workflow „verschwindet" nach Infrastruktur-Wartung | fälschliche Annahme, der Wartezustand sei prozessgebunden | prüfen, ob der Workflow nach Neustart korrekt aus der persistenten Historie fortgesetzt wird |

Security: externe Signale an einen Workflow sollten authentifiziert und autorisiert werden, da sonst ein unautorisierter Akteur den Fortschritt eines fremden Geschäftsprozesses beeinflussen könnte. Observability: die Anzahl aktuell wartender Workflow-Instanzen und ihre jeweilige Wartedauer sind wichtige Metriken für die Gesundheit langlebiger Geschäftsprozesse.

## Trade-offs und Entscheidungen

**Staff** modelliert lange Wartezeiten konsequent über Workflow-Timer statt blockierender Sleep-Aufrufe. **Principal** definiert explizite Priorisierungsregeln für Race-Bedingungen zwischen Timer und Signal. **Chief** positioniert durable Workflows als Standard für langlebige Geschäftsprozesse mit Wartezeiten, gegenüber fragilen, selbstgebauten Cron-/Polling-Lösungen.

Anti-Patterns: blockierendes Sleep innerhalb einer Activity oder eines regulären Prozesses statt eines persistenten Workflow-Timers; externe Signale ohne Authentifizierung akzeptieren; keine explizite Priorisierung bei möglicher Race-Bedingung zwischen Timer und Signal.

## Production Checklist

- [ ] Lange Wartezeiten sind als persistente Workflow-Timer modelliert, nicht als blockierendes Sleep.
- [ ] Externe Signale sind authentifiziert und eindeutig einer Workflow-Instanz zugeordnet.
- [ ] Priorisierung bei möglicher Race-Bedingung zwischen Timer und Signal ist explizit definiert.
- [ ] Wartende Workflow-Instanzen und ihre Dauer werden überwacht.

## Interviewfragen

### 1. Warum ist ein `sleep()`-Aufruf für lange Wartezeiten in einem durable Workflow problematisch?

**Antwort:** Er würde einen Prozess für die gesamte Wartezeit blockieren und dessen Ressourcen binden; ein persistenter Workflow-Timer gibt den Prozess frei und überdauert Neustarts, ohne aktiv laufende Ressourcen zu benötigen.

### 2. Wie erreicht ein externes Ereignis einen wartenden Workflow?

**Antwort:** Über ein Signal, das gezielt an die spezifische Workflow-Instanz-ID gesendet wird; die Engine stellt es dem wartenden Workflow zu und setzt dessen Ausführung an der entsprechenden Stelle fort.

### 3. Was passiert, wenn ein Workflow auf ein Signal oder einen Timer wartet und die Infrastruktur zwischenzeitlich neu startet?

**Antwort:** Der Wartezustand ist Teil der persistenten Historie, nicht prozessgebunden; nach dem Neustart wird der Workflow korrekt aus der Historie rekonstruiert und wartet weiterhin an derselben Stelle.

### 4. Warum braucht eine Kombination aus Timer und Signal eine explizite Priorisierungsregel?

**Antwort:** Treffen beide nahezu gleichzeitig ein, muss klar definiert sein, welches Ereignis Vorrang hat, sonst entsteht unklares, nicht reproduzierbares Verhalten.

### 5. Warum sind selbstgebaute Cron-/Polling-Lösungen für lange Wartezeiten fehleranfälliger?

**Antwort:** Sie müssen Zustand, Wiederaufnahme und Zuverlässigkeit bei Ausfällen manuell nachbilden, was ein durable Workflow-System bereits eingebaut und getestet bereitstellt.

### 6. Widersprüchliche Anforderung: Produkt will einen Prozess, der bis zu 90 Tage auf eine Kundenfreigabe wartet UND sofortige Reaktion bei Eintreffen der Freigabe — wie gehst du vor?

**Antwort:** Ich würde einen Workflow mit einem 90-Tage-Timer und paralleler Wartelogik auf ein Freigabe-Signal implementieren — das Signal löst sofortige Fortsetzung aus, der Timer greift nur, falls keine Freigabe innerhalb der Frist eintrifft; beide Anforderungen sind mit dieser Kombination vereinbar.

## Praktische Labs

~~~python
class DurableWorkflow:
    def __init__(self):
        self.state = "waiting_for_approval"
        self.history = []

    def signal_approval(self):
        self.history.append("approval_received")
        self.state = "approved"

    def timer_expired(self):
        if self.state == "waiting_for_approval":
            self.history.append("timer_expired")
            self.state = "expired"

wf = DurableWorkflow()
# simulate: no process actively "sleeping" - workflow just persists its state until an event arrives
wf.signal_approval()
assert wf.state == "approved"
assert wf.history == ["approval_received"]
print("Workflow resumed correctly from an external signal without any process blocking during the wait.")
~~~

## Dependencies, Cross-References und Quellen

1. Temporal Technologies: [Temporal Documentation - Workflow Timers and Signals](https://docs.temporal.io/workflows), abgerufen 2026-09-17.

Temporal-/Framework-spezifische Timer-/Signal-API-Details vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Serverless-Workflow-Orchestrierung mit eingebauter Wartezustandsverwaltung | Adopting | Kostenmodell und Skalierungsverhalten bei sehr vielen gleichzeitig wartenden Instanzen prüfen. |

Ein Team akzeptiert eine Durable-Workflow-Implementierung erst, wenn persistente Timer/Signale statt blockierender Sleeps und Race-Priorisierung nachweisbar getestet sind.
