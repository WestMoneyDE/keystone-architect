---
{"id": "KB-0285", "title": "Checkpoints und Wiederaufnahme", "domain": "12", "sequence": 11, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0284", "concepts": ["Dauerhafter Agentenzustand"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Wiederaufnahmeprüfung implementieren, die Umgebungs- und Berechtigungsänderungen seit dem letzten Checkpoint erkennt, bevor der Agent erneut handelt.", "rationale": "Das Risiko veralteter Berechtigungsannahmen bei Wiederaufnahme wird erst durch konkrete Implementierung einer Neuverifikation greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Entscheiden, welche Checkpoint-Granularität für einen konkreten Agentenablauf einen angemessenen Kompromiss zwischen Wiederaufnahmekosten und Zwischenresultat-Verlustrisiko bietet.", "rationale": "Zu grobe Checkpoints erhöhen den Verlust bei Unterbrechung, zu feine Checkpoints erhöhen den Persistenz-Overhead."}, "STAFF-TARGET": {"active": true, "scope": "Eine fehlerhafte Aktion nach Wiederaufnahme auf eine nicht neu verifizierte, inzwischen geänderte Berechtigung statt auf ein allgemeines Logikproblem zurückführen können.", "rationale": "Ein Checkpoint speichert den Zustand zu einem Zeitpunkt in der Vergangenheit; Umgebung und Berechtigungen können sich bis zur Wiederaufnahme geändert haben."}, "CHIEF-TARGET": {"active": true, "scope": "Checkpoint-basierte Wiederaufnahme als Sicherheitsentscheidung positionieren, die eine explizite Neuverifikation von Umgebung und Berechtigungen erfordert, nicht nur eine reine Fortschrittswiederherstellung.", "rationale": "Ein Agent, der nach einem Checkpoint ohne Neuverifikation handelt, kann auf Basis veralteter Annahmen über seine eigenen Berechtigungen agieren."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Checkpoint-Speicherformate sind Vertiefung.", "rationale": "Kern ist das Prinzip der Neuverifikation vor Wiederaufnahme, nicht das Speicherformat."}}, "lab_validation": [{"lab_id": "KB-0285-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell einer Checkpoint-Wiederaufnahme mit simulierter Berechtigungsänderung zwischen Checkpoint und Wiederaufnahme", "evidence": "Eine Wiederaufnahme ohne Neuverifikation setzt eine Aktion mit einer inzwischen entzogenen Berechtigung fort; eine explizite Prüfung vor Wiederaufnahme erkennt und verhindert dies.", "limitations": "Kein echtes Berechtigungssystem, kein produktives System, keine reale Umgebungsänderung getestet."}]}
---
# Checkpoints und Wiederaufnahme

> **Ziel:** Ein Checkpoint speichert Zwischenresultate und einen Versionsbezug zu einem bestimmten Zeitpunkt im Agentenablauf, aufbauend auf dauerhaftem Zustand (siehe [KB-0284](10-dauerhafter-agentenzustand.md)). Der zentrale, sicherheitsrelevante Punkt ist, dass ein Checkpoint einen Zustand aus der Vergangenheit festhält — Umgebung und Berechtigungen können sich bis zur tatsächlichen Wiederaufnahme geändert haben und müssen vor erneutem Handeln explizit neu geprüft werden, statt als weiterhin gültig angenommen zu werden.

## Zweck, Mental Model und Dependencies

Ein Checkpoint ist ein Zwischenresultat, das zu einem bestimmten Zeitpunkt im Agentenablauf gespeichert wird, zusammen mit einem Versionsbezug (welche Version des Codes, der Konfiguration oder der zugrunde liegenden Umgebung zum Zeitpunkt der Speicherung gültig war). Das baut direkt auf dauerhaftem Agentenzustand (siehe [KB-0284](10-dauerhafter-agentenzustand.md)) auf, fügt aber eine wichtige zusätzliche Dimension hinzu: die Zeit zwischen Checkpoint-Erstellung und tatsächlicher Wiederaufnahme kann beliebig lang sein, und in dieser Zeit können sich Umgebung, Konfiguration oder Berechtigungen geändert haben. Der zentrale, oft übersehene Risikofaktor ist, dass eine naive Wiederaufnahme den gespeicherten Zustand als weiterhin uneingeschränkt gültig behandelt und der Agent mit den zum Checkpoint-Zeitpunkt gültigen Berechtigungen weiterhandelt — obwohl diese Berechtigungen inzwischen widerrufen, eingeschränkt oder die Zielumgebung verändert worden sein könnten (z. B. ein Zugriffsschlüssel wurde rotiert, eine Richtlinie wurde verschärft, ein Zielsystem wurde migriert). Vor jedem erneuten Handeln nach einer Wiederaufnahme muss daher explizit geprüft werden, ob die Annahmen des Checkpoints (Umgebung, Berechtigungen, Versionsstand) noch gültig sind, statt diese Prüfung zu überspringen, weil der Zustand ja "bereits validiert" erscheint.

~~~text
Checkpoint: intermediate result + version reference AT a point in time
Builds on durable state (KB-0284), adds: TIME GAP between checkpoint creation and actual resume
During that gap: environment/config/permissions CAN CHANGE (key rotated, policy tightened, system migrated)
NAIVE resume: treats checkpoint state as still fully valid -> acts with STALE permissions
CORRECT resume: explicitly RE-VERIFY environment + permissions + version BEFORE acting again
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Versionsbezug im Checkpoint | speichert der Checkpoint explizit, welche Version von Code/Konfiguration/Umgebung zum Zeitpunkt gültig war? | ohne Versionsbezug lässt sich eine relevante Änderung bei Wiederaufnahme nicht erkennen |
| Neuverifikation von Berechtigungen | wird vor erneutem Handeln nach Wiederaufnahme explizit geprüft, ob die zum Checkpoint-Zeitpunkt gültigen Berechtigungen noch bestehen? | eine Aktion mit inzwischen widerrufenen Berechtigungen kann unautorisierten Zugriff oder eine Sicherheitsverletzung verursachen |
| Umgebungsänderungserkennung | wird geprüft, ob sich die Zielumgebung (Systeme, Endpunkte, Konfiguration) seit dem Checkpoint verändert hat? | eine unerkannte Umgebungsänderung kann zu Aktionen gegen ein nicht mehr existierendes oder verändertes Zielsystem führen |
| Checkpoint-Granularität | ist die Häufigkeit der Checkpoint-Erstellung angemessen zwischen Persistenz-Overhead und Zwischenresultat-Verlustrisiko abgewogen? | zu grobe Checkpoints erhöhen den Verlust bei Unterbrechung, zu feine erhöhen unnötigen Overhead |

Implementierung: Jeder Checkpoint speichert neben dem Zwischenresultat explizit einen Versionsbezug zu Code, Konfiguration und relevanter Umgebung. Vor jeder Wiederaufnahme wird eine explizite Neuverifikation durchgeführt, die prüft, ob die zum Checkpoint-Zeitpunkt gültigen Berechtigungen weiterhin bestehen und ob sich die Zielumgebung relevant verändert hat — schlägt diese Prüfung fehl, wird die Wiederaufnahme kontrolliert abgebrochen oder eskaliert, statt mit veralteten Annahmen fortzufahren. Die Checkpoint-Granularität wird anhand der Kritikalität und Dauer der einzelnen Schritte festgelegt, mit häufigeren Checkpoints bei kostenintensiven oder langlaufenden Teilschritten.

## Scalability, Reliability, Security und Observability

Checkpoint-basierte Wiederaufnahme skaliert die Widerstandsfähigkeit langlaufender Agentenprozesse gegenüber Unterbrechungen proportional zur Sorgfalt der Neuverifikationslogik; die Reliability-Grenze liegt in einer naiven Wiederaufnahme ohne Neuverifikation, die veraltete Berechtigungs- oder Umgebungsannahmen unbemerkt fortsetzt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Aktion nach Wiederaufnahme schlägt mit einem Berechtigungsfehler fehl, der beim ursprünglichen Checkpoint nicht bestand | Berechtigungen wurden zwischen Checkpoint und Wiederaufnahme geändert, ohne dass eine Neuverifikation dies erkannt hat | prüfen, ob eine explizite Neuverifikation der Berechtigungen vor der fehlgeschlagenen Aktion stattgefunden hat |
| eine Aktion nach Wiederaufnahme richtet sich gegen ein nicht mehr existierendes oder verändertes Zielsystem | Umgebungsänderung seit dem Checkpoint wurde nicht erkannt | prüfen, ob eine Umgebungsänderungserkennung vor der Wiederaufnahme durchgeführt wurde |
| bei häufigen kurzen Unterbrechungen entsteht unerwartet hoher Persistenz-Overhead | Checkpoint-Granularität ist feiner als für die Kritikalität der Schritte notwendig | Checkpoint-Häufigkeit gegen die tatsächliche Kritikalität und Dauer der betroffenen Schritte prüfen |

Security: Die Neuverifikation von Berechtigungen bei Wiederaufnahme ist eine zentrale Sicherheitsmaßnahme gegen Privilege Escalation durch veraltete Zustandsannahmen — ein Angreifer, der Berechtigungen zwischen Checkpoint und Wiederaufnahme gezielt manipuliert, könnte sonst von einer naiven Wiederaufnahme profitieren. Observability: Häufigkeit fehlgeschlagener Neuverifikationen bei Wiederaufnahme, Zeitspanne zwischen Checkpoint-Erstellung und tatsächlicher Wiederaufnahme und Häufigkeit erkannter Umgebungsänderungen sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert für jede Wiederaufnahme eine explizite Neuverifikation von Berechtigungen und Umgebung vor erneutem Handeln. **Principal** macht Checkpoint-Granularität und Neuverifikationslogik für das Team nachvollziehbar dokumentiert. **Chief** positioniert Checkpoint-basierte Wiederaufnahme als Sicherheitsentscheidung, nicht nur als reine Fortschrittswiederherstellung.

Anti-Patterns: eine Wiederaufnahme ohne Neuverifikation von Berechtigungen und Umgebung durchführen; Checkpoints ohne Versionsbezug speichern, sodass relevante Änderungen nicht erkennbar sind; bei fehlgeschlagener Neuverifikation stillschweigend mit veralteten Annahmen fortfahren, statt kontrolliert abzubrechen oder zu eskalieren.

## Production Checklist

- [ ] Jeder Checkpoint speichert einen expliziten Versionsbezug zu Code, Konfiguration und Umgebung.
- [ ] Vor jeder Wiederaufnahme wird eine Neuverifikation von Berechtigungen durchgeführt.
- [ ] Umgebungsänderungen seit dem Checkpoint werden vor erneutem Handeln erkannt.
- [ ] Bei fehlgeschlagener Neuverifikation wird kontrolliert abgebrochen oder eskaliert, nicht stillschweigend fortgesetzt.

## Interviewfragen

### 1. Warum reicht ein gespeicherter Checkpoint allein nicht für eine sichere Wiederaufnahme aus?

**Antwort:** Ein Checkpoint speichert einen Zustand aus der Vergangenheit; Umgebung und Berechtigungen können sich bis zur tatsächlichen Wiederaufnahme geändert haben und müssen explizit neu geprüft werden, bevor der Agent erneut handelt.

### 2. Welches konkrete Sicherheitsrisiko entsteht durch eine naive Wiederaufnahme ohne Neuverifikation?

**Antwort:** Der Agent kann mit inzwischen widerrufenen oder eingeschränkten Berechtigungen weiterhandeln, was zu unautorisiertem Zugriff oder einer Sicherheitsverletzung führen kann.

### 3. Warum benötigt ein Checkpoint einen expliziten Versionsbezug?

**Antwort:** Ohne Versionsbezug zu Code, Konfiguration und Umgebung lässt sich bei Wiederaufnahme nicht erkennen, ob sich relevante Aspekte seit der Checkpoint-Erstellung verändert haben.

### 4. Wie wählst du eine angemessene Checkpoint-Granularität?

**Antwort:** Anhand der Kritikalität und Dauer einzelner Schritte — kostenintensive oder langlaufende Teilschritte erhalten häufigere Checkpoints, um das Verlustrisiko bei Unterbrechung zu begrenzen, ohne unnötigen Persistenz-Overhead für triviale Schritte zu erzeugen.

### 5. Wie diagnostizierst du einen Berechtigungsfehler, der erst nach Wiederaufnahme auftritt?

**Antwort:** Ich prüfe, ob vor der fehlgeschlagenen Aktion eine explizite Neuverifikation der Berechtigungen stattgefunden hat — fehlt sie, ist eine zwischenzeitliche Berechtigungsänderung, die nicht erkannt wurde, die wahrscheinlichste Ursache.

### 6. Widersprüchliche Anforderung: Team will sofortige, verzögerungsfreie Wiederaufnahme nach jeder Unterbrechung UND garantierte Neuverifikation von Berechtigungen und Umgebung vor jedem Schritt — wie gehst du vor?

**Antwort:** Ich würde erklären, dass eine minimale, gezielte Neuverifikation (nur der für den nächsten Schritt tatsächlich benötigten Berechtigungen und Umgebungsaspekte) einen sehr geringen Zeitaufwand verursacht, verglichen mit dem Risiko einer unautorisierten Aktion; ich würde vorschlagen, diese gezielte Prüfung als festen, aber minimalen Bestandteil jeder Wiederaufnahme zu etablieren, statt auf sie zugunsten von Geschwindigkeit ganz zu verzichten.

## Praktische Labs

~~~python
# Checkpoint with version reference and permission re-verification before resume
current_permissions = {"read_files", "write_files"}  # simulates live, current permission state

def create_checkpoint(step, permissions_snapshot):
    return {"step": step, "permissions_at_checkpoint": permissions_snapshot, "version": "config-v3"}

def resume(checkpoint, live_permissions, live_version):
    if checkpoint["version"] != live_version:
        raise RuntimeError(f"Version mismatch: checkpoint={checkpoint['version']}, live={live_version} — re-verification required")
    missing_permissions = checkpoint["permissions_at_checkpoint"] - live_permissions
    if missing_permissions:
        raise PermissionError(f"Permissions revoked since checkpoint: {missing_permissions} — cannot resume safely")
    return f"Resuming at step {checkpoint['step']} with verified permissions {live_permissions}"

checkpoint = create_checkpoint(step=3, permissions_snapshot={"read_files", "write_files"})

result_ok = resume(checkpoint, live_permissions={"read_files", "write_files"}, live_version="config-v3")
print(result_ok)

current_permissions.discard("write_files")  # permission revoked between checkpoint and resume
try:
    resume(checkpoint, live_permissions=current_permissions, live_version="config-v3")
except PermissionError as e:
    print(f"Caught stale-permission resume attempt: {e}")
~~~

## Dependencies, Cross-References und Quellen

1. LangChain: [LangGraph Checkpointing](https://langchain-ai.github.io/langgraph/concepts/persistence/#checkpoints), abgerufen 2026-09-17.
2. OWASP: [OWASP Top 10 for LLM Applications — Excessive Agency](https://genai.owasp.org/llmrisk/llm08-excessive-agency/), abgerufen 2026-09-17.
3. Temporal: [Durable Execution and Versioning](https://docs.temporal.io/workflows#versioning), abgerufen 2026-09-17.

Dauerhafter Agentenzustand ist kanonisch in [KB-0284](10-dauerhafter-agentenzustand.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Policy-Diff-Prüfung zwischen Checkpoint-Zeitpunkt und Wiederaufnahme, die relevante Berechtigungsänderungen ohne manuelle Logik erkennt | Emerging | Beobachten; würde Neuverifikation vereinfachen, aber noch keine breit verfügbare Standardlösung. |
| Signierte Checkpoints mit eingebettetem Versionsnachweis zur Manipulationserkennung | Emerging | Beobachten; erhöht Vertrauenswürdigkeit von Checkpoints, aber Mehraufwand noch nicht breit abgewogen. |

Ein Team akzeptiert eine Checkpoint-basierte Wiederaufnahmearchitektur erst, wenn Versionsbezug, Berechtigungs-Neuverifikation und Umgebungsänderungserkennung dokumentiert und getestet sind.
