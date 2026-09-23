---
{"id": "KB-0445", "title": "Cloud-Compute-Modelle", "domain": "18", "sequence": 5, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE"], "requires": [{"id": "KB-0444", "concepts": ["Cloud-IAM-Grundarchitektur"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Virtuelle Maschinen, Bare-Metal-Instanzen und kurzlebige (spot/preemptible) Instanzen anhand ihrer jeweiligen Startzeit, Kostenstruktur und Betriebsaufwand unterscheiden können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein Compute-Modell (VM, Bare Metal, kurzlebige Instanz) für einen konkreten Workload begründet wählen, basierend auf dessen tatsächlichen Anforderungen an Startzeit, Lizenzbindung und Toleranz gegenüber Unterbrechungen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen unerwarteten Produktionsausfall auf den Einsatz kurzlebiger Instanzen für einen Workload zurückführen können, der tatsächlich eine unterbrechungsfreie Ausführung benötigt hätte.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Compute-Beschaffungsrichtlinien im Unternehmen anhand des tatsächlichen Verhältnisses von Kosteneinsparung zu Unterbrechungstoleranz statt anhand pauschaler Kostenminimierung festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Hypervisor-Implementierung eines spezifischen Cloud-Anbieters im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der Trade-offs zwischen Betriebsaufwand, Startzeit und Lizenzbindung als Entscheidungsgrundlage, nicht die Hypervisor-Interna."}}, "lab_validation": [{"lab_id": "KB-0445-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand öffentlich verfügbarer Cloud-Compute-Dokumentation, kein aktives Cloud-Konto verwendet", "evidence": "Anhand öffentlich verfügbarer Dokumentation wird nachvollzogen, wie sich virtuelle Maschinen, Bare-Metal-Instanzen und kurzlebige (spot/preemptible) Instanzen in Startzeit, Betriebsaufwand, Kostenstruktur und Lizenzbindung unterscheiden, und für welche Workload-Charakteristika jedes Modell jeweils angemessen ist.", "limitations": "Kein aktives Cloud-Deployment getestet, keine realen Kosten- oder Startzeitmessungen erhoben."}]}
---
# Cloud-Compute-Modelle

> **Ziel:** Cloud-Anbieter stellen mehrere grundlegende Compute-Modelle bereit, die sich in Betriebsaufwand, Startzeit und Unterbrechungstoleranz erheblich unterscheiden — virtuelle Maschinen (VMs, isoliert durch einen Hypervisor, mit moderatem Betriebsaufwand und Startzeiten im Sekunden- bis Minutenbereich), Bare-Metal-Instanzen (dedizierte, nicht virtualisierte physische Server, mit höherem Betriebsaufwand, aber ohne Virtualisierungs-Overhead und mit voller Kontrolle über die Hardware, relevant z. B. bei bestimmter Lizenzbindung, die physische statt virtualisierte Kerne voraussetzt), und kurzlebige Instanzen (spot/preemptible, deutlich günstiger, aber jederzeit vom Cloud-Anbieter mit kurzer Vorwarnzeit kündbar). Der zentrale Punkt dieses Kapitels ist, dass die Wahl des Compute-Modells anhand der tatsächlichen Workloadanforderungen getroffen werden muss — insbesondere die Unterbrechungstoleranz eines Workloads (kann er eine plötzliche Terminierung mit kurzer Vorwarnzeit tolerieren, oder benötigt er eine garantiert unterbrechungsfreie Ausführung) bestimmt, ob kurzlebige Instanzen trotz ihres erheblichen Kostenvorteils überhaupt infrage kommen.

## Zweck, Mental Model und Dependencies

Eine virtuelle Maschine wird durch einen Hypervisor von der zugrunde liegenden physischen Hardware isoliert, was eine effiziente gemeinsame Nutzung der physischen Ressourcen durch mehrere Kunden ermöglicht und moderate Startzeiten (typischerweise Sekunden bis wenige Minuten) sowie geringen Betriebsaufwand für den Kunden bedeutet, da der Anbieter Hardware und Virtualisierungsschicht verwaltet. Eine Bare-Metal-Instanz stellt hingegen dedizierte, nicht virtualisierte physische Hardware bereit — dies eliminiert den Virtualisierungs-Overhead und gibt dem Kunden volle Kontrolle über die Hardware, was insbesondere relevant wird, wenn eine Softwarelizenz an physische statt virtualisierte CPU-Kerne gebunden ist (eine häufige Lizenzbedingung bei bestimmter Unternehmenssoftware) oder wenn spezielle Hardwarefunktionen benötigt werden, die durch Virtualisierung nicht vollständig verfügbar sind — der Betriebsaufwand ist jedoch höher, und Startzeiten sind typischerweise länger als bei VMs. Kurzlebige Instanzen nutzen ungenutzte Kapazität des Cloud-Anbieters zu einem erheblich reduzierten Preis, mit der Bedingung, dass der Anbieter diese Kapazität mit kurzer Vorwarnzeit (typischerweise Sekunden bis wenige Minuten) zurückfordern kann, wenn sie anderweitig benötigt wird — dies macht sie für Workloads geeignet, die eine plötzliche Unterbrechung tolerieren können (z. B. fehlertolerante Batch-Verarbeitung mit Checkpoint-Mechanismen), aber ungeeignet für Workloads, die eine garantierte, unterbrechungsfreie Ausführung benötigen. Der zentrale methodische Punkt ist, dass die Wahl zwischen diesen Modellen nicht primär eine Kostenoptimierungsfrage ist, sondern zunächst eine Frage der tatsächlichen Unterbrechungstoleranz und Lizenzanforderungen des Workloads — ein Kosteneinsparungspotenzial durch kurzlebige Instanzen ist irrelevant, wenn der Workload eine Unterbrechung nicht tolerieren kann.

~~~text
VM: hypervisor-isolated from physical hardware
  -> efficient multi-tenant sharing, MODERATE startup time (seconds-minutes), LOW customer operational burden
Bare metal: dedicated, NON-virtualized physical hardware
  -> eliminates virtualization overhead, full hardware control
     relevant for: per-physical-core licensing requirements, special hardware features
  -> HIGHER operational burden, typically LONGER startup time
Spot/preemptible instance: uses provider's UNUSED capacity at significantly reduced price
  -> provider can RECLAIM with SHORT notice (seconds-minutes) when needed elsewhere
  -> suitable for: interruption-tolerant workloads (fault-tolerant batch w/ checkpointing)
  -> UNSUITABLE for: workloads needing guaranteed, uninterrupted execution
KEY METHODOLOGICAL POINT: model choice is NOT primarily a cost-optimization question FIRST
  it's a question of ACTUAL interruption tolerance + licensing needs of the workload
  -> cost savings from spot instances are IRRELEVANT if the workload cannot tolerate interruption
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Virtuelle Maschine | isolierte, effizient geteilte Recheninstanz | moderater Betriebsaufwand, Standardwahl für die meisten Workloads |
| Bare Metal | dedizierte, nicht virtualisierte Hardware | relevant bei physischer Kernlizenzierung oder speziellen Hardwareanforderungen |
| Kurzlebige Instanz (Spot/Preemptible) | deutlich günstigere, jederzeit kündbare Kapazität | nur für unterbrechungstolerante Workloads geeignet |
| Unterbrechungstoleranz | Fähigkeit des Workloads, plötzliche Terminierung zu verkraften | zentrales Auswahlkriterium vor jeder Kostenoptimierung |

Implementierung: Für jeden Workload wird zunächst dessen tatsächliche Unterbrechungstoleranz geprüft (kann er eine plötzliche Terminierung mit kurzer Vorwarnzeit tolerieren, z. B. durch Checkpoint-Mechanismen oder zustandslose Wiederholbarkeit), bevor eine Entscheidung für kurzlebige Instanzen aus Kostengründen getroffen wird. Bei Workloads mit spezifischen Lizenzanforderungen, die physische statt virtualisierte Kerne voraussetzen, wird explizit geprüft, ob Bare-Metal-Instanzen erforderlich sind, statt eine Lizenzverletzung durch den Einsatz virtueller Maschinen zu riskieren. Für die meisten Workloads ohne besondere Lizenz- oder Hardwareanforderungen werden virtuelle Maschinen als Standardwahl mit dem geringsten Betriebsaufwand eingesetzt.

## Scalability, Reliability, Security und Observability

Cloud-Compute-Modelle skalieren die Kosteneffizienz proportional zur Passgenauigkeit des gewählten Modells zur tatsächlichen Unterbrechungstoleranz des Workloads; die Reliability-Grenze liegt darin, dass der Einsatz kurzlebiger Instanzen für einen Workload ohne ausreichende Unterbrechungstoleranz proportional zur Häufigkeit von Kapazitätsrückforderungen durch den Anbieter zu unerwarteten Produktionsausfällen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein produktiver Dienst fällt unerwartet und wiederholt aus | der Dienst läuft auf kurzlebigen Instanzen, obwohl er keine ausreichende Unterbrechungstoleranz besitzt | die Unterbrechungstoleranz des Dienstes prüfen und gegebenenfalls auf reguläre VM-Instanzen umstellen |
| eine Softwarelizenz meldet eine Verletzung der Lizenzbedingungen | die Software läuft auf virtualisierten Kernen, obwohl die Lizenz physische Kerne voraussetzt | die Lizenzbedingungen prüfen und gegebenenfalls auf Bare-Metal-Instanzen umstellen |
| die Compute-Kosten sind höher als für den Workload nötig | ein Workload mit ausreichender Unterbrechungstoleranz läuft auf regulären, teureren Instanzen statt auf kostengünstigeren, kurzlebigen Instanzen | die tatsächliche Unterbrechungstoleranz des Workloads erneut prüfen und eine Migration zu kurzlebigen Instanzen evaluieren |

Security: Bare-Metal-Instanzen mit vollständiger Hardwarekontrolle erfordern besondere Sorgfalt bei der sicheren Außerbetriebnahme (z. B. vollständige Datenlöschung), da sie nicht durch dieselbe Virtualisierungsschicht-Isolation wie VMs geschützt sind. Observability: Die tatsächliche Häufigkeit von Kapazitätsrückforderungen bei kurzlebigen Instanzen, die Verfügbarkeit produktiver Dienste, und die Kostenverteilung über die verschiedenen Compute-Modelle sind zentrale Metriken zur Bewertung der Compute-Strategie.

## Trade-offs und Entscheidungen

**Staff** prüft die tatsächliche Unterbrechungstoleranz eines Workloads, bevor eine Entscheidung für kurzlebige Instanzen aus Kostengründen getroffen wird. **Principal** macht die Compute-Modell-Wahl und ihre Begründung für das Team nachvollziehbar. **Chief** legt Compute-Beschaffungsrichtlinien im Unternehmen anhand des tatsächlichen Verhältnisses von Kosteneinsparung zu Unterbrechungstoleranz fest.

Anti-Patterns: kurzlebige Instanzen für einen Workload ohne ausreichende Unterbrechungstoleranz aus reinen Kostengründen einsetzen; Software mit physischer Kernlizenzierung auf virtuellen Maschinen betreiben, ohne die Lizenzbedingungen zu prüfen; Bare-Metal-Instanzen ohne tatsächlichen Bedarf an voller Hardwarekontrolle einsetzen und dadurch unnötigen Betriebsaufwand in Kauf nehmen.

## Production Checklist

- [ ] Die tatsächliche Unterbrechungstoleranz jedes Workloads wurde vor der Compute-Modell-Wahl geprüft.
- [ ] Lizenzanforderungen (physische versus virtualisierte Kerne) sind für alle lizenzierten Workloads geprüft.
- [ ] Kurzlebige Instanzen werden nur für nachweislich unterbrechungstolerante Workloads eingesetzt.
- [ ] Häufigkeit von Kapazitätsrückforderungen und Dienstverfügbarkeit werden überwacht.

## Interviewfragen

### 1. Was unterscheidet eine virtuelle Maschine von einer Bare-Metal-Instanz?

**Antwort:** Eine VM ist durch einen Hypervisor von der physischen Hardware isoliert, mit moderatem Betriebsaufwand und Startzeit; eine Bare-Metal-Instanz stellt dedizierte, nicht virtualisierte Hardware bereit, mit höherem Betriebsaufwand, aber voller Hardwarekontrolle.

### 2. Wann ist eine Bare-Metal-Instanz gegenüber einer VM erforderlich?

**Antwort:** Wenn eine Softwarelizenz physische statt virtualisierte CPU-Kerne voraussetzt, oder wenn spezielle Hardwarefunktionen benötigt werden, die durch Virtualisierung nicht vollständig verfügbar sind.

### 3. Was ist der zentrale Trade-off bei kurzlebigen (Spot/Preemptible) Instanzen?

**Antwort:** Ein erheblicher Kostenvorteil gegenüber regulären Instanzen, gegen die Bedingung, dass der Cloud-Anbieter die Kapazität jederzeit mit kurzer Vorwarnzeit zurückfordern kann.

### 4. Warum ist die Wahl eines Compute-Modells nicht primär eine Kostenoptimierungsfrage?

**Antwort:** Weil die tatsächliche Unterbrechungstoleranz und Lizenzanforderungen des Workloads zuerst geklärt werden müssen — ein Kosteneinsparungspotenzial durch kurzlebige Instanzen ist irrelevant, wenn der Workload eine Unterbrechung nicht tolerieren kann.

### 5. Wie gehst du vor, wenn ein produktiver Dienst unerwartet und wiederholt ausfällt?

**Antwort:** Ich prüfe, ob der Dienst auf kurzlebigen Instanzen läuft, obwohl er keine ausreichende Unterbrechungstoleranz besitzt, und stelle ihn gegebenenfalls auf reguläre VM-Instanzen um.

### 6. Widersprüchliche Anforderung: Team will maximale Kosteneinsparung (kurzlebige Instanzen überall) UND garantierte Verfügbarkeit für einen kritischen, zustandsbehafteten Dienst — wie gehst du vor?

**Antwort:** Ich würde erklären, dass ein zustandsbehafteter, kritischer Dienst typischerweise keine ausreichende Unterbrechungstoleranz für kurzlebige Instanzen besitzt, und stattdessen reguläre Instanzen für diesen Dienst empfehlen, während kurzlebige Instanzen gezielt für andere, tatsächlich unterbrechungstolerante Workloads (z. B. Batch-Verarbeitung) eingesetzt werden.

## Praktische Labs

~~~python
# Conceptual compute-model suitability check (not executed against a real cloud account):

def recommend_compute_model(interruption_tolerant, requires_physical_core_license, cost_sensitivity):
    if requires_physical_core_license:
        return "bare_metal"
    if interruption_tolerant and cost_sensitivity == "high":
        return "spot_preemptible"
    return "vm"

workloads = {
    "batch_processing_job": {"interruption_tolerant": True, "requires_physical_core_license": False, "cost_sensitivity": "high"},
    "licensed_erp_system": {"interruption_tolerant": False, "requires_physical_core_license": True, "cost_sensitivity": "low"},
    "production_api": {"interruption_tolerant": False, "requires_physical_core_license": False, "cost_sensitivity": "medium"},
}

for name, attrs in workloads.items():
    recommendation = recommend_compute_model(**attrs)
    print(f"{name}: recommended compute model = {recommendation}")
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [EC2 Instance Purchasing Options (On-Demand, Spot, Bare Metal)](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html), abgerufen 2026-09-18.
2. Google Cloud-Dokumentation: [Spot VMs](https://cloud.google.com/compute/docs/instances/spot), abgerufen 2026-09-18.

Cloud-IAM-Grundarchitektur ist kanonisch in [KB-0444](04-cloud-iam-grundarchitektur.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, workload-bewusste Instanztyp-Empfehlungswerkzeuge, die Unterbrechungstoleranz aus historischen Nutzungsmustern ableiten | Evaluating | Gegenüber manueller Klassifizierung erst nach Prüfung der tatsächlichen Klassifizierungsgenauigkeit bevorzugen. |

Ein Team akzeptiert den Einsatz kurzlebiger Instanzen für einen Workload erst, wenn dessen tatsächliche Unterbrechungstoleranz (z. B. durch Checkpoint-Mechanismen oder zustandslose Wiederholbarkeit) nachweislich geprüft und dokumentiert ist.
