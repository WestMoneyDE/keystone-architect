---
{"id": "KB-0216", "title": "Storage-Performance und Benchmarks", "domain": "09", "sequence": 22, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "CLOUD"], "requires": [{"id": "KB-0209", "concepts": ["Block Storage", "IOPS"], "needed_for": "understanding"}], "related": ["KB-0215"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Modell für Tail-Latency-Messung (p50 vs. p99) bei variierender Queue Depth lokal implementieren.", "rationale": "Der Unterschied zwischen Durchschnittslatenz und Tail Latency wird erst durch konkrete Perzentil-Berechnung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein repräsentatives Benchmark-Szenario (Blockgröße, Queue Depth, Working Set) für einen konkreten Produktions-Workload begründet gestalten.", "rationale": "Ein unrepräsentativer Benchmark liefert Zahlen, die für die reale Workload irrelevant oder irreführend sind."}, "STAFF-TARGET": {"active": true, "scope": "Eine gute Durchschnittslatenz trotz schlechter Nutzererfahrung auf hohe Tail Latency statt auf ein Messfehler zurückführen können.", "rationale": "Durchschnittswerte verbergen systematisch seltene, aber für Nutzer spürbare Latenzspitzen."}, "CHIEF-TARGET": {"active": true, "scope": "Storage-Benchmarking als Werkzeug zur Kapazitätsplanung für den tatsächlichen Workload positionieren, nicht als generischen Hersteller-Vergleichswert.", "rationale": "Herstellerbenchmarks nutzen oft unrepräsentative synthetische Lasten, die nicht auf den eigenen Workload übertragbar sind."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Werkzeugspezifische Benchmark-Tool-Konfiguration (z. B. fio-Parameter) ist Vertiefung.", "rationale": "Kern ist das Verständnis von Queue Depth, Blockgröße, Working Set und Tail Latency als Messdimensionen, nicht die Werkzeugbedienung."}}, "lab_validation": [{"lab_id": "KB-0216-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Perzentil-basierte Tail-Latency-Berechnung aus einer Latenzverteilung", "evidence": "Eine Latenzverteilung mit niedrigem Durchschnitt kann trotzdem ein hohes p99-Perzentil aufweisen, das für Nutzererfahrung relevanter ist als der Durchschnitt.", "limitations": "Kein echtes Speichergerät, keine reale I/O-Last, keine Produktion."}]}
---
# Storage-Performance und Benchmarks

> **Ziel:** Storage-Performance wird nicht durch einen einzelnen Durchsatzwert beschrieben, sondern durch das Zusammenspiel von IOPS, Durchsatz und Tail Latency (insbesondere p99), gemessen unter repräsentativer Queue Depth, Blockgröße und Working Set für den tatsächlichen Workload. Ein generischer Herstellerbenchmark mit unrepräsentativen Parametern liefert Zahlen, die für die reale Anwendung irrelevant oder irreführend sein können.

## Zweck, Mental Model und Dependencies

IOPS (I/O-Operationen pro Sekunde) und Durchsatz (Datenmenge pro Sekunde) beschreiben unterschiedliche Aspekte der Speicherleistung — viele kleine I/O-Operationen können das IOPS-Limit erreichen, lange bevor das Durchsatzlimit erreicht ist, und umgekehrt können wenige große Operationen das Durchsatzlimit erreichen, ohne das IOPS-Limit auszureizen. Tail Latency (typischerweise p99 oder p999, also das 99. oder 99,9. Perzentil der Latenzverteilung) ist oft wichtiger für die Nutzererfahrung als die Durchschnittslatenz, weil ein System mit vielen parallelen Anfragen bei jeder einzelnen Anfrage dem Risiko einer Tail-Latency-Spitze ausgesetzt ist — bei genügend paralleler Last erlebt praktisch jeder Nutzer irgendwann eine langsame Anfrage. Queue Depth (Anzahl gleichzeitig ausstehender I/O-Anfragen), Blockgröße und Working Set (Datenmenge, die tatsächlich aktiv gelesen/geschrieben wird, relevant für Cache-Effekte) müssen repräsentativ für den realen Workload gewählt werden — ein Benchmark mit falscher Queue Depth oder Blockgröße liefert Zahlen, die für die eigene Anwendung nicht aussagekräftig sind. Lies [KB-0209](15-block-storage.md).

~~~text
Average latency:  hides tail spikes -> "looks fine" on paper
p99 latency:       1 in 100 requests is this slow or slower -> at high concurrency, MOST users hit a tail event eventually
Benchmark with wrong queue depth / block size / working set = numbers that don't predict real workload behavior
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Repräsentative Blockgröße | entspricht die Benchmark-Blockgröße den tatsächlichen I/O-Operationen des Workloads? | Benchmark mit großen sequenziellen Blöcken für einen Workload mit kleinen zufälligen Zugriffen irreführend |
| Repräsentative Queue Depth | entspricht die Benchmark-Parallelität der tatsächlichen Anwendungslast? | niedrige Queue Depth im Benchmark verbirgt Kontention, die bei realer paralleler Last auftritt |
| Working-Set-Größe | ist der Working Set groß genug, um Cache-Effekte nicht künstlich zu verbessern? | zu kleiner Working Set passt vollständig in den Cache, Benchmark zeigt unrealistisch gute Zahlen |
| Tail-Latency-Messung | wird p99/p999 gemessen, nicht nur Durchschnitt oder Median? | Durchschnittswerte verbergen seltene, aber für Nutzer spürbare Latenzspitzen |

Implementierung: Benchmark-Parameter (Blockgröße, Queue Depth, Working Set) werden aus tatsächlichen Produktions-I/O-Mustern abgeleitet (z. B. durch Analyse realer I/O-Traces), nicht aus Standardwerten eines Benchmark-Tools übernommen. Latenzmessung erfasst immer die vollständige Verteilung (nicht nur Durchschnitt), mit explizitem Fokus auf p99 und höhere Perzentile, da diese die Nutzererfahrung bei hoher paralleler Last besser vorhersagen. Working-Set-Größe wird bewusst größer als der verfügbare Cache gewählt, wenn das reale Zugriffsmuster ebenfalls über den Cache hinausgeht, um realistische Cache-Miss-Raten im Benchmark abzubilden.

## Scalability, Reliability, Security und Observability

Storage-Performance-Charakteristik ändert sich oft nichtlinear mit steigender Queue Depth — bis zu einem bestimmten Punkt verbessert höhere Parallelität den Durchsatz, danach steigt die Latenz überproportional durch Warteschlangeneffekte, ohne dass der Durchsatz noch signifikant zunimmt. Reliability-Grenze: ein System, das im Benchmark mit unrepräsentativen Parametern gut abschneidet, kann in Produktion unter realer Last unerwartet schlecht performen, was oft erst nach Produktivsetzung als Problem erkannt wird.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| gute Durchschnittslatenz im Monitoring, aber Nutzer berichten spürbare Verzögerungen | hohe Tail Latency (p99/p999) wird durch Durchschnittsbetrachtung verdeckt | Latenzverteilung nach Perzentilen aufschlüsseln, nicht nur Durchschnitt betrachten |
| Benchmark-Ergebnisse stimmen nicht mit Produktionsverhalten überein | Benchmark-Parameter (Blockgröße, Queue Depth, Working Set) waren nicht repräsentativ für den realen Workload | reale I/O-Muster aus Produktions-Traces gegen die verwendeten Benchmark-Parameter vergleichen |
| Durchsatz steigt bei höherer Parallelität nicht mehr, Latenz aber schon | Queue-Depth-Grenze des Speichersystems erreicht, Warteschlangeneffekte dominieren | Latenz- und Durchsatzverlauf über steigende Queue Depth grafisch analysieren, Sättigungspunkt identifizieren |
| Benchmark zeigt unrealistisch gute Ergebnisse gegenüber Produktion | Working Set im Benchmark war kleiner als in Produktion und passte vollständig in den Cache | Working-Set-Größe im Benchmark gegen tatsächliche Produktionsdatenmenge und Cache-Kapazität vergleichen |

Security: Performance-Benchmarks sollten nicht auf Produktionssystemen mit echten sensiblen Daten durchgeführt werden, ohne die Auswirkungen auf reale Nutzer zu isolieren — dedizierte Testumgebungen mit repräsentativen, aber nicht sensiblen Daten sind vorzuziehen. Observability: vollständige Latenzverteilungen (nicht nur Durchschnitt), IOPS/Durchsatz über Zeit und Queue-Depth-Sättigungspunkte sind zentrale Metriken für kontinuierliches Storage-Performance-Monitoring, nicht nur einmalige Benchmark-Ergebnisse.

## Trade-offs und Entscheidungen

**Staff** leitet Benchmark-Parameter aus tatsächlichen Produktions-I/O-Mustern ab, nicht aus Standardwerten. **Principal** macht Tail-Latency-Metriken (nicht nur Durchschnitt) für das Team im Monitoring sichtbar. **Chief** positioniert Benchmarking als Werkzeug zur Kapazitätsplanung für den tatsächlichen Workload, nicht als generischen Hersteller-Vergleichswert.

Anti-Patterns: Herstellerbenchmarks mit unbekannten, möglicherweise unrepräsentativen Parametern unkritisch für Kapazitätsentscheidungen übernehmen; nur Durchschnittslatenz messen und Tail Latency ignorieren; Working Set im Benchmark kleiner als in Produktion wählen und dadurch unrealistisch gute Cache-Effekte erzeugen.

## Production Checklist

- [ ] Benchmark-Parameter (Blockgröße, Queue Depth, Working Set) sind aus realen Produktions-I/O-Mustern abgeleitet.
- [ ] Latenzmessung erfasst die vollständige Verteilung, mit explizitem Fokus auf p99/p999.
- [ ] Working Set im Benchmark ist repräsentativ für die tatsächliche Produktionsdatenmenge relativ zur Cache-Kapazität.
- [ ] Queue-Depth-Sättigungspunkt ist bekannt und im Kapazitätsplan berücksichtigt.

## Interviewfragen

### 1. Warum ist Tail Latency (p99) oft aussagekräftiger für Nutzererfahrung als Durchschnittslatenz?

**Antwort:** Bei vielen parallelen Anfragen ist praktisch jeder Nutzer irgendwann von einer Latenzspitze betroffen, auch wenn diese nur einen kleinen Anteil aller Anfragen ausmacht; die Durchschnittslatenz verbirgt diese seltenen, aber spürbaren Spitzen.

### 2. Was ist der Unterschied zwischen IOPS und Durchsatz, und warum reicht ein einzelner Wert nicht aus?

**Antwort:** IOPS misst die Anzahl der I/O-Operationen pro Sekunde, Durchsatz misst die übertragene Datenmenge pro Sekunde — viele kleine Operationen können das IOPS-Limit erreichen, bevor das Durchsatzlimit erreicht ist, und umgekehrt; beide Grenzen müssen unabhängig geprüft werden.

### 3. Warum kann ein Benchmark mit kleinem Working Set unrealistisch gute Ergebnisse liefern?

**Antwort:** Wenn der Working Set vollständig in den verfügbaren Cache passt, werden die meisten Zugriffe aus dem Cache statt vom tatsächlichen Speichermedium bedient — das verbirgt die reale Speicherlatenz, die bei einem größeren, cache-übersteigenden Produktions-Working-Set sichtbar würde.

### 4. Wie diagnostizierst du eine Diskrepanz zwischen guten Benchmark-Ergebnissen und schlechter Produktionsperformance?

**Antwort:** Ich vergleiche die im Benchmark verwendeten Parameter (Blockgröße, Queue Depth, Working Set) mit den tatsächlichen Produktions-I/O-Mustern — häufig liegt die Ursache in unrepräsentativen Benchmark-Parametern, nicht in einem Fehler des Speichersystems selbst.

### 5. Warum ist der Queue-Depth-Sättigungspunkt eine wichtige Kapazitätsplanungsgröße?

**Antwort:** Bis zu einem bestimmten Punkt verbessert höhere Parallelität den Durchsatz; danach steigt die Latenz überproportional durch Warteschlangeneffekte, ohne dass der Durchsatz noch signifikant zunimmt — Kapazitätsplanung muss diesen Sättigungspunkt kennen, um Überlastung zu vermeiden.

### 6. Widersprüchliche Anforderung: Team will einen einzelnen, einfachen Benchmark-Wert für Management-Reporting UND eine vollständige, differenzierte Performance-Charakterisierung für technische Entscheidungen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass ein einzelner Wert (z. B. durchschnittlicher Durchsatz) für technische Entscheidungen unzureichend ist, weil er Tail-Latency- und Queue-Depth-Effekte verbirgt; ich würde einen einfachen zusammenfassenden Wert für Management-Reporting bereitstellen, aber die vollständige Perzentil- und Sättigungsanalyse als zugrunde liegende technische Dokumentation parallel führen, statt eine Vereinfachung als vollständige Charakterisierung auszugeben.

## Praktische Labs

~~~python
import random

random.seed(3)

def simulate_latencies(n, base_ms=2, tail_probability=0.02, tail_multiplier=30):
    latencies = []
    for _ in range(n):
        if random.random() < tail_probability:
            latencies.append(base_ms * tail_multiplier)  # rare tail event
        else:
            latencies.append(base_ms + random.uniform(-0.5, 0.5))
    return latencies

def percentile(data, p):
    sorted_data = sorted(data)
    idx = int(len(sorted_data) * p / 100)
    return sorted_data[min(idx, len(sorted_data) - 1)]

latencies = simulate_latencies(10000)
avg = sum(latencies) / len(latencies)
p50 = percentile(latencies, 50)
p99 = percentile(latencies, 99)

print(f"Average: {avg:.2f}ms, p50: {p50:.2f}ms, p99: {p99:.2f}ms")
assert p99 > avg * 5  # tail latency is dramatically worse than the average suggests
print("Average looks fine, but p99 reveals a tail latency problem the average completely hides.")
~~~

## Dependencies, Cross-References und Quellen

1. Dean, Barroso: [The Tail at Scale](https://cacm.acm.org/research/the-tail-at-scale/), Communications of the ACM, 2013, abgerufen 2026-09-17.
2. fio: [Flexible I/O Tester Documentation](https://fio.readthedocs.io/en/latest/fio_doc.html), abgerufen 2026-09-17.
3. AWS: [Amazon EBS Performance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-io-characteristics.html), abgerufen 2026-09-17.

Werkzeugspezifische Benchmark-Konfiguration (fio-Parameter, Cloud-Anbieter-Performance-Dokumentation) vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Kontinuierliches Produktions-Latenz-Profiling statt einmaliger Vorab-Benchmarks | Adopting | Einmalige Benchmarks durch fortlaufendes Monitoring der realen Perzentilverteilung ergänzen. |
| Automatisierte I/O-Trace-Replay-Tools zur Erzeugung repräsentativer Benchmark-Lasten aus echten Produktionsdaten | Adopting | Für kritische Systeme gegenüber synthetischen Standardlasten bevorzugen. |

Ein Team akzeptiert eine Storage-Performance-Bewertung erst, wenn Benchmark-Parameter nachweisbar aus realen Produktionsmustern abgeleitet und Tail-Latency-Perzentile dokumentiert sind.
