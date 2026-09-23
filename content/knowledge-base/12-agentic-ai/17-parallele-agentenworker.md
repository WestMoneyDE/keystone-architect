---
{"id": "KB-0291", "title": "Parallele Agentenworker", "domain": "12", "sequence": 17, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0278", "concepts": ["Multi-Agent-Zusammenarbeit"], "needed_for": "understanding"}, {"id": "KB-0290", "concepts": ["Autonome Coding Agents"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Parallelworker-Architektur implementieren, die Dateieigentum explizit zuweist, um Konflikte zwischen gleichzeitig arbeitenden Agenten zu verhindern.", "rationale": "Der Wert von Dateieigentum wird erst durch konkrete Implementierung einer Konfliktvermeidung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Teilaufgaben so zerlegen, dass sie tatsächlich unabhängig von parallelen Agentenworkern bearbeitet werden können, ohne verdeckte Abhängigkeiten zu übersehen.", "rationale": "Eine scheinbar unabhängige Teilaufgabe mit einer übersehenen verdeckten Abhängigkeit kann bei paralleler Bearbeitung zu Konflikten führen."}, "STAFF-TARGET": {"active": true, "scope": "Einen Merge-Konflikt oder ein inkonsistentes Ergebnis auf eine fehlende Dateieigentumszuweisung statt auf ein allgemeines Koordinationsproblem zurückführen können.", "rationale": "Ohne explizite Dateieigentumszuweisung können zwei parallele Agentenworker unbemerkt dieselbe Ressource verändern."}, "CHIEF-TARGET": {"active": true, "scope": "Parallele Agentenworker als Durchsatzsteigerung positionieren, deren Sicherheit von nachweisbarer Konfliktfreiheit und gemeinsamer Budgetkontrolle abhängt, nicht von bloßer Parallelisierung.", "rationale": "Parallelisierung ohne nachweisbare Konfliktvermeidung und Budgetkontrolle kann zu inkonsistenten Ergebnissen oder unkontrollierten Kosten führen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Merge-Strategie-Implementierungsdetails sind Vertiefung.", "rationale": "Kern ist das Prinzip von Dateieigentum und Ergebnisverträgen, nicht die konkrete Merge-Technologie."}}, "lab_validation": [{"lab_id": "KB-0291-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell paralleler Agentenworker mit und ohne explizite Dateieigentumszuweisung", "evidence": "Zwei parallele Worker ohne Dateieigentumszuweisung können dieselbe Datei gleichzeitig verändern und einer der beiden Änderungen geht verloren; mit expliziter Eigentumszuweisung wird dieser Konflikt vermieden.", "limitations": "Kein echtes Dateisystem, kein produktives System, keine reale Nebenläufigkeit getestet."}]}
---
# Parallele Agentenworker

> **Ziel:** Parallele Agentenworker bearbeiten unabhängige Teilaufgaben gleichzeitig, aufbauend auf Multi-Agent-Zusammenarbeit (siehe [KB-0278](04-multi-agent-zusammenarbeit.md)) und autonomen Coding Agents (siehe [KB-0290](16-autonome-coding-agents.md)). Explizites Dateieigentum verhindert, dass zwei Worker unbemerkt dieselbe Ressource verändern; Ergebnisverträge, gemeinsame Budgetkontrolle und eine nachweisbar konfliktfreie Zusammenführung sind notwendig, um Parallelisierung tatsächlich sicher zu machen, statt nur den Durchsatz zu erhöhen.

## Zweck, Mental Model und Dependencies

Unabhängige Teilaufgaben sind Aufgaben, die sich tatsächlich ohne gegenseitige Abhängigkeit bearbeiten lassen — der zentrale, oft übersehene Fehler ist, eine Teilaufgabe fälschlich als unabhängig einzustufen, obwohl eine verdeckte Abhängigkeit besteht (z. B. zwei Teilaufgaben, die scheinbar getrennte Dateien bearbeiten, aber tatsächlich dieselbe gemeinsam genutzte Konfigurationsdatei verändern). Dateieigentum weist jedem parallelen Worker explizit die Dateien oder Ressourcen zu, die er exklusiv bearbeiten darf — dies verhindert, dass zwei Worker gleichzeitig dieselbe Ressource verändern und dabei die Änderung des jeweils anderen unbemerkt überschreiben. Ergebnisverträge (siehe [KB-0283](09-tool-use-und-ergebnisvertraege.md)) definieren, in welchem Format und mit welchem Status jeder Worker sein Teilergebnis zurückliefert, damit diese Teilergebnisse verlässlich zusammengeführt werden können. Gemeinsame Budgets (z. B. ein gemeinsames Kostenlimit für alle parallelen Worker einer übergeordneten Aufgabe) müssen koordiniert überwacht werden, da unabhängig laufende Worker ohne gemeinsame Budgetkontrolle das Gesamtbudget unkontrolliert überschreiten können, selbst wenn jeder einzelne Worker innerhalb eines scheinbar vernünftigen Rahmens agiert. Zusammenführung (Merge) der Teilergebnisse muss nachweisbar konfliktfrei erfolgen — eine Zusammenführung, die stillschweigend einen Konflikt zwischen zwei Teilergebnissen auflöst, ohne dies explizit zu prüfen und zu dokumentieren, kann fehlerhafte Endergebnisse erzeugen.

~~~text
Independent subtasks: TRUE independence required -> beware HIDDEN dependencies (shared config file, etc.)
File ownership: explicit exclusive assignment PER worker -> prevents silent overwrite between workers
Result contracts (KB-0283): defined format/status per worker's partial result -> enables reliable merge
Shared budget: coordinated tracking across ALL parallel workers
  -> without it: total budget can be exceeded even if EACH worker looks individually reasonable
Merge: must be PROVABLY conflict-free -> silent conflict resolution can produce WRONG final result
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Verdeckte Abhängigkeitsprüfung vor Parallelisierung | wurde geprüft, ob scheinbar unabhängige Teilaufgaben tatsächlich keine gemeinsame Ressource betreffen? | eine übersehene verdeckte Abhängigkeit kann zu einem stillen Konflikt zwischen parallelen Workern führen |
| Explizite Dateieigentumszuweisung | ist jedem Worker ein exklusiver, nicht überlappender Satz von Dateien oder Ressourcen zugewiesen? | überlappendes Eigentum kann dazu führen, dass die Änderung eines Workers die eines anderen unbemerkt überschreibt |
| Koordinierte Budgetüberwachung | wird das Gesamtbudget über alle parallelen Worker hinweg zentral überwacht, statt pro Worker isoliert? | ohne zentrale Überwachung kann das Gesamtbudget trotz individuell vernünftiger Worker überschritten werden |
| Nachweisbar konfliktfreie Zusammenführung | wird bei der Zusammenführung der Teilergebnisse explizit auf Konflikte geprüft, statt sie stillschweigend aufzulösen? | eine stillschweigende Konfliktauflösung kann ein fehlerhaftes Endergebnis erzeugen, ohne dass dies bemerkt wird |

Implementierung: Vor der Aufteilung einer Aufgabe in parallele Teilaufgaben wird explizit geprüft, ob tatsächliche Unabhängigkeit besteht, einschließlich einer Prüfung auf gemeinsam genutzte Ressourcen, die auf den ersten Blick nicht offensichtlich sind. Jedem parallelen Worker wird ein exklusiver, nicht überlappender Satz von Dateien oder Ressourcen zugewiesen, den nur er verändern darf. Ein zentraler Budgetzähler überwacht den kumulierten Ressourcenverbrauch aller parallelen Worker einer übergeordneten Aufgabe und stoppt neue Worker oder eskaliert, wenn das Gesamtbudget erreicht wird. Bei der Zusammenführung der Teilergebnisse wird explizit auf Konflikte zwischen den Ergebnissen geprüft; erkannte Konflikte werden nicht automatisch und stillschweigend aufgelöst, sondern eskaliert oder mit einer expliziten, nachvollziehbaren Konfliktlösungsregel behandelt.

## Scalability, Reliability, Security und Observability

Parallele Agentenworker skalieren Durchsatz proportional zur tatsächlichen Unabhängigkeit der Teilaufgaben; die Reliability-Grenze liegt in übersehenen verdeckten Abhängigkeiten oder überlappendem Dateieigentum, die zu stillen, schwer diagnostizierbaren Konflikten führen können.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Änderung eines parallelen Workers scheint unerklärlich verloren gegangen zu sein | zwei Worker hatten überlappendes Dateieigentum, und die Änderung des einen wurde von der des anderen überschrieben | prüfen, ob die betroffene Datei oder Ressource mehreren Workern gleichzeitig als Eigentum zugewiesen war |
| das Gesamtbudget einer parallelisierten Aufgabe wurde deutlich überschritten, obwohl jeder Worker einzeln vernünftig erschien | fehlende zentrale, koordinierte Budgetüberwachung über alle parallelen Worker hinweg | prüfen, ob eine zentrale Instanz den kumulierten Ressourcenverbrauch aller Worker überwacht hat |
| das Endergebnis nach Zusammenführung der Teilergebnisse enthält einen unerwarteten Fehler | ein Konflikt zwischen zwei Teilergebnissen wurde bei der Zusammenführung stillschweigend statt explizit aufgelöst | prüfen, ob die Zusammenführung eine explizite Konflikterkennung und -dokumentation durchgeführt hat |

Security: Gemeinsame Budgetkontrolle ist auch eine Sicherheitsmaßnahme gegen unkontrollierten Ressourcenverbrauch — ohne zentrale Überwachung könnte eine fehlerhaft rekursiv parallelisierende Aufgabe unbegrenzt Worker und damit Kosten erzeugen. Observability: Häufigkeit erkannter Dateieigentumskonflikte, tatsächlicher kumulierter Ressourcenverbrauch gegenüber dem Gesamtbudget und Häufigkeit eskalierter (statt stillschweigend aufgelöster) Merge-Konflikte sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** weist jedem parallelen Worker explizites, nicht überlappendes Dateieigentum zu. **Principal** macht die zentrale Budgetüberwachung und Konfliktlösungsregeln für das Team nachvollziehbar dokumentiert. **Chief** positioniert parallele Agentenworker als Durchsatzsteigerung, deren Sicherheit von nachweisbarer Konfliktfreiheit abhängt, nicht von bloßer Parallelisierung.

Anti-Patterns: Teilaufgaben ohne Prüfung auf verdeckte Abhängigkeiten parallelisieren; überlappendes Dateieigentum zwischen parallelen Workern zulassen; Budgetüberwachung isoliert pro Worker statt zentral über alle Worker hinweg durchführen; Merge-Konflikte stillschweigend statt explizit auflösen.

## Production Checklist

- [ ] Teilaufgaben sind vor Parallelisierung explizit auf verdeckte Abhängigkeiten geprüft.
- [ ] Jeder Worker hat exklusives, nicht überlappendes Dateieigentum.
- [ ] Eine zentrale Instanz überwacht das Gesamtbudget über alle parallelen Worker hinweg.
- [ ] Merge-Konflikte werden explizit erkannt und dokumentiert, nicht stillschweigend aufgelöst.

## Interviewfragen

### 1. Warum ist die Prüfung auf verdeckte Abhängigkeiten vor Parallelisierung wichtig?

**Antwort:** Eine scheinbar unabhängige Teilaufgabe kann eine gemeinsam genutzte Ressource betreffen, die nicht offensichtlich ist; ohne diese Prüfung können parallele Worker unbemerkt in Konflikt geraten.

### 2. Was ist Dateieigentum, und warum verhindert es Konflikte?

**Antwort:** Es weist jedem Worker exklusiv die Dateien oder Ressourcen zu, die er verändern darf; ohne diese exklusive Zuweisung können zwei Worker dieselbe Ressource gleichzeitig verändern und sich gegenseitig überschreiben.

### 3. Warum reicht eine isolierte Budgetkontrolle pro Worker nicht aus?

**Antwort:** Auch wenn jeder Worker einzeln innerhalb eines vernünftigen Rahmens agiert, kann das Gesamtbudget über alle parallelen Worker hinweg unkontrolliert überschritten werden, wenn keine zentrale, koordinierte Überwachung existiert.

### 4. Warum sollte eine Zusammenführung von Teilergebnissen Konflikte nicht stillschweigend auflösen?

**Antwort:** Eine stillschweigende Konfliktauflösung kann ein fehlerhaftes Endergebnis erzeugen, ohne dass dies bemerkt wird; explizite Erkennung und Dokumentation ermöglichen eine nachvollziehbare, korrekte Behandlung.

### 5. Wie diagnostizierst du eine unerklärlich verloren gegangene Änderung eines parallelen Workers?

**Antwort:** Ich prüfe, ob die betroffene Datei oder Ressource mehreren Workern gleichzeitig als Eigentum zugewiesen war — überlappendes Dateieigentum ist die wahrscheinlichste Ursache für eine solche verlorene Änderung.

### 6. Widersprüchliche Anforderung: Team will maximale Parallelisierung mit möglichst vielen gleichzeitigen Workern UND garantiert keine Ressourcenkonflikte und keine Budgetüberschreitung — wie gehst du vor?

**Antwort:** Ich würde erklären, dass maximale Parallelisierung nur so weit sicher möglich ist, wie tatsächlich unabhängige Teilaufgaben mit nicht überlappendem Dateieigentum existieren; ich würde vorschlagen, die Anzahl paralleler Worker dynamisch an die Anzahl nachweislich unabhängiger Teilaufgaben und an das verbleibende Gesamtbudget zu koppeln, statt eine feste, unabhängig geprüfte Obergrenze zu verwenden.

## Praktische Labs

~~~python
# Parallel workers with explicit file ownership and centralized budget tracking
file_ownership = {"module_a.py": "worker_1", "module_b.py": "worker_2"}
shared_budget = {"remaining": 100}

def worker_execute(worker_id, target_file, cost):
    owner = file_ownership.get(target_file)
    if owner != worker_id:
        raise PermissionError(f"{worker_id} does not own '{target_file}' (owned by {owner})")
    if shared_budget["remaining"] < cost:
        raise RuntimeError(f"Shared budget exhausted: requested {cost}, remaining {shared_budget['remaining']}")
    shared_budget["remaining"] -= cost
    return f"{worker_id} modified '{target_file}', cost={cost}, remaining_budget={shared_budget['remaining']}"

print(worker_execute("worker_1", "module_a.py", cost=30))
print(worker_execute("worker_2", "module_b.py", cost=40))

try:
    worker_execute("worker_2", "module_a.py", cost=10)  # violates file ownership
except PermissionError as e:
    print(f"Caught ownership violation: {e}")

try:
    worker_execute("worker_1", "module_a.py", cost=50)  # exceeds remaining shared budget
except RuntimeError as e:
    print(f"Caught budget violation: {e}")
~~~

## Dependencies, Cross-References und Quellen

1. Anthropic: [Building Effective AI Agents — Parallelization](https://www.anthropic.com/engineering/building-effective-agents), abgerufen 2026-09-17.
2. Git: [Merge Strategies Documentation](https://git-scm.com/docs/merge-strategies), abgerufen 2026-09-17.

Multi-Agent-Zusammenarbeit ist kanonisch in [KB-0278](04-multi-agent-zusammenarbeit.md) behandelt; autonome Coding Agents in [KB-0290](16-autonome-coding-agents.md); Ergebnisverträge in [KB-0283](09-tool-use-und-ergebnisvertraege.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte statische Abhängigkeitsanalyse, die verdeckte gemeinsame Ressourcen vor Parallelisierung erkennt | Emerging | Beobachten; würde manuelle Unabhängigkeitsprüfung ergänzen, aber noch nicht breit verfügbar für agentische Teilaufgaben. |
| Zentrale, in Echtzeit aktualisierte Budgetdienste für parallele Agentenflotten | Adopting | Gegenüber isolierter Budgetverfolgung pro Worker für zuverlässige Gesamtkostenkontrolle bevorzugen. |

Ein Team akzeptiert eine Architektur für parallele Agentenworker erst, wenn Dateieigentum, zentrale Budgetüberwachung und explizite Konflikterkennung bei der Zusammenführung dokumentiert und getestet sind.
