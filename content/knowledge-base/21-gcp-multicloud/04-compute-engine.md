---
{"id": "KB-0502", "title": "Compute Engine", "domain": "21", "sequence": 4, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0501", "concepts": ["Cloud Load Balancing und Cloud DNS"], "needed_for": "understanding"}, {"id": "KB-0468", "concepts": ["EC2 und Auto Scaling"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Compute-Engine-Instanzen, Instance Groups und Instance Templates anhand offizieller Dokumentation für VM-basierte Anwendungen konfigurieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete VM-basierte Anwendung explizit entscheiden, wie Managed Instance Groups für Skalierung und Selbstheilung eingesetzt werden und wie der Lifecycle von Instanzen (Preemptible/Spot vs. Standard) den tatsächlichen Verfügbarkeitsanforderungen entspricht.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen unerwarteten Instanzverlust auf die Nutzung von Spot-Instanzen ohne angemessene Unterbrechungstoleranz der Anwendung zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Compute-Standards im Unternehmen anhand einer bewussten Zuordnung von Instanztyp (Standard versus Spot) zur tatsächlichen Kritikalität und Unterbrechungstoleranz jeder Anwendung festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der Live-Migration-Mechanik von Compute Engine im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Instance Groups, Templates und Lifecycle-Entscheidungen als Grundlage, nicht die Live-Migration-Interna."}}, "lab_validation": [{"lab_id": "KB-0502-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Google-Cloud-Dokumentation zu Compute Engine, kein aktives GCP-Konto verwendet", "evidence": "Anhand offizieller Google-Cloud-Dokumentation wird nachvollzogen, wie Instance Templates eine wiederverwendbare Konfigurationsvorlage für VM-Instanzen darstellen, wie Managed Instance Groups (MIGs) mehrere identisch konfigurierte Instanzen mit automatischer Skalierung und Selbstheilung (Health-Check-basierter Neustart fehlerhafter Instanzen) verwalten, und wie Spot-/Preemptible-Instanzen einen Kosten-Verfügbarkeits-Trade-off gegenüber Standard-Instanzen darstellen.", "limitations": "Kein aktives GCP-Konto verwendet, keine reale Compute-Engine-Instanz erstellt."}]}
---
# Compute Engine

> **Ziel:** Compute Engine ist der VM-basierte Compute-Dienst von GCP, strukturell vergleichbar mit AWS EC2 (siehe [KB-0468](../19-aws/06-ec2-und-auto-scaling.md)). Ein **Instance Template** ist eine wiederverwendbare Konfigurationsvorlage (Maschinentyp, Boot-Disk-Image, Netzwerkeinstellungen), aus der konsistent konfigurierte Instanzen erzeugt werden können. Eine **Managed Instance Group (MIG)** verwaltet mehrere identisch konfigurierte Instanzen basierend auf einem Instance Template, mit automatischer Skalierung (basierend auf Auslastungsmetriken) und Selbstheilung (Health-Check-basierter automatischer Neustart fehlerhafter Instanzen). Der zentrale Punkt dieses Kapitels ist die Lifecycle-Entscheidung zwischen Standard-Instanzen (garantierte Verfügbarkeit, höherer Preis) und Spot-/Preemptible-Instanzen (signifikant günstiger, aber jederzeit mit kurzer Vorwarnzeit von GCP beendbar) — ein unerwarteter Instanzverlust in Produktion deutet häufig darauf hin, dass Spot-Instanzen für eine Anwendung genutzt werden, die keine angemessene Unterbrechungstoleranz (z. B. zustandslose, wiederholbare Batch-Verarbeitung) besitzt.

## Zweck, Mental Model und Dependencies

Compute Engine adressiert das grundlegende Problem der VM-basierten Rechenkapazität in GCP und ist strukturell eng an AWS EC2 angelehnt (siehe [KB-0468](../19-aws/06-ec2-und-auto-scaling.md)) — beide bieten konfigurierbare virtuelle Maschinen mit verschiedenen Maschinentypen, persistenten Disks und Netzwerkanbindung. Ein Instance Template kapselt die gesamte Konfiguration einer Instanz (Maschinentyp, Boot-Image, Metadaten, Netzwerk-Tags für Firewallregeln, siehe [KB-0500](02-gcp-vpc.md)) in einer wiederverwendbaren Definition, sodass neue Instanzen konsistent aus derselben Vorlage erzeugt werden, statt jede Instanz einzeln und potenziell inkonsistent zu konfigurieren. Eine Managed Instance Group nutzt dieses Template, um mehrere Instanzen als zusammenhängende Einheit zu verwalten — automatische Skalierung passt die Anzahl der Instanzen basierend auf tatsächlicher Auslastung (CPU, benutzerdefinierte Metriken, oder Warteschlangenlänge) an, während Selbstheilung fehlerhafte Instanzen anhand konfigurierter Health Checks erkennt und automatisch ersetzt, ohne manuelles Eingreifen. Die Lifecycle-Entscheidung zwischen Standard- und Spot-/Preemptible-Instanzen stellt einen expliziten Kosten-Verfügbarkeits-Trade-off dar: Spot-Instanzen sind signifikant günstiger, können aber von GCP jederzeit mit kurzer Vorwarnzeit (typischerweise 30 Sekunden) beendet werden, wenn die zugrunde liegende Kapazität anderweitig benötigt wird — dies eignet sich für zustandslose, wiederholbare oder fehlertolerante Workloads (Batch-Verarbeitung, CI/CD-Runner), nicht aber für Anwendungen, die kontinuierliche Verfügbarkeit ohne Unterbrechungstoleranz benötigen.

~~~text
Compute Engine: VM-based compute, structurally close to AWS EC2 (see KB-0468)
Instance Template: reusable config vorlage (machine type, boot image, metadata, network tags)
  -> consistent instance creation (vs individually, inconsistently configured instances)
Managed Instance Group (MIG): manages multiple instances FROM a template as ONE unit
  auto-scaling: adjusts instance count based on ACTUAL load (CPU/custom metrics/queue length)
  self-healing: health-check-based AUTO-REPLACEMENT of unhealthy instances, no manual intervention
LIFECYCLE decision -- explicit COST vs AVAILABILITY trade-off:
  Standard instances: guaranteed availability, higher price
  Spot/Preemptible instances: SIGNIFICANTLY cheaper, but GCP can terminate ANYTIME with short warning (~30s)
    -> fits STATELESS, repeatable, fault-tolerant workloads (batch, CI/CD runners)
    -> NOT for continuous-availability apps without interruption tolerance
UNEXPECTED instance loss in production -> often = spot instances used for an app WITHOUT adequate interruption tolerance
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Instance Template | wiederverwendbare Konfigurationsvorlage | ermöglicht konsistente Instanzerzeugung |
| Managed Instance Group | verwaltet mehrere Instanzen als Einheit | auto-scaling und self-healing |
| Standard-Instanz | garantierte Verfügbarkeit | für Anwendungen ohne Unterbrechungstoleranz |
| Spot-/Preemptible-Instanz | signifikant günstiger, jederzeit beendbar | nur für unterbrechungstolerante Workloads |

Implementierung: Für jede Anwendung wird explizit geprüft, ob sie zustandslos und wiederholbar ist (Kandidat für Spot-Instanzen) oder kontinuierliche Verfügbarkeit ohne Unterbrechungstoleranz benötigt (Standard-Instanzen erforderlich), statt Spot-Instanzen pauschal zur Kosteneinsparung ohne diese Prüfung einzusetzen. Instance Templates werden versioniert gepflegt, sodass Änderungen an der Instanzkonfiguration nachvollziehbar und für neue MIG-Rollouts wiederverwendbar sind. Health Checks für Selbstheilung werden mit anwendungsspezifischen, realistischen Kriterien konfiguriert, nicht mit generischen Standardwerten.

## Scalability, Reliability, Security und Observability

Compute Engine skaliert die Rechenkapazität proportional zur konfigurierten Managed-Instance-Group-Auto-Scaling-Politik; die Reliability-Grenze liegt darin, dass die Nutzung von Spot-Instanzen für eine Anwendung ohne angemessene Unterbrechungstoleranz proportional zur Häufigkeit von GCP-initiierten Terminierungen zu unerwarteten Verfügbarkeitseinbußen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Instanzen werden unerwartet in Produktion beendet | die Anwendung läuft auf Spot-/Preemptible-Instanzen ohne angemessene Unterbrechungstoleranz | prüfen, ob ein Wechsel zu Standard-Instanzen oder eine Erhöhung der Fehlertoleranz nötig ist |
| eine Managed Instance Group skaliert nicht wie erwartet | die Auto-Scaling-Metrik spiegelt nicht die tatsächliche Anwendungslast wider | die Auto-Scaling-Metrik gegen die tatsächliche Lastcharakteristik der Anwendung prüfen |
| neue Instanzen weichen von der erwarteten Konfiguration ab | das Instance Template wurde nicht aktualisiert oder eine veraltete Version wird genutzt | die genutzte Template-Version gegen die zuletzt gepflegte Version prüfen |

Security: Instanzen sollten über Netzwerk-Tags gezielten Firewallregeln zugeordnet werden (siehe [KB-0500](02-gcp-vpc.md)), statt breite, undifferenzierte Regeln für alle Instanzen zu nutzen. Observability: Die tatsächliche Terminierungsrate von Spot-Instanzen relativ zur Anwendungstoleranz, die Auto-Scaling-Reaktionszeit, und die Health-Check-Fehlerrate sind zentrale Betriebssignale.

## Trade-offs und Entscheidungen

**Staff** konfiguriert ein Instance Template und eine Managed Instance Group für eine gegebene Anwendung korrekt. **Principal** entscheidet, welcher Instanztyp (Standard versus Spot) für eine konkrete Anwendung basierend auf tatsächlicher Unterbrechungstoleranz geeignet ist. **Chief** legt unternehmensweite Compute-Standards für die bewusste Zuordnung von Instanztyp zu Anwendungskritikalität fest.

Anti-Patterns: Spot-Instanzen pauschal zur Kosteneinsparung nutzen, ohne die tatsächliche Unterbrechungstoleranz der Anwendung zu prüfen; Instanzen manuell und inkonsistent statt über ein zentral gepflegtes Instance Template konfigurieren; Health Checks für Selbstheilung mit generischen statt anwendungsspezifischen Kriterien konfigurieren.

## Production Checklist

- [ ] Jede Anwendung ist explizit auf Unterbrechungstoleranz geprüft, bevor Spot-Instanzen genutzt werden.
- [ ] Instance Templates sind versioniert und zentral gepflegt.
- [ ] Auto-Scaling-Metriken spiegeln die tatsächliche Anwendungslast wider.
- [ ] Health Checks für Selbstheilung nutzen anwendungsspezifische, realistische Kriterien.

## Interviewfragen

### 1. Wofür wird ein Instance Template genutzt?

**Antwort:** Als wiederverwendbare Konfigurationsvorlage für Maschinentyp, Boot-Image und Netzwerkeinstellungen, um konsistente Instanzerzeugung zu ermöglichen.

### 2. Was leistet eine Managed Instance Group zusätzlich zu einem einzelnen Instance Template?

**Antwort:** Sie verwaltet mehrere Instanzen als zusammenhängende Einheit mit automatischer Skalierung basierend auf Auslastung und Selbstheilung durch Health-Check-basierten automatischen Ersatz fehlerhafter Instanzen.

### 3. Was ist der Trade-off zwischen Standard- und Spot-/Preemptible-Instanzen?

**Antwort:** Spot-Instanzen sind signifikant günstiger, können aber von GCP jederzeit mit kurzer Vorwarnzeit beendet werden; Standard-Instanzen bieten garantierte Verfügbarkeit zu einem höheren Preis.

### 4. Für welche Art von Workloads eignen sich Spot-Instanzen?

**Antwort:** Für zustandslose, wiederholbare oder fehlertolerante Workloads wie Batch-Verarbeitung oder CI/CD-Runner, nicht für Anwendungen ohne Unterbrechungstoleranz.

### 5. Wie gehst du vor, wenn Instanzen unerwartet in Produktion beendet werden?

**Antwort:** Ich prüfe zuerst, ob die betroffene Anwendung auf Spot-/Preemptible-Instanzen läuft, und ob sie eine angemessene Unterbrechungstoleranz besitzt; falls nicht, evaluiere ich einen Wechsel zu Standard-Instanzen.

### 6. Widersprüchliche Anforderung: Team will maximale Kosteneinsparung durch Spot-Instanzen UND garantierte kontinuierliche Verfügbarkeit für eine kritische Anwendung — wie gehst du vor?

**Antwort:** Ich würde erklären, dass Spot-Instanzen und garantierte kontinuierliche Verfügbarkeit sich für dieselbe Anwendung strukturell widersprechen, und vorschlagen, kritische, unterbrechungssensitive Komponenten auf Standard-Instanzen zu betreiben, während unterbrechungstolerante Nebenkomponenten (z. B. Batch-Jobs) auf Spot-Instanzen ausgelagert werden.

## Praktische Labs

~~~python
# Conceptual instance-type recommendation based on interruption tolerance (not executed against a real GCP account):

def recommend_instance_type(is_stateless, is_repeatable, requires_continuous_availability):
    if requires_continuous_availability:
        return "standard (no interruption tolerance)"
    if is_stateless and is_repeatable:
        return "spot/preemptible (interruption-tolerant, cost-optimized)"
    return "standard (insufficient interruption tolerance for spot)"

workloads = [
    {"is_stateless": True, "is_repeatable": True, "requires_continuous_availability": False},
    {"is_stateless": False, "is_repeatable": False, "requires_continuous_availability": True},
]

for w in workloads:
    print(recommend_instance_type(**w))
~~~

## Dependencies, Cross-References und Quellen

1. Google-Cloud-Dokumentation: [Compute Engine — Instance Templates](https://cloud.google.com/compute/docs/instance-templates), abgerufen 2026-09-18.
2. Google-Cloud-Dokumentation: [Managed Instance Groups (MIGs)](https://cloud.google.com/compute/docs/instance-groups), abgerufen 2026-09-18.

Cloud Load Balancing und Cloud DNS sind kanonisch in [KB-0501](03-cloud-load-balancing-und-cloud-dns.md) behandelt; EC2 und Auto Scaling in [KB-0468](../19-aws/06-ec2-und-auto-scaling.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, KI-gestützte Auto-Scaling-Vorhersage basierend auf historischen Lastmustern statt reiner Schwellenwertreaktion | Evaluating | Gegenüber reaktivem, schwellenwertbasiertem Auto-Scaling erst nach Prüfung der tatsächlichen Vorhersagegenauigkeit für den konkreten Lastverlauf bevorzugen. |

Ein Team akzeptiert eine Compute-Engine-Konfiguration erst, wenn die Instanztyp-Wahl (Standard versus Spot) nachweislich der tatsächlichen Unterbrechungstoleranz jeder Anwendung entspricht.
