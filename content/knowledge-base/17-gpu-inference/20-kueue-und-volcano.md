---
{"id": "KB-0432", "title": "Kueue und Volcano", "domain": "17", "sequence": 20, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "MLOPS"], "requires": [{"id": "KB-0394", "concepts": ["Scheduling und Platzierungsregeln"], "needed_for": "understanding"}, {"id": "KB-0388", "concepts": ["Jobs und Batchausführung"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Queue-Konfiguration mit Admission-Regeln und reservierter Kapazität anhand offizieller Kueue-Dokumentation nachvollziehen und erklären können, warum Gang Scheduling für verteilte GPU-Trainingsworkloads notwendig ist.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Fair-Share-Regeln und reservierte Kapazität für konkurrierende GPU-Batchworkloads mehrerer Teams so gestalten, dass weder Ressourcenverschwendung noch systematische Benachteiligung einzelner Teams entsteht.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Verzögerung oder einen Deadlock bei verteilten GPU-Trainingsjobs auf fehlendes Gang Scheduling oder eine fehlerhafte Admission-Konfiguration zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Queue- und Fair-Share-Richtlinien für konkurrierende GPU-Batchworkloads im Unternehmen anhand nachvollziehbarer, dokumentierter Kriterien statt informeller Priorisierung festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der Kueue- oder Volcano-Scheduler-Algorithmen im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Queues, Admission und Gang Scheduling als Entscheidungsgrundlage, nicht die Scheduler-Interna."}}, "lab_validation": [{"lab_id": "KB-0432-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Konzeptuelle Einordnung anhand offizieller Kueue- und Volcano-Dokumentation, kein aktives Cluster-Deployment verwendet", "evidence": "Anhand der offiziellen Dokumentation von Kueue und Volcano wird nachvollzogen, wie Queues konkurrierende Batchworkloads mehrerer Teams organisieren, wie Admission-Regeln entscheiden, wann ein Job tatsächlich zur Ausführung zugelassen wird, und wie Gang Scheduling sicherstellt, dass alle Teile eines verteilten Trainingsjobs gemeinsam gestartet werden, statt teilweise zu starten und auf fehlende Ressourcen zu warten.", "limitations": "Kein reales Cluster-Deployment getestet, keine realen Fair-Share- oder Auslastungsmessungen erhoben."}]}
---
# Kueue und Volcano

> **Ziel:** Kueue und Volcano sind Batch-Scheduling-Systeme für Kubernetes, die Queues (Warteschlangen für konkurrierende Batchworkloads mehrerer Teams), Admission-Regeln (Entscheidung, wann ein Job tatsächlich zur Ausführung zugelassen wird, basierend auf verfügbarer Kapazität) und Gang Scheduling (alle Teile eines verteilten Jobs werden gemeinsam gestartet, nicht teilweise) bereitstellen, um GPU-Batchworkloads (z. B. verteiltes Modelltraining, siehe [KB-0388](09-daemonsets-und-node-dienste.md) für Job-Grundlagen) über mehrere konkurrierende Teams hinweg fair und effizient zu verwalten. Der zentrale Punkt dieses Kapitels ist, dass Standard-Kubernetes-Scheduling (siehe [KB-0394](16-scheduling-und-platzierungsregeln.md)) für verteilte, mehrteilige GPU-Trainingsjobs unzureichend ist — ohne Gang Scheduling kann ein Teil eines verteilten Jobs starten, während andere Teile auf freie Ressourcen warten, was zu Deadlocks oder verschwendeter GPU-Kapazität führt, und ohne Fair-Share-Mechanismen kann ein Team systematisch mehr Kapazität beanspruchen als ihm zusteht, während andere Teams warten.

## Zweck, Mental Model und Dependencies

Das Standard-Kubernetes-Scheduling platziert Pods unabhängig voneinander basierend auf verfügbaren Ressourcen zum jeweiligen Zeitpunkt — für einen verteilten Trainingsjob, der z. B. acht GPU-Worker-Pods benötigt, die gleichzeitig kommunizieren müssen, bedeutet dies, dass einzelne Worker-Pods gestartet werden könnten, während andere aufgrund fehlender Kapazität in der Warteschlange verbleiben, was den bereits gestarteten Teil des Jobs blockiert (da er auf die fehlenden Worker wartet) und GPU-Kapazität verschwendet, ohne dass Fortschritt gemacht wird. Gang Scheduling löst dieses Problem, indem der Scheduler prüft, ob ausreichend Kapazität für ALLE Teile eines Jobs gleichzeitig verfügbar ist, bevor irgendein Teil gestartet wird — entweder der gesamte Job startet gemeinsam, oder keiner seiner Teile wird gestartet. Queues und Admission-Regeln organisieren konkurrierende Jobs mehrerer Teams: Jedes Team erhält eine Queue mit einer definierten Kapazitätsgrenze (z. B. maximale Anzahl gleichzeitig nutzbarer GPUs), und Fair-Share-Mechanismen stellen sicher, dass bei Kapazitätsknappheit die verfügbare Kapazität proportional zur vereinbarten Kapazitätszuteilung zwischen den Teams verteilt wird, statt dass das Team mit den frühesten oder häufigsten Anfragen die gesamte Kapazität beansprucht. Der zentrale methodische Punkt ist, dass reservierte Kapazität (garantierte Mindestkapazität pro Team) und Fair Share (proportionale Verteilung überschüssiger Kapazität) gemeinsam konfiguriert werden müssen, um sowohl Planungssicherheit für einzelne Teams als auch effiziente Gesamtauslastung des Clusters zu gewährleisten.

~~~text
Standard K8s scheduling: places pods INDEPENDENTLY based on capacity at that moment
  distributed job (e.g. 8 GPU workers needing simultaneous communication):
  SOME workers could start while others wait -> started part BLOCKED, GPU capacity WASTED, no progress
Gang scheduling: scheduler checks capacity for ALL parts of a job SIMULTANEOUSLY before starting ANY
  -> either the WHOLE job starts together, or NONE of it does
Queues + admission rules: organize competing jobs across teams
  each team's queue has a capacity limit (e.g. max concurrent GPUs)
  fair share: at capacity scarcity, available capacity distributed PROPORTIONALLY to agreed allocation
    (not first-come-first-served monopolization by one team)
KEY METHODOLOGICAL POINT: reserved capacity (guaranteed minimum per team) AND
  fair share (proportional distribution of surplus capacity) must be configured TOGETHER
  -> planning certainty per team + efficient overall cluster utilization
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Queue | organisiert konkurrierende Jobs eines Teams/Bereichs | Kapazitätsgrenze muss zum tatsächlichen, vereinbarten Bedarf des Teams passen |
| Admission-Regeln | entscheiden, wann ein Job tatsächlich startet | müssen ausreichende Gesamtkapazität für den Job berücksichtigen |
| Gang Scheduling | startet alle Teile eines verteilten Jobs gemeinsam | verhindert Deadlocks und verschwendete Kapazität bei mehrteiligen Jobs |
| Fair Share | verteilt überschüssige Kapazität proportional | verhindert systematische Monopolisierung durch ein einzelnes Team |

Implementierung: Für jeden verteilten GPU-Trainingsjob wird geprüft, ob Gang Scheduling aktiviert ist, sodass der Job nur startet, wenn tatsächlich ausreichend Kapazität für alle seine Teile gleichzeitig verfügbar ist. Jede Team-Queue wird mit einer reservierten Mindestkapazität konfiguriert, die dem vereinbarten, dokumentierten Bedarf des Teams entspricht, sowie mit einer Fair-Share-Regel für überschüssige, ungenutzte Kapazität anderer Teams. Bei Kapazitätsknappheit wird die tatsächliche Verteilung der verfügbaren Kapazität gegen die konfigurierten Fair-Share-Regeln geprüft, um sicherzustellen, dass kein Team systematisch benachteiligt wird.

## Scalability, Reliability, Security und Observability

Kueue und Volcano skalieren die effiziente Nutzung der GPU-Gesamtkapazität eines Clusters proportional zur Passgenauigkeit der Queue- und Fair-Share-Konfiguration zum tatsächlichen, konkurrierenden Bedarf mehrerer Teams; die Reliability-Grenze liegt darin, dass fehlendes Gang Scheduling proportional zur Anzahl gleichzeitig konkurrierender, mehrteiliger Jobs zu Deadlocks oder verschwendeter, ungenutzter GPU-Kapazität führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein verteilter Trainingsjob startet teilweise und bleibt dann hängen | Gang Scheduling ist nicht aktiviert, wodurch einzelne Worker-Pods unabhängig gestartet wurden | die Gang-Scheduling-Konfiguration für diesen Job-Typ prüfen und aktivieren |
| ein Team beansprucht systematisch mehr GPU-Kapazität als vereinbart, während andere Teams warten | die Fair-Share-Konfiguration ist nicht korrekt eingerichtet oder wird nicht durchgesetzt | die Fair-Share-Regeln gegen die tatsächliche Kapazitätsverteilung über die Zeit prüfen |
| GPU-Kapazität bleibt trotz wartender Jobs ungenutzt | die Admission-Regeln oder Queue-Konfiguration verhindern unnötig die Zulassung wartender Jobs | die Admission-Bedingungen gegen die tatsächlich verfügbare Kapazität prüfen |

Security: Queue-Zugriff und Kapazitätszuteilung sollten mit denselben RBAC-Mechanismen wie andere produktive Cluster-Ressourcen abgesichert werden, um zu verhindern, dass ein Team ohne Berechtigung Kapazität einer anderen Team-Queue beansprucht. Observability: Die tatsächliche Kapazitätsauslastung pro Team-Queue, die Wartezeit in der Queue bis zur Admission, und die Häufigkeit fehlgeschlagener Gang-Scheduling-Versuche sind zentrale Metriken zur Bewertung der Fairness und Effizienz.

## Trade-offs und Entscheidungen

**Staff** konfiguriert Gang Scheduling für verteilte GPU-Trainingsjobs und prüft die Fair-Share-Konfiguration gegen die tatsächliche Kapazitätsverteilung. **Principal** macht die Queue- und Fair-Share-Politik für konkurrierende Teams nachvollziehbar. **Chief** legt Queue- und Fair-Share-Richtlinien für konkurrierende GPU-Batchworkloads im Unternehmen anhand nachvollziehbarer, dokumentierter Kriterien fest.

Anti-Patterns: verteilte, mehrteilige GPU-Trainingsjobs ohne Gang Scheduling betreiben und dadurch Deadlocks oder verschwendete Kapazität riskieren; Fair-Share-Regeln ohne Prüfung der tatsächlichen Kapazitätsverteilung über die Zeit konfigurieren; Queue-Kapazitätsgrenzen ohne Bezug zu einem dokumentierten, vereinbarten Team-Bedarf pauschal festlegen.

## Production Checklist

- [ ] Gang Scheduling ist für alle verteilten, mehrteiligen GPU-Trainingsjobs aktiviert.
- [ ] Jede Team-Queue hat eine reservierte Mindestkapazität entsprechend dem dokumentierten Bedarf.
- [ ] Fair-Share-Regeln für überschüssige Kapazität sind konfiguriert und werden durchgesetzt.
- [ ] Kapazitätsauslastung, Queue-Wartezeit und Gang-Scheduling-Fehlversuche werden überwacht.

## Interviewfragen

### 1. Warum ist Standard-Kubernetes-Scheduling für verteilte GPU-Trainingsjobs unzureichend?

**Antwort:** Es platziert Pods unabhängig voneinander, wodurch einzelne Teile eines mehrteiligen Jobs starten könnten, während andere auf Kapazität warten — der gestartete Teil bleibt blockiert und GPU-Kapazität wird ohne Fortschritt verschwendet.

### 2. Was ist Gang Scheduling, und welches Problem löst es?

**Antwort:** Der Scheduler prüft, ob ausreichend Kapazität für alle Teile eines Jobs gleichzeitig verfügbar ist, bevor irgendein Teil gestartet wird — entweder startet der gesamte Job gemeinsam oder keiner seiner Teile, was Deadlocks und verschwendete Kapazität verhindert.

### 3. Was ist der Unterschied zwischen reservierter Kapazität und Fair Share?

**Antwort:** Reservierte Kapazität ist eine garantierte Mindestkapazität pro Team, während Fair Share die proportionale Verteilung überschüssiger, nicht reservierter Kapazität bei Knappheit regelt.

### 4. Wie verhindern Kueue und Volcano, dass ein Team systematisch mehr Kapazität als vereinbart beansprucht?

**Antwort:** Durch Fair-Share-Mechanismen, die bei Kapazitätsknappheit die verfügbare Kapazität proportional zur vereinbarten Zuteilung zwischen den Teams verteilen, statt sie dem Team mit den häufigsten Anfragen zu überlassen.

### 5. Wie gehst du vor, wenn ein verteilter Trainingsjob teilweise startet und dann hängen bleibt?

**Antwort:** Ich prüfe, ob Gang Scheduling für diesen Job-Typ aktiviert ist, da ein teilweiser Start ohne gemeinsames Warten auf ausreichende Gesamtkapazität ein typisches Anzeichen für fehlendes Gang Scheduling ist.

### 6. Widersprüchliche Anforderung: Zwei Teams beanspruchen gleichzeitig maximale GPU-Kapazität für kritische Deadlines — wie gehst du vor?

**Antwort:** Ich würde die konfigurierten Fair-Share-Regeln und reservierten Kapazitäten beider Teams gegen die tatsächliche Verfügbarkeit prüfen und die Priorisierung anhand der dokumentierten, vorab vereinbarten Kapazitätszuteilung statt einer ad-hoc-Entscheidung vornehmen.

## Praktische Labs

~~~python
# Conceptual fair-share capacity distribution simulation (not executed against a real Kueue/Volcano cluster):

def distribute_fair_share(total_capacity, reserved_per_team, requested_per_team):
    surplus = total_capacity - sum(reserved_per_team.values())
    total_extra_requested = sum(max(0, requested_per_team[t] - reserved_per_team[t]) for t in requested_per_team)

    allocation = {}
    for team, reserved in reserved_per_team.items():
        extra_requested = max(0, requested_per_team[team] - reserved)
        proportional_extra = (extra_requested / total_extra_requested * surplus) if total_extra_requested > 0 else 0
        allocation[team] = round(reserved + min(proportional_extra, extra_requested), 1)
    return allocation

total_capacity = 100
reserved_per_team = {"team_a": 20, "team_b": 20, "team_c": 20}
requested_per_team = {"team_a": 50, "team_b": 30, "team_c": 20}

result = distribute_fair_share(total_capacity, reserved_per_team, requested_per_team)
print(result)
~~~

## Dependencies, Cross-References und Quellen

1. Kubernetes SIG-Scheduling-Dokumentation: [Kueue — Concepts](https://kueue.sigs.k8s.io/docs/concepts/), abgerufen 2026-09-17.
2. Volcano-Dokumentation: [Volcano — Gang Scheduling](https://volcano.sh/en/docs/), abgerufen 2026-09-17.

Scheduling und Platzierungsregeln sind kanonisch in [KB-0394](16-scheduling-und-platzierungsregeln.md) behandelt; Jobs und Batchausführung in [KB-0388](09-daemonsets-und-node-dienste.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Topologie-bewusstes Gang Scheduling, das die Platzierung verteilter Worker basierend auf Netzwerknähe (z. B. NVLink-Domänen) optimiert | Evaluating | Gegenüber rein kapazitätsbasiertem Gang Scheduling erst nach Prüfung der tatsächlichen Latenzauswirkung für die konkrete Hardware-Topologie bevorzugen. |
| Präemptions-basierte Fair-Share-Durchsetzung, die niedriger priorisierte Jobs aktiv unterbricht, um Fair-Share-Garantien einzuhalten | Evaluating | Gegenüber rein wartebasierter Fair-Share-Durchsetzung erst nach Prüfung der Auswirkung auf laufende, unterbrochene Jobs bevorzugen. |

Ein Team akzeptiert eine Queue- und Fair-Share-Konfiguration erst, wenn Gang Scheduling für alle verteilten Jobs nachweislich aktiv ist und die tatsächliche Kapazitätsverteilung den vereinbarten, dokumentierten Team-Zuteilungen entspricht.
