---
{"id": "KB-0384", "title": "Pods und Lebenszyklen", "domain": "16", "sequence": 6, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0380", "concepts": ["CRI und Container-Runtimes"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Pod mit mehreren Containern und konfigurierten Startup-, Liveness- und Readiness-Probes erstellen und das Verhalten bei fehlgeschlagener Probe beobachten.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Probe-Typen (Startup, Liveness, Readiness) so konfigurieren, dass sie die jeweils tatsächlich relevante Frage beantworten, statt eine Probe für alle Zwecke zu verwenden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein wiederholtes Container-Neustartverhalten auf eine fehlkonfigurierte Liveness-Probe statt auf ein tatsächliches Anwendungsproblem zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Korrekte Probe-Konfiguration (Unterscheidung von Startup/Liveness/Readiness) als Standard für Anwendungs-Deployments im Unternehmen etablieren, um unnötige Neustarts und Verfügbarkeitseinbußen zu vermeiden.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene Pod-Lifecycle-Hooks (PreStop, PostStart) im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis der drei Probe-Typen und ihrer jeweiligen Zwecke, nicht jeder einzelne Lifecycle-Hook."}}, "lab_validation": [{"lab_id": "KB-0384-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Pod-Modell mit einer fehlkonfigurierten Liveness-Probe, die während einer langsamen Anwendungsinitialisierung fehlschlägt", "evidence": "Eine Liveness-Probe, die dieselbe strenge Prüfung wie eine Readiness-Probe verwendet, schlägt während der langsamen Initialisierungsphase der Anwendung wiederholt fehl und löst Neustarts aus, obwohl die Anwendung sich noch in einem normalen, nicht fehlerhaften Startvorgang befindet; eine korrekt konfigurierte Startup-Probe verhindert dieses fälschliche Neustartverhalten.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, künstlich konstruiertes Timing-Szenario."}]}
---
# Pods und Lebenszyklen

> **Ziel:** Ein Pod ist eine Gruppe von einem oder mehreren Containern, die gemeinsam auf demselben Knoten geplant werden und sich Netzwerk-Namespace und bestimmte Ressourcen teilen, aufbauend auf der CRI-Ebene (siehe [KB-0380](02-cri-und-container-runtimes.md)). Der zentrale Punkt dieses Kapitels ist die korrekte Unterscheidung der drei Probe-Typen — Startup, Liveness, Readiness — die jeweils eine unterschiedliche Frage beantworten, sowie das Verständnis von Termination und Restart-Verhalten bei fehlgeschlagenen Prüfungen.

## Zweck, Mental Model und Dependencies

Eine Startup-Probe beantwortet die Frage "ist die Anwendung mit ihrer Initialisierung fertig?" und wird nur einmal während des Starts geprüft — solange sie nicht erfolgreich ist, werden Liveness- und Readiness-Probes nicht ausgeführt, was verhindert, dass eine langsam startende Anwendung fälschlich als "abgestürzt" (Liveness) oder "nicht bereit" (Readiness) interpretiert wird, bevor sie überhaupt vollständig gestartet ist. Eine Liveness-Probe beantwortet die Frage "läuft der Prozess noch in einem funktionsfähigen Zustand, oder ist er in einem Zustand hängengeblieben, aus dem er sich nicht selbst erholen kann?" — schlägt sie fehl, wird der Container neu gestartet, da davon ausgegangen wird, dass ein Neustart die einzige Möglichkeit zur Wiederherstellung ist. Eine Readiness-Probe beantwortet die Frage "ist der Container aktuell bereit, Anfragen zu empfangen?" — schlägt sie fehl, wird der Pod aus dem Lastverteilungspool eines Kubernetes Service entfernt, aber nicht neu gestartet, da der Container möglicherweise nur vorübergehend beschäftigt oder von einer externen Abhängigkeit blockiert ist, aber grundsätzlich funktionsfähig bleibt. Der häufigste, praktisch folgenreiche Konfigurationsfehler ist, eine Liveness-Probe mit demselben strengen Kriterium wie eine Readiness-Probe zu konfigurieren: eine Anwendung, die während einer langsamen, aber normalen Initialisierung oder bei vorübergehender Überlastung die Liveness-Probe nicht besteht, wird unnötig neu gestartet, obwohl ein Neustart das eigentliche Problem (z. B. eine überlastete Abhängigkeit) nicht löst und im schlimmsten Fall eine Neustartschleife erzeugt.

~~~text
Startup probe: "has the app finished initializing?" -- checked ONCE at start
  until it succeeds: liveness/readiness probes DON'T run -- prevents slow-starting apps being wrongly killed/marked-not-ready
Liveness probe: "is the process still in a WORKING state, or stuck beyond self-recovery?"
  fails -> container RESTARTED (assumption: restart is the only path to recovery)
Readiness probe: "is the container CURRENTLY ready to receive traffic RIGHT NOW?"
  fails -> pod removed from Service load-balancing pool, NOT restarted (may be temporarily busy/blocked, still fundamentally healthy)
MOST COMMON HIGH-IMPACT MISCONFIGURATION: liveness probe using the SAME strict criterion as readiness
  -> app failing liveness during normal slow startup or temporary overload gets UNNECESSARILY RESTARTED
  -> restart doesn't fix the real issue (e.g. an overloaded dependency) -> can create a RESTART LOOP
~~~

## Core Concepts, Architektur und Implementierung

| Probe-Typ | Beantwortete Frage | Konsequenz bei Fehlschlag |
|---|---|---|
| Startup | ist die Initialisierung abgeschlossen? | Liveness/Readiness werden erst danach geprüft |
| Liveness | ist der Prozess noch funktionsfähig oder hängengeblieben? | Container-Neustart |
| Readiness | ist der Container aktuell bereit für Anfragen? | Entfernung aus dem Lastverteilungspool, kein Neustart |

Implementierung: Für Anwendungen mit einer langsamen Initialisierungsphase wird eine Startup-Probe mit ausreichend großzügigem Zeitfenster konfiguriert, um fälschliche Neustarts während des normalen Starts zu verhindern. Die Liveness-Probe wird bewusst mit einem lockereren Kriterium konfiguriert als die Readiness-Probe (z. B. "der Prozess antwortet grundsätzlich" statt "alle Abhängigkeiten sind aktuell erreichbar"), da ein Neustart nur bei einem tatsächlich nicht selbst behebbaren Zustand sinnvoll ist. Die Readiness-Probe prüft dagegen strenger den tatsächlichen Bereitschaftszustand für Produktionsverkehr, einschließlich der Erreichbarkeit kritischer Abhängigkeiten, da ein vorübergehendes Herausnehmen aus dem Lastverteilungspool ohne Neustart die angemessene Reaktion auf eine temporäre Nichtverfügbarkeit ist.

## Scalability, Reliability, Security und Observability

Korrekt konfigurierte Probes skalieren Verfügbarkeit proportional zur Genauigkeit, mit der jede Probe tatsächlich die ihr zugedachte Frage beantwortet; die Reliability-Grenze liegt darin, dass eine zu strenge Liveness-Probe proportional zur Häufigkeit vorübergehender Belastungsspitzen unnötige Neustarts und im Extremfall Neustartschleifen erzeugt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Container wird wiederholt neu gestartet, obwohl die Anwendung selbst funktionsfähig scheint | die Liveness-Probe ist zu streng konfiguriert und schlägt bei vorübergehender Last oder langsamer Initialisierung fälschlich fehl | die Liveness-Probe-Kriterien lockern oder eine separate Startup-Probe für die Initialisierungsphase konfigurieren |
| ein Pod bleibt dauerhaft aus dem Lastverteilungspool entfernt, obwohl die Anwendung normal läuft | die Readiness-Probe prüft eine Abhängigkeit, die dauerhaft nicht erreichbar ist | die Readiness-Probe-Abhängigkeitsprüfung und den tatsächlichen Status der geprüften Abhängigkeit untersuchen |
| eine langsam startende Anwendung wird während ihrer normalen Initialisierung wiederholt neu gestartet | keine Startup-Probe wurde konfiguriert, wodurch die Liveness-Probe bereits während der Initialisierung greift | eine Startup-Probe mit ausreichendem Zeitfenster für die tatsächliche Initialisierungsdauer konfigurieren |

Security: Eine Readiness-Probe, die auf einen für den Nutzer ungeschützten Endpunkt zugreift, kann selbst zur Angriffsfläche werden; Probe-Endpunkte sollten minimal und ausschließlich für interne Gesundheitsprüfungen zugänglich sein. Observability: Die Neustartrate pro Pod (ausgelöst durch Liveness-Fehlschläge) und die Zeit, die Pods außerhalb des Lastverteilungspools verbringen (ausgelöst durch Readiness-Fehlschläge), sind zentrale Metriken zur Beurteilung der Probe-Konfigurationsqualität.

## Trade-offs und Entscheidungen

**Staff** implementiert getrennt konfigurierte Startup-, Liveness- und Readiness-Probes je nach tatsächlichem Anwendungsverhalten. **Principal** macht die Probe-Konfiguration und ihre Begründung für das Team nachvollziehbar. **Chief** etabliert korrekte Probe-Konfiguration als Standard für Anwendungs-Deployments im Unternehmen, um unnötige Neustarts und Verfügbarkeitseinbußen zu vermeiden.

Anti-Patterns: eine Liveness-Probe mit demselben strengen Kriterium wie eine Readiness-Probe konfigurieren; keine Startup-Probe für Anwendungen mit langsamer Initialisierung konfigurieren; Probe-Fehlschläge ohne Prüfung der zugrunde liegenden Ursache pauschal durch häufigere Neustarts "lösen".

## Production Checklist

- [ ] Anwendungen mit langsamer Initialisierung besitzen eine konfigurierte Startup-Probe.
- [ ] Die Liveness-Probe verwendet ein lockereres Kriterium als die Readiness-Probe.
- [ ] Die Readiness-Probe prüft die tatsächliche Bereitschaft für Produktionsverkehr, einschließlich kritischer Abhängigkeiten.
- [ ] Probe-Endpunkte sind minimal und nicht öffentlich als Angriffsfläche zugänglich.

## Interviewfragen

### 1. Welche Frage beantwortet jeweils eine Startup-, Liveness- und Readiness-Probe?

**Antwort:** Startup: ist die Initialisierung abgeschlossen? Liveness: ist der Prozess noch funktionsfähig oder hängengeblieben? Readiness: ist der Container aktuell bereit für Anfragen?

### 2. Was ist die häufigste, folgenreiche Fehlkonfiguration bei Kubernetes-Probes?

**Antwort:** Eine Liveness-Probe mit demselben strengen Kriterium wie eine Readiness-Probe zu konfigurieren, was zu unnötigen Neustarts bei vorübergehender Last oder langsamer Initialisierung führt.

### 3. Warum führt eine fehlgeschlagene Liveness-Probe zu einem Neustart, während eine fehlgeschlagene Readiness-Probe das nicht tut?

**Antwort:** Eine fehlgeschlagene Liveness-Probe geht davon aus, dass der Prozess in einem nicht selbst behebbaren Zustand hängt, während eine fehlgeschlagene Readiness-Probe davon ausgeht, dass der Container vorübergehend beschäftigt oder blockiert, aber grundsätzlich funktionsfähig ist.

### 4. Wie verhindert eine Startup-Probe unnötige Neustarts bei langsam startenden Anwendungen?

**Antwort:** Solange die Startup-Probe nicht erfolgreich ist, werden Liveness- und Readiness-Probes nicht ausgeführt, wodurch eine noch initialisierende Anwendung nicht fälschlich als abgestürzt oder nicht bereit interpretiert wird.

### 5. Wie gehst du vor, wenn ein Container wiederholt neu gestartet wird, obwohl die Anwendung funktionsfähig scheint?

**Antwort:** Ich prüfe, ob die Liveness-Probe zu streng konfiguriert ist und bei vorübergehender Last oder langsamer Initialisierung fälschlich fehlschlägt, und lockere die Kriterien oder ergänze eine Startup-Probe.

### 6. Widersprüchliche Anforderung: Team will schnelle Erkennung tatsächlich hängengebliebener Prozesse UND garantiert keine unnötigen Neustarts bei vorübergehender Last — wie gehst du vor?

**Antwort:** Ich würde die Liveness-Probe bewusst auf ein minimales, lockeres Kriterium beschränken (z. B. reine Prozessreaktionsfähigkeit ohne Abhängigkeitsprüfung), während eine strengere Readiness-Probe die tatsächliche Betriebsbereitschaft inklusive Abhängigkeiten prüft, sodass vorübergehende Last nur zur Herausnahme aus dem Lastverteilungspool, nicht zum Neustart führt, während echtes Hängenbleiben weiterhin schnell über die Liveness-Probe erkannt wird.

## Praktische Labs

~~~python
class SimulatedContainer:
    def __init__(self, startup_duration, is_stuck=False):
        self.startup_duration = startup_duration
        self.elapsed = 0
        self.is_stuck = is_stuck
        self.restart_count = 0

    def tick(self):
        self.elapsed += 1

    def startup_probe(self):
        return self.elapsed >= self.startup_duration

    def liveness_probe(self, lenient=True):
        if lenient:
            return not self.is_stuck  # loose criterion: just "is the process alive at all"
        else:
            return self.startup_probe() and not self.is_stuck  # strict criterion, mirrors readiness incorrectly

def simulate(container, use_startup_probe, liveness_lenient):
    for _ in range(container.startup_duration + 2):
        container.tick()
        if use_startup_probe and not container.startup_probe():
            continue  # liveness/readiness not checked yet -- startup probe still pending
        if not container.liveness_probe(lenient=liveness_lenient):
            container.restart_count += 1

slow_starting_app = SimulatedContainer(startup_duration=5)
simulate(slow_starting_app, use_startup_probe=False, liveness_lenient=False)
print(f"WITHOUT startup probe, strict liveness during slow start -> restarts: {slow_starting_app.restart_count}")

slow_starting_app_fixed = SimulatedContainer(startup_duration=5)
simulate(slow_starting_app_fixed, use_startup_probe=True, liveness_lenient=True)
print(f"WITH startup probe + lenient liveness -> restarts: {slow_starting_app_fixed.restart_count}")
~~~

## Dependencies, Cross-References und Quellen

1. Kubernetes-Dokumentation: [Configure Liveness, Readiness and Startup Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/), abgerufen 2026-09-17.
2. Kubernetes-Dokumentation: [Pod Lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/), abgerufen 2026-09-17.

CRI und Container-Runtimes sind kanonisch in [KB-0380](02-cri-und-container-runtimes.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Probe-Konfigurationsanalyse-Werkzeuge, die auf identische Liveness-/Readiness-Kriterien als Warnsignal hinweisen | Evaluating | Gegenüber manueller Code-Review-Prüfung abwägen, sobald ein zuverlässiges Analysewerkzeug für die konkreten Manifest-Formate verfügbar ist. |
| Standardisierte, framework-integrierte Health-Check-Endpunkte, die getrennte Startup-/Liveness-/Readiness-Signale nativ bereitstellen | Adopting | Gegenüber selbst implementierten Health-Check-Endpunkten für konsistentere, weniger fehleranfällige Probe-Implementierung bevorzugen. |

Ein Team akzeptiert eine Probe-Konfiguration erst, wenn Liveness- und Readiness-Kriterien nachweislich unterschiedliche, jeweils passende Fragen beantworten.
