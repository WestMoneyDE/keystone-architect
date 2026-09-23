---
{"id": "KB-0416", "title": "MIG und MPS", "domain": "17", "sequence": 4, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "MLOPS"], "requires": [{"id": "KB-0413", "concepts": ["GPU-Architektur und Rechenpfade"], "needed_for": "understanding"}, {"id": "KB-0415", "concepts": ["VRAM und Speicherbudgets"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine MIG-Partitionierung einer GPU in mehrere isolierte Instanzen konzeptionell nachvollziehen und gegenüber MPS-basiertem Prozessmultiplexing ohne physische Isolation vergleichen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Zwischen MIG (physische Hardwarepartitionierung mit starker Isolation) und MPS (Prozessmultiplexing ohne physische Isolation) basierend auf tatsächlichem Mandanten-Isolationsbedarf entscheiden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Leistungsinterferenz zwischen mandantenfähigen GPU-Workloads auf eine fehlende physische Isolation (MPS statt MIG) zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Eine explizite Entscheidungsregel zwischen MIG und MPS basierend auf tatsächlichem Isolations- versus Durchsatzbedarf als Standard für mandantenfähige GPU-Infrastruktur im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die praktische Treiber-/Kubernetes-Integration und Repartitionierung von MIG-Instanzen im Betrieb ist Vertiefung, für die noch kein praktischer Betriebsbeleg vorliegt.", "rationale": "Ein Lernziel wird erst durch ein überprüfbares Artefakt glaubwürdig."}}, "lab_validation": [{"lab_id": "KB-0416-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Modell mit physisch partitionierten GPU-Instanzen (MIG-Konzept) gegenüber prozessgemultiplextem Zugriff (MPS-Konzept)", "evidence": "Ein simuliertes Szenario mit zwei konkurrierenden Workloads zeigt, dass eine physisch partitionierte Zuweisung (MIG-Konzept) vollständige Leistungsisolation zwischen den Workloads garantiert, während ein simuliertes prozessgemultiplextes Modell (MPS-Konzept) eine Leistungsinterferenz zwischen den Workloads bei gleichzeitiger hoher Last zeigt.", "limitations": "Kein reales GPU-Hardware-Benchmark mit tatsächlichem MIG-/MPS-Treiberbetrieb, kein produktives Multi-Mandanten-System, konzeptionelles Modell."}]}
---
# MIG und MPS

> **Ziel:** Multi-Instance GPU (MIG) partitioniert eine physische GPU auf Hardware-Ebene in mehrere, vollständig isolierte Instanzen mit jeweils eigenen Rechenkernen und eigenem Speicheranteil, während Multi-Process Service (MPS) mehrere Prozesse auf derselben, nicht physisch partitionierten GPU über Prozessmultiplexing gleichzeitig ausführt, aufbauend auf GPU-Architektur (siehe [KB-0413](01-gpu-architektur-und-rechenpfade.md)) und VRAM-Budgetierung (siehe [KB-0415](03-vram-und-speicherbudgets.md)). Der zentrale Punkt dieses Kapitels ist die Abwägung zwischen Isolation (MIG garantiert vollständige, physische Leistungs- und Fehlerisolation zwischen Mandanten) und Durchsatz/Flexibilität (MPS ermöglicht potenziell höheren Gesamtdurchsatz durch dynamisches Teilen der vollen GPU-Ressourcen, ohne physische Partitionierungsgrenzen).

## Zweck, Mental Model und Dependencies

MIG teilt eine physische GPU auf Hardware-Ebene in mehrere, voneinander vollständig isolierte Instanzen — jede MIG-Instanz erhält einen festen Anteil an Rechenkernen (SMs) und Speicher, und ein Workload in einer Instanz kann die Leistung eines Workloads in einer anderen Instanz auf derselben physischen GPU grundsätzlich nicht beeinträchtigen, da die Hardware-Ressourcen tatsächlich getrennt sind. MPS hingegen teilt keine physischen Hardware-Ressourcen, sondern ermöglicht mehreren Prozessen, ihre GPU-Kernel-Aufrufe über einen gemeinsamen Scheduling-Dienst gleichzeitig auf derselben, ungeteilten GPU auszuführen — dies kann bei komplementären Workload-Mustern (z. B. wenn ein Prozess primär speicherbandbreitenlimitiert und ein anderer primär rechenlimitiert ist) zu höherem Gesamtdurchsatz führen als eine starre Partitionierung, birgt aber das Risiko einer tatsächlichen Leistungsinterferenz zwischen den Prozessen bei gleichzeitiger hoher Last, da keine physische Trennung der Ressourcen erzwungen wird. Der zentrale Entscheidungspunkt ist daher: MIG wird gewählt, wenn tatsächliche, harte Isolationsgarantien zwischen mandantenfähigen Workloads erforderlich sind (z. B. bei unterschiedlichen Kunden oder sicherheitskritisch getrennten Umgebungen), während MPS gewählt wird, wenn maximaler Gesamtdurchsatz bei vertrauenswürdigen, komplementären internen Workloads wichtiger ist als strikte Isolation. Ein zusätzlicher praktischer Aspekt bei MIG ist die Profilwahl (welche Partitionsgröße pro Instanz gewählt wird) und potenzielle Ressourcenfragmentierung: sind die gewählten Profilgrößen nicht optimal auf die tatsächlichen Workload-Anforderungen abgestimmt, kann Kapazität ungenutzt bleiben, oder ein Profilwechsel (Änderung der Partitionierung) kann eine vollständige Neukonfiguration der GPU erfordern, was kurzzeitig die Verfügbarkeit aller Instanzen dieser GPU beeinträchtigt.

~~~text
MIG: HARDWARE-level partitioning -- physically ISOLATED instances, each with FIXED compute (SM) + memory share
  workload in one instance CANNOT affect performance in another (true hardware separation)
MPS: NO physical resource split -- multiple processes' GPU kernel calls share a scheduling service on the SAME undivided GPU
  can yield HIGHER total throughput for COMPLEMENTARY workload patterns (one memory-bound, one compute-bound)
  RISK: actual performance interference between processes under simultaneous high load -- no enforced physical separation
DECISION RULE:
  MIG: HARD isolation guarantees needed (different customers, security-critical separation)
  MPS: max total throughput for TRUSTED, complementary internal workloads matters more than strict isolation
PRACTICAL MIG ASPECT: profile choice (partition size per instance) + fragmentation risk
  suboptimal profile sizing -> unused capacity; profile CHANGE often requires full GPU reconfiguration
  -> temporarily affects availability of ALL instances on that GPU
~~~

## Core Concepts, Architektur und Implementierung

| Aspekt | MIG | MPS |
|---|---|---|
| Isolationsebene | physisch, hardware-erzwungen | logisch, prozessbasiert ohne physische Trennung |
| Leistungsinterferenz-Risiko | keines, garantiert durch Hardware-Trennung | möglich bei gleichzeitiger hoher Last komplementärer Workloads |
| Durchsatz-Potenzial | begrenzt auf feste Partitionsgröße | potenziell höher durch dynamisches Ressourcenteilen |
| Geeignet für | strikte Mandantentrennung, sicherheitskritische Isolation | vertrauenswürdige, komplementäre interne Workloads |

Implementierung: Vor der Wahl zwischen MIG und MPS wird der tatsächliche Isolationsbedarf explizit bewertet — bei unterschiedlichen, nicht vertrauenswürdigen Mandanten oder sicherheitskritischer Trennung wird MIG mit physischer Partitionierung gewählt; bei vertrauenswürdigen, komplementären internen Workloads mit dem Ziel maximalen Gesamtdurchsatzes wird MPS evaluiert. Bei MIG-Nutzung werden Profilgrößen basierend auf den tatsächlichen Ressourcenanforderungen der geplanten Workloads gewählt, um Fragmentierung (ungenutzte Kapazität durch suboptimale Partitionsgrößen) zu minimieren, und Profilwechsel werden geplant, statt unvorbereitet durchgeführt zu werden, da sie die Verfügbarkeit aller Instanzen der betroffenen GPU kurzzeitig beeinträchtigen können.

## Scalability, Reliability, Security und Observability

MIG skaliert garantierte, isolierte Kapazität proportional zur Anzahl konfigurierter Partitionen, mit einer festen Obergrenze pro Partition; MPS skaliert potenziellen Gesamtdurchsatz proportional zur tatsächlichen Komplementarität der gleichzeitig laufenden Workloads, mit dem Risiko, dass diese Skalierung bei nicht-komplementären, konkurrierenden Workloads in tatsächliche Leistungsinterferenz umschlägt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Workload zeigt unerwartete Leistungseinbußen, wenn ein anderer Workload auf derselben GPU gleichzeitig hohe Last erzeugt | MPS wird verwendet, ohne dass die tatsächliche Isolationsanforderung dies zulässt, wodurch Leistungsinterferenz auftritt | die betroffenen Workloads auf MIG mit physischer Partitionierung umstellen, um garantierte Isolation zu erhalten |
| eine MIG-partitionierte GPU zeigt insgesamt ungenutzte Kapazität | die gewählten Profilgrößen sind nicht optimal auf die tatsächlichen Workload-Anforderungen abgestimmt | die Profilgrößen basierend auf tatsächlich gemessenem Ressourcenbedarf der Workloads neu bewerten |
| eine Profiländerung an einer MIG-GPU führt zu einer kurzzeitigen Verfügbarkeitsunterbrechung aller darauf laufenden Instanzen | ein Profilwechsel erfordert eine vollständige Neukonfiguration der GPU | Profilwechsel im Voraus planen und außerhalb kritischer Betriebszeiten durchführen |

Security: MIG bietet stärkere Sicherheitsgarantien für mandantenfähige Umgebungen, da eine physische Isolation Seitenkanalangriffe oder unbeabsichtigte Informationsweitergabe zwischen Mandanten auf derselben physischen GPU strukturell ausschließt, was MPS aufgrund fehlender physischer Trennung nicht garantieren kann. Observability: Die tatsächliche Leistungsinterferenz zwischen gleichzeitig laufenden Workloads (bei MPS), die Auslastung jeder MIG-Partition, und die Häufigkeit ungenutzter Kapazität durch Fragmentierung sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert MIG für Workloads mit tatsächlichem Isolationsbedarf und MPS gezielt nur für vertrauenswürdige, komplementäre interne Workloads. **Principal** macht die Isolations-/Durchsatz-Abwägung für das Team nachvollziehbar. **Chief** etabliert eine explizite Entscheidungsregel zwischen MIG und MPS basierend auf tatsächlichem Isolations- versus Durchsatzbedarf als Standard für mandantenfähige GPU-Infrastruktur im Unternehmen.

Anti-Patterns: MPS für Workloads mit tatsächlichem, strikten Mandanten-Isolationsbedarf einsetzen; MIG-Profilgrößen ohne Bezug zu tatsächlichen Workload-Anforderungen wählen, wodurch Kapazität fragmentiert bleibt; Profilwechsel an produktiven MIG-GPUs ohne Berücksichtigung der resultierenden kurzzeitigen Verfügbarkeitsunterbrechung durchführen.

## Production Checklist

- [ ] Die Wahl zwischen MIG und MPS basiert auf explizit bewertetem, tatsächlichem Isolationsbedarf.
- [ ] MIG-Profilgrößen sind basierend auf tatsächlichem Ressourcenbedarf der Workloads gewählt.
- [ ] Profilwechsel an MIG-GPUs sind geplant und außerhalb kritischer Betriebszeiten durchgeführt.
- [ ] Bei MPS-Nutzung wird die tatsächliche Leistungsinterferenz zwischen Workloads aktiv überwacht.

## Interviewfragen

### 1. Was ist der zentrale Unterschied zwischen MIG und MPS?

**Antwort:** MIG partitioniert eine GPU physisch auf Hardware-Ebene in vollständig isolierte Instanzen; MPS teilt keine physischen Ressourcen, sondern ermöglicht mehreren Prozessen gleichzeitigen Zugriff über einen gemeinsamen Scheduling-Dienst auf derselben, ungeteilten GPU.

### 2. Wann sollte MIG gegenüber MPS gewählt werden?

**Antwort:** Wenn tatsächliche, harte Isolationsgarantien zwischen mandantenfähigen Workloads erforderlich sind, z. B. bei unterschiedlichen, nicht vertrauenswürdigen Mandanten oder sicherheitskritischer Trennung.

### 3. Welches Risiko besteht bei MPS gegenüber MIG?

**Antwort:** Eine tatsächliche Leistungsinterferenz zwischen gleichzeitig laufenden Prozessen bei hoher Last, da MPS keine physische Ressourcentrennung erzwingt, im Gegensatz zur hardware-garantierten Isolation von MIG.

### 4. Was ist Fragmentierung im Kontext von MIG, und wie entsteht sie?

**Antwort:** Ungenutzte GPU-Kapazität, die entsteht, wenn die gewählten Partitionsgrößen (Profile) nicht optimal auf die tatsächlichen Ressourcenanforderungen der Workloads abgestimmt sind.

### 5. Wie gehst du vor, wenn ein Workload unerwartete Leistungseinbußen bei gleichzeitiger hoher Last eines anderen Workloads auf derselben GPU zeigt?

**Antwort:** Ich prüfe, ob MPS ohne ausreichende Isolationsgarantie verwendet wird, und stelle die betroffenen Workloads bei Bedarf auf MIG mit physischer Partitionierung um.

### 6. Widersprüchliche Anforderung: Team will maximalen GPU-Gesamtdurchsatz UND garantiert keine Leistungsinterferenz zwischen mandantenfähigen Workloads — wie gehst du vor?

**Antwort:** Ich würde erklären, dass diese beiden Ziele bei nicht vertrauenswürdigen oder nicht komplementären Mandanten strukturell im Widerspruch stehen, und MIG mit physischer Isolation für die mandantenfähigen Workloads empfehlen, während MPS gezielt nur für interne, vertrauenswürdige und tatsächlich komplementäre Workloads eingesetzt wird, wo maximaler Durchsatz ohne Isolationsrisiko sinnvoll ist.

## Praktische Labs

~~~python
class SimulatedGPUWorkload:
    def __init__(self, name, base_latency):
        self.name = name
        self.base_latency = base_latency

def mig_isolated_latency(workload, other_workload_active):
    # MIG: physical isolation -- other workload's activity has NO effect
    return workload.base_latency

def mps_shared_latency(workload, other_workload_active):
    # MPS: no physical isolation -- concurrent high load causes interference
    interference_factor = 1.6 if other_workload_active else 1.0
    return workload.base_latency * interference_factor

workload_a = SimulatedGPUWorkload("tenant-a-inference", base_latency=0.010)

print(f"MIG (physically isolated) latency, other tenant active: {mig_isolated_latency(workload_a, other_workload_active=True):.4f}s")
print(f"MPS (shared, no isolation) latency, other tenant active: {mps_shared_latency(workload_a, other_workload_active=True):.4f}s")
print(f"MPS (shared, no isolation) latency, other tenant IDLE:   {mps_shared_latency(workload_a, other_workload_active=False):.4f}s")
~~~

## Dependencies, Cross-References und Quellen

1. NVIDIA-Dokumentation: [Multi-Instance GPU (MIG) User Guide](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/index.html), abgerufen 2026-09-17.
2. NVIDIA-Dokumentation: [Multi-Process Service (MPS)](https://docs.nvidia.com/deploy/mps/index.html), abgerufen 2026-09-17.

GPU-Architektur und Rechenpfade sind kanonisch in [KB-0413](01-gpu-architektur-und-rechenpfade.md) behandelt; VRAM und Speicherbudgets in [KB-0415](03-vram-und-speicherbudgets.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, feingranularere MIG-Profilkonfigurationen bei neueren GPU-Generationen zur Reduktion von Fragmentierung | Evaluating | Gegenüber älteren, gröber granularen MIG-Implementierungen abwägen, sobald der konkrete Workload-Mix eine feinere Partitionierung erfordert. |
| Dynamische, automatisierte MIG-Profilverwaltung, die Partitionsgrößen basierend auf tatsächlichem Bedarf automatisch anpasst | Evaluating | Gegenüber statischer Profilkonfiguration abwägen, sobald ein zuverlässiges Werkzeug für automatisierte Repartitionierung ohne Betriebsunterbrechung verfügbar ist. |

Ein Team akzeptiert eine mandantenfähige GPU-Infrastrukturentscheidung erst, wenn die Wahl zwischen MIG und MPS explizit gegen den tatsächlichen Isolationsbedarf begründet ist.
