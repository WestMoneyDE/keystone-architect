---
{"id": "KB-0446", "title": "Cloud-Speicherauswahl", "domain": "18", "sequence": 6, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE"], "requires": [{"id": "KB-0208", "concepts": ["Object Storage"], "needed_for": "understanding"}, {"id": "KB-0209", "concepts": ["Block Storage"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Object-, Block- und File-Speicherangebote eines Cloud-Anbieters anhand ihrer jeweiligen Zugriffsmuster (API-basiert versus blockbasiert versus dateisystembasiert) unterscheiden können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Speicherstrategie für eine konkrete Anwendung begründet zwischen Object-, Block- und File-Storage wählen, basierend auf dem tatsächlichen Zugriffsmuster (Lese-/Schreibhäufigkeit, Nebenläufigkeit, Konsistenzanforderungen) der Anwendung.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Leistungs- oder Kostenproblematik auf eine Diskrepanz zwischen dem tatsächlichen Zugriffsmuster einer Anwendung und dem gewählten Speichermodell zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Speicherbeschaffungsrichtlinien im Unternehmen anhand tatsächlicher Zugriffsmuster und Haltbarkeitsanforderungen statt anhand pauschaler Standardwahl festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Replikationsimplementierung eines spezifischen Cloud-Speicherdienstes im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der Zugriffsmuster-Passung als Entscheidungsgrundlage, nicht die anbieterspezifische Replikations-Interna."}}, "lab_validation": [{"lab_id": "KB-0446-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand öffentlich verfügbarer Cloud-Speicherdienst-Dokumentation, kein aktives Cloud-Konto verwendet", "evidence": "Anhand öffentlich verfügbarer Dokumentation wird nachvollzogen, wie Object-, Block- und File-Storage-Angebote sich in Zugriffsmuster, Servicegrenzen (z. B. maximale IOPS, Objektgröße), Datenbewegungskosten und Haltbarkeitsgarantien unterscheiden, und für welche Anwendungsmuster jedes Modell jeweils geeignet ist.", "limitations": "Kein aktives Cloud-Deployment getestet, keine realen Leistungs- oder Kostenmessungen erhoben."}]}
---
# Cloud-Speicherauswahl

> **Ziel:** Cloud-Anbieter stellen drei grundlegende Speichermodelle bereit, die sich in Zugriffsmuster, Servicegrenzen und Kostenstruktur erheblich unterscheiden — Object Storage (siehe [KB-0208](../09-databases-storage/14-object-storage.md), API-basierter Zugriff auf unveränderliche, versionierte Objekte, für hohe Skalierbarkeit und Haltbarkeit optimiert, jedoch ohne dateisystemartige, teilweise Aktualisierung einzelner Objektbereiche), Block Storage (siehe [KB-0209](../09-databases-storage/15-block-storage.md), niedriglatente, blockbasierte Volumes für eine einzelne verbundene Instanz, geeignet für Datenbanken und Betriebssystemlaufwerke), und File Storage (dateisystembasierter, gleichzeitig von mehreren Instanzen zugänglicher Netzwerkspeicher, geeignet für gemeinsam genutzte Dateiablagen). Der zentrale Punkt dieses Kapitels ist, dass die Wahl des Speichermodells auf dem tatsächlichen Zugriffsmuster der Anwendung basieren muss — eine Anwendung, die für ein Modell konzipiert wurde (z. B. Object Storage für unveränderliche, selten aktualisierte große Dateien), aber auf ein ungeeignetes Modell umgestellt wird (z. B. Block Storage mit häufigen Volumen-Snapshot-Anforderungen für dieselbe Anwendung), führt typischerweise zu unerwarteten Leistungs- oder Kostenproblemen.

## Zweck, Mental Model und Dependencies

Object Storage adressiert Daten über eine flache, API-basierte Struktur (Objekte, adressiert über eindeutige Schlüssel innerhalb eines Buckets) und ist für hohe Skalierbarkeit, Haltbarkeit (durch automatische Replikation über mehrere Availability Zones, siehe [KB-0441](01-cloud-regionen-und-availability-zones.md)) und kostengünstige Speicherung großer Datenmengen optimiert — der Zugriff erfolgt jedoch typischerweise auf das gesamte Objekt (kein effizientes, teilweises Überschreiben eines Objektbereichs wie bei einem Dateisystem), was Object Storage für unveränderliche oder selten aktualisierte Daten (z. B. Backups, Medien-Dateien, Data-Lake-Inhalte) geeignet macht, aber für Anwendungen mit häufigen, kleinteiligen Änderungen ungeeignet. Block Storage stellt niedriglatente, blockbasierte Volumes bereit, die typischerweise an eine einzelne Compute-Instanz angehängt werden und sich wie eine lokale Festplatte verhalten — dies macht Block Storage geeignet für Datenbanken und Betriebssystemlaufwerke, die häufige, kleinteilige Lese-/Schreibzugriffe mit niedriger Latenz benötigen, jedoch typischerweise nicht gleichzeitig von mehreren Instanzen genutzt werden kann. File Storage stellt einen dateisystembasierten, über das Netzwerk gleichzeitig von mehreren Instanzen zugänglichen Speicher bereit, geeignet für Anwendungsfälle, die einen gemeinsam genutzten Dateisystemzugriff über mehrere Compute-Instanzen hinweg benötigen (z. B. geteilte Konfigurationsdateien oder gemeinsam genutzte Arbeitsverzeichnisse), mit typischerweise höherer Latenz als Block Storage. Der zentrale methodische Punkt ist, dass Datenbewegungskosten (z. B. Kosten für das Verschieben von Daten aus Object Storage in eine Region oder zu einem anderen Dienst) und Servicegrenzen (z. B. maximale Objektgröße bei Object Storage, maximale IOPS bei Block Storage) explizit gegen das tatsächliche Zugriffsmuster geprüft werden müssen, bevor eine Speicherstrategie festgelegt wird, statt eine pauschale Standardwahl (häufig Object Storage aufgrund seiner Kosteneffizienz) unabhängig vom tatsächlichen Anwendungsfall zu treffen.

~~~text
Object Storage (see KB-0208): flat, API-based access to objects (unique key within a bucket)
  optimized for: scalability, durability (auto-replicated across AZs), cost-efficient bulk storage
  access: typically WHOLE-OBJECT (no efficient partial in-place update like a filesystem)
  -> good for: immutable/rarely-updated data (backups, media, data lake)
  -> BAD for: applications with frequent, small, in-place changes
Block Storage (see KB-0209): low-latency, block-based volume, typically attached to ONE instance
  behaves like a local disk -> good for: databases, OS drives (frequent, small, low-latency I/O)
  -> typically NOT concurrently usable by multiple instances
File Storage: filesystem-based, network-accessible, CONCURRENTLY usable by multiple instances
  -> good for: shared config, shared working directories -> typically HIGHER latency than block
KEY METHODOLOGICAL POINT: data movement costs + service limits (max object size, max IOPS)
  MUST be checked against ACTUAL access pattern BEFORE choosing a strategy
  -> never default to object storage for cost reasons regardless of actual use case
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Object Storage | API-basierter Zugriff auf unveränderliche, versionierte Objekte | ungeeignet für häufige, kleinteilige In-Place-Änderungen |
| Block Storage | niedriglatente Volumes für eine einzelne Instanz | ungeeignet für gleichzeitigen Zugriff mehrerer Instanzen |
| File Storage | gleichzeitig zugänglicher, dateisystembasierter Netzwerkspeicher | typischerweise höhere Latenz als Block Storage |
| Datenbewegungskosten | Kosten für Datentransfer zwischen Diensten/Regionen | müssen explizit gegen das tatsächliche Nutzungsmuster geprüft werden |

Implementierung: Für jede Anwendung wird zunächst deren tatsächliches Zugriffsmuster analysiert (Häufigkeit und Art von Lese-/Schreibzugriffen, Nebenläufigkeitsanforderungen, Notwendigkeit gemeinsamer Zugriffe mehrerer Instanzen), bevor ein Speichermodell gewählt wird. Bei Anwendungen mit häufigen, kleinteiligen Datenbankzugriffen wird Block Storage eingesetzt, während bei unveränderlichen, selten aktualisierten großen Datenmengen Object Storage bevorzugt wird. Vor einer Speicherentscheidung werden die relevanten Servicegrenzen (maximale Objektgröße, maximale IOPS, maximale gleichzeitige Verbindungen) und potenzielle Datenbewegungskosten explizit gegen das erwartete Nutzungsmuster geprüft.

## Scalability, Reliability, Security und Observability

Cloud-Speichermodelle skalieren die Kosteneffizienz und Leistung proportional zur Passgenauigkeit des gewählten Modells zum tatsächlichen Zugriffsmuster der Anwendung; die Reliability-Grenze liegt darin, dass ein für das tatsächliche Zugriffsmuster ungeeignetes Speichermodell proportional zur Diskrepanz zwischen Modell und Nutzungsmuster zu Leistungsproblemen (z. B. bei häufigen, kleinteiligen Änderungen auf Object Storage) oder unerwarteten Kosten (z. B. übermäßige Datenbewegung) führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Anwendung mit häufigen, kleinteiligen Datenänderungen zeigt schlechte Leistung auf Object Storage | Object Storage ist für häufige In-Place-Änderungen nicht geeignet, da der Zugriff typischerweise auf das gesamte Objekt erfolgt | eine Migration zu Block Storage oder File Storage für diesen spezifischen Anwendungsfall evaluieren |
| mehrere Instanzen können nicht gleichzeitig auf denselben Block-Storage-Volume zugreifen | Block Storage ist typischerweise nur einer einzelnen Instanz zugeordnet | einen Wechsel zu File Storage für den gemeinsam genutzten Zugriffsbedarf evaluieren |
| die Datenbewegungskosten sind höher als erwartet | Daten werden häufiger als angenommen zwischen Diensten oder Regionen verschoben | das tatsächliche Datenbewegungsmuster messen und die Speicherarchitektur zur Reduktion unnötiger Transfers anpassen |

Security: Die Haltbarkeits- und Replikationsgarantien jedes Speichermodells sollten gegen die tatsächlichen Anforderungen an Datenverfügbarkeit und -integrität geprüft werden, insbesondere bei kritischen, produktiven Datenbeständen. Observability: Die tatsächliche Zugriffshäufigkeit, IOPS-Auslastung, und Datenbewegungsvolumen über die verschiedenen Speicherdienste sind zentrale Metriken zur Bewertung der Speicherstrategie.

## Trade-offs und Entscheidungen

**Staff** wählt ein Speichermodell basierend auf dem tatsächlichen Zugriffsmuster der Anwendung, statt pauschal das kostengünstigste Modell zu bevorzugen. **Principal** macht die Speicherstrategie und ihre Begründung für das Team nachvollziehbar. **Chief** legt Speicherbeschaffungsrichtlinien im Unternehmen anhand tatsächlicher Zugriffsmuster und Haltbarkeitsanforderungen fest.

Anti-Patterns: Object Storage für Anwendungen mit häufigen, kleinteiligen In-Place-Änderungen einsetzen; Block Storage für Anwendungsfälle mit tatsächlichem Bedarf an gleichzeitigem Zugriff mehrerer Instanzen einsetzen; eine Speicherentscheidung ohne Prüfung der relevanten Servicegrenzen und Datenbewegungskosten treffen.

## Production Checklist

- [ ] Das tatsächliche Zugriffsmuster jeder Anwendung wurde vor der Speichermodell-Wahl analysiert.
- [ ] Relevante Servicegrenzen (Objektgröße, IOPS, gleichzeitige Verbindungen) sind gegen das Nutzungsmuster geprüft.
- [ ] Potenzielle Datenbewegungskosten sind vor der Architekturentscheidung abgeschätzt.
- [ ] Zugriffshäufigkeit und Kostenverteilung über die Speicherdienste werden überwacht.

## Interviewfragen

### 1. Wofür ist Object Storage typischerweise geeignet, und wofür nicht?

**Antwort:** Geeignet für unveränderliche oder selten aktualisierte Daten (Backups, Medien-Dateien); nicht geeignet für Anwendungen mit häufigen, kleinteiligen In-Place-Änderungen, da der Zugriff typischerweise auf das gesamte Objekt erfolgt.

### 2. Was unterscheidet Block Storage von File Storage?

**Antwort:** Block Storage ist typischerweise einer einzelnen Instanz zugeordnet und niedriglatent, geeignet für Datenbanken; File Storage ist gleichzeitig von mehreren Instanzen über das Netzwerk zugänglich, mit typischerweise höherer Latenz.

### 3. Warum sollte eine Speicherentscheidung nicht primär anhand der Kosten getroffen werden?

**Antwort:** Weil ein für das tatsächliche Zugriffsmuster ungeeignetes, aber kostengünstiges Modell zu erheblichen Leistungsproblemen oder unerwarteten Zusatzkosten (z. B. durch übermäßige Datenbewegung) führen kann.

### 4. Welche Faktoren sollten vor einer Speichermodell-Entscheidung geprüft werden?

**Antwort:** Das tatsächliche Zugriffsmuster der Anwendung (Häufigkeit, Nebenläufigkeit), relevante Servicegrenzen (maximale Objektgröße, IOPS), und potenzielle Datenbewegungskosten.

### 5. Wie gehst du vor, wenn eine Anwendung mit häufigen, kleinteiligen Datenänderungen schlechte Leistung auf Object Storage zeigt?

**Antwort:** Ich prüfe, ob eine Migration zu Block Storage oder File Storage für diesen spezifischen Anwendungsfall geeigneter wäre, da Object Storage für häufige In-Place-Änderungen konzeptionell nicht optimiert ist.

### 6. Widersprüchliche Anforderung: Team will maximale Kosteneinsparung (Object Storage für alles) UND niedrige Latenz für eine Datenbankanwendung — wie gehst du vor?

**Antwort:** Ich würde erklären, dass Object Storage für die häufigen, niedriglatenten Zugriffsmuster einer Datenbankanwendung konzeptionell ungeeignet ist, und Block Storage für die Datenbank empfehlen, während Object Storage gezielt für tatsächlich unveränderliche, selten aktualisierte Datenbestände (z. B. Backups) eingesetzt wird, um beide Anforderungen jeweils angemessen zu erfüllen.

## Praktische Labs

~~~python
# Conceptual storage-model suitability check (not executed against a real cloud account):

def recommend_storage_model(access_pattern, concurrent_instances, update_frequency):
    if concurrent_instances > 1 and access_pattern == "filesystem":
        return "file_storage"
    if update_frequency == "low" and access_pattern == "whole_object":
        return "object_storage"
    if update_frequency == "high" and concurrent_instances == 1:
        return "block_storage"
    return "review needed: unclear fit for standard models"

use_cases = {
    "media_archive": {"access_pattern": "whole_object", "concurrent_instances": 1, "update_frequency": "low"},
    "primary_database": {"access_pattern": "block", "concurrent_instances": 1, "update_frequency": "high"},
    "shared_config_dir": {"access_pattern": "filesystem", "concurrent_instances": 5, "update_frequency": "medium"},
}

for name, attrs in use_cases.items():
    print(f"{name}: recommended storage model = {recommend_storage_model(**attrs)}")
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [Amazon S3, EBS, and EFS — Storage Options Overview](https://aws.amazon.com/products/storage/), abgerufen 2026-09-18.
2. Google Cloud-Dokumentation: [Choosing a storage option](https://cloud.google.com/products/storage), abgerufen 2026-09-18.

Object Storage ist kanonisch in [KB-0208](../09-databases-storage/14-object-storage.md) behandelt, Block Storage in [KB-0209](../09-databases-storage/15-block-storage.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte Object-Storage-Angebote mit teilweiser, effizienter In-Place-Aktualisierung großer Objekte | Evaluating | Gegenüber klassischem Whole-Object-Zugriff erst nach Prüfung der tatsächlichen Leistungsverbesserung für den konkreten Anwendungsfall bevorzugen. |

Ein Team akzeptiert eine Speicherarchitekturentscheidung erst, wenn das tatsächliche Zugriffsmuster der Anwendung, relevante Servicegrenzen und potenzielle Datenbewegungskosten explizit geprüft und dokumentiert sind.
