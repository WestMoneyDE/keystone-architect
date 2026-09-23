---
{"id": "KB-0468", "title": "EC2 und Auto Scaling", "domain": "19", "sequence": 6, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0445", "concepts": ["Cloud-Compute-Modelle"], "needed_for": "understanding"}, {"id": "KB-0396", "concepts": ["Autoscaling für Workloads"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Auto-Scaling-Gruppe mit einem Launch Template anhand offizieller Dokumentation konfigurieren können und erklären, warum EC2-Instanzen innerhalb einer Skalierungsgruppe zustandslos ersetzbar sein müssen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für einen konkreten Workload eine Instanzfamilie und eine Skalierungsstrategie (On-Demand, Spot, oder eine gemischte Konfiguration) begründet wählen, basierend auf tatsächlicher Unterbrechungstoleranz und Kapazitätsanforderungen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen unerwarteten Datenverlust auf eine fälschlich zustandsbehaftete Instanz innerhalb einer Auto-Scaling-Gruppe zurückführen können, die bei einer automatischen Ersetzung nicht persistierte Daten verloren hat.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Compute-Skalierungsrichtlinien im Unternehmen anhand des tatsächlichen Verhältnisses von Kosteneinsparung (Spot) zu Unterbrechungsrisiko statt anhand pauschaler On-Demand-Nutzung festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung des EC2-Hypervisors oder spezifischer Instanzfamilien-Hardware im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Launch Templates, Skalierungsgruppen und zustandsloser Ersetzung als Entscheidungsgrundlage, nicht die Hypervisor-Interna."}}, "lab_validation": [{"lab_id": "KB-0468-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller AWS-EC2- und Auto-Scaling-Dokumentation, kein aktives AWS-Konto verwendet", "evidence": "Anhand offizieller AWS-Dokumentation wird nachvollzogen, wie ein Launch Template die Konfiguration neuer EC2-Instanzen standardisiert, wie eine Auto-Scaling-Gruppe die Instanzanzahl basierend auf Kapazitätsbedarf automatisch anpasst und fehlerhafte Instanzen automatisch ersetzt, und warum diese automatische Ersetzung voraussetzt, dass Instanzen keinen wichtigen, nicht extern persistierten Zustand lokal halten.", "limitations": "Kein aktives AWS-Konto verwendet, keine reale EC2- oder Auto-Scaling-Konfiguration erstellt."}]}
---
# EC2 und Auto Scaling

> **Ziel:** Amazon EC2 stellt virtuelle Maschinen in unterschiedlichen Instanzfamilien bereit (siehe Cloud-Compute-Modelle, [KB-0445](../18-cloud-foundations/05-cloud-compute-modelle.md), jede Familie optimiert für unterschiedliche Ressourcenprofile, z. B. Rechenleistung, Speicher, oder eine Balance beider), während Auto Scaling Groups die Anzahl laufender Instanzen basierend auf einem Launch Template (das die Konfiguration neuer Instanzen standardisiert) automatisch an den tatsächlichen Kapazitätsbedarf anpassen (siehe Autoscaling für Workloads, [KB-0396](../16-kubernetes-platform/18-autoscaling-fuer-workloads.md)). Der zentrale Punkt dieses Kapitels ist, dass eine Auto-Scaling-Gruppe voraussetzt, dass jede darin enthaltene Instanz zustandslos ersetzbar ist — eine Instanz kann jederzeit automatisch terminiert und durch eine neue, aus demselben Launch Template erzeugte Instanz ersetzt werden (bei einem erkannten Fehler, bei einer Skalierungsentscheidung, oder bei einer Spot-Unterbrechung), weshalb jeder wichtige Zustand außerhalb der Instanz selbst (in einer externen Datenbank, einem Objektspeicher, oder einem gemeinsam genutzten Dateisystem) persistiert werden muss, statt auf lokal auf der Instanz gespeicherten, nicht extern gesicherten Daten zu beruhen.

## Zweck, Mental Model und Dependencies

Ein Launch Template definiert, wie eine neue EC2-Instanz konfiguriert wird (Amazon Machine Image, Instanzfamilie, Sicherheitsgruppen, Nutzerdaten-Skripte für die Initialisierung), sodass eine Auto-Scaling-Gruppe konsistente, identisch konfigurierte Instanzen erzeugen kann, ohne dass jede einzelne Instanz manuell eingerichtet werden muss. Die Auto-Scaling-Gruppe überwacht kontinuierlich die tatsächliche Auslastung (oder andere konfigurierte Metriken) und passt die Instanzanzahl entsprechend an — bei steigender Last werden zusätzliche Instanzen aus dem Launch Template erzeugt, bei sinkender Last werden überschüssige Instanzen terminiert. Zusätzlich überwacht die Auto-Scaling-Gruppe die Gesundheit jeder Instanz (z. B. über EC2-Status-Checks oder angebundene Load-Balancer-Health-Checks) und ersetzt automatisch jede als fehlerhaft erkannte Instanz durch eine neue. Diese automatische Ersetzung ist der zentrale Mechanismus, der Auto Scaling Groups robust gegen einzelne Instanzausfälle macht, setzt jedoch voraus, dass eine terminierte Instanz keine wichtigen, nicht anderweitig gesicherten Daten verliert — jede Instanz muss daher als zustandslos betrachtet werden, wobei tatsächlich wichtiger Zustand (Nutzerdaten, Sitzungsinformationen, Anwendungsdaten) in einem externen, von der Instanz unabhängigen Speicher (z. B. einer verwalteten Datenbank, siehe [KB-0447](../18-cloud-foundations/07-verwaltete-cloud-datenbanken.md), oder Object Storage) gehalten wird. Bei Spot-Instanzen (siehe kurzlebige Instanzen, [KB-0445](../18-cloud-foundations/05-cloud-compute-modelle.md)) innerhalb einer Auto-Scaling-Gruppe gilt dieselbe Anforderung an Zustandslosigkeit zusätzlich verschärft, da eine Spot-Unterbrechung mit deutlich kürzerer Vorwarnzeit erfolgen kann als eine reguläre, geplante Instanzersetzung. Der zentrale methodische Punkt ist, dass ein unerwarteter Datenverlust bei einer automatischen Instanzersetzung typischerweise nicht auf einen Fehler im Auto-Scaling-Mechanismus selbst zurückzuführen ist, sondern darauf, dass eine Instanz fälschlich als zustandsbehaftet behandelt wurde, obwohl sie Teil einer Auto-Scaling-Gruppe war, die konzeptionell zustandslose Ersetzbarkeit voraussetzt.

~~~text
Launch Template: defines config for new instances (AMI, instance family, security groups, init scripts)
  -> Auto Scaling Group creates CONSISTENT, identically-configured instances from it
Auto Scaling Group: monitors ACTUAL load -> adjusts instance count accordingly
  ALSO monitors instance HEALTH -> automatically REPLACES any instance detected as unhealthy
This automatic replacement REQUIRES: terminated instance loses NO important, unsecured data
  -> every instance treated as STATELESS
  -> actual important state (user data, sessions, app data) lives in EXTERNAL storage
     (managed DB, see KB-0447; Object Storage), NOT on the instance itself
Spot instances within an ASG: SAME statelessness requirement, EVEN MORE strict
  (interruption notice period is SHORTER than a regular, planned replacement)
KEY METHODOLOGICAL POINT: unexpected data loss on automatic instance replacement
  typically NOT an Auto Scaling bug -- an instance was mistakenly treated as STATEFUL
  despite being part of a group that conceptually requires stateless replaceability
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Launch Template | standardisiert die Konfiguration neuer Instanzen | ermöglicht konsistente, automatisierte Instanzerzeugung |
| Auto Scaling Group | passt Instanzanzahl an Last an, ersetzt fehlerhafte Instanzen | setzt zustandslose Ersetzbarkeit jeder Instanz voraus |
| Zustandslosigkeit | kein wichtiger, unersetzbarer lokaler Zustand | zentrale Voraussetzung für sichere, automatische Ersetzung |
| Spot-Instanzen in Auto Scaling | kostengünstige, aber kürzer vorgewarnte Unterbrechung | erfordert dieselbe, aber verschärfte Zustandslosigkeit |

Implementierung: Für jede Instanz innerhalb einer Auto-Scaling-Gruppe wird explizit geprüft, dass kein wichtiger, unersetzbarer Zustand lokal auf der Instanz gespeichert wird, sondern in externen, von der Instanz unabhängigen Speichern gehalten wird. Das Launch Template wird so konfiguriert, dass eine neu erzeugte Instanz beim Start automatisch die benötigte Konfiguration und Verbindung zu externen Zustandsspeichern herstellt, ohne manuelle Nacharbeit. Für Workloads mit tatsächlicher Toleranz gegenüber kurzfristigen Unterbrechungen wird eine gemischte Konfiguration aus On-Demand- und Spot-Instanzen innerhalb der Auto-Scaling-Gruppe evaluiert, um Kosteneinsparungen zu realisieren, ohne die Verfügbarkeit unverhältnismäßig zu gefährden.

## Scalability, Reliability, Security und Observability

EC2 Auto Scaling Groups skalieren die tatsächliche Kapazität proportional zur gemessenen Last und zur korrekten Konfiguration des Launch Templates; die Reliability-Grenze liegt darin, dass eine fälschlich zustandsbehaftete Instanz innerhalb einer Auto-Scaling-Gruppe proportional zur Häufigkeit automatischer Ersetzungen (geplante Skalierung, Gesundheitsprüfungs-Fehler, Spot-Unterbrechungen) zu wiederkehrendem Datenverlust führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| nach einer automatischen Instanzersetzung sind Daten verloren gegangen | die ersetzte Instanz hielt wichtigen Zustand lokal, ohne ihn extern zu persistieren | prüfen, welche Daten lokal gehalten wurden, und diese auf einen externen, von der Instanz unabhängigen Speicher umstellen |
| eine Spot-Instanz wird häufiger als erwartet unterbrochen und beeinträchtigt den Betrieb | die tatsächliche Unterbrechungstoleranz des Workloads wurde bei der Spot-Konfiguration überschätzt | die tatsächliche Unterbrechungshäufigkeit messen und den Anteil an Spot-Instanzen in der Skalierungsgruppe anpassen |
| eine Auto-Scaling-Gruppe skaliert nicht wie erwartet auf Lastspitzen | die Skalierungsmetriken oder -schwellenwerte entsprechen nicht dem tatsächlichen Lastmuster | die Skalierungsmetriken und -schwellenwerte gegen das reale Lastmuster neu kalibrieren |

Security: Instanzen innerhalb einer Auto-Scaling-Gruppe sollten über eine dedizierte, an die Instanzrolle gebundene IAM-Rolle (siehe [KB-0464](02-aws-iam-und-rollenmodell.md)) auf externe Ressourcen zugreifen, statt Zugangsschlüssel im Launch Template zu hinterlegen. Observability: Die tatsächliche Skalierungsaktivität, die Häufigkeit automatischer Ersetzungen (geplant versus fehlerbedingt versus Spot-Unterbrechung), und die tatsächliche Nutzung externer Zustandsspeicher sind zentrale Metriken zur Bewertung der Auto-Scaling-Konfiguration.

## Trade-offs und Entscheidungen

**Staff** stellt sicher, dass jede Instanz innerhalb einer Auto-Scaling-Gruppe tatsächlich zustandslos ersetzbar ist, mit wichtigem Zustand in externen Speichern. **Principal** macht die Skalierungsstrategie und deren Zustandslosigkeitsanforderung für das Team nachvollziehbar. **Chief** legt Compute-Skalierungsrichtlinien im Unternehmen anhand des tatsächlichen Verhältnisses von Kosteneinsparung zu Unterbrechungsrisiko fest.

Anti-Patterns: wichtigen Zustand lokal auf einer Instanz innerhalb einer Auto-Scaling-Gruppe speichern, ohne externe Persistierung; Spot-Instanzen für einen Workload ohne ausreichende, tatsächliche Unterbrechungstoleranz einsetzen; Zugangsschlüssel im Launch Template hinterlegen, statt eine dedizierte IAM-Rolle für Instanzen zu nutzen.

## Production Checklist

- [ ] Kein wichtiger Zustand wird lokal auf Instanzen innerhalb einer Auto-Scaling-Gruppe gespeichert, sondern extern persistiert.
- [ ] Das Launch Template stellt eine konsistente, automatisierte Konfiguration neuer Instanzen sicher.
- [ ] Die tatsächliche Unterbrechungstoleranz des Workloads wurde vor dem Einsatz von Spot-Instanzen geprüft.
- [ ] Instanzen nutzen dedizierte IAM-Rollen statt im Launch Template hinterlegter Zugangsschlüssel.

## Interviewfragen

### 1. Was ist ein Launch Template, und welchen Zweck erfüllt es innerhalb einer Auto Scaling Group?

**Antwort:** Es standardisiert die Konfiguration neuer EC2-Instanzen (AMI, Instanzfamilie, Sicherheitsgruppen, Initialisierungsskripte), sodass eine Auto Scaling Group konsistente, identisch konfigurierte Instanzen automatisiert erzeugen kann.

### 2. Warum müssen Instanzen innerhalb einer Auto Scaling Group zustandslos sein?

**Antwort:** Weil die Auto Scaling Group Instanzen jederzeit automatisch terminieren und durch neue ersetzen kann (bei Skalierung, Gesundheitsprüfungs-Fehlern, oder Spot-Unterbrechungen); wichtiger, nur lokal gehaltener Zustand ginge bei einer solchen Ersetzung verloren.

### 3. Wo sollte wichtiger Zustand stattdessen gespeichert werden?

**Antwort:** In einem externen, von der Instanz unabhängigen Speicher, z. B. einer verwalteten Datenbank oder Object Storage, nicht lokal auf der Instanz selbst.

### 4. Warum ist Zustandslosigkeit bei Spot-Instanzen besonders wichtig?

**Antwort:** Weil eine Spot-Unterbrechung mit deutlich kürzerer Vorwarnzeit erfolgen kann als eine reguläre, geplante Instanzersetzung, was weniger Zeit für eine eventuell nötige, manuelle Datenrettung lässt.

### 5. Wie gehst du vor, wenn nach einer automatischen Instanzersetzung Daten verloren gegangen sind?

**Antwort:** Ich prüfe, welche Daten lokal auf der ersetzten Instanz gehalten wurden, ohne extern persistiert zu sein, und stelle diese Daten auf einen externen, von der Instanz unabhängigen Speicher um.

### 6. Widersprüchliche Anforderung: Team will maximale Kosteneinsparung (überwiegend Spot-Instanzen) UND garantierte Verfügbarkeit für einen kritischen, latenzsensitiven Dienst — wie gehst du vor?

**Antwort:** Ich würde eine gemischte Konfiguration mit einem Kern aus On-Demand-Instanzen für die garantierte Grundverfügbarkeit und einem Anteil an Spot-Instanzen für zusätzliche, kosteneffiziente Kapazität vorschlagen, statt den Dienst vollständig auf Spot-Instanzen zu stellen, deren Unterbrechungsrisiko die Verfügbarkeitsanforderung gefährden würde.

## Praktische Labs

~~~python
# Conceptual statelessness verification for Auto Scaling Group instances (not executed against a real AWS account):

def check_instance_statelessness(local_storage_used_for, external_state_backend_configured):
    if local_storage_used_for == "important_persistent_data" and not external_state_backend_configured:
        return {"safe_for_asg": False, "reason": "important data stored locally without external persistence"}
    return {"safe_for_asg": True, "reason": "no unsecured critical local state detected"}

instance_a = check_instance_statelessness("temp_cache_only", external_state_backend_configured=True)
instance_b = check_instance_statelessness("important_persistent_data", external_state_backend_configured=False)

print(f"Instance A: {instance_a}")
print(f"Instance B: {instance_b}")
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [Amazon EC2 Auto Scaling — Launch Templates](https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-templates.html), abgerufen 2026-09-18.
2. AWS-Dokumentation: [EC2 Spot Instances — Interruption Behavior](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-interruptions.html), abgerufen 2026-09-18.

Cloud-Compute-Modelle sind kanonisch in [KB-0445](../18-cloud-foundations/05-cloud-compute-modelle.md) behandelt; Autoscaling für Workloads in [KB-0396](../16-kubernetes-platform/18-autoscaling-fuer-workloads.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, vorhersagebasierte Auto-Scaling-Strategien, die Kapazitätsanpassungen basierend auf historischen Lastmustern vorausschauend statt rein reaktiv vornehmen | Evaluating | Gegenüber rein reaktivem Skalieren erst nach Prüfung der tatsächlichen Vorhersagegenauigkeit für die eigene Workload bevorzugen. |

Ein Team akzeptiert eine EC2-Auto-Scaling-Konfiguration erst, wenn nachgewiesen ist, dass kein wichtiger Zustand ausschließlich lokal auf den Instanzen gehalten wird, und die Unterbrechungstoleranz für eingesetzte Spot-Instanzen tatsächlich geprüft wurde.
