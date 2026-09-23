---
{"id": "KB-0471", "title": "ECS und Fargate", "domain": "19", "sequence": 9, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0449", "concepts": ["Containerdienste in der Cloud"], "needed_for": "understanding"}, {"id": "KB-0470", "concepts": ["Amazon EKS"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine ECS-Task-Definition mit einem ECS-Service anhand offizieller Dokumentation konfigurieren können und den Unterschied zwischen EC2-gebundener und Fargate-basierter Task-Ausführung erklären.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für einen konkreten Anwendungsfall begründet zwischen ECS/Fargate und EKS entscheiden, basierend auf dem tatsächlichen Bedarf an Kubernetes-API-Kompatibilität gegenüber Betriebseinfachheit.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Kostensteigerung bei Fargate-Tasks auf eine unzureichend dimensionierte oder ungenutzte Ressourcenreservierung zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Container-Plattformrichtlinien im Unternehmen anhand des tatsächlichen Bedarfs an Kubernetes-Ökosystem-Kompatibilität gegenüber betrieblicher Einfachheit statt anhand einer pauschalen Kubernetes-Präferenz festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der Fargate-Ausführungsumgebung im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Tasks, Services, Ausführungsmodellen und Kosten-/Isolationstrade-offs als Entscheidungsgrundlage, nicht die Fargate-Infrastruktur-Interna."}}, "lab_validation": [{"lab_id": "KB-0471-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller AWS-ECS- und Fargate-Dokumentation, kein aktives AWS-Konto verwendet", "evidence": "Anhand offizieller AWS-Dokumentation wird nachvollzogen, wie eine ECS-Task-Definition Container-Konfiguration beschreibt, wie ein ECS-Service die gewünschte Anzahl laufender Tasks aufrechterhält, und wie sich EC2-gebundene Task-Ausführung (Kunde verwaltet die zugrunde liegenden EC2-Instanzen) von Fargate (AWS verwaltet die gesamte Ausführungsumgebung, Abrechnung nach tatsächlich reservierten Ressourcen pro Task) unterscheidet.", "limitations": "Kein aktives AWS-Konto verwendet, keine reale ECS- oder Fargate-Konfiguration erstellt."}]}
---
# ECS und Fargate

> **Ziel:** Amazon ECS (Elastic Container Service) ist AWS' proprietärer Container-Orchestrierungsdienst (siehe Containerdienste in der Cloud, [KB-0449](../18-cloud-foundations/09-containerdienste-in-der-cloud.md)), der Tasks (eine Gruppe zusammen bereitgestellter Container gemäß einer Task-Definition) und Services (die eine gewünschte Anzahl laufender Task-Instanzen aufrechterhalten, ähnlich einem Kubernetes-Deployment) verwaltet — im Gegensatz zu Amazon EKS (siehe [KB-0470](08-amazon-eks.md)) nutzt ECS keine Kubernetes-API, sondern ein eigenes, AWS-spezifisches Modell, was einerseits geringere Betriebskomplexität bedeutet (kein Bedarf an Kubernetes-Expertise), andererseits jedoch bedeutet, dass das breite Kubernetes-Ökosystem (Operatoren, Helm-Charts, plattformübergreifende Werkzeuge) nicht direkt nutzbar ist. Der zentrale Punkt dieses Kapitels ist, dass ECS Tasks entweder auf selbst verwalteten EC2-Instanzen (der Kunde betreibt und patcht die zugrunde liegenden Instanzen, siehe [KB-0468](06-ec2-und-auto-scaling.md)) oder über Fargate (AWS verwaltet die gesamte Ausführungsumgebung, Abrechnung nach den tatsächlich für jede Task reservierten CPU-/Speicherressourcen) ausgeführt werden können — Fargate maximiert Betriebseinfachheit und bietet Isolation auf Task-Ebene ohne gemeinsam genutzte Host-Infrastruktur, kann jedoch bei unzureichend dimensionierter Ressourcenreservierung pro Task zu unerwartet hohen Kosten führen, wenn deutlich mehr Kapazität reserviert wird, als tatsächlich benötigt wird.

## Zweck, Mental Model und Dependencies

Eine ECS-Task-Definition beschreibt, welche Container-Images ausgeführt werden, welche Ressourcen (CPU, Speicher) ihnen zugewiesen werden, und wie sie miteinander kommunizieren — ähnlich einem Kubernetes-Pod-Manifest, jedoch im ECS-eigenen Format. Ein ECS-Service referenziert eine Task-Definition und sorgt dafür, dass eine konfigurierte Anzahl an Task-Instanzen kontinuierlich läuft, ersetzt fehlerhafte Tasks automatisch, und kann mit einem Load Balancer (siehe [KB-0469](07-elastic-load-balancing.md)) integriert werden, um eingehenden Traffic zu verteilen. Bei EC2-gebundener Task-Ausführung wählt ECS aus einem vom Kunden verwalteten Pool von EC2-Instanzen (einer Auto-Scaling-Gruppe) geeignete Instanzen für die Platzierung von Tasks aus, wobei der Kunde weiterhin für Patching, Kapazitätsplanung und Betriebssystempflege dieser Instanzen verantwortlich bleibt, jedoch potenziell eine effizientere, dichtere Auslastung der zugrunde liegenden Instanzen erreichen kann, indem mehrere Tasks auf derselben Instanz gemeinsam platziert werden. Bei Fargate entfällt diese Verantwortung vollständig — AWS stellt für jede Task eine isolierte Ausführungsumgebung mit genau den in der Task-Definition angegebenen Ressourcen bereit, ohne dass der Kunde Instanzen verwaltet, wobei die Abrechnung direkt an die reservierten (nicht notwendigerweise tatsächlich genutzten) CPU-/Speicherressourcen jeder Task gekoppelt ist. Der zentrale methodische Punkt ist, dass diese Abrechnungslogik bei Fargate zu einer spezifischen Kostenfalle führen kann: Wenn eine Task-Definition großzügiger dimensioniert wird, als die Anwendung tatsächlich benötigt (z. B. aus Vorsicht oder mangels tatsächlicher Lastmessung), wird für diese ungenutzte, aber reservierte Kapazität dennoch bezahlt — anders als bei EC2-gebundener Ausführung, bei der ungenutzte Kapazität auf einer gemeinsam genutzten Instanz theoretisch für andere Tasks verfügbar bliebe, ist die Ressourcenreservierung bei Fargate pro Task strikt isoliert und wird unabhängig von der tatsächlichen Auslastung vollständig abgerechnet.

~~~text
ECS Task Definition: describes container images, CPU/memory allocation, inter-container comms
  (like a K8s pod manifest, but in ECS's own format, NO Kubernetes API)
ECS Service: keeps a configured number of task instances running, auto-replaces failed tasks
  can integrate with a load balancer (see KB-0469)
EC2-launch-type: ECS places tasks on a customer-managed EC2 pool (Auto Scaling Group, see KB-0468)
  customer still responsible for patching/capacity/OS maintenance
  -> can achieve denser utilization by co-locating multiple tasks on the same instance
Fargate: AWS provides an ISOLATED execution env per task with EXACTLY the reserved CPU/memory
  no customer-managed instances -> billing tied DIRECTLY to RESERVED (not necessarily USED) resources
KEY METHODOLOGICAL POINT: Fargate cost trap
  task definition sized MORE generously than actually needed -> pay for UNUSED reserved capacity regardless
  unlike EC2-launch-type, where unused capacity on a shared instance theoretically remains available
    for OTHER tasks -- Fargate reservation is STRICTLY per-task isolated, billed in full regardless of actual usage
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Task-Definition | beschreibt Container-Konfiguration und Ressourcen | Grundlage für Ausführung, unabhängig vom gewählten Launch-Typ |
| ECS-Service | hält gewünschte Task-Anzahl aufrecht, ersetzt fehlerhafte Tasks | integriert mit Load Balancern für Traffic-Verteilung |
| EC2-Launch-Typ | Tasks laufen auf kundenverwalteten EC2-Instanzen | ermöglicht dichtere Auslastung, erfordert Instanzverwaltung |
| Fargate | AWS verwaltet die gesamte Ausführungsumgebung pro Task | Abrechnung nach reservierten, nicht tatsächlich genutzten Ressourcen |

Implementierung: Vor der Wahl zwischen ECS/Fargate und EKS wird geprüft, ob tatsächlich ein Bedarf an Kubernetes-API-Kompatibilität oder dem breiteren Kubernetes-Ökosystem besteht, oder ob die einfachere Betriebsweise von ECS für den Anwendungsfall ausreichend ist. Bei Fargate-Nutzung wird die Ressourcenreservierung jeder Task-Definition anhand tatsächlich gemessener Auslastungsdaten dimensioniert, statt großzügig zu schätzen, um unnötige Kosten für ungenutzte, reservierte Kapazität zu vermeiden. Bei EC2-gebundener Ausführung wird die Instanzkapazität so dimensioniert, dass eine effiziente, dichte Platzierung mehrerer Tasks möglich ist, ohne die Kapazitätsgrenzen der zugrunde liegenden Instanzen zu überschreiten.

## Scalability, Reliability, Security und Observability

ECS und Fargate skalieren die Betriebseinfachheit proportional zur Delegation der Infrastrukturverantwortung an AWS (maximal bei Fargate); die Reliability-Grenze liegt darin, dass eine bei Fargate großzügig überdimensionierte Ressourcenreservierung proportional zur Diskrepanz zwischen reservierter und tatsächlich genutzter Kapazität zu unnötigen, vermeidbaren Kosten führt, ohne einen entsprechenden Betriebsvorteil zu bieten.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| die Fargate-Kosten sind höher als für die tatsächliche Anwendungslast erwartet | die Task-Definition reserviert deutlich mehr CPU/Speicher, als die Anwendung tatsächlich nutzt | die tatsächliche Ressourcennutzung messen und die Task-Definition entsprechend anpassen |
| Tasks auf EC2-gebundenen Instanzen können nicht platziert werden, obwohl Kapazität vorhanden scheint | die Instanzkapazität ist nicht ausreichend für die Platzierungsanforderungen der Task-Definitionen dimensioniert | die tatsächliche, verfügbare Kapazität der Auto-Scaling-Gruppe gegen die aggregierten Ressourcenanforderungen aller Tasks prüfen |
| ein Team benötigt Kubernetes-spezifische Werkzeuge oder Operatoren, die mit ECS nicht kompatibel sind | ECS wurde für einen Anwendungsfall gewählt, der tatsächlich Kubernetes-Ökosystem-Kompatibilität benötigt | den tatsächlichen Bedarf an Kubernetes-Ökosystem-Kompatibilität neu bewerten und gegebenenfalls zu EKS migrieren |

Security: Fargate-Tasks profitieren von einer stärkeren, standardmäßigen Isolation zwischen Tasks (keine gemeinsam genutzte Host-Infrastruktur), was bei EC2-gebundener Ausführung mit dicht co-lokalisierten Tasks explizit durch zusätzliche Isolationsmaßnahmen sichergestellt werden müsste. Observability: Die tatsächliche versus reservierte Ressourcennutzung jeder Task (insbesondere bei Fargate), die Dichte der Task-Platzierung auf EC2-Instanzen, und die tatsächlichen Kosten pro Task-Typ sind zentrale Metriken zur Bewertung der gewählten Ausführungsstrategie.

## Trade-offs und Entscheidungen

**Staff** dimensioniert Fargate-Task-Definitionen anhand tatsächlich gemessener Ressourcennutzung, nicht großzügiger Schätzung. **Principal** macht die Abwägung zwischen ECS/Fargate und EKS für das Team nachvollziehbar. **Chief** legt Container-Plattformrichtlinien im Unternehmen anhand des tatsächlichen Bedarfs an Kubernetes-Ökosystem-Kompatibilität fest.

Anti-Patterns: Fargate-Task-Definitionen ohne Prüfung der tatsächlichen Ressourcennutzung großzügig überdimensionieren; ECS für einen Anwendungsfall wählen, der tatsächlich Kubernetes-spezifische Werkzeuge oder Operatoren benötigt; EC2-gebundene ECS-Instanzen ohne ausreichende Kapazitätsplanung für die aggregierten Ressourcenanforderungen aller platzierten Tasks betreiben.

## Production Checklist

- [ ] Die Wahl zwischen ECS/Fargate und EKS ist anhand des tatsächlichen Bedarfs an Kubernetes-Kompatibilität begründet.
- [ ] Fargate-Task-Definitionen sind anhand tatsächlich gemessener Ressourcennutzung dimensioniert.
- [ ] Bei EC2-gebundener Ausführung ist die Instanzkapazität ausreichend für die aggregierten Task-Anforderungen dimensioniert.
- [ ] Tatsächliche versus reservierte Ressourcennutzung wird regelmäßig geprüft, um Kostenoptimierungspotenzial zu identifizieren.

## Interviewfragen

### 1. Was unterscheidet ECS grundlegend von EKS?

**Antwort:** ECS nutzt ein eigenes, AWS-spezifisches Orchestrierungsmodell ohne Kubernetes-API, was geringere Betriebskomplexität bedeutet, aber keine direkte Nutzung des Kubernetes-Ökosystems ermöglicht.

### 2. Was ist der Unterschied zwischen EC2-gebundener Task-Ausführung und Fargate?

**Antwort:** Bei EC2-gebundener Ausführung verwaltet der Kunde die zugrunde liegenden EC2-Instanzen selbst; bei Fargate verwaltet AWS die gesamte Ausführungsumgebung pro Task, mit Abrechnung nach reservierten Ressourcen.

### 3. Welche Kostenfalle kann bei Fargate entstehen?

**Antwort:** Eine großzügig dimensionierte Task-Definition wird vollständig nach den reservierten Ressourcen abgerechnet, unabhängig von der tatsächlichen Nutzung — anders als bei gemeinsam genutzten EC2-Instanzen bleibt ungenutzte Kapazität nicht für andere Tasks verfügbar.

### 4. Wann ist ECS gegenüber EKS angemessen?

**Antwort:** Wenn kein tatsächlicher Bedarf an Kubernetes-API-Kompatibilität oder dem breiteren Kubernetes-Ökosystem besteht und die einfachere Betriebsweise von ECS für den Anwendungsfall ausreichend ist.

### 5. Wie gehst du vor, wenn die Fargate-Kosten höher als für die tatsächliche Anwendungslast erwartet sind?

**Antwort:** Ich messe die tatsächliche Ressourcennutzung der Tasks und passe die Ressourcenreservierung in der Task-Definition entsprechend an, um unnötige Kosten für ungenutzte, reservierte Kapazität zu vermeiden.

### 6. Widersprüchliche Anforderung: Team will maximale Betriebseinfachheit (Fargate für alles) UND minimale Kosten bei stark schwankender Last — wie gehst du vor?

**Antwort:** Ich würde die tatsächlichen Lastmuster analysieren und prüfen, ob eine Kombination aus Fargate für unvorhersehbare, schwankende Lasten und EC2-gebundener Ausführung mit dichter Task-Platzierung für stabile, vorhersehbare Grundlast eine bessere Kosteneffizienz bietet als eine pauschale Fargate-Nutzung für alle Tasks.

## Praktische Labs

~~~python
# Conceptual Fargate cost-efficiency check (not executed against a real AWS account):

def check_fargate_efficiency(reserved_cpu_units, actual_avg_cpu_used_units, reserved_memory_mb, actual_avg_memory_used_mb):
    cpu_utilization = actual_avg_cpu_used_units / reserved_cpu_units
    memory_utilization = actual_avg_memory_used_mb / reserved_memory_mb
    return {
        "cpu_utilization_pct": round(cpu_utilization * 100, 1),
        "memory_utilization_pct": round(memory_utilization * 100, 1),
        "oversized": cpu_utilization < 0.3 or memory_utilization < 0.3,
    }

result = check_fargate_efficiency(
    reserved_cpu_units=1024, actual_avg_cpu_used_units=200,
    reserved_memory_mb=2048, actual_avg_memory_used_mb=600,
)
print(result)
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [Amazon ECS — Task Definitions and Services](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html), abgerufen 2026-09-18.
2. AWS-Dokumentation: [AWS Fargate — How It Works](https://docs.aws.amazon.com/AmazonECS/latest/userguide/what-is-fargate.html), abgerufen 2026-09-18.

Containerdienste in der Cloud sind kanonisch in [KB-0449](../18-cloud-foundations/09-containerdienste-in-der-cloud.md) behandelt; Amazon EKS in [KB-0470](08-amazon-eks.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Ressourcen-Rightsizing-Empfehlungen für Fargate-Task-Definitionen basierend auf beobachteter Nutzung | Adopting | Gegenüber manueller Dimensionierung bevorzugen, sobald die tatsächliche Genauigkeit der Empfehlungen für die eigene Anwendung verifiziert ist. |

Ein Team akzeptiert eine Fargate-Task-Definition erst, wenn deren Ressourcenreservierung nachweislich anhand tatsächlich gemessener Nutzungsdaten dimensioniert ist, nicht anhand großzügiger Schätzung.
