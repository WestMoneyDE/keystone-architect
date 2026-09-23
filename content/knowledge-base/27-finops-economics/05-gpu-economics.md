---
{"id": "KB-0639", "title": "GPU Economics", "domain": "27", "sequence": 5, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "PLATFORM", "GENAI", "CHIEF"], "requires": [{"id": "KB-0638", "concepts": ["Cloud Unit Economics"], "needed_for": "understanding"}, {"id": "KB-0439", "concepts": ["Inferenzkapazität und Lastprofile"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Beschleunigerkosten, Auslastung und Kapazitätsbindung für ein konkretes GPU-System anhand der bereits in KB-0638 behandelten Unit-Economics-Methodik kombinieren und Miet-, Kauf- und Sharingmodelle quantitativ gegenüber tatsächlichem produktivem Durchsatz vergleichen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie GPU-Auslastung (aufbauend auf der bereits in KB-0439 behandelten Inferenzkapazitätsplanung) in eine wirtschaftlich vergleichbare Kennzahl überführt wird, die formale Kapazitätsbindung von tatsächlich produktivem Durchsatz unterscheidet.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine GPU-Kapazität formal gebunden, aber tatsächlich nicht produktiv genutzt wird, und diese verdeckte Ineffizienz von einer tatsächlich hohen, wirtschaftlich gerechtfertigten Auslastung unterscheiden können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für GPU-Economics-Bewertung festlegen, die Miet-, Kauf- und Sharingmodelle anhand tatsächlichen, produktiven Durchsatzes statt formaler Kapazitätsbindung quantitativ vergleichbar machen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, technische Implementierung von GPU-Partitionierung (MIG/MPS) ist bereits in Domain 17 behandelt.", "rationale": "Kern ist der wirtschaftliche Vergleich von Beschaffungsmodellen anhand tatsächlichen Durchsatzes, nicht die technische Partitionierungsimplementierung."}}, "lab_validation": [{"lab_id": "KB-0639-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Unterscheidung von formaler Kapazitätsbindung und tatsächlichem, produktivem Durchsatz, kein produktives GPU-Kostenrechnungs-Tool verwendet", "evidence": "Ein lokales Skript berechnet für eine gebundene GPU-Kapazität sowohl die formale Auslastungsrate als auch den tatsächlichen, produktiven Durchsatz und zeigt, wie eine hohe formale Bindung dennoch mit niedrigem tatsächlichem Durchsatz einhergehen kann.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales GPU-Kostenrechnungs-Tool."}]}
---
# GPU Economics

> **Ziel:** GPU Economics kombiniert Beschleunigerkosten, Auslastung und Kapazitätsbindung, aufbauend auf der bereits in [KB-0638](04-cloud-unit-economics.md) behandelten Unit-Economics-Methodik und der bereits in [KB-0439](../17-gpu-inference/27-inferenzkapazitaet-und-lastprofile.md) behandelten Inferenzkapazitätsplanung. Der zentrale Punkt dieses Kapitels ist die Unterscheidung zwischen **formaler Kapazitätsbindung** (eine GPU-Instanz ist reserviert oder gemietet) und **tatsächlichem, produktivem Durchsatz** (die GPU verarbeitet tatsächlich Anfragen mit wirtschaftlich sinnvoller Effizienz) — GPU-Ressourcen sind vergleichsweise teuer, und eine hohe formale Auslastungs- oder Bindungsrate garantiert nicht automatisch einen wirtschaftlich sinnvollen, tatsächlich produktiven Einsatz, weshalb Miet-, Kauf- und Sharingmodelle explizit anhand des tatsächlichen Durchsatzes, nicht anhand formaler Kapazitätskennzahlen, quantitativ verglichen werden müssen.

## Zweck, Mental Model und Dependencies

Formale Kapazitätsbindung (etwa "die GPU-Instanz ist zu 90% ihrer Zeit reserviert oder belegt") ist eine leicht messbare, aber wirtschaftlich unzureichende Kennzahl, da sie nichts darüber aussagt, ob die gebundene Kapazität tatsächlich produktiv genutzt wird — eine GPU kann formal vollständig gebunden sein, während sie tatsächlich einen erheblichen Anteil dieser Zeit auf Eingabedaten wartet, ineffizient batchweise verarbeitet, oder für Anfragen reserviert ist, die tatsächlich selten eintreffen. Der tatsächlich relevante, wirtschaftliche Maßstab ist der produktive Durchsatz (etwa tatsächlich verarbeitete Inferenzanfragen pro Zeiteinheit relativ zu den tatsächlichen Kosten) — dieselbe methodische Unterscheidung zwischen formaler Existenz und tatsächlicher Wirksamkeit, die bereits mehrfach in diesem Curriculum (etwa bei formaler Sicherheitskontrolle versus tatsächlicher Wirksamkeit) behandelt wurde, gilt hier direkt auf GPU-Ressourcen übertragen. Der Vergleich zwischen Miet- (On-Demand-Nutzung ohne langfristige Bindung), Kauf- (eigene, langfristig gebundene Hardware) und Sharingmodellen (mehrere Workloads teilen sich dieselbe GPU-Kapazität, siehe die bereits in [KB-0416](../17-gpu-inference/04-mig-und-mps.md) behandelte MIG/MPS-Partitionierung) muss deshalb anhand des tatsächlichen, produktiven Durchsatzes pro Kosteneinheit erfolgen, nicht anhand formaler Preisvergleiche pro Instanzstunde — ein Kaufmodell mit niedrigeren formalen Stundenkosten kann wirtschaftlich schlechter abschneiden als ein Mietmodell mit höheren formalen Stundenkosten, wenn die gekaufte Hardware tatsächlich nur einen Bruchteil der Zeit produktiv ausgelastet ist, während eine gemietete, elastisch skalierende Kapazität tatsächlich näher an durchgängig produktiver Auslastung betrieben wird. Diese Betrachtung verbindet sich direkt mit der bereits in [KB-0439](../17-gpu-inference/27-inferenzkapazitaet-und-lastprofile.md) behandelten Inferenzkapazitätsplanung: Ein Lastprofil mit stark schwankender, unvorhersehbarer Nachfrage rechtfertigt eher ein elastisches Miet- oder Sharingmodell, während ein Lastprofil mit konstant hoher, vorhersehbarer Nachfrage eher ein Kaufmodell wirtschaftlich rechtfertigen kann — die richtige Wahl hängt von der tatsächlichen Übereinstimmung zwischen Lastprofil und Beschaffungsmodell ab, nicht von einem pauschal "günstigeren" Modell.

~~~text
GPU Economics: combines accelerator cost, utilization, capacity commitment
  builds on KB-0638 unit-economics methodology + KB-0439 inference capacity planning
KEY POINT: distinction between FORMAL CAPACITY COMMITMENT (GPU instance reserved/rented)
  and ACTUAL, PRODUCTIVE THROUGHPUT (GPU actually processing requests w/ economically
  meaningful efficiency)
  GPU resources comparatively expensive, high formal utilization/commitment rate does NOT
  automatically guarantee economically meaningful, actually productive use
  rent/buy/sharing models must be explicitly compared quantitatively by ACTUAL THROUGHPUT,
  not formal capacity metrics
FORMAL CAPACITY COMMITMENT ("GPU instance reserved/occupied 90% of time") = easily measurable
  but economically INSUFFICIENT metric
  says nothing about whether committed capacity is ACTUALLY productively used
  GPU CAN be formally fully committed while actually spending substantial share of that time
  waiting on input data, inefficiently batch-processing, or reserved for requests actually
  arriving rarely
ACTUALLY RELEVANT, economic yardstick = productive throughput
  (actually processed inference requests per time unit relative to actual cost)
  SAME methodological distinction between formal existence and actual effectiveness already
  seen repeatedly in this curriculum (formal security control vs actual effectiveness),
  here directly applied to GPU resources
RENT vs BUY vs SHARING comparison (on-demand w/o long-term commitment, own long-term-committed
  hardware, multiple workloads sharing same GPU capacity -- MIG/MPS partitioning KB-0416)
  must happen via ACTUAL, productive throughput per cost unit, NOT formal per-instance-hour price
  buy model w/ lower formal hourly cost -> CAN perform economically WORSE than rent model
  w/ higher formal hourly cost, IF purchased hardware actually productively utilized only
  a fraction of time, while rented, elastically-scaling capacity actually operates closer to
  continuously productive utilization
CONNECTS DIRECTLY to KB-0439 inference capacity planning
  load profile w/ strongly fluctuating, unpredictable demand -> rather justifies elastic
  rent/sharing model
  load profile w/ consistently high, predictable demand -> rather can economically justify
  buy model
  RIGHT choice depends on ACTUAL MATCH between load profile and procurement model,
  not a blanket "cheaper" model
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Formale Kapazitätsbindung | zeigt Reservierungs-/Belegungsgrad | unzureichend als alleiniger wirtschaftlicher Maßstab |
| Produktiver Durchsatz | tatsächlich verarbeitete Anfragen pro Kosteneinheit | tatsächlich relevanter, wirtschaftlicher Maßstab |
| Miet-/Kauf-/Sharing-Vergleich | wirtschaftlicher Vergleich der Beschaffungsmodelle | muss anhand Durchsatz, nicht Stundenpreis, erfolgen |
| Lastprofil-Modell-Passung | Übereinstimmung zwischen Nachfragemuster und Beschaffungsmodell | bestimmt tatsächlich wirtschaftlich optimale Wahl |

Implementierung: GPU-Kosten werden nicht anhand formaler Instanzstundenpreise, sondern anhand tatsächlichen, produktiven Durchsatzes pro Kosteneinheit bewertet. Miet-, Kauf- und Sharingmodelle werden quantitativ anhand dieser Durchsatzkennzahl verglichen, unter Berücksichtigung des tatsächlichen Lastprofils. Kapazitätsbindungskennzahlen werden explizit von Durchsatzkennzahlen unterschieden, statt beide zu vermischen.

## Scalability, Reliability, Security und Observability

GPU Economics skaliert die tatsächliche, wirtschaftliche Effizienz von GPU-Investitionen proportional zur Konsequenz, mit der Beschaffungsentscheidungen anhand tatsächlichen, produktiven Durchsatzes statt formaler Kapazitätsbindung getroffen werden; die Reliability-Grenze liegt darin, dass eine hohe formale Bindungsrate eine tatsächlich ineffiziente, wirtschaftlich ungerechtfertigte GPU-Nutzung verdecken kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine formal hoch ausgelastete GPU-Kapazität erzeugt dennoch enttäuschende wirtschaftliche Ergebnisse | die formale Bindungsrate wurde als wirtschaftlicher Maßstab verwendet, ohne den tatsächlichen, produktiven Durchsatz zu prüfen | den tatsächlichen, produktiven Durchsatz pro Kosteneinheit statt der formalen Bindungsrate bewerten |
| ein gekauftes GPU-System schneidet wirtschaftlich schlechter ab als ursprünglich erwartet | die Kaufentscheidung wurde anhand formaler Stundenkostenvergleiche statt tatsächlichen Lastprofils getroffen | das tatsächliche Lastprofil gegen das gewählte Beschaffungsmodell abgleichen |
| ein Sharingmodell erzeugt unerwartet geringen produktiven Durchsatz trotz formal hoher Auslastung | mehrere Workloads teilen sich die GPU-Kapazität ineffizient, ohne tatsächlich produktiv zu skalieren | die tatsächliche, kombinierte Durchsatzeffizienz des Sharingmodells gegenüber dedizierter Kapazität prüfen |

Security: GPU-Sharingmodelle sollten mit angemessener Isolation zwischen Workloads kombiniert werden, um Sicherheitsrisiken durch geteilte Ressourcen zu vermeiden, siehe die bereits in Domain 17 behandelten Isolationsmechanismen. Observability: Die tatsächliche, kontinuierlich gemessene Durchsatz-pro-Kosten-Kennzahl über die Zeit ist ein zentrales Signal zur Bewertung, ob die gewählte GPU-Beschaffungsstrategie tatsächlich wirtschaftlich optimal ist.

## Trade-offs und Entscheidungen

**Staff** berechnet den tatsächlichen, produktiven Durchsatz für eine gegebene GPU-Kapazität korrekt. **Principal** entwirft die vollständige GPU-Economics-Bewertung mit Miet-/Kauf-/Sharing-Vergleich für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für GPU-Beschaffungsentscheidungen fest, die tatsächlichen Durchsatz statt formaler Kapazitätsbindung verbindlich zur Grundlage machen.

Anti-Patterns: GPU-Beschaffungsentscheidungen anhand formaler Stundenkostenvergleiche statt tatsächlichen, produktiven Durchsatzes treffen; eine hohe formale Kapazitätsbindungsrate unreflektiert als wirtschaftlich effizient interpretieren; ein Beschaffungsmodell ohne Abgleich mit dem tatsächlichen Lastprofil wählen.

## Production Checklist

- [ ] GPU-Kosten werden anhand tatsächlichen, produktiven Durchsatzes pro Kosteneinheit bewertet, nicht anhand formaler Instanzstundenpreise.
- [ ] Miet-, Kauf- und Sharingmodelle werden quantitativ anhand dieser Durchsatzkennzahl verglichen.
- [ ] Die Beschaffungsentscheidung ist explizit gegen das tatsächliche Lastprofil abgeglichen.
- [ ] Formale Kapazitätsbindung und tatsächlicher, produktiver Durchsatz werden getrennt gemessen und berichtet.

## Interviewfragen

### 1. Warum reicht eine hohe formale GPU-Kapazitätsbindungsrate nicht als wirtschaftlicher Erfolgsnachweis aus?

**Antwort:** Weil sie nichts darüber aussagt, ob die gebundene Kapazität tatsächlich produktiv genutzt wird — eine GPU kann formal vollständig gebunden sein, während sie tatsächlich ineffizient oder ungenutzt bleibt.

### 2. Welcher Maßstab ist für den wirtschaftlichen Vergleich von GPU-Beschaffungsmodellen tatsächlich relevant?

**Antwort:** Der tatsächliche, produktive Durchsatz (etwa tatsächlich verarbeitete Anfragen pro Zeiteinheit) relativ zu den tatsächlichen Kosten, nicht der formale Preis pro Instanzstunde.

### 3. Warum kann ein Kaufmodell mit niedrigeren formalen Stundenkosten wirtschaftlich schlechter abschneiden als ein Mietmodell?

**Antwort:** Wenn die gekaufte Hardware tatsächlich nur einen Bruchteil der Zeit produktiv ausgelastet ist, während eine elastisch skalierende, gemietete Kapazität tatsächlich näher an durchgängig produktiver Auslastung betrieben wird.

### 4. Wovon hängt die wirtschaftlich richtige Wahl zwischen Miet-, Kauf- und Sharingmodell ab?

**Antwort:** Von der tatsächlichen Übereinstimmung zwischen dem Lastprofil (schwankend oder konstant) und dem gewählten Beschaffungsmodell, nicht von einem pauschal "günstigeren" Modell.

### 5. Wie gehst du vor, wenn eine formal hoch ausgelastete GPU-Kapazität dennoch enttäuschende wirtschaftliche Ergebnisse erzeugt?

**Antwort:** Ich prüfe den tatsächlichen, produktiven Durchsatz pro Kosteneinheit statt der formalen Bindungsrate, um festzustellen, ob die Kapazität tatsächlich effizient genutzt wird.

### 6. Widersprüchliche Anforderung: Das Finanzteam will langfristig günstigere, gekaufte GPU-Kapazität UND das Engineering-Team hat ein stark schwankendes, unvorhersehbares Lastprofil — wie gehst du vor?

**Antwort:** Ich würde das tatsächliche Lastprofil gegen die formalen Kostenvorteile eines Kaufmodells abwägen und den tatsächlich zu erwartenden, produktiven Durchsatz beider Optionen quantitativ vergleichen, da ein schwankendes Lastprofil bei gekaufter, statischer Kapazität häufig zu tatsächlich geringerer wirtschaftlicher Effizienz führt als ein elastisches Mietmodell, statt die Entscheidung allein anhand formaler Stundenkosten zu treffen.

## Praktische Labs

~~~python
# Local, deterministic simulation of distinguishing formal capacity commitment from actual productive throughput (executed locally, no real GPU cost tool):

def evaluate_gpu_economics(hours_committed, hours_total, requests_processed, cost_total):
    formal_commitment_rate = hours_committed / hours_total
    actual_throughput_per_cost = requests_processed / cost_total
    return {"formal_commitment_rate": round(formal_commitment_rate, 2), "actual_throughput_per_cost_unit": round(actual_throughput_per_cost, 4)}

print(evaluate_gpu_economics(hours_committed=90, hours_total=100, requests_processed=5000, cost_total=9000))
~~~

## Dependencies, Cross-References und Quellen

1. FinOps Foundation: [FinOps for AI and GPU Cost Management](https://www.finops.org/framework/scopes/ai-and-machine-learning/), abgerufen 2026-09-18.
2. NVIDIA-Dokumentation: [GPU Utilization and Efficiency Metrics for AI Workloads](https://docs.nvidia.com/datacenter/dcgm/latest/index.html), abgerufen 2026-09-18.

Cloud Unit Economics ist kanonisch in [KB-0638](04-cloud-unit-economics.md) behandelt; Inferenzkapazität und Lastprofile in [KB-0439](../17-gpu-inference/27-inferenzkapazitaet-und-lastprofile.md); MIG und MPS in [KB-0416](../17-gpu-inference/04-mig-und-mps.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche GPU-Durchsatzoptimierung durch dynamisches Batching und Workload-Konsolidierung zur Erhöhung des tatsächlich produktiven Durchsatzes | Evaluating | Als ergänzende, technische Effizienzsteigerung prüfen, jedoch die grundlegende Beschaffungsmodell-Entscheidung weiterhin anhand des tatsächlichen, gemessenen Lastprofils treffen, statt sich allein auf automatisierte Optimierung zu verlassen. |

Ein Team akzeptiert eine GPU-Beschaffungsentscheidung erst, wenn Miet-, Kauf- und Sharingmodelle nachweislich anhand tatsächlichen, produktiven Durchsatzes statt formaler Kapazitätsbindung quantitativ verglichen wurden.
