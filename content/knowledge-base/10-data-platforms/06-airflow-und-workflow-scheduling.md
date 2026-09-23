---
{"id": "KB-0224", "title": "Airflow und Workflow-Scheduling", "domain": "10", "sequence": 6, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "GENAI", "MLOPS"], "requires": [{"id": "KB-0219", "concepts": ["ETL/ELT"], "needed_for": "understanding"}, {"id": "KB-0191", "concepts": ["Deterministische Workflows"], "needed_for": "understanding"}], "related": ["KB-0223"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein DAG-artiges Abhängigkeitsmodell mit Backfill-Fähigkeit für zeitgeplante Tasks lokal implementieren.", "rationale": "Der Unterschied zwischen zeitgeplanter Batch-Ausführung und langlebigen Geschäftsworkflows wird erst durch konkrete Implementierung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Airflow gegenüber langlebigen Workflow-Engines (Temporal-artig) für einen konkreten Anwendungsfall begründet abgrenzen.", "rationale": "Beide lösen unterschiedliche Klassen von Orchestrierungsproblemen mit unterschiedlichen Garantien."}, "STAFF-TARGET": {"active": true, "scope": "Inkonsistente Backfill-Ergebnisse auf nicht-idempotente Task-Logik statt auf einen Scheduler-Bug zurückführen können.", "rationale": "Backfills führen historische Zeiträume erneut aus; ohne Idempotenz entstehen dabei Duplikate oder falsche Ergebnisse."}, "CHIEF-TARGET": {"active": true, "scope": "Airflow als Werkzeug für zeitgeplante, wiederholbare Batch-Tasks positionieren, nicht als generelle Workflow-Orchestrierungslösung für langlebige Geschäftsprozesse.", "rationale": "Airflow ist für zeitplanbasierte DAG-Ausführung optimiert, nicht für Workflows mit unbestimmter Laufzeit und externen Wartezuständen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Airflow-spezifische Executor-Konfiguration (CeleryExecutor, KubernetesExecutor) ist Vertiefung.", "rationale": "Kern ist das Verständnis von DAGs, Scheduler-Semantik und Backfills, nicht die Executor-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0224-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für DAG-basierte Backfill-Ausführung mit Idempotenzprüfung", "evidence": "Ein idempotenter Task kann für einen historischen Zeitraum wiederholt ausgeführt (Backfill) werden, ohne Duplikate zu erzeugen; ein nicht-idempotenter Task erzeugt bei wiederholter Backfill-Ausführung fehlerhafte, doppelte Ergebnisse.", "limitations": "Kein echtes Airflow-System, kein echter Scheduler, keine Produktion."}]}
---
# Airflow und Workflow-Scheduling

> **Ziel:** Airflow orchestriert zeitgeplante, wiederholbare Batch-Tasks als gerichtete azyklische Graphen (DAGs) — es ist für vorhersehbare, zeitplanbasierte Ausführung mit Backfill-Fähigkeit optimiert, nicht für langlebige Geschäftsworkflows mit unbestimmter Laufzeit und externen Wartezuständen (siehe [KB-0191](../08-messaging-workflows/15-temporal-und-deterministische-workflows.md) für diese andere Orchestrierungsklasse). Backfills erfordern zwingend idempotente Task-Logik, sonst entstehen bei erneuter Ausführung historischer Zeiträume Duplikate oder falsche Ergebnisse.

## Zweck, Mental Model und Dependencies

Ein DAG (Directed Acyclic Graph) in Airflow definiert Tasks und ihre Abhängigkeiten — der Scheduler führt Tasks entsprechend eines definierten Zeitplans (z. B. täglich, stündlich) aus, wobei jede Ausführung einem spezifischen logischen Zeitintervall zugeordnet ist. Backfills erlauben, einen DAG für vergangene, bisher nicht ausgeführte (oder erneut auszuführende) Zeitintervalle nachträglich laufen zu lassen — essenziell, um historische Datenlücken zu schließen oder nach einer Logikänderung vergangene Perioden neu zu berechnen, aber nur sicher, wenn die zugrunde liegenden Tasks idempotent sind. Der zentrale Unterschied zu langlebigen Geschäftsworkflow-Engines (siehe [KB-0191](../08-messaging-workflows/15-temporal-und-deterministische-workflows.md), [KB-0192](../08-messaging-workflows/16-durable-workflows-und-wartezustaende.md)) ist die Zeitmodellierung: Airflow orchestriert Tasks entlang eines festen Zeitplans mit klar begrenzter Ausführungsdauer, während langlebige Workflow-Engines Prozesse mit unbestimmter Laufzeit orchestrieren, die auf externe Ereignisse warten können (z. B. menschliche Genehmigung über Tage oder Wochen) — beide lösen unterschiedliche Orchestrierungsprobleme und sollten nicht gegeneinander ausgetauscht werden.

~~~text
Airflow DAG:              scheduled execution (daily/hourly) -> bounded task duration -> backfill re-runs past intervals
Long-lived workflow engine: unbounded duration -> waits for external events (days/weeks) -> not primarily schedule-driven
Backfill without idempotent tasks -> re-running a past interval creates duplicates or wrong aggregates
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| DAG-Abhängigkeitsdesign | sind Task-Abhängigkeiten explizit und azyklisch definiert? | fehlende oder implizite Abhängigkeiten erzeugen Race Conditions zwischen Tasks |
| Backfill-Idempotenz | sind Tasks idempotent für sichere Backfill-Ausführung? | nicht-idempotente Tasks erzeugen bei Backfills Duplikate oder falsche Ergebnisse |
| Scheduler-Zeitintervall-Semantik | ist bekannt, dass eine Ausführung einem logischen Intervall entspricht, nicht dem tatsächlichen Ausführungszeitpunkt? | Verwechslung von logischem Intervall und tatsächlicher Ausführungszeit führt zu falschen Datenabgrenzungen |
| Airflow vs. langlebige Workflow-Engine | ist die Wahl der Orchestrierungsklasse für den tatsächlichen Anwendungsfall passend? | Airflow für Prozesse mit unbestimmter Laufzeit und externen Wartezuständen einzusetzen erzeugt Workarounds und Instabilität |

Implementierung: DAGs werden mit expliziten, azyklischen Task-Abhängigkeiten definiert, sodass der Scheduler die korrekte Ausführungsreihenfolge garantieren kann. Alle Tasks werden bewusst idempotent gestaltet (z. B. durch Löschen und Neuschreiben des Zielintervalls statt reinem Anhängen), damit Backfills sicher wiederholt ausgeführt werden können. Die Unterscheidung zwischen logischem Ausführungsintervall (welcher Zeitraum wird verarbeitet) und tatsächlichem Ausführungszeitpunkt (wann läuft der Task physisch) wird explizit im Task-Design berücksichtigt, um korrekte Datenabgrenzung sicherzustellen. Anwendungsfälle mit unbestimmter Laufzeit oder externen Wartezuständen (menschliche Genehmigung, lang laufende externe Prozesse) werden bewusst an eine dedizierte langlebige Workflow-Engine statt an Airflow delegiert.

## Scalability, Reliability, Security und Observability

Airflow skaliert Batch-Task-Orchestrierung gut für vorhersehbare, zeitplanbasierte Workloads mit begrenzter Task-Laufzeit, ist aber strukturell ungeeignet für Workflows, die Tage oder Wochen auf externe Ereignisse warten müssen. Reliability-Grenze: nicht-idempotente Tasks sind ein latentes Risiko, das erst bei einem tatsächlichen Backfill oder einer erneuten Ausführung nach einem Fehler sichtbar wird — bis dahin funktioniert die Pipeline scheinbar einwandfrei.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| nach einem Backfill enthalten Zieldaten Duplikate oder falsche Aggregate | Task-Logik ist nicht idempotent, Backfill-Ausführung hat bereits vorhandene Daten dupliziert statt ersetzt | prüfen, ob der Task-Zielschreibvorgang Upsert-/Ersetzungssemantik statt reinem Anhängen verwendet |
| Datenabgrenzung stimmt nicht mit dem erwarteten Zeitraum überein | logisches Ausführungsintervall wurde mit tatsächlichem Ausführungszeitpunkt verwechselt | Task-Logik auf korrekte Nutzung des logischen Intervall-Parameters statt der tatsächlichen Ausführungszeit prüfen |
| ein DAG blockiert unerwartet lange auf einen externen, langsamen menschlichen Genehmigungsschritt | Airflow wird für einen Anwendungsfall mit unbestimmter Laufzeit verwendet, der besser zu einer langlebigen Workflow-Engine passt | prüfen, ob der Prozess tatsächlich zeitplanbasiert ist oder eher ereignisgesteuerte, unbestimmte Wartezeiten erfordert |
| Tasks laufen in falscher oder unerwarteter Reihenfolge | DAG-Abhängigkeiten sind implizit oder unvollständig definiert | DAG-Definition auf explizite, vollständige Abhängigkeitsdeklaration zwischen allen relevanten Tasks prüfen |

Security: Airflow-Verbindungsdaten (Datenbank-Credentials, API-Keys für externe Systeme) sollten über einen dedizierten Secrets-Backend-Mechanismus verwaltet werden, nicht als Klartext in DAG-Code oder Umgebungsvariablen. Observability: DAG-Lauf-Erfolgsrate, Task-Laufzeit-Trends und Backfill-Historie sind zentrale Metriken zur Diagnose von Orchestrierungsproblemen.

## Trade-offs und Entscheidungen

**Staff** gestaltet alle Tasks bewusst idempotent für sichere Backfill-Ausführung. **Principal** macht die Unterscheidung zwischen logischem Intervall und tatsächlicher Ausführungszeit für das Team im Task-Design explizit. **Chief** positioniert Airflow als Werkzeug für zeitgeplante Batch-Orchestrierung, nicht als generelle Lösung für langlebige Geschäftsworkflows mit externen Wartezuständen.

Anti-Patterns: Tasks ohne Idempotenz-Prüfung betreiben und bei Backfills manuell Duplikate bereinigen; Airflow für Prozesse mit unbestimmter Laufzeit und externen menschlichen Wartezuständen einsetzen; logisches Ausführungsintervall und tatsächliche Ausführungszeit im Task-Code verwechseln.

## Production Checklist

- [ ] Alle Tasks sind idempotent, sichere Backfill-Ausführung ist getestet.
- [ ] DAG-Abhängigkeiten sind explizit und vollständig deklariert.
- [ ] Task-Logik nutzt konsequent das logische Ausführungsintervall, nicht die tatsächliche Ausführungszeit.
- [ ] Anwendungsfälle mit unbestimmter Laufzeit sind bewusst an eine langlebige Workflow-Engine statt an Airflow delegiert.

## Interviewfragen

### 1. Warum müssen Airflow-Tasks für sichere Backfill-Ausführung idempotent sein?

**Antwort:** Ein Backfill führt einen Task für ein historisches Zeitintervall erneut aus; ohne Idempotenz (z. B. reines Anhängen statt Ersetzen) entstehen dabei Duplikate oder fehlerhafte Aggregate, da dieselben Daten mehrfach verarbeitet werden.

### 2. Was ist der Unterschied zwischen logischem Ausführungsintervall und tatsächlicher Ausführungszeit in Airflow?

**Antwort:** Das logische Intervall beschreibt den Datenzeitraum, den ein DAG-Lauf verarbeiten soll (z. B. "gestern"), während die tatsächliche Ausführungszeit der physische Zeitpunkt ist, zu dem der Task läuft — beide können deutlich auseinanderfallen, insbesondere bei Backfills oder verzögerter Ausführung.

### 3. Warum ist Airflow nicht für Geschäftsworkflows mit unbestimmter Laufzeit geeignet?

**Antwort:** Airflow ist für zeitplanbasierte Ausführung mit begrenzter Task-Laufzeit optimiert; Prozesse, die auf externe Ereignisse mit unbestimmter Wartezeit warten müssen (z. B. menschliche Genehmigung über Tage), passen strukturell besser zu einer dedizierten langlebigen Workflow-Engine.

### 4. Wie diagnostizierst du Duplikate in Zieldaten nach einem Airflow-Backfill?

**Antwort:** Ich prüfe, ob der Task-Zielschreibvorgang Upsert- oder Ersetzungssemantik statt reinem Anhängen verwendet — fehlende Idempotenz ist die häufigste Ursache für Duplikate nach einem Backfill.

### 5. Was ist ein DAG in Airflow, und warum muss er azyklisch sein?

**Antwort:** Ein DAG (Directed Acyclic Graph) definiert Tasks und ihre Abhängigkeiten; er muss azyklisch sein, damit eine eindeutige, terminierende Ausführungsreihenfolge existiert — ein Zyklus würde eine unauflösbare zirkuläre Abhängigkeit erzeugen.

### 6. Widersprüchliche Anforderung: Team will Airflow für einen Genehmigungsprozess nutzen, der Tage bis Wochen auf eine menschliche Entscheidung wartet, UND die gewohnte Airflow-DAG-Struktur für alle Prozesse beibehalten — wie gehst du vor?

**Antwort:** Ich würde erklären, dass Airflow strukturell nicht für Tasks mit derart langer, unbestimmter Wartezeit ausgelegt ist (Ressourcenbindung, Scheduler-Semantik passen nicht); ich würde vorschlagen, den Genehmigungsprozess an eine dedizierte langlebige Workflow-Engine zu delegieren und Airflow nur für die zeitgeplanten, batch-artigen Vor- und Nachbearbeitungsschritte um diesen Prozess herum zu nutzen, statt den Genehmigungsschritt in Airflow zu erzwingen.

## Praktische Labs

~~~python
# Idempotent backfill model: re-running a past interval must not duplicate data
target_data = {}

def idempotent_task(logical_date, value):
    # UPSERT semantics: overwrite the target for this logical date, don't append
    target_data[logical_date] = value

def non_idempotent_task(logical_date, value):
    # APPEND semantics: unsafe for backfill re-runs
    target_data.setdefault(logical_date, [])
    target_data[logical_date].append(value)

# Idempotent: backfilling the same date twice yields the same final state
target_data.clear()
idempotent_task("2026-01-01", 100)
idempotent_task("2026-01-01", 100)  # backfill re-run
assert target_data["2026-01-01"] == 100  # no duplication

# Non-idempotent: backfilling the same date twice creates duplicates
target_data.clear()
non_idempotent_task("2026-01-01", 100)
non_idempotent_task("2026-01-01", 100)  # backfill re-run
assert len(target_data["2026-01-01"]) == 2  # DUPLICATE - this is the bug pattern
print(f"Idempotent task after 2 runs: single value. Non-idempotent task after 2 runs: {target_data['2026-01-01']} - duplicated.")
~~~

## Dependencies, Cross-References und Quellen

1. Apache Airflow: [DAGs Concept](https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/dags.html), abgerufen 2026-09-17.
2. Apache Airflow: [Backfill and Catchup](https://airflow.apache.org/docs/apache-airflow/stable/dag-run.html#backfill), abgerufen 2026-09-17.
3. Apache Airflow: [Idempotency Best Practices](https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html#requirements), abgerufen 2026-09-17.

Langlebige Geschäftsworkflows sind kanonisch in Domain 08 behandelt (siehe [KB-0191](../08-messaging-workflows/15-temporal-und-deterministische-workflows.md), [KB-0192](../08-messaging-workflows/16-durable-workflows-und-wartezustaende.md)). Produktspezifische Executor-Konfiguration vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Datensatzgesteuerte Scheduling (Data-Aware Scheduling, Tasks werden durch Datenverfügbarkeit statt nur Zeitplan ausgelöst) | Adopting | Für Pipelines mit variabler Datenankunft gegenüber starrem Zeitplan-Scheduling evaluieren. |
| Deklarative DAG-Definition über Konfiguration statt imperativem Python-Code | Adopting | Für einfache, repetitive DAG-Muster zur Reduktion von Boilerplate-Code evaluieren. |

Ein Team akzeptiert ein Airflow-DAG-Design erst, wenn Idempotenz aller Tasks nachweisbar getestet und die Abgrenzung zu langlebigen Workflow-Anwendungsfällen dokumentiert ist.
