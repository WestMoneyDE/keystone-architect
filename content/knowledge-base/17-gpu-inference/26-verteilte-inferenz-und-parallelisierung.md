---
{"id": "KB-0438", "title": "Verteilte Inferenz und Parallelisierung", "domain": "17", "sequence": 26, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "GENAI", "MLOPS"], "requires": [{"id": "KB-0415", "concepts": ["VRAM und Speicherbudgets"], "needed_for": "understanding"}, {"id": "KB-0434", "concepts": ["NVLink und NVSwitch"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Tensor-, Pipeline- und Expert-Parallelität anhand ihrer jeweiligen Kommunikationsmuster unterscheiden können und erklären, warum ein Modell, das nicht in den VRAM einer einzelnen GPU passt, eine Form der Parallelisierung benötigt.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Parallelisierungsstrategie (oder Kombination mehrerer Formen) für ein konkretes Modell begründet wählen, basierend auf dessen Größe, Architektur (z. B. Mixture-of-Experts) und den verfügbaren Kommunikationsverbindungen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Leistungseinbuße bei verteilter Inferenz auf eine ungünstige Kombination aus Parallelisierungsform und tatsächlicher Verbindungstopologie zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Parallelisierungs- und Hardwarebeschaffungsentscheidungen für große Modelle im Unternehmen anhand des tatsächlichen Kommunikationsbedarfs jeder Parallelitätsform statt anhand pauschaler Standardkonfigurationen treffen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung spezifischer Parallelisierungs-Frameworks (z. B. Megatron-Kernel-Details) im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der Kommunikationsmuster und Platzierungs-Trade-offs als Entscheidungsgrundlage, nicht die Framework-Interna."}}, "lab_validation": [{"lab_id": "KB-0438-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand von Forschungsveröffentlichungen und offizieller Framework-Dokumentation, kein aktives Multi-GPU-System verwendet", "evidence": "Anhand von Forschungsveröffentlichungen zu Megatron-LM (Tensor-/Pipeline-Parallelität) und Mixture-of-Experts-Architekturen (Expert-Parallelität) wird nachvollzogen, wie sich die drei Parallelitätsformen in ihrem Kommunikationsmuster (häufig/klein bei Tensor-Parallelität, selten/groß bei Pipeline-Parallelität, Routing-abhängig bei Expert-Parallelität) unterscheiden und wie diese Unterschiede die jeweils sinnvolle Platzierung auf verbundene GPUs beeinflussen.", "limitations": "Kein reales Multi-GPU-System getestet, keine realen Durchsatz- oder Latenzmessungen für konkrete Parallelisierungskonfigurationen erhoben."}]}
---
# Verteilte Inferenz und Parallelisierung

> **Ziel:** Wenn ein Modell nicht vollständig in den VRAM einer einzelnen GPU passt (siehe VRAM-Budgetierung, [KB-0415](03-vram-und-speicherbudgets.md)) oder eine einzelne GPU für den gewünschten Durchsatz nicht ausreicht, muss die Modellausführung über mehrere GPUs verteilt werden — Tensor-Parallelität (Aufteilung einzelner Rechenoperationen, z. B. Matrixmultiplikationen, über mehrere GPUs), Pipeline-Parallelität (Aufteilung der Modellschichten in aufeinanderfolgende Stufen auf unterschiedlichen GPUs) und Expert-Parallelität (bei Mixture-of-Experts-Architekturen: Verteilung unterschiedlicher Experten auf unterschiedliche GPUs) sind die drei grundlegenden Formen dieser Verteilung. Der zentrale Punkt dieses Kapitels ist, dass diese drei Formen fundamental unterschiedliche Kommunikationsmuster erzeugen — Tensor-Parallelität erfordert häufige, aber vergleichsweise kleine Kommunikation zwischen den beteiligten GPUs, Pipeline-Parallelität seltenere, aber größere Übergaben zwischen Pipeline-Stufen, und Expert-Parallelität ein von der tatsächlichen Routing-Entscheidung abhängiges, ungleichmäßiges Kommunikationsmuster — was jeweils unterschiedliche Anforderungen an die physische Verbindungstopologie (siehe NVLink/NVSwitch, [KB-0434](22-nvlink-und-nvswitch.md)) stellt und in der Praxis häufig kombiniert eingesetzt wird.

## Zweck, Mental Model und Dependencies

Tensor-Parallelität teilt eine einzelne Rechenoperation (z. B. eine große Matrixmultiplikation innerhalb einer Schicht) so auf, dass jede beteiligte GPU einen Teil der Berechnung übernimmt und die Teilergebnisse anschließend zwischen den GPUs zusammengeführt werden müssen — dies erzeugt sehr häufige, aber pro Kommunikationsvorgang vergleichsweise kleine Datenübertragungen zwischen den beteiligten GPUs, weshalb Tensor-Parallelität besonders von einer direkten, hochbandbreitigen Verbindung (NVLink/NVSwitch) zwischen den beteiligten GPUs profitiert und bei einer langsameren Verbindung (z. B. über mehrere Nodes hinweg) tendenziell schlecht skaliert. Pipeline-Parallelität teilt stattdessen die aufeinanderfolgenden Schichten des Modells in Stufen auf, wobei jede Stufe auf einer eigenen GPU (oder Gruppe von GPUs) läuft und die Zwischenergebnisse einer Stufe an die nächste Stufe übergeben werden — diese Übergaben sind seltener (nur zwischen den Stufengrenzen), aber pro Übergabe potenziell umfangreicher, was Pipeline-Parallelität toleranter gegenüber einer langsameren Inter-Node-Verbindung macht als Tensor-Parallelität, jedoch mit dem Nachteil potenzieller Leerlaufzeiten (Pipeline-Bubbles), wenn nicht alle Stufen gleichmäßig ausgelastet sind. Expert-Parallelität ist spezifisch für Mixture-of-Experts-Architekturen relevant, bei denen für jede Eingabe nur eine Teilmenge der insgesamt verfügbaren "Experten" (spezialisierte Teilnetzwerke) aktiviert wird — die Experten werden auf unterschiedliche GPUs verteilt, und das tatsächliche Kommunikationsmuster hängt von der Routing-Entscheidung ab (welche Eingaben zu welchen Experten geleitet werden), was zu einem ungleichmäßigen, workload-abhängigen Kommunikationsbedarf führt. Der zentrale methodische Punkt ist, dass diese drei Formen häufig kombiniert werden (z. B. Tensor-Parallelität innerhalb eines Nodes mit hochbandbreitiger NVLink-Verbindung, Pipeline-Parallelität über mehrere, langsamer verbundene Nodes hinweg), und die konkrete Kombination anhand der tatsächlichen Modellgröße, -architektur und der verfügbaren Verbindungstopologie begründet gewählt werden muss, statt eine einzelne Parallelitätsform pauschal auf jedes Modell anzuwenden.

~~~text
Tensor parallelism: splits a SINGLE compute op (e.g. matmul) across GPUs
  -> FREQUENT, small communication between GPUs -> needs high-bandwidth direct link (NVLink)
  -> scales poorly over slower inter-node connections
Pipeline parallelism: splits model LAYERS into sequential stages, each on its own GPU(s)
  -> INFREQUENT but LARGER handoffs between stage boundaries -> more tolerant of slower inter-node links
  -> downside: pipeline bubbles (idle time) if stages aren't evenly loaded
Expert parallelism (Mixture-of-Experts): experts distributed across GPUs
  -> communication pattern depends on ROUTING decision -> uneven, workload-dependent
KEY METHODOLOGICAL POINT: forms are commonly COMBINED
  (e.g. tensor parallelism within a high-bandwidth NVLink node, pipeline parallelism across slower-linked nodes)
  -> concrete combination must be justified by ACTUAL model size/architecture + available topology
     never apply a single form uniformly by default
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Kommunikationsmuster |
|---|---|---|
| Tensor-Parallelität | teilt einzelne Rechenoperationen über GPUs | häufig, klein — benötigt hochbandbreitige Direktverbindung (NVLink) |
| Pipeline-Parallelität | teilt Modellschichten in sequenzielle Stufen | selten, groß — toleranter gegenüber langsameren Inter-Node-Verbindungen |
| Expert-Parallelität | verteilt Mixture-of-Experts-Experten über GPUs | routing-abhängig, ungleichmäßig |
| Kombinierte Parallelisierung | nutzt mehrere Formen gemeinsam | muss zur tatsächlichen Verbindungstopologie und Modellarchitektur passen |

Implementierung: Für ein Modell, das nicht in den VRAM einer einzelnen GPU passt, wird zunächst geprüft, welche Kombination aus Tensor-, Pipeline- und gegebenenfalls Expert-Parallelität (bei Mixture-of-Experts-Architekturen) zur tatsächlichen Modellgröße und -architektur passt. Tensor-Parallelität wird bevorzugt innerhalb eines Nodes mit hochbandbreitiger NVLink/NVSwitch-Verbindung eingesetzt (siehe [KB-0434](22-nvlink-und-nvswitch.md)), während Pipeline-Parallelität für die Verteilung über mehrere, langsamer verbundene Nodes hinweg genutzt wird, um die Anforderungen an die Inter-Node-Bandbreite zu reduzieren. Bei Mixture-of-Experts-Architekturen wird die Expert-Verteilung anhand der erwarteten Routing-Verteilung geprüft, um eine übermäßig ungleichmäßige Auslastung einzelner GPUs (durch überproportional häufig genutzte Experten) zu vermeiden.

## Scalability, Reliability, Security und Observability

Verteilte Inferenz skaliert die Modellgröße und den potenziellen Durchsatz proportional zur Anzahl der eingesetzten GPUs und zur Passgenauigkeit der Parallelisierungsstrategie zur verfügbaren Verbindungstopologie; die Reliability-Grenze liegt darin, dass eine ungeeignete Kombination aus Parallelisierungsform und Verbindungstopologie (z. B. Tensor-Parallelität über eine langsame Inter-Node-Verbindung) proportional zur Kommunikationsintensität der gewählten Form zu erheblichen, aber schwer diagnostizierbaren Leistungseinbußen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| verteilte Inferenz zeigt trotz zusätzlicher GPUs kaum verbesserten Durchsatz | Tensor-Parallelität wird über eine langsame Inter-Node-Verbindung statt innerhalb eines hochbandbreitig verbundenen Nodes eingesetzt | die Kommunikationsform gegen die tatsächliche Verbindungstopologie prüfen und gegebenenfalls auf Pipeline-Parallelität für die Node-übergreifende Verteilung umstellen |
| bei Pipeline-Parallelität entstehen erhebliche Leerlaufzeiten (Bubbles) | die Pipeline-Stufen sind ungleichmäßig ausgelastet | die Aufteilung der Modellschichten auf die Pipeline-Stufen gegen deren tatsächliche Rechenlast neu balancieren |
| einzelne GPUs bei einer Mixture-of-Experts-Architektur sind deutlich stärker ausgelastet als andere | die tatsächliche Routing-Verteilung ist ungleichmäßiger als bei der Experten-Platzierung angenommen | die tatsächliche Routing-Verteilung messen und die Experten-Platzierung entsprechend anpassen |

Security: Bei verteilter Inferenz über mehrere, potenziell unterschiedlich vertrauenswürdige Infrastrukturbereiche hinweg sollte die Übertragung von Zwischenergebnissen (z. B. bei Pipeline-Parallelität) angemessen abgesichert werden. Observability: Die tatsächliche Kommunikationslatenz zwischen den beteiligten GPUs pro Parallelitätsform, die Auslastungsverteilung über Pipeline-Stufen oder Experten, und der Gesamtdurchsatz im Verhältnis zur GPU-Anzahl sind zentrale Metriken zur Bewertung der Parallelisierungsstrategie.

## Trade-offs und Entscheidungen

**Staff** wählt eine Parallelisierungsstrategie basierend auf der tatsächlichen Modellgröße, -architektur und der verfügbaren Verbindungstopologie, statt eine einzelne Form pauschal anzuwenden. **Principal** macht die Kommunikationsmuster und Platzierungsentscheidungen für das Team nachvollziehbar. **Chief** trifft Parallelisierungs- und Hardwarebeschaffungsentscheidungen für große Modelle im Unternehmen anhand des tatsächlichen Kommunikationsbedarfs jeder Parallelitätsform.

Anti-Patterns: Tensor-Parallelität über eine langsame Inter-Node-Verbindung einsetzen, ohne die Kommunikationsintensität dieser Form zu berücksichtigen; Pipeline-Stufen ohne Prüfung der tatsächlichen Lastverteilung ungleichmäßig aufteilen; bei Mixture-of-Experts-Architekturen die Experten-Platzierung ohne Berücksichtigung der tatsächlichen Routing-Verteilung pauschal gleichmäßig vornehmen.

## Production Checklist

- [ ] Die gewählte Parallelisierungsstrategie passt zur tatsächlichen Modellgröße, -architektur und verfügbaren Verbindungstopologie.
- [ ] Tensor-Parallelität wird bevorzugt innerhalb hochbandbreitig verbundener GPU-Gruppen eingesetzt.
- [ ] Pipeline-Stufen sind entsprechend ihrer tatsächlichen Rechenlast balanciert.
- [ ] Bei Mixture-of-Experts-Architekturen ist die Experten-Platzierung gegen die tatsächliche Routing-Verteilung geprüft.

## Interviewfragen

### 1. Was unterscheidet Tensor-Parallelität von Pipeline-Parallelität in ihrem Kommunikationsmuster?

**Antwort:** Tensor-Parallelität erzeugt häufige, aber kleine Kommunikation zwischen GPUs, während Pipeline-Parallelität seltenere, aber größere Übergaben zwischen aufeinanderfolgenden Modellstufen erzeugt.

### 2. Warum ist Tensor-Parallelität besonders von einer hochbandbreitigen Verbindung wie NVLink abhängig?

**Antwort:** Weil die häufige, kleinteilige Kommunikation zwischen den beteiligten GPUs bei einer langsameren Verbindung zu erheblichen Verzögerungen führt, die die Berechnung insgesamt ausbremsen.

### 3. Was ist Expert-Parallelität, und wodurch unterscheidet sich ihr Kommunikationsmuster von den anderen Formen?

**Antwort:** Sie verteilt bei Mixture-of-Experts-Architekturen unterschiedliche Experten auf unterschiedliche GPUs; das Kommunikationsmuster hängt von der tatsächlichen Routing-Entscheidung ab und ist daher ungleichmäßig und workload-abhängig.

### 4. Warum werden Parallelisierungsformen in der Praxis häufig kombiniert?

**Antwort:** Weil unterschiedliche Formen unterschiedliche Anforderungen an die Verbindungstopologie stellen — Tensor-Parallelität innerhalb eines hochbandbreitig verbundenen Nodes, Pipeline-Parallelität über mehrere, langsamer verbundene Nodes hinweg, um die jeweiligen Stärken der Verbindungstopologie optimal zu nutzen.

### 5. Wie gehst du vor, wenn verteilte Inferenz trotz zusätzlicher GPUs kaum verbesserten Durchsatz zeigt?

**Antwort:** Ich prüfe, ob eine kommunikationsintensive Parallelisierungsform (z. B. Tensor-Parallelität) über eine ungeeignete, langsame Verbindungstopologie eingesetzt wird, und passe die Kombination der Parallelisierungsformen entsprechend an.

### 6. Widersprüchliche Anforderung: Team will ein sehr großes Modell auf möglichst wenigen, kostengünstigen, über Standard-Ethernet verbundenen Nodes betreiben — wie gehst du vor?

**Antwort:** Ich würde Tensor-Parallelität auf die innerhalb eines Nodes verfügbaren, hochbandbreitig verbundenen GPUs beschränken und Pipeline-Parallelität für die Verteilung über die langsamer verbundenen Nodes einsetzen, da Pipeline-Parallelität toleranter gegenüber geringerer Inter-Node-Bandbreite ist, und den resultierenden Durchsatz gegen die Kostenersparnis abwägen.

## Praktische Labs

~~~python
# Conceptual communication-volume comparison across parallelism forms (not executed against real hardware):

def estimate_communication_volume(parallelism_type, num_layers, hidden_size, num_gpus):
    if parallelism_type == "tensor":
        # frequent, per-layer communication proportional to hidden size and GPU count
        return num_layers * hidden_size * (num_gpus - 1) * 2  # rough approximation
    elif parallelism_type == "pipeline":
        # infrequent, only at stage boundaries
        num_stages = num_gpus
        return (num_stages - 1) * hidden_size  # rough approximation, once per stage boundary
    else:
        raise ValueError("unknown parallelism type")

num_layers = 32
hidden_size = 4096
num_gpus = 8

tensor_volume = estimate_communication_volume("tensor", num_layers, hidden_size, num_gpus)
pipeline_volume = estimate_communication_volume("pipeline", num_layers, hidden_size, num_gpus)

print(f"Tensor parallelism estimated communication volume (relative units): {tensor_volume}")
print(f"Pipeline parallelism estimated communication volume (relative units): {pipeline_volume}")
~~~

## Dependencies, Cross-References und Quellen

1. Shoeybi et al. (2019): ["Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism"](https://arxiv.org/abs/1909.08053), abgerufen 2026-09-18.
2. Fedus et al. (2021): ["Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity"](https://arxiv.org/abs/2101.03961), abgerufen 2026-09-18.

VRAM und Speicherbudgets sind kanonisch in [KB-0415](03-vram-und-speicherbudgets.md) behandelt; NVLink und NVSwitch in [KB-0434](22-nvlink-und-nvswitch.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kostenmodellbasierte Auswahl optimaler Parallelisierungskombinationen für eine gegebene Modellarchitektur und Hardwaretopologie | Evaluating | Gegenüber manueller Konfiguration erst nach Prüfung der tatsächlichen Optimierungsqualität für konkrete Modelle und Hardware bevorzugen. |
| Dynamisches, lastabhängiges Expert-Rebalancing während des Betriebs von Mixture-of-Experts-Modellen | Evaluating | Gegenüber statischer Experten-Platzierung erst nach Prüfung der tatsächlichen Verbesserung bei ungleichmäßiger Routing-Verteilung bevorzugen. |

Ein Team akzeptiert eine Parallelisierungskonfiguration für ein großes Modell erst, wenn die gemessene Durchsatz-/Latenzleistung die zusätzliche Komplexität und die konkrete Verbindungstopologie-Abhängigkeit der gewählten Kombination nachweislich rechtfertigt.
