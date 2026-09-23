---
{"id": "KB-0388", "title": "Jobs und Batchausführung", "domain": "16", "sequence": 10, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0384", "concepts": ["Pods und Lebenszyklen"], "needed_for": "understanding"}, {"id": "KB-0113", "concepts": ["Idempotenz als Systemgarantie"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen CronJob mit begrenzter Parallelität konfigurieren und ein verpasstes Zeitfenster simulieren, um das resultierende Wiederholungsverhalten zu beobachten.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein Completion-Modell (einzeln, feste Anzahl, Arbeitsschlange) so wählen, dass es der tatsächlichen Geschäftsworkflow-Semantik entspricht, statt eines pauschalen Standardmodells.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein doppelt ausgeführtes Batch-Verarbeitungsergebnis auf eine fehlende Idempotenzsicherung statt auf einen Kubernetes-Job-Fehler zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Idempotenzsicherung als verpflichtenden Standard für jeden Kubernetes-Job/CronJob im Unternehmen etablieren, um doppelte Ausführungen und verwaiste Arbeit sicher zu behandeln.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene Job-Tracking-Mechanismen (z. B. Indexed Jobs) im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis von Completion-Modellen und Idempotenz-Notwendigkeit, nicht jede spezifische Job-Tracking-Funktion."}}, "lab_validation": [{"lab_id": "KB-0388-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Job-Modell mit einer nicht idempotenten und einer idempotenten Verarbeitungsfunktion bei doppelter Ausführung", "evidence": "Eine simulierte doppelte Job-Ausführung (z. B. durch einen erneuten Start nach einem transienten Fehler) führt bei einer nicht idempotenten Verarbeitungsfunktion zu einem doppelt gezählten Ergebnis, während eine idempotente Verarbeitungsfunktion bei identischer doppelter Ausführung ein korrektes, einmaliges Ergebnis liefert.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, künstlich konstruiertes Doppelausführungsszenario."}]}
---
# Jobs und Batchausführung

> **Ziel:** Ein Kubernetes Job führt Pods bis zum erfolgreichen Abschluss aus (im Gegensatz zu Deployments, die dauerhaft laufen sollen), aufbauend auf den Pod-Grundlagen (siehe [KB-0384](06-pods-und-lebenszyklen.md)); ein CronJob plant Jobs nach einem Zeitplan. Der zentrale Punkt dieses Kapitels ist, dass die tatsächliche Geschäftsworkflow-Semantik (was bedeutet "korrekt abgeschlossen"?) das richtige Completion-Modell bestimmen muss, und dass Wiederholungen, verpasste Zeitfenster und mögliche Doppelstarts eine explizite Idempotenzsicherung (siehe [KB-0113](../05-distributed-systems/13-idempotenz-als-systemgarantie.md)) erfordern, um verwaiste oder doppelt gezählte Arbeit zu vermeiden.

## Zweck, Mental Model und Dependencies

Ein Job kann in unterschiedlichen Completion-Modellen konfiguriert werden: ein einzelner Abschluss (genau ein Pod muss erfolgreich abschließen), eine feste Anzahl an Abschlüssen (mehrere Pods müssen jeweils erfolgreich abschließen, z. B. für parallele, unabhängige Arbeitseinheiten), oder ein Arbeitsschlangen-Modell (mehrere Pods verarbeiten gemeinsam eine externe Warteschlange, bis diese leer ist). Ein CronJob erzeugt Jobs nach einem definierten Zeitplan (analog zu einem Unix-Cron-Ausdruck); verpasst der Kubernetes-Cluster ein geplantes Zeitfenster (z. B. weil der Cluster selbst zu diesem Zeitpunkt nicht verfügbar war), bestimmt eine konfigurierbare Richtlinie, ob der verpasste Lauf nachgeholt wird oder verloren geht. Der zentrale, oft unterschätzte Punkt ist, dass Kubernetes selbst keine Garantie gegen doppelte Ausführung eines Jobs bietet: ein transienter Netzwerkfehler oder ein Knotenausfall während der Ausführung eines Job-Pods kann dazu führen, dass Kubernetes einen neuen Pod für denselben Job startet, während der ursprüngliche Pod möglicherweise tatsächlich noch (unbemerkt) fertig wurde oder gerade fertig wird — dies kann zu doppelt ausgeführter Arbeit führen, wenn die vom Job durchgeführte Verarbeitung nicht idempotent ist. Ebenso kann "verwaiste Arbeit" entstehen: ein Pod, der eine Teilaufgabe begonnen, aber nicht sauber abgeschlossen hat, kann Ressourcen oder Zwischenzustände hinterlassen, die ohne explizite Bereinigung dauerhaft bestehen bleiben. Die korrekte Behandlung dieser Fälle erfordert, dass die vom Job durchgeführte Geschäftslogik selbst idempotent gestaltet ist (eine mehrfache Ausführung mit denselben Eingaben führt zum selben Endzustand, nicht zu kumulierten Effekten), statt sich auf eine (nicht existierende) Exactly-Once-Garantie von Kubernetes zu verlassen.

~~~text
Job completion models: single completion / fixed completion count / work-queue (shared external queue)
CronJob: schedules jobs per a cron-like schedule; MISSED schedule window -> configurable policy: catch up or skip
CRITICAL, OFTEN UNDERESTIMATED POINT: Kubernetes provides NO exactly-once guarantee for job execution
  transient network fault / node failure during a job pod's run -> Kubernetes may start a NEW pod for the SAME job
  while the ORIGINAL pod may actually still be (unnoticed) finishing or already finished
  -> DUPLICATE execution risk if the job's processing logic is NOT idempotent
ORPHANED WORK: a pod that started but didn't cleanly finish a sub-task can leave resources/partial state behind
  -> without explicit cleanup, this persists indefinitely
FIX: the job's BUSINESS LOGIC itself must be idempotent (repeated execution with same input -> same end state,
  not cumulative effects) -- NOT relying on a (non-existent) exactly-once guarantee from Kubernetes
~~~

## Core Concepts, Architektur und Implementierung

| Completion-Modell | Geeignet für | Idempotenz-Notwendigkeit |
|---|---|---|
| Einzelner Abschluss | einmalige, klar abgegrenzte Aufgabe | Wiederholung nach Fehler muss dieselbe Aufgabe sicher erneut ausführen können |
| Feste Anzahl Abschlüsse | mehrere unabhängige, parallele Arbeitseinheiten | jede Einheit muss individuell idempotent sein |
| Arbeitsschlangen-Modell | dynamische, extern verwaltete Arbeitsmenge | jede aus der Warteschlange entnommene Aufgabe muss idempotent verarbeitbar sein |

Implementierung: Vor der Wahl eines Completion-Modells wird die tatsächliche Geschäftsworkflow-Semantik geklärt — handelt es sich um eine einzelne Aufgabe, mehrere unabhängige parallele Einheiten, oder eine dynamische Warteschlange? Für jedes Modell wird die durchgeführte Verarbeitungslogik explizit idempotent gestaltet (z. B. durch Prüfung, ob ein bestimmtes Ergebnis bereits existiert, bevor es erneut erzeugt wird, oder durch Verwendung eindeutiger Idempotenzschlüssel, siehe [KB-0113](../05-distributed-systems/13-idempotenz-als-systemgarantie.md)), sodass eine mögliche Doppelausführung durch Kubernetes das Endergebnis nicht verfälscht. Bei CronJobs wird die Richtlinie für verpasste Zeitfenster (Nachholen oder Überspringen) explizit basierend auf der tatsächlichen Geschäftsanforderung konfiguriert, statt der Standardeinstellung blind zu vertrauen.

## Scalability, Reliability, Security und Observability

Idempotent gestaltete Jobs skalieren Zuverlässigkeit unabhängig von der Häufigkeit transienter Infrastrukturfehler; die Reliability-Grenze liegt darin, dass nicht idempotente Verarbeitungslogik proportional zur Häufigkeit von Knotenausfällen oder Netzwerkproblemen das Risiko doppelt gezählter oder fehlerhafter Geschäftsergebnisse erhöht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Batch-Verarbeitungsjob hat ein Ergebnis doppelt gezählt oder doppelt verarbeitet | die Verarbeitungslogik ist nicht idempotent und wurde durch eine Kubernetes-bedingte Doppelausführung tatsächlich zweimal ausgeführt | prüfen, ob ein transienter Fehler zu einer erneuten Pod-Ausführung führte, und die Verarbeitungslogik um eine Idempotenzsicherung ergänzen |
| ein geplanter CronJob-Lauf fehlt vollständig für einen bestimmten Zeitraum | die Richtlinie für verpasste Zeitfenster war auf "überspringen" statt "nachholen" konfiguriert, während der Cluster zu diesem Zeitpunkt nicht verfügbar war | die konfigurierte Richtlinie für verpasste Zeitfenster gegen die tatsächliche Geschäftsanforderung prüfen |
| nach einem fehlgeschlagenen Job-Lauf bleiben Zwischenressourcen oder inkonsistente Zustände bestehen | ein Pod hat eine Teilaufgabe begonnen, aber nicht sauber abgeschlossen, ohne dass eine Bereinigungslogik greift | eine explizite Bereinigungs-/Kompensationslogik für unvollständig abgeschlossene Teilaufgaben implementieren |

Security: Nicht idempotente Jobs, die sicherheitsrelevante Aktionen durchführen (z. B. Berechtigungsänderungen, Zahlungsauslösungen), können bei doppelter Ausführung reale, potenziell schädliche Doppeleffekte verursachen; Idempotenzsicherung ist hier besonders kritisch. Observability: Die Häufigkeit erkannter Doppelausführungsversuche (die durch Idempotenzsicherung korrekt abgefangen wurden), sowie die Häufigkeit verpasster CronJob-Zeitfenster, sind zentrale Zuverlässigkeitsmetriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Idempotenzsicherung für jede von einem Job durchgeführte Geschäftslogik. **Principal** macht das gewählte Completion-Modell und dessen Begründung für das Team nachvollziehbar. **Chief** etabliert Idempotenzsicherung als verpflichtenden Standard für jeden Kubernetes-Job/CronJob im Unternehmen, um doppelte Ausführungen und verwaiste Arbeit sicher zu behandeln.

Anti-Patterns: sich auf eine (nicht existierende) Exactly-Once-Garantie von Kubernetes für Job-Ausführungen verlassen; ein Completion-Modell ohne Bezug zur tatsächlichen Geschäftsworkflow-Semantik wählen; verwaiste Zwischenzustände nach unvollständig abgeschlossenen Job-Läufen ohne Bereinigungslogik belassen.

## Production Checklist

- [ ] Die von jedem Job durchgeführte Verarbeitungslogik ist explizit idempotent gestaltet.
- [ ] Das gewählte Completion-Modell entspricht der tatsächlichen Geschäftsworkflow-Semantik.
- [ ] Die Richtlinie für verpasste CronJob-Zeitfenster ist explizit an die Geschäftsanforderung angepasst.
- [ ] Eine Bereinigungslogik behandelt unvollständig abgeschlossene Teilaufgaben.

## Interviewfragen

### 1. Warum bietet Kubernetes keine Exactly-Once-Garantie für Job-Ausführungen?

**Antwort:** Ein transienter Netzwerkfehler oder Knotenausfall kann dazu führen, dass Kubernetes einen neuen Pod für denselben Job startet, während der ursprüngliche Pod möglicherweise unbemerkt noch läuft oder bereits fertig ist, was zu doppelter Ausführung führen kann.

### 2. Warum ist Idempotenz der eigentlichen Verarbeitungslogik entscheidend für zuverlässige Kubernetes-Jobs?

**Antwort:** Da Kubernetes selbst keine Garantie gegen doppelte Ausführung bietet, muss die Geschäftslogik selbst sicherstellen, dass eine mehrfache Ausführung mit denselben Eingaben zum selben Endzustand führt, statt kumulierte, fehlerhafte Effekte zu erzeugen.

### 3. Welche drei Completion-Modelle gibt es für Kubernetes-Jobs, und wann ist welches geeignet?

**Antwort:** Einzelner Abschluss für eine klar abgegrenzte Einzelaufgabe, feste Anzahl Abschlüsse für mehrere unabhängige parallele Einheiten, und Arbeitsschlangen-Modell für dynamische, extern verwaltete Arbeitsmengen.

### 4. Was bedeutet "verwaiste Arbeit" im Kontext von Kubernetes-Jobs?

**Antwort:** Ressourcen oder Zwischenzustände, die ein Pod bei einer nicht sauber abgeschlossenen Teilaufgabe hinterlässt und die ohne explizite Bereinigungslogik dauerhaft bestehen bleiben.

### 5. Wie gehst du vor, wenn ein Batch-Verarbeitungsjob ein Ergebnis doppelt gezählt hat?

**Antwort:** Ich prüfe, ob ein transienter Fehler zu einer erneuten Pod-Ausführung für denselben Job führte, und ergänze die Verarbeitungslogik um eine explizite Idempotenzsicherung (z. B. eindeutige Idempotenzschlüssel).

### 6. Widersprüchliche Anforderung: Team will schnelle, unkomplizierte Batch-Verarbeitung UND garantiert keine doppelt gezählten Ergebnisse bei transienten Fehlern — wie gehst du vor?

**Antwort:** Ich würde eine leichtgewichtige Idempotenzsicherung (z. B. eine Prüfung anhand eines eindeutigen Verarbeitungsschlüssels, ob ein Ergebnis bereits existiert) in die Verarbeitungslogik integrieren, die minimalen Zusatzaufwand verursacht, aber garantiert, dass eine durch Kubernetes verursachte Doppelausführung keine kumulierten, fehlerhaften Ergebnisse erzeugt.

## Praktische Labs

~~~python
processed_results = {}

def non_idempotent_process(task_id, amount):
    # BAD: cumulative effect on every call, even if called twice for the same task
    processed_results[task_id] = processed_results.get(task_id, 0) + amount

def idempotent_process(task_id, amount):
    # GOOD: repeated calls for the SAME task_id produce the SAME end state
    processed_results[task_id] = amount

# Simulate a Kubernetes job being executed TWICE for the same task due to a transient failure
processed_results.clear()
non_idempotent_process("task-1", 100)
non_idempotent_process("task-1", 100)  # duplicate execution
print(f"Non-idempotent result after duplicate execution: {processed_results['task-1']} (expected: 100, got wrong cumulative value)")

processed_results.clear()
idempotent_process("task-1", 100)
idempotent_process("task-1", 100)  # duplicate execution
print(f"Idempotent result after duplicate execution: {processed_results['task-1']} (correct, unaffected by duplicate)")
~~~

## Dependencies, Cross-References und Quellen

1. Kubernetes-Dokumentation: [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/), abgerufen 2026-09-17.
2. Kubernetes-Dokumentation: [CronJob](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/), abgerufen 2026-09-17.

Pods und Lebenszyklen sind kanonisch in [KB-0384](06-pods-und-lebenszyklen.md) behandelt; Idempotenz als Systemgarantie in [KB-0113](../05-distributed-systems/13-idempotenz-als-systemgarantie.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Indexed Jobs mit integriertem, eindeutigem Index pro Pod für einfachere Idempotenzschlüssel-Zuordnung | Adopting | Gegenüber manueller Index-Verwaltung für konsistentere, weniger fehleranfällige parallele Job-Verarbeitung bevorzugen. |
| Automatisierte Dead-Letter-Mechanismen für dauerhaft fehlschlagende Job-Ausführungen | Evaluating | Gegenüber unbegrenzten Wiederholungsversuchen abwägen, sobald ein zuverlässiges Dead-Letter-Handling für den konkreten Anwendungsfall verfügbar ist. |

Ein Team akzeptiert eine Job-/CronJob-Implementierung erst, wenn die zugrunde liegende Verarbeitungslogik nachweislich idempotent gestaltet ist.
