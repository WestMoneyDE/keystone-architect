---
{"id": "KB-0576", "title": "DCGM und GPU-Telemetrie", "domain": "24", "sequence": 12, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "CLOUD", "MLOPS"], "requires": [{"id": "KB-0571", "concepts": ["Prometheus"], "needed_for": "understanding"}, {"id": "KB-0416", "concepts": ["MIG und MPS"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "DCGM für GPU-Health-, Speicher- und Auslastungsmetriken anhand offizieller Dokumentation korrekt einsetzen und ECC-Fehler sowie thermische Begrenzungen erkennen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete GPU-Infrastruktur explizit gestalten, wie GPU-Telemetrie über DCGM in eine bestehende Prometheus-basierte Metrikpipeline integriert wird und wie GPU-spezifische Hardwarewarnungen von Auslastungs- und Nachfragesignalen unterschieden werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen überlasteten GPU-Servingpfad auf Basis von DCGM-Telemetrie von einer tatsächlichen Hardwarewarnung (ECC-Fehler, thermische Begrenzung) unterscheiden können, statt eine Diagnosekategorie fälschlich der anderen zuzuordnen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für GPU-Telemetrie-Erfassung festlegen, die Hardwarewarnungen und Auslastungssignale strukturell unterscheidbar machen, bevor eine kritische GPU-Infrastruktur skaliert wird.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne NVML-Schnittstellenmechanik hinter DCGM im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis, wie GPU-Hardwarewarnungen von überlasteten Servingpfaden unterschieden werden, nicht die interne Schnittstellenimplementierung von DCGM."}}, "lab_validation": [{"lab_id": "KB-0576-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation der Unterscheidung zwischen Hardwarewarnung und Nachfrageüberlastung, keine produktive DCGM-Installation verwendet", "evidence": "Ein lokales Skript simuliert, wie eine hohe GPU-Auslastung ohne ECC-Fehler oder thermische Begrenzung auf schwankende Modellnachfrage hindeutet, während dieselbe hohe Auslastung mit gleichzeitigen ECC-Fehlern oder thermischer Drosselung auf ein tatsächliches Hardwareproblem hindeutet, und zeigt damit die strukturelle Unterscheidung zwischen den beiden Diagnosekategorien.", "limitations": "Simulation mit synthetischen, deterministischen Daten, keine reale DCGM-Installation oder GPU-Hardware."}]}
---
# DCGM und GPU-Telemetrie

> **Ziel:** NVIDIA DCGM (Data Center GPU Manager) erfasst GPU-Health-, Speicher- und Auslastungsmetriken und kann diese in eine bestehende Metrikpipeline (etwa Prometheus, siehe [KB-0571](07-prometheus.md)) integrieren. Der zentrale Punkt dieses Kapitels ist die systematische Unterscheidung zweier grundlegend verschiedener Diagnosekategorien, die bei GPU-Infrastruktur leicht verwechselt werden: **Hardwarewarnungen** (ECC-Fehler, thermische Begrenzung) zeigen ein tatsächliches, physisches Problem der GPU selbst an, während ein **überlasteter Servingpfad** lediglich schwankende Modellnachfrage widerspiegelt, die die vorhandene GPU-Kapazität übersteigt — eine hohe GPU-Auslastung allein erlaubt keine Unterscheidung zwischen diesen beiden Fällen, weshalb DCGM-Telemetrie gezielt auf ECC-Fehler- und thermische Signale geprüft werden muss, bevor eine hohe Auslastung als reines Kapazitäts- statt als Hardwareproblem behandelt wird.

## Zweck, Mental Model und Dependencies

Die bereits in [KB-0416](../17-gpu-inference/04-mig-und-mps.md) behandelte Hardwarepartitionierung (MIG) und das Prozessmultiplexing (MPS) betreffen, wie GPU-Kapazität unter mehreren Workloads aufgeteilt wird — DCGM-Telemetrie liefert die Beobachtungsgrundlage, um zu beurteilen, ob diese aufgeteilte Kapazität tatsächlich ausreicht oder ob ein physisches Hardwareproblem die effektive Kapazität zusätzlich einschränkt. Der zentrale diagnostische Unterschied liegt in der Signalquelle: Auslastungsmetriken (etwa GPU-Nutzungsprozent oder Speicherbelegung) korrelieren direkt mit der tatsächlichen Modellnachfrage — eine hohe Auslastung bei gleichzeitig unauffälligen Hardwaresignalen deutet typischerweise auf schwankende, gestiegene Nachfrage hin, die durch zusätzliche Kapazität oder Skalierung adressiert werden sollte. ECC-Fehler (Speicherfehlerkorrektur-Ereignisse) und thermische Begrenzung (GPU-Drosselung aufgrund von Übertemperatur) sind dagegen unabhängig von der Nachfrage und zeigen ein tatsächliches, physisches Problem der GPU-Hardware selbst an — eine GPU mit ansteigenden ECC-Fehlern oder wiederholter thermischer Drosselung liefert reduzierte oder unzuverlässige Leistung unabhängig davon, wie hoch die tatsächliche Nachfrage ist, und benötigt eine hardwarebezogene Reaktion (Austausch, Kühlungsprüfung), nicht eine reine Kapazitätserweiterung. Die praktische Konsequenz ist, dass eine Diagnose bei einem überlasteten GPU-Servingpfad immer beide Signalklassen getrennt prüfen muss: Steigt die Auslastung ohne begleitende Hardwarewarnungen, liegt vermutlich ein Kapazitätsproblem vor; treten gleichzeitig ECC-Fehler oder thermische Drosselung auf, liegt vermutlich (zusätzlich oder stattdessen) ein Hardwareproblem vor, das eine Kapazitätserweiterung allein nicht löst.

~~~text
NVIDIA DCGM: captures GPU health/memory/utilization metrics, integrates into metric pipeline (Prometheus, KB-0571)
KEY POINT: two structurally DIFFERENT diagnostic categories, easily confused:
  HARDWARE WARNINGS (ECC errors, thermal throttling) -> actual, PHYSICAL GPU problem
  OVERLOADED SERVING PATH -> merely reflects fluctuating model demand exceeding available GPU capacity
  high GPU utilization ALONE does not distinguish between these two cases
  -> must check DCGM telemetry specifically for ECC/thermal signals before treating high util
     as pure capacity problem instead of hardware problem
Relation to MIG/MPS (KB-0416): hardware partitioning/process multiplexing determines HOW capacity is split
  DCGM telemetry: observational basis for whether that split capacity is actually SUFFICIENT
    or additionally constrained by a physical hardware problem
DIAGNOSTIC SIGNAL SOURCE DIFFERS:
  utilization metrics (GPU usage %, memory) correlate DIRECTLY with actual model demand
    high util + unremarkable hardware signals -> typically fluctuating/increased demand
    -> address via added capacity or scaling
  ECC errors (memory error-correction events) + thermal throttling (GPU throttling from overtemp)
    -> INDEPENDENT of demand, show actual physical GPU hardware problem
    -> reduced/unreliable performance regardless of actual demand level
    -> needs hardware-related response (replacement, cooling check), NOT pure capacity expansion
PRACTICAL CONSEQUENCE: overloaded serving path diagnosis must ALWAYS check both signal classes separately
  util rising w/o accompanying hardware warnings -> likely capacity problem
  ECC errors / thermal throttling occurring simultaneously -> likely (also/instead) hardware problem
    that capacity expansion alone does not solve
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| GPU-Auslastungsmetriken | zeigt Nutzungsgrad relativ zur Modellnachfrage | korreliert mit Kapazitätsbedarf |
| ECC-Fehler | zeigt Speicherfehlerkorrektur-Ereignisse | unabhängig von Nachfrage, Hardwaresignal |
| Thermische Begrenzung | zeigt GPU-Drosselung durch Übertemperatur | unabhängig von Nachfrage, Hardwaresignal |
| Prometheus-Integration | bindet GPU-Telemetrie in bestehende Metrikpipeline ein | ermöglicht gemeinsame Alarmierung mit übrigen Diensten |

Implementierung: DCGM-Exporter integriert GPU-Health-, Speicher- und Auslastungsmetriken in die bestehende Prometheus-Pipeline. Alarmierungsregeln werden getrennt für Auslastungssignale (Kapazitätshinweis) und Hardwaresignale (ECC-Fehler, thermische Begrenzung) definiert, statt eine einzelne, undifferenzierte GPU-Warnung zu erzeugen.

## Scalability, Reliability, Security und Observability

DCGM-Telemetrie skaliert die Diagnosefähigkeit proportional zur konsequenten Trennung von Auslastungs- und Hardwaresignalen; die Reliability-Grenze liegt darin, dass eine undifferenzierte GPU-Auslastungswarnung ohne begleitende ECC-/thermische Prüfung ein tatsächliches Hardwareproblem fälschlich als reines Kapazitätsproblem fehlinterpretieren kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein GPU-Servingpfad zeigt hohe Auslastung und reduzierte Antwortqualität | schwankende Modellnachfrage übersteigt die vorhandene GPU-Kapazität | ECC-Fehler und thermische Begrenzung prüfen; bei Unauffälligkeit Kapazitätserweiterung erwägen |
| eine GPU liefert trotz moderater Auslastung unzuverlässige oder reduzierte Leistung | ansteigende ECC-Fehler oder wiederholte thermische Drosselung deuten auf ein Hardwareproblem hin | DCGM-Telemetrie gezielt auf ECC-Fehler- und Temperaturverlauf prüfen |
| eine Kapazitätserweiterung löst ein beobachtetes GPU-Leistungsproblem nicht | das zugrunde liegende Problem war ein Hardwareproblem, keine Kapazitätsknappheit | die betroffene GPU auf ECC-Fehler und thermische Historie prüfen, statt weitere Kapazität hinzuzufügen |

Security: GPU-Telemetrie-Endpunkte sollten wie andere Metrikquellen nicht ohne Zugriffskontrolle öffentlich erreichbar sein. Observability: Die getrennte Verfolgung von Auslastungs- und Hardwaresignalen über die Zeit ist zentral, um wiederkehrende Hardwareprobleme von tatsächlich wachsender Nachfrage zu unterscheiden.

## Trade-offs und Entscheidungen

**Staff** liest DCGM-Telemetrie korrekt und unterscheidet Auslastungs- von Hardwaresignalen für einen gegebenen Vorfall. **Principal** entwirft die vollständige GPU-Telemetrie-Integration in die bestehende Metrikpipeline mit getrennter Alarmierung. **Chief** legt unternehmensweite Standards für GPU-Telemetrie-Erfassung fest, die Hardware- und Kapazitätsprobleme strukturell unterscheidbar machen.

Anti-Patterns: eine hohe GPU-Auslastung ohne Prüfung von ECC-Fehlern oder thermischer Begrenzung pauschal als Kapazitätsproblem behandeln; Kapazität erweitern, ohne ein zugrunde liegendes Hardwareproblem auszuschließen; GPU-Telemetrie nicht in die bestehende Metrikpipeline integrieren und dadurch getrennte, inkonsistente Diagnosewerkzeuge für GPU- und übrige Infrastruktur pflegen.

## Production Checklist

- [ ] DCGM-Telemetrie ist in die bestehende Prometheus-Metrikpipeline integriert.
- [ ] Alarmierungsregeln unterscheiden explizit zwischen Auslastungs- und Hardwaresignalen.
- [ ] ECC-Fehler und thermische Begrenzung werden bei jedem GPU-Leistungsproblem geprüft, bevor eine Kapazitätserweiterung erfolgt.
- [ ] GPU-Telemetrie-Endpunkte sind nicht ohne Zugriffskontrolle öffentlich erreichbar.

## Interviewfragen

### 1. Welche zwei Diagnosekategorien unterscheidet DCGM-Telemetrie strukturell?

**Antwort:** Hardwarewarnungen (ECC-Fehler, thermische Begrenzung), die ein tatsächliches, physisches GPU-Problem anzeigen, und Auslastungssignale, die schwankende Modellnachfrage widerspiegeln.

### 2. Warum reicht eine hohe GPU-Auslastung allein nicht zur Diagnose eines überlasteten Servingpfads aus?

**Antwort:** Weil eine hohe Auslastung sowohl durch gestiegene Modellnachfrage als auch durch ein Hardwareproblem (das die effektive Kapazität reduziert) verursacht werden kann, und beide Fälle ohne Prüfung der ECC-Fehler- und Temperatursignale nicht unterscheidbar sind.

### 3. Was zeigen ECC-Fehler an?

**Antwort:** Speicherfehlerkorrektur-Ereignisse, die unabhängig von der tatsächlichen Modellnachfrage auftreten und auf ein physisches Hardwareproblem hindeuten.

### 4. Warum löst eine Kapazitätserweiterung ein GPU-Leistungsproblem nicht immer?

**Antwort:** Weil das zugrunde liegende Problem ein Hardwareproblem (ECC-Fehler, thermische Drosselung) sein kann, das durch zusätzliche Kapazität nicht behoben wird.

### 5. Wie gehst du vor, wenn ein GPU-Servingpfad hohe Auslastung und reduzierte Antwortqualität zeigt?

**Antwort:** Ich prüfe zuerst DCGM-Telemetrie auf ECC-Fehler und thermische Begrenzung; sind diese unauffällig, behandle ich es als Kapazitätsproblem und erwäge eine Erweiterung, andernfalls als Hardwareproblem.

### 6. Widersprüchliche Anforderung: Team will sofortige Kapazitätserweiterung bei jeder hohen GPU-Auslastung UND Vermeidung unnötiger Hardwarekosten bei tatsächlichen Nachfrageschwankungen — wie gehst du vor?

**Antwort:** Ich würde vor jeder Kapazitätserweiterung eine kurze, standardisierte DCGM-Prüfung auf ECC-Fehler und thermische Begrenzung durchführen, um zwischen tatsächlichem Kapazitätsbedarf und einem zugrunde liegenden Hardwareproblem zu unterscheiden, statt bei jeder hohen Auslastung reflexhaft zu erweitern oder eine tatsächliche Hardwarestörung fälschlich als Nachfrageschwankung zu behandeln.

## Praktische Labs

~~~python
# Local, deterministic simulation of distinguishing hardware warning from demand overload (executed locally, no real DCGM):

def diagnose_gpu(utilization, ecc_errors, thermal_throttling):
    if ecc_errors > 0 or thermal_throttling:
        return "hardware problem: check GPU for replacement/cooling, capacity expansion alone will not help"
    elif utilization > 90:
        return "demand overload: consider capacity expansion or scaling"
    else:
        return "nominal"

print(diagnose_gpu(utilization=95, ecc_errors=0, thermal_throttling=False))
print(diagnose_gpu(utilization=70, ecc_errors=3, thermal_throttling=False))
print(diagnose_gpu(utilization=98, ecc_errors=0, thermal_throttling=True))
~~~

## Dependencies, Cross-References und Quellen

1. NVIDIA-Dokumentation: [NVIDIA Data Center GPU Manager (DCGM) Documentation](https://docs.nvidia.com/datacenter/dcgm/latest/index.html), abgerufen 2026-09-18.
2. NVIDIA-Dokumentation: [DCGM Exporter for Prometheus](https://github.com/NVIDIA/dcgm-exporter), abgerufen 2026-09-18.

MIG und MPS als Kapazitätsaufteilungsmechanismen sind kanonisch in [KB-0416](../17-gpu-inference/04-mig-und-mps.md) behandelt; die zugrunde liegende Prometheus-Pipeline in [KB-0571](07-prometheus.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, DCGM-basierte Predictive-Maintenance-Modelle zur Vorhersage bevorstehender Hardwareausfälle aus ECC-Fehlertrends | Evaluating | Vor produktivem Vertrauen gegen tatsächliche Ausfallhistorie validieren, da eine unzureichend validierte Vorhersage zu unnötigem oder verspätetem Hardwareaustausch führen kann. |

Ein Team akzeptiert eine GPU-Telemetrie-Strategie erst, wenn Auslastungs- und Hardwaresignale nachweislich getrennt alarmiert werden und Kapazitätsentscheidungen erst nach Ausschluss eines Hardwareproblems getroffen werden.
